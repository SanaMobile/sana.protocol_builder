from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
import models
import serializer


class ProcedureViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.ProcedureSerializer
    model = models.Procedure

    def get_queryset(self):
        self.resource_name = 'procedure'  # ensures that unless we override resource_name it will exist

        user = self.request.user
        return models.Procedure.objects.filter(owner=user)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()

        self.resource_name = False  # doesn't display the tag 'procedure' or 'procedures'

        procedure = get_object_or_404(queryset, pk=pk)
        pages = procedure.pages.all()
        elements = [element for page in pages for element in page.elements.all()]
        serial_proc = serializer.ProcedureSerializer(procedure)
        page_serial = serializer.PageSerializer(pages, many=True)
        data = {
            'procedure': serial_proc.data,
            'pages': page_serial.data
        }

        if elements:
            elem_serial = serializer.ElementSerializer(elements, many=True)
            data['elements'] = elem_serial.data

        return Response(data)


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
