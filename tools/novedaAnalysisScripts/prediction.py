# coding: utf-8
import pandas
import numpy as np
import pylab
from datetime import time
from sklearn import svm

close("all")

# Data file: assume it is hourly data (this is not a strong assumption panda can easily resample data)
path = '../dl/20131208/csvdata/'
outputpath = '../predictionModel/'


ignoreLastDay = 1

for filename in glob.glob(path+'*Hour_Data.csv'):

  consSuffix = "Utility Grid"
  consLabel = ""
  tempLabel = "OA Temp"

  # Load data
  data = pandas.read_csv(filename,header=None,names=["ts","val","name"])
  data.index = pandas.to_datetime(data.pop('ts'),unit='s')


  for name in unique(data.name):
    if consSuffix in str(name):
      consLabel = name

  # resample: get buisness-day average temperature and buisness-day average consumption
  avgTemp = data[data.name == tempLabel].val.resample("B", how=["mean"])
  avgCons = data[data.name == consLabel].val.resample("B", how=["mean"])

  join = avgTemp.join(avgCons,lsuffix="_temp", rsuffix="_cons")

  #Fix:in the csv files some temperatures are unset (i.e. =0)
  # let's remove that
  join = join[join.mean_temp != 0]

  #Support Vector Regression
  clf = svm.SVR(gamma=.001)
  clf.fit(zip(join.mean_temp[:-1-ignoreLastDay]), join.mean_cons[:-1-ignoreLastDay]) 


  # Then we can predict the power consumption for any temperature t, like that:
  #clf.predict([[t]])


  # Plot the model
  bldgLabel=filename.rpartition("/")[2].partition(".")[0]
  sortedTemp = join.mean_temp.copy()
  sortedTemp.sort()
  figure()
  plot(join.mean_temp,join.mean_cons,"*")
  plot(sortedTemp,clf.predict(zip(sortedTemp)),"r-",lw=2)
  grid("on")
  title(bldgLabel)
  xlabel("Temperature")
  ylabel("Utility Grid")
  legend(["data","prediction"],loc=2)
  show()
  savefig(outputpath+bldgLabel+".png")