System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('RemediationSummary', function () {

                beforeEach(module(certificationModule));

                var data = undefined,
                    RemediationSummary = undefined,
                    IdentitySummary = undefined,
                    RemediationLineItem = undefined;

                beforeEach(inject(function (_RemediationSummary_, _IdentitySummary_, _RemediationLineItem_, certificationTestData) {
                    RemediationLineItem = _RemediationLineItem_;
                    RemediationSummary = _RemediationSummary_;
                    IdentitySummary = _IdentitySummary_;
                    data = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT.summary);
                }));

                describe('constructor', function () {
                    it('should initialize with provided data', function () {
                        data.requiredOrPermittedRoles = ['role1', 'role2'];

                        var summary = new RemediationSummary(data);
                        expect(summary.certItemId).toEqual(data.id);
                        expect(summary.enableOverrideDefaultRemediator).toEqual(data.enableOverrideDefaultRemediator);
                        expect(summary.defaultRemediator).toEqual(new IdentitySummary(data.defaultRemediator));
                        expect(summary.comments).toEqual(data.comments);
                        expect(summary.remediationDetails).toEqual([new RemediationLineItem(data.remediationDetails[0])]);
                        expect(summary.remediationAction).toEqual(data.remediationAction);
                        expect(summary.requiredOrPermittedRoles).toEqual(data.requiredOrPermittedRoles);
                    });

                    it('should throw with no data', function () {
                        expect(function () {
                            new RemediationSummary();
                        }).toThrow();
                    });
                });

                describe('isManualRemediation()', function () {
                    it('returns false if not manual remediation', function () {
                        var summary = new RemediationSummary({
                            remediationAction: RemediationSummary.RemediationAction.SendProvisionRequest
                        });
                        expect(summary.isManualRemediation()).toEqual(false);
                    });

                    it('returns true if manual remediation', function () {
                        var summary = new RemediationSummary({
                            remediationAction: RemediationSummary.RemediationAction.OpenWorkItem
                        });
                        expect(summary.isManualRemediation()).toEqual(true);
                        summary.remediationAction = RemediationSummary.RemediationAction.OpenTicket;
                        expect(summary.isManualRemediation()).toEqual(true);
                    });
                });

                describe('isModifiable()', function () {
                    it('returns false if no remediation details', function () {
                        var summary = new RemediationSummary(data);
                        delete summary.remediationDetails;
                        expect(summary.isModifiable()).toEqual(false);
                    });

                    it('returns true if there are remediation details', function () {
                        var summary = new RemediationSummary(data);
                        expect(summary.isModifiable()).toEqual(true);
                    });
                });

                describe('requiresRecipientSelection()', function () {
                    it('returns false if not manual remediation', function () {
                        var summary = new RemediationSummary(data);
                        delete summary.defaultRemediator;
                        spyOn(summary, 'isManualRemediation').and.returnValue(false);
                        expect(summary.requiresRecipientSelection()).toEqual(false);
                    });

                    it('returns false if default Remediator is set and override is not enabled', function () {
                        var summary = new RemediationSummary(data);
                        summary.enableOverrideDefaultRemediator = false;
                        expect(summary.requiresRecipientSelection()).toEqual(false);
                    });

                    it('returns true if default remediator is not set', function () {
                        var summary = new RemediationSummary(data);
                        delete summary.defaultRemediator;
                        expect(summary.requiresRecipientSelection()).toEqual(true);
                    });

                    it('returns true if default remediator is set and override is enabled', function () {
                        var summary = new RemediationSummary(data);
                        expect(summary.requiresRecipientSelection()).toEqual(true);
                    });
                });

                describe('hasRoleRevocationDetails()', function () {
                    it('returns true if there are required or permitted roles', function () {
                        var summary = new RemediationSummary(data);
                        summary.requiredOrPermittedRoles = ['a', 'b'];
                        expect(summary.hasRoleRevocationDetails()).toEqual(true);
                    });

                    it('returns false for undefined or empty required or permitted roles', function () {
                        var summary = new RemediationSummary(data);
                        summary.requiredOrPermittedRoles = undefined;
                        expect(summary.hasRoleRevocationDetails()).toEqual(false);
                        summary.requiredOrPermittedRoles = [];
                        expect(summary.hasRoleRevocationDetails()).toEqual(false);
                    });
                });

                describe('RemediationAction', function () {
                    it('is defined on the class', function () {
                        expect(RemediationSummary.RemediationAction).toBeDefined();
                        expect(angular.isObject(RemediationSummary.RemediationAction)).toEqual(true);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvUmVtZWRpYXRpb25TdW1tYXJ5VGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyw2QkFBNkIsVUFBVSxTQUFTOzs7SUFHN0g7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7WUFKN0IsU0FBUyxzQkFBc0IsWUFBVzs7Z0JBRXRDLFdBQVcsT0FBTzs7Z0JBRWxCLElBQUksT0FBSTtvQkFBRSxxQkFBa0I7b0JBQUUsa0JBQWU7b0JBQUUsc0JBQW1COztnQkFFbEUsV0FBVyxPQUFPLFVBQUMsc0JBQXNCLG1CQUFtQix1QkFBdUIsdUJBQTBCO29CQUN6RyxzQkFBc0I7b0JBQ3RCLHFCQUFxQjtvQkFDckIsa0JBQWtCO29CQUNsQixPQUFPLFFBQVEsS0FBSyxzQkFBc0IsMEJBQTBCOzs7Z0JBR3hFLFNBQVMsZUFBZSxZQUFNO29CQUMxQixHQUFHLHdDQUF3QyxZQUFNO3dCQUM3QyxLQUFLLDJCQUEyQixDQUFDLFNBQVM7O3dCQUUxQyxJQUFJLFVBQVUsSUFBSSxtQkFBbUI7d0JBQ3JDLE9BQU8sUUFBUSxZQUFZLFFBQVEsS0FBSzt3QkFDeEMsT0FBTyxRQUFRLGlDQUFpQyxRQUFRLEtBQUs7d0JBQzdELE9BQU8sUUFBUSxtQkFBbUIsUUFBUSxJQUFJLGdCQUFnQixLQUFLO3dCQUNuRSxPQUFPLFFBQVEsVUFBVSxRQUFRLEtBQUs7d0JBQ3RDLE9BQU8sUUFBUSxvQkFBb0IsUUFBUSxDQUFDLElBQUksb0JBQW9CLEtBQUssbUJBQW1CO3dCQUM1RixPQUFPLFFBQVEsbUJBQW1CLFFBQVEsS0FBSzt3QkFDL0MsT0FBTyxRQUFRLDBCQUEwQixRQUFRLEtBQUs7OztvQkFHMUQsR0FBRyw2QkFBNkIsWUFBTTt3QkFDbEMsT0FBTyxZQUFNOzRCQUFFLElBQUk7MkJBQXlCOzs7O2dCQUlwRCxTQUFTLHlCQUF5QixZQUFNO29CQUNwQyxHQUFHLDJDQUEyQyxZQUFNO3dCQUNoRCxJQUFJLFVBQVUsSUFBSSxtQkFBbUI7NEJBQ2pDLG1CQUFtQixtQkFBbUIsa0JBQWtCOzt3QkFFNUQsT0FBTyxRQUFRLHVCQUF1QixRQUFROzs7b0JBR2xELEdBQUcsc0NBQXNDLFlBQU07d0JBQzNDLElBQUksVUFBVSxJQUFJLG1CQUFtQjs0QkFDakMsbUJBQW1CLG1CQUFtQixrQkFBa0I7O3dCQUU1RCxPQUFPLFFBQVEsdUJBQXVCLFFBQVE7d0JBQzlDLFFBQVEsb0JBQW9CLG1CQUFtQixrQkFBa0I7d0JBQ2pFLE9BQU8sUUFBUSx1QkFBdUIsUUFBUTs7OztnQkFJdEQsU0FBUyxrQkFBa0IsWUFBTTtvQkFDN0IsR0FBRywyQ0FBMkMsWUFBTTt3QkFDaEQsSUFBSSxVQUFVLElBQUksbUJBQW1CO3dCQUNyQyxPQUFPLFFBQVE7d0JBQ2YsT0FBTyxRQUFRLGdCQUFnQixRQUFROzs7b0JBRzNDLEdBQUcsaURBQWlELFlBQU07d0JBQ3RELElBQUksVUFBVSxJQUFJLG1CQUFtQjt3QkFDckMsT0FBTyxRQUFRLGdCQUFnQixRQUFROzs7O2dCQUkvQyxTQUFTLGdDQUFnQyxZQUFNO29CQUMzQyxHQUFHLDJDQUEyQyxZQUFNO3dCQUNoRCxJQUFJLFVBQVUsSUFBSSxtQkFBbUI7d0JBQ3JDLE9BQU8sUUFBUTt3QkFDZixNQUFNLFNBQVMsdUJBQXVCLElBQUksWUFBWTt3QkFDdEQsT0FBTyxRQUFRLDhCQUE4QixRQUFROzs7b0JBR3pELEdBQUcsMEVBQTBFLFlBQU07d0JBQy9FLElBQUksVUFBVSxJQUFJLG1CQUFtQjt3QkFDckMsUUFBUSxrQ0FBa0M7d0JBQzFDLE9BQU8sUUFBUSw4QkFBOEIsUUFBUTs7O29CQUd6RCxHQUFHLGlEQUFpRCxZQUFNO3dCQUN0RCxJQUFJLFVBQVUsSUFBSSxtQkFBbUI7d0JBQ3JDLE9BQU8sUUFBUTt3QkFDZixPQUFPLFFBQVEsOEJBQThCLFFBQVE7OztvQkFHekQsR0FBRyxxRUFBcUUsWUFBTTt3QkFDMUUsSUFBSSxVQUFVLElBQUksbUJBQW1CO3dCQUNyQyxPQUFPLFFBQVEsOEJBQThCLFFBQVE7Ozs7Z0JBSTdELFNBQVMsOEJBQThCLFlBQU07b0JBQ3pDLEdBQUcseURBQXlELFlBQU07d0JBQzlELElBQUksVUFBVSxJQUFJLG1CQUFtQjt3QkFDckMsUUFBUSwyQkFBMkIsQ0FBQyxLQUFLO3dCQUN6QyxPQUFPLFFBQVEsNEJBQTRCLFFBQVE7OztvQkFHdkQsR0FBRyxvRUFBb0UsWUFBTTt3QkFDekUsSUFBSSxVQUFVLElBQUksbUJBQW1CO3dCQUNyQyxRQUFRLDJCQUEyQjt3QkFDbkMsT0FBTyxRQUFRLDRCQUE0QixRQUFRO3dCQUNuRCxRQUFRLDJCQUEyQjt3QkFDbkMsT0FBTyxRQUFRLDRCQUE0QixRQUFROzs7O2dCQUkzRCxTQUFTLHFCQUFxQixZQUFNO29CQUNoQyxHQUFHLDJCQUEyQixZQUFNO3dCQUNoQyxPQUFPLG1CQUFtQixtQkFBbUI7d0JBQzdDLE9BQU8sUUFBUSxTQUFTLG1CQUFtQixvQkFBb0IsUUFBUTs7Ozs7O0dBaUJoRiIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL21vZGVsL1JlbWVkaWF0aW9uU3VtbWFyeVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAnLi4vQ2VydGlmaWNhdGlvblRlc3REYXRhJztcblxuZGVzY3JpYmUoJ1JlbWVkaWF0aW9uU3VtbWFyeScsIGZ1bmN0aW9uKCkge1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xuXG4gICAgbGV0IGRhdGEsIFJlbWVkaWF0aW9uU3VtbWFyeSwgSWRlbnRpdHlTdW1tYXJ5LCBSZW1lZGlhdGlvbkxpbmVJdGVtO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9SZW1lZGlhdGlvblN1bW1hcnlfLCBfSWRlbnRpdHlTdW1tYXJ5XywgX1JlbWVkaWF0aW9uTGluZUl0ZW1fLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEpID0+IHtcbiAgICAgICAgUmVtZWRpYXRpb25MaW5lSXRlbSA9IF9SZW1lZGlhdGlvbkxpbmVJdGVtXztcbiAgICAgICAgUmVtZWRpYXRpb25TdW1tYXJ5ID0gX1JlbWVkaWF0aW9uU3VtbWFyeV87XG4gICAgICAgIElkZW50aXR5U3VtbWFyeSA9IF9JZGVudGl0eVN1bW1hcnlfO1xuICAgICAgICBkYXRhID0gYW5ndWxhci5jb3B5KGNlcnRpZmljYXRpb25UZXN0RGF0YS5SRU1FRElBVElPTl9BRFZJQ0VfUkVTVUxULnN1bW1hcnkpO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggcHJvdmlkZWQgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGRhdGEucmVxdWlyZWRPclBlcm1pdHRlZFJvbGVzID0gWydyb2xlMScsICdyb2xlMiddO1xuXG4gICAgICAgICAgICBsZXQgc3VtbWFyeSA9IG5ldyBSZW1lZGlhdGlvblN1bW1hcnkoZGF0YSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5jZXJ0SXRlbUlkKS50b0VxdWFsKGRhdGEuaWQpO1xuICAgICAgICAgICAgZXhwZWN0KHN1bW1hcnkuZW5hYmxlT3ZlcnJpZGVEZWZhdWx0UmVtZWRpYXRvcikudG9FcXVhbChkYXRhLmVuYWJsZU92ZXJyaWRlRGVmYXVsdFJlbWVkaWF0b3IpO1xuICAgICAgICAgICAgZXhwZWN0KHN1bW1hcnkuZGVmYXVsdFJlbWVkaWF0b3IpLnRvRXF1YWwobmV3IElkZW50aXR5U3VtbWFyeShkYXRhLmRlZmF1bHRSZW1lZGlhdG9yKSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5jb21tZW50cykudG9FcXVhbChkYXRhLmNvbW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdChzdW1tYXJ5LnJlbWVkaWF0aW9uRGV0YWlscykudG9FcXVhbChbbmV3IFJlbWVkaWF0aW9uTGluZUl0ZW0oZGF0YS5yZW1lZGlhdGlvbkRldGFpbHNbMF0pXSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5yZW1lZGlhdGlvbkFjdGlvbikudG9FcXVhbChkYXRhLnJlbWVkaWF0aW9uQWN0aW9uKTtcbiAgICAgICAgICAgIGV4cGVjdChzdW1tYXJ5LnJlcXVpcmVkT3JQZXJtaXR0ZWRSb2xlcykudG9FcXVhbChkYXRhLnJlcXVpcmVkT3JQZXJtaXR0ZWRSb2xlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2l0aCBubyBkYXRhJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IHsgbmV3IFJlbWVkaWF0aW9uU3VtbWFyeSgpOyB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzTWFudWFsUmVtZWRpYXRpb24oKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbm90IG1hbnVhbCByZW1lZGlhdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdW1tYXJ5ID0gbmV3IFJlbWVkaWF0aW9uU3VtbWFyeSh7XG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BY3Rpb246IFJlbWVkaWF0aW9uU3VtbWFyeS5SZW1lZGlhdGlvbkFjdGlvbi5TZW5kUHJvdmlzaW9uUmVxdWVzdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5pc01hbnVhbFJlbWVkaWF0aW9uKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIG1hbnVhbCByZW1lZGlhdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdW1tYXJ5ID0gbmV3IFJlbWVkaWF0aW9uU3VtbWFyeSh7XG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BY3Rpb246IFJlbWVkaWF0aW9uU3VtbWFyeS5SZW1lZGlhdGlvbkFjdGlvbi5PcGVuV29ya0l0ZW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KHN1bW1hcnkuaXNNYW51YWxSZW1lZGlhdGlvbigpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgc3VtbWFyeS5yZW1lZGlhdGlvbkFjdGlvbiA9IFJlbWVkaWF0aW9uU3VtbWFyeS5SZW1lZGlhdGlvbkFjdGlvbi5PcGVuVGlja2V0O1xuICAgICAgICAgICAgZXhwZWN0KHN1bW1hcnkuaXNNYW51YWxSZW1lZGlhdGlvbigpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc01vZGlmaWFibGUoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbm8gcmVtZWRpYXRpb24gZGV0YWlscycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdW1tYXJ5ID0gbmV3IFJlbWVkaWF0aW9uU3VtbWFyeShkYXRhKTtcbiAgICAgICAgICAgIGRlbGV0ZSBzdW1tYXJ5LnJlbWVkaWF0aW9uRGV0YWlscztcbiAgICAgICAgICAgIGV4cGVjdChzdW1tYXJ5LmlzTW9kaWZpYWJsZSgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgcmVtZWRpYXRpb24gZGV0YWlscycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdW1tYXJ5ID0gbmV3IFJlbWVkaWF0aW9uU3VtbWFyeShkYXRhKTtcbiAgICAgICAgICAgIGV4cGVjdChzdW1tYXJ5LmlzTW9kaWZpYWJsZSgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdyZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbigpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBub3QgbWFudWFsIHJlbWVkaWF0aW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN1bW1hcnkgPSBuZXcgUmVtZWRpYXRpb25TdW1tYXJ5KGRhdGEpO1xuICAgICAgICAgICAgZGVsZXRlIHN1bW1hcnkuZGVmYXVsdFJlbWVkaWF0b3I7XG4gICAgICAgICAgICBzcHlPbihzdW1tYXJ5LCAnaXNNYW51YWxSZW1lZGlhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5yZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbigpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgZGVmYXVsdCBSZW1lZGlhdG9yIGlzIHNldCBhbmQgb3ZlcnJpZGUgaXMgbm90IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3VtbWFyeSA9IG5ldyBSZW1lZGlhdGlvblN1bW1hcnkoZGF0YSk7XG4gICAgICAgICAgICBzdW1tYXJ5LmVuYWJsZU92ZXJyaWRlRGVmYXVsdFJlbWVkaWF0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChzdW1tYXJ5LnJlcXVpcmVzUmVjaXBpZW50U2VsZWN0aW9uKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGRlZmF1bHQgcmVtZWRpYXRvciBpcyBub3Qgc2V0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN1bW1hcnkgPSBuZXcgUmVtZWRpYXRpb25TdW1tYXJ5KGRhdGEpO1xuICAgICAgICAgICAgZGVsZXRlIHN1bW1hcnkuZGVmYXVsdFJlbWVkaWF0b3I7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5yZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbigpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGRlZmF1bHQgcmVtZWRpYXRvciBpcyBzZXQgYW5kIG92ZXJyaWRlIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3VtbWFyeSA9IG5ldyBSZW1lZGlhdGlvblN1bW1hcnkoZGF0YSk7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5yZXF1aXJlc1JlY2lwaWVudFNlbGVjdGlvbigpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdoYXNSb2xlUmV2b2NhdGlvbkRldGFpbHMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgcmVxdWlyZWQgb3IgcGVybWl0dGVkIHJvbGVzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN1bW1hcnkgPSBuZXcgUmVtZWRpYXRpb25TdW1tYXJ5KGRhdGEpO1xuICAgICAgICAgICAgc3VtbWFyeS5yZXF1aXJlZE9yUGVybWl0dGVkUm9sZXMgPSBbJ2EnLCAnYiddO1xuICAgICAgICAgICAgZXhwZWN0KHN1bW1hcnkuaGFzUm9sZVJldm9jYXRpb25EZXRhaWxzKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciB1bmRlZmluZWQgb3IgZW1wdHkgcmVxdWlyZWQgb3IgcGVybWl0dGVkIHJvbGVzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN1bW1hcnkgPSBuZXcgUmVtZWRpYXRpb25TdW1tYXJ5KGRhdGEpO1xuICAgICAgICAgICAgc3VtbWFyeS5yZXF1aXJlZE9yUGVybWl0dGVkUm9sZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3Qoc3VtbWFyeS5oYXNSb2xlUmV2b2NhdGlvbkRldGFpbHMoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBzdW1tYXJ5LnJlcXVpcmVkT3JQZXJtaXR0ZWRSb2xlcyA9IFtdO1xuICAgICAgICAgICAgZXhwZWN0KHN1bW1hcnkuaGFzUm9sZVJldm9jYXRpb25EZXRhaWxzKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdSZW1lZGlhdGlvbkFjdGlvbicsICgpID0+IHtcbiAgICAgICAgaXQoJ2lzIGRlZmluZWQgb24gdGhlIGNsYXNzJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KFJlbWVkaWF0aW9uU3VtbWFyeS5SZW1lZGlhdGlvbkFjdGlvbikudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmlzT2JqZWN0KFJlbWVkaWF0aW9uU3VtbWFyeS5SZW1lZGlhdGlvbkFjdGlvbikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
