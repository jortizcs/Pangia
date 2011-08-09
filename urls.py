from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
import views

urlpatterns = patterns('',
    # Example:
    # (r'^pangia/', include('pangia.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    (r'^energy_explorer', 'views.energy_explorer'),
    (r'^alerts/view', 'views.alerts_view'),
    (r'^alerts/set', 'views.alerts_set'),
    (r'^login', 'views.login'),
    (r'^analytics', 'views.analytics'),
    (r'^dashboard', 'views.dashboard'),
    (r'^settings', 'views.settings'),
    (r'', 'views.index'),
)

if settings.DEBUG:
    urlpatterns = patterns('', (
        r'^static/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': 'static'}
    )) + urlpatterns

