$(window).on('load hashchange', function(e) {
	var $members = $('.member_item');

	$.post('', { id: location.hash.replace('#', '') }).done(function(content) {
		if (content == 'err') return false;

		$content = $(content).find('.panel_description:empty').hide().end();

		$('.panel').remove();

		var $current_block = $members.filter('[member-id="' + location.hash.replace('#', '') + '"]').eq(0);
		var $set = $current_block.nextAll('.member_item').addBack($current_block);
		var $members_list = $('.members_list');

		$set.each(function() {
			var $this = $(this);

			if ($this.offset().left + $this.width() > $members_list.width() + $members_list.offset().left) {

				$members.removeClass('active');
				$current_block.addClass('active');

				$this.after($content);

				return false;
			} else if ($this.index('.member_item') + 1 == $members.length) {

				$members.removeClass('active');
				$current_block.addClass('active');

				$set.last().after($content);

				return false;
			}
		});

		$('title').text($('title').text().split(' : ').slice(0, 2).concat($current_block.attr('data-name').toLowerCase()).join(' : '));

		$('html, body').animate({
			'scrollTop': $current_block.offset().top - ($(window).width() >= 840 ? $('.members_header').height() : 0) - 58
		}, 300);

	});
});


$(function() {
	var $members = $('.member_item');
	var $title = $('.title_block');
	var $members_header = $('.members_header');


	$('.in').Lazy({
		scrollDirection: 'vertical',
		threshold: 300,
		visibleOnly: true
	});

	$(document)
		.on('click', '.result_item', function(e) {
			$('.search_close').trigger('click');
		})
		.on('mouseup touchend', function(e) {
			if ($(e.target).closest('.members_roles').length) return;

			$('.members_roles').removeClass('open');
			$(window).trigger('scroll');

			e.stopPropagation();
		})
		.on('click', '.roles_title', function(e) {
			$('.members_roles').toggleClass('open');
		})
		.on('click', '.select_role', function(e) {
			var $this = $(this);
			var select_role = $this.attr('data-role');
			var select_role_name = $this.text();

			$('.members_roles').removeClass('open');
			$('.roles_title').attr('active-role', select_role).text(select_role_name);
			$this.parent().children('.select_role').removeClass('selected').filter(this).addClass('selected');

			select_role == 'all'
				? $members.removeClass('hide')
				: $members.addClass('hide').filter('.' + select_role).removeClass('hide');

			$(window).trigger('scroll');
		});


	$members.on('click', function(e) {
		var $this = $(this);

		if ($this.hasClass('active')) {
			location.hash = '!';
			$('.panel').remove();
			$this.removeClass('active');
			$('title').text($('title').text().split(' : ').slice(0, 2).join(' : '));

			return false;
		}

		location.hash = $this.attr('member-id');
	});


	$(document)
		.on('mouseenter', '.member_item', function(e) {
			$('.members_title').text($(this).attr('data-name'));
		})
		.on('mouseleave', '.member_item', function(e) {
			$('.members_title').text($('.members_title').attr('data-title'));
		})
		.on('mouseup touchend', function(e) {
			if ($(e.target).closest('.in, .search_block').length) return;

			location.hash = '!';
			$('.panel').remove();
			$members.removeClass('active');
			$('title').text($('title').text().split(' : ').slice(0, 2).join(' : '));

			e.stopPropagation();
		})
		.on('scroll', function(e) {
			$(this).scrollTop() >= $title.height() + $title.offset().top
				? $members_header.addClass('fix')
				: $members_header.removeClass('fix');
		});
});