System.register(['test/js/TestInitializer', 'common/config/ConfigModule'], function (_export) {
    'use strict';

    var configModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonConfigConfigModule) {
            configModule = _commonConfigConfigModule['default'];
        }],
        execute: function () {

            describe('ColumnConfigServiceTests', function () {
                var filter1 = 'test1Filter',
                    filter2 = 'test2Filter',
                    columnConfigService = undefined,
                    $injector = undefined;

                beforeEach(module(configModule));

                beforeEach(inject(function (_columnConfigService_, _$injector_) {
                    columnConfigService = _columnConfigService_;
                    $injector = _$injector_;

                    // Mock out the injector to return true if our fake filters are called.
                    var origHasFunc = $injector.has;
                    $injector.has = jasmine.createSpy('has').and.callFake(function (name) {
                        if (filter1 === name || filter2 === name) {
                            return true;
                        }
                        return origHasFunc(name);
                    });
                }));

                describe('isFilter()', function () {
                    it('returns false if filter is null', function () {
                        expect(columnConfigService.isFilter(null)).toEqual(false);
                    });

                    it('returns false if the input is not a filter', function () {
                        expect(columnConfigService.isFilter('not a filter')).toEqual(false);
                    });

                    it('returns true if the input is a filter', function () {
                        expect(columnConfigService.isFilter('test1')).toEqual(true);
                    });
                });

                describe('getFilterRenderers()', function () {
                    it('returns null for null renderer string', function () {
                        expect(columnConfigService.getFilterRenderers(null)).toEqual(null);
                    });

                    it('returns null for a single renderer that is not a filter', function () {
                        expect(columnConfigService.getFilterRenderers('notAFilter')).toEqual(null);
                    });

                    it('returns null for multiple renderers that are not filters', function () {
                        expect(columnConfigService.getFilterRenderers('notAFilter, meNeither')).toEqual(null);
                    });

                    it('returns a single renderer that is a filter', function () {
                        expect(columnConfigService.getFilterRenderers('test1')).toEqual(['test1']);
                    });

                    it('returns multiple renderers that are filters', function () {
                        expect(columnConfigService.getFilterRenderers('test1,test2')).toEqual(['test1', 'test2']);
                    });

                    it('returns multiple renderers that are filters with whitespace', function () {
                        expect(columnConfigService.getFilterRenderers(' test1 , test2 ')).toEqual(['test1', 'test2']);
                    });

                    it('throws for multiple renders when one is a filter and one is not', function () {
                        expect(function () {
                            return columnConfigService.getFilterRenderers('test1,notAFilter');
                        }).toThrow();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9jb25maWcvQ29sdW1uQ29uZmlnU2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwrQkFBK0IsVUFBVSxTQUFTO0lBQTlGOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwyQkFBMkI7WUFDakYsZUFBZSwwQkFBMEI7O1FBRTdDLFNBQVMsWUFBWTs7WUFIN0IsU0FBUyw0QkFBNEIsWUFBVztnQkFDNUMsSUFBSSxVQUFVO29CQUNWLFVBQVU7b0JBQ1Ysc0JBQW1CO29CQUFFLFlBQVM7O2dCQUVsQyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyx1QkFBdUIsYUFBYTtvQkFDM0Qsc0JBQXNCO29CQUN0QixZQUFZOzs7b0JBR1osSUFBSSxjQUFjLFVBQVU7b0JBQzVCLFVBQVUsTUFBTSxRQUFRLFVBQVUsT0FBTyxJQUFJLFNBQVMsVUFBQyxNQUFTO3dCQUM1RCxJQUFJLFlBQWEsUUFBVSxZQUFZLE1BQU87NEJBQzFDLE9BQU87O3dCQUVYLE9BQU8sWUFBWTs7OztnQkFJM0IsU0FBUyxjQUFjLFlBQVc7b0JBQzlCLEdBQUcsbUNBQW1DLFlBQVc7d0JBQzdDLE9BQU8sb0JBQW9CLFNBQVMsT0FBTyxRQUFROzs7b0JBR3ZELEdBQUcsOENBQThDLFlBQVc7d0JBQ3hELE9BQU8sb0JBQW9CLFNBQVMsaUJBQWlCLFFBQVE7OztvQkFHakUsR0FBRyx5Q0FBeUMsWUFBVzt3QkFDbkQsT0FBTyxvQkFBb0IsU0FBUyxVQUFVLFFBQVE7Ozs7Z0JBSTlELFNBQVMsd0JBQXdCLFlBQVc7b0JBQ3hDLEdBQUcseUNBQXlDLFlBQVc7d0JBQ25ELE9BQU8sb0JBQW9CLG1CQUFtQixPQUFPLFFBQVE7OztvQkFHakUsR0FBRywyREFBMkQsWUFBVzt3QkFDckUsT0FBTyxvQkFBb0IsbUJBQW1CLGVBQWUsUUFBUTs7O29CQUd6RSxHQUFHLDREQUE0RCxZQUFXO3dCQUN0RSxPQUFPLG9CQUFvQixtQkFBbUIsMEJBQTBCLFFBQVE7OztvQkFHcEYsR0FBRyw4Q0FBOEMsWUFBVzt3QkFDeEQsT0FBTyxvQkFBb0IsbUJBQW1CLFVBQVUsUUFBUSxDQUFDOzs7b0JBR3JFLEdBQUcsK0NBQStDLFlBQVc7d0JBQ3pELE9BQU8sb0JBQW9CLG1CQUFtQixnQkFBZ0IsUUFBUSxDQUFDLFNBQVM7OztvQkFHcEYsR0FBRywrREFBK0QsWUFBVzt3QkFDekUsT0FBTyxvQkFBb0IsbUJBQW1CLG9CQUFvQixRQUFRLENBQUMsU0FBUzs7O29CQUd4RixHQUFHLG1FQUFtRSxZQUFXO3dCQUM3RSxPQUFPLFlBQUE7NEJBT1MsT0FQSCxvQkFBb0IsbUJBQW1COzJCQUFxQjs7Ozs7O0dBY2xGIiwiZmlsZSI6ImNvbW1vbi9jb25maWcvQ29sdW1uQ29uZmlnU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBjb25maWdNb2R1bGUgZnJvbSAnY29tbW9uL2NvbmZpZy9Db25maWdNb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0NvbHVtbkNvbmZpZ1NlcnZpY2VUZXN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGZpbHRlcjEgPSAndGVzdDFGaWx0ZXInLFxyXG4gICAgICAgIGZpbHRlcjIgPSAndGVzdDJGaWx0ZXInLFxyXG4gICAgICAgIGNvbHVtbkNvbmZpZ1NlcnZpY2UsICRpbmplY3RvcjtcclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjb25maWdNb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfY29sdW1uQ29uZmlnU2VydmljZV8sIF8kaW5qZWN0b3JfKSB7XHJcbiAgICAgICAgY29sdW1uQ29uZmlnU2VydmljZSA9IF9jb2x1bW5Db25maWdTZXJ2aWNlXztcclxuICAgICAgICAkaW5qZWN0b3IgPSBfJGluamVjdG9yXztcclxuXHJcbiAgICAgICAgLy8gTW9jayBvdXQgdGhlIGluamVjdG9yIHRvIHJldHVybiB0cnVlIGlmIG91ciBmYWtlIGZpbHRlcnMgYXJlIGNhbGxlZC5cclxuICAgICAgICBsZXQgb3JpZ0hhc0Z1bmMgPSAkaW5qZWN0b3IuaGFzO1xyXG4gICAgICAgICRpbmplY3Rvci5oYXMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaGFzJykuYW5kLmNhbGxGYWtlKChuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgoZmlsdGVyMSA9PT0gbmFtZSkgfHwgKGZpbHRlcjIgPT09IG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ0hhc0Z1bmMobmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzRmlsdGVyKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBmaWx0ZXIgaXMgbnVsbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY29sdW1uQ29uZmlnU2VydmljZS5pc0ZpbHRlcihudWxsKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZSBpbnB1dCBpcyBub3QgYSBmaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbkNvbmZpZ1NlcnZpY2UuaXNGaWx0ZXIoJ25vdCBhIGZpbHRlcicpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGUgaW5wdXQgaXMgYSBmaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbkNvbmZpZ1NlcnZpY2UuaXNGaWx0ZXIoJ3Rlc3QxJykpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RmlsdGVyUmVuZGVyZXJzKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyBudWxsIGZvciBudWxsIHJlbmRlcmVyIHN0cmluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY29sdW1uQ29uZmlnU2VydmljZS5nZXRGaWx0ZXJSZW5kZXJlcnMobnVsbCkpLnRvRXF1YWwobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIG51bGwgZm9yIGEgc2luZ2xlIHJlbmRlcmVyIHRoYXQgaXMgbm90IGEgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb2x1bW5Db25maWdTZXJ2aWNlLmdldEZpbHRlclJlbmRlcmVycygnbm90QUZpbHRlcicpKS50b0VxdWFsKG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBudWxsIGZvciBtdWx0aXBsZSByZW5kZXJlcnMgdGhhdCBhcmUgbm90IGZpbHRlcnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbkNvbmZpZ1NlcnZpY2UuZ2V0RmlsdGVyUmVuZGVyZXJzKCdub3RBRmlsdGVyLCBtZU5laXRoZXInKSkudG9FcXVhbChudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYSBzaW5nbGUgcmVuZGVyZXIgdGhhdCBpcyBhIGZpbHRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY29sdW1uQ29uZmlnU2VydmljZS5nZXRGaWx0ZXJSZW5kZXJlcnMoJ3Rlc3QxJykpLnRvRXF1YWwoWyd0ZXN0MSddKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgbXVsdGlwbGUgcmVuZGVyZXJzIHRoYXQgYXJlIGZpbHRlcnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbkNvbmZpZ1NlcnZpY2UuZ2V0RmlsdGVyUmVuZGVyZXJzKCd0ZXN0MSx0ZXN0MicpKS50b0VxdWFsKFsndGVzdDEnLCAndGVzdDInXSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIG11bHRpcGxlIHJlbmRlcmVycyB0aGF0IGFyZSBmaWx0ZXJzIHdpdGggd2hpdGVzcGFjZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY29sdW1uQ29uZmlnU2VydmljZS5nZXRGaWx0ZXJSZW5kZXJlcnMoJyB0ZXN0MSAsIHRlc3QyICcpKS50b0VxdWFsKFsndGVzdDEnLCAndGVzdDInXSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCd0aHJvd3MgZm9yIG11bHRpcGxlIHJlbmRlcnMgd2hlbiBvbmUgaXMgYSBmaWx0ZXIgYW5kIG9uZSBpcyBub3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNvbHVtbkNvbmZpZ1NlcnZpY2UuZ2V0RmlsdGVyUmVuZGVyZXJzKCd0ZXN0MSxub3RBRmlsdGVyJykpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
