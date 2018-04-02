var moment = require('moment');
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

	module.index = function(req, res) {
		var months = [0, 1, 2].map(function(month) {
			var date = moment().locale(req.locale).add(month, 'months');
			var days = Array.from({ length: date.daysInMonth() }).map(function(day, i) {
				return { date: i+1, wday: date.set('date', i+1).format('dd') };
			});

			return { month: date.format('MMMM'), days: days };
		});

		res.render('main/events.jade', { months: months });
	};

	module.get_events = function(req, res) {
		var month = req.body.month;
		var date_start = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
		var date_end = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

		Event.aggregate([
			{ $unwind: '$schedule' },
			{ $match: { 'status': {
				$ne: 'hidden'
			}}},
			{ $match: { 'schedule.date': {
				$gte: month > 0 ? date_start.startOf('month').add(month, 'months').toDate() : moment().toDate(),
				$lte: date_end.endOf('month').add(month, 'months').toDate()
			}}},
			{ $sort: { 'schedule.date': 1 } },
			{ $project: {
				sym:   1, _short_id: 1, age:    1, schedule: 1,
				title: 1, s_title:   1, poster: 1, members:  1,
				poster_hover: 1
			}},
			{ $addFields: { 'members': { $filter: {
				input: '$members',
				as: 'group',
				cond: { $ne: ['$$group.mode', 'event'] }
			}}}}
		])
		.exec(function(err, events) {
			Member.populate(events, { path: 'members.list', select: 'name _short_id status' }, function(err, events) {

				var opts = {
					__: function() { return res.locals.__.apply(null, arguments); },
					__n: function() { return res.locals.__n.apply(null, arguments); },
					get_locale: get_locale,
					events: events,
					locale: req.locale,
					moment: moment,
					compileDebug: false, debug: false, cache: false, pretty: false
				};

				res.send(jade.renderFile(__app_root + '/views/main/_events.jade', opts));
			});
		});
	};

	module.event = function(req, res) {
		var id = req.params.short_id;

		Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden').populate('partners members.list comments.member').exec(function(err, event) {
			res.render('main/event.jade', { event: event, moment: moment, get_locale: get_locale });
		});
	};

	return module;
};