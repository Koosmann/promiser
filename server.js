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
	crypto = require('crypto'),
	util = require('util'),

// Environment
	env = process.env.NODE_ENV || 'development',
	port = process.env.PORT || 3000,
	config = require('./config/config')(path, port)[env],

// Express
	express = require('express'),
	app = express(),
	server = http.createServer(app),

// Validator
	check = require('validator').check,

// Piler (Asset Management)
	piler = require('piler'),

// Mongoose
	mongoose = require('mongoose'),

// Models
	Agreement = require('./app/models/agreement')(mongoose),
	EmailLog = require('./app/models/emailLog')(mongoose),

// Mandrill
	mandrill = require('node-mandrill')('htx3b7X3BJ3Z2hs-RSOmfg'),
	email = require('./app/email')(mandrill, EmailLog),

// Async
	async = require('async'),

// BCrypt
	bcrypt = require('bcrypt'),

// Templates
	promises = require('./app/templates/promises')(util),
	emails = require('./app/templates/emails')(util, config, crypto),

// Express Settings
	settings = require('./config/express')(app, express, config, piler, server),

// Controllers
	routes = require('./app/controllers')(config, Agreement, email, bcrypt, crypto, promises, util, emails, check, settings);


///////////////////
// Configuration //
///////////////////

// Routing
require('./config/routes')(app, routes);

// Database -> Mongoose to MongoDB
require('./config/mongoose')(mongoose, config);

//////////////////
// Start Server //
//////////////////

server.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, env);
});