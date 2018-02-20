var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' +  __app_name);


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: {type: Date, default: Date.now},
});

var eventSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	place: { type: String, trim: true, locale: true },
	duration: { type: String, trim: true, locale: true },
	age: Number,
	poster: { type: String },
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	schedule: [
		{ date: { type: Date } }
	],
	comments: [{
		title: { type: String, trim: true, locale: true },
		photo: { type: String },
		name: { type: String, trim: true, locale: true },
		description: { type: String, trim: true, locale: true },
	}],
	members: [{
		title: { type: String, trim: true, locale: true },
		list: [{ type: ObjectId, ref: 'Member' }],
	}],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: { type: String },
		thumb: { type: String },
		preview: { type: String }
	}],
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var memberSchema = new Schema({
	name: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	photo: { type: String },
	type: { type: String },  // actor, director...
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var announceSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	link: String,
	interval: {
		start: Date,
		end: Date
	},
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

mediaSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	poster: String,
	video: String,
	style: String, // black / white
	interval: {
		start: Date,
		end: Date
	},
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

slideSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	poster: String,
	video: String,
	style: String, // black / white
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});


// ------------------------
// *** Index Block ***
// ------------------------


eventSchema.index({'schedule.date': -1});
eventSchema.index({'title.value': 'text', 's_title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
memberSchema.index({'name.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
announceSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
mediaSchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
slideSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

eventSchema.plugin(mongooseLocale);
memberSchema.plugin(mongooseLocale);
announceSchema.plugin(mongooseLocale);
mediaSchema.plugin(mongooseLocale);
slideSchema.plugin(mongooseLocale);


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.Member = mongoose.model('Member', memberSchema);
module.exports.Announce = mongoose.model('Announce', announceSchema);
module.exports.Media = mongoose.model('Media', mediaSchema);
module.exports.Slide = mongoose.model('Slide', slideSchema);