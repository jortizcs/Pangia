var conf = require('nconf');
var db = require('../db');

exports.getReports = function(user) {
	var reports = [];

	db.data.find({ 'username' : user }).each( function(err,data){
		if(data!=null){
			db.alarms.find({ 'username': user}).count(function(err,nb_alarms){
				reports.push({
				name: data.filepath,
				date: data.ts,
				severity: '--',
				num_alarms: nb_alarms,
				tags: '--',
				id: data.id
				});
			});
		}
	});

	return reports;
}
