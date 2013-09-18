'use strict';

/* Controllers */

function Index($scope, $compile) {
	//$scope.promiseCount = 22039452;

	$scope.options = [
		{
			name: 'intro',
			icon: 'icon-info',
			content: "<b>1.</b> Choose promise type above<br/><b>2.</b> Fill out the form & submit<br/><b>3.</b> Confirm your email<br/><br/><span class='text-light'><b>&</b> that's it - once the recipient of the promises accepts, we'll take care of rest and remind you both when the due date approaches.</span>",
			active: true
		},
		{
			name: 'payment',
			icon: 'icon-dollar',
			content: "<form ng-submit='testSubmit()' method='post'><input type='hidden' name='type' value='{{ currentOption.name }}' />I, <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorFirstName'>your first</span> <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorLastName'>& last name</span> (<span class='p-input p-email' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorEmail'>your email</span>), owe <span class='p-input p-amount' ng-class='{&quot;active&quot;: isInput}' p-input-name='amount'>dollar amount</span> to <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientFirstName'>their first</span> <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientLastName'>& last name</span> (<span class='p-input p-email' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientEmail'>their email</span>) and promise to pay them within <span class='p-input p-date' ng-class='{&quot;active&quot;: isInput}' p-input-name='dueDaysFromNow'>##</span> days.<br /><br /><input name='submit' id='submit' class='cta btn btn-default btn-lg' type='submit' value='Submit'/></form>",
			active: false
		},
		{
			name: 'product',
			icon: 'icon-trophy',
			content: "<form action='/create' method='post'><input type='hidden' name='type' value='{{ currentOption.name }}' />I, <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorFirstName'>your first</span> <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorLastName'>& last name</span> (<span class='p-input p-email' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorEmail'>your email</span>), am borrowing <span class='p-input p-item' ng-class='{&quot;active&quot;: isInput}' p-input-name='item'>item</span> from <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientFirstName'>their first</span> <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientLastName'>& last name</span> (<span class='p-input p-email' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientEmail'>their email</span>) and promise to return it to them within <span class='p-input p-date' ng-class='{&quot;active&quot;: isInput}' p-input-name='dueDaysFromNow'>##</span> days.<br /><br /><input name='submit' id='submit' class='cta btn btn-default btn-lg' type='submit' value='Submit'/></form>",
			active: false
		},
		{
			name: 'service',
			icon: 'icon-coffee',
			content: "<form action='/create' method='post'><input type='hidden' name='type' value='{{ currentOption.name }}' />I, <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorFirstName'>your first</span> <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorLastName'>& last name</span> (<span class='p-input p-email' ng-class='{&quot;active&quot;: isInput}' p-input-name='initiatorEmail'>your email</span>), am agreeing to <span class='p-input p-service' ng-class='{&quot;active&quot;: isInput}' p-input-name='service'>do a service</span> for <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientFirstName'>their first</span> <span class='p-input p-name' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientLastName'>& last name</span> (<span class='p-input p-email' ng-class='{&quot;active&quot;: isInput}' p-input-name='recipientEmail'>their email</span>) and promise to do so within <span class='p-input p-date' ng-class='{&quot;active&quot;: isInput}' p-input-name='dueDaysFromNow'>##</span> days.<br /><br /><input name='submit' id='submit' class='cta btn btn-default btn-lg' type='submit' value='Submit'/></form>",
			active: false
		}
	]

	$scope.currentOption = $scope.options[0];
	$scope.currentForm = $compile($scope.currentOption.content)($scope);

	$scope.chooseOption = function (i) {
		$scope.currentOption.active = false;
		$scope.options[i].active = true;
		$scope.currentOption = $scope.options[i];
		$scope.currentForm = $compile($scope.currentOption.content)($scope);

		//if (!$scope.$$phase) $scope.$digest();
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
				var agreementTemplate = "<div>I, <span class='p-key-item'>{{ agreementData.initiatorFirstName }}</span> <span class='p-key-item'>{{ agreementData.initiatorLastName }}</span> <span class='p-key-item-light'>({{ agreementData.initiatorEmail }})</span>, owe <span class='p-key-item'>{{ agreementData.amount }}</span> to <span class='p-key-item'>{{ agreementData.recipientFirstName }}</span> <span class='p-key-item'>{{ agreementData.recipientLastName }}</span> <span class='p-key-item-light'>({{ agreementData.recipientEmail }})</span> and promise to pay them within <span class='p-key-item'>{{ agreementData.dueDaysFromNow }}</span> days.</div>"
				break;
			case 'product':
				var agreementTemplate = "<div>I, <span class='p-key-item'>{{ agreementData.initiatorFirstName }}</span> <span class='p-key-item'>{{ agreementData.initiatorLastName }}</span> <span class='p-key-item-light'>({{ agreementData.initiatorEmail }})</span>, am borrowing <span class='p-key-item'>{{ agreementData.item }}</span> from <span class='p-key-item'>{{ agreementData.recipientFirstName }}</span> <span class='p-key-item'>{{ agreementData.recipientLastName }}</span> <span class='p-key-item-light'>({{ agreementData.recipientEmail }})</span> and promise to return it to them within <span class='p-key-item'>{{ agreementData.dueDaysFromNow }}</span> days.</div>"
				break;
			case 'service':
				var agreementTemplate = "<div>I, <span class='p-key-item'>{{ agreementData.initiatorFirstName }}</span> <span class='p-key-item'>{{ agreementData.initiatorLastName }}</span> <span class='p-key-item-light'>({{ agreementData.initiatorEmail }})</span>, am agreeing to <span class='p-key-item'>{{ agreementData.service }}</span> for <span class='p-key-item'>{{ agreementData.recipientFirstName }}</span> <span class='p-key-item'>{{ agreementData.recipientLastName }}</span> <span class='p-key-item-light'>({{ agreementData.recipientEmail }})</span> and promise to do so within <span class='p-key-item'>{{ agreementData.dueDaysFromNow }}</span> days.</div>"
				break;
		}

		$scope.agreement = $compile(agreementTemplate)($scope);
	});
}