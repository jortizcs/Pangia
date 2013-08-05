var conf = require('nconf');
var db = require('../db');


exports.getStreams = function(bldg_id, done) {
	var streams = [];

	db.streams.find({"$query": {"bldg_id":bldg_id}, "$orderby": {"priority": -1}}).each( function(err,stream){
		if(stream!=null){
			var priority = stream.priority;
			if(priority==undefined) priority=1;

			streams.push({
			id: stream._id,
			name: stream.name,
			priority: priority,
			upper_bound: stream.upper_bound,
			lower_bound: stream.lower_bound
			});
		}
		else{
			done(streams)
		}
	});
}


exports.setStreamPriority = function(stream_id, priority, done){

	if(priority>2){priority=2;}
	if(priority<0){priority=0;}

	db.streams.update({"_id":stream_id}, {$set: {"priority":priority}}, 
		function(err,modif){	
			if(err){
				console.log(err);
				done(404);
			}
			else{
				done(200);
			}
		});
}

exports.setStreamBound = function(stream_id, value, type, done){
	var boundLabel;
	if(type=="upper_bound" || type=="lower_bound"){
		boundLabel=type;

		var update = {};
		update[boundLabel] = value;
		db.streams.update({"_id":stream_id}, {$set: update}, 
			function(err,modif){	
				if(err){
					console.log(err);
					done(404);
				}
				else{
					done(200);
				}
			});
	}
	else{
		done(404);
	}
}
