$(document).ready(function (){

    $('.steps-layer-owl').addClass('owl-carousel');
    $('.steps-layer-owl').owlCarousel({
        loop: false,
        margin: 60,
        navigation: false,
        nav: false,
        dots:true,
        autoplay: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            767: {
                items: 1
            },
            991: {
                items: 1
            }
        }
    });
});