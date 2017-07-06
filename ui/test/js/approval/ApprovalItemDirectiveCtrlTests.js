System.register(['test/js/TestInitializer', 'approval/ApprovalModule', 'test/js/TestModule'], function (_export) {

    /**
     * Tests for the ApprovalItemDirectiveCtrl.
     */
    'use strict';

    var approvalModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {
            describe('ApprovalItemDirectiveCtrl', function () {
                // This has a lot of tests in it ... and that's ok.
                // jshint maxstatements: 100
                var parentUniquifier = 'Approval0',
                    scope,
                    modal,
                    $controller,
                    $rootScope,
                    approvalService,
                    approvalCompletionService,
                    testService,
                    Approval,
                    ApprovalItem,
                    APPROVAL_ITEM_ROLE_COLUMN_CONFIG,
                    APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG,
                    roleColumns,
                    entitlementColumns,
                    ctrl,
                    approvalTestDataService;

                // Use the test module to get the testService.
                beforeEach(module(testModule));

                // Let the tests know we'll use the approval module.
                beforeEach(module(approvalModule));

                /**
                 * Setup the mocks for our tests - a scope and the controller.
                 */
                /* jshint maxparams: 10 */
                beforeEach(inject(function (_$rootScope_, _$controller_, _testService_, _approvalService_, _APPROVAL_ITEM_ROLE_COLUMN_CONFIG_, _APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG_, _ColumnConfig_, _Approval_, _ApprovalItem_, _approvalTestDataService_) {

                    // Save the services that we need to use.
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;
                    testService = _testService_;
                    approvalService = _approvalService_;
                    Approval = _Approval_;
                    ApprovalItem = _ApprovalItem_;
                    approvalTestDataService = _approvalTestDataService_;

                    // Create a mock approvalCompletionService that returns a promise for openCompletionDialog.
                    approvalCompletionService = {
                        openCompletionDialog: jasmine.createSpy().and.callFake(function () {
                            return testService.createResponsePromise();
                        })
                    };

                    // Create a mock scope.
                    scope = $rootScope.$new();

                    // Reset the modal.
                    modal = null;

                    APPROVAL_ITEM_ROLE_COLUMN_CONFIG = _APPROVAL_ITEM_ROLE_COLUMN_CONFIG_;
                    APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG = _APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG_;

                    roleColumns = [new _ColumnConfig_({
                        dataIndex: 'roleColumn1'
                    }), new _ColumnConfig_({
                        dataIndex: 'roleColumn2'
                    })];
                    entitlementColumns = [new _ColumnConfig_({
                        dataIndex: 'entitlementColumn1'
                    }), new _ColumnConfig_({
                        dataIndex: 'entitlementColumn1'
                    })];
                }));

                /**
                 * Create an ApprovalItemDirectiveCtrl with some optional overrides.
                 *
                 * @param {int} idx  The index of the item - 0 for a role request, 1 for an
                 *    entitlement request, and 2 for an account request.
                 * @param {Object} [itemOverrides]  Optional object containing properties
                 *    that will override the given item.
                 * @param {Boolean} [explode]  If true, the controller will fail on calls
                 *    to approve/reject/undo/etc...
                 */
                var createController = function (idx, itemOverrides, explode, listIndex) {
                    var approval = approvalTestDataService.createApproval(),
                        item = approval.approvalItems[idx];

                    // If overrides were specified, apply them.
                    if (itemOverrides) {
                        angular.extend(item, itemOverrides);
                    }

                    createControllerWithItem(item, approval, explode, listIndex);
                };

                /**
                 * Create an ApprovalItemDirectiveCtrl with the given approval item and approval.
                 */
                var createControllerWithItem = function (itemData, approvalData, explode, listIndex) {
                    var functionMock, approval, approvalItem, configService;

                    // Create a modal spy.
                    modal = {
                        open: jasmine.createSpy().and.callFake(function () {
                            // Open returns an object with a promise for the result property.
                            return {
                                result: testService.createResponsePromise()
                            };
                        })
                    };

                    // If approval data was given, pull the ApprovalItem out of the actual Approval object.
                    if (approvalData) {
                        approval = new Approval(approvalData);

                        if (itemData) {
                            approval.approvalItems.forEach(function (item) {
                                if (item.id === itemData.id) {
                                    approvalItem = item;
                                }
                            });
                        }
                    } else if (itemData) {
                        // If there was no approval data, just create an ApprovalItem.
                        approvalItem = new ApprovalItem(itemData);
                    }

                    // Put the required stuff into the scope.
                    scope = $rootScope.$new();
                    scope.approvalItem = approvalItem;
                    scope.approval = approval;
                    scope.completionCallback = jasmine.createSpy('completionCallback');
                    scope.index = listIndex;
                    scope.parentUniquifier = parentUniquifier;

                    /**
                     * For most tests, return that we have a number of items remaining
                     * so the completion dialog won't popup.
                     */
                    if (approval) {
                        approval.getRemainingCount = function () {
                            return 3;
                        };
                    }

                    // Create a function that will return a resolved or rejected promise.
                    functionMock = testService.createResponseFunction(explode);

                    // Override the approvalService with mock functions.
                    approvalService.complete = jasmine.createSpy().and.callFake(functionMock);
                    approvalService.approveItem = jasmine.createSpy().and.callFake(functionMock);
                    approvalService.rejectItem = jasmine.createSpy().and.callFake(functionMock);
                    approvalService.undoItem = jasmine.createSpy().and.callFake(functionMock);

                    // Mock out configService
                    configService = {
                        getColumnConfig: jasmine.createSpy().and.callFake(function (key) {
                            if (APPROVAL_ITEM_ROLE_COLUMN_CONFIG === key) {
                                return roleColumns;
                            } else if (APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG === key) {
                                return entitlementColumns;
                            }
                            throw 'Unknown column config for test - ' + key;
                        })
                    };

                    // Create the controller to test with.
                    ctrl = $controller('ApprovalItemDirectiveCtrl', {
                        $scope: scope,
                        spModal: modal,
                        approvalService: approvalService,
                        configService: configService,
                        approvalCompletionService: approvalCompletionService,
                        APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG: APPROVAL_ITEM_ENTITLEMENT_COLUMN_CONFIG,
                        APPROVAL_ITEM_ROLE_COLUMN_CONFIG: APPROVAL_ITEM_ROLE_COLUMN_CONFIG
                    });
                };

                it('pukes if no approval item is in scope', function () {
                    createControllerWithItem(null, approvalTestDataService.createApproval());
                    expect(ctrl.showDateColumn).toThrow();
                });

                it('hides date column with no sunrise/sunset', function () {
                    createController(2);
                    expect(ctrl.showDateColumn()).toEqual(false);
                });

                it('shows date column with sunrise', function () {
                    createController(1);
                    expect(ctrl.showDateColumn()).toEqual(true);
                });

                it('shows date column with sunset', function () {
                    createController(0);
                    expect(ctrl.showDateColumn()).toEqual(true);
                });

                it('shows date column with if item had sunrise/sunset', function () {
                    createController(3);
                    expect(ctrl.showDateColumn()).toEqual(true);
                });

                describe('getColumnConfigs()', function () {
                    it('return role columns for a role item', function () {
                        createController(0);
                        expect(ctrl.getColumnConfigs()).toEqual(roleColumns);
                    });

                    it('return entitlement columns for a entitlement item', function () {
                        createController(1);
                        expect(ctrl.getColumnConfigs()).toEqual(entitlementColumns);
                    });

                    it('throws if column configs were not properly loaded', function () {
                        createController(1);
                        entitlementColumns = null;
                        expect(function () {
                            ctrl.getColumnConfigs();
                        }).toThrow();
                    });
                });

                it('opens the approval item details dialog', function () {
                    var openArgs;

                    createController(1);

                    // Show the description.
                    ctrl.showItemDetails();

                    // Check that the modal was opened with the expected stuff.
                    expect(modal.open).toHaveBeenCalled();

                    openArgs = modal.open.calls.mostRecent().args[0];

                    expect(openArgs.title).toEqual('ui_my_approvals_item_detail_title');
                    expect(openArgs.controller).toEqual('ApprovalItemDetailDialogCtrl');
                    expect(openArgs.scope).toBe(scope);
                    expect(openArgs.scope.displayDescriptionTab).toBeUndefined();
                });

                describe('approve()', function () {
                    it('cries if an approval is not in scope', function () {
                        // Create an ApprovalItemDirectiveCtrl with an item but without an approval.
                        var item = approvalTestDataService.createApproval().approvalItems[0];
                        createControllerWithItem(item, null, false);
                        expect(function () {
                            ctrl.approve();
                        }).toThrow();
                    });

                    it('approves an item without a decision', function () {
                        // Create an ApprovalItemDirectiveCtrl without a decision.
                        createController(2);

                        // Approve it.  Check that the decision is immediately reflected.
                        ctrl.approve();
                        expect(scope.approvalItem.isApproved()).toEqual(true);

                        // Invoke $apply to cause the promise to be resolved.  Make sure
                        // the decision remains.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                    });

                    it('approves an item with a decision', function () {
                        // The first item starts out as rejected.
                        createController(0);

                        // Approve it.  Check that the decision is immediately reflected.
                        ctrl.approve();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                        expect(scope.approvalItem.isRejected()).toEqual(false);

                        // Invoke $apply to cause the promise to be resolved.  Make sure
                        // the decision remains.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                    });

                    it('does not change the decision if the approvalService fails', function () {
                        // Create a controller that will fail when calling the approvalService.
                        // The item starts with a rejected decision.
                        createController(0, null, true);

                        // Approve it - decision changes immediately
                        ctrl.approve();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                        expect(scope.approvalItem.isRejected()).toEqual(false);

                        // Invoke $apply to cause the promise to be resolved.  Since this
                        // fails, the decision should revert to what it was.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(false);
                        expect(scope.approvalItem.isRejected()).toEqual(true);
                    });

                    it('does nothing if the item is already approved', function () {
                        // The second item already approved.
                        createController(1);

                        // Approve it.
                        ctrl.approve();

                        // Ensure that the approvalService wasn't called.
                        expect(approvalService.approveItem).not.toHaveBeenCalled();
                    });

                    it('calls notifyObjectNotFoundException on 404', function () {
                        // Create an ApprovalItemDirectiveCtrl without a decision.
                        createController(2);

                        // Make approval fail with a 404.
                        testService.errorResponse.status = 404;
                        approvalService.approveItem = testService.createResponseFunction(true);

                        // Approve it.  Check that the decision is immediately reflected.
                        ctrl.approve();

                        // Invoke $apply to cause the promise to be resolved.
                        $rootScope.$apply();

                        expect(scope.completionCallback).toHaveBeenCalled();
                        expect(scope.completionCallback.calls.mostRecent().args[0].isSuccess()).toEqual(false);
                    });

                    it('shows the expired sunset dialog when appropriate', function () {
                        spyOn(approvalService, 'showExpiredSunsetDialog');

                        // override sunset expired on first item
                        createController(0, { sunsetExpired: true });
                        ctrl.approve();

                        expect(approvalService.showExpiredSunsetDialog).toHaveBeenCalledWith(false);
                    });
                });

                describe('reject()', function () {
                    it('cries if an approval is not in scope', function () {
                        // Create an ApprovalItemDirectiveCtrl with an item but without an approval.
                        var item = approvalTestDataService.createApproval().approvalItems[1];
                        createControllerWithItem(item, null, false);
                        expect(function () {
                            ctrl.reject();
                        }).toThrow();
                    });

                    it('rejects an item without a decision', function () {
                        // Create an ApprovalItemDirectiveCtrl without a decision.
                        createController(2);

                        // Reject it.  Check that the decision is immediately reflected.
                        ctrl.reject();
                        expect(scope.approvalItem.isRejected()).toEqual(true);

                        // Invoke $apply to cause the promise to be resolved.  Make sure
                        // the decision remains.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isRejected()).toEqual(true);
                    });

                    it('rejects an item with a decision', function () {
                        // The second item starts out as approved.
                        createController(1);

                        // Reject it.  Check that the decision is immediately reflected.
                        ctrl.reject();
                        expect(scope.approvalItem.isRejected()).toEqual(true);
                        expect(scope.approvalItem.isApproved()).toEqual(false);

                        // Invoke $apply to cause the promise to be resolved.  Make sure
                        // the decision remains.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isRejected()).toEqual(true);
                    });

                    it('does not change the decision if the approvalService fails', function () {
                        // Create a controller that will fail when calling the approvalService.
                        // The item starts with a approved decision.
                        createController(1, null, true);

                        // Reject it - decision changes immediately
                        ctrl.reject();
                        expect(scope.approvalItem.isRejected()).toEqual(true);
                        expect(scope.approvalItem.isApproved()).toEqual(false);

                        // Invoke $apply to cause the promise to be resolved.  Since this
                        // fails, the decision should revert to what it was.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                    });

                    it('does nothing if the item is already rejected', function () {
                        // The first item already rejected.
                        createController(0);

                        // Reject it.
                        ctrl.reject();

                        // Ensure that the approvalService wasn't called.
                        expect(approvalService.rejectItem).not.toHaveBeenCalled();
                    });

                    it('calls notifyObjectNotFoundException on 404', function () {
                        // Create an ApprovalItemDirectiveCtrl without a decision.
                        createController(2);

                        // Make rejecting fail with a 404.
                        testService.errorResponse.status = 404;
                        approvalService.rejectItem = testService.createResponseFunction(true);

                        // Reject it.  Check that the decision is immediately reflected.
                        ctrl.reject();

                        // Invoke $apply to cause the promise to be resolved.
                        $rootScope.$apply();

                        expect(scope.completionCallback).toHaveBeenCalled();
                        expect(scope.completionCallback.calls.mostRecent().args[0].isSuccess()).toEqual(false);
                    });
                });

                describe('undo()', function () {
                    it('cries if an approval is not in scope', function () {
                        // Create an ApprovalItemDirectiveCtrl with an item but without an approval.
                        var item = approvalTestDataService.createApproval().approvalItems[0];
                        createControllerWithItem(item, null, false);
                        expect(function () {
                            ctrl.undo();
                        }).toThrow();
                    });

                    it('undoes an item with a decision', function () {
                        // The second item starts out as approved.
                        createController(1);

                        // Undo it.  Check that the decision is immediately reflected.
                        ctrl.undo();
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                        expect(scope.approvalItem.isApproved()).toEqual(false);

                        // Invoke $apply to cause the promise to be resolved.  Make sure
                        // the decision remains.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                    });

                    it('does not change the decision if the approvalService fails', function () {
                        // Create a controller that will fail when calling the approvalService.
                        // The item starts with a approved decision.
                        createController(1, null, true);

                        // Undo it - decision changes immediately
                        ctrl.undo();
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                        expect(scope.approvalItem.isApproved()).toEqual(false);

                        // Invoke $apply to cause the promise to be resolved.  Since this
                        // fails, the decision should revert to what it was.
                        $rootScope.$apply();
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                    });

                    it('does nothing on an item without a decision', function () {
                        // The third item has no decision.
                        createController(2);

                        // Undo it.
                        ctrl.undo();

                        // Ensure that the approvalService wasn't called.
                        expect(approvalService.undoItem).not.toHaveBeenCalled();
                    });

                    it('calls notifyObjectNotFoundException on 404', function () {
                        // Create an ApprovalItemDirectiveCtrl with a decision.
                        createController(0);

                        // Make undo fail with a 404.
                        testService.errorResponse.status = 404;
                        approvalService.undoItem = testService.createResponseFunction(true);

                        // Undo it.  Check that the decision is immediately reflected.
                        ctrl.undo();

                        // Invoke $apply to cause the promise to be resolved.
                        $rootScope.$apply();

                        expect(scope.completionCallback).toHaveBeenCalled();
                        expect(scope.completionCallback.calls.mostRecent().args[0].isSuccess()).toEqual(false);
                    });
                });

                describe('completion', function () {

                    /**
                     * Set the remaining item count for the controller.
                     */
                    var setupRemainingCount = function (count) {
                        scope.approval.getRemainingCount = function () {
                            return count;
                        };
                    };

                    /**
                     * Most of these tests are going to be using the same controller, so
                     * go ahead and set one up.
                     */
                    beforeEach(function () {
                        // Create the controller with an item that doesn't have a decision.
                        createController(2);
                    });

                    it('does not popup the dialog if not approval is incomplete', function () {
                        // Fake like there are more items remaining than there really are.
                        setupRemainingCount(2);

                        // Approve the item and make sure the modal wasn't displayed.
                        ctrl.approve();
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                        expect(approvalCompletionService.openCompletionDialog).not.toHaveBeenCalled();
                    });

                    it('does not popup the dialog if undoing the last decision', function () {
                        // Fake like there are more items remaining than there really are.
                        setupRemainingCount(2);

                        // Approve the item and make sure the modal wasn't displayed.
                        ctrl.approve();
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                        expect(approvalCompletionService.openCompletionDialog).not.toHaveBeenCalled();

                        // Now tell the controller that all decisions are done and undo the
                        // decision.
                        setupRemainingCount(0);
                        ctrl.undo();
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(false);
                        expect(scope.approvalItem.isRejected()).toEqual(false);
                        expect(approvalCompletionService.openCompletionDialog).not.toHaveBeenCalled();
                    });

                    it('pops up the dialog if making the last decision', function () {
                        var args;

                        // Tell the controller that this is the last decision.
                        setupRemainingCount(0);

                        // Approve the item and make sure the modal was displayed.
                        ctrl.approve();
                        $rootScope.$apply();
                        expect(scope.approvalItem.isApproved()).toEqual(true);
                        expect(approvalCompletionService.openCompletionDialog).toHaveBeenCalled();

                        args = approvalCompletionService.openCompletionDialog.calls.mostRecent().args;
                        expect(args[0]).toEqual(scope);
                        expect(args[1]).toEqual(scope.approval);
                    });
                });

                describe('open comment dialog', function () {
                    var commentService;
                    beforeEach(inject(function (approvalCommentService) {
                        commentService = approvalCommentService;
                        spyOn(commentService, 'openCommentDialog');
                        createController(2);
                    }));

                    it('should call the service method', function () {
                        ctrl.showApprovalItemComments();
                        expect(commentService.openCommentDialog).toHaveBeenCalled();
                    });
                });

                describe('open sunrise edit dialog', function () {

                    it('should open the dialog', function () {
                        var modalArgs;
                        createController(0);
                        ctrl.showSunriseSunsetDialog();
                        expect(modal.open).toHaveBeenCalled();
                        modalArgs = modal.open.calls.mostRecent().args[0];
                        expect(modalArgs.keyboard).toBeFalsy();
                        expect(modalArgs.backdrop).toEqual('static');
                        expect(modalArgs.resolve.sunriseDate().getTime()).toEqual(1391618385380);
                        expect(modalArgs.resolve.sunsetDate().getTime()).toEqual(1392223185380);
                    });
                });

                describe('getUniquifier()', function () {
                    it('gets a unique string with the index', function () {
                        createController(0, {}, false, 4);
                        expect(ctrl.getUniquifier()).toEqual(parentUniquifier + 'Item4');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0FwcHJvdmFsSXRlbURpcmVjdGl2ZUN0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHVCQUF1QixVQUFVLFNBQVM7Ozs7O0lBSzdHOztJQUVBLElBQUksZ0JBQWdCO0lBQ3BCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7WUFQN0IsU0FBUyw2QkFBNkIsWUFBVzs7O2dCQUc3QyxJQUFJLG1CQUFtQjtvQkFDbkI7b0JBQU87b0JBQU87b0JBQWE7b0JBQVk7b0JBQ3ZDO29CQUEyQjtvQkFBYTtvQkFBVTtvQkFDbEQ7b0JBQWtDO29CQUNsQztvQkFBYTtvQkFBb0I7b0JBQU07OztnQkFJM0MsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTzs7Ozs7O2dCQU1sQixXQUFXLE9BQU8sVUFBUyxjQUFjLGVBQWUsZUFBZSxtQkFDNUMsb0NBQW9DLDJDQUNwQyxnQkFBZ0IsWUFBWSxnQkFBZ0IsMkJBQTJCOzs7b0JBRzlGLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixjQUFjO29CQUNkLGtCQUFrQjtvQkFDbEIsV0FBVztvQkFDWCxlQUFlO29CQUNmLDBCQUEwQjs7O29CQUcxQiw0QkFBNEI7d0JBQ3hCLHNCQUFzQixRQUFRLFlBQVksSUFBSSxTQUFTLFlBQVc7NEJBQzlELE9BQU8sWUFBWTs7Ozs7b0JBSzNCLFFBQVEsV0FBVzs7O29CQUduQixRQUFROztvQkFFUixtQ0FBbUM7b0JBQ25DLDBDQUEwQzs7b0JBRTFDLGNBQWMsQ0FDVixJQUFJLGVBQWU7d0JBQ2YsV0FBVzt3QkFDWixJQUFJLGVBQWU7d0JBQ2xCLFdBQVc7O29CQUduQixxQkFBcUIsQ0FDakIsSUFBSSxlQUFlO3dCQUNmLFdBQVc7d0JB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Ozt3QkFHcEIsS0FBSzt3QkFDTCxXQUFXO3dCQUNYLE9BQU8sTUFBTSxhQUFhLGNBQWMsUUFBUTt3QkFDaEQsT0FBTywwQkFBMEIsc0JBQXNCOzt3QkFFdkQsT0FBTywwQkFBMEIscUJBQXFCLE1BQU0sYUFBYTt3QkFDekUsT0FBTyxLQUFLLElBQUksUUFBUTt3QkFDeEIsT0FBTyxLQUFLLElBQUksUUFBUSxNQUFNOzs7O2dCQUl0QyxTQUFTLHVCQUF1QixZQUFXO29CQUN2QyxJQUFJO29CQUNKLFdBQVcsT0FBTyxVQUFTLHdCQUF3Qjt3QkFDL0MsaUJBQWlCO3dCQUNqQixNQUFNLGdCQUFnQjt3QkFDdEIsaUJBQWlCOzs7b0JBR3JCLEdBQUcsa0NBQWtDLFlBQVc7d0JBQzVDLEtBQUs7d0JBQ0wsT0FBTyxlQUFlLG1CQUFtQjs7OztnQkFJakQsU0FBUyw0QkFBNEIsWUFBVzs7b0JBRTVDLEdBQUcsMEJBQTBCLFlBQVc7d0JBQ3BDLElBQUk7d0JBQ0osaUJBQWlCO3dCQUNqQixLQUFLO3dCQUNMLE9BQU8sTUFBTSxNQUFNO3dCQUNuQixZQUFZLE1BQU0sS0FBSyxNQUFNLGFBQWEsS0FBSzt3QkFDL0MsT0FBTyxVQUFVLFVBQVU7d0JBQzNCLE9BQU8sVUFBVSxVQUFVLFFBQVE7d0JBQ25DLE9BQU8sVUFBVSxRQUFRLGNBQWMsV0FBVyxRQUFRO3dCQUMxRCxPQUFPLFVBQVUsUUFBUSxhQUFhLFdBQVcsUUFBUTs7OztnQkFJakUsU0FBUyxtQkFBbUIsWUFBVztvQkFDbkMsR0FBSSx1Q0FBdUMsWUFBVzt3QkFDbEQsaUJBQWlCLEdBQUcsSUFBSSxPQUFPO3dCQUMvQixPQUFPLEtBQUssaUJBQWlCLFFBQVEsbUJBQW1COzs7Ozs7R0FtQmpFIiwiZmlsZSI6ImFwcHJvdmFsL0FwcHJvdmFsSXRlbURpcmVjdGl2ZUN0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgYXBwcm92YWxNb2R1bGUgZnJvbSAnYXBwcm92YWwvQXBwcm92YWxNb2R1bGUnO1xyXG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGZvciB0aGUgQXBwcm92YWxJdGVtRGlyZWN0aXZlQ3RybC5cclxuICovXHJcbmRlc2NyaWJlKCdBcHByb3ZhbEl0ZW1EaXJlY3RpdmVDdHJsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBUaGlzIGhhcyBhIGxvdCBvZiB0ZXN0cyBpbiBpdCAuLi4gYW5kIHRoYXQncyBvay5cclxuICAgIC8vIGpzaGludCBtYXhzdGF0ZW1lbnRzOiAxMDBcclxuICAgIHZhciBwYXJlbnRVbmlxdWlmaWVyID0gJ0FwcHJvdmFsMCcsXHJcbiAgICAgICAgc2NvcGUsIG1vZGFsLCAkY29udHJvbGxlciwgJHJvb3RTY29wZSwgYXBwcm92YWxTZXJ2aWNlLFxyXG4gICAgICAgIGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2UsIHRlc3RTZXJ2aWNlLCBBcHByb3ZhbCwgQXBwcm92YWxJdGVtLFxyXG4gICAgICAgIEFQUFJPVkFMX0lURU1fUk9MRV9DT0xVTU5fQ09ORklHLCBBUFBST1ZBTF9JVEVNX0VOVElUTEVNRU5UX0NPTFVNTl9DT05GSUcsXHJcbiAgICAgICAgcm9sZUNvbHVtbnMsIGVudGl0bGVtZW50Q29sdW1ucywgY3RybCwgYXBwcm92YWxUZXN0RGF0YVNlcnZpY2U7XHJcblxyXG5cclxuICAgIC8vIFVzZSB0aGUgdGVzdCBtb2R1bGUgdG8gZ2V0IHRoZSB0ZXN0U2VydmljZS5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUpKTtcclxuXHJcbiAgICAvLyBMZXQgdGhlIHRlc3RzIGtub3cgd2UnbGwgdXNlIHRoZSBhcHByb3ZhbCBtb2R1bGUuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhcHByb3ZhbE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgdGhlIG1vY2tzIGZvciBvdXIgdGVzdHMgLSBhIHNjb3BlIGFuZCB0aGUgY29udHJvbGxlci5cclxuICAgICAqL1xyXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTAgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgXyRjb250cm9sbGVyXywgX3Rlc3RTZXJ2aWNlXywgX2FwcHJvdmFsU2VydmljZV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQVBQUk9WQUxfSVRFTV9ST0xFX0NPTFVNTl9DT05GSUdfLCBfQVBQUk9WQUxfSVRFTV9FTlRJVExFTUVOVF9DT0xVTU5fQ09ORklHXyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9Db2x1bW5Db25maWdfLCBfQXBwcm92YWxfLCBfQXBwcm92YWxJdGVtXywgX2FwcHJvdmFsVGVzdERhdGFTZXJ2aWNlXykge1xyXG5cclxuICAgICAgICAvLyBTYXZlIHRoZSBzZXJ2aWNlcyB0aGF0IHdlIG5lZWQgdG8gdXNlLlxyXG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcclxuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xyXG4gICAgICAgIHRlc3RTZXJ2aWNlID0gX3Rlc3RTZXJ2aWNlXztcclxuICAgICAgICBhcHByb3ZhbFNlcnZpY2UgPSBfYXBwcm92YWxTZXJ2aWNlXztcclxuICAgICAgICBBcHByb3ZhbCA9IF9BcHByb3ZhbF87XHJcbiAgICAgICAgQXBwcm92YWxJdGVtID0gX0FwcHJvdmFsSXRlbV87XHJcbiAgICAgICAgYXBwcm92YWxUZXN0RGF0YVNlcnZpY2UgPSBfYXBwcm92YWxUZXN0RGF0YVNlcnZpY2VfO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBtb2NrIGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2UgdGhhdCByZXR1cm5zIGEgcHJvbWlzZSBmb3Igb3BlbkNvbXBsZXRpb25EaWFsb2cuXHJcbiAgICAgICAgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZSA9IHtcclxuICAgICAgICAgICAgb3BlbkNvbXBsZXRpb25EaWFsb2c6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlc3RTZXJ2aWNlLmNyZWF0ZVJlc3BvbnNlUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIG1vY2sgc2NvcGUuXHJcbiAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuXHJcbiAgICAgICAgLy8gUmVzZXQgdGhlIG1vZGFsLlxyXG4gICAgICAgIG1vZGFsID0gbnVsbDtcclxuXHJcbiAgICAgICAgQVBQUk9WQUxfSVRFTV9ST0xFX0NPTFVNTl9DT05GSUcgPSBfQVBQUk9WQUxfSVRFTV9ST0xFX0NPTFVNTl9DT05GSUdfO1xyXG4gICAgICAgIEFQUFJPVkFMX0lURU1fRU5USVRMRU1FTlRfQ09MVU1OX0NPTkZJRyA9IF9BUFBST1ZBTF9JVEVNX0VOVElUTEVNRU5UX0NPTFVNTl9DT05GSUdfO1xyXG5cclxuICAgICAgICByb2xlQ29sdW1ucyA9IFtcclxuICAgICAgICAgICAgbmV3IF9Db2x1bW5Db25maWdfKHtcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ3JvbGVDb2x1bW4xJ1xyXG4gICAgICAgICAgICB9KSxuZXcgX0NvbHVtbkNvbmZpZ18oe1xyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAncm9sZUNvbHVtbjInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgICAgICBlbnRpdGxlbWVudENvbHVtbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBfQ29sdW1uQ29uZmlnXyh7XHJcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdlbnRpdGxlbWVudENvbHVtbjEnXHJcbiAgICAgICAgICAgIH0pLG5ldyBfQ29sdW1uQ29uZmlnXyh7XHJcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdlbnRpdGxlbWVudENvbHVtbjEnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXTtcclxuICAgIH0pKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhbiBBcHByb3ZhbEl0ZW1EaXJlY3RpdmVDdHJsIHdpdGggc29tZSBvcHRpb25hbCBvdmVycmlkZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtpbnR9IGlkeCAgVGhlIGluZGV4IG9mIHRoZSBpdGVtIC0gMCBmb3IgYSByb2xlIHJlcXVlc3QsIDEgZm9yIGFuXHJcbiAgICAgKiAgICBlbnRpdGxlbWVudCByZXF1ZXN0LCBhbmQgMiBmb3IgYW4gYWNjb3VudCByZXF1ZXN0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtpdGVtT3ZlcnJpZGVzXSAgT3B0aW9uYWwgb2JqZWN0IGNvbnRhaW5pbmcgcHJvcGVydGllc1xyXG4gICAgICogICAgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBnaXZlbiBpdGVtLlxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZXhwbG9kZV0gIElmIHRydWUsIHRoZSBjb250cm9sbGVyIHdpbGwgZmFpbCBvbiBjYWxsc1xyXG4gICAgICogICAgdG8gYXBwcm92ZS9yZWplY3QvdW5kby9ldGMuLi5cclxuICAgICAqL1xyXG4gICAgdmFyIGNyZWF0ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbihpZHgsIGl0ZW1PdmVycmlkZXMsIGV4cGxvZGUsIGxpc3RJbmRleCkge1xyXG4gICAgICAgIHZhciBhcHByb3ZhbCA9IGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLmNyZWF0ZUFwcHJvdmFsKCksXHJcbiAgICAgICAgICAgIGl0ZW0gPSBhcHByb3ZhbC5hcHByb3ZhbEl0ZW1zW2lkeF07XHJcblxyXG4gICAgICAgIC8vIElmIG92ZXJyaWRlcyB3ZXJlIHNwZWNpZmllZCwgYXBwbHkgdGhlbS5cclxuICAgICAgICBpZiAoaXRlbU92ZXJyaWRlcykge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChpdGVtLCBpdGVtT3ZlcnJpZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2xsZXJXaXRoSXRlbShpdGVtLCBhcHByb3ZhbCwgZXhwbG9kZSwgbGlzdEluZGV4KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYW4gQXBwcm92YWxJdGVtRGlyZWN0aXZlQ3RybCB3aXRoIHRoZSBnaXZlbiBhcHByb3ZhbCBpdGVtIGFuZCBhcHByb3ZhbC5cclxuICAgICAqL1xyXG4gICAgdmFyIGNyZWF0ZUNvbnRyb2xsZXJXaXRoSXRlbSA9IGZ1bmN0aW9uKGl0ZW1EYXRhLCBhcHByb3ZhbERhdGEsIGV4cGxvZGUsIGxpc3RJbmRleCkge1xyXG4gICAgICAgIHZhciBmdW5jdGlvbk1vY2ssIGFwcHJvdmFsLCBhcHByb3ZhbEl0ZW0sIGNvbmZpZ1NlcnZpY2U7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIG1vZGFsIHNweS5cclxuICAgICAgICBtb2RhbCA9IHtcclxuICAgICAgICAgICAgb3BlbjogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPcGVuIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBwcm9taXNlIGZvciB0aGUgcmVzdWx0IHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHRlc3RTZXJ2aWNlLmNyZWF0ZVJlc3BvbnNlUHJvbWlzZSgpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIElmIGFwcHJvdmFsIGRhdGEgd2FzIGdpdmVuLCBwdWxsIHRoZSBBcHByb3ZhbEl0ZW0gb3V0IG9mIHRoZSBhY3R1YWwgQXBwcm92YWwgb2JqZWN0LlxyXG4gICAgICAgIGlmIChhcHByb3ZhbERhdGEpIHtcclxuICAgICAgICAgICAgYXBwcm92YWwgPSBuZXcgQXBwcm92YWwoYXBwcm92YWxEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgYXBwcm92YWwuYXBwcm92YWxJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gaXRlbURhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwcm92YWxJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpdGVtRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXMgbm8gYXBwcm92YWwgZGF0YSwganVzdCBjcmVhdGUgYW4gQXBwcm92YWxJdGVtLlxyXG4gICAgICAgICAgICBhcHByb3ZhbEl0ZW0gPSBuZXcgQXBwcm92YWxJdGVtKGl0ZW1EYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFB1dCB0aGUgcmVxdWlyZWQgc3R1ZmYgaW50byB0aGUgc2NvcGUuXHJcbiAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICBzY29wZS5hcHByb3ZhbEl0ZW0gPSBhcHByb3ZhbEl0ZW07XHJcbiAgICAgICAgc2NvcGUuYXBwcm92YWwgPSBhcHByb3ZhbDtcclxuICAgICAgICBzY29wZS5jb21wbGV0aW9uQ2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY29tcGxldGlvbkNhbGxiYWNrJyk7XHJcbiAgICAgICAgc2NvcGUuaW5kZXggPSBsaXN0SW5kZXg7XHJcbiAgICAgICAgc2NvcGUucGFyZW50VW5pcXVpZmllciA9IHBhcmVudFVuaXF1aWZpZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBtb3N0IHRlc3RzLCByZXR1cm4gdGhhdCB3ZSBoYXZlIGEgbnVtYmVyIG9mIGl0ZW1zIHJlbWFpbmluZ1xyXG4gICAgICAgICAqIHNvIHRoZSBjb21wbGV0aW9uIGRpYWxvZyB3b24ndCBwb3B1cC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoYXBwcm92YWwpIHtcclxuICAgICAgICAgICAgYXBwcm92YWwuZ2V0UmVtYWluaW5nQ291bnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHJldHVybiBhIHJlc29sdmVkIG9yIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICAgICAgZnVuY3Rpb25Nb2NrID0gdGVzdFNlcnZpY2UuY3JlYXRlUmVzcG9uc2VGdW5jdGlvbihleHBsb2RlKTtcclxuXHJcbiAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGFwcHJvdmFsU2VydmljZSB3aXRoIG1vY2sgZnVuY3Rpb25zLlxyXG4gICAgICAgIGFwcHJvdmFsU2VydmljZS5jb21wbGV0ZSA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uTW9jayk7XHJcbiAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmFwcHJvdmVJdGVtID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb25Nb2NrKTtcclxuICAgICAgICBhcHByb3ZhbFNlcnZpY2UucmVqZWN0SXRlbSA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uTW9jayk7XHJcbiAgICAgICAgYXBwcm92YWxTZXJ2aWNlLnVuZG9JdGVtID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb25Nb2NrKTtcclxuXHJcbiAgICAgICAgLy8gTW9jayBvdXQgY29uZmlnU2VydmljZVxyXG4gICAgICAgIGNvbmZpZ1NlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIGdldENvbHVtbkNvbmZpZzogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQVBQUk9WQUxfSVRFTV9ST0xFX0NPTFVNTl9DT05GSUcgPT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb2xlQ29sdW1ucztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKEFQUFJPVkFMX0lURU1fRU5USVRMRU1FTlRfQ09MVU1OX0NPTkZJRyA9PT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudGl0bGVtZW50Q29sdW1ucztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdVbmtub3duIGNvbHVtbiBjb25maWcgZm9yIHRlc3QgLSAnICsga2V5O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgY29udHJvbGxlciB0byB0ZXN0IHdpdGguXHJcbiAgICAgICAgY3RybCA9ICRjb250cm9sbGVyKCdBcHByb3ZhbEl0ZW1EaXJlY3RpdmVDdHJsJywge1xyXG4gICAgICAgICAgICAkc2NvcGU6IHNjb3BlLFxyXG4gICAgICAgICAgICBzcE1vZGFsOiBtb2RhbCxcclxuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlOiBhcHByb3ZhbFNlcnZpY2UsXHJcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2U6IGNvbmZpZ1NlcnZpY2UsXHJcbiAgICAgICAgICAgIGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2U6IGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2UsXHJcbiAgICAgICAgICAgIEFQUFJPVkFMX0lURU1fRU5USVRMRU1FTlRfQ09MVU1OX0NPTkZJRzogQVBQUk9WQUxfSVRFTV9FTlRJVExFTUVOVF9DT0xVTU5fQ09ORklHLFxyXG4gICAgICAgICAgICBBUFBST1ZBTF9JVEVNX1JPTEVfQ09MVU1OX0NPTkZJRzogQVBQUk9WQUxfSVRFTV9ST0xFX0NPTFVNTl9DT05GSUdcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGl0KCdwdWtlcyBpZiBubyBhcHByb3ZhbCBpdGVtIGlzIGluIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY3JlYXRlQ29udHJvbGxlcldpdGhJdGVtKG51bGwsIGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLmNyZWF0ZUFwcHJvdmFsKCkpO1xyXG4gICAgICAgIGV4cGVjdChjdHJsLnNob3dEYXRlQ29sdW1uKS50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaGlkZXMgZGF0ZSBjb2x1bW4gd2l0aCBubyBzdW5yaXNlL3N1bnNldCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMik7XHJcbiAgICAgICAgZXhwZWN0KGN0cmwuc2hvd0RhdGVDb2x1bW4oKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvd3MgZGF0ZSBjb2x1bW4gd2l0aCBzdW5yaXNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY3JlYXRlQ29udHJvbGxlcigxKTtcclxuICAgICAgICBleHBlY3QoY3RybC5zaG93RGF0ZUNvbHVtbigpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3dzIGRhdGUgY29sdW1uIHdpdGggc3Vuc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY3JlYXRlQ29udHJvbGxlcigwKTtcclxuICAgICAgICBleHBlY3QoY3RybC5zaG93RGF0ZUNvbHVtbigpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3dzIGRhdGUgY29sdW1uIHdpdGggaWYgaXRlbSBoYWQgc3VucmlzZS9zdW5zZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjcmVhdGVDb250cm9sbGVyKDMpO1xyXG4gICAgICAgIGV4cGVjdChjdHJsLnNob3dEYXRlQ29sdW1uKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0Q29sdW1uQ29uZmlncygpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybiByb2xlIGNvbHVtbnMgZm9yIGEgcm9sZSBpdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldENvbHVtbkNvbmZpZ3MoKSkudG9FcXVhbChyb2xlQ29sdW1ucyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm4gZW50aXRsZW1lbnQgY29sdW1ucyBmb3IgYSBlbnRpdGxlbWVudCBpdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldENvbHVtbkNvbmZpZ3MoKSkudG9FcXVhbChlbnRpdGxlbWVudENvbHVtbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndGhyb3dzIGlmIGNvbHVtbiBjb25maWdzIHdlcmUgbm90IHByb3Blcmx5IGxvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDEpO1xyXG4gICAgICAgICAgICBlbnRpdGxlbWVudENvbHVtbnMgPSBudWxsO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7Y3RybC5nZXRDb2x1bW5Db25maWdzKCk7fSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ29wZW5zIHRoZSBhcHByb3ZhbCBpdGVtIGRldGFpbHMgZGlhbG9nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9wZW5BcmdzO1xyXG5cclxuICAgICAgICBjcmVhdGVDb250cm9sbGVyKDEpO1xyXG5cclxuICAgICAgICAvLyBTaG93IHRoZSBkZXNjcmlwdGlvbi5cclxuICAgICAgICBjdHJsLnNob3dJdGVtRGV0YWlscygpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBtb2RhbCB3YXMgb3BlbmVkIHdpdGggdGhlIGV4cGVjdGVkIHN0dWZmLlxyXG4gICAgICAgIGV4cGVjdChtb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIG9wZW5BcmdzID0gbW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuXHJcbiAgICAgICAgZXhwZWN0KG9wZW5BcmdzLnRpdGxlKS50b0VxdWFsKCd1aV9teV9hcHByb3ZhbHNfaXRlbV9kZXRhaWxfdGl0bGUnKTtcclxuICAgICAgICBleHBlY3Qob3BlbkFyZ3MuY29udHJvbGxlcikudG9FcXVhbCgnQXBwcm92YWxJdGVtRGV0YWlsRGlhbG9nQ3RybCcpO1xyXG4gICAgICAgIGV4cGVjdChvcGVuQXJncy5zY29wZSkudG9CZShzY29wZSk7XHJcbiAgICAgICAgZXhwZWN0KG9wZW5BcmdzLnNjb3BlLmRpc3BsYXlEZXNjcmlwdGlvblRhYikudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKCdhcHByb3ZlKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnY3JpZXMgaWYgYW4gYXBwcm92YWwgaXMgbm90IGluIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhbiBBcHByb3ZhbEl0ZW1EaXJlY3RpdmVDdHJsIHdpdGggYW4gaXRlbSBidXQgd2l0aG91dCBhbiBhcHByb3ZhbC5cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBhcHByb3ZhbFRlc3REYXRhU2VydmljZS5jcmVhdGVBcHByb3ZhbCgpLmFwcHJvdmFsSXRlbXNbMF07XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXJXaXRoSXRlbShpdGVtLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgY3RybC5hcHByb3ZlKCk7IH0pLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2FwcHJvdmVzIGFuIGl0ZW0gd2l0aG91dCBhIGRlY2lzaW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhbiBBcHByb3ZhbEl0ZW1EaXJlY3RpdmVDdHJsIHdpdGhvdXQgYSBkZWNpc2lvbi5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFwcHJvdmUgaXQuICBDaGVjayB0aGF0IHRoZSBkZWNpc2lvbiBpcyBpbW1lZGlhdGVseSByZWZsZWN0ZWQuXHJcbiAgICAgICAgICAgIGN0cmwuYXBwcm92ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludm9rZSAkYXBwbHkgdG8gY2F1c2UgdGhlIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQuICBNYWtlIHN1cmVcclxuICAgICAgICAgICAgLy8gdGhlIGRlY2lzaW9uIHJlbWFpbnMuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNBcHByb3ZlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnYXBwcm92ZXMgYW4gaXRlbSB3aXRoIGEgZGVjaXNpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gVGhlIGZpcnN0IGl0ZW0gc3RhcnRzIG91dCBhcyByZWplY3RlZC5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFwcHJvdmUgaXQuICBDaGVjayB0aGF0IHRoZSBkZWNpc2lvbiBpcyBpbW1lZGlhdGVseSByZWZsZWN0ZWQuXHJcbiAgICAgICAgICAgIGN0cmwuYXBwcm92ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc1JlamVjdGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52b2tlICRhcHBseSB0byBjYXVzZSB0aGUgcHJvbWlzZSB0byBiZSByZXNvbHZlZC4gIE1ha2Ugc3VyZVxyXG4gICAgICAgICAgICAvLyB0aGUgZGVjaXNpb24gcmVtYWlucy5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc0FwcHJvdmVkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBjaGFuZ2UgdGhlIGRlY2lzaW9uIGlmIHRoZSBhcHByb3ZhbFNlcnZpY2UgZmFpbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgY29udHJvbGxlciB0aGF0IHdpbGwgZmFpbCB3aGVuIGNhbGxpbmcgdGhlIGFwcHJvdmFsU2VydmljZS5cclxuICAgICAgICAgICAgLy8gVGhlIGl0ZW0gc3RhcnRzIHdpdGggYSByZWplY3RlZCBkZWNpc2lvbi5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigwLCBudWxsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFwcHJvdmUgaXQgLSBkZWNpc2lvbiBjaGFuZ2VzIGltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIGN0cmwuYXBwcm92ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc1JlamVjdGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52b2tlICRhcHBseSB0byBjYXVzZSB0aGUgcHJvbWlzZSB0byBiZSByZXNvbHZlZC4gIFNpbmNlIHRoaXNcclxuICAgICAgICAgICAgLy8gZmFpbHMsIHRoZSBkZWNpc2lvbiBzaG91bGQgcmV2ZXJ0IHRvIHdoYXQgaXQgd2FzLlxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZSBpdGVtIGlzIGFscmVhZHkgYXBwcm92ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gVGhlIHNlY29uZCBpdGVtIGFscmVhZHkgYXBwcm92ZWQuXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBcHByb3ZlIGl0LlxyXG4gICAgICAgICAgICBjdHJsLmFwcHJvdmUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHByb3ZhbFNlcnZpY2Ugd2Fzbid0IGNhbGxlZC5cclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsU2VydmljZS5hcHByb3ZlSXRlbSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIG5vdGlmeU9iamVjdE5vdEZvdW5kRXhjZXB0aW9uIG9uIDQwNCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYW4gQXBwcm92YWxJdGVtRGlyZWN0aXZlQ3RybCB3aXRob3V0IGEgZGVjaXNpb24uXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMik7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIGFwcHJvdmFsIGZhaWwgd2l0aCBhIDQwNC5cclxuICAgICAgICAgICAgdGVzdFNlcnZpY2UuZXJyb3JSZXNwb25zZS5zdGF0dXMgPSA0MDQ7XHJcbiAgICAgICAgICAgIGFwcHJvdmFsU2VydmljZS5hcHByb3ZlSXRlbSA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVJlc3BvbnNlRnVuY3Rpb24odHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBcHByb3ZlIGl0LiAgQ2hlY2sgdGhhdCB0aGUgZGVjaXNpb24gaXMgaW1tZWRpYXRlbHkgcmVmbGVjdGVkLlxyXG4gICAgICAgICAgICBjdHJsLmFwcHJvdmUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludm9rZSAkYXBwbHkgdG8gY2F1c2UgdGhlIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuY29tcGxldGlvbkNhbGxiYWNrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5jb21wbGV0aW9uQ2FsbGJhY2suY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uaXNTdWNjZXNzKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgdGhlIGV4cGlyZWQgc3Vuc2V0IGRpYWxvZyB3aGVuIGFwcHJvcHJpYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihhcHByb3ZhbFNlcnZpY2UsICdzaG93RXhwaXJlZFN1bnNldERpYWxvZycpO1xyXG5cclxuICAgICAgICAgICAgLy8gb3ZlcnJpZGUgc3Vuc2V0IGV4cGlyZWQgb24gZmlyc3QgaXRlbVxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDAsIHsgc3Vuc2V0RXhwaXJlZDogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgY3RybC5hcHByb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoYXBwcm92YWxTZXJ2aWNlLnNob3dFeHBpcmVkU3Vuc2V0RGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZGVzY3JpYmUoJ3JlamVjdCgpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2NyaWVzIGlmIGFuIGFwcHJvdmFsIGlzIG5vdCBpbiBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYW4gQXBwcm92YWxJdGVtRGlyZWN0aXZlQ3RybCB3aXRoIGFuIGl0ZW0gYnV0IHdpdGhvdXQgYW4gYXBwcm92YWwuXHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gYXBwcm92YWxUZXN0RGF0YVNlcnZpY2UuY3JlYXRlQXBwcm92YWwoKS5hcHByb3ZhbEl0ZW1zWzFdO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyV2l0aEl0ZW0oaXRlbSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGN0cmwucmVqZWN0KCk7IH0pLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlamVjdHMgYW4gaXRlbSB3aXRob3V0IGEgZGVjaXNpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIEFwcHJvdmFsSXRlbURpcmVjdGl2ZUN0cmwgd2l0aG91dCBhIGRlY2lzaW9uLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDIpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVqZWN0IGl0LiAgQ2hlY2sgdGhhdCB0aGUgZGVjaXNpb24gaXMgaW1tZWRpYXRlbHkgcmVmbGVjdGVkLlxyXG4gICAgICAgICAgICBjdHJsLnJlamVjdCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzUmVqZWN0ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludm9rZSAkYXBwbHkgdG8gY2F1c2UgdGhlIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQuICBNYWtlIHN1cmVcclxuICAgICAgICAgICAgLy8gdGhlIGRlY2lzaW9uIHJlbWFpbnMuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVqZWN0cyBhbiBpdGVtIHdpdGggYSBkZWNpc2lvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBUaGUgc2Vjb25kIGl0ZW0gc3RhcnRzIG91dCBhcyBhcHByb3ZlZC5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlamVjdCBpdC4gIENoZWNrIHRoYXQgdGhlIGRlY2lzaW9uIGlzIGltbWVkaWF0ZWx5IHJlZmxlY3RlZC5cclxuICAgICAgICAgICAgY3RybC5yZWplY3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc1JlamVjdGVkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNBcHByb3ZlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludm9rZSAkYXBwbHkgdG8gY2F1c2UgdGhlIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQuICBNYWtlIHN1cmVcclxuICAgICAgICAgICAgLy8gdGhlIGRlY2lzaW9uIHJlbWFpbnMuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgY2hhbmdlIHRoZSBkZWNpc2lvbiBpZiB0aGUgYXBwcm92YWxTZXJ2aWNlIGZhaWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIGNvbnRyb2xsZXIgdGhhdCB3aWxsIGZhaWwgd2hlbiBjYWxsaW5nIHRoZSBhcHByb3ZhbFNlcnZpY2UuXHJcbiAgICAgICAgICAgIC8vIFRoZSBpdGVtIHN0YXJ0cyB3aXRoIGEgYXBwcm92ZWQgZGVjaXNpb24uXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMSwgbnVsbCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZWplY3QgaXQgLSBkZWNpc2lvbiBjaGFuZ2VzIGltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIGN0cmwucmVqZWN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbnZva2UgJGFwcGx5IHRvIGNhdXNlIHRoZSBwcm9taXNlIHRvIGJlIHJlc29sdmVkLiAgU2luY2UgdGhpc1xyXG4gICAgICAgICAgICAvLyBmYWlscywgdGhlIGRlY2lzaW9uIHNob3VsZCByZXZlcnQgdG8gd2hhdCBpdCB3YXMuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc0FwcHJvdmVkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgdGhlIGl0ZW0gaXMgYWxyZWFkeSByZWplY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBUaGUgZmlyc3QgaXRlbSBhbHJlYWR5IHJlamVjdGVkLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDApO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVqZWN0IGl0LlxyXG4gICAgICAgICAgICBjdHJsLnJlamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIGFwcHJvdmFsU2VydmljZSB3YXNuJ3QgY2FsbGVkLlxyXG4gICAgICAgICAgICBleHBlY3QoYXBwcm92YWxTZXJ2aWNlLnJlamVjdEl0ZW0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyBub3RpZnlPYmplY3ROb3RGb3VuZEV4Y2VwdGlvbiBvbiA0MDQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIEFwcHJvdmFsSXRlbURpcmVjdGl2ZUN0cmwgd2l0aG91dCBhIGRlY2lzaW9uLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDIpO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSByZWplY3RpbmcgZmFpbCB3aXRoIGEgNDA0LlxyXG4gICAgICAgICAgICB0ZXN0U2VydmljZS5lcnJvclJlc3BvbnNlLnN0YXR1cyA9IDQwNDtcclxuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLnJlamVjdEl0ZW0gPSB0ZXN0U2VydmljZS5jcmVhdGVSZXNwb25zZUZ1bmN0aW9uKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVqZWN0IGl0LiAgQ2hlY2sgdGhhdCB0aGUgZGVjaXNpb24gaXMgaW1tZWRpYXRlbHkgcmVmbGVjdGVkLlxyXG4gICAgICAgICAgICBjdHJsLnJlamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52b2tlICRhcHBseSB0byBjYXVzZSB0aGUgcHJvbWlzZSB0byBiZSByZXNvbHZlZC5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5jb21wbGV0aW9uQ2FsbGJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmNvbXBsZXRpb25DYWxsYmFjay5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5pc1N1Y2Nlc3MoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZGVzY3JpYmUoJ3VuZG8oKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdjcmllcyBpZiBhbiBhcHByb3ZhbCBpcyBub3QgaW4gc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIEFwcHJvdmFsSXRlbURpcmVjdGl2ZUN0cmwgd2l0aCBhbiBpdGVtIGJ1dCB3aXRob3V0IGFuIGFwcHJvdmFsLlxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLmNyZWF0ZUFwcHJvdmFsKCkuYXBwcm92YWxJdGVtc1swXTtcclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcldpdGhJdGVtKGl0ZW0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjdHJsLnVuZG8oKTsgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndW5kb2VzIGFuIGl0ZW0gd2l0aCBhIGRlY2lzaW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSBzZWNvbmQgaXRlbSBzdGFydHMgb3V0IGFzIGFwcHJvdmVkLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDEpO1xyXG5cclxuICAgICAgICAgICAgLy8gVW5kbyBpdC4gIENoZWNrIHRoYXQgdGhlIGRlY2lzaW9uIGlzIGltbWVkaWF0ZWx5IHJlZmxlY3RlZC5cclxuICAgICAgICAgICAgY3RybC51bmRvKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc0FwcHJvdmVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52b2tlICRhcHBseSB0byBjYXVzZSB0aGUgcHJvbWlzZSB0byBiZSByZXNvbHZlZC4gIE1ha2Ugc3VyZVxyXG4gICAgICAgICAgICAvLyB0aGUgZGVjaXNpb24gcmVtYWlucy5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc1JlamVjdGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzUmVqZWN0ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBjaGFuZ2UgdGhlIGRlY2lzaW9uIGlmIHRoZSBhcHByb3ZhbFNlcnZpY2UgZmFpbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgY29udHJvbGxlciB0aGF0IHdpbGwgZmFpbCB3aGVuIGNhbGxpbmcgdGhlIGFwcHJvdmFsU2VydmljZS5cclxuICAgICAgICAgICAgLy8gVGhlIGl0ZW0gc3RhcnRzIHdpdGggYSBhcHByb3ZlZCBkZWNpc2lvbi5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigxLCBudWxsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVuZG8gaXQgLSBkZWNpc2lvbiBjaGFuZ2VzIGltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIGN0cmwudW5kbygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzUmVqZWN0ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNBcHByb3ZlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludm9rZSAkYXBwbHkgdG8gY2F1c2UgdGhlIHByb21pc2UgdG8gYmUgcmVzb2x2ZWQuICBTaW5jZSB0aGlzXHJcbiAgICAgICAgICAgIC8vIGZhaWxzLCB0aGUgZGVjaXNpb24gc2hvdWxkIHJldmVydCB0byB3aGF0IGl0IHdhcy5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmFwcHJvdmFsSXRlbS5pc1JlamVjdGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90aGluZyBvbiBhbiBpdGVtIHdpdGhvdXQgYSBkZWNpc2lvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBUaGUgdGhpcmQgaXRlbSBoYXMgbm8gZGVjaXNpb24uXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMik7XHJcblxyXG4gICAgICAgICAgICAvLyBVbmRvIGl0LlxyXG4gICAgICAgICAgICBjdHJsLnVuZG8oKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHByb3ZhbFNlcnZpY2Ugd2Fzbid0IGNhbGxlZC5cclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsU2VydmljZS51bmRvSXRlbSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIG5vdGlmeU9iamVjdE5vdEZvdW5kRXhjZXB0aW9uIG9uIDQwNCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYW4gQXBwcm92YWxJdGVtRGlyZWN0aXZlQ3RybCB3aXRoIGEgZGVjaXNpb24uXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHVuZG8gZmFpbCB3aXRoIGEgNDA0LlxyXG4gICAgICAgICAgICB0ZXN0U2VydmljZS5lcnJvclJlc3BvbnNlLnN0YXR1cyA9IDQwNDtcclxuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLnVuZG9JdGVtID0gdGVzdFNlcnZpY2UuY3JlYXRlUmVzcG9uc2VGdW5jdGlvbih0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVuZG8gaXQuICBDaGVjayB0aGF0IHRoZSBkZWNpc2lvbiBpcyBpbW1lZGlhdGVseSByZWZsZWN0ZWQuXHJcbiAgICAgICAgICAgIGN0cmwudW5kbygpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52b2tlICRhcHBseSB0byBjYXVzZSB0aGUgcHJvbWlzZSB0byBiZSByZXNvbHZlZC5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5jb21wbGV0aW9uQ2FsbGJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmNvbXBsZXRpb25DYWxsYmFjay5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5pc1N1Y2Nlc3MoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbXBsZXRpb24nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHRoZSByZW1haW5pbmcgaXRlbSBjb3VudCBmb3IgdGhlIGNvbnRyb2xsZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHNldHVwUmVtYWluaW5nQ291bnQgPSBmdW5jdGlvbihjb3VudCkge1xyXG4gICAgICAgICAgICBzY29wZS5hcHByb3ZhbC5nZXRSZW1haW5pbmdDb3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1vc3Qgb2YgdGhlc2UgdGVzdHMgYXJlIGdvaW5nIHRvIGJlIHVzaW5nIHRoZSBzYW1lIGNvbnRyb2xsZXIsIHNvXHJcbiAgICAgICAgICogZ28gYWhlYWQgYW5kIHNldCBvbmUgdXAuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb250cm9sbGVyIHdpdGggYW4gaXRlbSB0aGF0IGRvZXNuJ3QgaGF2ZSBhIGRlY2lzaW9uLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgcG9wdXAgdGhlIGRpYWxvZyBpZiBub3QgYXBwcm92YWwgaXMgaW5jb21wbGV0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBGYWtlIGxpa2UgdGhlcmUgYXJlIG1vcmUgaXRlbXMgcmVtYWluaW5nIHRoYW4gdGhlcmUgcmVhbGx5IGFyZS5cclxuICAgICAgICAgICAgc2V0dXBSZW1haW5pbmdDb3VudCgyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFwcHJvdmUgdGhlIGl0ZW0gYW5kIG1ha2Ugc3VyZSB0aGUgbW9kYWwgd2Fzbid0IGRpc3BsYXllZC5cclxuICAgICAgICAgICAgY3RybC5hcHByb3ZlKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNBcHByb3ZlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXBwcm92YWxDb21wbGV0aW9uU2VydmljZS5vcGVuQ29tcGxldGlvbkRpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHBvcHVwIHRoZSBkaWFsb2cgaWYgdW5kb2luZyB0aGUgbGFzdCBkZWNpc2lvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBGYWtlIGxpa2UgdGhlcmUgYXJlIG1vcmUgaXRlbXMgcmVtYWluaW5nIHRoYW4gdGhlcmUgcmVhbGx5IGFyZS5cclxuICAgICAgICAgICAgc2V0dXBSZW1haW5pbmdDb3VudCgyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFwcHJvdmUgdGhlIGl0ZW0gYW5kIG1ha2Ugc3VyZSB0aGUgbW9kYWwgd2Fzbid0IGRpc3BsYXllZC5cclxuICAgICAgICAgICAgY3RybC5hcHByb3ZlKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNBcHByb3ZlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXBwcm92YWxDb21wbGV0aW9uU2VydmljZS5vcGVuQ29tcGxldGlvbkRpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5vdyB0ZWxsIHRoZSBjb250cm9sbGVyIHRoYXQgYWxsIGRlY2lzaW9ucyBhcmUgZG9uZSBhbmQgdW5kbyB0aGVcclxuICAgICAgICAgICAgLy8gZGVjaXNpb24uXHJcbiAgICAgICAgICAgIHNldHVwUmVtYWluaW5nQ291bnQoMCk7XHJcbiAgICAgICAgICAgIGN0cmwudW5kbygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5hcHByb3ZhbEl0ZW0uaXNSZWplY3RlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2Uub3BlbkNvbXBsZXRpb25EaWFsb2cpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdwb3BzIHVwIHRoZSBkaWFsb2cgaWYgbWFraW5nIHRoZSBsYXN0IGRlY2lzaW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzO1xyXG5cclxuICAgICAgICAgICAgLy8gVGVsbCB0aGUgY29udHJvbGxlciB0aGF0IHRoaXMgaXMgdGhlIGxhc3QgZGVjaXNpb24uXHJcbiAgICAgICAgICAgIHNldHVwUmVtYWluaW5nQ291bnQoMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBBcHByb3ZlIHRoZSBpdGVtIGFuZCBtYWtlIHN1cmUgdGhlIG1vZGFsIHdhcyBkaXNwbGF5ZWQuXHJcbiAgICAgICAgICAgIGN0cmwuYXBwcm92ZSgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuYXBwcm92YWxJdGVtLmlzQXBwcm92ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2Uub3BlbkNvbXBsZXRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIGFyZ3MgPSBhcHByb3ZhbENvbXBsZXRpb25TZXJ2aWNlLm9wZW5Db21wbGV0aW9uRGlhbG9nLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJnc1swXSkudG9FcXVhbChzY29wZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhcmdzWzFdKS50b0VxdWFsKHNjb3BlLmFwcHJvdmFsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdvcGVuIGNvbW1lbnQgZGlhbG9nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRTZXJ2aWNlO1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKGFwcHJvdmFsQ29tbWVudFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgY29tbWVudFNlcnZpY2UgPSBhcHByb3ZhbENvbW1lbnRTZXJ2aWNlO1xyXG4gICAgICAgICAgICBzcHlPbihjb21tZW50U2VydmljZSwgJ29wZW5Db21tZW50RGlhbG9nJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMik7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIHNlcnZpY2UgbWV0aG9kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuc2hvd0FwcHJvdmFsSXRlbUNvbW1lbnRzKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb21tZW50U2VydmljZS5vcGVuQ29tbWVudERpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ29wZW4gc3VucmlzZSBlZGl0IGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gdGhlIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxBcmdzO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKDApO1xyXG4gICAgICAgICAgICBjdHJsLnNob3dTdW5yaXNlU3Vuc2V0RGlhbG9nKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIG1vZGFsQXJncyA9IG1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XHJcbiAgICAgICAgICAgIGV4cGVjdChtb2RhbEFyZ3Mua2V5Ym9hcmQpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgICAgICBleHBlY3QobW9kYWxBcmdzLmJhY2tkcm9wKS50b0VxdWFsKCdzdGF0aWMnKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1vZGFsQXJncy5yZXNvbHZlLnN1bnJpc2VEYXRlKCkuZ2V0VGltZSgpKS50b0VxdWFsKDEzOTE2MTgzODUzODApO1xyXG4gICAgICAgICAgICBleHBlY3QobW9kYWxBcmdzLnJlc29sdmUuc3Vuc2V0RGF0ZSgpLmdldFRpbWUoKSkudG9FcXVhbCgxMzkyMjIzMTg1MzgwKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdnZXRVbmlxdWlmaWVyKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCAoJ2dldHMgYSB1bmlxdWUgc3RyaW5nIHdpdGggdGhlIGluZGV4JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoMCwge30sIGZhbHNlLCA0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0VW5pcXVpZmllcigpKS50b0VxdWFsKHBhcmVudFVuaXF1aWZpZXIgKyAnSXRlbTQnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
