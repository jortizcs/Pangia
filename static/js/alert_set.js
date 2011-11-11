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
        
        $('#id_sensor').val(row[0]);
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

function init_buttons() {
    var buttons = {
        'btn_less': $('.btn_less'),
        'btn_equal': $('.btn_equal'),
        'btn_larger': $('.btn_larger')
    };
    var button;

    var makeClicked  = function (buttonName) {
        return function (event) {
            var button = buttons[buttonName];
            var pressedClass = buttonName + '_pressed';
            var b, alreadypressed;

            if (button.hasClass(pressedClass)) {
                button.removeClass(pressedClass);
            } else {
                for (b in buttons) {
                    buttons[b].removeClass(b + '_pressed');
                }
                button.addClass(pressedClass);
            }
        };
    };

    for (button in buttons) {
        buttons[button].click(makeClicked(button));
    }
}

$(document).ready(function() {
    var currentsensor, rows;

    list_sensors($('#sensorlist'));
    init_buttons();

    currentsensor = $('#id_sensor').val();
    if (currentsensor !== '') {
        rows = sensorList.searchRow(currentsensor);
        if (rows.length > 0) {
            sensorList.selectRow(rows[0]);
        }
    }

    $('#alert_set').click(function () {
        $('#alert_set_form').submit();
    });
});

})();
