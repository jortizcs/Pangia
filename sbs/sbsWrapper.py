#!/usr/bin/env python

import sys;
import socket;

import MySQLdb as mdb
import sbs;


if len(sys.argv) < 11:
  print("usage: {0} TSDBserver TSDBport SQLserver SQLuser SQLpwd SQLdb id username timeStart timeEnd".format(sys.argv[0]))

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

#Initialisation of the connection to the MySQL databse
SQLconn = MySQLdb.connect(SQLserver, SQLuser, SQLpwd, SQLdb)
SQLcur = SQLconn.cursor()

#Initialization of SBS
detector = sbs.SBS()


## Get the data from the OpenTSDB database
# Setup the connection
TSDBconn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
TSDBconn.connect((TSDBserver, TSDBport))

# Load the data
sys.stderr.write("Contacting the OpenTSDB server...\n")
TSDBconn.send("get sbs.{0}.{1} {2} {3} {4}\n".format(id, username, start, end) #TODO verify how to format the request
data = TSDBconn.recv(BUFFER_SIZE)
sys.stderr.write("Receiving the data...\n")
while(data!="")
  point = data.split()
  ts = float(point[0])
  val= float(point[1])
  label=point[2]

  alarms = detector.addSample()
  if alarms 
    ##Insert the alarms in the MySQL database
    for alarm in alarms:
      sys.stderr("SBS: Found {0} alarms\n".format(len(alarms)))
      SQLcur.execute("INSERT INTO alarms(id, username, start, end, label) VALUES({0},{1},{2},{3},{4})".format(id, username, alarm["start"], alarm["end"], alarm["label"]))
  
sys.stderr("Closing the connections...")
TSDBconn.close()
SQLconn.close()