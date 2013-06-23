var   conf = require('nconf')
    , mysql = require('mysql-libmysqlclient');

var conn = mysql.createConnectionSync(conf.get('sbs_host'),
                                      conf.get('sbs_user'),
                                      conf.get('sbs_pwd'),
                                      conf.get('sbs_db'));
exports.conn = conn;
