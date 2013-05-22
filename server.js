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

// Environment Configuration
	env = process.env.NODE_ENV || 'development',
	port = process.env.PORT || 3000,

// Express
	express = require('express'),
	app = express(),
	server = http.createServer(app),

// Mandrill
	mandrill = require('node-mandrill')('htx3b7X3BJ3Z2hs-RSOmfg');	

///////////////////
// Configuration //
///////////////////

app.configure(function(){
	
	// Other Middleware
	
	app.use(express.favicon());
	app.use(express.bodyParser());
	//app.use(express.methodOverride());
	
	// Routing
	
	//app.use(express.static(config.root + '/public'));
	app.use(express.cookieParser());
	app.use(express.session({secret: 'keyboard cat' }));
	app.use(app.router);
	/* app.use(function(req, res) {
		
		// Use res.sendFile, as it streams instead of reading the file into memory.
		
		res.type('text/html');
		res.sendfile(config.root + '/public/index.html');
	}); */
	
	// Handle Errors
	app.use(function(err, req, res, next){
		console.log(err);
		res.status(500);
		res.redirect('/error');
	});


});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

////////////
// Routes //
////////////

app.post('/', function (req, res) {
	console.log('incoming email!!!!');
	//console.log(req.body);	
	console.log("req.body.headers.subject: %s", req.body.headers.subject);
	console.log("req.body.headers.Subject: %s", req.body.headers.Subject);
	console.log("req.body.headers.To: %s", req.body.headers.To);
	console.log("req.body.headers.to: %s", req.body.headers.to);
	console.log("req.body.headers.From: %s", req.body.headers.From);
	console.log("req.body.headers.from: %s", req.body.headers.from);
	console.log("req.body.subject: %s", req.body.subject);
	console.log("req.body.Subject: %s", req.body.Subject);
	console.log("req.body.To: %s", req.body.To);
	console.log("req.body.to: %s", req.body.to);
	console.log("req.body.From: %s", req.body.From);
	console.log("req.body.from: %s", req.body.from);
	console.log("req.body.envelope.from: %s", req.body.envelope.from);
	console.log('!!!!!!!!!!!!!!!!');
	
	//send an e-mail to jim rubenstein
	mandrill('/messages/send', {
		message: {
			to: [{email: req.body.headers.Subject}],
			from_email: 'hello@promiser.com',
			subject:  req.body.headers.From + " has sent you a Promise.",
			text: "Do you accept?"
		}
	}, function (error, response) {
		//uh oh, there was an error
		if (error) {
			console.log( JSON.stringify(error));
			res.send('error');
		} else {
			//everything's good, lets see what mandrill said
			console.log(response);
			res.writeHead(200, {'content-type': 'text/plain'})
			res.end('Message Sent. Thanks!\r\n')
		}
	});
});

app.get('/', function (req, res) {
	console.log('homepage!');
	
	res.send('Welcome to Promiser!');
});

//////////////////
// Start Server //
//////////////////

server.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, env);
});