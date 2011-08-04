from django.http import HttpResponse
from django.template import loader, Context

__author__ = 'mheinrich'

def index(request):
    """
    Displays the index page that then leads to other Pangia apps
    """
    t = loader.get_template('index.html')
    c = Context("")
    return HttpResponse(t.render(c))