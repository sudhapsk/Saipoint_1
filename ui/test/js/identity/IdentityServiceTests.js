System.register(['test/js/TestInitializer', 'identity/IdentityModule', './IdentityTestData'], function (_export) {
    /*
     * Copyright (C) 2016 SailPoint Technologies, Inc.  All rights reserved.
     */

    'use strict';

    var identityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }, function (_IdentityTestData) {}],
        execute: function () {

            /**
             * Tests for the IdentityService.
             */
            describe('IdentityService', function () {
                var quicklink = 'Manage%20Passwords';
                var baseURLManagePasswords = '/identityiq/ui/rest/quickLinks/' + quicklink + '/';
                var Identity = undefined,
                    IdentitySummary = undefined,
                    identityService = undefined,
                    quickLinkName = 'Manage%20Passwords',
                    identityTestData = undefined,
                    ForwardingInfo = undefined,
                    $httpBackend = undefined,
                    quickLink = undefined,
                    QuickLink = undefined,
                    identity1 = undefined,
                    identity2 = undefined,
                    navigationService = undefined;

                // Use the identity module.
                beforeEach(module(identityModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                }));

                /* jshint maxparams : 8 */
                beforeEach(inject(function (_Identity_, _identityService_, _identityTestData_, _$httpBackend_, _QuickLink_, _IdentitySummary_, _ForwardingInfo_, _navigationService_) {
                    Identity = _Identity_;
                    IdentitySummary = _IdentitySummary_;
                    identityService = _identityService_;
                    identityTestData = _identityTestData_;
                    $httpBackend = _$httpBackend_;
                    QuickLink = _QuickLink_;
                    ForwardingInfo = _ForwardingInfo_;
                    navigationService = _navigationService_;

                    quickLink = new QuickLink({
                        name: 'Manage Passwords',
                        action: 'managePasswords',
                        id: '123',
                        selfService: true,
                        forOthers: false
                    });
                }));

                afterEach(function () {
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });

                function verifyResult(promise, expectedCount) {
                    if (angular.isUndefined(expectedCount)) {
                        expectedCount = 2;
                    }
                    expect(promise).toBeTruthy();
                    promise.then(function (response) {
                        expect(response.data.count).toEqual(expectedCount);
                        expect(response.data.objects.length).toEqual(expectedCount);
                    });
                }

                describe('getIdentities', function () {
                    var identitiesURL = baseURLManagePasswords + 'identities';
                    var response = undefined,
                        promise = undefined;

                    beforeEach(function () {
                        identity1 = new Identity(identityTestData.IDENTITY1);
                        identity2 = new Identity(identityTestData.IDENTITY2);
                        response = {
                            count: 2,
                            objects: [identity1, identity2]
                        };
                    });

                    it('accepts a request without a name filter', function () {
                        $httpBackend.expectGET(identitiesURL).respond(200, response);
                        promise = identityService.getIdentities(null, null, null, quicklink);
                        verifyResult(promise);
                        $httpBackend.flush();
                    });

                    it('accepts a request without filters', function () {
                        $httpBackend.expectGET(identitiesURL).respond(200, response);
                        promise = identityService.getIdentities(null, null, null, quicklink);
                        verifyResult(promise);
                        $httpBackend.flush();
                    });

                    it('accepts a request with a name filter', function () {
                        $httpBackend.expectGET(identitiesURL + '?nameSearch=bob').respond(200, response);
                        promise = identityService.getIdentities('bob', null, null, quicklink);
                        verifyResult(promise);
                        $httpBackend.flush();
                    });

                    it('accepts a request with pagination parameters', function () {
                        $httpBackend.expectGET(identitiesURL + '?limit=40&start=30').respond(200, response);
                        promise = identityService.getIdentities(null, 30, 40, quicklink);
                        verifyResult(promise);
                        $httpBackend.flush();
                    });

                    it('accepts a request without pagination parameters', function () {
                        $httpBackend.expectGET(identitiesURL).respond(200, response);
                        promise = identityService.getIdentities(null, null, null, quicklink);
                        verifyResult(promise);
                        $httpBackend.flush();
                    });

                    it('can return an empty result', function () {
                        $httpBackend.expectGET(identitiesURL).respond(200, {
                            count: 0,
                            objects: []
                        });
                        promise = identityService.getIdentities(null, null, null, quicklink);
                        verifyResult(promise, 0);
                        $httpBackend.flush();
                    });

                    it('converts objects to Identities', function () {
                        $httpBackend.expectGET(identitiesURL).respond(200, response);
                        promise = identityService.getIdentities(null, null, null, quicklink);
                        promise.then(function (response) {
                            var objects = response.data.objects;
                            expect(objects[0] instanceof Identity).toBeTruthy();
                            expect(objects[1] instanceof Identity).toBeTruthy();
                        });
                        $httpBackend.flush();
                    });
                });

                describe('getIdentity', function () {
                    var identityId = '54321',
                        identityUrl = '/identityiq/ui/rest/identities/',
                        $scope = undefined;

                    function digest() {
                        $httpBackend.flush();
                        $scope.$apply();
                    }

                    beforeEach(inject(function ($rootScope) {
                        $scope = $rootScope;
                    }));

                    it('should return an IdentitySummary', function () {
                        var response = {
                            object: {
                                id: identityId
                            }
                        },
                            responseIdentity = undefined;
                        $httpBackend.expectGET(identityUrl + identityId).respond(200, response);
                        identityService.getIdentity(identityId, quickLinkName).then(function (identity) {
                            return responseIdentity = identity;
                        });
                        digest();
                        expect(responseIdentity instanceof IdentitySummary).toBeTruthy();
                        expect(responseIdentity.getId()).toBe(identityId);
                    });

                    it('should reject if response is not defined', function () {
                        var promiseRejected = false;
                        $httpBackend.expectGET(identityUrl + identityId).respond(200, undefined);
                        identityService.getIdentity(identityId, quickLinkName)['catch'](function () {
                            return promiseRejected = true;
                        });
                        digest();
                        expect(promiseRejected).toBeTruthy();
                    });

                    it('should reject if response does not have a object property', function () {
                        var promiseRejected = false;
                        $httpBackend.expectGET(identityUrl + identityId).respond(200, {});
                        identityService.getIdentity(identityId, quickLinkName)['catch'](function () {
                            return promiseRejected = true;
                        });
                        digest();
                        expect(promiseRejected).toBeTruthy();
                    });
                });

                describe('getAvailableActions', function () {
                    var identityId = '54321',
                        availableActionsUrl = '/identityiq/ui/rest/quickLinks/' + identityId + '/availableActions',
                        $scope = undefined;

                    function digest() {
                        $httpBackend.flush();
                        $scope.$apply();
                    }

                    beforeEach(inject(function ($rootScope) {
                        $scope = $rootScope;
                    }));

                    it('should return an array of QuickLinks', function () {
                        var response = [{
                            name: 'Manage Passwords',
                            action: 'managePasswords',
                            id: '123',
                            selfService: true,
                            forOthers: false
                        }],
                            responseQuickLinks = undefined;
                        $httpBackend.expectGET(availableActionsUrl).respond(200, response);
                        identityService.getAvailableActions(identityId, quickLinkName).then(function (quickLinks) {
                            return responseQuickLinks = quickLinks;
                        });
                        digest();
                        expect(responseQuickLinks.length > 0).toBeTruthy();
                        expect(responseQuickLinks[0].getId()).toBe(quickLink.getId());
                        expect(responseQuickLinks[0].getAction()).toBe(quickLink.getAction());
                    });

                    it('should reject if response is not defined', function () {
                        var promiseRejected = false;
                        $httpBackend.expectGET(availableActionsUrl).respond(200, undefined);
                        identityService.getAvailableActions(identityId, quickLinkName)['catch'](function () {
                            return promiseRejected = true;
                        });
                        digest();
                        expect(promiseRejected).toBeTruthy();
                    });
                });

                describe('getQuickLinkNameByAction', function () {
                    it('returns null if the action is not in the available actions map', function () {
                        var name = identityService.getQuickLinkNameByAction('notAnAction');
                        expect(name).toBeNull();
                    });

                    it('returns the quick link name for the matching action', function () {
                        var action = 'jackson';
                        var name = 'no novocaine!';
                        var quickLink = {
                            getName: function () {
                                return name;
                            }
                        };

                        // Shove a quicklink in the map.
                        var map = identityService.getAvailableActionsMap();
                        map[action] = quickLink;

                        // Now try to get it.
                        var foundName = identityService.getQuickLinkNameByAction(action);
                        expect(foundName).toEqual(name);
                    });
                });

                describe('getIdentityAttributes', function () {
                    var identityId = '54321',
                        viewIdentityQuickLinkName = 'View Identity',
                        attributesUrl = '/identityiq/ui/rest/quickLinks/' + viewIdentityQuickLinkName + '/identities/' + identityId + '/attributes',
                        $scope = undefined;

                    function digest() {
                        $httpBackend.flush();
                        $scope.$apply();
                    }

                    beforeEach(inject(function ($rootScope) {
                        $scope = $rootScope;
                    }));

                    it('should return attributes', function () {
                        var response = { attributes: [{ attributeName: 'id', value: '54321' }, { attributeName: 'name', value: 'someName' }] },
                            resultAttributes = undefined;

                        $httpBackend.expectGET(attributesUrl).respond(200, response);
                        identityService.getIdentityAttributes(viewIdentityQuickLinkName, identityId).then(function (response) {
                            return resultAttributes = response;
                        });
                        digest();
                        expect(resultAttributes.attributes.length > 0).toBeTruthy();
                        expect(resultAttributes.attributes[0].attributeName).toBe('id');
                        expect(resultAttributes.attributes[0].value).toBe(identityId);
                    });
                });

                describe('forwardInfo', function () {
                    var identityId = '54321',
                        viewIdentityQuickLinkName = 'View Identity',
                        forwardInfoUrl = '/identityiq/ui/rest/quickLinks/' + viewIdentityQuickLinkName + '/identities/' + identityId + '/forwardInfo',
                        $scope = undefined;

                    function digest() {
                        $httpBackend.flush();
                        $scope.$apply();
                    }

                    beforeEach(inject(function ($rootScope) {
                        $scope = $rootScope;
                    }));

                    it('should return forward info', function () {
                        var startDate = new Date();
                        var endDate = new Date();
                        var response = {
                            forwardUser: {
                                name: 'chuck.testa',
                                id: 123
                            },
                            startDate: startDate.getTime(),
                            endDate: endDate.getTime()
                        },
                            resultForwardInfo = undefined;

                        $httpBackend.expectGET(forwardInfoUrl).respond(200, response);
                        identityService.getForwardInfo(viewIdentityQuickLinkName, identityId).then(function (response) {
                            return resultForwardInfo = response;
                        });
                        digest();
                        expect(resultForwardInfo.getForwardUser().getDisplayableName()).toBe('chuck.testa');
                    });
                });

                describe('updateForwardInfo', function () {
                    var identityId = '54321',
                        viewIdentityQuickLinkName = 'View Identity',
                        forwardInfoUrl = '/identityiq/ui/rest/quickLinks/' + viewIdentityQuickLinkName + '/identities/' + identityId + '/forwardInfo';

                    it('should call updateForwardInfo', function () {
                        $httpBackend.expectPUT(forwardInfoUrl).respond(200, { object: {} });
                        identityService.updateForwardInfo(viewIdentityQuickLinkName, identityId, new ForwardingInfo({}));
                        $httpBackend.flush();
                    });
                });

                describe('promptWorkItemDialog', function () {
                    var workItemService = undefined,
                        WorkItem = undefined,
                        spModal = undefined,
                        $q = undefined,
                        $scope = undefined;

                    beforeEach(inject(function (_workItemService_, _WorkItem_, _spModal_, _$q_, _$rootScope_) {
                        workItemService = _workItemService_;
                        WorkItem = _WorkItem_;
                        spModal = _spModal_;
                        $q = _$q_;
                        $scope = _$rootScope_;
                        /* Create spies so both of these can be mocked */
                        spyOn(spModal, 'open');
                        spyOn(workItemService, 'openWorkItemDialog');
                    }));

                    it('should call workitemService.openWorkItemDialog if not a form', function () {
                        workItemService.openWorkItemDialog.and.returnValue($q.when());
                        identityService.promptWorkItemDialog(WorkItem.WorkItemType.Approval, '1234');
                        /* Digest the promise */
                        $scope.$apply();
                        expect(spModal.open).not.toHaveBeenCalled();
                        expect(workItemService.openWorkItemDialog).toHaveBeenCalled();
                    });

                    it('should prompt now or later modal if workitem is form', function () {
                        spModal.open.and.returnValue({ result: $q.when() });
                        identityService.promptWorkItemDialog(WorkItem.WorkItemType.Form, '1234');
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should call workitem service if now or later modal is resolved', function () {
                        spModal.open.and.callThrough();
                        workItemService.openWorkItemDialog.and.returnValue($q.when());
                        identityService.promptWorkItemDialog(WorkItem.WorkItemType.Form, '1234');
                        /* Digest the promise */
                        $scope.$apply();

                        var modal = angular.element('#nowOrLaterDialog'),
                            okButton = modal.find('.modal-footer button:last-of-type');
                        okButton.click();
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(workItemService.openWorkItemDialog).toHaveBeenCalled();
                        modal.remove();
                    });

                    it('should not call workitem service if now or later modal is rejected', function () {
                        spModal.open.and.returnValue({ result: $q.reject() });
                        identityService.promptWorkItemDialog(WorkItem.WorkItemType.Form, '1234');
                        /* Digest the promise */
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(workItemService.openWorkItemDialog).not.toHaveBeenCalled();
                    });
                });

                it('should delegate navigation service on back', function () {
                    spyOn(navigationService, 'back');
                    identityService.goBack();
                    expect(navigationService.back).toHaveBeenCalled();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0lkZW50aXR5U2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwyQkFBMkIsdUJBQXVCLFVBQVUsU0FBUzs7Ozs7SUFLN0c7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1FBQ2hDLFNBQVMsWUFBWTs7Ozs7WUFEN0IsU0FBUyxtQkFBbUIsWUFBVztnQkFDbkMsSUFBTSxZQUFZO2dCQUNsQixJQUFNLHlCQUFzQixvQ0FBcUMsWUFBUztnQkFDMUUsSUFBSSxXQUFRO29CQUFFLGtCQUFlO29CQUFFLGtCQUFlO29CQUFFLGdCQUFnQjtvQkFBc0IsbUJBQWdCO29CQUNsRyxpQkFBYztvQkFBRSxlQUFZO29CQUFFLFlBQVM7b0JBQUUsWUFBUztvQkFBRSxZQUFTO29CQUFFLFlBQVM7b0JBQUUsb0JBQWlCOzs7Z0JBRy9GLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLFVBQVU7b0JBQ2pDLFNBQVMsU0FBUyxtQkFBbUI7Ozs7Z0JBSXpDLFdBQVcsT0FBTyxVQUFTLFlBQVksbUJBQW1CLG9CQUFvQixnQkFBZ0IsYUFDbkUsbUJBQW1CLGtCQUFrQixxQkFBcUI7b0JBQ2pGLFdBQVc7b0JBQ1gsa0JBQWtCO29CQUNsQixrQkFBa0I7b0JBQ2xCLG1CQUFtQjtvQkFDbkIsZUFBZTtvQkFDZixZQUFZO29CQUNaLGlCQUFpQjtvQkFDakIsb0JBQW9COztvQkFFcEIsWUFBWSxJQUFJLFVBQVU7d0JBQ3RCLE1BQU07d0JBQ04sUUFBUTt3QkFDUixJQUFJO3dCQUNKLGFBQWE7d0JBQ2IsV0FBVzs7OztnQkFJbkIsVUFBVSxZQUFXO29CQUNqQixhQUFhO29CQUNiLGFBQWE7OztnQkFJakIsU0FBUyxhQUFhLFNBQVMsZUFBZTtvQkFDMUMsSUFB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Z0UsWUFBVzt3QkFDMUUsZ0JBQWdCLG1CQUFtQixJQUFJLFlBQVksR0FBRzt3QkFDdEQsZ0JBQWdCLHFCQUFxQixTQUFTLGFBQWEsVUFBVTs7d0JBRXJFLE9BQU87d0JBQ1AsT0FBTyxRQUFRLE1BQU0sSUFBSTt3QkFDekIsT0FBTyxnQkFBZ0Isb0JBQW9COzs7b0JBRy9DLEdBQUcsd0RBQXdELFlBQVc7d0JBQ2xFLFFBQVEsS0FBSyxJQUFJLFlBQVksRUFBQyxRQUFRLEdBQUc7d0JBQ3pDLGdCQUFnQixxQkFBcUIsU0FBUyxhQUFhLE1BQU07d0JBQ2pFLE9BQU8sUUFBUSxNQUFNOzs7b0JBR3pCLEdBQUcsa0VBQWtFLFlBQVc7d0JBQzVFLFFBQVEsS0FBSyxJQUFJO3dCQUNqQixnQkFBZ0IsbUJBQW1CLElBQUksWUFBWSxHQUFHO3dCQUN0RCxnQkFBZ0IscUJBQXFCLFNBQVMsYUFBYSxNQUFNOzt3QkFFakUsT0FBTzs7d0JBRVAsSUFBSSxRQUFRLFFBQVEsUUFBUTs0QkFDeEIsV0FBVyxNQUFNLEtBQUs7d0JBQzFCLFNBQVM7d0JBQ1QsT0FBTzt3QkFDUCxPQUFPLFFBQVEsTUFBTTt3QkFDckIsT0FBTyxnQkFBZ0Isb0JBQW9CO3dCQUMzQyxNQUFNOzs7b0JBR1YsR0FBRyxzRUFBc0UsWUFBVzt3QkFDaEYsUUFBUSxLQUFLLElBQUksWUFBWSxFQUFDLFFBQVEsR0FBRzt3QkFDekMsZ0JBQWdCLHFCQUFxQixTQUFTLGFBQWEsTUFBTTs7d0JBRWpFLE9BQU87d0JBQ1AsT0FBTyxRQUFRLE1BQU07d0JBQ3JCLE9BQU8sZ0JBQWdCLG9CQUFvQixJQUFJOzs7O2dCQUl2RCxHQUFHLDhDQUE4QyxZQUFXO29CQUN4RCxNQUFNLG1CQUFtQjtvQkFDekIsZ0JBQWdCO29CQUNoQixPQUFPLGtCQUFrQixNQUFNOzs7OztHQTRCcEMiLCJmaWxlIjoiaWRlbnRpdHkvSWRlbnRpdHlTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0ICcuL0lkZW50aXR5VGVzdERhdGEnO1xuXG4vKipcbiAqIFRlc3RzIGZvciB0aGUgSWRlbnRpdHlTZXJ2aWNlLlxuICovXG5kZXNjcmliZSgnSWRlbnRpdHlTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcXVpY2tsaW5rID0gJ01hbmFnZSUyMFBhc3N3b3Jkcyc7XG4gICAgY29uc3QgYmFzZVVSTE1hbmFnZVBhc3N3b3JkcyA9IGAvaWRlbnRpdHlpcS91aS9yZXN0L3F1aWNrTGlua3MvJHtxdWlja2xpbmt9L2A7XG4gICAgbGV0IElkZW50aXR5LCBJZGVudGl0eVN1bW1hcnksIGlkZW50aXR5U2VydmljZSwgcXVpY2tMaW5rTmFtZSA9ICdNYW5hZ2UlMjBQYXNzd29yZHMnLCBpZGVudGl0eVRlc3REYXRhLFxuICAgICAgICBGb3J3YXJkaW5nSW5mbywgJGh0dHBCYWNrZW5kLCBxdWlja0xpbmssIFF1aWNrTGluaywgaWRlbnRpdHkxLCBpZGVudGl0eTIsIG5hdmlnYXRpb25TZXJ2aWNlO1xuXG4gICAgLy8gVXNlIHRoZSBpZGVudGl0eSBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoaWRlbnRpdHlNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmNvbnN0YW50KCdTUF9DT05URVhUX1BBVEgnLCAnL2lkZW50aXR5aXEnKTtcbiAgICB9KSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zIDogOCAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9JZGVudGl0eV8sIF9pZGVudGl0eVNlcnZpY2VfLCBfaWRlbnRpdHlUZXN0RGF0YV8sIF8kaHR0cEJhY2tlbmRfLCBfUXVpY2tMaW5rXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfSWRlbnRpdHlTdW1tYXJ5XywgX0ZvcndhcmRpbmdJbmZvXywgX25hdmlnYXRpb25TZXJ2aWNlXykge1xuICAgICAgICBJZGVudGl0eSA9IF9JZGVudGl0eV87XG4gICAgICAgIElkZW50aXR5U3VtbWFyeSA9IF9JZGVudGl0eVN1bW1hcnlfO1xuICAgICAgICBpZGVudGl0eVNlcnZpY2UgPSBfaWRlbnRpdHlTZXJ2aWNlXztcbiAgICAgICAgaWRlbnRpdHlUZXN0RGF0YSA9IF9pZGVudGl0eVRlc3REYXRhXztcbiAgICAgICAgJGh0dHBCYWNrZW5kID0gXyRodHRwQmFja2VuZF87XG4gICAgICAgIFF1aWNrTGluayA9IF9RdWlja0xpbmtfO1xuICAgICAgICBGb3J3YXJkaW5nSW5mbyA9IF9Gb3J3YXJkaW5nSW5mb187XG4gICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlID0gX25hdmlnYXRpb25TZXJ2aWNlXztcblxuICAgICAgICBxdWlja0xpbmsgPSBuZXcgUXVpY2tMaW5rKHtcbiAgICAgICAgICAgIG5hbWU6ICdNYW5hZ2UgUGFzc3dvcmRzJyxcbiAgICAgICAgICAgIGFjdGlvbjogJ21hbmFnZVBhc3N3b3JkcycsXG4gICAgICAgICAgICBpZDogJzEyMycsXG4gICAgICAgICAgICBzZWxmU2VydmljZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvck90aGVyczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uKCk7XG4gICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiB2ZXJpZnlSZXN1bHQocHJvbWlzZSwgZXhwZWN0ZWRDb3VudCkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChleHBlY3RlZENvdW50KSkge1xuICAgICAgICAgICAgZXhwZWN0ZWRDb3VudCA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZXhwZWN0KHByb21pc2UpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZGF0YS5jb3VudCkudG9FcXVhbChleHBlY3RlZENvdW50KTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhLm9iamVjdHMubGVuZ3RoKS50b0VxdWFsKGV4cGVjdGVkQ291bnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGRlc2NyaWJlKCdnZXRJZGVudGl0aWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGlkZW50aXRpZXNVUkwgPSBiYXNlVVJMTWFuYWdlUGFzc3dvcmRzICsgJ2lkZW50aXRpZXMnO1xuICAgICAgICBsZXQgcmVzcG9uc2UsIHByb21pc2U7XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlkZW50aXR5MSA9IG5ldyBJZGVudGl0eShpZGVudGl0eVRlc3REYXRhLklERU5USVRZMSk7XG4gICAgICAgICAgICBpZGVudGl0eTIgPSBuZXcgSWRlbnRpdHkoaWRlbnRpdHlUZXN0RGF0YS5JREVOVElUWTIpO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgY291bnQ6IDIsXG4gICAgICAgICAgICAgICAgb2JqZWN0czogWyBpZGVudGl0eTEsIGlkZW50aXR5MiBdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWNjZXB0cyBhIHJlcXVlc3Qgd2l0aG91dCBhIG5hbWUgZmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGlkZW50aXRpZXNVUkwpLlxuICAgICAgICAgICAgcmVzcG9uZCgyMDAsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBpZGVudGl0eVNlcnZpY2UuZ2V0SWRlbnRpdGllcyhudWxsLCBudWxsLCBudWxsLCBxdWlja2xpbmspO1xuICAgICAgICAgICAgdmVyaWZ5UmVzdWx0KHByb21pc2UpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhY2NlcHRzIGEgcmVxdWVzdCB3aXRob3V0IGZpbHRlcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaWRlbnRpdGllc1VSTCkuXG4gICAgICAgICAgICByZXNwb25kKDIwMCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0aWVzKG51bGwsIG51bGwsIG51bGwsIHF1aWNrbGluayk7XG4gICAgICAgICAgICB2ZXJpZnlSZXN1bHQocHJvbWlzZSk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2FjY2VwdHMgYSByZXF1ZXN0IHdpdGggYSBuYW1lIGZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChpZGVudGl0aWVzVVJMICsgJz9uYW1lU2VhcmNoPWJvYicpLlxuICAgICAgICAgICAgcmVzcG9uZCgyMDAsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBpZGVudGl0eVNlcnZpY2UuZ2V0SWRlbnRpdGllcygnYm9iJywgbnVsbCwgbnVsbCwgcXVpY2tsaW5rKTtcbiAgICAgICAgICAgIHZlcmlmeVJlc3VsdChwcm9taXNlKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWNjZXB0cyBhIHJlcXVlc3Qgd2l0aCBwYWdpbmF0aW9uIHBhcmFtZXRlcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaWRlbnRpdGllc1VSTCArICc/bGltaXQ9NDAmc3RhcnQ9MzAnKS5cbiAgICAgICAgICAgIHJlc3BvbmQoMjAwLCByZXNwb25zZSk7XG4gICAgICAgICAgICBwcm9taXNlID0gaWRlbnRpdHlTZXJ2aWNlLmdldElkZW50aXRpZXMobnVsbCwgMzAsIDQwLCBxdWlja2xpbmspO1xuICAgICAgICAgICAgdmVyaWZ5UmVzdWx0KHByb21pc2UpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhY2NlcHRzIGEgcmVxdWVzdCB3aXRob3V0IHBhZ2luYXRpb24gcGFyYW1ldGVycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChpZGVudGl0aWVzVVJMKS5cbiAgICAgICAgICAgIHJlc3BvbmQoMjAwLCByZXNwb25zZSk7XG4gICAgICAgICAgICBwcm9taXNlID0gaWRlbnRpdHlTZXJ2aWNlLmdldElkZW50aXRpZXMobnVsbCwgbnVsbCwgbnVsbCwgcXVpY2tsaW5rKTtcbiAgICAgICAgICAgIHZlcmlmeVJlc3VsdChwcm9taXNlKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIHJldHVybiBhbiBlbXB0eSByZXN1bHQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaWRlbnRpdGllc1VSTCkuXG4gICAgICAgICAgICByZXNwb25kKDIwMCwge1xuICAgICAgICAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgICAgICAgIG9iamVjdHM6IFtdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByb21pc2UgPSBpZGVudGl0eVNlcnZpY2UuZ2V0SWRlbnRpdGllcyhudWxsLCBudWxsLCBudWxsLCBxdWlja2xpbmspO1xuICAgICAgICAgICAgdmVyaWZ5UmVzdWx0KHByb21pc2UsIDApO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjb252ZXJ0cyBvYmplY3RzIHRvIElkZW50aXRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaWRlbnRpdGllc1VSTCkuXG4gICAgICAgICAgICByZXNwb25kKDIwMCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0aWVzKG51bGwsIG51bGwsIG51bGwsIHF1aWNrbGluayk7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2JqZWN0cyA9IHJlc3BvbnNlLmRhdGEub2JqZWN0cztcbiAgICAgICAgICAgICAgICBleHBlY3Qob2JqZWN0c1swXSBpbnN0YW5jZW9mIElkZW50aXR5KS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KG9iamVjdHNbMV0gaW5zdGFuY2VvZiBJZGVudGl0eSkudG9CZVRydXRoeSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0SWRlbnRpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGlkZW50aXR5SWQgPSAnNTQzMjEnLFxuICAgICAgICAgICAgaWRlbnRpdHlVcmwgPSBgL2lkZW50aXR5aXEvdWkvcmVzdC9pZGVudGl0aWVzL2AsXG4gICAgICAgICAgICAkc2NvcGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZGlnZXN0KCkge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYW4gSWRlbnRpdHlTdW1tYXJ5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZGVudGl0eUlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgcmVzcG9uc2VJZGVudGl0eTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaWRlbnRpdHlVcmwgKyBpZGVudGl0eUlkKS5yZXNwb25kKDIwMCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgaWRlbnRpdHlTZXJ2aWNlLmdldElkZW50aXR5KGlkZW50aXR5SWQsIHF1aWNrTGlua05hbWUpLnRoZW4oKGlkZW50aXR5KSA9PiByZXNwb25zZUlkZW50aXR5ID0gaWRlbnRpdHkpO1xuICAgICAgICAgICAgZGlnZXN0KCk7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2VJZGVudGl0eSBpbnN0YW5jZW9mIElkZW50aXR5U3VtbWFyeSkudG9CZVRydXRoeSgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlSWRlbnRpdHkuZ2V0SWQoKSkudG9CZShpZGVudGl0eUlkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZWplY3QgaWYgcmVzcG9uc2UgaXMgbm90IGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlUmVqZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoaWRlbnRpdHlVcmwgKyBpZGVudGl0eUlkKS5cbiAgICAgICAgICAgICAgICByZXNwb25kKDIwMCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0eShpZGVudGl0eUlkLCBxdWlja0xpbmtOYW1lKS5jYXRjaCgoKSA9PiBwcm9taXNlUmVqZWN0ZWQgPSB0cnVlKTtcbiAgICAgICAgICAgIGRpZ2VzdCgpO1xuICAgICAgICAgICAgZXhwZWN0KHByb21pc2VSZWplY3RlZCkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJlamVjdCBpZiByZXNwb25zZSBkb2VzIG5vdCBoYXZlIGEgb2JqZWN0IHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZVJlamVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGlkZW50aXR5VXJsICsgaWRlbnRpdHlJZCkuXG4gICAgICAgICAgICAgICAgcmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0eShpZGVudGl0eUlkLCBxdWlja0xpbmtOYW1lKS5jYXRjaCgoKSA9PiBwcm9taXNlUmVqZWN0ZWQgPSB0cnVlKTtcbiAgICAgICAgICAgIGRpZ2VzdCgpO1xuICAgICAgICAgICAgZXhwZWN0KHByb21pc2VSZWplY3RlZCkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEF2YWlsYWJsZUFjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGlkZW50aXR5SWQgPSAnNTQzMjEnLFxuICAgICAgICAgICAgYXZhaWxhYmxlQWN0aW9uc1VybCA9XG4gICAgICAgICAgICAgICAgYC9pZGVudGl0eWlxL3VpL3Jlc3QvcXVpY2tMaW5rcy8ke2lkZW50aXR5SWR9L2F2YWlsYWJsZUFjdGlvbnNgLFxuICAgICAgICAgICAgJHNjb3BlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRpZ2VzdCgpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIGFycmF5IG9mIFF1aWNrTGlua3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IFt7XG4gICAgICAgICAgICAgICAgbmFtZTogJ01hbmFnZSBQYXNzd29yZHMnLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ21hbmFnZVBhc3N3b3JkcycsXG4gICAgICAgICAgICAgICAgaWQ6ICcxMjMnLFxuICAgICAgICAgICAgICAgIHNlbGZTZXJ2aWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGZvck90aGVyczogZmFsc2VcbiAgICAgICAgICAgIH1dLCByZXNwb25zZVF1aWNrTGlua3M7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGF2YWlsYWJsZUFjdGlvbnNVcmwpLnJlc3BvbmQoMjAwLCByZXNwb25zZSk7XG4gICAgICAgICAgICBpZGVudGl0eVNlcnZpY2UuZ2V0QXZhaWxhYmxlQWN0aW9ucyhpZGVudGl0eUlkLCBxdWlja0xpbmtOYW1lKVxuICAgICAgICAgICAgICAgIC50aGVuKChxdWlja0xpbmtzKSA9PiByZXNwb25zZVF1aWNrTGlua3MgPSBxdWlja0xpbmtzKTtcbiAgICAgICAgICAgIGRpZ2VzdCgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlUXVpY2tMaW5rcy5sZW5ndGggPiAwKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2VRdWlja0xpbmtzWzBdLmdldElkKCkpLnRvQmUocXVpY2tMaW5rLmdldElkKCkpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlUXVpY2tMaW5rc1swXS5nZXRBY3Rpb24oKSkudG9CZShxdWlja0xpbmsuZ2V0QWN0aW9uKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJlamVjdCBpZiByZXNwb25zZSBpcyBub3QgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHByb21pc2VSZWplY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChhdmFpbGFibGVBY3Rpb25zVXJsKS5yZXNwb25kKDIwMCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRBdmFpbGFibGVBY3Rpb25zKGlkZW50aXR5SWQsIHF1aWNrTGlua05hbWUpLmNhdGNoKCgpID0+IHByb21pc2VSZWplY3RlZCA9IHRydWUpO1xuICAgICAgICAgICAgZGlnZXN0KCk7XG4gICAgICAgICAgICBleHBlY3QocHJvbWlzZVJlamVjdGVkKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFF1aWNrTGlua05hbWVCeUFjdGlvbicsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgbnVsbCBpZiB0aGUgYWN0aW9uIGlzIG5vdCBpbiB0aGUgYXZhaWxhYmxlIGFjdGlvbnMgbWFwJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBpZGVudGl0eVNlcnZpY2UuZ2V0UXVpY2tMaW5rTmFtZUJ5QWN0aW9uKCdub3RBbkFjdGlvbicpO1xuICAgICAgICAgICAgZXhwZWN0KG5hbWUpLnRvQmVOdWxsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBxdWljayBsaW5rIG5hbWUgZm9yIHRoZSBtYXRjaGluZyBhY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gJ2phY2tzb24nO1xuICAgICAgICAgICAgbGV0IG5hbWUgPSAnbm8gbm92b2NhaW5lISc7XG4gICAgICAgICAgICBsZXQgcXVpY2tMaW5rID0ge1xuICAgICAgICAgICAgICAgIGdldE5hbWU6ICgpID0+IG5hbWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFNob3ZlIGEgcXVpY2tsaW5rIGluIHRoZSBtYXAuXG4gICAgICAgICAgICBsZXQgbWFwID0gaWRlbnRpdHlTZXJ2aWNlLmdldEF2YWlsYWJsZUFjdGlvbnNNYXAoKTtcbiAgICAgICAgICAgIG1hcFthY3Rpb25dID0gcXVpY2tMaW5rO1xuXG4gICAgICAgICAgICAvLyBOb3cgdHJ5IHRvIGdldCBpdC5cbiAgICAgICAgICAgIGxldCBmb3VuZE5hbWUgPSBpZGVudGl0eVNlcnZpY2UuZ2V0UXVpY2tMaW5rTmFtZUJ5QWN0aW9uKGFjdGlvbik7XG4gICAgICAgICAgICBleHBlY3QoZm91bmROYW1lKS50b0VxdWFsKG5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRJZGVudGl0eUF0dHJpYnV0ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGlkZW50aXR5SWQgPSAnNTQzMjEnLCB2aWV3SWRlbnRpdHlRdWlja0xpbmtOYW1lID0gJ1ZpZXcgSWRlbnRpdHknLFxuICAgICAgICAgICAgYXR0cmlidXRlc1VybCA9XG4gICAgICAgICAgICAgICAgYC9pZGVudGl0eWlxL3VpL3Jlc3QvcXVpY2tMaW5rcy8ke3ZpZXdJZGVudGl0eVF1aWNrTGlua05hbWV9L2lkZW50aXRpZXMvJHtpZGVudGl0eUlkfS9hdHRyaWJ1dGVzYCxcbiAgICAgICAgICAgICRzY29wZTtcblxuICAgICAgICBmdW5jdGlvbiBkaWdlc3QoKSB7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcbiAgICAgICAgICAgICRzY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhdHRyaWJ1dGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSB7YXR0cmlidXRlczogW3thdHRyaWJ1dGVOYW1lOiAnaWQnLCB2YWx1ZTogJzU0MzIxJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2F0dHJpYnV0ZU5hbWU6ICduYW1lJywgdmFsdWU6ICdzb21lTmFtZSd9XX0sIHJlc3VsdEF0dHJpYnV0ZXM7XG5cbiAgICAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoYXR0cmlidXRlc1VybCkucmVzcG9uZCgyMDAsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0eUF0dHJpYnV0ZXModmlld0lkZW50aXR5UXVpY2tMaW5rTmFtZSwgaWRlbnRpdHlJZClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3VsdEF0dHJpYnV0ZXMgPSByZXNwb25zZSk7XG4gICAgICAgICAgICBkaWdlc3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHRBdHRyaWJ1dGVzLmF0dHJpYnV0ZXMubGVuZ3RoID4gMCkudG9CZVRydXRoeSgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdEF0dHJpYnV0ZXMuYXR0cmlidXRlc1swXS5hdHRyaWJ1dGVOYW1lKS50b0JlKCdpZCcpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdEF0dHJpYnV0ZXMuYXR0cmlidXRlc1swXS52YWx1ZSkudG9CZShpZGVudGl0eUlkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yd2FyZEluZm8nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGlkZW50aXR5SWQgPSAnNTQzMjEnLCB2aWV3SWRlbnRpdHlRdWlja0xpbmtOYW1lID0gJ1ZpZXcgSWRlbnRpdHknLFxuICAgICAgICAgICAgZm9yd2FyZEluZm9VcmwgPVxuICAgICAgICAgICAgICAgIGAvaWRlbnRpdHlpcS91aS9yZXN0L3F1aWNrTGlua3MvJHt2aWV3SWRlbnRpdHlRdWlja0xpbmtOYW1lfS9pZGVudGl0aWVzLyR7aWRlbnRpdHlJZH0vZm9yd2FyZEluZm9gLFxuICAgICAgICAgICAgJHNjb3BlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRpZ2VzdCgpIHtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZvcndhcmQgaW5mbycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBsZXQgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgZm9yd2FyZFVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NodWNrLnRlc3RhJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IDEyM1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiBzdGFydERhdGUuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgIGVuZERhdGU6IGVuZERhdGUuZ2V0VGltZSgpXG4gICAgICAgICAgICB9LCByZXN1bHRGb3J3YXJkSW5mbztcblxuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChmb3J3YXJkSW5mb1VybCkucmVzcG9uZCgyMDAsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRGb3J3YXJkSW5mbyh2aWV3SWRlbnRpdHlRdWlja0xpbmtOYW1lLCBpZGVudGl0eUlkKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzdWx0Rm9yd2FyZEluZm8gPSByZXNwb25zZSk7XG4gICAgICAgICAgICBkaWdlc3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHRGb3J3YXJkSW5mby5nZXRGb3J3YXJkVXNlcigpLmdldERpc3BsYXlhYmxlTmFtZSgpKS50b0JlKCdjaHVjay50ZXN0YScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd1cGRhdGVGb3J3YXJkSW5mbycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgaWRlbnRpdHlJZCA9ICc1NDMyMScsIHZpZXdJZGVudGl0eVF1aWNrTGlua05hbWUgPSAnVmlldyBJZGVudGl0eScsXG4gICAgICAgICAgICBmb3J3YXJkSW5mb1VybCA9XG4gICAgICAgICAgICAgICAgYC9pZGVudGl0eWlxL3VpL3Jlc3QvcXVpY2tMaW5rcy8ke3ZpZXdJZGVudGl0eVF1aWNrTGlua05hbWV9L2lkZW50aXRpZXMvJHtpZGVudGl0eUlkfS9mb3J3YXJkSW5mb2A7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHVwZGF0ZUZvcndhcmRJbmZvJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UFVUKGZvcndhcmRJbmZvVXJsKS5yZXNwb25kKDIwMCwge29iamVjdDoge319KTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS51cGRhdGVGb3J3YXJkSW5mbyh2aWV3SWRlbnRpdHlRdWlja0xpbmtOYW1lLCBpZGVudGl0eUlkLCBuZXcgRm9yd2FyZGluZ0luZm8oe30pKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdwcm9tcHRXb3JrSXRlbURpYWxvZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgd29ya0l0ZW1TZXJ2aWNlLCBXb3JrSXRlbSwgc3BNb2RhbCwgJHEsICRzY29wZTtcblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfd29ya0l0ZW1TZXJ2aWNlXywgX1dvcmtJdGVtXywgX3NwTW9kYWxfLCBfJHFfLCBfJHJvb3RTY29wZV8pIHtcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZSA9IF93b3JrSXRlbVNlcnZpY2VfO1xuICAgICAgICAgICAgV29ya0l0ZW0gPSBfV29ya0l0ZW1fO1xuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgICAgICRxID0gXyRxXztcbiAgICAgICAgICAgICRzY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICAgICAgICAgIC8qIENyZWF0ZSBzcGllcyBzbyBib3RoIG9mIHRoZXNlIGNhbiBiZSBtb2NrZWQgKi9cbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XG4gICAgICAgICAgICBzcHlPbih3b3JrSXRlbVNlcnZpY2UsICdvcGVuV29ya0l0ZW1EaWFsb2cnKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCB3b3JraXRlbVNlcnZpY2Uub3BlbldvcmtJdGVtRGlhbG9nIGlmIG5vdCBhIGZvcm0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZS5vcGVuV29ya0l0ZW1EaWFsb2cuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oKSk7XG4gICAgICAgICAgICBpZGVudGl0eVNlcnZpY2UucHJvbXB0V29ya0l0ZW1EaWFsb2coV29ya0l0ZW0uV29ya0l0ZW1UeXBlLkFwcHJvdmFsLCAnMTIzNCcpO1xuICAgICAgICAgICAgLyogRGlnZXN0IHRoZSBwcm9taXNlICovXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5vcGVuV29ya0l0ZW1EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBwcm9tcHQgbm93IG9yIGxhdGVyIG1vZGFsIGlmIHdvcmtpdGVtIGlzIGZvcm0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNwTW9kYWwub3Blbi5hbmQucmV0dXJuVmFsdWUoe3Jlc3VsdDogJHEud2hlbigpfSk7XG4gICAgICAgICAgICBpZGVudGl0eVNlcnZpY2UucHJvbXB0V29ya0l0ZW1EaWFsb2coV29ya0l0ZW0uV29ya0l0ZW1UeXBlLkZvcm0sICcxMjM0Jyk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCB3b3JraXRlbSBzZXJ2aWNlIGlmIG5vdyBvciBsYXRlciBtb2RhbCBpcyByZXNvbHZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3BNb2RhbC5vcGVuLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgd29ya0l0ZW1TZXJ2aWNlLm9wZW5Xb3JrSXRlbURpYWxvZy5hbmQucmV0dXJuVmFsdWUoJHEud2hlbigpKTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5wcm9tcHRXb3JrSXRlbURpYWxvZyhXb3JrSXRlbS5Xb3JrSXRlbVR5cGUuRm9ybSwgJzEyMzQnKTtcbiAgICAgICAgICAgIC8qIERpZ2VzdCB0aGUgcHJvbWlzZSAqL1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICBsZXQgbW9kYWwgPSBhbmd1bGFyLmVsZW1lbnQoJyNub3dPckxhdGVyRGlhbG9nJyksXG4gICAgICAgICAgICAgICAgb2tCdXR0b24gPSBtb2RhbC5maW5kKCcubW9kYWwtZm9vdGVyIGJ1dHRvbjpsYXN0LW9mLXR5cGUnKTtcbiAgICAgICAgICAgIG9rQnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLm9wZW5Xb3JrSXRlbURpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgd29ya2l0ZW0gc2VydmljZSBpZiBub3cgb3IgbGF0ZXIgbW9kYWwgaXMgcmVqZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNwTW9kYWwub3Blbi5hbmQucmV0dXJuVmFsdWUoe3Jlc3VsdDogJHEucmVqZWN0KCl9KTtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZS5wcm9tcHRXb3JrSXRlbURpYWxvZyhXb3JrSXRlbS5Xb3JrSXRlbVR5cGUuRm9ybSwgJzEyMzQnKTtcbiAgICAgICAgICAgIC8qIERpZ2VzdCB0aGUgcHJvbWlzZSAqL1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHdvcmtJdGVtU2VydmljZS5vcGVuV29ya0l0ZW1EaWFsb2cpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkZWxlZ2F0ZSBuYXZpZ2F0aW9uIHNlcnZpY2Ugb24gYmFjaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzcHlPbihuYXZpZ2F0aW9uU2VydmljZSwgJ2JhY2snKTtcbiAgICAgICAgaWRlbnRpdHlTZXJ2aWNlLmdvQmFjaygpO1xuICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2UuYmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
