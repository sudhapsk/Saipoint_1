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

            /**
             * Tests for the AccessRequestReviewCtrl.
             */
            describe('AccessRequestReviewCtrl', function () {

                var $controller,
                    accessRequestDataService,
                    accessRequestReviewService,
                    accessRequestAccountSelectionService,
                    configServiceMock,
                    testService,
                    ctrl,
                    item1,
                    item2,
                    requestedItem1,
                    requestedItem2,
                    identity,
                    $rootScope,
                    notificationService,
                    configService,
                    accessRequestDeepFilterService,
                    navigationService,
                    location,
                    promiseTrackerService,
                    goodResp,
                    goodRespMultiple,
                    badResp,
                    partialResp,
                    workItemResp,
                    policyViolationResp,
                    isMobile = false,
                    formWorkItemResp,
                    accessRequestTestData,
                    workItemService = {
                    navigateToWorkItemPage: jasmine.createSpy('navigateToWorkItemPage'),
                    openWorkItemDialog: angular.noop
                },
                    gotPolicyViolations = {
                    status: 200,
                    data: {
                        objects: [{
                            policyName: 'SOD Policy',
                            description: 'Accounts Receivable and Accounts Payable should not be combined.',
                            ruleName: 'Accounting SOD-762',
                            workitemId: '2c908cd54ba92fde014bbdbeacbf04d2'
                        }]
                    }
                };

                // Let the tests know we'll use the access request module.
                beforeEach(module(testModule, accessRequestModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 18 */
                beforeEach(inject(function (_accessRequestDataService_, AccessRequestItem, RequestedAccessItem, Identity, _$rootScope_, _spNotificationService_, _$controller_, _testService_, _accessRequestReviewService_, _accessRequestAccountSelectionService_, _configService_, SP_CONFIG_SERVICE, _accessRequestDeepFilterService_, _navigationService_, $location, _promiseTrackerService_, SubmitResultItem, _accessRequestTestData_) {

                    // Save the services.
                    accessRequestDataService = _accessRequestDataService_;
                    accessRequestReviewService = _accessRequestReviewService_;
                    accessRequestAccountSelectionService = _accessRequestAccountSelectionService_;
                    accessRequestDeepFilterService = _accessRequestDeepFilterService_;
                    testService = _testService_;
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;
                    notificationService = _spNotificationService_;
                    configService = _configService_;
                    navigationService = _navigationService_;
                    location = $location;
                    promiseTrackerService = _promiseTrackerService_;
                    accessRequestTestData = _accessRequestTestData_;

                    // Mock out the config service
                    configServiceMock = {
                        getColumnConfigEntries: testService.createPromiseSpy(false, {
                            status: 200,
                            data: {}
                        }, {}),
                        getConfigValue: configService.getConfigValue,
                        isMobile: function () {
                            return isMobile;
                        }
                    };

                    // Create some identities and items to test with.
                    identity = new Identity(accessRequestTestData.IDENTITY1);
                    item1 = new AccessRequestItem(accessRequestTestData.ROLE);
                    item2 = new AccessRequestItem(accessRequestTestData.ENTITLEMENT);
                    requestedItem1 = new RequestedAccessItem(item1);
                    requestedItem2 = new RequestedAccessItem(item2);
                    requestedItem2.permittedById = item1.getId();

                    spyOn($rootScope, '$broadcast').and.callThrough();

                    // Spy on navigationService.go() and do nothing since 'home' isn't defined.
                    spyOn(navigationService, 'go').and.returnValue(null);

                    // Spy on the promise tracker, but call through so it does stuff
                    spyOn(promiseTrackerService, 'track').and.callThrough();

                    // Create the controller to test with.
                    ctrl = createController();

                    SailPoint.configData = {};
                    SailPoint.configData[SP_CONFIG_SERVICE.ACCESS_REQUEST_ALLOW_PRIORITY_EDITING] = true;

                    goodResp = [new SubmitResultItem({
                        workflowStatus: 'executing',
                        identityRequestId: '1234'
                    })];

                    goodRespMultiple = [new SubmitResultItem({
                        workflowStatus: 'executing',
                        identityRequestId: '1234'
                    }), new SubmitResultItem({
                        workflowStatus: 'executing',
                        identityRequestId: '3456'
                    })];

                    badResp = [new SubmitResultItem({
                        workflowStatus: 'failed',
                        messages: [{
                            messageOrKey: 'ui_access_request_submitted_requests_failed_with_violation',
                            status: 'ERROR'
                        }]
                    })];

                    partialResp = [new SubmitResultItem({
                        workflowStatus: 'failed'
                    }), new SubmitResultItem({
                        workflowStatus: 'executing'
                    })];

                    workItemResp = [new SubmitResultItem({
                        allowViolations: false,
                        approvalItems: [{
                            approvalItemId: 'aee9fecab0bb43598a254a87cf495233',
                            requestItemId: '12345134513451234'
                        }],
                        identityRequestId: '9',
                        workflowStatus: 'approving',
                        workflowWorkItemId: '2c908cb84e6e5250014e6e6c98250059',
                        workflowWorkItemType: 'ManualAction'
                    })];

                    formWorkItemResp = [new SubmitResultItem({
                        allowViolations: false,
                        approvalItems: [{
                            approvalItemId: 'b43598a254a87cf495233',
                            requestItemId: '3451234'
                        }],
                        identityRequestId: '9',
                        workflowStatus: 'approving',
                        workflowWorkItemId: '250014e6e6c98250059',
                        workflowWorkItemType: 'Form'
                    })];

                    policyViolationResp = [new SubmitResultItem({
                        workflowStatus: 'approving',
                        workflowWorkItemType: 'ViolationReview',
                        workflowWorkItemId: '2c908cd54ba92fde014bbdbeacbf04d2',
                        approvalItems: [{
                            requestItemId: '1',
                            approvalItemId: 'approvalItemId1'
                        }]
                    })];

                    $rootScope.$apply();
                }));

                function createController() {
                    return $controller('AccessRequestReviewCtrl', {
                        accessRequestDataService: accessRequestDataService,
                        configService: configServiceMock,
                        workItemService: workItemService
                    });
                }

                describe('added access request items', function () {

                    var doRemove = true,
                        permittedItemMap;

                    /**
                     * Inject the dependencies and setup mocks.
                     */
                    beforeEach(inject(function () {
                        // Mock out the data service.
                        spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([requestedItem1, requestedItem2]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'getTopLevelRequestedItems').and.returnValue([requestedItem1]);

                        permittedItemMap = {
                            '1': [requestedItem2],
                            '2': []
                        };

                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedPermittedItems').and.callFake(function (requestedItem) {
                            return permittedItemMap[requestedItem.getUniqueId()];
                        });

                        spyOn(accessRequestDataService.getAccessRequest(), 'removeRequestedItem').and.callFake(function () {
                            return doRemove;
                        });
                        spyOn(ctrl, 'addRemovedItemMessage').and.callThrough();
                    }));

                    it('getRequestedItems() returns the added access items', function () {
                        var items = ctrl.getRequestedItems();
                        expect(accessRequestDataService.getAccessRequest().getRequestedItems).toHaveBeenCalled();
                        expect(items.length).toEqual(2);
                        expect(items.indexOf(requestedItem1)).toBeGreaterThan(-1);
                        expect(items.indexOf(requestedItem2)).toBeGreaterThan(-1);
                    });

                    it('getTopLevelRequestedItems() returns the top level added access items', function () {
                        var items = ctrl.getTopLevelRequestedItems();
                        expect(accessRequestDataService.getAccessRequest().getTopLevelRequestedItems).toHaveBeenCalled();
                        expect(items.length).toEqual(1);
                        expect(items.indexOf(requestedItem1)).toBeGreaterThan(-1);
                        expect(items.indexOf(requestedItem2)).not.toBeGreaterThan(-1);
                    });

                    it('getRequestedPermittedItems() returns the permitted roles for the given item', function () {
                        var permittedItems = ctrl.getRequestedPermittedItems(requestedItem1);
                        expect(accessRequestDataService.getAccessRequest().getRequestedPermittedItems).toHaveBeenCalledWith(requestedItem1);
                        expect(permittedItems.length).toEqual(1);
                        expect(permittedItems.indexOf(requestedItem1)).not.toBeGreaterThan(-1);
                        expect(permittedItems.indexOf(requestedItem2)).toBeGreaterThan(-1);
                        permittedItems = ctrl.getRequestedPermittedItems(requestedItem2);
                        expect(accessRequestDataService.getAccessRequest().getRequestedPermittedItems).toHaveBeenCalledWith(requestedItem2);
                        expect(permittedItems.length).toEqual(0);
                    });

                    it('removeRequestedItem() removes the added access items', function () {
                        ctrl.removeRequestedItem(requestedItem1);
                        expect(accessRequestDataService.getAccessRequest().removeRequestedItem).toHaveBeenCalledWith(item1);
                        expect(ctrl.addRemovedItemMessage).toHaveBeenCalledWith(item1);
                        expect(ctrl.screenReaderMessages.length).toEqual(1);
                    });

                    it('removeRequestedItem() does not add screen reader message if item not removed', function () {
                        doRemove = false;
                        ctrl.removeRequestedItem(requestedItem1);
                        expect(ctrl.addRemovedItemMessage).not.toHaveBeenCalled();
                    });
                });

                it('tracks which roles have expanded permits', function () {
                    expect(ctrl.isShowPermittedRoles(requestedItem1)).toBeTruthy();
                    ctrl.toggleShowPermittedRoles(requestedItem1);
                    expect(ctrl.isShowPermittedRoles(requestedItem1)).toBeFalsy();
                    ctrl.toggleShowPermittedRoles(requestedItem1);
                    expect(ctrl.isShowPermittedRoles(requestedItem1)).toBeTruthy();
                    expect(ctrl.isShowPermittedRoles(requestedItem2)).toBeTruthy();
                });

                describe('hasRequestedItems', function () {
                    it('should return false if has no add access requests', function () {
                        var hasAccessRequests;
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([]);
                        hasAccessRequests = ctrl.hasRequestedItems();
                        expect(hasAccessRequests).toBeFalsy();
                    });
                    it('should return true if has an add access requests', function () {
                        var hasAccessRequests;
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue(['foo']);
                        hasAccessRequests = ctrl.hasRequestedItems();
                        expect(hasAccessRequests).toBeTruthy();
                    });
                    it('should return true if has multiple add access requests', function () {
                        var hasAccessRequests;
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue(['foo', 'bar']);
                        hasAccessRequests = ctrl.hasRequestedItems();
                        expect(hasAccessRequests).toBeTruthy();
                    });
                });

                describe('removed current access items', function () {

                    var doRemove = true;

                    /**
                     * Inject the dependencies and setup mocks.
                     */
                    beforeEach(inject(function (CurrentAccessItem, Identity) {
                        // Mock out the data service.
                        spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRemovedCurrentAccessItems').and.returnValue([item1, item2]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'removeRemovedCurrentAccessItem').and.callFake(function () {
                            return doRemove;
                        });
                        spyOn(ctrl, 'addRemovedItemMessage').and.callThrough();
                    }));

                    it('getRemovedCurrentAccessItems() returns the removed access items', function () {
                        var items = ctrl.getRemovedCurrentAccessItems();
                        expect(accessRequestDataService.getAccessRequest().getRemovedCurrentAccessItems).toHaveBeenCalled();
                        expect(items.length).toEqual(2);
                        expect(items.indexOf(item1)).toBeGreaterThan(-1);
                        expect(items.indexOf(item2)).toBeGreaterThan(-1);
                    });

                    it('removeRemovedCurrentAccessItem() removes the access items', function () {
                        ctrl.removeRemovedCurrentAccessItem(item1);
                        expect(accessRequestDataService.getAccessRequest().removeRemovedCurrentAccessItem).toHaveBeenCalledWith(item1);
                        expect(ctrl.addRemovedItemMessage).toHaveBeenCalledWith(item1);
                        expect(ctrl.screenReaderMessages.length).toEqual(1);
                    });

                    it('removeRemovedCurrentAccessItem() does not add screen reader message if item not removed', function () {
                        doRemove = false;
                        ctrl.removeRemovedCurrentAccessItem(item1);
                        expect(ctrl.addRemovedItemMessage).not.toHaveBeenCalled();
                    });
                });

                describe('hasRemovedCurrentAccessItems', function () {
                    it('should return false if has no remove access requests', function () {
                        var hasAccessRequests;
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRemovedCurrentAccessItems').and.returnValue([]);
                        hasAccessRequests = ctrl.hasRemovedCurrentAccessItems();
                        expect(hasAccessRequests).toBeFalsy();
                    });
                    it('should return true if has a remove access request', function () {
                        var hasAccessRequests;
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRemovedCurrentAccessItems').and.returnValue(['foo']);
                        hasAccessRequests = ctrl.hasRemovedCurrentAccessItems();
                        expect(hasAccessRequests).toBeTruthy();
                    });
                    it('should return true if has multiple remove access requests', function () {
                        var hasAccessRequests;
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRemovedCurrentAccessItems').and.returnValue(['foo', 'bar']);
                        hasAccessRequests = ctrl.hasRemovedCurrentAccessItems();
                        expect(hasAccessRequests).toBeTruthy();
                    });
                });

                describe('cancelAccessRequest', function () {
                    var spModal, $q, doCancel;

                    beforeEach(inject(function (_spModal_, _$q_) {
                        $q = _$q_;
                        spModal = _spModal_;
                        doCancel = false;

                        spyOn(spModal, 'open').and.callFake(function () {
                            var deferred = $q.defer();
                            if (doCancel) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }

                            return {
                                result: deferred.promise
                            };
                        });
                    }));

                    it('should open modal', function () {
                        ctrl.cancelAccessRequest();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should go to home and complete the flow if modal is accepted', function () {
                        var config;

                        // Set up the test to accept the cancel dialog.
                        doCancel = true;
                        ctrl.cancelAccessRequest();
                        $rootScope.$digest();
                        expect(navigationService.go).toHaveBeenCalled();
                        config = navigationService.go.calls.mostRecent().args[0];
                        expect(config).not.toBeNull();
                        expect(config.outcome).toEqual('viewHome');
                        expect(config.state).toEqual('home');
                        expect(config.stateParams).toEqual({ completeFlow: 'accessRequest' });
                    });

                    it('should not go to home if modal is rejected', function () {
                        ctrl.cancelAccessRequest();
                        $rootScope.$digest();
                        expect(navigationService.go).not.toHaveBeenCalled();
                    });

                    it('should create dialog with appropriate configs', function () {
                        ctrl.cancelAccessRequest();
                        expect(spModal.open.calls.mostRecent().args[0].content).toEqual('ui_access_cancel_request_dialog_text');

                        ctrl.policyViolations.push('foo');

                        ctrl.cancelAccessRequest();
                        expect(spModal.open.calls.mostRecent().args[0].content).toEqual('ui_access_cancel_request_dialog_violations_text');

                        // Not sure how we can really test the action function other than if it's there or not.
                        expect(spModal.open.calls.mostRecent().args[0].buttons[1].action).toBeTruthy();
                    });
                });

                describe('submitWithViolations', function () {
                    var $q;
                    beforeEach(inject(function (_$q_) {
                        $q = _$q_;
                        accessRequestReviewService.submitWithViolations = jasmine.createSpy();
                    }));

                    it('should call through to accessRequestReviewService.submitWithViolations', function () {
                        accessRequestReviewService.submitWithViolations.and.returnValue($q.defer().promise);
                        ctrl.submitWithViolations();
                        $rootScope.$apply();
                        expect(accessRequestReviewService.submitWithViolations).toHaveBeenCalled();
                    });

                    describe('with required comment', function () {
                        var violationService, initialRequireComment;

                        beforeEach(inject(function (_violationService_) {
                            violationService = _violationService_;
                            initialRequireComment = ctrl.requireViolationComment;
                        }));

                        afterEach(function () {
                            ctrl.requireViolationComment = initialRequireComment;
                        });

                        it('should prompt with comment dialog if required', function () {
                            violationService.showCommentDialog = jasmine.createSpy().and.returnValue($q.defer().promise);
                            ctrl.requireViolationComment = true;

                            ctrl.submitWithViolations();
                            $rootScope.$apply();
                            expect(violationService.showCommentDialog).toHaveBeenCalled();
                        });

                        it('should call through to accessRequestReviewService.submitWithViolations with comment', function () {
                            var comment = 'test comment';
                            violationService.showCommentDialog = jasmine.createSpy().and.returnValue($q.when(comment));
                            accessRequestReviewService.submitWithViolations.and.returnValue($q.defer().promise);
                            ctrl.requireViolationComment = true;

                            ctrl.submitWithViolations();
                            $rootScope.$apply();
                            expect(accessRequestReviewService.submitWithViolations).toHaveBeenCalled();
                            expect(accessRequestReviewService.submitWithViolations.calls.mostRecent().args[1]).toBe(comment);
                        });
                    });
                });

                describe('submit', function () {
                    var submitDeferred, resubmitDeferred;

                    beforeEach(inject(function ($q) {
                        submitDeferred = $q.defer();
                        resubmitDeferred = $q.defer();

                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            return submitDeferred.promise;
                        });

                        spyOn(accessRequestReviewService, 'resolveViolations').and.callFake(function () {
                            return resubmitDeferred.promise;
                        });

                        spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([requestedItem1, requestedItem2]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItemById').and.callFake(function (itemId) {
                            if ('1' === itemId) {
                                return requestedItem1;
                            }
                            if ('2' === itemId) {
                                return requestedItem2;
                            }
                            throw 'Unhandled item ID: ' + itemId;
                        });
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRemovedCurrentAccessItems').and.returnValue([item2]);
                    }));

                    it('clears itemsMissingAccountSelections', function () {
                        ctrl.itemsMissingAccountSelections = ['one fish', 'two fish'];
                        ctrl.submit();
                        expect(ctrl.itemsMissingAccountSelections).toEqual([]);
                    });

                    it('should call review service submitAccessRequestItems', function () {
                        ctrl.submit();

                        expect(accessRequestReviewService.submitAccessRequestItems).toHaveBeenCalledWith([identity], [requestedItem1, requestedItem2], [item2], null);
                    });

                    it('should call review service with priority submitAccessRequestItems', function () {
                        ctrl.setPriority('Low');
                        ctrl.submit();

                        expect(accessRequestReviewService.submitAccessRequestItems).toHaveBeenCalledWith([identity], [requestedItem1, requestedItem2], [item2], 'Low');
                    });

                    it('should add tracked promise', function () {
                        expect(promiseTrackerService.track).not.toHaveBeenCalled();
                        ctrl.submit();
                        expect(promiseTrackerService.track).toHaveBeenCalled();
                        expect(promiseTrackerService.isInProgress()).toBe(true);
                    });

                    it('should call resolveViolations if has policy violations', function () {
                        spyOn(ctrl, 'hasPolicyViolations').and.returnValue(true);
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(accessRequestReviewService.resolveViolations).toHaveBeenCalled();
                        expect(accessRequestReviewService.resolveViolations.calls.mostRecent().args[1]).toEqual([]);
                    });

                    describe('with missing account selections', function () {

                        beforeEach(inject(function (RESPONSE_ERROR_TYPE) {
                            var responseData = {
                                status: 400,
                                data: {
                                    items: {
                                        '1': [accessRequestTestData.IDENTITY_ACCT_SELECTION1],
                                        '2': [accessRequestTestData.IDENTITY_ACCT_SELECTION2]
                                    },
                                    type: RESPONSE_ERROR_TYPE.MISSINGACCOUNTSELECTIONS
                                }
                            };

                            // Make the submission fail.
                            submitDeferred.reject(responseData);
                        }));

                        it('sets isSubmitting to false', function () {
                            expect(promiseTrackerService.track).not.toHaveBeenCalled();
                            ctrl.submit();
                            $rootScope.$apply();
                            expect(promiseTrackerService.track).toHaveBeenCalled();
                            expect(promiseTrackerService.isInProgress()).toBe(false);
                        });

                        it('adds missing account selections to RequestedAccessItem', inject(function (IdentityAccountSelection) {
                            var sel1 = accessRequestTestData.IDENTITY_ACCT_SELECTION1,
                                sel2 = accessRequestTestData.IDENTITY_ACCT_SELECTION2;

                            spyOn(IdentityAccountSelection, 'mergeAccountSelections').and.callThrough();

                            // Make item1 start with a selection and item2 not have any.  The selections
                            // returned in the response should get merged with what is already there.
                            requestedItem1.accountSelections = [new IdentityAccountSelection(sel2)];
                            requestedItem2.accountSelections = [];

                            // Submit.
                            ctrl.submit();
                            $rootScope.$apply();

                            // Verify that the account selections got updated on the items.
                            expect(requestedItem1.accountSelections.length).toEqual(2);
                            expect(requestedItem1.accountSelections[0].getIdentityId()).toEqual(sel2.identityId);
                            expect(requestedItem1.accountSelections[1].getIdentityId()).toEqual(sel1.identityId);

                            expect(requestedItem2.accountSelections.length).toEqual(1);
                            expect(requestedItem2.accountSelections[0].getIdentityId()).toEqual(sel2.identityId);

                            expect(IdentityAccountSelection.mergeAccountSelections).toHaveBeenCalled();
                        }));

                        it('sets itemsMissingAccountSelections', function () {
                            var item1Name = requestedItem1.item.getDisplayableName(),
                                item2Name = requestedItem2.item.getDisplayableName();

                            ctrl.submit();
                            $rootScope.$apply();

                            expect(ctrl.itemsMissingAccountSelections.length).toEqual(2);
                            expect(ctrl.itemsMissingAccountSelections.indexOf(item1Name > -1)).toBeTruthy();
                            expect(ctrl.itemsMissingAccountSelections.indexOf(item2Name > -1)).toBeTruthy();
                        });
                    });

                    describe('with items already assigned', function () {
                        beforeEach(inject(function (RESPONSE_ERROR_TYPE) {
                            var responseData = {
                                status: 400,
                                data: {
                                    items: ['item1', 'item2'],
                                    type: RESPONSE_ERROR_TYPE.DUPLICATEASSIGNMENT
                                }
                            };

                            // Make the submission fail.
                            submitDeferred.reject(responseData);
                        }));

                        it('sets isSubmitting to false', function () {
                            expect(promiseTrackerService.track).not.toHaveBeenCalled();
                            ctrl.submit();
                            expect(promiseTrackerService.track).toHaveBeenCalled();
                            expect(promiseTrackerService.isInProgress()).toBe(true);
                            $rootScope.$apply();
                            expect(promiseTrackerService.isInProgress()).toBe(false);
                        });

                        it('sets itemsAlreadyAssigned', function () {
                            ctrl.submit();
                            $rootScope.$apply();

                            expect(ctrl.itemsAlreadyAssigned.length).toEqual(2);
                            expect(ctrl.itemsAlreadyAssigned[0]).toEqual('item1');
                            expect(ctrl.itemsAlreadyAssigned[1]).toEqual('item2');
                        });
                    });
                });

                describe('submit set notifications, good response', function () {
                    var testResp;

                    beforeEach(inject(function ($q) {
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            var deferred = $q.defer();
                            deferred.resolve(testResp);
                            return deferred.promise;
                        });
                        spyOn(notificationService, 'addNotification');
                    }));

                    it('should call NotificationService with success message with identity request id', function () {
                        testResp = goodResp;
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(notificationService.addNotification).toHaveBeenCalledWith('ui_access_request_submitted_requests_with_id', 'SUCCESS', ['1234']);
                    });

                    it('should call NotificationService with success message without identity request id', function () {
                        testResp = goodRespMultiple;
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(notificationService.addNotification).toHaveBeenCalledWith('ui_access_request_submitted_requests', 'SUCCESS', undefined);
                    });
                });

                describe('submit set notifications, bad response', function () {
                    beforeEach(inject(function ($q) {
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            var deferred = $q.defer();
                            deferred.resolve(badResp);
                            return deferred.promise;
                        });
                        spyOn(notificationService, 'addNotification');
                    }));

                    it('should call NotificationService with error message', function () {
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(notificationService.addNotification).toHaveBeenCalledWith('ui_access_request_submitted_requests_failed_with_violation', 'ERROR', undefined, true);
                    });
                });

                describe('submit set notifications, partial response', function () {
                    beforeEach(inject(function ($q) {
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            var deferred = $q.defer();
                            deferred.resolve(partialResp);
                            return deferred.promise;
                        });
                        spyOn(notificationService, 'addNotification');
                    }));

                    it('should call NotificationService with warning message', function () {
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(notificationService.addNotification).toHaveBeenCalledWith('ui_access_request_submitted_requests_failures', 'WARN', [1, 1], true);
                    });
                });

                describe('submit button', function () {
                    beforeEach(function () {
                        /* Disregard the existing conditions, here we are testing the violation stuff */
                        spyOn(ctrl, 'hasRequestedItems').and.returnValue(true);
                        spyOn(ctrl, 'hasRemovedCurrentAccessItems').and.returnValue(true);
                    });

                    it('should be disabled if there are policy violations but no selections', function () {
                        spyOn(ctrl, 'hasPolicyViolations').and.returnValue(true);
                        expect(ctrl.getSubmitDisabled()).toBe(true);
                    });

                    it('should be enabled if there are policy violations and selections', function () {
                        spyOn(ctrl, 'hasPolicyViolations').and.returnValue(true);
                        ctrl.approvalItemRemoved = true;
                        expect(ctrl.getSubmitDisabled()).toBe(false);
                    });
                });

                describe('submit work item response', function () {
                    var deferred, $q;
                    beforeEach(inject(function (_$q_) {
                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);
                        $q = _$q_;
                        deferred = $q.defer();
                        spyOn(workItemService, 'openWorkItemDialog').and.returnValue(deferred.promise);
                    }));

                    it('should not call openWorkItemDialog for single user before prompting', function () {
                        workItemService.isSupportedWorkItemType = jasmine.createSpy().and.returnValue(false);

                        spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity]);
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            deferred.resolve(workItemResp);
                            return deferred.promise;
                        });
                        spyOn(accessRequestDataService, 'isSingleUserRequest').and.returnValue(true);
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(workItemService.openWorkItemDialog).not.toHaveBeenCalled();
                    });

                    it('should not call openWorkItemDialog for multiple user', function () {
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            deferred.resolve(workItemResp);
                            return deferred.promise;
                        });
                        spyOn(accessRequestDataService, 'isSingleUserRequest').and.returnValue(false);
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(workItemService.openWorkItemDialog).not.toHaveBeenCalled();
                    });

                    it('should not call openWorkItemDialog for single user without work item', function () {
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            deferred.resolve(goodResp);
                            return deferred.promise;
                        });
                        spyOn(accessRequestDataService, 'isSingleUserRequest').and.returnValue(true);
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(workItemService.openWorkItemDialog).not.toHaveBeenCalled();
                    });

                    it('should not call openWorkItemDialog for multiple user without work item', function () {
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            deferred.resolve(goodResp);
                            return deferred.promise;
                        });
                        spyOn(accessRequestDataService, 'isSingleUserRequest').and.returnValue(false);
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(workItemService.openWorkItemDialog).not.toHaveBeenCalled();
                    });

                    describe('unsupported work item types', function () {
                        var supportedWorkItemType = false;

                        beforeEach(function () {
                            accessRequestReviewService.submitAccessRequestItems = jasmine.createSpy().and.returnValue($q.when(workItemResp));

                            accessRequestDataService.isSingleUserRequest = function () {
                                return true;
                            };

                            workItemService.isSupportedWorkItemType = function () {
                                return supportedWorkItemType;
                            };
                        });

                        function setupFormToManualActionTest(mobile) {
                            isMobile = mobile;

                            //for a form
                            supportedWorkItemType = true;

                            // mock openWorkItemDialog to return manualAction work item
                            workItemService.openWorkItemDialog = jasmine.createSpy().and.returnValue($q.when(workItemResp[0]));

                            // mock submit to return form work item
                            accessRequestReviewService.submitAccessRequestItems = jasmine.createSpy().and.returnValue($q.when(formWorkItemResp[0]));

                            spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity]);

                            $rootScope.$apply();

                            ctrl.submit();

                            //for manual action work item
                            supportedWorkItemType = false;
                        }

                        it('should show warning modal for unsupported work item on mobile', function () {
                            isMobile = true;

                            workItemService.openUnSupportedWorkItemDialog = jasmine.createSpy().and.returnValue($q.when());

                            ctrl.submit();
                            $rootScope.$apply();
                            expect(workItemService.openUnSupportedWorkItemDialog).toHaveBeenCalled();
                        });

                        it('should navigate to JSF work item page for unsupported work item on desktop', function () {
                            isMobile = false;
                            ctrl.submit();
                            $rootScope.$apply();
                            expect(workItemService.navigateToWorkItemPage).toHaveBeenCalledWith(workItemResp[0].workflowWorkItemId);
                        });

                        it('should navigate to JSF work item page from a form for unsupported work item on desktop', function () {
                            setupFormToManualActionTest(false);
                            expect(workItemService.navigateToWorkItemPage).toHaveBeenCalledWith(workItemResp[0].workflowWorkItemId);
                        });

                        it('should show warning modal from a form for unsupported work item on mobile', function () {
                            setupFormToManualActionTest(true);
                            expect(workItemService.openUnSupportedWorkItemDialog).toHaveBeenCalled();
                        });
                    });
                });

                describe('submitAccessRequest policy violations response', function () {
                    beforeEach(inject(function ($q) {
                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);
                        spyOn(accessRequestReviewService, 'submitAccessRequestItems').and.callFake(function () {
                            var deferred = $q.defer();
                            deferred.resolve(policyViolationResp);
                            return deferred.promise;
                        });
                        spyOn(accessRequestDataService, 'getPolicyViolations').and.callFake(function () {
                            var deferred = $q.defer();
                            deferred.resolve(gotPolicyViolations);
                            return deferred.promise;
                        });
                    }));

                    it('should have policy violations set in ctrl', function () {
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(ctrl.hasPolicyViolations()).toBeTruthy();
                        expect(ctrl.getPolicyViolations().length).toEqual(1);

                        ctrl.clearPolicyViolations();
                        expect(ctrl.hasPolicyViolations()).toBeFalsy();
                        expect(ctrl.getPolicyViolations().length).toEqual(0);
                    });

                    it('should update the requested items with their respective approval ids', function () {
                        var requestedItem;
                        ctrl.submit();
                        $rootScope.$apply();
                        requestedItem = accessRequestDataService.getAccessRequest().getRequestedItem(item1);
                        expect(requestedItem.getApprovalItemId()).toEqual('approvalItemId1');
                    });

                    it('should not throw if an request item is not found', function () {
                        var approvalItems = policyViolationResp[0].approvalItems,
                            stash = approvalItems[0];
                        approvalItems[0] = { requestItemId: 'doesNotExist' };
                        expect(function () {
                            ctrl.submit();
                            $rootScope.$apply();
                        }).not.toThrow();
                        approvalItems[0] = stash;
                    });
                });

                describe('removing all items', function () {
                    beforeEach(inject(function (AccessRequestItem, Identity) {
                        // Create some identities and items to test with.
                        item1 = new AccessRequestItem(accessRequestTestData.ROLE);
                        item2 = new AccessRequestItem(accessRequestTestData.ENTITLEMENT);

                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);
                    }));

                    it('should disable submit button', function () {
                        expect(ctrl.hasRequestedItems()).toBe(true);
                        ctrl.removeRequestedItem(requestedItem1);
                        expect(ctrl.hasRequestedItems()).toBe(true);
                        expect(ctrl.getSubmitDisabled()).toBe(false);

                        ctrl.removeRequestedItem(requestedItem2);
                        expect(ctrl.hasRequestedItems()).toBe(false);
                        expect(ctrl.getSubmitDisabled()).toBe(true);
                    });
                });

                describe('setting priority', function () {
                    it('should default to normal/null priority', function () {
                        expect(ctrl.getPriority()).toBeNull();
                    });
                    it('should allow setting priority on data service', function () {
                        expect(ctrl.getPriority()).toBeNull();
                        ctrl.setPriority('Low');
                        expect(accessRequestDataService.priority).toBe('Low');
                    });
                });

                describe('editAccountSelections()', function () {
                    var item, requestedItem, modalDeferred;

                    beforeEach(inject(function ($q) {
                        item = {
                            id: 321
                        };
                        requestedItem = {
                            item: item,
                            accountSelections: []
                        };
                        modalDeferred = $q.defer();
                        spyOn(accessRequestAccountSelectionService, 'editAccountSelections').and.returnValue(modalDeferred.promise);
                    }));

                    it('should open the account selection dialog when called', function () {
                        ctrl.editAccountSelections(requestedItem);
                        expect(accessRequestAccountSelectionService.editAccountSelections).toHaveBeenCalled();
                    });

                    it('should not update the requestedItem when the dialog is rejected', function () {
                        var accountSelections = [{ 'this is': 'a test' }];
                        requestedItem.accountSelections = accountSelections;
                        ctrl.editAccountSelections(requestedItem);
                        modalDeferred.reject('some value');
                        $rootScope.$digest();
                        expect(accessRequestAccountSelectionService.editAccountSelections).toHaveBeenCalled();
                        expect(requestedItem.accountSelections).toBe(accountSelections);
                    });

                    it('should update the requestedItem when the dialog is resolved', function () {
                        var accountSelections = [{ 'this is': 'a test' }],
                            updatedAccountSelections = [{ foo: 'bar' }, { something: 'else' }];
                        requestedItem.accountSelections = accountSelections;
                        ctrl.editAccountSelections(requestedItem);
                        modalDeferred.resolve({
                            accountSelections: updatedAccountSelections
                        });
                        $rootScope.$digest();
                        expect(accessRequestAccountSelectionService.editAccountSelections).toHaveBeenCalled();
                        expect(requestedItem.accountSelections).toBe(updatedAccountSelections);
                    });
                });

                describe('showGlobalSunriseSunsetDialog', function () {
                    var spModal, $q;

                    beforeEach(inject(function (_spModal_, _$q_) {
                        $q = _$q_;
                        spModal = _spModal_;
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                    }));

                    it('should open modal', function () {
                        var modalArgs,
                            items,
                            sunriseDate = new Date();

                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);

                        items = ctrl.getRequestedItems();
                        items[0].setSunriseDate(sunriseDate);
                        items[1].setSunriseDate(sunriseDate);

                        ctrl.showGlobalSunriseSunsetDialog();

                        modalArgs = spModal.open.calls.mostRecent().args[0];

                        expect(modalArgs.resolve.sunriseDate().getTime()).toBe(sunriseDate.getTime());
                        expect(modalArgs.resolve.sunsetDate()).toBe(undefined);
                        expect(modalArgs.title).toBe('ui_request_edit_start_end_date');
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('showSunriseSunsetDialog', function () {
                    var spModal, $q;

                    beforeEach(inject(function (_spModal_, _$q_) {
                        $q = _$q_;
                        spModal = _spModal_;
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                    }));

                    it('should open modal', function () {
                        var modalArgs,
                            sunriseDate = new Date();

                        requestedItem1.setSunriseDate(sunriseDate);
                        ctrl.showSunriseSunsetDialog(requestedItem1);

                        modalArgs = spModal.open.calls.mostRecent().args[0];

                        expect(modalArgs.resolve.sunriseDate().getTime()).toBe(sunriseDate.getTime());
                        expect(modalArgs.resolve.sunsetDate()).toBe(undefined);
                        expect(modalArgs.title).toBe('ui_item_edit_start_end_date');
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('areGlobalDatesSet', function () {
                    it('should return false when item\'s dates don\'t match', function () {
                        var items,
                            sunriseDate = new Date();

                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);

                        expect(ctrl.areGlobalDatesSet()).toBeFalsy();

                        items = ctrl.getRequestedItems();
                        items[0].setSunriseDate(sunriseDate);

                        expect(ctrl.areGlobalDatesSet()).toBeFalsy();
                    });

                    it('should return true when item\'s dates do match', function () {
                        var items,
                            sunriseDate = new Date();

                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);

                        expect(ctrl.areGlobalDatesSet()).toBeFalsy();

                        items = ctrl.getRequestedItems();
                        items[0].setSunriseDate(sunriseDate);
                        items[1].setSunriseDate(sunriseDate);

                        expect(ctrl.areGlobalDatesSet()).toBeTruthy();
                    });

                    it('should return true when date objects are different but with same time', function () {
                        var items,
                            sunriseDate1 = new Date(accessRequestTestData.CURRENT_ACCESS_ROLE.sunrise),
                            sunriseDate2 = new Date(accessRequestTestData.CURRENT_ACCESS_ROLE.sunrise);

                        accessRequestDataService.getAccessRequest().addRequestedItem(item1);
                        accessRequestDataService.getAccessRequest().addRequestedItem(item2);

                        expect(ctrl.areGlobalDatesSet()).toBeFalsy();

                        items = ctrl.getRequestedItems();
                        items[0].setSunriseDate(sunriseDate1);
                        items[1].setSunriseDate(sunriseDate2);

                        expect(ctrl.areGlobalDatesSet()).toBeTruthy();
                    });
                });

                describe('showCommentDialog', function () {
                    var roleData, spModal, $q, requestedAccessItem, role;

                    beforeEach(inject(function (_spModal_, _$q_, RequestedAccessItem, AccessRequestItem) {
                        roleData = accessRequestTestData.CURRENT_ACCESS_ROLE;
                        role = new AccessRequestItem(roleData);
                        requestedAccessItem = new RequestedAccessItem(role);

                        $q = _$q_;
                        spModal = _spModal_;
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                    }));

                    it('should show modal', function () {
                        var modalArgs;

                        ctrl.showCommentDialog(requestedAccessItem);

                        modalArgs = spModal.open.calls.mostRecent().args[0];

                        expect(modalArgs.title).toBe('ui_access_request_comment_note_dialog_title');
                        expect(modalArgs.resolve.requestedAccessItem()).toBe(requestedAccessItem);

                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('useSunriseDates', function () {

                    it('should be false when SailPoint.configData.USE_SUNRISE_DATES is false', function () {
                        SailPoint.configData.USE_SUNRISE_DATES = false;
                        expect(ctrl.useSunriseDates()).toBeFalsy();
                    });

                    it('should be true when SailPoint.configData.USE_SUNRISE_DATES is true', function () {
                        SailPoint.configData.USE_SUNRISE_DATES = true;
                        expect(ctrl.useSunriseDates()).toBeTruthy();
                    });
                });

                describe('deep filter service', function () {
                    var identityData, identity;

                    beforeEach(inject(function (Identity, $q) {
                        identityData = accessRequestTestData.IDENTITY1;
                        identity = new Identity(identityData);
                        accessRequestDeepFilterService.getTargetIdentity = jasmine.createSpy('getTargetIdentity').and.callFake(function () {
                            return $q.when(identity);
                        });
                        spyOn(location, 'path').and.returnValue('/accessRequest/review');
                        spyOn(notificationService, 'addNotification');
                    }));

                    it('should call getTargetIdentity when deepLinkReview is true', function () {
                        accessRequestDeepFilterService.deepLinkReview = true;

                        // Create the controller so the init gets fired.
                        createController();
                        expect(accessRequestDeepFilterService.getTargetIdentity).toHaveBeenCalled();
                    });

                    it('should not call getTargetIdentity when deepLinkReview is false', function () {
                        accessRequestDeepFilterService.deepLinkReview = false;

                        // Create the controller so the init gets fired.
                        createController();
                        expect(accessRequestDeepFilterService.getTargetIdentity).not.toHaveBeenCalled();
                    });

                    it('should set error and go back to home if target identity is null', function () {
                        identity = null;
                        accessRequestDeepFilterService.deepLinkReview = true;
                        createController();
                        $rootScope.$apply();
                        expect(notificationService.addNotification).toHaveBeenCalled();
                        expect(navigationService.go).toHaveBeenCalled();
                        var args = navigationService.go.calls.mostRecent().args;
                        expect(args[0].state).toEqual('home');
                    });

                    it('should add request items for each review item', inject(function ($q) {
                        spyOn(accessRequestDeepFilterService, 'getReviewItems').and.returnValue($q.when([{ thing: 'value' }]));
                        spyOn(accessRequestDataService.getAccessRequest(), 'addRequestedItem');
                        accessRequestDeepFilterService.deepLinkReview = true;

                        // Create the controller so the init gets fired.
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).not.toHaveBeenCalled();
                        createController();
                        $rootScope.$digest();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).toHaveBeenCalled();
                    }));
                });

                describe('showItemDetails', function () {
                    var roleData, spModal, $q, requestedAccessItem, role;

                    beforeEach(inject(function (_spModal_, _$q_, RequestedAccessItem, AccessRequestItem) {
                        roleData = accessRequestTestData.CURRENT_ACCESS_ROLE;
                        role = new AccessRequestItem(roleData);
                        requestedAccessItem = new RequestedAccessItem(role);

                        $q = _$q_;
                        spModal = _spModal_;
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                    }));

                    it('should throw when no item is passed', function () {
                        expect(function () {
                            ctrl.showItemDetails();
                        }).toThrow();
                    });

                    it('should open a modal dialog', function () {
                        ctrl.showItemDetails(requestedAccessItem.item, true);
                        $rootScope.$digest();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('hasPolicyViolation for item', function () {
                    var roleData, entitlementData, roleViolationData, entitlementViolationData, PolicyViolation, AccessRequestItem, RequestedAccessItem, role, entitlement, roleViolation, entitlementViolation, requestedRoleItem, requestedEntitlementItem;

                    /**
                     * Setup the PolicyViolation class and create some data to test with.
                     */
                    /**
                     * Setup the PolicyViolation class and create some data to test with.
                     */
                    beforeEach(inject(function (_PolicyViolation_, _AccessRequestItem_, _RequestedAccessItem_) {
                        PolicyViolation = _PolicyViolation_;
                        AccessRequestItem = _AccessRequestItem_;
                        RequestedAccessItem = _RequestedAccessItem_;

                        roleData = accessRequestTestData.POLICY_VIOLATION_ROLE;
                        entitlementData = accessRequestTestData.POLICY_VIOLATION_ENTITLEMENT;
                        roleViolationData = accessRequestTestData.ROLE_POLICY_VIOLATION_DATA;
                        entitlementViolationData = accessRequestTestData.ENTITLEMENT_POLICY_VIOLATION_DATA;

                        roleViolation = new PolicyViolation(roleViolationData);
                        entitlementViolation = new PolicyViolation(entitlementViolationData);
                        role = new AccessRequestItem(roleData);
                        entitlement = new AccessRequestItem(entitlementData);
                        requestedRoleItem = new RequestedAccessItem(role);
                        requestedEntitlementItem = new RequestedAccessItem(entitlement);
                    }));

                    it('has role violation', function () {
                        ctrl.clearPolicyViolations();
                        ctrl.policyViolations.push(roleViolation);
                        expect(ctrl.hasPolicyViolation(requestedRoleItem)).toBeTruthy();
                        expect(ctrl.hasPolicyViolation(requestedEntitlementItem)).toBeFalsy();
                    });

                    it('has entitlement violation', function () {
                        ctrl.clearPolicyViolations();
                        ctrl.policyViolations.push(entitlementViolation);
                        expect(ctrl.hasPolicyViolation(requestedRoleItem)).toBeFalsy();
                        expect(ctrl.hasPolicyViolation(requestedEntitlementItem)).toBeTruthy();
                    });
                });

                describe('showViolationDetails', function () {
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
                        ctrl.showViolationDetails(item1.id, violation);
                        expect(spModal.open).toHaveBeenCalled();
                        spModal.open.calls.mostRecent().args[0].title = ruleName;
                    });
                });

                describe('sortByPolicyViolation filter', function () {
                    var filter,
                        mockCtrl,
                        itemA = { displayableName: 'whatever' },
                        itemB = { displayableName: 'stupid' },
                        itemC = { displayableName: 'dumb' },
                        hasViolations = false;

                    beforeEach(inject(function (sortByPolicyViolationFilter) {
                        filter = sortByPolicyViolationFilter;

                        mockCtrl = {
                            hasPolicyViolations: jasmine.createSpy().and.callFake(function () {
                                return hasViolations;
                            }),
                            hasPolicyViolation: jasmine.createSpy().and.callFake(function (item) {
                                // Fake it so item c has the violation.
                                return item === itemC;
                            })
                        };
                    }));

                    it('does nothing if no violations', function () {
                        var items = [itemA, itemB, itemC];
                        filter(items, mockCtrl);
                        expect(items).toEqual([itemA, itemB, itemC]);
                        expect(mockCtrl.hasPolicyViolation).not.toHaveBeenCalled();
                    });

                    it('moves items with violations to the front', function () {
                        var items = [itemA, itemB, itemC];
                        hasViolations = true;
                        filter(items, mockCtrl);
                        expect(items).toEqual([itemC, itemA, itemB]);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdFJldmlld0N0cmxUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsc0JBQXNCLDRCQUE0QixVQUFVLFNBQVM7SUFBdEo7O0lBR0ksSUFBSSxxQkFBcUI7SUFDekIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7V0FDaEMsVUFBVSx3QkFBd0I7UUFDckMsU0FBUyxZQUFZOzs7OztZQUE3QixTQUFTLDJCQUEyQixZQUFXOztnQkFFM0MsSUFBSTtvQkFBYTtvQkFBMEI7b0JBQTRCO29CQUNuRTtvQkFBbUI7b0JBQWE7b0JBQU07b0JBQU87b0JBQU87b0JBQWdCO29CQUFnQjtvQkFBVTtvQkFDOUY7b0JBQXFCO29CQUFlO29CQUFnQztvQkFBbUI7b0JBQ3ZGO29CQUF1QjtvQkFBVTtvQkFBa0I7b0JBQVM7b0JBQWE7b0JBQWM7b0JBQ3ZGLFdBQVc7b0JBQU87b0JBQWtCO29CQUVwQyxrQkFBa0I7b0JBQ2Qsd0JBQXdCLFFBQVEsVUFBVTtvQkFDMUMsb0JBQW9CLFFBQVE7O29CQUdoQyxzQkFBc0I7b0JBQ2xCLFFBQVE7b0JBQ1IsTUFBTTt3QkFDRixTQUFTLENBQ0w7NEJBQ0ksWUFBYTs0QkFDYixhQUFjOzRCQUNkLFVBQVc7NEJBQ1gsWUFBYTs7Ozs7O2dCQVFqQyxXQUFXLE9BQU8sWUFBWTs7Ozs7O2dCQU05QixXQUFXLE9BQU8sVUFBUyw0QkFBNEIsbUJBQW1CLHFCQUMvQyxVQUFVLGNBQWMseUJBQ3hCLGVBQWUsZUFBZSw4QkFDOUIsd0NBQXdDLGlCQUFpQixtQkFDekQsa0NBQWtDLHFCQUFxQixXQUN2RCx5QkFBeUIsa0JBQWtCLHlCQUF5Qjs7O29CQUczRiwyQkFBMkI7b0JBQzNCLDZCQUE2Qjtv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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBhY2Nlc3NSZXF1ZXN0TW9kdWxlIGZyb20gJ2FjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdE1vZHVsZSc7XHJcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XHJcbmltcG9ydCAnLi9BY2Nlc3NSZXF1ZXN0VGVzdERhdGEnO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGZvciB0aGUgQWNjZXNzUmVxdWVzdFJldmlld0N0cmwuXHJcbiAqL1xyXG5kZXNjcmliZSgnQWNjZXNzUmVxdWVzdFJldmlld0N0cmwnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgJGNvbnRyb2xsZXIsIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2UsIGFjY2Vzc1JlcXVlc3RBY2NvdW50U2VsZWN0aW9uU2VydmljZSxcclxuICAgICAgICBjb25maWdTZXJ2aWNlTW9jaywgdGVzdFNlcnZpY2UsIGN0cmwsIGl0ZW0xLCBpdGVtMiwgcmVxdWVzdGVkSXRlbTEsIHJlcXVlc3RlZEl0ZW0yLCBpZGVudGl0eSwgJHJvb3RTY29wZSxcclxuICAgICAgICBub3RpZmljYXRpb25TZXJ2aWNlLCBjb25maWdTZXJ2aWNlLCBhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCBsb2NhdGlvbixcclxuICAgICAgICBwcm9taXNlVHJhY2tlclNlcnZpY2UsIGdvb2RSZXNwLCBnb29kUmVzcE11bHRpcGxlLCBiYWRSZXNwLCBwYXJ0aWFsUmVzcCwgd29ya0l0ZW1SZXNwLCBwb2xpY3lWaW9sYXRpb25SZXNwLFxyXG4gICAgICAgIGlzTW9iaWxlID0gZmFsc2UsIGZvcm1Xb3JrSXRlbVJlc3AsIGFjY2Vzc1JlcXVlc3RUZXN0RGF0YSxcclxuXHJcbiAgICAgICAgd29ya0l0ZW1TZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBuYXZpZ2F0ZVRvV29ya0l0ZW1QYWdlOiBqYXNtaW5lLmNyZWF0ZVNweSgnbmF2aWdhdGVUb1dvcmtJdGVtUGFnZScpLFxyXG4gICAgICAgICAgICBvcGVuV29ya0l0ZW1EaWFsb2c6IGFuZ3VsYXIubm9vcFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdvdFBvbGljeVZpb2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3RzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpY3lOYW1lIDogJ1NPRCBQb2xpY3knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA6ICdBY2NvdW50cyBSZWNlaXZhYmxlIGFuZCBBY2NvdW50cyBQYXlhYmxlIHNob3VsZCBub3QgYmUgY29tYmluZWQuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZU5hbWUgOiAnQWNjb3VudGluZyBTT0QtNzYyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2l0ZW1JZCA6ICcyYzkwOGNkNTRiYTkyZmRlMDE0YmJkYmVhY2JmMDRkMidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBMZXQgdGhlIHRlc3RzIGtub3cgd2UnbGwgdXNlIHRoZSBhY2Nlc3MgcmVxdWVzdCBtb2R1bGUuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlLCBhY2Nlc3NSZXF1ZXN0TW9kdWxlKSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXHJcbiAgICAgKi9cclxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDE4ICovXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlXywgQWNjZXNzUmVxdWVzdEl0ZW0sIFJlcXVlc3RlZEFjY2Vzc0l0ZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJZGVudGl0eSwgXyRyb290U2NvcGVfLCBfc3BOb3RpZmljYXRpb25TZXJ2aWNlXyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8kY29udHJvbGxlcl8sIF90ZXN0U2VydmljZV8sIF9hY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlXywgX2NvbmZpZ1NlcnZpY2VfLCBTUF9DT05GSUdfU0VSVklDRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2VfLCBfbmF2aWdhdGlvblNlcnZpY2VfLCAkbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcHJvbWlzZVRyYWNrZXJTZXJ2aWNlXywgU3VibWl0UmVzdWx0SXRlbSwgX2FjY2Vzc1JlcXVlc3RUZXN0RGF0YV8pIHtcclxuXHJcbiAgICAgICAgLy8gU2F2ZSB0aGUgc2VydmljZXMuXHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlID0gX2FjY2Vzc1JlcXVlc3REYXRhU2VydmljZV87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2UgPSBfYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2VfO1xyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RBY2NvdW50U2VsZWN0aW9uU2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2VfO1xyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2VfO1xyXG4gICAgICAgIHRlc3RTZXJ2aWNlID0gX3Rlc3RTZXJ2aWNlXztcclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuICAgICAgICBub3RpZmljYXRpb25TZXJ2aWNlID0gX3NwTm90aWZpY2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9jb25maWdTZXJ2aWNlXztcclxuICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSA9IF9uYXZpZ2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgbG9jYXRpb24gPSAkbG9jYXRpb247XHJcbiAgICAgICAgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlID0gX3Byb21pc2VUcmFja2VyU2VydmljZV87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdFRlc3REYXRhID0gX2FjY2Vzc1JlcXVlc3RUZXN0RGF0YV87XHJcblxyXG4gICAgICAgIC8vIE1vY2sgb3V0IHRoZSBjb25maWcgc2VydmljZVxyXG4gICAgICAgIGNvbmZpZ1NlcnZpY2VNb2NrID0ge1xyXG4gICAgICAgICAgICBnZXRDb2x1bW5Db25maWdFbnRyaWVzOiB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XHJcbiAgICAgICAgICAgIH0sIHt9KSxcclxuICAgICAgICAgICAgZ2V0Q29uZmlnVmFsdWUgOiBjb25maWdTZXJ2aWNlLmdldENvbmZpZ1ZhbHVlLFxyXG4gICAgICAgICAgICBpc01vYmlsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNNb2JpbGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgc29tZSBpZGVudGl0aWVzIGFuZCBpdGVtcyB0byB0ZXN0IHdpdGguXHJcbiAgICAgICAgaWRlbnRpdHkgPSBuZXcgSWRlbnRpdHkoYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZMSk7XHJcbiAgICAgICAgaXRlbTEgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEUpO1xyXG4gICAgICAgIGl0ZW0yID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5FTlRJVExFTUVOVCk7XHJcbiAgICAgICAgcmVxdWVzdGVkSXRlbTEgPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShpdGVtMSk7XHJcbiAgICAgICAgcmVxdWVzdGVkSXRlbTIgPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShpdGVtMik7XHJcbiAgICAgICAgcmVxdWVzdGVkSXRlbTIucGVybWl0dGVkQnlJZCA9IGl0ZW0xLmdldElkKCk7XHJcblxyXG4gICAgICAgIHNweU9uKCRyb290U2NvcGUsICckYnJvYWRjYXN0JykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcblxyXG4gICAgICAgIC8vIFNweSBvbiBuYXZpZ2F0aW9uU2VydmljZS5nbygpIGFuZCBkbyBub3RoaW5nIHNpbmNlICdob21lJyBpc24ndCBkZWZpbmVkLlxyXG4gICAgICAgIHNweU9uKG5hdmlnYXRpb25TZXJ2aWNlLCAnZ28nKS5hbmQucmV0dXJuVmFsdWUobnVsbCk7XHJcblxyXG4gICAgICAgIC8vIFNweSBvbiB0aGUgcHJvbWlzZSB0cmFja2VyLCBidXQgY2FsbCB0aHJvdWdoIHNvIGl0IGRvZXMgc3R1ZmZcclxuICAgICAgICBzcHlPbihwcm9taXNlVHJhY2tlclNlcnZpY2UsICd0cmFjaycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcblxyXG4gICAgICAgIFNhaWxQb2ludC5jb25maWdEYXRhID0ge307XHJcbiAgICAgICAgU2FpbFBvaW50LmNvbmZpZ0RhdGFbU1BfQ09ORklHX1NFUlZJQ0UuQUNDRVNTX1JFUVVFU1RfQUxMT1dfUFJJT1JJVFlfRURJVElOR10gPSB0cnVlO1xyXG5cclxuICAgICAgICBnb29kUmVzcCA9XHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgIHdvcmtmbG93U3RhdHVzOiAnZXhlY3V0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHlSZXF1ZXN0SWQ6ICcxMjM0J1xyXG4gICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIGdvb2RSZXNwTXVsdGlwbGUgPVxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgbmV3IFN1Ym1pdFJlc3VsdEl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgICAgICB3b3JrZmxvd1N0YXR1czogJ2V4ZWN1dGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgIGlkZW50aXR5UmVxdWVzdElkOiAnMTIzNCdcclxuICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgIHdvcmtmbG93U3RhdHVzOiAnZXhlY3V0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHlSZXF1ZXN0SWQ6ICczNDU2J1xyXG4gICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIGJhZFJlc3AgPVxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdmYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlT3JLZXk6ICd1aV9hY2Nlc3NfcmVxdWVzdF9zdWJtaXR0ZWRfcmVxdWVzdHNfZmFpbGVkX3dpdGhfdmlvbGF0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnRVJST1InXHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIHBhcnRpYWxSZXNwID1cclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgbmV3IFN1Ym1pdFJlc3VsdEl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93U3RhdHVzOiAnZmFpbGVkJ1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdleGVjdXRpbmcnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICB3b3JrSXRlbVJlc3AgPVxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dWaW9sYXRpb25zOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBhcHByb3ZhbEl0ZW1zOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHByb3ZhbEl0ZW1JZDogJ2FlZTlmZWNhYjBiYjQzNTk4YTI1NGE4N2NmNDk1MjMzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEl0ZW1JZDogJzEyMzQ1MTM0NTEzNDUxMjM0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aXR5UmVxdWVzdElkOiAnOScsXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdhcHByb3ZpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1JZDogJzJjOTA4Y2I4NGU2ZTUyNTAwMTRlNmU2Yzk4MjUwMDU5JyxcclxuICAgICAgICAgICAgICAgICAgICB3b3JrZmxvd1dvcmtJdGVtVHlwZTogJ01hbnVhbEFjdGlvbidcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIGZvcm1Xb3JrSXRlbVJlc3AgPVxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dWaW9sYXRpb25zOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBhcHByb3ZhbEl0ZW1zOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHByb3ZhbEl0ZW1JZDogJ2I0MzU5OGEyNTRhODdjZjQ5NTIzMycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RJdGVtSWQ6ICczNDUxMjM0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aXR5UmVxdWVzdElkOiAnOScsXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdhcHByb3ZpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1JZDogJzI1MDAxNGU2ZTZjOTgyNTAwNTknLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1UeXBlOiAnRm9ybSdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIHBvbGljeVZpb2xhdGlvblJlc3AgPVxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBuZXcgU3VibWl0UmVzdWx0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdhcHByb3ZpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1UeXBlIDogJ1Zpb2xhdGlvblJldmlldycsXHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dXb3JrSXRlbUlkIDogJzJjOTA4Y2Q1NGJhOTJmZGUwMTRiYmRiZWFjYmYwNGQyJyxcclxuICAgICAgICAgICAgICAgICAgICBhcHByb3ZhbEl0ZW1zOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEl0ZW1JZDogJzEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwcm92YWxJdGVtSWQ6ICdhcHByb3ZhbEl0ZW1JZDEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdBY2Nlc3NSZXF1ZXN0UmV2aWV3Q3RybCcsIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlOiBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2U6IGNvbmZpZ1NlcnZpY2VNb2NrLFxyXG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2U6IHdvcmtJdGVtU2VydmljZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2NyaWJlKCdhZGRlZCBhY2Nlc3MgcmVxdWVzdCBpdGVtcycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgZG9SZW1vdmUgPSB0cnVlLFxyXG4gICAgICAgICAgICBwZXJtaXR0ZWRJdGVtTWFwO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIE1vY2sgb3V0IHRoZSBkYXRhIHNlcnZpY2UuXHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRJZGVudGl0aWVzJykuYW5kLnJldHVyblZhbHVlKFsgaWRlbnRpdHkgXSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsgcmVxdWVzdGVkSXRlbTEsIHJlcXVlc3RlZEl0ZW0yIF0pO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0VG9wTGV2ZWxSZXF1ZXN0ZWRJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsgcmVxdWVzdGVkSXRlbTEgXSk7XHJcblxyXG4gICAgICAgICAgICBwZXJtaXR0ZWRJdGVtTWFwID0ge1xyXG4gICAgICAgICAgICAgICAgJzEnOiBbIHJlcXVlc3RlZEl0ZW0yIF0sXHJcbiAgICAgICAgICAgICAgICAnMic6IFsgXVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlcXVlc3RlZFBlcm1pdHRlZEl0ZW1zJykuXHJcbiAgICAgICAgICAgICAgICBhbmQuY2FsbEZha2UoZnVuY3Rpb24ocmVxdWVzdGVkSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwZXJtaXR0ZWRJdGVtTWFwW3JlcXVlc3RlZEl0ZW0uZ2V0VW5pcXVlSWQoKV07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ3JlbW92ZVJlcXVlc3RlZEl0ZW0nKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9SZW1vdmU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnYWRkUmVtb3ZlZEl0ZW1NZXNzYWdlJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnZ2V0UmVxdWVzdGVkSXRlbXMoKSByZXR1cm5zIHRoZSBhZGRlZCBhY2Nlc3MgaXRlbXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gY3RybC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5nZXRSZXF1ZXN0ZWRJdGVtcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMuaW5kZXhPZihyZXF1ZXN0ZWRJdGVtMSkpLnRvQmVHcmVhdGVyVGhhbigtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcy5pbmRleE9mKHJlcXVlc3RlZEl0ZW0yKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2dldFRvcExldmVsUmVxdWVzdGVkSXRlbXMoKSByZXR1cm5zIHRoZSB0b3AgbGV2ZWwgYWRkZWQgYWNjZXNzIGl0ZW1zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IGN0cmwuZ2V0VG9wTGV2ZWxSZXF1ZXN0ZWRJdGVtcygpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5nZXRUb3BMZXZlbFJlcXVlc3RlZEl0ZW1zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcy5pbmRleE9mKHJlcXVlc3RlZEl0ZW0xKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YocmVxdWVzdGVkSXRlbTIpKS5ub3QudG9CZUdyZWF0ZXJUaGFuKC0xKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2dldFJlcXVlc3RlZFBlcm1pdHRlZEl0ZW1zKCkgcmV0dXJucyB0aGUgcGVybWl0dGVkIHJvbGVzIGZvciB0aGUgZ2l2ZW4gaXRlbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcGVybWl0dGVkSXRlbXMgPSBjdHJsLmdldFJlcXVlc3RlZFBlcm1pdHRlZEl0ZW1zKHJlcXVlc3RlZEl0ZW0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuZ2V0UmVxdWVzdGVkUGVybWl0dGVkSXRlbXMpLlxyXG4gICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgocmVxdWVzdGVkSXRlbTEpO1xyXG4gICAgICAgICAgICBleHBlY3QocGVybWl0dGVkSXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QocGVybWl0dGVkSXRlbXMuaW5kZXhPZihyZXF1ZXN0ZWRJdGVtMSkpLm5vdC50b0JlR3JlYXRlclRoYW4oLTEpO1xyXG4gICAgICAgICAgICBleHBlY3QocGVybWl0dGVkSXRlbXMuaW5kZXhPZihyZXF1ZXN0ZWRJdGVtMikpLnRvQmVHcmVhdGVyVGhhbigtMSk7XHJcbiAgICAgICAgICAgIHBlcm1pdHRlZEl0ZW1zID0gY3RybC5nZXRSZXF1ZXN0ZWRQZXJtaXR0ZWRJdGVtcyhyZXF1ZXN0ZWRJdGVtMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmdldFJlcXVlc3RlZFBlcm1pdHRlZEl0ZW1zKS5cclxuICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlcXVlc3RlZEl0ZW0yKTtcclxuICAgICAgICAgICAgZXhwZWN0KHBlcm1pdHRlZEl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVSZXF1ZXN0ZWRJdGVtKCkgcmVtb3ZlcyB0aGUgYWRkZWQgYWNjZXNzIGl0ZW1zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwucmVtb3ZlUmVxdWVzdGVkSXRlbShyZXF1ZXN0ZWRJdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLnJlbW92ZVJlcXVlc3RlZEl0ZW0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWRkUmVtb3ZlZEl0ZW1NZXNzYWdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNjcmVlblJlYWRlck1lc3NhZ2VzLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlbW92ZVJlcXVlc3RlZEl0ZW0oKSBkb2VzIG5vdCBhZGQgc2NyZWVuIHJlYWRlciBtZXNzYWdlIGlmIGl0ZW0gbm90IHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZG9SZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgY3RybC5yZW1vdmVSZXF1ZXN0ZWRJdGVtKHJlcXVlc3RlZEl0ZW0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWRkUmVtb3ZlZEl0ZW1NZXNzYWdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3RyYWNrcyB3aGljaCByb2xlcyBoYXZlIGV4cGFuZGVkIHBlcm1pdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY3RybC5pc1Nob3dQZXJtaXR0ZWRSb2xlcyhyZXF1ZXN0ZWRJdGVtMSkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICBjdHJsLnRvZ2dsZVNob3dQZXJtaXR0ZWRSb2xlcyhyZXF1ZXN0ZWRJdGVtMSk7XHJcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNTaG93UGVybWl0dGVkUm9sZXMocmVxdWVzdGVkSXRlbTEpKS50b0JlRmFsc3koKTtcclxuICAgICAgICBjdHJsLnRvZ2dsZVNob3dQZXJtaXR0ZWRSb2xlcyhyZXF1ZXN0ZWRJdGVtMSk7XHJcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNTaG93UGVybWl0dGVkUm9sZXMocmVxdWVzdGVkSXRlbTEpKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNTaG93UGVybWl0dGVkUm9sZXMocmVxdWVzdGVkSXRlbTIpKS50b0JlVHJ1dGh5KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaGFzUmVxdWVzdGVkSXRlbXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBpZiBoYXMgbm8gYWRkIGFjY2VzcyByZXF1ZXN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgaGFzQWNjZXNzUmVxdWVzdHM7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtcycpLmFuZC5yZXR1cm5WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgIGhhc0FjY2Vzc1JlcXVlc3RzID0gY3RybC5oYXNSZXF1ZXN0ZWRJdGVtcygpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFzQWNjZXNzUmVxdWVzdHMpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgaGFzIGFuIGFkZCBhY2Nlc3MgcmVxdWVzdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGhhc0FjY2Vzc1JlcXVlc3RzO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UmVxdWVzdGVkSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoWydmb28nXSk7XHJcbiAgICAgICAgICAgIGhhc0FjY2Vzc1JlcXVlc3RzID0gY3RybC5oYXNSZXF1ZXN0ZWRJdGVtcygpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFzQWNjZXNzUmVxdWVzdHMpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGlmIGhhcyBtdWx0aXBsZSBhZGQgYWNjZXNzIHJlcXVlc3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNBY2Nlc3NSZXF1ZXN0cztcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlcXVlc3RlZEl0ZW1zJykuYW5kLnJldHVyblZhbHVlKFsnZm9vJywgJ2JhciddKTtcclxuICAgICAgICAgICAgaGFzQWNjZXNzUmVxdWVzdHMgPSBjdHJsLmhhc1JlcXVlc3RlZEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYXNBY2Nlc3NSZXF1ZXN0cykudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3JlbW92ZWQgY3VycmVudCBhY2Nlc3MgaXRlbXMnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIGRvUmVtb3ZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5qZWN0IHRoZSBkZXBlbmRlbmNpZXMgYW5kIHNldHVwIG1vY2tzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKEN1cnJlbnRBY2Nlc3NJdGVtLCBJZGVudGl0eSkge1xyXG4gICAgICAgICAgICAvLyBNb2NrIG91dCB0aGUgZGF0YSBzZXJ2aWNlLlxyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0SWRlbnRpdGllcycpLmFuZC5yZXR1cm5WYWx1ZShbIGlkZW50aXR5IF0pO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsgaXRlbTEsIGl0ZW0yIF0pO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAncmVtb3ZlUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtJykuXHJcbiAgICAgICAgICAgICAgICBhbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvUmVtb3ZlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2FkZFJlbW92ZWRJdGVtTWVzc2FnZScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaXQoJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKSByZXR1cm5zIHRoZSByZW1vdmVkIGFjY2VzcyBpdGVtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBjdHJsLmdldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMuaW5kZXhPZihpdGVtMSkpLnRvQmVHcmVhdGVyVGhhbigtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcy5pbmRleE9mKGl0ZW0yKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbSgpIHJlbW92ZXMgdGhlIGFjY2VzcyBpdGVtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbSkuXHJcbiAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFkZFJlbW92ZWRJdGVtTWVzc2FnZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbTEpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zY3JlZW5SZWFkZXJNZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oKSBkb2VzIG5vdCBhZGQgc2NyZWVuIHJlYWRlciBtZXNzYWdlIGlmIGl0ZW0gbm90IHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZG9SZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgY3RybC5yZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTEpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hZGRSZW1vdmVkSXRlbU1lc3NhZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaGFzUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGlmIGhhcyBubyByZW1vdmUgYWNjZXNzIHJlcXVlc3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNBY2Nlc3NSZXF1ZXN0cztcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoW10pO1xyXG4gICAgICAgICAgICBoYXNBY2Nlc3NSZXF1ZXN0cyA9IGN0cmwuaGFzUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcygpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFzQWNjZXNzUmVxdWVzdHMpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgaGFzIGEgcmVtb3ZlIGFjY2VzcyByZXF1ZXN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNBY2Nlc3NSZXF1ZXN0cztcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoWydmb28nXSk7XHJcbiAgICAgICAgICAgIGhhc0FjY2Vzc1JlcXVlc3RzID0gY3RybC5oYXNSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYXNBY2Nlc3NSZXF1ZXN0cykudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgaGFzIG11bHRpcGxlIHJlbW92ZSBhY2Nlc3MgcmVxdWVzdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGhhc0FjY2Vzc1JlcXVlc3RzO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsnZm9vJywgJ2JhciddKTtcclxuICAgICAgICAgICAgaGFzQWNjZXNzUmVxdWVzdHMgPSBjdHJsLmhhc1JlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhc0FjY2Vzc1JlcXVlc3RzKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnY2FuY2VsQWNjZXNzUmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzcE1vZGFsLCAkcSwgZG9DYW5jZWw7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9zcE1vZGFsXywgXyRxXykge1xyXG4gICAgICAgICAgICAkcSA9IF8kcV87XHJcbiAgICAgICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcbiAgICAgICAgICAgIGRvQ2FuY2VsID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9DYW5jZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogZGVmZXJyZWQucHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gbW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5jYW5jZWxBY2Nlc3NSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBnbyB0byBob21lIGFuZCBjb21wbGV0ZSB0aGUgZmxvdyBpZiBtb2RhbCBpcyBhY2NlcHRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHVwIHRoZSB0ZXN0IHRvIGFjY2VwdCB0aGUgY2FuY2VsIGRpYWxvZy5cclxuICAgICAgICAgICAgZG9DYW5jZWwgPSB0cnVlO1xyXG4gICAgICAgICAgICBjdHJsLmNhbmNlbEFjY2Vzc1JlcXVlc3QoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5nbykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjb25maWcgPSBuYXZpZ2F0aW9uU2VydmljZS5nby5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZykubm90LnRvQmVOdWxsKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb25maWcub3V0Y29tZSkudG9FcXVhbCgndmlld0hvbWUnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZy5zdGF0ZSkudG9FcXVhbCgnaG9tZScpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnLnN0YXRlUGFyYW1zKS50b0VxdWFsKHsgY29tcGxldGVGbG93OiAnYWNjZXNzUmVxdWVzdCcgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGdvIHRvIGhvbWUgaWYgbW9kYWwgaXMgcmVqZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5jYW5jZWxBY2Nlc3NSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2UuZ28pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGRpYWxvZyB3aXRoIGFwcHJvcHJpYXRlIGNvbmZpZ3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5jYW5jZWxBY2Nlc3NSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uY29udGVudCkudG9FcXVhbCgndWlfYWNjZXNzX2NhbmNlbF9yZXF1ZXN0X2RpYWxvZ190ZXh0Jyk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnBvbGljeVZpb2xhdGlvbnMucHVzaCgnZm9vJyk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLmNhbmNlbEFjY2Vzc1JlcXVlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5jb250ZW50KVxyXG4gICAgICAgICAgICAgICAgLnRvRXF1YWwoJ3VpX2FjY2Vzc19jYW5jZWxfcmVxdWVzdF9kaWFsb2dfdmlvbGF0aW9uc190ZXh0Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBOb3Qgc3VyZSBob3cgd2UgY2FuIHJlYWxseSB0ZXN0IHRoZSBhY3Rpb24gZnVuY3Rpb24gb3RoZXIgdGhhbiBpZiBpdCdzIHRoZXJlIG9yIG5vdC5cclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5idXR0b25zWzFdLmFjdGlvbikudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdFdpdGhWaW9sYXRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRxO1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcV8pIHtcclxuICAgICAgICAgICAgJHEgPSBfJHFfO1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucyA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgdGhyb3VnaCB0byBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucy5hbmQucmV0dXJuVmFsdWUoJHEuZGVmZXIoKS5wcm9taXNlKTtcclxuICAgICAgICAgICAgY3RybC5zdWJtaXRXaXRoVmlvbGF0aW9ucygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2Uuc3VibWl0V2l0aFZpb2xhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggcmVxdWlyZWQgY29tbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdmlvbGF0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgICAgIGluaXRpYWxSZXF1aXJlQ29tbWVudDtcclxuXHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF92aW9sYXRpb25TZXJ2aWNlXykge1xyXG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uU2VydmljZSA9IF92aW9sYXRpb25TZXJ2aWNlXztcclxuICAgICAgICAgICAgICAgIGluaXRpYWxSZXF1aXJlQ29tbWVudCA9IGN0cmwucmVxdWlyZVZpb2xhdGlvbkNvbW1lbnQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN0cmwucmVxdWlyZVZpb2xhdGlvbkNvbW1lbnQgPSBpbml0aWFsUmVxdWlyZUNvbW1lbnQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBwcm9tcHQgd2l0aCBjb21tZW50IGRpYWxvZyBpZiByZXF1aXJlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uU2VydmljZS5zaG93Q29tbWVudERpYWxvZyA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKCRxLmRlZmVyKCkucHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnJlcXVpcmVWaW9sYXRpb25Db21tZW50ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHJsLnN1Ym1pdFdpdGhWaW9sYXRpb25zKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHZpb2xhdGlvblNlcnZpY2Uuc2hvd0NvbW1lbnREaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGNhbGwgdGhyb3VnaCB0byBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucyB3aXRoIGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21tZW50ID0gJ3Rlc3QgY29tbWVudCc7XHJcbiAgICAgICAgICAgICAgICB2aW9sYXRpb25TZXJ2aWNlLnNob3dDb21tZW50RGlhbG9nID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihjb21tZW50KSk7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucy5hbmQucmV0dXJuVmFsdWUoJHEuZGVmZXIoKS5wcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIGN0cmwucmVxdWlyZVZpb2xhdGlvbkNvbW1lbnQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0cmwuc3VibWl0V2l0aFZpb2xhdGlvbnMoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2Uuc3VibWl0V2l0aFZpb2xhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucy5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1sxXSkudG9CZShjb21tZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzdWJtaXREZWZlcnJlZCwgcmVzdWJtaXREZWZlcnJlZDtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHEpIHtcclxuICAgICAgICAgICAgc3VibWl0RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICByZXN1Ym1pdERlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Ym1pdERlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2UsICdyZXNvbHZlVmlvbGF0aW9ucycpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1Ym1pdERlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldElkZW50aXRpZXMnKS5hbmQucmV0dXJuVmFsdWUoW2lkZW50aXR5XSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFtyZXF1ZXN0ZWRJdGVtMSwgcmVxdWVzdGVkSXRlbTJdKTtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlcXVlc3RlZEl0ZW1CeUlkJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKGl0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCcxJyA9PT0gaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RlZEl0ZW0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCcyJyA9PT0gaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RlZEl0ZW0yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1VuaGFuZGxlZCBpdGVtIElEOiAnICsgaXRlbUlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoW2l0ZW0yXSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnY2xlYXJzIGl0ZW1zTWlzc2luZ0FjY291bnRTZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuaXRlbXNNaXNzaW5nQWNjb3VudFNlbGVjdGlvbnMgPSBbICdvbmUgZmlzaCcsICd0d28gZmlzaCcgXTtcclxuICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXRlbXNNaXNzaW5nQWNjb3VudFNlbGVjdGlvbnMpLnRvRXF1YWwoW10pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgcmV2aWV3IHNlcnZpY2Ugc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2Uuc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zKS5cclxuICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtpZGVudGl0eV0sIFtyZXF1ZXN0ZWRJdGVtMSwgcmVxdWVzdGVkSXRlbTJdLCBbaXRlbTJdLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHJldmlldyBzZXJ2aWNlIHdpdGggcHJpb3JpdHkgc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuc2V0UHJpb3JpdHkoJ0xvdycpO1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnN1Ym1pdEFjY2Vzc1JlcXVlc3RJdGVtcykuXHJcbiAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChbaWRlbnRpdHldLCBbcmVxdWVzdGVkSXRlbTEsIHJlcXVlc3RlZEl0ZW0yXSwgW2l0ZW0yXSwgJ0xvdycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGFkZCB0cmFja2VkIHByb21pc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHByb21pc2VUcmFja2VyU2VydmljZS50cmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHByb21pc2VUcmFja2VyU2VydmljZS50cmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QocHJvbWlzZVRyYWNrZXJTZXJ2aWNlLmlzSW5Qcm9ncmVzcygpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgcmVzb2x2ZVZpb2xhdGlvbnMgaWYgaGFzIHBvbGljeSB2aW9sYXRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdoYXNQb2xpY3lWaW9sYXRpb25zJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2UucmVzb2x2ZVZpb2xhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnJlc29sdmVWaW9sYXRpb25zLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzFdKS50b0VxdWFsKFtdKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggbWlzc2luZyBhY2NvdW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKFJFU1BPTlNFX0VSUk9SX1RZUEUpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZURhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA0MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzEnOiBbIGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9BQ0NUX1NFTEVDVElPTjEgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcyJzogWyBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFlfQUNDVF9TRUxFQ1RJT04yIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUkVTUE9OU0VfRVJST1JfVFlQRS5NSVNTSU5HQUNDT1VOVFNFTEVDVElPTlNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1ha2UgdGhlIHN1Ym1pc3Npb24gZmFpbC5cclxuICAgICAgICAgICAgICAgIHN1Ym1pdERlZmVycmVkLnJlamVjdChyZXNwb25zZURhdGEpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2V0cyBpc1N1Ym1pdHRpbmcgdG8gZmFsc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UudHJhY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UudHJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UuaXNJblByb2dyZXNzKCkpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdhZGRzIG1pc3NpbmcgYWNjb3VudCBzZWxlY3Rpb25zIHRvIFJlcXVlc3RlZEFjY2Vzc0l0ZW0nLCBpbmplY3QoZnVuY3Rpb24oSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsMSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9BQ0NUX1NFTEVDVElPTjEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsMiA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9BQ0NUX1NFTEVDVElPTjI7XHJcblxyXG4gICAgICAgICAgICAgICAgc3B5T24oSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uLCAnbWVyZ2VBY2NvdW50U2VsZWN0aW9ucycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1ha2UgaXRlbTEgc3RhcnQgd2l0aCBhIHNlbGVjdGlvbiBhbmQgaXRlbTIgbm90IGhhdmUgYW55LiAgVGhlIHNlbGVjdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGluIHRoZSByZXNwb25zZSBzaG91bGQgZ2V0IG1lcmdlZCB3aXRoIHdoYXQgaXMgYWxyZWFkeSB0aGVyZS5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0xLmFjY291bnRTZWxlY3Rpb25zID0gWyBuZXcgSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uKHNlbDIpIF07XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRJdGVtMi5hY2NvdW50U2VsZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1Ym1pdC5cclxuICAgICAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBhY2NvdW50IHNlbGVjdGlvbnMgZ290IHVwZGF0ZWQgb24gdGhlIGl0ZW1zLlxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0xLmFjY291bnRTZWxlY3Rpb25zLmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtMS5hY2NvdW50U2VsZWN0aW9uc1swXS5nZXRJZGVudGl0eUlkKCkpLnRvRXF1YWwoc2VsMi5pZGVudGl0eUlkKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtMS5hY2NvdW50U2VsZWN0aW9uc1sxXS5nZXRJZGVudGl0eUlkKCkpLnRvRXF1YWwoc2VsMS5pZGVudGl0eUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbTIuYWNjb3VudFNlbGVjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0yLmFjY291bnRTZWxlY3Rpb25zWzBdLmdldElkZW50aXR5SWQoKSkudG9FcXVhbChzZWwyLmlkZW50aXR5SWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChJZGVudGl0eUFjY291bnRTZWxlY3Rpb24ubWVyZ2VBY2NvdW50U2VsZWN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2V0cyBpdGVtc01pc3NpbmdBY2NvdW50U2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0xTmFtZSA9IHJlcXVlc3RlZEl0ZW0xLml0ZW0uZ2V0RGlzcGxheWFibGVOYW1lKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTJOYW1lID0gcmVxdWVzdGVkSXRlbTIuaXRlbS5nZXREaXNwbGF5YWJsZU5hbWUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pdGVtc01pc3NpbmdBY2NvdW50U2VsZWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pdGVtc01pc3NpbmdBY2NvdW50U2VsZWN0aW9ucy5pbmRleE9mKGl0ZW0xTmFtZSA+IC0xKSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXRlbXNNaXNzaW5nQWNjb3VudFNlbGVjdGlvbnMuaW5kZXhPZihpdGVtMk5hbWUgPiAtMSkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGl0ZW1zIGFscmVhZHkgYXNzaWduZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oUkVTUE9OU0VfRVJST1JfVFlQRSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDQwMCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbJ2l0ZW0xJywgJ2l0ZW0yJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFJFU1BPTlNFX0VSUk9SX1RZUEUuRFVQTElDQVRFQVNTSUdOTUVOVFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSB0aGUgc3VibWlzc2lvbiBmYWlsLlxyXG4gICAgICAgICAgICAgICAgc3VibWl0RGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlRGF0YSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzZXRzIGlzU3VibWl0dGluZyB0byBmYWxzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHByb21pc2VUcmFja2VyU2VydmljZS50cmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocHJvbWlzZVRyYWNrZXJTZXJ2aWNlLnRyYWNrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocHJvbWlzZVRyYWNrZXJTZXJ2aWNlLmlzSW5Qcm9ncmVzcygpKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UuaXNJblByb2dyZXNzKCkpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzZXRzIGl0ZW1zQWxyZWFkeUFzc2lnbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pdGVtc0FscmVhZHlBc3NpZ25lZC5sZW5ndGgpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pdGVtc0FscmVhZHlBc3NpZ25lZFswXSkudG9FcXVhbCgnaXRlbTEnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLml0ZW1zQWxyZWFkeUFzc2lnbmVkWzFdKS50b0VxdWFsKCdpdGVtMicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzdWJtaXQgc2V0IG5vdGlmaWNhdGlvbnMsIGdvb2QgcmVzcG9uc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGVzdFJlc3A7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRxKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUodGVzdFJlc3ApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihub3RpZmljYXRpb25TZXJ2aWNlLCAnYWRkTm90aWZpY2F0aW9uJyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgTm90aWZpY2F0aW9uU2VydmljZSB3aXRoIHN1Y2Nlc3MgbWVzc2FnZSB3aXRoIGlkZW50aXR5IHJlcXVlc3QgaWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGVzdFJlc3AgPSBnb29kUmVzcDtcclxuICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvblNlcnZpY2UuYWRkTm90aWZpY2F0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd1aV9hY2Nlc3NfcmVxdWVzdF9zdWJtaXR0ZWRfcmVxdWVzdHNfd2l0aF9pZCcsICdTVUNDRVNTJywgWycxMjM0J10pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgTm90aWZpY2F0aW9uU2VydmljZSB3aXRoIHN1Y2Nlc3MgbWVzc2FnZSB3aXRob3V0IGlkZW50aXR5IHJlcXVlc3QgaWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGVzdFJlc3AgPSBnb29kUmVzcE11bHRpcGxlO1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU2VydmljZS5hZGROb3RpZmljYXRpb24pXHJcbiAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3VpX2FjY2Vzc19yZXF1ZXN0X3N1Ym1pdHRlZF9yZXF1ZXN0cycsICdTVUNDRVNTJywgdW5kZWZpbmVkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzdWJtaXQgc2V0IG5vdGlmaWNhdGlvbnMsIGJhZCByZXNwb25zZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRxKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoYmFkUmVzcCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKG5vdGlmaWNhdGlvblNlcnZpY2UsICdhZGROb3RpZmljYXRpb24nKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBOb3RpZmljYXRpb25TZXJ2aWNlIHdpdGggZXJyb3IgbWVzc2FnZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU2VydmljZS5hZGROb3RpZmljYXRpb24pXHJcbiAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3VpX2FjY2Vzc19yZXF1ZXN0X3N1Ym1pdHRlZF9yZXF1ZXN0c19mYWlsZWRfd2l0aF92aW9sYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnRVJST1InLCB1bmRlZmluZWQsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCBzZXQgbm90aWZpY2F0aW9ucywgcGFydGlhbCByZXNwb25zZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRxKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGFydGlhbFJlc3ApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihub3RpZmljYXRpb25TZXJ2aWNlLCAnYWRkTm90aWZpY2F0aW9uJyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgTm90aWZpY2F0aW9uU2VydmljZSB3aXRoIHdhcm5pbmcgbWVzc2FnZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU2VydmljZS5hZGROb3RpZmljYXRpb24pXHJcbiAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3VpX2FjY2Vzc19yZXF1ZXN0X3N1Ym1pdHRlZF9yZXF1ZXN0c19mYWlsdXJlcycsICdXQVJOJywgWzEsMV0sIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCBidXR0b24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvKiBEaXNyZWdhcmQgdGhlIGV4aXN0aW5nIGNvbmRpdGlvbnMsIGhlcmUgd2UgYXJlIHRlc3RpbmcgdGhlIHZpb2xhdGlvbiBzdHVmZiAqL1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaGFzUmVxdWVzdGVkSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdoYXNSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGJlIGRpc2FibGVkIGlmIHRoZXJlIGFyZSBwb2xpY3kgdmlvbGF0aW9ucyBidXQgbm8gc2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaGFzUG9saWN5VmlvbGF0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0U3VibWl0RGlzYWJsZWQoKSkudG9CZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBlbmFibGVkIGlmIHRoZXJlIGFyZSBwb2xpY3kgdmlvbGF0aW9ucyBhbmQgc2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaGFzUG9saWN5VmlvbGF0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgY3RybC5hcHByb3ZhbEl0ZW1SZW1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0U3VibWl0RGlzYWJsZWQoKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCB3b3JrIGl0ZW0gcmVzcG9uc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZGVmZXJyZWQsICRxO1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcV8pIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcclxuICAgICAgICAgICAgJHEgPSBfJHFfO1xyXG4gICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKHdvcmtJdGVtU2VydmljZSwgJ29wZW5Xb3JrSXRlbURpYWxvZycpLmFuZC5yZXR1cm5WYWx1ZShkZWZlcnJlZC5wcm9taXNlKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb3BlbldvcmtJdGVtRGlhbG9nIGZvciBzaW5nbGUgdXNlciBiZWZvcmUgcHJvbXB0aW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5pc1N1cHBvcnRlZFdvcmtJdGVtVHlwZSA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRJZGVudGl0aWVzJykuYW5kLnJldHVyblZhbHVlKFsgaWRlbnRpdHkgXSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh3b3JrSXRlbVJlc3ApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UsICdpc1NpbmdsZVVzZXJSZXF1ZXN0JykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLm9wZW5Xb3JrSXRlbURpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvcGVuV29ya0l0ZW1EaWFsb2cgZm9yIG11bHRpcGxlIHVzZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2UsICdzdWJtaXRBY2Nlc3NSZXF1ZXN0SXRlbXMnKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHdvcmtJdGVtUmVzcCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgJ2lzU2luZ2xlVXNlclJlcXVlc3QnKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLm9wZW5Xb3JrSXRlbURpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvcGVuV29ya0l0ZW1EaWFsb2cgZm9yIHNpbmdsZSB1c2VyIHdpdGhvdXQgd29yayBpdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShnb29kUmVzcCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgJ2lzU2luZ2xlVXNlclJlcXVlc3QnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh3b3JrSXRlbVNlcnZpY2Uub3BlbldvcmtJdGVtRGlhbG9nKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9wZW5Xb3JrSXRlbURpYWxvZyBmb3IgbXVsdGlwbGUgdXNlciB3aXRob3V0IHdvcmsgaXRlbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZSwgJ3N1Ym1pdEFjY2Vzc1JlcXVlc3RJdGVtcycpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZ29vZFJlc3ApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UsICdpc1NpbmdsZVVzZXJSZXF1ZXN0JykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5vcGVuV29ya0l0ZW1EaWFsb2cpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd1bnN1cHBvcnRlZCB3b3JrIGl0ZW0gdHlwZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHN1cHBvcnRlZFdvcmtJdGVtVHlwZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnN1Ym1pdEFjY2Vzc1JlcXVlc3RJdGVtcyA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlKCRxLndoZW4od29ya0l0ZW1SZXNwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmlzU2luZ2xlVXNlclJlcXVlc3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgd29ya0l0ZW1TZXJ2aWNlLmlzU3VwcG9ydGVkV29ya0l0ZW1UeXBlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1cHBvcnRlZFdvcmtJdGVtVHlwZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0dXBGb3JtVG9NYW51YWxBY3Rpb25UZXN0KG1vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBtb2JpbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9mb3IgYSBmb3JtXHJcbiAgICAgICAgICAgICAgICBzdXBwb3J0ZWRXb3JrSXRlbVR5cGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1vY2sgb3BlbldvcmtJdGVtRGlhbG9nIHRvIHJldHVybiBtYW51YWxBY3Rpb24gd29yayBpdGVtXHJcbiAgICAgICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2Uub3BlbldvcmtJdGVtRGlhbG9nID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih3b3JrSXRlbVJlc3BbMF0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtb2NrIHN1Ym1pdCB0byByZXR1cm4gZm9ybSB3b3JrIGl0ZW1cclxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnN1Ym1pdEFjY2Vzc1JlcXVlc3RJdGVtcyA9XHJcbiAgICAgICAgICAgICAgICAgICAgamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihmb3JtV29ya0l0ZW1SZXNwWzBdKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldElkZW50aXRpZXMnKS5hbmQucmV0dXJuVmFsdWUoW2lkZW50aXR5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vZm9yIG1hbnVhbCBhY3Rpb24gd29yayBpdGVtXHJcbiAgICAgICAgICAgICAgICBzdXBwb3J0ZWRXb3JrSXRlbVR5cGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgbW9kYWwgZm9yIHVuc3VwcG9ydGVkIHdvcmsgaXRlbSBvbiBtb2JpbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2Uub3BlblVuU3VwcG9ydGVkV29ya0l0ZW1EaWFsb2cgPSBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5vcGVuVW5TdXBwb3J0ZWRXb3JrSXRlbURpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgdG8gSlNGIHdvcmsgaXRlbSBwYWdlIGZvciB1bnN1cHBvcnRlZCB3b3JrIGl0ZW0gb24gZGVza3RvcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5uYXZpZ2F0ZVRvV29ya0l0ZW1QYWdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh3b3JrSXRlbVJlc3BbMF0ud29ya2Zsb3dXb3JrSXRlbUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5hdmlnYXRlIHRvIEpTRiB3b3JrIGl0ZW0gcGFnZSBmcm9tIGEgZm9ybSBmb3IgdW5zdXBwb3J0ZWQgd29yayBpdGVtIG9uIGRlc2t0b3AnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNldHVwRm9ybVRvTWFudWFsQWN0aW9uVGVzdChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLm5hdmlnYXRlVG9Xb3JrSXRlbVBhZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHdvcmtJdGVtUmVzcFswXS53b3JrZmxvd1dvcmtJdGVtSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgc2hvdyB3YXJuaW5nIG1vZGFsIGZyb20gYSBmb3JtIGZvciB1bnN1cHBvcnRlZCB3b3JrIGl0ZW0gb24gbW9iaWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cEZvcm1Ub01hbnVhbEFjdGlvblRlc3QodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLm9wZW5VblN1cHBvcnRlZFdvcmtJdGVtRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc3VibWl0QWNjZXNzUmVxdWVzdCBwb2xpY3kgdmlvbGF0aW9ucyByZXNwb25zZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRxKSB7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkUmVxdWVzdGVkSXRlbShpdGVtMik7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAnc3VibWl0QWNjZXNzUmVxdWVzdEl0ZW1zJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocG9saWN5VmlvbGF0aW9uUmVzcCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgJ2dldFBvbGljeVZpb2xhdGlvbnMnKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShnb3RQb2xpY3lWaW9sYXRpb25zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSBwb2xpY3kgdmlvbGF0aW9ucyBzZXQgaW4gY3RybCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5oYXNQb2xpY3lWaW9sYXRpb25zKCkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0UG9saWN5VmlvbGF0aW9ucygpLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwuY2xlYXJQb2xpY3lWaW9sYXRpb25zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc1BvbGljeVZpb2xhdGlvbnMoKSkudG9CZUZhbHN5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldFBvbGljeVZpb2xhdGlvbnMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgdXBkYXRlIHRoZSByZXF1ZXN0ZWQgaXRlbXMgd2l0aCB0aGVpciByZXNwZWN0aXZlIGFwcHJvdmFsIGlkcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdGVkSXRlbTtcclxuICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbSA9IGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuZ2V0UmVxdWVzdGVkSXRlbShpdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLmdldEFwcHJvdmFsSXRlbUlkKCkpLnRvRXF1YWwoJ2FwcHJvdmFsSXRlbUlkMScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyBpZiBhbiByZXF1ZXN0IGl0ZW0gaXMgbm90IGZvdW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhcHByb3ZhbEl0ZW1zID0gcG9saWN5VmlvbGF0aW9uUmVzcFswXS5hcHByb3ZhbEl0ZW1zLFxyXG4gICAgICAgICAgICAgICAgc3Rhc2ggPSBhcHByb3ZhbEl0ZW1zWzBdO1xyXG4gICAgICAgICAgICBhcHByb3ZhbEl0ZW1zWzBdID0ge3JlcXVlc3RJdGVtSWQ6ICdkb2VzTm90RXhpc3QnfTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGFwcHJvdmFsSXRlbXNbMF0gPSBzdGFzaDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncmVtb3ZpbmcgYWxsIGl0ZW1zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oQWNjZXNzUmVxdWVzdEl0ZW0sIElkZW50aXR5KSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBzb21lIGlkZW50aXRpZXMgYW5kIGl0ZW1zIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICAgICAgaXRlbTEgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEUpO1xyXG4gICAgICAgICAgICBpdGVtMiA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuRU5USVRMRU1FTlQpO1xyXG5cclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBzdWJtaXQgYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc1JlcXVlc3RlZEl0ZW1zKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwucmVtb3ZlUmVxdWVzdGVkSXRlbShyZXF1ZXN0ZWRJdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc1JlcXVlc3RlZEl0ZW1zKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldFN1Ym1pdERpc2FibGVkKCkpLnRvQmUoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY3RybC5yZW1vdmVSZXF1ZXN0ZWRJdGVtKHJlcXVlc3RlZEl0ZW0yKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaGFzUmVxdWVzdGVkSXRlbXMoKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldFN1Ym1pdERpc2FibGVkKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2V0dGluZyBwcmlvcml0eScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgZGVmYXVsdCB0byBub3JtYWwvbnVsbCBwcmlvcml0eScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRQcmlvcml0eSgpKS50b0JlTnVsbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgc2V0dGluZyBwcmlvcml0eSBvbiBkYXRhIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0UHJpb3JpdHkoKSkudG9CZU51bGwoKTtcclxuICAgICAgICAgICAgY3RybC5zZXRQcmlvcml0eSgnTG93Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UucHJpb3JpdHkpLnRvQmUoJ0xvdycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2VkaXRBY2NvdW50U2VsZWN0aW9ucygpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0sIHJlcXVlc3RlZEl0ZW0sIG1vZGFsRGVmZXJyZWQ7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRxKSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogMzIxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtOiBpdGVtLFxyXG4gICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG1vZGFsRGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2UsICdlZGl0QWNjb3VudFNlbGVjdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUobW9kYWxEZWZlcnJlZC5wcm9taXNlKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiB0aGUgYWNjb3VudCBzZWxlY3Rpb24gZGlhbG9nIHdoZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuZWRpdEFjY291bnRTZWxlY3Rpb25zKHJlcXVlc3RlZEl0ZW0pO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLmVkaXRBY2NvdW50U2VsZWN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCB1cGRhdGUgdGhlIHJlcXVlc3RlZEl0ZW0gd2hlbiB0aGUgZGlhbG9nIGlzIHJlamVjdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhY2NvdW50U2VsZWN0aW9ucyA9IFt7J3RoaXMgaXMnOiAnYSB0ZXN0J31dO1xyXG4gICAgICAgICAgICByZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zID0gYWNjb3VudFNlbGVjdGlvbnM7XHJcbiAgICAgICAgICAgIGN0cmwuZWRpdEFjY291bnRTZWxlY3Rpb25zKHJlcXVlc3RlZEl0ZW0pO1xyXG4gICAgICAgICAgICBtb2RhbERlZmVycmVkLnJlamVjdCgnc29tZSB2YWx1ZScpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RBY2NvdW50U2VsZWN0aW9uU2VydmljZS5lZGl0QWNjb3VudFNlbGVjdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0uYWNjb3VudFNlbGVjdGlvbnMpLnRvQmUoYWNjb3VudFNlbGVjdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgcmVxdWVzdGVkSXRlbSB3aGVuIHRoZSBkaWFsb2cgaXMgcmVzb2x2ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFjY291bnRTZWxlY3Rpb25zID0gW3sndGhpcyBpcyc6ICdhIHRlc3QnfV0sXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkQWNjb3VudFNlbGVjdGlvbnMgPSBbe2ZvbzogJ2Jhcid9LCB7c29tZXRoaW5nOiAnZWxzZSd9XTtcclxuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbS5hY2NvdW50U2VsZWN0aW9ucyA9IGFjY291bnRTZWxlY3Rpb25zO1xyXG4gICAgICAgICAgICBjdHJsLmVkaXRBY2NvdW50U2VsZWN0aW9ucyhyZXF1ZXN0ZWRJdGVtKTtcclxuICAgICAgICAgICAgbW9kYWxEZWZlcnJlZC5yZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb25zOiB1cGRhdGVkQWNjb3VudFNlbGVjdGlvbnNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLmVkaXRBY2NvdW50U2VsZWN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5hY2NvdW50U2VsZWN0aW9ucykudG9CZSh1cGRhdGVkQWNjb3VudFNlbGVjdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dHbG9iYWxTdW5yaXNlU3Vuc2V0RGlhbG9nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNwTW9kYWwsICRxO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfc3BNb2RhbF8sIF8kcV8pIHtcclxuICAgICAgICAgICAgJHEgPSBfJHFfO1xyXG4gICAgICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6ICRxLmRlZmVyKCkucHJvbWlzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiBtb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxBcmdzLCBpdGVtcyxcclxuICAgICAgICAgICAgICAgIHN1bnJpc2VEYXRlID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkUmVxdWVzdGVkSXRlbShpdGVtMik7XHJcblxyXG4gICAgICAgICAgICBpdGVtcyA9IGN0cmwuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcclxuICAgICAgICAgICAgaXRlbXNbMF0uc2V0U3VucmlzZURhdGUoc3VucmlzZURhdGUpO1xyXG4gICAgICAgICAgICBpdGVtc1sxXS5zZXRTdW5yaXNlRGF0ZShzdW5yaXNlRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnNob3dHbG9iYWxTdW5yaXNlU3Vuc2V0RGlhbG9nKCk7XHJcblxyXG4gICAgICAgICAgICBtb2RhbEFyZ3MgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XHJcblxyXG4gICAgICAgICAgICBleHBlY3QobW9kYWxBcmdzLnJlc29sdmUuc3VucmlzZURhdGUoKS5nZXRUaW1lKCkpLnRvQmUoc3VucmlzZURhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1vZGFsQXJncy5yZXNvbHZlLnN1bnNldERhdGUoKSkudG9CZSh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBleHBlY3QobW9kYWxBcmdzLnRpdGxlKS50b0JlKCd1aV9yZXF1ZXN0X2VkaXRfc3RhcnRfZW5kX2RhdGUnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dTdW5yaXNlU3Vuc2V0RGlhbG9nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNwTW9kYWwsICRxO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfc3BNb2RhbF8sIF8kcV8pIHtcclxuICAgICAgICAgICAgJHEgPSBfJHFfO1xyXG4gICAgICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6ICRxLmRlZmVyKCkucHJvbWlzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiBtb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxBcmdzLFxyXG4gICAgICAgICAgICAgICAgc3VucmlzZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTEuc2V0U3VucmlzZURhdGUoc3VucmlzZURhdGUpO1xyXG4gICAgICAgICAgICBjdHJsLnNob3dTdW5yaXNlU3Vuc2V0RGlhbG9nKHJlcXVlc3RlZEl0ZW0xKTtcclxuXHJcbiAgICAgICAgICAgIG1vZGFsQXJncyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChtb2RhbEFyZ3MucmVzb2x2ZS5zdW5yaXNlRGF0ZSgpLmdldFRpbWUoKSkudG9CZShzdW5yaXNlRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBleHBlY3QobW9kYWxBcmdzLnJlc29sdmUuc3Vuc2V0RGF0ZSgpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtb2RhbEFyZ3MudGl0bGUpLnRvQmUoJ3VpX2l0ZW1fZWRpdF9zdGFydF9lbmRfZGF0ZScpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnYXJlR2xvYmFsRGF0ZXNTZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIGl0ZW1cXCdzIGRhdGVzIGRvblxcJ3QgbWF0Y2gnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zLFxyXG4gICAgICAgICAgICAgICAgc3VucmlzZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFyZUdsb2JhbERhdGVzU2V0KCkpLnRvQmVGYWxzeSgpO1xyXG5cclxuICAgICAgICAgICAgaXRlbXMgPSBjdHJsLmdldFJlcXVlc3RlZEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIGl0ZW1zWzBdLnNldFN1bnJpc2VEYXRlKHN1bnJpc2VEYXRlKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFyZUdsb2JhbERhdGVzU2V0KCkpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gaXRlbVxcJ3MgZGF0ZXMgZG8gbWF0Y2gnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zLFxyXG4gICAgICAgICAgICAgICAgc3VucmlzZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFyZUdsb2JhbERhdGVzU2V0KCkpLnRvQmVGYWxzeSgpO1xyXG5cclxuICAgICAgICAgICAgaXRlbXMgPSBjdHJsLmdldFJlcXVlc3RlZEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIGl0ZW1zWzBdLnNldFN1bnJpc2VEYXRlKHN1bnJpc2VEYXRlKTtcclxuICAgICAgICAgICAgaXRlbXNbMV0uc2V0U3VucmlzZURhdGUoc3VucmlzZURhdGUpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYXJlR2xvYmFsRGF0ZXNTZXQoKSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gZGF0ZSBvYmplY3RzIGFyZSBkaWZmZXJlbnQgYnV0IHdpdGggc2FtZSB0aW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyxcclxuICAgICAgICAgICAgICAgIHN1bnJpc2VEYXRlMSA9IG5ldyBEYXRlKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5DVVJSRU5UX0FDQ0VTU19ST0xFLnN1bnJpc2UpLFxyXG4gICAgICAgICAgICAgICAgc3VucmlzZURhdGUyID0gbmV3IERhdGUoYWNjZXNzUmVxdWVzdFRlc3REYXRhLkNVUlJFTlRfQUNDRVNTX1JPTEUuc3VucmlzZSk7XHJcblxyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYXJlR2xvYmFsRGF0ZXNTZXQoKSkudG9CZUZhbHN5KCk7XHJcblxyXG4gICAgICAgICAgICBpdGVtcyA9IGN0cmwuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcclxuICAgICAgICAgICAgaXRlbXNbMF0uc2V0U3VucmlzZURhdGUoc3VucmlzZURhdGUxKTtcclxuICAgICAgICAgICAgaXRlbXNbMV0uc2V0U3VucmlzZURhdGUoc3VucmlzZURhdGUyKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFyZUdsb2JhbERhdGVzU2V0KCkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93Q29tbWVudERpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByb2xlRGF0YSwgc3BNb2RhbCwgJHEsIHJlcXVlc3RlZEFjY2Vzc0l0ZW0sIHJvbGU7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9zcE1vZGFsXywgXyRxXywgUmVxdWVzdGVkQWNjZXNzSXRlbSwgQWNjZXNzUmVxdWVzdEl0ZW0pIHtcclxuICAgICAgICAgICAgcm9sZURhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuQ1VSUkVOVF9BQ0NFU1NfUk9MRTtcclxuICAgICAgICAgICAgcm9sZSA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShyb2xlRGF0YSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEFjY2Vzc0l0ZW0gPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShyb2xlKTtcclxuXHJcbiAgICAgICAgICAgICRxID0gXyRxXztcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiAkcS5kZWZlcigpLnByb21pc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHNob3cgbW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsQXJncztcclxuXHJcbiAgICAgICAgICAgIGN0cmwuc2hvd0NvbW1lbnREaWFsb2cocmVxdWVzdGVkQWNjZXNzSXRlbSk7XHJcblxyXG4gICAgICAgICAgICBtb2RhbEFyZ3MgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XHJcblxyXG4gICAgICAgICAgICBleHBlY3QobW9kYWxBcmdzLnRpdGxlKS50b0JlKCd1aV9hY2Nlc3NfcmVxdWVzdF9jb21tZW50X25vdGVfZGlhbG9nX3RpdGxlJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtb2RhbEFyZ3MucmVzb2x2ZS5yZXF1ZXN0ZWRBY2Nlc3NJdGVtKCkpLnRvQmUocmVxdWVzdGVkQWNjZXNzSXRlbSk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgndXNlU3VucmlzZURhdGVzJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgYmUgZmFsc2Ugd2hlbiBTYWlsUG9pbnQuY29uZmlnRGF0YS5VU0VfU1VOUklTRV9EQVRFUyBpcyBmYWxzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBTYWlsUG9pbnQuY29uZmlnRGF0YS5VU0VfU1VOUklTRV9EQVRFUyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC51c2VTdW5yaXNlRGF0ZXMoKSkudG9CZUZhbHN5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgYmUgdHJ1ZSB3aGVuIFNhaWxQb2ludC5jb25maWdEYXRhLlVTRV9TVU5SSVNFX0RBVEVTIGlzIHRydWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgU2FpbFBvaW50LmNvbmZpZ0RhdGEuVVNFX1NVTlJJU0VfREFURVMgPSB0cnVlO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC51c2VTdW5yaXNlRGF0ZXMoKSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2RlZXAgZmlsdGVyIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaWRlbnRpdHlEYXRhLCBpZGVudGl0eTtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oSWRlbnRpdHksICRxKSB7XHJcbiAgICAgICAgICAgIGlkZW50aXR5RGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWTE7XHJcbiAgICAgICAgICAgIGlkZW50aXR5ID0gbmV3IElkZW50aXR5KGlkZW50aXR5RGF0YSk7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5nZXRUYXJnZXRJZGVudGl0eSA9XHJcbiAgICAgICAgICAgICAgICBqYXNtaW5lLmNyZWF0ZVNweSgnZ2V0VGFyZ2V0SWRlbnRpdHknKS5hbmQuY2FsbEZha2UoKCkgPT4gJHEud2hlbihpZGVudGl0eSkpO1xyXG4gICAgICAgICAgICBzcHlPbihsb2NhdGlvbiwgJ3BhdGgnKS5hbmQucmV0dXJuVmFsdWUoJy9hY2Nlc3NSZXF1ZXN0L3JldmlldycpO1xyXG4gICAgICAgICAgICBzcHlPbihub3RpZmljYXRpb25TZXJ2aWNlLCAnYWRkTm90aWZpY2F0aW9uJyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgZ2V0VGFyZ2V0SWRlbnRpdHkgd2hlbiBkZWVwTGlua1JldmlldyBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5kZWVwTGlua1JldmlldyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgc28gdGhlIGluaXQgZ2V0cyBmaXJlZC5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLmdldFRhcmdldElkZW50aXR5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgZ2V0VGFyZ2V0SWRlbnRpdHkgd2hlbiBkZWVwTGlua1JldmlldyBpcyBmYWxzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UuZGVlcExpbmtSZXZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29udHJvbGxlciBzbyB0aGUgaW5pdCBnZXRzIGZpcmVkLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UuZ2V0VGFyZ2V0SWRlbnRpdHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGVycm9yIGFuZCBnbyBiYWNrIHRvIGhvbWUgaWYgdGFyZ2V0IGlkZW50aXR5IGlzIG51bGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLmRlZXBMaW5rUmV2aWV3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU2VydmljZS5hZGROb3RpZmljYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5hdmlnYXRpb25TZXJ2aWNlLmdvKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gbmF2aWdhdGlvblNlcnZpY2UuZ28uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XHJcbiAgICAgICAgICAgIGV4cGVjdChhcmdzWzBdLnN0YXRlKS50b0VxdWFsKCdob21lJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgYWRkIHJlcXVlc3QgaXRlbXMgZm9yIGVhY2ggcmV2aWV3IGl0ZW0nLCBpbmplY3QoZnVuY3Rpb24oJHEpIHtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLCAnZ2V0UmV2aWV3SXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihbe3RoaW5nOiAndmFsdWUnfV0pKTtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2FkZFJlcXVlc3RlZEl0ZW0nKTtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLmRlZXBMaW5rUmV2aWV3ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29udHJvbGxlciBzbyB0aGUgaW5pdCBnZXRzIGZpcmVkLlxyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dJdGVtRGV0YWlscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByb2xlRGF0YSwgc3BNb2RhbCwgJHEsIHJlcXVlc3RlZEFjY2Vzc0l0ZW0sIHJvbGU7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9zcE1vZGFsXywgXyRxXywgUmVxdWVzdGVkQWNjZXNzSXRlbSwgQWNjZXNzUmVxdWVzdEl0ZW0pIHtcclxuICAgICAgICAgICAgcm9sZURhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuQ1VSUkVOVF9BQ0NFU1NfUk9MRTtcclxuICAgICAgICAgICAgcm9sZSA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShyb2xlRGF0YSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEFjY2Vzc0l0ZW0gPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShyb2xlKTtcclxuXHJcbiAgICAgICAgICAgICRxID0gXyRxXztcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiAkcS5kZWZlcigpLnByb21pc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdoZW4gbm8gaXRlbSBpcyBwYXNzZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zaG93SXRlbURldGFpbHMoKTtcclxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gYSBtb2RhbCBkaWFsb2cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5zaG93SXRlbURldGFpbHMocmVxdWVzdGVkQWNjZXNzSXRlbS5pdGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdoYXNQb2xpY3lWaW9sYXRpb24gZm9yIGl0ZW0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcm9sZURhdGEsXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50RGF0YSxcclxuICAgICAgICAgICAgcm9sZVZpb2xhdGlvbkRhdGEsXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50VmlvbGF0aW9uRGF0YSxcclxuICAgICAgICAgICAgUG9saWN5VmlvbGF0aW9uLFxyXG4gICAgICAgICAgICBBY2Nlc3NSZXF1ZXN0SXRlbSxcclxuICAgICAgICAgICAgUmVxdWVzdGVkQWNjZXNzSXRlbSxcclxuICAgICAgICAgICAgcm9sZSxcclxuICAgICAgICAgICAgZW50aXRsZW1lbnQsXHJcbiAgICAgICAgICAgIHJvbGVWaW9sYXRpb24sXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50VmlvbGF0aW9uLFxyXG4gICAgICAgICAgICByZXF1ZXN0ZWRSb2xlSXRlbSxcclxuICAgICAgICAgICAgcmVxdWVzdGVkRW50aXRsZW1lbnRJdGVtO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXR1cCB0aGUgUG9saWN5VmlvbGF0aW9uIGNsYXNzIGFuZCBjcmVhdGUgc29tZSBkYXRhIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICAgKi9cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXR1cCB0aGUgUG9saWN5VmlvbGF0aW9uIGNsYXNzIGFuZCBjcmVhdGUgc29tZSBkYXRhIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfUG9saWN5VmlvbGF0aW9uXywgX0FjY2Vzc1JlcXVlc3RJdGVtXywgX1JlcXVlc3RlZEFjY2Vzc0l0ZW1fKSB7XHJcbiAgICAgICAgICAgIFBvbGljeVZpb2xhdGlvbiA9IF9Qb2xpY3lWaW9sYXRpb25fO1xyXG4gICAgICAgICAgICBBY2Nlc3NSZXF1ZXN0SXRlbSA9IF9BY2Nlc3NSZXF1ZXN0SXRlbV87XHJcbiAgICAgICAgICAgIFJlcXVlc3RlZEFjY2Vzc0l0ZW0gPSBfUmVxdWVzdGVkQWNjZXNzSXRlbV87XHJcblxyXG4gICAgICAgICAgICByb2xlRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5QT0xJQ1lfVklPTEFUSU9OX1JPTEU7XHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50RGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5QT0xJQ1lfVklPTEFUSU9OX0VOVElUTEVNRU5UO1xyXG4gICAgICAgICAgICByb2xlVmlvbGF0aW9uRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5ST0xFX1BPTElDWV9WSU9MQVRJT05fREFUQTtcclxuICAgICAgICAgICAgZW50aXRsZW1lbnRWaW9sYXRpb25EYXRhID0gYWNjZXNzUmVxdWVzdFRlc3REYXRhLkVOVElUTEVNRU5UX1BPTElDWV9WSU9MQVRJT05fREFUQTtcclxuXHJcbiAgICAgICAgICAgIHJvbGVWaW9sYXRpb24gPSBuZXcgUG9saWN5VmlvbGF0aW9uKHJvbGVWaW9sYXRpb25EYXRhKTtcclxuICAgICAgICAgICAgZW50aXRsZW1lbnRWaW9sYXRpb24gPSBuZXcgUG9saWN5VmlvbGF0aW9uKGVudGl0bGVtZW50VmlvbGF0aW9uRGF0YSk7XHJcbiAgICAgICAgICAgIHJvbGUgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0ocm9sZURhdGEpO1xyXG4gICAgICAgICAgICBlbnRpdGxlbWVudCA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShlbnRpdGxlbWVudERhdGEpO1xyXG4gICAgICAgICAgICByZXF1ZXN0ZWRSb2xlSXRlbSA9IG5ldyBSZXF1ZXN0ZWRBY2Nlc3NJdGVtKHJvbGUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0ZWRFbnRpdGxlbWVudEl0ZW0gPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShlbnRpdGxlbWVudCk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnaGFzIHJvbGUgdmlvbGF0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuY2xlYXJQb2xpY3lWaW9sYXRpb25zKCk7XHJcbiAgICAgICAgICAgIGN0cmwucG9saWN5VmlvbGF0aW9ucy5wdXNoKHJvbGVWaW9sYXRpb24pO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5oYXNQb2xpY3lWaW9sYXRpb24ocmVxdWVzdGVkUm9sZUl0ZW0pKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc1BvbGljeVZpb2xhdGlvbihyZXF1ZXN0ZWRFbnRpdGxlbWVudEl0ZW0pKS50b0JlRmFsc3koKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2hhcyBlbnRpdGxlbWVudCB2aW9sYXRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5jbGVhclBvbGljeVZpb2xhdGlvbnMoKTtcclxuICAgICAgICAgICAgY3RybC5wb2xpY3lWaW9sYXRpb25zLnB1c2goZW50aXRsZW1lbnRWaW9sYXRpb24pO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5oYXNQb2xpY3lWaW9sYXRpb24ocmVxdWVzdGVkUm9sZUl0ZW0pKS50b0JlRmFsc3koKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaGFzUG9saWN5VmlvbGF0aW9uKHJlcXVlc3RlZEVudGl0bGVtZW50SXRlbSkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd1Zpb2xhdGlvbkRldGFpbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BNb2RhbCxcclxuICAgICAgICAgICAgcnVsZU5hbWUgPSAncnVsZScsXHJcbiAgICAgICAgICAgIHBvbGljeU5hbWUgPSAncG9saWN5JztcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3NwTW9kYWxfKSB7XHJcbiAgICAgICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHNldCB0aGUgbW9kYWwgdGl0bGUgdG8gdGhlIHJ1bGUgbmFtZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdmlvbGF0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5TmFtZTogcG9saWN5TmFtZSxcclxuICAgICAgICAgICAgICAgIHJ1bGVOYW1lOiBydWxlTmFtZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjdHJsLnNob3dWaW9sYXRpb25EZXRhaWxzKGl0ZW0xLmlkLCB2aW9sYXRpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS50aXRsZSA9IHJ1bGVOYW1lO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzb3J0QnlQb2xpY3lWaW9sYXRpb24gZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZpbHRlciwgbW9ja0N0cmwsXHJcbiAgICAgICAgICAgIGl0ZW1BID0geyBkaXNwbGF5YWJsZU5hbWU6ICd3aGF0ZXZlcid9LFxyXG4gICAgICAgICAgICBpdGVtQiA9IHsgZGlzcGxheWFibGVOYW1lOiAnc3R1cGlkJ30sXHJcbiAgICAgICAgICAgIGl0ZW1DID0geyBkaXNwbGF5YWJsZU5hbWU6ICdkdW1iJ30sXHJcbiAgICAgICAgICAgIGhhc1Zpb2xhdGlvbnMgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oc29ydEJ5UG9saWN5VmlvbGF0aW9uRmlsdGVyKSB7XHJcbiAgICAgICAgICAgIGZpbHRlciA9IHNvcnRCeVBvbGljeVZpb2xhdGlvbkZpbHRlcjtcclxuXHJcbiAgICAgICAgICAgIG1vY2tDdHJsID0ge1xyXG4gICAgICAgICAgICAgICAgaGFzUG9saWN5VmlvbGF0aW9uczogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc1Zpb2xhdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGhhc1BvbGljeVZpb2xhdGlvbjogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZha2UgaXQgc28gaXRlbSBjIGhhcyB0aGUgdmlvbGF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoaXRlbSA9PT0gaXRlbUMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgbm8gdmlvbGF0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBbaXRlbUEsIGl0ZW1CLCBpdGVtQ107XHJcbiAgICAgICAgICAgIGZpbHRlcihpdGVtcywgbW9ja0N0cmwpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMpLnRvRXF1YWwoW2l0ZW1BLCBpdGVtQiwgaXRlbUNdKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1vY2tDdHJsLmhhc1BvbGljeVZpb2xhdGlvbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ21vdmVzIGl0ZW1zIHdpdGggdmlvbGF0aW9ucyB0byB0aGUgZnJvbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gW2l0ZW1BLCBpdGVtQiwgaXRlbUNdO1xyXG4gICAgICAgICAgICBoYXNWaW9sYXRpb25zID0gdHJ1ZTtcclxuICAgICAgICAgICAgZmlsdGVyKGl0ZW1zLCBtb2NrQ3RybCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcykudG9FcXVhbChbaXRlbUMsIGl0ZW1BLCBpdGVtQl0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
