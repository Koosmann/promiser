//////////////
// Mandrill //
//////////////

module.exports = function (mandrill) {
	
	return {
		//send an e-mail
		send: function (to, from, subject, text, callback) {
			mandrill('/messages/send', {
				message: {
					to: [{email: to}],
					from_email: from,
					subject:  req.body.headers.From + " has sent you a Promise.",
					text: "Do you accept?"
				}
			}, function (error, response) {
				//uh oh, there was an error
				if (error) {
					console.log( JSON.stringify(error));
					return callback(error);
				} else {
					//everything's good, lets see what mandrill said
					console.log(response);
					return callback();
				}
			});
		}
	}
}