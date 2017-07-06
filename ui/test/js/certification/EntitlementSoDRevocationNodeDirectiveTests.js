System.register(['certification/CertificationModule', 'test/js/TestInitializer'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            describe('EntitlementSoDRevocationNodeDirective', function () {

                var elementDefinition = '<sp-entitlement-sod-revocation-node policy-tree="policyTree"\n                in-and-node="inAndNode"\n                parent-selected="parentSelected"\n                root="root" />',
                    PolicyTreeNode = undefined,
                    $scope = undefined,
                    $compile = undefined,
                    $controller = undefined,
                    certificationTestData = undefined,
                    policyTree = undefined,
                    inAndNode = undefined,
                    parentSelected = undefined,
                    isRoot = undefined,
                    readOnly = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function ($rootScope, _$compile_, _$controller_, _PolicyTreeNode_, _certificationTestData_) {
                    $scope = $rootScope.$new();
                    $compile = _$compile_;
                    $controller = _$controller_;
                    certificationTestData = _certificationTestData_;
                    PolicyTreeNode = _PolicyTreeNode_;

                    policyTree = new PolicyTreeNode(certificationTestData.POLICY_TREE_NODE);
                    inAndNode = false;
                    parentSelected = false;
                    isRoot = true;
                    readOnly = false;
                }));

                function useLeaf() {
                    policyTree = policyTree.children[0];
                }

                describe('controller', function () {
                    function createController() {
                        return $controller('EntitlementSoDRevocationNodeDirectiveCtrl', null, {
                            policyTree: policyTree,
                            inAndNode: inAndNode,
                            parentSelected: parentSelected,
                            root: isRoot,
                            readOnly: readOnly
                        });
                    }

                    it('throws without a policy tree', function () {
                        policyTree = null;
                        expect(function () {
                            return createController();
                        }).toThrow();
                    });

                    describe('isSubtreeDecisionRequired()', function () {
                        beforeEach(function () {
                            // Setup the policy tree to be such that it requires a subtree decision.
                            inAndNode = true;
                            parentSelected = true;
                        });

                        it('returns false when not an OR node', function () {
                            policyTree.operator = PolicyTreeNode.Operator.AND;
                            var ctrl = createController();
                            expect(ctrl.isSubtreeDecisionRequired()).toEqual(false);
                        });

                        it('returns false when not inside of a AND node', function () {
                            inAndNode = false;
                            var ctrl = createController();
                            expect(ctrl.isSubtreeDecisionRequired()).toEqual(false);
                        });

                        it('returns false when parent AND node is not selected', function () {
                            parentSelected = false;
                            var ctrl = createController();
                            expect(ctrl.isSubtreeDecisionRequired()).toEqual(false);
                        });

                        it('returns false when parent AND node is selected and a child is selected', function () {
                            policyTree.children[0].selected = true;
                            var ctrl = createController();
                            expect(ctrl.isSubtreeDecisionRequired()).toEqual(false);
                        });

                        it('returns true when parent AND node is selected and no children are selectced', function () {
                            policyTree.children[0].selected = false;
                            var ctrl = createController();
                            expect(ctrl.isSubtreeDecisionRequired()).toEqual(true);
                        });
                    });

                    describe('isNodeSelected()', function () {
                        it('returns true if selected is true', function () {
                            useLeaf();
                            var ctrl = createController();
                            expect(ctrl.isNodeSelected()).toEqual(true);
                        });

                        it('returns false if selected is false', function () {
                            policyTree = policyTree.children[1];
                            var ctrl = createController();
                            expect(ctrl.isNodeSelected()).toEqual(false);
                        });

                        function testNodeSelectionWithDecision(decision, expectSelected) {
                            policyTree = angular.copy(policyTree.children[0]);
                            policyTree.selected = false;
                            policyTree.status[0].action = decision;
                            var ctrl = createController();
                            expect(ctrl.isNodeSelected()).toEqual(expectSelected);
                        }

                        it('returns true if selected is false but there is a Remediated decision', function () {
                            testNodeSelectionWithDecision('Remediated', true);
                        });

                        it('returns false if selected is false and there is a non-Remediated decision', function () {
                            testNodeSelectionWithDecision('Approved', false);
                        });
                    });

                    describe('selectNode()', function () {
                        it('selects the node', function () {
                            policyTree = policyTree.children[1];
                            var ctrl = createController();
                            ctrl.selectNode();
                            expect(policyTree.selected).toEqual(true);
                        });

                        it('selects all children of an AND node', function () {
                            policyTree.operator = PolicyTreeNode.Operator.AND;
                            var ctrl = createController();
                            ctrl.selectNode();
                            expect(policyTree.selected).toEqual(true);
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = policyTree.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var child = _step.value;

                                    expect(child.selected).toEqual(true);
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
                        });

                        it('does not select children of an OR node', function () {
                            policyTree.children[0].selected = false;
                            var ctrl = createController();
                            ctrl.selectNode();
                            expect(policyTree.selected).toEqual(true);
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = policyTree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var child = _step2.value;

                                    expect(child.selected).toEqual(false);
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                        _iterator2['return']();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        });
                    });

                    describe('deselectNode()', function () {
                        it('deselects the node', function () {
                            useLeaf();
                            var ctrl = createController();
                            ctrl.deselectNode();
                            expect(policyTree.selected).toEqual(false);
                        });

                        it('deselects all children of an AND node', function () {
                            policyTree.operator = PolicyTreeNode.Operator.AND;
                            var ctrl = createController();
                            ctrl.deselectNode();
                            expect(policyTree.selected).toEqual(false);
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = policyTree.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var child = _step3.value;

                                    expect(child.selected).toEqual(false);
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                                        _iterator3['return']();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }
                        });

                        it('does not deselect children of an OR node', function () {
                            var ctrl = createController();
                            ctrl.deselectNode();
                            expect(policyTree.selected).toEqual(false);
                            expect(policyTree.children[0].selected).toEqual(true);
                            expect(policyTree.children[1].selected).toEqual(false);
                        });
                    });

                    describe('isDisabled()', function () {
                        function testDisabled(expectDisabled) {
                            var ctrl = createController();
                            $scope.$apply();
                            expect(ctrl.isDisabled()).toEqual(expectDisabled);
                        }

                        it('returns true if there is a line item decision on all the child nodes', function () {
                            policyTree = new PolicyTreeNode(certificationTestData.POLICY_TREE_AND_NODE);
                            testDisabled(true);
                        });

                        it('returns true if readOnly is true', function () {
                            readOnly = true;
                            testDisabled(true);
                        });

                        it('returns false if there is not a line item decision on a child node', function () {
                            policyTree = new PolicyTreeNode(certificationTestData.POLICY_TREE_NODE);
                            testDisabled(false);
                        });
                    });
                });

                describe('html', function () {
                    function createElement(item) {
                        var element = angular.element(elementDefinition);
                        $scope.policyTree = policyTree;
                        $scope.inAndNode = inAndNode;
                        $scope.parentSelected = parentSelected;
                        $scope.root = isRoot;
                        $compile(element)($scope);
                        $scope.$apply();
                        return element;
                    }

                    it('throws without a policy tree', function () {
                        policyTree = null;
                        expect(function () {
                            return createElement();
                        }).toThrow();
                    });

                    function getButton(element, isAndNode) {
                        var parentClass = isAndNode ? '.policy-and-button' : '.header-cell';
                        return element.find(parentClass + ' button');
                    }

                    function isButtonSelected(element, isAndNode) {
                        var button = getButton(element, isAndNode);
                        return button.attr('aria-checked') === 'true';
                    }

                    describe('leaf node', function () {
                        beforeEach(function () {
                            useLeaf();
                        });

                        describe('button', function () {
                            function hasButton(element) {
                                return getButton(element).length === 1;
                            }

                            function isButtonDisabled(element) {
                                var button = getButton(element);
                                return button.hasClass('disabled');
                            }

                            it('is displayed if in not in an AND node', function () {
                                var element = createElement();
                                expect(hasButton(element)).toEqual(true);
                            });

                            it('is not displayed if in an AND node', function () {
                                inAndNode = true;
                                var element = createElement();
                                expect(hasButton(element)).toEqual(false);
                            });

                            it('is selected if node is selected', function () {
                                var element = createElement();
                                expect(isButtonSelected(element)).toEqual(true);
                            });

                            it('is not selected if node is unselected', function () {
                                policyTree.selected = false;
                                var element = createElement();
                                expect(isButtonSelected(element)).toEqual(false);
                            });

                            it('is disabled if there is a line item decision', function () {
                                var element = createElement();
                                expect(isButtonDisabled(element)).toEqual(true);
                            });

                            it('is enabled if there is no line item decision', function () {
                                policyTree.status[0].action = undefined;
                                var element = createElement();
                                expect(isButtonDisabled(element)).toEqual(false);
                            });

                            describe('click', function () {
                                beforeEach(function () {
                                    // Get rid of the previous decision to enable the button.
                                    policyTree.status[0].action = undefined;
                                });

                                function testClick(startSelected) {
                                    policyTree.selected = startSelected;
                                    var element = createElement();
                                    expect(isButtonSelected(element)).toEqual(startSelected);

                                    var button = getButton(element);
                                    button.click();
                                    $scope.$digest();

                                    expect(isButtonSelected(element)).toEqual(!startSelected);
                                }

                                it('selects the node', function () {
                                    testClick(false);
                                });

                                it('deselects the node', function () {
                                    testClick(true);
                                });
                            });
                        });

                        function checkBodyElement(element, text, isDescription) {
                            var description = element.find('.panel > .panel-body');
                            if (text) {
                                expect(description.length).toEqual(1);
                                var selector = isDescription ? 'div:not(.m-b-xs)' : 'div.m-b-xs';
                                var actualDescription = description.children(selector);
                                expect(actualDescription.length).toEqual(1);
                                expect(actualDescription[0].innerText.trim()).toEqual(text);
                            } else {
                                expect(description.length).toEqual(0);
                            }
                        }

                        describe('line item action', function () {
                            it('is displayed if available', function () {
                                var element = createElement();
                                checkBodyElement(element, 'cert_action_approved', false);
                            });

                            it('is not displayed for Clear action', function () {
                                policyTree.status[0].action = 'Cleared';
                                policyTree.description = null;
                                var element = createElement();
                                checkBodyElement(element, null, false);
                            });

                            it('is not displayed when there is no action', function () {
                                policyTree.status[0].action = undefined;
                                policyTree.description = null;
                                var element = createElement();
                                checkBodyElement(element, null, false);
                            });
                        });

                        describe('description', function () {
                            it('is displayed if available', function () {
                                var element = createElement();
                                checkBodyElement(element, policyTree.description, true);
                            });

                            it('is not displayed if not available', function () {
                                policyTree.description = undefined;
                                policyTree.status = undefined;
                                var element = createElement();
                                checkBodyElement(element, null, true);
                            });
                        });

                        it('shows the display value in the header', function () {
                            var element = createElement();
                            var displayValue = element.find('.header-cell-text').text().trim();
                            expect(displayValue).toEqual(policyTree.getDisplayableValue());
                        });

                        it('shows the application and attribute in the footer', function () {
                            var element = createElement();
                            var values = element.find('.panel-footer .attribute-pair').text();
                            expect(values).toMatch(policyTree.application);
                            expect(values).toMatch(policyTree.name);
                        });
                    });

                    describe('or nodes', function () {
                        function hasPanel(element) {
                            // Element is the sp-entitlement-sod-revocation-node, so the guts are in the first child.
                            var realElement = angular.element(element.children()[0]);
                            var panel = realElement.children('div.panel');
                            return panel.length === 1;
                        }

                        it('render a panel around a non-root', function () {
                            isRoot = false;
                            var element = createElement();
                            expect(hasPanel(element)).toEqual(true);
                        });

                        it('do not render a panel around the root', function () {
                            var element = createElement();
                            expect(hasPanel(element)).toEqual(false);
                        });

                        function checkHighlighted(element, expectHighlighted) {
                            var expectedCount = expectHighlighted ? 1 : 0;
                            expect(element.find('.subtree-decision-required').length).toEqual(expectedCount);
                            expect(element.find('.alert-danger').length).toEqual(expectedCount);
                        }

                        function testHighlight(expectHighlight) {
                            isRoot = false;
                            inAndNode = true;
                            parentSelected = true;

                            if (expectHighlight) {
                                policyTree.children[0].selected = false;
                            }

                            var element = createElement();
                            checkHighlighted(element, expectHighlight);
                        }

                        it('are highlighted if a subtree decision is required', function () {
                            testHighlight(true);
                        });

                        it('are not highlighted if a subtree decision is not required', function () {
                            testHighlight(false);
                        });
                    });

                    describe('and nodes', function () {
                        function selectChildren(select) {
                            var _iteratorNormalCompletion4 = true;
                            var _didIteratorError4 = false;
                            var _iteratorError4 = undefined;

                            try {
                                for (var _iterator4 = policyTree.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    var child = _step4.value;

                                    child.selected = select;
                                }
                            } catch (err) {
                                _didIteratorError4 = true;
                                _iteratorError4 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                                        _iterator4['return']();
                                    }
                                } finally {
                                    if (_didIteratorError4) {
                                        throw _iteratorError4;
                                    }
                                }
                            }
                        }

                        beforeEach(function () {
                            policyTree = new PolicyTreeNode(certificationTestData.POLICY_TREE_AND_NODE_NO_LINE_ITEM_DECISIONS);
                        });

                        function testButtonClick(startSelected) {
                            // Start with everything in a clean state.
                            policyTree.selected = startSelected;
                            selectChildren(startSelected);
                            var element = createElement();

                            var button = getButton(element, true);
                            button.click();
                            $scope.$digest();

                            expect(isButtonSelected(element, true)).toEqual(!startSelected);
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = policyTree.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var child = _step5.value;

                                    expect(child.selected).toEqual(!startSelected);
                                }
                            } catch (err) {
                                _didIteratorError5 = true;
                                _iteratorError5 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                                        _iterator5['return']();
                                    }
                                } finally {
                                    if (_didIteratorError5) {
                                        throw _iteratorError5;
                                    }
                                }
                            }
                        }

                        it('clicking button selects all children', function () {
                            testButtonClick(false);
                        });

                        it('clicking button deselects all children', function () {
                            testButtonClick(true);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uTm9kZURpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLHFDQUFxQyw0QkFBNEIsVUFBVSxTQUFTO0lBQ2pHOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsbUNBQW1DO1lBQ25ELHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0I7UUFDckMsU0FBUyxZQUFZOztZQUw3QixTQUFTLHlDQUF5QyxZQUFXOztnQkFFekQsSUFBSSxvQkFBaUI7b0JBS2pCLGlCQUFjO29CQUFFLFNBQU07b0JBQUUsV0FBUTtvQkFBRSxjQUFXO29CQUFFLHdCQUFxQjtvQkFDcEUsYUFBVTtvQkFBRSxZQUFTO29CQUFFLGlCQUFjO29CQUFFLFNBQU07b0JBQUUsV0FBUTs7Z0JBRTNELFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLFlBQVksWUFBWSxlQUFlLGtCQUFrQix5QkFBeUI7b0JBQ3pHLFNBQVMsV0FBVztvQkFDcEIsV0FBVztvQkFDWCxjQUFjO29CQUNkLHdCQUF3QjtvQkFDeEIsaUJBQWlCOztvQkFFakIsYUFBYSxJQUFJLGVBQWUsc0JBQXNCO29CQUN0RCxZQUFZO29CQUNaLGlCQUFpQjtvQkFDakIsU0FBUztvQkFDVCxXQUFXOzs7Z0JBR2YsU0FBUyxVQUFVO29CQUNmLGFBQWEsV0FBVyxTQUFTOzs7Z0JBR3JDLFNBQVMsY0FBYyxZQUFNO29CQUN6QixTQUFTLG1CQUFtQjt3QkFDeEIsT0FBTyxZQUFZLDZDQUE2QyxNQUFNOzRCQUNsRSxZQUFZOzRCQUNaLFdBQVc7NEJBQ1gsZ0JBQWdCOzRCQUNoQixNQUFNOzRCQUNOLFVBQVU7Ozs7b0JBSWxCLEdBQUcsZ0NBQWdDLFlBQU07d0JBQ3BDLGFBQWE7d0JBQ2IsT0FBTyxZQUFBOzRCQVlRLE9BWkY7MkJBQW9COzs7b0JBR3RDLFNBQVMsK0JBQStC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Y2VydGlmaWNhdGlvbi9FbnRpdGxlbWVudFNvRFJldm9jYXRpb25Ob2RlRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuXHJcbmRlc2NyaWJlKCdFbnRpdGxlbWVudFNvRFJldm9jYXRpb25Ob2RlRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgbGV0IGVsZW1lbnREZWZpbml0aW9uID1cclxuICAgICAgICAgICAgYDxzcC1lbnRpdGxlbWVudC1zb2QtcmV2b2NhdGlvbi1ub2RlIHBvbGljeS10cmVlPVwicG9saWN5VHJlZVwiXHJcbiAgICAgICAgICAgICAgICBpbi1hbmQtbm9kZT1cImluQW5kTm9kZVwiXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQtc2VsZWN0ZWQ9XCJwYXJlbnRTZWxlY3RlZFwiXHJcbiAgICAgICAgICAgICAgICByb290PVwicm9vdFwiIC8+YCxcclxuICAgICAgICBQb2xpY3lUcmVlTm9kZSwgJHNjb3BlLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIGNlcnRpZmljYXRpb25UZXN0RGF0YSxcclxuICAgICAgICBwb2xpY3lUcmVlLCBpbkFuZE5vZGUsIHBhcmVudFNlbGVjdGVkLCBpc1Jvb3QsIHJlYWRPbmx5O1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCBfJGNvbXBpbGVfLCBfJGNvbnRyb2xsZXJfLCBfUG9saWN5VHJlZU5vZGVfLCBfY2VydGlmaWNhdGlvblRlc3REYXRhXykge1xyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XHJcbiAgICAgICAgUG9saWN5VHJlZU5vZGUgPSBfUG9saWN5VHJlZU5vZGVfO1xyXG5cclxuICAgICAgICBwb2xpY3lUcmVlID0gbmV3IFBvbGljeVRyZWVOb2RlKGNlcnRpZmljYXRpb25UZXN0RGF0YS5QT0xJQ1lfVFJFRV9OT0RFKTtcclxuICAgICAgICBpbkFuZE5vZGUgPSBmYWxzZTtcclxuICAgICAgICBwYXJlbnRTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlzUm9vdCA9IHRydWU7XHJcbiAgICAgICAgcmVhZE9ubHkgPSBmYWxzZTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiB1c2VMZWFmKCkge1xyXG4gICAgICAgIHBvbGljeVRyZWUgPSBwb2xpY3lUcmVlLmNoaWxkcmVuWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2NyaWJlKCdjb250cm9sbGVyJywgKCkgPT4ge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkY29udHJvbGxlcignRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uTm9kZURpcmVjdGl2ZUN0cmwnLCBudWxsLCB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlOiBwb2xpY3lUcmVlLFxyXG4gICAgICAgICAgICAgICAgaW5BbmROb2RlOiBpbkFuZE5vZGUsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRTZWxlY3RlZDogcGFyZW50U2VsZWN0ZWQsXHJcbiAgICAgICAgICAgICAgICByb290OiBpc1Jvb3QsXHJcbiAgICAgICAgICAgICAgICByZWFkT25seTogcmVhZE9ubHlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgYSBwb2xpY3kgdHJlZScsICgpID0+IHtcclxuICAgICAgICAgICAgIHBvbGljeVRyZWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUNvbnRyb2xsZXIoKSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnaXNTdWJ0cmVlRGVjaXNpb25SZXF1aXJlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFNldHVwIHRoZSBwb2xpY3kgdHJlZSB0byBiZSBzdWNoIHRoYXQgaXQgcmVxdWlyZXMgYSBzdWJ0cmVlIGRlY2lzaW9uLlxyXG4gICAgICAgICAgICAgICAgaW5BbmROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIG5vdCBhbiBPUiBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZS5vcGVyYXRvciA9IFBvbGljeVRyZWVOb2RlLk9wZXJhdG9yLkFORDtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTdWJ0cmVlRGVjaXNpb25SZXF1aXJlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIG5vdCBpbnNpZGUgb2YgYSBBTkQgbm9kZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGluQW5kTm9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc1N1YnRyZWVEZWNpc2lvblJlcXVpcmVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gcGFyZW50IEFORCBub2RlIGlzIG5vdCBzZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU3VidHJlZURlY2lzaW9uUmVxdWlyZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgZmFsc2Ugd2hlbiBwYXJlbnQgQU5EIG5vZGUgaXMgc2VsZWN0ZWQgYW5kIGEgY2hpbGQgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLmNoaWxkcmVuWzBdLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTdWJ0cmVlRGVjaXNpb25SZXF1aXJlZCgpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0cnVlIHdoZW4gcGFyZW50IEFORCBub2RlIGlzIHNlbGVjdGVkIGFuZCBubyBjaGlsZHJlbiBhcmUgc2VsZWN0Y2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZS5jaGlsZHJlblswXS5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc1N1YnRyZWVEZWNpc2lvblJlcXVpcmVkKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnaXNOb2RlU2VsZWN0ZWQoKScsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBzZWxlY3RlZCBpcyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXNlTGVhZigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc05vZGVTZWxlY3RlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHNlbGVjdGVkIGlzIGZhbHNlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZSA9IHBvbGljeVRyZWUuY2hpbGRyZW5bMV07XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzTm9kZVNlbGVjdGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRlc3ROb2RlU2VsZWN0aW9uV2l0aERlY2lzaW9uKGRlY2lzaW9uLCBleHBlY3RTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZSA9IGFuZ3VsYXIuY29weShwb2xpY3lUcmVlLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgICAgICAgIHBvbGljeVRyZWUuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHBvbGljeVRyZWUuc3RhdHVzWzBdLmFjdGlvbiA9IGRlY2lzaW9uO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc05vZGVTZWxlY3RlZCgpKS50b0VxdWFsKGV4cGVjdFNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBzZWxlY3RlZCBpcyBmYWxzZSBidXQgdGhlcmUgaXMgYSBSZW1lZGlhdGVkIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVzdE5vZGVTZWxlY3Rpb25XaXRoRGVjaXNpb24oJ1JlbWVkaWF0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBzZWxlY3RlZCBpcyBmYWxzZSBhbmQgdGhlcmUgaXMgYSBub24tUmVtZWRpYXRlZCBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlc3ROb2RlU2VsZWN0aW9uV2l0aERlY2lzaW9uKCdBcHByb3ZlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdzZWxlY3ROb2RlKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdzZWxlY3RzIHRoZSBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZSA9IHBvbGljeVRyZWUuY2hpbGRyZW5bMV07XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2VsZWN0Tm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHBvbGljeVRyZWUuc2VsZWN0ZWQpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3NlbGVjdHMgYWxsIGNoaWxkcmVuIG9mIGFuIEFORCBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZS5vcGVyYXRvciA9IFBvbGljeVRyZWVOb2RlLk9wZXJhdG9yLkFORDtcclxuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3ROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocG9saWN5VHJlZS5zZWxlY3RlZCkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHBvbGljeVRyZWUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2hpbGQuc2VsZWN0ZWQpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IHNlbGVjdCBjaGlsZHJlbiBvZiBhbiBPUiBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9saWN5VHJlZS5jaGlsZHJlblswXS5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwb2xpY3lUcmVlLnNlbGVjdGVkKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgcG9saWN5VHJlZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjaGlsZC5zZWxlY3RlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnZGVzZWxlY3ROb2RlKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdkZXNlbGVjdHMgdGhlIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1c2VMZWFmKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuZGVzZWxlY3ROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocG9saWN5VHJlZS5zZWxlY3RlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2Rlc2VsZWN0cyBhbGwgY2hpbGRyZW4gb2YgYW4gQU5EIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLm9wZXJhdG9yID0gUG9saWN5VHJlZU5vZGUuT3BlcmF0b3IuQU5EO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmRlc2VsZWN0Tm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHBvbGljeVRyZWUuc2VsZWN0ZWQpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgcG9saWN5VHJlZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjaGlsZC5zZWxlY3RlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGRlc2VsZWN0IGNoaWxkcmVuIG9mIGFuIE9SIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuZGVzZWxlY3ROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocG9saWN5VHJlZS5zZWxlY3RlZCkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QocG9saWN5VHJlZS5jaGlsZHJlblswXS5zZWxlY3RlZCkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChwb2xpY3lUcmVlLmNoaWxkcmVuWzFdLnNlbGVjdGVkKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdpc0Rpc2FibGVkKCknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRlc3REaXNhYmxlZChleHBlY3REaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc0Rpc2FibGVkKCkpLnRvRXF1YWwoZXhwZWN0RGlzYWJsZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHRoZXJlIGlzIGEgbGluZSBpdGVtIGRlY2lzaW9uIG9uIGFsbCB0aGUgY2hpbGQgbm9kZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlID0gbmV3IFBvbGljeVRyZWVOb2RlKGNlcnRpZmljYXRpb25UZXN0RGF0YS5QT0xJQ1lfVFJFRV9BTkRfTk9ERSk7XHJcbiAgICAgICAgICAgICAgICB0ZXN0RGlzYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiByZWFkT25seSBpcyB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGVzdERpc2FibGVkKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGlzIG5vdCBhIGxpbmUgaXRlbSBkZWNpc2lvbiBvbiBhIGNoaWxkIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlID0gbmV3IFBvbGljeVRyZWVOb2RlKGNlcnRpZmljYXRpb25UZXN0RGF0YS5QT0xJQ1lfVFJFRV9OT0RFKTtcclxuICAgICAgICAgICAgICAgIHRlc3REaXNhYmxlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2h0bWwnLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLnBvbGljeVRyZWUgPSBwb2xpY3lUcmVlO1xyXG4gICAgICAgICAgICAkc2NvcGUuaW5BbmROb2RlID0gaW5BbmROb2RlO1xyXG4gICAgICAgICAgICAkc2NvcGUucGFyZW50U2VsZWN0ZWQgPSBwYXJlbnRTZWxlY3RlZDtcclxuICAgICAgICAgICAgJHNjb3BlLnJvb3QgPSBpc1Jvb3Q7XHJcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgYSBwb2xpY3kgdHJlZScsICgpID0+IHtcclxuICAgICAgICAgICAgcG9saWN5VHJlZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVFbGVtZW50KCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QnV0dG9uKGVsZW1lbnQsIGlzQW5kTm9kZSkge1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50Q2xhc3MgPSAoaXNBbmROb2RlKSA/ICcucG9saWN5LWFuZC1idXR0b24nIDogJy5oZWFkZXItY2VsbCc7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmZpbmQoYCR7cGFyZW50Q2xhc3N9IGJ1dHRvbmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNCdXR0b25TZWxlY3RlZChlbGVtZW50LCBpc0FuZE5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGdldEJ1dHRvbihlbGVtZW50LCBpc0FuZE5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGJ1dHRvbi5hdHRyKCdhcmlhLWNoZWNrZWQnKSA9PT0gJ3RydWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdsZWFmIG5vZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXNlTGVhZigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRlc2NyaWJlKCdidXR0b24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYXNCdXR0b24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoZ2V0QnV0dG9uKGVsZW1lbnQpLmxlbmd0aCA9PT0gMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNCdXR0b25EaXNhYmxlZChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGdldEJ1dHRvbihlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uLmhhc0NsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGl0KCdpcyBkaXNwbGF5ZWQgaWYgaW4gbm90IGluIGFuIEFORCBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChoYXNCdXR0b24oZWxlbWVudCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpdCgnaXMgbm90IGRpc3BsYXllZCBpZiBpbiBhbiBBTkQgbm9kZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpbkFuZE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChoYXNCdXR0b24oZWxlbWVudCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXQoJ2lzIHNlbGVjdGVkIGlmIG5vZGUgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGlzQnV0dG9uU2VsZWN0ZWQoZWxlbWVudCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpdCgnaXMgbm90IHNlbGVjdGVkIGlmIG5vZGUgaXMgdW5zZWxlY3RlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGlzQnV0dG9uU2VsZWN0ZWQoZWxlbWVudCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXQoJ2lzIGRpc2FibGVkIGlmIHRoZXJlIGlzIGEgbGluZSBpdGVtIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChpc0J1dHRvbkRpc2FibGVkKGVsZW1lbnQpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXQoJ2lzIGVuYWJsZWQgaWYgdGhlcmUgaXMgbm8gbGluZSBpdGVtIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvbGljeVRyZWUuc3RhdHVzWzBdLmFjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoaXNCdXR0b25EaXNhYmxlZChlbGVtZW50KSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZXNjcmliZSgnY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCByaWQgb2YgdGhlIHByZXZpb3VzIGRlY2lzaW9uIHRvIGVuYWJsZSB0aGUgYnV0dG9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLnN0YXR1c1swXS5hY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRlc3RDbGljayhzdGFydFNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbGljeVRyZWUuc2VsZWN0ZWQgPSBzdGFydFNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGlzQnV0dG9uU2VsZWN0ZWQoZWxlbWVudCkpLnRvRXF1YWwoc3RhcnRTZWxlY3RlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnV0dG9uID0gZ2V0QnV0dG9uKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChpc0J1dHRvblNlbGVjdGVkKGVsZW1lbnQpKS50b0VxdWFsKCFzdGFydFNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0KCdzZWxlY3RzIHRoZSBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0Q2xpY2soZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpdCgnZGVzZWxlY3RzIHRoZSBub2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0Q2xpY2sodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjaGVja0JvZHlFbGVtZW50KGVsZW1lbnQsIHRleHQsIGlzRGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IGVsZW1lbnQuZmluZCgnLnBhbmVsID4gLnBhbmVsLWJvZHknKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGRlc2NyaXB0aW9uLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0b3IgPSAoaXNEZXNjcmlwdGlvbikgPyAnZGl2Om5vdCgubS1iLXhzKScgOiAnZGl2Lm0tYi14cyc7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFjdHVhbERlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24uY2hpbGRyZW4oc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChhY3R1YWxEZXNjcmlwdGlvbi5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGFjdHVhbERlc2NyaXB0aW9uWzBdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwodGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoZGVzY3JpcHRpb24ubGVuZ3RoKS50b0VxdWFsKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkZXNjcmliZSgnbGluZSBpdGVtIGFjdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGl0KCdpcyBkaXNwbGF5ZWQgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQm9keUVsZW1lbnQoZWxlbWVudCwgJ2NlcnRfYWN0aW9uX2FwcHJvdmVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXQoJ2lzIG5vdCBkaXNwbGF5ZWQgZm9yIENsZWFyIGFjdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLnN0YXR1c1swXS5hY3Rpb24gPSAnQ2xlYXJlZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9saWN5VHJlZS5kZXNjcmlwdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tCb2R5RWxlbWVudChlbGVtZW50LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpdCgnaXMgbm90IGRpc3BsYXllZCB3aGVuIHRoZXJlIGlzIG5vIGFjdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLnN0YXR1c1swXS5hY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9saWN5VHJlZS5kZXNjcmlwdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tCb2R5RWxlbWVudChlbGVtZW50LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkZXNjcmliZSgnZGVzY3JpcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdCgnaXMgZGlzcGxheWVkIGlmIGF2YWlsYWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0JvZHlFbGVtZW50KGVsZW1lbnQsIHBvbGljeVRyZWUuZGVzY3JpcHRpb24sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXQoJ2lzIG5vdCBkaXNwbGF5ZWQgaWYgbm90IGF2YWlsYWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLmRlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvbGljeVRyZWUuc3RhdHVzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQm9keUVsZW1lbnQoZWxlbWVudCwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2hvd3MgdGhlIGRpc3BsYXkgdmFsdWUgaW4gdGhlIGhlYWRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpc3BsYXlWYWx1ZSA9IGVsZW1lbnQuZmluZCgnLmhlYWRlci1jZWxsLXRleHQnKS50ZXh0KCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGRpc3BsYXlWYWx1ZSkudG9FcXVhbChwb2xpY3lUcmVlLmdldERpc3BsYXlhYmxlVmFsdWUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ3Nob3dzIHRoZSBhcHBsaWNhdGlvbiBhbmQgYXR0cmlidXRlIGluIHRoZSBmb290ZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBlbGVtZW50LmZpbmQoJy5wYW5lbC1mb290ZXIgLmF0dHJpYnV0ZS1wYWlyJykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHZhbHVlcykudG9NYXRjaChwb2xpY3lUcmVlLmFwcGxpY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdCh2YWx1ZXMpLnRvTWF0Y2gocG9saWN5VHJlZS5uYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdvciBub2RlcycsICgpID0+IHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gaGFzUGFuZWwoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRWxlbWVudCBpcyB0aGUgc3AtZW50aXRsZW1lbnQtc29kLXJldm9jYXRpb24tbm9kZSwgc28gdGhlIGd1dHMgYXJlIGluIHRoZSBmaXJzdCBjaGlsZC5cclxuICAgICAgICAgICAgICAgIGxldCByZWFsRWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmNoaWxkcmVuKClbMF0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhbmVsID0gcmVhbEVsZW1lbnQuY2hpbGRyZW4oJ2Rpdi5wYW5lbCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChwYW5lbC5sZW5ndGggPT09IDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgncmVuZGVyIGEgcGFuZWwgYXJvdW5kIGEgbm9uLXJvb3QnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpc1Jvb3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGhhc1BhbmVsKGVsZW1lbnQpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdkbyBub3QgcmVuZGVyIGEgcGFuZWwgYXJvdW5kIHRoZSByb290JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoaGFzUGFuZWwoZWxlbWVudCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrSGlnaGxpZ2h0ZWQoZWxlbWVudCwgZXhwZWN0SGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBleHBlY3RlZENvdW50ID0gKGV4cGVjdEhpZ2hsaWdodGVkKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLnN1YnRyZWUtZGVjaXNpb24tcmVxdWlyZWQnKS5sZW5ndGgpLnRvRXF1YWwoZXhwZWN0ZWRDb3VudCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuYWxlcnQtZGFuZ2VyJykubGVuZ3RoKS50b0VxdWFsKGV4cGVjdGVkQ291bnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB0ZXN0SGlnaGxpZ2h0KGV4cGVjdEhpZ2hsaWdodCkge1xyXG4gICAgICAgICAgICAgICAgaXNSb290ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpbkFuZE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50U2VsZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChleHBlY3RIaWdobGlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLmNoaWxkcmVuWzBdLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBjaGVja0hpZ2hsaWdodGVkKGVsZW1lbnQsIGV4cGVjdEhpZ2hsaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0KCdhcmUgaGlnaGxpZ2h0ZWQgaWYgYSBzdWJ0cmVlIGRlY2lzaW9uIGlzIHJlcXVpcmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVzdEhpZ2hsaWdodCh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnYXJlIG5vdCBoaWdobGlnaHRlZCBpZiBhIHN1YnRyZWUgZGVjaXNpb24gaXMgbm90IHJlcXVpcmVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVzdEhpZ2hsaWdodChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnYW5kIG5vZGVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZWxlY3RDaGlsZHJlbihzZWxlY3QpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHBvbGljeVRyZWUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5zZWxlY3RlZCA9IHNlbGVjdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlID0gbmV3IFBvbGljeVRyZWVOb2RlKGNlcnRpZmljYXRpb25UZXN0RGF0YS5QT0xJQ1lfVFJFRV9BTkRfTk9ERV9OT19MSU5FX0lURU1fREVDSVNJT05TKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB0ZXN0QnV0dG9uQ2xpY2soc3RhcnRTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgd2l0aCBldmVyeXRoaW5nIGluIGEgY2xlYW4gc3RhdGUuXHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlLnNlbGVjdGVkID0gc3RhcnRTZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIHNlbGVjdENoaWxkcmVuKHN0YXJ0U2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGdldEJ1dHRvbihlbGVtZW50LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHBlY3QoaXNCdXR0b25TZWxlY3RlZChlbGVtZW50LCB0cnVlKSkudG9FcXVhbCghc3RhcnRTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBwb2xpY3lUcmVlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNoaWxkLnNlbGVjdGVkKS50b0VxdWFsKCFzdGFydFNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXQoJ2NsaWNraW5nIGJ1dHRvbiBzZWxlY3RzIGFsbCBjaGlsZHJlbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlc3RCdXR0b25DbGljayhmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXQoJ2NsaWNraW5nIGJ1dHRvbiBkZXNlbGVjdHMgYWxsIGNoaWxkcmVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVzdEJ1dHRvbkNsaWNrKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
