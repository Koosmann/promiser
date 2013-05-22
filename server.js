/* 

~~ Promier ~~

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
	server = http.createServer(app);

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
	
	res.status(200);
	res.send('success');
});

app.get('/', function (req, res) {
	res.send('Welcome to Promiser!');
});

//////////////////
// Start Server //
//////////////////

server.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, env);
});