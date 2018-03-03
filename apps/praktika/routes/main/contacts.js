var fs = require('fs');

module.exports = function(Model) {
	var module = {};

	module.index = function(req, res, next) {
		fs.readFile(__app_root + '/static/link.html', function(err, content) {
			if (err) return next(err);

			res.render('main/contacts.jade', { content: content });
		});
	};

	return module;
};