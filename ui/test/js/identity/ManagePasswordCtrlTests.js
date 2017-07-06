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

            describe('ManagePasswordCtrl', function () {

                var quickLink = 'Manage%20Passwords';
                var $stateParams = undefined,
                    $controller = undefined,
                    $rootScope = undefined,
                    $scope = undefined,
                    managePasswordService = undefined,
                    identityId = undefined,
                    identityService = undefined,
                    managePasswordDataService = undefined,
                    navigationService = undefined,
                    spModal = undefined,
                    $q = undefined,
                    testService = undefined,
                    CheckboxMultiSelect = undefined,
                    ListResultDTO = undefined,
                    BulkPasswordChangeResult = undefined,
                    LINK_ID_ONE = 1,
                    LINK_ID_TWO = 2,
                    LINK_ONE = undefined,
                    LINK_TWO = undefined,
                    $httpBackend = undefined,
                    configUrl = undefined,
                    QuickLink = undefined,
                    timeoutService = undefined;

                beforeEach(module(identityModule, testModule));

                /* jshint maxparams: 16 */
                beforeEach(inject(function (_$controller_, _managePasswordService_, _$q_, _QuickLink_, _identityService_, PasswordLink, _$rootScope_, _spModal_, _navigationService_, _testService_, _managePasswordDataService_, _CheckboxMultiSelect_, _ListResultDTO_, _BulkPasswordChangeResult_, _$httpBackend_, _$timeout_) {

                    $controller = _$controller_;
                    $rootScope = _$rootScope_;
                    $httpBackend = _$httpBackend_;
                    managePasswordService = _managePasswordService_;
                    managePasswordDataService = _managePasswordDataService_;
                    CheckboxMultiSelect = _CheckboxMultiSelect_;
                    ListResultDTO = _ListResultDTO_;
                    BulkPasswordChangeResult = _BulkPasswordChangeResult_;
                    navigationService = _navigationService_;
                    identityService = _identityService_;
                    spModal = _spModal_;
                    $q = _$q_;
                    testService = _testService_;
                    QuickLink = _QuickLink_;
                    identityService = _identityService_;
                    timeoutService = _$timeout_;
                    identityId = '1234';
                    configUrl = '/ui/rest/configuration/uiconfig/entries?key=managePasswordLinkColConfig';

                    // Create some mock data
                    $stateParams = {
                        identityId: identityId,
                        quickLink: 'Manage%20Passwords'

                    };
                    spyOn(managePasswordService, 'getManagePasswordAccounts').and.callFake(function () {
                        return testService.createPromise(false, {}, {});
                    });

                    LINK_ONE = {
                        getId: function () {
                            return LINK_ID_ONE;
                        }
                    };
                    LINK_TWO = {
                        getId: function () {
                            return LINK_ID_TWO;
                        }
                    };
                    var map = {},
                        qlData = { name: 'Manage%20Passwords' };
                    map[QuickLink.Actions.MANAGE_PASSWORDS] = new QuickLink(qlData);
                    identityService.getAvailableActionsMap = function () {
                        return map;
                    };
                }));

                function createController() {
                    $scope = $rootScope.$new();
                    var ctrl = $controller('ManagePasswordCtrl', {
                        $scope: $scope,
                        managePasswordService: managePasswordService,
                        managePasswordDataService: managePasswordDataService,
                        $stateParams: $stateParams,
                        CheckboxMultiSelect: CheckboxMultiSelect
                    }),
                        listResult = undefined;

                    listResult = new ListResultDTO({
                        count: 2,
                        objects: [LINK_ONE, LINK_TWO]
                    });
                    ctrl.linkListResultDTO = listResult;
                    return ctrl;
                }

                describe('constructor', function () {
                    it('throws if identity ID is missing', function () {
                        delete $stateParams.identityId;
                        expect(function () {
                            createController(0);
                        }).toThrow();
                    });
                });

                describe('getItems', function () {
                    it('getItems() calls service', function () {
                        var ctrl = createController(),
                            start = 0,
                            limit = 10,
                            sortOrder = 'fakeSortOrder';
                        expect(managePasswordService.getManagePasswordAccounts).toHaveBeenCalled();
                        managePasswordService.getManagePasswordAccounts.calls.reset();
                        ctrl.getItems(start, limit, sortOrder);
                        expect(managePasswordService.getManagePasswordAccounts).toHaveBeenCalledWith(identityId, start, limit, sortOrder, quickLink);
                    });
                });

                describe('mergeConstraints', function () {
                    it('sets errors if mergeConstraints fails', function () {
                        $httpBackend.expectGET(configUrl).respond(200, {});
                        var ctrl = createController(),
                            deferred = $q.defer();
                        spyOn(managePasswordService, 'mergeConstraints').and.returnValue(deferred.promise);
                        deferred.reject(['you suck']);

                        ctrl.getMergedConstraints(true);
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(1);
                    });

                    it('does not set errors if mergeConstraints fails', function () {
                        $httpBackend.expectGET(configUrl).respond(200, {});

                        var ctrl = createController(),
                            deferred = $q.defer();
                        spyOn(managePasswordService, 'mergeConstraints').and.returnValue(deferred.promise);
                        deferred.reject(['you suck']);

                        ctrl.getMergedConstraints(false);
                        $rootScope.$apply();
                        expect(ctrl.getErrors().length).toEqual(0);
                    });
                });

                describe('isBulk', function () {
                    it('returns true if selection count is greater than 0', function () {
                        var ctrl = createController();
                        ctrl.getCheckboxMultiSelect().selectItem(LINK_ONE);
                        expect(ctrl.isBulk()).toBeTruthy();
                    });

                    it('returns false if selection count is 0', function () {
                        var ctrl = createController();
                        expect(ctrl.isBulk()).toBeFalsy();
                    });
                });

                it('should clear selections on successful sync submission', function () {
                    $httpBackend.expectGET(configUrl).respond(200, {});
                    var ctrl = createController(),
                        result = { newPasswordInput: new BulkPasswordChangeResult({}) };
                    ctrl.getCheckboxMultiSelect().selectItem(LINK_ONE);
                    ctrl.getCheckboxMultiSelect().selectItem(LINK_TWO);
                    expect(ctrl.getCheckboxMultiSelect().getSelectionCount()).toBe(2);
                    spyOn(spModal, 'open').and.returnValue({
                        result: $q.when(result)
                    });
                    spyOn(identityService, 'promptWorkItemDialog');
                    ctrl.promptSynchronizePasswords();
                    $rootScope.$apply();
                    expect(ctrl.getCheckboxMultiSelect().getSelectionCount()).toBe(0);
                    /* Just a sanity check, make sure the workitem dialog isn't popped unnecessarily */
                    expect(identityService.promptWorkItemDialog).not.toHaveBeenCalled();
                });

                it('should call the open work item modal function if change result has a workitem', function () {
                    $httpBackend.expectGET(configUrl).respond(200, {});
                    var ctrl = createController(),
                        result = { newPasswordInput: new BulkPasswordChangeResult({
                            workflowWorkItemType: 'Form',
                            workflowWorkItemId: 'workitemId'
                        }) };
                    ctrl.getCheckboxMultiSelect().selectItem(LINK_ONE);
                    spyOn(spModal, 'open').and.returnValue({
                        result: $q.when(result)
                    });
                    spyOn(identityService, 'promptWorkItemDialog');
                    ctrl.promptSynchronizePasswords();
                    $rootScope.$apply();
                    expect(identityService.promptWorkItemDialog).toHaveBeenCalled();
                });

                it('should clear out the bulkPasswordResult when destroyed', function () {
                    createController();
                    managePasswordDataService.setBulkPasswordChangeResult({ blah: 'blah' });
                    expect(managePasswordDataService.getBulkPasswordChangeResult()).not.toBeNull();
                    $scope.$destroy();
                    expect(managePasswordDataService.getBulkPasswordChangeResult()).toBeNull();
                });

                describe('getLinkById', function () {
                    var ctrl = undefined;

                    beforeEach(function () {
                        ctrl = createController();
                    });

                    it('should return the link if it is present on the page', function () {
                        var link = ctrl.getLinkById(LINK_ID_TWO);
                        expect(link).toBe(LINK_TWO);
                    });

                    it('should return undefined if the link is not on the page', function () {
                        var link = ctrl.getLinkById(42);
                        expect(link).toBeUndefined();
                    });
                });

                describe('generatePasswords', function () {
                    var ctrl = undefined;
                    beforeEach(function () {
                        ctrl = createController();
                    });

                    it('should call mergeConstraints', function () {
                        spyOn(managePasswordService, 'mergeConstraints').and.returnValue($q.when('hooray'));
                        ctrl.promptGeneratePasswords();
                        expect(managePasswordService.mergeConstraints).toHaveBeenCalled();
                    });

                    it('should open the workitem dialog if there is a workitem id', function () {
                        $httpBackend.expectGET(configUrl).respond(200, {});
                        var ctrl = createController();
                        ctrl.getCheckboxMultiSelect().selectItem(LINK_ONE);
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.when(new BulkPasswordChangeResult({
                                workflowWorkItemType: 'Form',
                                workflowWorkItemId: 'workitemId'
                            }))
                        });
                        spyOn(identityService, 'promptWorkItemDialog');
                        spyOn(ctrl, 'getMergedConstraints').and.returnValue($q.when([]));
                        ctrl.promptGeneratePasswords();
                        $httpBackend.expectGET(configUrl).respond(200, {});
                        $rootScope.$apply();
                        expect(identityService.promptWorkItemDialog).toHaveBeenCalled();
                    });
                });

                describe('promptChangePasswordMobile', function () {
                    it('should call the open change password modal function if promptChangePasswordMobile clicked', function () {
                        $httpBackend.expectGET(configUrl).respond(200, {});
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.defer().promise
                        });
                        var ctrl = createController();
                        ctrl.promptChangePasswordMobile();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('constructor', function () {
                    it('should open error dialog when quicklink is not definded', function () {
                        identityService.getAvailableActionsMap = function () {
                            return {};
                        };
                        spyOn(spModal, 'open').and.returnValue({ result: $q.when() });
                        spyOn(identityService, 'goBack').and.returnValue({});
                        $httpBackend.expectGET(configUrl).respond(200, {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L01hbmFnZVBhc3N3b3JkQ3RybFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwyQkFBMkIsdUJBQXVCLFVBQVUsU0FBUzs7OztJQUk3Rzs7SUFFQSxJQUFJLGdCQUFnQjtJQUNwQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQU43QixTQUFTLHNCQUFzQixZQUFXOztnQkFFdEMsSUFBTSxZQUFZO2dCQUNsQixJQUFJLGVBQVk7b0JBQUUsY0FBVztvQkFBRSxhQUFVO29CQUFFLFNBQU07b0JBQUUsd0JBQXFCO29CQUFFLGFBQVU7b0JBQUUsa0JBQWU7b0JBQ2pHLDRCQUF5QjtvQkFBRSxvQkFBaUI7b0JBQUUsVUFBTztvQkFBRSxLQUFFO29CQUFFLGNBQVc7b0JBQUUsc0JBQW1CO29CQUFFLGdCQUFhO29CQUMxRywyQkFBd0I7b0JBQUUsY0FBYztvQkFBRyxjQUFjO29CQUFHLFdBQVE7b0JBQUUsV0FBUTtvQkFBRSxlQUFZO29CQUFFLFlBQVM7b0JBQ3ZHLFlBQVM7b0JBQUUsaUJBQWM7O2dCQUU3QixXQUFXLE9BQU8sZ0JBQWdCOzs7Z0JBR2xDLFdBQVcsT0FBTyxVQUFTLGVBQWUseUJBQXlCLE1BQU0sYUFBYSxtQkFDM0QsY0FBYyxjQUFjLFdBQVcscUJBQXFCLGVBQzVELDZCQUE2Qix1QkFBdUIsaUJBQ3BELDRCQUE0QixnQkFBZ0IsWUFBWTs7b0JBRS9FLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixlQUFlO29CQUNmLHdCQUF3QjtvQkFDeEIsNEJBQTRCO29CQUM1QixzQkFBc0I7b0JBQ3RCLGdCQUFnQjtvQkFDaEIsMkJBQTJCO29CQUMzQixvQkFBb0I7b0JBQ3BCLGtCQUFrQjtvQkFDbEIsVUFBVTtvQkFDVixLQUFLO29CQUNMLGNBQWM7b0JBQ2QsWUFBWTtvQkFDWixrQkFBa0I7b0JBQ2xCLGlCQUFpQjtvQkFDakIsYUFBYTtvQkFDYixZQUFZOzs7b0JBR1osZUFBZTt3QkFDWCxZQUFZO3dCQUNaLFdBQVc7OztvQkFHZixNQUFNLHVCQUF1Qiw2QkFBNkIsSUFBSSxTQUFTLFlBQVc7d0JBQzlFLE9BQU8sWUFBWSxjQUFjLE9BQU8sSUFBSTs7O29CQUdoRCxXQUFXO3dCQUNQLE9BQU8sWUFBVzs0QkFBRSxPQUFPOzs7b0JBRS9CLFdBQVc7d0JBQ1AsT0FBTyxZQUFXOzRCQUFFLE9BQU87OztvQkFFL0IsSUFBSSxNQUFNO3dCQUNOLFNBQVMsRUFBQyxNQUFNO29CQUNwQixJQUFJLFVBQVUsUUFBUSxvQkFBb0IsSUFBSSxVQUFVO29CQUN4RCxnQkFBZ0IseUJBQXlCLFlBQVc7d0JBQUUsT0FBTzs7OztnQkFHakUsU0FBUyxtQkFBbUI7b0JBQ3hCLFNBQVMsV0FBVztvQkFDcEIsSUFBSSxPQUFPLFlBQVksc0JBQXNCO3dCQUNyQyxRQUFRO3dCQUNSLHVCQUF1Qjt3QkFDdkIsMkJBQTJCO3dCQUMzQixjQUFjO3dCQUNkLHFCQUFxQjs7d0JBRXpCLGFBQVU7O29CQUVkLGFBQWEsSUFBSSxjQUFjO3dCQUMzQixPQUFPO3dCQUNQLFNBQVMsQ0FBQyxVQUFVOztvQkFFeEIsS0FBSyxvQkFBb0I7b0JBQ3pCLE9BQU87OztnQkFHWCxTQUFTLGVBQWUsWUFBVztvQkFDL0IsR0FBRyxvQ0FBb0MsWUFBVzt3QkFDOUMsT0FBTyxhQUFhO3dCQUNwQixPQUFPLFlBQVc7NEJBQUUsaUJBQWlCOzJCQUFPOzs7O2dCQUlwRCxTQUFTLFlBQVksWUFBVztvQkFDNUIsR0FBRyw0QkFBNEIsWUFBVzt3QkFDdEMsSUFBSSxPQUFPOzRCQUNQLFFBQVE7NEJBQ1IsUUFBUTs0QkFDUixZQUFZO3dCQUNoQixPQUFPLHNCQUFzQiwyQkFBMkI7d0JBQ3hELHNCQUFzQiwwQkFBMEIsTUFBTTt3QkFDdEQsS0FBSyxTQUFTLE9BQU8sT0FBTzt3QkFDNUIsT0FBTyxzQkFBc0IsMkJBQ3pCLHFCQUFxQixZQUFZLE9BQU8sT0FBTyxXQUFXOzs7O2dCQUl0RSxTQUFTLG9CQUFvQixZQUFXO29CQUNwQyxHQUFHLHlDQUF5QyxZQUFXO3dCQUNuRCxhQUFhLFVBQVUsV0FBVyxRQUFRLEtBQUs7d0JBQy9DLElBQUksT0FBTzs0QkFDUCxXQUFXLEdBQUc7d0JBQ2xCLE1BQU0sdUJBQXVCLG9CQUFvQixJQUFJLFlBQVksU0FBUzt3QkFDMUUsU0FBUyxPQUFPLENBQUM7O3dCQUVqQixLQUFLLHFCQUFxQjt3QkFDMUIsV0FBVzt3QkFDWCxPQUFPLEtBQUssWUFBWSxRQUFRLFFBQVE7OztvQkFHNUMsR0FBRyxpREFBaUQsWUFBVzt3QkFDM0QsYUFBYSxVQUFVLFdBQVcsUUFBUSxLQUFLOzt3QkFFL0MsSUFBSSxPQUFPOzRCQUNQLFdBQVcsR0FBRzt3QkFDbEIsTUFBTSx1QkFBdUIsb0JBQW9CLElBQUksWUFBWSxTQUFTO3dCQUMxRSxTQUFTLE9BQU8sQ0FBQzs7d0JBRWpCLEtBQUsscUJBQXFCO3dCQUMxQixXQUFXO3dCQUNYLE9BQU8sS0FBSyxZQUFZLFFBQVEsUUFBUTs7OztnQkFJaEQsU0FBUyxVQUFVLFlBQVc7b0JBQzFCLEdBQUcscURBQXFELFlBQVc7d0JBQy9ELElBQUksT0FBTzt3QkFDWCxLQUFLLHlCQUF5QixXQUFXO3dCQUN6QyxPQUFPLEtBQUssVUFBVTs7O29CQUcxQixHQUFHLHlDQUF5QyxZQUFXO3dCQUNuRCxJQUFJLE9BQU87d0JBQ1gsT0FBTyxLQUFLLFVBQVU7Ozs7Z0JBSTlCLEdBQUcseURBQXlELFlBQVc7b0JBQ25FLGFBQWEsVUFBVSxXQUFXLFFBQVEsS0FBSztvQkFDL0MsSUFBSSxPQUFPO3dCQUNQLFNBQVMsRUFBRSxrQkFBa0IsSUFBSSx5QkFBeUI7b0JBQzlELEtBQUsseUJBQXlCLFdBQVc7b0JBQ3pDLEtBQUsseUJBQXlCLFdBQVc7b0JBQ3pDLE9BQU8sS0FBSyx5QkFBeUIscUJBQXFCLEtBQUs7b0JBQy9ELE1BQU0sU0FBUyxRQUFRLElBQUksWUFBWTt3QkFDbkMsUUFBUSxHQUFHLEtBQUs7O29CQUVwQixNQUFNLGlCQUFpQjtvQkFDdkIsS0FBSztvQkFDTCxXQUFXO29CQUNYLE9BQU8sS0FBSyx5QkFBeUIscUJBQXFCLEtBQUs7O29CQUUvRCxPQUFPLGdCQUFnQixzQkFBc0IsSUFBSTs7O2dCQUdyRCxHQUFHLGlGQUFpRixZQUFXO29CQUMzRixhQUFhLFVBQVUsV0FBVyxRQUFRLEtBQUs7b0JBQy9DLElBQUksT0FBTzt3QkFDUCxTQUFTLEVBQUUsa0JBQWtCLElBQUkseUJBQXlCOzRCQUN0RCxzQkFBc0I7NEJBQ3RCLG9CQUFvQjs7b0JBRTVCLEtBQUsseUJBQXlCLFdBQVc7b0JBQ3pDLE1BQU0sU0FBUyxRQUFRLElBQUksWUFBWTt3QkFDbkMsUUFBUSxHQUFHLEtBQUs7O29CQUVwQixNQUFNLGlCQUFpQjtvQkFDdkIsS0FBSztvQkFDTCxXQUFXO29CQUNYLE9BQU8sZ0JBQWdCLHNCQUFzQjs7O2dCQUdqRCxHQUFHLDBEQUEwRCxZQUFXO29CQUNwRTtvQkFDQSwwQkFBMEIsNEJBQTRCLEVBQUMsTUFBTTtvQkFDN0QsT0FBTywwQkFBMEIsK0JBQStCLElBQUk7b0JBQ3BFLE9BQU87b0JBQ1AsT0FBTywwQkFBMEIsK0JBQStCOzs7Z0JBSXBFLFNBQVMsZUFBZSxZQUFXO29CQUMvQixJQUFJLE9BQUk7O29CQUVSLFdBQVcsWUFBVzt3QkFDbEIsT0FBTzs7O29CQUdYLEdBQUcsdURBQXVELFlBQVc7d0JBQ2pFLElBQUksT0FBTyxLQUFLLFlBQVk7d0JBQzVCLE9BQU8sTUFBTSxLQUFLOzs7b0JBR3RCLEdBQUcsMERBQTBELFlBQVc7d0JBQ3BFLElBQUksT0FBTyxLQUFLLFlBQVk7d0JBQzVCLE9BQU8sTUFBTTs7OztnQkFJckIsU0FBUyxxQkFBcUIsWUFBVztvQkFDckMsSUFBSSxPQUFJO29CQUNSLFdBQVcsWUFBVzt3QkFDbEIsT0FBTzs7O29CQUdYLEdBQUcsZ0NBQWdDLFlBQVc7d0JBQzFDLE1BQU0sdUJBQXVCLG9CQUFvQixJQUFJLFlBQVksR0FBRyxLQUFLO3dCQUN6RSxLQUFLO3dCQUNMLE9BQU8sc0JBQXNCLGtCQUFrQjs7O29CQUduRCxHQUFHLDZEQUE2RCxZQUFXO3dCQUN2RSxhQUFhLFVBQVUsV0FBVyxRQUFRLEtBQUs7d0JBQy9DLElBQUksT0FBTzt3QkFDWCxLQUFLLHlCQUF5QixXQUFXO3dCQUN6QyxNQUFNLFNBQVMsUUFBUSxJQUFJLFlBQVk7NEJBQ25DLFFBQVEsR0FBRyxLQUFLLElBQUkseUJBQXlCO2dDQUN6QyxzQkFBc0I7Z0NBQ3RCLG9CQUFvQjs7O3dCQUc1QixNQUFNLGlCQUFpQjt3QkFDdkIsTUFBTSxNQUFNLHdCQUF3QixJQUFJLFlBQVksR0FBRyxLQUFLO3dCQUM1RCxLQUFLO3dCQUNMLGFBQWEsVUFBVSxXQUFXLFFBQVEsS0FBSzt3QkFDL0MsV0FBVzt3QkFDWCxPQUFPLGdCQUFnQixzQkFBc0I7Ozs7Z0JBSXJELFNBQVMsOEJBQThCLFlBQVc7b0JBQzlDLEdBQUcsNkZBQTZGLFlBQVc7d0JBQ3ZHLGFBQWEsVUFBVSxXQUFXLFFBQVEsS0FBSzt3QkFDL0MsTUFBTSxTQUFTLFFBQVEsSUFBSSxZQUFZOzRCQUNuQyxRQUFRLEdBQUcsUUFBUTs7d0JBRXZCLElBQUksT0FBTzt3QkFDWCxLQUFLO3dCQUNMLFdBQVc7d0JBQ1gsT0FBTyxRQUFRLE1BQU07Ozs7Z0JBSTdCLFNBQVMsZUFBZSxZQUFXO29CQUMvQixHQUFHLDJEQUEyRCxZQUFXO3dCQUNyRSxnQkFBZ0IseUJBQXlCLFlBQVc7NEJBQUUsT0FBTzs7d0JBQzdELE1BQU0sU0FBUyxRQUFRLElBQUksWUFBWSxFQUFDLFFBQVEsR0FBRzt3QkFDbkQsTUFBTSxpQkFBaUIsVUFBVSxJQUFJLFlBQVk7d0JBQ2pELGFBQWEsVUFBVSxXQUFXLFFBQVEsS0FBSzt3QkFDL0M7d0JBQ0EsZUFBZTt3QkFDZixPQUFPLFFBQVEsTUFBTTt3QkFDckIsT0FBTyxnQkFBZ0IsUUFBUTt3QkFDL0IsSUFBSSxXQUFXLFFBQVEsS0FBSyxNQUFNLGFBQWE7d0JBQy9DLE9BQU8sU0FBUyxHQUFHLE9BQU8sUUFBUTt3QkFDbEMsT0FBTyxTQUFTLEdBQUcsY0FBYyxRQUFROzs7Ozs7R0FzQ2xEIiwiZmlsZSI6ImlkZW50aXR5L01hbmFnZVBhc3N3b3JkQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChjKSBDb3B5cmlnaHQgMjAxNi4gU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcblxuZGVzY3JpYmUoJ01hbmFnZVBhc3N3b3JkQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgcXVpY2tMaW5rID0gJ01hbmFnZSUyMFBhc3N3b3Jkcyc7XG4gICAgbGV0ICRzdGF0ZVBhcmFtcywgJGNvbnRyb2xsZXIsICRyb290U2NvcGUsICRzY29wZSwgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCBpZGVudGl0eUlkLCBpZGVudGl0eVNlcnZpY2UsXG4gICAgICAgIG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCBzcE1vZGFsLCAkcSwgdGVzdFNlcnZpY2UsIENoZWNrYm94TXVsdGlTZWxlY3QsIExpc3RSZXN1bHREVE8sXG4gICAgICAgIEJ1bGtQYXNzd29yZENoYW5nZVJlc3VsdCwgTElOS19JRF9PTkUgPSAxLCBMSU5LX0lEX1RXTyA9IDIsIExJTktfT05FLCBMSU5LX1RXTywgJGh0dHBCYWNrZW5kLCBjb25maWdVcmwsXG4gICAgICAgIFF1aWNrTGluaywgdGltZW91dFNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShpZGVudGl0eU1vZHVsZSwgdGVzdE1vZHVsZSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTYgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbnRyb2xsZXJfLCBfbWFuYWdlUGFzc3dvcmRTZXJ2aWNlXywgXyRxXywgX1F1aWNrTGlua18sIF9pZGVudGl0eVNlcnZpY2VfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3N3b3JkTGluaywgXyRyb290U2NvcGVfLCBfc3BNb2RhbF8sIF9uYXZpZ2F0aW9uU2VydmljZV8sIF90ZXN0U2VydmljZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX21hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2VfLCBfQ2hlY2tib3hNdWx0aVNlbGVjdF8sIF9MaXN0UmVzdWx0RFRPXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQnVsa1Bhc3N3b3JkQ2hhbmdlUmVzdWx0XywgXyRodHRwQmFja2VuZF8sIF8kdGltZW91dF8pIHtcblxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgICRodHRwQmFja2VuZCA9IF8kaHR0cEJhY2tlbmRfO1xuICAgICAgICBtYW5hZ2VQYXNzd29yZFNlcnZpY2UgPSBfbWFuYWdlUGFzc3dvcmRTZXJ2aWNlXztcbiAgICAgICAgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZSA9IF9tYW5hZ2VQYXNzd29yZERhdGFTZXJ2aWNlXztcbiAgICAgICAgQ2hlY2tib3hNdWx0aVNlbGVjdCA9IF9DaGVja2JveE11bHRpU2VsZWN0XztcbiAgICAgICAgTGlzdFJlc3VsdERUTyA9IF9MaXN0UmVzdWx0RFRPXztcbiAgICAgICAgQnVsa1Bhc3N3b3JkQ2hhbmdlUmVzdWx0ID0gX0J1bGtQYXNzd29yZENoYW5nZVJlc3VsdF87XG4gICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlID0gX25hdmlnYXRpb25TZXJ2aWNlXztcbiAgICAgICAgaWRlbnRpdHlTZXJ2aWNlID0gX2lkZW50aXR5U2VydmljZV87XG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuICAgICAgICBRdWlja0xpbmsgPSBfUXVpY2tMaW5rXztcbiAgICAgICAgaWRlbnRpdHlTZXJ2aWNlID0gX2lkZW50aXR5U2VydmljZV87XG4gICAgICAgIHRpbWVvdXRTZXJ2aWNlID0gXyR0aW1lb3V0XztcbiAgICAgICAgaWRlbnRpdHlJZCA9ICcxMjM0JztcbiAgICAgICAgY29uZmlnVXJsID0gJy91aS9yZXN0L2NvbmZpZ3VyYXRpb24vdWljb25maWcvZW50cmllcz9rZXk9bWFuYWdlUGFzc3dvcmRMaW5rQ29sQ29uZmlnJztcblxuICAgICAgICAvLyBDcmVhdGUgc29tZSBtb2NrIGRhdGFcbiAgICAgICAgJHN0YXRlUGFyYW1zID0ge1xuICAgICAgICAgICAgaWRlbnRpdHlJZDogaWRlbnRpdHlJZCxcbiAgICAgICAgICAgIHF1aWNrTGluazogJ01hbmFnZSUyMFBhc3N3b3JkcydcblxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdnZXRNYW5hZ2VQYXNzd29yZEFjY291bnRzJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIHt9LCB7fSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIExJTktfT05FID0ge1xuICAgICAgICAgICAgZ2V0SWQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gTElOS19JRF9PTkU7IH1cbiAgICAgICAgfTtcbiAgICAgICAgTElOS19UV08gPSB7XG4gICAgICAgICAgICBnZXRJZDogZnVuY3Rpb24oKSB7IHJldHVybiBMSU5LX0lEX1RXTzsgfVxuICAgICAgICB9O1xuICAgICAgICBsZXQgbWFwID0ge30sXG4gICAgICAgICAgICBxbERhdGEgPSB7bmFtZTogJ01hbmFnZSUyMFBhc3N3b3Jkcyd9O1xuICAgICAgICBtYXBbUXVpY2tMaW5rLkFjdGlvbnMuTUFOQUdFX1BBU1NXT1JEU10gPSBuZXcgUXVpY2tMaW5rKHFsRGF0YSk7XG4gICAgICAgIGlkZW50aXR5U2VydmljZS5nZXRBdmFpbGFibGVBY3Rpb25zTWFwID0gZnVuY3Rpb24oKSB7IHJldHVybiBtYXA7fTtcbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKCkge1xuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgbGV0IGN0cmwgPSAkY29udHJvbGxlcignTWFuYWdlUGFzc3dvcmRDdHJsJywge1xuICAgICAgICAgICAgICAgICRzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgIG1hbmFnZVBhc3N3b3JkU2VydmljZTogbWFuYWdlUGFzc3dvcmRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2U6IG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgJHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXMsXG4gICAgICAgICAgICAgICAgQ2hlY2tib3hNdWx0aVNlbGVjdDogQ2hlY2tib3hNdWx0aVNlbGVjdFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBsaXN0UmVzdWx0O1xuXG4gICAgICAgIGxpc3RSZXN1bHQgPSBuZXcgTGlzdFJlc3VsdERUTyh7XG4gICAgICAgICAgICBjb3VudDogMixcbiAgICAgICAgICAgIG9iamVjdHM6IFtMSU5LX09ORSwgTElOS19UV09dXG4gICAgICAgIH0pO1xuICAgICAgICBjdHJsLmxpbmtMaXN0UmVzdWx0RFRPID0gbGlzdFJlc3VsdDtcbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfVxuXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCd0aHJvd3MgaWYgaWRlbnRpdHkgSUQgaXMgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVsZXRlICRzdGF0ZVBhcmFtcy5pZGVudGl0eUlkO1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjcmVhdGVDb250cm9sbGVyKDApOyB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdnZXRJdGVtcygpIGNhbGxzIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpLFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMCxcbiAgICAgICAgICAgICAgICBsaW1pdCA9IDEwLFxuICAgICAgICAgICAgICAgIHNvcnRPcmRlciA9ICdmYWtlU29ydE9yZGVyJztcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VQYXNzd29yZFNlcnZpY2UuZ2V0TWFuYWdlUGFzc3dvcmRBY2NvdW50cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlLmdldE1hbmFnZVBhc3N3b3JkQWNjb3VudHMuY2FsbHMucmVzZXQoKTtcbiAgICAgICAgICAgIGN0cmwuZ2V0SXRlbXMoc3RhcnQsIGxpbWl0LCBzb3J0T3JkZXIpO1xuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZVBhc3N3b3JkU2VydmljZS5nZXRNYW5hZ2VQYXNzd29yZEFjY291bnRzKS5cbiAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChpZGVudGl0eUlkLCBzdGFydCwgbGltaXQsIHNvcnRPcmRlciwgcXVpY2tMaW5rKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbWVyZ2VDb25zdHJhaW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2V0cyBlcnJvcnMgaWYgbWVyZ2VDb25zdHJhaW50cyBmYWlscycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCB7fSk7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKSxcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdtZXJnZUNvbnN0cmFpbnRzJykuYW5kLnJldHVyblZhbHVlKGRlZmVycmVkLnByb21pc2UpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFsneW91IHN1Y2snXSk7XG5cbiAgICAgICAgICAgIGN0cmwuZ2V0TWVyZ2VkQ29uc3RyYWludHModHJ1ZSk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0RXJyb3JzKCkubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3Qgc2V0IGVycm9ycyBpZiBtZXJnZUNvbnN0cmFpbnRzIGZhaWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGNvbmZpZ1VybCkucmVzcG9uZCgyMDAsIHt9KTtcblxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCksXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnbWVyZ2VDb25zdHJhaW50cycpLmFuZC5yZXR1cm5WYWx1ZShkZWZlcnJlZC5wcm9taXNlKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChbJ3lvdSBzdWNrJ10pO1xuXG4gICAgICAgICAgICBjdHJsLmdldE1lcmdlZENvbnN0cmFpbnRzKGZhbHNlKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRFcnJvcnMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzQnVsaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHNlbGVjdGlvbiBjb3VudCBpcyBncmVhdGVyIHRoYW4gMCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAgICBjdHJsLmdldENoZWNrYm94TXVsdGlTZWxlY3QoKS5zZWxlY3RJdGVtKExJTktfT05FKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQnVsaygpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHNlbGVjdGlvbiBjb3VudCBpcyAwJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQnVsaygpKS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNsZWFyIHNlbGVjdGlvbnMgb24gc3VjY2Vzc2Z1bCBzeW5jIHN1Ym1pc3Npb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCB7fSk7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpLFxuICAgICAgICAgICAgcmVzdWx0ID0geyBuZXdQYXNzd29yZElucHV0OiBuZXcgQnVsa1Bhc3N3b3JkQ2hhbmdlUmVzdWx0KHt9KSB9O1xuICAgICAgICBjdHJsLmdldENoZWNrYm94TXVsdGlTZWxlY3QoKS5zZWxlY3RJdGVtKExJTktfT05FKTtcbiAgICAgICAgY3RybC5nZXRDaGVja2JveE11bHRpU2VsZWN0KCkuc2VsZWN0SXRlbShMSU5LX1RXTyk7XG4gICAgICAgIGV4cGVjdChjdHJsLmdldENoZWNrYm94TXVsdGlTZWxlY3QoKS5nZXRTZWxlY3Rpb25Db3VudCgpKS50b0JlKDIpO1xuICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XG4gICAgICAgICAgICByZXN1bHQ6ICRxLndoZW4ocmVzdWx0KVxuICAgICAgICB9KTtcbiAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAncHJvbXB0V29ya0l0ZW1EaWFsb2cnKTtcbiAgICAgICAgY3RybC5wcm9tcHRTeW5jaHJvbml6ZVBhc3N3b3JkcygpO1xuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoY3RybC5nZXRDaGVja2JveE11bHRpU2VsZWN0KCkuZ2V0U2VsZWN0aW9uQ291bnQoKSkudG9CZSgwKTtcbiAgICAgICAgLyogSnVzdCBhIHNhbml0eSBjaGVjaywgbWFrZSBzdXJlIHRoZSB3b3JraXRlbSBkaWFsb2cgaXNuJ3QgcG9wcGVkIHVubmVjZXNzYXJpbHkgKi9cbiAgICAgICAgZXhwZWN0KGlkZW50aXR5U2VydmljZS5wcm9tcHRXb3JrSXRlbURpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgb3BlbiB3b3JrIGl0ZW0gbW9kYWwgZnVuY3Rpb24gaWYgY2hhbmdlIHJlc3VsdCBoYXMgYSB3b3JraXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGNvbmZpZ1VybCkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCksXG4gICAgICAgICAgICByZXN1bHQgPSB7IG5ld1Bhc3N3b3JkSW5wdXQ6IG5ldyBCdWxrUGFzc3dvcmRDaGFuZ2VSZXN1bHQoe1xuICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1UeXBlOiAnRm9ybScsXG4gICAgICAgICAgICAgICAgd29ya2Zsb3dXb3JrSXRlbUlkOiAnd29ya2l0ZW1JZCdcbiAgICAgICAgICAgIH0pIH07XG4gICAgICAgIGN0cmwuZ2V0Q2hlY2tib3hNdWx0aVNlbGVjdCgpLnNlbGVjdEl0ZW0oTElOS19PTkUpO1xuICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XG4gICAgICAgICAgICByZXN1bHQ6ICRxLndoZW4ocmVzdWx0KVxuICAgICAgICB9KTtcbiAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAncHJvbXB0V29ya0l0ZW1EaWFsb2cnKTtcbiAgICAgICAgY3RybC5wcm9tcHRTeW5jaHJvbml6ZVBhc3N3b3JkcygpO1xuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoaWRlbnRpdHlTZXJ2aWNlLnByb21wdFdvcmtJdGVtRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNsZWFyIG91dCB0aGUgYnVsa1Bhc3N3b3JkUmVzdWx0IHdoZW4gZGVzdHJveWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZS5zZXRCdWxrUGFzc3dvcmRDaGFuZ2VSZXN1bHQoe2JsYWg6ICdibGFoJ30pO1xuICAgICAgICBleHBlY3QobWFuYWdlUGFzc3dvcmREYXRhU2VydmljZS5nZXRCdWxrUGFzc3dvcmRDaGFuZ2VSZXN1bHQoKSkubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICRzY29wZS4kZGVzdHJveSgpO1xuICAgICAgICBleHBlY3QobWFuYWdlUGFzc3dvcmREYXRhU2VydmljZS5nZXRCdWxrUGFzc3dvcmRDaGFuZ2VSZXN1bHQoKSkudG9CZU51bGwoKTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldExpbmtCeUlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsO1xuXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbGluayBpZiBpdCBpcyBwcmVzZW50IG9uIHRoZSBwYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgbGluayA9IGN0cmwuZ2V0TGlua0J5SWQoTElOS19JRF9UV08pO1xuICAgICAgICAgICAgZXhwZWN0KGxpbmspLnRvQmUoTElOS19UV08pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgaWYgdGhlIGxpbmsgaXMgbm90IG9uIHRoZSBwYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgbGluayA9IGN0cmwuZ2V0TGlua0J5SWQoNDIpO1xuICAgICAgICAgICAgZXhwZWN0KGxpbmspLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2VuZXJhdGVQYXNzd29yZHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGN0cmw7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgbWVyZ2VDb25zdHJhaW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnbWVyZ2VDb25zdHJhaW50cycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCdob29yYXknKSk7XG4gICAgICAgICAgICBjdHJsLnByb21wdEdlbmVyYXRlUGFzc3dvcmRzKCk7XG4gICAgICAgICAgICBleHBlY3QobWFuYWdlUGFzc3dvcmRTZXJ2aWNlLm1lcmdlQ29uc3RyYWludHMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBvcGVuIHRoZSB3b3JraXRlbSBkaWFsb2cgaWYgdGhlcmUgaXMgYSB3b3JraXRlbSBpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCB7fSk7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIGN0cmwuZ2V0Q2hlY2tib3hNdWx0aVNlbGVjdCgpLnNlbGVjdEl0ZW0oTElOS19PTkUpO1xuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUoe1xuICAgICAgICAgICAgICAgIHJlc3VsdDogJHEud2hlbihuZXcgQnVsa1Bhc3N3b3JkQ2hhbmdlUmVzdWx0KHtcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dXb3JrSXRlbVR5cGU6ICdGb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dXb3JrSXRlbUlkOiAnd29ya2l0ZW1JZCdcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAncHJvbXB0V29ya0l0ZW1EaWFsb2cnKTtcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdnZXRNZXJnZWRDb25zdHJhaW50cycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKFtdKSk7XG4gICAgICAgICAgICBjdHJsLnByb21wdEdlbmVyYXRlUGFzc3dvcmRzKCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGNvbmZpZ1VybCkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlTZXJ2aWNlLnByb21wdFdvcmtJdGVtRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Byb21wdENoYW5nZVBhc3N3b3JkTW9iaWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgb3BlbiBjaGFuZ2UgcGFzc3dvcmQgbW9kYWwgZnVuY3Rpb24gaWYgcHJvbXB0Q2hhbmdlUGFzc3dvcmRNb2JpbGUgY2xpY2tlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCB7fSk7XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiAkcS5kZWZlcigpLnByb21pc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAgICBjdHJsLnByb21wdENoYW5nZVBhc3N3b3JkTW9iaWxlKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gZXJyb3IgZGlhbG9nIHdoZW4gcXVpY2tsaW5rIGlzIG5vdCBkZWZpbmRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWRlbnRpdHlTZXJ2aWNlLmdldEF2YWlsYWJsZUFjdGlvbnNNYXAgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHt9O307XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7cmVzdWx0OiAkcS53aGVuKCl9KTtcbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ2dvQmFjaycpLmFuZC5yZXR1cm5WYWx1ZSh7fSk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKGNvbmZpZ1VybCkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIHRpbWVvdXRTZXJ2aWNlLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlTZXJ2aWNlLmdvQmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgbGV0IGNhbGxBcmdzID0gc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xuICAgICAgICAgICAgZXhwZWN0KGNhbGxBcmdzWzBdLnRpdGxlKS50b0VxdWFsKCd1aV9pZGVudGl0eV9lcnJvcl91bmFibGVfdG9fbWFuYWdlX2lkX3RpdGxlJyk7XG4gICAgICAgICAgICBleHBlY3QoY2FsbEFyZ3NbMF0ud2FybmluZ0xldmVsKS50b0VxdWFsKCdlcnJvcicpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
