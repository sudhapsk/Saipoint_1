System.register(['test/js/TestInitializer', 'identity/IdentityModule', 'test/js/TestModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
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

            describe('CreateIdentityCtrl', function () {
                var $httpBackend = undefined,
                    $controller = undefined,
                    $scope = undefined,
                    $rootScope = undefined,
                    $stateParams = undefined,
                    identityProvisioningFormDataService = undefined,
                    spModal = undefined,
                    identityProvisioningFormService = undefined,
                    testService = undefined,
                    $q = undefined,
                    formService = undefined,
                    locals = undefined;

                beforeEach(module(identityModule, testModule));

                /* jshint maxparams: 9 */
                beforeEach(inject(function (_$httpBackend_, _$controller_, _identityProvisioningFormDataService_, _$rootScope_, _spModal_, _identityProvisioningFormService_, _testService_, _$q_, _formService_) {
                    $httpBackend = _$httpBackend_;
                    $controller = _$controller_;
                    identityProvisioningFormDataService = _identityProvisioningFormDataService_;
                    identityProvisioningFormService = _identityProvisioningFormService_;
                    formService = _formService_;
                    $scope = _$rootScope_.$new();
                    $stateParams = {};
                    $q = _$q_;
                    spModal = _spModal_;
                    $rootScope = _$rootScope_;
                    testService = _testService_;

                    locals = {
                        $scope: $scope,
                        $stateParams: $stateParams,
                        identityProvisioningFormDataService: identityProvisioningFormDataService
                    };
                }));

                function createController(locals) {
                    $stateParams.identityId = 'someId';
                    $stateParams.quickLink = 'accountQuickLinkName';
                    return $controller('CreateIdentityCtrl', locals);
                }

                describe('disableSubmit', function () {
                    it('return true with identityProvisioningFormDataService isDirty is true', function () {
                        var formData = { formId: 'form001',
                            quickLinkName: 'Edit Identity',
                            getValues: function () {
                                return {
                                    manager: 'test manager',
                                    location: 'US'
                                };
                            },
                            getRequiredItems: function () {
                                return [];
                            }
                        },
                            formData1 = { formId: 'form001',
                            quickLinkName: 'Edit Identity',
                            getValues: function () {
                                return {
                                    manager: 'test manager2',
                                    location: 'Brazil'
                                };
                            },
                            getRequiredItems: function () {
                                return [];
                            }
                        },
                            ctrl = createController(locals),
                            actualResult = undefined;
                        ctrl.formData = formData;
                        ctrl.identityProvisioningFormDataService.formData = formData1;
                        spyOn(identityProvisioningFormDataService, 'isDirty').and.returnValue('true');
                        actualResult = ctrl.disableSubmit();
                        expect(identityProvisioningFormDataService.isDirty).toHaveBeenCalled();
                        expect(actualResult).toBeFalsy();
                    });
                });

                describe('setPriority', function () {
                    it('return true with identityProvisioningFormDataService disableSubmit is true', function () {
                        var ctrl = createController(locals),
                            priority = 'Normal';
                        ctrl.setPriority(priority);
                        expect(identityProvisioningFormDataService.getPriority()).toEqual(priority);
                        expect(ctrl.priority).toEqual(priority);
                    });
                });

                describe('isSetPriorityEnabled', function () {
                    var configService = undefined,
                        SP_CONFIG_SERVICE = undefined,
                        locals = undefined;

                    beforeEach(inject(function (_configService_, _SP_CONFIG_SERVICE_) {
                        configService = _configService_;
                        SP_CONFIG_SERVICE = _SP_CONFIG_SERVICE_;
                        spyOn(configService, 'getConfigValue');
                        locals = {
                            $scope: $scope,
                            $stateParams: $stateParams,
                            identityProvisioningFormDataService: identityProvisioningFormDataService,
                            configService: configService
                        };
                    }));

                    it('should be disabled if config is false', function () {
                        configService.getConfigValue.and.returnValue(false);
                        var ctrl = createController(locals);

                        expect(configService.getConfigValue).toHaveBeenCalledWith(SP_CONFIG_SERVICE.ACCESS_REQUEST_ALLOW_PRIORITY_EDITING);
                        expect(ctrl.isSetPriorityEnabled()).toBeFalsy();
                    });

                    it('should be enabled if config is true', function () {
                        configService.getConfigValue.and.returnValue(true);
                        var ctrl = createController(locals);

                        expect(configService.getConfigValue).toHaveBeenCalledWith(SP_CONFIG_SERVICE.ACCESS_REQUEST_ALLOW_PRIORITY_EDITING);
                        expect(ctrl.isSetPriorityEnabled()).toBeTruthy();
                    });
                });

                describe('submit', function () {
                    var navigationService = undefined,
                        promiseTrackerService = undefined,
                        mockForm = undefined,
                        ctrl = undefined;

                    beforeEach(inject(function (_navigationService_, _promiseTrackerService_) {
                        mockForm = {
                            clearErrors: jasmine.createSpy()
                        };
                        navigationService = _navigationService_;
                        promiseTrackerService = _promiseTrackerService_;

                        spyOn(identityProvisioningFormDataService, 'getFormConfig').and.returnValue(mockForm);
                        spyOn(promiseTrackerService, 'track');
                        spyOn(identityProvisioningFormService, 'getForm').and.returnValue($q.when({}));
                        spyOn(navigationService, 'go').and.callFake(angular.noop);
                        locals.promiseTrackerService = promiseTrackerService;
                        locals.navigationService = navigationService;
                        ctrl = createController(locals);
                    }));

                    it('calls identityProvisioningFormService  submitCreateForm', function () {
                        spyOn(identityProvisioningFormService, 'submitCreateForm').and.callFake(function () {
                            return $q.when({ getOutcome: angular.noop });
                        });
                        ctrl.submit();
                        $scope.$apply();
                        expect(promiseTrackerService.track).toHaveBeenCalled();
                        expect(identityProvisioningFormService.submitCreateForm).toHaveBeenCalled();
                    });

                    it('should call spmodal if submitted an error', function () {
                        var errorMessages = ['error 1', 'error 2'],
                            submitResult = $q.reject(errorMessages),
                            openArg = undefined;
                        spyOn(identityProvisioningFormService, 'submitCreateForm').and.returnValue(submitResult);
                        spyOn(spModal, 'open').and.callFake(angular.noop);

                        ctrl.submit();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        openArg = spModal.open.calls.mostRecent().args[0];
                        expect(openArg.content).toEqual(errorMessages.join('\n'));
                    });

                    it('should call for service.applyErrors if there are validation errors', function () {
                        var ctrl = undefined,
                            validationErrors = [{ 'someField': 'important validation message' }],
                            submitResult = $q.reject({ items: validationErrors });
                        spyOn(identityProvisioningFormService, 'submitCreateForm').and.returnValue(submitResult);
                        spyOn(formService, 'applyErrors').and.callFake(angular.noop);

                        ctrl = createController(locals);
                        ctrl.submit();
                        $rootScope.$apply();
                        expect(formService.applyErrors).toHaveBeenCalled();
                    });

                    it('should clear errors on the form before submit', function () {
                        spyOn(identityProvisioningFormService, 'submitCreateForm').and.callFake(function () {
                            return $q.when({ getOutcome: angular.noop });
                        });
                        ctrl.submit();
                        $scope.$apply();
                        expect(mockForm.clearErrors).toHaveBeenCalled();
                    });
                });

                describe('navigateToOutcome', function () {
                    var identityService = undefined,
                        navigationService = undefined,
                        QuickLink = undefined,
                        homeOutcome = 'HOME',
                        identityAttributeOutcome = 'VIEW_IDENTITY',
                        locals = undefined;

                    function validateOutcomeNavigation(outcome, expectedState) {
                        var ctrl = createController(locals),
                            actualArgs = undefined;
                        ctrl.navigateToOutcome(outcome);
                        expect(navigationService.go).toHaveBeenCalled();
                        actualArgs = navigationService.go.calls.mostRecent().args;
                        expect(actualArgs[0].state).toEqual(expectedState);
                    }

                    beforeEach(inject(function (_identityService_, _navigationService_, _QuickLink_) {
                        identityService = _identityService_;
                        navigationService = _navigationService_;
                        QuickLink = _QuickLink_;
                        spyOn(navigationService, 'go');
                        locals = {
                            $scope: $scope,
                            $stateParams: $stateParams,
                            identityProvisioningFormDataService: identityProvisioningFormDataService,
                            identityService: identityService,
                            navigationService: navigationService
                        };
                    }));

                    it('should call through to navigation service to nav to identity attribute state', function () {
                        var mockActionMap = {},
                            mockLink = new QuickLink({ id: 'someLink' });
                        mockActionMap[QuickLink.Actions.VIEW_IDENTITY] = mockLink;
                        spyOn(identityService, 'getAvailableActionsMap').and.returnValue(mockActionMap);
                        validateOutcomeNavigation(identityAttributeOutcome, 'identities.identity.attributes');
                    });

                    it('should call through to navigation service to nav to home', function () {
                        validateOutcomeNavigation(homeOutcome, 'home');
                    });
                });

                describe('isDirty', function () {
                    it('should delegate to identityProvisioningFormDataService', function () {
                        var ctrl = createController(locals);
                        spyOn(identityProvisioningFormDataService, 'isDirty').and.returnValue(true);
                        expect(ctrl.isDirty()).toBeTruthy();
                        expect(identityProvisioningFormDataService.isDirty).toHaveBeenCalled();
                    });
                });

                describe('reset', function () {
                    var navigationService = undefined;

                    beforeEach(inject(function (_navigationService_) {
                        navigationService = _navigationService_;
                        locals.navigationService = navigationService;
                    }));

                    it('return not dirty after cancel', function () {
                        var formData = { formId: 'form001',
                            quickLinkName: 'Edit Identity',
                            getValues: function () {
                                return {
                                    manager: 'test manager',
                                    location: 'US'
                                };
                            } },
                            formData1 = { formId: 'form001',
                            quickLinkName: 'Edit Identity',
                            getValues: function () {
                                return {
                                    manager: 'test manager2',
                                    location: 'Brazil'
                                };
                            } },
                            ctrl = undefined,
                            actualResult = undefined;
                        spyOn(navigationService, 'go').and.callFake(angular.noop);
                        ctrl = createController(locals);
                        ctrl.formData = formData;
                        ctrl.identityProvisioningFormDataService.formData = formData1;
                        ctrl.reset();
                        actualResult = ctrl.disableSubmit();
                        expect(actualResult).toBeTruthy();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0NyZWF0ZUlkZW50aXR5Q3RybFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwyQkFBMkIsdUJBQXVCLFVBQVUsU0FBUzs7OztJQUk3Rzs7SUFFQSxJQUFJLGdCQUFnQjtJQUNwQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQU43QixTQUFTLHNCQUFzQixZQUFXO2dCQUN0QyxJQUFJLGVBQVk7b0JBQUUsY0FBVztvQkFBRSxTQUFNO29CQUFFLGFBQVU7b0JBQUUsZUFBWTtvQkFBRSxzQ0FBbUM7b0JBQUUsVUFBTztvQkFDekcsa0NBQStCO29CQUFFLGNBQVc7b0JBQUUsS0FBRTtvQkFBRSxjQUFXO29CQUFFLFNBQU07O2dCQUV6RSxXQUFXLE9BQU8sZ0JBQWdCOzs7Z0JBR2xDLFdBQVcsT0FBTyxVQUFTLGdCQUFnQixlQUFlLHVDQUF1QyxjQUN0RSxXQUFXLG1DQUFtQyxlQUFlLE1BQU0sZUFBZTtvQkFDekcsZUFBZTtvQkFDZixjQUFjO29CQUNkLHNDQUFzQztvQkFDdEMsa0NBQWtDO29CQUNsQyxjQUFjO29CQUNkLFNBQVMsYUFBYTtvQkFDdEIsZUFBZTtvQkFDZixLQUFLO29CQUNMLFVBQVU7b0JBQ1YsYUFBYTtvQkFDYixjQUFjOztvQkFFZCxTQUFVO3dCQUNOLFFBQVE7d0JBQ1IsY0FBYzt3QkFDZCxxQ0FBcUM7Ozs7Z0JBSTdDLFNBQVMsaUJBQWlCLFFBQVE7b0JBQzlCLGFBQWEsYUFBYTtvQkFDMUIsYUFBYSxZQUFZO29CQUN6QixPQUFPLFlBQVksc0JBQXNCOzs7Z0JBRzdDLFNBQVMsaUJBQWlCLFlBQVc7b0JBQ2pDLEdBQUcsd0VBQXdFLFlBQVc7d0JBQ2xGLElBQUksV0FBVyxFQUFDLFFBQVE7NEJBQ2hCLGVBQWU7NEJBQ2YsV0FBVyxZQUFXO2dDQUNsQixPQUFPO29DQUNILFNBQVM7b0NBQ1QsVUFBVTs7OzRCQUdsQixrQkFBa0IsWUFBVztnQ0FDekIsT0FBTzs7OzRCQUdmLFlBQVksRUFBQyxRQUFROzRCQUNqQixlQUFlOzRCQUNmLFdBQVcsWUFBVztnQ0FDbEIsT0FBTztvQ0FDSCxTQUFTO29DQUNULFVBQVU7Ozs0QkFHbEIsa0JBQWtCLFlBQVc7Z0NBQ3pCLE9BQU87Ozs0QkFHZixPQUFPLGlCQUFpQjs0QkFDeEIsZUFBWTt3QkFDaEIsS0FBSyxXQUFXO3dCQUNoQixLQUFLLG9DQUFvQyxXQUFXO3dCQUNwRCxNQUFNLHFDQUFxQyxXQUFXLElBQUksWUFBWTt3QkFDdEUsZUFBZSxLQUFLO3dCQUNwQixPQUFPLG9DQUFvQyxTQUFTO3dCQUNwRCxPQUFPLGNBQWM7Ozs7Z0JBSTdCLFNBQVMsZUFBZSxZQUFXO29CQUMvQixHQUFHLDhFQUE4RSxZQUFXO3dCQUN4RixJQUFJLE9BQU8saUJBQWlCOzRCQUN4QixXQUFXO3dCQUNmLEtBQUssWUFBWTt3QkFDakIsT0FBTyxvQ0FBb0MsZUFBZSxRQUFRO3dCQUNsRSxPQUFPLEtBQUssVUFBVSxRQUFROzs7O2dCQUl0QyxTQUFTLHdCQUF3QixZQUFXO29CQUN4QyxJQUFJLGdCQUFhO3dCQUFFLG9CQUFpQjt3QkFBRSxTQUFNOztvQkFFNUMsV0FBVyxPQUFPLFVBQVMsaUJBQWlCLHFCQUFxQjt3QkFDN0QsZ0JBQWdCO3dCQUNoQixvQkFBb0I7d0JBQ3BCLE1BQU0sZUFBZTt3QkFDckIsU0FBUzs0QkFDTCxRQUFROzRCQUNSLGNBQWM7NEJBQ2QscUNBQXFDOzRCQUNyQyxlQUFlOzs7O29CQUl2QixHQUFHLHlDQUF5QyxZQUFXO3dCQUNuRCxjQUFjLGVBQWUsSUFBSSxZQUFZO3dCQUM3QyxJQUFJLE9BQU8saUJBQWlCOzt3QkFFNUIsT0FBTyxjQUFjLGdCQUNyQixxQkFBcUIsa0JBQWtCO3dCQUN2QyxPQUFPLEtBQUssd0JBQXdCOzs7b0JBR3hDLEdBQUcsdUNBQXVDLFlBQVc7d0JBQ2pELGNBQWMsZUFBZSxJQUFJLFlBQVk7d0JBQzdDLElBQUksT0FBTyxpQkFBaUI7O3dCQUU1QixPQUFPLGNBQWMsZ0JBQ3JCLHFCQUFxQixrQkFBa0I7d0JBQ3ZDLE9BQU8sS0FBSyx3QkFBd0I7Ozs7Z0JBSzVDLFNBQVMsVUFBVSxZQUFXO29CQUMxQixJQUFJLG9CQUFpQjt3QkFBRSx3QkFBcUI7d0JBQUUsV0FBUTt3QkFBRSxPQUFJOztvQkFFNUQsV0FBVyxPQUFPLFVBQVMscUJBQXFCLHlCQUF5Qjt3QkFDckUsV0FBVzs0QkFDUCxhQUFhLFFBQVE7O3dCQUV6QixvQkFBb0I7d0JBQ3BCLHdCQUF3Qjs7d0JBRXhCLE1BQU0scUNBQXFDLGlCQUFpQixJQUFJLFlBQVk7d0JBQzVFLE1BQU0sdUJBQXVCO3dCQUM3QixNQUFNLGlDQUFpQyxXQUFXLElBQUksWUFBWSxHQUFHLEtBQUs7d0JBQzFFLE1BQU0sbUJBQW1CLE1BQU0sSUFBSSxTQUFTLFFBQVE7d0JBQ3BELE9BQU8sd0JBQXdCO3dCQUMvQixPQUFPLG9CQUFvQjt3QkFDM0IsT0FBTyxpQkFBaUI7OztvQkFHNUIsR0FBRywyREFBMkQsWUFBVzt3QkFDckUsTUFBTSxpQ0FBaUMsb0JBQW9CLElBQUksU0FBUyxZQUFXOzRCQUMvRSxPQUFPLEdBQUcsS0FBSyxFQUFDLFlBQVksUUFBUTs7d0JBRXhDLEtBQUs7d0JBQ0wsT0FBTzt3QkFDUCxPQUFPLHNCQUFzQixPQUFPO3dCQUNwQyxPQUFPLGdDQUFnQyxrQkFBa0I7OztvQkFHN0QsR0FBRyw2Q0FBNkMsWUFBVzt3QkFDdkQsSUFBSSxnQkFBZ0IsQ0FBQyxXQUFXOzRCQUM1QixlQUFlLEdBQUcsT0FBTzs0QkFDekIsVUFBTzt3QkFDWCxNQUFNLGlDQUFpQyxvQkFBb0IsSUFBSSxZQUFZO3dCQUMzRSxNQUFNLFNBQVMsUUFBUSxJQUFJLFNBQVMsUUFBUTs7d0JBRTVDLEtBQUs7d0JBQ0wsV0FBVzt3QkFDWCxPQUFPLFFBQVEsTUFBTTt3QkFDckIsVUFBVSxRQUFRLEtBQUssTUFBTSxhQUFhLEtBQUs7d0JBQy9DLE9BQU8sUUFBUSxTQUFTLFFBQVEsY0FBYyxLQUFLOzs7b0JBR3ZELEdBQUcsc0VBQXNFLFlBQVc7d0JBQ2hGLElBQUksT0FBSTs0QkFDSixtQkFBbUIsQ0FBQyxFQUFDLGFBQWE7NEJBQ2xDLGVBQWUsR0FBRyxPQUFPLEVBQUMsT0FBTzt3QkFDckMsTUFBTSxpQ0FBaUMsb0JBQW9CLElBQUksWUFBWTt3QkFDM0UsTUFBTSxhQUFhLGVBQWUsSUFBSSxTQUFTLFFBQVE7O3dCQUV2RCxPQUFPLGlCQUFpQjt3QkFDeEIsS0FBSzt3QkFDTCxXQUFXO3dCQUNYLE9BQU8sWUFBWSxhQUFhOzs7b0JBR3BDLEdBQUcsaURBQWlELFlBQVc7d0JBQzNELE1BQU0saUNBQWlDLG9CQUFvQixJQUFJLFNBQVMsWUFBVzs0QkFDL0UsT0FBTyxHQUFHLEtBQUssRUFBQyxZQUFZLFFBQVE7O3dCQUV4QyxLQUFLO3dCQUNMLE9BQU87d0JBQ1AsT0FBTyxTQUFTLGFBQWE7Ozs7Z0JBSXJDLFNBQVMscUJBQXFCLFlBQVc7b0JBQ3JDLElBQUksa0JBQWU7d0JBQUUsb0JBQWlCO3dCQUFFLFlBQVM7d0JBQzdDLGNBQWM7d0JBQ2QsMkJBQTJCO3dCQUMzQixTQUFNOztvQkFFVixTQUFTLDBCQUEwQixTQUFTLGVBQWU7d0JBQ3ZELElBQUksT0FBTyxpQkFBaUI7NEJBQ3hCLGFBQVU7d0JBQ2QsS0FBSyxrQkFBa0I7d0JBQ3ZCLE9BQU8sa0JBQWtCLElBQUk7d0JBQzdCLGFBQWEsa0JBQWtCLEdBQUcsTUFBTSxhQUFhO3dCQUNyRCxPQUFPLFdBQVcsR0FBRyxPQUFPLFFBQVE7OztvQkFHeEMsV0FBVyxPQUFPLFVBQVMsbUJBQW1CLHFCQUFxQixhQUFhO3dCQUM1RSxrQkFBa0I7d0JBQ2xCLG9CQUFvQjt3QkFDcEIsWUFBWTt3QkFDWixNQUFNLG1CQUFtQjt3QkFDekIsU0FBUzs0QkFDTCxRQUFROzRCQUNSLGNBQWM7NEJBQ2QscUNBQXFDOzRCQUNyQyxpQkFBaUI7NEJBQ2pCLG1CQUFtQjs7OztvQkFJM0IsR0FBRyxnRkFBZ0YsWUFBVzt3QkFDMUYsSUFBSSxnQkFBZ0I7NEJBQ2hCLFdBQVcsSUFBSSxVQUFVLEVBQUMsSUFBSTt3QkFDbEMsY0FBYyxVQUFVLFFBQVEsaUJBQWlCO3dCQUNqRCxNQUFNLGlCQUFpQiwwQkFBMEIsSUFBSSxZQUFZO3dCQUNqRSwwQkFBMEIsMEJBQTBCOzs7b0JBR3hELEdBQUcsNERBQTRELFlBQVc7d0JBQ3RFLDBCQUEwQixhQUFhOzs7O2dCQUkvQyxTQUFTLFdBQVcsWUFBVztvQkFDM0IsR0FBRywwREFBMEQsWUFBVzt3QkFDcEUsSUFBSSxPQUFPLGlCQUFpQjt3QkFDNUIsTUFBTSxxQ0FBcUMsV0FBVyxJQUFJLFlBQVk7d0JBQ3RFLE9BQU8sS0FBSyxXQUFXO3dCQUN2QixPQUFPLG9DQUFvQyxTQUFTOzs7O2dCQUk1RCxTQUFTLFNBQVMsWUFBVztvQkFDekIsSUFBSSxvQkFBaUI7O29CQUVyQixXQUFXLE9BQU8sVUFBUyxxQkFBcUI7d0JBQzVDLG9CQUFvQjt3QkFDcEIsT0FBTyxvQkFBb0I7OztvQkFHL0IsR0FBRyxpQ0FBaUMsWUFBVzt3QkFDM0MsSUFBSSxXQUFXLEVBQUMsUUFBUTs0QkFDaEIsZUFBZTs0QkFDZixXQUFXLFlBQVc7Z0NBQ2xCLE9BQU87b0NBQ0gsU0FBUztvQ0FDVCxVQUFVOzs7NEJBR3RCLFlBQVksRUFBQyxRQUFROzRCQUNqQixlQUFlOzRCQUNmLFdBQVcsWUFBVztnQ0FDbEIsT0FBTztvQ0FDSCxTQUFTO29DQUNULFVBQVU7Ozs0QkFHdEIsT0FBSTs0QkFDSixlQUFZO3dCQUNoQixNQUFNLG1CQUFtQixNQUFNLElBQUksU0FBUyxRQUFRO3dCQUNwRCxPQUFPLGlCQUFpQjt3QkFDeEIsS0FBSyxXQUFXO3dCQUNoQixLQUFLLG9DQUFvQyxXQUFXO3dCQUNwRCxLQUFLO3dCQUNMLGVBQWUsS0FBSzt3QkFDcEIsT0FBTyxjQUFjOzs7Ozs7R0EyQjlCIiwiZmlsZSI6ImlkZW50aXR5L0NyZWF0ZUlkZW50aXR5Q3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChjKSBDb3B5cmlnaHQgMjAxNi4gU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcblxuZGVzY3JpYmUoJ0NyZWF0ZUlkZW50aXR5Q3RybCcsIGZ1bmN0aW9uKCkge1xuICAgIGxldCAkaHR0cEJhY2tlbmQsICRjb250cm9sbGVyLCAkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtRGF0YVNlcnZpY2UsIHNwTW9kYWwsXG4gICAgICAgIGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybVNlcnZpY2UsIHRlc3RTZXJ2aWNlLCAkcSwgZm9ybVNlcnZpY2UsIGxvY2FscztcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGlkZW50aXR5TW9kdWxlLCB0ZXN0TW9kdWxlKSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiA5ICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRodHRwQmFja2VuZF8sIF8kY29udHJvbGxlcl8sIF9pZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZV8sIF8kcm9vdFNjb3BlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3BNb2RhbF8sIF9pZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlXywgX3Rlc3RTZXJ2aWNlXywgXyRxXywgX2Zvcm1TZXJ2aWNlXykge1xuICAgICAgICAkaHR0cEJhY2tlbmQgPSBfJGh0dHBCYWNrZW5kXztcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZSA9IF9pZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZV87XG4gICAgICAgIGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybVNlcnZpY2UgPSBfaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZV87XG4gICAgICAgIGZvcm1TZXJ2aWNlID0gX2Zvcm1TZXJ2aWNlXztcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfLiRuZXcoKTtcbiAgICAgICAgJHN0YXRlUGFyYW1zID0ge307XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuXG4gICAgICAgIGxvY2FscyA9ICB7XG4gICAgICAgICAgICAkc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICRzdGF0ZVBhcmFtczogJHN0YXRlUGFyYW1zLFxuICAgICAgICAgICAgaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtRGF0YVNlcnZpY2U6IGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlXG4gICAgICAgIH07XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihsb2NhbHMpIHtcbiAgICAgICAgJHN0YXRlUGFyYW1zLmlkZW50aXR5SWQgPSAnc29tZUlkJztcbiAgICAgICAgJHN0YXRlUGFyYW1zLnF1aWNrTGluayA9ICdhY2NvdW50UXVpY2tMaW5rTmFtZSc7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignQ3JlYXRlSWRlbnRpdHlDdHJsJywgbG9jYWxzKTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnZGlzYWJsZVN1Ym1pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgncmV0dXJuIHRydWUgd2l0aCBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZSBpc0RpcnR5IGlzIHRydWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9IHtmb3JtSWQ6ICdmb3JtMDAxJyxcbiAgICAgICAgICAgICAgICAgICAgcXVpY2tMaW5rTmFtZTogJ0VkaXQgSWRlbnRpdHknLFxuICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYW5hZ2VyOiAndGVzdCBtYW5hZ2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogJ1VTJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0UmVxdWlyZWRJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZvcm1EYXRhMSA9IHtmb3JtSWQ6ICdmb3JtMDAxJyxcbiAgICAgICAgICAgICAgICAgICAgcXVpY2tMaW5rTmFtZTogJ0VkaXQgSWRlbnRpdHknLFxuICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYW5hZ2VyOiAndGVzdCBtYW5hZ2VyMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246ICdCcmF6aWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBnZXRSZXF1aXJlZEl0ZW1zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobG9jYWxzKSxcbiAgICAgICAgICAgICAgICBhY3R1YWxSZXN1bHQ7XG4gICAgICAgICAgICBjdHJsLmZvcm1EYXRhID0gZm9ybURhdGE7XG4gICAgICAgICAgICBjdHJsLmlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlLmZvcm1EYXRhID0gZm9ybURhdGExO1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtRGF0YVNlcnZpY2UsICdpc0RpcnR5JykuYW5kLnJldHVyblZhbHVlKCd0cnVlJyk7XG4gICAgICAgICAgICBhY3R1YWxSZXN1bHQgPSBjdHJsLmRpc2FibGVTdWJtaXQoKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZS5pc0RpcnR5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0dWFsUmVzdWx0KS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2V0UHJpb3JpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3JldHVybiB0cnVlIHdpdGggaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtRGF0YVNlcnZpY2UgZGlzYWJsZVN1Ym1pdCBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobG9jYWxzKSxcbiAgICAgICAgICAgICAgICBwcmlvcml0eSA9ICdOb3JtYWwnO1xuICAgICAgICAgICAgY3RybC5zZXRQcmlvcml0eShwcmlvcml0eSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtRGF0YVNlcnZpY2UuZ2V0UHJpb3JpdHkoKSkudG9FcXVhbChwcmlvcml0eSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5wcmlvcml0eSkudG9FcXVhbChwcmlvcml0eSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzU2V0UHJpb3JpdHlFbmFibGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjb25maWdTZXJ2aWNlLCBTUF9DT05GSUdfU0VSVklDRSwgbG9jYWxzO1xuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9jb25maWdTZXJ2aWNlXywgX1NQX0NPTkZJR19TRVJWSUNFXykge1xuICAgICAgICAgICAgY29uZmlnU2VydmljZSA9IF9jb25maWdTZXJ2aWNlXztcbiAgICAgICAgICAgIFNQX0NPTkZJR19TRVJWSUNFID0gX1NQX0NPTkZJR19TRVJWSUNFXztcbiAgICAgICAgICAgIHNweU9uKGNvbmZpZ1NlcnZpY2UsICdnZXRDb25maWdWYWx1ZScpO1xuICAgICAgICAgICAgbG9jYWxzID0ge1xuICAgICAgICAgICAgICAgICRzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgICRzdGF0ZVBhcmFtczogJHN0YXRlUGFyYW1zLFxuICAgICAgICAgICAgICAgIGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlOiBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZSxcbiAgICAgICAgICAgICAgICBjb25maWdTZXJ2aWNlOiBjb25maWdTZXJ2aWNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBkaXNhYmxlZCBpZiBjb25maWcgaXMgZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnVmFsdWUuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHZhciBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihsb2NhbHMpO1xuXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnU2VydmljZS5nZXRDb25maWdWYWx1ZSkuXG4gICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChTUF9DT05GSUdfU0VSVklDRS5BQ0NFU1NfUkVRVUVTVF9BTExPV19QUklPUklUWV9FRElUSU5HKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU2V0UHJpb3JpdHlFbmFibGVkKCkpLnRvQmVGYWxzeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGJlIGVuYWJsZWQgaWYgY29uZmlnIGlzIHRydWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnVmFsdWUuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGxvY2Fscyk7XG5cbiAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlLmdldENvbmZpZ1ZhbHVlKS5cbiAgICAgICAgICAgIHRvSGF2ZUJlZW5DYWxsZWRXaXRoKFNQX0NPTkZJR19TRVJWSUNFLkFDQ0VTU19SRVFVRVNUX0FMTE9XX1BSSU9SSVRZX0VESVRJTkcpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTZXRQcmlvcml0eUVuYWJsZWQoKSkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgbmF2aWdhdGlvblNlcnZpY2UsIHByb21pc2VUcmFja2VyU2VydmljZSwgbW9ja0Zvcm0sIGN0cmw7XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX25hdmlnYXRpb25TZXJ2aWNlXywgX3Byb21pc2VUcmFja2VyU2VydmljZV8pIHtcbiAgICAgICAgICAgIG1vY2tGb3JtID0ge1xuICAgICAgICAgICAgICAgIGNsZWFyRXJyb3JzOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UgPSBfbmF2aWdhdGlvblNlcnZpY2VfO1xuICAgICAgICAgICAgcHJvbWlzZVRyYWNrZXJTZXJ2aWNlID0gX3Byb21pc2VUcmFja2VyU2VydmljZV87XG5cbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlLCAnZ2V0Rm9ybUNvbmZpZycpLmFuZC5yZXR1cm5WYWx1ZShtb2NrRm9ybSk7XG4gICAgICAgICAgICBzcHlPbihwcm9taXNlVHJhY2tlclNlcnZpY2UsICd0cmFjaycpO1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZSwgJ2dldEZvcm0nKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih7fSkpO1xuICAgICAgICAgICAgc3B5T24obmF2aWdhdGlvblNlcnZpY2UsICdnbycpLmFuZC5jYWxsRmFrZShhbmd1bGFyLm5vb3ApO1xuICAgICAgICAgICAgbG9jYWxzLnByb21pc2VUcmFja2VyU2VydmljZSA9IHByb21pc2VUcmFja2VyU2VydmljZTtcbiAgICAgICAgICAgIGxvY2Fscy5uYXZpZ2F0aW9uU2VydmljZSA9IG5hdmlnYXRpb25TZXJ2aWNlO1xuICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobG9jYWxzKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGl0KCdjYWxscyBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlICBzdWJtaXRDcmVhdGVGb3JtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzcHlPbihpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlLCAnc3VibWl0Q3JlYXRlRm9ybScpLmFuZC5jYWxsRmFrZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7Z2V0T3V0Y29tZTogYW5ndWxhci5ub29wfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QocHJvbWlzZVRyYWNrZXJTZXJ2aWNlLnRyYWNrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZS5zdWJtaXRDcmVhdGVGb3JtKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBzcG1vZGFsIGlmIHN1Ym1pdHRlZCBhbiBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZXMgPSBbJ2Vycm9yIDEnLCAnZXJyb3IgMiddLFxuICAgICAgICAgICAgICAgIHN1Ym1pdFJlc3VsdCA9ICRxLnJlamVjdChlcnJvck1lc3NhZ2VzKSxcbiAgICAgICAgICAgICAgICBvcGVuQXJnO1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZSwgJ3N1Ym1pdENyZWF0ZUZvcm0nKS5hbmQucmV0dXJuVmFsdWUoc3VibWl0UmVzdWx0KTtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxGYWtlKGFuZ3VsYXIubm9vcCk7XG5cbiAgICAgICAgICAgIGN0cmwuc3VibWl0KCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgb3BlbkFyZyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChvcGVuQXJnLmNvbnRlbnQpLnRvRXF1YWwoZXJyb3JNZXNzYWdlcy5qb2luKCdcXG4nKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBmb3Igc2VydmljZS5hcHBseUVycm9ycyBpZiB0aGVyZSBhcmUgdmFsaWRhdGlvbiBlcnJvcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjdHJsLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRpb25FcnJvcnMgPSBbeydzb21lRmllbGQnOiAnaW1wb3J0YW50IHZhbGlkYXRpb24gbWVzc2FnZSd9XSxcbiAgICAgICAgICAgICAgICBzdWJtaXRSZXN1bHQgPSAkcS5yZWplY3Qoe2l0ZW1zOiB2YWxpZGF0aW9uRXJyb3JzfSk7XG4gICAgICAgICAgICBzcHlPbihpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlLCAnc3VibWl0Q3JlYXRlRm9ybScpLmFuZC5yZXR1cm5WYWx1ZShzdWJtaXRSZXN1bHQpO1xuICAgICAgICAgICAgc3B5T24oZm9ybVNlcnZpY2UsICdhcHBseUVycm9ycycpLmFuZC5jYWxsRmFrZShhbmd1bGFyLm5vb3ApO1xuXG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihsb2NhbHMpO1xuICAgICAgICAgICAgY3RybC5zdWJtaXQoKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QoZm9ybVNlcnZpY2UuYXBwbHlFcnJvcnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjbGVhciBlcnJvcnMgb24gdGhlIGZvcm0gYmVmb3JlIHN1Ym1pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZSwgJ3N1Ym1pdENyZWF0ZUZvcm0nKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oe2dldE91dGNvbWU6IGFuZ3VsYXIubm9vcH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdHJsLnN1Ym1pdCgpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KG1vY2tGb3JtLmNsZWFyRXJyb3JzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ25hdmlnYXRlVG9PdXRjb21lJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBpZGVudGl0eVNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCBRdWlja0xpbmssXG4gICAgICAgICAgICBob21lT3V0Y29tZSA9ICdIT01FJyxcbiAgICAgICAgICAgIGlkZW50aXR5QXR0cmlidXRlT3V0Y29tZSA9ICdWSUVXX0lERU5USVRZJyxcbiAgICAgICAgICAgIGxvY2FscztcblxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZU91dGNvbWVOYXZpZ2F0aW9uKG91dGNvbWUsIGV4cGVjdGVkU3RhdGUpIHtcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihsb2NhbHMpLFxuICAgICAgICAgICAgICAgIGFjdHVhbEFyZ3M7XG4gICAgICAgICAgICBjdHJsLm5hdmlnYXRlVG9PdXRjb21lKG91dGNvbWUpO1xuICAgICAgICAgICAgZXhwZWN0KG5hdmlnYXRpb25TZXJ2aWNlLmdvKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBhY3R1YWxBcmdzID0gbmF2aWdhdGlvblNlcnZpY2UuZ28uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3M7XG4gICAgICAgICAgICBleHBlY3QoYWN0dWFsQXJnc1swXS5zdGF0ZSkudG9FcXVhbChleHBlY3RlZFN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9pZGVudGl0eVNlcnZpY2VfLCBfbmF2aWdhdGlvblNlcnZpY2VfLCBfUXVpY2tMaW5rXykge1xuICAgICAgICAgICAgaWRlbnRpdHlTZXJ2aWNlID0gX2lkZW50aXR5U2VydmljZV87XG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSA9IF9uYXZpZ2F0aW9uU2VydmljZV87XG4gICAgICAgICAgICBRdWlja0xpbmsgPSBfUXVpY2tMaW5rXztcbiAgICAgICAgICAgIHNweU9uKG5hdmlnYXRpb25TZXJ2aWNlLCAnZ28nKTtcbiAgICAgICAgICAgIGxvY2FscyA9IHtcbiAgICAgICAgICAgICAgICAkc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICAkc3RhdGVQYXJhbXM6ICRzdGF0ZVBhcmFtcyxcbiAgICAgICAgICAgICAgICBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1EYXRhU2VydmljZTogaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtRGF0YVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgaWRlbnRpdHlTZXJ2aWNlOiBpZGVudGl0eVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2U6IG5hdmlnYXRpb25TZXJ2aWNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIHRocm91Z2ggdG8gbmF2aWdhdGlvbiBzZXJ2aWNlIHRvIG5hdiB0byBpZGVudGl0eSBhdHRyaWJ1dGUgc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBtb2NrQWN0aW9uTWFwID0ge30sXG4gICAgICAgICAgICAgICAgbW9ja0xpbmsgPSBuZXcgUXVpY2tMaW5rKHtpZDogJ3NvbWVMaW5rJ30pO1xuICAgICAgICAgICAgbW9ja0FjdGlvbk1hcFtRdWlja0xpbmsuQWN0aW9ucy5WSUVXX0lERU5USVRZXSA9IG1vY2tMaW5rO1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAnZ2V0QXZhaWxhYmxlQWN0aW9uc01hcCcpLmFuZC5yZXR1cm5WYWx1ZShtb2NrQWN0aW9uTWFwKTtcbiAgICAgICAgICAgIHZhbGlkYXRlT3V0Y29tZU5hdmlnYXRpb24oaWRlbnRpdHlBdHRyaWJ1dGVPdXRjb21lLCAnaWRlbnRpdGllcy5pZGVudGl0eS5hdHRyaWJ1dGVzJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCB0aHJvdWdoIHRvIG5hdmlnYXRpb24gc2VydmljZSB0byBuYXYgdG8gaG9tZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFsaWRhdGVPdXRjb21lTmF2aWdhdGlvbihob21lT3V0Y29tZSwgJ2hvbWUnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNEaXJ0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIGRlbGVnYXRlIHRvIGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobG9jYWxzKTtcbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlLCAnaXNEaXJ0eScpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzRGlydHkoKSkudG9CZVRydXRoeSgpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlLmlzRGlydHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmVzZXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IG5hdmlnYXRpb25TZXJ2aWNlO1xuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9uYXZpZ2F0aW9uU2VydmljZV8pIHtcbiAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlID0gX25hdmlnYXRpb25TZXJ2aWNlXztcbiAgICAgICAgICAgIGxvY2Fscy5uYXZpZ2F0aW9uU2VydmljZSA9IG5hdmlnYXRpb25TZXJ2aWNlO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3JldHVybiBub3QgZGlydHkgYWZ0ZXIgY2FuY2VsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZm9ybURhdGEgPSB7Zm9ybUlkOiAnZm9ybTAwMScsXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrTGlua05hbWU6ICdFZGl0IElkZW50aXR5JyxcbiAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFuYWdlcjogJ3Rlc3QgbWFuYWdlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246ICdVUydcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH19LFxuICAgICAgICAgICAgICAgIGZvcm1EYXRhMSA9IHtmb3JtSWQ6ICdmb3JtMDAxJyxcbiAgICAgICAgICAgICAgICAgICAgcXVpY2tMaW5rTmFtZTogJ0VkaXQgSWRlbnRpdHknLFxuICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYW5hZ2VyOiAndGVzdCBtYW5hZ2VyMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246ICdCcmF6aWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9fSxcbiAgICAgICAgICAgICAgICBjdHJsLFxuICAgICAgICAgICAgICAgIGFjdHVhbFJlc3VsdDtcbiAgICAgICAgICAgIHNweU9uKG5hdmlnYXRpb25TZXJ2aWNlLCAnZ28nKS5hbmQuY2FsbEZha2UoYW5ndWxhci5ub29wKTtcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGxvY2Fscyk7XG4gICAgICAgICAgICBjdHJsLmZvcm1EYXRhID0gZm9ybURhdGE7XG4gICAgICAgICAgICBjdHJsLmlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybURhdGFTZXJ2aWNlLmZvcm1EYXRhID0gZm9ybURhdGExO1xuICAgICAgICAgICAgY3RybC5yZXNldCgpO1xuICAgICAgICAgICAgYWN0dWFsUmVzdWx0ID0gY3RybC5kaXNhYmxlU3VibWl0KCk7XG4gICAgICAgICAgICBleHBlY3QoYWN0dWFsUmVzdWx0KS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
