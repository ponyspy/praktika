var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var cheerio = require('cheerio');
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var public_path = '/var/praktika/public';
var preview_path = '/var/praktika/public/preview/';


module.exports.file = function(obj, base_path, field_name, file, del_file, callback) {
	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name].replace(/pdf|zip/, '*'), { glob: true });
		obj[field_name] = undefined;
	}

	if (del_file || !file) return callback.call(null, null, obj);

	var file_path = '/cdn/' + base_path + '/' + obj._id + '/files';
	var file_name = field_name + '.' + mime.getExtension(file.mimetype);

	rimraf(public_path + file_path + '/' + field_name + '.*', { glob: true }, function() {
		mkdirp(public_path + file_path, function() {
			fs.rename(file.path, public_path + file_path + '/' + file_name, function(err) {
				obj[field_name] = file_path + '/' + file_name;

				rimraf(file.path, { glob: false }, function() {
					callback.call(null, null, obj);
				});
			});
		});
	});
};

module.exports.image_content = function(article, post, name, locale, callback) {
	if (!locale) return callback(null, article);

	var file_path = '/cdn/' + name + '/' + article._id.toString() + '/images/content';

	rimraf(file_path, { glob: true }, function(rm_path) {
		$ = cheerio.load(post[locale].description, { decodeEntities: false });
		var images = $('img').toArray();

		async.each(images, function(image, callback) {
			var $this = $(image);
			var file_name = path.basename($this.attr('src'));

			$this.removeAttr('width').removeAttr('height').removeAttr('alt');
			$this.attr('src', file_path + '/' + file_name);

			mkdirp(public_path + file_path, function() {
				fs.createReadStream(preview_path + file_name).pipe(fs.createWriteStream(public_path + file_path + '/' + file_name));
				callback();
			});
		}, function() {
				article.setPropertyLocalised('description', $('body').html(), locale);
				callback(null, article);
		});
	});
};

module.exports.image_content_preview = function(article, locale, callback) {
	if (!article.i18n.description.get(locale)) return callback(null, article);

	$ = cheerio.load(article.i18n.description.get(locale), { decodeEntities: false });
	var images = $('img').toArray();

	async.each(images, function(image, callback) {
		var $this = $(image);

		var file_path = $this.attr('src');
		var file_name = path.basename(file_path);

		fs.createReadStream(public_path + file_path).pipe(fs.createWriteStream(preview_path + file_name));

		$this.attr('src', '/preview/' + file_name);

		callback();
	}, function() {
			article.setPropertyLocalised('description', $('body').html(), locale);
			callback(null, article);
	});
};

module.exports.image_preview = function(obj, base_path, field_name, file_size, file, del_file, callback) {

	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name].replace(/jpg|png/, '*'), { glob: true });
		obj[field_name] = undefined;
	}

	if (del_file || !file) return callback.call(null, null, obj);

	var file_path = '/cdn/' + base_path + '/' + obj._id + '/images';

	rimraf(public_path + file_path + '/' + field_name + '.*', { glob: true }, function() {
		mkdirp(public_path + file_path, function() {
			if (/jpeg|png|gif/.test(mime.getExtension(file.mimetype))) {
				gm(file.path).identify({ bufferStream: true }, function(err, meta) {
					var file_name = field_name + '.' + mime.getExtension(file.mimetype);

					this.resize(meta.size.width > file_size ? file_size : false, false);
					this.quality(meta.size.width >= file_size ? 82 : 100);
					this.write(public_path + file_path + '/' + file_name, function(err) {
						obj[field_name] = file_path + '/' + file_name;

						callback.call(null, null, obj);
					});
				});
			} else {
				callback.call(null, null, obj);
			}
		});
	});
};

module.exports.image = function(obj, base_path, field_name, file_size, file, del_file, callback) {

	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name].replace(/jpg|png/, '*'), { glob: true });
		obj[field_name] = undefined;
	}

	if (del_file || !file) return callback.call(null, null, obj);

	var file_path = '/cdn/' + base_path + '/' + obj._id + '/images';

	rimraf(public_path + file_path + '/' + field_name + '.*', { glob: true }, function() {
		mkdirp(public_path + file_path, function() {
			if (/jpeg|png|gif/.test(mime.getExtension(file.mimetype))) {
				gm(file.path).identify({ bufferStream: true }, function(err, meta) {
					var file_name = field_name + '.' + mime.getExtension(file.mimetype);

					this.resize(meta.size.width > file_size ? file_size : false, false);
					this.quality(meta.size.width >= file_size ? 82 : 100);
					this.write(public_path + file_path + '/' + file_name, function(err) {
						obj[field_name] = file_path + '/' + file_name;

						rimraf(file.path, { glob: false }, function() {
							callback.call(null, null, obj);
						});
					});
				});
			} else {
				callback.call(null, null, obj);
			}
		});
	});
};

module.exports.images = function(obj, base_path, hold, upload_images, callback) {
	if (hold) return callback.call(null, null, obj);

	obj.images = [];
	var images = [];


	var file_path = '/cdn/' + base_path + '/' + obj._id + '/images';

	var images_path = {
		original: file_path + '/original/',
		thumb: file_path + '/thumb/',
		preview: file_path + '/preview/'
	};

	var map_paths = Object.values(images_path).map(function(path) { return public_path + path; });

	rimraf('{' + map_paths.join(',') + '}', { glob: true }, function(err, paths) {

		if (!upload_images) return callback.call(null, null, obj);

		async.concatSeries(map_paths, mkdirp, function(err, dirs) {

			async.eachOfSeries(upload_images.path, function(item, i, callback) {
				images[i] = { path: null, description: [] };
				images[i].path = upload_images.path[i];
				images[i].style = upload_images.style[i];
				images[i].holder = upload_images.holder[i];

				images[i].description.push({ lg: 'ru', value: upload_images.description.ru[i] });
				if (upload_images.description.en) {
					images[i].description.push({ lg: 'en', value: upload_images.description.en[i] });
				}

				callback();

			}, function() {

				async.eachSeries(images, function(image, callback) {
					var name = path.basename(image.path);

					var original_path = images_path.original + name;
					var thumb_path = images_path.thumb + name;
					var preview_path = images_path.preview + name;

					gm(public_path + image.path).write(public_path + original_path, function(err) {
						gm(public_path + image.path).resize(420, false).quality(80).write(public_path + preview_path, function(err) {
							gm(public_path + image.path).size({ bufferStream: true }, function(err, size) {
								this.resize(size.width > 1920 ? 1920 : false, false);
								this.quality(size.width >= 1920 ? 80 : 100);
								this.write(public_path + thumb_path, function(err) {
									var obj_img = {};

									obj_img.original = original_path;
									obj_img.thumb = thumb_path;
									obj_img.preview = preview_path;

									obj_img.description = image.description;
									obj_img.style = image.style;
									obj_img.holder = image.holder;

									obj.images.push(obj_img);

									callback();
								});
							});
						});
					});
				}, function() {
					callback.call(null, null, obj);
				});

			});

		});
	});
};

module.exports.preview = function(images, callback) {

	async.mapSeries(images, function(image, callback) {
		var image_path = public_path + image.original;
		var image_name = path.basename(image.original);

		fs.createReadStream(image_path).pipe(fs.createWriteStream(preview_path + image_name));

		callback(null, '/preview/' + image_name);
	}, function(err, results) {
		callback.call(null, null, results);
	});
};

module.exports.files_upload = function(obj, base_path, field_name, post, files, callback) {
	if (files.attach && files.attach.length > 0) {
		async.forEachOfSeries(files.attach, function(file, i, callback) {
			var file_path = '/cdn/' + base_path + '/' + obj._id + '/files';
			var file_name = Date.now() + '.' + mime.getExtension(file.mimetype);

			mkdirp(public_path + file_path, function() {
				fs.rename(file.path, public_path + file_path + '/' + file_name, function() {
					var description = [];

					description.push({ lg: 'ru', value: post.attach_desc.ru[i] });
					if (post.attach_desc.en) {
						description.push({ lg: 'en', value: post.attach_desc.en[i] });
					}

					obj[field_name].push({
						path: file_path + '/' + file_name,
						description: description
					});
					callback();
				});
			});
		}, function() {
			callback(null, 'files_upload');
		});
	} else {
		callback(null, false);
	}
};

module.exports.files_delete = function(obj, field_name, post, files, callback) {
	if (post.files_delete && post.files_delete.length > 0) {
		async.eachSeries(post.files_delete, function(path, callback) {
			rimraf(public_path + path, { glob: false }, function() {
				var num = obj[field_name].map(function(e) { return e.path; }).indexOf(path);
				obj[field_name].splice(num, 1);
				obj.markModified(field_name);
				callback();
			});
		}, function() {
			callback(null, 'files_delete');
		});
	} else {
		callback(null, false);
	}
};