var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var posts = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(posts.list.index)
		.post(posts.list.get_list);

	router.route('/add')
		.get(posts.add.index)
		.post(posts.add.form);

	router.route('/edit/:post_item_id')
		.get(posts.edit.index)
		.post(posts.edit.form);

	router.route('/remove')
		.post(posts.remove.index);

	return router;
})();