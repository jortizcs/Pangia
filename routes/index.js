
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
	        layout: null,
		extrastyle: [
			'body { background: url(lib/img/bg-login.jpg) !important; }'
		]
	});
};

exports.data = function(req, res) {
	//Get the building details
	db.bldgs.findOne({"_id": new ObjectID(req.query.bldg_id)}, function(err, bldg){
		
		// Check if the building belong to this user
		if(bldg != null && (bldg.user_id.toString() == req.user._id.toString())){ //Chck if there is a better way to compare ObjectID
	// Gather 
			data.getData(new ObjectID(req.query.bldg_id), //TODO check if the building belongs to this user? 
			function(data){
				res.render('data', {
					title: 'Uploaded Data',
					data: data,
					bldg: bldg
				});
			});
		}
		else{
			res.render('data', {
			title: 'Uploaded Data (Access Denied)',
			data: data
			});
			
		}
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

console.log(req.query)
	var bldg_id =  new ObjectID(req.query.bldg_id);
	var date = "";
	if(req.query.date){
		date = req.query.date;
console.log(date)
	}
	//Get the building details
	db.bldgs.findOne({"_id": bldg_id}, function(err, bldg){
		
		// Check if the building belong to this user
		if(bldg != null && (bldg.user_id.toString() == req.user._id.toString())){
			getalarms.getDataAlarmsDate(req.user._id, bldg_id, date, function(data) {
				db.alarms.aggregate(
				{$match: {"bldg_id": bldg_id}},
				{$project: {date: {$substr: ["$start", 0, 7] }} },
				{$group: {_id: "$date", nbAnomaly: {$sum: 1}} },
				{$sort: {"_id": -1} },
				function(err, result){

				
				if(err){console.log(err);}
				var len = data.length; //(data.length > 10) ? 10 : data.length;
				var i;
				var indexes = [];
				for (i = 0; i < len; i++) {
					indexes.push(i);
				}
				

				res.render('chart', {
					title: 'Anomaly Report',
					extracss: [
						'lib/css/custom/custom.css'
					],
					extrascripts: [
						'lib/js/d3.v3.min.js',
						'pages/chart.js'
					],
					data: JSON.stringify(data),
					indexes: indexes,
					bldg: bldg,
					month: result,
					date: date
				});
			});
		});
		}
		else{
			res.render('chart', {
				title: 'Anomaly Report (Access denied)',
				extracss: [
					'lib/css/custom/custom.css'
				],
				extrascripts: [
					'lib/js/d3.v3.min.js',
					'pages/chart.js'
				]
			});
		}
	});
};

exports.chartPost = function(req, res) {
  getalarms.setUseful(req.user.username, req.body.reportId, req.body.isUseful);
};

exports.upload = function(req, res) {
	var bldg_id = req.query.bldg_id; //TODO preselect a building
	bldgs.getBldgs(req.user._id, function(bldgs){
		res.render('upload', 
			{
                	title: 'Data Upload',
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
        
        console.log(req);
  
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
            // Register the file in mongodb and copy the data to tsdb
	    var bldg_id =  new ObjectID(req.query.bldg);
	    db.bldgs.findOne({"_id": bldg_id}, function(err,bldg){
	    	// check that the bldg belongs to this user
		if(bldg != null && (bldg.user_id.toString() == req.user._id.toString())){
            		sbs.analyzeData(req.user._id,bldg_id, pathFile,req.user.email);
		}
	    }); 
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
			title: 'Buildings',
			extrameta: [
				{ name: 'description', content: '' },
				{ name: 'author', content: '' },
			],
			bldgs: bldgs
		});
	});
};


exports.streams = function(req, res) {
	//Get the building details
	db.bldgs.findOne({"_id": new ObjectID(req.query.bldg_id)}, function(err, bldg){
		
		// Check if the building belong to this user
		if(bldg != null && (bldg.user_id.toString() == req.user._id.toString())){ //Chck if there is a better way to compare ObjectID
			streams.getStreams(bldg._id, 
			function(streams){
				res.render('streams', {
					title: 'Streams',
					extracss: [
						'lib/css/custom/streams.css'
					],
					extrascripts: [
						'pages/streams.js'
					],
					streams: streams,
					bldg: bldg
				});
			});
		}
		else{
			console.log("User id is different");
			res.render('streams', {
				title: 'Streams (Access Denied)',
			});
		}
	});
};

exports.noveda = function(req, res) {
	//point to path where the image files are located e.g., ./data/
	var path = './public/noveda/';
	//use this if you have a static directive anywhere like /public, otherwise set it equal to path 
	var augPath ='noveda/';
	
	//reads all files in the path
	var files = fs.readdirSync(path);
	
	//this section adds path info to the files array
	var len = files.length;
	var i;
	var indexes = [];
	for (i = 0; i < len; i++) {
		indexes.push(augPath + files[i]);
	}
	
		res.render('noveda', {
			title: 'Pangia Noveda Demo',
			extracss: [
				'lib/css/custom/streams.css'
			],
			extrascripts: [
				'pages/streams.js'
			],
			files: indexes
		});
};

exports.setStreamPriority = function(req, res) {
	//Get the stream details
	db.streams.findOne({"_id": new ObjectID(req.query.stream_id)}, function(err, stream){
		
		//TODO Check if the stream belong to this user
		if(stream != null ){ 
			streams.setStreamPriority(stream._id, req.query.priority,function(sucess){
				res.send(sucess);
				
			});
		}
		else{
			res.send(404);
		}
	});
}


exports.setStreamBound = function(req, res) {
	//Get the stream details
	db.streams.findOne({"_id": new ObjectID(req.query.stream_id)}, function(err, stream){
		
		//TODO Check if the stream belong to this user
		if(stream != null ){ 
			streams.setStreamBound(stream._id, req.query.value, req.query.type,function(sucess){
				res.send(sucess);
				
			});
		}
		else{
			res.send(404);
		}
	});
}
