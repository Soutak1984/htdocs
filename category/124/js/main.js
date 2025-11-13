var en = "en";
var notif = {
    success: "success",
    danger: "danger",
    info: "info",
    primary: "primary",
    warning: "warning",
};
var timer = null;
var token = (localStorage.getItem("token")) || "";
var emailRegex = /.*@.*/;
var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var index = 0;
var temp = JSON.parse(localStorage.getItem("inquiry")) || [];
var notifID = 0;
var dialogElement = $("#dialog");
var bodyElement = $("body");
var maxNotification = 3;
var presentNotification = 0;
var inputPhoneEmail = $('._email-or-phone');
let haveCountryList = false;
var countryPhone = [];

function notifIcon(type) {
    if (type == notif.success) {
        return '/images/icons/success.svg'
    } else if (type == notif.danger) {
        return '/images/icons/danger.svg'
    } else {
        return '/images/icons/info.svg'
    }
}

function checkValues(pattern, num) {
    var isTrust = false;
    $(pattern).each(function (index, item) {
        item == num ? isTrust = true : '';
    })
    return isTrust;
}

$(document).ready(function () {
    inputPhoneEmail.on('keydown',function (){
        if(!haveCountryList){
            countryPhone.forEach(function (item, index) {
                $('._phone-country-codes').append(
                    '<option country="' + item.name + '" value="' + item.dial_code + '">' + item.code + ' | ' + item.dial_code + '</option>'
                )
            })
            haveCountryList = true;
        }
    })
    inputPhoneEmail.on('input', function (e) {
        if ($(this).val()) {
            if ($(this).val().length >= 2 && !isNaN($(this).val())) {
                var len = $(this).val().length;
                var code = $(this).val().substring(0, 4)
                var patern = [];
                for (var i = 0; i < len; i++) {
                    patern[i] = code.substring(0, i + 1)
                }
                $(this).parent().find('select option').each(function (index, item) {
                    var numb = $(item).val().match(/\d/g);
                    numb = numb.join("");
                    if (checkValues(patern, numb)) {
                        $(item).show().attr('selected', true);
                        $(item).parent().show();
                        $(item).parent().parent().find('input').addClass('_phone').attr('typeInput', 'phone');
                    } else {
                        $(item).hide().attr('selected', false);
                    }
                })
                $(this).attr('typeInput', 'phone');
            } else {
                $(this).removeClass('_phone').attr('typeInput', 'email');
                $(this).parent().find('select').hide();
            }
        } else {
            $(this).parent().find('select option').show();
        }
        if($(this).parent().find('select :selected').val() == 0){
            $(this).removeClass('_phone').parent().find('select').hide();

        }
    })
    inputPhoneEmail.blur(function ()    {
        if (!isNaN($(this).val())) {
            inputPhoneEmail.attr('type', 'text');
        } else {
            inputPhoneEmail.attr('type', 'email');
        }
    })

    $('._close-dialog').on('click', function (e) {
        $('._dialog').removeClass('show');
        $('.bg-drop-show').removeClass('show');
        bodyElement.removeClass('overflow-hidden');
    });

    $('.-need-sourcing-menu').on('click',function (e){
        e.stopPropagation();
        e.preventDefault();
        $('._dialog').removeClass('show');
        $('.__mobile-menu').removeClass('show');
        $('.bg-drop-show').removeClass('show');
        bodyElement.removeClass('overflow-hidden');
        $('html, body').animate({
            scrollTop: $('.mailForm-layer').offset().top-100
        }, 300)

    })

    $('._dialog').on('click', function (e) {
        $('._dialog').removeClass('show');
        $('.bg-drop-show').removeClass('show');
        bodyElement.removeClass('overflow-hidden');
    });

    $('._quantity-holder .button_inc').on('click', function () {
        var qut = $(this).parent().children('input[name="_product-quantity"]').val(function (index, val) {
            return parseInt(val) + 1
        });
    });

    $('._quantity-holder .button_dec').on('click', function () {
        var qut = $(this).parent().children('input[name="_product-quantity"]').val(function (index, val) {
            var value = parseInt(val) - 1
            if (value <= 1) {
                value = 1;
            }
            return value;
        });
    });

    $('input[name="_product-quantity"]').on('change', function () {
        var qut = $(this).parent().children('input[name="_product-quantity"]').val(function (index, val) {
            if (val <= 0) {
                return 1;
            } else {
                return val;
            }
        });
    })

    $('._badge').on('click', function () {
        $(this).children('._badge-text').toggleClass('show');
    });

    $('#_news-let-subscribe').on('click', function () {
        validation($('.mailForm-layer-holder'), 'submit').then((trust) => {
            if (trust) {
                var data = {
                    type: $('.mailForm-layer-holder input').attr('typeinput'),
                    country: $(this).parent().find('select :selected').val() != 0 ? $(this).parent().find('select :selected').attr('country') : 'Not Set',
                    contact: $('.mailForm-layer-holder input').val(),
                    message: $('.mailForm-layer-holder textarea').val(),
                }
                console.log(data);
                saveEvent('Click On Subscribe Need Sourcing By Ajax');
                $(this).attr('disabled', true).addClass('disable');
                Arta.ajax('ajax/Main/addSubscribeNewsLet', data)
                    .success(function (response) {
                        if (response.status) {
                            $('.mailForm-layer-holder').html('<h3>Your Email Has Submitted</h3>')
                            $('#_news-let-subscribe').attr('disabled', false).removeClass('disabled');
                            setNotification(notif.success, response.message, $('.news-let-notif'), true, true);
                        } else {
                            setNotification(notif.danger, response.message, $('.news-let-notif'), true, true);
                            $('#_news-let-subscribe').attr('disabled', false).removeClass('disabled');
                        }
                    }).fail(function (fail) {
                    setNotification(notif.danger, fail.message, $('.news-let-notif'));
                    $('#_news-let-subscribe').attr('disabled', false).removeClass('disabled');
                })
            }
        })
    })


    // var banner_url = $('.top-banner').attr('data-bg');
    // $('.top-banner').css("background-image", 'url(' + banner_url + ')');

    loginWithToken();

    updateInquiryCount();


    $("#signout").on('click', function (e) {
        localStorage.setItem('token', '');
    });

    updateInquiryCount();

    $('.submitInquiry').on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        if (!isValidInformation()) {
            return;
        }
        self.html('Waiting ...').attr('disabled', 'disabled').css('cursor', 'not-allowed');
        Arta.ajax('ajax/InquiryController/submit', {data: temp})
            .success(function (oJ) {
                if (oJ.success) {
                    inquiries = [];
                    temp = [];
                    localStorage.setItem("inquiry", JSON.stringify([]));
                    setDialog('', 'Successfully', oJ.message);
                    showBasketInquiry();
                    setInquiryItems();
                } else {
                    if (oJ.code === 100020) {
                        setNotification(notifClass.danger, oJ.message);
                        setTimeout(function () {
                            window.location.href = 'login';
                        }, 1000);
                    } else {
                        setNotification(notifClass.danger, oJ.message);
                    }

                }
                self.html('Submit and Add').removeAttr('disabled').css('cursor', 'pointer');

            }).fail(function (err) {
            setNotification(notifClass.info, 'Error Please Try Again');
            self.html('Submit And Add Quote').removeAttr('disabled').css('cursor', 'pointer');
        });
    });


    $(".starContainer").each(function (e) {
        paintAvgStars($(this));
    });

    $('._mobile-menu').on('click', function () {
        $('._search-holder').fadeOut('show');
        $('._basket-holder ').fadeOut('show-basket');
        $('._member-holder').removeClass('show');
        $('.bg-drop-show').toggleClass('show');
        $('.__mobile-menu').toggleClass('show');
        $('body').toggleClass('overflow-hidden');

    });

    $('.bg-drop-show').on('click', function () {
        $(this).removeClass('show');
        $('body').removeClass('overflow-hidden');
        $('.__mobile-menu').removeClass('show');
        $('._sidebar').removeClass('show');
        $('._dialog').removeClass('show');
    });

    $('.foot-action').on('click', function (e) {
        e.stopPropagation();
        $(this).parent().toggleClass('show');

    })

    $('._show-password').on('click', function (e) {
        e.stopPropagation();
        var input = $(this).parent().children('input');
        if ('password' === input.attr('type')) {
            input.prop('type', 'text');
        } else {
            input.prop('type', 'password');
        }
    });

    $('.action').on('click', function (e) {
        e.stopPropagation();
    })



    $('._member-btn').on('click', function (e) {
        e.stopPropagation();
        $('.bg-drop-show').removeClass('show');
        $('.__mobile-menu').removeClass('show');
        $('._search-holder').fadeOut('show');
        $('._basket-holder ').fadeOut('show-basket');
        $('._member-holder').toggleClass('show');
    });

    $('._basket-btn').on('click', function (e) {
        e.stopPropagation();
        $('.bg-drop-show').removeClass('show');
        $('.__mobile-menu').removeClass('show');
        $('._search-holder').fadeOut('show');
        $('._member-holder').removeClass('show');
        $('._basket-holder ').fadeToggle('show-basket');
    });

    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });

    $('.home-blogs').owlCarousel({
        loop: true,
        dots:true,
        navigation: false,
        nav: false,
        navText: [
            "<i class='icon-arrow-left2'></i>",
            "<i class='icon-arrow-right2'></i>"
        ],
        autoplay: true,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 1,
                margin: 10
            },
            400: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1,
                margin: 30,
            }
        }
    });
})


function saveEvent(event_name){
    let data = {
        event_name: event_name,
        page_name: location.pathname,
    }
    Arta.ajax('ajax/Main/setEvenBytAjax', data)
        .success(function (response) {
            if (response.status) {
                console.log('event saved successfully : ', response);
            } else {
                console.log('fail with false status : ', response);
            }
        })
        .fail(function (response) {
            console.log('fail save event : ', response);
        })
}

function paintAvgStars(container) {
    var score = container.find(".score").val();
    for (i = 1; i <= 5; i++) {
        if (score >= i) {
            setStarClass(container.find(".star-" + i), "icon-star voted");
        } else if (Math.ceil(score) == i) {
            setStarClass(container.find(".star-" + i), "icon-star-half voted");
        } else {
            setStarClass(container.find(".star-" + i), "icon-star");
        }
    }
}

function setStarClass(element, clas) {
    element.removeClass();
    element.addClass(clas);
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


/*Main Methods__________________*/
function setDialog(type, title, message) {
    dialogElement.addClass('show-dialog');
    bodyElement.addClass('overflow-hidden');
    var overly = '<div id="dialog_overly"></div>'
    var div = '    <span class="ti-close" id="close_dialog"/>\n' +
        '    <div class="icon icon--order-success svg add_bottom_15">\n' +
        '        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72">\n' +
        '            <g fill="none" stroke="#8EC343" stroke-width="2">\n' +
        '                <circle cx="36" cy="36" r="35"\n' +
        '                        style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px;"></circle>\n' +
        '                <path d="M17.417,37.778l9.93,9.909l25.444-25.393"\n' +
        '                      style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px;"></path>\n' +
        '            </g>\n' +
        '        </svg>\n' +
        '    </div>\n' +
        '    <h2>' + title + '</h2>\n' +
        '    <p>' + message + '</p>\n' +
        '';
    dialogElement.after(overly);
    dialogElement.html(div);

    $(".close_dialog").on('click', function (e) {
        dialogElement.removeClass('show-dialog');
        bodyElement.removeClass('overflow-hidden');
        dialogElement.html('');
        $("#dialog_overly").remove();
    });
    $('._dialog').on('click', function (e) {
        dialogElement.removeClass('show-dialog');
        bodyElement.removeClass('overflow-hidden');
        dialogElement.html('');
        $("#dialog_overly").remove();
    });
    // setTimeout(function () {
    //     clearNotification();
    // }, 5000);
}

function clearNotification(ID) {
    var natif = '#notification_' + ID + '';
    setTimeout(function () {
        $(natif).fadeOut();
        presentNotification = presentNotification - 1;
    }, 5000);

}

function setNotification(type, message, holder, scroll = true, force = false) {
    if (presentNotification >= maxNotification) {
        removeMaxOverNotifications(holder);
    }
    var notification = '<li id="notification_' + notifID + '" class="flex align-center ' + type + '">' +
        '<img class="notifIcon" src="' + notifIcon(type) + '" /><p>' + message + '</p>' +
        '<i class="icon-close"></i>' +
        '</li>'
    holder.prepend(notification);
    if (!force) {
        clearNotification(notifID);
    }
    notifID = notifID + 1;
    presentNotification = presentNotification + 1;
    $('.notif-holder li').on('click', function () {
        var self = $(this);
        self.remove();
    });
    if (scroll) {
        $('html, body').animate({scrollTop: holder.offset().top - 200}, 500)

    }
    console.log(presentNotification);

}

function removeMaxOverNotifications(holder) {
    var len = 0;
    $(holder).find('li').each(function (index, item) {
        len = len + 1;
        if (len >= maxNotification) {
            $(holder).find('li').fadeOut();
        }
    })

}

function loginWithToken() {
    if (token && !$("#customer_id").val()) {
        var data = {
            token: token,
        };
        // $("#spinner").fadeToggle();
        // $('body').addClass('show-spinner');
        Arta.ajax('ajax/Authentication/loginWithToken', data)
            .success(function (oJ) {
                if (oJ.success) {
                    location.reload();
                    // $("#spinner").fadeToggle();
                    // $('body').removeClass('show-spinner');
                } else {
                    localStorage.setItem('token', '');
                    window.location.href = '/login';
                    // $("#spinner").fadeToggle();
                    // $('body').removeClass('show-spinner');
                }
            }).fail(function (err) {
            window.location.href = '/login';
            localStorage.setItem('token', '');
        });
    }
}

function clearErrorMessage() {
    $(".error-message").remove();
    $(".checkmark").removeClass('error');
    $(".error-border").removeClass('error-border');

}

function isLogin() {
    if ($('#customer_id').val()) {
        return true;
    }
    return false;
}


/*Shop Methods__________________*/



async function validation(holder, args) {
    var trust = true;
    $(holder).find('.required').each(function (index, input) {
        if (!$(input).val().length) {
            $(input).addClass('error');
            $(input).parent().find('small').html('this field is required');
            checkInputs()
            trust = false;
        } else if ($(input).attr('type') == 'email' && !regex.test($(input).val())) {
            $(input).addClass('error');
            $(input).parent().find('small').html('email format is incorrect');
            checkInputs();
            trust = false;
        } else {
            $(input).parent().find('small').html('this field is required');
            $(input).removeClass('error');
        }
        checkInputs();
    });
    if (!trust && args === 'submit') {
        var sco = $('.error').offset().top;
        $('body, html').animate({scrollTop: sco - 300});
    }
    return trust;
}

function checkInputs() {
    $('.error').blur(function () {
        if ($(this).val()) {
            $(this).removeClass('error');
        }
    });
}

function getFilterResult(FilterType, data) {
    $('.filter-btn').addClass('d-none');
    $('.filters').addClass('filter-opacity');
    $("#spinner").fadeToggle();
    $('body').addClass('show-spinner');
    Arta.ajax(FilterType, data)
        .success(function (oJ) {
            var page_number = data.pageNumber;
            var urlData = window.location.href;
            if (urlData.includes("keyword")) {
                var urlParams = new URLSearchParams(window.location.search);
                var keyword = urlParams.get('keyword');
                history.pushState({}, null, '?keyword=' + keyword + '&page=' + page_number);
            } else if (urlData.includes("&page")) {
                history.pushState({}, null, '&page=' + page_number);
            } else {
                history.pushState('', '', '?page=' + page_number);
            }


            // history.pushState('','', '?page=' + page_number);
            if (page_number > 1) {
                $(window).scrollTop(350);
            }
            $(".starContainer").each(function (e) {
                paintAvgStars($(this));
            });

            $('.filters').removeClass('filter-opacity');
            $("#spinner").fadeToggle();
            $('body').removeClass('show-spinner');
            $('.filter-btn').removeClass('d-none');
            $('.filter-btn').addClass('fade-filter-btn');
            $('.page-select').on('click', function (event) {
                $(this).addClass('current');
                pageNumber = $(this).attr('data-value');
                data.pageNumber = pageNumber;
                getFilterResult(FilterType, data);
                event.preventDefault();
            })
            $('.next').on('click', function (event) {
                data.pageNumber++;
                getFilterResult(FilterType, data);
                event.preventDefault();
            });
            $('.prev').on('click', function (event) {
                data.pageNumber--;
                getFilterResult(FilterType, data);
                event.preventDefault();
            });
            addToInquiry();
            var searchResultHeight = $('#search_result').height() + $('.top_banner').height() + $('header').height();
            $(window).on('scroll', function () {
                var scrolled = $(window).scrollTop();
                if (scrolled >= searchResultHeight) {
                    $('.filter-btn').removeClass('fade-filter-btn');
                } else {
                    $('.filter-btn').addClass('fade-filter-btn');

                }
            })

        }).fail(
        $('.search-result').html('<div>' +
            '<h2>Problem has Occurred</h2>' +
            '<a class="btn_1" htef="/">Try Agin</a>' +
            '</div>')
    );
}


var service = {
    storage: function (file) {
        files = [];
        files.push(file);
        Arta.upload('ajax/Services/storage', files, null)
            .success(function (response) {
                if (response.success) {
                    return response.uniq_id;
                } else {
                    console.log('response no success', response)
                }
            })
            .fail(function (err) {
                console.log('err', err)
            });
    },
};







