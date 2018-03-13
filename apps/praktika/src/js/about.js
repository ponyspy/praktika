$(function() {
	var swiper = new Swiper('.swiper-container', {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
		}
	});

	swiper.on('slideChange', function(e) {
		var style = $('.slide_item').eq(swiper.activeIndex).attr('data-style');

		$('.maket_block').removeClass('white black').addClass(style);
	});

	$('.navigate_item').on('click', function(e) {
		var id = $(this).attr('slide-id');
		var index = $('.slide_item').filter('#' + id).index();
		swiper.slideTo(index);
	});
});