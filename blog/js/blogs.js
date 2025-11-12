let short_link_holder = $('.short-link-titles');
$(document).ready(function () {
    let self = $('._related-owl');
    self.addClass('owl-carousel');
    self.owlCarousel({
        loop: false,
        navigation: false,
        nav: false,
        dots: false,
        autoplay: false,
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

    $('.article-body h2 , ._post-content h2').each(function (index, h2) {
        let h2_link = $(h2).attr('id');
        if (h2_link) {
            $(short_link_holder).append('' +
                '<li><a target-id="' + h2_link + '" class="link-h2" href="#' + h2_link + '">' + $(h2).text() + '</a></li> '
            )
        }
        $(this).nextUntil('h2').filter('h3').each(function (key, h3) {
            let h3_link = $(h3).attr('id');
            if (h3_link) {
                $(short_link_holder).append('' +
                    '<li><a target-id="' + h3_link + '" class="link-h3" href="#' + h3_link + '">' + $(h3).text() + '</a></li> '
                )
            }
        });
    })
    watchShortLinks();

    if ($(window).width() > 768) {
        let height = short_link_holder.height();
        short_link_holder.css({
            height: ((height / 2) + 40) + 'px'
        });
    }
})

function watchShortLinks() {
    short_link_holder.find('li a').on('click', function () {
        let id = $(this).attr('target-id');
        let element = document.getElementById(id);
        $(element).addClass('active');
        setTimeout(function (){
            $(element).removeClass('active');
        },6000)
    })
}