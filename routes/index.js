
/*
 * GET home page.
 */
var  sbs = require('./sbs')
  ,  getalarms = require('./getalarms')
  ,  mv = require('mv')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec;


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
        var id = req.query('id');
        var user = req.query('user');
	getalarms.getDataAlarms(user, id, function(data) {
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
        var filename = 'sbs/files/'+ req.files.qqfile.name + '.' + Math.random()*1000;
        mv(req.files.qqfile.path, filename, function(err){
          var response = { };
          if(!err){
            response.success = true; 
            
            var user = 'root';  //TODO get the user ID
          
            // TODO parse the file to check if it's in the correct form
            // Register the file in Mysql and copy the data to tsdb 
            sbs.copyData(user,filename);
            
          }
          else{
            response.err = err;
            response.success = false;
          }
          res.end(JSON.stringify(response));
          }
        )
};
