var crypto = require('crypto');

if (process.argv.length != 3) {
	console.log('usage: node gen-pwd-entry.js [password]');
	return;
}

var password = process.argv[2];
var salt = crypto.randomBytes(128).toString('base64');
var hash = crypto.pbkdf2Sync(password, salt, 10000, 128).toString('base64');

console.log('salt: ' + salt);
console.log('hash: ' + hash);
