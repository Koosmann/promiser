'use strict';

/* Filters */

promiser.filter('pluralizeDays', function () {
	return function (value) {
		if (value === undefined) return 'days';
		else if (value == 1) return 'day';
		else if (value == 'less than one') return 'day';
		else return 'days';
	}
});

promiser.filter('daysToGo', function () {
	return function (time) {
		var timeAgo, unit,
			dueDate = new Date(time),
			now = new Date(),
			secondsAgo = (dueDate.getTime()/1000) - (now.getTime()/1000);

		var DAY = 86400;

		console.log(secondsAgo/DAY);

		if (secondsAgo/DAY >= 1) return Math.floor(secondsAgo/DAY);
		else if (secondsAgo/DAY > 0 && secondsAgo/DAY < 1) return 'less than one';
		else return 0;
	}
});

promiser.filter('timeAgo', function () {
  	return function (time) {
		var timeAgo, unit,
			then = new Date(time),
			now = new Date(),
			secondsAgo = (now.getTime()/1000) - (then.getTime()/1000);

		var MINUTE = 60,
			HOUR = 3600,
			DAY = 86400,
			WEEK = 604800,
			YEAR = 31449600;	
				
		if (secondsAgo < 60) {
			timeAgo = secondsAgo;
			unit = "seconds";
		} else if (secondsAgo >= MINUTE && secondsAgo < HOUR) {
			timeAgo = secondsAgo/MINUTE;
			unit = "minutes";		
		} else if (secondsAgo >= HOUR && secondsAgo < DAY) {
			timeAgo = secondsAgo/HOUR;
			unit = "hours";
		} else if (secondsAgo >= DAY && secondsAgo < WEEK) {
			timeAgo = secondsAgo/DAY;
			unit = "days";
		} else if (secondsAgo >= WEEK && secondsAgo < YEAR) {
			timeAgo = secondsAgo/WEEK;
			unit = "weeks";
		} else if (secondsAgo >= YEAR) {
			timeAgo = secondsAgo/YEAR;
			unit = "years";
		} 
			
		// Pluralize (or not, if necessary)
		if (Math.floor(timeAgo) == 1)
			unit = unit.substr(0, unit.length - 1);
		
		timeAgo = Math.floor(timeAgo) + " " + unit + " ago";
		
		return timeAgo;
	}
});