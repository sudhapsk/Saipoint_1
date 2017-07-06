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
             * Tests for the AccessRequestIdentitiesCtrl.
             */
            describe('AccessRequestIdentitiesCtrl', function () {

                var $rootScope, $controller, testService, stateParams, AccessRequest, accessRequestDataService, accessRequestIdentityService, PageState, ctrl, identity1, identity2, identity3, miniIdentity, accessRequestFilterService, deferred, timeout, checkRemovedAccessSuccess, checkRemovedAccessResolve, spModal, resolveModal, accessRequestTestData;

                // Load the test module to get the testService.
                beforeEach(module(testModule));

                // Let the tests know we'll use the access request module.
                beforeEach(module(accessRequestModule, function ($provide) {
                    /* Inject some test functions into configService */
                    $provide.decorator('configService', function ($delegate, testService, SP_CONFIG_SERVICE) {
                        var originalGetConfigValueFn = $delegate.getConfigValue;

                        $delegate.getConfigValue = function (key) {
                            /* Fake max requestable identities down to a managable number */
                            if (key === SP_CONFIG_SERVICE.ACCESS_REQUEST_MAX_IDENTITY_SELECT) {
                                return 2;
                            }
                            /* Mock out the runInitialLoad value */
                            if (key === SP_CONFIG_SERVICE.DISABLE_INITIAL_ACCESS_REQUEST_GRID_LOAD) {
                                return false;
                            }
                            return originalGetConfigValueFn.call(this, key);
                        };

                        $delegate.getColumnConfigEntries = testService.createPromiseSpy(false, {
                            status: 200,
                            data: { 'uiRequestAccessIdentityCard': {} }
                        }, {});

                        $delegate.getIdentityDetailsConfig = testService.createPromiseSpy(false, {
                            status: 200,
                            data: {}
                        }, {});

                        return $delegate;
                    });
                }));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams : 14 */
                beforeEach(inject(function (_AccessRequest_, _accessRequestDataService_, _accessRequestIdentityService_, Identity, _PageState_, _testService_, _$controller_, _$rootScope_, _accessRequestFilterService_, $q, configService, $timeout, $stateParams, _accessRequestTestData_) {

                    // Save the services.
                    AccessRequest = _AccessRequest_;
                    accessRequestDataService = _accessRequestDataService_;
                    accessRequestIdentityService = _accessRequestIdentityService_;
                    $controller = _$controller_;
                    testService = _testService_;
                    PageState = _PageState_;
                    $rootScope = _$rootScope_;
                    accessRequestFilterService = _accessRequestFilterService_;
                    timeout = $timeout;
                    accessRequestTestData = _accessRequestTestData_;
                    deferred = $q.defer();
                    spyOn(accessRequestFilterService, 'getIdentityFilters').and.returnValue(deferred.promise);
                    spyOn(_accessRequestDataService_, 'getQuickLinkName').and.returnValue('Request Access');

                    stateParams = $stateParams;

                    // Create an identity to test with.
                    identity1 = new Identity(accessRequestTestData.IDENTITY1);
                    identity2 = new Identity(accessRequestTestData.IDENTITY2);
                    identity3 = new Identity(accessRequestTestData.IDENTITY3);
                    miniIdentity = new Identity({ 'id': '2c908cae486a4ba601486a4d9ba90423', 'name': 'vpodesta' });

                    // Mock out the identity service to return a single identity.
                    accessRequestIdentityService.getIdentities = testService.createPromiseSpy(false, {
                        status: 200,
                        data: {
                            count: 1,
                            objects: [identity1]
                        }
                    }, {});

                    // Mock out the getAllIdentities call
                    accessRequestIdentityService.getAllIdentities = testService.createPromiseSpy(false, {
                        status: 200,
                        data: {
                            count: 1,
                            objects: [miniIdentity]
                        }
                    }, {});

                    // Create the controller to test with.
                    ctrl = $controller('AccessRequestIdentitiesCtrl', {
                        accessRequestIdentityService: accessRequestIdentityService,
                        configService: configService,
                        accessRequestDataService: accessRequestDataService
                    });

                    spyOn(ctrl, 'showHasRemovedAccessDialog').and.callFake(function () {
                        var checkDeferred = $q.defer();
                        if (checkRemovedAccessResolve) {
                            checkDeferred.resolve(checkRemovedAccessSuccess);
                        } else {
                            checkDeferred.reject(checkRemovedAccessSuccess);
                        }
                        return checkDeferred.promise;
                    });
                    checkRemovedAccessSuccess = true;
                    checkRemovedAccessResolve = true;

                    // Run a digest cycle to resolve the promise.
                    $rootScope.$apply();
                }));

                it('fetches identities when loaded', function () {
                    // The start and limit are hard-coded.
                    expect(accessRequestIdentityService.getIdentities).toHaveBeenCalledWith(undefined, {}, 0, 12, 'Request Access');
                    expect(accessRequestIdentityService.getAllIdentities).toHaveBeenCalledWith(undefined, {}, 'Request Access');
                });

                it('adds identities when selected', function () {
                    spyOn(accessRequestDataService.getAccessRequest(), 'addIdentity').and.returnValue(true);
                    ctrl.selectIdentity(identity1);
                    $rootScope.$apply();
                    expect(accessRequestDataService.getAccessRequest().addIdentity).toHaveBeenCalledWith(identity1);
                });

                it('removes identities when deselected', function () {
                    spyOn(accessRequestDataService.getAccessRequest(), 'removeIdentity').and.returnValue(true);
                    ctrl.deselectIdentity(identity1);
                    $rootScope.$apply();
                    expect(accessRequestDataService.getAccessRequest().removeIdentity).toHaveBeenCalledWith(identity1);
                });

                it('resets manage access paging when selecting or deselecting', function () {
                    spyOn(accessRequestDataService, 'resetManageAccessPaging').and.callThrough();
                    spyOn(accessRequestDataService.getAccessRequest(), 'addIdentity').and.returnValue(true);
                    spyOn(accessRequestDataService.getAccessRequest(), 'removeIdentity').and.returnValue(true);
                    ctrl.selectIdentity(identity1);
                    $rootScope.$apply();
                    expect(accessRequestDataService.resetManageAccessPaging).toHaveBeenCalled();
                    ctrl.deselectIdentity(identity1);
                    $rootScope.$apply();
                    expect(accessRequestDataService.resetManageAccessPaging.calls.count()).toBe(2);
                });

                it('does not reset manage access paging if nothing is selected or deselected', function () {
                    spyOn(accessRequestDataService, 'resetManageAccessPaging');
                    spyOn(accessRequestDataService.getAccessRequest(), 'addIdentity').and.returnValue({
                        failed: true,
                        errors: [AccessRequest.ERRORS.HAS_REMOVED_ACCESS]
                    });
                    spyOn(accessRequestDataService.getAccessRequest(), 'removeIdentity').and.returnValue({
                        failed: true,
                        errors: [AccessRequest.ERRORS.HAS_REMOVED_ACCESS]
                    });
                    checkRemovedAccessResolve = false;
                    ctrl.selectIdentity(identity1);
                    $rootScope.$apply();
                    expect(accessRequestDataService.resetManageAccessPaging).not.toHaveBeenCalled();
                    ctrl.deselectIdentity(identity1);
                    $rootScope.$apply();
                    expect(accessRequestDataService.resetManageAccessPaging).not.toHaveBeenCalled();
                });

                var testIdentitySelection = function (isSelected) {
                    var selected;
                    spyOn(accessRequestDataService.getAccessRequest(), 'hasIdentity').and.returnValue(isSelected);
                    selected = ctrl.isIdentitySelected(identity1);
                    expect(accessRequestDataService.getAccessRequest().hasIdentity).toHaveBeenCalledWith(identity1);
                    expect(selected).toEqual(isSelected);
                };

                it('says that an identity is selected if added', function () {
                    testIdentitySelection(true);
                });

                it('says that an identity is not selected if not added', function () {
                    testIdentitySelection(false);
                });

                it('returns the selected identities', function () {
                    var identities;
                    spyOn(accessRequestDataService.getAccessRequest(), 'getIdentities').and.returnValue([identity1]);
                    identities = ctrl.getSelectedIdentities();
                    expect(accessRequestDataService.getAccessRequest().getIdentities).toHaveBeenCalled();
                    expect(identities.length).toEqual(1);
                    expect(identities[0]).toEqual(identity1);
                });

                describe('isIdentityDisabled()', function () {
                    it('returns false if bulk identity requests are allowed', function () {
                        // Add an identity so that this would otherwise return true if bulk were disabled.
                        ctrl.selectIdentity(identity1);
                        expect(ctrl.isIdentityDisabled(identity2)).toEqual(false);
                    });

                    describe('when bulk request is disabled', function () {
                        beforeEach(function () {
                            accessRequestDataService.setAllowBulkRequest(false);
                        });

                        it('returns false if no identity is selected', function () {
                            expect(ctrl.isIdentityDisabled(identity1)).toEqual(false);
                        });

                        it('returns false if the same identity is selected', function () {
                            ctrl.selectIdentity(identity1);
                            expect(ctrl.isIdentityDisabled(identity1)).toEqual(false);
                        });

                        it('returns true if a different identity is selected', function () {
                            ctrl.selectIdentity(identity1);
                            expect(ctrl.isIdentityDisabled(identity2)).toEqual(true);
                        });
                    });
                });

                describe('allow bulk identity requests', function () {
                    it('is true if configuration not present', function () {
                        expect(ctrl.allowBulkIdentityRequest()).toEqual(true);
                    });

                    it('returns the configured value', function () {
                        accessRequestDataService.setAllowBulkRequest(false);
                        expect(ctrl.allowBulkIdentityRequest()).toEqual(false);
                    });
                });

                describe('unsupported identity operation errors', function () {
                    var failedResponse = {
                        failed: true,
                        errors: ['unsupportedError']
                    };

                    function setupSpy(functionToSpyOn) {
                        spyOn(accessRequestDataService.getAccessRequest(), functionToSpyOn).and.returnValue(failedResponse);
                    }

                    it('should throw if adding identity fails with unsupported error', function () {
                        setupSpy('addIdentity');
                        expect(function () {
                            ctrl.selectIdentity(identity1);
                        }).toThrow();
                    });

                    it('should throw if removing identity fails with unsupported error', function () {
                        setupSpy('removeIdentity');
                        expect(function () {
                            ctrl.deselectIdentity(identity1);
                        }).toThrow();
                    });

                    it('should throw if toggling all identities fails with unsupported error', function () {
                        setupSpy('addIdentities');
                        expect(function () {
                            ctrl.toggleSelectAllIdentities();
                        }).toThrow();
                    });
                });

                /**
                 * Set the allIdentities and count in the controller to the given list.
                 */
                function setupAllIdentities(identities) {
                    ctrl.allIdentities = identities;
                    ctrl.allIdentitiesCount = identities.length;
                }

                /**
                 * Test to make sure state params work
                 */
                describe('stateParams.selectedView should enable the selected view', function () {

                    // setup stateParams.selectedView to be true
                    beforeEach(inject(function ($stateParams) {
                        $stateParams.selectedView = true;
                    }));

                    // set it back
                    afterEach(inject(function ($stateParams) {
                        $stateParams.selectedView = false;
                    }));

                    it('should call fetchSelectedIdentities when stateParams selectedView is enabled', function () {
                        spyOn(ctrl, 'fetchSelectedIdentities').and.callThrough();
                        spyOn(ctrl, 'doSearch').and.callThrough();

                        ctrl.initialize();

                        expect(ctrl.fetchSelectedIdentities).toHaveBeenCalled();
                        expect(ctrl.doSearch).not.toHaveBeenCalled();

                        expect(ctrl.selectedDisplayed).toBeTruthy();
                    });
                });

                describe('show too much selected dialog', function () {
                    var spModal;

                    // Setup the dependencies.
                    beforeEach(inject(function (_spModal_, _$q_, _AccessRequest_) {
                        spModal = _spModal_;
                        setupModalMock(_spModal_, _$q_);
                    }));

                    it('does not prompt when max identities not reached', function () {
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        expect(spModal.open).not.toHaveBeenCalled();

                        ctrl.selectIdentity(identity2);
                        $rootScope.$apply();
                        expect(spModal.open).not.toHaveBeenCalled();
                    });

                    it('does prompt when max identities reached', function () {
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        ctrl.selectIdentity(identity2);
                        $rootScope.$apply();
                        ctrl.selectIdentity(identity3);
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('does not prompt when select all not too much happens', function () {
                        setupAllIdentities([identity1, identity2]);
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(spModal.open).not.toHaveBeenCalled();
                    });

                    it('does prompt when select all too much identities happens', function () {
                        setupAllIdentities([identity1, identity2, identity3]);
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should prompt when current selected items and search result count exceed max allowable', function () {
                        spyOn(accessRequestDataService.accessRequest, 'getIdentities').and.returnValue([{}]);
                        spyOn(ctrl.getPageState().pagingData, 'getTotal').and.returnValue(2);
                        setupAllIdentities([identity1, identity2]);
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                /**
                 * Test to see if modal opens with IdentityDetailDialogCtrl
                 */
                describe('show identity detail dialog', function () {
                    var Identity, spModal;

                    beforeEach(inject(function (_Identity_, _spModal_) {
                        Identity = _Identity_;
                        spModal = _spModal_;
                        spyOn(spModal, 'open');
                    }));

                    /**
                     * Make sure that an identity is required.
                     */
                    it('explodes if no identity is specified', function () {
                        expect(function () {
                            ctrl.getIdentityDetails(null);
                        }).toThrow();
                    });

                    /**
                     * Make sure showIdentityDetails() method opens the modal with the correct IdentityDetailDialogController
                     */
                    it('opens the modal', function () {
                        var identity = new Identity(accessRequestTestData.IDENTITY1);
                        ctrl.showIdentityDetails(identity);

                        $rootScope.$apply();

                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].controller).toEqual('IdentityDetailDialogCtrl as dialogCtrl');
                    });
                });

                describe('identity selection', function () {

                    beforeEach(inject(function () {
                        setupAllIdentities([identity1]);

                        accessRequestIdentityService.getSelectedIdentities = testService.createPromiseSpy(false, {
                            status: 200,
                            data: {
                                count: 1,
                                objects: [identity1]
                            }
                        }, {});
                    }));

                    it('throws if bulk identity requests are not enabled', function () {
                        accessRequestDataService.setAllowBulkRequest(false);
                        expect(function () {
                            ctrl.toggleSelectAllIdentities();
                        }).toThrow();
                    });

                    it('sets all selected/unselected when toggle is clicked', function () {
                        expect(ctrl.allSelected).toBeFalsy();

                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeTruthy();

                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeFalsy();
                    });

                    it('deselect unselects all', function () {
                        expect(ctrl.allSelected).toBeFalsy();

                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeTruthy();

                        ctrl.deselectIdentity(identity1);
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeFalsy();
                    });

                    it('select selects all', function () {
                        expect(ctrl.allSelected).toBeFalsy();

                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeTruthy();
                    });

                    it('resets manage access paging when selecting or deselecting all', function () {
                        spyOn(accessRequestDataService, 'resetManageAccessPaging').and.callThrough();
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(accessRequestDataService.resetManageAccessPaging).toHaveBeenCalled();
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(accessRequestDataService.resetManageAccessPaging).toHaveBeenCalled();
                    });

                    it('select with multiple identities sets select all correctly', function () {
                        setupAllIdentities([identity1, identity2]);
                        expect(ctrl.allSelected).toBeFalsy();

                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeFalsy();

                        ctrl.selectIdentity(identity2);
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeTruthy();

                        ctrl.deselectIdentity(identity2);
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeFalsy();
                    });

                    it('unselects all when searching returns more than the selected users', function () {
                        // Start showing 1 of 2 identities - this is the default setup.
                        expect(ctrl.items.length).toEqual(1);
                        expect(ctrl.allIdentities.length).toEqual(1);
                        expect(ctrl.allSelected).toBeFalsy();

                        // Select all and verify that allSelected is true.
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toBeTruthy();

                        // Search again returning 2 of 2 identities - identity2 shouldn't
                        // be selected after this.
                        accessRequestIdentityService.getAllIdentities = testService.createPromiseSpy(false, {
                            status: 200,
                            data: {
                                count: 2,
                                objects: [identity1, identity2]
                            }
                        }, {});
                        accessRequestIdentityService.getIdentities = testService.createPromiseSpy(false, {
                            status: 200,
                            data: {
                                count: 2,
                                objects: [identity1, identity2]
                            }
                        }, {});
                        ctrl.search();
                        timeout.flush();
                        $rootScope.$apply();

                        // Verify that allSelected is false.
                        expect(ctrl.allSelected).toBeFalsy();
                    });

                    it('toggle show selected toggles selectedDisplayed flag', function () {
                        expect(ctrl.selectedDisplayed).toBeFalsy();

                        ctrl.toggleShowSelected();
                        expect(ctrl.selectedDisplayed).toBeTruthy();

                        ctrl.toggleShowSelected();
                        expect(ctrl.selectedDisplayed).toBeFalsy();
                    });

                    it('fetch items calls fetchSelectedIdentities when in selected view', function () {
                        expect(ctrl.selectedDisplayed).toBeFalsy();

                        // select some identities
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();

                        // toggle show selected to show selected
                        ctrl.toggleShowSelected();
                        expect(ctrl.selectedDisplayed).toBeTruthy();

                        spyOn(ctrl, 'fetchSelectedIdentities');
                        ctrl.fetchItems();

                        expect(ctrl.fetchSelectedIdentities).toHaveBeenCalled();
                    });

                    it('backupIdentities should be set when in selected view', function () {
                        // select some identities
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();

                        ctrl.toggleShowSelected();
                        expect(ctrl.selectedDisplayed).toBeTruthy();

                        expect(ctrl.backupSelectedIdentities.length).toEqual(1);
                        ctrl.toggleShowSelected();
                        ctrl.selectIdentity(identity2);
                        $rootScope.$apply();
                        ctrl.toggleShowSelected();
                        expect(ctrl.backupSelectedIdentities.length).toEqual(2);
                    });

                    it('toggleSelectAll should call addIdentities/removeAllIdentities when in selected view', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'addIdentities').and.callThrough();
                        spyOn(accessRequestDataService.getAccessRequest(), 'removeAllIdentities').and.callThrough();

                        // select some identities
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();

                        ctrl.toggleShowSelected();
                        expect(ctrl.selectedDisplayed).toBeTruthy();
                        expect(ctrl.allSelected).toBeTruthy();
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().removeAllIdentities).toHaveBeenCalled();
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().addIdentities).toHaveBeenCalled();
                        expect(ctrl.allSelected).toBeTruthy();
                    });
                });

                /**
                 * Setup the spModal mock to either resolve or reject.
                 *
                 * @param {boolean} resolve  True if the modal should resolve, false to reject.
                 */
                function setupModal(resolve) {
                    resolveModal = resolve;
                }

                /**
                 * Setup calls to spModal.open() to mock the response.
                 */
                function setupModalMock(_spModal_, $q) {
                    spModal = _spModal_;
                    spyOn(spModal, 'open').and.callFake(function () {
                        var deferred = $q.defer();

                        if (resolveModal) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }

                        return {
                            result: deferred.promise
                        };
                    });
                }

                describe('prevent adding identities if role is in cart', function () {
                    var roleRequestedItem, entitlementRequestedItem;

                    beforeEach(inject(function (_spModal_, $q, AccessRequestItem, RequestedAccessItem) {
                        var role = new AccessRequestItem(accessRequestTestData.ROLE),
                            entitlement = new AccessRequestItem(accessRequestTestData.ENTITLEMENT);

                        setupModalMock(_spModal_, $q);

                        roleRequestedItem = new RequestedAccessItem(role);
                        entitlementRequestedItem = new RequestedAccessItem(entitlement);

                        spyOn(accessRequestDataService.getAccessRequest(), 'addIdentity').and.callThrough();
                        spyOn(accessRequestDataService.getAccessRequest(), 'addIdentities').and.callThrough();
                    }));

                    describe('selectIdentity()', function () {
                        it('adds identity if cart has no items', function () {
                            ctrl.selectIdentity(identity1);
                            $rootScope.$apply();
                            expect(accessRequestDataService.getAccessRequest().addIdentity).toHaveBeenCalledWith(identity1);
                        });

                        it('adds identity if cart has no roles', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([entitlementRequestedItem]);
                            ctrl.selectIdentity(identity1);
                            $rootScope.$apply();
                            expect(accessRequestDataService.getAccessRequest().addIdentity).toHaveBeenCalledWith(identity1);
                        });

                        it('shows modal if cart has role', function () {
                            var args;
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([roleRequestedItem]);
                            ctrl.selectIdentity(identity1);
                            $rootScope.$apply();
                            expect(spModal.open).toHaveBeenCalled();
                            args = spModal.open.calls.mostRecent().args;
                            expect(args[0].content).toEqual('ui_access_request_lose_requested_roles_warning');
                        });

                        it('does not add identity if "no" is selected in dialog', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([roleRequestedItem]);

                            setupModal(false);
                            ctrl.selectIdentity(identity1);
                            expect(accessRequestDataService.getAccessRequest().addIdentity.calls.count()).toBe(1);
                            $rootScope.$apply();
                            expect(spModal.open).toHaveBeenCalled();
                            $rootScope.$apply();
                            expect(accessRequestDataService.getAccessRequest().addIdentity.calls.count()).toBe(1);
                        });

                        it('adds identity if "yes" is selected in dialog', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([roleRequestedItem]);
                            setupModal(true);
                            ctrl.selectIdentity(identity1);
                            $rootScope.$apply();
                            expect(spModal.open).toHaveBeenCalled();
                            $rootScope.$apply();
                            expect(accessRequestDataService.getAccessRequest().addIdentity).toHaveBeenCalledWith(identity1);
                        });
                    });

                    describe('toggleSelectAllIdentities()', function () {
                        function checkAllIdentitiesAdded() {
                            expect(accessRequestDataService.getAccessRequest().addIdentities).toHaveBeenCalledWith(ctrl.allIdentities);
                        }

                        it('adds all identities if cart has no items', function () {
                            ctrl.toggleSelectAllIdentities();
                            $rootScope.$apply();
                            checkAllIdentitiesAdded();
                        });

                        it('adds all identities if cart has no roles', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([entitlementRequestedItem]);
                            ctrl.toggleSelectAllIdentities();
                            $rootScope.$apply();
                            checkAllIdentitiesAdded();
                        });

                        it('shows modal if cart has role', function () {
                            var args;
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([roleRequestedItem]);
                            ctrl.toggleSelectAllIdentities();
                            $rootScope.$apply();
                            expect(spModal.open).toHaveBeenCalled();
                            args = spModal.open.calls.mostRecent().args;
                            expect(args[0].content).toEqual('ui_access_request_lose_requested_roles_warning');
                        });

                        it('does not add identities if "no" is selected in dialog', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([roleRequestedItem]);
                            setupModal(false);
                            ctrl.toggleSelectAllIdentities();
                            expect(accessRequestDataService.getAccessRequest().addIdentities.calls.count()).toBe(1);
                            $rootScope.$apply();
                            expect(spModal.open).toHaveBeenCalled();
                            $rootScope.$apply();
                            expect(accessRequestDataService.getAccessRequest().addIdentities.calls.count()).toBe(1);
                        });

                        it('adds identities if "yes" is selected in dialog', function () {
                            spyOn(accessRequestDataService.getAccessRequest(), 'getRequestedItems').and.returnValue([roleRequestedItem]);
                            setupModal(true);
                            ctrl.toggleSelectAllIdentities();
                            $rootScope.$apply();
                            expect(spModal.open).toHaveBeenCalled();
                            $rootScope.$apply();
                            checkAllIdentitiesAdded();
                        });
                    });
                });

                describe('check removed access', function () {
                    // Setup the dependencies.
                    beforeEach(inject(function (_spModal_, $q) {
                        setupModalMock(_spModal_, $q);
                        ctrl.showHasRemovedAccessDialog.and.callThrough();
                        spyOn(accessRequestDataService.getAccessRequest(), 'getRemovedCurrentAccessItems').and.returnValue([{ id: 'whatever' }]);
                    }));

                    it('should call showHasRemovedAccessDialog when selecting identity', function () {
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        expect(ctrl.showHasRemovedAccessDialog).toHaveBeenCalled();
                    });

                    it('should not select identity if showHasRemovedAccessDialog resolves to false', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'addIdentity').and.returnValue(true);
                        setupModal(false);
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().addIdentity.calls.count()).toBe(1);
                        setupModal(true);
                        ctrl.selectIdentity(identity1);
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().addIdentity.calls.count()).toBe(2);
                    });

                    it('should call showHasRemovedAccessDialog when deselecting identity', function () {
                        ctrl.deselectIdentity(identity1);
                        $rootScope.$apply();
                        expect(ctrl.showHasRemovedAccessDialog).toHaveBeenCalled();
                    });

                    it('should not deselect identity if showHasRemovedAccessDialog resolves to false', function () {
                        spyOn(accessRequestDataService.getAccessRequest(), 'removeIdentity').and.returnValue(true);
                        setupModal(false);
                        ctrl.deselectIdentity(identity1);
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().removeIdentity.calls.count()).toBe(1);
                        setupModal(true);
                        ctrl.deselectIdentity(identity1);
                        $rootScope.$apply();
                        expect(accessRequestDataService.getAccessRequest().removeIdentity.calls.count()).toBe(2);
                    });

                    it('should call showHasRemovedAccessDialog when toggling select all', function () {
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.showHasRemovedAccessDialog).toHaveBeenCalled();
                    });

                    it('should not toggle select all if showHasRemovedAccessDialog resolves to false', function () {
                        setupModal(false);
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toEqual(false);
                        setupModal(true);
                        ctrl.toggleSelectAllIdentities();
                        $rootScope.$apply();
                        expect(ctrl.allSelected).toEqual(true);
                    });

                    it('should show warning dialog if any removed access items are selected', function () {
                        var args;
                        setupModal(true);
                        ctrl.showHasRemovedAccessDialog();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        args = spModal.open.calls.mostRecent().args;
                        expect(args[0].content).toEqual('ui_access_request_lose_removed_access_items_warning');
                    });

                    it('should not show modal if no removed access items are selected', function () {
                        accessRequestDataService.getAccessRequest().getRemovedCurrentAccessItems.and.returnValue([]);
                        spyOn(accessRequestDataService.getAccessRequest(), 'removeIdentity').and.returnValue({ failed: false });
                        ctrl.deselectIdentity(identity1);
                        $rootScope.$apply();
                        expect(spModal.open).not.toHaveBeenCalled();
                    });
                });

                describe('page state', function () {

                    beforeEach(inject(function () {
                        ctrl.selectedPageState = new PageState();
                        ctrl.pageState = new PageState();

                        /* Create different attributes on each so we can compare */
                        ctrl.selectedPageState.pagingData.itemsPerPage = 100;
                        ctrl.pageState.pagingData.itemsPerPage = 1;
                    }));

                    it('getPageState() returns default pageState', function () {
                        var pageState = ctrl.getPageState();
                        expect(pageState.pagingData.itemsPerPage).toEqual(1);
                    });

                    it('getPageState() returns selected pageState when in selected view', function () {
                        ctrl.toggleShowSelected();
                        var pageState = ctrl.getPageState();
                        expect(pageState.pagingData.itemsPerPage).toEqual(100);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdElkZW50aXRpZXNDdHJsVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLHNCQUFzQiw0QkFBNEIsVUFBVSxTQUFTO0lBQXRKOztJQUdJLElBQUkscUJBQXFCO0lBQ3pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCO1dBQ2hDLFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7Ozs7WUFBN0IsU0FBUywrQkFBK0IsWUFBVzs7Z0JBRS9DLElBQUksWUFBWSxhQUFhLGFBQWEsYUFDdEMsZUFBZSwwQkFBMEIsOEJBQThCLFdBQ3ZFLE1BQU0sV0FBVyxXQUFXLFdBQVcsY0FBYyw0QkFBNEIsVUFDakYsU0FBUywyQkFBMkIsMkJBQTJCLFNBQVMsY0FDeEU7OztnQkFJSixXQUFXLE9BQU87OztnQkFHbEIsV0FBVyxPQUFPLHFCQUFxQixVQUFTLFVBQVU7O29CQUV0RCxTQUFTLFVBQVUsaUJBQWlCLFVBQVMsV0FBVyxhQUFhLG1CQUFtQjt3QkFDcEYsSUFBSSwyQkFBMkIsVUFBVTs7d0JBRXpDLFVBQVUsaUJBQWlCLFVBQVMsS0FBSzs7NEJBRXJDLElBQUcsUUFBUSxrQkFBa0Isb0NBQW9DO2dDQUM3RCxPQUFPOzs7NEJBR1gsSUFBSSxRQUFRLGtCQUFrQiwwQ0FBMEM7Z0NBQ3BFLE9BQU87OzRCQUVYLE9BQU8seUJBQXlCLEtBQUssTUFBTTs7O3dCQUcvQyxVQUFVLHlCQUF5QixZQUFZLGlCQUFpQixPQUFPOzRCQUNuRSxRQUFROzRCQUNSLE1BQU0sRUFBQywrQkFBK0I7MkJBQ3ZDOzt3QkFFSCxVQUFVLDJCQUEyQixZQUFZLGlCQUFpQixPQUFPOzRCQUNyRSxRQUFROzRCQUNSLE1BQU07MkJBQ1A7O3dC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dEQsR0FBRyxtRUFBbUUsWUFBVzt3QkFDN0UsS0FBSzt3QkFDTCxJQUFJLFlBQVksS0FBSzt3QkFDckIsT0FBTyxVQUFVLFdBQVcsY0FBYyxRQUFROzs7Ozs7R0FkM0QiLCJmaWxlIjoiYWNjZXNzUmVxdWVzdC9BY2Nlc3NSZXF1ZXN0SWRlbnRpdGllc0N0cmxUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBhY2Nlc3NSZXF1ZXN0TW9kdWxlIGZyb20gJ2FjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdE1vZHVsZSc7XHJcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XHJcbmltcG9ydCAnLi9BY2Nlc3NSZXF1ZXN0VGVzdERhdGEnO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGZvciB0aGUgQWNjZXNzUmVxdWVzdElkZW50aXRpZXNDdHJsLlxyXG4gKi9cclxuZGVzY3JpYmUoJ0FjY2Vzc1JlcXVlc3RJZGVudGl0aWVzQ3RybCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciAkcm9vdFNjb3BlLCAkY29udHJvbGxlciwgdGVzdFNlcnZpY2UsIHN0YXRlUGFyYW1zLFxyXG4gICAgICAgIEFjY2Vzc1JlcXVlc3QsIGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgYWNjZXNzUmVxdWVzdElkZW50aXR5U2VydmljZSwgUGFnZVN0YXRlLFxyXG4gICAgICAgIGN0cmwsIGlkZW50aXR5MSwgaWRlbnRpdHkyLCBpZGVudGl0eTMsIG1pbmlJZGVudGl0eSwgYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UsIGRlZmVycmVkLFxyXG4gICAgICAgIHRpbWVvdXQsIGNoZWNrUmVtb3ZlZEFjY2Vzc1N1Y2Nlc3MsIGNoZWNrUmVtb3ZlZEFjY2Vzc1Jlc29sdmUsIHNwTW9kYWwsIHJlc29sdmVNb2RhbCxcclxuICAgICAgICBhY2Nlc3NSZXF1ZXN0VGVzdERhdGE7XHJcblxyXG5cclxuICAgIC8vIExvYWQgdGhlIHRlc3QgbW9kdWxlIHRvIGdldCB0aGUgdGVzdFNlcnZpY2UuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlKSk7XHJcblxyXG4gICAgLy8gTGV0IHRoZSB0ZXN0cyBrbm93IHdlJ2xsIHVzZSB0aGUgYWNjZXNzIHJlcXVlc3QgbW9kdWxlLlxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoYWNjZXNzUmVxdWVzdE1vZHVsZSwgZnVuY3Rpb24oJHByb3ZpZGUpIHtcclxuICAgICAgICAvKiBJbmplY3Qgc29tZSB0ZXN0IGZ1bmN0aW9ucyBpbnRvIGNvbmZpZ1NlcnZpY2UgKi9cclxuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJ2NvbmZpZ1NlcnZpY2UnLCBmdW5jdGlvbigkZGVsZWdhdGUsIHRlc3RTZXJ2aWNlLCBTUF9DT05GSUdfU0VSVklDRSkge1xyXG4gICAgICAgICAgICB2YXIgb3JpZ2luYWxHZXRDb25maWdWYWx1ZUZuID0gJGRlbGVnYXRlLmdldENvbmZpZ1ZhbHVlO1xyXG5cclxuICAgICAgICAgICAgJGRlbGVnYXRlLmdldENvbmZpZ1ZhbHVlID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAvKiBGYWtlIG1heCByZXF1ZXN0YWJsZSBpZGVudGl0aWVzIGRvd24gdG8gYSBtYW5hZ2FibGUgbnVtYmVyICovXHJcbiAgICAgICAgICAgICAgICBpZihrZXkgPT09IFNQX0NPTkZJR19TRVJWSUNFLkFDQ0VTU19SRVFVRVNUX01BWF9JREVOVElUWV9TRUxFQ1QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8qIE1vY2sgb3V0IHRoZSBydW5Jbml0aWFsTG9hZCB2YWx1ZSAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gU1BfQ09ORklHX1NFUlZJQ0UuRElTQUJMRV9JTklUSUFMX0FDQ0VTU19SRVFVRVNUX0dSSURfTE9BRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEdldENvbmZpZ1ZhbHVlRm4uY2FsbCh0aGlzLCBrZXkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJGRlbGVnYXRlLmdldENvbHVtbkNvbmZpZ0VudHJpZXMgPSB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsndWlSZXF1ZXN0QWNjZXNzSWRlbnRpdHlDYXJkJzoge319XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuXHJcbiAgICAgICAgICAgICRkZWxlZ2F0ZS5nZXRJZGVudGl0eURldGFpbHNDb25maWcgPSB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkZGVsZWdhdGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXHJcbiAgICAgKi9cclxuICAgIC8qIGpzaGludCBtYXhwYXJhbXMgOiAxNCAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX0FjY2Vzc1JlcXVlc3RfLCBfYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlXywgX2FjY2Vzc1JlcXVlc3RJZGVudGl0eVNlcnZpY2VfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSWRlbnRpdHksIF9QYWdlU3RhdGVfLCBfdGVzdFNlcnZpY2VfLCBfJGNvbnRyb2xsZXJfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXyRyb290U2NvcGVfLCBfYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2VfLCAkcSwgY29uZmlnU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0LCAkc3RhdGVQYXJhbXMsIF9hY2Nlc3NSZXF1ZXN0VGVzdERhdGFfKSB7XHJcblxyXG4gICAgICAgIC8vIFNhdmUgdGhlIHNlcnZpY2VzLlxyXG4gICAgICAgIEFjY2Vzc1JlcXVlc3QgPSBfQWNjZXNzUmVxdWVzdF87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlID0gX2FjY2Vzc1JlcXVlc3REYXRhU2VydmljZV87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdElkZW50aXR5U2VydmljZSA9IF9hY2Nlc3NSZXF1ZXN0SWRlbnRpdHlTZXJ2aWNlXztcclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xyXG4gICAgICAgIFBhZ2VTdGF0ZSA9IF9QYWdlU3RhdGVfO1xyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UgPSBfYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2VfO1xyXG4gICAgICAgIHRpbWVvdXQgPSAkdGltZW91dDtcclxuICAgICAgICBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEgPSBfYWNjZXNzUmVxdWVzdFRlc3REYXRhXztcclxuICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdEZpbHRlclNlcnZpY2UsICdnZXRJZGVudGl0eUZpbHRlcnMnKS5hbmQucmV0dXJuVmFsdWUoZGVmZXJyZWQucHJvbWlzZSk7XHJcbiAgICAgICAgc3B5T24oX2FjY2Vzc1JlcXVlc3REYXRhU2VydmljZV8sICdnZXRRdWlja0xpbmtOYW1lJykuYW5kLnJldHVyblZhbHVlKCdSZXF1ZXN0IEFjY2VzcycpO1xyXG5cclxuICAgICAgICBzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGFuIGlkZW50aXR5IHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICBpZGVudGl0eTEgPSBuZXcgSWRlbnRpdHkoYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZMSk7XHJcbiAgICAgICAgaWRlbnRpdHkyID0gbmV3IElkZW50aXR5KGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWTIpO1xyXG4gICAgICAgIGlkZW50aXR5MyA9IG5ldyBJZGVudGl0eShhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFkzKTtcclxuICAgICAgICBtaW5pSWRlbnRpdHkgPSBuZXcgSWRlbnRpdHkoeydpZCc6ICcyYzkwOGNhZTQ4NmE0YmE2MDE0ODZhNGQ5YmE5MDQyMycsJ25hbWUnOiAndnBvZGVzdGEnfSk7XHJcblxyXG4gICAgICAgIC8vIE1vY2sgb3V0IHRoZSBpZGVudGl0eSBzZXJ2aWNlIHRvIHJldHVybiBhIHNpbmdsZSBpZGVudGl0eS5cclxuICAgICAgICBhY2Nlc3NSZXF1ZXN0SWRlbnRpdHlTZXJ2aWNlLmdldElkZW50aXRpZXMgPVxyXG4gICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBbIGlkZW50aXR5MSBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuXHJcbiAgICAgICAgLy8gTW9jayBvdXQgdGhlIGdldEFsbElkZW50aXRpZXMgY2FsbFxyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RJZGVudGl0eVNlcnZpY2UuZ2V0QWxsSWRlbnRpdGllcyA9XHJcbiAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHM6IFttaW5pSWRlbnRpdHldXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb250cm9sbGVyIHRvIHRlc3Qgd2l0aC5cclxuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0FjY2Vzc1JlcXVlc3RJZGVudGl0aWVzQ3RybCcsIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdElkZW50aXR5U2VydmljZTogYWNjZXNzUmVxdWVzdElkZW50aXR5U2VydmljZSxcclxuICAgICAgICAgICAgY29uZmlnU2VydmljZTogY29uZmlnU2VydmljZSxcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlOiBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3B5T24oY3RybCwgJ3Nob3dIYXNSZW1vdmVkQWNjZXNzRGlhbG9nJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGlmKGNoZWNrUmVtb3ZlZEFjY2Vzc1Jlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGVmZXJyZWQucmVzb2x2ZShjaGVja1JlbW92ZWRBY2Nlc3NTdWNjZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGVmZXJyZWQucmVqZWN0KGNoZWNrUmVtb3ZlZEFjY2Vzc1N1Y2Nlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja0RlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2hlY2tSZW1vdmVkQWNjZXNzU3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgY2hlY2tSZW1vdmVkQWNjZXNzUmVzb2x2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIFJ1biBhIGRpZ2VzdCBjeWNsZSB0byByZXNvbHZlIHRoZSBwcm9taXNlLlxyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9KSk7XHJcblxyXG5cclxuICAgIGl0KCdmZXRjaGVzIGlkZW50aXRpZXMgd2hlbiBsb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBUaGUgc3RhcnQgYW5kIGxpbWl0IGFyZSBoYXJkLWNvZGVkLlxyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SWRlbnRpdHlTZXJ2aWNlLmdldElkZW50aXRpZXMpLlxyXG4gICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aCh1bmRlZmluZWQsIHt9LCAwLCAxMiwgJ1JlcXVlc3QgQWNjZXNzJyk7XHJcbiAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RJZGVudGl0eVNlcnZpY2UuZ2V0QWxsSWRlbnRpdGllcykudG9IYXZlQmVlbkNhbGxlZFdpdGgodW5kZWZpbmVkLCB7fSwgJ1JlcXVlc3QgQWNjZXNzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnYWRkcyBpZGVudGl0aWVzIHdoZW4gc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnYWRkSWRlbnRpdHknKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGlkZW50aXR5MSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmVtb3ZlcyBpZGVudGl0aWVzIHdoZW4gZGVzZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdyZW1vdmVJZGVudGl0eScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICBjdHJsLmRlc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLnJlbW92ZUlkZW50aXR5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpZGVudGl0eTEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Jlc2V0cyBtYW5hZ2UgYWNjZXNzIHBhZ2luZyB3aGVuIHNlbGVjdGluZyBvciBkZXNlbGVjdGluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZSwgJ3Jlc2V0TWFuYWdlQWNjZXNzUGFnaW5nJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2FkZElkZW50aXR5JykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdyZW1vdmVJZGVudGl0eScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLnJlc2V0TWFuYWdlQWNjZXNzUGFnaW5nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgY3RybC5kZXNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLnJlc2V0TWFuYWdlQWNjZXNzUGFnaW5nLmNhbGxzLmNvdW50KCkpLnRvQmUoMik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnZG9lcyBub3QgcmVzZXQgbWFuYWdlIGFjY2VzcyBwYWdpbmcgaWYgbm90aGluZyBpcyBzZWxlY3RlZCBvciBkZXNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLCAncmVzZXRNYW5hZ2VBY2Nlc3NQYWdpbmcnKTtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnYWRkSWRlbnRpdHknKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICBmYWlsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGVycm9yczogW0FjY2Vzc1JlcXVlc3QuRVJST1JTLkhBU19SRU1PVkVEX0FDQ0VTU11cclxuICAgICAgICB9KTtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAncmVtb3ZlSWRlbnRpdHknKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICBmYWlsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGVycm9yczogW0FjY2Vzc1JlcXVlc3QuRVJST1JTLkhBU19SRU1PVkVEX0FDQ0VTU11cclxuICAgICAgICB9KTtcclxuICAgICAgICBjaGVja1JlbW92ZWRBY2Nlc3NSZXNvbHZlID0gZmFsc2U7XHJcbiAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5yZXNldE1hbmFnZUFjY2Vzc1BhZ2luZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBjdHJsLmRlc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UucmVzZXRNYW5hZ2VBY2Nlc3NQYWdpbmcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgdGVzdElkZW50aXR5U2VsZWN0aW9uID0gZnVuY3Rpb24oaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIHZhciBzZWxlY3RlZDtcclxuICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnaGFzSWRlbnRpdHknKS5hbmQucmV0dXJuVmFsdWUoaXNTZWxlY3RlZCk7XHJcbiAgICAgICAgc2VsZWN0ZWQgPSBjdHJsLmlzSWRlbnRpdHlTZWxlY3RlZChpZGVudGl0eTEpO1xyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmhhc0lkZW50aXR5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpZGVudGl0eTEpO1xyXG4gICAgICAgIGV4cGVjdChzZWxlY3RlZCkudG9FcXVhbChpc1NlbGVjdGVkKTtcclxuICAgIH07XHJcblxyXG4gICAgaXQoJ3NheXMgdGhhdCBhbiBpZGVudGl0eSBpcyBzZWxlY3RlZCBpZiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRlc3RJZGVudGl0eVNlbGVjdGlvbih0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzYXlzIHRoYXQgYW4gaWRlbnRpdHkgaXMgbm90IHNlbGVjdGVkIGlmIG5vdCBhZGRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRlc3RJZGVudGl0eVNlbGVjdGlvbihmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgc2VsZWN0ZWQgaWRlbnRpdGllcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpZGVudGl0aWVzO1xyXG4gICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRJZGVudGl0aWVzJykuYW5kLnJldHVyblZhbHVlKFsgaWRlbnRpdHkxIF0pO1xyXG4gICAgICAgIGlkZW50aXRpZXMgPSBjdHJsLmdldFNlbGVjdGVkSWRlbnRpdGllcygpO1xyXG4gICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmdldElkZW50aXRpZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgZXhwZWN0KGlkZW50aXRpZXNbMF0pLnRvRXF1YWwoaWRlbnRpdHkxKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc0lkZW50aXR5RGlzYWJsZWQoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGJ1bGsgaWRlbnRpdHkgcmVxdWVzdHMgYXJlIGFsbG93ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gQWRkIGFuIGlkZW50aXR5IHNvIHRoYXQgdGhpcyB3b3VsZCBvdGhlcndpc2UgcmV0dXJuIHRydWUgaWYgYnVsayB3ZXJlIGRpc2FibGVkLlxyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzSWRlbnRpdHlEaXNhYmxlZChpZGVudGl0eTIpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3doZW4gYnVsayByZXF1ZXN0IGlzIGRpc2FibGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2Uuc2V0QWxsb3dCdWxrUmVxdWVzdChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbm8gaWRlbnRpdHkgaXMgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzSWRlbnRpdHlEaXNhYmxlZChpZGVudGl0eTEpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGUgc2FtZSBpZGVudGl0eSBpcyBzZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNJZGVudGl0eURpc2FibGVkKGlkZW50aXR5MSkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgYSBkaWZmZXJlbnQgaWRlbnRpdHkgaXMgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzSWRlbnRpdHlEaXNhYmxlZChpZGVudGl0eTIpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdhbGxvdyBidWxrIGlkZW50aXR5IHJlcXVlc3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2lzIHRydWUgaWYgY29uZmlndXJhdGlvbiBub3QgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxvd0J1bGtJZGVudGl0eVJlcXVlc3QoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGNvbmZpZ3VyZWQgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLnNldEFsbG93QnVsa1JlcXVlc3QoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxvd0J1bGtJZGVudGl0eVJlcXVlc3QoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgndW5zdXBwb3J0ZWQgaWRlbnRpdHkgb3BlcmF0aW9uIGVycm9ycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBmYWlsZWRSZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgZmFpbGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBlcnJvcnM6IFsndW5zdXBwb3J0ZWRFcnJvciddXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBTcHkoZnVuY3Rpb25Ub1NweU9uKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksIGZ1bmN0aW9uVG9TcHlPbikuYW5kLnJldHVyblZhbHVlKGZhaWxlZFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgYWRkaW5nIGlkZW50aXR5IGZhaWxzIHdpdGggdW5zdXBwb3J0ZWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXBTcHkoJ2FkZElkZW50aXR5Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGlmIHJlbW92aW5nIGlkZW50aXR5IGZhaWxzIHdpdGggdW5zdXBwb3J0ZWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXBTcHkoJ3JlbW92ZUlkZW50aXR5Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuZGVzZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgdG9nZ2xpbmcgYWxsIGlkZW50aXRpZXMgZmFpbHMgd2l0aCB1bnN1cHBvcnRlZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cFNweSgnYWRkSWRlbnRpdGllcycpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIGFsbElkZW50aXRpZXMgYW5kIGNvdW50IGluIHRoZSBjb250cm9sbGVyIHRvIHRoZSBnaXZlbiBsaXN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXR1cEFsbElkZW50aXRpZXMoaWRlbnRpdGllcykge1xyXG4gICAgICAgIGN0cmwuYWxsSWRlbnRpdGllcyA9IGlkZW50aXRpZXM7XHJcbiAgICAgICAgY3RybC5hbGxJZGVudGl0aWVzQ291bnQgPSBpZGVudGl0aWVzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3QgdG8gbWFrZSBzdXJlIHN0YXRlIHBhcmFtcyB3b3JrXHJcbiAgICAgKi9cclxuICAgIGRlc2NyaWJlKCdzdGF0ZVBhcmFtcy5zZWxlY3RlZFZpZXcgc2hvdWxkIGVuYWJsZSB0aGUgc2VsZWN0ZWQgdmlldycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvLyBzZXR1cCBzdGF0ZVBhcmFtcy5zZWxlY3RlZFZpZXcgdG8gYmUgdHJ1ZVxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xyXG4gICAgICAgICAgICAkc3RhdGVQYXJhbXMuc2VsZWN0ZWRWaWV3ID0gdHJ1ZTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIC8vIHNldCBpdCBiYWNrXHJcbiAgICAgICAgYWZ0ZXJFYWNoKGluamVjdChmdW5jdGlvbigkc3RhdGVQYXJhbXMpIHtcclxuICAgICAgICAgICAgJHN0YXRlUGFyYW1zLnNlbGVjdGVkVmlldyA9IGZhbHNlO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoU2VsZWN0ZWRJZGVudGl0aWVzIHdoZW4gc3RhdGVQYXJhbXMgc2VsZWN0ZWRWaWV3IGlzIGVuYWJsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2ZldGNoU2VsZWN0ZWRJZGVudGl0aWVzJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdkb1NlYXJjaCcpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG5cclxuICAgICAgICAgICAgY3RybC5pbml0aWFsaXplKCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5mZXRjaFNlbGVjdGVkSWRlbnRpdGllcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5kb1NlYXJjaCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNlbGVjdGVkRGlzcGxheWVkKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3cgdG9vIG11Y2ggc2VsZWN0ZWQgZGlhbG9nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNwTW9kYWw7XHJcblxyXG4gICAgICAgIC8vIFNldHVwIHRoZSBkZXBlbmRlbmNpZXMuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3NwTW9kYWxfLCBfJHFfLCBfQWNjZXNzUmVxdWVzdF8pIHtcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgc2V0dXBNb2RhbE1vY2soX3NwTW9kYWxfLCBfJHFfKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBwcm9tcHQgd2hlbiBtYXggaWRlbnRpdGllcyBub3QgcmVhY2hlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5Mik7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIHByb21wdCB3aGVuIG1heCBpZGVudGl0aWVzIHJlYWNoZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5Mik7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkzKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgcHJvbXB0IHdoZW4gc2VsZWN0IGFsbCBub3QgdG9vIG11Y2ggaGFwcGVucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cEFsbElkZW50aXRpZXMoW2lkZW50aXR5MSwgaWRlbnRpdHkyXSk7XHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBwcm9tcHQgd2hlbiBzZWxlY3QgYWxsIHRvbyBtdWNoIGlkZW50aXRpZXMgaGFwcGVucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cEFsbElkZW50aXRpZXMoW2lkZW50aXR5MSwgaWRlbnRpdHkyLCBpZGVudGl0eTNdKTtcclxuICAgICAgICAgICAgY3RybC50b2dnbGVTZWxlY3RBbGxJZGVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBwcm9tcHQgd2hlbiBjdXJyZW50IHNlbGVjdGVkIGl0ZW1zIGFuZCBzZWFyY2ggcmVzdWx0IGNvdW50IGV4Y2VlZCBtYXggYWxsb3dhYmxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5hY2Nlc3NSZXF1ZXN0LCAnZ2V0SWRlbnRpdGllcycpLmFuZC5yZXR1cm5WYWx1ZShbe31dKTtcclxuICAgICAgICAgICAgc3B5T24oY3RybC5nZXRQYWdlU3RhdGUoKS5wYWdpbmdEYXRhLCAnZ2V0VG90YWwnKS5hbmQucmV0dXJuVmFsdWUoMik7XHJcbiAgICAgICAgICAgIHNldHVwQWxsSWRlbnRpdGllcyhbaWRlbnRpdHkxLCBpZGVudGl0eTJdKTtcclxuICAgICAgICAgICAgY3RybC50b2dnbGVTZWxlY3RBbGxJZGVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdCB0byBzZWUgaWYgbW9kYWwgb3BlbnMgd2l0aCBJZGVudGl0eURldGFpbERpYWxvZ0N0cmxcclxuICAgICAqL1xyXG4gICAgZGVzY3JpYmUoJ3Nob3cgaWRlbnRpdHkgZGV0YWlsIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBJZGVudGl0eSwgc3BNb2RhbDtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX0lkZW50aXR5XywgX3NwTW9kYWxfKSB7XHJcbiAgICAgICAgICAgIElkZW50aXR5ID0gX0lkZW50aXR5XztcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1ha2Ugc3VyZSB0aGF0IGFuIGlkZW50aXR5IGlzIHJlcXVpcmVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGl0KCdleHBsb2RlcyBpZiBubyBpZGVudGl0eSBpcyBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjdHJsLmdldElkZW50aXR5RGV0YWlscyhudWxsKTsgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYWtlIHN1cmUgc2hvd0lkZW50aXR5RGV0YWlscygpIG1ldGhvZCBvcGVucyB0aGUgbW9kYWwgd2l0aCB0aGUgY29ycmVjdCBJZGVudGl0eURldGFpbERpYWxvZ0NvbnRyb2xsZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBpdCgnb3BlbnMgdGhlIG1vZGFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBpZGVudGl0eSA9IG5ldyBJZGVudGl0eShhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFkxKTtcclxuICAgICAgICAgICAgY3RybC5zaG93SWRlbnRpdHlEZXRhaWxzKGlkZW50aXR5KTtcclxuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uY29udHJvbGxlcikuXHJcbiAgICAgICAgICAgICAgICAgICAgdG9FcXVhbCgnSWRlbnRpdHlEZXRhaWxEaWFsb2dDdHJsIGFzIGRpYWxvZ0N0cmwnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaWRlbnRpdHkgc2VsZWN0aW9uJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cEFsbElkZW50aXRpZXMoW2lkZW50aXR5MV0pO1xyXG5cclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdElkZW50aXR5U2VydmljZS5nZXRTZWxlY3RlZElkZW50aXRpZXMgPSB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBbIGlkZW50aXR5MSBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCd0aHJvd3MgaWYgYnVsayBpZGVudGl0eSByZXF1ZXN0cyBhcmUgbm90IGVuYWJsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLnNldEFsbG93QnVsa1JlcXVlc3QoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzZXRzIGFsbCBzZWxlY3RlZC91bnNlbGVjdGVkIHdoZW4gdG9nZ2xlIGlzIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVGYWxzeSgpO1xyXG5cclxuICAgICAgICAgICAgY3RybC50b2dnbGVTZWxlY3RBbGxJZGVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFsbFNlbGVjdGVkKS50b0JlVHJ1dGh5KCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZGVzZWxlY3QgdW5zZWxlY3RzIGFsbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZUZhbHN5KCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVUcnV0aHkoKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwuZGVzZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZUZhbHN5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzZWxlY3Qgc2VsZWN0cyBhbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVGYWxzeSgpO1xyXG5cclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVzZXRzIG1hbmFnZSBhY2Nlc3MgcGFnaW5nIHdoZW4gc2VsZWN0aW5nIG9yIGRlc2VsZWN0aW5nIGFsbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UsICdyZXNldE1hbmFnZUFjY2Vzc1BhZ2luZycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5yZXNldE1hbmFnZUFjY2Vzc1BhZ2luZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5yZXNldE1hbmFnZUFjY2Vzc1BhZ2luZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2VsZWN0IHdpdGggbXVsdGlwbGUgaWRlbnRpdGllcyBzZXRzIHNlbGVjdCBhbGwgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNldHVwQWxsSWRlbnRpdGllcyhbaWRlbnRpdHkxLCBpZGVudGl0eTJdKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVGYWxzeSgpO1xyXG5cclxuICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZUZhbHN5KCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5Mik7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFsbFNlbGVjdGVkKS50b0JlVHJ1dGh5KCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLmRlc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkyKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndW5zZWxlY3RzIGFsbCB3aGVuIHNlYXJjaGluZyByZXR1cm5zIG1vcmUgdGhhbiB0aGUgc2VsZWN0ZWQgdXNlcnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gU3RhcnQgc2hvd2luZyAxIG9mIDIgaWRlbnRpdGllcyAtIHRoaXMgaXMgdGhlIGRlZmF1bHQgc2V0dXAuXHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLml0ZW1zLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsSWRlbnRpdGllcy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFsbFNlbGVjdGVkKS50b0JlRmFsc3koKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNlbGVjdCBhbGwgYW5kIHZlcmlmeSB0aGF0IGFsbFNlbGVjdGVkIGlzIHRydWUuXHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZVRydXRoeSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2VhcmNoIGFnYWluIHJldHVybmluZyAyIG9mIDIgaWRlbnRpdGllcyAtIGlkZW50aXR5MiBzaG91bGRuJ3RcclxuICAgICAgICAgICAgLy8gYmUgc2VsZWN0ZWQgYWZ0ZXIgdGhpcy5cclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdElkZW50aXR5U2VydmljZS5nZXRBbGxJZGVudGl0aWVzID1cclxuICAgICAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBbIGlkZW50aXR5MSwgaWRlbnRpdHkyIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3RJZGVudGl0eVNlcnZpY2UuZ2V0SWRlbnRpdGllcyA9XHJcbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0czogWyBpZGVudGl0eTEsIGlkZW50aXR5MiBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgICAgICBjdHJsLnNlYXJjaCgpO1xyXG4gICAgICAgICAgICB0aW1lb3V0LmZsdXNoKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBWZXJpZnkgdGhhdCBhbGxTZWxlY3RlZCBpcyBmYWxzZS5cclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsU2VsZWN0ZWQpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndG9nZ2xlIHNob3cgc2VsZWN0ZWQgdG9nZ2xlcyBzZWxlY3RlZERpc3BsYXllZCBmbGFnJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNlbGVjdGVkRGlzcGxheWVkKS50b0JlRmFsc3koKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2hvd1NlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNlbGVjdGVkRGlzcGxheWVkKS50b0JlVHJ1dGh5KCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNob3dTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zZWxlY3RlZERpc3BsYXllZCkudG9CZUZhbHN5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdmZXRjaCBpdGVtcyBjYWxscyBmZXRjaFNlbGVjdGVkSWRlbnRpdGllcyB3aGVuIGluIHNlbGVjdGVkIHZpZXcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2VsZWN0ZWREaXNwbGF5ZWQpLnRvQmVGYWxzeSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2VsZWN0IHNvbWUgaWRlbnRpdGllc1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB0b2dnbGUgc2hvdyBzZWxlY3RlZCB0byBzaG93IHNlbGVjdGVkXHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2hvd1NlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNlbGVjdGVkRGlzcGxheWVkKS50b0JlVHJ1dGh5KCk7XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnZmV0Y2hTZWxlY3RlZElkZW50aXRpZXMnKTtcclxuICAgICAgICAgICAgY3RybC5mZXRjaEl0ZW1zKCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5mZXRjaFNlbGVjdGVkSWRlbnRpdGllcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnYmFja3VwSWRlbnRpdGllcyBzaG91bGQgYmUgc2V0IHdoZW4gaW4gc2VsZWN0ZWQgdmlldycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBzZWxlY3Qgc29tZSBpZGVudGl0aWVzXHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2hvd1NlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNlbGVjdGVkRGlzcGxheWVkKS50b0JlVHJ1dGh5KCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5iYWNrdXBTZWxlY3RlZElkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNob3dTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5Mik7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2hvd1NlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmJhY2t1cFNlbGVjdGVkSWRlbnRpdGllcy5sZW5ndGgpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCd0b2dnbGVTZWxlY3RBbGwgc2hvdWxkIGNhbGwgYWRkSWRlbnRpdGllcy9yZW1vdmVBbGxJZGVudGl0aWVzIHdoZW4gaW4gc2VsZWN0ZWQgdmlldycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnYWRkSWRlbnRpdGllcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAncmVtb3ZlQWxsSWRlbnRpdGllcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2VsZWN0IHNvbWUgaWRlbnRpdGllc1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNob3dTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zZWxlY3RlZERpc3BsYXllZCkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkucmVtb3ZlQWxsSWRlbnRpdGllcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdGllcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9CZVRydXRoeSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgdGhlIHNwTW9kYWwgbW9jayB0byBlaXRoZXIgcmVzb2x2ZSBvciByZWplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXNvbHZlICBUcnVlIGlmIHRoZSBtb2RhbCBzaG91bGQgcmVzb2x2ZSwgZmFsc2UgdG8gcmVqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXR1cE1vZGFsKHJlc29sdmUpIHtcclxuICAgICAgICByZXNvbHZlTW9kYWwgPSByZXNvbHZlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgY2FsbHMgdG8gc3BNb2RhbC5vcGVuKCkgdG8gbW9jayB0aGUgcmVzcG9uc2UuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldHVwTW9kYWxNb2NrKF9zcE1vZGFsXywgJHEpIHtcclxuICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xyXG4gICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc29sdmVNb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IGRlZmVycmVkLnByb21pc2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgncHJldmVudCBhZGRpbmcgaWRlbnRpdGllcyBpZiByb2xlIGlzIGluIGNhcnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcm9sZVJlcXVlc3RlZEl0ZW0sIGVudGl0bGVtZW50UmVxdWVzdGVkSXRlbTtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3NwTW9kYWxfLCAkcSwgQWNjZXNzUmVxdWVzdEl0ZW0sIFJlcXVlc3RlZEFjY2Vzc0l0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIHJvbGUgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEUpLFxyXG4gICAgICAgICAgICAgICAgZW50aXRsZW1lbnQgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLkVOVElUTEVNRU5UKTtcclxuXHJcbiAgICAgICAgICAgIHNldHVwTW9kYWxNb2NrKF9zcE1vZGFsXywgJHEpO1xyXG5cclxuICAgICAgICAgICAgcm9sZVJlcXVlc3RlZEl0ZW0gPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShyb2xlKTtcclxuICAgICAgICAgICAgZW50aXRsZW1lbnRSZXF1ZXN0ZWRJdGVtID0gbmV3IFJlcXVlc3RlZEFjY2Vzc0l0ZW0oZW50aXRsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2FkZElkZW50aXR5JykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdhZGRJZGVudGl0aWVzJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnc2VsZWN0SWRlbnRpdHkoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnYWRkcyBpZGVudGl0eSBpZiBjYXJ0IGhhcyBubyBpdGVtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZElkZW50aXR5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdhZGRzIGlkZW50aXR5IGlmIGNhcnQgaGFzIG5vIHJvbGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UmVxdWVzdGVkSXRlbXMnKS5cclxuICAgICAgICAgICAgICAgICAgICBhbmQucmV0dXJuVmFsdWUoWyBlbnRpdGxlbWVudFJlcXVlc3RlZEl0ZW0gXSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3Nob3dzIG1vZGFsIGlmIGNhcnQgaGFzIHJvbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcmdzO1xyXG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlcXVlc3RlZEl0ZW1zJykuXHJcbiAgICAgICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsgcm9sZVJlcXVlc3RlZEl0ZW0gXSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgYXJncyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJncztcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhcmdzWzBdLmNvbnRlbnQpLnRvRXF1YWwoJ3VpX2FjY2Vzc19yZXF1ZXN0X2xvc2VfcmVxdWVzdGVkX3JvbGVzX3dhcm5pbmcnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgYWRkIGlkZW50aXR5IGlmIFwibm9cIiBpcyBzZWxlY3RlZCBpbiBkaWFsb2cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShbIHJvbGVSZXF1ZXN0ZWRJdGVtIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNldHVwTW9kYWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnYWRkcyBpZGVudGl0eSBpZiBcInllc1wiIGlzIHNlbGVjdGVkIGluIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlcXVlc3RlZEl0ZW1zJykuXHJcbiAgICAgICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsgcm9sZVJlcXVlc3RlZEl0ZW0gXSk7XHJcbiAgICAgICAgICAgICAgICBzZXR1cE1vZGFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRJZGVudGl0eSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd0b2dnbGVTZWxlY3RBbGxJZGVudGl0aWVzKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tBbGxJZGVudGl0aWVzQWRkZWQoKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5hZGRJZGVudGl0aWVzKS5cclxuICAgICAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChjdHJsLmFsbElkZW50aXRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgnYWRkcyBhbGwgaWRlbnRpdGllcyBpZiBjYXJ0IGhhcyBubyBpdGVtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVTZWxlY3RBbGxJZGVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tBbGxJZGVudGl0aWVzQWRkZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnYWRkcyBhbGwgaWRlbnRpdGllcyBpZiBjYXJ0IGhhcyBubyByb2xlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlcXVlc3RlZEl0ZW1zJykuXHJcbiAgICAgICAgICAgICAgICAgICAgYW5kLnJldHVyblZhbHVlKFsgZW50aXRsZW1lbnRSZXF1ZXN0ZWRJdGVtIF0pO1xyXG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVTZWxlY3RBbGxJZGVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tBbGxJZGVudGl0aWVzQWRkZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2hvd3MgbW9kYWwgaWYgY2FydCBoYXMgcm9sZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnZ2V0UmVxdWVzdGVkSXRlbXMnKS5cclxuICAgICAgICAgICAgICAgICAgICBhbmQucmV0dXJuVmFsdWUoWyByb2xlUmVxdWVzdGVkSXRlbSBdKTtcclxuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGFyZ3MgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYXJnc1swXS5jb250ZW50KS50b0VxdWFsKCd1aV9hY2Nlc3NfcmVxdWVzdF9sb3NlX3JlcXVlc3RlZF9yb2xlc193YXJuaW5nJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGFkZCBpZGVudGl0aWVzIGlmIFwibm9cIiBpcyBzZWxlY3RlZCBpbiBkaWFsb2cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShbIHJvbGVSZXF1ZXN0ZWRJdGVtIF0pO1xyXG4gICAgICAgICAgICAgICAgc2V0dXBNb2RhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZElkZW50aXRpZXMuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdGllcy5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdhZGRzIGlkZW50aXRpZXMgaWYgXCJ5ZXNcIiBpcyBzZWxlY3RlZCBpbiBkaWFsb2cnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdnZXRSZXF1ZXN0ZWRJdGVtcycpLlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShbIHJvbGVSZXF1ZXN0ZWRJdGVtIF0pO1xyXG4gICAgICAgICAgICAgICAgc2V0dXBNb2RhbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBjaGVja0FsbElkZW50aXRpZXNBZGRlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdjaGVjayByZW1vdmVkIGFjY2VzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIFNldHVwIHRoZSBkZXBlbmRlbmNpZXMuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3NwTW9kYWxfLCAkcSkge1xyXG4gICAgICAgICAgICBzZXR1cE1vZGFsTW9jayhfc3BNb2RhbF8sICRxKTtcclxuICAgICAgICAgICAgY3RybC5zaG93SGFzUmVtb3ZlZEFjY2Vzc0RpYWxvZy5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKSwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5cclxuICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShbeyBpZDogJ3doYXRldmVyJ31dKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBzaG93SGFzUmVtb3ZlZEFjY2Vzc0RpYWxvZyB3aGVuIHNlbGVjdGluZyBpZGVudGl0eScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNob3dIYXNSZW1vdmVkQWNjZXNzRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IHNlbGVjdCBpZGVudGl0eSBpZiBzaG93SGFzUmVtb3ZlZEFjY2Vzc0RpYWxvZyByZXNvbHZlcyB0byBmYWxzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLCAnYWRkSWRlbnRpdHknKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHNldHVwTW9kYWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0RGF0YVNlcnZpY2UuZ2V0QWNjZXNzUmVxdWVzdCgpLmFkZElkZW50aXR5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIHNldHVwTW9kYWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkuYWRkSWRlbnRpdHkuY2FsbHMuY291bnQoKSkudG9CZSgyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHNob3dIYXNSZW1vdmVkQWNjZXNzRGlhbG9nIHdoZW4gZGVzZWxlY3RpbmcgaWRlbnRpdHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3RybC5kZXNlbGVjdElkZW50aXR5KGlkZW50aXR5MSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNob3dIYXNSZW1vdmVkQWNjZXNzRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGRlc2VsZWN0IGlkZW50aXR5IGlmIHNob3dIYXNSZW1vdmVkQWNjZXNzRGlhbG9nIHJlc29sdmVzIHRvIGZhbHNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdyZW1vdmVJZGVudGl0eScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgc2V0dXBNb2RhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGN0cmwuZGVzZWxlY3RJZGVudGl0eShpZGVudGl0eTEpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5yZW1vdmVJZGVudGl0eS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBzZXR1cE1vZGFsKHRydWUpO1xyXG4gICAgICAgICAgICBjdHJsLmRlc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCkucmVtb3ZlSWRlbnRpdHkuY2FsbHMuY291bnQoKSkudG9CZSgyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHNob3dIYXNSZW1vdmVkQWNjZXNzRGlhbG9nIHdoZW4gdG9nZ2xpbmcgc2VsZWN0IGFsbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnRvZ2dsZVNlbGVjdEFsbElkZW50aXRpZXMoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2hvd0hhc1JlbW92ZWRBY2Nlc3NEaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgdG9nZ2xlIHNlbGVjdCBhbGwgaWYgc2hvd0hhc1JlbW92ZWRBY2Nlc3NEaWFsb2cgcmVzb2x2ZXMgdG8gZmFsc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXBNb2RhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIHNldHVwTW9kYWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2VsZWN0QWxsSWRlbnRpdGllcygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5hbGxTZWxlY3RlZCkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgZGlhbG9nIGlmIGFueSByZW1vdmVkIGFjY2VzcyBpdGVtcyBhcmUgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3M7XHJcbiAgICAgICAgICAgIHNldHVwTW9kYWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGN0cmwuc2hvd0hhc1JlbW92ZWRBY2Nlc3NEaWFsb2coKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBhcmdzID0gc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJnc1swXS5jb250ZW50KS50b0VxdWFsKCd1aV9hY2Nlc3NfcmVxdWVzdF9sb3NlX3JlbW92ZWRfYWNjZXNzX2l0ZW1zX3dhcm5pbmcnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBtb2RhbCBpZiBubyByZW1vdmVkIGFjY2VzcyBpdGVtcyBhcmUgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdERhdGFTZXJ2aWNlLmdldEFjY2Vzc1JlcXVlc3QoKS5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zLmFuZC5yZXR1cm5WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3REYXRhU2VydmljZS5nZXRBY2Nlc3NSZXF1ZXN0KCksICdyZW1vdmVJZGVudGl0eScpLmFuZC5yZXR1cm5WYWx1ZSh7ZmFpbGVkOiBmYWxzZX0pO1xyXG4gICAgICAgICAgICBjdHJsLmRlc2VsZWN0SWRlbnRpdHkoaWRlbnRpdHkxKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdwYWdlIHN0YXRlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsLnNlbGVjdGVkUGFnZVN0YXRlID0gbmV3IFBhZ2VTdGF0ZSgpO1xyXG4gICAgICAgICAgICBjdHJsLnBhZ2VTdGF0ZSA9IG5ldyBQYWdlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIC8qIENyZWF0ZSBkaWZmZXJlbnQgYXR0cmlidXRlcyBvbiBlYWNoIHNvIHdlIGNhbiBjb21wYXJlICovXHJcbiAgICAgICAgICAgIGN0cmwuc2VsZWN0ZWRQYWdlU3RhdGUucGFnaW5nRGF0YS5pdGVtc1BlclBhZ2UgPSAxMDA7XHJcbiAgICAgICAgICAgIGN0cmwucGFnZVN0YXRlLnBhZ2luZ0RhdGEuaXRlbXNQZXJQYWdlID0gMTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdnZXRQYWdlU3RhdGUoKSByZXR1cm5zIGRlZmF1bHQgcGFnZVN0YXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlU3RhdGUgPSBjdHJsLmdldFBhZ2VTdGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QocGFnZVN0YXRlLnBhZ2luZ0RhdGEuaXRlbXNQZXJQYWdlKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ2V0UGFnZVN0YXRlKCkgcmV0dXJucyBzZWxlY3RlZCBwYWdlU3RhdGUgd2hlbiBpbiBzZWxlY3RlZCB2aWV3JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlU2hvd1NlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgIHZhciBwYWdlU3RhdGUgPSBjdHJsLmdldFBhZ2VTdGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QocGFnZVN0YXRlLnBhZ2luZ0RhdGEuaXRlbXNQZXJQYWdlKS50b0VxdWFsKDEwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
