$(document).ready(function (e){

    $('.tabs-holder .nav').on('click',function (e){
        var aria = $(this).attr('aria-controls');
        var selectedAria =  $('.tabs-holder .active').attr('aria-controls');
        $('.tabs-holder').find('.active').removeClass('active');
        $(this).addClass('active');
        if(aria !== selectedAria){
            $('.tab-bodies').find('.active').removeClass('active');
            $('.tab-body[aria-label='+aria+']').addClass('active');

        }
    })


});