System.register(['test/js/TestInitializer', 'common/warning/WarningModule'], function (_export) {
    'use strict';

    var warningModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonWarningWarningModule) {
            warningModule = _commonWarningWarningModule['default'];
        }],
        execute: function () {

            describe('RefreshWarningDirective', function () {
                var element, $scope, $window, $compile;

                //returns dom code for an sp-refresh-warning element
                function getElementDefintion(msg) {
                    return angular.isDefined(msg) ? '<sp-refresh-warning sp-warning-message="' + msg + '"/>' : '<sp-refresh-warning />';
                }

                beforeEach(module(warningModule));
                beforeEach(inject(function (_$compile_, $rootScope, _$window_) {
                    $scope = $rootScope;
                    $compile = _$compile_;
                    $window = _$window_;

                    element = angular.element(getElementDefintion());
                    //add element to the dom
                    element.appendTo(document.body);
                    $compile(element)($scope);
                    $scope.$apply();
                }));

                it('should define onbeforeunload when placed in the dom', function () {
                    expect($window.onbeforeunload).toBeDefined();
                    expect(typeof $window.onbeforeunload).toEqual('function');
                    expect($window.onbeforeunload()).toEqual('#{msgs.ui_refresh_warning}');
                    //remove element and trigger destroy function for cleanup
                    element.remove();
                    $scope.$destroy();
                });

                it('should reset onbeforeunload removed from the dom', function () {
                    expect($window.onbeforeunload).toBeDefined();
                    expect(typeof $window.onbeforeunload).toEqual('function');
                    expect($window.onbeforeunload()).toEqual('#{msgs.ui_refresh_warning}');

                    //remove element and trigger destroy function
                    element.remove();
                    $scope.$destroy();

                    //expect onbeforeunload to be reset to an empty function
                    expect($window.onbeforeunload).toBeDefined();
                    expect(typeof $window.onbeforeunload).toEqual('function');
                    expect($window.onbeforeunload()).not.toBeDefined();
                });

                it('should reset override service when removed from the dom', function () {
                    var overrideService;
                    inject(function (refreshWarningOverrideService) {
                        overrideService = refreshWarningOverrideService;
                    });
                    expect($window.onbeforeunload).toBeDefined();
                    expect(typeof $window.onbeforeunload).toEqual('function');
                    expect($window.onbeforeunload()).toEqual('#{msgs.ui_refresh_warning}');

                    overrideService.enableOverride();
                    expect($window.onbeforeunload()).not.toBeDefined();
                    expect(overrideService.isOverride()).toBeTruthy();

                    //remove element and trigger destroy function
                    element.remove();
                    $scope.$destroy();

                    //expect onbeforeunload to be reset to an empty function
                    expect(overrideService.isOverride()).toBeFalsy();
                });

                it('should not trigger if the override is enabled', function () {
                    var overrideService;
                    inject(function (refreshWarningOverrideService) {
                        overrideService = refreshWarningOverrideService;
                    });
                    expect($window.onbeforeunload).toBeDefined();
                    expect(typeof $window.onbeforeunload).toEqual('function');
                    expect($window.onbeforeunload()).toEqual('#{msgs.ui_refresh_warning}');
                    overrideService.enableOverride();
                    expect($window.onbeforeunload()).not.toBeDefined();
                    //remove element and trigger destroy function for cleanup
                    element.remove();
                    $scope.$destroy();
                });

                it('should use message if provided', function () {
                    var warningMessage = 'some new warning';

                    //remove default element and trigger destroy function for cleanup
                    element.remove();
                    $scope.$destroy();

                    element = angular.element(getElementDefintion(warningMessage));
                    //add element to the dom
                    element.appendTo(document.body);
                    $compile(element)($scope);
                    $scope.$apply();

                    expect($window.onbeforeunload()).toEqual(warningMessage);
                    //remove element and trigger destroy function for cleanup
                    element.remove();
                    $scope.$destroy();
                });

                describe('windows phone', function () {
                    it('should not define onbeforeunload when user agent is windows phone', inject(function (browserUtil) {

                        element.remove();
                        $scope.$destroy();
                        $window.onbeforeunload = null;

                        spyOn(browserUtil, 'isWindowsPhone').and.callFake(function () {
                            return true;
                        });

                        element = angular.element(getElementDefintion());
                        //add element to the dom
                        element.appendTo(document.body);
                        $compile(element)($scope);
                        $scope.$apply();

                        expect($window.onbeforeunload).toBeNull();
                        element.remove();
                        $scope.$destroy();
                    }));
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9yZWZyZXNoV2FybmluZy9SZWZyZXNoV2FybmluZ0RpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixpQ0FBaUMsVUFBVSxTQUFTO0lBQWhHOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSw2QkFBNkI7WUFDbkYsZ0JBQWdCLDRCQUE0Qjs7UUFFaEQsU0FBUyxZQUFZOztZQUg3QixTQUFTLDJCQUEyQixZQUFXO2dCQUMzQyxJQUFJLFNBQVMsUUFBUSxTQUFTOzs7Z0JBRzlCLFNBQVMsb0JBQW9CLEtBQUs7b0JBQzlCLE9BQU8sUUFBUyxVQUFVLE9BQ3RCLDZDQUE2QyxNQUFNLFFBQVE7OztnQkFJbkUsV0FBVyxPQUFPO2dCQUNsQixXQUFXLE9BQU8sVUFBUyxZQUFZLFlBQVksV0FBVztvQkFDMUQsU0FBUztvQkFDVCxXQUFXO29CQUNYLFVBQVU7O29CQUVWLFVBQVUsUUFBUSxRQUFROztvQkFFMUIsUUFBUSxTQUFTLFNBQVM7b0JBQzFCLFNBQVMsU0FBUztvQkFDbEIsT0FBTzs7O2dCQUdYLEdBQUcsdURBQXVELFlBQVc7b0JBQ2pFLE9BQU8sUUFBUSxnQkFBZ0I7b0JBQy9CLE9BQU8sT0FBTyxRQUFRLGdCQUFnQixRQUFRO29CQUM5QyxPQUFPLFFBQVEsa0JBQWtCLFFBQVE7O29CQUV6QyxRQUFRO29CQUNSLE9BQU87OztnQkFHWCxHQUFHLG9EQUFvRCxZQUFXO29CQUM5RCxPQUFPLFFBQVEsZ0JBQWdCO29CQUMvQixPQUFPLE9BQU8sUUFBUSxnQkFBZ0IsUUFBUTtvQkFDOUMsT0FBTyxRQUFRLGtCQUFrQixRQUFROzs7b0JBR3pDLFFBQVE7b0JBQ1IsT0FBTzs7O29CQUdQLE9BQU8sUUFBUSxnQkFBZ0I7b0JBQy9CLE9BQU8sT0FBTyxRQUFRLGdCQUFnQixRQUFRO29CQUM5QyxPQUFPLFFBQVEsa0JBQWtCLElBQUk7OztnQkFHekMsR0FBRywyREFBMkQsWUFBVztvQkFDckUsSUFBSTtvQkFDSixPQUFPLFVBQVMsK0JBQStCO3dCQUMzQyxrQkFBa0I7O29CQUV0QixPQUFPLFFBQVEsZ0JBQWdCO29CQUMvQixPQUFPLE9BQU8sUUFBUSxnQkFBZ0IsUUFBUTtvQkFDOUMsT0FBTyxRQUFRLGtCQUFrQixRQUFROztvQkFFekMsZ0JBQWdCO29CQUNoQixPQUFPLFFBQVEsa0JBQWtCLElBQUk7b0JBQ3JDLE9BQU8sZ0JBQWdCLGNBQWM7OztvQkFHckMsUUFBUTtvQkFDUixPQUFPOzs7b0JBR1AsT0FBTyxnQkFBZ0IsY0FBYzs7O2dCQUd6QyxHQUFHLGlEQUFpRCxZQUFXO29CQUMzRCxJQUFJO29CQUNKLE9BQU8sVUFBUywrQkFBK0I7d0JBQzNDLGtCQUFrQjs7b0JBRXRCLE9BQU8sUUFBUSxnQkFBZ0I7b0JBQy9CLE9BQU8sT0FBTyxRQUFRLGdCQUFnQixRQUFRO29CQUM5QyxPQUFPLFFBQVEsa0JBQWtCLFFBQVE7b0JBQ3pDLGdCQUFnQjtvQkFDaEIsT0FBTyxRQUFRLGtCQUFrQixJQUFJOztvQkFFckMsUUFBUTtvQkFDUixPQUFPOzs7Z0JBR1gsR0FBRyxrQ0FBa0MsWUFBVztvQkFDNUMsSUFBSSxpQkFBaUI7OztvQkFHckIsUUFBUTtvQkFDUixPQUFPOztvQkFFUCxVQUFVLFFBQVEsUUFBUSxvQkFBb0I7O29CQUU5QyxRQUFRLFNBQVMsU0FBUztvQkFDMUIsU0FBUyxTQUFTO29CQUNsQixPQUFPOztvQkFFUCxPQUFPLFFBQVEsa0JBQWtCLFFBQVE7O29CQUV6QyxRQUFRO29CQUNSLE9BQU87OztnQkFJWCxTQUFTLGlCQUFpQixZQUFXO29CQUNqQyxHQUFHLHFFQUNDLE9BQU8sVUFBUyxhQUFhOzt3QkFFekIsUUFBUTt3QkFDUixPQUFPO3dCQUNQLFFBQVEsaUJBQWlCOzt3QkFFekIsTUFBTSxhQUFhLGtCQUFrQixJQUFJLFNBQVMsWUFBVzs0QkFBRSxPQUFPOzs7d0JBRXRFLFVBQVUsUUFBUSxRQUFROzt3QkFFMUIsUUFBUSxTQUFTLFNBQVM7d0JBQzFCLFNBQVMsU0FBUzt3QkFDbEIsT0FBTzs7d0JBRVAsT0FBTyxRQUFRLGdCQUFnQjt3QkFDL0IsUUFBUTt3QkFDUixPQUFPOzs7Ozs7R0FTcEIiLCJmaWxlIjoiY29tbW9uL3JlZnJlc2hXYXJuaW5nL1JlZnJlc2hXYXJuaW5nRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHdhcm5pbmdNb2R1bGUgZnJvbSAnY29tbW9uL3dhcm5pbmcvV2FybmluZ01vZHVsZSc7XG5cbmRlc2NyaWJlKCdSZWZyZXNoV2FybmluZ0RpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVtZW50LCAkc2NvcGUsICR3aW5kb3csICRjb21waWxlO1xuXG4gICAgLy9yZXR1cm5zIGRvbSBjb2RlIGZvciBhbiBzcC1yZWZyZXNoLXdhcm5pbmcgZWxlbWVudFxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnREZWZpbnRpb24obXNnKSB7XG4gICAgICAgIHJldHVybiAoYW5ndWxhci5pc0RlZmluZWQobXNnKSkgP1xuICAgICAgICAgICAgJzxzcC1yZWZyZXNoLXdhcm5pbmcgc3Atd2FybmluZy1tZXNzYWdlPVwiJyArIG1zZyArICdcIi8+JyA6ICc8c3AtcmVmcmVzaC13YXJuaW5nIC8+JztcblxuICAgIH1cblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdhcm5pbmdNb2R1bGUpKTtcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbXBpbGVfLCAkcm9vdFNjb3BlLCBfJHdpbmRvd18pIHtcbiAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuICAgICAgICAkd2luZG93ID0gXyR3aW5kb3dfO1xuXG4gICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZ2V0RWxlbWVudERlZmludGlvbigpKTtcbiAgICAgICAgLy9hZGQgZWxlbWVudCB0byB0aGUgZG9tXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRlZmluZSBvbmJlZm9yZXVubG9hZCB3aGVuIHBsYWNlZCBpbiB0aGUgZG9tJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCgkd2luZG93Lm9uYmVmb3JldW5sb2FkKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QodHlwZW9mICR3aW5kb3cub25iZWZvcmV1bmxvYWQpLnRvRXF1YWwoJ2Z1bmN0aW9uJyk7XG4gICAgICAgIGV4cGVjdCgkd2luZG93Lm9uYmVmb3JldW5sb2FkKCkpLnRvRXF1YWwoJyN7bXNncy51aV9yZWZyZXNoX3dhcm5pbmd9Jyk7XG4gICAgICAgIC8vcmVtb3ZlIGVsZW1lbnQgYW5kIHRyaWdnZXIgZGVzdHJveSBmdW5jdGlvbiBmb3IgY2xlYW51cFxuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAkc2NvcGUuJGRlc3Ryb3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVzZXQgb25iZWZvcmV1bmxvYWQgcmVtb3ZlZCBmcm9tIHRoZSBkb20nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdCh0eXBlb2YgJHdpbmRvdy5vbmJlZm9yZXVubG9hZCkudG9FcXVhbCgnZnVuY3Rpb24nKTtcbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQoKSkudG9FcXVhbCgnI3ttc2dzLnVpX3JlZnJlc2hfd2FybmluZ30nKTtcblxuICAgICAgICAvL3JlbW92ZSBlbGVtZW50IGFuZCB0cmlnZ2VyIGRlc3Ryb3kgZnVuY3Rpb25cbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgJHNjb3BlLiRkZXN0cm95KCk7XG5cbiAgICAgICAgLy9leHBlY3Qgb25iZWZvcmV1bmxvYWQgdG8gYmUgcmVzZXQgdG8gYW4gZW1wdHkgZnVuY3Rpb25cbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdCh0eXBlb2YgJHdpbmRvdy5vbmJlZm9yZXVubG9hZCkudG9FcXVhbCgnZnVuY3Rpb24nKTtcbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQoKSkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlc2V0IG92ZXJyaWRlIHNlcnZpY2Ugd2hlbiByZW1vdmVkIGZyb20gdGhlIGRvbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3ZlcnJpZGVTZXJ2aWNlO1xuICAgICAgICBpbmplY3QoZnVuY3Rpb24ocmVmcmVzaFdhcm5pbmdPdmVycmlkZVNlcnZpY2UpIHtcbiAgICAgICAgICAgIG92ZXJyaWRlU2VydmljZSA9IHJlZnJlc2hXYXJuaW5nT3ZlcnJpZGVTZXJ2aWNlO1xuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdCh0eXBlb2YgJHdpbmRvdy5vbmJlZm9yZXVubG9hZCkudG9FcXVhbCgnZnVuY3Rpb24nKTtcbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQoKSkudG9FcXVhbCgnI3ttc2dzLnVpX3JlZnJlc2hfd2FybmluZ30nKTtcblxuICAgICAgICBvdmVycmlkZVNlcnZpY2UuZW5hYmxlT3ZlcnJpZGUoKTtcbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQoKSkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChvdmVycmlkZVNlcnZpY2UuaXNPdmVycmlkZSgpKS50b0JlVHJ1dGh5KCk7XG5cbiAgICAgICAgLy9yZW1vdmUgZWxlbWVudCBhbmQgdHJpZ2dlciBkZXN0cm95IGZ1bmN0aW9uXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICRzY29wZS4kZGVzdHJveSgpO1xuXG4gICAgICAgIC8vZXhwZWN0IG9uYmVmb3JldW5sb2FkIHRvIGJlIHJlc2V0IHRvIGFuIGVtcHR5IGZ1bmN0aW9uXG4gICAgICAgIGV4cGVjdChvdmVycmlkZVNlcnZpY2UuaXNPdmVycmlkZSgpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHRyaWdnZXIgaWYgdGhlIG92ZXJyaWRlIGlzIGVuYWJsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG92ZXJyaWRlU2VydmljZTtcbiAgICAgICAgaW5qZWN0KGZ1bmN0aW9uKHJlZnJlc2hXYXJuaW5nT3ZlcnJpZGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICBvdmVycmlkZVNlcnZpY2UgPSByZWZyZXNoV2FybmluZ092ZXJyaWRlU2VydmljZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCgkd2luZG93Lm9uYmVmb3JldW5sb2FkKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QodHlwZW9mICR3aW5kb3cub25iZWZvcmV1bmxvYWQpLnRvRXF1YWwoJ2Z1bmN0aW9uJyk7XG4gICAgICAgIGV4cGVjdCgkd2luZG93Lm9uYmVmb3JldW5sb2FkKCkpLnRvRXF1YWwoJyN7bXNncy51aV9yZWZyZXNoX3dhcm5pbmd9Jyk7XG4gICAgICAgIG92ZXJyaWRlU2VydmljZS5lbmFibGVPdmVycmlkZSgpO1xuICAgICAgICBleHBlY3QoJHdpbmRvdy5vbmJlZm9yZXVubG9hZCgpKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgLy9yZW1vdmUgZWxlbWVudCBhbmQgdHJpZ2dlciBkZXN0cm95IGZ1bmN0aW9uIGZvciBjbGVhbnVwXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICRzY29wZS4kZGVzdHJveSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgbWVzc2FnZSBpZiBwcm92aWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgd2FybmluZ01lc3NhZ2UgPSAnc29tZSBuZXcgd2FybmluZyc7XG5cbiAgICAgICAgLy9yZW1vdmUgZGVmYXVsdCBlbGVtZW50IGFuZCB0cmlnZ2VyIGRlc3Ryb3kgZnVuY3Rpb24gZm9yIGNsZWFudXBcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgJHNjb3BlLiRkZXN0cm95KCk7XG5cbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChnZXRFbGVtZW50RGVmaW50aW9uKHdhcm5pbmdNZXNzYWdlKSk7XG4gICAgICAgIC8vYWRkIGVsZW1lbnQgdG8gdGhlIGRvbVxuICAgICAgICBlbGVtZW50LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQoKSkudG9FcXVhbCh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICAgIC8vcmVtb3ZlIGVsZW1lbnQgYW5kIHRyaWdnZXIgZGVzdHJveSBmdW5jdGlvbiBmb3IgY2xlYW51cFxuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAkc2NvcGUuJGRlc3Ryb3koKTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpbmRvd3MgcGhvbmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgZGVmaW5lIG9uYmVmb3JldW5sb2FkIHdoZW4gdXNlciBhZ2VudCBpcyB3aW5kb3dzIHBob25lJyxcbiAgICAgICAgICAgIGluamVjdChmdW5jdGlvbihicm93c2VyVXRpbCkge1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkd2luZG93Lm9uYmVmb3JldW5sb2FkID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHNweU9uKGJyb3dzZXJVdGlsLCAnaXNXaW5kb3dzUGhvbmUnKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9KTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZ2V0RWxlbWVudERlZmludGlvbigpKTtcbiAgICAgICAgICAgICAgICAvL2FkZCBlbGVtZW50IHRvIHRoZSBkb21cbiAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KCR3aW5kb3cub25iZWZvcmV1bmxvYWQpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
