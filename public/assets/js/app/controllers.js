'use strict';

/* Controllers */

function Index($window, $scope, $location, $http) {

	$scope.options = [
		{
			name: 'intro',
			icon: 'icon-info',
			message: "Introduction<br/>to <b>Promiser!</b>",
			active: false
		},
		{
			name: 'appointment',
			icon: 'icon-coffee',
			message: "<b>Appointment</b><br/><i>e.g. I'm going to get coffee with so-and-so.",
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
			message: "<b>Product</b><br/><i>e.g. I'm borrowing a table and chairs from so-and-so.",
			active: false
		},
		{
			name: 'service',
			icon: 'icon-star',
			message: "<b>Service</b><br/><i>e.g. I'm going to do the dishes for so-and-so.",
			active: false
		}
	]

	//$scope.currentOption = $scope.options[0];
	//if (!$scope.$$phase) $scope.$digest();

	$scope.chooseOption = function (i) {
		$scope.message = null; // Clear message;

		if ($scope.currentOption && $scope.currentOption.active !== undefined) $scope.currentOption.active = false;
		$scope.options[i].active = true;
		$scope.currentOption = $scope.options[i];
		console.dir($scope);
		console.dir($scope.$parent);
		console.dir($scope.$parent.$parent);

		if ($scope.form) {
			console.dir($scope.form);
			//$scope.form.amount = null;
			$scope.form.item = null;
			$scope.form.service = null;

			$scope.form.type = $scope.currentOption.name;
		}

		console.dir($scope);

		console.log('LOCATION');
		$location.path('/' + $scope.currentOption.name);
		//$location.replace();
		
		if (!$scope.$$phase) $scope.$digest();
	}

	$scope.submit = function (form) {
		$http.post('/create', form).
		success(function(data, status) {
			
			// Add GA confirmation event here...

			data.name = 'message';
			$scope.message = data;
			$scope.form = null; // Clear form
			console.log($scope);
		}).
		error(function(data, status) {
			data.name = 'message';
			$scope.message = data;
			$scope.form = null; // Clear form
			console.log($scope);

		});
	}

	$scope.route = function () {
		var location = _.findWhere($scope.options, { name: $location.path().replace('/', '')});

		if (location === undefined) $scope.chooseOption(0);
		else  $scope.chooseOption($scope.options.indexOf(location));
	}

	$scope.$on("$locationChangeSuccess", function() {
		console.log("route update");
		$scope.route();

		if (ga === undefined) {
			console.log("GA - %s", $location.path());
			ga.push(['_trackPageview', $location.path()]);
		}
	});

	$scope.route();
}

function Agreement($scope) {
	console.dir($scope.agreementData);
}

function Message() {

}