module.exports = function(Model) {
	var module = {};

	module.index = function(req, res, next) {
		res.render('main/contacts.pug');
	};

	return module;
};