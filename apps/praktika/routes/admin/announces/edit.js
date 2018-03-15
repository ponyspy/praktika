var moment = require('moment');

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
			announce.link = post.link;
			announce.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			announce.interval.start = moment(post.interval.start.date + 'T' + post.interval.start.time.hours + ':' + post.interval.start.time.minutes);
			announce.interval.end = moment(post.interval.end.date + 'T' + post.interval.end.time.hours + ':' + post.interval.end.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& announce.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 's_title'])
					&& announce.setPropertyLocalised('s_title', post[locale].s_title, locale);
			});

			announce.save(function(err, announce) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};