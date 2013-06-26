var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./db')
  , crypto = require('crypto');

exports.init = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
};

function checkPassword(password, salt, hash) {
  var gen_hash = crypto.pbkdf2Sync(password, salt, 10000, 128).toString('base64');
  return hash === gen_hash;
}

function fetchCredentialsById(id, done) {
	return db.users.findOne({ '_id' : db.mongo.ObjectID(id) },
    function (err, result) {
      done(result);
    });
}

function fetchCredentialsByUsername(username, done) {
	return db.users.findOne({ 'username' : username },
    function (err, result) {
      done(result);
    });
}

exports.setup = function() {
  // Basic user/password authentication
  passport.use(new LocalStrategy(
    function(username, password, done) {
      fetchCredentialsByUsername(username, function(creds) {
        if (creds && checkPassword(password, creds['salt'], creds['hash'])) {
          return done(null, {
            'id': creds['_id'],
            'username': username
          });
        }

        var message = 'Incorrect username or password.';
        return done(null, false, { message: message });
      });
    }));
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    findUserById(id, function(err, user) {
      done(err, user);
    });
  });
};

var findUserById = function(id, done) {
  fetchCredentialsById(id, function(creds) {
    if (creds) {
      done(null, creds);
    } else {
      done(new Error('User ID ' + id + ' not found.'));
    }
  });
};

var findUserByUsername = function(username, done) {
  fetchCredentialsByUsername(username, function (creds) {
    if (creds) {
      done(null, creds);
    } else {
      done(new Error('Username  ' + username + ' not found.'));
    }
  });
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
