from django.conf.urls import url, include
from views import ProcedureViewSet, PageViewSet
from rest_framework import routers

router = routers.SimpleRouter(trailing_slash=False)

router.register(r'procedures', ProcedureViewSet, base_name='procedure')
router.register(r'pages', PageViewSet, base_name='page')

urlpatterns = [
    url(r'^', include(router.urls))
]
