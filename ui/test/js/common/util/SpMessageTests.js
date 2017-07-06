System.register(['test/js/TestInitializer', 'common/util/UtilModule'], function (_export) {
    'use strict';

    var utilModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonUtilUtilModule) {
            utilModule = _commonUtilUtilModule['default'];
        }],
        execute: function () {

            describe('SpMessage', function () {
                var SpMessage,
                    translateSpy,
                    key = 'someMsg',
                    args = ['splat!', 'thunk!'];

                beforeEach(module(utilModule));

                /* Mock spTranslate so we can observe the arguments */
                beforeEach(module(function ($provide) {
                    translateSpy = jasmine.createSpy().and.callFake(function (msg, arg1, arg2) {
                        var translated = msg;
                        if (arg1) {
                            translated += arg1;
                        }
                        if (arg2) {
                            translated += arg2;
                        }
                        return translated;
                    });
                    $provide.value('spTranslateFilter', translateSpy);
                }));

                beforeEach(inject(function (_SpMessage_) {
                    SpMessage = _SpMessage_;
                }));

                describe('constructor', function () {
                    it('blows up with no message', function () {
                        expect(function () {
                            new SpMessage(SpMessage.ERROR, null, null, false);
                        }).toThrow();
                    });

                    it('blows up with a bad status', function () {
                        expect(function () {
                            new SpMessage('blurgff!', key, null, false);
                        }).toThrow();
                    });

                    it('defaults status to SUCCESS', function () {
                        var msg = new SpMessage(null, key, null, false);
                        expect(msg.status).toEqual(SpMessage.SUCCESS);
                    });

                    it('defaults dismissable to false', function () {
                        var msg = new SpMessage(SpMessage.ERROR, key, null);
                        expect(msg.dismissable).toEqual(false);
                    });

                    it('initializes data correctly', function () {
                        var msg = new SpMessage(SpMessage.ERROR, key, args, true);
                        expect(msg.status).toEqual(SpMessage.ERROR);
                        expect(msg.messageOrKey).toEqual(key);
                        expect(msg.args).toEqual(args);
                        expect(msg.dismissable).toEqual(true);
                    });
                });

                describe('createFromDTO()', function () {
                    it('blows up with no message', function () {
                        expect(function () {
                            SpMessage.createFromDTO({
                                status: SpMessage.ERROR
                            });
                        }).toThrow();
                    });

                    it('blows up with a bad status', function () {
                        expect(function () {
                            SpMessage.createFromDTO({
                                messageOrKey: key,
                                status: 'urrghhghghhghg'
                            });
                        }).toThrow();
                    });

                    it('defaults status to SUCCESS', function () {
                        var msg = SpMessage.createFromDTO({
                            messageOrKey: key
                        });
                        expect(msg.status).toEqual(SpMessage.SUCCESS);
                    });

                    it('defaults dismissable to false', function () {
                        var msg = SpMessage.createFromDTO({
                            messageOrKey: key
                        });
                        expect(msg.dismissable).toEqual(false);
                    });

                    it('initializes data correctly', function () {
                        var msg = SpMessage.createFromDTO({
                            messageOrKey: key,
                            status: SpMessage.ERROR,
                            args: args,
                            dismissable: true
                        });
                        expect(msg.status).toEqual(SpMessage.ERROR);
                        expect(msg.messageOrKey).toEqual(key);
                        expect(msg.args).toEqual(args);
                        expect(msg.dismissable).toEqual(true);
                    });
                });

                describe('isError()', function () {
                    it('returns true if status is ERROR', function () {
                        var msg = new SpMessage(SpMessage.ERROR, key, null, false);
                        expect(msg.isError()).toEqual(true);
                    });

                    it('returns false for non-ERROR statuses', function () {
                        var msg = new SpMessage(SpMessage.SUCCESS, key, null, false);
                        expect(msg.isError()).toEqual(false);
                    });
                });

                describe('render()', function () {
                    it('calls translate with only message key if no arguments', function () {
                        var msg = new SpMessage(null, key, null, false);
                        msg.render();
                        expect(translateSpy).toHaveBeenCalledWith(key);
                    });

                    it('calls translate message key and arguments if available', function () {
                        var msg = new SpMessage(null, key, args, false);
                        msg.render();
                        expect(translateSpy).toHaveBeenCalledWith(key, args[0], args[1]);
                    });

                    it('returns the translated message', function () {
                        var msg = new SpMessage(null, key, args, false),
                            rendered = msg.render();
                        expect(rendered).toEqual('someMsgsplat!thunk!');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi91dGlsL1NwTWVzc2FnZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwyQkFBMkIsVUFBVSxTQUFTO0lBQTFGOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx1QkFBdUI7WUFDN0UsYUFBYSxzQkFBc0I7O1FBRXZDLFNBQVMsWUFBWTs7WUFIN0IsU0FBUyxhQUFhLFlBQVc7Z0JBQzdCLElBQUk7b0JBQVc7b0JBQ1gsTUFBTTtvQkFDTixPQUFPLENBQUUsVUFBVTs7Z0JBRXZCLFdBQVcsT0FBTzs7O2dCQUdsQixXQUFXLE9BQU8sVUFBUyxVQUFVO29CQUNqQyxlQUFlLFFBQVEsWUFBWSxJQUFJLFNBQVMsVUFBUyxLQUFLLE1BQU0sTUFBTTt3QkFDdEUsSUFBSSxhQUFhO3dCQUNqQixJQUFJLE1BQU07NEJBQ04sY0FBYzs7d0JBRWxCLElBQUksTUFBTTs0QkFDTixjQUFjOzt3QkFFbEIsT0FBTzs7b0JBRVgsU0FBUyxNQUFNLHFCQUFxQjs7O2dCQUd4QyxXQUFXLE9BQU8sVUFBUyxhQUFhO29CQUNwQyxZQUFZOzs7Z0JBR2hCLFNBQVMsZUFBZSxZQUFXO29CQUMvQixHQUFHLDRCQUE0QixZQUFXO3dCQUN0QyxPQUFPLFlBQVc7NEJBQUUsSUFBSSxVQUFVLFVBQVUsT0FBTyxNQUFNLE1BQU07MkJBQVc7OztvQkFHOUUsR0FBRyw4QkFBOEIsWUFBVzt3QkFDeEMsT0FBTyxZQUFXOzRCQUFFLElBQUksVUFBVSxZQUFZLEtBQUssTUFBTTsyQkFBVzs7O29CQUd4RSxHQUFHLDhCQUE4QixZQUFXO3dCQUN4QyxJQUFJLE1BQU0sSUFBSSxVQUFVLE1BQU0sS0FBSyxNQUFNO3dCQUN6QyxPQUFPLElBQUksUUFBUSxRQUFRLFVBQVU7OztvQkFHekMsR0FBRyxpQ0FBaUMsWUFBVzt3QkFDM0MsSUFBSSxNQUFNLElBQUksVUFBVSxVQUFVLE9BQU8sS0FBSzt3QkFDOUMsT0FBTyxJQUFJLGFBQWEsUUFBUTs7O29CQUdwQyxHQUFHLDhCQUE4QixZQUFXO3dCQUN4QyxJQUFJLE1BQU0sSUFBSSxVQUFVLFVBQVUsT0FBTyxLQUFLLE1BQU07d0JBQ3BELE9BQU8sSUFBSSxRQUFRLFFBQVEsVUFBVTt3QkFDckMsT0FBTyxJQUFJLGNBQWMsUUFBUTt3QkFDakMsT0FBTyxJQUFJLE1BQU0sUUFBUTt3QkFDekIsT0FBTyxJQUFJLGFBQWEsUUFBUTs7OztnQkFJeEMsU0FBUyxtQkFBbUIsWUFBVztvQkFDbkMsR0FBRyw0QkFBNEIsWUFBVzt3QkFDdEMsT0FDSSxZQUFXOzRCQUNQLFVBQVUsY0FBYztnQ0FDcEIsUUFBUSxVQUFVOzsyQkFFdkI7OztvQkFHWCxHQUFHLDhCQUE4QixZQUFXO3dCQUN4QyxPQUNJLFlBQVc7NEJBQ1AsVUFBVSxjQUFjO2dDQUNwQixjQUFjO2dDQUNkLFFBQVE7OzJCQUViOzs7b0JBR1gsR0FBRyw4QkFBOEIsWUFBVzt3QkFDeEMsSUFBSSxNQUFNLFVBQVUsY0FBYzs0QkFDOUIsY0FBYzs7d0JBRWxCLE9BQU8sSUFBSSxRQUFRLFFBQVEsVUFBVTs7O29CQUd6QyxHQUFHLGlDQUFpQyxZQUFXO3dCQUMzQyxJQUFJLE1BQU0sVUFBVSxjQUFjOzRCQUM5QixjQUFjOzt3QkFFbEIsT0FBTyxJQUFJLGFBQWEsUUFBUTs7O29CQUdwQyxHQUFHLDhCQUE4QixZQUFXO3dCQUN4QyxJQUFJLE1BQU0sVUFBVSxjQUFjOzRCQUM5QixjQUFjOzRCQUNkLFFBQVEsVUFBVTs0QkFDbEIsTUFBTTs0QkFDTixhQUFhOzt3QkFFakIsT0FBTyxJQUFJLFFBQVEsUUFBUSxVQUFVO3dCQUNyQyxPQUFPLElBQUksY0FBYyxRQUFRO3dCQUNqQyxPQUFPLElBQUksTUFBTSxRQUFRO3dCQUN6QixPQUFPLElBQUksYUFBYSxRQUFROzs7O2dCQUl4QyxTQUFTLGFBQWEsWUFBVztvQkFDN0IsR0FBRyxtQ0FBbUMsWUFBVzt3QkFDN0MsSUFBSSxNQUFNLElBQUksVUFBVSxVQUFVLE9BQU8sS0FBSyxNQUFNO3dCQUNwRCxPQUFPLElBQUksV0FBVyxRQUFROzs7b0JBR2xDLEdBQUcsd0NBQXdDLFlBQVc7d0JBQ2xELElBQUksTUFBTSxJQUFJLFVBQVUsVUFBVSxTQUFTLEtBQUssTUFBTTt3QkFDdEQsT0FBTyxJQUFJLFdBQVcsUUFBUTs7OztnQkFJdEMsU0FBUyxZQUFZLFlBQVc7b0JBQzVCLEdBQUcseURBQXlELFlBQVc7d0JBQ25FLElBQUksTUFBTSxJQUFJLFVBQVUsTUFBTSxLQUFLLE1BQU07d0JBQ3pDLElBQUk7d0JBQ0osT0FBTyxjQUFjLHFCQUFxQjs7O29CQUc5QyxHQUFHLDBEQUEwRCxZQUFXO3dCQUNwRSxJQUFJLE1BQU0sSUFBSSxVQUFVLE1BQU0sS0FBSyxNQUFNO3dCQUN6QyxJQUFJO3dCQUNKLE9BQU8sY0FBYyxxQkFBcUIsS0FBSyxLQUFLLElBQUksS0FBSzs7O29CQUdqRSxHQUFHLGtDQUFrQyxZQUFXO3dCQUM1QyxJQUFJLE1BQU0sSUFBSSxVQUFVLE1BQU0sS0FBSyxNQUFNOzRCQUNyQyxXQUFXLElBQUk7d0JBQ25CLE9BQU8sVUFBVSxRQUFROzs7Ozs7R0FjbEMiLCJmaWxlIjoiY29tbW9uL3V0aWwvU3BNZXNzYWdlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IHV0aWxNb2R1bGUgZnJvbSAnY29tbW9uL3V0aWwvVXRpbE1vZHVsZSc7XHJcblxyXG5kZXNjcmliZSgnU3BNZXNzYWdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgU3BNZXNzYWdlLCB0cmFuc2xhdGVTcHksXHJcbiAgICAgICAga2V5ID0gJ3NvbWVNc2cnLFxyXG4gICAgICAgIGFyZ3MgPSBbICdzcGxhdCEnLCAndGh1bmshJyBdO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHV0aWxNb2R1bGUpKTtcclxuXHJcbiAgICAvKiBNb2NrIHNwVHJhbnNsYXRlIHNvIHdlIGNhbiBvYnNlcnZlIHRoZSBhcmd1bWVudHMgKi9cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XHJcbiAgICAgICAgdHJhbnNsYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24obXNnLCBhcmcxLCBhcmcyKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmFuc2xhdGVkID0gbXNnO1xyXG4gICAgICAgICAgICBpZiAoYXJnMSkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlZCArPSBhcmcxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhcmcyKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGVkICs9IGFyZzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHByb3ZpZGUudmFsdWUoJ3NwVHJhbnNsYXRlRmlsdGVyJywgdHJhbnNsYXRlU3B5KTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfU3BNZXNzYWdlXykge1xyXG4gICAgICAgIFNwTWVzc2FnZSA9IF9TcE1lc3NhZ2VfO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdibG93cyB1cCB3aXRoIG5vIG1lc3NhZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBuZXcgU3BNZXNzYWdlKFNwTWVzc2FnZS5FUlJPUiwgbnVsbCwgbnVsbCwgZmFsc2UpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdibG93cyB1cCB3aXRoIGEgYmFkIHN0YXR1cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IG5ldyBTcE1lc3NhZ2UoJ2JsdXJnZmYhJywga2V5LCBudWxsLCBmYWxzZSk7IH0pLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RlZmF1bHRzIHN0YXR1cyB0byBTVUNDRVNTJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBuZXcgU3BNZXNzYWdlKG51bGwsIGtleSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLnN0YXR1cykudG9FcXVhbChTcE1lc3NhZ2UuU1VDQ0VTUyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkZWZhdWx0cyBkaXNtaXNzYWJsZSB0byBmYWxzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gbmV3IFNwTWVzc2FnZShTcE1lc3NhZ2UuRVJST1IsIGtleSwgbnVsbCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtc2cuZGlzbWlzc2FibGUpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaW5pdGlhbGl6ZXMgZGF0YSBjb3JyZWN0bHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IG5ldyBTcE1lc3NhZ2UoU3BNZXNzYWdlLkVSUk9SLCBrZXksIGFyZ3MsIHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLnN0YXR1cykudG9FcXVhbChTcE1lc3NhZ2UuRVJST1IpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLm1lc3NhZ2VPcktleSkudG9FcXVhbChrZXkpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLmFyZ3MpLnRvRXF1YWwoYXJncyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtc2cuZGlzbWlzc2FibGUpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnY3JlYXRlRnJvbURUTygpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2Jsb3dzIHVwIHdpdGggbm8gbWVzc2FnZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBTcE1lc3NhZ2UuY3JlYXRlRnJvbURUTyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogU3BNZXNzYWdlLkVSUk9SXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdibG93cyB1cCB3aXRoIGEgYmFkIHN0YXR1cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBTcE1lc3NhZ2UuY3JlYXRlRnJvbURUTyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VPcktleToga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICd1cnJnaGhnaGdoaGdoZydcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RlZmF1bHRzIHN0YXR1cyB0byBTVUNDRVNTJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBTcE1lc3NhZ2UuY3JlYXRlRnJvbURUTyh7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlT3JLZXk6IGtleVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KG1zZy5zdGF0dXMpLnRvRXF1YWwoU3BNZXNzYWdlLlNVQ0NFU1MpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZGVmYXVsdHMgZGlzbWlzc2FibGUgdG8gZmFsc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IFNwTWVzc2FnZS5jcmVhdGVGcm9tRFRPKHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPcktleToga2V5XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLmRpc21pc3NhYmxlKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2luaXRpYWxpemVzIGRhdGEgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBTcE1lc3NhZ2UuY3JlYXRlRnJvbURUTyh7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlT3JLZXk6IGtleSxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogU3BNZXNzYWdlLkVSUk9SLFxyXG4gICAgICAgICAgICAgICAgYXJnczogYXJncyxcclxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLnN0YXR1cykudG9FcXVhbChTcE1lc3NhZ2UuRVJST1IpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLm1lc3NhZ2VPcktleSkudG9FcXVhbChrZXkpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLmFyZ3MpLnRvRXF1YWwoYXJncyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtc2cuZGlzbWlzc2FibGUpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNFcnJvcigpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBzdGF0dXMgaXMgRVJST1InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IG5ldyBTcE1lc3NhZ2UoU3BNZXNzYWdlLkVSUk9SLCBrZXksIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1zZy5pc0Vycm9yKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBub24tRVJST1Igc3RhdHVzZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IG5ldyBTcE1lc3NhZ2UoU3BNZXNzYWdlLlNVQ0NFU1MsIGtleSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QobXNnLmlzRXJyb3IoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncmVuZGVyKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnY2FsbHMgdHJhbnNsYXRlIHdpdGggb25seSBtZXNzYWdlIGtleSBpZiBubyBhcmd1bWVudHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IG5ldyBTcE1lc3NhZ2UobnVsbCwga2V5LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIG1zZy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRyYW5zbGF0ZVNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoa2V5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHRyYW5zbGF0ZSBtZXNzYWdlIGtleSBhbmQgYXJndW1lbnRzIGlmIGF2YWlsYWJsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbXNnID0gbmV3IFNwTWVzc2FnZShudWxsLCBrZXksIGFyZ3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgbXNnLnJlbmRlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhbnNsYXRlU3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChrZXksIGFyZ3NbMF0sIGFyZ3NbMV0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0aGUgdHJhbnNsYXRlZCBtZXNzYWdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBuZXcgU3BNZXNzYWdlKG51bGwsIGtleSwgYXJncywgZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyZWQgPSBtc2cucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCgnc29tZU1zZ3NwbGF0IXRodW5rIScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
