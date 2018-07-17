var Account = require('../models/account');
var Admin = require('../models/admin');
var Chef = require('../models/chef');
var Discount = require('../models/discount');
var Dish = require('../models/dish');
var Menu = require('../models/menu');
var Order = require('../models/order');
var User = require('../models/user');


module.exports = function(app) {

	function authenticateChef(req, res, next) {
		var errname = 'Authentication Error: ';
		if (req.session && req.session.accountID) {
			Chef.findOne({
				account: req.session.accountID
			}, function(err, chef) {
				if (err) {
					console.log(err);
					return res.status(401).send(errname + err.message);
				} else if (!chef) {
					var errmsg = errname + 'Current Logged In Account Is Not An Chef';
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

	app.get('/chef', authenticateChef, function(req, res) {
		var errname = 'Current Chef Error: ';
		Chef.findOne({
			account: req.session.accountID
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				return res.status(200).send(JSON.stringify(chef));
			}
		});
	});

	app.post('/chef/login', function(req, res) {
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
			Chef.findOne({
				account: account._id
			}, function(err, chef) {
				if (err) {
					console.log(err);
					return res.status(401).send(errname + err.message);
				} else if (!chef) {
					var errmsg = errname + 'This Account Is Not Chef';
					console.log(new Error(errmsg));
					return res.status(401).send(errmsg);
				} else {
					req.session.accountID = account._id;
					console.log(chef._id + ' ' + chef.name + ' Login Successfully');
					return res.status(200).send(JSON.stringify(chef));
				}
			});
		});
	});

	app.post('/chef/register', function(req, res) {
		var errname = 'Register Error: ';
		if (!req.body.name ||
			!req.body.username ||
			!req.body.password ||
			!req.body.emailAddress ||
			!req.body.phoneNumber ||
			!req.body.location ||
			!req.body.location.address ||
			!req.body.location.longitude ||
			!req.body.location.latitude ||
			!req.body.storehours ||
			!req.body.storehours.open ||
			!req.body.storehours.close ||
			typeof req.body.storehours.saturday == 'undefined' ||
			typeof req.body.storehours.sunday == 'undefined' ||
			!req.body.profilePhoto ||
			!req.body.licencePhoto ||
			!req.body.cuisineType) {
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
				var chef = new Chef({
					account: account._id,
					name: req.body.name,
					emailAddress: req.body.emailAddress,
					phoneNumber: req.body.phoneNumber,
					location: req.body.location,
					storehours: req.body.storehours,
					profilePhoto: req.body.profilePhoto,
					licencePhoto: req.body.licencePhoto,
					cuisineType: req.body.cuisineType
				});
				if (req.body.description)
					chef.description = req.body.description;
				if (req.body.location)
					chef.location = req.body.location;
				if (req.body.bank)
					chef.bank = req.body.bank;
				chef.save(function(err, chef) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!chef) {
						var errmsg = errname + 'Chef Did Not Create';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						console.log(chef._id + ' ' + chef.name + ' Register Successfully');
						return res.status(200).send(JSON.stringify(chef));
					}
				});
			}
		});
	});

	app.put('/chef', authenticateChef, function(req, res) {
		var errname = 'Update Chef Error: ';
		Chef.findOne({
			account: req.session.accountID
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				if (req.body.name)
					chef.name = req.body.name;
				if (req.body.emailAddress)
					chef.emailAddress = req.body.emailAddress;
				if (req.body.phoneNumber)
					chef.phoneNumber = req.body.phoneNumber;
				if (req.body.location && req.body.location.address &&
					req.body.location.longitude && req.body.location.latitude)
					chef.location = req.body.location;
				if (req.body.storehours && req.body.storehours.open && req.body.storehours.close)
					chef.storehours = req.body.storehours;
				if (req.body.profilePhoto)
					chef.profilePhoto = req.body.profilePhoto;
				if (req.body.licencePhoto)
					chef.licencePhoto = req.body.licencePhoto;
				if (req.body.cuisineType)
					chef.cuisineType = req.body.cuisineType;
				if (req.body.description)
					chef.description = req.body.description;
				if (req.body.location)
					chef.location = req.body.location;
				if (req.body.bank)
					chef.bank = req.body.bank;

				chef.save(function(err, chef) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!chef) {
						var errmsg = errname + 'Chef Did Not Save';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else if (!req.body.password) {
						return res.status(200).send(JSON.stringify(chef));
					} else {
						Account.findOne({
							_id: chef.account
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
										return res.status(200).send(JSON.stringify(chef));
									}
								});
							}
						});
					}
				});
			}
		});
	});

	app.post('/chef/menus', authenticateChef, function(req, res) {
		var errname = 'Create Menu Error: ';
		if (!req.body.name) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		var menu = new Menu({
			name: req.body.name
		});
		if (req.body.description)
			menu.description = req.body.description;
		menu.save(function(err, menu) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!menu) {
				var errmsg = errname + 'Menu Did Not Create';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				Chef.findOne({
					account: req.session.accountID
				}, function(err, chef) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!chef) {
						var errmsg = errname + 'Chef Not Found';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						chef.menus.push(menu._id);
						chef.save(function(err, chef) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!chef) {
								var errmsg = errname + 'Chef Did Not Save';
								console.log(new Error(errmsg));
								return res.status(400).send(errmsg);
							} else {
								return res.status(200).send(JSON.stringify(menu));
							} 
						});
					}
				});
			}
		});
	});

	app.post('/chef/menus/:id/dishs', authenticateChef, function(req, res) {
		var errname = 'Create Dish Error: ';
		if (!req.body.name ||
			!req.body.price ||
			!req.body.photo ||
			!req.body.cuisineType) {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		Chef.findOne({
			account: req.session.accountID
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else if (chef.menus.indexOf(req.params.id) < 0) {
				var errmsg2 = errname + 'Menu Not Belong To Current Chef';
				console.log(new Error(errmsg2));
				return res.status(400).send(errmsg2);
			} else {
				var dish = new Dish({
					name: req.body.name,
					price: req.body.price,
					photo: req.body.photo,
					cuisineType: req.body.cuisineType
				});
				if (req.body.description)
					dish.description = req.body.description;
				if (req.body.cooktime)
					dish.cooktime = req.body.cooktime;
				if (req.body.quantity)
					dish.quantity = req.body.quantity;
				dish.save(function(err, dish) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!dish) {
						var errmsg = errname + 'Dish Did Not Create';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else {
						Menu.findOne({
							_id: req.params.id
						}, function(err, menu) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!menu) {
								var errmsg = errname + 'Menu Not Found';
								console.log(new Error(errmsg));
								return res.status(400).send(errmsg);
							} else {
								menu.dishs.push(dish._id);
								menu.save(function(err, menu) {
									if (err) {
										console.log(err);
										return res.status(400).send(errname + err.message);
									} else if (!menu) {
										var errmsg = errname + 'Menu Did Not Save';
										console.log(new Error(errmsg));
										return res.status(400).send(errmsg);
									} else {
										return res.status(200).send(JSON.stringify(dish));
									} 
								});
							}
						});
					}
				});
			}
		});
	});

	app.get('/chef/orders', authenticateChef, function(req, res) {
		var errname = 'Chef\'s Order Error: ';
		Chef.findOne({
			account: req.session.accountID
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				Order
				.find({chef: chef._id})
				.populate('user chef dishs')
				.exec(function(err, orders) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else {
						return res.status(200).send(JSON.stringify(orders));
					}
				});
			}
		});
	});

	app.put('/chef/orders/:id', authenticateChef, function(req, res) {
		var errname = 'Update Order Error: ';
		if (!req.body.status || typeof req.body.accepted == 'undefined') {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		Chef.findOne({
			account: req.session.accountID
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				Order.findOne({
					_id: req.params.id
				}, function(err, order) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else if (!order) {
						var errmsg = errname + 'Order Not Found';
						console.log(new Error(errmsg));
						return res.status(400).send(errmsg);
					} else if (order.chef.toString() != chef._id.toString()) {
						var errmsg2 = errname + 'Order Not Belong To Current Chef';
						console.log(new Error(errmsg2));
						return res.status(400).send(errmsg2);
					} else {
						order.accepted = req.body.accepted;
						order.status = req.body.status;
						order.save(function(err, order) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!order) {
								var errmsg = errname + 'Order Did Not Save';
								console.log(new Error(errmsg));
								return res.status(400).send(errmsg);
							} else {
								return res.status(200).send(JSON.stringify(order));
							}
						});
					}
				});
			}
		});
	});

	app.get('/chef/summary', authenticateChef, function(req, res) {
		var errname = 'Chef Summary Error: ';
		Chef.findOne({
			account: req.session.accountID
		}, function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth();
				var day = date.getDate();
				Order.find({
				    createdAt: {
				        $gte: ISODate(year+'-'+(month+1)+'-01T00:00:00.000Z'),
				        $lte: ISODate(year+'-'+(month+1)+'-29T00:00:00.000Z')
				    },
				    chef: chef._id
				}, function(err, orders) {
					if (err) {
						console.log(err);
						return res.status(400).send(errname + err.message);
					} else {
						var revenue = 0;
						orders.foreach(function(order) {
							revenue += order.price;
						});
						var result = {
							text: 'Monthly Revenue: ' + revenue + ' Total Revenue: ' + chef.revenue,
							monthlyRevenue: revenue,
							totalRevenue: chef.revenue
						};
						return res.status(200).send(JSON.stringify(result));
					}
				});
			}
		});
	});

	app.get('/menus/:id', authenticateChef, function(req, res) {
		var errname = 'Get Menu: ';
		Menu
		.findOne({_id: req.params.id})
		.populate('dishs')
		.exec(function(err, menu) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!menu) {
				var errmsg = errname + 'Menu Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
			} else {
				return res.status(200).send(JSON.stringify(menu));
			}
		});
	});


};