$(function() {
	pnwidget.init({ containerId: 'pn_widget' });

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

	$('.schedule_ticket').on('click', function(e) {
		$('#pn_widget').hide();
	});

	$('.schedule_item').on('click', function(e) {
		var $this = $(this);

		$('#pn_widget').show();

		pnwidget.show({
			exclude_dates: false,
			scrollToWidget: false,
			closeButton: true,
			hideHeader: true,
			referral_auth: 'praktikatheatre',
			event: {
				alias: $this.attr('schedule-alias'),
				date: $this.attr('schedule-date').split(' ')[0],
				time: $this.attr('schedule-date').split(' ')[1]
			}
		});

		$('html, body').animate({
			'scrollTop': $this.offset().top
		}, 300);
	});

	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.event_schedule').on('mousemove', function(e) {
			var $this = $(this).children('.schedule_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.schedule_inner').width() * percent);
		});
	}

	$(document)
		.on('scroll', function(e) {
			var $head = $('.event_head');
			var $schedule = $('.event_schedule');

			$(this).scrollTop() >= $head.height() + $head.offset().top - $schedule.height()
				? $schedule.addClass('fix')
				: $schedule.removeClass('fix');
		})
});