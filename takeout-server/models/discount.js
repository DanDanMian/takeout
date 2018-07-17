var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscountSchema = new Schema({
	codestring: {
		type: String,
		required: true,
		unique: true
	},
	discountRate: {
		type: Number,
		min: 0,
		required: true
	},
	beenUsed: {
		type: Boolean,
		default: false,
		required: true
	}
}, {
	timestamps: true
});

var Discount = module.exports =
	mongoose.model('Discount', DiscountSchema);