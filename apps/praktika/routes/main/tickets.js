var querystring = require('querystring');
var request = require('request');
var moment = require('moment');


module.exports = function() {
	var module = {};

	module.event = function(req, res, next) {
		var query = querystring.stringify({
			session: req.app.locals.static_types.pn_token,
			alias: req.body.alias
		});

		request.get('https://api.cultserv.ru/v4/subevents/actual/get?' + query, { timeout: 2500, json: true }, function(err, resp, body) {
			if (err || body.code != 1) return res.send('err');

			var out = body.message.map(function(event) {
				return moment(event.date).format('DD.MM.YYYY HH:mm');
			});

			res.send(out);
		});
	};

	module.schedule = function(req, res, next) {
		var query = querystring.stringify({
			session: req.app.locals.static_types.pn_token,
			min_date: req.body.min,
			max_date: req.body.max,
			venue_id: req.app.locals.static_types.pn_venue_id,
			fields: 'subevents,seo'
		});

		request.get('https://api.cultserv.ru/v4/events/list?' + query, { timeout: 2500, json: true }, function(err, resp, body) {
			if (err || body.code != 1) return res.send('err');

			var out = body.message.reduce(function(arr, current) {
				if (!current.eticket_possible) return 'e_none';

				var dates = current.subevents.map(function(subevent) {
					return moment(subevent.date).format('DD.MM.YYYY HH:mm');
				});

				return arr.concat(dates);

			}, []);

			res.send(out);
		});
	};

	module.widget = function(req, res, next) {
		var query = req.query;
		var ref = req.app.locals.static_types.pn_ref;

		res.render('main/_widget.jade', { ref: ref, alias: query.alias, date: query.date, time: query.time });
	};

	return module;
};