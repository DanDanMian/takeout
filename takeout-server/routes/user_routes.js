var Account = require('../models/account');
var Admin = require('../models/admin');
var Chef = require('../models/chef');
var Discount = require('../models/discount');
var Dish = require('../models/dish');
var Menu = require('../models/menu');
var Order = require('../models/order');
var User = require('../models/user');


module.exports = function(app) {

	function authenticateUser(req, res, next) {
		var errname = 'Authentication Error: ';
		if (req.session && req.session.accountID) {
			User.findOne({
				account: req.session.accountID
			}, function(err, user) {
				if (err) {
					console.log(err);
					return res.status(401).send(errname + err.message);
				} else if (!user) {
					var errmsg = errname + 'Current Logged In Account Is Not An User';
					console.log(new Error(errmsg));
					return res.status(401).send(errmsg);
				} else {
					return next();
				}
			});
		} else {
			var errmsg = errname + 'You Are Not Logged In';
			console.log(new Error(errmsg));
			return res.status(401).send(errmsg);
		}
	}

	app.get('/user', authenticateUser, function(req, res) {
		var errname = 'Current User Error: ';
		User.findOne({
			account: req.session.accountID
		}, function(err, user) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!user) {
				var errmsg = errname + 'User Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				return res.status(200).send(JSON.stringify(user));
			}
		});
	});

	app.post('/user/login', function(req, res) {
		var errname = 'Login Error: ';
		if (!req.body.username || !req.body.password) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		Account.authenticate(req.body.username, req.body.password, function(err, account) {
			if (err) {
				console.log(err);
				return res.status(401).send(errname + err.message);
			} else if (!account) {
				var errmsg = errname + 'Wrong Username or Password';
				console.log(new Error(errmsg));
				return res.status(401).send(errmsg);
			} else if (!account.activated) {
				var errmsg2 = errname + 'Account Disactivated. Please Contact Support.';
				console.log(new Error(errmsg2));
				return res.status(401).send(errmsg2);
			}
			User.findOne({
				account: account._id
			}, function(err, user) {
				if (err) {
					console.log(err);
					return res.status(401).send(errname + err.message);
				} else if (!user) {
					var errmsg = errname + 'This Account Is Not User';
					console.log(new Error(errmsg));
					return res.status(401).send(errmsg);
				} else {
					req.session.accountID = account._id;
					console.log(user._id + ' ' + user.name + ' Login Successfully');
					return res.status(200).send(JSON.stringify(user));
				}
			});
		});
	});

	app.post('/user/register', function(req, res) {
		var errname = 'Register Error: ';
		if (!req.body.name ||
			!req.body.username ||
			!req.body.password ||
			!req.body.emailAddress ||
			!req.body.phoneNumber) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}

		var account = new Account({
			username: req.body.username,
			password: req.body.password
		});
		if (req.body.platform)
			account.platform = req.body.platform;
		account.save(function(err, account) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!account) {
				var errmsg = errname + 'Account Did Not Create';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				var user = new User({
					account: account._id,
					name: req.body.name,
					emailAddress: req.body.emailAddress,
					phoneNumber: req.body.phoneNumber
				});
				if (req.body.bank)
					user.bank = req.body.bank;
				user.save(function(err, user) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!user) {
						var errmsg = errname + 'User Did Not Create';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						console.log(user._id + ' ' + user.name + ' Register Successfully');
						return res.status(200).send(JSON.stringify(user));
					}
				});
			}
		});
	});

	app.put('/user', authenticateUser, function(req, res) {
		var errname = 'Update User Error: ';
		User.findOne({
			account: req.session.accountID
		}, function(err, user) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!user) {
				var errmsg = errname + 'User Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				if (req.body.name)
					user.name = req.body.name;
				if (req.body.emailAddress)
					user.emailAddress = req.body.emailAddress;
				if (req.body.phoneNumber)
					user.phoneNumber = req.body.phoneNumber;
				if (req.body.homeLocation && req.body.homeLocation.address &&
					req.body.homeLocation.longitude && req.body.homeLocation.latitude)
					user.homeLocation = req.body.homeLocation;
				if (req.body.workLocation && req.body.workLocation.address &&
					req.body.workLocation.longitude && req.body.workLocation.latitude)
					user.workLocation = req.body.workLocation;
				if (req.body.bank)
					user.bank = req.body.bank;
				user.save(function(err, user) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!user) {
						var errmsg = errname + 'User Did Not Save';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else if (!req.body.password) {
						return res.status(200).send(JSON.stringify(user));
					} else {
						Account.findOne({
							_id: user.account
						}, function(err, account) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!account) {
								var errmsg = errname + 'Account Not Found';
								console.log(new Error(errmsg));
								return res.status(400).send(errmsg);
							} else {
								account.password = req.body.password;
								account.save(function(err, account) {
									if (err) {
										console.log(err);
										return res.status(400).send(errname + err.message);
									} else if (!account) {
										var errmsg = errname + 'Account Did Not Save';
										console.log(new Error(errmsg));
										return res.status(400).send(errmsg);
									} else {
										return res.status(200).send(JSON.stringify(user));
									}
								});
							}
						});
					}
				});
			}
		});
	});

	app.get('/chefs', authenticateUser, function(req, res) {
		var errname = 'Get Chef: ';
		var query = {};
		if (req.query.type) {
			query.cuisineType = req.query.type;
		}
		Chef.find(query, function(err, chefs) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chefs) {
				var errmsg = errname + 'Chefs Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				return res.status(200).send(JSON.stringify(chefs));
			}
		});
	});

	app.get('/chefs/:id/menus', function(req, res) {
		var errname = 'Get Menus: ';
		Chef.findOne({
			_id: req.params.id
		}).populate({
			path: 'menus',
			populate: {
				path: 'dishs'
			}
		}).exec(function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				return res.status(200).send(JSON.stringify(chef.menus));
			}
		});
	});

	app.post('/orders', authenticateUser, function(req, res) {
		var errname = 'Create Order: ';
		if (!req.body.userid ||
			!req.body.chefid ||
			!req.body.dishs ||
			!req.body.price ||
			!req.body.location ||
			!req.body.location.address ||
			!req.body.location.longitude ||
			!req.body.location.latitude) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		} else if (req.body.dishs.length === 0) {
			var errmsg2 = errname + 'Cannot Create Empty Order';
			console.log(new Error(errmsg2));
			return res.status(400).send(errmsg2);
		}
		var order = new Order({
			user: req.body.userid,
			chef: req.body.chefid,
			dishs: req.body.dishs,
			price: req.body.price,
			deliveryLocation: req.body.location
		});
		if (req.body.discountid)
			order.discount = req.body.discountid;
		if (req.body.note)
			order.note = req.body.note;
		order.save(function(err, order) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!order) {
				var errmsg = errname + 'Order Did Not Create';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				//res.status(200).send(JSON.stringify(order));

				Chef.findOne({
					_id: req.body.chefid
				}, function(err, chef) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!chef) {
						var errmsg = errname + 'Chef Not Found';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						//return res.status(200).send(JSON.stringify(chef));
						if (chef.ordernum)
							chef.ordernum = chef.ordernum + 1;
						else
							chef.ordernum = 1;
						if (chef.revenue)
							chef.revenue = chef.revenue + req.body.price;
						else 
							chef.revenue = req.body.price;
						chef.save(function(err, chef) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!chef) {
								var errmsg = errname + 'Chef Did Not Save';
								console.log(new Error(errmsg));
								return res.status(400).send(errmsg);
							} else {
								//return res.status(200).send(JSON.stringify(order));
								Order
								.findOne({_id: order._id})
								.populate('user chef dishs')
								.exec(function(err, order) {
									if (err) {
										console.log(err);
										return res.status(400).send(errname + err.message);
									} else {
										return res.status(200).send(JSON.stringify(order));
									}
								});

							}
						});

					}
				});

			}
		});
	});

	app.put('/discounts', authenticateUser, function(req, res) {
		var errname = 'Claim Discount: ';
		if (!req.body.codestring) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		Discount.findOne({
			codestring: req.body.codestring
		}, function(err, discount) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!discount) {
				var errmsg = errname + 'Discount Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else if (discount.beenUsed) {
				var errmsg2 = errname + 'Discount Already Used';
				console.log(new Error(errmsg2));
				return res.status(400).send(errmsg2);
			} else {
				discount.beenUsed = true;
				discount.save(function(err, discount) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!discount) {
						var errmsg = errname + 'Discount Did Not Save';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						return res.status(200).send(JSON.stringify(discount));
					}
				});
			}
		});
	});

	app.put('/chefs/:id/rate', authenticateUser, function(req, res) {
		var errname = 'Rate Chef: ';
		if (!req.body.rate) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		} else if (typeof req.body.rate != 'number') {
			var errmsg2 = errname + 'Rate Should Be A Number';
			console.log(new Error(errmsg2));
			return res.status(400).send(errmsg2);
		} else if (req.body.rate > 5 || req.body.rate < 0) {
			var errmsg3 = errname + 'Rate Should Between 0 - 5';
			console.log(new Error(errmsg3));
			return res.status(400).send(errmsg3);
		}
		Chef.findOne({
			_id: req.params.id
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				var totalstars = chef.rating.stars * chef.rating.votes;
				totalstars += req.body.rate;
				chef.rating.votes++;
				chef.rating.stars = totalstars / chef.rating.votes;
				chef.save(function(err, chef) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!chef) {
						var errmsg = errname + 'Chef Did Not Save';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						return res.status(200).send(JSON.stringify(chef));
					}
				});
			}
		});
	});
};