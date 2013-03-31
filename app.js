
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , hbs = require('express-hbs')
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
  // TODO look up sessions to see what to put in for 'secret'
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'mysecret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Basic user/password authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === 'root' && password === 'root') {
	  return done(null, TESTUSER);
	}
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findUserById(id, function(err, user) {
    done(err, user);
  });
});

// TODO This is a fake, temporary test user that is used for testing our
// authentication scheme. We need to add in a real DB user check at some point.
// This test user allows you to login with username 'root' and password 'root'.
var TESTUSER = { 'id': 1, 'username': 'root' };

var findUserById = function(id, done) {
  if (id === 1) {
    done(null, TESTUSER);
  } else {
    done(new Error('User ID ' + id + ' not found.'));
  }
};

var findUserByUsername = function(username, done) {
  if (username === 'root') {
    done(null, TESTUSER);
  } else {
    done(new Error('Username  ' + username + ' not found.'));
  }
};

var passportCheck = function() {
  return passport.authenticate('local', {
    successRedirect: '/dashboard',
	failureRedirect: '/index'
  });
};

var ensureAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/index');
};

// Currently, these are the login page. We should change this later so there is
// an explicit login page.
app.get('/', routes.index);
app.get('/index', routes.index);
app.post('/index', passportCheck(), routes.index);

// Make sure to *always* include a middleware 'ensureAuth' check!
// TODO Make a function that generates GETs and POSTs that automatically
// includes the ensureAuth middleware check.
app.get('/alarmshim', ensureAuth, routes.alarmshim);
app.get('/chart', ensureAuth, routes.chart);
app.get('/dashboard', ensureAuth, routes.dashboard);
app.post('/dashboard', ensureAuth, routes.dashboard);
app.get('/upload', ensureAuth, routes.upload);
app.get('/users', ensureAuth, user.list);

app.post('/uploader', routes.uploader);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
