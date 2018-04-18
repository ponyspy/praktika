var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Member = Model.Member;

	var uploadImage = Params.upload.image;
	var uploadImagePreview = Params.upload.image_preview;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		res.render('admin/members/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var member = new Member();

		member._short_id = shortid.generate();
		member.status = post.status;
		member.roles = post.roles;
		member.sym = post.sym ? post.sym : undefined;
		member.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		member.sex = post.sex;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'name'])
				&& member.setPropertyLocalised('name', post[locale].name, locale);

			checkNested(post, [locale, 'description'])
				&& member.setPropertyLocalised('description', post[locale].description, locale);
		});

		uploadImagePreview(member, 'members', 'photo_preview', 200, files.photo && files.photo[0], null, function(err, member) {
			if (err) return next(err);

			uploadImage(member, 'members', 'photo', 500, files.photo && files.photo[0], null, function(err, member) {
				if (err) return next(err);

				member.save(function(err, member) {
					if (err) return next(err);

					res.redirect('/admin/members');
				});
			});
		});
	};


	return module;
};