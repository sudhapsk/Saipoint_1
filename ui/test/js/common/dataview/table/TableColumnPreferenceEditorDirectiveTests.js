System.register(['test/js/TestInitializer', 'common/dataview/table/TableModule', 'test/js/TestModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    'use strict';

    var tableModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewTableTableModule) {
            tableModule = _commonDataviewTableTableModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('TableColumnPreferenceEditorDirective', function () {
                var $compile = undefined,
                    scope = undefined,
                    element = undefined,
                    controller = undefined,
                    $controller = undefined,
                    $timeout = undefined,
                    testColumnConfigs = undefined,
                    testService = undefined,
                    ctrl = undefined,
                    tableColumnPreferences = ['col_header_phone', 'col_header_name'],
                    elementDefinition = '<sp-table-column-preference-editor ' + 'sp-table-column-preferences="tableColumnPreferences"' + 'sp-table-id="spTableId"' + 'sp-column-configs="columnConfigs"' + 'sp-displayed="columnEditorDisplayed"' + 'sp-apply-func="applyColumnChanges(columnPreferences)"' + 'sp-id="columnEditorDiv"/>';

                beforeEach(module(tableModule, testModule));

                beforeEach(inject(function (_$compile_, _$rootScope_, _$controller_, ColumnConfig, _testService_, _$timeout_) {
                    $compile = _$compile_;
                    scope = _$rootScope_.$new();
                    $controller = _$controller_;
                    testService = _testService_;
                    $timeout = _$timeout_;

                    // setup test data
                    testColumnConfigs = [new ColumnConfig({
                        headerKey: 'col_header_name',
                        dataIndex: 'name'
                    }), new ColumnConfig({
                        headerKey: 'col_header_phone',
                        dataIndex: 'phone'
                    }), new ColumnConfig({
                        headerKey: 'col_header_department',
                        dataIndex: 'department'
                    }), new ColumnConfig({
                        dataIndex: 'accountId',
                        fieldOnly: true
                    }), new ColumnConfig({
                        headerKey: 'col_header_decision',
                        dataIndex: 'decision',
                        fixed: ColumnConfig.FixedPosition.Right
                    })];

                    // setup scope
                    scope.tableColumnPreferences = tableColumnPreferences;
                    scope.spTableId = 'testColumnPreferenceEditorId';
                    scope.columnConfigs = testColumnConfigs;
                    scope.columnEditorDisplayed = false;
                    scope.applyColumnChanges = testService.createPromiseSpy(false, {}, {});

                    element = createElement();
                    ctrl = element.isolateScope().ctrl;
                }));

                afterEach(function () {
                    if (element) {
                        angular.element(element).remove();
                    }
                });

                function createController(tableColumnPreferences, columnConfigs) {
                    return $controller('TableColumnPreferenceEditorDirectiveCtrl', {
                        $scope: scope
                    }, {
                        id: 'testId',
                        spTableColumnPreferences: tableColumnPreferences,
                        spColumnConfigs: columnConfigs,
                        spApplyFunc: scope.applyColumnChanges,
                        spDisplayed: true
                    });
                }

                function createElement() {
                    var element = angular.element(elementDefinition);
                    $compile(element)(scope);
                    scope.$apply();
                    return element;
                }

                it('should start out collapsed', function () {
                    $timeout.flush();
                    expect(element.hasClass('collapse')).toEqual(true);
                });

                it('should expand when flag is toggled', function () {
                    scope.columnEditorDisplayed = true;
                    $timeout.flush();
                    expect(element.hasClass('collapse')).toEqual(false);
                    expect(element.hasClass('in')).toEqual(true);
                });

                it('should show correct column cards', function () {
                    scope.columnEditorDisplayed = true;
                    $timeout.flush();
                    expect(element.find('.column-edit-card').length).toEqual(3);
                    expect(element.find('.card-title')[0].innerText.trim()).toEqual('name');
                    expect(element.find('.card-title')[1].innerText.trim()).toEqual('phone');
                    expect(element.find('.card-title')[2].innerText.trim()).toEqual('decision');
                    expect(element.find('.column-edit-card button')[2].disabled).toEqual(true);
                });

                it('should show correct available items in dropdown', function () {
                    scope.columnEditorDisplayed = true;
                    $timeout.flush();
                    expect(element.find('.add-column-dropdown-menu > li').length).toEqual(1);
                    expect(element.find('.add-column-dropdown-menu > li > a')[0].innerText.trim()).toEqual('department');
                });

                it('clicking add menu item should call ctrl addColumn', function () {
                    spyOn(ctrl, 'addColumn');
                    var addMenuItem = element.find('.add-column-dropdown-menu > li > a');
                    angular.element(addMenuItem).click();
                    expect(ctrl.addColumn).toHaveBeenCalled();
                });

                it('clicking remove button should call ctrl removeColumn', function () {
                    spyOn(ctrl, 'removeColumn');
                    var removeBtn = element.find('.card-link button')[0];
                    angular.element(removeBtn).click();
                    expect(ctrl.removeColumn).toHaveBeenCalled();
                });

                it('clicking cancel button should call ctrl cancel', function () {
                    spyOn(ctrl, 'cancel');
                    element.find('#cancelColumnEditBtn').click();
                    expect(ctrl.cancel).toHaveBeenCalled();
                });

                it('clicking save button should call ctrl save', function () {
                    spyOn(ctrl, 'save');
                    element.find('#saveColumnEditBtn').click();
                    expect(ctrl.save).toHaveBeenCalled();
                });

                describe('TableColumnPreferenceEditorDirectiveCtrl', function () {

                    beforeEach(function () {
                        controller = createController(tableColumnPreferences, testColumnConfigs);
                        spyOn(controller, 'initialize');
                    });

                    it('throws if spColumnConfigs or spTableColumnPreferences is not provided', function () {
                        expect(createController).toThrow();
                    });

                    it('initializes column lists', function () {
                        // selectedColumns list should get set
                        expect(controller.selectedColumns).toBeDefined();
                        expect(controller.selectedColumns.length).toEqual(2);

                        // availableColumns list should get set
                        expect(controller.availableColumns).toBeDefined();
                        expect(controller.availableColumns.length).toEqual(1);

                        // fixedRightColumns list should get set
                        expect(controller.fixedRightColumns).toBeDefined();
                        expect(controller.fixedRightColumns.length).toEqual(1);
                    });

                    it('addColumn adds to selectedColumns list and removes from available columns list', function () {
                        controller.addColumn(controller.availableColumns[0]);
                        expect(controller.selectedColumns.length).toEqual(3);
                        expect(controller.availableColumns.length).toEqual(0);
                    });

                    it('removeColumn adds to the availableColumns list and removes from the selectedColumns list', function () {
                        controller.removeColumn(controller.selectedColumns[0]);
                        expect(controller.selectedColumns.length).toEqual(1);
                        expect(controller.availableColumns.length).toEqual(2);
                    });

                    it('cancel calls spApplyFunc and then re-initializes directive', function () {
                        controller.cancel();
                        expect(scope.applyColumnChanges).toHaveBeenCalled();
                        scope.$apply();

                        expect(controller.initialize).toHaveBeenCalled();
                    });

                    it('save calls spApplyFunc with the selected column ids and then re-initializes directive', function () {
                        var selectedColumnIds = controller.selectedColumns.map(function (cc) {
                            return cc.getUniqueId();
                        });

                        controller.save();
                        expect(scope.applyColumnChanges).toHaveBeenCalledWith({ columnPreferences: selectedColumnIds });
                        scope.$apply();

                        expect(controller.initialize).toHaveBeenCalled();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy90YWJsZS9UYWJsZUNvbHVtblByZWZlcmVuY2VFZGl0b3JEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLHVCQUF1QixVQUFVLFNBQVM7Ozs7O0lBS3ZIOztJQUVBLElBQUksYUFBYTtJQUNqQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxpQ0FBaUM7WUFDdkYsY0FBYyxnQ0FBZ0M7V0FDL0MsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyx3Q0FBd0MsWUFBTTtnQkFDbkQsSUFBSSxXQUFRO29CQUFFLFFBQUs7b0JBQUUsVUFBTztvQkFBRSxhQUFVO29CQUFFLGNBQVc7b0JBQUUsV0FBUTtvQkFBRSxvQkFBaUI7b0JBQUUsY0FBVztvQkFBRSxPQUFJO29CQUNqRyx5QkFBeUIsQ0FBQyxvQkFBb0I7b0JBQzlDLG9CQUFvQix3Q0FDaEIseURBQ0EsNEJBQ0Esc0NBQ0EseUNBQ0EsMERBQ0E7O2dCQUVSLFdBQVcsT0FBTyxhQUFhOztnQkFFL0IsV0FBVyxPQUFPLFVBQVMsWUFBWSxjQUFjLGVBQWUsY0FBYyxlQUFlLFlBQVk7b0JBQ3pHLFdBQVc7b0JBQ1gsUUFBUSxhQUFhO29CQUNyQixjQUFjO29CQUNkLGNBQWM7b0JBQ2QsV0FBVzs7O29CQUdYLG9CQUFvQixDQUNoQixJQUFJLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxXQUFXO3dCQUVmLElBQUksYUFBYTt3QkFDYixXQUFXO3dCQUNYLFdBQVc7d0JBRWYsSUFBSSxhQUFhO3dCQUNiLFdBQVc7d0JBQ1gsV0FBVzt3QkFFZixJQUFJLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxXQUFXO3dCQUVmLElBQUksYUFBYTt3QkFDYixXQUFXO3dCQUNYLFdBQVc7d0JBQ1gsT0FBTyxhQUFhLGNBQWM7Ozs7b0JBSTFD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a0ZBQWtGLFlBQU07d0JBQ3ZGLFdBQVcsVUFBVSxXQUFXLGlCQUFpQjt3QkFDakQsT0FBTyxXQUFXLGdCQUFnQixRQUFRLFFBQVE7d0JBQ2xELE9BQU8sV0FBVyxpQkFBaUIsUUFBUSxRQUFROzs7b0JBR3ZELEdBQUcsNEZBQTRGLFlBQU07d0JBQ2pHLFdBQVcsYUFBYSxXQUFXLGdCQUFnQjt3QkFDbkQsT0FBTyxXQUFXLGdCQUFnQixRQUFRLFFBQVE7d0JBQ2xELE9BQU8sV0FBVyxpQkFBaUIsUUFBUSxRQUFROzs7b0JBR3ZELEdBQUcsOERBQThELFlBQU07d0JBQ25FLFdBQVc7d0JBQ1gsT0FBTyxNQUFNLG9CQUFvQjt3QkFDakMsTUFBTTs7d0JBRU4sT0FBTyxXQUFXLFlBQVk7OztvQkFHbEMsR0FBRyx5RkFBeUYsWUFBTTt3QkFDOUYsSUFBSSxvQkFBb0IsV0FBVyxnQkFBZ0IsSUFBSSxVQUFDLElBQUU7NEJBQzFDLE9BRCtDLEdBQUc7Ozt3QkFFbEUsV0FBVzt3QkFDWCxPQUFPLE1BQU0sb0JBQW9CLHFCQUFxQixFQUFFLG1CQUFtQjt3QkFDM0UsTUFBTTs7d0JBRU4sT0FBTyxXQUFXLFlBQVk7Ozs7OztHQVF2QyIsImZpbGUiOiJjb21tb24vZGF0YXZpZXcvdGFibGUvVGFibGVDb2x1bW5QcmVmZXJlbmNlRWRpdG9yRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qXG4gKiAoYykgQ29weXJpZ2h0IDIwMTYuIFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgdGFibGVNb2R1bGUgZnJvbSAnY29tbW9uL2RhdGF2aWV3L3RhYmxlL1RhYmxlTW9kdWxlJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdUYWJsZUNvbHVtblByZWZlcmVuY2VFZGl0b3JEaXJlY3RpdmUnLCAoKSA9PiB7XG4gICAgbGV0ICRjb21waWxlLCBzY29wZSwgZWxlbWVudCwgY29udHJvbGxlciwgJGNvbnRyb2xsZXIsICR0aW1lb3V0LCB0ZXN0Q29sdW1uQ29uZmlncywgdGVzdFNlcnZpY2UsIGN0cmwsXG4gICAgICAgIHRhYmxlQ29sdW1uUHJlZmVyZW5jZXMgPSBbJ2NvbF9oZWFkZXJfcGhvbmUnLCAnY29sX2hlYWRlcl9uYW1lJ10sXG4gICAgICAgIGVsZW1lbnREZWZpbml0aW9uID0gJzxzcC10YWJsZS1jb2x1bW4tcHJlZmVyZW5jZS1lZGl0b3IgJyArXG4gICAgICAgICAgICAnc3AtdGFibGUtY29sdW1uLXByZWZlcmVuY2VzPVwidGFibGVDb2x1bW5QcmVmZXJlbmNlc1wiJyArXG4gICAgICAgICAgICAnc3AtdGFibGUtaWQ9XCJzcFRhYmxlSWRcIicgK1xuICAgICAgICAgICAgJ3NwLWNvbHVtbi1jb25maWdzPVwiY29sdW1uQ29uZmlnc1wiJyArXG4gICAgICAgICAgICAnc3AtZGlzcGxheWVkPVwiY29sdW1uRWRpdG9yRGlzcGxheWVkXCInICtcbiAgICAgICAgICAgICdzcC1hcHBseS1mdW5jPVwiYXBwbHlDb2x1bW5DaGFuZ2VzKGNvbHVtblByZWZlcmVuY2VzKVwiJyArXG4gICAgICAgICAgICAnc3AtaWQ9XCJjb2x1bW5FZGl0b3JEaXZcIi8+JztcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRhYmxlTW9kdWxlLCB0ZXN0TW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbXBpbGVfLCBfJHJvb3RTY29wZV8sIF8kY29udHJvbGxlcl8sIENvbHVtbkNvbmZpZywgX3Rlc3RTZXJ2aWNlXywgXyR0aW1lb3V0Xykge1xuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XG4gICAgICAgIHNjb3BlID0gXyRyb290U2NvcGVfLiRuZXcoKTtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XG4gICAgICAgICR0aW1lb3V0ID0gXyR0aW1lb3V0XztcblxuICAgICAgICAvLyBzZXR1cCB0ZXN0IGRhdGFcbiAgICAgICAgdGVzdENvbHVtbkNvbmZpZ3MgPSBbXG4gICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBoZWFkZXJLZXk6ICdjb2xfaGVhZGVyX25hbWUnLFxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ25hbWUnXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGhlYWRlcktleTogJ2NvbF9oZWFkZXJfcGhvbmUnLFxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ3Bob25lJ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBoZWFkZXJLZXk6ICdjb2xfaGVhZGVyX2RlcGFydG1lbnQnLFxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2RlcGFydG1lbnQnXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2FjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgZmllbGRPbmx5OiB0cnVlXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGhlYWRlcktleTogJ2NvbF9oZWFkZXJfZGVjaXNpb24nLFxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2RlY2lzaW9uJyxcbiAgICAgICAgICAgICAgICBmaXhlZDogQ29sdW1uQ29uZmlnLkZpeGVkUG9zaXRpb24uUmlnaHRcbiAgICAgICAgICAgIH0pXTtcblxuICAgICAgICAvLyBzZXR1cCBzY29wZVxuICAgICAgICBzY29wZS50YWJsZUNvbHVtblByZWZlcmVuY2VzID0gdGFibGVDb2x1bW5QcmVmZXJlbmNlcztcbiAgICAgICAgc2NvcGUuc3BUYWJsZUlkID0gJ3Rlc3RDb2x1bW5QcmVmZXJlbmNlRWRpdG9ySWQnO1xuICAgICAgICBzY29wZS5jb2x1bW5Db25maWdzID0gdGVzdENvbHVtbkNvbmZpZ3M7XG4gICAgICAgIHNjb3BlLmNvbHVtbkVkaXRvckRpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICBzY29wZS5hcHBseUNvbHVtbkNoYW5nZXMgPSB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7fSwge30pO1xuXG4gICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIGN0cmwgPSBlbGVtZW50Lmlzb2xhdGVTY29wZSgpLmN0cmw7XG4gICAgfSkpO1xuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcih0YWJsZUNvbHVtblByZWZlcmVuY2VzLCBjb2x1bW5Db25maWdzKSB7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignVGFibGVDb2x1bW5QcmVmZXJlbmNlRWRpdG9yRGlyZWN0aXZlQ3RybCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ3Rlc3RJZCcsXG4gICAgICAgICAgICAgICAgc3BUYWJsZUNvbHVtblByZWZlcmVuY2VzOiB0YWJsZUNvbHVtblByZWZlcmVuY2VzLFxuICAgICAgICAgICAgICAgIHNwQ29sdW1uQ29uZmlnczogY29sdW1uQ29uZmlncyxcbiAgICAgICAgICAgICAgICBzcEFwcGx5RnVuYzogc2NvcGUuYXBwbHlDb2x1bW5DaGFuZ2VzLFxuICAgICAgICAgICAgICAgIHNwRGlzcGxheWVkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCgpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pO1xuICAgICAgICAkY29tcGlsZShlbGVtZW50KShzY29wZSk7XG4gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIHN0YXJ0IG91dCBjb2xsYXBzZWQnLCAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50Lmhhc0NsYXNzKCdjb2xsYXBzZScpKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBleHBhbmQgd2hlbiBmbGFnIGlzIHRvZ2dsZWQnLCAoKSA9PiB7XG4gICAgICAgIHNjb3BlLmNvbHVtbkVkaXRvckRpc3BsYXllZCA9IHRydWU7XG4gICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50Lmhhc0NsYXNzKCdjb2xsYXBzZScpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgY29ycmVjdCBjb2x1bW4gY2FyZHMnLCAoKSA9PiB7XG4gICAgICAgIHNjb3BlLmNvbHVtbkVkaXRvckRpc3BsYXllZCA9IHRydWU7XG4gICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5jb2x1bW4tZWRpdC1jYXJkJykubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuY2FyZC10aXRsZScpWzBdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ25hbWUnKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmNhcmQtdGl0bGUnKVsxXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCdwaG9uZScpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuY2FyZC10aXRsZScpWzJdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ2RlY2lzaW9uJyk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5jb2x1bW4tZWRpdC1jYXJkIGJ1dHRvbicpWzJdLmRpc2FibGVkKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvcnJlY3QgYXZhaWxhYmxlIGl0ZW1zIGluIGRyb3Bkb3duJywgKCkgPT4ge1xuICAgICAgICBzY29wZS5jb2x1bW5FZGl0b3JEaXNwbGF5ZWQgPSB0cnVlO1xuICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuYWRkLWNvbHVtbi1kcm9wZG93bi1tZW51ID4gbGknKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5hZGQtY29sdW1uLWRyb3Bkb3duLW1lbnUgPiBsaSA+IGEnKVswXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCdkZXBhcnRtZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2xpY2tpbmcgYWRkIG1lbnUgaXRlbSBzaG91bGQgY2FsbCBjdHJsIGFkZENvbHVtbicsICgpID0+IHtcbiAgICAgICAgc3B5T24oY3RybCwgJ2FkZENvbHVtbicpO1xuICAgICAgICBsZXQgYWRkTWVudUl0ZW0gPSBlbGVtZW50LmZpbmQoJy5hZGQtY29sdW1uLWRyb3Bkb3duLW1lbnUgPiBsaSA+IGEnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGFkZE1lbnVJdGVtKS5jbGljaygpO1xuICAgICAgICBleHBlY3QoY3RybC5hZGRDb2x1bW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KCdjbGlja2luZyByZW1vdmUgYnV0dG9uIHNob3VsZCBjYWxsIGN0cmwgcmVtb3ZlQ29sdW1uJywgKCkgPT4ge1xuICAgICAgICBzcHlPbihjdHJsLCAncmVtb3ZlQ29sdW1uJyk7XG4gICAgICAgIGxldCByZW1vdmVCdG4gPSBlbGVtZW50LmZpbmQoJy5jYXJkLWxpbmsgYnV0dG9uJylbMF07XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChyZW1vdmVCdG4pLmNsaWNrKCk7XG4gICAgICAgIGV4cGVjdChjdHJsLnJlbW92ZUNvbHVtbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NsaWNraW5nIGNhbmNlbCBidXR0b24gc2hvdWxkIGNhbGwgY3RybCBjYW5jZWwnLCAoKSA9PiB7XG4gICAgICAgIHNweU9uKGN0cmwsICdjYW5jZWwnKTtcbiAgICAgICAgZWxlbWVudC5maW5kKCcjY2FuY2VsQ29sdW1uRWRpdEJ0bicpLmNsaWNrKCk7XG4gICAgICAgIGV4cGVjdChjdHJsLmNhbmNlbCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NsaWNraW5nIHNhdmUgYnV0dG9uIHNob3VsZCBjYWxsIGN0cmwgc2F2ZScsICgpID0+IHtcbiAgICAgICAgc3B5T24oY3RybCwgJ3NhdmUnKTtcbiAgICAgICAgZWxlbWVudC5maW5kKCcjc2F2ZUNvbHVtbkVkaXRCdG4nKS5jbGljaygpO1xuICAgICAgICBleHBlY3QoY3RybC5zYXZlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnVGFibGVDb2x1bW5QcmVmZXJlbmNlRWRpdG9yRGlyZWN0aXZlQ3RybCcsICgpID0+IHtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBjcmVhdGVDb250cm9sbGVyKHRhYmxlQ29sdW1uUHJlZmVyZW5jZXMsIHRlc3RDb2x1bW5Db25maWdzKTtcbiAgICAgICAgICAgIHNweU9uKGNvbnRyb2xsZXIsICdpbml0aWFsaXplJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aHJvd3MgaWYgc3BDb2x1bW5Db25maWdzIG9yIHNwVGFibGVDb2x1bW5QcmVmZXJlbmNlcyBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoY3JlYXRlQ29udHJvbGxlcikudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaW5pdGlhbGl6ZXMgY29sdW1uIGxpc3RzJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8gc2VsZWN0ZWRDb2x1bW5zIGxpc3Qgc2hvdWxkIGdldCBzZXRcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLnNlbGVjdGVkQ29sdW1ucykudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLnNlbGVjdGVkQ29sdW1ucy5sZW5ndGgpLnRvRXF1YWwoMik7XG5cbiAgICAgICAgICAgIC8vIGF2YWlsYWJsZUNvbHVtbnMgbGlzdCBzaG91bGQgZ2V0IHNldFxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYXZhaWxhYmxlQ29sdW1ucykudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmF2YWlsYWJsZUNvbHVtbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgICAgICAgICAvLyBmaXhlZFJpZ2h0Q29sdW1ucyBsaXN0IHNob3VsZCBnZXQgc2V0XG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5maXhlZFJpZ2h0Q29sdW1ucykudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmZpeGVkUmlnaHRDb2x1bW5zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBpdCgnYWRkQ29sdW1uIGFkZHMgdG8gc2VsZWN0ZWRDb2x1bW5zIGxpc3QgYW5kIHJlbW92ZXMgZnJvbSBhdmFpbGFibGUgY29sdW1ucyBsaXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgY29udHJvbGxlci5hZGRDb2x1bW4oY29udHJvbGxlci5hdmFpbGFibGVDb2x1bW5zWzBdKTtcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLnNlbGVjdGVkQ29sdW1ucy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hdmFpbGFibGVDb2x1bW5zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlbW92ZUNvbHVtbiBhZGRzIHRvIHRoZSBhdmFpbGFibGVDb2x1bW5zIGxpc3QgYW5kIHJlbW92ZXMgZnJvbSB0aGUgc2VsZWN0ZWRDb2x1bW5zIGxpc3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb250cm9sbGVyLnJlbW92ZUNvbHVtbihjb250cm9sbGVyLnNlbGVjdGVkQ29sdW1uc1swXSk7XG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5zZWxlY3RlZENvbHVtbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYXZhaWxhYmxlQ29sdW1ucy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW5jZWwgY2FsbHMgc3BBcHBseUZ1bmMgYW5kIHRoZW4gcmUtaW5pdGlhbGl6ZXMgZGlyZWN0aXZlJywgKCkgPT4ge1xuICAgICAgICAgICAgY29udHJvbGxlci5jYW5jZWwoKTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHBseUNvbHVtbkNoYW5nZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5pbml0aWFsaXplKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzYXZlIGNhbGxzIHNwQXBwbHlGdW5jIHdpdGggdGhlIHNlbGVjdGVkIGNvbHVtbiBpZHMgYW5kIHRoZW4gcmUtaW5pdGlhbGl6ZXMgZGlyZWN0aXZlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ29sdW1uSWRzID0gY29udHJvbGxlci5zZWxlY3RlZENvbHVtbnMubWFwKChjYykgPT4gY2MuZ2V0VW5pcXVlSWQoKSk7XG5cbiAgICAgICAgICAgIGNvbnRyb2xsZXIuc2F2ZSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcGx5Q29sdW1uQ2hhbmdlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBjb2x1bW5QcmVmZXJlbmNlczogc2VsZWN0ZWRDb2x1bW5JZHMgfSk7XG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuaW5pdGlhbGl6ZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
