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

	$(window).on('load hashchange', function(e) {
		if (!location.hash || location.hash == '#!') return false;

		$('.title_block, .menu_open').removeClass('open');

		$('body').removeClass('stop_scroll').animate({
			'scrollTop': $('[anchor="' + location.hash.replace('#', '') + '"]').offset().top
		}, 400, function() {
			location.hash = '#!';
		});
	});

	$(document).on('keyup', function(e) {
		if (e.which == 13 && $('.subs_block').hasClass('show')) {
			$('.subs_submit').trigger('click');
		}
	});

	$('.subs_input.date').on('input keydown keyup mousedown mouseup select contextmenu drop', function(e) {
		this.value = this.value.replace(/\D/g, '');
	});

	$(document).on('click', '.subs_submit.active', function(e) {
		$('.subs_submit').removeClass('active').text($('.subs_submit').attr('send_await'));

		var params = {
			email: $('.subs_input.email').val(),
			name: $('.subs_input.name').val(),
			date: $('.subs_input.date.dd').val(),
			month: $('.subs_input.date.mm').val(),
			year: $('.subs_input.date.yy').val()
		};

		$.post('/mailer', params).done(function(data) {
			$('.subs_submit').addClass('active').text($('.subs_submit').attr('send_input'));

			if (data == 'ok') {
				$('.subs_status').text($('.subs_status').attr('val_ok'));
				$('.subs_input').val('');
			} else if (data == 'email') {
				$('.subs_status').text($('.subs_status').attr('val_email'));
			} else {
				$('.subs_status').text($('.subs_status').attr('val_else'));
			}

			setTimeout(function() {
				$('.subs_status').text('');
			}, 2200);
		});
	});

	$('.banner_subs').on('click', function(e) {
		$('.subs_block').toggleClass('show');
		$('body').addClass('stop_scroll');
		$('.subs_input').val('');
		$('.subs_input.email').focus();
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