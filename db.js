var   conf = require('nconf')
    , mysql = require('mysql-libmysqlclient')
	, mongo = require('mongodb');

var conn = mysql.createConnectionSync(conf.get('sbs_host'),
                                      conf.get('sbs_user'),
                                      conf.get('sbs_pwd'),
                                      conf.get('sbs_db'));
exports.conn = conn;

var server = new mongo.Server(conf.get('mongo_host'),
                              conf.get('mongo_port'));

var db = new mongo.Db('pangia', server);

exports.mongo = mongo;
exports.db = db;
exports.users = null;
exports.alarms= null;
exports.data  = null;

exports.startDb = function (done) {
	db.open(function(error, connection) {
		connection.createCollection('users', function (error, collection) {
			if (!error) {
				exports.users = collection;
			}
		});
		connection.createCollection('alarms', function (error, collection) {
			if (!error) {
				exports.alarms = collection;
			}
		});
		connection.createCollection('data', function (error, collection) {
			if (!error) {
				exports.data = collection;
			}
		});
		done(error);
	});

};
