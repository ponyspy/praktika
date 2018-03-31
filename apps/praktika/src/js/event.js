$(function() {
	var swiper = new Swiper('.swiper-container', {
		loop: true,
		effect: 'fade',
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		keyboard: {
			enabled: true
		},
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
		}
	});

	swiper.on('slideChange', function(e) {
		var $current_slide = $('.slide_item').eq(swiper.activeIndex);
		var style = $current_slide.attr('data-style');

		$('.maket_block').removeClass('white black').addClass(style);
	});

	$('.slide_item').on('click', function(e) {
		swiper.slideNext();
	});

	$(document)
		.on('scroll', function(e) {
			var $head = $('.event_head');
			var $schedule = $('.event_schedule');

			$(this).scrollTop() >= $head.height() + $head.offset().top - $schedule.height() - 30
				? $schedule.addClass('fix')
				: $schedule.removeClass('fix');
		})
});