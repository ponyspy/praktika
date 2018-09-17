var gm = require('gm').subClass({ imageMagick: true });
var rimraf = require('rimraf');
var mime = require('mime');


exports.dump = function(req, res) {
	res.sendFile('dump.tar', {root: __glob_root});
};

module.exports.preview = function(req, res) {
	var file = req.file;
	var newPath = '/preview/' + Date.now() + '.' + mime.getExtension(file.mimetype);

	gm(file.path).size({ bufferStream: true }, function(err, size) {

		this.resize(size.width > 1920 ? 1920 : false, false);
		this.write('/var/praktika/public' + newPath, function (err) {

			rimraf(file.path, { glob: false }, function() {
				res.send(newPath);
			});
		});
	});
};