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
                scope.$emit('pInput initiated');
            }, 0);
        }
    }
});

promiser.directive('pInputCloak', function ($filter) {

    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            var visibility = elm.css('visibility'),
                numPInputs = $(elm).find("[p-input]").length,
                numPInputInits = 0;
            
            elm.css('visibility', 'hidden');
            
            scope.$on('pInput initiated', function () {
                if (numPInputInits == numPInputs) elm.css('visibility', visibility);
                numPInputInits++;
            });
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
                    if (viewValue.match(/[0-9]/g) == null) {
                        ctrl.$viewValue = "";
                        ctrl.$render();
                    } else {
    	                ctrl.$viewValue = $filter('number')(viewValue.match(/[0-9]/g).join(""));
    	                ctrl.$render();
                    }

	                setTimeout(function () { console.dir(ctrl) }, 0);

	                return ctrl.$viewValue;
	            }
            });
		}
	}
});

promiser.directive('pNotZero', function ($filter) {

    // Only allow integers

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(function(viewValue) {

                if (viewValue < 1) {
                    ctrl.$setValidity('zero', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('zero', true);
                    return viewValue;
                }
            });
        }
    }
});

promiser.directive('uiValidateFormRequirements', function() {
    return {
        require: '^form',
        link: function(scope, elm, attrs, ctrl) {
            console.dir(ctrl);

            elm.bind('click', function (e) {
                if (ctrl.$invalid) {
                    console.log("Making the form dirty, hehe.");
                    ctrl.$setDirty();
                    // Making all required fields dirty.
                    var field;
                    for (var i=0; i<ctrl.$error.required.length; i++) {
                        console.dir(ctrl.$error.required[i].$name);
                        field = ctrl.$error.required[i].$name;
                        ctrl[field].$dirty = 1;
                    }

                    if (ctrl.$error.required) scope.error = 'All fields are required :/';
                    else if (ctrl.$error.zero) scope.error = "Really? Within 0 days?";
                    else if (ctrl.$error.email) scope.error = "Those don't look like emails...";
                    else scope.error = null;

                    if (!scope.$$phase) scope.$digest();
                    
                    e.preventDefault();
                } else {
                    scope.error = null;
                    console.log("You are good to go.");
                    //ctrl.$setPristine();
                    //console.dir(ctrl);
                }
            });
        }
    };
});