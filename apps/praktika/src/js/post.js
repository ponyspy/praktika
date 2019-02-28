$(function() {
	$('.s_button').on('click', function(e) {
		var type = $(this).attr('social');
		var url = location.href;
		var title = $('title').text();
		var x = window.top.outerWidth / 2 + window.top.screenX - (600 / 2);
		var y = window.top.outerHeight / 2 + window.top.screenY - (800 / 2);
		var params = 'left=' + x + ',top=' + y + ',width=600,height=800';

		if (type == 'fb') {
			window.open('https://www.facebook.com/sharer.php' + '?' + $.param({ u: url, title: title }), '_blank', params);
		}

		if (type == 'twitter') {
			window.open('https://twitter.com/intent/tweet' + '?' + $.param({ text: url }), '_blank', params);
		}

		if (type == 'vk') {
			window.open('https://vk.com/share.php' + '?' + $.param({ url: url, title: title }), '_blank', params);
		}
	});
});