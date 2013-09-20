////////////
// Models //
////////////

module.exports = function (mongoose) {
	
	// Users
	var EmailLogSchema = new mongoose.Schema({
		
		// Email content
		toEmail: { type: String, required: true },
		html: { type: String , required: true },
		text: { type: String , required: true },
		subject: { type: String, required: true },
		date: { type: Date, required: true, default: Date.now() }

	});

	return mongoose.model('EmailLog', EmailLogSchema, 'emailLogs');
}