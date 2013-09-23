////////////
// Models //
////////////

module.exports = function (mongoose) {
	
	// Users
	var AgreementSchema = new mongoose.Schema({
		
		// Initiator
		// WARNING: This still needs to validate the email address.
		initiatorFirstName: { type: String, required: true, trim: true },
		initiatorLastName: { type: String, required: true, trim: true },
		initiatorEmail: { type: String, lowercase: true, required: true, trim: true },
		
		//Recipient
		// WARNING: This still needs to validate the email address.
		recipientFirstName: { type: String, required: true, trim: true },
		recipientLastName: { type: String, required: true, trim: true },
		recipientEmail: { type: String, lowercase: true, required: true, trim: true },

		// Confirmation date
		confirmationDate: { type: Date, required: true, default: Date.now() },

		// Due date
		//dueDaysFromNow: { type: Number },
		dueDate: { type: Date, required: true },

		// Fulfillment date
		fulfillmentDate: { type: Date },

		// Promise type
		type: { type: String, required: true, trim: true },
		
		// Thing
		amount: { type: Number, trim: true },
		item: { type: String, trim: true },
		service: { type: String, trim: true },
		activity: { type: String, trim: true },

		// Terms
		//terms: { type: String, required: true, trim: true },

		// Confirmation Status
		confirmationStatus: { type: String, default: "unverified" },

		// Salt
		salt: { type: String, required: true }

	});

	return mongoose.model('Agreement', AgreementSchema, 'agreements');
}