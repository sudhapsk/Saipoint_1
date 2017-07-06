System.register(['test/js/TestInitializer', 'identity/IdentityModule', 'test/js/TestModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */
    'use strict';

    var identityModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('ManageAccountCtrl', function () {
                var $controller = undefined,
                    $scope = undefined,
                    $rootScope = undefined,
                    $stateParams = undefined,
                    manageAccountDataService = undefined,
                    spModal = undefined,
                    manageAccountService = undefined,
                    $q = undefined,
                    identityService = undefined,
                    $httpBackend = undefined,
                    configUrl = undefined,
                    testService = undefined,
                    AccountLink = undefined,
                    WorkflowResultItem = undefined,
                    account = undefined,
                    status = undefined,
                    QuickLink = undefined,
                    timeoutService = undefined;

                beforeEach(module(identityModule, testModule));

                /* jshint maxparams: 16 */
                beforeEach(inject(function (_$controller_, _manageAccountDataService_, _$rootScope_, _$stateParams_, _spModal_, _manageAccountService_, _$q_, _identityService_, _$httpBackend_, _testService_, _AccountLink_, _WorkflowResultItem_, _QuickLink_, ListResultDTO, configService, _$timeout_) {
                    $controller = _$controller_;
                    manageAccountDataService = _manageAccountDataService_;
                    manageAccountService = _manageAccountService_;
                    identityService = _identityService_;
                    $scope = _$rootScope_.$new();
                    $stateParams = _$stateParams_;
                    $q = _$q_;
                    spModal = _spModal_;
                    $rootScope = _$rootScope_;
                    $httpBackend = _$httpBackend_;
                    testService = _testService_;
                    AccountLink = _AccountLink_;
                    WorkflowResultItem = _WorkflowResultItem_;
                    QuickLink = _QuickLink_;
                    timeoutService = _$timeout_;
                    configUrl = '/ui/rest/configuration/uiconfig/entries?key=manageAccountLinkColConfig';

                    // Mock the manageAccountService to return a single account.
                    status = 'double platinum';
                    account = new AccountLink({
                        id: '12345',
                        status: status
                    });
                    spyOn(manageAccountService, 'getManageAccounts').and.callFake(function () {
                        return $q.when({
                            data: new ListResultDTO({
                                count: 1,
                                objects: [account]
                            })
                        });
                    });

                    // Mock fake configs to avoid HTTP calls.
                    spyOn(manageAccountService, 'getCreateAccountConfig').and.callFake(function () {
                        return testService.createPromise(false, {}, {});
                    });
                    spyOn(configService, 'getColumnConfigEntries').and.returnValue($q.when({ data: {} }));

                    var map = {},
                        qlData = { name: 'accountQuickLinkName' };
                    map[QuickLink.Actions.MANAGE_ACCOUNTS] = new QuickLink(qlData);
                    identityService.getAvailableActionsMap = function () {
                        return map;
                    };
                }));

                function createController() {
                    $stateParams.identityId = 'someId';
                    $stateParams.quickLink = 'accountQuickLinkName';
                    return $controller('ManageAccountCtrl', {
                        $scope: $scope,
                        $stateParams: $stateParams,
                        manageAccountDataService: manageAccountDataService
                    });
                }

                describe('account refresh', function () {
                    var foundLink = undefined,
                        notFoundLink = undefined;

                    beforeEach(function () {
                        foundLink = new AccountLink({
                            id: account.id,
                            status: 'i am an updated status'
                        });

                        notFoundLink = new AccountLink({
                            id: 'this ID will not be found anywhere',
                            status: 'blurghhthhhhh'
                        });
                    });

                    it('registers controller with the AccountRefreshTracker when constructed', function () {
                        var tracker = manageAccountDataService.getAccountRefreshTracker();
                        spyOn(tracker, 'registerRefreshListener');
                        var ctrl = createController();
                        expect(tracker.registerRefreshListener).toHaveBeenCalledWith(ctrl);
                    });

                    it('unregisters controller from the AccountRefreshTracker when destroyed', function () {
                        var tracker = manageAccountDataService.getAccountRefreshTracker();
                        spyOn(tracker, 'unregisterRefreshListener');
                        var ctrl = createController();
                        $scope.$destroy();
                        expect(tracker.unregisterRefreshListener).toHaveBeenCalledWith(ctrl);
                    });

                    describe('linkRefreshed()', function () {
                        it('does nothing if link is not in the list anymore', function () {
                            var ctrl = createController();
                            $scope.$digest();
                            ctrl.linkRefreshed(notFoundLink);
                            expect(account.status).toEqual(status);
                        });

                        it('updates the link in the list with the updated properties', function () {
                            var ctrl = createController();
                            $scope.$digest();
                            ctrl.linkRefreshed(foundLink);
                            expect(account.status).toEqual(foundLink.status);
                        });
                    });

                    describe('linkDeleted()', function () {
                        it('does nothing if link is not in the list anymore', function () {
                            var ctrl = createController();
                            $scope.$digest();
                            ctrl.linkDeleted(notFoundLink);
                            expect(account.deleted).toBeFalsy();
                        });

                        it('marks the link in the list as deleted', function () {
                            var ctrl = createController();
                            $scope.$digest();
                            ctrl.linkDeleted(foundLink.id);
                            expect(account.deleted).toEqual(true);
                        });
                    });
                });

                describe('auto-refresh', function () {
                    var isBeingTracked = undefined;

                    beforeEach(function () {
                        // Make the account that gets returned be setup to auto-refresh.
                        account.supportsRefresh = true;
                        account.autoRefresh = true;

                        // Mock the AccountRefreshTracker to return our values.
                        isBeingTracked = false;
                        var tracker = manageAccountDataService.getAccountRefreshTracker();
                        spyOn(tracker, 'isBeingTracked').and.callFake(function () {
                            return isBeingTracked;
                        });

                        // Also, watch for any accounts that are being refreshed.
                        spyOn(tracker, 'accountsBeingRefreshed');

                        // Neuter the refreshLink() call.
                        spyOn(manageAccountService, 'refreshLinks').and.returnValue($q.when([{ i: 'am a result' }]));
                    });

                    function checkRefresh(expectIt) {
                        var tracker = manageAccountDataService.getAccountRefreshTracker();

                        if (expectIt) {
                            expect(manageAccountService.refreshLinks).toHaveBeenCalledWith($stateParams.quickLink, $stateParams.identityId, [account.id]);

                            expect(tracker.accountsBeingRefreshed).toHaveBeenCalled();
                            var accountsBeingRefreshed = tracker.accountsBeingRefreshed.calls.mostRecent().args[0];
                            expect(accountsBeingRefreshed).toEqual([account.id]);
                        } else {
                            expect(manageAccountService.refreshLinks).not.toHaveBeenCalled();
                            expect(tracker.accountsBeingRefreshed).not.toHaveBeenCalled();
                        }
                    }

                    it('ignores accounts that are not setup for autoRefresh', function () {
                        // Turn off auto-refresh for the account being returned.
                        account.autoRefresh = false;

                        // This loads the items, which will try to auto-refresh.
                        createController();
                        $scope.$digest();

                        // Check that nothing happened.
                        checkRefresh(false);
                    });

                    it('ignores accounts that have been tracked', function () {
                        // Make the account appear to have been tracked.
                        isBeingTracked = true;

                        // This loads the items, which will try to auto-refresh.
                        createController();
                        $scope.$digest();

                        // Check that nothing happened.
                        checkRefresh(false);
                    });

                    it('refreshes accounts that can be refreshed but have not been refreshed yet', function () {
                        // This loads the items, which will try to auto-refresh.
                        createController();
                        $scope.$digest();

                        // Check that nothing happened.
                        checkRefresh(true);
                    });
                });

                describe('isExpanded', function () {
                    it('should call through to manageAccountDataService and return result', function () {
                        var item = { id: 123 },
                            ctrl = createController(),
                            expectedResult = true,
                            actualResult = undefined;
                        spyOn(manageAccountDataService, 'isExpanded').and.returnValue(expectedResult);
                        actualResult = ctrl.isExpanded(item);
                        expect(manageAccountDataService.isExpanded).toHaveBeenCalledWith(item);
                        expect(actualResult).toBe(expectedResult);
                    });
                });

                describe('toggleExpanded', function () {
                    it('should call through to manageAccountDataService', function () {
                        var item = { id: 123 },
                            ctrl = createController();
                        spyOn(manageAccountDataService, 'toggleExpanded');
                        ctrl.toggleExpanded(item);
                        expect(manageAccountDataService.toggleExpanded).toHaveBeenCalledWith(item);
                    });
                });

                it('should call through to manageAccountDataService to determine if dirty', function () {
                    spyOn(manageAccountDataService, 'isDirty').and.callThrough();
                    var ctrl = createController();
                    ctrl.isDirty();
                    expect(manageAccountDataService.isDirty).toHaveBeenCalled();
                });

                it('should call the open create account modal function if promptCreateAccount clicked', function () {
                    var deferred = $q.defer();
                    spyOn(identityService, 'getIdentity').and.returnValue(deferred.promise);
                    spyOn(spModal, 'open').and.returnValue(deferred.promise);
                    $httpBackend.expectGET(configUrl).respond(200, {});
                    var ctrl = createController();
                    ctrl.promptCreateAccount();
                    $rootScope.$apply();
                    expect(spModal.open).toHaveBeenCalled();
                });

                describe('promptAccountActionMobile', function () {
                    it('should call the open account action modal function if promptAccountActionMobile clicked', function () {
                        $httpBackend.expectGET(configUrl).respond(200, {});
                        var deferred = $q.defer();
                        spyOn(spModal, 'open').and.returnValue({
                            result: deferred.promise
                        });
                        deferred.resolve(new WorkflowResultItem({}));
                        var ctrl = createController();
                        spyOn(ctrl, 'fetchItems').and.returnValue($q.when());
                        spyOn(ctrl, 'updateMenuItems').and.callFake(angular.noop);

                        ctrl.promptAccountActionMobile(new AccountLink({}), {});
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(ctrl.fetchItems).toHaveBeenCalled();
                        expect(ctrl.updateMenuItems).toHaveBeenCalled();
                    });
                });

                describe('constructor', function () {
                    it('should open error dialog when quicklink is not definded', function () {
                        identityService.getAvailableActionsMap = function () {
                            return {};
                        };
                        spyOn(spModal, 'open').and.returnValue({ result: $q.when() });
                        spyOn(identityService, 'goBack').and.returnValue({});
                        createController();
                        timeoutService.flush();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(identityService.goBack).toHaveBeenCalled();
                        var callArgs = spModal.open.calls.mostRecent().args;
                        expect(callArgs[0].title).toEqual('ui_identity_error_unable_to_manage_id_title');
                        expect(callArgs[0].warningLevel).toEqual('error');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L01hbmFnZUFjY291bnRDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQix1QkFBdUIsVUFBVSxTQUFTOzs7O0lBSTdHOztJQUVBLElBQUksZ0JBQWdCO0lBQ3BCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7O1lBTjdCLFNBQVMscUJBQXFCLFlBQVc7Z0JBQ3JDLElBQUksY0FBVztvQkFBRSxTQUFNO29CQUFFLGFBQVU7b0JBQUUsZUFBWTtvQkFBRSwyQkFBd0I7b0JBQUUsVUFBTztvQkFBRSx1QkFBb0I7b0JBQUUsS0FBRTtvQkFDMUcsa0JBQWU7b0JBQUUsZUFBWTtvQkFBRSxZQUFTO29CQUFFLGNBQVc7b0JBQUUsY0FBVztvQkFBRSxxQkFBa0I7b0JBQUUsVUFBTztvQkFBRSxTQUFNO29CQUN2RyxZQUFTO29CQUFFLGlCQUFjOztnQkFFN0IsV0FBVyxPQUFPLGdCQUFnQjs7O2dCQUdsQyxXQUFXLE9BQU8sVUFBUyxlQUFlLDRCQUE0QixjQUFjLGdCQUFnQixXQUN6RSx3QkFBd0IsTUFBTSxtQkFBbUIsZ0JBQWdCLGVBQ2pFLGVBQWUsc0JBQXNCLGFBQWEsZUFBZSxlQUNqRSxZQUFZO29CQUNuQyxjQUFjO29CQUNkLDJCQUEyQjtvQkFDM0IsdUJBQXVCO29CQUN2QixrQkFBa0I7b0JBQ2xCLFNBQVMsYUFBYTtvQkFDdEIsZUFBZTtvQkFDZixLQUFLO29CQUNMLFVBQVU7b0JBQ1YsYUFBYTtvQkFDYixlQUFlO29CQUNmLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxxQkFBcUI7b0JBQ3JCLFlBQVk7b0JBQ1osaUJBQWlCO29CQUNqQixZQUFZOzs7b0JBR1osU0FBUztvQkFDVCxVQUFVLElBQUks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dHJsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiAoYykgQ29weXJpZ2h0IDIwMTYuIFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqL1xyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGlkZW50aXR5TW9kdWxlIGZyb20gJ2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcclxuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdNYW5hZ2VBY2NvdW50Q3RybCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0ICRjb250cm9sbGVyLCAkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLCBzcE1vZGFsLCBtYW5hZ2VBY2NvdW50U2VydmljZSwgJHEsXHJcbiAgICAgICAgaWRlbnRpdHlTZXJ2aWNlLCAkaHR0cEJhY2tlbmQsIGNvbmZpZ1VybCwgdGVzdFNlcnZpY2UsIEFjY291bnRMaW5rLCBXb3JrZmxvd1Jlc3VsdEl0ZW0sIGFjY291bnQsIHN0YXR1cyxcclxuICAgICAgICBRdWlja0xpbmssIHRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGlkZW50aXR5TW9kdWxlLCB0ZXN0TW9kdWxlKSk7XHJcblxyXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTYgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kY29udHJvbGxlcl8sIF9tYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2VfLCBfJHJvb3RTY29wZV8sIF8kc3RhdGVQYXJhbXNfLCBfc3BNb2RhbF8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbWFuYWdlQWNjb3VudFNlcnZpY2VfLCBfJHFfLCBfaWRlbnRpdHlTZXJ2aWNlXywgXyRodHRwQmFja2VuZF8sIF90ZXN0U2VydmljZV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQWNjb3VudExpbmtfLCBfV29ya2Zsb3dSZXN1bHRJdGVtXywgX1F1aWNrTGlua18sIExpc3RSZXN1bHREVE8sIGNvbmZpZ1NlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfJHRpbWVvdXRfKSB7XHJcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xyXG4gICAgICAgIG1hbmFnZUFjY291bnREYXRhU2VydmljZSA9IF9tYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2VfO1xyXG4gICAgICAgIG1hbmFnZUFjY291bnRTZXJ2aWNlID0gX21hbmFnZUFjY291bnRTZXJ2aWNlXztcclxuICAgICAgICBpZGVudGl0eVNlcnZpY2UgPSBfaWRlbnRpdHlTZXJ2aWNlXztcclxuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV8uJG5ldygpO1xyXG4gICAgICAgICRzdGF0ZVBhcmFtcyA9IF8kc3RhdGVQYXJhbXNfO1xyXG4gICAgICAgICRxID0gXyRxXztcclxuICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcbiAgICAgICAgJGh0dHBCYWNrZW5kID0gXyRodHRwQmFja2VuZF87XHJcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xyXG4gICAgICAgIEFjY291bnRMaW5rID0gX0FjY291bnRMaW5rXztcclxuICAgICAgICBXb3JrZmxvd1Jlc3VsdEl0ZW0gPSBfV29ya2Zsb3dSZXN1bHRJdGVtXztcclxuICAgICAgICBRdWlja0xpbmsgPSBfUXVpY2tMaW5rXztcclxuICAgICAgICB0aW1lb3V0U2VydmljZSA9IF8kdGltZW91dF87XHJcbiAgICAgICAgY29uZmlnVXJsID0gJy91aS9yZXN0L2NvbmZpZ3VyYXRpb24vdWljb25maWcvZW50cmllcz9rZXk9bWFuYWdlQWNjb3VudExpbmtDb2xDb25maWcnO1xyXG5cclxuICAgICAgICAvLyBNb2NrIHRoZSBtYW5hZ2VBY2NvdW50U2VydmljZSB0byByZXR1cm4gYSBzaW5nbGUgYWNjb3VudC5cclxuICAgICAgICBzdGF0dXMgPSAnZG91YmxlIHBsYXRpbnVtJztcclxuICAgICAgICBhY2NvdW50ID0gbmV3IEFjY291bnRMaW5rKHtcclxuICAgICAgICAgICAgaWQ6ICcxMjM0NScsXHJcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3B5T24obWFuYWdlQWNjb3VudFNlcnZpY2UsICdnZXRNYW5hZ2VBY2NvdW50cycpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogbmV3IExpc3RSZXN1bHREVE8oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHM6IFsgYWNjb3VudCBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTW9jayBmYWtlIGNvbmZpZ3MgdG8gYXZvaWQgSFRUUCBjYWxscy5cclxuICAgICAgICBzcHlPbihtYW5hZ2VBY2NvdW50U2VydmljZSwgJ2dldENyZWF0ZUFjY291bnRDb25maWcnKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCB7fSwge30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNweU9uKGNvbmZpZ1NlcnZpY2UsICdnZXRDb2x1bW5Db25maWdFbnRyaWVzJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oeyBkYXRhOiB7fSB9KSk7XHJcblxyXG4gICAgICAgIGxldCBtYXAgPSB7fSxcclxuICAgICAgICAgICAgcWxEYXRhID0ge25hbWU6ICdhY2NvdW50UXVpY2tMaW5rTmFtZSd9O1xyXG4gICAgICAgIG1hcFtRdWlja0xpbmsuQWN0aW9ucy5NQU5BR0VfQUNDT1VOVFNdID0gbmV3IFF1aWNrTGluayhxbERhdGEpO1xyXG4gICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRBdmFpbGFibGVBY3Rpb25zTWFwID0gZnVuY3Rpb24oKSB7IHJldHVybiBtYXA7fTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKCkge1xyXG4gICAgICAgICRzdGF0ZVBhcmFtcy5pZGVudGl0eUlkID0gJ3NvbWVJZCc7XHJcbiAgICAgICAgJHN0YXRlUGFyYW1zLnF1aWNrTGluayA9ICdhY2NvdW50UXVpY2tMaW5rTmFtZSc7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdNYW5hZ2VBY2NvdW50Q3RybCcsIHtcclxuICAgICAgICAgICAgJHNjb3BlOiAkc2NvcGUsXHJcbiAgICAgICAgICAgICRzdGF0ZVBhcmFtczogJHN0YXRlUGFyYW1zLFxyXG4gICAgICAgICAgICBtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2U6IG1hbmFnZUFjY291bnREYXRhU2VydmljZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2NyaWJlKCdhY2NvdW50IHJlZnJlc2gnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGZvdW5kTGluaywgbm90Rm91bmRMaW5rO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgZm91bmRMaW5rID0gbmV3IEFjY291bnRMaW5rKHtcclxuICAgICAgICAgICAgICAgIGlkOiBhY2NvdW50LmlkLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnaSBhbSBhbiB1cGRhdGVkIHN0YXR1cydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBub3RGb3VuZExpbmsgPSBuZXcgQWNjb3VudExpbmsoe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICd0aGlzIElEIHdpbGwgbm90IGJlIGZvdW5kIGFueXdoZXJlJyxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogJ2JsdXJnaGh0aGhoaGgnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVnaXN0ZXJzIGNvbnRyb2xsZXIgd2l0aCB0aGUgQWNjb3VudFJlZnJlc2hUcmFja2VyIHdoZW4gY29uc3RydWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0cmFja2VyID0gbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLmdldEFjY291bnRSZWZyZXNoVHJhY2tlcigpO1xyXG4gICAgICAgICAgICBzcHlPbih0cmFja2VyLCAncmVnaXN0ZXJSZWZyZXNoTGlzdGVuZXInKTtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLnJlZ2lzdGVyUmVmcmVzaExpc3RlbmVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjdHJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3VucmVnaXN0ZXJzIGNvbnRyb2xsZXIgZnJvbSB0aGUgQWNjb3VudFJlZnJlc2hUcmFja2VyIHdoZW4gZGVzdHJveWVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdHJhY2tlciA9IG1hbmFnZUFjY291bnREYXRhU2VydmljZS5nZXRBY2NvdW50UmVmcmVzaFRyYWNrZXIoKTtcclxuICAgICAgICAgICAgc3B5T24odHJhY2tlciwgJ3VucmVnaXN0ZXJSZWZyZXNoTGlzdGVuZXInKTtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci51bnJlZ2lzdGVyUmVmcmVzaExpc3RlbmVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjdHJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ2xpbmtSZWZyZXNoZWQoKScsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90aGluZyBpZiBsaW5rIGlzIG5vdCBpbiB0aGUgbGlzdCBhbnltb3JlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5saW5rUmVmcmVzaGVkKG5vdEZvdW5kTGluayk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjb3VudC5zdGF0dXMpLnRvRXF1YWwoc3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgndXBkYXRlcyB0aGUgbGluayBpbiB0aGUgbGlzdCB3aXRoIHRoZSB1cGRhdGVkIHByb3BlcnRpZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmxpbmtSZWZyZXNoZWQoZm91bmRMaW5rKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2NvdW50LnN0YXR1cykudG9FcXVhbChmb3VuZExpbmsuc3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdsaW5rRGVsZXRlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIGxpbmsgaXMgbm90IGluIHRoZSBsaXN0IGFueW1vcmUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmxpbmtEZWxldGVkKG5vdEZvdW5kTGluayk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjb3VudC5kZWxldGVkKS50b0JlRmFsc3koKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnbWFya3MgdGhlIGxpbmsgaW4gdGhlIGxpc3QgYXMgZGVsZXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwubGlua0RlbGV0ZWQoZm91bmRMaW5rLmlkKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2NvdW50LmRlbGV0ZWQpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2F1dG8tcmVmcmVzaCcsICgpID0+IHtcclxuICAgICAgICBsZXQgaXNCZWluZ1RyYWNrZWQ7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBhY2NvdW50IHRoYXQgZ2V0cyByZXR1cm5lZCBiZSBzZXR1cCB0byBhdXRvLXJlZnJlc2guXHJcbiAgICAgICAgICAgIGFjY291bnQuc3VwcG9ydHNSZWZyZXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgYWNjb3VudC5hdXRvUmVmcmVzaCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAvLyBNb2NrIHRoZSBBY2NvdW50UmVmcmVzaFRyYWNrZXIgdG8gcmV0dXJuIG91ciB2YWx1ZXMuXHJcbiAgICAgICAgICAgIGlzQmVpbmdUcmFja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCB0cmFja2VyID0gbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLmdldEFjY291bnRSZWZyZXNoVHJhY2tlcigpO1xyXG4gICAgICAgICAgICBzcHlPbih0cmFja2VyLCAnaXNCZWluZ1RyYWNrZWQnKS5hbmQuY2FsbEZha2UoKCkgPT4gaXNCZWluZ1RyYWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWxzbywgd2F0Y2ggZm9yIGFueSBhY2NvdW50cyB0aGF0IGFyZSBiZWluZyByZWZyZXNoZWQuXHJcbiAgICAgICAgICAgIHNweU9uKHRyYWNrZXIsICdhY2NvdW50c0JlaW5nUmVmcmVzaGVkJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBOZXV0ZXIgdGhlIHJlZnJlc2hMaW5rKCkgY2FsbC5cclxuICAgICAgICAgICAgc3B5T24obWFuYWdlQWNjb3VudFNlcnZpY2UsICdyZWZyZXNoTGlua3MnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihbIHsgaTogJ2FtIGEgcmVzdWx0JyB9IF0pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tSZWZyZXNoKGV4cGVjdEl0KSB7XHJcbiAgICAgICAgICAgIGxldCB0cmFja2VyID0gbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLmdldEFjY291bnRSZWZyZXNoVHJhY2tlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV4cGVjdEl0KSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QobWFuYWdlQWNjb3VudFNlcnZpY2UucmVmcmVzaExpbmtzKS5cclxuICAgICAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aCgkc3RhdGVQYXJhbXMucXVpY2tMaW5rLCAkc3RhdGVQYXJhbXMuaWRlbnRpdHlJZCwgWyBhY2NvdW50LmlkIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmFjY291bnRzQmVpbmdSZWZyZXNoZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBhY2NvdW50c0JlaW5nUmVmcmVzaGVkID0gdHJhY2tlci5hY2NvdW50c0JlaW5nUmVmcmVzaGVkLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY291bnRzQmVpbmdSZWZyZXNoZWQpLnRvRXF1YWwoWyBhY2NvdW50LmlkIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KG1hbmFnZUFjY291bnRTZXJ2aWNlLnJlZnJlc2hMaW5rcykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmFjY291bnRzQmVpbmdSZWZyZXNoZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdpZ25vcmVzIGFjY291bnRzIHRoYXQgYXJlIG5vdCBzZXR1cCBmb3IgYXV0b1JlZnJlc2gnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFR1cm4gb2ZmIGF1dG8tcmVmcmVzaCBmb3IgdGhlIGFjY291bnQgYmVpbmcgcmV0dXJuZWQuXHJcbiAgICAgICAgICAgIGFjY291bnQuYXV0b1JlZnJlc2ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgbG9hZHMgdGhlIGl0ZW1zLCB3aGljaCB3aWxsIHRyeSB0byBhdXRvLXJlZnJlc2guXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgbm90aGluZyBoYXBwZW5lZC5cclxuICAgICAgICAgICAgY2hlY2tSZWZyZXNoKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lnbm9yZXMgYWNjb3VudHMgdGhhdCBoYXZlIGJlZW4gdHJhY2tlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gTWFrZSB0aGUgYWNjb3VudCBhcHBlYXIgdG8gaGF2ZSBiZWVuIHRyYWNrZWQuXHJcbiAgICAgICAgICAgIGlzQmVpbmdUcmFja2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgbG9hZHMgdGhlIGl0ZW1zLCB3aGljaCB3aWxsIHRyeSB0byBhdXRvLXJlZnJlc2guXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgbm90aGluZyBoYXBwZW5lZC5cclxuICAgICAgICAgICAgY2hlY2tSZWZyZXNoKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlZnJlc2hlcyBhY2NvdW50cyB0aGF0IGNhbiBiZSByZWZyZXNoZWQgYnV0IGhhdmUgbm90IGJlZW4gcmVmcmVzaGVkIHlldCcsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gVGhpcyBsb2FkcyB0aGUgaXRlbXMsIHdoaWNoIHdpbGwgdHJ5IHRvIGF1dG8tcmVmcmVzaC5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCBub3RoaW5nIGhhcHBlbmVkLlxyXG4gICAgICAgICAgICBjaGVja1JlZnJlc2godHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNFeHBhbmRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCB0aHJvdWdoIHRvIG1hbmFnZUFjY291bnREYXRhU2VydmljZSBhbmQgcmV0dXJuIHJlc3VsdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHtpZDogMTIzfSxcclxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCksXHJcbiAgICAgICAgICAgICAgICBleHBlY3RlZFJlc3VsdCA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhY3R1YWxSZXN1bHQ7XHJcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZUFjY291bnREYXRhU2VydmljZSwgJ2lzRXhwYW5kZWQnKS5hbmQucmV0dXJuVmFsdWUoZXhwZWN0ZWRSZXN1bHQpO1xyXG4gICAgICAgICAgICBhY3R1YWxSZXN1bHQgPSBjdHJsLmlzRXhwYW5kZWQoaXRlbSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2UuaXNFeHBhbmRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY3R1YWxSZXN1bHQpLnRvQmUoZXhwZWN0ZWRSZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3RvZ2dsZUV4cGFuZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHRocm91Z2ggdG8gbWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0ge2lkOiAxMjN9LFxyXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24obWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLCAndG9nZ2xlRXhwYW5kZWQnKTtcclxuICAgICAgICAgICAgY3RybC50b2dnbGVFeHBhbmRlZChpdGVtKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZUFjY291bnREYXRhU2VydmljZS50b2dnbGVFeHBhbmRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIGNhbGwgdGhyb3VnaCB0byBtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2UgdG8gZGV0ZXJtaW5lIGlmIGRpcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5T24obWFuYWdlQWNjb3VudERhdGFTZXJ2aWNlLCAnaXNEaXJ0eScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgIGN0cmwuaXNEaXJ0eSgpO1xyXG4gICAgICAgIGV4cGVjdChtYW5hZ2VBY2NvdW50RGF0YVNlcnZpY2UuaXNEaXJ0eSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHRoZSBvcGVuIGNyZWF0ZSBhY2NvdW50IG1vZGFsIGZ1bmN0aW9uIGlmIHByb21wdENyZWF0ZUFjY291bnQgY2xpY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAnZ2V0SWRlbnRpdHknKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XHJcbiAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XHJcbiAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCB7fSk7XHJcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgY3RybC5wcm9tcHRDcmVhdGVBY2NvdW50KCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncHJvbXB0QWNjb3VudEFjdGlvbk1vYmlsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgb3BlbiBhY2NvdW50IGFjdGlvbiBtb2RhbCBmdW5jdGlvbiBpZiBwcm9tcHRBY2NvdW50QWN0aW9uTW9iaWxlIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCB7fSk7XHJcbiAgICAgICAgICAgIGxldCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLnJldHVyblZhbHVlKHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDogZGVmZXJyZWQucHJvbWlzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShuZXcgV29ya2Zsb3dSZXN1bHRJdGVtKHt9KSk7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnZmV0Y2hJdGVtcycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAndXBkYXRlTWVudUl0ZW1zJykuYW5kLmNhbGxGYWtlKGFuZ3VsYXIubm9vcCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnByb21wdEFjY291bnRBY3Rpb25Nb2JpbGUobmV3IEFjY291bnRMaW5rKHt9KSwge30pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmZldGNoSXRlbXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwudXBkYXRlTWVudUl0ZW1zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gZXJyb3IgZGlhbG9nIHdoZW4gcXVpY2tsaW5rIGlzIG5vdCBkZWZpbmRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZGVudGl0eVNlcnZpY2UuZ2V0QXZhaWxhYmxlQWN0aW9uc01hcCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4ge307fTtcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUoe3Jlc3VsdDogJHEud2hlbigpfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ2dvQmFjaycpLmFuZC5yZXR1cm5WYWx1ZSh7fSk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgdGltZW91dFNlcnZpY2UuZmx1c2goKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlTZXJ2aWNlLmdvQmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBsZXQgY2FsbEFyZ3MgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XHJcbiAgICAgICAgICAgIGV4cGVjdChjYWxsQXJnc1swXS50aXRsZSkudG9FcXVhbCgndWlfaWRlbnRpdHlfZXJyb3JfdW5hYmxlX3RvX21hbmFnZV9pZF90aXRsZScpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2FsbEFyZ3NbMF0ud2FybmluZ0xldmVsKS50b0VxdWFsKCdlcnJvcicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
