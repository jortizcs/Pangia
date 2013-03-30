
/*
 * GET home page.
 */
var  dataMng = require('./sbs')
  ,  getalarms = require('./getalarms')
//  ,  mv = require('mv')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec;


exports.index = function(req, res) {
	res.render('index', {
		title: 'Pangia',
		extrastyle: [
			'body { background: url(lib/img/bg-login.jpg) !important; }'
		]
	});
};

exports.dashboard = function(req, res) {
	res.render('dashboard', {
		title: 'Pangia - Dashboard',
		extrameta: [
			{ name: 'description', content: 'Perfectum Dashboard Bootstrap Admin Template.' },
			{ name: 'author', content: 'Łukasz Holeczek' },
		]
	});
};

exports.alarmshim = function(req, res) {
	getalarms.getDataAlarms('root', 1, function(data) {
		res.send(JSON.stringify(data));
	});
};

exports.chart = function(req, res) {
	getalarms.getDataAlarms('root', 1, function(data) {
		var len = (data.length > 10) ? 10 : data.length;
		var i;
		var indexes = [];

		for (i = 0; i < len; i++) {
			indexes.push(i);
		}

		res.render('chart', {
			title: 'Pangia - Anomaly Report',
			extrameta: [
				{ name: 'description', content: 'Perfectum Dashboard Bootstrap Admin Template.' },
				{ name: 'author', content: 'Łukasz Holeczek' }
			],
			extracss: [
				'lib/css/custom.css'
			],
			extrascripts: [
				'lib/js/d3.v3.min.js',
				'pages/chart.js'
			],
			data: JSON.stringify(data),
			indexes: indexes
		});
	});
};

exports.upload = function(req, res) {
        res.render('upload', {
                title: 'Pangia - Generate New Report',
                extrameta: [
                        { name: 'description', content: 'Perfectum Dashboard Bootstrap Admin Template.' },
                        { name: 'author', content: 'Łukasz Holeczek' },
                        // Mobile specific:
                        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
                ],
                extrastyle: [
                        // Fine Uploader
                        '.qq-upload-list { text-align: left; }',
                        // Bootstrap
                        'li.alert-success { background-color: #DFF0D8; }',
                        'li.alert-error { background-color: #F2DEDE; }',
                        '.alert-error .qq-upload-failed-text { display: inline; }',
                        '.qq-upload-button { }',
                ],
                extrascripts: [
                        'lib/fineuploader_3.2/jquery.fineuploader-3.2.min.js'
                ]
        });
};


exports.uploader = function(req, res) {
        
        //console.log(req);
  
        // Move the file to a more appropriate place
        // TODO check if the file already exists?
//         mv(req.files.qqfile.path,'sbs/files/' + Math.random(), function(err){
//           var response = { };
//           response.file = req.files;
//           if(!err){
//             response.success = true; 
//           }
//           else{
//             response.err = err;
//             response.success = false;
//           }
//           res.end(JSON.stringify(response));
//           }
//         )
        
  
        var user = 'root';  //TODO get the user ID
        
        // TODO parse the file to check if it's in the correct form
        // Register the file in Mysql and copy the data to tsdb 
        var dataInfo = dataMng.copyData(user,req.files.qqfile.path);

        var response = { };
        response.file = req.files;
        response.success = true; 
        res.end(JSON.stringify(response));
        
};
