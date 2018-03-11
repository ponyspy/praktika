module.exports = function(Model) {
	var module = {};

	var Document = Model.Document;

	module.index = function(req, res) {
		Document.find().sort('-date').exec(function(err, docs) {
			res.render('main/docs.jade', { docs: docs });
		});
	};

	return module;
};