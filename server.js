var simplesmtp = require('simplesmtp'),
	fs = require('fs'),
	port = process.env.PORT || 3000,
	nodemailer = require('nodemailer'),
	serverOptions = {
						name: 'Promiserver',
						SMTPBanner: '~ Promiser v0 ~', 
						host: '127.0.0.1', 
						port: port,
						ignoreTLS: true,
						debug: true,
						disableDNSValidation: true,
						timeout: 5000
					},
	clientOptions = {
						name: 'Promisender', 
						ignoreTLS: true, 
						debug: true
					},
	smtp = simplesmtp.createServer(serverOptions),
	client = simplesmtp.connect(port, '127.0.0.1', clientOptions);

smtp.listen(port, function (err) {
	if (!err) {
		console.log('Started server on port %s', port);
				
		/*client.once("idle", function(){
			console.log('Sending Mail');

			client.useEnvelope({
				from: "test@promiser.com",
				to: ["koosmann@gmail.com"]
			});
		});*/

	} else {
		console.log('Could not start server because %s... typical...', err);
	}
});

smtp.on("startData", function(connection){
    console.log("Message from:", connection.from);
    console.log("Message to:", connection.to);
    connection.saveStream = fs.createWriteStream("./messages/message.txt");
});

smtp.on("data", function(connection, chunk){
    connection.saveStream.write(chunk);
});

smtp.on("dataReady", function(connection, callback){
    connection.saveStream.end();
    console.log(connection);
    console.log("Incoming message saved to /messages/message.txt");
    callback(null, "ABC1"); // ABC1 is the queue id to be advertised to the client
    // callback(new Error("Rejected as spam!")); // reported back to the client
});


client.on("rcptFailed", function(addresses){
	console.log("The following addresses were rejected: ", addresses);
});

client.on("message", function(){
	console.log("Sending!");
	console.log(client);
	client.write("From: test@promiser.com\r\nTo: koosmann@gmail.com\r\nSubject: test\r\n\r\nHello World!");
	client.end();
});

client.on("ready", function(success, response){
	if (success) {
		client.end();
		console.log("The message was transmitted successfully with " + response);
	}
});

client.on("error", function(err){
	if (err)
		console.log(err);
});