var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Slide = Model.Slide;

	var uploadImage = Params.upload.image;
	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		res.render('admin/slides/add.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var slide = new Slide();

		slide._short_id = shortid.generate();
		slide.status = post.status;
		slide.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		slide.style = post.style;
		slide.contents = post.contents;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& slide.setPropertyLocalised('title', post[locale].title, locale);

		});

		uploadImage(slide, 'slides', 'poster', 1920, files.poster && files.poster[0], null, function(err, slide) {
			if (err) return next(err);

			uploadFile(slide, 'slides', 'video', files.video && files.video[0], null, function(err, slide) {
				if (err) return next(err);

				slide.save(function(err, slide) {
					if (err) return next(err);

					res.redirect('/admin/slides');
				});
			});
		});
	};


	return module;
};