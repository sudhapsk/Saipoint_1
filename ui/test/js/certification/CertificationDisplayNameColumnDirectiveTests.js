System.register(['certification/CertificationModule', 'test/js/TestInitializer'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            describe('spCertificationDisplayNameColumn', function () {

                var elementDefinition = '<sp-certification-display-name-column sp-model="item" sp-column-config="columnConfig"\n        sp-text-only="textOnly" />',
                    $scope = undefined,
                    $compile = undefined,
                    $controller = undefined,
                    element = undefined,
                    item = undefined,
                    certificationTestData = undefined,
                    ColumnConfig = undefined,
                    columnConfig = undefined,
                    textOnly = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$rootScope_, _$compile_, _certificationTestData_, _$controller_, _ColumnConfig_, CertificationItem) {
                    $scope = _$rootScope_.$new();
                    $compile = _$compile_;
                    $controller = _$controller_;
                    certificationTestData = _certificationTestData_;
                    item = new CertificationItem(angular.copy(certificationTestData.CERT_ITEMS[4]));
                    textOnly = true;
                    ColumnConfig = _ColumnConfig_;
                    columnConfig = new ColumnConfig({
                        dataIndex: '1',
                        label: 'My Name'
                    });
                }));

                afterEach(function () {
                    if (element) {
                        angular.element(element).remove();
                    }
                });

                function createElement(item, columnConfig, textOnly) {
                    element = angular.element(elementDefinition);
                    $scope.item = item;
                    $scope.columnConfig = columnConfig;
                    $scope.textOnly = textOnly;
                    $compile(element)($scope);
                    $scope.$apply();
                }

                describe('controller', function () {
                    function createController() {
                        return $controller('CertificationDisplayNameColumnDirectiveCtrl', null, {
                            item: item,
                            columnConfig: columnConfig,
                            textOnly: textOnly
                        });
                    }

                    it('throws without an item', function () {
                        item = null;
                        expect(function () {
                            return createController();
                        }).toThrow();
                    });

                    it('throws without column config', function () {
                        columnConfig = null;
                        expect(function () {
                            return createController();
                        }).toThrow();
                    });
                });

                describe('html previous decision messages', function () {

                    it('throws without an item', function () {
                        item = null;
                        expect(function () {
                            return createElement();
                        }).toThrow();
                    });

                    it('displays unremoved remediation message', function () {
                        createElement(item, columnConfig, false);
                        expect(element[0].innerText.trim()).toContain('ui_unremoved_remediation_decision');
                    });

                    it('does not display unremoved remediation message if textOnlyFlag is true', function () {
                        createElement(item, columnConfig, true);
                        expect(element[0].innerText.trim()).not.toContain('ui_unremoved_remediation_decision');
                    });

                    it('calls ColumnConfig.getObjectValue() to get the display value', function () {
                        spyOn(columnConfig, 'getObjectValue').and.callThrough();
                        createElement(item, columnConfig, false);
                        expect(columnConfig.getObjectValue).toHaveBeenCalledWith(item);
                    });
                });

                describe('policy violations', function () {

                    function testPolicyViolationMessages(textOnlyFlag) {
                        var newItem = angular.copy(item);
                        newItem.policyViolations = ['Violation 1', 'Violation 2'];
                        createElement(newItem, columnConfig, textOnlyFlag);
                        var listItems = angular.element(element).find('ul.list-unstyled > li');
                        if (textOnlyFlag) {
                            expect(listItems.length).toEqual(0);
                        } else {
                            expect(listItems.length).toEqual(2);
                            expect(listItems[0].innerText.trim()).toContain('Violation 1');
                            expect(listItems[1].innerText.trim()).toContain('Violation 2');
                        }
                    }

                    it('shows policy violations in a list if they are defined on the item', function () {
                        testPolicyViolationMessages(false);
                    });

                    it('does not show policy violations in a list if textOnly flag is true', function () {
                        testPolicyViolationMessages(true);
                    });
                });

                describe('managed attribute details dialog', function () {
                    var cert = {
                        id: '1234'
                    },
                        certificationDataService = undefined,
                        certificationItemDetailService = undefined;

                    beforeEach(inject(function (_certificationDataService_, _certificationItemDetailService_) {
                        certificationDataService = _certificationDataService_;
                        certificationItemDetailService = _certificationItemDetailService_;

                        spyOn(certificationDataService, 'getCertification').and.returnValue(cert);
                        spyOn(item, 'isGroupAttributeException').and.returnValue(true);
                    }));

                    it('shows link if item is managed attribute', function () {
                        createElement(item, columnConfig, false);
                        expect(element.find('a').length).toEqual(1);
                    });

                    it('does not show link if text only', function () {
                        createElement(item, columnConfig, true);
                        expect(element.find('a').length).toEqual(0);
                    });

                    it('calls through to certificationItemDetailService.showDetailDialog when link is clicked', function () {
                        spyOn(certificationItemDetailService, 'showDetailDialog');
                        createElement(item, columnConfig, false);
                        angular.element(element.find('a')[0]).click();
                        $scope.$apply();
                        expect(certificationItemDetailService.showDetailDialog).toHaveBeenCalledWith(cert.id, item);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkRpc3BsYXlOYW1lQ29sdW1uRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMscUNBQXFDLDRCQUE0QixVQUFVLFNBQVM7OztJQUdqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLG1DQUFtQztZQUNuRCxzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxvQ0FBb0MsWUFBVzs7Z0JBRXBELElBQUksb0JBQWlCO29CQUVqQixTQUFNO29CQUFFLFdBQVE7b0JBQUUsY0FBVztvQkFBRSxVQUFPO29CQUFFLE9BQUk7b0JBQUUsd0JBQXFCO29CQUFFLGVBQVk7b0JBQUUsZUFBWTtvQkFBRSxXQUFROztnQkFFN0csV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsY0FBYyxZQUFZLHlCQUF5QixlQUFlLGdCQUNsRSxtQkFBbUI7b0JBQzFDLFNBQVMsYUFBYTtvQkFDdEIsV0FBVztvQkFDWCxjQUFjO29CQUNkLHdCQUF3QjtvQkFDeEIsT0FBTyxJQUFJLGtCQUFrQixRQUFRLEtBQUssc0JBQXNCLFdBQVc7b0JBQzNFLFdBQVc7b0JBQ1gsZUFBZTtvQkFDZixlQUFlLElBQUksYUFDZjt3QkFDSSxXQUFXO3dCQUNYLE9BQU87Ozs7Z0JBS25CLFVBQVUsWUFBTTtvQkFDWixJQUFJLFNBQVM7d0JBQ1QsUUFBUSxRQUFRLFNBQVM7Ozs7Z0JBSWpDLFNBQVMsY0FBYyxNQUFNLGNBQWMsVUFBVTtvQkFDakQsVUFBVSxRQUFRLFFBQVE7b0JBQzFCLE9BQU8sT0FBTztvQkFDZCxPQUFPLGVBQWU7b0JBQ3RCLE9BQU8sV0FBVztvQkFDbEIsU0FBUyxTQUFTO29CQUNsQixPQUFPOzs7Z0JBR1gsU0FBUyxjQUFjLFlBQU07b0JBQ3pCLFNBQVMsbUJBQW1CO3dCQUN4QixPQUFPLFlBQVksK0NBQStDLE1BQU07NEJBQ3BFLE1BQU07NEJBQ04sY0FBYzs0QkFDZCxVQUFVOzs7O29CQUlsQixHQUFHLDBCQUEwQixZQUFNO3dCQUMvQixPQUFPO3dCQUNQLE9BQU8sWUFBQTs0QkFZUyxPQVpIOzJCQUFvQjs7O29CQUdyQyxHQUFHLGdDQUFnQyxZQUFNO3dCQUNyQyxlQUFlO3dCQUNmLE9BQU8sWUFBQTs0QkFjUyxPQWRIOzJCQUFvQjs7OztnQkFJekMsU0FBUyxtQ0FBbUMsWUFBTTs7b0JBRTlDLEdBQUcsMEJBQTBCLFlBQU07d0JBQy9CLE9BQU87d0JBQ1AsT0FBTyxZQUFBOzRCQWdCUyxPQWhCSDsyQkFBaUI7OztvQkFHbEMsR0FBRywwQ0FBMEMsWUFBTTt3QkFDL0MsY0FBYyxNQUFNLGNBQWM7d0JBQ2xDLE9BQU8sUUFBUSxHQUFHLFVBQVUsUUFBUSxVQUFVOzs7b0JBR2xELEdBQUcsMEVBQTBFLFlBQU07d0JBQy9FLGNBQWMsTUFBTSxjQUFjO3dCQUNsQyxPQUFPLFFBQVEsR0FBRyxVQUFVLFFBQVEsSUFBSSxVQUFVOzs7b0JBR3RELEdBQUcsZ0VBQWdFLFlBQVc7d0JBQzFFLE1BQU0sY0FBYyxrQkFBa0IsSUFBSTt3QkFDMUMsY0FBYyxNQUFNLGNBQWM7d0JBQ2xDLE9BQU8sYUFBYSxnQkFBZ0IscUJBQXFCOzs7O2dCQUlqRSxTQUFTLHFCQUFxQixZQUFNOztvQkFFaEMsU0FBUyw0QkFBNEIsY0FBYzt3QkFDL0MsSUFBSSxVQUFVLFFBQVEsS0FBSzt3QkFDM0IsUUFBUSxtQkFBbUIsQ0FBQyxlQUFlO3dCQUMzQyxjQUFjLFNBQVMsY0FBYzt3QkFDckMsSUFBSSxZQUFZLFFBQVEsUUFBUSxTQUFTLEtBQUs7d0JBQzlDLElBQUksY0FBYzs0QkFDZCxPQUFPLFVBQVUsUUFBUSxRQUFROytCQUVoQzs0QkFDRCxPQUFPLFVBQVUsUUFBUSxRQUFROzRCQUNqQyxPQUFPLFVBQVUsR0FBRyxVQUFVLFFBQVEsVUFBVTs0QkFDaEQsT0FBTyxVQUFVLEdBQUcsVUFBVSxRQUFRLFVBQVU7Ozs7b0JBSXhELEdBQUcscUVBQXFFLFlBQU07d0JBQzFFLDRCQUE0Qjs7O29CQUdoQyxHQUFHLHNFQUFzRSxZQUFNO3dCQUMzRSw0QkFBNEI7Ozs7Z0JBSXBDLFNBQVMsb0NBQW9DLFlBQU07b0JBQy9DLElBQUksT0FBTzt3QkFDSCxJQUFJOzt3QkFDTCwyQkFBd0I7d0JBQUUsaUNBQThCOztvQkFFL0QsV0FBVyxPQUFPLFVBQUMsNEJBQTRCLGtDQUFxQzt3QkFDaEYsMkJBQTJCO3dCQUMzQixpQ0FBaUM7O3dCQUVqQyxNQUFNLDBCQUEwQixvQkFBb0IsSUFBSSxZQUFZO3dCQUNwRSxNQUFNLE1BQU0sNkJBQTZCLElBQUksWUFBWTs7O29CQUc3RCxHQUFHLDJDQUEyQyxZQUFNO3dCQUNoRCxjQUFjLE1BQU0sY0FBYzt3QkFDbEMsT0FBTyxRQUFRLEtBQUssS0FBSyxRQUFRLFFBQVE7OztvQkFHN0MsR0FBRyxtQ0FBbUMsWUFBTTt3QkFDeEMsY0FBYyxNQUFNLGNBQWM7d0JBQ2xDLE9BQU8sUUFBUSxLQUFLLEtBQUssUUFBUSxRQUFROzs7b0JBRzdDLEdBQUcseUZBQXlGLFlBQU07d0JBQzlGLE1BQU0sZ0NBQWdDO3dCQUN0QyxjQUFjLE1BQU0sY0FBYzt3QkFDbEMsUUFBUSxRQUFRLFFBQVEsS0FBSyxLQUFLLElBQUk7d0JBQ3RDLE9BQU87d0JBQ1AsT0FBTywrQkFBK0Isa0JBQWtCLHFCQUFxQixLQUFLLElBQUk7Ozs7OztHQXdCL0YiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uRGlzcGxheU5hbWVDb2x1bW5EaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xyXG5cclxuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcblxyXG5kZXNjcmliZSgnc3BDZXJ0aWZpY2F0aW9uRGlzcGxheU5hbWVDb2x1bW4nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsZXQgZWxlbWVudERlZmluaXRpb24gPSBgPHNwLWNlcnRpZmljYXRpb24tZGlzcGxheS1uYW1lLWNvbHVtbiBzcC1tb2RlbD1cIml0ZW1cIiBzcC1jb2x1bW4tY29uZmlnPVwiY29sdW1uQ29uZmlnXCJcclxuICAgICAgICBzcC10ZXh0LW9ubHk9XCJ0ZXh0T25seVwiIC8+YCxcclxuICAgICAgICAkc2NvcGUsICRjb21waWxlLCAkY29udHJvbGxlciwgZWxlbWVudCwgaXRlbSwgY2VydGlmaWNhdGlvblRlc3REYXRhLCBDb2x1bW5Db25maWcsIGNvbHVtbkNvbmZpZywgdGV4dE9ubHk7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgXyRjb21waWxlXywgX2NlcnRpZmljYXRpb25UZXN0RGF0YV8sIF8kY29udHJvbGxlcl8sIF9Db2x1bW5Db25maWdfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0pIHtcclxuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV8uJG5ldygpO1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XHJcbiAgICAgICAgaXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShhbmd1bGFyLmNvcHkoY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbNF0pKTtcclxuICAgICAgICB0ZXh0T25seSA9IHRydWU7XHJcbiAgICAgICAgQ29sdW1uQ29uZmlnID0gX0NvbHVtbkNvbmZpZ187XHJcbiAgICAgICAgY29sdW1uQ29uZmlnID0gbmV3IENvbHVtbkNvbmZpZyhcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnMScsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ015IE5hbWUnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0pKTtcclxuXHJcbiAgICBhZnRlckVhY2goKCkgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGl0ZW0sIGNvbHVtbkNvbmZpZywgdGV4dE9ubHkpIHtcclxuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcclxuICAgICAgICAkc2NvcGUuaXRlbSA9IGl0ZW07XHJcbiAgICAgICAgJHNjb3BlLmNvbHVtbkNvbmZpZyA9IGNvbHVtbkNvbmZpZztcclxuICAgICAgICAkc2NvcGUudGV4dE9ubHkgPSB0ZXh0T25seTtcclxuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnY29udHJvbGxlcicsICgpID0+IHtcclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ0NlcnRpZmljYXRpb25EaXNwbGF5TmFtZUNvbHVtbkRpcmVjdGl2ZUN0cmwnLCBudWxsLCB7XHJcbiAgICAgICAgICAgICAgICBpdGVtOiBpdGVtLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uQ29uZmlnOiBjb2x1bW5Db25maWcsXHJcbiAgICAgICAgICAgICAgICB0ZXh0T25seTogdGV4dE9ubHlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgYW4gaXRlbScsICgpID0+IHtcclxuICAgICAgICAgICAgaXRlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVDb250cm9sbGVyKCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Rocm93cyB3aXRob3V0IGNvbHVtbiBjb25maWcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbHVtbkNvbmZpZyA9IG51bGw7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVDb250cm9sbGVyKCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdodG1sIHByZXZpb3VzIGRlY2lzaW9uIG1lc3NhZ2VzJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgYW4gaXRlbScsICgpID0+IHtcclxuICAgICAgICAgICAgaXRlbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVFbGVtZW50KCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2Rpc3BsYXlzIHVucmVtb3ZlZCByZW1lZGlhdGlvbiBtZXNzYWdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGl0ZW0sIGNvbHVtbkNvbmZpZywgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudFswXS5pbm5lclRleHQudHJpbSgpKS50b0NvbnRhaW4oJ3VpX3VucmVtb3ZlZF9yZW1lZGlhdGlvbl9kZWNpc2lvbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgZGlzcGxheSB1bnJlbW92ZWQgcmVtZWRpYXRpb24gbWVzc2FnZSBpZiB0ZXh0T25seUZsYWcgaXMgdHJ1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChpdGVtLCBjb2x1bW5Db25maWcsIHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudFswXS5pbm5lclRleHQudHJpbSgpKS5ub3QudG9Db250YWluKCd1aV91bnJlbW92ZWRfcmVtZWRpYXRpb25fZGVjaXNpb24nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIENvbHVtbkNvbmZpZy5nZXRPYmplY3RWYWx1ZSgpIHRvIGdldCB0aGUgZGlzcGxheSB2YWx1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihjb2x1bW5Db25maWcsICdnZXRPYmplY3RWYWx1ZScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGl0ZW0sIGNvbHVtbkNvbmZpZywgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29sdW1uQ29uZmlnLmdldE9iamVjdFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdwb2xpY3kgdmlvbGF0aW9ucycsICgpID0+IHtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdFBvbGljeVZpb2xhdGlvbk1lc3NhZ2VzKHRleHRPbmx5RmxhZykge1xyXG4gICAgICAgICAgICBsZXQgbmV3SXRlbSA9IGFuZ3VsYXIuY29weShpdGVtKTtcclxuICAgICAgICAgICAgbmV3SXRlbS5wb2xpY3lWaW9sYXRpb25zID0gWydWaW9sYXRpb24gMScsICdWaW9sYXRpb24gMiddO1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KG5ld0l0ZW0sIGNvbHVtbkNvbmZpZywgdGV4dE9ubHlGbGFnKTtcclxuICAgICAgICAgICAgbGV0IGxpc3RJdGVtcyA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5maW5kKCd1bC5saXN0LXVuc3R5bGVkID4gbGknKTtcclxuICAgICAgICAgICAgaWYgKHRleHRPbmx5RmxhZykge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGxpc3RJdGVtcy5sZW5ndGgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QobGlzdEl0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChsaXN0SXRlbXNbMF0uaW5uZXJUZXh0LnRyaW0oKSkudG9Db250YWluKCdWaW9sYXRpb24gMScpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGxpc3RJdGVtc1sxXS5pbm5lclRleHQudHJpbSgpKS50b0NvbnRhaW4oJ1Zpb2xhdGlvbiAyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBwb2xpY3kgdmlvbGF0aW9ucyBpbiBhIGxpc3QgaWYgdGhleSBhcmUgZGVmaW5lZCBvbiB0aGUgaXRlbScsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdFBvbGljeVZpb2xhdGlvbk1lc3NhZ2VzKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHNob3cgcG9saWN5IHZpb2xhdGlvbnMgaW4gYSBsaXN0IGlmIHRleHRPbmx5IGZsYWcgaXMgdHJ1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdFBvbGljeVZpb2xhdGlvbk1lc3NhZ2VzKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ21hbmFnZWQgYXR0cmlidXRlIGRldGFpbHMgZGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjZXJ0ID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICcxMjM0J1xyXG4gICAgICAgICAgICB9LCBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsIGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZTtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfLCBfY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlXykgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZV87XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDZXJ0aWZpY2F0aW9uJykuYW5kLnJldHVyblZhbHVlKGNlcnQpO1xyXG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNHcm91cEF0dHJpYnV0ZUV4Y2VwdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBsaW5rIGlmIGl0ZW0gaXMgbWFuYWdlZCBhdHRyaWJ1dGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoaXRlbSwgY29sdW1uQ29uZmlnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ2EnKS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBzaG93IGxpbmsgaWYgdGV4dCBvbmx5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGl0ZW0sIGNvbHVtbkNvbmZpZywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ2EnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZS5zaG93RGV0YWlsRGlhbG9nIHdoZW4gbGluayBpcyBjbGlja2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UsICdzaG93RGV0YWlsRGlhbG9nJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoaXRlbSwgY29sdW1uQ29uZmlnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJ2EnKVswXSkuY2xpY2soKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dEZXRhaWxEaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnQuaWQsIGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
