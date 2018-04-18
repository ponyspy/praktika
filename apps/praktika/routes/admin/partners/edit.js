var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Partner = Model.Partner;

	var uploadImage = Params.upload.image;
	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.partner_id;

		Partner.findById(id).exec(function(err, partner) {
			if (err) return next(err);

			res.render('admin/partners/edit.pug', { partner: partner });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.partner_id;

		Partner.findById(id).exec(function(err, partner) {
			if (err) return next(err);

			partner.status = post.status;
			partner.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			partner.link = post.link;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& partner.setPropertyLocalised('title', post[locale].title, locale);

			});

			uploadImage(partner, 'partners', 'logo', 1920, files.logo && files.logo[0], post.logo_del, function(err, partner) {
				if (err) return next(err);

				partner.save(function(err, partner) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};