System.register(['test/js/TestInitializer', 'common/dataview/table/TableModule', 'test/js/TestModule'], function (_export) {
    'use strict';

    var tableModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewTableTableModule) {
            tableModule = _commonDataviewTableTableModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('spDataTable', function () {

                var elementDefinition = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-column-config-key="someColumns" ' + 'sp-search-data="searchData" ' + 'sp-paging-data="pagingData" ' + 'sp-refresh-trigger="refreshTrigger" ' + 'sp-checkbox-multiselect="checkbox" />',
                    someColumnConfigKey = 'someColumns',
                    $scope,
                    $q,
                    $compile,
                    $timeout,
                    testService,
                    columnConfigs,
                    items,
                    SortOrder,
                    SearchData,
                    DataRefreshTrigger,
                    DataTableDirectiveConfig,
                    configService,
                    CheckboxMultiSelect,
                    filter1,
                    filter2,
                    filter3,
                    element,
                    groups;

                function createElement() {
                    var defintion = arguments.length <= 0 || arguments[0] === undefined ? elementDefinition : arguments[0];

                    element = angular.element(defintion);
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                beforeEach(module(testModule, tableModule));

                /* jshint maxparams: 13 */
                beforeEach(inject(function (_$rootScope_, _$compile_, _$q_, _$timeout_, _testService_, _SortOrder_, ColumnConfig, _configService_, _SearchData_, _DataRefreshTrigger_, _DataTableDirectiveConfig_, _CheckboxMultiSelect_, Filter) {
                    $scope = _$rootScope_;
                    $q = _$q_;
                    $compile = _$compile_;
                    $timeout = _$timeout_;
                    testService = _testService_;
                    SortOrder = _SortOrder_;
                    SearchData = _SearchData_;
                    DataRefreshTrigger = _DataRefreshTrigger_;
                    DataTableDirectiveConfig = _DataTableDirectiveConfig_;
                    configService = _configService_;
                    CheckboxMultiSelect = _CheckboxMultiSelect_;

                    columnConfigs = [new ColumnConfig({
                        dataIndex: 'name',
                        sortable: true,
                        width: 250
                    }), new ColumnConfig({
                        dataIndex: 'someValue',
                        sortable: false,
                        percentWidth: 25
                    }), new ColumnConfig({
                        dataIndex: 'extra',
                        fieldOnly: true
                    }), new ColumnConfig({
                        dataIndex: 'status',
                        fieldOnly: true
                    }), new ColumnConfig({
                        dataIndex: 'risk',
                        renderer: 'risk',
                        sortable: true,
                        hideable: true
                    })];

                    configService.getColumnConfigEntries = testService.createPromiseSpy(false, {
                        status: 200,
                        data: {
                            someColumns: columnConfigs
                        }
                    }, {});

                    items = [{
                        name: 'itemOne',
                        someValue: 7,
                        extra: false,
                        status: 'Open',
                        risk: 100
                    }, {
                        name: 'itemTwo',
                        someValue: 22,
                        extra: true,
                        status: 'Closed',
                        risk: 200
                    }, {
                        name: 'itemThree',
                        someValue: 23,
                        extra: true,
                        status: 'Closed',
                        risk: 200
                    }];

                    groups = [{
                        properties: {
                            status: 'Open'
                        },
                        count: 1
                    }, {
                        properties: {
                            status: 'Closed'
                        },
                        count: 2
                    }];

                    $scope.itemsFunc = testService.createPromiseSpy(false, {
                        data: {
                            objects: items,
                            count: 3,
                            metaData: {
                                groups: groups
                            }
                        }
                    });

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

                    $scope.filters = [filter1, filter2, filter3];

                    $scope.searchData = new SearchData();
                    $scope.searchData.filterValues = {
                        something: 'filtered'
                    };
                }));

                afterEach(function () {
                    if (element) {
                        angular.element(element).remove();
                    }
                });

                it('calls spItemFunc to get items', function () {
                    createElement();
                    expect($scope.itemsFunc).toHaveBeenCalledWith(0, 10, $scope.searchData.filterValues, undefined);
                });

                it('uses the passed in PagingData if supplied', inject(function (PagingData) {
                    $scope.pagingData = new PagingData(25);
                    createElement();
                    expect(element.find('#page-size-dropdown-toggle').text().trim()).toContain('25');
                }));

                it('shows no results message when there are no items', function () {
                    var msg, table;

                    $scope.itemsFunc = testService.createPromiseSpy(false, {
                        data: {
                            objects: [],
                            count: 0
                        }
                    });

                    createElement();
                    $timeout.flush();

                    msg = angular.element(element).find('div.no-results-panel h3');
                    expect(msg.length).toBe(1);

                    table = angular.element(element).find('table');
                    expect(table.length).toBe(0);

                    // reset scope.itemsFunc
                    $scope.itemsFunc = testService.createPromiseSpy(false, {
                        data: {
                            objects: items,
                            count: 3
                        }
                    });
                });

                it('shows displayable columns', function () {
                    var columns = undefined;
                    createElement();
                    columns = angular.element(element).find('thead th');
                    expect(columns.length).toBe(3);
                    expect(columns[0].innerText.trim()).toContain('name');
                    expect(columns[1].innerText.trim()).toContain('someValue');
                    expect(columns[2].innerText.trim()).toContain('risk');
                });

                describe('column width', function () {
                    function getHeaderWidthStyle(colIdx) {
                        createElement();
                        var columns = angular.element(element).find('thead th'),
                            col = columns[colIdx];
                        return col.style.width;
                    }

                    it('is in pixels when the column config uses width', function () {
                        expect(getHeaderWidthStyle(0)).toEqual('250px');
                    });

                    it('is in percentage when the column config uses percent width', function () {
                        expect(getHeaderWidthStyle(1)).toEqual('25%');
                    });

                    it('is not specified when the column config does not have a width', function () {
                        expect(getHeaderWidthStyle(2)).toEqual('');
                    });

                    it('is not specified when last displayed column', function () {
                        columnConfigs[4].percentWidth = 10;
                        expect(getHeaderWidthStyle(2)).toEqual('');
                    });
                });

                describe('sorting', function () {
                    var columns, srOnlyDiv;

                    beforeEach(function () {
                        createElement();
                        columns = angular.element(element).find('thead th');
                        srOnlyDiv = angular.element(element).find('div[role=alert]');
                    });

                    it('sorts when clicking sortable headers', function () {
                        $scope.itemsFunc.calls.reset();
                        angular.element(columns[2]).click();
                        expect($scope.itemsFunc).toHaveBeenCalledWith(0, 10, $scope.searchData.filterValues, new SortOrder('risk', true));

                        $scope.itemsFunc.calls.reset();
                        angular.element(columns[2]).click();
                        expect($scope.itemsFunc).toHaveBeenCalledWith(0, 10, $scope.searchData.filterValues, new SortOrder('risk', false));
                    });

                    it('does not sort when click unsortable header', function () {
                        $scope.itemsFunc.calls.reset();
                        angular.element(columns[1]).click();
                        expect($scope.itemsFunc).not.toHaveBeenCalled();
                    });

                    it('updates the 508 text appropriately', function () {
                        $scope.itemsFunc.calls.reset();
                        angular.element(columns[2]).click();
                        expect(srOnlyDiv.text()).toBe('ui_data_table_sorted_ascending_sr');

                        angular.element(columns[2]).click();
                        expect(srOnlyDiv.text()).toBe('ui_data_table_sorted_descending_sr');
                    });
                });

                describe('paging', function () {
                    describe('page size', function () {
                        it('calls spItemsFunc when changing page size', function () {
                            createElement();
                            var dropToggle = element.find('#page-size-dropdown-toggle'),
                                menuItems = undefined;

                            // Pop the menu up.
                            dropToggle.click();
                            menuItems = dropToggle.next().find('li a');

                            // Expect 3 sizes - 10, 25, 50.
                            expect(menuItems.length).toEqual(3);

                            // Click the '25' item.
                            $scope.itemsFunc.calls.reset();
                            angular.element(menuItems[1]).click();
                            expect($scope.itemsFunc).toHaveBeenCalledWith(0, 25, $scope.searchData.filterValues, undefined);
                        });
                    });

                    describe('pagination', function () {
                        it('is not displayed if there is one page', function () {
                            createElement();
                            var pagination = element.find('.pagination');
                            expect(pagination.length).toEqual(0);
                        });
                    });
                });

                describe('checkbox', function () {
                    var checkbox = undefined;

                    beforeEach(function () {
                        checkbox = {
                            attach: jasmine.createSpy('attach')
                        };
                    });

                    function hasCheckbox(element) {
                        var checks = element.find('.checkbox-col');
                        return checks.length > 0;
                    }

                    function getCheckboxHeader(element) {
                        var header = element.find('thead .checkbox-col button.fa-square-o');
                        expect(header.length).toEqual(1);
                        return angular.element(header[0]);
                    }

                    function isCheckboxMenuDisplayed(element) {
                        var menu = element.find('thead th.checkbox-col span');
                        expect(menu.length).toEqual(2);
                        return angular.element(menu[0]).hasClass('open');
                    }

                    it('is attached to controller', function () {
                        $scope.checkbox = checkbox;
                        createElement();
                        expect(checkbox.attach).toHaveBeenCalled();
                    });

                    it('is attached to controller when set after construction', function () {
                        createElement();
                        expect(checkbox.attach).not.toHaveBeenCalled();
                        $scope.checkbox = checkbox;
                        $scope.$digest();
                        expect(checkbox.attach).toHaveBeenCalled();
                    });

                    it('is displayed when provided', function () {
                        $scope.checkbox = checkbox;
                        createElement();
                        expect(hasCheckbox(element)).toEqual(true);
                    });

                    it('is hidden when not provided', function () {
                        createElement();
                        expect(hasCheckbox(element)).toEqual(false);
                    });

                    it('allows toggling the menu', function () {
                        $scope.checkbox = checkbox;
                        createElement();
                        var checkboxHeader = getCheckboxHeader(element);
                        expect(isCheckboxMenuDisplayed(element)).toEqual(false);
                        checkboxHeader.click();
                        expect(isCheckboxMenuDisplayed(element)).toEqual(true);
                    });
                });

                it('refresh trigger calls itemsFunc when refreshing', function () {
                    var trigger = new DataRefreshTrigger();
                    $scope.refreshTrigger = trigger;
                    createElement();

                    $scope.itemsFunc.calls.reset();
                    trigger.refresh();
                    expect($scope.itemsFunc).toHaveBeenCalled();
                });

                describe('sectionHeader', function () {
                    var checkbox = {
                        attach: jasmine.createSpy('attach'),
                        toggleGroup: jasmine.createSpy('toggleGroup')
                    },
                        ResultGroup = undefined;

                    beforeEach(inject(function (_ResultGroup_) {
                        $scope.checkbox = undefined;
                        ResultGroup = _ResultGroup_;
                    }));

                    function buildElementWithSectionHeader() {
                        return '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-column-config-key="someColumns" ' + 'sp-section-header="status" ' + 'sp-checkbox-multiselect="checkbox"' + '/>';
                    }

                    it('should create section headers with correct text', function () {
                        createElement(buildElementWithSectionHeader());
                        var sectionHeaders = element.find('tr.section-header-row');
                        expect(sectionHeaders.length).toEqual(2);

                        expect(angular.element(sectionHeaders[0]).text().trim()).toEqual(items[0].status);
                        expect(angular.element(sectionHeaders[1]).text().trim()).toEqual(items[1].status);
                    });

                    it('should not show section header if spSectionHeader is undefined', function () {
                        createElement();
                        var sectionHeaders = element.find('tr.section-header-row');
                        expect(sectionHeaders.length).toEqual(0);
                    });

                    it('should show section header in correct rows', function () {
                        createElement(buildElementWithSectionHeader());
                        var rows = element.find('tr');
                        var sectionHeader = angular.element(rows[1]);
                        expect(sectionHeader.hasClass('section-header-row')).toEqual(true);

                        var sectionHeader2 = angular.element(rows[3]);
                        expect(sectionHeader2.hasClass('section-header-row')).toEqual(true);
                    });

                    it('should show checkbox', function () {
                        $scope.checkbox = checkbox;
                        createElement(buildElementWithSectionHeader());
                        var rows = element.find('tr.section-header-row'),
                            sectionHeaderCheckbox = angular.element(rows[0]).find('.checkbox-col.bg-section-header');
                        expect(sectionHeaderCheckbox.length).toEqual(1);
                    });

                    it('should toggle group selection when clicked', function () {
                        $scope.checkbox = checkbox;
                        createElement(buildElementWithSectionHeader());
                        var rows = element.find('tr.section-header-row'),
                            sectionHeaderCheckbox = angular.element(rows[0]).find('.checkbox-col.bg-section-header'),
                            button = angular.element(sectionHeaderCheckbox[0]).find('button.checkbox-btn');
                        angular.element(button).click();
                        expect(checkbox.toggleGroup).toHaveBeenCalled();
                        var args = checkbox.toggleGroup.calls.mostRecent().args;
                        expect(args[0]).toEqual(new ResultGroup(groups[0]));
                    });
                });

                describe('row selection', function () {
                    var rowSelectionFuncName = 'rowSelectionFunc';

                    function buildElementString(rowSelectionFunc) {
                        return '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-column-config-key="someColumns" ' + 'sp-checkbox-multiselect="multiSelect" ' + (rowSelectionFunc ? 'sp-on-row-selection-func="' + rowSelectionFunc + '(item)" ' : '') + '/>';
                    }

                    beforeEach(function () {
                        $scope.multiselect = {};
                        spyOn(columnConfigs[4], 'isFixedRight').and.returnValue(true);
                    });

                    it('should call row selection func when normal cell is selected', function () {
                        $scope[rowSelectionFuncName] = jasmine.createSpy();
                        createElement(buildElementString(rowSelectionFuncName));
                        element.find('tr.normal-row > td').click();
                        expect($scope[rowSelectionFuncName]).toHaveBeenCalledWith(items[0]);
                    });

                    it('should call row selection func when normal cell is selected', function () {
                        $scope[rowSelectionFuncName] = jasmine.createSpy();
                        createElement(buildElementString(rowSelectionFuncName));
                        element.find('tr.normal-row > td.normal-col').click();
                        expect($scope[rowSelectionFuncName]).toHaveBeenCalled();
                    });

                    it('should not call row selection func when checkbox cell is selected', function () {
                        $scope[rowSelectionFuncName] = jasmine.createSpy();
                        createElement(buildElementString(rowSelectionFuncName));
                        element.find('tr.normal-row > td.checkbox-col').click();
                        expect($scope[rowSelectionFuncName]).not.toHaveBeenCalled();
                    });

                    it('should not call row selection func when floating cell is selected', function () {
                        $scope[rowSelectionFuncName] = jasmine.createSpy();
                        createElement(buildElementString(rowSelectionFuncName));
                        element.find('tr.normal-row > td.col-fixed-right').click();
                        expect($scope[rowSelectionFuncName]).not.toHaveBeenCalled();
                    });
                });

                describe('expander', function () {
                    function buildElementString(templateUrl, expanderFuncName) {
                        return '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-column-config-key="someColumns" ' + (expanderFuncName ? 'sp-is-expanded-func="' + expanderFuncName + '(item)" ' : '') + (templateUrl ? 'sp-expander-template-url="' + templateUrl + '" ' : '') + '/>';
                    }

                    describe('configuration', function () {
                        var expanderFuncName = 'doesNotActuallyHaveToExist',
                            templateUrl = 'some/path/toSomething.html';

                        it('should throw if spIsExpandedFunc is defined and spExpanderTemplateUrl is not', function () {
                            var elementString = buildElementString(expanderFuncName);
                            expect(function () {
                                createElement(elementString);
                            }).toThrow();
                        });

                        it('should throw if spExpanderTemplateUrl is defined and spIsExpandedFunc is not', function () {
                            var elementString = buildElementString(templateUrl);
                            expect(function () {
                                createElement(elementString);
                            }).toThrow();
                        });

                        it('should not throw if both spExpanderTemplateUrl and spIsExpandedFunc are defined', function () {
                            var elementString = buildElementString(templateUrl, expanderFuncName);
                            expect(function () {
                                createElement(elementString);
                            }).not.toThrow();
                        });

                        it('should not throw if neither spExpanderTemplateUrl nor spIsExpandedFunc are defined', function () {
                            var elementString = buildElementString();
                            expect(function () {
                                createElement(elementString);
                            }).not.toThrow();
                        });
                    });

                    describe('toggling', function () {
                        var templateUrl = 'path/to/template.html',
                            isExpandedFuncName = 'isExpandedFunction';
                        beforeEach(inject(function ($templateCache) {
                            $templateCache.put(templateUrl, '<div class="expandedRowClass">{{item.name}}</div>');
                        }));

                        it('should not render expander template when not expanded', function () {
                            $scope[isExpandedFuncName] = jasmine.createSpy().and.returnValue(false);
                            createElement(buildElementString(templateUrl, isExpandedFuncName));
                            expect($scope[isExpandedFuncName]).toHaveBeenCalled();
                            expect(element.find('.expandedRowClass').length).toEqual(0);
                        });

                        describe('expanded', function () {
                            var $window = undefined;
                            var name = 'itemTwo';

                            beforeEach(inject(function (_$window_) {
                                $window = _$window_;
                                $scope[isExpandedFuncName] = jasmine.createSpy().and.callFake(function (item) {
                                    return item.name === name;
                                });
                                createElement(buildElementString(templateUrl, isExpandedFuncName));
                            }));

                            function getExpandedRow() {
                                return element.find('.expanded-row');
                            }

                            it('should render expander template when expanded', function () {
                                var expandedElements = undefined;
                                expect($scope[isExpandedFuncName]).toHaveBeenCalled();
                                expandedElements = element.find('.expandedRowClass');
                                expect(expandedElements.length).toEqual(1);
                                expect(expandedElements[0].innerHTML).toEqual(name);
                            });

                            it('should resize if the expanded row height changes', function () {
                                var document = $window.document,
                                    expandedElements = undefined,
                                    expandedRow = undefined,
                                    originalHeight = undefined,
                                    longString = 'some text that is really long and will cause the div to wrap a few times ' + 'we will see what happens I hope this works because i am tired of trying different things.';
                                try {
                                    spyOn(columnConfigs[4], 'isFixedRight').and.returnValue(true);
                                    angular.element(document.body).append(element);
                                    expandedRow = getExpandedRow();
                                    expandedElements = element.find('.expanded-content');
                                    expect(expandedElements.length).toEqual(1);
                                    originalHeight = expandedRow.height();
                                    expandedRow.append('<div>' + longString + '</div>');
                                    $scope.$apply();
                                    expandedRow = getExpandedRow();
                                    expect(expandedRow.height()).not.toEqual(originalHeight);
                                } finally {
                                    element.remove();
                                }
                            });
                        });
                    });
                });

                describe('right fixed column', function () {
                    var $window = undefined;
                    beforeEach(inject(function (_$window_) {
                        $window = _$window_;
                        spyOn(columnConfigs[4], 'isFixedRight').and.returnValue(true);
                    }));

                    it('sets styles on fixed column if there is one', function () {
                        var columnElements = undefined,
                            tableElement = undefined,
                            overlapElement = undefined;
                        createElement();

                        // make the watcher fire
                        $scope.$apply();
                        // flush it out
                        $timeout.flush();

                        columnElements = angular.element(element.find('.normal-col.col-fixed-right'));
                        tableElement = angular.element(element.find('.table-fixed-right'));
                        overlapElement = angular.element(element.find('.data-table-overlap'));

                        // Check that fixed classes are added to elements
                        expect(columnElements.length > 0).toEqual(true);
                        expect(tableElement.length > 0).toEqual(true);
                        expect(overlapElement.length > 0).toEqual(true);

                        // Check that some styles are set
                        expect(tableElement[0].style.marginRight).not.toEqual('');
                        columnElements.each(function (idx, elt) {
                            expect(elt.style.width).not.toEqual('');
                        });
                        expect(overlapElement[0].style.bottom).not.toEqual('');
                        expect(overlapElement[0].style.right).not.toEqual('');
                    });

                    it('corrects height if table height changes', function () {
                        var firstCell = undefined,
                            fixedCell = undefined,
                            originalHeight = undefined;
                        createElement();
                        angular.element($window.document.body).append(element);
                        try {
                            $scope.$apply();
                            $timeout.flush();
                            firstCell = element.find('tr:first-of-type td:first-of-type');
                            fixedCell = element.find('tr:first-of-type td.col-fixed-right');
                            originalHeight = fixedCell[0].scrollHeight;
                            // Set the height to something weird.
                            fixedCell.css('height', 400);
                            // Set the non-fixed cell text to something large that will increase height
                            firstCell[0].innerText = 'asfadsfdas fads fads f dasf ads fads f adsf ad sf asdf a dsf ads f asdf' + ' asdf asdf adsf as df asdf asdf adsf adsf adsf adsf adsf adsf adsf adsf adsf adsfa' + 'adsfasdfasdf asdf asdf ads fads fads fadsf adsf adsfadsfadsfadsfadsfadsfasdf';
                            // Double digest to trigger watch and then async apply
                            $scope.$apply();
                            $scope.$apply();
                            // Now they should match
                            expect(fixedCell[0].scrollHeight).toEqual(firstCell[0].scrollHeight);
                        } finally {
                            element.remove();
                        }
                    });
                });

                describe('spIncludeXs', function () {
                    it('includes xs table if true', function () {
                        var def = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-column-config-key="someColumns" ' + 'sp-search-data="searchData" ' + 'sp-paging-data="pagingData" ' + 'sp-refresh-trigger="refreshTrigger" ' + 'sp-checkbox-multiselect="checkbox" ' + 'sp-include-xs="true" />';
                        createElement(def);

                        expect(element.find('div.visible-xs').length).not.toEqual(0);
                        expect(element.find('div.hidden-xs').length).not.toEqual(0);
                    });

                    it('excludes xs table if false', function () {
                        createElement();
                        expect(element.find('div.visible-xs').length).toEqual(0);
                        expect(element.find('div.hidden-xs').length).toEqual(0);
                    });
                });

                it('should show section headers if tableConfig.groupByColumn is defined', function () {
                    var def = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-table-config="tableConfig" />';

                    $scope.tableConfig = new DataTableDirectiveConfig({
                        columnConfigKey: someColumnConfigKey,
                        groupByColumn: 'status'
                    });

                    createElement(def);

                    // there should be section header rows for each status value: Open, Closed.
                    expect(element.find('.section-header-row').length).toBe(2);
                });

                describe('spTableConfig', function () {
                    var def = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-table-config="tableConfig" />',
                        testColumnConfigKey = 'testColumnConfigKey',
                        testCheckbox = {
                        attach: jasmine.createSpy('attach')
                    };

                    beforeEach(function () {
                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: testColumnConfigKey,
                            checkboxMultiSelect: testCheckbox
                        });
                        createElement(def);
                    });

                    it('should throw if tableConfig is not defined', function () {
                        $scope.tableConfig = undefined;
                        expect(function () {
                            createElement(def);
                        }).toThrow();
                    });

                    it('should throw if tableConfig is not instance of DataTableDirectiveConfig', function () {
                        $scope.tableConfig = {};
                        expect(function () {
                            createElement(def);
                        }).toThrow();
                    });

                    it('should use tableConfig defined column config key', function () {
                        expect(configService.getColumnConfigEntries).toHaveBeenCalledWith(testColumnConfigKey);
                    });

                    it('should use tableConfig defined paging data', function () {
                        expect(element.find('#page-size-dropdown-toggle').text().trim()).toContain('10');
                    });

                    it('should use tableConfig defined refreshTrigger', function () {
                        var trigger = $scope.tableConfig.getRefreshTrigger();
                        trigger.refresh();
                        expect($scope.itemsFunc).toHaveBeenCalled();
                    });

                    it('should use tableConfig defined checkbox', function () {
                        expect(testCheckbox.attach).toHaveBeenCalled();
                        expect(element.find('.checkbox-col').length).toBeGreaterThan(1);
                    });

                    it('should update section header when table config groupByColumn changes', function () {
                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: someColumnConfigKey,
                            groupByColumn: 'name'
                        });

                        $scope.$apply();

                        expect($scope.$$childHead.dataTableCtrl.spSectionHeader).toEqual('name');
                    });

                    it('should update when table config changes', function () {
                        var anotherTestColumnConfigKey = 'anotherTestColumnConfigKey';

                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: anotherTestColumnConfigKey
                        });

                        $scope.tableConfig.pageState.pagingData.itemsPerPage = 20;

                        $scope.$apply();

                        expect(configService.getColumnConfigEntries).toHaveBeenCalledWith(anotherTestColumnConfigKey);
                        expect(element.find('#page-size-dropdown-toggle').text().trim()).toContain('20');
                    });

                    it('should hide footer based on config', function () {
                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: someColumnConfigKey,
                            hideFooter: true
                        });

                        $scope.$apply();

                        expect(element.find('.panel-footer').length).toBe(0);
                    });
                });

                describe('filter panel', function () {
                    var def = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-table-config="tableConfig" ' + 'sp-refresh-trigger="refreshTrigger" />',
                        testColumnConfigKey = 'testColumnConfigKey';

                    beforeEach(function () {
                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: testColumnConfigKey,
                            filters: $scope.filters
                        });
                        $scope.tableConfig.headerEnabled = true;
                        $scope.tableConfig.filterTitle = 'testTitle';
                        createElement(def);
                    });

                    it('should have populated the filter panel title', function () {
                        expect(element.find('.filter-panel-title h5').text()).toEqual('testTitle');
                    });

                    it('should have populated the filters in filterGroups', function () {
                        expect(element.find('.filter-item').length).toBe(3);
                    });

                    it('should have disabled apply filter button', function () {
                        expect(element.find('#filterPanelApplyBtn').hasClass('disabled')).toBe(true);
                    });

                    it('should have non disabled filter buttons after input', function () {
                        var inputField = element.find('#filterPanelItem1');
                        inputField.val('123');
                        inputField.trigger('input');
                        expect(element.find('#filterPanelClearBtn').hasClass('disabled')).toBe(false);
                        expect(element.find('#filterPanelApplyBtn').hasClass('disabled')).toBe(false);
                    });

                    it('should reset after hitting the clear button', function () {
                        expect(element.find('.filter-item').length).toBe(3);
                        var inputField = element.find('#filterPanelItem1');
                        inputField.val('123');
                        inputField.trigger('input');
                        expect(inputField.val()).toEqual('123');
                        element.find('#filterPanelClearBtn').click();
                        expect(inputField.val()).toEqual('');
                    });

                    it('should have called the search function after applying filters', function () {
                        expect(element.find('.filter-item').length).toBe(3);
                        var inputField = element.find('#filterPanelItem1');
                        inputField.val('123');
                        inputField.trigger('input');
                        spyOn($scope.$$childHead.dataTableCtrl, 'search');
                        expect($scope.$$childHead.dataTableCtrl.search).not.toHaveBeenCalled();
                        element.find('#filterPanelApplyBtn').click();
                        element.find('#filterPanelApplyBtn').trigger('click');
                        expect($scope.$$childHead.dataTableCtrl.search).toHaveBeenCalled();
                    });

                    it('should have a green filter button after applying filters', function () {
                        expect(element.find('#panelFilterBtn').hasClass('btn-white')).toBe(true);
                        expect(element.find('#panelFilterBtn').hasClass('btn-success')).toBe(false);

                        expect(element.find('.filter-item').length).toBe(3);
                        var inputField = element.find('#filterPanelItem1');
                        inputField.val('123');
                        inputField.trigger('input');

                        $scope.tableConfig.pageState.searchData.hasFilterValues = jasmine.createSpy().and.returnValue(true);
                        $scope.$apply();
                        element.find('#filterPanelApplyBtn').click();
                        element.find('#filterPanelApplyBtn').trigger('click');

                        expect(element.find('#panelFilterBtn').hasClass('btn-white')).toBe(false);
                        expect(element.find('#panelFilterBtn').hasClass('btn-success')).toBe(true);
                    });

                    it('should have the chevron displayed correctly depending on if panel is collapsed or not', function () {
                        expect(element.find('#panelFilterBtn .fa-chevron-down').hasClass('unrotate')).toBe(true);
                        expect(element.find('#panelFilterBtn .fa-chevron-down').hasClass('rotate')).toBe(false);

                        element.find('#panelFilterBtn').click();
                        element.find('#panelFilterBtn').trigger('click');
                        $scope.$$childHead.dataTableCtrl.filtersDisplayed = jasmine.createSpy().and.returnValue(true);
                        $scope.$apply();

                        expect(element.find('#panelFilterBtn .fa-chevron-down').hasClass('unrotate')).toBe(false);
                        expect(element.find('#panelFilterBtn .fa-chevron-down').hasClass('rotate')).toBe(true);
                    });
                });
                describe('spDataTableHeading', function () {
                    var $window = undefined,
                        def = '<div><div class="panel">' + '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-table-config="tableConfig" >' + '  <sp-data-table-heading sp-position="right" sp-priority="2">' + '    <button id="csvBtn" class="btn btn-white btn-sm icon-btn" tabindex="50"/>' + '  </sp-data-table-heading>' + '  <sp-data-table-heading sp-position="left">' + '    <button id="bulkBtn" class="btn btn-white btn-sm icon-btn" tabindex="50"/>' + '  </sp-data-table-heading>' + '  <sp-data-table-heading sp-position="right" sp-priority="1">' + '    <button id="customBtn" class="btn btn-white btn-sm icon-btn" tabindex="50"/>' + '  </sp-data-table-heading>' + '  <sp-data-table-heading sp-position="right"' + '    <button id="columnsBtn" class="btn btn-white btn-sm icon-btn" tabindex="50"/>' + '  </sp-data-table-heading>' + '  <sp-data-table-heading sp-position="top"' + '    <span id="topHeading">Heading</span>' + '  </sp-data-table-heading>' + '</sp-data-table></div></div>';

                    beforeEach(inject(function (_$window_) {
                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: someColumnConfigKey,
                            filters: $scope.filters
                        });
                        $window = _$window_;
                    }));

                    it('should not display the header panel due to config not set', function () {
                        createElement(def);
                        expect(element.find('.panel-heading').hasClass('ng-hide')).toBe(true);
                    });

                    it('should display the header panel', function () {
                        $scope.tableConfig.headerEnabled = true;
                        createElement(def);
                        expect(element.find('.panel-heading').hasClass('ng-hide')).toBe(false);
                    });

                    it('should not contain default filter button', function () {
                        $scope.tableConfig.filters = [];
                        createElement(def);
                        expect(element.find('#panelFilterBtn').length).toBe(0);
                    });

                    it('should contain default filter button', function () {
                        createElement(def);
                        $scope.tableConfig.headerEnabled = true;
                        createElement(def);
                        expect(element.find('#panelFilterBtn').length).toBe(1);
                    });

                    it('should contain default paging info', inject(function (PagingData) {
                        createElement(def);
                        expect(element.find('.current-page-info').length).toBe(0);
                        $scope.tableConfig.pagingInfoEnabled = true;
                        $scope.tableConfig.pageState.pagingData = new PagingData(25);
                        createElement(def);
                        expect(element.find('.current-page-info').length).toBe(1);
                    }));

                    it('should contain heading buttons', function () {
                        $scope.tableConfig.headerEnabled = true;
                        createElement(def);
                        expect(element.find('#panelHeadingFarRight #csvBtn').length).toBe(1);
                        expect(element.find('#panelHeadingLeft #bulkBtn').length).toBe(1);
                        expect(element.find('#panelHeadingRight #customBtn').length).toBe(1);
                        expect(element.find('#panelHeadingRight #columnsBtn').length).toBe(1);
                    });

                    it('should contain top heading outside panel', function () {
                        $scope.tableConfig.headerEnabled = true;
                        createElement(def);
                        expect(element.find('#topHeading').length).toBe(1);
                    });
                });

                describe('preSearchFunc', function () {

                    function testPreSearchFunc(hasFunc, funcSuccess) {
                        var def = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-table-config="tableConfig" />';

                        $scope.tableConfig = new DataTableDirectiveConfig({
                            columnConfigKey: someColumnConfigKey,
                            groupByColumn: 'status',
                            filters: $scope.filters
                        });

                        // Add the preSearchFunc to the tableConfig
                        if (hasFunc) {
                            $scope.tableConfig.preSearchFunc = jasmine.createSpy('preSearchFunc').and.returnValue(funcSuccess ? $q.when() : $q.reject());
                        }

                        createElement(def);

                        // Set a modified scratch pad to the DataTableDirectiveCtrl
                        var scratchPad = {
                            filterValues: {
                                newFilter: 'thing'
                            }
                        },
                            oldSearchData = $scope.$$childHead.dataTableCtrl.getPageState().searchData;
                        $scope.$$childHead.dataTableCtrl.searchScratchPad = scratchPad;

                        // Spy on doSearch, which does the real searching
                        spyOn($scope.$$childHead.dataTableCtrl, 'doSearch').and.callThrough();

                        // Call the search() method to simulate applying filter panel
                        $scope.$$childHead.dataTableCtrl.search();
                        $scope.$apply();
                        $timeout.flush();

                        // Make sure the right things happened
                        if (!hasFunc) {
                            expect($scope.$$childHead.dataTableCtrl.doSearch).toHaveBeenCalled();
                        } else {
                            expect($scope.tableConfig.preSearchFunc).toHaveBeenCalledWith(scratchPad, oldSearchData);
                            if (funcSuccess) {
                                expect($scope.$$childHead.dataTableCtrl.doSearch).toHaveBeenCalled();
                            } else {
                                expect($scope.$$childHead.dataTableCtrl.doSearch).not.toHaveBeenCalled();
                            }
                        }
                    }

                    it('just calls through to regular search without preSearchFunc', function () {
                        testPreSearchFunc(false);
                    });

                    it('calls through to regular search if preSearchFunc returns resolved promise', function () {
                        testPreSearchFunc(true, true);
                    });

                    it('does not calls through to regular search if preSearchFunc returns rejected promise', function () {
                        testPreSearchFunc(true, false);
                    });
                });

                describe('column preferences', function () {
                    var definition = '<sp-data-table sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)" ' + 'sp-table-config="tableConfig" />',
                        tableColumnPreferenceService = undefined,
                        tableColumnPreferences = undefined;

                    beforeEach(inject(function (_tableColumnPreferenceService_) {
                        tableColumnPreferenceService = _tableColumnPreferenceService_;
                        $scope.tableConfig = new DataTableDirectiveConfig({
                            headerEnabled: true,
                            columnsBtnEnabled: true,
                            columnConfigKey: someColumnConfigKey,
                            tableId: 'preferenceTable'
                        });
                        //Exclude risk, we hid it.
                        tableColumnPreferences = ['someValue', 'name'];
                        spyOn(configService, 'getTableColumnPreferences').and.callFake(function () {
                            return $q.when(tableColumnPreferences);
                        });
                        spyOn(tableColumnPreferenceService, 'saveTableColumnPreferences').and.returnValue($q.when());
                    }));

                    describe('button', function () {
                        it('should not be shown if not enabled', function () {
                            $scope.tableConfig.columnsBtnEnabled = false;
                            createElement(definition);
                            $timeout.flush();
                            expect(element.find('#panelColumnsBtn').length).toBe(0);
                        });

                        it('should be shown if enabled', function () {
                            $scope.tableConfig.headerEnabled = true;
                            $scope.tableConfig.columnsBtnEnabled = true;
                            createElement(definition);
                            $timeout.flush();
                            expect(element.find('#panelColumnsBtn').length).toBe(1);
                        });

                        it('toggles the panel open when clicked', function () {
                            $scope.tableConfig.headerEnabled = true;
                            $scope.tableConfig.columnsBtnEnabled = true;
                            createElement(definition);
                            $timeout.flush();
                            var panel = element.find('div.column-editor-panel');
                            expect(angular.element(panel).hasClass('in')).toEqual(false);
                            var btn = angular.element(element.find('#panelColumnsBtn')[0]);
                            btn.click();
                            $scope.$apply();
                            panel = element.find('div.column-editor-panel');
                            expect(angular.element(panel).hasClass('in')).toEqual(true);
                        });
                    });

                    describe('getColumnConfigs()', function () {
                        it('fetches table column preferences', function () {
                            createElement(definition);
                            expect(configService.getTableColumnPreferences).toHaveBeenCalledWith($scope.tableConfig.tableId);
                        });
                    });

                    describe('applying column changes', function () {
                        function saveColumns() {
                            var btn = angular.element(element.find('#panelColumnsBtn')[0]);
                            btn.click();
                            $scope.$apply();
                            var saveBtn = angular.element(element.find('#saveColumnEditBtn')[0]);
                            saveBtn.click();
                        }
                        it('saves the table column preferences', function () {
                            createElement(definition);
                            $timeout.flush();
                            saveColumns();
                            $timeout.flush();
                            expect(tableColumnPreferenceService.saveTableColumnPreferences).toHaveBeenCalledWith($scope.tableConfig.tableId, tableColumnPreferences);
                        });

                        it('toggles the panel closed', function () {
                            createElement(definition);
                            $timeout.flush();
                            saveColumns();
                            $timeout.flush();
                            $scope.$apply();
                            var panel = element.find('div.column-editor-panel');
                            expect(angular.element(panel).hasClass('in')).toEqual(false);
                        });

                        it('fetches items', function () {
                            createElement(definition);
                            $timeout.flush();
                            $scope.itemsFunc.calls.reset();
                            saveColumns();
                            $timeout.flush();
                            $scope.$apply();
                            expect($scope.itemsFunc).toHaveBeenCalled();
                        });

                        it('saves new preferences to configService', function () {
                            spyOn(configService, 'registerTableColumnPreference');
                            createElement(definition);
                            $timeout.flush();
                            saveColumns();
                            $timeout.flush();
                            $scope.$apply();
                            expect(configService.registerTableColumnPreference).toHaveBeenCalledWith($scope.tableConfig.tableId, tableColumnPreferences);
                        });
                    });

                    describe('updating columns from preferences', function () {
                        function testColumnHidden(configs, dataIndex, isHidden) {
                            var column = configs.find(function (cc) {
                                return cc.dataIndex === dataIndex;
                            });
                            expect(column).toBeDefined();
                            expect(column.hidden).toEqual(isHidden);
                        }

                        it('marks hidden/not hidden the correct columns', function () {
                            createElement(definition);
                            $timeout.flush();
                            var columnConfigs = $scope.$$childHead.dataTableCtrl.columnConfigs;
                            testColumnHidden(columnConfigs, 'someValue', false);
                            testColumnHidden(columnConfigs, 'name', false);
                            testColumnHidden(columnConfigs, 'risk', true);
                        });

                        it('sorts columns', function () {
                            createElement(definition);
                            $timeout.flush();
                            var columnConfigs = $scope.$$childHead.dataTableCtrl.columnConfigs;
                            // shifts the undisplayed columns to the front and orders the displayed ones at the end.
                            expect(columnConfigs[columnConfigs.length - 2].dataIndex).toEqual('someValue');
                            expect(columnConfigs[columnConfigs.length - 1].dataIndex).toEqual('name');
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy90YWJsZS9EYXRhVGFibGVEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLHVCQUF1QixVQUFVLFNBQVM7SUFBM0g7O0lBR0ksSUFBSSxhQUFhO0lBQ2pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLGlDQUFpQztZQUN2RixjQUFjLGdDQUFnQztXQUMvQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQUo3QixTQUFTLGVBQWUsWUFBVzs7Z0JBRS9CLElBQUksb0JBQ0EsK0ZBQ0ksd0NBQ0EsaUNBQ0EsaUNBQ0EseUNBQ0E7b0JBQ0osc0JBQXNCO29CQUN0QjtvQkFBUTtvQkFBSTtvQkFBVTtvQkFBVTtvQkFBYTtvQkFBZTtvQkFBTztvQkFBVztvQkFBWTtvQkFDMUY7b0JBQTBCO29CQUFlO29CQUFxQjtvQkFBUztvQkFBUztvQkFBUztvQkFBUzs7Z0JBRXRHLFNBQVMsZ0JBQTZDO29CQWlCdEMsSUFqQk8sWUFBUyxVQUFBLFVBQUEsS0FBQSxVQUFBLE9BQUEsWUFBRyxvQkFBaUIsVUFBQTs7b0JBQ2hELFVBQVUsUUFBUSxRQUFRO29CQUMxQixTQUFTLFNBQVM7b0JBQ2xCLE9BQU87b0JBQ1AsT0FBTzs7O2dCQUdYLFdBQVcsT0FBTyxZQUFZOzs7Z0JBRzlCLFdBQVcsT0FBTyxVQUFTLGNBQWMsWUFBWSxNQUFNLFlBQVksZUFBZSxhQUFhLGNBQ3hFLGlCQUFpQixjQUFjLHNCQUFzQiw0QkFDckQsdUJBQXVCLFFBQVE7b0JBQ3RELFNBQVM7b0JBQ1QsS0FBSztvQkFDTCxXQUFXO29CQUNYLFdBQVc7b0JBQ1gsY0FBYztvQkFDZCxZQUFZO29CQUNaLGFBQWE7b0JBQ2IscUJBQXFCO29CQUNyQiwyQkFBMkI7b0JBQzNCLGdCQUFnQjtvQkFDaEIsc0JBQXNCOztvQkFFdEIs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LEdBQUcsaUJBQWlCLFlBQU07NEJBQ3RCLGNBQWM7NEJBQ2QsU0FBUzs0QkFDVCxPQUFPLFVBQVUsTUFBTTs0QkFDdkI7NEJBQ0EsU0FBUzs0QkFDVCxPQUFPOzRCQUNQLE9BQU8sT0FBTyxXQUFXOzs7d0JBRzdCLEdBQUcsMENBQTBDLFlBQU07NEJBQy9DLE1BQU0sZUFBZTs0QkFDckIsY0FBYzs0QkFDZCxTQUFTOzRCQUNUOzRCQUNBLFNBQVM7NEJBQ1QsT0FBTzs0QkFDUCxPQUFPLGNBQWMsK0JBQ2hCLHFCQUFxQixPQUFPLFlBQVksU0FBUzs7OztvQkFJOUQsU0FBUyxxQ0FBcUMsWUFBTTt3QkFDaEQsU0FBUyxpQkFBaUIsU0FBUyxXQUFXLFVBQVU7NEJBQ3BELElBQUksU0FBUyxRQUFRLEtBQUssVUFBQyxJQUFFO2dDQXpCYixPQXlCa0IsR0FBRyxjQUFjOzs0QkFDbkQsT0FBTyxRQUFROzRCQUNmLE9BQU8sT0FBTyxRQUFRLFFBQVE7Ozt3QkFHbEMsR0FBRywrQ0FBK0MsWUFBTTs0QkFDcEQsY0FBYzs0QkFDZCxTQUFTOzRCQUNULElBQUksZ0JBQWdCLE9BQU8sWUFBWSxjQUFjOzRCQUNyRCxpQkFBaUIsZUFBZSxhQUFhOzRCQUM3QyxpQkFBaUIsZUFBZSxRQUFROzRCQUN4QyxpQkFBaUIsZUFBZSxRQUFROzs7d0JBRzVDLEdBQUcsaUJBQWlCLFlBQU07NEJBQ3RCLGNBQWM7NEJBQ2QsU0FBUzs0QkFDVCxJQUFJLGdCQUFnQixPQUFPLFlBQVksY0FBYzs7NEJBRXJELE9BQU8sY0FBYyxjQUFjLFNBQVMsR0FBRyxXQUFXLFFBQVE7NEJBQ2xFLE9BQU8sY0FBYyxjQUFjLFNBQVMsR0FBRyxXQUFXLFFBQVE7Ozs7Ozs7R0FqQi9FIiwiZmlsZSI6ImNvbW1vbi9kYXRhdmlldy90YWJsZS9EYXRhVGFibGVEaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgdGFibGVNb2R1bGUgZnJvbSAnY29tbW9uL2RhdGF2aWV3L3RhYmxlL1RhYmxlTW9kdWxlJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdzcERhdGFUYWJsZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGVsZW1lbnREZWZpbml0aW9uID1cbiAgICAgICAgJzxzcC1kYXRhLXRhYmxlIHNwLWl0ZW1zLWZ1bmM9XCJpdGVtc0Z1bmMoc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgZmlsdGVyVmFsdWVzLCBzb3J0T3JkZXIpXCIgJyArXG4gICAgICAgICAgICAnc3AtY29sdW1uLWNvbmZpZy1rZXk9XCJzb21lQ29sdW1uc1wiICcgK1xuICAgICAgICAgICAgJ3NwLXNlYXJjaC1kYXRhPVwic2VhcmNoRGF0YVwiICcgK1xuICAgICAgICAgICAgJ3NwLXBhZ2luZy1kYXRhPVwicGFnaW5nRGF0YVwiICcgK1xuICAgICAgICAgICAgJ3NwLXJlZnJlc2gtdHJpZ2dlcj1cInJlZnJlc2hUcmlnZ2VyXCIgJyArXG4gICAgICAgICAgICAnc3AtY2hlY2tib3gtbXVsdGlzZWxlY3Q9XCJjaGVja2JveFwiIC8+JyxcbiAgICAgICAgc29tZUNvbHVtbkNvbmZpZ0tleSA9ICdzb21lQ29sdW1ucycsXG4gICAgICAgICRzY29wZSwgJHEsICRjb21waWxlLCAkdGltZW91dCwgdGVzdFNlcnZpY2UsIGNvbHVtbkNvbmZpZ3MsIGl0ZW1zLCBTb3J0T3JkZXIsIFNlYXJjaERhdGEsIERhdGFSZWZyZXNoVHJpZ2dlcixcbiAgICAgICAgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnLCBjb25maWdTZXJ2aWNlLCBDaGVja2JveE11bHRpU2VsZWN0LCBmaWx0ZXIxLCBmaWx0ZXIyLCBmaWx0ZXIzLCBlbGVtZW50LCBncm91cHM7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGRlZmludGlvbiA9IGVsZW1lbnREZWZpbml0aW9uKSB7XG4gICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZGVmaW50aW9uKTtcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlLCB0YWJsZU1vZHVsZSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTMgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHJvb3RTY29wZV8sIF8kY29tcGlsZV8sIF8kcV8sIF8kdGltZW91dF8sIF90ZXN0U2VydmljZV8sIF9Tb3J0T3JkZXJfLCBDb2x1bW5Db25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbmZpZ1NlcnZpY2VfLCBfU2VhcmNoRGF0YV8sIF9EYXRhUmVmcmVzaFRyaWdnZXJfLCBfRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQ2hlY2tib3hNdWx0aVNlbGVjdF8sIEZpbHRlcikge1xuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuICAgICAgICAkdGltZW91dCA9IF8kdGltZW91dF87XG4gICAgICAgIHRlc3RTZXJ2aWNlID0gX3Rlc3RTZXJ2aWNlXztcbiAgICAgICAgU29ydE9yZGVyID0gX1NvcnRPcmRlcl87XG4gICAgICAgIFNlYXJjaERhdGEgPSBfU2VhcmNoRGF0YV87XG4gICAgICAgIERhdGFSZWZyZXNoVHJpZ2dlciA9IF9EYXRhUmVmcmVzaFRyaWdnZXJfO1xuICAgICAgICBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcgPSBfRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnXztcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9jb25maWdTZXJ2aWNlXztcbiAgICAgICAgQ2hlY2tib3hNdWx0aVNlbGVjdCA9IF9DaGVja2JveE11bHRpU2VsZWN0XztcblxuICAgICAgICBjb2x1bW5Db25maWdzID0gW25ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgZGF0YUluZGV4OiAnbmFtZScsXG4gICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiAyNTBcbiAgICAgICAgfSksbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdzb21lVmFsdWUnLFxuICAgICAgICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgcGVyY2VudFdpZHRoOiAyNVxuICAgICAgICB9KSxuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgIGRhdGFJbmRleDogJ2V4dHJhJyxcbiAgICAgICAgICAgIGZpZWxkT25seTogdHJ1ZVxuICAgICAgICB9KSxuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgIGRhdGFJbmRleDogJ3N0YXR1cycsXG4gICAgICAgICAgICBmaWVsZE9ubHk6IHRydWVcbiAgICAgICAgfSksbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdyaXNrJyxcbiAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaycsXG4gICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGhpZGVhYmxlOiB0cnVlXG4gICAgICAgIH0pXTtcblxuICAgICAgICBjb25maWdTZXJ2aWNlLmdldENvbHVtbkNvbmZpZ0VudHJpZXMgPSB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzb21lQ29sdW1uczogY29sdW1uQ29uZmlnc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgaXRlbXMgPSBbe1xuICAgICAgICAgICAgbmFtZTogJ2l0ZW1PbmUnLFxuICAgICAgICAgICAgc29tZVZhbHVlOiA3LFxuICAgICAgICAgICAgZXh0cmE6IGZhbHNlLFxuICAgICAgICAgICAgc3RhdHVzOiAnT3BlbicsXG4gICAgICAgICAgICByaXNrOiAxMDBcbiAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnaXRlbVR3bycsXG4gICAgICAgICAgICBzb21lVmFsdWU6IDIyLFxuICAgICAgICAgICAgZXh0cmE6IHRydWUsXG4gICAgICAgICAgICBzdGF0dXM6ICdDbG9zZWQnLFxuICAgICAgICAgICAgcmlzazogMjAwXG4gICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ2l0ZW1UaHJlZScsXG4gICAgICAgICAgICBzb21lVmFsdWU6IDIzLFxuICAgICAgICAgICAgZXh0cmE6IHRydWUsXG4gICAgICAgICAgICBzdGF0dXM6ICdDbG9zZWQnLFxuICAgICAgICAgICAgcmlzazogMjAwXG4gICAgICAgIH1dO1xuXG4gICAgICAgIGdyb3VwcyA9IFt7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnT3BlbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3VudDogMVxuICAgICAgICB9LHtcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdDbG9zZWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY291bnQ6IDJcbiAgICAgICAgfV07XG5cbiAgICAgICAgJHNjb3BlLml0ZW1zRnVuYyA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RzOiBpdGVtcyxcbiAgICAgICAgICAgICAgICBjb3VudDogMyxcbiAgICAgICAgICAgICAgICBtZXRhRGF0YToge1xuICAgICAgICAgICAgICAgICAgICBncm91cHM6IGdyb3Vwc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsdGVyMSA9IG5ldyBGaWx0ZXIoe1xuICAgICAgICAgIHByb3BlcnR5OiAncHJvcCcsXG4gICAgICAgICAgbGFiZWw6ICd1aV9sYWJlbCcsXG4gICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfU1RSSU5HXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbHRlcjIgPSBuZXcgRmlsdGVyKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiAncHJvcDInLFxuICAgICAgICAgICAgbGFiZWw6ICd1aV9sYWJlbDInLFxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfTlVNQkVSXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbHRlcjMgPSBuZXcgRmlsdGVyKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiAncHJvcDMnLFxuICAgICAgICAgICAgbGFiZWw6ICd1aV9sYWJlbDMnLFxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfU1RSSU5HXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5maWx0ZXJzID0gW2ZpbHRlcjEsIGZpbHRlcjIsIGZpbHRlcjNdO1xuXG4gICAgICAgICRzY29wZS5zZWFyY2hEYXRhID0gbmV3IFNlYXJjaERhdGEoKTtcbiAgICAgICAgJHNjb3BlLnNlYXJjaERhdGEuZmlsdGVyVmFsdWVzID0ge1xuICAgICAgICAgICAgc29tZXRoaW5nOiAnZmlsdGVyZWQnXG4gICAgICAgIH07XG5cbiAgICB9KSk7XG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnY2FsbHMgc3BJdGVtRnVuYyB0byBnZXQgaXRlbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBleHBlY3QoJHNjb3BlLml0ZW1zRnVuYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoMCwgMTAsICRzY29wZS5zZWFyY2hEYXRhLmZpbHRlclZhbHVlcywgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCd1c2VzIHRoZSBwYXNzZWQgaW4gUGFnaW5nRGF0YSBpZiBzdXBwbGllZCcsIGluamVjdChmdW5jdGlvbihQYWdpbmdEYXRhKSB7XG4gICAgICAgICRzY29wZS5wYWdpbmdEYXRhID0gbmV3IFBhZ2luZ0RhdGEoMjUpO1xuICAgICAgICBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNwYWdlLXNpemUtZHJvcGRvd24tdG9nZ2xlJykudGV4dCgpLnRyaW0oKSkudG9Db250YWluKCcyNScpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG93cyBubyByZXN1bHRzIG1lc3NhZ2Ugd2hlbiB0aGVyZSBhcmUgbm8gaXRlbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZywgdGFibGU7XG5cbiAgICAgICAgJHNjb3BlLml0ZW1zRnVuYyA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RzOiBbXSxcbiAgICAgICAgICAgICAgICBjb3VudDogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG5cbiAgICAgICAgbXNnID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmZpbmQoJ2Rpdi5uby1yZXN1bHRzLXBhbmVsIGgzJyk7XG4gICAgICAgIGV4cGVjdChtc2cubGVuZ3RoKS50b0JlKDEpO1xuXG4gICAgICAgIHRhYmxlID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmZpbmQoJ3RhYmxlJyk7XG4gICAgICAgIGV4cGVjdCh0YWJsZS5sZW5ndGgpLnRvQmUoMCk7XG5cbiAgICAgICAgLy8gcmVzZXQgc2NvcGUuaXRlbXNGdW5jXG4gICAgICAgICRzY29wZS5pdGVtc0Z1bmMgPSB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0czogaXRlbXMsXG4gICAgICAgICAgICAgICAgY291bnQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvd3MgZGlzcGxheWFibGUgY29sdW1ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY29sdW1ucztcbiAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBjb2x1bW5zID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmZpbmQoJ3RoZWFkIHRoJyk7XG4gICAgICAgIGV4cGVjdChjb2x1bW5zLmxlbmd0aCkudG9CZSgzKTtcbiAgICAgICAgZXhwZWN0KGNvbHVtbnNbMF0uaW5uZXJUZXh0LnRyaW0oKSkudG9Db250YWluKCduYW1lJyk7XG4gICAgICAgIGV4cGVjdChjb2x1bW5zWzFdLmlubmVyVGV4dC50cmltKCkpLnRvQ29udGFpbignc29tZVZhbHVlJyk7XG4gICAgICAgIGV4cGVjdChjb2x1bW5zWzJdLmlubmVyVGV4dC50cmltKCkpLnRvQ29udGFpbigncmlzaycpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NvbHVtbiB3aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBnZXRIZWFkZXJXaWR0aFN0eWxlKGNvbElkeCkge1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkuZmluZCgndGhlYWQgdGgnKSxcbiAgICAgICAgICAgICAgICBjb2wgPSBjb2x1bW5zW2NvbElkeF07XG4gICAgICAgICAgICByZXR1cm4gY29sLnN0eWxlLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaXQoJ2lzIGluIHBpeGVscyB3aGVuIHRoZSBjb2x1bW4gY29uZmlnIHVzZXMgd2lkdGgnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChnZXRIZWFkZXJXaWR0aFN0eWxlKDApKS50b0VxdWFsKCcyNTBweCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgaW4gcGVyY2VudGFnZSB3aGVuIHRoZSBjb2x1bW4gY29uZmlnIHVzZXMgcGVyY2VudCB3aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGdldEhlYWRlcldpZHRoU3R5bGUoMSkpLnRvRXF1YWwoJzI1JScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgbm90IHNwZWNpZmllZCB3aGVuIHRoZSBjb2x1bW4gY29uZmlnIGRvZXMgbm90IGhhdmUgYSB3aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGdldEhlYWRlcldpZHRoU3R5bGUoMikpLnRvRXF1YWwoJycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgbm90IHNwZWNpZmllZCB3aGVuIGxhc3QgZGlzcGxheWVkIGNvbHVtbicsICgpID0+IHtcbiAgICAgICAgICAgIGNvbHVtbkNvbmZpZ3NbNF0ucGVyY2VudFdpZHRoID0gMTA7XG4gICAgICAgICAgICBleHBlY3QoZ2V0SGVhZGVyV2lkdGhTdHlsZSgyKSkudG9FcXVhbCgnJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NvcnRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbHVtbnMsIHNyT25seURpdjtcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgY29sdW1ucyA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5maW5kKCd0aGVhZCB0aCcpO1xuICAgICAgICAgICAgc3JPbmx5RGl2ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmZpbmQoJ2Rpdltyb2xlPWFsZXJ0XScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc29ydHMgd2hlbiBjbGlja2luZyBzb3J0YWJsZSBoZWFkZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbXNGdW5jLmNhbGxzLnJlc2V0KCk7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoY29sdW1uc1syXSkuY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuaXRlbXNGdW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgwLCAxMCwgJHNjb3BlLnNlYXJjaERhdGEuZmlsdGVyVmFsdWVzLFxuICAgICAgICAgICAgICAgIG5ldyBTb3J0T3JkZXIoJ3Jpc2snLCB0cnVlKSk7XG5cbiAgICAgICAgICAgICRzY29wZS5pdGVtc0Z1bmMuY2FsbHMucmVzZXQoKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChjb2x1bW5zWzJdKS5jbGljaygpO1xuICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5pdGVtc0Z1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDAsIDEwLCAkc2NvcGUuc2VhcmNoRGF0YS5maWx0ZXJWYWx1ZXMsXG4gICAgICAgICAgICAgICAgbmV3IFNvcnRPcmRlcigncmlzaycsIGZhbHNlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdCBzb3J0IHdoZW4gY2xpY2sgdW5zb3J0YWJsZSBoZWFkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5pdGVtc0Z1bmMuY2FsbHMucmVzZXQoKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChjb2x1bW5zWzFdKS5jbGljaygpO1xuICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5pdGVtc0Z1bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd1cGRhdGVzIHRoZSA1MDggdGV4dCBhcHByb3ByaWF0ZWx5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbXNGdW5jLmNhbGxzLnJlc2V0KCk7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoY29sdW1uc1syXSkuY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdChzck9ubHlEaXYudGV4dCgpKS50b0JlKCd1aV9kYXRhX3RhYmxlX3NvcnRlZF9hc2NlbmRpbmdfc3InKTtcblxuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGNvbHVtbnNbMl0pLmNsaWNrKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3JPbmx5RGl2LnRleHQoKSkudG9CZSgndWlfZGF0YV90YWJsZV9zb3J0ZWRfZGVzY2VuZGluZ19zcicpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdwYWdpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVzY3JpYmUoJ3BhZ2Ugc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ2NhbGxzIHNwSXRlbXNGdW5jIHdoZW4gY2hhbmdpbmcgcGFnZSBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIGxldCBkcm9wVG9nZ2xlID0gZWxlbWVudC5maW5kKCcjcGFnZS1zaXplLWRyb3Bkb3duLXRvZ2dsZScpLFxuICAgICAgICAgICAgICAgICAgICBtZW51SXRlbXM7XG5cbiAgICAgICAgICAgICAgICAvLyBQb3AgdGhlIG1lbnUgdXAuXG4gICAgICAgICAgICAgICAgZHJvcFRvZ2dsZS5jbGljaygpO1xuICAgICAgICAgICAgICAgIG1lbnVJdGVtcyA9IGRyb3BUb2dnbGUubmV4dCgpLmZpbmQoJ2xpIGEnKTtcblxuICAgICAgICAgICAgICAgIC8vIEV4cGVjdCAzIHNpemVzIC0gMTAsIDI1LCA1MC5cbiAgICAgICAgICAgICAgICBleHBlY3QobWVudUl0ZW1zLmxlbmd0aCkudG9FcXVhbCgzKTtcblxuICAgICAgICAgICAgICAgIC8vIENsaWNrIHRoZSAnMjUnIGl0ZW0uXG4gICAgICAgICAgICAgICAgJHNjb3BlLml0ZW1zRnVuYy5jYWxscy5yZXNldCgpO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChtZW51SXRlbXNbMV0pLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5pdGVtc0Z1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDAsIDI1LCAkc2NvcGUuc2VhcmNoRGF0YS5maWx0ZXJWYWx1ZXMsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3BhZ2luYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdpcyBub3QgZGlzcGxheWVkIGlmIHRoZXJlIGlzIG9uZSBwYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIGxldCBwYWdpbmF0aW9uID0gZWxlbWVudC5maW5kKCcucGFnaW5hdGlvbicpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwYWdpbmF0aW9uLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjaGVja2JveCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlY2tib3g7XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoZWNrYm94ID0ge1xuICAgICAgICAgICAgICAgIGF0dGFjaDogamFzbWluZS5jcmVhdGVTcHkoJ2F0dGFjaCcpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBoYXNDaGVja2JveChlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgY2hlY2tzID0gZWxlbWVudC5maW5kKCcuY2hlY2tib3gtY29sJyk7XG4gICAgICAgICAgICByZXR1cm4gKGNoZWNrcy5sZW5ndGggPiAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldENoZWNrYm94SGVhZGVyKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBlbGVtZW50LmZpbmQoJ3RoZWFkIC5jaGVja2JveC1jb2wgYnV0dG9uLmZhLXNxdWFyZS1vJyk7XG4gICAgICAgICAgICBleHBlY3QoaGVhZGVyLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoaGVhZGVyWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQ2hlY2tib3hNZW51RGlzcGxheWVkKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBtZW51ID0gZWxlbWVudC5maW5kKCd0aGVhZCB0aC5jaGVja2JveC1jb2wgc3BhbicpO1xuICAgICAgICAgICAgZXhwZWN0KG1lbnUubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChtZW51WzBdKS5oYXNDbGFzcygnb3BlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXQoJ2lzIGF0dGFjaGVkIHRvIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5jaGVja2JveCA9IGNoZWNrYm94O1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgZXhwZWN0KGNoZWNrYm94LmF0dGFjaCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgYXR0YWNoZWQgdG8gY29udHJvbGxlciB3aGVuIHNldCBhZnRlciBjb25zdHJ1Y3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIGV4cGVjdChjaGVja2JveC5hdHRhY2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAkc2NvcGUuY2hlY2tib3ggPSBjaGVja2JveDtcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICBleHBlY3QoY2hlY2tib3guYXR0YWNoKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdpcyBkaXNwbGF5ZWQgd2hlbiBwcm92aWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmNoZWNrYm94ID0gY2hlY2tib3g7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICBleHBlY3QoaGFzQ2hlY2tib3goZWxlbWVudCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdpcyBoaWRkZW4gd2hlbiBub3QgcHJvdmlkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIGV4cGVjdChoYXNDaGVja2JveChlbGVtZW50KSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhbGxvd3MgdG9nZ2xpbmcgdGhlIG1lbnUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5jaGVja2JveCA9IGNoZWNrYm94O1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgbGV0IGNoZWNrYm94SGVhZGVyID0gZ2V0Q2hlY2tib3hIZWFkZXIoZWxlbWVudCk7XG4gICAgICAgICAgICBleHBlY3QoaXNDaGVja2JveE1lbnVEaXNwbGF5ZWQoZWxlbWVudCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgY2hlY2tib3hIZWFkZXIuY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdChpc0NoZWNrYm94TWVudURpc3BsYXllZChlbGVtZW50KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVmcmVzaCB0cmlnZ2VyIGNhbGxzIGl0ZW1zRnVuYyB3aGVuIHJlZnJlc2hpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRyaWdnZXIgPSBuZXcgRGF0YVJlZnJlc2hUcmlnZ2VyKCk7XG4gICAgICAgICRzY29wZS5yZWZyZXNoVHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcblxuICAgICAgICAkc2NvcGUuaXRlbXNGdW5jLmNhbGxzLnJlc2V0KCk7XG4gICAgICAgIHRyaWdnZXIucmVmcmVzaCgpO1xuICAgICAgICBleHBlY3QoJHNjb3BlLml0ZW1zRnVuYykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NlY3Rpb25IZWFkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGNoZWNrYm94ID0ge1xuICAgICAgICAgICAgYXR0YWNoOiBqYXNtaW5lLmNyZWF0ZVNweSgnYXR0YWNoJyksXG4gICAgICAgICAgICB0b2dnbGVHcm91cDogamFzbWluZS5jcmVhdGVTcHkoJ3RvZ2dsZUdyb3VwJylcbiAgICAgICAgfSwgUmVzdWx0R3JvdXA7XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF9SZXN1bHRHcm91cF8pID0+IHtcbiAgICAgICAgICAgICRzY29wZS5jaGVja2JveCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIFJlc3VsdEdyb3VwID0gX1Jlc3VsdEdyb3VwXztcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkRWxlbWVudFdpdGhTZWN0aW9uSGVhZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuICc8c3AtZGF0YS10YWJsZSBzcC1pdGVtcy1mdW5jPVwiaXRlbXNGdW5jKHN0YXJ0SWR4LCBpdGVtc1BlclBhZ2UsIGZpbHRlclZhbHVlcywgc29ydE9yZGVyKVwiICcgK1xuICAgICAgICAgICAgICAgICdzcC1jb2x1bW4tY29uZmlnLWtleT1cInNvbWVDb2x1bW5zXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLXNlY3Rpb24taGVhZGVyPVwic3RhdHVzXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLWNoZWNrYm94LW11bHRpc2VsZWN0PVwiY2hlY2tib3hcIicgK1xuICAgICAgICAgICAgICAgICcvPic7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzZWN0aW9uIGhlYWRlcnMgd2l0aCBjb3JyZWN0IHRleHQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoYnVpbGRFbGVtZW50V2l0aFNlY3Rpb25IZWFkZXIoKSk7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbkhlYWRlcnMgPSBlbGVtZW50LmZpbmQoJ3RyLnNlY3Rpb24taGVhZGVyLXJvdycpO1xuICAgICAgICAgICAgZXhwZWN0KHNlY3Rpb25IZWFkZXJzLmxlbmd0aCkudG9FcXVhbCgyKTtcblxuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChzZWN0aW9uSGVhZGVyc1swXSkudGV4dCgpLnRyaW0oKSkudG9FcXVhbChpdGVtc1swXS5zdGF0dXMpO1xuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChzZWN0aW9uSGVhZGVyc1sxXSkudGV4dCgpLnRyaW0oKSkudG9FcXVhbChpdGVtc1sxXS5zdGF0dXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHNlY3Rpb24gaGVhZGVyIGlmIHNwU2VjdGlvbkhlYWRlciBpcyB1bmRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uSGVhZGVycyA9IGVsZW1lbnQuZmluZCgndHIuc2VjdGlvbi1oZWFkZXItcm93Jyk7XG4gICAgICAgICAgICBleHBlY3Qoc2VjdGlvbkhlYWRlcnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHNob3cgc2VjdGlvbiBoZWFkZXIgaW4gY29ycmVjdCByb3dzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGJ1aWxkRWxlbWVudFdpdGhTZWN0aW9uSGVhZGVyKCkpO1xuICAgICAgICAgICAgbGV0IHJvd3MgPSBlbGVtZW50LmZpbmQoJ3RyJyk7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbkhlYWRlciA9IGFuZ3VsYXIuZWxlbWVudChyb3dzWzFdKTtcbiAgICAgICAgICAgIGV4cGVjdChzZWN0aW9uSGVhZGVyLmhhc0NsYXNzKCdzZWN0aW9uLWhlYWRlci1yb3cnKSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgICAgICAgbGV0IHNlY3Rpb25IZWFkZXIyID0gYW5ndWxhci5lbGVtZW50KHJvd3NbM10pO1xuICAgICAgICAgICAgZXhwZWN0KHNlY3Rpb25IZWFkZXIyLmhhc0NsYXNzKCdzZWN0aW9uLWhlYWRlci1yb3cnKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzaG93IGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLmNoZWNrYm94ID0gY2hlY2tib3g7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGJ1aWxkRWxlbWVudFdpdGhTZWN0aW9uSGVhZGVyKCkpO1xuICAgICAgICAgICAgbGV0IHJvd3MgPSBlbGVtZW50LmZpbmQoJ3RyLnNlY3Rpb24taGVhZGVyLXJvdycpLFxuICAgICAgICAgICAgICAgIHNlY3Rpb25IZWFkZXJDaGVja2JveCA9IGFuZ3VsYXIuZWxlbWVudChyb3dzWzBdKS5maW5kKCcuY2hlY2tib3gtY29sLmJnLXNlY3Rpb24taGVhZGVyJyk7XG4gICAgICAgICAgICBleHBlY3Qoc2VjdGlvbkhlYWRlckNoZWNrYm94Lmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0b2dnbGUgZ3JvdXAgc2VsZWN0aW9uIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS5jaGVja2JveCA9IGNoZWNrYm94O1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChidWlsZEVsZW1lbnRXaXRoU2VjdGlvbkhlYWRlcigpKTtcbiAgICAgICAgICAgIGxldCByb3dzID0gZWxlbWVudC5maW5kKCd0ci5zZWN0aW9uLWhlYWRlci1yb3cnKSxcbiAgICAgICAgICAgICAgICBzZWN0aW9uSGVhZGVyQ2hlY2tib3ggPSBhbmd1bGFyLmVsZW1lbnQocm93c1swXSkuZmluZCgnLmNoZWNrYm94LWNvbC5iZy1zZWN0aW9uLWhlYWRlcicpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbiA9IGFuZ3VsYXIuZWxlbWVudChzZWN0aW9uSGVhZGVyQ2hlY2tib3hbMF0pLmZpbmQoJ2J1dHRvbi5jaGVja2JveC1idG4nKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChidXR0b24pLmNsaWNrKCk7XG4gICAgICAgICAgICBleHBlY3QoY2hlY2tib3gudG9nZ2xlR3JvdXApLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGxldCBhcmdzID0gY2hlY2tib3gudG9nZ2xlR3JvdXAuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XG4gICAgICAgICAgICBleHBlY3QoYXJnc1swXSkudG9FcXVhbChuZXcgUmVzdWx0R3JvdXAoZ3JvdXBzWzBdKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3JvdyBzZWxlY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHJvd1NlbGVjdGlvbkZ1bmNOYW1lID0gJ3Jvd1NlbGVjdGlvbkZ1bmMnO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkRWxlbWVudFN0cmluZyhyb3dTZWxlY3Rpb25GdW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gJzxzcC1kYXRhLXRhYmxlIHNwLWl0ZW1zLWZ1bmM9XCJpdGVtc0Z1bmMoc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgZmlsdGVyVmFsdWVzLCBzb3J0T3JkZXIpXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLWNvbHVtbi1jb25maWcta2V5PVwic29tZUNvbHVtbnNcIiAnICtcbiAgICAgICAgICAgICAgICAnc3AtY2hlY2tib3gtbXVsdGlzZWxlY3Q9XCJtdWx0aVNlbGVjdFwiICcgK1xuICAgICAgICAgICAgICAgIChyb3dTZWxlY3Rpb25GdW5jID8gJ3NwLW9uLXJvdy1zZWxlY3Rpb24tZnVuYz1cIicgKyByb3dTZWxlY3Rpb25GdW5jICsgJyhpdGVtKVwiICcgOiAnJykgKyAnLz4nO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5tdWx0aXNlbGVjdCA9IHt9O1xuICAgICAgICAgICAgc3B5T24oY29sdW1uQ29uZmlnc1s0XSwgJ2lzRml4ZWRSaWdodCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHJvdyBzZWxlY3Rpb24gZnVuYyB3aGVuIG5vcm1hbCBjZWxsIGlzIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGVbcm93U2VsZWN0aW9uRnVuY05hbWVdID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoYnVpbGRFbGVtZW50U3RyaW5nKHJvd1NlbGVjdGlvbkZ1bmNOYW1lKSk7XG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoJ3RyLm5vcm1hbC1yb3cgPiB0ZCcpLmNsaWNrKCk7XG4gICAgICAgICAgICBleHBlY3QoJHNjb3BlW3Jvd1NlbGVjdGlvbkZ1bmNOYW1lXSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbXNbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgcm93IHNlbGVjdGlvbiBmdW5jIHdoZW4gbm9ybWFsIGNlbGwgaXMgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZVtyb3dTZWxlY3Rpb25GdW5jTmFtZV0gPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChidWlsZEVsZW1lbnRTdHJpbmcocm93U2VsZWN0aW9uRnVuY05hbWUpKTtcbiAgICAgICAgICAgIGVsZW1lbnQuZmluZCgndHIubm9ybWFsLXJvdyA+IHRkLm5vcm1hbC1jb2wnKS5jbGljaygpO1xuICAgICAgICAgICAgZXhwZWN0KCRzY29wZVtyb3dTZWxlY3Rpb25GdW5jTmFtZV0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCByb3cgc2VsZWN0aW9uIGZ1bmMgd2hlbiBjaGVja2JveCBjZWxsIGlzIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGVbcm93U2VsZWN0aW9uRnVuY05hbWVdID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoYnVpbGRFbGVtZW50U3RyaW5nKHJvd1NlbGVjdGlvbkZ1bmNOYW1lKSk7XG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoJ3RyLm5vcm1hbC1yb3cgPiB0ZC5jaGVja2JveC1jb2wnKS5jbGljaygpO1xuICAgICAgICAgICAgZXhwZWN0KCRzY29wZVtyb3dTZWxlY3Rpb25GdW5jTmFtZV0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgcm93IHNlbGVjdGlvbiBmdW5jIHdoZW4gZmxvYXRpbmcgY2VsbCBpcyBzZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlW3Jvd1NlbGVjdGlvbkZ1bmNOYW1lXSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGJ1aWxkRWxlbWVudFN0cmluZyhyb3dTZWxlY3Rpb25GdW5jTmFtZSkpO1xuICAgICAgICAgICAgZWxlbWVudC5maW5kKCd0ci5ub3JtYWwtcm93ID4gdGQuY29sLWZpeGVkLXJpZ2h0JykuY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGVbcm93U2VsZWN0aW9uRnVuY05hbWVdKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdleHBhbmRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBidWlsZEVsZW1lbnRTdHJpbmcodGVtcGxhdGVVcmwsIGV4cGFuZGVyRnVuY05hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnPHNwLWRhdGEtdGFibGUgc3AtaXRlbXMtZnVuYz1cIml0ZW1zRnVuYyhzdGFydElkeCwgaXRlbXNQZXJQYWdlLCBmaWx0ZXJWYWx1ZXMsIHNvcnRPcmRlcilcIiAnICtcbiAgICAgICAgICAgICAgICAnc3AtY29sdW1uLWNvbmZpZy1rZXk9XCJzb21lQ29sdW1uc1wiICcgK1xuICAgICAgICAgICAgICAgIChleHBhbmRlckZ1bmNOYW1lID8gJ3NwLWlzLWV4cGFuZGVkLWZ1bmM9XCInICsgZXhwYW5kZXJGdW5jTmFtZSArICcoaXRlbSlcIiAnIDogJycpICtcbiAgICAgICAgICAgICAgICAodGVtcGxhdGVVcmwgPyAnc3AtZXhwYW5kZXItdGVtcGxhdGUtdXJsPVwiJyArIHRlbXBsYXRlVXJsICsgJ1wiICcgOiAnJykgK1xuICAgICAgICAgICAgICAgICcvPic7XG4gICAgICAgIH1cblxuICAgICAgICBkZXNjcmliZSgnY29uZmlndXJhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGV4cGFuZGVyRnVuY05hbWUgPSAnZG9lc05vdEFjdHVhbGx5SGF2ZVRvRXhpc3QnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsID0gJ3NvbWUvcGF0aC90b1NvbWV0aGluZy5odG1sJztcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyBpZiBzcElzRXhwYW5kZWRGdW5jIGlzIGRlZmluZWQgYW5kIHNwRXhwYW5kZXJUZW1wbGF0ZVVybCBpcyBub3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFN0cmluZyA9IGJ1aWxkRWxlbWVudFN0cmluZyhleHBhbmRlckZ1bmNOYW1lKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZWxlbWVudFN0cmluZyk7XG4gICAgICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgc3BFeHBhbmRlclRlbXBsYXRlVXJsIGlzIGRlZmluZWQgYW5kIHNwSXNFeHBhbmRlZEZ1bmMgaXMgbm90JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRTdHJpbmcgPSBidWlsZEVsZW1lbnRTdHJpbmcodGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChlbGVtZW50U3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgaWYgYm90aCBzcEV4cGFuZGVyVGVtcGxhdGVVcmwgYW5kIHNwSXNFeHBhbmRlZEZ1bmMgYXJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFN0cmluZyA9IGJ1aWxkRWxlbWVudFN0cmluZyh0ZW1wbGF0ZVVybCwgZXhwYW5kZXJGdW5jTmFtZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGVsZW1lbnRTdHJpbmcpO1xuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgaWYgbmVpdGhlciBzcEV4cGFuZGVyVGVtcGxhdGVVcmwgbm9yIHNwSXNFeHBhbmRlZEZ1bmMgYXJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFN0cmluZyA9IGJ1aWxkRWxlbWVudFN0cmluZygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChlbGVtZW50U3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCd0b2dnbGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlVXJsID0gJ3BhdGgvdG8vdGVtcGxhdGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgaXNFeHBhbmRlZEZ1bmNOYW1lID0gJ2lzRXhwYW5kZWRGdW5jdGlvbic7XG4gICAgICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCh0ZW1wbGF0ZVVybCwgJzxkaXYgY2xhc3M9XCJleHBhbmRlZFJvd0NsYXNzXCI+e3tpdGVtLm5hbWV9fTwvZGl2PicpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZXhwYW5kZXIgdGVtcGxhdGUgd2hlbiBub3QgZXhwYW5kZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGVbaXNFeHBhbmRlZEZ1bmNOYW1lXSA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGJ1aWxkRWxlbWVudFN0cmluZyh0ZW1wbGF0ZVVybCwgaXNFeHBhbmRlZEZ1bmNOYW1lKSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCRzY29wZVtpc0V4cGFuZGVkRnVuY05hbWVdKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmV4cGFuZGVkUm93Q2xhc3MnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVzY3JpYmUoJ2V4cGFuZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR3aW5kb3c7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9ICdpdGVtVHdvJztcblxuICAgICAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kd2luZG93Xykge1xuICAgICAgICAgICAgICAgICAgICAkd2luZG93ID0gXyR3aW5kb3dfO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGVbaXNFeHBhbmRlZEZ1bmNOYW1lXSA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLm5hbWUgPT09IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGJ1aWxkRWxlbWVudFN0cmluZyh0ZW1wbGF0ZVVybCwgaXNFeHBhbmRlZEZ1bmNOYW1lKSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RXhwYW5kZWRSb3coKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmZpbmQoJy5leHBhbmRlZC1yb3cnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHJlbmRlciBleHBhbmRlciB0ZW1wbGF0ZSB3aGVuIGV4cGFuZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBleHBhbmRlZEVsZW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoJHNjb3BlW2lzRXhwYW5kZWRGdW5jTmFtZV0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWRFbGVtZW50cyA9IGVsZW1lbnQuZmluZCgnLmV4cGFuZGVkUm93Q2xhc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGV4cGFuZGVkRWxlbWVudHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoZXhwYW5kZWRFbGVtZW50c1swXS5pbm5lckhUTUwpLnRvRXF1YWwobmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHJlc2l6ZSBpZiB0aGUgZXhwYW5kZWQgcm93IGhlaWdodCBjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkb2N1bWVudCA9ICR3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRlZEVsZW1lbnRzLCBleHBhbmRlZFJvdywgb3JpZ2luYWxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb25nU3RyaW5nID0gJ3NvbWUgdGV4dCB0aGF0IGlzIHJlYWxseSBsb25nIGFuZCB3aWxsIGNhdXNlIHRoZSBkaXYgdG8gd3JhcCBhIGZldyB0aW1lcyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2Ugd2lsbCBzZWUgd2hhdCBoYXBwZW5zIEkgaG9wZSB0aGlzIHdvcmtzIGJlY2F1c2UgaSBhbSB0aXJlZCBvZiB0cnlpbmcgZGlmZmVyZW50IHRoaW5ncy4nO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3B5T24oY29sdW1uQ29uZmlnc1s0XSwgJ2lzRml4ZWRSaWdodCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRlZFJvdyA9IGdldEV4cGFuZGVkUm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRlZEVsZW1lbnRzID0gZWxlbWVudC5maW5kKCcuZXhwYW5kZWQtY29udGVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGV4cGFuZGVkRWxlbWVudHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxIZWlnaHQgPSBleHBhbmRlZFJvdy5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkUm93LmFwcGVuZCgnPGRpdj4nICsgbG9uZ1N0cmluZyArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkUm93ID0gZ2V0RXhwYW5kZWRSb3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChleHBhbmRlZFJvdy5oZWlnaHQoKSkubm90LnRvRXF1YWwob3JpZ2luYWxIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3JpZ2h0IGZpeGVkIGNvbHVtbicsICgpID0+IHtcbiAgICAgICAgbGV0ICR3aW5kb3c7XG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJHdpbmRvd18pID0+IHtcbiAgICAgICAgICAgICR3aW5kb3cgPSBfJHdpbmRvd187XG4gICAgICAgICAgICBzcHlPbihjb2x1bW5Db25maWdzWzRdLCAnaXNGaXhlZFJpZ2h0JykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3NldHMgc3R5bGVzIG9uIGZpeGVkIGNvbHVtbiBpZiB0aGVyZSBpcyBvbmUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29sdW1uRWxlbWVudHMsIHRhYmxlRWxlbWVudCwgb3ZlcmxhcEVsZW1lbnQ7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KCk7XG5cbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHdhdGNoZXIgZmlyZVxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgLy8gZmx1c2ggaXQgb3V0XG4gICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuXG4gICAgICAgICAgICBjb2x1bW5FbGVtZW50cyA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJy5ub3JtYWwtY29sLmNvbC1maXhlZC1yaWdodCcpKTtcbiAgICAgICAgICAgIHRhYmxlRWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJy50YWJsZS1maXhlZC1yaWdodCcpKTtcbiAgICAgICAgICAgIG92ZXJsYXBFbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQuZmluZCgnLmRhdGEtdGFibGUtb3ZlcmxhcCcpKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCBmaXhlZCBjbGFzc2VzIGFyZSBhZGRlZCB0byBlbGVtZW50c1xuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbkVsZW1lbnRzLmxlbmd0aCA+IDApLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QodGFibGVFbGVtZW50Lmxlbmd0aCA+IDApLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3Qob3ZlcmxhcEVsZW1lbnQubGVuZ3RoID4gMCkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCBzb21lIHN0eWxlcyBhcmUgc2V0XG4gICAgICAgICAgICBleHBlY3QodGFibGVFbGVtZW50WzBdLnN0eWxlLm1hcmdpblJpZ2h0KS5ub3QudG9FcXVhbCgnJyk7XG4gICAgICAgICAgICBjb2x1bW5FbGVtZW50cy5lYWNoKChpZHgsIGVsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChlbHQuc3R5bGUud2lkdGgpLm5vdC50b0VxdWFsKCcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KG92ZXJsYXBFbGVtZW50WzBdLnN0eWxlLmJvdHRvbSkubm90LnRvRXF1YWwoJycpO1xuICAgICAgICAgICAgZXhwZWN0KG92ZXJsYXBFbGVtZW50WzBdLnN0eWxlLnJpZ2h0KS5ub3QudG9FcXVhbCgnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjb3JyZWN0cyBoZWlnaHQgaWYgdGFibGUgaGVpZ2h0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmlyc3RDZWxsLCBmaXhlZENlbGwsIG9yaWdpbmFsSGVpZ2h0O1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kKGVsZW1lbnQpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgICAgICAgICBmaXJzdENlbGwgPSBlbGVtZW50LmZpbmQoJ3RyOmZpcnN0LW9mLXR5cGUgdGQ6Zmlyc3Qtb2YtdHlwZScpO1xuICAgICAgICAgICAgICAgIGZpeGVkQ2VsbCA9IGVsZW1lbnQuZmluZCgndHI6Zmlyc3Qtb2YtdHlwZSB0ZC5jb2wtZml4ZWQtcmlnaHQnKTtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEhlaWdodCA9IGZpeGVkQ2VsbFswXS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBoZWlnaHQgdG8gc29tZXRoaW5nIHdlaXJkLlxuICAgICAgICAgICAgICAgIGZpeGVkQ2VsbC5jc3MoJ2hlaWdodCcsIDQwMCk7XG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBub24tZml4ZWQgY2VsbCB0ZXh0IHRvIHNvbWV0aGluZyBsYXJnZSB0aGF0IHdpbGwgaW5jcmVhc2UgaGVpZ2h0XG4gICAgICAgICAgICAgICAgZmlyc3RDZWxsWzBdLmlubmVyVGV4dCA9ICdhc2ZhZHNmZGFzIGZhZHMgZmFkcyBmIGRhc2YgYWRzIGZhZHMgZiBhZHNmIGFkIHNmIGFzZGYgYSBkc2YgYWRzIGYgYXNkZicgK1xuICAgICAgICAgICAgICAgICAgICAnIGFzZGYgYXNkZiBhZHNmIGFzIGRmIGFzZGYgYXNkZiBhZHNmIGFkc2YgYWRzZiBhZHNmIGFkc2YgYWRzZiBhZHNmIGFkc2YgYWRzZiBhZHNmYScgK1xuICAgICAgICAgICAgICAgICAgICAnYWRzZmFzZGZhc2RmIGFzZGYgYXNkZiBhZHMgZmFkcyBmYWRzIGZhZHNmIGFkc2YgYWRzZmFkc2ZhZHNmYWRzZmFkc2ZhZHNmYXNkZic7XG4gICAgICAgICAgICAgICAgLy8gRG91YmxlIGRpZ2VzdCB0byB0cmlnZ2VyIHdhdGNoIGFuZCB0aGVuIGFzeW5jIGFwcGx5XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAvLyBOb3cgdGhleSBzaG91bGQgbWF0Y2hcbiAgICAgICAgICAgICAgICBleHBlY3QoZml4ZWRDZWxsWzBdLnNjcm9sbEhlaWdodCkudG9FcXVhbChmaXJzdENlbGxbMF0uc2Nyb2xsSGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc3BJbmNsdWRlWHMnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdpbmNsdWRlcyB4cyB0YWJsZSBpZiB0cnVlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRlZiA9ICc8c3AtZGF0YS10YWJsZSBzcC1pdGVtcy1mdW5jPVwiaXRlbXNGdW5jKHN0YXJ0SWR4LCBpdGVtc1BlclBhZ2UsIGZpbHRlclZhbHVlcywgc29ydE9yZGVyKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAnc3AtY29sdW1uLWNvbmZpZy1rZXk9XCJzb21lQ29sdW1uc1wiICcgK1xuICAgICAgICAgICAgICAgICAgICAnc3Atc2VhcmNoLWRhdGE9XCJzZWFyY2hEYXRhXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICdzcC1wYWdpbmctZGF0YT1cInBhZ2luZ0RhdGFcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3NwLXJlZnJlc2gtdHJpZ2dlcj1cInJlZnJlc2hUcmlnZ2VyXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICdzcC1jaGVja2JveC1tdWx0aXNlbGVjdD1cImNoZWNrYm94XCIgJyArXG4gICAgICAgICAgICAgICAgICAgICdzcC1pbmNsdWRlLXhzPVwidHJ1ZVwiIC8+JztcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmKTtcblxuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnZGl2LnZpc2libGUteHMnKS5sZW5ndGgpLm5vdC50b0VxdWFsKDApO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnZGl2LmhpZGRlbi14cycpLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdleGNsdWRlcyB4cyB0YWJsZSBpZiBmYWxzZScsICgpID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ2Rpdi52aXNpYmxlLXhzJykubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnZGl2LmhpZGRlbi14cycpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgc2VjdGlvbiBoZWFkZXJzIGlmIHRhYmxlQ29uZmlnLmdyb3VwQnlDb2x1bW4gaXMgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRlZiA9ICc8c3AtZGF0YS10YWJsZSBzcC1pdGVtcy1mdW5jPVwiaXRlbXNGdW5jKHN0YXJ0SWR4LCBpdGVtc1BlclBhZ2UsIGZpbHRlclZhbHVlcywgc29ydE9yZGVyKVwiICcgK1xuICAgICAgICAgICAgICAgICdzcC10YWJsZS1jb25maWc9XCJ0YWJsZUNvbmZpZ1wiIC8+JztcblxuICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSBuZXcgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnKHtcbiAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogc29tZUNvbHVtbkNvbmZpZ0tleSxcbiAgICAgICAgICAgIGdyb3VwQnlDb2x1bW46ICdzdGF0dXMnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmKTtcblxuICAgICAgICAvLyB0aGVyZSBzaG91bGQgYmUgc2VjdGlvbiBoZWFkZXIgcm93cyBmb3IgZWFjaCBzdGF0dXMgdmFsdWU6IE9wZW4sIENsb3NlZC5cbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLnNlY3Rpb24taGVhZGVyLXJvdycpLmxlbmd0aCkudG9CZSgyKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzcFRhYmxlQ29uZmlnJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVmID0gJzxzcC1kYXRhLXRhYmxlIHNwLWl0ZW1zLWZ1bmM9XCJpdGVtc0Z1bmMoc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgZmlsdGVyVmFsdWVzLCBzb3J0T3JkZXIpXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLXRhYmxlLWNvbmZpZz1cInRhYmxlQ29uZmlnXCIgLz4nLFxuICAgICAgICAgICAgdGVzdENvbHVtbkNvbmZpZ0tleSA9ICd0ZXN0Q29sdW1uQ29uZmlnS2V5JyxcbiAgICAgICAgICAgIHRlc3RDaGVja2JveCA9IHtcbiAgICAgICAgICAgICAgICBhdHRhY2g6IGphc21pbmUuY3JlYXRlU3B5KCdhdHRhY2gnKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IG5ldyBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcoe1xuICAgICAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogdGVzdENvbHVtbkNvbmZpZ0tleSxcbiAgICAgICAgICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0OiB0ZXN0Q2hlY2tib3hcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChkZWYpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGlmIHRhYmxlQ29uZmlnIGlzIG5vdCBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgdGFibGVDb25maWcgaXMgbm90IGluc3RhbmNlIG9mIERhdGFUYWJsZURpcmVjdGl2ZUNvbmZpZycsICgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdXNlIHRhYmxlQ29uZmlnIGRlZmluZWQgY29sdW1uIGNvbmZpZyBrZXknLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoY29uZmlnU2VydmljZS5nZXRDb2x1bW5Db25maWdFbnRyaWVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0ZXN0Q29sdW1uQ29uZmlnS2V5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB1c2UgdGFibGVDb25maWcgZGVmaW5lZCBwYWdpbmcgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNwYWdlLXNpemUtZHJvcGRvd24tdG9nZ2xlJykudGV4dCgpLnRyaW0oKSkudG9Db250YWluKCcxMCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHVzZSB0YWJsZUNvbmZpZyBkZWZpbmVkIHJlZnJlc2hUcmlnZ2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRyaWdnZXIgPSAkc2NvcGUudGFibGVDb25maWcuZ2V0UmVmcmVzaFRyaWdnZXIoKTtcbiAgICAgICAgICAgIHRyaWdnZXIucmVmcmVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5pdGVtc0Z1bmMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB1c2UgdGFibGVDb25maWcgZGVmaW5lZCBjaGVja2JveCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Q2hlY2tib3guYXR0YWNoKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuY2hlY2tib3gtY29sJykubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdXBkYXRlIHNlY3Rpb24gaGVhZGVyIHdoZW4gdGFibGUgY29uZmlnIGdyb3VwQnlDb2x1bW4gY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IG5ldyBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcoe1xuICAgICAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogc29tZUNvbHVtbkNvbmZpZ0tleSxcbiAgICAgICAgICAgICAgICBncm91cEJ5Q29sdW1uOiAnbmFtZSdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuJCRjaGlsZEhlYWQuZGF0YVRhYmxlQ3RybC5zcFNlY3Rpb25IZWFkZXIpLnRvRXF1YWwoJ25hbWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiB0YWJsZSBjb25maWcgY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhbm90aGVyVGVzdENvbHVtbkNvbmZpZ0tleSA9ICdhbm90aGVyVGVzdENvbHVtbkNvbmZpZ0tleSc7XG5cbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IG5ldyBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcoe1xuICAgICAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogYW5vdGhlclRlc3RDb2x1bW5Db25maWdLZXlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcucGFnZVN0YXRlLnBhZ2luZ0RhdGEuaXRlbXNQZXJQYWdlID0gMjA7XG5cbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZ1NlcnZpY2UuZ2V0Q29sdW1uQ29uZmlnRW50cmllcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoYW5vdGhlclRlc3RDb2x1bW5Db25maWdLZXkpO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhZ2Utc2l6ZS1kcm9wZG93bi10b2dnbGUnKS50ZXh0KCkudHJpbSgpKS50b0NvbnRhaW4oJzIwJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGlkZSBmb290ZXIgYmFzZWQgb24gY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSBuZXcgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWdLZXk6IHNvbWVDb2x1bW5Db25maWdLZXksXG4gICAgICAgICAgICAgICAgaGlkZUZvb3RlcjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLnBhbmVsLWZvb3RlcicpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZmlsdGVyIHBhbmVsJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVmID0gJzxzcC1kYXRhLXRhYmxlIHNwLWl0ZW1zLWZ1bmM9XCJpdGVtc0Z1bmMoc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgZmlsdGVyVmFsdWVzLCBzb3J0T3JkZXIpXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLXRhYmxlLWNvbmZpZz1cInRhYmxlQ29uZmlnXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLXJlZnJlc2gtdHJpZ2dlcj1cInJlZnJlc2hUcmlnZ2VyXCIgLz4nLFxuICAgICAgICAgICAgdGVzdENvbHVtbkNvbmZpZ0tleSA9ICd0ZXN0Q29sdW1uQ29uZmlnS2V5JztcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IG5ldyBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcoe1xuICAgICAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogdGVzdENvbHVtbkNvbmZpZ0tleSxcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiAkc2NvcGUuZmlsdGVyc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcuaGVhZGVyRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcuZmlsdGVyVGl0bGUgPSAndGVzdFRpdGxlJztcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIHBvcHVsYXRlZCB0aGUgZmlsdGVyIHBhbmVsIHRpdGxlJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmZpbHRlci1wYW5lbC10aXRsZSBoNScpLnRleHQoKSkudG9FcXVhbCgndGVzdFRpdGxlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBwb3B1bGF0ZWQgdGhlIGZpbHRlcnMgaW4gZmlsdGVyR3JvdXBzJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmZpbHRlci1pdGVtJykubGVuZ3RoKS50b0JlKDMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZGlzYWJsZWQgYXBwbHkgZmlsdGVyIGJ1dHRvbicsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNmaWx0ZXJQYW5lbEFwcGx5QnRuJykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBub24gZGlzYWJsZWQgZmlsdGVyIGJ1dHRvbnMgYWZ0ZXIgaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5wdXRGaWVsZCA9IGVsZW1lbnQuZmluZCgnI2ZpbHRlclBhbmVsSXRlbTEnKTtcbiAgICAgICAgICAgIGlucHV0RmllbGQudmFsKCcxMjMnKTtcbiAgICAgICAgICAgIGlucHV0RmllbGQudHJpZ2dlcignaW5wdXQnKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNmaWx0ZXJQYW5lbENsZWFyQnRuJykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI2ZpbHRlclBhbmVsQXBwbHlCdG4nKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkudG9CZShmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmVzZXQgYWZ0ZXIgaGl0dGluZyB0aGUgY2xlYXIgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmZpbHRlci1pdGVtJykubGVuZ3RoKS50b0JlKDMpO1xuICAgICAgICAgICAgbGV0IGlucHV0RmllbGQgPSBlbGVtZW50LmZpbmQoJyNmaWx0ZXJQYW5lbEl0ZW0xJyk7XG4gICAgICAgICAgICBpbnB1dEZpZWxkLnZhbCgnMTIzJyk7XG4gICAgICAgICAgICBpbnB1dEZpZWxkLnRyaWdnZXIoJ2lucHV0Jyk7XG4gICAgICAgICAgICBleHBlY3QoaW5wdXRGaWVsZC52YWwoKSkudG9FcXVhbCgnMTIzJyk7XG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoJyNmaWx0ZXJQYW5lbENsZWFyQnRuJykuY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdChpbnB1dEZpZWxkLnZhbCgpKS50b0VxdWFsKCcnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNhbGxlZCB0aGUgc2VhcmNoIGZ1bmN0aW9uIGFmdGVyIGFwcGx5aW5nIGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuZmlsdGVyLWl0ZW0nKS5sZW5ndGgpLnRvQmUoMyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRGaWVsZCA9IGVsZW1lbnQuZmluZCgnI2ZpbHRlclBhbmVsSXRlbTEnKTtcbiAgICAgICAgICAgIGlucHV0RmllbGQudmFsKCcxMjMnKTtcbiAgICAgICAgICAgIGlucHV0RmllbGQudHJpZ2dlcignaW5wdXQnKTtcbiAgICAgICAgICAgIHNweU9uKCRzY29wZS4kJGNoaWxkSGVhZC5kYXRhVGFibGVDdHJsLCAnc2VhcmNoJyk7XG4gICAgICAgICAgICBleHBlY3QoJHNjb3BlLiQkY2hpbGRIZWFkLmRhdGFUYWJsZUN0cmwuc2VhcmNoKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZWxlbWVudC5maW5kKCcjZmlsdGVyUGFuZWxBcHBseUJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoJyNmaWx0ZXJQYW5lbEFwcGx5QnRuJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuJCRjaGlsZEhlYWQuZGF0YVRhYmxlQ3RybC5zZWFyY2gpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGEgZ3JlZW4gZmlsdGVyIGJ1dHRvbiBhZnRlciBhcHBseWluZyBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhbmVsRmlsdGVyQnRuJykuaGFzQ2xhc3MoJ2J0bi13aGl0ZScpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhbmVsRmlsdGVyQnRuJykuaGFzQ2xhc3MoJ2J0bi1zdWNjZXNzJykpLnRvQmUoZmFsc2UpO1xuXG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuZmlsdGVyLWl0ZW0nKS5sZW5ndGgpLnRvQmUoMyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRGaWVsZCA9IGVsZW1lbnQuZmluZCgnI2ZpbHRlclBhbmVsSXRlbTEnKTtcbiAgICAgICAgICAgIGlucHV0RmllbGQudmFsKCcxMjMnKTtcbiAgICAgICAgICAgIGlucHV0RmllbGQudHJpZ2dlcignaW5wdXQnKTtcblxuICAgICAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnLnBhZ2VTdGF0ZS5zZWFyY2hEYXRhLmhhc0ZpbHRlclZhbHVlcyA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZWxlbWVudC5maW5kKCcjZmlsdGVyUGFuZWxBcHBseUJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoJyNmaWx0ZXJQYW5lbEFwcGx5QnRuJykudHJpZ2dlcignY2xpY2snKTtcblxuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhbmVsRmlsdGVyQnRuJykuaGFzQ2xhc3MoJ2J0bi13aGl0ZScpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNwYW5lbEZpbHRlckJ0bicpLmhhc0NsYXNzKCdidG4tc3VjY2VzcycpKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgdGhlIGNoZXZyb24gZGlzcGxheWVkIGNvcnJlY3RseSBkZXBlbmRpbmcgb24gaWYgcGFuZWwgaXMgY29sbGFwc2VkIG9yIG5vdCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNwYW5lbEZpbHRlckJ0biAuZmEtY2hldnJvbi1kb3duJykuaGFzQ2xhc3MoJ3Vucm90YXRlJykpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjcGFuZWxGaWx0ZXJCdG4gLmZhLWNoZXZyb24tZG93bicpLmhhc0NsYXNzKCdyb3RhdGUnKSkudG9CZShmYWxzZSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnI3BhbmVsRmlsdGVyQnRuJykuY2xpY2soKTtcbiAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnI3BhbmVsRmlsdGVyQnRuJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICRzY29wZS4kJGNoaWxkSGVhZC5kYXRhVGFibGVDdHJsLmZpbHRlcnNEaXNwbGF5ZWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhbmVsRmlsdGVyQnRuIC5mYS1jaGV2cm9uLWRvd24nKS5oYXNDbGFzcygndW5yb3RhdGUnKSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjcGFuZWxGaWx0ZXJCdG4gLmZhLWNoZXZyb24tZG93bicpLmhhc0NsYXNzKCdyb3RhdGUnKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3NwRGF0YVRhYmxlSGVhZGluZycsICgpID0+IHtcbiAgICAgICAgbGV0ICR3aW5kb3csXG4gICAgICAgICAgICBkZWYgPSAnPGRpdj48ZGl2IGNsYXNzPVwicGFuZWxcIj4nICtcbiAgICAgICAgICAgICAgICAnPHNwLWRhdGEtdGFibGUgc3AtaXRlbXMtZnVuYz1cIml0ZW1zRnVuYyhzdGFydElkeCwgaXRlbXNQZXJQYWdlLCBmaWx0ZXJWYWx1ZXMsIHNvcnRPcmRlcilcIiAnICtcbiAgICAgICAgICAgICAgICAnc3AtdGFibGUtY29uZmlnPVwidGFibGVDb25maWdcIiA+JyArXG4gICAgICAgICAgICAgICAgJyAgPHNwLWRhdGEtdGFibGUtaGVhZGluZyBzcC1wb3NpdGlvbj1cInJpZ2h0XCIgc3AtcHJpb3JpdHk9XCIyXCI+JyArXG4gICAgICAgICAgICAgICAgJyAgICA8YnV0dG9uIGlkPVwiY3N2QnRuXCIgY2xhc3M9XCJidG4gYnRuLXdoaXRlIGJ0bi1zbSBpY29uLWJ0blwiIHRhYmluZGV4PVwiNTBcIi8+JyArXG4gICAgICAgICAgICAgICAgJyAgPC9zcC1kYXRhLXRhYmxlLWhlYWRpbmc+JyArXG4gICAgICAgICAgICAgICAgJyAgPHNwLWRhdGEtdGFibGUtaGVhZGluZyBzcC1wb3NpdGlvbj1cImxlZnRcIj4nICtcbiAgICAgICAgICAgICAgICAnICAgIDxidXR0b24gaWQ9XCJidWxrQnRuXCIgY2xhc3M9XCJidG4gYnRuLXdoaXRlIGJ0bi1zbSBpY29uLWJ0blwiIHRhYmluZGV4PVwiNTBcIi8+JyArXG4gICAgICAgICAgICAgICAgJyAgPC9zcC1kYXRhLXRhYmxlLWhlYWRpbmc+JyArXG4gICAgICAgICAgICAgICAgJyAgPHNwLWRhdGEtdGFibGUtaGVhZGluZyBzcC1wb3NpdGlvbj1cInJpZ2h0XCIgc3AtcHJpb3JpdHk9XCIxXCI+JyArXG4gICAgICAgICAgICAgICAgJyAgICA8YnV0dG9uIGlkPVwiY3VzdG9tQnRuXCIgY2xhc3M9XCJidG4gYnRuLXdoaXRlIGJ0bi1zbSBpY29uLWJ0blwiIHRhYmluZGV4PVwiNTBcIi8+JyArXG4gICAgICAgICAgICAgICAgJyAgPC9zcC1kYXRhLXRhYmxlLWhlYWRpbmc+JyArXG4gICAgICAgICAgICAgICAgJyAgPHNwLWRhdGEtdGFibGUtaGVhZGluZyBzcC1wb3NpdGlvbj1cInJpZ2h0XCInICtcbiAgICAgICAgICAgICAgICAnICAgIDxidXR0b24gaWQ9XCJjb2x1bW5zQnRuXCIgY2xhc3M9XCJidG4gYnRuLXdoaXRlIGJ0bi1zbSBpY29uLWJ0blwiIHRhYmluZGV4PVwiNTBcIi8+JyArXG4gICAgICAgICAgICAgICAgJyAgPC9zcC1kYXRhLXRhYmxlLWhlYWRpbmc+JyArXG4gICAgICAgICAgICAgICAgJyAgPHNwLWRhdGEtdGFibGUtaGVhZGluZyBzcC1wb3NpdGlvbj1cInRvcFwiJyArXG4gICAgICAgICAgICAgICAgJyAgICA8c3BhbiBpZD1cInRvcEhlYWRpbmdcIj5IZWFkaW5nPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICcgIDwvc3AtZGF0YS10YWJsZS1oZWFkaW5nPicgK1xuICAgICAgICAgICAgICAgICc8L3NwLWRhdGEtdGFibGU+PC9kaXY+PC9kaXY+JztcblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHdpbmRvd18pIHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IG5ldyBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcoe1xuICAgICAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogc29tZUNvbHVtbkNvbmZpZ0tleSxcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiAkc2NvcGUuZmlsdGVyc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkd2luZG93ID0gXyR3aW5kb3dfO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgZGlzcGxheSB0aGUgaGVhZGVyIHBhbmVsIGR1ZSB0byBjb25maWcgbm90IHNldCcsICgpID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5wYW5lbC1oZWFkaW5nJykuaGFzQ2xhc3MoJ25nLWhpZGUnKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHRoZSBoZWFkZXIgcGFuZWwnLCAoKSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcuaGVhZGVyRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcucGFuZWwtaGVhZGluZycpLmhhc0NsYXNzKCduZy1oaWRlJykpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBjb250YWluIGRlZmF1bHQgZmlsdGVyIGJ1dHRvbicsICgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZy5maWx0ZXJzID0gW107XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjcGFuZWxGaWx0ZXJCdG4nKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY29udGFpbiBkZWZhdWx0IGZpbHRlciBidXR0b24nLCAoKSA9PiB7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcuaGVhZGVyRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjcGFuZWxGaWx0ZXJCdG4nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY29udGFpbiBkZWZhdWx0IHBhZ2luZyBpbmZvJywgaW5qZWN0KGZ1bmN0aW9uKFBhZ2luZ0RhdGEpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5jdXJyZW50LXBhZ2UtaW5mbycpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZy5wYWdpbmdJbmZvRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcucGFnZVN0YXRlLnBhZ2luZ0RhdGEgPSBuZXcgUGFnaW5nRGF0YSgyNSk7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuY3VycmVudC1wYWdlLWluZm8nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNvbnRhaW4gaGVhZGluZyBidXR0b25zJywgKCkgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnLmhlYWRlckVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChkZWYpO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhbmVsSGVhZGluZ0ZhclJpZ2h0ICNjc3ZCdG4nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjcGFuZWxIZWFkaW5nTGVmdCAjYnVsa0J0bicpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNwYW5lbEhlYWRpbmdSaWdodCAjY3VzdG9tQnRuJykubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI3BhbmVsSGVhZGluZ1JpZ2h0ICNjb2x1bW5zQnRuJykubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNvbnRhaW4gdG9wIGhlYWRpbmcgb3V0c2lkZSBwYW5lbCcsICgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZy5oZWFkZXJFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyN0b3BIZWFkaW5nJykubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdwcmVTZWFyY2hGdW5jJywgKCkgPT4ge1xuXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RQcmVTZWFyY2hGdW5jKGhhc0Z1bmMsIGZ1bmNTdWNjZXNzKSB7XG4gICAgICAgICAgICBsZXQgZGVmID0gJzxzcC1kYXRhLXRhYmxlIHNwLWl0ZW1zLWZ1bmM9XCJpdGVtc0Z1bmMoc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgZmlsdGVyVmFsdWVzLCBzb3J0T3JkZXIpXCIgJyArXG4gICAgICAgICAgICAgICAgJ3NwLXRhYmxlLWNvbmZpZz1cInRhYmxlQ29uZmlnXCIgLz4nO1xuXG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSBuZXcgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWdLZXk6IHNvbWVDb2x1bW5Db25maWdLZXksXG4gICAgICAgICAgICAgICAgZ3JvdXBCeUNvbHVtbjogJ3N0YXR1cycsXG4gICAgICAgICAgICAgICAgZmlsdGVyczogJHNjb3BlLmZpbHRlcnNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIHByZVNlYXJjaEZ1bmMgdG8gdGhlIHRhYmxlQ29uZmlnXG4gICAgICAgICAgICBpZiAoaGFzRnVuYykge1xuICAgICAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZy5wcmVTZWFyY2hGdW5jID0gamFzbWluZS5jcmVhdGVTcHkoJ3ByZVNlYXJjaEZ1bmMnKVxuICAgICAgICAgICAgICAgICAgICAuYW5kLnJldHVyblZhbHVlKGZ1bmNTdWNjZXNzID8gJHEud2hlbigpIDogJHEucmVqZWN0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZik7XG5cbiAgICAgICAgICAgIC8vIFNldCBhIG1vZGlmaWVkIHNjcmF0Y2ggcGFkIHRvIHRoZSBEYXRhVGFibGVEaXJlY3RpdmVDdHJsXG4gICAgICAgICAgICBsZXQgc2NyYXRjaFBhZCA9IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RmlsdGVyOiAndGhpbmcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgb2xkU2VhcmNoRGF0YSA9ICRzY29wZS4kJGNoaWxkSGVhZC5kYXRhVGFibGVDdHJsLmdldFBhZ2VTdGF0ZSgpLnNlYXJjaERhdGE7XG4gICAgICAgICAgICAkc2NvcGUuJCRjaGlsZEhlYWQuZGF0YVRhYmxlQ3RybC5zZWFyY2hTY3JhdGNoUGFkID0gc2NyYXRjaFBhZDtcblxuICAgICAgICAgICAgLy8gU3B5IG9uIGRvU2VhcmNoLCB3aGljaCBkb2VzIHRoZSByZWFsIHNlYXJjaGluZ1xuICAgICAgICAgICAgc3B5T24oJHNjb3BlLiQkY2hpbGRIZWFkLmRhdGFUYWJsZUN0cmwsICdkb1NlYXJjaCcpLmFuZC5jYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBzZWFyY2goKSBtZXRob2QgdG8gc2ltdWxhdGUgYXBwbHlpbmcgZmlsdGVyIHBhbmVsXG4gICAgICAgICAgICAkc2NvcGUuJCRjaGlsZEhlYWQuZGF0YVRhYmxlQ3RybC5zZWFyY2goKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgcmlnaHQgdGhpbmdzIGhhcHBlbmVkXG4gICAgICAgICAgICBpZiAoIWhhc0Z1bmMpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoJHNjb3BlLiQkY2hpbGRIZWFkLmRhdGFUYWJsZUN0cmwuZG9TZWFyY2gpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCRzY29wZS50YWJsZUNvbmZpZy5wcmVTZWFyY2hGdW5jKVxuICAgICAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoc2NyYXRjaFBhZCwgb2xkU2VhcmNoRGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmNTdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuJCRjaGlsZEhlYWQuZGF0YVRhYmxlQ3RybC5kb1NlYXJjaCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuJCRjaGlsZEhlYWQuZGF0YVRhYmxlQ3RybC5kb1NlYXJjaCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnanVzdCBjYWxscyB0aHJvdWdoIHRvIHJlZ3VsYXIgc2VhcmNoIHdpdGhvdXQgcHJlU2VhcmNoRnVuYycsICgpID0+IHtcbiAgICAgICAgICAgIHRlc3RQcmVTZWFyY2hGdW5jKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbGxzIHRocm91Z2ggdG8gcmVndWxhciBzZWFyY2ggaWYgcHJlU2VhcmNoRnVuYyByZXR1cm5zIHJlc29sdmVkIHByb21pc2UnLCAoKSA9PiB7XG4gICAgICAgICAgICB0ZXN0UHJlU2VhcmNoRnVuYyh0cnVlLCB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IGNhbGxzIHRocm91Z2ggdG8gcmVndWxhciBzZWFyY2ggaWYgcHJlU2VhcmNoRnVuYyByZXR1cm5zIHJlamVjdGVkIHByb21pc2UnLCAoKSA9PiB7XG4gICAgICAgICAgICB0ZXN0UHJlU2VhcmNoRnVuYyh0cnVlLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NvbHVtbiBwcmVmZXJlbmNlcycsICgpID0+IHtcbiAgICAgICAgbGV0IGRlZmluaXRpb24gPSAnPHNwLWRhdGEtdGFibGUgc3AtaXRlbXMtZnVuYz1cIml0ZW1zRnVuYyhzdGFydElkeCwgaXRlbXNQZXJQYWdlLCBmaWx0ZXJWYWx1ZXMsIHNvcnRPcmRlcilcIiAnICtcbiAgICAgICAgICAgICAgICAnc3AtdGFibGUtY29uZmlnPVwidGFibGVDb25maWdcIiAvPicsXG4gICAgICAgICAgICB0YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlLCB0YWJsZUNvbHVtblByZWZlcmVuY2VzO1xuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfdGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZV8pID0+IHtcbiAgICAgICAgICAgIHRhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2UgPSBfdGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZV87XG4gICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSBuZXcgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBoZWFkZXJFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbHVtbnNCdG5FbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogc29tZUNvbHVtbkNvbmZpZ0tleSxcbiAgICAgICAgICAgICAgICB0YWJsZUlkOiAncHJlZmVyZW5jZVRhYmxlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL0V4Y2x1ZGUgcmlzaywgd2UgaGlkIGl0LlxuICAgICAgICAgICAgdGFibGVDb2x1bW5QcmVmZXJlbmNlcyA9IFsnc29tZVZhbHVlJywgJ25hbWUnXTtcbiAgICAgICAgICAgIHNweU9uKGNvbmZpZ1NlcnZpY2UsICdnZXRUYWJsZUNvbHVtblByZWZlcmVuY2VzJykuYW5kXG4gICAgICAgICAgICAgICAgLmNhbGxGYWtlKCgpID0+ICRxLndoZW4odGFibGVDb2x1bW5QcmVmZXJlbmNlcykpO1xuICAgICAgICAgICAgc3B5T24odGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZSwgJ3NhdmVUYWJsZUNvbHVtblByZWZlcmVuY2VzJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oKSk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBkZXNjcmliZSgnYnV0dG9uJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmUgc2hvd24gaWYgbm90IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnLmNvbHVtbnNCdG5FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNwYW5lbENvbHVtbnNCdG4nKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBzaG93biBpZiBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS50YWJsZUNvbmZpZy5oZWFkZXJFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcuY29sdW1uc0J0bkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjcGFuZWxDb2x1bW5zQnRuJykubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCd0b2dnbGVzIHRoZSBwYW5lbCBvcGVuIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGFibGVDb25maWcuaGVhZGVyRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnLmNvbHVtbnNCdG5FbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgbGV0IHBhbmVsID0gZWxlbWVudC5maW5kKCdkaXYuY29sdW1uLWVkaXRvci1wYW5lbCcpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQocGFuZWwpLmhhc0NsYXNzKCdpbicpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBsZXQgYnRuID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQuZmluZCgnI3BhbmVsQ29sdW1uc0J0bicpWzBdKTtcbiAgICAgICAgICAgICAgICBidG4uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgcGFuZWwgPSBlbGVtZW50LmZpbmQoJ2Rpdi5jb2x1bW4tZWRpdG9yLXBhbmVsJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChwYW5lbCkuaGFzQ2xhc3MoJ2luJykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2dldENvbHVtbkNvbmZpZ3MoKScsICgpID0+IHtcbiAgICAgICAgICAgIGl0KCdmZXRjaGVzIHRhYmxlIGNvbHVtbiBwcmVmZXJlbmNlcycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlLmdldFRhYmxlQ29sdW1uUHJlZmVyZW5jZXMpXG4gICAgICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgkc2NvcGUudGFibGVDb25maWcudGFibGVJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2FwcGx5aW5nIGNvbHVtbiBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICAgICAgZnVuY3Rpb24gc2F2ZUNvbHVtbnMoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ0biA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJyNwYW5lbENvbHVtbnNCdG4nKVswXSk7XG4gICAgICAgICAgICAgICAgYnRuLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGxldCBzYXZlQnRuID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQuZmluZCgnI3NhdmVDb2x1bW5FZGl0QnRuJylbMF0pO1xuICAgICAgICAgICAgICAgIHNhdmVCdG4uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0KCdzYXZlcyB0aGUgdGFibGUgY29sdW1uIHByZWZlcmVuY2VzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgICAgICAgICBzYXZlQ29sdW1ucygpO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHRhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2Uuc2F2ZVRhYmxlQ29sdW1uUHJlZmVyZW5jZXMpXG4gICAgICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgkc2NvcGUudGFibGVDb25maWcudGFibGVJZCwgdGFibGVDb2x1bW5QcmVmZXJlbmNlcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3RvZ2dsZXMgdGhlIHBhbmVsIGNsb3NlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgc2F2ZUNvbHVtbnMoKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBsZXQgcGFuZWwgPSBlbGVtZW50LmZpbmQoJ2Rpdi5jb2x1bW4tZWRpdG9yLXBhbmVsJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChwYW5lbCkuaGFzQ2xhc3MoJ2luJykpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdmZXRjaGVzIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXRlbXNGdW5jLmNhbGxzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgc2F2ZUNvbHVtbnMoKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoJHNjb3BlLml0ZW1zRnVuYykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzYXZlcyBuZXcgcHJlZmVyZW5jZXMgdG8gY29uZmlnU2VydmljZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzcHlPbihjb25maWdTZXJ2aWNlLCAncmVnaXN0ZXJUYWJsZUNvbHVtblByZWZlcmVuY2UnKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgc2F2ZUNvbHVtbnMoKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY29uZmlnU2VydmljZS5yZWdpc3RlclRhYmxlQ29sdW1uUHJlZmVyZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCRzY29wZS50YWJsZUNvbmZpZy50YWJsZUlkLCB0YWJsZUNvbHVtblByZWZlcmVuY2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndXBkYXRpbmcgY29sdW1ucyBmcm9tIHByZWZlcmVuY2VzJywgKCkgPT4ge1xuICAgICAgICAgICAgZnVuY3Rpb24gdGVzdENvbHVtbkhpZGRlbihjb25maWdzLCBkYXRhSW5kZXgsIGlzSGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbiA9IGNvbmZpZ3MuZmluZCgoY2MpID0+IGNjLmRhdGFJbmRleCA9PT0gZGF0YUluZGV4KTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY29sdW1uKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjb2x1bW4uaGlkZGVuKS50b0VxdWFsKGlzSGlkZGVuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXQoJ21hcmtzIGhpZGRlbi9ub3QgaGlkZGVuIHRoZSBjb3JyZWN0IGNvbHVtbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5Db25maWdzID0gJHNjb3BlLiQkY2hpbGRIZWFkLmRhdGFUYWJsZUN0cmwuY29sdW1uQ29uZmlncztcbiAgICAgICAgICAgICAgICB0ZXN0Q29sdW1uSGlkZGVuKGNvbHVtbkNvbmZpZ3MsICdzb21lVmFsdWUnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGVzdENvbHVtbkhpZGRlbihjb2x1bW5Db25maWdzLCAnbmFtZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0ZXN0Q29sdW1uSGlkZGVuKGNvbHVtbkNvbmZpZ3MsICdyaXNrJywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3NvcnRzIGNvbHVtbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW5Db25maWdzID0gJHNjb3BlLiQkY2hpbGRIZWFkLmRhdGFUYWJsZUN0cmwuY29sdW1uQ29uZmlncztcbiAgICAgICAgICAgICAgICAvLyBzaGlmdHMgdGhlIHVuZGlzcGxheWVkIGNvbHVtbnMgdG8gdGhlIGZyb250IGFuZCBvcmRlcnMgdGhlIGRpc3BsYXllZCBvbmVzIGF0IHRoZSBlbmQuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbHVtbkNvbmZpZ3NbY29sdW1uQ29uZmlncy5sZW5ndGggLSAyXS5kYXRhSW5kZXgpLnRvRXF1YWwoJ3NvbWVWYWx1ZScpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjb2x1bW5Db25maWdzW2NvbHVtbkNvbmZpZ3MubGVuZ3RoIC0gMV0uZGF0YUluZGV4KS50b0VxdWFsKCduYW1lJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
