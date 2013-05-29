///////////
// Index //
///////////
	
module.exports = function (config, Agreement) {
	
	return {
		index: function (req, res) {
			console.log('homepage!');

			res.render('index');
		},
		showAgreement: function (req, res) {
			console.log('show agreement!');

			data = {};
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
					data.agreement.terms = 'These are the terms.';
					data.agreement.confirmationStatus = true;
				}

				res.render('agreement', {data: data});
			});

		},
		createAgreement: function (req, res) {
			console.log(req.body);

			var agreement = new Agreement();
				  
			agreement.initiatorEmail = req.body.initiatorEmail;
			agreement.recipientEmail = req.body.recipientEmail;
			agreement.object = req.body.object;
			agreement.terms = req.body.terms;
			agreement.dueDate = new Date();

			console.log(agreement);
		
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
				
				// Need to send preview/verify email to initiator
				
				res.send('success');
			});
		},
		confirmAgreement: function (res, req) {
			
			// Set confirmation status & store confirmation date

			res.send('success');
		},		
	}
}