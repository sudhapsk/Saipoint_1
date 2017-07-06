System.register(['test/js/TestInitializer', 'common/form/FormModule', 'test/js/TestModule'], function (_export) {

    /**
     * Unit tests for the spObjectSuggest directive.
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
            describe('spObjectSuggest', function () {

                var objects = [{
                    displayName: 'Accounting General Access - IT',
                    id: '2c908a854d244cf6014d244e7a5c0494',
                    name: 'Accounting General Access - IT'
                }, {
                    displayName: 'Accounts Payable Access - IT',
                    id: '2c908a854d244cf6014d244e7a870495',
                    name: 'Accounts Payable Access - IT'
                }, {
                    displayName: 'Accounts Payable Approver',
                    id: '2c908a854d244cf6014d244e9195052b',
                    name: 'Accounts Payable Approver'
                }],
                    simpleSuggest = '<sp-object-suggest ' + 'ng-model="selectedObject"  ' + 'sp-object-suggest-class="sailpoint.object.Bundle"' + 'sp-object-suggest-id="suggest-id"/>',
                    simpleSuggestAllowedValues = '<sp-object-suggest ' + 'sp-object-suggest-allowed-values="getObjects()" ' + 'ng-model="selectedObject"  ' + 'sp-object-suggest-id="suggest-id"/>',
                    $compile,
                    scope,
                    objectSuggestService,
                    suggestTestService,
                    $templateCache;

                beforeEach(module(formModule, testModule));

                /**
                 * Setup the tests.
                 */
                beforeEach(inject(function ($q, $rootScope, _$templateCache_, _objectSuggestService_, _suggestTestService_, _$compile_) {

                    /**
                     * Return a promise that resolves to the objects list.
                     */
                    var returnObjects = function () {
                        return $q.when(objects);
                    };

                    // Save our dependencies for later use.
                    $compile = _$compile_;
                    $templateCache = _$templateCache_;
                    objectSuggestService = _objectSuggestService_;
                    suggestTestService = _suggestTestService_;

                    // Setup the scope to have the getObjects() function and a selected object.
                    scope = $rootScope;
                    scope.getObjects = function () {
                        return objects;
                    };
                    scope.selectedObject = null;

                    // Mock the objectSuggestService to return our objects.
                    spyOn(objectSuggestService, 'getObjects').and.callFake(returnObjects);
                }));

                /**
                 * Compile the given HTML and return the resulting element.
                 */
                var compile = function (inputTpl) {
                    var el = $compile(angular.element(inputTpl))(scope);
                    scope.$apply();
                    return el;
                };

                it('fails with no ng-model attribute', function () {
                    var elt = '<sp-object-suggest  sp-object-suggest-id="suggest-id"/>';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('fails if class and sp-object-suggest-allowed-values are not specified', function () {
                    var elt = '<sp-object-suggest sp-object-suggest-id="suggest-id" ng-model="selectedObject" />';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('fails if sp-object-suggest-id is not specified', function () {
                    var elt = '<sp-object-suggest ng-model="selectedObject" />';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('fails if context and suggest-id are not specified', function () {
                    var elt = '<sp-object-suggest  sp-object-suggest-class="sailpoint.object.Identity" ' + 'ng-model="selectedObject" sp-object-suggest-id="suggest-id"/>';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('fails if context is not specified', function () {
                    var elt = '<sp-object-suggest sp-object-suggest-class="sailpoint.object.Identity" ' + 'ng-model="selectedObject" sp-object-suggest-lookup-id="testId" sp-object-suggest-id="suggest-id"/>';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('fails if context is not specified', function () {
                    var elt = '<sp-object-suggest sp-object-suggest-class="sailpoint.object.Identity" ' + 'ng-model="selectedObject" sp-object-suggest-context="context" sp-object-suggest-id="suggest-id"/>';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('succeeds if context and suggest-lookup-id are specified', function () {
                    var elt = '<sp-object-suggest sp-object-suggest-class="sailpoint.object.Identity" ' + 'ng-model="selectedObject" sp-object-suggest-lookup-id="testId" sp-object-suggest-context="context" ' + 'sp-object-suggest-id="suggest-id"/>';
                    expect(function () {
                        compile(elt);
                    }).not.toThrow();
                });

                it('sets the object list to the sp-object-suggest attribute', function () {
                    var el = compile(simpleSuggest);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.objectList).toBeDefined();
                });

                it('sets extraParams to object if specified', function () {
                    var elt = '<sp-object-suggest sp-object-suggest-class="sailpoint.object.Identity" ' + 'ng-model="selectedObject" sp-object-suggest-lookup-id="testId" sp-object-suggest-context="context" ' + 'sp-object-suggest-id="suggest-id" ' + 'sp-object-suggest-params="{&quot;workgroup&quot;:&quot;someworkgroup&quot;}"/>';

                    var el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.extraParams).toEqual({ workgroup: 'someworkgroup' });
                });

                it('defaults to a limit of 5 results', function () {
                    var el = compile(simpleSuggest);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.spObjectSuggestLimit).toEqual(5);
                });

                it('allows specifying a limit', function () {
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-limit="25"' + '     ng-model="selectedObject" />',
                        el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.spObjectSuggestLimit).toEqual('25');
                });

                it('defaults editable to false if not specified', function () {
                    var el = compile(simpleSuggest);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.editable).toBeFalsy();
                });

                it('allows specifying an itemTemplate', function () {
                    $templateCache.put('template/my-suggest-item.html', 'test test test');
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-limit="25"' + '     sp-object-suggest-item-template="template/my-suggest-item.html"' + '     ng-model="selectedObject" />',
                        el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.spObjectSuggestItemTemplate).toEqual('template/my-suggest-item.html');
                });

                it('fails compilation with an invalid item template', function () {
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-limit="25"' + '     sp-object-suggest-item-template="template/undefined-suggest.html"' + '     ng-model="selectedObject" />';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('allows specifying a template', function () {
                    $templateCache.put('template/my-suggest.html', 'test test test');
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-limit="25"' + '     sp-object-suggest-item-template="template/my-suggest.html"' + '     ng-model="selectedObject" />',
                        el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.spObjectSuggestItemTemplate).toEqual('template/my-suggest.html');
                });

                it('fails compilation with an invalid template', function () {
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-limit="25"' + '     sp-object-suggest-template="template/undefined-suggest.html"' + '     ng-model="selectedObject" />';
                    expect(function () {
                        compile(elt);
                    }).toThrow();
                });

                it('sets objectList to searchObjects() if a class is specified', function () {
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-class="sailpoint.object.Bundle"' + '     ng-model="selectedObject" />',
                        el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.objectList).toBeDefined();
                    expect(isolatedScope.spObjectSuggestClass).toEqual('sailpoint.object.Bundle');
                });

                it('defaults to required=false', function () {
                    var el = compile(simpleSuggest);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.ngRequired).toBeFalsy();
                });

                it('sets required using required without a value', function () {
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     ng-required="true"' + '     ng-model="selectedObject" />',
                        el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.ngRequired).toBeTruthy();
                });

                it('sets required using the ng-required attribute', function () {
                    var elt = '<sp-object-suggest ' + '     sp-object-suggest-allowed-values="getObjects()"' + '     sp-object-suggest-id="suggest-id"' + '     ng-required="isThisRequired"' + '     ng-model="selectedObject" />',
                        el;

                    scope.isThisRequired = true;
                    el = compile(elt);
                    var isolatedScope = el.isolateScope();
                    expect(isolatedScope.ngRequired).toBeTruthy();
                });

                it('does not call objectSuggestService if not querying', function () {
                    compile(simpleSuggest);
                    scope.$digest();
                    expect(objectSuggestService.getObjects).not.toHaveBeenCalled();
                });

                it('does not call objectSuggestService when allowed values specified', function () {
                    var el = compile(simpleSuggestAllowedValues);
                    suggestTestService.searchByTyping(el, 'acc', scope);
                    expect(objectSuggestService.getObjects).not.toHaveBeenCalled();
                });

                it('calls objectSuggestService when querying if class is specified', function () {
                    var elt = '<sp-object-suggest' + '     sp-object-suggest-id="suggest-id"' + '     sp-object-suggest-class="sailpoint.object.Bundle"' + '     sp-object-suggest-filter="foo" ' + '     ng-model="selectedObject" />',
                        el = compile(elt),
                        args;
                    suggestTestService.searchByTyping(el, 'acc', scope);
                    expect(objectSuggestService.getObjects).toHaveBeenCalled();

                    args = objectSuggestService.getObjects.calls.mostRecent().args;
                    expect(args[0]).toEqual('sailpoint.object.Bundle');
                    expect(args[1]).toEqual('acc');
                    expect(args[2]).toEqual(5);
                    expect(args[5]).toEqual('foo');
                });

                it('shows the object list when querying', function () {
                    var el = compile(simpleSuggest),
                        items;
                    suggestTestService.searchByTyping(el, 'acc', scope);
                    items = suggestTestService.getSuggestItems(el, scope);
                    expect(items.length).toEqual(3);
                });

                describe('clicking the drop-down arrow', function () {
                    var el;

                    // All of these tests use the same type of suggest.
                    beforeEach(function () {
                        el = compile(simpleSuggest);
                    });

                    it('shows the object list', function () {
                        var items;
                        suggestTestService.clickDropdownArrow(el, scope);
                        items = suggestTestService.getSuggestItems(el, scope);
                        expect(items.length).toEqual(3);
                    });

                    it('clears the input', function () {
                        var input = el.find('input');
                        input.val('foo');
                        suggestTestService.clickDropdownArrow(el, scope);
                        expect(input.val()).toEqual('');
                    });
                });

                describe('object list', function () {
                    var el;

                    // All of these tests use the same type of suggest.
                    beforeEach(function () {
                        el = compile(simpleSuggest);
                    });

                    it('shows the object display name', function () {
                        var item = suggestTestService.getSuggestItem(el, 0, scope),
                            nameEl = item.find('span')[0];
                        expect(nameEl.textContent).toEqual('Accounting General Access - IT');
                    });
                });

                describe('selecting an object', function () {
                    var el;

                    // All of these tests use the same type of suggest.
                    beforeEach(function () {
                        el = compile(simpleSuggest);
                    });

                    it('sets the model value', function () {
                        suggestTestService.selectSuggestItem(el, 0, scope);
                        expect(scope.selectedObject).toBe(objects[0]);
                    });

                    it('hides the object list', function () {
                        suggestTestService.selectSuggestItem(el, 0, scope);
                        expect(suggestTestService.isDropdownOpen(el)).toBeFalsy();
                    });

                    it('puts the display name of the object in the input', function () {
                        var input;
                        suggestTestService.selectSuggestItem(el, 0, scope);
                        input = el.find('input');
                        expect(input.val()).toEqual('Accounting General Access - IT');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9mb3JtL09iamVjdFN1Z2dlc3REaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMEJBQTBCLHVCQUF1QixVQUFVLFNBQVM7Ozs7O0lBSzVHOztJQUVBLElBQUksWUFBWTtJQUNoQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx1QkFBdUI7WUFDN0UsYUFBYSxzQkFBc0I7V0FDcEMsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTtZQVA3QixTQUFTLG1CQUFtQixZQUFXOztnQkFFbkMsSUFBSSxVQUFVLENBQUM7b0JBQ1AsYUFBYTtvQkFDYixJQUFJO29CQUNKLE1BQU07bUJBQ1A7b0JBQ0MsYUFBYTtvQkFDYixJQUFJO29CQUNKLE1BQU07bUJBQ1A7b0JBQ0MsYUFBYTtvQkFDYixJQUFJO29CQUNKLE1BQU07O29CQUVWLGdCQUFnQix3QkFDWixnQ0FDQSxzREFDQTtvQkFDSiw2QkFBNkIsd0JBQ3pCLHFEQUNBLGdDQUNBO29CQUNKO29CQUFVO29CQUFPO29CQUFzQjtvQkFBb0I7O2dCQUcvRCxXQUFXLE9BQU8sWUFBWTs7Ozs7Z0JBSzlCLFdBQVcsT0FBTyxVQUFTLElBQUksWUFBWSxrQkFBa0Isd0JBQ2xDLHNCQUFzQixZQUFZOzs7OztvQkFLekQsSUFBSSxnQkFBZ0IsWUFBVzt3QkFDM0IsT0FBTyxHQUFHLEtBQUs7Ozs7b0JBSW5CLFdBQVc7b0JBQ1gsaUJBQWlCO29CQUNqQix1QkFBdUI7b0JBQ3ZCLHFCQUFxQjs7O29CQUdyQixRQUFRO29CQUNSLE1BQU0sYUFBYSxZQUFXO3dCQUMxQixPQUFPOztvQkFFWCxNQUFNLGlCQUFpQjs7O29CQUd2QixNQUFNLHNCQUFzQixjQUFjLElBQUksU0FBUzs7Ozs7O2dCQU0zRCxJQUFJLFVBQVUsVUFBUyxVQUFVO29CQUM3QixJQUFJLEtBQUssU0FBUyxRQUFR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ZSxLQUFLOzs7b0JBR2xELEdBQUcsb0RBQW9ELFlBQVc7d0JBQzlELElBQUk7d0JBQ0osbUJBQW1CLGtCQUFrQixJQUFJLEdBQUc7d0JBQzVDLFFBQVEsR0FBRyxLQUFLO3dCQUNoQixPQUFPLE1BQU0sT0FBTyxRQUFROzs7Ozs7R0FwQnJDIiwiZmlsZSI6ImNvbW1vbi9mb3JtL09iamVjdFN1Z2dlc3REaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGZvcm1Nb2R1bGUgZnJvbSAnY29tbW9uL2Zvcm0vRm9ybU1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuXG4vKipcbiAqIFVuaXQgdGVzdHMgZm9yIHRoZSBzcE9iamVjdFN1Z2dlc3QgZGlyZWN0aXZlLlxuICovXG5kZXNjcmliZSgnc3BPYmplY3RTdWdnZXN0JywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgb2JqZWN0cyA9IFt7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0FjY291bnRpbmcgR2VuZXJhbCBBY2Nlc3MgLSBJVCcsXG4gICAgICAgICAgICBpZDogJzJjOTA4YTg1NGQyNDRjZjYwMTRkMjQ0ZTdhNWMwNDk0JyxcbiAgICAgICAgICAgIG5hbWU6ICdBY2NvdW50aW5nIEdlbmVyYWwgQWNjZXNzIC0gSVQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQWNjb3VudHMgUGF5YWJsZSBBY2Nlc3MgLSBJVCcsXG4gICAgICAgICAgICBpZDogJzJjOTA4YTg1NGQyNDRjZjYwMTRkMjQ0ZTdhODcwNDk1JyxcbiAgICAgICAgICAgIG5hbWU6ICdBY2NvdW50cyBQYXlhYmxlIEFjY2VzcyAtIElUJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0FjY291bnRzIFBheWFibGUgQXBwcm92ZXInLFxuICAgICAgICAgICAgaWQ6ICcyYzkwOGE4NTRkMjQ0Y2Y2MDE0ZDI0NGU5MTk1MDUyYicsXG4gICAgICAgICAgICBuYW1lOiAnQWNjb3VudHMgUGF5YWJsZSBBcHByb3ZlcidcbiAgICAgICAgfV0sXG4gICAgICAgIHNpbXBsZVN1Z2dlc3QgPSAnPHNwLW9iamVjdC1zdWdnZXN0ICcgK1xuICAgICAgICAgICAgJ25nLW1vZGVsPVwic2VsZWN0ZWRPYmplY3RcIiAgJyArXG4gICAgICAgICAgICAnc3Atb2JqZWN0LXN1Z2dlc3QtY2xhc3M9XCJzYWlscG9pbnQub2JqZWN0LkJ1bmRsZVwiJyArXG4gICAgICAgICAgICAnc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCIvPicsXG4gICAgICAgIHNpbXBsZVN1Z2dlc3RBbGxvd2VkVmFsdWVzID0gJzxzcC1vYmplY3Qtc3VnZ2VzdCAnICtcbiAgICAgICAgICAgICdzcC1vYmplY3Qtc3VnZ2VzdC1hbGxvd2VkLXZhbHVlcz1cImdldE9iamVjdHMoKVwiICcgK1xuICAgICAgICAgICAgJ25nLW1vZGVsPVwic2VsZWN0ZWRPYmplY3RcIiAgJyArXG4gICAgICAgICAgICAnc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCIvPicsXG4gICAgICAgICRjb21waWxlLCBzY29wZSwgb2JqZWN0U3VnZ2VzdFNlcnZpY2UsIHN1Z2dlc3RUZXN0U2VydmljZSwgJHRlbXBsYXRlQ2FjaGU7XG5cblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZvcm1Nb2R1bGUsIHRlc3RNb2R1bGUpKTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSB0ZXN0cy5cbiAgICAgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcSwgJHJvb3RTY29wZSwgXyR0ZW1wbGF0ZUNhY2hlXywgX29iamVjdFN1Z2dlc3RTZXJ2aWNlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3VnZ2VzdFRlc3RTZXJ2aWNlXywgXyRjb21waWxlXykge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIG9iamVjdHMgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciByZXR1cm5PYmplY3RzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJHEud2hlbihvYmplY3RzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBTYXZlIG91ciBkZXBlbmRlbmNpZXMgZm9yIGxhdGVyIHVzZS5cbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuICAgICAgICAkdGVtcGxhdGVDYWNoZSA9IF8kdGVtcGxhdGVDYWNoZV87XG4gICAgICAgIG9iamVjdFN1Z2dlc3RTZXJ2aWNlID0gX29iamVjdFN1Z2dlc3RTZXJ2aWNlXztcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlID0gX3N1Z2dlc3RUZXN0U2VydmljZV87XG5cbiAgICAgICAgLy8gU2V0dXAgdGhlIHNjb3BlIHRvIGhhdmUgdGhlIGdldE9iamVjdHMoKSBmdW5jdGlvbiBhbmQgYSBzZWxlY3RlZCBvYmplY3QuXG4gICAgICAgIHNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgc2NvcGUuZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdHM7XG4gICAgICAgIH07XG4gICAgICAgIHNjb3BlLnNlbGVjdGVkT2JqZWN0ID0gbnVsbDtcblxuICAgICAgICAvLyBNb2NrIHRoZSBvYmplY3RTdWdnZXN0U2VydmljZSB0byByZXR1cm4gb3VyIG9iamVjdHMuXG4gICAgICAgIHNweU9uKG9iamVjdFN1Z2dlc3RTZXJ2aWNlLCAnZ2V0T2JqZWN0cycpLmFuZC5jYWxsRmFrZShyZXR1cm5PYmplY3RzKTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBDb21waWxlIHRoZSBnaXZlbiBIVE1MIGFuZCByZXR1cm4gdGhlIHJlc3VsdGluZyBlbGVtZW50LlxuICAgICAqL1xuICAgIHZhciBjb21waWxlID0gZnVuY3Rpb24oaW5wdXRUcGwpIHtcbiAgICAgICAgdmFyIGVsID0gJGNvbXBpbGUoYW5ndWxhci5lbGVtZW50KGlucHV0VHBsKSkoc2NvcGUpO1xuICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG5cbiAgICBpdCgnZmFpbHMgd2l0aCBubyBuZy1tb2RlbCBhdHRyaWJ1dGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QgIHNwLW9iamVjdC1zdWdnZXN0LWlkPVwic3VnZ2VzdC1pZFwiLz4nO1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGNvbXBpbGUoZWx0KTsgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZhaWxzIGlmIGNsYXNzIGFuZCBzcC1vYmplY3Qtc3VnZ2VzdC1hbGxvd2VkLXZhbHVlcyBhcmUgbm90IHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWx0ID0gJzxzcC1vYmplY3Qtc3VnZ2VzdCBzcC1vYmplY3Qtc3VnZ2VzdC1pZD1cInN1Z2dlc3QtaWRcIiBuZy1tb2RlbD1cInNlbGVjdGVkT2JqZWN0XCIgLz4nO1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGNvbXBpbGUoZWx0KTsgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZhaWxzIGlmIHNwLW9iamVjdC1zdWdnZXN0LWlkIGlzIG5vdCBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QgbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIC8+JztcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjb21waWxlKGVsdCk7IH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdmYWlscyBpZiBjb250ZXh0IGFuZCBzdWdnZXN0LWlkIGFyZSBub3Qgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbHQgPSAnPHNwLW9iamVjdC1zdWdnZXN0ICBzcC1vYmplY3Qtc3VnZ2VzdC1jbGFzcz1cInNhaWxwb2ludC5vYmplY3QuSWRlbnRpdHlcIiAnICtcbiAgICAgICAgICAgICduZy1tb2RlbD1cInNlbGVjdGVkT2JqZWN0XCIgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCIvPic7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgY29tcGlsZShlbHQpOyB9KS50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmFpbHMgaWYgY29udGV4dCBpcyBub3Qgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbHQgPSAnPHNwLW9iamVjdC1zdWdnZXN0IHNwLW9iamVjdC1zdWdnZXN0LWNsYXNzPVwic2FpbHBvaW50Lm9iamVjdC5JZGVudGl0eVwiICcgK1xuICAgICAgICAgICAgJ25nLW1vZGVsPVwic2VsZWN0ZWRPYmplY3RcIiBzcC1vYmplY3Qtc3VnZ2VzdC1sb29rdXAtaWQ9XCJ0ZXN0SWRcIiBzcC1vYmplY3Qtc3VnZ2VzdC1pZD1cInN1Z2dlc3QtaWRcIi8+JztcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjb21waWxlKGVsdCk7IH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdmYWlscyBpZiBjb250ZXh0IGlzIG5vdCBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3Qgc3Atb2JqZWN0LXN1Z2dlc3QtY2xhc3M9XCJzYWlscG9pbnQub2JqZWN0LklkZW50aXR5XCIgJyArXG4gICAgICAgICAgICAnbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIHNwLW9iamVjdC1zdWdnZXN0LWNvbnRleHQ9XCJjb250ZXh0XCIgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCIvPic7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgY29tcGlsZShlbHQpOyB9KS50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3VjY2VlZHMgaWYgY29udGV4dCBhbmQgc3VnZ2VzdC1sb29rdXAtaWQgYXJlIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWx0ID0gJzxzcC1vYmplY3Qtc3VnZ2VzdCBzcC1vYmplY3Qtc3VnZ2VzdC1jbGFzcz1cInNhaWxwb2ludC5vYmplY3QuSWRlbnRpdHlcIiAnICtcbiAgICAgICAgICAgICduZy1tb2RlbD1cInNlbGVjdGVkT2JqZWN0XCIgc3Atb2JqZWN0LXN1Z2dlc3QtbG9va3VwLWlkPVwidGVzdElkXCIgc3Atb2JqZWN0LXN1Z2dlc3QtY29udGV4dD1cImNvbnRleHRcIiAnICtcbiAgICAgICAgICAgICdzcC1vYmplY3Qtc3VnZ2VzdC1pZD1cInN1Z2dlc3QtaWRcIi8+JztcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjb21waWxlKGVsdCk7IH0pLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2V0cyB0aGUgb2JqZWN0IGxpc3QgdG8gdGhlIHNwLW9iamVjdC1zdWdnZXN0IGF0dHJpYnV0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWwgPSBjb21waWxlKHNpbXBsZVN1Z2dlc3QpO1xuICAgICAgICB2YXIgaXNvbGF0ZWRTY29wZSA9IGVsLmlzb2xhdGVTY29wZSgpO1xuICAgICAgICBleHBlY3QoaXNvbGF0ZWRTY29wZS5vYmplY3RMaXN0KS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NldHMgZXh0cmFQYXJhbXMgdG8gb2JqZWN0IGlmIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWx0ID0gJzxzcC1vYmplY3Qtc3VnZ2VzdCBzcC1vYmplY3Qtc3VnZ2VzdC1jbGFzcz1cInNhaWxwb2ludC5vYmplY3QuSWRlbnRpdHlcIiAnICtcbiAgICAgICAgICAgICAgICAnbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIHNwLW9iamVjdC1zdWdnZXN0LWxvb2t1cC1pZD1cInRlc3RJZFwiIHNwLW9iamVjdC1zdWdnZXN0LWNvbnRleHQ9XCJjb250ZXh0XCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLW9iamVjdC1zdWdnZXN0LWlkPVwic3VnZ2VzdC1pZFwiICcgK1xuICAgICAgICAgICAgICAgICdzcC1vYmplY3Qtc3VnZ2VzdC1wYXJhbXM9XCJ7JnF1b3Q7d29ya2dyb3VwJnF1b3Q7OiZxdW90O3NvbWV3b3JrZ3JvdXAmcXVvdDt9XCIvPic7XG5cbiAgICAgICAgdmFyIGVsID0gY29tcGlsZShlbHQpO1xuICAgICAgICB2YXIgaXNvbGF0ZWRTY29wZSA9IGVsLmlzb2xhdGVTY29wZSgpO1xuICAgICAgICBleHBlY3QoaXNvbGF0ZWRTY29wZS5leHRyYVBhcmFtcykudG9FcXVhbCh7d29ya2dyb3VwOiAnc29tZXdvcmtncm91cCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdkZWZhdWx0cyB0byBhIGxpbWl0IG9mIDUgcmVzdWx0cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWwgPSBjb21waWxlKHNpbXBsZVN1Z2dlc3QpO1xuICAgICAgICB2YXIgaXNvbGF0ZWRTY29wZSA9IGVsLmlzb2xhdGVTY29wZSgpO1xuICAgICAgICBleHBlY3QoaXNvbGF0ZWRTY29wZS5zcE9iamVjdFN1Z2dlc3RMaW1pdCkudG9FcXVhbCg1KTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3Mgc3BlY2lmeWluZyBhIGxpbWl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbHQgPSAnPHNwLW9iamVjdC1zdWdnZXN0ICcgK1xuICAgICAgICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtYWxsb3dlZC12YWx1ZXM9XCJnZXRPYmplY3RzKClcIicgICtcbiAgICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWlkPVwic3VnZ2VzdC1pZFwiJyArXG4gICAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1saW1pdD1cIjI1XCInICtcbiAgICAgICAgICAgICAgICAgICcgICAgIG5nLW1vZGVsPVwic2VsZWN0ZWRPYmplY3RcIiAvPicsXG4gICAgICAgICAgICBlbCA9IGNvbXBpbGUoZWx0KTtcbiAgICAgICAgdmFyIGlzb2xhdGVkU2NvcGUgPSBlbC5pc29sYXRlU2NvcGUoKTtcbiAgICAgICAgZXhwZWN0KGlzb2xhdGVkU2NvcGUuc3BPYmplY3RTdWdnZXN0TGltaXQpLnRvRXF1YWwoJzI1Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGVmYXVsdHMgZWRpdGFibGUgdG8gZmFsc2UgaWYgbm90IHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWwgPSBjb21waWxlKHNpbXBsZVN1Z2dlc3QpO1xuICAgICAgICB2YXIgaXNvbGF0ZWRTY29wZSA9IGVsLmlzb2xhdGVTY29wZSgpO1xuICAgICAgICBleHBlY3QoaXNvbGF0ZWRTY29wZS5lZGl0YWJsZSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnYWxsb3dzIHNwZWNpZnlpbmcgYW4gaXRlbVRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgndGVtcGxhdGUvbXktc3VnZ2VzdC1pdGVtLmh0bWwnLCAndGVzdCB0ZXN0IHRlc3QnKTtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QgJyArXG4gICAgICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtYWxsb3dlZC12YWx1ZXM9XCJnZXRPYmplY3RzKClcIicgICtcbiAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1pZD1cInN1Z2dlc3QtaWRcIicgK1xuICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWxpbWl0PVwiMjVcIicgK1xuICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWl0ZW0tdGVtcGxhdGU9XCJ0ZW1wbGF0ZS9teS1zdWdnZXN0LWl0ZW0uaHRtbFwiJyArXG4gICAgICAgICAgICAgICAgJyAgICAgbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIC8+JyxcbiAgICAgICAgICAgIGVsID0gY29tcGlsZShlbHQpO1xuICAgICAgICB2YXIgaXNvbGF0ZWRTY29wZSA9IGVsLmlzb2xhdGVTY29wZSgpO1xuICAgICAgICBleHBlY3QoaXNvbGF0ZWRTY29wZS5zcE9iamVjdFN1Z2dlc3RJdGVtVGVtcGxhdGUpLnRvRXF1YWwoJ3RlbXBsYXRlL215LXN1Z2dlc3QtaXRlbS5odG1sJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmFpbHMgY29tcGlsYXRpb24gd2l0aCBhbiBpbnZhbGlkIGl0ZW0gdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QgJyArXG4gICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1hbGxvd2VkLXZhbHVlcz1cImdldE9iamVjdHMoKVwiJyAgK1xuICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCInICtcbiAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWxpbWl0PVwiMjVcIicgK1xuICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtaXRlbS10ZW1wbGF0ZT1cInRlbXBsYXRlL3VuZGVmaW5lZC1zdWdnZXN0Lmh0bWxcIicgK1xuICAgICAgICAgICAgJyAgICAgbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIC8+JztcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjb21waWxlKGVsdCk7IH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGxvd3Mgc3BlY2lmeWluZyBhIHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgndGVtcGxhdGUvbXktc3VnZ2VzdC5odG1sJywgJ3Rlc3QgdGVzdCB0ZXN0Jyk7XG4gICAgICAgIHZhciBlbHQgPSAnPHNwLW9iamVjdC1zdWdnZXN0ICcgK1xuICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWFsbG93ZWQtdmFsdWVzPVwiZ2V0T2JqZWN0cygpXCInICArXG4gICAgICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCInICtcbiAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1saW1pdD1cIjI1XCInICtcbiAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1pdGVtLXRlbXBsYXRlPVwidGVtcGxhdGUvbXktc3VnZ2VzdC5odG1sXCInICtcbiAgICAgICAgICAgICAgICAnICAgICBuZy1tb2RlbD1cInNlbGVjdGVkT2JqZWN0XCIgLz4nLFxuICAgICAgICAgICAgZWwgPSBjb21waWxlKGVsdCk7XG4gICAgICAgIHZhciBpc29sYXRlZFNjb3BlID0gZWwuaXNvbGF0ZVNjb3BlKCk7XG4gICAgICAgIGV4cGVjdChpc29sYXRlZFNjb3BlLnNwT2JqZWN0U3VnZ2VzdEl0ZW1UZW1wbGF0ZSkudG9FcXVhbCgndGVtcGxhdGUvbXktc3VnZ2VzdC5odG1sJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmFpbHMgY29tcGlsYXRpb24gd2l0aCBhbiBpbnZhbGlkIHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbHQgPSAnPHNwLW9iamVjdC1zdWdnZXN0ICcgK1xuICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWFsbG93ZWQtdmFsdWVzPVwiZ2V0T2JqZWN0cygpXCInICArXG4gICAgICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCInICtcbiAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1saW1pdD1cIjI1XCInICtcbiAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC10ZW1wbGF0ZT1cInRlbXBsYXRlL3VuZGVmaW5lZC1zdWdnZXN0Lmh0bWxcIicgK1xuICAgICAgICAgICAgICAgICcgICAgIG5nLW1vZGVsPVwic2VsZWN0ZWRPYmplY3RcIiAvPic7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgY29tcGlsZShlbHQpOyB9KS50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2V0cyBvYmplY3RMaXN0IHRvIHNlYXJjaE9iamVjdHMoKSBpZiBhIGNsYXNzIGlzIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWx0ID0gJzxzcC1vYmplY3Qtc3VnZ2VzdCAnICtcbiAgICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWlkPVwic3VnZ2VzdC1pZFwiJyArXG4gICAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1jbGFzcz1cInNhaWxwb2ludC5vYmplY3QuQnVuZGxlXCInICtcbiAgICAgICAgICAgICAgICAgICcgICAgIG5nLW1vZGVsPVwic2VsZWN0ZWRPYmplY3RcIiAvPicsXG4gICAgICAgICAgICBlbCA9IGNvbXBpbGUoZWx0KTtcbiAgICAgICAgdmFyIGlzb2xhdGVkU2NvcGUgPSBlbC5pc29sYXRlU2NvcGUoKTtcbiAgICAgICAgZXhwZWN0KGlzb2xhdGVkU2NvcGUub2JqZWN0TGlzdCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KGlzb2xhdGVkU2NvcGUuc3BPYmplY3RTdWdnZXN0Q2xhc3MpLnRvRXF1YWwoJ3NhaWxwb2ludC5vYmplY3QuQnVuZGxlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGVmYXVsdHMgdG8gcmVxdWlyZWQ9ZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsID0gY29tcGlsZShzaW1wbGVTdWdnZXN0KTtcbiAgICAgICAgdmFyIGlzb2xhdGVkU2NvcGUgPSBlbC5pc29sYXRlU2NvcGUoKTtcbiAgICAgICAgZXhwZWN0KGlzb2xhdGVkU2NvcGUubmdSZXF1aXJlZCkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2V0cyByZXF1aXJlZCB1c2luZyByZXF1aXJlZCB3aXRob3V0IGEgdmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QgJyArXG4gICAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1hbGxvd2VkLXZhbHVlcz1cImdldE9iamVjdHMoKVwiJyAgK1xuICAgICAgICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCInICtcbiAgICAgICAgICAgICAgICAgICcgICAgIG5nLXJlcXVpcmVkPVwidHJ1ZVwiJyArXG4gICAgICAgICAgICAgICAgICAnICAgICBuZy1tb2RlbD1cInNlbGVjdGVkT2JqZWN0XCIgLz4nLFxuICAgICAgICAgICAgZWwgPSBjb21waWxlKGVsdCk7XG4gICAgICAgIHZhciBpc29sYXRlZFNjb3BlID0gZWwuaXNvbGF0ZVNjb3BlKCk7XG4gICAgICAgIGV4cGVjdChpc29sYXRlZFNjb3BlLm5nUmVxdWlyZWQpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzZXRzIHJlcXVpcmVkIHVzaW5nIHRoZSBuZy1yZXF1aXJlZCBhdHRyaWJ1dGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QgJyArXG4gICAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1hbGxvd2VkLXZhbHVlcz1cImdldE9iamVjdHMoKVwiJyAgK1xuICAgICAgICAgICAgICAgICAgJyAgICAgc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJzdWdnZXN0LWlkXCInICtcbiAgICAgICAgICAgICAgICAgICcgICAgIG5nLXJlcXVpcmVkPVwiaXNUaGlzUmVxdWlyZWRcIicgK1xuICAgICAgICAgICAgICAgICAgJyAgICAgbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIC8+JyxcbiAgICAgICAgICAgIGVsO1xuXG4gICAgICAgIHNjb3BlLmlzVGhpc1JlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgZWwgPSBjb21waWxlKGVsdCk7XG4gICAgICAgIHZhciBpc29sYXRlZFNjb3BlID0gZWwuaXNvbGF0ZVNjb3BlKCk7XG4gICAgICAgIGV4cGVjdChpc29sYXRlZFNjb3BlLm5nUmVxdWlyZWQpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCBjYWxsIG9iamVjdFN1Z2dlc3RTZXJ2aWNlIGlmIG5vdCBxdWVyeWluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb21waWxlKHNpbXBsZVN1Z2dlc3QpO1xuICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIGV4cGVjdChvYmplY3RTdWdnZXN0U2VydmljZS5nZXRPYmplY3RzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXMgbm90IGNhbGwgb2JqZWN0U3VnZ2VzdFNlcnZpY2Ugd2hlbiBhbGxvd2VkIHZhbHVlcyBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsID0gY29tcGlsZShzaW1wbGVTdWdnZXN0QWxsb3dlZFZhbHVlcyk7XG4gICAgICAgIHN1Z2dlc3RUZXN0U2VydmljZS5zZWFyY2hCeVR5cGluZyhlbCwgJ2FjYycsIHNjb3BlKTtcbiAgICAgICAgZXhwZWN0KG9iamVjdFN1Z2dlc3RTZXJ2aWNlLmdldE9iamVjdHMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FsbHMgb2JqZWN0U3VnZ2VzdFNlcnZpY2Ugd2hlbiBxdWVyeWluZyBpZiBjbGFzcyBpcyBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsdCA9ICc8c3Atb2JqZWN0LXN1Z2dlc3QnICtcbiAgICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWlkPVwic3VnZ2VzdC1pZFwiJyArXG4gICAgICAgICAgICAgICAgICAnICAgICBzcC1vYmplY3Qtc3VnZ2VzdC1jbGFzcz1cInNhaWxwb2ludC5vYmplY3QuQnVuZGxlXCInICtcbiAgICAgICAgICAgICAgICAgICcgICAgIHNwLW9iamVjdC1zdWdnZXN0LWZpbHRlcj1cImZvb1wiICcgK1xuICAgICAgICAgICAgICAgICAgJyAgICAgbmctbW9kZWw9XCJzZWxlY3RlZE9iamVjdFwiIC8+JyxcbiAgICAgICAgICAgIGVsID0gY29tcGlsZShlbHQpLFxuICAgICAgICAgICAgYXJncztcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlYXJjaEJ5VHlwaW5nKGVsLCAnYWNjJywgc2NvcGUpO1xuICAgICAgICBleHBlY3Qob2JqZWN0U3VnZ2VzdFNlcnZpY2UuZ2V0T2JqZWN0cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gICAgICAgIGFyZ3MgPSBvYmplY3RTdWdnZXN0U2VydmljZS5nZXRPYmplY3RzLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xuICAgICAgICBleHBlY3QoYXJnc1swXSkudG9FcXVhbCgnc2FpbHBvaW50Lm9iamVjdC5CdW5kbGUnKTtcbiAgICAgICAgZXhwZWN0KGFyZ3NbMV0pLnRvRXF1YWwoJ2FjYycpO1xuICAgICAgICBleHBlY3QoYXJnc1syXSkudG9FcXVhbCg1KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NbNV0pLnRvRXF1YWwoJ2ZvbycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3dzIHRoZSBvYmplY3QgbGlzdCB3aGVuIHF1ZXJ5aW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbCA9IGNvbXBpbGUoc2ltcGxlU3VnZ2VzdCksXG4gICAgICAgICAgICBpdGVtcztcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlYXJjaEJ5VHlwaW5nKGVsLCAnYWNjJywgc2NvcGUpO1xuICAgICAgICBpdGVtcyA9IHN1Z2dlc3RUZXN0U2VydmljZS5nZXRTdWdnZXN0SXRlbXMoZWwsIHNjb3BlKTtcbiAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICB9KTtcblxuXG4gICAgZGVzY3JpYmUoJ2NsaWNraW5nIHRoZSBkcm9wLWRvd24gYXJyb3cnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsO1xuXG4gICAgICAgIC8vIEFsbCBvZiB0aGVzZSB0ZXN0cyB1c2UgdGhlIHNhbWUgdHlwZSBvZiBzdWdnZXN0LlxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWwgPSBjb21waWxlKHNpbXBsZVN1Z2dlc3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3MgdGhlIG9iamVjdCBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXM7XG4gICAgICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2UuY2xpY2tEcm9wZG93bkFycm93KGVsLCBzY29wZSk7XG4gICAgICAgICAgICBpdGVtcyA9IHN1Z2dlc3RUZXN0U2VydmljZS5nZXRTdWdnZXN0SXRlbXMoZWwsIHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjbGVhcnMgdGhlIGlucHV0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSBlbC5maW5kKCdpbnB1dCcpO1xuICAgICAgICAgICAgaW5wdXQudmFsKCdmb28nKTtcbiAgICAgICAgICAgIHN1Z2dlc3RUZXN0U2VydmljZS5jbGlja0Ryb3Bkb3duQXJyb3coZWwsIHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChpbnB1dC52YWwoKSkudG9FcXVhbCgnJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29iamVjdCBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbDtcblxuICAgICAgICAvLyBBbGwgb2YgdGhlc2UgdGVzdHMgdXNlIHRoZSBzYW1lIHR5cGUgb2Ygc3VnZ2VzdC5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsID0gY29tcGlsZShzaW1wbGVTdWdnZXN0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBvYmplY3QgZGlzcGxheSBuYW1lJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHN1Z2dlc3RUZXN0U2VydmljZS5nZXRTdWdnZXN0SXRlbShlbCwgMCwgc2NvcGUpLFxuICAgICAgICAgICAgICAgIG5hbWVFbCA9IGl0ZW0uZmluZCgnc3BhbicpWzBdO1xuICAgICAgICAgICAgZXhwZWN0KG5hbWVFbC50ZXh0Q29udGVudCkudG9FcXVhbCgnQWNjb3VudGluZyBHZW5lcmFsIEFjY2VzcyAtIElUJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NlbGVjdGluZyBhbiBvYmplY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsO1xuXG4gICAgICAgIC8vIEFsbCBvZiB0aGVzZSB0ZXN0cyB1c2UgdGhlIHNhbWUgdHlwZSBvZiBzdWdnZXN0LlxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWwgPSBjb21waWxlKHNpbXBsZVN1Z2dlc3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2V0cyB0aGUgbW9kZWwgdmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN1Z2dlc3RUZXN0U2VydmljZS5zZWxlY3RTdWdnZXN0SXRlbShlbCwgMCwgc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNlbGVjdGVkT2JqZWN0KS50b0JlKG9iamVjdHNbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaGlkZXMgdGhlIG9iamVjdCBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2Uuc2VsZWN0U3VnZ2VzdEl0ZW0oZWwsIDAsIHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChzdWdnZXN0VGVzdFNlcnZpY2UuaXNEcm9wZG93bk9wZW4oZWwpKS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1dHMgdGhlIGRpc3BsYXkgbmFtZSBvZiB0aGUgb2JqZWN0IGluIHRoZSBpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlucHV0O1xuICAgICAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlbGVjdFN1Z2dlc3RJdGVtKGVsLCAwLCBzY29wZSk7XG4gICAgICAgICAgICBpbnB1dCA9IGVsLmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgICAgICBleHBlY3QoaW5wdXQudmFsKCkpLnRvRXF1YWwoJ0FjY291bnRpbmcgR2VuZXJhbCBBY2Nlc3MgLSBJVCcpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
