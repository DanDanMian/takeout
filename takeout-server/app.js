var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');
var Discount = require('./models/discount');

var dblink = 'mongodb://yesproject:eEUpOflOrVivBDNW@take-out-database-shard-00-00-vzzy7.mongodb.net:27017,take-out-database-shard-00-01-vzzy7.mongodb.net:27017,take-out-database-shard-00-02-vzzy7.mongodb.net:27017/test?ssl=true&replicaSet=Take-Out-Database-shard-0&authSource=admin';
mongoose.connect(dblink, {
	useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

var app = express();
var port = process.env.PORT || 8080;

app.use(session({
	secret: 'take-out-server',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

app.get('/', function(req, res) {
	res.send('Server For Take-Out Application');
});

app.get('/logout', function(req, res) {
	var errname = 'Logout Error: ';
	if (req.session) {
		req.session.destroy(function(err) {
			if (err) {
				console.log(err);
				res.status(400).send(errname + err.message);
			} else {
				res.status(200).send('Logged Out');
			}
		});
	} else {
		res.status(200).send('Account Not Logged In');
	}
});

require('./routes/user_routes')(app);
require('./routes/chef_routes')(app);
require('./routes/admin_routes')(app);

app.listen(port, function() {
	console.log('Server running on port ' + port);
});