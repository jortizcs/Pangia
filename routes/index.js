
/*
 * GET home page.
 */
var  sbs = require('./sbs')
  ,  getalarms = require('./getalarms')
  ,  mv = require('mv')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec
  ,  fs = require('fs')
  ,  dashboard = require('./dashboard');


exports.index = function(req, res) {
	// For now, we just redirect the index to the dashboard.
	res.redirect('/dashboard');
};

exports.login = function(req, res) {
	res.render('login', {
		title: 'Pangia',
		extrastyle: [
			'body { background: url(lib/img/bg-login.jpg) !important; }'
		]
	});
};

exports.dashboard = function(req, res) {
	// Gather 
	res.render('dashboard', {
		title: 'Pangia - Dashboard',
		extrameta: [
			{ name: 'description', content: '' },
			{ name: 'author', content: '' },
		],
		reports: dashboard.getReports(req.user.username)
	});
};

exports.alarmshim = function(req, res) {
	var id = req.query.id;
	var user = req.user.username;
	getalarms.getDataAlarms(user, id, function(data) {
		res.send(JSON.stringify(data));
	});
};

exports.chart = function(req, res) {
	var id = req.query.id;
	var user = req.user.username;

	getalarms.getDataAlarms(user, id, function(data) {
		var len = data.length; //(data.length > 10) ? 10 : data.length;
		var i;
		var indexes = [];

		for (i = 0; i < len; i++) {
			indexes.push(i);
		}

		res.render('chart', {
			title: 'Pangia - Anomaly Report',
			extrameta: [
				{ name: 'description', content: 'Pangia - View Anomaly Report.' },
				{ name: 'author', content: '' }
			],
			extracss: [
				'lib/css/custom/custom.css'
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

exports.chartPost = function(req, res) {
  getalarms.setUseful(req.user.username, req.body.reportId, req.body.index, req.body.isUseful);
};

exports.upload = function(req, res) {
        res.render('upload', {
                title: 'Pangia - Generate New Report',
                extrameta: [
                        { name: 'description', content: '' },
                        { name: 'author', content: '' },
                        // Mobile specific:
                        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
                ],
    			extracss: [
				'lib/fineuploader_3.2/fineuploader-3.2.css'
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
  
        // Move the file to the appropriate place
        var pathFile = 'sbs/files/'+ req.files.qqfile.name + '.' + Math.floor(Math.random()*1000000);
        while(fs.existsSync(pathFile)){
          pathFile = 'sbs/files/'+ req.files.qqfile.name + '.' + Math.floor(Math.random()*1000000);
        }
        mv(req.files.qqfile.path, pathFile, function(err){
          var response = { };
          if(!err){
            response.success = true; 
            
            var user = 'root';  //TODO get the user ID
          
            // TODO parse the file to check if it's in the correct form
            // Register the file in Mysql and copy the data to tsdb 
            sbs.copyData(user,pathFile);
            
          }
          else{
            response.err = err;
            response.success = false;
          }
          res.end(JSON.stringify(response));
          }
        )
};
