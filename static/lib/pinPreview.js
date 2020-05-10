'use strict';

/* globals document, $ */
// var bootstrap='<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">';
// bootstrap+='\n<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>'
// bootstrap+='\n<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>'
// bootstrap+='\n<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>'

$(document).ready(function () {
});
$(window).on('action:ajaxify.end', function (event, data) {
    if (data.url == "pin-preview") {
        renderDataContainer()
        $('#querryBtn').on('click', function () {
            renderDataContainer()
        })
    }
});
function renderDataContainer() {
    var dataContainer = $('#data-container');
    var sortedOp = $('#filter-dropbox option:selected').val();
    var categoryOp=$('#filter-categories-dropbox option:selected').val();
    var nameOp =$('#filter-name-input').val();
    var options = { 
        sort: sortedOp,
        category: categoryOp,
        name: nameOp }
    socket.emit('modules.getTopicsToPin', options, function (err, result) {
        dataContainer.empty();
        dataContainer.append(result);
        var buttonPins = $('button.btn-pin');
        for (var i = 0; i < buttonPins.length; i++) {
            buttonPins[i].addEventListener('click', function () {
                var thisButton = $(this);
                var pinModal = $('#pinChoose');
                pinModal.remove();
                // if (!pinModal[0]) {//check if modal render or not
                //Emit socket to render modal
                socket.emit('modules.renderPinChoose', null, function (err, result) {
                    //result is html text
                    $('body').append(result);
                    $('#pinChoose').css("display", "block");
                    $('#pinChoose').attr('data-tid', thisButton.data('tid'));
                    $('#pinChoose span.close').click(function (e) {
                        // console.log('closing');
                        $('#pinChoose').css("display", "none");
                    });
                    $('button#submitPin').on('click', submitFunc);
                });
                // }
                // else {
                //     pinModal.css("display", "block");
                // }
            })
        }
    })
}
var submitFunc = function () {
    var key = "pindealbee:"
        + $('#pinChoose .modal-content-body input:checked').data('type')
        + ":"
        + $('#pinChoose .modal-content-body input:checked').data('position')
    var topicId = $('#pinChoose').data('tid');
    var dataStore = {
        key: key,
        tid: topicId
    }
    // console.log(dataStore);
    $('#pinChoose span.close').trigger('click');
    if ($('#pinChoose .modal-content-body input:checked').data('type')) {
        $('#pinChoose span.close').trigger('click');
        socket.emit('modules.submitPin', dataStore, function (err, result) {
        })
        console.log(dataStore);
    }
    else
        alert("Please choose position")
}