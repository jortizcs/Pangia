
/*
 * GET home page.
 */
var getalarms = require('./getalarms');

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
	getalarms.getDataAlarms('root', 1, function (alarms) {
		res.send(alarms);
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
		extrascript: [
			'lib/fineuploader_3.2/jquery.fineuploader-3.2.min.js'
		]
	});
};
