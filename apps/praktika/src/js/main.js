$(function() {

	$(document).on('keyup', function(e) {
		if (e.which == 32) {
			$('.poster_item.active').trigger('click');
		}
	});

	var timer = function() {
		$('.active').trigger('click');
	};

	var interval = setInterval(timer, 3000);

	var $posters = $('.poster_item').sort(function() {
		return 0.5 - Math.random();
	}).appendTo('.posters_block');

	setTimeout(function() {

		$posters.on('click', function(e) {

			clearInterval(interval);
			interval = setInterval(timer, 3000);

			var flag_round = $(this).index() < $posters.length - 1;
			var $next_load = flag_round
				? $posters.filter(this).nextAll()
				: $posters.first().nextAll().addBack();

			$next_load.slice(0, 2).not('.load').each(function() {
				var $this = $(this);
				$this.attr('src', $this.attr('data-src')).addClass('load').removeAttr('data-src');
			});

			flag_round
				? $posters.removeClass('active').filter(this).next().addClass('active')
				: $posters.removeClass('active').first().addClass('active');

		}).last().trigger('click');

	}, 0);

});