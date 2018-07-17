var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	account: {
		type: Schema.ObjectId,
		required: true,
		unique: true,
		ref: 'Account'
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	phoneNumber: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	homeLocation: {
		address: String,
		longitude: Number,
		latitude: Number
	},
	workLocation: {
		address: String,
		longitude: Number,
		latitude: Number
	},
	points: {
		type: Number,
		default: 0,
		min: 0,
		required: true
	},
	bank: {
		bankName: {
			type: String
		},
		institution: {
			type: String
		},
		Branch: {
			type: String
		},
		Acccount: {
			type: String
		}
	}
}, {
	timestamps: true
});

var User = module.exports =
	mongoose.model('User', UserSchema);