var	  conf = require('nconf')
	, db = require('../db')
	, fs = require('fs')
	, timezoneJS = require('timezone-js')
	, ObjectID = require('mongodb').ObjectID;
timezoneJS.timezone.zoneFileBasePath = 'tz';

// From mde/timezone-js example on github (under an Apache License at
// https://github.com/mde/timezone-js/blob/master/spec/test-utils.js):
timezoneJS.timezone.transport = function (opts) {
  // No success handler, what's the point?
  if (opts.async) {
	if (typeof opts.success !== 'function') return;
	opts.error = opts.error || console.error;
	return fs.readFile(opts.url, 'utf8', function (err, data) {
	  return err ? opts.error(err) : opts.success(data);
	});
  }
  return fs.readFileSync(opts.url, 'utf8');
};

timezoneJS.timezone.init();
var http = require('http');

var tsdbShim_host = conf.get('tsdbShim_host');
var tsdbShim_port = conf.get('tsdbShim_port');



exports.getDataAlarmsDate = function(user_id, bldg_id, date, done){
	if(date==""){   // If the date is not given, show the last month report
		db.alarms.findOne({"$query": {"bldg_id":bldg_id}, "$orderby": {"start": -1}},function(err, alarm){
		date = ".*"; 
		if(alarm){
			var year = alarm.start.substring(0,4);
			var month = alarm.start.substring(5,7);
			date = year+"-"+month+".*";
		}
		getDataAlarms(user_id, bldg_id, date, done);
	
		});
	}
	else{	
		getDataAlarms(user_id, bldg_id, date+".*", done);
	//	var monthStr = ("0" + month).slice(-2);   // Write month on two digits
	}
}



function getDataAlarms(user_id, bldg_id, date, done) {  
	var data_alarms = [];



	getAlarms(bldg_id, date, function(alarms,count){
		alarms.each(function(err,data){
		if(err!=null){
			console.log(err)
		}
		if(data!=null){
			var alarm_set = [];
			var alarm_array = [];
			var alarmId = data._id;
			var useful = data.useful;
			// The values we get are SQL dates.
			var start = data.start;
			var end = data.end;
			var label1 = data.label01;
			var label2 = data.label02;
			// GMT-0800 is PST
			var start_dt = new timezoneJS.Date(start, 'America/Los_Angeles');
			var end_dt = new timezoneJS.Date(end, 'America/Los_Angeles');
			//for each alarm, extend the start time and end time
			var diff =  2* (end_dt.getTime() - start_dt.getTime());
			var new_start = new timezoneJS.Date(start_dt.getTime() - diff);
			var new_end = new timezoneJS.Date(end_dt.getTime() + diff);
			//fetch the data for the new alarm start time and end time
			getTsData(user_id, bldg_id, new_start, new_end, label1,
			function(data4_label1) {
				getTsData(user_id, bldg_id, new_start, new_end, label2,
				function(data4_label2) {
					var data_obj1 = {
						'label': label1,
						'data': data4_label1
					};
					var data_obj2 = {
						'label': label2,
						'data': data4_label2
					};
					// First we convert to seconds, then we add 8 hours because of
					// some messed up time zone conversions. 
					var pair = [ start_dt.getTime() / 1000,
						end_dt.getTime() / 1000 ];
					alarm_set = [];
					alarm_set.push(pair);
					var data_array = [];
					data_array.push(data_obj1);
					data_array.push(data_obj2);
					data_array.push(alarm_set);
            				data_array.push(alarmId);
            				if (useful) {
						  pushAlarm(useful);
            				}
		                        data_alarms.push(data_array);

					if(data_alarms.length>=count){
						done(data_alarms);
					}
			});
		});
            }
      });
    });
}

// Given a timezoneJS.Date object, returns a string of the date in the
// format: "Y/m/d-H:i:s"
function numToString(n) {
	return ((n < 10) ? "0" : "") + String(n);
}

function formattedDateString(d) {
	return d.getFullYear() + "/"
		+ numToString((d.getMonth() + 1)) + "/"
		+ numToString(d.getDate()) + "-"
		+ numToString(d.getHours()) + ":"
		+ numToString(d.getMinutes()) + ":"
		+ numToString(d.getSeconds());
}

function getTsData(user_id, bldg_id, st_date, et_date, label, done) {
	//the time zone is ignored
	// opentsdb issue
	// https://groups.google.com/forum/?fromgroups=#!topic/opentsdb/-Gy3MWpqAjo
	//add 8 hours -- opentsdb issue, but only for matching times in the database
//	st_date = new timezoneJS.Date(start.getTime() , 'America/Los_Angeles');
//	et_date = new timezoneJS.Date(end.getTime()  , 'America/Los_Angeles');

	// var st_date = new timezoneJS.Date(st, 'America/Los_Angeles');
	// We want a date in the format: "Y/m/d-H:i:s", and opentsdb does some
	// funky stuff with timezones.done
	//var st_format = formattedDateString(
	//	new timezoneJS.Date(st_date.getTime(), 'Etc/UTC'));
	var st_format = formattedDateString(st_date);

	// See above comments
	// var et_date = new timezoneJS.Date(et, 'America/Los_Angeles');
	//var et_format = formattedDateString(
	//	new timezoneJS.Date(et_date.getTime(), 'Etc/UTC'));
	var et_format = formattedDateString(et_date);

	var query = 'http://' + tsdbShim_host + ':' + tsdbShim_port +'/q?start=' + st_format + '&end=' + et_format
		+ '&m=sum:15m-avg:sbs.' + user_id.toString() + '.' + bldg_id.toString() + '{label=' + label + '}';
	var fullBody = "";

	http.get(query, function (res) {
		res.on('data', function (data) {
			fullBody += data;
		});
		res.on('end', function(){
			done(JSON.parse(fullBody));
		});
	}).on('error', function (e) {
		console.log('Got an error trying to make otsdb request: ' + e.message);
	});
}

function getAlarms(bldg_id, date, done) {
	var limit = 15;

	var cur = db.alarms.find({"$query": {"bldg_id":bldg_id, "start": new RegExp(date) }, "$orderby": {"priority": -1, "deviation": -1}}).limit(limit);

	db.alarms.find({"bldg_id":bldg_id, "start": new RegExp(date)  }).count(function(err,cnt){
		console.log(cnt);
			var nbalarms = cnt;
			if(cnt>limit){nbalarms=limit;}	
			done(cur,nbalarms);
		});
}

exports.setUseful = function(user, reportId, isUseful) {
  db.alarms.save({ "_id": new db.mongo.ObjectID(reportId), "useful": isUseful }, { safe: true }, function () {});
};
