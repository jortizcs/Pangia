var db        = require('../db'),
    hastTable = require('../public/lib/js/hashtable');


exports.detector = function(){
	this.lowThres = new hashTable.HashTable();
	this.highThres = new hashTable.HashTable();
	this.init = function(bldg_id,done){
		db.streams.find({'bldg_id': bldg_id}).each(function(err,stream){
			if(stream!=null){
				lowThres.put(stream.name,stream.lower_bound);
				highThres.put(stream.name,stream.upper_bound);
			}
			else{
				done(this.eval);
			}
		});
	}

	//Return true if the value is lower/higher than the thresholds, false otherwise
	this.eval= function(pointname,value){
		if(value<this.lowThres.get(pointname) || value>this.highThres.get(pointname)){
			return true;
		}
		return false;
	}
}

