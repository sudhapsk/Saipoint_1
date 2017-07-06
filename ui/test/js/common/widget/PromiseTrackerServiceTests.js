System.register(['test/js/TestInitializer', 'common/widget/WidgetModule'], function (_export) {
    'use strict';

    var widgetModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonWidgetWidgetModule) {
            widgetModule = _commonWidgetWidgetModule['default'];
        }],
        execute: function () {

            describe('PromiseTrackerService', function () {
                var $scope, $q, tracker;

                beforeEach(module(widgetModule));
                beforeEach(inject(function (_$q_, _$rootScope_, _promiseTrackerService_) {
                    $q = _$q_;
                    $scope = _$rootScope_;
                    tracker = _promiseTrackerService_;
                }));

                describe('tracking a single promise', function () {
                    var deferred;
                    beforeEach(function () {
                        deferred = $q.defer();
                        tracker.track(deferred.promise);
                    });

                    it('should stay in progress as while promise is unresolved', function () {
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                    });

                    it('should not be in progress when promise is resolved', function () {
                        deferred.resolve('someValue');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });

                    it('should not be in progress when promise is rejected', function () {
                        deferred.reject('someOtherValue');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });
                });

                describe('tracking multiple promises', function () {
                    var deferred1, deferred2, deferred3;

                    beforeEach(function () {
                        deferred1 = $q.defer();
                        deferred2 = $q.defer();
                        deferred3 = $q.defer();
                        tracker.track(deferred1.promise);
                        tracker.track(deferred2.promise);
                        tracker.track(deferred3.promise);
                    });

                    it('should be in progress if all items are unresolved', function () {
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                    });

                    it('should be in progress if some items are resolved', function () {
                        deferred2.resolve('resolving number two');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                    });

                    it('should be in progress if some items are rejected', function () {
                        deferred3.reject('rejecting number three');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                    });

                    it('should be in progress if some items are rejected and ' + 'some are resolved but at least one is still in progress', function () {
                        deferred1.reject('rejecting number one');
                        deferred3.resolve('resolving number three');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                    });

                    it('should not be in progress if all items are resolved', function () {
                        deferred1.resolve('resolving number one');
                        deferred2.resolve('resolving number two');
                        deferred3.resolve('resolving number three');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });

                    it('should not be in progress if all items are rejected', function () {
                        deferred1.reject('rejecting number one');
                        deferred2.reject('rejecting number two');
                        deferred3.reject('rejecting number three');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });

                    it('should not be in progress if all items are resolved or rejected', function () {
                        deferred1.reject('rejecting number one');
                        deferred2.resolve('resolved number two');
                        deferred3.reject('rejecting number three');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });

                    it('should correctly handle resolution over multiple digest loops', function () {
                        deferred1.reject('rejecting number one');
                        deferred2.resolve('resolved number two');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                        deferred3.reject('rejecting number three');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });

                    it('should handle promises being added while other promises are resolving', function () {
                        var deferred4 = new $q.defer();
                        deferred1.reject('rejecting number one');
                        deferred2.resolve('resolved number two');
                        $scope.$apply();
                        tracker.track(deferred4.promise);
                        deferred3.resolve('blah blah');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(true);
                        deferred4.resolve('bleh bleh');
                        $scope.$apply();
                        expect(tracker.isInProgress()).toBe(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi93aWRnZXQvUHJvbWlzZVRyYWNrZXJTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLCtCQUErQixVQUFVLFNBQVM7SUFBOUY7O0lBR0ksSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLDJCQUEyQjtZQUNqRixlQUFlLDBCQUEwQjs7UUFFN0MsU0FBUyxZQUFZOztZQUg3QixTQUFTLHlCQUF5QixZQUFXO2dCQUN6QyxJQUFJLFFBQVEsSUFBSTs7Z0JBRWhCLFdBQVcsT0FBTztnQkFDbEIsV0FBVyxPQUFPLFVBQVMsTUFBTSxjQUFjLHlCQUF5QjtvQkFDcEUsS0FBSztvQkFDTCxTQUFTO29CQUNULFVBQVU7OztnQkFHZCxTQUFTLDZCQUE2QixZQUFXO29CQUM3QyxJQUFJO29CQUNKLFdBQVcsWUFBVzt3QkFDbEIsV0FBVyxHQUFHO3dCQUNkLFFBQVEsTUFBTSxTQUFTOzs7b0JBRzNCLEdBQUcsMERBQTBELFlBQVc7d0JBQ3BFLE9BQU87d0JBQ1AsT0FBTyxRQUFRLGdCQUFnQixLQUFLOzs7b0JBR3hDLEdBQUcsc0RBQXNELFlBQVc7d0JBQ2hFLFNBQVMsUUFBUTt3QkFDakIsT0FBTzt3QkFDUCxPQUFPLFFBQVEsZ0JBQWdCLEtBQUs7OztvQkFHeEMsR0FBRyxzREFBc0QsWUFBVzt3QkFDaEUsU0FBUyxPQUFPO3dCQUNoQixPQUFPO3dCQUNQLE9BQU8sUUFBUSxnQkFBZ0IsS0FBSzs7OztnQkFJNUMsU0FBUyw4QkFBOEIsWUFBVztvQkFDOUMsSUFBSSxXQUNBLFdBQ0E7O29CQUVKLFdBQVcsWUFBVzt3QkFDbEIsWUFBWSxHQUFHO3dCQUNmLFlBQVksR0FBRzt3QkFDZixZQUFZLEdBQUc7d0JBQ2YsUUFBUSxNQUFNLFVBQVU7d0JBQ3hCLFFBQVEsTUFBTSxVQUFVO3dCQUN4QixRQUFRLE1BQU0sVUFBVTs7O29CQUc1QixHQUFHLHFEQUFxRCxZQUFXO3dCQUMvRCxPQUFPO3dCQUNQLE9BQU8sUUFBUSxnQkFBZ0IsS0FBSzs7O29CQUd4QyxHQUFHLG9EQUFvRCxZQUFXO3dCQUM5RCxVQUFVLFFBQVE7d0JBQ2xCLE9BQU87d0JBQ1AsT0FBTyxRQUFRLGdCQUFnQixLQUFLOzs7b0JBR3hDLEdBQUcsb0RBQW9ELFlBQVc7d0JBQzlELFVBQVUsT0FBTzt3QkFDakIsT0FBTzt3QkFDUCxPQUFPLFFBQVEsZ0JBQWdCLEtBQUs7OztvQkFHeEMsR0FBRywwREFDQywyREFBMkQsWUFBVzt3QkFDdEUsVUFBVSxPQUFPO3dCQUNqQixVQUFVLFFBQVE7d0JBQ2xCLE9BQU87d0JBQ1AsT0FBTyxRQUFRLGdCQUFnQixLQUFLOzs7b0JBR3hDLEdBQUcsdURBQXVELFlBQVc7d0JBQ2pFLFVBQVUsUUFBUTt3QkFDbEIsVUFBVSxRQUFRO3dCQUNsQixVQUFVLFFBQVE7d0JBQ2xCLE9BQU87d0JBQ1AsT0FBTyxRQUFRLGdCQUFnQixLQUFLOzs7b0JBSXhDLEdBQUcsdURBQXVELFlBQVc7d0JBQ2pFLFVBQVUsT0FBTzt3QkFDakIsVUFBVSxPQUFPO3dCQUNqQixVQUFVLE9BQU87d0JBQ2pCLE9BQU87d0JBQ1AsT0FBTyxRQUFRLGdCQUFnQixLQUFLOzs7b0JBR3hDLEdBQUcsbUVBQW1FLFlBQVc7d0JBQzdFLFVBQVUsT0FBTzt3QkFDakIsVUFBVSxRQUFRO3dCQUNsQixVQUFVLE9BQU87d0JBQ2pCLE9BQU87d0JBQ1AsT0FBTyxRQUFRLGdCQUFnQixLQUFLOzs7b0JBR3hDLEdBQUcsaUVBQWlFLFlBQVc7d0JBQzNFLFVBQVUsT0FBTzt3QkFDakIsVUFBVSxRQUFRO3dCQUNsQixPQUFPO3dCQUNQLE9BQU8sUUFBUSxnQkFBZ0IsS0FBSzt3QkFDcEMsVUFBVSxPQUFPO3dCQUNqQixPQUFPO3dCQUNQLE9BQU8sUUFBUSxnQkFBZ0IsS0FBSzs7O29CQUd4QyxHQUFHLHlFQUF5RSxZQUFXO3dCQUNuRixJQUFJLFlBQVksSUFBSSxHQUFHO3dCQUN2QixVQUFVLE9BQU87d0JBQ2pCLFVBQVUsUUFBUTt3QkFDbEIsT0FBTzt3QkFDUCxRQUFRLE1BQU0sVUFBVTt3QkFDeEIsVUFBVSxRQUFRO3dCQUNsQixPQUFPO3dCQUNQLE9BQU8sUUFBUSxnQkFBZ0IsS0FBSzt3QkFDcEMsVUFBVSxRQUFRO3dCQUNsQixPQUFPO3dCQUNQLE9BQU8sUUFBUSxnQkFBZ0IsS0FBSzs7Ozs7O0dBTzdDIiwiZmlsZSI6ImNvbW1vbi93aWRnZXQvUHJvbWlzZVRyYWNrZXJTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHdpZGdldE1vZHVsZSBmcm9tICdjb21tb24vd2lkZ2V0L1dpZGdldE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdQcm9taXNlVHJhY2tlclNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgJHNjb3BlLCAkcSwgdHJhY2tlcjtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdpZGdldE1vZHVsZSkpO1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcV8sIF8kcm9vdFNjb3BlXywgX3Byb21pc2VUcmFja2VyU2VydmljZV8pIHtcbiAgICAgICAgJHEgPSBfJHFfO1xuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgIHRyYWNrZXIgPSBfcHJvbWlzZVRyYWNrZXJTZXJ2aWNlXztcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgndHJhY2tpbmcgYSBzaW5nbGUgcHJvbWlzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGVmZXJyZWQ7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0cmFja2VyLnRyYWNrKGRlZmVycmVkLnByb21pc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHN0YXkgaW4gcHJvZ3Jlc3MgYXMgd2hpbGUgcHJvbWlzZSBpcyB1bnJlc29sdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmUgaW4gcHJvZ3Jlc3Mgd2hlbiBwcm9taXNlIGlzIHJlc29sdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdzb21lVmFsdWUnKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzSW5Qcm9ncmVzcygpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmUgaW4gcHJvZ3Jlc3Mgd2hlbiBwcm9taXNlIGlzIHJlamVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ3NvbWVPdGhlclZhbHVlJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZShmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3RyYWNraW5nIG11bHRpcGxlIHByb21pc2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZDEsXG4gICAgICAgICAgICBkZWZlcnJlZDIsXG4gICAgICAgICAgICBkZWZlcnJlZDM7XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlZmVycmVkMSA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBkZWZlcnJlZDIgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQzID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRyYWNrZXIudHJhY2soZGVmZXJyZWQxLnByb21pc2UpO1xuICAgICAgICAgICAgdHJhY2tlci50cmFjayhkZWZlcnJlZDIucHJvbWlzZSk7XG4gICAgICAgICAgICB0cmFja2VyLnRyYWNrKGRlZmVycmVkMy5wcm9taXNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBpbiBwcm9ncmVzcyBpZiBhbGwgaXRlbXMgYXJlIHVucmVzb2x2ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzSW5Qcm9ncmVzcygpKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGJlIGluIHByb2dyZXNzIGlmIHNvbWUgaXRlbXMgYXJlIHJlc29sdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZWZlcnJlZDIucmVzb2x2ZSgncmVzb2x2aW5nIG51bWJlciB0d28nKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzSW5Qcm9ncmVzcygpKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGJlIGluIHByb2dyZXNzIGlmIHNvbWUgaXRlbXMgYXJlIHJlamVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZWZlcnJlZDMucmVqZWN0KCdyZWplY3RpbmcgbnVtYmVyIHRocmVlJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBpbiBwcm9ncmVzcyBpZiBzb21lIGl0ZW1zIGFyZSByZWplY3RlZCBhbmQgJyArXG4gICAgICAgICAgICAnc29tZSBhcmUgcmVzb2x2ZWQgYnV0IGF0IGxlYXN0IG9uZSBpcyBzdGlsbCBpbiBwcm9ncmVzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQxLnJlamVjdCgncmVqZWN0aW5nIG51bWJlciBvbmUnKTtcbiAgICAgICAgICAgIGRlZmVycmVkMy5yZXNvbHZlKCdyZXNvbHZpbmcgbnVtYmVyIHRocmVlJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmUgaW4gcHJvZ3Jlc3MgaWYgYWxsIGl0ZW1zIGFyZSByZXNvbHZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQxLnJlc29sdmUoJ3Jlc29sdmluZyBudW1iZXIgb25lJyk7XG4gICAgICAgICAgICBkZWZlcnJlZDIucmVzb2x2ZSgncmVzb2x2aW5nIG51bWJlciB0d28nKTtcbiAgICAgICAgICAgIGRlZmVycmVkMy5yZXNvbHZlKCdyZXNvbHZpbmcgbnVtYmVyIHRocmVlJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZShmYWxzZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmUgaW4gcHJvZ3Jlc3MgaWYgYWxsIGl0ZW1zIGFyZSByZWplY3RlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQxLnJlamVjdCgncmVqZWN0aW5nIG51bWJlciBvbmUnKTtcbiAgICAgICAgICAgIGRlZmVycmVkMi5yZWplY3QoJ3JlamVjdGluZyBudW1iZXIgdHdvJyk7XG4gICAgICAgICAgICBkZWZlcnJlZDMucmVqZWN0KCdyZWplY3RpbmcgbnVtYmVyIHRocmVlJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZShmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGJlIGluIHByb2dyZXNzIGlmIGFsbCBpdGVtcyBhcmUgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlZmVycmVkMS5yZWplY3QoJ3JlamVjdGluZyBudW1iZXIgb25lJyk7XG4gICAgICAgICAgICBkZWZlcnJlZDIucmVzb2x2ZSgncmVzb2x2ZWQgbnVtYmVyIHR3bycpO1xuICAgICAgICAgICAgZGVmZXJyZWQzLnJlamVjdCgncmVqZWN0aW5nIG51bWJlciB0aHJlZScpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHRyYWNrZXIuaXNJblByb2dyZXNzKCkpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBoYW5kbGUgcmVzb2x1dGlvbiBvdmVyIG11bHRpcGxlIGRpZ2VzdCBsb29wcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQxLnJlamVjdCgncmVqZWN0aW5nIG51bWJlciBvbmUnKTtcbiAgICAgICAgICAgIGRlZmVycmVkMi5yZXNvbHZlKCdyZXNvbHZlZCBudW1iZXIgdHdvJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0luUHJvZ3Jlc3MoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGRlZmVycmVkMy5yZWplY3QoJ3JlamVjdGluZyBudW1iZXIgdGhyZWUnKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzSW5Qcm9ncmVzcygpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJvbWlzZXMgYmVpbmcgYWRkZWQgd2hpbGUgb3RoZXIgcHJvbWlzZXMgYXJlIHJlc29sdmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkNCA9IG5ldyAkcS5kZWZlcigpO1xuICAgICAgICAgICAgZGVmZXJyZWQxLnJlamVjdCgncmVqZWN0aW5nIG51bWJlciBvbmUnKTtcbiAgICAgICAgICAgIGRlZmVycmVkMi5yZXNvbHZlKCdyZXNvbHZlZCBudW1iZXIgdHdvJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICB0cmFja2VyLnRyYWNrKGRlZmVycmVkNC5wcm9taXNlKTtcbiAgICAgICAgICAgIGRlZmVycmVkMy5yZXNvbHZlKCdibGFoIGJsYWgnKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzSW5Qcm9ncmVzcygpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZGVmZXJyZWQ0LnJlc29sdmUoJ2JsZWggYmxlaCcpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHRyYWNrZXIuaXNJblByb2dyZXNzKCkpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
