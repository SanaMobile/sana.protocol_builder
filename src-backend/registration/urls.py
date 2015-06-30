from django.conf.urls import url

from views import login, logout, signup


urlpatterns = [
    url(r'^login', login),
    url(r'^logout', logout),
    url(r'^signup', signup),
]
