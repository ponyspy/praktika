var date_config = {
	format: 'Y-m-d',
	hide_on_select: true,
	mode: 'single',
	locale: {
		days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
		daysShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
		daysMin: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
		months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		monthsShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.']
	}
};

$(function() {
	$('form').on('submit', function(e) {
		e.preventDefault();


		$('.block_item.group').not('.hidden').toArray().forEach(function(group, i) {
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


		$('.block_item.comment').not('.hidden').toArray().forEach(function(comment, i) {
			$('<input />').attr('type', 'hidden')
										.attr('name', 'comments' + '[' + i + ']' + '[title][ru]')
										.attr('value', $(comment).find('.comment_title input.ru').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'comments' + '[' + i + ']' + '[title][en]')
										.attr('value', $(comment).find('.comment_title input.en').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'comments' + '[' + i + ']' + '[description][ru]')
										.attr('value', $(comment).find('.comment_description textarea.ru').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'comments' + '[' + i + ']' + '[description][en]')
										.attr('value', $(comment).find('.comment_description textarea.en').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'comments' + '[' + i + ']' + '[member]')
										.attr('value', $(comment).find('.comment_member select').val())
										.appendTo('form');

		});


		this.submit();
	});

	$(document)
		.on('click', '.up_block', function(e) {
			var $block = $(this).closest('.block_item');
			$block.insertBefore($block.prev());
		})
		.on('click', '.down_block', function(e) {
			var $block = $(this).closest('.block_item');
			if ($block.next().hasClass('add_group') || $block.next().hasClass('add_comment')) return false;
			$block.insertAfter($block.next());
		})
		.on('click', '.rm_block', function(e) {
			if ($(this).closest('.block_items').children('.block_item').size() == 1) {
				$(this).closest('.block_item').addClass('hidden').hide();
			} else {
				$(this).closest('.block_item').remove();
			}
		})
		.on('click', '.add_date', function(e) {
			var $block = $(this).closest('.block_items').children('.block_item');

			if ($block.size() == 1 && $block.hasClass('hidden')) {
				$block.removeClass('hidden').show();
			} else {
				$block.first().clone()
					.find('option').prop('selected', false).end()
					.find('input[type=checkbox]').prop('checked', false).end()
					.find('input[type=text]').val('').pickmeup(date_config).end()
					.insertAfter($block.last());
			}
		})
		.on('click', '.add_comment', function(e) {
			var $block = $(this).closest('.block_items').children('.block_item');

			if ($block.size() == 1 && $block.hasClass('hidden')) {
				$block.removeClass('hidden').show();
			} else {
				$block.first().clone()
					.find('option').prop('selected', false).end()
					.find('textarea').val('').end()
					.find('input[type=text]').val('').end()
					.insertAfter($block.last());
			}
		})
		.on('click', '.add_group', function(e) {
			var $block = $(this).closest('.block_items').children('.block_item');

			if ($block.size() == 1 && $block.hasClass('hidden')) {
				$block.removeClass('hidden').show();
			} else {
				$block.first().clone()
					.find('.list_item').first().nextAll('.list_item').remove().end().end().end()
					.find('option').prop('selected', false).end()
					.find('input[type=text]').val('').end()
					.insertAfter($block.last());
			}
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