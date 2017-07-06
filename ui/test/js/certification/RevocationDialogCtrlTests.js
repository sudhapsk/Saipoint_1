System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}],
        execute: function () {

            describe('RevocationDialogCtrl', function () {
                var $controller = undefined,
                    $modalInstance = undefined,
                    adviceResult = undefined,
                    RevocationRecipientStepHandler = undefined,
                    RemediationAdviceResult = undefined,
                    RoleSoDRevocationStepHandler = undefined,
                    EntitlementSoDRevocationStepHandler = undefined,
                    item = undefined,
                    $scope = undefined,
                    certificationService = undefined,
                    $q = undefined,
                    certificationDataService = undefined,
                    certificationTestData = undefined,
                    RevocationModificationStepHandler = undefined,
                    RoleRevocationDetailsStepHandler = undefined,
                    PolicyTreeNode = undefined;

                beforeEach(module(certificationModule));

                /* jshint maxparams: 13 */
                beforeEach(inject(function (_$controller_, _certificationTestData_, _RemediationAdviceResult_, _RevocationRecipientStepHandler_, _RoleSoDRevocationStepHandler_, _EntitlementSoDRevocationStepHandler_, _$rootScope_, _certificationService_, _$q_, _certificationDataService_, _RevocationModificationStepHandler_, _RoleRevocationDetailsStepHandler_, _PolicyTreeNode_) {
                    $controller = _$controller_;
                    certificationTestData = _certificationTestData_;
                    RemediationAdviceResult = _RemediationAdviceResult_;
                    RevocationRecipientStepHandler = _RevocationRecipientStepHandler_;
                    RoleSoDRevocationStepHandler = _RoleSoDRevocationStepHandler_;
                    EntitlementSoDRevocationStepHandler = _EntitlementSoDRevocationStepHandler_;
                    RoleRevocationDetailsStepHandler = _RoleRevocationDetailsStepHandler_;
                    PolicyTreeNode = _PolicyTreeNode_;
                    adviceResult = new RemediationAdviceResult(certificationTestData.REMEDIATION_ADVICE_RESULT);
                    item = certificationTestData.CERT_ITEMS[0];
                    $modalInstance = {
                        setTitle: angular.noop
                    };
                    $scope = _$rootScope_;
                    certificationService = _certificationService_;
                    certificationDataService = _certificationDataService_;
                    $q = _$q_;
                    RevocationModificationStepHandler = _RevocationModificationStepHandler_;
                }));

                function makeController(advice, summary, existingDecision, readOnly) {
                    return $controller('RevocationDialogCtrl', {
                        advice: advice,
                        summary: summary,
                        item: item,
                        existingDecision: existingDecision,
                        readOnly: readOnly,
                        $modalInstance: $modalInstance,
                        certificationService: certificationService
                    });
                }

                describe('createStepHandlers()', function () {
                    it('returns RevocationRecipientStepHandler if only summary', function () {
                        var ctrl = undefined,
                            stepHandlers = undefined;

                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.summary, 'isModifiable').and.returnValue(false);
                        ctrl = makeController(adviceResult.advice, adviceResult.summary);
                        stepHandlers = ctrl.createStepHandlers();

                        expect(stepHandlers.length).toEqual(1);
                        expect(stepHandlers[0] instanceof RevocationRecipientStepHandler).toEqual(true);
                    });

                    it('initializes RevocationRecipientStepHandler with recipient and comments from existing decision', function () {
                        var existingDecision = {
                            comments: 'asdfasfas',
                            recipient: 'person',
                            recipientSummary: {
                                id: 'person'
                            }
                        },
                            ctrl = undefined,
                            stepHandlers = undefined;
                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.summary, 'isModifiable').and.returnValue(false);
                        ctrl = makeController(adviceResult.advice, adviceResult.summary, existingDecision);
                        stepHandlers = ctrl.createStepHandlers();
                        expect(stepHandlers[0].recipient).toEqual(existingDecision.recipientSummary);
                        expect(stepHandlers[0].comments).toEqual(existingDecision.comments);
                    });

                    it('returns RoleSoDRevocationStepHandler if required', function () {
                        var ctrl = undefined,
                            stepHandlers = undefined;

                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(true);
                        ctrl = makeController(adviceResult.advice, undefined);
                        stepHandlers = ctrl.createStepHandlers();

                        expect(stepHandlers.length).toEqual(1);
                        expect(stepHandlers[0] instanceof RoleSoDRevocationStepHandler).toEqual(true);
                    });

                    it('initialized RoleSODRevocationStepHandler with revokedRoles if existing decision', function () {
                        var existingDecision = {
                            revokedRoles: ['right1Name']
                        },
                            ctrl = undefined,
                            stepHandlers = undefined;

                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(true);
                        ctrl = makeController(adviceResult.advice, undefined, existingDecision);
                        stepHandlers = ctrl.createStepHandlers();
                        expect(stepHandlers[0].isSelected(adviceResult.advice.rightRoles[0])).toEqual(true);
                    });

                    function setupAdviceResult() {
                        var adviceResultData = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT);
                        adviceResultData.advice = angular.copy(adviceResultData.advice);
                        adviceResultData.advice.leftRoles = null;
                        adviceResultData.advice.rightRoles = null;
                        adviceResultData.advice.entitlementsToRemediate = certificationTestData.POLICY_TREE_NODE;
                        adviceResult = new RemediationAdviceResult(adviceResultData);
                        return adviceResult;
                    }

                    it('returns EntitlementSoDRevocationStepHandler if required', function () {
                        var adviceResult = setupAdviceResult(),
                            ctrl = makeController(adviceResult.advice, undefined),
                            stepHandlers = ctrl.createStepHandlers();

                        expect(stepHandlers.length).toEqual(1);
                        expect(stepHandlers[0] instanceof EntitlementSoDRevocationStepHandler).toEqual(true);
                    });

                    it('initializes EntitlementSoDRevocationStepHandler with selectedViolationEntitlements if existing decision', function () {
                        var adviceResult = setupAdviceResult(),
                            existingDecision = {
                            selectedViolationEntitlements: [new PolicyTreeNode(certificationTestData.POLICY_TREE_NODE.children[0])]
                        },
                            ctrl = makeController(adviceResult.advice, undefined, existingDecision),
                            stepHandlers = ctrl.createStepHandlers();
                        expect(stepHandlers[0].policyTree.children[0].selected).toEqual(true);
                        expect(stepHandlers[0].policyTree.children[1].selected).toEqual(false);
                    });

                    it('returns RevocationModificationStepHandler if required', function () {
                        var ctrl = undefined,
                            stepHandlers = undefined;

                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.advice, 'isEntitlementSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.summary, 'requiresRecipientSelection').and.returnValue(false);
                        spyOn(adviceResult.summary, 'isModifiable').and.returnValue(true);
                        ctrl = makeController(adviceResult.advice, adviceResult.summary);
                        stepHandlers = ctrl.createStepHandlers();

                        expect(stepHandlers.length).toEqual(1);
                        expect(stepHandlers[0] instanceof RevocationModificationStepHandler).toEqual(true);
                    });

                    it('initializes RevocationModificationStepHandler with existing remediation details if existin decision' + 'specified', function () {
                        var existingDecision = {
                            remediationDetails: angular.copy(adviceResult.summary.remediationDetails)
                        },
                            ctrl = undefined,
                            stepHandlers = undefined,
                            newValue = 'asdfasdfasdfasdfasdf';
                        existingDecision.remediationDetails[0].newValue = newValue;
                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.advice, 'isEntitlementSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.summary, 'requiresRecipientSelection').and.returnValue(false);
                        spyOn(adviceResult.summary, 'isModifiable').and.returnValue(true);
                        ctrl = makeController(adviceResult.advice, adviceResult.summary, existingDecision);
                        stepHandlers = ctrl.createStepHandlers();
                        expect(stepHandlers[0].lineItemGroups[0].items[0].newValue).toEqual(newValue);
                    });

                    it('returns RoleRevocationDetailsStepHandler if required', function () {
                        var ctrl = undefined,
                            stepHandlers = undefined;

                        spyOn(adviceResult.advice, 'isRoleSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.advice, 'isEntitlementSoDViolation').and.returnValue(false);
                        spyOn(adviceResult.summary, 'requiresRecipientSelection').and.returnValue(false);
                        spyOn(adviceResult.summary, 'isModifiable').and.returnValue(false);
                        spyOn(adviceResult.summary, 'hasRoleRevocationDetails').and.returnValue(true);
                        ctrl = makeController(adviceResult.advice, adviceResult.summary);
                        stepHandlers = ctrl.createStepHandlers();

                        expect(stepHandlers.length).toEqual(1);
                        expect(stepHandlers[0] instanceof RoleRevocationDetailsStepHandler).toEqual(true);
                    });
                });

                describe('refreshStepHandlers()', function () {
                    it('resolves to nothing if not on role sod step', function () {
                        var ctrl = makeController(adviceResult.advice, adviceResult.summary),
                            promiseResult = undefined;
                        spyOn(ctrl, 'isRoleSoDStep').and.returnValue(false);
                        ctrl.refreshStepHandlers().then(function (result) {
                            promiseResult = result;
                        });
                        $scope.$apply();
                        expect(promiseResult).not.toBeDefined();
                    });

                    describe('Role SoD step', function () {
                        var certId = 'cert1234',
                            stepResult = {
                            revokedRoles: ['role1']
                        },
                            requiresRecipientSelection = undefined,
                            isModifiable = undefined,
                            ctrl = undefined;

                        function getRefreshResult() {
                            var promiseResult = undefined;
                            ctrl.refreshStepHandlers().then(function (result) {
                                promiseResult = result;
                            });
                            $scope.$apply();
                            expect(certificationService.getRemediationSummary).toHaveBeenCalledWith(certId, item.id, stepResult.revokedRoles, undefined);
                            return promiseResult;
                        }

                        beforeEach(function () {
                            ctrl = makeController(adviceResult.advice, undefined);
                            spyOn(ctrl, 'isRoleSoDStep').and.returnValue(true);
                            spyOn(certificationService, 'getRemediationSummary').and.returnValue($q.when({
                                requiresRecipientSelection: function () {
                                    return !!requiresRecipientSelection;
                                },
                                isModifiable: function () {
                                    return !!isModifiable;
                                },
                                hasRoleRevocationDetails: function () {
                                    return false;
                                },
                                remediationDetails: [{}, {}]
                            }));
                            spyOn(certificationDataService, 'getCertification').and.returnValue({
                                id: certId
                            });
                            ctrl.stepResults[ctrl.getCurrentStep().getStepId()] = stepResult;
                            $scope.$apply();
                        });

                        it('calls through to getRemediationSummary and resolves with same steps if no ' + 'recipient selection or revocation is needed', function () {
                            var stepsLength = ctrl.steps.length,
                                promiseResult = undefined;

                            requiresRecipientSelection = false;
                            isModifiable = false;
                            promiseResult = getRefreshResult();
                            expect(promiseResult).toBeDefined();
                            expect(promiseResult.length).toEqual(stepsLength);
                        });

                        it('calls through to getRemediationSummary and resolves with additional steps if ' + 'recipient selection and/or revocation modification is needed', function () {
                            var stepsLength = ctrl.steps.length,
                                promiseResult = undefined;

                            requiresRecipientSelection = true;
                            isModifiable = true;
                            promiseResult = getRefreshResult();
                            expect(promiseResult).toBeDefined();
                            expect(promiseResult.length).toEqual(stepsLength + 2);
                            expect(promiseResult[promiseResult.length - 2] instanceof RevocationModificationStepHandler).toEqual(true);
                            expect(promiseResult[promiseResult.length - 1] instanceof RevocationRecipientStepHandler).toEqual(true);
                        });

                        it('does not set recipient from existing decision', function () {
                            ctrl.existingDecision = {
                                comments: 'asdfasfas',
                                recipient: 'person',
                                recipientSummary: {
                                    id: 'person'
                                }
                            };
                            requiresRecipientSelection = true;
                            isModifiable = false;
                            var promiseResult = getRefreshResult();
                            expect(promiseResult.length).toEqual(2);
                            expect(promiseResult[1].recipient).not.toBeDefined();
                        });
                    });
                });

                describe('formatStepResults()', function () {
                    it('merges stepResult properties into single result object', function () {
                        var stepResults = {
                            step1: {
                                prop1: 'a',
                                prop2: 'b'
                            },
                            step2: {
                                prop3: 'c'
                            }
                        },
                            ctrl = makeController(adviceResult.advice, adviceResult.summary),
                            formattedResults = undefined;
                        ctrl.stepResults = stepResults;
                        formattedResults = ctrl.formatStepResults();
                        expect(formattedResults).toBeDefined();
                        expect(formattedResults.prop1).toEqual(stepResults.step1.prop1);
                        expect(formattedResults.prop2).toEqual(stepResults.step1.prop2);
                        expect(formattedResults.prop3).toEqual(stepResults.step2.prop3);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vUmV2b2NhdGlvbkRpYWxvZ0N0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLGdEQUFnRCxVQUFVLFNBQVM7OztJQUdoSjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSwyQ0FBMkM7UUFDeEQsU0FBUyxZQUFZOztZQUo3QixTQUFTLHdCQUF3QixZQUFNO2dCQUNuQyxJQUFJLGNBQVc7b0JBQUUsaUJBQWM7b0JBQUUsZUFBWTtvQkFBRSxpQ0FBOEI7b0JBQUUsMEJBQXVCO29CQUNsRywrQkFBNEI7b0JBQUUsc0NBQW1DO29CQUFFLE9BQUk7b0JBQUUsU0FBTTtvQkFBRSx1QkFBb0I7b0JBQ3JHLEtBQUU7b0JBQUUsMkJBQXdCO29CQUFFLHdCQUFxQjtvQkFBRSxvQ0FBaUM7b0JBQ3RGLG1DQUFnQztvQkFBRSxpQkFBYzs7Z0JBRXBELFdBQVcsT0FBTzs7O2dCQUdsQixXQUFXLE9BQU8sVUFBQyxlQUFlLHlCQUF5QiwyQkFDeEMsa0NBQWtDLGdDQUNsQyx1Q0FBdUMsY0FBYyx3QkFBd0IsTUFDN0UsNEJBQTRCLHFDQUM1QixvQ0FBb0Msa0JBQXFCO29CQUN4RSxjQUFjO29CQUNkLHdCQUF3QjtvQkFDeEIsMEJBQTBCO29CQUMxQixpQ0FBaUM7b0JBQ2pDLCtCQUErQjtvQkFDL0Isc0NBQXNDO29CQUN0QyxtQ0FBbUM7b0JBQ25DLGlCQUFpQjtvQkFDakIsZUFBZSxJQUFJLHdCQUF3QixzQkFBc0I7b0JBQ2pFLE9BQU8sc0JBQXNCLFdBQVc7b0JBQ3hDLGlCQUFpQjt3QkFDYixVQUFVLFFBQVE7O29CQUV0QixTQUFTO29CQUNULHVCQUF1QjtvQkFDdkIsMkJBQTJCO29CQUMzQixLQUFLO29CQUNMLG9DQUFvQzs7O2dCQUd4QyxTQUFTLGVBQWUsUUFBUSxTQUFTLGtCQUFrQixVQUFVO29CQUNqRSxPQUFPLFlBQVksd0JBQXdCO3dCQUN2QyxRQUFRO3dCQUNSLFNBQVM7d0JBQ1QsTUFBTTt3QkFDTixrQkFBa0I7d0JBQ2xCLFVBQVU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixzQkFBc0I7Ozs7Z0JBSTlCLFNBQVMsd0JBQXdCLFlBQU07b0JBQ25DLEdBQUcsMERBQTBELFlBQU07d0JBQy9ELElBQUksT0FBSTs0QkFBRSxlQUFZOzt3QkFFdEIsTUFBTSxhQUFhLFFBQVEsc0JBQXNCLElBQUksWUFBWTt3QkFDakUsTUFBTSxhQUFhLFNBQVMsZ0JBQWdCLElBQUksWUFBWTt3QkFDNUQsT0FBTyxlQUFlLGFBQWEsUUFBUSxhQUFhO3dCQUN4RCxlQUFlLEtBQUs7O3dCQUVwQixPQUFPLGFBQWEsUUFBUSxRQUFRO3dCQUNwQyxPQUFPLGFBQWEsY0FBYyxnQ0FBZ0MsUUFBUTs7O29CQUc5RSxHQUFHLGlHQUFpRyxZQUFNO3dCQUN0RyxJQUFJLG1CQUFtQjs0QkFDZixVQUFVOzRCQUNWLFdBQVc7NEJBQ1gsa0JBQWtCO2dDQUNkLElBQUk7Ozs0QkFFVCxPQUFJOzRCQUFFLGVBQVk7d0JBQ3pCLE1BQU0sYUFBYSxRQUFRLHNCQUFzQixJQUFJLFlBQVk7d0JBQ2pFLE1BQU0sYUFBYSxTQUFTLGdCQUFnQixJQUFJLFlBQVk7d0JBQzVELE9BQU8sZUFBZSxhQUFhLFFBQVEsYUFBYSxTQUFTO3dCQUNqRSxlQUFlLEtBQUs7d0JBQ3BCLE9BQU8sYUFBYSxHQUFHLFdBQVcsUUFBUSxpQkFBaUI7d0JBQzNELE9BQU8sYUFBYSxHQUFHLFVBQVUsUUFBUSxpQkFBaUI7OztvQkFHOUQsR0FBRyxvREFBb0QsWUFBTTt3QkFDekQsSUFBSSxPQUFJOzRCQUFFLGVBQVk7O3dCQUV0QixNQUFNLGFBQWEsUUFBUSxzQkFBc0IsSUFBSSxZQUFZO3dCQUNqRSxPQUFPLGVBQWUsYUFBYSxRQUFRO3dCQUMzQyxlQUFlLEtBQUs7O3dCQUVwQixPQUFPLGFBQWEsUUFBUSxRQUFRO3dCQUNwQyxPQUFPLGFBQWEsY0FBYyw4QkFBOEIsUUFBUTs7O29CQUc1RSxHQUFHLG1GQUFtRixZQUFNO3dCQUN4RixJQUFJLG1CQUFtQjs0QkFDbkIsY0FBYyxDQUFDOzs0QkFDaEIsT0FBSTs0QkFBRSxlQUFZOzt3QkFFckIsTUFBTSxhQUFhLFFBQVEsc0JBQXNCLElBQUksWUFBWTt3QkFDakUsT0FBTyxlQUFlLGFBQWEsUUFBUSxXQUFXO3dCQUN0RCxlQUFlLEtBQUs7d0JBQ3BCLE9BQU8sYUFBYSxHQUFHLFdBQVcsYUFBYSxPQUFPLFdBQVcsS0FBSyxRQUFROzs7b0JBR2xGLFNBQVMsb0JBQW9CO3dCQUN6QixJQUFJLG1CQUFtQixRQUFRLEtBQUssc0JBQXNCO3dCQUMxRCxpQkFBaUIsU0FBUyxRQUFRLEtBQUssaUJBQWlCO3dCQUN4RCxpQkFBaUIsT0FBTyxZQUFZO3dCQUNwQyxpQkFBaUIsT0FBTyxhQUFhO3dCQUNyQyxpQkFBaUIsT0FBTywwQkFBMEIsc0JBQXNCO3dCQUN4RSxlQUFlLElBQUksd0JBQXdCO3dCQUMzQyxPQUFPOzs7b0JBR1gsR0FBRywyREFBMkQsWUFBTTt3QkFDaEUsSUFBSSxlQUFlOzRCQUNmLE9BQU8sZUFBZSxhQUFhLFFBQVE7NEJBQzNDLGVBQWUsS0FBSzs7d0JBRXhCLE9BQU8sYUFBYSxRQUFRLFFBQVE7d0JBQ3BDLE9BQU8sYUFBYSxjQUFjLHFDQUFxQyxRQUFROzs7b0JBR25GLEdBQUcsMkdBQ0MsWUFBTTt3QkFDRixJQUFJLGVBQWU7NEJBQ2YsbUJBQW1COzRCQUNmLCtCQUErQixDQUMzQixJQUFJLGVBQWUsc0JBQXNCLGlCQUFpQixTQUFTOzs0QkFHM0UsT0FBTyxlQUFlLGFBQWEsUUFBUSxXQUFXOzRCQUN0RCxlQUFlLEtBQUs7d0JBQ3hCLE9BQU8sYUFBYSxHQUFHLFdBQVcsU0FBUyxHQUFHLFVBQVUsUUFBUTt3QkFDaEUsT0FBTyxhQUFhLEdBQUcsV0FBVyxTQUFTLEdBQUcsVUFBVSxRQUFROzs7b0JBR3hFLEdBQUcseURBQXlELFlBQU07d0JBQzlELElBQUksT0FBSTs0QkFBRSxlQUFZOzt3QkFFdEIsTUFBTSxhQUFhLFFBQVEsc0JBQXNCLElBQUksWUFBWTt3QkFDakUsTUFBTSxhQUFhLFFBQVEsNkJBQTZCLElBQUksWUFBWTt3QkFDeEUsTUFBTSxhQUFhLFNBQVMsOEJBQThCLElBQUksWUFBWTt3QkFDMUUsTUFBTSxhQUFhLFNBQVMsZ0JBQWdCLElBQUksWUFBWTt3QkFDNUQsT0FBTyxlQUFlLGFBQWEsUUFBUSxhQUFhO3dCQUN4RCxlQUFlLEtBQUs7O3dCQUVwQixPQUFPLGFBQWEsUUFBUSxRQUFRO3dCQUNwQyxPQUFPLGFBQWEsY0FBYyxtQ0FBbUMsUUFBUTs7O29CQUdqRixHQUFHLHdHQUNDLGFBQWEsWUFBTTt3QkFDbkIsSUFBSSxtQkFBbUI7NEJBQ25CLG9CQUFvQixRQUFRLEtBQUssYUFBYSxRQUFROzs0QkFDdkQsT0FBSTs0QkFBRSxlQUFZOzRCQUFFLFdBQVc7d0JBQ2xDLGlCQUFpQixtQkFBbUIsR0FBRyxXQUFXO3dCQUNsRCxNQUFNLGFBQWEsUUFBUSxzQkFBc0IsSUFBSSxZQUFZO3dCQUNqRSxNQUFNLGFBQWEsUUFBUSw2QkFBNkIsSUFBSSxZQUFZO3dCQUN4RSxNQUFNLGFBQWEsU0FBUyw4QkFBOEIsSUFBSSxZQUFZO3dCQUMxRSxNQUFNLGFBQWEsU0FBUyxnQkFBZ0IsSUFBSSxZQUFZO3dCQUM1RCxPQUFPLGVBQWUsYUFBYSxRQUFRLGFBQWEsU0FBUzt3QkFDakUsZUFBZSxLQUFLO3dCQUNwQixPQUFPLGFBQWEsR0FBRyxlQUFlLEdBQUcsTUFBTSxHQUFHLFVBQVUsUUFBUTs7O29CQUd4RSxHQUFHLHdEQUF3RCxZQUFNO3dCQUM3RCxJQUFJLE9BQUk7NEJBQUUsZUFBWTs7d0JBRXRCLE1BQU0sYUFBYSxRQUFRLHNCQUFzQixJQUFJLFlBQVk7d0JBQ2pFLE1BQU0sYUFBYSxRQUFRLDZCQUE2QixJQUFJLFlBQVk7d0JBQ3hFLE1BQU0sYUFBYSxTQUFTLDhCQUE4QixJQUFJLFlBQVk7d0JBQzFFLE1BQU0sYUFBYSxTQUFTLGdCQUFnQixJQUFJLFlBQVk7d0JBQzVELE1BQU0sYUFBYSxTQUFTLDRCQUE0QixJQUFJLFlBQVk7d0JBQ3hFLE9BQU8sZUFBZSxhQUFhLFFBQVEsYUFBYTt3QkFDeEQsZUFBZSxLQUFLOzt3QkFFcEIsT0FBTyxhQUFhLFFBQVEsUUFBUTt3QkFDcEMsT0FBTyxhQUFhLGNBQWMsa0NBQWtDLFFBQVE7Ozs7Z0JBSXBGLFNBQVMseUJBQXlCLFlBQU07b0JBQ3BDLEdBQUcsK0NBQStDLFlBQU07d0JBQ3BELElBQUksT0FBTyxlQUFlLGFBQWEsUUFBUSxhQUFhOzRCQUN4RCxnQkFBYTt3QkFDakIsTUFBTSxNQUFNLGlCQUFpQixJQUFJLFlBQVk7d0JBQzdDLEtBQUssc0JBQXNCLEtBQUssVUFBQyxRQUFXOzRCQUN4QyxnQkFBZ0I7O3dCQUVwQixPQUFPO3dCQUNQLE9BQU8sZUFBZSxJQUFJOzs7b0JBRzlCLFNBQVMsaUJBQWlCLFlBQU07d0JBQzVCLElBQUksU0FBUzs0QkFDVCxhQUFhOzRCQUNULGNBQWMsQ0FBQzs7NEJBQ2hCLDZCQUEwQjs0QkFDN0IsZUFBWTs0QkFDWixPQUFJOzt3QkFFUixTQUFTLG1CQUFtQjs0QkFDeEIsSUFBSSxnQkFBYTs0QkFDakIsS0FBSyxzQkFBc0IsS0FBSyxVQUFDLFFBQVc7Z0NBQ3hDLGdCQUFnQjs7NEJBRXBCLE9BQU87NEJBQ1AsT0FBTyxxQkFBcUIsdUJBQ3ZCLHFCQUFxQixRQUFRLEtBQUssSUFBSSxXQUFXLGNBQWM7NEJBQ3BFLE9BQU87Ozt3QkFHWCxXQUFXLFlBQU07NEJBQ2IsT0FBTyxlQUFlLGFBQWEsUUFBUTs0QkFDM0MsTUFBTSxNQUFNLGlCQUFpQixJQUFJLFlBQVk7NEJBQzdDLE1BQU0sc0JBQXNCLHlCQUF5QixJQUFJLFlBQVksR0FBRyxLQUFLO2dDQUN6RSw0QkFBNEIsWUFBTTtvQ0FBRSxPQUFPLENBQUMsQ0FBQzs7Z0NBQzdDLGNBQWMsWUFBTTtvQ0FBRSxPQUFPLENBQUMsQ0FBQzs7Z0NBQy9CLDBCQUEwQixZQUFNO29DQUFFLE9BQU87O2dDQUN6QyxvQkFBb0IsQ0FBQyxJQUFHOzs0QkFFNUIsTUFBTSwwQkFBMEIsb0JBQW9CLElBQUksWUFBWTtnQ0FDaEUsSUFBSTs7NEJBRVIsS0FBSyxZQUFZLEtBQUssaUJBQWlCLGVBQWU7NEJBQ3RELE9BQU87Ozt3QkFHWCxHQUFHLCtFQUNDLCtDQUErQyxZQUFNOzRCQUNyRCxJQUFJLGNBQWMsS0FBSyxNQUFNO2dDQUN6QixnQkFBYTs7NEJBRWpCLDZCQUE2Qjs0QkFDN0IsZUFBZTs0QkFDZixnQkFBZ0I7NEJBQ2hCLE9BQU8sZUFBZTs0QkFDdEIsT0FBTyxjQUFjLFFBQVEsUUFBUTs7O3dCQUd6QyxHQUFHLGtGQUNDLGdFQUFnRSxZQUFNOzRCQUN0RSxJQUFJLGNBQWMsS0FBSyxNQUFNO2dDQUN6QixnQkFBYTs7NEJBRWpCLDZCQUE2Qjs0QkFDN0IsZUFBZTs0QkFDZixnQkFBZ0I7NEJBQ2hCLE9BQU8sZUFBZTs0QkFDdEIsT0FBTyxjQUFjLFFBQVEsUUFBUSxjQUFjOzRCQUNuRCxPQUFPLGNBQWMsY0FBYyxTQUFTLGNBQWMsbUNBQ3JELFFBQVE7NEJBQ2IsT0FBTyxjQUFjLGNBQWMsU0FBUyxjQUFjLGdDQUNyRCxRQUFROzs7d0JBR2pCLEdBQUcsaURBQWlELFlBQU07NEJBQ3RELEtBQUssbUJBQW1CO2dDQUNwQixVQUFVO2dDQUNWLFdBQVc7Z0NBQ1gsa0JBQWtCO29DQUNkLElBQUk7Ozs0QkFHWiw2QkFBNkI7NEJBQzdCLGVBQWU7NEJBQ2YsSUFBSSxnQkFBZ0I7NEJBQ3BCLE9BQU8sY0FBYyxRQUFRLFFBQVE7NEJBQ3JDLE9BQU8sY0FBYyxHQUFHLFdBQVcsSUFBSTs7Ozs7Z0JBS25ELFNBQVMsdUJBQXVCLFlBQU07b0JBQ2xDLEdBQUcsMERBQTBELFlBQU07d0JBQy9ELElBQUksY0FBYzs0QkFDVixPQUFPO2dDQUNILE9BQU87Z0NBQ1AsT0FBTzs7NEJBRVgsT0FBTztnQ0FDSCxPQUFPOzs7NEJBR2YsT0FBTyxlQUFlLGFBQWEsUUFBUSxhQUFhOzRCQUN4RCxtQkFBZ0I7d0JBQ3BCLEtBQUssY0FBYzt3QkFDbkIsbUJBQW1CLEtBQUs7d0JBQ3hCLE9BQU8sa0JBQWtCO3dCQUN6QixPQUFPLGlCQUFpQixPQUFPLFFBQVEsWUFBWSxNQUFNO3dCQUN6RCxPQUFPLGlCQUFpQixPQUFPLFFBQVEsWUFBWSxNQUFNO3dCQUN6RCxPQUFPLGlCQUFpQixPQUFPLFFBQVEsWUFBWSxNQUFNOzs7Ozs7R0E2QmxFIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vUmV2b2NhdGlvbkRpYWxvZ0N0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uVGVzdERhdGEnO1xuXG5kZXNjcmliZSgnUmV2b2NhdGlvbkRpYWxvZ0N0cmwnLCAoKSA9PiB7XG4gICAgbGV0ICRjb250cm9sbGVyLCAkbW9kYWxJbnN0YW5jZSwgYWR2aWNlUmVzdWx0LCBSZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXIsIFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0LFxuICAgICAgICBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyLCBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlciwgaXRlbSwgJHNjb3BlLCBjZXJ0aWZpY2F0aW9uU2VydmljZSxcbiAgICAgICAgJHEsIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgY2VydGlmaWNhdGlvblRlc3REYXRhLCBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIsXG4gICAgICAgIFJvbGVSZXZvY2F0aW9uRGV0YWlsc1N0ZXBIYW5kbGVyLCBQb2xpY3lUcmVlTm9kZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDEzICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF8kY29udHJvbGxlcl8sIF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfLCBfUmVtZWRpYXRpb25BZHZpY2VSZXN1bHRfLFxuICAgICAgICAgICAgICAgICAgICAgICBfUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyXywgX1JvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXJfLFxuICAgICAgICAgICAgICAgICAgICAgICBfRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXJfLCBfJHJvb3RTY29wZV8sIF9jZXJ0aWZpY2F0aW9uU2VydmljZV8sIF8kcV8sXG4gICAgICAgICAgICAgICAgICAgICAgIF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfLCBfUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyXyxcbiAgICAgICAgICAgICAgICAgICAgICAgX1JvbGVSZXZvY2F0aW9uRGV0YWlsc1N0ZXBIYW5kbGVyXywgX1BvbGljeVRyZWVOb2RlXykgPT4ge1xuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XG4gICAgICAgIGNlcnRpZmljYXRpb25UZXN0RGF0YSA9IF9jZXJ0aWZpY2F0aW9uVGVzdERhdGFfO1xuICAgICAgICBSZW1lZGlhdGlvbkFkdmljZVJlc3VsdCA9IF9SZW1lZGlhdGlvbkFkdmljZVJlc3VsdF87XG4gICAgICAgIFJldm9jYXRpb25SZWNpcGllbnRTdGVwSGFuZGxlciA9IF9SZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXJfO1xuICAgICAgICBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyID0gX1JvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXJfO1xuICAgICAgICBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlciA9IF9FbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlcl87XG4gICAgICAgIFJvbGVSZXZvY2F0aW9uRGV0YWlsc1N0ZXBIYW5kbGVyID0gX1JvbGVSZXZvY2F0aW9uRGV0YWlsc1N0ZXBIYW5kbGVyXztcbiAgICAgICAgUG9saWN5VHJlZU5vZGUgPSBfUG9saWN5VHJlZU5vZGVfO1xuICAgICAgICBhZHZpY2VSZXN1bHQgPSBuZXcgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQoY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQpO1xuICAgICAgICBpdGVtID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF07XG4gICAgICAgICRtb2RhbEluc3RhbmNlID0ge1xuICAgICAgICAgICAgc2V0VGl0bGU6IGFuZ3VsYXIubm9vcFxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV87XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyID0gX1Jldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcl87XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gbWFrZUNvbnRyb2xsZXIoYWR2aWNlLCBzdW1tYXJ5LCBleGlzdGluZ0RlY2lzaW9uLCByZWFkT25seSkge1xuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ1Jldm9jYXRpb25EaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgYWR2aWNlOiBhZHZpY2UsXG4gICAgICAgICAgICBzdW1tYXJ5OiBzdW1tYXJ5LFxuICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgIGV4aXN0aW5nRGVjaXNpb246IGV4aXN0aW5nRGVjaXNpb24sXG4gICAgICAgICAgICByZWFkT25seTogcmVhZE9ubHksXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZTogJG1vZGFsSW5zdGFuY2UsXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZTogY2VydGlmaWNhdGlvblNlcnZpY2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVzY3JpYmUoJ2NyZWF0ZVN0ZXBIYW5kbGVycygpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBSZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXIgaWYgb25seSBzdW1tYXJ5JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGN0cmwsIHN0ZXBIYW5kbGVycztcblxuICAgICAgICAgICAgc3B5T24oYWR2aWNlUmVzdWx0LmFkdmljZSwgJ2lzUm9sZVNvRFZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuc3VtbWFyeSwgJ2lzTW9kaWZpYWJsZScpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBjdHJsID0gbWFrZUNvbnRyb2xsZXIoYWR2aWNlUmVzdWx0LmFkdmljZSwgYWR2aWNlUmVzdWx0LnN1bW1hcnkpO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXJzID0gY3RybC5jcmVhdGVTdGVwSGFuZGxlcnMoKTtcblxuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVycy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXJzWzBdIGluc3RhbmNlb2YgUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaW5pdGlhbGl6ZXMgUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyIHdpdGggcmVjaXBpZW50IGFuZCBjb21tZW50cyBmcm9tIGV4aXN0aW5nIGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nRGVjaXNpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzOiAnYXNkZmFzZmFzJyxcbiAgICAgICAgICAgICAgICAgICAgcmVjaXBpZW50OiAncGVyc29uJyxcbiAgICAgICAgICAgICAgICAgICAgcmVjaXBpZW50U3VtbWFyeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdwZXJzb24nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBjdHJsLCBzdGVwSGFuZGxlcnM7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuYWR2aWNlLCAnaXNSb2xlU29EVmlvbGF0aW9uJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaXNNb2RpZmlhYmxlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIGN0cmwgPSBtYWtlQ29udHJvbGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCBhZHZpY2VSZXN1bHQuc3VtbWFyeSwgZXhpc3RpbmdEZWNpc2lvbik7XG4gICAgICAgICAgICBzdGVwSGFuZGxlcnMgPSBjdHJsLmNyZWF0ZVN0ZXBIYW5kbGVycygpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyc1swXS5yZWNpcGllbnQpLnRvRXF1YWwoZXhpc3RpbmdEZWNpc2lvbi5yZWNpcGllbnRTdW1tYXJ5KTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnNbMF0uY29tbWVudHMpLnRvRXF1YWwoZXhpc3RpbmdEZWNpc2lvbi5jb21tZW50cyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIgaWYgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY3RybCwgc3RlcEhhbmRsZXJzO1xuXG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuYWR2aWNlLCAnaXNSb2xlU29EVmlvbGF0aW9uJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgY3RybCA9IG1ha2VDb250cm9sbGVyKGFkdmljZVJlc3VsdC5hZHZpY2UsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBzdGVwSGFuZGxlcnMgPSBjdHJsLmNyZWF0ZVN0ZXBIYW5kbGVycygpO1xuXG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXJzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnNbMF0gaW5zdGFuY2VvZiBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaW5pdGlhbGl6ZWQgUm9sZVNPRFJldm9jYXRpb25TdGVwSGFuZGxlciB3aXRoIHJldm9rZWRSb2xlcyBpZiBleGlzdGluZyBkZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBleGlzdGluZ0RlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIHJldm9rZWRSb2xlczogWydyaWdodDFOYW1lJ11cbiAgICAgICAgICAgIH0sIGN0cmwsIHN0ZXBIYW5kbGVycztcblxuICAgICAgICAgICAgc3B5T24oYWR2aWNlUmVzdWx0LmFkdmljZSwgJ2lzUm9sZVNvRFZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGN0cmwgPSBtYWtlQ29udHJvbGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCB1bmRlZmluZWQsIGV4aXN0aW5nRGVjaXNpb24pO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXJzID0gY3RybC5jcmVhdGVTdGVwSGFuZGxlcnMoKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnNbMF0uaXNTZWxlY3RlZChhZHZpY2VSZXN1bHQuYWR2aWNlLnJpZ2h0Um9sZXNbMF0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBzZXR1cEFkdmljZVJlc3VsdCgpIHtcbiAgICAgICAgICAgIGxldCBhZHZpY2VSZXN1bHREYXRhID0gYW5ndWxhci5jb3B5KGNlcnRpZmljYXRpb25UZXN0RGF0YS5SRU1FRElBVElPTl9BRFZJQ0VfUkVTVUxUKTtcbiAgICAgICAgICAgIGFkdmljZVJlc3VsdERhdGEuYWR2aWNlID0gYW5ndWxhci5jb3B5KGFkdmljZVJlc3VsdERhdGEuYWR2aWNlKTtcbiAgICAgICAgICAgIGFkdmljZVJlc3VsdERhdGEuYWR2aWNlLmxlZnRSb2xlcyA9IG51bGw7XG4gICAgICAgICAgICBhZHZpY2VSZXN1bHREYXRhLmFkdmljZS5yaWdodFJvbGVzID0gbnVsbDtcbiAgICAgICAgICAgIGFkdmljZVJlc3VsdERhdGEuYWR2aWNlLmVudGl0bGVtZW50c1RvUmVtZWRpYXRlID0gY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREU7XG4gICAgICAgICAgICBhZHZpY2VSZXN1bHQgPSBuZXcgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQoYWR2aWNlUmVzdWx0RGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gYWR2aWNlUmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgaXQoJ3JldHVybnMgRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIgaWYgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgYWR2aWNlUmVzdWx0ID0gc2V0dXBBZHZpY2VSZXN1bHQoKSxcbiAgICAgICAgICAgICAgICBjdHJsID0gbWFrZUNvbnRyb2xsZXIoYWR2aWNlUmVzdWx0LmFkdmljZSwgdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICBzdGVwSGFuZGxlcnMgPSBjdHJsLmNyZWF0ZVN0ZXBIYW5kbGVycygpO1xuXG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXJzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnNbMF0gaW5zdGFuY2VvZiBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlcikudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2luaXRpYWxpemVzIEVudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyIHdpdGggc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMgaWYgZXhpc3RpbmcgZGVjaXNpb24nLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBhZHZpY2VSZXN1bHQgPSBzZXR1cEFkdmljZVJlc3VsdCgpLFxuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ0RlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUG9saWN5VHJlZU5vZGUoY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREUuY2hpbGRyZW5bMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGN0cmwgPSBtYWtlQ29udHJvbGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCB1bmRlZmluZWQsIGV4aXN0aW5nRGVjaXNpb24pLFxuICAgICAgICAgICAgICAgICAgICBzdGVwSGFuZGxlcnMgPSBjdHJsLmNyZWF0ZVN0ZXBIYW5kbGVycygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnNbMF0ucG9saWN5VHJlZS5jaGlsZHJlblswXS5zZWxlY3RlZCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXJzWzBdLnBvbGljeVRyZWUuY2hpbGRyZW5bMV0uc2VsZWN0ZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyIGlmIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGN0cmwsIHN0ZXBIYW5kbGVycztcblxuICAgICAgICAgICAgc3B5T24oYWR2aWNlUmVzdWx0LmFkdmljZSwgJ2lzUm9sZVNvRFZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuYWR2aWNlLCAnaXNFbnRpdGxlbWVudFNvRFZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuc3VtbWFyeSwgJ3JlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaXNNb2RpZmlhYmxlJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgY3RybCA9IG1ha2VDb250cm9sbGVyKGFkdmljZVJlc3VsdC5hZHZpY2UsIGFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVycyA9IGN0cmwuY3JlYXRlU3RlcEhhbmRsZXJzKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyc1swXSBpbnN0YW5jZW9mIFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcikudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2luaXRpYWxpemVzIFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlciB3aXRoIGV4aXN0aW5nIHJlbWVkaWF0aW9uIGRldGFpbHMgaWYgZXhpc3RpbiBkZWNpc2lvbicgK1xuICAgICAgICAgICAgJ3NwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBleGlzdGluZ0RlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgIHJlbWVkaWF0aW9uRGV0YWlsczogYW5ndWxhci5jb3B5KGFkdmljZVJlc3VsdC5zdW1tYXJ5LnJlbWVkaWF0aW9uRGV0YWlscylcbiAgICAgICAgICAgIH0sIGN0cmwsIHN0ZXBIYW5kbGVycywgbmV3VmFsdWUgPSAnYXNkZmFzZGZhc2RmYXNkZmFzZGYnO1xuICAgICAgICAgICAgZXhpc3RpbmdEZWNpc2lvbi5yZW1lZGlhdGlvbkRldGFpbHNbMF0ubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIHNweU9uKGFkdmljZVJlc3VsdC5hZHZpY2UsICdpc1JvbGVTb0RWaW9sYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgc3B5T24oYWR2aWNlUmVzdWx0LmFkdmljZSwgJ2lzRW50aXRsZW1lbnRTb0RWaW9sYXRpb24nKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgc3B5T24oYWR2aWNlUmVzdWx0LnN1bW1hcnksICdyZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuc3VtbWFyeSwgJ2lzTW9kaWZpYWJsZScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGN0cmwgPSBtYWtlQ29udHJvbGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCBhZHZpY2VSZXN1bHQuc3VtbWFyeSwgZXhpc3RpbmdEZWNpc2lvbik7XG4gICAgICAgICAgICBzdGVwSGFuZGxlcnMgPSBjdHJsLmNyZWF0ZVN0ZXBIYW5kbGVycygpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyc1swXS5saW5lSXRlbUdyb3Vwc1swXS5pdGVtc1swXS5uZXdWYWx1ZSkudG9FcXVhbChuZXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIFJvbGVSZXZvY2F0aW9uRGV0YWlsc1N0ZXBIYW5kbGVyIGlmIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGN0cmwsIHN0ZXBIYW5kbGVycztcblxuICAgICAgICAgICAgc3B5T24oYWR2aWNlUmVzdWx0LmFkdmljZSwgJ2lzUm9sZVNvRFZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuYWR2aWNlLCAnaXNFbnRpdGxlbWVudFNvRFZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihhZHZpY2VSZXN1bHQuc3VtbWFyeSwgJ3JlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaXNNb2RpZmlhYmxlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGFkdmljZVJlc3VsdC5zdW1tYXJ5LCAnaGFzUm9sZVJldm9jYXRpb25EZXRhaWxzJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgY3RybCA9IG1ha2VDb250cm9sbGVyKGFkdmljZVJlc3VsdC5hZHZpY2UsIGFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVycyA9IGN0cmwuY3JlYXRlU3RlcEhhbmRsZXJzKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlcnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyc1swXSBpbnN0YW5jZW9mIFJvbGVSZXZvY2F0aW9uRGV0YWlsc1N0ZXBIYW5kbGVyKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdyZWZyZXNoU3RlcEhhbmRsZXJzKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXNvbHZlcyB0byBub3RoaW5nIGlmIG5vdCBvbiByb2xlIHNvZCBzdGVwJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBtYWtlQ29udHJvbGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCBhZHZpY2VSZXN1bHQuc3VtbWFyeSksXG4gICAgICAgICAgICAgICAgcHJvbWlzZVJlc3VsdDtcbiAgICAgICAgICAgIHNweU9uKGN0cmwsICdpc1JvbGVTb0RTdGVwJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIGN0cmwucmVmcmVzaFN0ZXBIYW5kbGVycygpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21pc2VSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChwcm9taXNlUmVzdWx0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ1JvbGUgU29EIHN0ZXAnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2VydElkID0gJ2NlcnQxMjM0JyxcbiAgICAgICAgICAgICAgICBzdGVwUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICByZXZva2VkUm9sZXM6IFsncm9sZTEnXVxuICAgICAgICAgICAgICAgIH0sIHJlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGlzTW9kaWZpYWJsZSxcbiAgICAgICAgICAgICAgICBjdHJsO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRSZWZyZXNoUmVzdWx0KCkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlUmVzdWx0O1xuICAgICAgICAgICAgICAgIGN0cmwucmVmcmVzaFN0ZXBIYW5kbGVycygpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmVtZWRpYXRpb25TdW1tYXJ5KVxuICAgICAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydElkLCBpdGVtLmlkLCBzdGVwUmVzdWx0LnJldm9rZWRSb2xlcywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZVJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3RybCA9IG1ha2VDb250cm9sbGVyKGFkdmljZVJlc3VsdC5hZHZpY2UsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgc3B5T24oY3RybCwgJ2lzUm9sZVNvRFN0ZXAnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdnZXRSZW1lZGlhdGlvblN1bW1hcnknKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uOiAoKSA9PiB7IHJldHVybiAhIXJlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uOyB9LFxuICAgICAgICAgICAgICAgICAgICBpc01vZGlmaWFibGU6ICgpID0+IHsgcmV0dXJuICEhaXNNb2RpZmlhYmxlOyB9LFxuICAgICAgICAgICAgICAgICAgICBoYXNSb2xlUmV2b2NhdGlvbkRldGFpbHM6ICgpID0+IHsgcmV0dXJuIGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkRldGFpbHM6IFt7fSx7fV1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q2VydGlmaWNhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBjZXJ0SWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjdHJsLnN0ZXBSZXN1bHRzW2N0cmwuZ2V0Q3VycmVudFN0ZXAoKS5nZXRTdGVwSWQoKV0gPSBzdGVwUmVzdWx0O1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnY2FsbHMgdGhyb3VnaCB0byBnZXRSZW1lZGlhdGlvblN1bW1hcnkgYW5kIHJlc29sdmVzIHdpdGggc2FtZSBzdGVwcyBpZiBubyAnICtcbiAgICAgICAgICAgICAgICAncmVjaXBpZW50IHNlbGVjdGlvbiBvciByZXZvY2F0aW9uIGlzIG5lZWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3RlcHNMZW5ndGggPSBjdHJsLnN0ZXBzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVJlc3VsdDtcblxuICAgICAgICAgICAgICAgIHJlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaXNNb2RpZmlhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcHJvbWlzZVJlc3VsdCA9IGdldFJlZnJlc2hSZXN1bHQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocHJvbWlzZVJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocHJvbWlzZVJlc3VsdC5sZW5ndGgpLnRvRXF1YWwoc3RlcHNMZW5ndGgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIGdldFJlbWVkaWF0aW9uU3VtbWFyeSBhbmQgcmVzb2x2ZXMgd2l0aCBhZGRpdGlvbmFsIHN0ZXBzIGlmICcgK1xuICAgICAgICAgICAgICAgICdyZWNpcGllbnQgc2VsZWN0aW9uIGFuZC9vciByZXZvY2F0aW9uIG1vZGlmaWNhdGlvbiBpcyBuZWVkZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ZXBzTGVuZ3RoID0gY3RybC5zdGVwcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VSZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICByZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXNNb2RpZmlhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwcm9taXNlUmVzdWx0ID0gZ2V0UmVmcmVzaFJlc3VsdCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlUmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlUmVzdWx0Lmxlbmd0aCkudG9FcXVhbChzdGVwc0xlbmd0aCArIDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlUmVzdWx0W3Byb21pc2VSZXN1bHQubGVuZ3RoIC0gMl0gaW5zdGFuY2VvZiBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIpXG4gICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlUmVzdWx0W3Byb21pc2VSZXN1bHQubGVuZ3RoIC0gMV0gaW5zdGFuY2VvZiBSZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXIpXG4gICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdCBzZXQgcmVjaXBpZW50IGZyb20gZXhpc3RpbmcgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3RybC5leGlzdGluZ0RlY2lzaW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBjb21tZW50czogJ2FzZGZhc2ZhcycsXG4gICAgICAgICAgICAgICAgICAgIHJlY2lwaWVudDogJ3BlcnNvbicsXG4gICAgICAgICAgICAgICAgICAgIHJlY2lwaWVudFN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAncGVyc29uJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgaXNNb2RpZmlhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2VSZXN1bHQgPSBnZXRSZWZyZXNoUmVzdWx0KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHByb21pc2VSZXN1bHQubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9taXNlUmVzdWx0WzFdLnJlY2lwaWVudCkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9ybWF0U3RlcFJlc3VsdHMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ21lcmdlcyBzdGVwUmVzdWx0IHByb3BlcnRpZXMgaW50byBzaW5nbGUgcmVzdWx0IG9iamVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwUmVzdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcDE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AxOiAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wMjogJ2InXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN0ZXAyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wMzogJ2MnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGN0cmwgPSBtYWtlQ29udHJvbGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCBhZHZpY2VSZXN1bHQuc3VtbWFyeSksXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkUmVzdWx0cztcbiAgICAgICAgICAgIGN0cmwuc3RlcFJlc3VsdHMgPSBzdGVwUmVzdWx0cztcbiAgICAgICAgICAgIGZvcm1hdHRlZFJlc3VsdHMgPSBjdHJsLmZvcm1hdFN0ZXBSZXN1bHRzKCk7XG4gICAgICAgICAgICBleHBlY3QoZm9ybWF0dGVkUmVzdWx0cykudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChmb3JtYXR0ZWRSZXN1bHRzLnByb3AxKS50b0VxdWFsKHN0ZXBSZXN1bHRzLnN0ZXAxLnByb3AxKTtcbiAgICAgICAgICAgIGV4cGVjdChmb3JtYXR0ZWRSZXN1bHRzLnByb3AyKS50b0VxdWFsKHN0ZXBSZXN1bHRzLnN0ZXAxLnByb3AyKTtcbiAgICAgICAgICAgIGV4cGVjdChmb3JtYXR0ZWRSZXN1bHRzLnByb3AzKS50b0VxdWFsKHN0ZXBSZXN1bHRzLnN0ZXAyLnByb3AzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
