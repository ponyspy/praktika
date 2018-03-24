$(function() {

	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.timeline_block').on('mousemove', function(e) {
			var $this = $(this).children('.timeline_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.timeline_inner').width() * percent);
		});
	}


	$(window)
		.on('load', function(e) {
			var month = location.hash ? location.hash.replace('#', '') : 0;
			var $current_month = $('.month_item').eq(month);
			var offset = $('.timeline_outer').scrollLeft() + $current_month.offset().left;

			$('.timeline_outer').scrollLeft(offset);
			$current_month.children('.month_placeholder').trigger('click');
		});


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
				var $events = $(data);
				var dates = $events.map(function() {
					return $(this).attr('class').split(' ')[1];
				}).toArray();

				$('.events_list').empty().append($events);

				$('.day_item.selected').removeClass('selected');
				$('.month_placeholder').removeClass('hide').filter($this).addClass('hide');
				$('.current_month').text(month_name).attr('data-month', month_name);

				$month_items.removeClass('selected').filter($month_item).addClass('selected');
				$month_items.find('.day_item').removeClass('enabled');
				$month_item.find('.' + dates.join(', .')).addClass('enabled');

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
		$(this).hasClass('next')
			? $('.month_item.selected').next().children('.month_placeholder').trigger('click')
			: $('.month_item.selected').prev().children('.month_placeholder').trigger('click');

		var offset = $('.timeline_outer').scrollLeft() + $('.month_item.selected').offset().left;

		$('.timeline_outer').animate({
			'scrollLeft': offset
		}, 300);

	});

});