/* Author:

*/
function getJSONsub () {
	var url = 'http://localhost/sfs/sub/*'; //set this to whatever your localhost is running on, modify .htaccess file to make this work with node js
	
	 $.get(url, function(data) {
	     alert('page content: ' + data);
	 });
};



