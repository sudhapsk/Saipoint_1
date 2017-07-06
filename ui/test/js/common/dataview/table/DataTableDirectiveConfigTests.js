System.register(['test/js/TestInitializer', 'common/dataview/table/TableModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    /**
     * Tests for the DataTableDirectiveConfig model object
     */
    'use strict';

    var tableModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewTableTableModule) {
            tableModule = _commonDataviewTableTableModule['default'];
        }],
        execute: function () {
            describe('DataTableDirectiveConfig', function () {
                var DataTableDirectiveConfig = undefined,
                    config = undefined;

                beforeEach(module(tableModule));

                beforeEach(inject(function (_DataTableDirectiveConfig_) {
                    DataTableDirectiveConfig = _DataTableDirectiveConfig_;
                }));

                it('throws when columnConfigKey is not provided', function () {
                    function errorWrapper() {
                        config = new DataTableDirectiveConfig();
                    }

                    expect(errorWrapper).toThrow();
                });

                it('should create expected elements when constructed with only a columnConfigKey', function () {
                    var columnConfigKey = 'testColumnConfigKey';

                    config = new DataTableDirectiveConfig({
                        columnConfigKey: columnConfigKey
                    });

                    expect(config.getColumnConfigKey()).toEqual(columnConfigKey);
                    expect(config.refreshTrigger).toBeDefined();
                    expect(config.pageState).toBeDefined();
                    expect(config.pageState.pagingData.getItemsPerPage()).toBe(10);
                    // header options should default to false if not specified in constructor
                    expect(config.headerEnabled).toBe(false);
                    expect(config.columnsBtnEnabled).toBe(false);
                    expect(config.pagingInfoEnabled).toBe(false);
                    // filter title should only be defined when specified in constructor
                    expect(config.filterTitle).not.toBeDefined();
                    // checkbox is only defined when provided in constructor
                    expect(config.checkboxMultiSelect).not.toBeDefined();
                    expect(config.enableGroupBy).toBe(false);
                    expect(config.showSectionHeaderLabel).toBe(false);
                    expect(config.groupByColumn).not.toBeDefined();
                    expect(config.hideFooter).toBeFalsy();
                });

                it('should create expected elements when given all the constructor arguments', function () {
                    var columnConfigKey = 'testColumnConfigKey',
                        testCheckBox = {
                        attach: jasmine.createSpy('attach')
                    },
                        testTitle = 'testFilterPanelTitle',
                        testItemsPerPage = 200,
                        testGroupByColumn = 'groupByCol',
                        testFilters = [{ some: 'thing' }],
                        testSearchFunc = jasmine.createSpy('preSearchFunc');

                    config = new DataTableDirectiveConfig({
                        columnConfigKey: columnConfigKey,
                        checkboxMultiSelect: testCheckBox,
                        headerEnabled: true,
                        columnsBtnEnabled: true,
                        pagingInfoEnabled: true,
                        filterTitle: testTitle,
                        itemsPerPage: testItemsPerPage,
                        filters: testFilters,
                        enableGroupBy: true,
                        groupByColumn: testGroupByColumn,
                        hideFooter: true,
                        preSearchFunc: testSearchFunc
                    });

                    expect(config.getColumnConfigKey()).toEqual(columnConfigKey);
                    expect(config.refreshTrigger).toBeDefined();
                    expect(config.pageState).toBeDefined();
                    expect(config.pageState.pagingData.getItemsPerPage()).toBe(testItemsPerPage);
                    // header options should be set to true from the constructor
                    expect(config.headerEnabled).toBe(true);
                    expect(config.columnsBtnEnabled).toBe(true);
                    expect(config.pagingInfoEnabled).toBe(true);
                    expect(config.filterTitle).toEqual(testTitle);
                    expect(config.checkboxMultiSelect).toBeDefined();
                    expect(config.filters).toEqual(testFilters);
                    expect(config.enableGroupBy).toBe(true);
                    expect(config.showSectionHeaderLabel).toBe(true);
                    expect(config.groupByColumn).toEqual(testGroupByColumn);
                    expect(config.hideFooter).toBeTruthy();
                    expect(config.preSearchFunc).toEqual(testSearchFunc);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy90YWJsZS9EYXRhVGFibGVEaXJlY3RpdmVDb25maWdUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0NBQXNDLFVBQVUsU0FBUzs7Ozs7Ozs7SUFRakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLGlDQUFpQztZQUN2RixjQUFjLGdDQUFnQzs7UUFFbEQsU0FBUyxZQUFZO1lBTjdCLFNBQVMsNEJBQTRCLFlBQVc7Z0JBQzVDLElBQUksMkJBQXdCO29CQUFFLFNBQU07O2dCQUVwQyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyw0QkFBNEI7b0JBQ25ELDJCQUEyQjs7O2dCQUcvQixHQUFHLCtDQUErQyxZQUFXO29CQUN6RCxTQUFTLGVBQWU7d0JBQ3BCLFNBQVMsSUFBSTs7O29CQUdqQixPQUFPLGNBQWM7OztnQkFHekIsR0FBRyxnRkFBZ0YsWUFBVztvQkFDMUYsSUFBSSxrQkFBa0I7O29CQUV0QixTQUFTLElBQUkseUJBQXlCO3dCQUNsQyxpQkFBaUI7OztvQkFHckIsT0FBTyxPQUFPLHNCQUFzQixRQUFRO29CQUM1QyxPQUFPLE9BQU8sZ0JBQWdCO29CQUM5QixPQUFPLE9BQU8sV0FBVztvQkFDekIsT0FBTyxPQUFPLFVBQVUsV0FBVyxtQkFBbUIsS0FBSzs7b0JBRTNELE9BQU8sT0FBTyxlQUFlLEtBQUs7b0JBQ2xDLE9BQU8sT0FBTyxtQkFBbUIsS0FBSztvQkFDdEMsT0FBTyxPQUFPLG1CQUFtQixLQUFLOztvQkFFdEMsT0FBTyxPQUFPLGFBQWEsSUFBSTs7b0JBRS9CLE9BQU8sT0FBTyxxQkFBcUIsSUFBSTtvQkFDdkMsT0FBTyxPQUFPLGVBQWUsS0FBSztvQkFDbEMsT0FBTyxPQUFPLHdCQUF3QixLQUFLO29CQUMzQyxPQUFPLE9BQU8sZUFBZSxJQUFJO29CQUNqQyxPQUFPLE9BQU8sWUFBWTs7O2dCQUc5QixHQUFHLDRFQUE0RSxZQUFXO29CQUN0RixJQUFJLGtCQUFrQjt3QkFDbEIsZUFBZTt3QkFDWCxRQUFRLFFBQVEsVUFBVTs7d0JBRTlCLFlBQVk7d0JBQ1osbUJBQW1CO3dCQUNuQixvQkFBb0I7d0JBQ3BCLGNBQWMsQ0FBQyxFQUFFLE1BQU07d0JBQ3ZCLGlCQUFpQixRQUFRLFVBQVU7O29CQUV2QyxTQUFTLElBQUkseUJBQXlCO3dCQUNsQyxpQkFBaUI7d0JBQ2pCLHFCQUFxQjt3QkFDckIsZUFBZTt3QkFDZixtQkFBbUI7d0JBQ25CLG1CQUFtQjt3QkFDbkIsYUFBYTt3QkFDYixjQUFjO3dCQUNkLFNBQVM7d0JBQ1QsZUFBZTt3QkFDZixlQUFlO3dCQUNmLFlBQVk7d0JBQ1osZUFBZTs7O29CQUduQixPQUFPLE9BQU8sc0JBQXNCLFFBQVE7b0JBQzVDLE9BQU8sT0FBTyxnQkFBZ0I7b0JBQzlCLE9BQU8sT0FBTyxXQUFXO29CQUN6QixPQUFPLE9BQU8sVUFBVSxXQUFXLG1CQUFtQixLQUFLOztvQkFFM0QsT0FBTyxPQUFPLGVBQWUsS0FBSztvQkFDbEMsT0FBTyxPQUFPLG1CQUFtQixLQUFLO29CQUN0QyxPQUFPLE9BQU8sbUJBQW1CLEtBQUs7b0JBQ3RDLE9BQU8sT0FBTyxhQUFhLFFBQVE7b0JBQ25DLE9BQU8sT0FBTyxxQkFBcUI7b0JBQ25DLE9BQU8sT0FBTyxTQUFTLFFBQVE7b0JBQy9CLE9BQU8sT0FBTyxlQUFlLEtBQUs7b0JBQ2xDLE9BQU8sT0FBTyx3QkFBd0IsS0FBSztvQkFDM0MsT0FBTyxPQUFPLGVBQWUsUUFBUTtvQkFDckMsT0FBTyxPQUFPLFlBQVk7b0JBQzFCLE9BQU8sT0FBTyxlQUFlLFFBQVE7Ozs7O0dBYTFDIiwiZmlsZSI6ImNvbW1vbi9kYXRhdmlldy90YWJsZS9EYXRhVGFibGVEaXJlY3RpdmVDb25maWdUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoYykgQ29weXJpZ2h0IDIwMTYuIFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKi9cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHRhYmxlTW9kdWxlIGZyb20gJ2NvbW1vbi9kYXRhdmlldy90YWJsZS9UYWJsZU1vZHVsZSc7XG5cbi8qKlxuICogVGVzdHMgZm9yIHRoZSBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcgbW9kZWwgb2JqZWN0XG4gKi9cbmRlc2NyaWJlKCdEYXRhVGFibGVEaXJlY3RpdmVDb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnLCBjb25maWc7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0YWJsZU1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX0RhdGFUYWJsZURpcmVjdGl2ZUNvbmZpZ18pIHtcbiAgICAgICAgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnID0gX0RhdGFUYWJsZURpcmVjdGl2ZUNvbmZpZ187XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Rocm93cyB3aGVuIGNvbHVtbkNvbmZpZ0tleSBpcyBub3QgcHJvdmlkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gZXJyb3JXcmFwcGVyKCkge1xuICAgICAgICAgICAgY29uZmlnID0gbmV3IERhdGFUYWJsZURpcmVjdGl2ZUNvbmZpZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0KGVycm9yV3JhcHBlcikudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgZXhwZWN0ZWQgZWxlbWVudHMgd2hlbiBjb25zdHJ1Y3RlZCB3aXRoIG9ubHkgYSBjb2x1bW5Db25maWdLZXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGNvbHVtbkNvbmZpZ0tleSA9ICd0ZXN0Q29sdW1uQ29uZmlnS2V5JztcblxuICAgICAgICBjb25maWcgPSBuZXcgRGF0YVRhYmxlRGlyZWN0aXZlQ29uZmlnKHtcbiAgICAgICAgICAgIGNvbHVtbkNvbmZpZ0tleTogY29sdW1uQ29uZmlnS2V5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChjb25maWcuZ2V0Q29sdW1uQ29uZmlnS2V5KCkpLnRvRXF1YWwoY29sdW1uQ29uZmlnS2V5KTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5yZWZyZXNoVHJpZ2dlcikudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5wYWdlU3RhdGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChjb25maWcucGFnZVN0YXRlLnBhZ2luZ0RhdGEuZ2V0SXRlbXNQZXJQYWdlKCkpLnRvQmUoMTApO1xuICAgICAgICAvLyBoZWFkZXIgb3B0aW9ucyBzaG91bGQgZGVmYXVsdCB0byBmYWxzZSBpZiBub3Qgc3BlY2lmaWVkIGluIGNvbnN0cnVjdG9yXG4gICAgICAgIGV4cGVjdChjb25maWcuaGVhZGVyRW5hYmxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcuY29sdW1uc0J0bkVuYWJsZWQpLnRvQmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnBhZ2luZ0luZm9FbmFibGVkKS50b0JlKGZhbHNlKTtcbiAgICAgICAgLy8gZmlsdGVyIHRpdGxlIHNob3VsZCBvbmx5IGJlIGRlZmluZWQgd2hlbiBzcGVjaWZpZWQgaW4gY29uc3RydWN0b3JcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5maWx0ZXJUaXRsZSkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIC8vIGNoZWNrYm94IGlzIG9ubHkgZGVmaW5lZCB3aGVuIHByb3ZpZGVkIGluIGNvbnN0cnVjdG9yXG4gICAgICAgIGV4cGVjdChjb25maWcuY2hlY2tib3hNdWx0aVNlbGVjdCkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChjb25maWcuZW5hYmxlR3JvdXBCeSkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcuc2hvd1NlY3Rpb25IZWFkZXJMYWJlbCkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcuZ3JvdXBCeUNvbHVtbikubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChjb25maWcuaGlkZUZvb3RlcikudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBleHBlY3RlZCBlbGVtZW50cyB3aGVuIGdpdmVuIGFsbCB0aGUgY29uc3RydWN0b3IgYXJndW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjb2x1bW5Db25maWdLZXkgPSAndGVzdENvbHVtbkNvbmZpZ0tleScsXG4gICAgICAgICAgICB0ZXN0Q2hlY2tCb3ggPSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoOiBqYXNtaW5lLmNyZWF0ZVNweSgnYXR0YWNoJylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZXN0VGl0bGUgPSAndGVzdEZpbHRlclBhbmVsVGl0bGUnLFxuICAgICAgICAgICAgdGVzdEl0ZW1zUGVyUGFnZSA9IDIwMCxcbiAgICAgICAgICAgIHRlc3RHcm91cEJ5Q29sdW1uID0gJ2dyb3VwQnlDb2wnLFxuICAgICAgICAgICAgdGVzdEZpbHRlcnMgPSBbeyBzb21lOiAndGhpbmcnIH1dLFxuICAgICAgICAgICAgdGVzdFNlYXJjaEZ1bmMgPSBqYXNtaW5lLmNyZWF0ZVNweSgncHJlU2VhcmNoRnVuYycpO1xuXG4gICAgICAgIGNvbmZpZyA9IG5ldyBEYXRhVGFibGVEaXJlY3RpdmVDb25maWcoe1xuICAgICAgICAgICAgY29sdW1uQ29uZmlnS2V5OiBjb2x1bW5Db25maWdLZXksXG4gICAgICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0OiB0ZXN0Q2hlY2tCb3gsXG4gICAgICAgICAgICBoZWFkZXJFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgY29sdW1uc0J0bkVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBwYWdpbmdJbmZvRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGZpbHRlclRpdGxlOiB0ZXN0VGl0bGUsXG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IHRlc3RJdGVtc1BlclBhZ2UsXG4gICAgICAgICAgICBmaWx0ZXJzOiB0ZXN0RmlsdGVycyxcbiAgICAgICAgICAgIGVuYWJsZUdyb3VwQnk6IHRydWUsXG4gICAgICAgICAgICBncm91cEJ5Q29sdW1uOiB0ZXN0R3JvdXBCeUNvbHVtbixcbiAgICAgICAgICAgIGhpZGVGb290ZXI6IHRydWUsXG4gICAgICAgICAgICBwcmVTZWFyY2hGdW5jOiB0ZXN0U2VhcmNoRnVuY1xuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoY29uZmlnLmdldENvbHVtbkNvbmZpZ0tleSgpKS50b0VxdWFsKGNvbHVtbkNvbmZpZ0tleSk7XG4gICAgICAgIGV4cGVjdChjb25maWcucmVmcmVzaFRyaWdnZXIpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChjb25maWcucGFnZVN0YXRlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnBhZ2VTdGF0ZS5wYWdpbmdEYXRhLmdldEl0ZW1zUGVyUGFnZSgpKS50b0JlKHRlc3RJdGVtc1BlclBhZ2UpO1xuICAgICAgICAvLyBoZWFkZXIgb3B0aW9ucyBzaG91bGQgYmUgc2V0IHRvIHRydWUgZnJvbSB0aGUgY29uc3RydWN0b3JcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5oZWFkZXJFbmFibGVkKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoY29uZmlnLmNvbHVtbnNCdG5FbmFibGVkKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnBhZ2luZ0luZm9FbmFibGVkKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoY29uZmlnLmZpbHRlclRpdGxlKS50b0VxdWFsKHRlc3RUaXRsZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcuY2hlY2tib3hNdWx0aVNlbGVjdCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5maWx0ZXJzKS50b0VxdWFsKHRlc3RGaWx0ZXJzKTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5lbmFibGVHcm91cEJ5KS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnNob3dTZWN0aW9uSGVhZGVyTGFiZWwpLnRvQmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcuZ3JvdXBCeUNvbHVtbikudG9FcXVhbCh0ZXN0R3JvdXBCeUNvbHVtbik7XG4gICAgICAgIGV4cGVjdChjb25maWcuaGlkZUZvb3RlcikudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnByZVNlYXJjaEZ1bmMpLnRvRXF1YWwodGVzdFNlYXJjaEZ1bmMpO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
