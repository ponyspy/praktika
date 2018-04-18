var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;


	module.index = function(req, res, next) {
		Partner.find().sort('-date').limit(10).exec(function(err, partners) {
			if (err) return next(err);

			Partner.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/partners', {partners: partners, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Partner.find({ $text : { $search : post.context.text } } )
			: Partner.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, partners) {
				if (err) return next(err);

				if (partners.length > 0) {
					var opts = {
						partners: partners,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/partners/_partners.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};