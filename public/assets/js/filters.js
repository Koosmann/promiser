'use strict';

/* Filters */

promiser.filter('pluralizeDays', function () {
	return function (value) {
		if (value === undefined) return 'days';
		else if (value == 1) return 'day';
		else return 'days';
	}
})