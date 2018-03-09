module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;

	module.index = function(req, res) {
		res.render('main/events.jade');
	};

	module.event = function(req, res) {
		var id = req.params.short_id;

		Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden').exec(function(err, event) {
			res.render('main/event.jade', { event: event });
		});
	};

	return module;
};