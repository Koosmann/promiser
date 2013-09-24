///////////////////
// Configuration //
///////////////////

module.exports = function (path, port) {
	rootPath = path.normalize(__dirname + '/..');
	console.log(rootPath);
	
	return {
		development: {
			db: 'mongodb://localhost:27017/promiser',
			root: rootPath,
			host: 'http://localhost:' + port,
			app: {
				name: 'Dev - Promiser'
			},
		},
		staging: {
			db: process.env.MONGOHQ_URL,
			root: rootPath,
			host: process.env.APP_ROOT,
			app: {
				name: 'Stage - Promiser'
			},
		},
		production: {
			db: process.env.MONGOHQ_URL,
			root: rootPath,
			host: process.env.APP_ROOT,
			app: {
				name: 'Promiser'
			},
		},
	}
}