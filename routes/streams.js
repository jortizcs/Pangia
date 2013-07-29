var conf = require('nconf');
var db = require('../db');


exports.getStreams = function(bldg_id, done) {
	var streams = [];

	db.streams.find({"$query": {"bldg_id":bldg_id}, "$orderby": {"priority": -1}}).each( function(err,stream){
		if(stream!=null){
			streams.push({
			name: stream.name,
			priority: stream.priority,
			upper_bound: '+inf',
			lower_bound: '-inf'
			});
		}
		else{
			done(streams)
		}
	});
}


exports.setStreamPriority = function(stream_id, priority){

	if(priority>1){priority=1;}
	if(priotity<-1){priority=-1;}

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
