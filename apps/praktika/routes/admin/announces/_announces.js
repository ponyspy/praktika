var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale')
};

var announces = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(announces.list.index)
		.post(announces.list.get_list);

	router.route('/add')
		.get(announces.add.index)
		.post(announces.add.form);

	router.route('/edit/:id')
		.get(announces.edit.index)
		.post(announces.edit.form);

	router.route('/remove')
		.post(announces.remove.index);

	return router;
})();