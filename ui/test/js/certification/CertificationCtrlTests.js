System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/TestModule'], function (_export) {
    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('CertificationCtrl', function () {

                var $stateParams = undefined,
                    $controller = undefined,
                    $rootScope = undefined,
                    certificationService = undefined,
                    cert = undefined,
                    certLoadingErrorMessage = undefined,
                    certificationDataService = undefined,
                    navigationService = undefined,
                    spModal = undefined,
                    $q = undefined,
                    testService = undefined,
                    config = undefined,
                    CertificationItem = undefined,
                    certificationTestData = undefined,
                    Certification = undefined,
                    electronicSignatureService = undefined,
                    CertificationConfig = undefined,
                    ObjectResultDTO = undefined,
                    certObjResult = undefined,
                    filterData = undefined,
                    filtersArray = undefined,
                    Filter = undefined;

                function setAllCounts(cert, status, value) {
                    for (var type in cert.itemStatusCount.counts) {
                        if (cert.itemStatusCount.counts.hasOwnProperty(type)) {
                            cert.itemStatusCount.counts[type][status] = value;
                        }
                    }
                }

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 16 */
                beforeEach(inject(function (_$controller_, _certificationService_, _certificationTestData_, _$q_, _Certification_, _$rootScope_, _spModal_, _navigationService_, _testService_, _certificationDataService_, _CertificationItem_, _electronicSignatureService_, _CertificationConfig_, _ObjectResultDTO_, _Filter_) {
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;
                    certificationService = _certificationService_;
                    certificationDataService = _certificationDataService_;
                    navigationService = _navigationService_;
                    electronicSignatureService = _electronicSignatureService_;
                    CertificationConfig = _CertificationConfig_;
                    spModal = _spModal_;
                    $q = _$q_;
                    testService = _testService_;
                    CertificationItem = _CertificationItem_;
                    Certification = _Certification_;
                    certificationTestData = _certificationTestData_;
                    ObjectResultDTO = _ObjectResultDTO_;
                    Filter = _Filter_;

                    // Create some mock data
                    cert = new Certification(certificationTestData.CERTIFICATION_1);
                    certObjResult = new ObjectResultDTO({
                        object: cert,
                        warnings: ['cert_locked_warn'] });
                    $stateParams = {
                        certificationId: cert.id
                    };
                    config = {
                        some: 'configValue'
                    };
                    filterData = {
                        property: 'manager',
                        multiValued: false,
                        label: 'Manager',
                        dataType: 'SomeType',
                        allowedValues: null,
                        attributes: {}
                    };
                    filtersArray = [new Filter(filterData)];

                    // Mock the certificationService calls.
                    spyOn(certificationService, 'getCertification').and.callFake(function () {
                        return testService.createPromise(!!certLoadingErrorMessage, certObjResult, {
                            data: {
                                message: certLoadingErrorMessage
                            }
                        });
                    });
                    spyOn(certificationService, 'getConfiguration').and.callFake(function () {
                        return testService.createPromise(false, config);
                    });
                    spyOn(certificationService, 'getFilters').and.callFake(function () {
                        return testService.createPromise(false, filtersArray);
                    });

                    spyOn(certificationService, 'getCertificationItems').and.returnValue($q.when({
                        data: {
                            objects: [],
                            count: 0
                        }
                    }));
                    certLoadingErrorMessage = undefined;
                }));

                function createController() {
                    return $controller('CertificationCtrl', {
                        certificationService: certificationService,
                        certificationDataService: certificationDataService,
                        $stateParams: $stateParams
                    });
                }

                describe('constructor', function () {
                    it('throws if certification ID is missing', function () {
                        delete $stateParams.certificationId;
                        expect(function () {
                            createController();
                        }).toThrow();
                    });

                    it('loads the certification', function () {
                        var ctrl = createController();
                        spyOn(certificationDataService, 'initialize').and.callThrough();
                        expect(ctrl.id).toEqual(cert.id);
                        expect(certificationService.getCertification).toHaveBeenCalledWith(cert.id);
                        $rootScope.$apply();
                        expect(ctrl.getCertification()).toEqual(cert);
                        expect(certificationDataService.initialize).toHaveBeenCalledWith(cert, true);
                    });

                    it('does not load the certification if its already loaded', function () {
                        certificationDataService.initialize(cert);
                        createController();
                        expect(certificationService.getCertification).not.toHaveBeenCalled();
                    });

                    it('shows dialog and navigates back if cert loading fails', function () {
                        var spModalArgs = undefined;
                        spyOn(spModal, 'open').and.callFake(function () {
                            return {
                                result: testService.createPromise()
                            };
                        });
                        spyOn(navigationService, 'back');
                        certLoadingErrorMessage = 'ERROR!!';
                        createController();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        spModalArgs = spModal.open.calls.mostRecent().args;
                        expect(spModalArgs.length).toEqual(1);
                        expect(spModalArgs[0].content).toEqual(certLoadingErrorMessage);
                        $rootScope.$apply();
                        expect(navigationService.back).toHaveBeenCalled();
                    });

                    it('loads the configuration', function () {
                        createController();
                        spyOn(certificationDataService, 'initializeConfiguration');
                        expect(certificationService.getConfiguration).toHaveBeenCalledWith(cert.id);
                        $rootScope.$apply();
                        expect(certificationDataService.initializeConfiguration).toHaveBeenCalledWith(config);
                    });

                    it('loads the filters', function () {
                        spyOn(certificationDataService, 'initializeDataTableFilters');
                        createController();
                        expect(certificationService.getFilters).toHaveBeenCalledWith(cert.id);
                        $rootScope.$apply();
                        expect(certificationDataService.initializeDataTableFilters).toHaveBeenCalled();
                        var filtersPromise = certificationDataService.initializeDataTableFilters.calls.mostRecent().args[0],
                            foundFilters = undefined;
                        filtersPromise.then(function (filters) {
                            foundFilters = filters;
                        });
                        $rootScope.$apply();
                        expect(foundFilters).toEqual(filtersArray);
                    });

                    it('sets the templateFunc if filter is additionalEntitlement', function () {
                        spyOn(certificationDataService, 'initializeDataTableFilters');
                        var ctrl = createController(),
                            templateFilter = undefined,
                            filtersPromise = undefined;
                        filtersArray.push(new Filter({
                            property: 'app',
                            attributes: {
                                additionalEntitlement: true,
                                application: 'app'
                            }
                        }));

                        filtersPromise = certificationDataService.initializeDataTableFilters.calls.mostRecent().args[0];
                        filtersPromise.then(function (filters) {
                            templateFilter = filters[1];
                        });
                        $rootScope.$apply();
                        expect(templateFilter.templateFunc).toEqual(ctrl.getAdditionalEntitlementFilterTemplate);
                    });

                    it('loads the certification for detailed view', function () {
                        $stateParams = {
                            certificationId: cert.id,
                            entityId: '1234'
                        };
                        var ctrl = createController();
                        spyOn(certificationDataService, 'goToDetailView');
                        expect(ctrl.entityId).toEqual($stateParams.entityId);
                        $rootScope.$apply();
                        expect(certificationDataService.goToDetailView).toHaveBeenCalledWith($stateParams.entityId);
                        delete $stateParams.entityId;
                    });
                });

                describe('isMobileEntityListView()', function () {
                    it('returns true if an entity is not selected', function () {
                        var ctrl = createController();
                        expect(ctrl.isMobileEntityListView()).toEqual(true);
                    });

                    it('returns false if an entity is selected', function () {
                        var ctrl = createController();
                        certificationDataService.selectedEntity = {};
                        expect(ctrl.isMobileEntityListView()).toEqual(false);
                    });
                });

                it('gotoMobileEntityListView() clears the selected entity', function () {
                    var ctrl = createController();
                    certificationDataService.selectedEntity = {};
                    ctrl.gotoMobileEntityListView();
                    expect(ctrl.getEntity()).toEqual(null);
                });

                describe('entity paging', function () {
                    var ctrl = undefined;

                    beforeEach(function () {
                        ctrl = createController();
                    });

                    describe('with no entity pager configured', function () {
                        it('hasNextEntity() returns false', function () {
                            expect(ctrl.hasNextEntity()).toEqual(false);
                        });

                        it('hasPreviousEntity() returns false', function () {
                            expect(ctrl.hasPreviousEntity()).toEqual(false);
                        });

                        it('gotoNextEntity() hurls', function () {
                            expect(function () {
                                return ctrl.gotoNextEntity();
                            }).toThrow();
                        });

                        it('gotoPreviousEntity() blows chunks', function () {
                            expect(function () {
                                return ctrl.gotoPreviousEntity();
                            }).toThrow();
                        });
                    });

                    describe('with an entity pager', function () {
                        var previousId = 'previousDude',
                            nextId = 'nextFella',
                            pager = undefined;

                        beforeEach(function () {
                            pager = {
                                hasNext: jasmine.createSpy().and.returnValue(true),
                                hasPrevious: jasmine.createSpy().and.returnValue(true),
                                next: jasmine.createSpy().and.returnValue(nextId),
                                previous: jasmine.createSpy().and.returnValue(previousId)
                            };

                            certificationDataService.entityListPager = pager;
                            spyOn(certificationDataService, 'goToDetailView');
                        });

                        it('hasNextEntity() delegates to the pager', function () {
                            expect(ctrl.hasNextEntity()).toEqual(true);
                            expect(pager.hasNext).toHaveBeenCalled();
                        });

                        it('hasPreviousEntity() delegates to the pager', function () {
                            expect(ctrl.hasPreviousEntity()).toEqual(true);
                            expect(pager.hasPrevious).toHaveBeenCalled();
                        });

                        it('gotoNextEntity() delegates to the pager and navigates to the detail view', function () {
                            ctrl.gotoNextEntity();
                            expect(pager.next).toHaveBeenCalled();
                            expect(certificationDataService.goToDetailView).toHaveBeenCalledWith(nextId);
                        });

                        it('gotoPreviousEntity() delegates to the pager and navigates to the detail view', function () {
                            ctrl.gotoPreviousEntity();
                            expect(pager.previous).toHaveBeenCalled();
                            expect(certificationDataService.goToDetailView).toHaveBeenCalledWith(previousId);
                        });
                    });
                });

                it('getItems() calls service with correct values from table', function () {
                    var ctrl = createController(),
                        cfgKey = 'whu?!',
                        groupBy = 'ya',
                        filterVals = [{ some: 'filter' }],
                        table = {
                        getDataTableConfig: function () {
                            return {
                                getColumnConfigKey: function () {
                                    return cfgKey;
                                }
                            };
                        },
                        tableScope: {
                            statuses: ['Whatever'],
                            includedTypes: ['hmmmmm'],
                            excludedTypes: ['giggity'],
                            entity: {
                                id: 'entity1234'
                            }
                        }
                    };
                    expect(certificationService.getCertificationItems).not.toHaveBeenCalled();
                    ctrl.getItems(table, 0, 10, filterVals, null, groupBy);
                    expect(certificationService.getCertificationItems).toHaveBeenCalledWith(cert.id, table.tableScope, 0, 10, null, groupBy, cfgKey, filterVals);
                });

                describe('is delegated to view state', function () {
                    var ctrl = undefined;

                    beforeEach(function () {
                        ctrl = createController();
                    });

                    it('getCurrentTab()', function () {
                        spyOn(certificationDataService.getViewState(), 'getCurrentTab');
                        ctrl.getCurrentTab();
                        expect(certificationDataService.getViewState().getCurrentTab).toHaveBeenCalled();
                    });

                    it('getCurrentTabConfig()', function () {
                        spyOn(certificationDataService.getViewState(), 'getCurrentTabConfig');
                        ctrl.getCurrentTabConfig();
                        expect(certificationDataService.getViewState().getCurrentTabConfig).toHaveBeenCalled();
                    });

                    it('getTabCount()', function () {
                        var tab = {
                            name: 'tably namely'
                        };
                        spyOn(certificationDataService.getViewState(), 'getTabCount');
                        ctrl.getTabCount(tab);
                        expect(certificationDataService.getViewState().getTabCount).toHaveBeenCalledWith(tab.name);
                    });

                    it('changeTab()', function () {
                        var tab = 'SomeTab';
                        spyOn(certificationDataService.getViewState(), 'changeTab');
                        ctrl.changeTab(tab);
                        expect(certificationDataService.getViewState().changeTab).toHaveBeenCalledWith(tab);
                    });

                    it('isTableDisplayed()', function () {
                        var table = {};
                        spyOn(certificationDataService.getViewState(), 'isTableDisplayed');
                        ctrl.isTableDisplayed(table);
                        expect(certificationDataService.getViewState().isTableDisplayed).toHaveBeenCalledWith(table);
                    });
                });

                describe('is delegated to data service', function () {
                    var ctrl = undefined;

                    beforeEach(function () {
                        ctrl = createController();
                    });

                    it('getDecisionCount()', function () {
                        spyOn(certificationDataService.decisions, 'getDecisionCount').and.returnValue(43);
                        var count = ctrl.getDecisionCount();
                        expect(certificationDataService.decisions.getDecisionCount).toHaveBeenCalled();
                        expect(count).toEqual(43);
                    });
                });

                describe('showExpirationDate()', function () {
                    /**
                     * Create a controller with the given date - the cert will also be loaded already.
                     */
                    function createCtrlWithExpiration(date) {
                        var ctrl = undefined;
                        cert.expiration = date;
                        ctrl = createController();
                        $rootScope.$apply();
                        return ctrl;
                    }

                    function getDate(daysFromNow) {
                        var start = new Date(),
                            newTime = start.getTime() + daysFromNow * (1000 * 60 * 60 * 24);
                        return new Date(newTime);
                    }

                    it('returns false if the certification has no expiration date', function () {
                        var ctrl = createCtrlWithExpiration(null);
                        expect(ctrl.showExpirationDate()).toEqual(false);
                    });

                    it('returns false if the expiration is more than two weeks away', function () {
                        var ctrl = createCtrlWithExpiration(getDate(16));
                        expect(ctrl.showExpirationDate()).toEqual(false);
                    });

                    it('returns false if cert is signed off', function () {
                        var ctrl = createCtrlWithExpiration(getDate(-2));
                        spyOn(ctrl, 'isSignedOff').and.returnValue(true);
                        expect(ctrl.showExpirationDate()).toEqual(false);
                    });

                    it('returns true if the expiration date is less than two weeks away', function () {
                        var ctrl = createCtrlWithExpiration(getDate(13));
                        expect(ctrl.showExpirationDate()).toEqual(true);
                    });

                    it('returns true if the certification is overdue', function () {
                        var ctrl = createCtrlWithExpiration(getDate(-2));
                        expect(ctrl.showExpirationDate()).toEqual(true);
                    });
                });

                describe('clear button', function () {
                    it('is disabled if there are no decisions', function () {
                        var ctrl = createController();
                        expect(ctrl.isClearButtonEnabled()).toEqual(false);
                    });

                    it('is enabled if there are decisions', function () {
                        spyOn(certificationDataService.decisions, 'getDecisionCount').and.returnValue(43);
                        var ctrl = createController();
                        expect(ctrl.isClearButtonEnabled()).toEqual(true);
                    });
                });

                describe('clearDecisions()', function () {
                    it('calls through to clear decisions on decision store', function () {
                        spyOn(certificationDataService.decisions, 'clearDecisions');
                        var ctrl = createController();
                        ctrl.clearDecisions();
                        expect(certificationDataService.decisions.clearDecisions).toHaveBeenCalled();
                    });
                });

                describe('save button', function () {
                    it('is disabled if there are no decisions', function () {
                        var ctrl = createController();
                        expect(ctrl.isSaveButtonEnabled()).toEqual(false);
                    });

                    it('is enabled if there are decisions', function () {
                        spyOn(certificationDataService.decisions, 'getDecisionCount').and.returnValue(43);
                        var ctrl = createController();
                        expect(ctrl.isSaveButtonEnabled()).toEqual(true);
                    });
                });

                describe('save', function () {
                    var fakeCert = undefined,
                        fakeDecisions = undefined,
                        saveReturnVal = undefined,
                        deferred = undefined,
                        failedResponse = undefined;

                    beforeEach(function () {
                        fakeCert = new Certification(certificationTestData.CERTIFICATION_1);
                        fakeDecisions = ['hi mom!'];
                    });

                    function spyOnGetDecisions() {
                        // Loading the cert resets the decisions object with a new object, so we have to spy after creation.
                        spyOn(certificationDataService.decisions, 'getDecisions').and.returnValue(fakeDecisions);
                    }

                    function setup(greatSuccess, status) {
                        var response = { status: status };
                        saveReturnVal = greatSuccess ? $q.when({ data: { object: fakeCert } }) : $q.reject(response);
                        spyOn(certificationService, 'saveDecisions').and.returnValue(saveReturnVal);
                        spyOn(certificationDataService, 'initialize').and.callThrough();
                        spyOn(certificationDataService, 'refreshView').and.callThrough();
                    }

                    function setupForSaveRetryDialog() {
                        failedResponse = { status: 409 };
                        saveReturnVal = $q.reject(failedResponse);

                        spyOn(spModal, 'open').and.callFake(function () {
                            deferred = $q.defer();
                            return {
                                result: deferred.promise
                            };
                        });
                        spyOn(certificationService, 'saveDecisions').and.callFake(function () {
                            return saveReturnVal;
                        });
                    }

                    it('calls the certification service with the decisions', function () {
                        setup(true, 200);

                        var ctrl = createController();
                        $rootScope.$apply();
                        spyOnGetDecisions();
                        certificationDataService.initialize.calls.reset();
                        ctrl.save();
                        $rootScope.$apply();

                        expect(certificationService.saveDecisions).toHaveBeenCalledWith(cert.id, fakeDecisions);
                        expect(ctrl.getCertification()).toEqual(fakeCert);
                    });

                    it('reinitialized the data service after a successful save', function () {
                        setup(true, 200);

                        var ctrl = createController();
                        $rootScope.$apply();
                        spyOnGetDecisions();
                        certificationDataService.initialize.calls.reset();
                        ctrl.save();
                        $rootScope.$apply();

                        expect(certificationDataService.initialize).toHaveBeenCalledWith(fakeCert, false);
                        expect(certificationDataService.refreshView).toHaveBeenCalledWith(true);
                    });

                    it('goes to previous page if last decision on last page is finished', function () {
                        // Make the save call return a cert that has only 30 "decisions left" items.  Total = 33.
                        setAllCounts(fakeCert, 'Open', 0);
                        setAllCounts(fakeCert, 'Delegated', 0);
                        setAllCounts(fakeCert, 'Returned', 0);
                        setAllCounts(fakeCert, 'Complete', 0);
                        setAllCounts(fakeCert, 'Challenged', 0);
                        setAllCounts(fakeCert, 'WaitingReview', 0);
                        fakeCert.itemStatusCount.counts.Bundle.Open = 30;
                        fakeCert.itemStatusCount.counts.Bundle.Complete = 3;

                        certificationDataService.initialize(fakeCert);

                        setup(true, 200);
                        var ctrl = createController();
                        spyOnGetDecisions();

                        // Go to the last page.
                        expect(ctrl.getCurrentTabConfig().tables.length).toEqual(1);
                        var table = ctrl.getCurrentTabConfig().tables[0];
                        table.getDataTableConfig().getPageState().pagingData.currentPage = 4;

                        // Save.
                        ctrl.save();
                        $rootScope.$apply();

                        // Verify that we're now on the third page.
                        expect(table.getDataTableConfig().getPageState().pagingData.currentPage).toEqual(3);
                    });

                    it('refreshes the list after a successful save', function () {
                        setup(true, 200);

                        var ctrl = createController();
                        spyOnGetDecisions();
                        spyOn(certificationDataService.getViewState(), 'refreshCurrentTab');
                        ctrl.save();
                        $rootScope.$apply();

                        expect(certificationDataService.getViewState().refreshCurrentTab).toHaveBeenCalled();
                    });

                    it('does not reinitialize with cert and clear decisions if saving fails', function () {
                        setup(false, 404);

                        var ctrl = createController();
                        $rootScope.$apply();
                        spyOnGetDecisions();
                        certificationDataService.initialize.calls.reset();
                        ctrl.save();
                        $rootScope.$apply();

                        expect(certificationDataService.initialize).not.toHaveBeenCalled();
                    });

                    it('does not refresh the list if saving fails', function () {
                        setup(false, 404);

                        var ctrl = createController();
                        spyOnGetDecisions();
                        spyOn(certificationDataService.getViewState(), 'refreshCurrentTab');
                        ctrl.save();
                        $rootScope.$apply();

                        expect(certificationDataService.getViewState().refreshCurrentTab).not.toHaveBeenCalled();
                    });

                    it('opens retry dialog if saving fails with 409 status', function () {
                        setupForSaveRetryDialog();

                        var ctrl = createController();
                        spyOnGetDecisions();
                        ctrl.save();
                        $rootScope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                        //retry dialog for locked cert
                        expect(spModal.open).toHaveBeenCalled();
                        certificationService.saveDecisions.calls.reset();
                        //locked cert - don't save
                        deferred.reject(saveReturnVal);
                        $rootScope.$apply();
                        expect(certificationService.saveDecisions).not.toHaveBeenCalled();
                    });

                    it('first opens retry dialog for 409 status and then resolves successfully when cert unlocked', function () {
                        setupForSaveRetryDialog();

                        var ctrl = createController(),
                            successResponse = {
                            status: 200,
                            data: { object: fakeCert }
                        };

                        spyOnGetDecisions();
                        ctrl.save();
                        $rootScope.$apply();
                        //retry dialog opened for locked cert
                        expect(spModal.open).toHaveBeenCalled();
                        //saving a locked cert
                        deferred.resolve($q.when(failedResponse));
                        $rootScope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                        //retry dialog opened for locked cert
                        expect(spModal.open).toHaveBeenCalled();
                        certificationService.saveDecisions.calls.reset();
                        spModal.open.calls.reset();
                        //saving an unlocked cert
                        saveReturnVal = $q.when(successResponse);
                        deferred.resolve($q.when(successResponse));
                        $rootScope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                        expect(spModal.open).not.toHaveBeenCalled();
                    });
                });

                describe('sign', function () {

                    var deferred = undefined,
                        saveReturnVal = undefined,
                        failedResponse = undefined;

                    beforeEach(function () {
                        spyOn(electronicSignatureService, 'openDialog').and.returnValue(testService.createPromise(false, {
                            username: 'test',
                            password: 'xyzzy'
                        }));
                        spyOn(navigationService, 'back');
                    });

                    function setupForSignOffRetryDialog() {
                        failedResponse = { status: 409 };
                        saveReturnVal = $q.reject(failedResponse);

                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(new CertificationConfig({
                            someConfig: 'test'
                        }));
                        spyOn(spModal, 'open').and.callFake(function () {
                            deferred = $q.defer();
                            return {
                                result: deferred.promise
                            };
                        });
                        spyOn(certificationService, 'signOff').and.callFake(function () {
                            return saveReturnVal;
                        });
                    }

                    it('opens the esig dialog when esig is configured', function () {
                        var ctrl = createController(),
                            username = 'test',
                            password = 'xyzzy';

                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(new CertificationConfig({
                            esigMeaning: 'Esig'
                        }));
                        spyOn(certificationService, 'signOff');
                        ctrl.sign();
                        expect(electronicSignatureService.openDialog).toHaveBeenCalled();
                        $rootScope.$apply();
                        expect(certificationService.signOff).toHaveBeenCalledWith(cert.id, username, password);
                    });

                    it('opens the completion dialog for signOff when esig is not configured', function () {
                        var ctrl = createController();
                        spyOn(spModal, 'open').and.returnValue({
                            result: testService.createPromise(false)
                        });
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(new CertificationConfig({
                            someConfig: 'test'
                        }));
                        spyOn(certificationService, 'signOff');
                        ctrl.sign();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(electronicSignatureService.openDialog).not.toHaveBeenCalled();
                        $rootScope.$apply();
                        expect(certificationService.signOff).toHaveBeenCalledWith(cert.id);
                    });

                    it('calls navigation service after signOff', function () {
                        var ctrl = createController();
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(new CertificationConfig({
                            esigMeaning: 'Esig'
                        }));
                        spyOn(certificationService, 'signOff');
                        ctrl.sign();
                        $rootScope.$apply();
                        expect(navigationService.back).toHaveBeenCalled();
                    });

                    it('shows dialog if there is a signoff blocked reason', function () {
                        var ctrl = undefined,
                            reason = 'dont sign this dummy';
                        cert.signoffBlockedReason = reason;
                        spyOn(spModal, 'open').and.returnValue({
                            result: testService.createPromise(false)
                        });
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(new CertificationConfig({
                            someConfig: 'test'
                        }));
                        ctrl = createController();
                        $rootScope.$apply();
                        spyOn(certificationService, 'signOff');
                        ctrl.sign();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].resolve.reason()).toEqual(reason);
                        expect(electronicSignatureService.openDialog).not.toHaveBeenCalled();
                        expect(certificationService.signOff).not.toHaveBeenCalled();
                    });

                    it('opens retry dialog if signOff fails with 409 status', function () {
                        setupForSignOffRetryDialog();

                        var ctrl = createController();
                        ctrl.sign();
                        $rootScope.$apply();
                        //completion dialog
                        expect(spModal.open).toHaveBeenCalled();
                        deferred.resolve();
                        spModal.open.calls.reset();
                        $rootScope.$apply();
                        expect(certificationService.signOff).toHaveBeenCalled();
                        certificationService.signOff.calls.reset();
                        //retry dialog
                        expect(spModal.open).toHaveBeenCalled();
                        deferred.reject(saveReturnVal);
                        $rootScope.$apply();
                        expect(certificationService.signOff).not.toHaveBeenCalled();
                    });

                    it('first opens retry dialog for 409 status and then signOff successfully when cert unlocked', function () {
                        setupForSignOffRetryDialog();
                        var successResponse = {
                            status: 200,
                            data: { object: new Certification(certificationTestData.CERTIFICATION_1) }
                        },
                            ctrl = createController();

                        ctrl.sign();
                        $rootScope.$apply();
                        //completion dialog
                        expect(spModal.open).toHaveBeenCalled();
                        deferred.resolve();
                        spModal.open.calls.reset();
                        $rootScope.$apply();
                        //retry dialog for locked cert
                        expect(spModal.open).toHaveBeenCalled();
                        deferred.resolve($q.when(failedResponse));
                        spModal.open.calls.reset();
                        $rootScope.$apply();
                        expect(certificationService.signOff).toHaveBeenCalled();
                        //completion dialog
                        expect(spModal.open).toHaveBeenCalled();
                        deferred.resolve();
                        spModal.open.calls.reset();
                        certificationService.signOff.calls.reset();
                        $rootScope.$apply();
                        //saving an unlocked cert
                        //retry dialog
                        expect(spModal.open).toHaveBeenCalled();
                        saveReturnVal = $q.when(successResponse);
                        deferred.resolve($q.when(successResponse));
                        $rootScope.$apply();
                        expect(certificationService.signOff).toHaveBeenCalled();
                    });
                });

                describe('isComplete', function () {
                    var fakeCert = undefined;

                    beforeEach(function () {
                        fakeCert = new Certification(certificationTestData.CERTIFICATION_1);
                    });

                    it('is false if completed items do not equal total items', function () {

                        setAllCounts(fakeCert, 'Open', 0);
                        setAllCounts(fakeCert, 'Delegated', 0);
                        setAllCounts(fakeCert, 'Returned', 0);
                        setAllCounts(fakeCert, 'Complete', 3);
                        certificationDataService.initialize(fakeCert);

                        var ctrl = createController();
                        $rootScope.$apply();

                        expect(ctrl.isComplete()).toEqual(false);
                    });

                    it('is true if completed items equal total items, regardless of complete flag', function () {
                        setAllCounts(fakeCert, 'Open', 0);
                        setAllCounts(fakeCert, 'Delegated', 0);
                        setAllCounts(fakeCert, 'Returned', 0);
                        setAllCounts(fakeCert, 'Complete', 1);
                        setAllCounts(fakeCert, 'WaitingReview', 0);
                        setAllCounts(fakeCert, 'Challenged', 0);
                        certificationDataService.initialize(fakeCert);

                        // Ignore this flag for these purposes, since can be false for other reasons.
                        cert.complete = false;
                        var ctrl = createController();
                        $rootScope.$apply();
                        expect(ctrl.isComplete()).toEqual(true);
                    });

                    it('is false if there are pending decisions, regardless of item count', function () {
                        spyOn(certificationDataService.decisions, 'getDecisionCount').and.returnValue(2);
                        var ctrl = createController();
                        $rootScope.$apply();
                        expect(ctrl.isComplete()).toEqual(false);
                    });
                });

                describe('isSignedOff', function () {
                    it('is false if cert is not signedOff', function () {
                        cert.signOffComplete = false;
                        var ctrl = createController();
                        $rootScope.$apply();
                        expect(ctrl.isSignedOff()).toEqual(false);
                    });

                    it('is true if cert is signedOff', function () {
                        cert.signOffComplete = true;
                        var ctrl = createController();
                        $rootScope.$apply();
                        expect(ctrl.isSignedOff()).toEqual(true);
                    });
                });

                describe('showDateField()', function () {
                    it('returns false if showExpirationDate and isSignedOff are both false', function () {
                        var ctrl = createController();
                        spyOn(ctrl, 'showExpirationDate').and.returnValue(false);
                        spyOn(ctrl, 'isSignedOff').and.returnValue(false);
                        expect(ctrl.showDateField()).toEqual(false);
                    });

                    it('returns true if showExpirationDate is true', function () {
                        var ctrl = createController();
                        spyOn(ctrl, 'showExpirationDate').and.returnValue(true);
                        spyOn(ctrl, 'isSignedOff').and.returnValue(false);
                        expect(ctrl.showDateField()).toEqual(true);
                    });

                    it('returns true if isSignedOff is true', function () {
                        var ctrl = createController();
                        spyOn(ctrl, 'showExpirationDate').and.returnValue(false);
                        spyOn(ctrl, 'isSignedOff').and.returnValue(true);
                        expect(ctrl.showDateField()).toEqual(true);
                    });
                });

                describe('getBulkDecisions()', function () {
                    var CertificationViewState = undefined;

                    beforeEach(inject(function (_CertificationViewState_) {
                        CertificationViewState = _CertificationViewState_;
                    }));

                    it('returns bulk decisions for a complete tab from configuration if loaded', function () {
                        var bulkDecisions = ['decision1', 'decision2', 'Reassign', 'Cleared'],
                            filteredBulkDecisions = ['Reassign', 'Cleared'],
                            ctrl = createController();
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue({
                            bulkDecisions: bulkDecisions
                        });
                        spyOn(ctrl, 'getCurrentTab').and.returnValue(CertificationViewState.Tab.Complete);
                        expect(ctrl.getBulkDecisions()).toEqual(filteredBulkDecisions);
                    });

                    it('returns filtered bulk decisions for DecisionsLeft tab', function () {
                        var bulkDecisions = ['decision1', 'decision2', 'Cleared'],
                            filteredBulkDecisions = ['decision1', 'decision2'],
                            ctrl = createController();
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue({
                            bulkDecisions: bulkDecisions
                        });
                        spyOn(ctrl, 'getCurrentTab').and.returnValue('DecisionsLeft');
                        expect(ctrl.getBulkDecisions().length).toEqual(2);
                        expect(ctrl.getBulkDecisions()).toEqual(filteredBulkDecisions);
                    });

                    it('returns filtered bulk decisions for action required tab', function () {
                        var bulkDecisions = ['decision1', 'decision2', 'Reassign', 'Cleared'],
                            filteredBulkDecisions = ['Reassign'],
                            ctrl = createController();
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue({
                            bulkDecisions: bulkDecisions
                        });
                        spyOn(ctrl, 'getCurrentTab').and.returnValue(CertificationViewState.Tab.ActionRequired);
                        expect(ctrl.getBulkDecisions()).toEqual(filteredBulkDecisions);
                    });

                    it('returns null if configuration is not loaded', function () {
                        var ctrl = createController();
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(undefined);
                        expect(ctrl.getBulkDecisions()).toEqual(null);
                    });
                });

                describe('goBack()', function () {

                    it('should call navigation service to go back to previous page', function () {
                        var ctrl = createController();
                        spyOn(navigationService, 'back');
                        ctrl.goBack();
                        expect(navigationService.back).toHaveBeenCalled();
                    });
                });

                describe('showMobileEntityDetails()', function () {
                    it('opens dialog to show entity details', function () {
                        var entity = { some: 'entity' },
                            ctrl = createController();
                        spyOn(spModal, 'open');
                        spyOn(ctrl, 'getEntity').and.returnValue(entity);
                        ctrl.showMobileEntityDetails();
                        expect(spModal.open).toHaveBeenCalled();
                        var args = spModal.open.calls.mostRecent().args;
                        expect(args[0].resolve.entity()).toEqual(entity);
                    });
                });

                describe('mobile entity search', function () {
                    var ctrl = undefined;
                    beforeEach(function () {
                        ctrl = createController();
                        spyOn(ctrl.entityListRefreshTrigger, 'refresh');
                    });

                    describe('mobileEntitySearch()', function () {
                        it('does nothing with event with keyCode other than 13 (enter)', function () {
                            // call once to toggle search on
                            ctrl.mobileEntitySearch();

                            // call again with non-enter event
                            ctrl.mobileEntitySearch({
                                keyCode: 23
                            });

                            expect(ctrl.entityListRefreshTrigger.refresh).not.toHaveBeenCalled();
                        });

                        it('refreshes with keyCode 13 (enter)', function () {
                            // call once to toggle search on
                            ctrl.mobileEntitySearch();

                            // call again with enter event
                            ctrl.mobileEntitySearch({
                                keyCode: 13
                            });

                            expect(ctrl.entityListRefreshTrigger.refresh).toHaveBeenCalled();
                        });

                        it('toggles searching if not already toggled on', function () {
                            ctrl.mobileEntitySearch();
                            expect(ctrl.getMobileEntityListState().searching).toEqual(true);
                            expect(ctrl.entityListRefreshTrigger.refresh).not.toHaveBeenCalled();
                        });

                        it('refreshes trigger if searching already toggled on', function () {
                            ctrl.mobileEntitySearch();
                            ctrl.mobileEntitySearch();
                            expect(ctrl.entityListRefreshTrigger.refresh).toHaveBeenCalled();
                        });
                    });

                    describe('mobileEntitySearchClear()', function () {
                        it('clears search term and refreshes trigger', function () {
                            ctrl.getMobileEntityListState().entitySearchTerm = 'abc';
                            ctrl.mobileEntitySearchClear();
                            expect(ctrl.getMobileEntityListState().entitySearchTerm).toEqual(undefined);
                            expect(ctrl.entityListRefreshTrigger.refresh).toHaveBeenCalled();
                        });

                        it('toggles search off', function () {
                            ctrl.getMobileEntityListState().searching = true;
                            ctrl.mobileEntitySearchClear();
                            expect(ctrl.getMobileEntityListState().searching).toEqual(false);
                        });
                    });

                    describe('isMobileEntitySearch()', function () {
                        it('returns searching flag from mobile entity list state', function () {
                            ctrl.getMobileEntityListState().searching = true;
                            expect(ctrl.isMobileEntitySearch()).toEqual(true);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkN0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLHVCQUF1QixVQUFVLFNBQVM7SUFDdkg7O0lBRUEsSUFBSSxxQkFBcUI7SUFDekIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFON0IsU0FBUyxxQkFBcUIsWUFBVzs7Z0JBRXJDLElBQUksZUFBWTtvQkFBRSxjQUFXO29CQUFFLGFBQVU7b0JBQUUsdUJBQW9CO29CQUFFLE9BQUk7b0JBQUUsMEJBQXVCO29CQUMxRiwyQkFBd0I7b0JBQUUsb0JBQWlCO29CQUFFLFVBQU87b0JBQUUsS0FBRTtvQkFBRSxjQUFXO29CQUFFLFNBQU07b0JBQUUsb0JBQWlCO29CQUNoRyx3QkFBcUI7b0JBQUUsZ0JBQWE7b0JBQUUsNkJBQTBCO29CQUFFLHNCQUFtQjtvQkFBRSxrQkFBZTtvQkFDdEcsZ0JBQWE7b0JBQUUsYUFBVTtvQkFBRSxlQUFZO29CQUFFLFNBQU07O2dCQUVuRCxTQUFTLGFBQWEsTUFBTSxRQUFRLE9BQU87b0JBQ3ZDLEtBQUssSUFBSSxRQUFRLEtBQUssZ0JBQWdCLFFBQVE7d0JBQzFDLElBQUksS0FBSyxnQkFBZ0IsT0FBTyxlQUFlLE9BQU87NEJBQ2xELEtBQUssZ0JBQWdCLE9BQU8sTUFBTSxVQUFVOzs7OztnQkFLeEQsV0FBVyxPQUFPLHFCQUFxQjs7O2dCQUd2QyxXQUFXLE9BQU8sVUFBUyxlQUFlLHdCQUF3Qix5QkFBeUIsTUFDaEUsaUJBQWlCLGNBQWMsV0FBVyxxQkFBcUIsZUFDL0QsNEJBQTRCLHFCQUFxQiw4QkFDakQsdUJBQXVCLG1CQUFtQixVQUFVO29CQUMzRSxjQUFjO29CQUNkLGFB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Syx3QkFBd0IsUUFBUTs7Ozs7OztHQStCekQiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XHJcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XHJcblxyXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbkN0cmwnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsZXQgJHN0YXRlUGFyYW1zLCAkY29udHJvbGxlciwgJHJvb3RTY29wZSwgY2VydGlmaWNhdGlvblNlcnZpY2UsIGNlcnQsIGNlcnRMb2FkaW5nRXJyb3JNZXNzYWdlLFxyXG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsIHNwTW9kYWwsICRxLCB0ZXN0U2VydmljZSwgY29uZmlnLCBDZXJ0aWZpY2F0aW9uSXRlbSxcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsIENlcnRpZmljYXRpb24sIGVsZWN0cm9uaWNTaWduYXR1cmVTZXJ2aWNlLCBDZXJ0aWZpY2F0aW9uQ29uZmlnLCBPYmplY3RSZXN1bHREVE8sXHJcbiAgICAgICAgY2VydE9ialJlc3VsdCwgZmlsdGVyRGF0YSwgZmlsdGVyc0FycmF5LCBGaWx0ZXI7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0QWxsQ291bnRzKGNlcnQsIHN0YXR1cywgdmFsdWUpIHtcclxuICAgICAgICBmb3IgKGxldCB0eXBlIGluIGNlcnQuaXRlbVN0YXR1c0NvdW50LmNvdW50cykge1xyXG4gICAgICAgICAgICBpZiAoY2VydC5pdGVtU3RhdHVzQ291bnQuY291bnRzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjZXJ0Lml0ZW1TdGF0dXNDb3VudC5jb3VudHNbdHlwZV1bc3RhdHVzXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUsIHRlc3RNb2R1bGUpKTtcclxuXHJcbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAxNiAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXywgX2NlcnRpZmljYXRpb25TZXJ2aWNlXywgX2NlcnRpZmljYXRpb25UZXN0RGF0YV8sIF8kcV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQ2VydGlmaWNhdGlvbl8sIF8kcm9vdFNjb3BlXywgX3NwTW9kYWxfLCBfbmF2aWdhdGlvblNlcnZpY2VfLCBfdGVzdFNlcnZpY2VfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV8sIF9DZXJ0aWZpY2F0aW9uSXRlbV8sIF9lbGVjdHJvbmljU2lnbmF0dXJlU2VydmljZV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQ2VydGlmaWNhdGlvbkNvbmZpZ18sIF9PYmplY3RSZXN1bHREVE9fLCBfRmlsdGVyXykge1xyXG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcclxuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcclxuICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSA9IF9uYXZpZ2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgZWxlY3Ryb25pY1NpZ25hdHVyZVNlcnZpY2UgPSBfZWxlY3Ryb25pY1NpZ25hdHVyZVNlcnZpY2VfO1xyXG4gICAgICAgIENlcnRpZmljYXRpb25Db25maWcgPSBfQ2VydGlmaWNhdGlvbkNvbmZpZ187XHJcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAkcSA9IF8kcV87XHJcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xyXG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcclxuICAgICAgICBDZXJ0aWZpY2F0aW9uID0gX0NlcnRpZmljYXRpb25fO1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25UZXN0RGF0YSA9IF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfO1xyXG4gICAgICAgIE9iamVjdFJlc3VsdERUTyA9IF9PYmplY3RSZXN1bHREVE9fO1xyXG4gICAgICAgIEZpbHRlciA9IF9GaWx0ZXJfO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgc29tZSBtb2NrIGRhdGFcclxuICAgICAgICBjZXJ0ID0gbmV3IENlcnRpZmljYXRpb24oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fMSk7XHJcbiAgICAgICAgY2VydE9ialJlc3VsdCA9IG5ldyBPYmplY3RSZXN1bHREVE8oe1xyXG4gICAgICAgICAgICBvYmplY3Q6IGNlcnQsXHJcbiAgICAgICAgICAgIHdhcm5pbmdzOiBbJ2NlcnRfbG9ja2VkX3dhcm4nXX0pO1xyXG4gICAgICAgICRzdGF0ZVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbklkOiBjZXJ0LmlkXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIHNvbWU6ICdjb25maWdWYWx1ZSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZpbHRlckRhdGEgPSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnbWFuYWdlcicsXHJcbiAgICAgICAgICAgIG11bHRpVmFsdWVkOiBmYWxzZSxcclxuICAgICAgICAgICAgbGFiZWw6ICdNYW5hZ2VyJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdTb21lVHlwZScsXHJcbiAgICAgICAgICAgIGFsbG93ZWRWYWx1ZXM6IG51bGwsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmaWx0ZXJzQXJyYXkgPSBbbmV3IEZpbHRlcihmaWx0ZXJEYXRhKV07XHJcblxyXG4gICAgICAgIC8vIE1vY2sgdGhlIGNlcnRpZmljYXRpb25TZXJ2aWNlIGNhbGxzLlxyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnZ2V0Q2VydGlmaWNhdGlvbicpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoISFjZXJ0TG9hZGluZ0Vycm9yTWVzc2FnZSwgY2VydE9ialJlc3VsdCwge1xyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNlcnRMb2FkaW5nRXJyb3JNZXNzYWdlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBjb25maWcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnZ2V0RmlsdGVycycpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBmaWx0ZXJzQXJyYXkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ2dldENlcnRpZmljYXRpb25JdGVtcycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0czogW10sXHJcbiAgICAgICAgICAgICAgICBjb3VudDogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIGNlcnRMb2FkaW5nRXJyb3JNZXNzYWdlID0gdW5kZWZpbmVkO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdDZXJ0aWZpY2F0aW9uQ3RybCcsIHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2U6IGNlcnRpZmljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2U6IGNlcnRpZmljYXRpb25EYXRhU2VydmljZSxcclxuICAgICAgICAgICAgJHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgndGhyb3dzIGlmIGNlcnRpZmljYXRpb24gSUQgaXMgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBkZWxldGUgJHN0YXRlUGFyYW1zLmNlcnRpZmljYXRpb25JZDtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjcmVhdGVDb250cm9sbGVyKCk7IH0pLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2xvYWRzIHRoZSBjZXJ0aWZpY2F0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdpbml0aWFsaXplJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlkKS50b0VxdWFsKGNlcnQuaWQpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydC5pZCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldENlcnRpZmljYXRpb24oKSkudG9FcXVhbChjZXJ0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0LCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGxvYWQgdGhlIGNlcnRpZmljYXRpb24gaWYgaXRzIGFscmVhZHkgbG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcclxuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIGRpYWxvZyBhbmQgbmF2aWdhdGVzIGJhY2sgaWYgY2VydCBsb2FkaW5nIGZhaWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzcE1vZGFsQXJncztcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZSgpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3B5T24obmF2aWdhdGlvblNlcnZpY2UsICdiYWNrJyk7XHJcbiAgICAgICAgICAgIGNlcnRMb2FkaW5nRXJyb3JNZXNzYWdlID0gJ0VSUk9SISEnO1xyXG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgc3BNb2RhbEFyZ3MgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsQXJncy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsQXJnc1swXS5jb250ZW50KS50b0VxdWFsKGNlcnRMb2FkaW5nRXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5hdmlnYXRpb25TZXJ2aWNlLmJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2xvYWRzIHRoZSBjb25maWd1cmF0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnaW5pdGlhbGl6ZUNvbmZpZ3VyYXRpb24nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENvbmZpZ3VyYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnQuaWQpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjb25maWcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbG9hZHMgdGhlIGZpbHRlcnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2luaXRpYWxpemVEYXRhVGFibGVGaWx0ZXJzJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldEZpbHRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnQuaWQpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVEYXRhVGFibGVGaWx0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGxldCBmaWx0ZXJzUHJvbWlzZSA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplRGF0YVRhYmxlRmlsdGVycy5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXSxcclxuICAgICAgICAgICAgICAgIGZvdW5kRmlsdGVycztcclxuICAgICAgICAgICAgZmlsdGVyc1Byb21pc2UudGhlbigoZmlsdGVycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm91bmRGaWx0ZXJzID0gZmlsdGVycztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmb3VuZEZpbHRlcnMpLnRvRXF1YWwoZmlsdGVyc0FycmF5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3NldHMgdGhlIHRlbXBsYXRlRnVuYyBpZiBmaWx0ZXIgaXMgYWRkaXRpb25hbEVudGl0bGVtZW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdpbml0aWFsaXplRGF0YVRhYmxlRmlsdGVycycpO1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRmlsdGVyLCBmaWx0ZXJzUHJvbWlzZTtcclxuICAgICAgICAgICAgZmlsdGVyc0FycmF5LnB1c2gobmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbEVudGl0bGVtZW50OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYXBwJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBmaWx0ZXJzUHJvbWlzZSA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplRGF0YVRhYmxlRmlsdGVycy5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuICAgICAgICAgICAgZmlsdGVyc1Byb21pc2UudGhlbigoZmlsdGVycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVGaWx0ZXIgPSBmaWx0ZXJzWzFdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRlbXBsYXRlRmlsdGVyLnRlbXBsYXRlRnVuYykudG9FcXVhbChjdHJsLmdldEFkZGl0aW9uYWxFbnRpdGxlbWVudEZpbHRlclRlbXBsYXRlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2xvYWRzIHRoZSBjZXJ0aWZpY2F0aW9uIGZvciBkZXRhaWxlZCB2aWV3JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JZDogY2VydC5pZCxcclxuICAgICAgICAgICAgICAgIGVudGl0eUlkOiAnMTIzNCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dvVG9EZXRhaWxWaWV3Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmVudGl0eUlkKS50b0VxdWFsKCRzdGF0ZVBhcmFtcy5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCRzdGF0ZVBhcmFtcy5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSAkc3RhdGVQYXJhbXMuZW50aXR5SWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNNb2JpbGVFbnRpdHlMaXN0VmlldygpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgYW4gZW50aXR5IGlzIG5vdCBzZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzTW9iaWxlRW50aXR5TGlzdFZpZXcoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgYW4gZW50aXR5IGlzIHNlbGVjdGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0ge307XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzTW9iaWxlRW50aXR5TGlzdFZpZXcoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnZ290b01vYmlsZUVudGl0eUxpc3RWaWV3KCkgY2xlYXJzIHRoZSBzZWxlY3RlZCBlbnRpdHknLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0ge307XHJcbiAgICAgICAgY3RybC5nb3RvTW9iaWxlRW50aXR5TGlzdFZpZXcoKTtcclxuICAgICAgICBleHBlY3QoY3RybC5nZXRFbnRpdHkoKSkudG9FcXVhbChudWxsKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdlbnRpdHkgcGFnaW5nJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjdHJsO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggbm8gZW50aXR5IHBhZ2VyIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdoYXNOZXh0RW50aXR5KCkgcmV0dXJucyBmYWxzZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc05leHRFbnRpdHkoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2hhc1ByZXZpb3VzRW50aXR5KCkgcmV0dXJucyBmYWxzZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc1ByZXZpb3VzRW50aXR5KCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdnb3RvTmV4dEVudGl0eSgpIGh1cmxzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KCgpID0+IGN0cmwuZ290b05leHRFbnRpdHkoKSkudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdnb3RvUHJldmlvdXNFbnRpdHkoKSBibG93cyBjaHVua3MnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoKCkgPT4gY3RybC5nb3RvUHJldmlvdXNFbnRpdHkoKSkudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gZW50aXR5IHBhZ2VyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcHJldmlvdXNJZCA9ICdwcmV2aW91c0R1ZGUnLFxyXG4gICAgICAgICAgICAgICAgbmV4dElkID0gJ25leHRGZWxsYScsXHJcbiAgICAgICAgICAgICAgICBwYWdlcjtcclxuXHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFnZXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzTmV4dDogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzUHJldmlvdXM6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKHRydWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHQ6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKG5leHRJZCksXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXM6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKHByZXZpb3VzSWQpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5lbnRpdHlMaXN0UGFnZXIgPSBwYWdlcjtcclxuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dvVG9EZXRhaWxWaWV3Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2hhc05leHRFbnRpdHkoKSBkZWxlZ2F0ZXMgdG8gdGhlIHBhZ2VyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaGFzTmV4dEVudGl0eSgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHBhZ2VyLmhhc05leHQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnaGFzUHJldmlvdXNFbnRpdHkoKSBkZWxlZ2F0ZXMgdG8gdGhlIHBhZ2VyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaGFzUHJldmlvdXNFbnRpdHkoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwYWdlci5oYXNQcmV2aW91cykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdnb3RvTmV4dEVudGl0eSgpIGRlbGVnYXRlcyB0byB0aGUgcGFnZXIgYW5kIG5hdmlnYXRlcyB0byB0aGUgZGV0YWlsIHZpZXcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmdvdG9OZXh0RW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocGFnZXIubmV4dCkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nb1RvRGV0YWlsVmlldykudG9IYXZlQmVlbkNhbGxlZFdpdGgobmV4dElkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnZ290b1ByZXZpb3VzRW50aXR5KCkgZGVsZWdhdGVzIHRvIHRoZSBwYWdlciBhbmQgbmF2aWdhdGVzIHRvIHRoZSBkZXRhaWwgdmlldycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuZ290b1ByZXZpb3VzRW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocGFnZXIucHJldmlvdXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHByZXZpb3VzSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdnZXRJdGVtcygpIGNhbGxzIHNlcnZpY2Ugd2l0aCBjb3JyZWN0IHZhbHVlcyBmcm9tIHRhYmxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCksXHJcbiAgICAgICAgICAgIGNmZ0tleSA9ICd3aHU/IScsXHJcbiAgICAgICAgICAgIGdyb3VwQnkgPSAneWEnLFxyXG4gICAgICAgICAgICBmaWx0ZXJWYWxzID0gWyB7IHNvbWU6ICdmaWx0ZXInfSBdLFxyXG4gICAgICAgICAgICB0YWJsZSA9IHtcclxuICAgICAgICAgICAgICAgIGdldERhdGFUYWJsZUNvbmZpZzogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldENvbHVtbkNvbmZpZ0tleTogKCkgPT4gY2ZnS2V5XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0YWJsZVNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsnV2hhdGV2ZXInXSxcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlZFR5cGVzOiBbJ2htbW1tbSddLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkVHlwZXM6IFsnZ2lnZ2l0eSddLFxyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2VudGl0eTEyMzQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uSXRlbXMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgY3RybC5nZXRJdGVtcyh0YWJsZSwgMCwgMTAsIGZpbHRlclZhbHMsIG51bGwsIGdyb3VwQnkpO1xyXG4gICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uSXRlbXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxyXG4gICAgICAgICAgICBjZXJ0LmlkLCB0YWJsZS50YWJsZVNjb3BlLCAwLCAxMCwgbnVsbCwgZ3JvdXBCeSxcclxuICAgICAgICAgICAgY2ZnS2V5LCBmaWx0ZXJWYWxzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpcyBkZWxlZ2F0ZWQgdG8gdmlldyBzdGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjdHJsO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ2V0Q3VycmVudFRhYigpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKSwgJ2dldEN1cnJlbnRUYWInKTtcclxuICAgICAgICAgICAgY3RybC5nZXRDdXJyZW50VGFiKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCkuZ2V0Q3VycmVudFRhYikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ2V0Q3VycmVudFRhYkNvbmZpZygpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKSwgJ2dldEN1cnJlbnRUYWJDb25maWcnKTtcclxuICAgICAgICAgICAgY3RybC5nZXRDdXJyZW50VGFiQ29uZmlnKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCkuZ2V0Q3VycmVudFRhYkNvbmZpZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ2V0VGFiQ291bnQoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgdGFiID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3RhYmx5IG5hbWVseSdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdldFZpZXdTdGF0ZSgpLCAnZ2V0VGFiQ291bnQnKTtcclxuICAgICAgICAgICAgY3RybC5nZXRUYWJDb3VudCh0YWIpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdldFZpZXdTdGF0ZSgpLmdldFRhYkNvdW50KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0YWIubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjaGFuZ2VUYWIoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgdGFiID0gJ1NvbWVUYWInO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCksICdjaGFuZ2VUYWInKTtcclxuICAgICAgICAgICAgY3RybC5jaGFuZ2VUYWIodGFiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKS5jaGFuZ2VUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRhYik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpc1RhYmxlRGlzcGxheWVkKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlID0ge307XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKSwgJ2lzVGFibGVEaXNwbGF5ZWQnKTtcclxuICAgICAgICAgICAgY3RybC5pc1RhYmxlRGlzcGxheWVkKHRhYmxlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKS5pc1RhYmxlRGlzcGxheWVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0YWJsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXMgZGVsZWdhdGVkIHRvIGRhdGEgc2VydmljZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjdHJsO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ2V0RGVjaXNpb25Db3VudCgpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXREZWNpc2lvbkNvdW50JykuYW5kLnJldHVyblZhbHVlKDQzKTtcclxuICAgICAgICAgICAgbGV0IGNvdW50ID0gY3RybC5nZXREZWNpc2lvbkNvdW50KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldERlY2lzaW9uQ291bnQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvdW50KS50b0VxdWFsKDQzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93RXhwaXJhdGlvbkRhdGUoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSBhIGNvbnRyb2xsZXIgd2l0aCB0aGUgZ2l2ZW4gZGF0ZSAtIHRoZSBjZXJ0IHdpbGwgYWxzbyBiZSBsb2FkZWQgYWxyZWFkeS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDdHJsV2l0aEV4cGlyYXRpb24oZGF0ZSkge1xyXG4gICAgICAgICAgICBsZXQgY3RybDtcclxuICAgICAgICAgICAgY2VydC5leHBpcmF0aW9uID0gZGF0ZTtcclxuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGN0cmw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXRlKGRheXNGcm9tTm93KSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgICAgICBuZXdUaW1lID0gc3RhcnQuZ2V0VGltZSgpICsgKGRheXNGcm9tTm93ICogKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG5ld1RpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlIGNlcnRpZmljYXRpb24gaGFzIG5vIGV4cGlyYXRpb24gZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUN0cmxXaXRoRXhwaXJhdGlvbihudWxsKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2hvd0V4cGlyYXRpb25EYXRlKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGUgZXhwaXJhdGlvbiBpcyBtb3JlIHRoYW4gdHdvIHdlZWtzIGF3YXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDdHJsV2l0aEV4cGlyYXRpb24oZ2V0RGF0ZSgxNikpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zaG93RXhwaXJhdGlvbkRhdGUoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ICgncmV0dXJucyBmYWxzZSBpZiBjZXJ0IGlzIHNpZ25lZCBvZmYnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ3RybFdpdGhFeHBpcmF0aW9uKGdldERhdGUoLTIpKTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2lzU2lnbmVkT2ZmJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zaG93RXhwaXJhdGlvbkRhdGUoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlIGV4cGlyYXRpb24gZGF0ZSBpcyBsZXNzIHRoYW4gdHdvIHdlZWtzIGF3YXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDdHJsV2l0aEV4cGlyYXRpb24oZ2V0RGF0ZSgxMykpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5zaG93RXhwaXJhdGlvbkRhdGUoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGUgY2VydGlmaWNhdGlvbiBpcyBvdmVyZHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ3RybFdpdGhFeHBpcmF0aW9uKGdldERhdGUoLTIpKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2hvd0V4cGlyYXRpb25EYXRlKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnY2xlYXIgYnV0dG9uJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdpcyBkaXNhYmxlZCBpZiB0aGVyZSBhcmUgbm8gZGVjaXNpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0NsZWFyQnV0dG9uRW5hYmxlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIGVuYWJsZWQgaWYgdGhlcmUgYXJlIGRlY2lzaW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RGVjaXNpb25Db3VudCcpLmFuZC5yZXR1cm5WYWx1ZSg0Myk7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0NsZWFyQnV0dG9uRW5hYmxlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NsZWFyRGVjaXNpb25zKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2NhbGxzIHRocm91Z2ggdG8gY2xlYXIgZGVjaXNpb25zIG9uIGRlY2lzaW9uIHN0b3JlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnY2xlYXJEZWNpc2lvbnMnKTtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGN0cmwuY2xlYXJEZWNpc2lvbnMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuY2xlYXJEZWNpc2lvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzYXZlIGJ1dHRvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdpcyBkaXNhYmxlZCBpZiB0aGVyZSBhcmUgbm8gZGVjaXNpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1NhdmVCdXR0b25FbmFibGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgZW5hYmxlZCBpZiB0aGVyZSBhcmUgZGVjaXNpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXREZWNpc2lvbkNvdW50JykuYW5kLnJldHVyblZhbHVlKDQzKTtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU2F2ZUJ1dHRvbkVuYWJsZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGZha2VDZXJ0LCBmYWtlRGVjaXNpb25zLCBzYXZlUmV0dXJuVmFsLCBkZWZlcnJlZCwgZmFpbGVkUmVzcG9uc2U7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGZha2VDZXJ0ID0gbmV3IENlcnRpZmljYXRpb24oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fMSk7XHJcbiAgICAgICAgICAgIGZha2VEZWNpc2lvbnMgPSBbICdoaSBtb20hJyBdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcHlPbkdldERlY2lzaW9ucygpIHtcclxuICAgICAgICAgICAgLy8gTG9hZGluZyB0aGUgY2VydCByZXNldHMgdGhlIGRlY2lzaW9ucyBvYmplY3Qgd2l0aCBhIG5ldyBvYmplY3QsIHNvIHdlIGhhdmUgdG8gc3B5IGFmdGVyIGNyZWF0aW9uLlxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RGVjaXNpb25zJykuYW5kLnJldHVyblZhbHVlKGZha2VEZWNpc2lvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXAoZ3JlYXRTdWNjZXNzLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0geyBzdGF0dXM6IHN0YXR1cyB9O1xyXG4gICAgICAgICAgICBzYXZlUmV0dXJuVmFsID0gKGdyZWF0U3VjY2VzcykgPyAkcS53aGVuKHsgZGF0YTogeyBvYmplY3Q6IGZha2VDZXJ0IH0gfSkgOiAkcS5yZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ3NhdmVEZWNpc2lvbnMnKS5hbmQucmV0dXJuVmFsdWUoc2F2ZVJldHVyblZhbCk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2luaXRpYWxpemUnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAncmVmcmVzaFZpZXcnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwRm9yU2F2ZVJldHJ5RGlhbG9nKCkge1xyXG4gICAgICAgICAgICBmYWlsZWRSZXNwb25zZSA9IHsgc3RhdHVzOiA0MDkgfTtcclxuICAgICAgICAgICAgc2F2ZVJldHVyblZhbCA9ICRxLnJlamVjdChmYWlsZWRSZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogZGVmZXJyZWQucHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2F2ZURlY2lzaW9ucycpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2F2ZVJldHVyblZhbDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnY2FsbHMgdGhlIGNlcnRpZmljYXRpb24gc2VydmljZSB3aXRoIHRoZSBkZWNpc2lvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXAodHJ1ZSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBzcHlPbkdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZS5jYWxscy5yZXNldCgpO1xyXG4gICAgICAgICAgICBjdHJsLnNhdmUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0LmlkLCBmYWtlRGVjaXNpb25zKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0Q2VydGlmaWNhdGlvbigpKS50b0VxdWFsKGZha2VDZXJ0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlaW5pdGlhbGl6ZWQgdGhlIGRhdGEgc2VydmljZSBhZnRlciBhIHN1Y2Nlc3NmdWwgc2F2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cCh0cnVlLCAyMDApO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIHNweU9uR2V0RGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIGN0cmwuc2F2ZSgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWtlQ2VydCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnJlZnJlc2hWaWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2dvZXMgdG8gcHJldmlvdXMgcGFnZSBpZiBsYXN0IGRlY2lzaW9uIG9uIGxhc3QgcGFnZSBpcyBmaW5pc2hlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBzYXZlIGNhbGwgcmV0dXJuIGEgY2VydCB0aGF0IGhhcyBvbmx5IDMwIFwiZGVjaXNpb25zIGxlZnRcIiBpdGVtcy4gIFRvdGFsID0gMzMuXHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ09wZW4nLCAwKTtcclxuICAgICAgICAgICAgc2V0QWxsQ291bnRzKGZha2VDZXJ0LCAnRGVsZWdhdGVkJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ1JldHVybmVkJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ0NvbXBsZXRlJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ0NoYWxsZW5nZWQnLCAwKTtcclxuICAgICAgICAgICAgc2V0QWxsQ291bnRzKGZha2VDZXJ0LCAnV2FpdGluZ1JldmlldycsIDApO1xyXG4gICAgICAgICAgICBmYWtlQ2VydC5pdGVtU3RhdHVzQ291bnQuY291bnRzLkJ1bmRsZS5PcGVuID0gMzA7XHJcbiAgICAgICAgICAgIGZha2VDZXJ0Lml0ZW1TdGF0dXNDb3VudC5jb3VudHMuQnVuZGxlLkNvbXBsZXRlID0gMztcclxuXHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGZha2VDZXJ0KTtcclxuXHJcbiAgICAgICAgICAgIHNldHVwKHRydWUsIDIwMCk7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbkdldERlY2lzaW9ucygpO1xyXG5cclxuICAgICAgICAgICAgLy8gR28gdG8gdGhlIGxhc3QgcGFnZS5cclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0Q3VycmVudFRhYkNvbmZpZygpLnRhYmxlcy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGxldCB0YWJsZSA9IGN0cmwuZ2V0Q3VycmVudFRhYkNvbmZpZygpLnRhYmxlc1swXTtcclxuICAgICAgICAgICAgdGFibGUuZ2V0RGF0YVRhYmxlQ29uZmlnKCkuZ2V0UGFnZVN0YXRlKCkucGFnaW5nRGF0YS5jdXJyZW50UGFnZSA9IDQ7XHJcblxyXG4gICAgICAgICAgICAvLyBTYXZlLlxyXG4gICAgICAgICAgICBjdHJsLnNhdmUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlJ3JlIG5vdyBvbiB0aGUgdGhpcmQgcGFnZS5cclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmdldERhdGFUYWJsZUNvbmZpZygpLmdldFBhZ2VTdGF0ZSgpLnBhZ2luZ0RhdGEuY3VycmVudFBhZ2UpLnRvRXF1YWwoMyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZWZyZXNoZXMgdGhlIGxpc3QgYWZ0ZXIgYSBzdWNjZXNzZnVsIHNhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXAodHJ1ZSwgMjAwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbkdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCksICdyZWZyZXNoQ3VycmVudFRhYicpO1xyXG4gICAgICAgICAgICBjdHJsLnNhdmUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCkucmVmcmVzaEN1cnJlbnRUYWIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHJlaW5pdGlhbGl6ZSB3aXRoIGNlcnQgYW5kIGNsZWFyIGRlY2lzaW9ucyBpZiBzYXZpbmcgZmFpbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXAoZmFsc2UsIDQwNCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgc3B5T25HZXREZWNpc2lvbnMoKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgY3RybC5zYXZlKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCByZWZyZXNoIHRoZSBsaXN0IGlmIHNhdmluZyBmYWlscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cChmYWxzZSwgNDA0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbkdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCksICdyZWZyZXNoQ3VycmVudFRhYicpO1xyXG4gICAgICAgICAgICBjdHJsLnNhdmUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCkucmVmcmVzaEN1cnJlbnRUYWIpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyByZXRyeSBkaWFsb2cgaWYgc2F2aW5nIGZhaWxzIHdpdGggNDA5IHN0YXR1cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cEZvclNhdmVSZXRyeURpYWxvZygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uR2V0RGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgIGN0cmwuc2F2ZSgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2Uuc2F2ZURlY2lzaW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAvL3JldHJ5IGRpYWxvZyBmb3IgbG9ja2VkIGNlcnRcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIC8vbG9ja2VkIGNlcnQgLSBkb24ndCBzYXZlXHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChzYXZlUmV0dXJuVmFsKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnNhdmVEZWNpc2lvbnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdmaXJzdCBvcGVucyByZXRyeSBkaWFsb2cgZm9yIDQwOSBzdGF0dXMgYW5kIHRoZW4gcmVzb2x2ZXMgc3VjY2Vzc2Z1bGx5IHdoZW4gY2VydCB1bmxvY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cEZvclNhdmVSZXRyeURpYWxvZygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCksXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBvYmplY3Q6IGZha2VDZXJ0IH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzcHlPbkdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBjdHJsLnNhdmUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgLy9yZXRyeSBkaWFsb2cgb3BlbmVkIGZvciBsb2NrZWQgY2VydFxyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIC8vc2F2aW5nIGEgbG9ja2VkIGNlcnRcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgkcS53aGVuKGZhaWxlZFJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIC8vcmV0cnkgZGlhbG9nIG9wZW5lZCBmb3IgbG9ja2VkIGNlcnRcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHNwTW9kYWwub3Blbi5jYWxscy5yZXNldCgpO1xyXG4gICAgICAgICAgICAvL3NhdmluZyBhbiB1bmxvY2tlZCBjZXJ0XHJcbiAgICAgICAgICAgIHNhdmVSZXR1cm5WYWwgPSAkcS53aGVuKHN1Y2Nlc3NSZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJHEud2hlbihzdWNjZXNzUmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnNhdmVEZWNpc2lvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2lnbicsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgZGVmZXJyZWQsIHNhdmVSZXR1cm5WYWwsIGZhaWxlZFJlc3BvbnNlO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHlPbihlbGVjdHJvbmljU2lnbmF0dXJlU2VydmljZSwgJ29wZW5EaWFsb2cnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6ICd0ZXN0JyxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogJ3h5enp5J1xyXG4gICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBzcHlPbihuYXZpZ2F0aW9uU2VydmljZSwgJ2JhY2snKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBGb3JTaWduT2ZmUmV0cnlEaWFsb2coKSB7XHJcbiAgICAgICAgICAgIGZhaWxlZFJlc3BvbnNlID0geyBzdGF0dXM6IDQwOSB9O1xyXG4gICAgICAgICAgICBzYXZlUmV0dXJuVmFsID0gJHEucmVqZWN0KGZhaWxlZFJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dldENvbmZpZ3VyYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkNvbmZpZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgc29tZUNvbmZpZzogJ3Rlc3QnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogZGVmZXJyZWQucHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2lnbk9mZicpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2F2ZVJldHVyblZhbDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnb3BlbnMgdGhlIGVzaWcgZGlhbG9nIHdoZW4gZXNpZyBpcyBjb25maWd1cmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpLFxyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWUgPSAndGVzdCcsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZCA9ICd4eXp6eSc7XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDb25maWd1cmF0aW9uJykuYW5kLnJldHVyblZhbHVlKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uQ29uZmlnKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXNpZ01lYW5pbmc6ICdFc2lnJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2lnbk9mZicpO1xyXG4gICAgICAgICAgICBjdHJsLnNpZ24oKTtcclxuICAgICAgICAgICAgZXhwZWN0KGVsZWN0cm9uaWNTaWduYXR1cmVTZXJ2aWNlLm9wZW5EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnNpZ25PZmYpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnQuaWQsIHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyB0aGUgY29tcGxldGlvbiBkaWFsb2cgZm9yIHNpZ25PZmYgd2hlbiBlc2lnIGlzIG5vdCBjb25maWd1cmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDb25maWd1cmF0aW9uJykuYW5kLnJldHVyblZhbHVlKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uQ29uZmlnKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29tZUNvbmZpZzogJ3Rlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdzaWduT2ZmJyk7XHJcbiAgICAgICAgICAgIGN0cmwuc2lnbigpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChlbGVjdHJvbmljU2lnbmF0dXJlU2VydmljZS5vcGVuRGlhbG9nKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2Uuc2lnbk9mZikudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydC5pZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyBuYXZpZ2F0aW9uIHNlcnZpY2UgYWZ0ZXIgc2lnbk9mZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkNvbmZpZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVzaWdNZWFuaW5nOiAnRXNpZydcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ3NpZ25PZmYnKTtcclxuICAgICAgICAgICAgY3RybC5zaWduKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5iYWNrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBkaWFsb2cgaWYgdGhlcmUgaXMgYSBzaWdub2ZmIGJsb2NrZWQgcmVhc29uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsLCByZWFzb24gPSAnZG9udCBzaWduIHRoaXMgZHVtbXknO1xyXG4gICAgICAgICAgICBjZXJ0LnNpZ25vZmZCbG9ja2VkUmVhc29uID0gcmVhc29uO1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoZmFsc2UpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDb25maWd1cmF0aW9uJykuYW5kLnJldHVyblZhbHVlKFxyXG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25Db25maWcoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvbWVDb25maWc6ICd0ZXN0J1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdzaWduT2ZmJyk7XHJcbiAgICAgICAgICAgIGN0cmwuc2lnbigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0ucmVzb2x2ZS5yZWFzb24oKSkudG9FcXVhbChyZWFzb24pO1xyXG4gICAgICAgICAgICBleHBlY3QoZWxlY3Ryb25pY1NpZ25hdHVyZVNlcnZpY2Uub3BlbkRpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnNpZ25PZmYpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyByZXRyeSBkaWFsb2cgaWYgc2lnbk9mZiBmYWlscyB3aXRoIDQwOSBzdGF0dXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0dXBGb3JTaWduT2ZmUmV0cnlEaWFsb2coKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBjdHJsLnNpZ24oKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgLy9jb21wbGV0aW9uIGRpYWxvZ1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgc3BNb2RhbC5vcGVuLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5zaWduT2ZmKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLnNpZ25PZmYuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgLy9yZXRyeSBkaWFsb2dcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoc2F2ZVJldHVyblZhbCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5zaWduT2ZmKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZmlyc3Qgb3BlbnMgcmV0cnkgZGlhbG9nIGZvciA0MDkgc3RhdHVzIGFuZCB0aGVuIHNpZ25PZmYgc3VjY2Vzc2Z1bGx5IHdoZW4gY2VydCB1bmxvY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXR1cEZvclNpZ25PZmZSZXRyeURpYWxvZygpO1xyXG4gICAgICAgICAgICBsZXQgc3VjY2Vzc1Jlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgb2JqZWN0OiBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKSB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwuc2lnbigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAvL2NvbXBsZXRpb24gZGlhbG9nXHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICBzcE1vZGFsLm9wZW4uY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgLy9yZXRyeSBkaWFsb2cgZm9yIGxvY2tlZCBjZXJ0XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgkcS53aGVuKGZhaWxlZFJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgIHNwTW9kYWwub3Blbi5jYWxscy5yZXNldCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2Uuc2lnbk9mZikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAvL2NvbXBsZXRpb24gZGlhbG9nXHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICBzcE1vZGFsLm9wZW4uY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2Uuc2lnbk9mZi5jYWxscy5yZXNldCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAvL3NhdmluZyBhbiB1bmxvY2tlZCBjZXJ0XHJcbiAgICAgICAgICAgIC8vcmV0cnkgZGlhbG9nXHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgc2F2ZVJldHVyblZhbCA9ICRxLndoZW4oc3VjY2Vzc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgkcS53aGVuKHN1Y2Nlc3NSZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2Uuc2lnbk9mZikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzQ29tcGxldGUnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGZha2VDZXJ0O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBmYWtlQ2VydCA9IG5ldyBDZXJ0aWZpY2F0aW9uKGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUSUZJQ0FUSU9OXzEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgZmFsc2UgaWYgY29tcGxldGVkIGl0ZW1zIGRvIG5vdCBlcXVhbCB0b3RhbCBpdGVtcycsICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ09wZW4nLCAwKTtcclxuICAgICAgICAgICAgc2V0QWxsQ291bnRzKGZha2VDZXJ0LCAnRGVsZWdhdGVkJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ1JldHVybmVkJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ0NvbXBsZXRlJywgMyk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGZha2VDZXJ0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb21wbGV0ZSgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIHRydWUgaWYgY29tcGxldGVkIGl0ZW1zIGVxdWFsIHRvdGFsIGl0ZW1zLCByZWdhcmRsZXNzIG9mIGNvbXBsZXRlIGZsYWcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ09wZW4nLCAwKTtcclxuICAgICAgICAgICAgc2V0QWxsQ291bnRzKGZha2VDZXJ0LCAnRGVsZWdhdGVkJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ1JldHVybmVkJywgMCk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ0NvbXBsZXRlJywgMSk7XHJcbiAgICAgICAgICAgIHNldEFsbENvdW50cyhmYWtlQ2VydCwgJ1dhaXRpbmdSZXZpZXcnLCAwKTtcclxuICAgICAgICAgICAgc2V0QWxsQ291bnRzKGZha2VDZXJ0LCAnQ2hhbGxlbmdlZCcsIDApO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShmYWtlQ2VydCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZ25vcmUgdGhpcyBmbGFnIGZvciB0aGVzZSBwdXJwb3Nlcywgc2luY2UgY2FuIGJlIGZhbHNlIGZvciBvdGhlciByZWFzb25zLlxyXG4gICAgICAgICAgICBjZXJ0LmNvbXBsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0NvbXBsZXRlKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBmYWxzZSBpZiB0aGVyZSBhcmUgcGVuZGluZyBkZWNpc2lvbnMsIHJlZ2FyZGxlc3Mgb2YgaXRlbSBjb3VudCcsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucywgJ2dldERlY2lzaW9uQ291bnQnKS5hbmQucmV0dXJuVmFsdWUoMik7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0NvbXBsZXRlKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzU2lnbmVkT2ZmJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdpcyBmYWxzZSBpZiBjZXJ0IGlzIG5vdCBzaWduZWRPZmYnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnQuc2lnbk9mZkNvbXBsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1NpZ25lZE9mZigpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIHRydWUgaWYgY2VydCBpcyBzaWduZWRPZmYnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnQuc2lnbk9mZkNvbXBsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU2lnbmVkT2ZmKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd0RhdGVGaWVsZCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0ICgncmV0dXJucyBmYWxzZSBpZiBzaG93RXhwaXJhdGlvbkRhdGUgYW5kIGlzU2lnbmVkT2ZmIGFyZSBib3RoIGZhbHNlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ3Nob3dFeHBpcmF0aW9uRGF0ZScpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc1NpZ25lZE9mZicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnNob3dEYXRlRmllbGQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ICgncmV0dXJucyB0cnVlIGlmIHNob3dFeHBpcmF0aW9uRGF0ZSBpcyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ3Nob3dFeHBpcmF0aW9uRGF0ZScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2lzU2lnbmVkT2ZmJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2hvd0RhdGVGaWVsZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCAoJ3JldHVybnMgdHJ1ZSBpZiBpc1NpZ25lZE9mZiBpcyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ3Nob3dFeHBpcmF0aW9uRGF0ZScpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc1NpZ25lZE9mZicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuc2hvd0RhdGVGaWVsZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldEJ1bGtEZWNpc2lvbnMoKScsICgpID0+IHtcclxuICAgICAgICBsZXQgQ2VydGlmaWNhdGlvblZpZXdTdGF0ZTtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF9DZXJ0aWZpY2F0aW9uVmlld1N0YXRlXykgPT4ge1xyXG4gICAgICAgICAgICBDZXJ0aWZpY2F0aW9uVmlld1N0YXRlID0gX0NlcnRpZmljYXRpb25WaWV3U3RhdGVfO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYnVsayBkZWNpc2lvbnMgZm9yIGEgY29tcGxldGUgdGFiIGZyb20gY29uZmlndXJhdGlvbiBpZiBsb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidWxrRGVjaXNpb25zID0gWydkZWNpc2lvbjEnLCAnZGVjaXNpb24yJywgJ1JlYXNzaWduJywgJ0NsZWFyZWQnXSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkQnVsa0RlY2lzaW9ucyA9IFsnUmVhc3NpZ24nLCAnQ2xlYXJlZCddLFxyXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICBidWxrRGVjaXNpb25zOiBidWxrRGVjaXNpb25zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnZ2V0Q3VycmVudFRhYicpLmFuZC5yZXR1cm5WYWx1ZShDZXJ0aWZpY2F0aW9uVmlld1N0YXRlLlRhYi5Db21wbGV0ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEJ1bGtEZWNpc2lvbnMoKSkudG9FcXVhbChmaWx0ZXJlZEJ1bGtEZWNpc2lvbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmaWx0ZXJlZCBidWxrIGRlY2lzaW9ucyBmb3IgRGVjaXNpb25zTGVmdCB0YWInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidWxrRGVjaXNpb25zID0gWydkZWNpc2lvbjEnLCAnZGVjaXNpb24yJywgJ0NsZWFyZWQnXSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkQnVsa0RlY2lzaW9ucyA9IFsnZGVjaXNpb24xJywgJ2RlY2lzaW9uMiddLFxyXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICBidWxrRGVjaXNpb25zOiBidWxrRGVjaXNpb25zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnZ2V0Q3VycmVudFRhYicpLmFuZC5yZXR1cm5WYWx1ZSgnRGVjaXNpb25zTGVmdCcpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRCdWxrRGVjaXNpb25zKCkubGVuZ3RoKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRCdWxrRGVjaXNpb25zKCkpLnRvRXF1YWwoZmlsdGVyZWRCdWxrRGVjaXNpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmlsdGVyZWQgYnVsayBkZWNpc2lvbnMgZm9yIGFjdGlvbiByZXF1aXJlZCB0YWInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidWxrRGVjaXNpb25zID0gWydkZWNpc2lvbjEnLCAnZGVjaXNpb24yJywgJ1JlYXNzaWduJywgJ0NsZWFyZWQnXSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkQnVsa0RlY2lzaW9ucyA9IFsnUmVhc3NpZ24nXSxcclxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dldENvbmZpZ3VyYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgYnVsa0RlY2lzaW9uczogYnVsa0RlY2lzaW9uc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3B5T24oY3RybCwgJ2dldEN1cnJlbnRUYWInKS5hbmQucmV0dXJuVmFsdWUoQ2VydGlmaWNhdGlvblZpZXdTdGF0ZS5UYWIuQWN0aW9uUmVxdWlyZWQpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRCdWxrRGVjaXNpb25zKCkpLnRvRXF1YWwoZmlsdGVyZWRCdWxrRGVjaXNpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgbnVsbCBpZiBjb25maWd1cmF0aW9uIGlzIG5vdCBsb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDb25maWd1cmF0aW9uJykuYW5kLnJldHVyblZhbHVlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEJ1bGtEZWNpc2lvbnMoKSkudG9FcXVhbChudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdnb0JhY2soKScsICgpID0+IHtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIG5hdmlnYXRpb24gc2VydmljZSB0byBnbyBiYWNrIHRvIHByZXZpb3VzIHBhZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKG5hdmlnYXRpb25TZXJ2aWNlLCAnYmFjaycpO1xyXG4gICAgICAgICAgICBjdHJsLmdvQmFjaygpO1xyXG4gICAgICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2UuYmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dNb2JpbGVFbnRpdHlEZXRhaWxzKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ29wZW5zIGRpYWxvZyB0byBzaG93IGVudGl0eSBkZXRhaWxzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZW50aXR5ID0ge3NvbWU6ICdlbnRpdHknfSxcclxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdnZXRFbnRpdHknKS5hbmQucmV0dXJuVmFsdWUoZW50aXR5KTtcclxuICAgICAgICAgICAgY3RybC5zaG93TW9iaWxlRW50aXR5RGV0YWlscygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJnc1swXS5yZXNvbHZlLmVudGl0eSgpKS50b0VxdWFsKGVudGl0eSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnbW9iaWxlIGVudGl0eSBzZWFyY2gnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGN0cmw7XHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKGN0cmwuZW50aXR5TGlzdFJlZnJlc2hUcmlnZ2VyLCAncmVmcmVzaCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnbW9iaWxlRW50aXR5U2VhcmNoKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdGhpbmcgd2l0aCBldmVudCB3aXRoIGtleUNvZGUgb3RoZXIgdGhhbiAxMyAoZW50ZXIpJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY2FsbCBvbmNlIHRvIHRvZ2dsZSBzZWFyY2ggb25cclxuICAgICAgICAgICAgICAgIGN0cmwubW9iaWxlRW50aXR5U2VhcmNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2FsbCBhZ2FpbiB3aXRoIG5vbi1lbnRlciBldmVudFxyXG4gICAgICAgICAgICAgICAgY3RybC5tb2JpbGVFbnRpdHlTZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGtleUNvZGU6IDIzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5lbnRpdHlMaXN0UmVmcmVzaFRyaWdnZXIucmVmcmVzaCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmVmcmVzaGVzIHdpdGgga2V5Q29kZSAxMyAoZW50ZXIpJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY2FsbCBvbmNlIHRvIHRvZ2dsZSBzZWFyY2ggb25cclxuICAgICAgICAgICAgICAgIGN0cmwubW9iaWxlRW50aXR5U2VhcmNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2FsbCBhZ2FpbiB3aXRoIGVudGVyIGV2ZW50XHJcbiAgICAgICAgICAgICAgICBjdHJsLm1vYmlsZUVudGl0eVNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5Q29kZTogMTNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmVudGl0eUxpc3RSZWZyZXNoVHJpZ2dlci5yZWZyZXNoKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3RvZ2dsZXMgc2VhcmNoaW5nIGlmIG5vdCBhbHJlYWR5IHRvZ2dsZWQgb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLm1vYmlsZUVudGl0eVNlYXJjaCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0TW9iaWxlRW50aXR5TGlzdFN0YXRlKCkuc2VhcmNoaW5nKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZW50aXR5TGlzdFJlZnJlc2hUcmlnZ2VyLnJlZnJlc2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JlZnJlc2hlcyB0cmlnZ2VyIGlmIHNlYXJjaGluZyBhbHJlYWR5IHRvZ2dsZWQgb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLm1vYmlsZUVudGl0eVNlYXJjaCgpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5tb2JpbGVFbnRpdHlTZWFyY2goKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmVudGl0eUxpc3RSZWZyZXNoVHJpZ2dlci5yZWZyZXNoKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnbW9iaWxlRW50aXR5U2VhcmNoQ2xlYXIoKScsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ2NsZWFycyBzZWFyY2ggdGVybSBhbmQgcmVmcmVzaGVzIHRyaWdnZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmdldE1vYmlsZUVudGl0eUxpc3RTdGF0ZSgpLmVudGl0eVNlYXJjaFRlcm0gPSAnYWJjJztcclxuICAgICAgICAgICAgICAgIGN0cmwubW9iaWxlRW50aXR5U2VhcmNoQ2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldE1vYmlsZUVudGl0eUxpc3RTdGF0ZSgpLmVudGl0eVNlYXJjaFRlcm0pLnRvRXF1YWwodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmVudGl0eUxpc3RSZWZyZXNoVHJpZ2dlci5yZWZyZXNoKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3RvZ2dsZXMgc2VhcmNoIG9mZicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuZ2V0TW9iaWxlRW50aXR5TGlzdFN0YXRlKCkuc2VhcmNoaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGN0cmwubW9iaWxlRW50aXR5U2VhcmNoQ2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldE1vYmlsZUVudGl0eUxpc3RTdGF0ZSgpLnNlYXJjaGluZykudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnaXNNb2JpbGVFbnRpdHlTZWFyY2goKScsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgc2VhcmNoaW5nIGZsYWcgZnJvbSBtb2JpbGUgZW50aXR5IGxpc3Qgc3RhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmdldE1vYmlsZUVudGl0eUxpc3RTdGF0ZSgpLnNlYXJjaGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc01vYmlsZUVudGl0eVNlYXJjaCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
