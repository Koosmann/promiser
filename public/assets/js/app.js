'use strict';

/* App Module */

var promiser = angular.module('Promiser', []);

promiser.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {      
	$locationProvider.html5Mode(true);
}]);