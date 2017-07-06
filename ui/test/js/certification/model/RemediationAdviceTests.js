System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('RemediationAdvice', function () {

                beforeEach(module(certificationModule));

                var data = undefined,
                    policyTreeNodeData = undefined,
                    RemediationAdvice = undefined,
                    SoDRole = undefined,
                    PolicyTreeNode = undefined;

                beforeEach(inject(function (_RemediationAdvice_, _SoDRole_, _PolicyTreeNode_, certificationTestData) {
                    RemediationAdvice = _RemediationAdvice_;
                    SoDRole = _SoDRole_;
                    PolicyTreeNode = _PolicyTreeNode_;
                    data = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT.advice);
                    policyTreeNodeData = angular.copy(certificationTestData.POLICY_TREE_NODE);
                }));

                describe('constructor', function () {
                    it('should initialize with provided data', function () {
                        data.entitlementsToRemediate = policyTreeNodeData;

                        var advice = new RemediationAdvice(data);
                        expect(advice.violationConstraint).toEqual(data.violationConstraint);
                        expect(advice.violationSummary).toEqual(data.violationSummary);
                        expect(advice.remediationAdvice).toEqual(data.remediationAdvice);
                        expect(advice.leftRoles.length).toEqual(data.leftRoles.length);
                        advice.leftRoles.forEach(function (role) {
                            expect(role instanceof SoDRole).toEqual(true);
                        });
                        expect(advice.rightRoles.length).toEqual(data.rightRoles.length);
                        advice.rightRoles.forEach(function (role) {
                            expect(role instanceof SoDRole).toEqual(true);
                        });
                        expect(advice.entitlementsToRemediate instanceof PolicyTreeNode).toEqual(true);
                    });

                    it('should throw with no data', function () {
                        expect(function () {
                            new RemediationAdvice();
                        }).toThrow();
                    });
                });

                describe('isRoleSoDViolation()', function () {
                    it('returns false if no left or right roles', function () {
                        var advice = new RemediationAdvice(data);
                        delete advice.leftRoles;
                        delete advice.rightRoles;
                        expect(advice.isRoleSoDViolation()).toEqual(false);
                    });

                    it('returns true if left roles exist', function () {
                        var advice = new RemediationAdvice(data);
                        delete advice.rightRoles;
                        expect(advice.isRoleSoDViolation()).toEqual(true);
                    });

                    it('returns true if right roles exist', function () {
                        var advice = new RemediationAdvice(data);
                        delete advice.leftRoles;
                        expect(advice.isRoleSoDViolation()).toEqual(true);
                    });
                });

                describe('isEntitlementSoDViolation', function () {
                    it('returns true if there are entitlements to remediate', function () {
                        data.entitlementsToRemediate = policyTreeNodeData;
                        var advice = new RemediationAdvice(data);
                        expect(advice.isEntitlementSoDViolation()).toEqual(true);
                    });

                    it('returns false if there are no entitlements to remediate', function () {
                        var advice = new RemediationAdvice(data);
                        expect(advice.isEntitlementSoDViolation()).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvUmVtZWRpYXRpb25BZHZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLDZCQUE2QixVQUFVLFNBQVM7OztJQUc3SDs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0I7UUFDckMsU0FBUyxZQUFZOztZQUo3QixTQUFTLHFCQUFxQixZQUFXOztnQkFFckMsV0FBVyxPQUFPOztnQkFFbEIsSUFBSSxPQUFJO29CQUFFLHFCQUFrQjtvQkFBRSxvQkFBaUI7b0JBQUUsVUFBTztvQkFBRSxpQkFBYzs7Z0JBRXhFLFdBQVcsT0FBTyxVQUFDLHFCQUFxQixXQUFXLGtCQUFrQix1QkFBMEI7b0JBQzNGLG9CQUFvQjtvQkFDcEIsVUFBVTtvQkFDVixpQkFBaUI7b0JBQ2pCLE9BQU8sUUFBUSxLQUFLLHNCQUFzQiwwQkFBMEI7b0JBQ3BFLHFCQUFxQixRQUFRLEtBQUssc0JBQXNCOzs7Z0JBRzVELFNBQVMsZUFBZSxZQUFNO29CQUMxQixHQUFHLHdDQUF3QyxZQUFNO3dCQUM3QyxLQUFLLDBCQUEwQjs7d0JBRS9CLElBQUksU0FBUyxJQUFJLGtCQUFrQjt3QkFDbkMsT0FBTyxPQUFPLHFCQUFxQixRQUFRLEtBQUs7d0JBQ2hELE9BQU8sT0FBTyxrQkFBa0IsUUFBUSxLQUFLO3dCQUM3QyxPQUFPLE9BQU8sbUJBQW1CLFFBQVEsS0FBSzt3QkFDOUMsT0FBTyxPQUFPLFVBQVUsUUFBUSxRQUFRLEtBQUssVUFBVTt3QkFDdkQsT0FBTyxVQUFVLFFBQVEsVUFBQyxNQUFTOzRCQUMvQixPQUFPLGdCQUFnQixTQUFTLFFBQVE7O3dCQUU1QyxPQUFPLE9BQU8sV0FBVyxRQUFRLFFBQVEsS0FBSyxXQUFXO3dCQUN6RCxPQUFPLFdBQVcsUUFBUSxVQUFDLE1BQVM7NEJBQ2hDLE9BQU8sZ0JBQWdCLFNBQVMsUUFBUTs7d0JBRTVDLE9BQU8sT0FBTyxtQ0FBbUMsZ0JBQWdCLFFBQVE7OztvQkFHN0UsR0FBRyw2QkFBNkIsWUFBTTt3QkFDbEMsT0FBTyxZQUFNOzRCQUFFLElBQUk7MkJBQXdCOzs7O2dCQUluRCxTQUFTLHdCQUF3QixZQUFNO29CQUNuQyxHQUFHLDJDQUEyQyxZQUFNO3dCQUNoRCxJQUFJLFNBQVMsSUFBSSxrQkFBa0I7d0JBQ25DLE9BQU8sT0FBTzt3QkFDZCxPQUFPLE9BQU87d0JBQ2QsT0FBTyxPQUFPLHNCQUFzQixRQUFROzs7b0JBR2hELEdBQUcsb0NBQW9DLFlBQU07d0JBQ3pDLElBQUksU0FBUyxJQUFJLGtCQUFrQjt3QkFDbkMsT0FBTyxPQUFPO3dCQUNkLE9BQU8sT0FBTyxzQkFBc0IsUUFBUTs7O29CQUdoRCxHQUFHLHFDQUFxQyxZQUFNO3dCQUMxQyxJQUFJLFNBQVMsSUFBSSxrQkFBa0I7d0JBQ25DLE9BQU8sT0FBTzt3QkFDZCxPQUFPLE9BQU8sc0JBQXNCLFFBQVE7Ozs7Z0JBSXBELFNBQVMsNkJBQTZCLFlBQU07b0JBQ3hDLEdBQUcsdURBQXVELFlBQU07d0JBQzVELEtBQUssMEJBQTBCO3dCQUMvQixJQUFJLFNBQVMsSUFBSSxrQkFBa0I7d0JBQ25DLE9BQU8sT0FBTyw2QkFBNkIsUUFBUTs7O29CQUd2RCxHQUFHLDJEQUEyRCxZQUFNO3dCQUNoRSxJQUFJLFNBQVMsSUFBSSxrQkFBa0I7d0JBQ25DLE9BQU8sT0FBTyw2QkFBNkIsUUFBUTs7Ozs7O0dBa0I1RCIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL21vZGVsL1JlbWVkaWF0aW9uQWR2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICcuLi9DZXJ0aWZpY2F0aW9uVGVzdERhdGEnO1xuXG5kZXNjcmliZSgnUmVtZWRpYXRpb25BZHZpY2UnLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGxldCBkYXRhLCBwb2xpY3lUcmVlTm9kZURhdGEsIFJlbWVkaWF0aW9uQWR2aWNlLCBTb0RSb2xlLCBQb2xpY3lUcmVlTm9kZTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfUmVtZWRpYXRpb25BZHZpY2VfLCBfU29EUm9sZV8sIF9Qb2xpY3lUcmVlTm9kZV8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSkgPT4ge1xuICAgICAgICBSZW1lZGlhdGlvbkFkdmljZSA9IF9SZW1lZGlhdGlvbkFkdmljZV87XG4gICAgICAgIFNvRFJvbGUgPSBfU29EUm9sZV87XG4gICAgICAgIFBvbGljeVRyZWVOb2RlID0gX1BvbGljeVRyZWVOb2RlXztcbiAgICAgICAgZGF0YSA9IGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuUkVNRURJQVRJT05fQURWSUNFX1JFU1VMVC5hZHZpY2UpO1xuICAgICAgICBwb2xpY3lUcmVlTm9kZURhdGEgPSBhbmd1bGFyLmNvcHkoY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREUpO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggcHJvdmlkZWQgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGRhdGEuZW50aXRsZW1lbnRzVG9SZW1lZGlhdGUgPSBwb2xpY3lUcmVlTm9kZURhdGE7XG5cbiAgICAgICAgICAgIGxldCBhZHZpY2UgPSBuZXcgUmVtZWRpYXRpb25BZHZpY2UoZGF0YSk7XG4gICAgICAgICAgICBleHBlY3QoYWR2aWNlLnZpb2xhdGlvbkNvbnN0cmFpbnQpLnRvRXF1YWwoZGF0YS52aW9sYXRpb25Db25zdHJhaW50KTtcbiAgICAgICAgICAgIGV4cGVjdChhZHZpY2UudmlvbGF0aW9uU3VtbWFyeSkudG9FcXVhbChkYXRhLnZpb2xhdGlvblN1bW1hcnkpO1xuICAgICAgICAgICAgZXhwZWN0KGFkdmljZS5yZW1lZGlhdGlvbkFkdmljZSkudG9FcXVhbChkYXRhLnJlbWVkaWF0aW9uQWR2aWNlKTtcbiAgICAgICAgICAgIGV4cGVjdChhZHZpY2UubGVmdFJvbGVzLmxlbmd0aCkudG9FcXVhbChkYXRhLmxlZnRSb2xlcy5sZW5ndGgpO1xuICAgICAgICAgICAgYWR2aWNlLmxlZnRSb2xlcy5mb3JFYWNoKChyb2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJvbGUgaW5zdGFuY2VvZiBTb0RSb2xlKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QoYWR2aWNlLnJpZ2h0Um9sZXMubGVuZ3RoKS50b0VxdWFsKGRhdGEucmlnaHRSb2xlcy5sZW5ndGgpO1xuICAgICAgICAgICAgYWR2aWNlLnJpZ2h0Um9sZXMuZm9yRWFjaCgocm9sZSkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyb2xlIGluc3RhbmNlb2YgU29EUm9sZSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGFkdmljZS5lbnRpdGxlbWVudHNUb1JlbWVkaWF0ZSBpbnN0YW5jZW9mIFBvbGljeVRyZWVOb2RlKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdpdGggbm8gZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiB7IG5ldyBSZW1lZGlhdGlvbkFkdmljZSgpOyB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzUm9sZVNvRFZpb2xhdGlvbigpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBubyBsZWZ0IG9yIHJpZ2h0IHJvbGVzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGFkdmljZSA9IG5ldyBSZW1lZGlhdGlvbkFkdmljZShkYXRhKTtcbiAgICAgICAgICAgIGRlbGV0ZSBhZHZpY2UubGVmdFJvbGVzO1xuICAgICAgICAgICAgZGVsZXRlIGFkdmljZS5yaWdodFJvbGVzO1xuICAgICAgICAgICAgZXhwZWN0KGFkdmljZS5pc1JvbGVTb0RWaW9sYXRpb24oKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgbGVmdCByb2xlcyBleGlzdCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhZHZpY2UgPSBuZXcgUmVtZWRpYXRpb25BZHZpY2UoZGF0YSk7XG4gICAgICAgICAgICBkZWxldGUgYWR2aWNlLnJpZ2h0Um9sZXM7XG4gICAgICAgICAgICBleHBlY3QoYWR2aWNlLmlzUm9sZVNvRFZpb2xhdGlvbigpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHJpZ2h0IHJvbGVzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGFkdmljZSA9IG5ldyBSZW1lZGlhdGlvbkFkdmljZShkYXRhKTtcbiAgICAgICAgICAgIGRlbGV0ZSBhZHZpY2UubGVmdFJvbGVzO1xuICAgICAgICAgICAgZXhwZWN0KGFkdmljZS5pc1JvbGVTb0RWaW9sYXRpb24oKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNFbnRpdGxlbWVudFNvRFZpb2xhdGlvbicsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgZW50aXRsZW1lbnRzIHRvIHJlbWVkaWF0ZScsICgpID0+IHtcbiAgICAgICAgICAgIGRhdGEuZW50aXRsZW1lbnRzVG9SZW1lZGlhdGUgPSBwb2xpY3lUcmVlTm9kZURhdGE7XG4gICAgICAgICAgICBsZXQgYWR2aWNlID0gbmV3IFJlbWVkaWF0aW9uQWR2aWNlKGRhdGEpO1xuICAgICAgICAgICAgZXhwZWN0KGFkdmljZS5pc0VudGl0bGVtZW50U29EVmlvbGF0aW9uKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGFyZSBubyBlbnRpdGxlbWVudHMgdG8gcmVtZWRpYXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGFkdmljZSA9IG5ldyBSZW1lZGlhdGlvbkFkdmljZShkYXRhKTtcbiAgICAgICAgICAgIGV4cGVjdChhZHZpY2UuaXNFbnRpdGxlbWVudFNvRFZpb2xhdGlvbigpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
