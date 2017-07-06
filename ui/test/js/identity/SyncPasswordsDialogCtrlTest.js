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
            describe('SyncPasswordDialogCtrl', function () {

                var $rootScope = undefined,
                    $controller = undefined,
                    $httpBackend = undefined,
                    testService = undefined,
                    managePasswordService = undefined,
                    ctrl = undefined,
                    $q = undefined,
                    $modalInstance = undefined,
                    promiseTrackerService = undefined,
                    currentPasswordLinks = undefined,
                    CurrentPasswordStepHandler = undefined,
                    NewPasswordStepHandler = undefined,
                    link = undefined,
                    identityId = undefined;
                // Load the test module to get the testService and access request module.
                beforeEach(module(testModule, identityModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 11 */
                beforeEach(inject(function (_managePasswordService_, _testService_, _$controller_, _$rootScope_, _$httpBackend_, _$q_, _promiseTrackerService_, _CurrentPasswordStepHandler_, _NewPasswordStepHandler_, Link, linkTestData) {

                    // Save the services.
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
                    promiseTrackerService = _promiseTrackerService_;
                    link = new Link(linkTestData.LINK1);
                    identityId = link.getIdentityId();
                    currentPasswordLinks = [link];
                    CurrentPasswordStepHandler = _CurrentPasswordStepHandler_;
                    NewPasswordStepHandler = _NewPasswordStepHandler_;
                }));

                describe('sychronize password ctrl', function () {
                    beforeEach(function () {
                        // Create the controller to test with.
                        ctrl = $controller('SyncPasswordDialogCtrl', {
                            managePasswordService: managePasswordService,
                            $q: $q,
                            $modalInstance: $modalInstance,
                            promiseTrackerService: promiseTrackerService,
                            selectionModel: {},
                            identityId: identityId,
                            policies: [],
                            currentPasswordLinks: currentPasswordLinks,
                            CurrentPasswordStepHandler: CurrentPasswordStepHandler,
                            NewPasswordStepHandler: NewPasswordStepHandler
                        });
                    });

                    it('creates handlers for current password input and new password input', function () {
                        var handlers = ctrl.createStepHandlers();
                        expect(handlers.length).toEqual(2);
                        expect(handlers[0].getStepId()).toEqual('currentPasswordInput');
                        expect(handlers[1].getStepId()).toEqual('newPasswordInput');
                    });

                    it('creates handler for new password input only when no current password is needed', function () {
                        ctrl.currentPasswordLinks = [];
                        var handlers = ctrl.createStepHandlers();
                        expect(handlers.length).toEqual(1);
                        expect(handlers[0].getStepId()).toEqual('newPasswordInput');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L1N5bmNQYXNzd29yZHNEaWFsb2dDdHJsVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHNCQUFzQixtQkFBbUIsVUFBVSxTQUFTOzs7SUFHL0g7O0lBRUEsSUFBSSxnQkFBZ0I7SUFDcEIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGlCQUFpQix3QkFBd0I7V0FDMUMsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7V0FDaEMsVUFBVSxlQUFlO1FBQzVCLFNBQVMsWUFBWTs7Ozs7WUFGN0IsU0FBUywwQkFBMEIsWUFBVzs7Z0JBRTFDLElBQUksYUFBVTtvQkFBRSxjQUFXO29CQUFFLGVBQVk7b0JBQUUsY0FBVztvQkFBRSx3QkFBcUI7b0JBQUUsT0FBSTtvQkFBRSxLQUFFO29CQUNuRixpQkFBYztvQkFBRSx3QkFBcUI7b0JBQUUsdUJBQW9CO29CQUFFLDZCQUEwQjtvQkFDdkYseUJBQXNCO29CQUFFLE9BQUk7b0JBQUUsYUFBVTs7Z0JBRTVDLFdBQVcsT0FBTyxZQUFZOzs7Ozs7Z0JBTTlCLFdBQVcsT0FBTyxVQUFTLHlCQUF5QixlQUFlLGVBQzNELGNBQWMsZ0JBQWdCLE1BQU0seUJBQXlCLDhCQUM3RCwwQkFBMEIsTUFBTSxjQUFjOzs7b0JBR2xELHdCQUF3QjtvQkFDeEIsY0FBYztvQkFDZCxjQUFjO29CQUNkLGFBQWE7b0JBQ2IsZUFBZTtvQkFDZixLQUFLO29CQUNMLGlCQUFpQjt3QkFDYixPQUFPLFFBQVE7d0JBQ2YsU0FBUyxRQUFRO3dCQUNqQixVQUFVLFFBQVE7O29CQUV0Qix3QkFBd0I7b0JBQ3hCLE9BQU8sSUFBSSxLQUFLLGFBQWE7b0JBQzdCLGFBQWEsS0FBSztvQkFDbEIsdUJBQXVCLENBQUM7b0JBQ3hCLDZCQUE2QjtvQkFDN0IseUJBQXlCOzs7Z0JBRzdCLFNBQVMsNEJBQTRCLFlBQVc7b0JBQzVDLFdBQVksWUFBVzs7d0JBRW5CLE9BQU8sWUFBWSwwQkFBMEI7NEJBQ3pDLHVCQUF1Qjs0QkFDdkIsSUFBSTs0QkFDSixnQkFBZ0I7NEJBQ2hCLHVCQUF1Qjs0QkFDdkIsZ0JBQWdCOzRCQUNoQixZQUFZOzRCQUNaLFVBQVU7NEJBQ1Ysc0JBQXNCOzRCQUN0Qiw0QkFBNEI7NEJBQzVCLHdCQUF3Qjs7OztvQkFJaEMsR0FBRyxzRUFBc0UsWUFBVzt3QkFDaEYsSUFBSSxXQUFXLEtBQUs7d0JBQ3BCLE9BQU8sU0FBUyxRQUFRLFFBQVE7d0JBQ2hDLE9BQU8sU0FBUyxHQUFHLGFBQWEsUUFBUTt3QkFDeEMsT0FBTyxTQUFTLEdBQUcsYUFBYSxRQUFROzs7b0JBRzVDLEdBQUcsa0ZBQWtGLFlBQVc7d0JBQzVGLEtBQUssdUJBQXVCO3dCQUM1QixJQUFJLFdBQVcsS0FBSzt3QkFDcEIsT0FBTyxTQUFTLFFBQVEsUUFBUTt3QkFDaEMsT0FBTyxTQUFTLEdBQUcsYUFBYSxRQUFROzs7Ozs7R0FzQmpEIiwiZmlsZSI6ImlkZW50aXR5L1N5bmNQYXNzd29yZHNEaWFsb2dDdHJsVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBpZGVudGl0eU1vZHVsZSBmcm9tICdpZGVudGl0eS9JZGVudGl0eU1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuaW1wb3J0ICcuL0xpbmtUZXN0RGF0YSc7XG5cbi8qKlxuICogVGVzdHMgZm9yIHRoZSBTeW5jUGFzc3dvcmREaWFsb2dDdHJsLlxuICovXG5kZXNjcmliZSgnU3luY1Bhc3N3b3JkRGlhbG9nQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0ICRyb290U2NvcGUsICRjb250cm9sbGVyLCAkaHR0cEJhY2tlbmQsIHRlc3RTZXJ2aWNlLCBtYW5hZ2VQYXNzd29yZFNlcnZpY2UsIGN0cmwsICRxLFxuICAgICAgICAkbW9kYWxJbnN0YW5jZSwgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlLCBjdXJyZW50UGFzc3dvcmRMaW5rcywgQ3VycmVudFBhc3N3b3JkU3RlcEhhbmRsZXIsXG4gICAgICAgIE5ld1Bhc3N3b3JkU3RlcEhhbmRsZXIsIGxpbmssIGlkZW50aXR5SWQ7XG4gICAgLy8gTG9hZCB0aGUgdGVzdCBtb2R1bGUgdG8gZ2V0IHRoZSB0ZXN0U2VydmljZSBhbmQgYWNjZXNzIHJlcXVlc3QgbW9kdWxlLlxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUsIGlkZW50aXR5TW9kdWxlKSk7XG5cbiAgICAvKipcbiAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXG4gICAgICovXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTEgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfbWFuYWdlUGFzc3dvcmRTZXJ2aWNlXywgX3Rlc3RTZXJ2aWNlXywgXyRjb250cm9sbGVyXyxcbiAgICAgICAgICAgIF8kcm9vdFNjb3BlXywgXyRodHRwQmFja2VuZF8sIF8kcV8sIF9wcm9taXNlVHJhY2tlclNlcnZpY2VfLCBfQ3VycmVudFBhc3N3b3JkU3RlcEhhbmRsZXJfLFxuICAgICAgICAgICAgX05ld1Bhc3N3b3JkU3RlcEhhbmRsZXJfLCBMaW5rLCBsaW5rVGVzdERhdGEpIHtcblxuICAgICAgICAvLyBTYXZlIHRoZSBzZXJ2aWNlcy5cbiAgICAgICAgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlID0gX21hbmFnZVBhc3N3b3JkU2VydmljZV87XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAkaHR0cEJhY2tlbmQgPSBfJGh0dHBCYWNrZW5kXztcbiAgICAgICAgJHEgPSBfJHFfO1xuICAgICAgICAkbW9kYWxJbnN0YW5jZSA9IHtcbiAgICAgICAgICAgIGNsb3NlOiBqYXNtaW5lLmNyZWF0ZVNweSgpLFxuICAgICAgICAgICAgZGlzbWlzczogamFzbWluZS5jcmVhdGVTcHkoKSxcbiAgICAgICAgICAgIHNldFRpdGxlOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIH07XG4gICAgICAgIHByb21pc2VUcmFja2VyU2VydmljZSA9IF9wcm9taXNlVHJhY2tlclNlcnZpY2VfO1xuICAgICAgICBsaW5rID0gbmV3IExpbmsobGlua1Rlc3REYXRhLkxJTksxKTtcbiAgICAgICAgaWRlbnRpdHlJZCA9IGxpbmsuZ2V0SWRlbnRpdHlJZCgpO1xuICAgICAgICBjdXJyZW50UGFzc3dvcmRMaW5rcyA9IFtsaW5rXTtcbiAgICAgICAgQ3VycmVudFBhc3N3b3JkU3RlcEhhbmRsZXIgPSBfQ3VycmVudFBhc3N3b3JkU3RlcEhhbmRsZXJfO1xuICAgICAgICBOZXdQYXNzd29yZFN0ZXBIYW5kbGVyID0gX05ld1Bhc3N3b3JkU3RlcEhhbmRsZXJfO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdzeWNocm9uaXplIHBhc3N3b3JkIGN0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYmVmb3JlRWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxuICAgICAgICAgICAgY3RybCA9ICRjb250cm9sbGVyKCdTeW5jUGFzc3dvcmREaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgICAgIG1hbmFnZVBhc3N3b3JkU2VydmljZTogbWFuYWdlUGFzc3dvcmRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICRxOiAkcSxcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZTogJG1vZGFsSW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlOiBwcm9taXNlVHJhY2tlclNlcnZpY2UsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWw6IHt9LFxuICAgICAgICAgICAgICAgIGlkZW50aXR5SWQ6IGlkZW50aXR5SWQsXG4gICAgICAgICAgICAgICAgcG9saWNpZXM6IFtdLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXNzd29yZExpbmtzOiBjdXJyZW50UGFzc3dvcmRMaW5rcyxcbiAgICAgICAgICAgICAgICBDdXJyZW50UGFzc3dvcmRTdGVwSGFuZGxlcjogQ3VycmVudFBhc3N3b3JkU3RlcEhhbmRsZXIsXG4gICAgICAgICAgICAgICAgTmV3UGFzc3dvcmRTdGVwSGFuZGxlcjogTmV3UGFzc3dvcmRTdGVwSGFuZGxlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjcmVhdGVzIGhhbmRsZXJzIGZvciBjdXJyZW50IHBhc3N3b3JkIGlucHV0IGFuZCBuZXcgcGFzc3dvcmQgaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVycyA9IGN0cmwuY3JlYXRlU3RlcEhhbmRsZXJzKCk7XG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlcnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXJzWzBdLmdldFN0ZXBJZCgpKS50b0VxdWFsKCdjdXJyZW50UGFzc3dvcmRJbnB1dCcpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXJzWzFdLmdldFN0ZXBJZCgpKS50b0VxdWFsKCduZXdQYXNzd29yZElucHV0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjcmVhdGVzIGhhbmRsZXIgZm9yIG5ldyBwYXNzd29yZCBpbnB1dCBvbmx5IHdoZW4gbm8gY3VycmVudCBwYXNzd29yZCBpcyBuZWVkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0cmwuY3VycmVudFBhc3N3b3JkTGlua3MgPSBbXTtcbiAgICAgICAgICAgIGxldCBoYW5kbGVycyA9IGN0cmwuY3JlYXRlU3RlcEhhbmRsZXJzKCk7XG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlcnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXJzWzBdLmdldFN0ZXBJZCgpKS50b0VxdWFsKCduZXdQYXNzd29yZElucHV0Jyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
