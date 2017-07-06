System.register(['test/js/TestInitializer', 'approval/ApprovalModule', 'test/js/TestModule'], function (_export) {
    'use strict';

    var approvalModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('CompletionDialogCtrl', function () {

                var esigAuthFailure = 'Type in a better password you TURKEY!',
                    $rootScope,
                    testService,
                    scope,
                    approval,
                    decide,
                    revert,
                    callback,
                    approvalService,
                    authnInfoService,
                    electronicSignatureService;

                // Load the test module to get the testService.
                beforeEach(module(testModule));

                // Use the approval module.
                beforeEach(module(approvalModule));

                /**
                 * Inject our dependencies and setup the mocks and controller before each
                 * test.
                 */
                beforeEach(inject(function (_$rootScope_, $controller, _testService_, _authnInfoService_) {

                    $rootScope = _$rootScope_;
                    testService = _testService_;
                    authnInfoService = _authnInfoService_;

                    // Create mock dependencies.
                    scope = $rootScope.$new();
                    decide = testService.createPromiseSpy(false);
                    revert = testService.createPromiseSpy(false);
                    callback = jasmine.createSpy('callback');

                    approvalService = {
                        complete: testService.createPromiseSpy(false),
                        sign: testService.createPromiseSpy(false)
                    };

                    electronicSignatureService = {
                        checkSignature: testService.createPromiseSpy(false, {
                            success: true
                        })
                    };

                    approval = {
                        id: '1234'
                    };

                    // Create the controller with our mocks.
                    $controller('CompletionDialogCtrl', {
                        $scope: scope,
                        approvalService: approvalService,
                        electronicSignatureService: electronicSignatureService,
                        authnInfoService: authnInfoService,
                        approval: approval,
                        decide: decide,
                        revert: revert,
                        errorCallback: callback
                    });
                }));

                it('calls decide() when completing', function () {
                    scope.complete();
                    $rootScope.$apply();
                    expect(decide).toHaveBeenCalled();
                });

                it('completes the approval when completing', function () {
                    scope.complete();
                    $rootScope.$apply();
                    expect(approvalService.complete).toHaveBeenCalled();
                });

                it('does not complete when decision fails', function () {
                    decide.makeReject(true);
                    scope.complete();
                    $rootScope.$apply();
                    expect(approvalService.complete).not.toHaveBeenCalled();
                });

                it('calls revert() when decision fails', function () {
                    decide.makeReject(true);
                    scope.complete();
                    $rootScope.$apply();
                    expect(revert).toHaveBeenCalled();
                });

                it('the complete promise resolves on complete', function () {
                    var promise = scope.complete(),
                        completeSpy = jasmine.createSpy();
                    promise.then(completeSpy);
                    $rootScope.$apply();
                    expect(completeSpy).toHaveBeenCalled();
                });

                it('calls callback on 404', function () {
                    var msg = 'shut er down clancy ... shes pumping mud!',
                        result;
                    approvalService.complete.makeReject(true);
                    approvalService.complete.setRejectData({ status: 404, data: { message: msg } });
                    scope.complete();
                    $rootScope.$apply();
                    expect(callback).toHaveBeenCalled();

                    result = callback.calls.mostRecent().args[0];
                    expect(result.isSuccess()).toEqual(false);
                    expect(result.messages.length).toEqual(1);
                    expect(result.messages[0].messageOrKey).toEqual(msg);
                });

                describe('esig', function () {

                    var username = 'jimmy',
                        password = 'smitz';

                    beforeEach(function () {
                        // Add an esig meaning to the approval to make the controller treat
                        // this as an esig.
                        approval.esigMeaning = 'Can you dig it?';
                    });

                    it('calls sign() when completing', function () {
                        var args;

                        // Set a username/password on the scope.
                        scope.credentials = {
                            username: username,
                            password: password
                        };

                        scope.complete();
                        $rootScope.$apply();

                        expect(approvalService.sign).toHaveBeenCalled();
                        args = approvalService.sign.calls.mostRecent().args;
                        expect(args[0]).toEqual(approval.id);
                        expect(args[1]).toEqual(password);
                        expect(args[2]).toEqual(username);
                    });

                    it('does not completes when form is invalid', function () {

                        // set invalid form on scope
                        scope.ui = {
                            form: {
                                $invalid: true
                            }
                        };
                        // Set a username/password on the scope.
                        scope.credentials = {
                            username: username,
                            password: password
                        };

                        scope.complete();
                        $rootScope.$apply();

                        expect(approvalService.sign).not.toHaveBeenCalled();
                    });

                    it('completes when enter is pressed', function () {
                        // Mock a keypress event.
                        var $event = {
                            keyCode: 13
                        };

                        // Set a username/password on the scope.
                        scope.credentials = {
                            username: username,
                            password: password
                        };
                        scope.$close = jasmine.createSpy();

                        scope.handleKeyPress($event);
                        $rootScope.$apply();

                        expect(approvalService.sign).toHaveBeenCalled();
                        // Expect the modal to close on enter
                        expect(scope.$close).toHaveBeenCalled();
                    });

                    it('does not complete when a non-enter key is pressed', function () {
                        // Mock a keypress event.
                        var $event = {
                            keyCode: 39
                        };

                        // Set a username/password on the scope.
                        scope.credentials = {
                            username: username,
                            password: password
                        };

                        scope.handleKeyPress($event);
                        $rootScope.$apply();

                        expect(approvalService.sign).not.toHaveBeenCalled();
                    });

                    it('requires a username if authnInfoService has a null one', function () {
                        spyOn(authnInfoService, 'getAuthId').and.returnValue(null);
                        expect(scope.isUsernameRequired()).toEqual(true);
                    });

                    it('requires a username if authnInfoService has an empty one', function () {
                        spyOn(authnInfoService, 'getAuthId').and.returnValue('');
                        expect(scope.isUsernameRequired()).toEqual(true);
                    });

                    it('does not show an error message for a valid field', function () {
                        var field = {
                            $invalid: false,
                            $dirty: true
                        };
                        expect(scope.showErrorMsg(field)).toEqual(false);
                    });

                    it('does not show an error message for an invalid clean field', function () {
                        var field = {
                            $invalid: true,
                            $dirty: false
                        };
                        expect(scope.showErrorMsg(field)).toEqual(false);
                    });

                    it('shows an error message for an invalid dirty field', function () {
                        var field = {
                            $invalid: true,
                            $dirty: true
                        };
                        expect(scope.showErrorMsg(field)).toEqual(true);
                    });

                    it('shows an error message for an invalid clean field once form is submitted', function () {
                        var field = {
                            $invalid: true,
                            $dirty: false
                        };
                        // Should not show an error yet.
                        expect(scope.showErrorMsg(field)).toEqual(false);

                        // Complete it.
                        scope.complete();
                        $rootScope.$apply();

                        // Now it should show an error.
                        expect(scope.showErrorMsg(field)).toEqual(true);
                    });

                    it('passes a null username when originalAuthId is set', function () {
                        var args;

                        // Set an original auth ID.
                        authnInfoService.setOriginalAuthId(username);

                        // Set a username/password on the scope.
                        scope.credentials = {
                            username: username,
                            password: password
                        };

                        scope.complete();
                        $rootScope.$apply();

                        expect(approvalService.sign).toHaveBeenCalled();
                        args = approvalService.sign.calls.mostRecent().args;
                        expect(args[0]).toEqual(approval.id);
                        expect(args[1]).toEqual(password);
                        expect(args[2]).toEqual(null);
                    });

                    it('saves originalAuthId after signing when it starts as undefined', function () {
                        // Set a username/password on the scope.
                        scope.credentials = {
                            username: username,
                            password: password
                        };

                        // It should start as null.
                        expect(authnInfoService.getOriginalAuthId()).toEqual(undefined);

                        scope.complete();
                        $rootScope.$apply();

                        // It should be set after signing.
                        expect(authnInfoService.getOriginalAuthId()).toEqual(username);

                        // Should not require a username now.
                        expect(scope.isUsernameRequired()).toEqual(false);
                    });

                    it('sets esig error message when esig authn fails', function () {
                        var completeResult,
                            completeSpy = jasmine.createSpy();
                        electronicSignatureService.checkSignature.setResolveData({
                            success: false,
                            message: esigAuthFailure
                        });

                        // Call complete and ensure that the starting status is correct.
                        scope.complete();
                        expect(scope.completing).toEqual(true);
                        expect(scope.esigError).toEqual(null);

                        // Resolve the complete promise and check that the error is stored
                        // in the controller and that "completing" has been reset.
                        $rootScope.$apply();
                        expect(electronicSignatureService.checkSignature).toHaveBeenCalled();
                        expect(approvalService.sign).not.toHaveBeenCalled();
                        expect(scope.completing).toEqual(false);
                        expect(scope.esigError).toEqual(esigAuthFailure);

                        // Call again to make sure that the error message and completing
                        // flags get reset when trying again.
                        scope.complete();
                        expect(scope.completing).toEqual(true);
                        expect(scope.esigError).toEqual(null);
                        $rootScope.$apply();

                        // Finally ... make the service return true.  Verify that the
                        // modal is closed.
                        electronicSignatureService.checkSignature.setResolveData({
                            success: true
                        });
                        completeResult = scope.complete();
                        completeResult.then(completeSpy);
                        $rootScope.$apply();
                        expect(completeSpy).toHaveBeenCalled();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0NvbXBsZXRpb25EaWFsb2dDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQix1QkFBdUIsVUFBVSxTQUFTO0lBQzdHOztJQUVBLElBQUksZ0JBQWdCO0lBQ3BCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7O1lBTjdCLFNBQVMsd0JBQXdCLFlBQVc7O2dCQUV4QyxJQUFJLGtCQUFrQjtvQkFDbEI7b0JBQVk7b0JBQWE7b0JBQU87b0JBQVU7b0JBQVE7b0JBQVE7b0JBQzFEO29CQUFpQjtvQkFBa0I7OztnQkFHdkMsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTzs7Ozs7O2dCQU1sQixXQUFXLE9BQU8sVUFBUyxjQUFjLGFBQWEsZUFBZSxvQkFBb0I7O29CQUVyRixhQUFhO29CQUNiLGNBQWM7b0JBQ2QsbUJBQW1COzs7b0JBR25CLFFBQVEsV0FBVztvQkFDbkIsU0FBUyxZQUFZLGlCQUFpQjtvQkFDdEMsU0FBUyxZQUFZLGlCQUFpQjtvQkFDdEMsV0FBVyxRQUFRLFVBQVU7O29CQUU3QixrQkFBa0I7d0JBQ2QsVUFBVSxZQUFZLGlCQUFpQjt3QkFDdkMsTUFBTSxZQUFZLGlCQUFpQjs7O29CQUd2Qyw2QkFBNkI7d0JBQ3pCLGdCQUFnQixZQUFZLGlCQUFpQixPQUFPOzRCQUNoRCxTQUFTOzs7O29CQUlqQixXQUFXO3dCQUNQLElBQUk7Ozs7b0JBSVIsWUFBWSx3QkFBd0I7d0JBQ2hDLFFBQVE7d0JBQ1IsaUJBQWlCO3dCQUNqQiw0QkFBNEI7d0JBQzVCLGtCQUFrQjt3QkFDbEIsVUFBVTt3QkFDVixRQUFRO3dCQUNSLFFBQVE7d0JBQ1IsZUFBZTs7OztnQkFLdkIsR0FBRyxrQ0FBa0Ms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LGVBQWU7NEJBQ3JELFNBQVM7NEJBQ1QsU0FBUzs7Ozt3QkFJYixNQUFNO3dCQUNOLE9BQU8sTUFBTSxZQUFZLFFBQVE7d0JBQ2pDLE9BQU8sTUFBTSxXQUFXLFFBQVE7Ozs7d0JBSWhDLFdBQVc7d0JBQ1gsT0FBTywyQkFBMkIsZ0JBQWdCO3dCQUNsRCxPQUFPLGdCQUFnQixNQUFNLElBQUk7d0JBQ2pDLE9BQU8sTUFBTSxZQUFZLFFBQVE7d0JBQ2pDLE9BQU8sTUFBTSxXQUFXLFFBQVE7Ozs7d0JBSWhDLE1BQU07d0JBQ04sT0FBTyxNQUFNLFlBQVksUUFBUTt3QkFDakMsT0FBTyxNQUFNLFdBQVcsUUFBUTt3QkFDaEMsV0FBVzs7Ozt3QkFJWCwyQkFBMkIsZUFBZSxlQUFlOzRCQUNyRCxTQUFTOzt3QkFFYixpQkFBaUIsTUFBTTt3QkFDdkIsZUFBZSxLQUFLO3dCQUNwQixXQUFXO3dCQUNYLE9BQU8sYUFBYTs7Ozs7O0dBcUI3QiIsImZpbGUiOiJhcHByb3ZhbC9Db21wbGV0aW9uRGlhbG9nQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBhcHByb3ZhbE1vZHVsZSBmcm9tICdhcHByb3ZhbC9BcHByb3ZhbE1vZHVsZSc7XHJcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XHJcblxyXG5kZXNjcmliZSgnQ29tcGxldGlvbkRpYWxvZ0N0cmwnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgZXNpZ0F1dGhGYWlsdXJlID0gJ1R5cGUgaW4gYSBiZXR0ZXIgcGFzc3dvcmQgeW91IFRVUktFWSEnLFxyXG4gICAgICAgICRyb290U2NvcGUsIHRlc3RTZXJ2aWNlLCBzY29wZSwgYXBwcm92YWwsIGRlY2lkZSwgcmV2ZXJ0LCBjYWxsYmFjayxcclxuICAgICAgICBhcHByb3ZhbFNlcnZpY2UsIGF1dGhuSW5mb1NlcnZpY2UsIGVsZWN0cm9uaWNTaWduYXR1cmVTZXJ2aWNlO1xyXG5cclxuICAgIC8vIExvYWQgdGhlIHRlc3QgbW9kdWxlIHRvIGdldCB0aGUgdGVzdFNlcnZpY2UuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlKSk7XHJcblxyXG4gICAgLy8gVXNlIHRoZSBhcHByb3ZhbCBtb2R1bGUuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhcHByb3ZhbE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5qZWN0IG91ciBkZXBlbmRlbmNpZXMgYW5kIHNldHVwIHRoZSBtb2NrcyBhbmQgY29udHJvbGxlciBiZWZvcmUgZWFjaFxyXG4gICAgICogdGVzdC5cclxuICAgICAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRyb290U2NvcGVfLCAkY29udHJvbGxlciwgX3Rlc3RTZXJ2aWNlXywgX2F1dGhuSW5mb1NlcnZpY2VfKSB7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xyXG4gICAgICAgIGF1dGhuSW5mb1NlcnZpY2UgPSBfYXV0aG5JbmZvU2VydmljZV87XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBtb2NrIGRlcGVuZGVuY2llcy5cclxuICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIGRlY2lkZSA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UpO1xyXG4gICAgICAgIHJldmVydCA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UpO1xyXG4gICAgICAgIGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XHJcblxyXG4gICAgICAgIGFwcHJvdmFsU2VydmljZSA9IHtcclxuICAgICAgICAgICAgY29tcGxldGU6IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UpLFxyXG4gICAgICAgICAgICBzaWduOiB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGVsZWN0cm9uaWNTaWduYXR1cmVTZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBjaGVja1NpZ25hdHVyZTogdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZVNweShmYWxzZSwge1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFwcHJvdmFsID0ge1xyXG4gICAgICAgICAgICBpZDogJzEyMzQnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb250cm9sbGVyIHdpdGggb3VyIG1vY2tzLlxyXG4gICAgICAgICRjb250cm9sbGVyKCdDb21wbGV0aW9uRGlhbG9nQ3RybCcsIHtcclxuICAgICAgICAgICAgJHNjb3BlOiBzY29wZSxcclxuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlOiBhcHByb3ZhbFNlcnZpY2UsXHJcbiAgICAgICAgICAgIGVsZWN0cm9uaWNTaWduYXR1cmVTZXJ2aWNlOiBlbGVjdHJvbmljU2lnbmF0dXJlU2VydmljZSxcclxuICAgICAgICAgICAgYXV0aG5JbmZvU2VydmljZTogYXV0aG5JbmZvU2VydmljZSxcclxuICAgICAgICAgICAgYXBwcm92YWw6IGFwcHJvdmFsLFxyXG4gICAgICAgICAgICBkZWNpZGU6IGRlY2lkZSxcclxuICAgICAgICAgICAgcmV2ZXJ0OiByZXZlcnQsXHJcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG5cclxuICAgIGl0KCdjYWxscyBkZWNpZGUoKSB3aGVuIGNvbXBsZXRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzY29wZS5jb21wbGV0ZSgpO1xyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGRlY2lkZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2NvbXBsZXRlcyB0aGUgYXBwcm92YWwgd2hlbiBjb21wbGV0aW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2NvcGUuY29tcGxldGUoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2UuY29tcGxldGUpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdkb2VzIG5vdCBjb21wbGV0ZSB3aGVuIGRlY2lzaW9uIGZhaWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGVjaWRlLm1ha2VSZWplY3QodHJ1ZSk7XHJcbiAgICAgICAgc2NvcGUuY29tcGxldGUoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2UuY29tcGxldGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnY2FsbHMgcmV2ZXJ0KCkgd2hlbiBkZWNpc2lvbiBmYWlscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRlY2lkZS5tYWtlUmVqZWN0KHRydWUpO1xyXG4gICAgICAgIHNjb3BlLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QocmV2ZXJ0KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndGhlIGNvbXBsZXRlIHByb21pc2UgcmVzb2x2ZXMgb24gY29tcGxldGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcHJvbWlzZSA9IHNjb3BlLmNvbXBsZXRlKCksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4oY29tcGxldGVTcHkpO1xyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbXBsZXRlU3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnY2FsbHMgY2FsbGJhY2sgb24gNDA0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1zZyA9ICdzaHV0IGVyIGRvd24gY2xhbmN5IC4uLiBzaGVzIHB1bXBpbmcgbXVkIScsXHJcbiAgICAgICAgICAgIHJlc3VsdDtcclxuICAgICAgICBhcHByb3ZhbFNlcnZpY2UuY29tcGxldGUubWFrZVJlamVjdCh0cnVlKTtcclxuICAgICAgICBhcHByb3ZhbFNlcnZpY2UuY29tcGxldGUuc2V0UmVqZWN0RGF0YSh7c3RhdHVzOiA0MDQsIGRhdGE6IHsgbWVzc2FnZTogbXNnIH19KTtcclxuICAgICAgICBzY29wZS5jb21wbGV0ZSgpO1xyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdO1xyXG4gICAgICAgIGV4cGVjdChyZXN1bHQuaXNTdWNjZXNzKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChyZXN1bHQubWVzc2FnZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIGV4cGVjdChyZXN1bHQubWVzc2FnZXNbMF0ubWVzc2FnZU9yS2V5KS50b0VxdWFsKG1zZyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZXNpZycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgdXNlcm5hbWUgPSAnamltbXknLFxyXG4gICAgICAgICAgICBwYXNzd29yZCA9ICdzbWl0eic7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCBhbiBlc2lnIG1lYW5pbmcgdG8gdGhlIGFwcHJvdmFsIHRvIG1ha2UgdGhlIGNvbnRyb2xsZXIgdHJlYXRcclxuICAgICAgICAgICAgLy8gdGhpcyBhcyBhbiBlc2lnLlxyXG4gICAgICAgICAgICBhcHByb3ZhbC5lc2lnTWVhbmluZyA9ICdDYW4geW91IGRpZyBpdD8nO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCAoJ2NhbGxzIHNpZ24oKSB3aGVuIGNvbXBsZXRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3M7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYSB1c2VybmFtZS9wYXNzd29yZCBvbiB0aGUgc2NvcGUuXHJcbiAgICAgICAgICAgIHNjb3BlLmNyZWRlbnRpYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzY29wZS5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsU2VydmljZS5zaWduKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGFyZ3MgPSBhcHByb3ZhbFNlcnZpY2Uuc2lnbi5jYWxscy5tb3N0UmVjZW50KCkuYXJncztcclxuICAgICAgICAgICAgZXhwZWN0KGFyZ3NbMF0pLnRvRXF1YWwoYXBwcm92YWwuaWQpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJnc1sxXSkudG9FcXVhbChwYXNzd29yZCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhcmdzWzJdKS50b0VxdWFsKHVzZXJuYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGNvbXBsZXRlcyB3aGVuIGZvcm0gaXMgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgLy8gc2V0IGludmFsaWQgZm9ybSBvbiBzY29wZVxyXG4gICAgICAgICAgICBzY29wZS51aSA9IHtcclxuICAgICAgICAgICAgICAgIGZvcm06IHtcclxuICAgICAgICAgICAgICAgICAgICAkaW52YWxpZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBTZXQgYSB1c2VybmFtZS9wYXNzd29yZCBvbiB0aGUgc2NvcGUuXHJcbiAgICAgICAgICAgIHNjb3BlLmNyZWRlbnRpYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzY29wZS5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsU2VydmljZS5zaWduKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY29tcGxldGVzIHdoZW4gZW50ZXIgaXMgcHJlc3NlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBNb2NrIGEga2V5cHJlc3MgZXZlbnQuXHJcbiAgICAgICAgICAgIHZhciAkZXZlbnQgPSB7XHJcbiAgICAgICAgICAgICAgICBrZXlDb2RlOiAxM1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGEgdXNlcm5hbWUvcGFzc3dvcmQgb24gdGhlIHNjb3BlLlxyXG4gICAgICAgICAgICBzY29wZS5jcmVkZW50aWFscyA9IHtcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzY29wZS4kY2xvc2UgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuaGFuZGxlS2V5UHJlc3MoJGV2ZW50KTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2Uuc2lnbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICAvLyBFeHBlY3QgdGhlIG1vZGFsIHRvIGNsb3NlIG9uIGVudGVyXHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS4kY2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGNvbXBsZXRlIHdoZW4gYSBub24tZW50ZXIga2V5IGlzIHByZXNzZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gTW9jayBhIGtleXByZXNzIGV2ZW50LlxyXG4gICAgICAgICAgICB2YXIgJGV2ZW50ID0ge1xyXG4gICAgICAgICAgICAgICAga2V5Q29kZTogMzlcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBhIHVzZXJuYW1lL3Bhc3N3b3JkIG9uIHRoZSBzY29wZS5cclxuICAgICAgICAgICAgc2NvcGUuY3JlZGVudGlhbHMgPSB7XHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLmhhbmRsZUtleVByZXNzKCRldmVudCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoYXBwcm92YWxTZXJ2aWNlLnNpZ24pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXF1aXJlcyBhIHVzZXJuYW1lIGlmIGF1dGhuSW5mb1NlcnZpY2UgaGFzIGEgbnVsbCBvbmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYXV0aG5JbmZvU2VydmljZSwgJ2dldEF1dGhJZCcpLmFuZC5yZXR1cm5WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmlzVXNlcm5hbWVSZXF1aXJlZCgpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmVxdWlyZXMgYSB1c2VybmFtZSBpZiBhdXRobkluZm9TZXJ2aWNlIGhhcyBhbiBlbXB0eSBvbmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5T24oYXV0aG5JbmZvU2VydmljZSwgJ2dldEF1dGhJZCcpLmFuZC5yZXR1cm5WYWx1ZSgnJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5pc1VzZXJuYW1lUmVxdWlyZWQoKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IHNob3cgYW4gZXJyb3IgbWVzc2FnZSBmb3IgYSB2YWxpZCBmaWVsZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZmllbGQgPSB7XHJcbiAgICAgICAgICAgICAgICAkaW52YWxpZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAkZGlydHk6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNob3dFcnJvck1zZyhmaWVsZCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3Qgc2hvdyBhbiBlcnJvciBtZXNzYWdlIGZvciBhbiBpbnZhbGlkIGNsZWFuIGZpZWxkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHtcclxuICAgICAgICAgICAgICAgICRpbnZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJGRpcnR5OiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuc2hvd0Vycm9yTXNnKGZpZWxkKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyBhbiBlcnJvciBtZXNzYWdlIGZvciBhbiBpbnZhbGlkIGRpcnR5IGZpZWxkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHtcclxuICAgICAgICAgICAgICAgICRpbnZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJGRpcnR5OiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5zaG93RXJyb3JNc2coZmllbGQpKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgYW4gZXJyb3IgbWVzc2FnZSBmb3IgYW4gaW52YWxpZCBjbGVhbiBmaWVsZCBvbmNlIGZvcm0gaXMgc3VibWl0dGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHtcclxuICAgICAgICAgICAgICAgICRpbnZhbGlkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgJGRpcnR5OiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBTaG91bGQgbm90IHNob3cgYW4gZXJyb3IgeWV0LlxyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuc2hvd0Vycm9yTXNnKGZpZWxkKSkudG9FcXVhbChmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb21wbGV0ZSBpdC5cclxuICAgICAgICAgICAgc2NvcGUuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5vdyBpdCBzaG91bGQgc2hvdyBhbiBlcnJvci5cclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnNob3dFcnJvck1zZyhmaWVsZCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdwYXNzZXMgYSBudWxsIHVzZXJuYW1lIHdoZW4gb3JpZ2luYWxBdXRoSWQgaXMgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFuIG9yaWdpbmFsIGF1dGggSUQuXHJcbiAgICAgICAgICAgIGF1dGhuSW5mb1NlcnZpY2Uuc2V0T3JpZ2luYWxBdXRoSWQodXNlcm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGEgdXNlcm5hbWUvcGFzc3dvcmQgb24gdGhlIHNjb3BlLlxyXG4gICAgICAgICAgICBzY29wZS5jcmVkZW50aWFscyA9IHtcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2Uuc2lnbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBhcmdzID0gYXBwcm92YWxTZXJ2aWNlLnNpZ24uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XHJcbiAgICAgICAgICAgIGV4cGVjdChhcmdzWzBdKS50b0VxdWFsKGFwcHJvdmFsLmlkKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFyZ3NbMV0pLnRvRXF1YWwocGFzc3dvcmQpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJnc1syXSkudG9FcXVhbChudWxsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQgKCdzYXZlcyBvcmlnaW5hbEF1dGhJZCBhZnRlciBzaWduaW5nIHdoZW4gaXQgc3RhcnRzIGFzIHVuZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBTZXQgYSB1c2VybmFtZS9wYXNzd29yZCBvbiB0aGUgc2NvcGUuXHJcbiAgICAgICAgICAgIHNjb3BlLmNyZWRlbnRpYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBJdCBzaG91bGQgc3RhcnQgYXMgbnVsbC5cclxuICAgICAgICAgICAgZXhwZWN0KGF1dGhuSW5mb1NlcnZpY2UuZ2V0T3JpZ2luYWxBdXRoSWQoKSkudG9FcXVhbCh1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEl0IHNob3VsZCBiZSBzZXQgYWZ0ZXIgc2lnbmluZy5cclxuICAgICAgICAgICAgZXhwZWN0KGF1dGhuSW5mb1NlcnZpY2UuZ2V0T3JpZ2luYWxBdXRoSWQoKSkudG9FcXVhbCh1c2VybmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTaG91bGQgbm90IHJlcXVpcmUgYSB1c2VybmFtZSBub3cuXHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5pc1VzZXJuYW1lUmVxdWlyZWQoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ICgnc2V0cyBlc2lnIGVycm9yIG1lc3NhZ2Ugd2hlbiBlc2lnIGF1dGhuIGZhaWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21wbGV0ZVJlc3VsdCxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgZWxlY3Ryb25pY1NpZ25hdHVyZVNlcnZpY2UuY2hlY2tTaWduYXR1cmUuc2V0UmVzb2x2ZURhdGEoe1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlc2lnQXV0aEZhaWx1cmVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxsIGNvbXBsZXRlIGFuZCBlbnN1cmUgdGhhdCB0aGUgc3RhcnRpbmcgc3RhdHVzIGlzIGNvcnJlY3QuXHJcbiAgICAgICAgICAgIHNjb3BlLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5jb21wbGV0aW5nKS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuZXNpZ0Vycm9yKS50b0VxdWFsKG51bGwpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVzb2x2ZSB0aGUgY29tcGxldGUgcHJvbWlzZSBhbmQgY2hlY2sgdGhhdCB0aGUgZXJyb3IgaXMgc3RvcmVkXHJcbiAgICAgICAgICAgIC8vIGluIHRoZSBjb250cm9sbGVyIGFuZCB0aGF0IFwiY29tcGxldGluZ1wiIGhhcyBiZWVuIHJlc2V0LlxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZWxlY3Ryb25pY1NpZ25hdHVyZVNlcnZpY2UuY2hlY2tTaWduYXR1cmUpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsU2VydmljZS5zaWduKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuY29tcGxldGluZykudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5lc2lnRXJyb3IpLnRvRXF1YWwoZXNpZ0F1dGhGYWlsdXJlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGwgYWdhaW4gdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGVycm9yIG1lc3NhZ2UgYW5kIGNvbXBsZXRpbmdcclxuICAgICAgICAgICAgLy8gZmxhZ3MgZ2V0IHJlc2V0IHdoZW4gdHJ5aW5nIGFnYWluLlxyXG4gICAgICAgICAgICBzY29wZS5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuY29tcGxldGluZykudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmVzaWdFcnJvcikudG9FcXVhbChudWxsKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZpbmFsbHkgLi4uIG1ha2UgdGhlIHNlcnZpY2UgcmV0dXJuIHRydWUuICBWZXJpZnkgdGhhdCB0aGVcclxuICAgICAgICAgICAgLy8gbW9kYWwgaXMgY2xvc2VkLlxyXG4gICAgICAgICAgICBlbGVjdHJvbmljU2lnbmF0dXJlU2VydmljZS5jaGVja1NpZ25hdHVyZS5zZXRSZXNvbHZlRGF0YSh7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21wbGV0ZVJlc3VsdCA9IHNjb3BlLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlUmVzdWx0LnRoZW4oY29tcGxldGVTcHkpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcGxldGVTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
