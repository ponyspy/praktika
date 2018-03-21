module.exports = function(Model) {
	var module = {};

	module.index = function(req, res, next) {
		res.render('main/contacts.jade');
	};

	return module;
};