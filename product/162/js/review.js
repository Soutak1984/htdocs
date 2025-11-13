var inputReview = $('._write-review fieldset input');
var inputReviewValue = 5;
var reviewWriterHolder = $('._review-writer-input-holder');

$(document).ready(function (){
    $('._write-review ._rating-value').html(inputReview.val())
    inputReview.on('change',function (){
        $('._write-review ._rating-value').html($(this).val());
        inputReviewValue = $(this).val();
    })
    $('#_submit-review').on('click',function (e){
        validation($('._write-review'),'submit').then((trust) => {
                if (trust) {
                    var data ={
                        first_name:$('#writer-first-name').val() ,
                        last_name: $('#writer-last-name').val() ,
                        email: $('#writer-email').val(),
                        body_text: $('#writer-text').val(),
                        rating : inputReviewValue,
                        id: $('#_product_id').val(),
                    }
                    console.log(data);
                    $(this).attr('disabled',true);
                    Arta.ajax('ajax/ReviewController/addReview',data)
                        .success(function (response){
                            if (response.status){
                                reviewWriterHolder.html('<h3>Your Review Has Submitted</h3>')
                                $('#_submit-review').attr('disabled',false);
                            }
                        }).fail(function (fail){
                        console.log(fail);
                    })
                }
            }
        )
    })
})