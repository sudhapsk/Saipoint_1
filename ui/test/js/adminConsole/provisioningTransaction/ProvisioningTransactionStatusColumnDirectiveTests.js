System.register(['test/js/TestInitializer', 'adminConsole/provisioningTransaction/ProvisioningTransactionModule.js', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var provisioningTransactionModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_adminConsoleProvisioningTransactionProvisioningTransactionModuleJs) {
            provisioningTransactionModule = _adminConsoleProvisioningTransactionProvisioningTransactionModuleJs['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('spProvisioningTransactionStatusColumn', function () {

                var elementDefinition = '<sp-provisioning-transaction-status-column sp-model="item" />',
                    ProvisioningTransaction = undefined,
                    provisioningTransactionTestData = undefined,
                    $compile = undefined,
                    $scope = undefined;

                beforeEach(module(provisioningTransactionModule, testModule));

                beforeEach(inject(function (_ProvisioningTransaction_, _$compile_, _provisioningTransactionTestData_, _$rootScope_) {
                    ProvisioningTransaction = _ProvisioningTransaction_;
                    provisioningTransactionTestData = _provisioningTransactionTestData_;
                    $compile = _$compile_;
                    $scope = _$rootScope_.$new();
                }));

                function createElement(item) {
                    var element = angular.element(elementDefinition);

                    $scope.item = item;
                    $compile(element)($scope);
                    $scope.$apply();

                    return element;
                }

                function createProvisioningTransaction(status) {
                    var data = provisioningTransactionTestData.PTO1;

                    if (status) {
                        data.status = status;
                    }

                    return new ProvisioningTransaction(data);
                }

                it('should throw when no spModel specified', function () {
                    expect(function () {
                        return createElement(null);
                    }).toThrow();
                });

                it('should render the correct bullet for Success', function () {
                    var provTrans = createProvisioningTransaction(ProvisioningTransaction.Status.SUCCESS),
                        el = createElement(provTrans);

                    expect(el.find('span.text-success').length).toEqual(1);
                });

                it('should render the correct bullet for Pending', function () {
                    var provTrans = createProvisioningTransaction(ProvisioningTransaction.Status.PENDING),
                        el = createElement(provTrans);

                    expect(el.find('span.text-info').length).toEqual(1);
                });

                it('should render the correct bullet for Failed', function () {
                    var provTrans = createProvisioningTransaction(ProvisioningTransaction.Status.FAILED),
                        el = createElement(provTrans);

                    expect(el.find('span.text-danger').length).toEqual(1);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluQ29uc29sZS9wcm92aXNpb25pbmdUcmFuc2FjdGlvbi9Qcm92aXNpb25pbmdUcmFuc2FjdGlvblN0YXR1c0NvbHVtbkRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQix5RUFBeUUsdUJBQXVCLFVBQVUsU0FBUzs7O0lBRzNKOztJQUVBLElBQUksK0JBQStCO0lBQ25DLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHFFQUFxRTtZQUMzSCxnQ0FBZ0Msb0VBQW9FO1dBQ3JHLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7O1lBTjdCLFNBQVMseUNBQXlDLFlBQU07O2dCQUVwRCxJQUFJLG9CQUFpQjtvQkFDakIsMEJBQXVCO29CQUFFLGtDQUErQjtvQkFBRSxXQUFRO29CQUFFLFNBQU07O2dCQUU5RSxXQUFXLE9BQU8sK0JBQStCOztnQkFFakQsV0FBVyxPQUFPLFVBQUMsMkJBQTJCLFlBQzNCLG1DQUFtQyxjQUFpQjtvQkFDbkUsMEJBQTBCO29CQUMxQixrQ0FBa0M7b0JBQ2xDLFdBQVc7b0JBQ1gsU0FBUyxhQUFhOzs7Z0JBRzFCLFNBQVMsY0FBYyxNQUFNO29CQUN6QixJQUFJLFVBQVUsUUFBUSxRQUFROztvQkFFOUIsT0FBTyxPQUFPO29CQUNkLFNBQVMsU0FBUztvQkFDbEIsT0FBTzs7b0JBRVAsT0FBTzs7O2dCQUdYLFNBQVMsOEJBQThCLFFBQVE7b0JBQzNDLElBQUksT0FBTyxnQ0FBZ0M7O29CQUUzQyxJQUFJLFFBQVE7d0JBQ1IsS0FBSyxTQUFTOzs7b0JBR2xCLE9BQU8sSUFBSSx3QkFBd0I7OztnQkFHdkMsR0FBRywwQ0FBMEMsWUFBTTtvQkFDL0MsT0FBTyxZQUFBO3dCQVdTLE9BWEgsY0FBYzt1QkFBTzs7O2dCQUd0QyxHQUFHLGdEQUFnRCxZQUFNO29CQUNyRCxJQUFJLFlBQVksOEJBQThCLHdCQUF3QixPQUFPO3dCQUN6RSxLQUFLLGNBQWM7O29CQUV2QixPQUFPLEdBQUcsS0FBSyxxQkFBcUIsUUFBUSxRQUFROzs7Z0JBR3hELEdBQUcsZ0RBQWdELFlBQU07b0JBQ3JELElBQUksWUFBWSw4QkFBOEIsd0JBQXdCLE9BQU87d0JBQ3pFLEtBQUssY0FBYzs7b0JBRXZCLE9BQU8sR0FBRyxLQUFLLGtCQUFrQixRQUFRLFFBQVE7OztnQkFHckQsR0FBRywrQ0FBK0MsWUFBTTtvQkFDcEQsSUFBSSxZQUFZLDhCQUE4Qix3QkFBd0IsT0FBTzt3QkFDekUsS0FBSyxjQUFjOztvQkFFdkIsT0FBTyxHQUFHLEtBQUssb0JBQW9CLFFBQVEsUUFBUTs7Ozs7R0FpQnhEIiwiZmlsZSI6ImFkbWluQ29uc29sZS9wcm92aXNpb25pbmdUcmFuc2FjdGlvbi9Qcm92aXNpb25pbmdUcmFuc2FjdGlvblN0YXR1c0NvbHVtbkRpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uTW9kdWxlIGZyb20gJ2FkbWluQ29uc29sZS9wcm92aXNpb25pbmdUcmFuc2FjdGlvbi9Qcm92aXNpb25pbmdUcmFuc2FjdGlvbk1vZHVsZS5qcyc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuXG5kZXNjcmliZSgnc3BQcm92aXNpb25pbmdUcmFuc2FjdGlvblN0YXR1c0NvbHVtbicsICgpID0+IHtcblxuICAgIGxldCBlbGVtZW50RGVmaW5pdGlvbiA9IGA8c3AtcHJvdmlzaW9uaW5nLXRyYW5zYWN0aW9uLXN0YXR1cy1jb2x1bW4gc3AtbW9kZWw9XCJpdGVtXCIgLz5gLFxuICAgICAgICBQcm92aXNpb25pbmdUcmFuc2FjdGlvbiwgcHJvdmlzaW9uaW5nVHJhbnNhY3Rpb25UZXN0RGF0YSwgJGNvbXBpbGUsICRzY29wZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uTW9kdWxlLCB0ZXN0TW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdCgoX1Byb3Zpc2lvbmluZ1RyYW5zYWN0aW9uXywgXyRjb21waWxlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgX3Byb3Zpc2lvbmluZ1RyYW5zYWN0aW9uVGVzdERhdGFfLCBfJHJvb3RTY29wZV8pID0+IHtcbiAgICAgICAgUHJvdmlzaW9uaW5nVHJhbnNhY3Rpb24gPSBfUHJvdmlzaW9uaW5nVHJhbnNhY3Rpb25fO1xuICAgICAgICBwcm92aXNpb25pbmdUcmFuc2FjdGlvblRlc3REYXRhID0gX3Byb3Zpc2lvbmluZ1RyYW5zYWN0aW9uVGVzdERhdGFfO1xuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XG4gICAgICAgICRzY29wZSA9IF8kcm9vdFNjb3BlXy4kbmV3KCk7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpdGVtKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcblxuICAgICAgICAkc2NvcGUuaXRlbSA9IGl0ZW07XG4gICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVQcm92aXNpb25pbmdUcmFuc2FjdGlvbihzdGF0dXMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBwcm92aXNpb25pbmdUcmFuc2FjdGlvblRlc3REYXRhLlBUTzE7XG5cbiAgICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICAgICAgZGF0YS5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgdGhyb3cgd2hlbiBubyBzcE1vZGVsIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUVsZW1lbnQobnVsbCkpLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBjb3JyZWN0IGJ1bGxldCBmb3IgU3VjY2VzcycsICgpID0+IHtcbiAgICAgICAgbGV0IHByb3ZUcmFucyA9IGNyZWF0ZVByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uKFByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uLlN0YXR1cy5TVUNDRVNTKSxcbiAgICAgICAgICAgIGVsID0gY3JlYXRlRWxlbWVudChwcm92VHJhbnMpO1xuXG4gICAgICAgIGV4cGVjdChlbC5maW5kKCdzcGFuLnRleHQtc3VjY2VzcycpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBjb3JyZWN0IGJ1bGxldCBmb3IgUGVuZGluZycsICgpID0+IHtcbiAgICAgICAgbGV0IHByb3ZUcmFucyA9IGNyZWF0ZVByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uKFByb3Zpc2lvbmluZ1RyYW5zYWN0aW9uLlN0YXR1cy5QRU5ESU5HKSxcbiAgICAgICAgICAgIGVsID0gY3JlYXRlRWxlbWVudChwcm92VHJhbnMpO1xuXG4gICAgICAgIGV4cGVjdChlbC5maW5kKCdzcGFuLnRleHQtaW5mbycpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBjb3JyZWN0IGJ1bGxldCBmb3IgRmFpbGVkJywgKCkgPT4ge1xuICAgICAgICBsZXQgcHJvdlRyYW5zID0gY3JlYXRlUHJvdmlzaW9uaW5nVHJhbnNhY3Rpb24oUHJvdmlzaW9uaW5nVHJhbnNhY3Rpb24uU3RhdHVzLkZBSUxFRCksXG4gICAgICAgICAgICBlbCA9IGNyZWF0ZUVsZW1lbnQocHJvdlRyYW5zKTtcblxuICAgICAgICBleHBlY3QoZWwuZmluZCgnc3Bhbi50ZXh0LWRhbmdlcicpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxufSk7XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
