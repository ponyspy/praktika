var fs = require('fs');
var async = require('async');

exports.edit = function(req, res) {
	async.series({
		link: function(callback) {
			fs.readFile(__app_root + '/static/link.html', callback);
		},
		cv_ru: function(callback) {
			fs.readFile(__app_root + '/static/cv_ru.html', callback);
		},
		cv_en: function(callback) {
			fs.readFile(__app_root + '/static/cv_en.html', callback);
		},
		desc_ru: function(callback) {
			fs.readFile(__app_root + '/static/desc_ru.html', callback);
		},
		desc_en: function(callback) {
			fs.readFile(__app_root + '/static/desc_en.html', callback);
		},
		adress_ru: function(callback) {
			fs.readFile(__app_root + '/static/adress_ru.html', callback);
		},
		adress_en: function(callback) {
			fs.readFile(__app_root + '/static/adress_en.html', callback);
		}
	}, function(err, results) {
		res.render('admin/cv.jade', { content: results });
	});
};

exports.edit_form = function(req, res) {
	var post = req.body;

	async.series({
		link: function(callback) {
			if (!post.link) return callback(null);

			fs.writeFile(__app_root + '/static/link.html', post.link, callback);
		},
		cv_ru: function(callback) {
			if (!post.cv.ru) return callback(null);

			fs.writeFile(__app_root + '/static/cv_ru.html', post.cv.ru, callback);
		},
		cv_en: function(callback) {
			if (!post.cv.en) return callback(null);

			fs.writeFile(__app_root + '/static/cv_en.html', post.cv.en, callback);
		},
		desc_ru: function(callback) {
			if (!post.desc.ru) return callback(null);

			fs.writeFile(__app_root + '/static/desc_ru.html', post.desc.ru, callback);
		},
		desc_en: function(callback) {
			if (!post.desc.en) return callback(null);

			fs.writeFile(__app_root + '/static/desc_en.html', post.desc.en, callback);
		},
		adress_ru: function(callback) {
			if (!post.adress.ru) return callback(null);

			fs.writeFile(__app_root + '/static/adress_ru.html', post.adress.ru, callback);
		},
		adress_en: function(callback) {
			if (!post.adress.en) return callback(null);

			fs.writeFile(__app_root + '/static/adress_en.html', post.adress.en, callback);
		}
	}, function(err, results) {
		res.redirect('back');
	});
};