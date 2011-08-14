from buildings.models import Building, AvgStat, AggStat
from django.http import HttpResponse
#from django.core.context_processors import csrf
from time import strftime, localtime
import httplib
import json

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
		return HttpResponse("Missing start_time, end_time, path, sfshost, sfsport params.")
	
	st = strftime("%Y-%m-%d %H:%M:%S", localtime(float(start_time)))
	et = strftime("%Y-%m-%d %H:%M:%S", localtime(float(end_time)))
	try:
		if type == 'agg':
			res=AggStat.objects.filter(path=qpath).filter(start_time__gte=st).filter(start_time__lte=et).filter(window_size=t_scope)
		elif type == 'avg':
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
		
		#check if the response is empty, format, and return
		return HttpResponse(r.read())
	else:
		#format the results and return them
		return HttpResponse()
	
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
			t_units = str(datapoint["urlparams"]["units"])				#set by agg
			t_type = str(datapoint["urlparams"]["type"])					#avg, agg, raw
			t_scope = str(datapoint["urlparams"]["scope"])				
		except KeyError:
			respobj["status"]="fail"
			error = "Missing ts, value, path, urlparams, units, and/or type"
			respobj["error"]=error
			return HttpResponse(json.dumps(respobj))
		
		if len(type) >0 :
			if type == 'avg' :
				# the value is an average
				thisAvgStat = AvgStat(path=t_path, avg=t_value, units=t_units, 
										window_size=t_scope, start_time=t_ts)
				thisAvgStat.save()
			elif type == 'agg' :
				thisAggStat = AggStat(path=t_path, avg=t_value, units=t_units, 
										window_size=t_scope, start_time=t_ts)
				thisAvgStat.save()
			elif type == 'raw' :
				thisAggStat = AggStat(path=t_path, avg=t_value, units="sec", 
										window_size="sec", start_time=t_ts)
				thisAvgStat.save()
				thisAvgStat = AvgStat(path=t_path, avg=t_value, units="sec", 
										window_size="sec", start_time=t_ts)
				thisAvgStat.save()
			
		respobj["status"]="success"
		return HttpResponse(json.dumps(respobj))
		#return HttpResponse(json.dumps(respobj, sort_keys=True, indent=4))
		#return HttpResponse(json.dumps(datapoint))
	else:
		respobj = {}
		respobj["status"]="fail"
		return HttpResponse(json.dumps(respobj))
		#return HttpResponse(json.dumps(respobj, sort_keys=True, indent=4))
		
		
		
		
		
		
		