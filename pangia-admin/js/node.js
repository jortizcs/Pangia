var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
dir = req.url;

	var options = {
	  host: 'energylens.sfsdev.is4server.com',
	  port: 8080,
	  path: dir,
	  method: 'GET'
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
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');