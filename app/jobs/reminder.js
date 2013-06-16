//////////////////
// Reminder Job //
//////////////////

module.exports = function (cron, Agreement, email, async) {
	
	var activeReminders = {};	

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
							    	console.dir(activeReminders);
							  	},
							  	start: true
							});

							activeReminders["id" + agreement.id] = reminderJob;
							next(null);
						});

					}, function (err) {
						console.log("Cron jobs finished.");
						console.dir(activeReminders);
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