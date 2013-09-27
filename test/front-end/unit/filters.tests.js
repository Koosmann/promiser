'use strict';

/* jasmine specs for filters go here */

describe('Filter', function() {
	beforeEach(angular.mock.module('Promiser'));

	describe('pluralizeDays', function() {
		it("should pluralize the word 'days'", inject(function(pluralizeDaysFilter) {
			expect(pluralizeDaysFilter(-10000000)).toEqual('days');
			expect(pluralizeDaysFilter(-2)).toEqual('days');
			expect(pluralizeDaysFilter(-1)).toEqual('day');
			expect(pluralizeDaysFilter(0)).toEqual('days');
			expect(pluralizeDaysFilter('less than one')).toEqual('day');
			expect(pluralizeDaysFilter(1)).toEqual('day');
			expect(pluralizeDaysFilter(2)).toEqual('days');
			expect(pluralizeDaysFilter(10000000)).toEqual('days');
		}));
	});

	describe('daysToGo', function() {
		var DAY = 1000*60*60*24; // milliseconds in a day

		it("should return the number of days from now to a given date", inject(function(daysToGoFilter) {
			expect(daysToGoFilter(new Date().setTime(new Date().getTime() - (DAY-DAY/2)))).toEqual(0); 						// in the past
			expect(daysToGoFilter(new Date())).toEqual(0); 																	// now
			expect(daysToGoFilter(new Date().setTime(new Date().getTime() + (DAY-DAY/2)))).toEqual('less than one');		// less than one day from now
			expect(daysToGoFilter(new Date().setTime(new Date().getTime() + (DAY+DAY/2)))).toEqual(1);						// one day from now
			expect(daysToGoFilter(new Date().setTime(new Date().getTime() + (DAY*2+DAY/2)))).toEqual(2);					// two days from now
			expect(daysToGoFilter(new Date().setTime(new Date().getTime() + (DAY*10000000+DAY/2)))).toEqual(10000000);		// many days from now
		}));
	});

	describe('timeAgo', function() {
		var SECOND = 	1000,
			MINUTE = 	1000*60,			// milliseconds in 1 minute
			HOUR = 		1000*60*60,			// milliseconds in 1 hour
			DAY = 		1000*60*60*24,		// milliseconds in 1 day
			WEEK = 		1000*60*60*24*7,	// milliseconds in 1 week
			YEAR = 		1000*60*60*24*7*52;	// milliseconds in 1 year

		it("should format the time since a given date", inject(function(timeAgoFilter) {
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() + SECOND))).toEqual('in the future!'); 	// in the future!

			expect(timeAgoFilter(new Date().setTime(new Date().getTime()))).toEqual('0 seconds ago'); 				// 0 seconds ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - SECOND))).toEqual('1 second ago'); 		// 1 second ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - SECOND*2))).toEqual('2 seconds ago'); 	// 2 seconds ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - SECOND*59))).toEqual('59 seconds ago'); 	// many seconds ago

			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - MINUTE))).toEqual('1 minute ago'); 		// 1 second ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - MINUTE*2))).toEqual('2 minutes ago'); 	// 2 seconds ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - MINUTE*59))).toEqual('59 minutes ago'); 	// many seconds ago

			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - HOUR))).toEqual('1 hour ago'); 			// 1 hour ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - HOUR*2))).toEqual('2 hours ago'); 		// 2 hours ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - HOUR*23))).toEqual('23 hours ago'); 		// many hours ago

			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - DAY))).toEqual('1 day ago'); 			// 1 day ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - DAY*2))).toEqual('2 days ago'); 			// 2 days ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - DAY*6))).toEqual('6 days ago'); 			// many days ago

			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - WEEK))).toEqual('1 week ago'); 			// 1 week ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - WEEK*2))).toEqual('2 weeks ago'); 		// 2 weeks ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - WEEK*51))).toEqual('51 weeks ago'); 		// many weeks ago

			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - YEAR))).toEqual('1 year ago'); 			// 1 year ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - YEAR*2))).toEqual('2 years ago'); 		// 2 years ago
			expect(timeAgoFilter(new Date().setTime(new Date().getTime() - YEAR*100))).toEqual('100 years ago'); 	// many years ago
		}));
	});
});