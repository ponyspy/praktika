module.exports = function(Model) {
	var module = {};

	var Slide = Model.Slide;

	module.index = function(req, res) {
		Slide.find().where('status').ne('hidden').sort('date').exec(function(err, slides) {
			res.render('main/about.pug', { slides: slides });
		});
	};

	return module;
};