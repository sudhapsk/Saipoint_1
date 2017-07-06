System.register(['test/js/TestInitializer', 'common/dataview/column/ColumnModule'], function (_export) {
    'use strict';

    var columnModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewColumnColumnModule) {
            columnModule = _commonDataviewColumnColumnModule['default'];
        }],
        execute: function () {

            describe('ColumnDataDirectiveCtrl', function () {
                var model = {
                    git: 'jiggy'
                },
                    $controller = undefined,
                    configData = undefined,
                    config = undefined,
                    filter1 = undefined,
                    filter2 = undefined,
                    columnConfigService = undefined;

                beforeEach(module(columnModule));

                beforeEach(inject(function (_$controller_, _columnConfigService_, ColumnConfig) {
                    $controller = _$controller_;
                    columnConfigService = _columnConfigService_;

                    // Setup a column config to test with.
                    configData = {
                        dataIndex: 'git'
                    };
                    config = new ColumnConfig(configData);

                    // Create a couple of fake filters to test with.
                    var module = angular.module(columnModule);
                    filter1 = jasmine.createSpy('filter1').and.callFake(function (value) {
                        return 'filter1Value';
                    });
                    filter2 = jasmine.createSpy('filter2').and.callFake(function (value) {
                        return 'filter2Value';
                    });
                    module.filter('filter1', function () {
                        return filter1;
                    });
                    module.filter('filter2', function () {
                        return filter2;
                    });
                }));

                function getController(colConfig, model) {
                    return $controller('ColumnDataDirectiveCtrl', {
                        columnConfigService: columnConfigService
                    }, {
                        spColumnConfig: colConfig,
                        spModel: model
                    });
                }

                describe('constructor', function () {
                    it('throws with no column config', function () {
                        expect(function () {
                            return getController(null, model);
                        }).toThrow();
                    });

                    it('throws with no model', function () {
                        expect(function () {
                            return getController(config, null);
                        }).toThrow();
                    });
                });

                it('getFilteredValue() calls a chain of filters with the object value', function () {
                    // Setup the renderer and spy to return these as filteres.
                    config.renderer = 'filter1, filter2';
                    spyOn(columnConfigService, 'getFilterRenderers').and.returnValue(['filter1', 'filter2']);

                    var ctrl = getController(config, model),
                        filtered = ctrl.getFilteredValue();

                    expect(columnConfigService.getFilterRenderers).toHaveBeenCalledWith(config.renderer);
                    expect(filter1).toHaveBeenCalledWith(model.git, model);
                    expect(filter2).toHaveBeenCalledWith('filter1Value', model);
                    expect(filtered).toEqual('filter2Value');
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy9jb2x1bW4vQ29sdW1uRGF0YURpcmVjdGl2ZUN0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsd0NBQXdDLFVBQVUsU0FBUztJQUF2Rzs7SUFHSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLGVBQWUsa0NBQWtDOztRQUVyRCxTQUFTLFlBQVk7O1lBSDdCLFNBQVMsMkJBQTJCLFlBQVc7Z0JBQzNDLElBQUksUUFBUTtvQkFDSixLQUFLOztvQkFFVCxjQUFXO29CQUFFLGFBQVU7b0JBQUUsU0FBTTtvQkFBRSxVQUFPO29CQUFFLFVBQU87b0JBQUUsc0JBQW1COztnQkFFMUUsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsZUFBZSx1QkFBdUIsY0FBYztvQkFDM0UsY0FBYztvQkFDZCxzQkFBc0I7OztvQkFHdEIsYUFBYTt3QkFDVCxXQUFXOztvQkFFZixTQUFTLElBQUksYUFBYTs7O29CQUcxQixJQUFNLFNBQVMsUUFBUSxPQUFPO29CQUM5QixVQUFVLFFBQVEsVUFBVSxXQUFXLElBQUksU0FBUyxVQUFDLE9BQUs7d0JBVzFDLE9BWCtDOztvQkFDL0QsVUFBVSxRQUFRLFVBQVUsV0FBVyxJQUFJLFNBQVMsVUFBQyxPQUFLO3dCQWExQyxPQWIrQzs7b0JBQy9ELE9BQU8sT0FBTyxXQUFXLFlBQUE7d0JBZVQsT0FmZTs7b0JBQy9CLE9BQU8sT0FBTyxXQUFXLFlBQUE7d0JBaUJULE9BakJlOzs7O2dCQUduQyxTQUFTLGNBQWMsV0FBVyxPQUFPO29CQUNyQyxPQUFPLFlBQVksMkJBQTJCO3dCQUN0QyxxQkFBcUI7dUJBQ3RCO3dCQUNDLGdCQUFnQjt3QkFDaEIsU0FBUzs7OztnQkFJckIsU0FBUyxlQUFlLFlBQVc7b0JBQy9CLEdBQUcsZ0NBQWdDLFlBQVc7d0JBQzFDLE9BQU8sWUFBQTs0QkFtQlMsT0FuQkgsY0FBYyxNQUFNOzJCQUFROzs7b0JBRzdDLEdBQUcsd0JBQXdCLFlBQVc7d0JBQ2xDLE9BQU8sWUFBQTs0QkFxQlMsT0FyQkgsY0FBYyxRQUFROzJCQUFPOzs7O2dCQUlsRCxHQUFHLHFFQUFxRSxZQUFXOztvQkFFL0UsT0FBTyxXQUFXO29CQUNsQixNQUFNLHFCQUFxQixzQkFBc0IsSUFBSSxZQUFZLENBQUMsV0FBVzs7b0JBRTdFLElBQUksT0FBTyxjQUFjLFFBQVE7d0JBQzdCLFdBQVcsS0FBSzs7b0JBRXBCLE9BQU8sb0JBQW9CLG9CQUFvQixxQkFBcUIsT0FBTztvQkFDM0UsT0FBTyxTQUFTLHFCQUFxQixNQUFNLEtBQUs7b0JBQ2hELE9BQU8sU0FBUyxxQkFBcUIsZ0JBQWdCO29CQUNyRCxPQUFPLFVBQVUsUUFBUTs7Ozs7R0EyQjlCIiwiZmlsZSI6ImNvbW1vbi9kYXRhdmlldy9jb2x1bW4vQ29sdW1uRGF0YURpcmVjdGl2ZUN0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgY29sdW1uTW9kdWxlIGZyb20gJ2NvbW1vbi9kYXRhdmlldy9jb2x1bW4vQ29sdW1uTW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdDb2x1bW5EYXRhRGlyZWN0aXZlQ3RybCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IG1vZGVsID0ge1xyXG4gICAgICAgICAgICBnaXQ6ICdqaWdneSdcclxuICAgICAgICB9LFxyXG4gICAgICAgICRjb250cm9sbGVyLCBjb25maWdEYXRhLCBjb25maWcsIGZpbHRlcjEsIGZpbHRlcjIsIGNvbHVtbkNvbmZpZ1NlcnZpY2U7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY29sdW1uTW9kdWxlKSk7XHJcblxyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXywgX2NvbHVtbkNvbmZpZ1NlcnZpY2VfLCBDb2x1bW5Db25maWcpIHtcclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgY29sdW1uQ29uZmlnU2VydmljZSA9IF9jb2x1bW5Db25maWdTZXJ2aWNlXztcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgYSBjb2x1bW4gY29uZmlnIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICBjb25maWdEYXRhID0ge1xyXG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdnaXQnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25maWcgPSBuZXcgQ29sdW1uQ29uZmlnKGNvbmZpZ0RhdGEpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBjb3VwbGUgb2YgZmFrZSBmaWx0ZXJzIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICBjb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShjb2x1bW5Nb2R1bGUpO1xyXG4gICAgICAgIGZpbHRlcjEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZmlsdGVyMScpLmFuZC5jYWxsRmFrZSgodmFsdWUpID0+ICdmaWx0ZXIxVmFsdWUnKTtcclxuICAgICAgICBmaWx0ZXIyID0gamFzbWluZS5jcmVhdGVTcHkoJ2ZpbHRlcjInKS5hbmQuY2FsbEZha2UoKHZhbHVlKSA9PiAnZmlsdGVyMlZhbHVlJyk7XHJcbiAgICAgICAgbW9kdWxlLmZpbHRlcignZmlsdGVyMScsICgpID0+IGZpbHRlcjEpO1xyXG4gICAgICAgIG1vZHVsZS5maWx0ZXIoJ2ZpbHRlcjInLCAoKSA9PiBmaWx0ZXIyKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDb250cm9sbGVyKGNvbENvbmZpZywgbW9kZWwpIHtcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ0NvbHVtbkRhdGFEaXJlY3RpdmVDdHJsJywge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uQ29uZmlnU2VydmljZTogY29sdW1uQ29uZmlnU2VydmljZVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBzcENvbHVtbkNvbmZpZzogY29sQ29uZmlnLFxyXG4gICAgICAgICAgICAgICAgc3BNb2RlbDogbW9kZWxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIGNvbHVtbiBjb25maWcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGdldENvbnRyb2xsZXIobnVsbCwgbW9kZWwpKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBtb2RlbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gZ2V0Q29udHJvbGxlcihjb25maWcsIG51bGwpKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnZ2V0RmlsdGVyZWRWYWx1ZSgpIGNhbGxzIGEgY2hhaW4gb2YgZmlsdGVycyB3aXRoIHRoZSBvYmplY3QgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBTZXR1cCB0aGUgcmVuZGVyZXIgYW5kIHNweSB0byByZXR1cm4gdGhlc2UgYXMgZmlsdGVyZXMuXHJcbiAgICAgICAgY29uZmlnLnJlbmRlcmVyID0gJ2ZpbHRlcjEsIGZpbHRlcjInO1xyXG4gICAgICAgIHNweU9uKGNvbHVtbkNvbmZpZ1NlcnZpY2UsICdnZXRGaWx0ZXJSZW5kZXJlcnMnKS5hbmQucmV0dXJuVmFsdWUoWydmaWx0ZXIxJywgJ2ZpbHRlcjInXSk7XHJcblxyXG4gICAgICAgIGxldCBjdHJsID0gZ2V0Q29udHJvbGxlcihjb25maWcsIG1vZGVsKSxcclxuICAgICAgICAgICAgZmlsdGVyZWQgPSBjdHJsLmdldEZpbHRlcmVkVmFsdWUoKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGNvbHVtbkNvbmZpZ1NlcnZpY2UuZ2V0RmlsdGVyUmVuZGVyZXJzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjb25maWcucmVuZGVyZXIpO1xyXG4gICAgICAgIGV4cGVjdChmaWx0ZXIxKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2RlbC5naXQsIG1vZGVsKTtcclxuICAgICAgICBleHBlY3QoZmlsdGVyMikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2ZpbHRlcjFWYWx1ZScsIG1vZGVsKTtcclxuICAgICAgICBleHBlY3QoZmlsdGVyZWQpLnRvRXF1YWwoJ2ZpbHRlcjJWYWx1ZScpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
