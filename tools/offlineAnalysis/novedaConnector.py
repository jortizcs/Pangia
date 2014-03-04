#!/usr/bin/python

import json
import urllib2
import time, threading
import datetime

T = 60 #period

def getmeterdata():
    res = json.load(urllib2.urlopen("https://secure.noveda.com/api/devicedata.php"));
    mpts = res['METEREDPOINTS']['METER']
    for x in range(0,len(mpts)):
        entry = mpts[x]
        name = entry["NAME"]
        etype = entry["DATAVALUE"][0]["TYPE"]
        value = entry["DATAVALUE"][0]["CURRENTVALUE"]
        ts_str = entry["DATAVALUE"][0]["TIMESTAMP"]
        ts = time.mktime(datetime.datetime.strptime(str(ts_str),'%Y-%m-%d %H:%M' ).timetuple())
        #print name + "," + etype + "," + str(ts) + "," + value
        print str(ts) +  "," + value+ "," + name + "," + etype 
    threading.Timer(T, getmeterdata).start()

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
