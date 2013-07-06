///////////////////
// Configuration //
///////////////////

module.exports = function (path, port) {
	rootPath = path.normalize(__dirname + '/..');
	
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
			db: '',
			root: rootPath,
			host: rootPath,
			app: {
				name: 'Promiser'
			},
		},
	}
}