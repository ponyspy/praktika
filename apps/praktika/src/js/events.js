$(function() {
	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.timeline_block').on('mousemove', function(e) {
			var $this = $(this).children('.timeline_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.timeline_inner').width() * percent);
		});
	}

	$(document).on('scroll', function(e) {
		var $title = $('.title_block');
		var $timeline = $('.timeline_block');

		$(this).scrollTop() >= $title.height() + $title.offset().top
			? $timeline.addClass('fix')
			: $timeline.removeClass('fix');
	});

	$(document).on('click', '.day_item', function(e) {
		$('.day_item').removeClass('selected').filter(this).addClass('selected');
	});

	$(document).on('click', '.day_item.selected', function(e) {
		$(this).removeClass('selected');
	});

	$('.month_placeholder')
		.on('click', function(e, $month_fire) {
			var $month_item = $(this).parent();
			var month_name = $month_item.attr('data-month');

			$('.day_item.selected').removeClass('selected');
			$('.month_placeholder').removeClass('hide').filter(this).addClass('hide');
			$('.current_month').text(month_name).attr('data-month', month_name);
			$('.month_item').removeClass('selected').filter($month_item).addClass('selected');
		})
		.on('mouseenter', function(e) {
			$('.current_month').text($(this).parent().attr('data-month'));
		})
		.on('mouseleave', function(e) {
			$('.current_month').text($('.current_month').attr('data-month'));
		});

	$('.select_month').on('click', function(e) {
		if ($(this).hasClass('next')) {
			$('.month_item.selected').next().children('.month_placeholder').trigger('click');
		} else {
			$('.month_item.selected').prev().children('.month_placeholder').trigger('click');
		}
	});
});