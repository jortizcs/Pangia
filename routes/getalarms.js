var	  conf = require('nconf')
	, db = require('../db')
	, fs = require('fs')
	, timezoneJS = require('timezone-js');
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

exports.getDataAlarms = function(user, id, done) {
    var data_alarms = [];
	getAlarms(user, id, function(alarms){
        alarms.toArray(function(err,documents){
            if(err!=null){
                console.log(err)
            }
    		for(i=0;i<documents.length;i++){
                var data = documents[i];
				var alarm_set = [];
				var alarm_array = [];
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
				getTsData(user, id, new_start, new_end, label1,
				function(data4_label1) {
					getTsData(user, id, new_start, new_end, label2,
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
						//pushAlarm(data_array);
                        data_alarms.push(data_array);
                        if(data_alarms.length>=documents.length){
                            done(data_alarms);
                        }
					});
				});
            }
            if(documents.length==0){
                done(data_alarms);
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

function getTsData(user, id, st_date, et_date, label, done) {
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
		+ '&m=sum:15m-avg:sbs.' + user + '.' + id + '{label=' + label + '}';
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

function getAlarms(user, id, done) {
	db.alarms.find({"$query": {"username":user, "id":id}, "$orderby": {"deviation": -1}}, 
	function (err, result) {
		done(result.limit(15));
	});
// 	var query = "select start, end, label01, label02 from alarms where username=? and id=? order by alarms.deviation desc limit 0, 15";	//Only 10 alarms are shown in the "chart" page
// 	var stmt = db.conn.initStatementSync();
// 	stmt.prepareSync(query);
// 	stmt.bindParamsSync([ user, id ]);
// 	stmt.executeSync();
// 	var rows = stmt.fetchAllSync();
	// TODO create error condition if fetchAllSync fails
// 	return rows;
}
