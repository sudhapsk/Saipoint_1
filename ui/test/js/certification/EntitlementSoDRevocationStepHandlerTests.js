System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}],
        execute: function () {

            describe('EntitlementSoDRevocationStepHandler', function () {

                var EntitlementSoDRevocationStepHandler = undefined,
                    certificationDataService = undefined,
                    advice = undefined,
                    policyTree = undefined,
                    $rootScope = undefined,
                    PolicyTreeNode = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_EntitlementSoDRevocationStepHandler_, _certificationDataService_, RemediationAdvice, _PolicyTreeNode_, certificationTestData, _$rootScope_) {
                    EntitlementSoDRevocationStepHandler = _EntitlementSoDRevocationStepHandler_;
                    PolicyTreeNode = _PolicyTreeNode_;
                    certificationDataService = _certificationDataService_;
                    $rootScope = _$rootScope_;

                    var adviceData = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT.advice);
                    adviceData.entitlementsToRemediate = certificationTestData.POLICY_TREE_NODE;
                    advice = new RemediationAdvice(adviceData);
                    policyTree = advice.entitlementsToRemediate;
                }));

                describe('constructor', function () {
                    it('throws without advice', function () {
                        expect(function () {
                            new EntitlementSoDRevocationStepHandler();
                        }).toThrow();
                    });

                    it('sets the correct data', function () {
                        var stepHandler = new EntitlementSoDRevocationStepHandler(advice);
                        expect(stepHandler.policyTree).toEqual(policyTree);
                        expect(stepHandler.violationConstraint).toEqual(advice.violationConstraint);
                        expect(stepHandler.violationSummary).toEqual(advice.violationSummary);
                    });

                    it('copies statuses from the decision store into the policy tree', function () {
                        var expectedItemId = policyTree.children[0].status[0].associatedItemId;
                        var fakeStatus = 'SomeFakeStatus';

                        // Mock out the data service to return values for our node.
                        spyOn(certificationDataService.decisions, 'getEffectiveDecision').and.callFake(function (itemId) {
                            if (itemId === expectedItemId) {
                                // Return a fake CertificationDecision-like object.
                                return { status: fakeStatus };
                            }
                            return null;
                        });

                        // Create the step handler.
                        var stepHandler = new EntitlementSoDRevocationStepHandler(advice);

                        // Should have only been called once, because only one node has a cert item ID.
                        expect(certificationDataService.decisions.getEffectiveDecision).toHaveBeenCalledWith(expectedItemId);
                        expect(certificationDataService.decisions.getEffectiveDecision.calls.count()).toEqual(1);

                        // Check that the policy tree node has the fake status on it now.
                        expect(stepHandler.policyTree.children[0].status[0].action).toEqual(fakeStatus);
                    });

                    it('pre-selects nodes that are passed in to the constructor as selected', function () {
                        var selectedViolationEntitlements = [new PolicyTreeNode(advice.entitlementsToRemediate.children[0])],
                            stepHandler = new EntitlementSoDRevocationStepHandler(advice, selectedViolationEntitlements);

                        expect(stepHandler.policyTree.children[0].selected).toEqual(true);
                        expect(stepHandler.policyTree.children[1].selected).toEqual(false);
                    });
                });

                describe('isSaveDisabled()', function () {
                    it('returns true if the violation is not resolved', function () {
                        spyOn(policyTree, 'isResolved').and.returnValue(false);
                        var stepHandler = new EntitlementSoDRevocationStepHandler(advice);
                        expect(stepHandler.isSaveDisabled()).toEqual(true);
                    });

                    it('returns false if the violation is resolved', function () {
                        spyOn(policyTree, 'isResolved').and.returnValue(true);
                        var stepHandler = new EntitlementSoDRevocationStepHandler(advice);
                        expect(stepHandler.isSaveDisabled()).toEqual(false);
                    });
                });

                it('save resolves with the selected nodes', function () {
                    var selected = ['some', 'selected', 'nodes'];
                    spyOn(policyTree, 'getSelectedNodes').and.returnValue(selected);
                    var stepHandler = new EntitlementSoDRevocationStepHandler(advice);
                    var result = undefined;

                    stepHandler.save().then(function (stepResult) {
                        result = stepResult;
                    });
                    $rootScope.$apply();
                    expect(result).toBeDefined();
                    expect(result.selectedViolationEntitlements).toEqual(selected);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXJUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLGdEQUFnRCxVQUFVLFNBQVM7SUFDaEo7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsMkNBQTJDO1FBQ3hELFNBQVMsWUFBWTs7WUFKN0IsU0FBUyx1Q0FBdUMsWUFBTTs7Z0JBRWxELElBQUksc0NBQW1DO29CQUFFLDJCQUF3QjtvQkFBRSxTQUFNO29CQUFFLGFBQVU7b0JBQUUsYUFBVTtvQkFBRSxpQkFBYzs7Z0JBRWpILFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLHVDQUF1Qyw0QkFBNEIsbUJBQ25FLGtCQUFrQix1QkFBc0IsY0FBaUI7b0JBQ3hFLHNDQUFzQztvQkFDdEMsaUJBQWlCO29CQUNqQiwyQkFBMkI7b0JBQzNCLGFBQWE7O29CQUViLElBQUksYUFBYSxRQUFRLEtBQUssc0JBQXNCLDBCQUEwQjtvQkFDOUUsV0FBVywwQkFBMEIsc0JBQXNCO29CQUMzRCxTQUFTLElBQUksa0JBQWtCO29CQUMvQixhQUFhLE9BQU87OztnQkFHeEIsU0FBUyxlQUFlLFlBQU07b0JBQzFCLEdBQUcseUJBQXlCLFlBQU07d0JBQzlCLE9BQU8sWUFBTTs0QkFBRSxJQUFJOzJCQUEwQzs7O29CQUdqRSxHQUFHLHlCQUF5QixZQUFNO3dCQUM5QixJQUFJLGNBQWMsSUFBSSxvQ0FBb0M7d0JBQzFELE9BQU8sWUFBWSxZQUFZLFFBQVE7d0JBQ3ZDLE9BQU8sWUFBWSxxQkFBcUIsUUFBUSxPQUFPO3dCQUN2RCxPQUFPLFlBQVksa0JBQWtCLFFBQVEsT0FBTzs7O29CQUd4RCxHQUFHLGdFQUFnRSxZQUFNO3dCQUNyRSxJQUFJLGlCQUFpQixXQUFXLFNBQVMsR0FBRyxPQUFPLEdBQUc7d0JBQ3RELElBQUksYUFBYTs7O3dCQUdqQixNQUFNLHlCQUF5QixXQUFXLHdCQUF3QixJQUFJLFNBQVMsVUFBQyxRQUFXOzRCQUN2RixJQUFJLFdBQVcsZ0JBQWdCOztnQ0FFM0IsT0FBTyxFQUFFLFFBQVE7OzRCQUVyQixPQUFPOzs7O3dCQUlYLElBQUksY0FBYyxJQUFJLG9DQUFvQzs7O3dCQUcxRCxPQUFPLHlCQUF5QixVQUFVLHNCQUNyQyxxQkFBcUI7d0JBQzFCLE9BQU8seUJBQXlCLFVBQVUscUJBQXFCLE1BQU0sU0FBUyxRQUFROzs7d0JBR3RGLE9BQU8sWUFBWSxXQUFXLFNBQVMsR0FBRyxPQUFPLEdBQUcsUUFBUSxRQUFROzs7b0JBR3hFLEdBQUcsdUVBQXVFLFlBQU07d0JBQzVFLElBQUksZ0NBQWdDLENBQUMsSUFBSSxlQUFlLE9BQU8sd0JBQXdCLFNBQVM7NEJBQzVGLGNBQWMsSUFBSSxvQ0FBb0MsUUFBUTs7d0JBRWxFLE9BQU8sWUFBWSxXQUFXLFNBQVMsR0FBRyxVQUFVLFFBQVE7d0JBQzVELE9BQU8sWUFBWSxXQUFXLFNBQVMsR0FBRyxVQUFVLFFBQVE7Ozs7Z0JBSXBFLFNBQVMsb0JBQW9CLFlBQU07b0JBQy9CLEdBQUcsaURBQWlELFlBQU07d0JBQ3RELE1BQU0sWUFBWSxjQUFjLElBQUksWUFBWTt3QkFDaEQsSUFBSSxjQUFjLElBQUksb0NBQW9DO3dCQUMxRCxPQUFPLFlBQVksa0JBQWtCLFFBQVE7OztvQkFHakQsR0FBRyw4Q0FBOEMsWUFBTTt3QkFDbkQsTUFBTSxZQUFZLGNBQWMsSUFBSSxZQUFZO3dCQUNoRCxJQUFJLGNBQWMsSUFBSSxvQ0FBb0M7d0JBQzFELE9BQU8sWUFBWSxrQkFBa0IsUUFBUTs7OztnQkFJckQsR0FBRyx5Q0FBeUMsWUFBTTtvQkFDOUMsSUFBSSxXQUFXLENBQUUsUUFBUSxZQUFZO29CQUNyQyxNQUFNLFlBQVksb0JBQW9CLElBQUksWUFBWTtvQkFDdEQsSUFBSSxjQUFjLElBQUksb0NBQW9DO29CQUMxRCxJQUFJLFNBQU07O29CQUVWLFlBQVksT0FBTyxLQUFLLFVBQUMsWUFBZTt3QkFDcEMsU0FBUzs7b0JBRWIsV0FBVztvQkFDWCxPQUFPLFFBQVE7b0JBQ2YsT0FBTyxPQUFPLCtCQUErQixRQUFROzs7OztHQWdCMUQiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9FbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlclRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XHJcbmltcG9ydCAndGVzdC9qcy9jZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25UZXN0RGF0YSc7XHJcblxyXG5kZXNjcmliZSgnRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXInLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0IEVudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyLCBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsIGFkdmljZSwgcG9saWN5VHJlZSwgJHJvb3RTY29wZSwgUG9saWN5VHJlZU5vZGU7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uU3RlcEhhbmRsZXJfLCBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXywgUmVtZWRpYXRpb25BZHZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgX1BvbGljeVRyZWVOb2RlXywgY2VydGlmaWNhdGlvblRlc3REYXRhLF8kcm9vdFNjb3BlXykgPT4ge1xyXG4gICAgICAgIEVudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyID0gX0VudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyXztcclxuICAgICAgICBQb2xpY3lUcmVlTm9kZSA9IF9Qb2xpY3lUcmVlTm9kZV87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV87XHJcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuXHJcbiAgICAgICAgbGV0IGFkdmljZURhdGEgPSBhbmd1bGFyLmNvcHkoY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQuYWR2aWNlKTtcclxuICAgICAgICBhZHZpY2VEYXRhLmVudGl0bGVtZW50c1RvUmVtZWRpYXRlID0gY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREU7XHJcbiAgICAgICAgYWR2aWNlID0gbmV3IFJlbWVkaWF0aW9uQWR2aWNlKGFkdmljZURhdGEpO1xyXG4gICAgICAgIHBvbGljeVRyZWUgPSBhZHZpY2UuZW50aXRsZW1lbnRzVG9SZW1lZGlhdGU7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBhZHZpY2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiB7IG5ldyBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlcigpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzZXRzIHRoZSBjb3JyZWN0IGRhdGEnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIucG9saWN5VHJlZSkudG9FcXVhbChwb2xpY3lUcmVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLnZpb2xhdGlvbkNvbnN0cmFpbnQpLnRvRXF1YWwoYWR2aWNlLnZpb2xhdGlvbkNvbnN0cmFpbnQpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIudmlvbGF0aW9uU3VtbWFyeSkudG9FcXVhbChhZHZpY2UudmlvbGF0aW9uU3VtbWFyeSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjb3BpZXMgc3RhdHVzZXMgZnJvbSB0aGUgZGVjaXNpb24gc3RvcmUgaW50byB0aGUgcG9saWN5IHRyZWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBleHBlY3RlZEl0ZW1JZCA9IHBvbGljeVRyZWUuY2hpbGRyZW5bMF0uc3RhdHVzWzBdLmFzc29jaWF0ZWRJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBmYWtlU3RhdHVzID0gJ1NvbWVGYWtlU3RhdHVzJztcclxuXHJcbiAgICAgICAgICAgIC8vIE1vY2sgb3V0IHRoZSBkYXRhIHNlcnZpY2UgdG8gcmV0dXJuIHZhbHVlcyBmb3Igb3VyIG5vZGUuXHJcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdnZXRFZmZlY3RpdmVEZWNpc2lvbicpLmFuZC5jYWxsRmFrZSgoaXRlbUlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbUlkID09PSBleHBlY3RlZEl0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBhIGZha2UgQ2VydGlmaWNhdGlvbkRlY2lzaW9uLWxpa2Ugb2JqZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogZmFrZVN0YXR1cyB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBzdGVwIGhhbmRsZXIuXHJcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2hvdWxkIGhhdmUgb25seSBiZWVuIGNhbGxlZCBvbmNlLCBiZWNhdXNlIG9ubHkgb25lIG5vZGUgaGFzIGEgY2VydCBpdGVtIElELlxyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5nZXRFZmZlY3RpdmVEZWNpc2lvbilcclxuICAgICAgICAgICAgICAgIC50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3RlZEl0ZW1JZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldEVmZmVjdGl2ZURlY2lzaW9uLmNhbGxzLmNvdW50KCkpLnRvRXF1YWwoMSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBwb2xpY3kgdHJlZSBub2RlIGhhcyB0aGUgZmFrZSBzdGF0dXMgb24gaXQgbm93LlxyXG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIucG9saWN5VHJlZS5jaGlsZHJlblswXS5zdGF0dXNbMF0uYWN0aW9uKS50b0VxdWFsKGZha2VTdGF0dXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncHJlLXNlbGVjdHMgbm9kZXMgdGhhdCBhcmUgcGFzc2VkIGluIHRvIHRoZSBjb25zdHJ1Y3RvciBhcyBzZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkVmlvbGF0aW9uRW50aXRsZW1lbnRzID0gW25ldyBQb2xpY3lUcmVlTm9kZShhZHZpY2UuZW50aXRsZW1lbnRzVG9SZW1lZGlhdGUuY2hpbGRyZW5bMF0pXSxcclxuICAgICAgICAgICAgICAgIHN0ZXBIYW5kbGVyID0gbmV3IEVudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSwgc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLnBvbGljeVRyZWUuY2hpbGRyZW5bMF0uc2VsZWN0ZWQpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5wb2xpY3lUcmVlLmNoaWxkcmVuWzFdLnNlbGVjdGVkKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc1NhdmVEaXNhYmxlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlIHZpb2xhdGlvbiBpcyBub3QgcmVzb2x2ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKHBvbGljeVRyZWUsICdpc1Jlc29sdmVkJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IEVudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5pc1NhdmVEaXNhYmxlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGUgdmlvbGF0aW9uIGlzIHJlc29sdmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihwb2xpY3lUcmVlLCAnaXNSZXNvbHZlZCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcclxuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IEVudGl0bGVtZW50U29EUmV2b2NhdGlvblN0ZXBIYW5kbGVyKGFkdmljZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5pc1NhdmVEaXNhYmxlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzYXZlIHJlc29sdmVzIHdpdGggdGhlIHNlbGVjdGVkIG5vZGVzJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZCA9IFsgJ3NvbWUnLCAnc2VsZWN0ZWQnLCAnbm9kZXMnIF07XHJcbiAgICAgICAgc3B5T24ocG9saWN5VHJlZSwgJ2dldFNlbGVjdGVkTm9kZXMnKS5hbmQucmV0dXJuVmFsdWUoc2VsZWN0ZWQpO1xyXG4gICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBFbnRpdGxlbWVudFNvRFJldm9jYXRpb25TdGVwSGFuZGxlcihhZHZpY2UpO1xyXG4gICAgICAgIGxldCByZXN1bHQ7XHJcblxyXG4gICAgICAgIHN0ZXBIYW5kbGVyLnNhdmUoKS50aGVuKChzdGVwUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHN0ZXBSZXN1bHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChyZXN1bHQuc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMpLnRvRXF1YWwoc2VsZWN0ZWQpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
