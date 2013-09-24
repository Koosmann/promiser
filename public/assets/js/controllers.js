'use strict';

/* Controllers */

function Index($scope, $location) {

	$scope.options = [
		{
			name: 'intro',
			icon: 'icon-info',
			message: "Introduction to <b>Promiser!</b>",
			active: false
		},
		{
			name: 'payment',
			icon: 'icon-dollar',
			message: "<b>Payment</b><br/><i>e.g. I owe so-and-so $5.</i>",
			active: false
		},
		{
			name: 'product',
			icon: 'icon-refresh',
			message: "<b>Product</b><br/><i>e.g. I borrowed a table and chairs from so-and-so.",
			active: false
		},
		{
			name: 'service',
			icon: 'icon-star',
			message: "<b>Service</b><br/><i>e.g. I'm going to do the dishes for so-and-so.",
			active: false
		},
		{
			name: 'appointment',
			icon: 'icon-coffee',
			message: "<b>Appointment</b><br/><i>e.g. I'm going to get coffee with so-and-so.",
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
		var location = _.findWhere($scope.options, { name: $location.path().replace('/', '')});

		if (location === undefined) $scope.chooseOption(0);
		else  $scope.chooseOption($scope.options.indexOf(location));

		/*switch ($location.path()) {
			case '/payment':
				$scope.chooseOption(1);
				break;
			case '/product':
				$scope.chooseOption(2);
				break;
			case '/service':
				$scope.chooseOption(3);
				break;
			case '/appointment':
				$scope.chooseOption(3);
				break;
			default:
				$scope.chooseOption(0);
				break;
		}*/
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