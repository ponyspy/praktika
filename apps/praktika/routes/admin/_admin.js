var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });

var admin = {
	main: require('./main.js'),
	events: require('./events/_events.js'),
	announces: require('./announces/_announces.js'),
	medias: require('./medias/_medias.js'),
	documents: require('./documents/_documents.js'),
	slides: require('./slides/_slides.js'),
	members: require('./members/_members.js'),
	partners: require('./partners/_partners.js'),
	cv: require('./cv.js'),
	users: require('./users/_users.js'),
	options: require('./options.js')
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.route('/').get(checkAuth, admin.main.index);

	router.route('/cv')
		.get(checkAuth, admin.cv.edit)
		.post(checkAuth, admin.cv.edit_form);

	router.use('/events', checkAuth, upload.fields([ { name: 'poster' }, { name: 'poster_hover' } ]), admin.events);
	router.use('/medias', checkAuth, upload.fields([ { name: 'poster' }, { name: 'video' } ]), admin.medias);
	router.use('/documents', checkAuth, upload.fields([ { name: 'attach' } ]), admin.documents);
	router.use('/slides', checkAuth, upload.fields([ { name: 'poster' }, { name: 'video' } ]), admin.slides);
	router.use('/announces', checkAuth, admin.announces);
	router.use('/members', checkAuth, upload.fields([ { name: 'photo' } ]), admin.members);
	router.use('/partners', checkAuth, upload.fields([ { name: 'logo' } ]), admin.partners);
	router.use('/users', checkAuth, admin.users);

	router.post('/preview', checkAuth, upload.single('image'), admin.options.preview);

	return router;
})();