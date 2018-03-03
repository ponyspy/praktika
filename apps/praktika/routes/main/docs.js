module.exports = function(Model) {
	var module = {};

	var Document = Model.Document;

	module.index = function(req, res) {
		res.render('main/docs.jade');
	};

	return module;
};