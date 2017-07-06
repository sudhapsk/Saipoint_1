System.register(['test/js/TestInitializer', 'common/search/SearchModule', 'test/js/TestModule', 'test/js/common/i18n/MockTranslateFilter'], function (_export) {
    'use strict';

    var searchModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonSearchSearchModule) {
            searchModule = _commonSearchSearchModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_testJsCommonI18nMockTranslateFilter) {}],
        execute: function () {

            /**
             * Tests for the filter panel directives - including the FilterPanelItemDirective, FilterPanelDirective,
             * and spFilterPanelTitle.
             */
            describe('', function () {
                var $compile, $scope;

                beforeEach(module(searchModule, testModule));

                //Create a mock ColumnSuggestService
                beforeEach(module(function ($provide) {
                    $provide.factory('columnSuggestService', function (testService) {
                        return {
                            getObjects: testService.createPromiseSpy(false, {
                                count: 0,
                                objects: {}
                            })
                        };
                    });
                }));

                /**
                 * Setup the dependencies and data needs by all tests.
                 */
                beforeEach(inject(function (_$compile_, _$rootScope_, spTranslateFilter) {
                    $compile = _$compile_;
                    $scope = _$rootScope_.$new();

                    // Mock the translate service to return some canned data.
                    spTranslateFilter.configureCatalog({
                        'ui_access_filter_by': function (args) {
                            return 'Filter By: ' + args[1];
                        },
                        'ui_label': 'Yo momma',
                        'ui_label2': 'Yo daddy',
                        'ui_access_cancel': 'Cancel',
                        'ui_access_clear': 'Clear',
                        'ui_access_apply': 'Apply'
                    });
                }));

                function createElement(elementDefinition) {
                    var element = angular.element(elementDefinition);
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                describe('FilterPanelItemDirective', function () {
                    var elementDefinition = '<sp-filter-panel-item sp-id="id" sp-filter="filter" ng-model="value" />',
                        filterTemplateService,
                        filter,
                        element;

                    beforeEach(inject(function (_filterTemplateService_, Filter) {
                        filterTemplateService = _filterTemplateService_;

                        // Setup a Filter to compile with.
                        filter = new Filter({
                            property: 'prop',
                            label: 'ui_label',
                            dataType: Filter.DATA_TYPE_STRING
                        });

                        // Setup the scope to compile with.
                        $scope.filter = filter;
                        $scope.value = null;

                        // Mock the filterTemplateService.
                        spyOn(filterTemplateService, 'getFilterTemplate').and.returnValue('<input id="idItem0" type="text" />');

                        // Create an element to test with.
                        element = createElement(elementDefinition);
                    }));

                    it('displays an i18n label using the filter label', function () {
                        var label = element.find('label');
                        expect(label.text()).toEqual('Yo momma');
                    });

                    it('includes the filter template after the label', function () {
                        var input = element.find('#idItem0');
                        expect(input.length).toEqual(1);
                    });
                });

                describe('FilterPanelDirective', function () {
                    var elementDefinition = '<sp-filter-panel id="id" sp-title="title" sp-displayed="displayed" ' + '                 sp-filter-groups="filterGroups" sp-search-data="searchData" ' + '                 sp-apply-func="search()" />',
                        filterTemplateService,
                        filter1,
                        filter2,
                        filter3,
                        filter4,
                        searchData,
                        element,
                        $timeout,
                        Filter,
                        SearchData;

                    beforeEach(inject(function (_filterTemplateService_, _Filter_, _$timeout_, _SearchData_) {
                        filterTemplateService = _filterTemplateService_;
                        Filter = _Filter_;
                        SearchData = _SearchData_;
                        $timeout = _$timeout_;
                        // Setup Filters to compile with.
                        filter1 = new Filter({
                            property: 'prop',
                            label: 'ui_label',
                            dataType: Filter.DATA_TYPE_STRING
                        });
                        filter2 = new Filter({
                            property: 'prop2',
                            label: 'ui_label2',
                            dataType: Filter.DATA_TYPE_NUMBER
                        });

                        filter3 = new Filter({
                            property: 'prop3',
                            label: 'ui_label3',
                            dataType: Filter.DATA_TYPE_STRING
                        });

                        filter4 = new Filter({
                            property: 'prop4',
                            label: 'ui_label4',
                            dataType: Filter.DATA_TYPE_NUMBER
                        });

                        // Setup fake searchData.
                        searchData = new SearchData();
                        searchData.initializeFilters([filter1, filter2]);
                        searchData.filterValues[filter1.property].value = 'Yo Adrian!';
                        searchData.filterValues[filter2.property].value = 43;

                        // Setup the scope to compile with.
                        $scope.id = 'filterPanelId';
                        $scope.title = 'Hi mom';
                        $scope.displayed = false;
                        $scope.filterGroups = [[filter1, filter2]];
                        $scope.searchData = searchData;
                        $scope.search = jasmine.createSpy();

                        // Mock the filterTemplateService.
                        spyOn(filterTemplateService, 'getFilterTemplate').and.callFake(function (filter, id) {
                            if (filter.dataType === Filter.DATA_TYPE_NUMBER) {
                                return '<input id="' + id + '" type="number" ng-model="ngModel.value" />';
                            } else {
                                return '<input id="' + id + '" type="text" ng-model="ngModel.value" />';
                            }
                        });

                        // Create an element to test with.
                        element = createElement(elementDefinition);
                    }));

                    afterEach(function () {
                        if (element) {
                            angular.element(element).remove();
                        }
                    });

                    describe('collapse', function () {
                        it('starts collapsed if spDisplayed is false', function () {
                            // Needing for animation to complete, which will update classes
                            $timeout.flush();
                            expect(element.hasClass('collapse')).toEqual(true);
                        });

                        it('starts expanded if spDisplayed is true', function () {
                            var newElement;
                            $scope.displayed = true;
                            newElement = createElement(elementDefinition);
                            // Needing for animation to complete, which will update classes
                            $timeout.flush();
                            // After displayed, the element does not have collapse class but does have in class.
                            expect(newElement.hasClass('collapse')).toEqual(false);
                            expect(newElement.hasClass('in')).toEqual(true);
                        });

                        it('toggles collapse state when spDisplayed changes', function () {
                            $scope.displayed = true;
                            $scope.$apply();

                            // The element has the collapsing class while transitioning to expanded.
                            expect(element.hasClass('collapsing')).toEqual(true);
                        });
                    });

                    describe('title', function () {
                        it('is displayed if there is one', function () {
                            var titleEl = element.find('h5');
                            expect(titleEl.text()).toEqual($scope.title);
                        });

                        it('is not displayed if there is not one', function () {
                            var newElement, titleEl;
                            delete $scope.title;

                            newElement = createElement(elementDefinition);
                            titleEl = element.find('h5');
                            expect(titleEl.length).toEqual(0);
                        });
                    });

                    describe('spFilterPanelHeading', function () {
                        var elementWithHeading,
                            elementDefinitionWithHeading = '<sp-filter-panel id="id" sp-displayed="displayed" ' + '                 sp-filters="filters" sp-search-data="searchData" ' + '                 sp-apply-func="search()" >' + '  <sp-filter-panel-heading><button class="titleButton">head</button></sp-filter-panel-heading>' + '</sp-filter-panel>',
                            elementDefinitionNoHeading = '<sp-filter-panel id="id" sp-title="title" sp-displayed="displayed" ' + '                 sp-filters="filters" sp-search-data="searchData" ' + '                 sp-apply-func="search()" >' + '</sp-filter-panel>',
                            elementNoHeading;

                        beforeEach(function () {
                            elementWithHeading = createElement(elementDefinitionWithHeading);
                            elementNoHeading = createElement(elementDefinitionNoHeading);
                        });

                        it('sp-filter-panel-heading element is placed in panel-heading element', function () {
                            var headingEl = elementWithHeading.find('.panel-heading');

                            // there should be the panel heading element
                            expect(headingEl.length).toEqual(1);

                            // button defined within sp-filter-panel-title element should exist
                            expect(angular.element(headingEl).find('button.titleButton').length).toEqual(1);
                        });

                        it('panel-heading element is removed without sp-filter-panel-heading element', function () {
                            var headingEl = elementNoHeading.find('.panel-heading');

                            // there should be no panel heading element
                            expect(headingEl.length).toEqual(0);
                        });
                    });

                    it('renders filter item IDs with indexes', function () {
                        var input = element.find('#idItem0');
                        expect(input.length).toEqual(1);
                        input = element.find('#idItem1');
                        expect(input.length).toEqual(1);
                    });

                    it('renders one clearfix div for every two filters', function () {
                        var element2,
                            clearfixdiv = element.find('div.clearfix');

                        expect(clearfixdiv.length).toEqual(1);

                        $scope.filterGroups = [[filter1, filter2, filter3, filter4]];

                        element2 = createElement(elementDefinition);
                        clearfixdiv = element2.find('div.clearfix');
                        expect(clearfixdiv.length).toEqual(2);
                    });

                    describe('filter input field', function () {
                        it('is initialized with data from searchData', function () {
                            var input = element.find('#idItem0');
                            expect(input.val()).toEqual('Yo Adrian!');
                            input = element.find('#idItem1');
                            expect(input.val()).toEqual('43');
                        });

                        it('updates searchData when value is changed', function () {
                            var input = element.find('#idItem0'),
                                newString = 'I will break you';
                            input.val(newString);
                            input.trigger('input');
                            expect(searchData.filterValues.prop.value).toEqual(newString);

                            input = element.find('#idItem1');
                            input.val('7');
                            input.trigger('input');
                            expect(searchData.filterValues.prop2.value).toEqual(7);
                        });
                    });

                    function getBtn(btnSelector) {
                        var btn = element.find(btnSelector);
                        expect(btn.length).toEqual(1);
                        return btn;
                    }

                    function clickBtn(btnSelector) {
                        var btn = getBtn(btnSelector);
                        btn.click();
                        btn.trigger('click');
                    }

                    function testFilterBtnEnabled(hasFilterValues, expectDisabled, btnId) {
                        var btn;
                        searchData.hasFilterValues = jasmine.createSpy().and.returnValue(hasFilterValues);
                        $scope.$apply();
                        btn = getBtn(btnId);
                        expect(btn.hasClass('disabled')).toEqual(expectDisabled);
                    }

                    function testApplyFuncCalled(btnId) {
                        searchData.clearFilterValues = jasmine.createSpy().and.returnValue(true);
                        $scope.$apply();
                        clickBtn(btnId);
                        expect($scope.search).toHaveBeenCalled();
                    }

                    describe('clear button', function () {
                        it('is enabled if there are filter values', function () {
                            testFilterBtnEnabled(true, false, '#idClearBtn');
                        });

                        it('clears filter values when clicked', function () {
                            searchData.clearFilterValues = jasmine.createSpy();
                            clickBtn('#idClearBtn');
                            expect(searchData.clearFilterValues).toHaveBeenCalled();
                        });

                        it('clears added additional filters when clicked', function () {
                            spyOn(searchData, 'popAllAdditionalFiltersFromGroups');
                            clickBtn('#idClearBtn');
                            expect(searchData.popAllAdditionalFiltersFromGroups).toHaveBeenCalled();
                        });

                        it('calls spApplyFunc when clicked', function () {
                            testApplyFuncCalled('#idClearBtn');
                        });
                    });

                    describe('apply button', function () {
                        it('calls apply function when clicked', function () {
                            testApplyFuncCalled('#idApplyBtn');
                        });

                        it('is disabled if there are no filter values', function () {
                            testFilterBtnEnabled(false, true, '#idApplyBtn');
                        });

                        it('is enabled when there are filter values', function () {
                            testFilterBtnEnabled(true, false, '#idApplyBtn');
                        });
                    });

                    describe('additional filters', function () {
                        function clickAddFilter(element, index) {
                            var foundLinkElement = element.find('.sp-additional-filters .sp-dropdown-group a'),
                                linkElement = foundLinkElement[index];
                            angular.element(linkElement).click();
                            $scope.$apply();
                        }

                        function clickRemoveFilter(element, index) {
                            var foundRemoveButton = element.find('.sp-additional-filter-remove-btn'),
                                removeButton = foundRemoveButton[index];
                            angular.element(removeButton).click();
                            $scope.$apply();
                        }

                        var additionalFiltersTemplate = '<sp-filter-panel id="id" sp-title="title" sp-displayed="displayed"\n                                 sp-search-data="additionalSearchData" sp-apply-func="search()" />',
                            additionalFilter = undefined,
                            additionalSearchData = undefined;

                        beforeEach(function () {
                            additionalFilter = new Filter({
                                property: 'additionalFilterProp',
                                additional: true,
                                attributes: {
                                    category: {
                                        label: 'category 1',
                                        index: 0
                                    }
                                }
                            });

                            additionalSearchData = new SearchData();
                            $scope.additionalSearchData = additionalSearchData;
                        });

                        it('renders dropdown if additional filters are defined', function () {
                            additionalSearchData.initializeFilters([filter1, filter2, additionalFilter]);
                            element = createElement(additionalFiltersTemplate);
                            expect(element.find('.sp-additional-filters').length).toEqual(1);
                        });

                        it('does not render dropdown if no additional filters are defined', function () {
                            additionalSearchData.initializeFilters([filter1, filter2]);
                            element = createElement(additionalFiltersTemplate);
                            expect(element.find('.sp-additional-filters').length).toEqual(0);
                        });

                        it('renders dropdown in own row if it does not fit with other filters', function () {
                            var filter1 = new Filter({
                                property: 'addProp1',
                                additional: true
                            }),
                                filter2 = new Filter({
                                property: 'addProp2',
                                additional: true
                            }),
                                filter3 = new Filter({
                                property: 'addProp3',
                                additional: true
                            }),
                                filter4 = new Filter({
                                property: 'addProp4',
                                additional: true
                            }),
                                filter5 = new Filter({
                                property: 'addProp5',
                                additional: true
                            });

                            additionalSearchData.initializeFilters([filter1, filter2, filter3, filter4, filter5]);

                            // Add 4 filters to fill a group
                            additionalSearchData.pushAdditionalFilterToGroups(filter1);
                            additionalSearchData.pushAdditionalFilterToGroups(filter2);
                            additionalSearchData.pushAdditionalFilterToGroups(filter3);
                            additionalSearchData.pushAdditionalFilterToGroups(filter4);

                            element = createElement(additionalFiltersTemplate);

                            // Find the dropdown and its parent, then verify the parent is not holding any filters
                            var dropdownElement = element.find('.sp-additional-filters'),
                                parentRow = dropdownElement.parent();
                            expect(parentRow.find('.sp-additional-filter').length).toEqual(0);
                        });

                        it('renders dropown with other filters if it fits', function () {
                            var filter1 = new Filter({
                                property: 'addProp1',
                                additional: true
                            }),
                                filter2 = new Filter({
                                property: 'addProp2',
                                additional: true
                            }),
                                filter3 = new Filter({
                                property: 'addProp3',
                                additional: true
                            }),
                                filter4 = new Filter({
                                property: 'addProp4',
                                additional: true
                            });

                            additionalSearchData.initializeFilters([filter1, filter2, filter3, filter4]);
                            // Add 3 filters
                            additionalSearchData.pushAdditionalFilterToGroups(filter1);
                            additionalSearchData.pushAdditionalFilterToGroups(filter2);
                            additionalSearchData.pushAdditionalFilterToGroups(filter3);
                            element = createElement(additionalFiltersTemplate);

                            // Find the dropdown and its parent, then verify the parent also is holding the filters
                            var dropdownElement = element.find('.sp-additional-filters'),
                                parentRow = dropdownElement.parent();
                            expect(parentRow.find('.sp-additional-filter').length).toEqual(3);
                        });

                        it('calls through to search data to push additional filter to groups when clicked', function () {
                            additionalSearchData.initializeFilters([filter1, filter2, additionalFilter]);
                            element = createElement(additionalFiltersTemplate);
                            $scope.$apply();
                            spyOn(additionalSearchData, 'pushAdditionalFilterToGroups').and.callThrough();
                            clickAddFilter(element, 0);
                            // check if the additional filter was added with the remove button
                            expect(additionalSearchData.pushAdditionalFilterToGroups).toHaveBeenCalledWith(additionalFilter);
                            var additionalFiltersRemoveBtn = element.find('.sp-additional-filter-remove-btn');
                            expect(additionalFiltersRemoveBtn.length).toBe(1);
                        });

                        it('calls through to search data to remove filter when remove button is clicked', function () {
                            var filters = [filter1, filter2, filter3, filter4, new Filter({
                                property: 'addProp1',
                                additional: true
                            }), new Filter({
                                property: 'addProp2',
                                additional: true
                            }), new Filter({
                                property: 'addProp3',
                                additional: true
                            }), new Filter({
                                property: 'addProp4',
                                additional: true
                            }), new Filter({
                                property: 'addProp5',
                                additional: true
                            })];
                            additionalSearchData.initializeFilters(filters);
                            spyOn(additionalSearchData, 'popAdditionalFilterFromGroups').and.callThrough();
                            element = createElement(additionalFiltersTemplate);
                            $scope.$apply();
                            // no additional filters added yet
                            var additionalFiltersRemoveBtn = element.find('.sp-additional-filter-remove-btn');
                            expect(additionalFiltersRemoveBtn.length).toBe(0);
                            // Add 5 filters
                            clickAddFilter(element, 0);
                            clickAddFilter(element, 0);
                            clickAddFilter(element, 0);
                            clickAddFilter(element, 0);
                            clickAddFilter(element, 0);

                            // check if 5 additional filters added with the remove button
                            additionalFiltersRemoveBtn = element.find('.sp-additional-filter-remove-btn');
                            expect(additionalFiltersRemoveBtn.length).toBe(5);

                            // Remove the first one
                            clickRemoveFilter(element, 0);

                            expect(additionalSearchData.popAdditionalFilterFromGroups).toHaveBeenCalledWith(filters[4]);

                            // Filter should have moved back to additional filters
                            additionalFiltersRemoveBtn = element.find('.sp-additional-filter-remove-btn');
                            expect(additionalFiltersRemoveBtn.length).toBe(4);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9zZWFyY2gvRmlsdGVyUGFuZWxEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsOEJBQThCLHNCQUFzQiw0Q0FBNEMsVUFBVSxTQUFTO0lBQS9KOztJQUdJLElBQUksY0FBYztJQUNsQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwyQkFBMkI7WUFDakYsZUFBZSwwQkFBMEI7V0FDMUMsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7V0FDaEMsVUFBVSxzQ0FBc0M7UUFDbkQsU0FBUyxZQUFZOzs7Ozs7WUFDN0IsU0FBUyxJQUFJLFlBQVc7Z0JBQ3BCLElBQUksVUFBVTs7Z0JBRWQsV0FBVyxPQUFPLGNBQWM7OztnQkFHaEMsV0FBVyxPQUFPLFVBQVMsVUFBVTtvQkFDakMsU0FBUyxRQUFRLHdCQUF3QixVQUFTLGFBQWE7d0JBQzNELE9BQU87NEJBQ0gsWUFBWSxZQUFZLGlCQUFpQixPQUFPO2dDQUM1QyxPQUFPO2dDQUNQLFNBQVM7Ozs7Ozs7OztnQkFTekIsV0FBVyxPQUFPLFVBQVMsWUFBWSxjQUFjLG1CQUFtQjtvQkFDcEUsV0FBVztvQkFDWCxTQUFTLGFBQWE7OztvQkFHdEIsa0JBQWtCLGlCQUFpQjt3QkFDL0IsdUJBQXVCLFVBQVMsTUFBTTs0QkFDbEMsT0FBTyxnQkFBZ0IsS0FBSzs7d0JBRWhDLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLG1CQUFtQjt3QkFDbkIsbUJBQW1COzs7O2dCQUkzQixTQUFTLGNBQWMsbUJBQW1CO29CQUN0QyxJQUFJLFVBQVUsUUFBUSxRQUFRO29CQUM5QixTQUFTLFNBQVM7b0JBQ2xCLE9BQU87b0JBQ1AsT0FBTzs7O2dCQUdYLFNBQVMsNEJBQTRCLFlBQVc7b0JBQzVDLElBQUksb0JBQW9CO3dCQUNwQjt3QkFDQTt3QkFDQTs7b0JBRUosV0FBVyxPQUFPLFVBQVMseUJBQXlCLFFBQVE7d0JBQ3hELHdCQUF3Qjs7O3dCQUd4QixTQUFTLElBQUksT0FBTzs0QkFDaEIsVUFBVTs0QkFDVixPQUFPOzRCQUNQLFVBQVUsT0FBTzs7Ozt3QkFJckIsT0FBTyxTQUFTO3dCQUNoQixPQUFPLFFBQVE7Ozt3QkFHZixNQUFNLHVCQUF1QixxQkFDekIsSUFBSSxZQUFZOzs7d0JBR3BCLFVBQVUsY0FBYzs7O29CQUc1QixHQUFHLGlEQUFpRCxZQUFXO3dCQUMzRCxJQUFJLFFBQVEsUUFBUSxLQUFLO3dCQUN6QixPQUFPLE1BQU0sUUFBUSxRQUFROzs7b0JBR2pDLEdBQUcsZ0RBQWdELFlBQVc7d0JBQzFELElBQUksUUFBUSxRQUFRLEtBQUs7d0JBQ3pCLE9BQU8sTUFBTSxRQUFRLFFBQVE7Ozs7Z0JBSXJDLFNBQVMsd0JBQXdCLFlBQVc7b0JBQ3hDLElBQUksb0JBQ0ksd0VBQ0Esa0ZBQ0E7d0JBQ0o7d0JBQ0E7d0JBQ0E7d0JBQ0E7d0JBQ0E7d0JBQ0E7d0JBQ0E7d0JBQ0E7d0JBQ0E7d0JBQ0E7O29CQUVKLFdBQVcsT0FBTyxVQUFTLHlCQUF5QixVQUFVLFlBQVksY0FBYzt3QkFDcEYsd0JBQXdCO3dCQUN4QixTQUFTO3dCQUNULGFBQWE7d0JBQ2IsV0FBVzs7d0JBRVgsVUFBVSxJQUFJLE9BQU87NEJBQ2pCLFVBQVU7NEJBQ1YsT0FBTzs0QkFDUCxVQUFVLE9BQU87O3dCQUVyQixVQUFVLElBQUksT0FBTzs0QkFDakIsVUFBVTs0QkFDVixPQUFPOzRCQUNQLFVBQVUsT0FBTzs7O3dCQUdyQixVQUFVLElBQUksT0FBTzs0QkFDakIsVUFBVTs0QkFDVixPQUFPOzRCQUNQLFVBQVUsT0FBTzs7O3dCQUdyQixVQUFVLElBQUksT0FBTzs0QkFDakIsVUFBVTs0QkFDVixPQUFPOzRCQUNQLFVBQVUsT0FBTzs7Ozt3QkFJckIsYUFBYSxJQUFJO3dCQUNqQixXQUFXLGtCQUFrQixDQUFDLFNBQVM7d0JBQ3ZDLFdBQVcsYUFBYSxRQUFRLFVBQVUsUUFBUTt3QkFDbEQsV0FBVyxhQUFhLFFBQVEsVUFBVSxRQUFROzs7d0JBR2xELE9BQU8sS0FBSzt3QkFDWixPQUFPLFFBQVE7d0JBQ2YsT0FBTyxZQUFZO3dCQUNuQixPQUFPLGVBQWUsQ0FBRSxDQUFDLFNBQVM7d0JBQ2xDLE9BQU8sYUFBYTt3QkFDcEIsT0FBTyxTQUFTLFFBQVE7Ozt3QkFHeEIsTUFBTSx1QkFBdUIscUJBQ3pCLElBQUksU0FBUyxVQUFTLFFBQVEsSUFBSTs0QkFDOUIsSUFBSSxPQUFPLGFBQWEsT0FBTyxrQkFBa0I7Z0NBQzdDLE9BQU8sZ0JBQWdCLEtBQUs7bUNBQ3pCO2dDQUNILE9BQU8sZ0JBQWdCLEtBQUs7Ozs7O3dCQUt4QyxVQUFVLGNBQWM7OztvQkFHNUIsVUFBVSxZQUFNO3dCQUNaLElBQUksU0FBUzs0QkFDVCxRQUFRLFFBQVEsU0FBUzs7OztvQkFJakMsU0FBUyxZQUFZLFlBQVc7d0JBQzVCLEdBQUcsNENBQTRDLFlBQVc7OzRCQUV0RCxTQUFTOzRCQUNULE9BQU8sUUFBUSxTQUFTLGFBQWEsUUFBUTs7O3dCQUdqRCxHQUFHLDBDQUEwQyxZQUFXOzRCQUNwRCxJQUFJOzRCQUNKLE9BQU8sWUFBWTs0QkFDbkIsYUFBYSxjQUFjOzs0QkFFM0IsU0FBUzs7NEJBRVQsT0FBTyxXQUFXLFNBQVMsYUFBYSxRQUFROzRCQUNoRCxPQUFPLFdBQVcsU0FBUyxPQUFPLFFBQVE7Ozt3QkFHOUMsR0FBRyxtREFBbUQsWUFBVzs0QkFDN0QsT0FBTyxZQUFZOzRCQUNuQixPQUFPOzs7NEJBR1AsT0FBTyxRQUFRLFNBQVMsZUFBZSxRQUFROzs7O29CQUl2RCxTQUFTLFNBQVMsWUFBVzt3QkFDekIsR0FBRyxnQ0FBZ0MsWUFBVzs0QkFDMUMsSUFBSSxVQUFVLFFBQVEsS0FBSzs0QkFDM0IsT0FBTyxRQUFRLFFBQVEsUUFBUSxPQUFPOzs7d0JBRzFDLEdBQUcsd0NBQXdDLFlBQVc7NEJBQ2xELElBQUksWUFBWTs0QkFDaEIsT0FBTyxPQUFPOzs0QkFFZCxhQUFhLGNBQWM7NEJBQzNCLFVBQVUsUUFBUSxLQUFLOzRCQUN2QixPQUFPLFFBQVEsUUFBUSxRQUFROzs7O29CQUl2QyxTQUFTLHdCQUF3QixZQUFXO3dCQUN4QyxJQUFJOzRCQUNBLCtCQUNJLHVEQUNBLHVFQUNBLGdEQUNBLG1HQUNBOzRCQUNKLDZCQUNJLHdFQUNBLHVFQUNBLGdEQUNBOzRCQUNKOzt3QkFFSixXQUFXLFlBQVc7NEJBQ2xCLHFCQUFxQixjQUFjOzRCQUNuQyxtQkFBbUIsY0FBYzs7O3dCQUdyQyxHQUFHLHNFQUFzRSxZQUFXOzRCQUNoRixJQUFJLFlBQVksbUJBQW1CLEtBQUs7Ozs0QkFHeEMsT0FBTyxVQUFVLFFBQVEsUUFBUTs7OzRCQUdqQyxPQUFPLFFBQVEsUUFBUSxXQUFXLEtBQUssc0JBQXNCLFFBQVEsUUFBUTs7O3dCQUdqRixHQUFHLDRFQUE0RSxZQUFXOzRCQUN0RixJQUFJLFlBQVksaUJBQWlCLEtBQUs7Ozs0QkFHdEMsT0FBTyxVQUFVLFFBQVEsUUFBUTs7OztvQkFJekMsR0FBRyx3Q0FBd0MsWUFBVzt3QkFDbEQsSUFBSSxRQUFRLFFBQVEsS0FBSzt3QkFDekIsT0FBTyxNQUFNLFFBQVEsUUFBUTt3QkFDN0IsUUFBUSxRQUFRLEtBQUs7d0JBQ3JCLE9BQU8sTUFBTSxRQUFRLFFBQVE7OztvQkFHakMsR0FBRyxrREFBa0QsWUFBVzt3QkFDNUQsSUFBSTs0QkFDQSxjQUFjLFFBQVEsS0FBSzs7d0JBRS9CLE9BQU8sWUFBWSxRQUFRLFFBQVE7O3dCQUVuQyxPQUFPLGVBQWUsQ0FBRSxDQUFDLFNBQVMsU0FBUyxTQUFTOzt3QkFFcEQsV0FBVyxjQUFjO3dCQUN6QixjQUFjLFNBQVMsS0FBSzt3QkFDNUIsT0FBTyxZQUFZLFFBQVEsUUFBUTs7O29CQUd2QyxTQUFTLHNCQUFzQixZQUFXO3dCQUN0QyxHQUFHLDRDQUE0QyxZQUFXOzRCQUN0RCxJQUFJLFFBQVEsUUFBUSxLQUFLOzRCQUN6QixPQUFPLE1BQU0sT0FBTyxRQUFROzRCQUM1QixRQUFRLFFBQVEsS0FBSzs0QkFDckIsT0FBTyxNQUFNLE9BQU8sUUFBUTs7O3dCQUdoQyxHQUFHLDRDQUE0QyxZQUFXOzRCQUN0RCxJQUFJLFFBQVEsUUFBUSxLQUFLO2dDQUNyQixZQUFZOzRCQUNoQixNQUFNLElBQUk7NEJBQ1YsTUFBTSxRQUFROzRCQUNkLE9BQU8sV0FBVyxhQUFhLEtBQUssT0FBTyxRQUFROzs0QkFFbkQsUUFBUSxRQUFRLEtBQUs7NEJBQ3JCLE1BQU0sSUFBSTs0QkFDVixNQUFNLFFBQVE7NEJBQ2QsT0FBTyxXQUFXLGFBQWEsTUFBTSxPQUFPLFFBQVE7Ozs7b0JBSTVELFNBQVMsT0FBTyxhQUFhO3dCQUN6QixJQUFJLE1BQU0sUUFBUSxLQUFLO3dCQUN2QixPQUFPLElBQUksUUFBUSxRQUFRO3dCQUMzQixPQUFPOzs7b0JBR1gsU0FBUyxTQUFTLGFBQWE7d0JBQzNCLElBQUksTUFBTSxPQUFPO3dCQUNqQixJQUFJO3dCQUNKLElBQUksUUFBUTs7O29CQUdoQixTQUFTLHFCQUFxQixpQkFBaUIsZ0JBQWdCLE9BQU87d0JBQ2xFLElBQUk7d0JBQ0osV0FBVyxrQkFBa0IsUUFBUSxZQUFZLElBQUksWUFBWTt3QkFDakUsT0FBTzt3QkFDUCxNQUFNLE9BQU87d0JBQ2IsT0FBTyxJQUFJLFNBQVMsYUFBYSxRQUFROzs7b0JBRzdDLFNBQVMsb0JBQW9CLE9BQU87d0JBQ2hDLFdBQVcsb0JBQW9CLFFBQVEsWUFBWSxJQUFJLFlBQVk7d0JBQ25FLE9BQU87d0JBQ1AsU0FBUzt3QkFDVCxPQUFPLE9BQU8sUUFBUTs7O29CQUcxQixTQUFTLGdCQUFnQixZQUFXO3dCQUNoQyxHQUFHLHlDQUF5QyxZQUFXOzRCQUNuRCxxQkFBcUIsTUFBTSxPQUFPOzs7d0JBR3RDLEdBQUcscUNBQXFDLFlBQVc7NEJBQy9DLFdBQVcsb0JBQW9CLFFBQVE7NEJBQ3ZDLFNBQVM7NEJBQ1QsT0FBTyxXQUFXLG1CQUFtQjs7O3dCQUd6QyxHQUFHLGdEQUFnRCxZQUFNOzRCQUNyRCxNQUFNLFlBQVk7NEJBQ2xCLFNBQVM7NEJBQ1QsT0FBTyxXQUFXLG1DQUFtQzs7O3dCQUd6RCxHQUFHLGtDQUFrQyxZQUFXOzRCQUM1QyxvQkFBb0I7Ozs7b0JBSTVCLFNBQVMsZ0JBQWdCLFlBQVc7d0JBQ2hDLEdBQUcscUNBQXFDLFlBQVc7NEJBQy9DLG9CQUFvQjs7O3dCQUd4QixHQUFHLDZDQUE2QyxZQUFXOzRCQUN2RCxxQkFBcUIsT0FBTyxNQUFNOzs7d0JBR3RDLEdBQUcsMkNBQTJDLFlBQVc7NEJBQ3JELHFCQUFxQixNQUFNLE9BQU87Ozs7b0JBSTFDLFNBQVMsc0JBQXNCLFlBQU07d0JBQ2pDLFNBQVMsZUFBZSxTQUFTLE9BQU87NEJBQ3BDLElBQUksbUJBQW1CLFFBQVEsS0FBSztnQ0FDaEMsY0FBYyxpQkFBaUI7NEJBQ25DLFFBQVEsUUFBUSxhQUFhOzRCQUM3QixPQUFPOzs7d0JBR1gsU0FBUyxrQkFBa0IsU0FBUyxPQUFPOzRCQUN2QyxJQUFJLG9CQUFvQixRQUFRLEtBQUs7Z0NBQ2pDLGVBQWUsa0JBQWtCOzRCQUNyQyxRQUFRLFFBQVEsY0FBYzs0QkFDOUIsT0FBTzs7O3dCQUdYLElBQUksNEJBQXlCOzRCQUV6QixtQkFBZ0I7NEJBQUUsdUJBQW9COzt3QkFFMUMsV0FBVyxZQUFNOzRCQUNiLG1CQUFtQixJQUFJLE9BQU87Z0NBQzFCLFVBQVU7Z0NBQ1YsWUFBWTtnQ0FDWixZQUFZO29DQUNSLFVBQVU7d0NBQ04sT0FBTzt3Q0FDUCxPQUFPOzs7Ozs0QkFLbkIsdUJBQXVCLElBQUk7NEJBQzNCLE9BQU8sdUJBQXVCOzs7d0JBR2xDLEdBQUcsc0RBQXNELFlBQU07NEJBQzNELHFCQUFxQixrQkFBa0IsQ0FBQyxTQUFTLFNBQVM7NEJBQzFELFVBQVUsY0FBYzs0QkFDeEIsT0FBTyxRQUFRLEtBQUssMEJBQTBCLFFBQVEsUUFBUTs7O3dCQUdsRSxHQUFHLGlFQUFpRSxZQUFNOzRCQUN0RSxxQkFBcUIsa0JBQWtCLENBQUMsU0FBUzs0QkFDakQsVUFBVSxjQUFjOzRCQUN4QixPQUFPLFFBQVEsS0FBSywwQkFBMEIsUUFBUSxRQUFROzs7d0JBR2xFLEdBQUcscUVBQXFFLFlBQU07NEJBQzFFLElBQUksVUFBVSxJQUFJLE9BQU87Z0NBQ3JCLFVBQVU7Z0NBQ1YsWUFBWTs7Z0NBQ1osVUFBVSxJQUFJLE9BQU87Z0NBQ3JCLFVBQVU7Z0NBQ1YsWUFBWTs7Z0NBQ1osVUFBVSxJQUFJLE9BQU87Z0NBQ3JCLFVBQVU7Z0NBQ1YsWUFBWTs7Z0NBQ1osVUFBVSxJQUFJLE9BQU87Z0NBQ3JCLFVBQVU7Z0NBQ1YsWUFBWTs7Z0NBQ1osVUFBVSxJQUFJLE9BQU87Z0NBQ3JCLFVBQVU7Z0NBQ1YsWUFBWTs7OzRCQUdoQixxQkFBcUIsa0JBQWtCLENBQUMsU0FBUyxTQUFTLFNBQVMsU0FBUzs7OzRCQUc1RSxxQkFBcUIsNkJBQTZCOzRCQUNsRCxxQkFBcUIsNkJBQTZCOzRCQUNsRCxxQkFBcUIsNkJBQTZCOzRCQUNsRCxxQkFBcUIsNkJBQTZCOzs0QkFFbEQsVUFBVSxjQUFjOzs7NEJBR3hCLElBQUksa0JBQWtCLFFBQVEsS0FBSztnQ0FDL0IsWUFBWSxnQkFBZ0I7NEJBQ2hDLE9BQU8sVUFBVSxLQUFLLHlCQUF5QixRQUFRLFFBQVE7Ozt3QkFHbkUsR0FBRyxpREFBaUQsWUFBTTs0QkFDdEQsSUFBSSxVQUFVLElBQUksT0FBTztnQ0FDckIsVUFBVTtnQ0FDVixZQUFZOztnQ0FDWixVQUFVLElBQUksT0FBTztnQ0FDckIsVUFBVTtnQ0FDVixZQUFZOztnQ0FDWixVQUFVLElBQUksT0FBTztnQ0FDckIsVUFBVTtnQ0FDVixZQUFZOztnQ0FDWixVQUFVLElBQUksT0FBTztnQ0FDckIsVUFBVTtnQ0FDVixZQUFZOzs7NEJBR2hCLHFCQUFxQixrQkFBa0IsQ0FBQyxTQUFTLFNBQVMsU0FBUzs7NEJBRW5FLHFCQUFxQiw2QkFBNkI7NEJBQ2xELHFCQUFxQiw2QkFBNkI7NEJBQ2xELHFCQUFxQiw2QkFBNkI7NEJBQ2xELFVBQVUsY0FBYzs7OzRCQUd4QixJQUFJLGtCQUFrQixRQUFRLEtBQUs7Z0NBQy9CLFlBQVksZ0JBQWdCOzRCQUNoQyxPQUFPLFVBQVUsS0FBSyx5QkFBeUIsUUFBUSxRQUFROzs7d0JBR25FLEdBQUcsaUZBQWlGLFlBQU07NEJBQ3RGLHFCQUFxQixrQkFBa0IsQ0FBQyxTQUFTLFNBQVM7NEJBQzFELFVBQVUsY0FBYzs0QkFDeEIsT0FBTzs0QkFDUCxNQUFNLHNCQUFzQixnQ0FBZ0MsSUFBSTs0QkFDaEUsZUFBZSxTQUFTOzs0QkFFeEIsT0FBTyxxQkFBcUIsOEJBQThCLHFCQUFxQjs0QkFDL0UsSUFBSSw2QkFBNkIsUUFBUSxLQUFLOzRCQUM5QyxPQUFPLDJCQUEyQixRQUFRLEtBQUs7Ozt3QkFHbkQsR0FBRywrRUFBK0UsWUFBTTs0QkFDcEYsSUFBSSxVQUFVLENBQ1YsU0FDQSxTQUNBLFNBQ0EsU0FDQSxJQUFJLE9BQU87Z0NBQ1AsVUFBVTtnQ0FDVixZQUFZO2dDQUNaLElBQUksT0FBTztnQ0FDWCxVQUFVO2dDQUNWLFlBQVk7Z0NBQ1osSUFBSSxPQUFPO2dDQUNYLFVBQVU7Z0NBQ1YsWUFBWTtnQ0FDWixJQUFJLE9BQU87Z0NBQ1gsVUFBVTtnQ0FDVixZQUFZO2dDQUNaLElBQUksT0FBTztnQ0FDWCxVQUFVO2dDQUNWLFlBQVk7OzRCQUVwQixxQkFBcUIsa0JBQWtCOzRCQUN2QyxNQUFNLHNCQUFzQixpQ0FBaUMsSUFBSTs0QkFDakUsVUFBVSxjQUFjOzRCQUN4QixPQUFPOzs0QkFFUCxJQUFJLDZCQUE2QixRQUFRLEtBQUs7NEJBQzlDLE9BQU8sMkJBQTJCLFFBQVEsS0FBSzs7NEJBRS9DLGVBQWUsU0FBUzs0QkFDeEIsZUFBZSxTQUFTOzRCQUN4QixlQUFlLFNBQVM7NEJBQ3hCLGVBQWUsU0FBUzs0QkFDeEIsZUFBZSxTQUFTOzs7NEJBR3hCLDZCQUE2QixRQUFRLEtBQUs7NEJBQzFDLE9BQU8sMkJBQTJCLFFBQVEsS0FBSzs7OzRCQUcvQyxrQkFBa0IsU0FBUzs7NEJBRTNCLE9BQU8scUJBQXFCLCtCQUErQixxQkFBcUIsUUFBUTs7OzRCQUd4Riw2QkFBNkIsUUFBUSxLQUFLOzRCQUMxQyxPQUFPLDJCQUEyQixRQUFRLEtBQUs7Ozs7Ozs7R0FBNUQiLCJmaWxlIjoiY29tbW9uL3NlYXJjaC9GaWx0ZXJQYW5lbERpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBzZWFyY2hNb2R1bGUgZnJvbSAnY29tbW9uL3NlYXJjaC9TZWFyY2hNb2R1bGUnO1xyXG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xyXG5pbXBvcnQgJ3Rlc3QvanMvY29tbW9uL2kxOG4vTW9ja1RyYW5zbGF0ZUZpbHRlcic7XHJcblxyXG4vKipcclxuICogVGVzdHMgZm9yIHRoZSBmaWx0ZXIgcGFuZWwgZGlyZWN0aXZlcyAtIGluY2x1ZGluZyB0aGUgRmlsdGVyUGFuZWxJdGVtRGlyZWN0aXZlLCBGaWx0ZXJQYW5lbERpcmVjdGl2ZSxcclxuICogYW5kIHNwRmlsdGVyUGFuZWxUaXRsZS5cclxuICovXHJcbmRlc2NyaWJlKCcnLCBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY29tcGlsZSwgJHNjb3BlO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHNlYXJjaE1vZHVsZSwgdGVzdE1vZHVsZSkpO1xyXG5cclxuICAgIC8vQ3JlYXRlIGEgbW9jayBDb2x1bW5TdWdnZXN0U2VydmljZVxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcclxuICAgICAgICAkcHJvdmlkZS5mYWN0b3J5KCdjb2x1bW5TdWdnZXN0U2VydmljZScsIGZ1bmN0aW9uKHRlc3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBnZXRPYmplY3RzOiB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0czoge31cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXR1cCB0aGUgZGVwZW5kZW5jaWVzIGFuZCBkYXRhIG5lZWRzIGJ5IGFsbCB0ZXN0cy5cclxuICAgICAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb21waWxlXywgXyRyb290U2NvcGVfLCBzcFRyYW5zbGF0ZUZpbHRlcikge1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV8uJG5ldygpO1xyXG5cclxuICAgICAgICAvLyBNb2NrIHRoZSB0cmFuc2xhdGUgc2VydmljZSB0byByZXR1cm4gc29tZSBjYW5uZWQgZGF0YS5cclxuICAgICAgICBzcFRyYW5zbGF0ZUZpbHRlci5jb25maWd1cmVDYXRhbG9nKHtcclxuICAgICAgICAgICAgJ3VpX2FjY2Vzc19maWx0ZXJfYnknOiBmdW5jdGlvbihhcmdzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ0ZpbHRlciBCeTogJyArIGFyZ3NbMV07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd1aV9sYWJlbCc6ICdZbyBtb21tYScsXHJcbiAgICAgICAgICAgICd1aV9sYWJlbDInOiAnWW8gZGFkZHknLFxyXG4gICAgICAgICAgICAndWlfYWNjZXNzX2NhbmNlbCc6ICdDYW5jZWwnLFxyXG4gICAgICAgICAgICAndWlfYWNjZXNzX2NsZWFyJzogJ0NsZWFyJyxcclxuICAgICAgICAgICAgJ3VpX2FjY2Vzc19hcHBseSc6ICdBcHBseSdcclxuICAgICAgICB9KTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pO1xyXG4gICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XHJcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2NyaWJlKCdGaWx0ZXJQYW5lbEl0ZW1EaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZWxlbWVudERlZmluaXRpb24gPSAnPHNwLWZpbHRlci1wYW5lbC1pdGVtIHNwLWlkPVwiaWRcIiBzcC1maWx0ZXI9XCJmaWx0ZXJcIiBuZy1tb2RlbD1cInZhbHVlXCIgLz4nLFxyXG4gICAgICAgICAgICBmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGZpbHRlcixcclxuICAgICAgICAgICAgZWxlbWVudDtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX2ZpbHRlclRlbXBsYXRlU2VydmljZV8sIEZpbHRlcikge1xyXG4gICAgICAgICAgICBmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UgPSBfZmlsdGVyVGVtcGxhdGVTZXJ2aWNlXztcclxuXHJcbiAgICAgICAgICAgIC8vIFNldHVwIGEgRmlsdGVyIHRvIGNvbXBpbGUgd2l0aC5cclxuICAgICAgICAgICAgZmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ3Byb3AnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICd1aV9sYWJlbCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogRmlsdGVyLkRBVEFfVFlQRV9TVFJJTkdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXR1cCB0aGUgc2NvcGUgdG8gY29tcGlsZSB3aXRoLlxyXG4gICAgICAgICAgICAkc2NvcGUuZmlsdGVyID0gZmlsdGVyO1xyXG4gICAgICAgICAgICAkc2NvcGUudmFsdWUgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gTW9jayB0aGUgZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLlxyXG4gICAgICAgICAgICBzcHlPbihmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UsICdnZXRGaWx0ZXJUZW1wbGF0ZScpLlxyXG4gICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKCc8aW5wdXQgaWQ9XCJpZEl0ZW0wXCIgdHlwZT1cInRleHRcIiAvPicpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIGVsZW1lbnQgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnZGlzcGxheXMgYW4gaTE4biBsYWJlbCB1c2luZyB0aGUgZmlsdGVyIGxhYmVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IGVsZW1lbnQuZmluZCgnbGFiZWwnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxhYmVsLnRleHQoKSkudG9FcXVhbCgnWW8gbW9tbWEnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2luY2x1ZGVzIHRoZSBmaWx0ZXIgdGVtcGxhdGUgYWZ0ZXIgdGhlIGxhYmVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnI2lkSXRlbTAnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlucHV0Lmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdGaWx0ZXJQYW5lbERpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50RGVmaW5pdGlvbiA9XHJcbiAgICAgICAgICAgICAgICAnPHNwLWZpbHRlci1wYW5lbCBpZD1cImlkXCIgc3AtdGl0bGU9XCJ0aXRsZVwiIHNwLWRpc3BsYXllZD1cImRpc3BsYXllZFwiICcgK1xyXG4gICAgICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgc3AtZmlsdGVyLWdyb3Vwcz1cImZpbHRlckdyb3Vwc1wiIHNwLXNlYXJjaC1kYXRhPVwic2VhcmNoRGF0YVwiICcgK1xyXG4gICAgICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgc3AtYXBwbHktZnVuYz1cInNlYXJjaCgpXCIgLz4nLFxyXG4gICAgICAgICAgICBmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGZpbHRlcjEsXHJcbiAgICAgICAgICAgIGZpbHRlcjIsXHJcbiAgICAgICAgICAgIGZpbHRlcjMsXHJcbiAgICAgICAgICAgIGZpbHRlcjQsXHJcbiAgICAgICAgICAgIHNlYXJjaERhdGEsXHJcbiAgICAgICAgICAgIGVsZW1lbnQsXHJcbiAgICAgICAgICAgICR0aW1lb3V0LFxyXG4gICAgICAgICAgICBGaWx0ZXIsXHJcbiAgICAgICAgICAgIFNlYXJjaERhdGE7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9maWx0ZXJUZW1wbGF0ZVNlcnZpY2VfLCBfRmlsdGVyXywgXyR0aW1lb3V0XywgX1NlYXJjaERhdGFfKSB7XHJcbiAgICAgICAgICAgIGZpbHRlclRlbXBsYXRlU2VydmljZSA9IF9maWx0ZXJUZW1wbGF0ZVNlcnZpY2VfO1xyXG4gICAgICAgICAgICBGaWx0ZXIgPSBfRmlsdGVyXztcclxuICAgICAgICAgICAgU2VhcmNoRGF0YSA9IF9TZWFyY2hEYXRhXztcclxuICAgICAgICAgICAgJHRpbWVvdXQgPSBfJHRpbWVvdXRfO1xyXG4gICAgICAgICAgICAvLyBTZXR1cCBGaWx0ZXJzIHRvIGNvbXBpbGUgd2l0aC5cclxuICAgICAgICAgICAgZmlsdGVyMSA9IG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6ICdwcm9wJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAndWlfbGFiZWwnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfU1RSSU5HXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBmaWx0ZXIyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ3Byb3AyJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAndWlfbGFiZWwyJyxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBGaWx0ZXIuREFUQV9UWVBFX05VTUJFUlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcjMgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5OiAncHJvcDMnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICd1aV9sYWJlbDMnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfU1RSSU5HXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZmlsdGVyNCA9IG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6ICdwcm9wNCcsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ3VpX2xhYmVsNCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogRmlsdGVyLkRBVEFfVFlQRV9OVU1CRVJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXR1cCBmYWtlIHNlYXJjaERhdGEuXHJcbiAgICAgICAgICAgIHNlYXJjaERhdGEgPSBuZXcgU2VhcmNoRGF0YSgpO1xyXG4gICAgICAgICAgICBzZWFyY2hEYXRhLmluaXRpYWxpemVGaWx0ZXJzKFtmaWx0ZXIxLCBmaWx0ZXIyXSk7XHJcbiAgICAgICAgICAgIHNlYXJjaERhdGEuZmlsdGVyVmFsdWVzW2ZpbHRlcjEucHJvcGVydHldLnZhbHVlID0gJ1lvIEFkcmlhbiEnO1xyXG4gICAgICAgICAgICBzZWFyY2hEYXRhLmZpbHRlclZhbHVlc1tmaWx0ZXIyLnByb3BlcnR5XS52YWx1ZSA9IDQzO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0dXAgdGhlIHNjb3BlIHRvIGNvbXBpbGUgd2l0aC5cclxuICAgICAgICAgICAgJHNjb3BlLmlkID0gJ2ZpbHRlclBhbmVsSWQnO1xyXG4gICAgICAgICAgICAkc2NvcGUudGl0bGUgPSAnSGkgbW9tJztcclxuICAgICAgICAgICAgJHNjb3BlLmRpc3BsYXllZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlsdGVyR3JvdXBzID0gWyBbZmlsdGVyMSwgZmlsdGVyMl0gXTtcclxuICAgICAgICAgICAgJHNjb3BlLnNlYXJjaERhdGEgPSBzZWFyY2hEYXRhO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1vY2sgdGhlIGZpbHRlclRlbXBsYXRlU2VydmljZS5cclxuICAgICAgICAgICAgc3B5T24oZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLCAnZ2V0RmlsdGVyVGVtcGxhdGUnKS5cclxuICAgICAgICAgICAgICAgIGFuZC5jYWxsRmFrZShmdW5jdGlvbihmaWx0ZXIsIGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlci5kYXRhVHlwZSA9PT0gRmlsdGVyLkRBVEFfVFlQRV9OVU1CRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8aW5wdXQgaWQ9XCInICsgaWQgKyAnXCIgdHlwZT1cIm51bWJlclwiIG5nLW1vZGVsPVwibmdNb2RlbC52YWx1ZVwiIC8+JztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxpbnB1dCBpZD1cIicgKyBpZCArICdcIiB0eXBlPVwidGV4dFwiIG5nLW1vZGVsPVwibmdNb2RlbC52YWx1ZVwiIC8+JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhbiBlbGVtZW50IHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnY29sbGFwc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3N0YXJ0cyBjb2xsYXBzZWQgaWYgc3BEaXNwbGF5ZWQgaXMgZmFsc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIE5lZWRpbmcgZm9yIGFuaW1hdGlvbiB0byBjb21wbGV0ZSwgd2hpY2ggd2lsbCB1cGRhdGUgY2xhc3Nlc1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChlbGVtZW50Lmhhc0NsYXNzKCdjb2xsYXBzZScpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzdGFydHMgZXhwYW5kZWQgaWYgc3BEaXNwbGF5ZWQgaXMgdHJ1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0VsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGlzcGxheWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgICAgIC8vIE5lZWRpbmcgZm9yIGFuaW1hdGlvbiB0byBjb21wbGV0ZSwgd2hpY2ggd2lsbCB1cGRhdGUgY2xhc3Nlc1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgIC8vIEFmdGVyIGRpc3BsYXllZCwgdGhlIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBjb2xsYXBzZSBjbGFzcyBidXQgZG9lcyBoYXZlIGluIGNsYXNzLlxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KG5ld0VsZW1lbnQuaGFzQ2xhc3MoJ2NvbGxhcHNlJykpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KG5ld0VsZW1lbnQuaGFzQ2xhc3MoJ2luJykpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3RvZ2dsZXMgY29sbGFwc2Ugc3RhdGUgd2hlbiBzcERpc3BsYXllZCBjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGlzcGxheWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudCBoYXMgdGhlIGNvbGxhcHNpbmcgY2xhc3Mgd2hpbGUgdHJhbnNpdGlvbmluZyB0byBleHBhbmRlZC5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChlbGVtZW50Lmhhc0NsYXNzKCdjb2xsYXBzaW5nJykpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgndGl0bGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ2lzIGRpc3BsYXllZCBpZiB0aGVyZSBpcyBvbmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aXRsZUVsID0gZWxlbWVudC5maW5kKCdoNScpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHRpdGxlRWwudGV4dCgpKS50b0VxdWFsKCRzY29wZS50aXRsZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2lzIG5vdCBkaXNwbGF5ZWQgaWYgdGhlcmUgaXMgbm90IG9uZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0VsZW1lbnQsIHRpdGxlRWw7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgJHNjb3BlLnRpdGxlO1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRpdGxlRWwgPSBlbGVtZW50LmZpbmQoJ2g1Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QodGl0bGVFbC5sZW5ndGgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnc3BGaWx0ZXJQYW5lbEhlYWRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRXaXRoSGVhZGluZyxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnREZWZpbml0aW9uV2l0aEhlYWRpbmcgPVxyXG4gICAgICAgICAgICAgICAgICAgICc8c3AtZmlsdGVyLXBhbmVsIGlkPVwiaWRcIiBzcC1kaXNwbGF5ZWQ9XCJkaXNwbGF5ZWRcIiAnICtcclxuICAgICAgICAgICAgICAgICAgICAnICAgICAgICAgICAgICAgICBzcC1maWx0ZXJzPVwiZmlsdGVyc1wiIHNwLXNlYXJjaC1kYXRhPVwic2VhcmNoRGF0YVwiICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgICAgICAgICAgICAgIHNwLWFwcGx5LWZ1bmM9XCJzZWFyY2goKVwiID4nICtcclxuICAgICAgICAgICAgICAgICAgICAnICA8c3AtZmlsdGVyLXBhbmVsLWhlYWRpbmc+PGJ1dHRvbiBjbGFzcz1cInRpdGxlQnV0dG9uXCI+aGVhZDwvYnV0dG9uPjwvc3AtZmlsdGVyLXBhbmVsLWhlYWRpbmc+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvc3AtZmlsdGVyLXBhbmVsPicsXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50RGVmaW5pdGlvbk5vSGVhZGluZyA9XHJcbiAgICAgICAgICAgICAgICAgICAgJzxzcC1maWx0ZXItcGFuZWwgaWQ9XCJpZFwiIHNwLXRpdGxlPVwidGl0bGVcIiBzcC1kaXNwbGF5ZWQ9XCJkaXNwbGF5ZWRcIiAnICtcclxuICAgICAgICAgICAgICAgICAgICAnICAgICAgICAgICAgICAgICBzcC1maWx0ZXJzPVwiZmlsdGVyc1wiIHNwLXNlYXJjaC1kYXRhPVwic2VhcmNoRGF0YVwiICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgICAgICAgICAgICAgIHNwLWFwcGx5LWZ1bmM9XCJzZWFyY2goKVwiID4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9zcC1maWx0ZXItcGFuZWw+JyxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnROb0hlYWRpbmc7XHJcblxyXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudFdpdGhIZWFkaW5nID0gY3JlYXRlRWxlbWVudChlbGVtZW50RGVmaW5pdGlvbldpdGhIZWFkaW5nKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnROb0hlYWRpbmcgPSBjcmVhdGVFbGVtZW50KGVsZW1lbnREZWZpbml0aW9uTm9IZWFkaW5nKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc3AtZmlsdGVyLXBhbmVsLWhlYWRpbmcgZWxlbWVudCBpcyBwbGFjZWQgaW4gcGFuZWwtaGVhZGluZyBlbGVtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGVhZGluZ0VsID0gZWxlbWVudFdpdGhIZWFkaW5nLmZpbmQoJy5wYW5lbC1oZWFkaW5nJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdGhlcmUgc2hvdWxkIGJlIHRoZSBwYW5lbCBoZWFkaW5nIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGV4cGVjdChoZWFkaW5nRWwubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGJ1dHRvbiBkZWZpbmVkIHdpdGhpbiBzcC1maWx0ZXItcGFuZWwtdGl0bGUgZWxlbWVudCBzaG91bGQgZXhpc3RcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoaGVhZGluZ0VsKS5maW5kKCdidXR0b24udGl0bGVCdXR0b24nKS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3BhbmVsLWhlYWRpbmcgZWxlbWVudCBpcyByZW1vdmVkIHdpdGhvdXQgc3AtZmlsdGVyLXBhbmVsLWhlYWRpbmcgZWxlbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlYWRpbmdFbCA9IGVsZW1lbnROb0hlYWRpbmcuZmluZCgnLnBhbmVsLWhlYWRpbmcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGVyZSBzaG91bGQgYmUgbm8gcGFuZWwgaGVhZGluZyBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoaGVhZGluZ0VsLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW5kZXJzIGZpbHRlciBpdGVtIElEcyB3aXRoIGluZGV4ZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCcjaWRJdGVtMCcpO1xyXG4gICAgICAgICAgICBleHBlY3QoaW5wdXQubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICBpbnB1dCA9IGVsZW1lbnQuZmluZCgnI2lkSXRlbTEnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlucHV0Lmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlbmRlcnMgb25lIGNsZWFyZml4IGRpdiBmb3IgZXZlcnkgdHdvIGZpbHRlcnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQyLFxyXG4gICAgICAgICAgICAgICAgY2xlYXJmaXhkaXYgPSBlbGVtZW50LmZpbmQoJ2Rpdi5jbGVhcmZpeCcpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGNsZWFyZml4ZGl2Lmxlbmd0aCkudG9FcXVhbCgxKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5maWx0ZXJHcm91cHMgPSBbIFtmaWx0ZXIxLCBmaWx0ZXIyLCBmaWx0ZXIzLCBmaWx0ZXI0XSBdO1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudDIgPSBjcmVhdGVFbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgY2xlYXJmaXhkaXYgPSBlbGVtZW50Mi5maW5kKCdkaXYuY2xlYXJmaXgnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNsZWFyZml4ZGl2Lmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ2ZpbHRlciBpbnB1dCBmaWVsZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnaXMgaW5pdGlhbGl6ZWQgd2l0aCBkYXRhIGZyb20gc2VhcmNoRGF0YScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCcjaWRJdGVtMCcpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGlucHV0LnZhbCgpKS50b0VxdWFsKCdZbyBBZHJpYW4hJyk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGVsZW1lbnQuZmluZCgnI2lkSXRlbTEnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChpbnB1dC52YWwoKSkudG9FcXVhbCgnNDMnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgndXBkYXRlcyBzZWFyY2hEYXRhIHdoZW4gdmFsdWUgaXMgY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCcjaWRJdGVtMCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyA9ICdJIHdpbGwgYnJlYWsgeW91JztcclxuICAgICAgICAgICAgICAgIGlucHV0LnZhbChuZXdTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQudHJpZ2dlcignaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzZWFyY2hEYXRhLmZpbHRlclZhbHVlcy5wcm9wLnZhbHVlKS50b0VxdWFsKG5ld1N0cmluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSBlbGVtZW50LmZpbmQoJyNpZEl0ZW0xJyk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC52YWwoJzcnKTtcclxuICAgICAgICAgICAgICAgIGlucHV0LnRyaWdnZXIoJ2lucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2VhcmNoRGF0YS5maWx0ZXJWYWx1ZXMucHJvcDIudmFsdWUpLnRvRXF1YWwoNyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRCdG4oYnRuU2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGJ0biA9IGVsZW1lbnQuZmluZChidG5TZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGV4cGVjdChidG4ubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gYnRuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xpY2tCdG4oYnRuU2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGJ0biA9IGdldEJ0bihidG5TZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGJ0bi5jbGljaygpO1xyXG4gICAgICAgICAgICBidG4udHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RGaWx0ZXJCdG5FbmFibGVkKGhhc0ZpbHRlclZhbHVlcywgZXhwZWN0RGlzYWJsZWQsIGJ0bklkKSB7XHJcbiAgICAgICAgICAgIHZhciBidG47XHJcbiAgICAgICAgICAgIHNlYXJjaERhdGEuaGFzRmlsdGVyVmFsdWVzID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoaGFzRmlsdGVyVmFsdWVzKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBidG4gPSBnZXRCdG4oYnRuSWQpO1xyXG4gICAgICAgICAgICBleHBlY3QoYnRuLmhhc0NsYXNzKCdkaXNhYmxlZCcpKS50b0VxdWFsKGV4cGVjdERpc2FibGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RBcHBseUZ1bmNDYWxsZWQoYnRuSWQpIHtcclxuICAgICAgICAgICAgc2VhcmNoRGF0YS5jbGVhckZpbHRlclZhbHVlcyA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGNsaWNrQnRuKGJ0bklkKTtcclxuICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5zZWFyY2gpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdjbGVhciBidXR0b24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ2lzIGVuYWJsZWQgaWYgdGhlcmUgYXJlIGZpbHRlciB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRlc3RGaWx0ZXJCdG5FbmFibGVkKHRydWUsIGZhbHNlLCAnI2lkQ2xlYXJCdG4nKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnY2xlYXJzIGZpbHRlciB2YWx1ZXMgd2hlbiBjbGlja2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hEYXRhLmNsZWFyRmlsdGVyVmFsdWVzID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgICAgIGNsaWNrQnRuKCcjaWRDbGVhckJ0bicpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHNlYXJjaERhdGEuY2xlYXJGaWx0ZXJWYWx1ZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnY2xlYXJzIGFkZGVkIGFkZGl0aW9uYWwgZmlsdGVycyB3aGVuIGNsaWNrZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihzZWFyY2hEYXRhLCAncG9wQWxsQWRkaXRpb25hbEZpbHRlcnNGcm9tR3JvdXBzJyk7XHJcbiAgICAgICAgICAgICAgICBjbGlja0J0bignI2lkQ2xlYXJCdG4nKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzZWFyY2hEYXRhLnBvcEFsbEFkZGl0aW9uYWxGaWx0ZXJzRnJvbUdyb3VwcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdjYWxscyBzcEFwcGx5RnVuYyB3aGVuIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRlc3RBcHBseUZ1bmNDYWxsZWQoJyNpZENsZWFyQnRuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnYXBwbHkgYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdjYWxscyBhcHBseSBmdW5jdGlvbiB3aGVuIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRlc3RBcHBseUZ1bmNDYWxsZWQoJyNpZEFwcGx5QnRuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2lzIGRpc2FibGVkIGlmIHRoZXJlIGFyZSBubyBmaWx0ZXIgdmFsdWVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0RmlsdGVyQnRuRW5hYmxlZChmYWxzZSwgdHJ1ZSwgJyNpZEFwcGx5QnRuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2lzIGVuYWJsZWQgd2hlbiB0aGVyZSBhcmUgZmlsdGVyIHZhbHVlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGVzdEZpbHRlckJ0bkVuYWJsZWQodHJ1ZSwgZmFsc2UsICcjaWRBcHBseUJ0bicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ2FkZGl0aW9uYWwgZmlsdGVycycsICgpID0+IHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gY2xpY2tBZGRGaWx0ZXIoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb3VuZExpbmtFbGVtZW50ID0gZWxlbWVudC5maW5kKCcuc3AtYWRkaXRpb25hbC1maWx0ZXJzIC5zcC1kcm9wZG93bi1ncm91cCBhJyksXHJcbiAgICAgICAgICAgICAgICAgICAgbGlua0VsZW1lbnQgPSBmb3VuZExpbmtFbGVtZW50W2luZGV4XTtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChsaW5rRWxlbWVudCkuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2xpY2tSZW1vdmVGaWx0ZXIoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb3VuZFJlbW92ZUJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnLnNwLWFkZGl0aW9uYWwtZmlsdGVyLXJlbW92ZS1idG4nKSxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVCdXR0b24gPSBmb3VuZFJlbW92ZUJ1dHRvbltpbmRleF07XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQocmVtb3ZlQnV0dG9uKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYWRkaXRpb25hbEZpbHRlcnNUZW1wbGF0ZSA9IGA8c3AtZmlsdGVyLXBhbmVsIGlkPVwiaWRcIiBzcC10aXRsZT1cInRpdGxlXCIgc3AtZGlzcGxheWVkPVwiZGlzcGxheWVkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Atc2VhcmNoLWRhdGE9XCJhZGRpdGlvbmFsU2VhcmNoRGF0YVwiIHNwLWFwcGx5LWZ1bmM9XCJzZWFyY2goKVwiIC8+YCxcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxGaWx0ZXIsIGFkZGl0aW9uYWxTZWFyY2hEYXRhO1xyXG5cclxuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsRmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6ICdhZGRpdGlvbmFsRmlsdGVyUHJvcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ2NhdGVnb3J5IDEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTZWFyY2hEYXRhID0gbmV3IFNlYXJjaERhdGEoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hZGRpdGlvbmFsU2VhcmNoRGF0YSA9IGFkZGl0aW9uYWxTZWFyY2hEYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZW5kZXJzIGRyb3Bkb3duIGlmIGFkZGl0aW9uYWwgZmlsdGVycyBhcmUgZGVmaW5lZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTZWFyY2hEYXRhLmluaXRpYWxpemVGaWx0ZXJzKFtmaWx0ZXIxLCBmaWx0ZXIyLCBhZGRpdGlvbmFsRmlsdGVyXSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChhZGRpdGlvbmFsRmlsdGVyc1RlbXBsYXRlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5zcC1hZGRpdGlvbmFsLWZpbHRlcnMnKS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IHJlbmRlciBkcm9wZG93biBpZiBubyBhZGRpdGlvbmFsIGZpbHRlcnMgYXJlIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU2VhcmNoRGF0YS5pbml0aWFsaXplRmlsdGVycyhbZmlsdGVyMSwgZmlsdGVyMl0pO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoYWRkaXRpb25hbEZpbHRlcnNUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuc3AtYWRkaXRpb25hbC1maWx0ZXJzJykubGVuZ3RoKS50b0VxdWFsKDApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZW5kZXJzIGRyb3Bkb3duIGluIG93biByb3cgaWYgaXQgZG9lcyBub3QgZml0IHdpdGggb3RoZXIgZmlsdGVycycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXIxID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6ICdhZGRQcm9wMScsXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSksIGZpbHRlcjIgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2FkZFByb3AyJyxcclxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KSwgZmlsdGVyMyA9IG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiAnYWRkUHJvcDMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWw6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pLCBmaWx0ZXI0ID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6ICdhZGRQcm9wNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSksIGZpbHRlcjUgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2FkZFByb3A1JyxcclxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU2VhcmNoRGF0YS5pbml0aWFsaXplRmlsdGVycyhbZmlsdGVyMSwgZmlsdGVyMiwgZmlsdGVyMywgZmlsdGVyNCwgZmlsdGVyNV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCA0IGZpbHRlcnMgdG8gZmlsbCBhIGdyb3VwXHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU2VhcmNoRGF0YS5wdXNoQWRkaXRpb25hbEZpbHRlclRvR3JvdXBzKGZpbHRlcjEpO1xyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFNlYXJjaERhdGEucHVzaEFkZGl0aW9uYWxGaWx0ZXJUb0dyb3VwcyhmaWx0ZXIyKTtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTZWFyY2hEYXRhLnB1c2hBZGRpdGlvbmFsRmlsdGVyVG9Hcm91cHMoZmlsdGVyMyk7XHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU2VhcmNoRGF0YS5wdXNoQWRkaXRpb25hbEZpbHRlclRvR3JvdXBzKGZpbHRlcjQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGFkZGl0aW9uYWxGaWx0ZXJzVGVtcGxhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIGRyb3Bkb3duIGFuZCBpdHMgcGFyZW50LCB0aGVuIHZlcmlmeSB0aGUgcGFyZW50IGlzIG5vdCBob2xkaW5nIGFueSBmaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICBsZXQgZHJvcGRvd25FbGVtZW50ID0gZWxlbWVudC5maW5kKCcuc3AtYWRkaXRpb25hbC1maWx0ZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Um93ID0gZHJvcGRvd25FbGVtZW50LnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHBhcmVudFJvdy5maW5kKCcuc3AtYWRkaXRpb25hbC1maWx0ZXInKS5sZW5ndGgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JlbmRlcnMgZHJvcG93biB3aXRoIG90aGVyIGZpbHRlcnMgaWYgaXQgZml0cycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXIxID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6ICdhZGRQcm9wMScsXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSksIGZpbHRlcjIgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2FkZFByb3AyJyxcclxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KSwgZmlsdGVyMyA9IG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiAnYWRkUHJvcDMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWw6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pLCBmaWx0ZXI0ID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6ICdhZGRQcm9wNCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFNlYXJjaERhdGEuaW5pdGlhbGl6ZUZpbHRlcnMoW2ZpbHRlcjEsIGZpbHRlcjIsIGZpbHRlcjMsIGZpbHRlcjRdKTtcclxuICAgICAgICAgICAgICAgIC8vIEFkZCAzIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTZWFyY2hEYXRhLnB1c2hBZGRpdGlvbmFsRmlsdGVyVG9Hcm91cHMoZmlsdGVyMSk7XHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU2VhcmNoRGF0YS5wdXNoQWRkaXRpb25hbEZpbHRlclRvR3JvdXBzKGZpbHRlcjIpO1xyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFNlYXJjaERhdGEucHVzaEFkZGl0aW9uYWxGaWx0ZXJUb0dyb3VwcyhmaWx0ZXIzKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGFkZGl0aW9uYWxGaWx0ZXJzVGVtcGxhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIGRyb3Bkb3duIGFuZCBpdHMgcGFyZW50LCB0aGVuIHZlcmlmeSB0aGUgcGFyZW50IGFsc28gaXMgaG9sZGluZyB0aGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgbGV0IGRyb3Bkb3duRWxlbWVudCA9IGVsZW1lbnQuZmluZCgnLnNwLWFkZGl0aW9uYWwtZmlsdGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFJvdyA9IGRyb3Bkb3duRWxlbWVudC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwYXJlbnRSb3cuZmluZCgnLnNwLWFkZGl0aW9uYWwtZmlsdGVyJykubGVuZ3RoKS50b0VxdWFsKDMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIHNlYXJjaCBkYXRhIHRvIHB1c2ggYWRkaXRpb25hbCBmaWx0ZXIgdG8gZ3JvdXBzIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTZWFyY2hEYXRhLmluaXRpYWxpemVGaWx0ZXJzKFtmaWx0ZXIxLCBmaWx0ZXIyLCBhZGRpdGlvbmFsRmlsdGVyXSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChhZGRpdGlvbmFsRmlsdGVyc1RlbXBsYXRlKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIHNweU9uKGFkZGl0aW9uYWxTZWFyY2hEYXRhLCAncHVzaEFkZGl0aW9uYWxGaWx0ZXJUb0dyb3VwcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgY2xpY2tBZGRGaWx0ZXIoZWxlbWVudCwgMCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgYWRkaXRpb25hbCBmaWx0ZXIgd2FzIGFkZGVkIHdpdGggdGhlIHJlbW92ZSBidXR0b25cclxuICAgICAgICAgICAgICAgIGV4cGVjdChhZGRpdGlvbmFsU2VhcmNoRGF0YS5wdXNoQWRkaXRpb25hbEZpbHRlclRvR3JvdXBzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChhZGRpdGlvbmFsRmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIGxldCBhZGRpdGlvbmFsRmlsdGVyc1JlbW92ZUJ0biA9IGVsZW1lbnQuZmluZCgnLnNwLWFkZGl0aW9uYWwtZmlsdGVyLXJlbW92ZS1idG4nKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhZGRpdGlvbmFsRmlsdGVyc1JlbW92ZUJ0bi5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2NhbGxzIHRocm91Z2ggdG8gc2VhcmNoIGRhdGEgdG8gcmVtb3ZlIGZpbHRlciB3aGVuIHJlbW92ZSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjEsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyMixcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiAnYWRkUHJvcDEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSksIG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2FkZFByb3AyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLCBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6ICdhZGRQcm9wMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KSwgbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiAnYWRkUHJvcDQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSksIG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2FkZFByb3A1JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTZWFyY2hEYXRhLmluaXRpYWxpemVGaWx0ZXJzKGZpbHRlcnMpO1xyXG4gICAgICAgICAgICAgICAgc3B5T24oYWRkaXRpb25hbFNlYXJjaERhdGEsICdwb3BBZGRpdGlvbmFsRmlsdGVyRnJvbUdyb3VwcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoYWRkaXRpb25hbEZpbHRlcnNUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBubyBhZGRpdGlvbmFsIGZpbHRlcnMgYWRkZWQgeWV0XHJcbiAgICAgICAgICAgICAgICBsZXQgYWRkaXRpb25hbEZpbHRlcnNSZW1vdmVCdG4gPSBlbGVtZW50LmZpbmQoJy5zcC1hZGRpdGlvbmFsLWZpbHRlci1yZW1vdmUtYnRuJyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWRkaXRpb25hbEZpbHRlcnNSZW1vdmVCdG4ubGVuZ3RoKS50b0JlKDApO1xyXG4gICAgICAgICAgICAgICAgLy8gQWRkIDUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgY2xpY2tBZGRGaWx0ZXIoZWxlbWVudCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjbGlja0FkZEZpbHRlcihlbGVtZW50LCAwKTtcclxuICAgICAgICAgICAgICAgIGNsaWNrQWRkRmlsdGVyKGVsZW1lbnQsIDApO1xyXG4gICAgICAgICAgICAgICAgY2xpY2tBZGRGaWx0ZXIoZWxlbWVudCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjbGlja0FkZEZpbHRlcihlbGVtZW50LCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiA1IGFkZGl0aW9uYWwgZmlsdGVycyBhZGRlZCB3aXRoIHRoZSByZW1vdmUgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsRmlsdGVyc1JlbW92ZUJ0biA9IGVsZW1lbnQuZmluZCgnLnNwLWFkZGl0aW9uYWwtZmlsdGVyLXJlbW92ZS1idG4nKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhZGRpdGlvbmFsRmlsdGVyc1JlbW92ZUJ0bi5sZW5ndGgpLnRvQmUoNSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvbmVcclxuICAgICAgICAgICAgICAgIGNsaWNrUmVtb3ZlRmlsdGVyKGVsZW1lbnQsIDApO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChhZGRpdGlvbmFsU2VhcmNoRGF0YS5wb3BBZGRpdGlvbmFsRmlsdGVyRnJvbUdyb3VwcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmlsdGVyc1s0XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIHNob3VsZCBoYXZlIG1vdmVkIGJhY2sgdG8gYWRkaXRpb25hbCBmaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsRmlsdGVyc1JlbW92ZUJ0biA9IGVsZW1lbnQuZmluZCgnLnNwLWFkZGl0aW9uYWwtZmlsdGVyLXJlbW92ZS1idG4nKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhZGRpdGlvbmFsRmlsdGVyc1JlbW92ZUJ0bi5sZW5ndGgpLnRvQmUoNCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
