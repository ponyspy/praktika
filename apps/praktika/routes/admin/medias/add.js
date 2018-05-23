var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Media = Model.Media;
	var Announce = Model.Announce;

	var uploadImage = Params.upload.image;
	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		Announce.find().exec(function(err, announces) {
			if (err) return next(err);

			res.render('admin/medias/add.pug', { announces: announces });
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var media = new Media();

		media._short_id = shortid.generate();
		media.status = post.status;
		media.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		media.style = post.style;
		media.holder = post.holder;
		media.announce = post.announce != 'none' ? post.announce : undefined;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& media.setPropertyLocalised('title', post[locale].title, locale);

		});

		uploadImage(media, 'medias', 'poster', 1920, files.poster && files.poster[0], null, function(err, media) {
			if (err) return next(err);

			uploadFile(media, 'medias', 'video', files.video && files.video[0], null, function(err, media) {
				if (err) return next(err);

				media.save(function(err, media) {
					if (err) return next(err);

					res.redirect('/admin/medias');
				});
			});
		});
	};


	return module;
};