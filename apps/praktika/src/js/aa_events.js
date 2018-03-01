$(function() {
	$('form').on('submit', function(e) {
		e.preventDefault();


		$('.group_item').toArray().forEach(function(group, i) {
			$('<input />').attr('type', 'hidden')
										.attr('name', 'members' + '[' + i + ']' + '[mode]')
										.attr('value', $(group).find('.group_mode').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'members' + '[' + i + ']' + '[title][ru]')
										.attr('value', $(group).find('.ru').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'members' + '[' + i + ']' + '[title][en]')
										.attr('value', $(group).find('.en').val())
										.appendTo('form');

			$(group).find('.list_item').toArray().forEach(function(item, j) {
				$('<input />').attr('type', 'hidden')
											.attr('name', 'members' + '[' + i + ']' + '[list][' + j + ']')
											.attr('value', $(item).children('select').val())
											.appendTo('form');
			});
		});


		this.submit();
	});

	$(document)
		.on('click', '.up_group', function(e) {
			var $group = $(this).closest('.group_item');
			$group.insertBefore($group.prev());
		})
		.on('click', '.down_group', function(e) {
			var $group = $(this).closest('.group_item');
			if ($group.next().hasClass('add_group')) return false;
			$group.insertAfter($group.next());
		})
		.on('click', '.rm_group', function(e) {
			if ($('.group_item').size() == 1) return false;
			$(this).closest('.group_item').remove();
		})
		.on('click', '.add_group', function(e) {
			var $group = $(this).closest('.group_members').children('.group_item');
			$group.first().clone()
				.find('.list_item').first().nextAll('.list_item').remove().end().end().end()
				.find('option').prop('selected', false).end()
				.find('input[type=text]').val('').end()
				.insertAfter($group.last());
		})
		.on('click', '.add_member', function(e) {
			var $members = $(this).closest('.group_list').children('.list_item');
			$members.first().clone()
				.find('option').prop('selected', false).end()
				.find('.input').val('').end()
				.insertAfter($members.last());
		})
		.on('click', '.rm_member', function(e) {
			var $list = $(this).closest('.group_list').children('.list_item');

			if ($list.size() == 1) return false;
			$(this).parent('.list_item').remove();
		});
});