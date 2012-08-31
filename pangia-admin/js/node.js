//Global required classes
var http = require('http');
var url = require('url');
var qs = require('querystring');
//Global vars
var port = 8080;
var host = 'energylens.sfsdev.is4server.com';


http.createServer(function (req, res) {
	dir = req.url;
	method = req.method;

	if (method == 'GET') { 
		var options = {
		  host: host,
		  port: port,
		  path: dir,
		  method: method,
		};
		http.get(options,function(response){
			//console.log("hi",response);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			var pageData = "";
		    response.setEncoding('utf8');
		    //stream the data into the response
		    response.on('data', function (chunk) {
		      pageData += chunk;
		    });
	
		    //write the data at the end
		    response.on('end', function(){
		      res.write(pageData);
		      res.end();
		    });
		});
	// } else if (method == 'POST') {
		// var options = {
		  // host: host,
		  // port: port,
		  // path: dir,
		  // method: method,
		// };	
// 
	  // // Set up the request
	  // http.request(options, function(res) {
	      // res.setEncoding('utf8');
	      // res.on('data', function (chunk) {
	          // console.log('Response: ' + chunk);
	      // });
	  // });
	// } 
}).listen(port);

console.log('Server running at http://localhost/');