$(document).ready(function () {
    $(window).on('resize load', function () {
        if ($(window).width() < 991) {
            $('.mostordered-layer-owl').addClass('owl-carousel');
            $('.mostordered-layer-owl').owlCarousel({
                loop: false,
                margin: 60,
                navigation: true,
                dots: false,
                nav: true,
                autoplay: false,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 2
                    }
                }
            });
            $('.steps-layer-owl').addClass('owl-carousel');
            $('.steps-layer-owl').owlCarousel({
                loop: true,
                margin: 60,
                navigation: false,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    767: {
                        items: 3
                    },
                    991: {
                        items: 4
                    }
                }
            });
        }
    });
    $('.featured-items').owlCarousel({
        loop: true,
        margin: 60,
        navigation: true,
        nav: true,
        navText: [
            "<i class='icon-arrow-left2'></i>",
            "<i class='icon-arrow-right2'></i>"
        ],
        autoplay: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 3
            }
        }
    });
    $('.home-brands').owlCarousel({
        loop: true,
        navigation: false,
        nav: false,
        navText: [
            "<i class='icon-arrow-left2'></i>",
            "<i class='icon-arrow-right2'></i>"
        ],
        autoplay: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 3,
                margin: 10
            },
            400: {
                items: 4
            },
            600: {
                items: 5
            },
            1000: {
                items: 5,
                margin: 30,
            }
        }
    });

    // $('#trending-layer-products').isotope(
    //     {
    //         itemSelector: ".isotope-item",
    //         filter: '.24-filter',
    //         originLeft: false
    //     });
    // $('.isotope_filter li a').on('click', function () {
    //     $('.item-selector').find('.checked').removeClass('checked');
    //     $(this).addClass('checked');
    //     var selector = $(this).attr('data-filter')
    //     $('#trending-layer-products').isotope(
    //         {
    //             itemSelector: ".isotope-item",
    //             filter: selector,
    //             originLeft: false
    //         });
    // });
})
