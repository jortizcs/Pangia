#!/usr/bin/env python2

import sys;
import socket;
import urllib;
import datetime;

import MySQLdb as mdb;
import sbs;

#Remove the alarms that are "symmetric"
def rmSymetricAlarms(alarms):
  res = []
  for i, alarm1 in enumerate(alarms):
    sym = False
    for alarm2 in enumerate(alarms):
      if alarm1["label"]==alarm2["peer"]:
        sym = True
        
    if not sym:
      res.append(alarm1)
      
  return res


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

##Initialization of the connection to the MySQL databse
#SQLconn = mdb.connect(SQLserver, SQLuser, SQLpwd, SQLdb)
#SQLcur = SQLconn.cursor()

#Initialization of SBS
detector = sbs.SBS()


## Get the data from the OpenTSDB database
# Setup the connection
req = "sum:sbs."+username+"."+id+"{label=*}"
TSDBparams = urllib.urlencode({'m': req, 'start': start, 'end': end, 'ascii': 0})
sys.stderr.write("Requesting data: http://{0}:{1}/q?{2}\n".format(TSDBserver,TSDBport, TSDBparams))
TSDBdata = urllib.urlopen("http://{0}:{1}/q?{2}".format(TSDBserver,TSDBport, TSDBparams))

# Load the data
sys.stderr.write("Receiving the data...\n")
alarms = detector.addSample(TSDBdata,tsdb=True)
TSDBdata.close()

#Filter out the symmetric alarms
alarms = rmSymetricAlarms(alarms)
print alarms
if alarms!=None:
  ##Insert the alarms in the MySQL database
  for alarm in alarms:
    sys.stderr.write("SBS: Found {0} alarms\n".format(len(alarms)))
    #SQLcur.execute("INSERT INTO alarms(id, username, start, end, label) VALUES({0},{1},{2},{3},{4})".format(id, username, alarm["start"], alarm["end"], alarm["label"]))
  
sys.stderr("Closing the connections...")
TSDBconn.close()
#SQLconn.close()
