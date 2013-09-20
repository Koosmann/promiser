'use strict';

/* Controllers */

function Index($scope) {

	$scope.options = [
		{
			name: 'intro',
			icon: 'icon-info',
			active: true
		},
		{
			name: 'payment',
			icon: 'icon-dollar',
			active: false
		},
		{
			name: 'product',
			icon: 'icon-trophy',
			active: false
		},
		{
			name: 'service',
			icon: 'icon-coffee',
			active: false
		}
	]

	$scope.currentOption = $scope.options[0];
	if (!$scope.$$phase) $scope.$digest();

	$scope.chooseOption = function (i) {
		$scope.form = null;
		$scope.currentOption.active = false;
		$scope.options[i].active = true;
		$scope.currentOption = $scope.options[i];

		console.log("BEFORE DIGEST");
		console.dir(document.forms);
		
		if (!$scope.$$phase) $scope.$digest();

		console.log("AFTER DIGEST");
		console.dir(document.forms);
	}

	$scope.testSubmit = function () {
		console.dir(document.forms);
	}
}

function Agreement($scope) {
	console.dir($scope.agreementData);
}

function Message() {

}