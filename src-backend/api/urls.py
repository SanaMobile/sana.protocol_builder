from django.conf.urls import url, include
from views import ProcedureViewSet, PageViewSet, ElementViewSet
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'procedures', ProcedureViewSet, base_name='procedure')
router.register(r'pages', PageViewSet, base_name='page')
router.register(r'elements', ElementViewSet, base_name='element')

urlpatterns = [
    url(r'^', include(router.urls))
]
