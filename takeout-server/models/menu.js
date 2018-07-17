var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: String,
	dishs: [{
		type: Schema.ObjectId,
		ref: 'Dish'
	}]
}, {
	timestamps: true
});

var Menu = module.exports =
	mongoose.model('Menu', MenuSchema);