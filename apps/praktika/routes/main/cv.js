var fs = require('fs');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var People = Model.People;

	module.index = function(req, res, next) {
		fs.readFile(__app_root + '/static/link.html', function(err, content) {
			if (err) return next(err);

			res.redirect(content);
		});
	};

	module.people = function(req, res, next) {
		var id = req.params.short_id;

		People.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).exec(function(err, people) {
			if (err || !people.link && !people.attach_cv) return next(err);

			res.redirect(people.attach_cv ? people.attach_cv : people.link);
		});
	};

	return module;
};