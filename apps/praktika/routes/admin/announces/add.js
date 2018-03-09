var shortid = require('shortid');

module.exports = function(Model, Params) {
	var module = {};

	var Announce = Model.Announce;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res) {
		res.render('admin/announces/add.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var announce = new Announce();

		announce._short_id = shortid.generate();
		announce.status = post.status;
		announce.link = post.link;


		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& announce.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 's_title'])
				&& announce.setPropertyLocalised('s_title', post[locale].s_title, locale);
		});

		announce.save(function(err, announce) {
			if (err) return next(err);

			res.redirect('/admin/announces');
		});
	};


	return module;
};