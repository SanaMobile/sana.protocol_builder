from django.conf.urls import url, include
from rest_framework import routers
from startup import run_once
import views

router = routers.SimpleRouter(trailing_slash=False)
router.register(r'procedures', views.ProcedureViewSet, base_name='procedure')
router.register(r'pages', views.PageViewSet, base_name='page')
router.register(r'elements', views.ElementViewSet, base_name='element')
router.register(r'concepts', views.ConceptViewSet, base_name='concept')
router.register(r'conditionals', views.ShowIfViewSet, base_name='conditional')
router.register(r'users', views.UserViewSet, base_name='user')
router.register(r'passwords', views.UserPasswordViewSet, base_name='password')

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
