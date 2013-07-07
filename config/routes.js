////////////
// Routes //
////////////

module.exports = function (app, routes) {

	app.post('/create', routes.createAgreement);
	app.get('/:id/validate', routes.verifyInitiator);
	app.get('/:id/confirm/:hash', routes.confirmAgreement);

	app.get('/', routes.index);
	app.get('/:id', routes.showAgreement);

}