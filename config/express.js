/////////////
// Express //
/////////////

module.exports = function (app, express, config, piler, server) {
	var clientJs = piler.createJSManager(),
		clientCss = piler.createCSSManager();

	clientJs.bind(app, server);
	clientCss.bind(app, server);

	app.configure(function () {
		
		// Templates
			
		app.set('views', config.root + '/app/views');
		app.set('view engine', 'ejs');
		

		// Other Middleware
		
		app.use(express.favicon());
		app.use(express.bodyParser());
		//app.use(express.methodOverride());

		// Asset Management

        //<link rel="stylesheet" href="/assets/css/normalize.css">
        //<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css">
        //<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css">
        //<link rel="stylesheet" href="/assets/css/main.css">

    	// CSS
    	clientCss.addUrl("//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css");
    	clientCss.addUrl("//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css");
		clientCss.addFile(config.root + "/public/assets/css/normalize.css");
    	clientCss.addFile(config.root + "/public/assets/css/main.css");


        //<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>        
        //<script src="http://documentcloud.github.io/underscore/underscore-min.js"></script>
        //<script src="/assets/js/plugins.js"></script>
        //<script src="/assets/js/main.js"></script>

        //<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.5/angular.min.js"></script>
        //<script src="/assets/js/app.js"></script>
        //<script src="/assets/js/controllers.js"></script>
        //<script src="/assets/js/directives.js"></script>
        //<script src="/assets/js/filters.js"></script>

        /*<script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-44233777-1', 'promiserapp.com');
          ga('send', 'pageview');
        </script>*/

	    // JS
	    clientJs.addUrl("http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.js");
	    clientJs.addUrl("http://documentcloud.github.io/underscore/underscore-min.js");
	    clientJs.addUrl("//cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.5/angular.min.js");
	    clientJs.addFile(config.root + "/public/assets/js/plugins.js");
	    clientJs.addFile(config.root + "/public/assets/js/main.js");
	    clientJs.addFile(config.root + "/public/assets/js/app.js");
	    clientJs.addFile(config.root + "/public/assets/js/controllers.js");
	    clientJs.addFile(config.root + "/public/assets/js/directives.js");
	    clientJs.addFile(config.root + "/public/assets/js/filters.js");
	    		
		// Static Files
		app.use('/assets', express.static(config.root + '/public/assets'));
		//app.use(express.static(config.root + '/public'));
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

	app.configure('staging', function(){
	  	app.use(express.errorHandler());

	  	var googleAnalytics = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');\
\
          ga('create', 'UA-44233777-1', 'promiserapp.com');\
          ga('send', 'pageview');"

	  	clientJs.addRaw(googleAnalytics);
	});

	/* app.configure('production', function(){
	  	app.use(express.errorHandler());

	  	var googleAnalytics = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');\
\
          ga('create', 'UA-44233777-1', 'promiserapp.com');\
          ga('send', 'pageview');"

	  	clientJs.addRaw(googleAnalytics);
	}); */

	return {
		clientCss: clientCss,
		clientJs: clientJs
	}
}