System.register(['test/js/TestInitializer', 'accessRequest/AccessRequestModule', 'test/js/TestModule', './AccessRequestTestData'], function (_export) {
    'use strict';

    var accessRequestModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_accessRequestAccessRequestModule) {
            accessRequestModule = _accessRequestAccessRequestModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_AccessRequestTestData) {}],
        execute: function () {

            describe('AdditionalQuestionsDialogCtrl', function () {

                var permittedById = '1234',
                    assignmentId = 'abcd',
                    $modalInstance = {
                    setTitle: angular.noop
                },
                    ctrl,
                    $controller,
                    accessRequestItem,
                    accountSelections,
                    ambiguousAssignedRoles,
                    RoleAssignmentSelectionStepHandler,
                    accessRequestItemsService,
                    accessRequestDataService,
                    testService,
                    $rootScope;

                beforeEach(module(testModule, accessRequestModule));

                /* jshint maxparams: 10 */
                beforeEach(inject(function (IdentityAccountSelection, AccessRequestItem, AssignedRole, _$controller_, _RoleAssignmentSelectionStepHandler_, _accessRequestItemsService_, _accessRequestDataService_, _testService_, _$rootScope_, accessRequestTestData) {
                    $controller = _$controller_;
                    RoleAssignmentSelectionStepHandler = _RoleAssignmentSelectionStepHandler_;
                    accessRequestItemsService = _accessRequestItemsService_;
                    accessRequestDataService = _accessRequestDataService_;
                    testService = _testService_;
                    $rootScope = _$rootScope_;

                    accountSelections = [new IdentityAccountSelection(accessRequestTestData.IDENTITY_ACCT_SELECTION1), new IdentityAccountSelection(accessRequestTestData.IDENTITY_ACCT_SELECTION2)];

                    ambiguousAssignedRoles = [new AssignedRole(accessRequestTestData.AMBIGUOUS_ASSIGNED_ROLE1), new AssignedRole(accessRequestTestData.AMBIGUOUS_ASSIGNED_ROLE2)];

                    accessRequestItem = new AccessRequestItem(accessRequestTestData.ROLE);
                }));

                function makeController(accountSelections, ambiguousAssignedRoles, permittedById, assignmentId) {
                    ctrl = $controller('AdditionalQuestionsDialogCtrl', {
                        accessRequestItem: accessRequestItem,
                        accountSelections: accountSelections,
                        ambiguousAssignedRoles: ambiguousAssignedRoles,
                        permittedById: permittedById,
                        assignmentId: assignmentId,
                        $modalInstance: $modalInstance
                    });
                }

                describe('constructor', function () {
                    it('initializes the parameters', function () {
                        makeController(accountSelections, ambiguousAssignedRoles, permittedById, assignmentId);

                        expect(ctrl.accessRequestItem).toEqual(accessRequestItem);
                        expect(ctrl.permittedById).toEqual(permittedById);
                        expect(ctrl.accountSelections.length).toEqual(accountSelections.length);
                        expect(ctrl.ambiguousAssignedRoles).toEqual(ambiguousAssignedRoles);
                        expect(ctrl.assignmentId).toEqual(assignmentId);
                    });

                    it('clones the account selections', function () {
                        ctrl.accountSelections[0].getProvisioningTargets()[0].setCreateAccount(true);
                        expect(accountSelections[0].getProvisioningTargets()[0].hasSelection()).toEqual(false);
                    });

                    it('creates a StepHandler for roles and account selections', function () {
                        makeController(accountSelections, ambiguousAssignedRoles, permittedById, assignmentId);

                        expect(ctrl.steps.length).toEqual(5);
                        expect(ctrl.steps[0] instanceof RoleAssignmentSelectionStepHandler).toBeTruthy();
                        expect(ctrl.steps[1].provisioningTarget).toEqual(accountSelections[0].getProvisioningTargets()[0]);
                        expect(ctrl.steps[2].provisioningTarget).toEqual(accountSelections[0].getProvisioningTargets()[1]);
                        expect(ctrl.steps[3].provisioningTarget).toEqual(accountSelections[1].getProvisioningTargets()[0]);
                        expect(ctrl.steps[4].provisioningTarget).toEqual(accountSelections[1].getProvisioningTargets()[1]);
                    });
                });

                it('formatStepResults() returns the accountSelections', function () {
                    makeController(accountSelections, ambiguousAssignedRoles, permittedById, assignmentId);
                    var results = ctrl.formatStepResults();
                    expect(results.accountSelections).toBeDefined();
                    expect(results.accountSelections).toEqual(ctrl.accountSelections);
                    expect(results.assignmentId).toEqual(ctrl.assignmentId);
                });

                describe('refreshStepHandlers()', function () {
                    var additionalQuestionsResult = {},
                        identityIds = ['1234', '5678'],
                        otherRequestedRoles = [{ mockthis: 'role' }];

                    beforeEach(function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.callFake(function () {
                            return testService.createPromise(false, additionalQuestionsResult);
                        });

                        spyOn(accessRequestDataService.getAccessRequest(), 'getIdentityIds').and.returnValue(identityIds);
                        spyOn(accessRequestDataService.getAccessRequest(), 'getOtherRequestedRoles').and.returnValue(otherRequestedRoles);
                    });

                    it('return promise that resolves to undefined if step is not role assignment selection', function () {
                        var promise;

                        makeController(accountSelections, undefined, undefined, undefined);
                        promise = ctrl.refreshStepHandlers();
                        promise.then(function (result) {
                            expect(result).not.toBeDefined();
                            expect(accessRequestItemsService.getAdditionalQuestions).not.toHaveBeenCalled();
                        });
                        $rootScope.$apply();
                    });

                    it('sets assignment id from step result', function () {
                        var newAssignmentId = 'assignmentXXXX';
                        makeController(undefined, ambiguousAssignedRoles, undefined, undefined);
                        ctrl.stepResults[ctrl.getCurrentStep().getStepId()] = newAssignmentId;
                        ctrl.refreshStepHandlers();
                        $rootScope.$apply();
                        expect(ctrl.assignmentId).toEqual(newAssignmentId);
                    });

                    it('calls for additional questions with correct parameters', function () {
                        var newAssignmentId = 'assignmentXXXX',
                            promise,
                            addtQuestionsCall;

                        additionalQuestionsResult = { accountSelections: [] };
                        makeController(undefined, ambiguousAssignedRoles, permittedById, undefined);
                        ctrl.stepResults[ctrl.getCurrentStep().getStepId()] = newAssignmentId;

                        promise = ctrl.refreshStepHandlers();
                        promise.then(function (result) {
                            expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalled();
                            addtQuestionsCall = accessRequestItemsService.getAdditionalQuestions.calls.mostRecent();

                            expect(addtQuestionsCall.args[0]).toEqual(accessRequestItem);
                            expect(addtQuestionsCall.args[1]).toEqual(identityIds);
                            expect(addtQuestionsCall.args[2]).toEqual(permittedById);
                            expect(addtQuestionsCall.args[3]).toEqual(newAssignmentId);
                            expect(addtQuestionsCall.args[4]).toEqual(otherRequestedRoles);
                        });
                        $rootScope.$apply();
                    });

                    it('returns promise that resolves to undefined if call to additional questions returns no account selections', function () {
                        var promise;

                        additionalQuestionsResult = { accountSelections: [] };
                        makeController(undefined, ambiguousAssignedRoles, undefined, undefined);

                        promise = ctrl.refreshStepHandlers();
                        promise.then(function (result) {
                            expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalled();
                            expect(result).not.toBeDefined();
                        });
                        $rootScope.$apply();
                    });

                    it('returns promise that resolves to new array of steps if returning new account selections', function () {
                        var promise;
                        additionalQuestionsResult = { accountSelections: accountSelections };
                        makeController(undefined, ambiguousAssignedRoles, undefined, undefined);
                        promise = ctrl.refreshStepHandlers();
                        promise.then(function (result) {
                            expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalled();
                            expect(result).toBeDefined();
                            expect(result.length).toEqual(5);
                            expect(result[0] instanceof RoleAssignmentSelectionStepHandler).toBeTruthy();
                            expect(result[1].provisioningTarget).toEqual(accountSelections[0].getProvisioningTargets()[0]);
                            expect(result[2].provisioningTarget).toEqual(accountSelections[0].getProvisioningTargets()[1]);
                            expect(result[3].provisioningTarget).toEqual(accountSelections[1].getProvisioningTargets()[0]);
                            expect(result[4].provisioningTarget).toEqual(accountSelections[1].getProvisioningTargets()[1]);
                        });

                        $rootScope.$apply();
                    });

                    it('replaces account selections steps if previous account selection steps are defined', function () {
                        var promise;
                        additionalQuestionsResult = { accountSelections: [] };
                        makeController(accountSelections, ambiguousAssignedRoles, undefined, undefined);
                        expect(ctrl.steps.length).toEqual(5);
                        promise = ctrl.refreshStepHandlers();
                        promise.then(function (result) {
                            expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalled();
                            expect(result).toBeDefined();
                            expect(result.length).toEqual(1);
                            expect(result[0] instanceof RoleAssignmentSelectionStepHandler).toBeTruthy();
                        });
                    });
                });

                describe('isRoleAssignmentSelection()', function () {
                    it('returns true if on role assignment selection step', function () {
                        makeController(undefined, ambiguousAssignedRoles, permittedById, undefined);
                        expect(ctrl.getCurrentStep() instanceof RoleAssignmentSelectionStepHandler).toBeTruthy();
                        expect(ctrl.isRoleAssignmentSelection()).toBeTruthy();
                    });

                    it('returns false if on account selection step', function () {
                        makeController(accountSelections, undefined, undefined, undefined);
                        expect(ctrl.getCurrentStep() instanceof RoleAssignmentSelectionStepHandler).toBeFalsy();
                        expect(ctrl.isRoleAssignmentSelection()).toBeFalsy();
                    });
                });

                describe('isAccountSelection()', function () {
                    it('returns false if on role assignment selection step', function () {
                        makeController(accountSelections, ambiguousAssignedRoles, permittedById, undefined);
                        expect(ctrl.getCurrentStep() instanceof RoleAssignmentSelectionStepHandler).toBeTruthy();
                        expect(ctrl.isAccountSelection()).toBeFalsy();
                    });

                    it('returns true if on account selection step', function () {
                        makeController(accountSelections, undefined, undefined, undefined);
                        expect(ctrl.getCurrentStep() instanceof RoleAssignmentSelectionStepHandler).toBeFalsy();
                        expect(ctrl.isAccountSelection()).toBeTruthy();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWRkaXRpb25hbFF1ZXN0aW9uc0RpYWxvZ0N0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLHNCQUFzQiw0QkFBNEIsVUFBVSxTQUFTO0lBQXRKOztJQUdJLElBQUkscUJBQXFCO0lBQ3pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCO1dBQ2hDLFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7WUFIN0IsU0FBUyxpQ0FBaUMsWUFBVzs7Z0JBRWpELElBQUksZ0JBQWdCO29CQUFRLGVBQWU7b0JBQ3ZDLGlCQUFpQjtvQkFDYixVQUFVLFFBQVE7O29CQUV0QjtvQkFBTTtvQkFBYTtvQkFBbUI7b0JBQW1CO29CQUN6RDtvQkFBb0M7b0JBQTJCO29CQUEwQjtvQkFDekY7O2dCQUVKLFdBQVcsT0FBTyxZQUFZOzs7Z0JBRzlCLFdBQVcsT0FBTyxVQUFTLDBCQUEwQixtQkFBbUIsY0FBYyxlQUMzRCxzQ0FBc0MsNkJBQ3RDLDRCQUE0QixlQUFlLGNBQzNDLHVCQUF1QjtvQkFDOUMsY0FBYztvQkFDZCxxQ0FBcUM7b0JBQ3JDLDRCQUE0QjtvQkFDNUIsMkJBQTJCO29CQUMzQixjQUFjO29CQUNkLGFBQWE7O29CQUViLG9CQUFvQixDQUNoQixJQUFJLHlCQUF5QixzQkFBc0IsMkJBQ25ELElBQUkseUJBQXlCLHNCQUFzQjs7b0JBR3ZELHlCQUF5QixDQUNyQixJQUFJLGFBQWEsc0JBQXNCLDJCQUN2QyxJQUFJLGFBQWEsc0JBQXNCOztvQkFHM0Msb0JBQW9CLElBQUksa0JBQWtCLHNCQUFzQjs7O2dCQUdwRSxTQUFTLGVBQWUsbUJBQW1CLHdCQUF3QixlQUFlLGNBQWM7b0JBQzVGLE9BQU8sWUFBWSxpQ0FBaUM7d0JB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QW1CO3dCQUNoRCxlQUFlLG1CQUFtQix3QkFBd0IsV0FBVzt3QkFDckUsT0FBTyxLQUFLLE1BQU0sUUFBUSxRQUFRO3dCQUNsQyxVQUFVLEtBQUs7d0JBQ2YsUUFBUSxLQUFLLFVBQVMsUUFBUTs0QkFDMUIsT0FBTywwQkFBMEIsd0JBQXdCOzRCQUN6RCxPQUFPLFFBQVE7NEJBQ2YsT0FBTyxPQUFPLFFBQVEsUUFBUTs0QkFDOUIsT0FBTyxPQUFPLGNBQWMsb0NBQW9DOzs7OztnQkFLNUUsU0FBUywrQkFBK0IsWUFBVztvQkFDL0MsR0FBSSxxREFBcUQsWUFBVzt3QkFDaEUsZUFBZSxXQUFXLHdCQUF3QixlQUFlO3dCQUNqRSxPQUFPLEtBQUssNEJBQTRCLG9DQUFvQzt3QkFDNUUsT0FBTyxLQUFLLDZCQUE2Qjs7O29CQUc3QyxHQUFJLDhDQUE4QyxZQUFXO3dCQUN6RCxlQUFlLG1CQUFtQixXQUFXLFdBQVc7d0JBQ3hELE9BQU8sS0FBSyw0QkFBNEIsb0NBQW9DO3dCQUM1RSxPQUFPLEtBQUssNkJBQTZCOzs7O2dCQUlqRCxTQUFTLHdCQUF3QixZQUFXO29CQUN4QyxHQUFJLHNEQUFzRCxZQUFXO3dCQUNqRSxlQUFlLG1CQUFtQix3QkFBd0IsZUFBZTt3QkFDekUsT0FBTyxLQUFLLDRCQUE0QixvQ0FBb0M7d0JBQzVFLE9BQU8sS0FBSyxzQkFBc0I7OztvQkFHdEMsR0FBSSw2Q0FBNkMsWUFBVzt3QkFDeEQsZUFBZSxtQkFBbUIsV0FBVyxXQUFXO3dCQUN4RCxPQUFPLEtBQUssNEJBQTRCLG9DQUFvQzt3QkFDNUUsT0FBTyxLQUFLLHNCQUFzQjs7Ozs7O0dBTzNDIiwiZmlsZSI6ImFjY2Vzc1JlcXVlc3QvQWRkaXRpb25hbFF1ZXN0aW9uc0RpYWxvZ0N0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgYWNjZXNzUmVxdWVzdE1vZHVsZSBmcm9tICdhY2Nlc3NSZXF1ZXN0L0FjY2Vzc1JlcXVlc3RNb2R1bGUnO1xyXG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xyXG5pbXBvcnQgJy4vQWNjZXNzUmVxdWVzdFRlc3REYXRhJztcclxuXHJcbmRlc2NyaWJlKCdBZGRpdGlvbmFsUXVlc3Rpb25zRGlhbG9nQ3RybCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBwZXJtaXR0ZWRCeUlkID0gJzEyMzQnLCBhc3NpZ25tZW50SWQgPSAnYWJjZCcsXHJcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UgPSB7XHJcbiAgICAgICAgICAgIHNldFRpdGxlOiBhbmd1bGFyLm5vb3BcclxuICAgICAgICB9LFxyXG4gICAgICAgIGN0cmwsICRjb250cm9sbGVyLCBhY2Nlc3NSZXF1ZXN0SXRlbSwgYWNjb3VudFNlbGVjdGlvbnMsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsXHJcbiAgICAgICAgUm9sZUFzc2lnbm1lbnRTZWxlY3Rpb25TdGVwSGFuZGxlciwgYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLCB0ZXN0U2VydmljZSxcclxuICAgICAgICAkcm9vdFNjb3BlO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUsIGFjY2Vzc1JlcXVlc3RNb2R1bGUpKTtcclxuXHJcbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAxMCAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uLCBBY2Nlc3NSZXF1ZXN0SXRlbSwgQXNzaWduZWRSb2xlLCBfJGNvbnRyb2xsZXJfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX1JvbGVBc3NpZ25tZW50U2VsZWN0aW9uU3RlcEhhbmRsZXJfLCBfYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlXywgX3Rlc3RTZXJ2aWNlXywgXyRyb290U2NvcGVfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdFRlc3REYXRhKSB7XHJcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xyXG4gICAgICAgIFJvbGVBc3NpZ25tZW50U2VsZWN0aW9uU3RlcEhhbmRsZXIgPSBfUm9sZUFzc2lnbm1lbnRTZWxlY3Rpb25TdGVwSGFuZGxlcl87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlXztcclxuICAgICAgICBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UgPSBfYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlXztcclxuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XHJcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuXHJcbiAgICAgICAgYWNjb3VudFNlbGVjdGlvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBJZGVudGl0eUFjY291bnRTZWxlY3Rpb24oYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZX0FDQ1RfU0VMRUNUSU9OMSksXHJcbiAgICAgICAgICAgIG5ldyBJZGVudGl0eUFjY291bnRTZWxlY3Rpb24oYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZX0FDQ1RfU0VMRUNUSU9OMilcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBhbWJpZ3VvdXNBc3NpZ25lZFJvbGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgQXNzaWduZWRSb2xlKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5BTUJJR1VPVVNfQVNTSUdORURfUk9MRTEpLFxyXG4gICAgICAgICAgICBuZXcgQXNzaWduZWRSb2xlKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5BTUJJR1VPVVNfQVNTSUdORURfUk9MRTIpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEl0ZW0gPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEUpO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1ha2VDb250cm9sbGVyKGFjY291bnRTZWxlY3Rpb25zLCBhbWJpZ3VvdXNBc3NpZ25lZFJvbGVzLCBwZXJtaXR0ZWRCeUlkLCBhc3NpZ25tZW50SWQpIHtcclxuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0FkZGl0aW9uYWxRdWVzdGlvbnNEaWFsb2dDdHJsJywge1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0SXRlbTogYWNjZXNzUmVxdWVzdEl0ZW0sXHJcbiAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb25zOiBhY2NvdW50U2VsZWN0aW9ucyxcclxuICAgICAgICAgICAgYW1iaWd1b3VzQXNzaWduZWRSb2xlczogYW1iaWd1b3VzQXNzaWduZWRSb2xlcyxcclxuICAgICAgICAgICAgcGVybWl0dGVkQnlJZDogcGVybWl0dGVkQnlJZCxcclxuICAgICAgICAgICAgYXNzaWdubWVudElkOiBhc3NpZ25tZW50SWQsXHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdpbml0aWFsaXplcyB0aGUgcGFyYW1ldGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYWtlQ29udHJvbGxlcihhY2NvdW50U2VsZWN0aW9ucywgYW1iaWd1b3VzQXNzaWduZWRSb2xlcywgcGVybWl0dGVkQnlJZCwgYXNzaWdubWVudElkKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFjY2Vzc1JlcXVlc3RJdGVtKS50b0VxdWFsKGFjY2Vzc1JlcXVlc3RJdGVtKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwucGVybWl0dGVkQnlJZCkudG9FcXVhbChwZXJtaXR0ZWRCeUlkKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWNjb3VudFNlbGVjdGlvbnMubGVuZ3RoKS50b0VxdWFsKGFjY291bnRTZWxlY3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFtYmlndW91c0Fzc2lnbmVkUm9sZXMpLnRvRXF1YWwoYW1iaWd1b3VzQXNzaWduZWRSb2xlcyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFzc2lnbm1lbnRJZCkudG9FcXVhbChhc3NpZ25tZW50SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2xvbmVzIHRoZSBhY2NvdW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5hY2NvdW50U2VsZWN0aW9uc1swXS5nZXRQcm92aXNpb25pbmdUYXJnZXRzKClbMF0uc2V0Q3JlYXRlQWNjb3VudCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY291bnRTZWxlY3Rpb25zWzBdLmdldFByb3Zpc2lvbmluZ1RhcmdldHMoKVswXS5oYXNTZWxlY3Rpb24oKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjcmVhdGVzIGEgU3RlcEhhbmRsZXIgZm9yIHJvbGVzIGFuZCBhY2NvdW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbWFrZUNvbnRyb2xsZXIoYWNjb3VudFNlbGVjdGlvbnMsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsIHBlcm1pdHRlZEJ5SWQsIGFzc2lnbm1lbnRJZCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdGVwcy5sZW5ndGgpLnRvRXF1YWwoNSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnN0ZXBzWzBdIGluc3RhbmNlb2YgUm9sZUFzc2lnbm1lbnRTZWxlY3Rpb25TdGVwSGFuZGxlcikudG9CZVRydXRoeSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdGVwc1sxXS5wcm92aXNpb25pbmdUYXJnZXQpLnRvRXF1YWwoYWNjb3VudFNlbGVjdGlvbnNbMF0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpWzBdKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc3RlcHNbMl0ucHJvdmlzaW9uaW5nVGFyZ2V0KS50b0VxdWFsKGFjY291bnRTZWxlY3Rpb25zWzBdLmdldFByb3Zpc2lvbmluZ1RhcmdldHMoKVsxXSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnN0ZXBzWzNdLnByb3Zpc2lvbmluZ1RhcmdldCkudG9FcXVhbChhY2NvdW50U2VsZWN0aW9uc1sxXS5nZXRQcm92aXNpb25pbmdUYXJnZXRzKClbMF0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zdGVwc1s0XS5wcm92aXNpb25pbmdUYXJnZXQpLnRvRXF1YWwoYWNjb3VudFNlbGVjdGlvbnNbMV0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpWzFdKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdmb3JtYXRTdGVwUmVzdWx0cygpIHJldHVybnMgdGhlIGFjY291bnRTZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbWFrZUNvbnRyb2xsZXIoYWNjb3VudFNlbGVjdGlvbnMsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsIHBlcm1pdHRlZEJ5SWQsIGFzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBjdHJsLmZvcm1hdFN0ZXBSZXN1bHRzKCk7XHJcbiAgICAgICAgZXhwZWN0KHJlc3VsdHMuYWNjb3VudFNlbGVjdGlvbnMpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgZXhwZWN0KHJlc3VsdHMuYWNjb3VudFNlbGVjdGlvbnMpLnRvRXF1YWwoY3RybC5hY2NvdW50U2VsZWN0aW9ucyk7XHJcbiAgICAgICAgZXhwZWN0KHJlc3VsdHMuYXNzaWdubWVudElkKS50b0VxdWFsKGN0cmwuYXNzaWdubWVudElkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdyZWZyZXNoU3RlcEhhbmRsZXJzKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYWRkaXRpb25hbFF1ZXN0aW9uc1Jlc3VsdCA9IHt9LFxyXG4gICAgICAgICAgICBpZGVudGl0eUlkcyA9IFsnMTIzNCcsJzU2NzgnXSxcclxuICAgICAgICAgICAgb3RoZXJSZXF1ZXN0ZWRSb2xlcyA9IFt7IG1vY2t0aGlzOiAncm9sZSd9XTtcclxuXHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UsICdnZXRBZGRpdGlvbmFsUXVlc3Rpb25zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIGFkZGl0aW9uYWxRdWVzdGlvbnNSZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRJZGVudGl0eUlkcycpLmFuZC5yZXR1cm5WYWx1ZShpZGVudGl0eUlkcyk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRPdGhlclJlcXVlc3RlZFJvbGVzJykuXHJcbiAgICAgICAgICAgICAgICBhbmQucmV0dXJuVmFsdWUob3RoZXJSZXF1ZXN0ZWRSb2xlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ICgncmV0dXJuIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB1bmRlZmluZWQgaWYgc3RlcCBpcyBub3Qgcm9sZSBhc3NpZ25tZW50IHNlbGVjdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgIG1ha2VDb250cm9sbGVyKGFjY291bnRTZWxlY3Rpb25zLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgcHJvbWlzZSA9IGN0cmwucmVmcmVzaFN0ZXBIYW5kbGVycygpO1xyXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFkZGl0aW9uYWxRdWVzdGlvbnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCAoJ3NldHMgYXNzaWdubWVudCBpZCBmcm9tIHN0ZXAgcmVzdWx0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdBc3NpZ25tZW50SWQgPSAnYXNzaWdubWVudFhYWFgnO1xyXG4gICAgICAgICAgICBtYWtlQ29udHJvbGxlcih1bmRlZmluZWQsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgY3RybC5zdGVwUmVzdWx0c1tjdHJsLmdldEN1cnJlbnRTdGVwKCkuZ2V0U3RlcElkKCldID0gbmV3QXNzaWdubWVudElkO1xyXG4gICAgICAgICAgICBjdHJsLnJlZnJlc2hTdGVwSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYXNzaWdubWVudElkKS50b0VxdWFsKG5ld0Fzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ICgnY2FsbHMgZm9yIGFkZGl0aW9uYWwgcXVlc3Rpb25zIHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdBc3NpZ25tZW50SWQgPSAnYXNzaWdubWVudFhYWFgnLFxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZSwgYWRkdFF1ZXN0aW9uc0NhbGw7XHJcblxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zUmVzdWx0ID0geyBhY2NvdW50U2VsZWN0aW9uczogW10gfTtcclxuICAgICAgICAgICAgbWFrZUNvbnRyb2xsZXIodW5kZWZpbmVkLCBhbWJpZ3VvdXNBc3NpZ25lZFJvbGVzLCBwZXJtaXR0ZWRCeUlkLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBjdHJsLnN0ZXBSZXN1bHRzW2N0cmwuZ2V0Q3VycmVudFN0ZXAoKS5nZXRTdGVwSWQoKV0gPSBuZXdBc3NpZ25tZW50SWQ7XHJcblxyXG4gICAgICAgICAgICBwcm9taXNlID0gY3RybC5yZWZyZXNoU3RlcEhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFkZGl0aW9uYWxRdWVzdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGFkZHRRdWVzdGlvbnNDYWxsID0gYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBZGRpdGlvbmFsUXVlc3Rpb25zLmNhbGxzLm1vc3RSZWNlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWRkdFF1ZXN0aW9uc0NhbGwuYXJnc1swXSkudG9FcXVhbChhY2Nlc3NSZXF1ZXN0SXRlbSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWRkdFF1ZXN0aW9uc0NhbGwuYXJnc1sxXSkudG9FcXVhbChpZGVudGl0eUlkcyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWRkdFF1ZXN0aW9uc0NhbGwuYXJnc1syXSkudG9FcXVhbChwZXJtaXR0ZWRCeUlkKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhZGR0UXVlc3Rpb25zQ2FsbC5hcmdzWzNdKS50b0VxdWFsKG5ld0Fzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWRkdFF1ZXN0aW9uc0NhbGwuYXJnc1s0XSkudG9FcXVhbChvdGhlclJlcXVlc3RlZFJvbGVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ICgncmV0dXJucyBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdW5kZWZpbmVkIGlmIGNhbGwgdG8gYWRkaXRpb25hbCBxdWVzdGlvbnMgcmV0dXJucyBubyBhY2NvdW50IHNlbGVjdGlvbnMnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnNSZXN1bHQgPSB7IGFjY291bnRTZWxlY3Rpb25zOiBbXSB9O1xyXG4gICAgICAgICAgICAgICAgbWFrZUNvbnRyb2xsZXIodW5kZWZpbmVkLCBhbWJpZ3VvdXNBc3NpZ25lZFJvbGVzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZSA9IGN0cmwucmVmcmVzaFN0ZXBIYW5kbGVycygpO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFkZGl0aW9uYWxRdWVzdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGl0ICgncmV0dXJucyBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gbmV3IGFycmF5IG9mIHN0ZXBzIGlmIHJldHVybmluZyBuZXcgYWNjb3VudCBzZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlO1xyXG4gICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zUmVzdWx0ID0geyBhY2NvdW50U2VsZWN0aW9uczogYWNjb3VudFNlbGVjdGlvbnMgfTtcclxuICAgICAgICAgICAgbWFrZUNvbnRyb2xsZXIodW5kZWZpbmVkLCBhbWJpZ3VvdXNBc3NpZ25lZFJvbGVzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIHByb21pc2UgPSBjdHJsLnJlZnJlc2hTdGVwSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UuZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0VxdWFsKDUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdFswXSBpbnN0YW5jZW9mIFJvbGVBc3NpZ25tZW50U2VsZWN0aW9uU3RlcEhhbmRsZXIpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHRbMV0ucHJvdmlzaW9uaW5nVGFyZ2V0KS50b0VxdWFsKGFjY291bnRTZWxlY3Rpb25zWzBdLmdldFByb3Zpc2lvbmluZ1RhcmdldHMoKVswXSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0WzJdLnByb3Zpc2lvbmluZ1RhcmdldCkudG9FcXVhbChhY2NvdW50U2VsZWN0aW9uc1swXS5nZXRQcm92aXNpb25pbmdUYXJnZXRzKClbMV0pO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdFszXS5wcm92aXNpb25pbmdUYXJnZXQpLnRvRXF1YWwoYWNjb3VudFNlbGVjdGlvbnNbMV0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpWzBdKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHRbNF0ucHJvdmlzaW9uaW5nVGFyZ2V0KS50b0VxdWFsKGFjY291bnRTZWxlY3Rpb25zWzFdLmdldFByb3Zpc2lvbmluZ1RhcmdldHMoKVsxXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQgKCdyZXBsYWNlcyBhY2NvdW50IHNlbGVjdGlvbnMgc3RlcHMgaWYgcHJldmlvdXMgYWNjb3VudCBzZWxlY3Rpb24gc3RlcHMgYXJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHByb21pc2U7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnNSZXN1bHQgPSB7YWNjb3VudFNlbGVjdGlvbnM6IFtdfTtcclxuICAgICAgICAgICAgbWFrZUNvbnRyb2xsZXIoYWNjb3VudFNlbGVjdGlvbnMsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc3RlcHMubGVuZ3RoKS50b0VxdWFsKDUpO1xyXG4gICAgICAgICAgICBwcm9taXNlID0gY3RybC5yZWZyZXNoU3RlcEhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFkZGl0aW9uYWxRdWVzdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHRbMF0gaW5zdGFuY2VvZiBSb2xlQXNzaWdubWVudFNlbGVjdGlvblN0ZXBIYW5kbGVyKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzUm9sZUFzc2lnbm1lbnRTZWxlY3Rpb24oKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0ICgncmV0dXJucyB0cnVlIGlmIG9uIHJvbGUgYXNzaWdubWVudCBzZWxlY3Rpb24gc3RlcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYWtlQ29udHJvbGxlcih1bmRlZmluZWQsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsIHBlcm1pdHRlZEJ5SWQsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEN1cnJlbnRTdGVwKCkgaW5zdGFuY2VvZiBSb2xlQXNzaWdubWVudFNlbGVjdGlvblN0ZXBIYW5kbGVyKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUm9sZUFzc2lnbm1lbnRTZWxlY3Rpb24oKSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCAoJ3JldHVybnMgZmFsc2UgaWYgb24gYWNjb3VudCBzZWxlY3Rpb24gc3RlcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYWtlQ29udHJvbGxlcihhY2NvdW50U2VsZWN0aW9ucywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEN1cnJlbnRTdGVwKCkgaW5zdGFuY2VvZiBSb2xlQXNzaWdubWVudFNlbGVjdGlvblN0ZXBIYW5kbGVyKS50b0JlRmFsc3koKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNSb2xlQXNzaWdubWVudFNlbGVjdGlvbigpKS50b0JlRmFsc3koKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc0FjY291bnRTZWxlY3Rpb24oKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0ICgncmV0dXJucyBmYWxzZSBpZiBvbiByb2xlIGFzc2lnbm1lbnQgc2VsZWN0aW9uIHN0ZXAnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbWFrZUNvbnRyb2xsZXIoYWNjb3VudFNlbGVjdGlvbnMsIGFtYmlndW91c0Fzc2lnbmVkUm9sZXMsIHBlcm1pdHRlZEJ5SWQsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEN1cnJlbnRTdGVwKCkgaW5zdGFuY2VvZiBSb2xlQXNzaWdubWVudFNlbGVjdGlvblN0ZXBIYW5kbGVyKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQWNjb3VudFNlbGVjdGlvbigpKS50b0JlRmFsc3koKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQgKCdyZXR1cm5zIHRydWUgaWYgb24gYWNjb3VudCBzZWxlY3Rpb24gc3RlcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtYWtlQ29udHJvbGxlcihhY2NvdW50U2VsZWN0aW9ucywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEN1cnJlbnRTdGVwKCkgaW5zdGFuY2VvZiBSb2xlQXNzaWdubWVudFNlbGVjdGlvblN0ZXBIYW5kbGVyKS50b0JlRmFsc3koKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNBY2NvdW50U2VsZWN0aW9uKCkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
