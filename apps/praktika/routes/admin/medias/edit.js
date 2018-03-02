var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Media = Model.Media;

	var uploadImage = Params.upload.image;
	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.media_id;

		Media.findById(id).exec(function(err, media) {
			if (err) return next(err);

			res.render('admin/medias/edit.jade', { media: media });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.media_id;

		Media.findById(id).exec(function(err, media) {
			if (err) return next(err);

			media.status = post.status;
			media.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			media.style = post.style;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& media.setPropertyLocalised('title', post[locale].title, locale);

			});

			uploadImage(media, 'medias', 'poster', 1920, files.poster && files.poster[0], post.poster_del, function(err, media) {
				if (err) return next(err);

				uploadFile(media, 'medias', 'video', files.video && files.video[0], post.video_del, function(err, media) {
					if (err) return next(err);

					media.save(function(err, media) {
						if (err) return next(err);

						res.redirect('back');
					});
				});
			});
		});
	};


	return module;
};