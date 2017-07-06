System.register(['test/js/TestInitializer', 'common/dataview/column/ColumnModule'], function (_export) {
    'use strict';

    var columnModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewColumnColumnModule) {
            columnModule = _commonDataviewColumnColumnModule['default'];
        }],
        execute: function () {

            describe('ColumnDataDirective', function () {
                var eltDef = '<sp-column-data sp-column-config="colConfig" sp-model="model" sp-text-only="textOnly" />',
                    model = {
                    feels: 'good to be a gangsta!'
                },
                    $compile = undefined,
                    ColumnConfig = undefined,
                    $rootScope = undefined,
                    config = undefined,
                    configData = undefined,
                    $scope = undefined,
                    testFilter1 = undefined,
                    testFilter2 = undefined;

                beforeEach(module(columnModule));

                beforeEach(inject(function ($injector) {
                    var module = angular.module(columnModule);

                    // Create a couple of fake filters to test with.
                    testFilter1 = jasmine.createSpy('testFilter1').and.callFake(function (value) {
                        return value;
                    });
                    testFilter2 = jasmine.createSpy('testFilter2').and.callFake(function (value) {
                        return value;
                    });
                    module.filter('testFilter1', function () {
                        return testFilter1;
                    });
                    module.filter('testFilter2', function () {
                        return testFilter2;
                    });

                    // Create a fake directive to test with.
                    function testDirectiveFunc() {
                        return {
                            restrict: 'E',
                            scope: {
                                spColumnConfig: '=',
                                spModel: '=',
                                spTextOnly: '='
                            },
                            template: '<div id="column">{{ spColumnConfig.dataIndex }}</div>\n                     <div id="model">{{ spModel.feels }}</div>\n                     <div id="text">{{ spTextOnly }}</div>'
                        };
                    }

                    // For some reason, running this before each test causes the directive to be registered
                    // multiple times (which causes a "multiple directives asking for isolated scope" error).
                    // Make sure it's not already registered before we register it.
                    if (!$injector.has('columnDataDirectiveTestDirective')) {
                        module.directive('columnDataDirectiveTest', testDirectiveFunc);
                    }
                }));

                beforeEach(inject(function (_$compile_, _ColumnConfig_, _$rootScope_) {
                    $compile = _$compile_;
                    ColumnConfig = _ColumnConfig_;
                    $rootScope = _$rootScope_;

                    $scope = $rootScope.$new();

                    configData = {
                        dataIndex: 'feels',
                        label: 'How does it feel?'
                    };
                    config = new ColumnConfig(configData);
                }));

                function compile(colConfig, model, textOnly) {
                    var elt = angular.element(eltDef);

                    $scope.colConfig = colConfig;
                    $scope.model = model;
                    $scope.textOnly = textOnly;

                    $compile(elt)($scope);
                    $scope.$apply();
                    return elt;
                }

                it('pukes if there is no sp-column-config', function () {
                    expect(function () {
                        return compile(null, {});
                    }).toThrow();
                });

                it('pukes if there is no sp-model', function () {
                    expect(function () {
                        return compile(config, null);
                    }).toThrow();
                });

                it('calls ColumnConfig.getObjectValue() to get the value', function () {
                    spyOn(config, 'getObjectValue').and.callThrough();
                    compile(config, model);
                    expect(config.getObjectValue).toHaveBeenCalledWith(model);
                });

                function compileWithRenderer(renderer) {
                    configData.renderer = renderer;
                    var elt = compile(new ColumnConfig(configData), model);
                    return elt;
                }

                describe('filter renderers', function () {
                    it('work with a single renderer', function () {
                        compileWithRenderer('testFilter1');
                        expect(testFilter1).toHaveBeenCalledWith(model.feels, model);
                    });

                    it('work with multiple renderers', function () {
                        compileWithRenderer('testFilter1,testFilter2');
                        expect(testFilter1).toHaveBeenCalledWith(model.feels, model);
                        expect(testFilter2).toHaveBeenCalledWith(model.feels, model);
                    });

                    it('work with multiple renderers when there is whitespace in the renderer string', function () {
                        compileWithRenderer(' testFilter1 , testFilter2 ');
                        expect(testFilter1).toHaveBeenCalledWith(model.feels, model);
                        expect(testFilter2).toHaveBeenCalledWith(model.feels, model);
                    });

                    it('throw when there are multiple renderers and one is not a filter', function () {
                        expect(function () {
                            return compileWithRenderer('testFilter1, notAFilter');
                        }).toThrow();
                        expect(function () {
                            return compileWithRenderer('notAFilter, testFilter2');
                        }).toThrow();
                        expect(function () {
                            return compileWithRenderer('testFilter1, notAFilter, testFilter2');
                        }).toThrow();
                    });
                });

                it('renders using a directive', function () {
                    var elt = compileWithRenderer('columnDataDirectiveTest');
                    expect(elt.find('#column').text()).toEqual(config.dataIndex);
                    expect(elt.find('#model').text()).toEqual(model.feels);
                });

                it('applies the date filter when dateStyle is supplied', function () {
                    config.dateStyle = 'shortDate';
                    config.dataIndex = 'date';
                    model.date = new Date(1453303250426);
                    var elt = compile(config, model);
                    expect(elt.text().trim()).toEqual('1/20/16');
                });

                it('just prints the value when no renderer or dateStyle are specified', function () {
                    var elt = compile(config, model);
                    expect(elt.text().trim()).toEqual(model.feels);
                });

                it('passes textOnly flag to the directive', function () {
                    configData.renderer = 'columnDataDirectiveTest';
                    var elt = compile(new ColumnConfig(configData), model, true);
                    expect(elt.find('#text').text()).toEqual('true');
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy9jb2x1bW4vQ29sdW1uRGF0YURpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQix3Q0FBd0MsVUFBVSxTQUFTO0lBQXZHOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsZUFBZSxrQ0FBa0M7O1FBRXJELFNBQVMsWUFBWTs7WUFIN0IsU0FBUyx1QkFBdUIsWUFBVztnQkFDdkMsSUFBSSxTQUFTO29CQUNULFFBQVE7b0JBQ0osT0FBTzs7b0JBRVgsV0FBUTtvQkFBRSxlQUFZO29CQUFFLGFBQVU7b0JBQUUsU0FBTTtvQkFBRSxhQUFVO29CQUFFLFNBQU07b0JBQUUsY0FBVztvQkFBRSxjQUFXOztnQkFFNUYsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsV0FBVztvQkFDbEMsSUFBTSxTQUFTLFFBQVEsT0FBTzs7O29CQUc5QixjQUFjLFFBQVEsVUFBVSxlQUFlLElBQUksU0FBUyxVQUFDLE9BQUs7d0JBYWxELE9BYnVEOztvQkFDdkUsY0FBYyxRQUFRLFVBQVUsZUFBZSxJQUFJLFNBQVMsVUFBQyxPQUFLO3dCQWVsRCxPQWZ1RDs7b0JBQ3ZFLE9BQU8sT0FBTyxlQUFlLFlBQUE7d0JBaUJiLE9BakJtQjs7b0JBQ25DLE9BQU8sT0FBTyxlQUFlLFlBQUE7d0JBbUJiLE9BbkJtQjs7OztvQkFHbkMsU0FBUyxvQkFBb0I7d0JBQ3pCLE9BQU87NEJBQ0gsVUFBVTs0QkFDVixPQUFPO2dDQUNILGdCQUFnQjtnQ0FDaEIsU0FBUztnQ0FDVCxZQUFZOzs0QkFFaEIsVUFBUTs7Ozs7OztvQkFVaEIsSUFBSSxDQUFDLFVBQVUsSUFBSSxxQ0FBcUM7d0JBQ3BELE9BQU8sVUFBVSwyQkFBMkI7Ozs7Z0JBSXBELFdBQVcsT0FBTyxVQUFTLFlBQVksZ0JBQWdCLGNBQWM7b0JBQ2pFLFdBQVc7b0JBQ1gsZUFBZTtvQkFDZixhQUFhOztvQkFFYixTQUFTLFdBQVc7O29CQUVwQixhQUFhO3dCQUNULFdBQVc7d0JBQ1gsT0FBTzs7b0JBRVgsU0FBUyxJQUFJLGFBQWE7OztnQkFHOUIsU0FBUyxRQUFRLFdBQVcsT0FBTyxVQUFVO29CQUN6QyxJQUFJLE1BQU0sUUFBUSxRQUFROztvQkFFMUIsT0FBTyxZQUFZO29CQUNuQixPQUFPLFFBQVE7b0JBQ2YsT0FBTyxXQUFXOztvQkFFbEIsU0FBUyxLQUFLO29CQUNkLE9BQU87b0JBQ1AsT0FBTzs7O2dCQUdYLEdBQUcseUNBQXlDLFlBQVc7b0JBQ25ELE9BQU8sWUFBQTt3QkFrQlMsT0FsQkgsUUFBUSxNQUFNO3VCQUFLOzs7Z0JBR3BDLEdBQUcsaUNBQWlDLFlBQVc7b0JBQzNDLE9BQU8sWUFBQTt3QkFvQlMsT0FwQkgsUUFBUSxRQUFRO3VCQUFPOzs7Z0JBR3hDLEdBQUcsd0RBQXdELFlBQVc7b0JBQ2xFLE1BQU0sUUFBUSxrQkFBa0IsSUFBSTtvQkFDcEMsUUFBUSxRQUFRO29CQUNoQixPQUFPLE9BQU8sZ0JBQWdCLHFCQUFxQjs7O2dCQUd2RCxTQUFTLG9CQUFvQixVQUFVO29CQUNuQyxXQUFXLFdBQVc7b0JBQ3RCLElBQUksTUFBTSxRQUFRLElBQUksYUFBYSxhQUFhO29CQUNoRCxPQUFPOzs7Z0JBR1gsU0FBUyxvQkFBb0IsWUFBVztvQkFDcEMsR0FBRywrQkFBK0IsWUFBVzt3QkFDekMsb0JBQW9CO3dCQUNwQixPQUFPLGFBQWEscUJBQXFCLE1BQU0sT0FBTzs7O29CQUcxRCxHQUFHLGdDQUFnQyxZQUFXO3dCQUMxQyxvQkFBb0I7d0JBQ3BCLE9BQU8sYUFBYSxxQkFBcUIsTUFBTSxPQUFPO3dCQUN0RCxPQUFPLGFBQWEscUJBQXFCLE1BQU0sT0FBTzs7O29CQUcxRCxHQUFHLGdGQUFnRixZQUFXO3dCQUMxRixvQkFBb0I7d0JBQ3BCLE9BQU8sYUFBYSxxQkFBcUIsTUFBTSxPQUFPO3dCQUN0RCxPQUFPLGFBQWEscUJBQXFCLE1BQU0sT0FBTzs7O29CQUcxRCxHQUFHLG1FQUFtRSxZQUFXO3dCQUM3RSxPQUFPLFlBQUE7NEJBc0JTLE9BdEJILG9CQUFvQjsyQkFBNEI7d0JBQzdELE9BQU8sWUFBQTs0QkF3QlMsT0F4Qkgsb0JBQW9COzJCQUE0Qjt3QkFDN0QsT0FBTyxZQUFBOzRCQTBCUyxPQTFCSCxvQkFBb0I7MkJBQXlDOzs7O2dCQUlsRixHQUFHLDZCQUE2QixZQUFXO29CQUN2QyxJQUFJLE1BQU0sb0JBQW9CO29CQUM5QixPQUFPLElBQUksS0FBSyxXQUFXLFFBQVEsUUFBUSxPQUFPO29CQUNsRCxPQUFPLElBQUksS0FBSyxVQUFVLFFBQVEsUUFBUSxNQUFNOzs7Z0JBR3BELEdBQUcsc0RBQXNELFlBQVc7b0JBQ2hFLE9BQU8sWUFBWTtvQkFDbkIsT0FBTyxZQUFZO29CQUNuQixNQUFNLE9BQU8sSUFBSSxLQUFLO29CQUN0QixJQUFJLE1BQU0sUUFBUSxRQUFRO29CQUMxQixPQUFPLElBQUksT0FBTyxRQUFRLFFBQVE7OztnQkFHdEMsR0FBRyxxRUFBcUUsWUFBVztvQkFDL0UsSUFBSSxNQUFNLFFBQVEsUUFBUTtvQkFDMUIsT0FBTyxJQUFJLE9BQU8sUUFBUSxRQUFRLE1BQU07OztnQkFHNUMsR0FBRyx5Q0FBeUMsWUFBVztvQkFDbkQsV0FBVyxXQUFXO29CQUN0QixJQUFJLE1BQU0sUUFBUSxJQUFJLGFBQWEsYUFBYSxPQUFPO29CQUN2RCxPQUFPLElBQUksS0FBSyxTQUFTLFFBQVEsUUFBUTs7Ozs7R0FnQzlDIiwiZmlsZSI6ImNvbW1vbi9kYXRhdmlldy9jb2x1bW4vQ29sdW1uRGF0YURpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBjb2x1bW5Nb2R1bGUgZnJvbSAnY29tbW9uL2RhdGF2aWV3L2NvbHVtbi9Db2x1bW5Nb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0NvbHVtbkRhdGFEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBlbHREZWYgPSAnPHNwLWNvbHVtbi1kYXRhIHNwLWNvbHVtbi1jb25maWc9XCJjb2xDb25maWdcIiBzcC1tb2RlbD1cIm1vZGVsXCIgc3AtdGV4dC1vbmx5PVwidGV4dE9ubHlcIiAvPicsXHJcbiAgICAgICAgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgIGZlZWxzOiAnZ29vZCB0byBiZSBhIGdhbmdzdGEhJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJGNvbXBpbGUsIENvbHVtbkNvbmZpZywgJHJvb3RTY29wZSwgY29uZmlnLCBjb25maWdEYXRhLCAkc2NvcGUsIHRlc3RGaWx0ZXIxLCB0ZXN0RmlsdGVyMjtcclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjb2x1bW5Nb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkaW5qZWN0b3IpIHtcclxuICAgICAgICBjb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShjb2x1bW5Nb2R1bGUpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBjb3VwbGUgb2YgZmFrZSBmaWx0ZXJzIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICB0ZXN0RmlsdGVyMSA9IGphc21pbmUuY3JlYXRlU3B5KCd0ZXN0RmlsdGVyMScpLmFuZC5jYWxsRmFrZSgodmFsdWUpID0+IHZhbHVlKTtcclxuICAgICAgICB0ZXN0RmlsdGVyMiA9IGphc21pbmUuY3JlYXRlU3B5KCd0ZXN0RmlsdGVyMicpLmFuZC5jYWxsRmFrZSgodmFsdWUpID0+IHZhbHVlKTtcclxuICAgICAgICBtb2R1bGUuZmlsdGVyKCd0ZXN0RmlsdGVyMScsICgpID0+IHRlc3RGaWx0ZXIxKTtcclxuICAgICAgICBtb2R1bGUuZmlsdGVyKCd0ZXN0RmlsdGVyMicsICgpID0+IHRlc3RGaWx0ZXIyKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgZmFrZSBkaXJlY3RpdmUgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3REaXJlY3RpdmVGdW5jKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BDb2x1bW5Db25maWc6ICc9JyxcclxuICAgICAgICAgICAgICAgICAgICBzcE1vZGVsOiAnPScsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BUZXh0T25seTogJz0nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6XHJcbiAgICAgICAgICAgICAgICAgICAgYDxkaXYgaWQ9XCJjb2x1bW5cIj57eyBzcENvbHVtbkNvbmZpZy5kYXRhSW5kZXggfX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cIm1vZGVsXCI+e3sgc3BNb2RlbC5mZWVscyB9fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidGV4dFwiPnt7IHNwVGV4dE9ubHkgfX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGb3Igc29tZSByZWFzb24sIHJ1bm5pbmcgdGhpcyBiZWZvcmUgZWFjaCB0ZXN0IGNhdXNlcyB0aGUgZGlyZWN0aXZlIHRvIGJlIHJlZ2lzdGVyZWRcclxuICAgICAgICAvLyBtdWx0aXBsZSB0aW1lcyAod2hpY2ggY2F1c2VzIGEgXCJtdWx0aXBsZSBkaXJlY3RpdmVzIGFza2luZyBmb3IgaXNvbGF0ZWQgc2NvcGVcIiBlcnJvcikuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIGl0J3Mgbm90IGFscmVhZHkgcmVnaXN0ZXJlZCBiZWZvcmUgd2UgcmVnaXN0ZXIgaXQuXHJcbiAgICAgICAgaWYgKCEkaW5qZWN0b3IuaGFzKCdjb2x1bW5EYXRhRGlyZWN0aXZlVGVzdERpcmVjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIG1vZHVsZS5kaXJlY3RpdmUoJ2NvbHVtbkRhdGFEaXJlY3RpdmVUZXN0JywgdGVzdERpcmVjdGl2ZUZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbXBpbGVfLCBfQ29sdW1uQ29uZmlnXywgXyRyb290U2NvcGVfKSB7XHJcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xyXG4gICAgICAgIENvbHVtbkNvbmZpZyA9IF9Db2x1bW5Db25maWdfO1xyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcblxyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG5cclxuICAgICAgICBjb25maWdEYXRhID0ge1xyXG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdmZWVscycsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnSG93IGRvZXMgaXQgZmVlbD8nXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25maWcgPSBuZXcgQ29sdW1uQ29uZmlnKGNvbmZpZ0RhdGEpO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUoY29sQ29uZmlnLCBtb2RlbCwgdGV4dE9ubHkpIHtcclxuICAgICAgICBsZXQgZWx0ID0gYW5ndWxhci5lbGVtZW50KGVsdERlZik7XHJcblxyXG4gICAgICAgICRzY29wZS5jb2xDb25maWcgPSBjb2xDb25maWc7XHJcbiAgICAgICAgJHNjb3BlLm1vZGVsID0gbW9kZWw7XHJcbiAgICAgICAgJHNjb3BlLnRleHRPbmx5ID0gdGV4dE9ubHk7XHJcblxyXG4gICAgICAgICRjb21waWxlKGVsdCkoJHNjb3BlKTtcclxuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgcmV0dXJuIGVsdDtcclxuICAgIH1cclxuXHJcbiAgICBpdCgncHVrZXMgaWYgdGhlcmUgaXMgbm8gc3AtY29sdW1uLWNvbmZpZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdCgoKSA9PiBjb21waWxlKG51bGwsIHt9KSkudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3B1a2VzIGlmIHRoZXJlIGlzIG5vIHNwLW1vZGVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IGNvbXBpbGUoY29uZmlnLCBudWxsKSkudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2NhbGxzIENvbHVtbkNvbmZpZy5nZXRPYmplY3RWYWx1ZSgpIHRvIGdldCB0aGUgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHlPbihjb25maWcsICdnZXRPYmplY3RWYWx1ZScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgIGNvbXBpbGUoY29uZmlnLCBtb2RlbCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5nZXRPYmplY3RWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9kZWwpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGlsZVdpdGhSZW5kZXJlcihyZW5kZXJlcikge1xyXG4gICAgICAgIGNvbmZpZ0RhdGEucmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgICAgICBsZXQgZWx0ID0gY29tcGlsZShuZXcgQ29sdW1uQ29uZmlnKGNvbmZpZ0RhdGEpLCBtb2RlbCk7XHJcbiAgICAgICAgcmV0dXJuIGVsdDtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnZmlsdGVyIHJlbmRlcmVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCd3b3JrIHdpdGggYSBzaW5nbGUgcmVuZGVyZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29tcGlsZVdpdGhSZW5kZXJlcigndGVzdEZpbHRlcjEnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRlc3RGaWx0ZXIxKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2RlbC5mZWVscywgbW9kZWwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnd29yayB3aXRoIG11bHRpcGxlIHJlbmRlcmVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb21waWxlV2l0aFJlbmRlcmVyKCd0ZXN0RmlsdGVyMSx0ZXN0RmlsdGVyMicpO1xyXG4gICAgICAgICAgICBleHBlY3QodGVzdEZpbHRlcjEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG1vZGVsLmZlZWxzLCBtb2RlbCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0RmlsdGVyMikudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9kZWwuZmVlbHMsIG1vZGVsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3dvcmsgd2l0aCBtdWx0aXBsZSByZW5kZXJlcnMgd2hlbiB0aGVyZSBpcyB3aGl0ZXNwYWNlIGluIHRoZSByZW5kZXJlciBzdHJpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29tcGlsZVdpdGhSZW5kZXJlcignIHRlc3RGaWx0ZXIxICwgdGVzdEZpbHRlcjIgJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0RmlsdGVyMSkudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9kZWwuZmVlbHMsIG1vZGVsKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRlc3RGaWx0ZXIyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2RlbC5mZWVscywgbW9kZWwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndGhyb3cgd2hlbiB0aGVyZSBhcmUgbXVsdGlwbGUgcmVuZGVyZXJzIGFuZCBvbmUgaXMgbm90IGEgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjb21waWxlV2l0aFJlbmRlcmVyKCd0ZXN0RmlsdGVyMSwgbm90QUZpbHRlcicpKS50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjb21waWxlV2l0aFJlbmRlcmVyKCdub3RBRmlsdGVyLCB0ZXN0RmlsdGVyMicpKS50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjb21waWxlV2l0aFJlbmRlcmVyKCd0ZXN0RmlsdGVyMSwgbm90QUZpbHRlciwgdGVzdEZpbHRlcjInKSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JlbmRlcnMgdXNpbmcgYSBkaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgZWx0ID0gY29tcGlsZVdpdGhSZW5kZXJlcignY29sdW1uRGF0YURpcmVjdGl2ZVRlc3QnKTtcclxuICAgICAgICBleHBlY3QoZWx0LmZpbmQoJyNjb2x1bW4nKS50ZXh0KCkpLnRvRXF1YWwoY29uZmlnLmRhdGFJbmRleCk7XHJcbiAgICAgICAgZXhwZWN0KGVsdC5maW5kKCcjbW9kZWwnKS50ZXh0KCkpLnRvRXF1YWwobW9kZWwuZmVlbHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2FwcGxpZXMgdGhlIGRhdGUgZmlsdGVyIHdoZW4gZGF0ZVN0eWxlIGlzIHN1cHBsaWVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uZmlnLmRhdGVTdHlsZSA9ICdzaG9ydERhdGUnO1xyXG4gICAgICAgIGNvbmZpZy5kYXRhSW5kZXggPSAnZGF0ZSc7XHJcbiAgICAgICAgbW9kZWwuZGF0ZSA9IG5ldyBEYXRlKDE0NTMzMDMyNTA0MjYpO1xyXG4gICAgICAgIGxldCBlbHQgPSBjb21waWxlKGNvbmZpZywgbW9kZWwpO1xyXG4gICAgICAgIGV4cGVjdChlbHQudGV4dCgpLnRyaW0oKSkudG9FcXVhbCgnMS8yMC8xNicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2p1c3QgcHJpbnRzIHRoZSB2YWx1ZSB3aGVuIG5vIHJlbmRlcmVyIG9yIGRhdGVTdHlsZSBhcmUgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGVsdCA9IGNvbXBpbGUoY29uZmlnLCBtb2RlbCk7XHJcbiAgICAgICAgZXhwZWN0KGVsdC50ZXh0KCkudHJpbSgpKS50b0VxdWFsKG1vZGVsLmZlZWxzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdwYXNzZXMgdGV4dE9ubHkgZmxhZyB0byB0aGUgZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uZmlnRGF0YS5yZW5kZXJlciA9ICdjb2x1bW5EYXRhRGlyZWN0aXZlVGVzdCc7XHJcbiAgICAgICAgbGV0IGVsdCA9IGNvbXBpbGUobmV3IENvbHVtbkNvbmZpZyhjb25maWdEYXRhKSwgbW9kZWwsIHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChlbHQuZmluZCgnI3RleHQnKS50ZXh0KCkpLnRvRXF1YWwoJ3RydWUnKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
