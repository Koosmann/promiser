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

// Cron Jobs
	cron = require('cron').CronJob,
	reminders = require('./app/jobs/cronJobs')(cron, Agreement, email, async, util, emails);

///////////////////
// Configuration //
///////////////////


// Database -> Mongoose to MongoDB
require('./config/mongoose')(mongoose, config);