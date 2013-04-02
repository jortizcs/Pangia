#!/usr/bin/env python2
"""

Librairies needed: 
 -MySQLdb (mysql-python)
 -numpy
 -scipy
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

# TODO aggregate consecutive anomalies for the same device


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
for currentDate in daterange(startDate, endDate):
  TSDBparams = urllib.urlencode({'m': req, 'start': datetime.datetime.strftime(currentDate,dateFormat), 'end': datetime.datetime.strftime(currentDate+datetime.timedelta(1),dateFormat), 'ascii': 0})
  sys.stderr.write("Requesting data: http://{0}:{1}/q?{2}\n".format(TSDBserver,TSDBport, TSDBparams))
  TSDBdata = urllib.urlopen("http://{0}:{1}/q?{2}".format(TSDBserver,TSDBport, TSDBparams))

  # Load the data
  sys.stderr.write("Receiving the data...\n")
  alarms = detector.addSample(TSDBdata,tsdb=True)
  TSDBdata.close()

  #Filter out the symmetric alarms
  alarms = rmSymetricAlarms(alarms)
  print alarms
  ##Insert the alarms in the MySQL database
  for alarm in alarms:
    sys.stderr.write("SBS: Found {0} alarms\n".format(len(alarms)))
    print "INSERT INTO `alarms`(`id`, `username`, `start`, `end`, `label01`, `label02`, `deviation`) VALUES({0},'{1}','{2}','{3}','{4}','{5}',{6})".format(id, username,  datetime.datetime.strftime(alarm["start"],dateFormatMySQL), datetime.datetime.strftime(alarm["end"],dateFormatMySQL), alarm["label"], alarm["peer"], alarm["dev"])
    SQLcur.execute("INSERT INTO `alarms`(`id`, `username`, `start`, `end`, `label01`, `label02`, `deviation`) VALUES({0},'{1}','{2}','{3}','{4}','{5}',{6})".format(id, username,  datetime.datetime.strftime(alarm["start"],dateFormatMySQL), datetime.datetime.strftime(alarm["end"],dateFormatMySQL), alarm["label"], alarm["peer"], alarm["dev"]))
      
sys.stderr.write("Closing the connections...")
SQLconn.commit()
SQLconn.close()


### Send the notification email:
#sendEmail.sendReport("user@corporate.com", "http://greenpangia.com?id={0}".format(id))