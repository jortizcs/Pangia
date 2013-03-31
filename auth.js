var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

exports.init = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
};

exports.setup = function() {
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
};

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

exports.passportCheck = function() {
  return passport.authenticate('local', {
    successRedirect: '/index',
	failureRedirect: '/login'
  });
};

exports.ensureAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

