# coding: utf-8
import pandas
import numpy as np
import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')
from matplotlib import pyplot as plt
from datetime import time
import glob

# parameters:
threshold = 2
thresholdOHour = 5 
nbPtsPerHour = 2


def detect(dataFiles,figDirectory=None,outputDirectory=None,threshold=threshold):
 for filename in glob.glob(dataFiles):

  print filename

  # Load data
  data = pandas.read_csv(filename,header=None,names=["ts","val","name","type"],usecols=["ts","val","name","type"])
  data.index = pandas.to_datetime(data.pop('ts'),unit='s')
  data = data[data["type"]!="Outside Air Temperat"]
  dataTmp = []
  for device in np.unique(data.name):
    dataTmp.append(data[data["name"]==device]["val"])
    dataTmp[-1] = pandas.DataFrame(dataTmp[-1].resample("30Min",how=np.nanmean),columns=["val"]).diff()*nbPtsPerHour #resample data and convert from energy to consumption
    dataTmp[-1].loc[dataTmp[-1]["val"]<0,"val"] = 0  # ignore negative values due to measurment errors 
    dataTmp[-1].loc[dataTmp[-1]["val"]>800,"val"] = 0  # ignore high values due to measurment errors 
    dataTmp[-1]["name"] = device
  
  data = pandas.concat(dataTmp)
  

  # get the name of the devices (namely, exclude nan and temperature data)
  devices = []
  for name in np.unique(data.name):
    if name!="OA Temp" and str(name)!="nan":
      devices.append(name)
    


  # Check if devices are ON on sundays
  for name in devices:
    print("%s:" % name)
    nbAlarms = 0
    
    #compute threshold using moving average for the last week
    values = data[data.name == name].val
    median = pandas.rolling_median(values , 24*7*nbPtsPerHour )
    std = pandas.rolling_std(values , 24*7*nbPtsPerHour )
    
    modes = values.tail(24*7*nbPtsPerHour)>median.tail(24*7*nbPtsPerHour)+threshold*std.tail(24*7*nbPtsPerHour) #
    modesOHour = values.tail(24*7*nbPtsPerHour)>median.tail(24*7*nbPtsPerHour)+thresholdOHour*std.tail(24*7*nbPtsPerHour) #
    
    # Ignore working hours
    # assume working hour is: 7am to 7pm for monday-friday
    #                         8am to 4pm for saturday
    alarmReport = []
    for i,modes in enumerate([modes,modesOHour]):
      for timeON in modes[modes == True].index:
        # monday-friday
        alarm = False
        if (timeON.dayofweek < 5 and (timeON.hour < 7-1 or timeON.hour > 19+1)) or i==1:
          print "mon-fri: "+str(timeON)
          alarm = True
          nbAlarms += 1
        
        # saturday
        elif (timeON.dayofweek == 5 and (timeON.hour < 8-1 or timeON.hour > 16+1)) or i==1:
          print "sat: "+str(timeON)
          alarm = True
          nbAlarms += 1
        
        # sunday
        elif timeON.dayofweek == 6:
          print "sun: "+str(timeON)
          alarm = True
          nbAlarms += 1
        
        if alarm:
          alarmReport.append([timeON,values[timeON]])
        
    if nbAlarms :
      alarmReport = pandas.DataFrame(alarmReport,columns=["ts","val"])
      alarmReport.index = pandas.to_datetime(alarmReport.pop('ts'), unit="s")
    if outputDirectory:
      #record alarms in a csv file
      alarmReport.to_csv("%s%s_%s_alarms.csv" % (outputDirectory,filename.rpartition("/")[2], name))


        
    if figDirectory and len(values.tail(24*7*nbPtsPerHour))>1: 
      # plot data, threshold and alarms
      plt.figure(figsize=(12,4))
      #plt.fill_between(values.tail(24*7*nbPtsPerHour).index,0,values.tail(24*7*nbPtsPerHour))
      plt.plot(values.tail(24*7*nbPtsPerHour).index,values.tail(24*7*nbPtsPerHour),lw=2)
#      plt.plot(median.tail(24*7*nbPtsPerHour).index,median.tail(24*7*nbPtsPerHour),"g",lw=2)
      if nbAlarms:
        plt.plot(alarmReport.index,alarmReport,"r^",ms=10)
      plt.title(name)
      plt.grid("on")
      #plt.show()
      print("Number of hours when devices should be OFF: %d " % nbAlarms)
      plt.savefig(figDirectory+str(name)+".png",transparent=True) 
      plt.close() 




if __name__ == "__main__":
  # here we assume it is hourly data (1 point per hour)
  detect('../dl/csvdata/*Hour_Data.csv',1,"../fig/",'../alarms/')
