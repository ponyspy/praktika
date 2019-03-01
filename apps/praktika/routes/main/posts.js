var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Post = Model.Post;

	module.index = function(req, res) {
		res.redirect('/');
	};

	module.post = function(req, res) {
		var user_id = req.session.user_id;
		var id = req.params.short_id;

		var Query = user_id
			? Post.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Post.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query.exec(function(err, post_item) {
			if (err) return next(err);

			res.render('main/post.pug', { moment: moment, post_item: post_item });
		});
	};

	return module;
};