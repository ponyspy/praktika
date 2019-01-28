$(function() {
	if (+Cookies.get('banner') >= 3) {
		$('.maket_block').removeClass('banner');
		$('.banner_block').remove();
	}

	var swiper = new Swiper('.swiper-container', {
		loop: true,
		init: false,
		effect: 'fade',
		initialSlide: (function(min, max) {
			return Math.round(min - 0.5 + Math.random() * (max - min + 1));
		})(0, $('.slide_item').length),
		keyboard: {
			enabled: true
		},
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
		},
		runCallbacksOnInit: true
	});

	swiper.on('init slideChange', function(e) {
		var $current_slide = $('.slide_item').eq(swiper.activeIndex);
		var style = $current_slide.attr('data-style');

		$('video').trigger('pause');
		$current_slide.children('video').trigger('play');

		$('.maket_block').removeClass('white black').addClass(style);
	});

	swiper.init();

	$('.slide_item').on('click', function(e) {
		swiper.slideNext();
	});

	$('.announcement_block').on('click', function(e) {
		e.stopPropagation();
	});


	$('.journal_open').on('click', function(e) {
		if (location.hash !== '') {
			$(window).trigger('hashchange');
		}
	});

	$('.c_item').on('click', function(e) {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			return false;
		}
		$('.c_item').removeClass('active').filter(this).addClass('active');
	});

	$(window).on('load hashchange', function(e) {
		$('body').animate({
			'scrollTop': $('[anchor="' + location.hash.replace('#', '') + '"]').offset().top - 60
		}, 400);
	});

	$(document).on('keyup', function(e) {
		if (e.which == 27) {
			$('.banner_close').trigger('click');
		}
	});

	$('.banner_close').on('click', function(e) {
		$('.maket_block').removeClass('banner');
		$('.banner_block').addClass('close');

		var banner = Cookies.get('banner')
			? +Cookies.get('banner') + 1
			: 1;

		Cookies.set('banner', banner, {
			expires: 5
		});
	});
});