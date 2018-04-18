module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;
	var Announce = Model.Announce;

	module.index = function(req, res) {
		Media.find().sort('date').where('status').ne('hidden').exec(function(err, medias) {
			Announce.findOne().sort('interval.start').where('status').ne('hidden').exec(function(err, announce) {

				var banner = req.cookies.banner
					? +req.cookies.banner <= 2
					: true

				var announce_hide = req.cookies.announce
					? announce._short_id == req.cookies.announce
					: false;

				res.render('main/index.pug', { announce: announce, medias: medias, banner: banner, announce_hide: announce_hide });
			});
		});
	};

	return module;
};