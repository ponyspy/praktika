$(function() {
	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.timeline_block').on('mousemove', function(e) {
			var $this = $(this).children('.timeline_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.timeline_inner').width() * percent);
		});
	}

	$(window)
		.on('load hashchange', function(e) {
			var month = location.hash ? location.hash.replace('#', '') : 0;

			$.post('', { month: month }).done(function(data) {
				$('.events_list').empty().append(data);
			});
		});

	$(document)
		.on('scroll', function(e) {
			var $title = $('.title_block');
			var $timeline = $('.timeline_block');

			$(this).scrollTop() >= $title.height() + $title.offset().top
				? $timeline.addClass('fix')
				: $timeline.removeClass('fix');
		})
		.on('click', '.day_item', function(e) {
			$('.day_item').removeClass('selected').filter(this).addClass('selected');
		})
		.on('click', '.day_item.selected', function(e) {
			$(this).removeClass('selected');
		});

	$('.month_placeholder')
		.on('click', function(e) {
			var $month_item = $(this).parent();
			var month_name = $month_item.attr('data-month');

			$('.day_item.selected').removeClass('selected');
			$('.month_placeholder').removeClass('hide').filter(this).addClass('hide');
			$('.current_month').text(month_name).attr('data-month', month_name);
			$('.month_item').removeClass('selected').filter($month_item).addClass('selected');

			location.hash = $month_item.attr('data-count');
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