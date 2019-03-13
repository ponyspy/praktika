var moment = require('moment');
var pug = require('pug');

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

	module.get_posts = function(req, res) {
		var post = req.body;

		Post.find().sort('-date').where('status').ne('hidden').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, posts) {
			if (err) return res.send('err');

			var opts = {
				__: function() { return res.locals.__.apply(null, arguments); },
				__n: function() { return res.locals.__n.apply(null, arguments); },
				locale: req.locale,
				moment: moment,
				load: true,
				posts: posts,
				compileDebug: false, debug: false, cache: true, pretty: false
			};

			if (posts && posts.length > 0) {
				res.send(pug.renderFile(__app_root + '/views/main/_posts.pug', opts));
			} else {
				res.send('end');
			}
		});
	}

	return module;
};