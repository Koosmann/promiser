//////////////
// Mandrill //
//////////////

module.exports = function (mandrill) {
	
	return {
		//send an e-mail
		send: function (to, from, subject, text, html, callback) {
			
			mandrill('/messages/send', {
				message: {
					to: to,
					from_email: 'hello@promiser.com',
					from_name: 'Promiser',
					bcc_address: 'koosmann@gmail.com',
					subject: subject,
					text: text,
					html: html,
					preserve_recipients: true
				}
			}, function (error, response) {
				//uh oh, there was an error
				if (error) {
					console.log( JSON.stringify(error));
					return callback(error, response);
				} else {
					console.log('SENT');
				
					//everything's good, lets see what mandrill said
					console.log(response);
					return callback(null, response);
				}
			});
		}
	}
}