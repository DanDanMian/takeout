var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var AccountSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	activated: {
		type: Boolean,
		required: true,
		default: true
	},
	platform: {
		type: String,
		trim: true
	}
}, {
	timestamps: true
});

AccountSchema.pre('save', function(next) {
	var account = this;
	bcrypt.hash(account.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		account.password = hash;
		next();
	});
});

AccountSchema.statics.authenticate = function(username, password, cb) {
	Account.findOne({
		username: username
	}, function(err, account) {
		if (err) {
			return cb(err);
		} else if (!account) {
			return cb(new Error('User Does Not Exist'));
		}
		bcrypt.compare(password, account.password, function(err, result) {
			if (err) {
				return cb(err);
			} else if (result === true) {
				return cb(null, account);
			} else {
				return cb();
			}
		});
	});
};

var Account = module.exports =
	mongoose.model('Account', AccountSchema);