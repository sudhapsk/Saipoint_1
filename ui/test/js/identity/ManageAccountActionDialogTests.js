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
             * Tests for the ManageAccountActionDialogCtrl.
             */
            describe('ManageAccountActionDialogCtrl', function () {

                var quickLink = 'Manage%20Accounts';
                var $rootScope = undefined,
                    $controller = undefined,
                    $httpBackend = undefined,
                    testService = undefined,
                    manageAccountService = undefined,
                    ctrl = undefined,
                    $q = undefined,
                    $modalInstance = undefined,
                    promiseTrackerService = undefined,
                    link = undefined,
                    identityId = undefined,
                    IdentityRequestItem = undefined,
                    WorkflowResultItem = undefined,
                    manageAccountDataService = undefined,
                    managePasswordService = undefined;

                // Load the test module to get the testService and access request module.
                beforeEach(module(testModule, identityModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 13 */
                beforeEach(inject(function (_manageAccountService_, _manageAccountDataService_, _testService_, _$controller_, _$rootScope_, _$httpBackend_, _$q_, _promiseTrackerService_, PasswordLink, linkTestData, _IdentityRequestItem_, _WorkflowResultItem_, _managePasswordService_) {

                    // Save the services.
                    manageAccountDataService = _manageAccountDataService_;
                    manageAccountService = _manageAccountService_;
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
                    WorkflowResultItem = _WorkflowResultItem_;
                    link = new PasswordLink(linkTestData.LINK1);
                    identityId = link.getIdentityId();
                }));

                beforeEach(function () {
                    // Create the controller to test with.
                    ctrl = $controller('ManageAccountActionDialogCtrl', {
                        manageAccountService: manageAccountService,
                        managePasswordService: managePasswordService,
                        manageAccountDataService: manageAccountDataService,
                        $modalInstance: $modalInstance,
                        promiseTrackerService: promiseTrackerService,
                        identityId: identityId,
                        link: link,
                        operation: {
                            messageKey: 'ui_manage_accounts_op_disable'
                        },
                        IdentityRequestItem: IdentityRequestItem
                    });
                });

                describe('submit', function () {
                    it('sets errors if submit fails', function () {
                        var deferred = $q.defer();
                        spyOn(manageAccountService, 'submit').and.returnValue(deferred.promise);
                        deferred.reject({ messages: ['you suck'] });
                        ctrl.submit(quickLink, identityId, link, {});
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(1);
                    });

                    it('sets comments correctly', function () {
                        var deferred = $q.defer();
                        manageAccountDataService.quickLinkName = quickLink;
                        spyOn(manageAccountService, 'submit').and.returnValue(deferred.promise);
                        deferred.reject({ messages: ['you suck'] });

                        ctrl.showComment();
                        ctrl.comment = 'This is a test';

                        link.action = 'ui_manage_accounts_op_disable';
                        link.comment = ctrl.comment;

                        var decisions = {};
                        decisions[link.id] = link;

                        ctrl.submit();
                        $rootScope.$apply();
                        expect(manageAccountService.submit).toHaveBeenCalledWith(quickLink, identityId, decisions);
                    });

                    it('does not set errors if submit succeeds', function () {
                        var deferred = $q.defer();
                        spyOn(manageAccountService, 'submit').and.returnValue(deferred.promise);
                        deferred.resolve(new WorkflowResultItem({}));

                        ctrl.submit(quickLink, identityId, link, {});
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(0);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L01hbmFnZUFjY291bnRBY3Rpb25EaWFsb2dUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHNCQUFzQixtQkFBbUIsVUFBVSxTQUFTOzs7SUFHL0g7O0lBRUEsSUFBSSxnQkFBZ0I7SUFDcEIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGlCQUFpQix3QkFBd0I7V0FDMUMsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7V0FDaEMsVUFBVSxlQUFlO1FBQzVCLFNBQVMsWUFBWTs7Ozs7WUFGN0IsU0FBUyxpQ0FBaUMsWUFBVzs7Z0JBRWpELElBQU0sWUFBWTtnQkFDbEIsSUFBSSxhQUFVO29CQUFFLGNBQVc7b0JBQUUsZUFBWTtvQkFBRSxjQUFXO29CQUFFLHVCQUFvQjtvQkFBRSxPQUFJO29CQUFFLEtBQUU7b0JBQ2xGLGlCQUFjO29CQUFFLHdCQUFxQjtvQkFBRSxPQUFJO29CQUFFLGFBQVU7b0JBQUUsc0JBQW1CO29CQUFFLHFCQUFrQjtvQkFDaEcsMkJBQXdCO29CQUFFLHdCQUFxQjs7O2dCQUduRCxXQUFXLE9BQU8sWUFBWTs7Ozs7O2dCQU05QixXQUFXLE9BQU8sVUFBUyx3QkFBd0IsNEJBQTRCLGVBQWUsZUFDbkUsY0FBYyxnQkFBZ0IsTUFBTSx5QkFDcEMsY0FBYyxjQUFjLHVCQUF1QixzQkFDbEQseUJBQXlCOzs7b0JBR2pELDJCQUEyQjtvQkFDM0IsdUJBQXVCO29CQUN2Qix3QkFBd0I7b0JBQ3hCLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxhQUFhO29CQUNiLGVBQWU7b0JBQ2YsS0FBSztvQkFDTCxpQkFBaUI7d0JBQ2IsT0FBTyxRQUFRO3dCQUNmLFNBQVMsUUFBUTt3QkFDakIsVUFBVSxRQUFROztvQkFFdEIsc0JBQXNCO29CQUN0Qix3QkFBd0I7b0JBQ3hCLHFCQUFxQjtvQkFDckIsT0FBTyxJQUFJLGFBQWEsYUFBYTtvQkFDckMsYUFBYSxLQUFLOzs7Z0JBR3RCLFdBQVksWUFBVzs7b0JBRW5CLE9BQU8sWUFBWSxpQ0FBaUM7d0JBQ2hELHNCQUFzQjt3QkFDdEIsdUJBQXVCO3dCQUN2QiwwQkFBMEI7d0JBQzFCLGdCQUFnQjt3QkFDaEIsdUJBQXVCO3dCQUN2QixZQUFZO3dCQUNaLE1BQU07d0JBQ04sV0FBVzs0QkFDUCxZQUFZOzt3QkFFaEIscUJBQXFCOzs7O2dCQUk3QixTQUFTLFVBQVUsWUFBVztvQkFDMUIsR0FBRywrQkFBK0IsWUFBVzt3QkFDekMsSUFBSSxXQUFXLEdBQUc7d0JBQ2xCLE1BQU0sc0JBQXNCLFVBQVUsSUFBSSxZQUFZLFNBQVM7d0JBQy9ELFNBQVMsT0FBTyxFQUFDLFVBQVUsQ0FBQzt3QkFDNUIsS0FBSyxPQUFPLFdBQVcsWUFBWSxNQUFNO3dCQUN6QyxXQUFXO3dCQUNYLE9BQU8sS0FBSyxZQUFZLFFBQVEsUUFBUTs7O29CQUc1QyxHQUFHLDJCQUEyQixZQUFXO3dCQUNyQyxJQUFJLFdBQVcsR0FBRzt3QkFDbEIseUJBQXlCLGdCQUFnQjt3QkFDekMsTUFBTSxzQkFBc0IsVUFBVSxJQUFJLFlBQVksU0FBUzt3QkFDL0QsU0FBUyxPQUFPLEVBQUMsVUFBVSxDQUFDOzt3QkFFNUIsS0FBSzt3QkFDTCxLQUFLLFVBQVU7O3dCQUVmLEtBQUssU0FBUzt3QkFDZCxLQUFLLFVBQVUsS0FBSzs7d0JBRXBCLElBQUksWUFBWTt3QkFDaEIsVUFBVSxLQUFLLE1BQU07O3dCQUVyQixLQUFLO3dCQUNMLFdBQVc7d0JBQ1gsT0FBTyxxQkFBcUIsUUFBUSxxQkFBcUIsV0FBVyxZQUFZOzs7b0JBR3BGLEdBQUcsMENBQTBDLFlBQVc7d0JBQ3BELElBQUksV0FBVyxHQUFHO3dCQUNsQixNQUFNLHNCQUFzQixVQUFVLElBQUksWUFBWSxTQUFTO3dCQUMvRCxTQUFTLFFBQVEsSUFBSSxtQkFBbUI7O3dCQUd4QyxLQUFLLE9BQU8sV0FBVyxZQUFZLE1BQU07d0JBQ3pDLFdBQVc7d0JBQ1gsT0FBTyxLQUFLLFlBQVksUUFBUSxRQUFROzs7Ozs7R0FxQmpEIiwiZmlsZSI6ImlkZW50aXR5L01hbmFnZUFjY291bnRBY3Rpb25EaWFsb2dUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBpZGVudGl0eU1vZHVsZSBmcm9tICdpZGVudGl0eS9JZGVudGl0eU1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuaW1wb3J0ICcuL0xpbmtUZXN0RGF0YSc7XG5cbi8qKlxuICogVGVzdHMgZm9yIHRoZSBNYW5hZ2VBY2NvdW50QWN0aW9uRGlhbG9nQ3RybC5cbiAqL1xuZGVzY3JpYmUoJ01hbmFnZUFjY291bnRBY3Rpb25EaWFsb2dDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCBxdWlja0xpbmsgPSAnTWFuYWdlJTIwQWNjb3VudHMnO1xuICAgIGxldCAkcm9vdFNjb3BlLCAkY29udHJvbGxlciwgJGh0dHBCYWNrZW5kLCB0ZXN0U2VydmljZSwgbWFuYWdlQWNjb3VudFNlcnZpY2UsIGN0cmwsICRxLFxuICAgICAgICAkbW9kYWxJbnN0YW5jZSwgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlLCBsaW5rLCBpZGVudGl0eUlkLCBJZGVudGl0eVJlcXVlc3RJdGVtLCBXb3JrZmxvd1Jlc3VsdEl0ZW0sXG4gICAgICAgIG1hbmFnZUFjY291bnREYXRhU2VydmljZSwgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlO1xuXG4gICAgLy8gTG9hZCB0aGUgdGVzdCBtb2R1bGUgdG8gZ2V0IHRoZSB0ZXN0U2VydmljZSBhbmQgYWNjZXNzIHJlcXVlc3QgbW9kdWxlLlxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUsIGlkZW50aXR5TW9kdWxlKSk7XG5cbiAgICAvKipcbiAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXG4gICAgICovXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTMgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfbWFuYWdlQWNjb3VudFNlcnZpY2VfLCBfbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlXywgX3Rlc3RTZXJ2aWNlXywgXyRjb250cm9sbGVyXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfJHJvb3RTY29wZV8sIF8kaHR0cEJhY2tlbmRfLCBfJHFfLCBfcHJvbWlzZVRyYWNrZXJTZXJ2aWNlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzd29yZExpbmssIGxpbmtUZXN0RGF0YSwgX0lkZW50aXR5UmVxdWVzdEl0ZW1fLCBfV29ya2Zsb3dSZXN1bHRJdGVtXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX21hbmFnZVBhc3N3b3JkU2VydmljZV8pIHtcblxuICAgICAgICAvLyBTYXZlIHRoZSBzZXJ2aWNlcy5cbiAgICAgICAgbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlID0gX21hbmFnZUFjY291bnREYXRhU2VydmljZV87XG4gICAgICAgIG1hbmFnZUFjY291bnRTZXJ2aWNlID0gX21hbmFnZUFjY291bnRTZXJ2aWNlXztcbiAgICAgICAgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlID0gX21hbmFnZVBhc3N3b3JkU2VydmljZV87XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAkaHR0cEJhY2tlbmQgPSBfJGh0dHBCYWNrZW5kXztcbiAgICAgICAgJHEgPSBfJHFfO1xuICAgICAgICAkbW9kYWxJbnN0YW5jZSA9IHtcbiAgICAgICAgICAgIGNsb3NlOiBqYXNtaW5lLmNyZWF0ZVNweSgpLFxuICAgICAgICAgICAgZGlzbWlzczogamFzbWluZS5jcmVhdGVTcHkoKSxcbiAgICAgICAgICAgIHNldFRpdGxlOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIH07XG4gICAgICAgIElkZW50aXR5UmVxdWVzdEl0ZW0gPSBfSWRlbnRpdHlSZXF1ZXN0SXRlbV87XG4gICAgICAgIHByb21pc2VUcmFja2VyU2VydmljZSA9IF9wcm9taXNlVHJhY2tlclNlcnZpY2VfO1xuICAgICAgICBXb3JrZmxvd1Jlc3VsdEl0ZW0gPSBfV29ya2Zsb3dSZXN1bHRJdGVtXztcbiAgICAgICAgbGluayA9IG5ldyBQYXNzd29yZExpbmsobGlua1Rlc3REYXRhLkxJTksxKTtcbiAgICAgICAgaWRlbnRpdHlJZCA9IGxpbmsuZ2V0SWRlbnRpdHlJZCgpO1xuICAgIH0pKTtcblxuICAgIGJlZm9yZUVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ01hbmFnZUFjY291bnRBY3Rpb25EaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgbWFuYWdlQWNjb3VudFNlcnZpY2U6IG1hbmFnZUFjY291bnRTZXJ2aWNlLFxuICAgICAgICAgICAgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlOiBtYW5hZ2VQYXNzd29yZFNlcnZpY2UsXG4gICAgICAgICAgICBtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2U6IG1hbmFnZUFjY291bnREYXRhU2VydmljZSxcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZSxcbiAgICAgICAgICAgIHByb21pc2VUcmFja2VyU2VydmljZTogcHJvbWlzZVRyYWNrZXJTZXJ2aWNlLFxuICAgICAgICAgICAgaWRlbnRpdHlJZDogaWRlbnRpdHlJZCxcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICBvcGVyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlS2V5OiAndWlfbWFuYWdlX2FjY291bnRzX29wX2Rpc2FibGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSWRlbnRpdHlSZXF1ZXN0SXRlbTogSWRlbnRpdHlSZXF1ZXN0SXRlbVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzdWJtaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3NldHMgZXJyb3JzIGlmIHN1Ym1pdCBmYWlscycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZUFjY291bnRTZXJ2aWNlLCAnc3VibWl0JykuYW5kLnJldHVyblZhbHVlKGRlZmVycmVkLnByb21pc2UpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHttZXNzYWdlczogWyd5b3Ugc3VjayddfSk7XG4gICAgICAgICAgICBjdHJsLnN1Ym1pdChxdWlja0xpbmssIGlkZW50aXR5SWQsIGxpbmssIHt9KTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRFcnJvcnMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZXRzIGNvbW1lbnRzIGNvcnJlY3RseScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIG1hbmFnZUFjY291bnREYXRhU2VydmljZS5xdWlja0xpbmtOYW1lID0gcXVpY2tMaW5rO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlQWNjb3VudFNlcnZpY2UsICdzdWJtaXQnKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe21lc3NhZ2VzOiBbJ3lvdSBzdWNrJ119KTtcblxuICAgICAgICAgICAgY3RybC5zaG93Q29tbWVudCgpO1xuICAgICAgICAgICAgY3RybC5jb21tZW50ID0gJ1RoaXMgaXMgYSB0ZXN0JztcblxuICAgICAgICAgICAgbGluay5hY3Rpb24gPSAndWlfbWFuYWdlX2FjY291bnRzX29wX2Rpc2FibGUnO1xuICAgICAgICAgICAgbGluay5jb21tZW50ID0gY3RybC5jb21tZW50O1xuXG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0ge307XG4gICAgICAgICAgICBkZWNpc2lvbnNbbGluay5pZF0gPSBsaW5rO1xuXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VBY2NvdW50U2VydmljZS5zdWJtaXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHF1aWNrTGluaywgaWRlbnRpdHlJZCwgZGVjaXNpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHNldCBlcnJvcnMgaWYgc3VibWl0IHN1Y2NlZWRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlQWNjb3VudFNlcnZpY2UsICdzdWJtaXQnKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG5ldyBXb3JrZmxvd1Jlc3VsdEl0ZW0oe1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdChxdWlja0xpbmssIGlkZW50aXR5SWQsIGxpbmssIHt9KTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRFcnJvcnMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
