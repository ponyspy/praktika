var querystring = require('querystring');
var request = require('request');
var moment = require('moment');

var Model = require(__glob_root + '/models/main.js');

var Event = Model.Event;


module.exports.event = function(req, res) {
	var query = querystring.stringify({
		session: req.app.locals.static_types.pn_token,
		alias: req.body.alias
	});

	request.get('https://api.cultserv.ru/v4/subevents/actual/get?' + query, { timeout: 2500, json: true }, function(err, resp, body) {
		if (err || body.code != 1) return res.send('err');

		var out = body.message.map(function(event) {
			return moment(event.date).format('DD.MM.YYYY HH:mm');
		}).sort();

		Event.findById(req.body.event_id).exec(function(err, event) {
			if (err) return res.send('err');

			event.schedule = out.map(function(item) {
				var event_date = event.schedule.filter(function(e_item) {
					return moment(e_item.date).format('DD.MM.YYYY HH:mm') == item
				})[0];

				return {
					date: moment(item, 'DD.MM.YYYY HH:mm').toDate(),
					premiere: event_date ? event_date.premiere : false
				}
			});

			event.save(function(err) {
				res.send('ok');
			});
		});
	});
};