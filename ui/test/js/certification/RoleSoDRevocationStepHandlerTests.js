System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}],
        execute: function () {

            describe('RoleSoDRevocationStepHandler', function () {

                var RoleSoDRevocationStepHandler = undefined,
                    SoDRole = undefined,
                    advice = undefined,
                    $rootScope = undefined,
                    certificationDataService = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_RoleSoDRevocationStepHandler_, _SoDRole_, certificationTestData, RemediationAdvice, _$rootScope_, _certificationDataService_) {
                    RoleSoDRevocationStepHandler = _RoleSoDRevocationStepHandler_;
                    SoDRole = _SoDRole_;
                    advice = new RemediationAdvice(certificationTestData.REMEDIATION_ADVICE_RESULT.advice);
                    $rootScope = _$rootScope_;
                    certificationDataService = _certificationDataService_;
                }));

                describe('constructor', function () {
                    it('throws without advice', function () {
                        expect(function () {
                            new RoleSoDRevocationStepHandler();
                        }).toThrow();
                    });

                    it('pulls data off the advice', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.violationConstraint).toEqual(advice.violationConstraint);
                        expect(stepHandler.violationSummary).toEqual(advice.violationSummary);
                    });
                });

                describe('roles map', function () {
                    it('creates array of objects for left and right roles', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice),
                            testRoleSide = function (roleSide, expectedLabel, expectedRoles) {
                            expect(roleSide).toBeDefined();
                            expect(roleSide.label).toEqual(expectedLabel);
                            expect(roleSide.roles).toEqual(expectedRoles);
                        };
                        expect(stepHandler.roleSides).toBeDefined();
                        testRoleSide(stepHandler.roleSides[0], 'ui_violation_conflicting_roles', advice.leftRoles);
                        testRoleSide(stepHandler.roleSides[1], 'ui_violation_original_roles', advice.rightRoles);
                    });

                    it('sets status on roles if decision in data service', function () {
                        var stepHandler = undefined;
                        // This role has a certItemId, so it is part of the cert as a role, but has no status defined.
                        // Mock up an unsaved decision on the role.
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.callFake(function (certItemId) {
                            if (certItemId === advice.leftRoles[1].certItemId) {
                                return {
                                    status: 'Approved'
                                };
                            }

                            return undefined;
                        });
                        stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.roleSides[0].roles[1].status).toEqual('Approved');
                    });

                    it('toggles selection of externally revoked roles', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        // This role has status Remediated from the server, for a saved decision.
                        expect(stepHandler.isSelected(advice.leftRoles[0])).toEqual(true);
                    });

                    it('toggles selection of previously selected roles', function () {
                        var selectedRoles = ['right1Name'],
                            stepHandler = new RoleSoDRevocationStepHandler(advice, selectedRoles);
                        expect(stepHandler.isSelected(advice.rightRoles[0])).toEqual(true);
                    });
                });

                describe('isSaveDisabled()', function () {
                    it('returns true if no roles selected', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        stepHandler.selectedRoles.clear();
                        expect(stepHandler.isSaveDisabled()).toEqual(true);
                    });

                    it('returns false if a role is selected', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        stepHandler.selectedRoles.clear();
                        stepHandler.toggle(advice.rightRoles[0]);
                        expect(stepHandler.isSaveDisabled()).toEqual(false);
                    });
                });

                describe('save()', function () {
                    it('resolves with selected role names', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice),
                            saveResult = undefined;
                        stepHandler.selectedRoles.clear();
                        stepHandler.toggle(advice.rightRoles[0]);
                        stepHandler.toggle(advice.leftRoles[0]);
                        stepHandler.save().then(function (result) {
                            saveResult = result;
                        });
                        $rootScope.$apply();
                        expect(saveResult).toBeDefined();
                        expect(saveResult.revokedRoles).toBeDefined();
                        expect(saveResult.revokedRoles).toContain(advice.rightRoles[0].name);
                        expect(saveResult.revokedRoles).toContain(advice.leftRoles[0].name);
                        expect(saveResult.revokedRoles).not.toContain(advice.leftRoles[1].name);
                    });
                });

                describe('isEditable()', function () {
                    it('returns true if no existing status', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.isEditable(advice.leftRoles[1])).toEqual(true);
                    });

                    it('returns false if existing status', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.isEditable(advice.leftRoles[0])).toEqual(false);
                    });

                    it('returns true if existing status of Cleared', function () {
                        var stepHandler = undefined;
                        advice.leftRoles[0].status = 'Cleared';
                        stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.isEditable(advice.leftRoles[0])).toEqual(true);
                    });
                });

                describe('isRevoked()', function () {
                    it('returns true if existing status is revoked', function () {
                        var stepHandler = undefined;
                        advice.leftRoles[0].status = 'Remediated';
                        stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.isRevoked(advice.leftRoles[0])).toEqual(true);
                    });

                    it('returns false if no existing status', function () {
                        var stepHandler = undefined;
                        delete advice.leftRoles[0].status;
                        stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.isRevoked(advice.leftRoles[0])).toEqual(false);
                    });

                    it('returns false if existing status is not revoked', function () {
                        var stepHandler = undefined;
                        advice.leftRoles[0].status = 'Approved';
                        stepHandler = new RoleSoDRevocationStepHandler(advice);
                        expect(stepHandler.isRevoked(advice.leftRoles[0])).toEqual(false);
                    });
                });

                describe('toggle()', function () {
                    it('adds role to selections if not already selected', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        stepHandler.selectedRoles.clear();
                        stepHandler.toggle(advice.leftRoles[0]);
                        expect(stepHandler.isSelected(advice.leftRoles[0])).toEqual(true);
                    });

                    it('removes role from selection if selected', function () {
                        var stepHandler = new RoleSoDRevocationStepHandler(advice);
                        stepHandler.selectedRoles.clear();
                        stepHandler.toggle(advice.leftRoles[0]);
                        stepHandler.toggle(advice.leftRoles[0]);
                        expect(stepHandler.isSelected(advice.leftRoles[0])).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlclRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsZ0RBQWdELFVBQVUsU0FBUzs7O0lBR2hKOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLDJDQUEyQztRQUN4RCxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsZ0NBQWdDLFlBQU07O2dCQUUzQyxJQUFJLCtCQUE0QjtvQkFBRSxVQUFPO29CQUFFLFNBQU07b0JBQUUsYUFBVTtvQkFBRSwyQkFBd0I7O2dCQUV2RixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxnQ0FBZ0MsV0FBVyx1QkFBdUIsbUJBQ2xFLGNBQWMsNEJBQStCO29CQUM1RCwrQkFBK0I7b0JBQy9CLFVBQVU7b0JBQ1YsU0FBUyxJQUFJLGtCQUFrQixzQkFBc0IsMEJBQTBCO29CQUMvRSxhQUFhO29CQUNiLDJCQUEyQjs7O2dCQUcvQixTQUFTLGVBQWUsWUFBTTtvQkFDMUIsR0FBRyx5QkFBeUIsWUFBTTt3QkFDOUIsT0FBTyxZQUFNOzRCQUFFLElBQUk7MkJBQW1DOzs7b0JBRzFELEdBQUcsNkJBQTZCLFlBQU07d0JBQ2xDLElBQUksY0FBYyxJQUFJLDZCQUE2Qjt3QkFDbkQsT0FBTyxZQUFZLHFCQUFxQixRQUFRLE9BQU87d0JBQ3ZELE9BQU8sWUFBWSxrQkFBa0IsUUFBUSxPQUFPOzs7O2dCQUk1RCxTQUFTLGFBQWEsWUFBTTtvQkFDeEIsR0FBRyxxREFBcUQsWUFBTTt3QkFDMUQsSUFBSSxjQUFjLElBQUksNkJBQTZCOzRCQUMvQyxlQUFlLFVBQVMsVUFBVSxlQUFlLGVBQWU7NEJBQzVELE9BQU8sVUFBVTs0QkFDakIsT0FBTyxTQUFTLE9BQU8sUUFBUTs0QkFD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R0FBRzt3QkFDM0IsY0FBYyxJQUFJLDZCQUE2Qjt3QkFDL0MsT0FBTyxZQUFZLFVBQVUsT0FBTyxVQUFVLEtBQUssUUFBUTs7O29CQUcvRCxHQUFHLG1EQUFtRCxZQUFNO3dCQUN4RCxJQUFJLGNBQVc7d0JBQ2YsT0FBTyxVQUFVLEdBQUcsU0FBUzt3QkFDN0IsY0FBYyxJQUFJLDZCQUE2Qjt3QkFDL0MsT0FBTyxZQUFZLFVBQVUsT0FBTyxVQUFVLEtBQUssUUFBUTs7OztnQkFJbkUsU0FBUyxZQUFZLFlBQU07b0JBQ3ZCLEdBQUcsbURBQW1ELFlBQU07d0JBQ3hELElBQUksY0FBYyxJQUFJLDZCQUE2Qjt3QkFDbkQsWUFBWSxjQUFjO3dCQUMxQixZQUFZLE9BQU8sT0FBTyxVQUFVO3dCQUNwQyxPQUFPLFlBQVksV0FBVyxPQUFPLFVBQVUsS0FBSyxRQUFROzs7b0JBSWhFLEdBQUcsMkNBQTJDLFlBQU07d0JBQ2hELElBQUksY0FBYyxJQUFJLDZCQUE2Qjt3QkFDbkQsWUFBWSxjQUFjO3dCQUMxQixZQUFZLE9BQU8sT0FBTyxVQUFVO3dCQUNwQyxZQUFZLE9BQU8sT0FBTyxVQUFVO3dCQUNwQyxPQUFPLFlBQVksV0FBVyxPQUFPLFVBQVUsS0FBSyxRQUFROzs7Ozs7R0FnQnJFIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlclRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAndGVzdC9qcy9jZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25UZXN0RGF0YSc7XG5cbmRlc2NyaWJlKCdSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyJywgKCkgPT4ge1xuXG4gICAgbGV0IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIsIFNvRFJvbGUsIGFkdmljZSwgJHJvb3RTY29wZSwgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9Sb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyXywgX1NvRFJvbGVfLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsIFJlbWVkaWF0aW9uQWR2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICBfJHJvb3RTY29wZV8sIF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfKSA9PiB7XG4gICAgICAgIFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIgPSBfUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlcl87XG4gICAgICAgIFNvRFJvbGUgPSBfU29EUm9sZV87XG4gICAgICAgIGFkdmljZSA9IG5ldyBSZW1lZGlhdGlvbkFkdmljZShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuUkVNRURJQVRJT05fQURWSUNFX1JFU1VMVC5hZHZpY2UpO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBhZHZpY2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4geyBuZXcgUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlcigpOyB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWxscyBkYXRhIG9mZiB0aGUgYWR2aWNlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIoYWR2aWNlKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci52aW9sYXRpb25Db25zdHJhaW50KS50b0VxdWFsKGFkdmljZS52aW9sYXRpb25Db25zdHJhaW50KTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci52aW9sYXRpb25TdW1tYXJ5KS50b0VxdWFsKGFkdmljZS52aW9sYXRpb25TdW1tYXJ5KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncm9sZXMgbWFwJywgKCkgPT4ge1xuICAgICAgICBpdCgnY3JlYXRlcyBhcnJheSBvZiBvYmplY3RzIGZvciBsZWZ0IGFuZCByaWdodCByb2xlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSksXG4gICAgICAgICAgICAgICAgdGVzdFJvbGVTaWRlID0gZnVuY3Rpb24ocm9sZVNpZGUsIGV4cGVjdGVkTGFiZWwsIGV4cGVjdGVkUm9sZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJvbGVTaWRlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3Qocm9sZVNpZGUubGFiZWwpLnRvRXF1YWwoZXhwZWN0ZWRMYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyb2xlU2lkZS5yb2xlcykudG9FcXVhbChleHBlY3RlZFJvbGVzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLnJvbGVTaWRlcykudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIHRlc3RSb2xlU2lkZShzdGVwSGFuZGxlci5yb2xlU2lkZXNbMF0sICd1aV92aW9sYXRpb25fY29uZmxpY3Rpbmdfcm9sZXMnLCBhZHZpY2UubGVmdFJvbGVzKTtcbiAgICAgICAgICAgIHRlc3RSb2xlU2lkZShzdGVwSGFuZGxlci5yb2xlU2lkZXNbMV0sICd1aV92aW9sYXRpb25fb3JpZ2luYWxfcm9sZXMnLCBhZHZpY2UucmlnaHRSb2xlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZXRzIHN0YXR1cyBvbiByb2xlcyBpZiBkZWNpc2lvbiBpbiBkYXRhIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXI7XG4gICAgICAgICAgICAvLyBUaGlzIHJvbGUgaGFzIGEgY2VydEl0ZW1JZCwgc28gaXQgaXMgcGFydCBvZiB0aGUgY2VydCBhcyBhIHJvbGUsIGJ1dCBoYXMgbm8gc3RhdHVzIGRlZmluZWQuXG4gICAgICAgICAgICAvLyBNb2NrIHVwIGFuIHVuc2F2ZWQgZGVjaXNpb24gb24gdGhlIHJvbGUuXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0RWZmZWN0aXZlRGVjaXNpb24nKS5hbmQuY2FsbEZha2UoKGNlcnRJdGVtSWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VydEl0ZW1JZCA9PT0gYWR2aWNlLmxlZnRSb2xlc1sxXS5jZXJ0SXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGVwSGFuZGxlciA9IG5ldyBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIucm9sZVNpZGVzWzBdLnJvbGVzWzFdLnN0YXR1cykudG9FcXVhbCgnQXBwcm92ZWQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3RvZ2dsZXMgc2VsZWN0aW9uIG9mIGV4dGVybmFsbHkgcmV2b2tlZCByb2xlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSk7XG4gICAgICAgICAgICAvLyBUaGlzIHJvbGUgaGFzIHN0YXR1cyBSZW1lZGlhdGVkIGZyb20gdGhlIHNlcnZlciwgZm9yIGEgc2F2ZWQgZGVjaXNpb24uXG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNTZWxlY3RlZChhZHZpY2UubGVmdFJvbGVzWzBdKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3RvZ2dsZXMgc2VsZWN0aW9uIG9mIHByZXZpb3VzbHkgc2VsZWN0ZWQgcm9sZXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRSb2xlcyA9IFsncmlnaHQxTmFtZSddLFxuICAgICAgICAgICAgICAgIHN0ZXBIYW5kbGVyID0gbmV3IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIoYWR2aWNlLCBzZWxlY3RlZFJvbGVzKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5pc1NlbGVjdGVkKGFkdmljZS5yaWdodFJvbGVzWzBdKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNTYXZlRGlzYWJsZWQoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBubyByb2xlcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSk7XG4gICAgICAgICAgICBzdGVwSGFuZGxlci5zZWxlY3RlZFJvbGVzLmNsZWFyKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNTYXZlRGlzYWJsZWQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgYSByb2xlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIoYWR2aWNlKTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLnNlbGVjdGVkUm9sZXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLnRvZ2dsZShhZHZpY2UucmlnaHRSb2xlc1swXSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNTYXZlRGlzYWJsZWQoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NhdmUoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3Jlc29sdmVzIHdpdGggc2VsZWN0ZWQgcm9sZSBuYW1lcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSksXG4gICAgICAgICAgICAgICAgc2F2ZVJlc3VsdDtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLnNlbGVjdGVkUm9sZXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLnRvZ2dsZShhZHZpY2UucmlnaHRSb2xlc1swXSk7XG4gICAgICAgICAgICBzdGVwSGFuZGxlci50b2dnbGUoYWR2aWNlLmxlZnRSb2xlc1swXSk7XG4gICAgICAgICAgICBzdGVwSGFuZGxlci5zYXZlKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgc2F2ZVJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChzYXZlUmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQucmV2b2tlZFJvbGVzKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQucmV2b2tlZFJvbGVzKS50b0NvbnRhaW4oYWR2aWNlLnJpZ2h0Um9sZXNbMF0ubmFtZSk7XG4gICAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5yZXZva2VkUm9sZXMpLnRvQ29udGFpbihhZHZpY2UubGVmdFJvbGVzWzBdLm5hbWUpO1xuICAgICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQucmV2b2tlZFJvbGVzKS5ub3QudG9Db250YWluKGFkdmljZS5sZWZ0Um9sZXNbMV0ubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzRWRpdGFibGUoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBubyBleGlzdGluZyBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXIgPSBuZXcgUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzRWRpdGFibGUoYWR2aWNlLmxlZnRSb2xlc1sxXSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGV4aXN0aW5nIHN0YXR1cycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSb2xlU29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNFZGl0YWJsZShhZHZpY2UubGVmdFJvbGVzWzBdKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgZXhpc3Rpbmcgc3RhdHVzIG9mIENsZWFyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXI7XG4gICAgICAgICAgICBhZHZpY2UubGVmdFJvbGVzWzBdLnN0YXR1cyA9ICdDbGVhcmVkJztcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyID0gbmV3IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIoYWR2aWNlKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5pc0VkaXRhYmxlKGFkdmljZS5sZWZ0Um9sZXNbMF0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc1Jldm9rZWQoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBleGlzdGluZyBzdGF0dXMgaXMgcmV2b2tlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlcjtcbiAgICAgICAgICAgIGFkdmljZS5sZWZ0Um9sZXNbMF0uc3RhdHVzID0gJ1JlbWVkaWF0ZWQnO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXIgPSBuZXcgUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzUmV2b2tlZChhZHZpY2UubGVmdFJvbGVzWzBdKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbm8gZXhpc3Rpbmcgc3RhdHVzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyO1xuICAgICAgICAgICAgZGVsZXRlIGFkdmljZS5sZWZ0Um9sZXNbMF0uc3RhdHVzO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXIgPSBuZXcgUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzUmV2b2tlZChhZHZpY2UubGVmdFJvbGVzWzBdKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGV4aXN0aW5nIHN0YXR1cyBpcyBub3QgcmV2b2tlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlcjtcbiAgICAgICAgICAgIGFkdmljZS5sZWZ0Um9sZXNbMF0uc3RhdHVzID0gJ0FwcHJvdmVkJztcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyID0gbmV3IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIoYWR2aWNlKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5pc1Jldm9rZWQoYWR2aWNlLmxlZnRSb2xlc1swXSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd0b2dnbGUoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ2FkZHMgcm9sZSB0byBzZWxlY3Rpb25zIGlmIG5vdCBhbHJlYWR5IHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJvbGVTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXIoYWR2aWNlKTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLnNlbGVjdGVkUm9sZXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLnRvZ2dsZShhZHZpY2UubGVmdFJvbGVzWzBdKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5pc1NlbGVjdGVkKGFkdmljZS5sZWZ0Um9sZXNbMF0pKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1vdmVzIHJvbGUgZnJvbSBzZWxlY3Rpb24gaWYgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXIgPSBuZXcgUm9sZVNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXIuc2VsZWN0ZWRSb2xlcy5jbGVhcigpO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXIudG9nZ2xlKGFkdmljZS5sZWZ0Um9sZXNbMF0pO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXIudG9nZ2xlKGFkdmljZS5sZWZ0Um9sZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzU2VsZWN0ZWQoYWR2aWNlLmxlZnRSb2xlc1swXSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
