System.register(['test/js/TestInitializer', 'reset/ResetModule'], function (_export) {
    /* (c) Copyright 2014 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * Project: identityiq
     * Author: michael.hide
     * Created: 2/21/14 4:26 PM
     */

    'use strict';

    var resetModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_resetResetModule) {
            resetModule = _resetResetModule['default'];
        }],
        execute: function () {
            describe('routingService', function () {

                var window,
                    location,
                    routingSvc,
                    mockWindow = { location: { replace: jasmine.createSpy(), protocol: 'http:', host: 'localhost' } };

                beforeEach(module(resetModule));

                var injectServices = function injectServices(origin, action) {
                    //Create a mock ResetDataService service that will be used by the RoutingService.
                    beforeEach(module(function ($provide) {
                        // Provide the mock as the ResetDataService, so this service will use it.
                        $provide.factory('resetDataService', function () {
                            return {
                                origin: origin,
                                action: action
                            };
                        });

                        // Provide a mocked up $window service
                        $provide.value('$window', mockWindow);

                        // Pass in the context path so we can test the full URL
                        // with $window.location.replace
                        $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                    }));

                    // inject the RoutingService, and $location so we can spy on path().
                    beforeEach(inject(function (routingService, $location, $window) {
                        window = $window;
                        location = $location;
                        spyOn(location, 'path');

                        routingSvc = routingService;
                    }));
                };

                describe('desktop password reset', function () {

                    injectServices('desktopUIReset', 'passwordReset');

                    it('should redirect to dashboard', function () {
                        routingSvc.navigateSuccess();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/home.jsf');
                    });
                });

                describe('mobile password reset', function () {

                    injectServices('mobileUIReset', 'passwordReset');

                    it('should redirect to mobile index', function () {
                        routingSvc.navigateSuccess();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/ui/index.jsf');
                    });
                });

                describe('desktop account reset', function () {

                    injectServices('desktopUIReset', 'accountUnlock');

                    it('should redirect to desktop login', function () {
                        routingSvc.navigateSuccess();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/login.jsf');
                    });
                });

                describe('mobile account reset', function () {

                    injectServices('mobileUIReset', 'accountUnlock');

                    it('should redirect to mobile login', function () {
                        routingSvc.navigateSuccess();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/ui/login.jsf');
                    });
                });

                describe('GINA password reset', function () {

                    injectServices('desktopReset', 'passwordReset');

                    it('should redirect to thank you page', function () {
                        routingSvc.navigateSuccess();
                        expect(location.path).toHaveBeenCalledWith('/thankYou');
                    });
                });

                describe('GINA account reset', function () {

                    injectServices('desktopReset', 'accountUnlock');

                    it('should redirect to thank you page', function () {
                        routingSvc.navigateSuccess();
                        expect(location.path).toHaveBeenCalledWith('/thankYou');
                    });
                });

                describe('cancel from desktop password reset', function () {

                    injectServices('desktopUIReset', 'passwordReset');

                    it('should redirect to desktop login', function () {
                        routingSvc.navigateCancel();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/login.jsf');
                    });
                });

                describe('cancel from mobile password reset', function () {

                    injectServices('desktopUIReset', 'passwordReset');

                    it('should redirect to mobile login', function () {
                        routingSvc.navigateCancel();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/ui/login.jsf');
                    });
                });

                describe('cancel from GINA flow', function () {

                    injectServices('desktopReset', 'passwordReset');

                    it('should redirect to GINA username screen', function () {
                        routingSvc.navigateCancel();
                        expect(window.location.replace).toHaveBeenCalledWith('http://localhost/identityiq/desktopreset');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2V0L1JvdXRpbmdTZXJ2aWNlVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0JBQXNCLFVBQVUsU0FBUzs7Ozs7Ozs7O0lBQ3JGOztJQVVJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQkFBbUI7WUFDekUsY0FBYyxrQkFBa0I7O1FBRXBDLFNBQVMsWUFBWTtZQUo3QixTQUFTLGtCQUFrQixZQUFXOztnQkFFbEMsSUFBSTtvQkFDQTtvQkFDQTtvQkFDQSxhQUFhLEVBQUMsVUFBVSxFQUFDLFNBQVMsUUFBUSxhQUFhLFVBQVUsU0FBUyxNQUFNOztnQkFFcEYsV0FBVyxPQUFPOztnQkFFbEIsSUFBSSxpQkFBaUIsU0FBUyxlQUFlLFFBQVEsUUFBUTs7b0JBRXpELFdBQVcsT0FBTyxVQUFTLFVBQVU7O3dCQUVqQyxTQUFTLFFBQVEsb0JBQW9CLFlBQVc7NEJBQzVDLE9BQU87Z0NBQ0gsUUFBUTtnQ0FDUixRQUFROzs7Ozt3QkFLaEIsU0FBUyxNQUFNLFdBQVc7Ozs7d0JBSTFCLFNBQVMsU0FBUyxtQkFBbUI7Ozs7b0JBSXpDLFdBQVcsT0FBTyxVQUFTLGdCQUFnQixXQUFXLFNBQVM7d0JBQzNELFNBQVM7d0JBQ1QsV0FBVzt3QkFDWCxNQUFNLFVBQVU7O3dCQUVoQixhQUFhOzs7O2dCQUlyQixTQUFTLDBCQUEwQixZQUFXOztvQkFFMUMsZUFBZSxrQkFBa0I7O29CQUVqQyxHQUFHLGdDQUFnQyxZQUFXO3dCQUMxQyxXQUFXO3dCQUNYLE9BQU8sT0FBTyxTQUFTLFNBQVMscUJBQXFCOzs7O2dCQUk3RCxTQUFTLHlCQUF5QixZQUFXOztvQkFFekMsZUFBZSxpQkFBaUI7O29CQUVoQyxHQUFHLG1DQUFtQyxZQUFXO3dCQUM3QyxXQUFXO3dCQUNYLE9BQU8sT0FBTyxTQUFTLFNBQVMscUJBQXFCOzs7O2dCQUk3RCxTQUFTLHlCQUF5QixZQUFXOztvQkFFekMsZUFBZSxrQkFBa0I7O29CQUVqQyxHQUFHLG9DQUFvQyxZQUFXO3dCQUM5QyxXQUFXO3dCQUNYLE9BQU8sT0FBTyxTQUFTLFNBQVMscUJBQXFCOzs7O2dCQUk3RCxTQUFTLHdCQUF3QixZQUFXOztvQkFFeEMsZUFBZSxpQkFBaUI7O29CQUVoQyxHQUFHLG1DQUFtQyxZQUFXO3dCQUM3QyxXQUFXO3dCQUNYLE9BQU8sT0FBTyxTQUFTLFNBQVMscUJBQXFCOzs7O2dCQUk3RCxTQUFTLHVCQUF1QixZQUFXOztvQkFFdkMsZUFBZSxnQkFBZ0I7O29CQUUvQixHQUFHLHFDQUFxQyxZQUFXO3dCQUMvQyxXQUFXO3dCQUNYLE9BQU8sU0FBUyxNQUFNLHFCQUFxQjs7OztnQkFJbkQsU0FBUyxzQkFBc0IsWUFBVzs7b0JBRXRDLGVBQWUsZ0JBQWdCOztvQkFFL0IsR0FBRyxxQ0FBcUMsWUFBVzt3QkFDL0MsV0FBVzt3QkFDWCxPQUFPLFNBQVMsTUFBTSxxQkFBcUI7Ozs7Z0JBSW5ELFNBQVMsc0NBQXNDLFlBQVc7O29CQUV0RCxlQUFlLGtCQUFrQjs7b0JBRWpDLEdBQUcsb0NBQW9DLFlBQVc7d0JBQzlDLFdBQVc7d0JBQ1gsT0FBTyxPQUFPLFNBQVMsU0FBUyxxQkFBcUI7Ozs7Z0JBSTdELFNBQVMscUNBQXFDLFlBQVc7O29CQUVyRCxlQUFlLGtCQUFrQjs7b0JBRWpDLEdBQUcsbUNBQW1DLFlBQVc7d0JBQzdDLFdBQVc7d0JBQ1gsT0FBTyxPQUFPLFNBQVMsU0FBUyxxQkFBcUI7Ozs7Z0JBSTdELFNBQVMseUJBQXlCLFlBQVc7O29CQUV6QyxlQUFlLGdCQUFnQjs7b0JBRS9CLEdBQUcsMkNBQTJDLFlBQVc7d0JBQ3JELFdBQVc7d0JBQ1gsT0FBTyxPQUFPLFNBQVMsU0FDbkIscUJBQXFCOzs7Ozs7R0FVbEMiLCJmaWxlIjoicmVzZXQvUm91dGluZ1NlcnZpY2VUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE0IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgcmVzZXRNb2R1bGUgZnJvbSAncmVzZXQvUmVzZXRNb2R1bGUnO1xyXG5cclxuLyoqXHJcbiAqIFByb2plY3Q6IGlkZW50aXR5aXFcclxuICogQXV0aG9yOiBtaWNoYWVsLmhpZGVcclxuICogQ3JlYXRlZDogMi8yMS8xNCA0OjI2IFBNXHJcbiAqL1xyXG5cclxuZGVzY3JpYmUoJ3JvdXRpbmdTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIHdpbmRvdyxcclxuICAgICAgICBsb2NhdGlvbixcclxuICAgICAgICByb3V0aW5nU3ZjLFxyXG4gICAgICAgIG1vY2tXaW5kb3cgPSB7bG9jYXRpb246IHtyZXBsYWNlOiBqYXNtaW5lLmNyZWF0ZVNweSgpLCBwcm90b2NvbDogJ2h0dHA6JywgaG9zdDogJ2xvY2FsaG9zdCd9fTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShyZXNldE1vZHVsZSkpO1xyXG5cclxuICAgIHZhciBpbmplY3RTZXJ2aWNlcyA9IGZ1bmN0aW9uIGluamVjdFNlcnZpY2VzKG9yaWdpbiwgYWN0aW9uKSB7XHJcbiAgICAgICAgLy9DcmVhdGUgYSBtb2NrIFJlc2V0RGF0YVNlcnZpY2Ugc2VydmljZSB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgUm91dGluZ1NlcnZpY2UuXHJcbiAgICAgICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcclxuICAgICAgICAgICAgLy8gUHJvdmlkZSB0aGUgbW9jayBhcyB0aGUgUmVzZXREYXRhU2VydmljZSwgc28gdGhpcyBzZXJ2aWNlIHdpbGwgdXNlIGl0LlxyXG4gICAgICAgICAgICAkcHJvdmlkZS5mYWN0b3J5KCdyZXNldERhdGFTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogb3JpZ2luLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFByb3ZpZGUgYSBtb2NrZWQgdXAgJHdpbmRvdyBzZXJ2aWNlXHJcbiAgICAgICAgICAgICRwcm92aWRlLnZhbHVlKCckd2luZG93JywgbW9ja1dpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXNzIGluIHRoZSBjb250ZXh0IHBhdGggc28gd2UgY2FuIHRlc3QgdGhlIGZ1bGwgVVJMXHJcbiAgICAgICAgICAgIC8vIHdpdGggJHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlXHJcbiAgICAgICAgICAgICRwcm92aWRlLmNvbnN0YW50KCdTUF9DT05URVhUX1BBVEgnLCAnL2lkZW50aXR5aXEnKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIC8vIGluamVjdCB0aGUgUm91dGluZ1NlcnZpY2UsIGFuZCAkbG9jYXRpb24gc28gd2UgY2FuIHNweSBvbiBwYXRoKCkuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24ocm91dGluZ1NlcnZpY2UsICRsb2NhdGlvbiwgJHdpbmRvdykge1xyXG4gICAgICAgICAgICB3aW5kb3cgPSAkd2luZG93O1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9ICRsb2NhdGlvbjtcclxuICAgICAgICAgICAgc3B5T24obG9jYXRpb24sICdwYXRoJyk7XHJcblxyXG4gICAgICAgICAgICByb3V0aW5nU3ZjID0gcm91dGluZ1NlcnZpY2U7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGVza3RvcCBwYXNzd29yZCByZXNldCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpbmplY3RTZXJ2aWNlcygnZGVza3RvcFVJUmVzZXQnLCAncGFzc3dvcmRSZXNldCcpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IHRvIGRhc2hib2FyZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlU3VjY2VzcygpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2luZG93LmxvY2F0aW9uLnJlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdodHRwOi8vbG9jYWxob3N0L2lkZW50aXR5aXEvaG9tZS5qc2YnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdtb2JpbGUgcGFzc3dvcmQgcmVzZXQnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaW5qZWN0U2VydmljZXMoJ21vYmlsZVVJUmVzZXQnLCAncGFzc3dvcmRSZXNldCcpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IHRvIG1vYmlsZSBpbmRleCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlU3VjY2VzcygpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2luZG93LmxvY2F0aW9uLnJlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdodHRwOi8vbG9jYWxob3N0L2lkZW50aXR5aXEvdWkvaW5kZXguanNmJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGVza3RvcCBhY2NvdW50IHJlc2V0JywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGluamVjdFNlcnZpY2VzKCdkZXNrdG9wVUlSZXNldCcsICdhY2NvdW50VW5sb2NrJyk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgcmVkaXJlY3QgdG8gZGVza3RvcCBsb2dpbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlU3VjY2VzcygpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2luZG93LmxvY2F0aW9uLnJlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdodHRwOi8vbG9jYWxob3N0L2lkZW50aXR5aXEvbG9naW4uanNmJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnbW9iaWxlIGFjY291bnQgcmVzZXQnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaW5qZWN0U2VydmljZXMoJ21vYmlsZVVJUmVzZXQnLCAnYWNjb3VudFVubG9jaycpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IHRvIG1vYmlsZSBsb2dpbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlU3VjY2VzcygpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2luZG93LmxvY2F0aW9uLnJlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdodHRwOi8vbG9jYWxob3N0L2lkZW50aXR5aXEvdWkvbG9naW4uanNmJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnR0lOQSBwYXNzd29yZCByZXNldCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpbmplY3RTZXJ2aWNlcygnZGVza3RvcFJlc2V0JywgJ3Bhc3N3b3JkUmVzZXQnKTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZWRpcmVjdCB0byB0aGFuayB5b3UgcGFnZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlU3VjY2VzcygpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy90aGFua1lvdScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ0dJTkEgYWNjb3VudCByZXNldCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpbmplY3RTZXJ2aWNlcygnZGVza3RvcFJlc2V0JywgJ2FjY291bnRVbmxvY2snKTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZWRpcmVjdCB0byB0aGFuayB5b3UgcGFnZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlU3VjY2VzcygpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy90aGFua1lvdScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NhbmNlbCBmcm9tIGRlc2t0b3AgcGFzc3dvcmQgcmVzZXQnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaW5qZWN0U2VydmljZXMoJ2Rlc2t0b3BVSVJlc2V0JywgJ3Bhc3N3b3JkUmVzZXQnKTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZWRpcmVjdCB0byBkZXNrdG9wIGxvZ2luJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJvdXRpbmdTdmMubmF2aWdhdGVDYW5jZWwoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnaHR0cDovL2xvY2FsaG9zdC9pZGVudGl0eWlxL2xvZ2luLmpzZicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NhbmNlbCBmcm9tIG1vYmlsZSBwYXNzd29yZCByZXNldCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpbmplY3RTZXJ2aWNlcygnZGVza3RvcFVJUmVzZXQnLCAncGFzc3dvcmRSZXNldCcpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJlZGlyZWN0IHRvIG1vYmlsZSBsb2dpbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByb3V0aW5nU3ZjLm5hdmlnYXRlQ2FuY2VsKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh3aW5kb3cubG9jYXRpb24ucmVwbGFjZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2h0dHA6Ly9sb2NhbGhvc3QvaWRlbnRpdHlpcS91aS9sb2dpbi5qc2YnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdjYW5jZWwgZnJvbSBHSU5BIGZsb3cnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaW5qZWN0U2VydmljZXMoJ2Rlc2t0b3BSZXNldCcsICdwYXNzd29yZFJlc2V0Jyk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgcmVkaXJlY3QgdG8gR0lOQSB1c2VybmFtZSBzY3JlZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcm91dGluZ1N2Yy5uYXZpZ2F0ZUNhbmNlbCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2luZG93LmxvY2F0aW9uLnJlcGxhY2UpLlxyXG4gICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2h0dHA6Ly9sb2NhbGhvc3QvaWRlbnRpdHlpcS9kZXNrdG9wcmVzZXQnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
