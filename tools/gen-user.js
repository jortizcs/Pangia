// Always init the configuration before all else.
var conf = require('nconf');
conf.argv()
	.env()
	.file({ file: './config.json' });

var crypto = require('crypto')
  , db = require('../db')
  , prompt = require('prompt');

function onErr(err) {
  console.log(err);
  return 1;
}

var properties = [
  {
    name: 'username'
  },
  {
    name: 'password',
    hidden: true
  }
];

prompt.message = 'new user';

prompt.start();
prompt.get(properties, function (err, result) {
  if (err) {
    return onErr(err);
  }

  var username = result.username;
  var password = result.password
  var salt = crypto.randomBytes(128).toString('base64');
  var hash = crypto.pbkdf2Sync(password, salt, 10000, 128).toString('base64');

  var query = "INSERT INTO `users` (username, salt, hash) VALUES (?, ?, ?)";
  var stmt = db.conn.initStatementSync();
  stmt.prepareSync(query);
  stmt.bindParamsSync([ username, salt, hash ]);
  stmt.executeSync();
});
