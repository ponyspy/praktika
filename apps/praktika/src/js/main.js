$(function() {
	var randomInteger = function(min, max) {
		return Math.round(min - 0.5 + Math.random() * (max - min + 1));
	};

	var swiper = new Swiper('.swiper-container', {
		loop: true,
		init: false,
		effect: 'fade',
		initialSlide: randomInteger(0, $('.slide_item').length),
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

		var announce = $(this).attr('data-id');

		Cookies.set(announce, 'announce', {
			expires: 2
		});
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