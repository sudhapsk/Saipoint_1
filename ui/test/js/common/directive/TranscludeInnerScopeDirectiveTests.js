System.register(['test/js/TestInitializer', 'common/directive/DirectiveModule'], function (_export) {
    'use strict';

    var directiveModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDirectiveDirectiveModule) {
            directiveModule = _commonDirectiveDirectiveModule['default'];
        }],
        execute: function () {

            describe('TranscludeInnerScopeDirective', function () {

                var $compile = undefined,
                    element = undefined,
                    $scope = undefined;

                beforeEach(module(directiveModule));

                // Register a couple of directives to test with.
                beforeEach(module(function ($compileProvider) {
                    function createDirective(doTransclude) {
                        return function () {
                            return {
                                restrict: 'E',
                                scope: true,
                                transclude: doTransclude,
                                controller: function () {
                                    this.items = [1, 2, 3];
                                },
                                controllerAs: 'parentCtrl',
                                template: '<div ng-repeat="item in parentCtrl.items" sp-transclude-inner-scope></div>'
                            };
                        };
                    }

                    $compileProvider.directive('parentNoTransclude', createDirective(false));
                    $compileProvider.directive('parent', createDirective(true));
                }));

                beforeEach(inject(function (_$compile_, $rootScope) {
                    $compile = _$compile_;
                    $scope = $rootScope;
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                function compile(eltDef) {
                    element = angular.element(eltDef);
                    $compile(element)($scope);
                    $scope.$digest();
                    return element;
                }

                it('vomits when not included in a transclude directive', function () {
                    var elt = '<parent-no-transclude>{{ item }}</parent-no-transclude>';
                    expect(function () {
                        return compile(elt);
                    }).toThrow();
                });

                it('uses the inner scope when rendering transcluded content', function () {
                    var elt = '<parent>{{ item }}</parent>';
                    compile(elt);

                    var items = element.find('div');
                    expect(items.length).toEqual(3);
                    expect(angular.element(items[0]).text().trim()).toEqual('1');
                    expect(angular.element(items[1]).text().trim()).toEqual('2');
                    expect(angular.element(items[2]).text().trim()).toEqual('3');
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kaXJlY3RpdmUvVHJhbnNjbHVkZUlubmVyU2NvcGVEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLFVBQVUsU0FBUztJQUNoRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsaUNBQWlDO1lBQ3ZGLGtCQUFrQixnQ0FBZ0M7O1FBRXRELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxpQ0FBaUMsWUFBTTs7Z0JBRTVDLElBQUksV0FBUTtvQkFBRSxVQUFPO29CQUFFLFNBQU07O2dCQUU3QixXQUFXLE9BQU87OztnQkFHbEIsV0FBVyxPQUFPLFVBQUMsa0JBQXFCO29CQUNwQyxTQUFTLGdCQUFnQixjQUFjO3dCQUNuQyxPQUFPLFlBQVc7NEJBQ2QsT0FBTztnQ0FDSCxVQUFVO2dDQUNWLE9BQU87Z0NBQ1AsWUFBWTtnQ0FDWixZQUFZLFlBQVc7b0NBQ25CLEtBQUssUUFBUSxDQUFFLEdBQUcsR0FBRzs7Z0NBRXpCLGNBQWM7Z0NBQ2QsVUFBUTs7Ozs7b0JBS3BCLGlCQUFpQixVQUFVLHNCQUFzQixnQkFBZ0I7b0JBQ2pFLGlCQUFpQixVQUFVLFVBQVUsZ0JBQWdCOzs7Z0JBR3pELFdBQVcsT0FBTyxVQUFDLFlBQVksWUFBZTtvQkFDMUMsV0FBVztvQkFDWCxTQUFTOzs7Z0JBR2IsVUFBVSxZQUFNO29CQUNaLElBQUksU0FBUzt3QkFDVCxRQUFROzs7O2dCQUloQixTQUFTLFFBQVEsUUFBUTtvQkFDckIsVUFBVSxRQUFRLFFBQVE7b0JBQzFCLFNBQVMsU0FBUztvQkFDbEIsT0FBTztvQkFDUCxPQUFPOzs7Z0JBR1gsR0FBRyxzREFBc0QsWUFBTTtvQkFDM0QsSUFBSSxNQUFHO29CQUNQLE9BQU8sWUFBQTt3QkFVUyxPQVZILFFBQVE7dUJBQU07OztnQkFHL0IsR0FBRywyREFBMkQsWUFBTTtvQkFDaEUsSUFBSSxNQUFHO29CQUNQLFFBQVE7O29CQUVSLElBQUksUUFBUSxRQUFRLEtBQUs7b0JBQ3pCLE9BQU8sTUFBTSxRQUFRLFFBQVE7b0JBQzdCLE9BQU8sUUFBUSxRQUFRLE1BQU0sSUFBSSxPQUFPLFFBQVEsUUFBUTtvQkFDeEQsT0FBTyxRQUFRLFFBQVEsTUFBTSxJQUFJLE9BQU8sUUFBUSxRQUFRO29CQUN4RCxPQUFPLFFBQVEsUUFBUSxNQUFNLElBQUksT0FBTyxRQUFRLFFBQVE7Ozs7O0dBZ0I3RCIsImZpbGUiOiJjb21tb24vZGlyZWN0aXZlL1RyYW5zY2x1ZGVJbm5lclNjb3BlRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGRpcmVjdGl2ZU1vZHVsZSBmcm9tICdjb21tb24vZGlyZWN0aXZlL0RpcmVjdGl2ZU1vZHVsZSc7XHJcblxyXG5kZXNjcmliZSgnVHJhbnNjbHVkZUlubmVyU2NvcGVEaXJlY3RpdmUnLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0ICRjb21waWxlLCBlbGVtZW50LCAkc2NvcGU7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZGlyZWN0aXZlTW9kdWxlKSk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgYSBjb3VwbGUgb2YgZGlyZWN0aXZlcyB0byB0ZXN0IHdpdGguXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZSgoJGNvbXBpbGVQcm92aWRlcikgPT4ge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZURpcmVjdGl2ZShkb1RyYW5zY2x1ZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zY2x1ZGU6IGRvVHJhbnNjbHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFsgMSwgMiwgMyBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncGFyZW50Q3RybCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGA8ZGl2IG5nLXJlcGVhdD1cIml0ZW0gaW4gcGFyZW50Q3RybC5pdGVtc1wiIHNwLXRyYW5zY2x1ZGUtaW5uZXItc2NvcGU+PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRjb21waWxlUHJvdmlkZXIuZGlyZWN0aXZlKCdwYXJlbnROb1RyYW5zY2x1ZGUnLCBjcmVhdGVEaXJlY3RpdmUoZmFsc2UpKTtcclxuICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmRpcmVjdGl2ZSgncGFyZW50JywgY3JlYXRlRGlyZWN0aXZlKHRydWUpKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdCgoXyRjb21waWxlXywgJHJvb3RTY29wZSkgPT4ge1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKGVsdERlZikge1xyXG4gICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWx0RGVmKTtcclxuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXQoJ3ZvbWl0cyB3aGVuIG5vdCBpbmNsdWRlZCBpbiBhIHRyYW5zY2x1ZGUgZGlyZWN0aXZlJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBlbHQgPSBgPHBhcmVudC1uby10cmFuc2NsdWRlPnt7IGl0ZW0gfX08L3BhcmVudC1uby10cmFuc2NsdWRlPmA7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IGNvbXBpbGUoZWx0KSkudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3VzZXMgdGhlIGlubmVyIHNjb3BlIHdoZW4gcmVuZGVyaW5nIHRyYW5zY2x1ZGVkIGNvbnRlbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGVsdCA9IGA8cGFyZW50Pnt7IGl0ZW0gfX08L3BhcmVudD5gO1xyXG4gICAgICAgIGNvbXBpbGUoZWx0KTtcclxuXHJcbiAgICAgICAgbGV0IGl0ZW1zID0gZWxlbWVudC5maW5kKCdkaXYnKTtcclxuICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDMpO1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoaXRlbXNbMF0pLnRleHQoKS50cmltKCkpLnRvRXF1YWwoJzEnKTtcclxuICAgICAgICBleHBlY3QoYW5ndWxhci5lbGVtZW50KGl0ZW1zWzFdKS50ZXh0KCkudHJpbSgpKS50b0VxdWFsKCcyJyk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChpdGVtc1syXSkudGV4dCgpLnRyaW0oKSkudG9FcXVhbCgnMycpO1xyXG4gICAgfSk7XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
