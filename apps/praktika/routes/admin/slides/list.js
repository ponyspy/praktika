var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Slide = Model.Slide;


	module.index = function(req, res, next) {
		Slide.find().sort('date').limit(10).exec(function(err, slides) {
			if (err) return next(err);

			Slide.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/slides', {slides: slides, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Slide.find({ $text : { $search : post.context.text } } )
			: Slide.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, slides) {
				if (err) return next(err);

				if (slides.length > 0) {
					var opts = {
						slides: slides,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/slides/_list.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};