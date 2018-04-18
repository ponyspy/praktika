module.exports = function(Model) {
	var module = {};

	var Document = Model.Document;

	module.index = function(req, res) {
		Document.find().where('status').ne('hidden').sort('-date').exec(function(err, docs) {
			res.render('main/docs.pug', { docs: docs });
		});
	};

	return module;
};