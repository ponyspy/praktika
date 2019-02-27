var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Post = Model.Post;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;
	var uploadImagesContent = Params.upload.image_content;


	module.index = function(req, res, next) {
		res.render('admin/posts/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var post_item = new Post();

		post_item._short_id = shortid.generate();
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

			checkNested(post, [locale, 'intro'])
				&& post_item.setPropertyLocalised('intro', post[locale].intro, locale);

		});

		async.series([
			async.apply(uploadImage, post_item, 'posts', 'poster', 800, files.poster && files.poster[0], null),
			async.apply(uploadImagesContent, post_item, post, 'posts', checkNested(post, ['ru', 'description']) ? 'ru' : false),
			async.apply(uploadImagesContent, post_item, post, 'posts', checkNested(post, ['en', 'description']) ? 'en' : false),
		], function(err, results) {
			if (err) return next(err);

			post_item.save(function(err, post_item) {
				if (err) return next(err);

				res.redirect('/admin/posts');
			});
		});
	};


	return module;
};