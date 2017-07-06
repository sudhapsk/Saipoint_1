System.register(['test/js/TestInitializer', 'common/tree/TreeModule'], function (_export) {
    'use strict';

    var treeModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonTreeTreeModule) {
            treeModule = _commonTreeTreeModule['default'];
        }],
        execute: function () {

            describe('TreeDirective', function () {

                var eltDef = '<sp-tree sp-nodes="nodes">{{ node.name }}</sp-tree>';

                var $compile = undefined,
                    $scope = undefined,
                    element = undefined,
                    nodes = undefined,
                    loadFunc = undefined,
                    gramps = undefined,
                    granny = undefined,
                    parents = undefined;

                beforeEach(module(treeModule));

                beforeEach(inject(function (_$compile_, $rootScope, $q) {
                    $compile = _$compile_;
                    $scope = $rootScope.$new();

                    // Make some tree nodes to test with.
                    parents = [{
                        name: 'Dad',
                        hasChildren: true,
                        children: [{
                            name: 'Me',
                            hasChildren: false
                        }, {
                            name: 'Bro',
                            hasChildren: false
                        }, {
                            name: 'Sis',
                            hasChildren: false
                        }]
                    }];

                    gramps = {
                        name: 'Granddaddy',
                        hasChildren: true,
                        children: parents
                    };

                    granny = {
                        name: 'Granny',
                        hasChildren: false
                    };

                    nodes = [gramps, granny];

                    // Mock out a load function that always returns the "parents" nodes.
                    loadFunc = jasmine.createSpy('loaderFunc').and.callFake(function (node) {
                        return $q.when(parents);
                    });
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                function compile() {
                    var elt = arguments.length <= 0 || arguments[0] === undefined ? eltDef : arguments[0];

                    $scope.nodes = nodes;
                    $scope.loadFunc = loadFunc;
                    element = angular.element(elt);
                    $compile(element)($scope);
                    $scope.$digest();
                }

                /**
                 * Get the node <li> for the node with the given name.
                 */
                function getNode(nodeName) {
                    var label = element.find('span:contains(\'' + nodeName + '\')');
                    expect(label.length).toEqual(1);
                    var nodes = label.parents('.angular-ui-tree-node');
                    expect(nodes.length).toBeGreaterThan(0);

                    // Return the closest parent (these are returned first from the parents() call).
                    return angular.element(nodes[0]);
                }

                function getNodeContent(node) {
                    // Node has two pieces - content and subtree.
                    return angular.element(node.children()[0]);
                }

                function getSubtree(node) {
                    // Node has two pieces - content and subtree.
                    return angular.element(node.children()[1]);
                }

                function getExpander(node) {
                    var expanders = getNodeContent(node).find('.angular-ui-tree-node-toggle');
                    return expanders.length ? angular.element(expanders[0]) : null;
                }

                function hasExpander(node) {
                    return getExpander(node) !== null;
                }

                function hasSubTree(node) {
                    return getSubtree(node).find('li').length > 0;
                }

                /**
                 * Recursively rename the property in the given names from oldName to newName.
                 */
                function renameNodeProperty(nodes, oldName, newName) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var node = _step.value;

                            // Save the children first in case we rename this.
                            var children = node.children;

                            // Rename and delete the old one.
                            node[newName] = node[oldName];
                            delete node[oldName];

                            // Recurse.
                            if (children && angular.isArray(children) && children.length > 0) {
                                renameNodeProperty(children, oldName, newName);
                            }
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
                }

                function testSubtreeAndExpander() {
                    var grampsNode = getNode(gramps.name);
                    var grannyNode = getNode(granny.name);

                    expect(hasExpander(grampsNode)).toEqual(true);
                    expect(hasSubTree(grampsNode)).toEqual(true);
                    expect(hasExpander(grannyNode)).toEqual(false);
                    expect(hasSubTree(grannyNode)).toEqual(false);
                }

                it('uses "hasChildren" and "children" to find node children when not specified', function () {
                    compile();
                    testSubtreeAndExpander();
                });

                it('uses "hasChildrenProperty" when specified', function () {
                    renameNodeProperty(nodes, 'hasChildren', 'zanzibar');
                    compile('<sp-tree sp-nodes="nodes" sp-has-children-property="zanzibar">{{ node.name }}</sp-tree>');
                    testSubtreeAndExpander();
                });

                it('uses "childrenProperty" when specified', function () {
                    renameNodeProperty(nodes, 'children', 'zanzibar');
                    compile('<sp-tree sp-nodes="nodes" sp-children-property="zanzibar">{{ node.name }}</sp-tree>');
                    testSubtreeAndExpander();
                });

                describe('load children function', function () {
                    var loaderElt = '<sp-tree sp-nodes="nodes" sp-load-children-function="loadFunc"' + 'sp-auto-expand-root="false">{{ node.name }}</sp-tree>';

                    it('renders pre-loaded children if load function is null', function () {
                        compile();
                        var allNodes = element.find('.angular-ui-tree-node');
                        expect(allNodes.length).toEqual(6);
                    });

                    function expandGramps() {
                        compile(loaderElt);
                        var grampsNode = getNode(gramps.name);
                        var expander = getExpander(grampsNode);
                        return expander;
                    }

                    it('is not called when expanding pre-loaded children', function () {
                        var toggle = expandGramps();
                        toggle.click();
                        expect(loadFunc).not.toHaveBeenCalled();
                    });

                    it('is called if node is expanding', function () {
                        nodes = [gramps, granny];
                        var toggle = expandGramps();
                        toggle.click();
                        gramps.children = null;
                        toggle.click();
                        toggle.click();
                        expect(gramps.children).toEqual(parents);
                        expect(loadFunc).toHaveBeenCalledWith(gramps);
                    });

                    it('is not called if node is collapsing', function () {
                        gramps.children = null;
                        nodes = [gramps, granny];
                        var toggle = expandGramps();
                        toggle.click();
                        loadFunc.calls.reset();
                        toggle.click();
                        expect(loadFunc).not.toHaveBeenCalled();
                    });

                    it('is not called again if node has already been expanded', function () {
                        var toggle = expandGramps();
                        gramps.children = null;
                        toggle.click();
                        loadFunc.calls.reset();
                        toggle.click();
                        expect(loadFunc).not.toHaveBeenCalled();
                    });

                    it('is not called again if node is auto expanded', function () {
                        loaderElt = '<sp-tree sp-nodes="nodes" sp-load-children-function="loadFunc"' + 'sp-auto-expand-root="true">{{ node.name }}</sp-tree>';
                        var toggle = expandGramps();
                        toggle.click();
                        gramps.children = null;
                        toggle.click();
                        loadFunc.calls.reset();
                        toggle.click();
                        expect(loadFunc).not.toHaveBeenCalled();
                    });

                    it('is not called for if node is auto expanded', function () {
                        loaderElt = '<sp-tree sp-nodes="nodes" sp-load-children-function="loadFunc"' + 'sp-auto-expand-root="true">{{ node.name }}</sp-tree>';
                        expandGramps();
                        expect(loadFunc).not.toHaveBeenCalled();
                    });
                });

                describe('selection', function () {
                    var selectionElt = '<sp-tree sp-nodes="nodes" sp-selected-node="selected" sp-auto-expand-root="false">' + '{{ node.name }}</sp-tree>';

                    function clickGramps() {
                        compile(selectionElt);
                        var grampsNode = getNode(gramps.name);
                        var content = getNodeContent(grampsNode);
                        var clicker = content.find('a.angular-ui-tree-node-content');
                        expect(clicker.length).toEqual(1);
                        clicker.click();
                        return clicker;
                    }

                    it('updates the bound selectedNode', function () {
                        clickGramps();
                        expect($scope.selected).toEqual(gramps);
                    });

                    it('marks the node as selected', function () {
                        var clicker = clickGramps();
                        expect(clicker.hasClass('angular-ui-tree-node-selected')).toEqual(true);
                    });
                });

                describe('expander', function () {
                    it('is rendered for a node with children', function () {
                        compile();
                        var grampsNode = getNode(gramps.name);
                        expect(hasExpander(grampsNode)).toEqual(true);
                    });

                    it('is not rendered for a node without children', function () {
                        compile();
                        var grannyNode = getNode(granny.name);
                        expect(hasExpander(grannyNode)).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi90cmVlL1RyZWVEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLFVBQVUsU0FBUztJQUN0Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsdUJBQXVCO1lBQzdFLGFBQWEsc0JBQXNCOztRQUV2QyxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsaUJBQWlCLFlBQU07O2dCQUU1QixJQUFJLFNBQU07O2dCQUVWLElBQUksV0FBUTtvQkFBRSxTQUFNO29CQUFFLFVBQU87b0JBQUUsUUFBSztvQkFBRSxXQUFRO29CQUFFLFNBQU07b0JBQUUsU0FBTTtvQkFBRSxVQUFPOztnQkFFdkUsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMsWUFBWSxZQUFZLElBQU87b0JBQzlDLFdBQVc7b0JBQ1gsU0FBUyxXQUFXOzs7b0JBR3BCLFVBQVUsQ0FBQzt3QkFDUCxNQUFNO3dCQUNOLGFBQWE7d0JBQ2IsVUFBVSxDQUFDOzRCQUNQLE1BQU07NEJBQ04sYUFBYTsyQkFDZDs0QkFDQyxNQUFNOzRCQUNOLGFBQWE7MkJBQ2Q7NEJBQ0MsTUFBTTs0QkFDTixhQUFhOzs7O29CQUlyQixTQUFTO3dCQUNMLE1BQU07d0JBQ04sYUFBYTt3QkFDYixVQUFVOzs7b0JBR2QsU0FBUzt3QkFDTCxNQUFNO3dCQUNOLGFBQWE7OztvQkFHakIsUUFBUSxDQUFFLFFBQVE7OztvQkFHbEIsV0FBVyxRQUFRLFVBQVUsY0FBYyxJQUFJLFNBQVMsVUFBQyxNQUFTO3dCQUM5RCxPQUFPLEdBQUcsS0FBSzs7OztnQkFJdkIsVUFBVSxZQUFNO29CQUNaLElBQUksU0FBUzt3QkFDVCxRQUFROzs7O2dCQUloQixTQUFTLFVBQXNCO29CQWVmLElBZkMsTUFBRyxVQUFBLFVBQUEsS0FBQSxVQUFBLE9BQUEsWUFBRyxTQUFNLFVBQUE7O29CQUN6QixP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QVMsa0NBQWtDLFFBQVE7Ozs7Z0JBSTFFLFNBQVMsWUFBWSxZQUFNO29CQUN2QixHQUFHLHdDQUF3QyxZQUFNO3dCQUM3Qzt3QkFDQSxJQUFJLGFBQWEsUUFBUSxPQUFPO3dCQUNoQyxPQUFPLFlBQVksYUFBYSxRQUFROzs7b0JBRzVDLEdBQUcsK0NBQStDLFlBQU07d0JBQ3BEO3dCQUNBLElBQUksYUFBYSxRQUFRLE9BQU87d0JBQ2hDLE9BQU8sWUFBWSxhQUFhLFFBQVE7Ozs7OztHQXNDakQiLCJmaWxlIjoiY29tbW9uL3RyZWUvVHJlZURpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCB0cmVlTW9kdWxlIGZyb20gJ2NvbW1vbi90cmVlL1RyZWVNb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ1RyZWVEaXJlY3RpdmUnLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0IGVsdERlZiA9IGA8c3AtdHJlZSBzcC1ub2Rlcz1cIm5vZGVzXCI+e3sgbm9kZS5uYW1lIH19PC9zcC10cmVlPmA7XHJcblxyXG4gICAgbGV0ICRjb21waWxlLCAkc2NvcGUsIGVsZW1lbnQsIG5vZGVzLCBsb2FkRnVuYywgZ3JhbXBzLCBncmFubnksIHBhcmVudHM7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUodHJlZU1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJGNvbXBpbGVfLCAkcm9vdFNjb3BlLCAkcSkgPT4ge1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzb21lIHRyZWUgbm9kZXMgdG8gdGVzdCB3aXRoLlxyXG4gICAgICAgIHBhcmVudHMgPSBbe1xyXG4gICAgICAgICAgICBuYW1lOiAnRGFkJyxcclxuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ01lJyxcclxuICAgICAgICAgICAgICAgIGhhc0NoaWxkcmVuOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQnJvJyxcclxuICAgICAgICAgICAgICAgIGhhc0NoaWxkcmVuOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnU2lzJyxcclxuICAgICAgICAgICAgICAgIGhhc0NoaWxkcmVuOiBmYWxzZVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH1dO1xyXG5cclxuICAgICAgICBncmFtcHMgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdHcmFuZGRhZGR5JyxcclxuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXJlbnRzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZ3Jhbm55ID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnR3Jhbm55JyxcclxuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbm9kZXMgPSBbIGdyYW1wcywgZ3Jhbm55IF07XHJcblxyXG4gICAgICAgIC8vIE1vY2sgb3V0IGEgbG9hZCBmdW5jdGlvbiB0aGF0IGFsd2F5cyByZXR1cm5zIHRoZSBcInBhcmVudHNcIiBub2Rlcy5cclxuICAgICAgICBsb2FkRnVuYyA9IGphc21pbmUuY3JlYXRlU3B5KCdsb2FkZXJGdW5jJykuYW5kLmNhbGxGYWtlKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHBhcmVudHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKGVsdCA9IGVsdERlZikge1xyXG4gICAgICAgICRzY29wZS5ub2RlcyA9IG5vZGVzO1xyXG4gICAgICAgICRzY29wZS5sb2FkRnVuYyA9IGxvYWRGdW5jO1xyXG4gICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWx0KTtcclxuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG5vZGUgPGxpPiBmb3IgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Tm9kZShub2RlTmFtZSkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGVsZW1lbnQuZmluZChgc3Bhbjpjb250YWlucygnJHtub2RlTmFtZX0nKWApO1xyXG4gICAgICAgIGV4cGVjdChsYWJlbC5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgbGV0IG5vZGVzID0gbGFiZWwucGFyZW50cygnLmFuZ3VsYXItdWktdHJlZS1ub2RlJyk7XHJcbiAgICAgICAgZXhwZWN0KG5vZGVzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApO1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4gdGhlIGNsb3Nlc3QgcGFyZW50ICh0aGVzZSBhcmUgcmV0dXJuZWQgZmlyc3QgZnJvbSB0aGUgcGFyZW50cygpIGNhbGwpLlxyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQobm9kZXNbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5vZGVDb250ZW50KG5vZGUpIHtcclxuICAgICAgICAvLyBOb2RlIGhhcyB0d28gcGllY2VzIC0gY29udGVudCBhbmQgc3VidHJlZS5cclxuICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KG5vZGUuY2hpbGRyZW4oKVswXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0U3VidHJlZShub2RlKSB7XHJcbiAgICAgICAgLy8gTm9kZSBoYXMgdHdvIHBpZWNlcyAtIGNvbnRlbnQgYW5kIHN1YnRyZWUuXHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChub2RlLmNoaWxkcmVuKClbMV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEV4cGFuZGVyKG5vZGUpIHtcclxuICAgICAgICBsZXQgZXhwYW5kZXJzID0gZ2V0Tm9kZUNvbnRlbnQobm9kZSkuZmluZCgnLmFuZ3VsYXItdWktdHJlZS1ub2RlLXRvZ2dsZScpO1xyXG4gICAgICAgIHJldHVybiAoZXhwYW5kZXJzLmxlbmd0aCkgPyBhbmd1bGFyLmVsZW1lbnQoZXhwYW5kZXJzWzBdKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFzRXhwYW5kZXIobm9kZSkge1xyXG4gICAgICAgIHJldHVybiAoZ2V0RXhwYW5kZXIobm9kZSkgIT09IG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhc1N1YlRyZWUobm9kZSkge1xyXG4gICAgICAgIHJldHVybiAoZ2V0U3VidHJlZShub2RlKS5maW5kKCdsaScpLmxlbmd0aCA+IDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzaXZlbHkgcmVuYW1lIHRoZSBwcm9wZXJ0eSBpbiB0aGUgZ2l2ZW4gbmFtZXMgZnJvbSBvbGROYW1lIHRvIG5ld05hbWUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlbmFtZU5vZGVQcm9wZXJ0eShub2Rlcywgb2xkTmFtZSwgbmV3TmFtZSkge1xyXG4gICAgICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgLy8gU2F2ZSB0aGUgY2hpbGRyZW4gZmlyc3QgaW4gY2FzZSB3ZSByZW5hbWUgdGhpcy5cclxuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbmFtZSBhbmQgZGVsZXRlIHRoZSBvbGQgb25lLlxyXG4gICAgICAgICAgICBub2RlW25ld05hbWVdID0gbm9kZVtvbGROYW1lXTtcclxuICAgICAgICAgICAgZGVsZXRlIG5vZGVbb2xkTmFtZV07XHJcblxyXG4gICAgICAgICAgICAvLyBSZWN1cnNlLlxyXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4gJiYgYW5ndWxhci5pc0FycmF5KGNoaWxkcmVuKSAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZW5hbWVOb2RlUHJvcGVydHkoY2hpbGRyZW4sIG9sZE5hbWUsIG5ld05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlc3RTdWJ0cmVlQW5kRXhwYW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGdyYW1wc05vZGUgPSBnZXROb2RlKGdyYW1wcy5uYW1lKTtcclxuICAgICAgICBsZXQgZ3Jhbm55Tm9kZSA9IGdldE5vZGUoZ3Jhbm55Lm5hbWUpO1xyXG5cclxuICAgICAgICBleHBlY3QoaGFzRXhwYW5kZXIoZ3JhbXBzTm9kZSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhc1N1YlRyZWUoZ3JhbXBzTm9kZSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhc0V4cGFuZGVyKGdyYW5ueU5vZGUpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QoaGFzU3ViVHJlZShncmFubnlOb2RlKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXQoJ3VzZXMgXCJoYXNDaGlsZHJlblwiIGFuZCBcImNoaWxkcmVuXCIgdG8gZmluZCBub2RlIGNoaWxkcmVuIHdoZW4gbm90IHNwZWNpZmllZCcsICgpID0+IHtcclxuICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgdGVzdFN1YnRyZWVBbmRFeHBhbmRlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3VzZXMgXCJoYXNDaGlsZHJlblByb3BlcnR5XCIgd2hlbiBzcGVjaWZpZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgcmVuYW1lTm9kZVByb3BlcnR5KG5vZGVzLCAnaGFzQ2hpbGRyZW4nLCAnemFuemliYXInKTtcclxuICAgICAgICBjb21waWxlKCc8c3AtdHJlZSBzcC1ub2Rlcz1cIm5vZGVzXCIgc3AtaGFzLWNoaWxkcmVuLXByb3BlcnR5PVwiemFuemliYXJcIj57eyBub2RlLm5hbWUgfX08L3NwLXRyZWU+Jyk7XHJcbiAgICAgICAgdGVzdFN1YnRyZWVBbmRFeHBhbmRlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3VzZXMgXCJjaGlsZHJlblByb3BlcnR5XCIgd2hlbiBzcGVjaWZpZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgcmVuYW1lTm9kZVByb3BlcnR5KG5vZGVzLCAnY2hpbGRyZW4nLCAnemFuemliYXInKTtcclxuICAgICAgICBjb21waWxlKCc8c3AtdHJlZSBzcC1ub2Rlcz1cIm5vZGVzXCIgc3AtY2hpbGRyZW4tcHJvcGVydHk9XCJ6YW56aWJhclwiPnt7IG5vZGUubmFtZSB9fTwvc3AtdHJlZT4nKTtcclxuICAgICAgICB0ZXN0U3VidHJlZUFuZEV4cGFuZGVyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnbG9hZCBjaGlsZHJlbiBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgICBsZXQgbG9hZGVyRWx0ID0gJzxzcC10cmVlIHNwLW5vZGVzPVwibm9kZXNcIiBzcC1sb2FkLWNoaWxkcmVuLWZ1bmN0aW9uPVwibG9hZEZ1bmNcIicgK1xyXG4gICAgICAgICAgICAnc3AtYXV0by1leHBhbmQtcm9vdD1cImZhbHNlXCI+e3sgbm9kZS5uYW1lIH19PC9zcC10cmVlPic7XHJcblxyXG4gICAgICAgIGl0KCdyZW5kZXJzIHByZS1sb2FkZWQgY2hpbGRyZW4gaWYgbG9hZCBmdW5jdGlvbiBpcyBudWxsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgICAgIGxldCBhbGxOb2RlcyA9IGVsZW1lbnQuZmluZCgnLmFuZ3VsYXItdWktdHJlZS1ub2RlJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbGxOb2Rlcy5sZW5ndGgpLnRvRXF1YWwoNik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGV4cGFuZEdyYW1wcygpIHtcclxuICAgICAgICAgICAgY29tcGlsZShsb2FkZXJFbHQpO1xyXG4gICAgICAgICAgICBsZXQgZ3JhbXBzTm9kZSA9IGdldE5vZGUoZ3JhbXBzLm5hbWUpO1xyXG4gICAgICAgICAgICBsZXQgZXhwYW5kZXIgPSBnZXRFeHBhbmRlcihncmFtcHNOb2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCBjYWxsZWQgd2hlbiBleHBhbmRpbmcgcHJlLWxvYWRlZCBjaGlsZHJlbicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRvZ2dsZSA9IGV4cGFuZEdyYW1wcygpO1xyXG4gICAgICAgICAgICB0b2dnbGUuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxvYWRGdW5jKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgY2FsbGVkIGlmIG5vZGUgaXMgZXhwYW5kaW5nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBub2RlcyA9IFsgZ3JhbXBzLCBncmFubnkgXTtcclxuICAgICAgICAgICAgbGV0IHRvZ2dsZSA9IGV4cGFuZEdyYW1wcygpO1xyXG4gICAgICAgICAgICB0b2dnbGUuY2xpY2soKTtcclxuICAgICAgICAgICAgZ3JhbXBzLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgICAgICAgdG9nZ2xlLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHRvZ2dsZS5jbGljaygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZ3JhbXBzLmNoaWxkcmVuKS50b0VxdWFsKHBhcmVudHMpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9hZEZ1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGdyYW1wcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBub3QgY2FsbGVkIGlmIG5vZGUgaXMgY29sbGFwc2luZycsICgpID0+IHtcclxuICAgICAgICAgICAgZ3JhbXBzLmNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgICAgICAgbm9kZXMgPSBbIGdyYW1wcywgZ3Jhbm55IF07XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGUgPSBleHBhbmRHcmFtcHMoKTtcclxuICAgICAgICAgICAgdG9nZ2xlLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGxvYWRGdW5jLmNhbGxzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRvZ2dsZS5jbGljaygpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9hZEZ1bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBub3QgY2FsbGVkIGFnYWluIGlmIG5vZGUgaGFzIGFscmVhZHkgYmVlbiBleHBhbmRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRvZ2dsZSA9IGV4cGFuZEdyYW1wcygpO1xyXG4gICAgICAgICAgICBncmFtcHMuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0b2dnbGUuY2xpY2soKTtcclxuICAgICAgICAgICAgbG9hZEZ1bmMuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgdG9nZ2xlLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsb2FkRnVuYykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCBjYWxsZWQgYWdhaW4gaWYgbm9kZSBpcyBhdXRvIGV4cGFuZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkZXJFbHQgPSAnPHNwLXRyZWUgc3Atbm9kZXM9XCJub2Rlc1wiIHNwLWxvYWQtY2hpbGRyZW4tZnVuY3Rpb249XCJsb2FkRnVuY1wiJyArXHJcbiAgICAgICAgICAgICdzcC1hdXRvLWV4cGFuZC1yb290PVwidHJ1ZVwiPnt7IG5vZGUubmFtZSB9fTwvc3AtdHJlZT4nO1xyXG4gICAgICAgICAgICBsZXQgdG9nZ2xlID0gZXhwYW5kR3JhbXBzKCk7XHJcbiAgICAgICAgICAgIHRvZ2dsZS5jbGljaygpO1xyXG4gICAgICAgICAgICBncmFtcHMuY2hpbGRyZW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0b2dnbGUuY2xpY2soKTtcclxuICAgICAgICAgICAgbG9hZEZ1bmMuY2FsbHMucmVzZXQoKTtcclxuICAgICAgICAgICAgdG9nZ2xlLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsb2FkRnVuYykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCBjYWxsZWQgZm9yIGlmIG5vZGUgaXMgYXV0byBleHBhbmRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbG9hZGVyRWx0ID0gJzxzcC10cmVlIHNwLW5vZGVzPVwibm9kZXNcIiBzcC1sb2FkLWNoaWxkcmVuLWZ1bmN0aW9uPVwibG9hZEZ1bmNcIicgK1xyXG4gICAgICAgICAgICAnc3AtYXV0by1leHBhbmQtcm9vdD1cInRydWVcIj57eyBub2RlLm5hbWUgfX08L3NwLXRyZWU+JztcclxuICAgICAgICAgICAgZXhwYW5kR3JhbXBzKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsb2FkRnVuYykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnc2VsZWN0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBzZWxlY3Rpb25FbHQgPSAnPHNwLXRyZWUgc3Atbm9kZXM9XCJub2Rlc1wiIHNwLXNlbGVjdGVkLW5vZGU9XCJzZWxlY3RlZFwiIHNwLWF1dG8tZXhwYW5kLXJvb3Q9XCJmYWxzZVwiPicgK1xyXG4gICAgICAgICAgICAne3sgbm9kZS5uYW1lIH19PC9zcC10cmVlPic7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsaWNrR3JhbXBzKCkge1xyXG4gICAgICAgICAgICBjb21waWxlKHNlbGVjdGlvbkVsdCk7XHJcbiAgICAgICAgICAgIGxldCBncmFtcHNOb2RlID0gZ2V0Tm9kZShncmFtcHMubmFtZSk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gZ2V0Tm9kZUNvbnRlbnQoZ3JhbXBzTm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBjbGlja2VyID0gY29udGVudC5maW5kKCdhLmFuZ3VsYXItdWktdHJlZS1ub2RlLWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNsaWNrZXIubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICBjbGlja2VyLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGlja2VyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ3VwZGF0ZXMgdGhlIGJvdW5kIHNlbGVjdGVkTm9kZScsICgpID0+IHtcclxuICAgICAgICAgICAgY2xpY2tHcmFtcHMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5zZWxlY3RlZCkudG9FcXVhbChncmFtcHMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbWFya3MgdGhlIG5vZGUgYXMgc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjbGlja2VyID0gY2xpY2tHcmFtcHMoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNsaWNrZXIuaGFzQ2xhc3MoJ2FuZ3VsYXItdWktdHJlZS1ub2RlLXNlbGVjdGVkJykpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZXhwYW5kZXInLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2lzIHJlbmRlcmVkIGZvciBhIG5vZGUgd2l0aCBjaGlsZHJlbicsICgpID0+IHtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBsZXQgZ3JhbXBzTm9kZSA9IGdldE5vZGUoZ3JhbXBzLm5hbWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFzRXhwYW5kZXIoZ3JhbXBzTm9kZSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBub3QgcmVuZGVyZWQgZm9yIGEgbm9kZSB3aXRob3V0IGNoaWxkcmVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgICAgIGxldCBncmFubnlOb2RlID0gZ2V0Tm9kZShncmFubnkubmFtZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYXNFeHBhbmRlcihncmFubnlOb2RlKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
