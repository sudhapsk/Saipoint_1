System.register(['test/js/TestInitializer', 'common/identity/account/IdentityAccountModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var accountModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonIdentityAccountIdentityAccountModule) {
            accountModule = _commonIdentityAccountIdentityAccountModule['default'];
        }],
        execute: function () {

            describe('AccountDetailCtrl', function () {

                var $controller = undefined,
                    Entitlement = undefined,
                    LinkAttribute = undefined,
                    showEntitlementDetailsFunc = undefined,
                    $modalInstance = undefined,
                    $rootScope = undefined;

                beforeEach(module(accountModule));

                beforeEach(inject(function (_$controller_, _Entitlement_, _LinkAttribute_, _$rootScope_, $q) {
                    $controller = _$controller_;
                    Entitlement = _Entitlement_;
                    LinkAttribute = _LinkAttribute_;
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

                function createController(account) {
                    return $controller('AccountDetailCtrl', {
                        account: account,
                        showEntitlementDetailsFunc: showEntitlementDetailsFunc,
                        $modalInstance: $modalInstance
                    });
                }

                it('blows up with no account', function () {
                    expect(function () {
                        return createController(null);
                    }).toThrow();
                });

                it('stores the account', function () {
                    var account = { applicationDetails: 'thing' },
                        ctrl = createController(account);
                    expect(ctrl.account).toEqual(account);
                });

                describe('getApplicationRemediators()', function () {
                    it('returns null for empty or undefined remediators', function () {
                        var account = { some: 'thing' },
                            ctrl = createController(account);
                        expect(ctrl.getApplicationRemediators()).toEqual(null);
                        account.application = { remediators: [] };
                        ctrl = createController(account);
                        expect(ctrl.getApplicationRemediators()).toEqual(null);
                    });

                    it('returns a CSV for defined remediators', function () {
                        var account = {
                            application: {
                                remediators: [{
                                    displayName: 'Person One'
                                }, {
                                    displayName: 'Person Two'
                                }]
                            }
                        },
                            ctrl = createController(account);
                        expect(ctrl.getApplicationRemediators()).toEqual('Person One, Person Two');
                    });
                });

                describe('showEntitlementDetails()', function () {
                    it('closes modal instance and calls showEntitlementDetailsFunc with entitlement', function () {
                        var account = { some: 'thing' },
                            entitlement = { managedAttributeId: '1234' },
                            ctrl = createController(account);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9pZGVudGl0eS9hY2NvdW50L0FjY291bnREZXRhaWxDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLGtEQUFrRCxVQUFVLFNBQVM7OztJQUc3Rzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsNkNBQTZDO1lBQ25HLGdCQUFnQiw0Q0FBNEM7O1FBRWhFLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxxQkFBcUIsWUFBTTs7Z0JBRWhDLElBQUksY0FBVztvQkFBRSxjQUFXO29CQUFFLGdCQUFhO29CQUFFLDZCQUEwQjtvQkFBRSxpQkFBYztvQkFBRSxhQUFVOztnQkFFbkcsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMsZUFBZSxlQUFlLGlCQUFpQixjQUFjLElBQU87b0JBQ25GLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxnQkFBZ0I7b0JBQ2hCLGFBQWE7O29CQUViLDZCQUE2QixRQUFRLFVBQVUsZUFBZSxJQUFJLFNBQVMsVUFBQyxhQUFXO3dCQWF2RSxPQWI0RTs7b0JBQzVGLElBQUksc0JBQXNCLEdBQUc7b0JBQzdCLGlCQUFpQjt3QkFDYixPQUFPLFFBQVEsWUFBWSxJQUFJLFNBQVMsWUFBQTs0QkFleEIsT0FmOEIsb0JBQW9COzt3QkFDbEUsUUFBUSxvQkFBb0I7Ozs7Z0JBSXBDLFNBQVMsaUJBQWlCLFNBQVM7b0JBQy9CLE9BQU8sWUFBWSxxQkFBcUI7d0JBQ3BDLFNBQVM7d0JBQ1QsNEJBQTRCO3dCQUM1QixnQkFBZ0I7Ozs7Z0JBSXhCLEdBQUcsNEJBQTRCLFlBQU07b0JBQ2pDLE9BQU8sWUFBQTt3QkFpQlMsT0FqQkgsaUJBQWlCO3VCQUFPOzs7Z0JBR3pDLEdBQUcsc0JBQXNCLFlBQU07b0JBQzNCLElBQUksVUFBVSxFQUFFLG9CQUFvQjt3QkFDaEMsT0FBTyxpQkFBaUI7b0JBQzVCLE9BQU8sS0FBSyxTQUFTLFFBQVE7OztnQkFHakMsU0FBUywrQkFBK0IsWUFBTTtvQkFDMUMsR0FBRyxtREFBbUQsWUFBTTt3QkFDeEQsSUFBSSxVQUFVLEVBQUUsTUFBTTs0QkFDbEIsT0FBTyxpQkFBaUI7d0JBQzVCLE9BQU8sS0FBSyw2QkFBNkIsUUFBUTt3QkFDakQsUUFBUSxjQUFjLEVBQUUsYUFBYzt3QkFDdEMsT0FBTyxpQkFBaUI7d0JBQ3hCLE9BQU8sS0FBSyw2QkFBNkIsUUFBUTs7O29CQUdyRCxHQUFHLHlDQUF5QyxZQUFNO3dCQUM5QyxJQUFJLFVBQVU7NEJBQ04sYUFBYTtnQ0FDVCxhQUFhLENBQUM7b0NBQ1YsYUFBYTttQ0FDZDtvQ0FDQyxhQUFhOzs7OzRCQUl6QixPQUFPLGlCQUFpQjt3QkFDNUIsT0FBTyxLQUFLLDZCQUE2QixRQUFROzs7O2dCQUl6RCxTQUFTLDRCQUE0QixZQUFNO29CQUN2QyxHQUFHLCtFQUErRSxZQUFNO3dCQUNwRixJQUFJLFVBQVUsRUFBRSxNQUFNOzRCQUNsQixjQUFjLEVBQUUsb0JBQW9COzRCQUNwQyxPQUFPLGlCQUFpQjs7d0JBRTVCLEtBQUssdUJBQXVCO3dCQUM1QixXQUFXO3dCQUNYLE9BQU8sZUFBZSxPQUFPO3dCQUM3QixPQUFPLDRCQUE0QixxQkFBcUI7Ozs7OztHQXdCakUiLCJmaWxlIjoiY29tbW9uL2lkZW50aXR5L2FjY291bnQvQWNjb3VudERldGFpbEN0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBhY2NvdW50TW9kdWxlIGZyb20gJ2NvbW1vbi9pZGVudGl0eS9hY2NvdW50L0lkZW50aXR5QWNjb3VudE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdBY2NvdW50RGV0YWlsQ3RybCcsICgpID0+IHtcblxuICAgIGxldCAkY29udHJvbGxlciwgRW50aXRsZW1lbnQsIExpbmtBdHRyaWJ1dGUsIHNob3dFbnRpdGxlbWVudERldGFpbHNGdW5jLCAkbW9kYWxJbnN0YW5jZSwgJHJvb3RTY29wZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGFjY291bnRNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJGNvbnRyb2xsZXJfLCBfRW50aXRsZW1lbnRfLCBfTGlua0F0dHJpYnV0ZV8sIF8kcm9vdFNjb3BlXywgJHEpID0+IHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICBFbnRpdGxlbWVudCA9IF9FbnRpdGxlbWVudF87XG4gICAgICAgIExpbmtBdHRyaWJ1dGUgPSBfTGlua0F0dHJpYnV0ZV87XG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XG5cbiAgICAgICAgc2hvd0VudGl0bGVtZW50RGV0YWlsc0Z1bmMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnc2hvd0RldGFpbHMnKS5hbmQuY2FsbEZha2UoKGVudGl0bGVtZW50KSA9PiBlbnRpdGxlbWVudCk7XG4gICAgICAgIGxldCBtb2RhbFJlc3VsdERlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UgPSB7XG4gICAgICAgICAgICBjbG9zZTogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoKCkgPT4gbW9kYWxSZXN1bHREZWZlcnJlZC5yZXNvbHZlKCkpLFxuICAgICAgICAgICAgcmVzdWx0OiBtb2RhbFJlc3VsdERlZmVycmVkLnByb21pc2VcbiAgICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdBY2NvdW50RGV0YWlsQ3RybCcsIHtcbiAgICAgICAgICAgIGFjY291bnQ6IGFjY291bnQsXG4gICAgICAgICAgICBzaG93RW50aXRsZW1lbnREZXRhaWxzRnVuYzogc2hvd0VudGl0bGVtZW50RGV0YWlsc0Z1bmMsXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZTogJG1vZGFsSW5zdGFuY2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaXQoJ2Jsb3dzIHVwIHdpdGggbm8gYWNjb3VudCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZUNvbnRyb2xsZXIobnVsbCkpLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdG9yZXMgdGhlIGFjY291bnQnLCAoKSA9PiB7XG4gICAgICAgIGxldCBhY2NvdW50ID0geyBhcHBsaWNhdGlvbkRldGFpbHM6ICd0aGluZycgfSxcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGFjY291bnQpO1xuICAgICAgICBleHBlY3QoY3RybC5hY2NvdW50KS50b0VxdWFsKGFjY291bnQpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEFwcGxpY2F0aW9uUmVtZWRpYXRvcnMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgbnVsbCBmb3IgZW1wdHkgb3IgdW5kZWZpbmVkIHJlbWVkaWF0b3JzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGFjY291bnQgPSB7IHNvbWU6ICd0aGluZycgfSxcbiAgICAgICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihhY2NvdW50KTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldEFwcGxpY2F0aW9uUmVtZWRpYXRvcnMoKSkudG9FcXVhbChudWxsKTtcbiAgICAgICAgICAgIGFjY291bnQuYXBwbGljYXRpb24gPSB7IHJlbWVkaWF0b3JzOiAgW10gfTtcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGFjY291bnQpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0QXBwbGljYXRpb25SZW1lZGlhdG9ycygpKS50b0VxdWFsKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBhIENTViBmb3IgZGVmaW5lZCByZW1lZGlhdG9ycycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhY2NvdW50ID0ge1xuICAgICAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtZWRpYXRvcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdQZXJzb24gT25lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnUGVyc29uIFR3bydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGFjY291bnQpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0QXBwbGljYXRpb25SZW1lZGlhdG9ycygpKS50b0VxdWFsKCdQZXJzb24gT25lLCBQZXJzb24gVHdvJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Nob3dFbnRpdGxlbWVudERldGFpbHMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ2Nsb3NlcyBtb2RhbCBpbnN0YW5jZSBhbmQgY2FsbHMgc2hvd0VudGl0bGVtZW50RGV0YWlsc0Z1bmMgd2l0aCBlbnRpdGxlbWVudCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhY2NvdW50ID0geyBzb21lOiAndGhpbmcnIH0sXG4gICAgICAgICAgICAgICAgZW50aXRsZW1lbnQgPSB7IG1hbmFnZWRBdHRyaWJ1dGVJZDogJzEyMzQnIH0sXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoYWNjb3VudCk7XG5cbiAgICAgICAgICAgIGN0cmwuc2hvd0VudGl0bGVtZW50RGV0YWlscyhlbnRpdGxlbWVudCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KCRtb2RhbEluc3RhbmNlLmNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3Qoc2hvd0VudGl0bGVtZW50RGV0YWlsc0Z1bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGVudGl0bGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
