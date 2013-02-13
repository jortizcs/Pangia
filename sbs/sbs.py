"""
The Strip, Search and Bind method
=================================

The Strip, Bind and Search (SBS) method uncovers abnormalities in equipment behavior and in-concert usage.
SBS uncovers relationships between devices and constructs a model for their in-concert usage.
It then flags deviations from the model as abnormal.
"""


import scipy as sp;
import numpy as np;
import matplotlib.pyplot as plt;

from scipy import interpolate;
from scipy.signal import butter;
from scipy.signal import filtfilt

from collections import deque

###!!! NEEDED for python 2.x ?
#from __future__ import division


class SBS:
  
  def __init__(self):
    """
    Initialize the SBS object
    """
    ###### Parameters ######
    ### TODO: make a config file?
    
    # Parameters for the sliding window (the unit is seconds)
    self.windowSize = 24*3600; # Size of the sliding time window 
    self.windowTail = -1;
    self.windowStep = self.windowSize;
    self.samplingRate = 300;
    self.ratioFilledBuffer = 0.5;  # Detect abnormalities when at least ratioFilledBuffer*100% of the sensors provided enough data
    
    # used only for log
    self.nbIter = 0;

    # Data structures
    ## strip (signals)
    self.buffer = dict();
    self.filteredData = None;
    self.filteredSensors = None;      # Name of the sensors for each entry in filteredData
    # Parameters for the filter bank
    self.cutoffHigh = 20*60;
    self.cutoffLow  = 360*60;
    self.butterOrder = 5;
    
    
    ## bind (correlation matrix)
    self.currBehavior = None;
    
    
    ## search (normal behavior of the devices)
    self.bootstrapDetection = True;
    self.histBehavior = deque();
    self.histBehaviorChange = dict();
    self.histBehaviorSize=30;
    self.lnorm = 4.0;
    self.detectionThreshold = 5.0;
    
  
  
  ############### STRIP ############### 
  def strip(self):
    """
    Filter the data in order to uncover the intrinsic usages of the sensors.
    The filtered signals are stored in the filteredData attribute.
    """
    
    ###TODO clean the buffer? remove all sensors without data /// No! it might mess up the "search"...?
    
    #print("strip...")
    
    self.filteredData = np.zeros( (len(self.buffer), self.windowSize/float(self.samplingRate)) )
    self.filteredSensors = dict();
    _nullFct = lambda x : np.zeros(len(x))
    
    # Get the right sampling rate
    # And filter the data
    xSample = np.arange(self.windowTail, self.windowTail+self.windowSize, self.samplingRate);
    nyq = 0.5*1.0/self.samplingRate;
    lowCut  = 1.0/self.cutoffLow;
    highCut = 1.0/self.cutoffHigh;
    Wn = [lowCut/nyq, highCut/nyq]
    ind = 0;
    for sen, dat in self.buffer.items():
      ##sample the buffer
      rawData = np.array(dat)
      if np.size(rawData,0)<2: # If the buffer is empty
        f = _nullFct
        print("Warning: buffer is empty!")
      else:
        f = interpolate.interp1d(rawData[:,0],rawData[:,1],copy=False,bounds_error=False,fill_value=0)

      ##filter the sampled buffer
      #[b1,a1] = butter(butterOrder,highCut/nyq,btype="highpass");
      #dataFiltered1 = filtfilt(b1,a1,dataSample); # high pass filter

      [b2,a2] = butter(self.butterOrder,Wn,btype="bandpass");
      self.filteredData[ind,:] = filtfilt(b2,a2,f(xSample))[:]; # band pass filter
      self.filteredSensors[sen] = ind;

      #[b3,a3] = butter(butterOrder,lowCut/nyq,btype="lowpass");
      #dataFiltered3 = filtfilt(b3,a3,dataSample); # low pass filter

      ind+=1;
      
    
  ############### BIND ############### 
  def bind(self):
    """
    Reveal the inter-devices usages by computing the correlation of filtered data.
    The correlation matrix is stored in the attribute currBehavior.
    """
    #print("bind...{0}".format(np.shape(self.filteredData)))
    
    self.currBehavior = np.corrcoef(self.filteredData);
    self.currBehavior[np.isnan(self.currBehavior)]=0
    self.currBehavior[np.diag_indices_from(self.currBehavior)]=1
    
    
  ############### SEARCH ############### 
  def search(self):
    """
    Detect abnormal behaviors
    """
    alarms = []
    if np.size(self.histBehavior,0) < self.histBehaviorSize:
      return alarms
    else:
      
      #print("search...")
      # Compute the normal behavior
      R = np.median(self.histBehavior,axis=0) 	# Reference matrix
      
      if len(self.histBehaviorChange) == 0:
        # Bootstrap: for the first histBehaviorSize bins the behavior change is computed witht the same reference matrix
        for sen in self.filteredSensors.keys():
          self.histBehaviorChange[sen] = deque();
        
        for t in range(self.histBehaviorSize):
          for sen, i in self.filteredSensors.items():
            #Compute the behavior change (l_it) for the current correlation matrix
            l_it=.0
            Ri = float(sum(R[i,:]))
            for j in range(len(self.histBehavior[t])):
              l_it += np.power((R[i,j]/ Ri)*(self.histBehavior[t][i,j]-R[i,j]),self.lnorm)
            
            l_it = np.power(l_it,1.0/self.lnorm)
            self.histBehaviorChange[sen].append(l_it)
        
        #Detection in the bootstrap data
        if self.bootstrapDetection:
          for sen, i in self.filteredSensors.items():
            c=0.6745
            l_i = self.histBehaviorChange[sen]
            thres = np.median(l_i)+self.detectionThreshold*(np.median(abs(l_i-np.median(l_i)))/c)
            for t in range(self.histBehaviorSize):
              l_it = self.histBehaviorChange[sen][t]
              # Compare the behavior change with past behaviors
              if l_it > thres:
                #print("Time bin {3}: {0}: from {1} to {2}".format(sen,self.windowTail+(t-self.histBehaviorSize)*self.windowSize,self.windowTail+(1+t-self.histBehaviorSize)*self.windowSize,t))
                alarms.append({"id":sen, "start":self.windowTail+(t-self.histBehaviorSize)*self.windowSize, "end":self.windowTail+(1+t-self.histBehaviorSize)*self.windowSize, "div":l_it})
            
            
        print("Bootstrap done!")
        # End of Bootstrap, note that no alarm will be raised for the histBehaviorSize first time bins
      
      for sen, i in self.filteredSensors.items():
        #Compute the behavior change (l_it) for the current correlation matrix
        l_it=.0
        Ri = float(sum(R[i,:]))
        for j in range(len(self.currBehavior)):
          l_it += np.power((R[i,j]/ Ri)*(self.currBehavior[i,j]-R[i,j]),self.lnorm)
        
        l_it = np.power(l_it,1/self.lnorm)
        
        # Compare the behavior change with past behaviors
        c=0.6745
        l_i = self.histBehaviorChange[sen]
        if l_it > np.median(l_i)+self.detectionThreshold*(np.median(abs(l_i-np.median(l_i)))/c):
          #print("Time bin {3}: {0}: from {1} to {2}".format(sen,self.windowTail,self.windowTail+self.windowSize,self.nbIter))
          alarms.append({"id":sen, "start":self.windowTail, "end":self.windowTail+self.windowSize, "div":l_it})
        # Store the behavior change
        self.histBehaviorChange[sen].append(l_it)    
      
    #print("detection done")
    return alarms
    
  ############### OTHERS  ############### 
   
  def addSample(self, sample):
    """
    Add the given samples to the current time window.
    If the time window is completed the SBS method is executed.
    
    Parameters
    ----------
    sample : list
      List of tuples containing the new samples. Each tuple is in the form (sensorID, timestamp, value).

    Returns
    -------
    alarm : list
      List of the alarms reported by SBS. 
      Each alarm is a tuple in the form (sensorID, start-time, end-time, divergence); the timestamp is the begining of the last analyzed time window and the divergence correspond to the distance from the normal behavior of the sensor sensorID. Larger distance means severe misbehavior.
    """
    
        
    # Initialize the window tail for the first added sample 
    if self.windowTail == -1:
      self.windowTail = min([samp[1] for samp in sample])
    
    
    # Add the new samples to the buffer
    for sen, time, val in sample:
      if not sen in self.buffer:
        self.buffer[sen] = deque()
      self.buffer[sen].append( (time,val) )
    
    nbFilledBuffer=0
    for sen, dat in self.buffer.items():
      if dat[-1][0] > self.windowTail+self.windowSize:
        nbFilledBuffer+=1
    
    # Execute Strip, Bind and Search if the buffer is full
    res = None
     
    if nbFilledBuffer > len(self.buffer)*self.ratioFilledBuffer:
      self.nbIter += 1
      
      #STRIP
      self.strip()
      #BIND
      self.bind()
      #SEARCH
      res = self.search()
      
      # Slide the time window
      self.windowSlide()
      
    return res
   
   
  def windowSlide(self):
    """
    Slide the time window (the step size is given by the attribute windowStep), clean the buffers and store the last correlation matrix in histBehavior.
    """
    
    #print("window slide")
    
    # Shrink the buffer
    for sen, dat in self.buffer.items():
      while len(dat) and dat[0][0]< self.windowTail:
          #TODO the buffer is twice larger than the time bin (make it tunable?)
          dat.popleft()
      
      
    # Store the correlation matrix (devices behavior)
    self.histBehavior.append(self.currBehavior)
    if np.size(self.histBehavior,0) > self.histBehaviorSize:
      self.histBehavior.popleft()
      for sen in self.histBehaviorChange.keys():
         self.histBehaviorChange[sen].popleft()
    
    # Slide the window
    self.windowTail += self.windowStep
    