System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('certificationDataService', function () {

                var certificationDataService = undefined,
                    CertificationDecision = undefined,
                    certificationTestData = undefined,
                    CertificationViewState = undefined,
                    CertificationItem = undefined,
                    Certification = undefined,
                    CertificationActionStatus = undefined,
                    cert = undefined,
                    worksheetMocks = undefined,
                    detailMocks = undefined,
                    certificationEntityService = undefined,
                    $q = undefined,
                    $rootScope = undefined;

                function getStatus(status) {
                    return new CertificationActionStatus({
                        status: status
                    });
                }

                /**
                 * Mock out the methods on the given CertificationViewState class so that we can spy on them.
                 */
                function setupViewStateMocks(clazz) {
                    var mocks = {
                        reset: jasmine.createSpy('reset'),
                        setupCheckboxModels: jasmine.createSpy('setupCheckboxModels'),
                        initializeFilters: jasmine.createSpy('initializeFilters'),
                        getSelectionModelScope: jasmine.createSpy('getSelectionModelScope'),
                        refreshCurrentTab: jasmine.createSpy('refreshCurrentTab')
                    };

                    angular.forEach(mocks, function (mock, methodName) {
                        clazz.prototype[methodName] = mock;
                    });

                    return mocks;
                }

                beforeEach(module(certificationModule));

                beforeEach(inject(function (CertificationWorksheetViewState, CertificationDetailViewState) {
                    worksheetMocks = setupViewStateMocks(CertificationWorksheetViewState);
                    detailMocks = setupViewStateMocks(CertificationDetailViewState);
                }));

                /* jshint maxparams:10 */
                beforeEach(inject(function (_certificationDataService_, _CertificationDecision_, _CertificationItem_, _certificationTestData_, _Certification_, _CertificationViewState_, _CertificationActionStatus_, _certificationEntityService_, _$q_, _$rootScope_) {
                    certificationDataService = _certificationDataService_;
                    CertificationDecision = _CertificationDecision_;
                    CertificationItem = _CertificationItem_;
                    certificationTestData = _certificationTestData_;
                    Certification = _Certification_;
                    CertificationViewState = _CertificationViewState_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    certificationEntityService = _certificationEntityService_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;

                    cert = new Certification(certificationTestData.CERTIFICATION_1);
                }));

                describe('initialize()', function () {
                    it('sets the certification', function () {
                        certificationDataService.initialize(cert);
                        expect(certificationDataService.certification).toEqual(cert);
                    });

                    it('clears the decisions', function () {
                        var decision = CertificationDecision.createItemDecision({ id: 'abcd' }, getStatus('Approved'));
                        certificationDataService.decisions.addDecision(decision);
                        certificationDataService.initialize(cert);
                        expect(certificationDataService.decisions.getDecisionCount()).toEqual(0);
                    });

                    it('sets up view state', function () {
                        certificationDataService.initialize(cert);
                        expect(certificationDataService.getViewState()).toBeDefined();
                    });

                    it('clears the selectedEntity if specified', function () {
                        certificationDataService.initialize(cert);
                        certificationDataService.selectedEntity = { some: 'person' };
                        certificationDataService.initialize(cert, true);
                        expect(certificationDataService.selectedEntity).not.toBeDefined();
                    });

                    it('leaves the selectedEntity if not specified', function () {
                        certificationDataService.initialize(cert);
                        certificationDataService.selectedEntity = { some: 'person' };
                        certificationDataService.initialize(cert, false);
                        expect(certificationDataService.selectedEntity).toEqual({ some: 'person' });
                    });

                    it('notifies all certification load listeners', function () {
                        var listener1 = createCertLoadListener();
                        var listener2 = createCertLoadListener();

                        certificationDataService.registerCertificationLoadListener(listener1);
                        certificationDataService.registerCertificationLoadListener(listener2);

                        certificationDataService.initialize(cert);
                        expect(listener1.certificationLoaded).toHaveBeenCalledWith(cert);
                        expect(listener2.certificationLoaded).toHaveBeenCalledWith(cert);
                    });

                    it('resets mobile entity view state', function () {
                        spyOn(certificationDataService.mobileEntityViewState, 'reset');
                        certificationDataService.initialize(cert);
                        expect(certificationDataService.mobileEntityViewState.reset).toHaveBeenCalledWith(cert);
                    });
                });

                function createCertLoadListener() {
                    return {
                        certificationLoaded: jasmine.createSpy('certificationLoaded')
                    };
                }

                describe('register certification load listener', function () {
                    it('adds a listener', function () {
                        var listener = {};
                        certificationDataService.registerCertificationLoadListener(listener);
                        expect(certificationDataService.certificationLoadListeners.length).toEqual(1);
                    });

                    it('calls the listener immediately if a certification is already initialized', function () {
                        certificationDataService.initialize(cert);
                        var listener = createCertLoadListener();
                        certificationDataService.registerCertificationLoadListener(listener);
                        expect(listener.certificationLoaded).toHaveBeenCalledWith(cert);
                    });

                    it('does not call the listener immediately if a certification is not initialized', function () {
                        var listener = createCertLoadListener();
                        certificationDataService.registerCertificationLoadListener(listener);
                        expect(listener.certificationLoaded).not.toHaveBeenCalled();
                    });
                });

                describe('deregister certification load listener', function () {
                    it('does nothing if the listener has not been registered', function () {
                        certificationDataService.registerCertificationLoadListener({});
                        certificationDataService.deregisterCertificationLoadListener({ something: 'new' });
                        expect(certificationDataService.certificationLoadListeners.length).toEqual(1);
                    });

                    it('removes the listener', function () {
                        var listener = {};
                        certificationDataService.registerCertificationLoadListener(listener);
                        certificationDataService.deregisterCertificationLoadListener(listener);
                        expect(certificationDataService.certificationLoadListeners.length).toEqual(0);
                    });
                });

                describe('configuration', function () {
                    it('is initially undefined', function () {
                        expect(certificationDataService.getConfiguration()).not.toBeDefined();
                    });

                    it('sets the configuration', function () {
                        var config = { config: 'this' };
                        certificationDataService.initializeConfiguration(config);
                        expect(certificationDataService.getConfiguration()).toBe(config);
                    });
                });

                describe('checkbox models', function () {
                    beforeEach(function () {
                        spyOn(certificationDataService, 'isCheckboxRequired').and.returnValue(true);
                    });

                    it('are not set after initialize with no configuration', function () {
                        certificationDataService.initialize(cert);
                        expect(worksheetMocks.setupCheckboxModels).not.toHaveBeenCalled();
                    });

                    it('are not set after configuration initialization with no cert', function () {
                        certificationDataService.initializeConfiguration({});
                        expect(worksheetMocks.setupCheckboxModels).not.toHaveBeenCalled();
                    });

                    it('are setup after initializing both cert and configuration', function () {
                        certificationDataService.initialize(cert);
                        certificationDataService.initializeConfiguration(cert);
                        expect(worksheetMocks.setupCheckboxModels).toHaveBeenCalledWith(true);
                    });
                });

                describe('initializeDataTableFilters()', function () {
                    it('sets filters on the DecisionsLeft and Complete tables', function () {
                        var filters = { i: 'amTheFilters' };
                        certificationDataService.initializeDataTableFilters(filters);
                        expect(certificationDataService.getViewState().initializeFilters).toHaveBeenCalledWith(filters);
                    });
                });

                describe('isCertificationEditable', function () {
                    it('return false if certification is not defined', function () {
                        expect(certificationDataService.isCertificationEditable()).toEqual(false);
                    });

                    it('returns false if certification config is not defined', function () {
                        certificationDataService.initialize({ id: '1234', some: 'cert', phase: 'Active' });
                        expect(certificationDataService.isCertificationEditable()).toEqual(false);
                    });

                    it('returns false if certification and config are defined but cert is not editable', function () {
                        certificationDataService.initialize({ id: '1234', some: 'cert', editable: false });
                        certificationDataService.initializeConfiguration({ some: 'config' });
                        expect(certificationDataService.isCertificationEditable()).toEqual(false);
                    });

                    it('returns true if certification and config are defined and cert is editable', function () {
                        certificationDataService.initialize({ id: '1234', some: 'cert', editable: true });
                        certificationDataService.initializeConfiguration({ some: 'config' });
                        expect(certificationDataService.isCertificationEditable()).toEqual(true);
                    });
                });

                describe('needsRemediationSummary()', function () {
                    it('returns true if cert item subtype is a role and showRoleRevocationDetails is true', function () {
                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[1]);
                        certificationDataService.initializeConfiguration({
                            showRoleRevocationDetails: true,
                            revocationModificationEnabled: false
                        });
                        expect(certificationDataService.needsRemediationSummary(certItem, false)).toEqual(true);
                    });

                    it('returns false if cert item subtype is a role and showRoleRevocationDetails is false', function () {
                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[1]);
                        certificationDataService.initializeConfiguration({
                            showRoleRevocationDetails: false,
                            revocationModificationEnabled: false
                        });
                        expect(certificationDataService.needsRemediationSummary(certItem, false)).toEqual(false);
                    });

                    it('returns false if cert item subtype is a role and showRoleRevocationDetails is true but ' + 'skipRoleRevocationDetails is true', function () {
                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[1]);
                        certificationDataService.initializeConfiguration({
                            showRoleRevocationDetails: true,
                            revocationModificationEnabled: false
                        });
                        expect(certificationDataService.needsRemediationSummary(certItem, true)).toEqual(false);
                    });

                    it('returs true if cert item subtype not a role and revocationModificationEnabled is true', function () {
                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[0]);
                        certificationDataService.initializeConfiguration({
                            revocationModificationEnabled: true,
                            showRoleRevocationDetails: true
                        });
                        expect(certificationDataService.needsRemediationSummary(certItem)).toEqual(true);
                    });

                    it('returns false if cert item subtype is not a role and revocationModificationEnabled is false', function () {
                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[0]);
                        certificationDataService.initializeConfiguration({
                            revocationModificationEnabled: false,
                            showRoleRevocationDetails: true
                        });
                        expect(certificationDataService.needsRemediationSummary(certItem)).toEqual(false);
                    });
                });

                it('gets processRevokesImmediately flag from the configuration', function () {
                    var config = { processRevokesImmediately: false };
                    certificationDataService.initializeConfiguration(config);
                    expect(certificationDataService.isProcessRevokesImmediately()).toEqual(config.processRevokesImmediately);
                });

                it('getTotalCount() delegates to CertificationItemStatusCount', function () {
                    spyOn(cert.itemStatusCount, 'getTotalCount').and.returnValue(43);
                    certificationDataService.initialize(cert);
                    var count = certificationDataService.getTotalCount();
                    expect(cert.itemStatusCount.getTotalCount).toHaveBeenCalled();
                    expect(count).toEqual(43);
                });

                it('getCompleteCount() delegates to CertificationItemStatusCount', function () {
                    spyOn(cert.itemStatusCount, 'getCompleteCount').and.returnValue(43);
                    certificationDataService.initialize(cert);
                    var count = certificationDataService.getCompleteCount();
                    expect(cert.itemStatusCount.getCompleteCount).toHaveBeenCalled();
                    expect(count).toEqual(43);
                });

                describe('view state', function () {
                    var rejectUnsavedDecisions = undefined;

                    beforeEach(function () {
                        rejectUnsavedDecisions = false;
                        certificationDataService.initialize(cert);
                        spyOn(certificationDataService, 'checkForUnsavedDecisions').and.callFake(function () {
                            return rejectUnsavedDecisions ? $q.reject() : $q.when();
                        });
                    });

                    describe('getViewState()', function () {
                        it('returns worksheet view when no entity is selected', function () {
                            certificationDataService.selectedEntity = undefined;
                            expect(certificationDataService.getViewState()).toEqual(certificationDataService.worksheetViewState);
                        });

                        it('returns detail view when an entity is selected', function () {
                            certificationDataService.selectedEntity = { some: 'person' };
                            expect(certificationDataService.getViewState()).toEqual(certificationDataService.detailViewState);
                        });
                    });

                    describe('goToWorksheetView', function () {
                        it('clears the selected identity', function () {
                            certificationDataService.selectedEntity = { some: 'person' };
                            certificationDataService.goToWorksheetView();
                            $rootScope.$apply();
                            expect(certificationDataService.selectedEntity).not.toBeDefined();
                            expect(certificationDataService.getViewState()).toEqual(certificationDataService.worksheetViewState);
                        });

                        it('clears entity list pager', function () {
                            certificationDataService.selectedEntity = { some: 'person' };
                            certificationDataService.entityListPager = { page: 'on' };
                            certificationDataService.goToWorksheetView();
                            $rootScope.$apply();
                            expect(certificationDataService.entityListPager).not.toBeDefined();
                        });

                        it('hides the entity list', function () {
                            certificationDataService.showEntityList = true;
                            certificationDataService.goToWorksheetView();
                            $rootScope.$apply();
                            expect(certificationDataService.showEntityList).toEqual(false);
                        });

                        it('does not clear selected identity if unsaved decision dialog is rejected', function () {
                            certificationDataService.selectedEntity = { some: 'person' };
                            rejectUnsavedDecisions = true;
                            certificationDataService.goToWorksheetView();
                            $rootScope.$apply();
                            expect(certificationDataService.checkForUnsavedDecisions).toHaveBeenCalled();
                            expect(certificationDataService.selectedEntity).toEqual({ some: 'person' });
                            expect(certificationDataService.getViewState()).toEqual(certificationDataService.detailViewState);
                        });

                        it('does not check for unsaved decisions if selectedEntity is not set', function () {
                            certificationDataService.selectedEntity = undefined;
                            certificationDataService.goToWorksheetView();
                            $rootScope.$apply();
                            expect(certificationDataService.checkForUnsavedDecisions).not.toHaveBeenCalled();
                        });
                    });

                    describe('goToDetailView', function () {
                        it('throws without an entityId', function () {
                            expect(function () {
                                certificationDataService.goToDetailView();
                            }).toThrow();
                        });

                        it('hides the entity list', function () {
                            var entity = { id: '1234', some: 'person' };
                            certificationDataService.showEntityList = true;
                            spyOn(certificationEntityService, 'getEntity').and.returnValue($q.when(entity));
                            certificationDataService.goToDetailView(entity.id);
                            $rootScope.$apply();
                            expect(certificationDataService.showEntityList).toEqual(false);
                        });

                        it('fetches the full entity then sets the selected entity and resets the detail view state', function () {
                            var entity = { id: '1234', some: 'person' };
                            spyOn(certificationEntityService, 'getEntity').and.returnValue($q.when(entity));
                            certificationDataService.goToDetailView(entity.id);
                            $rootScope.$apply();
                            expect(certificationDataService.selectedEntity).toEqual(entity);
                            expect(detailMocks.reset).toHaveBeenCalledWith(cert, entity);
                        });

                        it('does not fetch full entity if check for unsaved decisions is rejected', function () {
                            var entity = { id: '1234', some: 'person' };
                            spyOn(certificationEntityService, 'getEntity').and.returnValue($q.when(entity));
                            rejectUnsavedDecisions = true;
                            certificationDataService.goToDetailView(entity.id);
                            $rootScope.$apply();
                            expect(certificationDataService.checkForUnsavedDecisions).toHaveBeenCalled();
                            expect(detailMocks.reset).not.toHaveBeenCalled();
                        });

                        it('does not check for unsaved decisions if switching between entities', function () {
                            var entity = { id: '1234', some: 'person' };
                            spyOn(certificationEntityService, 'getEntity').and.returnValue($q.when(entity));
                            certificationDataService.selectedEntity = { another: 'entity' };
                            certificationDataService.goToDetailView(entity.id);
                            $rootScope.$apply();
                            expect(certificationDataService.checkForUnsavedDecisions).not.toHaveBeenCalled();
                            expect(detailMocks.reset).toHaveBeenCalled();
                        });

                        it('entity pager is saved if callback is supplied', function () {
                            var pager = { i: 'am a pager ... 1990s represent!!' };
                            var entityPagerCallback = jasmine.createSpy().and.callFake(function () {
                                return $q.when(pager);
                            });

                            var entity = { id: '1234', some: 'person' };
                            spyOn(certificationEntityService, 'getEntity').and.returnValue($q.when(entity));
                            certificationDataService.goToDetailView(entity.id, entityPagerCallback);
                            $rootScope.$apply();

                            expect(entityPagerCallback).toHaveBeenCalled();
                            expect(certificationDataService.entityListPager).toEqual(pager);
                        });
                    });

                    describe('refreshView()', function () {
                        it('refreshes and constrains for worksheet view', function () {
                            certificationDataService.initialize(cert);
                            certificationDataService.refreshView();
                            expect(worksheetMocks.reset).toHaveBeenCalled();
                            expect(worksheetMocks.refreshCurrentTab).toHaveBeenCalled();
                        });

                        it('fetches entity and resets view for detail view', function () {
                            var entity = { id: 'person' };
                            spyOn(certificationEntityService, 'getEntity').and.returnValue($q.when(entity));
                            certificationDataService.initialize(cert);
                            certificationDataService.goToDetailView(entity);
                            $rootScope.$apply();
                            certificationEntityService.getEntity.calls.reset();
                            certificationDataService.refreshView();
                            expect(certificationEntityService.getEntity).toHaveBeenCalledWith(cert.id, entity.id);
                            expect(detailMocks.reset).toHaveBeenCalledWith(cert, entity);
                        });

                        describe('with auto-advance', function () {
                            var entity1 = undefined,
                                entity1Completed = undefined,
                                entity2 = undefined;

                            function createMockEntity(id, complete) {
                                return {
                                    id: id,
                                    isComplete: jasmine.createSpy().and.returnValue(complete)
                                };
                            }

                            function createMockPager(hasNext, nextId) {
                                return {
                                    hasNext: jasmine.createSpy().and.returnValue(hasNext),
                                    next: jasmine.createSpy().and.returnValue(nextId)
                                };
                            }

                            beforeEach(function () {
                                entity1 = createMockEntity('entity1', false);
                                entity1Completed = createMockEntity('entity1', true);
                                entity2 = createMockEntity('entity2', false);

                                // Mock getEntity() to return:
                                // 1) First call: entity1 (incomplete)
                                // 2) Second call: entity1 (complete) to simulate completing the entity
                                // 3) Third call: entity2 for the auto-advance
                                spyOn(certificationEntityService, 'getEntity').and.returnValues($q.when(entity1), $q.when(entity1Completed), $q.when(entity2));

                                // Start on the detail view.
                                certificationDataService.initialize(cert);
                                certificationDataService.goToDetailView(entity1);
                                $rootScope.$apply();

                                expect(certificationEntityService.getEntity.calls.count()).toEqual(1);
                                expect(certificationDataService.selectedEntity).toBe(entity1);
                            });

                            it('stays on the same entity if there is no pager', function () {
                                certificationDataService.refreshView(true);
                                $rootScope.$apply();

                                expect(certificationEntityService.getEntity.calls.count()).toEqual(2);
                                expect(certificationDataService.selectedEntity).toBe(entity1Completed);
                            });

                            it('stays on the same entity if we are on the last entity in the pager', function () {
                                certificationDataService.entityListPager = createMockPager(false);
                                certificationDataService.refreshView(true);
                                $rootScope.$apply();

                                expect(certificationEntityService.getEntity.calls.count()).toEqual(2);
                                expect(certificationDataService.selectedEntity).toBe(entity1Completed);
                            });

                            it('stays on the same entity if the entity is not complete', function () {
                                // Rewire entity1 to not be complete when we refetch it.
                                entity1Completed.isComplete = jasmine.createSpy().and.returnValue(false);
                                certificationDataService.entityListPager = createMockPager(true, entity2.id);
                                certificationDataService.refreshView(true);
                                $rootScope.$apply();

                                expect(certificationEntityService.getEntity.calls.count()).toEqual(2);
                                expect(certificationDataService.selectedEntity).toBe(entity1Completed);
                            });

                            it('moves to the next entity if the current entity is complete and there are more entities', function () {
                                certificationDataService.entityListPager = createMockPager(true, entity2.id);
                                certificationDataService.refreshView(true);
                                $rootScope.$apply();

                                expect(certificationEntityService.getEntity.calls.count()).toEqual(3);
                                expect(certificationDataService.selectedEntity).toBe(entity2);
                            });
                        });
                    });
                });

                describe('checkForUnsavedDecisions()', function () {
                    var decisionCount = undefined,
                        resolveDialog = undefined,
                        spModal = undefined;
                    beforeEach(inject(function (_spModal_) {
                        spModal = _spModal_;
                        spyOn(spModal, 'confirm').and.callFake(function () {
                            return resolveDialog ? $q.when() : $q.reject();
                        });
                        certificationDataService.initialize(cert);
                        decisionCount = 2;
                        resolveDialog = true;
                        spyOn(certificationDataService.decisions, 'getDecisionCount').and.callFake(function () {
                            return decisionCount;
                        });
                        spyOn(certificationDataService.decisions, 'clearDecisions').and.callThrough();
                    }));

                    it('returns resolved promise if no decisions', function () {
                        var resolved = false;
                        decisionCount = 0;
                        certificationDataService.checkForUnsavedDecisions().then(function () {
                            return resolved = true;
                        });
                        $rootScope.$apply();
                        expect(certificationDataService.decisions.getDecisionCount).toHaveBeenCalled();
                        expect(resolved).toEqual(true);
                        expect(spModal.confirm).not.toHaveBeenCalled();
                    });

                    it('opens dialog and returns promise if decisions exist', function () {
                        var resolved = false;
                        certificationDataService.checkForUnsavedDecisions().then(function () {
                            return resolved = true;
                        });
                        expect(certificationDataService.decisions.getDecisionCount).toHaveBeenCalled();
                        $rootScope.$apply();
                        expect(resolved).toEqual(true);
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('clears decisions if the dialog resolves', function () {
                        certificationDataService.checkForUnsavedDecisions();
                        $rootScope.$apply();
                        expect(certificationDataService.decisions.clearDecisions).toHaveBeenCalled();
                    });

                    it('does not clear decisions if the dialog rejects', function () {
                        resolveDialog = false;
                        certificationDataService.checkForUnsavedDecisions();
                        $rootScope.$apply();
                        expect(certificationDataService.decisions.clearDecisions).not.toHaveBeenCalled();
                    });
                });

                describe('checkTablePreSearch', function () {
                    beforeEach(function () {
                        certificationDataService.initialize(cert);
                    });

                    it('returns resolved promise if filter values match', function () {
                        var searchData = {
                            filterValues: {
                                a: 'b'
                            }
                        },
                            result = undefined;

                        spyOn(certificationDataService, 'checkForUnsavedDecisions');
                        certificationDataService.checkTablePreSearch(searchData, searchData).then(function () {
                            return result = true;
                        });
                        $rootScope.$apply();
                        expect(result).toEqual(true);
                        expect(certificationDataService.checkForUnsavedDecisions).not.toHaveBeenCalled();
                    });

                    it('checks for unsaved decisions if filter values do not match', function () {
                        var oldSearchData = {
                            filterValues: {
                                a: 'b'
                            }
                        },
                            newSearchData = {
                            filterValues: {}
                        };

                        // Just checking we pass the result of this method call back, should be a promise but whatever
                        spyOn(certificationDataService, 'checkForUnsavedDecisions').and.returnValue('whatever');
                        var result = certificationDataService.checkTablePreSearch(oldSearchData, newSearchData);
                        $rootScope.$apply();
                        expect(result).toEqual('whatever');
                        expect(certificationDataService.checkForUnsavedDecisions).toHaveBeenCalled();
                    });
                });

                it('toggleEntityList() flips the value of showEntityList', function () {
                    expect(certificationDataService.showEntityList).toBeFalsy();
                    certificationDataService.toggleEntityList();
                    expect(certificationDataService.showEntityList).toBeTruthy();
                    certificationDataService.toggleEntityList();
                    expect(certificationDataService.showEntityList).toBeFalsy();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7OztJQUdqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7O1FBRTVELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyw0QkFBNEIsWUFBVzs7Z0JBRTVDLElBQUksMkJBQXdCO29CQUFFLHdCQUFxQjtvQkFBRSx3QkFBcUI7b0JBQUUseUJBQXNCO29CQUM5RixvQkFBaUI7b0JBQUUsZ0JBQWE7b0JBQUUsNEJBQXlCO29CQUFFLE9BQUk7b0JBQUUsaUJBQWM7b0JBQUUsY0FBVztvQkFDOUYsNkJBQTBCO29CQUFFLEtBQUU7b0JBQUUsYUFBVTs7Z0JBRTlDLFNBQVMsVUFBVSxRQUFRO29CQUN2QixPQUFPLElBQUksMEJBQTBCO3dCQUNqQyxRQUFROzs7Ozs7O2dCQU9oQixTQUFTLG9CQUFvQixPQUFPO29CQUNoQyxJQUFJLFFBQVE7d0JBQ1IsT0FBTyxRQUFRLFVBQVU7d0JBQ3pCLHFCQUFxQixRQUFRLFVBQVU7d0JBQ3ZDLG1CQUFtQixRQUFRLFVBQVU7d0JBQ3JDLHdCQUF3QixRQUFRLFVBQVU7d0JBQzFDLG1CQUFtQixRQUFRLFVBQVU7OztvQkFHekMsUUFBUSxRQUFRLE9BQU8sVUFBQyxNQUFNLFlBQWU7d0JBQ3pDLE1BQU0sVUFBVSxjQUFjOzs7b0JBR2xDLE9BQU87OztnQkFHWCxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxpQ0FBaUMsOEJBQWlDO29CQUNqRixpQkFBaUIsb0JBQW9CO29CQUNyQyxjQUFjLG9CQUFvQjs7OztnQkFJdEMsV0FBVyxPQUFPLFVBQVMsNEJBQTRCLHlCQUF5QixxQkFDckQseUJBQXlCLGlCQUFpQiwwQkFD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YTs0QkFDYixjQUFjO2dDQUNWLEdBQUc7Ozs0QkFFUixTQUFNOzt3QkFFVCxNQUFNLDBCQUEwQjt3QkFDaEMseUJBQXlCLG9CQUFvQixZQUFZLFlBQVksS0FBSyxZQUFBOzRCQTJCMUQsT0EzQmdFLFNBQVM7O3dCQUN6RixXQUFXO3dCQUNYLE9BQU8sUUFBUSxRQUFRO3dCQUN2QixPQUFPLHlCQUF5QiwwQkFBMEIsSUFBSTs7O29CQUdsRSxHQUFHLDhEQUE4RCxZQUFNO3dCQUNuRSxJQUFJLGdCQUFnQjs0QkFDaEIsY0FBYztnQ0FDVixHQUFHOzs7NEJBRVIsZ0JBQWdCOzRCQUNmLGNBQWM7Ozs7d0JBSWxCLE1BQU0sMEJBQTBCLDRCQUE0QixJQUFJLFlBQVk7d0JBQzVFLElBQUksU0FBUyx5QkFBeUIsb0JBQW9CLGVBQWU7d0JBQ3pFLFdBQVc7d0JBQ1gsT0FBTyxRQUFRLFFBQVE7d0JBQ3ZCLE9BQU8seUJBQXlCLDBCQUEwQjs7OztnQkFJbEUsR0FBRyx3REFBd0QsWUFBVztvQkFDbEUsT0FBTyx5QkFBeUIsZ0JBQWdCO29CQUNoRCx5QkFBeUI7b0JBQ3pCLE9BQU8seUJBQXlCLGdCQUFnQjtvQkFDaEQseUJBQXlCO29CQUN6QixPQUFPLHlCQUF5QixnQkFBZ0I7Ozs7O0dBa0NyRCIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25EYXRhU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcblxuZGVzY3JpYmUoJ2NlcnRpZmljYXRpb25EYXRhU2VydmljZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgQ2VydGlmaWNhdGlvbkRlY2lzaW9uLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsIENlcnRpZmljYXRpb25WaWV3U3RhdGUsXG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtLCBDZXJ0aWZpY2F0aW9uLCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLCBjZXJ0LCB3b3Jrc2hlZXRNb2NrcywgZGV0YWlsTW9ja3MsXG4gICAgICAgIGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLCAkcSwgJHJvb3RTY29wZTtcblxuICAgIGZ1bmN0aW9uIGdldFN0YXR1cyhzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vY2sgb3V0IHRoZSBtZXRob2RzIG9uIHRoZSBnaXZlbiBDZXJ0aWZpY2F0aW9uVmlld1N0YXRlIGNsYXNzIHNvIHRoYXQgd2UgY2FuIHNweSBvbiB0aGVtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldHVwVmlld1N0YXRlTW9ja3MoY2xhenopIHtcbiAgICAgICAgbGV0IG1vY2tzID0ge1xuICAgICAgICAgICAgcmVzZXQ6IGphc21pbmUuY3JlYXRlU3B5KCdyZXNldCcpLFxuICAgICAgICAgICAgc2V0dXBDaGVja2JveE1vZGVsczogamFzbWluZS5jcmVhdGVTcHkoJ3NldHVwQ2hlY2tib3hNb2RlbHMnKSxcbiAgICAgICAgICAgIGluaXRpYWxpemVGaWx0ZXJzOiBqYXNtaW5lLmNyZWF0ZVNweSgnaW5pdGlhbGl6ZUZpbHRlcnMnKSxcbiAgICAgICAgICAgIGdldFNlbGVjdGlvbk1vZGVsU2NvcGU6IGphc21pbmUuY3JlYXRlU3B5KCdnZXRTZWxlY3Rpb25Nb2RlbFNjb3BlJyksXG4gICAgICAgICAgICByZWZyZXNoQ3VycmVudFRhYjogamFzbWluZS5jcmVhdGVTcHkoJ3JlZnJlc2hDdXJyZW50VGFiJylcbiAgICAgICAgfTtcblxuICAgICAgICBhbmd1bGFyLmZvckVhY2gobW9ja3MsIChtb2NrLCBtZXRob2ROYW1lKSA9PiB7XG4gICAgICAgICAgICBjbGF6ei5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBtb2NrO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbW9ja3M7XG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKENlcnRpZmljYXRpb25Xb3Jrc2hlZXRWaWV3U3RhdGUsIENlcnRpZmljYXRpb25EZXRhaWxWaWV3U3RhdGUpID0+IHtcbiAgICAgICAgd29ya3NoZWV0TW9ja3MgPSBzZXR1cFZpZXdTdGF0ZU1vY2tzKENlcnRpZmljYXRpb25Xb3Jrc2hlZXRWaWV3U3RhdGUpO1xuICAgICAgICBkZXRhaWxNb2NrcyA9IHNldHVwVmlld1N0YXRlTW9ja3MoQ2VydGlmaWNhdGlvbkRldGFpbFZpZXdTdGF0ZSk7XG4gICAgfSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczoxMCAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfLCBfQ2VydGlmaWNhdGlvbkRlY2lzaW9uXywgX0NlcnRpZmljYXRpb25JdGVtXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY2VydGlmaWNhdGlvblRlc3REYXRhXywgX0NlcnRpZmljYXRpb25fLCBfQ2VydGlmaWNhdGlvblZpZXdTdGF0ZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfLCBfY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2VfLCBfJHFfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8kcm9vdFNjb3BlXykge1xuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XG4gICAgICAgIENlcnRpZmljYXRpb24gPSBfQ2VydGlmaWNhdGlvbl87XG4gICAgICAgIENlcnRpZmljYXRpb25WaWV3U3RhdGUgPSBfQ2VydGlmaWNhdGlvblZpZXdTdGF0ZV87XG4gICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMgPSBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c187XG4gICAgICAgIGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlXztcbiAgICAgICAgJHEgPSBfJHFfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuXG4gICAgICAgIGNlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnaW5pdGlhbGl6ZSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzZXRzIHRoZSBjZXJ0aWZpY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2VydGlmaWNhdGlvbikudG9FcXVhbChjZXJ0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NsZWFycyB0aGUgZGVjaXNpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKHsgaWQ6ICdhYmNkJyB9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5hZGREZWNpc2lvbihkZWNpc2lvbik7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3NldHMgdXAgdmlldyBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGNlcnQpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NsZWFycyB0aGUgc2VsZWN0ZWRFbnRpdHkgaWYgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUoY2VydCk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2Uuc2VsZWN0ZWRFbnRpdHkgPSB7IHNvbWU6ICdwZXJzb24nIH07XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0LCB0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2Uuc2VsZWN0ZWRFbnRpdHkpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbGVhdmVzIHRoZSBzZWxlY3RlZEVudGl0eSBpZiBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUoY2VydCk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2Uuc2VsZWN0ZWRFbnRpdHkgPSB7IHNvbWU6ICdwZXJzb24nIH07XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0LCBmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS50b0VxdWFsKHtzb21lOiAncGVyc29uJ30pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbm90aWZpZXMgYWxsIGNlcnRpZmljYXRpb24gbG9hZCBsaXN0ZW5lcnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIxID0gY3JlYXRlQ2VydExvYWRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyMiA9IGNyZWF0ZUNlcnRMb2FkTGlzdGVuZXIoKTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnJlZ2lzdGVyQ2VydGlmaWNhdGlvbkxvYWRMaXN0ZW5lcihsaXN0ZW5lcjEpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnJlZ2lzdGVyQ2VydGlmaWNhdGlvbkxvYWRMaXN0ZW5lcihsaXN0ZW5lcjIpO1xuXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgIGV4cGVjdChsaXN0ZW5lcjEuY2VydGlmaWNhdGlvbkxvYWRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydCk7XG4gICAgICAgICAgICBleHBlY3QobGlzdGVuZXIyLmNlcnRpZmljYXRpb25Mb2FkZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVzZXRzIG1vYmlsZSBlbnRpdHkgdmlldyBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5tb2JpbGVFbnRpdHlWaWV3U3RhdGUsICdyZXNldCcpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUoY2VydCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLm1vYmlsZUVudGl0eVZpZXdTdGF0ZS5yZXNldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2VydExvYWRMaXN0ZW5lcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25Mb2FkZWQ6IGphc21pbmUuY3JlYXRlU3B5KCdjZXJ0aWZpY2F0aW9uTG9hZGVkJylcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgncmVnaXN0ZXIgY2VydGlmaWNhdGlvbiBsb2FkIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgICAgICBpdCgnYWRkcyBhIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0ge307XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVnaXN0ZXJDZXJ0aWZpY2F0aW9uTG9hZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2VydGlmaWNhdGlvbkxvYWRMaXN0ZW5lcnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FsbHMgdGhlIGxpc3RlbmVyIGltbWVkaWF0ZWx5IGlmIGEgY2VydGlmaWNhdGlvbiBpcyBhbHJlYWR5IGluaXRpYWxpemVkJywgKCkgPT4ge1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUoY2VydCk7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBjcmVhdGVDZXJ0TG9hZExpc3RlbmVyKCk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVnaXN0ZXJDZXJ0aWZpY2F0aW9uTG9hZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGV4cGVjdChsaXN0ZW5lci5jZXJ0aWZpY2F0aW9uTG9hZGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IGNhbGwgdGhlIGxpc3RlbmVyIGltbWVkaWF0ZWx5IGlmIGEgY2VydGlmaWNhdGlvbiBpcyBub3QgaW5pdGlhbGl6ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBjcmVhdGVDZXJ0TG9hZExpc3RlbmVyKCk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVnaXN0ZXJDZXJ0aWZpY2F0aW9uTG9hZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGV4cGVjdChsaXN0ZW5lci5jZXJ0aWZpY2F0aW9uTG9hZGVkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdkZXJlZ2lzdGVyIGNlcnRpZmljYXRpb24gbG9hZCBsaXN0ZW5lcicsICgpID0+IHtcbiAgICAgICAgaXQoJ2RvZXMgbm90aGluZyBpZiB0aGUgbGlzdGVuZXIgaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVnaXN0ZXJDZXJ0aWZpY2F0aW9uTG9hZExpc3RlbmVyKHt9KTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZXJlZ2lzdGVyQ2VydGlmaWNhdGlvbkxvYWRMaXN0ZW5lcih7IHNvbWV0aGluZzogJ25ldycgfSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNlcnRpZmljYXRpb25Mb2FkTGlzdGVuZXJzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlbW92ZXMgdGhlIGxpc3RlbmVyJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0ge307XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVnaXN0ZXJDZXJ0aWZpY2F0aW9uTG9hZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZXJlZ2lzdGVyQ2VydGlmaWNhdGlvbkxvYWRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNlcnRpZmljYXRpb25Mb2FkTGlzdGVuZXJzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29uZmlndXJhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnaXMgaW5pdGlhbGx5IHVuZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRDb25maWd1cmF0aW9uKCkpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2V0cyB0aGUgY29uZmlndXJhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IHsgY29uZmlnOiAndGhpcyd9O1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKGNvbmZpZyk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdldENvbmZpZ3VyYXRpb24oKSkudG9CZShjb25maWcpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjaGVja2JveCBtb2RlbHMnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnaXNDaGVja2JveFJlcXVpcmVkJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYXJlIG5vdCBzZXQgYWZ0ZXIgaW5pdGlhbGl6ZSB3aXRoIG5vIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgIGV4cGVjdCh3b3Jrc2hlZXRNb2Nrcy5zZXR1cENoZWNrYm94TW9kZWxzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYXJlIG5vdCBzZXQgYWZ0ZXIgY29uZmlndXJhdGlvbiBpbml0aWFsaXphdGlvbiB3aXRoIG5vIGNlcnQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZUNvbmZpZ3VyYXRpb24oe30pO1xuICAgICAgICAgICAgZXhwZWN0KHdvcmtzaGVldE1vY2tzLnNldHVwQ2hlY2tib3hNb2RlbHMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhcmUgc2V0dXAgYWZ0ZXIgaW5pdGlhbGl6aW5nIGJvdGggY2VydCBhbmQgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGNlcnQpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKGNlcnQpO1xuICAgICAgICAgICAgZXhwZWN0KHdvcmtzaGVldE1vY2tzLnNldHVwQ2hlY2tib3hNb2RlbHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2luaXRpYWxpemVEYXRhVGFibGVGaWx0ZXJzKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZXRzIGZpbHRlcnMgb24gdGhlIERlY2lzaW9uc0xlZnQgYW5kIENvbXBsZXRlIHRhYmxlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJzID0geyBpOiAnYW1UaGVGaWx0ZXJzJyB9O1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVEYXRhVGFibGVGaWx0ZXJzKGZpbHRlcnMpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKS5pbml0aWFsaXplRmlsdGVycykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmlsdGVycyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzQ2VydGlmaWNhdGlvbkVkaXRhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdyZXR1cm4gZmFsc2UgaWYgY2VydGlmaWNhdGlvbiBpcyBub3QgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pc0NlcnRpZmljYXRpb25FZGl0YWJsZSgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgY2VydGlmaWNhdGlvbiBjb25maWcgaXMgbm90IGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKHsgaWQ6ICcxMjM0Jywgc29tZTogJ2NlcnQnLCBwaGFzZTogJ0FjdGl2ZSd9KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaXNDZXJ0aWZpY2F0aW9uRWRpdGFibGUoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGNlcnRpZmljYXRpb24gYW5kIGNvbmZpZyBhcmUgZGVmaW5lZCBidXQgY2VydCBpcyBub3QgZWRpdGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKHtpZDogJzEyMzQnLCBzb21lOiAnY2VydCcsIGVkaXRhYmxlOiBmYWxzZX0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKHsgc29tZTogJ2NvbmZpZyd9KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaXNDZXJ0aWZpY2F0aW9uRWRpdGFibGUoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgY2VydGlmaWNhdGlvbiBhbmQgY29uZmlnIGFyZSBkZWZpbmVkIGFuZCBjZXJ0IGlzIGVkaXRhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZSh7aWQ6ICcxMjM0Jywgc29tZTogJ2NlcnQnLCBlZGl0YWJsZTogdHJ1ZX0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKHsgc29tZTogJ2NvbmZpZyd9KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaXNDZXJ0aWZpY2F0aW9uRWRpdGFibGUoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbmVlZHNSZW1lZGlhdGlvblN1bW1hcnkoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGNlcnQgaXRlbSBzdWJ0eXBlIGlzIGEgcm9sZSBhbmQgc2hvd1JvbGVSZXZvY2F0aW9uRGV0YWlscyBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY2VydEl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMV0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKHtcbiAgICAgICAgICAgICAgICBzaG93Um9sZVJldm9jYXRpb25EZXRhaWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJldm9jYXRpb25Nb2RpZmljYXRpb25FbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLm5lZWRzUmVtZWRpYXRpb25TdW1tYXJ5KGNlcnRJdGVtLCBmYWxzZSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGNlcnQgaXRlbSBzdWJ0eXBlIGlzIGEgcm9sZSBhbmQgc2hvd1JvbGVSZXZvY2F0aW9uRGV0YWlscyBpcyBmYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNlcnRJdGVtID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUX0lURU1TWzFdKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplQ29uZmlndXJhdGlvbih7XG4gICAgICAgICAgICAgICAgc2hvd1JvbGVSZXZvY2F0aW9uRGV0YWlsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmV2b2NhdGlvbk1vZGlmaWNhdGlvbkVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UubmVlZHNSZW1lZGlhdGlvblN1bW1hcnkoY2VydEl0ZW0sIGZhbHNlKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGNlcnQgaXRlbSBzdWJ0eXBlIGlzIGEgcm9sZSBhbmQgc2hvd1JvbGVSZXZvY2F0aW9uRGV0YWlscyBpcyB0cnVlIGJ1dCAnICtcbiAgICAgICAgICAgICdza2lwUm9sZVJldm9jYXRpb25EZXRhaWxzIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2VydEl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMV0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKHtcbiAgICAgICAgICAgICAgICBzaG93Um9sZVJldm9jYXRpb25EZXRhaWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJldm9jYXRpb25Nb2RpZmljYXRpb25FbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLm5lZWRzUmVtZWRpYXRpb25TdW1tYXJ5KGNlcnRJdGVtLCB0cnVlKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cnMgdHJ1ZSBpZiBjZXJ0IGl0ZW0gc3VidHlwZSBub3QgYSByb2xlIGFuZCByZXZvY2F0aW9uTW9kaWZpY2F0aW9uRW5hYmxlZCBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY2VydEl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemVDb25maWd1cmF0aW9uKHtcbiAgICAgICAgICAgICAgICByZXZvY2F0aW9uTW9kaWZpY2F0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93Um9sZVJldm9jYXRpb25EZXRhaWxzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UubmVlZHNSZW1lZGlhdGlvblN1bW1hcnkoY2VydEl0ZW0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBjZXJ0IGl0ZW0gc3VidHlwZSBpcyBub3QgYSByb2xlIGFuZCByZXZvY2F0aW9uTW9kaWZpY2F0aW9uRW5hYmxlZCBpcyBmYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNlcnRJdGVtID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUX0lURU1TWzBdKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplQ29uZmlndXJhdGlvbih7XG4gICAgICAgICAgICAgICAgcmV2b2NhdGlvbk1vZGlmaWNhdGlvbkVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dSb2xlUmV2b2NhdGlvbkRldGFpbHM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5uZWVkc1JlbWVkaWF0aW9uU3VtbWFyeShjZXJ0SXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdnZXRzIHByb2Nlc3NSZXZva2VzSW1tZWRpYXRlbHkgZmxhZyBmcm9tIHRoZSBjb25maWd1cmF0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB7IHByb2Nlc3NSZXZva2VzSW1tZWRpYXRlbHk6IGZhbHNlIH07XG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplQ29uZmlndXJhdGlvbihjb25maWcpO1xuICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmlzUHJvY2Vzc1Jldm9rZXNJbW1lZGlhdGVseSgpKS50b0VxdWFsKGNvbmZpZy5wcm9jZXNzUmV2b2tlc0ltbWVkaWF0ZWx5KTtcbiAgICB9KTtcblxuICAgIGl0KCdnZXRUb3RhbENvdW50KCkgZGVsZWdhdGVzIHRvIENlcnRpZmljYXRpb25JdGVtU3RhdHVzQ291bnQnLCAoKSA9PiB7XG4gICAgICAgIHNweU9uKGNlcnQuaXRlbVN0YXR1c0NvdW50LCAnZ2V0VG90YWxDb3VudCcpLmFuZC5yZXR1cm5WYWx1ZSg0Myk7XG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGNlcnQpO1xuICAgICAgICBsZXQgY291bnQgPSBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0VG90YWxDb3VudCgpO1xuICAgICAgICBleHBlY3QoY2VydC5pdGVtU3RhdHVzQ291bnQuZ2V0VG90YWxDb3VudCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICBleHBlY3QoY291bnQpLnRvRXF1YWwoNDMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2dldENvbXBsZXRlQ291bnQoKSBkZWxlZ2F0ZXMgdG8gQ2VydGlmaWNhdGlvbkl0ZW1TdGF0dXNDb3VudCcsICgpID0+IHtcbiAgICAgICAgc3B5T24oY2VydC5pdGVtU3RhdHVzQ291bnQsICdnZXRDb21wbGV0ZUNvdW50JykuYW5kLnJldHVyblZhbHVlKDQzKTtcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmluaXRpYWxpemUoY2VydCk7XG4gICAgICAgIGxldCBjb3VudCA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRDb21wbGV0ZUNvdW50KCk7XG4gICAgICAgIGV4cGVjdChjZXJ0Lml0ZW1TdGF0dXNDb3VudC5nZXRDb21wbGV0ZUNvdW50KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGV4cGVjdChjb3VudCkudG9FcXVhbCg0Myk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndmlldyBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgbGV0IHJlamVjdFVuc2F2ZWREZWNpc2lvbnM7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICByZWplY3RVbnNhdmVkRGVjaXNpb25zID0gZmFsc2U7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2NoZWNrRm9yVW5zYXZlZERlY2lzaW9ucycpLmFuZC5jYWxsRmFrZSgoKSA9PlxuICAgICAgICAgICAgICAgIChyZWplY3RVbnNhdmVkRGVjaXNpb25zKSA/ICRxLnJlamVjdCgpIDogJHEud2hlbigpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2dldFZpZXdTdGF0ZSgpJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ3JldHVybnMgd29ya3NoZWV0IHZpZXcgd2hlbiBubyBlbnRpdHkgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCkpLnRvRXF1YWwoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLndvcmtzaGVldFZpZXdTdGF0ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JldHVybnMgZGV0YWlsIHZpZXcgd2hlbiBhbiBlbnRpdHkgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0geyBzb21lOiAncGVyc29uJ307XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRWaWV3U3RhdGUoKSkudG9FcXVhbChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGV0YWlsVmlld1N0YXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnZ29Ub1dvcmtzaGVldFZpZXcnLCAoKSA9PiB7XG4gICAgICAgICAgICBpdCAoJ2NsZWFycyB0aGUgc2VsZWN0ZWQgaWRlbnRpdHknLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0geyBzb21lOiAncGVyc29uJ307XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9Xb3Jrc2hlZXRWaWV3KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdldFZpZXdTdGF0ZSgpKS50b0VxdWFsKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS53b3Jrc2hlZXRWaWV3U3RhdGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ICgnY2xlYXJzIGVudGl0eSBsaXN0IHBhZ2VyJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zZWxlY3RlZEVudGl0eSA9IHsgc29tZTogJ3BlcnNvbid9O1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5lbnRpdHlMaXN0UGFnZXIgPSB7IHBhZ2U6ICdvbicgfTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub1dvcmtzaGVldFZpZXcoKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZW50aXR5TGlzdFBhZ2VyKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnaGlkZXMgdGhlIGVudGl0eSBsaXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zaG93RW50aXR5TGlzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9Xb3Jrc2hlZXRWaWV3KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNob3dFbnRpdHlMaXN0KS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgY2xlYXIgc2VsZWN0ZWQgaWRlbnRpdHkgaWYgdW5zYXZlZCBkZWNpc2lvbiBkaWFsb2cgaXMgcmVqZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0geyBzb21lOiAncGVyc29uJ307XG4gICAgICAgICAgICAgICAgcmVqZWN0VW5zYXZlZERlY2lzaW9ucyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9Xb3Jrc2hlZXRWaWV3KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNoZWNrRm9yVW5zYXZlZERlY2lzaW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2Uuc2VsZWN0ZWRFbnRpdHkpLnRvRXF1YWwoeyBzb21lOiAncGVyc29uJ30pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Vmlld1N0YXRlKCkpLnRvRXF1YWwoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRldGFpbFZpZXdTdGF0ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGNoZWNrIGZvciB1bnNhdmVkIGRlY2lzaW9ucyBpZiBzZWxlY3RlZEVudGl0eSBpcyBub3Qgc2V0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zZWxlY3RlZEVudGl0eSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub1dvcmtzaGVldFZpZXcoKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2hlY2tGb3JVbnNhdmVkRGVjaXNpb25zKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdnb1RvRGV0YWlsVmlldycsICgpID0+IHtcbiAgICAgICAgICAgIGl0ICgndGhyb3dzIHdpdGhvdXQgYW4gZW50aXR5SWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCgpID0+IHsgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9EZXRhaWxWaWV3KCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnaGlkZXMgdGhlIGVudGl0eSBsaXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBlbnRpdHkgPSB7IGlkOiAnMTIzNCcsIHNvbWU6ICdwZXJzb24nfTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2Uuc2hvd0VudGl0eUxpc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLCAnZ2V0RW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oZW50aXR5KSk7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9EZXRhaWxWaWV3KGVudGl0eS5pZCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNob3dFbnRpdHlMaXN0KS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZmV0Y2hlcyB0aGUgZnVsbCBlbnRpdHkgdGhlbiBzZXRzIHRoZSBzZWxlY3RlZCBlbnRpdHkgYW5kIHJlc2V0cyB0aGUgZGV0YWlsIHZpZXcgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGVudGl0eSA9IHsgaWQ6ICcxMjM0Jywgc29tZTogJ3BlcnNvbid9O1xuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLCAnZ2V0RW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oZW50aXR5KSk7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9EZXRhaWxWaWV3KGVudGl0eS5pZCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS50b0VxdWFsKGVudGl0eSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRldGFpbE1vY2tzLnJlc2V0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0LCBlbnRpdHkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdCBmZXRjaCBmdWxsIGVudGl0eSBpZiBjaGVjayBmb3IgdW5zYXZlZCBkZWNpc2lvbnMgaXMgcmVqZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGVudGl0eSA9IHsgaWQ6ICcxMjM0Jywgc29tZTogJ3BlcnNvbid9O1xuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLCAnZ2V0RW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oZW50aXR5KSk7XG4gICAgICAgICAgICAgICAgcmVqZWN0VW5zYXZlZERlY2lzaW9ucyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmdvVG9EZXRhaWxWaWV3KGVudGl0eS5pZCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNoZWNrRm9yVW5zYXZlZERlY2lzaW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZXRhaWxNb2Nrcy5yZXNldCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgY2hlY2sgZm9yIHVuc2F2ZWQgZGVjaXNpb25zIGlmIHN3aXRjaGluZyBiZXR3ZWVuIGVudGl0aWVzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBlbnRpdHkgPSB7IGlkOiAnMTIzNCcsIHNvbWU6ICdwZXJzb24nfTtcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZSwgJ2dldEVudGl0eScpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKGVudGl0eSkpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zZWxlY3RlZEVudGl0eSA9IHsgYW5vdGhlcjogJ2VudGl0eScgfTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcoZW50aXR5LmlkKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2hlY2tGb3JVbnNhdmVkRGVjaXNpb25zKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZXRhaWxNb2Nrcy5yZXNldCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdlbnRpdHkgcGFnZXIgaXMgc2F2ZWQgaWYgY2FsbGJhY2sgaXMgc3VwcGxpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhZ2VyID0geyBpOiAnYW0gYSBwYWdlciAuLi4gMTk5MHMgcmVwcmVzZW50ISEnIH07XG4gICAgICAgICAgICAgICAgbGV0IGVudGl0eVBhZ2VyQ2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHBhZ2VyKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBlbnRpdHkgPSB7IGlkOiAnMTIzNCcsIHNvbWU6ICdwZXJzb24nfTtcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZSwgJ2dldEVudGl0eScpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKGVudGl0eSkpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nb1RvRGV0YWlsVmlldyhlbnRpdHkuaWQsIGVudGl0eVBhZ2VyQ2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QoZW50aXR5UGFnZXJDYWxsYmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZW50aXR5TGlzdFBhZ2VyKS50b0VxdWFsKHBhZ2VyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgncmVmcmVzaFZpZXcoKScsICgpID0+IHtcbiAgICAgICAgICAgIGl0KCdyZWZyZXNoZXMgYW5kIGNvbnN0cmFpbnMgZm9yIHdvcmtzaGVldCB2aWV3JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGNlcnQpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5yZWZyZXNoVmlldygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh3b3Jrc2hlZXRNb2Nrcy5yZXNldCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh3b3Jrc2hlZXRNb2Nrcy5yZWZyZXNoQ3VycmVudFRhYikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdmZXRjaGVzIGVudGl0eSBhbmQgcmVzZXRzIHZpZXcgZm9yIGRldGFpbCB2aWV3JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBlbnRpdHkgPSB7IGlkOiAncGVyc29uJ307XG4gICAgICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UsICdnZXRFbnRpdHknKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihlbnRpdHkpKTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcoZW50aXR5KTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldEVudGl0eS5jYWxscy5yZXNldCgpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5yZWZyZXNoVmlldygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRFbnRpdHkpXG4gICAgICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0LmlkLCBlbnRpdHkuaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZXRhaWxNb2Nrcy5yZXNldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydCwgZW50aXR5KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZXNjcmliZSgnd2l0aCBhdXRvLWFkdmFuY2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGVudGl0eTEsIGVudGl0eTFDb21wbGV0ZWQsIGVudGl0eTI7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVNb2NrRW50aXR5KGlkLCBjb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZTogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoY29tcGxldGUpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlTW9ja1BhZ2VyKGhhc05leHQsIG5leHRJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzTmV4dDogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoaGFzTmV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0OiBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5yZXR1cm5WYWx1ZShuZXh0SWQpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTEgPSBjcmVhdGVNb2NrRW50aXR5KCdlbnRpdHkxJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkxQ29tcGxldGVkID0gY3JlYXRlTW9ja0VudGl0eSgnZW50aXR5MScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkyID0gY3JlYXRlTW9ja0VudGl0eSgnZW50aXR5MicsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBNb2NrIGdldEVudGl0eSgpIHRvIHJldHVybjpcbiAgICAgICAgICAgICAgICAgICAgLy8gMSkgRmlyc3QgY2FsbDogZW50aXR5MSAoaW5jb21wbGV0ZSlcbiAgICAgICAgICAgICAgICAgICAgLy8gMikgU2Vjb25kIGNhbGw6IGVudGl0eTEgKGNvbXBsZXRlKSB0byBzaW11bGF0ZSBjb21wbGV0aW5nIHRoZSBlbnRpdHlcbiAgICAgICAgICAgICAgICAgICAgLy8gMykgVGhpcmQgY2FsbDogZW50aXR5MiBmb3IgdGhlIGF1dG8tYWR2YW5jZVxuICAgICAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZSwgJ2dldEVudGl0eScpLmFuZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlcygkcS53aGVuKGVudGl0eTEpLCAkcS53aGVuKGVudGl0eTFDb21wbGV0ZWQpLCAkcS53aGVuKGVudGl0eTIpKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTdGFydCBvbiB0aGUgZGV0YWlsIHZpZXcuXG4gICAgICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKGNlcnQpO1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcoZW50aXR5MSk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldEVudGl0eS5jYWxscy5jb3VudCgpKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS50b0JlKGVudGl0eTEpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaXQoJ3N0YXlzIG9uIHRoZSBzYW1lIGVudGl0eSBpZiB0aGVyZSBpcyBubyBwYWdlcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnJlZnJlc2hWaWV3KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRFbnRpdHkuY2FsbHMuY291bnQoKSkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zZWxlY3RlZEVudGl0eSkudG9CZShlbnRpdHkxQ29tcGxldGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGl0KCdzdGF5cyBvbiB0aGUgc2FtZSBlbnRpdHkgaWYgd2UgYXJlIG9uIHRoZSBsYXN0IGVudGl0eSBpbiB0aGUgcGFnZXInLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5lbnRpdHlMaXN0UGFnZXIgPSBjcmVhdGVNb2NrUGFnZXIoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVmcmVzaFZpZXcodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldEVudGl0eS5jYWxscy5jb3VudCgpKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS50b0JlKGVudGl0eTFDb21wbGV0ZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaXQoJ3N0YXlzIG9uIHRoZSBzYW1lIGVudGl0eSBpZiB0aGUgZW50aXR5IGlzIG5vdCBjb21wbGV0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmV3aXJlIGVudGl0eTEgdG8gbm90IGJlIGNvbXBsZXRlIHdoZW4gd2UgcmVmZXRjaCBpdC5cbiAgICAgICAgICAgICAgICAgICAgZW50aXR5MUNvbXBsZXRlZC5pc0NvbXBsZXRlID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZW50aXR5TGlzdFBhZ2VyID0gY3JlYXRlTW9ja1BhZ2VyKHRydWUsIGVudGl0eTIuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVmcmVzaFZpZXcodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldEVudGl0eS5jYWxscy5jb3VudCgpKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS50b0JlKGVudGl0eTFDb21wbGV0ZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaXQoJ21vdmVzIHRvIHRoZSBuZXh0IGVudGl0eSBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgY29tcGxldGUgYW5kIHRoZXJlIGFyZSBtb3JlIGVudGl0aWVzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZW50aXR5TGlzdFBhZ2VyID0gY3JlYXRlTW9ja1BhZ2VyKHRydWUsIGVudGl0eTIuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UucmVmcmVzaFZpZXcodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldEVudGl0eS5jYWxscy5jb3VudCgpKS50b0VxdWFsKDMpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5KS50b0JlKGVudGl0eTIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NoZWNrRm9yVW5zYXZlZERlY2lzaW9ucygpJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVjaXNpb25Db3VudCwgcmVzb2x2ZURpYWxvZywgc3BNb2RhbDtcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF9zcE1vZGFsXykgPT4ge1xuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdjb25maXJtJykuYW5kLmNhbGxGYWtlKCgpID0+IHJlc29sdmVEaWFsb2cgPyAkcS53aGVuKCkgOiAkcS5yZWplY3QoKSk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgICAgIGRlY2lzaW9uQ291bnQgPSAyO1xuICAgICAgICAgICAgcmVzb2x2ZURpYWxvZyA9IHRydWU7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RGVjaXNpb25Db3VudCcpLmFuZC5jYWxsRmFrZSgoKSA9PiBkZWNpc2lvbkNvdW50KTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdjbGVhckRlY2lzaW9ucycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgcmVzb2x2ZWQgcHJvbWlzZSBpZiBubyBkZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRlY2lzaW9uQ291bnQgPSAwO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNoZWNrRm9yVW5zYXZlZERlY2lzaW9ucygpLnRoZW4oKCkgPT4gcmVzb2x2ZWQgPSB0cnVlKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5nZXREZWNpc2lvbkNvdW50KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QocmVzb2x2ZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5jb25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnb3BlbnMgZGlhbG9nIGFuZCByZXR1cm5zIHByb21pc2UgaWYgZGVjaXNpb25zIGV4aXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc29sdmVkID0gZmFsc2U7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2hlY2tGb3JVbnNhdmVkRGVjaXNpb25zKCkudGhlbigoKSA9PiByZXNvbHZlZCA9IHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb25Db3VudCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNvbHZlZCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NsZWFycyBkZWNpc2lvbnMgaWYgdGhlIGRpYWxvZyByZXNvbHZlcycsICgpID0+IHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5jaGVja0ZvclVuc2F2ZWREZWNpc2lvbnMoKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5jbGVhckRlY2lzaW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3QgY2xlYXIgZGVjaXNpb25zIGlmIHRoZSBkaWFsb2cgcmVqZWN0cycsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmVEaWFsb2cgPSBmYWxzZTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5jaGVja0ZvclVuc2F2ZWREZWNpc2lvbnMoKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5jbGVhckRlY2lzaW9ucykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY2hlY2tUYWJsZVByZVNlYXJjaCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgcmVzb2x2ZWQgcHJvbWlzZSBpZiBmaWx0ZXIgdmFsdWVzIG1hdGNoJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlYXJjaERhdGEgPSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyVmFsdWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGE6ICdiJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHJlc3VsdDtcblxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnY2hlY2tGb3JVbnNhdmVkRGVjaXNpb25zJyk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2hlY2tUYWJsZVByZVNlYXJjaChzZWFyY2hEYXRhLCBzZWFyY2hEYXRhKS50aGVuKCgpID0+IHJlc3VsdCA9IHRydWUpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNoZWNrRm9yVW5zYXZlZERlY2lzaW9ucykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NoZWNrcyBmb3IgdW5zYXZlZCBkZWNpc2lvbnMgaWYgZmlsdGVyIHZhbHVlcyBkbyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2xkU2VhcmNoRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYTogJ2InXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbmV3U2VhcmNoRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJWYWx1ZXM6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBKdXN0IGNoZWNraW5nIHdlIHBhc3MgdGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBjYWxsIGJhY2ssIHNob3VsZCBiZSBhIHByb21pc2UgYnV0IHdoYXRldmVyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdjaGVja0ZvclVuc2F2ZWREZWNpc2lvbnMnKS5hbmQucmV0dXJuVmFsdWUoJ3doYXRldmVyJyk7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNoZWNrVGFibGVQcmVTZWFyY2gob2xkU2VhcmNoRGF0YSwgbmV3U2VhcmNoRGF0YSk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCgnd2hhdGV2ZXInKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuY2hlY2tGb3JVbnNhdmVkRGVjaXNpb25zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3RvZ2dsZUVudGl0eUxpc3QoKSBmbGlwcyB0aGUgdmFsdWUgb2Ygc2hvd0VudGl0eUxpc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zaG93RW50aXR5TGlzdCkudG9CZUZhbHN5KCk7XG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS50b2dnbGVFbnRpdHlMaXN0KCk7XG4gICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2Uuc2hvd0VudGl0eUxpc3QpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnRvZ2dsZUVudGl0eUxpc3QoKTtcbiAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5zaG93RW50aXR5TGlzdCkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
