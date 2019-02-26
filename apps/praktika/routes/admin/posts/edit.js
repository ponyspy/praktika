var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Post = Model.Post;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;
	var uploadImagesContent = Params.upload.image_content;
	var uploadImagesContentPreview = Params.upload.image_content_preview;


	module.index = function(req, res, next) {
		var id = req.params.post_item_id;

		Post.findById(id).exec(function(err, post_item) {
			if (err) return next(err);

			uploadImagesContentPreview(post_item, 'ru', function(err, post_item) {
				if (err) return next(err);

				uploadImagesContentPreview(post_item, 'en', function(err, post_item) {
					if (err) return next(err);

					res.render('admin/posts/edit.pug', { post_item: post_item });
				});
			});
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
			post_item.view = post.view;
			post_item.sym = post.sym ? post.sym : undefined;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& post_item.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 's_title'])
					&& post_item.setPropertyLocalised('s_title', post[locale].s_title, locale);

			});

			async.series([
				async.apply(uploadImage, post_item, 'posts', 'poster', 800, files.poster && files.poster[0], post.poster_del),
				async.apply(uploadImagesContent, post_item, post, 'posts', checkNested(post, ['ru', 'description']) ? 'ru' : false),
				async.apply(uploadImagesContent, post_item, post, 'posts', checkNested(post, ['en', 'description']) ? 'en' : false),
			], function(err, results) {
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