var conf = require('nconf');
var db = require('../db');


exports.getStreams = function(bldg_id, done) {
	var streams = [];

	db.streams.find({"$query": {"bldg_id":bldg_id}, "$orderby": {"priority": -1}}).each( function(err,stream){
		if(stream!=null){
			streams.push({
			name: stream.name,
			priority: '--',
			upper_bound: '+inf',
			lower_bound: '-inf'
			});
		}
		else{
			done(streams)
		}
	});
}
