////////////
// Models //
////////////

module.exports = function (mongoose) {
	
	// Users
	var AgreementSchema = new mongoose.Schema({
		
		// Initiator
		// WARNING: This still needs to validate the email address.
		initiatorEmail: { type: String, lowercase: true, required: true, trim: true },
		
		//Recipient
		// WARNING: This still needs to validate the email address.
		recipientEmail: { type: String, lowercase: true, required: true, trim: true },

		// Email
		confirmationDate: { type: Date },

		// Email
		dueDate: { type: Date, required: true },
		
		// Object
		object: { type: String, required: true, trim: true },

		// Terms
		terms: { type: String, required: true, trim: true },

		// Confirmation Status
		confirmationStatus: { type: Boolean, default: false }

	});

	return mongoose.model('Agreement', AgreementSchema, 'agreements');
}