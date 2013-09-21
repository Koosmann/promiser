//////////////////
// Reminder Job //
//////////////////

module.exports = function (cron, Agreement, email, async, util, emails) {
	
	var activeReminders = {};	

	function pluralizeDays (value) {
		if (value === undefined) return 'days';
		else if (value == 1) return 'day';
		else if (value == 'less than one') return 'day';
		else return 'days';
	}	

	function getDaysLeft(time) {
		var dueDate = new Date(time),
			now = new Date(),
			secondsAgo = (dueDate.getTime()/1000) - (now.getTime()/1000);

		var DAY = 86400;

		console.log(secondsAgo/DAY);

		if (secondsAgo/DAY >= 1) return Math.floor(secondsAgo/DAY);
		else if (secondsAgo/DAY > 0 && secondsAgo/DAY < 1) return 'less than one';
		else return 0;
	}

	// Every day at 5am check what promises need to have reminders sent out
	new cron('00 24 12 * * *', function () {  // Every day at 5AM
	    Agreement.find({"confirmationStatus": "confirmed", dueDate : {"$gte": new Date() }}, function (err, agreements) {
			if (err) {
				console.log("Error finding agreements: %d", err);
				return;
			}

			if (agreements.length != 0) {
				async.each(agreements, function(agreement, next) {
					setImmediate(function () {

					    var today = new Date(),
					    	daysLeft = getDaysLeft(agreement.dueDate);
					    
					    // Send reminders when there is a multiple of 10 days left & at 5, 3, 2, 1, and 'less than one' days left
					    if (daysLeft%10 == 0 || daysLeft == 5 || daysLeft == 2 || daysLeft == 'less than one') {

						    var	dayUnit = pluralizeDays(daysLeft),
								
								initiatorSubject = util.format("You have %s %s to fulfill your promise to %s", daysLeft, dayUnit, agreement.recipientFirstName),
								recipientSubject = util.format("%s has %s %s to fulfill their promise to you", agreement.initiatorFirstName, daysLeft, dayUnit),
								
								initiatorText = initiatorSubject,  	// Need to fill this out
								recipientText = recipientSubject,	// Need to fill this out
								
								initiatorHtml = emails.reminder.toInitiator(agreement, daysLeft, dayUnit),
								recipientHtml = emails.reminder.toRecipient(agreement, daysLeft, dayUnit);

							// initiator email
							email.send([{email: agreement.initiatorEmail, name: agreement.recipientFirstName + " " + agreement.recipientLastName }], null, initiatorSubject, initiatorText, initiatorHtml, function (error, res) {
								if (error) console.log("Error sending reminder for id %s - %s", agreement._id, error);
								else console.log("Reminder sent!");
							});

							// recipient email
							email.send([{email: agreement.recipientEmail, name: agreement.recipientFirstName + " " + agreement.recipientLastName }], null, recipientSubject, recipientText, recipientHtml, function (error, res) {
								if (error) console.log("Error sending reminder for id %s - %s", agreement._id, error);
								else console.log("Reminder sent!");
							});
						}
					});

				}, function (err) {
					console.log("Daily cron jobs finished.");
					return;
				});
			} else {
				console.log("No agreements found.");
				return;
			}
		});
	}, null, true);

	return {
		init: function () {
			Agreement.find({"confirmationStatus": "confirmed", dueDate : {"$gte": new Date() }}, function (err, agreements) {
				if (err) {
					console.log("Error finding agreements: %d", err);
					return;
				}

				if (agreements.length != 0) {
					async.each(agreements, function(agreement, next) {
						setImmediate(function () {
							console.log("Creating cron job: " + agreement.id);
							var reminderJob = new cron({
								cronTime: agreement.dueDate, 
								onTick: function() {	
							    	console.log("Cron job: " + agreement.id);
							    	this.stop();
							  	}, 
							  	onComplete: function() {
							    	delete activeReminders["id" + agreement.id];
							    	//console.dir(activeReminders);
							  	},
							  	start: true
							});

							activeReminders["id" + agreement.id] = reminderJob;
							next(null);
						});

					}, function (err) {
						console.log("Cron jobs finished.");
						//console.dir(activeReminders);
						return;
					});
				} else {
					console.log("No agreements found.");
					return;
				}
			});
			
		},
		create: function(agreement) {
			var reminderJob = new cron({
				cronTime: agreement.dueDate, 
				onTick: function() {	
			    	console.log("Cron job: " + agreement.id);
			    	this.stop();
			  	}, 
			  	onComplete: function() {
			    	delete activeReminders["id" + agreement.id];
			    	console.dir(activeReminders);
			  	},
			  	start: true
			});

			activeReminders["id" + agreement.id] = reminderJob;
			console.dir(activeReminders);
			return;
		}
	}
}