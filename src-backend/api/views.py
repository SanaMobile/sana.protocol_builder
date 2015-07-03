from django.http import HttpResponse, Http404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from generator import ProtocolBuilder
import models
import json
import serializer


class ProcedureViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.ProcedureSerializer
    model = models.Procedure

    def get_queryset(self):
        self.resource_name = 'procedure'  # ensures that unless we override resource_name it will exist

        user = self.request.user
        return models.Procedure.objects.filter(owner=user)

    @detail_route(methods=['get'])
    def generate(self, request, pk=None):
        try:
            protocol = ProtocolBuilder.generate(request.user, pk)
        except ValueError:
            raise Http404('Invalid Procedure')

        response = HttpResponse(protocol, content_type='application/xml')
        response['Content-Disposition'] = 'attachment; filename="procedure.xml"'

        return response


class PageViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.PageSerializer
    model = models.Page

    def get_queryset(self):
        user = self.request.user
        return models.Page.objects.filter(procedure__owner_id__exact=user.id)

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(PageViewSet, self).get_serializer(*args, **kwargs)

    @list_route(methods=["PATCH"])
    def partial_bulk_update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        queryset = self.filter_queryset(self.get_queryset)

        serializer = self.get_serializer(
            instance = queryset,
            data = json.loads(request.body),
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
