module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;
	var Announce = Model.Announce;

	module.index = function(req, res) {
		Media.find().sort('date').where('status').ne('hidden').exec(function(err, medias) {
			Announce.findOne().sort('interval.start').where('status').ne('hidden').exec(function(err, announce) {
				res.render('main/index.jade', { announce: announce, medias: medias, banner: req.cookies.banner });
			});
		});
	};

	return module;
};