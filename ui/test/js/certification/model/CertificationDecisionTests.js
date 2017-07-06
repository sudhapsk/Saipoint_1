System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationDecision', function () {

                beforeEach(module(certificationModule));

                var CertificationDecision = undefined,
                    CertificationItem = undefined,
                    certificationTestData = undefined,
                    CertificationActionStatus = undefined,
                    SelectionModel = undefined,
                    CertificationTableScope = undefined;

                function getStatus(status) {
                    return new CertificationActionStatus({
                        status: status
                    });
                }

                beforeEach(inject(function (_CertificationDecision_, _CertificationItem_, _certificationTestData_, _CertificationActionStatus_, _SelectionModel_, _CertificationTableScope_) {
                    CertificationDecision = _CertificationDecision_;
                    CertificationItem = _CertificationItem_;
                    certificationTestData = _certificationTestData_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    SelectionModel = _SelectionModel_;
                    CertificationTableScope = _CertificationTableScope_;
                }));

                describe('createItemDecision', function () {
                    it('should initialize with provided data', function () {
                        var certificationItem = {
                            id: '1234',
                            tableScope: {
                                statuses: ['A']
                            }
                        },
                            status = 'Approved',
                            comments = 'something something',
                            test = CertificationDecision.createItemDecision(certificationItem, getStatus(status), comments);

                        expect(test.certificationItem).toEqual(certificationItem);
                        expect(test.certificationItemId).toEqual(certificationItem.id);
                        expect(test.status).toEqual(status);
                        expect(test.comments).toEqual(comments);
                        expect(test.tableScope).toEqual(new CertificationTableScope(certificationItem.tableScope));
                    });

                    it('should throw with no certificationItem', function () {
                        expect(function () {
                            return CertificationDecision.createItemDecision(undefined, getStatus('Approved'));
                        }).toThrow();
                    });

                    it('should throw with no status', function () {
                        expect(function () {
                            return CertificationDecision.createItemDecision({ id: '1234' }, undefined);
                        }).toThrow();
                    });
                });

                describe('createBulkDecision', function () {
                    it('should initialize with provided data', function () {
                        var selectionModel = { some: 'fakeObject' },
                            status = 'Approved',
                            comments = 'something something',
                            bulkCount = 1,
                            tableScope = {
                            statuses: ['A', 'B']
                        },
                            test = CertificationDecision.createBulkDecision(selectionModel, tableScope, getStatus(status), bulkCount, comments);

                        expect(test.selectionModel).toEqual(selectionModel);
                        expect(test.status).toEqual(status);
                        expect(test.comments).toEqual(comments);
                        expect(test.tableScope).toEqual(new CertificationTableScope(tableScope));
                    });

                    it('should throw with no selectionModel', function () {
                        expect(function () {
                            return CertificationDecision.createBulkDecision(undefined, {}, getStatus('Approved'));
                        }).toThrow();
                    });

                    it('should throw with no status', function () {
                        expect(function () {
                            return CertificationDecision.createBulkDecision({}, {}, undefined);
                        }).toThrow();
                    });
                });

                describe('getUniqueId()', function () {
                    it('should return the certificationItemId', function () {
                        var decision = CertificationDecision.createItemDecision({ id: '1234' }, getStatus('Approved'));
                        expect(decision.getUniqueId()).toEqual(decision.certificationItemId);
                    });

                    it('should throw for a bulk decision', function () {
                        var decision = CertificationDecision.createBulkDecision({}, {}, getStatus('Approved'), null);
                        expect(function () {
                            return decision.getUniqueId();
                        }).toThrow();
                    });
                });

                describe('isBulk()', function () {
                    it('returns true for a bulk decision', function () {
                        var decision = CertificationDecision.createBulkDecision({}, {}, getStatus('Approved'), null);
                        expect(decision.isBulk()).toEqual(true);
                    });

                    it('returns false for an item decision', function () {
                        var decision = CertificationDecision.createItemDecision({ id: '1234' }, getStatus('Approved'));
                        expect(decision.isBulk()).toEqual(false);
                    });
                });

                describe('isSelectAll()', function () {
                    it('returns false for an item decision', function () {
                        var decision = CertificationDecision.createItemDecision({ id: '1234' }, getStatus('Approved'));
                        expect(decision.isSelectAll()).toEqual(false);
                    });

                    it('returns false for a select some bulk decision', function () {
                        var selections = new SelectionModel();
                        var decision = CertificationDecision.createBulkDecision(selections, {}, getStatus('Approved'));
                        expect(decision.isSelectAll()).toEqual(false);
                    });

                    it('returns true for a select all bulk decision', function () {
                        var selections = new SelectionModel();
                        selections.isInclude = false;
                        var decision = CertificationDecision.createBulkDecision(selections, {}, getStatus('Approved'));
                        expect(decision.isSelectAll()).toEqual(true);
                    });
                });

                describe('isDependent()', function () {
                    it('should return true if item matches the revoked role', function () {
                        var roleDecision = CertificationDecision.createItemDecision({
                            id: '1234',
                            entityId: certificationTestData.CERT_ITEMS[3].entityId
                        }, getStatus('Remediated'));
                        roleDecision.revokedRoles = ['role1'];
                        roleDecision.selectedViolationEntitlements = undefined;

                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[3]);
                        expect(roleDecision.isDependent(certItem)).toEqual(true);
                    });

                    it('should return true if item matches the revoked violation entitlement', function () {
                        var entitlementDecision = CertificationDecision.createItemDecision({
                            id: '1234',
                            entityId: certificationTestData.CERT_ITEMS[2].entityId
                        }, getStatus('Remediated'));
                        entitlementDecision.revokedRoles = undefined;
                        entitlementDecision.selectedViolationEntitlements = [{
                            application: 'app',
                            name: 'name',
                            value: 'value',
                            permission: false }];

                        var certificationItem = new CertificationItem(certificationTestData.CERT_ITEMS[2]);
                        expect(entitlementDecision.isDependent(certificationItem)).toEqual(true);
                    });

                    it('should return false if item entityIds do not match', function () {
                        var roleDecision = CertificationDecision.createItemDecision({
                            id: '1234',
                            entityId: 'someotherperson'
                        }, getStatus('Remediated'));
                        roleDecision.revokedRoles = ['role1'];
                        roleDecision.selectedViolationEntitlements = undefined;

                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[3]);
                        expect(roleDecision.isDependent(certItem)).toEqual(false);
                    });

                    it('should return false if bulk decision', function () {
                        var selectionModel = new SelectionModel(),
                            decision = CertificationDecision.createBulkDecision(selectionModel, {}, getStatus('Remediated'));

                        selectionModel.selectAll();
                        decision.revokedRoles = ['role1'];
                        var certItem = new CertificationItem(certificationTestData.CERT_ITEMS[3]);
                        expect(decision.isDependent(certItem)).toEqual(false);
                    });
                });

                describe('clone()', function () {
                    it('returns new deep copied object with selection model intact', function () {
                        var selections = new SelectionModel(),
                            tableScope = {
                            statues: ['A']
                        },
                            decision = CertificationDecision.createBulkDecision(selections, tableScope, getStatus('Approved')),
                            clonedDecision = undefined;

                        selections.add({
                            id: '1234'
                        });

                        // Just set some values so we can check if they are copied, do not worry about type.
                        decision.comments = 'comments';
                        decision.recipient = 'recipient';
                        decision.revokedRoles = 'revokedRoles';
                        decision.selectedViolationEntitlements = 'selectedViolationEntitlements';
                        decision.delegationReviewAction = 'Accept';
                        decision.challengeAction = 'Reject';
                        decision.oneStepChallenge = true;
                        decision.description = 'delegation description';
                        decision.mitigationExpirationDate = new Date();
                        decision.remediationDetails = [{ some: 'thing' }];

                        clonedDecision = decision.clone();
                        selections.clear();

                        expect(clonedDecision.selectionModel.size()).toEqual(1);
                        expect(clonedDecision.selectionModel.getSelectionIds()).toContain('1234');
                        expect(clonedDecision.status).toEqual(decision.status);
                        expect(clonedDecision.tableScope).toEqual(new CertificationTableScope(tableScope));

                        expect(clonedDecision.comments).toEqual(decision.comments);
                        expect(clonedDecision.recipient).toEqual(decision.recipient);
                        expect(clonedDecision.revokedRoles).toEqual(decision.revokedRoles);
                        expect(clonedDecision.selectedViolationEntitlements).toEqual(decision.selectedViolationEntitlements);
                        expect(clonedDecision.delegationReviewAction).toEqual(decision.delegationReviewAction);
                        expect(clonedDecision.challengeAction).toEqual(decision.challengeAction);
                        expect(clonedDecision.oneStepChallenge).toEqual(decision.oneStepChallenge);
                        expect(clonedDecision.description).toEqual(decision.description);
                        expect(clonedDecision.mitigationExpirationDate).toEqual(decision.mitigationExpirationDate);
                        expect(clonedDecision.created).toEqual(decision.created);
                        expect(clonedDecision.remediationDetails).toEqual(decision.remediationDetails);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvbkRlY2lzaW9uVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7OztJQUdqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7O1FBRTVELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyx5QkFBeUIsWUFBVzs7Z0JBRXpDLFdBQVcsT0FBTzs7Z0JBRWxCLElBQUksd0JBQXFCO29CQUFFLG9CQUFpQjtvQkFBRSx3QkFBcUI7b0JBQUUsNEJBQXlCO29CQUFFLGlCQUFjO29CQUMxRywwQkFBdUI7O2dCQUUzQixTQUFTLFVBQVUsUUFBUTtvQkFDdkIsT0FBTyxJQUFJLDBCQUEwQjt3QkFDakMsUUFBUTs7OztnQkFJaEIsV0FBVyxPQUFPLFVBQVMseUJBQXlCLHFCQUFxQix5QkFDOUMsNkJBQTZCLGtCQUFrQiwyQkFBMkI7b0JBQ2pHLHdCQUF3QjtvQkFDeEIsb0JBQW9CO29CQUNwQix3QkFBd0I7b0JBQ3hCLDRCQUE0QjtvQkFDNUIsaUJBQWlCO29CQUNqQiwwQkFBMEI7OztnQkFHOUIsU0FBUyxzQkFBc0IsWUFBVztvQkFDdEMsR0FBRyx3Q0FBd0MsWUFBVzt3QkFDbEQsSUFBSSxvQkFBb0I7NEJBQ2hCLElBQUk7NEJBQ0osWUFBWTtnQ0FDUixVQUFVLENBQUM7Ozs0QkFHbkIsU0FBUzs0QkFDVCxXQUFXOzRCQUNYLE9BQU8sc0JBQXNCLG1CQUFtQixtQkFBbUIsVUFBVSxTQUFTOzt3QkFFMUYsT0FBTyxLQUFLLG1CQUFtQixRQUFRO3dCQUN2QyxPQUFPLEtBQUsscUJBQXFCLFFBQVEsa0JBQWtCO3dCQUMzRCxPQUFPLEtBQUssUUFBUSxRQUFRO3dCQUM1QixPQUFPLEtBQUssVUFBVSxRQUFRO3dCQUM5QixPQUFPLEtB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UyxXQUFXO3dCQUNwQixTQUFTLFlBQVk7d0JBQ3JCLFNBQVMsZUFBZTt3QkFDeEIsU0FBUyxnQ0FBZ0M7d0JBQ3pDLFNBQVMseUJBQXlCO3dCQUNsQyxTQUFTLGtCQUFrQjt3QkFDM0IsU0FBUyxtQkFBbUI7d0JBQzVCLFNBQVMsY0FBYzt3QkFDdkIsU0FBUywyQkFBMkIsSUFBSTt3QkFDeEMsU0FBUyxxQkFBcUIsQ0FBRSxFQUFFLE1BQU07O3dCQUV4QyxpQkFBaUIsU0FBUzt3QkFDMUIsV0FBVzs7d0JBRVgsT0FBTyxlQUFlLGVBQWUsUUFBUSxRQUFRO3dCQUNyRCxPQUFPLGVBQWUsZUFBZSxtQkFBbUIsVUFBVTt3QkFDbEUsT0FBTyxlQUFlLFFBQVEsUUFBUSxTQUFTO3dCQUMvQyxPQUFPLGVBQWUsWUFBWSxRQUFRLElBQUksd0JBQXdCOzt3QkFFdEUsT0FBTyxlQUFlLFVBQVUsUUFBUSxTQUFTO3dCQUNqRCxPQUFPLGVBQWUsV0FBVyxRQUFRLFNBQVM7d0JBQ2xELE9BQU8sZUFBZSxjQUFjLFFBQVEsU0FBUzt3QkFDckQsT0FBTyxlQUFlLCtCQUErQixRQUFRLFNBQVM7d0JBQ3RFLE9BQU8sZUFBZSx3QkFBd0IsUUFBUSxTQUFTO3dCQUMvRCxPQUFPLGVBQWUsaUJBQWlCLFFBQVEsU0FBUzt3QkFDeEQsT0FBTyxlQUFlLGtCQUFrQixRQUFRLFNBQVM7d0JBQ3pELE9BQU8sZUFBZSxhQUFhLFFBQVEsU0FBUzt3QkFDcEQsT0FBTyxlQUFlLDBCQUEwQixRQUFRLFNBQVM7d0JBQ2pFLE9BQU8sZUFBZSxTQUFTLFFBQVEsU0FBUzt3QkFDaEQsT0FBTyxlQUFlLG9CQUFvQixRQUFRLFNBQVM7Ozs7OztHQXdCcEUiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9tb2RlbC9DZXJ0aWZpY2F0aW9uRGVjaXNpb25UZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5cbmRlc2NyaWJlKCdDZXJ0aWZpY2F0aW9uRGVjaXNpb24nLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGxldCBDZXJ0aWZpY2F0aW9uRGVjaXNpb24sIENlcnRpZmljYXRpb25JdGVtLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMsIFNlbGVjdGlvbk1vZGVsLFxuICAgICAgICBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZTtcblxuICAgIGZ1bmN0aW9uIGdldFN0YXR1cyhzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9DZXJ0aWZpY2F0aW9uRGVjaXNpb25fLCBfQ2VydGlmaWNhdGlvbkl0ZW1fLCBfY2VydGlmaWNhdGlvblRlc3REYXRhXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c18sIF9TZWxlY3Rpb25Nb2RlbF8sIF9DZXJ0aWZpY2F0aW9uVGFibGVTY29wZV8pIHtcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XG4gICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMgPSBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c187XG4gICAgICAgIFNlbGVjdGlvbk1vZGVsID0gX1NlbGVjdGlvbk1vZGVsXztcbiAgICAgICAgQ2VydGlmaWNhdGlvblRhYmxlU2NvcGUgPSBfQ2VydGlmaWNhdGlvblRhYmxlU2NvcGVfO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdjcmVhdGVJdGVtRGVjaXNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggcHJvdmlkZWQgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNlcnRpZmljYXRpb25JdGVtID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogJzEyMzQnLFxuICAgICAgICAgICAgICAgICAgICB0YWJsZVNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNlczogWydBJ11cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ0FwcHJvdmVkJyxcbiAgICAgICAgICAgICAgICBjb21tZW50cyA9ICdzb21ldGhpbmcgc29tZXRoaW5nJyxcbiAgICAgICAgICAgICAgICB0ZXN0ID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbihjZXJ0aWZpY2F0aW9uSXRlbSwgZ2V0U3RhdHVzKHN0YXR1cyksIGNvbW1lbnRzKTtcblxuICAgICAgICAgICAgZXhwZWN0KHRlc3QuY2VydGlmaWNhdGlvbkl0ZW0pLnRvRXF1YWwoY2VydGlmaWNhdGlvbkl0ZW0pO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuY2VydGlmaWNhdGlvbkl0ZW1JZCkudG9FcXVhbChjZXJ0aWZpY2F0aW9uSXRlbS5pZCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5zdGF0dXMpLnRvRXF1YWwoc3RhdHVzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmNvbW1lbnRzKS50b0VxdWFsKGNvbW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnRhYmxlU2NvcGUpLnRvRXF1YWwobmV3IENlcnRpZmljYXRpb25UYWJsZVNjb3BlKGNlcnRpZmljYXRpb25JdGVtLnRhYmxlU2NvcGUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG5vIGNlcnRpZmljYXRpb25JdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih1bmRlZmluZWQsIGdldFN0YXR1cygnQXBwcm92ZWQnKSkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG5vIHN0YXR1cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oe2lkOiAnMTIzNCd9LCB1bmRlZmluZWQpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NyZWF0ZUJ1bGtEZWNpc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwcm92aWRlZCBkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uTW9kZWwgPSB7IHNvbWU6ICdmYWtlT2JqZWN0JyB9LFxuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdBcHByb3ZlZCcsXG4gICAgICAgICAgICAgICAgY29tbWVudHMgPSAnc29tZXRoaW5nIHNvbWV0aGluZycsXG4gICAgICAgICAgICAgICAgYnVsa0NvdW50ID0gMSxcbiAgICAgICAgICAgICAgICB0YWJsZVNjb3BlID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNlczogWydBJywgJ0InXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVzdCA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9uTW9kZWwsIHRhYmxlU2NvcGUsIGdldFN0YXR1cyhzdGF0dXMpLFxuICAgICAgICAgICAgICAgICAgICBidWxrQ291bnQsIGNvbW1lbnRzKTtcblxuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc2VsZWN0aW9uTW9kZWwpLnRvRXF1YWwoc2VsZWN0aW9uTW9kZWwpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc3RhdHVzKS50b0VxdWFsKHN0YXR1cyk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5jb21tZW50cykudG9FcXVhbChjb21tZW50cyk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC50YWJsZVNjb3BlKS50b0VxdWFsKG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSh0YWJsZVNjb3BlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2l0aCBubyBzZWxlY3Rpb25Nb2RlbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24odW5kZWZpbmVkLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSlcbiAgICAgICAgICAgICAgICAudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdpdGggbm8gc3RhdHVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbih7fSwge30sIHVuZGVmaW5lZCkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0VW5pcXVlSWQoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY2VydGlmaWNhdGlvbkl0ZW1JZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7IGlkOiAnMTIzNCcgfSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5nZXRVbmlxdWVJZCgpKS50b0VxdWFsKGRlY2lzaW9uLmNlcnRpZmljYXRpb25JdGVtSWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGZvciBhIGJ1bGsgZGVjaXNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oe30sIHt9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIG51bGwpO1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGRlY2lzaW9uLmdldFVuaXF1ZUlkKCkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNCdWxrKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGEgYnVsayBkZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oe30sIHt9LCBnZXRTdGF0dXMoJ0FwcHJvdmVkJyksIG51bGwpO1xuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uLmlzQnVsaygpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gaXRlbSBkZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oeyBpZDogJzEyMzQnIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uaXNCdWxrKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc1NlbGVjdEFsbCgpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gaXRlbSBkZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oeyBpZDogJzEyMzQnIH0sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uaXNTZWxlY3RBbGwoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhIHNlbGVjdCBzb21lIGJ1bGsgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xuICAgICAgICAgICAgbGV0IGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3Rpb25zLCB7fSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbi5pc1NlbGVjdEFsbCgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYSBzZWxlY3QgYWxsIGJ1bGsgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xuICAgICAgICAgICAgc2VsZWN0aW9ucy5pc0luY2x1ZGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9ucywge30sIGdldFN0YXR1cygnQXBwcm92ZWQnKSk7XG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uaXNTZWxlY3RBbGwoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNEZXBlbmRlbnQoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGlmIGl0ZW0gbWF0Y2hlcyB0aGUgcmV2b2tlZCByb2xlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcm9sZURlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUl0ZW1EZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgaWQ6ICcxMjM0JyxcbiAgICAgICAgICAgICAgICBlbnRpdHlJZDogY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbM10uZW50aXR5SWRcbiAgICAgICAgICAgIH0sIGdldFN0YXR1cygnUmVtZWRpYXRlZCcpKTtcbiAgICAgICAgICAgIHJvbGVEZWNpc2lvbi5yZXZva2VkUm9sZXMgPSBbJ3JvbGUxJ107XG4gICAgICAgICAgICByb2xlRGVjaXNpb24uc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGxldCBjZXJ0SXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1szXSk7XG4gICAgICAgICAgICBleHBlY3Qocm9sZURlY2lzaW9uLmlzRGVwZW5kZW50KGNlcnRJdGVtKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBpdGVtIG1hdGNoZXMgdGhlIHJldm9rZWQgdmlvbGF0aW9uIGVudGl0bGVtZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZW50aXRsZW1lbnREZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oe1xuICAgICAgICAgICAgICAgIGlkOiAnMTIzNCcsXG4gICAgICAgICAgICAgICAgZW50aXR5SWQ6IGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUX0lURU1TWzJdLmVudGl0eUlkXG4gICAgICAgICAgICB9LCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSk7XG4gICAgICAgICAgICBlbnRpdGxlbWVudERlY2lzaW9uLnJldm9rZWRSb2xlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGVudGl0bGVtZW50RGVjaXNpb24uc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMgPSBbe1xuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYXBwJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogZmFsc2V9XTtcblxuICAgICAgICAgICAgbGV0IGNlcnRpZmljYXRpb25JdGVtID0gbmV3IENlcnRpZmljYXRpb25JdGVtKGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUX0lURU1TWzJdKTtcbiAgICAgICAgICAgIGV4cGVjdChlbnRpdGxlbWVudERlY2lzaW9uLmlzRGVwZW5kZW50KGNlcnRpZmljYXRpb25JdGVtKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgaWYgaXRlbSBlbnRpdHlJZHMgZG8gbm90IG1hdGNoJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJvbGVEZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVJdGVtRGVjaXNpb24oe1xuICAgICAgICAgICAgICAgIGlkOiAnMTIzNCcsXG4gICAgICAgICAgICAgICAgZW50aXR5SWQ6ICdzb21lb3RoZXJwZXJzb24nXG4gICAgICAgICAgICB9LCBnZXRTdGF0dXMoJ1JlbWVkaWF0ZWQnKSk7XG4gICAgICAgICAgICByb2xlRGVjaXNpb24ucmV2b2tlZFJvbGVzID0gWydyb2xlMSddO1xuICAgICAgICAgICAgcm9sZURlY2lzaW9uLnNlbGVjdGVkVmlvbGF0aW9uRW50aXRsZW1lbnRzID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBsZXQgY2VydEl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNbM10pO1xuICAgICAgICAgICAgZXhwZWN0KHJvbGVEZWNpc2lvbi5pc0RlcGVuZGVudChjZXJ0SXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBpZiBidWxrIGRlY2lzaW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsKCksXG4gICAgICAgICAgICAgICAgZGVjaXNpb24gPSBDZXJ0aWZpY2F0aW9uRGVjaXNpb24uY3JlYXRlQnVsa0RlY2lzaW9uKHNlbGVjdGlvbk1vZGVsLCB7fSwgZ2V0U3RhdHVzKCdSZW1lZGlhdGVkJykpO1xuXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbC5zZWxlY3RBbGwoKTtcbiAgICAgICAgICAgIGRlY2lzaW9uLnJldm9rZWRSb2xlcyA9IFsncm9sZTEnXTtcbiAgICAgICAgICAgIGxldCBjZXJ0SXRlbSA9IG5ldyBDZXJ0aWZpY2F0aW9uSXRlbShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1szXSk7XG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uaXNEZXBlbmRlbnQoY2VydEl0ZW0pKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY2xvbmUoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgbmV3IGRlZXAgY29waWVkIG9iamVjdCB3aXRoIHNlbGVjdGlvbiBtb2RlbCBpbnRhY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpLFxuICAgICAgICAgICAgICAgIHRhYmxlU2NvcGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1ZXM6IFsnQSddXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9ucywgdGFibGVTY29wZSwgZ2V0U3RhdHVzKCdBcHByb3ZlZCcpKSxcbiAgICAgICAgICAgICAgICBjbG9uZWREZWNpc2lvbjtcblxuICAgICAgICAgICAgc2VsZWN0aW9ucy5hZGQoe1xuICAgICAgICAgICAgICAgIGlkOiAnMTIzNCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBKdXN0IHNldCBzb21lIHZhbHVlcyBzbyB3ZSBjYW4gY2hlY2sgaWYgdGhleSBhcmUgY29waWVkLCBkbyBub3Qgd29ycnkgYWJvdXQgdHlwZS5cbiAgICAgICAgICAgIGRlY2lzaW9uLmNvbW1lbnRzID0gJ2NvbW1lbnRzJztcbiAgICAgICAgICAgIGRlY2lzaW9uLnJlY2lwaWVudCA9ICdyZWNpcGllbnQnO1xuICAgICAgICAgICAgZGVjaXNpb24ucmV2b2tlZFJvbGVzID0gJ3Jldm9rZWRSb2xlcyc7XG4gICAgICAgICAgICBkZWNpc2lvbi5zZWxlY3RlZFZpb2xhdGlvbkVudGl0bGVtZW50cyA9ICdzZWxlY3RlZFZpb2xhdGlvbkVudGl0bGVtZW50cyc7XG4gICAgICAgICAgICBkZWNpc2lvbi5kZWxlZ2F0aW9uUmV2aWV3QWN0aW9uID0gJ0FjY2VwdCc7XG4gICAgICAgICAgICBkZWNpc2lvbi5jaGFsbGVuZ2VBY3Rpb24gPSAnUmVqZWN0JztcbiAgICAgICAgICAgIGRlY2lzaW9uLm9uZVN0ZXBDaGFsbGVuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgZGVjaXNpb24uZGVzY3JpcHRpb24gPSAnZGVsZWdhdGlvbiBkZXNjcmlwdGlvbic7XG4gICAgICAgICAgICBkZWNpc2lvbi5taXRpZ2F0aW9uRXhwaXJhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgZGVjaXNpb24ucmVtZWRpYXRpb25EZXRhaWxzID0gWyB7IHNvbWU6ICd0aGluZyd9XTtcblxuICAgICAgICAgICAgY2xvbmVkRGVjaXNpb24gPSBkZWNpc2lvbi5jbG9uZSgpO1xuICAgICAgICAgICAgc2VsZWN0aW9ucy5jbGVhcigpO1xuXG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuc2l6ZSgpKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lZERlY2lzaW9uLnNlbGVjdGlvbk1vZGVsLmdldFNlbGVjdGlvbklkcygpKS50b0NvbnRhaW4oJzEyMzQnKTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZWREZWNpc2lvbi5zdGF0dXMpLnRvRXF1YWwoZGVjaXNpb24uc3RhdHVzKTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZWREZWNpc2lvbi50YWJsZVNjb3BlKS50b0VxdWFsKG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSh0YWJsZVNjb3BlKSk7XG5cbiAgICAgICAgICAgIGV4cGVjdChjbG9uZWREZWNpc2lvbi5jb21tZW50cykudG9FcXVhbChkZWNpc2lvbi5jb21tZW50cyk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24ucmVjaXBpZW50KS50b0VxdWFsKGRlY2lzaW9uLnJlY2lwaWVudCk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24ucmV2b2tlZFJvbGVzKS50b0VxdWFsKGRlY2lzaW9uLnJldm9rZWRSb2xlcyk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24uc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMpLnRvRXF1YWwoZGVjaXNpb24uc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lZERlY2lzaW9uLmRlbGVnYXRpb25SZXZpZXdBY3Rpb24pLnRvRXF1YWwoZGVjaXNpb24uZGVsZWdhdGlvblJldmlld0FjdGlvbik7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24uY2hhbGxlbmdlQWN0aW9uKS50b0VxdWFsKGRlY2lzaW9uLmNoYWxsZW5nZUFjdGlvbik7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24ub25lU3RlcENoYWxsZW5nZSkudG9FcXVhbChkZWNpc2lvbi5vbmVTdGVwQ2hhbGxlbmdlKTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZWREZWNpc2lvbi5kZXNjcmlwdGlvbikudG9FcXVhbChkZWNpc2lvbi5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24ubWl0aWdhdGlvbkV4cGlyYXRpb25EYXRlKS50b0VxdWFsKGRlY2lzaW9uLm1pdGlnYXRpb25FeHBpcmF0aW9uRGF0ZSk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmVkRGVjaXNpb24uY3JlYXRlZCkudG9FcXVhbChkZWNpc2lvbi5jcmVhdGVkKTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZWREZWNpc2lvbi5yZW1lZGlhdGlvbkRldGFpbHMpLnRvRXF1YWwoZGVjaXNpb24ucmVtZWRpYXRpb25EZXRhaWxzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
