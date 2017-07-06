System.register(['test/js/TestInitializer', 'common/dataview/card/CardModule'], function (_export) {
    'use strict';

    var cardModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewCardCardModule) {
            cardModule = _commonDataviewCardCardModule['default'];
        }],
        execute: function () {

            describe('CardListDirective', function () {

                var $compile = undefined,
                    $scope = undefined,
                    $q = undefined,
                    ListResultDTO = undefined,
                    element = undefined,
                    itemsFunc = undefined,
                    trigger = undefined,
                    pagingData = undefined,
                    total = undefined,
                    items = undefined;

                beforeEach(module(cardModule));

                beforeEach(inject(function (_$compile_, $rootScope, _$q_, _ListResultDTO_, DataRefreshTrigger) {
                    $compile = _$compile_;
                    $scope = $rootScope;
                    $q = _$q_;
                    ListResultDTO = _ListResultDTO_;

                    trigger = new DataRefreshTrigger();
                    pagingData = null;

                    // Setup a fake items function with a default ListResult.  This can be tweaked by tests.
                    setResults(5);
                    itemsFunc = jasmine.createSpy('itemsFunc').and.callFake(function () {
                        return $q.when({
                            data: new ListResultDTO({
                                count: total,
                                objects: items
                            })
                        });
                    });
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                function setResults(count) {
                    total = count;

                    items = [];
                    var numObjects = Math.min(count, 12);
                    for (var i = 0; i < numObjects; i++) {
                        items.push(i);
                    }
                }

                function compile(noItemsFunc) {
                    var eltDef = '<sp-card-list sp-items-func="itemsFunc(startIdx, itemsPerPage, filterValues, sortOrder)"\n                           sp-refresh-trigger="trigger"\n                           sp-paging-data="pagingData">\n               {{ item }}\n             </sp-card-list>';

                    if (!noItemsFunc) {
                        $scope.itemsFunc = itemsFunc;
                    }

                    $scope.trigger = trigger;
                    $scope.pagingData = pagingData;

                    element = angular.element(eltDef);
                    $compile(element)($scope);
                    $scope.$digest();
                }

                it('explodes if no sp-items-func is given', function () {
                    expect(function () {
                        return compile(true);
                    }).toThrow();
                });

                it('fetches items when created', function () {
                    compile();
                    expect(itemsFunc).toHaveBeenCalledWith(0, 12, {}, undefined);
                });

                it('refetches items when the trigger is triggered', function () {
                    compile();
                    expect(itemsFunc.calls.count()).toEqual(1);

                    trigger.refresh();
                    expect(itemsFunc.calls.count()).toEqual(2);
                });

                it('paging data is used if passed in', inject(function (PagingData) {
                    var itemsPerPage = 5;
                    var currentPage = 3;
                    var startIdx = (currentPage - 1) * itemsPerPage;
                    pagingData = new PagingData(itemsPerPage);
                    pagingData.currentPage = currentPage;

                    compile();
                    expect(itemsFunc).toHaveBeenCalledWith(startIdx, itemsPerPage, {}, undefined);
                }));

                it('displays each card', function () {
                    compile();

                    var cards = element.find('#cardList > section');
                    expect(cards.length).toEqual(5);
                    for (var i = 0; i < cards.length; i++) {
                        expect(angular.element(cards[i]).text().trim()).toEqual(Number(i).toString(10));
                    }
                });

                it('shows no results message if there are no items', function () {
                    // Send no results back.
                    setResults(0);
                    compile();

                    var msg = element.find('h3');
                    expect(msg.length).toEqual(1);
                    expect(msg.text().trim()).toEqual('ui_no_results');
                });

                describe('pager', function () {
                    function getPager() {
                        return element.find('#cardListPager');
                    }

                    it('is hidden if there is only one page', function () {
                        // Defaults to 5 results.
                        compile();
                        expect(getPager().length).toEqual(0);
                    });

                    it('is shown if there are multiple pages', function () {
                        // Give it two pages.
                        setResults(15);
                        compile();
                        expect(getPager().length).toEqual(1);
                    });

                    it('refetches when pager button is clicked', function () {
                        // Give it two pages.
                        setResults(15);
                        compile();

                        // Click the "next" button"
                        var pager = getPager();
                        expect(pager.length).toEqual(1);
                        var btns = pager.find('a');
                        var nextBtn = angular.element(btns[btns.length - 1]);

                        itemsFunc.calls.reset();
                        nextBtn.click();

                        expect(itemsFunc).toHaveBeenCalledWith(12, 12, {}, undefined);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy9jYXJkL0NhcmRMaXN0RGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLG9DQUFvQyxVQUFVLFNBQVM7SUFDL0Y7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLCtCQUErQjtZQUNyRixhQUFhLDhCQUE4Qjs7UUFFL0MsU0FBUyxZQUFZOztZQUw3QixTQUFTLHFCQUFxQixZQUFNOztnQkFFaEMsSUFBSSxXQUFRO29CQUFFLFNBQU07b0JBQUUsS0FBRTtvQkFBRSxnQkFBYTtvQkFBRSxVQUFPO29CQUFFLFlBQVM7b0JBQUUsVUFBTztvQkFBRSxhQUFVO29CQUFFLFFBQUs7b0JBQUUsUUFBSzs7Z0JBRTlGLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLFlBQVksWUFBWSxNQUFNLGlCQUFpQixvQkFBdUI7b0JBQ3JGLFdBQVc7b0JBQ1gsU0FBUztvQkFDVCxLQUFLO29CQUNMLGdCQUFnQjs7b0JBRWhCLFVBQVUsSUFBSTtvQkFDZCxhQUFhOzs7b0JBR2IsV0FBVztvQkFDWCxZQUFZLFFBQVEsVUFBVSxhQUFhLElBQUksU0FBUyxZQUFNO3dCQUMxRCxPQUFPLEdBQUcsS0FBSzs0QkFDWCxNQUFNLElBQUksY0FBYztnQ0FDZCxPQUFPO2dDQUNQLFNBQVM7Ozs7OztnQkFNL0IsVUFBVSxZQUFNO29CQUNaLElBQUksU0FBUzt3QkFDVCxRQUFROzs7O2dCQUloQixTQUFTLFdBQVcsT0FBTztvQkFDdkIsUUFBUTs7b0JBRVIsUUFBUTtvQkFDUixJQUFJLGFBQWEsS0FBSyxJQUFJLE9BQU87b0JBQ2pDLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxZQUFZLEtBQUs7d0JBQ2pDLE1BQU0sS0FBSzs7OztnQkFJbkIsU0FBUyxRQUFRLGFBQWE7b0JBQzFCLElBQUksU0FBTTs7b0JBT1YsSUFBSSxDQUFDLGFBQWE7d0JBQ2QsT0FBTyxZQUFZOzs7b0JBR3ZCLE9BQU8sVUFBVTtvQkFDakIsT0FBTyxhQUFhOztvQkFFcEIsVUFBVSxRQUFRLFFBQVE7b0JBQzFCLFNBQVMsU0FBUztvQkFDbEIsT0FBTzs7O2dCQUdYLEdBQUcseUNBQXlDLFlBQU07b0JBQzlDLE9BQU8sWUFBQTt3QkFZUyxPQVpILFFBQVE7dUJBQU87OztnQkFHaEMsR0FBRyw4QkFBOEIsWUFBTTtvQkFDbkM7b0JBQ0EsT0FBTyxXQUFXLHFCQUFxQixHQUFHLElBQUksSUFBSTs7O2dCQUd0RCxHQUFHLGlEQUFpRCxZQUFNO29CQUN0RDtvQkFDQSxPQUFPLFVBQVUsTUFBTSxTQUFTLFFBQVE7O29CQUV4QyxRQUFRO29CQUNSLE9BQU8sVUFBVSxNQUFNLFNBQVMsUUFBUTs7O2dCQUc1QyxHQUFHLG9DQUFvQyxPQUFPLFVBQUMsWUFBZTtvQkFDMUQsSUFBSSxlQUFlO29CQUNuQixJQUFJLGNBQWM7b0JBQ2xCLElBQUksV0FBVyxDQUFDLGNBQWMsS0FBSztvQkFDbkMsYUFBYSxJQUFJLFdBQVc7b0JBQzVCLFdBQVcsY0FBYzs7b0JBRXpCO29CQUNBLE9BQU8sV0FBVyxxQkFBcUIsVUFBVSxjQUFjLElBQUk7OztnQkFHdkUsR0FBRyxzQkFBc0IsWUFBTTtvQkFDM0I7O29CQUVBLElBQUksUUFBUSxRQUFRLEtBQUs7b0JBQ3pCLE9BQU8sTUFBTSxRQUFRLFFBQVE7b0JBQzdCLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSzt3QkFDbkMsT0FBTyxRQUFRLFFBQVEsTUFBTSxJQUFJLE9BQU8sUUFBUSxRQUFRLE9BQU8sR0FBRyxTQUFTOzs7O2dCQUluRixHQUFHLGtEQUFrRCxZQUFNOztvQkFFdkQsV0FBVztvQkFDWDs7b0JBRUEsSUFBSSxNQUFNLFFBQVEsS0FBSztvQkFDdkIsT0FBTyxJQUFJLFFBQVEsUUFBUTtvQkFDM0IsT0FBTyxJQUFJLE9BQU8sUUFBUSxRQUFROzs7Z0JBR3RDLFNBQVMsU0FBUyxZQUFNO29CQUNwQixTQUFTLFdBQVc7d0JBQ2hCLE9BQU8sUUFBUSxLQUFLOzs7b0JBR3hCLEdBQUcsdUNBQXVDLFlBQU07O3dCQUU1Qzt3QkFDQSxPQUFPLFdBQVcsUUFBUSxRQUFROzs7b0JBR3RDLEdBQUcsd0NBQXdDLFlBQU07O3dCQUU3QyxXQUFXO3dCQUNYO3dCQUNBLE9BQU8sV0FBVyxRQUFRLFFBQVE7OztvQkFHdEMsR0FBRywwQ0FBMEMsWUFBTTs7d0JBRS9DLFdBQVc7d0JBQ1g7Ozt3QkFHQSxJQUFJLFFBQVE7d0JBQ1osT0FBTyxNQUFNLFFBQVEsUUFBUTt3QkFDN0IsSUFBSSxPQUFPLE1BQU0sS0FBSzt3QkFDdEIsSUFBSSxVQUFVLFFBQVEsUUFBUSxLQUFLLEtBQUssU0FBUzs7d0JBRWpELFVBQVUsTUFBTTt3QkFDaEIsUUFBUTs7d0JBRVIsT0FBTyxXQUFXLHFCQUFxQixJQUFJLElBQUksSUFBSTs7Ozs7O0dBbUI1RCIsImZpbGUiOiJjb21tb24vZGF0YXZpZXcvY2FyZC9DYXJkTGlzdERpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBjYXJkTW9kdWxlIGZyb20gJ2NvbW1vbi9kYXRhdmlldy9jYXJkL0NhcmRNb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0NhcmRMaXN0RGlyZWN0aXZlJywgKCkgPT4ge1xyXG5cclxuICAgIGxldCAkY29tcGlsZSwgJHNjb3BlLCAkcSwgTGlzdFJlc3VsdERUTywgZWxlbWVudCwgaXRlbXNGdW5jLCB0cmlnZ2VyLCBwYWdpbmdEYXRhLCB0b3RhbCwgaXRlbXM7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2FyZE1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJGNvbXBpbGVfLCAkcm9vdFNjb3BlLCBfJHFfLCBfTGlzdFJlc3VsdERUT18sIERhdGFSZWZyZXNoVHJpZ2dlcikgPT4ge1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgICRxID0gXyRxXztcclxuICAgICAgICBMaXN0UmVzdWx0RFRPID0gX0xpc3RSZXN1bHREVE9fO1xyXG5cclxuICAgICAgICB0cmlnZ2VyID0gbmV3IERhdGFSZWZyZXNoVHJpZ2dlcigpO1xyXG4gICAgICAgIHBhZ2luZ0RhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCBhIGZha2UgaXRlbXMgZnVuY3Rpb24gd2l0aCBhIGRlZmF1bHQgTGlzdFJlc3VsdC4gIFRoaXMgY2FuIGJlIHR3ZWFrZWQgYnkgdGVzdHMuXHJcbiAgICAgICAgc2V0UmVzdWx0cyg1KTtcclxuICAgICAgICBpdGVtc0Z1bmMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaXRlbXNGdW5jJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogbmV3IExpc3RSZXN1bHREVE8oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB0b3RhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBpdGVtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldFJlc3VsdHMoY291bnQpIHtcclxuICAgICAgICB0b3RhbCA9IGNvdW50O1xyXG5cclxuICAgICAgICBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGxldCBudW1PYmplY3RzID0gTWF0aC5taW4oY291bnQsIDEyKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9iamVjdHM7IGkrKykge1xyXG4gICAgICAgICAgICBpdGVtcy5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKG5vSXRlbXNGdW5jKSB7XHJcbiAgICAgICAgbGV0IGVsdERlZiA9XHJcbiAgICAgICAgICAgIGA8c3AtY2FyZC1saXN0IHNwLWl0ZW1zLWZ1bmM9XCJpdGVtc0Z1bmMoc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgZmlsdGVyVmFsdWVzLCBzb3J0T3JkZXIpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3AtcmVmcmVzaC10cmlnZ2VyPVwidHJpZ2dlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwLXBhZ2luZy1kYXRhPVwicGFnaW5nRGF0YVwiPlxyXG4gICAgICAgICAgICAgICB7eyBpdGVtIH19XHJcbiAgICAgICAgICAgICA8L3NwLWNhcmQtbGlzdD5gO1xyXG5cclxuICAgICAgICBpZiAoIW5vSXRlbXNGdW5jKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtc0Z1bmMgPSBpdGVtc0Z1bmM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUudHJpZ2dlciA9IHRyaWdnZXI7XHJcbiAgICAgICAgJHNjb3BlLnBhZ2luZ0RhdGEgPSBwYWdpbmdEYXRhO1xyXG5cclxuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsdERlZik7XHJcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcclxuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGl0KCdleHBsb2RlcyBpZiBubyBzcC1pdGVtcy1mdW5jIGlzIGdpdmVuJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdCgoKSA9PiBjb21waWxlKHRydWUpKS50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnZmV0Y2hlcyBpdGVtcyB3aGVuIGNyZWF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgIGV4cGVjdChpdGVtc0Z1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDAsIDEyLCB7fSwgdW5kZWZpbmVkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZWZldGNoZXMgaXRlbXMgd2hlbiB0aGUgdHJpZ2dlciBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgIGV4cGVjdChpdGVtc0Z1bmMuY2FsbHMuY291bnQoKSkudG9FcXVhbCgxKTtcclxuXHJcbiAgICAgICAgdHJpZ2dlci5yZWZyZXNoKCk7XHJcbiAgICAgICAgZXhwZWN0KGl0ZW1zRnVuYy5jYWxscy5jb3VudCgpKS50b0VxdWFsKDIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3BhZ2luZyBkYXRhIGlzIHVzZWQgaWYgcGFzc2VkIGluJywgaW5qZWN0KChQYWdpbmdEYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW1zUGVyUGFnZSA9IDU7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gMztcclxuICAgICAgICBsZXQgc3RhcnRJZHggPSAoY3VycmVudFBhZ2UgLSAxKSAqIGl0ZW1zUGVyUGFnZTtcclxuICAgICAgICBwYWdpbmdEYXRhID0gbmV3IFBhZ2luZ0RhdGEoaXRlbXNQZXJQYWdlKTtcclxuICAgICAgICBwYWdpbmdEYXRhLmN1cnJlbnRQYWdlID0gY3VycmVudFBhZ2U7XHJcblxyXG4gICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICBleHBlY3QoaXRlbXNGdW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzdGFydElkeCwgaXRlbXNQZXJQYWdlLCB7fSwgdW5kZWZpbmVkKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBpdCgnZGlzcGxheXMgZWFjaCBjYXJkJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbXBpbGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNhcmRzID0gZWxlbWVudC5maW5kKCcjY2FyZExpc3QgPiBzZWN0aW9uJyk7XHJcbiAgICAgICAgZXhwZWN0KGNhcmRzLmxlbmd0aCkudG9FcXVhbCg1KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoY2FyZHNbaV0pLnRleHQoKS50cmltKCkpLnRvRXF1YWwoTnVtYmVyKGkpLnRvU3RyaW5nKDEwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3dzIG5vIHJlc3VsdHMgbWVzc2FnZSBpZiB0aGVyZSBhcmUgbm8gaXRlbXMnLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gU2VuZCBubyByZXN1bHRzIGJhY2suXHJcbiAgICAgICAgc2V0UmVzdWx0cygwKTtcclxuICAgICAgICBjb21waWxlKCk7XHJcblxyXG4gICAgICAgIGxldCBtc2cgPSBlbGVtZW50LmZpbmQoJ2gzJyk7XHJcbiAgICAgICAgZXhwZWN0KG1zZy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgZXhwZWN0KG1zZy50ZXh0KCkudHJpbSgpKS50b0VxdWFsKCd1aV9ub19yZXN1bHRzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncGFnZXInLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGFnZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmZpbmQoJyNjYXJkTGlzdFBhZ2VyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnaXMgaGlkZGVuIGlmIHRoZXJlIGlzIG9ubHkgb25lIHBhZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIERlZmF1bHRzIHRvIDUgcmVzdWx0cy5cclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZ2V0UGFnZXIoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBzaG93biBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgcGFnZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEdpdmUgaXQgdHdvIHBhZ2VzLlxyXG4gICAgICAgICAgICBzZXRSZXN1bHRzKDE1KTtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZ2V0UGFnZXIoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZWZldGNoZXMgd2hlbiBwYWdlciBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gR2l2ZSBpdCB0d28gcGFnZXMuXHJcbiAgICAgICAgICAgIHNldFJlc3VsdHMoMTUpO1xyXG4gICAgICAgICAgICBjb21waWxlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDbGljayB0aGUgXCJuZXh0XCIgYnV0dG9uXCJcclxuICAgICAgICAgICAgbGV0IHBhZ2VyID0gZ2V0UGFnZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHBhZ2VyLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgbGV0IGJ0bnMgPSBwYWdlci5maW5kKCdhJyk7XHJcbiAgICAgICAgICAgIGxldCBuZXh0QnRuID0gYW5ndWxhci5lbGVtZW50KGJ0bnNbYnRucy5sZW5ndGggLSAxXSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtc0Z1bmMuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgbmV4dEJ0bi5jbGljaygpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGl0ZW1zRnVuYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoMTIsIDEyLCB7fSwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
