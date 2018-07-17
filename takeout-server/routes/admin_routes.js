var Account = require('../models/account');
var Admin = require('../models/admin');
var Chef = require('../models/chef');
var Discount = require('../models/discount');
var Dish = require('../models/dish');
var Menu = require('../models/menu');
var Order = require('../models/order');
var User = require('../models/user');


module.exports = function(app) {

	function authenticateAdmin(req, res, next) {
		next();
		/*
		var errname = 'Authentication Error: ';
		if (req.session && req.session.accountID) {
			Admin.findOne({
				account: req.session.accountID
			}, function(err, admin) {
				if (err) {
					console.log(err);
					return res.status(401).send(errname + err.message);
				} else if (!admin) {
					var errmsg = errname + 'Current Logged In Account Is Not An Admin';
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
		}*/
	}

	app.post('/admin/login', function(req, res) {
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
			}
			Admin.findOne({
				account: account._id
			}, function(err, admin) {
				if (err) {
					console.log(err);
					return res.status(401).send(errname + err.message);
				} else if (!admin) {
					var errmsg = errname + 'This Account Is Not Admin';
					console.log(new Error(errmsg));
					return res.status(401).send(errmsg);
				} else {
					req.session.accountID = account._id;
					console.log(admin._id + ' ' + admin.name + ' Login Successfully');
					return res.status(200).send(JSON.stringify(admin));
				}
			});
		});
	});

	app.get('/orders', authenticateAdmin, function(req, res) {
		var errname = 'All Orders Error: ';
		Order.find({}, function(err, orders) {
			if (err) {
				console.log(err);
				return res.status(401).send(errname + err.message);
			} else {
				return res.status(200).send(JSON.stringify(orders));
			}
		});
	});

	app.get('/users', authenticateAdmin, function(req, res) {
		var errname = 'All Users Error: ';
		User.find({}).populate('account').exec( 
		function(err, users) {
			if (err) {
				console.log(err);
				return res.status(401).send(errname + err.message);
			} else {
				return res.status(200).send(JSON.stringify(users));
			}
		});
	});

	app.get('/chefs/all', authenticateAdmin, function(req, res) {
		var errname = 'All Chefs Error: ';
		Chef.find({}).populate('account').exec(
		function(err, chefs) {
			if (err) {
				console.log(err);
				return res.status(401).send(errname + err.message);
			} else {
				return res.status(200).send(JSON.stringify(chefs));
			}
		});
	});

	app.put('/users/:id', authenticateAdmin, function(req, res) {
		var errname = 'Manage User Error: ';
		if (typeof req.body.activated == 'undefined') {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		User.findOne({
			_id: req.params.id
		}).populate('account').exec(
		function(err, user) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!user) {
				var errmsg = errname + 'User Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
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
						account.activated = !account.activated;//req.body.activated;
						account.save(function(err, account) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!account) {
								var errmsg = errname + 'Account Not Found';
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
	});

	app.put('/chefs/:id', authenticateAdmin, function(req, res) {
		var errname = 'Manage Chef Error: ';
		if (typeof req.body.activated == 'undefined') {
			var errmsg = errname + 'Missing Body Parameters';
			console.log(new Error(errmsg));
			return res.status(400).send(errmsg);
		}
		Chef.findOne({
			_id: req.params.id
		}).populate('account').exec(
		function(err, chef) {
			if (err) {
				console.log(err);
				return res.status(400).send(errname + err.message);
			} else if (!chef) {
				var errmsg = errname + 'Chef Not Found';
				console.log(new Error(errmsg));
				return res.status(400).send(errmsg);
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
						account.activated = !account.activated;//req.body.activated;
						account.save(function(err, account) {
							if (err) {
								console.log(err);
								return res.status(400).send(errname + err.message);
							} else if (!account) {
								var errmsg = errname + 'Account Not Found';
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
	});

	app.get('/admin/summary', authenticateAdmin, function(req, res) {
		var errname = 'Admin Summary Error: ';
		Order.find({}, function(err, orders) {
			if (err) {
				console.log(err);
				return res.status(401).send(errname + err.message);
			} else {
				var revenue = 0;
				orders.foreach(function(order) {
					revenue += order.price;
				});
				var result = {
					text: 'Total Revenue: ' + revenue
				};
				return res.status(200).send(JSON.stringify(result));
			}
		});
	});
};



//
//
//
//
//
//
//
//
//
//
//