$(function() {
	var $document = $(document);
	var $window = $(window);
	var $members = $('.member_item');
	var $title = $('.title_block');
	var $members_header = $('.members_header');

	var title = $('title').text();


	$document
		.on('click', '.result_item', function(e) {
			$('.search_close').trigger('click');
		})
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.members_roles').length) return;

			$('.roles_list').removeClass('open');

			event.stopPropagation();
		})
		.on('click', '.roles_title', function(e) {
			$('.roles_list').toggleClass('open');
		})
		.on('click', '.select_role', function(e) {
			var $this = $(this);
			var select_role = $this.attr('data-role');
			var select_role_name = $this.text();

			$('.roles_list').removeClass('open');
			$('.roles_title').attr('active-role', select_role).text(select_role_name);
			$this.parent().children('.select_role').removeClass('selected').filter(this).addClass('selected');

			select_role == 'all'
				? $members.removeClass('hide')
				: $members.addClass('hide').filter('.' + select_role).removeClass('hide');

			$document.trigger('scroll.load');
		});


	$members.on('click', function(e) {
		var $this = $(this);

		if ($this.hasClass('active')) {
			location.hash = '!';
			$('.panel').remove();
			$this.removeClass('active');
			$document.trigger('scroll.load');
			$('title').text(title);

			return false;
		}

		location.hash = $this.attr('member-id');
	});


	$window.on('load hashchange', function(e) {
		var $current_block = $members.filter('[member-id="' + location.hash.replace('#', '') + '"]').eq(0);
		var $set = $current_block.nextAll('.member_item').addBack($current_block);
		var $members_list = $('.members_list');

		$set.each(function() {
			var $this = $(this);

			if ($this.offset().left + $this.width() > $members_list.width() + $members_list.offset().left) {
				$.post('', { id: $current_block.attr('member-id') }).done(function(content) {
					$('.panel').remove();

					$members.removeClass('active');
					$current_block.addClass('active');

					$this.after(content);
				});

				return false;
			} else if ($this.index('.member_item') + 1 == $members.length) {
				$.post('', { id: $current_block.attr('member-id') }).done(function(content) {
					$('.panel').remove();

					$members.removeClass('active');
					$current_block.addClass('active');

					$set.last().after(content);
				});

				return false;
			}
		});

		$('title').text(title + ' : ' + $current_block.attr('data-name').toLowerCase());

		$('html, body').animate({
			'scrollTop': $current_block.offset().top - ($window.width() >= 840 ? $('.members_header').height() : 0) - 10
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
			if ($(event.target).closest('.in, .search_block').length) return;

			location.hash = '!';
			$('.panel').remove();
			$members.removeClass('active');
			$('title').text(title);
			$document.trigger('scroll.load');

			event.stopPropagation();
		})
		.on('scroll.load', function(e) {
			var viewport = $document.scrollTop() + $window.height();

			$members.not('.show').each(function() {
				var $this = $(this);

				$this.offset().top + $this.height() <= viewport - 50
					? $this.children('.in').css('background-image', 'url(' + $this.attr('data-src') + ')').end().addClass('show')
					: false;

			});

			if (viewport >= $document.height()) {
				$document.off('scroll.load');
				return false;
			}

		}).trigger('scroll.load')
		.on('scroll', function(e) {
			$(this).scrollTop() >= $title.height() + $title.offset().top
				? $members_header.addClass('fix')
				: $members_header.removeClass('fix');
		});
});