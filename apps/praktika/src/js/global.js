$(function() {
	$('.menu_open').on('click', function(e) {
		$('.menu_items, .title_block, .menu_open').toggleClass('open');
	});

	$(document)
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.title_block').length) return;

			$('.menu_items, .title_block, .menu_open').removeClass('open');

			event.stopPropagation();
		});
});