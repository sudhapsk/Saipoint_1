System.register(['certification/CertificationModule', 'test/js/TestInitializer'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            describe('EntitlementSoDRevocationDirective', function () {

                var elementDefinition = '<sp-entitlement-sod-revocation policy-tree="policyTree" />',
                    PolicyTreeNode = undefined,
                    $scope = undefined,
                    $compile = undefined,
                    $controller = undefined,
                    certificationTestData = undefined,
                    policyTree = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function ($rootScope, _$compile_, _$controller_, _PolicyTreeNode_, _certificationTestData_) {
                    $scope = $rootScope.$new();
                    $compile = _$compile_;
                    $controller = _$controller_;
                    certificationTestData = _certificationTestData_;
                    PolicyTreeNode = _PolicyTreeNode_;

                    policyTree = new PolicyTreeNode(certificationTestData.POLICY_TREE_NODE);
                }));

                function makeSingleColumn() {
                    policyTree.children.push(new PolicyTreeNode(certificationTestData.POLICY_TREE_NODE));
                }

                describe('controller', function () {
                    function createController() {
                        return $controller('EntitlementSoDRevocationDirectiveCtrl', null, {
                            policyTree: policyTree
                        });
                    }

                    it('throws without a policy tree', function () {
                        policyTree = null;
                        expect(function () {
                            return createController();
                        }).toThrow();
                    });

                    it('uses two columns when there are two children', function () {
                        var ctrl = createController();
                        expect(ctrl.isTwoColumns()).toEqual(true);
                    });

                    it('uses a single column when there are more than two children', function () {
                        makeSingleColumn();
                        var ctrl = createController();
                        expect(ctrl.isTwoColumns()).toEqual(false);
                    });
                });

                describe('html', function () {
                    function createElement(item) {
                        var element = angular.element(elementDefinition);
                        $scope.policyTree = policyTree;
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

                    function checkSingleColumn(element, numExpected) {
                        var columns = element.find('.row > .col-sm-12');

                        // There will always be one full width column with instruction text, so subtract it.
                        expect(columns.length - 1).toEqual(numExpected);
                    }

                    function checkTwoColumns(element, numExpected) {
                        var columns = element.find('.row > .col-sm-6');
                        expect(columns.length).toEqual(numExpected);
                    }

                    it('uses two columns when there are two children', function () {
                        var element = createElement();
                        checkSingleColumn(element, 0);
                        checkTwoColumns(element, 2);
                    });

                    it('uses a single column when there are more than two children', function () {
                        makeSingleColumn();
                        var element = createElement();
                        checkSingleColumn(element, 1);
                        checkTwoColumns(element, 0);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vRW50aXRsZW1lbnRTb0RSZXZvY2F0aW9uRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMscUNBQXFDLDRCQUE0QixVQUFVLFNBQVM7SUFDakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSxtQ0FBbUM7WUFDbkQsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7O1lBTDdCLFNBQVMscUNBQXFDLFlBQVc7O2dCQUVyRCxJQUFJLG9CQUFpQjtvQkFDakIsaUJBQWM7b0JBQUUsU0FBTTtvQkFBRSxXQUFRO29CQUFFLGNBQVc7b0JBQUUsd0JBQXFCO29CQUFFLGFBQVU7O2dCQUVwRixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxZQUFZLFlBQVksZUFBZSxrQkFBa0IseUJBQXlCO29CQUN6RyxTQUFTLFdBQVc7b0JBQ3BCLFdBQVc7b0JBQ1gsY0FBYztvQkFDZCx3QkFBd0I7b0JBQ3hCLGlCQUFpQjs7b0JBRWpCLGFBQWEsSUFBSSxlQUFlLHNCQUFzQjs7O2dCQUcxRCxTQUFTLG1CQUFtQjtvQkFDeEIsV0FBVyxTQUFTLEtBQUssSUFBSSxlQUFlLHNCQUFzQjs7O2dCQUd0RSxTQUFTLGNBQWMsWUFBTTtvQkFDekIsU0FBUyxtQkFBbUI7d0JBQ3hCLE9BQU8sWUFBWSx5Q0FBeUMsTUFBTTs0QkFDOUQsWUFBWTs7OztvQkFJcEIsR0FBRyxnQ0FBZ0MsWUFBTTt3QkFDcEMsYUFBYTt3QkFDYixPQUFPLFlBQUE7NEJBYVEsT0FiRjsyQkFBb0I7OztvQkFHdEMsR0FBRyxnREFBZ0QsWUFBTTt3QkFDckQsSUFBSSxPQUFPO3dCQUNYLE9BQU8sS0FBSyxnQkFBZ0IsUUFBUTs7O29CQUd4QyxHQUFHLDhEQUE4RCxZQUFNO3dCQUNuRTt3QkFDQSxJQUFJLE9BQU87d0JBQ1gsT0FBTyxLQUFLLGdCQUFnQixRQUFROzs7O2dCQUk1QyxTQUFTLFFBQVEsWUFBTTtvQkFDbkIsU0FBUyxjQUFjLE1BQU07d0JBQ3pCLElBQUksVUFBVSxRQUFRLFFBQVE7d0JBQzlCLE9BQU8sYUFBYTt3QkFDcEIsU0FBUyxTQUFTO3dCQUNsQixPQUFPO3dCQUNQLE9BQU87OztvQkFHWCxHQUFHLGdDQUFnQyxZQUFNO3dCQUNyQyxhQUFhO3dCQUNiLE9BQU8sWUFBQTs0QkFlUyxPQWZIOzJCQUFpQjs7O29CQUdsQyxTQUFTLGtCQUFrQixTQUFTLGFBQWE7d0JBQzdDLElBQUksVUFBVSxRQUFRLEtBQUs7Ozt3QkFHM0IsT0FBTyxRQUFRLFNBQVMsR0FBRyxRQUFROzs7b0JBR3ZDLFNBQVMsZ0JBQWdCLFNBQVMsYUFBYTt3QkFDM0MsSUFBSSxVQUFVLFFBQVEsS0FBSzt3QkFDM0IsT0FBTyxRQUFRLFFBQVEsUUFBUTs7O29CQUduQyxHQUFHLGdEQUFnRCxZQUFNO3dCQUNyRCxJQUFJLFVBQVU7d0JBQ2Qsa0JBQWtCLFNBQVM7d0JBQzNCLGdCQUFnQixTQUFTOzs7b0JBRzdCLEdBQUcsOERBQThELFlBQU07d0JBQ25FO3dCQUNBLElBQUksVUFBVTt3QkFDZCxrQkFBa0IsU0FBUzt3QkFDM0IsZ0JBQWdCLFNBQVM7Ozs7OztHQXNCbEMiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9FbnRpdGxlbWVudFNvRFJldm9jYXRpb25EaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5cclxuZGVzY3JpYmUoJ0VudGl0bGVtZW50U29EUmV2b2NhdGlvbkRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxldCBlbGVtZW50RGVmaW5pdGlvbiA9IGA8c3AtZW50aXRsZW1lbnQtc29kLXJldm9jYXRpb24gcG9saWN5LXRyZWU9XCJwb2xpY3lUcmVlXCIgLz5gLFxyXG4gICAgICAgIFBvbGljeVRyZWVOb2RlLCAkc2NvcGUsICRjb21waWxlLCAkY29udHJvbGxlciwgY2VydGlmaWNhdGlvblRlc3REYXRhLCBwb2xpY3lUcmVlO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCBfJGNvbXBpbGVfLCBfJGNvbnRyb2xsZXJfLCBfUG9saWN5VHJlZU5vZGVfLCBfY2VydGlmaWNhdGlvblRlc3REYXRhXykge1xyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcclxuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XHJcbiAgICAgICAgUG9saWN5VHJlZU5vZGUgPSBfUG9saWN5VHJlZU5vZGVfO1xyXG5cclxuICAgICAgICBwb2xpY3lUcmVlID0gbmV3IFBvbGljeVRyZWVOb2RlKGNlcnRpZmljYXRpb25UZXN0RGF0YS5QT0xJQ1lfVFJFRV9OT0RFKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlU2luZ2xlQ29sdW1uKCkge1xyXG4gICAgICAgIHBvbGljeVRyZWUuY2hpbGRyZW4ucHVzaChuZXcgUG9saWN5VHJlZU5vZGUoY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREUpKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnY29udHJvbGxlcicsICgpID0+IHtcclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ0VudGl0bGVtZW50U29EUmV2b2NhdGlvbkRpcmVjdGl2ZUN0cmwnLCBudWxsLCB7XHJcbiAgICAgICAgICAgICAgICBwb2xpY3lUcmVlOiBwb2xpY3lUcmVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ3Rocm93cyB3aXRob3V0IGEgcG9saWN5IHRyZWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICBwb2xpY3lUcmVlID0gbnVsbDtcclxuICAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVDb250cm9sbGVyKCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3VzZXMgdHdvIGNvbHVtbnMgd2hlbiB0aGVyZSBhcmUgdHdvIGNoaWxkcmVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNUd29Db2x1bW5zKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCd1c2VzIGEgc2luZ2xlIGNvbHVtbiB3aGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gdHdvIGNoaWxkcmVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBtYWtlU2luZ2xlQ29sdW1uKCk7XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1R3b0NvbHVtbnMoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnaHRtbCcsICgpID0+IHtcclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGl0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pO1xyXG4gICAgICAgICAgICAkc2NvcGUucG9saWN5VHJlZSA9IHBvbGljeVRyZWU7XHJcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgYSBwb2xpY3kgdHJlZScsICgpID0+IHtcclxuICAgICAgICAgICAgcG9saWN5VHJlZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVFbGVtZW50KCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tTaW5nbGVDb2x1bW4oZWxlbWVudCwgbnVtRXhwZWN0ZWQpIHtcclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSBlbGVtZW50LmZpbmQoJy5yb3cgPiAuY29sLXNtLTEyJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGVyZSB3aWxsIGFsd2F5cyBiZSBvbmUgZnVsbCB3aWR0aCBjb2x1bW4gd2l0aCBpbnN0cnVjdGlvbiB0ZXh0LCBzbyBzdWJ0cmFjdCBpdC5cclxuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbnMubGVuZ3RoIC0gMSkudG9FcXVhbChudW1FeHBlY3RlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGVja1R3b0NvbHVtbnMoZWxlbWVudCwgbnVtRXhwZWN0ZWQpIHtcclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSBlbGVtZW50LmZpbmQoJy5yb3cgPiAuY29sLXNtLTYnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbHVtbnMubGVuZ3RoKS50b0VxdWFsKG51bUV4cGVjdGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCd1c2VzIHR3byBjb2x1bW5zIHdoZW4gdGhlcmUgYXJlIHR3byBjaGlsZHJlbicsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGNoZWNrU2luZ2xlQ29sdW1uKGVsZW1lbnQsIDApO1xyXG4gICAgICAgICAgICBjaGVja1R3b0NvbHVtbnMoZWxlbWVudCwgMik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCd1c2VzIGEgc2luZ2xlIGNvbHVtbiB3aGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gdHdvIGNoaWxkcmVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBtYWtlU2luZ2xlQ29sdW1uKCk7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBjaGVja1NpbmdsZUNvbHVtbihlbGVtZW50LCAxKTtcclxuICAgICAgICAgICAgY2hlY2tUd29Db2x1bW5zKGVsZW1lbnQsIDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
