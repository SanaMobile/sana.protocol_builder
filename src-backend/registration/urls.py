from django.conf.urls import url
from rest_framework.authtoken import views as authTokenViews

from views import signup


urlpatterns = [
    url(r'^login', authTokenViews.obtain_auth_token),
    url(r'^signup', signup),
]
