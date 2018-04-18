var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Announce = Model.Announce;


	module.index = function(req, res, next) {
		Announce.find().sort('-date').limit(10).exec(function(err, announces) {
			if (err) return next(err);

			Announce.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/announces', {announces: announces, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Announce.find({ $text : { $search : post.context.text } } )
			: Announce.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, announces) {
				if (err) return next(err);

				if (announces.length > 0) {
					var opts = {
						announces: announces,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/announces/_list.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};