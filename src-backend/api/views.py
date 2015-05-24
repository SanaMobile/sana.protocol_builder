from django.http import JsonResponse
from rest_framework import viewsets
from models import Procedure
from serializer import ProcedureSerializer


def __parseVersion(versionString):
    return int(versionString[1:])


def versionTestView(request, version):
    return JsonResponse({'version': __parseVersion(version)})


class ProcedureViewSet(viewsets.ModelViewSet):
    queryset = Procedure.objects.all()
    serializer_class = ProcedureSerializer
