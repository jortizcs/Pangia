#!/usr/bin/python

import json
import urllib2
import time, threading
import datetime
import os

import scheduling
import prediction

T = 600 #period
csvFile = "../../data/novedaDemo/demo0.csv"
predictionOutput = "../../data/novedaDemo/prediction.csv"
figDirectory = "../../data/novedaDemo/fig/"

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
    scheduling.detect(csvFile,(24*60*60)/T,figDirectory)
    threading.Timer(T, anomalyDetection).start()


# prediction 
def consumptionPrediction():
    prediction.predict(csvFile,45,predictionOutput,figDirectory)
    threading.Timer(T*6, consumptionPrediction).start()


password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
top_level_url = "https://secure.noveda.com/api/devicedata.php"
username = "APIGreenPangiaAvisBudgetParsippany"
password = "APIGPABHQ"
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
