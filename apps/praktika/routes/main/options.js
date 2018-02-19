var sitemap = require('sitemap');

module.exports = function(Model, Params) {
	var module = {};

	var Work = Model.Work;

	module.sitemap = function(req, res, next) {
		Work.where('status').ne('hidden').exec(function(err, works) {
			var get_tree = function(base, works) {
				return works.reduce(function(prev, work) {
					if (base.replace('projects', 'project') == work.type) {
						prev.push({ url: '/' + base + '/' + work._short_id });
					}

					return prev;
				}, [{ url: '/' + base }]);
			};

			var site_map = sitemap.createSitemap ({
				hostname: 'https://' + req.hostname,
				// cacheTime: 600000,
				urls: [
					{ url: '/' },
					{ url: '/office' },
				].concat(get_tree('projects', works))
				 .concat(get_tree('research', works))
			});

			site_map.toXML(function (err, xml) {
				if (err) return next(err);

				res.type('xml').send(xml);
			});

		});
	};


	return module;
};