var mysql = require('mysql-libmysqlclient');
var mysql_host = 'localhost';
var conn = mysql.createConnectionSync();
conn.connectSync('localhost', 'root', 'root', 'sbs');

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
	console.log('user = ' + user);
	var reports = [];
	var rows = getDataRowsForUser(user);
	var i;
	var num_alarms;
	for (i = 0; i < rows.length; i++) {
		console.log(rows[i]);
		//num_alarms = countAlarmsForId(user, id);
		reports.push({
			name: rows[i]['filepath'],
			date: rows[i]['ts'],
			severity: '--',
			num_alarms: countAlarmsForId(user, rows[i]['id']),
			tags: '--'
		});
	}

	return reports;
}
