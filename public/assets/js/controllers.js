'use strict';

/* Controllers */

function Index($scope, $location) {

	$scope.options = [
		{
			name: 'intro',
			icon: 'icon-info',
			active: false
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

	//$scope.currentOption = $scope.options[0];
	//if (!$scope.$$phase) $scope.$digest();

	$scope.chooseOption = function (i) {
		//$scope.form = null;
		if ($scope.form) {
			$scope.form.amount = null;
			$scope.form.item = null;
			$scope.form.service = null;
		}

		if ($scope.currentOption) $scope.currentOption.active = false;
		$scope.options[i].active = true;
		$scope.currentOption = $scope.options[i];

		console.log(i);

		console.log('LOCATION');
		$location.path('/' + $scope.currentOption.name);
		//$location.replace();
		
		if (!$scope.$$phase) $scope.$digest();
	}

	$scope.testSubmit = function () {
		console.dir(document.forms);
	}

	$scope.route = function () {
		switch ($location.path()) {
			case '/payment':
				$scope.chooseOption(1);
				break;
			case '/product':
				$scope.chooseOption(2);
				break;
			case '/service':
				$scope.chooseOption(3);
				break;
			default:
				$scope.chooseOption(0);
				break;
		}
	}

	$scope.$on("$locationChangeSuccess", function() {
		console.log("route update");
		$scope.route();
	});

	$scope.route();
}

function Agreement($scope) {
	console.dir($scope.agreementData);
}

function Message() {

}