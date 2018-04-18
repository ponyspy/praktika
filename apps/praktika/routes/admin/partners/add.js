var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Partner = Model.Partner;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		res.render('admin/partners/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var partner = new Partner();

		partner._short_id = shortid.generate();
		partner.status = post.status;
		partner.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		partner.link = post.link;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& partner.setPropertyLocalised('title', post[locale].title, locale);

		});

		uploadImage(partner, 'partners', 'logo', 200, files.logo && files.logo[0], null, function(err, partner) {
			if (err) return next(err);

			partner.save(function(err, partner) {
				if (err) return next(err);

				res.redirect('/admin/partners');
			});
		});
	};


	return module;
};