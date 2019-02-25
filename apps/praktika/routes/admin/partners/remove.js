var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Partner.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			Event.update({}, { $pull: { 'partners': id } }, { 'multi': true }).exec(function() {

				rimraf(__glob_root + '/public/cdn/' + __app_name + '/partners/' + id, { glob: false }, function(err) {
					if (err) return next(err);

					res.send('ok');
				});
			});
		});

	};


	return module;
};