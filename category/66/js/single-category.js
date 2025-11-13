$(document).ready(function () {
    getFilterResult(FilterType(),getData());

    $('._spec-item input').on('change',function (){
        getFilterResult(FilterType(),getData());
    })

});

function getData() {
    var data = {
        category_id: $("#content-items").attr('category_id'),
        brand_ids: [],
        spec_ids: [],
        pageNumber: extractPageNOFromUrl(),
        itemCount: 9,
        paginationListCount: 7
    };


    $('.specs .row-filter').each(function (index,item){
        var valueArray=[];
        $(item).find('input:checked').each(function (valIndex,valItem){
            valueArray.push($(valItem).attr("data-val"))
        })
        data.spec_ids.push(valueArray);
    })

    $('.brand-checkbox').find('input:checked').each(function (index,item) {
        data.brand_ids.push($(item).attr("data-val"));
    });

    // $('._spec-checkbox').find('input:checked').each(function (index,item) {
    //     data.spec_ids.push($(item).attr("data-val"));
    // });
    data.spec_ids =  JSON.stringify(data.spec_ids);
    data.brand_ids = data.brand_ids.toString();
    console.log('data',data);
    return data;
}

function pageViweType() {
    posation = $('.result-view.active').attr('data-value');
    return posation;
}

function FilterType() {
    return 'ajax/CategoryController/categorySearch';
}

function extractPageNOFromUrl() {
    var pageNO = 1;

    var url = window.location.href;
    if (url.includes('&page=')) {
        pageNO = window.location.href.split('&page=')[1];
    }
    return pageNO
}

function getFilterResult(FilterType, data) {
    $('.filter-btn').addClass('d-none');
    $('.filters').addClass('filter-opacity');
    $('.fancy-spinner').addClass('show');

    Arta.ajax(FilterType, data)
        .success(function (response) {
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

            if (page_number > 1) {
                console.log(page_number);
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
            watchAddToInquiry();
            watchAddedToInquires();
            var searchResultHeight = $('#content-items').height() + $('.top_banner').height() + $('header').height();
            $(window).on('scroll', function () {
                var scrolled = $(window).scrollTop();
                if (scrolled >= searchResultHeight) {
                    $('.filter-btn').removeClass('fade-filter-btn');
                } else {
                    $('.filter-btn').addClass('fade-filter-btn');

                }
            })
            $('.fancy-spinner').removeClass('show');

        }).fail(
        $('.search-result').html('<div>' +
            '<h2>Problem Has Occurred</h2>' +
            '<a class="btn_1" htef="/">Try Agin</a>' +
            '</div>')
    );
}