module.exports = function(Model) {
	var module = {};

	var Sldie = Model.Slide;

	module.index = function(req, res) {
		res.render('main/about.jade');
	};

	return module;
};