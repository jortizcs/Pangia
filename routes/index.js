
/*
 * GET home page.
 */

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
			// Mobile specific:
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' }
		]
	});
};
