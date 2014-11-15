from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from webapp import views

urlpatterns = patterns('',
    url(r'^admin/',     include(admin.site.urls)),

    url(r'^$',          views.index),
    url(r'^login/$',    views.login),
    url(r'^signup/$',   views.signup),
    url(r'^editor/$',   views.editor),

    # RESTful API (TODO)
)

# Flat pages
urlpatterns += patterns('django.contrib.flatpages.views',
    url(r'^about/$',         'flatpage', {'url': '/about/'}),
    url(r'^documentation/$', 'flatpage', {'url': '/documentation/'}),
)
