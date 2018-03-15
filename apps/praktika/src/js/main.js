$(function() {
	var randomInteger = function(min, max) {
		return Math.round(min - 0.5 + Math.random() * (max - min + 1));
	};

	var swiper = new Swiper('.swiper-container', {
		init: false,
		effect: 'fade',
		initialSlide: randomInteger(0, $('.slide_item').length),
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
		},
		runCallbacksOnInit: true
	});

	swiper.on('init slideChange', function(e) {
		var style = $('.slide_item').eq(swiper.activeIndex).attr('data-style');

		$('.maket_block').removeClass('white black').addClass(style);
	});

	swiper.init();
});