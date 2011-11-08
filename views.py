from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django import forms

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

def energy_explorer_spaces(request):
    """
    Displays energy explorer spaces view
    """
    return render_to_response('energy_explorer/spaces.html',
      context_instance=RequestContext(request, {}))

def energy_explorer_systems(request):
    """
    Displays energy explorer systems view
    """
    return render_to_response('energy_explorer/systems.html',
      context_instance=RequestContext(request, {}))

def energy_explorer_search(request):
    """
    Displays energy explorer search results view
    """
    return render_to_response('energy_explorer/search.html',
      context_instance=RequestContext(request, {}))


def dashboard(request):
    """
    Displays the dashboard view
    """
    return render_to_response('dashboard.html',
      context_instance=RequestContext(request, {}))

def realtime (request):
    """
    Displays the gathered feedback spatially
    """
    return render_to_response('realtime.html',
      context_instance=RequestContext(request, {}))

def settings(request):
    """
    User settings
    """
    return render_to_response('settings.html',
      context_instance=RequestContext(request, {}))

