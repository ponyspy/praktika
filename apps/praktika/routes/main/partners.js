module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;

	module.index = function(req, res) {
		Partner.find().where('status').ne('hidden').sort('-date').exec(function(err, partners) {
			res.render('main/partners.pug', { partners: partners });
		});
	};

	return module;
};