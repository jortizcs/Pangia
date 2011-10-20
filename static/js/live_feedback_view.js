function live_feedback_request_building(building) {
    alert('wrrrd');
    $.post('view', function () {
        alert('joel wuz here');
    });
}

$(document).ready(function() {
    var i, toggles;
    toggles = $('.buildingselector');
    for (i = 0; i < toggles.length; i++) {
        var elt = toggles[i];
        jQuery.data(elt, 'onshow', function () {
            live_feedback_request_building(elt.textContent);
        })
    }
});
