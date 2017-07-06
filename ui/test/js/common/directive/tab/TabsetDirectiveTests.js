System.register(['test/js/TestInitializer', 'common/directive/tab/TabModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var tabDirectiveModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDirectiveTabTabModule) {
            tabDirectiveModule = _commonDirectiveTabTabModule['default'];
        }],
        execute: function () {

            describe('spTabset', function () {
                var element = undefined,
                    $compile = undefined,
                    $scope = undefined;

                beforeEach(module(tabDirectiveModule));

                beforeEach(inject(function (_$compile_, $rootScope) {
                    $compile = _$compile_;
                    $scope = $rootScope.$new();
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                describe('spActiveTabConfig', function () {
                    var definition = '<sp-tabset sp-active-tab-config="activeTabConfig">\n              <sp-tab sp-config="tabConfigs[0]">\n                <tab-heading>{{tabConfigs[0].heading}}</tab-heading>\n              </sp-tab>\n              <sp-tab sp-config="tabConfigs[1]">\n                <tab-heading>{{tabConfigs[0].heading}}</tab-heading>\n              </sp-tab>',
                        tabConfigs = undefined;

                    beforeEach(function () {
                        tabConfigs = [{
                            heading: 'ONE'
                        }, {
                            heading: 'TWO'
                        }];
                    });

                    function createElement(activeTabConfig) {
                        element = angular.element(definition);
                        $scope.activeTabConfig = activeTabConfig;
                        $scope.tabConfigs = tabConfigs;
                        $compile(element)($scope);
                        $scope.$apply();
                        return element;
                    }

                    function findTab(idx) {
                        var tabs = element.find('.sp-tabset .btn-group a.btn');
                        expect(tabs.length).toEqual(2);
                        return angular.element(tabs[idx]);
                    }

                    function testTabActive(idx, isActive) {
                        expect(findTab(idx).hasClass('active')).toEqual(isActive);
                    }

                    function clickTab(idx) {
                        findTab(idx).click();
                        $scope.$apply();
                    }

                    it('sets the active tab to value if defined', function () {
                        createElement(tabConfigs[1]);
                        testTabActive(0, false);
                        testTabActive(1, true);
                    });

                    it('defaults to first tab if value is not defined', function () {
                        createElement(undefined);
                        testTabActive(0, true);
                        testTabActive(1, false);
                        expect($scope.activeTabConfig).toEqual(tabConfigs[0]);
                    });

                    it('updates the active tab if value changes', function () {
                        createElement(tabConfigs[1]);
                        $scope.activeTabConfig = tabConfigs[0];
                        $scope.$apply();
                        testTabActive(0, true);
                        testTabActive(1, false);
                    });

                    it('updates the value if different tab is selected', function () {
                        createElement(tabConfigs[1]);
                        clickTab(0);
                        expect($scope.activeTabConfig).toEqual(tabConfigs[0]);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kaXJlY3RpdmUvdGFiL1RhYnNldERpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixtQ0FBbUMsVUFBVSxTQUFTOzs7SUFHOUY7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLDhCQUE4QjtZQUNwRixxQkFBcUIsNkJBQTZCOztRQUV0RCxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsWUFBWSxZQUFNO2dCQUN2QixJQUFJLFVBQU87b0JBQUUsV0FBUTtvQkFBRSxTQUFNOztnQkFFN0IsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMsWUFBWSxZQUFlO29CQUMxQyxXQUFXO29CQUNYLFNBQVMsV0FBVzs7O2dCQUd4QixVQUFVLFlBQU07b0JBQ1osSUFBSSxTQUFTO3dCQUNULFFBQVE7Ozs7Z0JBSWhCLFNBQVMscUJBQXFCLFlBQU07b0JBQ2hDLElBQUksYUFBVTt3QkFRVixhQUFVOztvQkFFZCxXQUFXLFlBQU07d0JBQ2IsYUFBYSxDQUFDOzRCQUNWLFNBQVM7MkJBQ1g7NEJBQ0UsU0FBUzs7OztvQkFJakIsU0FBUyxjQUFjLGlCQUFpQjt3QkFDcEMsVUFBVSxRQUFRLFFBQVE7d0JBQzFCLE9BQU8sa0JBQWtCO3dCQUN6QixPQUFPLGFBQWE7d0JBQ3BCLFNBQVMsU0FBUzt3QkFDbEIsT0FBTzt3QkFDUCxPQUFPOzs7b0JBR1gsU0FBUyxRQUFRLEtBQU07d0JBQ25CLElBQUksT0FBTyxRQUFRLEtBQUs7d0JBQ3hCLE9BQU8sS0FBSyxRQUFRLFFBQVE7d0JBQzVCLE9BQU8sUUFBUSxRQUFRLEtBQUs7OztvQkFHaEMsU0FBUyxjQUFjLEtBQUssVUFBVTt3QkFDbEMsT0FBTyxRQUFTLEtBQU0sU0FBUyxXQUFXLFFBQVE7OztvQkFHdEQsU0FBUyxTQUFTLEtBQUs7d0JBQ25CLFFBQVEsS0FBSzt3QkFDYixPQUFPOzs7b0JBR1gsR0FBRywyQ0FBMkMsWUFBTTt3QkFDaEQsY0FBYyxXQUFXO3dCQUN6QixjQUFjLEdBQUc7d0JBQ2pCLGNBQWMsR0FBRzs7O29CQUdyQixHQUFHLGlEQUFpRCxZQUFNO3dCQUN0RCxjQUFjO3dCQUNkLGNBQWMsR0FBRzt3QkFDakIsY0FBYyxHQUFHO3dCQUNqQixPQUFPLE9BQU8saUJBQWlCLFFBQVEsV0FBVzs7O29CQUd0RCxHQUFHLDJDQUEyQyxZQUFNO3dCQUNoRCxjQUFjLFdBQVc7d0JBQ3pCLE9BQU8sa0JBQWtCLFdBQVc7d0JBQ3BDLE9BQU87d0JBQ1AsY0FBYyxHQUFHO3dCQUNqQixjQUFjLEdBQUc7OztvQkFHckIsR0FBRyxrREFBa0QsWUFBTTt3QkFDdkQsY0FBYyxXQUFXO3dCQUN6QixTQUFTO3dCQUNULE9BQU8sT0FBTyxpQkFBaUIsUUFBUSxXQUFXOzs7Ozs7R0FRM0QiLCJmaWxlIjoiY29tbW9uL2RpcmVjdGl2ZS90YWIvVGFic2V0RGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgdGFiRGlyZWN0aXZlTW9kdWxlIGZyb20gJ2NvbW1vbi9kaXJlY3RpdmUvdGFiL1RhYk1vZHVsZSc7XG5cbmRlc2NyaWJlKCdzcFRhYnNldCcsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudCwgJGNvbXBpbGUsICRzY29wZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRhYkRpcmVjdGl2ZU1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF8kY29tcGlsZV8sICRyb290U2NvcGUpID0+IHtcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICB9KSk7XG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NwQWN0aXZlVGFiQ29uZmlnJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVmaW5pdGlvbiA9XG4gICAgICAgICAgICAgICAgYDxzcC10YWJzZXQgc3AtYWN0aXZlLXRhYi1jb25maWc9XCJhY3RpdmVUYWJDb25maWdcIj5cbiAgICAgICAgICAgICAgPHNwLXRhYiBzcC1jb25maWc9XCJ0YWJDb25maWdzWzBdXCI+XG4gICAgICAgICAgICAgICAgPHRhYi1oZWFkaW5nPnt7dGFiQ29uZmlnc1swXS5oZWFkaW5nfX08L3RhYi1oZWFkaW5nPlxuICAgICAgICAgICAgICA8L3NwLXRhYj5cbiAgICAgICAgICAgICAgPHNwLXRhYiBzcC1jb25maWc9XCJ0YWJDb25maWdzWzFdXCI+XG4gICAgICAgICAgICAgICAgPHRhYi1oZWFkaW5nPnt7dGFiQ29uZmlnc1swXS5oZWFkaW5nfX08L3RhYi1oZWFkaW5nPlxuICAgICAgICAgICAgICA8L3NwLXRhYj5gLFxuICAgICAgICAgICAgdGFiQ29uZmlncztcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIHRhYkNvbmZpZ3MgPSBbe1xuICAgICAgICAgICAgICAgIGhlYWRpbmc6ICdPTkUnXG4gICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnVFdPJ1xuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoYWN0aXZlVGFiQ29uZmlnKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGRlZmluaXRpb24pO1xuICAgICAgICAgICAgJHNjb3BlLmFjdGl2ZVRhYkNvbmZpZyA9IGFjdGl2ZVRhYkNvbmZpZztcbiAgICAgICAgICAgICRzY29wZS50YWJDb25maWdzID0gdGFiQ29uZmlncztcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRUYWIoaWR4KSAge1xuICAgICAgICAgICAgbGV0IHRhYnMgPSBlbGVtZW50LmZpbmQoJy5zcC10YWJzZXQgLmJ0bi1ncm91cCBhLmJ0bicpO1xuICAgICAgICAgICAgZXhwZWN0KHRhYnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCh0YWJzW2lkeF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdGVzdFRhYkFjdGl2ZShpZHgsIGlzQWN0aXZlKSB7XG4gICAgICAgICAgICBleHBlY3QoKGZpbmRUYWIoaWR4KSkuaGFzQ2xhc3MoJ2FjdGl2ZScpKS50b0VxdWFsKGlzQWN0aXZlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsaWNrVGFiKGlkeCkge1xuICAgICAgICAgICAgZmluZFRhYihpZHgpLmNsaWNrKCk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnc2V0cyB0aGUgYWN0aXZlIHRhYiB0byB2YWx1ZSBpZiBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCh0YWJDb25maWdzWzFdKTtcbiAgICAgICAgICAgIHRlc3RUYWJBY3RpdmUoMCwgZmFsc2UpO1xuICAgICAgICAgICAgdGVzdFRhYkFjdGl2ZSgxLCB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RlZmF1bHRzIHRvIGZpcnN0IHRhYiBpZiB2YWx1ZSBpcyBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHRlc3RUYWJBY3RpdmUoMCwgdHJ1ZSk7XG4gICAgICAgICAgICB0ZXN0VGFiQWN0aXZlKDEsIGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuYWN0aXZlVGFiQ29uZmlnKS50b0VxdWFsKHRhYkNvbmZpZ3NbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndXBkYXRlcyB0aGUgYWN0aXZlIHRhYiBpZiB2YWx1ZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICAgICAgY3JlYXRlRWxlbWVudCh0YWJDb25maWdzWzFdKTtcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVUYWJDb25maWcgPSB0YWJDb25maWdzWzBdO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgdGVzdFRhYkFjdGl2ZSgwLCB0cnVlKTtcbiAgICAgICAgICAgIHRlc3RUYWJBY3RpdmUoMSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndXBkYXRlcyB0aGUgdmFsdWUgaWYgZGlmZmVyZW50IHRhYiBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQodGFiQ29uZmlnc1sxXSk7XG4gICAgICAgICAgICBjbGlja1RhYigwKTtcbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuYWN0aXZlVGFiQ29uZmlnKS50b0VxdWFsKHRhYkNvbmZpZ3NbMF0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
