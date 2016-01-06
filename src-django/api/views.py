from django.http import HttpResponse, HttpResponseBadRequest
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
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
