var fs = require('fs');
var timezoneJS = require('timezone-js');
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
var mysql = require('mysql-libmysqlclient');

var mysql_host = 'localhost';
var otsdb_host = 'localhost';
var otsdb_port = 4242;

var conn = mysql.createConnectionSync();
conn.connectSync('localhost', 'root', 'root', 'sbs');

exports.getDataAlarms = function(user, id, done) {
	var alarms = getAlarms(user, id);
	var data_alarms = [];

	var eachAlarm = function (alarms, i) {
		if (alarms.length == i) {
			done(data_alarms);
			return;
		}

		var alarm_set = [];
		var alarm_array = [];
		// The values we get are in seconds since epoch, but JS dates are in
		// milliseconds since epoch, so we convert here.
		var start = Number(alarms[i]['start']);
		var end = Number(alarms[i]['end']);
		var label1 = alarms[i]['label01'];
		var label2 = alarms[i]['label02'];
		// GMT-0800 is PST
		var start_dt = new timezoneJS.Date(start, 'America/Los_Angeles');
		var end_dt = new timezoneJS.Date(end, 'America/Los_Angeles');

		//for each alarm, extend the start time and end time
		var diff = 2 * (end - start);
		var new_start = start - diff;
		var new_end = end + diff;

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
				var pair = [ start_dt.getTime() / 1000 + 28800,
					end_dt.getTime() / 1000 + 28800 ];
				alarm_set = [];
				alarm_set.push(pair);

				var data_array = [];
				data_array.push(data_obj1);
				data_array.push(data_obj2);
				data_array.push(alarm_set);
				data_alarms.push(data_array);

				eachAlarm(alarms, i + 1);
			});
		});
	};
	eachAlarm(alarms, 0);
}

// Given a timezoneJS.Date object, returns a string of the date in the
// format: "Y/m/d-H:i:s"
function numToString(n) {
	return ((n < 10) ? "0" : "") + String(n);
}

function formattedDateString(d) {
	return d.getUTCFullYear() + "/"
		+ numToString((d.getUTCMonth() + 1)) + "/"
		+ numToString(d.getUTCDate()) + "-"
		+ numToString(d.getUTCHours()) + ":"
		+ numToString(d.getUTCMinutes()) + ":"
		+ numToString(d.getUTCSeconds());
}

function getTsData(user, id, st, et, label, done) {
	//the time zone is ignored

	// opentsdb issue
	// https://groups.google.com/forum/?fromgroups=#!topic/opentsdb/-Gy3MWpqAjo
	//add 8 hours -- opentsdb issue, but only for matching times in the database
	st += 28800000;
	et += 28800000;

	var st_date = new timezoneJS.Date(st, 'America/Los_Angeles');
	// We want a date in the format: "Y/m/d-H:i:s", and opentsdb does some
	// funky stuff with timezones.
	//var st_format = formattedDateString(
	//	new timezoneJS.Date(st_date.getTime(), 'Etc/UTC'));
	var st_format = formattedDateString(st_date);

	// See above comments
	var et_date = new timezoneJS.Date(et, 'America/Los_Angeles');
	//var et_format = formattedDateString(
	//	new timezoneJS.Date(et_date.getTime(), 'Etc/UTC'));
	var et_format = formattedDateString(et_date);

	var query = 'http://' + otsdb_host + ':' + otsdb_port 
		+ '/q?start=' + st_format + '&end=' + et_format
		+ '&m=sum:sbs.' + user + '.' + id + '{label=' + label + '}';

	http.get(query, function (res) {
		res.on('data', function (data) {
			done(JSON.parse(data));
		});
	}).on('error', function (e) {
		console.log('Got an error trying to make otsdb request: ' + e.message);
	});
}

function getAlarms(user, id, done) {
	var query = "select start, end, label01, label02 from alarms where username=? and id=?";
	var stmt = conn.initStatementSync();
	stmt.prepareSync(query);
	stmt.bindParamsSync([ user, id ]);
	stmt.executeSync();
	var rows = stmt.fetchAllSync();
	// TODO create error condition if fetchAllSync fails
	return rows;
}
