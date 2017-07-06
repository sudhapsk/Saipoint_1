System.register(['test/js/TestInitializer', 'common/form/FormModule', 'test/js/TestModule'], function (_export) {

    /**
     * Unit tests for the spAppAttributeMultiSuggest directive.
     */
    'use strict';

    var formModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonFormFormModule) {
            formModule = _commonFormFormModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {
            describe('spAppAttributeMultiSuggest', function () {

                var attributes = [{
                    id: '001',
                    attribute: 'Attribute 1',
                    'application-name': 'App1',
                    'application-id': 'A01'
                }, {
                    id: '002',
                    attribute: 'Attribute 2',
                    'application-name': 'App1',
                    'application-id': 'A01'
                }, {
                    id: '003',
                    attribute: 'Attribute 3',
                    'application-name': 'App2',
                    'application-id': 'A02'
                }],
                    applications = [{
                    id: 'A01',
                    displayName: 'App1'
                }, {
                    id: 'A02',
                    displayName: 'App2'
                }],
                    $compile,
                    $timeout,
                    scope,
                    appAttributeSuggestService,
                    objectSuggestService,
                    applicationSuggest,
                    suggestTestService;

                beforeEach(module(testModule, formModule));

                beforeEach(inject(function ($rootScope, _$compile_, _$timeout_, _appAttributeSuggestService_, _objectSuggestService_, _suggestTestService_) {
                    $compile = _$compile_;
                    $timeout = _$timeout_;
                    appAttributeSuggestService = _appAttributeSuggestService_;
                    objectSuggestService = _objectSuggestService_;
                    suggestTestService = _suggestTestService_;

                    scope = $rootScope.$new();
                    scope.attributes = [];
                    // Make ngModel a fake FilterValue with the array on the value property
                    scope.ngModel = {
                        value: []
                    };

                    spyOn(appAttributeSuggestService, 'getAttributes').and.callFake(function () {
                        return attributes;
                    });
                    spyOn(objectSuggestService, 'getObjects').and.callFake(function () {
                        return applications;
                    });

                    applicationSuggest = compile('<sp-object-multi-suggest ' + 'sp-object-multi-suggest-id="applicationSuggest" sp-object-multi-suggest-class="application"' + 'ng-model="ngModel">');
                }));

                /**
                 * Compile the given HTML and return the resulting element.
                 */
                var compile = function (inputTpl) {
                    var el = $compile(angular.element(inputTpl))(scope);
                    scope.$apply();
                    /* The attribute directive has an async function that links the application model */
                    $timeout.flush();
                    angular.element('body').append(el);
                    return el;
                };

                it('should require model', function () {
                    expect(function () {
                        compile('<sp-app-attribute-multi-suggest/>');
                    }).toThrow();
                });

                it('should have the specified id', function () {
                    var el,
                        id = 'someId';
                    el = compile('<sp-app-attribute-multi-suggest sp-app-attribute-multi-suggest-id="' + id + '" ' + 'ng-model="attributes"/>');
                    expect(el.find('#' + id).length).toBe(1);
                });

                it('should have the default id if none specified', function () {
                    var el;
                    el = compile('<sp-app-attribute-multi-suggest ng-model="attributes"/>');
                    expect(el.find('#attributeSuggestField').length).toBe(1);
                });

                it('should call appAttributeSuggestService.getAttributes when searching', function () {
                    var el;
                    el = compile('<sp-app-attribute-multi-suggest ng-model="attributes"/>');
                    suggestTestService.searchByTyping(el, 'foo', scope);
                    expect(appAttributeSuggestService.getAttributes).toHaveBeenCalledWith('foo', 5, undefined, undefined, {});
                });

                it('should update model when item selected', function () {
                    var el;
                    el = compile('<sp-app-attribute-multi-suggest ng-model="attributes"/>');
                    suggestTestService.selectSuggestItem(el, 0, scope);
                    expect(scope.attributes.length).toBe(1);
                    expect(scope.attributes[0]).toBe(attributes[0]);
                });

                it('should call backend with application if application selected', function () {
                    var el;
                    el = compile('<sp-app-attribute-multi-suggest ng-model="attributes" ' + 'sp-app-attribute-multi-suggest-application-suggest-id="applicationSuggest"/>');
                    scope.ngModel.value.push(applications[0]);
                    var isolatedScope = el.isolateScope();
                    suggestTestService.searchByTyping(el, 'foo', isolatedScope);
                    expect(appAttributeSuggestService.getAttributes).toHaveBeenCalledWith('foo', 5, [applications[0]], undefined, {});
                });

                it('should remove attributes for removed application', function () {
                    compile('<sp-app-attribute-multi-suggest ng-model="attributes" ' + 'sp-app-attribute-multi-suggest-application-suggest-id="applicationSuggest""/>');
                    scope.ngModel.value.push(applications[0]);
                    scope.ngModel.value.push(applications[1]);
                    /* Update applications */
                    scope.$digest();
                    scope.attributes.push(attributes[0]);
                    scope.attributes.push(attributes[2]);
                    /* Update attributes */
                    scope.$digest();
                    scope.ngModel.value.shift();
                    /* Remove an application */
                    scope.$digest();
                    expect(scope.ngModel.value.length).toBe(1);
                    expect(scope.ngModel.value[0]).toBe(applications[1]);
                    expect(scope.attributes.length).toBe(1);
                    expect(scope.attributes[0]).toBe(attributes[2]);
                });

                it('should not remove attributes if removing last application', function () {
                    compile('<sp-app-attribute-multi-suggest ng-model="attributes" ' + 'sp-app-attribute-multi-suggest-application-suggest-id="applicationSuggest"/>');
                    scope.ngModel.value.push(applications[0]);
                    /* Update applications */
                    scope.$digest();
                    scope.attributes.push(attributes[0]);
                    scope.attributes.push(attributes[2]);
                    /* Update attributes */
                    scope.$digest();
                    scope.ngModel.value.shift();
                    /* Remove last application */
                    scope.$digest();
                    expect(scope.ngModel.value.length).toBe(0);
                    expect(scope.attributes.length).toBe(2);
                });

                it('should call search function with extra params if specified', function () {
                    var el;
                    scope.suggestParams = {
                        'this': 'that'
                    };
                    el = compile('<sp-app-attribute-multi-suggest ng-model="attributes" ' + 'sp-app-attribute-multi-suggest-application-suggest-id="applicationSuggest" ' + 'sp-app-attribute-suggest-params="{{suggestParams}}"/>');
                    scope.ngModel.value.push(applications[0]);
                    var isolatedScope = el.isolateScope();
                    suggestTestService.searchByTyping(el, 'foo', isolatedScope);
                    expect(appAttributeSuggestService.getAttributes).toHaveBeenCalledWith('foo', 5, [applications[0]], undefined, scope.suggestParams);
                });

                afterEach(function () {
                    angular.element('sp-object-multi-suggest').remove();
                    angular.element('sp-app-attribute-multi-suggest').remove();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9mb3JtL0FwcEF0dHJpYnV0ZU11bHRpU3VnZ2VzdERpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwwQkFBMEIsdUJBQXVCLFVBQVUsU0FBUzs7Ozs7SUFLNUc7O0lBRUEsSUFBSSxZQUFZO0lBQ2hCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHVCQUF1QjtZQUM3RSxhQUFhLHNCQUFzQjtXQUNwQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZO1lBUDdCLFNBQVMsOEJBQThCLFlBQVc7O2dCQUU5QyxJQUFJLGFBQWEsQ0FBQztvQkFDVixJQUFJO29CQUNKLFdBQVc7b0JBQ1gsb0JBQW9CO29CQUNwQixrQkFBa0I7bUJBQ25CO29CQUNDLElBQUk7b0JBQ0osV0FBVztvQkFDWCxvQkFBb0I7b0JBQ3BCLGtCQUFrQjttQkFDbkI7b0JBQ0MsSUFBSTtvQkFDSixXQUFXO29CQUNYLG9CQUFvQjtvQkFDcEIsa0JBQWtCOztvQkFFdEIsZUFBZSxDQUFDO29CQUNaLElBQUk7b0JBQ0osYUFBYTttQkFDZDtvQkFDQyxJQUFJO29CQUNKLGFBQWE7O29CQUVqQjtvQkFBVTtvQkFBVTtvQkFDcEI7b0JBQTRCO29CQUFzQjtvQkFBb0I7O2dCQUUxRSxXQUFXLE9BQU8sWUFBWTs7Z0JBRTlCLFdBQVcsT0FBTyxVQUFTLFlBQVksWUFBWSxZQUN4Qiw4QkFBOEIsd0JBQXdCLHNCQUFzQjtvQkFDbkcsV0FBVztvQkFDWCxXQUFXO29CQUNYLDZCQUE2QjtvQkFDN0IsdUJBQXVCO29CQUN2QixxQkFBcUI7O29CQUVyQixRQUFRLFdBQVc7b0JBQ25CLE1BQU0sYUFBYTs7b0JBRW5CLE1BQU0sVUFBVTt3QkFDWixPQUFPOzs7b0JBR1gsTUFBTSw0QkFBNEIsaUJBQWlCLElBQUksU0FBUyxZQUFXO3dCQUN2RSxPQUFPOztvQkFF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QWUscUJBQXFCLE9BQU8sR0FBRyxDQUFDLGFBQWEsS0FBSyxXQUMvRixNQUFNOzs7Z0JBR2QsVUFBVSxZQUFXO29CQUNqQixRQUFRLFFBQVEsMkJBQTJCO29CQUMzQyxRQUFRLFFBQVEsa0NBQWtDOzs7OztHQU92RCIsImZpbGUiOiJjb21tb24vZm9ybS9BcHBBdHRyaWJ1dGVNdWx0aVN1Z2dlc3REaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGZvcm1Nb2R1bGUgZnJvbSAnY29tbW9uL2Zvcm0vRm9ybU1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuXG4vKipcbiAqIFVuaXQgdGVzdHMgZm9yIHRoZSBzcEFwcEF0dHJpYnV0ZU11bHRpU3VnZ2VzdCBkaXJlY3RpdmUuXG4gKi9cbmRlc2NyaWJlKCdzcEFwcEF0dHJpYnV0ZU11bHRpU3VnZ2VzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBbe1xuICAgICAgICAgICAgaWQ6ICcwMDEnLFxuICAgICAgICAgICAgYXR0cmlidXRlOiAnQXR0cmlidXRlIDEnLFxuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uLW5hbWUnOiAnQXBwMScsXG4gICAgICAgICAgICAnYXBwbGljYXRpb24taWQnOiAnQTAxJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBpZDogJzAwMicsXG4gICAgICAgICAgICBhdHRyaWJ1dGU6ICdBdHRyaWJ1dGUgMicsXG4gICAgICAgICAgICAnYXBwbGljYXRpb24tbmFtZSc6ICdBcHAxJyxcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbi1pZCc6ICdBMDEnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGlkOiAnMDAzJyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogJ0F0dHJpYnV0ZSAzJyxcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbi1uYW1lJzogJ0FwcDInLFxuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uLWlkJzogJ0EwMidcbiAgICAgICAgfV0sXG4gICAgICAgIGFwcGxpY2F0aW9ucyA9IFt7XG4gICAgICAgICAgICBpZDogJ0EwMScsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0FwcDEnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGlkOiAnQTAyJyxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQXBwMidcbiAgICAgICAgfV0sXG4gICAgICAgICRjb21waWxlLCAkdGltZW91dCwgc2NvcGUsXG4gICAgICAgIGFwcEF0dHJpYnV0ZVN1Z2dlc3RTZXJ2aWNlLCBvYmplY3RTdWdnZXN0U2VydmljZSwgYXBwbGljYXRpb25TdWdnZXN0LCBzdWdnZXN0VGVzdFNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlLCBmb3JtTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCBfJGNvbXBpbGVfLCBfJHRpbWVvdXRfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hcHBBdHRyaWJ1dGVTdWdnZXN0U2VydmljZV8sIF9vYmplY3RTdWdnZXN0U2VydmljZV8sIF9zdWdnZXN0VGVzdFNlcnZpY2VfKSB7XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgJHRpbWVvdXQgPSBfJHRpbWVvdXRfO1xuICAgICAgICBhcHBBdHRyaWJ1dGVTdWdnZXN0U2VydmljZSA9IF9hcHBBdHRyaWJ1dGVTdWdnZXN0U2VydmljZV87XG4gICAgICAgIG9iamVjdFN1Z2dlc3RTZXJ2aWNlID0gX29iamVjdFN1Z2dlc3RTZXJ2aWNlXztcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlID0gX3N1Z2dlc3RUZXN0U2VydmljZV87XG5cbiAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgc2NvcGUuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAvLyBNYWtlIG5nTW9kZWwgYSBmYWtlIEZpbHRlclZhbHVlIHdpdGggdGhlIGFycmF5IG9uIHRoZSB2YWx1ZSBwcm9wZXJ0eVxuICAgICAgICBzY29wZS5uZ01vZGVsID0ge1xuICAgICAgICAgICAgdmFsdWU6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgc3B5T24oYXBwQXR0cmlidXRlU3VnZ2VzdFNlcnZpY2UsICdnZXRBdHRyaWJ1dGVzJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gICAgICAgIH0pO1xuICAgICAgICBzcHlPbihvYmplY3RTdWdnZXN0U2VydmljZSwgJ2dldE9iamVjdHMnKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBwbGljYXRpb25zO1xuICAgICAgICB9KTtcblxuICAgICAgICBhcHBsaWNhdGlvblN1Z2dlc3QgPSBjb21waWxlKCc8c3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QgJyArXG4gICAgICAgICAgICAnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QtaWQ9XCJhcHBsaWNhdGlvblN1Z2dlc3RcIiBzcC1vYmplY3QtbXVsdGktc3VnZ2VzdC1jbGFzcz1cImFwcGxpY2F0aW9uXCInICtcbiAgICAgICAgICAgICduZy1tb2RlbD1cIm5nTW9kZWxcIj4nKTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBDb21waWxlIHRoZSBnaXZlbiBIVE1MIGFuZCByZXR1cm4gdGhlIHJlc3VsdGluZyBlbGVtZW50LlxuICAgICAqL1xuICAgIHZhciBjb21waWxlID0gZnVuY3Rpb24oaW5wdXRUcGwpIHtcbiAgICAgICAgdmFyIGVsID0gJGNvbXBpbGUoYW5ndWxhci5lbGVtZW50KGlucHV0VHBsKSkoc2NvcGUpO1xuICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgLyogVGhlIGF0dHJpYnV0ZSBkaXJlY3RpdmUgaGFzIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgbGlua3MgdGhlIGFwcGxpY2F0aW9uIG1vZGVsICovXG4gICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmFwcGVuZChlbCk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuXG5cbiAgICBpdCgnc2hvdWxkIHJlcXVpcmUgbW9kZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29tcGlsZSgnPHNwLWFwcC1hdHRyaWJ1dGUtbXVsdGktc3VnZ2VzdC8+Jyk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB0aGUgc3BlY2lmaWVkIGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbCwgaWQgPSAnc29tZUlkJztcbiAgICAgICAgZWwgPSBjb21waWxlKCc8c3AtYXBwLWF0dHJpYnV0ZS1tdWx0aS1zdWdnZXN0IHNwLWFwcC1hdHRyaWJ1dGUtbXVsdGktc3VnZ2VzdC1pZD1cIicgKyBpZCArICdcIiAnICtcbiAgICAgICAgICAgICduZy1tb2RlbD1cImF0dHJpYnV0ZXNcIi8+Jyk7XG4gICAgICAgIGV4cGVjdChlbC5maW5kKCcjJyArIGlkKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdGhlIGRlZmF1bHQgaWQgaWYgbm9uZSBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsO1xuICAgICAgICBlbCA9IGNvbXBpbGUoJzxzcC1hcHAtYXR0cmlidXRlLW11bHRpLXN1Z2dlc3QgbmctbW9kZWw9XCJhdHRyaWJ1dGVzXCIvPicpO1xuICAgICAgICBleHBlY3QoZWwuZmluZCgnI2F0dHJpYnV0ZVN1Z2dlc3RGaWVsZCcpLmxlbmd0aCkudG9CZSgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FsbCBhcHBBdHRyaWJ1dGVTdWdnZXN0U2VydmljZS5nZXRBdHRyaWJ1dGVzIHdoZW4gc2VhcmNoaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbDtcbiAgICAgICAgZWwgPSBjb21waWxlKCc8c3AtYXBwLWF0dHJpYnV0ZS1tdWx0aS1zdWdnZXN0IG5nLW1vZGVsPVwiYXR0cmlidXRlc1wiLz4nKTtcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlYXJjaEJ5VHlwaW5nKGVsLCAnZm9vJywgc2NvcGUpO1xuICAgICAgICBleHBlY3QoYXBwQXR0cmlidXRlU3VnZ2VzdFNlcnZpY2UuZ2V0QXR0cmlidXRlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2ZvbycsIDUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7fSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBtb2RlbCB3aGVuIGl0ZW0gc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsO1xuICAgICAgICBlbCA9IGNvbXBpbGUoJzxzcC1hcHAtYXR0cmlidXRlLW11bHRpLXN1Z2dlc3QgbmctbW9kZWw9XCJhdHRyaWJ1dGVzXCIvPicpO1xuICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2Uuc2VsZWN0U3VnZ2VzdEl0ZW0oZWwsIDAsIHNjb3BlKTtcbiAgICAgICAgZXhwZWN0KHNjb3BlLmF0dHJpYnV0ZXMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3Qoc2NvcGUuYXR0cmlidXRlc1swXSkudG9CZShhdHRyaWJ1dGVzWzBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FsbCBiYWNrZW5kIHdpdGggYXBwbGljYXRpb24gaWYgYXBwbGljYXRpb24gc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsO1xuICAgICAgICBlbCA9IGNvbXBpbGUoJzxzcC1hcHAtYXR0cmlidXRlLW11bHRpLXN1Z2dlc3QgbmctbW9kZWw9XCJhdHRyaWJ1dGVzXCIgJyArXG4gICAgICAgICAgICAnc3AtYXBwLWF0dHJpYnV0ZS1tdWx0aS1zdWdnZXN0LWFwcGxpY2F0aW9uLXN1Z2dlc3QtaWQ9XCJhcHBsaWNhdGlvblN1Z2dlc3RcIi8+Jyk7XG4gICAgICAgIHNjb3BlLm5nTW9kZWwudmFsdWUucHVzaChhcHBsaWNhdGlvbnNbMF0pO1xuICAgICAgICB2YXIgaXNvbGF0ZWRTY29wZSA9IGVsLmlzb2xhdGVTY29wZSgpO1xuICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2Uuc2VhcmNoQnlUeXBpbmcoZWwsICdmb28nLCBpc29sYXRlZFNjb3BlKTtcbiAgICAgICAgZXhwZWN0KGFwcEF0dHJpYnV0ZVN1Z2dlc3RTZXJ2aWNlLmdldEF0dHJpYnV0ZXMpXG4gICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2ZvbycsIDUsIFthcHBsaWNhdGlvbnNbMF1dLCB1bmRlZmluZWQsIHt9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIGF0dHJpYnV0ZXMgZm9yIHJlbW92ZWQgYXBwbGljYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29tcGlsZSgnPHNwLWFwcC1hdHRyaWJ1dGUtbXVsdGktc3VnZ2VzdCBuZy1tb2RlbD1cImF0dHJpYnV0ZXNcIiAnICtcbiAgICAgICAgICAgICdzcC1hcHAtYXR0cmlidXRlLW11bHRpLXN1Z2dlc3QtYXBwbGljYXRpb24tc3VnZ2VzdC1pZD1cImFwcGxpY2F0aW9uU3VnZ2VzdFwiXCIvPicpO1xuICAgICAgICBzY29wZS5uZ01vZGVsLnZhbHVlLnB1c2goYXBwbGljYXRpb25zWzBdKTtcbiAgICAgICAgc2NvcGUubmdNb2RlbC52YWx1ZS5wdXNoKGFwcGxpY2F0aW9uc1sxXSk7XG4gICAgICAgIC8qIFVwZGF0ZSBhcHBsaWNhdGlvbnMgKi9cbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBzY29wZS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlc1swXSk7XG4gICAgICAgIHNjb3BlLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVzWzJdKTtcbiAgICAgICAgLyogVXBkYXRlIGF0dHJpYnV0ZXMgKi9cbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBzY29wZS5uZ01vZGVsLnZhbHVlLnNoaWZ0KCk7XG4gICAgICAgIC8qIFJlbW92ZSBhbiBhcHBsaWNhdGlvbiAqL1xuICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIGV4cGVjdChzY29wZS5uZ01vZGVsLnZhbHVlLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KHNjb3BlLm5nTW9kZWwudmFsdWVbMF0pLnRvQmUoYXBwbGljYXRpb25zWzFdKTtcbiAgICAgICAgZXhwZWN0KHNjb3BlLmF0dHJpYnV0ZXMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3Qoc2NvcGUuYXR0cmlidXRlc1swXSkudG9CZShhdHRyaWJ1dGVzWzJdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbW92ZSBhdHRyaWJ1dGVzIGlmIHJlbW92aW5nIGxhc3QgYXBwbGljYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29tcGlsZSgnPHNwLWFwcC1hdHRyaWJ1dGUtbXVsdGktc3VnZ2VzdCBuZy1tb2RlbD1cImF0dHJpYnV0ZXNcIiAnICtcbiAgICAgICAgICAgICdzcC1hcHAtYXR0cmlidXRlLW11bHRpLXN1Z2dlc3QtYXBwbGljYXRpb24tc3VnZ2VzdC1pZD1cImFwcGxpY2F0aW9uU3VnZ2VzdFwiLz4nKTtcbiAgICAgICAgc2NvcGUubmdNb2RlbC52YWx1ZS5wdXNoKGFwcGxpY2F0aW9uc1swXSk7XG4gICAgICAgIC8qIFVwZGF0ZSBhcHBsaWNhdGlvbnMgKi9cbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBzY29wZS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlc1swXSk7XG4gICAgICAgIHNjb3BlLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVzWzJdKTtcbiAgICAgICAgLyogVXBkYXRlIGF0dHJpYnV0ZXMgKi9cbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBzY29wZS5uZ01vZGVsLnZhbHVlLnNoaWZ0KCk7XG4gICAgICAgIC8qIFJlbW92ZSBsYXN0IGFwcGxpY2F0aW9uICovXG4gICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgZXhwZWN0KHNjb3BlLm5nTW9kZWwudmFsdWUubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICBleHBlY3Qoc2NvcGUuYXR0cmlidXRlcy5sZW5ndGgpLnRvQmUoMik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2VhcmNoIGZ1bmN0aW9uIHdpdGggZXh0cmEgcGFyYW1zIGlmIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWw7XG4gICAgICAgIHNjb3BlLnN1Z2dlc3RQYXJhbXMgPSB7XG4gICAgICAgICAgICB0aGlzOiAndGhhdCdcbiAgICAgICAgfTtcbiAgICAgICAgZWwgPSBjb21waWxlKCc8c3AtYXBwLWF0dHJpYnV0ZS1tdWx0aS1zdWdnZXN0IG5nLW1vZGVsPVwiYXR0cmlidXRlc1wiICcgK1xuICAgICAgICAgICAgJ3NwLWFwcC1hdHRyaWJ1dGUtbXVsdGktc3VnZ2VzdC1hcHBsaWNhdGlvbi1zdWdnZXN0LWlkPVwiYXBwbGljYXRpb25TdWdnZXN0XCIgJyArXG4gICAgICAgICAgICAnc3AtYXBwLWF0dHJpYnV0ZS1zdWdnZXN0LXBhcmFtcz1cInt7c3VnZ2VzdFBhcmFtc319XCIvPicpO1xuICAgICAgICBzY29wZS5uZ01vZGVsLnZhbHVlLnB1c2goYXBwbGljYXRpb25zWzBdKTtcbiAgICAgICAgdmFyIGlzb2xhdGVkU2NvcGUgPSBlbC5pc29sYXRlU2NvcGUoKTtcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlYXJjaEJ5VHlwaW5nKGVsLCAnZm9vJywgaXNvbGF0ZWRTY29wZSk7XG4gICAgICAgIGV4cGVjdChhcHBBdHRyaWJ1dGVTdWdnZXN0U2VydmljZS5nZXRBdHRyaWJ1dGVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZm9vJywgNSwgW2FwcGxpY2F0aW9uc1swXV0sIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNjb3BlLnN1Z2dlc3RQYXJhbXMpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ3NwLW9iamVjdC1tdWx0aS1zdWdnZXN0JykucmVtb3ZlKCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnc3AtYXBwLWF0dHJpYnV0ZS1tdWx0aS1zdWdnZXN0JykucmVtb3ZlKCk7XG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
