$(function() {
	var randomInteger = function(min, max) {
		return Math.round(min - 0.5 + Math.random() * (max - min + 1));
	};

	var swiper = new Swiper('.swiper-container', {
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

	$('.banner_close').on('click', function() {
		$('.maket_block').removeClass('banner');
		$('.banner_block').addClass('close');
		$.cookie('banner', 1, {
			expires: 2
		});
	});
});