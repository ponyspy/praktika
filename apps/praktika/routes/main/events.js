var moment = require('moment');
var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Member = Model.Member;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.index = function(req, res, next) {
		Event.find().sort('-date').where('status').ne('hidden').exec(function(err, events) {
			if (err) return next(err);

			res.render('main/events.pug', { events: events });
		});
	};

	module.event = function(req, res, next) {
		var id = req.params.short_id;

		Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden')
			.populate({'path': 'partners', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'title status _short_id' })
			.populate({'path': 'members.list', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'name status _short_id' })
			.populate({'path': 'comments.member', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'name status photo_preview _short_id' })
			.exec(function(err, event) {
			if (!event || err) return next(err);

			event.schedule.sort(function(a, b) { return a.date - b.date });

			var check_schedule = event.pn_alias && event.schedule.length > 0 && event.schedule.some(function(item) {
				return moment(item.date).isAfter();
			});

			res.render('main/event.pug', { event: event, check_schedule: check_schedule, moment: moment, get_locale: get_locale });
		});
	};

	module.schedule = function(req, res) {
		var months = [0, 1, 2].map(function(month) {
			var date = moment().locale(req.locale).add(month, 'months');
			var days = Array.from({ length: date.daysInMonth() }).map(function(day, i) {
				return { date: i+1, wday: date.set('date', i+1).format('dd') };
			});

			return { month: date.format('MMMM'), days: days };
		});

		res.render('main/schedule.pug', { months: months });
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
				$lte: date_end.add(month, 'months').endOf('months').toDate()
			}}},
			{ $sort: { 'schedule.date': 1 } },
			{ $project: {
				sym:   1, _short_id: 1, age:    1, schedule: 1,
				title: 1, s_title:   1, poster: 1, members:  1,
				poster_hover: 1, pn_alias: 1
			}},
			{ $addFields: { 'members': { $filter: {
				input: '$members',
				as: 'group',
				cond: { $ne: ['$$group.mode', 'event'] }
			}}}}
		])
		.exec(function(err, events) {
			Member.populate(events, { path: 'members.list', match: { 'status': { '$ne': 'hidden' } }, select: 'name _short_id status' }, function(err, events) {

				var opts = {
					__: function() { return res.locals.__.apply(null, arguments); },
					__n: function() { return res.locals.__n.apply(null, arguments); },
					get_locale: get_locale,
					events: events,
					locale: req.locale,
					moment: moment,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				res.send({
					start: date_start.add(1, 'second').format('YYYY-MM-DD'),
					end: date_end.add(1, 'second').format('YYYY-MM-DD'),
					count: events.length,
					events: pug.renderFile(__app_root + '/views/main/_events.pug', opts)
				});
			});
		});
	};

	return module;
};