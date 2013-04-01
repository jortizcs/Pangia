
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , hbs = require('express-hbs')
  , auth = require('./auth');
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var app = express();

// Hook in express-hbs and tell it where known directories reside
app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/views/',
    defaultLayout: __dirname + '/views/layout.hbs'
}));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  // TODO look up sessions to see what to put in for 'secret'
  app.use(express.session({ secret: 'mysecret' }));
  // Does Passport initialization
  auth.init(app);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// Registers all the passport authorization callbacks
auth.setup();

// Currently, these are the login page. We should change this later so there is
// an explicit login page.
app.get('/login', routes.login);
// The passport check is done here to verify the login credentials.
app.post('/login', auth.passportCheck(), routes.login);

// These two helper functions should ALWAYS be used to create new paths (with
// very, very few exceptions) as they ensure that the user is authenticated.
// They do this by creating the get or post route with an ensureAuth middleware
// check.
var getpath = function(path, route) {
  app.get(path, auth.ensureAuth, route);
};

var postpath = function(path, route) {
  app.post(path, auth.ensureAuth, route);
};

getpath('/', routes.index);
getpath('/index', routes.index);
getpath('/alarmshim', routes.alarmshim);
getpath('/chart', routes.chart);
getpath('/dashboard', routes.dashboard);
postpath('/dashboard', routes.dashboard);
getpath('/upload', routes.upload);
getpath('/users', user.list);
postpath('/uploader', routes.uploader);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
