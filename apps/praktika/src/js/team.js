$(function() {
	var $document = $(document);
	var $window = $(window);

	var $members = $('.member_item').on('click', function(e) {
		var $current_block = $(this);

		if ($current_block.hasClass('active')) {
			$('.panel').remove();
			$current_block.removeClass('active');
			return false;
		}

		var $set = $current_block.nextAll('.member_item').addBack(this).each(function() {
			var $this = $(this);
			var $members_list = $('.members_list');

			if ($this.offset().left + $this.width() > $members_list.width() + $members_list.offset().left) {
				$.post('', { id: $current_block.attr('id') }).done(function(content) {
					$('.panel').remove();

					$members.removeClass('active');
					$current_block.addClass('active');

					$this.after(content);
				});

				return false;
			} else if ($this.index('.member_item') + 1 == $members.length) {
				$.post('', { id: $current_block.attr('id') }).done(function(content) {
					$('.panel').remove();

					$members.removeClass('active');
					$current_block.addClass('active');

					$set.last().after(content);
				});

				return false;
			}
		});

		$('html, body').animate({
			'scrollTop': $current_block.offset().top - $('.members_header').height() - 10
		}, 300);

	});

	$document
		.on('mouseenter', '.member_item', function(e) {
			$('.members_title').text($(this).attr('data-name'));
		})
		.on('mouseleave', '.member_item', function(e) {
			$('.members_title').text($('.members_title').attr('data-title'));
		})
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.in').length) return;
			$('.panel').remove();

			$members.removeClass('active');

			event.stopPropagation();
		})
		.on('scroll.load', function(e) {
			var viewport = $document.scrollTop() + $window.height();

			$members.not('.show').each(function() {
				var $this = $(this);

				if ($this.offset().top + $this.height() <= viewport - 50) {
					$this.children('.in').css('background-image', 'url(' + $this.attr('data-src') + ')').end().addClass('show');
				}
			});

			if (viewport >= $document.height()) {
				$document.off('scroll.load');
				return false;
			}

		}).trigger('scroll.load')
		.on('scroll', function(e) {
			var $title = $('.title_block');
			var $members_header = $('.members_header');

			$(this).scrollTop() >= $title.height() + $title.offset().top
				? $members_header.addClass('fix')
				: $members_header.removeClass('fix');
		});
});