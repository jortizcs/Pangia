
/*
 * GET home page.
 */
var  sbs = require('./sbs')
  ,  getalarms = require('./getalarms')
  ,  mv = require('mv')
  ,  sys   = require('sys')
  ,  exec  = require('child_process').exec
  ,  fs = require('fs')
  ,  data = require('./data')
  ,  bldgs = require('./bldgs')
  ,  streams = require('./streams')
  ,  db = require('../db')
  ,  ObjectID = require('mongodb').ObjectID;


exports.index = function(req, res) {
	// For now, we just redirect the index to the buildings view.
	res.redirect('/bldgs');
};

exports.login = function(req, res) {
	res.render('login', {
		title: 'Pangia',
		extrastyle: [
			'body { background: url(lib/img/bg-login.jpg) !important; }'
		]
	});
};

exports.data = function(req, res) {
	// Gather 
	data.getData(new ObjectID(req.query.bldg_id), //TODO check if the building belongs to this user? 
	function(data){
		res.render('data', {
			title: 'Pangia - Data',
			extrameta: [
				{ name: 'description', content: '' },
				{ name: 'author', content: '' },
			],
			data: data
		});
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

exports.upload = function(req, res) {
	var bldg_id = req.query.bldg_id; //TODO preselect a building
	bldgs.getBldgs(req.user._id, function(bldgs){
		res.render('upload', 
			{
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
                	],
			bldgs:bldgs
        	});
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
            
          
            // TODO parse the file to check if it's in the correct form
            // Register the file in Mysql and copy the data to tsdb 
            sbs.copyData(req.user.id, req.bldg.bldg_id,pathFile);
            
          }
          else{
            response.err = err;
            response.success = false;
          }
          res.end(JSON.stringify(response));
          }
        )
};


exports.bldgs = function(req, res) {
	bldgs.getBldgs(req.user._id, 
	function(bldgs){
		res.render('bldgs', {
			title: 'Pangia - Buildings',
			extrameta: [
				{ name: 'description', content: '' },
				{ name: 'author', content: '' },
			],
			bldgs: bldgs
		});
	});
};


exports.streams = function(req, res) {
	streams.getStreams(new ObjectID(req.query.bldg_id), //TODO check if the building belongs to this user? 
	function(streams){
		res.render('streams', {
			title: 'Pangia - Streams',
			extrameta: [
				{ name: 'description', content: '' },
				{ name: 'author', content: '' },
			],
			streams: streams
		});
	});
};
