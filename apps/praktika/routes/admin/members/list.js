var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;


	module.index = function(req, res, next) {
		Member.find().sort('-date').limit(10).exec(function(err, members) {
			if (err) return next(err);

			Member.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/members', {members: members, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Member.find({ $text : { $search : post.context.text } } )
			: Member.find();

		if (post.context.type && post.context.type != 'all') {
			Query.where('type').equals(post.context.type);
		}

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, members) {
				if (err) return next(err);

				if (members.length > 0) {
					var opts = {
						members: members,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/views/admin/members/_members.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};