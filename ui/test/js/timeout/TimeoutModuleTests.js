System.register(['test/js/TestInitializer', 'timeout/TimeoutModule', 'common/util/UtilModule'], function (_export) {

    /**
     * Tests for the Timeout Module.
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
            describe('Timeout Module', function () {

                // The ngMock $timeout service.
                var $timeout;

                // The TimeoutService that will be tested.
                var timeoutService;

                // A jasmine spy that can be called on timeout.
                var resetTimeoutSpy;

                // Let the tests know we'll use the sailpoint module.
                beforeEach(module(timeoutModule, utilModule));

                /**
                 * Setup the global variables before each spec is run.  Note that the
                 * _$timeout_ that is being injected here is the ngMock.$timeout
                 * service ... not our TimeoutService.
                 */
                beforeEach(inject(function (_$timeout_, _timeoutService_) {
                    $timeout = _$timeout_;
                    timeoutService = _timeoutService_;
                    resetTimeoutSpy = spyOn(timeoutService, 'resetTimeout').and.callThrough();
                }));

                it('starts timeout when initialized', inject(function ($modal, SESSION_TIMEOUT) {
                    /* The call to resetTimeout in the run block initializes the timeout to
                     * the real showTimeoutDialog function before we can wedge our spy in.
                     * So here I am spying on $modal.open */
                    var modalSpy = spyOn($modal, 'open');
                    expect(modalSpy).not.toHaveBeenCalled();
                    $timeout.flush(SESSION_TIMEOUT + 30000);
                    expect(modalSpy).toHaveBeenCalled();
                    $timeout.verifyNoPendingTasks();
                }));

                it('resets timeout on AJAX requests', inject(function ($http, $httpBackend) {
                    var initialCallCount = resetTimeoutSpy.calls.count();
                    $httpBackend.whenGET('/fakeURL').respond('yay!');
                    $http.get('/fakeURL');
                    $httpBackend.flush();
                    expect(resetTimeoutSpy.calls.count() - initialCallCount).toBe(1);
                }));

                it('does not reset timeout on AJAX for modal template', inject(function ($http, $httpBackend) {
                    var initialCallCount = resetTimeoutSpy.calls.count(),
                        modalTemplateUrl = 'template/modal';
                    $httpBackend.whenGET(modalTemplateUrl).respond('yay!');
                    $http.get(modalTemplateUrl);
                    $httpBackend.flush();
                    expect(resetTimeoutSpy.calls.count() - initialCallCount).toBe(0);
                }));
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVvdXQvVGltZW91dE1vZHVsZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQix5QkFBeUIsMkJBQTJCLFVBQVUsU0FBUzs7Ozs7SUFLL0c7O0lBRUEsSUFBSSxlQUFlO0lBQ25CLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHVCQUF1QjtZQUM3RSxnQkFBZ0Isc0JBQXNCO1dBQ3ZDLFVBQVUsdUJBQXVCO1lBQ2hDLGFBQWEsc0JBQXNCOztRQUV2QyxTQUFTLFlBQVk7WUFON0IsU0FBUyxrQkFBa0IsWUFBVzs7O2dCQUdsQyxJQUFJOzs7Z0JBR0osSUFBSTs7O2dCQUdKLElBQUk7OztnQkFHSixXQUFXLE9BQU8sZUFBZTs7Ozs7OztnQkFPakMsV0FBVyxPQUFPLFVBQVMsWUFBWSxrQkFBa0I7b0JBQ3JELFdBQVc7b0JBQ1gsaUJBQWlCO29CQUNqQixrQkFBa0IsTUFBTSxnQkFBZ0IsZ0JBQWdCLElBQUk7OztnQkFHaEUsR0FBRyxtQ0FBbUMsT0FBTyxVQUFTLFFBQVEsaUJBQWlCOzs7O29CQUkzRSxJQUFJLFdBQVcsTUFBTSxRQUFRO29CQUM3QixPQUFPLFVBQVUsSUFBSTtvQkFDckIsU0FBUyxNQUFNLGtCQUFrQjtvQkFDakMsT0FBTyxVQUFVO29CQUNqQixTQUFTOzs7Z0JBR2IsR0FBRyxtQ0FBbUMsT0FBTyxVQUFTLE9BQU8sY0FBYztvQkFDdkUsSUFBSSxtQkFBbUIsZ0JBQWdCLE1BQU07b0JBQzdDLGFBQWEsUUFBUSxZQUFZLFFBQVE7b0JBQ3pDLE1BQU0sSUFBSTtvQkFDVixhQUFhO29CQUNiLE9BQU8sZ0JBQWdCLE1BQU0sVUFBVSxrQkFBa0IsS0FBSzs7O2dCQUdsRSxHQUFHLHFEQUFxRCxPQUFPLFVBQVMsT0FBTyxjQUFjO29CQUN6RixJQUFJLG1CQUFtQixnQkFBZ0IsTUFBTTt3QkFDekMsbUJBQW1CO29CQUN2QixhQUFhLFFBQVEsa0JBQWtCLFFBQVE7b0JBQy9DLE1BQU0sSUFBSTtvQkFDVixhQUFhO29CQUNiLE9BQU8sZ0JBQWdCLE1BQU0sVUFBVSxrQkFBa0IsS0FBSzs7Ozs7R0FZbkUiLCJmaWxlIjoidGltZW91dC9UaW1lb3V0TW9kdWxlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcblxuaW1wb3J0IHRpbWVvdXRNb2R1bGUgZnJvbSAndGltZW91dC9UaW1lb3V0TW9kdWxlJztcbmltcG9ydCB1dGlsTW9kdWxlIGZyb20gJ2NvbW1vbi91dGlsL1V0aWxNb2R1bGUnO1xuXG4vKipcbiAqIFRlc3RzIGZvciB0aGUgVGltZW91dCBNb2R1bGUuXG4gKi9cbmRlc2NyaWJlKCdUaW1lb3V0IE1vZHVsZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gVGhlIG5nTW9jayAkdGltZW91dCBzZXJ2aWNlLlxuICAgIHZhciAkdGltZW91dDtcblxuICAgIC8vIFRoZSBUaW1lb3V0U2VydmljZSB0aGF0IHdpbGwgYmUgdGVzdGVkLlxuICAgIHZhciB0aW1lb3V0U2VydmljZTtcblxuICAgIC8vIEEgamFzbWluZSBzcHkgdGhhdCBjYW4gYmUgY2FsbGVkIG9uIHRpbWVvdXQuXG4gICAgdmFyIHJlc2V0VGltZW91dFNweTtcblxuICAgIC8vIExldCB0aGUgdGVzdHMga25vdyB3ZSdsbCB1c2UgdGhlIHNhaWxwb2ludCBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUodGltZW91dE1vZHVsZSwgdXRpbE1vZHVsZSkpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdGhlIGdsb2JhbCB2YXJpYWJsZXMgYmVmb3JlIGVhY2ggc3BlYyBpcyBydW4uICBOb3RlIHRoYXQgdGhlXG4gICAgICogXyR0aW1lb3V0XyB0aGF0IGlzIGJlaW5nIGluamVjdGVkIGhlcmUgaXMgdGhlIG5nTW9jay4kdGltZW91dFxuICAgICAqIHNlcnZpY2UgLi4uIG5vdCBvdXIgVGltZW91dFNlcnZpY2UuXG4gICAgICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyR0aW1lb3V0XywgX3RpbWVvdXRTZXJ2aWNlXykge1xuICAgICAgICAkdGltZW91dCA9IF8kdGltZW91dF87XG4gICAgICAgIHRpbWVvdXRTZXJ2aWNlID0gX3RpbWVvdXRTZXJ2aWNlXztcbiAgICAgICAgcmVzZXRUaW1lb3V0U3B5ID0gc3B5T24odGltZW91dFNlcnZpY2UsICdyZXNldFRpbWVvdXQnKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc3RhcnRzIHRpbWVvdXQgd2hlbiBpbml0aWFsaXplZCcsIGluamVjdChmdW5jdGlvbigkbW9kYWwsIFNFU1NJT05fVElNRU9VVCkge1xuICAgICAgICAvKiBUaGUgY2FsbCB0byByZXNldFRpbWVvdXQgaW4gdGhlIHJ1biBibG9jayBpbml0aWFsaXplcyB0aGUgdGltZW91dCB0b1xuICAgICAgICAgKiB0aGUgcmVhbCBzaG93VGltZW91dERpYWxvZyBmdW5jdGlvbiBiZWZvcmUgd2UgY2FuIHdlZGdlIG91ciBzcHkgaW4uXG4gICAgICAgICAqIFNvIGhlcmUgSSBhbSBzcHlpbmcgb24gJG1vZGFsLm9wZW4gKi9cbiAgICAgICAgdmFyIG1vZGFsU3B5ID0gc3B5T24oJG1vZGFsLCAnb3BlbicpO1xuICAgICAgICBleHBlY3QobW9kYWxTcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICR0aW1lb3V0LmZsdXNoKFNFU1NJT05fVElNRU9VVCArIDMwMDAwKTtcbiAgICAgICAgZXhwZWN0KG1vZGFsU3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICR0aW1lb3V0LnZlcmlmeU5vUGVuZGluZ1Rhc2tzKCk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Jlc2V0cyB0aW1lb3V0IG9uIEFKQVggcmVxdWVzdHMnLCBpbmplY3QoZnVuY3Rpb24oJGh0dHAsICRodHRwQmFja2VuZCkge1xuICAgICAgICB2YXIgaW5pdGlhbENhbGxDb3VudCA9IHJlc2V0VGltZW91dFNweS5jYWxscy5jb3VudCgpO1xuICAgICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgnL2Zha2VVUkwnKS5yZXNwb25kKCd5YXkhJyk7XG4gICAgICAgICRodHRwLmdldCgnL2Zha2VVUkwnKTtcbiAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIGV4cGVjdChyZXNldFRpbWVvdXRTcHkuY2FsbHMuY291bnQoKSAtIGluaXRpYWxDYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ2RvZXMgbm90IHJlc2V0IHRpbWVvdXQgb24gQUpBWCBmb3IgbW9kYWwgdGVtcGxhdGUnLCBpbmplY3QoZnVuY3Rpb24oJGh0dHAsICRodHRwQmFja2VuZCkge1xuICAgICAgICB2YXIgaW5pdGlhbENhbGxDb3VudCA9IHJlc2V0VGltZW91dFNweS5jYWxscy5jb3VudCgpLFxuICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZVVybCA9ICd0ZW1wbGF0ZS9tb2RhbCc7XG4gICAgICAgICRodHRwQmFja2VuZC53aGVuR0VUKG1vZGFsVGVtcGxhdGVVcmwpLnJlc3BvbmQoJ3lheSEnKTtcbiAgICAgICAgJGh0dHAuZ2V0KG1vZGFsVGVtcGxhdGVVcmwpO1xuICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgZXhwZWN0KHJlc2V0VGltZW91dFNweS5jYWxscy5jb3VudCgpIC0gaW5pdGlhbENhbGxDb3VudCkudG9CZSgwKTtcbiAgICB9KSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
