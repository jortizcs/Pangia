#!/usr/bin/env python2
"""

Librairies needed: 
 -MySQLdb (mysql-python)
 -numpy
 -scipy

Requirements:
 -At least one month of data to do the bootstrap

Notice:
  -Data are sent to SBS by chunks of 1 day long
"""

import sys;
import socket;
import urllib;
import datetime;

import MySQLdb as mdb;
import sbs;
#import sendEmail;

#Remove the alarms that are "symmetric"
def rmSymetricAlarms(alarms):
  res = []
  for i, alarm1 in enumerate(alarms):
    sym = False
    for alarm2 in alarms[i+1:]:
      if alarm1["label"]==alarm2["peer"]:
        sym = True
        
    if not sym:
      res.append(alarm1)
      
  return res

# Aggregate consecutive anomalies for the same device
def aggConsecAlarms(alarms):
  res = []
  for i, alarm1 in enumerate(alarms):
    consec = False;
    for alarm2 in alarms[i+1:]:
      # if the alarms report the same devices and their timestamps overlap
      if (alarm1["label"]==alarm2["label"] and alarm1["peer"]==alarm2["peer"]) or (alarm1["label"]==alarm2["peer"] and alarm1["peer"]==alarm2["label"]) and ((alarm1["end"]>=alarm2["start"] and alarm1["start"]<=alarm2["end"]) or (alarm2["end"]>=alarm1["start"] and alarm2["start"]<=alarm1["end"])):
        consec=True;
        alarm2["start"] = min(alarm1["start"],alarm2["start"]);
        alarm2["end"] = max(alarm1["end"],alarm2["end"]);
        alarm2["dev"] += alarm1["dev"];
        break
        
    if not consec:
        res.append(alarm1)
        
  return res

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + datetime.timedelta(n)

if len(sys.argv) < 11:
  print("usage: {0} TSDBserver TSDBport SQLserver SQLuser SQLpwd SQLdb id username timeStart timeEnd".format(sys.argv[0]))
  exit()


## Initialisation
TSDBserver = sys.argv[1]
TSDBport = sys.argv[2]

SQLserver = sys.argv[3]
SQLuser = sys.argv[4]
SQLpwd = sys.argv[5]
SQLdb = sys.argv[6]

id = sys.argv[7]
username = sys.argv[8]
start = sys.argv[9]
end = sys.argv[10]


BUFFER_SIZE = 8

sys.stdout.write("[{0}] SBS: 0%, Start: id={1}, username={2}, timeStart={3}, timeEnd={4}\n".format(datetime.datetime.now(),id,username,start,end))

#Initialization of SBS
detector = sbs.SBS()

##Initialization of the connection to the MySQL databse
SQLconn = mdb.connect(SQLserver, SQLuser, SQLpwd, SQLdb)
SQLcur = SQLconn.cursor()

## Get the data from the OpenTSDB database
# Setup the connection
req = "sum:1m-avg:sbs."+username+"."+id+"{label=*}"

# Feed SBS with slices of data of 1 hour-long. This is not related to SBS window size (it should be bigger than the OpenTSDB slices? 10 minutes?)
dateFormat = "%Y/%m/%d-%H:%M:%S"
dateFormatMySQL = "%Y-%m-%d %H:%M:%S"
startDate = datetime.datetime.fromtimestamp(float(start)) #strptime(start,dateFormat)
endDate = datetime.datetime.fromtimestamp(float(end)) #.strptime(end,dateFormat)
allAlarms = []
for currentDate in daterange(startDate, endDate):
  sys.stdout.write("[{0}] SBS: {1} %, Analyzing data from {2}\n".format(datetime.datetime.now(),int(100*(currentDate-startDate).total_seconds()/(endDate-startDate).total_seconds()),currentDate))
  sys.stdout.flush()
  TSDBparams = urllib.urlencode({'m': req, 'start': datetime.datetime.strftime(currentDate,dateFormat), 'end': datetime.datetime.strftime(currentDate+datetime.timedelta(1),dateFormat), 'ascii': 0})
  TSDBdata = urllib.urlopen("http://{0}:{1}/q?{2}".format(TSDBserver,TSDBport, TSDBparams))

  # Load the data
  alarms = detector.addSample(TSDBdata,tsdb=True)
  TSDBdata.close()

  #Filter out the symmetric alarms
  alarms = rmSymetricAlarms(alarms)

  allAlarms.extend(alarms)
  
#Aggregate consecutive alarms
allAlarms = aggConsecAlarms(allAlarms)

##Insert the alarms in the MySQL database
sys.stdout.write("[{0}] SBS: 100%, Found {1} anomalies in total\n".format(datetime.datetime.now(),len(allAlarms)))
for alarm in allAlarms:
  SQLcur.execute("INSERT INTO `alarms`(`id`, `username`, `start`, `end`, `label01`, `label02`, `deviation`) VALUES({0},'{1}','{2}','{3}','{4}','{5}',{6})".format(id, username,  datetime.datetime.strftime(datetime.datetime.fromtimestamp(alarm["start"]),dateFormatMySQL), datetime.datetime.strftime(datetime.datetime.fromtimestamp(alarm["end"]),dateFormatMySQL), alarm["label"], alarm["peer"], alarm["dev"]))
    
SQLconn.commit()
SQLconn.close()
