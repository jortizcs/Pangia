#!/usr/bin/python

import json
import urllib2
import datetime
import time
import os
import pandas
import sys


def getmeterdata(date):
    res = json.load(urllib2.urlopen("https://secure.noveda.com/api/devicedata.php?DATE="+str(date)));
    mpts = res['METEREDPOINTS']['METER']
    for x in range(0,len(mpts)):
      entry = mpts[x]
      name = entry["NAME"]
      etype = entry["DATAVALUE"][0]["TYPE"]
      values = entry["DATAVALUE"][0]["VALUES"]
      date_str = entry["DATAVALUE"][0]["DATE"].split("-")
      data = [] 
      count = 0;
      acc = 0;
      for value in values:
        acc += value
        count += 1
        if count==10:
          data.append((acc/10,name,etype))
          acc = 0
          count = 0

      # save data in the csv file
      if data!= []:
        index = pandas.date_range(date,periods=len(data),freq="10min")
        data_df = pandas.DataFrame(data, index=index, columns=["value","name","etype"])
        data_df["date"] = index
        data_df["ts"] = data_df["date"].apply(lambda x: time.mktime(x.timetuple()))
#      data_df.resample("10Min", how="median")
        data_df.to_csv(csvFile,cols=["ts","value","name","etype"],index=False,header=False,mode="a")


password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
top_level_url = "https://secure.noveda.com/api/devicedata.php"
if len(sys.argv)>1:         #Read the login and password from the given file
  fconf = open(sys.argv[1])
  line = fconf.readline()
  credits = line.split(",")
  username = credits[0] #"APIGreenPangiaAvisBudgetParsippany"
  password = credits[1] #"APIGPABHQ"
  csvFile = credits[2]+"bootstrap"
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

for date in pandas.date_range("2014-02-01","2014-03-16"):
  sys.stderr.write("Retrieving data for "+str(date.date())+"\n")
  getmeterdata(date.date())

