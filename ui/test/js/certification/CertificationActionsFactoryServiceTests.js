System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('certificationActionsFactoryService', function () {
                var CertificationActionStatus = undefined,
                    CertificationItem = undefined,
                    CertificationDecisionStatus = undefined,
                    certificationActionsFactoryService = undefined,
                    certEditable = undefined;

                beforeEach(module(certificationModule, testModule));

                beforeEach(inject(function (certificationTestData, _CertificationItem_, _CertificationActionStatus_, _CertificationDecisionStatus_, _certificationActionsFactoryService_, _certificationDataService_) {
                    CertificationActionStatus = _CertificationActionStatus_;
                    CertificationItem = _CertificationItem_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    CertificationDecisionStatus = _CertificationDecisionStatus_;
                    certificationActionsFactoryService = _certificationActionsFactoryService_;

                    certEditable = true;
                    spyOn(_certificationDataService_, 'isCertificationEditable').and.callFake(function () {
                        return certEditable;
                    });
                }));

                function createCertificationItem(statuses, decisionState, summaryStatus, policyType) {
                    var decisionStatus = new CertificationDecisionStatus({});
                    if (statuses) {
                        statuses.forEach(function (status) {
                            return decisionStatus.decisions.push(new CertificationActionStatus({
                                status: status,
                                promptKey: status,
                                name: status
                            }));
                        });
                    }

                    if (decisionState) {
                        decisionStatus.currentState = new CertificationActionStatus({
                            status: decisionState,
                            promptKey: decisionState,
                            name: decisionState
                        });
                    }

                    return new CertificationItem({
                        id: '1234',
                        decisionStatus: decisionStatus,
                        policyType: policyType,
                        summaryStatus: summaryStatus ? summaryStatus : CertificationItem.Status.Open,
                        roleName: 'Role1',
                        canChangeDecision: true
                    });
                }

                describe('getCertificationActions(item)', function () {
                    it('null item throws', function () {
                        expect(function () {
                            certificationActionsFactoryService.getCertificationActions(null);
                        }).toThrow();
                    });

                    it('item with empty decisions does not fail', function () {
                        var item = createCertificationItem([], CertificationActionStatus.Name.Approved, CertificationItem.Status.Open);
                        var actions = certificationActionsFactoryService.getCertificationActions(item);
                        expect(actions).toBeTruthy();
                        expect(actions.getButtonActions().length).toEqual(0);
                        expect(actions.getMenuActions().length).toEqual(0);
                    });

                    it('item with fleshed-out decisions gives two buttons and some menus', function () {
                        var item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated], undefined, CertificationItem.Status.Open);
                        var actions = certificationActionsFactoryService.getCertificationActions(item);
                        expect(actions).toBeTruthy();
                        expect(actions.getButtonActions().length).toEqual(2);
                        expect(actions.getMenuActions().length).toEqual(2);
                    });

                    it('excludes unsupported operations', function () {
                        var item = createCertificationItem([CertificationActionStatus.Name.ApproveAccount, CertificationActionStatus.Name.Modified, CertificationActionStatus.Name.AccountReassign], undefined, CertificationItem.Status.Open),
                            actions = certificationActionsFactoryService.getCertificationActions(item);
                        expect(actions.getButtonActions().length).toEqual(0);
                        expect(actions.getMenuActions().length).toEqual(0);
                    });
                });

                describe('Status Open, getButtonDecisions(item, availableDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API. For Open items, current
                        // status is always undefined.
                        item = createCertificationItem(undefined, undefined, CertificationItem.Status.Open);
                    });

                    // Note status Open and Returned are identical so we only test one of them here.

                    it('no available decisions should return empty button decisions', function () {
                        var buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, new Set());
                        expect(buttonDecisions.length).toEqual(0);
                    });

                    it('available non-button-worthy decisions should return empty button decisions', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Cleared, CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Acknowledged]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(0);
                    });

                    it('one available decision should return one button decision', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(1);
                        expect(buttonDecisions[0]).toEqual(CertificationActionStatus.Name.Approved);
                    });

                    it('more than two available decisions should return two button decisions', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(2);
                        expect(buttonDecisions[0]).toEqual(CertificationActionStatus.Name.Approved);
                        expect(buttonDecisions[1]).toEqual(CertificationActionStatus.Name.Remediated);
                    });
                });

                describe('Status Delegated, getButtonDecisions(item, availableDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions and current status don't matter here.
                        item = createCertificationItem(undefined, undefined, CertificationItem.Status.Delegated);
                    });

                    it('should return empty button decisions', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(0);
                    });
                });

                describe('Status Complete, getButtonDecisions(item, availableDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions and current status don't matter here.
                        item = createCertificationItem(undefined, undefined, CertificationItem.Status.Complete);
                    });

                    it('should return empty button decisions', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(0);
                    });
                });

                describe('Status Returned, getButtonDecisions(item, availableDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions and current status don't matter here.
                        item = createCertificationItem(undefined, undefined, CertificationItem.Status.Returned);
                    });

                    it('should return empty button decisions if cert not editable', function () {
                        item.canChangeDecision = false;

                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(0);
                    });
                });

                describe('Status WaitingReview, getButtonDecisions(item, availableDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API. .
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Remediated, CertificationItem.Status.WaitingReview);
                        item.requiresReview = true;
                    });

                    // Note WaitingReview and Challenged are identical so we only test one of them here.

                    it('no available decisions should return empty button decisions', function () {
                        var buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, new Set());
                        expect(buttonDecisions.length).toEqual(0);
                    });

                    it('current state not available should return one button', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(1);
                        expect(buttonDecisions[0]).toEqual(CertificationActionStatus.Name.Approved);
                    });

                    it('opposite is not available should return one button', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Remediated]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(1);
                        expect(buttonDecisions[0]).toEqual(CertificationActionStatus.Name.Remediated);
                    });

                    it('challenge phase special case should return one button', function () {
                        item.canChangeDecision = false;
                        var availableDecisions = new Set([CertificationActionStatus.Name.Remediated]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(1);
                        expect(buttonDecisions[0]).toEqual(CertificationActionStatus.Name.Remediated);
                    });

                    it('standard two buttons', function () {
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated]),
                            buttonDecisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(2);
                        // The current status, and its opposite.
                        expect(buttonDecisions[0]).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(buttonDecisions[1]).toEqual(CertificationActionStatus.Name.Approved);
                    });
                });

                describe('Default status, createButtonActions(item, buttonDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API. For Open items, current
                        // status is always undefined. We assume Open status since this is the general case.
                        item = createCertificationItem(undefined, undefined, CertificationItem.Status.Open);
                    });

                    // Note status Open and Returned are identical so we only test one of them here.

                    it('null button decisions returns empty list', function () {
                        var actions = certificationActionsFactoryService.createButtonActions(item, null);
                        expect(actions.length).toEqual(0);
                    });

                    it('empty button decisions returns empty list', function () {
                        var actions = certificationActionsFactoryService.createButtonActions(item, []);
                        expect(actions.length).toEqual(0);
                    });

                    it('two decisions returns two buttons', function () {
                        var decisions = [CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated],
                            actions = certificationActionsFactoryService.createButtonActions(item, decisions);
                        expect(actions.length).toEqual(2);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Approved);
                        expect(actions[0].promptKey).toEqual('cert_action_approve');
                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[1].promptKey).toEqual('cert_action_remediate');
                    });
                });

                describe('WaitingReview, createButtonActions(item, buttonDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API. Current status doesn't matter.
                        item = createCertificationItem(undefined, undefined, CertificationItem.Status.WaitingReview);
                    });

                    it('two decisions returns two buttons', function () {
                        var decisions = [CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated],
                            actions = certificationActionsFactoryService.createButtonActions(item, decisions);
                        expect(actions.length).toEqual(2);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Approved);
                        expect(actions[0].promptKey).toEqual('cert_accept_delegation_review');
                        expect(actions[0].delegationReviewAction).toEqual(CertificationActionStatus.DelegationAction.Accept);

                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[1].promptKey).toEqual('cert_action_remediate');
                        expect(actions[1].delegationReviewAction).toEqual(CertificationActionStatus.DelegationAction.Reject);
                    });
                });

                describe('Challenged, createButtonActions(item, buttonDecisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API. Current status doesn't matter.
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Remediated, CertificationItem.Status.Challenged);
                    });

                    it('two decisions returns two buttons', function () {
                        var decisions = [CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated],
                            actions = certificationActionsFactoryService.createButtonActions(item, decisions);
                        expect(actions.length).toEqual(2);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Approved);
                        expect(actions[0].promptKey).toEqual('cert_reject_challenge');
                        expect(actions[0].challengeAction).toEqual(CertificationActionStatus.DelegationAction.Reject);

                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[1].promptKey).toEqual('cert_action_remediate');
                        expect(actions[1].challengeAction).toEqual(CertificationActionStatus.DelegationAction.Accept);
                        expect(actions[1].oneStepChallenge).toEqual(true);
                    });

                    it('canChangeDecion false without requireChallengeDecision returns no decisions', function () {
                        item.canChangeDecision = false;
                        item.requiresChallengeDecision = false;
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                            decisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(decisions.length).toEqual(0);
                    });

                    it('canChangeDecision false with requiresChallengeDecision true returns normal challenge decisions', function () {
                        item.canChangeDecision = false;
                        item.requiresChallengeDecision = true;
                        var availableDecisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                            decisions = certificationActionsFactoryService.getButtonDecisions(item, availableDecisions);
                        expect(decisions.length).toEqual(2);
                    });
                });

                describe('Default status, createMenuItems(item, decisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API. . We assume WaitingReview
                        // status since this is the general case.
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Approved, CertificationItem.Status.WaitingReview);
                    });

                    it('null decisions returns empty list', function () {
                        var actions = certificationActionsFactoryService.createMenuItems(item, null);
                        expect(actions.length).toEqual(0);
                    });

                    it('empty decisions returns empty list', function () {
                        var actions = certificationActionsFactoryService.createMenuItems(item, new Set());
                        expect(actions.length).toEqual(0);
                    });

                    it('four decisions returns three actions minus current status', function () {
                        var decisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated]),
                            actions = certificationActionsFactoryService.createMenuItems(item, decisions);
                        expect(actions.length).toEqual(3);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[0].promptKey).toEqual('cert_action_remediate');
                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Mitigated);
                        expect(actions[1].promptKey).toEqual('cert_action_mitigate');
                        expect(actions[2].name).toEqual(CertificationActionStatus.Name.Delegated);
                        expect(actions[2].promptKey).toEqual('cert_action_delegate');
                    });
                });

                describe('Complete, createMenuItems(item, decisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API.
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Approved, CertificationItem.Status.Complete);
                    });

                    it('item not editable returns empty menu', function () {
                        item.canChangeDecision = false;
                        var decisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated]),
                            actions = certificationActionsFactoryService.createMenuItems(item, decisions);
                        expect(actions.length).toEqual(0);
                    });

                    it('four decisions returns four actions, minus current status plus Undo', function () {
                        var decisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated]),
                            actions = certificationActionsFactoryService.createMenuItems(item, decisions);
                        expect(actions.length).toEqual(4);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Cleared);
                        expect(actions[0].promptKey).toEqual('cert_action_undo');
                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[1].promptKey).toEqual('cert_action_remediate');
                        expect(actions[2].name).toEqual(CertificationActionStatus.Name.Mitigated);
                        expect(actions[2].promptKey).toEqual('cert_action_mitigate');
                        expect(actions[3].name).toEqual(CertificationActionStatus.Name.Delegated);
                        expect(actions[3].promptKey).toEqual('cert_action_delegate');
                    });
                });

                describe('Challenged, createMenuItems(item, decisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API.
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Approved, CertificationItem.Status.Challenged);
                    });

                    it('four decisions returns two actions, minus current status and delegate', function () {
                        var decisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated]),
                            actions = certificationActionsFactoryService.createMenuItems(item, decisions);
                        expect(actions.length).toEqual(2);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[0].promptKey).toEqual('cert_action_remediate');
                        expect(actions[0].challengeAction).toEqual(CertificationActionStatus.DelegationAction.Accept);
                        expect(actions[0].oneStepChallenge).toEqual(true);
                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Mitigated);
                        expect(actions[1].promptKey).toEqual('cert_action_mitigate');
                        expect(actions[1].challengeAction).toEqual(CertificationActionStatus.DelegationAction.Accept);
                        expect(actions[1].oneStepChallenge).toEqual(true);
                    });
                });

                describe('Delegated, createMenuItems(item, decisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API.
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Delegated, CertificationItem.Status.Delegated);
                    });

                    it('three decisions returns three actions, minus current status plus Undo', function () {
                        var decisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Delegated]),
                            actions = certificationActionsFactoryService.createMenuItems(item, decisions);
                        expect(actions.length).toEqual(3);
                        expect(actions[0].name).toEqual(CertificationActionStatus.Name.Cleared);
                        expect(actions[0].promptKey).toEqual('cert_action_undo');
                        expect(actions[1].name).toEqual(CertificationActionStatus.Name.Approved);
                        expect(actions[1].promptKey).toEqual('cert_action_approve');
                        expect(actions[2].name).toEqual(CertificationActionStatus.Name.Remediated);
                        expect(actions[2].promptKey).toEqual('cert_action_remediate');
                    });

                    it('item not editable returns empty menu', function () {
                        item.canChangeDecision = false;
                        var decisions = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Delegated]),
                            actions = certificationActionsFactoryService.createMenuItems(item, decisions);
                        expect(actions.length).toEqual(0);
                    });
                });

                describe('WaitingReview, createMenuItems(item, decisions)', function () {
                    var item = undefined;

                    beforeEach(function () {
                        // Available decisions don't matter here since we pass it in the tested API.
                        item = createCertificationItem(undefined, CertificationActionStatus.Name.Remediated, CertificationItem.Status.WaitingReview);
                        item.requiresReview = true;
                    });

                    it('challenge phase special case should return empty menu', function () {
                        item.canChangeDecision = false;
                        var availableDecisions = new Set([CertificationActionStatus.Name.Remediated]),
                            buttonDecisions = certificationActionsFactoryService.createMenuItems(item, availableDecisions);
                        expect(buttonDecisions.length).toEqual(0);
                    });
                });

                describe('popNextAvailableDecision(availableDecisions, excludedDecisions)', function () {
                    it('null available', function () {
                        var excluded = new Set([CertificationActionStatus.Name.Approved]),
                            popped = certificationActionsFactoryService.popNextAvailableDecision(null, excluded);
                        expect(popped).toBeNull();
                    });

                    it('empty available', function () {
                        var excluded = new Set([CertificationActionStatus.Name.Approved]),
                            popped = certificationActionsFactoryService.popNextAvailableDecision(new Set(), excluded);
                        expect(popped).toBeNull();
                    });

                    it('null excluded', function () {
                        var available = new Set([CertificationActionStatus.Name.Approved]),
                            popped = certificationActionsFactoryService.popNextAvailableDecision(available, null);
                        expect(popped).toEqual(CertificationActionStatus.Name.Approved);
                        popped = certificationActionsFactoryService.popNextAvailableDecision(available, null);
                        expect(popped).toBeNull();
                    });

                    it('empty excluded', function () {
                        var available = new Set([CertificationActionStatus.Name.Approved]),
                            excluded = new Set(),
                            popped = certificationActionsFactoryService.popNextAvailableDecision(available, excluded);
                        expect(popped).toEqual(CertificationActionStatus.Name.Approved);
                        popped = certificationActionsFactoryService.popNextAvailableDecision(available, excluded);
                        expect(popped).toBeNull();
                    });

                    it('verify list in canonical order and exclusions are exluded, verify pops', function () {
                        var available = new Set([CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Cleared, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Approved]),
                            excluded = new Set([CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Cleared]),
                            popped = certificationActionsFactoryService.popNextAvailableDecision(available, excluded);
                        expect(popped).toEqual(CertificationActionStatus.Name.Approved);
                        popped = certificationActionsFactoryService.popNextAvailableDecision(available, excluded);
                        expect(popped).toEqual(CertificationActionStatus.Name.Remediated);
                        popped = certificationActionsFactoryService.popNextAvailableDecision(available, excluded);
                        expect(popped).toEqual(CertificationActionStatus.Name.Mitigated);
                        popped = certificationActionsFactoryService.popNextAvailableDecision(available, excluded);
                        expect(popped).toBeNull();
                    });
                });

                describe('popNextAvailableOppositeDecision(originalStatus, availableDecisions)', function () {
                    it('null originalStatus', function () {
                        var available = new Set([CertificationActionStatus.Name.Approved]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(null, available);
                        expect(popped).toBeNull();
                    });

                    it('null available', function () {
                        var original = CertificationActionStatus.Name.Remediated,
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, null);
                        expect(popped).toBeNull();
                    });

                    it('empty available', function () {
                        var original = CertificationActionStatus.Name.Remediated,
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, new Set());
                        expect(popped).toBeNull();
                    });

                    it('approved becomes remediated which is available', function () {
                        var original = CertificationActionStatus.Name.Approved,
                            available = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toEqual(CertificationActionStatus.Name.Remediated);
                    });

                    it('approved but remediated not available', function () {
                        var original = CertificationActionStatus.Name.Approved,
                            available = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Cleared]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toBeNull();
                    });

                    it('mitigated becomes remediated which is available', function () {
                        var original = CertificationActionStatus.Name.Mitigated,
                            available = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toEqual(CertificationActionStatus.Name.Remediated);
                    });

                    it('mitigated but remediated not available', function () {
                        var original = CertificationActionStatus.Name.Mitigated,
                            available = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Cleared]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toBeNull();
                    });

                    it('remediated becomes approved if its available', function () {
                        var original = CertificationActionStatus.Name.Remediated,
                            available = new Set([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Cleared]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toEqual(CertificationActionStatus.Name.Approved);
                    });

                    it('remediated becomes mitigated if approved not available', function () {
                        var original = CertificationActionStatus.Name.Remediated,
                            available = new Set([CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Cleared]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toEqual(CertificationActionStatus.Name.Mitigated);
                    });

                    it('remediated but no valid opposite available', function () {
                        var original = CertificationActionStatus.Name.Remediated,
                            available = new Set([CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Cleared]),
                            popped = certificationActionsFactoryService.popNextAvailableOppositeDecision(original, available);
                        expect(popped).toBeNull();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsdUJBQXVCLFVBQVUsU0FBUzs7SUFFdkg7O0lBRUEsSUFBSSxxQkFBcUI7SUFDekIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFON0IsU0FBUyxzQ0FBc0MsWUFBVztnQkFDdEQsSUFBSSw0QkFBeUI7b0JBQUUsb0JBQWlCO29CQUFFLDhCQUEyQjtvQkFBRSxxQ0FBa0M7b0JBQzdHLGVBQVk7O2dCQUVoQixXQUFXLE9BQU8scUJBQXFCOztnQkFFdkMsV0FBVyxPQUFPLFVBQVMsdUJBQXVCLHFCQUFxQiw2QkFDNUMsK0JBQStCLHNDQUMvQiw0QkFBNEI7b0JBQ25ELDRCQUE0QjtvQkFDNUIsb0JBQW9CO29CQUNwQiw0QkFBNEI7b0JBQzVCLDhCQUE4QjtvQkFDOUIscUNBQXFDOztvQkFFckMsZUFBZTtvQkFDZixNQUFNLDRCQUE0QiwyQkFBMkIsSUFBSSxTQUFTLFlBQUE7d0JBVTFELE9BVmdFOzs7O2dCQUdwRixTQUFTLHdCQUF3QixVQUFVLGVBQWUsZUFBZSxZQUFZO29CQUNqRixJQUFJLGlCQUFpQixJQUFJLDRCQUE0QjtvQkFDckQsSUFBSSxVQUFVO3dCQUNWLFNBQVMsUUFBUSxVQUFDLFFBQU07NEJBWVIsT0FaYSxlQUFlLFVBQVUsS0FBSyxJQUFJLDBCQUEwQjtnQ0FDckYsUUFBUTtnQ0FDUixXQUFXO2dDQUNYLE1BQU07Ozs7O29CQUlkLElBQUksZUFBZTt3QkFDZixlQUFlLGVBQWUsSUFBSSwwQkFBMEI7NEJBQ3hELFFBQVE7NEJBQ1IsV0FBVzs0QkFDWCxNQUFN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V0FDL0IsMEJBQTBCLEtBQUs7NEJBQ25DLFNBQVMsbUNBQW1DLGlDQUFpQyxVQUFVO3dCQUMzRixPQUFPLFFBQVEsUUFBUSwwQkFBMEIsS0FBSzs7O29CQUcxRCxHQUFHLDBEQUEwRCxZQUFNO3dCQUMvRCxJQUFJLFdBQVcsMEJBQTBCLEtBQUs7NEJBQzFDLFlBQVksSUFBSSxJQUFJLENBQUMsMEJBQTBCLEtBQUssV0FDaEQsMEJBQTBCLEtBQUs7NEJBQ25DLFNBQVMsbUNBQW1DLGlDQUFpQyxVQUFVO3dCQUMzRixPQUFPLFFBQVEsUUFBUSwwQkFBMEIsS0FBSzs7O29CQUcxRCxHQUFHLDhDQUE4QyxZQUFNO3dCQUNuRCxJQUFJLFdBQVcsMEJBQTBCLEtBQUs7NEJBQzFDLFlBQVksSUFBSSxJQUFJLENBQUMsMEJBQTBCLEtBQUssV0FDaEQsMEJBQTBCLEtBQUs7NEJBQ25DLFNBQVMsbUNBQW1DLGlDQUFpQyxVQUFVO3dCQUMzRixPQUFPLFFBQVE7Ozs7OztHQTdFeEIiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgbGV0IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMsIENlcnRpZmljYXRpb25JdGVtLCBDZXJ0aWZpY2F0aW9uRGVjaXNpb25TdGF0dXMsIGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UsXG4gICAgICAgIGNlcnRFZGl0YWJsZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUsIHRlc3RNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKGNlcnRpZmljYXRpb25UZXN0RGF0YSwgX0NlcnRpZmljYXRpb25JdGVtXywgX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9DZXJ0aWZpY2F0aW9uRGVjaXNpb25TdGF0dXNfLCBfY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV8pIHtcbiAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyA9IF9DZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0gPSBfQ2VydGlmaWNhdGlvbkl0ZW1fO1xuICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzID0gX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfO1xuICAgICAgICBDZXJ0aWZpY2F0aW9uRGVjaXNpb25TdGF0dXMgPSBfQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RhdHVzXztcbiAgICAgICAgY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlXztcblxuICAgICAgICBjZXJ0RWRpdGFibGUgPSB0cnVlO1xuICAgICAgICBzcHlPbihfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXywgJ2lzQ2VydGlmaWNhdGlvbkVkaXRhYmxlJykuYW5kLmNhbGxGYWtlKCgpID0+IGNlcnRFZGl0YWJsZSk7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oc3RhdHVzZXMsIGRlY2lzaW9uU3RhdGUsIHN1bW1hcnlTdGF0dXMsIHBvbGljeVR5cGUpIHtcbiAgICAgICAgbGV0IGRlY2lzaW9uU3RhdHVzID0gbmV3IENlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1cyh7fSk7XG4gICAgICAgIGlmIChzdGF0dXNlcykge1xuICAgICAgICAgICAgc3RhdHVzZXMuZm9yRWFjaCgoc3RhdHVzKSA9PiBkZWNpc2lvblN0YXR1cy5kZWNpc2lvbnMucHVzaChuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgcHJvbXB0S2V5OiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbmFtZTogc3RhdHVzXG4gICAgICAgICAgICB9KSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlY2lzaW9uU3RhdGUpIHtcbiAgICAgICAgICAgIGRlY2lzaW9uU3RhdHVzLmN1cnJlbnRTdGF0ZSA9IG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IGRlY2lzaW9uU3RhdGUsXG4gICAgICAgICAgICAgICAgcHJvbXB0S2V5OiBkZWNpc2lvblN0YXRlLFxuICAgICAgICAgICAgICAgIG5hbWU6IGRlY2lzaW9uU3RhdGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XG4gICAgICAgICAgICBpZDogJzEyMzQnLFxuICAgICAgICAgICAgZGVjaXNpb25TdGF0dXM6IGRlY2lzaW9uU3RhdHVzLFxuICAgICAgICAgICAgcG9saWN5VHlwZTogcG9saWN5VHlwZSxcbiAgICAgICAgICAgIHN1bW1hcnlTdGF0dXM6IHN1bW1hcnlTdGF0dXMgPyBzdW1tYXJ5U3RhdHVzIDogQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLk9wZW4sXG4gICAgICAgICAgICByb2xlTmFtZTogJ1JvbGUxJyxcbiAgICAgICAgICAgIGNhbkNoYW5nZURlY2lzaW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlc2NyaWJlKCdnZXRDZXJ0aWZpY2F0aW9uQWN0aW9ucyhpdGVtKScsICgpID0+IHtcbiAgICAgICAgaXQoJ251bGwgaXRlbSB0aHJvd3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25BY3Rpb25zKG51bGwpO1xuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXRlbSB3aXRoIGVtcHR5IGRlY2lzaW9ucyBkb2VzIG5vdCBmYWlsJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbXSxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLk9wZW5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkFjdGlvbnMoaXRlbSk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucykudG9CZVRydXRoeSgpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMuZ2V0QnV0dG9uQWN0aW9ucygpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zLmdldE1lbnVBY3Rpb25zKCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXRlbSB3aXRoIGZsZXNoZWQtb3V0IGRlY2lzaW9ucyBnaXZlcyB0d28gYnV0dG9ucyBhbmQgc29tZSBtZW51cycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWRdLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuT3BlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBhY3Rpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uQWN0aW9ucyhpdGVtKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucy5nZXRCdXR0b25BY3Rpb25zKCkubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMuZ2V0TWVudUFjdGlvbnMoKS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdleGNsdWRlcyB1bnN1cHBvcnRlZCBvcGVyYXRpb25zJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVBY2NvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1vZGlmaWVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFjY291bnRSZWFzc2lnbl0sXG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLk9wZW4pLFxuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmdldENlcnRpZmljYXRpb25BY3Rpb25zKGl0ZW0pO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMuZ2V0QnV0dG9uQWN0aW9ucygpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zLmdldE1lbnVBY3Rpb25zKCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTdGF0dXMgT3BlbiwgZ2V0QnV0dG9uRGVjaXNpb25zKGl0ZW0sIGF2YWlsYWJsZURlY2lzaW9ucyknLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtIDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEF2YWlsYWJsZSBkZWNpc2lvbnMgZG9uJ3QgbWF0dGVyIGhlcmUgc2luY2Ugd2UgcGFzcyBpdCBpbiB0aGUgdGVzdGVkIEFQSS4gRm9yIE9wZW4gaXRlbXMsIGN1cnJlbnRcbiAgICAgICAgICAgIC8vIHN0YXR1cyBpcyBhbHdheXMgdW5kZWZpbmVkLlxuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLk9wZW5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5vdGUgc3RhdHVzIE9wZW4gYW5kIFJldHVybmVkIGFyZSBpZGVudGljYWwgc28gd2Ugb25seSB0ZXN0IG9uZSBvZiB0aGVtIGhlcmUuXG5cbiAgICAgICAgaXQoJ25vIGF2YWlsYWJsZSBkZWNpc2lvbnMgc2hvdWxkIHJldHVybiBlbXB0eSBidXR0b24gZGVjaXNpb25zJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkRlY2lzaW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuZ2V0QnV0dG9uRGVjaXNpb25zKGl0ZW0sIG5ldyBTZXQoKSk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2F2YWlsYWJsZSBub24tYnV0dG9uLXdvcnRoeSBkZWNpc2lvbnMgc2hvdWxkIHJldHVybiBlbXB0eSBidXR0b24gZGVjaXNpb25zJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZURlY2lzaW9ucyA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFja25vd2xlZGdlZFxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnb25lIGF2YWlsYWJsZSBkZWNpc2lvbiBzaG91bGQgcmV0dXJuIG9uZSBidXR0b24gZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlRGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGJ1dHRvbkRlY2lzaW9uc1swXSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbW9yZSB0aGFuIHR3byBhdmFpbGFibGUgZGVjaXNpb25zIHNob3VsZCByZXR1cm4gdHdvIGJ1dHRvbiBkZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlRGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZF0pLFxuICAgICAgICAgICAgICAgIGJ1dHRvbkRlY2lzaW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuZ2V0QnV0dG9uRGVjaXNpb25zKGl0ZW0sIGF2YWlsYWJsZURlY2lzaW9ucyk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnNbMF0pLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnNbMV0pLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTdGF0dXMgRGVsZWdhdGVkLCBnZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKScsICgpID0+IHtcbiAgICAgICAgbGV0IGl0ZW0gO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgLy8gQXZhaWxhYmxlIGRlY2lzaW9ucyBhbmQgY3VycmVudCBzdGF0dXMgZG9uJ3QgbWF0dGVyIGhlcmUuXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0odW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuRGVsZWdhdGVkXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBidXR0b24gZGVjaXNpb25zJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZURlY2lzaW9ucyA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZF0pLFxuICAgICAgICAgICAgICAgIGJ1dHRvbkRlY2lzaW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuZ2V0QnV0dG9uRGVjaXNpb25zKGl0ZW0sIGF2YWlsYWJsZURlY2lzaW9ucyk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnU3RhdHVzIENvbXBsZXRlLCBnZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKScsICgpID0+IHtcbiAgICAgICAgbGV0IGl0ZW0gO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgLy8gQXZhaWxhYmxlIGRlY2lzaW9ucyBhbmQgY3VycmVudCBzdGF0dXMgZG9uJ3QgbWF0dGVyIGhlcmUuXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0odW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ29tcGxldGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGJ1dHRvbiBkZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlRGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTdGF0dXMgUmV0dXJuZWQsIGdldEJ1dHRvbkRlY2lzaW9ucyhpdGVtLCBhdmFpbGFibGVEZWNpc2lvbnMpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSA7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBBdmFpbGFibGUgZGVjaXNpb25zIGFuZCBjdXJyZW50IHN0YXR1cyBkb24ndCBtYXR0ZXIgaGVyZS5cbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbSh1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5SZXR1cm5lZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYnV0dG9uIGRlY2lzaW9ucyBpZiBjZXJ0IG5vdCBlZGl0YWJsZScsICgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0uY2FuQ2hhbmdlRGVjaXNpb24gPSBmYWxzZTtcblxuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZURlY2lzaW9ucyA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZF0pLFxuICAgICAgICAgICAgICAgIGJ1dHRvbkRlY2lzaW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuZ2V0QnV0dG9uRGVjaXNpb25zKGl0ZW0sIGF2YWlsYWJsZURlY2lzaW9ucyk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnU3RhdHVzIFdhaXRpbmdSZXZpZXcsIGdldEJ1dHRvbkRlY2lzaW9ucyhpdGVtLCBhdmFpbGFibGVEZWNpc2lvbnMpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSA7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBBdmFpbGFibGUgZGVjaXNpb25zIGRvbid0IG1hdHRlciBoZXJlIHNpbmNlIHdlIHBhc3MgaXQgaW4gdGhlIHRlc3RlZCBBUEkuIC5cbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbSh1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLldhaXRpbmdSZXZpZXdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpdGVtLnJlcXVpcmVzUmV2aWV3ID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTm90ZSBXYWl0aW5nUmV2aWV3IGFuZCBDaGFsbGVuZ2VkIGFyZSBpZGVudGljYWwgc28gd2Ugb25seSB0ZXN0IG9uZSBvZiB0aGVtIGhlcmUuXG5cbiAgICAgICAgaXQoJ25vIGF2YWlsYWJsZSBkZWNpc2lvbnMgc2hvdWxkIHJldHVybiBlbXB0eSBidXR0b24gZGVjaXNpb25zJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkRlY2lzaW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuZ2V0QnV0dG9uRGVjaXNpb25zKGl0ZW0sIG5ldyBTZXQoKSk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2N1cnJlbnQgc3RhdGUgbm90IGF2YWlsYWJsZSBzaG91bGQgcmV0dXJuIG9uZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlRGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGJ1dHRvbkRlY2lzaW9uc1swXSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnb3Bwb3NpdGUgaXMgbm90IGF2YWlsYWJsZSBzaG91bGQgcmV0dXJuIG9uZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlRGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdKSxcbiAgICAgICAgICAgICAgICBidXR0b25EZWNpc2lvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmdldEJ1dHRvbkRlY2lzaW9ucyhpdGVtLCBhdmFpbGFibGVEZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KGJ1dHRvbkRlY2lzaW9ucy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zWzBdKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NoYWxsZW5nZSBwaGFzZSBzcGVjaWFsIGNhc2Ugc2hvdWxkIHJldHVybiBvbmUgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgICAgICAgaXRlbS5jYW5DaGFuZ2VEZWNpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZURlY2lzaW9ucyA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGJ1dHRvbkRlY2lzaW9uc1swXSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzdGFuZGFyZCB0d28gYnV0dG9ucycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhdmFpbGFibGVEZWNpc2lvbnMgPSBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgc3RhdHVzLCBhbmQgaXRzIG9wcG9zaXRlLlxuICAgICAgICAgICAgZXhwZWN0KGJ1dHRvbkRlY2lzaW9uc1swXSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYnV0dG9uRGVjaXNpb25zWzFdKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnRGVmYXVsdCBzdGF0dXMsIGNyZWF0ZUJ1dHRvbkFjdGlvbnMoaXRlbSwgYnV0dG9uRGVjaXNpb25zKScsICgpID0+IHtcbiAgICAgICAgbGV0IGl0ZW0gO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgLy8gQXZhaWxhYmxlIGRlY2lzaW9ucyBkb24ndCBtYXR0ZXIgaGVyZSBzaW5jZSB3ZSBwYXNzIGl0IGluIHRoZSB0ZXN0ZWQgQVBJLiBGb3IgT3BlbiBpdGVtcywgY3VycmVudFxuICAgICAgICAgICAgLy8gc3RhdHVzIGlzIGFsd2F5cyB1bmRlZmluZWQuIFdlIGFzc3VtZSBPcGVuIHN0YXR1cyBzaW5jZSB0aGlzIGlzIHRoZSBnZW5lcmFsIGNhc2UuXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0odW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuT3BlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTm90ZSBzdGF0dXMgT3BlbiBhbmQgUmV0dXJuZWQgYXJlIGlkZW50aWNhbCBzbyB3ZSBvbmx5IHRlc3Qgb25lIG9mIHRoZW0gaGVyZS5cblxuICAgICAgICBpdCgnbnVsbCBidXR0b24gZGVjaXNpb25zIHJldHVybnMgZW1wdHkgbGlzdCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhY3Rpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5jcmVhdGVCdXR0b25BY3Rpb25zKGl0ZW0sIG51bGwpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZW1wdHkgYnV0dG9uIGRlY2lzaW9ucyByZXR1cm5zIGVtcHR5IGxpc3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlQnV0dG9uQWN0aW9ucyhpdGVtLCBbXSk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0d28gZGVjaXNpb25zIHJldHVybnMgdHdvIGJ1dHRvbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmNyZWF0ZUJ1dHRvbkFjdGlvbnMoaXRlbSwgZGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzBdLm5hbWUpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzBdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fYXBwcm92ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1sxXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3JlbWVkaWF0ZScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXYWl0aW5nUmV2aWV3LCBjcmVhdGVCdXR0b25BY3Rpb25zKGl0ZW0sIGJ1dHRvbkRlY2lzaW9ucyknLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtIDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEF2YWlsYWJsZSBkZWNpc2lvbnMgZG9uJ3QgbWF0dGVyIGhlcmUgc2luY2Ugd2UgcGFzcyBpdCBpbiB0aGUgdGVzdGVkIEFQSS4gQ3VycmVudCBzdGF0dXMgZG9lc24ndCBtYXR0ZXIuXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0odW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuV2FpdGluZ1Jldmlld1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3R3byBkZWNpc2lvbnMgcmV0dXJucyB0d28gYnV0dG9ucycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbnMgPSBbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZF0sXG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlQnV0dG9uQWN0aW9ucyhpdGVtLCBkZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMF0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMF0ucHJvbXB0S2V5KS50b0VxdWFsKCdjZXJ0X2FjY2VwdF9kZWxlZ2F0aW9uX3JldmlldycpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMF0uZGVsZWdhdGlvblJldmlld0FjdGlvbikudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLkRlbGVnYXRpb25BY3Rpb24uQWNjZXB0KTtcblxuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1sxXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3JlbWVkaWF0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0uZGVsZWdhdGlvblJldmlld0FjdGlvbikudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLkRlbGVnYXRpb25BY3Rpb24uUmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnQ2hhbGxlbmdlZCwgY3JlYXRlQnV0dG9uQWN0aW9ucyhpdGVtLCBidXR0b25EZWNpc2lvbnMpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSA7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBBdmFpbGFibGUgZGVjaXNpb25zIGRvbid0IG1hdHRlciBoZXJlIHNpbmNlIHdlIHBhc3MgaXQgaW4gdGhlIHRlc3RlZCBBUEkuIEN1cnJlbnQgc3RhdHVzIGRvZXNuJ3QgbWF0dGVyLlxuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ2hhbGxlbmdlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3R3byBkZWNpc2lvbnMgcmV0dXJucyB0d28gYnV0dG9ucycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbnMgPSBbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZF0sXG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlQnV0dG9uQWN0aW9ucyhpdGVtLCBkZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMF0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMF0ucHJvbXB0S2V5KS50b0VxdWFsKCdjZXJ0X3JlamVjdF9jaGFsbGVuZ2UnKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzBdLmNoYWxsZW5nZUFjdGlvbikudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLkRlbGVnYXRpb25BY3Rpb24uUmVqZWN0KTtcblxuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1sxXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3JlbWVkaWF0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0uY2hhbGxlbmdlQWN0aW9uKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuRGVsZWdhdGlvbkFjdGlvbi5BY2NlcHQpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ub25lU3RlcENoYWxsZW5nZSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbkNoYW5nZURlY2lvbiBmYWxzZSB3aXRob3V0IHJlcXVpcmVDaGFsbGVuZ2VEZWNpc2lvbiByZXR1cm5zIG5vIGRlY2lzaW9ucycsICgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0uY2FuQ2hhbmdlRGVjaXNpb24gPSBmYWxzZTtcbiAgICAgICAgICAgIGl0ZW0ucmVxdWlyZXNDaGFsbGVuZ2VEZWNpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZURlY2lzaW9ucyA9XG4gICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdKSxcbiAgICAgICAgICAgICAgICBkZWNpc2lvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmdldEJ1dHRvbkRlY2lzaW9ucyhpdGVtLCBhdmFpbGFibGVEZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9ucy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW5DaGFuZ2VEZWNpc2lvbiBmYWxzZSB3aXRoIHJlcXVpcmVzQ2hhbGxlbmdlRGVjaXNpb24gdHJ1ZSByZXR1cm5zIG5vcm1hbCBjaGFsbGVuZ2UgZGVjaXNpb25zJywgKCkgPT4ge1xuICAgICAgICAgICAgaXRlbS5jYW5DaGFuZ2VEZWNpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgaXRlbS5yZXF1aXJlc0NoYWxsZW5nZURlY2lzaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBhdmFpbGFibGVEZWNpc2lvbnMgPVxuICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkXSksXG4gICAgICAgICAgICAgICAgZGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRCdXR0b25EZWNpc2lvbnMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdEZWZhdWx0IHN0YXR1cywgY3JlYXRlTWVudUl0ZW1zKGl0ZW0sIGRlY2lzaW9ucyknLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtIDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEF2YWlsYWJsZSBkZWNpc2lvbnMgZG9uJ3QgbWF0dGVyIGhlcmUgc2luY2Ugd2UgcGFzcyBpdCBpbiB0aGUgdGVzdGVkIEFQSS4gLiBXZSBhc3N1bWUgV2FpdGluZ1Jldmlld1xuICAgICAgICAgICAgLy8gc3RhdHVzIHNpbmNlIHRoaXMgaXMgdGhlIGdlbmVyYWwgY2FzZS5cbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbSh1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5XYWl0aW5nUmV2aWV3XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbnVsbCBkZWNpc2lvbnMgcmV0dXJucyBlbXB0eSBsaXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGFjdGlvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmNyZWF0ZU1lbnVJdGVtcyhpdGVtLCBudWxsKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2VtcHR5IGRlY2lzaW9ucyByZXR1cm5zIGVtcHR5IGxpc3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlTWVudUl0ZW1zKGl0ZW0sIG5ldyBTZXQoKSk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdmb3VyIGRlY2lzaW9ucyByZXR1cm5zIHRocmVlIGFjdGlvbnMgbWludXMgY3VycmVudCBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkXSksXG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlTWVudUl0ZW1zKGl0ZW0sIGRlY2lzaW9ucyk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1swXS5uYW1lKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzBdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fcmVtZWRpYXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1sxXS5uYW1lKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ucHJvbXB0S2V5KS50b0VxdWFsKCdjZXJ0X2FjdGlvbl9taXRpZ2F0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMl0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzJdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fZGVsZWdhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnQ29tcGxldGUsIGNyZWF0ZU1lbnVJdGVtcyhpdGVtLCBkZWNpc2lvbnMpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSA7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBBdmFpbGFibGUgZGVjaXNpb25zIGRvbid0IG1hdHRlciBoZXJlIHNpbmNlIHdlIHBhc3MgaXQgaW4gdGhlIHRlc3RlZCBBUEkuXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0odW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ29tcGxldGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdpdGVtIG5vdCBlZGl0YWJsZSByZXR1cm5zIGVtcHR5IG1lbnUnLCAoKSA9PiB7XG4gICAgICAgICAgICBpdGVtLmNhbkNoYW5nZURlY2lzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1pdGlnYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZF0pLFxuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmNyZWF0ZU1lbnVJdGVtcyhpdGVtLCBkZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZm91ciBkZWNpc2lvbnMgcmV0dXJucyBmb3VyIGFjdGlvbnMsIG1pbnVzIGN1cnJlbnQgc3RhdHVzIHBsdXMgVW5kbycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbnMgPSBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkXSksXG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlTWVudUl0ZW1zKGl0ZW0sIGRlY2lzaW9ucyk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoNCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1swXS5uYW1lKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzBdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fdW5kbycpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1sxXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3JlbWVkaWF0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMl0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzJdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fbWl0aWdhdGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzNdLm5hbWUpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1szXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX2RlbGVnYXRlJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0NoYWxsZW5nZWQsIGNyZWF0ZU1lbnVJdGVtcyhpdGVtLCBkZWNpc2lvbnMpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSA7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBBdmFpbGFibGUgZGVjaXNpb25zIGRvbid0IG1hdHRlciBoZXJlIHNpbmNlIHdlIHBhc3MgaXQgaW4gdGhlIHRlc3RlZCBBUEkuXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0odW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ2hhbGxlbmdlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZvdXIgZGVjaXNpb25zIHJldHVybnMgdHdvIGFjdGlvbnMsIG1pbnVzIGN1cnJlbnQgc3RhdHVzIGFuZCBkZWxlZ2F0ZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbnMgPSBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkXSksXG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UuY3JlYXRlTWVudUl0ZW1zKGl0ZW0sIGRlY2lzaW9ucyk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1swXS5uYW1lKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzBdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fcmVtZWRpYXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1swXS5jaGFsbGVuZ2VBY3Rpb24pLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5EZWxlZ2F0aW9uQWN0aW9uLkFjY2VwdCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1swXS5vbmVTdGVwQ2hhbGxlbmdlKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMV0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzFdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fbWl0aWdhdGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzFdLmNoYWxsZW5nZUFjdGlvbikudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLkRlbGVnYXRpb25BY3Rpb24uQWNjZXB0KTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzFdLm9uZVN0ZXBDaGFsbGVuZ2UpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBkZXNjcmliZSgnRGVsZWdhdGVkLCBjcmVhdGVNZW51SXRlbXMoaXRlbSwgZGVjaXNpb25zKScsICgpID0+IHtcbiAgICAgICAgbGV0IGl0ZW0gO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgLy8gQXZhaWxhYmxlIGRlY2lzaW9ucyBkb24ndCBtYXR0ZXIgaGVyZSBzaW5jZSB3ZSBwYXNzIGl0IGluIHRoZSB0ZXN0ZWQgQVBJLlxuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5EZWxlZ2F0ZWRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aHJlZSBkZWNpc2lvbnMgcmV0dXJucyB0aHJlZSBhY3Rpb25zLCBtaW51cyBjdXJyZW50IHN0YXR1cyBwbHVzIFVuZG8nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb25zID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZF0pLFxuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLmNyZWF0ZU1lbnVJdGVtcyhpdGVtLCBkZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMF0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQ2xlYXJlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1swXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3VuZG8nKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzFdLm5hbWUpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zWzFdLnByb21wdEtleSkudG9FcXVhbCgnY2VydF9hY3Rpb25fYXBwcm92ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbnNbMl0ubmFtZSkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0aW9uc1syXS5wcm9tcHRLZXkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3JlbWVkaWF0ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXRlbSBub3QgZWRpdGFibGUgcmV0dXJucyBlbXB0eSBtZW51JywgKCkgPT4ge1xuICAgICAgICAgICAgaXRlbS5jYW5DaGFuZ2VEZWNpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGRlY2lzaW9ucyA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWRdKSxcbiAgICAgICAgICAgICAgICBhY3Rpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5jcmVhdGVNZW51SXRlbXMoaXRlbSwgZGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChhY3Rpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnV2FpdGluZ1JldmlldywgY3JlYXRlTWVudUl0ZW1zKGl0ZW0sIGRlY2lzaW9ucyknLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtIDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEF2YWlsYWJsZSBkZWNpc2lvbnMgZG9uJ3QgbWF0dGVyIGhlcmUgc2luY2Ugd2UgcGFzcyBpdCBpbiB0aGUgdGVzdGVkIEFQSS5cbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbSh1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLldhaXRpbmdSZXZpZXdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpdGVtLnJlcXVpcmVzUmV2aWV3ID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NoYWxsZW5nZSBwaGFzZSBzcGVjaWFsIGNhc2Ugc2hvdWxkIHJldHVybiBlbXB0eSBtZW51JywgKCkgPT4ge1xuICAgICAgICAgICAgaXRlbS5jYW5DaGFuZ2VEZWNpc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZURlY2lzaW9ucyA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkXSksXG4gICAgICAgICAgICAgICAgYnV0dG9uRGVjaXNpb25zID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5jcmVhdGVNZW51SXRlbXMoaXRlbSwgYXZhaWxhYmxlRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b25EZWNpc2lvbnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3BvcE5leHRBdmFpbGFibGVEZWNpc2lvbihhdmFpbGFibGVEZWNpc2lvbnMsIGV4Y2x1ZGVkRGVjaXNpb25zKScsICgpID0+IHtcbiAgICAgICAgaXQoJ251bGwgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGV4Y2x1ZGVkID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlRGVjaXNpb24obnVsbCwgZXhjbHVkZWQpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2VtcHR5IGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBleGNsdWRlZCA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZF0pLFxuICAgICAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZURlY2lzaW9uKG5ldyBTZXQoKSwgZXhjbHVkZWQpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ251bGwgZXhjbHVkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlRGVjaXNpb24oYXZhaWxhYmxlLCBudWxsKTtcbiAgICAgICAgICAgIGV4cGVjdChwb3BwZWQpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZURlY2lzaW9uKGF2YWlsYWJsZSwgbnVsbCk7XG4gICAgICAgICAgICBleHBlY3QocG9wcGVkKS50b0JlTnVsbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZW1wdHkgZXhjbHVkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgZXhjbHVkZWQgPSBuZXcgU2V0KCksXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlRGVjaXNpb24oYXZhaWxhYmxlLCBleGNsdWRlZCk7XG4gICAgICAgICAgICBleHBlY3QocG9wcGVkKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCk7XG4gICAgICAgICAgICBwb3BwZWQgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLnBvcE5leHRBdmFpbGFibGVEZWNpc2lvbihhdmFpbGFibGUsIGV4Y2x1ZGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChwb3BwZWQpLnRvQmVOdWxsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd2ZXJpZnkgbGlzdCBpbiBjYW5vbmljYWwgb3JkZXIgYW5kIGV4Y2x1c2lvbnMgYXJlIGV4bHVkZWQsIHZlcmlmeSBwb3BzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZSA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgZXhjbHVkZWQgPSBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQ2xlYXJlZF0pLFxuICAgICAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZURlY2lzaW9uKGF2YWlsYWJsZSwgZXhjbHVkZWQpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xuICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlRGVjaXNpb24oYXZhaWxhYmxlLCBleGNsdWRlZCk7XG4gICAgICAgICAgICBleHBlY3QocG9wcGVkKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcbiAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZURlY2lzaW9uKGF2YWlsYWJsZSwgZXhjbHVkZWQpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcbiAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZURlY2lzaW9uKGF2YWlsYWJsZSwgZXhjbHVkZWQpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGRlc2NyaWJlKCdwb3BOZXh0QXZhaWxhYmxlT3Bwb3NpdGVEZWNpc2lvbihvcmlnaW5hbFN0YXR1cywgYXZhaWxhYmxlRGVjaXNpb25zKScsICgpID0+IHtcbiAgICAgICAgaXQoJ251bGwgb3JpZ2luYWxTdGF0dXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXZhaWxhYmxlID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlT3Bwb3NpdGVEZWNpc2lvbihudWxsLCBhdmFpbGFibGUpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ251bGwgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlT3Bwb3NpdGVEZWNpc2lvbihvcmlnaW5hbCwgbnVsbCk7XG4gICAgICAgICAgICBleHBlY3QocG9wcGVkKS50b0JlTnVsbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZW1wdHkgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlT3Bwb3NpdGVEZWNpc2lvbihvcmlnaW5hbCwgbmV3IFNldCgpKTtcbiAgICAgICAgICAgIGV4cGVjdChwb3BwZWQpLnRvQmVOdWxsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhcHByb3ZlZCBiZWNvbWVzIHJlbWVkaWF0ZWQgd2hpY2ggaXMgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZSA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdKSxcbiAgICAgICAgICAgICAgICBwb3BwZWQgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLnBvcE5leHRBdmFpbGFibGVPcHBvc2l0ZURlY2lzaW9uKG9yaWdpbmFsLCBhdmFpbGFibGUpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhcHByb3ZlZCBidXQgcmVtZWRpYXRlZCBub3QgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZSA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkNsZWFyZWRdKSxcbiAgICAgICAgICAgICAgICBwb3BwZWQgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLnBvcE5leHRBdmFpbGFibGVPcHBvc2l0ZURlY2lzaW9uKG9yaWdpbmFsLCBhdmFpbGFibGUpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ21pdGlnYXRlZCBiZWNvbWVzIHJlbWVkaWF0ZWQgd2hpY2ggaXMgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1pdGlnYXRlZCxcbiAgICAgICAgICAgICAgICBhdmFpbGFibGUgPSBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkXSksXG4gICAgICAgICAgICAgICAgcG9wcGVkID0gY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5wb3BOZXh0QXZhaWxhYmxlT3Bwb3NpdGVEZWNpc2lvbihvcmlnaW5hbCwgYXZhaWxhYmxlKTtcbiAgICAgICAgICAgIGV4cGVjdChwb3BwZWQpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbWl0aWdhdGVkIGJ1dCByZW1lZGlhdGVkIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgb3JpZ2luYWwgPSBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZSA9IG5ldyBTZXQoW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkNsZWFyZWRdKSxcbiAgICAgICAgICAgICAgICBwb3BwZWQgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLnBvcE5leHRBdmFpbGFibGVPcHBvc2l0ZURlY2lzaW9uKG9yaWdpbmFsLCBhdmFpbGFibGUpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlbWVkaWF0ZWQgYmVjb21lcyBhcHByb3ZlZCBpZiBpdHMgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQ2xlYXJlZF0pLFxuICAgICAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZU9wcG9zaXRlRGVjaXNpb24ob3JpZ2luYWwsIGF2YWlsYWJsZSk7XG4gICAgICAgICAgICBleHBlY3QocG9wcGVkKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1lZGlhdGVkIGJlY29tZXMgbWl0aWdhdGVkIGlmIGFwcHJvdmVkIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgb3JpZ2luYWwgPSBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICBhdmFpbGFibGUgPSBuZXcgU2V0KFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQ2xlYXJlZF0pLFxuICAgICAgICAgICAgICAgIHBvcHBlZCA9IGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UucG9wTmV4dEF2YWlsYWJsZU9wcG9zaXRlRGVjaXNpb24ob3JpZ2luYWwsIGF2YWlsYWJsZSk7XG4gICAgICAgICAgICBleHBlY3QocG9wcGVkKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVtZWRpYXRlZCBidXQgbm8gdmFsaWQgb3Bwb3NpdGUgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlID0gbmV3IFNldChbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkNsZWFyZWRdKSxcbiAgICAgICAgICAgICAgICBwb3BwZWQgPSBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLnBvcE5leHRBdmFpbGFibGVPcHBvc2l0ZURlY2lzaW9uKG9yaWdpbmFsLCBhdmFpbGFibGUpO1xuICAgICAgICAgICAgZXhwZWN0KHBvcHBlZCkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
