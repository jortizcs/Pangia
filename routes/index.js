
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', {
		title: 'Pangia',
		headerscripts: [],
		extrastyle: [
			"body { background: url(lib/img/bg-login.jpg) !important; }"
		]
	});
};
