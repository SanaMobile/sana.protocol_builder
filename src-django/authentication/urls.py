from django.conf.urls import url

from views import login, logout, signup, confirm_email


urlpatterns = [
    url(r'^login', login),
    url(r'^logout', logout),
    url(r'^signup', signup),
    url(r'^confirm_email/(?P<key>\w+)', confirm_email),
]
