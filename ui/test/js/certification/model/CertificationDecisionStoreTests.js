System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationDecisionStore', function () {

                var CertificationDecision = undefined,
                    CertificationActionStatus = undefined,
                    SelectionModel = undefined,
                    CertificationItem = undefined,
                    CertificationTableScope = undefined,
                    store = undefined,
                    item1 = undefined,
                    item2 = undefined,
                    item3 = undefined,
                    tableScope = undefined;

                function getStatus(status) {
                    return new CertificationActionStatus({
                        status: status
                    });
                }

                beforeEach(module(certificationModule));

                /* jshint maxparams: 7 */
                beforeEach(inject(function (CertificationDecisionStore, _CertificationDecision_, _CertificationActionStatus_, _SelectionModel_, _CertificationItem_, certificationTestData, _CertificationTableScope_) {
                    CertificationDecision = _CertificationDecision_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    SelectionModel = _SelectionModel_;
                    CertificationItem = _CertificationItem_;
                    CertificationTableScope = _CertificationTableScope_;

                    store = new CertificationDecisionStore();

                    item1 = new CertificationItem(certificationTestData.CERT_ITEMS[0]);
                    item1.tableScope = new CertificationTableScope();
                    item2 = new CertificationItem(certificationTestData.CERT_ITEMS[1]);
                    item2.tableScope = new CertificationTableScope();
                    item3 = new CertificationItem(certificationTestData.CERT_ITEMS[2]);
                    item3.tableScope = new CertificationTableScope();

                    tableScope = new CertificationTableScope({
                        statuses: ['Open']
                    });
                }));

                function testLineItemActionWithBulkSelectSome(isAdd) {
                    // Add a bulk decision with a couple of items.
                    var selectSome = new SelectionModel();
                    selectSome.add(item1);
                    selectSome.add(item2);
                    var bulkDecision = new CertificationDecision.createBulkDecision(selectSome, {}, getStatus('Approved'), selectSome.size());
                    store.addBulkDecision(bulkDecision);

                    // Add/clear a line-item decision and check that it gets removed from the bulk decision.
                    if (isAdd) {
                        store.addDecision(CertificationDecision.createItemDecision(item1, getStatus('Revoked')));
                    } else {
                        store.clearDecision(item1);
                    }
                    expect(selectSome.size()).toEqual(1);
                    expect(selectSome.getItems()).not.toContain(item1);
                    expect(selectSome.getItems()).toContain(item2);
                }

                function testLineItemActionWithBulkSelectAll(isAdd) {
                    // Add a select all bulk decision.
                    var selectAll = new SelectionModel();
                    selectAll.isInclude = false;
                    var bulkDecision = new CertificationDecision.createBulkDecision(selectAll, {}, getStatus('Approved'), 1);
                    store.addBulkDecision(bulkDecision);

                    // Add/clear a line-item decision and check that it gets excluded from the bulk decision.
                    if (isAdd) {
                        store.addDecision(CertificationDecision.createItemDecision(item1, getStatus('Revoked')));
                    } else {
                        store.clearDecision(item1);
                    }
                    expect(selectAll.size()).toEqual(1);
                    expect(selectAll.getItems()).toContain(item1);
                }

                function setupSelectionModelForBulk(selectAllModel, itemSelected) {
                    selectAllModel.isInclude = false;
                    var bulkDecision = new CertificationDecision.createBulkDecision(selectAllModel, tableScope, getStatus('Approved'), 5);
                    store.addBulkDecision(bulkDecision);
                    expect(store.getDecisionCount()).toEqual(5);
                    spyOn(selectAllModel, 'isItemSelected').and.returnValue(itemSelected);
                }

                describe('addDecision()', function () {
                    it('adds a new decision', function () {
                        var status = 'Approved',
                            item = {
                            id: '45454'
                        },
                            comments = 'i have something to say',
                            decision = undefined;
                        store.addDecision(CertificationDecision.createItemDecision(item, getStatus(status), comments));
                        decision = store.getDecision(item.id);
                        expect(decision).toBeDefined();
                        expect(decision.status).toEqual(status);
                        expect(decision.comments).toEqual(comments);
                    });

                    it('replaces existing decision', function () {
                        var status = 'Approved',
                            newStatus = 'Remediated',
                            item = {
                            id: '45454'
                        },
                            decision = undefined;
                        store.addDecision(CertificationDecision.createItemDecision(item, getStatus(status)));
                        store.addDecision(CertificationDecision.createItemDecision(item, getStatus(newStatus)));
                        decision = store.getDecision(item.id);
                        expect(decision).toBeDefined();
                        expect(decision.status).toEqual(newStatus);
                    });

                    it('removes the item from a non-select all decision', function () {
                        testLineItemActionWithBulkSelectSome(true);
                    });

                    it('excludes the item from a select all decision', function () {
                        testLineItemActionWithBulkSelectAll(true);
                    });

                    it('throws with no decision', function () {
                        expect(function () {
                            return store.addDecision(undefined);
                        }).toThrow();
                    });

                    it('pukes with a bulk decision', function () {
                        var decision = CertificationDecision.createBulkDecision(new SelectionModel(), {}, getStatus('Approved'));
                        expect(function () {
                            return store.addDecision(decision);
                        }).toThrow();
                    });

                    it('adds the item to exclusion list for same table scope', function () {
                        var selectAllModel = new SelectionModel(),
                            newItem = new CertificationItem(item1);
                        newItem.tableScope = tableScope;
                        setupSelectionModelForBulk(selectAllModel, true);
                        store.addDecision(CertificationDecision.createItemDecision(newItem, getStatus('Revoked')));
                        expect(selectAllModel.size()).toEqual(1);
                        expect(store.getDecisionCount()).toEqual(5);
                        expect(selectAllModel.getItems()).toContain(newItem);
                    });

                    it('does not add the item to exclusion list for different table scope', function () {
                        var selectAllModel = new SelectionModel();
                        setupSelectionModelForBulk(selectAllModel, false);
                        // No tableScope on the item
                        store.addDecision(CertificationDecision.createItemDecision(item1, getStatus('Revoked')));
                        expect(selectAllModel.size()).toEqual(0);
                        expect(store.getDecisionCount()).toEqual(6);
                        expect(selectAllModel.getItems()).not.toContain(item1);
                    });

                    it('removes line item decisions from that match account if account decision', function () {
                        var itemWithSameAccountAs1 = new CertificationItem(angular.copy(item1));
                        itemWithSameAccountAs1.id = '9876';

                        var decision1 = CertificationDecision.createItemDecision(item1, getStatus('Approved')),
                            decision2 = CertificationDecision.createItemDecision(itemWithSameAccountAs1, getStatus('RevokeAccount'));

                        store.addDecision(decision1);
                        store.addDecision(decision2);

                        var decisions = store.getDecisions();
                        expect(decisions).toContain(decision2);
                        expect(decisions).not.toContain(decision1);
                    });

                    it('removes matching account items from bulk decisions if account decision', function () {
                        var itemWithSameAccountAs1 = new CertificationItem(angular.copy(item1));
                        itemWithSameAccountAs1.id = '9876';

                        var selectionModel = new SelectionModel(),
                            decision1 = CertificationDecision.createBulkDecision(selectionModel, {}, getStatus('Approved')),
                            decision2 = CertificationDecision.createItemDecision(itemWithSameAccountAs1, getStatus('RevokeAccount'));

                        selectionModel.add(item1);
                        selectionModel.add(item2);

                        store.addBulkDecision(decision1);
                        store.addDecision(decision2);

                        var decisions = store.getDecisions();
                        expect(decisions).toContain(decision2);
                        expect(decisions).toContain(decision1);
                        var items = decision1.selectionModel.getItems();
                        expect(items).not.toContain(item1);
                        expect(items).toContain(item2);
                    });
                });

                describe('clearDecision()', function () {
                    it('removes the decision', function () {
                        var item = {
                            id: 'fgdagdfsg'
                        };
                        store.addDecision(CertificationDecision.createItemDecision(item, getStatus('Approved')));
                        store.clearDecision(item);
                        expect(store.getDecision(item.id)).not.toBeDefined();
                    });

                    it('does not remove decision if none exists', function () {
                        var item1 = {
                            id: 'fgdagdfsg'
                        },
                            item2 = {
                            id: 'asdfgdsfsd'
                        };
                        store.addDecision(CertificationDecision.createItemDecision(item1, getStatus('Approved')));
                        store.clearDecision(item2);
                        expect(store.getDecision(item1.id)).toBeDefined();
                    });

                    it('removes the item from a non-select all decision', function () {
                        testLineItemActionWithBulkSelectSome(false);
                    });

                    it('excludes the item from a select all decision', function () {
                        testLineItemActionWithBulkSelectAll(false);
                    });

                    it('throws with no certificationItemId', function () {
                        expect(function () {
                            return store.clearDecision(undefined);
                        }).toThrow();
                    });

                    it('adds the item to exclusion list for same table scope', function () {
                        var selectAllModel = new SelectionModel(),
                            newItem = new CertificationItem(item1);
                        newItem.tableScope = tableScope;
                        setupSelectionModelForBulk(selectAllModel, true);
                        store.clearDecision(newItem);
                        expect(selectAllModel.size()).toEqual(1);
                        expect(store.getDecisionCount()).toEqual(4);
                        expect(selectAllModel.getItems()).toContain(newItem);
                    });

                    it('doesnot add the item to exclusion list for different selectionModelScope', function () {
                        var selectAllModel = new SelectionModel();
                        setupSelectionModelForBulk(selectAllModel, false);
                        store.clearDecision(item1);
                        expect(store.getDecisionCount()).toEqual(5);
                        expect(selectAllModel.getItems()).not.toContain(item1);
                    });

                    it('removes account level line item for same account', function () {
                        var item1 = new CertificationItem({
                            id: '1111',
                            application: 'app1',
                            nativeIdentity: 'account1'
                        }),
                            item2 = new CertificationItem({
                            id: '2222',
                            application: 'app1',
                            nativeIdentity: 'account1'
                        }),
                            item3 = new CertificationItem({
                            id: '3333',
                            application: 'app1',
                            nativeIdentity: 'account2'
                        });
                        store.addDecision(CertificationDecision.createItemDecision(item1, getStatus('RevokeAccount')));
                        store.addDecision(CertificationDecision.createItemDecision(item2, getStatus('RevokeAccount')));
                        store.addDecision(CertificationDecision.createItemDecision(item3, getStatus('RevokeAccount')));
                        store.clearDecision(item2);
                        var decisions = store.getDecisions();
                        expect(decisions.length).toEqual(1);
                        expect(decisions[0].certificationItem).toEqual(item3);
                    });

                    it('excludes all items from bulk account level decision that match account', function () {
                        var item1 = new CertificationItem({
                            id: '1111',
                            application: 'app1',
                            nativeIdentity: 'account1'
                        }),
                            item2 = new CertificationItem({
                            id: '2222',
                            application: 'app1',
                            nativeIdentity: 'account1'
                        }),
                            item3 = new CertificationItem({
                            id: '3333',
                            application: 'app1',
                            nativeIdentity: 'account2'
                        }),
                            selectionModel = new SelectionModel();
                        selectionModel.add(item1);
                        selectionModel.add(item2);
                        selectionModel.add(item3);

                        store.addBulkDecision(CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('RevokeAccount')));
                        store.clearDecision(item2);
                        var decisions = store.getDecisions();
                        expect(decisions.length).toEqual(1);
                        expect(decisions[0].selectionModel.size()).toEqual(1);
                        expect(decisions[0].selectionModel.getItems()[0]).toEqual(item3);
                    });
                });

                describe('getDecision()', function () {
                    it('returns the CertificationDecision if it exists', function () {
                        var status = 'Remediated',
                            item = { id: 'xyzzy' },
                            decision = undefined;
                        store.addDecision(CertificationDecision.createItemDecision(item, getStatus(status)));
                        decision = store.getDecision(item.id);
                        expect(decision).toBeDefined();
                        expect(decision.certificationItem).toEqual(item);
                        expect(decision.status).toEqual(status);
                    });

                    it('returns undefined if no decision exists', function () {
                        expect(store.getDecision('hghghg')).not.toBeDefined();
                    });

                    it('throws with no certificationItemId', function () {
                        expect(function () {
                            return store.getDecision(undefined);
                        }).toThrow();
                    });
                });

                describe('addBulkDecision()', function () {
                    var selectAll = undefined,
                        selectSome = undefined;

                    beforeEach(inject(function () {
                        selectAll = new SelectionModel();
                        selectAll.isInclude = false;

                        selectSome = new SelectionModel();
                    }));

                    it('throws if no decision is given', function () {
                        expect(function () {
                            return store.addBulkDecision(null);
                        }).toThrow();
                    });

                    it('barfs if the decision is not bulk', function () {
                        var itemDecision = CertificationDecision.createItemDecision(item1, getStatus('Approved'));
                        expect(function () {
                            return store.addBulkDecision(itemDecision);
                        }).toThrow();
                    });

                    it('adds a decision', function () {
                        var bulkDecision = CertificationDecision.createBulkDecision(selectAll, {}, getStatus('Approved'), 1);
                        store.addBulkDecision(bulkDecision);
                        expect(store.getDecisions()).toContain(bulkDecision);
                        expect(store.getDecisionCount()).toEqual(1);
                    });

                    it('removes all existing bulk decisions if new decision is select all', function () {
                        var bulk1 = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('bulk1'), 1);
                        var bulk2 = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('bulk2'), selectSome.size());

                        bulk2.selectionModel.add(item2);

                        // Add some bulk decisions.
                        store.addBulkDecision(bulk1);
                        store.addBulkDecision(bulk2);

                        // Add a select all decision and make sure that the other decisions were removed.
                        var bulkDecision = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 1);
                        store.addBulkDecision(bulkDecision);

                        expect(store.getDecisions()).not.toContain(bulk1);
                        expect(store.getDecisions()).not.toContain(bulk2);
                        expect(store.getDecisions()).toContain(bulkDecision);
                        expect(store.getDecisionCount()).toEqual(1);
                    });

                    it('removes all existing bulk decisions for same table scope if new decision is select all', function () {
                        var bulk1 = CertificationDecision.createBulkDecision(selectAll, tableScope, getStatus('bulk1'), 5);

                        selectSome.add(item2);

                        var bulk2 = CertificationDecision.createBulkDecision(selectSome, {}, getStatus('bulk2'), selectSome.size());

                        // Add some bulk decisions.
                        store.addBulkDecision(bulk1);
                        store.addBulkDecision(bulk2);

                        // Add a select all decision and make sure that the other decisions were removed.
                        var bulkDecision = CertificationDecision.createBulkDecision(selectAll, tableScope, getStatus('Approved'), 6);
                        store.addBulkDecision(bulkDecision);

                        expect(store.getDecisions()).not.toContain(bulk1);
                        expect(store.getDecisions()).toContain(bulk2);
                        expect(store.getDecisions()).toContain(bulkDecision);
                        expect(store.getDecisionCount()).toEqual(6 + selectSome.size());
                    });

                    it('changes existing bulk select all decision to include exclusion from new select all', function () {
                        var bulk1 = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 4),
                            newDecision = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 2);

                        store.addBulkDecision(bulk1);
                        // Exclude 2 items
                        newDecision.selectionModel.add(item1);
                        newDecision.selectionModel.add(item2);

                        store.addBulkDecision(newDecision);

                        expect(store.getDecisions().length).toEqual(2);
                        expect(bulk1.selectionModel.isSelectAll()).toEqual(false);
                        expect(bulk1.bulkCount).toEqual(2);
                        expect(bulk1.selectionModel.getItems()).toContain(item1);
                        expect(bulk1.selectionModel.getItems()).toContain(item2);
                    });

                    it('adds exclusions to existing bulk select all decisions if new decision is not select all', function () {
                        // Add a select all bulk action with a single exclusion.
                        selectAll.add(item1);
                        var selectAllDecision = CertificationDecision.createBulkDecision(selectAll, {}, getStatus('bulk1'), 2);
                        store.addBulkDecision(selectAllDecision);

                        // Add a select some decision with an item selected.
                        selectSome.add(item2);
                        var selectSomeDecision = CertificationDecision.createBulkDecision(selectSome, {}, getStatus('bulk2'), selectSome.size());
                        store.addBulkDecision(selectSomeDecision);

                        // Make sure that there are two bulk decisions and that the selectAll has the selectSome item excluded.
                        expect(store.getDecisionCount()).toEqual(2);
                        expect(selectAllDecision.selectionModel.getItems().length).toEqual(2);
                        expect(selectAllDecision.selectionModel.getItems()).toContain(item1);
                        expect(selectAllDecision.selectionModel.getItems()).toContain(item2);
                    });

                    it('removes items from existing bulk non-select all decisions if new decision is not select all', function () {
                        // Add a bulk decision with a couple of items selected.
                        var selectSomeInitial = new SelectionModel();
                        selectSomeInitial.add(item1);
                        selectSomeInitial.add(item2);
                        var selectSomeInitialDecision = CertificationDecision.createBulkDecision(selectSomeInitial, {}, getStatus('1'), selectSomeInitial.size());
                        store.addBulkDecision(selectSomeInitialDecision);

                        // Add another select some decision that will override one of the items.
                        selectSome.add(item2);
                        var selectSomeNewDecision = CertificationDecision.createBulkDecision(selectSome, {}, getStatus('2'), selectSome.size());
                        store.addBulkDecision(selectSomeNewDecision);

                        // Check that the first decision has one item removed.
                        expect(store.getDecisionCount()).toEqual(2);
                        expect(selectSomeInitialDecision.selectionModel.getItems().length).toEqual(1);
                        expect(selectSomeInitialDecision.selectionModel.getItems()).toContain(item1);
                        expect(selectSomeNewDecision.selectionModel.getItems().length).toEqual(1);
                        expect(selectSomeNewDecision.selectionModel.getItems()).toContain(item2);
                    });

                    it('completely removes existing bulk non-select all decision if new decision includes the same items', function () {
                        // Add a bulk decision with a couple of items selected.
                        var selectSomeInitial = new SelectionModel();
                        selectSomeInitial.add(item1);
                        selectSomeInitial.add(item2);
                        var selectSomeInitialDecision = CertificationDecision.createBulkDecision(selectSomeInitial, {}, getStatus('1'), selectSomeInitial.size());
                        store.addBulkDecision(selectSomeInitialDecision);

                        // Add another select some decision that will override all the items.
                        selectSome.add(item1);
                        selectSome.add(item2);
                        var selectSomeNewDecision = CertificationDecision.createBulkDecision(selectSome, {}, getStatus('2'), selectSome.size());
                        store.addBulkDecision(selectSomeNewDecision);

                        // Check that only the second decision exists.
                        expect(store.getDecisionCount()).toEqual(2);
                        expect(store.getDecisions()).not.toContain(selectSomeInitialDecision);
                        expect(store.getDecisions()).toContain(selectSomeNewDecision);
                    });

                    it('clears all line item decisions for same scope if new decision is select all', function () {
                        // Add a couple item decisions.
                        var itemDecision1 = CertificationDecision.createItemDecision(item1, getStatus('Approved'));
                        // Set a different scope on an item
                        var newItem = new CertificationItem(item2);
                        newItem.tableScope = tableScope;
                        var itemDecision2 = CertificationDecision.createItemDecision(newItem, getStatus('Approved'));
                        store.addDecision(itemDecision1);
                        store.addDecision(itemDecision2);

                        // Add a bulk select all.
                        var selectAllDecision = CertificationDecision.createBulkDecision(selectAll, {}, getStatus('bulk1'), 5);
                        spyOn(selectAll, 'isItemSelected').and.returnValue(true);

                        store.addBulkDecision(selectAllDecision);

                        // Check that the line item decisions are cleared.
                        expect(store.getDecisionCount()).toEqual(6);
                        expect(store.getDecisions()).not.toContain(itemDecision1);
                        expect(store.getDecisions()).toContain(itemDecision2);
                        expect(store.getDecisions()).toContain(selectAllDecision);
                    });

                    it('removes matching existing line item decisions if new decision is non-select all', function () {
                        // Add a couple item decisions.
                        var itemDecision1 = CertificationDecision.createItemDecision(item1, getStatus('Approved'));
                        var itemDecision2 = CertificationDecision.createItemDecision(item2, getStatus('Approved'));
                        store.addDecision(itemDecision1);
                        store.addDecision(itemDecision2);

                        // Add a bulk select some with one of the items.
                        selectSome.add(item1);
                        var selectSomeDecision = CertificationDecision.createBulkDecision(selectSome, {}, getStatus('bulk1'), selectSome.size());
                        store.addBulkDecision(selectSomeDecision);

                        // Check that item1's decision is no longer stored since it was overridden by the bulk decision.
                        expect(store.getDecisionCount()).toEqual(2);
                        expect(store.getDecisions()).not.toContain(itemDecision1);
                        expect(store.getDecisions()).toContain(itemDecision2);
                        expect(store.getDecisions()).toContain(selectSomeDecision);
                    });

                    it('removes line item decisions from that match account if bulk account decision', function () {
                        var itemWithSameAccountAs1 = new CertificationItem(angular.copy(item1));
                        itemWithSameAccountAs1.id = '9876';

                        var selectionModel = new SelectionModel(),
                            decision1 = CertificationDecision.createItemDecision(itemWithSameAccountAs1, getStatus('Approved')),
                            decision2 = CertificationDecision.createBulkDecision(selectionModel, {}, getStatus('RevokeAccount'));

                        selectionModel.add(item1);
                        selectionModel.add(item2);

                        store.addDecision(decision1);
                        store.addBulkDecision(decision2);

                        var decisions = store.getDecisions();
                        expect(decisions).toContain(decision2);
                        expect(decisions).not.toContain(decision1);
                    });

                    it('removes matching account items from bulk decisions if bulk account decision', function () {
                        var itemWithSameAccountAs1 = new CertificationItem(angular.copy(item1));
                        itemWithSameAccountAs1.id = '9876';

                        var selectionModel1 = new SelectionModel(),
                            decision1 = CertificationDecision.createBulkDecision(selectionModel1, {}, getStatus('Approved')),
                            selectionModel2 = new SelectionModel(),
                            decision2 = CertificationDecision.createBulkDecision(selectionModel2, {}, getStatus('RevokeAccount'));

                        selectionModel1.add(item1);
                        selectionModel1.add(item2);
                        selectionModel2.add(itemWithSameAccountAs1);

                        store.addBulkDecision(decision1);
                        store.addBulkDecision(decision2);

                        var decisions = store.getDecisions();
                        expect(decisions).toContain(decision2);
                        expect(decisions).toContain(decision1);

                        var items = decision1.selectionModel.getItems();
                        expect(items).toContain(item2);
                        expect(items).not.toContain(item1);
                    });

                    describe('with groups', function () {
                        var exceptionGroup = undefined,
                            bundleGroup = undefined;

                        beforeEach(inject(function (ResultGroup) {
                            exceptionGroup = new ResultGroup({
                                properties: {
                                    type: 'Exception'
                                },
                                count: 5
                            });

                            bundleGroup = new ResultGroup({
                                properties: {
                                    type: 'Bundle'
                                },
                                count: 2
                            });
                        }));

                        it('removes line item decisions for items that fall into a group decision', function () {
                            var itemDecision1 = CertificationDecision.createItemDecision(item1, getStatus('Approved')),
                                itemDecision2 = CertificationDecision.createItemDecision(item2, getStatus('Approved')),
                                newBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('bulk1'), selectSome.size());

                            newBulk.selectionModel.addGroup(exceptionGroup);

                            store.addDecision(itemDecision1);
                            store.addDecision(itemDecision2);
                            store.addBulkDecision(newBulk);

                            expect(store.getDecisions().length).toEqual(2);
                            expect(store.getDecisions()).not.toContain(itemDecision1);
                            expect(store.getDecisions()).toContain(itemDecision2);
                            expect(store.getDecisions()).toContain(newBulk);
                        });

                        it('includes group exclusions from new bulk select all in existing bulk select all', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Revoked'), 3);

                            newBulk.selectionModel.addGroup(exceptionGroup);
                            newBulk.selectionModel.remove(item1);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.isSelectAll()).toEqual(false);
                            expect(existingBulk.selectionModel.hasGroup(exceptionGroup)).toEqual(true);
                            expect(existingBulk.selectionModel.getGroup(exceptionGroup).selectionModel.hasItem(item1)).toEqual(true);
                        });

                        it('does not include group exclusions from new bulk select all if existing select all excluded them', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Revoked'), 3);

                            newBulk.selectionModel.addGroup(exceptionGroup);
                            newBulk.selectionModel.remove(item1);

                            existingBulk.selectionModel.addGroup(exceptionGroup);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.isSelectAll()).toEqual(false);
                            expect(existingBulk.selectionModel.hasGroup(exceptionGroup)).toEqual(false);
                            expect(existingBulk.selectionModel.hasItem(item1)).toEqual(false);
                        });

                        it('does not remove group exclusions from new bulk select all in existing non-select all decision', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Revoked'), 3);

                            existingBulk.selectionModel.add(item1);
                            newBulk.selectionModel.addGroup(exceptionGroup);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.hasItem(item1)).toEqual(true);
                        });

                        it('removes groups from existing non-select all decision if not excluded from new select all', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Revoked'), 3);

                            existingBulk.selectionModel.addGroup(exceptionGroup);
                            existingBulk.selectionModel.addGroup(bundleGroup);

                            newBulk.selectionModel.addGroup(bundleGroup);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.hasGroup(exceptionGroup)).toEqual(false);
                            expect(existingBulk.selectionModel.hasGroup(bundleGroup)).toEqual(true);
                        });

                        it('excludes group inclusions from existing bulk select all decision', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Revoked'), 3);

                            newBulk.selectionModel.addGroup(bundleGroup);
                            newBulk.selectionModel.remove(item2);
                            // Add an exclusion to the existing bulk select all to test that count remains accurate
                            existingBulk.selectionModel.add(item3);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.hasGroup(bundleGroup)).toEqual(true);
                            expect(existingBulk.selectionModel.getGroup(bundleGroup).selectionModel.hasItem(item2)).toEqual(true);
                            expect(existingBulk.bulkCount).toEqual(4);
                        });

                        it('ignores inclusion from group exclusion in new decision if already excluded from existing select all', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectAll.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Revoked'), 3);

                            newBulk.selectionModel.addGroup(bundleGroup);
                            newBulk.selectionModel.remove(item2);

                            existingBulk.selectionModel.add(item2);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.hasGroup(bundleGroup)).toEqual(true);
                            expect(existingBulk.selectionModel.getGroup(bundleGroup).selectionModel.hasItem(item2)).toEqual(false);
                        });

                        it('removes group inclusions from existing bulk non-select all decision', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Revoked'), 3);

                            newBulk.selectionModel.addGroup(bundleGroup);
                            newBulk.selectionModel.remove(item2);

                            existingBulk.selectionModel.addGroup(bundleGroup);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.hasGroup(bundleGroup)).toEqual(false);
                            expect(existingBulk.selectionModel.hasItem(item2)).toEqual(true);
                        });

                        it('removes items from existing non-select all decision that are in a group of new decision', function () {
                            var existingBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Approved'), 4),
                                newBulk = CertificationDecision.createBulkDecision(selectSome.clone(), {}, getStatus('Revoked'), 3);

                            newBulk.selectionModel.addGroup(bundleGroup);

                            existingBulk.selectionModel.add(item2);
                            existingBulk.selectionModel.add(item1);

                            store.addBulkDecision(existingBulk);
                            store.addBulkDecision(newBulk);

                            expect(existingBulk.selectionModel.hasItem(item1)).toEqual(true);
                            expect(existingBulk.selectionModel.hasItem(item2)).toEqual(false);
                        });
                    });
                });

                describe('hasBulkDecisions()', function () {
                    it('returns true if there are bulk decisions', function () {
                        var bulkDecision = CertificationDecision.createBulkDecision(new SelectionModel(), {}, getStatus('Approved'), 1);
                        store.addBulkDecision(bulkDecision);
                        expect(store.hasBulkDecisions()).toEqual(true);
                    });

                    it('returns false if there are no bulk decisions', function () {
                        var itemDecision1 = CertificationDecision.createItemDecision(item1, getStatus('Approved'));
                        store.addDecision(itemDecision1);
                        expect(store.hasBulkDecisions()).toEqual(false);
                    });
                });

                describe('getDecisions()', function () {
                    it('returns an empty array if no decisions have been made', function () {
                        var decisions = store.getDecisions();
                        expect(decisions.length).toEqual(0);
                    });

                    it('returns the decisions that were made', function () {
                        var item1 = { id: '11111' },
                            item2 = { id: '22222' };
                        store.addDecision(CertificationDecision.createItemDecision(item1, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision(item2, getStatus('Approved')));
                        var decisions = store.getDecisions();
                        expect(decisions.length).toEqual(2);
                        var found1 = false,
                            found2 = false;
                        decisions.forEach(function (decision) {
                            if (item1.id === decision.certificationItemId) {
                                found1 = true;
                            }
                            if (item2.id === decision.certificationItemId) {
                                found2 = true;
                            }
                        });

                        expect(found1).toEqual(true);
                        expect(found2).toEqual(true);
                    });

                    it('sorts the decisions by created date', function () {
                        var item1 = { id: '11111' },
                            item2 = { id: '2222' },
                            selectionModel = new SelectionModel(),
                            decision1 = CertificationDecision.createBulkDecision(selectionModel, null, getStatus('Approved')),
                            decision2 = CertificationDecision.createItemDecision(item1, getStatus('Approved'));
                        selectionModel.add(item2);
                        decision1.created.setHours(1);
                        decision2.created.setHours(2);
                        store.addDecision(decision2);
                        store.addBulkDecision(decision1);
                        var decisions = store.getDecisions();
                        expect(decisions.length).toEqual(2);
                        expect(decisions[0]).toEqual(decision1);
                        expect(decisions[1]).toEqual(decision2);
                    });
                });

                describe('getDecisionCount()', function () {
                    it('returns zero for no decisions', function () {
                        expect(store.getDecisionCount()).toEqual(0);
                    });

                    it('returns the count of decisions', function () {
                        store.addDecision(CertificationDecision.createItemDecision({ id: '11111' }, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '22222' }, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '33333' }, getStatus('Approved')));
                        expect(store.getDecisionCount()).toEqual(3);
                    });

                    it('returns the count of line item and bulk decisions', function () {
                        var selectionModel = new SelectionModel();
                        selectionModel.add(item1);
                        selectionModel.add(item2);
                        var bulkDecision = new CertificationDecision.createBulkDecision(selectionModel, {}, getStatus('Approved'), selectionModel.size());
                        store.addBulkDecision(bulkDecision);
                        store.addDecision(CertificationDecision.createItemDecision({ id: '11111' }, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '22222' }, getStatus('Approved')));
                        expect(store.getDecisionCount()).toEqual(4);
                    });
                });

                describe('getCountsByDecision()', function () {
                    it('returns an empty map for no decisions', function () {
                        expect(store.getCountsByDecision().size).toEqual(0);
                    });

                    it('returns line item decision counts', function () {
                        store.addDecision(CertificationDecision.createItemDecision({ id: '11111' }, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '22222' }, getStatus('Remediated')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '33333' }, getStatus('Approved')));

                        var map = store.getCountsByDecision();
                        expect(map.size).toEqual(2);
                        expect(map.get('Approved')).toEqual(2);
                        expect(map.get('Remediated')).toEqual(1);
                    });

                    it('returns bulk decision and item counts', function () {
                        var selectionModel = new SelectionModel();
                        selectionModel.add(item1);
                        selectionModel.add(item2);
                        var bulkDecision = new CertificationDecision.createBulkDecision(selectionModel, {}, getStatus('Approved'), selectionModel.size());
                        store.addBulkDecision(bulkDecision);

                        store.addDecision(CertificationDecision.createItemDecision({ id: '11111' }, getStatus('Remediated')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '22222' }, getStatus('Approved')));

                        var map = store.getCountsByDecision();
                        expect(map.size).toEqual(2);
                        expect(map.get('Approved')).toEqual(3);
                        expect(map.get('Remediated')).toEqual(1);
                    });
                });

                describe('clearDecisions()', function () {
                    it('removes all decisions', function () {
                        store.addDecision(CertificationDecision.createItemDecision({ id: '11111' }, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '22222' }, getStatus('Approved')));
                        store.addDecision(CertificationDecision.createItemDecision({ id: '33333' }, getStatus('Approved')));
                        store.clearDecisions();
                        expect(store.getDecisionCount()).toEqual(0);
                    });
                });

                describe('getEffectiveDecision()', function () {
                    var item = { id: '11111' };
                    it('returns item decision if one exists', function () {
                        var decision = CertificationDecision.createItemDecision(item, getStatus('Approved'));
                        store.addDecision(decision);
                        expect(store.getEffectiveDecision(item.id)).toEqual(decision);
                    });

                    it('returns bulk decision if no item decision and item is part of bulk selection', function () {
                        var selectionModel = new SelectionModel(),
                            tableScope = new CertificationTableScope({
                            statuses: ['Open']
                        }),
                            decision = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('Approved'), 1);
                        selectionModel.selectAll();
                        store.addBulkDecision(decision);
                        expect(store.getEffectiveDecision(item.id, tableScope)).toEqual(decision);
                    });

                    it('returns undefined if no item decision or applicable bulk decision', function () {
                        var selectionModel = new SelectionModel(),
                            tableScope = new CertificationTableScope({
                            statuses: ['Open']
                        }),
                            decision = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('Approved'), 1);
                        selectionModel.selectAll();
                        // Adding item marks it as negative selection
                        selectionModel.add(item);
                        store.addBulkDecision(decision);
                        expect(store.getEffectiveDecision(item.id, tableScope)).not.toBeDefined();
                    });

                    it('returns undefined if table scope does not match', function () {
                        var selectionModel = new SelectionModel(),
                            tableScope = new CertificationTableScope({
                            statuses: ['Open']
                        }),
                            decision = CertificationDecision.createBulkDecision(selectionModel, {}, getStatus('Approved'), 1);
                        selectionModel.selectAll();
                        store.addBulkDecision(decision);
                        expect(store.getEffectiveDecision(item.id, tableScope)).not.toBeDefined();
                    });

                    it('returns undefined if tableScope is undefined and decision is select all', function () {
                        var selectionModel = new SelectionModel(),
                            tableScope = new CertificationTableScope({
                            statuses: ['Open']
                        }),
                            decision = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('Approved'), 1);
                        selectionModel.selectAll();
                        store.addBulkDecision(decision);
                        expect(store.getEffectiveDecision(item.id, undefined)).not.toBeDefined();
                    });

                    it('returns bulk decision if tableScope is undefined and decision is not select all', function () {
                        var selectionModel = new SelectionModel(),
                            tableScope = new CertificationTableScope({
                            statuses: ['Open']
                        }),
                            decision = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('Approved'), 1);
                        selectionModel.add(item);
                        store.addBulkDecision(decision);
                        expect(store.getEffectiveDecision(item.id, undefined)).toEqual(decision);
                    });
                });

                describe('getEffectiveDecisionByItem', function () {
                    var item = undefined;
                    beforeEach(function () {
                        spyOn(store, 'getEffectiveDecision').and.returnValue(undefined);
                        item = new CertificationItem({
                            id: 'abcd',
                            application: 'App1',
                            nativeIdentity: 'account1'
                        });
                        tableScope = new CertificationTableScope({
                            statuses: ['Open']
                        });
                    });

                    it('find a line item account decision that matches the given item', function () {
                        var decisionItem = new CertificationItem({
                            id: 'gggg',
                            application: 'App1',
                            nativeIdentity: 'account1'
                        }),
                            decision = CertificationDecision.createItemDecision(decisionItem, getStatus('RevokeAccount'));
                        store.addDecision(decision);
                        expect(store.getEffectiveDecisionByItem(item)).toEqual(decision);
                    });

                    it('finds a bulk account decision that matches the given item', function () {
                        var decisionItem = new CertificationItem({
                            id: 'gggg',
                            application: 'App1',
                            nativeIdentity: 'account1'
                        }),
                            selectionModel = new SelectionModel(),
                            decision = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('RevokeAccount'), 1);
                        selectionModel.add(decisionItem);
                        store.addBulkDecision(decision);
                        expect(store.getEffectiveDecisionByItem(item)).toEqual(decision);
                    });

                    it('does not find a decision that matches account but is not an account level decision', function () {
                        var decisionItem = new CertificationItem({
                            id: 'gggg',
                            application: 'App1',
                            nativeIdentity: 'account1'
                        }),
                            decision = CertificationDecision.createItemDecision(decisionItem, getStatus('Approved'));
                        store.addDecision(decision);
                        expect(store.getEffectiveDecisionByItem(item)).not.toEqual(decision);
                    });

                    it('does not find a account level decision on different account', function () {
                        var decisionItem = new CertificationItem({
                            id: 'gggg',
                            application: 'App1',
                            nativeIdentity: 'account2'
                        }),
                            decision = CertificationDecision.createItemDecision(decisionItem, getStatus('RevokeAccount'));
                        store.addDecision(decision);
                        expect(store.getEffectiveDecisionByItem(item)).not.toEqual(decision);
                    });

                    it('calls through to getEffectiveDecision if no account level decision is available', function () {
                        store.getEffectiveDecisionByItem(item, tableScope);
                        expect(store.getEffectiveDecision).toHaveBeenCalledWith(item.id, tableScope, item);
                    });

                    it('does not return a select all account decision with excluded item that matches account', function () {
                        var selectionModel = new SelectionModel(),
                            bulkDecision = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus('RevokeAccount')),
                            excludedItem = new CertificationItem({
                            id: '1111',
                            application: 'App1',
                            nativeIdentity: 'account1'
                        }),
                            item = new CertificationItem({
                            id: '2222',
                            application: 'App1',
                            nativeIdentity: 'account1'
                        });

                        selectionModel.selectAll();
                        store.addBulkDecision(bulkDecision);
                        store.clearDecision(excludedItem);

                        expect(store.getEffectiveDecisionByItem(item, tableScope)).not.toBeDefined();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RvcmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0NBQXNDLFVBQVUsU0FBUztJQUNqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7O1FBRTVELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyw4QkFBOEIsWUFBTTs7Z0JBRXpDLElBQUksd0JBQXFCO29CQUFFLDRCQUF5QjtvQkFBRSxpQkFBYztvQkFBRSxvQkFBaUI7b0JBQUUsMEJBQXVCO29CQUM1RyxRQUFLO29CQUFFLFFBQUs7b0JBQUUsUUFBSztvQkFBRSxRQUFLO29CQUFFLGFBQVU7O2dCQUUxQyxTQUFTLFVBQVUsUUFBUTtvQkFDdkIsT0FBTyxJQUFJLDBCQUEwQjt3QkFDakMsUUFBUTs7OztnQkFJaEIsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTyxVQUFTLDRCQUE0Qix5QkFBeUIsNkJBQ3JELGtCQUFrQixxQkFBcUIsdUJBQ3ZDLDJCQUEyQjtvQkFDbEQsd0JBQXdCO29CQUN4Qiw0QkFBNEI7b0JBQzVCLGlCQUFpQjtvQkFDakIsb0JBQW9CO29CQUNwQiwwQkFBMEI7O29CQUUxQixRQUFRLElBQUk7O29CQUVaLFFBQVEsSUFBSSxrQkFBa0Isc0JBQXNCLFdBQVc7b0JBQy9ELE1BQU0sYUFBYSxJQUFJO29CQUN2QixRQUFRLElBQUksa0JBQWtCLHNCQUFzQixXQUFXO29CQUMvRCxNQUFNLGFBQWEsSUFBSTtvQkFDdkIsUUFBUSxJQUFJLGtCQUFrQixzQkFBc0IsV0FBVztvQkFDL0QsTUFBTSxhQUFhLElBQUk7O29CQUV2QixhQUFhLElBQUksd0JBQXdCO3dCQUNyQyxVQUFVLENBQUM7Ozs7Z0JBSW5CLFNBQVMscUNBQXFDLE9BQU87O29CQUVqRCxJ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QUFJLFFBQVE7OztvQkFHL0QsR0FBRywrREFBK0QsWUFBTTt3QkFDcEUsSUFBSSxlQUFlLElBQUksa0JBQWtCOzRCQUNyQyxJQUFJOzRCQUNKLGFBQWE7NEJBQ2IsZ0JBQWdCOzs0QkFDaEIsV0FBVyxzQkFBc0IsbUJBQW1CLGNBQWMsVUFBVTt3QkFDaEYsTUFBTSxZQUFZO3dCQUNsQixPQUFPLE1BQU0sMkJBQTJCLE9BQU8sSUFBSSxRQUFROzs7b0JBRy9ELEdBQUcsbUZBQW1GLFlBQU07d0JBQ3hGLE1BQU0sMkJBQTJCLE1BQU07d0JBQ3ZDLE9BQU8sTUFBTSxzQkFBc0IscUJBQXFCLEtBQUssSUFBSSxZQUFZOzs7b0JBR2pGLEdBQUcseUZBQXlGLFlBQU07d0JBQzlGLElBQUksaUJBQWlCLElBQUk7NEJBQ3JCLGVBQWUsc0JBQXNCLG1CQUFtQixnQkFBZ0IsWUFDcEUsVUFBVTs0QkFDZCxlQUFlLElBQUksa0JBQWtCOzRCQUNqQyxJQUFJOzRCQUNKLGFBQWE7NEJBQ2IsZ0JBQWdCOzs0QkFFcEIsT0FBTyxJQUFJLGtCQUFrQjs0QkFDekIsSUFBSTs0QkFDSixhQUFhOzRCQUNiLGdCQUFnQjs7O3dCQUd4QixlQUFlO3dCQUNmLE1BQU0sZ0JBQWdCO3dCQUN0QixNQUFNLGNBQWM7O3dCQUVwQixPQUFPLE1BQU0sMkJBQTJCLE1BQU0sYUFBYSxJQUFJOzs7Ozs7R0FWeEUiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9tb2RlbC9DZXJ0aWZpY2F0aW9uRGVjaXNpb25TdG9yZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XHJcblxyXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RvcmUnLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0IENlcnRpZmljYXRpb25EZWNpc2lvbiwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cywgU2VsZWN0aW9uTW9kZWwsIENlcnRpZmljYXRpb25JdGVtLCBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSxcclxuICAgICAgICBzdG9yZSwgaXRlbTEsIGl0ZW0yLCBpdGVtMywgdGFibGVTY29wZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRTdGF0dXMoc3RhdHVzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XHJcblxyXG4gICAgLyoganNoaW50IG1heHBhcmFtczogNyAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RvcmUsIF9DZXJ0aWZpY2F0aW9uRGVjaXNpb25fLCBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c18sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfU2VsZWN0aW9uTW9kZWxfLCBfQ2VydGlmaWNhdGlvbkl0ZW1fLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQ2VydGlmaWNhdGlvblRhYmxlU2NvcGVfKSB7XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyA9IF9DZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzXztcclxuICAgICAgICBTZWxlY3Rpb25Nb2RlbCA9IF9TZWxlY3Rpb25Nb2RlbF87XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0gPSBfQ2VydGlmaWNhdGlvbkl0ZW1fO1xyXG4gICAgICAgIENlcnRpZmljYXRpb25UYWJsZVNjb3BlID0gX0NlcnRpZmljYXRpb25UYWJsZVNjb3BlXztcclxuXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RvcmUoKTtcclxuXHJcbiAgICAgICAgaXRlbTEgPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF0pO1xyXG4gICAgICAgIGl0ZW0xLnRhYmxlU2NvcGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlU2NvcGUoKTtcclxuICAgICAgICBpdGVtMiA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1sxXSk7XHJcbiAgICAgICAgaXRlbTIudGFibGVTY29wZSA9IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSgpO1xyXG4gICAgICAgIGl0ZW0zID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUX0lURU1TWzJdKTtcclxuICAgICAgICBpdGVtMy50YWJsZVNjb3BlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZVNjb3BlKCk7XHJcblxyXG4gICAgICAgIHRhYmxlU2NvcGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlU2NvcGUoe1xyXG4gICAgICAgICAgICBzdGF0dXNlczogWydPcGVuJ11cclxuICAgICAgICB9KTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiB0ZXN0TGluZUl0ZW1BY3Rpb25XaXRoQnVsa1NlbGVjdFNvbWUoaXNBZGQpIHtcclxuICAgICAgICAvLyBBZGQgYSBidWxrIGRlY2lzaW9uIHdpdGggYSBjb3VwbGUgb2YgaXRlbXMuXHJcbiAgICAgICAgbGV0IHNlbGVjdFNvbWUgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcclxuICAgICAgICBzZWxlY3RTb21lLmFkZChpdGVtMSk7XHJcbiAgICAgICAgc2VsZWN0U29tZS5hZGQoaXRlbTIpO1xyXG4gICAgICAgIGxldCBidWxrRGVjaXNpb24gPSBuZXcgQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgc2VsZWN0U29tZSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgc2VsZWN0U29tZS5zaXplKCkpO1xyXG4gICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrRGVjaXNpb24pO1xyXG5cclxuICAgICAgICAvLyBBZGQvY2xlYXIgYSBsaW5lLWl0ZW0gZGVjaXNpb24gYW5kIGNoZWNrIHRoYXQgaXQgZ2V0cyByZW1vdmVkIGZyb20gdGhlIGJ1bGsgZGVjaXNpb24uXHJcbiAgICAgICAgaWYgKGlzQWRkKSB7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbTEsIGdldFN0YXR1cygnUmV2b2tlZCcpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdG9yZS5jbGVhckRlY2lzaW9uKGl0ZW0xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXhwZWN0KHNlbGVjdFNvbWUuc2l6ZSgpKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIGV4cGVjdChzZWxlY3RTb21lLmdldEl0ZW1zKCkpLm5vdC50b0NvbnRhaW4oaXRlbTEpO1xyXG4gICAgICAgIGV4cGVjdChzZWxlY3RTb21lLmdldEl0ZW1zKCkpLnRvQ29udGFpbihpdGVtMik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVzdExpbmVJdGVtQWN0aW9uV2l0aEJ1bGtTZWxlY3RBbGwoaXNBZGQpIHtcclxuICAgICAgICAvLyBBZGQgYSBzZWxlY3QgYWxsIGJ1bGsgZGVjaXNpb24uXHJcbiAgICAgICAgbGV0IHNlbGVjdEFsbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xyXG4gICAgICAgIHNlbGVjdEFsbC5pc0luY2x1ZGUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgYnVsa0RlY2lzaW9uID0gbmV3IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0QWxsLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCAxKTtcclxuICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oYnVsa0RlY2lzaW9uKTtcclxuXHJcbiAgICAgICAgLy8gQWRkL2NsZWFyIGEgbGluZS1pdGVtIGRlY2lzaW9uIGFuZCBjaGVjayB0aGF0IGl0IGdldHMgZXhjbHVkZWQgZnJvbSB0aGUgYnVsayBkZWNpc2lvbi5cclxuICAgICAgICBpZiAoaXNBZGQpIHtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtMSwgZ2V0U3RhdHVzKCdSZXZva2VkJykpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0b3JlLmNsZWFyRGVjaXNpb24oaXRlbTEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBleHBlY3Qoc2VsZWN0QWxsLnNpemUoKSkudG9FcXVhbCgxKTtcclxuICAgICAgICBleHBlY3Qoc2VsZWN0QWxsLmdldEl0ZW1zKCkpLnRvQ29udGFpbihpdGVtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXBTZWxlY3Rpb25Nb2RlbEZvckJ1bGsoc2VsZWN0QWxsTW9kZWwsIGl0ZW1TZWxlY3RlZCkge1xyXG4gICAgICAgIHNlbGVjdEFsbE1vZGVsLmlzSW5jbHVkZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBidWxrRGVjaXNpb24gPSBuZXcgQ2VydGlmaWNhdGlvbkRlY2lzaW9uXHJcbiAgICAgICAgICAgIC5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0QWxsTW9kZWwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgNSk7XHJcbiAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGJ1bGtEZWNpc2lvbik7XHJcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCg1KTtcclxuICAgICAgICBzcHlPbihzZWxlY3RBbGxNb2RlbCwgJ2lzSXRlbVNlbGVjdGVkJykuYW5kLnJldHVyblZhbHVlKGl0ZW1TZWxlY3RlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2FkZERlY2lzaW9uKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2FkZHMgYSBuZXcgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSAnQXBwcm92ZWQnLFxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJzQ1NDU0J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbW1lbnRzID0gJ2kgaGF2ZSBzb21ldGhpbmcgdG8gc2F5JyxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0sIGdldFN0YXR1cyhzdGF0dXMpLCBjb21tZW50cykpO1xyXG4gICAgICAgICAgICBkZWNpc2lvbiA9IHN0b3JlLmdldERlY2lzaW9uKGl0ZW0uaWQpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24pLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5zdGF0dXMpLnRvRXF1YWwoc3RhdHVzKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmNvbW1lbnRzKS50b0VxdWFsKGNvbW1lbnRzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlcGxhY2VzIGV4aXN0aW5nIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gJ0FwcHJvdmVkJyxcclxuICAgICAgICAgICAgICAgIG5ld1N0YXR1cyA9ICdSZW1lZGlhdGVkJyxcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICc0NTQ1NCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbjtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtLCBnZXRTdGF0dXMoc3RhdHVzKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0sIGdldFN0YXR1cyhuZXdTdGF0dXMpKSk7XHJcbiAgICAgICAgICAgIGRlY2lzaW9uID0gc3RvcmUuZ2V0RGVjaXNpb24oaXRlbS5pZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLnN0YXR1cykudG9FcXVhbChuZXdTdGF0dXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVtb3ZlcyB0aGUgaXRlbSBmcm9tIGEgbm9uLXNlbGVjdCBhbGwgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RMaW5lSXRlbUFjdGlvbldpdGhCdWxrU2VsZWN0U29tZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2V4Y2x1ZGVzIHRoZSBpdGVtIGZyb20gYSBzZWxlY3QgYWxsIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0TGluZUl0ZW1BY3Rpb25XaXRoQnVsa1NlbGVjdEFsbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gc3RvcmUuYWRkRGVjaXNpb24odW5kZWZpbmVkKSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncHVrZXMgd2l0aCBhIGJ1bGsgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24obmV3IFNlbGVjdGlvbk1vZGVsKCksIHt9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpO1xyXG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gc3RvcmUuYWRkRGVjaXNpb24oZGVjaXNpb24pKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdhZGRzIHRoZSBpdGVtIHRvIGV4Y2x1c2lvbiBsaXN0IGZvciBzYW1lIHRhYmxlIHNjb3BlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0QWxsTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKSxcclxuICAgICAgICAgICAgICAgIG5ld0l0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oaXRlbTEpO1xyXG4gICAgICAgICAgICBuZXdJdGVtLnRhYmxlU2NvcGUgPSB0YWJsZVNjb3BlO1xyXG4gICAgICAgICAgICBzZXR1cFNlbGVjdGlvbk1vZGVsRm9yQnVsayhzZWxlY3RBbGxNb2RlbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24obmV3SXRlbSwgZ2V0U3RhdHVzKCdSZXZva2VkJykpKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdEFsbE1vZGVsLnNpemUoKSkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCg1KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdEFsbE1vZGVsLmdldEl0ZW1zKCkpLnRvQ29udGFpbihuZXdJdGVtKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGFkZCB0aGUgaXRlbSB0byBleGNsdXNpb24gbGlzdCBmb3IgZGlmZmVyZW50IHRhYmxlIHNjb3BlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0QWxsTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcclxuICAgICAgICAgICAgc2V0dXBTZWxlY3Rpb25Nb2RlbEZvckJ1bGsoc2VsZWN0QWxsTW9kZWwsIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gTm8gdGFibGVTY29wZSBvbiB0aGUgaXRlbVxyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgaXRlbTEsIGdldFN0YXR1cygnUmV2b2tlZCcpKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RBbGxNb2RlbC5zaXplKCkpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoNik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RBbGxNb2RlbC5nZXRJdGVtcygpKS5ub3QudG9Db250YWluKGl0ZW0xKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlbW92ZXMgbGluZSBpdGVtIGRlY2lzaW9ucyBmcm9tIHRoYXQgbWF0Y2ggYWNjb3VudCBpZiBhY2NvdW50IGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbVdpdGhTYW1lQWNjb3VudEFzMSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShhbmd1bGFyLmNvcHkoaXRlbTEpKTtcclxuICAgICAgICAgICAgaXRlbVdpdGhTYW1lQWNjb3VudEFzMS5pZCA9ICc5ODc2JztcclxuXHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbjEgPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0xLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpLFxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb24yID1cclxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW1XaXRoU2FtZUFjY291bnRBczEsIGdldFN0YXR1cygnUmV2b2tlQWNjb3VudCcpKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKGRlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKGRlY2lzaW9uMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gc3RvcmUuZ2V0RGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbnMpLnRvQ29udGFpbihkZWNpc2lvbjIpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zKS5ub3QudG9Db250YWluKGRlY2lzaW9uMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIG1hdGNoaW5nIGFjY291bnQgaXRlbXMgZnJvbSBidWxrIGRlY2lzaW9ucyBpZiBhY2NvdW50IGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbVdpdGhTYW1lQWNjb3VudEFzMSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShhbmd1bGFyLmNvcHkoaXRlbTEpKTtcclxuICAgICAgICAgICAgaXRlbVdpdGhTYW1lQWNjb3VudEFzMS5pZCA9ICc5ODc2JztcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb24xID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3Rpb25Nb2RlbCwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSksXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbjIgPVxyXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbVdpdGhTYW1lQWNjb3VudEFzMSwgZ2V0U3RhdHVzKCdSZXZva2VBY2NvdW50JykpO1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0yKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihkZWNpc2lvbjEpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihkZWNpc2lvbjIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9ucyA9IHN0b3JlLmdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zKS50b0NvbnRhaW4oZGVjaXNpb24yKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9ucykudG9Db250YWluKGRlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IGRlY2lzaW9uMS5zZWxlY3Rpb25Nb2RlbC5nZXRJdGVtcygpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMpLm5vdC50b0NvbnRhaW4oaXRlbTEpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMpLnRvQ29udGFpbihpdGVtMik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnY2xlYXJEZWNpc2lvbigpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZW1vdmVzIHRoZSBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ2ZnZGFnZGZzZydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpKTtcclxuICAgICAgICAgICAgc3RvcmUuY2xlYXJEZWNpc2lvbihpdGVtKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uKGl0ZW0uaWQpKS5ub3QudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHJlbW92ZSBkZWNpc2lvbiBpZiBub25lIGV4aXN0cycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0xID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnZmdkYWdkZnNnJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGl0ZW0yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYXNkZmdkc2ZzZCdcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbTEsIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5jbGVhckRlY2lzaW9uKGl0ZW0yKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uKGl0ZW0xLmlkKSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlbW92ZXMgdGhlIGl0ZW0gZnJvbSBhIG5vbi1zZWxlY3QgYWxsIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0TGluZUl0ZW1BY3Rpb25XaXRoQnVsa1NlbGVjdFNvbWUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZXhjbHVkZXMgdGhlIGl0ZW0gZnJvbSBhIHNlbGVjdCBhbGwgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RMaW5lSXRlbUFjdGlvbldpdGhCdWxrU2VsZWN0QWxsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIGNlcnRpZmljYXRpb25JdGVtSWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBzdG9yZS5jbGVhckRlY2lzaW9uKHVuZGVmaW5lZCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2FkZHMgdGhlIGl0ZW0gdG8gZXhjbHVzaW9uIGxpc3QgZm9yIHNhbWUgdGFibGUgc2NvcGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RBbGxNb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgbmV3SXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShpdGVtMSk7XHJcbiAgICAgICAgICAgIG5ld0l0ZW0udGFibGVTY29wZSA9IHRhYmxlU2NvcGU7XHJcbiAgICAgICAgICAgIHNldHVwU2VsZWN0aW9uTW9kZWxGb3JCdWxrKHNlbGVjdEFsbE1vZGVsLCB0cnVlKTtcclxuICAgICAgICAgICAgc3RvcmUuY2xlYXJEZWNpc2lvbihuZXdJdGVtKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdEFsbE1vZGVsLnNpemUoKSkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCg0KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdEFsbE1vZGVsLmdldEl0ZW1zKCkpLnRvQ29udGFpbihuZXdJdGVtKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXNub3QgYWRkIHRoZSBpdGVtIHRvIGV4Y2x1c2lvbiBsaXN0IGZvciBkaWZmZXJlbnQgc2VsZWN0aW9uTW9kZWxTY29wZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdEFsbE1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsKCk7XHJcbiAgICAgICAgICAgIHNldHVwU2VsZWN0aW9uTW9kZWxGb3JCdWxrKHNlbGVjdEFsbE1vZGVsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmNsZWFyRGVjaXNpb24oaXRlbTEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25Db3VudCgpKS50b0VxdWFsKDUpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2VsZWN0QWxsTW9kZWwuZ2V0SXRlbXMoKSkubm90LnRvQ29udGFpbihpdGVtMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIGFjY291bnQgbGV2ZWwgbGluZSBpdGVtIGZvciBzYW1lIGFjY291bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtMSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XHJcbiAgICAgICAgICAgICAgICBpZDogJzExMTEnLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdhcHAxJyxcclxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWNjb3VudDEnXHJcbiAgICAgICAgICAgIH0pLCBpdGVtMiA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XHJcbiAgICAgICAgICAgICAgICBpZDogJzIyMjInLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdhcHAxJyxcclxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWNjb3VudDEnXHJcbiAgICAgICAgICAgIH0pLCBpdGVtMyA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XHJcbiAgICAgICAgICAgICAgICBpZDogJzMzMzMnLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdhcHAxJyxcclxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWNjb3VudDInXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0xLCBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0yLCBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0zLCBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5jbGVhckRlY2lzaW9uKGl0ZW0yKTtcclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9ucyA9IHN0b3JlLmdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uc1swXS5jZXJ0aWZpY2F0aW9uSXRlbSkudG9FcXVhbChpdGVtMyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdleGNsdWRlcyBhbGwgaXRlbXMgZnJvbSBidWxrIGFjY291bnQgbGV2ZWwgZGVjaXNpb24gdGhhdCBtYXRjaCBhY2NvdW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTEgPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICcxMTExJyxcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYXBwMScsXHJcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2FjY291bnQxJ1xyXG4gICAgICAgICAgICB9KSwgaXRlbTIgPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICcyMjIyJyxcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYXBwMScsXHJcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2FjY291bnQxJ1xyXG4gICAgICAgICAgICB9KSwgaXRlbTMgPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICczMzMzJyxcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYXBwMScsXHJcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2FjY291bnQyJ1xyXG4gICAgICAgICAgICB9KSwgc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0yKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0zKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cygnUmV2b2tlQWNjb3VudCcpKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmNsZWFyRGVjaXNpb24oaXRlbTIpO1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gc3RvcmUuZ2V0RGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zWzBdLnNlbGVjdGlvbk1vZGVsLnNpemUoKSkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uc1swXS5zZWxlY3Rpb25Nb2RlbC5nZXRJdGVtcygpWzBdKS50b0VxdWFsKGl0ZW0zKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdnZXREZWNpc2lvbigpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24gaWYgaXQgZXhpc3RzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gJ1JlbWVkaWF0ZWQnLFxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHsgaWQ6ICd4eXp6eScgfSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0sIGdldFN0YXR1cyhzdGF0dXMpKSk7XHJcbiAgICAgICAgICAgIGRlY2lzaW9uID0gc3RvcmUuZ2V0RGVjaXNpb24oaXRlbS5pZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmNlcnRpZmljYXRpb25JdGVtKS50b0VxdWFsKGl0ZW0pO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uc3RhdHVzKS50b0VxdWFsKHN0YXR1cyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBkZWNpc2lvbiBleGlzdHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbignaGdoZ2hnJykpLm5vdC50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGggbm8gY2VydGlmaWNhdGlvbkl0ZW1JZCcsICgpID0+IHtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IHN0b3JlLmdldERlY2lzaW9uKHVuZGVmaW5lZCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdhZGRCdWxrRGVjaXNpb24oKScsICgpID0+IHtcclxuICAgICAgICBsZXQgc2VsZWN0QWxsLCBzZWxlY3RTb21lO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNlbGVjdEFsbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xyXG4gICAgICAgICAgICBzZWxlY3RBbGwuaXNJbmNsdWRlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RTb21lID0gbmV3IFNlbGVjdGlvbk1vZGVsKCk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgndGhyb3dzIGlmIG5vIGRlY2lzaW9uIGlzIGdpdmVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gc3RvcmUuYWRkQnVsa0RlY2lzaW9uKG51bGwpKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdiYXJmcyBpZiB0aGUgZGVjaXNpb24gaXMgbm90IGJ1bGsnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtRGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0xLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpO1xyXG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGl0ZW1EZWNpc2lvbikpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2FkZHMgYSBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ1bGtEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0QWxsLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCAxKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGJ1bGtEZWNpc2lvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbnMoKSkudG9Db250YWluKGJ1bGtEZWNpc2lvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIGFsbCBleGlzdGluZyBidWxrIGRlY2lzaW9ucyBpZiBuZXcgZGVjaXNpb24gaXMgc2VsZWN0IGFsbCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ1bGsxID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RBbGwuY2xvbmUoKSwge30sIGdldFN0YXR1cygnYnVsazEnKSwgMSk7XHJcbiAgICAgICAgICAgIGxldCBidWxrMiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RTb21lLmNsb25lKCksIHt9LCBnZXRTdGF0dXMoJ2J1bGsyJyksIHNlbGVjdFNvbWUuc2l6ZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGJ1bGsyLnNlbGVjdGlvbk1vZGVsLmFkZChpdGVtMik7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgc29tZSBidWxrIGRlY2lzaW9ucy5cclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGJ1bGsxKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGJ1bGsyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBhIHNlbGVjdCBhbGwgZGVjaXNpb24gYW5kIG1ha2Ugc3VyZSB0aGF0IHRoZSBvdGhlciBkZWNpc2lvbnMgd2VyZSByZW1vdmVkLlxyXG4gICAgICAgICAgICBsZXQgYnVsa0RlY2lzaW9uID1cclxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0QWxsLmNsb25lKCksIHt9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIDEpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oYnVsa0RlY2lzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbnMoKSkubm90LnRvQ29udGFpbihidWxrMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbnMoKSkubm90LnRvQ29udGFpbihidWxrMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbnMoKSkudG9Db250YWluKGJ1bGtEZWNpc2lvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIGFsbCBleGlzdGluZyBidWxrIGRlY2lzaW9ucyBmb3Igc2FtZSB0YWJsZSBzY29wZSBpZiBuZXcgZGVjaXNpb24gaXMgc2VsZWN0IGFsbCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ1bGsxID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RBbGwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cygnYnVsazEnKSwgNSk7XHJcblxyXG4gICAgICAgICAgICBzZWxlY3RTb21lLmFkZChpdGVtMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnVsazIgPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0U29tZSwge30sIGdldFN0YXR1cygnYnVsazInKSwgc2VsZWN0U29tZS5zaXplKCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHNvbWUgYnVsayBkZWNpc2lvbnMuXHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrMSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrMik7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgYSBzZWxlY3QgYWxsIGRlY2lzaW9uIGFuZCBtYWtlIHN1cmUgdGhhdCB0aGUgb3RoZXIgZGVjaXNpb25zIHdlcmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgbGV0IGJ1bGtEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgNik7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrRGVjaXNpb24pO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS5ub3QudG9Db250YWluKGJ1bGsxKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS50b0NvbnRhaW4oYnVsazIpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25zKCkpLnRvQ29udGFpbihidWxrRGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25Db3VudCgpKS50b0VxdWFsKDYgKyBzZWxlY3RTb21lLnNpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjaGFuZ2VzIGV4aXN0aW5nIGJ1bGsgc2VsZWN0IGFsbCBkZWNpc2lvbiB0byBpbmNsdWRlIGV4Y2x1c2lvbiBmcm9tIG5ldyBzZWxlY3QgYWxsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYnVsazEgPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdEFsbC5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCA0KSxcclxuICAgICAgICAgICAgICAgIG5ld0RlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RBbGwuY2xvbmUoKSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgMik7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oYnVsazEpO1xyXG4gICAgICAgICAgICAvLyBFeGNsdWRlIDIgaXRlbXNcclxuICAgICAgICAgICAgbmV3RGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgbmV3RGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0yKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihuZXdEZWNpc2lvbik7XHJcblxyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25zKCkubGVuZ3RoKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QoYnVsazEuc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RBbGwoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChidWxrMS5idWxrQ291bnQpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChidWxrMS5zZWxlY3Rpb25Nb2RlbC5nZXRJdGVtcygpKS50b0NvbnRhaW4oaXRlbTEpO1xyXG4gICAgICAgICAgICBleHBlY3QoYnVsazEuc2VsZWN0aW9uTW9kZWwuZ2V0SXRlbXMoKSkudG9Db250YWluKGl0ZW0yKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2FkZHMgZXhjbHVzaW9ucyB0byBleGlzdGluZyBidWxrIHNlbGVjdCBhbGwgZGVjaXNpb25zIGlmIG5ldyBkZWNpc2lvbiBpcyBub3Qgc2VsZWN0IGFsbCcsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gQWRkIGEgc2VsZWN0IGFsbCBidWxrIGFjdGlvbiB3aXRoIGEgc2luZ2xlIGV4Y2x1c2lvbi5cclxuICAgICAgICAgICAgc2VsZWN0QWxsLmFkZChpdGVtMSk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RBbGxEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0QWxsLCB7fSwgZ2V0U3RhdHVzKCdidWxrMScpLCAyKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdEFsbERlY2lzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBhIHNlbGVjdCBzb21lIGRlY2lzaW9uIHdpdGggYW4gaXRlbSBzZWxlY3RlZC5cclxuICAgICAgICAgICAgc2VsZWN0U29tZS5hZGQoaXRlbTIpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0U29tZURlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgIHNlbGVjdFNvbWUsIHt9LCBnZXRTdGF0dXMoJ2J1bGsyJyksIHNlbGVjdFNvbWUuc2l6ZSgpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWVEZWNpc2lvbik7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGVyZSBhcmUgdHdvIGJ1bGsgZGVjaXNpb25zIGFuZCB0aGF0IHRoZSBzZWxlY3RBbGwgaGFzIHRoZSBzZWxlY3RTb21lIGl0ZW0gZXhjbHVkZWQuXHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RBbGxEZWNpc2lvbi5zZWxlY3Rpb25Nb2RlbC5nZXRJdGVtcygpLmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdEFsbERlY2lzaW9uLnNlbGVjdGlvbk1vZGVsLmdldEl0ZW1zKCkpLnRvQ29udGFpbihpdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RBbGxEZWNpc2lvbi5zZWxlY3Rpb25Nb2RlbC5nZXRJdGVtcygpKS50b0NvbnRhaW4oaXRlbTIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVtb3ZlcyBpdGVtcyBmcm9tIGV4aXN0aW5nIGJ1bGsgbm9uLXNlbGVjdCBhbGwgZGVjaXNpb25zIGlmIG5ldyBkZWNpc2lvbiBpcyBub3Qgc2VsZWN0IGFsbCcsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gQWRkIGEgYnVsayBkZWNpc2lvbiB3aXRoIGEgY291cGxlIG9mIGl0ZW1zIHNlbGVjdGVkLlxyXG4gICAgICAgICAgICBsZXQgc2VsZWN0U29tZUluaXRpYWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcclxuICAgICAgICAgICAgc2VsZWN0U29tZUluaXRpYWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgc2VsZWN0U29tZUluaXRpYWwuYWRkKGl0ZW0yKTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdFNvbWVJbml0aWFsRGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0U29tZUluaXRpYWwsIHt9LCBnZXRTdGF0dXMoJzEnKSwgc2VsZWN0U29tZUluaXRpYWwuc2l6ZSgpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWVJbml0aWFsRGVjaXNpb24pO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGFub3RoZXIgc2VsZWN0IHNvbWUgZGVjaXNpb24gdGhhdCB3aWxsIG92ZXJyaWRlIG9uZSBvZiB0aGUgaXRlbXMuXHJcbiAgICAgICAgICAgIHNlbGVjdFNvbWUuYWRkKGl0ZW0yKTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdFNvbWVOZXdEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RTb21lLCB7fSwgZ2V0U3RhdHVzKCcyJyksIHNlbGVjdFNvbWUuc2l6ZSgpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWVOZXdEZWNpc2lvbik7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBmaXJzdCBkZWNpc2lvbiBoYXMgb25lIGl0ZW0gcmVtb3ZlZC5cclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdFNvbWVJbml0aWFsRGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RTb21lSW5pdGlhbERlY2lzaW9uLnNlbGVjdGlvbk1vZGVsLmdldEl0ZW1zKCkpLnRvQ29udGFpbihpdGVtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RTb21lTmV3RGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RTb21lTmV3RGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuZ2V0SXRlbXMoKSkudG9Db250YWluKGl0ZW0yKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NvbXBsZXRlbHkgcmVtb3ZlcyBleGlzdGluZyBidWxrIG5vbi1zZWxlY3QgYWxsIGRlY2lzaW9uIGlmIG5ldyBkZWNpc2lvbiBpbmNsdWRlcyB0aGUgc2FtZSBpdGVtcycsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gQWRkIGEgYnVsayBkZWNpc2lvbiB3aXRoIGEgY291cGxlIG9mIGl0ZW1zIHNlbGVjdGVkLlxyXG4gICAgICAgICAgICBsZXQgc2VsZWN0U29tZUluaXRpYWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcclxuICAgICAgICAgICAgc2VsZWN0U29tZUluaXRpYWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgc2VsZWN0U29tZUluaXRpYWwuYWRkKGl0ZW0yKTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdFNvbWVJbml0aWFsRGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0U29tZUluaXRpYWwsIHt9LCBnZXRTdGF0dXMoJzEnKSwgc2VsZWN0U29tZUluaXRpYWwuc2l6ZSgpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWVJbml0aWFsRGVjaXNpb24pO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGFub3RoZXIgc2VsZWN0IHNvbWUgZGVjaXNpb24gdGhhdCB3aWxsIG92ZXJyaWRlIGFsbCB0aGUgaXRlbXMuXHJcbiAgICAgICAgICAgIHNlbGVjdFNvbWUuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgc2VsZWN0U29tZS5hZGQoaXRlbTIpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0U29tZU5ld0RlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgIHNlbGVjdFNvbWUsIHt9LCBnZXRTdGF0dXMoJzInKSwgc2VsZWN0U29tZS5zaXplKCkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oc2VsZWN0U29tZU5ld0RlY2lzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgb25seSB0aGUgc2Vjb25kIGRlY2lzaW9uIGV4aXN0cy5cclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS5ub3QudG9Db250YWluKHNlbGVjdFNvbWVJbml0aWFsRGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25zKCkpLnRvQ29udGFpbihzZWxlY3RTb21lTmV3RGVjaXNpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2xlYXJzIGFsbCBsaW5lIGl0ZW0gZGVjaXNpb25zIGZvciBzYW1lIHNjb3BlIGlmIG5ldyBkZWNpc2lvbiBpcyBzZWxlY3QgYWxsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBBZGQgYSBjb3VwbGUgaXRlbSBkZWNpc2lvbnMuXHJcbiAgICAgICAgICAgIGxldCBpdGVtRGVjaXNpb24xID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtMSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcclxuICAgICAgICAgICAgLy8gU2V0IGEgZGlmZmVyZW50IHNjb3BlIG9uIGFuIGl0ZW1cclxuICAgICAgICAgICAgbGV0IG5ld0l0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oaXRlbTIpO1xyXG4gICAgICAgICAgICBuZXdJdGVtLnRhYmxlU2NvcGUgPSB0YWJsZVNjb3BlO1xyXG4gICAgICAgICAgICBsZXQgaXRlbURlY2lzaW9uMiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24obmV3SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oaXRlbURlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKGl0ZW1EZWNpc2lvbjIpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGEgYnVsayBzZWxlY3QgYWxsLlxyXG4gICAgICAgICAgICBsZXQgc2VsZWN0QWxsRGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdEFsbCwge30sIGdldFN0YXR1cygnYnVsazEnKSwgNSk7XHJcbiAgICAgICAgICAgIHNweU9uKHNlbGVjdEFsbCwgJ2lzSXRlbVNlbGVjdGVkJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdEFsbERlY2lzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgdGhlIGxpbmUgaXRlbSBkZWNpc2lvbnMgYXJlIGNsZWFyZWQuXHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoNik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbnMoKSkubm90LnRvQ29udGFpbihpdGVtRGVjaXNpb24xKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS50b0NvbnRhaW4oaXRlbURlY2lzaW9uMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbnMoKSkudG9Db250YWluKHNlbGVjdEFsbERlY2lzaW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIG1hdGNoaW5nIGV4aXN0aW5nIGxpbmUgaXRlbSBkZWNpc2lvbnMgaWYgbmV3IGRlY2lzaW9uIGlzIG5vbi1zZWxlY3QgYWxsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBBZGQgYSBjb3VwbGUgaXRlbSBkZWNpc2lvbnMuXHJcbiAgICAgICAgICAgIGxldCBpdGVtRGVjaXNpb24xID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtMSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW1EZWNpc2lvbjIgPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0yLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihpdGVtRGVjaXNpb24xKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oaXRlbURlY2lzaW9uMik7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgYSBidWxrIHNlbGVjdCBzb21lIHdpdGggb25lIG9mIHRoZSBpdGVtcy5cclxuICAgICAgICAgICAgc2VsZWN0U29tZS5hZGQoaXRlbTEpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0U29tZURlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgIHNlbGVjdFNvbWUsIHt9LCBnZXRTdGF0dXMoJ2J1bGsxJyksIHNlbGVjdFNvbWUuc2l6ZSgpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWVEZWNpc2lvbik7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IGl0ZW0xJ3MgZGVjaXNpb24gaXMgbm8gbG9uZ2VyIHN0b3JlZCBzaW5jZSBpdCB3YXMgb3ZlcnJpZGRlbiBieSB0aGUgYnVsayBkZWNpc2lvbi5cclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS5ub3QudG9Db250YWluKGl0ZW1EZWNpc2lvbjEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25zKCkpLnRvQ29udGFpbihpdGVtRGVjaXNpb24yKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS50b0NvbnRhaW4oc2VsZWN0U29tZURlY2lzaW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlbW92ZXMgbGluZSBpdGVtIGRlY2lzaW9ucyBmcm9tIHRoYXQgbWF0Y2ggYWNjb3VudCBpZiBidWxrIGFjY291bnQgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtV2l0aFNhbWVBY2NvdW50QXMxID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGFuZ3VsYXIuY29weShpdGVtMSkpO1xyXG4gICAgICAgICAgICBpdGVtV2l0aFNhbWVBY2NvdW50QXMxLmlkID0gJzk4NzYnO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsKCksXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbjEgPVxyXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbVdpdGhTYW1lQWNjb3VudEFzMSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uMiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9uTW9kZWwsIHt9LCBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSk7XHJcblxyXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbC5hZGQoaXRlbTEpO1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbC5hZGQoaXRlbTIpO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oZGVjaXNpb24xKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGRlY2lzaW9uMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gc3RvcmUuZ2V0RGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbnMpLnRvQ29udGFpbihkZWNpc2lvbjIpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zKS5ub3QudG9Db250YWluKGRlY2lzaW9uMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIG1hdGNoaW5nIGFjY291bnQgaXRlbXMgZnJvbSBidWxrIGRlY2lzaW9ucyBpZiBidWxrIGFjY291bnQgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtV2l0aFNhbWVBY2NvdW50QXMxID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGFuZ3VsYXIuY29weShpdGVtMSkpO1xyXG4gICAgICAgICAgICBpdGVtV2l0aFNhbWVBY2NvdW50QXMxLmlkID0gJzk4NzYnO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbk1vZGVsMSA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb24xID1cclxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdGlvbk1vZGVsMSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSksXHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbDIgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uMiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9uTW9kZWwyLCB7fSwgZ2V0U3RhdHVzKCdSZXZva2VBY2NvdW50JykpO1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwxLmFkZChpdGVtMSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsMS5hZGQoaXRlbTIpO1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbDIuYWRkKGl0ZW1XaXRoU2FtZUFjY291bnRBczEpO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGRlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihkZWNpc2lvbjIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9ucyA9IHN0b3JlLmdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zKS50b0NvbnRhaW4oZGVjaXNpb24yKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9ucykudG9Db250YWluKGRlY2lzaW9uMSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbXMgPSBkZWNpc2lvbjEuc2VsZWN0aW9uTW9kZWwuZ2V0SXRlbXMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGl0ZW1zKS50b0NvbnRhaW4oaXRlbTIpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXRlbXMpLm5vdC50b0NvbnRhaW4oaXRlbTEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBncm91cHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBleGNlcHRpb25Hcm91cCwgYnVuZGxlR3JvdXA7XHJcblxyXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoUmVzdWx0R3JvdXApID0+IHtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbkdyb3VwID0gbmV3IFJlc3VsdEdyb3VwKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdFeGNlcHRpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogNVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnVuZGxlR3JvdXAgPSBuZXcgUmVzdWx0R3JvdXAoe1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0J1bmRsZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgbGluZSBpdGVtIGRlY2lzaW9ucyBmb3IgaXRlbXMgdGhhdCBmYWxsIGludG8gYSBncm91cCBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtRGVjaXNpb24xID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtMSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSxcclxuICAgICAgICAgICAgICAgICAgICBpdGVtRGVjaXNpb24yID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtMiwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXdCdWxrID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0U29tZS5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdidWxrMScpLCBzZWxlY3RTb21lLnNpemUoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3QnVsay5zZWxlY3Rpb25Nb2RlbC5hZGRHcm91cChleGNlcHRpb25Hcm91cCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oaXRlbURlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihpdGVtRGVjaXNpb24yKTtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihuZXdCdWxrKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25zKCkubGVuZ3RoKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS5ub3QudG9Db250YWluKGl0ZW1EZWNpc2lvbjEpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9ucygpKS50b0NvbnRhaW4oaXRlbURlY2lzaW9uMik7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RGVjaXNpb25zKCkpLnRvQ29udGFpbihuZXdCdWxrKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnaW5jbHVkZXMgZ3JvdXAgZXhjbHVzaW9ucyBmcm9tIG5ldyBidWxrIHNlbGVjdCBhbGwgaW4gZXhpc3RpbmcgYnVsayBzZWxlY3QgYWxsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nQnVsayA9IENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdEFsbC5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCA0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXdCdWxrID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0QWxsLmNsb25lKCksIHt9LCBnZXRTdGF0dXMoJ1Jldm9rZWQnKSwgMyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3QnVsay5zZWxlY3Rpb25Nb2RlbC5hZGRHcm91cChleGNlcHRpb25Hcm91cCk7XHJcbiAgICAgICAgICAgICAgICBuZXdCdWxrLnNlbGVjdGlvbk1vZGVsLnJlbW92ZShpdGVtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGV4aXN0aW5nQnVsayk7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24obmV3QnVsayk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdEFsbCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzR3JvdXAoZXhjZXB0aW9uR3JvdXApKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5nZXRHcm91cChleGNlcHRpb25Hcm91cCkuc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtMSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGluY2x1ZGUgZ3JvdXAgZXhjbHVzaW9ucyBmcm9tIG5ldyBidWxrIHNlbGVjdCBhbGwgaWYgZXhpc3Rpbmcgc2VsZWN0IGFsbCBleGNsdWRlZCB0aGVtJyxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZXhpc3RpbmdCdWxrID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdEFsbC5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCA0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QnVsayA9IENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RBbGwuY2xvbmUoKSwge30sIGdldFN0YXR1cygnUmV2b2tlZCcpLCAzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVsay5zZWxlY3Rpb25Nb2RlbC5hZGRHcm91cChleGNlcHRpb25Hcm91cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVsay5zZWxlY3Rpb25Nb2RlbC5yZW1vdmUoaXRlbTEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoZXhjZXB0aW9uR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oZXhpc3RpbmdCdWxrKTtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24obmV3QnVsayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RBbGwoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5oYXNHcm91cChleGNlcHRpb25Hcm91cCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtMSkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgcmVtb3ZlIGdyb3VwIGV4Y2x1c2lvbnMgZnJvbSBuZXcgYnVsayBzZWxlY3QgYWxsIGluIGV4aXN0aW5nIG5vbi1zZWxlY3QgYWxsIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nQnVsayA9ICBDZXJ0aWZpY2F0aW9uRGVjaXNpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RTb21lLmNsb25lKCksIHt9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIDQpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0J1bGsgPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RBbGwuY2xvbmUoKSwge30sIGdldFN0YXR1cygnUmV2b2tlZCcpLCAzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoZXhjZXB0aW9uR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihleGlzdGluZ0J1bGspO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKG5ld0J1bGspO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtMSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgZ3JvdXBzIGZyb20gZXhpc3Rpbmcgbm9uLXNlbGVjdCBhbGwgZGVjaXNpb24gaWYgbm90IGV4Y2x1ZGVkIGZyb20gbmV3IHNlbGVjdCBhbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXhpc3RpbmdCdWxrID0gIENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWUuY2xvbmUoKSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgNCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVsayA9IENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdEFsbC5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdSZXZva2VkJyksIDMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5hZGRHcm91cChleGNlcHRpb25Hcm91cCk7XHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoYnVuZGxlR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoYnVuZGxlR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihleGlzdGluZ0J1bGspO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKG5ld0J1bGspO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzR3JvdXAoZXhjZXB0aW9uR3JvdXApKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzR3JvdXAoYnVuZGxlR3JvdXApKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdleGNsdWRlcyBncm91cCBpbmNsdXNpb25zIGZyb20gZXhpc3RpbmcgYnVsayBzZWxlY3QgYWxsIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nQnVsayA9ICBDZXJ0aWZpY2F0aW9uRGVjaXNpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RBbGwuY2xvbmUoKSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgNCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVsayA9IENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWUuY2xvbmUoKSwge30sIGdldFN0YXR1cygnUmV2b2tlZCcpLCAzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdCdWxrLnNlbGVjdGlvbk1vZGVsLmFkZEdyb3VwKGJ1bmRsZUdyb3VwKTtcclxuICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwucmVtb3ZlKGl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIC8vIEFkZCBhbiBleGNsdXNpb24gdG8gdGhlIGV4aXN0aW5nIGJ1bGsgc2VsZWN0IGFsbCB0byB0ZXN0IHRoYXQgY291bnQgcmVtYWlucyBhY2N1cmF0ZVxyXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdCdWxrLnNlbGVjdGlvbk1vZGVsLmFkZChpdGVtMyk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGV4aXN0aW5nQnVsayk7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24obmV3QnVsayk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5oYXNHcm91cChidW5kbGVHcm91cCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZXhpc3RpbmdCdWxrLnNlbGVjdGlvbk1vZGVsLmdldEdyb3VwKGJ1bmRsZUdyb3VwKS5zZWxlY3Rpb25Nb2RlbC5oYXNJdGVtKGl0ZW0yKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuYnVsa0NvdW50KS50b0VxdWFsKDQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdpZ25vcmVzIGluY2x1c2lvbiBmcm9tIGdyb3VwIGV4Y2x1c2lvbiBpbiBuZXcgZGVjaXNpb24gaWYgYWxyZWFkeSBleGNsdWRlZCBmcm9tIGV4aXN0aW5nIHNlbGVjdCBhbGwnLFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBleGlzdGluZ0J1bGsgPSAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdEFsbC5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCA0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QnVsayA9IENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3RTb21lLmNsb25lKCksIHt9LCBnZXRTdGF0dXMoJ1Jldm9rZWQnKSwgMyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoYnVuZGxlR3JvdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwucmVtb3ZlKGl0ZW0yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdCdWxrLnNlbGVjdGlvbk1vZGVsLmFkZChpdGVtMik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihleGlzdGluZ0J1bGspO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihuZXdCdWxrKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5oYXNHcm91cChidW5kbGVHcm91cCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5nZXRHcm91cChidW5kbGVHcm91cCkuc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtMikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgZ3JvdXAgaW5jbHVzaW9ucyBmcm9tIGV4aXN0aW5nIGJ1bGsgbm9uLXNlbGVjdCBhbGwgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXhpc3RpbmdCdWxrID0gIENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWUuY2xvbmUoKSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgNCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVsayA9IENlcnRpZmljYXRpb25EZWNpc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdFNvbWUuY2xvbmUoKSwge30sIGdldFN0YXR1cygnUmV2b2tlZCcpLCAzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdCdWxrLnNlbGVjdGlvbk1vZGVsLmFkZEdyb3VwKGJ1bmRsZUdyb3VwKTtcclxuICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwucmVtb3ZlKGl0ZW0yKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoYnVuZGxlR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihleGlzdGluZ0J1bGspO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKG5ld0J1bGspO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzR3JvdXAoYnVuZGxlR3JvdXApKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtMikpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgaXRlbXMgZnJvbSBleGlzdGluZyBub24tc2VsZWN0IGFsbCBkZWNpc2lvbiB0aGF0IGFyZSBpbiBhIGdyb3VwIG9mIG5ldyBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBleGlzdGluZ0J1bGsgPSAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0U29tZS5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCA0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXdCdWxrID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0U29tZS5jbG9uZSgpLCB7fSwgZ2V0U3RhdHVzKCdSZXZva2VkJyksIDMpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld0J1bGsuc2VsZWN0aW9uTW9kZWwuYWRkR3JvdXAoYnVuZGxlR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5hZGQoaXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdCdWxrLnNlbGVjdGlvbk1vZGVsLmFkZChpdGVtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGV4aXN0aW5nQnVsayk7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24obmV3QnVsayk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGV4aXN0aW5nQnVsay5zZWxlY3Rpb25Nb2RlbC5oYXNJdGVtKGl0ZW0xKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChleGlzdGluZ0J1bGsuc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtMikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdoYXNCdWxrRGVjaXNpb25zKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgYnVsayBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidWxrRGVjaXNpb24gPVxyXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihuZXcgU2VsZWN0aW9uTW9kZWwoKSwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgMSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrRGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuaGFzQnVsa0RlY2lzaW9ucygpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGVyZSBhcmUgbm8gYnVsayBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtRGVjaXNpb24xID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihpdGVtMSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oaXRlbURlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5oYXNCdWxrRGVjaXNpb25zKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldERlY2lzaW9ucygpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IGFycmF5IGlmIG5vIGRlY2lzaW9ucyBoYXZlIGJlZW4gbWFkZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9ucyA9IHN0b3JlLmdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlY2lzaW9ucyB0aGF0IHdlcmUgbWFkZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0xID0geyBpZDogJzExMTExJyB9LFxyXG4gICAgICAgICAgICAgICAgaXRlbTIgPSB7IGlkOiAnMjIyMjInIH07XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbTEsIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0yLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpKTtcclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9ucyA9IHN0b3JlLmdldERlY2lzaW9ucygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgbGV0IGZvdW5kMSA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZm91bmQyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRlY2lzaW9ucy5mb3JFYWNoKChkZWNpc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0xLmlkID09PSBkZWNpc2lvbi5jZXJ0aWZpY2F0aW9uSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQxID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtMi5pZCA9PT0gZGVjaXNpb24uY2VydGlmaWNhdGlvbkl0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kMiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGZvdW5kMSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZvdW5kMikudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3NvcnRzIHRoZSBkZWNpc2lvbnMgYnkgY3JlYXRlZCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTEgPSB7IGlkOiAnMTExMTEnIH0sXHJcbiAgICAgICAgICAgICAgICBpdGVtMiA9IHsgaWQ6ICcyMjIyJ30sXHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb24xID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3Rpb25Nb2RlbCwgbnVsbCwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uMiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbTEsIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsLmFkZChpdGVtMik7XHJcbiAgICAgICAgICAgIGRlY2lzaW9uMS5jcmVhdGVkLnNldEhvdXJzKDEpO1xyXG4gICAgICAgICAgICBkZWNpc2lvbjIuY3JlYXRlZC5zZXRIb3VycygyKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oZGVjaXNpb24yKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGRlY2lzaW9uMSk7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbnMgPSBzdG9yZS5nZXREZWNpc2lvbnMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbnNbMF0pLnRvRXF1YWwoZGVjaXNpb24xKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uc1sxXSkudG9FcXVhbChkZWNpc2lvbjIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldERlY2lzaW9uQ291bnQoKScsICgpID0+IHtcclxuICAgICAgICBpdCgncmV0dXJucyB6ZXJvIGZvciBubyBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBjb3VudCBvZiBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oeyBpZDogJzExMTExJyB9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7IGlkOiAnMjIyMjInIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKHsgaWQ6ICczMzMzMycgfSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoMyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBjb3VudCBvZiBsaW5lIGl0ZW0gYW5kIGJ1bGsgZGVjaXNpb25zJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0xKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0yKTtcclxuICAgICAgICAgICAgbGV0IGJ1bGtEZWNpc2lvbiA9IG5ldyBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwsIHt9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIHNlbGVjdGlvbk1vZGVsLnNpemUoKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrRGVjaXNpb24pO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKHsgaWQ6ICcxMTExMScgfSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oeyBpZDogJzIyMjIyJyB9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldERlY2lzaW9uQ291bnQoKSkudG9FcXVhbCg0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdnZXRDb3VudHNCeURlY2lzaW9uKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgYW4gZW1wdHkgbWFwIGZvciBubyBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXRDb3VudHNCeURlY2lzaW9uKCkuc2l6ZSkudG9FcXVhbCgwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgbGluZSBpdGVtIGRlY2lzaW9uIGNvdW50cycsICgpID0+IHtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7IGlkOiAnMTExMTEnIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKHsgaWQ6ICcyMjIyMicgfSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJykpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7IGlkOiAnMzMzMzMnIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1hcCA9IHN0b3JlLmdldENvdW50c0J5RGVjaXNpb24oKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hcC5zaXplKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QobWFwLmdldCgnQXBwcm92ZWQnKSkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hcC5nZXQoJ1JlbWVkaWF0ZWQnKSkudG9FcXVhbCgxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYnVsayBkZWNpc2lvbiBhbmQgaXRlbSBjb3VudHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbC5hZGQoaXRlbTEpO1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbC5hZGQoaXRlbTIpO1xyXG4gICAgICAgICAgICBsZXQgYnVsa0RlY2lzaW9uID0gbmV3IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oXHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbCwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgc2VsZWN0aW9uTW9kZWwuc2l6ZSgpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGJ1bGtEZWNpc2lvbik7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKHsgaWQ6ICcxMTExMScgfSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJykpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7IGlkOiAnMjIyMjInIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1hcCA9IHN0b3JlLmdldENvdW50c0J5RGVjaXNpb24oKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hcC5zaXplKS50b0VxdWFsKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QobWFwLmdldCgnQXBwcm92ZWQnKSkudG9FcXVhbCgzKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hcC5nZXQoJ1JlbWVkaWF0ZWQnKSkudG9FcXVhbCgxKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdjbGVhckRlY2lzaW9ucygpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZW1vdmVzIGFsbCBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oeyBpZDogJzExMTExJyB9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7IGlkOiAnMjIyMjInIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKHsgaWQ6ICczMzMzMycgfSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmNsZWFyRGVjaXNpb25zKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXREZWNpc2lvbkNvdW50KCkpLnRvRXF1YWwoMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RWZmZWN0aXZlRGVjaXNpb24oKScsICgpID0+IHtcclxuICAgICAgICBsZXQgaXRlbSA9IHsgaWQ6ICcxMTExMScgfTtcclxuICAgICAgICBpdCgncmV0dXJucyBpdGVtIGRlY2lzaW9uIGlmIG9uZSBleGlzdHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oaXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkRGVjaXNpb24oZGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RWZmZWN0aXZlRGVjaXNpb24oaXRlbS5pZCkpLnRvRXF1YWwoZGVjaXNpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBidWxrIGRlY2lzaW9uIGlmIG5vIGl0ZW0gZGVjaXNpb24gYW5kIGl0ZW0gaXMgcGFydCBvZiBidWxrIHNlbGVjdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsKCksXHJcbiAgICAgICAgICAgICAgICB0YWJsZVNjb3BlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZVNjb3BlKHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNlczogWydPcGVuJ11cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsLCB0YWJsZVNjb3BlLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIDEpO1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbC5zZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgc3RvcmUuYWRkQnVsa0RlY2lzaW9uKGRlY2lzaW9uKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldEVmZmVjdGl2ZURlY2lzaW9uKGl0ZW0uaWQsIHRhYmxlU2NvcGUpKS50b0VxdWFsKGRlY2lzaW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdW5kZWZpbmVkIGlmIG5vIGl0ZW0gZGVjaXNpb24gb3IgYXBwbGljYWJsZSBidWxrIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWwoKSxcclxuICAgICAgICAgICAgICAgIHRhYmxlU2NvcGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlU2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbJ09wZW4nXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgMSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsLnNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAvLyBBZGRpbmcgaXRlbSBtYXJrcyBpdCBhcyBuZWdhdGl2ZSBzZWxlY3Rpb25cclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oZGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RWZmZWN0aXZlRGVjaXNpb24oaXRlbS5pZCwgdGFibGVTY29wZSkpLm5vdC50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgaWYgdGFibGUgc2NvcGUgZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgdGFibGVTY29wZSA9IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsnT3BlbiddXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbCwge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgMSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsLnNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oZGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RWZmZWN0aXZlRGVjaXNpb24oaXRlbS5pZCwgdGFibGVTY29wZSkpLm5vdC50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB1bmRlZmluZWQgaWYgdGFibGVTY29wZSBpcyB1bmRlZmluZWQgYW5kIGRlY2lzaW9uIGlzIHNlbGVjdCBhbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgdGFibGVTY29wZSA9IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsnT3BlbiddXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbCwgdGFibGVTY29wZSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihkZWNpc2lvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXRFZmZlY3RpdmVEZWNpc2lvbihpdGVtLmlkLCB1bmRlZmluZWQpKS5ub3QudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYnVsayBkZWNpc2lvbiBpZiB0YWJsZVNjb3BlIGlzIHVuZGVmaW5lZCBhbmQgZGVjaXNpb24gaXMgbm90IHNlbGVjdCBhbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgdGFibGVTY29wZSA9IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsnT3BlbiddXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbCwgdGFibGVTY29wZSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpLCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGRCdWxrRGVjaXNpb24oZGVjaXNpb24pO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RWZmZWN0aXZlRGVjaXNpb24oaXRlbS5pZCwgdW5kZWZpbmVkKSkudG9FcXVhbChkZWNpc2lvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW07XHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKHN0b3JlLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgaXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XHJcbiAgICAgICAgICAgICAgICBpZDogJ2FiY2QnLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcclxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWNjb3VudDEnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0YWJsZVNjb3BlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZVNjb3BlKHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbJ09wZW4nXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2ZpbmQgYSBsaW5lIGl0ZW0gYWNjb3VudCBkZWNpc2lvbiB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIGl0ZW0nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbkl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdnZ2dnJyxcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnQXBwMScsXHJcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2FjY291bnQxJ1xyXG4gICAgICAgICAgICB9KSwgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGRlY2lzaW9uSXRlbSwgZ2V0U3RhdHVzKCdSZXZva2VBY2NvdW50JykpO1xyXG4gICAgICAgICAgICBzdG9yZS5hZGREZWNpc2lvbihkZWNpc2lvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXRFZmZlY3RpdmVEZWNpc2lvbkJ5SXRlbShpdGVtKSkudG9FcXVhbChkZWNpc2lvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdmaW5kcyBhIGJ1bGsgYWNjb3VudCBkZWNpc2lvbiB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIGl0ZW0nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbkl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnZ2dnZycsXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2FjY291bnQxJ1xyXG4gICAgICAgICAgICAgICAgfSksIHNlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsKCksXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cygnUmV2b2tlQWNjb3VudCcpLCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuYWRkKGRlY2lzaW9uSXRlbSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihkZWNpc2lvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdG9yZS5nZXRFZmZlY3RpdmVEZWNpc2lvbkJ5SXRlbShpdGVtKSkudG9FcXVhbChkZWNpc2lvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBmaW5kIGEgZGVjaXNpb24gdGhhdCBtYXRjaGVzIGFjY291bnQgYnV0IGlzIG5vdCBhbiBhY2NvdW50IGxldmVsIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb25JdGVtID0gbmV3IENlcnRpZmljYXRpb25JdGVtKHtcclxuICAgICAgICAgICAgICAgIGlkOiAnZ2dnZycsXHJcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0FwcDEnLFxyXG4gICAgICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICdhY2NvdW50MSdcclxuICAgICAgICAgICAgfSksIGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihkZWNpc2lvbkl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKGRlY2lzaW9uKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldEVmZmVjdGl2ZURlY2lzaW9uQnlJdGVtKGl0ZW0pKS5ub3QudG9FcXVhbChkZWNpc2lvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBmaW5kIGEgYWNjb3VudCBsZXZlbCBkZWNpc2lvbiBvbiBkaWZmZXJlbnQgYWNjb3VudCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9uSXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XHJcbiAgICAgICAgICAgICAgICBpZDogJ2dnZ2cnLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcclxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWNjb3VudDInXHJcbiAgICAgICAgICAgIH0pLCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oZGVjaXNpb25JdGVtLCBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZERlY2lzaW9uKGRlY2lzaW9uKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldEVmZmVjdGl2ZURlY2lzaW9uQnlJdGVtKGl0ZW0pKS5ub3QudG9FcXVhbChkZWNpc2lvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIGdldEVmZmVjdGl2ZURlY2lzaW9uIGlmIG5vIGFjY291bnQgbGV2ZWwgZGVjaXNpb24gaXMgYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzdG9yZS5nZXRFZmZlY3RpdmVEZWNpc2lvbkJ5SXRlbShpdGVtLCB0YWJsZVNjb3BlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldEVmZmVjdGl2ZURlY2lzaW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtLmlkLCB0YWJsZVNjb3BlLCBpdGVtKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHJldHVybiBhIHNlbGVjdCBhbGwgYWNjb3VudCBkZWNpc2lvbiB3aXRoIGV4Y2x1ZGVkIGl0ZW0gdGhhdCBtYXRjaGVzIGFjY291bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxyXG4gICAgICAgICAgICAgICAgYnVsa0RlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3Rpb25Nb2RlbCwgdGFibGVTY29wZSxcclxuICAgICAgICAgICAgICAgICAgICBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSksXHJcbiAgICAgICAgICAgICAgICBleGNsdWRlZEl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnMTExMScsXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2FjY291bnQxJ1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBpdGVtID0gbmV3IENlcnRpZmljYXRpb25JdGVtKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJzIyMjInLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnQXBwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICdhY2NvdW50MSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZWwuc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIHN0b3JlLmFkZEJ1bGtEZWNpc2lvbihidWxrRGVjaXNpb24pO1xyXG4gICAgICAgICAgICBzdG9yZS5jbGVhckRlY2lzaW9uKGV4Y2x1ZGVkSXRlbSk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0oaXRlbSwgdGFibGVTY29wZSkpLm5vdC50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
