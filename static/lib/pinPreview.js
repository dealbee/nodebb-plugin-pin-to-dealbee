'use strict';
require(['pagination'], function (pagination) {
    const LIMIT = 10;
    $(document).ready(function () {
        $(window).bind("pageshow", function (event) {
            if (event.originalEvent.persisted) {
                window.location.reload();
            }
        });
    });
    $(window).on('action:ajaxify.end', function (event, data) {
        if (data.url == 'pindealbee') {
            $('#page-preview-btn').attr('href', config.relative_path + "/pindealbee/preview")
            renderDataContainer();
            $('#querryBtn').on('click', function () {
                renderDataContainer();
                var a = $('#data-container a')
                for (var i = 0; i < a.length; i++) {
                    $(a[i]).attr('href', config.relative_path + $(a[i]).attr('href'))
                }
            });
        }
    });

    function paginate(pagination) {
        let skip = (pagination.pageNumber - 1) * LIMIT;
        let dataContainer = $('#data-container');
        let sortedOp = $('#filter-dropbox option:selected').val();
        let categoryOp = $('#filter-categories-dropbox option:selected').val();
        let nameOp = $('#filter-name-input').val();
        socket.emit('modules.getTopics', {
            sortedOp,
            categoryOp,
            nameOp,
            limit: LIMIT,
            skip,
        }, function (error, result) {
            dataContainer.empty();
            require(['translator'], function (translator) {
                translator.translate(result, function (translated) {
                    dataContainer.append(translated);
                    renderButton();
                });
            });
        })
    }

    function renderButton() {
        var buttonPins = $('button.btn-pin');
        for (var i = 0; i < buttonPins.length; i++) {
            buttonPins[i].addEventListener('click', function () {
                var thisButton = $(this);
                var pinModal = $('#pinChoose');
                pinModal.remove();
                $.post(config.relative_path + '/pindealbee', {option: "render-pin-choose"})
                    .done(function (result) {
                        // result is html text
                        require(['translator'], function (translator) {
                            translator.translate(result, function (translated) {
                                $('body').append(translated);
                                $('#pinChoose').css('display', 'block');
                                $('#pinChoose').attr('data-tid', thisButton.data('tid'));
                                $('#pinChoose').attr('data-title', thisButton.data('title'));
                                $('#pinChoose').attr('data-category', thisButton.data('category'));

                                $('#pinChoose span.close').click(function (e) {
                                    // console.log('closing');
                                    $('#pinChoose').css('display', 'none');
                                });
                                $('button#submitPin').on('click', submitFunc);
                            })
                        })
                    })
            });
        }
    }

    function renderDataContainer() {
        let dataContainer = $('#data-container');
        let sortedOp = $('#filter-dropbox option:selected').val();
        let categoryOp = $('#filter-categories-dropbox option:selected').val();
        let nameOp = $('#filter-name-input').val();
        socket.emit('modules.getTopics', {
            sortedOp,
            categoryOp,
            nameOp,
            limit: LIMIT,
            skip: 0
        }, function (error, result) {
            dataContainer.empty();
            require(['translator'], function (translator) {
                translator.translate(result, function (translated) {
                    dataContainer.append(translated);
                    let total = parseInt($('#data-container table').data('total'));
                    pagination('#pagination').pagination({
                        dataSource: new Array(total),
                        pageSize: LIMIT,
                        callback: function (data, pagination) {
                            paginate(pagination)
                        }
                    })
                    renderButton();
                });
            });
        })
    }

    var submitFunc = function () {
        var key = 'pindealbee:' +
            $('#pinChoose .modal-body input:checked').data('type') +
            ':' +
            $('#pinChoose .modal-body input:checked').data('position');
        var topicId = $('#pinChoose').data('tid');
        var dataStore = {
            option: "submit-pin",
            key: key,
            tid: topicId,
        };
        // console.log(dataStore);
        $('#pinChoose span.close').trigger('click');
        if ($('#pinChoose .modal-body input:checked').data('type')) {
            $('#pinChoose span.close').trigger('click');
            $.post(config.relative_path + '/pindealbee', dataStore)
                .done(function (res) {
                    app.alert({
                        type: 'success',
                        title: '<i class="fa fa-1x fa-thumb-tack"></i> [[pindealbee:alert-pin-successfully]]',
                        message: '[[pindealbee:alert-pin-successfully-message]]',
                        timeout: 5000
                    });
                    socket.emit('modules.pindealbeePin',
                        {
                            typeId: $('#pinChoose .modal-body input:checked').data('type'),
                            posId: $('#pinChoose .modal-body input:checked').data('position'),
                            title: $('#pinChoose').data('title'),
                            category: "[[pindealbee:pagepreview-category]]: " + $('#pinChoose').data('category')
                        }, function (err, result) {
                        });
                })
                .fail(function (res) {
                    app.alertError('[[pindealbee:alert-pin-failed]]')
                })
        } else {
            alert('[[pindealbee:alert-choose-position]]');
        }
    };
})
