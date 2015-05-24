from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
import models
import serializer


class ProcedureViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.ProcedureSerializer
    model = models.Procedure

    def get_queryset(self):
        self.resource_name = 'procedure'
        user = self.request.user
        return models.Procedure.objects.filter(owner=user)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        self.resource_name = False

        procedure = get_object_or_404(queryset, pk=pk)
        serial_proc = serializer.ProcedureSerializer(procedure)
        page_serial = serializer.PageSerializer(procedure.pages.all(), many=True)

        data = {
            'procedure': serial_proc.data,
            'pages': page_serial.data
        }

        return Response(data)


class PageViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.PageSerializer
    model = models.Page

    def get_queryset(self):
        user = self.request.user
        return models.Page.objects.filter(procedure__owner_id__exact=user.id)
