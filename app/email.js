//////////////
// Mandrill //
//////////////

module.exports = function (mandrill, EmailLog) {
	
	return {
		//send an e-mail
		send: function (to, from, subject, text, html, callback) {
			
			mandrill('/messages/send', {
				message: {
					to: to,
					from_email: 'hello@promiser.com',
					from_name: 'Promiser',
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

					var emailLog = new EmailLog();

					emailLog.toEmail = to;
					emailLog.subject = subject || "";
					emailLog.html = html || "";
					emailLog.text = text || "";

					emailLog.save(function (err) {
						if (err) console.log("Error saving email log! - %s", err);
						else console.log("Email log saved.");
					})
				
					//everything's good, lets see what mandrill said
					console.log(response);
					return callback(null, response);
				}
			});
		}
	}
}