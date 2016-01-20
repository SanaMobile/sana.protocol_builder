from django.conf.urls import url, include
from rest_framework import routers
from views import ProcedureViewSet, PageViewSet, ElementViewSet, ConceptViewSet
from startup import run_once


router = routers.SimpleRouter(trailing_slash=False)
router.register(r'procedures', ProcedureViewSet, base_name='procedure')
router.register(r'pages', PageViewSet, base_name='page')
router.register(r'elements', ElementViewSet, base_name='element')
router.register(r'concepts', ConceptViewSet, base_name='concept')

urlpatterns = [
    url(r'^', include(router.urls))
]


# ------------------------------------------------------------------------------
# Non-url related operations
#
# These must be run once on startup but need database access, otherwise they
# can be put in __init__.py or AppConfig.ready()
#
# See http://stackoverflow.com/a/16111968
#     https://docs.djangoproject.com/en/1.8/ref/applications/#django.apps.AppConfig.ready
# ------------------------------------------------------------------------------

run_once()
