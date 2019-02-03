var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	events: require('./events.js')(Model),
	team: require('./team.js')(Model),
	docs: require('./docs.js')(Model),
	about: require('./about.js')(Model),
	partners: require('./partners.js')(Model),
	contacts: require('./contacts.js')(),
	options: require('./options.js')(Model),
	tickets: require('./tickets.js')(),
	static: require('./static.js'),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index);

	router.route('/schedule')
		.get(main.events.schedule)
		.post(main.events.get_events);

	router.route('/plays/:short_id').get(function(req, res) {
		res.redirect('/events/' + req.params.short_id);
	});

	router.route('/events')
		.get(main.events.index);

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

	router.route('/partners')
		.get(main.partners.index);

	router.route('/students')
		.get(main.static.students);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/widget')
		.get(main.tickets.widget);

	router.route('/ticket_schedule')
		.post(main.tickets.schedule);

	router.route('/ticket_event')
		.post(main.tickets.event);

	router.route('/search')
		.post(main.options.search);

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();