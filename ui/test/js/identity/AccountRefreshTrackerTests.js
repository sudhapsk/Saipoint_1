System.register(['test/js/TestInitializer', 'identity/IdentityModule'], function (_export) {
    'use strict';

    var identityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }],
        execute: function () {

            describe('AccountRefreshTracker', function () {

                var tracker = undefined,
                    account = undefined,
                    account2 = undefined,
                    result = undefined,
                    result2 = undefined,
                    deferred = undefined,
                    promise = undefined,
                    $scope = undefined,
                    listener = undefined;

                beforeEach(module(identityModule));

                beforeEach(inject(function (AccountRefreshTracker, AccountLink, AccountRefreshResult, $q, $rootScope) {
                    tracker = new AccountRefreshTracker();
                    account = new AccountLink({
                        id: '129387'
                    });
                    account2 = new AccountLink({
                        id: '9klsadjiulafu8i2rhfal9882oihafna7opllcku*yn5k3r76(*'
                    });

                    $scope = $rootScope;
                    deferred = $q.defer();
                    promise = deferred.promise;

                    result = new AccountRefreshResult({
                        id: account.id,
                        error: null,
                        deleted: false,
                        account: account
                    });
                    result2 = new AccountRefreshResult({
                        id: account2.id,
                        error: null,
                        deleted: false,
                        account: account2
                    });

                    listener = {
                        linkRefreshed: jasmine.createSpy('linkRefreshed'),
                        linkDeleted: jasmine.createSpy('linkDeleted')
                    };
                }));

                describe('accountBeingRefreshed()', function () {
                    it('marks the account as refreshing', function () {
                        expect(tracker.isRefreshing(account)).toEqual(false);
                        tracker.accountBeingRefreshed(account, promise);
                        expect(tracker.isRefreshing(account)).toEqual(true);
                    });

                    it('marks the account as not refreshing when refresh promise resolves', function () {
                        tracker.accountBeingRefreshed(account, promise);
                        deferred.resolve([result, result2]);
                        $scope.$digest();
                        expect(tracker.isRefreshing(account)).toEqual(false);
                        expect(tracker.isRefreshing(account2)).toEqual(false);
                    });

                    it('marks the account as not refreshed prior to refresh promise resolving', function () {
                        tracker.accountBeingRefreshed(account, promise);
                        expect(tracker.hasBeenRefreshed(account)).toEqual(false);
                    });

                    it('marks the account as refreshed when refresh promise resolves', function () {
                        tracker.accountBeingRefreshed(account, promise);
                        deferred.resolve(account);
                        $scope.$digest();
                        expect(tracker.hasBeenRefreshed(account)).toEqual(true);
                    });

                    it('marks the account as refreshed when refresh promise rejects', function () {
                        tracker.accountBeingRefreshed(account, promise);
                        deferred.reject('boom!');
                        $scope.$digest();
                        expect(tracker.hasBeenRefreshed(account)).toEqual(true);
                    });

                    it('notifies listeners when refresh promise resolves', function () {
                        tracker.registerRefreshListener(listener);
                        tracker.accountBeingRefreshed(account, promise);
                        deferred.resolve(account);
                        expect(listener.linkRefreshed).not.toHaveBeenCalled();
                        $scope.$digest();
                        expect(listener.linkRefreshed).toHaveBeenCalledWith(account);
                    });

                    it('notifies listeners when refresh promise rejects', function () {
                        tracker.registerRefreshListener(listener);
                        tracker.accountBeingRefreshed(account, promise);
                        deferred.reject('uh oh!');
                        expect(listener.linkDeleted).not.toHaveBeenCalled();
                        $scope.$digest();
                        expect(listener.linkDeleted).toHaveBeenCalledWith(account.id);
                    });
                });

                describe('accountsBeingRefreshed()', function () {
                    it('marks the accounts as refreshing', function () {
                        expect(tracker.isRefreshing(account)).toEqual(false);
                        expect(tracker.isRefreshing(account2)).toEqual(false);
                        tracker.accountsBeingRefreshed([account.id, account2.id], promise);
                        expect(tracker.isRefreshing(account)).toEqual(true);
                        expect(tracker.isRefreshing(account2)).toEqual(true);
                    });

                    it('marks the accounts as not refreshing when refresh promise resolves', function () {
                        tracker.accountBeingRefreshed([account.id, account2.id], promise);
                        deferred.resolve([result, result2]);
                        $scope.$digest();
                        expect(tracker.isRefreshing(account)).toEqual(false);
                    });

                    it('marks the accounts as not refreshed prior to refresh promise resolving', function () {
                        tracker.accountsBeingRefreshed([account.id, account2.id], promise);
                        expect(tracker.hasBeenRefreshed(account)).toEqual(false);
                        expect(tracker.hasBeenRefreshed(account2)).toEqual(false);
                    });

                    it('marks the accounts as refreshed when refresh promise resolves', function () {
                        tracker.accountsBeingRefreshed([account.id, account2.id], promise);
                        deferred.resolve([result, result2]);
                        $scope.$digest();
                        expect(tracker.hasBeenRefreshed(account)).toEqual(true);
                        expect(tracker.hasBeenRefreshed(account2)).toEqual(true);
                    });

                    it('marks the accounts as refreshed when refresh promise rejects', function () {
                        tracker.accountsBeingRefreshed([account.id, account2.id], promise);
                        deferred.reject('boom!');
                        $scope.$digest();
                        expect(tracker.hasBeenRefreshed(account)).toEqual(true);
                        expect(tracker.hasBeenRefreshed(account2)).toEqual(true);
                    });

                    it('notifies listeners when refresh promise resolves with success', function () {
                        tracker.registerRefreshListener(listener);
                        tracker.accountsBeingRefreshed([account.id], promise);
                        deferred.resolve([result]);
                        expect(listener.linkRefreshed).not.toHaveBeenCalled();
                        $scope.$digest();
                        expect(listener.linkRefreshed).toHaveBeenCalledWith(account);
                    });

                    it('notifies listeners when refresh promise resolves with deleted', function () {
                        tracker.registerRefreshListener(listener);
                        tracker.accountsBeingRefreshed([account.id], promise);
                        result.deleted = true;
                        deferred.resolve([result]);
                        expect(listener.linkDeleted).not.toHaveBeenCalled();
                        $scope.$digest();
                        expect(listener.linkDeleted).toHaveBeenCalledWith(account.id);
                    });
                });

                it('hasBeenRefreshed() returns false when account has not been refreshed', function () {
                    expect(tracker.hasBeenRefreshed(account)).toEqual(false);
                });

                it('isRefreshing() returns false when account has not been refreshed', function () {
                    expect(tracker.isRefreshing(account)).toEqual(false);
                });

                describe('isBeingTracked()', function () {
                    it('returns false if account has not been tracked', function () {
                        expect(tracker.isBeingTracked(account)).toEqual(false);
                    });

                    it('returns true if account is refreshing', function () {
                        tracker.accountBeingRefreshed(account, promise);
                        expect(tracker.isBeingTracked(account)).toEqual(true);
                    });

                    it('returns true if account is done refreshing', function () {
                        tracker.accountBeingRefreshed(account, promise);
                        deferred.resolve(account);
                        $scope.$digest();
                        expect(tracker.isBeingTracked(account)).toEqual(true);
                    });
                });

                it('registerRefreshListener() adds a listener', function () {
                    tracker.registerRefreshListener(listener);
                    expect(tracker.refreshListeners.length).toEqual(1);
                });

                it('unregisterRefreshListener() removes a listener', function () {
                    tracker.registerRefreshListener(listener);
                    tracker.unregisterRefreshListener(listener);
                    expect(tracker.refreshListeners.length).toEqual(0);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0FjY291bnRSZWZyZXNoVHJhY2tlclRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw0QkFBNEIsVUFBVSxTQUFTO0lBQ3ZGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3Qjs7UUFFN0MsU0FBUyxZQUFZOztZQUw3QixTQUFTLHlCQUF5QixZQUFNOztnQkFFcEMsSUFBSSxVQUFPO29CQUFFLFVBQU87b0JBQUUsV0FBUTtvQkFBRSxTQUFNO29CQUFFLFVBQU87b0JBQUUsV0FBUTtvQkFBRSxVQUFPO29CQUFFLFNBQU07b0JBQUUsV0FBUTs7Z0JBRXBGLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLHVCQUF1QixhQUFhLHNCQUFzQixJQUFJLFlBQWU7b0JBQzVGLFVBQVUsSUFBSTtvQkFDZCxVQUFVLElBQUksWUFBWTt3QkFDdEIsSUFBSTs7b0JBRVIsV0FBVyxJQUFJLFlBQVk7d0JBQ3ZCLElBQUk7OztvQkFHUixTQUFTO29CQUNULFdBQVcsR0FBRztvQkFDZCxVQUFVLFNBQVM7O29CQUVuQixTQUFTLElBQUkscUJBQXFCO3dCQUM5QixJQUFJLFFBQVE7d0JBQ1osT0FBTzt3QkFDUCxTQUFTO3dCQUNULFNBQVM7O29CQUViLFVBQVUsSUFBSSxxQkFBcUI7d0JBQy9CLElBQUksU0FBUzt3QkFDYixPQUFPO3dCQUNQLFNBQVM7d0JBQ1QsU0FBUzs7O29CQUdiLFdBQVc7d0JBQ1AsZUFBZSxRQUFRLFVBQVU7d0JBQ2pDLGFBQWEsUUFBUSxVQUFVOzs7O2dCQUl2QyxTQUFTLDJCQUEyQixZQUFNO29CQUN0QyxHQUFHLG1DQUFtQyxZQUFNO3dCQUN4QyxPQUFPLFFBQVEsYUFBYSxVQUFVLFFBQVE7d0JBQzlDLFFBQVEsc0JBQXNCLFNBQVM7d0JBQ3ZDLE9BQU8sUUFBUSxh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QUd4RCxHQUFHLGlFQUFpRSxZQUFNO3dCQUN0RSxRQUFRLHdCQUF3Qjt3QkFDaEMsUUFBUSx1QkFBdUIsQ0FBRSxRQUFRLEtBQU07d0JBQy9DLE9BQU8sVUFBVTt3QkFDakIsU0FBUyxRQUFRLENBQUU7d0JBQ25CLE9BQU8sU0FBUyxhQUFhLElBQUk7d0JBQ2pDLE9BQU87d0JBQ1AsT0FBTyxTQUFTLGFBQWEscUJBQXFCLFFBQVE7Ozs7Z0JBSWxFLEdBQUcsd0VBQXdFLFlBQU07b0JBQzdFLE9BQU8sUUFBUSxpQkFBaUIsVUFBVSxRQUFROzs7Z0JBR3RELEdBQUcsb0VBQW9FLFlBQU07b0JBQ3pFLE9BQU8sUUFBUSxhQUFhLFVBQVUsUUFBUTs7O2dCQUdsRCxTQUFTLG9CQUFvQixZQUFNO29CQUMvQixHQUFHLGlEQUFpRCxZQUFNO3dCQUN0RCxPQUFPLFFBQVEsZUFBZSxVQUFVLFFBQVE7OztvQkFHcEQsR0FBRyx5Q0FBeUMsWUFBTTt3QkFDOUMsUUFBUSxzQkFBc0IsU0FBUzt3QkFDdkMsT0FBTyxRQUFRLGVBQWUsVUFBVSxRQUFROzs7b0JBR3BELEdBQUcsOENBQThDLFlBQU07d0JBQ25ELFFBQVEsc0JBQXNCLFNBQVM7d0JBQ3ZDLFNBQVMsUUFBUTt3QkFDakIsT0FBTzt3QkFDUCxPQUFPLFFBQVEsZUFBZSxVQUFVLFFBQVE7Ozs7Z0JBSXhELEdBQUcsNkNBQTZDLFlBQU07b0JBQ2xELFFBQVEsd0JBQXdCO29CQUNoQyxPQUFPLFFBQVEsaUJBQWlCLFFBQVEsUUFBUTs7O2dCQUdwRCxHQUFHLGtEQUFrRCxZQUFNO29CQUN2RCxRQUFRLHdCQUF3QjtvQkFDaEMsUUFBUSwwQkFBMEI7b0JBQ2xDLE9BQU8sUUFBUSxpQkFBaUIsUUFBUSxRQUFROzs7OztHQW9CckQiLCJmaWxlIjoiaWRlbnRpdHkvQWNjb3VudFJlZnJlc2hUcmFja2VyVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGlkZW50aXR5TW9kdWxlIGZyb20gJ2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdBY2NvdW50UmVmcmVzaFRyYWNrZXInLCAoKSA9PiB7XHJcblxyXG4gICAgbGV0IHRyYWNrZXIsIGFjY291bnQsIGFjY291bnQyLCByZXN1bHQsIHJlc3VsdDIsIGRlZmVycmVkLCBwcm9taXNlLCAkc2NvcGUsIGxpc3RlbmVyO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGlkZW50aXR5TW9kdWxlKSk7XHJcblxyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKEFjY291bnRSZWZyZXNoVHJhY2tlciwgQWNjb3VudExpbmssIEFjY291bnRSZWZyZXNoUmVzdWx0LCAkcSwgJHJvb3RTY29wZSkgPT4ge1xyXG4gICAgICAgIHRyYWNrZXIgPSBuZXcgQWNjb3VudFJlZnJlc2hUcmFja2VyKCk7XHJcbiAgICAgICAgYWNjb3VudCA9IG5ldyBBY2NvdW50TGluayh7XHJcbiAgICAgICAgICAgIGlkOiAnMTI5Mzg3J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFjY291bnQyID0gbmV3IEFjY291bnRMaW5rKHtcclxuICAgICAgICAgICAgaWQ6ICc5a2xzYWRqaXVsYWZ1OGkycmhmYWw5ODgyb2loYWZuYTdvcGxsY2t1KnluNWszcjc2KConXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICByZXN1bHQgPSBuZXcgQWNjb3VudFJlZnJlc2hSZXN1bHQoe1xyXG4gICAgICAgICAgICBpZDogYWNjb3VudC5pZCxcclxuICAgICAgICAgICAgZXJyb3I6IG51bGwsXHJcbiAgICAgICAgICAgIGRlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBhY2NvdW50OiBhY2NvdW50XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzdWx0MiA9IG5ldyBBY2NvdW50UmVmcmVzaFJlc3VsdCh7XHJcbiAgICAgICAgICAgIGlkOiBhY2NvdW50Mi5pZCxcclxuICAgICAgICAgICAgZXJyb3I6IG51bGwsXHJcbiAgICAgICAgICAgIGRlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBhY2NvdW50OiBhY2NvdW50MlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsaXN0ZW5lciA9IHtcclxuICAgICAgICAgICAgbGlua1JlZnJlc2hlZDogamFzbWluZS5jcmVhdGVTcHkoJ2xpbmtSZWZyZXNoZWQnKSxcclxuICAgICAgICAgICAgbGlua0RlbGV0ZWQ6IGphc21pbmUuY3JlYXRlU3B5KCdsaW5rRGVsZXRlZCcpXHJcbiAgICAgICAgfTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBkZXNjcmliZSgnYWNjb3VudEJlaW5nUmVmcmVzaGVkKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ21hcmtzIHRoZSBhY2NvdW50IGFzIHJlZnJlc2hpbmcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzUmVmcmVzaGluZyhhY2NvdW50KSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIHRyYWNrZXIuYWNjb3VudEJlaW5nUmVmcmVzaGVkKGFjY291bnQsIHByb21pc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc1JlZnJlc2hpbmcoYWNjb3VudCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdtYXJrcyB0aGUgYWNjb3VudCBhcyBub3QgcmVmcmVzaGluZyB3aGVuIHJlZnJlc2ggcHJvbWlzZSByZXNvbHZlcycsICgpID0+IHtcclxuICAgICAgICAgICAgdHJhY2tlci5hY2NvdW50QmVpbmdSZWZyZXNoZWQoYWNjb3VudCwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoWyByZXN1bHQsIHJlc3VsdDIgXSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzUmVmcmVzaGluZyhhY2NvdW50KSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzUmVmcmVzaGluZyhhY2NvdW50MikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbWFya3MgdGhlIGFjY291bnQgYXMgbm90IHJlZnJlc2hlZCBwcmlvciB0byByZWZyZXNoIHByb21pc2UgcmVzb2x2aW5nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cmFja2VyLmFjY291bnRCZWluZ1JlZnJlc2hlZChhY2NvdW50LCBwcm9taXNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRyYWNrZXIuaGFzQmVlblJlZnJlc2hlZChhY2NvdW50KSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdtYXJrcyB0aGUgYWNjb3VudCBhcyByZWZyZXNoZWQgd2hlbiByZWZyZXNoIHByb21pc2UgcmVzb2x2ZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNrZXIuYWNjb3VudEJlaW5nUmVmcmVzaGVkKGFjY291bnQsIHByb21pc2UpO1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGFjY291bnQpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5oYXNCZWVuUmVmcmVzaGVkKGFjY291bnQpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbWFya3MgdGhlIGFjY291bnQgYXMgcmVmcmVzaGVkIHdoZW4gcmVmcmVzaCBwcm9taXNlIHJlamVjdHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNrZXIuYWNjb3VudEJlaW5nUmVmcmVzaGVkKGFjY291bnQsIHByb21pc2UpO1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ2Jvb20hJyk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmhhc0JlZW5SZWZyZXNoZWQoYWNjb3VudCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdub3RpZmllcyBsaXN0ZW5lcnMgd2hlbiByZWZyZXNoIHByb21pc2UgcmVzb2x2ZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNrZXIucmVnaXN0ZXJSZWZyZXNoTGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB0cmFja2VyLmFjY291bnRCZWluZ1JlZnJlc2hlZChhY2NvdW50LCBwcm9taXNlKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShhY2NvdW50KTtcclxuICAgICAgICAgICAgZXhwZWN0KGxpc3RlbmVyLmxpbmtSZWZyZXNoZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsaXN0ZW5lci5saW5rUmVmcmVzaGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChhY2NvdW50KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ25vdGlmaWVzIGxpc3RlbmVycyB3aGVuIHJlZnJlc2ggcHJvbWlzZSByZWplY3RzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cmFja2VyLnJlZ2lzdGVyUmVmcmVzaExpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgdHJhY2tlci5hY2NvdW50QmVpbmdSZWZyZXNoZWQoYWNjb3VudCwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgndWggb2ghJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsaXN0ZW5lci5saW5rRGVsZXRlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxpc3RlbmVyLmxpbmtEZWxldGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChhY2NvdW50LmlkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdhY2NvdW50c0JlaW5nUmVmcmVzaGVkKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ21hcmtzIHRoZSBhY2NvdW50cyBhcyByZWZyZXNoaW5nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc1JlZnJlc2hpbmcoYWNjb3VudCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc1JlZnJlc2hpbmcoYWNjb3VudDIpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgdHJhY2tlci5hY2NvdW50c0JlaW5nUmVmcmVzaGVkKFsgYWNjb3VudC5pZCwgYWNjb3VudDIuaWQgXSwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzUmVmcmVzaGluZyhhY2NvdW50KSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRyYWNrZXIuaXNSZWZyZXNoaW5nKGFjY291bnQyKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ21hcmtzIHRoZSBhY2NvdW50cyBhcyBub3QgcmVmcmVzaGluZyB3aGVuIHJlZnJlc2ggcHJvbWlzZSByZXNvbHZlcycsICgpID0+IHtcclxuICAgICAgICAgICAgdHJhY2tlci5hY2NvdW50QmVpbmdSZWZyZXNoZWQoWyBhY2NvdW50LmlkLCBhY2NvdW50Mi5pZCBdLCBwcm9taXNlKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShbIHJlc3VsdCwgcmVzdWx0MiBdKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRyYWNrZXIuaXNSZWZyZXNoaW5nKGFjY291bnQpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ21hcmtzIHRoZSBhY2NvdW50cyBhcyBub3QgcmVmcmVzaGVkIHByaW9yIHRvIHJlZnJlc2ggcHJvbWlzZSByZXNvbHZpbmcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNrZXIuYWNjb3VudHNCZWluZ1JlZnJlc2hlZChbIGFjY291bnQuaWQsIGFjY291bnQyLmlkIF0sIHByb21pc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5oYXNCZWVuUmVmcmVzaGVkKGFjY291bnQpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRyYWNrZXIuaGFzQmVlblJlZnJlc2hlZChhY2NvdW50MikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbWFya3MgdGhlIGFjY291bnRzIGFzIHJlZnJlc2hlZCB3aGVuIHJlZnJlc2ggcHJvbWlzZSByZXNvbHZlcycsICgpID0+IHtcclxuICAgICAgICAgICAgdHJhY2tlci5hY2NvdW50c0JlaW5nUmVmcmVzaGVkKFsgYWNjb3VudC5pZCwgYWNjb3VudDIuaWQgXSwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoWyByZXN1bHQsIHJlc3VsdDIgXSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmhhc0JlZW5SZWZyZXNoZWQoYWNjb3VudCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmhhc0JlZW5SZWZyZXNoZWQoYWNjb3VudDIpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbWFya3MgdGhlIGFjY291bnRzIGFzIHJlZnJlc2hlZCB3aGVuIHJlZnJlc2ggcHJvbWlzZSByZWplY3RzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cmFja2VyLmFjY291bnRzQmVpbmdSZWZyZXNoZWQoWyBhY2NvdW50LmlkLCBhY2NvdW50Mi5pZCBdLCBwcm9taXNlKTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdib29tIScpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5oYXNCZWVuUmVmcmVzaGVkKGFjY291bnQpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5oYXNCZWVuUmVmcmVzaGVkKGFjY291bnQyKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ25vdGlmaWVzIGxpc3RlbmVycyB3aGVuIHJlZnJlc2ggcHJvbWlzZSByZXNvbHZlcyB3aXRoIHN1Y2Nlc3MnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNrZXIucmVnaXN0ZXJSZWZyZXNoTGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB0cmFja2VyLmFjY291bnRzQmVpbmdSZWZyZXNoZWQoWyBhY2NvdW50LmlkIF0sIHByb21pc2UpO1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKFsgcmVzdWx0IF0pO1xyXG4gICAgICAgICAgICBleHBlY3QobGlzdGVuZXIubGlua1JlZnJlc2hlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxpc3RlbmVyLmxpbmtSZWZyZXNoZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGFjY291bnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbm90aWZpZXMgbGlzdGVuZXJzIHdoZW4gcmVmcmVzaCBwcm9taXNlIHJlc29sdmVzIHdpdGggZGVsZXRlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgdHJhY2tlci5yZWdpc3RlclJlZnJlc2hMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIHRyYWNrZXIuYWNjb3VudHNCZWluZ1JlZnJlc2hlZChbIGFjY291bnQuaWQgXSwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShbIHJlc3VsdCBdKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxpc3RlbmVyLmxpbmtEZWxldGVkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QobGlzdGVuZXIubGlua0RlbGV0ZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGFjY291bnQuaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2hhc0JlZW5SZWZyZXNoZWQoKSByZXR1cm5zIGZhbHNlIHdoZW4gYWNjb3VudCBoYXMgbm90IGJlZW4gcmVmcmVzaGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdCh0cmFja2VyLmhhc0JlZW5SZWZyZXNoZWQoYWNjb3VudCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzUmVmcmVzaGluZygpIHJldHVybnMgZmFsc2Ugd2hlbiBhY2NvdW50IGhhcyBub3QgYmVlbiByZWZyZXNoZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KHRyYWNrZXIuaXNSZWZyZXNoaW5nKGFjY291bnQpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpc0JlaW5nVHJhY2tlZCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGFjY291bnQgaGFzIG5vdCBiZWVuIHRyYWNrZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzQmVpbmdUcmFja2VkKGFjY291bnQpKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBhY2NvdW50IGlzIHJlZnJlc2hpbmcnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNrZXIuYWNjb3VudEJlaW5nUmVmcmVzaGVkKGFjY291bnQsIHByb21pc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QodHJhY2tlci5pc0JlaW5nVHJhY2tlZChhY2NvdW50KSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBhY2NvdW50IGlzIGRvbmUgcmVmcmVzaGluZycsICgpID0+IHtcclxuICAgICAgICAgICAgdHJhY2tlci5hY2NvdW50QmVpbmdSZWZyZXNoZWQoYWNjb3VudCwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoYWNjb3VudCk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cmFja2VyLmlzQmVpbmdUcmFja2VkKGFjY291bnQpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JlZ2lzdGVyUmVmcmVzaExpc3RlbmVyKCkgYWRkcyBhIGxpc3RlbmVyJywgKCkgPT4ge1xyXG4gICAgICAgIHRyYWNrZXIucmVnaXN0ZXJSZWZyZXNoTGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgICAgIGV4cGVjdCh0cmFja2VyLnJlZnJlc2hMaXN0ZW5lcnMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3VucmVnaXN0ZXJSZWZyZXNoTGlzdGVuZXIoKSByZW1vdmVzIGEgbGlzdGVuZXInLCAoKSA9PiB7XHJcbiAgICAgICAgdHJhY2tlci5yZWdpc3RlclJlZnJlc2hMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICAgICAgdHJhY2tlci51bnJlZ2lzdGVyUmVmcmVzaExpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgICAgICBleHBlY3QodHJhY2tlci5yZWZyZXNoTGlzdGVuZXJzLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
