'use strict';
$(document).ready(function () {

});
$(window).on('action:ajaxify.end', function (event, data) {
    if (data.url == 'pindealbee/preview') {
        socket.on('unpin-post', function (data) {
            console.log(data);
            app.alert({
                type: 'info',
                title: 'topic unpin',
                message: '<strong>' + data.title + '</strong></br>' + data.category,
                timeout: 10000
            });
            $.post(config.relative_path + '/pindealbee/preview/update-view', null)
                .done(function (res) {
                    $('#content').empty();
                    $('#content').append(res);
                    $('.unpin-btn').on('click', functionUnpin)
                    var divChange = $('button[data-posid="' + data.posId + '"][data-typeid="' + data.typeId + '"]').parent().parent();
                    console.log(divChange);
                    divChange.css("box-shadow", "0px 0px 5px #fda34b")
                    changeHref()
                })
        });
        socket.on('pin-post', function (data) {
            console.log(data);
            app.alert({
                type: 'success',
                title: 'topic pin',
                message: '<strong>' + data.title + '</strong></br>' + data.category,
                timeout: 10000
            });
            $.post(config.relative_path + '/pindealbee/preview/update-view', null)
                .done(function (res) {
                    $('#content').empty();
                    $('#content').append(res);
                    $('.unpin-btn').on('click', functionUnpin)
                    var divChange = $('button[data-posid="' + data.posId + '"][data-typeid="' + data.typeId + '"]').parent().parent();
                    divChange.css("box-shadow", "0px 0px 5px #337ab7")
                    changeHref()
                })
        });
        $('.unpin-btn').on('click', functionUnpin)
        changeHref()
    }
});
var functionUnpin = function () {
    var typeId = $(this).data('typeid');
    var posId = $(this).data('posid');
    var tid = $(this).data('tid');
    var title = $(this).parent().parent().find(".card-title").text()
    var category = $(this).parent().parent().find(".category-name").text()
    bootbox.confirm({
        title: "Confirmation",
        message: "Do you want to unpin this topic?",
        callback: function (ok) {
            if (ok) {
                $.ajax({
                    url: config.relative_path + '/pindealbee/unpin/' + 'pindealbee:' + typeId + ":" + posId + "/" + tid,
                    type: 'DELETE',
                })
                    .done(function (res) {
                        socket.emit('modules.pindealbeeUnpin',
                            {
                                typeId: typeId,
                                posId: posId,
                                title: title,
                                category: category
                            }, function (err, result) {
                            });
                    })
                    .fail(function (res) {
                        app.alertError('Unpin fail')
                    })
            }
        }
    })
}
var changeHref = function () {
    var a = $('.card .card-title a')
    for (var i = 0; i < a.length; i++) {
        $(a[i]).attr('href', config.relative_path + $(a[i]).attr('href'))
    }
}