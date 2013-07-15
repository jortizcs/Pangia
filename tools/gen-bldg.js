// Always init the configuration before all else.
var conf = require('nconf');
conf.argv()
	.env()
	.file({ file: './config.json' });

var db = require('../db')
  , prompt = require('prompt');

function onErr(err) {
  console.log(err);
  return 1;
}

var properties = [
  {
    name: 'username'
  },
  {
    name: 'buildingname'
  }
];

var run = function() {
  prompt.message = 'new building';
  
  prompt.start();
  prompt.get(properties, function (err, result) {
    if (err) {
      return onErr(err);
    }
  
    var username = result.username;
    var bldgname = result.buildingname;
 
    db.users.findOne( { 'username': username },
	    function(err,user){
        	if(err!=null){
            		console.log(err)
       	 	}
		if(user!=null){
			db.bldgs.save({ 'name':bldgname, 'user_id': user._id }, 
			function(err, bldg){
				if(err!=null){
					console.log(err);
				}
			});
		}
		db.db.close();	
    });

  });
}

db.startDb(run);
