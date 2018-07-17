var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		required: true,
		ref: 'User'
	},
	chef: {
		type: Schema.ObjectId,
		required: true,
		ref: 'Chef'
	},
	dishs: [{
		type: Schema.ObjectId,
		ref: 'Dish'
	}],
	discount: {
		type: Schema.ObjectId,
		unique: false,
		ref: 'Discount'
	},
	note: String,
	price: {
		type: Number,
		min: 0,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: 'Created'
	},
	accepted: {
		type: Boolean,
		default: false,
		required: true
	},
	deliveryLocation: {
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
	}
}, {
	timestamps: true
});

var Order = module.exports =
	mongoose.model('Order', OrderSchema);