System.register(['certification/CertificationModule', 'test/js/TestInitializer'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            describe('spCertificationAccountDisplayNameColumn', function () {

                var elementDefinition = '<sp-certification-account-display-name-column sp-model="item" sp-column-config="columnConfig"\n            sp-text-only="textOnly"/>',
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

                beforeEach(inject(function (_$rootScope_, _$compile_, _certificationTestData_, _$controller_, _ColumnConfig_) {
                    $scope = _$rootScope_.$new();
                    $compile = _$compile_;
                    $controller = _$controller_;
                    certificationTestData = _certificationTestData_;
                    item = certificationTestData.CERT_ITEMS[1];
                    textOnly = true;
                    ColumnConfig = _ColumnConfig_;
                    columnConfig = new ColumnConfig({
                        dataIndex: '1',
                        label: 'My Icon'
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
                        return $controller('CertificationAccountDisplayNameColumnDirectiveCtrl', null, {
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

                describe('html account status icons', function () {

                    function testIcons(textOnlyFlag) {
                        createElement(item, columnConfig, textOnlyFlag);
                        var iconsToBeDisplayed = angular.element(element).find('span > img');
                        expect(iconsToBeDisplayed.length).toEqual(textOnlyFlag ? 0 : 1);
                    }
                    function testLabel(textOnlyFlag) {
                        var testColumnConfig = new ColumnConfig({
                            dataIndex: '1',
                            label: undefined
                        });
                        createElement(item, testColumnConfig, textOnlyFlag);
                        expect(element[0].innerText.trim()).toEqual(textOnlyFlag ? 'ui_not_applicable' : '');
                    }

                    it('displays account status icon when textOnly flag is false', function () {
                        testIcons(false);
                    });

                    it('does not display account status icon when textOnly flag is true', function () {
                        testIcons(true);
                    });

                    it('displays N/A when label is empty and textOnly flag is true', function () {
                        testLabel(true);
                    });

                    it('displays no text when label is empty and textOnly flag is false', function () {
                        testLabel(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkFjY291bnREaXNwbGF5TmFtZUNvbHVtbkRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLHFDQUFxQyw0QkFBNEIsVUFBVSxTQUFTOzs7SUFHakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSxtQ0FBbUM7WUFDbkQsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsMkNBQTJDLFlBQVc7O2dCQUUzRCxJQUFJLG9CQUFpQjtvQkFHakIsU0FBTTtvQkFBRSxXQUFRO29CQUFFLGNBQVc7b0JBQUUsVUFBTztvQkFBRSxPQUFJO29CQUFFLHdCQUFxQjtvQkFBRSxlQUFZO29CQUFFLGVBQVk7b0JBQUUsV0FBUTs7Z0JBRTdHLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLGNBQWMsWUFBWSx5QkFBeUIsZUFBZSxnQkFBZ0I7b0JBQ3pHLFNBQVMsYUFBYTtvQkFDdEIsV0FBVztvQkFDWCxjQUFjO29CQUNkLHdCQUF3QjtvQkFDeEIsT0FBTyxzQkFBc0IsV0FBVztvQkFDeEMsV0FBVztvQkFDWCxlQUFlO29CQUNmLGVBQWUsSUFBSSxhQUNmO3dCQUNJLFdBQVc7d0JBQ1gsT0FBTzs7OztnQkFLbkIsVUFBVSxZQUFNO29CQUNaLElBQUksU0FBUzt3QkFDVCxRQUFRLFFBQVEsU0FBUzs7OztnQkFJakMsU0FBUyxjQUFjLE1BQU0sY0FBYyxVQUFVO29CQUNqRCxVQUFVLFFBQVEsUUFBUTtvQkFDMUIsT0FBTyxPQUFPO29CQUNkLE9BQU8sZUFBZTtvQkFDdEIsT0FBTyxXQUFXO29CQUNsQixTQUFTLFNBQVM7b0JBQ2xCLE9BQU87OztnQkFHWCxTQUFTLGNBQWMsWUFBTTtvQkFDekIsU0FBUyxtQkFBbUI7d0JBQ3hCLE9BQU8sWUFBWSxzREFBc0QsTUFBTTs0QkFDM0UsTUFBTTs0QkFDTixjQUFjOzRCQUNkLFVBQVU7Ozs7b0JBSWxCLEdBQUcsMEJBQTBCLFlBQU07d0JBQy9CLE9BQU87d0JBQ1AsT0FBTyxZQUFBOzRCQVlTLE9BWkg7MkJBQW9COzs7b0JBR3JDLEdBQUcsZ0NBQWdDLFlBQU07d0JBQ3JDLGVBQWU7d0JBQ2YsT0FBTyxZQUFBOzRCQWNTLE9BZEg7MkJBQW9COzs7O2dCQUl6QyxTQUFTLDZCQUE2QixZQUFNOztvQkFFeEMsU0FBUyxVQUFVLGNBQWM7d0JBQzdCLGNBQWMsTUFBTSxjQUFjO3dCQUNsQyxJQUFJLHFCQUFxQixRQUFRLFFBQVEsU0FBUyxLQUFLO3dCQUN2RCxPQUFPLG1CQUFtQixRQUFRLFFBQVEsZUFBaUIsSUFBSTs7b0JBRW5FLFNBQVMsVUFBVSxjQUFjO3dCQUM3QixJQUFJLG1CQUFtQixJQUFJLGFBQ25COzRCQUNJLFdBQVc7NEJBQ1gsT0FBTzs7d0JBRW5CLGNBQWMsTUFBTSxrQkFBa0I7d0JBQ3RDLE9BQU8sUUFBUSxHQUFHLFVBQVUsUUFBUSxRQUFTLGVBQWdCLHNCQUFzQjs7O29CQUd2RixHQUFHLDREQUE0RCxZQUFNO3dCQUNqRSxVQUFVOzs7b0JBR2QsR0FBRyxtRUFBbUUsWUFBTTt3QkFDeEUsVUFBVTs7O29CQUdkLEdBQUcsOERBQThELFlBQU07d0JBQ25FLFVBQVU7OztvQkFHZCxHQUFHLG1FQUFtRSxZQUFNO3dCQUN4RSxVQUFVOzs7Ozs7R0FvQm5CIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkFjY291bnREaXNwbGF5TmFtZUNvbHVtbkRpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXHJcblxyXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuXHJcbmRlc2NyaWJlKCdzcENlcnRpZmljYXRpb25BY2NvdW50RGlzcGxheU5hbWVDb2x1bW4nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsZXQgZWxlbWVudERlZmluaXRpb24gPVxyXG4gICAgICAgIGA8c3AtY2VydGlmaWNhdGlvbi1hY2NvdW50LWRpc3BsYXktbmFtZS1jb2x1bW4gc3AtbW9kZWw9XCJpdGVtXCIgc3AtY29sdW1uLWNvbmZpZz1cImNvbHVtbkNvbmZpZ1wiXHJcbiAgICAgICAgICAgIHNwLXRleHQtb25seT1cInRleHRPbmx5XCIvPmAsXHJcbiAgICAgICAgJHNjb3BlLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIGVsZW1lbnQsIGl0ZW0sIGNlcnRpZmljYXRpb25UZXN0RGF0YSwgQ29sdW1uQ29uZmlnLCBjb2x1bW5Db25maWcsIHRleHRPbmx5O1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHJvb3RTY29wZV8sIF8kY29tcGlsZV8sIF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfLCBfJGNvbnRyb2xsZXJfLCBfQ29sdW1uQ29uZmlnXykge1xyXG4gICAgICAgICRzY29wZSA9IF8kcm9vdFNjb3BlXy4kbmV3KCk7XHJcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xyXG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uVGVzdERhdGEgPSBfY2VydGlmaWNhdGlvblRlc3REYXRhXztcclxuICAgICAgICBpdGVtID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMV07XHJcbiAgICAgICAgdGV4dE9ubHkgPSB0cnVlO1xyXG4gICAgICAgIENvbHVtbkNvbmZpZyA9IF9Db2x1bW5Db25maWdfO1xyXG4gICAgICAgIGNvbHVtbkNvbmZpZyA9IG5ldyBDb2x1bW5Db25maWcoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJzEnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdNeSBJY29uJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9KSk7XHJcblxyXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpdGVtLCBjb2x1bW5Db25maWcsIHRleHRPbmx5KSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XHJcbiAgICAgICAgJHNjb3BlLml0ZW0gPSBpdGVtO1xyXG4gICAgICAgICRzY29wZS5jb2x1bW5Db25maWcgPSBjb2x1bW5Db25maWc7XHJcbiAgICAgICAgJHNjb3BlLnRleHRPbmx5ID0gdGV4dE9ubHk7XHJcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcclxuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbnRyb2xsZXInLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdDZXJ0aWZpY2F0aW9uQWNjb3VudERpc3BsYXlOYW1lQ29sdW1uRGlyZWN0aXZlQ3RybCcsIG51bGwsIHtcclxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW0sXHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWc6IGNvbHVtbkNvbmZpZyxcclxuICAgICAgICAgICAgICAgIHRleHRPbmx5OiB0ZXh0T25seVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBhbiBpdGVtJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtID0gbnVsbDtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUNvbnRyb2xsZXIoKSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgY29sdW1uIGNvbmZpZycsICgpID0+IHtcclxuICAgICAgICAgICAgY29sdW1uQ29uZmlnID0gbnVsbDtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUNvbnRyb2xsZXIoKSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2h0bWwgYWNjb3VudCBzdGF0dXMgaWNvbnMnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RJY29ucyh0ZXh0T25seUZsYWcpIHtcclxuICAgICAgICAgICAgY3JlYXRlRWxlbWVudChpdGVtLCBjb2x1bW5Db25maWcsIHRleHRPbmx5RmxhZyk7XHJcbiAgICAgICAgICAgIGxldCBpY29uc1RvQmVEaXNwbGF5ZWQgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkuZmluZCgnc3BhbiA+IGltZycpO1xyXG4gICAgICAgICAgICBleHBlY3QoaWNvbnNUb0JlRGlzcGxheWVkLmxlbmd0aCkudG9FcXVhbCgodGV4dE9ubHlGbGFnKSA/IDAgOiAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdExhYmVsKHRleHRPbmx5RmxhZykge1xyXG4gICAgICAgICAgICBsZXQgdGVzdENvbHVtbkNvbmZpZyA9IG5ldyBDb2x1bW5Db25maWcoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICcxJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGl0ZW0sIHRlc3RDb2x1bW5Db25maWcsIHRleHRPbmx5RmxhZyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50WzBdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoKHRleHRPbmx5RmxhZykgPyAndWlfbm90X2FwcGxpY2FibGUnIDogJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2Rpc3BsYXlzIGFjY291bnQgc3RhdHVzIGljb24gd2hlbiB0ZXh0T25seSBmbGFnIGlzIGZhbHNlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0SWNvbnMoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgZGlzcGxheSBhY2NvdW50IHN0YXR1cyBpY29uIHdoZW4gdGV4dE9ubHkgZmxhZyBpcyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0SWNvbnModHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkaXNwbGF5cyBOL0Egd2hlbiBsYWJlbCBpcyBlbXB0eSBhbmQgdGV4dE9ubHkgZmxhZyBpcyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0TGFiZWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkaXNwbGF5cyBubyB0ZXh0IHdoZW4gbGFiZWwgaXMgZW1wdHkgYW5kIHRleHRPbmx5IGZsYWcgaXMgZmFsc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RMYWJlbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
