var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;

	module.index = function(req, res) {
		res.render('main/events.jade');
	};

	module.get_events = function(req, res) {
		Event.aggregate([
			{ $unwind: '$schedule' },
			{ $match: { 'status': { $ne: 'hidden' }}},
			{ $match: { 'schedule.date': {
				'$gte': moment().startOf('month').add(0, 'months').toDate(),
				'$lte': moment().endOf('month').add(0, 'months').toDate()
			}}},
			{ $sort: { 'schedule.date': 1 } },
			{ $project: {
				title: 1,
				s_title: 1,
				age: 1,
				schedule: 1,
				poster: 1,
				members: 1
			}},
			{ $addFields: { 'members': { $filter: {
				input: '$members',
				as: 'group',
				cond: { $ne: ['$$group.mode', 'event']}
			}}}}
		])
		.exec(function(err, events) {
			res.send(events);
		});
	};

	module.event = function(req, res) {
		var id = req.params.short_id;

		Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden').exec(function(err, event) {
			res.render('main/event.jade', { event: event });
		});
	};

	return module;
};