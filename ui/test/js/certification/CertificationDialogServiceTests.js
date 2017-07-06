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

            describe('certificationDialogService', function () {

                var CertificationDecision = undefined,
                    CertificationItem = undefined,
                    certificationDataService = undefined,
                    certificationDialogService = undefined,
                    commentService = undefined,
                    $q = undefined,
                    $scope = undefined,
                    cert = undefined,
                    certItem = undefined,
                    certificationTestData = undefined,
                    CertificationActionStatus = undefined,
                    spModal = undefined;

                function getStatus(status) {
                    return new CertificationActionStatus({
                        status: status
                    });
                }

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 12 */
                beforeEach(inject(function ($rootScope, _CertificationDecision_, _certificationTestData_, _certificationDataService_, _certificationDialogService_, _commentService_, _$q_, _CertificationItem_, Certification, CertificationConfig, _CertificationActionStatus_, _spModal_) {
                    certificationDataService = _certificationDataService_;
                    CertificationDecision = _CertificationDecision_;
                    certificationDialogService = _certificationDialogService_;
                    CertificationItem = _CertificationItem_;
                    $q = _$q_;
                    commentService = _commentService_;
                    $scope = $rootScope.$new();
                    certificationTestData = _certificationTestData_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    spModal = _spModal_;

                    // Create some data to test with.
                    cert = new Certification(certificationTestData.CERTIFICATION_1);
                    certItem = new CertificationItem(certificationTestData.CERT_ITEMS[1]);

                    // Initialize the data service with a cert.
                    certificationDataService.initialize(cert);

                    // Setup the config in the service.
                    certificationDataService.initializeConfiguration(new CertificationConfig({
                        statusesRequiringComments: ['Mitigated'],
                        mitigationExpirationDate: new Date()
                    }));
                }));

                function testDialogRequired(certItem, status, expectRequired) {
                    var showFunction = undefined;
                    certificationDialogService.getDialog(certItem, status).then(function (returnedShowFunc) {
                        showFunction = returnedShowFunc;
                    });
                    $scope.$apply();
                    expect(!!showFunction).toEqual(expectRequired);
                }

                function testCertificationDecision(decision, certItem, status, comments) {
                    expect(decision).toBeDefined();
                    expect(decision.certificationItem).toEqual(certItem);
                    expect(decision.status).toEqual(status);
                    expect(decision.comments).toEqual(comments);
                }

                describe('getDialog()', function () {

                    beforeEach(function () {
                        spyOn(spModal, 'open').and.callThrough();
                    });

                    function getDialog(spyMethod) {
                        if (spyMethod) {
                            spyOn(certificationDialogService, spyMethod).and.returnValue($q.when(true));
                        }
                        var dialog = undefined;
                        certificationDialogService.getDialog(certItem, getStatus('Approved')).then(function (showFunc) {
                            return dialog = showFunc;
                        });
                        $scope.$apply();
                        return dialog;
                    }

                    function testDialog(spyMethod) {
                        var dialog = getDialog(spyMethod);
                        expect(dialog).not.toBeUndefined();
                        dialog();
                    }

                    it('returns comment dialog if comments are required', function () {
                        spyOn(commentService, 'openCommentDialog').and.callThrough();
                        testDialog('isCommentDialogRequired');
                        expect(commentService.openCommentDialog).toHaveBeenCalled();
                    });

                    it('returns policy violation dialog if item is a policy violation', function () {
                        spyOn(certificationDialogService, 'showViolationRevocationDialog');
                        testDialog('isPolicyViolationRevocation');
                        expect(certificationDialogService.showViolationRevocationDialog).toHaveBeenCalled();
                    });

                    it('returns non-policy violation revocation dialog if it is revocation with summary', function () {
                        spyOn(certificationDialogService, 'showNonViolationRevocationDialog');
                        testDialog('isRevocationWithSummary');
                        expect(certificationDialogService.showNonViolationRevocationDialog).toHaveBeenCalled();
                    });

                    it('returns blocked by parent dialog if there is parent decision', function () {
                        spyOn(certificationDialogService, 'showBlockedByParentDialog');
                        testDialog('isBlockedByParentDecision');
                        expect(certificationDialogService.showBlockedByParentDialog).toHaveBeenCalled();
                    });

                    it('returns undefined if no dialogs are enabled', function () {
                        var dialog = getDialog(null);
                        expect(dialog).toBeUndefined();
                    });

                    it('does not call further dialog checks if a dialog is shown', function () {
                        spyOn(certificationDialogService, 'isPolicyViolationRevocation');
                        testDialog('isCommentDialogRequired');
                        expect(certificationDialogService.isPolicyViolationRevocation).not.toHaveBeenCalled();
                    });

                    it('Returns allow exceptions dialog', function () {
                        spyOn(certificationDialogService, 'showAllowExceptionDialog');
                        testDialog('isAllowExceptionDialogRequired');
                        expect(certificationDialogService.showAllowExceptionDialog).toHaveBeenCalled();
                    });
                });

                it('comment dialog resolves with a cert decision with comments', function () {
                    // Setup some spies to show the dialog and resolve it with a comment.
                    spyOn(certificationDialogService, 'isCommentDialogRequired').and.returnValue($q.when(true));
                    var commentText = 'blah blah';
                    spyOn(commentService, 'openCommentDialog').and.callFake(function () {
                        return $q.when(commentText);
                    });

                    // Make this a Challenged item so we can test oneStep Accept
                    certItem.summaryStatus = CertificationItem.Status.Challenged;

                    // Open the comment dialog.
                    var decision = undefined;
                    certificationDialogService.showCommentDialog(certItem, getStatus('Approved')).then(function (commentDecision) {
                        decision = commentDecision;
                    });
                    $scope.$apply();
                    expect(commentService.openCommentDialog).toHaveBeenCalled();

                    // Check that the CertificationDecision is correct.
                    testCertificationDecision(decision, certItem, 'Approved', commentText);
                    expect(decision.oneStepChallenge).toEqual(true);
                    expect(decision.challengeAction).toEqual(CertificationActionStatus.ChallengeAction.Accept);
                });

                describe('getChallengeCommentIfRequired', function () {

                    it('opens comment dialog when item is in challenged state', function () {
                        spyOn(commentService, 'openCommentDialog').and.callThrough();

                        certItem.summaryStatus = CertificationItem.Status.Challenged;

                        certificationDialogService.getChallengeCommentIfRequired(certItem, 'Accept');

                        expect(commentService.openCommentDialog).toHaveBeenCalled();
                    });

                    it('returns promise that resolves with null when item is not in challenged state', function () {
                        certificationDialogService.getChallengeCommentIfRequired(certItem, 'Accept').then(function (nullpromise) {
                            expect(nullpromise).toBe(null);
                        });
                    });
                });

                describe('showCommentDialog', function () {

                    it('opens comment dialog with comments and readOnly', function () {
                        spyOn(commentService, 'openCommentDialog').and.callThrough();

                        certItem.summaryStatus = CertificationItem.Status.Challenged;
                        var comment = 'this is a comment',
                            existingDecision = { 'comments': comment };
                        certificationDialogService.showCommentDialog(certItem, 'Approved', existingDecision, true);

                        expect(commentService.openCommentDialog).toHaveBeenCalledWith(null, null, comment, true);
                    });
                });

                describe('isCommentDialogRequired', function () {
                    var requiresComments = undefined;

                    beforeEach(function () {
                        spyOn(certificationDataService.getConfiguration(), 'doesStatusRequireComment').and.returnValue(requiresComments);
                    });

                    it('is not required for a status not requiring a comment', function () {
                        requiresComments = true;
                        testDialogRequired(certItem, getStatus('Approved'), false);
                    });

                    it('is required for a status requiring a comment', function () {
                        requiresComments = false;
                        testDialogRequired(certItem, getStatus('Approved'), true);
                    });
                });

                describe('isRevocation()', function () {
                    it('returns true for the remediated status', function () {
                        var isIt = certificationDialogService.isRevocation(new CertificationActionStatus({ status: 'Remediated' }));
                        expect(isIt).toEqual(true);
                    });

                    it('returns false for statuses other than remediated', function () {
                        var isIt = certificationDialogService.isRevocation(new CertificationActionStatus({ status: 'Approved' }));
                        expect(isIt).toEqual(false);
                    });
                });

                describe('checkPolicyViolationRevocation()', function () {
                    function testPolicyViolation(type, decision, expectIt) {
                        certItem.type = type;
                        var isIt = certificationDialogService.checkPolicyViolationRevocation(certItem, new CertificationActionStatus({
                            status: decision,
                            delegationReviewAction: CertificationActionStatus.DelegationAction.Reject
                        }));
                        expect(isIt).toEqual(expectIt);
                    }

                    it('returns true for a policy violation item with a revocation status', function () {
                        testPolicyViolation(CertificationItem.Type.PolicyViolation, 'Remediated', true);
                    });

                    it('returns false for a revoke of a non-policy violation', function () {
                        testPolicyViolation(CertificationItem.Type.Entitlement, 'Remediated', false);
                    });

                    it('returns false for a non-revoke of a policy violation', function () {
                        testPolicyViolation(CertificationItem.Type.PolicyViolation, 'Approved', false);
                    });
                });

                describe('isPolicyViolationRevocation()', function () {
                    var checkValue = false;

                    beforeEach(function () {
                        checkValue = false;
                        spyOn(certificationDialogService, 'checkPolicyViolationRevocation').and.callFake(function () {
                            return checkValue;
                        });
                    });

                    it('is not required when checkPolicyViolationRevocation returns false', function () {
                        checkValue = false;
                        testDialogRequired(certItem, getStatus('Remediated'), false);
                    });

                    it('is required when checkPolicyViolationRevocation returns true', function () {
                        checkValue = true;
                        testDialogRequired(certItem, getStatus('Remediated'), true);
                    });
                });

                describe('checkRevocationWithSummary()', function () {
                    it('returns false if not revocation', function () {
                        expect(certificationDialogService.checkRevocationWithSummary(certItem, new CertificationActionStatus({ status: 'Approved' }))).toEqual(false);
                    });

                    it('returns false if revocation but summary not needed', function () {
                        spyOn(certificationDataService, 'needsRemediationSummary').and.returnValue(false);
                        expect(certificationDialogService.checkRevocationWithSummary(certItem, new CertificationActionStatus({ status: 'Remediated' }))).toEqual(false);
                    });

                    it('returns false if revocation with summary but is a rejected challenge', function () {
                        var status = new CertificationActionStatus({ status: 'Remediated', challengeAction: 'Reject' });
                        spyOn(certificationDataService, 'needsRemediationSummary').and.returnValue(true);
                        expect(certificationDialogService.checkRevocationWithSummary(certItem, status)).toEqual(false);
                    });

                    it('returns true if revocation and summary is needed', function () {
                        spyOn(certificationDataService, 'needsRemediationSummary').and.returnValue(true);
                        expect(certificationDialogService.checkRevocationWithSummary(certItem, new CertificationActionStatus({ status: 'Remediated' }))).toEqual(true);
                    });
                });

                describe('isRevocationWithSummary()', function () {
                    var checkValue = false;

                    beforeEach(function () {
                        checkValue = false;
                        spyOn(certificationDialogService, 'checkRevocationWithSummary').and.callFake(function () {
                            return checkValue;
                        });
                    });

                    it('is not required when checkAllowExceptionDialogRequired returns false', function () {
                        checkValue = false;
                        testDialogRequired(certItem, getStatus('Remediated'), false);
                    });

                    it('is required when checkAllowExceptionDialogRequired returns true', function () {
                        checkValue = true;
                        testDialogRequired(certItem, getStatus('Remediated'), true);
                    });
                });

                describe('isBlockedByParentDecision()', function () {
                    function createActionStatus(status, delegationReviewAction) {
                        return {
                            status: status,
                            name: status,
                            delegationReviewAction: delegationReviewAction
                        };
                    }

                    function testBlockedByParent(dependentDecision, status, sourceDecisions, expectIt, isChallenge) {
                        var testIt = undefined;
                        certItem.decisionStatus.dependentDecision = dependentDecision;
                        certItem.requiresChallengeDecision = isChallenge;
                        status.challengeAction = !!isChallenge ? 'Reject' : undefined;
                        spyOn(certificationDataService.decisions, 'getSourceDecisions').and.returnValue(sourceDecisions);
                        certificationDialogService.isBlockedByParentDecision(certItem, status).then(function (isIt) {
                            testIt = isIt;
                        });
                        $scope.$apply();
                        expect(testIt).toEqual(expectIt);
                    }

                    it('returns true if the item decision status is dependent', function () {
                        testBlockedByParent(true, createActionStatus('Remediated'), null, true);
                    });

                    it('returns true if there are source decisions', function () {
                        testBlockedByParent(false, createActionStatus('Remediated'), [{}, {}], true);
                    });

                    it('returns false if there are no dependent decisions', function () {
                        testBlockedByParent(false, createActionStatus('Remediated'), null, false);
                    });

                    it('returns false if it is an Accept delegation review', function () {
                        testBlockedByParent(true, createActionStatus('Remediated', 'Accept'), null, false);
                    });

                    it('returns false if it is a Reject delegation review', function () {
                        testBlockedByParent(true, createActionStatus('Remediated', 'Reject'), null, true);
                    });

                    it('returns false if item decision status is dependent, but is challenged', function () {
                        testBlockedByParent(true, createActionStatus('Remediated'), null, false, true);
                    });
                });

                describe('showViolationRevocationDialog()', function () {
                    var certificationService = undefined,
                        remediationAdviceResult = undefined;

                    beforeEach(inject(function (_certificationService_, RemediationAdviceResult) {
                        certificationService = _certificationService_;
                        spyOn(certificationService, 'getViolationRemediationAdvice').and.callFake(function () {
                            return $q.when(remediationAdviceResult);
                        });

                        spyOn(certificationDialogService, 'showRevocationDialog').and.callFake(function () {
                            return $q.when({});
                        });
                        remediationAdviceResult = new RemediationAdviceResult(angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT));
                    }));

                    it('gets the remediation advice and calls through to showRevocationDialog', function () {
                        var existingDecision = { status: 'Remediated' },
                            readOnly = true;
                        certificationDialogService.showViolationRevocationDialog(certItem, getStatus('Remediated'), existingDecision, readOnly);
                        $scope.$apply();
                        expect(certificationService.getViolationRemediationAdvice).toHaveBeenCalled();
                        expect(certificationDialogService.showRevocationDialog).toHaveBeenCalledWith(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary, existingDecision, readOnly);
                    });
                });

                describe('showNonViolationRevocationDialog()', function () {
                    var certificationService = undefined,
                        remediationAdviceResult = undefined;

                    beforeEach(inject(function (_certificationService_, RemediationAdviceResult) {
                        certificationService = _certificationService_;
                        spyOn(certificationService, 'getRemediationSummary').and.callFake(function () {
                            return $q.when(remediationAdviceResult.summary);
                        });

                        spyOn(certificationDialogService, 'showRevocationDialog').and.callFake(function () {
                            return $q.when({});
                        });
                        remediationAdviceResult = new RemediationAdviceResult(angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT));
                    }));

                    it('gets the remediation summary and calls through to showRevocationDialog', function () {
                        var existingDecision = { status: 'Remediated' },
                            readOnly = true;
                        certificationDialogService.showNonViolationRevocationDialog(certItem, getStatus('Remediated'), existingDecision, readOnly);
                        $scope.$apply();
                        expect(certificationService.getRemediationSummary).toHaveBeenCalled();
                        expect(certificationDialogService.showRevocationDialog).toHaveBeenCalledWith(certItem, getStatus('Remediated'), undefined, remediationAdviceResult.summary, existingDecision, readOnly);
                    });
                });

                describe('showRevocationDialog()', function () {
                    var certificationService = undefined,
                        spModal = undefined,
                        remediationAdviceResult = undefined,
                        modalResult = undefined;

                    beforeEach(inject(function (_certificationService_, _spModal_, RemediationAdviceResult) {
                        certificationService = _certificationService_;
                        spModal = _spModal_;

                        spyOn(certificationDialogService, 'isPolicyViolationRevocation').and.returnValue($q.when(true));

                        // Mock out the modal and either reject if no modalResult, or resolve with the result.
                        spyOn(spModal, 'open').and.callFake(function () {
                            return {
                                result: !modalResult ? $q.reject() : $q.when(modalResult)
                            };
                        });

                        remediationAdviceResult = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT);
                        remediationAdviceResult.advice = angular.copy(remediationAdviceResult.advice);
                        remediationAdviceResult.summary = angular.copy(remediationAdviceResult.summary);
                        remediationAdviceResult = new RemediationAdviceResult(remediationAdviceResult);
                    }));

                    it('resolves without opening modal if summary is defined with default remediator and no override' + 'along with revocation modification', function () {
                        var decision = undefined;

                        // Test data advice result already contains summary with default remediator
                        remediationAdviceResult.summary.enableOverrideDefaultRemediator = false;
                        spyOn(remediationAdviceResult.summary, 'isModifiable').and.returnValue(false);
                        spyOn(remediationAdviceResult.summary, 'hasRoleRevocationDetails').and.returnValue(false);
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary).then(function (result) {
                            decision = result;
                        });
                        $scope.$apply();
                        testCertificationDecision(decision, certItem, 'Remediated');
                        expect(spModal.open).not.toHaveBeenCalled();
                    });

                    it('rejects with reason if dialog should not be opened but existing decision is passed in', function () {
                        var decision = undefined,
                            rejectedReason = undefined;

                        // Test data advice result already contains summary with default remediator
                        remediationAdviceResult.summary.enableOverrideDefaultRemediator = false;
                        spyOn(remediationAdviceResult.summary, 'isModifiable').and.returnValue(false);
                        // Even with role revocation details dont open
                        spyOn(remediationAdviceResult.summary, 'hasRoleRevocationDetails').and.returnValue(true);
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary, {}, false).then(function (result) {
                            decision = result;
                        })['catch'](function (reason) {
                            return rejectedReason = reason;
                        });
                        $scope.$apply();
                        expect(decision).not.toBeDefined();
                        expect(rejectedReason).toBeDefined();
                        expect(spModal.open).not.toHaveBeenCalled();
                    });

                    it('opens modal if default remediator is set but override is enabled', function () {
                        spyOn(remediationAdviceResult.summary, 'isModifiable').and.returnValue(false);
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('opens modal if no default remediator', function () {
                        delete remediationAdviceResult.summary.defaultRemediator;
                        spyOn(remediationAdviceResult.summary, 'isModifiable').and.returnValue(false);
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('opens modal if revocation modifiable', function () {
                        remediationAdviceResult.summary.enableOverrideDefaultRemediator = false;
                        spyOn(remediationAdviceResult.summary, 'isModifiable').and.returnValue(true);
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('opens modal if role revocation details modifiable', function () {
                        remediationAdviceResult.summary.enableOverrideDefaultRemediator = false;
                        spyOn(remediationAdviceResult.summary, 'hasRoleRevocationDetails').and.returnValue(true);
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('opens modal if no summary', function () {
                        delete remediationAdviceResult.summary;
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    function testModalSize(isEntitlementSoD, expectedSize) {
                        // Give this entitlements to remediate for an SoD.
                        if (isEntitlementSoD) {
                            remediationAdviceResult.advice.entitlementsToRemediate = certificationTestData.POLICY_TREE_NODE;
                        }

                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        var modalConfig = spModal.open.calls.mostRecent().args[0];
                        expect(modalConfig.size).toEqual(expectedSize);
                    }

                    it('opens a large modal for entitlement SoD', function () {
                        testModalSize(true, 'lg');
                    });

                    it('opens a normal size modal for non-entitlement SoD', function () {
                        testModalSize(false, undefined);
                    });

                    it('returns rejected promise if dialog is canceled', function () {
                        var rejected = undefined;
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary).then(function () {
                            rejected = false;
                        }, function () {
                            rejected = true;
                        });
                        $scope.$apply();
                        expect(rejected).toEqual(true);
                    });

                    it('returns rejected empty promise if dialog is resolved but readOnly is true', function () {
                        var rejectedReason = undefined,
                            resolved = false;
                        modalResult = {
                            recipient: {
                                id: 'abcd'
                            }
                        };
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary, {}, true).then(function () {
                            return resolved = true;
                        })['catch'](function (reason) {
                            resolved = false;
                            rejectedReason = reason;
                        });
                        $scope.$apply();
                        expect(resolved).toEqual(false);
                        expect(rejectedReason).not.toBeDefined();
                    });

                    it('adds values to the decision from the dialog', function () {
                        var decision = undefined;

                        certItem.summaryStatus = CertificationItem.Status.Challenged;

                        modalResult = {
                            recipient: {
                                id: 'abcd'
                            },
                            comments: 'i said something',
                            revokedRoles: ['rol1', 'role2'],
                            selectedViolationEntitlements: [{
                                some: 'thing'
                            }],
                            remediationDetails: [{ newValue: 'yaddayadda' }]
                        };
                        certificationDialogService.showRevocationDialog(certItem, getStatus('Remediated'), remediationAdviceResult.advice, remediationAdviceResult.summary).then(function (result) {
                            decision = result;
                        });
                        $scope.$apply();
                        expect(decision.recipient).toEqual(modalResult.recipient.id);
                        expect(decision.recipientSummary).toEqual(modalResult.recipient);
                        expect(decision.comments).toEqual(modalResult.comments);
                        expect(decision.revokedRoles).toEqual(modalResult.revokedRoles);
                        expect(decision.selectedViolationEntitlements).toEqual(modalResult.selectedViolationEntitlements);
                        expect(decision.remediationDetails).toEqual(modalResult.remediationDetails);
                        expect(decision.oneStepChallenge).toEqual(true);
                        expect(decision.challengeAction).toEqual(CertificationActionStatus.ChallengeAction.Accept);
                    });
                });

                describe('showBlockedByParentDialog()', function () {
                    it('opens a dialog', function () {
                        spyOn(spModal, 'open').and.callThrough();
                        certificationDialogService.showBlockedByParentDialog(certItem);
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('always returns rejected promise', function () {
                        var promiseResolved = undefined;
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.when()
                        });
                        certificationDialogService.showBlockedByParentDialog(certItem).then(function () {
                            return promiseResolved = true;
                        })['catch'](function () {
                            return promiseResolved = false;
                        });
                        $scope.$apply();
                        expect(promiseResolved).toEqual(false);
                    });
                });

                describe('showCertificationDelegationDialog()', function () {
                    var certificationService = undefined,
                        description = 'Certify the Production SOD-893 violation on \'Donna Scott\'',
                        itemDecision = {
                        recipient: { id: '1234' },
                        comments: 'dfdeere',
                        description: 'some description'
                    };

                    beforeEach(inject(function (_certificationService_) {
                        certificationService = _certificationService_;
                        spyOn(certificationService, 'getDelegationDescription').and.callFake(function () {
                            return $q.when(description);
                        });
                        spyOn(certificationDialogService, 'showDelegationDialog').and.returnValue({
                            result: $q.when(itemDecision)
                        });
                    }));

                    it('creates an item decision', function () {
                        spyOn(CertificationDecision, 'createItemDecision');
                        certificationDialogService.showCertificationDelegationDialog(certItem, getStatus('Remediated'));
                        $scope.$apply();
                        expect(CertificationDecision.createItemDecision).toHaveBeenCalled();
                    });

                    it('gets a description and calls showDelegationDialog', function () {
                        certificationDialogService.showCertificationDelegationDialog(certItem, getStatus('Remediated'));
                        $scope.$apply();
                        expect(certificationService.getDelegationDescription).toHaveBeenCalled();
                        expect(certificationDialogService.showDelegationDialog).toHaveBeenCalled();
                    });

                    it('returns promise resolved with item decision', function () {
                        var decisionPromise = certificationDialogService.showCertificationDelegationDialog(certItem, getStatus('Remediated'));
                        $scope.$apply();

                        decisionPromise.then(function (decision) {
                            expect(decision.recipient).toEqual(itemDecision.recipient.id);
                            expect(decision.comments).toEqual(itemDecision.comments);
                            expect(decision.description).toEqual(itemDecision.description);
                        });
                    });
                });

                describe('showCertificationReassignDialog()', function () {
                    var certificationService = undefined,
                        bulkDecision = {
                        recipient: { id: '1234' },
                        comments: 'adfadsfasd',
                        description: 'adsfasdfasd'
                    };

                    beforeEach(inject(function (_certificationService_) {
                        certificationService = _certificationService_;

                        spyOn(certificationDialogService, 'showDelegationDialog').and.returnValue($q.when(bulkDecision));

                        // mock out decision store functions
                        certificationDataService.decisions = {
                            removeBulkOverlaps: function () {},
                            removeLineItemOverlaps: function () {}
                        };
                    }));

                    function setupSaveDecisionsSpy(reject) {
                        spyOn(certificationService, 'saveDecisions').and.returnValue(reject ? $q.reject({ status: 409 }) : $q.when({ data: { object: {} } }));
                    }

                    it('creates a bulk decision', function () {
                        setupSaveDecisionsSpy();
                        spyOn(CertificationDecision, 'createBulkDecision');
                        certificationDialogService.showCertificationReassignDialog(certItem);
                        $scope.$apply();
                        expect(CertificationDecision.createBulkDecision).toHaveBeenCalled();
                    });

                    it('calls showDelegationDialog', function () {
                        setupSaveDecisionsSpy();
                        certificationDialogService.showCertificationReassignDialog(certItem);
                        $scope.$apply();
                        expect(certificationDialogService.showDelegationDialog).toHaveBeenCalled();
                    });

                    it('calls saveDecisions', function () {
                        setupSaveDecisionsSpy();
                        certificationDialogService.showCertificationReassignDialog(certItem);
                        $scope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                    });

                    it('shows retry dialog if cert is locked', function () {
                        setupSaveDecisionsSpy(true);
                        spyOn(certificationDialogService, 'showRetryDialog').and.returnValue($q.when());
                        certificationDialogService.showCertificationReassignDialog(certItem);
                        $scope.$apply();
                        expect(certificationDialogService.showRetryDialog).toHaveBeenCalled();
                    });

                    it('shows error modal if saveDecisions returns error', function () {
                        spyOn(certificationService, 'saveDecisions').and.returnValue($q.when({
                            data: {
                                errors: ['Can\'t self certify'],
                                status: 'error'
                            }
                        }));

                        spyOn(spModal, 'open').and.callThrough();
                        certificationDialogService.showCertificationReassignDialog(certItem);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('showCertificationEntityReassignDialog()', function () {
                    var certificationService = undefined,
                        bulkDecision = {
                        recipient: { id: '1234' },
                        comments: 'adfadsfasd',
                        description: 'adsfasdfasd'
                    };

                    beforeEach(inject(function (_certificationService_) {
                        certificationService = _certificationService_;

                        spyOn(certificationDialogService, 'showDelegationDialog').and.returnValue($q.when(bulkDecision));

                        // mock out decision store functions
                        certificationDataService.decisions = {
                            removeBulkOverlaps: function () {},
                            removeLineItemOverlaps: function () {}
                        };
                    }));

                    function setupSaveDecisionsSpy(reject) {
                        spyOn(certificationService, 'saveDecisions').and.returnValue(reject ? $q.reject({ status: 409 }) : $q.when({ data: { object: {} } }));
                    }

                    it('creates a bulk decision', function () {
                        setupSaveDecisionsSpy();
                        spyOn(CertificationDecision, 'createBulkDecision');
                        certificationDialogService.showCertificationEntityReassignDialog(certItem);
                        $scope.$apply();
                        expect(CertificationDecision.createBulkDecision).toHaveBeenCalled();
                    });

                    it('calls showDelegationDialog', function () {
                        setupSaveDecisionsSpy();
                        certificationDialogService.showCertificationEntityReassignDialog(certItem);
                        $scope.$apply();
                        expect(certificationDialogService.showDelegationDialog).toHaveBeenCalled();
                    });

                    it('calls saveDecisions', function () {
                        setupSaveDecisionsSpy();
                        certificationDialogService.showCertificationEntityReassignDialog(certItem);
                        $scope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                    });

                    it('shows retry dialog if cert is locked', function () {
                        setupSaveDecisionsSpy(true);
                        spyOn(certificationDialogService, 'showRetryDialog').and.returnValue($q.when());
                        certificationDialogService.showCertificationEntityReassignDialog(certItem);
                        $scope.$apply();
                        expect(certificationDialogService.showRetryDialog).toHaveBeenCalled();
                    });

                    it('shows error modal if saveDecisions returns error', function () {
                        spyOn(certificationService, 'saveDecisions').and.returnValue($q.when({
                            data: {
                                errors: ['Can\'t self certify'],
                                status: 'error'
                            }
                        }));

                        spyOn(spModal, 'open').and.callThrough();
                        certificationDialogService.showCertificationEntityReassignDialog(certItem);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('showCertificationEntityDelegationDialog()', function () {
                    var certificationService = undefined,
                        bulkDecision = {
                        recipient: { id: '1234' },
                        comments: 'adfadsfasd',
                        description: 'adsfasdfasd'
                    };

                    beforeEach(inject(function (_certificationService_) {
                        certificationService = _certificationService_;

                        spyOn(certificationDialogService, 'showDelegationDialog').and.returnValue($q.when(bulkDecision));

                        // mock out decision store functions
                        certificationDataService.decisions = {
                            removeBulkOverlaps: function () {},
                            removeLineItemOverlaps: function () {}
                        };
                    }));

                    function setupSaveDecisionsSpy(reject) {
                        spyOn(certificationService, 'saveDecisions').and.returnValue(reject ? $q.reject({ status: 409 }) : $q.when({ data: { object: {} } }));
                    }

                    it('creates a bulk decision', function () {
                        setupSaveDecisionsSpy();
                        spyOn(CertificationDecision, 'createBulkDecision');
                        certificationDialogService.showCertificationEntityDelegationDialog(certItem);
                        $scope.$apply();
                        expect(CertificationDecision.createBulkDecision).toHaveBeenCalled();
                    });

                    it('calls showDelegationDialog', function () {
                        setupSaveDecisionsSpy();
                        certificationDialogService.showCertificationEntityDelegationDialog(certItem, 3);
                        $scope.$apply();
                        expect(certificationDialogService.showDelegationDialog).toHaveBeenCalled();
                    });

                    it('calls saveDecisions', function () {
                        setupSaveDecisionsSpy(true);
                        certificationDialogService.showCertificationEntityDelegationDialog(certItem);
                        $scope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                        bulkDecision.status = CertificationActionStatus.DelegationAction;
                    });

                    it('shows retry dialog if cert is locked', function () {
                        setupSaveDecisionsSpy(true);
                        spyOn(certificationDialogService, 'showRetryDialog').and.returnValue($q.when());
                        certificationDialogService.showCertificationEntityDelegationDialog(certItem);
                        $scope.$apply();
                        expect(certificationDialogService.showRetryDialog).toHaveBeenCalled();
                    });

                    it('shows error modal if saveDecisions returns error', function () {
                        spyOn(certificationService, 'saveDecisions').and.returnValue($q.when({
                            data: {
                                errors: ['Can\'t self certify'],
                                status: 'error'
                            }
                        }));

                        spyOn(spModal, 'open').and.callThrough();
                        certificationDialogService.showCertificationEntityDelegationDialog(certItem);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('showDelegationDialog', function () {
                    beforeEach(function () {
                        spyOn(spModal, 'open').and.callThrough();
                    });

                    it('calls spModal open', function () {
                        certificationDialogService.showDelegationDialog('title');
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('showEntityDelegationRevokeConfirmationDialog()', function () {
                    var certificationService = undefined,
                        delegatedEntity = undefined;

                    beforeEach(inject(function (_certificationService_) {
                        certificationService = _certificationService_;
                        delegatedEntity = angular.copy(certificationTestData.CERTIFICATION_ENTITY_LIST_RESULT.objects[0]);
                    }));

                    function setupSaveDecisionsSpy(reject) {
                        spyOn(certificationService, 'saveDecisions').and.returnValue(reject ? $q.reject({ status: 409 }) : $q.when({ data: { object: {} } }));
                    }

                    it('creates a bulk decision', function () {
                        spyOn(CertificationDecision, 'createBulkDecision');
                        certificationDialogService.showEntityDelegationRevokeConfirmationDialog(delegatedEntity);
                        $scope.$apply();
                        expect(CertificationDecision.createBulkDecision).toHaveBeenCalled();
                    });

                    it('shows confirm dialog', function () {
                        spyOn(spModal, 'confirm').and.callThrough();
                        certificationDialogService.showEntityDelegationRevokeConfirmationDialog(delegatedEntity);
                        $scope.$apply();
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('calls saveDecisions', function () {
                        setupSaveDecisionsSpy();
                        spyOn(spModal, 'confirm').and.returnValue($q.when());
                        certificationDialogService.showEntityDelegationRevokeConfirmationDialog(delegatedEntity);
                        $scope.$apply();
                        expect(certificationService.saveDecisions).toHaveBeenCalled();
                    });

                    it('shows error modal if saveDecisions returns error', function () {
                        spyOn(certificationService, 'saveDecisions').and.returnValue($q.when({
                            data: {
                                errors: ['Can\'t self certify'],
                                status: 'error'
                            }
                        }));

                        spyOn(spModal, 'open').and.callThrough();
                        certificationDialogService.showEntityDelegationRevokeConfirmationDialog(delegatedEntity);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('isAllowExceptionDialogRequired()', function () {
                    var checkValue = false;

                    beforeEach(function () {
                        checkValue = false;
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue({
                            doesStatusRequireComment: function () {
                                return false;
                            }
                        });
                        spyOn(certificationDialogService, 'checkAllowExceptionDialogRequired').and.callFake(function () {
                            return checkValue;
                        });
                    });

                    it('is not required when checkAllowExceptionDialogRequired returns false', function () {
                        checkValue = false;
                        testDialogRequired(certItem, getStatus('Mitigated'), false);
                    });

                    it('is required when checkAllowExceptionDialogRequired returns true', function () {
                        checkValue = true;
                        testDialogRequired(certItem, getStatus('Mitigated'), true);
                    });
                });

                describe('checkAllowExceptionDialogRequired()', function () {
                    var config = {
                        allowExceptionPopup: undefined,
                        doesStatusRequireComment: function () {
                            return false;
                        }
                    };

                    beforeEach(function () {
                        spyOn(certificationDataService, 'getConfiguration').and.returnValue(config);
                    });

                    it('is not required when allowExceptionPopup is false', function () {
                        config.allowExceptionPopup = false;
                        expect(certificationDialogService.checkAllowExceptionDialogRequired(getStatus('Mitigated'))).toEqual(false);
                    });

                    it('is required when allowExceptionPopup is true and status is Mitigated', function () {
                        config.allowExceptionPopup = true;
                        expect(certificationDialogService.checkAllowExceptionDialogRequired(getStatus('Mitigated'))).toEqual(true);
                    });

                    it('is not required when decision status is not Mitigated', function () {
                        config.allowExceptionPopup = true;
                        expect(certificationDialogService.checkAllowExceptionDialogRequired(getStatus('Approved'))).toEqual(false);
                    });

                    it('is not required for accept delegation action', function () {
                        var status = new CertificationActionStatus({
                            delegationReviewAction: CertificationActionStatus.DelegationAction.Accept
                        });

                        expect(certificationDialogService.checkAllowExceptionDialogRequired(status)).toEqual(false);
                    });
                });

                describe('showAllowExceptionDialog()', function () {

                    beforeEach(function () {
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.when({})
                        });
                    });

                    it('opens a dialog', function () {
                        var decision = undefined;

                        // Make this a Challenged item so we can test oneStep Accept
                        certItem.summaryStatus = CertificationItem.Status.Challenged;

                        certificationDialogService.showAllowExceptionDialog(certItem, getStatus('Mitigated')).then(function (result) {
                            decision = result;
                        });
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();

                        expect(decision.oneStepChallenge).toEqual(true);
                        expect(decision.challengeAction).toEqual(CertificationActionStatus.ChallengeAction.Accept);
                    });
                });

                describe('showRetryDialog', function () {
                    beforeEach(function () {
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.when({})
                        });
                    });

                    it('calls spModal open and the retry function', function () {
                        var testObj = {
                            retryFunc: function () {
                                return 'something';
                            }
                        };

                        spyOn(testObj, 'retryFunc');
                        certificationDialogService.showRetryDialog(testObj.retryFunc);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(testObj.retryFunc).toHaveBeenCalled();
                    });
                });

                describe('getDelegationRevokeConfirmationIfRequired()', function () {
                    var delegatedCert = undefined;

                    beforeEach(function () {
                        spyOn(spModal, 'confirm');
                        delegatedCert = new CertificationItem(certificationTestData.CERT_ITEMS[0]);
                        delegatedCert.summaryStatus = CertificationItem.Status.Delegated;
                    });

                    it('should call spModal.confirm() when action status is Approved', function () {
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Approved }));
                        $scope.$apply();
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('should call spModal.confirm() when action status is Acknowledged', function () {
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Acknowledged }));
                        $scope.$apply();
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('should call spModal.confirm() when action status is Mitigated', function () {
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Mitigated }));
                        $scope.$apply();
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('should call spModal.confirm() when action status is Remediated', function () {
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Remediated }));
                        $scope.$apply();
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('should call spModal.confirm() when action status is Cleared', function () {
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Cleared }));
                        $scope.$apply();
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('should not call spModal.confirm() when action status is Delegated', function () {
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Delegated }));
                        $scope.$apply();
                        expect(spModal.confirm).not.toHaveBeenCalled();
                    });

                    it('should not call spModal.confirm() when there is an existing decision.revokeDelegation', function () {
                        var existingDecision = CertificationDecision.createItemDecision(delegatedCert, getStatus('Approved'));
                        existingDecision.revokeDelegation = true;
                        certificationDialogService.getDelegationRevokeConfirmationIfRequired(delegatedCert, new CertificationActionStatus({ status: CertificationActionStatus.Name.Remediated }), existingDecision);
                        $scope.$apply();
                        expect(spModal.confirm).not.toHaveBeenCalled();
                    });
                });

                function spyOnSendReminderEmail(certificationService, reject) {
                    var promise = reject ? $q.reject({ status: 500 }) : $q.when({ status: 200 });
                    spyOn(certificationService, 'sendCertificationReminderEmail').and.returnValue(promise);
                }

                describe('showCertificationReminderEmailDialog()', function () {
                    var certificationService = undefined,
                        certId = 'cert1',
                        emailTemplate = {
                        to: 'cert1@example.com',
                        from: 'grumby@ships.com',
                        subject: 'swabbing the deck',
                        body: 'You really need to get on that!',
                        toIdentity: {
                            id: '1234',
                            name: 'Gilligan',
                            email: 'gilligan@island.com'
                        }
                    };
                    beforeEach(inject(function (_certificationService_) {
                        certificationService = _certificationService_;

                        spyOn(certificationService, 'getCertificationReminderEmailTemplate').and.returnValue($q.when(emailTemplate));
                        spyOn(certificationDialogService.emailDialogService, 'showEmailDialog').and.returnValue($q.when(emailTemplate));
                        spyOn(certificationDialogService.spNotificationService, 'addNotification');
                        spyOn(certificationDialogService.spNotificationService, 'triggerDirective');
                    }));

                    it('should call getCertificationReminderEmailTemplate()', function () {
                        spyOnSendReminderEmail(certificationService, false);
                        certificationDialogService.showCertificationReminderEmailDialog(certId);
                        $scope.$apply();
                        expect(certificationService.getCertificationReminderEmailTemplate).toHaveBeenCalled();
                    });

                    it('should call showEmailDialog()', function () {
                        spyOnSendReminderEmail(certificationService, false);
                        certificationDialogService.showCertificationReminderEmailDialog(certId);
                        $scope.$apply();
                        expect(certificationDialogService.emailDialogService.showEmailDialog).toHaveBeenCalled();
                    });

                    it('should call sendCertificationReminderEmail()', function () {
                        spyOnSendReminderEmail(certificationService, false);
                        certificationDialogService.showCertificationReminderEmailDialog(certId);
                        $scope.$apply();
                        expect(certificationService.sendCertificationReminderEmail).toHaveBeenCalled();
                    });

                    it('should call spNotificationService()', function () {
                        spyOnSendReminderEmail(certificationService, false);
                        certificationDialogService.showCertificationReminderEmailDialog(certId);
                        $scope.$apply();
                        expect(certificationDialogService.spNotificationService.addNotification).toHaveBeenCalled();
                        expect(certificationDialogService.spNotificationService.triggerDirective).toHaveBeenCalled();
                    });

                    it('should show alert dialog when sending email returns response status of 500', function () {
                        spyOnSendReminderEmail(certificationService, true);
                        spyOn(spModal, 'open');
                        certificationDialogService.showCertificationReminderEmailDialog(certId);
                        $scope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].title).toBe('ui_email_error_title');
                        expect(spModal.open.calls.mostRecent().args[0].type).toBe('alert');
                    });
                });

                describe('confirmRevokeAccountDecisionChange', function () {
                    function testConfirmRevokeAccount(currentStatus, status, decision, isShow, isPassedDecision) {
                        spyOn(spModal, 'confirm').and.returnValue($q.when());
                        spyOn(certificationDataService.decisions, 'getEffectiveDecisionByItem').and.returnValue(decision);
                        certItem.decisionStatus = {
                            currentState: {
                                name: currentStatus
                            }
                        };
                        certificationDialogService.confirmAccountDecisionChange([certItem], status, isPassedDecision ? decision : undefined);
                        if (isShow) {
                            expect(spModal.confirm).toHaveBeenCalled();
                        } else {
                            expect(spModal.confirm).not.toHaveBeenCalled();
                        }

                        if (!isPassedDecision) {
                            expect(certificationDataService.decisions.getEffectiveDecisionByItem).toHaveBeenCalledWith(certItem);
                        }
                    }

                    it('does not show if existing decision is not RevokeAccount', function () {
                        var decision = CertificationDecision.createItemDecision(certItem, getStatus('Approved'));
                        testConfirmRevokeAccount(undefined, getStatus('Approved'), decision, false, true);
                    });

                    it('shows dialog if existing decision is RevokeAccount', function () {
                        var decision = CertificationDecision.createItemDecision(certItem, getStatus('RevokeAccount'));
                        testConfirmRevokeAccount(undefined, getStatus('Approved'), decision, true, true);
                    });

                    it('does not show if saved decision is RevokeAccount with existing decision already made', function () {
                        var decision = CertificationDecision.createItemDecision(certItem, getStatus('Approved'));
                        testConfirmRevokeAccount('RevokeAccount', getStatus('Approved'), decision, false, true);
                    });

                    it('shows dialog if saved decision is RevokeAccount with no decision made', function () {
                        testConfirmRevokeAccount('RevokeAccount', getStatus('Approved'), undefined, true, true);
                    });

                    it('fetches the effective decision if not passed', function () {
                        testConfirmRevokeAccount('RevokeAccount', getStatus('Approved'), undefined, true, false);
                    });
                });

                describe('isDialogRequired()', function () {
                    function setupDialogRequired(spyResults) {
                        var methods = ['checkAllowExceptionDialogRequired', 'checkCommentDialogRequired', 'checkRevocationWithSummary', 'checkPolicyViolationRevocation'];
                        spyResults = spyResults || {};
                        methods.forEach(function (method) {
                            var returnValue = spyResults[method] || false;
                            spyOn(certificationDialogService, method).and.returnValue(returnValue);
                        });
                    }

                    it('returns false if none of the dialogs are required', function () {
                        setupDialogRequired();
                        expect(certificationDialogService.isDialogRequired(certItem, getStatus('Mitigated'))).toEqual(false);
                    });

                    it('returns true if allow exception dialog is required', function () {
                        setupDialogRequired({
                            'checkAllowExceptionDialogRequired': true
                        });
                        expect(certificationDialogService.isDialogRequired(certItem, getStatus('Mitigated'))).toEqual(true);
                    });

                    it('returns true if comment dialog is required', function () {
                        setupDialogRequired({
                            'checkCommentDialogRequired': true
                        });
                        expect(certificationDialogService.isDialogRequired(certItem, getStatus('Mitigated'))).toEqual(true);
                    });

                    it('returns true if remediation summary is required', function () {
                        setupDialogRequired({
                            'checkRevocationWithSummary': true
                        });
                        expect(certificationDialogService.isDialogRequired(certItem, getStatus('Revoked'))).toEqual(true);
                    });

                    it('returns true if violation revocation', function () {
                        setupDialogRequired({
                            'checkPolicyViolationRevocation': true
                        });
                        expect(certificationDialogService.isDialogRequired(certItem, getStatus('Revoked'))).toEqual(true);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLHVCQUF1QixVQUFVLFNBQVM7O0lBRXZIOztJQUVBLElBQUkscUJBQXFCO0lBQ3pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7O1lBTjdCLFNBQVMsOEJBQThCLFlBQU07O2dCQUV6QyxJQUFJLHdCQUFxQjtvQkFBRSxvQkFBaUI7b0JBQUUsMkJBQXdCO29CQUFFLDZCQUEwQjtvQkFDOUYsaUJBQWM7b0JBQUUsS0FBRTtvQkFBRSxTQUFNO29CQUFFLE9BQUk7b0JBQUUsV0FBUTtvQkFBRSx3QkFBcUI7b0JBQUUsNEJBQXlCO29CQUM1RixVQUFPOztnQkFFWCxTQUFTLFVBQVUsUUFBUTtvQkFDdkIsT0FBTyxJQUFJLDBCQUEwQjt3QkFDakMsUUFBUTs7OztnQkFJaEIsV0FBVyxPQUFPLHFCQUFxQjs7O2dCQUd2QyxXQUFXLE9BQU8sVUFBQyxZQUFZLHlCQUF5Qix5QkFBeUIsNEJBQzlELDhCQUE4QixrQkFBa0IsTUFBTSxxQkFBcUIsZUFDM0UscUJBQXFCLDZCQUE2QixXQUFjO29CQUMvRSwyQkFBMkI7b0JBQzNCLHdCQUF3QjtvQkFDeEIsNkJBQTZCO29CQUM3QixvQkFBb0I7b0JBQ3BCLEtBQUs7b0JBQ0wsaUJBQWlCO29CQUNqQixTQUFVLFdBQVc7b0JBQ3JCLHdCQUF3QjtvQkFDeEIsNEJBQTRCO29CQUM1QixVQUFVOzs7b0JBR1YsT0FBTyxJQUFJLGNBQWMsc0JBQXNCO29CQUMvQyxXQUFXLElBQUksa0JBQWtCLHNCQUFzQixXQUFXOzs7b0JBR2xFLHlCQUF5QixXQUFXOzs7b0JBR3BD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QVc7NEJBQ3hCLElBQUksY0FBYyxXQUFXLFdBQVc7NEJBQ3hDLE1BQU0sNEJBQTRCLFFBQVEsSUFBSSxZQUFZOzs7O29CQUlsRSxHQUFHLHFEQUFxRCxZQUFNO3dCQUMxRDt3QkFDQSxPQUFPLDJCQUEyQixpQkFBaUIsVUFBVSxVQUFVLGVBQWUsUUFBUTs7O29CQUdsRyxHQUFHLHNEQUFzRCxZQUFNO3dCQUMzRCxvQkFBb0I7NEJBQ2hCLHFDQUFxQzs7d0JBRXpDLE9BQU8sMkJBQTJCLGlCQUFpQixVQUFVLFVBQVUsZUFBZSxRQUFROzs7b0JBR2xHLEdBQUcsOENBQThDLFlBQU07d0JBQ25ELG9CQUFvQjs0QkFDaEIsOEJBQStCOzt3QkFFbkMsT0FBTywyQkFBMkIsaUJBQWlCLFVBQVUsVUFBVSxlQUFlLFFBQVE7OztvQkFHbEcsR0FBRyxtREFBbUQsWUFBTTt3QkFDeEQsb0JBQW9COzRCQUNoQiw4QkFBK0I7O3dCQUVuQyxPQUFPLDJCQUEyQixpQkFBaUIsVUFBVSxVQUFVLGFBQWEsUUFBUTs7O29CQUdoRyxHQUFJLHdDQUF3QyxZQUFNO3dCQUM5QyxvQkFBb0I7NEJBQ2hCLGtDQUFtQzs7d0JBRXZDLE9BQU8sMkJBQTJCLGlCQUFpQixVQUFVLFVBQVUsYUFBYSxRQUFROzs7Ozs7R0FSckciLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ2NlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlJywgKCkgPT4ge1xyXG5cclxuICAgIGxldCBDZXJ0aWZpY2F0aW9uRGVjaXNpb24sIENlcnRpZmljYXRpb25JdGVtLCBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLFxyXG4gICAgICAgIGNvbW1lbnRTZXJ2aWNlLCAkcSwgJHNjb3BlLCBjZXJ0LCBjZXJ0SXRlbSwgY2VydGlmaWNhdGlvblRlc3REYXRhLCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLFxyXG4gICAgICAgIHNwTW9kYWw7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0U3RhdHVzKHN0YXR1cykge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XHJcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSwgdGVzdE1vZHVsZSkpO1xyXG5cclxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDEyICovXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdCgoJHJvb3RTY29wZSwgX0NlcnRpZmljYXRpb25EZWNpc2lvbl8sIF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfLCBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXyxcclxuICAgICAgICAgICAgICAgICAgICAgICBfY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2VfLCBfY29tbWVudFNlcnZpY2VfLCBfJHFfLCBfQ2VydGlmaWNhdGlvbkl0ZW1fLCBDZXJ0aWZpY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25Db25maWcsIF9DZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzXywgX3NwTW9kYWxfKSA9PiB7XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV87XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2VfO1xyXG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcclxuICAgICAgICAkcSA9IF8kcV87XHJcbiAgICAgICAgY29tbWVudFNlcnZpY2UgPSBfY29tbWVudFNlcnZpY2VfO1xyXG4gICAgICAgICRzY29wZSAgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uVGVzdERhdGEgPSBfY2VydGlmaWNhdGlvblRlc3REYXRhXztcclxuICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzID0gX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfO1xyXG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBzb21lIGRhdGEgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIGNlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKTtcclxuICAgICAgICBjZXJ0SXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1sxXSk7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIGRhdGEgc2VydmljZSB3aXRoIGEgY2VydC5cclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShjZXJ0KTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgdGhlIGNvbmZpZyBpbiB0aGUgc2VydmljZS5cclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZUNvbmZpZ3VyYXRpb24obmV3IENlcnRpZmljYXRpb25Db25maWcoe1xyXG4gICAgICAgICAgICBzdGF0dXNlc1JlcXVpcmluZ0NvbW1lbnRzOiBbJ01pdGlnYXRlZCddLFxyXG4gICAgICAgICAgICBtaXRpZ2F0aW9uRXhwaXJhdGlvbkRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICB9KSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdGVzdERpYWxvZ1JlcXVpcmVkKGNlcnRJdGVtLCBzdGF0dXMsIGV4cGVjdFJlcXVpcmVkKSB7XHJcbiAgICAgICAgbGV0IHNob3dGdW5jdGlvbjtcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5nZXREaWFsb2coY2VydEl0ZW0sIHN0YXR1cykudGhlbigocmV0dXJuZWRTaG93RnVuYykgPT4ge1xyXG4gICAgICAgICAgICBzaG93RnVuY3Rpb24gPSByZXR1cm5lZFNob3dGdW5jO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoISFzaG93RnVuY3Rpb24pLnRvRXF1YWwoZXhwZWN0UmVxdWlyZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlc3RDZXJ0aWZpY2F0aW9uRGVjaXNpb24oZGVjaXNpb24sIGNlcnRJdGVtLCBzdGF0dXMsIGNvbW1lbnRzKSB7XHJcbiAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChkZWNpc2lvbi5jZXJ0aWZpY2F0aW9uSXRlbSkudG9FcXVhbChjZXJ0SXRlbSk7XHJcbiAgICAgICAgZXhwZWN0KGRlY2lzaW9uLnN0YXR1cykudG9FcXVhbChzdGF0dXMpO1xyXG4gICAgICAgIGV4cGVjdChkZWNpc2lvbi5jb21tZW50cykudG9FcXVhbChjb21tZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldERpYWxvZygpJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGlhbG9nKHNweU1ldGhvZCkge1xyXG4gICAgICAgICAgICBpZiAoc3B5TWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgc3B5TWV0aG9kKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGRpYWxvZztcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuZ2V0RGlhbG9nKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoc2hvd0Z1bmMpID0+IGRpYWxvZyA9IHNob3dGdW5jKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdERpYWxvZyhzcHlNZXRob2QpIHtcclxuICAgICAgICAgICAgbGV0IGRpYWxvZyA9IGdldERpYWxvZyhzcHlNZXRob2QpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlhbG9nKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBkaWFsb2coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGNvbW1lbnQgZGlhbG9nIGlmIGNvbW1lbnRzIGFyZSByZXF1aXJlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY29tbWVudFNlcnZpY2UsICdvcGVuQ29tbWVudERpYWxvZycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICB0ZXN0RGlhbG9nKCdpc0NvbW1lbnREaWFsb2dSZXF1aXJlZCcpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tbWVudFNlcnZpY2Uub3BlbkNvbW1lbnREaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgcG9saWN5IHZpb2xhdGlvbiBkaWFsb2cgaWYgaXRlbSBpcyBhIHBvbGljeSB2aW9sYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnc2hvd1Zpb2xhdGlvblJldm9jYXRpb25EaWFsb2cnKTtcclxuICAgICAgICAgICAgdGVzdERpYWxvZygnaXNQb2xpY3lWaW9sYXRpb25SZXZvY2F0aW9uJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93VmlvbGF0aW9uUmV2b2NhdGlvbkRpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBub24tcG9saWN5IHZpb2xhdGlvbiByZXZvY2F0aW9uIGRpYWxvZyBpZiBpdCBpcyByZXZvY2F0aW9uIHdpdGggc3VtbWFyeScsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdzaG93Tm9uVmlvbGF0aW9uUmV2b2NhdGlvbkRpYWxvZycpO1xyXG4gICAgICAgICAgICB0ZXN0RGlhbG9nKCdpc1Jldm9jYXRpb25XaXRoU3VtbWFyeScpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd05vblZpb2xhdGlvblJldm9jYXRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYmxvY2tlZCBieSBwYXJlbnQgZGlhbG9nIGlmIHRoZXJlIGlzIHBhcmVudCBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdzaG93QmxvY2tlZEJ5UGFyZW50RGlhbG9nJyk7XHJcbiAgICAgICAgICAgIHRlc3REaWFsb2coJ2lzQmxvY2tlZEJ5UGFyZW50RGVjaXNpb24nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dCbG9ja2VkQnlQYXJlbnREaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdW5kZWZpbmVkIGlmIG5vIGRpYWxvZ3MgYXJlIGVuYWJsZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkaWFsb2cgPSBnZXREaWFsb2cobnVsbCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaWFsb2cpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGNhbGwgZnVydGhlciBkaWFsb2cgY2hlY2tzIGlmIGEgZGlhbG9nIGlzIHNob3duJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ2lzUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbicpO1xyXG4gICAgICAgICAgICB0ZXN0RGlhbG9nKCdpc0NvbW1lbnREaWFsb2dSZXF1aXJlZCcpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuaXNQb2xpY3lWaW9sYXRpb25SZXZvY2F0aW9uKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnUmV0dXJucyBhbGxvdyBleGNlcHRpb25zIGRpYWxvZycsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdzaG93QWxsb3dFeGNlcHRpb25EaWFsb2cnKTtcclxuICAgICAgICAgICAgdGVzdERpYWxvZygnaXNBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93QWxsb3dFeGNlcHRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdjb21tZW50IGRpYWxvZyByZXNvbHZlcyB3aXRoIGEgY2VydCBkZWNpc2lvbiB3aXRoIGNvbW1lbnRzJywgKCkgPT4ge1xyXG4gICAgICAgIC8vIFNldHVwIHNvbWUgc3BpZXMgdG8gc2hvdyB0aGUgZGlhbG9nIGFuZCByZXNvbHZlIGl0IHdpdGggYSBjb21tZW50LlxyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnaXNDb21tZW50RGlhbG9nUmVxdWlyZWQnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih0cnVlKSk7XHJcbiAgICAgICAgbGV0IGNvbW1lbnRUZXh0ID0gJ2JsYWggYmxhaCc7XHJcbiAgICAgICAgc3B5T24oY29tbWVudFNlcnZpY2UsICdvcGVuQ29tbWVudERpYWxvZycpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oY29tbWVudFRleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHRoaXMgYSBDaGFsbGVuZ2VkIGl0ZW0gc28gd2UgY2FuIHRlc3Qgb25lU3RlcCBBY2NlcHRcclxuICAgICAgICBjZXJ0SXRlbS5zdW1tYXJ5U3RhdHVzID0gQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNoYWxsZW5nZWQ7XHJcblxyXG4gICAgICAgIC8vIE9wZW4gdGhlIGNvbW1lbnQgZGlhbG9nLlxyXG4gICAgICAgIGxldCBkZWNpc2lvbjtcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q29tbWVudERpYWxvZyhjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKS50aGVuKChjb21tZW50RGVjaXNpb24pID0+IHtcclxuICAgICAgICAgICAgZGVjaXNpb24gPSBjb21tZW50RGVjaXNpb247XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChjb21tZW50U2VydmljZS5vcGVuQ29tbWVudERpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24gaXMgY29ycmVjdC5cclxuICAgICAgICB0ZXN0Q2VydGlmaWNhdGlvbkRlY2lzaW9uKGRlY2lzaW9uLCBjZXJ0SXRlbSwgJ0FwcHJvdmVkJywgY29tbWVudFRleHQpO1xyXG4gICAgICAgIGV4cGVjdChkZWNpc2lvbi5vbmVTdGVwQ2hhbGxlbmdlKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChkZWNpc2lvbi5jaGFsbGVuZ2VBY3Rpb24pLnRvRXF1YWwoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5DaGFsbGVuZ2VBY3Rpb24uQWNjZXB0KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0Q2hhbGxlbmdlQ29tbWVudElmUmVxdWlyZWQnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBjb21tZW50IGRpYWxvZyB3aGVuIGl0ZW0gaXMgaW4gY2hhbGxlbmdlZCBzdGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY29tbWVudFNlcnZpY2UsICdvcGVuQ29tbWVudERpYWxvZycpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG5cclxuICAgICAgICAgICAgY2VydEl0ZW0uc3VtbWFyeVN0YXR1cyA9IENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5DaGFsbGVuZ2VkO1xyXG5cclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuZ2V0Q2hhbGxlbmdlQ29tbWVudElmUmVxdWlyZWQoY2VydEl0ZW0sICdBY2NlcHQnKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjb21tZW50U2VydmljZS5vcGVuQ29tbWVudERpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBudWxsIHdoZW4gaXRlbSBpcyBub3QgaW4gY2hhbGxlbmdlZCBzdGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuZ2V0Q2hhbGxlbmdlQ29tbWVudElmUmVxdWlyZWQoY2VydEl0ZW0sICdBY2NlcHQnKS50aGVuKChudWxscHJvbWlzZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KG51bGxwcm9taXNlKS50b0JlKG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93Q29tbWVudERpYWxvZycsICgpID0+IHtcclxuXHJcbiAgICAgICAgaXQoJ29wZW5zIGNvbW1lbnQgZGlhbG9nIHdpdGggY29tbWVudHMgYW5kIHJlYWRPbmx5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjb21tZW50U2VydmljZSwgJ29wZW5Db21tZW50RGlhbG9nJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcblxyXG4gICAgICAgICAgICBjZXJ0SXRlbS5zdW1tYXJ5U3RhdHVzID0gQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNoYWxsZW5nZWQ7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50ID0gJ3RoaXMgaXMgYSBjb21tZW50JyxcclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nRGVjaXNpb24gPSB7ICdjb21tZW50cycgOiBjb21tZW50fTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NvbW1lbnREaWFsb2coY2VydEl0ZW0sICdBcHByb3ZlZCcsIGV4aXN0aW5nRGVjaXNpb24sIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChudWxsLCBudWxsLCBjb21tZW50LCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc0NvbW1lbnREaWFsb2dSZXF1aXJlZCcsICgpID0+IHtcclxuICAgICAgICBsZXQgcmVxdWlyZXNDb21tZW50cztcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5nZXRDb25maWd1cmF0aW9uKCksICdkb2VzU3RhdHVzUmVxdWlyZUNvbW1lbnQnKS5cclxuICAgICAgICAgICAgICAgIGFuZC5yZXR1cm5WYWx1ZShyZXF1aXJlc0NvbW1lbnRzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCByZXF1aXJlZCBmb3IgYSBzdGF0dXMgbm90IHJlcXVpcmluZyBhIGNvbW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVzQ29tbWVudHMgPSB0cnVlO1xyXG4gICAgICAgICAgICB0ZXN0RGlhbG9nUmVxdWlyZWQoY2VydEl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgcmVxdWlyZWQgZm9yIGEgc3RhdHVzIHJlcXVpcmluZyBhIGNvbW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVzQ29tbWVudHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVzdERpYWxvZ1JlcXVpcmVkKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzUmV2b2NhdGlvbigpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIHRoZSByZW1lZGlhdGVkIHN0YXR1cycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGlzSXQgPSBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5pc1Jldm9jYXRpb24obmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe3N0YXR1czogJ1JlbWVkaWF0ZWQnfSkpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXNJdCkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIHN0YXR1c2VzIG90aGVyIHRoYW4gcmVtZWRpYXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGlzSXQgPSBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5pc1Jldm9jYXRpb24obmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe3N0YXR1czogJ0FwcHJvdmVkJ30pKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzSXQpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NoZWNrUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbigpJywgKCkgPT4ge1xyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RQb2xpY3lWaW9sYXRpb24odHlwZSwgZGVjaXNpb24sIGV4cGVjdEl0KSB7XHJcbiAgICAgICAgICAgIGNlcnRJdGVtLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICBsZXQgaXNJdCA9IGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmNoZWNrUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbihjZXJ0SXRlbSxcclxuICAgICAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGRlY2lzaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGVnYXRpb25SZXZpZXdBY3Rpb246IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuRGVsZWdhdGlvbkFjdGlvbi5SZWplY3RcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzSXQpLnRvRXF1YWwoZXhwZWN0SXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYSBwb2xpY3kgdmlvbGF0aW9uIGl0ZW0gd2l0aCBhIHJldm9jYXRpb24gc3RhdHVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0UG9saWN5VmlvbGF0aW9uKENlcnRpZmljYXRpb25JdGVtLlR5cGUuUG9saWN5VmlvbGF0aW9uLCAnUmVtZWRpYXRlZCcsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSByZXZva2Ugb2YgYSBub24tcG9saWN5IHZpb2xhdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdFBvbGljeVZpb2xhdGlvbihDZXJ0aWZpY2F0aW9uSXRlbS5UeXBlLkVudGl0bGVtZW50LCAnUmVtZWRpYXRlZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGEgbm9uLXJldm9rZSBvZiBhIHBvbGljeSB2aW9sYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RQb2xpY3lWaW9sYXRpb24oQ2VydGlmaWNhdGlvbkl0ZW0uVHlwZS5Qb2xpY3lWaW9sYXRpb24sICdBcHByb3ZlZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc1BvbGljeVZpb2xhdGlvblJldm9jYXRpb24oKScsICgpID0+IHtcclxuICAgICAgICBsZXQgY2hlY2tWYWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ2NoZWNrUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbicpLmFuZC5jYWxsRmFrZSgoKSA9PiBjaGVja1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCByZXF1aXJlZCB3aGVuIGNoZWNrUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbiByZXR1cm5zIGZhbHNlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRlc3REaWFsb2dSZXF1aXJlZChjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIHJlcXVpcmVkIHdoZW4gY2hlY2tQb2xpY3lWaW9sYXRpb25SZXZvY2F0aW9uIHJldHVybnMgdHJ1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRlc3REaWFsb2dSZXF1aXJlZChjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NoZWNrUmV2b2NhdGlvbldpdGhTdW1tYXJ5KCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbm90IHJldm9jYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5jaGVja1Jldm9jYXRpb25XaXRoU3VtbWFyeShjZXJ0SXRlbSxcclxuICAgICAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtzdGF0dXM6ICdBcHByb3ZlZCd9KSkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiByZXZvY2F0aW9uIGJ1dCBzdW1tYXJ5IG5vdCBuZWVkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ25lZWRzUmVtZWRpYXRpb25TdW1tYXJ5JykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmNoZWNrUmV2b2NhdGlvbldpdGhTdW1tYXJ5KGNlcnRJdGVtLFxyXG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe3N0YXR1czogJ1JlbWVkaWF0ZWQnfSkpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgcmV2b2NhdGlvbiB3aXRoIHN1bW1hcnkgYnV0IGlzIGEgcmVqZWN0ZWQgY2hhbGxlbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoeyBzdGF0dXM6ICdSZW1lZGlhdGVkJywgY2hhbGxlbmdlQWN0aW9uOiAnUmVqZWN0JyB9KTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnbmVlZHNSZW1lZGlhdGlvblN1bW1hcnknKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5jaGVja1Jldm9jYXRpb25XaXRoU3VtbWFyeShjZXJ0SXRlbSwgc3RhdHVzKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgcmV2b2NhdGlvbiBhbmQgc3VtbWFyeSBpcyBuZWVkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ25lZWRzUmVtZWRpYXRpb25TdW1tYXJ5JykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuY2hlY2tSZXZvY2F0aW9uV2l0aFN1bW1hcnkoY2VydEl0ZW0sXHJcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7c3RhdHVzOiAnUmVtZWRpYXRlZCd9KSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNSZXZvY2F0aW9uV2l0aFN1bW1hcnkoKScsICgpID0+IHtcclxuICAgICAgICBsZXQgY2hlY2tWYWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgY2hlY2tWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ2NoZWNrUmV2b2NhdGlvbldpdGhTdW1tYXJ5JykuYW5kLmNhbGxGYWtlKCgpID0+IGNoZWNrVmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgbm90IHJlcXVpcmVkIHdoZW4gY2hlY2tBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkIHJldHVybnMgZmFsc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoZWNrVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVzdERpYWxvZ1JlcXVpcmVkKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgcmVxdWlyZWQgd2hlbiBjaGVja0FsbG93RXhjZXB0aW9uRGlhbG9nUmVxdWlyZWQgcmV0dXJucyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja1ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGVzdERpYWxvZ1JlcXVpcmVkKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNCbG9ja2VkQnlQYXJlbnREZWNpc2lvbigpJywgKCkgPT4ge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFjdGlvblN0YXR1cyhzdGF0dXMsIGRlbGVnYXRpb25SZXZpZXdBY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgZGVsZWdhdGlvblJldmlld0FjdGlvbjogZGVsZWdhdGlvblJldmlld0FjdGlvblxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdEJsb2NrZWRCeVBhcmVudChkZXBlbmRlbnREZWNpc2lvbiwgc3RhdHVzLCBzb3VyY2VEZWNpc2lvbnMsIGV4cGVjdEl0LCBpc0NoYWxsZW5nZSkge1xyXG4gICAgICAgICAgICBsZXQgdGVzdEl0O1xyXG4gICAgICAgICAgICBjZXJ0SXRlbS5kZWNpc2lvblN0YXR1cy5kZXBlbmRlbnREZWNpc2lvbiA9IGRlcGVuZGVudERlY2lzaW9uO1xyXG4gICAgICAgICAgICBjZXJ0SXRlbS5yZXF1aXJlc0NoYWxsZW5nZURlY2lzaW9uID0gaXNDaGFsbGVuZ2U7XHJcbiAgICAgICAgICAgIHN0YXR1cy5jaGFsbGVuZ2VBY3Rpb24gPSAhIWlzQ2hhbGxlbmdlID8gJ1JlamVjdCcgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXRTb3VyY2VEZWNpc2lvbnMnKS5hbmQucmV0dXJuVmFsdWUoc291cmNlRGVjaXNpb25zKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuaXNCbG9ja2VkQnlQYXJlbnREZWNpc2lvbihjZXJ0SXRlbSwgc3RhdHVzKS50aGVuKChpc0l0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0SXQgPSBpc0l0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QodGVzdEl0KS50b0VxdWFsKGV4cGVjdEl0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlIGl0ZW0gZGVjaXNpb24gc3RhdHVzIGlzIGRlcGVuZGVudCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdEJsb2NrZWRCeVBhcmVudCh0cnVlLCBjcmVhdGVBY3Rpb25TdGF0dXMoJ1JlbWVkaWF0ZWQnKSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlcmUgYXJlIHNvdXJjZSBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RCbG9ja2VkQnlQYXJlbnQoZmFsc2UsIGNyZWF0ZUFjdGlvblN0YXR1cygnUmVtZWRpYXRlZCcpLCBbe30se31dLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlcmUgYXJlIG5vIGRlcGVuZGVudCBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RCbG9ja2VkQnlQYXJlbnQoZmFsc2UsIGNyZWF0ZUFjdGlvblN0YXR1cygnUmVtZWRpYXRlZCcpLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGl0IGlzIGFuIEFjY2VwdCBkZWxlZ2F0aW9uIHJldmlldycsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdEJsb2NrZWRCeVBhcmVudCh0cnVlLCBjcmVhdGVBY3Rpb25TdGF0dXMoJ1JlbWVkaWF0ZWQnLCAnQWNjZXB0JyksIG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgaXQgaXMgYSBSZWplY3QgZGVsZWdhdGlvbiByZXZpZXcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RCbG9ja2VkQnlQYXJlbnQodHJ1ZSwgY3JlYXRlQWN0aW9uU3RhdHVzKCdSZW1lZGlhdGVkJywgJ1JlamVjdCcpLCBudWxsLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgaXRlbSBkZWNpc2lvbiBzdGF0dXMgaXMgZGVwZW5kZW50LCBidXQgaXMgY2hhbGxlbmdlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdEJsb2NrZWRCeVBhcmVudCh0cnVlLCBjcmVhdGVBY3Rpb25TdGF0dXMoJ1JlbWVkaWF0ZWQnKSwgbnVsbCwgZmFsc2UsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dWaW9sYXRpb25SZXZvY2F0aW9uRGlhbG9nKCknLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGNlcnRpZmljYXRpb25TZXJ2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdDtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF9jZXJ0aWZpY2F0aW9uU2VydmljZV8sIFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdnZXRWaW9sYXRpb25SZW1lZGlhdGlvbkFkdmljZScpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihyZW1lZGlhdGlvbkFkdmljZVJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdzaG93UmV2b2NhdGlvbkRpYWxvZycpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdCA9XHJcbiAgICAgICAgICAgICAgICBuZXcgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQoYW5ndWxhci5jb3B5KGNlcnRpZmljYXRpb25UZXN0RGF0YS5SRU1FRElBVElPTl9BRFZJQ0VfUkVTVUxUKSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnZ2V0cyB0aGUgcmVtZWRpYXRpb24gYWR2aWNlIGFuZCBjYWxscyB0aHJvdWdoIHRvIHNob3dSZXZvY2F0aW9uRGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdEZWNpc2lvbiA9IHsgc3RhdHVzOiAnUmVtZWRpYXRlZCd9LFxyXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93VmlvbGF0aW9uUmV2b2NhdGlvbkRpYWxvZyhjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksXHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ0RlY2lzaW9uLCByZWFkT25seSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFZpb2xhdGlvblJlbWVkaWF0aW9uQWR2aWNlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV2b2NhdGlvbkRpYWxvZylcclxuICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksXHJcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5hZHZpY2UsIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnksIGV4aXN0aW5nRGVjaXNpb24sIHJlYWRPbmx5KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93Tm9uVmlvbGF0aW9uUmV2b2NhdGlvbkRpYWxvZygpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjZXJ0aWZpY2F0aW9uU2VydmljZSwgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQ7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfY2VydGlmaWNhdGlvblNlcnZpY2VfLCBSZW1lZGlhdGlvbkFkdmljZVJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnZ2V0UmVtZWRpYXRpb25TdW1tYXJ5JykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnc2hvd1Jldm9jYXRpb25EaWFsb2cnKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oe30pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQgPVxyXG4gICAgICAgICAgICAgICAgbmV3IFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0KGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuUkVNRURJQVRJT05fQURWSUNFX1JFU1VMVCkpO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaXQoJ2dldHMgdGhlIHJlbWVkaWF0aW9uIHN1bW1hcnkgYW5kIGNhbGxzIHRocm91Z2ggdG8gc2hvd1Jldm9jYXRpb25EaWFsb2cnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBleGlzdGluZ0RlY2lzaW9uID0geyBzdGF0dXM6ICdSZW1lZGlhdGVkJ30sXHJcbiAgICAgICAgICAgICAgICByZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dOb25WaW9sYXRpb25SZXZvY2F0aW9uRGlhbG9nKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSxcclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nRGVjaXNpb24sIHJlYWRPbmx5KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmVtZWRpYXRpb25TdW1tYXJ5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV2b2NhdGlvbkRpYWxvZylcclxuICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksXHJcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnksIGV4aXN0aW5nRGVjaXNpb24sIHJlYWRPbmx5KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93UmV2b2NhdGlvbkRpYWxvZygpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjZXJ0aWZpY2F0aW9uU2VydmljZSwgc3BNb2RhbCwgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQsIG1vZGFsUmVzdWx0O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25TZXJ2aWNlXywgX3NwTW9kYWxfLCBSZW1lZGlhdGlvbkFkdmljZVJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ2lzUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKHRydWUpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1vY2sgb3V0IHRoZSBtb2RhbCBhbmQgZWl0aGVyIHJlamVjdCBpZiBubyBtb2RhbFJlc3VsdCwgb3IgcmVzb2x2ZSB3aXRoIHRoZSByZXN1bHQuXHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiAoIW1vZGFsUmVzdWx0KSA/ICRxLnJlamVjdCgpIDogJHEud2hlbihtb2RhbFJlc3VsdClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQgPSBhbmd1bGFyLmNvcHkoY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQpO1xyXG4gICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5hZHZpY2UgPSBhbmd1bGFyLmNvcHkocmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlKTtcclxuICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuc3VtbWFyeSA9IGFuZ3VsYXIuY29weShyZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcclxuICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQgPSBuZXcgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQocmVtZWRpYXRpb25BZHZpY2VSZXN1bHQpO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgaXQoJ3Jlc29sdmVzIHdpdGhvdXQgb3BlbmluZyBtb2RhbCBpZiBzdW1tYXJ5IGlzIGRlZmluZWQgd2l0aCBkZWZhdWx0IHJlbWVkaWF0b3IgYW5kIG5vIG92ZXJyaWRlJyArXHJcbiAgICAgICAgICAgICdhbG9uZyB3aXRoIHJldm9jYXRpb24gbW9kaWZpY2F0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb247XHJcblxyXG4gICAgICAgICAgICAvLyBUZXN0IGRhdGEgYWR2aWNlIHJlc3VsdCBhbHJlYWR5IGNvbnRhaW5zIHN1bW1hcnkgd2l0aCBkZWZhdWx0IHJlbWVkaWF0b3JcclxuICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuc3VtbWFyeS5lbmFibGVPdmVycmlkZURlZmF1bHRSZW1lZGlhdG9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNweU9uKHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnksICdpc01vZGlmaWFibGUnKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xyXG4gICAgICAgICAgICBzcHlPbihyZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaGFzUm9sZVJldm9jYXRpb25EZXRhaWxzJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZWNpc2lvbiA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIHRlc3RDZXJ0aWZpY2F0aW9uRGVjaXNpb24oZGVjaXNpb24sIGNlcnRJdGVtLCAnUmVtZWRpYXRlZCcpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVqZWN0cyB3aXRoIHJlYXNvbiBpZiBkaWFsb2cgc2hvdWxkIG5vdCBiZSBvcGVuZWQgYnV0IGV4aXN0aW5nIGRlY2lzaW9uIGlzIHBhc3NlZCBpbicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRlY2lzaW9uLCByZWplY3RlZFJlYXNvbjtcclxuXHJcbiAgICAgICAgICAgIC8vIFRlc3QgZGF0YSBhZHZpY2UgcmVzdWx0IGFscmVhZHkgY29udGFpbnMgc3VtbWFyeSB3aXRoIGRlZmF1bHQgcmVtZWRpYXRvclxyXG4gICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LmVuYWJsZU92ZXJyaWRlRGVmYXVsdFJlbWVkaWF0b3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgc3B5T24ocmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuc3VtbWFyeSwgJ2lzTW9kaWZpYWJsZScpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vIEV2ZW4gd2l0aCByb2xlIHJldm9jYXRpb24gZGV0YWlscyBkb250IG9wZW5cclxuICAgICAgICAgICAgc3B5T24ocmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuc3VtbWFyeSwgJ2hhc1JvbGVSZXZvY2F0aW9uRGV0YWlscycpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCB7fSwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7IGRlY2lzaW9uID0gcmVzdWx0OyB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHJlamVjdGVkUmVhc29uID0gcmVhc29uKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24pLm5vdC50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVqZWN0ZWRSZWFzb24pLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBtb2RhbCBpZiBkZWZhdWx0IHJlbWVkaWF0b3IgaXMgc2V0IGJ1dCBvdmVycmlkZSBpcyBlbmFibGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihyZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaXNNb2RpZmlhYmxlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBtb2RhbCBpZiBubyBkZWZhdWx0IHJlbWVkaWF0b3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LmRlZmF1bHRSZW1lZGlhdG9yO1xyXG4gICAgICAgICAgICBzcHlPbihyZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaXNNb2RpZmlhYmxlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBtb2RhbCBpZiByZXZvY2F0aW9uIG1vZGlmaWFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnkuZW5hYmxlT3ZlcnJpZGVEZWZhdWx0UmVtZWRpYXRvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzcHlPbihyZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaXNNb2RpZmlhYmxlJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV2b2NhdGlvbkRpYWxvZyhjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksXHJcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5hZHZpY2UsIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ29wZW5zIG1vZGFsIGlmIHJvbGUgcmV2b2NhdGlvbiBkZXRhaWxzIG1vZGlmaWFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnkuZW5hYmxlT3ZlcnJpZGVEZWZhdWx0UmVtZWRpYXRvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzcHlPbihyZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaGFzUm9sZVJldm9jYXRpb25EZXRhaWxzJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV2b2NhdGlvbkRpYWxvZyhjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksXHJcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5hZHZpY2UsIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBtb2RhbCBpZiBubyBzdW1tYXJ5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBkZWxldGUgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuc3VtbWFyeTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RNb2RhbFNpemUoaXNFbnRpdGxlbWVudFNvRCwgZXhwZWN0ZWRTaXplKSB7XHJcbiAgICAgICAgICAgIC8vIEdpdmUgdGhpcyBlbnRpdGxlbWVudHMgdG8gcmVtZWRpYXRlIGZvciBhbiBTb0QuXHJcbiAgICAgICAgICAgIGlmIChpc0VudGl0bGVtZW50U29EKSB7XHJcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5hZHZpY2UuZW50aXRsZW1lbnRzVG9SZW1lZGlhdGUgPSBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuUE9MSUNZX1RSRUVfTk9ERTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGxldCBtb2RhbENvbmZpZyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuICAgICAgICAgICAgZXhwZWN0KG1vZGFsQ29uZmlnLnNpemUpLnRvRXF1YWwoZXhwZWN0ZWRTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBhIGxhcmdlIG1vZGFsIGZvciBlbnRpdGxlbWVudCBTb0QnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RNb2RhbFNpemUodHJ1ZSwgJ2xnJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBhIG5vcm1hbCBzaXplIG1vZGFsIGZvciBub24tZW50aXRsZW1lbnQgU29EJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0TW9kYWxTaXplKGZhbHNlLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyByZWplY3RlZCBwcm9taXNlIGlmIGRpYWxvZyBpcyBjYW5jZWxlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlamVjdGVkO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV2b2NhdGlvbkRpYWxvZyhjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJyksXHJcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5hZHZpY2UsIHJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LnN1bW1hcnkpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlamVjdGVkKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyByZWplY3RlZCBlbXB0eSBwcm9taXNlIGlmIGRpYWxvZyBpcyByZXNvbHZlZCBidXQgcmVhZE9ubHkgaXMgdHJ1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlamVjdGVkUmVhc29uLCByZXNvbHZlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtb2RhbFJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIHJlY2lwaWVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYWJjZCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5LCB7fSwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlc29sdmVkID0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3RlZFJlYXNvbiA9IHJlYXNvbjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXNvbHZlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZWplY3RlZFJlYXNvbikubm90LnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdhZGRzIHZhbHVlcyB0byB0aGUgZGVjaXNpb24gZnJvbSB0aGUgZGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb247XHJcblxyXG4gICAgICAgICAgICBjZXJ0SXRlbS5zdW1tYXJ5U3RhdHVzID0gQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNoYWxsZW5nZWQ7XHJcblxyXG4gICAgICAgICAgICBtb2RhbFJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIHJlY2lwaWVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYWJjZCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb21tZW50czogJ2kgc2FpZCBzb21ldGhpbmcnLFxyXG4gICAgICAgICAgICAgICAgcmV2b2tlZFJvbGVzOiBbJ3JvbDEnLCAncm9sZTInXSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmlvbGF0aW9uRW50aXRsZW1lbnRzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvbWU6ICd0aGluZydcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25EZXRhaWxzOiBbeyBuZXdWYWx1ZTogJ3lhZGRheWFkZGEnfV1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1Jldm9jYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpLFxyXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2VSZXN1bHQuYWR2aWNlLCByZW1lZGlhdGlvbkFkdmljZVJlc3VsdC5zdW1tYXJ5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZWNpc2lvbiA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5yZWNpcGllbnQpLnRvRXF1YWwobW9kYWxSZXN1bHQucmVjaXBpZW50LmlkKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLnJlY2lwaWVudFN1bW1hcnkpLnRvRXF1YWwobW9kYWxSZXN1bHQucmVjaXBpZW50KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmNvbW1lbnRzKS50b0VxdWFsKG1vZGFsUmVzdWx0LmNvbW1lbnRzKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLnJldm9rZWRSb2xlcykudG9FcXVhbChtb2RhbFJlc3VsdC5yZXZva2VkUm9sZXMpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMpLnRvRXF1YWwobW9kYWxSZXN1bHQuc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24ucmVtZWRpYXRpb25EZXRhaWxzKS50b0VxdWFsKG1vZGFsUmVzdWx0LnJlbWVkaWF0aW9uRGV0YWlscyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5vbmVTdGVwQ2hhbGxlbmdlKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uY2hhbGxlbmdlQWN0aW9uKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuQ2hhbGxlbmdlQWN0aW9uLkFjY2VwdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd0Jsb2NrZWRCeVBhcmVudERpYWxvZygpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdvcGVucyBhIGRpYWxvZycsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0Jsb2NrZWRCeVBhcmVudERpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2Fsd2F5cyByZXR1cm5zIHJlamVjdGVkIHByb21pc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlUmVzb2x2ZWQ7XHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLnJldHVyblZhbHVlKHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDogJHEud2hlbigpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93QmxvY2tlZEJ5UGFyZW50RGlhbG9nKGNlcnRJdGVtKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcHJvbWlzZVJlc29sdmVkID0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBwcm9taXNlUmVzb2x2ZWQgPSBmYWxzZSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHByb21pc2VSZXNvbHZlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd0NlcnRpZmljYXRpb25EZWxlZ2F0aW9uRGlhbG9nKCknLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGNlcnRpZmljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdDZXJ0aWZ5IHRoZSBQcm9kdWN0aW9uIFNPRC04OTMgdmlvbGF0aW9uIG9uIFxcJ0Rvbm5hIFNjb3R0XFwnJyxcclxuICAgICAgICAgICAgaXRlbURlY2lzaW9uID0ge1xyXG4gICAgICAgICAgICAgICAgcmVjaXBpZW50OiB7IGlkOiAnMTIzNCcgfSxcclxuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiAnZGZkZWVyZScsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3NvbWUgZGVzY3JpcHRpb24nXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfY2VydGlmaWNhdGlvblNlcnZpY2VfKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdnZXREZWxlZ2F0aW9uRGVzY3JpcHRpb24nKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdzaG93RGVsZWdhdGlvbkRpYWxvZycpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6ICRxLndoZW4oaXRlbURlY2lzaW9uKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGl0KCdjcmVhdGVzIGFuIGl0ZW0gZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKENlcnRpZmljYXRpb25EZWNpc2lvbiwgJ2NyZWF0ZUl0ZW1EZWNpc2lvbicpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkRlbGVnYXRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZ2V0cyBhIGRlc2NyaXB0aW9uIGFuZCBjYWxscyBzaG93RGVsZWdhdGlvbkRpYWxvZycsICgpID0+IHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25EZWxlZ2F0aW9uRGlhbG9nKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldERlbGVnYXRpb25EZXNjcmlwdGlvbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0RlbGVnYXRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgcHJvbWlzZSByZXNvbHZlZCB3aXRoIGl0ZW0gZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvblByb21pc2UgPSBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkRlbGVnYXRpb25EaWFsb2coY2VydEl0ZW0sXHJcbiAgICAgICAgICAgICAgICBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGRlY2lzaW9uUHJvbWlzZS50aGVuKChkZWNpc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLnJlY2lwaWVudCkudG9FcXVhbChpdGVtRGVjaXNpb24ucmVjaXBpZW50LmlkKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5jb21tZW50cykudG9FcXVhbChpdGVtRGVjaXNpb24uY29tbWVudHMpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmRlc2NyaXB0aW9uKS50b0VxdWFsKGl0ZW1EZWNpc2lvbi5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dDZXJ0aWZpY2F0aW9uUmVhc3NpZ25EaWFsb2coKScsICgpID0+IHtcclxuICAgICAgICBsZXQgY2VydGlmaWNhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgICAgIGJ1bGtEZWNpc2lvbiA9IHtcclxuICAgICAgICAgICAgcmVjaXBpZW50OiB7IGlkOiAnMTIzNCcgfSxcclxuICAgICAgICAgICAgY29tbWVudHM6ICdhZGZhZHNmYXNkJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhZHNmYXNkZmFzZCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25TZXJ2aWNlXykgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ3Nob3dEZWxlZ2F0aW9uRGlhbG9nJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oYnVsa0RlY2lzaW9uKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBtb2NrIG91dCBkZWNpc2lvbiBzdG9yZSBmdW5jdGlvbnNcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUJ1bGtPdmVybGFwczogKCkgPT4ge30sXHJcbiAgICAgICAgICAgICAgICByZW1vdmVMaW5lSXRlbU92ZXJsYXBzOiAoKSA9PiB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBTYXZlRGVjaXNpb25zU3B5KHJlamVjdCkge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ3NhdmVEZWNpc2lvbnMnKS5hbmQucmV0dXJuVmFsdWUoXHJcbiAgICAgICAgICAgICAgICByZWplY3QgPyAkcS5yZWplY3QoeyBzdGF0dXM6IDQwOSB9KSA6ICRxLndoZW4oeyBkYXRhOiB7IG9iamVjdDoge30gfSB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnY3JlYXRlcyBhIGJ1bGsgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldHVwU2F2ZURlY2lzaW9uc1NweSgpO1xyXG4gICAgICAgICAgICBzcHlPbihDZXJ0aWZpY2F0aW9uRGVjaXNpb24sICdjcmVhdGVCdWxrRGVjaXNpb24nKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25SZWFzc2lnbkRpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHNob3dEZWxlZ2F0aW9uRGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cFNhdmVEZWNpc2lvbnNTcHkoKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25SZWFzc2lnbkRpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dEZWxlZ2F0aW9uRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyBzYXZlRGVjaXNpb25zJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cFNhdmVEZWNpc2lvbnNTcHkoKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25SZWFzc2lnbkRpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnNhdmVEZWNpc2lvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHJldHJ5IGRpYWxvZyBpZiBjZXJ0IGlzIGxvY2tlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgc2V0dXBTYXZlRGVjaXNpb25zU3B5KHRydWUpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ3Nob3dSZXRyeURpYWxvZycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvblJlYXNzaWduRGlhbG9nKGNlcnRJdGVtKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd1JldHJ5RGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBlcnJvciBtb2RhbCBpZiBzYXZlRGVjaXNpb25zIHJldHVybnMgZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2F2ZURlY2lzaW9ucycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiBbJ0NhblxcJ3Qgc2VsZiBjZXJ0aWZ5J10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dDZXJ0aWZpY2F0aW9uUmVhc3NpZ25EaWFsb2coY2VydEl0ZW0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93Q2VydGlmaWNhdGlvbkVudGl0eVJlYXNzaWduRGlhbG9nKCknLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGNlcnRpZmljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICBidWxrRGVjaXNpb24gPSB7XHJcbiAgICAgICAgICAgICAgICByZWNpcGllbnQ6IHsgaWQ6ICcxMjM0JyB9LFxyXG4gICAgICAgICAgICAgICAgY29tbWVudHM6ICdhZGZhZHNmYXNkJyxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnYWRzZmFzZGZhc2QnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfY2VydGlmaWNhdGlvblNlcnZpY2VfKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcclxuXHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnc2hvd0RlbGVnYXRpb25EaWFsb2cnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihidWxrRGVjaXNpb24pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIG1vY2sgb3V0IGRlY2lzaW9uIHN0b3JlIGZ1bmN0aW9uc1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQnVsa092ZXJsYXBzOiAoKSA9PiB7fSxcclxuICAgICAgICAgICAgICAgIHJlbW92ZUxpbmVJdGVtT3ZlcmxhcHM6ICgpID0+IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cFNhdmVEZWNpc2lvbnNTcHkocmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2F2ZURlY2lzaW9ucycpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgIHJlamVjdCA/ICRxLnJlamVjdCh7IHN0YXR1czogNDA5IH0pIDogJHEud2hlbih7IGRhdGE6IHsgb2JqZWN0OiB7fSB9IH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdjcmVhdGVzIGEgYnVsayBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgc2V0dXBTYXZlRGVjaXNpb25zU3B5KCk7XHJcbiAgICAgICAgICAgIHNweU9uKENlcnRpZmljYXRpb25EZWNpc2lvbiwgJ2NyZWF0ZUJ1bGtEZWNpc2lvbicpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkVudGl0eVJlYXNzaWduRGlhbG9nKGNlcnRJdGVtKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2FsbHMgc2hvd0RlbGVnYXRpb25EaWFsb2cnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldHVwU2F2ZURlY2lzaW9uc1NweSgpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkVudGl0eVJlYXNzaWduRGlhbG9nKGNlcnRJdGVtKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0RlbGVnYXRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHNhdmVEZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldHVwU2F2ZURlY2lzaW9uc1NweSgpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkVudGl0eVJlYXNzaWduRGlhbG9nKGNlcnRJdGVtKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2Uuc2F2ZURlY2lzaW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgcmV0cnkgZGlhbG9nIGlmIGNlcnQgaXMgbG9ja2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cFNhdmVEZWNpc2lvbnNTcHkodHJ1ZSk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnc2hvd1JldHJ5RGlhbG9nJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oKSk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dDZXJ0aWZpY2F0aW9uRW50aXR5UmVhc3NpZ25EaWFsb2coY2VydEl0ZW0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV0cnlEaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIGVycm9yIG1vZGFsIGlmIHNhdmVEZWNpc2lvbnMgcmV0dXJucyBlcnJvcicsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdzYXZlRGVjaXNpb25zJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IFsnQ2FuXFwndCBzZWxmIGNlcnRpZnknXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25FbnRpdHlSZWFzc2lnbkRpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dDZXJ0aWZpY2F0aW9uRW50aXR5RGVsZWdhdGlvbkRpYWxvZygpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjZXJ0aWZpY2F0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgYnVsa0RlY2lzaW9uID0ge1xyXG4gICAgICAgICAgICAgICAgcmVjaXBpZW50OiB7IGlkOiAnMTIzNCcgfSxcclxuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiAnYWRmYWRzZmFzZCcsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Fkc2Zhc2RmYXNkJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25TZXJ2aWNlXykgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ3Nob3dEZWxlZ2F0aW9uRGlhbG9nJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oYnVsa0RlY2lzaW9uKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBtb2NrIG91dCBkZWNpc2lvbiBzdG9yZSBmdW5jdGlvbnNcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUJ1bGtPdmVybGFwczogKCkgPT4ge30sXHJcbiAgICAgICAgICAgICAgICByZW1vdmVMaW5lSXRlbU92ZXJsYXBzOiAoKSA9PiB7fVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwU2F2ZURlY2lzaW9uc1NweShyZWplY3QpIHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdzYXZlRGVjaXNpb25zJykuYW5kLnJldHVyblZhbHVlKFxyXG4gICAgICAgICAgICAgICAgcmVqZWN0ID8gJHEucmVqZWN0KHsgc3RhdHVzOiA0MDkgfSkgOiAkcS53aGVuKHsgZGF0YTogeyBvYmplY3Q6IHt9IH0gfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2NyZWF0ZXMgYSBidWxrIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cFNhdmVEZWNpc2lvbnNTcHkoKTtcclxuICAgICAgICAgICAgc3B5T24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLCAnY3JlYXRlQnVsa0RlY2lzaW9uJyk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dDZXJ0aWZpY2F0aW9uRW50aXR5RGVsZWdhdGlvbkRpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHNob3dEZWxlZ2F0aW9uRGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cFNhdmVEZWNpc2lvbnNTcHkoKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25FbnRpdHlEZWxlZ2F0aW9uRGlhbG9nKGNlcnRJdGVtLCAzKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0RlbGVnYXRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHNhdmVEZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldHVwU2F2ZURlY2lzaW9uc1NweSh0cnVlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25FbnRpdHlEZWxlZ2F0aW9uRGlhbG9nKGNlcnRJdGVtKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2Uuc2F2ZURlY2lzaW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBidWxrRGVjaXNpb24uc3RhdHVzID0gQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5EZWxlZ2F0aW9uQWN0aW9uO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgcmV0cnkgZGlhbG9nIGlmIGNlcnQgaXMgbG9ja2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cFNhdmVEZWNpc2lvbnNTcHkodHJ1ZSk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnc2hvd1JldHJ5RGlhbG9nJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oKSk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dDZXJ0aWZpY2F0aW9uRW50aXR5RGVsZWdhdGlvbkRpYWxvZyhjZXJ0SXRlbSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dSZXRyeURpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgZXJyb3IgbW9kYWwgaWYgc2F2ZURlY2lzaW9ucyByZXR1cm5zIGVycm9yJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ3NhdmVEZWNpc2lvbnMnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yczogWydDYW5cXCd0IHNlbGYgY2VydGlmeSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkVudGl0eURlbGVnYXRpb25EaWFsb2coY2VydEl0ZW0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93RGVsZWdhdGlvbkRpYWxvZycsICgpID0+IHtcclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHNwTW9kYWwgb3BlbicsICgpID0+IHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0RlbGVnYXRpb25EaWFsb2coJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93RW50aXR5RGVsZWdhdGlvblJldm9rZUNvbmZpcm1hdGlvbkRpYWxvZygpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjZXJ0aWZpY2F0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgZGVsZWdhdGVkRW50aXR5O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25TZXJ2aWNlXykgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XHJcbiAgICAgICAgICAgIGRlbGVnYXRlZEVudGl0eSA9IGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl9FTlRJVFlfTElTVF9SRVNVTFQub2JqZWN0c1swXSk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cFNhdmVEZWNpc2lvbnNTcHkocmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2F2ZURlY2lzaW9ucycpLmFuZC5yZXR1cm5WYWx1ZShcclxuICAgICAgICAgICAgICAgIHJlamVjdCA/ICRxLnJlamVjdCh7IHN0YXR1czogNDA5IH0pIDogJHEud2hlbih7IGRhdGE6IHsgb2JqZWN0OiB7fSB9IH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdjcmVhdGVzIGEgYnVsayBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oQ2VydGlmaWNhdGlvbkRlY2lzaW9uLCAnY3JlYXRlQnVsa0RlY2lzaW9uJyk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dFbnRpdHlEZWxlZ2F0aW9uUmV2b2tlQ29uZmlybWF0aW9uRGlhbG9nKGRlbGVnYXRlZEVudGl0eSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIGNvbmZpcm0gZGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnY29uZmlybScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93RW50aXR5RGVsZWdhdGlvblJldm9rZUNvbmZpcm1hdGlvbkRpYWxvZyhkZWxlZ2F0ZWRFbnRpdHkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHNhdmVEZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldHVwU2F2ZURlY2lzaW9uc1NweSgpO1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnY29uZmlybScpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93RW50aXR5RGVsZWdhdGlvblJldm9rZUNvbmZpcm1hdGlvbkRpYWxvZyhkZWxlZ2F0ZWRFbnRpdHkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBlcnJvciBtb2RhbCBpZiBzYXZlRGVjaXNpb25zIHJldHVybnMgZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2F2ZURlY2lzaW9ucycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiBbJ0NhblxcJ3Qgc2VsZiBjZXJ0aWZ5J10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dFbnRpdHlEZWxlZ2F0aW9uUmV2b2tlQ29uZmlybWF0aW9uRGlhbG9nKGRlbGVnYXRlZEVudGl0eSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzQWxsb3dFeGNlcHRpb25EaWFsb2dSZXF1aXJlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjaGVja1ZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBjaGVja1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2dldENvbmZpZ3VyYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoe1xyXG4gICAgICAgICAgICAgICAgZG9lc1N0YXR1c1JlcXVpcmVDb21tZW50OiAoKSA9PiB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnY2hlY2tBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkJykuYW5kLmNhbGxGYWtlKCgpID0+IGNoZWNrVmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgbm90IHJlcXVpcmVkIHdoZW4gY2hlY2tBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkIHJldHVybnMgZmFsc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoZWNrVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVzdERpYWxvZ1JlcXVpcmVkKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ01pdGlnYXRlZCcpLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyByZXF1aXJlZCB3aGVuIGNoZWNrQWxsb3dFeGNlcHRpb25EaWFsb2dSZXF1aXJlZCByZXR1cm5zIHRydWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNoZWNrVmFsdWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0ZXN0RGlhbG9nUmVxdWlyZWQoY2VydEl0ZW0sIGdldFN0YXR1cygnTWl0aWdhdGVkJyksIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NoZWNrQWxsb3dFeGNlcHRpb25EaWFsb2dSZXF1aXJlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RXhjZXB0aW9uUG9wdXA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgZG9lc1N0YXR1c1JlcXVpcmVDb21tZW50OiAoKSA9PiB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShjb25maWcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgbm90IHJlcXVpcmVkIHdoZW4gYWxsb3dFeGNlcHRpb25Qb3B1cCBpcyBmYWxzZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uZmlnLmFsbG93RXhjZXB0aW9uUG9wdXAgPSBmYWxzZTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmNoZWNrQWxsb3dFeGNlcHRpb25EaWFsb2dSZXF1aXJlZChnZXRTdGF0dXMoJ01pdGlnYXRlZCcpKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyByZXF1aXJlZCB3aGVuIGFsbG93RXhjZXB0aW9uUG9wdXAgaXMgdHJ1ZSBhbmQgc3RhdHVzIGlzIE1pdGlnYXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgY29uZmlnLmFsbG93RXhjZXB0aW9uUG9wdXAgPSB0cnVlO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuY2hlY2tBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkKGdldFN0YXR1cygnTWl0aWdhdGVkJykpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgbm90IHJlcXVpcmVkIHdoZW4gZGVjaXNpb24gc3RhdHVzIGlzIG5vdCBNaXRpZ2F0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmNoZWNrQWxsb3dFeGNlcHRpb25EaWFsb2dSZXF1aXJlZChnZXRTdGF0dXMoJ0FwcHJvdmVkJykpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCByZXF1aXJlZCBmb3IgYWNjZXB0IGRlbGVnYXRpb24gYWN0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe1xyXG4gICAgICAgICAgICAgICAgZGVsZWdhdGlvblJldmlld0FjdGlvbjogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5EZWxlZ2F0aW9uQWN0aW9uLkFjY2VwdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5jaGVja0FsbG93RXhjZXB0aW9uRGlhbG9nUmVxdWlyZWQoc3RhdHVzKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd0FsbG93RXhjZXB0aW9uRGlhbG9nKCknLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6ICRxLndoZW4oe30pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnb3BlbnMgYSBkaWFsb2cnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbjtcclxuXHJcbiAgICAgICAgICAgIC8vIE1ha2UgdGhpcyBhIENoYWxsZW5nZWQgaXRlbSBzbyB3ZSBjYW4gdGVzdCBvbmVTdGVwIEFjY2VwdFxyXG4gICAgICAgICAgICBjZXJ0SXRlbS5zdW1tYXJ5U3RhdHVzID0gQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNoYWxsZW5nZWQ7XHJcblxyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93QWxsb3dFeGNlcHRpb25EaWFsb2coY2VydEl0ZW0sIGdldFN0YXR1cygnTWl0aWdhdGVkJykpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVjaXNpb24gPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5vbmVTdGVwQ2hhbGxlbmdlKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uY2hhbGxlbmdlQWN0aW9uKS50b0VxdWFsKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuQ2hhbGxlbmdlQWN0aW9uLkFjY2VwdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2hvd1JldHJ5RGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6ICRxLndoZW4oe30pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2FsbHMgc3BNb2RhbCBvcGVuIGFuZCB0aGUgcmV0cnkgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0ZXN0T2JqID0ge1xyXG4gICAgICAgICAgICAgICAgcmV0cnlGdW5jOiAoKSA9PiB7IHJldHVybiAnc29tZXRoaW5nJzsgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc3B5T24odGVzdE9iaiwgJ3JldHJ5RnVuYycpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93UmV0cnlEaWFsb2codGVzdE9iai5yZXRyeUZ1bmMpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRlc3RPYmoucmV0cnlGdW5jKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RGVsZWdhdGlvblJldm9rZUNvbmZpcm1hdGlvbklmUmVxdWlyZWQoKScsICgpID0+IHtcclxuICAgICAgICBsZXQgZGVsZWdhdGVkQ2VydDtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdjb25maXJtJyk7XHJcbiAgICAgICAgICAgIGRlbGVnYXRlZENlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF0pO1xyXG4gICAgICAgICAgICBkZWxlZ2F0ZWRDZXJ0LnN1bW1hcnlTdGF0dXMgPSBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuRGVsZWdhdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgc3BNb2RhbC5jb25maXJtKCkgd2hlbiBhY3Rpb24gc3RhdHVzIGlzIEFwcHJvdmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5nZXREZWxlZ2F0aW9uUmV2b2tlQ29uZmlybWF0aW9uSWZSZXF1aXJlZChkZWxlZ2F0ZWRDZXJ0LFxyXG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe3N0YXR1czogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkfSkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHNwTW9kYWwuY29uZmlybSgpIHdoZW4gYWN0aW9uIHN0YXR1cyBpcyBBY2tub3dsZWRnZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmdldERlbGVnYXRpb25SZXZva2VDb25maXJtYXRpb25JZlJlcXVpcmVkKGRlbGVnYXRlZENlcnQsXHJcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7c3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQWNrbm93bGVkZ2VkfSkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHNwTW9kYWwuY29uZmlybSgpIHdoZW4gYWN0aW9uIHN0YXR1cyBpcyBNaXRpZ2F0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmdldERlbGVnYXRpb25SZXZva2VDb25maXJtYXRpb25JZlJlcXVpcmVkKGRlbGVnYXRlZENlcnQsXHJcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7c3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkfSkpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHNwTW9kYWwuY29uZmlybSgpIHdoZW4gYWN0aW9uIHN0YXR1cyBpcyBSZW1lZGlhdGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5nZXREZWxlZ2F0aW9uUmV2b2tlQ29uZmlybWF0aW9uSWZSZXF1aXJlZChkZWxlZ2F0ZWRDZXJ0LFxyXG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe3N0YXR1czogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWR9KSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwuY29uZmlybSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgc3BNb2RhbC5jb25maXJtKCkgd2hlbiBhY3Rpb24gc3RhdHVzIGlzIENsZWFyZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmdldERlbGVnYXRpb25SZXZva2VDb25maXJtYXRpb25JZlJlcXVpcmVkKGRlbGVnYXRlZENlcnQsXHJcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7c3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQ2xlYXJlZH0pKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5jb25maXJtKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgc3BNb2RhbC5jb25maXJtKCkgd2hlbiBhY3Rpb24gc3RhdHVzIGlzIERlbGVnYXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuZ2V0RGVsZWdhdGlvblJldm9rZUNvbmZpcm1hdGlvbklmUmVxdWlyZWQoZGVsZWdhdGVkQ2VydCxcclxuICAgICAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtzdGF0dXM6IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWR9KSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwuY29uZmlybSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBzcE1vZGFsLmNvbmZpcm0oKSB3aGVuIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGRlY2lzaW9uLnJldm9rZURlbGVnYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBleGlzdGluZ0RlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihkZWxlZ2F0ZWRDZXJ0LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpO1xyXG4gICAgICAgICAgICBleGlzdGluZ0RlY2lzaW9uLnJldm9rZURlbGVnYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5nZXREZWxlZ2F0aW9uUmV2b2tlQ29uZmlybWF0aW9uSWZSZXF1aXJlZChkZWxlZ2F0ZWRDZXJ0LFxyXG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe3N0YXR1czogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWR9KSxcclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nRGVjaXNpb24pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBzcHlPblNlbmRSZW1pbmRlckVtYWlsKGNlcnRpZmljYXRpb25TZXJ2aWNlLCByZWplY3QpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IHJlamVjdCA/ICRxLnJlamVjdCh7IHN0YXR1czogNTAwIH0pIDogJHEud2hlbih7IHN0YXR1czogMjAwIH0pO1xyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnc2VuZENlcnRpZmljYXRpb25SZW1pbmRlckVtYWlsJykuYW5kLnJldHVyblZhbHVlKHByb21pc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93Q2VydGlmaWNhdGlvblJlbWluZGVyRW1haWxEaWFsb2coKScsICgpID0+IHtcclxuICAgICAgICBsZXQgY2VydGlmaWNhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgICAgIGNlcnRJZCA9ICdjZXJ0MScsXHJcbiAgICAgICAgICAgIGVtYWlsVGVtcGxhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICB0bzogJ2NlcnQxQGV4YW1wbGUuY29tJyxcclxuICAgICAgICAgICAgICAgIGZyb206ICdncnVtYnlAc2hpcHMuY29tJyxcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6ICdzd2FiYmluZyB0aGUgZGVjaycsXHJcbiAgICAgICAgICAgICAgICBib2R5OiAnWW91IHJlYWxseSBuZWVkIHRvIGdldCBvbiB0aGF0IScsXHJcbiAgICAgICAgICAgICAgICB0b0lkZW50aXR5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcxMjM0JyxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnR2lsbGlnYW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiAnZ2lsbGlnYW5AaXNsYW5kLmNvbSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25TZXJ2aWNlXykgPT4ge1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XHJcblxyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ2dldENlcnRpZmljYXRpb25SZW1pbmRlckVtYWlsVGVtcGxhdGUnKVxyXG4gICAgICAgICAgICAgICAgLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKGVtYWlsVGVtcGxhdGUpKTtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuZW1haWxEaWFsb2dTZXJ2aWNlLCAnc2hvd0VtYWlsRGlhbG9nJylcclxuICAgICAgICAgICAgICAgIC5hbmQucmV0dXJuVmFsdWUoJHEud2hlbihlbWFpbFRlbXBsYXRlKSk7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNwTm90aWZpY2F0aW9uU2VydmljZSwgJ2FkZE5vdGlmaWNhdGlvbicpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zcE5vdGlmaWNhdGlvblNlcnZpY2UsICd0cmlnZ2VyRGlyZWN0aXZlJyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgZ2V0Q2VydGlmaWNhdGlvblJlbWluZGVyRW1haWxUZW1wbGF0ZSgpJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPblNlbmRSZW1pbmRlckVtYWlsKGNlcnRpZmljYXRpb25TZXJ2aWNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dDZXJ0aWZpY2F0aW9uUmVtaW5kZXJFbWFpbERpYWxvZyhjZXJ0SWQpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uUmVtaW5kZXJFbWFpbFRlbXBsYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBzaG93RW1haWxEaWFsb2coKScsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T25TZW5kUmVtaW5kZXJFbWFpbChjZXJ0aWZpY2F0aW9uU2VydmljZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvblJlbWluZGVyRW1haWxEaWFsb2coY2VydElkKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuZW1haWxEaWFsb2dTZXJ2aWNlLnNob3dFbWFpbERpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgc2VuZENlcnRpZmljYXRpb25SZW1pbmRlckVtYWlsKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uU2VuZFJlbWluZGVyRW1haWwoY2VydGlmaWNhdGlvblNlcnZpY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25SZW1pbmRlckVtYWlsRGlhbG9nKGNlcnRJZCk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLnNlbmRDZXJ0aWZpY2F0aW9uUmVtaW5kZXJFbWFpbCkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgc3BOb3RpZmljYXRpb25TZXJ2aWNlKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uU2VuZFJlbWluZGVyRW1haWwoY2VydGlmaWNhdGlvblNlcnZpY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25SZW1pbmRlckVtYWlsRGlhbG9nKGNlcnRJZCk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNwTm90aWZpY2F0aW9uU2VydmljZS5hZGROb3RpZmljYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNwTm90aWZpY2F0aW9uU2VydmljZS50cmlnZ2VyRGlyZWN0aXZlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgc2hvdyBhbGVydCBkaWFsb2cgd2hlbiBzZW5kaW5nIGVtYWlsIHJldHVybnMgcmVzcG9uc2Ugc3RhdHVzIG9mIDUwMCcsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T25TZW5kUmVtaW5kZXJFbWFpbChjZXJ0aWZpY2F0aW9uU2VydmljZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XHJcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLnNob3dDZXJ0aWZpY2F0aW9uUmVtaW5kZXJFbWFpbERpYWxvZyhjZXJ0SWQpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS50aXRsZSkudG9CZSgndWlfZW1haWxfZXJyb3JfdGl0bGUnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS50eXBlKS50b0JlKCdhbGVydCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbmZpcm1SZXZva2VBY2NvdW50RGVjaXNpb25DaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdENvbmZpcm1SZXZva2VBY2NvdW50KGN1cnJlbnRTdGF0dXMsIHN0YXR1cywgZGVjaXNpb24sIGlzU2hvdywgaXNQYXNzZWREZWNpc2lvbikge1xyXG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnY29uZmlybScpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0nKS5hbmQucmV0dXJuVmFsdWUoZGVjaXNpb24pO1xyXG4gICAgICAgICAgICBjZXJ0SXRlbS5kZWNpc2lvblN0YXR1cyA9IHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGN1cnJlbnRTdGF0dXNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuY29uZmlybUFjY291bnREZWNpc2lvbkNoYW5nZShbY2VydEl0ZW1dLCBzdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAoaXNQYXNzZWREZWNpc2lvbikgPyBkZWNpc2lvbiA6IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGlmIChpc1Nob3cpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXNQYXNzZWREZWNpc2lvbikge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RWZmZWN0aXZlRGVjaXNpb25CeUl0ZW0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnRJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHNob3cgaWYgZXhpc3RpbmcgZGVjaXNpb24gaXMgbm90IFJldm9rZUFjY291bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XHJcbiAgICAgICAgICAgIHRlc3RDb25maXJtUmV2b2tlQWNjb3VudCh1bmRlZmluZWQsIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgZGVjaXNpb24sIGZhbHNlLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIGRpYWxvZyBpZiBleGlzdGluZyBkZWNpc2lvbiBpcyBSZXZva2VBY2NvdW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ1Jldm9rZUFjY291bnQnKSk7XHJcbiAgICAgICAgICAgIHRlc3RDb25maXJtUmV2b2tlQWNjb3VudCh1bmRlZmluZWQsIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgZGVjaXNpb24sIHRydWUsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3Qgc2hvdyBpZiBzYXZlZCBkZWNpc2lvbiBpcyBSZXZva2VBY2NvdW50IHdpdGggZXhpc3RpbmcgZGVjaXNpb24gYWxyZWFkeSBtYWRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpO1xyXG4gICAgICAgICAgICB0ZXN0Q29uZmlybVJldm9rZUFjY291bnQoJ1Jldm9rZUFjY291bnQnLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIGRlY2lzaW9uLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBkaWFsb2cgaWYgc2F2ZWQgZGVjaXNpb24gaXMgUmV2b2tlQWNjb3VudCB3aXRoIG5vIGRlY2lzaW9uIG1hZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RDb25maXJtUmV2b2tlQWNjb3VudCgnUmV2b2tlQWNjb3VudCcsIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgdW5kZWZpbmVkLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2ZldGNoZXMgdGhlIGVmZmVjdGl2ZSBkZWNpc2lvbiBpZiBub3QgcGFzc2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0Q29uZmlybVJldm9rZUFjY291bnQoJ1Jldm9rZUFjY291bnQnLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIHVuZGVmaW5lZCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzRGlhbG9nUmVxdWlyZWQoKScsICgpID0+IHtcclxuICAgICAgICBmdW5jdGlvbiBzZXR1cERpYWxvZ1JlcXVpcmVkKHNweVJlc3VsdHMpIHtcclxuICAgICAgICAgICAgbGV0IG1ldGhvZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkJyxcclxuICAgICAgICAgICAgICAgICdjaGVja0NvbW1lbnREaWFsb2dSZXF1aXJlZCcsXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tSZXZvY2F0aW9uV2l0aFN1bW1hcnknLFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbidcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgc3B5UmVzdWx0cyA9IHNweVJlc3VsdHMgfHwge307XHJcbiAgICAgICAgICAgIG1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBzcHlSZXN1bHRzW21ldGhvZF0gfHwgZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgbWV0aG9kKS5hbmQucmV0dXJuVmFsdWUocmV0dXJuVmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5vbmUgb2YgdGhlIGRpYWxvZ3MgYXJlIHJlcXVpcmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cERpYWxvZ1JlcXVpcmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5pc0RpYWxvZ1JlcXVpcmVkKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ01pdGlnYXRlZCcpKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgYWxsb3cgZXhjZXB0aW9uIGRpYWxvZyBpcyByZXF1aXJlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgc2V0dXBEaWFsb2dSZXF1aXJlZCh7XHJcbiAgICAgICAgICAgICAgICAnY2hlY2tBbGxvd0V4Y2VwdGlvbkRpYWxvZ1JlcXVpcmVkJzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmlzRGlhbG9nUmVxdWlyZWQoY2VydEl0ZW0sIGdldFN0YXR1cygnTWl0aWdhdGVkJykpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGNvbW1lbnQgZGlhbG9nIGlzIHJlcXVpcmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXR1cERpYWxvZ1JlcXVpcmVkKHtcclxuICAgICAgICAgICAgICAgICdjaGVja0NvbW1lbnREaWFsb2dSZXF1aXJlZCcgOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuaXNEaWFsb2dSZXF1aXJlZChjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdNaXRpZ2F0ZWQnKSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgcmVtZWRpYXRpb24gc3VtbWFyeSBpcyByZXF1aXJlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgc2V0dXBEaWFsb2dSZXF1aXJlZCh7XHJcbiAgICAgICAgICAgICAgICAnY2hlY2tSZXZvY2F0aW9uV2l0aFN1bW1hcnknIDogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLmlzRGlhbG9nUmVxdWlyZWQoY2VydEl0ZW0sIGdldFN0YXR1cygnUmV2b2tlZCcpKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQgKCdyZXR1cm5zIHRydWUgaWYgdmlvbGF0aW9uIHJldm9jYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldHVwRGlhbG9nUmVxdWlyZWQoe1xyXG4gICAgICAgICAgICAgICAgJ2NoZWNrUG9saWN5VmlvbGF0aW9uUmV2b2NhdGlvbicgOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UuaXNEaWFsb2dSZXF1aXJlZChjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZXZva2VkJykpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
