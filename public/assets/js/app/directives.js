'use strict';

/* Directives */

promiser.directive('pInput', function ($timeout) {

    // Grow input box to match the size of its value

	return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1000,
        link: function (scope, elm, attrs, ctrl) { 
            // scope - used for logic
            // elm - used for DOM manipulation (it's like a jQuery object)
            // attrs - all of the attributes on the tag this directive is attached too
            // ctrl - in this case, ngModel, is used to access the parsers, which filter all input

            console.log("PINPUT");

			var minWidth, maxWidth, comfortZone, testSubject;

			function prepTester() {
				minWidth = 10 || elm.width();
				maxWidth = 400;
				comfortZone = 1;
                testSubject = angular.element('<tester/>').css({
                    position: 'absolute',
                    top: -9999,
                    left: -9999,
                    width: 'auto',
                    fontSize: elm.css('fontSize'),
                    fontFamily: elm.css('fontFamily'),
                    fontWeight: elm.css('fontWeight'),
                    letterSpacing: elm.css('letterSpacing'),
                    whiteSpace: 'pre' // Don't collapse white space
                })
            }

            function check() {
                console.log("PINPUT1");
                console.log(elm.val());
        		var value = angular.equals(elm.val(), '') ? (angular.equals(attrs.placeholder, undefined) ? '' : attrs.placeholder) : elm.val();

                // Enter new content into testSubject
                //var escaped = value.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                testSubject.html(value);

                // Calculate new width + whether to change
                var testerWidth = testSubject.width,
                    newWidth = (testerWidth + comfortZone) >= minWidth ? testerWidth + comfortZone : minWidth,
                    currentWidth = elm.width,
                    isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                         || (newWidth > minWidth && newWidth < maxWidth);

                // Animate width
                if (isValidWidthChange) {
                    elm.width(newWidth);
                }

            }

            // Using ngModel's parsers eliminates the flickering caused by just binding events
            ctrl.$parsers.unshift(function (viewValue) {
                console.dir(ctrl);
                console.dir(document.forms['promise']['type']);
                check();
                return viewValue;
            });

            // This timeout of 0 is weird workaround, but it works...
            // Otherwise, the DOM won't quite be ready
            setTimeout(function () { 
            	prepTester()
            	elm.after(testSubject);
            	check() 
                scope.$emit('pInput initiated');
            }, 0);
        }
    }
});

promiser.directive('pInputCloak', function ($filter) {

    // Cloak element until all child elements with 'pInput' attribute are initialized

    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            scope.visibility = elm.css('visibility');
            scope.numPInputs = elm.children("[p-input]").length;
            scope.numPInputInits = 0;
            
            scope.hide = function () { 
                console.log("HIDE");
                elm.css('visibility', 'hidden'); }
            scope.revert = function (visibility) { 
                console.log("REVERT");
                elm.css('visibility', visibility); }
            
            scope.$on('pInput initiated', function () {
                scope.numPInputInits++;
                if (scope.numPInputInits == scope.numPInputs) scope.revert(scope.visibility);
                console.log("pInput initiated - " + scope.numPInputInits + " - " + scope.numPInputs);
            });

            scope.hide();

            if (!scope.$$phase) scope.$digest();
        }
    }
});

promiser.directive('pNumber', function ($filter) {

	// Only allow integers
    // Format them with ',' group separators

	return {
        restrict: 'A',
        require: 'ngModel',
        priority: 0,
        scope: true,
        link: function (scope, elm, attrs, ctrl) {

            if (attrs.pNumber !== undefined) {
                switch (attrs.pNumber) {
                    case 'dollars' :
                        scope.unit = '$';
                        break;
                    default:
                        scope.unit = '';
                        break;
                }
            }

            ctrl.$parsers.unshift(function(viewValue) {
                //console.log("NUMBER PARSERS - %s", viewValue);

            	if (viewValue) {
                    if (viewValue.match(/[0-9]/g) == null) {
                        viewValue = "";
                        ctrl.$viewValue = viewValue;
                    } else {
                        viewValue = viewValue.match(/[0-9]/g).join("");
    	                ctrl.$viewValue = scope.unit + $filter('number')(viewValue);
                    }
                    
                    ctrl.$render();

	                return viewValue;
	            }
            });

            ctrl.$formatters.push(function(modelValue) {
                //console.log("NUMBER FORMATTERS - %s", modelValue);
                return modelValue ? scope.unit + $filter('number')(modelValue) : null;
            });
		}
	}
});

promiser.directive('pNotZero', function ($filter) {

    // Only allow integers

    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 100,
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(function(viewValue) {

                if (viewValue == 0) {
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

promiser.directive('pValidateFormRequirements', function() {
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