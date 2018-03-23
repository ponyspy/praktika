var jade = require('jade');
var i18n = require('i18n');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;

	module.index = function(req, res) {
		Member.find().where('status').nin(['hidden', 'special']).sort('name.value').exec(function(err, members) {
			res.render('main/team.jade', { members: members });
		});
	};

	module.get_member = function(req, res) {
		Member.findOne({ '_short_id': req.body.id }).exec(function(err, member) {
			Event.find({ 'members.list': member._id }).exec(function(err, events) {
				var opts = {
					__: function() { return i18n.__.apply(null, arguments); },
					__n: function() { return i18n.__n.apply(null, arguments); },
					locale: req.locale,
					events: events,
					member: member,
					static_types: req.app.locals.static_types,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				res.send(jade.renderFile(__app_root + '/views/main/_member.jade', opts));
			});
		});
	};

	return module;
};