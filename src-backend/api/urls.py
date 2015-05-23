from django.conf.urls import url

from views import versionTestView

urlpatterns = [
    url(r'^(v[0-9]+)/$', versionTestView),
]
