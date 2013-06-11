var conf = require('nconf');

var mysql = require('mysql-libmysqlclient');
var mysql_host = conf.get('db_host');
var conn;
var getDataRowsForUser = function(user) {
	query = "select * from data where username=?";
	var stmt = conn.initStatementSync();
	stmt.prepareSync(query);
	stmt.bindParamsSync([ user ]);
	stmt.executeSync();
	var rows = stmt.fetchAllSync();
	// TODO create error condition if fetchAllSync fails
	return rows;
};

var countAlarmsForId = function(user, id) {
	var query = "select * from alarms where username=? and id=?";
	var stmt = conn.initStatementSync();
	stmt.prepareSync(query);
	stmt.bindParamsSync([ user, id ]);
	stmt.executeSync();
	var rows = stmt.fetchAllSync();
	// TODO create error condition if fetchAllSync fails
	return rows.length;
};

exports.getReports = function(user) {
	var reports = [];
	var i;
	var num_alarms;

	conn = mysql.createConnectionSync();
	conn.connectSync('localhost', 'root', 'root', 'sbs');

	var rows = getDataRowsForUser(user);

	for (i = 0; i < rows.length; i++) {
		reports.push({
			name: rows[i]['filepath'],
			date: rows[i]['ts'],
			severity: '--',
			num_alarms: countAlarmsForId(user, rows[i]['id']),
			tags: '--',
			id: rows[i]['id']
		});
	}
	
	conn.closeSync();
	return reports;
}
