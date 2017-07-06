System.register(['test/js/TestInitializer', 'identity/IdentityModule'], function (_export) {

    /**
     * Tests for the DesktopHomeCtrl
     */
    'use strict';

    var IdentityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            IdentityModule = _identityIdentityModule['default'];
        }],
        execute: function () {
            describe('IdentityCtrl', function () {
                var identityService = undefined,
                    navigationService = undefined,
                    spModal = undefined,
                    $stateParams = undefined,
                    $q = undefined,
                    $controller = undefined,
                    $scope = undefined,
                    quickLink = undefined,
                    QuickLink = undefined,
                    availableActions = undefined,
                    identityId = '12345';

                beforeEach(module(IdentityModule));

                /* jshint maxparams: 7 */
                beforeEach(inject(function (_$controller_, $rootScope, _identityService_, _navigationService_, _spModal_, _$q_, _QuickLink_) {
                    $scope = $rootScope.$new();
                    identityService = _identityService_;
                    navigationService = _navigationService_;
                    $stateParams = {
                        identityId: identityId
                    };
                    $q = _$q_;
                    $controller = _$controller_;
                    spModal = _spModal_;
                    QuickLink = _QuickLink_;
                    availableActions = [];
                }));

                function createController(isAllowSetPassword) {
                    return $controller('IdentityCtrl', {
                        identityService: identityService,
                        navigationService: navigationService,
                        spModal: spModal,
                        $stateParams: $stateParams,
                        availableActions: availableActions,
                        SET_IDENTITY_PASSWORD: isAllowSetPassword
                    });
                }

                it('should throw if there is no identityId on $stateParams', function () {
                    $stateParams.identityId = undefined;
                    expect(function () {
                        return createController();
                    }).toThrow();
                });

                it('should call getIdentity with the identity id and quicklink from $stateparams', function () {
                    spyOn(identityService, 'getIdentity').and.returnValue($q.when());
                    createController();
                    expect(identityService.getIdentity).toHaveBeenCalledWith(identityId);
                });

                it('should set identity on the controller', function () {
                    var identity = {
                        foo: 'bar'
                    },
                        ctrl = undefined;
                    spyOn(identityService, 'getIdentity').and.returnValue($q.when(identity));
                    spyOn(identityService, 'getAvailableActions').and.returnValue($q.when([]));
                    ctrl = createController();
                    $scope.$apply();
                    expect(ctrl.getIdentity()).toBe(identity);
                });

                it('should show an alert modal when getIdentity is rejected', function () {
                    var fakeModal = {
                        result: {
                            'finally': function () {
                                return $q.reject();
                            }
                        }
                    };
                    spyOn(identityService, 'getIdentity').and.returnValue($q.reject());
                    spyOn(identityService, 'getAvailableActions').and.returnValue($q.when([]));
                    spyOn(spModal, 'open').and.returnValue(fakeModal);
                    createController();
                    $scope.$apply();
                    expect(spModal.open).toHaveBeenCalled();
                });

                it('should set is isAttributesTabAllowed to be false on empty allowed actions', function () {
                    var ctrl = createController();
                    expect(ctrl.isAttributesTabAllowed()).toBeFalsy();
                });

                it('should set is isAccessTabAllowed to be false on empty allowed actions', function () {
                    var ctrl = createController();
                    expect(ctrl.isAccessTabAllowed()).toBeFalsy();
                });

                it('should set is isAccountsTabAllowed to be false on empty allowed actions', function () {
                    var ctrl = createController();
                    expect(ctrl.isAccountsTabAllowed()).toBeFalsy();
                });

                it('should set is isPasswordsTabAllowed to be false on empty allowed actions', function () {
                    var ctrl = createController();
                    expect(ctrl.isPasswordsTabAllowed()).toBeFalsy();
                });

                it('should set is isEditButtonAllowed to be false on empty allowed actions', function () {
                    var ctrl = createController();
                    expect(ctrl.isEditButtonAllowed()).toBeFalsy();
                });

                it('should allow change password if has a view identity quicklink and correct right', function () {
                    var ctrl = createController(true),
                        quickLinks = new QuickLink({
                        action: QuickLink.Actions.VIEW_IDENTITY
                    });
                    ctrl.availableActions = [quickLinks];
                    expect(ctrl.isChangePasswordAllowed()).toBeTruthy();
                });

                it('should disallow change password if does not have view identity quicklink', function () {
                    var ctrl = createController(true);
                    expect(ctrl.isChangePasswordAllowed()).toBeFalsy();
                });

                it('should disallow change password if does not have right', function () {
                    var ctrl = createController(),
                        quickLinks = new QuickLink({
                        action: QuickLink.Actions.VIEW_IDENTITY
                    });
                    ctrl.availableActions = [quickLinks];
                    expect(ctrl.isChangePasswordAllowed()).toBeFalsy();
                });

                it('should set is isAttributesTabAllowed to be true on allowed actions', function () {
                    var ctrl = createController();
                    quickLink = new QuickLink({
                        action: QuickLink.Actions.VIEW_IDENTITY
                    });
                    ctrl.availableActions = [quickLink];
                    expect(ctrl.isAttributesTabAllowed()).toBeTruthy();
                });

                it('should set is isAccessTabAllowed to be true on allowed actions', function () {
                    var ctrl = createController();
                    quickLink = new QuickLink({
                        action: QuickLink.Actions.VIEW_IDENTITY
                    });
                    ctrl.availableActions = [quickLink];
                    expect(ctrl.isAccessTabAllowed()).toBeTruthy();
                });

                it('should set is isAccountsTabAllowed to be true on allowed actions', function () {
                    var ctrl = createController();
                    quickLink = new QuickLink({
                        action: QuickLink.Actions.MANAGE_ACCOUNTS
                    });
                    ctrl.availableActions = [quickLink];
                    expect(ctrl.isAccountsTabAllowed()).toBeTruthy();
                });

                it('should set is isPasswordsTabAllowed to be true on allowed actions', function () {
                    var ctrl = createController();
                    quickLink = new QuickLink({
                        action: QuickLink.Actions.MANAGE_PASSWORDS
                    });
                    ctrl.availableActions = [quickLink];
                    expect(ctrl.isPasswordsTabAllowed()).toBeTruthy();
                });

                it('should set is isEditButtonAllowed to be true on allowed actions', function () {
                    var ctrl = createController();
                    quickLink = new QuickLink({
                        action: QuickLink.Actions.MANAGE_ATTRIBUTES
                    });
                    ctrl.availableActions = [quickLink];
                    expect(ctrl.isEditButtonAllowed()).toBeTruthy();
                });

                describe('unlockIdentity', function () {
                    it('should call through to identityService', function () {
                        var ctrl = createController();
                        spyOn(identityService, 'unlockIdentity').and.returnValue($q.defer().promise);
                        ctrl.unlockIdentity();
                        expect(identityService.unlockIdentity).toHaveBeenCalled();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0lkZW50aXR5Q3RybFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw0QkFBNEIsVUFBVSxTQUFTOzs7OztJQUEzRjs7SUFPSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGlCQUFpQix3QkFBd0I7O1FBRTdDLFNBQVMsWUFBWTtZQUo3QixTQUFTLGdCQUFnQixZQUFXO2dCQUNoQyxJQUFJLGtCQUFlO29CQUFFLG9CQUFpQjtvQkFBRSxVQUFPO29CQUFFLGVBQVk7b0JBQUUsS0FBRTtvQkFBRSxjQUFXO29CQUFFLFNBQU07b0JBQUUsWUFBUztvQkFBRSxZQUFTO29CQUN4RyxtQkFBZ0I7b0JBQUUsYUFBYTs7Z0JBRW5DLFdBQVcsT0FBTzs7O2dCQUdsQixXQUFXLE9BQU8sVUFBUyxlQUFlLFlBQVksbUJBQW1CLHFCQUFxQixXQUNuRSxNQUFNLGFBQWE7b0JBQzFDLFNBQVMsV0FBVztvQkFDcEIsa0JBQWtCO29CQUNsQixvQkFBb0I7b0JBQ3BCLGVBQWU7d0JBQ1gsWUFBWTs7b0JBRWhCLEtBQUs7b0JBQ0wsY0FBYztvQkFDZCxVQUFVO29CQUNWLFlBQVk7b0JBQ1osbUJBQW1COzs7Z0JBR3ZCLFNBQVMsaUJBQWlCLG9CQUFvQjtvQkFDMUMsT0FBTyxZQUFZLGdCQUFnQjt3QkFDL0IsaUJBQWlCO3dCQUNqQixtQkFBbUI7d0JBQ25CLFNBQVM7d0JBQ1QsY0FBYzt3QkFDZCxrQkFBa0I7d0JBQ2xCLHVCQUF1Qjs7OztnQkFJL0IsR0FBRywwREFBMEQsWUFBVztvQkFDcEUsYUFBYSxhQUFhO29CQUMxQixPQUFPLFlBQUE7d0JBY1MsT0FkSDt1QkFBb0I7OztnQkFHckMsR0FBRyxnRkFBZ0YsWUFBVztvQkFDMUYsTUFBTSxpQkFBaUIsZUFBZSxJQUFJLFlBQVksR0FBRztvQkFDekQ7b0JBQ0EsT0FBTyxnQkFBZ0Is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QixPQUFPLEtBQUssdUJBQXVCOzs7Z0JBR3ZDLFNBQVMsa0JBQWtCLFlBQVc7b0JBQ2xDLEdBQUcsMENBQTBDLFlBQVc7d0JBQ3BELElBQUksT0FBTzt3QkFDWCxNQUFNLGlCQUFpQixrQkFBa0IsSUFBSSxZQUFZLEdBQUcsUUFBUTt3QkFDcEUsS0FBSzt3QkFDTCxPQUFPLGdCQUFnQixnQkFBZ0I7Ozs7OztHQXNCaEQiLCJmaWxlIjoiaWRlbnRpdHkvSWRlbnRpdHlDdHJsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IElkZW50aXR5TW9kdWxlIGZyb20gJ2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcblxuLyoqXG4gKiBUZXN0cyBmb3IgdGhlIERlc2t0b3BIb21lQ3RybFxuICovXG5kZXNjcmliZSgnSWRlbnRpdHlDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgbGV0IGlkZW50aXR5U2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsIHNwTW9kYWwsICRzdGF0ZVBhcmFtcywgJHEsICRjb250cm9sbGVyLCAkc2NvcGUsIHF1aWNrTGluaywgUXVpY2tMaW5rLFxuICAgICAgICBhdmFpbGFibGVBY3Rpb25zLCBpZGVudGl0eUlkID0gJzEyMzQ1JztcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKElkZW50aXR5TW9kdWxlKSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiA3ICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXywgJHJvb3RTY29wZSwgX2lkZW50aXR5U2VydmljZV8sIF9uYXZpZ2F0aW9uU2VydmljZV8sIF9zcE1vZGFsXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfJHFfLCBfUXVpY2tMaW5rXykge1xuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgaWRlbnRpdHlTZXJ2aWNlID0gX2lkZW50aXR5U2VydmljZV87XG4gICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlID0gX25hdmlnYXRpb25TZXJ2aWNlXztcbiAgICAgICAgJHN0YXRlUGFyYW1zID0ge1xuICAgICAgICAgICAgaWRlbnRpdHlJZDogaWRlbnRpdHlJZFxuICAgICAgICB9O1xuICAgICAgICAkcSA9IF8kcV87XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgUXVpY2tMaW5rID0gX1F1aWNrTGlua187XG4gICAgICAgIGF2YWlsYWJsZUFjdGlvbnMgPSBbXTtcbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGlzQWxsb3dTZXRQYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ0lkZW50aXR5Q3RybCcsIHtcbiAgICAgICAgICAgIGlkZW50aXR5U2VydmljZTogaWRlbnRpdHlTZXJ2aWNlLFxuICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2U6IG5hdmlnYXRpb25TZXJ2aWNlLFxuICAgICAgICAgICAgc3BNb2RhbDogc3BNb2RhbCxcbiAgICAgICAgICAgICRzdGF0ZVBhcmFtczogJHN0YXRlUGFyYW1zLFxuICAgICAgICAgICAgYXZhaWxhYmxlQWN0aW9uczogYXZhaWxhYmxlQWN0aW9ucyxcbiAgICAgICAgICAgIFNFVF9JREVOVElUWV9QQVNTV09SRDogaXNBbGxvd1NldFBhc3N3b3JkXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgdGhlcmUgaXMgbm8gaWRlbnRpdHlJZCBvbiAkc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJHN0YXRlUGFyYW1zLmlkZW50aXR5SWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVDb250cm9sbGVyKCkpLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FsbCBnZXRJZGVudGl0eSB3aXRoIHRoZSBpZGVudGl0eSBpZCBhbmQgcXVpY2tsaW5rIGZyb20gJHN0YXRlcGFyYW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ2dldElkZW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oKSk7XG4gICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgZXhwZWN0KGlkZW50aXR5U2VydmljZS5nZXRJZGVudGl0eSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaWRlbnRpdHlJZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBpZGVudGl0eSBvbiB0aGUgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgaWRlbnRpdHkgPSB7XG4gICAgICAgICAgICBmb286ICdiYXInXG4gICAgICAgIH0sIGN0cmw7XG4gICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ2dldElkZW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4oaWRlbnRpdHkpKTtcbiAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAnZ2V0QXZhaWxhYmxlQWN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKFtdKSk7XG4gICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KGN0cmwuZ2V0SWRlbnRpdHkoKSkudG9CZShpZGVudGl0eSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgYW4gYWxlcnQgbW9kYWwgd2hlbiBnZXRJZGVudGl0eSBpcyByZWplY3RlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZmFrZU1vZGFsID0ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ2dldElkZW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLnJlamVjdCgpKTtcbiAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAnZ2V0QXZhaWxhYmxlQWN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKFtdKSk7XG4gICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLnJldHVyblZhbHVlKGZha2VNb2RhbCk7XG4gICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBpcyBpc0F0dHJpYnV0ZXNUYWJBbGxvd2VkIHRvIGJlIGZhbHNlIG9uIGVtcHR5IGFsbG93ZWQgYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNBdHRyaWJ1dGVzVGFiQWxsb3dlZCgpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzIGlzQWNjZXNzVGFiQWxsb3dlZCB0byBiZSBmYWxzZSBvbiBlbXB0eSBhbGxvd2VkIGFjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgIGV4cGVjdChjdHJsLmlzQWNjZXNzVGFiQWxsb3dlZCgpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzIGlzQWNjb3VudHNUYWJBbGxvd2VkIHRvIGJlIGZhbHNlIG9uIGVtcHR5IGFsbG93ZWQgYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNBY2NvdW50c1RhYkFsbG93ZWQoKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBpcyBpc1Bhc3N3b3Jkc1RhYkFsbG93ZWQgdG8gYmUgZmFsc2Ugb24gZW1wdHkgYWxsb3dlZCBhY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICBleHBlY3QoY3RybC5pc1Bhc3N3b3Jkc1RhYkFsbG93ZWQoKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBpcyBpc0VkaXRCdXR0b25BbGxvd2VkIHRvIGJlIGZhbHNlIG9uIGVtcHR5IGFsbG93ZWQgYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNFZGl0QnV0dG9uQWxsb3dlZCgpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgY2hhbmdlIHBhc3N3b3JkIGlmIGhhcyBhIHZpZXcgaWRlbnRpdHkgcXVpY2tsaW5rIGFuZCBjb3JyZWN0IHJpZ2h0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcih0cnVlKSxcbiAgICAgICAgICAgIHF1aWNrTGlua3MgPSBuZXcgUXVpY2tMaW5rKHtcbiAgICAgICAgICAgIGFjdGlvbjogUXVpY2tMaW5rLkFjdGlvbnMuVklFV19JREVOVElUWVxuICAgICAgICB9KTtcbiAgICAgICAgY3RybC5hdmFpbGFibGVBY3Rpb25zID0gW3F1aWNrTGlua3NdO1xuICAgICAgICBleHBlY3QoY3RybC5pc0NoYW5nZVBhc3N3b3JkQWxsb3dlZCgpKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRpc2FsbG93IGNoYW5nZSBwYXNzd29yZCBpZiBkb2VzIG5vdCBoYXZlIHZpZXcgaWRlbnRpdHkgcXVpY2tsaW5rJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcih0cnVlKTtcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNDaGFuZ2VQYXNzd29yZEFsbG93ZWQoKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRpc2FsbG93IGNoYW5nZSBwYXNzd29yZCBpZiBkb2VzIG5vdCBoYXZlIHJpZ2h0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpLFxuICAgICAgICAgICAgcXVpY2tMaW5rcyA9IG5ldyBRdWlja0xpbmsoe1xuICAgICAgICAgICAgICAgIGFjdGlvbjogUXVpY2tMaW5rLkFjdGlvbnMuVklFV19JREVOVElUWVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGN0cmwuYXZhaWxhYmxlQWN0aW9ucyA9IFtxdWlja0xpbmtzXTtcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNDaGFuZ2VQYXNzd29yZEFsbG93ZWQoKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBpcyBpc0F0dHJpYnV0ZXNUYWJBbGxvd2VkIHRvIGJlIHRydWUgb24gYWxsb3dlZCBhY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICBxdWlja0xpbmsgPSBuZXcgUXVpY2tMaW5rKHtcbiAgICAgICAgICAgIGFjdGlvbjogUXVpY2tMaW5rLkFjdGlvbnMuVklFV19JREVOVElUWVxuICAgICAgICB9KTtcbiAgICAgICAgY3RybC5hdmFpbGFibGVBY3Rpb25zID0gW3F1aWNrTGlua107XG4gICAgICAgIGV4cGVjdChjdHJsLmlzQXR0cmlidXRlc1RhYkFsbG93ZWQoKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaXMgaXNBY2Nlc3NUYWJBbGxvd2VkIHRvIGJlIHRydWUgb24gYWxsb3dlZCBhY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICBxdWlja0xpbmsgPSBuZXcgUXVpY2tMaW5rKHtcbiAgICAgICAgICAgIGFjdGlvbjogUXVpY2tMaW5rLkFjdGlvbnMuVklFV19JREVOVElUWVxuICAgICAgICB9KTtcbiAgICAgICAgY3RybC5hdmFpbGFibGVBY3Rpb25zID0gW3F1aWNrTGlua107XG4gICAgICAgIGV4cGVjdChjdHJsLmlzQWNjZXNzVGFiQWxsb3dlZCgpKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBpcyBpc0FjY291bnRzVGFiQWxsb3dlZCB0byBiZSB0cnVlIG9uIGFsbG93ZWQgYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgcXVpY2tMaW5rID0gbmV3IFF1aWNrTGluayh7XG4gICAgICAgICAgICBhY3Rpb246IFF1aWNrTGluay5BY3Rpb25zLk1BTkFHRV9BQ0NPVU5UU1xuICAgICAgICB9KTtcbiAgICAgICAgY3RybC5hdmFpbGFibGVBY3Rpb25zID0gW3F1aWNrTGlua107XG4gICAgICAgIGV4cGVjdChjdHJsLmlzQWNjb3VudHNUYWJBbGxvd2VkKCkpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzIGlzUGFzc3dvcmRzVGFiQWxsb3dlZCB0byBiZSB0cnVlIG9uIGFsbG93ZWQgYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgcXVpY2tMaW5rID0gbmV3IFF1aWNrTGluayh7XG4gICAgICAgICAgICBhY3Rpb246IFF1aWNrTGluay5BY3Rpb25zLk1BTkFHRV9QQVNTV09SRFNcbiAgICAgICAgfSk7XG4gICAgICAgIGN0cmwuYXZhaWxhYmxlQWN0aW9ucyA9IFtxdWlja0xpbmtdO1xuICAgICAgICBleHBlY3QoY3RybC5pc1Bhc3N3b3Jkc1RhYkFsbG93ZWQoKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaXMgaXNFZGl0QnV0dG9uQWxsb3dlZCB0byBiZSB0cnVlIG9uIGFsbG93ZWQgYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgcXVpY2tMaW5rID0gbmV3IFF1aWNrTGluayh7XG4gICAgICAgICAgICBhY3Rpb246IFF1aWNrTGluay5BY3Rpb25zLk1BTkFHRV9BVFRSSUJVVEVTXG4gICAgICAgIH0pO1xuICAgICAgICBjdHJsLmF2YWlsYWJsZUFjdGlvbnMgPSBbcXVpY2tMaW5rXTtcbiAgICAgICAgZXhwZWN0KGN0cmwuaXNFZGl0QnV0dG9uQWxsb3dlZCgpKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndW5sb2NrSWRlbnRpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHRocm91Z2ggdG8gaWRlbnRpdHlTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ3VubG9ja0lkZW50aXR5JykuYW5kLnJldHVyblZhbHVlKCRxLmRlZmVyKCkucHJvbWlzZSk7XG4gICAgICAgICAgICBjdHJsLnVubG9ja0lkZW50aXR5KCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlTZXJ2aWNlLnVubG9ja0lkZW50aXR5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
