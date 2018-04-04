$(function() {
	pnwidget.init({ containerId: 'pn_widget' });

	var $pn_widget = $('#pn_widget');

	pnwidget.show({
		exclude_dates: false,
		scrollToWidget: false,
		closeButton: true,
		hideHeader: true,
		referral_auth: 'praktikatheatre',
		event: {
			alias: $pn_widget.attr('data-alias'),
			date: $pn_widget.attr('data-date'),
			time: $pn_widget.attr('data-time')
		}
	});
});