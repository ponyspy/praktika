var $window = $(window);
var $document = $(document);
var context = { skip: 5, limit: 10 };

var scrollLoader = function(e) {
	if ($window.scrollTop() + $window.height() + 240 >= $document.height()) {
		$window.off('scroll');

		$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
			if (data !== 'end') {

				$('.jounral_posts').append(data);

				context.skip += 5;
				$window.on('scroll', scrollLoader);
			} else {
				$('.journal_more').addClass('hide');
			}
		});
	}
};

$window.on('load hashchange', function(e) {
	if (!location.hash || location.hash == '#!') return false;

	$('.title_block, .menu_open').removeClass('open');

	$('body').removeClass('stop_scroll').animate({
		'scrollTop': $('[anchor="' + location.hash.replace('#', '') + '"]').offset().top
	}, 400, function() {
		location.hash = '#!';
	});
});

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

	$('.journal_more').children('span').on('click', function(e) {
		$window.on('scroll', scrollLoader).trigger('scroll');
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