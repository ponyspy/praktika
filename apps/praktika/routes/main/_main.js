var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	events: require('./events.js')(Model),
	team: require('./team.js')(Model),
	docs: require('./docs.js')(Model),
	about: require('./about.js')(Model),
	contacts: require('./contacts.js')(),
	options: require('./options.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index);

	router.route('/events')
		.get(main.events.index)
		.post(main.events.get_events);

	router.route('/events/:short_id')
		.get(main.events.event);

	router.route('/team')
		.get(main.team.index)
		.post(main.team.get_member);

	router.route('/about')
		.get(main.about.index);

	router.route('/contacts')
		.get(main.contacts.index);

	router.route('/docs')
		.get(main.docs.index);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/widget')
		.get(main.options.widget);

	router.route('/search')
		.post(main.options.search);

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();