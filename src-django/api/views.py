from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from django.contrib.auth.models import User
from generator import ProtocolBuilder
from postgres_copy import CopyMapping
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
    model = models.Concept
    serializer_class = serializer.ConceptSerializer

    def get_queryset(self):
        return models.Concept.objects

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
                dict(
                    created="created",
                    last_modified="modified",
                    uuid="uuid",
                    name="name",
                    display_name="display_name",
                    description="description",
                    data_type="datatype",
                    mime_type="mimetype",
                    constraint="constraint"
                )
            )
            copy_mapping.save()
        except Exception as e:
            return JsonResponse(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                data={
                    'success': False,
                    'errors': [str(e)]
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
