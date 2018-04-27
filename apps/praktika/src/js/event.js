$(function() {
	var swiper = new Swiper('.swiper-container', {
		loop: true,
		effect: 'fade',
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

	$.post('/ticket_event', { alias: $('.schedule_item').eq(0).attr('schedule-alias') }).done(function(data) {
		if (data == 'err') return false;

		var $schedule_items = $('.schedule_item').not('.all');
		var $schedule_all = $('.schedule_item').filter('.all');

		$schedule_items.each(function() {
			var $this = $(this);

			data.indexOf($this.attr('schedule-date')) != -1
				? $this.addClass('active')
				: $this.addClass('soldout').children('.item_time').text($this.attr('soldout'));

		});

		$schedule_items.filter('.soldout').length == $schedule_items.length
			? $schedule_all.addClass('soldout').children('.item_ticket').text($schedule_all.attr('soldout'))
			: $schedule_all.addClass('active');

	});

	$(document).on('click', '.schedule_item.active', function(e) {
		var $this = $(this);
		var schedule_alias = $this.attr('schedule-alias');
		var schedule_date = $this.attr('schedule-date');
		var query = $.param({
			alias: schedule_alias,
			date: schedule_date ? schedule_date.split(' ')[0] : 'null',
			time: schedule_date ? schedule_date.split(' ')[1] : 'null'
		});

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			window.open('/widget?' + query, '_blank');
			return false;
		}

		$('body').addClass('stop_scroll');

		var $frame = $('<iframe>', {
			src: '/widget?' + query,
			id: 'pn_widget',
			frameborder: 0,
			scrolling: 'yes'
		}).one('load', function(e) {
			$('#pn_widget').addClass('show');
		});

		$('.widget_block').children('.widget_inner').empty().append($frame).end().addClass('open');
	});

	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.event_schedule').on('mousemove', function(e) {
			var $this = $(this).children('.schedule_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.schedule_inner').width() * percent);
		});
	} else {
		$('.schedule_outer').addClass('mobile');
	}

	$(document)
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.widget_inner').length) return;

			if ($('.widget_block').hasClass('open')) {
				$('body').removeClass('stop_scroll');
				$('.widget_block').removeClass('open').children('.widget_inner').empty();
			}

			event.stopPropagation();
		})
		.on('scroll', function(e) {
			var $head = $('.event_head');
			var $schedule = $('.event_schedule');

			$(this).scrollTop() >= $head.height() + $head.offset().top - $schedule.height()
				? $schedule.addClass('fix')
				: $schedule.removeClass('fix');
		});
});