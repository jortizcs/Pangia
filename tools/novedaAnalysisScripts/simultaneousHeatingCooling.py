# coding: utf-8
import pandas
import numpy as np
import pylab
from datetime import time
import glob

close("all")

# Data directory: assume it is hourly data (this is not a strong assumption panda can easily resample data)
path = '../dl/20131208/csvdata/'
outputpath = '../simultaneousHC/'

heaterNicknames = ["Heat","heat","HVAC"]    #TODO this is temporary
coolerNicknames = ["Cool", "cool","Chiller"]#TODO this is temporary

#for filename in glob.glob(path+'*Hour_Data.csv'):
for filename in [path+"New_Rochelle_NY_Day_Data.csv"]:#TODO this is temporary
  print filename

  # Load data
  data = pandas.read_csv(filename,header=None,names=["ts","val","name"])
  data.index = pandas.to_datetime(data.pop('ts'),unit='s')

  heaterName=""
  coolerName=""

  # get the name of the Heater and Cooler
  for name in unique(data.name):
    for nick in heaterNicknames:
      if nick in name:
        heaterName = name
    for nick in coolerNicknames:
      if nick in name:
        coolerName = name


  # Compute devices modes (ON/OFF)
  modes = []
  values = []
  for i,name in enumerate([heaterName,coolerName]):
        
    #compute threshold using moving average for the last week
    values.append(data[data.name == name].val)
    median = pandas.rolling_median(values[i] , 24*7 )
    
    modes.append(values[i]>median) 
    
    
  ## Find where both devices are ON
  alarms = modes[0] & modes[1]
  alarmReport = alarms[alarms == True]
  nbAlarms = len(alarmReport)
      
  if nbAlarms:
    #record alarms in a csv file
    alarmReport.to_csv("%s%s_%s_alarms.csv" % (outputpath,filename.rpartition("/")[2], name))
      
    
  ## plot data, threshold and alarms
  figure()
  for i in range(2):
    plot(values[i].index,values[i])
  
  if nbAlarms:
    plot(alarmReport.index,alarmReport,"*")
  title(name)
  grid("on")
  show()
  print("Duration of simultaneous Heating and Cooling: %d hours" % nbAlarms)
  