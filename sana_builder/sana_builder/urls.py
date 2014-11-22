from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from webapp import views as webappViews
from rest_framework.authtoken import views as restViews

urlpatterns = patterns('',
    url(r'^admin/',     include(admin.site.urls)),

    url(r'^$',          webappViews.index),
    url(r'^login/$',    webappViews.login),
    url(r'^signup/$',   webappViews.signup),
    url(r'^editor/$',   webappViews.editor),

    url(r'^authenticate/$', restViews.obtain_auth_token)
)

# Flat pages
urlpatterns += patterns('django.contrib.flatpages.views',
    url(r'^about/$',         'flatpage', {'url': '/about/'}),
    url(r'^documentation/$', 'flatpage', {'url': '/documentation/'}),
)
