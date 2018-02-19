$(function() {
	$('.block_cut').on('click', function(e) {
		$(this).parent().find('.hidden').removeClass('hidden').end().end().remove();
	});

	$('.block_title a').on('click', function(e) {
		e.preventDefault();

		var hash = $(this).attr('href');

		$('html, body').animate({
			'scrollTop': $(hash).offset().top
		}, 400, function() {
			window.location.hash = hash;
		});
	});

});