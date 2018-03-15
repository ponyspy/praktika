module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;
	var Announce = Model.Announce;

	module.index = function(req, res) {
		Media.find().sort('date').exec(function(err, medias) {
			Announce.findOne().sort('-interval.start').exec(function(err, announce) {
				res.render('main/index.jade', { announce: announce, medias: medias });
			});
		});
	};

	return module;
};