from django.http import HttpResponse, HttpResponseBadRequest
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from django.contrib.auth.models import User
from generator import ProtocolBuilder
import models
import json
import serializer


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

    @detail_route(methods=['patch'])
    def update_details(self, request, pk=None):
        if pk is None or not request.body:
            return HttpResponseBadRequest()
        user = User.objects.get()

        body = json.loads(request.body)
        if not any([key in body for key in self.allowed_changes]):
            return HttpResponseBadRequest()

        serializer = self.get_serializer(
            instance=user,
            data=json.loads(request.body),
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


class ShowIfViewSet(viewsets.ModelViewSet):
    model = models.ShowIf
    serializer_class = serializer.ShowIfSerializer

    def get_queryset(self):
        user = self.request.user
        return models.ShowIf.objects.filter(page__procedure__owner_id__exact=user.id)
