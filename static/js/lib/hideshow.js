//  Andy Langton's show/hide/mini-accordion @ http://andylangton.co.uk/jquery-show-hide

// this tells jquery to run the function below once the DOM is ready
$(document).ready(function() {
    // choose text for the show/hide link - can contain HTML (e.g. an image)
    var showText='Show';
    var hideText='Hide';

    // initialise the visibility check
    var is_visible = false;

    // append show/hide links to the element directly preceding the element with a class of "toggle"
    $('.toggle').prev().append(' <a href="#" class="toggleLink">'+showText+'</a>');
    $('.toggle_sub').prev().append(' <a href="#" class="toggleLink_sub">'+showText+'</a>');

    // hide all of the elements with a class of 'toggle'
    $('.toggle').hide();
    $('.toggle_sub').hide();

    // capture clicks on the toggle links
    $('a.toggleLink').click(function() {

        // switch visibility
        is_visible = !is_visible;

        // change the link text depending on whether the element is shown or hidden
        if ($(this).text()==showText) {
            if (jQuery.data($(this).parent()[0], 'onshow')) {
                jQuery.data($(this).parent()[0], 'onshow')();
            }

            $(this).text(hideText);
            $(this).parent().next('.toggle').slideDown('slow');
                $("#alert").fadeOut(350, 'swing',
                    function () {
                        $("#building").fadeIn(350, 'swing');
                    });
        }
        else {
            if ($(this).onhide) {
                $(this).onhide();
            }

            $(this).text(showText);
            $(this).parent().next('.toggle').slideUp('slow');
                $("#floor").fadeOut(450, 'swing');
                $("#building").fadeOut(450, 'swing',
                    function () {
                        $("#alert").fadeIn(450, 'swing');
                    });
        }
        // return false so any link destination is not followed
        return false;
    });

    $('a.toggleLink_sub').click(function() {

    // switch visibility
        is_visible = !is_visible;

    // change the link text depending on whether the element is shown or hidden
        if ($(this).text()==showText) {
            $(this).text(hideText); $(this).parent().next('.toggle_sub').slideDown('slow');
        }
        else {
            $(this).text(showText); $(this).parent().next('.toggle_sub').slideUp('slow');
        }

    // return false so any link destination is not followed
        return false;
    });
});
