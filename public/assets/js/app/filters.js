'use strict';

/* Filters */

promiser.filter('pluralizeDays', function () {
	return function (value) {
		//console.log(value);
		if (value === undefined) return 'days';
		else if (value == '1' || value == '-1') return 'day';
		else if (value == 'less than one') return 'day';
		else return 'days';
	}
});

promiser.filter('daysToGo', function () {
	return function (time) {
		var dueDate = new Date(time),
			now = new Date(),
			millisecondsAgo = (dueDate.getTime()) - (now.getTime());

		var DAY = 1000*60*60*24; // milliseconds in 1 day

		if (millisecondsAgo/DAY >= 1) return Math.floor(millisecondsAgo/DAY);
		else if (millisecondsAgo/DAY > 0 && millisecondsAgo/DAY < 1) return 'less than one';
		else return 0;
	}
});

promiser.filter('timeAgo', function () {
  	return function (time) {
		var timeAgo, unit,
			then = new Date(time),
			now = new Date(),
			millisecondsAgo = (now.getTime()) - (then.getTime()),
			inTheFuture = false;

		var SECOND = 	1000,
			MINUTE = 	1000*60,			// milliseconds in 1 minute
			HOUR = 		1000*60*60,			// milliseconds in 1 hour
			DAY = 		1000*60*60*24,		// milliseconds in 1 day
			WEEK = 		1000*60*60*24*7,	// milliseconds in 1 week
			YEAR = 		1000*60*60*24*7*52;	// milliseconds in 1 year	
				
		if (millisecondsAgo >= 0 && millisecondsAgo < MINUTE) {
			timeAgo = millisecondsAgo/SECOND;
			unit = "seconds";
		} else if (millisecondsAgo >= MINUTE && millisecondsAgo < HOUR) {
			timeAgo = millisecondsAgo/MINUTE;
			unit = "minutes";		
		} else if (millisecondsAgo >= HOUR && millisecondsAgo < DAY) {
			timeAgo = millisecondsAgo/HOUR;
			unit = "hours";
		} else if (millisecondsAgo >= DAY && millisecondsAgo < WEEK) {
			timeAgo = millisecondsAgo/DAY;
			unit = "days";
		} else if (millisecondsAgo >= WEEK && millisecondsAgo < YEAR) {
			timeAgo = millisecondsAgo/WEEK;
			unit = "weeks";
		} else if (millisecondsAgo >= YEAR) {
			timeAgo = millisecondsAgo/YEAR;
			unit = "years";
		} else {
			inTheFuture = true;
		}
			
		// Pluralize (or not, if necessary)
		if (Math.floor(timeAgo) == 1)
			unit = unit.substr(0, unit.length - 1);
		
		timeAgo = Math.floor(timeAgo) + " " + unit + " ago";
		
		return !inTheFuture ? timeAgo : 'in the future!';
	}
});