var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;
	var Post = Model.Post;

	module.index = function(req, res) {
		Post.find().sort('-date').where('status').ne('hidden').limit(5).exec(function(err, posts) {
			Media.find().sort('date').where('status').ne('hidden').populate({
				path: 'announce',
				match: { 'status': { $ne: 'hidden' },
								 'interval.start': { $lte: new Date().getTime() },
								 'interval.end': { $gte: new Date().getTime() },
				}}).exec(function(err, medias) {

				res.render('main/index.pug', { moment: moment, medias: medias, posts: posts });
			});
		});
	};

	return module;
};