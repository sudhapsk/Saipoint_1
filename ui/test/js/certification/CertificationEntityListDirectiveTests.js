System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationEntityListDirective', function () {

                var certificationEntityService = undefined,
                    certificationDataService = undefined,
                    ListResultDTO = undefined,
                    CertificationEntity = undefined,
                    $q = undefined,
                    entitiesResult = undefined,
                    entityId = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$q_, certificationTestData, _certificationEntityService_, _ListResultDTO_, _CertificationEntity_, _certificationDataService_) {
                    certificationEntityService = _certificationEntityService_;
                    certificationDataService = _certificationDataService_;
                    CertificationEntity = _CertificationEntity_;
                    ListResultDTO = _ListResultDTO_;
                    $q = _$q_;

                    // Create some mock data
                    var json = angular.copy(certificationTestData.CERTIFICATION_ENTITY_LIST_RESULT);
                    json.objects = json.objects.map(function (object) {
                        return new CertificationEntity(object);
                    });
                    entitiesResult = new ListResultDTO(json);
                    entityId = json.objects[0].id;

                    spyOn(certificationEntityService, 'getCertificationEntities').and.callFake(function () {
                        return $q.when({
                            data: entitiesResult
                        });
                    });
                }));

                function setupResults(total, start, count) {
                    var objects = [];
                    for (var i = start; i < start + count; i++) {
                        objects.push(new CertificationEntity({
                            id: 'id' + i,
                            targetDisplayName: 'name' + i
                        }));
                    }

                    entitiesResult = new ListResultDTO({
                        count: total,
                        objects: objects
                    });
                }

                function setupBulkEntityDecisions() {
                    var bulkEntityDecisions = ['foo', 'bar'];
                    spyOn(certificationDataService, 'getConfiguration').and.returnValue({
                        bulkEntityDecisions: bulkEntityDecisions
                    });
                    return bulkEntityDecisions;
                }

                describe('controller', function () {

                    var $stateParams = undefined,
                        $controller = undefined,
                        $rootScope = undefined,
                        CertificationEntityListState = undefined,
                        showItemStatusCounts = undefined;

                    beforeEach(inject(function (_$controller_, _$rootScope_, _CertificationEntityListState_) {
                        $controller = _$controller_;
                        $rootScope = _$rootScope_;
                        CertificationEntityListState = _CertificationEntityListState_;

                        showItemStatusCounts = false;

                        // Create some mock data
                        $stateParams = {
                            certificationId: 'someCert'
                        };
                    }));

                    /**
                     * Create the controller.
                     *
                     * @param {CertificationEntityListState} [state]  The optional state to use for the controller.
                     *
                     * @return {CertificationEntityListDirectiveCtrl} The controller.
                     */
                    function createController(state) {
                        return $controller('CertificationEntityListDirectiveCtrl', {
                            $stateParams: $stateParams,
                            $scope: $rootScope
                        }, {
                            state: state,
                            showItemStatusCounts: showItemStatusCounts
                        });
                    }

                    describe('constructor', function () {
                        it('should load entities when created', function () {
                            createController();
                            expect(certificationEntityService.getCertificationEntities).toHaveBeenCalled();
                        });

                        it('should create a DataRefreshTrigger with refresh action of fetchEntities()', function () {
                            var ctrl = createController();
                            spyOn(ctrl, 'fetchEntities');
                            spyOn(ctrl.state.checkboxMultiSelect.selectionModel, 'clear');
                            expect(ctrl.refreshTrigger).toBeDefined();
                            ctrl.refreshTrigger.refresh();
                            expect(ctrl.fetchEntities).toHaveBeenCalled();
                            expect(ctrl.state.checkboxMultiSelect.selectionModel.clear).toHaveBeenCalled();
                        });
                    });

                    describe('loadEntities()', function () {
                        it('should call certificationEntityService.getCertificationEntities', function () {
                            var ctrl = createController();
                            $rootScope.$digest();
                            certificationEntityService.getCertificationEntities.calls.reset();
                            ctrl.loadEntities();
                            expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith(ctrl.id, 0, 20, undefined, null, null, false);
                        });

                        it('gets item counts when requested', function () {
                            showItemStatusCounts = true;
                            var ctrl = createController();
                            $rootScope.$digest();
                            certificationEntityService.getCertificationEntities.calls.reset();
                            ctrl.loadEntities();
                            expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith(ctrl.id, 0, 20, undefined, null, null, true);
                        });
                    });

                    describe('loadMoreEntities()', function () {
                        it('increments the page if there are more', function () {
                            setupResults(25, 0, 20);
                            var ctrl = createController();
                            $rootScope.$digest();
                            expect(ctrl.state.pagesDisplayed).toEqual(1);
                            ctrl.loadMoreEntities();
                            expect(ctrl.state.pagesDisplayed).toEqual(2);
                        });

                        it('does not increment the page if there are no more results', function () {
                            setupResults(5, 0, 5);
                            var ctrl = createController();
                            $rootScope.$digest();
                            expect(ctrl.state.pagesDisplayed).toEqual(1);
                            ctrl.loadMoreEntities();
                            expect(ctrl.state.pagesDisplayed).toEqual(1);
                        });

                        it('calls getCertificationEntities()', function () {
                            setupResults(25, 0, 20);
                            var ctrl = createController();
                            $rootScope.$digest();
                            certificationEntityService.getCertificationEntities.calls.reset();
                            ctrl.loadMoreEntities();
                            expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith(ctrl.id, 20, 20, undefined, null, null, false);
                        });
                    });

                    describe('fetchEntities()', function () {
                        it('does not load again if already loading', function () {
                            var ctrl = createController();
                            expect(ctrl.loadingEntities).toEqual(true);
                            expect(certificationEntityService.getCertificationEntities.calls.count()).toEqual(1);

                            // Now try to fetch while the other one is still pending - check that it does nothing.
                            ctrl.fetchEntities();
                            expect(certificationEntityService.getCertificationEntities.calls.count()).toEqual(1);

                            // Let the first promise resolve, then try again.  This one should go through.
                            $rootScope.$digest();
                            expect(ctrl.loadingEntities).toEqual(false);
                            ctrl.fetchEntities();
                            expect(certificationEntityService.getCertificationEntities.calls.count()).toEqual(2);
                        });

                        it('loads the first 20 the first time it is called', function () {
                            var ctrl = createController();
                            expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith(ctrl.id, 0, 20, undefined, null, null, false);
                        });

                        it('starts where it left off when loading subsequent pages', function () {
                            // Load the first 20 when constructed.
                            setupResults(45, 0, 20);
                            var ctrl = createController();
                            $rootScope.$digest();
                            expect(ctrl.entityListData.length).toEqual(20);

                            // Now load the next 20, and make sure they are appended.
                            setupResults(45, 20, 20);
                            ctrl.state.pagesDisplayed = 2;
                            ctrl.fetchEntities();
                            $rootScope.$digest();
                            expect(ctrl.entityListData.length).toEqual(40);
                        });

                        it('loads the full list size if called with multiple pages and no data has been loaded', function () {
                            // Setup a state that will make 3 pages of data be loaded upon construction.
                            var state = new CertificationEntityListState();
                            state.pagesDisplayed = 3;

                            // Create a controller - this will cause the fetch to occur.
                            setupResults(65, 0, 60);
                            var ctrl = createController(state);
                            expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith(ctrl.id, 0, 60, undefined, null, null, false);
                            $rootScope.$digest();
                            expect(ctrl.entityListData.length).toEqual(60);
                        });

                        it('stores the total list size on the controller', function () {
                            var total = 23;
                            setupResults(total, 0, 20);
                            var ctrl = createController();
                            $rootScope.$digest();
                            expect(ctrl.entityListCount).toEqual(total);
                        });
                    });

                    describe('getBulkEntityDecisions()', function () {
                        it('calls certificationDataService.getConfiguration', function () {
                            var bulkEntityDecisions = setupBulkEntityDecisions(),
                                ctrl = createController();
                            var val = ctrl.getBulkEntityDecisions();
                            expect(certificationDataService.getConfiguration).toHaveBeenCalled();
                            expect(val).toBe(bulkEntityDecisions);
                        });

                        it('returns empty array if getConfiguration is undefined', function () {
                            var ctrl = createController();
                            spyOn(certificationDataService, 'getConfiguration').and.returnValue(undefined);
                            var val = ctrl.getBulkEntityDecisions();
                            expect(certificationDataService.getConfiguration).toHaveBeenCalled();
                            expect(val).toEqual([]);
                        });
                    });

                    describe('getEntityName()', function () {
                        it('should truncate names longer than MAX_ENTITY_DISPLAY_LENGTH', function () {
                            var ctrl = createController(),
                                shortName = {
                                targetDisplayName: 'Adam Sandler'
                            },
                                longName = {
                                targetDisplayName: 'Hubert Blaine Wolfeschlegelsteinhausenbergerdorff'
                            },
                                truncatedLongName = {
                                targetDisplayName: 'Hubert Blaine Wolfes...'
                            };

                            expect(ctrl.getEntityName(shortName)).toBe(shortName.targetDisplayName);
                            expect(ctrl.getEntityName(longName)).toBe(truncatedLongName.targetDisplayName);
                        });
                    });

                    describe('isSelected()', function () {
                        it('compares to certificationDataService selectedEntity', function () {
                            var entity = { id: 'dummy' },
                                ctrl = createController();
                            certificationDataService.selectedEntity = entity;
                            expect(ctrl.isSelected(entity)).toEqual(true);
                        });

                        it('returns true if no entity passed and no selectedEntity set', function () {
                            var entity = { id: 'dummy' },
                                ctrl = createController();
                            certificationDataService.selectedEntity = undefined;
                            expect(ctrl.isSelected()).toEqual(true);
                            expect(ctrl.isSelected(entity)).toEqual(false);
                        });
                    });

                    it('goToDetailView() calls through to data service', function () {
                        var ctrl = createController(),
                            entityId = '1234',
                            entity = { id: '1234' };
                        spyOn(certificationDataService, 'goToDetailView');
                        ctrl.goToDetailView(entity);
                        expect(certificationDataService.goToDetailView).toHaveBeenCalledWith(entityId, null);
                    });

                    it('goToWorksheetView() calls through to data service', function () {
                        var ctrl = createController();
                        spyOn(certificationDataService, 'goToWorksheetView');
                        ctrl.goToWorksheetView();
                        expect(certificationDataService.goToWorksheetView).toHaveBeenCalled();
                    });

                    describe('showUndoEntityDelegation', function () {
                        var ctrl = undefined,
                            cert = undefined,
                            entity = undefined;

                        beforeEach(inject(function (Certification, certificationTestData) {
                            ctrl = createController();
                            cert = new Certification(certificationTestData.CERTIFICATION_1);
                            spyOn(certificationDataService, 'getCertification').and.returnValue(cert);
                        }));

                        function testShowUndoEntityDelegationTest(isDelegated, isEditable, expected) {
                            entity = {
                                isEntityDelegated: function () {
                                    return isDelegated;
                                }
                            };
                            cert.editable = isEditable;

                            var showUndoBtn = ctrl.showUndoEntityDelegation(entity);
                            expect(showUndoBtn).toBe(expected);
                        }

                        it('is false if certification is not editable', function () {
                            testShowUndoEntityDelegationTest(true, false, false);
                        });

                        it('is false if entity is not delegated', function () {
                            testShowUndoEntityDelegationTest(false, true, false);
                        });

                        it('is true if entity is delegated and certification is editable', function () {
                            testShowUndoEntityDelegationTest(true, true, true);
                        });
                    });
                });

                describe('directive', function () {

                    var $compile = undefined,
                        CertificationEntityListDirectiveConfig = undefined,
                        CertificationItem = undefined,
                        $scope = undefined,
                        $window = undefined,
                        element = undefined,
                        usePager = undefined,
                        showItemStatusCounts = undefined;

                    /* jshint maxparams:8 */
                    beforeEach(inject(function (_$compile_, $rootScope, $stateParams, certificationTestData, Certification, _$window_, _CertificationEntityListDirectiveConfig_, _CertificationItem_) {
                        $compile = _$compile_;
                        $scope = $rootScope.$new();
                        $window = _$window_;
                        CertificationEntityListDirectiveConfig = _CertificationEntityListDirectiveConfig_;
                        CertificationItem = _CertificationItem_;

                        usePager = false;
                        showItemStatusCounts = false;

                        // This is required by the directive.
                        $stateParams.certificationId = '1234';

                        var cert = new Certification(certificationTestData.CERTIFICATION_1);
                        spyOn(certificationDataService, 'getCertification').and.returnValue(cert);
                    }));

                    afterEach(function () {
                        if (element) {
                            element.remove();
                        }
                        if ($scope) {
                            // Destroy the scope so the sp-if-xs resize listener is cleaned up.
                            $scope.$destroy();
                        }
                    });

                    function createElement() {
                        var showBulk = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
                        var showSearch = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
                        var statuses = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
                        var excludedStatuses = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

                        var elt = '<sp-certification-entity-list sp-config="config"\n                                               sp-use-entity-pager="usePager"\n                                               sp-show-item-status-counts="showItemStatusCounts" />';

                        element = angular.element(elt);

                        $scope.config = new CertificationEntityListDirectiveConfig({
                            showBulkDecisions: showBulk,
                            showSearch: showSearch,
                            statuses: statuses,
                            excludedStatuses: excludedStatuses
                        });

                        $scope.usePager = usePager;
                        $scope.showItemStatusCounts = showItemStatusCounts;

                        $compile(element)($scope);
                        $scope.$digest();

                        // Make it desktop sized by default.
                        $window.innerWidth = 1024;
                        $scope.$digest();
                    }

                    describe('header', function () {
                        function hasHeader() {
                            return element.find('.cert-id-menu-header').length > 0;
                        }

                        it('is displayed if showing bulk selections', function () {
                            setupBulkEntityDecisions();
                            createElement(true, false);
                            expect(hasHeader()).toEqual(true);
                        });

                        it('is displayed if showing the search box', function () {
                            createElement(false, true);
                            expect(hasHeader()).toEqual(true);
                        });

                        it('is not displayed if bulk and the search bar are not available', function () {
                            createElement(false, false);
                            expect(hasHeader()).toEqual(false);
                        });
                    });

                    it('search filters the list when the button is clicked', function () {
                        createElement(false, true);

                        certificationEntityService.getCertificationEntities.calls.reset();
                        var searchField = element.find('#idSearchField');
                        searchField.val('love');
                        searchField.trigger('input');
                        var searchButton = element.find('#idSearchBtn');
                        searchButton.click();

                        expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith('1234', 0, 20, 'love', null, null, false);
                    });

                    it('filters based on status if passed into config', function () {
                        var statuses = [CertificationItem.Status.Complete];
                        createElement(false, false, statuses);
                        expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith('1234', 0, 20, undefined, statuses, null, false);
                    });

                    it('filters based on excluded status if passed into config', function () {
                        var statuses = [CertificationItem.Status.Complete];
                        createElement(false, false, null, statuses);
                        expect(certificationEntityService.getCertificationEntities).toHaveBeenCalledWith('1234', 0, 20, undefined, null, statuses, false);
                    });

                    it('table is displayed on desktop', function () {
                        createElement();
                        var table = element.find('table.cert-id-list');
                        expect(table.length).toEqual(1);
                    });

                    describe('mobile', function () {
                        function mobilize() {
                            $window.innerWidth = 667;
                            $scope.$digest();
                        }

                        beforeEach(function () {
                            // Use a single result so it is easier to click.
                            setupResults(1, 0, 1);
                        });

                        function clickCard() {
                            var cards = element.find('div.cert-entity-list-cards');
                            var card = cards.find('.panel-body');
                            card.click();
                        }

                        it('shows cards', function () {
                            createElement();
                            mobilize();
                            var cards = element.find('div.cert-entity-list-cards');
                            expect(cards.length).toEqual(1);
                        });

                        it('shows the remaining item count when requested', function () {
                            // Mock out the getIncompleteCount() method on the one entity that is returned.
                            var incompleteCount = 3478;
                            entitiesResult.objects[0].itemStatusCount = {
                                getIncompleteCount: jasmine.createSpy('getIncompleteCount').and.returnValue(incompleteCount)
                            };

                            // Setup the directive to display the counts.
                            showItemStatusCounts = true;

                            createElement();
                            mobilize();
                            var counts = element.find('div.cert-entity-list-cards > .panel > .panel-body > span.pull-right > span.label');
                            expect(counts.length).toEqual(1);
                            expect(counts.text().trim()).toEqual(incompleteCount.toString(10));
                        });

                        it('goes to the detail view when a card is clicked', function () {
                            createElement();
                            mobilize();
                            spyOn(certificationDataService, 'goToDetailView');
                            clickCard();
                            expect(certificationDataService.goToDetailView).toHaveBeenCalledWith('id0', null);
                        });

                        it('passes a callback when paging is configured and a card is clicked', function () {
                            var pagerId = '123837734';
                            usePager = true;
                            createElement();
                            mobilize();

                            spyOn(certificationEntityService, 'getCertificationEntityIds').and.returnValue($q.when([pagerId]));
                            spyOn(certificationDataService, 'goToDetailView');
                            clickCard();
                            expect(certificationDataService.goToDetailView).toHaveBeenCalled();

                            var args = certificationDataService.goToDetailView.calls.mostRecent().args;
                            expect(args[0]).toEqual('id0');
                            expect(angular.isFunction(args[1])).toEqual(true);

                            var pager = undefined;
                            args[1]().then(function (entityPager) {
                                return pager = entityPager;
                            });
                            $scope.$digest();
                            expect(certificationEntityService.getCertificationEntityIds).toHaveBeenCalled();
                            expect(pager.currentIdx).toEqual(0);
                            expect(pager.entityIds).toEqual([pagerId]);
                        });
                    });

                    it('load more button', function () {
                        function getButton() {
                            return element.find('button.load-more');
                        }

                        function hasButton() {
                            return getButton().length > 0;
                        }

                        it('is not displayed if there are no more results', function () {
                            setupResults(5, 0, 5);
                            createElement();
                            expect(hasButton()).toEqual(false);
                        });

                        it('is displayed if there are more results', function () {
                            setupResults(25, 0, 20);
                            createElement();
                            expect(hasButton()).toEqual(true);
                        });

                        it('loads the next page of data when clicked', function () {
                            // Do an initial load of the first 20 identities.
                            setupResults(25, 0, 20);
                            createElement();
                            var button = getButton();

                            // Make the button click return 5 more identities.
                            setupResults(25, 20, 5);
                            button.click();

                            // Check that we have 25 rows now (well ... actually 26 because of the "Worksheet View" row).
                            var rows = element.find('table.cert-id-list tr');
                            expect(rows.length).toEqual(26);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkVudGl0eUxpc3REaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0NBQXNDLFVBQVUsU0FBUzs7O0lBR2pHOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQzs7UUFFNUQsU0FBUyxZQUFZOztZQUw3QixTQUFTLG9DQUFvQyxZQUFXOztnQkFFcEQsSUFBSSw2QkFBMEI7b0JBQUUsMkJBQXdCO29CQUFFLGdCQUFhO29CQUFFLHNCQUFtQjtvQkFBRSxLQUFFO29CQUFFLGlCQUFjO29CQUM1RyxXQUFROztnQkFFWixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxNQUFNLHVCQUF1Qiw4QkFBOEIsaUJBQzNELHVCQUF1Qiw0QkFBNEI7b0JBQzFFLDZCQUE2QjtvQkFDN0IsMkJBQTJCO29CQUMzQixzQkFBc0I7b0JBQ3RCLGdCQUFnQjtvQkFDaEIsS0FBSzs7O29CQUdMLElBQUksT0FBTyxRQUFRLEtBQUssc0JBQXNCO29CQUM5QyxLQUFLLFVBQVUsS0FBSyxRQUFRLElBQUksVUFBQSxRQUFNO3dCQVl0QixPQVowQixJQUFJLG9CQUFvQjs7b0JBQ2xFLGlCQUFpQixJQUFJLGNBQWM7b0JBQ25DLFdBQVcsS0FBSyxRQUFRLEdBQUc7O29CQUUzQixNQUFNLDRCQUE0Qiw0QkFBNEIsSUFBSSxTQUFTLFlBQU07d0JBQzdFLE9BQU8sR0FBRyxLQUFLOzRCQUNYLE1BQU07Ozs7O2dCQUtsQixTQUFTLGFBQWEsT0FBTyxPQUFPLE9BQU87b0JBQ3ZDLElBQUksVUFBVTtvQkFDZCxLQUFLLElBQUksSUFBSSxPQUFPLElBQUksUUFBUSxPQUFPLEtBQUs7d0JBQ3hDLFFBQVEsS0FBSyxJQUFJLG9CQUFvQjs0QkFDakMsSUFBRSxPQUFPOzRC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Ozs7d0JBR2hDLEdBQUcsMENBQTBDLFlBQU07NEJBQy9DLGFBQWEsSUFBSSxHQUFHOzRCQUNwQjs0QkFDQSxPQUFPLGFBQWEsUUFBUTs7O3dCQUdoQyxHQUFHLDRDQUE0QyxZQUFNOzs0QkFFakQsYUFBYSxJQUFJLEdBQUc7NEJBQ3BCOzRCQUNBLElBQUksU0FBUzs7OzRCQUdiLGFBQWEsSUFBSSxJQUFJOzRCQUNyQixPQUFPOzs7NEJBR1AsSUFBSSxPQUFPLFFBQVEsS0FBSzs0QkFDeEIsT0FBTyxLQUFLLFFBQVEsUUFBUTs7Ozs7OztHQTJCekMiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uRW50aXR5TGlzdERpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXHJcblxyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdERpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxldCBjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZSwgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCBMaXN0UmVzdWx0RFRPLCBDZXJ0aWZpY2F0aW9uRW50aXR5LCAkcSwgZW50aXRpZXNSZXN1bHQsXHJcbiAgICAgICAgZW50aXR5SWQ7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcV8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSwgX2NlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlXywgX0xpc3RSZXN1bHREVE9fLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0NlcnRpZmljYXRpb25FbnRpdHlfLCBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXykge1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlXztcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcclxuICAgICAgICBDZXJ0aWZpY2F0aW9uRW50aXR5ID0gX0NlcnRpZmljYXRpb25FbnRpdHlfO1xyXG4gICAgICAgIExpc3RSZXN1bHREVE8gPSBfTGlzdFJlc3VsdERUT187XHJcbiAgICAgICAgJHEgPSBfJHFfO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgc29tZSBtb2NrIGRhdGFcclxuICAgICAgICBsZXQganNvbiA9IGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl9FTlRJVFlfTElTVF9SRVNVTFQpO1xyXG4gICAgICAgIGpzb24ub2JqZWN0cyA9IGpzb24ub2JqZWN0cy5tYXAob2JqZWN0ID0+IG5ldyBDZXJ0aWZpY2F0aW9uRW50aXR5KG9iamVjdCkpO1xyXG4gICAgICAgIGVudGl0aWVzUmVzdWx0ID0gbmV3IExpc3RSZXN1bHREVE8oanNvbik7XHJcbiAgICAgICAgZW50aXR5SWQgPSBqc29uLm9iamVjdHNbMF0uaWQ7XHJcblxyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLCAnZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNSZXN1bHRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXBSZXN1bHRzKHRvdGFsLCBzdGFydCwgY291bnQpIHtcclxuICAgICAgICBsZXQgb2JqZWN0cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBvYmplY3RzLnB1c2gobmV3IENlcnRpZmljYXRpb25FbnRpdHkoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGBpZCR7aX1gLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0RGlzcGxheU5hbWU6IGBuYW1lJHtpfWBcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZW50aXRpZXNSZXN1bHQgPSBuZXcgTGlzdFJlc3VsdERUTyh7XHJcbiAgICAgICAgICAgIGNvdW50OiB0b3RhbCxcclxuICAgICAgICAgICAgb2JqZWN0czogb2JqZWN0c1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwQnVsa0VudGl0eURlY2lzaW9ucygpIHtcclxuICAgICAgICBsZXQgYnVsa0VudGl0eURlY2lzaW9ucyA9IFsnZm9vJywgJ2JhciddO1xyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dldENvbmZpZ3VyYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICBidWxrRW50aXR5RGVjaXNpb25zOiBidWxrRW50aXR5RGVjaXNpb25zXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGJ1bGtFbnRpdHlEZWNpc2lvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbnRyb2xsZXInLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGxldCAkc3RhdGVQYXJhbXMsICRjb250cm9sbGVyLCAkcm9vdFNjb3BlLCBDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdFN0YXRlLCBzaG93SXRlbVN0YXR1c0NvdW50cztcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXywgXyRyb290U2NvcGVfLCBfQ2VydGlmaWNhdGlvbkVudGl0eUxpc3RTdGF0ZV8pIHtcclxuICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xyXG4gICAgICAgICAgICBDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdFN0YXRlID0gX0NlcnRpZmljYXRpb25FbnRpdHlMaXN0U3RhdGVfO1xyXG5cclxuICAgICAgICAgICAgc2hvd0l0ZW1TdGF0dXNDb3VudHMgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBzb21lIG1vY2sgZGF0YVxyXG4gICAgICAgICAgICAkc3RhdGVQYXJhbXMgPSB7XHJcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSWQ6ICdzb21lQ2VydCdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSB0aGUgY29udHJvbGxlci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7Q2VydGlmaWNhdGlvbkVudGl0eUxpc3RTdGF0ZX0gW3N0YXRlXSAgVGhlIG9wdGlvbmFsIHN0YXRlIHRvIHVzZSBmb3IgdGhlIGNvbnRyb2xsZXIuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdERpcmVjdGl2ZUN0cmx9IFRoZSBjb250cm9sbGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdERpcmVjdGl2ZUN0cmwnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXMsXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlOiAkcm9vdFNjb3BlXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dJdGVtU3RhdHVzQ291bnRzOiBzaG93SXRlbVN0YXR1c0NvdW50c1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgbG9hZCBlbnRpdGllcyB3aGVuIGNyZWF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBEYXRhUmVmcmVzaFRyaWdnZXIgd2l0aCByZWZyZXNoIGFjdGlvbiBvZiBmZXRjaEVudGl0aWVzKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIHNweU9uKGN0cmwsICdmZXRjaEVudGl0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihjdHJsLnN0YXRlLmNoZWNrYm94TXVsdGlTZWxlY3Quc2VsZWN0aW9uTW9kZWwsICdjbGVhcicpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwucmVmcmVzaFRyaWdnZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnJlZnJlc2hUcmlnZ2VyLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmZldGNoRW50aXRpZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLnN0YXRlLmNoZWNrYm94TXVsdGlTZWxlY3Quc2VsZWN0aW9uTW9kZWwuY2xlYXIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdsb2FkRW50aXRpZXMoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGNhbGwgY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmxvYWRFbnRpdGllcygpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25FbnRpdGllcylcclxuICAgICAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoY3RybC5pZCwgMCwgMjAsIHVuZGVmaW5lZCwgbnVsbCwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdnZXRzIGl0ZW0gY291bnRzIHdoZW4gcmVxdWVzdGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvd0l0ZW1TdGF0dXNDb3VudHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25FbnRpdGllcy5jYWxscy5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5sb2FkRW50aXRpZXMoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uRW50aXRpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGN0cmwuaWQsIDAsIDIwLCB1bmRlZmluZWQsIG51bGwsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ2xvYWRNb3JlRW50aXRpZXMoKScsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ2luY3JlbWVudHMgdGhlIHBhZ2UgaWYgdGhlcmUgYXJlIG1vcmUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlc3VsdHMoMjUsIDAsIDIwKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5zdGF0ZS5wYWdlc0Rpc3BsYXllZCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgICAgIGN0cmwubG9hZE1vcmVFbnRpdGllcygpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuc3RhdGUucGFnZXNEaXNwbGF5ZWQpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGluY3JlbWVudCB0aGUgcGFnZSBpZiB0aGVyZSBhcmUgbm8gbW9yZSByZXN1bHRzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBSZXN1bHRzKDUsIDAsIDUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLnN0YXRlLnBhZ2VzRGlzcGxheWVkKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5sb2FkTW9yZUVudGl0aWVzKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5zdGF0ZS5wYWdlc0Rpc3BsYXllZCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnY2FsbHMgZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlc3VsdHMoMjUsIDAsIDIwKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uRW50aXRpZXMuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwubG9hZE1vcmVFbnRpdGllcygpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25FbnRpdGllcylcclxuICAgICAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoY3RybC5pZCwgMjAsIDIwLCB1bmRlZmluZWQsIG51bGwsIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdmZXRjaEVudGl0aWVzKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdCBsb2FkIGFnYWluIGlmIGFscmVhZHkgbG9hZGluZycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwubG9hZGluZ0VudGl0aWVzKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25FbnRpdGllcy5jYWxscy5jb3VudCgpKS50b0VxdWFsKDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vdyB0cnkgdG8gZmV0Y2ggd2hpbGUgdGhlIG90aGVyIG9uZSBpcyBzdGlsbCBwZW5kaW5nIC0gY2hlY2sgdGhhdCBpdCBkb2VzIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAgICBjdHJsLmZldGNoRW50aXRpZXMoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uRW50aXRpZXMuY2FsbHMuY291bnQoKSkudG9FcXVhbCgxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZXQgdGhlIGZpcnN0IHByb21pc2UgcmVzb2x2ZSwgdGhlbiB0cnkgYWdhaW4uICBUaGlzIG9uZSBzaG91bGQgZ28gdGhyb3VnaC5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwubG9hZGluZ0VudGl0aWVzKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuZmV0Y2hFbnRpdGllcygpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25FbnRpdHlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25FbnRpdGllcy5jYWxscy5jb3VudCgpKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdsb2FkcyB0aGUgZmlyc3QgMjAgdGhlIGZpcnN0IHRpbWUgaXQgaXMgY2FsbGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzKVxyXG4gICAgICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChjdHJsLmlkLCAwLCAyMCwgdW5kZWZpbmVkLCBudWxsLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3N0YXJ0cyB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGxvYWRpbmcgc3Vic2VxdWVudCBwYWdlcycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIExvYWQgdGhlIGZpcnN0IDIwIHdoZW4gY29uc3RydWN0ZWQuXHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlc3VsdHMoNDUsIDAsIDIwKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5lbnRpdHlMaXN0RGF0YS5sZW5ndGgpLnRvRXF1YWwoMjApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vdyBsb2FkIHRoZSBuZXh0IDIwLCBhbmQgbWFrZSBzdXJlIHRoZXkgYXJlIGFwcGVuZGVkLlxyXG4gICAgICAgICAgICAgICAgc2V0dXBSZXN1bHRzKDQ1LCAyMCwgMjApO1xyXG4gICAgICAgICAgICAgICAgY3RybC5zdGF0ZS5wYWdlc0Rpc3BsYXllZCA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmZldGNoRW50aXRpZXMoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZW50aXR5TGlzdERhdGEubGVuZ3RoKS50b0VxdWFsKDQwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnbG9hZHMgdGhlIGZ1bGwgbGlzdCBzaXplIGlmIGNhbGxlZCB3aXRoIG11bHRpcGxlIHBhZ2VzIGFuZCBubyBkYXRhIGhhcyBiZWVuIGxvYWRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFNldHVwIGEgc3RhdGUgdGhhdCB3aWxsIG1ha2UgMyBwYWdlcyBvZiBkYXRhIGJlIGxvYWRlZCB1cG9uIGNvbnN0cnVjdGlvbi5cclxuICAgICAgICAgICAgICAgIGxldCBzdGF0ZSA9IG5ldyBDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5wYWdlc0Rpc3BsYXllZCA9IDM7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgY29udHJvbGxlciAtIHRoaXMgd2lsbCBjYXVzZSB0aGUgZmV0Y2ggdG8gb2NjdXIuXHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlc3VsdHMoNjUsIDAsIDYwKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzKS5cclxuICAgICAgICAgICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChjdHJsLmlkLCAwLCA2MCwgdW5kZWZpbmVkLCBudWxsLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmVudGl0eUxpc3REYXRhLmxlbmd0aCkudG9FcXVhbCg2MCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3N0b3JlcyB0aGUgdG90YWwgbGlzdCBzaXplIG9uIHRoZSBjb250cm9sbGVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gMjM7XHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlc3VsdHModG90YWwsIDAsIDIwKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5lbnRpdHlMaXN0Q291bnQpLnRvRXF1YWwodG90YWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdnZXRCdWxrRW50aXR5RGVjaXNpb25zKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdjYWxscyBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Q29uZmlndXJhdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBidWxrRW50aXR5RGVjaXNpb25zID0gc2V0dXBCdWxrRW50aXR5RGVjaXNpb25zKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWwgPSBjdHJsLmdldEJ1bGtFbnRpdHlEZWNpc2lvbnMoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ2V0Q29uZmlndXJhdGlvbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHZhbCkudG9CZShidWxrRW50aXR5RGVjaXNpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBlbXB0eSBhcnJheSBpZiBnZXRDb25maWd1cmF0aW9uIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IGN0cmwuZ2V0QnVsa0VudGl0eURlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRDb25maWd1cmF0aW9uKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QodmFsKS50b0VxdWFsKFtdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdnZXRFbnRpdHlOYW1lKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCB0cnVuY2F0ZSBuYW1lcyBsb25nZXIgdGhhbiBNQVhfRU5USVRZX0RJU1BMQVlfTEVOR1RIJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKSxcclxuICAgICAgICAgICAgICAgICAgICBzaG9ydE5hbWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERpc3BsYXlOYW1lOiAnQWRhbSBTYW5kbGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ05hbWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERpc3BsYXlOYW1lOiAnSHViZXJ0IEJsYWluZSBXb2xmZXNjaGxlZ2Vsc3RlaW5oYXVzZW5iZXJnZXJkb3JmZidcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRydW5jYXRlZExvbmdOYW1lID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXNwbGF5TmFtZTogJ0h1YmVydCBCbGFpbmUgV29sZmVzLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0RW50aXR5TmFtZShzaG9ydE5hbWUpKS50b0JlKHNob3J0TmFtZS50YXJnZXREaXNwbGF5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5nZXRFbnRpdHlOYW1lKGxvbmdOYW1lKSkudG9CZSh0cnVuY2F0ZWRMb25nTmFtZS50YXJnZXREaXNwbGF5TmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnaXNTZWxlY3RlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgnY29tcGFyZXMgdG8gY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlIHNlbGVjdGVkRW50aXR5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVudGl0eSA9IHsgaWQ6ICdkdW1teScgfSxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0gZW50aXR5O1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWxlY3RlZChlbnRpdHkpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgbm8gZW50aXR5IHBhc3NlZCBhbmQgbm8gc2VsZWN0ZWRFbnRpdHkgc2V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVudGl0eSA9IHsgaWQ6ICdkdW1teScgfSxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLnNlbGVjdGVkRW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWxlY3RlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZWxlY3RlZChlbnRpdHkpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdnb1RvRGV0YWlsVmlldygpIGNhbGxzIHRocm91Z2ggdG8gZGF0YSBzZXJ2aWNlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKSxcclxuICAgICAgICAgICAgICAgIGVudGl0eUlkID0gJzEyMzQnLFxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0geyBpZDogJzEyMzQnIH07XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dvVG9EZXRhaWxWaWV3Jyk7XHJcbiAgICAgICAgICAgIGN0cmwuZ29Ub0RldGFpbFZpZXcoZW50aXR5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nb1RvRGV0YWlsVmlldykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZW50aXR5SWQsIG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ29Ub1dvcmtzaGVldFZpZXcoKSBjYWxscyB0aHJvdWdoIHRvIGRhdGEgc2VydmljZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dvVG9Xb3Jrc2hlZXRWaWV3Jyk7XHJcbiAgICAgICAgICAgIGN0cmwuZ29Ub1dvcmtzaGVldFZpZXcoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nb1RvV29ya3NoZWV0VmlldykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnc2hvd1VuZG9FbnRpdHlEZWxlZ2F0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCwgY2VydCwgZW50aXR5O1xyXG5cclxuICAgICAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKENlcnRpZmljYXRpb24sIGNlcnRpZmljYXRpb25UZXN0RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGNlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKTtcclxuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dldENlcnRpZmljYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoY2VydCk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRlc3RTaG93VW5kb0VudGl0eURlbGVnYXRpb25UZXN0KGlzRGVsZWdhdGVkLCBpc0VkaXRhYmxlLCBleHBlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRW50aXR5RGVsZWdhdGVkOiAoKSA9PiBpc0RlbGVnYXRlZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNlcnQuZWRpdGFibGUgPSBpc0VkaXRhYmxlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzaG93VW5kb0J0biA9IGN0cmwuc2hvd1VuZG9FbnRpdHlEZWxlZ2F0aW9uKGVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2hvd1VuZG9CdG4pLnRvQmUoZXhwZWN0ZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgnaXMgZmFsc2UgaWYgY2VydGlmaWNhdGlvbiBpcyBub3QgZWRpdGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0U2hvd1VuZG9FbnRpdHlEZWxlZ2F0aW9uVGVzdCh0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdpcyBmYWxzZSBpZiBlbnRpdHkgaXMgbm90IGRlbGVnYXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlc3RTaG93VW5kb0VudGl0eURlbGVnYXRpb25UZXN0KGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2lzIHRydWUgaWYgZW50aXR5IGlzIGRlbGVnYXRlZCBhbmQgY2VydGlmaWNhdGlvbiBpcyBlZGl0YWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlc3RTaG93VW5kb0VudGl0eURlbGVnYXRpb25UZXN0KHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdkaXJlY3RpdmUnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGxldCAkY29tcGlsZSwgQ2VydGlmaWNhdGlvbkVudGl0eUxpc3REaXJlY3RpdmVDb25maWcsIENlcnRpZmljYXRpb25JdGVtLCAkc2NvcGUsICR3aW5kb3csIGVsZW1lbnQsIHVzZVBhZ2VyLFxyXG4gICAgICAgICAgICBzaG93SXRlbVN0YXR1c0NvdW50cztcclxuXHJcbiAgICAgICAgLyoganNoaW50IG1heHBhcmFtczo4ICovXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF8kY29tcGlsZV8sICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgY2VydGlmaWNhdGlvblRlc3REYXRhLCBDZXJ0aWZpY2F0aW9uLCBfJHdpbmRvd18sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIF9DZXJ0aWZpY2F0aW9uRW50aXR5TGlzdERpcmVjdGl2ZUNvbmZpZ18sIF9DZXJ0aWZpY2F0aW9uSXRlbV8pID0+IHtcclxuICAgICAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xyXG4gICAgICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgJHdpbmRvdyA9IF8kd2luZG93XztcclxuICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkVudGl0eUxpc3REaXJlY3RpdmVDb25maWcgPSBfQ2VydGlmaWNhdGlvbkVudGl0eUxpc3REaXJlY3RpdmVDb25maWdfO1xyXG4gICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbSA9IF9DZXJ0aWZpY2F0aW9uSXRlbV87XHJcblxyXG4gICAgICAgICAgICB1c2VQYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzaG93SXRlbVN0YXR1c0NvdW50cyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8gVGhpcyBpcyByZXF1aXJlZCBieSB0aGUgZGlyZWN0aXZlLlxyXG4gICAgICAgICAgICAkc3RhdGVQYXJhbXMuY2VydGlmaWNhdGlvbklkID0gJzEyMzQnO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q2VydGlmaWNhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShjZXJ0KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGFmdGVyRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIERlc3Ryb3kgdGhlIHNjb3BlIHNvIHRoZSBzcC1pZi14cyByZXNpemUgbGlzdGVuZXIgaXMgY2xlYW5lZCB1cC5cclxuICAgICAgICAgICAgICAgICRzY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoc2hvd0J1bGsgPSBmYWxzZSwgc2hvd1NlYXJjaCA9IGZhbHNlLCBzdGF0dXNlcyA9IG51bGwsIGV4Y2x1ZGVkU3RhdHVzZXMgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBlbHQgPVxyXG4gICAgICAgICAgICAgICAgYDxzcC1jZXJ0aWZpY2F0aW9uLWVudGl0eS1saXN0IHNwLWNvbmZpZz1cImNvbmZpZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3AtdXNlLWVudGl0eS1wYWdlcj1cInVzZVBhZ2VyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcC1zaG93LWl0ZW0tc3RhdHVzLWNvdW50cz1cInNob3dJdGVtU3RhdHVzQ291bnRzXCIgLz5gO1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbHQpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNvbmZpZyA9IG5ldyBDZXJ0aWZpY2F0aW9uRW50aXR5TGlzdERpcmVjdGl2ZUNvbmZpZyh7XHJcbiAgICAgICAgICAgICAgICBzaG93QnVsa0RlY2lzaW9uczogc2hvd0J1bGssXHJcbiAgICAgICAgICAgICAgICBzaG93U2VhcmNoOiBzaG93U2VhcmNoLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IHN0YXR1c2VzLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZWRTdGF0dXNlczogZXhjbHVkZWRTdGF0dXNlc1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51c2VQYWdlciA9IHVzZVBhZ2VyO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0l0ZW1TdGF0dXNDb3VudHMgPSBzaG93SXRlbVN0YXR1c0NvdW50cztcclxuXHJcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIGl0IGRlc2t0b3Agc2l6ZWQgYnkgZGVmYXVsdC5cclxuICAgICAgICAgICAgJHdpbmRvdy5pbm5lcldpZHRoID0gMTAyNDtcclxuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdoZWFkZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGhhc0hlYWRlcigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZWxlbWVudC5maW5kKCcuY2VydC1pZC1tZW51LWhlYWRlcicpLmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgnaXMgZGlzcGxheWVkIGlmIHNob3dpbmcgYnVsayBzZWxlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBCdWxrRW50aXR5RGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChoYXNIZWFkZXIoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnaXMgZGlzcGxheWVkIGlmIHNob3dpbmcgdGhlIHNlYXJjaCBib3gnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChoYXNIZWFkZXIoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnaXMgbm90IGRpc3BsYXllZCBpZiBidWxrIGFuZCB0aGUgc2VhcmNoIGJhciBhcmUgbm90IGF2YWlsYWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChoYXNIZWFkZXIoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2VhcmNoIGZpbHRlcnMgdGhlIGxpc3Qgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hGaWVsZCA9IGVsZW1lbnQuZmluZCgnI2lkU2VhcmNoRmllbGQnKTtcclxuICAgICAgICAgICAgc2VhcmNoRmllbGQudmFsKCdsb3ZlJyk7XHJcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkLnRyaWdnZXIoJ2lucHV0Jyk7XHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hCdXR0b24gPSBlbGVtZW50LmZpbmQoJyNpZFNlYXJjaEJ0bicpO1xyXG4gICAgICAgICAgICBzZWFyY2hCdXR0b24uY2xpY2soKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uRW50aXRpZXMpLlxyXG4gICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgoJzEyMzQnLCAwLCAyMCwgJ2xvdmUnLCBudWxsLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdmaWx0ZXJzIGJhc2VkIG9uIHN0YXR1cyBpZiBwYXNzZWQgaW50byBjb25maWcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0dXNlcyA9IFsgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNvbXBsZXRlIF07XHJcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoZmFsc2UsIGZhbHNlLCBzdGF0dXNlcyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uRW50aXRpZXMpLlxyXG4gICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgoJzEyMzQnLCAwLCAyMCwgdW5kZWZpbmVkLCBzdGF0dXNlcywgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZmlsdGVycyBiYXNlZCBvbiBleGNsdWRlZCBzdGF0dXMgaWYgcGFzc2VkIGludG8gY29uZmlnJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzZXMgPSBbIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5Db21wbGV0ZSBdO1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KGZhbHNlLCBmYWxzZSwgbnVsbCwgc3RhdHVzZXMpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0aWVzKS5cclxuICAgICAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcxMjM0JywgMCwgMjAsIHVuZGVmaW5lZCwgbnVsbCwgc3RhdHVzZXMsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3RhYmxlIGlzIGRpc3BsYXllZCBvbiBkZXNrdG9wJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGxldCB0YWJsZSA9IGVsZW1lbnQuZmluZCgndGFibGUuY2VydC1pZC1saXN0Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdtb2JpbGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG1vYmlsaXplKCkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5pbm5lcldpZHRoID0gNjY3O1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgYSBzaW5nbGUgcmVzdWx0IHNvIGl0IGlzIGVhc2llciB0byBjbGljay5cclxuICAgICAgICAgICAgICAgIHNldHVwUmVzdWx0cygxLCAwLCAxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjbGlja0NhcmQoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZHMgPSBlbGVtZW50LmZpbmQoJ2Rpdi5jZXJ0LWVudGl0eS1saXN0LWNhcmRzJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZCA9IGNhcmRzLmZpbmQoJy5wYW5lbC1ib2R5Jyk7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG93cyBjYXJkcycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIG1vYmlsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZHMgPSBlbGVtZW50LmZpbmQoJ2Rpdi5jZXJ0LWVudGl0eS1saXN0LWNhcmRzJyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY2FyZHMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG93cyB0aGUgcmVtYWluaW5nIGl0ZW0gY291bnQgd2hlbiByZXF1ZXN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBNb2NrIG91dCB0aGUgZ2V0SW5jb21wbGV0ZUNvdW50KCkgbWV0aG9kIG9uIHRoZSBvbmUgZW50aXR5IHRoYXQgaXMgcmV0dXJuZWQuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmNvbXBsZXRlQ291bnQgPSAzNDc4O1xyXG4gICAgICAgICAgICAgICAgZW50aXRpZXNSZXN1bHQub2JqZWN0c1swXS5pdGVtU3RhdHVzQ291bnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0SW5jb21wbGV0ZUNvdW50OiBqYXNtaW5lLmNyZWF0ZVNweSgnZ2V0SW5jb21wbGV0ZUNvdW50JykuYW5kLnJldHVyblZhbHVlKGluY29tcGxldGVDb3VudClcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgdGhlIGRpcmVjdGl2ZSB0byBkaXNwbGF5IHRoZSBjb3VudHMuXHJcbiAgICAgICAgICAgICAgICBzaG93SXRlbVN0YXR1c0NvdW50cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgbW9iaWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb3VudHMgPVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnZGl2LmNlcnQtZW50aXR5LWxpc3QtY2FyZHMgPiAucGFuZWwgPiAucGFuZWwtYm9keSA+IHNwYW4ucHVsbC1yaWdodCA+IHNwYW4ubGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb3VudHMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvdW50cy50ZXh0KCkudHJpbSgpKS50b0VxdWFsKGluY29tcGxldGVDb3VudC50b1N0cmluZygxMCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdnb2VzIHRvIHRoZSBkZXRhaWwgdmlldyB3aGVuIGEgY2FyZCBpcyBjbGlja2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgbW9iaWxpemUoKTtcclxuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dvVG9EZXRhaWxWaWV3Jyk7XHJcbiAgICAgICAgICAgICAgICBjbGlja0NhcmQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdpZDAnLCBudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncGFzc2VzIGEgY2FsbGJhY2sgd2hlbiBwYWdpbmcgaXMgY29uZmlndXJlZCBhbmQgYSBjYXJkIGlzIGNsaWNrZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFnZXJJZCA9ICcxMjM4Mzc3MzQnO1xyXG4gICAgICAgICAgICAgICAgdXNlUGFnZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgbW9iaWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRW50aXR5U2VydmljZSwgJ2dldENlcnRpZmljYXRpb25FbnRpdHlJZHMnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihbcGFnZXJJZF0pKTtcclxuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dvVG9EZXRhaWxWaWV3Jyk7XHJcbiAgICAgICAgICAgICAgICBjbGlja0NhcmQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZ29Ub0RldGFpbFZpZXcpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYXJncyA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nb1RvRGV0YWlsVmlldy5jYWxscy5tb3N0UmVjZW50KCkuYXJncztcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhcmdzWzBdKS50b0VxdWFsKCdpZDAnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oYXJnc1sxXSkpLnRvRXF1YWwodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhZ2VyO1xyXG4gICAgICAgICAgICAgICAgYXJnc1sxXSgpLnRoZW4oKGVudGl0eVBhZ2VyKSA9PiBwYWdlciA9IGVudGl0eVBhZ2VyKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkVudGl0eVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkVudGl0eUlkcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHBhZ2VyLmN1cnJlbnRJZHgpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocGFnZXIuZW50aXR5SWRzKS50b0VxdWFsKFsgcGFnZXJJZCBdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdsb2FkIG1vcmUgYnV0dG9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRCdXR0b24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5maW5kKCdidXR0b24ubG9hZC1tb3JlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGhhc0J1dHRvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZ2V0QnV0dG9uKCkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0KCdpcyBub3QgZGlzcGxheWVkIGlmIHRoZXJlIGFyZSBubyBtb3JlIHJlc3VsdHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cFJlc3VsdHMoNSwgMCwgNSk7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoaGFzQnV0dG9uKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdpcyBkaXNwbGF5ZWQgaWYgdGhlcmUgYXJlIG1vcmUgcmVzdWx0cycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNldHVwUmVzdWx0cygyNSwgMCwgMjApO1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGhhc0J1dHRvbigpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdsb2FkcyB0aGUgbmV4dCBwYWdlIG9mIGRhdGEgd2hlbiBjbGlja2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gRG8gYW4gaW5pdGlhbCBsb2FkIG9mIHRoZSBmaXJzdCAyMCBpZGVudGl0aWVzLlxyXG4gICAgICAgICAgICAgICAgc2V0dXBSZXN1bHRzKDI1LCAwLCAyMCk7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uID0gZ2V0QnV0dG9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSB0aGUgYnV0dG9uIGNsaWNrIHJldHVybiA1IG1vcmUgaWRlbnRpdGllcy5cclxuICAgICAgICAgICAgICAgIHNldHVwUmVzdWx0cygyNSwgMjAsIDUpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCB3ZSBoYXZlIDI1IHJvd3Mgbm93ICh3ZWxsIC4uLiBhY3R1YWxseSAyNiBiZWNhdXNlIG9mIHRoZSBcIldvcmtzaGVldCBWaWV3XCIgcm93KS5cclxuICAgICAgICAgICAgICAgIGxldCByb3dzID0gZWxlbWVudC5maW5kKCd0YWJsZS5jZXJ0LWlkLWxpc3QgdHInKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChyb3dzLmxlbmd0aCkudG9FcXVhbCgyNik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
