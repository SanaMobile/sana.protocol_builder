from django.http import HttpResponse, Http404
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from generator import ProtocolBuilder
import models
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


class ElementViewSet(viewsets.ModelViewSet):
    model = models.Element
    serializer_class = serializer.ElementSerializer

    def get_queryset(self):
        user = self.request.user
        return models.Element.objects.filter(page__procedure__owner_id__exact=user.id)
