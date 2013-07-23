var conf = require('nconf');
var db = require('../db');


exports.getBldgs = function(user_id, done) {
	var bldgs = [];

	db.bldgs.find({ 'user_id' : user_id }).each( function(err,bldg){
		if(bldg!=null){
			bldgs.push({
			name: bldg.name,
			status: '--',
			tags: '--',
			bldg_id: bldg._id.toString()
			});
		}
		else{
			done(bldgs)
		}
	});
}
