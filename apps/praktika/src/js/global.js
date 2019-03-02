$(function() {
	$('.menu_open').on('click', function(e) {
		$('body').toggleClass('stop_scroll');
		$('.title_block, .menu_open').toggleClass('open');
	});

	$(document)
		.on('touchmove', 'body.stop_scroll', false)
		.on('keyup', function(e) {

			if (e.which == 27) {
				$('.search_block, .subs_block').removeClass('show');
				$('.title_block, .menu_open').removeClass('open');
				$('body').removeClass('stop_scroll');
				$('.widget_block').removeClass('open').children('.widget_inner').empty();
			}

		})
		.on('mouseup touchend', function(e) {
			if ($(e.target).closest('.title_block').length) return;

			$('.title_block, .menu_open').removeClass('open');

			e.stopPropagation();
		})
		.on('click', '.results_holder', function(e) {
			$(this).closest('.context_results').find('.hidden').removeClass('hidden');
			$(this).remove();
		});

	$('.banner_subscribe').on('click', function(e) {
		$('.subs_block').toggleClass('show');
		$('body').addClass('stop_scroll');
		$('.subs_input').val('');
		$('.subs_input.email').focus();
	});

	$('.search').on('click', function(e) {
		$('.search_block').addClass('show');
		$('body').addClass('stop_scroll');
		$('.search_input').focus();
	});

	$('.search_close, .subs_close').on('click', function(e) {
		$('body').removeClass('stop_scroll');
		$('.search_block, .subs_block').removeClass('show');
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
				$('.search_results').empty().append(data);
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