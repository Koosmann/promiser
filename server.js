/* 

~~ Promiser ~~

*/

//////////////////
// Dependencies //
//////////////////

// NodeJS Utilities
var	https = require('https'),
	http = require("http"),
	url = require('url'),
	path = require('path'),

// Environment
	env = process.env.NODE_ENV || 'development',
	port = process.env.PORT || 3000,
	config = require('./config/config')(path, port)[env],

// Express
	express = require('express'),
	app = express(),
	server = http.createServer(app),

// Mongoose
	mongoose = require('mongoose'),

// Mandrill
	mandrill = require('node-mandrill')('htx3b7X3BJ3Z2hs-RSOmfg'),
	email = require('./app/email')(mandrill);

// Models
	Agreement = require('./app/models/Agreement')(mongoose),

// Controllers
	routes = require('./app/controllers')(config, Agreement, email),


///////////////////
// Configuration //
///////////////////

// Express Settings
require('./config/express')(app, express, config);

// Routing
require('./config/routes')(app, routes);


/////////////////////////
// Database Connection //
/////////////////////////

// Mongoose to MongoDB
require('./config/mongoose')(mongoose, config);


//////////////////
// Start Server //
//////////////////

server.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, env);
});