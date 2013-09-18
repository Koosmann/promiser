'use strict';

/* Controllers */

function Index($scope, $compile) {
	//$scope.promiseCount = 22039452;

	$scope.options = [
		{
			name: 'intro',
			icon: 'icon-info',
			content: "<b>1.</b> Choose promise type above<br/><b>2.</b> Fill out the form & submit<br/><b>3.</b> Confirm your email<br/><br/><span class='text-light'><b>& that's it</b> - once the recipient of the promises accepts, we'll take care of rest and remind you both when the due date approaches.</span>",
			active: true
		},
		{
			name: 'payment',
			icon: 'icon-dollar',
			content: "<form name='payment' action='/create' method='post'><input type='hidden' name='type' value='{{ currentOption.name }}' />I, <span class='p-key-item-group'><input p-input class='p-key-item' name='initiatorFirstName' placeholder='your first' type='text'/></span> <span class='p-key-item-group'><input p-input class='p-key-item' name='initiatorLastName' placeholder='& last name' type='text'/></span> <span class='p-key-item-group'>(<input p-input class='p-key-item-light' name='initiatorEmail' placeholder='your email' type='text'/>),</span> owe <span class='p-key-item-group'><input p-input class='p-key-item' name='amount' placeholder='amount' type='text'/></span> to <span class='p-key-item-group'><input p-input class='p-key-item' name='recipientFirstName' placeholder='their first' type='text'/></span> <span class='p-key-item-group'><input p-input class='p-key-item' name='recipientLastName' placeholder='& last name' type='text'/></span> <span class='p-key-item-group'>(<input p-input class='p-key-item-light' name='recipientEmail' placeholder='their email' type='text'/>)</span> and promise to pay them within <span class='p-key-item-group'><input p-input class='p-key-item' name='dueDaysFromNow' ng-model='form.dueDaysFromNow' placeholder='##' type='text' maxlength='2' /> {{ form.dueDaysFromNow|pluralizeDays }}</span>.<br /><br /><input name='submit' id='submit' class='cta btn btn-default btn-lg' type='submit' value='Submit'/></form>",
			active: false
		},
		{
			name: 'product',
			icon: 'icon-trophy',
			content: "<form name='product' action='/create' method='post'><input type='hidden' name='type' value='{{ currentOption.name }}' />I, <span class='p-key-item-group'><input p-input class='p-key-item' name='initiatorFirstName' placeholder='your first' type='text'/></span> <span class='p-key-item-group'><input p-input class='p-key-item' name='initiatorLastName' placeholder='& last name' type='text'/></span> <span class='p-key-item-group'>(<input p-input class='p-key-item-light' name='initiatorEmail' placeholder='your email' type='text'/>),</span> am borrowing <span class='p-key-item-group'><input p-input class='p-key-item' name='item' placeholder='item' type='text'/></span> from <span class='p-key-item-group'><input p-input class='p-key-item' name='recipientFirstName' placeholder='their first' type='text'/></span> <span class='p-key-item-group'><input p-input class='p-key-item' name='recipientLastName' placeholder='& last name' type='text'/></span> <span class='p-key-item-group'>(<input p-input class='p-key-item-light' name='recipientEmail' placeholder='their email' type='text'/>)</span> and promise to return it to them within <span class='p-key-item-group'><input p-input class='p-key-item' name='dueDaysFromNow' ng-model='$parent.dueDaysFromNow' placeholder='##' type='text' maxlength='2' /></span> {{ dueDaysFromNow|pluralizeDays }}.<br /><br /><input name='submit' id='submit' class='cta btn btn-default btn-lg' type='submit' value='Submit'/></form>",
			active: false
		},
		{
			name: 'service',
			icon: 'icon-coffee',
			content: "<form name='service' action='/create' method='post'><input type='hidden' name='type' value='{{ currentOption.name }}' />I, <span class='p-key-item-group'><input p-input class='p-key-item' name='initiatorFirstName' placeholder='your first' type='text'/></span> <span class='p-key-item-group'><input p-input class='p-key-item' name='initiatorLastName' placeholder='& last name' type='text'/></span> <span class='p-key-item-group'>(<input p-input class='p-key-item-light' name='initiatorEmail' placeholder='your email' type='text'/>),</span> am agreeing to <span class='p-key-item-group'><input p-input class='p-key-item' name='service' placeholder='service' type='text'/></span> for <span class='p-key-item-group'><input p-input class='p-key-item' name='recipientFirstName' placeholder='their first' type='text'/></span> <span class='p-key-item-group'><input p-input class='p-key-item' name='recipientLastName' placeholder='& last name' type='text'/></span> <span class='p-key-item-group'>(<input p-input class='p-key-item-light' name='recipientEmail' placeholder='their email' type='text'/>)</span> and promise to do so within <span class='p-key-item-group'><input p-input class='p-key-item' name='dueDaysFromNow' ng-model='$parent.dueDaysFromNow' placeholder='##' type='text' maxlength='2' /></span> {{ dueDaysFromNow|pluralizeDays }}.<br /><br /><input name='submit' id='submit' class='cta btn btn-default btn-lg' type='submit' value='Submit'/></form>",
			active: false
		}
	]

	$scope.currentOption = $scope.options[0];
	$scope.currentForm = $compile($scope.currentOption.content)($scope);

	$scope.chooseOption = function (i) {
		//$scope.form = {}; // If true, the inputs from one tab won't carry over to another
		$scope.currentOption.active = false;
		$scope.options[i].active = true;
		$scope.currentOption = $scope.options[i];
		$scope.currentForm = $compile($scope.currentOption.content)($scope);
	}

	$scope.testSubmit = function () {
		console.dir(document.forms);
	}
}

function Agreement($scope, $compile) {

	console.dir($scope);

	$scope.$watch('agreementData', function () {
		switch ($scope.agreementData.type) {
			case 'payment':
				var agreementTemplate = "<div>I, <span class='p-key-item'>{{ agreementData.initiatorFirstName }}</span> <span class='p-key-item-group'><span class='p-key-item'>{{ agreementData.initiatorLastName }}</span>,</span> owe <span class='p-key-item'>{{ agreementData.amount }}</span> to <span class='p-key-item'>{{ agreementData.recipientFirstName }}</span> <span class='p-key-item'>{{ agreementData.recipientLastName }}</span> and promise to pay them within <span class='p-key-item'>{{ agreementData.dueDate|daysToGo }}</span> {{ agreementData.dueDaysFromNow|pluralizeDays }}.<br/><br/><p class='text-light text-small'>This promise was created by {{ agreementData.initiatorEmail }} & {{ agreementData.recipientEmail }} {{ agreementData.confirmationDate|timeAgo}}.</p></div>"
				break;
			case 'product':
				var agreementTemplate = "<div>I, <span class='p-key-item'>{{ agreementData.initiatorFirstName }}</span> <span class='p-key-item-group'><span class='p-key-item'>{{ agreementData.initiatorLastName }}</span>,</span> am borrowing <span class='p-key-item'>{{ agreementData.item }}</span> from <span class='p-key-item'>{{ agreementData.recipientFirstName }}</span> <span class='p-key-item'>{{ agreementData.recipientLastName }}</span> and promise to return it to them within <span class='p-key-item'>{{ agreementData.dueDate|daysToGo }}</span> {{ agreementData.dueDaysFromNow|pluralizeDays }}.<br/><br/><p class='text-light text-small'>This promise was created by {{ agreementData.initiatorEmail }} & {{ agreementData.recipientEmail }} {{ agreementData.confirmationDate|timeAgo}}.</p></div>"
				break;
			case 'service':
				var agreementTemplate = "<div>I, <span class='p-key-item'>{{ agreementData.initiatorFirstName }}</span> <span class='p-key-item-group'><span class='p-key-item'>{{ agreementData.initiatorLastName }}</span>,</span> am agreeing to <span class='p-key-item'>{{ agreementData.service }}</span> for <span class='p-key-item'>{{ agreementData.recipientFirstName }}</span> <span class='p-key-item'>{{ agreementData.recipientLastName }}</span> and promise to do so within <span class='p-key-item'>{{ agreementData.dueDate|daysToGo }}</span> {{ agreementData.dueDaysFromNow|pluralizeDays }}.<br/><br/><p class='text-light text-small'>This promise was created by {{ agreementData.initiatorEmail }} & {{ agreementData.recipientEmail }} {{ agreementData.confirmationDate|timeAgo}}.</p></div>"
				break;
		}

		$scope.agreement = $compile(agreementTemplate)($scope);
	});
}