from django.conf.urls import include, url
from django.contrib import admin

from api import urls as apiUrls
from authentication import urls as authUrls

admin.autodiscover()

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),  # noqa
    url(r'^api/',   include(apiUrls)),
    url(r'^auth/',  include(authUrls)),
]
