///////////////////
// Configuration //
///////////////////

module.exports = function (path) {
	rootPath = path.normalize(__dirname + '/..');
	
	return {
		development: {
			db: 'mongodb://localhost:27017/promiser',
			root: rootPath,
			app: {
				name: 'Dev - Promiser'
			},
		},
		staging: {
			db: process.env.MONGOHQ_URL,
			root: rootPath,
			app: {
				name: 'Stage - Promiser'
			},
		},
		production: {
			db: '',
			root: rootPath,
			app: {
				name: 'Promiser'
			},
		},
	}
}