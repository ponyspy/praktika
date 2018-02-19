module.exports.checkNested = function (obj, layers) {
	if (typeof layers == 'string') {
		layers = layers.split('.');
	}

	for (var i = 0; i < layers.length; i++) {
		if (!obj || !Object.hasOwnProperty.call(obj, layers[i])) {
			return false;
		}
		obj = obj[layers[i]];
	}
	return true;
};