var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Document = Model.Document;


	module.index = function(req, res, next) {
		Document.find().sort('-date').limit(10).exec(function(err, docs) {
			if (err) return next(err);

			Document.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/documents', {docs: docs, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Document.find({ $text : { $search : post.context.text } } )
			: Document.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, docs) {
				if (err) return next(err);

				if (docs.length > 0) {
					var opts = {
						docs: docs,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/documents/_documents.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};