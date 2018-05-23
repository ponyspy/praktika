var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;

	module.index = function(req, res) {
		Media.find().sort('date').where('status').ne('hidden').populate({
			path: 'announce',
			match: { 'status': { $ne: 'hidden' },
							 'interval.start': { $gte: moment().toDate() },
							 'interval.end': { $lte: moment().toDate() },
			}}).exec(function(err, medias) {

			var banner = req.cookies.banner
				? +req.cookies.banner <= 2
				: true

			res.render('main/index.pug', { medias: medias, banner: banner, cookies: req.cookies });
		});
	};

	return module;
};