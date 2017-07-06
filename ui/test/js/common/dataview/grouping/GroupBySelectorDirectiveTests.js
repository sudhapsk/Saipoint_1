System.register(['test/js/TestInitializer', 'common/dataview/grouping/GroupingModule', 'test/js/TestModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */
    'use strict';

    var groupingModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewGroupingGroupingModule) {
            groupingModule = _commonDataviewGroupingGroupingModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('GroupBySelectorDirective', function () {
                var eltDef = '<sp-group-by-selector sp-column-configs="colConfigs" ' + 'sp-group-by-change-func="changeFunc(colConfig)" ' + 'sp-group-by="groupValue" />',
                    $compile = undefined,
                    $scope = undefined,
                    groupByElement = undefined,
                    groupByButton = undefined,
                    groupByLinks = undefined,
                    testService = undefined,
                    $q = undefined,
                    changeFuncReturn = undefined;

                beforeEach(module(testModule, groupingModule));

                beforeEach(inject(function (_$compile_, _ColumnConfig_, _$rootScope_, _testService_, _$q_) {
                    testService = _testService_;
                    $compile = _$compile_;
                    $scope = _$rootScope_.$new();
                    $q = _$q_;

                    $scope.groupValue = undefined;
                    $scope.changeFunc = testService.createPromiseSpy(false, {}, {}).and.callFake(function () {
                        return changeFuncReturn;
                    });
                    changeFuncReturn = $q.when();

                    $scope.colConfigs = [{
                        isSortable: function () {
                            return true;
                        },
                        dataIndex: 'groupByCol-A',
                        label: 'Col-A'
                    }, {
                        isSortable: function () {
                            return true;
                        },
                        dataIndex: 'groupByCol-B',
                        label: 'Col-B'
                    }, {
                        isSortable: function () {
                            return false;
                        },
                        dataIndex: 'groupByCol-C',
                        label: 'Col-C'
                    }];
                }));

                function createElement() {
                    var elt = angular.element(eltDef);
                    $compile(elt)($scope);
                    $scope.$apply();
                    return elt;
                }

                it('requires spColumnConfigs to be passed in', function () {
                    $scope.colConfigs = undefined;
                    expect(function () {
                        return createElement();
                    }).toThrow();
                });

                it('only sortable columns should be available for group by', function () {
                    groupByElement = createElement();
                    groupByLinks = groupByElement.find('a');
                    expect(groupByLinks.length).toBe(2);
                });

                describe('when group by is toggled', function () {

                    function clickGroupBy() {
                        groupByButton = groupByElement.find('button');
                        groupByLinks = groupByElement.find('a');

                        // toggle a group by link
                        angular.element(groupByLinks[0]).click();
                    }

                    beforeEach(function () {
                        groupByElement = createElement();
                    });

                    it('should call callback func with correct column data and set value if resolves', function () {
                        clickGroupBy();
                        var newValue = $scope.colConfigs[0].dataIndex;
                        expect($scope.changeFunc).toHaveBeenCalledWith(newValue);
                        $scope.$apply();
                        expect($scope.groupValue).toEqual(newValue);
                    });

                    it('should not set value if callback func returns rejected promise', function () {
                        changeFuncReturn = $q.reject();
                        clickGroupBy();
                        $scope.$apply();
                        expect($scope.groupValue).toEqual(undefined);
                    });

                    it('groupByBtn should have btn-success class', function () {
                        clickGroupBy();
                        if (groupByButton) {
                            expect(groupByButton.hasClass('btn-success')).toBe(true);
                            // one more toggle should remove the btn-success class
                            angular.element(groupByLinks[0]).click();
                            expect(groupByButton.hasClass('btn-success')).toBe(false);
                        }
                    });

                    it('groupByLink should have current-group-by class', function () {
                        clickGroupBy();
                        expect(angular.element(groupByLinks[0]).hasClass('current-group-by')).toBe(true);
                        clickGroupBy();
                        expect(angular.element(groupByLinks[0]).hasClass('current-group-by')).toBe(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy9ncm91cGluZy9Hcm91cEJ5U2VsZWN0b3JEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkNBQTJDLHVCQUF1QixVQUFVLFNBQVM7Ozs7SUFJN0g7O0lBRUEsSUFBSSxnQkFBZ0I7SUFDcEIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsdUNBQXVDO1lBQzdGLGlCQUFpQixzQ0FBc0M7V0FDeEQsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFON0IsU0FBUyw0QkFBNEIsWUFBVztnQkFDNUMsSUFBSSxTQUFTLDBEQUNMLHFEQUNBO29CQUNKLFdBQVE7b0JBQUUsU0FBTTtvQkFBRSxpQkFBYztvQkFBRSxnQkFBYTtvQkFBRSxlQUFZO29CQUFFLGNBQVc7b0JBQUUsS0FBRTtvQkFBRSxtQkFBZ0I7O2dCQUVwRyxXQUFXLE9BQU8sWUFBWTs7Z0JBRTlCLFdBQVcsT0FBTyxVQUFTLFlBQVksZ0JBQWdCLGNBQWMsZUFBZSxNQUFNO29CQUN0RixjQUFjO29CQUNkLFdBQVc7b0JBQ1gsU0FBUyxhQUFhO29CQUN0QixLQUFLOztvQkFFTCxPQUFPLGFBQWE7b0JBQ3BCLE9BQU8sYUFBYSxZQUFZLGlCQUFpQixPQUFPLElBQUksSUFDdkQsSUFBSSxTQUFTLFlBQUE7d0JBYUYsT0FiUTs7b0JBQ3hCLG1CQUFtQixHQUFHOztvQkFFdEIsT0FBTyxhQUFhLENBQ2hCO3dCQUNJLFlBQVksWUFBQTs0QkFjQSxPQWRNOzt3QkFDbEIsV0FBVzt3QkFDWCxPQUFPO3VCQUVYO3dCQUNJLFlBQVksWUFBQTs0QkFlQSxPQWZNOzt3QkFDbEIsV0FBVzt3QkFDWCxPQUFPO3VCQUVYO3dCQUNJLFlBQVksWUFBQTs0QkFnQkEsT0FoQk07O3dCQUNsQixXQUFXO3dCQUNYLE9BQU87Ozs7Z0JBTW5CLFNBQVMsZ0JBQWdCO29CQUNyQixJQUFJLE1BQU0sUUFBUSxRQUFRO29CQUMxQixTQUFTLEtBQUs7b0JBQ2QsT0FBTztvQkFDUCxPQUFPOzs7Z0JBR1gsR0FBRyw0Q0FBNEMsWUFBTTtvQkFDakQsT0FBTyxhQUFhO29CQUNwQixPQUFPLFlBQUE7d0JBZ0JTLE9BaEJIO3VCQUFpQjs7O2dCQUdsQyxHQUFHLDBEQUEwRCxZQUFNO29CQUMvRCxpQkFBaUI7b0JBQ2pCLGVBQWUsZUFBZSxLQUFLO29CQUNuQyxPQUFPLGFBQWEsUUFBUSxLQUFLOzs7Z0JBR3JDLFNBQVMsNEJBQTRCLFlBQU07O29CQUV2QyxTQUFTLGVBQWU7d0JBQ3BCLGdCQUFnQixlQUFlLEtBQUs7d0JBQ3BDLGVBQWUsZUFBZSxLQUFLOzs7d0JBR25DLFFBQVEsUUFBUSxhQUFhLElBQUk7OztvQkFHckMsV0FBVyxZQUFNO3dCQUNiLGlCQUFpQjs7O29CQUdyQixHQUFHLGdGQUFnRixZQUFNO3dCQUNyRjt3QkFDQSxJQUFJLFdBQVcsT0FBTyxXQUFXLEdBQUc7d0JBQ3BDLE9BQU8sT0FBTyxZQUFZLHFCQUFxQjt3QkFDL0MsT0FBTzt3QkFDUCxPQUFPLE9BQU8sWUFBWSxRQUFROzs7b0JBR3RDLEdBQUcsa0VBQWtFLFlBQU07d0JBQ3ZFLG1CQUFtQixHQUFHO3dCQUN0Qjt3QkFDQSxPQUFPO3dCQUNQLE9BQU8sT0FBTyxZQUFZLFFBQVE7OztvQkFHdEMsR0FBRyw0Q0FBNEMsWUFBTTt3QkFDakQ7d0JBQ0EsSUFBSSxlQUFlOzRCQUNmLE9BQU8sY0FBYyxTQUFTLGdCQUFnQixLQUFLOzs0QkFFbkQsUUFBUSxRQUFRLGFBQWEsSUFBSTs0QkFDakMsT0FBTyxjQUFjLFNBQVMsZ0JBQWdCLEtBQUs7Ozs7b0JBSTNELEdBQUcsa0RBQWtELFlBQU07d0JBQ3ZEO3dCQUNBLE9BQU8sUUFBUSxRQUFRLGFBQWEsSUFBSSxTQUFTLHFCQUFxQixLQUFLO3dCQUMzRTt3QkFDQSxPQUFPLFFBQVEsUUFBUSxhQUFhLElBQUksU0FBUyxxQkFBcUIsS0FBSzs7Ozs7O0dBdUJwRiIsImZpbGUiOiJjb21tb24vZGF0YXZpZXcvZ3JvdXBpbmcvR3JvdXBCeVNlbGVjdG9yRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKGMpIENvcHlyaWdodCAyMDE2LiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICovXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBncm91cGluZ01vZHVsZSBmcm9tICdjb21tb24vZGF0YXZpZXcvZ3JvdXBpbmcvR3JvdXBpbmdNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcblxuZGVzY3JpYmUoJ0dyb3VwQnlTZWxlY3RvckRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBlbHREZWYgPSAnPHNwLWdyb3VwLWJ5LXNlbGVjdG9yIHNwLWNvbHVtbi1jb25maWdzPVwiY29sQ29uZmlnc1wiICcgK1xuICAgICAgICAgICAgJ3NwLWdyb3VwLWJ5LWNoYW5nZS1mdW5jPVwiY2hhbmdlRnVuYyhjb2xDb25maWcpXCIgJyArXG4gICAgICAgICAgICAnc3AtZ3JvdXAtYnk9XCJncm91cFZhbHVlXCIgLz4nLFxuICAgICAgICAkY29tcGlsZSwgJHNjb3BlLCBncm91cEJ5RWxlbWVudCwgZ3JvdXBCeUJ1dHRvbiwgZ3JvdXBCeUxpbmtzLCB0ZXN0U2VydmljZSwgJHEsIGNoYW5nZUZ1bmNSZXR1cm47XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlLCBncm91cGluZ01vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb21waWxlXywgX0NvbHVtbkNvbmZpZ18sIF8kcm9vdFNjb3BlXywgX3Rlc3RTZXJ2aWNlXywgXyRxXykge1xuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfLiRuZXcoKTtcbiAgICAgICAgJHEgPSBfJHFfO1xuXG4gICAgICAgICRzY29wZS5ncm91cFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAkc2NvcGUuY2hhbmdlRnVuYyA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHt9LCB7fSlcbiAgICAgICAgICAgIC5hbmQuY2FsbEZha2UoKCkgPT4gY2hhbmdlRnVuY1JldHVybik7XG4gICAgICAgIGNoYW5nZUZ1bmNSZXR1cm4gPSAkcS53aGVuKCk7XG5cbiAgICAgICAgJHNjb3BlLmNvbENvbmZpZ3MgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaXNTb3J0YWJsZTogKCkgPT4gdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdncm91cEJ5Q29sLUEnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQ29sLUEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlzU29ydGFibGU6ICgpID0+IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnZ3JvdXBCeUNvbC1CJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NvbC1CJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpc1NvcnRhYmxlOiAoKSA9PiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdncm91cEJ5Q29sLUMnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQ29sLUMnXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KCkge1xuICAgICAgICBsZXQgZWx0ID0gYW5ndWxhci5lbGVtZW50KGVsdERlZik7XG4gICAgICAgICRjb21waWxlKGVsdCkoJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWx0O1xuICAgIH1cblxuICAgIGl0KCdyZXF1aXJlcyBzcENvbHVtbkNvbmZpZ3MgdG8gYmUgcGFzc2VkIGluJywgKCkgPT4ge1xuICAgICAgICAkc2NvcGUuY29sQ29uZmlncyA9IHVuZGVmaW5lZDtcbiAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUVsZW1lbnQoKSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ29ubHkgc29ydGFibGUgY29sdW1ucyBzaG91bGQgYmUgYXZhaWxhYmxlIGZvciBncm91cCBieScsICgpID0+IHtcbiAgICAgICAgZ3JvdXBCeUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIGdyb3VwQnlMaW5rcyA9IGdyb3VwQnlFbGVtZW50LmZpbmQoJ2EnKTtcbiAgICAgICAgZXhwZWN0KGdyb3VwQnlMaW5rcy5sZW5ndGgpLnRvQmUoMik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2hlbiBncm91cCBieSBpcyB0b2dnbGVkJywgKCkgPT4ge1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsaWNrR3JvdXBCeSgpIHtcbiAgICAgICAgICAgIGdyb3VwQnlCdXR0b24gPSBncm91cEJ5RWxlbWVudC5maW5kKCdidXR0b24nKTtcbiAgICAgICAgICAgIGdyb3VwQnlMaW5rcyA9IGdyb3VwQnlFbGVtZW50LmZpbmQoJ2EnKTtcblxuICAgICAgICAgICAgLy8gdG9nZ2xlIGEgZ3JvdXAgYnkgbGlua1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGdyb3VwQnlMaW5rc1swXSkuY2xpY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgZ3JvdXBCeUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBjYWxsYmFjayBmdW5jIHdpdGggY29ycmVjdCBjb2x1bW4gZGF0YSBhbmQgc2V0IHZhbHVlIGlmIHJlc29sdmVzJywgKCkgPT4ge1xuICAgICAgICAgICAgY2xpY2tHcm91cEJ5KCk7XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSAkc2NvcGUuY29sQ29uZmlnc1swXS5kYXRhSW5kZXg7XG4gICAgICAgICAgICBleHBlY3QoJHNjb3BlLmNoYW5nZUZ1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUuZ3JvdXBWYWx1ZSkudG9FcXVhbChuZXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IHNldCB2YWx1ZSBpZiBjYWxsYmFjayBmdW5jIHJldHVybnMgcmVqZWN0ZWQgcHJvbWlzZScsICgpID0+IHtcbiAgICAgICAgICAgIGNoYW5nZUZ1bmNSZXR1cm4gPSAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgIGNsaWNrR3JvdXBCeSgpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5ncm91cFZhbHVlKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdncm91cEJ5QnRuIHNob3VsZCBoYXZlIGJ0bi1zdWNjZXNzIGNsYXNzJywgKCkgPT4ge1xuICAgICAgICAgICAgY2xpY2tHcm91cEJ5KCk7XG4gICAgICAgICAgICBpZiAoZ3JvdXBCeUJ1dHRvbikge1xuICAgICAgICAgICAgICAgIGV4cGVjdChncm91cEJ5QnV0dG9uLmhhc0NsYXNzKCdidG4tc3VjY2VzcycpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIG9uZSBtb3JlIHRvZ2dsZSBzaG91bGQgcmVtb3ZlIHRoZSBidG4tc3VjY2VzcyBjbGFzc1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChncm91cEJ5TGlua3NbMF0pLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdyb3VwQnlCdXR0b24uaGFzQ2xhc3MoJ2J0bi1zdWNjZXNzJykpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZ3JvdXBCeUxpbmsgc2hvdWxkIGhhdmUgY3VycmVudC1ncm91cC1ieSBjbGFzcycsICgpID0+IHtcbiAgICAgICAgICAgIGNsaWNrR3JvdXBCeSgpO1xuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChncm91cEJ5TGlua3NbMF0pLmhhc0NsYXNzKCdjdXJyZW50LWdyb3VwLWJ5JykpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBjbGlja0dyb3VwQnkoKTtcbiAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoZ3JvdXBCeUxpbmtzWzBdKS5oYXNDbGFzcygnY3VycmVudC1ncm91cC1ieScpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
