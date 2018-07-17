var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
	account: {
		type: Schema.ObjectId,
		required: true,
		unique: true,
		ref: 'Account'
	},
	name: {
		type: String,
		required: true,
		default: 'Admin'
	},
	description: String
}, {
	timestamps: true
});

var Admin = module.exports =
	mongoose.model('Admin', AdminSchema);