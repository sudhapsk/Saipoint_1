System.register(['test/js/TestInitializer', 'timeout/TimeoutModule', 'common/util/UtilModule'], function (_export) {
    /**
     * Tests for the TimeoutService.
     */
    'use strict';

    var timeoutModule, utilModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_timeoutTimeoutModule) {
            timeoutModule = _timeoutTimeoutModule['default'];
        }, function (_commonUtilUtilModule) {
            utilModule = _commonUtilUtilModule['default'];
        }],
        execute: function () {
            describe('TimeoutService', function () {

                // The ngMock $timeout service.
                var $timeout;

                // The TimeoutService that will be tested.
                var timeoutService;

                // Spies for showTimeoutDialog and resetTimeout on timeoutService.
                var showTimeoutSpy;
                var resetTimeoutSpy;
                var modalOpenSpy;

                // Session Timeout plus the magic 30 second delay
                var defaultTimeoutOut;

                // Let the tests know we'll use the sailpoint module.
                beforeEach(module(timeoutModule, utilModule));

                /**
                 * Setup the global variables before each spec is run.  Note that the
                 * _timeoutService_ that is being injected here is the ngMock.$timeout
                 * service ... not our TimeoutService.
                 */
                beforeEach(inject(function (_$timeout_, _$modal_, _timeoutService_, _SESSION_TIMEOUT_) {
                    $timeout = _$timeout_;
                    timeoutService = _timeoutService_;
                    /* It looks like modalOpenSpy is only used by one test, but it is really removing
                     * a bunch of timeout/httpbackend headaches from all the tests that show the
                     * timeout dialog */
                    modalOpenSpy = spyOn(_$modal_, 'open');
                    showTimeoutSpy = spyOn(timeoutService, 'showTimeoutDialog').and.callThrough();
                    resetTimeoutSpy = spyOn(timeoutService, 'resetTimeout').and.callThrough();
                    defaultTimeoutOut = _SESSION_TIMEOUT_ + 30000;
                }));

                it('calls the showTimeoutDialog function when the timeout expires', function () {
                    // Reset the timeout with our spy object.
                    timeoutService.resetTimeout();

                    // Fast-forward half way through the timeout
                    $timeout.flush(defaultTimeoutOut / 2);
                    expect(showTimeoutSpy).not.toHaveBeenCalled();

                    // Fast-forward the rest of the way through the timeout
                    $timeout.flush(defaultTimeoutOut / 2);
                    expect(showTimeoutSpy).toHaveBeenCalled();

                    // Make sure that there is nothing in the timeout queue.
                    $timeout.verifyNoPendingTasks();
                });

                it('extends the timeout when the timeout is reset', function () {
                    var RESET_WAIT = 5000;

                    // Reset the timeout with our spy object (time = 0).
                    timeoutService.resetTimeout();

                    // Go forward a few seconds.  Then reset the timeout again (time = 5).
                    $timeout.flush(RESET_WAIT);
                    timeoutService.resetTimeout();

                    // Go just past the original timeout and ensure that the original
                    // timeout does not get called.
                    $timeout.flush(defaultTimeoutOut + 10 - RESET_WAIT);
                    expect(showTimeoutSpy).not.toHaveBeenCalled();

                    // Go past the second reset's timeout to verify that the first callback
                    // does not get called and the new callback does (time = timeout + 5 + 30)
                    $timeout.flush(RESET_WAIT);
                    expect(showTimeoutSpy).toHaveBeenCalled();
                    $timeout.verifyNoPendingTasks();
                });

                it('shows the timeout dialog when requested', function () {
                    timeoutService.showTimeoutDialog();
                    expect(modalOpenSpy).toHaveBeenCalled();
                });

                it('shows the pre-expire warning', function () {
                    var warningDelay = 30000 + 1000,
                        // five minutes + a little wiggle room
                    showWarningSpy = spyOn(timeoutService, 'showWarningDialog').and.callFake(angular.noop);
                    // Reset the timeout with our spy object (time = 0).
                    timeoutService.resetTimeout();

                    // Go forward a few seconds.  Then reset the timeout again (time = 5).
                    $timeout.flush(defaultTimeoutOut - warningDelay);
                    expect(showWarningSpy).toHaveBeenCalled();
                    // flush the expired dialog too
                    $timeout.flush(warningDelay);
                    $timeout.verifyNoPendingTasks();
                });

                it('shows the warning dialog when requested', function () {
                    timeoutService.showWarningDialog();
                    expect(modalOpenSpy).toHaveBeenCalled();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVvdXQvVGltZW91dFNlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIseUJBQXlCLDJCQUEyQixVQUFVLFNBQVM7Ozs7SUFJL0c7O0lBRUEsSUFBSSxlQUFlO0lBQ25CLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHVCQUF1QjtZQUM3RSxnQkFBZ0Isc0JBQXNCO1dBQ3ZDLFVBQVUsdUJBQXVCO1lBQ2hDLGFBQWEsc0JBQXNCOztRQUV2QyxTQUFTLFlBQVk7WUFON0IsU0FBUyxrQkFBa0IsWUFBVzs7O2dCQUdsQyxJQUFJOzs7Z0JBR0osSUFBSTs7O2dCQUdKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJOzs7Z0JBR0osSUFBSTs7O2dCQUlKLFdBQVcsT0FBTyxlQUFlOzs7Ozs7O2dCQU9qQyxXQUFXLE9BQU8sVUFBUyxZQUFZLFVBQVUsa0JBQWtCLG1CQUFtQjtvQkFDbEYsV0FBVztvQkFDWCxpQkFBaUI7Ozs7b0JBSWpCLGVBQWUsTUFBTSxVQUFVO29CQUMvQixpQkFBaUIsTUFBTSxnQkFBZ0IscUJBQXFCLElBQUk7b0JBQ2hFLGtCQUFrQixNQUFNLGdCQUFnQixnQkFBZ0IsSUFBSTtvQkFDNUQsb0JBQW9CLG9CQUFvQjs7O2dCQUc1QyxHQUFHLGlFQUFpRSxZQUFXOztvQkFFM0UsZUFBZTs7O29CQUdmLFNBQVMsTUFBTSxvQkFBb0I7b0JBQ25DLE9BQU8sZ0JBQWdCLElBQUk7OztvQkFHM0IsU0FBUyxNQUFPLG9CQUFvQjtvQkFDcEMsT0FBTyxnQkFBZ0I7OztvQkFHdkIsU0FBUzs7O2dCQUdiLEdBQUcsaURBQWlELFlBQVc7b0JBQzNELElBQUksYUFBYTs7O29CQUdqQixlQUFlOzs7b0JBR2YsU0FBUyxNQUFNO29CQUNmLGVBQWU7Ozs7b0JBSWYsU0FBUyxNQUFNLG9CQUFvQixLQUFLO29CQUN4QyxPQUFPLGdCQUFnQixJQUFJOzs7O29CQUkzQixTQUFTLE1BQU07b0JBQ2YsT0FBTyxnQkFBZ0I7b0JBQ3ZCLFNBQVM7OztnQkFHYixHQUFHLDJDQUEyQyxZQUFXO29CQUNyRCxlQUFlO29CQUNmLE9BQU8sY0FBYzs7O2dCQUd6QixHQUFHLGdDQUFnQyxZQUFXO29CQUMxQyxJQUFJLGVBQWUsUUFBUTs7b0JBQ3ZCLGlCQUFpQixNQUFNLGdCQUFnQixxQkFBcUIsSUFBSSxTQUFTLFFBQVE7O29CQUVyRixlQUFlOzs7b0JBR2YsU0FBUyxNQUFNLG9CQUFvQjtvQkFDbkMsT0FBTyxnQkFBZ0I7O29CQUV2QixTQUFTLE1BQU07b0JBQ2YsU0FBUzs7O2dCQUdiLEdBQUcsMkNBQTJDLFlBQVc7b0JBQ3JELGVBQWU7b0JBQ2YsT0FBTyxjQUFjOzs7OztHQVkxQiIsImZpbGUiOiJ0aW1lb3V0L1RpbWVvdXRTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuXHJcbmltcG9ydCB0aW1lb3V0TW9kdWxlIGZyb20gJ3RpbWVvdXQvVGltZW91dE1vZHVsZSc7XHJcbmltcG9ydCB1dGlsTW9kdWxlIGZyb20gJ2NvbW1vbi91dGlsL1V0aWxNb2R1bGUnO1xyXG4vKipcclxuICogVGVzdHMgZm9yIHRoZSBUaW1lb3V0U2VydmljZS5cclxuICovXHJcbmRlc2NyaWJlKCdUaW1lb3V0U2VydmljZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8vIFRoZSBuZ01vY2sgJHRpbWVvdXQgc2VydmljZS5cclxuICAgIHZhciAkdGltZW91dDtcclxuXHJcbiAgICAvLyBUaGUgVGltZW91dFNlcnZpY2UgdGhhdCB3aWxsIGJlIHRlc3RlZC5cclxuICAgIHZhciB0aW1lb3V0U2VydmljZTtcclxuXHJcbiAgICAvLyBTcGllcyBmb3Igc2hvd1RpbWVvdXREaWFsb2cgYW5kIHJlc2V0VGltZW91dCBvbiB0aW1lb3V0U2VydmljZS5cclxuICAgIHZhciBzaG93VGltZW91dFNweTtcclxuICAgIHZhciByZXNldFRpbWVvdXRTcHk7XHJcbiAgICB2YXIgbW9kYWxPcGVuU3B5O1xyXG5cclxuICAgIC8vIFNlc3Npb24gVGltZW91dCBwbHVzIHRoZSBtYWdpYyAzMCBzZWNvbmQgZGVsYXlcclxuICAgIHZhciBkZWZhdWx0VGltZW91dE91dDtcclxuXHJcblxyXG4gICAgLy8gTGV0IHRoZSB0ZXN0cyBrbm93IHdlJ2xsIHVzZSB0aGUgc2FpbHBvaW50IG1vZHVsZS5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRpbWVvdXRNb2R1bGUsIHV0aWxNb2R1bGUpKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHVwIHRoZSBnbG9iYWwgdmFyaWFibGVzIGJlZm9yZSBlYWNoIHNwZWMgaXMgcnVuLiAgTm90ZSB0aGF0IHRoZVxyXG4gICAgICogX3RpbWVvdXRTZXJ2aWNlXyB0aGF0IGlzIGJlaW5nIGluamVjdGVkIGhlcmUgaXMgdGhlIG5nTW9jay4kdGltZW91dFxyXG4gICAgICogc2VydmljZSAuLi4gbm90IG91ciBUaW1lb3V0U2VydmljZS5cclxuICAgICAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyR0aW1lb3V0XywgXyRtb2RhbF8sIF90aW1lb3V0U2VydmljZV8sIF9TRVNTSU9OX1RJTUVPVVRfKSB7XHJcbiAgICAgICAgJHRpbWVvdXQgPSBfJHRpbWVvdXRfO1xyXG4gICAgICAgIHRpbWVvdXRTZXJ2aWNlID0gX3RpbWVvdXRTZXJ2aWNlXztcclxuICAgICAgICAvKiBJdCBsb29rcyBsaWtlIG1vZGFsT3BlblNweSBpcyBvbmx5IHVzZWQgYnkgb25lIHRlc3QsIGJ1dCBpdCBpcyByZWFsbHkgcmVtb3ZpbmdcclxuICAgICAgICAgKiBhIGJ1bmNoIG9mIHRpbWVvdXQvaHR0cGJhY2tlbmQgaGVhZGFjaGVzIGZyb20gYWxsIHRoZSB0ZXN0cyB0aGF0IHNob3cgdGhlXHJcbiAgICAgICAgICogdGltZW91dCBkaWFsb2cgKi9cclxuICAgICAgICBtb2RhbE9wZW5TcHkgPSBzcHlPbihfJG1vZGFsXywgJ29wZW4nKTtcclxuICAgICAgICBzaG93VGltZW91dFNweSA9IHNweU9uKHRpbWVvdXRTZXJ2aWNlLCAnc2hvd1RpbWVvdXREaWFsb2cnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICByZXNldFRpbWVvdXRTcHkgPSBzcHlPbih0aW1lb3V0U2VydmljZSwgJ3Jlc2V0VGltZW91dCcpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgIGRlZmF1bHRUaW1lb3V0T3V0ID0gX1NFU1NJT05fVElNRU9VVF8gKyAzMDAwMDtcclxuICAgIH0pKTtcclxuXHJcbiAgICBpdCgnY2FsbHMgdGhlIHNob3dUaW1lb3V0RGlhbG9nIGZ1bmN0aW9uIHdoZW4gdGhlIHRpbWVvdXQgZXhwaXJlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIFJlc2V0IHRoZSB0aW1lb3V0IHdpdGggb3VyIHNweSBvYmplY3QuXHJcbiAgICAgICAgdGltZW91dFNlcnZpY2UucmVzZXRUaW1lb3V0KCk7XHJcblxyXG4gICAgICAgIC8vIEZhc3QtZm9yd2FyZCBoYWxmIHdheSB0aHJvdWdoIHRoZSB0aW1lb3V0XHJcbiAgICAgICAgJHRpbWVvdXQuZmx1c2goZGVmYXVsdFRpbWVvdXRPdXQgLyAyKTtcclxuICAgICAgICBleHBlY3Qoc2hvd1RpbWVvdXRTcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIC8vIEZhc3QtZm9yd2FyZCB0aGUgcmVzdCBvZiB0aGUgd2F5IHRocm91Z2ggdGhlIHRpbWVvdXRcclxuICAgICAgICAkdGltZW91dC5mbHVzaCgoZGVmYXVsdFRpbWVvdXRPdXQgLyAyKSk7XHJcbiAgICAgICAgZXhwZWN0KHNob3dUaW1lb3V0U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZXJlIGlzIG5vdGhpbmcgaW4gdGhlIHRpbWVvdXQgcXVldWUuXHJcbiAgICAgICAgJHRpbWVvdXQudmVyaWZ5Tm9QZW5kaW5nVGFza3MoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdleHRlbmRzIHRoZSB0aW1lb3V0IHdoZW4gdGhlIHRpbWVvdXQgaXMgcmVzZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgUkVTRVRfV0FJVCA9IDUwMDA7XHJcblxyXG4gICAgICAgIC8vIFJlc2V0IHRoZSB0aW1lb3V0IHdpdGggb3VyIHNweSBvYmplY3QgKHRpbWUgPSAwKS5cclxuICAgICAgICB0aW1lb3V0U2VydmljZS5yZXNldFRpbWVvdXQoKTtcclxuXHJcbiAgICAgICAgLy8gR28gZm9yd2FyZCBhIGZldyBzZWNvbmRzLiAgVGhlbiByZXNldCB0aGUgdGltZW91dCBhZ2FpbiAodGltZSA9IDUpLlxyXG4gICAgICAgICR0aW1lb3V0LmZsdXNoKFJFU0VUX1dBSVQpO1xyXG4gICAgICAgIHRpbWVvdXRTZXJ2aWNlLnJlc2V0VGltZW91dCgpO1xyXG5cclxuICAgICAgICAvLyBHbyBqdXN0IHBhc3QgdGhlIG9yaWdpbmFsIHRpbWVvdXQgYW5kIGVuc3VyZSB0aGF0IHRoZSBvcmlnaW5hbFxyXG4gICAgICAgIC8vIHRpbWVvdXQgZG9lcyBub3QgZ2V0IGNhbGxlZC5cclxuICAgICAgICAkdGltZW91dC5mbHVzaChkZWZhdWx0VGltZW91dE91dCArIDEwIC0gUkVTRVRfV0FJVCk7XHJcbiAgICAgICAgZXhwZWN0KHNob3dUaW1lb3V0U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICAvLyBHbyBwYXN0IHRoZSBzZWNvbmQgcmVzZXQncyB0aW1lb3V0IHRvIHZlcmlmeSB0aGF0IHRoZSBmaXJzdCBjYWxsYmFja1xyXG4gICAgICAgIC8vIGRvZXMgbm90IGdldCBjYWxsZWQgYW5kIHRoZSBuZXcgY2FsbGJhY2sgZG9lcyAodGltZSA9IHRpbWVvdXQgKyA1ICsgMzApXHJcbiAgICAgICAgJHRpbWVvdXQuZmx1c2goUkVTRVRfV0FJVCk7XHJcbiAgICAgICAgZXhwZWN0KHNob3dUaW1lb3V0U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgJHRpbWVvdXQudmVyaWZ5Tm9QZW5kaW5nVGFza3MoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG93cyB0aGUgdGltZW91dCBkaWFsb2cgd2hlbiByZXF1ZXN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aW1lb3V0U2VydmljZS5zaG93VGltZW91dERpYWxvZygpO1xyXG4gICAgICAgIGV4cGVjdChtb2RhbE9wZW5TcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG93cyB0aGUgcHJlLWV4cGlyZSB3YXJuaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHdhcm5pbmdEZWxheSA9IDMwMDAwICsgMTAwMCwgLy8gZml2ZSBtaW51dGVzICsgYSBsaXR0bGUgd2lnZ2xlIHJvb21cclxuICAgICAgICAgICAgc2hvd1dhcm5pbmdTcHkgPSBzcHlPbih0aW1lb3V0U2VydmljZSwgJ3Nob3dXYXJuaW5nRGlhbG9nJykuYW5kLmNhbGxGYWtlKGFuZ3VsYXIubm9vcCk7XHJcbiAgICAgICAgLy8gUmVzZXQgdGhlIHRpbWVvdXQgd2l0aCBvdXIgc3B5IG9iamVjdCAodGltZSA9IDApLlxyXG4gICAgICAgIHRpbWVvdXRTZXJ2aWNlLnJlc2V0VGltZW91dCgpO1xyXG5cclxuICAgICAgICAvLyBHbyBmb3J3YXJkIGEgZmV3IHNlY29uZHMuICBUaGVuIHJlc2V0IHRoZSB0aW1lb3V0IGFnYWluICh0aW1lID0gNSkuXHJcbiAgICAgICAgJHRpbWVvdXQuZmx1c2goZGVmYXVsdFRpbWVvdXRPdXQgLSB3YXJuaW5nRGVsYXkpO1xyXG4gICAgICAgIGV4cGVjdChzaG93V2FybmluZ1NweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIC8vIGZsdXNoIHRoZSBleHBpcmVkIGRpYWxvZyB0b29cclxuICAgICAgICAkdGltZW91dC5mbHVzaCh3YXJuaW5nRGVsYXkpO1xyXG4gICAgICAgICR0aW1lb3V0LnZlcmlmeU5vUGVuZGluZ1Rhc2tzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvd3MgdGhlIHdhcm5pbmcgZGlhbG9nIHdoZW4gcmVxdWVzdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGltZW91dFNlcnZpY2Uuc2hvd1dhcm5pbmdEaWFsb2coKTtcclxuICAgICAgICBleHBlY3QobW9kYWxPcGVuU3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
