System.register(['test/js/TestInitializer', 'reset/ResetModule'], function (_export) {
    'use strict';

    var resetModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_resetResetModule) {
            resetModule = _resetResetModule['default'];
        }],
        execute: function () {

            describe('AuthQuestionCtrl', function () {

                var rootScope, scope, http, changePasswordService, authQuestionService, unlockAccountService, configService, obscureAnswers, OBSCURE_AUTH_ANSWERS;

                beforeEach(module(resetModule));

                var createWithValidData = function () {
                    scope.answers = [{
                        id: 'q1',
                        answer: 'Question 1 answer'
                    }, {
                        id: 'q2',
                        answer: 'Question 2 answer'
                    }];

                    scope.passwordModel.password = 'password';
                    scope.passwordModel.confirm = 'password';
                };

                var createWithDuplicateAnswers = function () {
                    scope.answers = [{
                        id: 'q1',
                        answer: 'Question 1 answer'
                    }, {
                        id: 'q1',
                        answer: 'Question 2 answer'
                    }];

                    scope.passwordModel.password = 'password';
                    scope.passwordModel.confirm = 'password';
                };

                var createWithUnSelectedQuestion = function () {
                    scope.answers = [{
                        id: '',
                        answer: 'Question 1 answer'
                    }, {
                        id: 'q2',
                        answer: 'Question 2 answer'
                    }];

                    scope.passwordModel.password = 'password';
                    scope.passwordModel.confirm = 'password';
                };

                var createWithUnansweredQuestion = function () {
                    scope.answers = [{
                        id: 'q1',
                        answer: ''
                    }, {
                        id: 'q2',
                        answer: 'Question 2 answer'
                    }];

                    scope.passwordModel.password = 'password';
                    scope.passwordModel.confirm = 'password';
                };

                var createWithUnmatchedPasswords = function () {
                    scope.answers = [{
                        id: 'q1',
                        answer: 'Question 1 answer'
                    }, {
                        id: 'q2',
                        answer: 'Question 2 answer'
                    }];

                    scope.passwordModel.password = 'password';
                    scope.passwordModel.confirm = 'password1';
                };

                var setObscureAnswersConfg = function (value) {
                    obscureAnswers = value;
                };

                describe('password reset:', function () {
                    beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                        rootScope = $rootScope;
                        scope = $rootScope.$new();
                        http = $httpBackend;
                        changePasswordService = {
                            withQuestions: jasmine.createSpy().and.callFake(function () {
                                var deferred = $q.defer();
                                deferred.reject({
                                    data: {
                                        message: ['Password Policy violated.']
                                    },
                                    status: 500
                                });
                                return deferred.promise;
                            }),
                            loginUser: jasmine.createSpy()
                        };

                        // Create mock auth question service to test
                        authQuestionService = {
                            getAuthQuestions: function () {
                                var deferred = $q.defer();

                                deferred.resolve({
                                    data: {
                                        numRequired: 2,
                                        questions: [{
                                            id: 'questId1',
                                            text: 'Question1'
                                        }, {
                                            id: 'questId2',
                                            text: 'Question2'
                                        }]
                                    },
                                    status: 200
                                });
                                return deferred.promise;
                            }
                        };

                        spyOn(authQuestionService, 'getAuthQuestions').and.callThrough();

                        OBSCURE_AUTH_ANSWERS = 'obscureAuthQuestions';

                        // Mock out configService
                        configService = {
                            getConfigValue: jasmine.createSpy().and.callFake(function (key) {
                                if (OBSCURE_AUTH_ANSWERS === key) {
                                    return obscureAnswers;
                                }
                                throw 'Unknown config for test - ' + key;
                            })
                        };

                        $controller('AuthQuestionCtrl', {
                            $scope: scope,
                            changePasswordService: changePasswordService,
                            unlockAccountService: unlockAccountService,
                            authQuestionService: authQuestionService,
                            configService: configService,
                            OBSCURE_AUTH_ANSWERS: OBSCURE_AUTH_ANSWERS
                        });
                        $rootScope.$apply();
                    }));

                    describe('Controller initialization', function () {
                        it('should have submit button disabled', function () {
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                        it('should not have any error messages', function () {
                            expect(scope.errorMessages).toEqual('');
                        });
                        it('should not have any passwords', function () {
                            expect(scope.passwordModel.password).toEqual('');
                            expect(scope.passwordModel.confirm).toEqual('');
                        });
                        // Should test to see if fetchAuthQuestions was called
                        it('should call getAuthQuestions on initialization', function () {
                            expect(authQuestionService.getAuthQuestions).toHaveBeenCalled();
                        });

                        it('should have questions populated from the init', function () {
                            expect(scope.questions.length).toEqual(2);
                        });

                        it('should have answer models created based numRequired in service response', function () {
                            expect(scope.answers.length).toEqual(2);
                        });
                    });

                    describe('Valid Data', function () {

                        it('should have submit button enabled', function () {
                            createWithValidData();
                            expect(scope.isDisableSubmit()).toEqual(false);
                        });

                        it('should allow submit to be called successfully and show Service Error', function () {
                            createWithValidData();
                            scope.submit();
                            rootScope.$apply();
                            expect(changePasswordService.withQuestions).toHaveBeenCalled();
                            expect(changePasswordService.loginUser).not.toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('Password Policy violated.');
                        });
                    });

                    describe('DuplicateAnswers', function () {
                        it('should have submit button disabled', function () {
                            createWithDuplicateAnswers();
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                        it('should populate errorMessages upon submit', function () {
                            createWithDuplicateAnswers();
                            scope.submit();
                            rootScope.$apply();
                            expect(changePasswordService.withQuestions).not.toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('#{msgs.ui_reset_questions_duplicateSelectedQuestion}');
                        });
                    });

                    describe('Unselected Questions', function () {
                        it('should have submit button disabled', function () {
                            createWithUnSelectedQuestion();
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                        it('should populate errorMessages upon submit', function () {
                            createWithUnSelectedQuestion();
                            scope.submit();
                            rootScope.$apply();
                            expect(changePasswordService.withQuestions).not.toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('#{msgs.ui_reset_questions_questUndefined}');
                        });
                    });

                    describe('Unanswered Questions', function () {
                        it('should have submit button disabled', function () {
                            createWithUnansweredQuestion();
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                        it('should populate errorMessages upon submit', function () {
                            createWithUnansweredQuestion();
                            scope.submit();
                            rootScope.$apply();
                            expect(changePasswordService.withQuestions).not.toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('#{msgs.ui_reset_questions_answerUndefined}');
                        });
                    });

                    describe('Unmatched Passwords', function () {
                        it('should have submit button disabled', function () {
                            createWithUnmatchedPasswords();
                            expect(scope.isDisableSubmit()).toEqual(true);
                        });
                    });

                    describe('Success with Questions', function () {
                        var routingService;
                        beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                            rootScope = $rootScope;
                            scope = $rootScope.$new();
                            http = $httpBackend;

                            changePasswordService = {
                                withQuestions: jasmine.createSpy().and.callFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        status: 200
                                    });
                                    return deferred.promise;
                                }),
                                loginUser: jasmine.createSpy().and.callFake(function () {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        status: 200
                                    });
                                    return deferred.promise;
                                })
                            };

                            routingService = {
                                navigateSuccess: jasmine.createSpy().and.callFake(function () {
                                    return;
                                })

                            };

                            $controller('AuthQuestionCtrl', {
                                $scope: scope,
                                changePasswordService: changePasswordService,
                                unlockAccountService: unlockAccountService,
                                authQuestionService: authQuestionService,
                                routingService: routingService
                            });
                            $rootScope.$apply();
                        }));

                        describe('Valid Data and Success changePasswordService', function () {

                            it('should allow submit to be called successfully and callloginUser', function () {
                                createWithValidData();
                                scope.submit();
                                rootScope.$apply();
                                expect(changePasswordService.withQuestions).toHaveBeenCalled();
                                expect(changePasswordService.loginUser).toHaveBeenCalled();
                                expect(routingService.navigateSuccess).toHaveBeenCalled();
                            });
                        });

                        describe('Unsuccessful Login User', function () {
                            beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                                rootScope = $rootScope;
                                scope = $rootScope.$new();
                                http = $httpBackend;

                                changePasswordService = {
                                    withQuestions: jasmine.createSpy().and.callFake(function () {
                                        var deferred = $q.defer();
                                        deferred.resolve({
                                            status: 200
                                        });
                                        return deferred.promise;
                                    }),
                                    loginUser: jasmine.createSpy().and.callFake(function () {
                                        var deferred = $q.defer();
                                        deferred.reject({
                                            data: {
                                                message: ['Invalid username or password.']
                                            },
                                            status: 500
                                        });
                                        return deferred.promise;
                                    })
                                };

                                $controller('AuthQuestionCtrl', {
                                    $scope: scope,
                                    changePasswordService: changePasswordService,
                                    unlockAccountService: unlockAccountService,
                                    authQuestionService: authQuestionService,
                                    routingService: routingService
                                });
                                $rootScope.$apply();
                            }));

                            describe('Valid Data, Success changePasswordService, Fail Login User', function () {

                                it('should allow submit to be called successfully, call loginUser, stop on error', function () {
                                    createWithValidData();
                                    scope.submit();
                                    rootScope.$apply();
                                    expect(changePasswordService.withQuestions).toHaveBeenCalled();
                                    expect(changePasswordService.loginUser).toHaveBeenCalled();
                                    expect(routingService.navigateSuccess).not.toHaveBeenCalled();
                                    expect(scope.errorMessages).toBe('Invalid username or password.');
                                });
                            });
                        });
                    });

                    describe('Test Obscurity', function () {
                        it('Should have type = text', function () {
                            setObscureAnswersConfg(false);
                            expect(scope.getAnswerInputType()).toEqual('text');
                        });

                        it('Should have type = password', function () {
                            setObscureAnswersConfg(true);
                            expect(scope.getAnswerInputType()).toEqual('password');
                        });
                    });
                });

                describe('account unlock:', function () {
                    //Create a mock ResetDataService service that will be used by the RoutingService.
                    beforeEach(module(function ($provide) {
                        // Provide the mock as the ResetDataService, so this service will use it.
                        $provide.factory('resetDataService', function () {
                            return {
                                origin: '',
                                action: 'accountUnlock'
                            };
                        });
                    }));

                    beforeEach(inject(function ($rootScope, $httpBackend, $controller, $q) {

                        rootScope = $rootScope;
                        scope = $rootScope.$new();
                        http = $httpBackend;

                        unlockAccountService = {
                            withQuestions: jasmine.createSpy().and.callFake(function () {
                                var deferred = $q.defer();
                                deferred.reject({
                                    data: {
                                        message: ['Password Policy violated.']
                                    },
                                    status: 500
                                });
                                return deferred.promise;
                            })
                        };

                        // Create mock auth question service to test
                        authQuestionService = {
                            getAuthQuestions: jasmine.createSpy().and.callFake(function () {
                                return $q.defer().promise;
                            })
                        };

                        $controller('AuthQuestionCtrl', {
                            $scope: scope,
                            changePasswordService: changePasswordService,
                            unlockAccountService: unlockAccountService,
                            authQuestionService: authQuestionService
                        });
                        $rootScope.$apply();
                    }));

                    describe('With unlock account flow', function () {
                        it('should call unlockAccountService.withQuestions()', function () {
                            createWithValidData();
                            scope.submit();
                            rootScope.$apply();
                            expect(unlockAccountService.withQuestions).toHaveBeenCalled();
                            expect(scope.errorMessages).toBe('Password Policy violated.');
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2V0L0F1dGhRdWVzdGlvbkN0cmxUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixzQkFBc0IsVUFBVSxTQUFTO0lBQ2pGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQkFBbUI7WUFDekUsY0FBYyxrQkFBa0I7O1FBRXBDLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxvQkFBb0IsWUFBVzs7Z0JBRXBDLElBQUksV0FBVyxPQUFPLE1BQU0sdUJBQXVCLHFCQUFxQixzQkFBc0IsZUFDMUYsZ0JBQWdCOztnQkFFcEIsV0FBVyxPQUFPOztnQkFFbEIsSUFBSSxzQkFBc0IsWUFBVztvQkFDakMsTUFBTSxVQUFVLENBQ1o7d0JBQ0ksSUFBSTt3QkFDSixRQUFRO3VCQUVaO3dCQUNJLElBQUk7d0JBQ0osUUFBUTs7O29CQUloQixNQUFNLGNBQWMsV0FBVztvQkFDL0IsTUFBTSxjQUFjLFVBQVU7OztnQkFHbEMsSUFBSSw2QkFBNkIsWUFBVztvQkFDeEMsTUFBTSxVQUFVLENBQ1o7d0JBQ0ksSUFBSTt3QkFDSixRQUFRO3VCQUVaO3dCQUNJLElBQUk7d0JBQ0osUUFBUTs7O29CQUloQixNQUFNLGNBQWMsV0FBVztvQkFDL0IsTUFBTSxjQUFjLFVBQVU7OztnQkFJbEMsSUFBSSwrQkFBK0IsWUFBVztvQkFDMUMsTUFBTSxVQUFVLENBQ1o7d0JBQ0ksSUFBSTt3QkFDSixRQUFRO3VCQUVaO3dCQUNJLElBQUk7d0JBQ0osUUFBUTs7O29CQUloQixNQUFNLGNBQWMsV0FBVztvQkFDL0IsTUFBTSxjQUFjLFVBQVU7OztnQkFHbEMsSUFBSSwrQkFBK0IsWUFBVztvQkFDMUMsTUFBTSxVQUFVLENBQ1o7d0JBQ0ksSUFBSTt3QkFDSixRQUFRO3VCQUVaO3dCQUNJLElBQUk7d0JBQ0osUUFBUTs7O29CQUloQixNQUFNLGNBQWMsV0FBVztvQkFDL0IsTUFBTSxj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QUFNLHNCQUFzQixRQUFROzs7d0JBRy9DLEdBQUcsK0JBQStCLFlBQVc7NEJBQ3pDLHVCQUF1Qjs0QkFDdkIsT0FBTyxNQUFNLHNCQUFzQixRQUFROzs7OztnQkFPdkQsU0FBUyxtQkFBbUIsWUFBVzs7b0JBRW5DLFdBQVcsT0FBTyxVQUFTLFVBQVU7O3dCQUVqQyxTQUFTLFFBQVEsb0JBQW9CLFlBQVc7NEJBQzVDLE9BQU87Z0NBQ0gsUUFBUTtnQ0FDUixRQUFROzs7OztvQkFLcEIsV0FBVyxPQUFPLFVBQVMsWUFBWSxjQUFjLGFBQWEsSUFBSTs7d0JBRWxFLFlBQVk7d0JBQ1osUUFBUSxXQUFXO3dCQUNuQixPQUFPOzt3QkFFUCx1QkFBdUI7NEJBQ25CLGVBQWUsUUFBUSxZQUFZLElBQUksU0FDbkMsWUFBVztnQ0FDUCxJQUFJLFdBQVcsR0FBRztnQ0FDbEIsU0FBUyxPQUFPO29DQUNaLE1BQU07d0NBQ0YsU0FBUyxDQUFFOztvQ0FFZixRQUFROztnQ0FFWixPQUFPLFNBQVM7Ozs7O3dCQUs1QixzQkFBc0I7NEJBQ2xCLGtCQUFrQixRQUFRLFlBQVksSUFBSSxTQUFTLFlBQVc7Z0NBQzFELE9BQU8sR0FBRyxRQUFROzs7O3dCQUkxQixZQUFZLG9CQUFvQjs0QkFDNUIsUUFBUTs0QkFDUix1QkFBdUI7NEJBQ3ZCLHNCQUFzQjs0QkFDdEIscUJBQXFCOzt3QkFFekIsV0FBVzs7O29CQUlmLFNBQVMsNEJBQTRCLFlBQVc7d0JBQzVDLEdBQUcsb0RBQW9ELFlBQVc7NEJBQzlEOzRCQUNBLE1BQU07NEJBQ04sVUFBVTs0QkFDVixPQUFPLHFCQUFxQixlQUFlOzRCQUMzQyxPQUFPLE1BQU0sZUFBZSxLQUFLOzs7Ozs7O0dBdkI5QyIsImZpbGUiOiJyZXNldC9BdXRoUXVlc3Rpb25DdHJsVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHJlc2V0TW9kdWxlIGZyb20gJ3Jlc2V0L1Jlc2V0TW9kdWxlJztcblxuZGVzY3JpYmUoJ0F1dGhRdWVzdGlvbkN0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIHZhciByb290U2NvcGUsIHNjb3BlLCBodHRwLCBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsIGF1dGhRdWVzdGlvblNlcnZpY2UsIHVubG9ja0FjY291bnRTZXJ2aWNlLCBjb25maWdTZXJ2aWNlLFxuICAgICAgICBvYnNjdXJlQW5zd2VycywgT0JTQ1VSRV9BVVRIX0FOU1dFUlM7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShyZXNldE1vZHVsZSkpO1xuXG4gICAgdmFyIGNyZWF0ZVdpdGhWYWxpZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2NvcGUuYW5zd2VycyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ3ExJyxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6ICdRdWVzdGlvbiAxIGFuc3dlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdxMicsXG4gICAgICAgICAgICAgICAgYW5zd2VyOiAnUXVlc3Rpb24gMiBhbnN3ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgc2NvcGUucGFzc3dvcmRNb2RlbC5wYXNzd29yZCA9ICdwYXNzd29yZCc7XG4gICAgICAgIHNjb3BlLnBhc3N3b3JkTW9kZWwuY29uZmlybSA9ICdwYXNzd29yZCc7XG4gICAgfTtcblxuICAgIHZhciBjcmVhdGVXaXRoRHVwbGljYXRlQW5zd2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5hbnN3ZXJzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAncTEnLFxuICAgICAgICAgICAgICAgIGFuc3dlcjogJ1F1ZXN0aW9uIDEgYW5zd2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ3ExJyxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6ICdRdWVzdGlvbiAyIGFuc3dlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBzY29wZS5wYXNzd29yZE1vZGVsLnBhc3N3b3JkID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgc2NvcGUucGFzc3dvcmRNb2RlbC5jb25maXJtID0gJ3Bhc3N3b3JkJztcblxuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlV2l0aFVuU2VsZWN0ZWRRdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5hbnN3ZXJzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6ICdRdWVzdGlvbiAxIGFuc3dlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdxMicsXG4gICAgICAgICAgICAgICAgYW5zd2VyOiAnUXVlc3Rpb24gMiBhbnN3ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgc2NvcGUucGFzc3dvcmRNb2RlbC5wYXNzd29yZCA9ICdwYXNzd29yZCc7XG4gICAgICAgIHNjb3BlLnBhc3N3b3JkTW9kZWwuY29uZmlybSA9ICdwYXNzd29yZCc7XG4gICAgfTtcblxuICAgIHZhciBjcmVhdGVXaXRoVW5hbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjb3BlLmFuc3dlcnMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdxMScsXG4gICAgICAgICAgICAgICAgYW5zd2VyOiAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ3EyJyxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6ICdRdWVzdGlvbiAyIGFuc3dlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBzY29wZS5wYXNzd29yZE1vZGVsLnBhc3N3b3JkID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgc2NvcGUucGFzc3dvcmRNb2RlbC5jb25maXJtID0gJ3Bhc3N3b3JkJztcbiAgICB9O1xuXG4gICAgdmFyIGNyZWF0ZVdpdGhVbm1hdGNoZWRQYXNzd29yZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2NvcGUuYW5zd2VycyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ3ExJyxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6ICdRdWVzdGlvbiAxIGFuc3dlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdxMicsXG4gICAgICAgICAgICAgICAgYW5zd2VyOiAnUXVlc3Rpb24gMiBhbnN3ZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgc2NvcGUucGFzc3dvcmRNb2RlbC5wYXNzd29yZCA9ICdwYXNzd29yZCc7XG4gICAgICAgIHNjb3BlLnBhc3N3b3JkTW9kZWwuY29uZmlybSA9ICdwYXNzd29yZDEnO1xuICAgIH07XG5cbiAgICB2YXIgc2V0T2JzY3VyZUFuc3dlcnNDb25mZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIG9ic2N1cmVBbnN3ZXJzID0gdmFsdWU7XG4gICAgfTtcblxuICAgIGRlc2NyaWJlKCdwYXNzd29yZCByZXNldDonLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHBCYWNrZW5kLCAkY29udHJvbGxlciwgJHEpIHtcblxuICAgICAgICAgICAgcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICBodHRwID0gJGh0dHBCYWNrZW5kO1xuICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgIHdpdGhRdWVzdGlvbnM6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogWyAnUGFzc3dvcmQgUG9saWN5IHZpb2xhdGVkLicgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGxvZ2luVXNlcjogamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1vY2sgYXV0aCBxdWVzdGlvbiBzZXJ2aWNlIHRvIHRlc3RcbiAgICAgICAgICAgIGF1dGhRdWVzdGlvblNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgZ2V0QXV0aFF1ZXN0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtUmVxdWlyZWQ6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAncXVlc3RJZDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1F1ZXN0aW9uMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdxdWVzdElkMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnUXVlc3Rpb24yJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzcHlPbihhdXRoUXVlc3Rpb25TZXJ2aWNlLCAnZ2V0QXV0aFF1ZXN0aW9ucycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgICAgICBPQlNDVVJFX0FVVEhfQU5TV0VSUyA9ICdvYnNjdXJlQXV0aFF1ZXN0aW9ucyc7XG5cbiAgICAgICAgICAgIC8vIE1vY2sgb3V0IGNvbmZpZ1NlcnZpY2VcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgZ2V0Q29uZmlnVmFsdWU6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT0JTQ1VSRV9BVVRIX0FOU1dFUlMgPT09IGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2N1cmVBbnN3ZXJzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdVbmtub3duIGNvbmZpZyBmb3IgdGVzdCAtICcgKyBrZXk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRjb250cm9sbGVyKCdBdXRoUXVlc3Rpb25DdHJsJywge1xuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGUsXG4gICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlOiBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgdW5sb2NrQWNjb3VudFNlcnZpY2U6IHVubG9ja0FjY291bnRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIGF1dGhRdWVzdGlvblNlcnZpY2U6IGF1dGhRdWVzdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgY29uZmlnU2VydmljZTogY29uZmlnU2VydmljZSxcbiAgICAgICAgICAgICAgICBPQlNDVVJFX0FVVEhfQU5TV0VSUzogT0JTQ1VSRV9BVVRIX0FOU1dFUlNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ0NvbnRyb2xsZXIgaW5pdGlhbGl6YXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBzdWJtaXQgYnV0dG9uIGRpc2FibGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmlzRGlzYWJsZVN1Ym1pdCgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIGFueSBlcnJvciBtZXNzYWdlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5lcnJvck1lc3NhZ2VzKS50b0VxdWFsKCcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBhbnkgcGFzc3dvcmRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnBhc3N3b3JkTW9kZWwucGFzc3dvcmQpLnRvRXF1YWwoJycpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5wYXNzd29yZE1vZGVsLmNvbmZpcm0pLnRvRXF1YWwoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBTaG91bGQgdGVzdCB0byBzZWUgaWYgZmV0Y2hBdXRoUXVlc3Rpb25zIHdhcyBjYWxsZWRcbiAgICAgICAgICAgIGl0KCdzaG91bGQgY2FsbCBnZXRBdXRoUXVlc3Rpb25zIG9uIGluaXRpYWxpemF0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGF1dGhRdWVzdGlvblNlcnZpY2UuZ2V0QXV0aFF1ZXN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBxdWVzdGlvbnMgcG9wdWxhdGVkIGZyb20gdGhlIGluaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUucXVlc3Rpb25zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgYW5zd2VyIG1vZGVscyBjcmVhdGVkIGJhc2VkIG51bVJlcXVpcmVkIGluIHNlcnZpY2UgcmVzcG9uc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuYW5zd2Vycy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ1ZhbGlkIERhdGEnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIHN1Ym1pdCBidXR0b24gZW5hYmxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhWYWxpZERhdGEoKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuaXNEaXNhYmxlU3VibWl0KCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgYWxsb3cgc3VibWl0IHRvIGJlIGNhbGxlZCBzdWNjZXNzZnVsbHkgYW5kIHNob3cgU2VydmljZSBFcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhWYWxpZERhdGEoKTtcbiAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS53aXRoUXVlc3Rpb25zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS5sb2dpblVzZXIpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmVycm9yTWVzc2FnZXMpLnRvQmUoJ1Bhc3N3b3JkIFBvbGljeSB2aW9sYXRlZC4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnRHVwbGljYXRlQW5zd2VycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIHN1Ym1pdCBidXR0b24gZGlzYWJsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVXaXRoRHVwbGljYXRlQW5zd2VycygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5pc0Rpc2FibGVTdWJtaXQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBwb3B1bGF0ZSBlcnJvck1lc3NhZ2VzIHVwb24gc3VibWl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlV2l0aER1cGxpY2F0ZUFuc3dlcnMoKTtcbiAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS53aXRoUXVlc3Rpb25zKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5lcnJvck1lc3NhZ2VzKS50b0JlKCcje21zZ3MudWlfcmVzZXRfcXVlc3Rpb25zX2R1cGxpY2F0ZVNlbGVjdGVkUXVlc3Rpb259Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ1Vuc2VsZWN0ZWQgUXVlc3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgc3VibWl0IGJ1dHRvbiBkaXNhYmxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhVblNlbGVjdGVkUXVlc3Rpb24oKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuaXNEaXNhYmxlU3VibWl0KCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcG9wdWxhdGUgZXJyb3JNZXNzYWdlcyB1cG9uIHN1Ym1pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhVblNlbGVjdGVkUXVlc3Rpb24oKTtcbiAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS53aXRoUXVlc3Rpb25zKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5lcnJvck1lc3NhZ2VzKS50b0JlKCcje21zZ3MudWlfcmVzZXRfcXVlc3Rpb25zX3F1ZXN0VW5kZWZpbmVkfScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdVbmFuc3dlcmVkIFF1ZXN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIHN1Ym1pdCBidXR0b24gZGlzYWJsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVXaXRoVW5hbnN3ZXJlZFF1ZXN0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmlzRGlzYWJsZVN1Ym1pdCgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIHBvcHVsYXRlIGVycm9yTWVzc2FnZXMgdXBvbiBzdWJtaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVXaXRoVW5hbnN3ZXJlZFF1ZXN0aW9uKCk7XG4gICAgICAgICAgICAgICAgc2NvcGUuc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VQYXNzd29yZFNlcnZpY2Uud2l0aFF1ZXN0aW9ucykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuZXJyb3JNZXNzYWdlcykudG9CZSgnI3ttc2dzLnVpX3Jlc2V0X3F1ZXN0aW9uc19hbnN3ZXJVbmRlZmluZWR9Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ1VubWF0Y2hlZCBQYXNzd29yZHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBzdWJtaXQgYnV0dG9uIGRpc2FibGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlV2l0aFVubWF0Y2hlZFBhc3N3b3JkcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5pc0Rpc2FibGVTdWJtaXQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnU3VjY2VzcyB3aXRoIFF1ZXN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJvdXRpbmdTZXJ2aWNlO1xuICAgICAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHBCYWNrZW5kLCAkY29udHJvbGxlciwgJHEpIHtcblxuXG4gICAgICAgICAgICAgICAgcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgICAgIGh0dHAgPSAkaHR0cEJhY2tlbmQ7XG5cbiAgICAgICAgICAgICAgICBjaGFuZ2VQYXNzd29yZFNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIHdpdGhRdWVzdGlvbnM6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBsb2dpblVzZXI6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByb3V0aW5nU2VydmljZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRlU3VjY2VzczogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAkY29udHJvbGxlcignQXV0aFF1ZXN0aW9uQ3RybCcsIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlOiBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgIHVubG9ja0FjY291bnRTZXJ2aWNlOiB1bmxvY2tBY2NvdW50U2VydmljZSxcbiAgICAgICAgICAgICAgICAgICAgYXV0aFF1ZXN0aW9uU2VydmljZTogYXV0aFF1ZXN0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICAgICAgcm91dGluZ1NlcnZpY2U6IHJvdXRpbmdTZXJ2aWNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXNjcmliZSgnVmFsaWQgRGF0YSBhbmQgU3VjY2VzcyBjaGFuZ2VQYXNzd29yZFNlcnZpY2UnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgYWxsb3cgc3VibWl0IHRvIGJlIGNhbGxlZCBzdWNjZXNzZnVsbHkgYW5kIGNhbGxsb2dpblVzZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlV2l0aFZhbGlkRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY2hhbmdlUGFzc3dvcmRTZXJ2aWNlLndpdGhRdWVzdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS5sb2dpblVzZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJvdXRpbmdTZXJ2aWNlLm5hdmlnYXRlU3VjY2VzcykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlc2NyaWJlKCdVbnN1Y2Nlc3NmdWwgTG9naW4gVXNlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwQmFja2VuZCwgJGNvbnRyb2xsZXIsICRxKSB7XG5cblxuICAgICAgICAgICAgICAgICAgICByb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgICAgICAgICAgICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgICAgICAgICBodHRwID0gJGh0dHBCYWNrZW5kO1xuXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVBhc3N3b3JkU2VydmljZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhRdWVzdGlvbnM6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luVXNlcjogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBbICdJbnZhbGlkIHVzZXJuYW1lIG9yIHBhc3N3b3JkLicgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIoJ0F1dGhRdWVzdGlvbkN0cmwnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlOiBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmxvY2tBY2NvdW50U2VydmljZTogdW5sb2NrQWNjb3VudFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUXVlc3Rpb25TZXJ2aWNlOiBhdXRoUXVlc3Rpb25TZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGluZ1NlcnZpY2U6IHJvdXRpbmdTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgZGVzY3JpYmUoJ1ZhbGlkIERhdGEsIFN1Y2Nlc3MgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlLCBGYWlsIExvZ2luIFVzZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IHN1Ym1pdCB0byBiZSBjYWxsZWQgc3VjY2Vzc2Z1bGx5LCBjYWxsIGxvZ2luVXNlciwgc3RvcCBvbiBlcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVXaXRoVmFsaWREYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChjaGFuZ2VQYXNzd29yZFNlcnZpY2Uud2l0aFF1ZXN0aW9ucykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNoYW5nZVBhc3N3b3JkU2VydmljZS5sb2dpblVzZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChyb3V0aW5nU2VydmljZS5uYXZpZ2F0ZVN1Y2Nlc3MpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuZXJyb3JNZXNzYWdlcykudG9CZSgnSW52YWxpZCB1c2VybmFtZSBvciBwYXNzd29yZC4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnVGVzdCBPYnNjdXJpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdTaG91bGQgaGF2ZSB0eXBlID0gdGV4dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNldE9ic2N1cmVBbnN3ZXJzQ29uZmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5nZXRBbnN3ZXJJbnB1dFR5cGUoKSkudG9FcXVhbCgndGV4dCcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdTaG91bGQgaGF2ZSB0eXBlID0gcGFzc3dvcmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZXRPYnNjdXJlQW5zd2Vyc0NvbmZnKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5nZXRBbnN3ZXJJbnB1dFR5cGUoKSkudG9FcXVhbCgncGFzc3dvcmQnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYWNjb3VudCB1bmxvY2s6JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vQ3JlYXRlIGEgbW9jayBSZXNldERhdGFTZXJ2aWNlIHNlcnZpY2UgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIFJvdXRpbmdTZXJ2aWNlLlxuICAgICAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAgICAgLy8gUHJvdmlkZSB0aGUgbW9jayBhcyB0aGUgUmVzZXREYXRhU2VydmljZSwgc28gdGhpcyBzZXJ2aWNlIHdpbGwgdXNlIGl0LlxuICAgICAgICAgICAgJHByb3ZpZGUuZmFjdG9yeSgncmVzZXREYXRhU2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogJycsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2FjY291bnRVbmxvY2snXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHBCYWNrZW5kLCAkY29udHJvbGxlciwgJHEpIHtcblxuICAgICAgICAgICAgcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICBodHRwID0gJGh0dHBCYWNrZW5kO1xuXG4gICAgICAgICAgICB1bmxvY2tBY2NvdW50U2VydmljZSA9IHtcbiAgICAgICAgICAgICAgICB3aXRoUXVlc3Rpb25zOiBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5jYWxsRmFrZShcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFsgJ1Bhc3N3b3JkIFBvbGljeSB2aW9sYXRlZC4nIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIG1vY2sgYXV0aCBxdWVzdGlvbiBzZXJ2aWNlIHRvIHRlc3RcbiAgICAgICAgICAgIGF1dGhRdWVzdGlvblNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgZ2V0QXV0aFF1ZXN0aW9uczogamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5kZWZlcigpLnByb21pc2U7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRjb250cm9sbGVyKCdBdXRoUXVlc3Rpb25DdHJsJywge1xuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGUsXG4gICAgICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmRTZXJ2aWNlOiBjaGFuZ2VQYXNzd29yZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgdW5sb2NrQWNjb3VudFNlcnZpY2U6IHVubG9ja0FjY291bnRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIGF1dGhRdWVzdGlvblNlcnZpY2U6IGF1dGhRdWVzdGlvblNlcnZpY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICB9KSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ1dpdGggdW5sb2NrIGFjY291bnQgZmxvdycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHVubG9ja0FjY291bnRTZXJ2aWNlLndpdGhRdWVzdGlvbnMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVdpdGhWYWxpZERhdGEoKTtcbiAgICAgICAgICAgICAgICBzY29wZS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHVubG9ja0FjY291bnRTZXJ2aWNlLndpdGhRdWVzdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuZXJyb3JNZXNzYWdlcykudG9CZSgnUGFzc3dvcmQgUG9saWN5IHZpb2xhdGVkLicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
