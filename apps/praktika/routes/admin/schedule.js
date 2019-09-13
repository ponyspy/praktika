var querystring = require('querystring');
var request = require('request');
var moment = require('moment');

var Model = require(__glob_root + '/models/main.js');

var Event = Model.Event;


module.exports.event = function(req, res) {
	var query = querystring.stringify({
		event_id: req.body.alias
	});

	var options = {
		url: req.app.locals.static_keys.intickets_api_uri + '?' + query,
		headers: {
			'Authorization': req.app.locals.static_keys.intickets_api_key,
			'Origin': req.app.locals.static_keys.intickets_origin
		},
		timeout: 6000,
		json: true
	};

	request.get(options, function(err, resp, body) {
		if (err) return res.send('err');

		var out = body.map(function(event) {
			return moment(event.show_start).format('DD.MM.YYYY HH:mm');
		});

		Event.findById(req.body.event_id).exec(function(err, event) {
			if (err) return res.send('err');

			var ext = event.schedule.filter(function(e_item) {
				return e_item.link;
			});

			event.schedule = out.map(function(item) {
				var event_date = event.schedule.filter(function(e_item) {
					return moment(e_item.date).format('DD.MM.YYYY HH:mm') == item;
				})[0];

				return {
					date: moment(item, 'DD.MM.YYYY HH:mm').toDate(),
					premiere: event_date ? event_date.premiere : false
				};
			});

			event.schedule = ext.concat(event.schedule).sort(function(a, b) {
				return a.date - b.date;
			});

			event.save(function(err) {
				res.send('ok');
			});
		});
	});
};