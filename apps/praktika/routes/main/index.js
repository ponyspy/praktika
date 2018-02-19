module.exports = function(Model) {
	var module = {};

	var Work = Model.Work;

	module.index = function(req, res) {
		Work.aggregate()
				.match({'images.main': true})
				.unwind('images')
				.group({
					'_id': null,
					'images': {
						$push: {
							$cond: {
								if: {  '$eq': ['$images.main', true] },
								then: '$images.thumb',
								else: false
							}
						}
					}
				})
				.project({
					'_id': 0,
					'images': { $setDifference: ['$images', [false]] }
				})
				.exec(function(err, result) {
					var result = result && result[0] && result[0].images || [];

					res.render('main/index.jade', { posters: result });
				});
	};

	return module;
};