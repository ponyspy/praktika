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

	$('.schedule_item').on('click', function(e) {
		var $this = $(this);
		var schedule_alias = $this.attr('schedule-alias');
		var schedule_date = $this.attr('schedule-date');

		var date = schedule_date ? schedule_date.split(' ')[0] : null;
		var time = schedule_date ? schedule_date.split(' ')[1] : null;

		var $frame = $('<iframe>', {
			src: '/widget?alias=' + schedule_alias + '&date=' + date + '&time=' + time,
			id: 'pn_widget',
			frameborder: 0,
			scrolling: 'yes'
			});

		$('.widget_block').children('.widget_inner').empty().append($frame).end().show();
	});

	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.event_schedule').on('mousemove', function(e) {
			var $this = $(this).children('.schedule_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.schedule_inner').width() * percent);
		});
	}

	$(document)
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.widget_inner').length) return;

			$('.widget_block').hide().children('.widget_inner').empty();

			event.stopPropagation();
		})
		.on('scroll', function(e) {
			var $head = $('.event_head');
			var $schedule = $('.event_schedule');

			$(this).scrollTop() >= $head.height() + $head.offset().top - $schedule.height()
				? $schedule.addClass('fix')
				: $schedule.removeClass('fix');
		})
});