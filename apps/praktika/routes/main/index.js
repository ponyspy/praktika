module.exports = function(Model) {
	var module = {};

	var Media = Model.Media;

	module.index = function(req, res) {
		res.render('main/index.jade');
	};

	return module;
};