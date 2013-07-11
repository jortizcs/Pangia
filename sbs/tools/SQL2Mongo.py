#!/usr/bin/env python2


import MySQLdb as mdb
from pymongo import MongoClient

SQLserver="localhost";
SQLuser="root";
SQLpwd="root";
SQLdb="sbs";


dbname = "pangia"

##Initialization of the connection to the MySQL databse
client = MongoClient()
alarmsColl = client[dbname].alarms 
dataColl = client[dbname].data

SQLconn = mdb.connect(SQLserver, SQLuser, SQLpwd, SQLdb)
SQLcur1 = SQLconn.cursor()


SQLcur1.execute("SELECT id, username, filepath, ts from data");


for dataIn in SQLcur1.fetchall();
	mId = dataColl.insert({"username":data[1], "filepath":data[2], "ts":data[3]});

	SQLcur2 = SQLconn.cursor();
	SQLcur2.execute("SELECT username, start, end, label01, label02, deviation from alarms where id=%s",(dataIn[0],))
	for alarmIn in SQLcur2.fetchall():
		alarmsColl.insert({"id":mId, "username":alarmIn[0], "start":alarmIn[1] , "end":alarmIn[2], "label01":alarmIn[3], "label02":alarmIn[4], "deviation":alarmIn[5]})
