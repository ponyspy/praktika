$(function() {
	$('.menu_open').on('click', function(e) {
		$('.menu_items, .title_block, .menu_open').toggleClass('open');
	});

	$(document)
		.on('mouseup touchend', function(e) {
			if ($(event.target).closest('.title_block').length) return;

			$('.menu_items, .title_block, .menu_open').removeClass('open');

			event.stopPropagation();
		});

	$('.search').on('click', function(e) {
		$('.search_block').toggleClass('show');
		$('.search_input').focus();
	});

	$('.search_close').on('click', function(e) {
		$('.search_block').toggleClass('show');
	});

	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', { text: result }).done(function(data) {
				if (data == 'end') {
					$('.search_results').empty().text('Ничего нет!');
				} else {
					$('.search_results').empty().append(data);
				}
			});
		}
	};

	$('.search_input')
		.on('keyup change', function(event) {
			search.val = $(this).val();
		})
		.on('focusin', function(event) {
			search.interval = setInterval(function() {
				search.checkResult.call(search);
			}, 600);
		})
		.on('focusout', function(event) {
			clearInterval(search.interval);
		});
});