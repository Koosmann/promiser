///////////
// Index //
///////////
	
module.exports = function (config, Agreement, email, bcrypt, crypto, promises, util, emails, check, settings) {
	
	function getDistinctAgreementCount(callback) {
		Agreement.distinct('initiatorEmail', {confirmationStatus:'confirmed'}, function (err, results) {
			if (err) console.log("AGREEMENT COUNT ERROR - %s", err);

			callback(results.length);
		});
	}

	function send404(res) {
		var message = {};

		message.status = "negative";
		message.headline = "Not found :(";
		message.message = "We're sorry, we couldn't find anything!";

		res.send(message, 404);
	}

	function render404(res) {
		var data = {};
		data.css = settings.clientCss.renderTags();
		data.js = settings.clientJs.renderTags();

		data.status = "negative";
		data.headline = "Not found :(";
		data.message = "We're sorry, we couldn't find anything!";

		getDistinctAgreementCount(function (count) {
			data.count = count;
			res.render('message', {data: data});
		});
	}

	function send500(res) {
		var message = {};

		message.status = "negative";
		message.headline = "Agh, something went wrong!";
		message.message = "We're not quite sure what, but it was something!";

		res.send(message, 500);
	}

	function render500(res) {
		var data = {};
		data.css = settings.clientCss.renderTags();
		data.js = settings.clientJs.renderTags();

		data.status = "negative";
		data.headline = "Agh, something went wrong!";
		data.message = "We're not quite sure what, but it was something!";

		getDistinctAgreementCount(function (count) {
			data.count = count;
			res.render('message', {data: data});
		});
	}

	return {
		//////////////
		// Homepage //
		//////////////

		index: function (req, res) {
			console.log('homepage!');

			var data = {};
			data.css = settings.clientCss.renderTags();
			data.js = settings.clientJs.renderTags();

			getDistinctAgreementCount(function (count) {
				data.count = count;
				res.render('index', {data: data});
			});
		},

		////////////////////
		// Show Agreement //
		////////////////////

		showAgreement: function (req, res) {
			console.log('show agreement!');

			var data = {};
			data.id = req.params.id;
			data.css = settings.clientCss.renderTags();
			data.js = settings.clientJs.renderTags();

			Agreement.findById(req.params.id, function (err, agreement){
				if (agreement && agreement.confirmationStatus != 'pending' && agreement.confirmationStatus != 'unverified' && agreement.confirmationStatus != 'cancelled' && agreement.confirmationStatus != 'rejected') {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");

					var now = new Date();
					console.log("DATE COMPARISON");
					console.dir(now);
					console.dir(agreement.dueDate);
					if (agreement.dueDate < now) agreement.confirmationStatus = 'overdue';

					data.agreement = JSON.stringify(agreement);

					console.dir(data);

					getDistinctAgreementCount(function (count) {
						data.count = count;
						res.render('agreement', {data: data});
					});
				} else {
					if (err) {
						console.log("-------------------");
						console.log("Error! >> " + err);
						console.log("-------------------");						
					} 

					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					render404(res);
				}
			});

		},

		//////////////////////
		// Create Agreement //
		//////////////////////

		createAgreement: function (req, res) {
			console.log(req.body);

			try {
			    check(req.body.initiatorFirstName).notNull();
			    check(req.body.initiatorLastName).notNull();
			    check(req.body.initiatorEmail).notNull().isEmail();
			    check(req.body.recipientFirstName).notNull();
			    check(req.body.recipientLastName).notNull();
			    check(req.body.recipientEmail).notNull().isEmail();
			    check(req.body.type).notNull();

			    switch (req.body.type) {
					case 'payment':
						check(req.body.amount).isInt().notNull();
						break;
					case 'product':
						check(req.body.item).notNull();
						break;
					case 'service':
						check(req.body.service).notNull();
						break;
					case 'appointment':
						check(req.body.activity).notNull();
						break;
				}

				check(req.body.dueDaysFromNow).isInt().min(1).notNull();

			} catch (e) {
				send500(res);
			    console.log(e.message); //Invalid integer
			    return;
			}

			var agreement = new Agreement(),
				dueDate = new Date();
				  
			agreement.initiatorFirstName = req.body.initiatorFirstName;
			agreement.initiatorLastName = req.body.initiatorLastName;
			agreement.initiatorEmail = req.body.initiatorEmail;

			agreement.recipientFirstName = req.body.recipientFirstName;
			agreement.recipientLastName = req.body.recipientLastName;
			agreement.recipientEmail = req.body.recipientEmail;

			switch (req.body.type) {
				case 'payment':
					agreement.amount = req.body.amount;
					break;
				case 'product':
					agreement.item = req.body.item;
					break;
				case 'service':
					agreement.service = req.body.service;
					break;
				case 'appointment':
					agreement.activity = req.body.activity;
					break;
			}

			agreement.type = req.body.type;
			agreement.creationDate = new Date();
			
			dueDate.setDate(dueDate.getDate() + parseInt(req.body.dueDaysFromNow, 10));
			//agreement.dueDaysFromNow = parseInt(req.body.dueDaysFromNow, 10);
			agreement.dueDate = dueDate;
			agreement.salt = bcrypt.genSaltSync(10);

			console.dir(agreement);
		
			agreement.save(function (err) {		
				if (err) {
					console.log("-------------------");
					console.log("Error creating agreement! >> " + err);
					console.log("-------------------");
					
					return send500(res);
				}
				
				console.log("------------------");
				console.log("Agreement created!");
				console.log("------------------");
				
				// Need to some sort of preview/verifification for initiator

				var subject = 'Please verify your email & confirm your promise to ' + agreement.recipientFirstName, 
					text = 'Click here to confirm: ' + config.root + '/confirm/' + agreement._id,
					html = emails.verification(agreement);

				var message = {};
			
				email.send([{email: agreement.initiatorEmail, name: agreement.initiatorFirstName + " " + agreement.initiatorLastName }], 'hello@promiser.com', subject, text, html, function (err, response){
					if (err) {
						console.log("-------------------");
						console.log("Error! >> " + err);
						console.log("-------------------");

						return send500(res);						
					} else {
						console.log("------------------------");
						console.log("Verification Email Sent!");
						console.log("------------------------");

						message.status = "positive";
						message.headline = "Promise created.";
						message.message = "Check your email for the link to verify this promise.";

						res.send(message, 200);
					}

				});

			});
			
			// When testing the front-end, comment out 'save' above and use the commented sectino below for the response
			/*var message = {};
			
			message.status = "positive";
			message.headline = "Promise created.";
			message.message = "Check your email for the link to verify this promise.";

			res.send(message, 200); */
		},

		////////////////////////
		// Validate Initiator //
		////////////////////////

		verifyInitiator: function (req, res) {

			Agreement.findById(req.params.id, function (err, agreement){
				if (err) {
					console.log("-------------------");
					console.log("Error! >> " + err);
					console.log("-------------------");						
				} 

				if (agreement) {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");
			
					// Send confirmation to recipient

					switch (agreement.confirmationStatus) {
						case 'unverified':
							
							agreement.confirmationStatus = 'pending';
							agreement.verificationDate = new Date();

							agreement.save(function (err) {		
								if (err) {
									console.log("-------------------");
									console.log("Error saving agreement! >> " + err);
									console.log("-------------------");
									
									return render500(res);
								}
								
								var subject = util.format('%s %s has sent you a promise', agreement.initiatorFirstName, agreement.initiatorLastName),
									text = 'Click here to accept: ' + config.root + '/confirm/' + agreement._id,
									html = emails.confirmation(agreement);  
								
								email.send([{email: agreement.recipientEmail, name: agreement.recipientFirstName + " " + agreement.recipientLastName}], 'hello@promiser.com', subject, text, html, function (err, response){
									if (err) {
										console.log("-------------------");
										console.log("Error! >> " + err);
										console.log("-------------------");

										return render500(res);						
									} else {
										console.log("------------------------");
										console.log("Confirmation Email Sent!");
										console.log("------------------------");

										var data = {};
										data.css = settings.clientCss.renderTags();
										data.js = settings.clientJs.renderTags();

										data.status = "positive";
										data.headline = "Promise sent.";
										data.message = "We've sent your promise off to " + agreement.recipientFirstName + " for confirmation.";

										getDistinctAgreementCount(function (count) {
											data.count = count;
											res.render('message', {data: data});
										});
									}

								});
							});
							break;
						case 'cancelled':
							console.log("-------------------");
							console.log("Agreement already cancelled.");
							console.log("-------------------");

							var data = {};
							data.css = settings.clientCss.renderTags();
							data.js = settings.clientJs.renderTags();

							data.status = "negative";
							data.headline = "Promise already cancelled.";
							data.message = "This agreement was already cancelled.  Maybe make a new one?";

							getDistinctAgreementCount(function (count) {
								data.count = count;
								res.render('message', {data: data});
							});
							break;
						case 'pending':
							console.log("-------------------");
							console.log("Agreement already verified.");
							console.log("-------------------");

							var data = {};
							data.css = settings.clientCss.renderTags();
							data.js = settings.clientJs.renderTags();

							data.status = "positive";
							data.headline = "Promise sent.";
							data.message = "Don't worry, we already sent your promise off to " + agreement.recipientFirstName + " for confirmation!";

							getDistinctAgreementCount(function (count) {
								data.count = count;
								res.render('message', {data: data});
							});
							break;
						case 'rejected':
							console.log("-------------------");
							console.log("Agreement already rejected.");
							console.log("-------------------");

							var data = {};
							data.css = settings.clientCss.renderTags();
							data.js = settings.clientJs.renderTags();

							data.status = "negative";
							data.headline = "Promise not accepted :(";
							data.message = "Sorry, this promise wasn't accepted. Maybe make a new one?";

							getDistinctAgreementCount(function (count) {
								data.count = count;
								res.render('message', {data: data});
							});
							break;
						default:
							console.log("-------------------");
							console.log("Show agreement.");
							console.log("-------------------");

							res.redirect("/" + agreement._id);
							break;
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					render404(res);
				}
			});
		},

		//////////////////////
		// Cancel Agreement //
		//////////////////////

		cancelAgreement: function (req, res) {
			
			// Set confirmation status & store confirmation date

			Agreement.findById(req.params.id, function (err, agreement){
				if (err) {
					console.log("-------------------");
					console.log("Error! >> " + err);
					console.log("-------------------");						
				} 

				if (agreement) {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");
			
					// Send confirmation to recipient

					switch (agreement.confirmationStatus) {
						case 'unverified':
						
							agreement.confirmationStatus = 'cancelled';

							agreement.save(function (err) {		
								if (err) {
									console.log("-------------------");
									console.log("Error saving agreement! >> " + err);
									console.log("-------------------");
									
									return render500(res);
								}
								
								var data = {};

								data.status = "negative";
								data.headline = "Promise cancelled.";
								data.message = "We've cancelled your promise to " + agreement.recipientFirstName + ".";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
							});
							break;
						case 'pending':
							console.log("-------------------");
							console.log("Agreement already verified!");
							console.log("-------------------");

							var data = {};
							data.css = settings.clientCss.renderTags();
							data.js = settings.clientJs.renderTags();

							data.status = "positive";
							data.headline = "Promise sent.";
							data.message = "You already confirmed your promise!";

							getDistinctAgreementCount(function (count) {
								data.count = count;
								res.render('message', {data: data});
							});
							break;
						case 'cancelled':
							console.log("-------------------");
							console.log("Agreement already cancelled.");
							console.log("-------------------");

							var data = {};
							data.css = settings.clientCss.renderTags();
							data.js = settings.clientJs.renderTags();

							data.status = "negative";
							data.headline = "Promise already cancelled.";
							data.message = "This agreement was already cancelled.  Maybe make a new one?";

							getDistinctAgreementCount(function (count) {
								data.count = count;
								res.render('message', {data: data});
							});
							break;
						case 'rejected':
							console.log("-------------------");
							console.log("Agreement already rejected.");
							console.log("-------------------");

							var data = {};
							data.css = settings.clientCss.renderTags();
							data.js = settings.clientJs.renderTags();

							data.status = "negative";
							data.headline = "Promise not accepted :(";
							data.message = "Sorry, this promise wasn't accepted. Maybe make a new one?";

							getDistinctAgreementCount(function (count) {
								data.count = count;
								res.render('message', {data: data});
							});
							break;
						default:
							console.log("-------------------");
							console.log("Show agreement.");
							console.log("-------------------");

							res.redirect('/' + agreement._id);
							break;
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					render404(res);
				}

			});
		},

		///////////////////////
		// Confirm Agreement //
		///////////////////////

		confirmAgreement: function (req, res) {
			
			// Set confirmation status & store confirmation date

			Agreement.findById(req.params.id, function (err, agreement){
				if (err) {
					console.log("-------------------");
					console.log("Error! >> " + err);
					console.log("-------------------");						
				} 

				
				if (agreement) {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");

					// Verify sender

					if (req.params.hash == crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex')) {
						// Ensure the agreement is active and not confirmed already
						
						switch (agreement.confirmationStatus) {
							case 'pending' :
								console.log("--------------------");
								console.log("Agreement confirmed!");
								console.log("--------------------");

								agreement.confirmationStatus = 'confirmed';
								agreement.confirmationDate = new Date();

								agreement.save(function (err) {		
									if (err) {
										console.log("-------------------");
										console.log("Error saving agreement! >> " + err);
										console.log("-------------------");
										
										return render500(res);
									}

									var initiatorSubject = 'Promise to ' + agreement.recipientFirstName + ' confirmed!',
										recipientSubject = 'Promise from ' + agreement.initiatorFirstName + ' confirmed!',
										text = 'This promise, ' + config.host + '/' + agreement._id + ', has been confirmed and needs to be fulfilled by: ' + agreement.dueDate,
										initiatorHtml = emails.receipt.toInitiator(agreement),
										recipientHtml = emails.receipt.toRecipient(agreement);

									email.send([{email: agreement.recipientEmail, name: agreement.recipientFirstName + " " + agreement.recipientLastName}], 'hello@promiser.com', recipientSubject, text, recipientHtml, function (err, response){
										if (err) {
											console.log("-------------------");
											console.log("Error! >> " + err);
											console.log("-------------------");

											return render500(res);						
										} else {
											console.log("-------------");
											console.log("Receipt Sent!");
											console.log("-------------");
										}

									});

									email.send([{email: agreement.initiatorEmail, name: agreement.initiatorFirstName + " " + agreement.initiatorLastName }], 'hello@promiser.com', initiatorSubject, text, initiatorHtml, function (err, response){
										if (err) {
											console.log("-------------------");
											console.log("Error! >> " + err);
											console.log("-------------------");

											return render500(res);						
										} else {
											console.log("-------------");
											console.log("Receipt Sent!");
											console.log("-------------");

											var data = {};
											data.css = settings.clientCss.renderTags();
											data.js = settings.clientJs.renderTags();

											data.status = "positive";
											data.headline = "Promise accepted.";
											data.message = "We've notified " + agreement.initiatorFirstName + " and sent you an email that has a link to confirm when this promise is fulfilled.";

											getDistinctAgreementCount(function (count) {
												data.count = count;
												res.render('message', {data: data});
											});
										}

									});
								});
								break;
							case 'rejected' :
								console.log("----------------------------");
								console.log("Agreement already rejected!");
								console.log("----------------------------");

								// Load promise page

								var data = {};
								data.css = settings.clientCss.renderTags();
								data.js = settings.clientJs.renderTags();

								data.status = "negative";
								data.headline = "Promise rejected :(";
								data.message = "You already rejected this promise!  Maybe make a better one?";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
								break;
							case 'confirmed' :
								console.log("----------------------------");
								console.log("Agreement already confirmed!");
								console.log("----------------------------");

								// Load promise page

								var data = {};
								data.css = settings.clientCss.renderTags();
								data.js = settings.clientJs.renderTags();

								data.status = "positive";
								data.headline = "Promise confirmed.";
								data.message = "You already confirmed this promise!";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
								break;
							case 'fulfilled' :
								console.log("----------------------------");
								console.log("Agreement already fulfilled!");
								console.log("----------------------------");

								// Load promise page

								res.redirect('/' + agreement._id);
								break;
							default :
								console.log("-------------------");
								console.log("This is an error :(");
								console.log("-------------------");

								render500(res);
								break;
						} 
					} else {
						console.log("-------------------");
						console.log("Unverified link :(");
						console.log("-------------------");
						
						render404(res);
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					render404(res);
				}

			});
		},

		//////////////////////
		// Reject Agreement //
		//////////////////////

		rejectAgreement: function (req, res) {
			
			// Set confirmation status & store confirmation date

			Agreement.findById(req.params.id, function (err, agreement){
				if (err) {
					console.log("-------------------");
					console.log("Error! >> " + err);
					console.log("-------------------");						
				} 

				if (agreement) {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");

					// Verify sender

					if (req.params.hash == crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex')) {
						// Ensure the agreement is active and not confirmed already
						
						switch (agreement.confirmationStatus) {
							case 'pending' :
								console.log("--------------------");
								console.log("Agreement rejected!");
								console.log("--------------------");

								agreement.confirmationStatus = 'rejected';

								agreement.save(function (err) {		
									if (err) {
										console.log("-------------------");
										console.log("Error saving agreement! >> " + err);
										console.log("-------------------");
										
										return render500(res);
									}

									var data = {};
									data.css = settings.clientCss.renderTags();
									data.js = settings.clientJs.renderTags();

									data.status = "negative";
									data.headline = "Promise rejected :(";
									data.message = "This must not have been a very good promise!  Maybe make a better one?";

									getDistinctAgreementCount(function (count) {
										data.count = count;
										res.render('message', {data: data});
									});
								});
								break;
							case 'rejected' :
								console.log("----------------------------");
								console.log("Agreement already rejected!");
								console.log("----------------------------");

								// Load promise page

								var data = {};
								data.css = settings.clientCss.renderTags();
								data.js = settings.clientJs.renderTags();

								data.status = "negative";
								data.headline = "Promise rejected :(";
								data.message = "You already rejected this promise!  Maybe make a better one?";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
								break;
							case 'confirmed' :
								console.log("----------------------------");
								console.log("Agreement already confirmed!");
								console.log("----------------------------");

								// Load promise page

								var data = {};
								data.css = settings.clientCss.renderTags();
								data.js = settings.clientJs.renderTags();

								data.status = "positive";
								data.headline = "Promise confirmed.";
								data.message = "You already confirmed this promise!";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
								break;
							case 'fulfilled' :
								console.log("----------------------------");
								console.log("Agreement already fulfilled!");
								console.log("----------------------------");

								// Load promise page

								res.redirect('/' + agreement._id);
								break;
							default :
								console.log("-------------------");
								console.log("This is an error :(");
								console.log("-------------------");

								render500(res);
								break;
						} 
					} else {
						console.log("-------------------");
						console.log("Unverified link :(");
						console.log("-------------------");
						
						render404(res);
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					render404(res);
				}

			});
		},

		///////////////////////
		// Fulfill Agreement //
		///////////////////////

		fulfillAgreement: function (req, res) {
			
			// Set confirmation status & store confirmation date

			Agreement.findById(req.params.id, function (err, agreement){
				if (err) {
					console.log("-------------------");
					console.log("Error! >> " + err);
					console.log("-------------------");						
				} 

				if (agreement) {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");

					// Verify sender

					if (req.params.hash == crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex')) {
						// Ensure the agreement is active and not confirmed already
						
						switch (agreement.confirmationStatus) {
							case 'confirmed' :
								console.log("--------------------");
								console.log("Agreement fulfilled!");
								console.log("--------------------");

								agreement.confirmationStatus = 'fulfilled';
								agreement.fulfillmentDate = new Date();

								agreement.save(function (err) {		
									if (err) {
										console.log("-------------------");
										console.log("Error saving agreement! >> " + err);
										console.log("-------------------");
										
										return render500(res);
									}

									var subject = agreement.recipientFirstName + " marked your promise as fulfilled!",
										text = agreement.recipientFirstName + " marked your promise as fulfilled!",
										html = emails.fulfillment.toInitiator(agreement);

									email.send([{email: agreement.initiatorEmail, name: agreement.initiatorFirstName + " " + agreement.initiatorLastName }], 'hello@promiser.com', subject, text, html, function (err, response){
										if (err) {
											console.log("-------------------");
											console.log("Error! >> " + err);
											console.log("-------------------");

											return render500(res);						
										} else {
											console.log("-------------");
											console.log("Fulfillment email Sent!");
											console.log("-------------");

											var data = {};
											data.css = settings.clientCss.renderTags();
											data.js = settings.clientJs.renderTags();

											data.status = "positive";
											data.headline = "Promise fulfilled :)";
											data.message = "Awesome - be sure to give " + agreement.initiatorFirstName + " a pat on the back for us!";

											getDistinctAgreementCount(function (count) {
												data.count = count;
												res.render('message', {data: data});
											});
										}

									});
								});
								break;
							case 'rejected' :
								console.log("----------------------------");
								console.log("Agreement already rejected!");
								console.log("----------------------------");

								// Load promise page

								var data = {};
								data.css = settings.clientCss.renderTags();
								data.js = settings.clientJs.renderTags();

								data.status = "negative";
								data.headline = "Promise rejected :(";
								data.message = "You already rejected this promise!";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
								break;
							case 'fulfilled' :
								console.log("----------------------------");
								console.log("Agreement already fulfilled!");
								console.log("----------------------------");

								var data = {};
								data.css = settings.clientCss.renderTags();
								data.js = settings.clientJs.renderTags();

								data.status = "positive";
								data.headline = "Promise already fulfilled!";
								data.message = "It's still awesome though!  Maybe make a new promise?";

								getDistinctAgreementCount(function (count) {
									data.count = count;
									res.render('message', {data: data});
								});
								break;
							default :
								console.log("-------------------");
								console.log("This is an error :(");
								console.log("-------------------");

								render500(res);
								break;
						} 
					} else {
						console.log("-------------------");
						console.log("Unverified link :(");
						console.log("-------------------");
						
						render404(res);
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					render404(res);
				}

			});
		},	
	}
}