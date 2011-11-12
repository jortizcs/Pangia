(function () {
var buildingList = new pTable({
    'columnnames': [ 'Condition',
                     'Priority',
                     'Location',
                     'Created',
                     'Comments'
                   ],
    'sortby': 'Priority',
    'descedingsort': true
});

function requestBuilding(building) {
    $.post('view', {building: building}, function (us_data) {
        var i, buildingdata, tablelocation, table, row;
        var condition, priority, loc, created, other;
        var us_floor, us_room, us_submitter, us_discomfort, us_comfort,
            us_priority, us_comments, us_submitted, us_rows,
            us_total_comfort;

        tablelocation = $('#submissionsbody');
        tablelocation.empty();

        buildingdata = jQuery.parseJSON(us_data);
        buildingList.empty();
        us_rows = [];
        for (i in buildingdata) {
            us_floor = buildingdata[i].fields.floor;
            us_room = buildingdata[i].fields.room;
            us_submitter = buildingdata[i].fields.submitter;
            us_discomfort = buildingdata[i].fields.discomfort;
            us_comfort = buildingdata[i].fields.comfort;
            us_priority = buildingdata[i].fields.priority;
            us_comments = buildingdata[i].fields.comments;
            us_submitted = buildingdata[i].fields.submitted;

            if (us_discomfort && us_comfort) {
                us_total_comfort = us_discomfort + ', ' + us_comfort;
            } else if (us_discomfort) {
                us_total_comfort = us_discomfort;
            } else {
                us_total_comfort = us_comfort;
            }

            us_rows.push([
                us_total_comfort,
                us_priority,
                'Room' + us_room + ', ' + 'Floor ' + us_floor,
                us_submitted,
                us_comments
            ]);
        }
        buildingList.addRows(us_rows);

        tablelocation.append(buildingList.getTable());
    });
}

$(document).ready(function() {
    var i, toggles;
    toggles = $('.buildingselector');
    for (i = 0; i < toggles.length; i++) {
        var elt = toggles[i];
        jQuery.data($(elt).prev()[0], 'onshow', function () {
            requestBuilding($('.buildingname', $(elt).prev())[0].textContent);
        });
    }
});

})();
