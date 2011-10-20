function live_feedback_request_building(building) {
    $.post('view', {building: building}, function (data) {
        var i, buildingdata;
        buildingdata = jQuery.parseJSON(data);
        for (i in buildingdata) {
            alert(buildingdata[i].fields.room);
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
