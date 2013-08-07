var  conf  = require('nconf')
  ,  fs    = require('fs')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec
//  ,  mysql = require('mysql-libmysqlclient')
  ,  net = require('net')
  ,  lazy = require('lazy')
  ,  db   = require('../db')
  ,  hashtable = require('jshashtable')
  ,  thresDetec = require('../sbs/thresDetec');

var otsdb_host = conf.get('otsdb_host');
var otsdb_port = conf.get('otsdb_port');

var db_name = conf.get('db_name');
var mongo_host = conf.get('mongo_host');
var mongo_port = conf.get('mongo_port');



// Record the upload in mongodb
// Create the corresponding metric in OTSDB
// Copy the data to OTSDB
exports.analyzeData = function(user_id, bldg_id, filename,user_email) {
	db.data.save({ "user_id": user_id, "filepath": filename , "bldg_id":bldg_id, "ts": new Date()},	function(err, data){
			if(err!=null){
				console.log(err);
			}
			// create the TSDB metric and copy the data
			// then run SBS
			var ts;
			var child = exec('tsdb mkmetric sbs.' + user_id.toString() + '.' + bldg_id.toString() , 
			function (error, stdout, stderr){ 
				if (error != null) {
					console.log('exec error: ' + error);
				}else{
					console.log('Copying data to otsdb... ('+data.user_id+', '+bldg_id.toString()+', '+data.filepath+')\n')
					copyFile2Tsdb( data.user_id, data._id, data.filepath, bldg_id,user_email);
				}
			});
		});
}


// Copy the data to OTSDB
function copyFile2Tsdb(user_id, data_id, filename, bldg_id, user_email) {

    
// Connect to the tsdb server
var client = new net.Socket();
client.connect(otsdb_port, otsdb_host,
    function(){
      var startTS = 0;
      var endTS = 0;

      var streamsName  = new hashtable();
      var thresAlarms = new hashtable();
  
      // Send the data
      // TODO parse/validate the file format
      // TODO raise and error if something went wrong
       var fr = new lazy(fs.createReadStream(filename));
      
      fr.on('end', function() {
        //client.end();
        
	// Store the streams name in mongodb
	var names = streamsName.keys();
        for(var i=0; i<names.length; i++){
	      db.streams.update({"name": names[i], "bldg_id": bldg_id},{$set: {"name": names[i], "bldg_id": bldg_id}},{"upsert":true},function(err,modif){if(err!=null){console.log(err);}});
	}

	// Store alarms based on the thresholds
	var labels = thresAlarms.keys();
	for(var i=0; i<labels.length; i++){
		db.streams.findOne({"bldg_id": bldg_id, "name": labels[i]},function(err,stream){
			//TODO insert the stream_id NOT its name/label!
			//TODO remove label02 when the alarms with only one label could be displayed
			var TSstart = new Date(thresAlarms.get(stream.name)[0]*1000);
			var TSend   = new Date(thresAlarms.get(stream.name)[1]*1000);
			db.alarms.insert({"label01": stream.name, "label02": stream.name,  "data_id": data_id, "bldg_id":bldg_id,"start":TSstart, "end":TSend, "priority":1000, "type":"threshold" },function(err, alarm){});
		});
	}

	if(labels.length!=0){
	     // send an email for the alarms detected with the tresholds
              var child2 = exec('python sbs/sendEmail.py '+user_email+' "http://166.78.31.162:3000/Pangia/chart?bldg_id='+bldg_id.toString()+'" sbs/email/thresholdReport', 
               function (error, stdout, stderr) {
                  if (error !== null) {
                    console.log('exec error: ' + error);
			//TODO create an email address were we collect errors?
                    reportError('romain@greenpangia.com', 'Error sending the report by email. <br> Error message: <br>'+error);
                  }
                });
	}

        //Run SBS
        console.log('Start SBS... ('+bldg_id.toString()+', '+data_id.toString()+', '+startTS+', '+endTS+')\n')
        runSBS(user_id, bldg_id, data_id, startTS, endTS, filename+'.log',user_email);
        
      });
      
     // Threshold based detector	
     var detec = new thresDetec.detector();
     detec.init(bldg_id,function(detector){

       fr.lines.forEach(
       function (line) { 
          var elem = line.toString().replace(/\s+/g, '').replace(/{|}|\(|\)|\[|\]|%/g, '_').split(',');
          var ts = parseInt(parseFloat(elem[0]));
          
          if(elem[2]!=undefined){
	    streamsName.put(elem[2],0);

            if(startTS == 0){
              startTS = ts;
              endTS = ts;
            }
            else{
              if(startTS>ts){
                startTS=ts;
              }
              if(endTS<ts){
                endTS=ts;
              }
            }
            client.write('put sbs.'+user_id.toString()+'.'+bldg_id.toString()+' '+elem[0]+' '+elem[1]+' label='+elem[2]+'\r\n');

	    // threshold based detection	
	    var ts = parseInt(elem[0]);
            var val = parseInt(elem[1]);
	    if(detector.eval(elem[2],val)){
	  	  if(thresAlarms.containsKey(elem[2])){
	  		  //Update timestamps
			  var currTS = thresAlarms.get(elem[2]);
			  thresAlarms.put(elem[2],[Math.min(currTS[0],ts),Math.max(currTS[1],ts)]);
		  }else{
			  thresAlarms.put(elem[2],[ts,ts]);
		  }
	    }
           }
           else{
             console.log("Error could not retrieve the label of a sensor")
           }
          });
      
    });    
      
  
  client.on('data', function(data) {
	// TODO raise and error if something went wrong
	console.log(data.toString());
  });
});
  
};


// Run SBS and sends an email when it is done
function runSBS(user_id, bldg_id, data_id, start, end, logfile,user_email){
      var child = exec('python sbs/sbsWrapper.py '+otsdb_host+' '+otsdb_port+' '+mongo_host+' '+mongo_port+' '+db_name+' '+data_id.toString()+' '+user_id.toString()+' '+bldg_id.toString()+' '+start+' '+end+' > '+logfile , 
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('stderr: ' + stderr);
              console.log('exec error: ' + error);
              //Sends an email to Romain if something went wrong in SBS...
              reportError('romain@greenpangia.com', 'Error in the function runSBS with the following parameters: <br> id='+data_id.toString()+'<br> user='+user_id.toString()+'<br> start='+start+'<br> end='+end+'<br> Error message:<br>'+error);
              
            }else{              
              var child2 = exec('python sbs/sendEmail.py '+user_email+' "http://166.78.31.162:3000/Pangia/chart?bldg_id='+bldg_id.toString()+'" sbs/email/sbsReport', 
               function (error, stdout, stderr) {
                  if (error !== null) {
                    console.log('exec error: ' + error);
			//TODO create an email address were we collect errors?
                    reportError('romain@greenpangia.com', 'Error sending the report by email. <br> Error message: <br>'+error);
                  }
                });
            }
          }
        );
}


function reportError(email, msg){
  var child2 = exec('python sbs/reportError.py '+email+' "'+msg+'"', 
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    }
  );
}
