$(window)
	.on('load', function(e) {
		var month = location.hash ? location.hash.replace('#', '') : 0;
		var $current_month = $('.month_item').eq(month);
		var offset = $('.timeline_outer').scrollLeft() + $current_month.offset().left;

		$('.timeline_outer').scrollLeft(offset);
		$current_month.children('.month_placeholder').trigger('click');
	});


$(function() {
	var title = $('title').text();

	if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.timeline_block').on('mousemove', function(e) {
			var $this = $(this).children('.timeline_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.timeline_inner').width() * percent);
		});
	} else {
		$('.timeline_outer').addClass('mobile');
	}


	$(document)
		.on('scroll', function(e) {
			var $title = $('.title_block');
			var $timeline = $('.timeline_block');

			$(this).scrollTop() >= $title.height() + $title.offset().top
				? $timeline.addClass('fix')
				: $timeline.removeClass('fix');
		})
		.on('click', '.day_item.enabled', function(e) {
			var date = $(this).children('.day_date').text();
			$('.event_item').addClass('hidden').filter('.date_' + date).removeClass('hidden');

			$('.day_item').removeClass('selected').filter(this).addClass('selected');

			$('html, body').animate({
				'scrollTop': 0
			}, 300);
		})
		.on('click', '.day_item.selected', function(e) {
			$('.event_item').removeClass('hidden');

			$(this).removeClass('selected');
		})
		.on('mouseup touchend', function(e) {
			if ($(e.target).closest('.widget_inner').length) return;

			if ($('.widget_block').hasClass('open')) {
				$('body').removeClass('stop_scroll');
				$('.widget_block').removeClass('open').children('.widget_inner').empty();
			}

			e.stopPropagation();
		})
		.on('click', '.event_ticket.active', function(e) {
			var $this = $(this);
			var schedule_date = $this.attr('schedule-date').split(' ');
			var query = $.param({
				alias: $this.attr('schedule-alias'),
				date: schedule_date[0],
				time: schedule_date[1]
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


	$('.month_placeholder')
		.on('click', function(e) {
			var $this = $(this);
			var $month_items = $('.month_item');
			var $month_item = $this.parent();

			var month_name = $month_item.attr('data-month');
			var month_index = $month_item.index();

			$.post('', { month: month_index }).done(function(data) {
				location.hash = month_index;

				var $events = $(data.events);

				$('.events_list').empty().append($events);

				$('.day_item.selected').removeClass('selected');
				$('.month_placeholder').removeClass('hide').filter($this).addClass('hide');
				$('.current_month').text(month_name).attr('data-month', month_name);
				$('title').text(title + ' : ' + month_name.toLowerCase());

				$month_items.removeClass('selected').filter($month_item).addClass('selected');
				$month_items.find('.day_item').removeClass('enabled');

				if (data.count === 0) return false;

				var dates = $events.map(function() {
					return $(this).attr('class').split(' ')[1];
				}).toArray();

				$month_item.find('.' + dates.join(', .')).addClass('enabled');

				$.post('/ticket_schedule', { min: data.start, max: data.end }).done(function(data) {
					if (data == 'err') return false;

					$('.event_ticket').each(function() {
						var $this = $(this);

						data.indexOf($this.attr('schedule-date')) != -1
							? $this.addClass('active')
							: $this.addClass('soldout').text($this.attr('soldout'));
					})
				});

				$('html, body').animate({
					'scrollTop': 0
				}, 300);
			});
		})
		.on('mouseenter', function(e) {
			$('.current_month').text($(this).parent().attr('data-month'));
		})
		.on('mouseleave', function(e) {
			$('.current_month').text($('.current_month').attr('data-month'));
		});


	$('.current_month').on('click', function(e) {
		var offset = $('.timeline_outer').scrollLeft() + $('.month_item.selected').offset().left;

		$('.timeline_outer').animate({
			'scrollLeft': offset
		}, 300);

		$('.month_item.selected').children('.month_placeholder').trigger('click');
	});


	$('.select_month').on('click', function(e) {

		var $future_month = $(this).hasClass('next')
			? $('.month_item.selected').next()
			: $('.month_item.selected').prev();

		var offset = $('.timeline_outer').scrollLeft() + $future_month.offset().left;

		$future_month.children('.month_placeholder').trigger('click');

		$('.timeline_outer').animate({
			'scrollLeft': offset
		}, 300);

	});

});