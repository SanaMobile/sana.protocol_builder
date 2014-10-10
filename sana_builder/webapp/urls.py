from django.conf.urls import patterns, url

from webapp import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='homepage'),
)