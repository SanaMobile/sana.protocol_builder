from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from django.contrib.auth.models import User
from django.db.utils import DatabaseError
from postgres_copy import CopyMapping
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.cache import cache
from generator import ProtocolBuilder
from mailer import templater, tasks
import models
import json
import os
import serializer
import uuid


class ProcedureViewSet(viewsets.ModelViewSet):
    model = models.Procedure

    def get_queryset(self):
        user = self.request.user
        return models.Procedure.objects.filter(owner=user)

    def get_serializer_class(self):
        request_flag = 'only_return_id'
        if self.request.GET.get(request_flag) == 'true':
            return serializer.ProcedureSerializer
        return serializer.ProcedureDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @detail_route(methods=['get'])
    def generate(self, request, pk=None):
        try:
            protocol = ProtocolBuilder.generate(request.user, pk)
        except ValueError as e:
            return HttpResponseBadRequest(str(e))

        response = HttpResponse(protocol, content_type='application/xml')
        response['Content-Disposition'] = 'attachment; filename="procedure.xml"'

        return response


class UserViewSet(viewsets.ModelViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = serializer.UserSerializer
    allowed_changes = ['first_name', 'last_name', 'email', 'password']

    def json_msg(self, key, message):
        return json.dumps({key: [message]})

    @list_route(methods=['patch'])
    def update_details(self, request):
        if not request.body:
            return HttpResponseBadRequest(self.json_msg('all', "There was nothing submitted"))

        body = json.loads(request.body)
        user = User.objects.get(auth_token=body['auth'])

        if 'current-password' not in body:
            return HttpResponseBadRequest(self.json_msg('current-password', "No password provided"))

        if not user.check_password(body['current-password']):
            return HttpResponseBadRequest(self.json_msg('current-password', "The password provided isn't correct."))

        # Need to explicitly set password to have Django hash it
        if 'password' in body and body['password']:
            user.set_password(str(body['password']))
            body.pop('password', None)
            user.save()

        serializer = self.get_serializer(
            instance=user,
            data=body,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class UserPasswordViewSet(viewsets.GenericViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = serializer.UserSerializer
    authentication_classes = (())
    permission_classes = (())
    PASSWORD_RESET_EXPIRY = 86400*2  # 2 days

    @list_route(methods=['POST'])
    def reset_password(self, request):
        if not request.body:
            return HttpResponseBadRequest()

        body = json.loads(request.body)
        print(body)
        user = User.objects.get(email=body['email'])

        token_gen = PasswordResetTokenGenerator()
        token = token_gen.make_token(user)
        url_base = "https://sanaprotocolbuilder.me/"
        url = "{base}/account/reset_password?reset_token={token}".format(base=url_base, token=token)

        env = templater.get_environment('api', 'templates')
        template = env.get_template('password_reset_template')
        email = template.render(first_name=user.first_name, url=url)

        tasks.send_email.delay(user.email, 'Reset Your Password', email)

        cache.set(user.email, token, self.PASSWORD_RESET_EXPIRY)
        if cache.get(user.email) == token:
            return HttpResponse(status=status.HTTP_201_CREATED)
        else:
            return HttpResponseBadRequest()

    @list_route(methods=['POST'])
    def reset_password_complete(self, request):
        if not request.body:
            return HttpResponseBadRequest()

        body = json.loads(request.body)

        user = User.objects.get(email=body['email'])
        reset_token = body['password_reset_token']

        token = cache.get(user.email)

        if token is not None and reset_token == token:
            user.set_password(body['new_password1'])
            user.save()
            cache.delete(user.email)
            return HttpResponse(status=status.HTTP_200_OK)
        else:
            return HttpResponseBadRequest(
                self.json_msg('Email Token', "It seems the email token has expired. Please reset your password again")
            )


class PageViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.PageSerializer
    model = models.Page

    def get_queryset(self):
        user = self.request.user
        return models.Page.objects.filter(procedure__owner_id__exact=user.id)

    @list_route(methods=['PATCH'])
    def partial_bulk_update(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not request.body:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(
            instance=queryset,
            data=json.loads(request.body),
            many=True,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ElementViewSet(viewsets.ModelViewSet):
    model = models.Element
    serializer_class = serializer.ElementSerializer

    def get_queryset(self):
        user = self.request.user
        return models.Element.objects.filter(page__procedure__owner_id__exact=user.id)


class ConceptViewSet(viewsets.ModelViewSet):
    CSV_COLUMN_MAPPING = {
        "created": "created",
        "last_modified": "modified",
        "uuid": "uuid",
        "name": "name",
        "display_name": "display_name",
        "description": "description",
        "data_type": "datatype",
        "mime_type": "mimetype",
        "constraint": "constraint"
    }

    model = models.Concept
    queryset = models.Concept.objects.all()
    serializer_class = serializer.ConceptSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = (('name',))

    @list_route(methods=['POST'])
    def import_csv(self, request):
        if 'csv' not in request.FILES:
            return JsonResponse(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'success': False,
                    'errors': ["Missing 'csv' parameter"]
                }
            )

        csv = request.FILES['csv']

        file_path = "/tmp/{0}.csv".format(str(uuid.uuid4()))

        with open(file_path, 'wb+') as destination:
            for chunk in csv.chunks():
                destination.write(chunk)

        try:
            copy_mapping = CopyMapping(
                models.Concept,
                file_path,
                ConceptViewSet.CSV_COLUMN_MAPPING
            )
            copy_mapping.save()
        except (ValueError, DatabaseError):
            expected_columns = ', '.join(ConceptViewSet.CSV_COLUMN_MAPPING.keys())
            return JsonResponse(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'success': False,
                    'errors': ['CSV import error. Expected columns are {0}'.format(expected_columns)]
                }
            )
        finally:
            os.remove(file_path)

        return JsonResponse({
            'success': True,
        })


class ShowIfViewSet(viewsets.ModelViewSet):
    model = models.ShowIf
    serializer_class = serializer.ShowIfSerializer

    def get_queryset(self):
        user = self.request.user
        return models.ShowIf.objects.filter(page__procedure__owner_id__exact=user.id)
