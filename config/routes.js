////////////
// Routes //
////////////

module.exports = function (app, routes) {

	app.post('/create', routes.createAgreement);

	app.get('/:id/validate', routes.verifyInitiator);
	app.get('/:id/cancel', routes.cancelAgreement);

	app.get('/:id/confirm/:hash', routes.confirmAgreement);
	app.get('/:id/reject/:hash', routes.rejectAgreement);

	app.get('/:id/fulfill/:hash', routes.fulfillAgreement);

	app.get('/', routes.index);
	app.get('/:id', routes.showAgreement);

}