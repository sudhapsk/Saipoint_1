System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('PolicyTreeNode', function () {

                var PolicyTreeNode = undefined,
                    PolicyTreeNodeState = undefined,
                    data = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_PolicyTreeNode_, _PolicyTreeNodeState_, certificationTestData) {
                    PolicyTreeNode = _PolicyTreeNode_;
                    PolicyTreeNodeState = _PolicyTreeNodeState_;
                    data = certificationTestData.POLICY_TREE_NODE;
                }));

                describe('constructor', function () {
                    it('throws with no data', function () {
                        expect(function () {
                            return new PolicyTreeNode(null);
                        }).toThrow();
                    });

                    function checkLeaf(actual, expected) {
                        expect(actual instanceof PolicyTreeNode).toBe(true);
                        expect(actual.application).toEqual(expected.application);
                        expect(actual.applicationId).toEqual(expected.applicationId);
                        expect(actual.name).toEqual(expected.name);
                        expect(actual.value).toEqual(expected.value);
                        expect(actual.displayValue).toEqual(expected.displayValue);
                        expect(actual.description).toEqual(expected.description);
                        expect(actual.permission).toEqual(expected.permission);
                        expect(actual.selected).toEqual(expected.selected);
                        expect(actual.children).toBeUndefined();

                        if (expected.status) {
                            var _status = actual.status[0];
                            var expectedStatus = expected.status[0];
                            expect(_status instanceof PolicyTreeNodeState).toBe(true);
                            expect(_status.associatedItemId).toEqual(expectedStatus.associatedItemId);
                            expect(_status.associatedEntityId).toEqual(expectedStatus.associatedEntityId);
                            expect(_status.action).toEqual(expectedStatus.action);
                        }
                    }

                    it('sets values', function () {
                        var node = new PolicyTreeNode(data);

                        expect(node.operator).toEqual(data.operator);
                        expect(node.children.length).toEqual(2);
                        checkLeaf(node.children[0], data.children[0]);
                        checkLeaf(node.children[1], data.children[1]);
                    });
                });

                function getLeafData() {
                    return angular.copy(data.children[0]);
                }

                describe('getDisplayableValue()', function () {
                    it('returns display value if available', function () {
                        var leafData = getLeafData();
                        var node = new PolicyTreeNode(leafData);
                        expect(node.getDisplayableValue()).toEqual(leafData.displayValue);
                    });

                    it('returns value when display value is not available', function () {
                        var leafData = getLeafData();
                        leafData.displayValue = undefined;
                        var node = new PolicyTreeNode(leafData);
                        expect(node.getDisplayableValue()).toEqual(leafData.value);
                    });
                });

                describe('isLeaf()', function () {
                    it('returns false for a non-leaf', function () {
                        var node = new PolicyTreeNode(data);
                        expect(node.isLeaf()).toEqual(false);
                    });

                    it('returns true for a leaf', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        expect(node.isLeaf()).toEqual(true);
                    });
                });

                function createAndNode() {
                    var andData = angular.copy(data);
                    andData.operator = PolicyTreeNode.Operator.AND;
                    return new PolicyTreeNode(andData);
                }

                describe('isAnd()', function () {
                    it('returns true for an AND node', function () {
                        var node = createAndNode();
                        expect(node.isAnd()).toEqual(true);
                    });

                    it('returns false for an OR node', function () {
                        var node = new PolicyTreeNode(data);
                        expect(node.isAnd()).toEqual(false);
                    });

                    it('returns false for a leaf node', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        expect(node.isAnd()).toEqual(false);
                    });
                });

                describe('isOr()', function () {
                    it('returns false for an AND node', function () {
                        var node = createAndNode();
                        expect(node.isOr()).toEqual(false);
                    });

                    it('returns true for an OR node', function () {
                        var node = new PolicyTreeNode(data);
                        expect(node.isOr()).toEqual(true);
                    });

                    it('returns false for a leaf node', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        expect(node.isOr()).toEqual(false);
                    });
                });

                describe('hasLineItemDecision()', function () {
                    it('returns false if there is no status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        node.status = undefined;
                        expect(node.hasLineItemDecision()).toEqual(false);
                    });

                    it('returns false if there is no action on the status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        node.status[0].action = undefined;
                        expect(node.hasLineItemDecision()).toEqual(false);
                    });

                    it('returns false if there is a clear action on the status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        node.status[0].action = 'Cleared';
                        expect(node.hasLineItemDecision()).toEqual(false);
                    });

                    it('returns true if there is an action on the status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        expect(node.hasLineItemDecision()).toEqual(true);
                    });
                });

                describe('getLineItemDecision()', function () {
                    it('returns null if there is no status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        node.status = undefined;
                        expect(node.getLineItemDecision()).toBeNull();
                    });

                    it('returns the action on the status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        expect(node.getLineItemDecision()).toEqual('Approved');
                    });
                });

                describe('hasStatus()', function () {
                    it('returns false is status is null', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        node.status = undefined;
                        expect(node.hasStatus()).toEqual(false);
                    });

                    it('returns false is status is empty', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        node.status = [];
                        expect(node.hasStatus()).toEqual(false);
                    });

                    it('returns true if there is a status', function () {
                        var node = new PolicyTreeNode(getLeafData());
                        expect(node.hasStatus()).toEqual(true);
                    });
                });

                function createLeaf(selected) {
                    return new PolicyTreeNode({
                        selected: selected
                    });
                }

                function createNonLeaf(isAnd, selected) {
                    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                        children[_key - 2] = arguments[_key];
                    }

                    return new PolicyTreeNode({
                        operator: isAnd ? PolicyTreeNode.Operator.AND : PolicyTreeNode.Operator.OR,
                        selected: selected,
                        children: children
                    });
                }

                describe('isResolved()', function () {
                    it('returns true for a selected leaf', function () {
                        var leaf = createLeaf(true);
                        expect(leaf.isResolved()).toEqual(true);
                    });

                    it('returns false for an un-selected leaf', function () {
                        var leaf = createLeaf(false);
                        expect(leaf.isResolved()).toEqual(false);
                    });

                    it('returns true for an AND with all children selected', function () {
                        var node = createNonLeaf(true, true, createLeaf(true), createLeaf(true));
                        expect(node.isResolved()).toEqual(true);
                    });

                    it('returns false for an AND with one child not selected', function () {
                        var node = createNonLeaf(true, true, createLeaf(true), createLeaf(false));
                        expect(node.isResolved()).toEqual(false);
                    });

                    it('returns true for an OR with one child selected', function () {
                        var node = createNonLeaf(false, false, createLeaf(true), createLeaf(false));
                        expect(node.isResolved()).toEqual(true);
                    });

                    it('returns false for an OR with no children selected', function () {
                        var node = createNonLeaf(false, false, createLeaf(false), createLeaf(false));
                        expect(node.isResolved()).toEqual(false);
                    });

                    it('returns appropriate values for a multi-level violation', function () {
                        // AND
                        //   OR
                        //     selected, unselected
                        //   AND
                        //     selected, selected
                        var node = createNonLeaf(true, false, createNonLeaf(false, false, createLeaf(true), createLeaf(false)), createNonLeaf(true, false, createLeaf(true), createLeaf(true)));
                        expect(node.isResolved()).toEqual(true);

                        // AND
                        //   OR
                        //     selected, unselected
                        //   AND
                        //     selected
                        //     OR
                        //       selected, unselected
                        node = createNonLeaf(true, false, createNonLeaf(false, false, createLeaf(true), createLeaf(false)), createNonLeaf(true, false, createLeaf(true), createNonLeaf(false, false, createLeaf(true), createLeaf(false))));
                        expect(node.isResolved()).toEqual(true);

                        // OR
                        //   AND
                        //     selected
                        //     OR
                        //       unselected, unselected
                        //   AND
                        //     selected
                        //     AND
                        //       selected, unselected
                        node = createNonLeaf(false, false, createNonLeaf(true, false, createLeaf(true), createNonLeaf(false, false, createLeaf(false), createLeaf(false))), createNonLeaf(true, false, createLeaf(true), createNonLeaf(true, false, createLeaf(true), createLeaf(false))));
                        expect(node.isResolved()).toEqual(false);
                    });
                });

                describe('getSelectedNodes()', function () {
                    it('returns an empty array when a leaf is not selected', function () {
                        var leaf = createLeaf(false);
                        expect(leaf.getSelectedNodes().length).toEqual(0);
                    });

                    it('returns a leaf when it is selected', function () {
                        var leaf = createLeaf(true);
                        expect(leaf.getSelectedNodes()).toContain(leaf);
                    });

                    it('returns all selected nodes in a tree', function () {
                        var selected1 = createLeaf(true);
                        var selected2 = createLeaf(true);
                        // Make node not manually selected, but Remediated outside of the violation
                        var selected3 = createLeaf(false);
                        selected3.status = [new PolicyTreeNodeState({
                            action: 'Remediated'
                        })];

                        var node = createNonLeaf(true, false, selected1, createNonLeaf(false, false, createLeaf(), selected2, createNonLeaf(true, false, createLeaf(), createLeaf(), selected3)));
                        var selectedNodes = node.getSelectedNodes();
                        expect(selectedNodes.length).toEqual(3);
                        expect(selectedNodes).toContain(selected1);
                        expect(selectedNodes).toContain(selected2);
                        expect(selectedNodes).toContain(selected3);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvUG9saWN5VHJlZU5vZGVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLDZCQUE2QixVQUFVLFNBQVM7SUFDN0g7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7WUFKN0IsU0FBUyxrQkFBa0IsWUFBTTs7Z0JBRTdCLElBQUksaUJBQWM7b0JBQUUsc0JBQW1CO29CQUFFLE9BQUk7O2dCQUU3QyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxrQkFBa0IsdUJBQXVCLHVCQUEwQjtvQkFDbEYsaUJBQWlCO29CQUNqQixzQkFBc0I7b0JBQ3RCLE9BQU8sc0JBQXNCOzs7Z0JBR2pDLFNBQVMsZUFBZSxZQUFNO29CQUMxQixHQUFHLHVCQUF1QixZQUFNO3dCQUM1QixPQUFPLFlBQUE7NEJBU1MsT0FUSCxJQUFJLGVBQWU7MkJBQU87OztvQkFHM0MsU0FBUyxVQUFVLFFBQVEsVUFBVTt3QkFDakMsT0FBTyxrQkFBa0IsZ0JBQWdCLEtBQUs7d0JBQzlDLE9BQU8sT0FBTyxhQUFhLFFBQVEsU0FBUzt3QkFDNUMsT0FBTyxPQUFPLGVBQWUsUUFBUSxTQUFTO3dCQUM5QyxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVM7d0JBQ3JDLE9BQU8sT0FBTyxPQUFPLFFBQVEsU0FBUzt3QkFDdEMsT0FBTyxPQUFPLGNBQWMsUUFBUSxTQUFTO3dCQUM3QyxPQUFPLE9BQU8sYUFBYSxRQUFRLFNBQVM7d0JBQzVDLE9BQU8sT0FBTyxZQUFZLFFBQVEsU0FBUzt3QkFDM0MsT0FBTyxPQUFPLFVBQVUsUUFBUSxTQUFTO3dCQUN6QyxPQUFPLE9BQU8sVUFBVTs7d0JBRXhCLElBQUksU0FBUyxRQUFROzRC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LGNBQWMsTUFBTSxPQUNoQixXQUFXLE9BQ1gsY0FBYyxPQUFPLE9BQ2pCLFdBQVcsUUFDWCxXQUFXLFVBQ25CLGNBQWMsTUFBTSxPQUNoQixXQUFXLE9BQ1gsY0FBYyxNQUFNLE9BQ2hCLFdBQVcsT0FDWCxXQUFXO3dCQUMzQixPQUFPLEtBQUssY0FBYyxRQUFROzs7O2dCQUkxQyxTQUFTLHNCQUFzQixZQUFNO29CQUNqQyxHQUFHLHNEQUFzRCxZQUFNO3dCQUMzRCxJQUFJLE9BQU8sV0FBVzt3QkFDdEIsT0FBTyxLQUFLLG1CQUFtQixRQUFRLFFBQVE7OztvQkFHbkQsR0FBRyxzQ0FBc0MsWUFBTTt3QkFDM0MsSUFBSSxPQUFPLFdBQVc7d0JBQ3RCLE9BQU8sS0FBSyxvQkFBb0IsVUFBVTs7O29CQUc5QyxHQUFHLHdDQUF3QyxZQUFNO3dCQUM3QyxJQUFJLFlBQVksV0FBVzt3QkFDM0IsSUFBSSxZQUFZLFdBQVc7O3dCQUUzQixJQUFJLFlBQVksV0FBVzt3QkFDM0IsVUFBVSxTQUFTLENBQUMsSUFBSSxvQkFBb0I7NEJBQ3hDLFFBQVE7Ozt3QkFHWixJQUFJLE9BQ0EsY0FBYyxNQUFNLE9BQ2hCLFdBQ0EsY0FBYyxPQUFPLE9BQ2pCLGNBQ0EsV0FDQSxjQUFjLE1BQU0sT0FDaEIsY0FDQSxjQUNBO3dCQUNoQixJQUFJLGdCQUFnQixLQUFLO3dCQUN6QixPQUFPLGNBQWMsUUFBUSxRQUFRO3dCQUNyQyxPQUFPLGVBQWUsVUFBVTt3QkFDaEMsT0FBTyxlQUFlLFVBQVU7d0JBQ2hDLE9BQU8sZUFBZSxVQUFVOzs7Ozs7R0FoQnpDIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vbW9kZWwvUG9saWN5VHJlZU5vZGVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5pbXBvcnQgJy4uL0NlcnRpZmljYXRpb25UZXN0RGF0YSc7XHJcblxyXG5kZXNjcmliZSgnUG9saWN5VHJlZU5vZGUnLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0IFBvbGljeVRyZWVOb2RlLCBQb2xpY3lUcmVlTm9kZVN0YXRlLCBkYXRhO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdCgoX1BvbGljeVRyZWVOb2RlXywgX1BvbGljeVRyZWVOb2RlU3RhdGVfLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEpID0+IHtcclxuICAgICAgICBQb2xpY3lUcmVlTm9kZSA9IF9Qb2xpY3lUcmVlTm9kZV87XHJcbiAgICAgICAgUG9saWN5VHJlZU5vZGVTdGF0ZSA9IF9Qb2xpY3lUcmVlTm9kZVN0YXRlXztcclxuICAgICAgICBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREU7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBkYXRhJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gbmV3IFBvbGljeVRyZWVOb2RlKG51bGwpKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTGVhZihhY3R1YWwsIGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY3R1YWwgaW5zdGFuY2VvZiBQb2xpY3lUcmVlTm9kZSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdHVhbC5hcHBsaWNhdGlvbikudG9FcXVhbChleHBlY3RlZC5hcHBsaWNhdGlvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY3R1YWwuYXBwbGljYXRpb25JZCkudG9FcXVhbChleHBlY3RlZC5hcHBsaWNhdGlvbklkKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdHVhbC5uYW1lKS50b0VxdWFsKGV4cGVjdGVkLm5hbWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWN0dWFsLnZhbHVlKS50b0VxdWFsKGV4cGVjdGVkLnZhbHVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdHVhbC5kaXNwbGF5VmFsdWUpLnRvRXF1YWwoZXhwZWN0ZWQuZGlzcGxheVZhbHVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdHVhbC5kZXNjcmlwdGlvbikudG9FcXVhbChleHBlY3RlZC5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY3R1YWwucGVybWlzc2lvbikudG9FcXVhbChleHBlY3RlZC5wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdHVhbC5zZWxlY3RlZCkudG9FcXVhbChleHBlY3RlZC5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhY3R1YWwuY2hpbGRyZW4pLnRvQmVVbmRlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChleHBlY3RlZC5zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdGF0dXMgPSBhY3R1YWwuc3RhdHVzWzBdO1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4cGVjdGVkU3RhdHVzID0gZXhwZWN0ZWQuc3RhdHVzWzBdO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHN0YXR1cyBpbnN0YW5jZW9mIFBvbGljeVRyZWVOb2RlU3RhdGUpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3RhdHVzLmFzc29jaWF0ZWRJdGVtSWQpLnRvRXF1YWwoZXhwZWN0ZWRTdGF0dXMuYXNzb2NpYXRlZEl0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3RhdHVzLmFzc29jaWF0ZWRFbnRpdHlJZCkudG9FcXVhbChleHBlY3RlZFN0YXR1cy5hc3NvY2lhdGVkRW50aXR5SWQpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHN0YXR1cy5hY3Rpb24pLnRvRXF1YWwoZXhwZWN0ZWRTdGF0dXMuYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ3NldHMgdmFsdWVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLm9wZXJhdG9yKS50b0VxdWFsKGRhdGEub3BlcmF0b3IpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMik7XHJcbiAgICAgICAgICAgIGNoZWNrTGVhZihub2RlLmNoaWxkcmVuWzBdLCBkYXRhLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgY2hlY2tMZWFmKG5vZGUuY2hpbGRyZW5bMV0sIGRhdGEuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TGVhZkRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuY29weShkYXRhLmNoaWxkcmVuWzBdKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RGlzcGxheWFibGVWYWx1ZSgpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIGRpc3BsYXkgdmFsdWUgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGVhZkRhdGEgPSBnZXRMZWFmRGF0YSgpO1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShsZWFmRGF0YSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmdldERpc3BsYXlhYmxlVmFsdWUoKSkudG9FcXVhbChsZWFmRGF0YS5kaXNwbGF5VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB2YWx1ZSB3aGVuIGRpc3BsYXkgdmFsdWUgaXMgbm90IGF2YWlsYWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxlYWZEYXRhID0gZ2V0TGVhZkRhdGEoKTtcclxuICAgICAgICAgICAgbGVhZkRhdGEuZGlzcGxheVZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShsZWFmRGF0YSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmdldERpc3BsYXlhYmxlVmFsdWUoKSkudG9FcXVhbChsZWFmRGF0YS52YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaXNMZWFmKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGEgbm9uLWxlYWYnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gbmV3IFBvbGljeVRyZWVOb2RlKGRhdGEpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5pc0xlYWYoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGEgbGVhZicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZ2V0TGVhZkRhdGEoKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmlzTGVhZigpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5kTm9kZSgpIHtcclxuICAgICAgICBsZXQgYW5kRGF0YSA9IGFuZ3VsYXIuY29weShkYXRhKTtcclxuICAgICAgICBhbmREYXRhLm9wZXJhdG9yID0gUG9saWN5VHJlZU5vZGUuT3BlcmF0b3IuQU5EO1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9saWN5VHJlZU5vZGUoYW5kRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2lzQW5kKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYW4gQU5EIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gY3JlYXRlQW5kTm9kZSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5pc0FuZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gT1Igbm9kZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmlzQW5kKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSBsZWFmIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gbmV3IFBvbGljeVRyZWVOb2RlKGdldExlYWZEYXRhKCkpO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5pc0FuZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc09yKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGFuIEFORCBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IGNyZWF0ZUFuZE5vZGUoKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNPcigpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYW4gT1Igbm9kZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZGF0YSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmlzT3IoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIGEgbGVhZiBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShnZXRMZWFmRGF0YSgpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNPcigpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdoYXNMaW5lSXRlbURlY2lzaW9uKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlcmUgaXMgbm8gc3RhdHVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShnZXRMZWFmRGF0YSgpKTtcclxuICAgICAgICAgICAgbm9kZS5zdGF0dXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmhhc0xpbmVJdGVtRGVjaXNpb24oKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGlzIG5vIGFjdGlvbiBvbiB0aGUgc3RhdHVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShnZXRMZWFmRGF0YSgpKTtcclxuICAgICAgICAgICAgbm9kZS5zdGF0dXNbMF0uYWN0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5oYXNMaW5lSXRlbURlY2lzaW9uKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB0aGVyZSBpcyBhIGNsZWFyIGFjdGlvbiBvbiB0aGUgc3RhdHVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShnZXRMZWFmRGF0YSgpKTtcclxuICAgICAgICAgICAgbm9kZS5zdGF0dXNbMF0uYWN0aW9uID0gJ0NsZWFyZWQnO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5oYXNMaW5lSXRlbURlY2lzaW9uKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHRoZXJlIGlzIGFuIGFjdGlvbiBvbiB0aGUgc3RhdHVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBQb2xpY3lUcmVlTm9kZShnZXRMZWFmRGF0YSgpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaGFzTGluZUl0ZW1EZWNpc2lvbigpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldExpbmVJdGVtRGVjaXNpb24oKScsICgpID0+IHtcclxuICAgICAgICBpdCgncmV0dXJucyBudWxsIGlmIHRoZXJlIGlzIG5vIHN0YXR1cycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZ2V0TGVhZkRhdGEoKSk7XHJcbiAgICAgICAgICAgIG5vZGUuc3RhdHVzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5nZXRMaW5lSXRlbURlY2lzaW9uKCkpLnRvQmVOdWxsKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBhY3Rpb24gb24gdGhlIHN0YXR1cycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZ2V0TGVhZkRhdGEoKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmdldExpbmVJdGVtRGVjaXNpb24oKSkudG9FcXVhbCgnQXBwcm92ZWQnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdoYXNTdGF0dXMoKScsICgpID0+IHtcclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpcyBzdGF0dXMgaXMgbnVsbCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZ2V0TGVhZkRhdGEoKSk7XHJcbiAgICAgICAgICAgIG5vZGUuc3RhdHVzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBleHBlY3Qobm9kZS5oYXNTdGF0dXMoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlzIHN0YXR1cyBpcyBlbXB0eScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZ2V0TGVhZkRhdGEoKSk7XHJcbiAgICAgICAgICAgIG5vZGUuc3RhdHVzID0gW107XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmhhc1N0YXR1cygpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBhIHN0YXR1cycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBuZXcgUG9saWN5VHJlZU5vZGUoZ2V0TGVhZkRhdGEoKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmhhc1N0YXR1cygpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTGVhZihzZWxlY3RlZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUG9saWN5VHJlZU5vZGUoe1xyXG4gICAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVOb25MZWFmKGlzQW5kLCBzZWxlY3RlZCwgLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvbGljeVRyZWVOb2RlKHtcclxuICAgICAgICAgICAgb3BlcmF0b3I6IChpc0FuZCkgPyBQb2xpY3lUcmVlTm9kZS5PcGVyYXRvci5BTkQgOiBQb2xpY3lUcmVlTm9kZS5PcGVyYXRvci5PUixcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnaXNSZXNvbHZlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIGEgc2VsZWN0ZWQgbGVhZicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxlYWYgPSBjcmVhdGVMZWFmKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QobGVhZi5pc1Jlc29sdmVkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhbiB1bi1zZWxlY3RlZCBsZWFmJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGVhZiA9IGNyZWF0ZUxlYWYoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QobGVhZi5pc1Jlc29sdmVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBhbiBBTkQgd2l0aCBhbGwgY2hpbGRyZW4gc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gY3JlYXRlTm9uTGVhZih0cnVlLCB0cnVlLCBjcmVhdGVMZWFmKHRydWUpLCBjcmVhdGVMZWFmKHRydWUpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNSZXNvbHZlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gQU5EIHdpdGggb25lIGNoaWxkIG5vdCBzZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBjcmVhdGVOb25MZWFmKHRydWUsIHRydWUsIGNyZWF0ZUxlYWYodHJ1ZSksIGNyZWF0ZUxlYWYoZmFsc2UpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNSZXNvbHZlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYW4gT1Igd2l0aCBvbmUgY2hpbGQgc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gY3JlYXRlTm9uTGVhZihmYWxzZSwgZmFsc2UsIGNyZWF0ZUxlYWYodHJ1ZSksIGNyZWF0ZUxlYWYoZmFsc2UpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNSZXNvbHZlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gT1Igd2l0aCBubyBjaGlsZHJlbiBzZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBjcmVhdGVOb25MZWFmKGZhbHNlLCBmYWxzZSwgY3JlYXRlTGVhZihmYWxzZSksIGNyZWF0ZUxlYWYoZmFsc2UpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNSZXNvbHZlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYXBwcm9wcmlhdGUgdmFsdWVzIGZvciBhIG11bHRpLWxldmVsIHZpb2xhdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gQU5EXHJcbiAgICAgICAgICAgIC8vICAgT1JcclxuICAgICAgICAgICAgLy8gICAgIHNlbGVjdGVkLCB1bnNlbGVjdGVkXHJcbiAgICAgICAgICAgIC8vICAgQU5EXHJcbiAgICAgICAgICAgIC8vICAgICBzZWxlY3RlZCwgc2VsZWN0ZWRcclxuICAgICAgICAgICAgbGV0IG5vZGUgPVxyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9uTGVhZih0cnVlLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb25MZWFmKGZhbHNlLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZih0cnVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZihmYWxzZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYodHJ1ZSwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxlYWYodHJ1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxlYWYodHJ1ZSkpKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5vZGUuaXNSZXNvbHZlZCgpKS50b0VxdWFsKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQU5EXHJcbiAgICAgICAgICAgIC8vICAgT1JcclxuICAgICAgICAgICAgLy8gICAgIHNlbGVjdGVkLCB1bnNlbGVjdGVkXHJcbiAgICAgICAgICAgIC8vICAgQU5EXHJcbiAgICAgICAgICAgIC8vICAgICBzZWxlY3RlZFxyXG4gICAgICAgICAgICAvLyAgICAgT1JcclxuICAgICAgICAgICAgLy8gICAgICAgc2VsZWN0ZWQsIHVuc2VsZWN0ZWRcclxuICAgICAgICAgICAgbm9kZSA9XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb25MZWFmKHRydWUsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYoZmFsc2UsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKHRydWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKGZhbHNlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm9uTGVhZih0cnVlLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZih0cnVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm9uTGVhZihmYWxzZSwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKHRydWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZihmYWxzZSkpKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmlzUmVzb2x2ZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE9SXHJcbiAgICAgICAgICAgIC8vICAgQU5EXHJcbiAgICAgICAgICAgIC8vICAgICBzZWxlY3RlZFxyXG4gICAgICAgICAgICAvLyAgICAgT1JcclxuICAgICAgICAgICAgLy8gICAgICAgdW5zZWxlY3RlZCwgdW5zZWxlY3RlZFxyXG4gICAgICAgICAgICAvLyAgIEFORFxyXG4gICAgICAgICAgICAvLyAgICAgc2VsZWN0ZWRcclxuICAgICAgICAgICAgLy8gICAgIEFORFxyXG4gICAgICAgICAgICAvLyAgICAgICBzZWxlY3RlZCwgdW5zZWxlY3RlZFxyXG4gICAgICAgICAgICBub2RlID1cclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYoZmFsc2UsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYodHJ1ZSwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxlYWYodHJ1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYoZmFsc2UsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZihmYWxzZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKGZhbHNlKSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYodHJ1ZSwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUxlYWYodHJ1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYodHJ1ZSwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKHRydWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZihmYWxzZSkpKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChub2RlLmlzUmVzb2x2ZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0U2VsZWN0ZWROb2RlcygpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IGFycmF5IHdoZW4gYSBsZWFmIGlzIG5vdCBzZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxlYWYgPSBjcmVhdGVMZWFmKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxlYWYuZ2V0U2VsZWN0ZWROb2RlcygpLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYSBsZWFmIHdoZW4gaXQgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsZWFmID0gY3JlYXRlTGVhZih0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxlYWYuZ2V0U2VsZWN0ZWROb2RlcygpKS50b0NvbnRhaW4obGVhZik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGFsbCBzZWxlY3RlZCBub2RlcyBpbiBhIHRyZWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDEgPSBjcmVhdGVMZWFmKHRydWUpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQyID0gY3JlYXRlTGVhZih0cnVlKTtcclxuICAgICAgICAgICAgLy8gTWFrZSBub2RlIG5vdCBtYW51YWxseSBzZWxlY3RlZCwgYnV0IFJlbWVkaWF0ZWQgb3V0c2lkZSBvZiB0aGUgdmlvbGF0aW9uXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDMgPSBjcmVhdGVMZWFmKGZhbHNlKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWQzLnN0YXR1cyA9IFtuZXcgUG9saWN5VHJlZU5vZGVTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdSZW1lZGlhdGVkJ1xyXG4gICAgICAgICAgICB9KV07XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb25MZWFmKHRydWUsIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkMSxcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb25MZWFmKGZhbHNlLCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTGVhZigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vbkxlYWYodHJ1ZSwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMZWFmKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDMpKSk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbm9kZS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RlZE5vZGVzLmxlbmd0aCkudG9FcXVhbCgzKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlbGVjdGVkTm9kZXMpLnRvQ29udGFpbihzZWxlY3RlZDEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2VsZWN0ZWROb2RlcykudG9Db250YWluKHNlbGVjdGVkMik7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWxlY3RlZE5vZGVzKS50b0NvbnRhaW4oc2VsZWN0ZWQzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
