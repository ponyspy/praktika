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
				return {'soldout': event.sold_out, 'cost': event.cost, 'show_id': event.show_id,  'date': moment(event.show_start).format('DD.MM.YYYY HH:mm')};
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
					arr.push({'soldout': event.sold_out, 'cost': event.cost, 'show_id': event.show_id, 'event_id': event.event_id, 'date': event_date.format('DD.MM.YYYY HH:mm')});
				}

				return arr;

			}, []);

			res.send(out);
		});
	};


	module.widget = function(req, res, next) {
		var uri = req.app.locals.static_types.intickets_widget_uri;

		res.redirect(uri + '/node/' + req.query.show_id);
	};


	module.mailer = function(req, res, next) {
		console.log(req.body.email);
		return res.send('cool');

		var options_auth = {
			url: req.app.locals.static_types.sendpulse_api_uri + '/oauth/access_token',
			form: {
				'grant_type': 'client_credentials',
				'client_id': req.app.locals.static_types.intickets_api_key,
				'client_secret': req.app.locals.static_types.intickets_origin
			},
			timeout: 6000,
			json: true
		};

		var options_email = {
			url: req.app.locals.static_types.sendpulse_api_uri + '/addressbooks/' + req.app.locals.static_types.sendpulse_adressbook_id + '/emails',
			form: [{
				"email": req.body.email,
				"variables": {
					'Name': req.body.name,
					'Birth': moment().year(req.body.year).month(req.body.month).date(req.body.date).format('YYYY-MM-DD')
				}
			}],
			timeout: 6000,
			json: true
		};

		request.post(options_auth, function(err, resp, body) {
			if (err || body.code) return res.send('err');

			options_email['headers'] = { 'Authorization': 'Bearer ' + body.access_token };

			request.post(options_email, function(err, resp, body) {
				if (err || body.code) return res.send('err');

				console.log('cool');
			});
		});
	}


	return module;
};