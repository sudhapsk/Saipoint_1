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

            describe('certificationItemService', function () {
                var certificationItemService = undefined,
                    certificationDataService = undefined,
                    certificationDialogService = undefined,
                    certificationService = undefined,
                    $q = undefined,
                    $scope = undefined,
                    CertificationDecision = undefined,
                    certItem = undefined,
                    showDialog = undefined,
                    dialogDecision = undefined,
                    CertificationActionStatus = undefined,
                    CertificationDecisionStatus = undefined,
                    CertificationItem = undefined,
                    certificationTestData = undefined,
                    showFunc = undefined,
                    noDialogReason = undefined;

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 13 */
                beforeEach(inject(function (_certificationItemService_, _certificationDataService_, _certificationService_, $rootScope, _CertificationDecision_, _certificationTestData_, _CertificationItem_, _certificationDialogService_, _CertificationActionStatus_, _CertificationDecisionStatus_, _$q_, Certification) {
                    certificationDataService = _certificationDataService_;
                    certificationItemService = _certificationItemService_;
                    certificationService = _certificationService_;
                    CertificationDecision = _CertificationDecision_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    CertificationDecisionStatus = _CertificationDecisionStatus_;
                    CertificationItem = _CertificationItem_;
                    certificationTestData = _certificationTestData_;
                    certificationDialogService = _certificationDialogService_;
                    $q = _$q_;
                    $scope = $rootScope.$new();

                    certItem = createCertificationItem(certificationTestData.CERT_ITEMS[0]);
                    certificationDataService.initialize(new Certification(certificationTestData.CERTIFICATION_1));
                    certificationDataService.initializeConfiguration({
                        processRevokesImmediately: false
                    });
                    certificationDataService.decisions.clearDecisions();

                    // Don't show a dialog for most tests - default to cancelling the dialog.
                    showDialog = false;
                    dialogDecision = undefined;

                    showFunc = jasmine.createSpy('showFunc').and.callFake(function () {
                        // If there is a decision, resolve with it.
                        if (dialogDecision) {
                            return $q.when(dialogDecision);
                        }

                        if (noDialogReason) {
                            return $q.reject(noDialogReason);
                        }

                        // Otherwise, simulate cancelling the dialog by rejecting.
                        return $q.reject();
                    });

                    spyOn(certificationDialogService, 'getDialog').and.callFake(function () {
                        // If not showing a dialog, just resolve with undefined.
                        if (!showDialog) {
                            return $q.when(undefined);
                        }

                        // We're showing a dialog, so resolve with a "show function".
                        return $q.when(showFunc);
                    });
                }));

                function createCertificationItem(data) {
                    var certItem = new CertificationItem(data);
                    certItem.canChangeDecision = true;
                    return certItem;
                }

                function getStatus(status, action) {
                    var config = {
                        status: status
                    };
                    if (!!action) {
                        config.delegationReviewAction = action;
                    }
                    return new CertificationActionStatus(config);
                }

                describe('setDecision()', function () {
                    it('adds a new decision if none exists', function () {
                        var toggleDecision = undefined;
                        certificationItemService.setDecision(certItem, getStatus('Approved')).then(function (returnedDecision) {
                            return toggleDecision = returnedDecision;
                        });
                        $scope.$apply();
                        var storedDecision = certificationDataService.decisions.getEffectiveDecision(certItem.id);
                        expect(storedDecision).toBeDefined();
                        expect(storedDecision).toBe(toggleDecision);
                    });

                    it('removes existing decision if same status', function () {
                        certificationItemService.setDecision(certItem, getStatus('Approved'));
                        $scope.$apply();
                        expect(certificationDataService.decisions.getDecision(certItem.id)).toBeDefined();
                        var toggleDecision = undefined;
                        certificationItemService.setDecision(certItem, getStatus('Approved')).then(function (returnedDecision) {
                            return toggleDecision = returnedDecision;
                        });

                        $scope.$apply();
                        expect(certificationDataService.decisions.getEffectiveDecision(certItem.id)).not.toBeDefined();
                        expect(toggleDecision).toBeUndefined();
                    });

                    it('replaces existing decision if different status', function () {
                        var decision = undefined;
                        certificationItemService.setDecision(certItem, getStatus('Approved'));
                        $scope.$apply();
                        decision = certificationDataService.decisions.getDecision(certItem.id);
                        expect(decision).toBeDefined();

                        var toggleDecision = undefined;
                        certificationItemService.setDecision(certItem, getStatus('Remediated')).then(function (returnedDecision) {
                            return toggleDecision = returnedDecision;
                        });
                        $scope.$apply();
                        decision = certificationDataService.decisions.getEffectiveDecision(certItem.id);
                        expect(decision).toBeDefined();
                        expect(decision.status).toEqual('Remediated');
                        expect(decision).toBe(toggleDecision);
                    });

                    describe('challenge comment dialog', function () {
                        var showChallengeCommentDialog = false,
                            challengeComment = 'i challenge this';

                        beforeEach(function () {
                            spyOn(certificationDialogService, 'getChallengeCommentIfRequired').and.callFake(function () {
                                // If not showing a dialog, just resolve with undefined.
                                if (!showChallengeCommentDialog) {
                                    return $q.when();
                                }

                                return $q.when(challengeComment);
                            });
                        });

                        it('sets challengeComments on decision when shown', function () {
                            var toggleDecision = undefined;

                            showChallengeCommentDialog = true;

                            certificationItemService.setDecision(certItem, getStatus('Approved')).then(function (returnedDecision) {
                                return toggleDecision = returnedDecision;
                            });

                            $scope.$apply();

                            var decision = certificationDataService.decisions.getDecision(certItem.id);

                            expect(decision).toBeDefined();
                            expect(decision).toBe(toggleDecision);
                            expect(decision.challengeComments).toBeDefined();
                            expect(decision.challengeComments).toEqual(challengeComment);
                        });

                        it('does not set challengeComments on decision when not shown', function () {
                            var toggleDecision = undefined;

                            showChallengeCommentDialog = false;

                            certificationItemService.setDecision(certItem, getStatus('Approved')).then(function (returnedDecision) {
                                return toggleDecision = returnedDecision;
                            });

                            $scope.$apply();

                            var decision = certificationDataService.decisions.getDecision(certItem.id);

                            expect(decision).toBeDefined();
                            expect(decision).toBe(toggleDecision);
                            expect(decision.challengeComments).not.toBeDefined();
                            expect(decision.challengeComments).not.toEqual(challengeComment);
                        });
                    });

                    describe('delegationRevokeConfirmation', function () {
                        var userClickedNo = false,
                            userClickedYes = false,
                            delegatedCert = undefined;

                        beforeEach(function () {
                            spyOn(certificationDialogService, 'getDelegationRevokeConfirmationIfRequired').and.callFake(function () {
                                // If user clicked 'no', reject and bail
                                if (userClickedNo) {
                                    return $q.reject();
                                }
                                // If user clicked 'yes', resolve with true
                                if (userClickedYes) {
                                    return $q.when(true);
                                }
                                // Dialog is not needed
                                return $q.when();
                            });
                            delegatedCert = createCertificationItem(certificationTestData.CERT_ITEMS[0]);
                            delegatedCert.summaryStatus = CertificationItem.Status.Delegated;
                        });

                        it('if user clicked yes, set new status', function () {
                            var toggleDecision = undefined;

                            userClickedYes = true;
                            certificationItemService.setDecision(delegatedCert, getStatus('Approved')).then(function (returnedDecision) {
                                return toggleDecision = returnedDecision;
                            });

                            $scope.$apply();

                            var decision = certificationDataService.decisions.getDecision(delegatedCert.id);
                            expect(decision).toBeDefined();
                            expect(decision.revokeDelegation).toBeTruthy();
                            expect(decision).toBe(toggleDecision);
                        });

                        it('if user clicked no, keep current status', function () {
                            var toggleDecision = undefined;

                            userClickedNo = true;
                            certificationItemService.setDecision(delegatedCert, getStatus('Remediated')).then(function (returnedDecision) {
                                return toggleDecision = returnedDecision;
                            });

                            $scope.$apply();

                            var decision = certificationDataService.decisions.getDecision(delegatedCert.id);
                            expect(decision).toBeUndefined();
                            expect(toggleDecision).toBeUndefined();
                        });
                    });

                    describe('dialog', function () {
                        beforeEach(function () {
                            // Show a dialog for these tests, but cancel by default.
                            showDialog = true;
                            dialogDecision = undefined;
                        });

                        it('saves decision from dialog', function () {
                            // Setup a decision so that the dialog will get resolved.
                            dialogDecision = CertificationDecision.createItemDecision(certItem, getStatus('Approved'), 'some comments');

                            // Toggle the decision and apply so that the dialog will be displayed and resolved.
                            var toggleDecision = undefined;
                            certificationItemService.setDecision(certItem, getStatus('Approved')).then(function (returnedDecision) {
                                return toggleDecision = returnedDecision;
                            });
                            $scope.$apply();

                            // Make sure that the decision was saved with the details from the dialog.
                            var decision = certificationDataService.decisions.getDecision(certItem.id);
                            expect(decision).toBeDefined();
                            expect(decision.certificationItem).toEqual(dialogDecision.certificationItem);
                            expect(decision.status).toEqual(dialogDecision.status);
                            expect(decision.comments).toEqual(dialogDecision.comments);
                            expect(decision).toBe(toggleDecision);
                        });

                        it('does not change decision if dialog is cancelled', function () {
                            // Toggle the decision and apply so that the dialog will cancel.
                            var rejected = false;
                            certificationItemService.setDecision(certItem, getStatus('Approved'))['catch'](function () {
                                return rejected = true;
                            });
                            $scope.$apply();

                            // Make sure that the decision was not saved.
                            var decision = certificationDataService.decisions.getDecision(certItem.id);
                            expect(decision).not.toBeDefined();
                            expect(rejected).toEqual(true);
                        });

                        it('restores previous decision if dialog is cancelled', function () {
                            // Make a decision without showing the dialog.
                            showDialog = false;
                            certificationItemService.setDecision(certItem, getStatus('Approved'));
                            $scope.$apply();

                            // Make sure the initial decision is saved.
                            var oldDecision = certificationDataService.decisions.getDecision(certItem.id);
                            expect(oldDecision).toBeDefined();
                            expect(oldDecision.certificationItem).toEqual(certItem);
                            expect(oldDecision.status).toEqual('Approved');

                            // Re-enable the dialog, but it will be cancelled.
                            showDialog = true;
                            certificationItemService.setDecision(certItem, getStatus('Revoked'));
                            $scope.$apply();

                            // Make sure that the initial decision has not been changed.
                            var newDecision = certificationDataService.decisions.getDecision(certItem.id);
                            expect(newDecision).toBeDefined();
                            expect(newDecision).toEqual(oldDecision);
                        });
                    });

                    it('throws with no certificationItem', function () {
                        expect(function () {
                            return certificationItemService.setDecision(undefined, getStatus('Approved'));
                        });
                    });

                    it('throws with no status', function () {
                        expect(function () {
                            return certificationItemService.setDecision(certItem, undefined);
                        });
                    });
                });

                describe('isItemReadOnly()', function () {
                    function testItemReadOnly(canChangeDecision, requiresReview, requiresChallengeDecision, readOnly) {
                        var item = {
                            canChangeDecision: canChangeDecision,
                            requiresReview: requiresReview,
                            requiresChallengeDecision: requiresChallengeDecision
                        };
                        expect(certificationItemService.isItemReadOnly(item)).toEqual(readOnly);
                    }

                    it('returns true if cannot change decision and neither review nor challenge decision are required', function () {
                        testItemReadOnly(false, false, false, true);
                    });

                    it('returns false if can change decision', function () {
                        testItemReadOnly(true, false, false, false);
                    });

                    it('returns false if cannot change decision but review is required', function () {
                        testItemReadOnly(false, true, false, false);
                    });

                    it('returns false if cannot change decision but challenge decision is required', function () {
                        testItemReadOnly(false, false, true, false);
                    });
                });

                describe('revoke account confirmation', function () {
                    function testConfirmRevokeAccount(resolved, isSuccess, isDecisionSet) {
                        spyOn(certificationDialogService, 'confirmAccountDecisionChange').and.callFake(function () {
                            if (resolved) {
                                return $q.when();
                            } else {
                                return $q.reject();
                            }
                        });
                        var success = undefined;
                        certificationItemService.setDecision(certItem, getStatus('Approved')).then(function () {
                            return success = true;
                        })['catch'](function () {
                            return success = false;
                        });
                        $scope.$apply();

                        // Make sure that the decision was not saved.
                        var decision = certificationDataService.decisions.getDecision(certItem.id);
                        if (isDecisionSet) {
                            expect(decision).toBeDefined();
                        } else {
                            expect(decision).not.toBeDefined();
                        }

                        expect(success).toEqual(isSuccess);
                    }

                    it('continues with changing decision if confirmed', function () {
                        testConfirmRevokeAccount(true, true, true);
                    });

                    it('does not change decision if canceled', function () {
                        testConfirmRevokeAccount(false, false, false);
                    });
                });

                describe('getDecision()', function () {
                    it('returns decision in the store if one exists', function () {
                        var decision = { status: 'Approved' };
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.returnValue(decision);
                        var foundDecision = certificationItemService.getDecision(certItem);
                        expect(certificationDataService.decisions.getEffectiveDecision).toHaveBeenCalledWith(certItem.id, undefined, certItem);
                        expect(foundDecision).toEqual(decision);
                    });

                    it('returns decision on item if none exists in the store', function () {
                        var decision = { status: 'Approved' };
                        certItem.decision = decision;
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.returnValue(undefined);
                        var foundDecision = certificationItemService.getDecision(certItem);
                        expect(certificationDataService.decisions.getEffectiveDecision).toHaveBeenCalledWith(certItem.id, undefined, certItem);
                        expect(foundDecision).toEqual(decision);
                    });

                    it('returns decision if no item decision but identity delegation exists', function () {
                        var decisionStatus = new CertificationDecisionStatus({
                            currentState: new CertificationActionStatus({
                                status: CertificationActionStatus.Name.Delegated,
                                name: CertificationActionStatus.Name.Delegated
                            }),
                            delegationComments: 'comments 1',
                            delegationDescription: 'desc 1',
                            delegationOwner: {
                                displayName: 'George Jetson',
                                id: 'delownerid1'
                            }
                        });

                        certItem.decisionStatus = decisionStatus;
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.returnValue(undefined);
                        var foundDecision = certificationItemService.getDecision(certItem);
                        expect(certificationDataService.decisions.getEffectiveDecision).toHaveBeenCalledWith(certItem.id, undefined, certItem);
                        expect(foundDecision.certificationItemId).toEqual(certItem.id);
                        expect(foundDecision.status).toEqual(CertificationActionStatus.Name.Delegated);
                        expect(foundDecision.recipient).toEqual(decisionStatus.delegationOwner.id);
                        expect(foundDecision.comments).toEqual(decisionStatus.delegationComments);
                        expect(foundDecision.description).toEqual(decisionStatus.delegationDescription);
                    });
                });

                describe('view/edit decisions', function () {
                    var itemDecision = undefined,
                        hasDialog = undefined,
                        isReadOnly = undefined,
                        existingDecision = undefined;

                    beforeEach(function () {
                        spyOn(certificationItemService, 'getDecision').and.callFake(function () {
                            return itemDecision;
                        });
                        spyOn(certificationItemService, 'isItemReadOnly').and.callFake(function () {
                            return isReadOnly;
                        });
                        spyOn(certificationDialogService, 'isDialogRequired').and.callFake(function () {
                            return hasDialog;
                        });
                        itemDecision = undefined;
                        isReadOnly = undefined;
                        hasDialog = undefined;
                        existingDecision = CertificationDecision.createItemDecision(certItem, getStatus('Mitigated'));
                    });

                    function setup(newItemDecision, newIsReadOnly, newHasDialog) {
                        itemDecision = newItemDecision;
                        isReadOnly = newIsReadOnly;
                        hasDialog = newHasDialog;
                    }

                    describe('canViewDecision', function () {
                        it('return false if there is no decision', function () {
                            setup(undefined, true, true);
                            expect(certificationItemService.canViewDecision(certItem)).toEqual(false);
                        });

                        it('returns false if there is a decision but no dialog required', function () {
                            setup(existingDecision, true, false);
                            expect(certificationItemService.canViewDecision(certItem)).toEqual(false);
                        });

                        it('returns false if there is a decision and dialog required, but not read only', function () {
                            setup(existingDecision, false, true);
                            expect(certificationItemService.canViewDecision(certItem)).toEqual(false);
                        });

                        it('return true if there is a decision with dialog and it is read only', function () {
                            setup(existingDecision, true, true);
                            expect(certificationItemService.canViewDecision(certItem)).toEqual(true);
                        });
                    });

                    describe('canEditDecision', function () {
                        it('return false if there is no decision', function () {
                            setup(undefined, false, true);
                            expect(certificationItemService.canEditDecision(certItem)).toEqual(false);
                        });

                        it('returns false if there is a decision but no dialog required', function () {
                            setup(existingDecision, false, false);
                            expect(certificationItemService.canEditDecision(certItem)).toEqual(false);
                        });

                        it('returns false if there is a decision and dialog required, but read only', function () {
                            setup(existingDecision, true, false);
                            expect(certificationItemService.canEditDecision(certItem)).toEqual(false);
                        });

                        it('return true if there is a decision with dialog and it is not read only', function () {
                            setup(existingDecision, false, true);
                            expect(certificationItemService.canEditDecision(certItem)).toEqual(true);
                        });

                        it('return false if cert is not editable', function () {
                            setup(existingDecision, false, true);
                            spyOn(certificationDataService, 'isCertificationEditable').and.returnValue(false);
                            expect(certificationItemService.canEditDecision(certItem)).toEqual(false);
                        });
                    });

                    describe('viewDecision', function () {
                        it('calls editDecision with readOnly true', function () {
                            spyOn(certificationItemService, 'editDecision');
                            certificationItemService.viewDecision(certItem);
                            expect(certificationItemService.editDecision).toHaveBeenCalledWith(certItem, true);
                        });
                    });

                    describe('editDecision', function () {
                        var spNotificationService = undefined;

                        beforeEach(inject(function (_spNotificationService_) {
                            spNotificationService = _spNotificationService_;
                            spyOn(spNotificationService, 'addMessage');
                            spyOn(spNotificationService, 'triggerDirective');
                        }));

                        it('throws with no item', function () {
                            expect(function () {
                                return certificationItemService.editDecision();
                            }).toThrow();
                        });

                        it('throws if item has no decision', function () {
                            setup(undefined, false, true);
                            expect(function () {
                                return certificationItemService.editDecision(certItem);
                            }).toThrow();
                        });

                        it('gets the dialog for the decision and calls through with existing decision adn readOnly flag', function () {
                            setup(existingDecision, false, false);
                            showDialog = true;
                            certificationItemService.editDecision(certItem, true);
                            $scope.$apply();
                            expect(showFunc).toHaveBeenCalledWith(existingDecision, true);
                        });

                        it('adds new decision to store', function () {
                            setup(existingDecision, false, false);
                            showDialog = true;
                            dialogDecision = CertificationDecision.createItemDecision(certItem, getStatus('Mitigated'), 'hello');
                            certificationItemService.editDecision(certItem);
                            $scope.$apply();
                            expect(certificationDataService.decisions.getEffectiveDecision(certItem.id)).toEqual(dialogDecision);
                        });

                        it('does not add new decision to store if canceled', function () {
                            setup(existingDecision, false, false);
                            certificationDataService.decisions.addDecision(existingDecision);
                            showDialog = true;
                            certificationItemService.editDecision(certItem);
                            $scope.$apply();
                            expect(certificationDataService.decisions.getEffectiveDecision(certItem.id)).toEqual(existingDecision);
                        });

                        it('returns promise with new decision', function () {
                            var resolvedVal = undefined;
                            setup(existingDecision, false, false);
                            showDialog = true;
                            dialogDecision = CertificationDecision.createItemDecision(certItem, getStatus('Mitigated'), 'hello');
                            certificationItemService.editDecision(certItem).then(function (val) {
                                return resolvedVal = val;
                            });
                            $scope.$apply();
                            expect(resolvedVal).toEqual(dialogDecision);
                        });

                        it('returns rejected promise if there is no dialog ', function () {
                            var rejected = undefined;
                            setup(existingDecision, false, false);
                            certificationItemService.editDecision(certItem).then(function () {
                                return rejected = false;
                            })['catch'](function () {
                                return rejected = true;
                            });
                            $scope.$apply();
                            expect(rejected).toEqual(true);
                        });

                        it('adds notification message with reason if no dialog is launched', function () {
                            var rejected = undefined;
                            setup(existingDecision, true, true);
                            showDialog = true;
                            noDialogReason = 'NO DIALOG!';
                            certificationItemService.editDecision(certItem).then(function () {
                                return rejected = false;
                            })['catch'](function () {
                                return rejected = true;
                            });
                            $scope.$apply();
                            expect(rejected).toEqual(true);
                            expect(spNotificationService.addMessage).toHaveBeenCalled();
                            expect(spNotificationService.addMessage.calls.mostRecent().args[0].messageOrKey).toEqual(noDialogReason);
                            expect(spNotificationService.triggerDirective).toHaveBeenCalled();
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyx1QkFBdUIsVUFBVSxTQUFTOztJQUV2SDs7SUFFQSxJQUFJLHFCQUFxQjtJQUN6QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQU43QixTQUFTLDRCQUE0QixZQUFXO2dCQUM1QyxJQUFJLDJCQUF3QjtvQkFBRSwyQkFBd0I7b0JBQUUsNkJBQTBCO29CQUM5RSx1QkFBb0I7b0JBQUUsS0FBRTtvQkFBRSxTQUFNO29CQUFFLHdCQUFxQjtvQkFBRSxXQUFRO29CQUFFLGFBQVU7b0JBQUUsaUJBQWM7b0JBQzdGLDRCQUF5QjtvQkFBRSw4QkFBMkI7b0JBQUUsb0JBQWlCO29CQUFFLHdCQUFxQjtvQkFBRSxXQUFRO29CQUMxRyxpQkFBYzs7Z0JBRWxCLFdBQVcsT0FBTyxxQkFBcUI7OztnQkFHdkMsV0FBVyxPQUFPLFVBQVMsNEJBQTRCLDRCQUE0Qix3QkFDeEQsWUFBWSx5QkFBeUIseUJBQXlCLHFCQUM5RCw4QkFBOEIsNkJBQTZCLCtCQUMzRCxNQUFNLGVBQWU7b0JBQzVDLDJCQUEyQjtvQkFDM0IsMkJBQTJCO29CQUMzQix1QkFBdUI7b0JBQ3ZCLHdCQUF3QjtvQkFDeEIsNEJBQTRCO29CQUM1Qiw4QkFBOEI7b0JBQzlCLG9CQUFvQjtvQkFDcEIsd0JBQXdCO29CQUN4Qiw2QkFBNkI7b0JBQzdCLEtBQUs7b0JBQ0wsU0FBVSxXQUFXOztvQkFFckIsV0FBVyx3QkFBd0Isc0JBQXNCLFdBQVc7b0JBQ3BFLHlCQUF5QixXQUFXLElBQUksY0FBYyxzQkFBc0I7b0JBQzVFLHlCQUF5Qix3QkFBd0I7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LFVBQVUsY0FBYzs0QkFDNUYseUJBQXlCLGFBQWEsVUFBVSxLQUFLLFVBQUMsS0FBRztnQ0FzQ3pDLE9BdEM4QyxjQUFjOzs0QkFDNUUsT0FBTzs0QkFDUCxPQUFPLGFBQWEsUUFBUTs7O3dCQUdoQyxHQUFHLG1EQUFtRCxZQUFNOzRCQUN4RCxJQUFJLFdBQVE7NEJBQ1osTUFBTSxrQkFBa0IsT0FBTzs0QkFDL0IseUJBQXlCLGFBQWEsVUFDakMsS0FBSyxZQUFBO2dDQXVDTSxPQXZDQSxXQUFXOytCQUFNLFNBQ3RCLFlBQUE7Z0NBd0NLLE9BeENDLFdBQVc7OzRCQUM1QixPQUFPOzRCQUNQLE9BQU8sVUFBVSxRQUFROzs7d0JBRzdCLEdBQUcsa0VBQWtFLFlBQU07NEJBQ3ZFLElBQUksV0FBUTs0QkFDWixNQUFNLGtCQUFrQixNQUFNOzRCQUM5QixhQUFhOzRCQUNiLGlCQUFpQjs0QkFDakIseUJBQXlCLGFBQWEsVUFDakMsS0FBSyxZQUFBO2dDQXlDTSxPQXpDQSxXQUFXOytCQUFNLFNBQ3RCLFlBQUE7Z0NBMENLLE9BMUNDLFdBQVc7OzRCQUM1QixPQUFPOzRCQUNQLE9BQU8sVUFBVSxRQUFROzRCQUN6QixPQUFPLHNCQUFzQixZQUFZOzRCQUN6QyxPQUFPLHNCQUFzQixXQUFXLE1BQU0sYUFBYSxLQUFLLEdBQUcsY0FDOUQsUUFBUTs0QkFDYixPQUFPLHNCQUFzQixrQkFBa0I7Ozs7Ozs7R0FpRDVEIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLCBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsIGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLFxuICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSwgJHEsICRzY29wZSwgQ2VydGlmaWNhdGlvbkRlY2lzaW9uLCBjZXJ0SXRlbSwgc2hvd0RpYWxvZywgZGlhbG9nRGVjaXNpb24sXG4gICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMsIENlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1cywgQ2VydGlmaWNhdGlvbkl0ZW0sIGNlcnRpZmljYXRpb25UZXN0RGF0YSwgc2hvd0Z1bmMsXG4gICAgICAgIG5vRGlhbG9nUmVhc29uO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSwgdGVzdE1vZHVsZSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczogMTMgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlXywgX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV8sIF9jZXJ0aWZpY2F0aW9uU2VydmljZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZSwgX0NlcnRpZmljYXRpb25EZWNpc2lvbl8sIF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfLCBfQ2VydGlmaWNhdGlvbkl0ZW1fLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZV8sIF9DZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzXywgX0NlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1c18sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXyRxXywgQ2VydGlmaWNhdGlvbikge1xuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcbiAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25JdGVtU2VydmljZV87XG4gICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XG4gICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMgPSBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c187XG4gICAgICAgIENlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1cyA9IF9DZXJ0aWZpY2F0aW9uRGVjaXNpb25TdGF0dXNfO1xuICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbSA9IF9DZXJ0aWZpY2F0aW9uSXRlbV87XG4gICAgICAgIGNlcnRpZmljYXRpb25UZXN0RGF0YSA9IF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZV87XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgJHNjb3BlICA9ICRyb290U2NvcGUuJG5ldygpO1xuXG4gICAgICAgIGNlcnRJdGVtID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF0pO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZShuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKSk7XG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplQ29uZmlndXJhdGlvbih7XG4gICAgICAgICAgICBwcm9jZXNzUmV2b2tlc0ltbWVkaWF0ZWx5OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5jbGVhckRlY2lzaW9ucygpO1xuXG4gICAgICAgIC8vIERvbid0IHNob3cgYSBkaWFsb2cgZm9yIG1vc3QgdGVzdHMgLSBkZWZhdWx0IHRvIGNhbmNlbGxpbmcgdGhlIGRpYWxvZy5cbiAgICAgICAgc2hvd0RpYWxvZyA9IGZhbHNlO1xuICAgICAgICBkaWFsb2dEZWNpc2lvbiA9IHVuZGVmaW5lZDtcblxuICAgICAgICBzaG93RnVuYyA9IGphc21pbmUuY3JlYXRlU3B5KCdzaG93RnVuYycpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGRlY2lzaW9uLCByZXNvbHZlIHdpdGggaXQuXG4gICAgICAgICAgICBpZiAoZGlhbG9nRGVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihkaWFsb2dEZWNpc2lvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub0RpYWxvZ1JlYXNvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3Qobm9EaWFsb2dSZWFzb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHNpbXVsYXRlIGNhbmNlbGxpbmcgdGhlIGRpYWxvZyBieSByZWplY3RpbmcuXG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnZ2V0RGlhbG9nJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcbiAgICAgICAgICAgIC8vIElmIG5vdCBzaG93aW5nIGEgZGlhbG9nLCBqdXN0IHJlc29sdmUgd2l0aCB1bmRlZmluZWQuXG4gICAgICAgICAgICBpZiAoIXNob3dEaWFsb2cpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSdyZSBzaG93aW5nIGEgZGlhbG9nLCBzbyByZXNvbHZlIHdpdGggYSBcInNob3cgZnVuY3Rpb25cIi5cbiAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHNob3dGdW5jKTtcbiAgICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oZGF0YSkge1xuICAgICAgICBsZXQgY2VydEl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oZGF0YSk7XG4gICAgICAgIGNlcnRJdGVtLmNhbkNoYW5nZURlY2lzaW9uID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGNlcnRJdGVtO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZ2V0U3RhdHVzKHN0YXR1cywgYWN0aW9uKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1c1xuICAgICAgICB9O1xuICAgICAgICBpZiAoISFhY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbmZpZy5kZWxlZ2F0aW9uUmV2aWV3QWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyhjb25maWcpO1xuICAgIH1cblxuICAgIGRlc2NyaWJlKCdzZXREZWNpc2lvbigpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdhZGRzIGEgbmV3IGRlY2lzaW9uIGlmIG5vbmUgZXhpc3RzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgdG9nZ2xlRGVjaXNpb247XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2Uuc2V0RGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkuXG4gICAgICAgICAgICAgICAgdGhlbigocmV0dXJuZWREZWNpc2lvbikgPT4gdG9nZ2xlRGVjaXNpb24gPSByZXR1cm5lZERlY2lzaW9uKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGxldCBzdG9yZWREZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RWZmZWN0aXZlRGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuICAgICAgICAgICAgZXhwZWN0KHN0b3JlZERlY2lzaW9uKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHN0b3JlZERlY2lzaW9uKS50b0JlKHRvZ2dsZURlY2lzaW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlbW92ZXMgZXhpc3RpbmcgZGVjaXNpb24gaWYgc2FtZSBzdGF0dXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldERlY2lzaW9uKGNlcnRJdGVtLmlkKSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGxldCB0b2dnbGVEZWNpc2lvbjtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKS5cbiAgICAgICAgICAgICAgICB0aGVuKChyZXR1cm5lZERlY2lzaW9uKSA9PiB0b2dnbGVEZWNpc2lvbiA9IHJldHVybmVkRGVjaXNpb24pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5nZXRFZmZlY3RpdmVEZWNpc2lvbihjZXJ0SXRlbS5pZCkpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRvZ2dsZURlY2lzaW9uKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXBsYWNlcyBleGlzdGluZyBkZWNpc2lvbiBpZiBkaWZmZXJlbnQgc3RhdHVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGVjaXNpb247XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2Uuc2V0RGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBkZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS50b0JlRGVmaW5lZCgpO1xuXG4gICAgICAgICAgICBsZXQgdG9nZ2xlRGVjaXNpb247XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2Uuc2V0RGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpKS5cbiAgICAgICAgICAgICAgICB0aGVuKChyZXR1cm5lZERlY2lzaW9uKSA9PiB0b2dnbGVEZWNpc2lvbiA9IHJldHVybmVkRGVjaXNpb24pO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZGVjaXNpb24gPSBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldEVmZmVjdGl2ZURlY2lzaW9uKGNlcnRJdGVtLmlkKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5zdGF0dXMpLnRvRXF1YWwoJ1JlbWVkaWF0ZWQnKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZSh0b2dnbGVEZWNpc2lvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdjaGFsbGVuZ2UgY29tbWVudCBkaWFsb2cnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2hvd0NoYWxsZW5nZUNvbW1lbnREaWFsb2cgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2VDb21tZW50ID0gJ2kgY2hhbGxlbmdlIHRoaXMnO1xuXG4gICAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ2dldENoYWxsZW5nZUNvbW1lbnRJZlJlcXVpcmVkJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgbm90IHNob3dpbmcgYSBkaWFsb2csIGp1c3QgcmVzb2x2ZSB3aXRoIHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaG93Q2hhbGxlbmdlQ29tbWVudERpYWxvZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKGNoYWxsZW5nZUNvbW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzZXRzIGNoYWxsZW5nZUNvbW1lbnRzIG9uIGRlY2lzaW9uIHdoZW4gc2hvd24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRvZ2dsZURlY2lzaW9uO1xuXG4gICAgICAgICAgICAgICAgc2hvd0NoYWxsZW5nZUNvbW1lbnREaWFsb2cgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLnNldERlY2lzaW9uKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ0FwcHJvdmVkJykpLlxuICAgICAgICAgICAgICAgICAgICB0aGVuKChyZXR1cm5lZERlY2lzaW9uKSA9PiB0b2dnbGVEZWNpc2lvbiA9IHJldHVybmVkRGVjaXNpb24pO1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRlY2lzaW9uID0gY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5nZXREZWNpc2lvbihjZXJ0SXRlbS5pZCk7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QoZGVjaXNpb24pLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS50b0JlKHRvZ2dsZURlY2lzaW9uKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uY2hhbGxlbmdlQ29tbWVudHMpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmNoYWxsZW5nZUNvbW1lbnRzKS50b0VxdWFsKGNoYWxsZW5nZUNvbW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdCBzZXQgY2hhbGxlbmdlQ29tbWVudHMgb24gZGVjaXNpb24gd2hlbiBub3Qgc2hvd24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRvZ2dsZURlY2lzaW9uO1xuXG4gICAgICAgICAgICAgICAgc2hvd0NoYWxsZW5nZUNvbW1lbnREaWFsb2cgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKS5cbiAgICAgICAgICAgICAgICAgICAgdGhlbigocmV0dXJuZWREZWNpc2lvbikgPT4gdG9nZ2xlRGVjaXNpb24gPSByZXR1cm5lZERlY2lzaW9uKTtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZSh0b2dnbGVEZWNpc2lvbik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmNoYWxsZW5nZUNvbW1lbnRzKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uY2hhbGxlbmdlQ29tbWVudHMpLm5vdC50b0VxdWFsKGNoYWxsZW5nZUNvbW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2RlbGVnYXRpb25SZXZva2VDb25maXJtYXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdXNlckNsaWNrZWRObyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVzZXJDbGlja2VkWWVzID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVsZWdhdGVkQ2VydDtcblxuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdnZXREZWxlZ2F0aW9uUmV2b2tlQ29uZmlybWF0aW9uSWZSZXF1aXJlZCcpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHVzZXIgY2xpY2tlZCAnbm8nLCByZWplY3QgYW5kIGJhaWxcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJDbGlja2VkTm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB1c2VyIGNsaWNrZWQgJ3llcycsIHJlc29sdmUgd2l0aCB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyQ2xpY2tlZFllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4odHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gRGlhbG9nIGlzIG5vdCBuZWVkZWRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWxlZ2F0ZWRDZXJ0ID0gY3JlYXRlQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF0pO1xuICAgICAgICAgICAgICAgIGRlbGVnYXRlZENlcnQuc3VtbWFyeVN0YXR1cyA9IENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5EZWxlZ2F0ZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2lmIHVzZXIgY2xpY2tlZCB5ZXMsIHNldCBuZXcgc3RhdHVzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0b2dnbGVEZWNpc2lvbjtcblxuICAgICAgICAgICAgICAgIHVzZXJDbGlja2VkWWVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2Uuc2V0RGVjaXNpb24oZGVsZWdhdGVkQ2VydCwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmV0dXJuZWREZWNpc2lvbikgPT4gdG9nZ2xlRGVjaXNpb24gPSByZXR1cm5lZERlY2lzaW9uKTtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oZGVsZWdhdGVkQ2VydC5pZCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5yZXZva2VEZWxlZ2F0aW9uKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS50b0JlKHRvZ2dsZURlY2lzaW9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnaWYgdXNlciBjbGlja2VkIG5vLCBrZWVwIGN1cnJlbnQgc3RhdHVzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0b2dnbGVEZWNpc2lvbjtcblxuICAgICAgICAgICAgICAgIHVzZXJDbGlja2VkTm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihkZWxlZ2F0ZWRDZXJ0LCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJldHVybmVkRGVjaXNpb24pID0+IHRvZ2dsZURlY2lzaW9uID0gcmV0dXJuZWREZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZGVjaXNpb24gPSBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldERlY2lzaW9uKGRlbGVnYXRlZENlcnQuaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh0b2dnbGVEZWNpc2lvbikudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdkaWFsb2cnLCAoKSA9PiB7XG4gICAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBTaG93IGEgZGlhbG9nIGZvciB0aGVzZSB0ZXN0cywgYnV0IGNhbmNlbCBieSBkZWZhdWx0LlxuICAgICAgICAgICAgICAgIHNob3dEaWFsb2cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRpYWxvZ0RlY2lzaW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzYXZlcyBkZWNpc2lvbiBmcm9tIGRpYWxvZycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCBhIGRlY2lzaW9uIHNvIHRoYXQgdGhlIGRpYWxvZyB3aWxsIGdldCByZXNvbHZlZC5cbiAgICAgICAgICAgICAgICBkaWFsb2dEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oY2VydEl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIGdldFN0YXR1cygnQXBwcm92ZWQnKSwgJ3NvbWUgY29tbWVudHMnKTtcblxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgZGVjaXNpb24gYW5kIGFwcGx5IHNvIHRoYXQgdGhlIGRpYWxvZyB3aWxsIGJlIGRpc3BsYXllZCBhbmQgcmVzb2x2ZWQuXG4gICAgICAgICAgICAgICAgbGV0IHRvZ2dsZURlY2lzaW9uO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKS5cbiAgICAgICAgICAgICAgICAgICAgdGhlbigocmV0dXJuZWREZWNpc2lvbikgPT4gdG9nZ2xlRGVjaXNpb24gPSByZXR1cm5lZERlY2lzaW9uKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZGVjaXNpb24gd2FzIHNhdmVkIHdpdGggdGhlIGRldGFpbHMgZnJvbSB0aGUgZGlhbG9nLlxuICAgICAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uY2VydGlmaWNhdGlvbkl0ZW0pLnRvRXF1YWwoZGlhbG9nRGVjaXNpb24uY2VydGlmaWNhdGlvbkl0ZW0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5zdGF0dXMpLnRvRXF1YWwoZGlhbG9nRGVjaXNpb24uc3RhdHVzKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uY29tbWVudHMpLnRvRXF1YWwoZGlhbG9nRGVjaXNpb24uY29tbWVudHMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZSh0b2dnbGVEZWNpc2lvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGNoYW5nZSBkZWNpc2lvbiBpZiBkaWFsb2cgaXMgY2FuY2VsbGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgZGVjaXNpb24gYW5kIGFwcGx5IHNvIHRoYXQgdGhlIGRpYWxvZyB3aWxsIGNhbmNlbC5cbiAgICAgICAgICAgICAgICBsZXQgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2Uuc2V0RGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSkuXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKCgpID0+IHJlamVjdGVkID0gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGRlY2lzaW9uIHdhcyBub3Qgc2F2ZWQuXG4gICAgICAgICAgICAgICAgbGV0IGRlY2lzaW9uID0gY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5nZXREZWNpc2lvbihjZXJ0SXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVqZWN0ZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Jlc3RvcmVzIHByZXZpb3VzIGRlY2lzaW9uIGlmIGRpYWxvZyBpcyBjYW5jZWxsZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTWFrZSBhIGRlY2lzaW9uIHdpdGhvdXQgc2hvd2luZyB0aGUgZGlhbG9nLlxuICAgICAgICAgICAgICAgIHNob3dEaWFsb2cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2Uuc2V0RGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBpbml0aWFsIGRlY2lzaW9uIGlzIHNhdmVkLlxuICAgICAgICAgICAgICAgIGxldCBvbGREZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvbGREZWNpc2lvbikudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qob2xkRGVjaXNpb24uY2VydGlmaWNhdGlvbkl0ZW0pLnRvRXF1YWwoY2VydEl0ZW0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvbGREZWNpc2lvbi5zdGF0dXMpLnRvRXF1YWwoJ0FwcHJvdmVkJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZS1lbmFibGUgdGhlIGRpYWxvZywgYnV0IGl0IHdpbGwgYmUgY2FuY2VsbGVkLlxuICAgICAgICAgICAgICAgIHNob3dEaWFsb2cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdSZXZva2VkJykpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBpbml0aWFsIGRlY2lzaW9uIGhhcyBub3QgYmVlbiBjaGFuZ2VkLlxuICAgICAgICAgICAgICAgIGxldCBuZXdEZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChuZXdEZWNpc2lvbikudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobmV3RGVjaXNpb24pLnRvRXF1YWwob2xkRGVjaXNpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBjZXJ0aWZpY2F0aW9uSXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbih1bmRlZmluZWQsIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhyb3dzIHdpdGggbm8gc3RhdHVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLnNldERlY2lzaW9uKGNlcnRJdGVtLCB1bmRlZmluZWQpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNJdGVtUmVhZE9ubHkoKScsICgpID0+IHtcbiAgICAgICAgZnVuY3Rpb24gdGVzdEl0ZW1SZWFkT25seShjYW5DaGFuZ2VEZWNpc2lvbiwgcmVxdWlyZXNSZXZpZXcsIHJlcXVpcmVzQ2hhbGxlbmdlRGVjaXNpb24sIHJlYWRPbmx5KSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICBjYW5DaGFuZ2VEZWNpc2lvbjogY2FuQ2hhbmdlRGVjaXNpb24sXG4gICAgICAgICAgICAgICAgcmVxdWlyZXNSZXZpZXc6IHJlcXVpcmVzUmV2aWV3LFxuICAgICAgICAgICAgICAgIHJlcXVpcmVzQ2hhbGxlbmdlRGVjaXNpb246IHJlcXVpcmVzQ2hhbGxlbmdlRGVjaXNpb25cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmlzSXRlbVJlYWRPbmx5KGl0ZW0pKS50b0VxdWFsKHJlYWRPbmx5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgY2Fubm90IGNoYW5nZSBkZWNpc2lvbiBhbmQgbmVpdGhlciByZXZpZXcgbm9yIGNoYWxsZW5nZSBkZWNpc2lvbiBhcmUgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0ZXN0SXRlbVJlYWRPbmx5KGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBjYW4gY2hhbmdlIGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdEl0ZW1SZWFkT25seSh0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgY2Fubm90IGNoYW5nZSBkZWNpc2lvbiBidXQgcmV2aWV3IGlzIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdEl0ZW1SZWFkT25seShmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgY2Fubm90IGNoYW5nZSBkZWNpc2lvbiBidXQgY2hhbGxlbmdlIGRlY2lzaW9uIGlzIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdEl0ZW1SZWFkT25seShmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmV2b2tlIGFjY291bnQgY29uZmlybWF0aW9uJywgKCkgPT4ge1xuICAgICAgICBmdW5jdGlvbiB0ZXN0Q29uZmlybVJldm9rZUFjY291bnQocmVzb2x2ZWQsIGlzU3VjY2VzcywgaXNEZWNpc2lvblNldCkge1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdjb25maXJtQWNjb3VudERlY2lzaW9uQ2hhbmdlJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcztcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5zZXREZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKS5cbiAgICAgICAgICAgICAgICB0aGVuKCgpID0+IHN1Y2Nlc3MgPSB0cnVlKS5cbiAgICAgICAgICAgICAgICBjYXRjaCgoKSA9PiBzdWNjZXNzID0gZmFsc2UpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZGVjaXNpb24gd2FzIG5vdCBzYXZlZC5cbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RGVjaXNpb24oY2VydEl0ZW0uaWQpO1xuICAgICAgICAgICAgaWYgKGlzRGVjaXNpb25TZXQpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGVjaXNpb24pLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4cGVjdChzdWNjZXNzKS50b0VxdWFsKGlzU3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnY29udGludWVzIHdpdGggY2hhbmdpbmcgZGVjaXNpb24gaWYgY29uZmlybWVkJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdENvbmZpcm1SZXZva2VBY2NvdW50KHRydWUsIHRydWUsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3QgY2hhbmdlIGRlY2lzaW9uIGlmIGNhbmNlbGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdENvbmZpcm1SZXZva2VBY2NvdW50KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXREZWNpc2lvbigpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBkZWNpc2lvbiBpbiB0aGUgc3RvcmUgaWYgb25lIGV4aXN0cycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IHsgc3RhdHVzOiAnQXBwcm92ZWQnfTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXRFZmZlY3RpdmVEZWNpc2lvbicpLmFuZC5yZXR1cm5WYWx1ZShkZWNpc2lvbik7XG4gICAgICAgICAgICBsZXQgZm91bmREZWNpc2lvbiA9IGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5nZXREZWNpc2lvbihjZXJ0SXRlbSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5nZXRFZmZlY3RpdmVEZWNpc2lvbilcbiAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydEl0ZW0uaWQsIHVuZGVmaW5lZCwgY2VydEl0ZW0pO1xuICAgICAgICAgICAgZXhwZWN0KGZvdW5kRGVjaXNpb24pLnRvRXF1YWwoZGVjaXNpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBkZWNpc2lvbiBvbiBpdGVtIGlmIG5vbmUgZXhpc3RzIGluIHRoZSBzdG9yZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IHsgc3RhdHVzOiAnQXBwcm92ZWQnfTtcbiAgICAgICAgICAgIGNlcnRJdGVtLmRlY2lzaW9uID0gZGVjaXNpb247XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGxldCBmb3VuZERlY2lzaW9uID0gY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmdldERlY2lzaW9uKGNlcnRJdGVtKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldEVmZmVjdGl2ZURlY2lzaW9uKVxuICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0SXRlbS5pZCwgdW5kZWZpbmVkLCBjZXJ0SXRlbSk7XG4gICAgICAgICAgICBleHBlY3QoZm91bmREZWNpc2lvbikudG9FcXVhbChkZWNpc2lvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGRlY2lzaW9uIGlmIG5vIGl0ZW0gZGVjaXNpb24gYnV0IGlkZW50aXR5IGRlbGVnYXRpb24gZXhpc3RzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRlY2lzaW9uU3RhdHVzID0gbmV3IENlcnRpZmljYXRpb25EZWNpc2lvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlOiBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGRlbGVnYXRpb25Db21tZW50czogJ2NvbW1lbnRzIDEnLFxuICAgICAgICAgICAgICAgIGRlbGVnYXRpb25EZXNjcmlwdGlvbjogJ2Rlc2MgMScsXG4gICAgICAgICAgICAgICAgZGVsZWdhdGlvbk93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnR2VvcmdlIEpldHNvbicsXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnZGVsb3duZXJpZDEnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNlcnRJdGVtLmRlY2lzaW9uU3RhdHVzID0gZGVjaXNpb25TdGF0dXM7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb24nKS5hbmQucmV0dXJuVmFsdWUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGxldCBmb3VuZERlY2lzaW9uID0gY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmdldERlY2lzaW9uKGNlcnRJdGVtKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldEVmZmVjdGl2ZURlY2lzaW9uKVxuICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0SXRlbS5pZCwgdW5kZWZpbmVkLCBjZXJ0SXRlbSk7XG4gICAgICAgICAgICBleHBlY3QoZm91bmREZWNpc2lvbi5jZXJ0aWZpY2F0aW9uSXRlbUlkKS50b0VxdWFsKGNlcnRJdGVtLmlkKTtcbiAgICAgICAgICAgIGV4cGVjdChmb3VuZERlY2lzaW9uLnN0YXR1cykudG9FcXVhbChDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChmb3VuZERlY2lzaW9uLnJlY2lwaWVudCkudG9FcXVhbChkZWNpc2lvblN0YXR1cy5kZWxlZ2F0aW9uT3duZXIuaWQpO1xuICAgICAgICAgICAgZXhwZWN0KGZvdW5kRGVjaXNpb24uY29tbWVudHMpLnRvRXF1YWwoZGVjaXNpb25TdGF0dXMuZGVsZWdhdGlvbkNvbW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdChmb3VuZERlY2lzaW9uLmRlc2NyaXB0aW9uKS50b0VxdWFsKGRlY2lzaW9uU3RhdHVzLmRlbGVnYXRpb25EZXNjcmlwdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndmlldy9lZGl0IGRlY2lzaW9ucycsICgpID0+IHtcbiAgICAgICAgbGV0IGl0ZW1EZWNpc2lvbiwgaGFzRGlhbG9nLCBpc1JlYWRPbmx5LCBleGlzdGluZ0RlY2lzaW9uO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLCAnZ2V0RGVjaXNpb24nKS5hbmQuY2FsbEZha2UoKCkgPT4gaXRlbURlY2lzaW9uKTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtU2VydmljZSwgJ2lzSXRlbVJlYWRPbmx5JykuYW5kLmNhbGxGYWtlKCgpID0+IGlzUmVhZE9ubHkpO1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdpc0RpYWxvZ1JlcXVpcmVkJykuYW5kLmNhbGxGYWtlKCgpID0+IGhhc0RpYWxvZyk7XG4gICAgICAgICAgICBpdGVtRGVjaXNpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpc1JlYWRPbmx5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaGFzRGlhbG9nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZXhpc3RpbmdEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oY2VydEl0ZW0sIGdldFN0YXR1cygnTWl0aWdhdGVkJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBzZXR1cChuZXdJdGVtRGVjaXNpb24sIG5ld0lzUmVhZE9ubHksIG5ld0hhc0RpYWxvZykge1xuICAgICAgICAgICAgaXRlbURlY2lzaW9uID0gbmV3SXRlbURlY2lzaW9uO1xuICAgICAgICAgICAgaXNSZWFkT25seSA9IG5ld0lzUmVhZE9ubHk7XG4gICAgICAgICAgICBoYXNEaWFsb2cgPSBuZXdIYXNEaWFsb2c7XG4gICAgICAgIH1cblxuICAgICAgICBkZXNjcmliZSgnY2FuVmlld0RlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ3JldHVybiBmYWxzZSBpZiB0aGVyZSBpcyBubyBkZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cCh1bmRlZmluZWQsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuY2FuVmlld0RlY2lzaW9uKGNlcnRJdGVtKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgYSBkZWNpc2lvbiBidXQgbm8gZGlhbG9nIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldHVwKGV4aXN0aW5nRGVjaXNpb24sIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmNhblZpZXdEZWNpc2lvbihjZXJ0SXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGlzIGEgZGVjaXNpb24gYW5kIGRpYWxvZyByZXF1aXJlZCwgYnV0IG5vdCByZWFkIG9ubHknLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0dXAoZXhpc3RpbmdEZWNpc2lvbiwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuY2FuVmlld0RlY2lzaW9uKGNlcnRJdGVtKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JldHVybiB0cnVlIGlmIHRoZXJlIGlzIGEgZGVjaXNpb24gd2l0aCBkaWFsb2cgYW5kIGl0IGlzIHJlYWQgb25seScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmNhblZpZXdEZWNpc2lvbihjZXJ0SXRlbSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2NhbkVkaXREZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGl0KCdyZXR1cm4gZmFsc2UgaWYgdGhlcmUgaXMgbm8gZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0dXAodW5kZWZpbmVkLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5jYW5FZGl0RGVjaXNpb24oY2VydEl0ZW0pKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGVyZSBpcyBhIGRlY2lzaW9uIGJ1dCBubyBkaWFsb2cgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0dXAoZXhpc3RpbmdEZWNpc2lvbiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmNhbkVkaXREZWNpc2lvbihjZXJ0SXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGlzIGEgZGVjaXNpb24gYW5kIGRpYWxvZyByZXF1aXJlZCwgYnV0IHJlYWQgb25seScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5jYW5FZGl0RGVjaXNpb24oY2VydEl0ZW0pKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJuIHRydWUgaWYgdGhlcmUgaXMgYSBkZWNpc2lvbiB3aXRoIGRpYWxvZyBhbmQgaXQgaXMgbm90IHJlYWQgb25seScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5jYW5FZGl0RGVjaXNpb24oY2VydEl0ZW0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZXR1cm4gZmFsc2UgaWYgY2VydCBpcyBub3QgZWRpdGFibGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0dXAoZXhpc3RpbmdEZWNpc2lvbiwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJ2lzQ2VydGlmaWNhdGlvbkVkaXRhYmxlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmNhbkVkaXREZWNpc2lvbihjZXJ0SXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3ZpZXdEZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGl0KCdjYWxscyBlZGl0RGVjaXNpb24gd2l0aCByZWFkT25seSB0cnVlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtU2VydmljZSwgJ2VkaXREZWNpc2lvbicpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS52aWV3RGVjaXNpb24oY2VydEl0ZW0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuZWRpdERlY2lzaW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0SXRlbSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2VkaXREZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzcE5vdGlmaWNhdGlvblNlcnZpY2U7XG5cbiAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfc3BOb3RpZmljYXRpb25TZXJ2aWNlXykgPT4ge1xuICAgICAgICAgICAgICAgIHNwTm90aWZpY2F0aW9uU2VydmljZSA9IF9zcE5vdGlmaWNhdGlvblNlcnZpY2VfO1xuICAgICAgICAgICAgICAgIHNweU9uKHNwTm90aWZpY2F0aW9uU2VydmljZSwgJ2FkZE1lc3NhZ2UnKTtcbiAgICAgICAgICAgICAgICBzcHlPbihzcE5vdGlmaWNhdGlvblNlcnZpY2UsICd0cmlnZ2VyRGlyZWN0aXZlJyk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBpdGVtJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuZWRpdERlY2lzaW9uKCkpLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgndGhyb3dzIGlmIGl0ZW0gaGFzIG5vIGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldHVwKHVuZGVmaW5lZCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuZWRpdERlY2lzaW9uKGNlcnRJdGVtKSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdnZXRzIHRoZSBkaWFsb2cgZm9yIHRoZSBkZWNpc2lvbiBhbmQgY2FsbHMgdGhyb3VnaCB3aXRoIGV4aXN0aW5nIGRlY2lzaW9uIGFkbiByZWFkT25seSBmbGFnJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldHVwKGV4aXN0aW5nRGVjaXNpb24sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgc2hvd0RpYWxvZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmVkaXREZWNpc2lvbihjZXJ0SXRlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzaG93RnVuYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhpc3RpbmdEZWNpc2lvbiwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2FkZHMgbmV3IGRlY2lzaW9uIHRvIHN0b3JlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldHVwKGV4aXN0aW5nRGVjaXNpb24sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgc2hvd0RpYWxvZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGlhbG9nRGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlSXRlbURlY2lzaW9uKGNlcnRJdGVtLCBnZXRTdGF0dXMoJ01pdGlnYXRlZCcpLCAnaGVsbG8nKTtcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuZWRpdERlY2lzaW9uKGNlcnRJdGVtKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuZ2V0RWZmZWN0aXZlRGVjaXNpb24oY2VydEl0ZW0uaWQpKS50b0VxdWFsKGRpYWxvZ0RlY2lzaW9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgYWRkIG5ldyBkZWNpc2lvbiB0byBzdG9yZSBpZiBjYW5jZWxlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuYWRkRGVjaXNpb24oZXhpc3RpbmdEZWNpc2lvbik7XG4gICAgICAgICAgICAgICAgc2hvd0RpYWxvZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmVkaXREZWNpc2lvbihjZXJ0SXRlbSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldEVmZmVjdGl2ZURlY2lzaW9uKGNlcnRJdGVtLmlkKSkudG9FcXVhbChleGlzdGluZ0RlY2lzaW9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyBwcm9taXNlIHdpdGggbmV3IGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXNvbHZlZFZhbDtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNob3dEaWFsb2cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRpYWxvZ0RlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihjZXJ0SXRlbSwgZ2V0U3RhdHVzKCdNaXRpZ2F0ZWQnKSwgJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TZXJ2aWNlLmVkaXREZWNpc2lvbihjZXJ0SXRlbSkudGhlbigodmFsKSA9PiByZXNvbHZlZFZhbCA9IHZhbCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNvbHZlZFZhbCkudG9FcXVhbChkaWFsb2dEZWNpc2lvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JldHVybnMgcmVqZWN0ZWQgcHJvbWlzZSBpZiB0aGVyZSBpcyBubyBkaWFsb2cgJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWplY3RlZDtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZS5lZGl0RGVjaXNpb24oY2VydEl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlamVjdGVkID0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiByZWplY3RlZCA9IHRydWUpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVqZWN0ZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2FkZHMgbm90aWZpY2F0aW9uIG1lc3NhZ2Ugd2l0aCByZWFzb24gaWYgbm8gZGlhbG9nIGlzIGxhdW5jaGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWplY3RlZDtcbiAgICAgICAgICAgICAgICBzZXR1cChleGlzdGluZ0RlY2lzaW9uLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBzaG93RGlhbG9nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBub0RpYWxvZ1JlYXNvbiA9ICdOTyBESUFMT0chJztcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UuZWRpdERlY2lzaW9uKGNlcnRJdGVtKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZWplY3RlZCA9IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4gcmVqZWN0ZWQgPSB0cnVlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlamVjdGVkKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzcE5vdGlmaWNhdGlvblNlcnZpY2UuYWRkTWVzc2FnZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzcE5vdGlmaWNhdGlvblNlcnZpY2UuYWRkTWVzc2FnZS5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5tZXNzYWdlT3JLZXkpXG4gICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKG5vRGlhbG9nUmVhc29uKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3BOb3RpZmljYXRpb25TZXJ2aWNlLnRyaWdnZXJEaXJlY3RpdmUpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
