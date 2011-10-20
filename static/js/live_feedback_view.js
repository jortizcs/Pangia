function live_feedback_request_building(building) {
    $.post('view', {building: building}, function (us_data) {
        var i, buildingdata, table, row;
        var condition, priority, loc, created, other;
        var us_floor, us_room, us_submitter, us_discomfort, us_comfort,
            us_priority, us_comments, us_submitted;

        buildingdata = jQuery.parseJSON(us_data);
        table = $('#submissionsbody');
        //table.empty();
        for (i in buildingdata) {
            us_floor = buildingdata[i].fields.floor;
            us_room = buildingdata[i].fields.room;
            us_submitter = buildingdata[i].fields.submitter;
            us_discomfort = buildingdata[i].fields.discomfort;
            us_comfort = buildingdata[i].fields.comfort;
            us_priority = buildingdata[i].fields.priority;
            us_comments = buildingdata[i].fields.comments;
            us_submitted = buildingdata[i].fields.submitted;

            // Make a table here
            row = $('<tr class="alarm" />');
            condition = $('<td/>');
            if (us_discomfort && us_comfort) {
                condition.text(us_discomfort + ',' + us_comfort);
            } else if (us_discomfort) {
                condition.text(us_discomfort);
            } else {
                condition.text(us_comfort);
            }
            row.append(condition);

            table.append(row);
        }
    });
}

$(document).ready(function() {
    var i, toggles;
    toggles = $('.buildingselector');
    for (i = 0; i < toggles.length; i++) {
        var elt = toggles[i];
        jQuery.data($(elt).prev()[0], 'onshow', function () {
            live_feedback_request_building($('.buildingname', $(elt).prev())[0].textContent);
        });
    }
});
