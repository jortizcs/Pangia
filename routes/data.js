var conf = require('nconf');
var db = require('../db');


exports.getData = function(bldg_id, done) {
	var files = [];

	db.data.find({ 'bldg_id' : bldg_id }).each( function(err,data){
		if(data!=null){
			db.alarms.find({ 'username': user, 'id': data._id}).count(function(err,nb_alarms){
				files.push({
				name: data.filepath,
				date: data.ts,
				severity: '--',
				num_alarms: nb_alarms,
				tags: '--',
				id: data._id.toString()
				});
			});
		}
		else{
			done(files);
		}
	});
}
