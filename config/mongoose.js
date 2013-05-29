//////////////
// Database //
//////////////

module.exports = function (mongoose, config) {
	mongoose.connect(config.db);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log('open!');
	});
}