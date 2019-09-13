module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.index = function(req, res) {
		Partner.aggregate([
			{ $match: { 'status': {
				$nin: ['hidden', 'special']
			}}},
			{ $sort: { 'date': -1 } },
			{ $group: {
				_id: '$type',
				partners: {
					$push: '$$ROOT'
			}}},
			{ $project: {
				_id: 0,
				'type': '$_id',
				'partners': '$partners'
			}}
		]).exec(function(err, types) {
			var actual_types = req.app.locals.static_types.partners_types;

			types.sort(function(a, b) {
				return actual_types.indexOf(a.type) - actual_types.indexOf(b.type);
			});

			res.render('main/partners.pug', { types: types, get_locale: get_locale, locale: req.locale });
		});
	};

	return module;
};