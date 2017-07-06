System.register(['test/js/TestInitializer', 'identity/IdentityModule', 'test/js/TestModule', './LinkTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var identityModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_LinkTestData) {}],
        execute: function () {

            /**
             * Tests for the CreateAccountDialogCtrl.
             */
            describe('CreateAccountDialogCtrl', function () {

                var $modalInstance = undefined,
                    $controller = undefined,
                    testService = undefined,
                    manageAccountService = undefined,
                    manageAccountDataService = undefined,
                    identity = undefined,
                    suggestParam = undefined,
                    identityService = undefined,
                    $rootScope = undefined;

                // Load the test module to get the testService and access request module.
                beforeEach(module(testModule, identityModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 7 */
                beforeEach(inject(function (_manageAccountService_, _manageAccountDataService_, _identityService_, Identity, _testService_, _$controller_, _$rootScope_) {

                    // Save the services.
                    manageAccountService = _manageAccountService_;
                    manageAccountDataService = _manageAccountDataService_;
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;
                    testService = _testService_;
                    $modalInstance = {
                        close: jasmine.createSpy(),
                        dismiss: jasmine.createSpy()
                    };
                    identityService = _identityService_;
                    // Create an identity to test with.
                    identity = new Identity({ id: 'test1', displayableName: 'Test User1' });
                    suggestParam = { lcmApplication: true };

                    // Mock out the services
                    identityService.getIdentity = testService.createPromiseSpy(false, identity, {});
                    manageAccountService.getCreateAccountConfig = testService.createPromiseSpy(false, {
                        status: 200,
                        data: suggestParam
                    }, {});
                }));

                function createController() {
                    var ctrl = $controller('CreateAccountDialogCtrl', {
                        identityId: identity.getId(),
                        identityService: identityService,
                        manageAccountDataService: manageAccountDataService,
                        manageAccountService: manageAccountService,
                        createAccountConfig: {
                            accountOnlyAppsAvailable: true,
                            allowAccountOnlyRequests: true
                        },
                        $modalInstance: $modalInstance
                    });
                    // Run a digest cycle to resolve the promise.
                    $rootScope.$apply();
                    return ctrl;
                }

                describe('load create account dialog ctrl', function () {
                    it('fetches application suggest parameters when loaded', function () {
                        // Create the controller to test with.
                        var ctrl = createController();

                        manageAccountDataService.addCreateAccountAction = testService.createPromiseSpy(false, {}, {});
                        ctrl.submit();
                        expect(manageAccountDataService.addCreateAccountAction).toHaveBeenCalled();
                    });

                    it('disable submit when application is not defined', function () {
                        // Create the controller to test with.
                        var ctrl = createController();

                        var disable = ctrl.disableSubmit();
                        expect(disable).toBeTruthy();
                    });

                    it('enable submit when application is defined', function () {
                        // Create the controller to test with.
                        var ctrl = createController();

                        ctrl.application = 'Test App';
                        var disable = ctrl.disableSubmit();
                        expect(disable).toBeFalsy();
                    });
                });

                describe('suggestParams', function () {
                    it('should have already requested applications', function () {
                        var mockAppId = 'bogusAppId',
                            ctrl = undefined,
                            params = undefined;
                        manageAccountDataService.addCreateAccountAction('fakeIdentityId', { id: mockAppId, name: 'bogusAppName' });
                        ctrl = createController();
                        params = ctrl.getSuggestParams();
                        expect(params.requestedApplications.length).toBe(1);
                        expect(params.requestedApplications[0]).toBe(mockAppId);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0NyZWF0ZUFjY291bnREaWFsb2dDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixzQkFBc0IsbUJBQW1CLFVBQVUsU0FBUzs7O0lBRy9IOztJQUVBLElBQUksZ0JBQWdCO0lBQ3BCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCO1dBQ2hDLFVBQVUsZUFBZTtRQUM1QixTQUFTLFlBQVk7Ozs7O1lBRjdCLFNBQVMsMkJBQTJCLFlBQVc7O2dCQUUzQyxJQUFJLGlCQUFjO29CQUFFLGNBQVc7b0JBQUUsY0FBVztvQkFBRSx1QkFBb0I7b0JBQUUsMkJBQXdCO29CQUN4RixXQUFRO29CQUFFLGVBQVk7b0JBQUUsa0JBQWU7b0JBQUUsYUFBVTs7O2dCQUd2RCxXQUFXLE9BQU8sWUFBWTs7Ozs7O2dCQU05QixXQUFXLE9BQU8sVUFBUyx3QkFBd0IsNEJBQzNDLG1CQUFtQixVQUFVLGVBQWUsZUFBZSxjQUFjOzs7b0JBRzdFLHVCQUF1QjtvQkFDdkIsMkJBQTJCO29CQUMzQixjQUFjO29CQUNkLGFBQWE7b0JBQ2IsY0FBYztvQkFDZCxpQkFBaUI7d0JBQ1QsT0FBTyxRQUFRO3dCQUNmLFNBQVMsUUFBUTs7b0JBRXpCLGtCQUFrQjs7b0JBRWxCLFdBQVcsSUFBSSxTQUFTLEVBQUMsSUFBSSxTQUFTLGlCQUFpQjtvQkFDdkQsZUFBZSxFQUFFLGdCQUFnQjs7O29CQUdqQyxnQkFBZ0IsY0FBYyxZQUFZLGlCQUFpQixPQUFPLFVBQVU7b0JBQzVFLHFCQUFxQix5QkFDakIsWUFBWSxpQkFBaUIsT0FBTzt3QkFDaEMsUUFBUTt3QkFDUixNQUFNO3VCQUNQOzs7Z0JBR1gsU0FBUyxtQkFBbUI7b0JBQ3hCLElBQUksT0FBTyxZQUFZLDJCQUEyQjt3QkFDOUMsWUFBWSxTQUFTO3dCQUNyQixpQkFBaUI7d0JBQ2pCLDBCQUEwQjt3QkFDMUIsc0JBQXNCO3dCQUN0QixxQkFBcUI7NEJBQ2pCLDBCQUEwQjs0QkFDMUIsMEJBQTBCOzt3QkFFOUIsZ0JBQWdCOzs7b0JBR3BCLFdBQVc7b0JBQ1gsT0FBTzs7O2dCQUdYLFNBQVMsbUNBQW1DLFlBQVc7b0JBQ25ELEdBQUcsc0RBQXNELFlBQVc7O3dCQUVoRSxJQUFJLE9BQU87O3dCQUVYLHlCQUF5Qix5QkFBeUIsWUFBWSxpQkFBaUIsT0FBTyxJQUFJO3dCQUMxRixLQUFLO3dCQUNMLE9BQU8seUJBQXlCLHdCQUF3Qjs7O29CQUc1RCxHQUFHLGtEQUFrRCxZQUFXOzt3QkFFNUQsSUFBSSxPQUFPOzt3QkFFWCxJQUFJLFVBQVUsS0FBSzt3QkFDbkIsT0FBTyxTQUFTOzs7b0JBR3BCLEdBQUcsNkNBQTZDLFlBQVc7O3dCQUV2RCxJQUFJLE9BQU87O3dCQUVYLEtBQUssY0FBYzt3QkFDbkIsSUFBSSxVQUFVLEtBQUs7d0JBQ25CLE9BQU8sU0FBUzs7OztnQkFJeEIsU0FBUyxpQkFBaUIsWUFBVztvQkFDakMsR0FBRyw4Q0FBOEMsWUFBVzt3QkFDeEQsSUFBSSxZQUFZOzRCQUNaLE9BQUk7NEJBQUUsU0FBTTt3QkFDaEIseUJBQXlCLHVCQUF1QixrQkFBa0IsRUFBQyxJQUFJLFdBQVcsTUFBTTt3QkFDeEYsT0FBTzt3QkFDUCxTQUFTLEtBQUs7d0JBQ2QsT0FBTyxPQUFPLHNCQUFzQixRQUFRLEtBQUs7d0JBQ2pELE9BQU8sT0FBTyxzQkFBc0IsSUFBSSxLQUFLOzs7Ozs7R0FtQnREIiwiZmlsZSI6ImlkZW50aXR5L0NyZWF0ZUFjY291bnREaWFsb2dDdHJsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcbmltcG9ydCAnLi9MaW5rVGVzdERhdGEnO1xuXG4vKipcbiAqIFRlc3RzIGZvciB0aGUgQ3JlYXRlQWNjb3VudERpYWxvZ0N0cmwuXG4gKi9cbmRlc2NyaWJlKCdDcmVhdGVBY2NvdW50RGlhbG9nQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0ICRtb2RhbEluc3RhbmNlLCAkY29udHJvbGxlciwgdGVzdFNlcnZpY2UsIG1hbmFnZUFjY291bnRTZXJ2aWNlLCBtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2UsXG4gICAgICAgIGlkZW50aXR5LCBzdWdnZXN0UGFyYW0sIGlkZW50aXR5U2VydmljZSwgJHJvb3RTY29wZTtcblxuICAgIC8vIExvYWQgdGhlIHRlc3QgbW9kdWxlIHRvIGdldCB0aGUgdGVzdFNlcnZpY2UgYW5kIGFjY2VzcyByZXF1ZXN0IG1vZHVsZS5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlLCBpZGVudGl0eU1vZHVsZSkpO1xuXG4gICAgLyoqXG4gICAgICogSW5qZWN0IHRoZSBkZXBlbmRlbmNpZXMgYW5kIHNldHVwIG1vY2tzLlxuICAgICAqL1xuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDcgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfbWFuYWdlQWNjb3VudFNlcnZpY2VfLCBfbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlXyxcbiAgICAgICAgICAgIF9pZGVudGl0eVNlcnZpY2VfLCBJZGVudGl0eSwgX3Rlc3RTZXJ2aWNlXywgXyRjb250cm9sbGVyXywgXyRyb290U2NvcGVfKSB7XG5cbiAgICAgICAgLy8gU2F2ZSB0aGUgc2VydmljZXMuXG4gICAgICAgIG1hbmFnZUFjY291bnRTZXJ2aWNlID0gX21hbmFnZUFjY291bnRTZXJ2aWNlXztcbiAgICAgICAgbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlID0gX21hbmFnZUFjY291bnREYXRhU2VydmljZV87XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuICAgICAgICAkbW9kYWxJbnN0YW5jZSA9IHtcbiAgICAgICAgICAgICAgICBjbG9zZTogamFzbWluZS5jcmVhdGVTcHkoKSxcbiAgICAgICAgICAgICAgICBkaXNtaXNzOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgICAgICB9O1xuICAgICAgICBpZGVudGl0eVNlcnZpY2UgPSBfaWRlbnRpdHlTZXJ2aWNlXztcbiAgICAgICAgLy8gQ3JlYXRlIGFuIGlkZW50aXR5IHRvIHRlc3Qgd2l0aC5cbiAgICAgICAgaWRlbnRpdHkgPSBuZXcgSWRlbnRpdHkoe2lkOiAndGVzdDEnLCBkaXNwbGF5YWJsZU5hbWU6ICdUZXN0IFVzZXIxJ30pO1xuICAgICAgICBzdWdnZXN0UGFyYW0gPSB7IGxjbUFwcGxpY2F0aW9uOiB0cnVlIH07XG5cbiAgICAgICAgLy8gTW9jayBvdXQgdGhlIHNlcnZpY2VzXG4gICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0eSA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIGlkZW50aXR5LCB7fSk7XG4gICAgICAgIG1hbmFnZUFjY291bnRTZXJ2aWNlLmdldENyZWF0ZUFjY291bnRDb25maWcgPVxuICAgICAgICAgICAgdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZVNweShmYWxzZSwge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHN1Z2dlc3RQYXJhbVxuICAgICAgICAgICAgfSwge30pO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoKSB7XG4gICAgICAgIGxldCBjdHJsID0gJGNvbnRyb2xsZXIoJ0NyZWF0ZUFjY291bnREaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgaWRlbnRpdHlJZDogaWRlbnRpdHkuZ2V0SWQoKSxcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZTogaWRlbnRpdHlTZXJ2aWNlLFxuICAgICAgICAgICAgbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlOiBtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2UsXG4gICAgICAgICAgICBtYW5hZ2VBY2NvdW50U2VydmljZTogbWFuYWdlQWNjb3VudFNlcnZpY2UsXG4gICAgICAgICAgICBjcmVhdGVBY2NvdW50Q29uZmlnOiB7XG4gICAgICAgICAgICAgICAgYWNjb3VudE9ubHlBcHBzQXZhaWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFsbG93QWNjb3VudE9ubHlSZXF1ZXN0czogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gUnVuIGEgZGlnZXN0IGN5Y2xlIHRvIHJlc29sdmUgdGhlIHByb21pc2UuXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgIH1cblxuICAgIGRlc2NyaWJlKCdsb2FkIGNyZWF0ZSBhY2NvdW50IGRpYWxvZyBjdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdmZXRjaGVzIGFwcGxpY2F0aW9uIHN1Z2dlc3QgcGFyYW1ldGVycyB3aGVuIGxvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb250cm9sbGVyIHRvIHRlc3Qgd2l0aC5cbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuXG4gICAgICAgICAgICBtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2UuYWRkQ3JlYXRlQWNjb3VudEFjdGlvbiA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHt9LCB7fSk7XG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZUFjY291bnREYXRhU2VydmljZS5hZGRDcmVhdGVBY2NvdW50QWN0aW9uKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNhYmxlIHN1Ym1pdCB3aGVuIGFwcGxpY2F0aW9uIGlzIG5vdCBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XG5cbiAgICAgICAgICAgIGxldCBkaXNhYmxlID0gY3RybC5kaXNhYmxlU3VibWl0KCk7XG4gICAgICAgICAgICBleHBlY3QoZGlzYWJsZSkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZW5hYmxlIHN1Ym1pdCB3aGVuIGFwcGxpY2F0aW9uIGlzIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29udHJvbGxlciB0byB0ZXN0IHdpdGguXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcblxuICAgICAgICAgICAgY3RybC5hcHBsaWNhdGlvbiA9ICdUZXN0IEFwcCc7XG4gICAgICAgICAgICBsZXQgZGlzYWJsZSA9IGN0cmwuZGlzYWJsZVN1Ym1pdCgpO1xuICAgICAgICAgICAgZXhwZWN0KGRpc2FibGUpLnRvQmVGYWxzeSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzdWdnZXN0UGFyYW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBhbHJlYWR5IHJlcXVlc3RlZCBhcHBsaWNhdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBtb2NrQXBwSWQgPSAnYm9ndXNBcHBJZCcsXG4gICAgICAgICAgICAgICAgY3RybCwgcGFyYW1zO1xuICAgICAgICAgICAgbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLmFkZENyZWF0ZUFjY291bnRBY3Rpb24oJ2Zha2VJZGVudGl0eUlkJywge2lkOiBtb2NrQXBwSWQsIG5hbWU6ICdib2d1c0FwcE5hbWUnfSk7XG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICAgICAgcGFyYW1zID0gY3RybC5nZXRTdWdnZXN0UGFyYW1zKCk7XG4gICAgICAgICAgICBleHBlY3QocGFyYW1zLnJlcXVlc3RlZEFwcGxpY2F0aW9ucy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QocGFyYW1zLnJlcXVlc3RlZEFwcGxpY2F0aW9uc1swXSkudG9CZShtb2NrQXBwSWQpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
