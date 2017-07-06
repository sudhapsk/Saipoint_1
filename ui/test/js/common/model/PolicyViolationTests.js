System.register(['test/js/TestInitializer', 'common/model/ModelModule', './ModelTestData'], function (_export) {
    'use strict';

    var modelModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonModelModelModule) {
            modelModule = _commonModelModelModule['default'];
        }, function (_ModelTestData) {}],
        execute: function () {

            /**
             * Tests for the PolicyViolation model object.
             */
            describe('PolicyViolation', function () {

                var roleData, entitlementData, roleViolationData, entitlementViolationData, violationReviewRoleData, violationReviewEntitlementData, violationRole, violationEntitlement, role, entitlement, PolicyViolation, AccessRequestItem, ViolationReviewRequestedItem, roleViolation, entitlementViolation;

                // Use the access request module.
                beforeEach(module(modelModule));

                /**
                 * Setup the PolicyViolation class and create some data to test with.
                 */
                beforeEach(inject(function (_PolicyViolation_, _AccessRequestItem_, _ViolationReviewRequestedItem_, modelTestData) {
                    PolicyViolation = _PolicyViolation_;
                    AccessRequestItem = _AccessRequestItem_;
                    ViolationReviewRequestedItem = _ViolationReviewRequestedItem_;

                    roleData = modelTestData.POLICY_VIOLATION_ROLE;
                    entitlementData = modelTestData.POLICY_VIOLATION_ENTITLEMENT;
                    roleViolationData = modelTestData.ROLE_POLICY_VIOLATION_DATA;
                    entitlementViolationData = modelTestData.ENTITLEMENT_POLICY_VIOLATION_DATA;
                    violationReviewRoleData = modelTestData.VIOLATION_REVIEW_ROLE;
                    violationReviewEntitlementData = modelTestData.VIOLATION_REVIEW_ENTITLEMENT;

                    roleViolation = new PolicyViolation(roleViolationData);
                    entitlementViolation = new PolicyViolation(entitlementViolationData);
                    role = new AccessRequestItem(roleData);
                    entitlement = new AccessRequestItem(entitlementData);
                    violationRole = new ViolationReviewRequestedItem(violationReviewRoleData);
                    violationEntitlement = new ViolationReviewRequestedItem(violationReviewEntitlementData);
                }));

                it('requires non-null data in the constructor', function () {
                    expect(function () {
                        new PolicyViolation(null);
                    }).toThrow();
                });

                it('throws if the data passed to the constructor is not an object', function () {
                    expect(function () {
                        new PolicyViolation('hi mom');
                    }).toThrow();
                    expect(function () {
                        new PolicyViolation(function () {
                            return 'what tha?';
                        });
                    }).toThrow();
                });

                it('returns policy name read from data', function () {
                    expect(roleViolation.getPolicyName()).toEqual(roleViolationData.policyName);
                });

                it('returns description read from data', function () {
                    expect(roleViolation.getDescription()).toEqual(roleViolationData.description);
                });

                it('returns rule name read from data', function () {
                    expect(roleViolation.getRuleName()).toEqual(roleViolationData.ruleName);
                });

                it('returns work item id read from data', function () {
                    expect(roleViolation.getWorkItemId()).toEqual(roleViolationData.workitemId);
                });

                it('returns role violation bundles and null entitlements read from data', function () {
                    expect(roleViolation.getLeftBundles()).toEqual(roleViolationData.leftBundles);
                    expect(roleViolation.getRightBundles()).toEqual(roleViolationData.rightBundles);
                    expect(roleViolation.getEntitlements()).toBeUndefined();
                });

                it('returns entitlement violations and null bundles read from data', function () {
                    expect(entitlementViolation.getLeftBundles()).toBeUndefined();
                    expect(entitlementViolation.getRightBundles()).toBeUndefined();
                    expect(entitlementViolation.getEntitlements()).toEqual(entitlementViolationData.entitlements);
                });

                it('role matches on role violation with AccessRequestItem', function () {
                    expect(roleViolation.isCausedBy(role)).toBeTruthy();
                });

                it('role matches on role violation with ViolationReviewRequestedItem', function () {
                    expect(roleViolation.isCausedBy(violationRole)).toBeTruthy();
                });

                it('role does not match on entitlement violation with AccessRequestItem', function () {
                    expect(entitlementViolation.isCausedBy(role)).toBeFalsy();
                });

                it('role does not match on entitlement violation with ViolationReviewRequestedItem', function () {
                    expect(entitlementViolation.isCausedBy(violationRole)).toBeFalsy();
                });

                it('entitlement matches on entitlement violation with AccessRequestItem', function () {
                    expect(entitlementViolation.isCausedBy(entitlement)).toBeTruthy();
                });

                it('entitlement matches on entitlement violation with ViolationReviewRequestedItem', function () {
                    expect(entitlementViolation.isCausedBy(violationEntitlement)).toBeTruthy();
                });

                it('entitlement does not match on role violation with AccessRequestItem', function () {
                    expect(roleViolation.isCausedBy(entitlement)).toBeFalsy();
                });

                it('entitlement does not match on role violation with ViolationReviewRequestedItem', function () {
                    expect(roleViolation.isCausedBy(violationEntitlement)).toBeFalsy();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9tb2RlbC9Qb2xpY3lWaW9sYXRpb25UZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsNEJBQTRCLG9CQUFvQixVQUFVLFNBQVM7SUFDM0c7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxjQUFjLHdCQUF3QjtXQUN2QyxVQUFVLGdCQUFnQjtRQUM3QixTQUFTLFlBQVk7Ozs7O1lBRDdCLFNBQVMsbUJBQW1CLFlBQVc7O2dCQUVuQyxJQUFJLFVBQVUsaUJBQWlCLG1CQUFtQiwwQkFDOUMseUJBQXlCLGdDQUN6QixlQUNBLHNCQUNBLE1BQ0EsYUFDQSxpQkFDQSxtQkFDQSw4QkFDQSxlQUNBOzs7Z0JBR0osV0FBVyxPQUFPOzs7OztnQkFLbEIsV0FBVyxPQUFPLFVBQVMsbUJBQW1CLHFCQUFxQixnQ0FDeEMsZUFBZTtvQkFDdEMsa0JBQWtCO29CQUNsQixvQkFBb0I7b0JBQ3BCLCtCQUErQjs7b0JBRS9CLFdBQVcsY0FBYztvQkFDekIsa0JBQWtCLGNBQWM7b0JBQ2hDLG9CQUFvQixjQUFjO29CQUNsQywyQkFBMkIsY0FBYztvQkFDekMsMEJBQTBCLGNBQWM7b0JBQ3hDLGlDQUFpQyxjQUFjOztvQkFFL0MsZ0JBQWdCLElBQUksZ0JBQWdCO29CQUNwQyx1QkFBdUIsSUFBSSxnQkFBZ0I7b0JBQzNDLE9BQU8sSUFBSSxrQkFBa0I7b0JBQzdCLGNBQWMsSUFBSSxrQkFBa0I7b0JBQ3BDLGdCQUFnQixJQUFJLDZCQUE2QjtvQkFDakQsdUJBQXVCLElBQUksNkJBQTZCOzs7Z0JBRzVELEdBQUcsNkNBQTZDLFlBQVc7b0JBQ3ZELE9BQU8sWUFBVzt3QkFBRSxJQUFJLGdCQUFnQjt1QkFBVTs7O2dCQUd0RCxHQUFHLGlFQUFpRSxZQUFXO29CQUMzRSxPQUFPLFlBQVc7d0JBQUUsSUFBSSxnQkFBZ0I7dUJBQWM7b0JBQ3RELE9BQU8sWUFBVzt3QkFBRSxJQUFJLGdCQUFnQixZQUFXOzRCQUFFLE9BQU87O3VCQUFvQjs7O2dCQUdwRixHQUFHLHNDQUFzQyxZQUFXO29CQUNoRCxPQUFPLGNBQWMsaUJBQWlCLFFBQVEsa0JBQWtCOzs7Z0JBR3BFLEdBQUcsc0NBQXNDLFlBQVc7b0JBQ2hELE9BQU8sY0FBYyxrQkFBa0IsUUFBUSxrQkFBa0I7OztnQkFHckUsR0FBRyxvQ0FBb0MsWUFBVztvQkFDOUMsT0FBTyxjQUFjLGVBQWUsUUFBUSxrQkFBa0I7OztnQkFHbEUsR0FBRyx1Q0FBdUMsWUFBVztvQkFDakQsT0FBTyxjQUFjLGlCQUFpQixRQUFRLGtCQUFrQjs7O2dCQUdwRSxHQUFHLHVFQUF1RSxZQUFXO29CQUNqRixPQUFPLGNBQWMsa0JBQWtCLFFBQVEsa0JBQWtCO29CQUNqRSxPQUFPLGNBQWMsbUJBQW1CLFFBQVEsa0JBQWtCO29CQUNsRSxPQUFPLGNBQWMsbUJBQW1COzs7Z0JBRzVDLEdBQUcsa0VBQWtFLFlBQVc7b0JBQzVFLE9BQU8scUJBQXFCLGtCQUFrQjtvQkFDOUMsT0FBTyxxQkFBcUIsbUJBQW1CO29CQUMvQyxPQUFPLHFCQUFxQixtQkFBbUIsUUFBUSx5QkFBeUI7OztnQkFHcEYsR0FBRyx5REFBeUQsWUFBVztvQkFDbkUsT0FBTyxjQUFjLFdBQVcsT0FBTzs7O2dCQUczQyxHQUFHLG9FQUFvRSxZQUFXO29CQUM5RSxPQUFPLGNBQWMsV0FBVyxnQkFBZ0I7OztnQkFHcEQsR0FBRyx1RUFBdUUsWUFBVztvQkFDakYsT0FBTyxxQkFBcUIsV0FBVyxPQUFPOzs7Z0JBR2xELEdBQUcsa0ZBQWtGLFlBQVc7b0JBQzVGLE9BQU8scUJBQXFCLFdBQVcsZ0JBQWdCOzs7Z0JBRzNELEdBQUcsdUVBQXVFLFlBQVc7b0JBQ2pGLE9BQU8scUJBQXFCLFdBQVcsY0FBYzs7O2dCQUd6RCxHQUFHLGtGQUFrRixZQUFXO29CQUM1RixPQUFPLHFCQUFxQixXQUFXLHVCQUF1Qjs7O2dCQUdsRSxHQUFHLHVFQUF1RSxZQUFXO29CQUNqRixPQUFPLGNBQWMsV0FBVyxjQUFjOzs7Z0JBR2xELEdBQUcsa0ZBQWtGLFlBQVc7b0JBQzVGLE9BQU8sY0FBYyxXQUFXLHVCQUF1Qjs7Ozs7R0FRNUQiLCJmaWxlIjoiY29tbW9uL21vZGVsL1BvbGljeVZpb2xhdGlvblRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBtb2RlbE1vZHVsZSBmcm9tICdjb21tb24vbW9kZWwvTW9kZWxNb2R1bGUnO1xyXG5pbXBvcnQgJy4vTW9kZWxUZXN0RGF0YSc7XHJcblxyXG4vKipcclxuICogVGVzdHMgZm9yIHRoZSBQb2xpY3lWaW9sYXRpb24gbW9kZWwgb2JqZWN0LlxyXG4gKi9cclxuZGVzY3JpYmUoJ1BvbGljeVZpb2xhdGlvbicsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciByb2xlRGF0YSwgZW50aXRsZW1lbnREYXRhLCByb2xlVmlvbGF0aW9uRGF0YSwgZW50aXRsZW1lbnRWaW9sYXRpb25EYXRhLFxyXG4gICAgICAgIHZpb2xhdGlvblJldmlld1JvbGVEYXRhLCB2aW9sYXRpb25SZXZpZXdFbnRpdGxlbWVudERhdGEsXHJcbiAgICAgICAgdmlvbGF0aW9uUm9sZSxcclxuICAgICAgICB2aW9sYXRpb25FbnRpdGxlbWVudCxcclxuICAgICAgICByb2xlLFxyXG4gICAgICAgIGVudGl0bGVtZW50LFxyXG4gICAgICAgIFBvbGljeVZpb2xhdGlvbixcclxuICAgICAgICBBY2Nlc3NSZXF1ZXN0SXRlbSxcclxuICAgICAgICBWaW9sYXRpb25SZXZpZXdSZXF1ZXN0ZWRJdGVtLFxyXG4gICAgICAgIHJvbGVWaW9sYXRpb24sXHJcbiAgICAgICAgZW50aXRsZW1lbnRWaW9sYXRpb247XHJcblxyXG4gICAgLy8gVXNlIHRoZSBhY2Nlc3MgcmVxdWVzdCBtb2R1bGUuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShtb2RlbE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgdGhlIFBvbGljeVZpb2xhdGlvbiBjbGFzcyBhbmQgY3JlYXRlIHNvbWUgZGF0YSB0byB0ZXN0IHdpdGguXHJcbiAgICAgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9Qb2xpY3lWaW9sYXRpb25fLCBfQWNjZXNzUmVxdWVzdEl0ZW1fLCBfVmlvbGF0aW9uUmV2aWV3UmVxdWVzdGVkSXRlbV8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbFRlc3REYXRhKSB7XHJcbiAgICAgICAgUG9saWN5VmlvbGF0aW9uID0gX1BvbGljeVZpb2xhdGlvbl87XHJcbiAgICAgICAgQWNjZXNzUmVxdWVzdEl0ZW0gPSBfQWNjZXNzUmVxdWVzdEl0ZW1fO1xyXG4gICAgICAgIFZpb2xhdGlvblJldmlld1JlcXVlc3RlZEl0ZW0gPSBfVmlvbGF0aW9uUmV2aWV3UmVxdWVzdGVkSXRlbV87XHJcblxyXG4gICAgICAgIHJvbGVEYXRhID0gbW9kZWxUZXN0RGF0YS5QT0xJQ1lfVklPTEFUSU9OX1JPTEU7XHJcbiAgICAgICAgZW50aXRsZW1lbnREYXRhID0gbW9kZWxUZXN0RGF0YS5QT0xJQ1lfVklPTEFUSU9OX0VOVElUTEVNRU5UO1xyXG4gICAgICAgIHJvbGVWaW9sYXRpb25EYXRhID0gbW9kZWxUZXN0RGF0YS5ST0xFX1BPTElDWV9WSU9MQVRJT05fREFUQTtcclxuICAgICAgICBlbnRpdGxlbWVudFZpb2xhdGlvbkRhdGEgPSBtb2RlbFRlc3REYXRhLkVOVElUTEVNRU5UX1BPTElDWV9WSU9MQVRJT05fREFUQTtcclxuICAgICAgICB2aW9sYXRpb25SZXZpZXdSb2xlRGF0YSA9IG1vZGVsVGVzdERhdGEuVklPTEFUSU9OX1JFVklFV19ST0xFO1xyXG4gICAgICAgIHZpb2xhdGlvblJldmlld0VudGl0bGVtZW50RGF0YSA9IG1vZGVsVGVzdERhdGEuVklPTEFUSU9OX1JFVklFV19FTlRJVExFTUVOVDtcclxuXHJcbiAgICAgICAgcm9sZVZpb2xhdGlvbiA9IG5ldyBQb2xpY3lWaW9sYXRpb24ocm9sZVZpb2xhdGlvbkRhdGEpO1xyXG4gICAgICAgIGVudGl0bGVtZW50VmlvbGF0aW9uID0gbmV3IFBvbGljeVZpb2xhdGlvbihlbnRpdGxlbWVudFZpb2xhdGlvbkRhdGEpO1xyXG4gICAgICAgIHJvbGUgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0ocm9sZURhdGEpO1xyXG4gICAgICAgIGVudGl0bGVtZW50ID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGVudGl0bGVtZW50RGF0YSk7XHJcbiAgICAgICAgdmlvbGF0aW9uUm9sZSA9IG5ldyBWaW9sYXRpb25SZXZpZXdSZXF1ZXN0ZWRJdGVtKHZpb2xhdGlvblJldmlld1JvbGVEYXRhKTtcclxuICAgICAgICB2aW9sYXRpb25FbnRpdGxlbWVudCA9IG5ldyBWaW9sYXRpb25SZXZpZXdSZXF1ZXN0ZWRJdGVtKHZpb2xhdGlvblJldmlld0VudGl0bGVtZW50RGF0YSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgaXQoJ3JlcXVpcmVzIG5vbi1udWxsIGRhdGEgaW4gdGhlIGNvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBuZXcgUG9saWN5VmlvbGF0aW9uKG51bGwpOyB9KS50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndGhyb3dzIGlmIHRoZSBkYXRhIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgaXMgbm90IGFuIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgbmV3IFBvbGljeVZpb2xhdGlvbignaGkgbW9tJyk7IH0pLnRvVGhyb3coKTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IG5ldyBQb2xpY3lWaW9sYXRpb24oZnVuY3Rpb24oKSB7IHJldHVybiAnd2hhdCB0aGE/JzsgfSk7IH0pLnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHBvbGljeSBuYW1lIHJlYWQgZnJvbSBkYXRhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KHJvbGVWaW9sYXRpb24uZ2V0UG9saWN5TmFtZSgpKS50b0VxdWFsKHJvbGVWaW9sYXRpb25EYXRhLnBvbGljeU5hbWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgZGVzY3JpcHRpb24gcmVhZCBmcm9tIGRhdGEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3Qocm9sZVZpb2xhdGlvbi5nZXREZXNjcmlwdGlvbigpKS50b0VxdWFsKHJvbGVWaW9sYXRpb25EYXRhLmRlc2NyaXB0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHJ1bGUgbmFtZSByZWFkIGZyb20gZGF0YScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChyb2xlVmlvbGF0aW9uLmdldFJ1bGVOYW1lKCkpLnRvRXF1YWwocm9sZVZpb2xhdGlvbkRhdGEucnVsZU5hbWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgd29yayBpdGVtIGlkIHJlYWQgZnJvbSBkYXRhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KHJvbGVWaW9sYXRpb24uZ2V0V29ya0l0ZW1JZCgpKS50b0VxdWFsKHJvbGVWaW9sYXRpb25EYXRhLndvcmtpdGVtSWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgcm9sZSB2aW9sYXRpb24gYnVuZGxlcyBhbmQgbnVsbCBlbnRpdGxlbWVudHMgcmVhZCBmcm9tIGRhdGEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3Qocm9sZVZpb2xhdGlvbi5nZXRMZWZ0QnVuZGxlcygpKS50b0VxdWFsKHJvbGVWaW9sYXRpb25EYXRhLmxlZnRCdW5kbGVzKTtcclxuICAgICAgICBleHBlY3Qocm9sZVZpb2xhdGlvbi5nZXRSaWdodEJ1bmRsZXMoKSkudG9FcXVhbChyb2xlVmlvbGF0aW9uRGF0YS5yaWdodEJ1bmRsZXMpO1xyXG4gICAgICAgIGV4cGVjdChyb2xlVmlvbGF0aW9uLmdldEVudGl0bGVtZW50cygpKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyBlbnRpdGxlbWVudCB2aW9sYXRpb25zIGFuZCBudWxsIGJ1bmRsZXMgcmVhZCBmcm9tIGRhdGEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnRWaW9sYXRpb24uZ2V0TGVmdEJ1bmRsZXMoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChlbnRpdGxlbWVudFZpb2xhdGlvbi5nZXRSaWdodEJ1bmRsZXMoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChlbnRpdGxlbWVudFZpb2xhdGlvbi5nZXRFbnRpdGxlbWVudHMoKSkudG9FcXVhbChlbnRpdGxlbWVudFZpb2xhdGlvbkRhdGEuZW50aXRsZW1lbnRzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyb2xlIG1hdGNoZXMgb24gcm9sZSB2aW9sYXRpb24gd2l0aCBBY2Nlc3NSZXF1ZXN0SXRlbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChyb2xlVmlvbGF0aW9uLmlzQ2F1c2VkQnkocm9sZSkpLnRvQmVUcnV0aHkoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyb2xlIG1hdGNoZXMgb24gcm9sZSB2aW9sYXRpb24gd2l0aCBWaW9sYXRpb25SZXZpZXdSZXF1ZXN0ZWRJdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KHJvbGVWaW9sYXRpb24uaXNDYXVzZWRCeSh2aW9sYXRpb25Sb2xlKSkudG9CZVRydXRoeSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JvbGUgZG9lcyBub3QgbWF0Y2ggb24gZW50aXRsZW1lbnQgdmlvbGF0aW9uIHdpdGggQWNjZXNzUmVxdWVzdEl0ZW0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnRWaW9sYXRpb24uaXNDYXVzZWRCeShyb2xlKSkudG9CZUZhbHN5KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncm9sZSBkb2VzIG5vdCBtYXRjaCBvbiBlbnRpdGxlbWVudCB2aW9sYXRpb24gd2l0aCBWaW9sYXRpb25SZXZpZXdSZXF1ZXN0ZWRJdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGVudGl0bGVtZW50VmlvbGF0aW9uLmlzQ2F1c2VkQnkodmlvbGF0aW9uUm9sZSkpLnRvQmVGYWxzeSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2VudGl0bGVtZW50IG1hdGNoZXMgb24gZW50aXRsZW1lbnQgdmlvbGF0aW9uIHdpdGggQWNjZXNzUmVxdWVzdEl0ZW0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnRWaW9sYXRpb24uaXNDYXVzZWRCeShlbnRpdGxlbWVudCkpLnRvQmVUcnV0aHkoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdlbnRpdGxlbWVudCBtYXRjaGVzIG9uIGVudGl0bGVtZW50IHZpb2xhdGlvbiB3aXRoIFZpb2xhdGlvblJldmlld1JlcXVlc3RlZEl0ZW0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnRWaW9sYXRpb24uaXNDYXVzZWRCeSh2aW9sYXRpb25FbnRpdGxlbWVudCkpLnRvQmVUcnV0aHkoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdlbnRpdGxlbWVudCBkb2VzIG5vdCBtYXRjaCBvbiByb2xlIHZpb2xhdGlvbiB3aXRoIEFjY2Vzc1JlcXVlc3RJdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KHJvbGVWaW9sYXRpb24uaXNDYXVzZWRCeShlbnRpdGxlbWVudCkpLnRvQmVGYWxzeSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2VudGl0bGVtZW50IGRvZXMgbm90IG1hdGNoIG9uIHJvbGUgdmlvbGF0aW9uIHdpdGggVmlvbGF0aW9uUmV2aWV3UmVxdWVzdGVkSXRlbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChyb2xlVmlvbGF0aW9uLmlzQ2F1c2VkQnkodmlvbGF0aW9uRW50aXRsZW1lbnQpKS50b0JlRmFsc3koKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
