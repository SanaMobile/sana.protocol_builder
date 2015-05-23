from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework.authtoken import views as authTokenViews

from api import urls as apiUrls

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/',        include(admin.site.urls)),  # noqa
    url(r'^api/',          include(apiUrls)),
    url(r'^authenticate$', authTokenViews.obtain_auth_token),
)
