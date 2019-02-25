var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Post = Model.Post;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.post_item_id;

		Post.findById(id).exec(function(err, post_item) {
			if (err) return next(err);

			res.render('admin/posts/edit.pug', { post_item: post_item });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.post_item_id;

		Post.findById(id).exec(function(err, post_item) {
			if (err) return next(err);

			post_item.status = post.status;
			post_item.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			post_item.style = post.style;
			post_item.holder = post.holder;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& post_item.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 's_title'])
					&& post_item.setPropertyLocalised('s_title', post[locale].s_title, locale);

				checkNested(post, [locale, 'description'])
					&& post_item.setPropertyLocalised('description', post[locale].description, locale);

			});

			uploadImage(post_item, 'posts', 'poster', 1920, files.poster && files.poster[0], post.poster_del, function(err, post_item) {
				if (err) return next(err);

				post_item.save(function(err, post_item) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};