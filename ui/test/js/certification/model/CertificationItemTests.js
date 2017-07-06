System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('CertificationItem', function () {

                beforeEach(module(certificationModule));

                var CertificationItem, CertificationDecisionStatus, certificationTestData;

                beforeEach(inject(function (_CertificationItem_, _CertificationDecisionStatus_, _certificationTestData_) {
                    CertificationItem = _CertificationItem_;
                    CertificationDecisionStatus = _CertificationDecisionStatus_;
                    certificationTestData = _certificationTestData_;
                }));

                function createItem(idx, overrides) {
                    var data = angular.copy(certificationTestData.CERT_ITEMS[idx]);
                    if (overrides) {
                        angular.extend(data, overrides);
                    }
                    return new CertificationItem(data);
                }

                describe('init', function () {
                    it('should initialize with provided data', function () {
                        var data = certificationTestData.CERT_ITEMS[1],
                            test = new CertificationItem(data);

                        expect(test.id).toEqual(data.id);
                        expect(test.type).toEqual(data.type);
                        expect(test.subType).toEqual(data.subType);
                        expect(test.typeMessageKey).toEqual(data.typeMessageKey);
                        expect(test.displayName).toEqual(data.displayName);
                        expect(test.description).toEqual(data.description);
                        expect(test.decisionStatus).toEqual(new CertificationDecisionStatus(data.decisionStatus));
                        expect(test.entityId).toEqual(data.entityId);
                        expect(test.policyName).toEqual(data.policyName);
                        expect(test.policyViolationRule).toEqual(data.policyViolationRule);
                        expect(test.policyViolationOwner).toEqual(data.policyViolationOwner);
                        expect(test.policyDescription).toEqual(data.policyDescription);
                        expect(test.policyRuleDescription).toEqual(data.policyRuleDescription);
                        expect(test.policyViolationConflict).toEqual(data.policyViolationConflict);
                        expect(test.policyViolationSummary).toEqual(data.policyViolationSummary);
                        expect(test.policyViolationApplication).toEqual(data.policyViolationApplication);
                        expect(test.policyViolationAccountName).toEqual(data.policyViolationAccountName);
                        expect(test.policyViolationCompensatingControl).toEqual(data.policyViolationCompensatingControl);
                        expect(test.policyViolationRemediationAdvice).toEqual(data.policyViolationRemediationAdvice);
                        expect(test.scoreWeight).toEqual(data.scoreWeight);
                        expect(test.summaryStatus).toEqual(data.summaryStatus);
                        expect(test.attributes).toEqual(data.attributes);
                        expect(test.challengeHistory.owner).toEqual(data.challengeOwnerName);
                        expect(test.challengeHistory.challengeComment).toEqual(data.challengeComment);
                        expect(test.challengeHistory.decision).toEqual(data.challengeDecision);
                        expect(test.challengeHistory.decisionComment).toEqual(data.challengeDecisionComment);
                        expect(test.challengeHistory.deciderName).toEqual(data.challengeDeciderName);
                        expect(test.delegation.completionComments).toEqual(data.delegationCompletionComments);
                        expect(test.delegation.completionUser).toEqual(data.delegationCompletionUser);
                        expect(test.policyViolations).toEqual(data.policyViolations);
                        expect(test.accountStatusIcons).toEqual(data.accountStatusIcons);
                        expect(test.groupAttribute).toEqual(false);
                    });

                    it('should initialize account info', function () {
                        var data = certificationTestData.CERT_ITEMS[0],
                            test = new CertificationItem(data);
                        expect(test.application).toEqual(data.application);
                        expect(test.nativeIdentity).toEqual(data.nativeIdentity);
                        expect(test.instance).toEqual(data.instance);
                        expect(test.groupAttribute).toEqual(data.groupAttribute);
                    });

                    it('should initialize role application and account info', function () {
                        var data = certificationTestData.CERT_ITEMS[1],
                            test = new CertificationItem(data);
                        expect(test.roleApplications).toEqual(data.roleApplications);
                        expect(test.roleAccountNames).toEqual(data.roleAccountNames);
                    });

                    it('should throw with no config data', function () {
                        expect(function () {
                            new CertificationItem();
                        }).toThrow();
                    });
                });

                describe('isPolicyViolation()', function () {
                    it('returns true for a policy violation', function () {
                        var item = createItem(0, { type: CertificationItem.Type.PolicyViolation });
                        expect(item.isPolicyViolation()).toEqual(true);
                    });

                    it('returns false for a non-policy violation', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Exception });
                        expect(item.isPolicyViolation()).toEqual(false);
                    });

                    it('returns false when type is null', function () {
                        var item = createItem(0, { type: null });
                        expect(item.isPolicyViolation()).toEqual(false);
                    });
                });

                describe('isRole()', function () {
                    it('returns true for a role', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Bundle });
                        expect(item.isRole()).toEqual(true);
                    });

                    it('returns false for a non-role', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Exception });
                        expect(item.isRole()).toEqual(false);
                    });

                    it('returns false when type is null', function () {
                        var item = createItem(0, { type: null });
                        expect(item.isRole()).toEqual(false);
                    });
                });

                describe('isException()', function () {
                    it('returns true for a exception', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Exception });
                        expect(item.isException()).toEqual(true);
                    });

                    it('returns false for a non-exception', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Bundle });
                        expect(item.isException()).toEqual(false);
                    });

                    it('returns false when type is null', function () {
                        var item = createItem(0, { type: null });
                        expect(item.isException()).toEqual(false);
                    });
                });

                describe('isAccount()', function () {
                    it('returns true for account type', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Account });
                        expect(item.isAccount()).toEqual(true);
                    });

                    it('returns false for a non-account type', function () {
                        var item = createItem(0, { type: CertificationItem.Type.Bundle });
                        expect(item.isAccount()).toEqual(false);
                    });

                    it('returns false when type is null', function () {
                        var item = createItem(0, { type: null });
                        expect(item.isAccount()).toEqual(false);
                    });
                });

                describe('isAssignedRole()', function () {
                    it('returns true for an assigned role', function () {
                        var item = createItem(0, { subType: CertificationItem.SubType.AssignedRole });
                        expect(item.isAssignedRole()).toEqual(true);
                    });

                    it('returns false for a non-assigned role', function () {
                        var item = createItem(0, { type: CertificationItem.Entitlement });
                        expect(item.isAssignedRole()).toEqual(false);
                    });

                    it('returns false when sub type is null', function () {
                        var item = createItem(0, { subType: null });
                        expect(item.isAssignedRole()).toEqual(false);
                    });
                });

                describe('getComments()', function () {
                    it('returns blank string when no comment is found', function () {
                        var item = createItem(0);
                        expect(item.getComments()).toBe(' ');
                    });

                    it('returns completion comment', function () {
                        var comments = { attributes: { comments: { challengeCompletionComments: 'fuzzy wuzzy' } } },
                            item = createItem(0, comments);
                        expect(item.getComments()).toBe(comments.attributes.comments.challengeCompletionComments);
                    });

                    it('returns delegation comment', function () {
                        var comments = { attributes: { comments: { delegationComments: 'fuzzy wuzzy was hungry' } } },
                            item = createItem(0, comments);
                        expect(item.getComments()).toBe(comments.attributes.comments.delegationComments);
                    });
                });

                describe('matchesAccount()', function () {
                    function testMatchesAccount(item1, item2, isMatch) {
                        var certItem1 = new CertificationItem(item1),
                            certItem2 = new CertificationItem(item2);
                        expect(certItem1.matchesAccount(certItem2)).toEqual(isMatch);
                    }
                    it('returns false if applications do not match', function () {
                        testMatchesAccount({
                            application: 'App1',
                            nativeIdentity: 'Account1',
                            instance: 'Instance1'
                        }, {
                            application: 'DifferentApp',
                            nativeIdentity: 'Account1',
                            instance: 'Instance1'
                        }, false);
                    });

                    it('returns false if nativeIdentity does not match', function () {
                        testMatchesAccount({
                            application: 'App1',
                            nativeIdentity: 'Account1',
                            instance: 'Instance1'
                        }, {
                            application: 'App1',
                            nativeIdentity: 'NewAccount',
                            instance: 'Instance1'
                        }, false);
                    });

                    it('returns false if instance does not match', function () {
                        testMatchesAccount({
                            application: 'App1',
                            nativeIdentity: 'Account1',
                            instance: 'Instance1'
                        }, {
                            application: 'App1',
                            nativeIdentity: 'Account1',
                            instance: 'SomeOtherInstance'
                        }, false);
                    });

                    it('returns true if all three account properties match', function () {
                        testMatchesAccount({
                            application: 'App1',
                            nativeIdentity: 'Account1',
                            instance: 'Instance1'
                        }, {
                            application: 'App1',
                            nativeIdentity: 'Account1',
                            instance: 'Instance1'
                        }, true);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvbkl0ZW1UZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLDZCQUE2QixVQUFVLFNBQVM7OztJQUc3SDs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0I7UUFDckMsU0FBUyxZQUFZOztZQUo3QixTQUFTLHFCQUFxQixZQUFXOztnQkFFckMsV0FBVyxPQUFPOztnQkFFbEIsSUFBSSxtQkFBbUIsNkJBQTZCOztnQkFFcEQsV0FBVyxPQUFPLFVBQVMscUJBQXFCLCtCQUErQix5QkFBeUI7b0JBQ3BHLG9CQUFvQjtvQkFDcEIsOEJBQThCO29CQUM5Qix3QkFBd0I7OztnQkFHNUIsU0FBUyxXQUFXLEtBQUssV0FBVztvQkFDaEMsSUFBSSxPQUFPLFFBQVEsS0FBSyxzQkFBc0IsV0FBVztvQkFDekQsSUFBSSxXQUFXO3dCQUNYLFFBQVEsT0FBTyxNQUFNOztvQkFFekIsT0FBTyxJQUFJLGtCQUFrQjs7O2dCQUdqQyxTQUFTLFFBQVEsWUFBVztvQkFDeEIsR0FBRyx3Q0FBd0MsWUFBVzt3QkFDbEQsSUFBSSxPQUFPLHNCQUFzQixXQUFXOzRCQUN4QyxPQUFPLElBQUksa0JBQWtCOzt3QkFFakMsT0FBTyxLQUFLLElBQUksUUFBUSxLQUFLO3dCQUM3QixPQUFPLEtBQUssTUFBTSxRQUFRLEtBQUs7d0JBQy9CLE9BQU8sS0FBSyxTQUFTLFFBQVEsS0FBSzt3QkFDbEMsT0FBTyxLQUFLLGdCQUFnQixRQUFRLEtBQUs7d0JBQ3pDLE9BQU8sS0FBSyxhQUFhLFFBQVEsS0FBSzt3QkFDdEMsT0FBTyxLQUFLLGFBQWEsUUFBUSxLQUFLO3dCQUN0QyxPQUFPLEtBQUssZ0JBQWdCLFFBQVEsSUFBSSw0QkFBNEIsS0FB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OzRCQUNoQixVQUFVOzJCQUNYOzRCQUNDLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixVQUFVOzJCQUNYOzs7b0JBR1AsR0FBRyw0Q0FBNEMsWUFBTTt3QkFDakQsbUJBQW1COzRCQUNmLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixVQUFVOzJCQUNYOzRCQUNDLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixVQUFVOzJCQUNYOzs7b0JBR1AsR0FBRyxzREFBc0QsWUFBTTt3QkFDM0QsbUJBQW1COzRCQUNmLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixVQUFVOzJCQUNYOzRCQUNDLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixVQUFVOzJCQUNYOzs7Ozs7R0FTWiIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL21vZGVsL0NlcnRpZmljYXRpb25JdGVtVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICcuLi9DZXJ0aWZpY2F0aW9uVGVzdERhdGEnO1xuXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbkl0ZW0nLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIHZhciBDZXJ0aWZpY2F0aW9uSXRlbSwgQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RhdHVzLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGE7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfQ2VydGlmaWNhdGlvbkl0ZW1fLCBfQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RhdHVzXywgX2NlcnRpZmljYXRpb25UZXN0RGF0YV8pIHtcbiAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0gPSBfQ2VydGlmaWNhdGlvbkl0ZW1fO1xuICAgICAgICBDZXJ0aWZpY2F0aW9uRGVjaXNpb25TdGF0dXMgPSBfQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RhdHVzXztcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlSXRlbShpZHgsIG92ZXJyaWRlcykge1xuICAgICAgICBsZXQgZGF0YSA9IGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1tpZHhdKTtcbiAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoZGF0YSwgb3ZlcnJpZGVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IENlcnRpZmljYXRpb25JdGVtKGRhdGEpO1xuICAgIH1cblxuICAgIGRlc2NyaWJlKCdpbml0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIHByb3ZpZGVkIGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMV0sXG4gICAgICAgICAgICAgICAgdGVzdCA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShkYXRhKTtcblxuICAgICAgICAgICAgZXhwZWN0KHRlc3QuaWQpLnRvRXF1YWwoZGF0YS5pZCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC50eXBlKS50b0VxdWFsKGRhdGEudHlwZSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5zdWJUeXBlKS50b0VxdWFsKGRhdGEuc3ViVHlwZSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC50eXBlTWVzc2FnZUtleSkudG9FcXVhbChkYXRhLnR5cGVNZXNzYWdlS2V5KTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmRpc3BsYXlOYW1lKS50b0VxdWFsKGRhdGEuZGlzcGxheU5hbWUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuZGVzY3JpcHRpb24pLnRvRXF1YWwoZGF0YS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5kZWNpc2lvblN0YXR1cykudG9FcXVhbChuZXcgQ2VydGlmaWNhdGlvbkRlY2lzaW9uU3RhdHVzKGRhdGEuZGVjaXNpb25TdGF0dXMpKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmVudGl0eUlkKS50b0VxdWFsKGRhdGEuZW50aXR5SWQpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QucG9saWN5TmFtZSkudG9FcXVhbChkYXRhLnBvbGljeU5hbWUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QucG9saWN5VmlvbGF0aW9uUnVsZSkudG9FcXVhbChkYXRhLnBvbGljeVZpb2xhdGlvblJ1bGUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QucG9saWN5VmlvbGF0aW9uT3duZXIpLnRvRXF1YWwoZGF0YS5wb2xpY3lWaW9sYXRpb25Pd25lcik7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5wb2xpY3lEZXNjcmlwdGlvbikudG9FcXVhbChkYXRhLnBvbGljeURlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnBvbGljeVJ1bGVEZXNjcmlwdGlvbikudG9FcXVhbChkYXRhLnBvbGljeVJ1bGVEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5wb2xpY3lWaW9sYXRpb25Db25mbGljdCkudG9FcXVhbChkYXRhLnBvbGljeVZpb2xhdGlvbkNvbmZsaWN0KTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnBvbGljeVZpb2xhdGlvblN1bW1hcnkpLnRvRXF1YWwoZGF0YS5wb2xpY3lWaW9sYXRpb25TdW1tYXJ5KTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnBvbGljeVZpb2xhdGlvbkFwcGxpY2F0aW9uKS50b0VxdWFsKGRhdGEucG9saWN5VmlvbGF0aW9uQXBwbGljYXRpb24pO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QucG9saWN5VmlvbGF0aW9uQWNjb3VudE5hbWUpLnRvRXF1YWwoZGF0YS5wb2xpY3lWaW9sYXRpb25BY2NvdW50TmFtZSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5wb2xpY3lWaW9sYXRpb25Db21wZW5zYXRpbmdDb250cm9sKS50b0VxdWFsKGRhdGEucG9saWN5VmlvbGF0aW9uQ29tcGVuc2F0aW5nQ29udHJvbCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5wb2xpY3lWaW9sYXRpb25SZW1lZGlhdGlvbkFkdmljZSkudG9FcXVhbChkYXRhLnBvbGljeVZpb2xhdGlvblJlbWVkaWF0aW9uQWR2aWNlKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnNjb3JlV2VpZ2h0KS50b0VxdWFsKGRhdGEuc2NvcmVXZWlnaHQpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc3VtbWFyeVN0YXR1cykudG9FcXVhbChkYXRhLnN1bW1hcnlTdGF0dXMpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuYXR0cmlidXRlcykudG9FcXVhbChkYXRhLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuY2hhbGxlbmdlSGlzdG9yeS5vd25lcikudG9FcXVhbChkYXRhLmNoYWxsZW5nZU93bmVyTmFtZSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5jaGFsbGVuZ2VIaXN0b3J5LmNoYWxsZW5nZUNvbW1lbnQpLnRvRXF1YWwoZGF0YS5jaGFsbGVuZ2VDb21tZW50KTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmNoYWxsZW5nZUhpc3RvcnkuZGVjaXNpb24pLnRvRXF1YWwoZGF0YS5jaGFsbGVuZ2VEZWNpc2lvbik7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5jaGFsbGVuZ2VIaXN0b3J5LmRlY2lzaW9uQ29tbWVudCkudG9FcXVhbChkYXRhLmNoYWxsZW5nZURlY2lzaW9uQ29tbWVudCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5jaGFsbGVuZ2VIaXN0b3J5LmRlY2lkZXJOYW1lKS50b0VxdWFsKGRhdGEuY2hhbGxlbmdlRGVjaWRlck5hbWUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuZGVsZWdhdGlvbi5jb21wbGV0aW9uQ29tbWVudHMpLnRvRXF1YWwoZGF0YS5kZWxlZ2F0aW9uQ29tcGxldGlvbkNvbW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmRlbGVnYXRpb24uY29tcGxldGlvblVzZXIpLnRvRXF1YWwoZGF0YS5kZWxlZ2F0aW9uQ29tcGxldGlvblVzZXIpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QucG9saWN5VmlvbGF0aW9ucykudG9FcXVhbChkYXRhLnBvbGljeVZpb2xhdGlvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuYWNjb3VudFN0YXR1c0ljb25zKS50b0VxdWFsKGRhdGEuYWNjb3VudFN0YXR1c0ljb25zKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Lmdyb3VwQXR0cmlidXRlKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIGFjY291bnQgaW5mbycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbMF0sXG4gICAgICAgICAgICAgICAgdGVzdCA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShkYXRhKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmFwcGxpY2F0aW9uKS50b0VxdWFsKGRhdGEuYXBwbGljYXRpb24pO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QubmF0aXZlSWRlbnRpdHkpLnRvRXF1YWwoZGF0YS5uYXRpdmVJZGVudGl0eSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5pbnN0YW5jZSkudG9FcXVhbChkYXRhLmluc3RhbmNlKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Lmdyb3VwQXR0cmlidXRlKS50b0VxdWFsKGRhdGEuZ3JvdXBBdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgcm9sZSBhcHBsaWNhdGlvbiBhbmQgYWNjb3VudCBpbmZvJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1sxXSxcbiAgICAgICAgICAgICAgICB0ZXN0ID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGRhdGEpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Qucm9sZUFwcGxpY2F0aW9ucykudG9FcXVhbChkYXRhLnJvbGVBcHBsaWNhdGlvbnMpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Qucm9sZUFjY291bnROYW1lcykudG9FcXVhbChkYXRhLnJvbGVBY2NvdW50TmFtZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdpdGggbm8gY29uZmlnIGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNQb2xpY3lWaW9sYXRpb24oKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYSBwb2xpY3kgdmlvbGF0aW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVJdGVtKDAsIHsgdHlwZTogQ2VydGlmaWNhdGlvbkl0ZW0uVHlwZS5Qb2xpY3lWaW9sYXRpb24gfSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlbS5pc1BvbGljeVZpb2xhdGlvbigpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSBub24tcG9saWN5IHZpb2xhdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlSXRlbSgwLCB7IHR5cGU6IENlcnRpZmljYXRpb25JdGVtLlR5cGUuRXhjZXB0aW9uIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNQb2xpY3lWaW9sYXRpb24oKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gdHlwZSBpcyBudWxsJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVJdGVtKDAsIHsgdHlwZTogbnVsbCB9KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtLmlzUG9saWN5VmlvbGF0aW9uKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc1JvbGUoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYSByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVJdGVtKDAsIHsgdHlwZTogQ2VydGlmaWNhdGlvbkl0ZW0uVHlwZS5CdW5kbGUgfSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlbS5pc1JvbGUoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGEgbm9uLXJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUl0ZW0oMCwgeyB0eXBlOiBDZXJ0aWZpY2F0aW9uSXRlbS5UeXBlLkV4Y2VwdGlvbiB9KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtLmlzUm9sZSgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2Ugd2hlbiB0eXBlIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUl0ZW0oMCwgeyB0eXBlOiBudWxsIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNSb2xlKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc0V4Y2VwdGlvbigpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBhIGV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlSXRlbSgwLCB7IHR5cGU6IENlcnRpZmljYXRpb25JdGVtLlR5cGUuRXhjZXB0aW9uIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNFeGNlcHRpb24oKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGEgbm9uLWV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlSXRlbSgwLCB7IHR5cGU6IENlcnRpZmljYXRpb25JdGVtLlR5cGUuQnVuZGxlIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNFeGNlcHRpb24oKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gdHlwZSBpcyBudWxsJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVJdGVtKDAsIHsgdHlwZTogbnVsbCB9KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtLmlzRXhjZXB0aW9uKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc0FjY291bnQoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYWNjb3VudCB0eXBlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVJdGVtKDAsIHsgdHlwZTogQ2VydGlmaWNhdGlvbkl0ZW0uVHlwZS5BY2NvdW50IH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNBY2NvdW50KCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhIG5vbi1hY2NvdW50IHR5cGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUl0ZW0oMCwgeyB0eXBlOiBDZXJ0aWZpY2F0aW9uSXRlbS5UeXBlLkJ1bmRsZSB9KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtLmlzQWNjb3VudCgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2Ugd2hlbiB0eXBlIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IGNyZWF0ZUl0ZW0oMCwgeyB0eXBlOiBudWxsIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNBY2NvdW50KCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc0Fzc2lnbmVkUm9sZSgpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBhbiBhc3NpZ25lZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBjcmVhdGVJdGVtKDAsIHsgc3ViVHlwZTogQ2VydGlmaWNhdGlvbkl0ZW0uU3ViVHlwZS5Bc3NpZ25lZFJvbGUgfSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlbS5pc0Fzc2lnbmVkUm9sZSgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSBub24tYXNzaWduZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlSXRlbSgwLCB7IHR5cGU6IENlcnRpZmljYXRpb25JdGVtLkVudGl0bGVtZW50IH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uaXNBc3NpZ25lZFJvbGUoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gc3ViIHR5cGUgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlSXRlbSgwLCB7IHN1YlR5cGU6IG51bGwgfSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlbS5pc0Fzc2lnbmVkUm9sZSgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0Q29tbWVudHMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgYmxhbmsgc3RyaW5nIHdoZW4gbm8gY29tbWVudCBpcyBmb3VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gY3JlYXRlSXRlbSgwKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtLmdldENvbW1lbnRzKCkpLnRvQmUoJyAnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgY29tcGxldGlvbiBjb21tZW50JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbW1lbnRzID0geyBhdHRyaWJ1dGVzOiB7Y29tbWVudHM6IHtjaGFsbGVuZ2VDb21wbGV0aW9uQ29tbWVudHM6ICdmdXp6eSB3dXp6eSd9fX0sXG4gICAgICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUl0ZW0oMCwgY29tbWVudHMpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uZ2V0Q29tbWVudHMoKSlcbiAgICAgICAgICAgICAgICAudG9CZShjb21tZW50cy5hdHRyaWJ1dGVzLmNvbW1lbnRzLmNoYWxsZW5nZUNvbXBsZXRpb25Db21tZW50cyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGRlbGVnYXRpb24gY29tbWVudCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjb21tZW50cyA9IHsgYXR0cmlidXRlczoge2NvbW1lbnRzOiB7ZGVsZWdhdGlvbkNvbW1lbnRzOiAnZnV6enkgd3V6enkgd2FzIGh1bmdyeSd9fX0sXG4gICAgICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUl0ZW0oMCwgY29tbWVudHMpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0uZ2V0Q29tbWVudHMoKSlcbiAgICAgICAgICAgICAgICAudG9CZShjb21tZW50cy5hdHRyaWJ1dGVzLmNvbW1lbnRzLmRlbGVnYXRpb25Db21tZW50cyk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbWF0Y2hlc0FjY291bnQoKScsICgpID0+IHtcbiAgICAgICAgZnVuY3Rpb24gdGVzdE1hdGNoZXNBY2NvdW50KGl0ZW0xLCBpdGVtMiwgaXNNYXRjaCkge1xuICAgICAgICAgICAgbGV0IGNlcnRJdGVtMSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShpdGVtMSksXG4gICAgICAgICAgICAgICAgY2VydEl0ZW0yID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGl0ZW0yKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0SXRlbTEubWF0Y2hlc0FjY291bnQoY2VydEl0ZW0yKSkudG9FcXVhbChpc01hdGNoKTtcbiAgICAgICAgfVxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBhcHBsaWNhdGlvbnMgZG8gbm90IG1hdGNoJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdE1hdGNoZXNBY2NvdW50KHtcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0FwcDEnLFxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnQWNjb3VudDEnLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiAnSW5zdGFuY2UxJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnRGlmZmVyZW50QXBwJyxcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ0FjY291bnQxJyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ0luc3RhbmNlMSdcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbmF0aXZlSWRlbnRpdHkgZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICAgICAgICB0ZXN0TWF0Y2hlc0FjY291bnQoe1xuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnQXBwMScsXG4gICAgICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICdBY2NvdW50MScsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6ICdJbnN0YW5jZTEnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ05ld0FjY291bnQnLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiAnSW5zdGFuY2UxJ1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBpbnN0YW5jZSBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICAgICAgICAgIHRlc3RNYXRjaGVzQWNjb3VudCh7XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ0FjY291bnQxJyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ0luc3RhbmNlMSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0FwcDEnLFxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnQWNjb3VudDEnLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiAnU29tZU90aGVySW5zdGFuY2UnXG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgYWxsIHRocmVlIGFjY291bnQgcHJvcGVydGllcyBtYXRjaCcsICgpID0+IHtcbiAgICAgICAgICAgIHRlc3RNYXRjaGVzQWNjb3VudCh7XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdBcHAxJyxcbiAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ0FjY291bnQxJyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ0luc3RhbmNlMSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0FwcDEnLFxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnQWNjb3VudDEnLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiAnSW5zdGFuY2UxJ1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
