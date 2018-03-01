var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Event = Model.Event;
	var Member = Model.Member;

	var uploadImages = Params.upload.images;
	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		Member.find().sort('name.value').exec(function(err, members) {
			res.render('admin/events/add.jade', { members: members });
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var event = new Event();

		event._short_id = shortid.generate();
		event.status = post.status;
		event.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		event.age = post.age;
		event.sym = post.sym ? post.sym : undefined;
		event.members = post.members.map(function(group) {
			return {
				mode: group.mode,
				title: [{ 'lg':'ru', 'value': group.title.ru }, { 'lg':'en', 'value': group.title.en }],
				list: group.list
			};
		});

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& event.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 's_title'])
				&& event.setPropertyLocalised('s_title', post[locale].s_title, locale);

			checkNested(post, [locale, 'duration'])
				&& event.setPropertyLocalised('duration', post[locale].duration, locale);

			checkNested(post, [locale, 'place'])
				&& event.setPropertyLocalised('place', post[locale].place, locale);

			checkNested(post, [locale, 'description'])
				&& event.setPropertyLocalised('description', post[locale].description, locale);

		});

		async.series([
			async.apply(uploadImages, event, 'events', null, post.images),
			async.apply(uploadImage, event, 'events', 'poster', 600, files.poster && files.poster[0], null),
		], function(err, results) {
			if (err) return next(err);

			event.save(function(err, event) {
				if (err) return next(err);

				res.redirect('/admin/events');
			});
		});
	};


	return module;
};