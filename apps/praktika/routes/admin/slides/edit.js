var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Slide = Model.Slide;

	var uploadImage = Params.upload.image;
	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.slide_id;

		Slide.findById(id).exec(function(err, slide) {
			if (err) return next(err);

			res.render('admin/slides/edit.pug', { slide: slide });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.slide_id;

		Slide.findById(id).exec(function(err, slide) {
			if (err) return next(err);

			slide.status = post.status;
			slide.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			slide.style = post.style;
			slide.contents = post.contents;
			slide.holder = post.holder;
			slide.body = post.body;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& slide.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& slide.setPropertyLocalised('description', post[locale].description, locale);

				checkNested(post, [locale, 'attach_desc'])
					&& slide.setPropertyLocalised('attach_desc', post[locale].attach_desc, locale);

			});

			uploadImage(slide, 'slides', 'poster', 1920, files.poster && files.poster[0], post.poster_del, function(err, slide) {
				if (err) return next(err);

				uploadFile(slide, 'slides', 'video', files.video && files.video[0], post.video_del, function(err, slide) {
					if (err) return next(err);

					uploadFile(slide, 'slides', 'attach', files.attach && files.attach[0], post.video_del, function(err, slide) {
						if (err) return next(err);

						slide.save(function(err, slide) {
							if (err) return next(err);

							res.redirect('back');
						});
					});
				});
			});
		});
	};


	return module;
};