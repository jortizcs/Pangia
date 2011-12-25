from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
import views

urlpatterns = patterns('',
    # Example:
    # (r'^pangia/', include('pangia.foo.urls')),
	(r'^buildings/procs/sfs_get', 'buildings.views.sfs_get_ts'),
	(r'^buildings/procs/sfs_post_target', 'buildings.views.sfs_post_target'),
    (r'^buildings', 'buildings.views.index'),
    (r'^live_feedback/view', 'buildings.views.live_feedback_view'),
    (r'^live_feedback/submit', 'buildings.views.live_feedback_submit'),
    (r'^live_feedback/thanks', 'buildings.views.live_feedback_thanks'),
    (r'^alerts/view', 'buildings.views.alerts_view'),
    (r'^alerts/set', 'buildings.views.alerts_set'),
    (r'^alerts/success', 'buildings.views.alerts_success'),

    # Uncomment the admin/doc line below to enable admin documentation:
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    (r'^energy_explorer/spaces', 'views.energy_explorer_spaces'),
    (r'^energy_explorer/systems', 'views.energy_explorer_systems'),
    (r'^energy_explorer/search', 'views.energy_explorer_search'),
    (r'^login', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    (r'^logout', 'django.contrib.auth.views.logout', {'template_name': 'logout.html'}),
    (r'^analytics', 'views.analytics'),
    (r'^dashboard', 'views.dashboard'),
    (r'^realtime', 'views.realtime'),
    (r'^settings', 'views.settings'),
    (r'', 'views.index'),
)

if settings.DEBUG:
    urlpatterns = patterns('', (
        r'^static/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': 'static'}
    )) + urlpatterns
