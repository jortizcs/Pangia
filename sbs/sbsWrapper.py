#!/usr/bin/env python2
"""

Librairies needed: 
 -numpy
 -scipy
 -mongopy

Requirements:
 -At least one month of data to do the bootstrap

Notice:
  -Data are sent to SBS by chunks of 1 day long
"""

import sys;
import socket;
import urllib;
import datetime;

#import Mymongodb as mdb;
from pymongo import MongoClient;
import bson;
import pickle;
import sbs;
#import sendEmail;

#Remove the alarms that are "symmetric"
def rmSymetricAlarms(alarms):
  res = []

  if alarms == None:
    return res

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

  if alarms == None:
    return res

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


## Read a file and analyze it. Only used for testing.
#def readFile(inputFile):
  #detec = sbs.SBS()
  #data = []
  #allAlarms = []
  #inputFileFD = open(inputFile)
  #for line in inputFileFD:
    #point = line.split(",")
    #data.append([point[2][0:-1], int(point[0]), float(point[1])])
  
  #inputFileFD.close()
      
  #alarms = detec.addSample(data)
  ##Filter out the symmetric alarms
  #alarms = rmSymetricAlarms(alarms)
  #allAlarms.extend(alarms)
  ##Aggregate consecutive alarms
  #allAlarms = aggConsecAlarms(allAlarms)
      
  
  #print("Number of alarms found: "+str(len(allAlarms)))
  #print(allAlarms)


### Run SBS with data from a TSDB server
def TSDB2SBS(TSDBserver, TSDBport, mongoserver, mongoport, dbname, data_id, user_id, bldg_id, start, end):

  sys.stdout.write("[{0}] 0%, Start SBS: data_id={1}, bldg_id={2}, user_id={3}, timeStart={4}, timeEnd={5}\n".format(datetime.datetime.now(),data_id,bldg_id,user_id,start,end))
  sys.stdout.flush()
  #Initialization of SBS
  detector = sbs.SBS()

  if mongoserver != None:
    #Get the last values from mongodb
    client = MongoClient(mongoserver, mongoport)
    sbsColl = client[dbname].sbs 
    bid = bson.objectid.ObjectId(bldg_id)
    param = sbsColl.find_one({"bldg_id": bid})

    if param!=None:
      #Set SBS to its previous state
      detector.windowTail = param[0]["window_tail"];
      detector.filteredSensors = param[0]["sensors_label"];  # TODO change this to allow new sensors to be added
      detector.histBehavior = pickle.loads(param[0]["hist"]);
      detector.histBehaviorChange = pickle.loads(param[0]["hist_change"]);
      print("Restore SBS state");
      
    else:
      # First run:
      # Get measurement points names from the stream collection
      print("Initialize SBS state");
      streamColl = client[dbname].streams
      streams = streamColl.find({"bldg_id": bid})
      
      filteredSensors = dict()
      ind = 0
      for stream in streams:
        filteredSensors[stream["name"]] = ind;
        ind += 1
        
      detector.filteredSensors = filteredSensors
      # TODO also set the fixed params


  ## Get the data from the OpenTSDB database
  # Setup the connection
  req = "sum:1m-avg:sbs."+user_id+"."+bldg_id+"{label=*}"

  # Feed SBS with slices of data of 1 hour-long. This is not related to SBS window size (it should be bigger than the OpenTSDB slices? 10 minutes?)
  dateFormat = "%Y/%m/%d-%H:%M:%S"
  dateFormatMymongo = "%Y-%m-%d %H:%M:%S"
  startDate = datetime.datetime.fromtimestamp(float(start)) #strptime(start,dateFormat)
  endDate = datetime.datetime.fromtimestamp(float(end)) #.strptime(end,dateFormat)
  allAlarms = []
  for currentDate in daterange(startDate, endDate):
    nextDate = currentDate+datetime.timedelta(1)
    sys.stdout.write("[{0}] {1}%, Analyzing data from {2} to {3}\n".format(datetime.datetime.now(),int(100*(currentDate-startDate).total_seconds()/(endDate-startDate).total_seconds()),currentDate,nextDate))
    sys.stdout.flush()
    TSDBparams = urllib.urlencode({'m': req, 'start': datetime.datetime.strftime(currentDate,dateFormat), 'end': datetime.datetime.strftime(nextDate,dateFormat), 'ascii': 0})
    TSDBdata = urllib.urlopen("http://{0}:{1}/q?{2}".format(TSDBserver,TSDBport, TSDBparams))

    # Load the data
    alarms = detector.addSample(TSDBdata,tsdb=True)
    TSDBdata.close()

    #Filter out the symmetric alarms
    alarms = rmSymetricAlarms(alarms)

    allAlarms.extend(alarms)
    
  #Aggregate consecutive alarms
  allAlarms = aggConsecAlarms(allAlarms)

  sys.stdout.write("[{0}] 100%, SBS found {1} anomalies in total\n".format(datetime.datetime.now(),len(allAlarms)))
  
  if mongoserver != None:
    ##Initialization of the connection to the database
    client = MongoClient(mongoserver,mongoport)
    alarmsColl = client[dbname].alarms 
    sbsColl = client[dbname].sbs 
    bdata_id = bson.objectid.ObjectId(data_id)
    bbldg_id = bson.objectid.ObjectId(bldg_id)
    buser_id = bson.objectid.ObjectId(user_id)

    ##Insert the alarms in the Mymongo database
    for alarm in allAlarms:
#TODO get _id of the streams and store it in an array
#TODO store date objects (ISODate) 
      alarmsColl.insert({"data_id":bdata_id, "bldg_id":bbldg_id, "start": datetime.datetime.strftime(datetime.datetime.fromtimestamp(alarm["start"]),dateFormatMymongo), "end":datetime.datetime.strftime(datetime.datetime.fromtimestamp(alarm["end"]),dateFormatMymongo), "label01":alarm["label"], "label02":alarm["peer"], "deviation":alarm["dev"]})

    ##Update SBS state in mongodb
    sbsColl.update({"bldg_id": bbldg_id},{"$set": {"bldg_id": bbldg_id, "window_tail":detector.windowTail, "sensors_label": detector.filteredSensors, "hist": bson.binary.Binary(pickle.dumps(detector.histBehavior,2)), "hist_change":  bson.binary.Binary(pickle.dumps(detector.histBehaviorChange,2))}},upsert=True)

if __name__ == "__main__":
  if len(sys.argv) < 11:
    print("usage: {0} TSDBserver TSDBport mongoserver mongoport mongo dbname id user_id bldg_id timeStart timeEnd".format(sys.argv[0]))
    exit()


  ## Initialisation
  TSDBserver = sys.argv[1]
  TSDBport = sys.argv[2]

  mongoserver = sys.argv[3]
  mongoport = int(sys.argv[4])
  dbname = sys.argv[5]

  id = sys.argv[6]
  user_id = sys.argv[7]
  bldg_id = sys.argv[8]
  start = sys.argv[9]
  end = sys.argv[10]

  TSDB2SBS(TSDBserver, TSDBport, mongoserver, mongoport, dbname, id, user_id, bldg_id, start, end)
