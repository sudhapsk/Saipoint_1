System.register(['test/js/TestInitializer', 'common/aria/AriaModule'], function (_export) {
    'use strict';

    var ariaModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonAriaAriaModule) {
            ariaModule = _commonAriaAriaModule['default'];
        }],
        execute: function () {

            describe('AriaErrorsDirective', function () {

                var errorMsg1 = 'HERE IS AN ERROR',
                    errorMsg2 = 'messed up again!',
                    template = '<div id="ariaErrorsTestDiv">' + '  <sp-aria-errors></sp-aria-errors>' + '  <div id="someError" class="reader-error" ng-show="showSomeError">' + errorMsg1 + '  </div>' + '  <div id="anotherError" class="reader-error" ng-show="showAnotherError">' + '    {{ scopeText }} ' + '  </div>' + '</div>',
                    templateWithSelector = '<div id="ariaErrorsTestDiv">' + '  <sp-aria-errors sp-selector="#someError"></sp-aria-errors>' + '  <div id="someError" ng-show="showAnotherError()">' + errorMsg1 + '  </div>' + '</div>',
                    alertElementSelector = 'div[role="alert"]',
                    scope,
                    compile,
                    timeoutService;

                beforeEach(module(ariaModule));

                beforeEach(inject(function ($rootScope, $compile, $timeout) {
                    compile = $compile;
                    scope = $rootScope.$new();
                    timeoutService = $timeout;
                    scope.showSomeError = false;
                    scope.showAnotherError = false;
                    scope.scopeText = errorMsg2;
                }));

                afterEach(function () {
                    // Remove anything we added to document
                    angular.element('#ariaErrorsTestDiv').remove();
                });

                var compileElement = function (template) {
                    var element = angular.element(template);

                    // Have to append it to the document before calling compile
                    // so angular.element calls in the directive will find the right stuff
                    angular.element(document.body).append(element);

                    compile(element)(scope);
                    scope.$apply();
                    timeoutService.flush();
                    return element;
                };

                it('should find the error divs with .reader-error', function () {
                    var element = compileElement(template);
                    expect(element.find(alertElementSelector).length).toBe(1);
                    expect(element.find(alertElementSelector).children('span').length).toBe(2);
                });

                it('should find error div if selector is defined', function () {
                    var element = compileElement(templateWithSelector);
                    expect(element.find(alertElementSelector).children('span').length).toBe(1);
                });

                it('should not contain error if hidden', function () {
                    var element = compileElement(template);
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg1)).toBe(-1);
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg2)).toBe(-1);
                });

                it('should contain error if shown', function () {
                    var element = compileElement(template);
                    scope.showSomeError = true;
                    // Need two cycles, one to update ng-show and one to trigger the $watch
                    scope.$apply();
                    scope.$apply();
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg1)).not.toBe(-1);
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg2)).toBe(-1);
                });

                it('should update error if text is changed', function () {
                    var element = compileElement(template),
                        errorMsg2Updated = 'whatever sucka';
                    scope.showAnotherError = true;
                    // Need two cycles, one to update ng-show and one to trigger the $watch
                    scope.$apply();
                    scope.$apply();
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg2)).not.toBe(-1);
                    scope.scopeText = errorMsg2Updated;
                    // Need two cycles, one to update ng-show and one to trigger the $watch
                    scope.$apply();
                    scope.$apply();
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg2)).toBe(-1);
                    expect(element.find(alertElementSelector).text().indexOf(errorMsg2Updated)).not.toBe(-1);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9hcmlhL0FyaWFFcnJvcnNEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLFVBQVUsU0FBUztJQUExRjs7SUFHSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsdUJBQXVCO1lBQzdFLGFBQWEsc0JBQXNCOztRQUV2QyxTQUFTLFlBQVk7O1lBSDdCLFNBQVMsdUJBQXVCLFlBQVc7O2dCQUV2QyxJQUFJLFlBQVk7b0JBQ1osWUFBWTtvQkFDWixXQUNJLGlDQUNBLHdDQUNBLHdFQUNLLFlBQ0wsYUFDQSw4RUFDQSx5QkFDQSxhQUNBO29CQUVKLHVCQUNJLGlDQUNBLGlFQUNBLHdEQUNJLFlBQ0osYUFDQTtvQkFFSix1QkFBdUI7b0JBQ3ZCO29CQUFPO29CQUFTOztnQkFFcEIsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsWUFBWSxVQUFVLFVBQVU7b0JBQ3ZELFVBQVU7b0JBQ1YsUUFBUSxXQUFXO29CQUNuQixpQkFBaUI7b0JBQ2pCLE1BQU0sZ0JBQWdCO29CQUN0QixNQUFNLG1CQUFtQjtvQkFDekIsTUFBTSxZQUFZOzs7Z0JBR3RCLFVBQVUsWUFBVzs7b0JBRWpCLFFBQVEsUUFBUSxzQkFBc0I7OztnQkFHMUMsSUFBSSxpQkFBaUIsVUFBUyxVQUFVO29CQUNwQyxJQUFJLFVBQVUsUUFBUSxRQUFROzs7O29CQUk5QixRQUFRLFFBQVEsU0FBUyxNQUFNLE9BQU87O29CQUV0QyxRQUFRLFNBQVM7b0JBQ2pCLE1BQU07b0JBQ04sZUFBZTtvQkFDZixPQUFPOzs7Z0JBR1gsR0FBRyxpREFBaUQsWUFBVztvQkFDM0QsSUFBSSxVQUFVLGVBQWU7b0JBQzdCLE9BQU8sUUFBUSxLQUFLLHNCQUFzQixRQUFRLEtBQUs7b0JBQ3ZELE9BQU8sUUFBUSxLQUFLLHNCQUFzQixTQUFTLFFBQVEsUUFBUSxLQUFLOzs7Z0JBRzVFLEdBQUcsZ0RBQWdELFlBQVc7b0JBQzFELElBQUksVUFBVSxlQUFlO29CQUM3QixPQUFPLFFBQVEsS0FBSyxzQkFBc0IsU0FBUyxRQUFRLFFBQVEsS0FBSzs7O2dCQUc1RSxHQUFHLHNDQUFzQyxZQUFXO29CQUNoRCxJQUFJLFVBQVUsZUFBZTtvQkFDN0IsT0FBTyxRQUFRLEtBQUssc0JBQXNCLE9BQU8sUUFBUSxZQUFZLEtBQUssQ0FBQztvQkFDM0UsT0FBTyxRQUFRLEtBQUssc0JBQXNCLE9BQU8sUUFBUSxZQUFZLEtBQUssQ0FBQzs7O2dCQUcvRSxHQUFHLGlDQUFpQyxZQUFXO29CQUMzQyxJQUFJLFVBQVUsZUFBZTtvQkFDN0IsTUFBTSxnQkFBZ0I7O29CQUV0QixNQUFNO29CQUNOLE1BQU07b0JBQ04sT0FBTyxRQUFRLEtBQUssc0JBQXNCLE9BQU8sUUFBUSxZQUFZLElBQUksS0FBSyxDQUFDO29CQUMvRSxPQUFPLFFBQVEsS0FBSyxzQkFBc0IsT0FBTyxRQUFRLFlBQVksS0FBSyxDQUFDOzs7Z0JBRy9FLEdBQUcsMENBQTBDLFlBQVc7b0JBQ3BELElBQUksVUFBVSxlQUFlO3dCQUN6QixtQkFBbUI7b0JBQ3ZCLE1BQU0sbUJBQW1COztvQkFFekIsTUFBTTtvQkFDTixNQUFNO29CQUNOLE9BQU8sUUFBUSxLQUFLLHNCQUFzQixPQUFPLFFBQVEsWUFBWSxJQUFJLEtBQUssQ0FBQztvQkFDL0UsTUFBTSxZQUFZOztvQkFFbEIsTUFBTTtvQkFDTixNQUFNO29CQUNOLE9BQU8sUUFBUSxLQUFLLHNCQUFzQixPQUFPLFFBQVEsWUFBWSxLQUFLLENBQUM7b0JBQzNFLE9BQU8sUUFBUSxLQUFLLHNCQUFzQixPQUFPLFFBQVEsbUJBQW1CLElBQUksS0FBSyxDQUFDOzs7OztHQUwzRiIsImZpbGUiOiJjb21tb24vYXJpYS9BcmlhRXJyb3JzRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGFyaWFNb2R1bGUgZnJvbSAnY29tbW9uL2FyaWEvQXJpYU1vZHVsZSc7XG5cbmRlc2NyaWJlKCdBcmlhRXJyb3JzRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgZXJyb3JNc2cxID0gJ0hFUkUgSVMgQU4gRVJST1InLFxuICAgICAgICBlcnJvck1zZzIgPSAnbWVzc2VkIHVwIGFnYWluIScsXG4gICAgICAgIHRlbXBsYXRlID1cbiAgICAgICAgICAgICc8ZGl2IGlkPVwiYXJpYUVycm9yc1Rlc3REaXZcIj4nICtcbiAgICAgICAgICAgICcgIDxzcC1hcmlhLWVycm9ycz48L3NwLWFyaWEtZXJyb3JzPicgK1xuICAgICAgICAgICAgJyAgPGRpdiBpZD1cInNvbWVFcnJvclwiIGNsYXNzPVwicmVhZGVyLWVycm9yXCIgbmctc2hvdz1cInNob3dTb21lRXJyb3JcIj4nICtcbiAgICAgICAgICAgICAgICAgZXJyb3JNc2cxICtcbiAgICAgICAgICAgICcgIDwvZGl2PicgK1xuICAgICAgICAgICAgJyAgPGRpdiBpZD1cImFub3RoZXJFcnJvclwiIGNsYXNzPVwicmVhZGVyLWVycm9yXCIgbmctc2hvdz1cInNob3dBbm90aGVyRXJyb3JcIj4nICtcbiAgICAgICAgICAgICcgICAge3sgc2NvcGVUZXh0IH19ICcgK1xuICAgICAgICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyxcblxuICAgICAgICB0ZW1wbGF0ZVdpdGhTZWxlY3RvciA9XG4gICAgICAgICAgICAnPGRpdiBpZD1cImFyaWFFcnJvcnNUZXN0RGl2XCI+JyArXG4gICAgICAgICAgICAnICA8c3AtYXJpYS1lcnJvcnMgc3Atc2VsZWN0b3I9XCIjc29tZUVycm9yXCI+PC9zcC1hcmlhLWVycm9ycz4nICtcbiAgICAgICAgICAgICcgIDxkaXYgaWQ9XCJzb21lRXJyb3JcIiBuZy1zaG93PVwic2hvd0Fub3RoZXJFcnJvcigpXCI+JyArXG4gICAgICAgICAgICAgICAgZXJyb3JNc2cxICtcbiAgICAgICAgICAgICcgIDwvZGl2PicgK1xuICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgICAgICAgYWxlcnRFbGVtZW50U2VsZWN0b3IgPSAnZGl2W3JvbGU9XCJhbGVydFwiXScsXG4gICAgICAgIHNjb3BlLCBjb21waWxlLCB0aW1lb3V0U2VydmljZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGFyaWFNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRyb290U2NvcGUsICRjb21waWxlLCAkdGltZW91dCkge1xuICAgICAgICBjb21waWxlID0gJGNvbXBpbGU7XG4gICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgIHRpbWVvdXRTZXJ2aWNlID0gJHRpbWVvdXQ7XG4gICAgICAgIHNjb3BlLnNob3dTb21lRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgc2NvcGUuc2hvd0Fub3RoZXJFcnJvciA9IGZhbHNlO1xuICAgICAgICBzY29wZS5zY29wZVRleHQgPSBlcnJvck1zZzI7XG4gICAgfSkpO1xuXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBSZW1vdmUgYW55dGhpbmcgd2UgYWRkZWQgdG8gZG9jdW1lbnRcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCcjYXJpYUVycm9yc1Rlc3REaXYnKS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIHZhciBjb21waWxlRWxlbWVudCA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KHRlbXBsYXRlKTtcblxuICAgICAgICAvLyBIYXZlIHRvIGFwcGVuZCBpdCB0byB0aGUgZG9jdW1lbnQgYmVmb3JlIGNhbGxpbmcgY29tcGlsZVxuICAgICAgICAvLyBzbyBhbmd1bGFyLmVsZW1lbnQgY2FsbHMgaW4gdGhlIGRpcmVjdGl2ZSB3aWxsIGZpbmQgdGhlIHJpZ2h0IHN0dWZmXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoZWxlbWVudCk7XG5cbiAgICAgICAgY29tcGlsZShlbGVtZW50KShzY29wZSk7XG4gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB0aW1lb3V0U2VydmljZS5mbHVzaCgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9O1xuXG4gICAgaXQoJ3Nob3VsZCBmaW5kIHRoZSBlcnJvciBkaXZzIHdpdGggLnJlYWRlci1lcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNvbXBpbGVFbGVtZW50KHRlbXBsYXRlKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZChhbGVydEVsZW1lbnRTZWxlY3RvcikubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKGFsZXJ0RWxlbWVudFNlbGVjdG9yKS5jaGlsZHJlbignc3BhbicpLmxlbmd0aCkudG9CZSgyKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmluZCBlcnJvciBkaXYgaWYgc2VsZWN0b3IgaXMgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNvbXBpbGVFbGVtZW50KHRlbXBsYXRlV2l0aFNlbGVjdG9yKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZChhbGVydEVsZW1lbnRTZWxlY3RvcikuY2hpbGRyZW4oJ3NwYW4nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjb250YWluIGVycm9yIGlmIGhpZGRlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNvbXBpbGVFbGVtZW50KHRlbXBsYXRlKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZChhbGVydEVsZW1lbnRTZWxlY3RvcikudGV4dCgpLmluZGV4T2YoZXJyb3JNc2cxKSkudG9CZSgtMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoYWxlcnRFbGVtZW50U2VsZWN0b3IpLnRleHQoKS5pbmRleE9mKGVycm9yTXNnMikpLnRvQmUoLTEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb250YWluIGVycm9yIGlmIHNob3duJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY29tcGlsZUVsZW1lbnQodGVtcGxhdGUpO1xuICAgICAgICBzY29wZS5zaG93U29tZUVycm9yID0gdHJ1ZTtcbiAgICAgICAgLy8gTmVlZCB0d28gY3ljbGVzLCBvbmUgdG8gdXBkYXRlIG5nLXNob3cgYW5kIG9uZSB0byB0cmlnZ2VyIHRoZSAkd2F0Y2hcbiAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKGFsZXJ0RWxlbWVudFNlbGVjdG9yKS50ZXh0KCkuaW5kZXhPZihlcnJvck1zZzEpKS5ub3QudG9CZSgtMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoYWxlcnRFbGVtZW50U2VsZWN0b3IpLnRleHQoKS5pbmRleE9mKGVycm9yTXNnMikpLnRvQmUoLTEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZXJyb3IgaWYgdGV4dCBpcyBjaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY29tcGlsZUVsZW1lbnQodGVtcGxhdGUpLFxuICAgICAgICAgICAgZXJyb3JNc2cyVXBkYXRlZCA9ICd3aGF0ZXZlciBzdWNrYSc7XG4gICAgICAgIHNjb3BlLnNob3dBbm90aGVyRXJyb3IgPSB0cnVlO1xuICAgICAgICAvLyBOZWVkIHR3byBjeWNsZXMsIG9uZSB0byB1cGRhdGUgbmctc2hvdyBhbmQgb25lIHRvIHRyaWdnZXIgdGhlICR3YXRjaFxuICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoYWxlcnRFbGVtZW50U2VsZWN0b3IpLnRleHQoKS5pbmRleE9mKGVycm9yTXNnMikpLm5vdC50b0JlKC0xKTtcbiAgICAgICAgc2NvcGUuc2NvcGVUZXh0ID0gZXJyb3JNc2cyVXBkYXRlZDtcbiAgICAgICAgLy8gTmVlZCB0d28gY3ljbGVzLCBvbmUgdG8gdXBkYXRlIG5nLXNob3cgYW5kIG9uZSB0byB0cmlnZ2VyIHRoZSAkd2F0Y2hcbiAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKGFsZXJ0RWxlbWVudFNlbGVjdG9yKS50ZXh0KCkuaW5kZXhPZihlcnJvck1zZzIpKS50b0JlKC0xKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZChhbGVydEVsZW1lbnRTZWxlY3RvcikudGV4dCgpLmluZGV4T2YoZXJyb3JNc2cyVXBkYXRlZCkpLm5vdC50b0JlKC0xKTtcbiAgICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
