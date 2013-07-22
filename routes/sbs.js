var  conf  = require('nconf')
  ,  fs    = require('fs')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec
//  ,  mysql = require('mysql-libmysqlclient')
  ,  net = require('net')
  ,  lazy = require('lazy')
  ,  db   = require('../db');

var otsdb_host = conf.get('otsdb_host');
var otsdb_port = conf.get('otsdb_port');

var db_name = conf.get('db_name');
// var mysql_host = conf.get('db_host');


// Record the upload in mongodb
// Create the corresponding metric in OTSDB
// Copy the data to OTSDB
// Return the corresponding _id
exports.copyData = function(user_id, bldg_id, filename) {
//   var conn = mysql.createConnectionSync();
//   conn.connectSync(mysql_host, 'root', 'root', 'sbs');
//   
//   // Place an entry in the mysql db
//   var query = "insert into data (username, filepath) values (?, ?)";
//   var stmt = conn.initStatementSync();
//   stmt.prepareSync(query);
//   stmt.bindParamsSync([ user, filename]);
//   var ex = stmt.executeSync();
//   var id = stmt.lastInsertIdSync();
//   conn.closeSync();  

	db.data.save({ "user_id": user_id, "filepath": filename },
		function(err, data){
		
			// create the TSDB metric and copy the data
			// then run SBS
			var ts;
			var child = exec('tsdb mkmetric sbs.' + data.username + '.' + data._id.toString() , 
			function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}else{
					console.log('Copying data to otsdb... ('+data.username+', '+data._id.toString()+', '+data.filepath+')\n')
					copyFile2Tsdb( data.user_id, data._id, data.filepath, bldg_id);
				}
			}
			);
			
		}
	);
//   return id;
}


// Copy the data to OTSDB
function copyFile2Tsdb(user_id, id, filename, bldg_id) {
    
  // Connect to the tsdb server
  var client = new net.Socket();
  client.connect(otsdb_port, otsdb_host,
    function(){
      var startTS = 0;
      var endTS = 0;

      var streams;
  
      // Send the data
      // TODO parse/validate the file format
      // TODO raise and error if something went wrong
       var fr = new lazy(fs.createReadStream(filename));
      
      fr.on('end', function() {
        //client.end();
        
	// Store the streams name in mongodb
//        for something....
//	      db.streams.update({"name": XXX.name, "bldg_id": XXX.bldg_id})

        //Run SBS
        console.log('Start SBS... ('+bldg_id.toString()+', '+id.toString()+', '+startTS+', '+endTS+')\n')
        runSBS(user_id, bldg_id, id, startTS, endTS, filename+'.log');
        
      });
      
      fr.lines.forEach(
      function (line) { 
          var elem = line.toString().replace(/\s+/g, '').replace(/{|}|\(|\)|\[|\]|%/g, '_').split(',');
          var ts = parseInt(parseFloat(elem[0]));
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
          client.write('put sbs.'+user_id.toString()+'.'+id.toString()+' '+elem[0]+' '+elem[1]+' label='+elem[2]+'\r\n');
          }
      );
      
      
      
    }
  );
  
  client.on('data', function(data) {
    // TODO raise and error if something went wrong
    console.log(data.toString());
  });
  
}


// Run SBS and sends an email when it is done
function runSBS(user_id, id, start, end, logfile){
      var child = exec('python sbs/sbsWrapper.py '+otsdb_host+' '+otsdb_port+' TOREMOVE root root '+db_name+' '+id.toString()+' '+user_id.toString()+' '+bldg_id.toString()+' '+start+' '+end+' > '+logfile , 
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('stderr: ' + stderr);
              console.log('exec error: ' + error);
              //Sends an email to Romain if something went wrong...
              reportError('romain@greenpangia.com', 'Error in the function runSBS with the following parameters: <br> id='+id.toString()+'<br> user='+user_id.toString()+'<br> start='+start+'<br> end='+end+'<br> Error message:<br>'+error);
              
            }else{              
              //db.users.find({})
	      // TODO retrieve user's email
	      var email = "info@greenpangia.com";
              var child2 = exec('python sbs/sendEmail.py '+email+' "http://166.78.31.162/Pangia/chart.php?id='+id.toString()+'"', 
               function (error, stdout, stderr) {
                  if (error !== null) {
                    console.log('exec error: ' + error);
                    reportError('romain@greenpangia.com', 'Error sending the report by email. <br> Error message: <br>'+error);
                  }
                }
              );
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
