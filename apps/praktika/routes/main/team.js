module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;

	module.index = function(req, res) {
		res.render('main/team.jade');
	};

	module.get_member = function(req, res) {
		res.send('member!');
	};

	return module;
};