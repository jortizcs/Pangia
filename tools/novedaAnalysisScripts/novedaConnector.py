#!/usr/bin/python

import json
import urllib2
import time, threading
import datetime
import os
import sys

import scheduling
import prediction

T = 600 #period

def getmeterdata():
    res = json.load(urllib2.urlopen("https://secure.noveda.com/api/devicedata.php"));
    mpts = res['METEREDPOINTS']['METER']
    fOut = open(csvFile,"a")
    for x in range(0,len(mpts)):
        entry = mpts[x]
        name = entry["NAME"]
        etype = entry["DATAVALUE"][0]["TYPE"]
        value = entry["DATAVALUE"][0]["CURRENTVALUE"]
        ts_str = entry["DATAVALUE"][0]["TIMESTAMP"]
        ts = time.mktime(datetime.datetime.strptime(str(ts_str),'%Y-%m-%d %H:%M' ).timetuple())
        #print name + "," + etype + "," + str(ts) + "," + value
        fOut.write(str(ts) +  "," + value+ "," + name + "," + etype+"\n")
    fOut.close()
    threading.Timer(T, getmeterdata).start()

# schedule-based anomaly detection
def anomalyDetection():
    scheduling.detect(csvFile,figDirectory)
    threading.Timer(T, anomalyDetection).start()


# prediction 
def consumptionPrediction():
    prediction.predict(csvFile,40,predictionOutput,figDirectory)
    threading.Timer(T*6, consumptionPrediction).start()


password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
top_level_url = "https://secure.noveda.com/api/devicedata.php"

if len(sys.argv)>1:         # Get the login and password from the given file
  fconf = open(sys.argv[1])
  line = fconf.readline()
  credits = line.split(",")
  username = credits[0] #"APIGreenPangiaAvisBudgetParsippany"
  password = credits[1] #"APIGPABHQ"
  csvFile = credits[2]
  predictionOutput = credits[3]
  figDirectory = credits[4]
else:
  sys.stderr.write("usage: python "+sys.argv[0]+" login.conf\n")
  quit()

password_mgr.add_password(None, top_level_url, username, password)
handler = urllib2.HTTPBasicAuthHandler(password_mgr)

# create "opener" (OpenerDirector instance)
opener = urllib2.build_opener(handler)

# use the opener to fetch a URL
opener.open(top_level_url)

# Install the opener.
# Now all calls to urllib2.urlopen use our opener.
urllib2.install_opener(opener)


getmeterdata()
anomalyDetection()
consumptionPrediction()
