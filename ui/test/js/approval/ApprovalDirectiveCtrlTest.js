System.register(['test/js/TestInitializer', 'approval/ApprovalModule', 'test/js/TestModule', 'test/js/approval/ApprovalTestDataService'], function (_export) {
    'use strict';

    var approvalModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_testJsApprovalApprovalTestDataService) {}],
        execute: function () {

            /**
             * Tests for the ApprovalDirectiveCtrl.
             */
            describe('ApprovalDirectiveCtrl', function () {

                var scope, $controller, testService, approvalService, violationService, configService, navigationService, configServiceResult, approvalCompletionService, approvalTestDataService, Approval, callback, ctrl, collapsible;

                // Load the test module to get the testService.
                beforeEach(module(testModule));

                // Let the tests know we'll use the approval module.
                beforeEach(module(approvalModule));

                /**
                 * Setup the mocks for our tests - a scope and the controller.
                 */
                /* jshint maxparams:7 */
                beforeEach(inject(function (_$controller_, _approvalService_, _testService_, _violationService_, _navigationService_, _Approval_, _approvalTestDataService_) {

                    // Save the services.
                    $controller = _$controller_;
                    testService = _testService_;
                    Approval = _Approval_;
                    navigationService = _navigationService_;
                    approvalTestDataService = _approvalTestDataService_;

                    // Create a mock scope.
                    scope = {};

                    // Create a mock approvalCompletionService.
                    approvalCompletionService = {
                        openCompletionDialog: jasmine.createSpy()
                    };

                    // Create a mock configService.
                    configServiceResult = true;
                    configService = {
                        getConfigValue: jasmine.createSpy('getConfigValue').and.callFake(function () {
                            return configServiceResult;
                        })
                    };

                    // Override our mock approval service methods.
                    approvalService = _approvalService_;
                    approvalService.approveAll = testService.createResponseFunction();
                    approvalService.rejectAll = testService.createResponseFunction();

                    violationService = _violationService_;

                    collapsible = true;
                    callback = jasmine.createSpy('callback');
                }));

                /**
                 * Create an ApprovalDirectiveCtrl that is at the first position in the list, with
                 * some optional overrides.
                 */
                var createController = function (approvalOverrides, index) {
                    var approval = angular.copy(approvalTestDataService.createApproval());

                    // If overrides were specified, apply them.
                    if (approvalOverrides) {
                        angular.extend(approval, approvalOverrides);
                    }

                    createControllerWithApproval(approval, index);
                };

                /**
                 * Create an ApprovalDirectiveCtrl with the given approval and position in the list.
                 */
                var createControllerWithApproval = function (approval, index) {
                    scope.approval = approval ? new Approval(approval) : null;
                    scope.completionCallback = callback;
                    scope.templateStyle = collapsible ? 'collapsible' : 'full';
                    scope.index = index;

                    scope.$new = function () {
                        return {};
                    };

                    // Create the controller to test with.
                    ctrl = $controller('ApprovalDirectiveCtrl', {
                        $scope: scope,
                        approvalService: approvalService,
                        approvalCompletionService: approvalCompletionService,
                        violationService: violationService,
                        configService: configService,
                        navigationService: navigationService
                    });
                };

                it('pukes if there is no approval in scope', function () {
                    createControllerWithApproval(null, 0);
                    expect(function () {
                        ctrl.completePreDecided();
                    }).toThrow();
                });

                describe('toggleCollapsed()', function () {
                    it('toggles the collapsed state', function () {
                        createController();
                        expect(ctrl.isCollapsed).toEqual(true);
                        ctrl.toggleCollapsed();
                        expect(ctrl.isCollapsed).toEqual(false);
                        ctrl.toggleCollapsed();
                        expect(ctrl.isCollapsed).toEqual(true);
                    });

                    it('does not toggle the collapsed state when approval is not collapsible', function () {
                        collapsible = false;
                        createController();
                        expect(ctrl.isCollapsed).toEqual(false);
                        ctrl.toggleCollapsed();
                        expect(ctrl.isCollapsed).toEqual(false);
                    });
                });

                describe('collapsible', function () {
                    it('defaults to expanded if collapsible is not in scope', function () {
                        collapsible = null;
                        createController();
                        expect(ctrl.isCollapsed).toEqual(false);
                    });

                    it('defaults to not collapsible if collapsible is not in scope', function () {
                        collapsible = null;
                        createController();
                        expect(ctrl.isCollapsible()).toEqual(false);
                    });
                });

                describe('allowPriorityEditing()', function () {
                    it('returns the config service value', function () {
                        var allow = ctrl.allowPriorityEditing();
                        expect(allow).toEqual(configServiceResult);
                    });

                    it('defaults to false if property is not configured', function () {
                        var allow;
                        configServiceResult = null;
                        allow = ctrl.allowPriorityEditing();
                        expect(allow).toEqual(false);
                    });
                });

                /**
                 * Verify that the completion dialog was opened with the appropriate settings.
                 */
                var checkCompletionDialog = function () {
                    var args;

                    expect(approvalCompletionService.openCompletionDialog).toHaveBeenCalled();

                    args = approvalCompletionService.openCompletionDialog.calls.mostRecent().args;
                    expect(args[0]).toEqual(scope);
                    expect(args[1]).toEqual(scope.approval);
                };

                describe('approve all', function () {
                    it('sets all items to approved', function () {
                        createController();
                        ctrl.approveAll();
                        angular.forEach(scope.approval.approvalItems, function (item) {
                            expect(item.decision).toEqual('Approved');
                        });
                    });

                    it('shows the completion dialog', function () {
                        createController();
                        ctrl.approveAll();
                        checkCompletionDialog();
                    });

                    it('shows the expired sunset dialog when appropriate', function () {
                        // make second item have expired sunset date
                        var approval = angular.copy(approvalTestDataService.createApproval());
                        approval.approvalItems[1].sunsetExpired = true;

                        spyOn(approvalService, 'showExpiredSunsetDialog');

                        createControllerWithApproval(approval);
                        ctrl.approveAll();

                        expect(approvalService.showExpiredSunsetDialog).toHaveBeenCalledWith(true);
                    });
                });

                describe('reject all', function () {
                    it('sets all items to rejected', function () {
                        createController();
                        ctrl.rejectAll();
                        angular.forEach(scope.approval.approvalItems, function (item) {
                            expect(item.decision).toEqual('Rejected');
                        });
                    });

                    it('shows the completion dialog', function () {
                        createController();
                        ctrl.rejectAll();
                        checkCompletionDialog();
                    });
                });

                describe('show violations', function () {
                    var spModal,
                        ruleName = 'rule',
                        policyName = 'policy';

                    beforeEach(inject(function (_spModal_) {
                        spModal = _spModal_;
                        spyOn(spModal, 'open');
                    }));

                    it('should set the modal title to the rule name', function () {
                        var violation = {
                            policyName: policyName,
                            ruleName: ruleName
                        };
                        createController();
                        ctrl.showViolationDetails(scope.approval.id, violation);
                        expect(spModal.open).toHaveBeenCalled();
                        spModal.open.calls.mostRecent().args[0].title = ruleName;
                    });
                });

                describe('show edit priority dialog', function () {
                    var spModal, $q, $rootScope;

                    beforeEach(inject(function (_spModal_, _$q_, _$rootScope_) {
                        spModal = _spModal_;
                        $q = _$q_;
                        $rootScope = _$rootScope_;

                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                    }));

                    it('opens the modal', function () {
                        createController();
                        ctrl.showEditPriorityDialog();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].controller).toEqual('ApprovalPriorityDialogCtrl');
                    });

                    it('sets the approval priority upon completion', function () {
                        var deferred = $q.defer();
                        deferred.resolve('Low');

                        // Make the modal return a result that resolves to 'Low'.  This
                        // simulates the savePriority() function.
                        spModal.open.and.returnValue({
                            result: deferred.promise
                        });

                        createController();
                        ctrl.showEditPriorityDialog();

                        // Run a digest cycle to resolve the promise.
                        $rootScope.$apply();

                        // Check that the approval has the new priority.
                        expect(scope.approval.priority).toEqual('Low');
                    });
                });

                describe('open comment dialog', function () {
                    var commentService;
                    beforeEach(inject(function (approvalCommentService) {
                        commentService = approvalCommentService;
                        spyOn(commentService, 'openCommentDialog');
                        createController();
                    }));

                    it('should call the service method', function () {
                        ctrl.showApprovalComments();
                        expect(commentService.openCommentDialog).toHaveBeenCalled();
                    });
                });

                describe('show forward dialog', function () {
                    var spModal;

                    beforeEach(inject(function (_spModal_) {
                        spModal = _spModal_;
                        spyOn(spModal, 'open');
                        createController();
                    }));

                    it('opens the modal', function () {
                        ctrl.showForwardDialog();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('show workgroup assignment dialog', function () {
                    var spModal, $q, $rootScope;

                    beforeEach(inject(function (_spModal_, _$q_, _$rootScope_) {
                        spModal = _spModal_;
                        $q = _$q_;
                        $rootScope = _$rootScope_;

                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                    }));

                    it('opens the modal', function () {
                        createController({
                            owner: {
                                displayName: 'Some Workgroup',
                                workgroup: true
                            },
                            assignee: null
                        });
                        ctrl.showWorkgroupAssignmentDialog();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].controller).toEqual('WorkgroupAssignmentDialogCtrl');
                    });

                    it('sets the assignee upon completion', function () {
                        var deferred = $q.defer();
                        deferred.resolve({
                            name: 'Harry.Dixon',
                            displayName: 'Harry Dixon'
                        });

                        // Make the modal return a result that resolves to an identity Harry.Dixon'.  This
                        // simulates the assignApproval() function.
                        spModal.open.and.returnValue({
                            result: deferred.promise
                        });

                        createController({
                            owner: {
                                displayName: 'Some Workgroup',
                                workgroup: true
                            },
                            assignee: null
                        });
                        ctrl.showWorkgroupAssignmentDialog();

                        // Run a digest cycle to resolve the promise.
                        $rootScope.$apply();

                        // Check that the approval has the new assignee.
                        expect(scope.approval.assignee).toEqual({
                            name: 'Harry.Dixon',
                            displayName: 'Harry Dixon'
                        });
                    });

                    it('throws trying to open dialog if owner is not a workgroup', function () {
                        createController({
                            owner: {
                                displayName: 'Harry Dixon',
                                workgroup: false
                            }
                        });
                        expect(function () {
                            ctrl.showWorkgroupAssignmentDialog();
                        }).toThrow();
                    });
                });

                describe('getUniquifier()', function () {
                    it('gets a unique string with the index', function () {
                        createController({}, 4);
                        expect(ctrl.getUniquifier()).toEqual('Approval4');
                    });
                });

                describe('viewIdentityRequest', function () {
                    it('calls navigation service with correct parameters', function () {
                        spyOn(navigationService, 'go');
                        createController();

                        ctrl.viewIdentityRequest();

                        expect(navigationService.go).toHaveBeenCalled();
                        expect(navigationService.go.calls.mostRecent().args[0].outcome).toEqual('viewAccessRequestDetail?id=' + scope.approval.accessRequestName);
                        expect(navigationService.go.calls.mostRecent().args[0].navigationHistory).toEqual('viewCommonWorkItem#/commonWorkItem/' + scope.approval.getId());
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0FwcHJvdmFsRGlyZWN0aXZlQ3RybFRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixzQkFBc0IsNkNBQTZDLFVBQVUsU0FBUztJQUN6Sjs7SUFFQSxJQUFJLGdCQUFnQjtJQUNwQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjtXQUNoQyxVQUFVLHdDQUF3QztRQUNyRCxTQUFTLFlBQVk7Ozs7O1lBRDdCLFNBQVMseUJBQXlCLFlBQVc7O2dCQUV6QyxJQUFJLE9BQU8sYUFBYSxhQUFhLGlCQUFpQixrQkFBa0IsZUFBZSxtQkFDbkYscUJBQXFCLDJCQUEyQix5QkFBeUIsVUFBVSxVQUFVLE1BQzdGOzs7Z0JBR0osV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTzs7Ozs7O2dCQU1sQixXQUFXLE9BQU8sVUFBUyxlQUFlLG1CQUFtQixlQUFlLG9CQUNqRCxxQkFBcUIsWUFBWSwyQkFBMkI7OztvQkFHbkYsY0FBYztvQkFDZCxjQUFjO29CQUNkLFdBQVc7b0JBQ1gsb0JBQW9CO29CQUNwQiwwQkFBMEI7OztvQkFHMUIsUUFBUTs7O29CQUdSLDRCQUE0Qjt3QkFDeEIsc0JBQXNCLFFBQVE7Ozs7b0JBSWxDLHNCQUFzQjtvQkFDdEIsZ0JBQWdCO3dCQUNaLGdCQUFnQixRQUFRLFVBQVUsa0JBQWtCLElBQUksU0FBUyxZQUFXOzRCQUN4RSxPQUFPOzs7OztvQkFLZixrQkFBa0I7b0JBQ2xCLGdCQUFnQixhQUFhLFlBQVk7b0JBQ3pDLGdCQUFnQixZQUFZLFlBQVk7O29CQUV4QyxtQkFBbUI7O29CQUVuQixjQUFjO29CQUNkLFdBQVcsUUFBUSxVQUFVOzs7Ozs7O2dCQU9qQyxJQUFJLG1CQUFtQixVQUFTLG1CQUFtQixPQUFPO29CQUN0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LFNBQVMsbUJBQW1CLFlBQVc7b0JBQ25DLEdBQUksdUNBQXVDLFlBQVc7d0JBQ2xELGlCQUFpQixJQUFJO3dCQUNyQixPQUFPLEtBQUssaUJBQWlCLFFBQVE7Ozs7Z0JBSTdDLFNBQVMsdUJBQXVCLFlBQVc7b0JBQ3ZDLEdBQUcsb0RBQW9ELFlBQVc7d0JBQzlELE1BQU0sbUJBQW1CO3dCQUN6Qjs7d0JBRUEsS0FBSzs7d0JBRUwsT0FBTyxrQkFBa0IsSUFBSTt3QkFDN0IsT0FBTyxrQkFBa0IsR0FBRyxNQUFNLGFBQWEsS0FBSyxHQUFHLFNBQ25ELFFBQVEsZ0NBQWdDLE1BQU0sU0FBUzt3QkFDM0QsT0FBTyxrQkFBa0IsR0FBRyxNQUFNLGFBQWEsS0FBSyxHQUFHLG1CQUNuRCxRQUFRLHdDQUF3QyxNQUFNLFNBQVM7Ozs7OztHQVE1RSIsImZpbGUiOiJhcHByb3ZhbC9BcHByb3ZhbERpcmVjdGl2ZUN0cmxUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBhcHByb3ZhbE1vZHVsZSBmcm9tICdhcHByb3ZhbC9BcHByb3ZhbE1vZHVsZSc7XHJcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XHJcblxyXG5pbXBvcnQgJ3Rlc3QvanMvYXBwcm92YWwvQXBwcm92YWxUZXN0RGF0YVNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGZvciB0aGUgQXBwcm92YWxEaXJlY3RpdmVDdHJsLlxyXG4gKi9cclxuZGVzY3JpYmUoJ0FwcHJvdmFsRGlyZWN0aXZlQ3RybCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBzY29wZSwgJGNvbnRyb2xsZXIsIHRlc3RTZXJ2aWNlLCBhcHByb3ZhbFNlcnZpY2UsIHZpb2xhdGlvblNlcnZpY2UsIGNvbmZpZ1NlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIGNvbmZpZ1NlcnZpY2VSZXN1bHQsIGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2UsIGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLCBBcHByb3ZhbCwgY2FsbGJhY2ssIGN0cmwsXHJcbiAgICAgICAgY29sbGFwc2libGU7XHJcblxyXG4gICAgLy8gTG9hZCB0aGUgdGVzdCBtb2R1bGUgdG8gZ2V0IHRoZSB0ZXN0U2VydmljZS5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUpKTtcclxuXHJcbiAgICAvLyBMZXQgdGhlIHRlc3RzIGtub3cgd2UnbGwgdXNlIHRoZSBhcHByb3ZhbCBtb2R1bGUuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhcHByb3ZhbE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgdGhlIG1vY2tzIGZvciBvdXIgdGVzdHMgLSBhIHNjb3BlIGFuZCB0aGUgY29udHJvbGxlci5cclxuICAgICAqL1xyXG4gICAgLyoganNoaW50IG1heHBhcmFtczo3ICovXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbnRyb2xsZXJfLCBfYXBwcm92YWxTZXJ2aWNlXywgX3Rlc3RTZXJ2aWNlXywgX3Zpb2xhdGlvblNlcnZpY2VfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX25hdmlnYXRpb25TZXJ2aWNlXywgX0FwcHJvdmFsXywgX2FwcHJvdmFsVGVzdERhdGFTZXJ2aWNlXykge1xyXG5cclxuICAgICAgICAvLyBTYXZlIHRoZSBzZXJ2aWNlcy5cclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xyXG4gICAgICAgIEFwcHJvdmFsID0gX0FwcHJvdmFsXztcclxuICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSA9IF9uYXZpZ2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgYXBwcm92YWxUZXN0RGF0YVNlcnZpY2UgPSBfYXBwcm92YWxUZXN0RGF0YVNlcnZpY2VfO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBtb2NrIHNjb3BlLlxyXG4gICAgICAgIHNjb3BlID0ge307XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIG1vY2sgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZS5cclxuICAgICAgICBhcHByb3ZhbENvbXBsZXRpb25TZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBvcGVuQ29tcGxldGlvbkRpYWxvZzogamFzbWluZS5jcmVhdGVTcHkoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIG1vY2sgY29uZmlnU2VydmljZS5cclxuICAgICAgICBjb25maWdTZXJ2aWNlUmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICBjb25maWdTZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBnZXRDb25maWdWYWx1ZTogamFzbWluZS5jcmVhdGVTcHkoJ2dldENvbmZpZ1ZhbHVlJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1NlcnZpY2VSZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gT3ZlcnJpZGUgb3VyIG1vY2sgYXBwcm92YWwgc2VydmljZSBtZXRob2RzLlxyXG4gICAgICAgIGFwcHJvdmFsU2VydmljZSA9IF9hcHByb3ZhbFNlcnZpY2VfO1xyXG4gICAgICAgIGFwcHJvdmFsU2VydmljZS5hcHByb3ZlQWxsID0gdGVzdFNlcnZpY2UuY3JlYXRlUmVzcG9uc2VGdW5jdGlvbigpO1xyXG4gICAgICAgIGFwcHJvdmFsU2VydmljZS5yZWplY3RBbGwgPSB0ZXN0U2VydmljZS5jcmVhdGVSZXNwb25zZUZ1bmN0aW9uKCk7XHJcblxyXG4gICAgICAgIHZpb2xhdGlvblNlcnZpY2UgPSBfdmlvbGF0aW9uU2VydmljZV87XHJcblxyXG4gICAgICAgIGNvbGxhcHNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGFuIEFwcHJvdmFsRGlyZWN0aXZlQ3RybCB0aGF0IGlzIGF0IHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgbGlzdCwgd2l0aFxyXG4gICAgICogc29tZSBvcHRpb25hbCBvdmVycmlkZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBjcmVhdGVDb250cm9sbGVyID0gZnVuY3Rpb24oYXBwcm92YWxPdmVycmlkZXMsIGluZGV4KSB7XHJcbiAgICAgICAgdmFyIGFwcHJvdmFsID0gYW5ndWxhci5jb3B5KGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLmNyZWF0ZUFwcHJvdmFsKCkpO1xyXG5cclxuICAgICAgICAvLyBJZiBvdmVycmlkZXMgd2VyZSBzcGVjaWZpZWQsIGFwcGx5IHRoZW0uXHJcbiAgICAgICAgaWYgKGFwcHJvdmFsT3ZlcnJpZGVzKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKGFwcHJvdmFsLCBhcHByb3ZhbE92ZXJyaWRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVDb250cm9sbGVyV2l0aEFwcHJvdmFsKGFwcHJvdmFsLCBpbmRleCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGFuIEFwcHJvdmFsRGlyZWN0aXZlQ3RybCB3aXRoIHRoZSBnaXZlbiBhcHByb3ZhbCBhbmQgcG9zaXRpb24gaW4gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHZhciBjcmVhdGVDb250cm9sbGVyV2l0aEFwcHJvdmFsID0gZnVuY3Rpb24oYXBwcm92YWwsIGluZGV4KSB7XHJcbiAgICAgICAgc2NvcGUuYXBwcm92YWwgPSAoYXBwcm92YWwpID8gbmV3IEFwcHJvdmFsKGFwcHJvdmFsKSA6IG51bGw7XHJcbiAgICAgICAgc2NvcGUuY29tcGxldGlvbkNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgc2NvcGUudGVtcGxhdGVTdHlsZSA9IGNvbGxhcHNpYmxlID8gJ2NvbGxhcHNpYmxlJyA6ICdmdWxsJztcclxuICAgICAgICBzY29wZS5pbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgICBzY29wZS4kbmV3ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIGN0cmwgPSAkY29udHJvbGxlcignQXBwcm92YWxEaXJlY3RpdmVDdHJsJywge1xyXG4gICAgICAgICAgICAkc2NvcGU6IHNjb3BlLFxyXG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2U6IGFwcHJvdmFsU2VydmljZSxcclxuICAgICAgICAgICAgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZTogYXBwcm92YWxDb21wbGV0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgdmlvbGF0aW9uU2VydmljZTogdmlvbGF0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgY29uZmlnU2VydmljZTogY29uZmlnU2VydmljZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2U6IG5hdmlnYXRpb25TZXJ2aWNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGl0KCdwdWtlcyBpZiB0aGVyZSBpcyBubyBhcHByb3ZhbCBpbiBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2xsZXJXaXRoQXBwcm92YWwobnVsbCwgMCk7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjdHJsLmNvbXBsZXRlUHJlRGVjaWRlZCgpOyB9KS50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgndG9nZ2xlQ29sbGFwc2VkKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgndG9nZ2xlcyB0aGUgY29sbGFwc2VkIHN0YXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzZWQpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlQ29sbGFwc2VkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2VkKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgY3RybC50b2dnbGVDb2xsYXBzZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzZWQpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCB0b2dnbGUgdGhlIGNvbGxhcHNlZCBzdGF0ZSB3aGVuIGFwcHJvdmFsIGlzIG5vdCBjb2xsYXBzaWJsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb2xsYXBzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2VkKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgY3RybC50b2dnbGVDb2xsYXBzZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzZWQpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbGxhcHNpYmxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2RlZmF1bHRzIHRvIGV4cGFuZGVkIGlmIGNvbGxhcHNpYmxlIGlzIG5vdCBpbiBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb2xsYXBzaWJsZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzZWQpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZGVmYXVsdHMgdG8gbm90IGNvbGxhcHNpYmxlIGlmIGNvbGxhcHNpYmxlIGlzIG5vdCBpbiBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb2xsYXBzaWJsZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzaWJsZSgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdhbGxvd1ByaW9yaXR5RWRpdGluZygpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGNvbmZpZyBzZXJ2aWNlIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxvdyA9IGN0cmwuYWxsb3dQcmlvcml0eUVkaXRpbmcoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFsbG93KS50b0VxdWFsKGNvbmZpZ1NlcnZpY2VSZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZGVmYXVsdHMgdG8gZmFsc2UgaWYgcHJvcGVydHkgaXMgbm90IGNvbmZpZ3VyZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFsbG93O1xyXG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlUmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgYWxsb3cgPSBjdHJsLmFsbG93UHJpb3JpdHlFZGl0aW5nKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbGxvdykudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmeSB0aGF0IHRoZSBjb21wbGV0aW9uIGRpYWxvZyB3YXMgb3BlbmVkIHdpdGggdGhlIGFwcHJvcHJpYXRlIHNldHRpbmdzLlxyXG4gICAgICovXHJcbiAgICB2YXIgY2hlY2tDb21wbGV0aW9uRGlhbG9nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFyZ3M7XHJcblxyXG4gICAgICAgIGV4cGVjdChhcHByb3ZhbENvbXBsZXRpb25TZXJ2aWNlLm9wZW5Db21wbGV0aW9uRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIGFyZ3MgPSBhcHByb3ZhbENvbXBsZXRpb25TZXJ2aWNlLm9wZW5Db21wbGV0aW9uRGlhbG9nLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xyXG4gICAgICAgIGV4cGVjdChhcmdzWzBdKS50b0VxdWFsKHNjb3BlKTtcclxuICAgICAgICBleHBlY3QoYXJnc1sxXSkudG9FcXVhbChzY29wZS5hcHByb3ZhbCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBkZXNjcmliZSgnYXBwcm92ZSBhbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2V0cyBhbGwgaXRlbXMgdG8gYXBwcm92ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBjdHJsLmFwcHJvdmVBbGwoKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNjb3BlLmFwcHJvdmFsLmFwcHJvdmFsSXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtLmRlY2lzaW9uKS50b0VxdWFsKCdBcHByb3ZlZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBjb21wbGV0aW9uIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGN0cmwuYXBwcm92ZUFsbCgpO1xyXG4gICAgICAgICAgICBjaGVja0NvbXBsZXRpb25EaWFsb2coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBleHBpcmVkIHN1bnNldCBkaWFsb2cgd2hlbiBhcHByb3ByaWF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gbWFrZSBzZWNvbmQgaXRlbSBoYXZlIGV4cGlyZWQgc3Vuc2V0IGRhdGVcclxuICAgICAgICAgICAgbGV0IGFwcHJvdmFsID0gYW5ndWxhci5jb3B5KGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLmNyZWF0ZUFwcHJvdmFsKCkpO1xyXG4gICAgICAgICAgICBhcHByb3ZhbC5hcHByb3ZhbEl0ZW1zWzFdLnN1bnNldEV4cGlyZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oYXBwcm92YWxTZXJ2aWNlLCAnc2hvd0V4cGlyZWRTdW5zZXREaWFsb2cnKTtcclxuXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXJXaXRoQXBwcm92YWwoYXBwcm92YWwpO1xyXG4gICAgICAgICAgICBjdHJsLmFwcHJvdmVBbGwoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2Uuc2hvd0V4cGlyZWRTdW5zZXREaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKCdyZWplY3QgYWxsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3NldHMgYWxsIGl0ZW1zIHRvIHJlamVjdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgY3RybC5yZWplY3RBbGwoKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHNjb3BlLmFwcHJvdmFsLmFwcHJvdmFsSXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtLmRlY2lzaW9uKS50b0VxdWFsKCdSZWplY3RlZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBjb21wbGV0aW9uIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGN0cmwucmVqZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIGNoZWNrQ29tcGxldGlvbkRpYWxvZygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3cgdmlvbGF0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzcE1vZGFsLFxyXG4gICAgICAgICAgICBydWxlTmFtZSA9ICdydWxlJyxcclxuICAgICAgICAgICAgcG9saWN5TmFtZSA9ICdwb2xpY3knO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfc3BNb2RhbF8pIHtcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IHRoZSBtb2RhbCB0aXRsZSB0byB0aGUgcnVsZSBuYW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2aW9sYXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lOYW1lOiBwb2xpY3lOYW1lLFxyXG4gICAgICAgICAgICAgICAgcnVsZU5hbWU6IHJ1bGVOYW1lXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgY3RybC5zaG93VmlvbGF0aW9uRGV0YWlscyhzY29wZS5hcHByb3ZhbC5pZCwgdmlvbGF0aW9uKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0udGl0bGUgPSBydWxlTmFtZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvdyBlZGl0IHByaW9yaXR5IGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzcE1vZGFsLCAkcSwgJHJvb3RTY29wZTtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3NwTW9kYWxfLCBfJHFfLCBfJHJvb3RTY29wZV8pIHtcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgJHEgPSBfJHFfO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiAkcS5kZWZlcigpLnByb21pc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnb3BlbnMgdGhlIG1vZGFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgY3RybC5zaG93RWRpdFByaW9yaXR5RGlhbG9nKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5jb250cm9sbGVyKS50b0VxdWFsKCdBcHByb3ZhbFByaW9yaXR5RGlhbG9nQ3RybCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2V0cyB0aGUgYXBwcm92YWwgcHJpb3JpdHkgdXBvbiBjb21wbGV0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ0xvdycpO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSB0aGUgbW9kYWwgcmV0dXJuIGEgcmVzdWx0IHRoYXQgcmVzb2x2ZXMgdG8gJ0xvdycuICBUaGlzXHJcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlcyB0aGUgc2F2ZVByaW9yaXR5KCkgZnVuY3Rpb24uXHJcbiAgICAgICAgICAgIHNwTW9kYWwub3Blbi5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBkZWZlcnJlZC5wcm9taXNlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBjdHJsLnNob3dFZGl0UHJpb3JpdHlEaWFsb2coKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJ1biBhIGRpZ2VzdCBjeWNsZSB0byByZXNvbHZlIHRoZSBwcm9taXNlLlxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgYXBwcm92YWwgaGFzIHRoZSBuZXcgcHJpb3JpdHkuXHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbC5wcmlvcml0eSkudG9FcXVhbCgnTG93Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnb3BlbiBjb21tZW50IGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb21tZW50U2VydmljZTtcclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihhcHByb3ZhbENvbW1lbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRTZXJ2aWNlID0gYXBwcm92YWxDb21tZW50U2VydmljZTtcclxuICAgICAgICAgICAgc3B5T24oY29tbWVudFNlcnZpY2UsICdvcGVuQ29tbWVudERpYWxvZycpO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIHNlcnZpY2UgbWV0aG9kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuc2hvd0FwcHJvdmFsQ29tbWVudHMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvdyBmb3J3YXJkIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzcE1vZGFsO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfc3BNb2RhbF8pIHtcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyB0aGUgbW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5zaG93Rm9yd2FyZERpYWxvZygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvdyB3b3JrZ3JvdXAgYXNzaWdubWVudCBkaWFsb2cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BNb2RhbCwgJHEsICRyb290U2NvcGU7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9zcE1vZGFsXywgXyRxXywgXyRyb290U2NvcGVfKSB7XHJcbiAgICAgICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcbiAgICAgICAgICAgICRxID0gXyRxXztcclxuICAgICAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuXHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLnJldHVyblZhbHVlKHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDogJHEuZGVmZXIoKS5wcm9taXNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaXQoJ29wZW5zIHRoZSBtb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKHtcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdTb21lIFdvcmtncm91cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2dyb3VwOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXNzaWduZWU6IG51bGxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGN0cmwuc2hvd1dvcmtncm91cEFzc2lnbm1lbnREaWFsb2coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLmNvbnRyb2xsZXIpLnRvRXF1YWwoJ1dvcmtncm91cEFzc2lnbm1lbnREaWFsb2dDdHJsJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzZXRzIHRoZSBhc3NpZ25lZSB1cG9uIGNvbXBsZXRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnSGFycnkuRGl4b24nLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdIYXJyeSBEaXhvbidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBtb2RhbCByZXR1cm4gYSByZXN1bHQgdGhhdCByZXNvbHZlcyB0byBhbiBpZGVudGl0eSBIYXJyeS5EaXhvbicuICBUaGlzXHJcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlcyB0aGUgYXNzaWduQXBwcm92YWwoKSBmdW5jdGlvbi5cclxuICAgICAgICAgICAgc3BNb2RhbC5vcGVuLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IGRlZmVycmVkLnByb21pc2VcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKHtcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdTb21lIFdvcmtncm91cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2dyb3VwOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXNzaWduZWU6IG51bGxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGN0cmwuc2hvd1dvcmtncm91cEFzc2lnbm1lbnREaWFsb2coKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJ1biBhIGRpZ2VzdCBjeWNsZSB0byByZXNvbHZlIHRoZSBwcm9taXNlLlxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgYXBwcm92YWwgaGFzIHRoZSBuZXcgYXNzaWduZWUuXHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbC5hc3NpZ25lZSkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnSGFycnkuRGl4b24nLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdIYXJyeSBEaXhvbidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCd0aHJvd3MgdHJ5aW5nIHRvIG9wZW4gZGlhbG9nIGlmIG93bmVyIGlzIG5vdCBhIHdvcmtncm91cCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKHtcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdIYXJyeSBEaXhvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2dyb3VwOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge2N0cmwuc2hvd1dvcmtncm91cEFzc2lnbm1lbnREaWFsb2coKTt9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0VW5pcXVpZmllcigpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQgKCdnZXRzIGEgdW5pcXVlIHN0cmluZyB3aXRoIHRoZSBpbmRleCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKHt9LCA0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0VW5pcXVpZmllcigpKS50b0VxdWFsKCdBcHByb3ZhbDQnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd2aWV3SWRlbnRpdHlSZXF1ZXN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2NhbGxzIG5hdmlnYXRpb24gc2VydmljZSB3aXRoIGNvcnJlY3QgcGFyYW1ldGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihuYXZpZ2F0aW9uU2VydmljZSwgJ2dvJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwudmlld0lkZW50aXR5UmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KG5hdmlnYXRpb25TZXJ2aWNlLmdvKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5nby5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5vdXRjb21lKS5cclxuICAgICAgICAgICAgICAgIHRvRXF1YWwoJ3ZpZXdBY2Nlc3NSZXF1ZXN0RGV0YWlsP2lkPScgKyBzY29wZS5hcHByb3ZhbC5hY2Nlc3NSZXF1ZXN0TmFtZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5nby5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5uYXZpZ2F0aW9uSGlzdG9yeSkuXHJcbiAgICAgICAgICAgICAgICB0b0VxdWFsKCd2aWV3Q29tbW9uV29ya0l0ZW0jL2NvbW1vbldvcmtJdGVtLycgKyBzY29wZS5hcHByb3ZhbC5nZXRJZCgpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
