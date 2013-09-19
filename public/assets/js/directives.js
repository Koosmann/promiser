'use strict';

/* Directives */

promiser.directive('pInput', function ($timeout) {

	return {
        restrict: 'A',
        require: '^form',
        link: function (scope, elm, attrs, ctrl) { // scope - used for logic / elm - used for DOM manipulation (it's like a jQuery object) / attrs - used as options (they're all of the attributes on the tag this directive is attached too)
			var minWidth, maxWidth, comfortZone, testSubject;

			function prepTester() {
				minWidth = 10 || elm.width();
				maxWidth = 400;
				comfortZone = 1;
                testSubject = $('<tester/>').css({
                    position: 'absolute',
                    top: -9999,
                    left: -9999,
                    width: 'auto',
                    fontSize: elm.css('fontSize'),
                    fontFamily: elm.css('fontFamily'),
                    fontWeight: elm.css('fontWeight'),
                    letterSpacing: elm.css('letterSpacing'),
                    whiteSpace: 'nowrap'
                })
            }

            function check() {
        		var value = angular.equals(elm.val(), "") ? attrs.placeholder : elm.val();

                // Enter new content into testSubject
                //var escaped = value.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                testSubject.html(value);

                // Calculate new width + whether to change
                var testerWidth = testSubject.width(),
                    newWidth = (testerWidth + comfortZone) >= minWidth ? testerWidth + comfortZone : minWidth,
                    currentWidth = elm.width(),
                    isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                         || (newWidth > minWidth && newWidth < maxWidth);

                // Animate width
                if (isValidWidthChange) {
                    elm.width(newWidth);
                }

            }

            elm.bind('keyup keydown blur update', function () {
            	check();
            });

            setTimeout(function () { 
            	prepTester()
            	testSubject.insertAfter(elm);
            	check() 
            }, 0);
        }
    }
});

promiser.directive('pInt', function ($filter) {

	// Only allow integers

	return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(function(viewValue) {

            	if (viewValue) {
	                ctrl.$viewValue = $filter('number')(viewValue.match(/\d/g).join(""));
	                ctrl.$render();

	                setTimeout(function () { console.dir(ctrl) }, 0);

	                return viewValue.match(/\d/g).join("");
	            }
            });
		}
	}
});