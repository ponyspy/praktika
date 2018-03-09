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

var search = {
	val: '', buf: '',
	checkResult: function() {
		if (this.buf != this.val) {
			this.buf = this.val;
			this.getResult.call(search, this.block, this.val);
		}
	},
	getResult: function(block, search) {
		var regex = new RegExp(search, 'ig');
		var $options = block.parent().find('option');

		$options.filter('.hide').unwrap().removeClass('hide');

		$options.each(function() {
			var $this = $(this);

			if (!regex.test($this.text())) {
				$this.addClass('hide').wrap('<span/>');
			}
		});

		$options.eq(0).prop('selected', true);
	}
};

$(function() {
	$(document)
		.on('keyup change', '.list_sort', function(e) {
			search.block = $(this);
			search.val = $(this).val();
		})
		.on('focusin', '.list_sort', function(e) {
			search.interval = setInterval(function() {
				search.checkResult.call(search);
			}, 600);
		})
		.on('focusout', '.list_sort', function(e) {
			clearInterval(search.interval);
		})
		.on('click', '.list_sort_tg', function(e) {
			$(this).parent().children('.list_sort').toggle().focus();
		})
		.on('click', '.up_block', function(e) {
			var $block = $(this).closest('.block_item');
			$block.insertBefore($block.prev());
		})
		.on('click', '.down_block', function(e) {
			var $block = $(this).closest('.block_item');
			if ($block.next().attr('class').match(/add_comment|add_publication|add_group/)) return false;
			$block.insertAfter($block.next());
		})
		.on('click', '.rm_block', function(e) {
			if ($(this).closest('.block_items').children('.block_item').size() == 1) {
				$(this).closest('.block_item').addClass('hidden').hide();
			} else {
				$(this).closest('.block_item').remove();
			}
		})
		.on('click', '.add_date, .add_comment, .add_publication, .add_group', function(e) {
			var $block = $(this).closest('.block_items').children('.block_item');

			if ($block.size() == 1 && $block.hasClass('hidden')) {
				$block.removeClass('hidden')
					.find('.list_item').first().nextAll('.list_item').remove().end().end().end()
					.find('option').prop('selected', false)
					.filter('.hide').unwrap().removeClass('hide').end().end()
					.find('textarea').val('').end()
					.find('input[type=text]').val('').end()
					.find('input[type=checkbox]').prop('checked', false).end()
					.find('.date').val('').pickmeup(date_config).end()
					.show();
			} else {
				$block.first().clone()
					.find('.list_item').first().nextAll('.list_item').remove().end().end().end()
					.find('option').prop('selected', false)
					.filter('.hide').unwrap().removeClass('hide').end().end()
					.find('textarea').val('').end()
					.find('input[type=text]').val('').end()
					.find('input[type=checkbox]').prop('checked', false).end()
					.find('.date').val('').pickmeup(date_config).end()
					.insertAfter($block.last());
			}
		})
		.on('click', '.link_open', function(e) {
			var exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
			var regex = new RegExp(exp);
			var url = $(this).closest('.block_item').find('.link').val();

			if (url.match(regex)) {
				window.open(url, '_blank');
			}
		})
		.on('click', '.add_member', function(e) {
			var $members = $(this).closest('.group_list').children('.list_item');

			$members.first().clone()
				.find('option').prop('selected', false)
				.filter('.hide').unwrap().removeClass('hide').end().end()
				.find('.list_sort').val('').end()
				.insertAfter($members.last());
		})
		.on('click', '.rm_member', function(e) {
			var $list = $(this).closest('.group_list').children('.list_item');

			if ($list.size() == 1) return false;
			$(this).parent('.list_item').remove();
		});
});