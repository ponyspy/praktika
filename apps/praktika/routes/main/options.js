var sitemap = require('sitemap');
var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Member = Model.Member;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.widget = function(req, res, next) {
		var query = req.query;
		var ref = req.app.locals.static_types.pn_ref;

		res.render('main/_widget.jade', { ref: ref, alias: query.alias, date: query.date, time: query.time });
	};

	module.search = function(req, res, next) {
		Member.find({ $text: { $search: req.body.text } }).exec(function(err, members) {
			var members_ids = members.map(function(member) {
				return member._id.toString();
			});

			var query = members_ids && members_ids.length > 0
				? { $or: [{ $text: { $search: req.body.text } }, { 'members.list': { $in: members_ids } }] }
				: { $text: { $search: req.body.text } }

			Event.find(query, { score: { $meta: 'textScore' } }).sort( { score: { $meta: 'textScore' } } ).exec(function(err, events) {

				var opts = {
					__: function() { return res.locals.__.apply(null, arguments); },
					__n: function() { return res.locals.__n.apply(null, arguments); },
					get_locale: get_locale,
					members: members,
					events: events,
					static_types: req.app.locals.static_types,
					locale: req.locale,
					compileDebug: false, debug: false, cache: false, pretty: false
				};

				res.send(jade.renderFile(__app_root + '/views/main/_search.jade', opts));
			});
		});
	};

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