# coding: utf-8
import pandas
import numpy as np
import pylab
from datetime import time
from sklearn import svm
import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')
from matplotlib import pyplot as plt
import glob
import sys

ignoreLastDay = 1


def predict(dataFiles,tempPredicted,outputFile=None,figDirectory=None):
 print "Enter predict"
 for filename in glob.glob(dataFiles):

  consSuffix = "Utility Grid"
  consLabel = ""
  tempSuffix = "Outside Temp F"   #"OA Temp"
  tempLabel = ""   #"OA Temp"

  # Load data
  data = pandas.read_csv(filename,header=None,names=["ts","val","name","type"],usecols=["ts","val","name"])
  data.index = pandas.to_datetime(data.pop('ts'),unit='s')

  for name in np.unique(data.name):
    if consSuffix in str(name):
      consLabel = name
    if tempSuffix in str(name):
      tempLabel = name

  sys.stderr.write(consLabel+"\n")
  sys.stderr.write(tempLabel+"\n")



  # resample: get buisness-day average temperature and buisness-day average consumption
  avgTemp = data[data.name == tempLabel].val.resample("B", how=["mean"])
  avgCons = data[data.name == consLabel].val.resample("B", how=["mean"]).diff()
  
  
  if not (len(avgTemp)>30 and len(avgCons)>30):  # TODO remove this and bootstrap data files properly...
    sys.stderr.write("Not enough data to do the prediction\n")
    continue

  join = avgTemp.join(avgCons,lsuffix="_temp", rsuffix="_cons")

  #Fix:in the csv files some temperatures are unset (i.e. =0)
  # let's remove that
  join = join[join.mean_temp != 0]

  #Support Vector Regression
  clf = svm.SVR(gamma=.001)
  clf.fit(zip(join.mean_temp[:-1-ignoreLastDay]), join.mean_cons[:-1-ignoreLastDay]) 


  # Then we can predict the power consumption for any temperature t, like that: clf.predict([[t]])
  consPrediction = clf.predict([[tempPredicted]])[0]
  print consPrediction

  if outputFile:
    fOut = open(outputFile,"w")
    fOut.write(str(consPrediction))
    fOut.close()

  # Plot the model
  if figDirectory:
    bldgLabel=filename.rpartition("/")[2].partition(".")[0]
    sortedTemp = join.mean_temp.copy()
    sortedTemp.sort()
    plt.figure()
    plt.plot(join.mean_temp,join.mean_cons,"*")
    plt.plot(sortedTemp,clf.predict(zip(sortedTemp)),"r-",lw=2)
    plt.grid("on")
    plt.title(bldgLabel)
    plt.xlabel("Temperature")
#    plt.show()
    plt.ylabel("Main Utility Grid")
    plt.legend(["data","prediction"],loc=2)
    plt.savefig(figDirectory+bldgLabel+".png")


if __name__ == "__main__":
  predict('../dl/20131208/csvdata/941_Lexington_Hour_Data.csv',70,'test.csv','../predictionModel/')
