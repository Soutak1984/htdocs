var description =$('._text-description');


$(document).ready(function () {


    //image slider
    var totalWidth = 0;
    var positions = [];

    $('#slides .slide').each( function(i) {
        // Get slider widths
        positions[i] = totalWidth;
        totalWidth += $(this).width();

        // check widths
        if( !$(this).width() ) {
            alert('Please make sure all images have widths!');
            return false;
        }
    });

    $('#slides').width(totalWidth);

    $('#menu ul li a').click( function(e, keepScroll) {

        $('li.product').removeClass('active').addClass('inactive');

        $(this).parent().addClass('active');

        var pos = $(this).parent().prevAll('.product').length;

        $('#slides').stop().animate({marginLeft:-positions[pos] + 'px'}, 450);

        e.preventDefault();

    });
    if(description.html()){
        if(description.html().length >= 121){
            $('._text-description').parent().find(' ._show-more').removeClass('hidden');
        }
    }



    // Make first image active.
    $('.product').first().addClass('active').siblings().addClass('inactive');

    //-------------------------------------
    $('._related-products-holder').owlCarousel({
        loop: false,
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

    $('._product-related-image').owlCarousel({
        loop: false,
        margin: 10,
        navigation: false,
        nav: false,
        dots: true,
        autoplay: false,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 3
            },
            767: {
                items: 4
            },
            991: {
                items: 5
            }
        }
    });


    $('._show-more').on('click', function () {
        $(this).parent().children('._lit-show').toggleClass('hide');
    });

    $('._review-write-btn').on('click', function () {
        $('._review-writer-input-holder').toggleClass('show');
    })
});