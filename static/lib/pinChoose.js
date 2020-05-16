'use strict';
$(document).ready(function () {
	$(window).bind("pageshow", function (event) {
		if (event.originalEvent.persisted) {
			window.location.reload();
		}
	});
});
$(window).on('action:ajaxify.end', function (event, data) {
	console.log(data);
	if (data.tp_url == 'topic');
	{
		var canPin = false;
		var cid = $('ul[component=topic].posts').data("cid");
		var tid = $('ul[component=topic].posts').data("tid");
		$.post('/pindealbee', {
			option: "can-pin"
		}).done(function (res) {
			var headerContainer = $('.topic-main-buttons');
			var buttonPin = $('<button id="buttonPin" class="btn btn-success">Pin on Dealbee</button>');
			headerContainer.append(buttonPin);
			$('button#buttonPin').on('click', function (e) {
				var pinModal = $('#pinChoose');
				if (!pinModal[0]) { // check if modal render or not
					// Emit socket to render modal
					$.post('/pindealbee', { option: "render-pin-choose" })
						.done(function (result) {
							// result is html text
							$('body').append(result);
							$('#pinChoose').css('display', 'block');
							$('#pinChoose span.close').click(function (e) {
								console.log('closing');
								$('#pinChoose').css('display', 'none');
							});
							$('button#submitPin').on('click', function (e) {
								e.preventDefault();
								var key = 'pindealbee:' +
									$('#pinChoose .modal-content-body input:checked').data('type') +
									':' +
									$('#pinChoose .modal-content-body input:checked').data('position');
								var topicId = $('.posts').data('tid');
								var title=$('.topic-title').text();
								var category=$('li[itemscope="itemscope"] [itemprop="name"]')[1].innerText;
								var dataStore = {
									option: "submit-pin",
									key: key,
									tid: topicId,
								};
								// console.log(dataStore);
								$('#pinChoose span.close').trigger('click');
								if ($('#pinChoose .modal-content-body input:checked').data('type')) {
									$('#pinChoose span.close').trigger('click');
									$.post('/pindealbee', dataStore)
										.done(function (res) {
											app.alert({
												type: 'success',
												title: '<i class="fa fa-1x fa-thumb-tack"></i> Pin successfully',
												message: 'This post has been pinned on Dealbee',
												timeout: 5000
											});
											socket.emit('modules.pindealbeePin',
												{
													typeId: $('#pinChoose .modal-content-body input:checked').data('type'),
													posId: $('#pinChoose .modal-content-body input:checked').data('position'),
													title: title,
													category: 'Category: '+category
												}, function (err, result) {
												});
										})
										.fail(function (res) {
											app.alertError('Pin fail')
										})
									// console.log(dataStore);
								} else { alert('Please choose position'); }
							});
						})
				} else {
					pinModal.css('display', 'block');
				}
			});
		})
	}

});
