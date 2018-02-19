var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var slides = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(slides.list.index)
		.post(slides.list.get_list);

	router.route('/add')
		.get(slides.add.index)
		.post(slides.add.form);

	router.route('/edit/:publication_id')
		.get(slides.edit.index)
		.post(slides.edit.form);

	router.route('/remove')
		.post(slides.remove.index);

	return router;
})();