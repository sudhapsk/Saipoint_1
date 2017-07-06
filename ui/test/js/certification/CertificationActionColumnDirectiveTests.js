System.register(['certification/CertificationModule', 'test/js/TestInitializer', 'test/js/TestModule', 'test/js/common/i18n/MockTranslateFilter'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_testJsCommonI18nMockTranslateFilter) {}],
        execute: function () {

            /* jshint maxstatements: 48 */
            describe('spCertificationActionColumn', function () {

                var elementDefinition = '<sp-certification-action-column sp-model="item" />',
                    CertificationItem = undefined,
                    $scope = undefined,
                    $compile = undefined,
                    $controller = undefined,
                    $q = undefined,
                    certificationDataService = undefined,
                    certificationItemService = undefined,
                    certificationService = undefined,
                    testService = undefined,
                    commentService = undefined,
                    CertificationActionStatus = undefined,
                    CertificationConfig = undefined,
                    spTranslateFilter = undefined,
                    CertificationDecisionStatus = undefined,
                    CertificationViewState = undefined,
                    spModal = undefined,
                    certificationActionsFactoryService = undefined,
                    CertificationDecision = undefined,
                    certificationItemDetailService = undefined,
                    element = undefined;

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 20 */
                beforeEach(inject(function (_$rootScope_, _$compile_, _CertificationItem_, _CertificationActionStatus_, _certificationDataService_, _commentService_, _$q_, _certificationItemService_, _certificationService_, _testService_, _$controller_, _CertificationConfig_, _spTranslateFilter_, _CertificationDecisionStatus_, _CertificationViewState_, _spModal_, _certificationActionsFactoryService_, _CertificationDecision_, _certificationItemDetailService_) {
                    $scope = _$rootScope_.$new();
                    $compile = _$compile_;
                    $controller = _$controller_;
                    CertificationItem = _CertificationItem_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    CertificationDecisionStatus = _CertificationDecisionStatus_;
                    CertificationConfig = _CertificationConfig_;
                    CertificationViewState = _CertificationViewState_;
                    certificationActionsFactoryService = _certificationActionsFactoryService_;
                    spTranslateFilter = _spTranslateFilter_;
                    CertificationDecision = _CertificationDecision_;
                    certificationItemDetailService = _certificationItemDetailService_;

                    commentService = _commentService_;
                    certificationDataService = _certificationDataService_;
                    certificationItemService = _certificationItemService_;
                    certificationService = _certificationService_;
                    testService = _testService_;
                    spModal = _spModal_;
                    $q = _$q_;

                    certificationDataService.initializeConfiguration(new CertificationConfig({
                        processRevokesImmediately: false
                    }));

                    spTranslateFilter.configureCatalog({
                        'cert_action_approved': 'Approved',
                        'cert_action_approve': 'Approve',
                        'cert_action_remediate': 'Revoke',
                        'ui_cert_menu_comment': 'Comment',
                        'ui_cert_menu_history': 'History',
                        'ui_cert_menu_details': 'Details',
                        'ui_cert_menu_account_details': 'Account Details'
                    });
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                function createElement(item) {
                    element = angular.element(elementDefinition);
                    $scope.item = item;
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                function createController(item) {
                    return $controller('CertificationActionColumnDirectiveCtrl', {}, { item: item });
                }

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

                function findTopButtons(element) {
                    return element.find('.cert-action-column > button:not(.dropdown-toggle)');
                }

                function findMenuButton(element) {
                    return element.find('.cert-action-column button.dropdown-toggle');
                }

                function findMenuItems(element) {
                    return element.find('.cert-action-column ul.dropdown-menu li');
                }

                function createCertificationDecision(status) {
                    return new CertificationDecision(new CertificationActionStatus({ status: status }));
                }

                describe('delegated items', function () {
                    var item = undefined,
                        delegatedElement = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated], CertificationActionStatus.Name.Delegated, CertificationItem.Status.Delegated);

                        delegatedElement = createElement(item);
                    });

                    it('should not show action buttons', function () {
                        var topButtons = findTopButtons(delegatedElement);
                        expect(topButtons.length).toEqual(0);
                    });

                    it('shows cert-action-current-decision-state span that shows saved decision', function () {
                        var decisionStateSpan = delegatedElement.find('span.cert-action-current-decision-state');
                        expect(decisionStateSpan.length).toEqual(1);
                        expect(decisionStateSpan[0].innerText.trim()).toEqual('cert_action_delegated');
                    });
                });

                describe('summary status Complete', function () {
                    var item = undefined,
                        approvedElement = undefined;

                    function createCertificationItemWithRemediatedDecision() {
                        return createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated], CertificationActionStatus.Name.Remediated, CertificationItem.Status.Complete);
                    }

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated], CertificationActionStatus.Name.Approved, CertificationItem.Status.Complete);

                        approvedElement = createElement(item);
                    });

                    it('does not show button decision items', function () {
                        var topButtons = findTopButtons(approvedElement);
                        expect(topButtons.length).toEqual(0);
                    });

                    it('does not show menu items when cert is signed off', function () {
                        spyOn(certificationDataService, 'isSignedOff').and.callFake(function () {
                            return true;
                        });

                        var item = createCertificationItemWithRemediatedDecision(),
                            remediatedElement = createElement(item),
                            remediatedMenuItems = findMenuItems(remediatedElement);

                        // there should only be comment and history menu items
                        expect(remediatedMenuItems.length).toEqual(2);
                    });

                    it('shows cert-action-current-decision-state span that shows saved decision', function () {
                        var decisionStateSpan = approvedElement.find('span.cert-action-current-decision-state');
                        expect(decisionStateSpan.length).toEqual(1);
                        expect(decisionStateSpan[0].innerText.trim()).toEqual(CertificationActionStatus.Name.Approved);
                    });

                    it('shows clear menu item', function () {
                        var menuItems = findMenuItems(approvedElement);
                        expect(menuItems[0].innerText.trim()).toEqual('cert_action_undo');
                    });

                    it('shows correct menu item based on saved or current decision', function () {
                        var approvedMenuItems = findMenuItems(approvedElement),
                            item = createCertificationItemWithRemediatedDecision(),
                            remediatedElement = createElement(item),
                            remediatedMenuItems = findMenuItems(remediatedElement);

                        expect(approvedMenuItems[1].innerText.trim()).toEqual('Revoke');
                        expect(remediatedMenuItems[1].innerText.trim()).toEqual('Approve');
                    });
                });

                it('throws with no spModel specified', function () {
                    expect(function () {
                        return createElement(null);
                    }).toThrow();
                });

                it('does not show cert-action-current-decision-state span that shows saved decision', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Approved], undefined, CertificationItem.Status.Complete),
                        element = createElement(item),
                        decisionStateSpan = element.find('span.cert-action-current-decision-state');

                    expect(decisionStateSpan.length).toEqual(1);
                    expect(decisionStateSpan[0].classList.contains('ng-hide')).toEqual(true);
                });

                it('shows top level buttons', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Acknowledged, CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated], undefined, CertificationItem.Status.Open),
                        element = createElement(item),
                        topButtons = findTopButtons(element);

                    expect(topButtons.length).toEqual(2);
                    expect(topButtons[0].innerText.trim()).toEqual('Approve');
                    expect(topButtons[1].innerText.trim()).toEqual('Revoke');
                });

                it('shows top level buttons in the correct order', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Approved], undefined, CertificationItem.Status.Open),
                        element = createElement(item),
                        topButtons = findTopButtons(element);

                    expect(topButtons.length).toEqual(2);
                    expect(topButtons[0].innerText.trim()).toEqual('Approve');
                    expect(topButtons[1].innerText.trim()).toEqual('Revoke');
                });

                it('always shows at least two top level buttons', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Mitigated, CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Delegated]),
                        element = createElement(item),
                        topButtons = findTopButtons(element);

                    expect(topButtons.length).toEqual(2);
                    expect(topButtons[0].innerText.trim()).toEqual('Approve');
                    expect(topButtons[1].innerText.trim()).toEqual('Revoke');
                });

                it('shows other items in the menu', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Approved]),
                        element = createElement(item),
                        menuButton = findMenuButton(element),
                        menuOptions = findMenuItems(element),
                        topButtons = findTopButtons(element);

                    expect(topButtons.length).toEqual(2);
                    expect(menuButton.length).toEqual(1);
                    expect(menuOptions.length).toEqual(2);
                    expect(menuOptions[0].innerText.trim().startsWith('Comment')).toEqual(true);
                });

                function testDetailsMenuItem(expectIt) {
                    var detailsMenuText = arguments.length <= 1 || arguments[1] === undefined ? 'Details' : arguments[1];

                    var item = createCertificationItem([CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Approved]);

                    createElement(item);
                    var menuButton = findMenuButton(element),
                        menuOptions = findMenuItems(element),
                        topButtons = findTopButtons(element);

                    expect(topButtons.length).toEqual(2);
                    expect(menuButton.length).toEqual(1);
                    expect(menuOptions.length).toEqual(expectIt ? 3 : 2);
                    expect(menuOptions[0].innerText.trim().startsWith('Comment')).toEqual(true);
                    expect(menuOptions[1].innerText.trim().startsWith('History')).toEqual(true);
                    if (expectIt) {
                        expect(menuOptions[2].innerText.trim().startsWith(detailsMenuText)).toEqual(true);
                    }
                }

                it('shows details option in the menu if certificationItemDetailService.hasDetails is true', function () {
                    spyOn(certificationItemDetailService, 'hasDetails').and.returnValue(true);
                    testDetailsMenuItem(true);
                });

                it('does not show details option if certificationItemDetailService.hasDetails is false', function () {
                    spyOn(certificationItemDetailService, 'hasDetails').and.returnValue(false);
                    testDetailsMenuItem(false);
                });

                it('shows account details option in the menu if certificationItemDetailService.hasAccountDetails is true', function () {
                    spyOn(certificationItemDetailService, 'hasAccountDetails').and.returnValue(true);
                    testDetailsMenuItem(true, 'Account Details');
                });

                it('does not show account details option in the menu if certificationItemDetailService.hasAccountDetails is false', function () {
                    spyOn(certificationItemDetailService, 'hasAccountDetails').and.returnValue(false);
                    testDetailsMenuItem(false, 'Account Details');
                });

                it('disables buttons if certification is not editable', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved]),
                        element = createElement(item),
                        topButtons = findTopButtons(element),
                        menuOptions = findMenuItems(element),
                        certEditable = false;

                    spyOn(certificationDataService, 'isCertificationEditable').and.callFake(function () {
                        return certEditable;
                    });
                    expect(angular.element(topButtons[0]).attr('disabled')).toBeDefined();
                    expect(menuOptions[0].classList.contains('disabled')).toBeTruthy();
                    certEditable = true;
                    $scope.$apply();
                    expect(angular.element(topButtons[0]).attr('disabled')).not.toBeDefined();
                    expect(menuOptions[0].classList.contains('disabled')).toBeFalsy();
                });

                it('sets class if decision is current', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                        element = createElement(item),
                        topButtons = element.find('.cert-action-column > button:not(.dropdown-toggle)');

                    spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(createCertificationDecision(CertificationActionStatus.Name.Approved));
                    $scope.$apply();
                    expect(angular.element(topButtons[0]).hasClass('cert-action-current-decision')).toEqual(true);
                });

                it('sets class if decision is edited', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                        element = createElement(item),
                        topButtons = element.find('.cert-action-column > button:not(.dropdown-toggle)'),
                        editedDecision = createCertificationDecision(CertificationActionStatus.Name.Remediated);

                    editedDecision.edited = true;

                    spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(editedDecision);
                    $scope.$apply();
                    expect(angular.element(topButtons[1]).hasClass('cert-action-current-decision')).toEqual(true);
                });

                it('sets decision when clicked', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]),
                        element = createElement(item),
                        topButtons = element.find('.cert-action-column > button:not(.dropdown-toggle)');

                    // We need an exact match with message keys this once.
                    item.decisionStatus.decisions[0].promptKey = 'cert_action_approve';
                    item.decisionStatus.decisions[0].messageKey = 'cert_action_approve';
                    item.decisionStatus.decisions[1].promptKey = 'cert_action_remediate';
                    item.decisionStatus.decisions[1].messageKey = 'cert_action_remediate';

                    spyOn(certificationItemService, 'setDecision').and.returnValue(testService.createPromise(false, {
                        status: 'Approved'
                    }));

                    //Click approve
                    angular.element(topButtons[0]).click();
                    $scope.$apply();
                    expect(certificationItemService.setDecision).toHaveBeenCalledWith(item, item.decisionStatus.decisions[0]);
                    certificationItemService.setDecision.calls.reset();

                    //Click remediate
                    angular.element(topButtons[1]).click();
                    $scope.$apply();
                    expect(certificationItemService.setDecision).toHaveBeenCalledWith(item, item.decisionStatus.decisions[1]);
                });

                it('adds comment when Comment button clicked', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved]),
                        element = createElement(item),
                        menuOptions = findMenuItems(element),
                        commentText = 'some dumb comment',
                        certEditable = true,
                        cert = {
                        id: 'somecert'
                    };
                    spyOn(certificationDataService, 'isCertificationEditable').and.callFake(function () {
                        return certEditable;
                    });
                    spyOn(commentService, 'openCommentDialog').and.returnValue(testService.createPromise(false, commentText));
                    spyOn(certificationService, 'postComment');
                    spyOn(certificationDataService, 'getCertification').and.returnValue(cert);
                    angular.element(menuOptions[0]).find('a').click();
                    $scope.$apply();
                    expect(commentService.openCommentDialog).toHaveBeenCalled();
                    $scope.$apply();
                    expect(certificationService.postComment).toHaveBeenCalledWith(cert.id, item.id, commentText);
                });

                it('shows the history dialog when History button is clicked', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved]),
                        element = createElement(item),
                        menuOptions = findMenuItems(element);

                    spyOn(spModal, 'open').and.callFake(function () {
                        return {
                            result: testService.createPromise(),
                            setTitle: function (title) {}
                        };
                    });

                    angular.element(menuOptions[1]).find('a').click();

                    expect(spModal.open).toHaveBeenCalled();
                    var spModalArgs = spModal.open.calls.mostRecent().args;
                    expect(spModalArgs.length).toEqual(1);
                    expect(spModalArgs[0].resolve.challenge).toBeDefined();
                    expect(spModalArgs[0].resolve.certId).toBeDefined();
                    expect(spModalArgs[0].resolve.itemId).toBeDefined();
                    expect(spModalArgs[0].controller).toEqual('IdentityHistoryDialogCtrl');
                });

                function clickMenuItem(element, labelText) {
                    var menuOptions = findMenuItems(element);
                    var menuItem = menuOptions.find('a:contains(\'' + labelText + '\')');
                    expect(menuItem.length).toEqual(1);
                    menuItem.click();
                }

                function testDetailPopup() {
                    var menuItem = arguments.length <= 0 || arguments[0] === undefined ? 'Details' : arguments[0];

                    var item = createCertificationItem([CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Approved]);

                    spyOn(certificationDataService, 'getCertification').and.returnValue({ id: 'certId' });
                    createElement(item);
                    clickMenuItem(element, menuItem);
                    return item;
                }

                it('calls through to certificationItemDetailService to show detail dialog', function () {
                    spyOn(certificationItemDetailService, 'showDetailDialog');
                    spyOn(certificationItemDetailService, 'hasDetails').and.returnValue(true);
                    var item = testDetailPopup();
                    expect(certificationItemDetailService.showDetailDialog).toHaveBeenCalledWith('certId', item);
                });

                it('calls through to certificationItemDetailService to show account detail dialog', function () {
                    spyOn(certificationItemDetailService, 'showAccountDetailDialog');
                    spyOn(certificationItemDetailService, 'hasAccountDetails').and.returnValue(true);
                    var item = testDetailPopup('Account Details');
                    expect(certificationItemDetailService.showAccountDetailDialog).toHaveBeenCalledWith('certId', item);
                });

                it('findActionStatus should return correct status', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated], CertificationActionStatus.Name.Remediated, CertificationItem.Status.Complete),
                        ctrl = createController(item);

                    expect(ctrl.findActionStatus({ status: CertificationActionStatus.Name.Remediated }).name).toBe(CertificationActionStatus.Name.Remediated);

                    expect(ctrl.findActionStatus({ status: CertificationActionStatus.Name.Approved }).name).toBe(CertificationActionStatus.Name.Approved);

                    expect(ctrl.findActionStatus({ status: CertificationActionStatus.Name.Cleared }).name).toBe(CertificationActionStatus.Name.Cleared);

                    expect(ctrl.findActionStatus({ status: 'foo' })).toBeUndefined();
                });

                it('sets class if dependent decision', function () {
                    var item = createCertificationItem([CertificationActionStatus.Name.Remediated], undefined, CertificationItem.Status.Open),
                        element = createElement(item),
                        decision = {
                        revokedRoles: ['Role1', 'Role2'],
                        status: 'Remediated'
                    },
                        topButtons = element.find('.cert-action-column > button:not(.dropdown-toggle)');

                    spyOn(certificationDataService.decisions, 'getDecision').and.returnValue(undefined);
                    spyOn(certificationDataService.decisions, 'getSourceDecisions').and.returnValue([decision]);
                    $scope.$apply();
                    expect(angular.element(topButtons[0]).hasClass('cert-action-current-decision')).toEqual(true);
                });

                describe('isSourceItemUndone()', function () {
                    var item = undefined,
                        ctrl = undefined,
                        sourceDecision = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated], CertificationActionStatus.Name.Remediated, CertificationItem.Status.Complete);
                        item.decisionStatus.sourceItemId = '5678';
                        item.decisionStatus.dependentDecision = true;
                        ctrl = createController(item);
                        spyOn(certificationDataService.decisions, 'getDecision').and.callFake(function () {
                            return sourceDecision;
                        });
                    });

                    it('returns false if not a dependent decision', function () {
                        item.decisionStatus.dependentDecision = false;
                        expect(ctrl.isSourceItemUndone()).toEqual(false);
                    });

                    it('returns false if no source item id', function () {
                        delete item.decisionStatus.sourceItemId;
                        expect(ctrl.isSourceItemUndone()).toEqual(false);
                    });

                    it('returns false if no decision in the store for source item', function () {
                        sourceDecision = undefined;
                        expect(ctrl.isSourceItemUndone()).toEqual(false);
                    });

                    it('returns true if decision in the store with different status', function () {
                        sourceDecision = {
                            status: 'Undo'
                        };
                        expect(ctrl.isSourceItemUndone()).toEqual(true);
                    });
                });

                describe('isIndirectAccountDecisionUndone', function () {
                    var item = undefined,
                        ctrl = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.RevokeAccount], CertificationActionStatus.Name.RevokeAccount, CertificationItem.Status.Complete);
                        ctrl = createController(item);
                    });

                    it('returns false if not undoing an account decision', function () {
                        spyOn(certificationDataService.decisions, 'isAccountDecisionUndo').and.returnValue(false);
                        expect(ctrl.isIndirectAccountDecisionUndone({})).toEqual(false);
                    });

                    it('returns false if is a direct decision that undoes an account decision', function () {
                        var decision = CertificationDecision.createItemDecision(item, new CertificationActionStatus({ status: CertificationActionStatus.Name.Cleared }));
                        spyOn(certificationDataService.decisions, 'isAccountDecisionUndo').and.returnValue(true);
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.returnValue(decision);
                        expect(ctrl.isIndirectAccountDecisionUndone(decision)).toEqual(false);
                    });

                    it('returns true if is an indirect undo decision', function () {
                        var decision1 = createCertificationDecision(CertificationActionStatus.Name.Approved),
                            decision2 = createCertificationDecision(CertificationActionStatus.Name.Cleared);
                        spyOn(certificationDataService.decisions, 'isAccountDecisionUndo').and.returnValue(true);
                        // Mimic an indirect decision by using non-matching decisions.
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.returnValue(decision1);
                        expect(ctrl.isIndirectAccountDecisionUndone(decision2)).toEqual(true);
                    });
                });

                describe('getCurrentDecision()', function () {

                    var item = undefined,
                        ctrl = undefined,
                        unsavedDecision = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]);
                        ctrl = createController(item);
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.callFake(function () {
                            return unsavedDecision;
                        });
                        unsavedDecision = undefined;
                    });

                    it('returns action status for current decision if unsaved decision', function () {
                        unsavedDecision = {
                            status: 'Remediated'
                        };
                        expect(ctrl.getCurrentDecision()).toEqual(item.decisionStatus.decisions[1]);
                    });

                    it('returns saved action status if no unsaved decision', function () {
                        item.decisionStatus.currentState = {
                            name: 'Approved',
                            status: 'Approved'
                        };

                        expect(ctrl.getCurrentDecision()).toEqual(item.decisionStatus.currentState);
                    });

                    it('returns Undo status if source item is undone and no unsaved decision', function () {
                        spyOn(ctrl, 'isSourceItemUndone').and.returnValue(true);
                        expect(ctrl.getCurrentDecision().status).toEqual(CertificationActionStatus.Name.Cleared);
                    });

                    it('returns action status for current decision if unsaved decision if source item is undone', function () {
                        spyOn(ctrl, 'isSourceItemUndone').and.returnValue(true);
                        unsavedDecision = {
                            status: 'Approved'
                        };
                        expect(ctrl.getCurrentDecision()).toEqual(item.decisionStatus.decisions[0]);
                    });

                    it('returns undo status if indirect account decision undo', function () {
                        spyOn(ctrl, 'isIndirectAccountDecisionUndone').and.returnValue(true);
                        unsavedDecision = {
                            status: 'Approved'
                        };
                        expect(ctrl.getCurrentDecision().status).toEqual(CertificationActionStatus.Name.Cleared);
                    });

                    it('returns decision status if direct account decision undo', function () {
                        spyOn(ctrl, 'isIndirectAccountDecisionUndone').and.returnValue(false);
                        unsavedDecision = {
                            status: 'Approved'
                        };
                        expect(ctrl.getCurrentDecision().status).toEqual(CertificationActionStatus.Name.Approved);
                    });
                });

                describe('isCurrentDecision()', function () {

                    var item = undefined,
                        ctrl = undefined,
                        unsavedDecision = undefined,
                        unsavedSourceDecision = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]);
                        ctrl = createController(item);
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.callFake(function () {
                            return unsavedDecision;
                        });
                        spyOn(certificationDataService.decisions, 'getSourceDecisions').and.callFake(function () {
                            return [unsavedSourceDecision];
                        });
                        unsavedDecision = undefined;
                        unsavedSourceDecision = undefined;
                    });

                    it('returns false if decision is undefined', function () {
                        expect(ctrl.isCurrentDecision()).toEqual(false);
                    });

                    it('returns false if Delegation Review source item is undone and decision is not Cleared', function () {
                        spyOn(ctrl, 'isDelegatedItem').and.returnValue(true);
                        spyOn(ctrl, 'isSourceItemUndone').and.returnValue(true);
                        expect(ctrl.isCurrentDecision({
                            name: 'Remediated'
                        })).toEqual(false);
                    });

                    it('returns true if Delegation Review source item is undone and decision is Cleared', function () {
                        spyOn(ctrl, 'isDelegatedItem').and.returnValue(true);
                        spyOn(ctrl, 'isSourceItemUndone').and.returnValue(true);
                        expect(ctrl.isCurrentDecision({
                            name: 'Cleared'
                        })).toEqual(true);
                    });

                    it('returns true if there is an unsaved decision for the item and it matches', function () {
                        unsavedDecision = {
                            status: 'Remediated'
                        };
                        expect(ctrl.isCurrentDecision({
                            name: 'Remediated'
                        })).toEqual(true);
                    });

                    it('returns false if there is an unsaved decision for the item and it does not match', function () {
                        unsavedDecision = {
                            status: 'Remediated'
                        };
                        expect(ctrl.isCurrentDecision({
                            name: 'Approved'
                        })).toEqual(false);
                    });

                    it('returns true if there is an unsaved decision for the source item and it matches', function () {
                        unsavedSourceDecision = {
                            status: 'Remediated'
                        };
                        expect(ctrl.isCurrentDecision({
                            name: 'Remediated'
                        })).toEqual(true);
                    });

                    it('returns false if there is an unsaved decision for the source item and it does not match', function () {
                        unsavedSourceDecision = {
                            status: 'Remediated'
                        };
                        expect(ctrl.isCurrentDecision({
                            name: 'Approved'
                        })).toEqual(false);
                    });

                    it('returns true if status matches and delegationReviewAction matches', function () {
                        unsavedDecision = {
                            status: 'Remediated',
                            delegationReviewAction: 'Accept'
                        };
                        expect(ctrl.isCurrentDecision({
                            status: 'Remediated',
                            delegationReviewAction: 'Accept'
                        })).toEqual(true);
                    });

                    it('returns false if status matches and delegationReviewAction does not match', function () {
                        unsavedDecision = {
                            status: 'Remediated',
                            delegationReviewAction: 'Accept'
                        };
                        expect(ctrl.isCurrentDecision({
                            status: 'Remediated',
                            delegationReviewAction: 'Reject'
                        })).toEqual(false);
                    });

                    it('returns true if status is Cleared and we have an unsaved indirect account undo decision', function () {
                        spyOn(ctrl, 'isIndirectAccountDecisionUndone').and.returnValue(true);
                        unsavedDecision = {
                            status: 'Approved'
                        };
                        expect(ctrl.isCurrentDecision({
                            name: 'Cleared'
                        })).toEqual(true);
                    });
                });

                describe('isEdited()', function () {

                    var item = undefined,
                        ctrl = undefined,
                        unsavedDecision = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated]);
                        ctrl = createController(item);
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.callFake(function () {
                            return unsavedDecision;
                        });
                        unsavedDecision = undefined;
                    });

                    it('returns false if decision is undefined', function () {
                        expect(ctrl.isEdited()).toEqual(false);
                    });

                    it('returns false if decision is not edited', function () {
                        unsavedDecision = {
                            edited: false
                        };
                        expect(ctrl.isEdited()).toEqual(false);
                    });

                    it('returns true if decision is edited', function () {
                        unsavedDecision = {
                            edited: true
                        };
                        expect(ctrl.isEdited()).toEqual(true);
                    });
                });

                describe('getButtonDecisions', function () {
                    var item = undefined,
                        ctrl = undefined;

                    function createControllerWithStatus(status, policyType, noRemediate) {
                        var statuses = [CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated];
                        if (noRemediate) {
                            statuses.pop();
                        }
                        item = createCertificationItem(statuses, status, CertificationItem.Status.WaitingReview, policyType);
                        ctrl = createController(item);
                        spyOn(item, 'isPolicyViolation').and.returnValue(true);
                    }

                    describe('non policy violation delegated items.', function () {
                        it('Role should return Remediated for Approved', function () {
                            createControllerWithStatus(CertificationActionStatus.Name.Approved);
                            expect(ctrl.getButtonDecisions()[1].name).toBe(CertificationActionStatus.Name.Remediated);
                        });

                        it('Role should return Approved for Remediated', function () {
                            createControllerWithStatus(CertificationActionStatus.Name.Remediated);
                            expect(ctrl.getButtonDecisions()[1].name).toBe(CertificationActionStatus.Name.Approved);
                        });

                        it('Role should return Remediated for Mitigated', function () {
                            createControllerWithStatus(CertificationActionStatus.Name.Mitigated);
                            expect(ctrl.getButtonDecisions()[1].name).toBe(CertificationActionStatus.Name.Remediated);
                        });
                    });
                });

                describe('getMenuDecisions()', function () {
                    var item = undefined,
                        ctrl = undefined;

                    function createItem(status) {
                        var localItem = createCertificationItem([CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Acknowledged, CertificationActionStatus.Name.Remediated], CertificationActionStatus.Name.Remediated, status);
                        return localItem;
                    }

                    it('should not return Delegated if summaryStatus is Challenged', function () {
                        item = createItem(CertificationItem.Status.Challenged);
                        ctrl = createController(item);
                        var menu = ctrl.getMenuDecisions();
                        expect(menu.length).toEqual(1);
                        expect(menu[0].name).toBe(CertificationActionStatus.Name.Acknowledged);
                    });

                    it('should return Delegated if summaryStatus is not Challenged', function () {
                        item = createItem();
                        ctrl = createController(item);
                        var menu = ctrl.getMenuDecisions();
                        expect(menu.length).toEqual(2);
                        expect(menu[0].name).toBe(CertificationActionStatus.Name.Delegated);
                        expect(menu[1].name).toBe(CertificationActionStatus.Name.Acknowledged);
                    });
                });

                describe('hasMenuAction()', function () {
                    var item = undefined,
                        ctrl = undefined;

                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Acknowledged, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated], undefined, CertificationItem.Status.Open);
                        ctrl = createController(item);
                    });

                    it('returns false if current decision is null', function () {
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(null);

                        expect(ctrl.hasMenuAction()).toEqual(false);
                    });

                    it('returns false if current decision is a button', function () {
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(createCertificationDecision(CertificationActionStatus.Name.Approved));

                        expect(ctrl.hasMenuAction()).toEqual(false);
                    });

                    it('returns false if current decision does not exist', function () {
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(createCertificationDecision(CertificationActionStatus.Name.Cleared));

                        expect(ctrl.hasMenuAction()).toEqual(false);
                    });

                    it('returns true if current decision is a menu action', function () {
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(createCertificationDecision(CertificationActionStatus.Name.Mitigated));

                        expect(ctrl.hasMenuAction()).toEqual(true);
                    });
                });

                describe('makeDecision()', function () {
                    var ctrl = undefined,
                        item = undefined;
                    beforeEach(function () {
                        item = createCertificationItem([CertificationActionStatus.Name.Delegated, CertificationActionStatus.Name.Approved, CertificationActionStatus.Name.Remediated, CertificationActionStatus.Name.Mitigated], undefined, CertificationItem.Status.Open);
                        ctrl = createController(item);
                        spyOn(certificationItemService, 'setDecision').and.callFake(function () {
                            return $q.when();
                        });
                        spyOn(certificationActionsFactoryService, 'getCertificationActions');
                    });

                    it('should call initializeActions after setDecision', function () {
                        ctrl.makeDecision(new CertificationActionStatus({ status: CertificationActionStatus.Name.Approved }));
                        $scope.$apply();
                        expect(certificationActionsFactoryService.getCertificationActions).toHaveBeenCalled();
                    });
                });

                describe('view/edit decisions', function () {
                    var ctrl = undefined,
                        item = undefined;

                    beforeEach(function () {
                        item = createCertificationItem();
                        ctrl = createController(item);
                    });

                    describe('canViewDecision', function () {
                        it('return calls certificationItemService.canViewDecision', function () {
                            var val = 'abcd';
                            spyOn(certificationItemService, 'canViewDecision').and.returnValue(val);
                            var returnVal = ctrl.canViewDecision();
                            expect(certificationItemService.canViewDecision).toHaveBeenCalledWith(item);
                            expect(returnVal).toEqual(val);
                        });
                    });

                    describe('canEditDecision', function () {
                        it('return calls certificationItemService.canEditDecision', function () {
                            var val = 'abcd';
                            spyOn(certificationItemService, 'canEditDecision').and.returnValue(val);
                            var returnVal = ctrl.canEditDecision();
                            expect(certificationItemService.canEditDecision).toHaveBeenCalledWith(item);
                            expect(returnVal).toEqual(val);
                        });
                    });

                    describe('editDecision', function () {
                        it('calls certificationItemService.editDecision', function () {
                            spyOn(certificationItemService, 'editDecision');
                            ctrl.editDecision();
                            expect(certificationItemService.editDecision).toHaveBeenCalledWith(item);
                        });
                    });

                    describe('viewDecision', function () {
                        it('calls certificationItemService.viewDecision', function () {
                            spyOn(certificationItemService, 'viewDecision');
                            ctrl.viewDecision();
                            expect(certificationItemService.viewDecision).toHaveBeenCalledWith(item);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkFjdGlvbkNvbHVtbkRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLHFDQUFxQywyQkFBMkIsc0JBQXNCLDRDQUE0QyxVQUFVLFNBQVM7OztJQUdsSzs7SUFFQSxJQUFJLHFCQUFxQjtJQUN6QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsbUNBQW1DO1lBQ25ELHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1CQUFtQjtZQUNsRSxhQUFhLGtCQUFrQjtXQUNoQyxVQUFVLHNDQUFzQztRQUNuRCxTQUFTLFlBQVk7OztZQUo3QixTQUFTLCtCQUErQixZQUFXOztnQkFFL0MsSUFBSSxvQkFBaUI7b0JBQ2pCLG9CQUFpQjtvQkFBRSxTQUFNO29CQUFFLFdBQVE7b0JBQUUsY0FBVztvQkFBRSxLQUFFO29CQUFFLDJCQUF3QjtvQkFDOUUsMkJBQXdCO29CQUFFLHVCQUFvQjtvQkFBRSxjQUFXO29CQUFFLGlCQUFjO29CQUFFLDRCQUF5QjtvQkFDdEcsc0JBQW1CO29CQUFFLG9CQUFpQjtvQkFBRSw4QkFBMkI7b0JBQUUseUJBQXNCO29CQUFFLFVBQU87b0JBQ3BHLHFDQUFrQztvQkFBRSx3QkFBcUI7b0JBQUUsaUNBQThCO29CQUFFLFVBQU87O2dCQUV0RyxXQUFXLE9BQU8scUJBQXFCOzs7Z0JBR3ZDLFdBQVcsT0FBTyxVQUFTLGNBQWMsWUFBWSxxQkFBcUIsNkJBQy9DLDRCQUE0QixrQkFBa0IsTUFDOUMsNEJBQTRCLHdCQUF3QixlQUFlLGVBQ25FLHVCQUF1QixxQkFBcUIsK0JBQzVDLDBCQUEwQixXQUFXLHNDQUNyQyx5QkFBeUIsa0NBQWtDO29CQUNsRixTQUFTLGFBQWE7b0JBQ3RCLFdBQVc7b0JBQ1gsY0FBYztvQkFDZCxvQkFBb0I7b0JBQ3BCLDRCQUE0QjtvQkFDNUIsOEJBQThCO29CQUM5QixzQkFBc0I7b0JB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cnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkFjdGlvbkNvbHVtbkRpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvY29tbW9uL2kxOG4vTW9ja1RyYW5zbGF0ZUZpbHRlcic7XG5cbi8qIGpzaGludCBtYXhzdGF0ZW1lbnRzOiA0OCAqL1xuZGVzY3JpYmUoJ3NwQ2VydGlmaWNhdGlvbkFjdGlvbkNvbHVtbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IGVsZW1lbnREZWZpbml0aW9uID0gYDxzcC1jZXJ0aWZpY2F0aW9uLWFjdGlvbi1jb2x1bW4gc3AtbW9kZWw9XCJpdGVtXCIgLz5gLFxuICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbSwgJHNjb3BlLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsICRxLCBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsXG4gICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZSwgY2VydGlmaWNhdGlvblNlcnZpY2UsIHRlc3RTZXJ2aWNlLCBjb21tZW50U2VydmljZSwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyxcbiAgICAgICAgQ2VydGlmaWNhdGlvbkNvbmZpZywgc3BUcmFuc2xhdGVGaWx0ZXIsIENlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1cywgQ2VydGlmaWNhdGlvblZpZXdTdGF0ZSwgc3BNb2RhbCxcbiAgICAgICAgY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZSwgQ2VydGlmaWNhdGlvbkRlY2lzaW9uLCBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UsIGVsZW1lbnQ7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlLCB0ZXN0TW9kdWxlKSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAyMCAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgXyRjb21waWxlXywgX0NlcnRpZmljYXRpb25JdGVtXywgX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfLCBfY29tbWVudFNlcnZpY2VfLCBfJHFfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2VfLCBfY2VydGlmaWNhdGlvblNlcnZpY2VfLCBfdGVzdFNlcnZpY2VfLCBfJGNvbnRyb2xsZXJfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9DZXJ0aWZpY2F0aW9uQ29uZmlnXywgX3NwVHJhbnNsYXRlRmlsdGVyXywgX0NlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1c18sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0NlcnRpZmljYXRpb25WaWV3U3RhdGVfLCBfc3BNb2RhbF8sIF9jZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQ2VydGlmaWNhdGlvbkRlY2lzaW9uXywgX2NlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZV8pIHtcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfLiRuZXcoKTtcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyA9IF9DZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RhdHVzID0gX0NlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1c187XG4gICAgICAgIENlcnRpZmljYXRpb25Db25maWcgPSBfQ2VydGlmaWNhdGlvbkNvbmZpZ187XG4gICAgICAgIENlcnRpZmljYXRpb25WaWV3U3RhdGUgPSBfQ2VydGlmaWNhdGlvblZpZXdTdGF0ZV87XG4gICAgICAgIGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZV87XG4gICAgICAgIHNwVHJhbnNsYXRlRmlsdGVyID0gX3NwVHJhbnNsYXRlRmlsdGVyXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XG4gICAgICAgIGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2VfO1xuXG4gICAgICAgIGNvbW1lbnRTZXJ2aWNlID0gX2NvbW1lbnRTZXJ2aWNlXztcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV87XG4gICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2VfO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XG4gICAgICAgIHRlc3RTZXJ2aWNlID0gX3Rlc3RTZXJ2aWNlXztcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgJHEgPSBfJHFfO1xuXG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplQ29uZmlndXJhdGlvbihuZXcgQ2VydGlmaWNhdGlvbkNvbmZpZyh7XG4gICAgICAgICAgICBwcm9jZXNzUmV2b2tlc0ltbWVkaWF0ZWx5OiBmYWxzZVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIuY29uZmlndXJlQ2F0YWxvZyh7XG4gICAgICAgICAgICAnY2VydF9hY3Rpb25fYXBwcm92ZWQnOiAnQXBwcm92ZWQnLFxuICAgICAgICAgICAgJ2NlcnRfYWN0aW9uX2FwcHJvdmUnOiAnQXBwcm92ZScsXG4gICAgICAgICAgICAnY2VydF9hY3Rpb25fcmVtZWRpYXRlJzogJ1Jldm9rZScsXG4gICAgICAgICAgICAndWlfY2VydF9tZW51X2NvbW1lbnQnOiAnQ29tbWVudCcsXG4gICAgICAgICAgICAndWlfY2VydF9tZW51X2hpc3RvcnknOiAnSGlzdG9yeScsXG4gICAgICAgICAgICAndWlfY2VydF9tZW51X2RldGFpbHMnOiAnRGV0YWlscycsXG4gICAgICAgICAgICAndWlfY2VydF9tZW51X2FjY291bnRfZGV0YWlscyc6ICdBY2NvdW50IERldGFpbHMnXG4gICAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGl0ZW0pIHtcbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XG4gICAgICAgICRzY29wZS5pdGVtID0gaXRlbTtcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdDZXJ0aWZpY2F0aW9uQWN0aW9uQ29sdW1uRGlyZWN0aXZlQ3RybCcsIHt9LCB7aXRlbTogaXRlbX0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKHN0YXR1c2VzLCBkZWNpc2lvblN0YXRlLCBzdW1tYXJ5U3RhdHVzLCBwb2xpY3lUeXBlKSB7XG4gICAgICAgIGxldCBkZWNpc2lvblN0YXR1cyA9IG5ldyBDZXJ0aWZpY2F0aW9uRGVjaXNpb25TdGF0dXMoe30pO1xuICAgICAgICBpZiAoc3RhdHVzZXMpIHtcbiAgICAgICAgICAgIHN0YXR1c2VzLmZvckVhY2goKHN0YXR1cykgPT4gZGVjaXNpb25TdGF0dXMuZGVjaXNpb25zLnB1c2gobmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIHByb21wdEtleTogc3RhdHVzLFxuICAgICAgICAgICAgICAgIG5hbWU6IHN0YXR1c1xuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWNpc2lvblN0YXRlKSB7XG4gICAgICAgICAgICBkZWNpc2lvblN0YXR1cy5jdXJyZW50U3RhdGUgPSBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBkZWNpc2lvblN0YXRlLFxuICAgICAgICAgICAgICAgIHByb21wdEtleTogZGVjaXNpb25TdGF0ZSxcbiAgICAgICAgICAgICAgICBuYW1lOiBkZWNpc2lvblN0YXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xuICAgICAgICAgICAgaWQ6ICcxMjM0JyxcbiAgICAgICAgICAgIGRlY2lzaW9uU3RhdHVzOiBkZWNpc2lvblN0YXR1cyxcbiAgICAgICAgICAgIHBvbGljeVR5cGU6IHBvbGljeVR5cGUsXG4gICAgICAgICAgICBzdW1tYXJ5U3RhdHVzOiBzdW1tYXJ5U3RhdHVzID8gc3VtbWFyeVN0YXR1cyA6IENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5PcGVuLFxuICAgICAgICAgICAgcm9sZU5hbWU6ICdSb2xlMScsXG4gICAgICAgICAgICBjYW5DaGFuZ2VEZWNpc2lvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kVG9wQnV0dG9ucyhlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmZpbmQoJy5jZXJ0LWFjdGlvbi1jb2x1bW4gPiBidXR0b246bm90KC5kcm9wZG93bi10b2dnbGUpJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZE1lbnVCdXR0b24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5maW5kKCcuY2VydC1hY3Rpb24tY29sdW1uIGJ1dHRvbi5kcm9wZG93bi10b2dnbGUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kTWVudUl0ZW1zKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZmluZCgnLmNlcnQtYWN0aW9uLWNvbHVtbiB1bC5kcm9wZG93bi1tZW51IGxpJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKHN0YXR1cykge1xuICAgICAgICByZXR1cm4gbmV3IENlcnRpZmljYXRpb25EZWNpc2lvbihuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7IHN0YXR1czogc3RhdHVzIH0pKTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnZGVsZWdhdGVkIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSwgZGVsZWdhdGVkRWxlbWVudDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkRlbGVnYXRlZFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZGVsZWdhdGVkRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgYWN0aW9uIGJ1dHRvbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdG9wQnV0dG9ucyA9IGZpbmRUb3BCdXR0b25zKGRlbGVnYXRlZEVsZW1lbnQpO1xuICAgICAgICAgICAgZXhwZWN0KHRvcEJ1dHRvbnMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3MgY2VydC1hY3Rpb24tY3VycmVudC1kZWNpc2lvbi1zdGF0ZSBzcGFuIHRoYXQgc2hvd3Mgc2F2ZWQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb25TdGF0ZVNwYW4gPSBkZWxlZ2F0ZWRFbGVtZW50LmZpbmQoJ3NwYW4uY2VydC1hY3Rpb24tY3VycmVudC1kZWNpc2lvbi1zdGF0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uU3RhdGVTcGFuLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvblN0YXRlU3BhblswXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCdjZXJ0X2FjdGlvbl9kZWxlZ2F0ZWQnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc3VtbWFyeSBzdGF0dXMgQ29tcGxldGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0sIGFwcHJvdmVkRWxlbWVudDtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbVdpdGhSZW1lZGlhdGVkRGVjaXNpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oWyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkXSxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ29tcGxldGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oWyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ29tcGxldGVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGFwcHJvdmVkRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdCBzaG93IGJ1dHRvbiBkZWNpc2lvbiBpdGVtcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0b3BCdXR0b25zID0gZmluZFRvcEJ1dHRvbnMoYXBwcm92ZWRFbGVtZW50KTtcbiAgICAgICAgICAgIGV4cGVjdCh0b3BCdXR0b25zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHNob3cgbWVudSBpdGVtcyB3aGVuIGNlcnQgaXMgc2lnbmVkIG9mZicsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2lzU2lnbmVkT2ZmJykuYW5kLmNhbGxGYWtlKCgpID0+IHRydWUpO1xuXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtV2l0aFJlbWVkaWF0ZWREZWNpc2lvbigpLFxuICAgICAgICAgICAgICAgIHJlbWVkaWF0ZWRFbGVtZW50ID0gY3JlYXRlRWxlbWVudChpdGVtKSxcbiAgICAgICAgICAgICAgICByZW1lZGlhdGVkTWVudUl0ZW1zID0gZmluZE1lbnVJdGVtcyhyZW1lZGlhdGVkRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIHRoZXJlIHNob3VsZCBvbmx5IGJlIGNvbW1lbnQgYW5kIGhpc3RvcnkgbWVudSBpdGVtc1xuICAgICAgICAgICAgZXhwZWN0KHJlbWVkaWF0ZWRNZW51SXRlbXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3MgY2VydC1hY3Rpb24tY3VycmVudC1kZWNpc2lvbi1zdGF0ZSBzcGFuIHRoYXQgc2hvd3Mgc2F2ZWQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb25TdGF0ZVNwYW4gPSBhcHByb3ZlZEVsZW1lbnQuZmluZCgnc3Bhbi5jZXJ0LWFjdGlvbi1jdXJyZW50LWRlY2lzaW9uLXN0YXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb25TdGF0ZVNwYW4ubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uU3RhdGVTcGFuWzBdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3dzIGNsZWFyIG1lbnUgaXRlbScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBtZW51SXRlbXMgPSBmaW5kTWVudUl0ZW1zKGFwcHJvdmVkRWxlbWVudCk7XG4gICAgICAgICAgICBleHBlY3QobWVudUl0ZW1zWzBdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ2NlcnRfYWN0aW9uX3VuZG8nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3dzIGNvcnJlY3QgbWVudSBpdGVtIGJhc2VkIG9uIHNhdmVkIG9yIGN1cnJlbnQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXBwcm92ZWRNZW51SXRlbXMgPSBmaW5kTWVudUl0ZW1zKGFwcHJvdmVkRWxlbWVudCksXG4gICAgICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtV2l0aFJlbWVkaWF0ZWREZWNpc2lvbigpLFxuICAgICAgICAgICAgICAgIHJlbWVkaWF0ZWRFbGVtZW50ID0gY3JlYXRlRWxlbWVudChpdGVtKSxcbiAgICAgICAgICAgICAgICByZW1lZGlhdGVkTWVudUl0ZW1zID0gZmluZE1lbnVJdGVtcyhyZW1lZGlhdGVkRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChhcHByb3ZlZE1lbnVJdGVtc1sxXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCdSZXZva2UnKTtcbiAgICAgICAgICAgIGV4cGVjdChyZW1lZGlhdGVkTWVudUl0ZW1zWzFdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ0FwcHJvdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGl0ICgndGhyb3dzIHdpdGggbm8gc3BNb2RlbCBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUVsZW1lbnQobnVsbCkpLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCBzaG93IGNlcnQtYWN0aW9uLWN1cnJlbnQtZGVjaXNpb24tc3RhdGUgc3BhbiB0aGF0IHNob3dzIHNhdmVkIGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKFtcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWRdLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNvbXBsZXRlKSxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGl0ZW0pLFxuICAgICAgICAgICAgZGVjaXNpb25TdGF0ZVNwYW4gPSBlbGVtZW50LmZpbmQoJ3NwYW4uY2VydC1hY3Rpb24tY3VycmVudC1kZWNpc2lvbi1zdGF0ZScpO1xuXG4gICAgICAgIGV4cGVjdChkZWNpc2lvblN0YXRlU3Bhbi5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIGV4cGVjdChkZWNpc2lvblN0YXRlU3BhblswXS5jbGFzc0xpc3QuY29udGFpbnMoJ25nLWhpZGUnKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvd3MgdG9wIGxldmVsIGJ1dHRvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFja25vd2xlZGdlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuT3BlbiksXG4gICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChpdGVtKSxcbiAgICAgICAgICAgIHRvcEJ1dHRvbnMgPSBmaW5kVG9wQnV0dG9ucyhlbGVtZW50KTtcblxuICAgICAgICBleHBlY3QodG9wQnV0dG9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdCh0b3BCdXR0b25zWzBdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ0FwcHJvdmUnKTtcbiAgICAgICAgZXhwZWN0KHRvcEJ1dHRvbnNbMV0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbCgnUmV2b2tlJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3dzIHRvcCBsZXZlbCBidXR0b25zIGluIHRoZSBjb3JyZWN0IG9yZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW1xuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZF0sXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5PcGVuKSxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGl0ZW0pLFxuICAgICAgICAgICAgdG9wQnV0dG9ucyA9IGZpbmRUb3BCdXR0b25zKGVsZW1lbnQpO1xuXG4gICAgICAgIGV4cGVjdCh0b3BCdXR0b25zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KHRvcEJ1dHRvbnNbMF0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbCgnQXBwcm92ZScpO1xuICAgICAgICBleHBlY3QodG9wQnV0dG9uc1sxXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCdSZXZva2UnKTtcbiAgICB9KTtcblxuICAgIGl0KCdhbHdheXMgc2hvd3MgYXQgbGVhc3QgdHdvIHRvcCBsZXZlbCBidXR0b25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW1xuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWRcbiAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGl0ZW0pLFxuICAgICAgICAgICAgdG9wQnV0dG9ucyA9IGZpbmRUb3BCdXR0b25zKGVsZW1lbnQpO1xuXG4gICAgICAgIGV4cGVjdCh0b3BCdXR0b25zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KHRvcEJ1dHRvbnNbMF0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbCgnQXBwcm92ZScpO1xuICAgICAgICBleHBlY3QodG9wQnV0dG9uc1sxXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCdSZXZva2UnKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvd3Mgb3RoZXIgaXRlbXMgaW4gdGhlIG1lbnUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChpdGVtKSxcbiAgICAgICAgICAgIG1lbnVCdXR0b24gPSBmaW5kTWVudUJ1dHRvbihlbGVtZW50KSxcbiAgICAgICAgICAgIG1lbnVPcHRpb25zID0gZmluZE1lbnVJdGVtcyhlbGVtZW50KSxcbiAgICAgICAgICAgIHRvcEJ1dHRvbnMgPSBmaW5kVG9wQnV0dG9ucyhlbGVtZW50KTtcblxuICAgICAgICBleHBlY3QodG9wQnV0dG9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdChtZW51QnV0dG9uLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KG1lbnVPcHRpb25zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KG1lbnVPcHRpb25zWzBdLmlubmVyVGV4dC50cmltKCkuc3RhcnRzV2l0aCgnQ29tbWVudCcpKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdGVzdERldGFpbHNNZW51SXRlbShleHBlY3RJdCwgZGV0YWlsc01lbnVUZXh0ID0gJ0RldGFpbHMnKSB7XG4gICAgICAgIGxldCBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSk7XG5cbiAgICAgICAgY3JlYXRlRWxlbWVudChpdGVtKTtcbiAgICAgICAgbGV0IG1lbnVCdXR0b24gPSBmaW5kTWVudUJ1dHRvbihlbGVtZW50KSxcbiAgICAgICAgICAgIG1lbnVPcHRpb25zID0gZmluZE1lbnVJdGVtcyhlbGVtZW50KSxcbiAgICAgICAgICAgIHRvcEJ1dHRvbnMgPSBmaW5kVG9wQnV0dG9ucyhlbGVtZW50KTtcblxuICAgICAgICBleHBlY3QodG9wQnV0dG9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdChtZW51QnV0dG9uLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KG1lbnVPcHRpb25zLmxlbmd0aCkudG9FcXVhbChleHBlY3RJdCA/IDMgOiAyKTtcbiAgICAgICAgZXhwZWN0KG1lbnVPcHRpb25zWzBdLmlubmVyVGV4dC50cmltKCkuc3RhcnRzV2l0aCgnQ29tbWVudCcpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICBleHBlY3QobWVudU9wdGlvbnNbMV0uaW5uZXJUZXh0LnRyaW0oKS5zdGFydHNXaXRoKCdIaXN0b3J5JykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIGlmIChleHBlY3RJdCkge1xuICAgICAgICAgICAgZXhwZWN0KG1lbnVPcHRpb25zWzJdLmlubmVyVGV4dC50cmltKCkuc3RhcnRzV2l0aChkZXRhaWxzTWVudVRleHQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXQgKCdzaG93cyBkZXRhaWxzIG9wdGlvbiBpbiB0aGUgbWVudSBpZiBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzRGV0YWlscyBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSwgJ2hhc0RldGFpbHMnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgIHRlc3REZXRhaWxzTWVudUl0ZW0odHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ2RvZXMgbm90IHNob3cgZGV0YWlscyBvcHRpb24gaWYgY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLmhhc0RldGFpbHMgaXMgZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLCAnaGFzRGV0YWlscycpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgIHRlc3REZXRhaWxzTWVudUl0ZW0oZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG93cyBhY2NvdW50IGRldGFpbHMgb3B0aW9uIGluIHRoZSBtZW51IGlmIGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZS5oYXNBY2NvdW50RGV0YWlscyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UsICdoYXNBY2NvdW50RGV0YWlscycpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgdGVzdERldGFpbHNNZW51SXRlbSh0cnVlLCAnQWNjb3VudCBEZXRhaWxzJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ2RvZXMgbm90IHNob3cgYWNjb3VudCBkZXRhaWxzIG9wdGlvbiBpbiB0aGUgbWVudSBpZiBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzQWNjb3VudERldGFpbHMgaXMgZmFsc2UnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UsICdoYXNBY2NvdW50RGV0YWlscycpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICB0ZXN0RGV0YWlsc01lbnVJdGVtKGZhbHNlLCAnQWNjb3VudCBEZXRhaWxzJyk7XG4gICAgICAgIH0pO1xuXG4gICAgaXQoJ2Rpc2FibGVzIGJ1dHRvbnMgaWYgY2VydGlmaWNhdGlvbiBpcyBub3QgZWRpdGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChpdGVtKSxcbiAgICAgICAgICAgIHRvcEJ1dHRvbnMgPSBmaW5kVG9wQnV0dG9ucyhlbGVtZW50KSxcbiAgICAgICAgICAgIG1lbnVPcHRpb25zID0gZmluZE1lbnVJdGVtcyhlbGVtZW50KSxcbiAgICAgICAgICAgIGNlcnRFZGl0YWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2lzQ2VydGlmaWNhdGlvbkVkaXRhYmxlJykuYW5kLmNhbGxGYWtlKCgpID0+IHsgcmV0dXJuIGNlcnRFZGl0YWJsZTt9KTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BCdXR0b25zWzBdKS5hdHRyKCdkaXNhYmxlZCcpKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVudU9wdGlvbnNbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGNlcnRFZGl0YWJsZSA9IHRydWU7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BCdXR0b25zWzBdKS5hdHRyKCdkaXNhYmxlZCcpKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lbnVPcHRpb25zWzBdLmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3NldHMgY2xhc3MgaWYgZGVjaXNpb24gaXMgY3VycmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKFtcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdKSxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGl0ZW0pLFxuICAgICAgICAgICAgdG9wQnV0dG9ucyA9IGVsZW1lbnQuZmluZCgnLmNlcnQtYWN0aW9uLWNvbHVtbiA+IGJ1dHRvbjpub3QoLmRyb3Bkb3duLXRvZ2dsZSknKTtcblxuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKVxuICAgICAgICAgICAgLmFuZC5yZXR1cm5WYWx1ZShjcmVhdGVDZXJ0aWZpY2F0aW9uRGVjaXNpb24oQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BCdXR0b25zWzBdKS5oYXNDbGFzcygnY2VydC1hY3Rpb24tY3VycmVudC1kZWNpc2lvbicpKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzZXRzIGNsYXNzIGlmIGRlY2lzaW9uIGlzIGVkaXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKFtcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdKSxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGl0ZW0pLFxuICAgICAgICAgICAgdG9wQnV0dG9ucyA9IGVsZW1lbnQuZmluZCgnLmNlcnQtYWN0aW9uLWNvbHVtbiA+IGJ1dHRvbjpub3QoLmRyb3Bkb3duLXRvZ2dsZSknKSxcbiAgICAgICAgICAgIGVkaXRlZERlY2lzaW9uID0gY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcblxuICAgICAgICBlZGl0ZWREZWNpc2lvbi5lZGl0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXRFZmZlY3RpdmVEZWNpc2lvbkJ5SXRlbScpXG4gICAgICAgICAgICAuYW5kLnJldHVyblZhbHVlKGVkaXRlZERlY2lzaW9uKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoYW5ndWxhci5lbGVtZW50KHRvcEJ1dHRvbnNbMV0pLmhhc0NsYXNzKCdjZXJ0LWFjdGlvbi1jdXJyZW50LWRlY2lzaW9uJykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3NldHMgZGVjaXNpb24gd2hlbiBjbGlja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW1xuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZF0pLFxuICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoaXRlbSksXG4gICAgICAgICAgICB0b3BCdXR0b25zID0gZWxlbWVudC5maW5kKCcuY2VydC1hY3Rpb24tY29sdW1uID4gYnV0dG9uOm5vdCguZHJvcGRvd24tdG9nZ2xlKScpO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgYW4gZXhhY3QgbWF0Y2ggd2l0aCBtZXNzYWdlIGtleXMgdGhpcyBvbmNlLlxuICAgICAgICBpdGVtLmRlY2lzaW9uU3RhdHVzLmRlY2lzaW9uc1swXS5wcm9tcHRLZXkgPSAnY2VydF9hY3Rpb25fYXBwcm92ZSc7XG4gICAgICAgIGl0ZW0uZGVjaXNpb25TdGF0dXMuZGVjaXNpb25zWzBdLm1lc3NhZ2VLZXkgPSAnY2VydF9hY3Rpb25fYXBwcm92ZSc7XG4gICAgICAgIGl0ZW0uZGVjaXNpb25TdGF0dXMuZGVjaXNpb25zWzFdLnByb21wdEtleSA9ICdjZXJ0X2FjdGlvbl9yZW1lZGlhdGUnO1xuICAgICAgICBpdGVtLmRlY2lzaW9uU3RhdHVzLmRlY2lzaW9uc1sxXS5tZXNzYWdlS2V5ID0gJ2NlcnRfYWN0aW9uX3JlbWVkaWF0ZSc7XG5cbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLCAnc2V0RGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUoXG4gICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnQXBwcm92ZWQnXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIC8vQ2xpY2sgYXBwcm92ZVxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodG9wQnV0dG9uc1swXSkuY2xpY2soKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLnNldERlY2lzaW9uKVxuICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW0sIGl0ZW0uZGVjaXNpb25TdGF0dXMuZGVjaXNpb25zWzBdKTtcbiAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLnNldERlY2lzaW9uLmNhbGxzLnJlc2V0KCk7XG5cbiAgICAgICAgLy9DbGljayByZW1lZGlhdGVcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHRvcEJ1dHRvbnNbMV0pLmNsaWNrKCk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbilcbiAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtLCBpdGVtLmRlY2lzaW9uU3RhdHVzLmRlY2lzaW9uc1sxXSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ2FkZHMgY29tbWVudCB3aGVuIENvbW1lbnQgYnV0dG9uIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSksXG4gICAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChpdGVtKSxcbiAgICAgICAgICAgIG1lbnVPcHRpb25zID0gZmluZE1lbnVJdGVtcyhlbGVtZW50KSxcbiAgICAgICAgICAgIGNvbW1lbnRUZXh0ID0gJ3NvbWUgZHVtYiBjb21tZW50JyxcbiAgICAgICAgICAgIGNlcnRFZGl0YWJsZSA9IHRydWUsXG4gICAgICAgICAgICBjZXJ0ID0ge1xuICAgICAgICAgICAgICAgIGlkOiAnc29tZWNlcnQnXG4gICAgICAgICAgICB9O1xuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdpc0NlcnRpZmljYXRpb25FZGl0YWJsZScpLmFuZC5jYWxsRmFrZSgoKSA9PiB7IHJldHVybiBjZXJ0RWRpdGFibGU7fSk7XG4gICAgICAgIHNweU9uKGNvbW1lbnRTZXJ2aWNlLCAnb3BlbkNvbW1lbnREaWFsb2cnKS5hbmRcbiAgICAgICAgICAgIC5yZXR1cm5WYWx1ZSh0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlKGZhbHNlLCBjb21tZW50VGV4dCkpO1xuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ3Bvc3RDb21tZW50Jyk7XG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dldENlcnRpZmljYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoY2VydCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChtZW51T3B0aW9uc1swXSkuZmluZCgnYScpLmNsaWNrKCk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnBvc3RDb21tZW50KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0LmlkLCBpdGVtLmlkLCBjb21tZW50VGV4dCk7XG5cbiAgICB9KTtcblxuICAgIGl0ICgnc2hvd3MgdGhlIGhpc3RvcnkgZGlhbG9nIHdoZW4gSGlzdG9yeSBidXR0b24gaXMgY2xpY2tlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWRdKSxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGl0ZW0pLFxuICAgICAgICAgICAgbWVudU9wdGlvbnMgPSBmaW5kTWVudUl0ZW1zKGVsZW1lbnQpO1xuXG4gICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2UoKSxcbiAgICAgICAgICAgICAgICBzZXRUaXRsZTogKHRpdGxlKSA9PiB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYW5ndWxhci5lbGVtZW50KG1lbnVPcHRpb25zWzFdKS5maW5kKCdhJykuY2xpY2soKTtcblxuICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGxldCBzcE1vZGFsQXJncyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJncztcbiAgICAgICAgZXhwZWN0KHNwTW9kYWxBcmdzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KHNwTW9kYWxBcmdzWzBdLnJlc29sdmUuY2hhbGxlbmdlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3Qoc3BNb2RhbEFyZ3NbMF0ucmVzb2x2ZS5jZXJ0SWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChzcE1vZGFsQXJnc1swXS5yZXNvbHZlLml0ZW1JZCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KHNwTW9kYWxBcmdzWzBdLmNvbnRyb2xsZXIpLnRvRXF1YWwoJ0lkZW50aXR5SGlzdG9yeURpYWxvZ0N0cmwnKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNsaWNrTWVudUl0ZW0oZWxlbWVudCwgbGFiZWxUZXh0KSB7XG4gICAgICAgIGxldCBtZW51T3B0aW9ucyA9IGZpbmRNZW51SXRlbXMoZWxlbWVudCk7XG4gICAgICAgIGxldCBtZW51SXRlbSA9IG1lbnVPcHRpb25zLmZpbmQoYGE6Y29udGFpbnMoJyR7bGFiZWxUZXh0fScpYCk7XG4gICAgICAgIGV4cGVjdChtZW51SXRlbS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIG1lbnVJdGVtLmNsaWNrKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdERldGFpbFBvcHVwKG1lbnVJdGVtID0gJ0RldGFpbHMnKSB7XG4gICAgICAgIGxldCBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkXSk7XG5cbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q2VydGlmaWNhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh7IGlkOiAnY2VydElkJyB9KTtcbiAgICAgICAgY3JlYXRlRWxlbWVudChpdGVtKTtcbiAgICAgICAgY2xpY2tNZW51SXRlbShlbGVtZW50LCBtZW51SXRlbSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSB0byBzaG93IGRldGFpbCBkaWFsb2cnLCAoKSA9PiB7XG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSwgJ3Nob3dEZXRhaWxEaWFsb2cnKTtcbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLCAnaGFzRGV0YWlscycpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgbGV0IGl0ZW0gPSB0ZXN0RGV0YWlsUG9wdXAoKTtcbiAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZS5zaG93RGV0YWlsRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY2VydElkJywgaXRlbSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FsbHMgdGhyb3VnaCB0byBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UgdG8gc2hvdyBhY2NvdW50IGRldGFpbCBkaWFsb2cnLCAoKSA9PiB7XG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSwgJ3Nob3dBY2NvdW50RGV0YWlsRGlhbG9nJyk7XG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSwgJ2hhc0FjY291bnREZXRhaWxzJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICBsZXQgaXRlbSA9IHRlc3REZXRhaWxQb3B1cCgnQWNjb3VudCBEZXRhaWxzJyk7XG4gICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2Uuc2hvd0FjY291bnREZXRhaWxEaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjZXJ0SWQnLCBpdGVtKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kQWN0aW9uU3RhdHVzIHNob3VsZCByZXR1cm4gY29ycmVjdCBzdGF0dXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkXSxcbiAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNvbXBsZXRlKSxcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGl0ZW0pO1xuXG4gICAgICAgIGV4cGVjdChjdHJsLmZpbmRBY3Rpb25TdGF0dXMoeyBzdGF0dXM6IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkIH0pLm5hbWUpXG4gICAgICAgICAgICAudG9CZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XG5cbiAgICAgICAgZXhwZWN0KGN0cmwuZmluZEFjdGlvblN0YXR1cyh7c3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWR9KS5uYW1lKVxuICAgICAgICAgICAgLnRvQmUoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcblxuICAgICAgICBleHBlY3QoY3RybC5maW5kQWN0aW9uU3RhdHVzKHtzdGF0dXM6IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkfSkubmFtZSlcbiAgICAgICAgICAgIC50b0JlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkKTtcblxuICAgICAgICBleHBlY3QoY3RybC5maW5kQWN0aW9uU3RhdHVzKHtzdGF0dXM6ICdmb28nfSkpLnRvQmVVbmRlZmluZWQoKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2V0cyBjbGFzcyBpZiBkZXBlbmRlbnQgZGVjaXNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLk9wZW4pLFxuICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoaXRlbSksXG4gICAgICAgICAgICBkZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICByZXZva2VkUm9sZXM6IFsnUm9sZTEnLCAnUm9sZTInXSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdSZW1lZGlhdGVkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvcEJ1dHRvbnMgPSBlbGVtZW50LmZpbmQoJy5jZXJ0LWFjdGlvbi1jb2x1bW4gPiBidXR0b246bm90KC5kcm9wZG93bi10b2dnbGUpJyk7XG5cbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucywgJ2dldERlY2lzaW9uJykuYW5kLnJldHVyblZhbHVlKHVuZGVmaW5lZCk7XG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXRTb3VyY2VEZWNpc2lvbnMnKS5hbmQucmV0dXJuVmFsdWUoW2RlY2lzaW9uXSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BCdXR0b25zWzBdKS5oYXNDbGFzcygnY2VydC1hY3Rpb24tY3VycmVudC1kZWNpc2lvbicpKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzU291cmNlSXRlbVVuZG9uZSgpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSwgY3RybCwgc291cmNlRGVjaXNpb247XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5Db21wbGV0ZSk7XG4gICAgICAgICAgICBpdGVtLmRlY2lzaW9uU3RhdHVzLnNvdXJjZUl0ZW1JZCA9ICc1Njc4JztcbiAgICAgICAgICAgIGl0ZW0uZGVjaXNpb25TdGF0dXMuZGVwZW5kZW50RGVjaXNpb24gPSB0cnVlO1xuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoaXRlbSk7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RGVjaXNpb24nKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VEZWNpc2lvbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBub3QgYSBkZXBlbmRlbnQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBpdGVtLmRlY2lzaW9uU3RhdHVzLmRlcGVuZGVudERlY2lzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1NvdXJjZUl0ZW1VbmRvbmUoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5vIHNvdXJjZSBpdGVtIGlkJywgKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGl0ZW0uZGVjaXNpb25TdGF0dXMuc291cmNlSXRlbUlkO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTb3VyY2VJdGVtVW5kb25lKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBubyBkZWNpc2lvbiBpbiB0aGUgc3RvcmUgZm9yIHNvdXJjZSBpdGVtJywgKCkgPT4ge1xuICAgICAgICAgICAgc291cmNlRGVjaXNpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1NvdXJjZUl0ZW1VbmRvbmUoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgZGVjaXNpb24gaW4gdGhlIHN0b3JlIHdpdGggZGlmZmVyZW50IHN0YXR1cycsICgpID0+IHtcbiAgICAgICAgICAgIHNvdXJjZURlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ1VuZG8nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTb3VyY2VJdGVtVW5kb25lKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzSW5kaXJlY3RBY2NvdW50RGVjaXNpb25VbmRvbmUnLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtLCBjdHJsO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKFsgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmV2b2tlQWNjb3VudF0sXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJldm9rZUFjY291bnQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNvbXBsZXRlKTtcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBub3QgdW5kb2luZyBhbiBhY2NvdW50IGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucywgJ2lzQWNjb3VudERlY2lzaW9uVW5kbycpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0luZGlyZWN0QWNjb3VudERlY2lzaW9uVW5kb25lKHt9KSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGlzIGEgZGlyZWN0IGRlY2lzaW9uIHRoYXQgdW5kb2VzIGFuIGFjY291bnQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGl0ZW0sXG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoeyBzdGF0dXM6IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkIH0pKTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdpc0FjY291bnREZWNpc2lvblVuZG8nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUoZGVjaXNpb24pO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNJbmRpcmVjdEFjY291bnREZWNpc2lvblVuZG9uZShkZWNpc2lvbikpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGlzIGFuIGluZGlyZWN0IHVuZG8gZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb24xID0gY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCksXG4gICAgICAgICAgICAgICAgZGVjaXNpb24yID0gY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkKTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdpc0FjY291bnREZWNpc2lvblVuZG8nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICAvLyBNaW1pYyBhbiBpbmRpcmVjdCBkZWNpc2lvbiBieSB1c2luZyBub24tbWF0Y2hpbmcgZGVjaXNpb25zLlxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucywgJ2dldEVmZmVjdGl2ZURlY2lzaW9uJykuYW5kLnJldHVyblZhbHVlKGRlY2lzaW9uMSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0luZGlyZWN0QWNjb3VudERlY2lzaW9uVW5kb25lKGRlY2lzaW9uMikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEN1cnJlbnREZWNpc2lvbigpJywgKCkgPT4ge1xuXG4gICAgICAgIGxldCBpdGVtLCBjdHJsLCB1bnNhdmVkRGVjaXNpb247XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZF0pO1xuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoaXRlbSk7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bnNhdmVkRGVjaXNpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVuc2F2ZWREZWNpc2lvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgYWN0aW9uIHN0YXR1cyBmb3IgY3VycmVudCBkZWNpc2lvbiBpZiB1bnNhdmVkIGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgdW5zYXZlZERlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ1JlbWVkaWF0ZWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0Q3VycmVudERlY2lzaW9uKCkpLnRvRXF1YWwoaXRlbS5kZWNpc2lvblN0YXR1cy5kZWNpc2lvbnNbMV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBzYXZlZCBhY3Rpb24gc3RhdHVzIGlmIG5vIHVuc2F2ZWQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBpdGVtLmRlY2lzaW9uU3RhdHVzLmN1cnJlbnRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQXBwcm92ZWQnLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ0FwcHJvdmVkJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0Q3VycmVudERlY2lzaW9uKCkpLnRvRXF1YWwoaXRlbS5kZWNpc2lvblN0YXR1cy5jdXJyZW50U3RhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBVbmRvIHN0YXR1cyBpZiBzb3VyY2UgaXRlbSBpcyB1bmRvbmUgYW5kIG5vIHVuc2F2ZWQgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNTb3VyY2VJdGVtVW5kb25lJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0Q3VycmVudERlY2lzaW9uKCkuc3RhdHVzKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgYWN0aW9uIHN0YXR1cyBmb3IgY3VycmVudCBkZWNpc2lvbiBpZiB1bnNhdmVkIGRlY2lzaW9uIGlmIHNvdXJjZSBpdGVtIGlzIHVuZG9uZScsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc1NvdXJjZUl0ZW1VbmRvbmUnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICB1bnNhdmVkRGVjaXNpb24gPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnQXBwcm92ZWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0Q3VycmVudERlY2lzaW9uKCkpLnRvRXF1YWwoaXRlbS5kZWNpc2lvblN0YXR1cy5kZWNpc2lvbnNbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB1bmRvIHN0YXR1cyBpZiBpbmRpcmVjdCBhY2NvdW50IGRlY2lzaW9uIHVuZG8nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNJbmRpcmVjdEFjY291bnREZWNpc2lvblVuZG9uZScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIHVuc2F2ZWREZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRDdXJyZW50RGVjaXNpb24oKS5zdGF0dXMpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkNsZWFyZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBkZWNpc2lvbiBzdGF0dXMgaWYgZGlyZWN0IGFjY291bnQgZGVjaXNpb24gdW5kbycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc0luZGlyZWN0QWNjb3VudERlY2lzaW9uVW5kb25lJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHVuc2F2ZWREZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRDdXJyZW50RGVjaXNpb24oKS5zdGF0dXMpLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNDdXJyZW50RGVjaXNpb24oKScsICgpID0+IHtcblxuICAgICAgICBsZXQgaXRlbSwgY3RybCwgdW5zYXZlZERlY2lzaW9uLCB1bnNhdmVkU291cmNlRGVjaXNpb247XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZF0pO1xuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoaXRlbSk7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bnNhdmVkRGVjaXNpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXRTb3VyY2VEZWNpc2lvbnMnKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdW5zYXZlZFNvdXJjZURlY2lzaW9uXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdW5zYXZlZERlY2lzaW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdW5zYXZlZFNvdXJjZURlY2lzaW9uID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBkZWNpc2lvbiBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0N1cnJlbnREZWNpc2lvbigpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgRGVsZWdhdGlvbiBSZXZpZXcgc291cmNlIGl0ZW0gaXMgdW5kb25lIGFuZCBkZWNpc2lvbiBpcyBub3QgQ2xlYXJlZCcsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc0RlbGVnYXRlZEl0ZW0nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNTb3VyY2VJdGVtVW5kb25lJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDdXJyZW50RGVjaXNpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdSZW1lZGlhdGVkJ1xuICAgICAgICAgICAgfSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIERlbGVnYXRpb24gUmV2aWV3IHNvdXJjZSBpdGVtIGlzIHVuZG9uZSBhbmQgZGVjaXNpb24gaXMgQ2xlYXJlZCcsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc0RlbGVnYXRlZEl0ZW0nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNTb3VyY2VJdGVtVW5kb25lJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDdXJyZW50RGVjaXNpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdDbGVhcmVkJ1xuICAgICAgICAgICAgfSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgYW4gdW5zYXZlZCBkZWNpc2lvbiBmb3IgdGhlIGl0ZW0gYW5kIGl0IG1hdGNoZXMnLCAoKSA9PiB7XG4gICAgICAgICAgICB1bnNhdmVkRGVjaXNpb24gPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnUmVtZWRpYXRlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0N1cnJlbnREZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1JlbWVkaWF0ZWQnXG4gICAgICAgICAgICB9KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgYW4gdW5zYXZlZCBkZWNpc2lvbiBmb3IgdGhlIGl0ZW0gYW5kIGl0IGRvZXMgbm90IG1hdGNoJywgKCkgPT4ge1xuICAgICAgICAgICAgdW5zYXZlZERlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ1JlbWVkaWF0ZWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDdXJyZW50RGVjaXNpb24oe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgIH0pKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBhbiB1bnNhdmVkIGRlY2lzaW9uIGZvciB0aGUgc291cmNlIGl0ZW0gYW5kIGl0IG1hdGNoZXMnLCAoKSA9PiB7XG4gICAgICAgICAgICB1bnNhdmVkU291cmNlRGVjaXNpb24gPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnUmVtZWRpYXRlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0N1cnJlbnREZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1JlbWVkaWF0ZWQnXG4gICAgICAgICAgICB9KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgYW4gdW5zYXZlZCBkZWNpc2lvbiBmb3IgdGhlIHNvdXJjZSBpdGVtIGFuZCBpdCBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICAgICAgICAgIHVuc2F2ZWRTb3VyY2VEZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdSZW1lZGlhdGVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ3VycmVudERlY2lzaW9uKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQXBwcm92ZWQnXG4gICAgICAgICAgICB9KSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgc3RhdHVzIG1hdGNoZXMgYW5kIGRlbGVnYXRpb25SZXZpZXdBY3Rpb24gbWF0Y2hlcycsICgpID0+IHtcbiAgICAgICAgICAgIHVuc2F2ZWREZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdSZW1lZGlhdGVkJyxcbiAgICAgICAgICAgICAgICBkZWxlZ2F0aW9uUmV2aWV3QWN0aW9uOiAnQWNjZXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ3VycmVudERlY2lzaW9uKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdSZW1lZGlhdGVkJyxcbiAgICAgICAgICAgICAgICBkZWxlZ2F0aW9uUmV2aWV3QWN0aW9uOiAnQWNjZXB0J1xuICAgICAgICAgICAgfSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHN0YXR1cyBtYXRjaGVzIGFuZCBkZWxlZ2F0aW9uUmV2aWV3QWN0aW9uIGRvZXMgbm90IG1hdGNoJywgKCkgPT4ge1xuICAgICAgICAgICAgdW5zYXZlZERlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ1JlbWVkaWF0ZWQnLFxuICAgICAgICAgICAgICAgIGRlbGVnYXRpb25SZXZpZXdBY3Rpb246ICdBY2NlcHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDdXJyZW50RGVjaXNpb24oe1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ1JlbWVkaWF0ZWQnLFxuICAgICAgICAgICAgICAgIGRlbGVnYXRpb25SZXZpZXdBY3Rpb246ICdSZWplY3QnXG4gICAgICAgICAgICB9KSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgc3RhdHVzIGlzIENsZWFyZWQgYW5kIHdlIGhhdmUgYW4gdW5zYXZlZCBpbmRpcmVjdCBhY2NvdW50IHVuZG8gZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjdHJsLCAnaXNJbmRpcmVjdEFjY291bnREZWNpc2lvblVuZG9uZScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIHVuc2F2ZWREZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0N1cnJlbnREZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NsZWFyZWQnXG4gICAgICAgICAgICB9KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNFZGl0ZWQoKScsICgpID0+IHtcblxuICAgICAgICBsZXQgaXRlbSwgY3RybCwgdW5zYXZlZERlY2lzaW9uO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUNlcnRpZmljYXRpb25JdGVtKFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdKTtcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGl0ZW0pO1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucywgJ2dldEVmZmVjdGl2ZURlY2lzaW9uQnlJdGVtJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5zYXZlZERlY2lzaW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB1bnNhdmVkRGVjaXNpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGRlY2lzaW9uIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzRWRpdGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBkZWNpc2lvbiBpcyBub3QgZWRpdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgdW5zYXZlZERlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIGVkaXRlZDogZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0VkaXRlZCgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBkZWNpc2lvbiBpcyBlZGl0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICB1bnNhdmVkRGVjaXNpb24gPSB7XG4gICAgICAgICAgICAgICAgZWRpdGVkOiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNFZGl0ZWQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGRlc2NyaWJlKCdnZXRCdXR0b25EZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtLCBjdHJsO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXJXaXRoU3RhdHVzKHN0YXR1cywgcG9saWN5VHlwZSwgbm9SZW1lZGlhdGUpIHtcbiAgICAgICAgICAgIGxldCBzdGF0dXNlcyA9IFtDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQsXG4gICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1pdGlnYXRlZF07XG4gICAgICAgICAgICBpZiAobm9SZW1lZGlhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlcy5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShzdGF0dXNlcywgc3RhdHVzLCBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuV2FpdGluZ1JldmlldywgcG9saWN5VHlwZSk7XG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihpdGVtKTtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc1BvbGljeVZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc2NyaWJlKCdub24gcG9saWN5IHZpb2xhdGlvbiBkZWxlZ2F0ZWQgaXRlbXMuJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ1JvbGUgc2hvdWxkIHJldHVybiBSZW1lZGlhdGVkIGZvciBBcHByb3ZlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyV2l0aFN0YXR1cyhDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEJ1dHRvbkRlY2lzaW9ucygpWzFdLm5hbWUpLnRvQmUoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdSb2xlIHNob3VsZCByZXR1cm4gQXBwcm92ZWQgZm9yIFJlbWVkaWF0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcldpdGhTdGF0dXMoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEJ1dHRvbkRlY2lzaW9ucygpWzFdLm5hbWUpLnRvQmUoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnUm9sZSBzaG91bGQgcmV0dXJuIFJlbWVkaWF0ZWQgZm9yIE1pdGlnYXRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyV2l0aFN0YXR1cyhDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5nZXRCdXR0b25EZWNpc2lvbnMoKVsxXS5uYW1lKS50b0JlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRNZW51RGVjaXNpb25zKCknLCAoKSA9PiB7XG4gICAgICAgIGxldCBpdGVtLCBjdHJsO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUl0ZW0oc3RhdHVzKSB7XG4gICAgICAgICAgICBsZXQgbG9jYWxJdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oW0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQsXG4gICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFja25vd2xlZGdlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWRdLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkLFxuICAgICAgICAgICAgICAgIHN0YXR1cyk7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxJdGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIERlbGVnYXRlZCBpZiBzdW1tYXJ5U3RhdHVzIGlzIENoYWxsZW5nZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlSXRlbShDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ2hhbGxlbmdlZCk7XG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihpdGVtKTtcbiAgICAgICAgICAgIGxldCBtZW51ID0gY3RybC5nZXRNZW51RGVjaXNpb25zKCk7XG4gICAgICAgICAgICBleHBlY3QobWVudS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3QobWVudVswXS5uYW1lKS50b0JlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BY2tub3dsZWRnZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBEZWxlZ2F0ZWQgaWYgc3VtbWFyeVN0YXR1cyBpcyBub3QgQ2hhbGxlbmdlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVJdGVtKCk7XG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihpdGVtKTtcbiAgICAgICAgICAgIGxldCBtZW51ID0gY3RybC5nZXRNZW51RGVjaXNpb25zKCk7XG4gICAgICAgICAgICBleHBlY3QobWVudS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICBleHBlY3QobWVudVswXS5uYW1lKS50b0JlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQpO1xuICAgICAgICAgICAgZXhwZWN0KG1lbnVbMV0ubmFtZSkudG9CZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQWNrbm93bGVkZ2VkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaGFzTWVudUFjdGlvbigpJywgKCkgPT4ge1xuICAgICAgICBsZXQgaXRlbSwgY3RybDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQWNrbm93bGVkZ2VkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1pdGlnYXRlZF0sXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5PcGVuKTtcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBjdXJyZW50IGRlY2lzaW9uIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQucmV0dXJuVmFsdWUobnVsbCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc01lbnVBY3Rpb24oKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGN1cnJlbnQgZGVjaXNpb24gaXMgYSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQucmV0dXJuVmFsdWUoXG4gICAgICAgICAgICAgICAgY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc01lbnVBY3Rpb24oKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGN1cnJlbnQgZGVjaXNpb24gZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQucmV0dXJuVmFsdWUoXG4gICAgICAgICAgICAgICAgY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5DbGVhcmVkKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaGFzTWVudUFjdGlvbigpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBjdXJyZW50IGRlY2lzaW9uIGlzIGEgbWVudSBhY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQucmV0dXJuVmFsdWUoXG4gICAgICAgICAgICAgICAgY3JlYXRlQ2VydGlmaWNhdGlvbkRlY2lzaW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBleHBlY3QoY3RybC5oYXNNZW51QWN0aW9uKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbWFrZURlY2lzaW9uKCknLCAoKSA9PiB7XG4gICAgICAgIGxldCBjdHJsLCBpdGVtO1xuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbShbQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkLFxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1pdGlnYXRlZF0sXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5PcGVuKTtcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGl0ZW0pO1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLCAnc2V0RGVjaXNpb24nKS5hbmQuY2FsbEZha2UoKCkgPT4gJHEud2hlbigpKTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25BY3Rpb25zRmFjdG9yeVNlcnZpY2UsICdnZXRDZXJ0aWZpY2F0aW9uQWN0aW9ucycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgaW5pdGlhbGl6ZUFjdGlvbnMgYWZ0ZXIgc2V0RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBjdHJsLm1ha2VEZWNpc2lvbihuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7c3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWR9KSk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkFjdGlvbnNGYWN0b3J5U2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uQWN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd2aWV3L2VkaXQgZGVjaXNpb25zJywgKCkgPT4ge1xuICAgICAgICBsZXQgY3RybCwgaXRlbTtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVDZXJ0aWZpY2F0aW9uSXRlbSgpO1xuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdjYW5WaWV3RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBpdCgncmV0dXJuIGNhbGxzIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5jYW5WaWV3RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9ICdhYmNkJztcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UsICdjYW5WaWV3RGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUodmFsKTtcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsID0gY3RybC5jYW5WaWV3RGVjaXNpb24oKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmNhblZpZXdEZWNpc2lvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJldHVyblZhbCkudG9FcXVhbCh2YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdjYW5FZGl0RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBpdCgncmV0dXJuIGNhbGxzIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5jYW5FZGl0RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9ICdhYmNkJztcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UsICdjYW5FZGl0RGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUodmFsKTtcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsID0gY3RybC5jYW5FZGl0RGVjaXNpb24oKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmNhbkVkaXREZWNpc2lvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJldHVyblZhbCkudG9FcXVhbCh2YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdlZGl0RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBpdCgnY2FsbHMgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmVkaXREZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UsICdlZGl0RGVjaXNpb24nKTtcbiAgICAgICAgICAgICAgICBjdHJsLmVkaXREZWNpc2lvbigpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuZWRpdERlY2lzaW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndmlld0RlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ2NhbGxzIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS52aWV3RGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLCAndmlld0RlY2lzaW9uJyk7XG4gICAgICAgICAgICAgICAgY3RybC52aWV3RGVjaXNpb24oKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLnZpZXdEZWNpc2lvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
