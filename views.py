from django.shortcuts import render_to_response
from django.template.context import RequestContext


__author__ = 'mheinrich'

def index(request):
    """
    Displays the index page that then leads to other Pangia apps
    """
    return render_to_response('index.html',
      context_instance=RequestContext(request, {}))
