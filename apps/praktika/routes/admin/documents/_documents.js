var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var documents = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(documents.list.index)
		.post(documents.list.get_list);

	router.route('/add')
		.get(documents.add.index)
		.post(documents.add.form);

	router.route('/edit/:document_id')
		.get(documents.edit.index)
		.post(documents.edit.form);

	router.route('/remove')
		.post(documents.remove.index);

	return router;
})();