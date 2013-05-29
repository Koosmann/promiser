////////////
// Routes //
////////////

module.exports = function (app, routes) {

	app.post('/create', routes.createAgreement);

	app.get('/', routes.index);
	app.get('/:id', routes.showAgreement);

}