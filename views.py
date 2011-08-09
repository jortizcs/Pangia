from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth import authenticate, login

__author__ = 'mheinrich'

def login(request):
    """
    The login page
    """
    
    return render_to_response('login.html',
      context_instance=RequestContext(request, {}))

def index(request):
    """
    Displays the index page that then leads to other Pangia apps
    """
    return render_to_response('index.html',
      context_instance=RequestContext(request, {}))

def analytics(request):
    """
    Displays analytics app
    """
    return render_to_response('analytics.html',
      context_instance=RequestContext(request, {}))

def energy_explorer(request):
    """
    Displays energy explorer
    """
    return render_to_response('energy_explorer.html',
      context_instance=RequestContext(request, {}))

def alerts_view(request):
    """
    Displays alerts
    """
    return render_to_response('alerts/alerts_view.html',
      context_instance=RequestContext(request, {}))

def alerts_set(request):
    """
    Displays alerts
    """
    return render_to_response('alerts/alerts_set.html',
      context_instance=RequestContext(request, {}))

def dashboard(request):
    """
    Displays alerts
    """
    return render_to_response('dashboard.html',
      context_instance=RequestContext(request, {}))

def settings(request):
    """
    Displays alerts
    """
    return render_to_response('settings.html',
      context_instance=RequestContext(request, {}))

