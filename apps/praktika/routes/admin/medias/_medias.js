var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var medias = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(medias.list.index)
		.post(medias.list.get_list);

	router.route('/add')
		.get(medias.add.index)
		.post(medias.add.form);

	router.route('/edit/:publication_id')
		.get(medias.edit.index)
		.post(medias.edit.form);

	router.route('/remove')
		.post(medias.remove.index);

	return router;
})();