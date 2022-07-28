module.exports = function(Model) {
	var module = {};

	module.index = function(req, res, next) {
		res.render('main/contacts.pug', {'static_keys':req.app.locals.static_keys});
	};

	return module;
};