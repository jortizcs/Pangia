from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
import httplib

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

def sfs_get_ts(request):
    """
    Runs a GET request to obtain timeseries data from SFS
    """
    try:
        start_time = request.REQUEST["start_time"]
        end_time = request.REQUEST["end_time"]
        qpath = request.REQUEST["path"]
        sfshost = request.REQUEST["sfshost"]
        sfsport = request.REQUEST["sfsport"]

        address = sfshost + ":" + sfsport
        conn = httplib.HTTPConnection(address)
        path = qpath + "?query=true&ts_timestamp=gte:" + start_time + ",lte:" + end_time
        #path = "/temp/stream01?query=true&ts_timestamp=gte:" + start_time + ",lte:" + end_time
        #conn.request("GET", "/temp/stream01?query=true&ts_timestamp=gte:1312874584,lte:1312878184")
        conn.request("GET", path)
        r = conn.getresponse()
        #return HttpResponse("Hello, world. You're at the poll index.")
        return HttpResponse(r.read())
    except KeyError:
        return HttpResponse("Missing start_time, end_time, path, sfshost, sfsport params.")

def energy_explorer(request):
    """
    Displays energy explorer
    """
    return render_to_response('energy_explorer.html',
      context_instance=RequestContext(request, {}))

def alerts_view(request):
    """
    Show all alerts
    """
    return render_to_response('alerts/alerts_view.html',
      context_instance=RequestContext(request, {}))

def alerts_set(request):
    """
    Set your alerts
    """
    return render_to_response('alerts/alerts_set.html',
      context_instance=RequestContext(request, {}))

def dashboard(request):
    """
    Displays the dashboard view
    """
    return render_to_response('dashboard.html',
      context_instance=RequestContext(request, {}))

def settings(request):
    """
    User settings
    """
    return render_to_response('settings.html',
      context_instance=RequestContext(request, {}))

