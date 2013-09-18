///////////////////////
// Email Templates //
///////////////////////

module.exports = function (util, config, crypto) {
	
	var promises = {
		payment: {
			content: "<h1 style='font-weight:normal;color:#111;'>I, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, owe <span style='font-weight:bold;color:#428bca;'>$%d</span> to you, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, and promise to pay you within <span style='font-weight:bold;color:#428bca;'>%d</span> days.</h1><br/>",
			thing: 'amount'
		},
		product: {
			content: "<h1 style='font-weight:normal;color:#111;'>I, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, am borrowing <span style='font-weight:bold;color:#428bca;'>%s</span> from you, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, and promise to return it to you within <span style='font-weight:bold;color:#428bca;'>%d</span> days.</h1><br/>",
			thing: 'item'
		},
		service: {
			content: "<h1 style='font-weight:normal;color:#111;'>I, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, am agreeing to <span style='font-weight:bold;color:#428bca;'>%s</span> for you, <span style='font-weight:bold;color:#428bca;'>%s %s</span>, and promise to do so within <span style='font-weight:bold;color:#428bca;'>%d</span> days.</h1><br/>",
			thing: 'service'
		}
	}

	return {
		verification: function (agreement) {

			return util.format(	"<h3 style='font-weight:normal;color:#AAA;'>This is what %s will see:</h3>" + 
								promises[agreement.type].content +
								"<h1 style='font-weight:normal;color:#AAA;text-decoration:none;'>Would you like to send this promise to %s (<a href='mailto:%s' style='text-decoration:none;color:#AAA;'>%s</a>)?</h1>" + 
								"<h1 style='color:#AAA;'><a href='%s/%s/validate/' style='text-decoration:none;color:#428bca;'>Yes</a> / No</h1>", 
								agreement.recipientFirstName,
								agreement.initiatorFirstName, 
								agreement.initiatorLastName,
								agreement[promises[agreement.type].thing],
								agreement.recipientFirstName,
								agreement.recipientLastName,
								agreement.dueDaysFromNow,
								agreement.recipientFirstName, 
								agreement.recipientEmail,
								agreement.recipientEmail,
								config.host,
								agreement._id);
		},
		confirmation: function (agreement) {
				
			return util.format(	"<br/>" +
								promises[agreement.type].content +
								"<h1 style='font-weight:normal;color:#AAA;'>Would you like to accept this promise?</h1>" + 
								"<h1 style='color:#AAA;'><a href='%s/%s/confirm/%s' style='text-decoration:none;color:#428bca;'>Yes</a> / No</h1>" +
								"The sender of this promise verified their email as %s.  If you aren't familiar with this email address or if you don't think %s created this promise, then you should not accept it!", 
								agreement.initiatorFirstName, 
								agreement.initiatorLastName,
								agreement[promises[agreement.type].thing],
								agreement.recipientFirstName,
								agreement.recipientLastName,
								agreement.dueDaysFromNow,
								config.host,
								agreement._id,
								crypto.createHmac('sha1', agreement.salt).update(agreement.id).digest('hex'),
								agreement.initiatorEmail,
								agreement.initiatorFirstName);
		},
		receipt: function (agreement) {
			return util.format(	"<br/>" +
								"<h1 style='font-weight:normal;color:#111;'>Promise confirmed.</h1>" +
								"<h1 style='font-weight:normal;color:#AAA;'><a href='%s/%s' style='text-decoration:none;color:#428bca;'>See it here</a></h1><br/>" + 
								"This promise has been verified by %s & %s.", 
								config.host,
								agreement._id,
								agreement.initiatorEmail,
								agreement.recipientEmail);
		}
	}
}