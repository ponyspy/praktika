module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;

	module.index = function(req, res) {
		Media.find().sort('date').where('status').ne('hidden').populate('announce').exec(function(err, medias) {

			var banner = req.cookies.banner
				? +req.cookies.banner <= 2
				: true

			res.render('main/index.pug', { medias: medias, banner: banner, cookies: req.cookies });
		});
	};

	return module;
};