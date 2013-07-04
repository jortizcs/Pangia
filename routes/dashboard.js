var conf = require('nconf');
var db = require('../db');

//TODO Change the _id.toString() by proper index

exports.getReports = function(user) {
	var reports = [];

	db.data.find({ 'username' : user }).each( function(err,data){
		if(data!=null){
			db.alarms.find({ 'username': user, 'id': data._id.toString()}).count(function(err,nb_alarms){
				reports.push({
				name: data.filepath,
				date: data.ts,
				severity: '--',
				num_alarms: nb_alarms,
				tags: '--',
				id: data._id.toString()
				});
			});
		}
	});

	return reports;
}
