module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;

	module.index = function(req, res) {
		res.render('main/events.jade');
	};

	module.event = function(req, res) {
		var id = req.params.short_id;

		res.render('main/event.jade');
	};

	return module;
};