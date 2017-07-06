System.register(['test/js/TestInitializer', 'reset/ResetModule'], function (_export) {

    /**
     * Tests for the SMSResetCtrl.
     */
    'use strict';

    var resetModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_resetResetModule) {
            resetModule = _resetResetModule['default'];
        }],
        execute: function () {
            describe('SMSResetCtrl', function () {

                var rootScope, scope, http, changePasswordService, unlockAccountService;

                beforeEach(module(resetModule));

                /*
                 * Creates a controller with a mock scope object
                 */
                var createWithValidData = function () {
                    scope.textCode = '123456';
                    scope.passwordModel.password = 'nicePassword';
                    scope.passwordModel.confirm = 'nicePassword';
                };

                var createWithInvalidData = function () {
                    scope.textCode = '123456';
                    scope.passwordModel.password = 'nicePassword';
                    scope.passwordModel.confirm = 'NOTnicePassword';
                };

                var getUrl = function () {
                    return '/ui/rest/userReset/sendSMS';
                };

                // now for the tests
                describe('password reset:', function () {
                    beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {
                        rootScope = $rootScope;
                        scope = $rootScope.$new();
                        http = $httpBackend;

                        changePasswordService = {
                            withSMS: jasmine.createSpy().and.callFake(function () {
                                var deferred = $q.defer();
                                deferred.reject({ data: { message: ['Password Policy violated.'] } });
                                return deferred.promise;
                            })
                        };

                        $controller('SMSResetCtrl', {
                            $scope: scope,
                            changePasswordService: changePasswordService
                        });
                    }));

                    describe('on initialization', function () {
                        it('should disable the submit button', function () {
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                    });

                    describe('when valid', function () {
                        it('should enable the submit button', function () {
                            createWithValidData();
                            expect(scope.isDisableSubmit()).toEqual(false);
                        });
                    });

                    describe('when invalid', function () {
                        it('should disable the submit button', function () {
                            createWithInvalidData();
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                    });

                    describe('calls sendSMS', function () {
                        it('with success', function () {
                            http.expectPOST(getUrl()).respond(200, {});
                            scope.sendSMS();
                            http.flush();

                            expect(scope.smsStatus.show).toBe(true);
                            expect(scope.smsStatus.hasError).toBe(false);
                        });

                        it('with error', function () {
                            http.expectPOST(getUrl()).respond(503, { message: ['SMS Service Provider is unavailable at this time'] });
                            scope.sendSMS();
                            http.flush();

                            expect(scope.smsStatus.show).toBe(true);
                            expect(scope.smsStatus.hasError).toBe(true);
                            expect(scope.smsStatus.text).toBe('SMS Service Provider is unavailable at this time');
                        });
                    });

                    describe('call submit', function () {
                        it('with error', function () {
                            createWithValidData();
                            scope.submit();
                            rootScope.$apply();
                            expect(changePasswordService.withSMS).toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('Password Policy violated.');
                        });
                    });

                    describe('Successful withSMS', function () {
                        var routingService;
                        beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                            rootScope = $rootScope;
                            scope = $rootScope.$new();
                            http = $httpBackend;

                            changePasswordService = {
                                withSMS: jasmine.createSpy().and.callFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        status: 200
                                    });
                                    return deferred.promise;
                                }),
                                loginUser: jasmine.createSpy().and.callFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        status: 200
                                    });
                                    return deferred.promise;
                                })
                            };

                            routingService = {
                                navigateSuccess: jasmine.createSpy().and.callFake(function () {
                                    return;
                                })

                            };

                            $controller('SMSResetCtrl', {
                                $scope: scope,
                                changePasswordService: changePasswordService,
                                unlockAccountService: unlockAccountService,
                                routingService: routingService
                            });
                            $rootScope.$apply();
                        }));

                        describe('Valid Data, Success changePasswordService, Success Login User', function () {

                            it('should allow submit to be called successfully and callloginUser', function () {
                                createWithValidData();
                                scope.submit();
                                rootScope.$apply();
                                expect(changePasswordService.withSMS).toHaveBeenCalled();
                                expect(changePasswordService.loginUser).toHaveBeenCalled();
                                expect(routingService.navigateSuccess).toHaveBeenCalled();
                            });
                        });

                        describe('Unsuccessful Login User', function () {
                            beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                                rootScope = $rootScope;
                                scope = $rootScope.$new();
                                http = $httpBackend;

                                changePasswordService = {
                                    withSMS: jasmine.createSpy().and.callFake(function () {
                                        var deferred = $q.defer();
                                        deferred.resolve({
                                            status: 200
                                        });
                                        return deferred.promise;
                                    }),
                                    loginUser: jasmine.createSpy().and.callFake(function () {
                                        var deferred = $q.defer();
                                        deferred.reject({
                                            data: {
                                                message: ['Invalid username or password.']
                                            },
                                            status: 500
                                        });
                                        return deferred.promise;
                                    })
                                };

                                $controller('SMSResetCtrl', {
                                    $scope: scope,
                                    changePasswordService: changePasswordService,
                                    unlockAccountService: unlockAccountService,
                                    routingService: routingService
                                });
                                $rootScope.$apply();
                            }));

                            describe('Valid Data, Success changePasswordService, Fail Login User', function () {

                                it('should allow submit to be called successfully, call loginUser, stop on error', function () {
                                    createWithValidData();
                                    scope.submit();
                                    rootScope.$apply();
                                    expect(changePasswordService.withSMS).toHaveBeenCalled();
                                    expect(changePasswordService.loginUser).toHaveBeenCalled();
                                    expect(routingService.navigateSuccess).not.toHaveBeenCalled();
                                    expect(scope.errorMessages).toBe('Invalid username or password.');
                                });
                            });
                        });
                    });
                });

                describe('account unlock:', function () {
                    //Create a mock ResetDataService service that will be used by the RoutingService.
                    beforeEach(module(function ($provide) {
                        // Provide the mock as the ResetDataService, so this service will use it.
                        $provide.factory('resetDataService', function () {
                            return {
                                smsStatus: {},
                                action: 'accountUnlock'
                            };
                        });
                    }));

                    beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                        rootScope = $rootScope;
                        scope = $rootScope.$new();
                        http = $httpBackend;

                        unlockAccountService = {
                            withSMS: jasmine.createSpy().and.callFake(function () {
                                var deferred = $q.defer();
                                deferred.reject({ data: { message: ['Password Policy violated.'] }, status: 500 });
                                return deferred.promise;
                            })
                        };

                        $controller('SMSResetCtrl', {
                            $scope: scope,
                            unlockAccountService: unlockAccountService
                        });
                        $rootScope.$apply();
                    }));

                    describe('call submit', function () {
                        it('with error', function () {
                            createWithValidData();
                            scope.submit();
                            rootScope.$apply();
                            expect(unlockAccountService.withSMS).toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('Password Policy violated.');
                            expect(scope.smsStatus.show).toBe(false);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2V0L1NNU1Jlc2V0Q3RybFRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNCQUFzQixVQUFVLFNBQVM7Ozs7O0lBS2pGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQkFBbUI7WUFDekUsY0FBYyxrQkFBa0I7O1FBRXBDLFNBQVMsWUFBWTtZQU43QixTQUFTLGdCQUFnQixZQUFXOztnQkFFaEMsSUFBSSxXQUFXLE9BQU8sTUFBTSx1QkFBdUI7O2dCQUVuRCxXQUFXLE9BQU87Ozs7O2dCQUtsQixJQUFJLHNCQUFzQixZQUFXO29CQUNqQyxNQUFNLFdBQVc7b0JBQ2pCLE1BQU0sY0FBYyxXQUFXO29CQUMvQixNQUFNLGNBQWMsVUFBVTs7O2dCQUdsQyxJQUFJLHdCQUF3QixZQUFXO29CQUNuQyxNQUFNLFdBQVc7b0JBQ2pCLE1BQU0sY0FBYyxXQUFXO29CQUMvQixNQUFNLGNBQWMsVUFBVTs7O2dCQUdsQyxJQUFJLFNBQVMsWUFBVztvQkFDcEIsT0FBTzs7OztnQkFJWCxTQUFTLG1CQUFtQixZQUFXO29CQUNuQyxXQUFXLE9BQU8sVUFBUyxZQUFZLGNBQWMsYUFBYSxJQUFJO3dCQUNsRSxZQUFZO3dCQUNaLFFBQVEsV0FBVzt3QkFDbkIsT0FBTzs7d0JBRVAsd0JBQXdCOzRCQUNwQixTQUFTLFFBQVEsWUFBWSxJQUFJLFNBQVMsWUFBVztnQ0FDakQsSUFBSSxXQUFXLEdBQUc7Z0NBQ2xCLFNBQVMsT0FBTyxFQUFDLE1BQU0sRUFBQyxTQUFTLENBQUM7Z0NBQ2xDLE9BQU8sU0FBUzs7Ozt3QkFJeEIsWUFBWSxnQkFBZ0I7NEJBQ3hCLFFBQVE7NEJBQ1IsdUJBQXVCOzs7O29CQUkvQixTQUFTLHFCQUFxQixZQUFXO3dCQUNyQyxHQUFHLG9DQUFvQyxZQUFXOzRCQUM5QyxPQUFPLE1BQU0sbUJBQW1CLFFBQVE7Ozs7b0JBSWhELFNBQVMs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O29DQUNOLFVBQVU7b0NBQ1YsT0FBTyxzQkFBc0IsU0FBUztvQ0FDdEMsT0FBTyxzQkFBc0IsV0FBVztvQ0FDeEMsT0FBTyxlQUFlLGlCQUFpQixJQUFJO29DQUMzQyxPQUFPLE1BQU0sZUFBZSxLQUFLOzs7Ozs7O2dCQVNyRCxTQUFTLG1CQUFtQixZQUFXOztvQkFFbkMsV0FBVyxPQUFPLFVBQVMsVUFBVTs7d0JBRWpDLFNBQVMsUUFBUSxvQkFBb0IsWUFBVzs0QkFDNUMsT0FBTztnQ0FDSCxXQUFXO2dDQUNYLFFBQVE7Ozs7O29CQUtwQixXQUFXLE9BQU8sVUFBUyxZQUFZLGNBQWMsYUFBYSxJQUFJOzt3QkFFbEUsWUFBWTt3QkFDWixRQUFRLFdBQVc7d0JBQ25CLE9BQU87O3dCQUVQLHVCQUF1Qjs0QkFDbkIsU0FBUyxRQUFRLFlBQVksSUFBSSxTQUM3QixZQUFXO2dDQUNQLElBQUksV0FBVyxHQUFHO2dDQUNsQixTQUFTLE9BQU8sRUFBQyxNQUFNLEVBQUMsU0FBUyxDQUFDLGdDQUErQixRQUFRO2dDQUN6RSxPQUFPLFNBQVM7Ozs7d0JBSTVCLFlBQVksZ0JBQWdCOzRCQUN4QixRQUFROzRCQUNSLHNCQUFzQjs7d0JBRTFCLFdBQVc7OztvQkFJZixTQUFTLGVBQWUsWUFBVzt3QkFDL0IsR0FBRyxjQUFjLFlBQVc7NEJBQ3hCOzRCQUNBLE1BQU07NEJBQ04sVUFBVTs0QkFDVixPQUFPLHFCQUFxQixTQUFTOzRCQUNyQyxPQUFPLE1BQU0sZUFBZSxLQUFLOzRCQUNqQyxPQUFPLE1BQU0sVUFBVSxNQUFNLEtBQUs7Ozs7Ozs7R0FEL0MiLCJmaWxlIjoicmVzZXQvU01TUmVzZXRDdHJsVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHJlc2V0TW9kdWxlIGZyb20gJ3Jlc2V0L1Jlc2V0TW9kdWxlJztcblxuLyoqXG4gKiBUZXN0cyBmb3IgdGhlIFNNU1Jlc2V0Q3RybC5cbiAqL1xuZGVzY3JpYmUoJ1NNU1Jlc2V0Q3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHJvb3RTY29wZSwgc2NvcGUsIGh0dHAsIGNoYW5nZVBhc3N3b3JkU2VydmljZSwgdW5sb2NrQWNjb3VudFNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShyZXNldE1vZHVsZSkpO1xuXG4gICAgLypcbiAgICAgKiBDcmVhdGVzIGEgY29udHJvbGxlciB3aXRoIGEgbW9jayBzY29wZSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgY3JlYXRlV2l0aFZhbGlkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS50ZXh0Q29kZSA9ICcxMjM0NTYnO1xuICAgICAgICBzY29wZS5wYXNzd29yZE1vZGVsLnBhc3N3b3JkID0gJ25pY2VQYXNzd29yZCc7XG4gICAgICAgIHNjb3BlLnBhc3N3b3JkTW9kZWwuY29uZmlybSA9ICduaWNlUGFzc3dvcmQnO1xuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlV2l0aEludmFsaWREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjb3BlLnRleHRDb2RlID0gJzEyMzQ1Nic7XG4gICAgICAgIHNjb3BlLnBhc3N3b3JkTW9kZWwucGFzc3dvcmQgPSAnbmljZVBhc3N3b3JkJztcbiAgICAgICAgc2NvcGUucGFzc3dvcmRNb2RlbC5jb25maXJtID0gJ05PVG5pY2VQYXNzd29yZCc7XG4gICAgfTtcblxuICAgIHZhciBnZXRVcmwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICcvdWkvcmVzdC91c2VyUmVzZXQvc2VuZFNNUyc7XG4gICAgfTtcblxuICAgIC8vIG5vdyBmb3IgdGhlIHRlc3RzXG4gICAgZGVzY3JpYmUoJ3Bhc3N3b3JkIHJlc2V0OicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cEJhY2tlbmQsICRjb250cm9sbGVyLCAkcSkge1xuICAgICAgICAgICAgcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICBodHRwID0gJGh0dHBCYWNrZW5kO1xuXG4gICAgICAgICAgICBjaGFuZ2VQYXNzd29yZFNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgd2l0aFNNUzogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7ZGF0YToge21lc3NhZ2U6IFsnUGFzc3dvcmQgUG9saWN5IHZpb2xhdGVkLiddfX0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJGNvbnRyb2xsZXIoJ1NNU1Jlc2V0Q3RybCcsIHtcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgIGNoYW5nZVBhc3N3b3JkU2VydmljZTogY2hhbmdlUGFzc3dvcmRTZXJ2aWNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGRlc2NyaWJlKCdvbiBpbml0aWFsaXphdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHRoZSBzdWJtaXQgYnV0dG9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmlzRGlzYWJsZVN1Ym1pdCgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIHZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIGVuYWJsZSB0aGUgc3VibWl0IGJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhWYWxpZERhdGEoKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuaXNEaXNhYmxlU3VibWl0KCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIGludmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSB0aGUgc3VibWl0IGJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhJbnZhbGlkRGF0YSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5pc0Rpc2FibGVTdWJtaXQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnY2FsbHMgc2VuZFNNUycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3dpdGggc3VjY2VzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChnZXRVcmwoKSkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgICAgICBzY29wZS5zZW5kU01TKCk7XG4gICAgICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNtc1N0YXR1cy5zaG93KS50b0JlKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5zbXNTdGF0dXMuaGFzRXJyb3IpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCd3aXRoIGVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybCgpKS5yZXNwb25kKDUwMyxcbiAgICAgICAgICAgICAgICAgICAge21lc3NhZ2U6IFsnU01TIFNlcnZpY2UgUHJvdmlkZXIgaXMgdW5hdmFpbGFibGUgYXQgdGhpcyB0aW1lJ119KTtcbiAgICAgICAgICAgICAgICBzY29wZS5zZW5kU01TKCk7XG4gICAgICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNtc1N0YXR1cy5zaG93KS50b0JlKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5zbXNTdGF0dXMuaGFzRXJyb3IpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNtc1N0YXR1cy50ZXh0KS50b0JlKCdTTVMgU2VydmljZSBQcm92aWRlciBpcyB1bmF2YWlsYWJsZSBhdCB0aGlzIHRpbWUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnY2FsbCBzdWJtaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCd3aXRoIGVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlV2l0aFZhbGlkRGF0YSgpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2hhbmdlUGFzc3dvcmRTZXJ2aWNlLndpdGhTTVMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuZXJyb3JNZXNzYWdlcykudG9CZSgnUGFzc3dvcmQgUG9saWN5IHZpb2xhdGVkLicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdTdWNjZXNzZnVsIHdpdGhTTVMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByb3V0aW5nU2VydmljZTtcbiAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwQmFja2VuZCwgJGNvbnRyb2xsZXIsICRxKSB7XG5cblxuICAgICAgICAgICAgICAgIHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgICAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgICAgICBodHRwID0gJGh0dHBCYWNrZW5kO1xuXG4gICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgICAgICB3aXRoU01TOiBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5jYWxsRmFrZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgbG9naW5Vc2VyOiBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5jYWxsRmFrZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcm91dGluZ1NlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0ZVN1Y2Nlc3M6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIoJ1NNU1Jlc2V0Q3RybCcsIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlOiBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgIHVubG9ja0FjY291bnRTZXJ2aWNlOiB1bmxvY2tBY2NvdW50U2VydmljZSxcbiAgICAgICAgICAgICAgICAgICAgcm91dGluZ1NlcnZpY2U6IHJvdXRpbmdTZXJ2aWNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXNjcmliZSgnVmFsaWQgRGF0YSwgU3VjY2VzcyBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsIFN1Y2Nlc3MgTG9naW4gVXNlcicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBzdWJtaXQgdG8gYmUgY2FsbGVkIHN1Y2Nlc3NmdWxseSBhbmQgY2FsbGxvZ2luVXNlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVXaXRoVmFsaWREYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgICAgICByb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VQYXNzd29yZFNlcnZpY2Uud2l0aFNNUykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2hhbmdlUGFzc3dvcmRTZXJ2aWNlLmxvZ2luVXNlcikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3Qocm91dGluZ1NlcnZpY2UubmF2aWdhdGVTdWNjZXNzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVzY3JpYmUoJ1Vuc3VjY2Vzc2Z1bCBMb2dpbiBVc2VyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHBCYWNrZW5kLCAkY29udHJvbGxlciwgJHEpIHtcblxuXG4gICAgICAgICAgICAgICAgICAgIHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAgPSAkaHR0cEJhY2tlbmQ7XG5cbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2l0aFNNUzogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5Vc2VyOiBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5jYWxsRmFrZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFsgJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQuJyBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkY29udHJvbGxlcignU01TUmVzZXRDdHJsJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhc3N3b3JkU2VydmljZTogY2hhbmdlUGFzc3dvcmRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5sb2NrQWNjb3VudFNlcnZpY2U6IHVubG9ja0FjY291bnRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGluZ1NlcnZpY2U6IHJvdXRpbmdTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgZGVzY3JpYmUoJ1ZhbGlkIERhdGEsIFN1Y2Nlc3MgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlLCBGYWlsIExvZ2luIFVzZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IHN1Ym1pdCB0byBiZSBjYWxsZWQgc3VjY2Vzc2Z1bGx5LCBjYWxsIGxvZ2luVXNlciwgc3RvcCBvbiBlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVXaXRoVmFsaWREYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VQYXNzd29yZFNlcnZpY2Uud2l0aFNNUykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS5sb2dpblVzZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChyb3V0aW5nU2VydmljZS5uYXZpZ2F0ZVN1Y2Nlc3MpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuZXJyb3JNZXNzYWdlcykudG9CZSgnSW52YWxpZCB1c2VybmFtZSBvciBwYXNzd29yZC4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2FjY291bnQgdW5sb2NrOicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvL0NyZWF0ZSBhIG1vY2sgUmVzZXREYXRhU2VydmljZSBzZXJ2aWNlIHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSBSb3V0aW5nU2VydmljZS5cbiAgICAgICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICAgICAgIC8vIFByb3ZpZGUgdGhlIG1vY2sgYXMgdGhlIFJlc2V0RGF0YVNlcnZpY2UsIHNvIHRoaXMgc2VydmljZSB3aWxsIHVzZSBpdC5cbiAgICAgICAgICAgICRwcm92aWRlLmZhY3RvcnkoJ3Jlc2V0RGF0YVNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzbXNTdGF0dXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdhY2NvdW50VW5sb2NrJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwQmFja2VuZCwgJGNvbnRyb2xsZXIsICRxKSB7XG5cbiAgICAgICAgICAgIHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgaHR0cCA9ICRodHRwQmFja2VuZDtcblxuICAgICAgICAgICAgdW5sb2NrQWNjb3VudFNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgd2l0aFNNUzogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7ZGF0YToge21lc3NhZ2U6IFsnUGFzc3dvcmQgUG9saWN5IHZpb2xhdGVkLiddfSwgc3RhdHVzOiA1MDB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJGNvbnRyb2xsZXIoJ1NNU1Jlc2V0Q3RybCcsIHtcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgIHVubG9ja0FjY291bnRTZXJ2aWNlOiB1bmxvY2tBY2NvdW50U2VydmljZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgICBkZXNjcmliZSgnY2FsbCBzdWJtaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCd3aXRoIGVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlV2l0aFZhbGlkRGF0YSgpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QodW5sb2NrQWNjb3VudFNlcnZpY2Uud2l0aFNNUykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5lcnJvck1lc3NhZ2VzKS50b0JlKCdQYXNzd29yZCBQb2xpY3kgdmlvbGF0ZWQuJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNtc1N0YXR1cy5zaG93KS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
