module.exports = function(Model, Params) {
	var module = {};

	var Announce = Model.Announce;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.id;

		Announce.findById(id).exec(function(err, announce) {
			if (err) return next(err);

			res.render('admin/announces/edit.jade', {announce: announce});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.id;

		Announce.findById(id).exec(function(err, announce) {
			if (err) return next(err);

			announce.status = post.status;

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& announce.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& announce.setPropertyLocalised('description', post[locale].description, locale);
			});

			announce.save(function(err, announce) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};