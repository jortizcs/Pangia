# coding: utf-8
import pandas
import numpy as np
import pylab
from datetime import time
import glob

close("all")

# Data directory: assume it is hourly data (this is not a strong assumption panda can easily resample data)
path = '../dl/20131208/csvdata/'
outputpath = '../alarms/'

threshold = 3

for filename in glob.glob(path+'*Hour_Data.csv'):

  print filename

  # Load data
  data = pandas.read_csv(filename,header=None,names=["ts","val","name"])
  data.index = pandas.to_datetime(data.pop('ts'),unit='s')

  # get the name of the devices (namely, exclude nan and temperature data)
  devices = []
  for name in unique(data.name):
    if name!="OA Temp" and str(name)!="nan":
      devices.append(name)
    


  # Check if devices are ON on sundays
  for name in devices:
    print("%s:" % name)
    nbAlarms = 0
    
    #compute threshold using moving average for the last week
    values = data[data.name == name].val
    median = pandas.rolling_median(values , 24*7 )
    std = pandas.rolling_std(values , 24*7 )
    
    modes = values>median+threshold*std #
    
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
        
    if nbAlarms:
      alarmReport = pandas.DataFrame(alarmReport,columns=["ts","val"])
      alarmReport.index = pandas.to_datetime(alarmReport.pop('ts'), unit="s")
      #record alarms in a csv file
      alarmReport.to_csv("%s%s_%s_alarms.csv" % (outputpath,filename.rpartition("/")[2], name))
        
      
    # plot data, threshold and alarms
    figure()
    plot(values.index,values)
    plot(median.index,median)
    if nbAlarms:
      plot(alarmReport.index,alarmReport,"*")
    title(name)
    grid("on")
    show()
    print("Number of hours when devices should be OFF: %d " % nbAlarms)
    
    
