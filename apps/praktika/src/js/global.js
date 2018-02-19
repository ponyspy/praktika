$(function() {
	$(document)
		.on('touchmove', 'body.menu_open', false)
		.on('keyup', function(e) {
			var num_codes = [49, 50, 51, 52]; // [49, 50, 51, 52, 53, 54, 55, 56, 57]
			var num_langs = [82, 69];

			if (/^[0-9]+$/.test(num_codes.indexOf(e.which))) {
				window.location.href = $('.menu_block').find('a').eq(num_codes.indexOf(e.which)).attr('href');
			}

			if (e.which == 82 || e.which == 69) {
				window.location.href = $('.language').find('a').eq(num_langs.indexOf(e.which)).attr('href');
			}
		});

	$('.menu_drop').on('click', function(e){
		$(this).toggleClass('open');
		$('body, .main_block').toggleClass('menu_open');
	});

	$('.logo').on('click', function(e) {
		$('body').animate({
			'scrollTop': 0
		}, 400);
	});

});