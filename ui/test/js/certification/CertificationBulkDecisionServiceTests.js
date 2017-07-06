System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationBulkDecisionService', function () {

                var CertificationActionStatus = undefined,
                    certificationBulkDecisionService = undefined,
                    certificationDataService = undefined,
                    commentService = undefined,
                    $rootScope = undefined,
                    $q = undefined,
                    selections = undefined,
                    filters = undefined,
                    config = undefined,
                    allowConfig = undefined,
                    requireComments = undefined,
                    FilterValue = undefined,
                    table = undefined,
                    spModal = undefined,
                    certificationDialogService = undefined,
                    CertificationDecision = undefined,
                    certificationService = undefined;

                beforeEach(module(certificationModule));

                /* jshint maxparams:15 */
                beforeEach(inject(function (_certificationBulkDecisionService_, _certificationDataService_, _$rootScope_, _$q_, _spModal_, _CertificationActionStatus_, _CertificationDecision_, _commentService_, SelectionModel, _FilterValue_, Certification, certificationTestData, _certificationDialogService_, _certificationService_, CertificationTableScope) {
                    certificationBulkDecisionService = _certificationBulkDecisionService_;
                    certificationDataService = _certificationDataService_;
                    CertificationActionStatus = _CertificationActionStatus_;
                    CertificationDecision = _CertificationDecision_;
                    commentService = _commentService_;
                    certificationService = _certificationService_;
                    certificationDialogService = _certificationDialogService_;
                    $rootScope = _$rootScope_;
                    $q = _$q_;
                    FilterValue = _FilterValue_;
                    spModal = _spModal_;

                    // Create a selection model and filters to test with.
                    selections = new SelectionModel();
                    selections.add({ id: '1' });
                    filters = {
                        que: {
                            value: 'pasta'
                        }
                    };

                    // Prime the pump on the data service.
                    requireComments = false;
                    config = {
                        doesStatusRequireComment: jasmine.createSpy('doesStatusRequireComment').and.callFake(function () {
                            return requireComments;
                        })
                    };
                    certificationDataService.initializeConfiguration(config);
                    certificationDataService.initialize(new Certification(certificationTestData.CERTIFICATION_1));

                    allowConfig = {
                        allowExceptionPopup: undefined,
                        doesStatusRequireComment: function () {
                            return false;
                        }
                    };

                    spyOn(certificationDataService, 'getConfiguration').and.returnValue(allowConfig);

                    // Create a fake CertificationTable to test with.
                    table = {
                        tableScope: new CertificationTableScope({
                            statuses: ['Hi', 'Bye'],
                            excludedTypes: ['Something'],
                            includedTypes: ['Me'],
                            entity: {
                                id: 'You'
                            }
                        })
                    };
                }));

                function bulkDecide(status) {
                    var savedDecision = undefined;

                    certificationBulkDecisionService.bulkDecide(status, selections, filters, 1, table).then(function (decision) {
                        savedDecision = decision;
                    });
                    $rootScope.$digest();

                    return savedDecision;
                }

                function bulkEntityDecide(status) {
                    var savedDecision = undefined;

                    certificationBulkDecisionService.bulkEntityDecide(status, selections, 1).then(function (decision) {
                        savedDecision = decision;
                    });
                    $rootScope.$digest();

                    return savedDecision;
                }

                function checkDecision(decision, expectedStatus) {
                    expect(decision).toBeDefined();
                    expect(decision.status).toEqual(expectedStatus);

                    // Ensure that the selection model was cloned.
                    expect(decision.selectionModel).not.toBe(selections);

                    expect(decision.selectionModel.size()).toEqual(selections.size());
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = selections.getItems()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var item = _step.value;

                            expect(decision.selectionModel.hasItem(item)).toEqual(true);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                _iterator['return']();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    angular.forEach(filters, function (value, key) {
                        expect(decision.selectionModel.filterValues[key]).toEqual(value);
                    });
                }

                function setupComments(reject, comments) {
                    // Make the comment dialog show up.
                    requireComments = true;

                    // Mock the comment dialog to resolve or reject with a comment.
                    spyOn(commentService, 'openCommentDialog').and.callFake(function () {
                        if (reject) {
                            return $q.reject();
                        }
                        return $q.when(comments);
                    });
                }

                function setupAllowException(reject, comments, expireDate) {
                    var deferred = undefined;
                    spyOn(spModal, 'open').and.callFake(function () {
                        deferred = $q.defer();
                        if (reject) {
                            deferred.reject();
                        } else {
                            deferred.resolve({ comments: comments, mitigationExpirationDate: expireDate });
                        }
                        return {
                            result: deferred.promise
                        };
                    });
                }

                it('adds the filter values from the table scope', function () {
                    var tableScopeFilterValues = table.tableScope.getFilterValues();
                    spyOn(table.tableScope, 'getFilterValues').and.callThrough();
                    var saved = bulkDecide(CertificationActionStatus.Name.Approved);
                    expect(table.tableScope.getFilterValues).toHaveBeenCalled();
                    angular.forEach(tableScopeFilterValues, function (value, key) {
                        expect(saved.selectionModel.filterValues[key]).toEqual(value);
                    });
                });

                it('saves an approval when comments are not required', function () {
                    var saved = bulkDecide(CertificationActionStatus.Name.Approved);
                    checkDecision(saved, CertificationActionStatus.Name.Approved);
                });

                it('saves an approval with comments', function () {
                    var comments = 'hi mom!';
                    setupComments(false, comments);
                    var saved = bulkDecide(CertificationActionStatus.Name.Approved);
                    checkDecision(saved, CertificationActionStatus.Name.Approved);
                    expect(saved.comments).toEqual(comments);
                });

                it('does not save an approval with comments if cancelled', function () {
                    setupComments(true);
                    var saved = bulkDecide(CertificationActionStatus.Name.Approved);
                    expect(saved).toBeUndefined();
                });

                it('saves an allow with comments and expiration date', function () {
                    allowConfig.allowExceptionPopup = true;
                    var comments = 'boooring',
                        date = new Date();
                    setupAllowException(false, comments, date);
                    var saved = bulkDecide(CertificationActionStatus.Name.Mitigated);
                    checkDecision(saved, CertificationActionStatus.Name.Mitigated);
                    expect(saved.comments).toEqual(comments);
                    expect(saved.mitigationExpirationDate).toEqual(date);
                });

                it('does not save if dialog is cancelled.', function () {
                    allowConfig.allowExceptionPopup = true;
                    var comments = 'boooring',
                        date = new Date();
                    setupAllowException(true, comments, date);
                    var saved = bulkDecide(CertificationActionStatus.Name.Mitigated);
                    expect(saved).toBeUndefined();
                });

                it('isReassign returns true if status is reassign action', function () {
                    expect(certificationBulkDecisionService.isReassign(CertificationActionStatus.ReassignAction)).toBe(true);
                });

                it('isDelegation returns true if status is delegated action', function () {
                    expect(certificationBulkDecisionService.isDelegation(CertificationActionStatus.Name.Delegated)).toBe(true);
                });

                describe('isAllowWithDate()', function () {
                    it('is not required when allowExceptionPopup is false', function () {
                        allowConfig.allowExceptionPopup = false;
                        var val = certificationBulkDecisionService.isAllowException(CertificationActionStatus.Name.Mitigated);
                        expect(val).toEqual(false);
                    });

                    it('is required when allowExceptionPopup is true and status is Mitigated', function () {
                        allowConfig.allowExceptionPopup = true;
                        var val = certificationBulkDecisionService.isAllowException(CertificationActionStatus.Name.Mitigated);
                        expect(val).toEqual(true);
                    });

                    it('is not required when decision status is not Mitigated', function () {
                        allowConfig.allowExceptionPopup = true;
                        var val = certificationBulkDecisionService.isAllowException(CertificationActionStatus.Name.Remediated);
                        expect(val).toEqual(false);
                    });

                    it('is required when status is Mitigated, popup is false, and comments are required', function () {
                        allowConfig.allowExceptionPopup = false;
                        requireComments = true;
                        var val = certificationBulkDecisionService.isAllowException(CertificationActionStatus.Name.Mitigated);
                        expect(val).toEqual(true);
                    });

                    it('is not required when status is Mitigated, popup is false, and comments are not required', function () {
                        allowConfig.allowExceptionPopup = false;
                        requireComments = false;
                        var val = certificationBulkDecisionService.isAllowException(CertificationActionStatus.Name.Mitigated);
                        expect(val).toEqual(false);
                    });
                });

                describe('reassign bulkDecide', function () {
                    it('shows reassign dialog', function () {
                        spyOn(certificationDialogService, 'showCertificationReassignDialog').and.callFake(function () {
                            var decision = CertificationDecision.createBulkDecision(selections, table.tableScope, { status: CertificationActionStatus.ReassignAction }, 1);
                            return $q.when(decision);
                        });

                        bulkDecide(CertificationActionStatus.ReassignAction);

                        expect(certificationDialogService.showCertificationReassignDialog).toHaveBeenCalled();
                    });
                });

                describe('reassign bulkEntityDecide', function () {
                    it('shows reassign dialog', function () {
                        spyOn(certificationDialogService, 'showCertificationEntityReassignDialog').and.callFake(function () {
                            var decision = CertificationDecision.createBulkDecision(selections, {}, { status: CertificationActionStatus.ReassignAction }, 1);
                            return $q.when(decision);
                        });

                        bulkEntityDecide(CertificationActionStatus.ReassignAction);

                        expect(certificationDialogService.showCertificationEntityReassignDialog).toHaveBeenCalled();
                    });
                });

                describe('delegate bulkEntityDecide', function () {
                    it('shows delegation dialog', function () {
                        spyOn(certificationDialogService, 'showCertificationEntityDelegationDialog').and.callFake(function () {
                            var decision = CertificationDecision.createBulkDecision(selections, {}, { status: CertificationActionStatus.Name.Delegated }, 1);
                            return $q.when(decision);
                        });

                        bulkEntityDecide(CertificationActionStatus.Name.Delegated);

                        expect(certificationDialogService.showCertificationEntityDelegationDialog).toHaveBeenCalled();
                    });
                });

                describe('revoke account confirmation', function () {
                    function testConfirmRevokeAccount(resolved, isDecisionSet) {
                        spyOn(certificationDialogService, 'confirmAccountDecisionChange').and.callFake(function () {
                            if (resolved) {
                                return $q.when();
                            } else {
                                return $q.reject();
                            }
                        });
                        var decision = bulkDecide(CertificationActionStatus.Name.Approved);
                        $rootScope.$apply();

                        // Make sure that the decision was not saved.
                        if (isDecisionSet) {
                            expect(decision).toBeDefined();
                        } else {
                            expect(decision).not.toBeDefined();
                        }
                    }

                    it('continues with adding decision if confirmed', function () {
                        testConfirmRevokeAccount(true, true);
                    });

                    it('does not add decision if canceled', function () {
                        testConfirmRevokeAccount(false, false);
                    });
                });

                // TODO: Add revoke account and forward tests once implemented.
                it('saves a revoke decision', function () {
                    var saved = bulkDecide(CertificationActionStatus.Name.Remediated);
                    checkDecision(saved, CertificationActionStatus.Name.Remediated);
                });

                it('saves an undo decision', function () {
                    var saved = bulkDecide(CertificationActionStatus.Name.Undo);
                    checkDecision(saved, CertificationActionStatus.Name.Undo);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0NBQXNDLFVBQVUsU0FBUztJQUNqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7O1FBRTVELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxvQ0FBb0MsWUFBTTs7Z0JBRS9DLElBQUksNEJBQXlCO29CQUFFLG1DQUFnQztvQkFBRSwyQkFBd0I7b0JBQUUsaUJBQWM7b0JBQ3JHLGFBQVU7b0JBQUUsS0FBRTtvQkFBRSxhQUFVO29CQUFFLFVBQU87b0JBQUUsU0FBTTtvQkFBRSxjQUFXO29CQUFFLGtCQUFlO29CQUFFLGNBQVc7b0JBQUUsUUFBSztvQkFBRSxVQUFPO29CQUN0Ryw2QkFBMEI7b0JBQUUsd0JBQXFCO29CQUFFLHVCQUFvQjs7Z0JBRTNFLFdBQVcsT0FBTzs7O2dCQUdsQixXQUFXLE9BQU8sVUFBQyxvQ0FBb0MsNEJBQTRCLGNBQWMsTUFBTSxXQUNwRiw2QkFBNkIseUJBQXlCLGtCQUFrQixnQkFDeEUsZUFBZSxlQUFlLHVCQUF1Qiw4QkFDckQsd0JBQXdCLHlCQUE0QjtvQkFDbkUsbUNBQW1DO29CQUNuQywyQkFBMkI7b0JBQzNCLDRCQUE0QjtvQkFDNUIsd0JBQXdCO29CQUN4QixpQkFBaUI7b0JBQ2pCLHVCQUF1QjtvQkFDdkIsNkJBQTZCO29CQUM3QixhQUFhO29CQUNiLEtBQUs7b0JBQ0wsY0FBYztvQkFDZCxVQUFVOzs7b0JBR1YsYUFBYSxJQUFJO29CQUNqQixXQUFXLElBQUksRUFBRSxJQUFJO29CQUNyQixVQUFVO3dCQUNOLEtBQUs7NEJBQ0QsT0FBTzs7Ozs7b0JBS2Ysa0JBQWtCO29CQUNsQixTQUFTO3dCQUNMLDBCQUEwQixRQUFRLFVB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c2lvblNlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0NlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlJywgKCkgPT4ge1xyXG5cclxuICAgIGxldCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLCBjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZSwgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCBjb21tZW50U2VydmljZSxcclxuICAgICAgICAkcm9vdFNjb3BlLCAkcSwgc2VsZWN0aW9ucywgZmlsdGVycywgY29uZmlnLCBhbGxvd0NvbmZpZywgcmVxdWlyZUNvbW1lbnRzLCBGaWx0ZXJWYWx1ZSwgdGFibGUsIHNwTW9kYWwsXHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsIENlcnRpZmljYXRpb25EZWNpc2lvbiwgY2VydGlmaWNhdGlvblNlcnZpY2U7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xyXG5cclxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6MTUgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2VfLCBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXywgXyRyb290U2NvcGVfLCBfJHFfLCBfc3BNb2RhbF8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfLCBfQ2VydGlmaWNhdGlvbkRlY2lzaW9uXywgX2NvbW1lbnRTZXJ2aWNlXywgU2VsZWN0aW9uTW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgX0ZpbHRlclZhbHVlXywgQ2VydGlmaWNhdGlvbiwgY2VydGlmaWNhdGlvblRlc3REYXRhLCBfY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2VfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIF9jZXJ0aWZpY2F0aW9uU2VydmljZV8sIENlcnRpZmljYXRpb25UYWJsZVNjb3BlKSA9PiB7XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2VfO1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfO1xyXG4gICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMgPSBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c187XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvbkRlY2lzaW9uID0gX0NlcnRpZmljYXRpb25EZWNpc2lvbl87XHJcbiAgICAgICAgY29tbWVudFNlcnZpY2UgPSBfY29tbWVudFNlcnZpY2VfO1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZV87XHJcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuICAgICAgICAkcSA9IF8kcV87XHJcbiAgICAgICAgRmlsdGVyVmFsdWUgPSBfRmlsdGVyVmFsdWVfO1xyXG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHNlbGVjdGlvbiBtb2RlbCBhbmQgZmlsdGVycyB0byB0ZXN0IHdpdGguXHJcbiAgICAgICAgc2VsZWN0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xyXG4gICAgICAgIHNlbGVjdGlvbnMuYWRkKHsgaWQ6ICcxJyB9KTtcclxuICAgICAgICBmaWx0ZXJzID0ge1xyXG4gICAgICAgICAgICBxdWU6IHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAncGFzdGEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBQcmltZSB0aGUgcHVtcCBvbiB0aGUgZGF0YSBzZXJ2aWNlLlxyXG4gICAgICAgIHJlcXVpcmVDb21tZW50cyA9IGZhbHNlO1xyXG4gICAgICAgIGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgZG9lc1N0YXR1c1JlcXVpcmVDb21tZW50OiBqYXNtaW5lLmNyZWF0ZVNweSgnZG9lc1N0YXR1c1JlcXVpcmVDb21tZW50JykuYW5kLmNhbGxGYWtlKCgpID0+IHJlcXVpcmVDb21tZW50cylcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplQ29uZmlndXJhdGlvbihjb25maWcpO1xyXG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5pbml0aWFsaXplKG5ldyBDZXJ0aWZpY2F0aW9uKGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUSUZJQ0FUSU9OXzEpKTtcclxuXHJcbiAgICAgICAgYWxsb3dDb25maWcgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RXhjZXB0aW9uUG9wdXA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgZG9lc1N0YXR1c1JlcXVpcmVDb21tZW50OiAoKSA9PiB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDb25maWd1cmF0aW9uJykuYW5kLnJldHVyblZhbHVlKGFsbG93Q29uZmlnKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgZmFrZSBDZXJ0aWZpY2F0aW9uVGFibGUgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIHRhYmxlID0ge1xyXG4gICAgICAgICAgICB0YWJsZVNjb3BlOiBuZXcgQ2VydGlmaWNhdGlvblRhYmxlU2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsnSGknLCAnQnllJ10sXHJcbiAgICAgICAgICAgICAgICBleGNsdWRlZFR5cGVzOiBbJ1NvbWV0aGluZyddLFxyXG4gICAgICAgICAgICAgICAgaW5jbHVkZWRUeXBlczogWydNZSddLFxyXG4gICAgICAgICAgICAgICAgZW50aXR5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdZb3UnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBidWxrRGVjaWRlKHN0YXR1cykge1xyXG4gICAgICAgIGxldCBzYXZlZERlY2lzaW9uO1xyXG5cclxuICAgICAgICBjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZS5idWxrRGVjaWRlKHN0YXR1cywgc2VsZWN0aW9ucywgZmlsdGVycywgMSwgdGFibGUpLnRoZW4oKGRlY2lzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHNhdmVkRGVjaXNpb24gPSBkZWNpc2lvbjtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNhdmVkRGVjaXNpb247XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVsa0VudGl0eURlY2lkZShzdGF0dXMpIHtcclxuICAgICAgICBsZXQgc2F2ZWREZWNpc2lvbjtcclxuXHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UuYnVsa0VudGl0eURlY2lkZShzdGF0dXMsIHNlbGVjdGlvbnMsIDEpLnRoZW4oKGRlY2lzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHNhdmVkRGVjaXNpb24gPSBkZWNpc2lvbjtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNhdmVkRGVjaXNpb247XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tEZWNpc2lvbihkZWNpc2lvbiwgZXhwZWN0ZWRTdGF0dXMpIHtcclxuICAgICAgICBleHBlY3QoZGVjaXNpb24pLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgZXhwZWN0KGRlY2lzaW9uLnN0YXR1cykudG9FcXVhbChleHBlY3RlZFN0YXR1cyk7XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBzZWxlY3Rpb24gbW9kZWwgd2FzIGNsb25lZC5cclxuICAgICAgICBleHBlY3QoZGVjaXNpb24uc2VsZWN0aW9uTW9kZWwpLm5vdC50b0JlKHNlbGVjdGlvbnMpO1xyXG5cclxuICAgICAgICBleHBlY3QoZGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuc2l6ZSgpKS50b0VxdWFsKHNlbGVjdGlvbnMuc2l6ZSgpKTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHNlbGVjdGlvbnMuZ2V0SXRlbXMoKSkge1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuaGFzSXRlbShpdGVtKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWx0ZXJzLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3QoZGVjaXNpb24uc2VsZWN0aW9uTW9kZWwuZmlsdGVyVmFsdWVzW2tleV0pLnRvRXF1YWwodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwQ29tbWVudHMocmVqZWN0LCBjb21tZW50cykge1xyXG4gICAgICAgIC8vIE1ha2UgdGhlIGNvbW1lbnQgZGlhbG9nIHNob3cgdXAuXHJcbiAgICAgICAgcmVxdWlyZUNvbW1lbnRzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gTW9jayB0aGUgY29tbWVudCBkaWFsb2cgdG8gcmVzb2x2ZSBvciByZWplY3Qgd2l0aCBhIGNvbW1lbnQuXHJcbiAgICAgICAgc3B5T24oY29tbWVudFNlcnZpY2UsICdvcGVuQ29tbWVudERpYWxvZycpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJHEud2hlbihjb21tZW50cyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXBBbGxvd0V4Y2VwdGlvbihyZWplY3QsIGNvbW1lbnRzLCBleHBpcmVEYXRlKSB7XHJcbiAgICAgICAgbGV0IGRlZmVycmVkO1xyXG4gICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBpZiAocmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe2NvbW1lbnRzOiBjb21tZW50cywgbWl0aWdhdGlvbkV4cGlyYXRpb25EYXRlOiBleHBpcmVEYXRlfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDogZGVmZXJyZWQucHJvbWlzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGl0KCdhZGRzIHRoZSBmaWx0ZXIgdmFsdWVzIGZyb20gdGhlIHRhYmxlIHNjb3BlJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCB0YWJsZVNjb3BlRmlsdGVyVmFsdWVzID0gdGFibGUudGFibGVTY29wZS5nZXRGaWx0ZXJWYWx1ZXMoKTtcclxuICAgICAgICBzcHlPbih0YWJsZS50YWJsZVNjb3BlLCAnZ2V0RmlsdGVyVmFsdWVzJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgbGV0IHNhdmVkID0gYnVsa0RlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xyXG4gICAgICAgIGV4cGVjdCh0YWJsZS50YWJsZVNjb3BlLmdldEZpbHRlclZhbHVlcykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0YWJsZVNjb3BlRmlsdGVyVmFsdWVzLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3Qoc2F2ZWQuc2VsZWN0aW9uTW9kZWwuZmlsdGVyVmFsdWVzW2tleV0pLnRvRXF1YWwodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NhdmVzIGFuIGFwcHJvdmFsIHdoZW4gY29tbWVudHMgYXJlIG5vdCByZXF1aXJlZCcsICgpID0+IHtcclxuICAgICAgICBsZXQgc2F2ZWQgPSBidWxrRGVjaWRlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCk7XHJcbiAgICAgICAgY2hlY2tEZWNpc2lvbihzYXZlZCwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkFwcHJvdmVkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzYXZlcyBhbiBhcHByb3ZhbCB3aXRoIGNvbW1lbnRzJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjb21tZW50cyA9ICdoaSBtb20hJztcclxuICAgICAgICBzZXR1cENvbW1lbnRzKGZhbHNlLCBjb21tZW50cyk7XHJcbiAgICAgICAgbGV0IHNhdmVkID0gYnVsa0RlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xyXG4gICAgICAgIGNoZWNrRGVjaXNpb24oc2F2ZWQsIENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCk7XHJcbiAgICAgICAgZXhwZWN0KHNhdmVkLmNvbW1lbnRzKS50b0VxdWFsKGNvbW1lbnRzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdkb2VzIG5vdCBzYXZlIGFuIGFwcHJvdmFsIHdpdGggY29tbWVudHMgaWYgY2FuY2VsbGVkJywgKCkgPT4ge1xyXG4gICAgICAgIHNldHVwQ29tbWVudHModHJ1ZSk7XHJcbiAgICAgICAgbGV0IHNhdmVkID0gYnVsa0RlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuQXBwcm92ZWQpO1xyXG4gICAgICAgIGV4cGVjdChzYXZlZCkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NhdmVzIGFuIGFsbG93IHdpdGggY29tbWVudHMgYW5kIGV4cGlyYXRpb24gZGF0ZScsICgpID0+IHtcclxuICAgICAgICBhbGxvd0NvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gdHJ1ZTtcclxuICAgICAgICBsZXQgY29tbWVudHMgPSAnYm9vb3JpbmcnLCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBzZXR1cEFsbG93RXhjZXB0aW9uKGZhbHNlLCBjb21tZW50cywgZGF0ZSk7XHJcbiAgICAgICAgbGV0IHNhdmVkID0gYnVsa0RlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcclxuICAgICAgICBjaGVja0RlY2lzaW9uKHNhdmVkLCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcclxuICAgICAgICBleHBlY3Qoc2F2ZWQuY29tbWVudHMpLnRvRXF1YWwoY29tbWVudHMpO1xyXG4gICAgICAgIGV4cGVjdChzYXZlZC5taXRpZ2F0aW9uRXhwaXJhdGlvbkRhdGUpLnRvRXF1YWwoZGF0ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnZG9lcyBub3Qgc2F2ZSBpZiBkaWFsb2cgaXMgY2FuY2VsbGVkLicsICgpID0+IHtcclxuICAgICAgICBhbGxvd0NvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gdHJ1ZTtcclxuICAgICAgICBsZXQgY29tbWVudHMgPSAnYm9vb3JpbmcnLCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBzZXR1cEFsbG93RXhjZXB0aW9uKHRydWUsIGNvbW1lbnRzLCBkYXRlKTtcclxuICAgICAgICBsZXQgc2F2ZWQgPSBidWxrRGVjaWRlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQpO1xyXG4gICAgICAgIGV4cGVjdChzYXZlZCkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzUmVhc3NpZ24gcmV0dXJucyB0cnVlIGlmIHN0YXR1cyBpcyByZWFzc2lnbiBhY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlLmlzUmVhc3NpZ24oQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5SZWFzc2lnbkFjdGlvbikpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXNEZWxlZ2F0aW9uIHJldHVybnMgdHJ1ZSBpZiBzdGF0dXMgaXMgZGVsZWdhdGVkIGFjdGlvbicsICgpID0+IHtcclxuICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UuaXNEZWxlZ2F0aW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzQWxsb3dXaXRoRGF0ZSgpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdpcyBub3QgcmVxdWlyZWQgd2hlbiBhbGxvd0V4Y2VwdGlvblBvcHVwIGlzIGZhbHNlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbGxvd0NvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCB2YWwgPSBjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZS5pc0FsbG93RXhjZXB0aW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQpO1xyXG4gICAgICAgICAgICBleHBlY3QodmFsKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIHJlcXVpcmVkIHdoZW4gYWxsb3dFeGNlcHRpb25Qb3B1cCBpcyB0cnVlIGFuZCBzdGF0dXMgaXMgTWl0aWdhdGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbGxvd0NvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGV0IHZhbCA9IGNlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlLmlzQWxsb3dFeGNlcHRpb24oQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLk1pdGlnYXRlZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh2YWwpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBub3QgcmVxdWlyZWQgd2hlbiBkZWNpc2lvbiBzdGF0dXMgaXMgbm90IE1pdGlnYXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgYWxsb3dDb25maWcuYWxsb3dFeGNlcHRpb25Qb3B1cCA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCB2YWwgPSBjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZS5pc0FsbG93RXhjZXB0aW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5SZW1lZGlhdGVkKTtcclxuICAgICAgICAgICAgZXhwZWN0KHZhbCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyByZXF1aXJlZCB3aGVuIHN0YXR1cyBpcyBNaXRpZ2F0ZWQsIHBvcHVwIGlzIGZhbHNlLCBhbmQgY29tbWVudHMgYXJlIHJlcXVpcmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbGxvd0NvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlcXVpcmVDb21tZW50cyA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCB2YWwgPSBjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZS5pc0FsbG93RXhjZXB0aW9uKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5NaXRpZ2F0ZWQpO1xyXG4gICAgICAgICAgICBleHBlY3QodmFsKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgbm90IHJlcXVpcmVkIHdoZW4gc3RhdHVzIGlzIE1pdGlnYXRlZCwgcG9wdXAgaXMgZmFsc2UsIGFuZCBjb21tZW50cyBhcmUgbm90IHJlcXVpcmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbGxvd0NvbmZpZy5hbGxvd0V4Y2VwdGlvblBvcHVwID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlcXVpcmVDb21tZW50cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UuaXNBbGxvd0V4Y2VwdGlvbihDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuTWl0aWdhdGVkKTtcclxuICAgICAgICAgICAgZXhwZWN0KHZhbCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncmVhc3NpZ24gYnVsa0RlY2lkZScsICgpID0+IHtcclxuICAgICAgICBpdCgnc2hvd3MgcmVhc3NpZ24gZGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZSwgJ3Nob3dDZXJ0aWZpY2F0aW9uUmVhc3NpZ25EaWFsb2cnKS5hbmQuY2FsbEZha2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRlY2lzaW9uID0gQ2VydGlmaWNhdGlvbkRlY2lzaW9uLmNyZWF0ZUJ1bGtEZWNpc2lvbihzZWxlY3Rpb25zLCB0YWJsZS50YWJsZVNjb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgc3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLlJlYXNzaWduQWN0aW9uIH0sIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oZGVjaXNpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJ1bGtEZWNpZGUoQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5SZWFzc2lnbkFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2Uuc2hvd0NlcnRpZmljYXRpb25SZWFzc2lnbkRpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3JlYXNzaWduIGJ1bGtFbnRpdHlEZWNpZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3Nob3dzIHJlYXNzaWduIGRpYWxvZycsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRpYWxvZ1NlcnZpY2UsICdzaG93Q2VydGlmaWNhdGlvbkVudGl0eVJlYXNzaWduRGlhbG9nJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9ucywge30sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBzdGF0dXM6IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuUmVhc3NpZ25BY3Rpb24gfSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihkZWNpc2lvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYnVsa0VudGl0eURlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLlJlYXNzaWduQWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkVudGl0eVJlYXNzaWduRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGVsZWdhdGUgYnVsa0VudGl0eURlY2lkZScsICgpID0+IHtcclxuICAgICAgICBpdCgnc2hvd3MgZGVsZWdhdGlvbiBkaWFsb2cnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnc2hvd0NlcnRpZmljYXRpb25FbnRpdHlEZWxlZ2F0aW9uRGlhbG9nJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkZWNpc2lvbiA9IENlcnRpZmljYXRpb25EZWNpc2lvbi5jcmVhdGVCdWxrRGVjaXNpb24oc2VsZWN0aW9ucywge30sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBzdGF0dXM6IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5EZWxlZ2F0ZWQgfSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihkZWNpc2lvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYnVsa0VudGl0eURlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGlhbG9nU2VydmljZS5zaG93Q2VydGlmaWNhdGlvbkVudGl0eURlbGVnYXRpb25EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdyZXZva2UgYWNjb3VudCBjb25maXJtYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdENvbmZpcm1SZXZva2VBY2NvdW50KHJlc29sdmVkLCBpc0RlY2lzaW9uU2V0KSB7XHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EaWFsb2dTZXJ2aWNlLCAnY29uZmlybUFjY291bnREZWNpc2lvbkNoYW5nZScpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb24gPSBidWxrRGVjaWRlKENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMuTmFtZS5BcHByb3ZlZCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZGVjaXNpb24gd2FzIG5vdCBzYXZlZC5cclxuICAgICAgICAgICAgaWYgKGlzRGVjaXNpb25TZXQpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChkZWNpc2lvbikubm90LnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdjb250aW51ZXMgd2l0aCBhZGRpbmcgZGVjaXNpb24gaWYgY29uZmlybWVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0Q29uZmlybVJldm9rZUFjY291bnQodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBhZGQgZGVjaXNpb24gaWYgY2FuY2VsZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RDb25maXJtUmV2b2tlQWNjb3VudChmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVE9ETzogQWRkIHJldm9rZSBhY2NvdW50IGFuZCBmb3J3YXJkIHRlc3RzIG9uY2UgaW1wbGVtZW50ZWQuXHJcbiAgICBpdCgnc2F2ZXMgYSByZXZva2UgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHNhdmVkID0gYnVsa0RlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuUmVtZWRpYXRlZCk7XHJcbiAgICAgICAgY2hlY2tEZWNpc2lvbihzYXZlZCwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlJlbWVkaWF0ZWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NhdmVzIGFuIHVuZG8gZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHNhdmVkID0gYnVsa0RlY2lkZShDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuVW5kbyk7XHJcbiAgICAgICAgY2hlY2tEZWNpc2lvbihzYXZlZCwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLlVuZG8pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
