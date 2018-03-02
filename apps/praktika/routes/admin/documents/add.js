var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Document = Model.Document;

	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		res.render('admin/documents/add.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var doc = new Document();

		doc._short_id = shortid.generate();
		doc.status = post.status;
		doc.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& doc.setPropertyLocalised('title', post[locale].title, locale);

		});

		uploadFile(doc, 'docs', 'attach', files.attach && files.attach[0], null, function(err, doc) {
			if (err) return next(err);

			doc.save(function(err, doc) {
				if (err) return next(err);

				res.redirect('/admin/documents');
			});
		});
	};


	return module;
};