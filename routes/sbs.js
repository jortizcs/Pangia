var  fs   = require('fs')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec
  ,  mysql = require('mysql-libmysqlclient')
  ,  net = require('net')
  ,  lazy = require('lazy');

var otsdb_host = 'localhost';
var otsdb_port = 4242;

var mysql_host = 'localhost';

var conn = mysql.createConnectionSync();
conn.connectSync(mysql_host, 'root', 'root', 'sbs');

// Record the upload in the Mysql db
// Create the corresponding metric in OTSDB
// Copy the data to OTSDB
// Return the corresponding id
exports.copyData = function(user, filename) {
  
  // Place an entry in the mysql db
  var query = "insert into data (username, filepath, ts) values (?, ?, ?)";
  var stmt = conn.initStatementSync();
  stmt.prepareSync(query);
  stmt.bindParamsSync([ user, filename, '2013-03-01 03:31:50' ]); //TODO timestamp
  var ex = stmt.executeSync();
  var id = stmt.lastInsertIdSync();
  
  // create the TSDB metric and copy the data
  // then run SBS
  var ts;
  var child = exec('tsdb mkmetric sbs.' + user + '.' + id , 
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }else{
        console.log('Copying data to otsdb... ('+user+', '+id+', '+filename+')\n')
        copyFile2Tsdb(user, id, filename);
        
      }
    }
   );
  
  return id;
}


// Copy the data to OTSDB
function copyFile2Tsdb(user, id, filename) {
    
  // Connect to the tsdb server
  var client = new net.Socket();
  client.connect(otsdb_port, otsdb_host,
    function(){
      var startTS = 0;
      var endTS = 0;
  
      // Send the data
      // TODO parse/validate the file format
      // TODO raise and error if something went wrong
       var fr = new lazy(fs.createReadStream(filename));
      
      fr.on('end', function() {
        //client.end();
        
        //Run SBS
        console.log('Start SBS... ('+user+', '+id+', '+startTS+', '+endTS+')\n')
        runSBS(user, id, startTS, endTS);
        
      });
      
      fr.lines.forEach(
      function (line) { 
          var elem = line.toString().replace(/\s+/g, '').split(',');
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
          client.write('put sbs.'+user+'.'+id+' '+elem[0]+' '+elem[1]+' label='+elem[2]+'\r\n');
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
function runSBS(user, id, start, end){
      var child = exec('python sbs/sbsWrapper.py '+otsdb_host+' '+otsdb_port+' '+mysql_host+' root root sbs '+id+' '+user+' '+start+' '+end , 
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error);
              //Sends an email to Romain if something went wrong...
              reportError('romain@greenpangia.com', 'Error in the function runSBS with the following parameters: <br> id='+id+'<br> user='+user+'<br> start='+start+'<br> end='+end+'<br> Error message:<br>'+error);
              
            }else{
              var child2 = exec('python sbs/sendEmail.py info@greenpangia.com http://166.78.31.162/Pangia/chart.php?user='+user+'&id='+id, 
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