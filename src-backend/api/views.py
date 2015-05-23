from django.http import JsonResponse


def __parseVersion(versionString):
    return int(versionString[1:])


def versionTestView(request, version):
    return JsonResponse({'version': __parseVersion(version)})
