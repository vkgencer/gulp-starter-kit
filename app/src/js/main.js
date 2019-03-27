var tabs = (function () {

    function init() {
        $('.tab').each(function () {
            var $el = $(this),
                $title = $el.find(".tab-title li a"),
                $content = $el.find(".tab-content");

            if (!$title.parents('.tab-title').hasClass("no-tab")) {

                $title.on('click', function (e) {
                    e.preventDefault();
                    var index = $(this).parent().index();

                    $title.parent().removeClass('active');
                    $(this).parent().addClass('active');

                    $content.hide();
                    $content.eq(index).fadeIn();
                });

                if ($title.parent().hasClass('default-open')) {
                    $el.find(".tab-title li.default-open a").click();
                } else {
                    $title.eq(0).click();
                }
            }
        });
    }

    // init()

    return {
        init: init
    }

})();

var mainSlider = (function () {

    function init() {
        /* if (jQuery().owlCarousel) {
            $('.main-slider').owlCarousel({
                loop: true,
                items: 1,
                dots: true
            })
        } */ 
    }

    // init()

    return {
        init: init
    }

})();


var subPageActions = (function () {

    function init() {

    }

    // init()

    return {
        init: init
    }

})();


var browserActions = (function () {

    function init() {

        if ($(window).width() < 768) {
            $("html").addClass("mobile");
        } else {
            $("html").removeClass("mobile").addClass("desktop");
        }

    }

    // init()

    return {
        init: init
    }

})();

$(document).ready(function () {
    browserActions.init();
    tabs.init();
    mainSlider.init();
    subPageActions.init();
})

$(window).resize(browserActions.init())