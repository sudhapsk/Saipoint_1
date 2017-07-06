System.register(['test/js/TestInitializer', 'identity/IdentityModule', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * Tests for the NewPasswordStepHandler.
     */
    'use strict';

    var identityModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {
            describe('NewPasswordStepHandler', function () {

                var NewPasswordStepHandler = undefined,
                    testService = undefined,
                    $q = undefined,
                    handler = undefined,
                    managePasswordService = undefined,
                    promiseTrackerService = undefined,
                    policies = [],
                    selectionModel = {},
                    linkPasswordMap = [],
                    identityId = 'id1',
                    $rootScope = undefined,
                    linkId = 'link1',
                    managePasswordDataService = undefined;

                beforeEach(module(testModule, identityModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                /* jshint maxparams: 8 */
                beforeEach(inject(function (_NewPasswordStepHandler_, _testService_, _$q_, linkTestData, _managePasswordService_, _managePasswordDataService_, _promiseTrackerService_, _$rootScope_) {
                    NewPasswordStepHandler = _NewPasswordStepHandler_;
                    testService = _testService_;
                    $q = _$q_;
                    managePasswordService = _managePasswordService_;
                    managePasswordDataService = _managePasswordDataService_;
                    promiseTrackerService = _promiseTrackerService_;
                    linkPasswordMap[linkId] = 'somepassword';
                    $rootScope = _$rootScope_;
                    // Create the StepHandler to test with.
                    handler = new NewPasswordStepHandler(selectionModel, linkPasswordMap, identityId, policies, managePasswordService, managePasswordDataService, promiseTrackerService, $q);
                }));

                describe('constructor', function () {
                    it('initializes values correctly', function () {
                        expect(handler.identityId).toEqual(identityId);
                        expect(handler.selectionModel).toEqual(selectionModel);
                        expect(handler.linkPasswordMap[linkId]).toEqual(linkPasswordMap[linkId]);
                        expect(handler.policies).toEqual(policies);
                        expect(handler.newPassword).toEqual('');
                        expect(handler.confirmPassword).toEqual('');
                        expect(handler.showPassword).toBeFalsy();
                    });
                });

                describe('getInputType', function () {
                    it('return input type password when show password is set to false', function () {
                        expect(handler.getInputType()).toEqual('password');
                    });

                    it('return input type text when show password is set to true', function () {
                        handler.showPassword = true;
                        expect(handler.getInputType()).toEqual('text');
                    });
                });

                it('returns the get save button label', function () {
                    expect(handler.getSaveButtonLabel(true)).toEqual('ui_submit');
                });

                it('returns the step id', function () {
                    expect(handler.getStepId()).toEqual('newPasswordInput');
                });

                it('returns the title', function () {
                    expect(handler.getTitle()).toEqual('ui_manage_passwords_sync_submit');
                });

                describe('isSaveDisabled', function () {
                    it('disable save button when new password is missing', function () {
                        expect(handler.isSaveDisabled()).toBeTruthy();
                    });

                    it('disable save button when confirm password is missing', function () {
                        handler.newPassword = '123';
                        expect(handler.isSaveDisabled()).toBeTruthy();
                    });

                    it('disable save button when new password does not match with confirm password', function () {
                        handler.confirmPassword = 'abc';
                        expect(handler.isSaveDisabled()).toBeTruthy();
                    });

                    it('enable save button when new passowrd and confirm password matches', function () {
                        handler.confirmPassword = '123';
                        handler.newPassword = '123';
                        expect(handler.isSaveDisabled()).toBeFalsy();
                    });
                });

                it('calls synchronize password when click on save button', function () {
                    spyOn(managePasswordService, 'synchronizePassword').and.returnValue($q.when());
                    handler.submit();
                    // Run a digest cycle to resolve the promise.
                    $rootScope.$apply();
                    expect(managePasswordService.synchronizePassword).toHaveBeenCalled();
                });

                it('should dedup password constraint error messages', function () {
                    var errorMessage = 'error message';
                    spyOn(managePasswordService, 'synchronizePassword').and.returnValue($q.reject({
                        isConstraintsViolation: function () {
                            return true;
                        },
                        messages: [errorMessage, errorMessage]
                    }));
                    handler.submit();
                    // Run a digest cycle to resolve the promise.
                    $rootScope.$apply();
                    expect(handler.getPasswordPolicyErrors().length).toBe(1);
                    expect(handler.getPasswordPolicyErrors()[0]).toBe(errorMessage);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L05ld1Bhc3N3b3JkU3RlcEhhbmRsZXJUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHVCQUF1QixVQUFVLFNBQVM7Ozs7OztJQU03Rzs7SUFFQSxJQUFJLGdCQUFnQjtJQUNwQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZO1lBTjdCLFNBQVMsMEJBQTBCLFlBQVc7O2dCQUUxQyxJQUFJLHlCQUFzQjtvQkFBRSxjQUFXO29CQUFFLEtBQUU7b0JBQUUsVUFBTztvQkFBRSx3QkFBcUI7b0JBQUUsd0JBQXFCO29CQUM5RixXQUFXO29CQUFJLGlCQUFpQjtvQkFBSSxrQkFBa0I7b0JBQUksYUFBYTtvQkFBTyxhQUFVO29CQUN4RixTQUFTO29CQUFTLDRCQUF5Qjs7Z0JBRS9DLFdBQVcsT0FBTyxZQUFZOzs7Ozs7Z0JBTTlCLFdBQVcsT0FBTyxVQUFTLDBCQUEwQixlQUFlLE1BQU0sY0FBYyx5QkFDaEYsNkJBQTZCLHlCQUF5QixjQUFjO29CQUN4RSx5QkFBeUI7b0JBQ3pCLGNBQWM7b0JBQ2QsS0FBSztvQkFDTCx3QkFBd0I7b0JBQ3hCLDRCQUE0QjtvQkFDNUIsd0JBQXdCO29CQUN4QixnQkFBZ0IsVUFBVTtvQkFDMUIsYUFBYTs7b0JBRWIsVUFBVSxJQUFJLHVCQUF1QixnQkFBZ0IsaUJBQWlCLFlBQVksVUFDMUUsdUJBQXVCLDJCQUEyQix1QkFBdUI7OztnQkFHckYsU0FBUyxlQUFlLFlBQVc7b0JBQy9CLEdBQUcsZ0NBQWdDLFlBQVc7d0JBQzFDLE9BQU8sUUFBUSxZQUFZLFFBQVE7d0JBQ25DLE9BQU8sUUFBUSxnQkFBZ0IsUUFBUTt3QkFDdkMsT0FBTyxRQUFRLGdCQUFnQixTQUFTLFFBQVEsZ0JBQWdCO3dCQUNoRSxPQUFPLFFBQVEsVUFBVSxRQUFRO3dCQUNqQyxPQUFPLFFBQVEsYUFBYSxRQUFRO3dCQUNwQyxPQUFPLFFBQVEsaUJBQWlCLFFBQVE7d0JBQ3hDLE9BQU8sUUFBUSxjQUFjOzs7O2dCQUlyQyxTQUFTLGdCQUFnQixZQUFXO29CQUNoQyxHQUFHLGlFQUFpRSxZQUFXO3dCQUMzRSxPQUFPLFFBQVEsZ0JBQWdCLFFBQVE7OztvQkFHM0MsR0FBRyw0REFBNEQsWUFBVzt3QkFDdEUsUUFBUSxlQUFlO3dCQUN2QixPQUFPLFFBQVEsZ0JBQWdCLFFBQVE7Ozs7Z0JBSS9DLEdBQUcscUNBQXFDLFlBQVc7b0JBQy9DLE9BQU8sUUFBUSxtQkFBbUIsT0FBTyxRQUFROzs7Z0JBR3JELEdBQUcsdUJBQXVCLFlBQVc7b0JBQ2pDLE9BQU8sUUFBUSxhQUFhLFFBQVE7OztnQkFHeEMsR0FBRyxxQkFBcUIsWUFBVztvQkFDL0IsT0FBTyxRQUFRLFlBQVksUUFBUTs7O2dCQUd2QyxTQUFTLGtCQUFrQixZQUFXO29CQUNsQyxHQUFHLG9EQUFvRCxZQUFXO3dCQUM5RCxPQUFPLFFBQVEsa0JBQWtCOzs7b0JBR3JDLEdBQUcsd0RBQXdELFlBQVc7d0JBQ2xFLFFBQVEsY0FBYzt3QkFDdEIsT0FBTyxRQUFRLGtCQUFrQjs7O29CQUdyQyxHQUFHLDhFQUE4RSxZQUFXO3dCQUN4RixRQUFRLGtCQUFrQjt3QkFDMUIsT0FBTyxRQUFRLGtCQUFrQjs7O29CQUdyQyxHQUFHLHFFQUFxRSxZQUFXO3dCQUMvRSxRQUFRLGtCQUFrQjt3QkFDMUIsUUFBUSxjQUFjO3dCQUN0QixPQUFPLFFBQVEsa0JBQWtCOzs7O2dCQUl6QyxHQUFHLHdEQUF3RCxZQUFXO29CQUNsRSxNQUFNLHVCQUF1Qix1QkFBdUIsSUFBSSxZQUFZLEdBQUc7b0JBQ3ZFLFFBQVE7O29CQUVSLFdBQVc7b0JBQ1gsT0FBTyxzQkFBc0IscUJBQXFCOzs7Z0JBR3RELEdBQUcsbURBQW1ELFlBQVc7b0JBQzdELElBQUksZUFBZTtvQkFDbkIsTUFBTSx1QkFBdUIsdUJBQXVCLElBQUksWUFBWSxHQUFHLE9BQU87d0JBQzFFLHdCQUF3QixZQUFBOzRCQWdCUixPQWhCYzs7d0JBQzlCLFVBQVUsQ0FBQyxjQUFjOztvQkFFN0IsUUFBUTs7b0JBRVIsV0FBVztvQkFDWCxPQUFPLFFBQVEsMEJBQTBCLFFBQVEsS0FBSztvQkFDdEQsT0FBTyxRQUFRLDBCQUEwQixJQUFJLEtBQUs7Ozs7O0dBc0J2RCIsImZpbGUiOiJpZGVudGl0eS9OZXdQYXNzd29yZFN0ZXBIYW5kbGVyVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcblxuLyoqXG4gKiBUZXN0cyBmb3IgdGhlIE5ld1Bhc3N3b3JkU3RlcEhhbmRsZXIuXG4gKi9cbmRlc2NyaWJlKCdOZXdQYXNzd29yZFN0ZXBIYW5kbGVyJywgZnVuY3Rpb24oKSB7XG5cbiAgICBsZXQgTmV3UGFzc3dvcmRTdGVwSGFuZGxlciwgdGVzdFNlcnZpY2UsICRxLCBoYW5kbGVyLCBtYW5hZ2VQYXNzd29yZFNlcnZpY2UsIHByb21pc2VUcmFja2VyU2VydmljZSxcbiAgICAgICAgcG9saWNpZXMgPSBbXSwgc2VsZWN0aW9uTW9kZWwgPSB7fSwgbGlua1Bhc3N3b3JkTWFwID0gW10sIGlkZW50aXR5SWQgPSAnaWQxJywgJHJvb3RTY29wZSxcbiAgICAgICAgbGlua0lkID0gJ2xpbmsxJywgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUsIGlkZW50aXR5TW9kdWxlKSk7XG5cbiAgICAvKipcbiAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXG4gICAgICovXG4gICAgLyoganNoaW50IG1heHBhcmFtczogOCAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9OZXdQYXNzd29yZFN0ZXBIYW5kbGVyXywgX3Rlc3RTZXJ2aWNlXywgXyRxXywgbGlua1Rlc3REYXRhLCBfbWFuYWdlUGFzc3dvcmRTZXJ2aWNlXyxcbiAgICAgICAgICAgIF9tYW5hZ2VQYXNzd29yZERhdGFTZXJ2aWNlXywgX3Byb21pc2VUcmFja2VyU2VydmljZV8sIF8kcm9vdFNjb3BlXykge1xuICAgICAgICBOZXdQYXNzd29yZFN0ZXBIYW5kbGVyID0gX05ld1Bhc3N3b3JkU3RlcEhhbmRsZXJfO1xuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgbWFuYWdlUGFzc3dvcmRTZXJ2aWNlID0gX21hbmFnZVBhc3N3b3JkU2VydmljZV87XG4gICAgICAgIG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UgPSBfbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZV87XG4gICAgICAgIHByb21pc2VUcmFja2VyU2VydmljZSA9IF9wcm9taXNlVHJhY2tlclNlcnZpY2VfO1xuICAgICAgICBsaW5rUGFzc3dvcmRNYXBbbGlua0lkXSA9ICdzb21lcGFzc3dvcmQnO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIFN0ZXBIYW5kbGVyIHRvIHRlc3Qgd2l0aC5cbiAgICAgICAgaGFuZGxlciA9IG5ldyBOZXdQYXNzd29yZFN0ZXBIYW5kbGVyKHNlbGVjdGlvbk1vZGVsLCBsaW5rUGFzc3dvcmRNYXAsIGlkZW50aXR5SWQsIHBvbGljaWVzLFxuICAgICAgICAgICAgICAgIG1hbmFnZVBhc3N3b3JkU2VydmljZSwgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZSwgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlLCAkcSk7XG4gICAgfSkpO1xuXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdpbml0aWFsaXplcyB2YWx1ZXMgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5pZGVudGl0eUlkKS50b0VxdWFsKGlkZW50aXR5SWQpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuc2VsZWN0aW9uTW9kZWwpLnRvRXF1YWwoc2VsZWN0aW9uTW9kZWwpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIubGlua1Bhc3N3b3JkTWFwW2xpbmtJZF0pLnRvRXF1YWwobGlua1Bhc3N3b3JkTWFwW2xpbmtJZF0pO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIucG9saWNpZXMpLnRvRXF1YWwocG9saWNpZXMpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIubmV3UGFzc3dvcmQpLnRvRXF1YWwoJycpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuY29uZmlybVBhc3N3b3JkKS50b0VxdWFsKCcnKTtcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLnNob3dQYXNzd29yZCkudG9CZUZhbHN5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldElucHV0VHlwZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgncmV0dXJuIGlucHV0IHR5cGUgcGFzc3dvcmQgd2hlbiBzaG93IHBhc3N3b3JkIGlzIHNldCB0byBmYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuZ2V0SW5wdXRUeXBlKCkpLnRvRXF1YWwoJ3Bhc3N3b3JkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm4gaW5wdXQgdHlwZSB0ZXh0IHdoZW4gc2hvdyBwYXNzd29yZCBpcyBzZXQgdG8gdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlci5zaG93UGFzc3dvcmQgPSB0cnVlO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuZ2V0SW5wdXRUeXBlKCkpLnRvRXF1YWwoJ3RleHQnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgZ2V0IHNhdmUgYnV0dG9uIGxhYmVsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmdldFNhdmVCdXR0b25MYWJlbCh0cnVlKSkudG9FcXVhbCgndWlfc3VibWl0Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgc3RlcCBpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoaGFuZGxlci5nZXRTdGVwSWQoKSkudG9FcXVhbCgnbmV3UGFzc3dvcmRJbnB1dCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgdGhlIHRpdGxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmdldFRpdGxlKCkpLnRvRXF1YWwoJ3VpX21hbmFnZV9wYXNzd29yZHNfc3luY19zdWJtaXQnKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc1NhdmVEaXNhYmxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnZGlzYWJsZSBzYXZlIGJ1dHRvbiB3aGVuIG5ldyBwYXNzd29yZCBpcyBtaXNzaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5pc1NhdmVEaXNhYmxlZCgpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNhYmxlIHNhdmUgYnV0dG9uIHdoZW4gY29uZmlybSBwYXNzd29yZCBpcyBtaXNzaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVyLm5ld1Bhc3N3b3JkID0gJzEyMyc7XG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci5pc1NhdmVEaXNhYmxlZCgpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNhYmxlIHNhdmUgYnV0dG9uIHdoZW4gbmV3IHBhc3N3b3JkIGRvZXMgbm90IG1hdGNoIHdpdGggY29uZmlybSBwYXNzd29yZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlci5jb25maXJtUGFzc3dvcmQgPSAnYWJjJztcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLmlzU2F2ZURpc2FibGVkKCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2VuYWJsZSBzYXZlIGJ1dHRvbiB3aGVuIG5ldyBwYXNzb3dyZCBhbmQgY29uZmlybSBwYXNzd29yZCBtYXRjaGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmNvbmZpcm1QYXNzd29yZCA9ICcxMjMnO1xuICAgICAgICAgICAgaGFuZGxlci5uZXdQYXNzd29yZCA9ICcxMjMnO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIuaXNTYXZlRGlzYWJsZWQoKSkudG9CZUZhbHN5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbGxzIHN5bmNocm9uaXplIHBhc3N3b3JkIHdoZW4gY2xpY2sgb24gc2F2ZSBidXR0b24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnc3luY2hyb25pemVQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xuICAgICAgICBoYW5kbGVyLnN1Ym1pdCgpO1xuICAgICAgICAvLyBSdW4gYSBkaWdlc3QgY3ljbGUgdG8gcmVzb2x2ZSB0aGUgcHJvbWlzZS5cbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KG1hbmFnZVBhc3N3b3JkU2VydmljZS5zeW5jaHJvbml6ZVBhc3N3b3JkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRlZHVwIHBhc3N3b3JkIGNvbnN0cmFpbnQgZXJyb3IgbWVzc2FnZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9ICdlcnJvciBtZXNzYWdlJztcbiAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnc3luY2hyb25pemVQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZSgkcS5yZWplY3Qoe1xuICAgICAgICAgICAgaXNDb25zdHJhaW50c1Zpb2xhdGlvbjogKCkgPT4gdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbZXJyb3JNZXNzYWdlLCBlcnJvck1lc3NhZ2VdXG4gICAgICAgIH0pKTtcbiAgICAgICAgaGFuZGxlci5zdWJtaXQoKTtcbiAgICAgICAgLy8gUnVuIGEgZGlnZXN0IGN5Y2xlIHRvIHJlc29sdmUgdGhlIHByb21pc2UuXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmdldFBhc3N3b3JkUG9saWN5RXJyb3JzKCkubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoaGFuZGxlci5nZXRQYXNzd29yZFBvbGljeUVycm9ycygpWzBdKS50b0JlKGVycm9yTWVzc2FnZSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
