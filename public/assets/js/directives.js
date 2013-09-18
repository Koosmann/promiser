'use strict';

/* Directives */

promiser.directive('pInput', function ($compile) {

	return {
        restrict: 'C',
        scope: true,
        require: '^form',
        link: function (scope, elm, attrs) { // scope - used for logic / elm - used for DOM manipulation (it's like a jQuery object) / attrs - used as options (they're all of the attributes on the tag this directive is attached too)
        	var	original = elm.html();

        	scope.isInput = false;

        	// Turn the light blue 'fields' into actual inputs
        	elm.bind('click', function (e) {
	        	if (!scope.isInput) {
		        	scope.isInput = true;
		        	var width = elm.width();
		        	elm.html("<input name=" + attrs.pInputName + " placeholder='" + original + "' type='text'/>");

					var input = angular.element(elm.children()[0]);	
					
					// Initialize the size of the input to match the width of what it's relacing
					input.css('width', width);	        	
		        	
		        	input.autoGrowInput({
					    comfortZone: 20,
					    minWidth: width,
					    maxWidth: 400
					});

					input.focus()

					// Revert to original 'field' if empty
		        	input.blur(function(e) {
		        		if (input[0].value == "") {
		        			elm.html(original);
		        			scope.isInput = false;

		        			if (!scope.$$phase) scope.$digest(); // Calling this here so that the ngClass's that rely in isInput will register the change
		        		}
		        	});

		        	if (!scope.$$phase) scope.$digest(); // Same as a few lines above

				}
        	});
        }
    }
});