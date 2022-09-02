$(function() {
	$('.s_button').on('click', function(e) {
		var type = $(this).attr('social');
		var url = location.href;
		var title = $('title').text();
		var x = window.top.outerWidth / 2 + window.top.screenX - (600 / 2);
		var y = window.top.outerHeight / 2 + window.top.screenY - (800 / 2);
		var params = 'left=' + x + ',top=' + y + ',width=600,height=800';

		var social_list = {
			'fb': {
				'url': 'https://www.facebook.com/sharer.php',
				'params': { u: url, title: title }
			},
			'twitter': {
				'url': 'https://twitter.com/intent/tweet',
				'params': { text: url }
			},
			'vk': {
				'url': 'https://vk.com/share.php',
				'params': { url: url, title: title }
			},
			'tg': {
				'url': 'https://t.me/share/url',
				'params': { url: url, text: title }
			}
		};

		if (/fb|tg|twitter|vk/.test(type)) {
			window.open(social_list[type].url + '?' + $.param(social_list[type].params), '_blank', params);
		}
	});
});