/////////////
// Express //
/////////////

module.exports = function (app, express, config) {

	app.configure(function () {
		
		// Templates
			
		app.set('views', config.root + '/app/views');
		app.set('view engine', 'ejs');
		

		// Other Middleware
		
		app.use(express.favicon());
		app.use(express.bodyParser());
		//app.use(express.methodOverride());
		
		
		// Static Files
		app.use('/assets', express.static(config.root + '/public/assets'));
		app.use(express.static(config.root + '/public'));
		// app.use("/styles", express.static(__dirname + '/styles'));

		// Routing
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
			res.send('500 error');
		});


	});

	app.configure('development', function(){
	  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	  	app.use(express.logger('dev'));
	});

	app.configure('production', function(){
	  	app.use(express.errorHandler());
	});
}