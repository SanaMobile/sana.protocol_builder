from django.conf.urls import patterns, include, url
from django.contrib import admin

from api import urls as apiUrls
from registration import urls as authUrls

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),  # noqa
    url(r'^api/',   include(apiUrls)),
    url(r'^auth/',  include(authUrls)),
)
