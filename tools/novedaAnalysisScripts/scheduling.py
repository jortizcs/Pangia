# coding: utf-8
import pandas
import numpy as np
from matplotlib import pyplot as plt
from datetime import time
import glob

# parameters:
threshold = 3



def detect(dataFiles,nbPtsPerHour,figDirectory=None,outputDirectory=None,threshold=threshold):
 for filename in glob.glob(dataFiles):

  print filename

  # Load data
  data = pandas.read_csv(filename,header=None,names=["ts","val","name","type"],usecols=["ts","val","name"])
  data.index = pandas.to_datetime(data.pop('ts'),unit='s')
#  data = data.resample #TODO resample data, so we can drop "nbPtsPerHour"

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
    
    # Ignore working hours
    # assume working hour is: 7am to 7pm for monday-friday
    #                         8am to 4pm for saturday
    alarmReport = []
    for timeON in modes[modes == True].index:
      # monday-friday
      alarm = False
      if timeON.dayofweek < 5 and (timeON.hour < 7-1 or timeON.hour > 19+1):
        print "mon-fri: "+str(timeON)
        alarm = True
        nbAlarms += 1
        
      # saturday
      elif timeON.dayofweek == 5 and (timeON.hour < 8-1 or timeON.hour > 16+1):
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
        
    if nbAlarms and outputDirectory:
      alarmReport = pandas.DataFrame(alarmReport,columns=["ts","val"])
      alarmReport.index = pandas.to_datetime(alarmReport.pop('ts'), unit="s")
      #record alarms in a csv file
      alarmReport.to_csv("%s%s_%s_alarms.csv" % (outputDirectory,filename.rpartition("/")[2], name))


        
    if figDirectory:  
      # plot data, threshold and alarms
      plt.figure(figsize=(12,4))
      plt.fill_between(values.tail(24*7*nbPtsPerHour).index,values.tail(24*7*nbPtsPerHour))
      plt.plot(median.tail(24*7*nbPtsPerHour).index,median.tail(24*7*nbPtsPerHour),"g",lw=2)
      if nbAlarms:
        plt.plot(alarmReport.index,alarmReport,"r*",ms=20)
      plt.title(name)
      plt.grid("on")
      #plt.show()
      print("Number of hours when devices should be OFF: %d " % nbAlarms)
      plt.savefig(figDirectory+name+".png") 
      plt.close() 




if __name__ == "__main__":
  # here we assume it is hourly data (1 point per hour)
  detect('../dl/csvdata/*Hour_Data.csv',1,"../fig/",'../alarms/')
