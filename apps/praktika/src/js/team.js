$(function() {
	var lorem_text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	$members = $('.member_item');

	$members.on('click', function(e) {
		var $current_block = $(this);
		var $set = $current_block.nextAll('.member_item').addBack(this);

		$set.each(function() {
			var $this = $(this);
			var $members_list = $('.members_list');

			if ($this.offset().left + $this.width() > $members_list.width() + $members_list.offset().left) {
				// var $panel = $('<div/>', {'class': 'panel'});
				// var $in = $('<div/>', {'class': 'in', 'text': $current_block.text() + ' - ' + lorem_text });

				// $('.panel').remove();
				// $members.removeClass('active');

				// $current_block.addClass('active');
				// $this.after($panel.append($in));

				$members.removeClass('active');
				$current_block.addClass('active');
				$('.panel').show().insertAfter($this);

				return false;
			} else if ($this.index('.member_item') + 1 == $members.length) {
				// var $panel = $('<div/>', {'class': 'panel'});
				// var $in = $('<div/>', {'class': 'in', 'text': $current_block.text() + ' - ' + lorem_text })

				// $('.panel').remove();
				// $members.removeClass('active');

				// $current_block.addClass('active');
				// $set.last().after($panel.append($in));

				$members.removeClass('active');
				$current_block.addClass('active');
				$set.last().after($('.panel').show());

				return false;
			}
		});

		$('body').animate({
			'scrollTop': $current_block.offset().top - $('.members_header').height() - 10
		}, 300);

	});

	$(document)
		.on('mouseenter', '.member_item', function(e) {
			$('.members_title').text($(this).attr('data-name'));
		})
		.on('mouseleave', '.member_item', function(e) {
			$('.members_title').text($('.members_title').attr('data-title'));
		})
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.in').length) return;

			// $('.panel').remove();

			$('.panel').hide();
			$members.removeClass('active');

			event.stopPropagation();
		})
		.on('scroll', function(e) {
			var $title = $('.title_block');
			var $members_header = $('.members_header');

			$(this).scrollTop() >= $title.height() + $title.offset().top
				? $members_header.addClass('fix')
				: $members_header.removeClass('fix');
		});
});