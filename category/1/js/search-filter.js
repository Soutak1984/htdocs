$(document).ready(function () {
    $('.products-filter-btn').on('click',function (){
        $('body').toggleClass('overflow-hidden');
        $('.bg-drop-show').toggleClass('show');
        $('._sidebar').toggleClass('show');
    })
});