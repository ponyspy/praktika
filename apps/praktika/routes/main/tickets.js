var querystring = require('querystring');
var request = require('request');
var moment = require('moment');


module.exports = function() {
	var module = {};


	module.event = function(req, res, next) {
		var query = querystring.stringify({
			event_id: req.body.alias
		});

		var options = {
			url: req.app.locals.static_types.intickets_api_uri + '?' + query,
			headers: {
				'Authorization': req.app.locals.static_types.intickets_api_key,
				'Origin': req.app.locals.static_types.intickets_origin
			},
			timeout: 6000,
			json: true
		};

		request.get(options, function(err, resp, body) {
			if (err || body.message) return res.send('err');

			var out = body.map(function(event) {
				return {'show_id': event.show_id,  'date': moment(event.show_start).format('DD.MM.YYYY HH:mm')};
			});

			res.send(out);
		});
	};


	module.schedule = function(req, res, next) {
		var options = {
			url: req.app.locals.static_types.intickets_api_uri,
			headers: {
				'Authorization': req.app.locals.static_types.intickets_api_key,
				'Origin': req.app.locals.static_types.intickets_origin
			},
			timeout: 6000,
			json: true
		};

		request.get(options, function(err, resp, body) {
			if (err || body.message) return res.send('err');

			var out = body.reduce(function(arr, event) {
				var event_date = moment(event.show_start);

				if (event_date.isBetween(req.body.min, req.body.max, 'minutes', '[]')) {
					arr.push({'show_id': event.show_id, 'date': event_date.format('DD.MM.YYYY HH:mm')});
				}

				return arr;

			}, []);

			res.send(out);
		});
	};


	module.widget = function(req, res, next) {
		var query = req.query;
		var uri = req.app.locals.static_types.intickets_widget_uri;

		res.redirect(uri + '/' + query.show_id);
	};

	return module;
};