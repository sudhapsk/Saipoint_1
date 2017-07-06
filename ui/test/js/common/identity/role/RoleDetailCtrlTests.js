System.register(['test/js/TestInitializer', 'common/identity/role/IdentityRoleModule'], function (_export) {
    'use strict';

    var roleModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonIdentityRoleIdentityRoleModule) {
            roleModule = _commonIdentityRoleIdentityRoleModule['default'];
        }],
        execute: function () {

            describe('RoleDetailCtrl', function () {

                var $controller = undefined,
                    showEntitlementDetailsFunc = undefined,
                    $modalInstance = undefined,
                    $rootScope = undefined;

                beforeEach(module(roleModule));

                beforeEach(inject(function (_$controller_, _$rootScope_, $q) {
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;

                    showEntitlementDetailsFunc = jasmine.createSpy('showDetails').and.callFake(function (entitlement) {
                        return entitlement;
                    });
                    var modalResultDeferred = $q.defer();
                    $modalInstance = {
                        close: jasmine.createSpy().and.callFake(function () {
                            return modalResultDeferred.resolve();
                        }),
                        result: modalResultDeferred.promise
                    };
                }));

                function createController(role, func) {
                    return $controller('RoleDetailCtrl', {
                        role: role,
                        loadHierarchyFunction: func,
                        showEntitlementDetailsFunc: showEntitlementDetailsFunc,
                        $modalInstance: $modalInstance
                    });
                }

                it('blows up with no role', function () {
                    expect(function () {
                        return createController(null);
                    }).toThrow();
                });

                it('stores the role', function () {
                    var role = { i: 'am a role' };
                    var ctrl = createController(role);
                    expect(ctrl.role).toEqual(role);
                });

                describe('allowed roles', function () {
                    it('initializes the selected role to the first required role', function () {
                        var required = { you: 'need me' };
                        var role = {
                            rock: 'roll',
                            requiredRoles: [required]
                        };
                        var ctrl = createController(role);
                        expect(ctrl.allowedSelectedRole).toEqual(required);
                    });

                    it('initializes the selected role to null if there are no required roles', function () {
                        var permitted = { you: 'can live without me' };
                        var role = {
                            rock: 'roll',
                            permittedRoles: [permitted]
                        };
                        var ctrl = createController(role);
                        expect(ctrl.allowedSelectedRole).toEqual(null);
                    });
                });

                it('initializes the hierarchy selected role to the role being viewed', function () {
                    var role = { rolling: 'stone' };
                    var ctrl = createController(role);
                    expect(ctrl.hierarchySelectedRole).toEqual(role);
                });

                it('creates a hierarchy with the selected role at the root', function () {
                    var child = { baby: 'waaaahhhh!!' };
                    var parent = {
                        be: 'quiet',
                        hierarchy: [child]
                    };
                    var ctrl = createController(parent);
                    expect(ctrl.hierarchy).toEqual([parent]);
                });

                it('stores the load hiearchy function', function () {
                    var role = { boom: 'goes the dynamite' };
                    var loadFunc = function () {
                        return 'passes the ball to the man...';
                    };
                    var ctrl = createController(role, loadFunc);
                    expect(ctrl.loadHierarchyFunction).toEqual(loadFunc);
                });

                describe('showEntitlementDetails()', function () {
                    it('closes modal instance and calls showEntitlementDetailsFunc with entitlement', function () {
                        var role = { some: 'thing' },
                            entitlement = { managedAttributeId: '1234' },
                            ctrl = createController(role, null);

                        ctrl.showEntitlementDetails(entitlement);
                        $rootScope.$apply();
                        expect($modalInstance.close).toHaveBeenCalled();
                        expect(showEntitlementDetailsFunc).toHaveBeenCalledWith(entitlement);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9pZGVudGl0eS9yb2xlL1JvbGVEZXRhaWxDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDRDQUE0QyxVQUFVLFNBQVM7SUFDdkc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHVDQUF1QztZQUM3RixhQUFhLHNDQUFzQzs7UUFFdkQsU0FBUyxZQUFZOztZQUw3QixTQUFTLGtCQUFrQixZQUFNOztnQkFFN0IsSUFBSSxjQUFXO29CQUFFLDZCQUEwQjtvQkFBRSxpQkFBYztvQkFBRSxhQUFVOztnQkFFdkUsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMsZUFBZSxjQUFjLElBQU87b0JBQ25ELGNBQWM7b0JBQ2QsYUFBYTs7b0JBRWIsNkJBQTZCLFFBQVEsVUFBVSxlQUFlLElBQUksU0FBUyxVQUFDLGFBQVc7d0JBV3ZFLE9BWDRFOztvQkFDNUYsSUFBSSxzQkFBc0IsR0FBRztvQkFDN0IsaUJBQWlCO3dCQUNiLE9BQU8sUUFBUSxZQUFZLElBQUksU0FBUyxZQUFBOzRCQWF4QixPQWI4QixvQkFBb0I7O3dCQUNsRSxRQUFRLG9CQUFvQjs7OztnQkFJcEMsU0FBUyxpQkFBaUIsTUFBTSxNQUFNO29CQUNsQyxPQUFPLFlBQVksa0JBQWtCO3dCQUNqQyxNQUFNO3dCQUNOLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1QixnQkFBZ0I7Ozs7Z0JBSXhCLEdBQUcseUJBQXlCLFlBQU07b0JBQzlCLE9BQU8sWUFBQTt3QkFlUyxPQWZILGlCQUFpQjt1QkFBTzs7O2dCQUd6QyxHQUFHLG1CQUFtQixZQUFNO29CQUN4QixJQUFJLE9BQU8sRUFBRSxHQUFHO29CQUNoQixJQUFJLE9BQU8saUJBQWlCO29CQUM1QixPQUFPLEtBQUssTUFBTSxRQUFROzs7Z0JBRzlCLFNBQVMsaUJBQWlCLFlBQU07b0JBQzVCLEdBQUcsNERBQTRELFlBQU07d0JBQ2pFLElBQUksV0FBVyxFQUFFLEtBQUs7d0JBQ3RCLElBQUksT0FBTzs0QkFDUCxNQUFNOzRCQUNOLGVBQWUsQ0FBRTs7d0JBRXJCLElBQUksT0FBTyxpQkFBaUI7d0JBQzVCLE9BQU8sS0FBSyxxQkFBcUIsUUFBUTs7O29CQUc3QyxHQUFHLHdFQUF3RSxZQUFNO3dCQUM3RSxJQUFJLFlBQVksRUFBRSxLQUFLO3dCQUN2QixJQUFJLE9BQU87NEJBQ1AsTUFBTTs0QkFDTixnQkFBZ0IsQ0FBRTs7d0JBRXRCLElBQUksT0FBTyxpQkFBaUI7d0JBQzVCLE9BQU8sS0FBSyxxQkFBcUIsUUFBUTs7OztnQkFJakQsR0FBRyxvRUFBb0UsWUFBTTtvQkFDekUsSUFBSSxPQUFPLEVBQUUsU0FBUztvQkFDdEIsSUFBSSxPQUFPLGlCQUFpQjtvQkFDNUIsT0FBTyxLQUFLLHVCQUF1QixRQUFROzs7Z0JBRy9DLEdBQUcsMERBQTBELFlBQU07b0JBQy9ELElBQUksUUFBUSxFQUFFLE1BQU07b0JBQ3BCLElBQUksU0FBUzt3QkFDVCxJQUFJO3dCQUNKLFdBQVcsQ0FBRTs7b0JBRWpCLElBQUksT0FBTyxpQkFBaUI7b0JBQzVCLE9BQU8sS0FBSyxXQUFXLFFBQVEsQ0FBRTs7O2dCQUdyQyxHQUFHLHFDQUFxQyxZQUFNO29CQUMxQyxJQUFJLE9BQU8sRUFBRSxNQUFNO29CQUNuQixJQUFJLFdBQVcsWUFBTTt3QkFBRSxPQUFPOztvQkFDOUIsSUFBSSxPQUFPLGlCQUFpQixNQUFNO29CQUNsQyxPQUFPLEtBQUssdUJBQXVCLFFBQVE7OztnQkFHL0MsU0FBUyw0QkFBNEIsWUFBTTtvQkFDdkMsR0FBRywrRUFBK0UsWUFBTTt3QkFDcEYsSUFBSSxPQUFPLEVBQUUsTUFBTTs0QkFDZixjQUFjLEVBQUUsb0JBQW9COzRCQUNwQyxPQUFPLGlCQUFpQixNQUFNOzt3QkFFbEMsS0FBSyx1QkFBdUI7d0JBQzVCLFdBQVc7d0JBQ1gsT0FBTyxlQUFlLE9BQU87d0JBQzdCLE9BQU8sNEJBQTRCLHFCQUFxQjs7Ozs7O0dBd0JqRSIsImZpbGUiOiJjb21tb24vaWRlbnRpdHkvcm9sZS9Sb2xlRGV0YWlsQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCByb2xlTW9kdWxlIGZyb20gJ2NvbW1vbi9pZGVudGl0eS9yb2xlL0lkZW50aXR5Um9sZU1vZHVsZSc7XHJcblxyXG5kZXNjcmliZSgnUm9sZURldGFpbEN0cmwnLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0ICRjb250cm9sbGVyLCBzaG93RW50aXRsZW1lbnREZXRhaWxzRnVuYywgJG1vZGFsSW5zdGFuY2UsICRyb290U2NvcGU7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUocm9sZU1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJGNvbnRyb2xsZXJfLCBfJHJvb3RTY29wZV8sICRxKSA9PiB7XHJcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcblxyXG4gICAgICAgIHNob3dFbnRpdGxlbWVudERldGFpbHNGdW5jID0gamFzbWluZS5jcmVhdGVTcHkoJ3Nob3dEZXRhaWxzJykuYW5kLmNhbGxGYWtlKChlbnRpdGxlbWVudCkgPT4gZW50aXRsZW1lbnQpO1xyXG4gICAgICAgIGxldCBtb2RhbFJlc3VsdERlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAkbW9kYWxJbnN0YW5jZSA9IHtcclxuICAgICAgICAgICAgY2xvc2U6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKCgpID0+IG1vZGFsUmVzdWx0RGVmZXJyZWQucmVzb2x2ZSgpKSxcclxuICAgICAgICAgICAgcmVzdWx0OiBtb2RhbFJlc3VsdERlZmVycmVkLnByb21pc2VcclxuICAgICAgICB9O1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIocm9sZSwgZnVuYykge1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignUm9sZURldGFpbEN0cmwnLCB7XHJcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXHJcbiAgICAgICAgICAgIGxvYWRIaWVyYXJjaHlGdW5jdGlvbjogZnVuYyxcclxuICAgICAgICAgICAgc2hvd0VudGl0bGVtZW50RGV0YWlsc0Z1bmM6IHNob3dFbnRpdGxlbWVudERldGFpbHNGdW5jLFxyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZTogJG1vZGFsSW5zdGFuY2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpdCgnYmxvd3MgdXAgd2l0aCBubyByb2xlJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVDb250cm9sbGVyKG51bGwpKS50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc3RvcmVzIHRoZSByb2xlJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCByb2xlID0geyBpOiAnYW0gYSByb2xlJyB9O1xyXG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihyb2xlKTtcclxuICAgICAgICBleHBlY3QoY3RybC5yb2xlKS50b0VxdWFsKHJvbGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2FsbG93ZWQgcm9sZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2luaXRpYWxpemVzIHRoZSBzZWxlY3RlZCByb2xlIHRvIHRoZSBmaXJzdCByZXF1aXJlZCByb2xlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWlyZWQgPSB7IHlvdTogJ25lZWQgbWUnIH07XHJcbiAgICAgICAgICAgIGxldCByb2xlID0ge1xyXG4gICAgICAgICAgICAgICAgcm9jazogJ3JvbGwnLFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWRSb2xlczogWyByZXF1aXJlZCBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihyb2xlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGN0cmwuYWxsb3dlZFNlbGVjdGVkUm9sZSkudG9FcXVhbChyZXF1aXJlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpbml0aWFsaXplcyB0aGUgc2VsZWN0ZWQgcm9sZSB0byBudWxsIGlmIHRoZXJlIGFyZSBubyByZXF1aXJlZCByb2xlcycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBlcm1pdHRlZCA9IHsgeW91OiAnY2FuIGxpdmUgd2l0aG91dCBtZScgfTtcclxuICAgICAgICAgICAgbGV0IHJvbGUgPSB7XHJcbiAgICAgICAgICAgICAgICByb2NrOiAncm9sbCcsXHJcbiAgICAgICAgICAgICAgICBwZXJtaXR0ZWRSb2xlczogWyBwZXJtaXR0ZWQgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIocm9sZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmFsbG93ZWRTZWxlY3RlZFJvbGUpLnRvRXF1YWwobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaW5pdGlhbGl6ZXMgdGhlIGhpZXJhcmNoeSBzZWxlY3RlZCByb2xlIHRvIHRoZSByb2xlIGJlaW5nIHZpZXdlZCcsICgpID0+IHtcclxuICAgICAgICBsZXQgcm9sZSA9IHsgcm9sbGluZzogJ3N0b25lJyB9O1xyXG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihyb2xlKTtcclxuICAgICAgICBleHBlY3QoY3RybC5oaWVyYXJjaHlTZWxlY3RlZFJvbGUpLnRvRXF1YWwocm9sZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnY3JlYXRlcyBhIGhpZXJhcmNoeSB3aXRoIHRoZSBzZWxlY3RlZCByb2xlIGF0IHRoZSByb290JywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBjaGlsZCA9IHsgYmFieTogJ3dhYWFhaGhoaCEhJyB9O1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB7XHJcbiAgICAgICAgICAgIGJlOiAncXVpZXQnLFxyXG4gICAgICAgICAgICBoaWVyYXJjaHk6IFsgY2hpbGQgXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKHBhcmVudCk7XHJcbiAgICAgICAgZXhwZWN0KGN0cmwuaGllcmFyY2h5KS50b0VxdWFsKFsgcGFyZW50IF0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3N0b3JlcyB0aGUgbG9hZCBoaWVhcmNoeSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgICBsZXQgcm9sZSA9IHsgYm9vbTogJ2dvZXMgdGhlIGR5bmFtaXRlJyB9O1xyXG4gICAgICAgIGxldCBsb2FkRnVuYyA9ICgpID0+IHsgcmV0dXJuICdwYXNzZXMgdGhlIGJhbGwgdG8gdGhlIG1hbi4uLic7IH07XHJcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKHJvbGUsIGxvYWRGdW5jKTtcclxuICAgICAgICBleHBlY3QoY3RybC5sb2FkSGllcmFyY2h5RnVuY3Rpb24pLnRvRXF1YWwobG9hZEZ1bmMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dFbnRpdGxlbWVudERldGFpbHMoKScsICgpID0+IHtcclxuICAgICAgICBpdCgnY2xvc2VzIG1vZGFsIGluc3RhbmNlIGFuZCBjYWxscyBzaG93RW50aXRsZW1lbnREZXRhaWxzRnVuYyB3aXRoIGVudGl0bGVtZW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcm9sZSA9IHsgc29tZTogJ3RoaW5nJyB9LFxyXG4gICAgICAgICAgICAgICAgZW50aXRsZW1lbnQgPSB7IG1hbmFnZWRBdHRyaWJ1dGVJZDogJzEyMzQnIH0sXHJcbiAgICAgICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihyb2xlLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIGN0cmwuc2hvd0VudGl0bGVtZW50RGV0YWlscyhlbnRpdGxlbWVudCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCgkbW9kYWxJbnN0YW5jZS5jbG9zZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2hvd0VudGl0bGVtZW50RGV0YWlsc0Z1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGVudGl0bGVtZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
