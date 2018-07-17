var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DishSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: String,
	price: {
		type: Number,
		min: 0,
		required: true
	},
	photo: {
		type: String,
		required: true
	},
	cuisineType: {
		type: String,
		required: true
	},
	cooktime: {
		type: Number,
		min: 0
	},
	quantity: {
		type: Number,
		min: 0
	}
}, {
	timestamps: true
});

var Dish = module.exports =
	mongoose.model('Dish', DishSchema);