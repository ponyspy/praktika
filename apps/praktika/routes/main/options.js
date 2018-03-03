var sitemap = require('sitemap');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;

	module.sitemap = function(req, res, next) {

		Event.where('status').ne('hidden').exec(function(err, events) {
			var arr_events = events.map(function(event) {
				return {
					url: '/events/' + (event.sym ? event.sym : event._short_id)
				};
			});

			var site_map = sitemap.createSitemap ({
				hostname: 'https://' + req.hostname,
				// cacheTime: 600000,
				urls: [
					{ url: '/' },
					{ url: '/team' },
					{ url: '/contacts' },
					{ url: '/about' },
					{ url: '/docs' },
				].concat(arr_events)
			});

			site_map.toXML(function (err, xml) {
				if (err) return next(err);

				res.type('xml').send(xml);
			});

		});
	};


	return module;
};