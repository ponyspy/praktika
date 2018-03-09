var rimraf = require('rimraf');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;


	module.index = function(req, res) {
		var id = req.body.id;

		async.series([
			function(callback) {
				Event.update({'members.list': id}, { $pull: { 'members.$.list': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Event.update({}, { $pull: { 'members': { 'list': { $size: 0 } } } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Member.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/members/' + id, { glob: false }, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};