///////////
// Index //
///////////
	
module.exports = function (config, Agreement, email, reminders, bcrypt, crypto, promises, util, emails) {
	
	return {
		//////////////
		// Homepage //
		//////////////

		index: function (req, res) {
			console.log('homepage!');

			var data = {};

			Agreement.distinct('initiatorEmail', {confirmationStatus:'confirmed'}, function (err, results) {
				if (err) console.log("AGREEMENT COUNT ERROR - %s", err);

				data.count = results.length;

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

			Agreement.findById(req.params.id, function (err, agreement){
				if (agreement && agreement.confirmationStatus != 'unverified') {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");

					data.agreement = JSON.stringify(agreement);

					Agreement.distinct('initiatorEmail', {confirmationStatus:'confirmed'}, function (err, results) {
						if (err) console.log("AGREEMENT COUNT ERROR - %s", err);

						data.count = results.length;

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

					res.send("404 not found :(", 404);
				}
			});

		},

		//////////////////////
		// Create Agreement //
		//////////////////////

		createAgreement: function (req, res) {
			console.log(req.body);

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
			}

			agreement.type = req.body.type;
			
			dueDate.setDate(dueDate.getDate() + parseInt(req.body.dueDaysFromNow, 10));
			agreement.dueDaysFromNow = parseInt(req.body.dueDaysFromNow, 10);
			agreement.dueDate = dueDate;
			agreement.salt = bcrypt.genSaltSync(10);

			console.dir(agreement);
		
			agreement.save(function (err) {		
				if (err) {
					console.log("-------------------");
					console.log("Error creating agreement! >> " + err);
					console.log("-------------------");
					
					return res.send('null');
				}
				
				console.log("------------------");
				console.log("Agreement created!");
				console.log("------------------");
				
				// Need to some sort of preview/verifification for initiator

				var subject = 'Please verify your email & confirm your promise', 
					text = 'Click here to confirm: ' + config.root + '/confirm/' + agreement._id,
					html = emails.verification(agreement); 
			
				email.send([{email: agreement.initiatorEmail, name: agreement.initiatorFirstName + " " + agreement.initiatorLastName }], 'hello@promiser.com', subject, text, html, function (err, response){
					if (err) {
						console.log("-------------------");
						console.log("Error! >> " + err);
						console.log("-------------------");

						res.send('failure');						
					} else {
						console.log("------------------------");
						console.log("Verification Email Sent!");
						console.log("------------------------");

						res.send('success');
					}

				});

			});
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

					if (agreement.confirmationStatus == 'unverified') {
						
						agreement.confirmationStatus = 'pending';

						agreement.save(function (err) {		
							if (err) {
								console.log("-------------------");
								console.log("Error saving agreement! >> " + err);
								console.log("-------------------");
								
								return res.send('null');
							}
							
							var subject = util.format('%s %s has sent you a promise', agreement.initiatorFirstName, agreement.initiatorLastName),
								text = 'Click here to accept: ' + config.root + '/confirm/' + agreement._id,
								html = emails.confirmation(agreement);  
							
							email.send([{email: agreement.recipientEmail, name: agreement.recipientFirstName + " " + agreement.recipientLastName}], 'hello@promiser.com', subject, text, html, function (err, response){
								if (err) {
									console.log("-------------------");
									console.log("Error! >> " + err);
									console.log("-------------------");

									res.send('failure');						
								} else {
									console.log("------------------------");
									console.log("Confirmation Email Sent!");
									console.log("------------------------");

									res.send('success');
								}

							});
						});
					} else {
						console.log("-------------------");
						console.log("Agreement already verified.");
						console.log("-------------------");

						res.redirect('/' + agreement._id);
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					res.send('failure :(');
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
										console.log("Error creating agreement! >> " + err);
										console.log("-------------------");
										
										return res.send('null');
									}

									// Need to email receipt to both people

									// Send confirmation to recipient

									var subject = 'Promise confirmed!',
										text = 'This promise, ' + config.host + '/' + agreement._id + ', has been confirmed and needs to be fulfilled by: ' + agreement.dueDate,
										html = emails.receipt(agreement);

									email.send([{email: agreement.initiatorEmail, name: agreement.initiatorFirstName + " " + agreement.initiatorLastName }, {email: agreement.recipientEmail, name: agreement.recipientFirstName + " " + agreement.recipientLastName}], 'hello@promiser.com', subject, text, html, function (err, response){
										if (err) {
											console.log("-------------------");
											console.log("Error! >> " + err);
											console.log("-------------------");

											res.send('failure');						
										} else {
											console.log("-------------");
											console.log("Receipt Sent!");
											console.log("-------------");

											res.send('success');
										}

									});

									// Create reminder
									reminders.create(agreement);

									res.send('success');
								});
								break;
							case 'confirmed' :
								console.log("----------------------------");
								console.log("Agreement already confirmed!");
								console.log("----------------------------");

								// Load promise page

								var data = {};
								data.id = req.params.id;
								data.agreement = agreement;
								res.render('agreement', {data: data});
								break;
							default :
								console.log("-------------------");
								console.log("This is an error :(");
								console.log("-------------------");

								res.send('failure :(');
								break;
						} 
					} else {
						console.log("-------------------");
						console.log("Unverified link :(");
						console.log("-------------------");
						
						res.redirect('/' + agreement._id);
					}
				} else {
					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					res.send('failure :(');
				}

			});
		}		
	}
}