System.register(['test/js/TestInitializer', 'workitem/WorkItemModule', 'test/js/TestModule', 'test/js/CustomMatchers'], function (_export) {
    /* (c) Copyright 2014 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * Tests for WorkItemService.
     */
    'use strict';

    var workItemModule, testModule, CustomMatchers;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_workitemWorkItemModule) {
            workItemModule = _workitemWorkItemModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_testJsCustomMatchers) {
            CustomMatchers = _testJsCustomMatchers['default'];
        }],
        execute: function () {
            describe('WorkItemService', function () {

                var baseURL = '/identityiq/ui/rest/workItems',
                    ID1 = 'id1',
                    ID2 = 'id2',
                    ID3 = 'id3',
                    ID4 = 'id4',
                    ID5 = 'id5',
                    approvalData = {
                    id: ID1,
                    target: {
                        id: 'target1Id',
                        name: 'target1Name',
                        displayName: 'target1DisplayName',
                        workgroup: false
                    },
                    requester: {
                        id: 'requester1Id',
                        name: 'requester1Name',
                        displayName: 'requester1DisplayName',
                        workgroup: false
                    },
                    created: 1423077394799,
                    workItemType: 'Approval',
                    approvalItems: [{
                        commentCount: 1,
                        displayValue: 'Benefits Display',
                        value: 'Benefits',
                        id: 'item1',
                        itemType: 'Role',
                        operation: 'Add',
                        newAccount: true,
                        description: null,
                        owner: {
                            id: '897987f',
                            name: 'Bob.Jones',
                            displayName: 'Bob Jones'
                        },
                        assignmentNote: null
                    }]
                },
                    violationReviewWorkItemData = {
                    id: ID2,
                    target: {
                        id: 'target2Id',
                        name: 'target2Name',
                        displayName: 'target2DisplayName',
                        workgroup: false
                    },
                    requester: {
                        id: 'requester2Id',
                        name: 'requester2Name',
                        displayName: 'requester2DisplayName',
                        workgroup: false
                    },
                    created: 1423077394790,
                    workItemType: 'ViolationReview',
                    violations: [{ violation: 'details' }],
                    requestedItems: [{ entitlementValue: 'value' }]
                },
                    workItemData = {
                    id: ID3,
                    target: {
                        id: 'target3Id',
                        name: 'target3Name',
                        displayName: 'target3DisplayName',
                        workgroup: false
                    },
                    requester: {
                        id: 'requester3Id',
                        name: 'requester3Name',
                        displayName: 'requester3DisplayName',
                        workgroup: false
                    },
                    created: 1423077394799,
                    workItemType: 'SomeOtherType'
                },
                    formData = {
                    id: ID4,
                    target: {
                        id: 'target4Id',
                        name: 'target4Name',
                        displayName: 'target4DisplayName',
                        workgroup: false
                    },
                    requester: {
                        id: 'requester4Id',
                        name: 'requester4Name',
                        displayName: 'requester4DisplayName',
                        workgroup: false
                    },
                    created: 1423077394799,
                    workItemType: 'Form',
                    forms: [{ form: 'details' }]
                },
                    nonAccessRequestApprovalData = {
                    id: ID5,
                    target: {
                        id: 'target1Id',
                        name: 'target1Name',
                        displayName: 'target1DisplayName',
                        workgroup: false
                    },
                    requester: {
                        id: 'requester1Id',
                        name: 'requester1Name',
                        displayName: 'requester1DisplayName',
                        workgroup: false
                    },
                    created: 1423077394799,
                    workItemType: 'Approval'
                },
                    workItemService,
                    testService,
                    $httpBackend,
                    WorkItem,
                    infoModalService,
                    ViolationReviewWorkItem,
                    Approval,
                    $rootScope,
                    spModal,
                    $q,
                    modalInstance;

                // Use the access request module.
                beforeEach(module(workItemModule, testModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                    /* Override the spWorkItem directive with a do nothing directive so we can
                     * unit test the workitem dialog without having to worry about anything
                     * sp-work-item does. */
                    $provide.service('spWorkItemDirective', function () {
                        return {};
                    });
                    /* This is still a bit magical, it may be related to this ui-bootstrap issue
                     * (https://github.com/angular-ui/bootstrap/issues/3633), but if we do not turn
                     * off animations the dialogs do not get removed from the dom during test.
                     * Additionally after dismissing a modal we need to manually flush $timeout */
                    $provide.decorator('$modal', function ($delegate) {
                        return {
                            open: function (options) {
                                options.animation = false;
                                return $delegate.open(options);
                            }
                        };
                    });
                }));

                /* jshint maxparams: 10 */
                beforeEach(inject(function (_WorkItem_, _ViolationReviewWorkItem_, _Approval_, _spModal_, _testService_, _infoModalService_, _workItemService_, _$httpBackend_, _$rootScope_, _$q_) {
                    WorkItem = _WorkItem_;
                    ViolationReviewWorkItem = _ViolationReviewWorkItem_;
                    Approval = _Approval_;
                    workItemService = _workItemService_;
                    $httpBackend = _$httpBackend_;
                    $rootScope = _$rootScope_;
                    spModal = _spModal_;
                    infoModalService = _infoModalService_;
                    testService = _testService_;
                    $q = _$q_;

                    /* The functions under test do not return a reference to the modal,
                     * sneak a reference out so we can programatically close it without
                     * falling back to searching the dom for the exit button */
                    var originalOpen = spModal.open;
                    spModal.open = function () {
                        modalInstance = originalOpen.apply(spModal, arguments);
                        return modalInstance;
                    };
                }));

                afterEach(inject(function ($timeout) {
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                    if (modalInstance) {
                        modalInstance.dismiss();
                        $timeout.flush();
                    }
                }));

                function checkWorkItem(workItem, id, type, workItemType) {
                    expect(workItem instanceof type).toBeTruthy();
                    expect(workItem.id).toEqual(id);
                    expect(workItem.workItemType).toEqual(workItemType);
                }

                describe('getWorkItem()', function () {
                    function testGetWorkItem(id, data, expectedType, expectedWorkItemType) {
                        var url = baseURL + '/' + id,
                            returnedWorkItem,
                            returnedPromise;

                        $httpBackend.expectGET(url).respond(200, data);
                        returnedPromise = workItemService.getWorkItem(id);
                        returnedPromise.then(function (workItem) {
                            returnedWorkItem = workItem;
                        });
                        $httpBackend.flush();
                        $rootScope.$apply();

                        checkWorkItem(returnedWorkItem, id, expectedType, expectedWorkItemType);
                    }

                    it('returns an approval', function () {
                        testGetWorkItem(ID1, approvalData, Approval, 'Approval');
                    });

                    it('returns a violation review', function () {
                        testGetWorkItem(ID2, violationReviewWorkItemData, ViolationReviewWorkItem, 'ViolationReview');
                    });

                    it('returns a work item', function () {
                        testGetWorkItem(ID3, workItemData, WorkItem, 'SomeOtherType');
                    });

                    it('returns rejected promise if work item does not exist', function () {
                        var rejectPromise,
                            rejected = false,
                            workItemId = '12345',
                            url = baseURL + '/' + workItemId;

                        $httpBackend.expectGET(url).respond(404, '');

                        rejectPromise = workItemService.getWorkItem(workItemId);

                        rejectPromise['catch'](function () {
                            rejected = true;
                        });

                        $httpBackend.flush();
                        $rootScope.$apply();

                        expect(rejected).toBe(true);
                    });
                });

                describe('getWorkItemFromSession()', function () {
                    var SESSION_URL = baseURL + '/session';

                    it('calls out to proper REST endpoint', function () {
                        $httpBackend.expectGET(SESSION_URL).respond(200, workItemData);

                        workItemService.getWorkItemFromSession().then(function (workItem) {
                            checkWorkItem(workItem, workItemData.id, WorkItem, 'SomeOtherType');
                        });

                        $httpBackend.flush();
                    });

                    it('returns a rejected promise if work item does not exist', function () {
                        var rejected = false;

                        $httpBackend.expectGET(SESSION_URL).respond(404, '');

                        workItemService.getWorkItemFromSession()['catch'](function () {
                            rejected = true;
                        });

                        $httpBackend.flush();
                        $rootScope.$apply();

                        expect(rejected).toEqual(true);
                    });
                });

                describe('getWorkItems()', function () {

                    it('should pass through to getWorkItemsByType', function () {
                        var start = 0,
                            limit = 10,
                            sort = [{ 'property': 'created', 'direction': 'DESC' }];

                        workItemService.getWorkItemsByType = testService.createPromiseSpy(false, {}, {});

                        workItemService.getWorkItems(start, limit, sort);

                        expect(workItemService.getWorkItemsByType).toHaveBeenCalled();
                        expect(workItemService.getWorkItemsByType).toHaveBeenCalledWith([], start, limit, sort);
                    });
                });

                describe('getWorkItemsByType()', function () {
                    var sort = {
                        toJson: jasmine.createSpy().and.returnValue(angular.toJson([{ 'property': 'created', 'direction': 'DESC' }]))
                    };

                    function testGetWorkItemsByType(params, queryString) {
                        $httpBackend.expectGET(baseURL + queryString).respond(200, {});
                        workItemService.getWorkItemsByType(params.type, params.start, params.limit, params.sort);
                        $httpBackend.flush();
                    }

                    it('should pass the type param specified in an array', function () {
                        var params = {
                            type: ['Form'],
                            start: 0,
                            limit: 10,
                            sort: sort
                        },
                            queryStr = '/?limit=10&sort=%5B%7B%22property%22:%22created%22,' + '%22direction%22:%22DESC%22%7D%5D&start=0&type=Form';

                        testGetWorkItemsByType(params, queryStr);
                    });

                    it('should send a single type when string specified', function () {
                        var params = {
                            type: 'Form',
                            start: 0,
                            limit: 10,
                            sort: sort
                        },
                            queryStr = '/?limit=10&sort=%5B%7B%22property%22:%22created%22,' + '%22direction%22:%22DESC%22%7D%5D&start=0&type=Form';

                        testGetWorkItemsByType(params, queryStr);
                    });

                    it('should pass multiple type params if specified', function () {
                        var params = {
                            type: ['Form', 'Approval'],
                            start: 0,
                            limit: 10,
                            sort: sort
                        },
                            queryStr = '/?limit=10&sort=%5B%7B%22property%22:%22created%22,' + '%22direction%22:%22DESC%22%7D%5D&start=0&type=Form&type=Approval';

                        testGetWorkItemsByType(params, queryStr);
                    });

                    it('should not send a type when empty array specified', function () {
                        var params = {
                            type: [],
                            start: 0,
                            limit: 10,
                            sort: sort
                        },
                            queryStr = '/?limit=10&sort=%5B%7B%22property%22:%22created%22,' + '%22direction%22:%22DESC%22%7D%5D&start=0';

                        testGetWorkItemsByType(params, queryStr);
                    });

                    it('should not send a type when undefined specified', function () {
                        var params = {
                            start: 0,
                            limit: 10,
                            sort: sort
                        },
                            queryStr = '/?limit=10&sort=%5B%7B%22property%22:%22created%22,' + '%22direction%22:%22DESC%22%7D%5D&start=0';

                        testGetWorkItemsByType(params, queryStr);
                    });
                });

                describe('createWorkItem()', function () {
                    function testCreateWorkItem(id, data, expectedType, expectedWorkItemType) {
                        var workItem = workItemService.createWorkItem(data);
                        expect(workItem instanceof expectedType).toBeTruthy();
                        expect(workItem.getId()).toEqual(id);
                        expect(workItem.getWorkItemType()).toEqual(expectedWorkItemType);
                    }

                    it('creates an approval', function () {
                        testCreateWorkItem(ID1, approvalData, Approval, 'Approval');
                    });

                    it('creates a violation review', function () {
                        testCreateWorkItem(ID2, violationReviewWorkItemData, ViolationReviewWorkItem, 'ViolationReview');
                    });

                    it('creates a work item', function () {
                        testCreateWorkItem(ID3, workItemData, WorkItem, 'SomeOtherType');
                    });

                    it('creates a work item for an approval without approval items', function () {
                        testCreateWorkItem(ID5, nonAccessRequestApprovalData, WorkItem, 'Approval');
                    });
                });

                describe('openWorkItemDialog', function () {
                    function setUpGetWorkItem(data) {
                        var workItem = workItemService.createWorkItem(data),
                            deferred = $q.defer();
                        deferred.resolve(workItem);
                        spyOn(workItemService, 'getWorkItem').and.returnValue(deferred.promise);
                    }

                    function testAlertTitleMessageKey(key, length) {
                        spyOn(spModal, 'open').and.callThrough();
                        workItemService.openWorkItemDialog('id', 'full');
                        $rootScope.$apply();
                        var element = angular.element('#modal-content .no-pad')[0];
                        expect(angular.element(element).find('.alert-title').length).toBe(length);
                        if (key) {
                            expect(angular.element(element).find('.alert-title')[0].innerText).toBe(key);
                        }
                    }

                    it('should open spModal when called', function () {
                        setUpGetWorkItem(violationReviewWorkItemData);
                        spyOn(spModal, 'open').and.callThrough();
                        workItemService.openWorkItemDialog('id', 'full');
                        $rootScope.$broadcast('$animate:close');
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should set appropriate message key for violation workitem', function () {
                        setUpGetWorkItem(violationReviewWorkItemData);
                        testAlertTitleMessageKey('ui_work_item_dialog_violation_alert', 1);
                    });

                    it('should set appropriate message key for approval workitem', function () {
                        setUpGetWorkItem(approvalData);
                        testAlertTitleMessageKey('ui_work_item_dialog_approval_alert', 1);
                    });

                    it('should not show alert div when workitem type does not support Later functionality', function () {
                        setUpGetWorkItem(formData);
                        testAlertTitleMessageKey(null, 0);
                    });
                });

                describe('showDetailsDialog()', function () {
                    it('should open spModal', function () {
                        var workItem;
                        spyOn(spModal, 'open');
                        workItem = workItemService.createWorkItem(workItemData);
                        workItemService.showDetailsDialog(workItem);
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('showForwardDialog()', function () {
                    it('should open spModal', function () {
                        var workItem = undefined,
                            title = 'work_item_title',
                            helpText = 'help_text';
                        spyOn(spModal, 'open');
                        workItem = workItemService.createWorkItem(workItemData);
                        workItemService.showForwardDialog(workItem, function () {}, title, helpText);
                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].title).toEqual(title);
                        expect(spModal.open.calls.mostRecent().args[0].resolve.helpText()).toEqual(helpText);
                    });
                });

                describe('getForwardingHistory()', function () {
                    var workItemId = '1234',
                        historyUrl = baseURL + '/' + workItemId + '/ownerHistory',
                        history = [{
                        previousOwner: 'J-bob',
                        newOwner: 'K-bob',
                        date: 1391618385380,
                        comment: 'Hey K-bob ... take care of this'
                    }, {
                        previousOwner: 'K-bob',
                        newOwner: 'Foo-bob',
                        date: 1391618389999,
                        comment: 'Nope ... Foo-bob gets to deal.'
                    }];

                    // Add a custom matcher to check an $http GET response.
                    beforeEach(function () {
                        jasmine.addMatchers(CustomMatchers);
                    });

                    it('gets forwarding history', function () {
                        var ownerHistory;
                        $httpBackend.expectGET(historyUrl).respond(200, history);
                        ownerHistory = workItemService.getForwardingHistory(workItemId);
                        $httpBackend.flush();
                        ownerHistory.then(function (result) {
                            expect(result).toEqualResponse(history);
                        });
                    });

                    it('fails on REST error', function () {
                        var ownerHistory;
                        $httpBackend.expectGET(historyUrl).respond(500, '');
                        ownerHistory = workItemService.getForwardingHistory(workItemId);
                        $httpBackend.flush();
                        ownerHistory.then(function (result) {
                            expect(result.length).toEqual(0);
                        });
                    });

                    it('pukes with no workItemId', function () {
                        expect(function () {
                            workItemService.getForwardingHistory(null);
                        }).toThrow();
                        $httpBackend.verifyNoOutstandingRequest();
                    });
                });

                describe('getIdentityDetails()', function () {
                    it('should make REST call to identityDetails', function () {
                        var url = baseURL + '/1/identityDetails';
                        $httpBackend.expectGET(url).respond(200, {});
                        workItemService.getIdentityDetails('1');
                        $httpBackend.flush();
                    });
                });

                describe('deleteWorkItem()', function () {
                    function testDeleteWorkItem(id, data) {
                        var url = baseURL + '/' + id;
                        $httpBackend.expectDELETE(url).respond(200);
                        workItemService.deleteWorkItem(id);
                        $httpBackend.flush();
                    }

                    it('deletes an approval work item', function () {
                        testDeleteWorkItem(ID1, workItemData);
                    });
                    it('deletes a violation review work item', function () {
                        testDeleteWorkItem(ID2, workItemData);
                    });
                    it('deletes a other type work item', function () {
                        testDeleteWorkItem(ID3, workItemData);
                    });
                });

                describe('forwardWorkItem()', function () {
                    var getUrl = function (workItemId) {
                        return baseURL + '/' + workItemId + '/forward';
                    };

                    it('sends a POST request with comment', function () {
                        var promise, spy;
                        $httpBackend.expectPOST(getUrl(workItemData.id), { targetIdentity: '4567', comment: 'random comment' }).respond(200, '{"message":null,"success":true}');
                        promise = workItemService.forwardWorkItem(workItemData.id, '4567', 'random comment');
                        spy = testService.spyOnSuccess(promise);
                        $httpBackend.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('sends a POST request without comment', function () {
                        var promise, spy;
                        $httpBackend.expectPOST(getUrl(workItemData.id), { targetIdentity: '4567' }).respond(200, '{"message":null,"success":true}');
                        promise = workItemService.forwardWorkItem(workItemData.id, '4567', null);
                        spy = testService.spyOnSuccess(promise);
                        $httpBackend.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        $httpBackend.expectPOST(getUrl(workItemData.id)).respond(500, '');
                        promise = workItemService.forwardWorkItem(workItemData.id, '4567', null);
                        spy = testService.spyOnFailure(promise);
                        $httpBackend.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST SuccessResult error', function () {
                        var promise, spy;
                        $httpBackend.expectPOST(getUrl(workItemData.id)).respond(200, '{"message":"Cannot forward work item to existing owner","success":false}');
                        promise = workItemService.forwardWorkItem(workItemData.id, '4567', 'this should fail');
                        spy = testService.spyOnFailure(promise);
                        $httpBackend.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no workItemId', function () {
                        expect(function () {
                            workItemService.forwardWorkItem(null, '4567', null);
                        }).toThrow();
                        $httpBackend.verifyNoOutstandingRequest();
                    });

                    it('pukes with no targetIdentity', function () {
                        expect(function () {
                            workItemService.forwardWorkItem(workItemData.id, null, null);
                        }).toThrow();
                        $httpBackend.verifyNoOutstandingRequest();
                    });
                });

                describe('isSupportedWorkItemType()', function () {

                    it('matches an approval', function () {
                        expect(workItemService.isSupportedWorkItemType(approvalData.workItemType)).toBe(true);
                        $httpBackend.verifyNoOutstandingRequest();
                    });

                    it('matches a form', function () {
                        expect(workItemService.isSupportedWorkItemType(formData.workItemType)).toBe(true);
                        $httpBackend.verifyNoOutstandingRequest();
                    });

                    it('matches a violation review', function () {
                        expect(workItemService.isSupportedWorkItemType(violationReviewWorkItemData.workItemType)).toBe(true);
                        $httpBackend.verifyNoOutstandingRequest();
                    });

                    it('is not a supported work item type', function () {
                        expect(workItemService.isSupportedWorkItemType(workItemData.workItemType)).toBe(false);
                        $httpBackend.verifyNoOutstandingRequest();
                    });

                    it('throws an exception for null work item type', function () {
                        expect(function () {
                            workItemService.isSupportedWorkItemType(null);
                        }).toThrow();
                        $httpBackend.verifyNoOutstandingRequest();
                    });
                });

                describe('openUnSupportedWorkItemDialog()', function () {

                    it('should open infoModal when called', function () {
                        spyOn(infoModalService, 'open').and.callThrough();
                        workItemService.openUnSupportedWorkItemDialog();
                        $rootScope.$apply();
                        expect(infoModalService.open).toHaveBeenCalled();
                    });
                });

                describe('getWorkItemTypeTranslation', function () {

                    it('should throw if type is null', function () {
                        expect(function () {
                            workItemService.getWorkItemTypeTranslation(null, 'ui_foobar');
                        }).toThrow();
                    });

                    it('should throw if messageKey is null', function () {
                        expect(function () {
                            workItemService.getWorkItemTypeTranslation('foo', null);
                        }).toThrow();
                    });

                    it('should not throw if type and messageKey are not null', function () {
                        expect(function () {
                            workItemService.getWorkItemTypeTranslation('foo', 'ui_foobar');
                        }).not.toThrow();
                    });
                });

                describe('navigateToWorkItemPage', function () {
                    var navigationService;
                    beforeEach(inject(function (_navigationService_) {
                        navigationService = _navigationService_;
                        spyOn(navigationService, 'go');
                    }));

                    it('throws if workItemId is null', function () {
                        expect(function () {
                            workItemService.navigateToWorkItemPage();
                        }).toThrow();
                    });

                    it('navigates to the viewWorkItem outcome', function () {
                        workItemService.navigateToWorkItemPage('1234');
                        expect(navigationService.go).toHaveBeenCalledWith({
                            outcome: 'viewWorkItem?id=1234'
                        });
                    });

                    it('adds reset flag', function () {
                        workItemService.navigateToWorkItemPage('1234', true);
                        expect(navigationService.go).toHaveBeenCalledWith({
                            outcome: 'viewWorkItem?id=1234&reset=true'
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtpdGVtL1dvcmtJdGVtU2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwyQkFBMkIsc0JBQXNCLDJCQUEyQixVQUFVLFNBQVM7Ozs7OztJQUMzSTs7SUFPSSxJQUFJLGdCQUFnQixZQUFZO0lBQ2hDLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCO1dBQ2hDLFVBQVUsdUJBQXVCO1lBQ2hDLGlCQUFpQixzQkFBc0I7O1FBRTNDLFNBQVMsWUFBWTtZQU43QixTQUFTLG1CQUFtQixZQUFXOztnQkFFbkMsSUFBSSxVQUFVO29CQUNWLE1BQU07b0JBQ04sTUFBTTtvQkFDTixNQUFNO29CQUNOLE1BQU07b0JBQ04sTUFBTTtvQkFDTixlQUFlO29CQUNYLElBQUk7b0JBQ0osUUFBUTt3QkFDSixJQUFJO3dCQUNKLE1BQU07d0JBQ04sYUFBYTt3QkFDYixXQUFXOztvQkFFZixXQUFXO3dCQUNQLElBQUk7d0JBQ0osTUFBTTt3QkFDTixhQUFhO3dCQUNiLFdBQVc7O29CQUVmLFNBQVM7b0JBQ1QsY0FBYztvQkFDZCxlQUFlLENBQUM7d0JBQ1osY0FBYzt3QkFDZCxjQUFjO3dCQUNkLE9BQU87d0JBQ1AsSUFBSTt3QkFDSixVQUFVO3dCQUNWLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixhQUFhO3dCQUNiLE9BQU87NEJBQ0gsSUFBSTs0QkFDSixNQUFNOzRCQUNOLGFBQWE7O3dCQUVqQixnQkFBZ0I7OztvQkFHeEIsOEJBQThCO29CQUMxQixJQUFJO29CQUNKLFFBQVE7d0JBQ0osSUFBSTt3QkFDSixNQUFNO3dCQUNOLGFBQWE7d0JBQ2IsV0FBVzs7b0JBRWYsV0FBVzt3QkFDUCxJQUFJO3dCQUNKLE1BQU07d0JBQ04sYUFBYTt3QkFDYixXQUFXOztvQkFF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Q2QsZ0JBQWdCOzJCQUNqQjs7O29CQUdQLEdBQUcseUNBQXlDLFlBQVc7d0JBQ25ELGdCQUFnQix1QkFBdUI7d0JBQ3ZDLE9BQU8sa0JBQWtCLElBQUkscUJBQXFCOzRCQUM5QyxTQUFTOzs7O29CQUlqQixHQUFHLG1CQUFtQixZQUFXO3dCQUM3QixnQkFBZ0IsdUJBQXVCLFFBQVE7d0JBQy9DLE9BQU8sa0JBQWtCLElBQUkscUJBQXFCOzRCQUM5QyxTQUFTOzs7Ozs7O0dBT3RCIiwiZmlsZSI6IndvcmtpdGVtL1dvcmtJdGVtU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE0IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHdvcmtJdGVtTW9kdWxlIGZyb20gJ3dvcmtpdGVtL1dvcmtJdGVtTW9kdWxlJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5pbXBvcnQgQ3VzdG9tTWF0Y2hlcnMgZnJvbSAndGVzdC9qcy9DdXN0b21NYXRjaGVycyc7XG5cbi8qKlxuICogVGVzdHMgZm9yIFdvcmtJdGVtU2VydmljZS5cbiAqL1xuZGVzY3JpYmUoJ1dvcmtJdGVtU2VydmljZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGJhc2VVUkwgPSAnL2lkZW50aXR5aXEvdWkvcmVzdC93b3JrSXRlbXMnLFxuICAgICAgICBJRDEgPSAnaWQxJyxcbiAgICAgICAgSUQyID0gJ2lkMicsXG4gICAgICAgIElEMyA9ICdpZDMnLFxuICAgICAgICBJRDQgPSAnaWQ0JyxcbiAgICAgICAgSUQ1ID0gJ2lkNScsXG4gICAgICAgIGFwcHJvdmFsRGF0YSA9IHtcbiAgICAgICAgICAgIGlkOiBJRDEsXG4gICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICBpZDogJ3RhcmdldDFJZCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RhcmdldDFOYW1lJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ3RhcmdldDFEaXNwbGF5TmFtZScsXG4gICAgICAgICAgICAgICAgd29ya2dyb3VwOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVlc3Rlcjoge1xuICAgICAgICAgICAgICAgIGlkOiAncmVxdWVzdGVyMUlkJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVxdWVzdGVyMU5hbWUnLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAncmVxdWVzdGVyMURpc3BsYXlOYW1lJyxcbiAgICAgICAgICAgICAgICB3b3JrZ3JvdXA6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlZDogMTQyMzA3NzM5NDc5OSxcbiAgICAgICAgICAgIHdvcmtJdGVtVHlwZTogJ0FwcHJvdmFsJyxcbiAgICAgICAgICAgIGFwcHJvdmFsSXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgY29tbWVudENvdW50OiAxLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlWYWx1ZTogJ0JlbmVmaXRzIERpc3BsYXknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnQmVuZWZpdHMnLFxuICAgICAgICAgICAgICAgIGlkOiAnaXRlbTEnLFxuICAgICAgICAgICAgICAgIGl0ZW1UeXBlOiAnUm9sZScsXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiAnQWRkJyxcbiAgICAgICAgICAgICAgICBuZXdBY2NvdW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsLFxuICAgICAgICAgICAgICAgIG93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnODk3OTg3ZicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCb2IuSm9uZXMnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0JvYiBKb25lcydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnROb3RlOiBudWxsXG4gICAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICB2aW9sYXRpb25SZXZpZXdXb3JrSXRlbURhdGEgPSB7XG4gICAgICAgICAgICBpZDogSUQyLFxuICAgICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICAgICAgaWQ6ICd0YXJnZXQySWQnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICd0YXJnZXQyTmFtZScsXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICd0YXJnZXQyRGlzcGxheU5hbWUnLFxuICAgICAgICAgICAgICAgIHdvcmtncm91cDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1ZXN0ZXI6IHtcbiAgICAgICAgICAgICAgICBpZDogJ3JlcXVlc3RlcjJJZCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JlcXVlc3RlcjJOYW1lJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ3JlcXVlc3RlcjJEaXNwbGF5TmFtZScsXG4gICAgICAgICAgICAgICAgd29ya2dyb3VwOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDE0MjMwNzczOTQ3OTAsXG4gICAgICAgICAgICB3b3JrSXRlbVR5cGU6ICdWaW9sYXRpb25SZXZpZXcnLFxuICAgICAgICAgICAgdmlvbGF0aW9uczogW3t2aW9sYXRpb246ICdkZXRhaWxzJ31dLFxuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbXM6IFt7ZW50aXRsZW1lbnRWYWx1ZTogJ3ZhbHVlJ31dXG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtJdGVtRGF0YSA9IHtcbiAgICAgICAgICAgIGlkOiBJRDMsXG4gICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICBpZDogJ3RhcmdldDNJZCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RhcmdldDNOYW1lJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ3RhcmdldDNEaXNwbGF5TmFtZScsXG4gICAgICAgICAgICAgICAgd29ya2dyb3VwOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVlc3Rlcjoge1xuICAgICAgICAgICAgICAgIGlkOiAncmVxdWVzdGVyM0lkJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVxdWVzdGVyM05hbWUnLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAncmVxdWVzdGVyM0Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAgICAgICB3b3JrZ3JvdXA6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlZDogMTQyMzA3NzM5NDc5OSxcbiAgICAgICAgICAgIHdvcmtJdGVtVHlwZTogJ1NvbWVPdGhlclR5cGUnXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1EYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiBJRDQsXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAndGFyZ2V0NElkJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3RhcmdldDROYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICd0YXJnZXQ0RGlzcGxheU5hbWUnLFxuICAgICAgICAgICAgICAgICAgICB3b3JrZ3JvdXA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdyZXF1ZXN0ZXI0SWQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAncmVxdWVzdGVyNE5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ3JlcXVlc3RlcjREaXNwbGF5TmFtZScsXG4gICAgICAgICAgICAgICAgICAgIHdvcmtncm91cDogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNyZWF0ZWQ6IDE0MjMwNzczOTQ3OTksXG4gICAgICAgICAgICAgICAgd29ya0l0ZW1UeXBlOiAnRm9ybScsXG4gICAgICAgICAgICAgICAgZm9ybXM6IFt7Zm9ybTogJ2RldGFpbHMnfV1cbiAgICAgICAgfSxcbiAgICAgICAgbm9uQWNjZXNzUmVxdWVzdEFwcHJvdmFsRGF0YSA9IHtcbiAgICAgICAgICAgIGlkOiBJRDUsXG4gICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICBpZDogJ3RhcmdldDFJZCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RhcmdldDFOYW1lJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ3RhcmdldDFEaXNwbGF5TmFtZScsXG4gICAgICAgICAgICAgICAgd29ya2dyb3VwOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVlc3Rlcjoge1xuICAgICAgICAgICAgICAgIGlkOiAncmVxdWVzdGVyMUlkJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVxdWVzdGVyMU5hbWUnLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAncmVxdWVzdGVyMURpc3BsYXlOYW1lJyxcbiAgICAgICAgICAgICAgICB3b3JrZ3JvdXA6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlZDogMTQyMzA3NzM5NDc5OSxcbiAgICAgICAgICAgIHdvcmtJdGVtVHlwZTogJ0FwcHJvdmFsJ1xuICAgICAgICB9LFxuICAgICAgICB3b3JrSXRlbVNlcnZpY2UsIHRlc3RTZXJ2aWNlLCAkaHR0cEJhY2tlbmQsIFdvcmtJdGVtLCBpbmZvTW9kYWxTZXJ2aWNlLFxuICAgICAgICBWaW9sYXRpb25SZXZpZXdXb3JrSXRlbSwgQXBwcm92YWwsICRyb290U2NvcGUsIHNwTW9kYWwsICRxLCBtb2RhbEluc3RhbmNlO1xuXG4gICAgLy8gVXNlIHRoZSBhY2Nlc3MgcmVxdWVzdCBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUod29ya0l0ZW1Nb2R1bGUsIHRlc3RNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmNvbnN0YW50KCdTUF9DT05URVhUX1BBVEgnLCAnL2lkZW50aXR5aXEnKTtcbiAgICAgICAgLyogT3ZlcnJpZGUgdGhlIHNwV29ya0l0ZW0gZGlyZWN0aXZlIHdpdGggYSBkbyBub3RoaW5nIGRpcmVjdGl2ZSBzbyB3ZSBjYW5cbiAgICAgICAgICogdW5pdCB0ZXN0IHRoZSB3b3JraXRlbSBkaWFsb2cgd2l0aG91dCBoYXZpbmcgdG8gd29ycnkgYWJvdXQgYW55dGhpbmdcbiAgICAgICAgICogc3Atd29yay1pdGVtIGRvZXMuICovXG4gICAgICAgICRwcm92aWRlLnNlcnZpY2UoJ3NwV29ya0l0ZW1EaXJlY3RpdmUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHt9OyB9KTtcbiAgICAgICAgLyogVGhpcyBpcyBzdGlsbCBhIGJpdCBtYWdpY2FsLCBpdCBtYXkgYmUgcmVsYXRlZCB0byB0aGlzIHVpLWJvb3RzdHJhcCBpc3N1ZVxuICAgICAgICAgKiAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvYm9vdHN0cmFwL2lzc3Vlcy8zNjMzKSwgYnV0IGlmIHdlIGRvIG5vdCB0dXJuXG4gICAgICAgICAqIG9mZiBhbmltYXRpb25zIHRoZSBkaWFsb2dzIGRvIG5vdCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBkb20gZHVyaW5nIHRlc3QuXG4gICAgICAgICAqIEFkZGl0aW9uYWxseSBhZnRlciBkaXNtaXNzaW5nIGEgbW9kYWwgd2UgbmVlZCB0byBtYW51YWxseSBmbHVzaCAkdGltZW91dCAqL1xuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRtb2RhbCcsIGZ1bmN0aW9uKCRkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZGVsZWdhdGUub3BlbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAxMCAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9Xb3JrSXRlbV8sIF9WaW9sYXRpb25SZXZpZXdXb3JrSXRlbV8sIF9BcHByb3ZhbF8sIF9zcE1vZGFsXywgX3Rlc3RTZXJ2aWNlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaW5mb01vZGFsU2VydmljZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3dvcmtJdGVtU2VydmljZV8sIF8kaHR0cEJhY2tlbmRfLCBfJHJvb3RTY29wZV8sIF8kcV8pIHtcbiAgICAgICAgV29ya0l0ZW0gPSBfV29ya0l0ZW1fO1xuICAgICAgICBWaW9sYXRpb25SZXZpZXdXb3JrSXRlbSA9IF9WaW9sYXRpb25SZXZpZXdXb3JrSXRlbV87XG4gICAgICAgIEFwcHJvdmFsID0gX0FwcHJvdmFsXztcbiAgICAgICAgd29ya0l0ZW1TZXJ2aWNlID0gX3dvcmtJdGVtU2VydmljZV87XG4gICAgICAgICRodHRwQmFja2VuZCA9IF8kaHR0cEJhY2tlbmRfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xuICAgICAgICBpbmZvTW9kYWxTZXJ2aWNlID0gX2luZm9Nb2RhbFNlcnZpY2VfO1xuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XG4gICAgICAgICRxID0gXyRxXztcblxuICAgICAgICAvKiBUaGUgZnVuY3Rpb25zIHVuZGVyIHRlc3QgZG8gbm90IHJldHVybiBhIHJlZmVyZW5jZSB0byB0aGUgbW9kYWwsXG4gICAgICAgICAqIHNuZWFrIGEgcmVmZXJlbmNlIG91dCBzbyB3ZSBjYW4gcHJvZ3JhbWF0aWNhbGx5IGNsb3NlIGl0IHdpdGhvdXRcbiAgICAgICAgICogZmFsbGluZyBiYWNrIHRvIHNlYXJjaGluZyB0aGUgZG9tIGZvciB0aGUgZXhpdCBidXR0b24gKi9cbiAgICAgICAgdmFyIG9yaWdpbmFsT3BlbiA9IHNwTW9kYWwub3BlbjtcbiAgICAgICAgc3BNb2RhbC5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gb3JpZ2luYWxPcGVuLmFwcGx5KHNwTW9kYWwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gbW9kYWxJbnN0YW5jZTtcbiAgICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICBhZnRlckVhY2goaW5qZWN0KGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24oKTtcbiAgICAgICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIGlmKG1vZGFsSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgfVxuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrV29ya0l0ZW0od29ya0l0ZW0sIGlkLCB0eXBlLCB3b3JrSXRlbVR5cGUpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtJdGVtIGluc3RhbmNlb2YgdHlwZSkudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3Qod29ya0l0ZW0uaWQpLnRvRXF1YWwoaWQpO1xuICAgICAgICBleHBlY3Qod29ya0l0ZW0ud29ya0l0ZW1UeXBlKS50b0VxdWFsKHdvcmtJdGVtVHlwZSk7XG4gICAgfVxuXG4gICAgZGVzY3JpYmUoJ2dldFdvcmtJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gdGVzdEdldFdvcmtJdGVtKGlkLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkV29ya0l0ZW1UeXBlKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gYmFzZVVSTCArICcvJyArIGlkLFxuICAgICAgICAgICAgICAgIHJldHVybmVkV29ya0l0ZW0sIHJldHVybmVkUHJvbWlzZTtcblxuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVCh1cmwpLnJlc3BvbmQoMjAwLCBkYXRhKTtcbiAgICAgICAgICAgIHJldHVybmVkUHJvbWlzZSA9IHdvcmtJdGVtU2VydmljZS5nZXRXb3JrSXRlbShpZCk7XG4gICAgICAgICAgICByZXR1cm5lZFByb21pc2UudGhlbihmdW5jdGlvbih3b3JrSXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybmVkV29ya0l0ZW0gPSB3b3JrSXRlbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICBjaGVja1dvcmtJdGVtKHJldHVybmVkV29ya0l0ZW0sIGlkLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkV29ya0l0ZW1UeXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdyZXR1cm5zIGFuIGFwcHJvdmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0ZXN0R2V0V29ya0l0ZW0oSUQxLCBhcHByb3ZhbERhdGEsIEFwcHJvdmFsLCAnQXBwcm92YWwnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgYSB2aW9sYXRpb24gcmV2aWV3JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0ZXN0R2V0V29ya0l0ZW0oSUQyLCB2aW9sYXRpb25SZXZpZXdXb3JrSXRlbURhdGEsIFZpb2xhdGlvblJldmlld1dvcmtJdGVtLCAnVmlvbGF0aW9uUmV2aWV3Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGEgd29yayBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0ZXN0R2V0V29ya0l0ZW0oSUQzLCB3b3JrSXRlbURhdGEsIFdvcmtJdGVtLCAnU29tZU90aGVyVHlwZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyByZWplY3RlZCBwcm9taXNlIGlmIHdvcmsgaXRlbSBkb2VzIG5vdCBleGlzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlamVjdFByb21pc2UsXG4gICAgICAgICAgICAgICAgcmVqZWN0ZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICB3b3JrSXRlbUlkID0gJzEyMzQ1JyxcbiAgICAgICAgICAgICAgICB1cmwgPSBiYXNlVVJMICsgJy8nICsgd29ya0l0ZW1JZDtcblxuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVCh1cmwpLnJlc3BvbmQoNDA0LCAnJyk7XG5cbiAgICAgICAgICAgIHJlamVjdFByb21pc2UgPSB3b3JrSXRlbVNlcnZpY2UuZ2V0V29ya0l0ZW0od29ya0l0ZW1JZCk7XG5cbiAgICAgICAgICAgIHJlamVjdFByb21pc2UuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KHJlamVjdGVkKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFdvcmtJdGVtRnJvbVNlc3Npb24oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgU0VTU0lPTl9VUkwgPSBiYXNlVVJMICsgJy9zZXNzaW9uJztcblxuICAgICAgICBpdCgnY2FsbHMgb3V0IHRvIHByb3BlciBSRVNUIGVuZHBvaW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKFNFU1NJT05fVVJMKS5yZXNwb25kKDIwMCwgd29ya0l0ZW1EYXRhKTtcblxuICAgICAgICAgICAgd29ya0l0ZW1TZXJ2aWNlLmdldFdvcmtJdGVtRnJvbVNlc3Npb24oKS50aGVuKGZ1bmN0aW9uKHdvcmtJdGVtKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tXb3JrSXRlbSh3b3JrSXRlbSwgd29ya0l0ZW1EYXRhLmlkLCBXb3JrSXRlbSwgJ1NvbWVPdGhlclR5cGUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgYSByZWplY3RlZCBwcm9taXNlIGlmIHdvcmsgaXRlbSBkb2VzIG5vdCBleGlzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlamVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoU0VTU0lPTl9VUkwpLnJlc3BvbmQoNDA0LCAnJyk7XG5cbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5nZXRXb3JrSXRlbUZyb21TZXNzaW9uKCkuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KHJlamVjdGVkKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFdvcmtJdGVtcygpJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBwYXNzIHRocm91Z2ggdG8gZ2V0V29ya0l0ZW1zQnlUeXBlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSAwLFxuICAgICAgICAgICAgICAgIGxpbWl0ID0gMTAsXG4gICAgICAgICAgICAgICAgc29ydCA9IFt7J3Byb3BlcnR5JzogJ2NyZWF0ZWQnLCdkaXJlY3Rpb24nOiAnREVTQyd9XTtcblxuICAgICAgICAgICAgd29ya0l0ZW1TZXJ2aWNlLmdldFdvcmtJdGVtc0J5VHlwZSA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHt9LCB7fSk7XG5cbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5nZXRXb3JrSXRlbXMoc3RhcnQsIGxpbWl0LCBzb3J0KTtcblxuICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5nZXRXb3JrSXRlbXNCeVR5cGUpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdCh3b3JrSXRlbVNlcnZpY2UuZ2V0V29ya0l0ZW1zQnlUeXBlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSwgc3RhcnQsIGxpbWl0LCBzb3J0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRXb3JrSXRlbXNCeVR5cGUoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc29ydCA9IHtcbiAgICAgICAgICAgIHRvSnNvbjogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoXG4gICAgICAgICAgICAgICAgYW5ndWxhci50b0pzb24oW3sncHJvcGVydHknOiAnY3JlYXRlZCcsJ2RpcmVjdGlvbic6ICdERVNDJ31dKVxuICAgICAgICAgICAgKVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RHZXRXb3JrSXRlbXNCeVR5cGUocGFyYW1zLCBxdWVyeVN0cmluZykge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChiYXNlVVJMICsgcXVlcnlTdHJpbmcpLnJlc3BvbmQoMjAwLCB7fSk7XG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UuZ2V0V29ya0l0ZW1zQnlUeXBlKHBhcmFtcy50eXBlLCBwYXJhbXMuc3RhcnQsIHBhcmFtcy5saW1pdCwgcGFyYW1zLnNvcnQpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCAoJ3Nob3VsZCBwYXNzIHRoZSB0eXBlIHBhcmFtIHNwZWNpZmllZCBpbiBhbiBhcnJheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogWydGb3JtJ10sXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyID0gJy8/bGltaXQ9MTAmc29ydD0lNUIlN0IlMjJwcm9wZXJ0eSUyMjolMjJjcmVhdGVkJTIyLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJyUyMmRpcmVjdGlvbiUyMjolMjJERVNDJTIyJTdEJTVEJnN0YXJ0PTAmdHlwZT1Gb3JtJztcblxuICAgICAgICAgICAgdGVzdEdldFdvcmtJdGVtc0J5VHlwZShwYXJhbXMsIHF1ZXJ5U3RyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzZW5kIGEgc2luZ2xlIHR5cGUgd2hlbiBzdHJpbmcgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnRm9ybScsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyID0gJy8/bGltaXQ9MTAmc29ydD0lNUIlN0IlMjJwcm9wZXJ0eSUyMjolMjJjcmVhdGVkJTIyLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJyUyMmRpcmVjdGlvbiUyMjolMjJERVNDJTIyJTdEJTVEJnN0YXJ0PTAmdHlwZT1Gb3JtJztcblxuICAgICAgICAgICAgdGVzdEdldFdvcmtJdGVtc0J5VHlwZShwYXJhbXMsIHF1ZXJ5U3RyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBwYXNzIG11bHRpcGxlIHR5cGUgcGFyYW1zIGlmIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogWydGb3JtJywgJ0FwcHJvdmFsJ10sXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyID0gJy8/bGltaXQ9MTAmc29ydD0lNUIlN0IlMjJwcm9wZXJ0eSUyMjolMjJjcmVhdGVkJTIyLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJyUyMmRpcmVjdGlvbiUyMjolMjJERVNDJTIyJTdEJTVEJnN0YXJ0PTAmdHlwZT1Gb3JtJnR5cGU9QXBwcm92YWwnO1xuXG4gICAgICAgICAgICB0ZXN0R2V0V29ya0l0ZW1zQnlUeXBlKHBhcmFtcywgcXVlcnlTdHIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBzZW5kIGEgdHlwZSB3aGVuIGVtcHR5IGFycmF5IHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogW10sXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyID0gJy8/bGltaXQ9MTAmc29ydD0lNUIlN0IlMjJwcm9wZXJ0eSUyMjolMjJjcmVhdGVkJTIyLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJyUyMmRpcmVjdGlvbiUyMjolMjJERVNDJTIyJTdEJTVEJnN0YXJ0PTAnO1xuXG4gICAgICAgICAgICB0ZXN0R2V0V29ya0l0ZW1zQnlUeXBlKHBhcmFtcywgcXVlcnlTdHIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBzZW5kIGEgdHlwZSB3aGVuIHVuZGVmaW5lZCBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyID0gJy8/bGltaXQ9MTAmc29ydD0lNUIlN0IlMjJwcm9wZXJ0eSUyMjolMjJjcmVhdGVkJTIyLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJyUyMmRpcmVjdGlvbiUyMjolMjJERVNDJTIyJTdEJTVEJnN0YXJ0PTAnO1xuXG4gICAgICAgICAgICB0ZXN0R2V0V29ya0l0ZW1zQnlUeXBlKHBhcmFtcywgcXVlcnlTdHIpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NyZWF0ZVdvcmtJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gdGVzdENyZWF0ZVdvcmtJdGVtKGlkLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkV29ya0l0ZW1UeXBlKSB7XG4gICAgICAgICAgICB2YXIgd29ya0l0ZW0gPSB3b3JrSXRlbVNlcnZpY2UuY3JlYXRlV29ya0l0ZW0oZGF0YSk7XG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW0gaW5zdGFuY2VvZiBleHBlY3RlZFR5cGUpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgICAgIGV4cGVjdCh3b3JrSXRlbS5nZXRJZCgpKS50b0VxdWFsKGlkKTtcbiAgICAgICAgICAgIGV4cGVjdCh3b3JrSXRlbS5nZXRXb3JrSXRlbVR5cGUoKSkudG9FcXVhbChleHBlY3RlZFdvcmtJdGVtVHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnY3JlYXRlcyBhbiBhcHByb3ZhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGVzdENyZWF0ZVdvcmtJdGVtKElEMSwgYXBwcm92YWxEYXRhLCBBcHByb3ZhbCwgJ0FwcHJvdmFsJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjcmVhdGVzIGEgdmlvbGF0aW9uIHJldmlldycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGVzdENyZWF0ZVdvcmtJdGVtKElEMiwgdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1EYXRhLCBWaW9sYXRpb25SZXZpZXdXb3JrSXRlbSwgJ1Zpb2xhdGlvblJldmlldycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY3JlYXRlcyBhIHdvcmsgaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGVzdENyZWF0ZVdvcmtJdGVtKElEMywgd29ya0l0ZW1EYXRhLCBXb3JrSXRlbSwgJ1NvbWVPdGhlclR5cGUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NyZWF0ZXMgYSB3b3JrIGl0ZW0gZm9yIGFuIGFwcHJvdmFsIHdpdGhvdXQgYXBwcm92YWwgaXRlbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRlc3RDcmVhdGVXb3JrSXRlbShJRDUsIG5vbkFjY2Vzc1JlcXVlc3RBcHByb3ZhbERhdGEsIFdvcmtJdGVtLCAnQXBwcm92YWwnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3BlbldvcmtJdGVtRGlhbG9nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNldFVwR2V0V29ya0l0ZW0oZGF0YSkge1xuICAgICAgICAgICAgdmFyIHdvcmtJdGVtID0gd29ya0l0ZW1TZXJ2aWNlLmNyZWF0ZVdvcmtJdGVtKGRhdGEpLFxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUod29ya0l0ZW0pO1xuICAgICAgICAgICAgc3B5T24od29ya0l0ZW1TZXJ2aWNlLCAnZ2V0V29ya0l0ZW0nKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0ZXN0QWxlcnRUaXRsZU1lc3NhZ2VLZXkoa2V5LCBsZW5ndGgpIHtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2Uub3BlbldvcmtJdGVtRGlhbG9nKCdpZCcsICdmdWxsJyk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoJyNtb2RhbC1jb250ZW50IC5uby1wYWQnKVswXTtcbiAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkuZmluZCgnLmFsZXJ0LXRpdGxlJykubGVuZ3RoKS50b0JlKGxlbmd0aCk7XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5maW5kKCcuYWxlcnQtdGl0bGUnKVswXS5pbm5lclRleHQpLnRvQmUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiBzcE1vZGFsIHdoZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZXRVcEdldFdvcmtJdGVtKHZpb2xhdGlvblJldmlld1dvcmtJdGVtRGF0YSk7XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgd29ya0l0ZW1TZXJ2aWNlLm9wZW5Xb3JrSXRlbURpYWxvZygnaWQnLCAnZnVsbCcpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckYW5pbWF0ZTpjbG9zZScpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzZXQgYXBwcm9wcmlhdGUgbWVzc2FnZSBrZXkgZm9yIHZpb2xhdGlvbiB3b3JraXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2V0VXBHZXRXb3JrSXRlbSh2aW9sYXRpb25SZXZpZXdXb3JrSXRlbURhdGEpO1xuICAgICAgICAgICAgdGVzdEFsZXJ0VGl0bGVNZXNzYWdlS2V5KCd1aV93b3JrX2l0ZW1fZGlhbG9nX3Zpb2xhdGlvbl9hbGVydCcsIDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHNldCBhcHByb3ByaWF0ZSBtZXNzYWdlIGtleSBmb3IgYXBwcm92YWwgd29ya2l0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNldFVwR2V0V29ya0l0ZW0oYXBwcm92YWxEYXRhKTtcbiAgICAgICAgICAgIHRlc3RBbGVydFRpdGxlTWVzc2FnZUtleSgndWlfd29ya19pdGVtX2RpYWxvZ19hcHByb3ZhbF9hbGVydCcsIDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGFsZXJ0IGRpdiB3aGVuIHdvcmtpdGVtIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBMYXRlciBmdW5jdGlvbmFsaXR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZXRVcEdldFdvcmtJdGVtKGZvcm1EYXRhKTtcbiAgICAgICAgICAgIHRlc3RBbGVydFRpdGxlTWVzc2FnZUtleShudWxsLCAwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2hvd0RldGFpbHNEaWFsb2coKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gc3BNb2RhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHdvcmtJdGVtO1xuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKTtcbiAgICAgICAgICAgIHdvcmtJdGVtID0gd29ya0l0ZW1TZXJ2aWNlLmNyZWF0ZVdvcmtJdGVtKHdvcmtJdGVtRGF0YSk7XG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2Uuc2hvd0RldGFpbHNEaWFsb2cod29ya0l0ZW0pO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzaG93Rm9yd2FyZERpYWxvZygpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiBzcE1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgd29ya0l0ZW0sXG4gICAgICAgICAgICAgICAgdGl0bGUgPSAnd29ya19pdGVtX3RpdGxlJyxcbiAgICAgICAgICAgICAgICBoZWxwVGV4dCA9ICdoZWxwX3RleHQnO1xuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKTtcbiAgICAgICAgICAgIHdvcmtJdGVtID0gd29ya0l0ZW1TZXJ2aWNlLmNyZWF0ZVdvcmtJdGVtKHdvcmtJdGVtRGF0YSk7XG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2Uuc2hvd0ZvcndhcmREaWFsb2cod29ya0l0ZW0sICgpID0+IHt9LCB0aXRsZSwgaGVscFRleHQpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS50aXRsZSkudG9FcXVhbCh0aXRsZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLnJlc29sdmUuaGVscFRleHQoKSkudG9FcXVhbChoZWxwVGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEZvcndhcmRpbmdIaXN0b3J5KCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHdvcmtJdGVtSWQgPSAnMTIzNCcsXG4gICAgICAgICAgICBoaXN0b3J5VXJsID0gYmFzZVVSTCArICcvJyArIHdvcmtJdGVtSWQgKyAnL293bmVySGlzdG9yeScsXG4gICAgICAgICAgICBoaXN0b3J5ID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNPd25lcjogJ0otYm9iJyxcbiAgICAgICAgICAgICAgICAgICAgbmV3T3duZXI6ICdLLWJvYicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IDEzOTE2MTgzODUzODAsXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICdIZXkgSy1ib2IgLi4uIHRha2UgY2FyZSBvZiB0aGlzJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c093bmVyOiAnSy1ib2InLFxuICAgICAgICAgICAgICAgICAgICBuZXdPd25lcjogJ0Zvby1ib2InLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiAxMzkxNjE4Mzg5OTk5LFxuICAgICAgICAgICAgICAgICAgICBjb21tZW50OiAnTm9wZSAuLi4gRm9vLWJvYiBnZXRzIHRvIGRlYWwuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgLy8gQWRkIGEgY3VzdG9tIG1hdGNoZXIgdG8gY2hlY2sgYW4gJGh0dHAgR0VUIHJlc3BvbnNlLlxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgamFzbWluZS5hZGRNYXRjaGVycyhDdXN0b21NYXRjaGVycyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdnZXRzIGZvcndhcmRpbmcgaGlzdG9yeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG93bmVySGlzdG9yeTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaGlzdG9yeVVybCkucmVzcG9uZCgyMDAsIGhpc3RvcnkpO1xuICAgICAgICAgICAgb3duZXJIaXN0b3J5ID0gd29ya0l0ZW1TZXJ2aWNlLmdldEZvcndhcmRpbmdIaXN0b3J5KHdvcmtJdGVtSWQpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICAgICBvd25lckhpc3RvcnkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsUmVzcG9uc2UoaGlzdG9yeSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvd25lckhpc3Rvcnk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGhpc3RvcnlVcmwpLnJlc3BvbmQoNTAwLCAnJyk7XG4gICAgICAgICAgICBvd25lckhpc3RvcnkgPSB3b3JrSXRlbVNlcnZpY2UuZ2V0Rm9yd2FyZGluZ0hpc3Rvcnkod29ya0l0ZW1JZCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgICAgIG93bmVySGlzdG9yeS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIHdvcmtJdGVtSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UuZ2V0Rm9yd2FyZGluZ0hpc3RvcnkobnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0SWRlbnRpdHlEZXRhaWxzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBtYWtlIFJFU1QgY2FsbCB0byBpZGVudGl0eURldGFpbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBiYXNlVVJMICsgJy8xL2lkZW50aXR5RGV0YWlscyc7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKHVybCkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5nZXRJZGVudGl0eURldGFpbHMoJzEnKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdkZWxldGVXb3JrSXRlbSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIHRlc3REZWxldGVXb3JrSXRlbShpZCwgZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IGJhc2VVUkwgKyAnLycgKyBpZDtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RERUxFVEUodXJsKS5yZXNwb25kKDIwMCk7XG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UuZGVsZXRlV29ya0l0ZW0oaWQpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnZGVsZXRlcyBhbiBhcHByb3ZhbCB3b3JrIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRlc3REZWxldGVXb3JrSXRlbShJRDEsIHdvcmtJdGVtRGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnZGVsZXRlcyBhIHZpb2xhdGlvbiByZXZpZXcgd29yayBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0ZXN0RGVsZXRlV29ya0l0ZW0oSUQyLCB3b3JrSXRlbURhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ2RlbGV0ZXMgYSBvdGhlciB0eXBlIHdvcmsgaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGVzdERlbGV0ZVdvcmtJdGVtKElEMywgd29ya0l0ZW1EYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yd2FyZFdvcmtJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGdldFVybCA9IGZ1bmN0aW9uKHdvcmtJdGVtSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiYXNlVVJMICsgJy8nICsgd29ya0l0ZW1JZCArICcvZm9yd2FyZCc7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3NlbmRzIGEgUE9TVCByZXF1ZXN0IHdpdGggY29tbWVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RQT1NUKGdldFVybCh3b3JrSXRlbURhdGEuaWQpLCB7IHRhcmdldElkZW50aXR5OiAnNDU2NycsIGNvbW1lbnQ6ICdyYW5kb20gY29tbWVudCcgfSlcbiAgICAgICAgICAgICAgICAucmVzcG9uZCgyMDAsICd7XCJtZXNzYWdlXCI6bnVsbCxcInN1Y2Nlc3NcIjp0cnVlfScpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IHdvcmtJdGVtU2VydmljZS5mb3J3YXJkV29ya0l0ZW0od29ya0l0ZW1EYXRhLmlkLCAnNDU2NycsICdyYW5kb20gY29tbWVudCcpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKHByb21pc2UpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZW5kcyBhIFBPU1QgcmVxdWVzdCB3aXRob3V0IGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVChnZXRVcmwod29ya0l0ZW1EYXRhLmlkKSwgeyB0YXJnZXRJZGVudGl0eTogJzQ1NjcnIH0pXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCAne1wibWVzc2FnZVwiOm51bGwsXCJzdWNjZXNzXCI6dHJ1ZX0nKTtcbiAgICAgICAgICAgIHByb21pc2UgPSB3b3JrSXRlbVNlcnZpY2UuZm9yd2FyZFdvcmtJdGVtKHdvcmtJdGVtRGF0YS5pZCwgJzQ1NjcnLCBudWxsKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZmFpbHMgb24gUkVTVCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RQT1NUKGdldFVybCh3b3JrSXRlbURhdGEuaWQpKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IHdvcmtJdGVtU2VydmljZS5mb3J3YXJkV29ya0l0ZW0od29ya0l0ZW1EYXRhLmlkLCAnNDU2NycsIG51bGwpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdmYWlscyBvbiBSRVNUIFN1Y2Nlc3NSZXN1bHQgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVChnZXRVcmwod29ya0l0ZW1EYXRhLmlkKSlcbiAgICAgICAgICAgICAgICAucmVzcG9uZCgyMDAsICd7XCJtZXNzYWdlXCI6XCJDYW5ub3QgZm9yd2FyZCB3b3JrIGl0ZW0gdG8gZXhpc3Rpbmcgb3duZXJcIixcInN1Y2Nlc3NcIjpmYWxzZX0nKTtcbiAgICAgICAgICAgIHByb21pc2UgPSB3b3JrSXRlbVNlcnZpY2UuZm9yd2FyZFdvcmtJdGVtKHdvcmtJdGVtRGF0YS5pZCwgJzQ1NjcnLCAndGhpcyBzaG91bGQgZmFpbCcpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIHdvcmtJdGVtSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UuZm9yd2FyZFdvcmtJdGVtKG51bGwsICc0NTY3JywgbnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gdGFyZ2V0SWRlbnRpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UuZm9yd2FyZFdvcmtJdGVtKHdvcmtJdGVtRGF0YS5pZCwgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNTdXBwb3J0ZWRXb3JrSXRlbVR5cGUoKScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KCdtYXRjaGVzIGFuIGFwcHJvdmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLmlzU3VwcG9ydGVkV29ya0l0ZW1UeXBlKGFwcHJvdmFsRGF0YS53b3JrSXRlbVR5cGUpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdtYXRjaGVzIGEgZm9ybScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5pc1N1cHBvcnRlZFdvcmtJdGVtVHlwZShmb3JtRGF0YS53b3JrSXRlbVR5cGUpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdtYXRjaGVzIGEgdmlvbGF0aW9uIHJldmlldycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5pc1N1cHBvcnRlZFdvcmtJdGVtVHlwZSh2aW9sYXRpb25SZXZpZXdXb3JrSXRlbURhdGEud29ya0l0ZW1UeXBlKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgbm90IGEgc3VwcG9ydGVkIHdvcmsgaXRlbSB0eXBlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLmlzU3VwcG9ydGVkV29ya0l0ZW1UeXBlKHdvcmtJdGVtRGF0YS53b3JrSXRlbVR5cGUpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgbnVsbCB3b3JrIGl0ZW0gdHlwZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5pc1N1cHBvcnRlZFdvcmtJdGVtVHlwZShudWxsKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcGVuVW5TdXBwb3J0ZWRXb3JrSXRlbURpYWxvZygpJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBvcGVuIGluZm9Nb2RhbCB3aGVuIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3B5T24oaW5mb01vZGFsU2VydmljZSwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5vcGVuVW5TdXBwb3J0ZWRXb3JrSXRlbURpYWxvZygpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChpbmZvTW9kYWxTZXJ2aWNlLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0V29ya0l0ZW1UeXBlVHJhbnNsYXRpb24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGlmIHR5cGUgaXMgbnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5nZXRXb3JrSXRlbVR5cGVUcmFuc2xhdGlvbihudWxsLCAndWlfZm9vYmFyJyk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgbWVzc2FnZUtleSBpcyBudWxsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgd29ya0l0ZW1TZXJ2aWNlLmdldFdvcmtJdGVtVHlwZVRyYW5zbGF0aW9uKCdmb28nLCBudWxsKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgaWYgdHlwZSBhbmQgbWVzc2FnZUtleSBhcmUgbm90IG51bGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UuZ2V0V29ya0l0ZW1UeXBlVHJhbnNsYXRpb24oJ2ZvbycsICd1aV9mb29iYXInKTtcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ25hdmlnYXRlVG9Xb3JrSXRlbVBhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5hdmlnYXRpb25TZXJ2aWNlO1xuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfbmF2aWdhdGlvblNlcnZpY2VfKSB7XG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSA9IF9uYXZpZ2F0aW9uU2VydmljZV87XG4gICAgICAgICAgICBzcHlPbihuYXZpZ2F0aW9uU2VydmljZSwgJ2dvJyk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgndGhyb3dzIGlmIHdvcmtJdGVtSWQgaXMgbnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5uYXZpZ2F0ZVRvV29ya0l0ZW1QYWdlKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCduYXZpZ2F0ZXMgdG8gdGhlIHZpZXdXb3JrSXRlbSBvdXRjb21lJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3b3JrSXRlbVNlcnZpY2UubmF2aWdhdGVUb1dvcmtJdGVtUGFnZSgnMTIzNCcpO1xuICAgICAgICAgICAgZXhwZWN0KG5hdmlnYXRpb25TZXJ2aWNlLmdvKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgICAgICAgb3V0Y29tZTogJ3ZpZXdXb3JrSXRlbT9pZD0xMjM0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhZGRzIHJlc2V0IGZsYWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5uYXZpZ2F0ZVRvV29ya0l0ZW1QYWdlKCcxMjM0JywgdHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2UuZ28pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICAgICAgICBvdXRjb21lOiAndmlld1dvcmtJdGVtP2lkPTEyMzQmcmVzZXQ9dHJ1ZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
