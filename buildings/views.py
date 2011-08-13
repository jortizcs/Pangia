from buildings.models import Building
from django.http import HttpResponse
from django.core.context_processors import csrf
import httplib

__author__='jortiz'

def index(request):
	return HttpResponse("Buildings application in the heezy fo' sheezy")

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
        
def sfs_post_target(request):

	if request.method == 'POST':
		c = {}
		c.update(csrf(request))
		return HttpResponse("{\"status\":\"success\"}");
	else:
		return HttpResponse("{\"status\":\"fail\"}");