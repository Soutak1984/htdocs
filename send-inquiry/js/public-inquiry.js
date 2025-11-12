var inquiryCount = 0;
var uploadAgain = $('.upload-try-again');
var uploadedFile = "";
var uploadQuoteFile = $('#_upload-quote-file');
var uploadExcelFile = $('#_upload-excel-file');
var firstName = $('#_first-name');
var lastName = $('#_last-name');
var email = $('#_email');
var phoneNumber = $('#_phone-number');
var message = $('#_message');
var selectedDelete = '';
var addMoreInquiry = $('._add-more-inquiry');
var inquiryList = $('#inquiry-list');
var customerForm = $('._customer-information-holder');
var contactNotification = $('.contactNotification')
var uploadExcelHolder = $('.upload-excel-holder');
var sendExcelBtn = $('._send-excel-btn');

var inquiryLastIndex = 1;
var messagesinquiry = $('#table-notification-message');

$(document).ready(function () {
    saveEvent('Enter-To-Inquiry-Page By Ajax');
    $('._send-excel-btn').on('click', function (e) {

        var file = uploadExcelFile[0].files[0];
        $('._upload-box .fancy-spinner').toggleClass('show');
        sendExcelBtn.attr('disabled', true).addClass('disable');
        Arta.upload('ajax/InquiryController/getExcelRows', {file})
            .success(function (response) {
                if (response.status) {
                    var excelList = response.inquiryList;
                    var noRepeated = true;
                    $(excelList).each(function (index, item) {
                        noRepeated = addToInquiry(item, false);
                    })
                    if (!noRepeated) {
                        setNotification(notif.warning, 'Some Of Part Numbers Are Duplicated!', messagesinquiry, false, true)
                    }
                    uploadExcelFile.val('');
                    $('._send-excel-btn').addClass('disable').attr('disabled', true).attr('title', 'first choose and upload your bom file then submit');
                    $('._file-src').val('');
                    inquiryTable();
                    $('html, body').animate({scrollTop: $('.inquiry-list-table').offset().top}, 500)
                } else {
                    setNotification(notif.danger, response.msg, uploadExcelHolder, true);
                    uploadExcelFile.val('');
                    $('._file-src').val('');
                }
                sendExcelBtn.attr('disabled', false).removeClass('disable');
                $('._upload-box .fancy-spinner').toggleClass('show');
            })
            .fail(function (fail) {
                console.log(fail);
            });
    });

    addMoreInquiry.on('click', function () {
        insertRow();
    });

    $('.delete-item-confirm').on('click', function (e) {
        e.stopPropagation();
        if (selectedDelete) {
            deleteItem();
        }
    });

    $('#_upload-quote-file').change(function () {

        var self = this;
        var fileName = readURL(self);
        $('._file-src').val(fileName);


    });

    uploadExcelFile.change(function (e) {
        var file = this;
        console.log(e);

        if (checkExcel(file)) {
            var fileName = readURL(file);
            uploadExcelFile.parent().parent().find('._file-src').val(fileName);
            $('._send-excel-btn').removeClass('disable').attr('disabled', false).removeAttr('title');


        }
    })


    $('.upload-try-again').on('click', function () {
        uploadFile(uploadedFile);
    })

    $('#_let-inquiry').on('click', function (e) {

    })

    $('#_submit-inquiry').on('click', function (e) {
        submitInquiryList(e);
    });

    fillContactInformation();

    checkInputs();

    inquiryTable();

});

function insertRow() {
    var rowNumber = inquiryLastIndex + 1;

    inquiryList.append('<tr class="_new-row"><td class="_index-text">' + rowNumber + '</td>\n' +
        '                            <td class="_part-no-text "><input placeholder="Your Part no" value=""></td>\n' +
        '                            <td class="_qty-text "><input  type="number"  placeholder="Quantity of Items" value=""></td>\n' +
        '                            <td class="_brand-text "><input placeholder="Brand" value=""></td>\n' +
        '                            <td class="_target_price-text "><input type="number"  placeholder="Target Price" value=""><select  class="_unit-price "><option value="Dollar">Dollar</option><option value="URO">URO</option></select></td>\n' +
        '                            <td><p class="_description-text "><textarea placeholder="Describe Inquiry here..."></textarea></p></td>\n' +
        '<td class="_actions">\n' +
        '<button title="remove inserted row" class="delete-new-row">\n' +
        '                            <i class="remove-inquiry-item icon-trash"></i>\n' +
        '                        </button>\n' +
        '                        </td>                           ' +
        ' </tr>')
    addMoreInquiry.hide();
    watchTemp();
}

function watchTemp() {
    $('#inquiry-list ._new-row input,#inquiry-list ._new-row textarea').blur(function () {
        var value = $(this).val().trim();
        var noRepeated = true;
        if (value.length > 0) {
            addMoreInquiry.show();
            noRepeated = addToInquiry(getNewRowData(), false);
            if (!noRepeated) {
                setNotification(notif.warning, 'Part Number Exist!', messagesinquiry, true);
            }
            // else{
            //     $(this).parent().parent()
            //         .addClass('_done').removeClass('_new-row')
            //         .find('input').removeClass('disable').attr('disabled',false);
            //     $
            // }
        } else {
            addMoreInquiry.hide();
        }
    })
    $('#inquiry-list ._new-row .delete-new-row').on('click', function () {
        if ($(this).parent().parent().find('._index-text').text() != 1) {
            $(this).parent().parent().remove();
            addMoreInquiry.show();
        }
    })

}

function getNewRowData() {
    var lastItem = $('#inquiry-list tr:last-child');
    var Data = {
        part_no: lastItem.find('._part-no-text input').val() ? lastItem.find('._part-no-text input').val() : '',
        qty: lastItem.find('._qty-text input').val() ? lastItem.find('._qty-text input').val() : '',
        brand: lastItem.find('._brand-text input').val() ? lastItem.find('._brand-text input').val() : '',
        target_price: lastItem.find('._target_price-text input').val() ? lastItem.find('._target_price-text input').val() : '',
        unit: lastItem.find('._unit-price :selected').val() ? lastItem.find('._target_price-text input').val() : 'Dollar',
        link: '',
        description: lastItem.find('._description-text textarea').val() ? lastItem.find('._description-text textarea').val() : '',
        is_china_market: false,
        is_factory: false,
        is_world_market: false,
        data_sheet: '',
        data_sheet_name: '',
    }
    console.log('Data', Data);
    return Data;
}

function getRowData(dataIndex) {
    var intendedRow = inquiryList.find(`[index-row='${dataIndex}']`)
    var Data = {
        part_no: intendedRow.find('._part-no-text input').val() ? intendedRow.find('._part-no-text input').val() : '',
        qty: intendedRow.find('._qty-text input').val() ? intendedRow.find('._qty-text input').val() : '',
        brand: intendedRow.find('._brand-text input').val() ? intendedRow.find('._brand-text input').val() : '',
        target_price: intendedRow.find('._target_price-text input').val() ? intendedRow.find('._target_price-text input').val() : '',
        unit: intendedRow.find('._unit-price :selected').val() ? intendedRow.find('._unit-price :selected').val() : 'Dollar',
        link: '',
        description: intendedRow.find('._description-text textarea').val() ? intendedRow.find('._description-text textarea').val() : '',
        is_china_market: false,
        is_factory: false,
        is_world_market: false,
        data_sheet: '',
        data_sheet_name: '',
    }
    console.log('Data', Data);
    return Data;
}

function uploadFile(files) {
    uploadAgain.html('Uploading ...');
    Arta.upload('ajax/Services/storage', files, {})
        .success(function (response) {
            if (response.success) {
                uniqId = response.uniq_id;
                $(uploadQuoteFile).attr('data-id', uniqId);
                console.log('res', response);
                uploadAgain.html('Upload Again');
                uploadAgain.removeClass('show');
            } else {
                setNotification(notif.danger, response.message, messagesinquiry)
                uploadAgain.addClass('show');
                uploadAgain.html('Upload Again');
                uploadAgain.addClass('show');
            }
            uploadAgain.html('Upload Again');
        })
        .fail(function (err) {
            alert('Error In Upload File : ' + err + '')
            console.log('err', err);
            uploadAgain.html('Upload Again');
            uploadAgain.addClass('show');
        });
}

function localStorageSpace() {
    var allStrings = '';
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) : 0;
}

function readURL(input) {
    console.log('input', input.files[0].type)
    var ext = input.files[0].type;
    var size = input.files[0].size / 1024;
    if ((localStorageSpace() + size) > 500) {
        setNotification(notif.warning, 'file uploaded size is more than 500', messagesinquiry);
        return false;
    }

    if ((localStorageSpace() + size) > 5000) {
        setNotification(notif.warning, 'file uploaded size is more than 500', messagesinquiry);
        return false;
    }
    if (input.files && input.files[0] && (
        ext === "image/png" || ext === "image/jpeg" || ext === "image/jpg" || ext === "application/pdf" || ext === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || ext === "application/vnd.ms-excel"
    )) {
        var path = $(input).val();
        var filename = '';
        filename = path.replace(/^.*\\/, "");
        return filename;
    } else {
        $(input).val("");
        setNotification(notif.warning, 'File Format unAvailable', messagesinquiry);
        return false;
    }

}

function checkExcel(input) {
    var ext = input.files[0].type;
    if (input.files && input.files[0] && (
        ext == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || ext == "application/vnd.ms-excel"
    )) {
        return true;
    } else {
        setNotification(notif.warning, 'File Format is not excel', messagesinquiry);
        return false;
    }
}

function addToInquiry(rowData, notification = false) {
    var Available = 1;
    var temp = JSON.parse(localStorage.getItem("inquiry")) || [];
    var maxIndex = 0;
    for (var i = 0; i < temp.length; i++) {
        maxIndex = Math.max(temp[i].index, maxIndex);
    }
    maxIndex++;
    var inquiryItem = {
        index: maxIndex,
        part_no: rowData.part_no ? rowData.part_no : '',
        brand: rowData.brand ? rowData.brand : '',
        qty: rowData.qty ? rowData.qty : '1',
        target_price: rowData.target_price ? rowData.target_price : '',
        unit: rowData.unit ? rowData.unit : 'Dollar',
        link: rowData.link ? rowData.link : '',
        description: rowData.description,
        is_china_market: false,
        is_world_market: false,
        is_factory: false,
        data_sheet: rowData.data_sheet ? rowData.data_sheet : '',
        data_sheet_name: rowData.data_sheet_name ? rowData.data_sheet_name : '',
        is_editable: true
    };
    $.each(temp, function (item, index) {
        if (inquiryItem.part_no === index.part_no && index.part_no.trim() != '') {
            Available = 0;
            if (notification) {
                setNotification('warning', inquiryItem.part_no + ' ' + 'Part is exist in List', messagesinquiry)
            }
            return false;
        }
    })
    if (Available === 1) {
        temp.push(inquiryItem);
        localStorage.setItem("inquiry", JSON.stringify(temp));
        inquiryTable();
        if (notification) {
            setNotification(notif.success, 'Part ' + inquiryItem.part_no + ' Added Successfully', messagesinquiry);
        }
        $('.inquiryCount').addClass('blob');
        updateInquiryCount();
        setTimeout(function () {
            $('.inquiryCount').removeClass('blob');
        }, 2000)
        return true;
    }
}

function inquiryTable() {
    var table = $('#inquiry-list');
    table.html('');
    var list = JSON.parse(localStorage.getItem("inquiry")) || [];
    if (list.length > 0) {
        $('#_let-inquiry').removeClass('disable');
        customerForm.show();
        addMoreInquiry.show();
        $('.inquiry-list-layer').addClass('have-item');
        $('._confirm-list-base ').show();
        $('#_contact-info').show();
        $('._send-rfq-icon').show();

    } else {
        inquiryLastIndex = 0;
        $('.inquiry-list-layer').removeClass('have-item');
        insertRow();
        $('#_let-inquiry').addClass('disable');
        $('._confirm-list-base').hide();
        $('#_contact-info').hide();
        $('._send-rfq-icon').hide();

    }
    $(list).each(function (index, item) {
        var unit = item.unit;
        if (item.target_price) {
            unit = item.unit;
        }
        var isEmpty = '_done';
        if (item.part_no == "") {
            isEmpty = '_empty'
        }
        inquiryLastIndex = index + 1;
        var rowItem =
            '<tr class="' + isEmpty + '" index-row="' + item.index + '" >' +
            '                            <td class="_index-text">' + parseInt(index + 1) + '</td>\n' +
            '                            <td class="_part-no-text"><input class="_part_no"  data-index="' + item.index + '" placeholder="Your Part Number" value="' + item.part_no + '" /></td>\n' +
            '                            <td class="_qty-text"><input type="number"  data-index="' + item.index + '" placeholder="Quantity of Items" value="' + item.qty + '"/></td>\n' +
            '                            <td class="_brand-text"><input data-index="' + item.index + '" placeholder="Brand" value="' + item.brand + '" /></td>\n' +
            '                            <td class="_target_price-text"><input type="number" data-index="' + item.index + '" placeholder="Target Price" value="' + item.target_price + '" /><select data-index="' + item.index + '" class="_unit-price"><option ' + `${unit == 'Dollar' ? 'selected' : ''}` + ' value="Dollar">Dollar</option><option ' + `${unit == 'URO' ? 'selected' : ''}` + ' value="URO">URO</option></select></td>\n' +
            '                            <td ><p class="_description-text"><textarea data-index="' + item.index + '" placeholder="Describe Inquiry here..." >' + item.description + '</textarea></p></td>\n' +
            '<td class="_actions">\n' +
            '<button  data-index="' + item.index + '" class="delete-row" data-toggle="modal" data-target="#deleteItem">\n' +
            '                            <i class="remove-inquiry-item icon-trash"></i>\n' +
            '                        </button>\n' +
            '                        </td>' +
            '                            </tr>'
        $(table).append(rowItem);
    });

    watchEditItem();

    watchDeleteItem();
}
function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};

function watchEditItem() {
    inquiryList.find('tr input').on('change input',function (e) {
        e.stopPropagation();
        e.preventDefault();
        var dataIndex = $(this).attr('data-index')
        var data = getRowData($(this).attr('data-index'));
        editItem(dataIndex, data);
    })
    var timeout;
    var delay = 1000;   // .5 seconds

    // inquiryList.find('tr textarea').keyup(function(e) {
    //     var dataIndex = $(this).attr('data-index')
    //     let data = getRowData($(this).attr('data-index'));
    //     if(timeout) {
    //         clearTimeout(timeout);
    //     }
    //     timeout = setTimeout(function(data,dataIndex) {
    //         editItem(dataIndex, data);
    //     }, delay);
    // });

    inquiryList.find('tr textarea').blur(function(e) {
        var dataIndex = $(this).attr('data-index')
        let data = getRowData($(this).attr('data-index'));
        editItem(dataIndex, data);
    });

        inquiryList.find('._unit-price').on('change', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var dataIndex = $(this).attr('data-index')
        var data = getRowData($(this).attr('data-index'));
        editItem(dataIndex, data);
    })
    inquiryList.find('tr ._part_no').on('input', function (e) {
        if ($(this).val().trim() == '') {
            $(this).parent().parent().removeClass('_done').addClass('_empty');
        } else {
            $(this).parent().parent().removeClass('_empty').addClass('_done');
        }
    })
}

function editItem(dataIndex, data) {
    temp = JSON.parse(localStorage.getItem("inquiry")) || [];
    var index = temp.findIndex(x => x.index == dataIndex);
    if (temp[index]) {
        temp[index].part_no = data.part_no;
        temp[index].qty = data.qty;
        temp[index].description = data.description;
        temp[index].brand = data.brand;
        temp[index].target_price = data.target_price;
        temp[index].unit = data.unit;
        // setNotification(notif.success,'Intended Row Updated',messagesinquiry);
    }
    localStorage.setItem("inquiry", JSON.stringify(temp));
    // inquiryTable();
}

function submitInquiryList(e) {
    if (!haveEmptyField() || !getContactInformation()) {
        return false;
    }
    var data = {
        customer: getContactInformation(),
        items: temp = JSON.parse(localStorage.getItem("inquiry")) || []
    }
    var htmlTemp = $('#_submit-inquiry');
    $(htmlTemp).html('Waiting..').attr('disabled', 'disabled').css('cursor', 'not-allowed');
    if (data.items.length > 0) {
        console.log(data);
        Arta.ajax('ajax/InquiryController/submit', data)
            .success(function (response) {
                if (response.status) {
                    inquiries = [];
                    temp = [];
                    localStorage.setItem("inquiry", JSON.stringify([]));
                    $('#_submit-inquiry').html(htmlTemp);
                    setNotification(notif.success, response.message, contactNotification, false, true);
                    customerForm.hide();
                    updateInquiryCount();
                    inquiryTable();
                    $('._submitted-list').append('' +
                        '<div class="_submitted-inquiry">' +
                        '<h2>Your Inquiry Has Been Registered</h2>' +
                        '<p>Tracking Code : <strong>' + response.data.inquiry_id + '</strong></p>' +
                        '</div>')
                    $('html, body').animate({scrollTop: $('.contactNotification').offset().top - 200}, 500)
                    inquiryLastIndex = 1;
                } else {
                    setNotification(notif.danger, response.message, messagesinquiry);
                }
                $(htmlTemp).html('Lets Submit Your Inquiry').removeAttr('disabled').css('cursor', 'pointer');

            }).fail(function (err) {
            setNotification(notif.success, err.message, messagesinquiry)
            $(htmlTemp).html('Submit').removeAttr('disabled').css('cursor', 'pointer');

        });
    } else {
        setNotification(notif.danger, 'List is Empty', messagesinquiry);
        $(htmlTemp).html('Lets Submit Your Inquiry').removeAttr('disabled').css('cursor', 'pointer');
    }

}

function haveEmptyField() {
    var trust = true;
    temp = JSON.parse(localStorage.getItem("inquiry")) || [];
    $(temp).each(function (index, item) {
        if (!item.part_no) {
            trust = false;
            setNotification(notif.danger, 'PART-NO Field is Empty', messagesinquiry);
        }
    })
    return trust;

}

function watchDeleteItem() {
    $('#inquiry-list .delete-row').on('click', function (e) {
        $('.bg-drop-show').addClass('show');
        bodyElement.addClass('overflow-hidden');
        $('._dialog').addClass('show').removeClass('hidden');
        var data_index = $(this).attr('data-index');
        e.stopPropagation();
        selectedDelete = data_index;
    });
}

function deleteItem() {
    console.log('run', selectedDelete)

    temp = JSON.parse(localStorage.getItem("inquiry")) || [];
    var newTemp = temp.filter(function (item, index) {
        return item.index != selectedDelete;
    });
    localStorage.setItem("inquiry", JSON.stringify(newTemp));
    $('.bg-drop-show').removeClass('show');
    $('._dialog').removeClass('show');
    bodyElement.removeClass('overflow-hidden');
    inquiryTable();
    updateInquiryCount();
}

function fillContactInformation() {
    var data = JSON.parse(localStorage.getItem("ContactInformation"));
    if (data) {
        firstName.val(data.first_name);
        lastName.val(data.last_name);
        email.val(data.email);
        phoneNumber.val(data.phone_number);
        message.val(data.message)
    }
}

function getContactInformation() {
    if (!firstName.val()) {
        firstName.addClass('error');
        checkInputs();
        return false;
    }
    if (!lastName.val()) {
        lastName.addClass('error');
        checkInputs();
        return false;
    }
    if (!email.val()) {
        email.addClass('error');

    }
    if (!emailRegex.test(email.val())) {
        email.addClass('error');
        // setNotification('danger', 'Email Format is incorrect', messagesMain);
        email.parent().find('.error-message').html('Email Format is incorrect');
        checkInputs();
        return false;
    }

    data = {
        'first_name': firstName.val(),
        'last_name': lastName.val(),
        'email': email.val(),
        'phone_number': phoneNumber.val(),
        'message': message.val()
    }
    localStorage.setItem("ContactInformation", JSON.stringify(data));
    return data;
}

function haveItem() {
    temp = JSON.parse(localStorage.getItem("inquiry")) || [];
    if (temp.length > 0) {
        return true;
    } else {
        return false;
    }
}

function isValidInformation() {
    // $(".table-error-message li").remove();
    var isValid = true;
    if (!emailRegex.test(email.val())) {
        email.parent().find('.error-message').html('Email Format is incorrect');
        email.addClass('error');
        isValid = false;
    } else {
        email.removeClass('error');
    }
    return isValid;
}






