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
             * Tests for the SyncPasswordDialogCtrl.
             */
            describe('ChangePasswordDialogCtrl', function () {

                var quickLink = 'Manage%20Passwords';
                var $rootScope = undefined,
                    $controller = undefined,
                    $httpBackend = undefined,
                    testService = undefined,
                    managePasswordService = undefined,
                    ctrl = undefined,
                    $q = undefined,
                    $modalInstance = undefined,
                    promiseTrackerService = undefined,
                    link = undefined,
                    identityId = undefined,
                    IdentityRequestItem = undefined,
                    PasswordChangeResultItem = undefined,
                    managePasswordDataService = undefined;

                // Load the test module to get the testService and access request module.
                beforeEach(module(testModule, identityModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 12 */
                beforeEach(inject(function (_managePasswordService_, _managePasswordDataService_, _testService_, _$controller_, _$rootScope_, _$httpBackend_, _$q_, _promiseTrackerService_, PasswordLink, linkTestData, _IdentityRequestItem_, _PasswordChangeResultItem_) {

                    // Save the services.
                    managePasswordDataService = _managePasswordDataService_;
                    managePasswordService = _managePasswordService_;
                    $controller = _$controller_;
                    testService = _testService_;
                    $rootScope = _$rootScope_;
                    $httpBackend = _$httpBackend_;
                    $q = _$q_;
                    $modalInstance = {
                        close: jasmine.createSpy(),
                        dismiss: jasmine.createSpy(),
                        setTitle: jasmine.createSpy()
                    };
                    IdentityRequestItem = _IdentityRequestItem_;
                    promiseTrackerService = _promiseTrackerService_;
                    PasswordChangeResultItem = _PasswordChangeResultItem_;
                    link = new PasswordLink(linkTestData.LINK1);
                    identityId = link.getIdentityId();
                }));

                beforeEach(function () {
                    // Create the controller to test with.
                    ctrl = $controller('ChangePasswordDialogCtrl', {
                        managePasswordService: managePasswordService,
                        managePasswordDataService: managePasswordDataService,
                        $modalInstance: $modalInstance,
                        promiseTrackerService: promiseTrackerService,
                        identityId: identityId,
                        link: link,
                        IdentityRequestItem: IdentityRequestItem
                    });
                });

                describe('change password dialog ctrl isSubmitDisabled', function () {
                    it('submit button should be disabled', function () {
                        var submitDisabled = ctrl.isSubmitDisabled();
                        expect(submitDisabled).toBeTruthy();
                    });

                    it('submit button should be enabled', function () {
                        ctrl.newPassword = 'abcd';
                        ctrl.confirmPassword = 'abcd';
                        var submitDisabled = ctrl.isSubmitDisabled();
                        expect(submitDisabled).toBeFalsy();
                    });

                    it('submit button should be disabled when passwords dont match', function () {
                        ctrl.newPassword = 'abcd';
                        ctrl.confirmPassword = 'asbcd';
                        var submitDisabled = ctrl.isSubmitDisabled();
                        expect(submitDisabled).toBeTruthy();
                    });
                });

                describe('generatePassword', function () {
                    it('sets errors if generatePassword fails', function () {
                        var deferred = $q.defer();
                        spyOn(managePasswordService, 'generatePassword').and.returnValue(deferred.promise);
                        deferred.reject({ messages: ['you suck'] });

                        ctrl.generatePassword(identityId, link, quickLink);
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(1);
                    });

                    it('does not set errors if generatePassword fails', function () {

                        var deferred = $q.defer();
                        spyOn(managePasswordService, 'generatePassword').and.returnValue(deferred.promise);
                        deferred.resolve(new PasswordChangeResultItem({
                            passwordChanges: [{
                                linkId: '123'
                            }]
                        }));

                        ctrl.generatePassword(identityId, link, quickLink);
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(0);
                    });
                });

                describe('submit', function () {
                    it('sets errors if submit fails', function () {
                        var deferred = $q.defer();
                        spyOn(managePasswordService, 'changePassword').and.returnValue(deferred.promise);
                        deferred.reject({ messages: ['you suck'] });

                        ctrl.submit(identityId, link, quickLink);
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(1);
                    });

                    it('does not set errors if submit fails', function () {

                        var deferred = $q.defer();
                        spyOn(managePasswordService, 'changePassword').and.returnValue(deferred.promise);
                        deferred.resolve(new PasswordChangeResultItem({
                            passwordChanges: [{
                                linkId: '123'
                            }]
                        }));

                        ctrl.submit(identityId, link, quickLink);
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(0);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0NoYW5nZVBhc3N3b3JkRGlhbG9nVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixzQkFBc0IsbUJBQW1CLFVBQVUsU0FBUzs7O0lBRy9IOztJQUVBLElBQUksZ0JBQWdCO0lBQ3BCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCO1dBQ2hDLFVBQVUsZUFBZTtRQUM1QixTQUFTLFlBQVk7Ozs7O1lBRjdCLFNBQVMsNEJBQTRCLFlBQVc7O2dCQUU1QyxJQUFNLFlBQVk7Z0JBQ2xCLElBQUksYUFBVTtvQkFBRSxjQUFXO29CQUFFLGVBQVk7b0JBQUUsY0FBVztvQkFBRSx3QkFBcUI7b0JBQUUsT0FBSTtvQkFBRSxLQUFFO29CQUNuRixpQkFBYztvQkFBRSx3QkFBcUI7b0JBQUUsT0FBSTtvQkFBRSxhQUFVO29CQUFFLHNCQUFtQjtvQkFBRSwyQkFBd0I7b0JBQ3RHLDRCQUF5Qjs7O2dCQUc3QixXQUFXLE9BQU8sWUFBWTs7Ozs7O2dCQU05QixXQUFXLE9BQU8sVUFBUyx5QkFBeUIsNkJBQTZCLGVBQWUsZUFDckUsY0FBYyxnQkFBZ0IsTUFBTSx5QkFDcEMsY0FBYyxjQUFjLHVCQUF1Qiw0QkFBNEI7OztvQkFHdEcsNEJBQTRCO29CQUM1Qix3QkFBd0I7b0JBQ3hCLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxhQUFhO29CQUNiLGVBQWU7b0JBQ2YsS0FBSztvQkFDTCxpQkFBaUI7d0JBQ2IsT0FBTyxRQUFRO3dCQUNmLFNBQVMsUUFBUTt3QkFDakIsVUFBVSxRQUFROztvQkFFdEIsc0JBQXNCO29CQUN0Qix3QkFBd0I7b0JBQ3hCLDJCQUEyQjtvQkFDM0IsT0FBTyxJQUFJLGFBQWEsYUFBYTtvQkFDckMsYUFBYSxLQUFLOzs7Z0JBR3RCLFdBQVksWUFBVzs7b0JBRW5CLE9BQU8sWUFBWSw0QkFBNEI7d0JBQzNDLHVCQUF1Qjt3QkFDdkIsMkJBQTJCO3dCQUMzQixnQkFBZ0I7d0JBQ2hCLHVCQUF1Qjt3QkFDdkIsWUFBWTt3QkFDWixNQUFNO3dCQUNOLHFCQUFxQjs7OztnQkFJN0IsU0FBUyxnREFBZ0QsWUFBVztvQkFDaEUsR0FBRyxvQ0FBb0MsWUFBVzt3QkFDOUMsSUFBSSxpQkFBaUIsS0FBSzt3QkFDMUIsT0FBTyxnQkFBZ0I7OztvQkFHM0IsR0FBRyxtQ0FBbUMsWUFBVzt3QkFDN0MsS0FBSyxjQUFjO3dCQUNuQixLQUFLLGtCQUFrQjt3QkFDdkIsSUFBSSxpQkFBaUIsS0FBSzt3QkFDMUIsT0FBTyxnQkFBZ0I7OztvQkFHM0IsR0FBRyw4REFBOEQsWUFBVzt3QkFDeEUsS0FBSyxjQUFjO3dCQUNuQixLQUFLLGtCQUFrQjt3QkFDdkIsSUFBSSxpQkFBaUIsS0FBSzt3QkFDMUIsT0FBTyxnQkFBZ0I7Ozs7Z0JBSS9CLFNBQVMsb0JBQW9CLFlBQVc7b0JBQ3BDLEdBQUcseUNBQXlDLFlBQVc7d0JBQ25ELElBQUksV0FBVyxHQUFHO3dCQUNsQixNQUFNLHVCQUF1QixvQkFBb0IsSUFBSSxZQUFZLFNBQVM7d0JBQzFFLFNBQVMsT0FBTyxFQUFDLFVBQVUsQ0FBQzs7d0JBRTVCLEtBQUssaUJBQWlCLFlBQVksTUFBTTt3QkFDeEMsV0FBVzt3QkFDWCxPQUFPLEtBQUssWUFBWSxRQUFRLFFBQVE7OztvQkFHNUMsR0FBRyxpREFBaUQsWUFBVzs7d0JBRTNELElBQUksV0FBVyxHQUFHO3dCQUNsQixNQUFNLHVCQUF1QixvQkFBb0IsSUFBSSxZQUFZLFNBQVM7d0JBQzFFLFNBQVMsUUFBUSxJQUFJLHlCQUF5Qjs0QkFDMUMsaUJBQWlCLENBQUM7Z0NBQ2QsUUFBUTs7Ozt3QkFJaEIsS0FBSyxpQkFBaUIsWUFBWSxNQUFNO3dCQUN4QyxXQUFXO3dCQUNYLE9BQU8sS0FBSyxZQUFZLFFBQVEsUUFBUTs7OztnQkFJaEQsU0FBUyxVQUFVLFlBQVc7b0JBQzFCLEdBQUcsK0JBQStCLFlBQVc7d0JBQ3pDLElBQUksV0FBVyxHQUFHO3dCQUNsQixNQUFNLHVCQUF1QixrQkFBa0IsSUFBSSxZQUFZLFNBQVM7d0JBQ3hFLFNBQVMsT0FBTyxFQUFDLFVBQVUsQ0FBQzs7d0JBRTVCLEtBQUssT0FBTyxZQUFZLE1BQU07d0JBQzlCLFdBQVc7d0JBQ1gsT0FBTyxLQUFLLFlBQVksUUFBUSxRQUFROzs7b0JBRzVDLEdBQUcsdUNBQXVDLFlBQVc7O3dCQUVqRCxJQUFJLFdBQVcsR0FBRzt3QkFDbEIsTUFBTSx1QkFBdUIsa0JBQWtCLElBQUksWUFBWSxTQUFTO3dCQUN4RSxTQUFTLFFBQVEsSUFBSSx5QkFBeUI7NEJBQzFDLGlCQUFpQixDQUFDO2dDQUNkLFFBQVE7Ozs7d0JBSWhCLEtBQUssT0FBTyxZQUFZLE1BQU07d0JBQzlCLFdBQVc7d0JBQ1gsT0FBTyxLQUFLLFlBQVksUUFBUSxRQUFROzs7Ozs7R0FzQmpEIiwiZmlsZSI6ImlkZW50aXR5L0NoYW5nZVBhc3N3b3JkRGlhbG9nVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcbmltcG9ydCAnLi9MaW5rVGVzdERhdGEnO1xuXG4vKipcbiAqIFRlc3RzIGZvciB0aGUgU3luY1Bhc3N3b3JkRGlhbG9nQ3RybC5cbiAqL1xuZGVzY3JpYmUoJ0NoYW5nZVBhc3N3b3JkRGlhbG9nQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgcXVpY2tMaW5rID0gJ01hbmFnZSUyMFBhc3N3b3Jkcyc7XG4gICAgbGV0ICRyb290U2NvcGUsICRjb250cm9sbGVyLCAkaHR0cEJhY2tlbmQsIHRlc3RTZXJ2aWNlLCBtYW5hZ2VQYXNzd29yZFNlcnZpY2UsIGN0cmwsICRxLFxuICAgICAgICAkbW9kYWxJbnN0YW5jZSwgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlLCBsaW5rLCBpZGVudGl0eUlkLCBJZGVudGl0eVJlcXVlc3RJdGVtLCBQYXNzd29yZENoYW5nZVJlc3VsdEl0ZW0sXG4gICAgICAgIG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2U7XG5cbiAgICAvLyBMb2FkIHRoZSB0ZXN0IG1vZHVsZSB0byBnZXQgdGhlIHRlc3RTZXJ2aWNlIGFuZCBhY2Nlc3MgcmVxdWVzdCBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUodGVzdE1vZHVsZSwgaWRlbnRpdHlNb2R1bGUpKTtcblxuICAgIC8qKlxuICAgICAqIEluamVjdCB0aGUgZGVwZW5kZW5jaWVzIGFuZCBzZXR1cCBtb2Nrcy5cbiAgICAgKi9cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAxMiAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9tYW5hZ2VQYXNzd29yZFNlcnZpY2VfLCBfbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZV8sIF90ZXN0U2VydmljZV8sIF8kY29udHJvbGxlcl8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXyRyb290U2NvcGVfLCBfJGh0dHBCYWNrZW5kXywgXyRxXywgX3Byb21pc2VUcmFja2VyU2VydmljZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFzc3dvcmRMaW5rLCBsaW5rVGVzdERhdGEsIF9JZGVudGl0eVJlcXVlc3RJdGVtXywgX1Bhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbV8pIHtcblxuICAgICAgICAvLyBTYXZlIHRoZSBzZXJ2aWNlcy5cbiAgICAgICAgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZSA9IF9tYW5hZ2VQYXNzd29yZERhdGFTZXJ2aWNlXztcbiAgICAgICAgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlID0gX21hbmFnZVBhc3N3b3JkU2VydmljZV87XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAkaHR0cEJhY2tlbmQgPSBfJGh0dHBCYWNrZW5kXztcbiAgICAgICAgJHEgPSBfJHFfO1xuICAgICAgICAkbW9kYWxJbnN0YW5jZSA9IHtcbiAgICAgICAgICAgIGNsb3NlOiBqYXNtaW5lLmNyZWF0ZVNweSgpLFxuICAgICAgICAgICAgZGlzbWlzczogamFzbWluZS5jcmVhdGVTcHkoKSxcbiAgICAgICAgICAgIHNldFRpdGxlOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIH07XG4gICAgICAgIElkZW50aXR5UmVxdWVzdEl0ZW0gPSBfSWRlbnRpdHlSZXF1ZXN0SXRlbV87XG4gICAgICAgIHByb21pc2VUcmFja2VyU2VydmljZSA9IF9wcm9taXNlVHJhY2tlclNlcnZpY2VfO1xuICAgICAgICBQYXNzd29yZENoYW5nZVJlc3VsdEl0ZW0gPSBfUGFzc3dvcmRDaGFuZ2VSZXN1bHRJdGVtXztcbiAgICAgICAgbGluayA9IG5ldyBQYXNzd29yZExpbmsobGlua1Rlc3REYXRhLkxJTksxKTtcbiAgICAgICAgaWRlbnRpdHlJZCA9IGxpbmsuZ2V0SWRlbnRpdHlJZCgpO1xuICAgIH0pKTtcblxuICAgIGJlZm9yZUVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0NoYW5nZVBhc3N3b3JkRGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgIG1hbmFnZVBhc3N3b3JkU2VydmljZTogbWFuYWdlUGFzc3dvcmRTZXJ2aWNlLFxuICAgICAgICAgICAgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZTogbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZSxcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZSxcbiAgICAgICAgICAgIHByb21pc2VUcmFja2VyU2VydmljZTogcHJvbWlzZVRyYWNrZXJTZXJ2aWNlLFxuICAgICAgICAgICAgaWRlbnRpdHlJZDogaWRlbnRpdHlJZCxcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICBJZGVudGl0eVJlcXVlc3RJdGVtOiBJZGVudGl0eVJlcXVlc3RJdGVtXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NoYW5nZSBwYXNzd29yZCBkaWFsb2cgY3RybCBpc1N1Ym1pdERpc2FibGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzdWJtaXQgYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHN1Ym1pdERpc2FibGVkID0gY3RybC5pc1N1Ym1pdERpc2FibGVkKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0RGlzYWJsZWQpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3N1Ym1pdCBidXR0b24gc2hvdWxkIGJlIGVuYWJsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0cmwubmV3UGFzc3dvcmQgPSAnYWJjZCc7XG4gICAgICAgICAgICBjdHJsLmNvbmZpcm1QYXNzd29yZCA9ICdhYmNkJztcbiAgICAgICAgICAgIGxldCBzdWJtaXREaXNhYmxlZCA9IGN0cmwuaXNTdWJtaXREaXNhYmxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHN1Ym1pdERpc2FibGVkKS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3N1Ym1pdCBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkIHdoZW4gcGFzc3dvcmRzIGRvbnQgbWF0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0cmwubmV3UGFzc3dvcmQgPSAnYWJjZCc7XG4gICAgICAgICAgICBjdHJsLmNvbmZpcm1QYXNzd29yZCA9ICdhc2JjZCc7XG4gICAgICAgICAgICBsZXQgc3VibWl0RGlzYWJsZWQgPSBjdHJsLmlzU3VibWl0RGlzYWJsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChzdWJtaXREaXNhYmxlZCkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZW5lcmF0ZVBhc3N3b3JkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzZXRzIGVycm9ycyBpZiBnZW5lcmF0ZVBhc3N3b3JkIGZhaWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnZ2VuZXJhdGVQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZShkZWZlcnJlZC5wcm9taXNlKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7bWVzc2FnZXM6IFsneW91IHN1Y2snXX0pO1xuXG4gICAgICAgICAgICBjdHJsLmdlbmVyYXRlUGFzc3dvcmQoaWRlbnRpdHlJZCwgbGluaywgcXVpY2tMaW5rKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRFcnJvcnMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdCBzZXQgZXJyb3JzIGlmIGdlbmVyYXRlUGFzc3dvcmQgZmFpbHMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbGV0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZVBhc3N3b3JkU2VydmljZSwgJ2dlbmVyYXRlUGFzc3dvcmQnKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG5ldyBQYXNzd29yZENoYW5nZVJlc3VsdEl0ZW0oe1xuICAgICAgICAgICAgICAgIHBhc3N3b3JkQ2hhbmdlczogW3tcbiAgICAgICAgICAgICAgICAgICAgbGlua0lkOiAnMTIzJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGN0cmwuZ2VuZXJhdGVQYXNzd29yZChpZGVudGl0eUlkLCBsaW5rLCBxdWlja0xpbmspO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEVycm9ycygpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc3VibWl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzZXRzIGVycm9ycyBpZiBzdWJtaXQgZmFpbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdjaGFuZ2VQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZShkZWZlcnJlZC5wcm9taXNlKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7bWVzc2FnZXM6IFsneW91IHN1Y2snXX0pO1xuXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdChpZGVudGl0eUlkLCBsaW5rLCBxdWlja0xpbmspO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEVycm9ycygpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHNldCBlcnJvcnMgaWYgc3VibWl0IGZhaWxzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdjaGFuZ2VQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZShkZWZlcnJlZC5wcm9taXNlKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobmV3IFBhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbSh7XG4gICAgICAgICAgICAgICAgcGFzc3dvcmRDaGFuZ2VzOiBbe1xuICAgICAgICAgICAgICAgICAgICBsaW5rSWQ6ICcxMjMnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY3RybC5zdWJtaXQoaWRlbnRpdHlJZCwgbGluaywgcXVpY2tMaW5rKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRFcnJvcnMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
