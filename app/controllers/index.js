///////////
// Index //
///////////
	
module.exports = function (config, Agreement, email, reminders) {
	
	return {
		//////////////
		// Homepage //
		//////////////

		index: function (req, res) {
			console.log('homepage!');

			res.render('index');
		},

		////////////////////
		// Show Agreement //
		////////////////////

		showAgreement: function (req, res) {
			console.log('show agreement!');

			var data = {};
			data.id = req.params.id;

			Agreement.findById(req.params.id, function (err, agreement){
				if (agreement) {
					console.log("----------------");
					console.log("Agreement found!");
					console.log("----------------");

					data.agreement = agreement;
				} else {
					if (err) {
						console.log("-------------------");
						console.log("Error! >> " + err);
						console.log("-------------------");						
					} 

					console.log("-------------------");
					console.log("No agreement found.");
					console.log("-------------------");

					// Dummy Data
					data.agreement = {};

					data.agreement.initiatorEmail = 'initiator@email.com';
					data.agreement.recipientEmail = 'recipient@email.com';
					data.agreement.confirmationDate = new Date();
					data.agreement.dueDate = new Date();
					data.agreement.object = 'TEST OBJECT';
					data.agreement.terms = 'No agreement found, but here is an example :)';
					data.agreement.confirmationStatus = 'confirmed';
				}

				res.render('agreement', {data: data});
			});

		},

		//////////////////////
		// Create Agreement //
		//////////////////////

		createAgreement: function (req, res) {
			console.log(req.body);

			var agreement = new Agreement();
				  
			agreement.initiatorEmail = req.body.initiatorEmail;
			agreement.recipientEmail = req.body.recipientEmail;
			agreement.object = req.body.subject;
			agreement.terms = req.body.terms;
			agreement.dueDate = new Date(Date.now() + req.body.daysFromNow);

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

				// Send confirmation to recipient

				var subject = agreement.initiatorEmail + ' has sent you a promise.',
					text = 'Click here to accept: ' + config.root + '/confirm/' + agreement._id,
					html = 'Do you accept?  <a href="' + config.host + '/confirm/' + agreement._id + '">Yes</a> / No';  

				email.send([{email: agreement.recipientEmail }], 'hello@promiser.com', subject, text, html, function (err, response){
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
									html = 'This <a href="' + config.host + '/confirm/' + agreement._id + '">promise</a> has been confirmed and needs to be fulfilled by: ' + agreement.dueDate;  

								email.send([{email: agreement.initiatorEmail}, {email: agreement.recipientEmail}], 'hello@promiser.com', subject, text, html, function (err, response){
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
					console.log("No agreement found.");
					console.log("-------------------");

					res.send('failure :(');
				}

			});
		}		
	}
}