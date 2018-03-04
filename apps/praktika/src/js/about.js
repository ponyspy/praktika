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

	$('.navigate_item').on('click', function(e) {
		var index = $(this).index();
		swiper.slideTo(index);
	});
});