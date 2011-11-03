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
                alreadypressed = false;
                for (b in buttons) {
                    if (b !== buttonName && buttons[b].hasClass(b + '_pressed')) {
                        alreadypressed = true;
                        break;
                    }
                }
                if (!alreadypressed) {
                    button.addClass(pressedClass);
                }
            }
        };
    };

    for (button in buttons) {
        buttons[button].click(makeClicked(button));
    }
}

$(document).ready(function() {
    list_sensors($('#sensorlist'));
    init_buttons();
});

})();
