module.exports = function(Model) {
	var module = {};

	module.index = function(req, res, next) {
		res.render('main/contacts.pug', {'static_types':req.app.locals.static_types});
	};

	return module;
};