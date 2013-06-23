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

function fetchCredentialsById(id) {
  var query = "SELECT username, salt, hash FROM users WHERE id=?";
  var stmt = db.conn.initStatementSync();
  stmt.prepareSync(query);
  stmt.bindParamsSync([ id ]);
  stmt.executeSync();
  var rows = stmt.fetchAllSync();

  if (rows < 1) {
    return undefined;
  }

  return rows[0];
}

function fetchCredentialsByUsername(username) {
  var query = "SELECT id, salt, hash FROM users WHERE username=?";
  var stmt = db.conn.initStatementSync();
  stmt.prepareSync(query);
  stmt.bindParamsSync([ username ]);
  stmt.executeSync();
  var rows = stmt.fetchAllSync();

  if (rows < 1) {
    return undefined;
  }

  return rows[0];
}

exports.setup = function() {
  // Basic user/password authentication
  passport.use(new LocalStrategy(
    function(username, password, done) {
      creds = fetchCredentialsByUsername(username);
      if (creds && checkPassword(password, creds['salt'], creds['hash'])) {
        return done(null, {
          'id': creds['id'],
          'username': username
        });
      }

      var message = 'Incorrect username or password.';
      return done(null, false, { message: message });
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
  var creds = fetchCredentialsById(id);
  if (creds) {
    done(null, { 'id': id, 'username': creds['username'] });
  } else {
    done(new Error('User ID ' + id + ' not found.'));
  }
};

var findUserByUsername = function(username, done) {
  var creds = fetchCredentialsByUsername(username);
  if (creds) {
    done(null, { 'id': creds['id'], 'username': username });
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
