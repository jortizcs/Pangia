var   conf = require('nconf')
    , mysql = require('mysql-libmysqlclient');

var mysql_host = conf.get('db_host');
var conn = mysql.createConnectionSync();
conn.connectSync('localhost', 'root', 'root', 'sbs');

exports.conn = conn;
