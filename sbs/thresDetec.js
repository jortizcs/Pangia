var conf  = require('nconf'),
    db    = require('../db'),
    hashtable = require('jshashtable');


exports.detector = function(){
	this.lowThres  = new hashtable();
	this.highThres = new hashtable();
	var this_detec = this;

	this.init = function(bldg_id,done){	
		db.streams.find({'bldg_id': bldg_id}).each(function(err,stream){
			if(stream!=null){
				if(stream.lower_bound!=undefined){
					this_detec.lowThres.put(stream.name,stream.lower_bound);
				}
				if(stream.upper_bound!=undefined){
					this_detec.highThres.put(stream.name,stream.upper_bound);
				}
			}
			else{
				done(this_detec.eval);
			}
		});
	}

	//Return true if the value is lower/higher than the thresholds, false otherwise
	this.eval= function(pointname,value){
		var low = this_detec.lowThres.get(pointname);
		var high = this_detec.highThres.get(pointname);
console.log("----------");
console.log(pointname);
console.log(value);
console.log(low)
console.log(high)
		if((low!=null && value<low) || (high!=null && value>high)){
			return true;
		}
		return false;
	}
}

