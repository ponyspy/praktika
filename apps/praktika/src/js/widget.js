$(function() {
	pnwidget.init({ containerId: 'pn_widget' });

	var $pn_widget = $('#pn_widget');

	pnwidget.show({
		exclude_dates: false,
		scrollToWidget: false,
		closeButton: false,
		hideHeader: true,
		referral_auth: $pn_widget.attr('data-ref'),
		event: {
			alias: $pn_widget.attr('data-alias'),
			date: $pn_widget.attr('data-date'),
			time: $pn_widget.attr('data-time')
		}
	});
});