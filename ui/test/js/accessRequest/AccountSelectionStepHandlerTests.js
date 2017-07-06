System.register(['test/js/TestInitializer', 'accessRequest/AccessRequestModule', 'test/js/TestModule', './AccessRequestTestData'], function (_export) {
    'use strict';

    var accessRequestModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_accessRequestAccessRequestModule) {
            accessRequestModule = _accessRequestAccessRequestModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_AccessRequestTestData) {}],
        execute: function () {

            /**
             * Tests for the AccountSelectionStepHandler.
             */
            describe('AccountSelectionStepHandler', function () {

                var permittedById = '1234',
                    assignmentId = 'lksdhf',
                    handler,
                    accessRequestItemsService,
                    AccountSelectionStepHandler,
                    accessRequestItem,
                    entitlementRequestItem,
                    accountSelections,
                    target,
                    uniqueAssignmentPromiseSpy,
                    testService,
                    $rootScope;

                beforeEach(module(testModule, accessRequestModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams:7 */
                beforeEach(inject(function (_AccountSelectionStepHandler_, AccessRequestItem, IdentityAccountSelection, _testService_, _accessRequestItemsService_, _$rootScope_, accessRequestTestData) {
                    AccountSelectionStepHandler = _AccountSelectionStepHandler_;
                    accessRequestItemsService = _accessRequestItemsService_;
                    testService = _testService_;
                    $rootScope = _$rootScope_;

                    accountSelections = [new IdentityAccountSelection(accessRequestTestData.IDENTITY_ACCT_SELECTION1), new IdentityAccountSelection(accessRequestTestData.IDENTITY_ACCT_SELECTION2)];

                    accessRequestItem = new AccessRequestItem(accessRequestTestData.ROLE);

                    entitlementRequestItem = new AccessRequestItem(accessRequestTestData.ENTITLEMENT);

                    target = accountSelections[0].getProvisioningTargets()[1];

                    // Mock the unique assignment check to pass or fail.
                    uniqueAssignmentPromiseSpy = testService.createPromiseSpy(false);
                    accessRequestItemsService.checkUniqueAssignment = uniqueAssignmentPromiseSpy;

                    // Create the StepHandler to test with.
                    handler = new AccountSelectionStepHandler(accessRequestItem, target, accountSelections, permittedById, assignmentId);
                }));

                describe('constructor', function () {
                    it('requires an accessRequestItem', function () {
                        expect(function () {
                            new AccountSelectionStepHandler(null, target, accountSelections, null, null);
                        }).toThrow();
                    });

                    it('requires a provisioningTarget', function () {
                        expect(function () {
                            new AccountSelectionStepHandler(accessRequestItem, null, accountSelections, null, null);
                        }).toThrow();
                    });

                    it('requires account selections provisioningTarget', function () {
                        expect(function () {
                            new AccountSelectionStepHandler(accessRequestItem, target, null, null, null);
                        }).toThrow();
                    });

                    it('initializes values correctly', function () {
                        expect(handler.accessRequestItem).toEqual(accessRequestItem);
                        expect(handler.provisioningTarget).toEqual(target);
                        expect(handler.accountSelection).toEqual(accountSelections[0]);
                        expect(handler.accountSelections).toEqual(accountSelections);
                        expect(handler.identityIdx).toEqual(0);
                        expect(handler.appIdx).toEqual(1);
                        expect(handler.permittedById).toEqual(permittedById);
                        expect(handler.assignmentId).toEqual(assignmentId);
                        expect(handler.nonUniqueAssignmentError).toEqual(false);
                    });
                });

                it('returns the correct total identities count', function () {
                    expect(handler.getTotalIdentities()).toEqual(2);
                });

                it('clears selections', function () {
                    var acct = target.getAccountInfos()[0];
                    spyOn(target, 'clear').and.callThrough();

                    handler.selectAccount(acct);
                    handler.clearSelection();
                    expect(target.clear).toHaveBeenCalled();
                });

                it('selects the correct account for a target', function () {
                    var acct = target.getAccountInfos()[0];
                    handler.selectAccount(acct);

                    expect(target.getSelectedAccount().equals(acct)).toBeTruthy();
                    expect(target.isCreateAccount()).toEqual(false);
                });

                it('returns true for isAccountSelected() on the correct account', function () {
                    var acct = target.getAccountInfos()[0],
                        acct2 = target.getAccountInfos()[1];
                    handler.selectAccount(acct);

                    expect(handler.isAccountSelected(acct)).toEqual(true);
                    expect(handler.isAccountSelected(acct2)).toEqual(false);
                });

                it('selects "create new account"', function () {
                    var acct = target.getAccountInfos()[0];

                    // First select an account so we can check that it gets cleared.
                    handler.selectAccount(acct);

                    handler.selectCreateAccount();

                    expect(target.getSelectedAccount()).toBeNull();
                    expect(target.isCreateAccount()).toEqual(true);
                });

                it('returns correct value for isCreateAccountSelected()', function () {
                    expect(handler.isCreateAccountSelected()).toEqual(false);
                    handler.selectCreateAccount();
                    expect(handler.isCreateAccountSelected()).toEqual(true);
                });

                describe('hasMoreTargetsOnCurrentIdentity()', function () {
                    it('returns true if not on the last app', function () {
                        var firstTarget = accountSelections[0].getProvisioningTargets()[0],
                            handler = new AccountSelectionStepHandler(accessRequestItem, firstTarget, accountSelections, permittedById, assignmentId);
                        expect(handler.hasMoreTargetsOnCurrentIdentity()).toEqual(true);
                    });

                    it('returns false if on the last app', function () {
                        expect(handler.hasMoreTargetsOnCurrentIdentity()).toEqual(false);
                    });
                });

                describe('validateUniqueAssignment()', function () {
                    function save() {
                        handler.save();
                        $rootScope.$digest();
                    }

                    it('does not check unique assignment if not a role', function () {
                        handler.accessRequestItem = entitlementRequestItem;
                        save();
                        expect(accessRequestItemsService.checkUniqueAssignment).not.toHaveBeenCalled();
                    });

                    it('does not check unique assignment if more targets exist', function () {
                        var firstTarget = accountSelections[0].getProvisioningTargets()[0];
                        handler = new AccountSelectionStepHandler(accessRequestItem, firstTarget, accountSelections, permittedById, assignmentId);
                        save();
                        expect(accessRequestItemsService.checkUniqueAssignment).not.toHaveBeenCalled();
                    });

                    it('checks unique assignment when on last target', function () {
                        var requestedItem;

                        save();
                        expect(accessRequestItemsService.checkUniqueAssignment).toHaveBeenCalled();

                        // Check that a requested item was passed with the expected data.
                        requestedItem = accessRequestItemsService.checkUniqueAssignment.calls.mostRecent().args[0];
                        expect(requestedItem.item).toEqual(handler.accessRequestItem);
                        expect(requestedItem.accountSelections[0]).toEqual(handler.accountSelections[0]);
                    });

                    it('should pass assignmentId if set', function () {
                        var requestedItem;

                        save();
                        expect(accessRequestItemsService.checkUniqueAssignment).toHaveBeenCalled();

                        // Check that a requested item was passed with the expected data.
                        requestedItem = accessRequestItemsService.checkUniqueAssignment.calls.mostRecent().args[0];
                        expect(requestedItem.assignmentId).toEqual(assignmentId);
                    });

                    it('should pass permitted by id to service', function () {
                        var requestedItem;

                        save();
                        expect(accessRequestItemsService.checkUniqueAssignment).toHaveBeenCalled();

                        requestedItem = accessRequestItemsService.checkUniqueAssignment.calls.mostRecent().args[0];
                        expect(requestedItem.permittedById).toEqual(permittedById);
                    });

                    it('sets error flag if unique assignment check fails', function () {
                        uniqueAssignmentPromiseSpy.makeReject(true);
                        save();
                        expect(handler.nonUniqueAssignmentError).toEqual(true);
                    });

                    it('resets error flag if unique assignment check passes', function () {
                        handler.nonUniqueAssignmentError = true;
                        uniqueAssignmentPromiseSpy.makeReject(false);
                        save();
                        expect(handler.nonUniqueAssignmentError).toEqual(false);
                    });

                    it('resets error flag if identity has more targets', function () {
                        var firstTarget = accountSelections[0].getProvisioningTargets()[0];
                        handler = new AccountSelectionStepHandler(accessRequestItem, firstTarget, accountSelections, permittedById, assignmentId);
                        handler.nonUniqueAssignmentError = true;
                        save();
                        expect(handler.nonUniqueAssignmentError).toEqual(false);
                    });
                });

                it('returns the correct title', function () {
                    expect(handler.getTitle()).toEqual('ui_acct_select_title');
                });

                it('returns the correct stepId', function () {
                    expect(handler.getStepId()).toEqual('accountSelection_0-1');
                });

                describe('isSaveDisabled()', function () {
                    it('returns true if nothing has been selected', function () {
                        expect(handler.isSaveDisabled()).toEqual(true);
                    });

                    it('returns false if an account has been selected', function () {
                        var acct = target.getAccountInfos()[0];
                        handler.selectAccount(acct);
                        expect(handler.isSaveDisabled()).toEqual(false);
                    });

                    it('returns false if create account has been selected', function () {
                        handler.selectCreateAccount();
                        expect(handler.isSaveDisabled()).toEqual(false);
                    });
                });

                describe('getSaveButtonLabel()', function () {
                    it('returns "Apply" if on last step', function () {
                        expect(handler.getSaveButtonLabel(true)).toEqual('ui_acct_select_apply');
                    });

                    it('returns "Next Identity" if on last app of an identity', function () {
                        expect(handler.getSaveButtonLabel(false)).toEqual('ui_acct_select_next_identity_button');
                    });

                    it('returns "Next App" if more apps exist on the identity', function () {
                        var firstTarget = accountSelections[0].getProvisioningTargets()[0],
                            handler = new AccountSelectionStepHandler(accessRequestItem, firstTarget, accountSelections, permittedById, assignmentId);
                        expect(handler.getSaveButtonLabel(false)).toEqual('ui_acct_select_next_app_button');
                    });
                });

                describe('save()', function () {
                    it('resolves with the provisioning target', function () {
                        var promise = handler.save(),
                            spy = testService.spyOnSuccess(promise);
                        $rootScope.$digest();
                        expect(spy).toHaveBeenCalledWith(target);
                    });

                    it('rejects if unique assignment check fails', function () {
                        var promise, spy;

                        // Set the unique check to reject.
                        uniqueAssignmentPromiseSpy.makeReject(true);

                        // Attempt to save.
                        promise = handler.save();
                        spy = testService.spyOnFailure(promise);
                        $rootScope.$digest();

                        // Make sure the modal stayed open.
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjb3VudFNlbGVjdGlvblN0ZXBIYW5kbGVyVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyxzQkFBc0IsNEJBQTRCLFVBQVUsU0FBUztJQUF0Sjs7SUFHSSxJQUFJLHFCQUFxQjtJQUN6QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjtXQUNoQyxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7Ozs7O1lBQTdCLFNBQVMsK0JBQStCLFlBQVc7O2dCQUUvQyxJQUFJLGdCQUFnQjtvQkFDaEIsZUFBZTtvQkFDZjtvQkFBUztvQkFBMkI7b0JBQ3BDO29CQUFtQjtvQkFDbkI7b0JBQW1CO29CQUFRO29CQUE0QjtvQkFBYTs7Z0JBRXhFLFdBQVcsT0FBTyxZQUFZOzs7Ozs7Z0JBTTlCLFdBQVcsT0FBTyxVQUFTLCtCQUErQixtQkFBbUIsMEJBQ2xELGVBQWUsNkJBQTZCLGNBQWMsdUJBQXVCO29CQUN4Ryw4QkFBOEI7b0JBQzlCLDRCQUE0QjtvQkFDNUIsY0FBYztvQkFDZCxhQUFhOztvQkFFYixvQkFBb0IsQ0FDaEIsSUFBSSx5QkFBeUIsc0JBQXNCLDJCQUNuRCxJQUFJLHlCQUF5QixzQkFBc0I7O29CQUd2RCxvQkFBb0IsSUFBSSxrQkFBa0Isc0JBQXNCOztvQkFFaEUseUJBQXlCLElBQUksa0JBQWtCLHNCQUFzQjs7b0JBRXJFLFNBQVMsa0JBQWtCLEdBQUcseUJBQXlCOzs7b0JBR3ZELDZCQUE2QixZQUFZLGlCQUFpQjtvQkFDMUQsMEJBQTBCLHdCQUF3Qjs7O29CQUdsRCxVQUFVLElBQUksNEJBQTRCLG1CQUFtQixRQUFRLG1CQUMzQixlQUFlOzs7Z0JBRzdELFNBQVMsZUFBZSxZQUFXO29CQUMvQixHQUFHLGlD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UTs7O2dCQUd4QyxTQUFTLG9CQUFvQixZQUFXO29CQUNwQyxHQUFHLDZDQUE2QyxZQUFXO3dCQUN2RCxPQUFPLFFBQVEsa0JBQWtCLFFBQVE7OztvQkFHN0MsR0FBRyxpREFBaUQsWUFBVzt3QkFDM0QsSUFBSSxPQUFPLE9BQU8sa0JBQWtCO3dCQUNwQyxRQUFRLGNBQWM7d0JBQ3RCLE9BQU8sUUFBUSxrQkFBa0IsUUFBUTs7O29CQUc3QyxHQUFHLHFEQUFxRCxZQUFXO3dCQUMvRCxRQUFRO3dCQUNSLE9BQU8sUUFBUSxrQkFBa0IsUUFBUTs7OztnQkFJakQsU0FBUyx3QkFBd0IsWUFBVztvQkFDeEMsR0FBRyxtQ0FBbUMsWUFBVzt3QkFDN0MsT0FBTyxRQUFRLG1CQUFtQixPQUFPLFFBQVE7OztvQkFHckQsR0FBRyx5REFBeUQsWUFBVzt3QkFDbkUsT0FBTyxRQUFRLG1CQUFtQixRQUFRLFFBQVE7OztvQkFHdEQsR0FBRyx5REFBeUQsWUFBVzt3QkFDbkUsSUFBSSxjQUFjLGtCQUFrQixHQUFHLHlCQUF5Qjs0QkFDNUQsVUFBVSxJQUFJLDRCQUE0QixtQkFBbUIsYUFBYSxtQkFDaEMsZUFBZTt3QkFDN0QsT0FBTyxRQUFRLG1CQUFtQixRQUFRLFFBQVE7Ozs7Z0JBSTFELFNBQVMsVUFBVSxZQUFXO29CQUMxQixHQUFHLHlDQUF5QyxZQUFXO3dCQUNuRCxJQUFJLFVBQVUsUUFBUTs0QkFDbEIsTUFBTSxZQUFZLGFBQWE7d0JBQ25DLFdBQVc7d0JBQ1gsT0FBTyxLQUFLLHFCQUFxQjs7O29CQUdyQyxHQUFHLDRDQUE0QyxZQUFXO3dCQUN0RCxJQUFJLFNBQVM7Ozt3QkFHYiwyQkFBMkIsV0FBVzs7O3dCQUd0QyxVQUFVLFFBQVE7d0JBQ2xCLE1BQU0sWUFBWSxhQUFhO3dCQUMvQixXQUFXOzs7d0JBR1gsT0FBTyxLQUFLOzs7Ozs7R0FTckIiLCJmaWxlIjoiYWNjZXNzUmVxdWVzdC9BY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXJUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgYWNjZXNzUmVxdWVzdE1vZHVsZSBmcm9tICdhY2Nlc3NSZXF1ZXN0L0FjY2Vzc1JlcXVlc3RNb2R1bGUnO1xyXG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xyXG5pbXBvcnQgJy4vQWNjZXNzUmVxdWVzdFRlc3REYXRhJztcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBmb3IgdGhlIEFjY291bnRTZWxlY3Rpb25TdGVwSGFuZGxlci5cclxuICovXHJcbmRlc2NyaWJlKCdBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXInLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgcGVybWl0dGVkQnlJZCA9ICcxMjM0JyxcclxuICAgICAgICBhc3NpZ25tZW50SWQgPSAnbGtzZGhmJyxcclxuICAgICAgICBoYW5kbGVyLCBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCBBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXIsXHJcbiAgICAgICAgYWNjZXNzUmVxdWVzdEl0ZW0sIGVudGl0bGVtZW50UmVxdWVzdEl0ZW0sXHJcbiAgICAgICAgYWNjb3VudFNlbGVjdGlvbnMsIHRhcmdldCwgdW5pcXVlQXNzaWdubWVudFByb21pc2VTcHksIHRlc3RTZXJ2aWNlLCAkcm9vdFNjb3BlO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUsIGFjY2Vzc1JlcXVlc3RNb2R1bGUpKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluamVjdCB0aGUgZGVwZW5kZW5jaWVzIGFuZCBzZXR1cCBtb2Nrcy5cclxuICAgICAqL1xyXG4gICAgLyoganNoaW50IG1heHBhcmFtczo3ICovXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfQWNjb3VudFNlbGVjdGlvblN0ZXBIYW5kbGVyXywgQWNjZXNzUmVxdWVzdEl0ZW0sIElkZW50aXR5QWNjb3VudFNlbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90ZXN0U2VydmljZV8sIF9hY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlXywgXyRyb290U2NvcGVfLCBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEpIHtcclxuICAgICAgICBBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXIgPSBfQWNjb3VudFNlbGVjdGlvblN0ZXBIYW5kbGVyXztcclxuICAgICAgICBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlID0gX2FjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2VfO1xyXG4gICAgICAgIHRlc3RTZXJ2aWNlID0gX3Rlc3RTZXJ2aWNlXztcclxuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xyXG5cclxuICAgICAgICBhY2NvdW50U2VsZWN0aW9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IElkZW50aXR5QWNjb3VudFNlbGVjdGlvbihhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFlfQUNDVF9TRUxFQ1RJT04xKSxcclxuICAgICAgICAgICAgbmV3IElkZW50aXR5QWNjb3VudFNlbGVjdGlvbihhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFlfQUNDVF9TRUxFQ1RJT04yKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RJdGVtID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5ST0xFKTtcclxuXHJcbiAgICAgICAgZW50aXRsZW1lbnRSZXF1ZXN0SXRlbSA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuRU5USVRMRU1FTlQpO1xyXG5cclxuICAgICAgICB0YXJnZXQgPSBhY2NvdW50U2VsZWN0aW9uc1swXS5nZXRQcm92aXNpb25pbmdUYXJnZXRzKClbMV07XHJcblxyXG4gICAgICAgIC8vIE1vY2sgdGhlIHVuaXF1ZSBhc3NpZ25tZW50IGNoZWNrIHRvIHBhc3Mgb3IgZmFpbC5cclxuICAgICAgICB1bmlxdWVBc3NpZ25tZW50UHJvbWlzZVNweSA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UpO1xyXG4gICAgICAgIGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UuY2hlY2tVbmlxdWVBc3NpZ25tZW50ID0gdW5pcXVlQXNzaWdubWVudFByb21pc2VTcHk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgU3RlcEhhbmRsZXIgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIGhhbmRsZXIgPSBuZXcgQWNjb3VudFNlbGVjdGlvblN0ZXBIYW5kbGVyKGFjY2Vzc1JlcXVlc3RJdGVtLCB0YXJnZXQsIGFjY291bnRTZWxlY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pdHRlZEJ5SWQsIGFzc2lnbm1lbnRJZCk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JlcXVpcmVzIGFuIGFjY2Vzc1JlcXVlc3RJdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG5ldyBBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXIobnVsbCwgdGFyZ2V0LCBhY2NvdW50U2VsZWN0aW9ucywgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlcXVpcmVzIGEgcHJvdmlzaW9uaW5nVGFyZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG5ldyBBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXIoYWNjZXNzUmVxdWVzdEl0ZW0sIG51bGwsIGFjY291bnRTZWxlY3Rpb25zLCBudWxsLCBudWxsKTtcclxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVxdWlyZXMgYWNjb3VudCBzZWxlY3Rpb25zIHByb3Zpc2lvbmluZ1RhcmdldCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBuZXcgQWNjb3VudFNlbGVjdGlvblN0ZXBIYW5kbGVyKGFjY2Vzc1JlcXVlc3RJdGVtLCB0YXJnZXQsIG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpbml0aWFsaXplcyB2YWx1ZXMgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmFjY2Vzc1JlcXVlc3RJdGVtKS50b0VxdWFsKGFjY2Vzc1JlcXVlc3RJdGVtKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIucHJvdmlzaW9uaW5nVGFyZ2V0KS50b0VxdWFsKHRhcmdldCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmFjY291bnRTZWxlY3Rpb24pLnRvRXF1YWwoYWNjb3VudFNlbGVjdGlvbnNbMF0pO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5hY2NvdW50U2VsZWN0aW9ucykudG9FcXVhbChhY2NvdW50U2VsZWN0aW9ucyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmlkZW50aXR5SWR4KS50b0VxdWFsKDApO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5hcHBJZHgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLnBlcm1pdHRlZEJ5SWQpLnRvRXF1YWwocGVybWl0dGVkQnlJZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmFzc2lnbm1lbnRJZCkudG9FcXVhbChhc3NpZ25tZW50SWQpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5ub25VbmlxdWVBc3NpZ25tZW50RXJyb3IpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIGNvcnJlY3QgdG90YWwgaWRlbnRpdGllcyBjb3VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmdldFRvdGFsSWRlbnRpdGllcygpKS50b0VxdWFsKDIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2NsZWFycyBzZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFjY3QgPSB0YXJnZXQuZ2V0QWNjb3VudEluZm9zKClbMF07XHJcbiAgICAgICAgc3B5T24odGFyZ2V0LCAnY2xlYXInKS5hbmQuY2FsbFRocm91Z2goKTtcclxuXHJcbiAgICAgICAgaGFuZGxlci5zZWxlY3RBY2NvdW50KGFjY3QpO1xyXG4gICAgICAgIGhhbmRsZXIuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICBleHBlY3QodGFyZ2V0LmNsZWFyKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2VsZWN0cyB0aGUgY29ycmVjdCBhY2NvdW50IGZvciBhIHRhcmdldCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhY2N0ID0gdGFyZ2V0LmdldEFjY291bnRJbmZvcygpWzBdO1xyXG4gICAgICAgIGhhbmRsZXIuc2VsZWN0QWNjb3VudChhY2N0KTtcclxuXHJcbiAgICAgICAgZXhwZWN0KHRhcmdldC5nZXRTZWxlY3RlZEFjY291bnQoKS5lcXVhbHMoYWNjdCkpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICBleHBlY3QodGFyZ2V0LmlzQ3JlYXRlQWNjb3VudCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGlzQWNjb3VudFNlbGVjdGVkKCkgb24gdGhlIGNvcnJlY3QgYWNjb3VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhY2N0ID0gdGFyZ2V0LmdldEFjY291bnRJbmZvcygpWzBdLFxyXG4gICAgICAgICAgICBhY2N0MiA9IHRhcmdldC5nZXRBY2NvdW50SW5mb3MoKVsxXTtcclxuICAgICAgICBoYW5kbGVyLnNlbGVjdEFjY291bnQoYWNjdCk7XHJcblxyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmlzQWNjb3VudFNlbGVjdGVkKGFjY3QpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmlzQWNjb3VudFNlbGVjdGVkKGFjY3QyKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2VsZWN0cyBcImNyZWF0ZSBuZXcgYWNjb3VudFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFjY3QgPSB0YXJnZXQuZ2V0QWNjb3VudEluZm9zKClbMF07XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IHNlbGVjdCBhbiBhY2NvdW50IHNvIHdlIGNhbiBjaGVjayB0aGF0IGl0IGdldHMgY2xlYXJlZC5cclxuICAgICAgICBoYW5kbGVyLnNlbGVjdEFjY291bnQoYWNjdCk7XHJcblxyXG4gICAgICAgIGhhbmRsZXIuc2VsZWN0Q3JlYXRlQWNjb3VudCgpO1xyXG5cclxuICAgICAgICBleHBlY3QodGFyZ2V0LmdldFNlbGVjdGVkQWNjb3VudCgpKS50b0JlTnVsbCgpO1xyXG4gICAgICAgIGV4cGVjdCh0YXJnZXQuaXNDcmVhdGVBY2NvdW50KCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyBjb3JyZWN0IHZhbHVlIGZvciBpc0NyZWF0ZUFjY291bnRTZWxlY3RlZCgpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuaXNDcmVhdGVBY2NvdW50U2VsZWN0ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgaGFuZGxlci5zZWxlY3RDcmVhdGVBY2NvdW50KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuaXNDcmVhdGVBY2NvdW50U2VsZWN0ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdoYXNNb3JlVGFyZ2V0c09uQ3VycmVudElkZW50aXR5KCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIG5vdCBvbiB0aGUgbGFzdCBhcHAnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGZpcnN0VGFyZ2V0ID0gYWNjb3VudFNlbGVjdGlvbnNbMF0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpWzBdLFxyXG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IG5ldyBBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXIoYWNjZXNzUmVxdWVzdEl0ZW0sIGZpcnN0VGFyZ2V0LCBhY2NvdW50U2VsZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pdHRlZEJ5SWQsIGFzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc01vcmVUYXJnZXRzT25DdXJyZW50SWRlbnRpdHkoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgb24gdGhlIGxhc3QgYXBwJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc01vcmVUYXJnZXRzT25DdXJyZW50SWRlbnRpdHkoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgndmFsaWRhdGVVbmlxdWVBc3NpZ25tZW50KCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBmdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVyLnNhdmUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgY2hlY2sgdW5pcXVlIGFzc2lnbm1lbnQgaWYgbm90IGEgcm9sZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVyLmFjY2Vzc1JlcXVlc3RJdGVtID0gZW50aXRsZW1lbnRSZXF1ZXN0SXRlbTtcclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5jaGVja1VuaXF1ZUFzc2lnbm1lbnQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBjaGVjayB1bmlxdWUgYXNzaWdubWVudCBpZiBtb3JlIHRhcmdldHMgZXhpc3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGZpcnN0VGFyZ2V0ID0gYWNjb3VudFNlbGVjdGlvbnNbMF0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpWzBdO1xyXG4gICAgICAgICAgICBoYW5kbGVyID0gbmV3IEFjY291bnRTZWxlY3Rpb25TdGVwSGFuZGxlcihhY2Nlc3NSZXF1ZXN0SXRlbSwgZmlyc3RUYXJnZXQsIGFjY291bnRTZWxlY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJtaXR0ZWRCeUlkLCBhc3NpZ25tZW50SWQpO1xyXG4gICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmNoZWNrVW5pcXVlQXNzaWdubWVudCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NoZWNrcyB1bmlxdWUgYXNzaWdubWVudCB3aGVuIG9uIGxhc3QgdGFyZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ZWRJdGVtO1xyXG5cclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5jaGVja1VuaXF1ZUFzc2lnbm1lbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgYSByZXF1ZXN0ZWQgaXRlbSB3YXMgcGFzc2VkIHdpdGggdGhlIGV4cGVjdGVkIGRhdGEuXHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0gPSBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmNoZWNrVW5pcXVlQXNzaWdubWVudC5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0uaXRlbSkudG9FcXVhbChoYW5kbGVyLmFjY2Vzc1JlcXVlc3RJdGVtKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0uYWNjb3VudFNlbGVjdGlvbnNbMF0pLnRvRXF1YWwoaGFuZGxlci5hY2NvdW50U2VsZWN0aW9uc1swXSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgcGFzcyBhc3NpZ25tZW50SWQgaWYgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ZWRJdGVtO1xyXG5cclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5jaGVja1VuaXF1ZUFzc2lnbm1lbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgYSByZXF1ZXN0ZWQgaXRlbSB3YXMgcGFzc2VkIHdpdGggdGhlIGV4cGVjdGVkIGRhdGEuXHJcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0gPSBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmNoZWNrVW5pcXVlQXNzaWdubWVudC5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0uYXNzaWdubWVudElkKS50b0VxdWFsKGFzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgcGFzcyBwZXJtaXR0ZWQgYnkgaWQgdG8gc2VydmljZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdGVkSXRlbTtcclxuXHJcbiAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2UuY2hlY2tVbmlxdWVBc3NpZ25tZW50KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0ZWRJdGVtID0gYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5jaGVja1VuaXF1ZUFzc2lnbm1lbnQuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLnBlcm1pdHRlZEJ5SWQpLnRvRXF1YWwocGVybWl0dGVkQnlJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzZXRzIGVycm9yIGZsYWcgaWYgdW5pcXVlIGFzc2lnbm1lbnQgY2hlY2sgZmFpbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdW5pcXVlQXNzaWdubWVudFByb21pc2VTcHkubWFrZVJlamVjdCh0cnVlKTtcclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5ub25VbmlxdWVBc3NpZ25tZW50RXJyb3IpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXNldHMgZXJyb3IgZmxhZyBpZiB1bmlxdWUgYXNzaWdubWVudCBjaGVjayBwYXNzZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlci5ub25VbmlxdWVBc3NpZ25tZW50RXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICB1bmlxdWVBc3NpZ25tZW50UHJvbWlzZVNweS5tYWtlUmVqZWN0KGZhbHNlKTtcclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5ub25VbmlxdWVBc3NpZ25tZW50RXJyb3IpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVzZXRzIGVycm9yIGZsYWcgaWYgaWRlbnRpdHkgaGFzIG1vcmUgdGFyZ2V0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZmlyc3RUYXJnZXQgPSBhY2NvdW50U2VsZWN0aW9uc1swXS5nZXRQcm92aXNpb25pbmdUYXJnZXRzKClbMF07XHJcbiAgICAgICAgICAgIGhhbmRsZXIgPSBuZXcgQWNjb3VudFNlbGVjdGlvblN0ZXBIYW5kbGVyKGFjY2Vzc1JlcXVlc3RJdGVtLCBmaXJzdFRhcmdldCwgYWNjb3VudFNlbGVjdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pdHRlZEJ5SWQsIGFzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubm9uVW5pcXVlQXNzaWdubWVudEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5ub25VbmlxdWVBc3NpZ25tZW50RXJyb3IpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIGNvcnJlY3QgdGl0bGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5nZXRUaXRsZSgpKS50b0VxdWFsKCd1aV9hY2N0X3NlbGVjdF90aXRsZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIGNvcnJlY3Qgc3RlcElkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuZ2V0U3RlcElkKCkpLnRvRXF1YWwoJ2FjY291bnRTZWxlY3Rpb25fMC0xJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNTYXZlRGlzYWJsZWQoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgbm90aGluZyBoYXMgYmVlbiBzZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5pc1NhdmVEaXNhYmxlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBhbiBhY2NvdW50IGhhcyBiZWVuIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhY2N0ID0gdGFyZ2V0LmdldEFjY291bnRJbmZvcygpWzBdO1xyXG4gICAgICAgICAgICBoYW5kbGVyLnNlbGVjdEFjY291bnQoYWNjdCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmlzU2F2ZURpc2FibGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBjcmVhdGUgYWNjb3VudCBoYXMgYmVlbiBzZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVyLnNlbGVjdENyZWF0ZUFjY291bnQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuaXNTYXZlRGlzYWJsZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0U2F2ZUJ1dHRvbkxhYmVsKCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyBcIkFwcGx5XCIgaWYgb24gbGFzdCBzdGVwJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmdldFNhdmVCdXR0b25MYWJlbCh0cnVlKSkudG9FcXVhbCgndWlfYWNjdF9zZWxlY3RfYXBwbHknKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgXCJOZXh0IElkZW50aXR5XCIgaWYgb24gbGFzdCBhcHAgb2YgYW4gaWRlbnRpdHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuZ2V0U2F2ZUJ1dHRvbkxhYmVsKGZhbHNlKSkudG9FcXVhbCgndWlfYWNjdF9zZWxlY3RfbmV4dF9pZGVudGl0eV9idXR0b24nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgXCJOZXh0IEFwcFwiIGlmIG1vcmUgYXBwcyBleGlzdCBvbiB0aGUgaWRlbnRpdHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGZpcnN0VGFyZ2V0ID0gYWNjb3VudFNlbGVjdGlvbnNbMF0uZ2V0UHJvdmlzaW9uaW5nVGFyZ2V0cygpWzBdLFxyXG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IG5ldyBBY2NvdW50U2VsZWN0aW9uU3RlcEhhbmRsZXIoYWNjZXNzUmVxdWVzdEl0ZW0sIGZpcnN0VGFyZ2V0LCBhY2NvdW50U2VsZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pdHRlZEJ5SWQsIGFzc2lnbm1lbnRJZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmdldFNhdmVCdXR0b25MYWJlbChmYWxzZSkpLnRvRXF1YWwoJ3VpX2FjY3Rfc2VsZWN0X25leHRfYXBwX2J1dHRvbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3NhdmUoKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXNvbHZlcyB3aXRoIHRoZSBwcm92aXNpb25pbmcgdGFyZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gaGFuZGxlci5zYXZlKCksXHJcbiAgICAgICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPblN1Y2Nlc3MocHJvbWlzZSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0YXJnZXQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVqZWN0cyBpZiB1bmlxdWUgYXNzaWdubWVudCBjaGVjayBmYWlscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHRoZSB1bmlxdWUgY2hlY2sgdG8gcmVqZWN0LlxyXG4gICAgICAgICAgICB1bmlxdWVBc3NpZ25tZW50UHJvbWlzZVNweS5tYWtlUmVqZWN0KHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQXR0ZW1wdCB0byBzYXZlLlxyXG4gICAgICAgICAgICBwcm9taXNlID0gaGFuZGxlci5zYXZlKCk7XHJcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uRmFpbHVyZShwcm9taXNlKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIG1vZGFsIHN0YXllZCBvcGVuLlxyXG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
