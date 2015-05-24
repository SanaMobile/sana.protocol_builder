from django.conf.urls import url, include
from views import ProcedureViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'procedures', ProcedureViewSet)

urlpatterns = [
    url(r'^', include(router.urls))
]
