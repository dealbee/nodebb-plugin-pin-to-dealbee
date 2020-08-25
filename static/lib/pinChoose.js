'use strict';
$(document).ready(function () {
	$(window).bind("pageshow", function (event) {
		if (event.originalEvent.persisted) {
			window.location.reload();
		}
	});
});
$(window).on('action:ajaxify.end', function (event, data) {
	if (data.tp_url == 'topic');
	{
		var canPin = false;
		var cid = $('ul[component=topic].posts').data("cid");
		var tid = $('ul[component=topic].posts').data("tid");
		$.post(config.relative_path + '/pindealbee', {
			option: "can-pin"
		}).done(function (res) {
			$('#buttonPin').on('click', function (e) {
				var pinModal = $('#pinChoose');
				if (!pinModal[0]) { // check if modal render or not
					// Emit socket to render modal
					$.post(config.relative_path + '/pindealbee', { option: "render-pin-choose" })
						.done(function (result) {
							// result is html text
							require(['translator'], function (translator) {
								translator.translate(result, function (translated) {
									$('body').append(translated);
									$('#pinChoose').css('display', 'block');
									$('#pinChoose span.close').click(function (e) {
										// console.log('closing');
										$('#pinChoose').css('display', 'none');
									});
									$('button#submitPin').on('click', function (e) {
										e.preventDefault();
										var key = 'pindealbee:' +
											$('#pinChoose .modal-body input:checked').data('type') +
											':' +
											$('#pinChoose .modal-body input:checked').data('position');
										var topicId = $('.posts').data('tid');
										var title = $('.topic-title').text();
										var category = $('li[itemscope="itemscope"] [itemprop="name"]')[1].innerText;
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
															title: title,
															category: '[[pindealbee:pagepreview-category]]: ' + category
														}, function (err, result) {
														});
												})
												.fail(function (res) {
													app.alertError('[[pindealbee:alert-pin-failed]]')
												})
											// console.log(dataStore);
										} else { alert('[[pindealbee:alert-choose-position]]'); }
									});
								})
							})

						})
				} else {
					pinModal.css('display', 'block');
				}
			});
		})
	}

});
