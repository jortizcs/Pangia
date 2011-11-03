(function () {
var sensorselection = undefined;
// For testing purposes, we're just building a list of bogus sensor names.
var sensorList = new pTable({
    'columnnames': [ 'Sensor Name' ],
    'sortby': 'Sensor Name',
    'rowselect': function (rowindex) {
        var row;
        row = sensorList.getRowValues(rowindex);

        sensorselection = row[0];
    }
});

function list_sensors(sensorListElt) {
    sensorList.addRows([
        [ 'fake sensor 1' ],
        [ 'fake sensor 2' ],
        [ 'fake sensor 3' ]
    ]);

    sensorListElt.append(sensorList.getTable());
}

$(document).ready(function() {
    list_sensors($('#sensorlist'));
});

})();
