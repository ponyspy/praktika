$(function() {
	$('.s_button').on('click', function(e) {
		var type = $(this).attr('social');
		var url = location.href;
		var title = $('title').text();

		if (type == 'fb') {
			window.open('https://www.facebook.com/sharer.php' + '?' + $.param({ u: url, title: title }), '_blank');
		}

		if (type == 'twitter') {
			window.open('https://twitter.com/intent/tweet' + '?' + $.param({ text: url }), '_blank');
		}

		if (type == 'vk') {
			window.open('https://vk.com/share.php' + '?' + $.param({ url: url, title: title }), '_blank');
		}
	});
});