///////////////////////
// Promise Templates //
///////////////////////

module.exports = function (util) {
	
	return {
		payment: function (agreement) {
			return util.format("I, %s %s (%s), owe $%d to %s %s (%s) and promise to pay them within %d days.", agreement.initiatorFirstName, agreement.initiatorLastName, agreement.initiatorEmail, agreement.amount, agreement.recipientFirstName, agreement.recipientLastName, agreement.recipientEmail, agreement.dueDaysFromNow);
		},
		product: function (agreement) {
			return util.format("I, %s %s (%s), am borrowing %s from %s %s (%s) and promise to return it to them within %d days.", agreement.initiatorFirstName, agreement.initiatorLastName, agreement.initiatorEmail, agreement.item, agreement.recipientFirstName, agreement.recipientLastName, agreement.recipientEmail, agreement.dueDaysFromNow);
		},
		service: function (agreement) {
			return util.format("I, %s %s (%s), am agreeing to %s for %s %s (%s) and promise to do so within %d days.", agreement.initiatorFirstName, agreement.initiatorLastName, agreement.initiatorEmail, agreement.service, agreement.recipientFirstName, agreement.recipientLastName, agreement.recipientEmail, agreement.dueDaysFromNow);
		}
	}
}