module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;

	module.index = function(req, res) {
		Media.find().sort('date').where('status').ne('hidden').populate({
			path: 'announce',
			match: { 'status': { $ne: 'hidden' },
							 'interval.start': { $lte: new Date().getTime() },
							 'interval.end': { $gte: new Date().getTime() },
			}}).exec(function(err, medias) {

			res.render('main/index.pug', { medias: medias });
		});
	};

	return module;
};