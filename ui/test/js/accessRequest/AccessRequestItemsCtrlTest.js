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
             * Tests for the AccessRequestItemsCtrl.
             */
            describe('AccessRequestItemsCtrl', function () {

                var $controller, testService, accessRequestDataService, accessRequestItemsService, accessRequestFilterService, accessRequestAccountSelectionService, PageState, $rootScope, ctrl, item, item2, identity, additionalQuestions, configServiceMock, filtersDeferred, acctSelectionDeferred, modalDeferred, spModal, accessRequestDeepFilterService, location, SEARCH_TYPE_KEYWORD, SEARCH_TYPE_POPULATION, SEARCH_TYPE_IDENTITY, AccessRequestItem;

                // Load the test module to get the testService.
                beforeEach(module(testModule));

                // Let the tests know we'll use the access request module.
                beforeEach(module(accessRequestModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 20 */
                beforeEach(inject(function (_accessRequestDataService_, _accessRequestItemsService_, _AccessRequestItem_, Identity, AccessRequestAdditionalQuestions, _PageState_, _testService_, _$controller_, _$rootScope_, _accessRequestFilterService_, _accessRequestAccountSelectionService_, $q, _spModal_, _accessRequestDeepFilterService_, $location, accessRequestTestData, _SEARCH_TYPE_KEYWORD_, _SEARCH_TYPE_POPULATION_, _SEARCH_TYPE_IDENTITY_) {

                    // Save the services.
                    accessRequestDataService = _accessRequestDataService_;
                    accessRequestItemsService = _accessRequestItemsService_;
                    accessRequestFilterService = _accessRequestFilterService_;
                    accessRequestAccountSelectionService = _accessRequestAccountSelectionService_;
                    accessRequestDeepFilterService = _accessRequestDeepFilterService_;
                    $controller = _$controller_;
                    testService = _testService_;
                    PageState = _PageState_;
                    $rootScope = _$rootScope_;
                    filtersDeferred = $q.defer();
                    spModal = _spModal_;
                    spyOn(spModal, 'open').and.returnValue(true);
                    spyOn(_accessRequestFilterService_, 'getAccessItemFilters').and.returnValue(filtersDeferred.promise);
                    location = $location;
                    SEARCH_TYPE_KEYWORD = _SEARCH_TYPE_KEYWORD_;
                    SEARCH_TYPE_POPULATION = _SEARCH_TYPE_POPULATION_;
                    SEARCH_TYPE_IDENTITY = _SEARCH_TYPE_IDENTITY_;
                    AccessRequestItem = _AccessRequestItem_;
                    acctSelectionDeferred = $q.defer();

                    // Create an item and identity to test with.
                    item = new AccessRequestItem(accessRequestTestData.ROLE);
                    item2 = new AccessRequestItem(accessRequestTestData.PERMITTED_ROLE);
                    identity = new Identity(accessRequestTestData.IDENTITY1);

                    // Mock out the item service to return a single item.
                    accessRequestItemsService.getAccessRequestItems = testService.createPromiseSpy(false, {
                        status: 200,
                        data: {
                            count: 1,
                            objects: [item]
                        }
                    });

                    // Mock out getAdditionalQuestions() to return some permits.
                    additionalQuestions = new AccessRequestAdditionalQuestions({
                        permittedRoles: [accessRequestTestData.PERMITTED_ROLE]
                    });
                    spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestions));

                    // Mock out the config service
                    configServiceMock = {
                        getColumnConfigEntries: testService.createPromiseSpy(false, {
                            status: 200,
                            data: {}
                        }, {})
                    };

                    // Mock out the data service to spy on item selection changes.
                    spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity]);
                    spyOn(accessRequestDataService.getAccessRequest(), 'getIdentityIds').and.returnValue([identity.id]);
                    spyOn(accessRequestDataService.getAccessRequest(), 'addRequestedItem').and.returnValue(true);
                    spyOn(accessRequestDataService.getAccessRequest(), 'removeRequestedItem').and.returnValue(true);
                    spyOn(accessRequestDataService.getAccessRequest(), 'setPermittedRoles');
                    spyOn(_accessRequestDataService_, 'getQuickLinkName').and.returnValue('Request Access');

                    /* Mock opening the accountSelection dialog */
                    modalDeferred = $q.defer();
                    spyOn(accessRequestAccountSelectionService, 'openDialog').and.returnValue(modalDeferred.promise);
                    spyOn(accessRequestAccountSelectionService, 'editAccountSelections').and.returnValue(modalDeferred.promise);

                    ctrl = createController();

                    // Run a digest cycle to resolve the promise.
                    $rootScope.$apply();
                }));

                function createController() {
                    // Create the controller to test with.
                    return $controller('AccessRequestItemsCtrl', {
                        accessRequestItemsService: accessRequestItemsService,
                        accessRequestDataService: accessRequestDataService,
                        configService: configServiceMock
                    });
                }

                it('fetches items when loaded', function () {
                    // The start and limit are hard-coded.
                    expect(accessRequestItemsService.getAccessRequestItems).toHaveBeenCalledWith(undefined, {}, 0, 12, identity.getId(), SEARCH_TYPE_KEYWORD, 'Request Access');
                });

                it('fetches filters when loaded', function () {
                    expect(accessRequestFilterService.getAccessItemFilters).toHaveBeenCalledWith(accessRequestDataService.getAccessRequest().getRequesteeId(), SEARCH_TYPE_KEYWORD);
                });

                describe('isSearchBlocked()', function () {
                    it('returns false if search type is keyword', function () {
                        expect(ctrl.isSearchBlocked()).toEqual(false);
                    });

                    it('returns false if search type is not keyword and there are applied filters', function () {
                        spyOn(ctrl, 'hasAppliedFilters').and.returnValue(true);
                        expect(ctrl.isSearchBlocked()).toEqual(false);
                    });

                    it('returns true if search type is not keyword and no search applied filters', function () {
                        spyOn(ctrl, 'hasAppliedFilters').and.returnValue(false);
                        ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                        expect(ctrl.isSearchBlocked()).toEqual(true);
                        ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                        expect(ctrl.isSearchBlocked()).toEqual(true);
                    });

                    it('blocks search and returns empty promise', function () {
                        var data;
                        spyOn(ctrl, 'isSearchBlocked').and.returnValue(true);
                        accessRequestItemsService.getAccessRequestItems.calls.reset();
                        data = ctrl.doSearch().then(function (result) {
                            data = result.data;
                        });

                        $rootScope.$digest();
                        expect(accessRequestItemsService.getAccessRequestItems).not.toHaveBeenCalled();
                        expect(data.objects).toEqual([]);
                        expect(data.count).toEqual(0);
                    });
                });

                describe('select item', function () {
                    it('adds items', function () {
                        ctrl.selectItem(item, null);
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).toHaveBeenCalledWith(item, null);
                    });

                    it('adds permitted items', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'getOtherRequestedRoles').and.returnValue([]);
                        ctrl.selectItem(item2, item);
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).toHaveBeenCalledWith(item2, item);
                    });

                    it('loads additional questions the first time it is called', function () {
                        ctrl.selectItem(item);
                        $rootScope.$digest();
                        expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalledWith(item, [identity.id], undefined, undefined, [], 'Request Access');
                    });

                    it('should call pass permitting role and other requested roles if set', function () {
                        var fakeRequestedRole = { foo: 'bar' };
                        var fakePermittedRole = { foo: 'baz' };
                        spyOn(accessRequestDataService.getAccessRequest(), 'getOtherRequestedRoles').and.returnValue([fakeRequestedRole, fakePermittedRole]);
                        ctrl.selectItem(item, item2);
                        $rootScope.$digest();
                        expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalledWith(item, [identity.id], item2, undefined, [fakeRequestedRole, fakePermittedRole], 'Request Access');
                    });

                    it('loads additional questions the subsequent times it is called', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'getPermittedRoles').and.returnValue(additionalQuestions.permittedRoles);
                        ctrl.selectItem(item);
                        $rootScope.$digest();
                        expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalled();

                        ctrl.selectItem(item);
                        $rootScope.$digest();
                        expect(accessRequestItemsService.getAdditionalQuestions).toHaveBeenCalled();
                    });

                    it('saves permitted roles in the data service', function () {
                        ctrl.selectItem(item);
                        $rootScope.$digest();
                        expect(accessRequestDataService.getAccessRequest().setPermittedRoles).toHaveBeenCalledWith(item.getId(), additionalQuestions.permittedRoles);
                    });

                    describe('additional questions dialog', function () {
                        it('does not open the additional questions dialog if there are null account selections and ' + 'ambiguous assigned roles', function () {
                            ctrl.selectItem(item);
                            $rootScope.$digest();
                            expect(accessRequestAccountSelectionService.openDialog).not.toHaveBeenCalled();
                        });

                        it('does not open the account selection dialog if there are empty account selections', function () {
                            additionalQuestions.accountSelections = [];
                            ctrl.selectItem(item);
                            $rootScope.$digest();
                            expect(accessRequestAccountSelectionService.openDialog).not.toHaveBeenCalled();
                        });

                        it('does not open the account selection dialog if there are empty ambiguous assigned roles', function () {
                            additionalQuestions.ambiguousAssignedRoles = [];
                            ctrl.selectItem(item);
                            $rootScope.$digest();
                            expect(accessRequestAccountSelectionService.openDialog).not.toHaveBeenCalled();
                        });

                        it('opens the account selection dialog if there are account selections', function () {
                            // Add some account selections to cause the dialog to popup.
                            var acctSels = ['foobar'];
                            additionalQuestions.accountSelections = acctSels;

                            spyOn(accessRequestDataService.getAccessRequest(), 'getOtherRequestedRoles').and.returnValue([]);
                            ctrl.selectItem(item, item2);
                            $rootScope.$digest();
                            expect(accessRequestAccountSelectionService.openDialog).toHaveBeenCalledWith(item, acctSels, undefined, item2.id, undefined);
                        });

                        it('opens the account selection dialog if there are ambiguous assigned roles', function () {
                            var ambiguousAssignedRoles = [{ whatever: 'yea' }];
                            additionalQuestions.ambiguousAssignedRoles = ambiguousAssignedRoles;

                            ctrl.selectItem(item);
                            $rootScope.$digest();
                            expect(accessRequestAccountSelectionService.openDialog).toHaveBeenCalledWith(item, undefined, ambiguousAssignedRoles, undefined, undefined);
                        });

                        it('deselects the item if the dialog is canceled', function () {
                            // Add some account selections to cause the dialog to popup.
                            var acctSels = {};
                            additionalQuestions.accountSelections = acctSels;

                            ctrl.selectItem(item);
                            $rootScope.$digest();

                            // Resolving simulates getting the additional questions back
                            acctSelectionDeferred.resolve(additionalQuestions);
                            $rootScope.$digest();

                            // Rejecting simulates a canceled dialog.
                            modalDeferred.reject();
                            $rootScope.$digest();

                            expect(ctrl.isItemSelected(item)).toEqual(false);
                        });

                        it('sets selections and assignment id when dialog is completed', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'setRequestedItemAccountSelections');
                            spyOn(accessRequestDataService.getAccessRequest(), 'setAssignmentId');

                            // Add some account selections to cause the dialog to popup on selectedItem.
                            var acctSels = [{}],
                                assignedRoles = [{}],
                                assignmentId = '1244';

                            additionalQuestions.accountSelections = acctSels;
                            additionalQuestions.ambiguousAssignedRoles = assignedRoles;
                            ctrl.selectItem(item);
                            $rootScope.$digest();

                            // Resolving simulates getting the additional questions back
                            acctSelectionDeferred.resolve(additionalQuestions);
                            $rootScope.$digest();

                            // Resolving simulates a finished dialog.
                            modalDeferred.resolve({
                                accountSelections: acctSels,
                                assignmentId: assignmentId
                            });
                            $rootScope.$digest();

                            expect(accessRequestDataService.getAccessRequest().setRequestedItemAccountSelections).toHaveBeenCalledWith(item, acctSels);
                            expect(accessRequestDataService.getAccessRequest().setAssignmentId).toHaveBeenCalledWith(item, assignmentId);
                        });
                    });
                });

                it('removes item when deselected', function () {
                    ctrl.deselectItem(item);
                    expect(accessRequestDataService.getAccessRequest().removeRequestedItem).toHaveBeenCalledWith(item);
                });

                var testItemSelection = function (isSelected) {
                    var selected;
                    spyOn(accessRequestDataService.getAccessRequest(), 'hasRequestedItem').and.returnValue(isSelected);
                    selected = ctrl.isItemSelected(item);
                    expect(accessRequestDataService.getAccessRequest().hasRequestedItem).toHaveBeenCalledWith(item);
                    expect(selected).toEqual(isSelected);
                };

                it('says that an item is selected if added', function () {
                    testItemSelection(true);
                });

                it('says that an item is not selected if not added', function () {
                    testItemSelection(false);
                });

                it('returns permitted roles from the data service', function () {
                    spyOn(accessRequestDataService.getAccessRequest(), 'getPermittedRoles');
                    ctrl.getPermittedRoles(item);
                    expect(accessRequestDataService.getAccessRequest().getPermittedRoles).toHaveBeenCalledWith(item.getId());
                });

                describe('getSelectedPermittedRoleCount function', function () {
                    it('returns 0 when no permitted roles exist', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedPermittedItems').and.returnValue([]);
                        expect(ctrl.getSelectedPermittedRoleCount(item)).toEqual(0);
                        expect(accessRequestDataService.getAccessRequest().getRequestedPermittedItems).toHaveBeenCalledWith({ item: item });
                    });

                    it('returns the correct count', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedPermittedItems').and.returnValue([{}, {}, {}]);
                        expect(ctrl.getSelectedPermittedRoleCount(item)).toEqual(3);
                        expect(accessRequestDataService.getAccessRequest().getRequestedPermittedItems).toHaveBeenCalledWith({ item: item });
                    });
                });

                it('tracks which roles have expanded permits', function () {
                    expect(ctrl.isShowPermittedRoles(item)).toBeFalsy();
                    ctrl.toggleShowPermittedRoles(item);
                    expect(ctrl.isShowPermittedRoles(item)).toBeTruthy();
                    ctrl.toggleShowPermittedRoles(item);
                    expect(ctrl.isShowPermittedRoles(item)).toBeFalsy();
                    expect(ctrl.isShowPermittedRoles(item2)).toBeFalsy();
                });

                describe('editAccountSelections()', function () {
                    var item, requestedItem;

                    beforeEach(function () {
                        item = {
                            id: 321
                        };
                        requestedItem = {
                            item: item,
                            accountSelections: []
                        };
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItem').and.callFake(function (item) {
                            if (item.id === 321) {
                                return requestedItem;
                            }
                            return undefined;
                        });
                    });

                    it('should throw if no requesteditem for access item', function () {
                        expect(function () {
                            ctrl.editAccountSelections({ item: 123 });
                        }).toThrow();
                    });

                    it('should open the account selection dialog when called', function () {
                        ctrl.editAccountSelections(item);
                        expect(accessRequestAccountSelectionService.editAccountSelections).toHaveBeenCalledWith(requestedItem);
                    });

                    it('should not update the requestedItem when the dialog is rejected', function () {
                        var accountSelections = [{ 'this is': 'a test' }];
                        requestedItem.accountSelections = accountSelections;
                        ctrl.editAccountSelections(item);
                        modalDeferred.reject('some value');
                        $rootScope.$digest();
                        expect(accessRequestAccountSelectionService.editAccountSelections).toHaveBeenCalled();
                        expect(requestedItem.accountSelections).toBe(accountSelections);
                    });

                    it('should update the requestedItem when the dialog is resolved', function () {
                        var accountSelections = [{ 'this is': 'a test' }],
                            updatedAccountSelections = [{ foo: 'bar' }, { something: 'else' }];
                        requestedItem.accountSelections = accountSelections;
                        ctrl.editAccountSelections(item);
                        modalDeferred.resolve({
                            accountSelections: updatedAccountSelections
                        });
                        $rootScope.$digest();
                        expect(accessRequestAccountSelectionService.editAccountSelections).toHaveBeenCalled();
                        expect(requestedItem.accountSelections).toBe(updatedAccountSelections);
                    });
                });

                describe('select item pending or currently assigned', function () {
                    var additionalQuestionsCurrentlyAssigned, additionalQuestionsPending, additionalQuestionsRandomStatus, additionalQuestionsInvalidRequestees, additionalQuestionsBulkAssignedOrPending;

                    // Setup the dependencies.
                    beforeEach(inject(function (AccessRequestAdditionalQuestions) {
                        additionalQuestionsCurrentlyAssigned = new AccessRequestAdditionalQuestions({
                            status: AccessRequestAdditionalQuestions.STATUS_CURRENTLY_ASSIGNED
                        });
                        additionalQuestionsPending = new AccessRequestAdditionalQuestions({
                            status: AccessRequestAdditionalQuestions.STATUS_PENDING_REQUEST
                        });
                        additionalQuestionsRandomStatus = new AccessRequestAdditionalQuestions({
                            status: 'Mandelbaum!'
                        });
                        additionalQuestionsInvalidRequestees = new AccessRequestAdditionalQuestions({
                            status: AccessRequestAdditionalQuestions.STATUS_INVALID_REQUESTEES,
                            invalidRequestees: ['someguy']
                        });
                        additionalQuestionsBulkAssignedOrPending = new AccessRequestAdditionalQuestions({
                            status: AccessRequestAdditionalQuestions.STATUS_BULK_ASSIGNED_OR_PENDING,
                            invalidRequestees: ['someguy']
                        });
                        /* Remove the spy */
                        accessRequestItemsService.getAdditionalQuestions = {};
                    }));

                    it('should select the item when an item has no status', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestions));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).toHaveBeenCalledWith(item, null);
                    });

                    it('should select the item when an item has random status', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsRandomStatus));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).toHaveBeenCalledWith(item, null);
                    });

                    it('should not select the item when an item is currently assigned', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsCurrentlyAssigned));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).not.toHaveBeenCalled();
                    });

                    it('should not select the item when an item is pending', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsPending));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(accessRequestDataService.getAccessRequest().addRequestedItem).not.toHaveBeenCalled();
                    });

                    it('should open the modal when an item is currently assigned', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsCurrentlyAssigned));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should open the modal when an item is pending', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsPending));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should open a modal when has invalid requestees', function () {
                        var recentArg;
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsInvalidRequestees));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(spModal.open).toHaveBeenCalled();
                        recentArg = spModal.open.calls.mostRecent().args[0];
                        /* Exercise some of the args*/
                        expect(recentArg.id).toEqual('invalidRequesteesDialog');
                        expect(recentArg.warningLevel).toEqual('warning');
                        expect(recentArg.resolve.messageKey()).toEqual('ui_access_request_invalid_requestees_header');
                        expect(recentArg.resolve.invalidRequestees()).toEqual(additionalQuestionsInvalidRequestees.invalidRequestees);
                        expect(recentArg.resolve.renderLimit()).toEqual(5);
                    });

                    it('should open a modal when has bulk assigned or pending', function () {
                        var recentArg;
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestionsBulkAssignedOrPending));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(spModal.open).toHaveBeenCalled();
                        recentArg = spModal.open.calls.mostRecent().args[0];
                        /* Exercise some of the args*/
                        expect(recentArg.id).toEqual('invalidRequesteesDialog');
                        expect(recentArg.warningLevel).toEqual('warning');
                        expect(recentArg.resolve.messageKey()).toEqual('ui_access_request_bulk_assigned_header');
                        expect(recentArg.resolve.invalidRequestees()).toEqual(additionalQuestionsInvalidRequestees.invalidRequestees);
                        expect(recentArg.resolve.renderLimit()).toEqual(5);
                    });

                    it('should not open the modal when an item has no status', function () {
                        spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.returnValue(testService.createPromise(false, additionalQuestions));
                        ctrl.selectItem(item, null);
                        $rootScope.$digest();
                        expect(spModal.open).not.toHaveBeenCalled();
                    });
                });

                describe('deep filter service', function () {
                    var identityData, identity, navigationService, spNotificationService;

                    beforeEach(inject(function (Identity, accessRequestTestData, $q, _navigationService_, _spNotificationService_) {
                        navigationService = _navigationService_;
                        spNotificationService = _spNotificationService_;
                        identityData = accessRequestTestData.IDENTITY1;
                        identity = new Identity(identityData);
                        accessRequestDeepFilterService.getTargetIdentity = jasmine.createSpy('getTargetIdentity').and.callFake(function () {
                            return $q.when(identity);
                        });
                        spyOn(location, 'path').and.returnValue('/accessRequestSelf/add');
                        spyOn(navigationService, 'go');
                        spyOn(spNotificationService, 'addNotification');
                    }));

                    it('should call getTargetIdentity when deepLinkManageAccess is true', function () {
                        accessRequestDeepFilterService.deepLinkManageAccess = true;

                        // Create the controller so the init gets fired.
                        createController();
                        expect(accessRequestDeepFilterService.getTargetIdentity).toHaveBeenCalled();
                    });

                    it('should not call getTargetIdentity when deepLinkManageAccess is false', function () {
                        accessRequestDeepFilterService.deepLinkManageAccess = false;

                        // Create the controller so the init gets fired.
                        createController();
                        expect(accessRequestDeepFilterService.getTargetIdentity).not.toHaveBeenCalled();
                    });

                    it('should not call getTargetIdentity when deepLinkReview is true', function () {
                        accessRequestDeepFilterService.deepLinkReview = false;

                        // Create the controller so the init gets fired.
                        createController();
                        expect(accessRequestDeepFilterService.getTargetIdentity).not.toHaveBeenCalled();
                    });

                    it('should set error and go back to home if target identity is null', function () {
                        identity = null;
                        accessRequestDeepFilterService.deepLinkManageAccess = true;
                        createController();
                        $rootScope.$apply();
                        expect(spNotificationService.addNotification).toHaveBeenCalled();
                        expect(navigationService.go).toHaveBeenCalled();
                        var args = navigationService.go.calls.mostRecent().args;
                        expect(args[0].state).toEqual('home');
                    });

                    describe('deep link init', function () {
                        var filterData = {
                            filterKey: 'filter values'
                        };

                        function setupDeepLinkController(searchType, isAllowed) {
                            var newCtrl;
                            accessRequestDeepFilterService.deepLinkManageAccess = true;
                            accessRequestDeepFilterService.requestAccessSearchType = searchType;

                            spyOn(accessRequestFilterService, 'getAccessFilterValues').and.returnValue(filtersDeferred.promise);
                            spyOn(accessRequestDataService, 'setSearchType').and.callThrough();

                            accessRequestDeepFilterService.getItemSearchData = testService.createPromiseSpy(false, {
                                searchTerm: 'some search term',
                                filterValues: filterData
                            });

                            // Create the controller to test with.
                            newCtrl = createController();

                            spyOn(newCtrl, 'isSearchTypeAllowed').and.callFake(function () {
                                return isAllowed;
                            });

                            $rootScope.$apply();
                            return newCtrl;
                        }

                        it('should set AccessRequestDataService search type to AccessRequestDeepFilterService search type', function () {
                            ctrl = setupDeepLinkController(SEARCH_TYPE_POPULATION, true);
                            expect(accessRequestDataService.setSearchType).toHaveBeenCalledWith(SEARCH_TYPE_POPULATION);
                            expect(accessRequestDataService.getSearchType()).toEqual(SEARCH_TYPE_POPULATION);
                        });

                        it('should not change search type if not allowed', function () {
                            ctrl = setupDeepLinkController(SEARCH_TYPE_POPULATION, false);
                            expect(accessRequestDataService.setSearchType).not.toHaveBeenCalled();
                            expect(accessRequestDataService.getSearchType()).toEqual(SEARCH_TYPE_KEYWORD);
                        });

                        it('should merge searchData', function () {
                            ctrl = setupDeepLinkController(SEARCH_TYPE_KEYWORD, true);
                            expect(ctrl.getPageState().searchData.searchTerm).toEqual('some search term');
                            expect(ctrl.getPageState().searchData.filterValues).toEqual(filterData);
                        });
                    });
                });

                describe('showItemDetails()', function () {
                    it('should throw when no item is passed', function () {
                        expect(function () {
                            ctrl.showItemDetails();
                        }).toThrow();
                    });

                    it('should open a modal dialog', function () {
                        ctrl.showItemDetails(item);
                        $rootScope.$digest();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('search type', function () {
                    it('defaults to keyword', function () {
                        expect(ctrl.getSearchType()).toEqual(SEARCH_TYPE_KEYWORD);
                    });

                    it('getSearchType() returns current search type', function () {
                        spyOn(accessRequestDataService, 'getSearchType');
                        expect(accessRequestDataService.getSearchType).not.toHaveBeenCalled();
                        ctrl.getSearchType();
                        expect(accessRequestDataService.getSearchType).toHaveBeenCalled();
                    });

                    describe('changeSearchType()', function () {
                        var filterData1 = {
                            filter1: 'Who\'s that dapper swindler',
                            filter2: 'out of Tammany hall?',
                            filter3: 'it\'s The Sneak!'
                        },
                            filterData2 = {
                            filter7: 'Who put a bengal tiger in the Kaiser\'s latrine??',
                            filter8: 'it\'s The Sneak!'
                        };

                        it('does nothing if the search type does not change', function () {
                            // Check that the type is the same and that filters haven't been loaded.
                            spyOn(ctrl, 'doLoadFilters');
                            expect(ctrl.doLoadFilters).not.toHaveBeenCalled();
                            ctrl.changeSearchType(SEARCH_TYPE_KEYWORD);

                            expect(ctrl.doLoadFilters).not.toHaveBeenCalled();
                            expect(accessRequestDataService.getSearchType()).toEqual(SEARCH_TYPE_KEYWORD);
                        });

                        it('changes the search type', function () {
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            expect(ctrl.getSearchType()).toEqual(SEARCH_TYPE_POPULATION);
                        });

                        it('hides filters when going to Keyword search type', function () {
                            ctrl.filtersDisplayed = true;
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            expect(ctrl.filtersDisplayed).toEqual(false);
                        });

                        function setupSearchData(filterData, filterGroups) {
                            angular.extend(ctrl.getPageState().searchData.filterValues, filterData);
                            angular.extend(ctrl.searchScratchPad.filterValues, filterData);
                            ctrl.getPageState().searchData.filterGroups = filterGroups;
                        }

                        function assertSearchData(expectedValues, expectedFilterGroups) {
                            expect(ctrl.getPageState().searchData.filterValues).toEqual(expectedValues);
                            expect(ctrl.searchScratchPad.filterValues).toEqual(expectedValues);
                            expect(ctrl.getPageState().searchData.filterGroups).toEqual(expectedFilterGroups);
                        }

                        it('creates blank search data when switching to a new type', function () {
                            // Fill in some search data.
                            setupSearchData(filterData1);

                            // Switch types.
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);

                            // Check that the filter values are blank for the scratch pad and search data.
                            assertSearchData({});
                        });

                        it('restores the previous search data when switching types', function () {
                            // Use searchData1 for keyword, switch to population search and use searchData2.
                            setupSearchData(filterData1);
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            setupSearchData(filterData2);

                            // Go back to keyword search and make sure we're using searchData1.
                            ctrl.changeSearchType(SEARCH_TYPE_KEYWORD);
                            assertSearchData(filterData1);
                        });

                        it('does not restore the search scratch pad when switching types', function () {
                            var scratchPadData = {
                                filter1: 'who\'s that jaunty jackanapes',
                                filter2: 'with moxie and pizzazz?'
                            };

                            // Setup searchData1 with different values in the scratch pad.
                            setupSearchData(filterData1);
                            ctrl.searchScratchPad.filterValues = scratchPadData;

                            // Switching to another type and switching back should not remember the scratch pad.
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            ctrl.changeSearchType(SEARCH_TYPE_KEYWORD);
                            assertSearchData(filterData1);
                        });

                        it('loads filters when switching types', function () {
                            // Make the get filters call return something new.
                            var newFilters = ['not', 'really', 'filters', 'but', 'that', 'is', 'alright'],
                                expectedFilterGroups = [['not', 'really', 'filters', 'but'], ['that', 'is', 'alright']];
                            filtersDeferred.resolve(newFilters);

                            // Spy on doLoadFilters to ensure it gets called when switch.
                            spyOn(ctrl, 'doLoadFilters').and.callThrough();
                            expect(ctrl.doLoadFilters).not.toHaveBeenCalled();

                            // Fire!!!!
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            $rootScope.$apply();

                            // Make sure new filters have been loaded and that filters have changed.
                            expect(ctrl.getPageState().searchData.filterGroups).toEqual(expectedFilterGroups);
                            expect(ctrl.doLoadFilters).toHaveBeenCalled();
                        });

                        it('does not reload filters when switching back to a previous type', function () {
                            var keywordFilters = ['keyword'],
                                returnedFilters = ['population'];

                            // Set the keyword filters and make the filter service return population filters
                            // when switching types.
                            ctrl.getPageState().searchData.filterGroups = [keywordFilters];
                            filtersDeferred.resolve(returnedFilters);

                            // Spy on loading so that we can see how many times it is called.
                            spyOn(ctrl, 'doLoadFilters').and.callThrough();
                            expect(ctrl.doLoadFilters).not.toHaveBeenCalled();

                            // Switch types - ensure it is called once.
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            $rootScope.$apply();
                            expect(ctrl.doLoadFilters).toHaveBeenCalled();
                            expect(ctrl.getPageState().searchData.filterGroups).toEqual([returnedFilters]);

                            // Switch back - it should use the cached values and not have loaded again.
                            ctrl.doLoadFilters.calls.reset();
                            ctrl.changeSearchType(SEARCH_TYPE_KEYWORD);
                            expect(ctrl.doLoadFilters).not.toHaveBeenCalled();
                            expect(ctrl.getPageState().searchData.filterGroups).toEqual([keywordFilters]);
                        });
                    });

                    describe('isKeywordSearchType()', function () {
                        it('returns true if keyword search type', function () {
                            expect(ctrl.isKeywordSearchType()).toEqual(true);
                        });
                        it('return false if not keyword search type', function () {
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            expect(ctrl.isKeywordSearchType()).toEqual(false);
                            ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                            expect(ctrl.isKeywordSearchType()).toEqual(false);
                        });
                    });

                    describe('isPopulationSearchType()', function () {
                        it('returns true if population search type', function () {
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            expect(ctrl.isPopulationSearchType()).toEqual(true);
                        });
                        it('return false if not population search type', function () {
                            expect(ctrl.isPopulationSearchType()).toEqual(false);
                            ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                            expect(ctrl.isPopulationSearchType()).toEqual(false);
                        });
                    });

                    describe('isIdentitySearchType()', function () {
                        it('returns true if identity search type', function () {
                            ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                            expect(ctrl.isIdentitySearchType()).toEqual(true);
                        });
                        it('return false if not identity search type', function () {
                            expect(ctrl.isIdentitySearchType()).toEqual(false);
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            expect(ctrl.isIdentitySearchType()).toEqual(false);
                        });
                    });

                    it('disables hiding filters on search if identity or population search type', function () {
                        expect(ctrl.isHideFiltersOnSearch()).toEqual(true);
                        ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                        expect(ctrl.isHideFiltersOnSearch()).toEqual(false);
                        ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                        expect(ctrl.isHideFiltersOnSearch()).toEqual(false);
                    });

                    describe('getFilterGroups', function () {
                        it('returns undefined if isForKeywordSearchType is true and search type is not keyword', function () {
                            ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                            expect(ctrl.getFilterGroups(true)).toEqual(undefined);
                        });

                        it('returns filters if isForKeywordSearchType is true and search type is keyword', function () {
                            expect(ctrl.getFilterGroups(true)).toEqual(ctrl.filterGroups);
                        });

                        it('returns undefined if isForKeywordSearchType is false and search type is keyword', function () {
                            expect(ctrl.getFilterGroups(false)).toEqual(undefined);
                        });

                        it('returns undefined if isForKeywordSearchType is true and search type is not keyword', function () {
                            ctrl.changeSearchType(SEARCH_TYPE_IDENTITY);
                            expect(ctrl.getFilterGroups(false)).toEqual(ctrl.filterGroups);
                            ctrl.changeSearchType(SEARCH_TYPE_POPULATION);
                            expect(ctrl.getFilterGroups(false)).toEqual(ctrl.filterGroups);
                        });
                    });
                });

                describe('isPopulationSearchAllowed()', function () {
                    it('returns the correct config value', function () {
                        configServiceMock.getConfigValue = jasmine.createSpy().and.returnValue(true);
                        expect(ctrl.isPopulationSearchAllowed()).toEqual(true);
                        expect(configServiceMock.getConfigValue).toHaveBeenCalled();
                    });

                    it('returns false if no value is configured', function () {
                        configServiceMock.getConfigValue = jasmine.createSpy().and.returnValue(null);
                        expect(ctrl.isPopulationSearchAllowed()).toEqual(false);
                        expect(configServiceMock.getConfigValue).toHaveBeenCalled();
                    });
                });

                describe('isIdentitySearchAllowed()', function () {
                    it('returns the correct config value', function () {
                        configServiceMock.getConfigValue = jasmine.createSpy().and.returnValue(true);
                        expect(ctrl.isIdentitySearchAllowed()).toEqual(true);
                        expect(configServiceMock.getConfigValue).toHaveBeenCalled();
                    });

                    it('returns false if no value is configured', function () {
                        configServiceMock.getConfigValue = jasmine.createSpy().and.returnValue(null);
                        expect(ctrl.isIdentitySearchAllowed()).toEqual(false);
                        expect(configServiceMock.getConfigValue).toHaveBeenCalled();
                    });
                });

                describe('isSearchTypeAllowed', function () {
                    it('returns true if keyword search type', function () {
                        expect(ctrl.isSearchTypeAllowed(SEARCH_TYPE_KEYWORD)).toEqual(true);
                    });

                    it('returns false if identity search type is not allowed', function () {
                        spyOn(ctrl, 'isIdentitySearchAllowed').and.returnValue(false);
                        expect(ctrl.isSearchTypeAllowed(SEARCH_TYPE_IDENTITY)).toEqual(false);
                    });

                    it('returns true if identity search type is allowed', function () {
                        spyOn(ctrl, 'isIdentitySearchAllowed').and.returnValue(true);
                        expect(ctrl.isSearchTypeAllowed(SEARCH_TYPE_IDENTITY)).toEqual(true);
                    });

                    it('returns false if population search type is not allowed', function () {
                        spyOn(ctrl, 'isPopulationSearchAllowed').and.returnValue(false);
                        expect(ctrl.isSearchTypeAllowed(SEARCH_TYPE_POPULATION)).toEqual(false);
                    });

                    it('returns true if population search type is allowed', function () {
                        spyOn(ctrl, 'isPopulationSearchAllowed').and.returnValue(true);
                        expect(ctrl.isSearchTypeAllowed(SEARCH_TYPE_POPULATION)).toEqual(true);
                    });
                });

                describe('item population statistics', function () {
                    var itemWithStatstics;
                    beforeEach(inject(function (accessRequestTestData) {
                        itemWithStatstics = new AccessRequestItem(accessRequestTestData.IDENTITY_SEARCH_ROLE);
                    }));

                    describe('isPopulationPercentageHigh', function () {
                        it('returns true if population percentage is high', function () {
                            itemWithStatstics.populationStatistics.count = 18;
                            expect(ctrl.isPopulationPercentageHigh(itemWithStatstics)).toEqual(true);
                        });

                        it('returns false if population percentage is not high', function () {
                            // cutoff for High is 80 percent, test 75
                            itemWithStatstics.populationStatistics.count = 15;
                            expect(ctrl.isPopulationPercentageHigh(itemWithStatstics)).toEqual(false);
                        });
                    });

                    describe('isPopulationPercentageMedium', function () {
                        it('returns true if population percentage is medium', function () {
                            itemWithStatstics.populationStatistics.count = 10;
                            expect(ctrl.isPopulationPercentageMedium(itemWithStatstics)).toEqual(true);
                        });

                        it('returns false if population percentage is too high', function () {
                            // cutoff for Medium is 79 percent, test 80
                            itemWithStatstics.populationStatistics.count = 16;
                            expect(ctrl.isPopulationPercentageMedium(itemWithStatstics)).toEqual(false);
                        });

                        it('returns false if population percentage is too low', function () {
                            // cutoff for Medium is 30 percent, test 25
                            itemWithStatstics.populationStatistics.count = 5;
                            expect(ctrl.isPopulationPercentageMedium(itemWithStatstics)).toEqual(false);
                        });
                    });

                    describe('isPopulationPercentageLow', function () {
                        it('returns true if population percentage is low', function () {
                            itemWithStatstics.populationStatistics.count = 5;
                            expect(ctrl.isPopulationPercentageLow(itemWithStatstics)).toEqual(true);
                        });

                        it('returns false if population percentage is too high', function () {
                            // cutoff for Low is 29 percent, test 30
                            itemWithStatstics.populationStatistics.count = 6;
                            expect(ctrl.isPopulationPercentageLow(itemWithStatstics)).toEqual(false);
                        });
                    });

                    describe('showMatchedPopulationDialog()', function () {
                        it('should throw when no item is passed', function () {
                            expect(function () {
                                ctrl.showMatchedPopulationDialog();
                            }).toThrow();
                        });

                        it('should open a modal dialog', function () {
                            ctrl.showMatchedPopulationDialog(item);
                            $rootScope.$digest();
                            expect(spModal.open).toHaveBeenCalled();
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdEl0ZW1zQ3RybFRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyxzQkFBc0IsNEJBQTRCLFVBQVUsU0FBUztJQUF0Sjs7SUFHSSxJQUFJLHFCQUFxQjtJQUN6QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjtXQUNoQyxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7Ozs7O1lBQTdCLFNBQVMsMEJBQTBCLFlBQVc7O2dCQUUxQyxJQUFJLGFBQWEsYUFDYiwwQkFBMEIsMkJBQTJCLDRCQUNyRCxzQ0FBc0MsV0FBVyxZQUFZLE1BQU0sTUFBTSxPQUFPLFVBQVUscUJBQzFGLG1CQUFtQixpQkFBaUIsdUJBQXVCLGVBQWUsU0FDMUUsZ0NBQWdDLFVBQVUscUJBQXFCLHdCQUF3QixzQkFDdkY7OztnQkFJSixXQUFXLE9BQU87OztnQkFHbEIsV0FBVyxPQUFPOzs7Ozs7Z0JBTWxCLFdBQVcsT0FBTyxVQUFTLDRCQUE0Qiw2QkFDNUIscUJBQXFCLFVBQVUsa0NBQy9CLGFBQWEsZUFBZSxlQUFlLGNBQzNDLDhCQUE4Qix3Q0FBd0MsSUFDdEUsV0FBVyxrQ0FBa0MsV0FBVyx1QkFDeEQsdUJBQXVCLDBCQUEwQix3QkFBd0I7OztvQkFHaEcsMkJBQTJCO29CQUMzQiw0QkFBNEI7b0JBQzVCLDZCQUE2QjtvQkFDN0IsdUNBQXVDO29CQUN2QyxpQ0FBaUM7b0JBQ2pDLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxZQUFZO29CQUNaLGFBQWE7b0JBQ2Isa0JBQWtCLEdBQUc7b0JBQ3JCLFVBQVU7b0JBQ1YsTUFBTSxTQUFTLFFBQVEsSUFBSSxZQUFZO29CQUN2QyxNQUFNLDhCQUE4Qix3QkFBd0IsSUFBSSxZQUFZLGdC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Ozs7R0EvQ2xDIiwiZmlsZSI6ImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdEl0ZW1zQ3RybFRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGFjY2Vzc1JlcXVlc3RNb2R1bGUgZnJvbSAnYWNjZXNzUmVxdWVzdC9BY2Nlc3NSZXF1ZXN0TW9kdWxlJztcclxuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcclxuaW1wb3J0ICcuL0FjY2Vzc1JlcXVlc3RUZXN0RGF0YSc7XHJcblxyXG4vKipcclxuICogVGVzdHMgZm9yIHRoZSBBY2Nlc3NSZXF1ZXN0SXRlbXNDdHJsLlxyXG4gKi9cclxuZGVzY3JpYmUoJ0FjY2Vzc1JlcXVlc3RJdGVtc0N0cmwnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgJGNvbnRyb2xsZXIsIHRlc3RTZXJ2aWNlLFxyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UsXHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLCBQYWdlU3RhdGUsICRyb290U2NvcGUsIGN0cmwsIGl0ZW0sIGl0ZW0yLCBpZGVudGl0eSwgYWRkaXRpb25hbFF1ZXN0aW9ucyxcclxuICAgICAgICBjb25maWdTZXJ2aWNlTW9jaywgZmlsdGVyc0RlZmVycmVkLCBhY2N0U2VsZWN0aW9uRGVmZXJyZWQsIG1vZGFsRGVmZXJyZWQsIHNwTW9kYWwsXHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLCBsb2NhdGlvbiwgU0VBUkNIX1RZUEVfS0VZV09SRCwgU0VBUkNIX1RZUEVfUE9QVUxBVElPTiwgU0VBUkNIX1RZUEVfSURFTlRJVFksXHJcbiAgICAgICAgQWNjZXNzUmVxdWVzdEl0ZW07XHJcblxyXG5cclxuICAgIC8vIExvYWQgdGhlIHRlc3QgbW9kdWxlIHRvIGdldCB0aGUgdGVzdFNlcnZpY2UuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlKSk7XHJcblxyXG4gICAgLy8gTGV0IHRoZSB0ZXN0cyBrbm93IHdlJ2xsIHVzZSB0aGUgYWNjZXNzIHJlcXVlc3QgbW9kdWxlLlxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoYWNjZXNzUmVxdWVzdE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5qZWN0IHRoZSBkZXBlbmRlbmNpZXMgYW5kIHNldHVwIG1vY2tzLlxyXG4gICAgICovXHJcbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAyMCAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX2FjY2Vzc1JlcXVlc3REYXRhU2VydmljZV8sIF9hY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlXyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9BY2Nlc3NSZXF1ZXN0SXRlbV8sIElkZW50aXR5LCBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9QYWdlU3RhdGVfLCBfdGVzdFNlcnZpY2VfLCBfJGNvbnRyb2xsZXJfLCBfJHJvb3RTY29wZV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2VfLCBfYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlXywgJHEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3BNb2RhbF8sIF9hY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2VfLCAkbG9jYXRpb24sIGFjY2Vzc1JlcXVlc3RUZXN0RGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9TRUFSQ0hfVFlQRV9LRVlXT1JEXywgX1NFQVJDSF9UWVBFX1BPUFVMQVRJT05fLCBfU0VBUkNIX1RZUEVfSURFTlRJVFlfKSB7XHJcblxyXG4gICAgICAgIC8vIFNhdmUgdGhlIHNlcnZpY2VzLlxyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2VfO1xyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UgPSBfYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZV87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UgPSBfYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2VfO1xyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RBY2NvdW50U2VsZWN0aW9uU2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2VfO1xyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2VfO1xyXG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcclxuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XHJcbiAgICAgICAgUGFnZVN0YXRlID0gX1BhZ2VTdGF0ZV87XHJcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuICAgICAgICBmaWx0ZXJzRGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcbiAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgc3B5T24oX2FjY2Vzc1JlcXVlc3RGaWx0ZXJTZXJ2aWNlXywgJ2dldEFjY2Vzc0l0ZW1GaWx0ZXJzJykuYW5kLnJldHVyblZhbHVlKGZpbHRlcnNEZWZlcnJlZC5wcm9taXNlKTtcclxuICAgICAgICBsb2NhdGlvbiA9ICRsb2NhdGlvbjtcclxuICAgICAgICBTRUFSQ0hfVFlQRV9LRVlXT1JEID0gX1NFQVJDSF9UWVBFX0tFWVdPUkRfO1xyXG4gICAgICAgIFNFQVJDSF9UWVBFX1BPUFVMQVRJT04gPSBfU0VBUkNIX1RZUEVfUE9QVUxBVElPTl87XHJcbiAgICAgICAgU0VBUkNIX1RZUEVfSURFTlRJVFkgPSBfU0VBUkNIX1RZUEVfSURFTlRJVFlfO1xyXG4gICAgICAgIEFjY2Vzc1JlcXVlc3RJdGVtID0gX0FjY2Vzc1JlcXVlc3RJdGVtXztcclxuICAgICAgICBhY2N0U2VsZWN0aW9uRGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYW4gaXRlbSBhbmQgaWRlbnRpdHkgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIGl0ZW0gPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEUpO1xyXG4gICAgICAgIGl0ZW0yID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5QRVJNSVRURURfUk9MRSk7XHJcbiAgICAgICAgaWRlbnRpdHkgPSBuZXcgSWRlbnRpdHkoYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZMSk7XHJcblxyXG4gICAgICAgIC8vIE1vY2sgb3V0IHRoZSBpdGVtIHNlcnZpY2UgdG8gcmV0dXJuIGEgc2luZ2xlIGl0ZW0uXHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0SXRlbXMgPVxyXG4gICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBbIGl0ZW0gXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTW9jayBvdXQgZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucygpIHRvIHJldHVybiBzb21lIHBlcm1pdHMuXHJcbiAgICAgICAgYWRkaXRpb25hbFF1ZXN0aW9ucyA9IG5ldyBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyh7XHJcbiAgICAgICAgICAgIHBlcm1pdHRlZFJvbGVzOiBbIGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5QRVJNSVRURURfUk9MRSBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgJ2dldEFkZGl0aW9uYWxRdWVzdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIGFkZGl0aW9uYWxRdWVzdGlvbnMpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gTW9jayBvdXQgdGhlIGNvbmZpZyBzZXJ2aWNlXHJcbiAgICAgICAgY29uZmlnU2VydmljZU1vY2sgPSB7XHJcbiAgICAgICAgICAgIGdldENvbHVtbkNvbmZpZ0VudHJpZXM6IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge31cclxuICAgICAgICAgICAgfSwge30pXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTW9jayBvdXQgdGhlIGRhdGEgc2VydmljZSB0byBzcHkgb24gaXRlbSBzZWxlY3Rpb24gY2hhbmdlcy5cclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0SWRlbnRpdGllcycpLmFuZC5yZXR1cm5WYWx1ZShbIGlkZW50aXR5IF0pO1xyXG4gICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRJZGVudGl0eUlkcycpLmFuZC5yZXR1cm5WYWx1ZShbaWRlbnRpdHkuaWRdKTtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnYWRkUmVxdWVzdGVkSXRlbScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAncmVtb3ZlUmVxdWVzdGVkSXRlbScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnc2V0UGVybWl0dGVkUm9sZXMnKTtcclxuICAgICAgICBzcHlPbihfYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlXywgJ2dldFF1aWNrTGlua05hbWUnKS5hbmQucmV0dXJuVmFsdWUoJ1JlcXVlc3QgQWNjZXNzJyk7XHJcblxyXG4gICAgICAgIC8qIE1vY2sgb3BlbmluZyB0aGUgYWNjb3VudFNlbGVjdGlvbiBkaWFsb2cgKi9cclxuICAgICAgICBtb2RhbERlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2UsICdvcGVuRGlhbG9nJykuYW5kLnJldHVyblZhbHVlKG1vZGFsRGVmZXJyZWQucHJvbWlzZSk7XHJcbiAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLCAnZWRpdEFjY291bnRTZWxlY3Rpb25zJykuYW5kLnJldHVyblZhbHVlKG1vZGFsRGVmZXJyZWQucHJvbWlzZSk7XHJcblxyXG4gICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcblxyXG4gICAgICAgIC8vIFJ1biBhIGRpZ2VzdCBjeWNsZSB0byByZXNvbHZlIHRoZSBwcm9taXNlLlxyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcigpIHtcclxuICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignQWNjZXNzUmVxdWVzdEl0ZW1zQ3RybCcsIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZTogYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSxcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlOiBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2U6IGNvbmZpZ1NlcnZpY2VNb2NrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXQoJ2ZldGNoZXMgaXRlbXMgd2hlbiBsb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBUaGUgc3RhcnQgYW5kIGxpbWl0IGFyZSBoYXJkLWNvZGVkLlxyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3RJdGVtcykuXHJcbiAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKHVuZGVmaW5lZCwge30sIDAsIDEyLCBpZGVudGl0eS5nZXRJZCgpLCBTRUFSQ0hfVFlQRV9LRVlXT1JELCAnUmVxdWVzdCBBY2Nlc3MnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdmZXRjaGVzIGZpbHRlcnMgd2hlbiBsb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UuZ2V0QWNjZXNzSXRlbUZpbHRlcnMpLlxyXG4gICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmdldFJlcXVlc3RlZUlkKCksIFNFQVJDSF9UWVBFX0tFWVdPUkQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzU2VhcmNoQmxvY2tlZCgpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgc2VhcmNoIHR5cGUgaXMga2V5d29yZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1NlYXJjaEJsb2NrZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHNlYXJjaCB0eXBlIGlzIG5vdCBrZXl3b3JkIGFuZCB0aGVyZSBhcmUgYXBwbGllZCBmaWx0ZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdoYXNBcHBsaWVkRmlsdGVycycpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWFyY2hCbG9ja2VkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHNlYXJjaCB0eXBlIGlzIG5vdCBrZXl3b3JkIGFuZCBubyBzZWFyY2ggYXBwbGllZCBmaWx0ZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdoYXNBcHBsaWVkRmlsdGVycycpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWFyY2hCbG9ja2VkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9JREVOVElUWSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU2VhcmNoQmxvY2tlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCAoJ2Jsb2NrcyBzZWFyY2ggYW5kIHJldHVybnMgZW1wdHkgcHJvbWlzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2lzU2VhcmNoQmxvY2tlZCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0SXRlbXMuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgZGF0YSA9IGN0cmwuZG9TZWFyY2goKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHJlc3VsdC5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0SXRlbXMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkYXRhLm9iamVjdHMpLnRvRXF1YWwoW10pO1xyXG4gICAgICAgICAgICBleHBlY3QoZGF0YS5jb3VudCkudG9FcXVhbCgwKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzZWxlY3QgaXRlbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdhZGRzIGl0ZW1zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtLCBudWxsKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkUmVxdWVzdGVkSXRlbSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSwgbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdhZGRzIHBlcm1pdHRlZCBpdGVtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0T3RoZXJSZXF1ZXN0ZWRSb2xlcycpLmFuZC5yZXR1cm5WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtMiwgaXRlbSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZFJlcXVlc3RlZEl0ZW0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0yLCBpdGVtKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2xvYWRzIGFkZGl0aW9uYWwgcXVlc3Rpb25zIHRoZSBmaXJzdCB0aW1lIGl0IGlzIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBZGRpdGlvbmFsUXVlc3Rpb25zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtLCBbaWRlbnRpdHkuaWRdLFxyXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFtdLCAnUmVxdWVzdCBBY2Nlc3MnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHBhc3MgcGVybWl0dGluZyByb2xlIGFuZCBvdGhlciByZXF1ZXN0ZWQgcm9sZXMgaWYgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBmYWtlUmVxdWVzdGVkUm9sZSA9IHtmb286ICdiYXInfTtcclxuICAgICAgICAgICAgdmFyIGZha2VQZXJtaXR0ZWRSb2xlID0ge2ZvbzogJ2Jheid9O1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0T3RoZXJSZXF1ZXN0ZWRSb2xlcycpLlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShbZmFrZVJlcXVlc3RlZFJvbGUsIGZha2VQZXJtaXR0ZWRSb2xlXSk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtLCBpdGVtMik7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBZGRpdGlvbmFsUXVlc3Rpb25zKS5cclxuICAgICAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtLCBbaWRlbnRpdHkuaWRdLCBpdGVtMiwgdW5kZWZpbmVkLCBbZmFrZVJlcXVlc3RlZFJvbGUsIGZha2VQZXJtaXR0ZWRSb2xlXSxcclxuICAgICAgICAgICAgICAgICAgICAnUmVxdWVzdCBBY2Nlc3MnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2xvYWRzIGFkZGl0aW9uYWwgcXVlc3Rpb25zIHRoZSBzdWJzZXF1ZW50IHRpbWVzIGl0IGlzIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UGVybWl0dGVkUm9sZXMnKS5cclxuICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShhZGRpdGlvbmFsUXVlc3Rpb25zLnBlcm1pdHRlZFJvbGVzKTtcclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UuZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UuZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2F2ZXMgcGVybWl0dGVkIHJvbGVzIGluIHRoZSBkYXRhIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuc2V0UGVybWl0dGVkUm9sZXMpLlxyXG4gICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbS5nZXRJZCgpLCBhZGRpdGlvbmFsUXVlc3Rpb25zLnBlcm1pdHRlZFJvbGVzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ2FkZGl0aW9uYWwgcXVlc3Rpb25zIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3Qgb3BlbiB0aGUgYWRkaXRpb25hbCBxdWVzdGlvbnMgZGlhbG9nIGlmIHRoZXJlIGFyZSBudWxsIGFjY291bnQgc2VsZWN0aW9ucyBhbmQgJyArXHJcbiAgICAgICAgICAgICAgICAnYW1iaWd1b3VzIGFzc2lnbmVkIHJvbGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2Uub3BlbkRpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3Qgb3BlbiB0aGUgYWNjb3VudCBzZWxlY3Rpb24gZGlhbG9nIGlmIHRoZXJlIGFyZSBlbXB0eSBhY2NvdW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnMuYWNjb3VudFNlbGVjdGlvbnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RBY2NvdW50U2VsZWN0aW9uU2VydmljZS5vcGVuRGlhbG9nKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdCBvcGVuIHRoZSBhY2NvdW50IHNlbGVjdGlvbiBkaWFsb2cgaWYgdGhlcmUgYXJlIGVtcHR5IGFtYmlndW91cyBhc3NpZ25lZCByb2xlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFF1ZXN0aW9ucy5hbWJpZ3VvdXNBc3NpZ25lZFJvbGVzID0gW107XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2Uub3BlbkRpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnb3BlbnMgdGhlIGFjY291bnQgc2VsZWN0aW9uIGRpYWxvZyBpZiB0aGVyZSBhcmUgYWNjb3VudCBzZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgc29tZSBhY2NvdW50IHNlbGVjdGlvbnMgdG8gY2F1c2UgdGhlIGRpYWxvZyB0byBwb3B1cC5cclxuICAgICAgICAgICAgICAgIHZhciBhY2N0U2VscyA9IFsgJ2Zvb2JhcicgXTtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnMuYWNjb3VudFNlbGVjdGlvbnMgPSBhY2N0U2VscztcclxuXHJcbiAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0T3RoZXJSZXF1ZXN0ZWRSb2xlcycpLmFuZC5yZXR1cm5WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSwgaXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLm9wZW5EaWFsb2cpLlxyXG4gICAgICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0sIGFjY3RTZWxzLCB1bmRlZmluZWQsIGl0ZW0yLmlkLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdvcGVucyB0aGUgYWNjb3VudCBzZWxlY3Rpb24gZGlhbG9nIGlmIHRoZXJlIGFyZSBhbWJpZ3VvdXMgYXNzaWduZWQgcm9sZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhbWJpZ3VvdXNBc3NpZ25lZFJvbGVzID0gWyB7IHdoYXRldmVyOiAneWVhJ30gXTtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnMuYW1iaWd1b3VzQXNzaWduZWRSb2xlcyA9IGFtYmlndW91c0Fzc2lnbmVkUm9sZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLm9wZW5EaWFsb2cpLlxyXG4gICAgICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0sIHVuZGVmaW5lZCwgYW1iaWd1b3VzQXNzaWduZWRSb2xlcywgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdkZXNlbGVjdHMgdGhlIGl0ZW0gaWYgdGhlIGRpYWxvZyBpcyBjYW5jZWxlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQWRkIHNvbWUgYWNjb3VudCBzZWxlY3Rpb25zIHRvIGNhdXNlIHRoZSBkaWFsb2cgdG8gcG9wdXAuXHJcbiAgICAgICAgICAgICAgICB2YXIgYWNjdFNlbHMgPSB7fTtcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnMuYWNjb3VudFNlbGVjdGlvbnMgPSBhY2N0U2VscztcclxuXHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZpbmcgc2ltdWxhdGVzIGdldHRpbmcgdGhlIGFkZGl0aW9uYWwgcXVlc3Rpb25zIGJhY2tcclxuICAgICAgICAgICAgICAgIGFjY3RTZWxlY3Rpb25EZWZlcnJlZC5yZXNvbHZlKGFkZGl0aW9uYWxRdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVqZWN0aW5nIHNpbXVsYXRlcyBhIGNhbmNlbGVkIGRpYWxvZy5cclxuICAgICAgICAgICAgICAgIG1vZGFsRGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc0l0ZW1TZWxlY3RlZChpdGVtKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3NldHMgc2VsZWN0aW9ucyBhbmQgYXNzaWdubWVudCBpZCB3aGVuIGRpYWxvZyBpcyBjb21wbGV0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdzZXRSZXF1ZXN0ZWRJdGVtQWNjb3VudFNlbGVjdGlvbnMnKTtcclxuICAgICAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdzZXRBc3NpZ25tZW50SWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgc29tZSBhY2NvdW50IHNlbGVjdGlvbnMgdG8gY2F1c2UgdGhlIGRpYWxvZyB0byBwb3B1cCBvbiBzZWxlY3RlZEl0ZW0uXHJcbiAgICAgICAgICAgICAgICB2YXIgYWNjdFNlbHMgPSBbe31dLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbmVkUm9sZXMgPSBbe31dLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRJZCA9ICcxMjQ0JztcclxuXHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zLmFjY291bnRTZWxlY3Rpb25zID0gYWNjdFNlbHM7XHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zLmFtYmlndW91c0Fzc2lnbmVkUm9sZXMgPSBhc3NpZ25lZFJvbGVzO1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVzb2x2aW5nIHNpbXVsYXRlcyBnZXR0aW5nIHRoZSBhZGRpdGlvbmFsIHF1ZXN0aW9ucyBiYWNrXHJcbiAgICAgICAgICAgICAgICBhY2N0U2VsZWN0aW9uRGVmZXJyZWQucmVzb2x2ZShhZGRpdGlvbmFsUXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlc29sdmluZyBzaW11bGF0ZXMgYSBmaW5pc2hlZCBkaWFsb2cuXHJcbiAgICAgICAgICAgICAgICBtb2RhbERlZmVycmVkLnJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb25zOiBhY2N0U2VscyxcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50SWQ6IGFzc2lnbm1lbnRJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5zZXRSZXF1ZXN0ZWRJdGVtQWNjb3VudFNlbGVjdGlvbnMpLlxyXG4gICAgICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0sIGFjY3RTZWxzKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLnNldEFzc2lnbm1lbnRJZCkuXHJcbiAgICAgICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSwgYXNzaWdubWVudElkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmVtb3ZlcyBpdGVtIHdoZW4gZGVzZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGN0cmwuZGVzZWxlY3RJdGVtKGl0ZW0pO1xyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLnJlbW92ZVJlcXVlc3RlZEl0ZW0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHRlc3RJdGVtU2VsZWN0aW9uID0gZnVuY3Rpb24oaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHZhciBzZWxlY3RlZDtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnaGFzUmVxdWVzdGVkSXRlbScpLmFuZC5yZXR1cm5WYWx1ZShpc1NlbGVjdGVkKTtcclxuICAgICAgICBzZWxlY3RlZCA9IGN0cmwuaXNJdGVtU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuaGFzUmVxdWVzdGVkSXRlbSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSk7XHJcbiAgICAgICAgZXhwZWN0KHNlbGVjdGVkKS50b0VxdWFsKGlzU2VsZWN0ZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpdCgnc2F5cyB0aGF0IGFuIGl0ZW0gaXMgc2VsZWN0ZWQgaWYgYWRkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0ZXN0SXRlbVNlbGVjdGlvbih0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzYXlzIHRoYXQgYW4gaXRlbSBpcyBub3Qgc2VsZWN0ZWQgaWYgbm90IGFkZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGVzdEl0ZW1TZWxlY3Rpb24oZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgcGVybWl0dGVkIHJvbGVzIGZyb20gdGhlIGRhdGEgc2VydmljZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRQZXJtaXR0ZWRSb2xlcycpO1xyXG4gICAgICAgIGN0cmwuZ2V0UGVybWl0dGVkUm9sZXMoaXRlbSk7XHJcbiAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuZ2V0UGVybWl0dGVkUm9sZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0uZ2V0SWQoKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0U2VsZWN0ZWRQZXJtaXR0ZWRSb2xlQ291bnQgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyAwIHdoZW4gbm8gcGVybWl0dGVkIHJvbGVzIGV4aXN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRQZXJtaXR0ZWRJdGVtcycpLmFuZC5yZXR1cm5WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldFNlbGVjdGVkUGVybWl0dGVkUm9sZUNvdW50KGl0ZW0pKS50b0VxdWFsKDApO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5nZXRSZXF1ZXN0ZWRQZXJtaXR0ZWRJdGVtcykuXHJcbiAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aCh7aXRlbTogaXRlbX0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0aGUgY29ycmVjdCBjb3VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UmVxdWVzdGVkUGVybWl0dGVkSXRlbXMnKS5cclxuICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShbe30se30se31dKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0U2VsZWN0ZWRQZXJtaXR0ZWRSb2xlQ291bnQoaXRlbSkpLnRvRXF1YWwoMyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmdldFJlcXVlc3RlZFBlcm1pdHRlZEl0ZW1zKS5cclxuICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtpdGVtOiBpdGVtfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndHJhY2tzIHdoaWNoIHJvbGVzIGhhdmUgZXhwYW5kZWQgcGVybWl0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjdHJsLmlzU2hvd1Blcm1pdHRlZFJvbGVzKGl0ZW0pKS50b0JlRmFsc3koKTtcclxuICAgICAgICBjdHJsLnRvZ2dsZVNob3dQZXJtaXR0ZWRSb2xlcyhpdGVtKTtcclxuICAgICAgICBleHBlY3QoY3RybC5pc1Nob3dQZXJtaXR0ZWRSb2xlcyhpdGVtKSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIGN0cmwudG9nZ2xlU2hvd1Blcm1pdHRlZFJvbGVzKGl0ZW0pO1xyXG4gICAgICAgIGV4cGVjdChjdHJsLmlzU2hvd1Blcm1pdHRlZFJvbGVzKGl0ZW0pKS50b0JlRmFsc3koKTtcclxuICAgICAgICBleHBlY3QoY3RybC5pc1Nob3dQZXJtaXR0ZWRSb2xlcyhpdGVtMikpLnRvQmVGYWxzeSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2VkaXRBY2NvdW50U2VsZWN0aW9ucygpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0sIHJlcXVlc3RlZEl0ZW07XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogMzIxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtOiBpdGVtLFxyXG4gICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmKGl0ZW0uaWQgPT09IDMyMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0ZWRJdGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgbm8gcmVxdWVzdGVkaXRlbSBmb3IgYWNjZXNzIGl0ZW0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5lZGl0QWNjb3VudFNlbGVjdGlvbnMoe2l0ZW06IDEyM30pO1xyXG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiB0aGUgYWNjb3VudCBzZWxlY3Rpb24gZGlhbG9nIHdoZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwuZWRpdEFjY291bnRTZWxlY3Rpb25zKGl0ZW0pO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLmVkaXRBY2NvdW50U2VsZWN0aW9ucykudG9IYXZlQmVlbkNhbGxlZFdpdGgocmVxdWVzdGVkSXRlbSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IHVwZGF0ZSB0aGUgcmVxdWVzdGVkSXRlbSB3aGVuIHRoZSBkaWFsb2cgaXMgcmVqZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFjY291bnRTZWxlY3Rpb25zID0gW3sndGhpcyBpcyc6ICdhIHRlc3QnfV07XHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0uYWNjb3VudFNlbGVjdGlvbnMgPSBhY2NvdW50U2VsZWN0aW9ucztcclxuICAgICAgICAgICAgY3RybC5lZGl0QWNjb3VudFNlbGVjdGlvbnMoaXRlbSk7XHJcbiAgICAgICAgICAgIG1vZGFsRGVmZXJyZWQucmVqZWN0KCdzb21lIHZhbHVlJyk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEFjY291bnRTZWxlY3Rpb25TZXJ2aWNlLmVkaXRBY2NvdW50U2VsZWN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5hY2NvdW50U2VsZWN0aW9ucykudG9CZShhY2NvdW50U2VsZWN0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgdXBkYXRlIHRoZSByZXF1ZXN0ZWRJdGVtIHdoZW4gdGhlIGRpYWxvZyBpcyByZXNvbHZlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgYWNjb3VudFNlbGVjdGlvbnMgPSBbeyd0aGlzIGlzJzogJ2EgdGVzdCd9XSxcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWRBY2NvdW50U2VsZWN0aW9ucyA9IFt7Zm9vOiAnYmFyJ30sIHtzb21ldGhpbmc6ICdlbHNlJ31dO1xyXG4gICAgICAgICAgICByZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zID0gYWNjb3VudFNlbGVjdGlvbnM7XHJcbiAgICAgICAgICAgIGN0cmwuZWRpdEFjY291bnRTZWxlY3Rpb25zKGl0ZW0pO1xyXG4gICAgICAgICAgICBtb2RhbERlZmVycmVkLnJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnM6IHVwZGF0ZWRBY2NvdW50U2VsZWN0aW9uc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0QWNjb3VudFNlbGVjdGlvblNlcnZpY2UuZWRpdEFjY291bnRTZWxlY3Rpb25zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zKS50b0JlKHVwZGF0ZWRBY2NvdW50U2VsZWN0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2VsZWN0IGl0ZW0gcGVuZGluZyBvciBjdXJyZW50bHkgYXNzaWduZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYWRkaXRpb25hbFF1ZXN0aW9uc0N1cnJlbnRseUFzc2lnbmVkLFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zUGVuZGluZyxcclxuICAgICAgICAgICAgYWRkaXRpb25hbFF1ZXN0aW9uc1JhbmRvbVN0YXR1cyxcclxuICAgICAgICAgICAgYWRkaXRpb25hbFF1ZXN0aW9uc0ludmFsaWRSZXF1ZXN0ZWVzLFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zQnVsa0Fzc2lnbmVkT3JQZW5kaW5nO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCB0aGUgZGVwZW5kZW5jaWVzLlxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zKSB7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnNDdXJyZW50bHlBc3NpZ25lZCA9IG5ldyBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyh7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zLlNUQVRVU19DVVJSRU5UTFlfQVNTSUdORURcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnNQZW5kaW5nID0gbmV3IEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zKHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogQWNjZXNzUmVxdWVzdEFkZGl0aW9uYWxRdWVzdGlvbnMuU1RBVFVTX1BFTkRJTkdfUkVRVUVTVFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYWRkaXRpb25hbFF1ZXN0aW9uc1JhbmRvbVN0YXR1cyA9IG5ldyBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyh7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdNYW5kZWxiYXVtISdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnNJbnZhbGlkUmVxdWVzdGVlcyA9IG5ldyBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyh7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zLlNUQVRVU19JTlZBTElEX1JFUVVFU1RFRVMsXHJcbiAgICAgICAgICAgICAgICBpbnZhbGlkUmVxdWVzdGVlczogWydzb21lZ3V5J11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxRdWVzdGlvbnNCdWxrQXNzaWduZWRPclBlbmRpbmcgPSBuZXcgQWNjZXNzUmVxdWVzdEFkZGl0aW9uYWxRdWVzdGlvbnMoe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucy5TVEFUVVNfQlVMS19BU1NJR05FRF9PUl9QRU5ESU5HLFxyXG4gICAgICAgICAgICAgICAgaW52YWxpZFJlcXVlc3RlZXM6IFsnc29tZWd1eSddXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvKiBSZW1vdmUgdGhlIHNweSAqL1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFkZGl0aW9uYWxRdWVzdGlvbnMgPSB7fTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgc2VsZWN0IHRoZSBpdGVtIHdoZW4gYW4gaXRlbSBoYXMgbm8gc3RhdHVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UsICdnZXRBZGRpdGlvbmFsUXVlc3Rpb25zJykuYW5kLnJldHVyblZhbHVlKFxyXG4gICAgICAgICAgICAgICAgdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZShmYWxzZSwgYWRkaXRpb25hbFF1ZXN0aW9ucylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0sIG51bGwpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkUmVxdWVzdGVkSXRlbSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSwgbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHNlbGVjdCB0aGUgaXRlbSB3aGVuIGFuIGl0ZW0gaGFzIHJhbmRvbSBzdGF0dXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgJ2dldEFkZGl0aW9uYWxRdWVzdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBhZGRpdGlvbmFsUXVlc3Rpb25zUmFuZG9tU3RhdHVzKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSwgbnVsbCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3Qgc2VsZWN0IHRoZSBpdGVtIHdoZW4gYW4gaXRlbSBpcyBjdXJyZW50bHkgYXNzaWduZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgJ2dldEFkZGl0aW9uYWxRdWVzdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBhZGRpdGlvbmFsUXVlc3Rpb25zQ3VycmVudGx5QXNzaWduZWQpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtLCBudWxsKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZFJlcXVlc3RlZEl0ZW0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IHNlbGVjdCB0aGUgaXRlbSB3aGVuIGFuIGl0ZW0gaXMgcGVuZGluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCAnZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIGFkZGl0aW9uYWxRdWVzdGlvbnNQZW5kaW5nKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSwgbnVsbCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRSZXF1ZXN0ZWRJdGVtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gdGhlIG1vZGFsIHdoZW4gYW4gaXRlbSBpcyBjdXJyZW50bHkgYXNzaWduZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgJ2dldEFkZGl0aW9uYWxRdWVzdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBhZGRpdGlvbmFsUXVlc3Rpb25zQ3VycmVudGx5QXNzaWduZWQpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtLCBudWxsKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBvcGVuIHRoZSBtb2RhbCB3aGVuIGFuIGl0ZW0gaXMgcGVuZGluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCAnZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIGFkZGl0aW9uYWxRdWVzdGlvbnNQZW5kaW5nKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSwgbnVsbCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiBhIG1vZGFsIHdoZW4gaGFzIGludmFsaWQgcmVxdWVzdGVlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVjZW50QXJnO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCAnZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIGFkZGl0aW9uYWxRdWVzdGlvbnNJbnZhbGlkUmVxdWVzdGVlcylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJdGVtKGl0ZW0sIG51bGwpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICByZWNlbnRBcmcgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XHJcbiAgICAgICAgICAgIC8qIEV4ZXJjaXNlIHNvbWUgb2YgdGhlIGFyZ3MqL1xyXG4gICAgICAgICAgICBleHBlY3QocmVjZW50QXJnLmlkKS50b0VxdWFsKCdpbnZhbGlkUmVxdWVzdGVlc0RpYWxvZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVjZW50QXJnLndhcm5pbmdMZXZlbCkudG9FcXVhbCgnd2FybmluZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVjZW50QXJnLnJlc29sdmUubWVzc2FnZUtleSgpKS50b0VxdWFsKCd1aV9hY2Nlc3NfcmVxdWVzdF9pbnZhbGlkX3JlcXVlc3RlZXNfaGVhZGVyJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZWNlbnRBcmcucmVzb2x2ZS5pbnZhbGlkUmVxdWVzdGVlcygpKS50b0VxdWFsKFxyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFF1ZXN0aW9uc0ludmFsaWRSZXF1ZXN0ZWVzLmludmFsaWRSZXF1ZXN0ZWVzKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlY2VudEFyZy5yZXNvbHZlLnJlbmRlckxpbWl0KCkpLnRvRXF1YWwoNSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiBhIG1vZGFsIHdoZW4gaGFzIGJ1bGsgYXNzaWduZWQgb3IgcGVuZGluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVjZW50QXJnO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCAnZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UsIGFkZGl0aW9uYWxRdWVzdGlvbnNCdWxrQXNzaWduZWRPclBlbmRpbmcpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SXRlbShpdGVtLCBudWxsKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgcmVjZW50QXJnID0gc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdO1xyXG4gICAgICAgICAgICAvKiBFeGVyY2lzZSBzb21lIG9mIHRoZSBhcmdzKi9cclxuICAgICAgICAgICAgZXhwZWN0KHJlY2VudEFyZy5pZCkudG9FcXVhbCgnaW52YWxpZFJlcXVlc3RlZXNEaWFsb2cnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlY2VudEFyZy53YXJuaW5nTGV2ZWwpLnRvRXF1YWwoJ3dhcm5pbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlY2VudEFyZy5yZXNvbHZlLm1lc3NhZ2VLZXkoKSkudG9FcXVhbCgndWlfYWNjZXNzX3JlcXVlc3RfYnVsa19hc3NpZ25lZF9oZWFkZXInKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlY2VudEFyZy5yZXNvbHZlLmludmFsaWRSZXF1ZXN0ZWVzKCkpLnRvRXF1YWwoXHJcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUXVlc3Rpb25zSW52YWxpZFJlcXVlc3RlZXMuaW52YWxpZFJlcXVlc3RlZXMpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVjZW50QXJnLnJlc29sdmUucmVuZGVyTGltaXQoKSkudG9FcXVhbCg1KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3Qgb3BlbiB0aGUgbW9kYWwgd2hlbiBhbiBpdGVtIGhhcyBubyBzdGF0dXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZSwgJ2dldEFkZGl0aW9uYWxRdWVzdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBhZGRpdGlvbmFsUXVlc3Rpb25zKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdEl0ZW0oaXRlbSwgbnVsbCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdkZWVwIGZpbHRlciBzZXJ2aWNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGlkZW50aXR5RGF0YSwgaWRlbnRpdHksIG5hdmlnYXRpb25TZXJ2aWNlLCBzcE5vdGlmaWNhdGlvblNlcnZpY2U7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKElkZW50aXR5LCBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEsICRxLCBfbmF2aWdhdGlvblNlcnZpY2VfLCBfc3BOb3RpZmljYXRpb25TZXJ2aWNlXykge1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSA9IF9uYXZpZ2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgICAgIHNwTm90aWZpY2F0aW9uU2VydmljZSA9IF9zcE5vdGlmaWNhdGlvblNlcnZpY2VfO1xyXG4gICAgICAgICAgICBpZGVudGl0eURhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFkxO1xyXG4gICAgICAgICAgICBpZGVudGl0eSA9IG5ldyBJZGVudGl0eShpZGVudGl0eURhdGEpO1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UuZ2V0VGFyZ2V0SWRlbnRpdHkgPVxyXG4gICAgICAgICAgICAgICAgamFzbWluZS5jcmVhdGVTcHkoJ2dldFRhcmdldElkZW50aXR5JykuYW5kLmNhbGxGYWtlKCgpID0+ICRxLndoZW4oaWRlbnRpdHkpKTtcclxuICAgICAgICAgICAgc3B5T24obG9jYXRpb24sICdwYXRoJykuYW5kLnJldHVyblZhbHVlKCcvYWNjZXNzUmVxdWVzdFNlbGYvYWRkJyk7XHJcbiAgICAgICAgICAgIHNweU9uKG5hdmlnYXRpb25TZXJ2aWNlLCAnZ28nKTtcclxuICAgICAgICAgICAgc3B5T24oc3BOb3RpZmljYXRpb25TZXJ2aWNlLCAnYWRkTm90aWZpY2F0aW9uJyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgZ2V0VGFyZ2V0SWRlbnRpdHkgd2hlbiBkZWVwTGlua01hbmFnZUFjY2VzcyBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5kZWVwTGlua01hbmFnZUFjY2VzcyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXIgc28gdGhlIGluaXQgZ2V0cyBmaXJlZC5cclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLmdldFRhcmdldElkZW50aXR5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgZ2V0VGFyZ2V0SWRlbnRpdHkgd2hlbiBkZWVwTGlua01hbmFnZUFjY2VzcyBpcyBmYWxzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UuZGVlcExpbmtNYW5hZ2VBY2Nlc3MgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29udHJvbGxlciBzbyB0aGUgaW5pdCBnZXRzIGZpcmVkLlxyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UuZ2V0VGFyZ2V0SWRlbnRpdHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgZ2V0VGFyZ2V0SWRlbnRpdHkgd2hlbiBkZWVwTGlua1JldmlldyBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5kZWVwTGlua1JldmlldyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb250cm9sbGVyIHNvIHRoZSBpbml0IGdldHMgZmlyZWQuXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5nZXRUYXJnZXRJZGVudGl0eSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBzZXQgZXJyb3IgYW5kIGdvIGJhY2sgdG8gaG9tZSBpZiB0YXJnZXQgaWRlbnRpdHkgaXMgbnVsbCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2UuZGVlcExpbmtNYW5hZ2VBY2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE5vdGlmaWNhdGlvblNlcnZpY2UuYWRkTm90aWZpY2F0aW9uKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5nbykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBsZXQgYXJncyA9IG5hdmlnYXRpb25TZXJ2aWNlLmdvLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJnc1swXS5zdGF0ZSkudG9FcXVhbCgnaG9tZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSAoJ2RlZXAgbGluayBpbml0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyS2V5IDogJ2ZpbHRlciB2YWx1ZXMnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXR1cERlZXBMaW5rQ29udHJvbGxlcihzZWFyY2hUeXBlLCBpc0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdDdHJsO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERlZXBGaWx0ZXJTZXJ2aWNlLmRlZXBMaW5rTWFuYWdlQWNjZXNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5yZXF1ZXN0QWNjZXNzU2VhcmNoVHlwZSA9IHNlYXJjaFR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UsICdnZXRBY2Nlc3NGaWx0ZXJWYWx1ZXMnKS5hbmQucmV0dXJuVmFsdWUoZmlsdGVyc0RlZmVycmVkLnByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLCAnc2V0U2VhcmNoVHlwZScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3REZWVwRmlsdGVyU2VydmljZS5nZXRJdGVtU2VhcmNoRGF0YSA9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZVNweShmYWxzZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoVGVybTogJ3NvbWUgc2VhcmNoIHRlcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsdWVzOiBmaWx0ZXJEYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29udHJvbGxlciB0byB0ZXN0IHdpdGguXHJcbiAgICAgICAgICAgICAgICBuZXdDdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNweU9uKG5ld0N0cmwsICdpc1NlYXJjaFR5cGVBbGxvd2VkJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc0FsbG93ZWQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0N0cmw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgc2V0IEFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSBzZWFyY2ggdHlwZSB0byBBY2Nlc3NSZXF1ZXN0RGVlcEZpbHRlclNlcnZpY2Ugc2VhcmNoIHR5cGUnLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybCA9IHNldHVwRGVlcExpbmtDb250cm9sbGVyKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2Uuc2V0U2VhcmNoVHlwZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoU0VBUkNIX1RZUEVfUE9QVUxBVElPTik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRTZWFyY2hUeXBlKCkpLnRvRXF1YWwoU0VBUkNIX1RZUEVfUE9QVUxBVElPTik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgbm90IGNoYW5nZSBzZWFyY2ggdHlwZSBpZiBub3QgYWxsb3dlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybCA9IHNldHVwRGVlcExpbmtDb250cm9sbGVyKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2Uuc2V0U2VhcmNoVHlwZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0U2VhcmNoVHlwZSgpKS50b0VxdWFsKFNFQVJDSF9UWVBFX0tFWVdPUkQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgbWVyZ2Ugc2VhcmNoRGF0YScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybCA9IHNldHVwRGVlcExpbmtDb250cm9sbGVyKFNFQVJDSF9UWVBFX0tFWVdPUkQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0UGFnZVN0YXRlKCkuc2VhcmNoRGF0YS5zZWFyY2hUZXJtKS50b0VxdWFsKCdzb21lIHNlYXJjaCB0ZXJtJyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5nZXRQYWdlU3RhdGUoKS5zZWFyY2hEYXRhLmZpbHRlclZhbHVlcykudG9FcXVhbChmaWx0ZXJEYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd0l0ZW1EZXRhaWxzKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdoZW4gbm8gaXRlbSBpcyBwYXNzZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zaG93SXRlbURldGFpbHMoKTtcclxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gYSBtb2RhbCBkaWFsb2cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5zaG93SXRlbURldGFpbHMoaXRlbSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnZGVmYXVsdHMgdG8ga2V5d29yZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRTZWFyY2hUeXBlKCkpLnRvRXF1YWwoU0VBUkNIX1RZUEVfS0VZV09SRCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdnZXRTZWFyY2hUeXBlKCkgcmV0dXJucyBjdXJyZW50IHNlYXJjaCB0eXBlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgJ2dldFNlYXJjaFR5cGUnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRTZWFyY2hUeXBlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjdHJsLmdldFNlYXJjaFR5cGUoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRTZWFyY2hUeXBlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdjaGFuZ2VTZWFyY2hUeXBlKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlckRhdGExID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjE6ICdXaG9cXCdzIHRoYXQgZGFwcGVyIHN3aW5kbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIyOiAnb3V0IG9mIFRhbW1hbnkgaGFsbD8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjM6ICdpdFxcJ3MgVGhlIFNuZWFrISdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJEYXRhMiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI3OiAnV2hvIHB1dCBhIGJlbmdhbCB0aWdlciBpbiB0aGUgS2Fpc2VyXFwncyBsYXRyaW5lPz8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjg6ICdpdFxcJ3MgVGhlIFNuZWFrISdcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZSBzZWFyY2ggdHlwZSBkb2VzIG5vdCBjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHR5cGUgaXMgdGhlIHNhbWUgYW5kIHRoYXQgZmlsdGVycyBoYXZlbid0IGJlZW4gbG9hZGVkLlxyXG4gICAgICAgICAgICAgICAgc3B5T24oY3RybCwgJ2RvTG9hZEZpbHRlcnMnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmRvTG9hZEZpbHRlcnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmNoYW5nZVNlYXJjaFR5cGUoU0VBUkNIX1RZUEVfS0VZV09SRCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZG9Mb2FkRmlsdGVycykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0U2VhcmNoVHlwZSgpKS50b0VxdWFsKFNFQVJDSF9UWVBFX0tFWVdPUkQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdjaGFuZ2VzIHRoZSBzZWFyY2ggdHlwZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0U2VhcmNoVHlwZSgpKS50b0VxdWFsKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdoaWRlcyBmaWx0ZXJzIHdoZW4gZ29pbmcgdG8gS2V5d29yZCBzZWFyY2ggdHlwZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5maWx0ZXJzRGlzcGxheWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmZpbHRlcnNEaXNwbGF5ZWQpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldHVwU2VhcmNoRGF0YShmaWx0ZXJEYXRhLCBmaWx0ZXJHcm91cHMpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKGN0cmwuZ2V0UGFnZVN0YXRlKCkuc2VhcmNoRGF0YS5maWx0ZXJWYWx1ZXMsIGZpbHRlckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoY3RybC5zZWFyY2hTY3JhdGNoUGFkLmZpbHRlclZhbHVlcywgZmlsdGVyRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmdldFBhZ2VTdGF0ZSgpLnNlYXJjaERhdGEuZmlsdGVyR3JvdXBzID0gZmlsdGVyR3JvdXBzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhc3NlcnRTZWFyY2hEYXRhKGV4cGVjdGVkVmFsdWVzLCBleHBlY3RlZEZpbHRlckdyb3Vwcykge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0UGFnZVN0YXRlKCkuc2VhcmNoRGF0YS5maWx0ZXJWYWx1ZXMpLnRvRXF1YWwoZXhwZWN0ZWRWYWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2VhcmNoU2NyYXRjaFBhZC5maWx0ZXJWYWx1ZXMpLnRvRXF1YWwoZXhwZWN0ZWRWYWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0UGFnZVN0YXRlKCkuc2VhcmNoRGF0YS5maWx0ZXJHcm91cHMpLnRvRXF1YWwoZXhwZWN0ZWRGaWx0ZXJHcm91cHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgnY3JlYXRlcyBibGFuayBzZWFyY2ggZGF0YSB3aGVuIHN3aXRjaGluZyB0byBhIG5ldyB0eXBlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGaWxsIGluIHNvbWUgc2VhcmNoIGRhdGEuXHJcbiAgICAgICAgICAgICAgICBzZXR1cFNlYXJjaERhdGEoZmlsdGVyRGF0YTEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCB0eXBlcy5cclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBmaWx0ZXIgdmFsdWVzIGFyZSBibGFuayBmb3IgdGhlIHNjcmF0Y2ggcGFkIGFuZCBzZWFyY2ggZGF0YS5cclxuICAgICAgICAgICAgICAgIGFzc2VydFNlYXJjaERhdGEoe30pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZXN0b3JlcyB0aGUgcHJldmlvdXMgc2VhcmNoIGRhdGEgd2hlbiBzd2l0Y2hpbmcgdHlwZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSBzZWFyY2hEYXRhMSBmb3Iga2V5d29yZCwgc3dpdGNoIHRvIHBvcHVsYXRpb24gc2VhcmNoIGFuZCB1c2Ugc2VhcmNoRGF0YTIuXHJcbiAgICAgICAgICAgICAgICBzZXR1cFNlYXJjaERhdGEoZmlsdGVyRGF0YTEpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICAgICAgc2V0dXBTZWFyY2hEYXRhKGZpbHRlckRhdGEyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBHbyBiYWNrIHRvIGtleXdvcmQgc2VhcmNoIGFuZCBtYWtlIHN1cmUgd2UncmUgdXNpbmcgc2VhcmNoRGF0YTEuXHJcbiAgICAgICAgICAgICAgICBjdHJsLmNoYW5nZVNlYXJjaFR5cGUoU0VBUkNIX1RZUEVfS0VZV09SRCk7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnRTZWFyY2hEYXRhKGZpbHRlckRhdGExKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgcmVzdG9yZSB0aGUgc2VhcmNoIHNjcmF0Y2ggcGFkIHdoZW4gc3dpdGNoaW5nIHR5cGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2NyYXRjaFBhZERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyMTogJ3dob1xcJ3MgdGhhdCBqYXVudHkgamFja2FuYXBlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyMjogJ3dpdGggbW94aWUgYW5kIHBpenpheno/J1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCBzZWFyY2hEYXRhMSB3aXRoIGRpZmZlcmVudCB2YWx1ZXMgaW4gdGhlIHNjcmF0Y2ggcGFkLlxyXG4gICAgICAgICAgICAgICAgc2V0dXBTZWFyY2hEYXRhKGZpbHRlckRhdGExKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2VhcmNoU2NyYXRjaFBhZC5maWx0ZXJWYWx1ZXMgPSBzY3JhdGNoUGFkRGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2hpbmcgdG8gYW5vdGhlciB0eXBlIGFuZCBzd2l0Y2hpbmcgYmFjayBzaG91bGQgbm90IHJlbWVtYmVyIHRoZSBzY3JhdGNoIHBhZC5cclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9LRVlXT1JEKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydFNlYXJjaERhdGEoZmlsdGVyRGF0YTEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdsb2FkcyBmaWx0ZXJzIHdoZW4gc3dpdGNoaW5nIHR5cGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHRoZSBnZXQgZmlsdGVycyBjYWxsIHJldHVybiBzb21ldGhpbmcgbmV3LlxyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0ZpbHRlcnMgPSBbICdub3QnLCAncmVhbGx5JywgJ2ZpbHRlcnMnLCAnYnV0JywgJ3RoYXQnLCAnaXMnLCAnYWxyaWdodCcgXSxcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZEZpbHRlckdyb3VwcyA9IFtbJ25vdCcsICdyZWFsbHknLCAnZmlsdGVycycsICdidXQnXSwgWyd0aGF0JywgJ2lzJywgJ2FscmlnaHQnXV07XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJzRGVmZXJyZWQucmVzb2x2ZShuZXdGaWx0ZXJzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTcHkgb24gZG9Mb2FkRmlsdGVycyB0byBlbnN1cmUgaXQgZ2V0cyBjYWxsZWQgd2hlbiBzd2l0Y2guXHJcbiAgICAgICAgICAgICAgICBzcHlPbihjdHJsLCAnZG9Mb2FkRmlsdGVycycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZG9Mb2FkRmlsdGVycykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXJlISEhIVxyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgbmV3IGZpbHRlcnMgaGF2ZSBiZWVuIGxvYWRlZCBhbmQgdGhhdCBmaWx0ZXJzIGhhdmUgY2hhbmdlZC5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldFBhZ2VTdGF0ZSgpLnNlYXJjaERhdGEuZmlsdGVyR3JvdXBzKS50b0VxdWFsKGV4cGVjdGVkRmlsdGVyR3JvdXBzKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmRvTG9hZEZpbHRlcnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgcmVsb2FkIGZpbHRlcnMgd2hlbiBzd2l0Y2hpbmcgYmFjayB0byBhIHByZXZpb3VzIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXl3b3JkRmlsdGVycyA9IFsgJ2tleXdvcmQnIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuZWRGaWx0ZXJzID0gWyAncG9wdWxhdGlvbicgXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGtleXdvcmQgZmlsdGVycyBhbmQgbWFrZSB0aGUgZmlsdGVyIHNlcnZpY2UgcmV0dXJuIHBvcHVsYXRpb24gZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiBzd2l0Y2hpbmcgdHlwZXMuXHJcbiAgICAgICAgICAgICAgICBjdHJsLmdldFBhZ2VTdGF0ZSgpLnNlYXJjaERhdGEuZmlsdGVyR3JvdXBzID0gW2tleXdvcmRGaWx0ZXJzXTtcclxuICAgICAgICAgICAgICAgIGZpbHRlcnNEZWZlcnJlZC5yZXNvbHZlKHJldHVybmVkRmlsdGVycyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3B5IG9uIGxvYWRpbmcgc28gdGhhdCB3ZSBjYW4gc2VlIGhvdyBtYW55IHRpbWVzIGl0IGlzIGNhbGxlZC5cclxuICAgICAgICAgICAgICAgIHNweU9uKGN0cmwsICdkb0xvYWRGaWx0ZXJzJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5kb0xvYWRGaWx0ZXJzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCB0eXBlcyAtIGVuc3VyZSBpdCBpcyBjYWxsZWQgb25jZS5cclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5kb0xvYWRGaWx0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5nZXRQYWdlU3RhdGUoKS5zZWFyY2hEYXRhLmZpbHRlckdyb3VwcykudG9FcXVhbChbcmV0dXJuZWRGaWx0ZXJzXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3dpdGNoIGJhY2sgLSBpdCBzaG91bGQgdXNlIHRoZSBjYWNoZWQgdmFsdWVzIGFuZCBub3QgaGF2ZSBsb2FkZWQgYWdhaW4uXHJcbiAgICAgICAgICAgICAgICBjdHJsLmRvTG9hZEZpbHRlcnMuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9LRVlXT1JEKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmRvTG9hZEZpbHRlcnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5nZXRQYWdlU3RhdGUoKS5zZWFyY2hEYXRhLmZpbHRlckdyb3VwcykudG9FcXVhbChba2V5d29yZEZpbHRlcnNdKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnaXNLZXl3b3JkU2VhcmNoVHlwZSgpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYga2V5d29yZCBzZWFyY2ggdHlwZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNLZXl3b3JkU2VhcmNoVHlwZSgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3JldHVybiBmYWxzZSBpZiBub3Qga2V5d29yZCBzZWFyY2ggdHlwZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNLZXl3b3JkU2VhcmNoVHlwZSgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9JREVOVElUWSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc0tleXdvcmRTZWFyY2hUeXBlKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ2lzUG9wdWxhdGlvblNlYXJjaFR5cGUoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHBvcHVsYXRpb24gc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblNlYXJjaFR5cGUoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm4gZmFsc2UgaWYgbm90IHBvcHVsYXRpb24gc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblNlYXJjaFR5cGUoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmNoYW5nZVNlYXJjaFR5cGUoU0VBUkNIX1RZUEVfSURFTlRJVFkpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNQb3B1bGF0aW9uU2VhcmNoVHlwZSgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdpc0lkZW50aXR5U2VhcmNoVHlwZSgpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgaWRlbnRpdHkgc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9JREVOVElUWSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc0lkZW50aXR5U2VhcmNoVHlwZSgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3JldHVybiBmYWxzZSBpZiBub3QgaWRlbnRpdHkgc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzSWRlbnRpdHlTZWFyY2hUeXBlKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNJZGVudGl0eVNlYXJjaFR5cGUoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZGlzYWJsZXMgaGlkaW5nIGZpbHRlcnMgb24gc2VhcmNoIGlmIGlkZW50aXR5IG9yIHBvcHVsYXRpb24gc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNIaWRlRmlsdGVyc09uU2VhcmNoKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwuY2hhbmdlU2VhcmNoVHlwZShTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNIaWRlRmlsdGVyc09uU2VhcmNoKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBjdHJsLmNoYW5nZVNlYXJjaFR5cGUoU0VBUkNIX1RZUEVfSURFTlRJVFkpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0hpZGVGaWx0ZXJzT25TZWFyY2goKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdnZXRGaWx0ZXJHcm91cHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQgKCdyZXR1cm5zIHVuZGVmaW5lZCBpZiBpc0ZvcktleXdvcmRTZWFyY2hUeXBlIGlzIHRydWUgYW5kIHNlYXJjaCB0eXBlIGlzIG5vdCBrZXl3b3JkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmNoYW5nZVNlYXJjaFR5cGUoU0VBUkNIX1RZUEVfSURFTlRJVFkpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0RmlsdGVyR3JvdXBzKHRydWUpKS50b0VxdWFsKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQgKCdyZXR1cm5zIGZpbHRlcnMgaWYgaXNGb3JLZXl3b3JkU2VhcmNoVHlwZSBpcyB0cnVlIGFuZCBzZWFyY2ggdHlwZSBpcyBrZXl3b3JkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5nZXRGaWx0ZXJHcm91cHModHJ1ZSkpLnRvRXF1YWwoY3RybC5maWx0ZXJHcm91cHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ICgncmV0dXJucyB1bmRlZmluZWQgaWYgaXNGb3JLZXl3b3JkU2VhcmNoVHlwZSBpcyBmYWxzZSBhbmQgc2VhcmNoIHR5cGUgaXMga2V5d29yZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0RmlsdGVyR3JvdXBzKGZhbHNlKSkudG9FcXVhbCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ICgncmV0dXJucyB1bmRlZmluZWQgaWYgaXNGb3JLZXl3b3JkU2VhcmNoVHlwZSBpcyB0cnVlIGFuZCBzZWFyY2ggdHlwZSBpcyBub3Qga2V5d29yZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX0lERU5USVRZKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEZpbHRlckdyb3VwcyhmYWxzZSkpLnRvRXF1YWwoY3RybC5maWx0ZXJHcm91cHMpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5jaGFuZ2VTZWFyY2hUeXBlKFNFQVJDSF9UWVBFX1BPUFVMQVRJT04pO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0RmlsdGVyR3JvdXBzKGZhbHNlKSkudG9FcXVhbChjdHJsLmZpbHRlckdyb3Vwcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzUG9wdWxhdGlvblNlYXJjaEFsbG93ZWQoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBjb3JyZWN0IGNvbmZpZyB2YWx1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlTW9jay5nZXRDb25maWdWYWx1ZSA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1BvcHVsYXRpb25TZWFyY2hBbGxvd2VkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlTW9jay5nZXRDb25maWdWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBubyB2YWx1ZSBpcyBjb25maWd1cmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2VNb2NrLmdldENvbmZpZ1ZhbHVlID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblNlYXJjaEFsbG93ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlTW9jay5nZXRDb25maWdWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzSWRlbnRpdHlTZWFyY2hBbGxvd2VkKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyB0aGUgY29ycmVjdCBjb25maWcgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uZmlnU2VydmljZU1vY2suZ2V0Q29uZmlnVmFsdWUgPSBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNJZGVudGl0eVNlYXJjaEFsbG93ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZ1NlcnZpY2VNb2NrLmdldENvbmZpZ1ZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5vIHZhbHVlIGlzIGNvbmZpZ3VyZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uZmlnU2VydmljZU1vY2suZ2V0Q29uZmlnVmFsdWUgPSBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5yZXR1cm5WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNJZGVudGl0eVNlYXJjaEFsbG93ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlTW9jay5nZXRDb25maWdWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzU2VhcmNoVHlwZUFsbG93ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGtleXdvcmQgc2VhcmNoIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWFyY2hUeXBlQWxsb3dlZChTRUFSQ0hfVFlQRV9LRVlXT1JEKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgaWRlbnRpdHkgc2VhcmNoIHR5cGUgaXMgbm90IGFsbG93ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2lzSWRlbnRpdHlTZWFyY2hBbGxvd2VkJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWFyY2hUeXBlQWxsb3dlZChTRUFSQ0hfVFlQRV9JREVOVElUWSkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGlkZW50aXR5IHNlYXJjaCB0eXBlIGlzIGFsbG93ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2lzSWRlbnRpdHlTZWFyY2hBbGxvd2VkJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1NlYXJjaFR5cGVBbGxvd2VkKFNFQVJDSF9UWVBFX0lERU5USVRZKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgcG9wdWxhdGlvbiBzZWFyY2ggdHlwZSBpcyBub3QgYWxsb3dlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNQb3B1bGF0aW9uU2VhcmNoQWxsb3dlZCcpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU2VhcmNoVHlwZUFsbG93ZWQoU0VBUkNIX1RZUEVfUE9QVUxBVElPTikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHBvcHVsYXRpb24gc2VhcmNoIHR5cGUgaXMgYWxsb3dlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNQb3B1bGF0aW9uU2VhcmNoQWxsb3dlZCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWFyY2hUeXBlQWxsb3dlZChTRUFSQ0hfVFlQRV9QT1BVTEFUSU9OKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpdGVtIHBvcHVsYXRpb24gc3RhdGlzdGljcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpdGVtV2l0aFN0YXRzdGljcztcclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihhY2Nlc3NSZXF1ZXN0VGVzdERhdGEpIHtcclxuICAgICAgICAgICAgaXRlbVdpdGhTdGF0c3RpY3MgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZX1NFQVJDSF9ST0xFKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdpc1BvcHVsYXRpb25QZXJjZW50YWdlSGlnaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCAoJ3JldHVybnMgdHJ1ZSBpZiBwb3B1bGF0aW9uIHBlcmNlbnRhZ2UgaXMgaGlnaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbVdpdGhTdGF0c3RpY3MucG9wdWxhdGlvblN0YXRpc3RpY3MuY291bnQgPSAxODtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblBlcmNlbnRhZ2VIaWdoKGl0ZW1XaXRoU3RhdHN0aWNzKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCAoJ3JldHVybnMgZmFsc2UgaWYgcG9wdWxhdGlvbiBwZXJjZW50YWdlIGlzIG5vdCBoaWdoJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjdXRvZmYgZm9yIEhpZ2ggaXMgODAgcGVyY2VudCwgdGVzdCA3NVxyXG4gICAgICAgICAgICAgICAgaXRlbVdpdGhTdGF0c3RpY3MucG9wdWxhdGlvblN0YXRpc3RpY3MuY291bnQgPSAxNTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblBlcmNlbnRhZ2VIaWdoKGl0ZW1XaXRoU3RhdHN0aWNzKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnaXNQb3B1bGF0aW9uUGVyY2VudGFnZU1lZGl1bScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCAoJ3JldHVybnMgdHJ1ZSBpZiBwb3B1bGF0aW9uIHBlcmNlbnRhZ2UgaXMgbWVkaXVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtV2l0aFN0YXRzdGljcy5wb3B1bGF0aW9uU3RhdGlzdGljcy5jb3VudCA9IDEwO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNQb3B1bGF0aW9uUGVyY2VudGFnZU1lZGl1bShpdGVtV2l0aFN0YXRzdGljcykpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQgKCdyZXR1cm5zIGZhbHNlIGlmIHBvcHVsYXRpb24gcGVyY2VudGFnZSBpcyB0b28gaGlnaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3V0b2ZmIGZvciBNZWRpdW0gaXMgNzkgcGVyY2VudCwgdGVzdCA4MFxyXG4gICAgICAgICAgICAgICAgaXRlbVdpdGhTdGF0c3RpY3MucG9wdWxhdGlvblN0YXRpc3RpY3MuY291bnQgPSAxNjtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblBlcmNlbnRhZ2VNZWRpdW0oaXRlbVdpdGhTdGF0c3RpY3MpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCAoJ3JldHVybnMgZmFsc2UgaWYgcG9wdWxhdGlvbiBwZXJjZW50YWdlIGlzIHRvbyBsb3cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGN1dG9mZiBmb3IgTWVkaXVtIGlzIDMwIHBlcmNlbnQsIHRlc3QgMjVcclxuICAgICAgICAgICAgICAgIGl0ZW1XaXRoU3RhdHN0aWNzLnBvcHVsYXRpb25TdGF0aXN0aWNzLmNvdW50ID0gNTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblBlcmNlbnRhZ2VNZWRpdW0oaXRlbVdpdGhTdGF0c3RpY3MpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdpc1BvcHVsYXRpb25QZXJjZW50YWdlTG93JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0ICgncmV0dXJucyB0cnVlIGlmIHBvcHVsYXRpb24gcGVyY2VudGFnZSBpcyBsb3cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1XaXRoU3RhdHN0aWNzLnBvcHVsYXRpb25TdGF0aXN0aWNzLmNvdW50ID0gNTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblBlcmNlbnRhZ2VMb3coaXRlbVdpdGhTdGF0c3RpY3MpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ICgncmV0dXJucyBmYWxzZSBpZiBwb3B1bGF0aW9uIHBlcmNlbnRhZ2UgaXMgdG9vIGhpZ2gnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGN1dG9mZiBmb3IgTG93IGlzIDI5IHBlcmNlbnQsIHRlc3QgMzBcclxuICAgICAgICAgICAgICAgIGl0ZW1XaXRoU3RhdHN0aWNzLnBvcHVsYXRpb25TdGF0aXN0aWNzLmNvdW50ID0gNjtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzUG9wdWxhdGlvblBlcmNlbnRhZ2VMb3coaXRlbVdpdGhTdGF0c3RpY3MpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdzaG93TWF0Y2hlZFBvcHVsYXRpb25EaWFsb2coKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdoZW4gbm8gaXRlbSBpcyBwYXNzZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLnNob3dNYXRjaGVkUG9wdWxhdGlvbkRpYWxvZygpO1xyXG4gICAgICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgb3BlbiBhIG1vZGFsIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zaG93TWF0Y2hlZFBvcHVsYXRpb25EaWFsb2coaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
