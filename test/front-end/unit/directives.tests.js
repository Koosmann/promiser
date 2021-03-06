'use strict';

/* jasmine specs for filters go here */

describe('Directive', function() {
	beforeEach(angular.mock.module('Promiser'));

	describe('pInput', function() {
		it("should...", inject(function() {
			
		}));
	});

	describe('pInputCloak', function() {
		var form, scope, element, flag;

		beforeEach(inject(function(pInputCloakDirective, pInputDirective, $compile, $rootScope) {
		    element = angular.element(
				'<div p-input-cloak style="visibility:visible;">' +
					'<input p-input ng-model="model.name" name="name" value="name" />' +
					'<input p-input ng-model="model.email" name="email" value="email" />' +
					'<input p-input ng-model="model.password" name="password" value="password" />' +
				'</div>'
			);

			scope = $rootScope;
			scope.model = { name: null, email: null, password: null };
			scope.$digest();

		    $compile(element)(scope);
		}));

		afterEach(function() {
		    element = null;
		});

		it("should store the elements original state of visibility", inject(function() {
			expect(scope.visibility).toBe('visible');
		}));

		it("should store the number of pInput elements", inject(function() {
			expect(scope.numPInputs).toBe(3);
		}));

		it("should hide element immediately", inject(function() {
			//spyOn(scope, 'revert').andCallThrough();  // This is already created too late... waiting for a SO answer...

			expect(scope.numPInputInits).toBe(0);
			//expect(scope.hide).toHaveBeenCalled();
			expect(element.css('visibility')).toBe('hidden');
		}));

		it("should keep count of how many pInputs are initalized", inject(function() {
			expect(scope.numPInputs).toBe(3);
		}));

		it("should revert element to original visibility when all pInputs are initalized", inject(function() {
			spyOn(scope, 'revert').andCallThrough();

			waitsFor(function () {
				return (scope.numPInputInits == scope.numPInputs);
			}, 'wait for pInputs to initialize', 1000);

			runs(function () {
				expect(scope.numPInputInits).toBe(3);
				expect(scope.revert).toHaveBeenCalledWith(scope.visibility);
				expect(element.css('visibility')).toBe('visible');
			});
		}));
	});

	describe('pNumber', function() {
		var form, scope, element;

		beforeEach(inject(function(pNumberDirective, $compile, $rootScope) {
		    element = angular.element(
				'<form name="form">' +
					'<input p-number ng-model="model.number" name="number" />' +
				'</form>'
			);

			scope = $rootScope;
			scope.model = { number: null };
			scope.$digest();
		    $compile(element)(scope);
		    form = scope.form;
		}));

		afterEach(function() {
		    element = null;
		});

		it("should only allow numbers in the model", function () {
			form.number.$setViewValue('m');
      		expect(form.number.$modelValue).toEqual('');

      		form.number.$setViewValue('1');
      		expect(form.number.$modelValue).toEqual('1');

      		form.number.$setViewValue('1m');
      		expect(form.number.$modelValue).toEqual('1');

      		form.number.$setViewValue('m1m');
      		expect(form.number.$modelValue).toEqual('1');

      		form.number.$setViewValue('0a1b2c3d4e5f6g7h8i9j');
      		expect(form.number.$modelValue).toEqual('0123456789');
		});

		it("should format the view value as a number with no decimals", function () {
			// Testing parsers
			form.number.$setViewValue('1111');
      		expect(form.number.$modelValue).toEqual('1111');
      		expect(form.number.$viewValue).toEqual('1,111');

      		form.number.$setViewValue('m1m3m1m1m');
      		expect(form.number.$modelValue).toEqual('1311');
      		expect(form.number.$viewValue).toEqual('1,311');	

      		// Testing formatters
      		scope.model = { number: '11121' };
			scope.$digest();
      		expect(form.number.$modelValue).toEqual('11121');
      		expect(form.number.$viewValue).toEqual('11,121');	
		});

		describe("when attribute 'p-number' is 'dollars'", function () {
			element = null;
			beforeEach(inject(function(pNumberDirective, $compile, $rootScope) {
			    element = angular.element(
					'<form name="form">' +
						'<input p-number="dollars" ng-model="model.number" name="number" />' +
					'</form>'
				);

				scope = $rootScope;
			    $compile(element)(scope);
			    form = scope.form;
			}));

			afterEach(function() {
			    element = null;
			});

			it("should add a '$' to beginning of view value if model is truthy", function () {
				// Testing parsers
				form.number.$setViewValue('');
	      		expect(form.number.$modelValue).toBeUndefined();
	      		expect(form.number.$viewValue).toEqual('');

	      		form.number.$setViewValue('m1m141m1m');
	      		expect(form.number.$modelValue).toEqual('11411');
	      		expect(form.number.$viewValue).toEqual('$11,411');

	      		// Testing formatters
				scope.model = { number: '' };
				scope.$digest();
	      		expect(form.number.$modelValue).toEqual('');
	      		expect(form.number.$viewValue).toBeNull();

				scope.model = { number: '1111' };
				scope.$digest();
	      		expect(form.number.$modelValue).toEqual('1111');
	      		expect(form.number.$viewValue).toEqual('$1,111');
			});
		})
	});

	describe('pNotZero', function() {
		var form, scope, element;

		beforeEach(inject(function(pNotZeroDirective, $compile, $rootScope) {
		    element = angular.element(
				'<form name="form">' +
					'<input p-not-zero ng-model="model.number" name="number" />' +
				'</form>'
			);

			scope = $rootScope;
			scope.model = { number: null }; // Note: this isn't needed here, but is needed in the pNumber tests
		    $compile(element)(scope);
		    form = scope.form;
		}));

		afterEach(function() {
		    element = null;
		});

		it("should be invalid when value is 0", function() {
			form.number.$setViewValue(0);
      		expect(form.number.$modelValue).toBeUndefined();
      		expect(form.number.$valid).toBe(false);
      		expect(form.$valid).toBe(false);
		});

		it("should be valid when value is not 0", function() {
			form.number.$setViewValue(1);
      		expect(form.number.$modelValue).toEqual(1);
      		expect(form.number.$valid).toBe(true);
      		expect(form.$valid).toBe(true);
		});
	});

	describe('pValidateFormRequirements', function() {
		it("should...", inject(function() {
			
		}));
	});
});