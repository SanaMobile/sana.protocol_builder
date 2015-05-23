from django.conf.urls import patterns, include, url
from django.contrib import admin
from homepage import views as homepageViews
from editor import views as editorViews
from rest_framework.authtoken import views as restViews


admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/',     include(admin.site.urls)),  # noqa

    url(r'^$',          homepageViews.index),
    url(r'^login/$',    homepageViews.login),
    url(r'^signup/$',   homepageViews.signup),

    url(r'^editor/$',   editorViews.editor),

    url(r'^authenticate/$', restViews.obtain_auth_token)
)

# Flat pages
urlpatterns += patterns(
    'django.contrib.flatpages.views',

    url(r'^about/$',         'flatpage', {'url': '/about/'}),
    url(r'^documentation/$', 'flatpage', {'url': '/documentation/'}),
)
