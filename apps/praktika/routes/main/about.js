module.exports = function(Model) {
	var module = {};

	var Slide = Model.Slide;

	module.index = function(req, res) {
		Slide.find().sort('date').exec(function(err, slides) {
			res.render('main/about.jade', { slides: slides });
		});
	};

	return module;
};