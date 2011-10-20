from buildings.models import Building, Floor, Room, LiveFeedback, AvgStat, AggStat
from django.http import HttpResponse, HttpResponseRedirect
#from django.core.context_processors import csrf
from time import strftime, localtime
from datetime import datetime
from decimal import Decimal
import httplib
import json
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.http import HttpResponse

from django.db import models

from django.forms import ModelForm, Textarea, RadioSelect

__author__='jortiz'

def index(request):
	return HttpResponse("Buildings application in the heezy fo' sheezy")

def sfs_get_ts(request):
	start_time = 0
	end_time = 0
	qpath = ""
	sfshost = ""
	sfsport = 0
	type = ""
	t_scope=""
	res = []
	
	try:
		start_time = request.REQUEST["start_time"]
		end_time = request.REQUEST["end_time"]
		qpath = request.REQUEST["path"]
		sfshost = request.REQUEST["sfshost"]
		sfsport = request.REQUEST["sfsport"]
		type = request.REQUEST["type"]
		t_scope = request.REQUEST["scope"]
	except KeyError:
		return HttpResponse("Missing one or more of [start_time, end_time, path, sfshost, sfsport, type, scope] params.")
	
	""" Convert from local unix timestamp to date in accepted format """
	st = strftime("%Y-%m-%d %H:%M:%S", localtime(float(start_time)))
	et = strftime("%Y-%m-%d %H:%M:%S", localtime(float(end_time)))
	try:
		if type == 'agg':
			res=AggStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
			if qpath.endswith("/") and len(res) == 0:
				qpath = qpath[0:len(qpath)-1]
				res=AggStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
			elif len(res)==0 :
				qpath = qpath + "/"
				res=AggStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
		elif type == 'avg':
			res=AvgStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
			if qpath.endswith("/") and len(res) == 0:
				qpath = qpath[0:len(qpath)-1]
				res=AvgStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
			elif len(res)==0 :
				qpath = qpath + "/"
				res=AvgStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
	except Exception as error:
		return HttpResponse("Error caught:: " + str(error))
		
	if len(res)==0 :
		address = sfshost + ":" + sfsport
		conn = httplib.HTTPConnection(address)
		path = qpath + "?query=true&ts_timestamp=gte:" + start_time + ",lte:" + end_time
		#path = "/temp/stream01?query=true&ts_timestamp=gte:" + start_time + ",lte:" + end_time
		#conn.request("GET", "/temp/stream01?query=true&ts_timestamp=gte:1312874584,lte:1312878184")
		conn.request("GET", path)
		r = conn.getresponse()
		#rjson = json.loads(r.read())
		#rjson["len_res"]=len(res)
		
		#check if the response is empty, format, and return
		#return HttpResponse(json.dumps(rjson))
		return HttpResponse(r.read())
	else:
		#format the results and return them
		results = {}
		results["path"]=qpath
		results["ts_query_results"]=[]
		for record in res:
			dp = {}
			dp["ts"]=record.start_time
			if type == 'agg':
				dp["value"]=record.sum
			elif type == 'avg':
				dp["value"]=record.avg

			results["ts_query_results"].append(dp)
		
		return HttpResponse(json.dumps(results))
	
	#return HttpResponse("ok")

def sfs_post_target(request):
	datastr = request.raw_post_data
	respobj = {}

	if request.method == 'POST' and len(datastr) > 0 :
		datapoint = json.loads(datastr)
		t_type=""
		t_ts=0
		t_value=0
		t_path=""
		t_units=""		
		try:
			t_ts = datapoint["ts"]
			t_value = datapoint["value"]
			t_path = str(datapoint["is4_uri"])
			t_units = str(datapoint["urlparams"]["units"])					#set by agg
			t_type = str(datapoint["urlparams"]["type"])					#avg, agg, raw
			t_scope = str(datapoint["urlparams"]["scope"])				
		except KeyError:
			respobj["status"]="fail"
			error = "Missing ts, value, is4_uri, urlparams, units, and/or type"
			respobj["error"]=error
			return HttpResponse(json.dumps(respobj))
			
		#st = strftime("%Y-%m-%d %H:%M:%S", localtime(float(t_ts)))
		lt = localtime(t_ts)
		dt = datetime(year=lt.tm_year, month=lt.tm_mon, day=lt.tm_mday, hour=lt.tm_hour, minute=lt.tm_min, second=lt.tm_sec)
		if t_type == 'avg' :
			# the value is an average	
			thisAvgStat = AvgStat(path=t_path, avg=Decimal(str(t_value)), units=t_units, window_size=t_scope, start_time=dt)
			thisAvgStat.save()
			respobj["saved"]="true"
		elif t_type == 'agg' :
			# the value is a sum
			thisAggStat = AggStat(path=t_path, sum=Decimal(str(t_value)), units=t_units, window_size=t_scope, start_time=dt)
			thisAggStat.save()
			respobj["saved"]="true"
		else :
			return HttpResponse("Unknown type")
		"""
		elif type == 'raw' :
			thisAggStat = AggStat(path=t_path, sum=t_value, units="sec", 
									window_size="sec", start_time=t_ts)
			thisAvgStat.save()
			thisAvgStat = AvgStat(path=t_path, avg=t_value, units="sec", 
									window_size="sec", start_time=t_ts)
			thisAvgStat.save()
		"""
			
		respobj["status"]="success"
		return HttpResponse(json.dumps(respobj))
		#return HttpResponse(json.dumps(respobj, sort_keys=True, indent=4))
		#return HttpResponse(json.dumps(datapoint))
	else:
		respobj = {}
		respobj["status"]="fail"
		return HttpResponse(json.dumps(respobj))
		#return HttpResponse(json.dumps(respobj, sort_keys=True, indent=4))

class LiveFeedbackForm(ModelForm):
    class Meta:
        model = LiveFeedback
        widgets = {
            'comments': Textarea(attrs={'cols': 50, 'rows': 4}),
        }
	
def live_feedback_submit(request):
    """
    Allows user to submit comfort feedback
    """

    if request.method == 'POST':
        #A POST is received on feedback submission. We validate it, and if that
        #fails, return with the error list.
        form = LiveFeedbackForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/live_feedback/thanks.html');
        else:
            #We just pass here because in the case of errors, we just return to
            #the feedback page and display the errors.
            pass
    else:
        #In the case of a GET request, just generate a new form.
        form = LiveFeedbackForm()

    return render_to_response('live_feedback/submit.html',
      context_instance=RequestContext(request, {
            "feedbackform": form,
      }))

def live_feedback_view(request):
    """
    Displays the gathered feedback spatially
    """
    #To deal with CSRF
    request.META['CSRF_COOKIE_USED'] = True

    buildings = Building.objects.all()

    if not request.POST:
        return render_to_response('live_feedback/view.html',
          context_instance=RequestContext(request, {
            "buildings": buildings,
          }))

    building_feedback = LiveFeedback.objects.filter(building=request.POST.get('building', False))

    return render_to_response('live_feedback/view.html',
      context_instance=RequestContext(request, {
        "feedback": building_feeback,
        "buildings": buildings,
      }))

def live_feedback_thanks(request):
    """
    Thank you screen for submitting feedback
    """
    return render_to_response('live_feedback/thanks.html',
      context_instance=RequestContext(request, {}))
