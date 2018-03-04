$(function() {
	var randomInteger = function(min, max) {
		return Math.round(min - 0.5 + Math.random() * (max - min + 1));
	};

	var swiper = new Swiper('.swiper-container', {
		initialSlide: randomInteger(0, $('.slide_item').length),
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
		}
	});
});