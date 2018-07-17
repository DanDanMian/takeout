var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChefSchema = new Schema({
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
	description: String,
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
	rating: {
		stars: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
			required: true
		},
		votes: {
			type: Number,
			min: 0,
			default: 0,
			required: true
		}
	},
	location: {
		address: {
			type: String,
			required: true
		},
		longitude: {
			type: Number,
			required: true
		},
		latitude: {
			type: Number,
			required: true
		}
	},
	storehours: {
		open: {
			type: Number,
			min: 0,
			default: 540,
			required: true
		},
		close: {
			type: Number,
			min: 0,
			default: 1020,
			required: true
		},
		saturday: {
			type: Boolean,
			default: false,
			required: true
		},
		sunday: {
			type: Boolean,
			default: false,
			required: true
		}
	},
	profilePhoto: {
		type: String,
		required: true
	},
	licencePhoto: {
		type: String,
		required: true
	},
	cuisineType: {
		type: String,
		required: true
	},
	menus: [{
		type: Schema.ObjectId,
		ref: 'Menu'
	}],
	paymentRatio: {
		type: Number,
		min: 0.00,
		max: 0.04,
		default: 0.04,
		required: true
	},
	licence: {
		dateIssued: {
			type: Date,
		},
		espDate: {
			type: Date
		},
		placeIssued: {
			type: String
		}
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
	},
	revenue: {
		type: Number,
		min: 0,
		default: 0
	},
	ordernum: {
		type: Number,
		min: 0,
		default: 0
	},
	monthlyRevenue: {
		type: Number,
		min: 0,
		default: 0
	}
}, {
	timestamps: true
});

var Chef = module.exports =
	mongoose.model('Chef', ChefSchema);