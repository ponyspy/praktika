var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;

	module.index = function(req, res) {
		Member.find().where('status').nin(['hidden', 'special']).sort('-date').exec(function(err, members) {
			Member.distinct('roles').exec(function(err, roles) {
				res.render('main/team.pug', { members: members, roles: roles });
			});
		});
	};

	module.get_member = function(req, res) {
		Member.findOne({ '_short_id': req.body.id }).where('status').nin(['hidden', 'special']).exec(function(err, member) {
			if (err || !member) return res.send('err');

			Event.find({ 'members.list': member._id }).where('status').ne('hidden').exec(function(err, events) {
				var opts = {
					__: function() { return res.locals.__.apply(null, arguments); },
					__n: function() { return res.locals.__n.apply(null, arguments); },
					locale: req.locale,
					events: events,
					member: member,
					static_types: req.app.locals.static_types,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				res.send(pug.renderFile(__app_root + '/views/main/_member.pug', opts));
			});
		});
	};

	return module;
};