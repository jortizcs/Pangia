var  fs   = require('fs')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec
  ,  mysql = require('mysql-libmysqlclient')
  ,  net = require('net');

var otsdb_host = 'localhost';
var otsdb_port = 4242;

var mysql_host = 'localhost';

var conn = mysql.createConnectionSync();
conn.connectSync('localhost', 'root', 'root', 'sbs');

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
  
  //create the TSDB metric and copy the data
  var ts;
  var child = exec('tsdb mkmetric sbs.' + user + '.' + id , 
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }else{
        ts = copyFile2Tsdb(user, id, filename);
      }
    }
   );
  
  return {id: id, start: ts.start, end: ts.end};
}


// Copy the data to OTSDB
function copyFile2Tsdb(user, id, filename) {
    
  var startTS = 0;
  var endTS;
  
  // Connect to the tsdb server
  var client = new net.Socket();
  client.connect(otsdb_port, otsdb_host,
    function(){
      // Send the data
      // TODO parse/validate the file format
      // TODO raise and error if something went wrong
      fs.readFileSync(filename).toString().split('\n').forEach( //TODO change readFileSync to read files bigger than 1GB? (or get chunked files?)
      function (line) { 
          var elem = line.replace(/\s+/g, '').split(',');
          var ts = int();
          if(startTS == 0){
            startTS = dat
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
      client.end();
    }
  );
  
  client.on('data', function(data) {
    // TODO raise and error if something went wrong
    console.log(data.toString());
  });
  
  return {start: startTS, end: endTS};
  
}
