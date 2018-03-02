var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Document = Model.Document;

	var uploadFile = Params.upload.file;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.document_id;

		Document.findById(id).exec(function(err, doc) {
			if (err) return next(err);

			res.render('admin/documents/edit.jade', { doc: doc });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.document_id;


		Document.findById(id).exec(function(err, doc) {
			if (err) return next(err);

			doc.status = post.status;
			doc.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& doc.setPropertyLocalised('title', post[locale].title, locale);

			});

			uploadFile(doc, 'docs', 'attach', files.attach && files.attach[0], post.attach_del, function(err, doc) {
				if (err) return next(err);

				doc.save(function(err, doc) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};