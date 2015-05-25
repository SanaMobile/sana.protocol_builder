from django.conf.urls import url

from views import signup, login


urlpatterns = [
    url(r'^login', login),
    url(r'^signup', signup),
]
