///////////////////////
// Email Templates //
///////////////////////

module.exports = function (util, config, crypto) {
	
	function daysToGo(time) {
		var dueDate = new Date(time),
			now = new Date(),
			secondsAgo = (dueDate.getTime()/1000) - (now.getTime()/1000);

		var DAY = 86400;

		console.log(secondsAgo/DAY);

		if (secondsAgo/DAY >= 1) return Math.floor(secondsAgo/DAY);
		else if (secondsAgo/DAY > 0 && secondsAgo/DAY < 1) return 'less than one';
		else return 0;
	}

	function pluralizeDay(days) {
		if (days === undefined) return 'days';
		else if (days == '1') return 'day';
		else if (days == 'less than one') return 'day';
		else return 'days';
	}

	var promises = {
		payment: {
			content: "<h1 style='font-weight:normal;color:#111;'>I, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, owe <span style='font-weight:bold;color:#428bca;'>$%d</span> to you, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, and promise to pay you within <span style='font-weight:bold;color:#428bca;'>%s</span> %s.</h1><br/>",
			question: "<h1 style='font-weight:normal;color:#111;'>Did <span style='font-weight:bold;color:#428bca;'>%s</span> pay you back your <span style='font-weight:bold;color:#428bca;'>$%s</span> yet?</h1>",
			thing: 'amount'
		},
		product: {
			content: "<h1 style='font-weight:normal;color:#111;'>I, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, am borrowing <span style='font-weight:bold;color:#428bca;'>%s</span> from you, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, and promise to return it to you within <span style='font-weight:bold;color:#428bca;'>%s</span> %s.</h1><br/>",
			question: "<h1 style='font-weight:normal;color:#111;'>Did <span style='font-weight:bold;color:#428bca;'>%s</span> return your <span style='font-weight:bold;color:#428bca;'>%s</span> to you yet?</h1>",
			thing: 'item'
		},
		service: {
			content: "<h1 style='font-weight:normal;color:#111;'>I, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, am agreeing to <span style='font-weight:bold;color:#428bca;'>%s</span> for you, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, and promise to do so within <span style='font-weight:bold;color:#428bca;'>%s</span> %s.</h1><br/>",
			question: "<h1 style='font-weight:normal;color:#111;'>Did <span style='font-weight:bold;color:#428bca;'>%s</span> <span style='font-weight:bold;color:#428bca;'>%s</span> for you yet?</h1>",
			thing: 'service'
		}
	}

	return {
		verification: function (agreement) {

			return util.format(	"<h3 style='font-weight:normal;color:#AAA;'>This is what %s will see:</h3>" + 
								promises[agreement.type].content +
								"<h1 style='font-weight:normal;color:#AAA;text-decoration:none;'>Would you like to send this promise to %s (<a href='mailto:%s' style='text-decoration:none;color:#AAA;'>%s</a>)?</h1>" + 
								"<h1 style='color:#AAA;'><a href='%s/%s/validate/' style='text-decoration:none;color:#428bca;'>Yes</a> / <a href='%s/%s/cancel/' style='text-decoration:none;color:#428bca;'>No</a></h1>", 
								agreement.recipientFirstName,
								agreement.initiatorFirstName, 
								agreement.initiatorLastName,
								agreement[promises[agreement.type].thing],
								agreement.recipientFirstName,
								agreement.recipientLastName,
								daysToGo(agreement.dueDate),
								pluralizeDay(daysToGo(agreement.dueDate)),
								agreement.recipientFirstName, 
								agreement.recipientEmail,
								agreement.recipientEmail,
								config.host,
								agreement._id,
								config.host,
								agreement._id);
		},
		confirmation: function (agreement) {
				
			return util.format(	promises[agreement.type].content +
								"<h1 style='font-weight:normal;color:#AAA;'>Would you like to accept this promise?</h1>" + 
								"<h1 style='color:#AAA;'><a href='%s/%s/confirm/%s' style='text-decoration:none;color:#428bca;'>Yes</a> / <a href='%s/%s/reject/%s' style='text-decoration:none;color:#428bca;'>No</a></h1>" +
								"The sender of this promise verified their email as %s.  If you aren't familiar with this email address or if you don't think %s created this promise, then you should not accept it!", 
								agreement.initiatorFirstName, 
								agreement.initiatorLastName,
								agreement[promises[agreement.type].thing],
								agreement.recipientFirstName,
								agreement.recipientLastName,
								daysToGo(agreement.dueDate),
								pluralizeDay(daysToGo(agreement.dueDate)),
								config.host,
								agreement._id,
								crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex'),
								config.host,
								agreement._id,
								crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex'),
								agreement.initiatorEmail,
								agreement.initiatorFirstName);
		},
		receipt: {
			toInitiator: function (agreement) {
				return util.format(	"<h1 style='font-weight:normal;color:#111;'>Promise to <span style='font-weight:bold;color:#428bca;'>%s</span> confirmed.</h1>" +
									"<h1 style='font-weight:normal;color:#AAA;'><a href='%s/%s' style='text-decoration:none;color:#428bca;'>See it here</a> / <a href='%s' style='text-decoration:none;color:#428bca;'>Create a new one</a></h1><br/>" + 
									"This promise has been verified by %s & %s.", 
									agreement.recipientFirstName,
									config.host,
									agreement._id,
									config.host,
									agreement.initiatorEmail,
									agreement.recipientEmail);
			},
			toRecipient: function (agreement) {
				return util.format(	"<h1 style='font-weight:normal;color:#111;'>Promise from <span style='font-weight:bold;color:#428bca;'>%s</span> confirmed.</h1>" +
									"<h1 style='font-weight:normal;color:#AAA;'><a href='%s/%s' style='text-decoration:none;color:#428bca;'>See it here</a></h1><br/>" +
									promises[agreement.type].question + 
									"<h1 style='font-weight:normal;'><a href='%s/%s/fulfill/%s' style='text-decoration:none;color:#46D846;'> Mark as fulfilled</a></h1><br/>" + 
									"<h1 style='font-weight:normal;color:#AAA;'>%s created this promise with <b>Promiser</b>. <a href='%s' style='text-decoration:none;color:#428bca;'>Create your own here</a></h1>" +
									"This promise has been verified by %s & %s.", 
									agreement.initiatorFirstName,
									config.host,
									agreement._id,
									agreement.initiatorFirstName,
									agreement[promises[agreement.type].thing],
									config.host,
									agreement._id,
									crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex'),
									agreement.initiatorFirstName,
									config.host,
									agreement.initiatorEmail,
									agreement.recipientEmail);
			}
		},
		reminder: {
			toInitiator: function (agreement, daysLeft, dayUnit) {
				return util.format(	"<h1 style='font-weight:normal;color:#111;'>You have <span style='font-weight:bold;color:#428bca;'>%s %s</span> left to fulfill your promise to %s.</h1>" +
									"<h1 style='font-weight:normal;color:#AAA;'><a href='%s/%s' style='text-decoration:none;color:#428bca;'>See the promise here</a></h1><br/>" +
									"This promise has been verified by %s & %s.",
									daysLeft,
									dayUnit,
									agreement.recipientFirstName,
									config.host,
									agreement._id,
									agreement.initiatorEmail,
									agreement.recipientEmail);
			},
			toRecipient: function (agreement, daysLeft, dayUnit) {
				return util.format(	"<h1 style='font-weight:normal;color:#111;'>%s has <span style='font-weight:bold;color:#428bca;'>%s %s</span> left to fulfill their promise to you.</h1>" +
									"<h1 style='font-weight:normal;color:#AAA;'><a href='%s/%s' style='text-decoration:none;color:#428bca;'>See the promise here</a> / <a href='%s/%s/fulfill/%s' style='text-decoration:none;color:#46D846;'>Mark as fulfilled</a></h1><br/>" +
									promises[agreement.type].question + 
									"<h1 style='font-weight:normal;'><a href='%s/%s/fulfill/%s' style='text-decoration:none;color:#428bca;'> Mark as fulfilled</a></h1><br/>" + 
									"This promise has been verified by %s & %s.",
									agreement.initiatorFirstName,
									daysLeft,
									dayUnit,
									config.host,
									agreement._id,
									agreement.initiatorFirstName,
									agreement[promises[agreement.type].thing],
									config.host,
									agreement._id,
									crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex'),
									agreement.initiatorEmail,
									agreement.recipientEmail);
			}
		},
		fulfillment: {
			toInitiator: function (agreement) {
				return util.format(	"<h1 style='font-weight:bold;color:#46D846;'>Promise fulfilled.</h1>" +
									"<h1 style='font-weight:normal;color:#AAA;'>Way to go! %s just marked your promise as fulfilled.  Keep up the good work.</h1>" +
									"<h1 style='font-weight:normal;color:#AAA;'><a href='%s/%s' style='text-decoration:none;color:#428bca;'>See the promise here</a> / <a href='%s' style='text-decoration:none;color:#428bca;'>Create a new one</a></h1><br/>" +
									"This promise has been verified by %s & %s.",
									agreement.recipientFirstName,
									config.host,
									agreement._id,
									config.host,
									agreement.initiatorEmail,
									agreement.recipientEmail);
			}
		}
	}
}