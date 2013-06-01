////////////
// Routes //
////////////

module.exports = function (app, routes) {

	app.post('/create', routes.createAgreement);
	app.get('/confirm/:id', routes.confirmAgreement);

	app.get('/', routes.index);
	app.get('/:id', routes.showAgreement);

}