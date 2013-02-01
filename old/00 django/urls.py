from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
 from django.contrib import admin
 admin.autodiscover()

 import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'pangiaadmin.views.home', name='home'),
    # url(r'^pangiaadmin/', include('pangiaadmin.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    url(r'^login', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
	url(r'^dashboard', 'views.dashboard'),
	url(r'^upload', 'views.upload')
)
