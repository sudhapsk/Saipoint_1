System.register(['test/js/TestInitializer', 'common/modal/ModalModule'], function (_export) {
    'use strict';

    var modalModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonModalModalModule) {
            modalModule = _commonModalModalModule['default'];
        }],
        execute: function () {

            describe('SunriseDialogCtrlTest', function () {

                var $controller,
                    $modalInstance,
                    today = new Date(new Date().setHours(0, 0, 0, 0)),
                    twoDays = 172800000;

                function createController(sunriseDate, sunsetDate) {
                    return $controller('SunriseDialogCtrl', {
                        sunriseDate: sunriseDate,
                        sunsetDate: sunsetDate,
                        $modalInstance: $modalInstance
                    });
                }

                // Let the tests know we'll use the modal module.
                beforeEach(module(modalModule));

                /**
                 * Setup the mocks for our tests.
                 */
                beforeEach(inject(function (_$controller_) {
                    $controller = _$controller_;

                    $modalInstance = {
                        close: jasmine.createSpy(),
                        dismiss: jasmine.createSpy()
                    };
                }));

                describe('initialize minimums', function () {

                    it('should setup the min sunrise date to be today', function () {
                        var ctrl = createController(undefined, undefined);
                        expect(ctrl.sunriseMin).toEqual(today);
                    });

                    it('should setup the min sunset date to be today if no sunrise date', function () {
                        var ctrl = createController(undefined, undefined);
                        expect(ctrl.sunsetMin).toEqual(today);
                    });

                    it('should setup the min sunset date to the sunrise date if the sunrise date is set and it is after today', function () {
                        var sunrise = new Date(today.getTime() + twoDays),
                            ctrl = createController(sunrise, undefined);

                        ctrl.calcSunsetMin();
                        expect(ctrl.sunsetMin).toEqual(sunrise);
                    });

                    it('should setup the min sunset date to today if the sunrise date is set and it is before today', function () {
                        var sunrise = new Date(today.getTime() - twoDays),
                            ctrl = createController(sunrise, undefined);
                        expect(ctrl.sunsetMin).toEqual(today);
                    });

                    it('should update the sunset min when the sunrise is altered', function () {
                        var sunriseDate = new Date(today.getTime() - twoDays),
                            ctrl = createController(sunriseDate, undefined);

                        ctrl.calcSunsetMin();
                        expect(ctrl.sunsetMin).toEqual(today);
                        expect(ctrl.sunriseDate.getTime()).toEqual(sunriseDate.getTime());

                        ctrl.sunriseDate = new Date(today.getTime() + twoDays);

                        ctrl.calcSunsetMin();
                        expect(ctrl.sunsetMin.getTime()).toEqual(ctrl.sunriseDate.getTime());
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9tb2RhbC9TdW5yaXNlRGlhbG9nQ3RybFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw2QkFBNkIsVUFBVSxTQUFTO0lBQ3hGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsY0FBYyx3QkFBd0I7O1FBRTFDLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyx5QkFBeUIsWUFBVzs7Z0JBRXpDLElBQUk7b0JBQWE7b0JBQ2IsUUFBUSxJQUFJLEtBQUssSUFBSSxPQUFPLFNBQVMsR0FBRyxHQUFHLEdBQUc7b0JBQzlDLFVBQVU7O2dCQUVkLFNBQVMsaUJBQWlCLGFBQWEsWUFBWTtvQkFDL0MsT0FBTyxZQUFZLHFCQUFxQjt3QkFDcEMsYUFBYTt3QkFDYixZQUFZO3dCQUNaLGdCQUFnQjs7Ozs7Z0JBS3hCLFdBQVcsT0FBTzs7Ozs7Z0JBS2xCLFdBQVcsT0FBTyxVQUFTLGVBQWU7b0JBQ3RDLGNBQWM7O29CQUVkLGlCQUFpQjt3QkFDYixPQUFPLFFBQVE7d0JBQ2YsU0FBUyxRQUFROzs7O2dCQUl6QixTQUFTLHVCQUF1QixZQUFXOztvQkFFdkMsR0FBRyxpREFBaUQsWUFBVzt3QkFDM0QsSUFBSSxPQUFPLGlCQUFpQixXQUFXO3dCQUN2QyxPQUFPLEtBQUssWUFBWSxRQUFROzs7b0JBR3BDLEdBQUcsbUVBQW1FLFlBQVc7d0JBQzdFLElBQUksT0FBTyxpQkFBaUIsV0FBVzt3QkFDdkMsT0FBTyxLQUFLLFdBQVcsUUFBUTs7O29CQUduQyxHQUFHLHlHQUNDLFlBQVc7d0JBQ1gsSUFBSSxVQUFVLElBQUksS0FBSyxNQUFNLFlBQVk7NEJBQ3JDLE9BQU8saUJBQWlCLFNBQVM7O3dCQUVyQyxLQUFLO3dCQUNMLE9BQU8sS0FBSyxXQUFXLFFBQVE7OztvQkFHbkMsR0FBRywrRkFBK0YsWUFBVzt3QkFDekcsSUFBSSxVQUFVLElBQUksS0FBSyxNQUFNLFlBQVk7NEJBQ3JDLE9BQU8saUJBQWlCLFNBQVM7d0JBQ3JDLE9BQU8sS0FBSyxXQUFXLFFBQVE7OztvQkFHbkMsR0FBRyw0REFBNEQsWUFBVzt3QkFDdEUsSUFBSSxjQUFjLElBQUksS0FBSyxNQUFNLFlBQVk7NEJBQ3pDLE9BQU8saUJBQWlCLGFBQWE7O3dCQUV6QyxLQUFLO3dCQUNMLE9BQU8sS0FBSyxXQUFXLFFBQVE7d0JBQy9CLE9BQU8sS0FBSyxZQUFZLFdBQVcsUUFBUSxZQUFZOzt3QkFFdkQsS0FBSyxjQUFjLElBQUksS0FBSyxNQUFNLFlBQVk7O3dCQUU5QyxLQUFLO3dCQUNMLE9BQU8sS0FBSyxVQUFVLFdBQVcsUUFBUSxLQUFLLFlBQVk7Ozs7OztHQWFuRSIsImZpbGUiOiJjb21tb24vbW9kYWwvU3VucmlzZURpYWxvZ0N0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IG1vZGFsTW9kdWxlIGZyb20gJ2NvbW1vbi9tb2RhbC9Nb2RhbE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdTdW5yaXNlRGlhbG9nQ3RybFRlc3QnLCBmdW5jdGlvbigpIHtcblxuICAgIHZhciAkY29udHJvbGxlciwgJG1vZGFsSW5zdGFuY2UsXG4gICAgICAgIHRvZGF5ID0gbmV3IERhdGUobmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSksXG4gICAgICAgIHR3b0RheXMgPSAxNzI4MDAwMDA7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKHN1bnJpc2VEYXRlLCBzdW5zZXREYXRlKSB7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignU3VucmlzZURpYWxvZ0N0cmwnLCB7XG4gICAgICAgICAgICBzdW5yaXNlRGF0ZTogc3VucmlzZURhdGUsXG4gICAgICAgICAgICBzdW5zZXREYXRlOiBzdW5zZXREYXRlLFxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2U6ICRtb2RhbEluc3RhbmNlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIExldCB0aGUgdGVzdHMga25vdyB3ZSdsbCB1c2UgdGhlIG1vZGFsIG1vZHVsZS5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShtb2RhbE1vZHVsZSkpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdGhlIG1vY2tzIGZvciBvdXIgdGVzdHMuXG4gICAgICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXykge1xuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XG5cbiAgICAgICAgJG1vZGFsSW5zdGFuY2UgPSB7XG4gICAgICAgICAgICBjbG9zZTogamFzbWluZS5jcmVhdGVTcHkoKSxcbiAgICAgICAgICAgIGRpc21pc3M6IGphc21pbmUuY3JlYXRlU3B5KClcbiAgICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnaW5pdGlhbGl6ZSBtaW5pbXVtcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KCdzaG91bGQgc2V0dXAgdGhlIG1pbiBzdW5yaXNlIGRhdGUgdG8gYmUgdG9kYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjdHJsID0gY3JlYXRlQ29udHJvbGxlcih1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdW5yaXNlTWluKS50b0VxdWFsKHRvZGF5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzZXR1cCB0aGUgbWluIHN1bnNldCBkYXRlIHRvIGJlIHRvZGF5IGlmIG5vIHN1bnJpc2UgZGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnN1bnNldE1pbikudG9FcXVhbCh0b2RheSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgc2V0dXAgdGhlIG1pbiBzdW5zZXQgZGF0ZSB0byB0aGUgc3VucmlzZSBkYXRlIGlmIHRoZSBzdW5yaXNlIGRhdGUgaXMgc2V0IGFuZCBpdCBpcyBhZnRlciB0b2RheScsXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzdW5yaXNlID0gbmV3IERhdGUodG9kYXkuZ2V0VGltZSgpICsgdHdvRGF5cyksXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoc3VucmlzZSwgdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgY3RybC5jYWxjU3Vuc2V0TWluKCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdW5zZXRNaW4pLnRvRXF1YWwoc3VucmlzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgc2V0dXAgdGhlIG1pbiBzdW5zZXQgZGF0ZSB0byB0b2RheSBpZiB0aGUgc3VucmlzZSBkYXRlIGlzIHNldCBhbmQgaXQgaXMgYmVmb3JlIHRvZGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc3VucmlzZSA9IG5ldyBEYXRlKHRvZGF5LmdldFRpbWUoKSAtIHR3b0RheXMpLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKHN1bnJpc2UsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdW5zZXRNaW4pLnRvRXF1YWwodG9kYXkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgc3Vuc2V0IG1pbiB3aGVuIHRoZSBzdW5yaXNlIGlzIGFsdGVyZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzdW5yaXNlRGF0ZSA9IG5ldyBEYXRlKHRvZGF5LmdldFRpbWUoKSAtIHR3b0RheXMpLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKHN1bnJpc2VEYXRlLCB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBjdHJsLmNhbGNTdW5zZXRNaW4oKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnN1bnNldE1pbikudG9FcXVhbCh0b2RheSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdW5yaXNlRGF0ZS5nZXRUaW1lKCkpLnRvRXF1YWwoc3VucmlzZURhdGUuZ2V0VGltZSgpKTtcblxuICAgICAgICAgICAgY3RybC5zdW5yaXNlRGF0ZSA9IG5ldyBEYXRlKHRvZGF5LmdldFRpbWUoKSArIHR3b0RheXMpO1xuXG4gICAgICAgICAgICBjdHJsLmNhbGNTdW5zZXRNaW4oKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnN1bnNldE1pbi5nZXRUaW1lKCkpLnRvRXF1YWwoY3RybC5zdW5yaXNlRGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
