var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;


	module.index = function(req, res, next) {
		Event.find().sort('-date').limit(10).exec(function(err, events) {
			if (err) return next(err);

			Event.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/events', {events: events, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Event.find({ $text : { $search : post.context.text } } )
			: Event.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, events) {
				if (err) return next(err);

				if (events.length > 0) {
					var opts = {
						events: events,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/events/_events.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};