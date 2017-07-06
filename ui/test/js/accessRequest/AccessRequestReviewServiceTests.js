System.register(['test/js/TestInitializer', 'accessRequest/AccessRequestModule', './AccessRequestTestData'], function (_export) {
    /* (c) Copyright 2014 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var accessRequestModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_accessRequestAccessRequestModule) {
            accessRequestModule = _accessRequestAccessRequestModule['default'];
        }, function (_AccessRequestTestData) {}],
        execute: function () {

            /**
             * @author: michael.hide
             * Created: 9/24/14 4:08 PM
             */

            /**
             * Tests for the AccessRequestItemsService.
             */
            describe('AccessRequestReviewService', function () {

                var baseURL = '/identityiq/ui/rest/requestAccess',
                    accessRequestReviewService,
                    $httpBackend,
                    identity,
                    item1,
                    item2,
                    item3,
                    item4,
                    item5,
                    requestedItem1,
                    requestedItem3,
                    requestedItem4,
                    goodSubmitResponse = [{
                    workflowStatus: 'executing'
                }];

                // Use the access request module.
                beforeEach(module(accessRequestModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                }));

                /* jshint maxparams: 9 */
                beforeEach(inject(function (_accessRequestReviewService_, _$httpBackend_, _violationReviewWorkItemService_, AccessRequestItem, Identity, CurrentAccessItem, RequestedAccessItem, IdentityAccountSelection, accessRequestTestData) {
                    accessRequestReviewService = _accessRequestReviewService_;
                    $httpBackend = _$httpBackend_;
                    identity = new Identity(accessRequestTestData.IDENTITY1);
                    item1 = new AccessRequestItem(accessRequestTestData.ROLE);
                    item2 = new CurrentAccessItem(accessRequestTestData.CURRENT_ACCESS_ENTITLEMENT);
                    item3 = new AccessRequestItem(accessRequestTestData.PERMITTED_ROLE);
                    item4 = new AccessRequestItem(accessRequestTestData.ENTITLEMENT);
                    item5 = new CurrentAccessItem(accessRequestTestData.ROLE_TO_REMOVE);
                    requestedItem1 = new RequestedAccessItem(item1);
                    requestedItem3 = new RequestedAccessItem(item3);
                    requestedItem4 = new RequestedAccessItem(item4);
                    requestedItem3.permittedById = item1.getId();
                    requestedItem1.accountSelections = [new IdentityAccountSelection(accessRequestTestData.IDENTITY_ACCT_SELECTION1)];
                    requestedItem3.accountSelections = [new IdentityAccountSelection(accessRequestTestData.IDENTITY_ACCT_SELECTION1)];
                }));

                afterEach(function () {
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });

                describe('submitAccessRequestItems', function () {

                    var promise, data;

                    beforeEach(function () {
                        var sunriseDate = new Date(),
                            sunsetDate = new Date(sunriseDate.getDate() + 14);
                        //select accounts for requestItem1
                        requestedItem1.accountSelections[0].getProvisioningTargets().forEach(function (target) {
                            target.selectAccount(target.getAccountInfos()[0]);
                        });
                        requestedItem1.setSunriseDate(sunriseDate);
                        requestedItem1.setSunsetDate(sunsetDate);
                        data = {
                            'identities': ['1'],
                            'addedRoles': [{
                                id: '1',
                                permittedById: null,
                                comment: null,
                                assignmentNote: null,
                                sunrise: sunriseDate.getTime(),
                                sunset: sunsetDate.getTime(),
                                accountSelections: [{
                                    identityId: 'ted.tacular.id',
                                    roleName: 'Boss',
                                    applicationName: 'appName',
                                    nativeIdentity: 'ted',
                                    instance: 'tedsAccount'
                                }, {
                                    identityId: 'ted.tacular.id',
                                    roleName: 'Endentured Servant',
                                    applicationName: 'appName2',
                                    nativeIdentity: 'lacky',
                                    instance: 'lackyInstance'
                                }],
                                assignmentId: null
                            }, {
                                id: '1.5',
                                permittedById: '1',
                                comment: null,
                                assignmentNote: null,
                                sunrise: null,
                                sunset: null,
                                accountSelections: null,
                                assignmentId: null
                            }],
                            'removedRoles': [{
                                roleId: '5',
                                assignmentId: 'removedroleassignmentIdBlah',
                                comment: 'trololololo',
                                roleLocation: 'assigned'
                            }],
                            'addedEntitlements': [{
                                id: '2',
                                comment: null,
                                sunrise: null,
                                sunset: null,
                                accountSelections: null
                            }],
                            'removedEntitlements': [{
                                'id': '2',
                                'comment': 'trolololo',
                                'instance': 'instanceblah',
                                'nativeIdentity': 'nativeblah'
                            }]
                        };
                    });

                    it('should call REST service with full RequestedAccessItem', function () {
                        $httpBackend.expectPOST(baseURL, data).respond(200, goodSubmitResponse);
                        promise = accessRequestReviewService.submitAccessRequestItems([identity], [requestedItem1, requestedItem3, requestedItem4], [item2, item5]);
                        $httpBackend.flush();
                    });

                    it('should add additional data to removed entitlement if no ID', function () {
                        item2.id = undefined;
                        data.removedEntitlements[0].id = undefined;
                        angular.extend(data.removedEntitlements[0], {
                            'application': 'entapplicationblah',
                            'attribute': 'entattributeblah',
                            'value': 'entblah'
                        });

                        $httpBackend.expectPOST(baseURL, data).respond(200, goodSubmitResponse);
                        promise = accessRequestReviewService.submitAccessRequestItems([identity], [requestedItem1, requestedItem3, requestedItem4], [item2, item5]);
                        $httpBackend.flush();
                    });

                    it('should call backend with assignmentId on added roles if present', function () {
                        var assignmentId = 'assmtnId1';
                        requestedItem1.assignmentId = assignmentId;
                        data.addedRoles[0].assignmentId = assignmentId;
                        $httpBackend.expectPOST(baseURL, data).respond(200, goodSubmitResponse);
                        promise = accessRequestReviewService.submitAccessRequestItems([identity], [requestedItem1, requestedItem3, requestedItem4], [item2, item5]);
                        $httpBackend.flush();
                    });
                });

                describe('submit functions', function () {
                    var workItemId = '1234',
                        vrResult,
                        violationReviewWorkItemService,
                        ViolationReviewWorkItem,
                        ViolationReviewResult,
                        $q,
                        $scope;

                    beforeEach(inject(function (_$q_, _$rootScope_, _violationReviewWorkItemService_, _ViolationReviewWorkItem_, _ViolationReviewResult_) {
                        $q = _$q_;
                        $scope = _$rootScope_;
                        violationReviewWorkItemService = _violationReviewWorkItemService_;
                        ViolationReviewWorkItem = _ViolationReviewWorkItem_;
                        ViolationReviewResult = _ViolationReviewResult_;

                        /* Setup a big ugly result */
                        vrResult = new ViolationReviewResult({
                            nextWorkItem: {
                                id: 'newWorkItemId',
                                allowRequestsWithViolations: true,
                                workItemType: 'ViolationReview',
                                requestedItems: [{
                                    id: 'approvalItemId1',
                                    attributes: {
                                        id: 'requestedId1'
                                    }
                                }, {
                                    id: 'approvalItemId2',
                                    attributes: {
                                        id: 'requestedId2'
                                    }
                                }]
                            },
                            identityRequestId: 'requestedIdentity',
                            nextWorkItemId: 'newWorkItemId',
                            nextWorkItemType: 'ViolationReview',
                            workflowStatus: 'approving',
                            messages: [{
                                status: 'ERROR',
                                messageOrKey: 'this is the error messages'
                            }]
                        });
                    }));

                    function validateTransform(promiseSpy) {
                        var submitResultItems, submitResultItem;
                        expect(promiseSpy).toHaveBeenCalled();
                        submitResultItems = promiseSpy.calls.mostRecent().args[0];
                        expect(submitResultItems.length).toEqual(1);
                        submitResultItem = submitResultItems[0];
                        expect(submitResultItem.workflowStatus).toBe('approving');
                        expect(submitResultItem.identityRequestId).toBe('requestedIdentity');
                        expect(submitResultItem.workflowWorkItemType).toBe('ViolationReview');
                        expect(submitResultItem.workflowWorkItemId).toBe('newWorkItemId');
                        expect(submitResultItem.allowViolations).toBeTruthy();
                        expect(submitResultItem.approvalItems.length).toBe(2);
                        expect(submitResultItem.approvalItems[0].approvalItemId).toBe('approvalItemId1');
                        expect(submitResultItem.approvalItems[0].requestItemId).toBe('requestedId1');
                        expect(submitResultItem.approvalItems[1].approvalItemId).toBe('approvalItemId2');
                        expect(submitResultItem.approvalItems[1].requestItemId).toBe('requestedId2');
                        expect(submitResultItem.messages.length).toBe(1);
                        expect(submitResultItem.messages[0].messageOrKey).toBe('this is the error messages');
                    }

                    describe('resolveViolations()', function () {
                        var rejectedItems = ['a', 'b'];

                        beforeEach(function () {
                            spyOn(violationReviewWorkItemService, 'resolveViolations');
                        });

                        it('should call through to violationReviewWorkItemService', function () {
                            violationReviewWorkItemService.resolveViolations.and.returnValue($q.defer().promise);
                            accessRequestReviewService.resolveViolations(workItemId, rejectedItems);
                            expect(violationReviewWorkItemService.resolveViolations).toHaveBeenCalledWith(workItemId, rejectedItems);
                        });

                        it('should transform ViolationReviewResults into SubmitResultItems', function () {
                            var promiseSpy = jasmine.createSpy();
                            violationReviewWorkItemService.resolveViolations.and.returnValue($q.when(vrResult));
                            accessRequestReviewService.resolveViolations(workItemId, rejectedItems).then(promiseSpy);
                            $scope.$apply();
                            validateTransform(promiseSpy);
                        });
                    });

                    describe('submitWithViolations', function () {
                        var comment = 'this is a comment';

                        beforeEach(function () {
                            spyOn(violationReviewWorkItemService, 'submitWithViolations');
                        });

                        it('should defer to violationReviewWorkItemService', function () {
                            violationReviewWorkItemService.submitWithViolations.and.returnValue($q.defer().promise);
                            accessRequestReviewService.submitWithViolations(workItemId, comment);
                            expect(violationReviewWorkItemService.submitWithViolations).toHaveBeenCalledWith(workItemId, comment);
                        });

                        it('should transform ViolationReviewResults into SubmitResultItems', function () {
                            var promiseSpy = jasmine.createSpy();
                            violationReviewWorkItemService.submitWithViolations.and.returnValue($q.when(vrResult));
                            accessRequestReviewService.submitWithViolations(workItemId, comment).then(promiseSpy);
                            $scope.$apply();
                            validateTransform(promiseSpy);
                        });

                        it('should not barf is a non-ViolationReviewWorkItem is returned from violationReviewWorkItemService', function () {
                            var resultWithOtherType = new ViolationReviewResult({
                                nextWorkItem: {
                                    id: 'differentWorkItem',
                                    workItemType: 'differentWorkItemType'
                                },
                                workflowStatus: 'approving',
                                messages: [{
                                    status: 'ERROR',
                                    messageOrKey: 'this is the error messages'
                                }]
                            });
                            violationReviewWorkItemService.submitWithViolations.and.returnValue($q.when(resultWithOtherType));
                            expect(function () {
                                accessRequestReviewService.submitWithViolations(workItemId, comment);
                            }).not.toThrow();
                        });
                    });
                });

                describe('cancelAccessRequest', function () {
                    it('should delete workitem', function () {
                        var workitemId = 'workItem1',
                            cancelAccessRequestUrl = '/identityiq/ui/rest/workItems/' + workitemId;
                        $httpBackend.expectDELETE(cancelAccessRequestUrl).respond(200, {});
                        accessRequestReviewService.cancelAccessRequest(workitemId);
                        $httpBackend.flush();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLDRCQUE0QixVQUFVLFNBQVM7O0lBQ2hJOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7Ozs7Ozs7Ozs7WUFNN0IsU0FBUyw4QkFBOEIsWUFBVzs7Z0JBRTlDLElBQUksVUFBVTtvQkFDVjtvQkFBNEI7b0JBQzVCO29CQUFVO29CQUFPO29CQUFPO29CQUFPO29CQUFPO29CQUFPO29CQUFnQjtvQkFBZ0I7b0JBQzdFLHFCQUFxQixDQUFDO29CQUNsQixnQkFBZ0I7Ozs7Z0JBSXhCLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLFVBQVU7b0JBQ2pDLFNBQVMsU0FBUyxtQkFBbUI7Ozs7Z0JBSXpDLFdBQVcsT0FBTyxVQUFTLDhCQUE4QixnQkFBZ0Isa0NBQzlDLG1CQUFtQixVQUFVLG1CQUFtQixxQkFDaEQsMEJBQTBCLHVCQUF1QjtvQkFDeEUsNkJBQTZCO29CQUM3QixlQUFlO29CQUNmLFdBQVcsSUFBSSxTQUFTLHNCQUFzQjtvQkFDOUMsUUFBUSxJQUFJLGtCQUFrQixzQkFBc0I7b0JBQ3BELFFBQVEsSUFBSSxrQkFBa0Isc0JBQXNCO29CQUNwRCxRQUFRLElBQUksa0JBQWtCLHNCQUFzQjtvQkFDcEQsUUFBUSxJQUFJLGtCQUFrQixzQkFBc0I7b0JBQ3BELFFBQVEsSUFBSSxrQkFBa0Isc0JBQXNCO29CQUNwRCxpQkFBaUIsSUFBSSxvQkFBb0I7b0JBQ3pDLGlCQUFpQixJQUFJLG9CQUFvQjtvQkFDekMsaUJBQWlCLElBQUksb0JBQW9CO29CQUN6QyxlQUFlLGdCQUFnQixNQUFNO29C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QUcsMEJBQTBCLFlBQVc7d0JBQ3BDLElBQUksYUFBYTs0QkFDYix5QkFBeUIsbUNBQW1DO3dCQUNoRSxhQUFhLGFBQWEsd0JBQXdCLFFBQVEsS0FBSzt3QkFDL0QsMkJBQTJCLG9CQUFvQjt3QkFDL0MsYUFBYTs7Ozs7O0dBS3RCIiwiZmlsZSI6ImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNCBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBhY2Nlc3NSZXF1ZXN0TW9kdWxlIGZyb20gJ2FjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdE1vZHVsZSc7XG5pbXBvcnQgJy4vQWNjZXNzUmVxdWVzdFRlc3REYXRhJztcblxuLyoqXG4gKiBAYXV0aG9yOiBtaWNoYWVsLmhpZGVcbiAqIENyZWF0ZWQ6IDkvMjQvMTQgNDowOCBQTVxuICovXG5cbi8qKlxuICogVGVzdHMgZm9yIHRoZSBBY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLlxuICovXG5kZXNjcmliZSgnQWNjZXNzUmVxdWVzdFJldmlld1NlcnZpY2UnLCBmdW5jdGlvbigpIHtcblxuICAgIHZhciBiYXNlVVJMID0gJy9pZGVudGl0eWlxL3VpL3Jlc3QvcmVxdWVzdEFjY2VzcycsXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLCAkaHR0cEJhY2tlbmQsXG4gICAgICAgIGlkZW50aXR5LCBpdGVtMSwgaXRlbTIsIGl0ZW0zLCBpdGVtNCwgaXRlbTUsIHJlcXVlc3RlZEl0ZW0xLCByZXF1ZXN0ZWRJdGVtMywgcmVxdWVzdGVkSXRlbTQsXG4gICAgICAgIGdvb2RTdWJtaXRSZXNwb25zZSA9IFt7XG4gICAgICAgICAgICB3b3JrZmxvd1N0YXR1czogJ2V4ZWN1dGluZydcbiAgICAgICAgfV07XG5cbiAgICAvLyBVc2UgdGhlIGFjY2VzcyByZXF1ZXN0IG1vZHVsZS5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhY2Nlc3NSZXF1ZXN0TW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS5jb25zdGFudCgnU1BfQ09OVEVYVF9QQVRIJywgJy9pZGVudGl0eWlxJyk7XG4gICAgfSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczogOSAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9hY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZV8sIF8kaHR0cEJhY2tlbmRfLCBfdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2Nlc3NSZXF1ZXN0SXRlbSwgSWRlbnRpdHksIEN1cnJlbnRBY2Nlc3NJdGVtLCBSZXF1ZXN0ZWRBY2Nlc3NJdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElkZW50aXR5QWNjb3VudFNlbGVjdGlvbiwgYWNjZXNzUmVxdWVzdFRlc3REYXRhKSB7XG4gICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlID0gX2FjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlXztcbiAgICAgICAgJGh0dHBCYWNrZW5kID0gXyRodHRwQmFja2VuZF87XG4gICAgICAgIGlkZW50aXR5ID0gbmV3IElkZW50aXR5KGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWTEpO1xuICAgICAgICBpdGVtMSA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuUk9MRSk7XG4gICAgICAgIGl0ZW0yID0gbmV3IEN1cnJlbnRBY2Nlc3NJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5DVVJSRU5UX0FDQ0VTU19FTlRJVExFTUVOVCk7XG4gICAgICAgIGl0ZW0zID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5QRVJNSVRURURfUk9MRSk7XG4gICAgICAgIGl0ZW00ID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5FTlRJVExFTUVOVCk7XG4gICAgICAgIGl0ZW01ID0gbmV3IEN1cnJlbnRBY2Nlc3NJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5ST0xFX1RPX1JFTU9WRSk7XG4gICAgICAgIHJlcXVlc3RlZEl0ZW0xID0gbmV3IFJlcXVlc3RlZEFjY2Vzc0l0ZW0oaXRlbTEpO1xuICAgICAgICByZXF1ZXN0ZWRJdGVtMyA9IG5ldyBSZXF1ZXN0ZWRBY2Nlc3NJdGVtKGl0ZW0zKTtcbiAgICAgICAgcmVxdWVzdGVkSXRlbTQgPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShpdGVtNCk7XG4gICAgICAgIHJlcXVlc3RlZEl0ZW0zLnBlcm1pdHRlZEJ5SWQgPSBpdGVtMS5nZXRJZCgpO1xuICAgICAgICByZXF1ZXN0ZWRJdGVtMS5hY2NvdW50U2VsZWN0aW9ucyA9XG4gICAgICAgICAgICBbbmV3IElkZW50aXR5QWNjb3VudFNlbGVjdGlvbihhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFlfQUNDVF9TRUxFQ1RJT04xKV07XG4gICAgICAgIHJlcXVlc3RlZEl0ZW0zLmFjY291bnRTZWxlY3Rpb25zID1cbiAgICAgICAgICAgIFtuZXcgSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9BQ0NUX1NFTEVDVElPTjEpXTtcblxuICAgIH0pKTtcblxuICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbigpO1xuICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzdWJtaXRBY2Nlc3NSZXF1ZXN0SXRlbXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgcHJvbWlzZSwgZGF0YTtcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHN1bnJpc2VEYXRlID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICBzdW5zZXREYXRlID0gbmV3IERhdGUoc3VucmlzZURhdGUuZ2V0RGF0ZSgpICsgMTQpO1xuICAgICAgICAgICAgLy9zZWxlY3QgYWNjb3VudHMgZm9yIHJlcXVlc3RJdGVtMVxuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTEuYWNjb3VudFNlbGVjdGlvbnNbMF0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpLmZvckVhY2goZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNlbGVjdEFjY291bnQodGFyZ2V0LmdldEFjY291bnRJbmZvcygpWzBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTEuc2V0U3VucmlzZURhdGUoc3VucmlzZURhdGUpO1xuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTEuc2V0U3Vuc2V0RGF0ZShzdW5zZXREYXRlKTtcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgJ2lkZW50aXRpZXMnOiBbICcxJyBdLFxuICAgICAgICAgICAgICAgICdhZGRlZFJvbGVzJzogW3tcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgcGVybWl0dGVkQnlJZDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudE5vdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHN1bnJpc2U6IHN1bnJpc2VEYXRlLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgc3Vuc2V0OiBzdW5zZXREYXRlLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGl0eUlkOiAndGVkLnRhY3VsYXIuaWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdCb3NzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ2FwcE5hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICd0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6ICd0ZWRzQWNjb3VudCdcbiAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGl0eUlkOiAndGVkLnRhY3VsYXIuaWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdFbmRlbnR1cmVkIFNlcnZhbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb25OYW1lOiAnYXBwTmFtZTInLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICdsYWNreScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ2xhY2t5SW5zdGFuY2UnXG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50SWQ6IG51bGxcbiAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcxLjUnLFxuICAgICAgICAgICAgICAgICAgICBwZXJtaXR0ZWRCeUlkOiAnMScsXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnROb3RlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdW5yaXNlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdW5zZXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb25zOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50SWQ6IG51bGxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAncmVtb3ZlZFJvbGVzJzogWyB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGVJZDogJzUnLFxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50SWQ6ICdyZW1vdmVkcm9sZWFzc2lnbm1lbnRJZEJsYWgnLFxuICAgICAgICAgICAgICAgICAgICBjb21tZW50OiAndHJvbG9sb2xvbG8nLFxuICAgICAgICAgICAgICAgICAgICByb2xlTG9jYXRpb246ICdhc3NpZ25lZCdcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAnYWRkZWRFbnRpdGxlbWVudHMnOiBbIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3VucmlzZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Vuc2V0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50U2VsZWN0aW9uczogbnVsbFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICdyZW1vdmVkRW50aXRsZW1lbnRzJzogW3tcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogJzInLFxuICAgICAgICAgICAgICAgICAgICAnY29tbWVudCc6ICd0cm9sb2xvbG8nLFxuICAgICAgICAgICAgICAgICAgICAnaW5zdGFuY2UnOiAnaW5zdGFuY2VibGFoJyxcbiAgICAgICAgICAgICAgICAgICAgJ25hdGl2ZUlkZW50aXR5JzogJ25hdGl2ZWJsYWgnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBSRVNUIHNlcnZpY2Ugd2l0aCBmdWxsIFJlcXVlc3RlZEFjY2Vzc0l0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RQT1NUKGJhc2VVUkwsIGRhdGEpLnJlc3BvbmQoMjAwLCBnb29kU3VibWl0UmVzcG9uc2UpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnN1Ym1pdEFjY2Vzc1JlcXVlc3RJdGVtcyhcbiAgICAgICAgICAgICAgICBbaWRlbnRpdHldLFxuICAgICAgICAgICAgICAgIFtyZXF1ZXN0ZWRJdGVtMSwgcmVxdWVzdGVkSXRlbTMsIHJlcXVlc3RlZEl0ZW00XSxcbiAgICAgICAgICAgICAgICBbaXRlbTIsIGl0ZW01XSk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhZGQgYWRkaXRpb25hbCBkYXRhIHRvIHJlbW92ZWQgZW50aXRsZW1lbnQgaWYgbm8gSUQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0ZW0yLmlkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGF0YS5yZW1vdmVkRW50aXRsZW1lbnRzWzBdLmlkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoZGF0YS5yZW1vdmVkRW50aXRsZW1lbnRzWzBdLCB7XG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uJzogJ2VudGFwcGxpY2F0aW9uYmxhaCcsXG4gICAgICAgICAgICAgICAgJ2F0dHJpYnV0ZSc6ICdlbnRhdHRyaWJ1dGVibGFoJyxcbiAgICAgICAgICAgICAgICAndmFsdWUnOiAnZW50YmxhaCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVChiYXNlVVJMLCBkYXRhKS5yZXNwb25kKDIwMCwgZ29vZFN1Ym1pdFJlc3BvbnNlKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRBY2Nlc3NSZXF1ZXN0SXRlbXMoXG4gICAgICAgICAgICAgICAgW2lkZW50aXR5XSxcbiAgICAgICAgICAgICAgICBbcmVxdWVzdGVkSXRlbTEsIHJlcXVlc3RlZEl0ZW0zLCByZXF1ZXN0ZWRJdGVtNF0sXG4gICAgICAgICAgICAgICAgW2l0ZW0yLCBpdGVtNV0pO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBiYWNrZW5kIHdpdGggYXNzaWdubWVudElkIG9uIGFkZGVkIHJvbGVzIGlmIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhc3NpZ25tZW50SWQgPSAnYXNzbXRuSWQxJztcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0xLmFzc2lnbm1lbnRJZCA9IGFzc2lnbm1lbnRJZDtcbiAgICAgICAgICAgIGRhdGEuYWRkZWRSb2xlc1swXS5hc3NpZ25tZW50SWQgPSBhc3NpZ25tZW50SWQ7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVChiYXNlVVJMLCBkYXRhKS5yZXNwb25kKDIwMCwgZ29vZFN1Ym1pdFJlc3BvbnNlKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRBY2Nlc3NSZXF1ZXN0SXRlbXMoXG4gICAgICAgICAgICAgICAgW2lkZW50aXR5XSxcbiAgICAgICAgICAgICAgICBbcmVxdWVzdGVkSXRlbTEsIHJlcXVlc3RlZEl0ZW0zLCByZXF1ZXN0ZWRJdGVtNF0sXG4gICAgICAgICAgICAgICAgW2l0ZW0yLCBpdGVtNV0pO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCBmdW5jdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHdvcmtJdGVtSWQgPSAnMTIzNCcsXG4gICAgICAgICAgICB2clJlc3VsdCxcbiAgICAgICAgICAgIHZpb2xhdGlvblJldmlld1dvcmtJdGVtU2VydmljZSwgVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW0sIFZpb2xhdGlvblJldmlld1Jlc3VsdCwgJHEsICRzY29wZTtcblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHFfLCBfJHJvb3RTY29wZV8sIF92aW9sYXRpb25SZXZpZXdXb3JrSXRlbVNlcnZpY2VfLCBfVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1fLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfVmlvbGF0aW9uUmV2aWV3UmVzdWx0Xykge1xuICAgICAgICAgICAgJHEgPSBfJHFfO1xuICAgICAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAgICAgdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlID0gX3Zpb2xhdGlvblJldmlld1dvcmtJdGVtU2VydmljZV87XG4gICAgICAgICAgICBWaW9sYXRpb25SZXZpZXdXb3JrSXRlbSA9IF9WaW9sYXRpb25SZXZpZXdXb3JrSXRlbV87XG4gICAgICAgICAgICBWaW9sYXRpb25SZXZpZXdSZXN1bHQgPSBfVmlvbGF0aW9uUmV2aWV3UmVzdWx0XztcblxuICAgICAgICAgICAgLyogU2V0dXAgYSBiaWcgdWdseSByZXN1bHQgKi9cbiAgICAgICAgICAgIHZyUmVzdWx0ID0gbmV3IFZpb2xhdGlvblJldmlld1Jlc3VsdCh7XG4gICAgICAgICAgICAgICAgbmV4dFdvcmtJdGVtOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnbmV3V29ya0l0ZW1JZCcsXG4gICAgICAgICAgICAgICAgICAgIGFsbG93UmVxdWVzdHNXaXRoVmlvbGF0aW9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1UeXBlOiAnVmlvbGF0aW9uUmV2aWV3JyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkSXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2FwcHJvdmFsSXRlbUlkMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdyZXF1ZXN0ZWRJZDEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnYXBwcm92YWxJdGVtSWQyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ3JlcXVlc3RlZElkMidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlkZW50aXR5UmVxdWVzdElkOiAncmVxdWVzdGVkSWRlbnRpdHknLFxuICAgICAgICAgICAgICAgIG5leHRXb3JrSXRlbUlkOiAnbmV3V29ya0l0ZW1JZCcsXG4gICAgICAgICAgICAgICAgbmV4dFdvcmtJdGVtVHlwZTogJ1Zpb2xhdGlvblJldmlldycsXG4gICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdhcHByb3ZpbmcnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBbe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdFUlJPUicsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VPcktleTogJ3RoaXMgaXMgdGhlIGVycm9yIG1lc3NhZ2VzJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlVHJhbnNmb3JtKHByb21pc2VTcHkpIHtcbiAgICAgICAgICAgIHZhciBzdWJtaXRSZXN1bHRJdGVtcywgc3VibWl0UmVzdWx0SXRlbTtcbiAgICAgICAgICAgIGV4cGVjdChwcm9taXNlU3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBzdWJtaXRSZXN1bHRJdGVtcyA9IHByb21pc2VTcHkuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgc3VibWl0UmVzdWx0SXRlbSA9IHN1Ym1pdFJlc3VsdEl0ZW1zWzBdO1xuICAgICAgICAgICAgZXhwZWN0KHN1Ym1pdFJlc3VsdEl0ZW0ud29ya2Zsb3dTdGF0dXMpLnRvQmUoJ2FwcHJvdmluZycpO1xuICAgICAgICAgICAgZXhwZWN0KHN1Ym1pdFJlc3VsdEl0ZW0uaWRlbnRpdHlSZXF1ZXN0SWQpLnRvQmUoJ3JlcXVlc3RlZElkZW50aXR5Jyk7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbS53b3JrZmxvd1dvcmtJdGVtVHlwZSkudG9CZSgnVmlvbGF0aW9uUmV2aWV3Jyk7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbS53b3JrZmxvd1dvcmtJdGVtSWQpLnRvQmUoJ25ld1dvcmtJdGVtSWQnKTtcbiAgICAgICAgICAgIGV4cGVjdChzdWJtaXRSZXN1bHRJdGVtLmFsbG93VmlvbGF0aW9ucykudG9CZVRydXRoeSgpO1xuICAgICAgICAgICAgZXhwZWN0KHN1Ym1pdFJlc3VsdEl0ZW0uYXBwcm92YWxJdGVtcy5sZW5ndGgpLnRvQmUoMik7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbS5hcHByb3ZhbEl0ZW1zWzBdLmFwcHJvdmFsSXRlbUlkKS50b0JlKCdhcHByb3ZhbEl0ZW1JZDEnKTtcbiAgICAgICAgICAgIGV4cGVjdChzdWJtaXRSZXN1bHRJdGVtLmFwcHJvdmFsSXRlbXNbMF0ucmVxdWVzdEl0ZW1JZCkudG9CZSgncmVxdWVzdGVkSWQxJyk7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbS5hcHByb3ZhbEl0ZW1zWzFdLmFwcHJvdmFsSXRlbUlkKS50b0JlKCdhcHByb3ZhbEl0ZW1JZDInKTtcbiAgICAgICAgICAgIGV4cGVjdChzdWJtaXRSZXN1bHRJdGVtLmFwcHJvdmFsSXRlbXNbMV0ucmVxdWVzdEl0ZW1JZCkudG9CZSgncmVxdWVzdGVkSWQyJyk7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbS5tZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VibWl0UmVzdWx0SXRlbS5tZXNzYWdlc1swXS5tZXNzYWdlT3JLZXkpLnRvQmUoJ3RoaXMgaXMgdGhlIGVycm9yIG1lc3NhZ2VzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXNjcmliZSgncmVzb2x2ZVZpb2xhdGlvbnMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlamVjdGVkSXRlbXMgPSBbJ2EnLCAnYiddO1xuXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNweU9uKHZpb2xhdGlvblJldmlld1dvcmtJdGVtU2VydmljZSwgJ3Jlc29sdmVWaW9sYXRpb25zJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHRocm91Z2ggdG8gdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlLnJlc29sdmVWaW9sYXRpb25zLmFuZC5yZXR1cm5WYWx1ZSgkcS5kZWZlcigpLnByb21pc2UpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnJlc29sdmVWaW9sYXRpb25zKHdvcmtJdGVtSWQsIHJlamVjdGVkSXRlbXMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh2aW9sYXRpb25SZXZpZXdXb3JrSXRlbVNlcnZpY2UucmVzb2x2ZVZpb2xhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHdvcmtJdGVtSWQsXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdGVkSXRlbXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIFZpb2xhdGlvblJldmlld1Jlc3VsdHMgaW50byBTdWJtaXRSZXN1bHRJdGVtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgICAgICAgICB2aW9sYXRpb25SZXZpZXdXb3JrSXRlbVNlcnZpY2UucmVzb2x2ZVZpb2xhdGlvbnMuYW5kLnJldHVyblZhbHVlKCRxLndoZW4odnJSZXN1bHQpKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5yZXNvbHZlVmlvbGF0aW9ucyh3b3JrSXRlbUlkLCByZWplY3RlZEl0ZW1zKS50aGVuKHByb21pc2VTcHkpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZVRyYW5zZm9ybShwcm9taXNlU3B5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnc3VibWl0V2l0aFZpb2xhdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb21tZW50ID0gJ3RoaXMgaXMgYSBjb21tZW50JztcblxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzcHlPbih2aW9sYXRpb25SZXZpZXdXb3JrSXRlbVNlcnZpY2UsICdzdWJtaXRXaXRoVmlvbGF0aW9ucycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgZGVmZXIgdG8gdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlLnN1Ym1pdFdpdGhWaW9sYXRpb25zLmFuZC5yZXR1cm5WYWx1ZSgkcS5kZWZlcigpLnByb21pc2UpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnN1Ym1pdFdpdGhWaW9sYXRpb25zKHdvcmtJdGVtSWQsIGNvbW1lbnQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh2aW9sYXRpb25SZXZpZXdXb3JrSXRlbVNlcnZpY2Uuc3VibWl0V2l0aFZpb2xhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHdvcmtJdGVtSWQsIGNvbW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIFZpb2xhdGlvblJldmlld1Jlc3VsdHMgaW50byBTdWJtaXRSZXN1bHRJdGVtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgICAgICAgICB2aW9sYXRpb25SZXZpZXdXb3JrSXRlbVNlcnZpY2Uuc3VibWl0V2l0aFZpb2xhdGlvbnMuYW5kLnJldHVyblZhbHVlKCRxLndoZW4odnJSZXN1bHQpKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0UmV2aWV3U2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucyh3b3JrSXRlbUlkLCBjb21tZW50KS50aGVuKHByb21pc2VTcHkpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZVRyYW5zZm9ybShwcm9taXNlU3B5KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCBiYXJmIGlzIGEgbm9uLVZpb2xhdGlvblJldmlld1dvcmtJdGVtIGlzIHJldHVybmVkIGZyb20gdmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1TZXJ2aWNlJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdFdpdGhPdGhlclR5cGUgPSBuZXcgVmlvbGF0aW9uUmV2aWV3UmVzdWx0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0V29ya0l0ZW06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdkaWZmZXJlbnRXb3JrSXRlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtVHlwZTogJ2RpZmZlcmVudFdvcmtJdGVtVHlwZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtmbG93U3RhdHVzOiAnYXBwcm92aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnRVJST1InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlT3JLZXk6ICd0aGlzIGlzIHRoZSBlcnJvciBtZXNzYWdlcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZpb2xhdGlvblJldmlld1dvcmtJdGVtU2VydmljZS5zdWJtaXRXaXRoVmlvbGF0aW9ucy5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihyZXN1bHRXaXRoT3RoZXJUeXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLnN1Ym1pdFdpdGhWaW9sYXRpb25zKHdvcmtJdGVtSWQsIGNvbW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NhbmNlbEFjY2Vzc1JlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBkZWxldGUgd29ya2l0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3b3JraXRlbUlkID0gJ3dvcmtJdGVtMScsXG4gICAgICAgICAgICAgICAgY2FuY2VsQWNjZXNzUmVxdWVzdFVybCA9ICcvaWRlbnRpdHlpcS91aS9yZXN0L3dvcmtJdGVtcy8nICsgd29ya2l0ZW1JZDtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RERUxFVEUoY2FuY2VsQWNjZXNzUmVxdWVzdFVybCkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RSZXZpZXdTZXJ2aWNlLmNhbmNlbEFjY2Vzc1JlcXVlc3Qod29ya2l0ZW1JZCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
