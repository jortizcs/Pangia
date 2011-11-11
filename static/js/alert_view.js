(function () {
var alertsList = new pTable({
    'columnnames': [ 'Alert Name',
                     'Priority',
                     'Sensor ID',
                     'Date of Creation',
                     'Threshold',
                     'Email on Alert'
                   ],
    'sortby': 'Priority',
    'descendingsort': true
});

function createAlertsList() {
    $.post('view', {}, function (us_data) {
        var alerts, us_rows, i;
        var tablelocation;

        tablelocation = $('#alertsbody');

        alerts = jQuery.parseJSON(us_data);
        us_rows = [];
        for (i in alerts) {
            us_row = [
                alerts[i].fields.name,
                alerts[i].fields.priority,
                alerts[i].fields.sensor,
                alerts[i].fields.created,
                alerts[i].fields.threshold,
                alerts[i].fields.action
            ];

            us_rows.push(us_row);
        }

        alertsList.addRows(us_rows);

        tablelocation.append(alertsList.getTable());
    });
}

$(document).ready(function() {
    createAlertsList();
});
})();
