System.register(['test/js/TestInitializer', 'identity/IdentityModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    /* jshint maxparams: 12 */
    'use strict';

    var identityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }],
        execute: function () {
            describe('ManagePasswordRowExpansionDirective', function () {
                var quickLink = 'Manage%20Passwords';
                var baseURLManagePasswords = '/ui/rest/quickLinks/' + quickLink + '/';
                var $scope = undefined,
                    $compile = undefined,
                    $provide = undefined,
                    $httpBackend = undefined,
                    managePasswordDataService = undefined,
                    managePasswordService = undefined,
                    $q = undefined,
                    spModal = undefined,
                    PasswordLink = undefined,
                    PasswordChangeError = undefined,
                    promiseTrackerService = undefined,
                    keyup = undefined,
                    PasswordChangeResultItem = undefined,
                    identityService = undefined;

                beforeEach(module(identityModule));

                beforeEach(module(function (_$provide_) {
                    $provide = _$provide_;
                    $provide.constant('SP_CURR_USER_ID', '123');
                }));

                beforeEach(inject(function (_managePasswordDataService_, _$rootScope_, _$compile_, _$httpBackend_, _PasswordLink_, _PasswordChangeError_, _promiseTrackerService_, _managePasswordService_, _$q_, _spModal_, _PasswordChangeResultItem_, _identityService_) {
                    managePasswordDataService = _managePasswordDataService_;
                    managePasswordService = _managePasswordService_;
                    $scope = _$rootScope_;
                    $compile = _$compile_;
                    $httpBackend = _$httpBackend_;
                    identityService = _identityService_;
                    $q = _$q_;
                    spModal = _spModal_;
                    PasswordLink = _PasswordLink_;
                    PasswordChangeError = _PasswordChangeError_;
                    promiseTrackerService = _promiseTrackerService_;
                    keyup = angular.element.Event('keyup');
                    PasswordChangeResultItem = _PasswordChangeResultItem_;
                }));

                function createElement() {
                    var definition = '<sp-manage-password-row-expansion sp-link="link"></sp-manage-password-row-expansion>',
                        element = $compile(definition)($scope);
                    $scope.$apply();
                    return element;
                }

                function createMockLink(status, actionStatus, identityId, linkId, appName, requiresCurrentPassword, constraintViolation) {
                    return new PasswordLink({
                        'status': status,
                        'actionStatus': actionStatus,
                        'identityId': identityId,
                        'id': linkId,
                        'applicationName': appName,
                        'requiresCurrentPassword': requiresCurrentPassword,
                        'passwordChangeErros': {
                            linkId: linkId,
                            messages: ['message1', 'message2'],
                            isConstraintsViolation: constraintViolation
                        }
                    });
                }

                function getErrorMessages(element) {
                    var errorblock = element.find('.text-danger'),
                        errorList = errorblock.find('li');
                    /* Apparently this isn't Array.map.  Whatever it is the value is the second argument to the callback */
                    return errorList.map(function (index, value) {
                        return value.innerText.trim();
                    });
                }

                function expectErrorMessages(element, button, expectedMesssages) {
                    var errorMessages = undefined,
                        i = undefined;
                    button.click();
                    errorMessages = getErrorMessages(element);
                    for (i = 0; i < expectedMesssages.length; i++) {
                        expect(errorMessages[i]).toEqual(expectedMesssages[i]);
                    }
                }

                describe('generate password button', function () {
                    it('should call generate password', function () {
                        managePasswordDataService.setQuickLinkName(quickLink);
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, false);
                        var element = createElement(),
                            generateButton = element.find('#generatePassword')[0],
                            generateURL = baseURLManagePasswords + 'identities/identityId1/links/linkId1/generatePassword';
                        $httpBackend.expectPOST(generateURL).respond(200, { object: { passwordChanges: [] } });
                        spyOn(managePasswordDataService, 'toggleLinkExpansion').and.callThrough();
                        spyOn(promiseTrackerService, 'track');
                        expect(promiseTrackerService.track).not.toHaveBeenCalled();
                        generateButton.click();
                        $httpBackend.flush();
                        $scope.$apply();
                        expect(managePasswordDataService.toggleLinkExpansion).toHaveBeenCalled();
                        expect(promiseTrackerService.track).toHaveBeenCalled();
                    });

                    it('should show non-constraint errors', function () {
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, false);
                        var element = createElement(),
                            generateButton = element.find('#generatePassword')[0],
                            messages = ['some reason'],
                            errorPromise = $q.reject(new PasswordChangeError({
                            linkId: 'linkId1',
                            messages: messages,
                            constraintsViolation: false
                        }));
                        spyOn(managePasswordService, 'generatePassword').and.returnValue(errorPromise);
                        expectErrorMessages(element, generateButton, messages);
                    });

                    it('should show constraint errors', function () {
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, true);
                        var element = createElement(),
                            generateButton = element.find('#generatePassword')[0],
                            violationMessages = ['some constraint violation', 'some other constraint violation'],
                            errorPromise = $q.reject(new PasswordChangeError({
                            linkId: 'linkId1',
                            messages: violationMessages,
                            constraintsViolation: false
                        }));
                        spyOn(managePasswordService, 'generatePassword').and.returnValue(errorPromise);
                        expectErrorMessages(element, generateButton, violationMessages);
                    });

                    it('should open work item dialog if there is a work item in the result', function () {
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, false);
                        var element = createElement(),
                            generateButton = element.find('#generatePassword')[0],
                            passwordChangePromise = $q.when(new PasswordChangeResultItem({
                            workflowWorkItemId: 'workitemid',
                            workflowWorkItemType: 'Form'
                        }));
                        spyOn(managePasswordService, 'generatePassword').and.returnValue(passwordChangePromise);
                        spyOn(identityService, 'promptWorkItemDialog');
                        spyOn(spModal, 'open').and.returnValue({ result: $q.when() });
                        generateButton.click();
                        expect(identityService.promptWorkItemDialog).toHaveBeenCalled();
                    });
                });

                describe('submit password button', function () {
                    function populatePasswordFields(element) {
                        var newPassword = element.find('#newPassword'),
                            confirmPassword = element.find('#confirmPassword');
                        angular.element(newPassword).val('12345').trigger('input');
                        angular.element(confirmPassword).val('12345').trigger('input');
                    }

                    it('should call change password', function () {
                        managePasswordDataService.setQuickLinkName(quickLink);
                        $scope.link = createMockLink('', '', 'identityId2', 'linkId2', 'app1', false, false);
                        var element = createElement(),
                            submitButton = element.find('#submitPassword')[0],
                            changeURL = baseURLManagePasswords + 'identities/identityId2/links/linkId2/changePassword';
                        populatePasswordFields(element);
                        $scope.$digest();
                        $httpBackend.expectPOST(changeURL).respond(200, { passwordChanges: [] });
                        spyOn(managePasswordDataService, 'toggleLinkExpansion').and.callThrough();
                        spyOn(promiseTrackerService, 'track');
                        spyOn(identityService, 'promptWorkItemDialog');
                        expect(promiseTrackerService.track).not.toHaveBeenCalled();
                        submitButton.click();
                        expect(promiseTrackerService.track).toHaveBeenCalled();
                        $httpBackend.flush();
                        $scope.$apply();
                        expect(managePasswordDataService.toggleLinkExpansion).toHaveBeenCalled();
                        expect(identityService.promptWorkItemDialog).not.toHaveBeenCalled();
                    });

                    it('should open work item dialog if there is a work item in the result', function () {
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, false);
                        var element = createElement(),
                            submitButton = element.find('#submitPassword')[0],
                            passwordChangePromise = $q.when({
                            status: 200,
                            data: new PasswordChangeResultItem({
                                workflowWorkItemId: 'workitemid',
                                workflowWorkItemType: 'Form'
                            })
                        });
                        populatePasswordFields(element);
                        spyOn(managePasswordService, 'changePassword').and.returnValue(passwordChangePromise);
                        spyOn(identityService, 'promptWorkItemDialog');
                        submitButton.click();
                        $scope.$apply();
                        expect(identityService.promptWorkItemDialog).toHaveBeenCalled();
                    });

                    it('should show non-constraint errors', function () {
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, false);
                        var element = createElement(),
                            sumbitButton = element.find('#submitPassword')[0],
                            messages = ['some reason'],
                            errorPromise = $q.reject(new PasswordChangeError({
                            linkId: 'linkId1',
                            messages: messages,
                            constraintsViolation: false
                        }));
                        populatePasswordFields(element);
                        spyOn(managePasswordService, 'changePassword').and.returnValue(errorPromise);
                        expectErrorMessages(element, sumbitButton, messages);
                    });

                    it('should show constraint errors', function () {
                        $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, true);
                        var element = createElement(),
                            submitButton = element.find('#submitPassword')[0],
                            violationMessages = ['some constraint violation', 'some other constraint violation'],
                            errorPromise = $q.reject(new PasswordChangeError({
                            linkId: 'linkId1',
                            messages: violationMessages,
                            constraintsViolation: false
                        }));
                        populatePasswordFields(element);
                        spyOn(managePasswordService, 'changePassword').and.returnValue(errorPromise);
                        expectErrorMessages(element, submitButton, violationMessages);
                    });

                    describe('actionStatus', function () {
                        var element = undefined,
                            submitButton = undefined;

                        beforeEach(function () {
                            $scope.link = createMockLink('', '', 'identityId1', 'linkId1', 'app1', false, false);
                            element = createElement();
                            submitButton = element.find('#submitPassword')[0];
                            populatePasswordFields(element);
                        });

                        it('should update link action status when workflow fails', function () {
                            var submitPromise = $q.when({
                                status: 200,
                                data: new PasswordChangeResultItem({
                                    workflowStatus: 'failed'
                                })
                            });
                            spyOn(managePasswordService, 'changePassword').and.returnValue(submitPromise);
                            submitButton.click();
                            $scope.$apply();
                            expect($scope.link.actionStatus).toEqual('Failed');
                        });

                        it('should update link action status when workflow complete', function () {
                            var submitPromise = $q.when({
                                status: 200,
                                data: new PasswordChangeResultItem({
                                    workflowStatus: 'complete'
                                })
                            });
                            spyOn(managePasswordService, 'changePassword').and.returnValue(submitPromise);
                            submitButton.click();
                            $scope.$apply();
                            expect($scope.link.actionStatus).toEqual('Finished');
                        });

                        it('should update link action status when workflow executing', function () {
                            var submitPromise = $q.when({
                                status: 200,
                                data: new PasswordChangeResultItem({
                                    workflowStatus: 'executing'
                                })
                            });
                            spyOn(managePasswordService, 'changePassword').and.returnValue(submitPromise);
                            submitButton.click();
                            $scope.$apply();
                            expect($scope.link.actionStatus).toEqual('Pending');
                        });
                    });
                });

                describe('show current password field', function () {
                    it('should hide current password field when current password is not required', function () {
                        $scope.link = createMockLink('', '', 'identityId', 'linkId', 'app', false, false);
                        var element = createElement();
                        $scope.$digest();
                        expect(element.find('#currentPassword').length).toEqual(0);
                    });

                    it('should hide current password field when current password is required but not for self-service', function () {
                        $scope.link = createMockLink('', '', 'identityId', 'linkId', 'app', true, false);
                        var element = createElement();
                        $scope.$digest();
                        expect(element.find('#currentPassword').length).toEqual(0);
                    });

                    it('should show current password field when current password is required and for self-service', function () {
                        $scope.link = createMockLink('', '', '123', 'linkId', 'app', true, false);
                        var element = createElement();
                        expect(element.find('#currentPassword').length).toEqual(1);
                    });
                });

                describe('show generate button', function () {
                    it('should show generate button when request is self service', function () {
                        $scope.link = createMockLink('', '', '123', 'linkId', 'app', false);
                        var element = createElement();
                        expect(element.find('#generatePassword').length).toEqual(0);
                    });

                    it('should hide generate button when request is not self service', function () {
                        $scope.link = createMockLink('', '', 'identityId', 'linkId', 'app', true);
                        var element = createElement();
                        expect(element.find('#generatePassword').length).toEqual(1);
                    });
                });

                describe('mismatched password errors', function () {
                    var PASSWORD_ONE = 'password',
                        PASSWORD_TWO = 'dorwssap';
                    var element = undefined,
                        newPassword = undefined,
                        confirmPassword = undefined,
                        row = undefined;

                    beforeEach(function () {
                        $scope.link = createMockLink();
                        element = createElement();
                        newPassword = element.find('#newPassword');
                        confirmPassword = element.find('#confirmPassword');
                        row = element.find('div')[0];
                        angular.element('body').append(element);
                    });

                    afterEach(function () {
                        element.remove();
                    });
                    function assignValue(field, value, event) {
                        if (event) {
                            field.val(value).trigger(event);
                        } else {
                            field.val(value).trigger('input');
                        }
                    }

                    it('should not be shown when only one password is entered', function () {
                        assignValue(newPassword, PASSWORD_ONE);
                        expect(element.find('.text-danger').length).toEqual(0);
                    });

                    it('should be shown when passwords do not match', function () {
                        assignValue(newPassword, PASSWORD_ONE);
                        assignValue(confirmPassword, PASSWORD_TWO, keyup);

                        expect(element.find('.text-danger').length).not.toEqual(0);
                    });

                    it('should not be shown when password fields are corrected', function () {
                        assignValue(newPassword, PASSWORD_ONE);
                        assignValue(confirmPassword, PASSWORD_TWO, keyup);
                        expect(element.find('.text-danger').length).not.toEqual(0);
                        assignValue(confirmPassword, PASSWORD_ONE, keyup);
                        expect(element.find('.text-danger').length).toEqual(0);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L01hbmFnZVBhc3N3b3JkUm93RXhwYW5zaW9uRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDRCQUE0QixVQUFVLFNBQVM7Ozs7OztJQU12Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGlCQUFpQix3QkFBd0I7O1FBRTdDLFNBQVMsWUFBWTtZQU43QixTQUFTLHVDQUF1QyxZQUFXO2dCQUN2RCxJQUFNLFlBQVk7Z0JBQ2xCLElBQU0seUJBQXNCLHlCQUEwQixZQUFTO2dCQUMvRCxJQUFJLFNBQU07b0JBQUUsV0FBUTtvQkFBRSxXQUFRO29CQUFFLGVBQVk7b0JBQUUsNEJBQXlCO29CQUFFLHdCQUFxQjtvQkFBRSxLQUFFO29CQUFFLFVBQU87b0JBQ3ZHLGVBQVk7b0JBQUUsc0JBQW1CO29CQUFFLHdCQUFxQjtvQkFBRSxRQUFLO29CQUFFLDJCQUF3QjtvQkFBRSxrQkFBZTs7Z0JBRTlHLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLFlBQVk7b0JBQ25DLFdBQVc7b0JBQ1gsU0FBUyxTQUFTLG1CQUFtQjs7O2dCQUd6QyxXQUFXLE9BQU8sVUFBUyw2QkFBNkIsY0FBYyxZQUFZLGdCQUMxRSxnQkFBZ0IsdUJBQXVCLHlCQUF5Qix5QkFBeUIsTUFBTSxXQUMvRiw0QkFBNEIsbUJBQW1CO29CQUNuRCw0QkFBNEI7b0JBQzVCLHdCQUF3QjtvQkFDeEIsU0FBUztvQkFDVCxXQUFXO29CQUNYLGVBQWU7b0JBQ2Ysa0JBQWtCO29CQUNsQixLQUFLO29CQUNMLFVBQVU7b0JBQ1YsZUFBZTtvQkFDZixzQkFBc0I7b0JBQ3RCLHdCQUF3QjtvQkFDeEIsUUFBUSxRQUFRLFFBQVEsTUFBTTtvQkFDOUIsMkJBQTJCOzs7Z0JBRy9CLFNBQVMsZ0JBQWdCO29CQUNyQixJQUFJLGFBQWE7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d0JBQ3pCLFlBQVksaUJBQWlCLGNBQWM7O3dCQUUzQyxPQUFPLFFBQVEsS0FBSyxnQkFBZ0IsUUFBUSxJQUFJLFFBQVE7OztvQkFHNUQsR0FBRywwREFBMEQsWUFBVzt3QkFDcEUsWUFBWSxhQUFhO3dCQUN6QixZQUFZLGlCQUFpQixjQUFjO3dCQUMzQyxPQUFPLFFBQVEsS0FBSyxnQkFBZ0IsUUFBUSxJQUFJLFFBQVE7d0JBQ3hELFlBQVksaUJBQWlCLGNBQWM7d0JBQzNDLE9BQU8sUUFBUSxLQUFLLGdCQUFnQixRQUFRLFFBQVE7Ozs7OztHQWM3RCIsImZpbGUiOiJpZGVudGl0eS9NYW5hZ2VQYXNzd29yZFJvd0V4cGFuc2lvbkRpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChjKSBDb3B5cmlnaHQgMjAxNi4gU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuXG4vKiBqc2hpbnQgbWF4cGFyYW1zOiAxMiAqL1xuZGVzY3JpYmUoJ01hbmFnZVBhc3N3b3JkUm93RXhwYW5zaW9uRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcXVpY2tMaW5rID0gJ01hbmFnZSUyMFBhc3N3b3Jkcyc7XG4gICAgY29uc3QgYmFzZVVSTE1hbmFnZVBhc3N3b3JkcyA9IGAvdWkvcmVzdC9xdWlja0xpbmtzLyR7cXVpY2tMaW5rfS9gO1xuICAgIGxldCAkc2NvcGUsICRjb21waWxlLCAkcHJvdmlkZSwgJGh0dHBCYWNrZW5kLCBtYW5hZ2VQYXNzd29yZERhdGFTZXJ2aWNlLCBtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICRxLCBzcE1vZGFsLFxuICAgICAgICBQYXNzd29yZExpbmssIFBhc3N3b3JkQ2hhbmdlRXJyb3IsIHByb21pc2VUcmFja2VyU2VydmljZSwga2V5dXAsIFBhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbSwgaWRlbnRpdHlTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoaWRlbnRpdHlNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKF8kcHJvdmlkZV8pIHtcbiAgICAgICAgJHByb3ZpZGUgPSBfJHByb3ZpZGVfO1xuICAgICAgICAkcHJvdmlkZS5jb25zdGFudCgnU1BfQ1VSUl9VU0VSX0lEJywgJzEyMycpO1xuICAgIH0pKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9tYW5hZ2VQYXNzd29yZERhdGFTZXJ2aWNlXywgXyRyb290U2NvcGVfLCBfJGNvbXBpbGVfLCBfJGh0dHBCYWNrZW5kXyxcbiAgICAgICAgICAgIF9QYXNzd29yZExpbmtfLCBfUGFzc3dvcmRDaGFuZ2VFcnJvcl8sIF9wcm9taXNlVHJhY2tlclNlcnZpY2VfLCBfbWFuYWdlUGFzc3dvcmRTZXJ2aWNlXywgXyRxXywgX3NwTW9kYWxfLFxuICAgICAgICAgICAgX1Bhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbV8sIF9pZGVudGl0eVNlcnZpY2VfKSB7XG4gICAgICAgIG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UgPSBfbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZV87XG4gICAgICAgIG1hbmFnZVBhc3N3b3JkU2VydmljZSA9IF9tYW5hZ2VQYXNzd29yZFNlcnZpY2VfO1xuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgJGh0dHBCYWNrZW5kID0gXyRodHRwQmFja2VuZF87XG4gICAgICAgIGlkZW50aXR5U2VydmljZSA9IF9pZGVudGl0eVNlcnZpY2VfO1xuICAgICAgICAkcSA9IF8kcV87XG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XG4gICAgICAgIFBhc3N3b3JkTGluayA9IF9QYXNzd29yZExpbmtfO1xuICAgICAgICBQYXNzd29yZENoYW5nZUVycm9yID0gX1Bhc3N3b3JkQ2hhbmdlRXJyb3JfO1xuICAgICAgICBwcm9taXNlVHJhY2tlclNlcnZpY2UgPSBfcHJvbWlzZVRyYWNrZXJTZXJ2aWNlXztcbiAgICAgICAga2V5dXAgPSBhbmd1bGFyLmVsZW1lbnQuRXZlbnQoJ2tleXVwJyk7XG4gICAgICAgIFBhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbSA9IF9QYXNzd29yZENoYW5nZVJlc3VsdEl0ZW1fO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgICAgIGxldCBkZWZpbml0aW9uID0gJzxzcC1tYW5hZ2UtcGFzc3dvcmQtcm93LWV4cGFuc2lvbiBzcC1saW5rPVwibGlua1wiPjwvc3AtbWFuYWdlLXBhc3N3b3JkLXJvdy1leHBhbnNpb24+JyxcbiAgICAgICAgICAgIGVsZW1lbnQgPSAkY29tcGlsZShkZWZpbml0aW9uKSgkc2NvcGUpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1vY2tMaW5rKHN0YXR1cywgYWN0aW9uU3RhdHVzLCBpZGVudGl0eUlkLCBsaW5rSWQsIGFwcE5hbWUsXG4gICAgICAgICAgICByZXF1aXJlc0N1cnJlbnRQYXNzd29yZCwgY29uc3RyYWludFZpb2xhdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFBhc3N3b3JkTGluayh7XG4gICAgICAgICAgICAnc3RhdHVzJzogc3RhdHVzLFxuICAgICAgICAgICAgJ2FjdGlvblN0YXR1cyc6IGFjdGlvblN0YXR1cyxcbiAgICAgICAgICAgICdpZGVudGl0eUlkJzogaWRlbnRpdHlJZCxcbiAgICAgICAgICAgICdpZCc6IGxpbmtJZCxcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbk5hbWUnOiBhcHBOYW1lLFxuICAgICAgICAgICAgJ3JlcXVpcmVzQ3VycmVudFBhc3N3b3JkJzogcmVxdWlyZXNDdXJyZW50UGFzc3dvcmQsXG4gICAgICAgICAgICAncGFzc3dvcmRDaGFuZ2VFcnJvcyc6IHtcbiAgICAgICAgICAgICAgICBsaW5rSWQ6IGxpbmtJZCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogWydtZXNzYWdlMScsICdtZXNzYWdlMiddLFxuICAgICAgICAgICAgICAgIGlzQ29uc3RyYWludHNWaW9sYXRpb246IGNvbnN0cmFpbnRWaW9sYXRpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlcyhlbGVtZW50KSB7XG4gICAgICAgIGxldCBlcnJvcmJsb2NrID0gZWxlbWVudC5maW5kKCcudGV4dC1kYW5nZXInKSxcbiAgICAgICAgICAgIGVycm9yTGlzdCA9IGVycm9yYmxvY2suZmluZCgnbGknKTtcbiAgICAgICAgLyogQXBwYXJlbnRseSB0aGlzIGlzbid0IEFycmF5Lm1hcC4gIFdoYXRldmVyIGl0IGlzIHRoZSB2YWx1ZSBpcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHRoZSBjYWxsYmFjayAqL1xuICAgICAgICByZXR1cm4gZXJyb3JMaXN0Lm1hcChmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5pbm5lclRleHQudHJpbSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBlY3RFcnJvck1lc3NhZ2VzKGVsZW1lbnQsIGJ1dHRvbiwgZXhwZWN0ZWRNZXNzc2FnZXMgKSB7XG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2VzLCBpO1xuICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgZXJyb3JNZXNzYWdlcyA9IGdldEVycm9yTWVzc2FnZXMoZWxlbWVudCk7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGV4cGVjdGVkTWVzc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBleHBlY3QoZXJyb3JNZXNzYWdlc1tpXSkudG9FcXVhbChleHBlY3RlZE1lc3NzYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXNjcmliZSgnZ2VuZXJhdGUgcGFzc3dvcmQgYnV0dG9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBnZW5lcmF0ZSBwYXNzd29yZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZS5zZXRRdWlja0xpbmtOYW1lKHF1aWNrTGluayk7XG4gICAgICAgICAgICAkc2NvcGUubGluayA9IGNyZWF0ZU1vY2tMaW5rKCcnLCAnJywgJ2lkZW50aXR5SWQxJywgJ2xpbmtJZDEnLCAnYXBwMScsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKSxcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUJ1dHRvbiA9IGVsZW1lbnQuZmluZCgnI2dlbmVyYXRlUGFzc3dvcmQnKVswXSxcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZVVSTCA9IGJhc2VVUkxNYW5hZ2VQYXNzd29yZHMgKyAnaWRlbnRpdGllcy9pZGVudGl0eUlkMS9saW5rcy9saW5rSWQxL2dlbmVyYXRlUGFzc3dvcmQnO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdFBPU1QoZ2VuZXJhdGVVUkwpLnJlc3BvbmQoMjAwLCB7b2JqZWN0OiB7cGFzc3dvcmRDaGFuZ2VzOiBbXX19KTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UsICd0b2dnbGVMaW5rRXhwYW5zaW9uJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBzcHlPbihwcm9taXNlVHJhY2tlclNlcnZpY2UsICd0cmFjaycpO1xuICAgICAgICAgICAgZXhwZWN0KHByb21pc2VUcmFja2VyU2VydmljZS50cmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGdlbmVyYXRlQnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VQYXNzd29yZERhdGFTZXJ2aWNlLnRvZ2dsZUxpbmtFeHBhbnNpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UudHJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzaG93IG5vbi1jb25zdHJhaW50IGVycm9ycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygnJywgJycsICdpZGVudGl0eUlkMScsICdsaW5rSWQxJywgJ2FwcDEnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVCdXR0b24gPSBlbGVtZW50LmZpbmQoJyNnZW5lcmF0ZVBhc3N3b3JkJylbMF0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMgPSBbJ3NvbWUgcmVhc29uJ10sXG4gICAgICAgICAgICAgICAgZXJyb3JQcm9taXNlID0gJHEucmVqZWN0KG5ldyBQYXNzd29yZENoYW5nZUVycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgbGlua0lkOiAnbGlua0lkMScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlcyxcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludHNWaW9sYXRpb246IGZhbHNlXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnZ2VuZXJhdGVQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZShlcnJvclByb21pc2UpO1xuICAgICAgICAgICAgZXhwZWN0RXJyb3JNZXNzYWdlcyhlbGVtZW50LCBnZW5lcmF0ZUJ1dHRvbiwgbWVzc2FnZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHNob3cgY29uc3RyYWludCBlcnJvcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5saW5rID0gY3JlYXRlTW9ja0xpbmsoJycsICcnLCAnaWRlbnRpdHlJZDEnLCAnbGlua0lkMScsICdhcHAxJywgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVCdXR0b24gPSBlbGVtZW50LmZpbmQoJyNnZW5lcmF0ZVBhc3N3b3JkJylbMF0sXG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uTWVzc2FnZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICdzb21lIGNvbnN0cmFpbnQgdmlvbGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NvbWUgb3RoZXIgY29uc3RyYWludCB2aW9sYXRpb24nXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBlcnJvclByb21pc2UgPSAkcS5yZWplY3QobmV3IFBhc3N3b3JkQ2hhbmdlRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBsaW5rSWQ6ICdsaW5rSWQxJyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IHZpb2xhdGlvbk1lc3NhZ2VzLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50c1Zpb2xhdGlvbjogZmFsc2VcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdnZW5lcmF0ZVBhc3N3b3JkJykuYW5kLnJldHVyblZhbHVlKGVycm9yUHJvbWlzZSk7XG4gICAgICAgICAgICBleHBlY3RFcnJvck1lc3NhZ2VzKGVsZW1lbnQsIGdlbmVyYXRlQnV0dG9uLCB2aW9sYXRpb25NZXNzYWdlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgb3BlbiB3b3JrIGl0ZW0gZGlhbG9nIGlmIHRoZXJlIGlzIGEgd29yayBpdGVtIGluIHRoZSByZXN1bHQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5saW5rID0gY3JlYXRlTW9ja0xpbmsoJycsICcnLCAnaWRlbnRpdHlJZDEnLCAnbGlua0lkMScsICdhcHAxJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpLFxuICAgICAgICAgICAgICAgIGdlbmVyYXRlQnV0dG9uID0gZWxlbWVudC5maW5kKCcjZ2VuZXJhdGVQYXNzd29yZCcpWzBdLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkQ2hhbmdlUHJvbWlzZSA9ICRxLndoZW4oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQYXNzd29yZENoYW5nZVJlc3VsdEl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dXb3JrSXRlbUlkOiAnd29ya2l0ZW1pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrZmxvd1dvcmtJdGVtVHlwZTogJ0Zvcm0nXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZVBhc3N3b3JkU2VydmljZSwgJ2dlbmVyYXRlUGFzc3dvcmQnKS5hbmQucmV0dXJuVmFsdWUocGFzc3dvcmRDaGFuZ2VQcm9taXNlKTtcbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ3Byb21wdFdvcmtJdGVtRGlhbG9nJyk7XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZSh7cmVzdWx0OiAkcS53aGVuKCl9KTtcbiAgICAgICAgICAgIGdlbmVyYXRlQnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlTZXJ2aWNlLnByb21wdFdvcmtJdGVtRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdCBwYXNzd29yZCBidXR0b24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQYXNzd29yZEZpZWxkcyhlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgbmV3UGFzc3dvcmQgPSBlbGVtZW50LmZpbmQoJyNuZXdQYXNzd29yZCcpLFxuICAgICAgICAgICAgICAgIGNvbmZpcm1QYXNzd29yZCA9IGVsZW1lbnQuZmluZCgnI2NvbmZpcm1QYXNzd29yZCcpO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KG5ld1Bhc3N3b3JkKS52YWwoJzEyMzQ1JykudHJpZ2dlcignaW5wdXQnKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChjb25maXJtUGFzc3dvcmQpLnZhbCgnMTIzNDUnKS50cmlnZ2VyKCdpbnB1dCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjYWxsIGNoYW5nZSBwYXNzd29yZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWFuYWdlUGFzc3dvcmREYXRhU2VydmljZS5zZXRRdWlja0xpbmtOYW1lKHF1aWNrTGluayk7XG4gICAgICAgICAgICAkc2NvcGUubGluayA9IGNyZWF0ZU1vY2tMaW5rKCcnLCAnJywgJ2lkZW50aXR5SWQyJywgJ2xpbmtJZDInLCAnYXBwMScsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKSxcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24gPSBlbGVtZW50LmZpbmQoJyNzdWJtaXRQYXNzd29yZCcpWzBdLFxuICAgICAgICAgICAgICAgIGNoYW5nZVVSTCA9IGJhc2VVUkxNYW5hZ2VQYXNzd29yZHMgKyAnaWRlbnRpdGllcy9pZGVudGl0eUlkMi9saW5rcy9saW5rSWQyL2NoYW5nZVBhc3N3b3JkJztcbiAgICAgICAgICAgIHBvcHVsYXRlUGFzc3dvcmRGaWVsZHMoZWxlbWVudCk7XG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdFBPU1QoY2hhbmdlVVJMKS5yZXNwb25kKDIwMCwge3Bhc3N3b3JkQ2hhbmdlczogW119KTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UsICd0b2dnbGVMaW5rRXhwYW5zaW9uJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBzcHlPbihwcm9taXNlVHJhY2tlclNlcnZpY2UsICd0cmFjaycpO1xuICAgICAgICAgICAgc3B5T24oaWRlbnRpdHlTZXJ2aWNlLCAncHJvbXB0V29ya0l0ZW1EaWFsb2cnKTtcbiAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UudHJhY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdChwcm9taXNlVHJhY2tlclNlcnZpY2UudHJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZVBhc3N3b3JkRGF0YVNlcnZpY2UudG9nZ2xlTGlua0V4cGFuc2lvbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXR5U2VydmljZS5wcm9tcHRXb3JrSXRlbURpYWxvZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBvcGVuIHdvcmsgaXRlbSBkaWFsb2cgaWYgdGhlcmUgaXMgYSB3b3JrIGl0ZW0gaW4gdGhlIHJlc3VsdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygnJywgJycsICdpZGVudGl0eUlkMScsICdsaW5rSWQxJywgJ2FwcDEnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uID0gZWxlbWVudC5maW5kKCcjc3VibWl0UGFzc3dvcmQnKVswXSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZENoYW5nZVByb21pc2UgPSAkcS53aGVuKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ldyBQYXNzd29yZENoYW5nZVJlc3VsdEl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1JZDogJ3dvcmtpdGVtaWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtmbG93V29ya0l0ZW1UeXBlOiAnRm9ybSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwb3B1bGF0ZVBhc3N3b3JkRmllbGRzKGVsZW1lbnQpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnY2hhbmdlUGFzc3dvcmQnKS5hbmQucmV0dXJuVmFsdWUocGFzc3dvcmRDaGFuZ2VQcm9taXNlKTtcbiAgICAgICAgICAgIHNweU9uKGlkZW50aXR5U2VydmljZSwgJ3Byb21wdFdvcmtJdGVtRGlhbG9nJyk7XG4gICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0eVNlcnZpY2UucHJvbXB0V29ya0l0ZW1EaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzaG93IG5vbi1jb25zdHJhaW50IGVycm9ycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygnJywgJycsICdpZGVudGl0eUlkMScsICdsaW5rSWQxJywgJ2FwcDEnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXG4gICAgICAgICAgICAgICAgc3VtYml0QnV0dG9uID0gZWxlbWVudC5maW5kKCcjc3VibWl0UGFzc3dvcmQnKVswXSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlcyA9IFsnc29tZSByZWFzb24nXSxcbiAgICAgICAgICAgICAgICBlcnJvclByb21pc2UgPSAkcS5yZWplY3QobmV3IFBhc3N3b3JkQ2hhbmdlRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBsaW5rSWQ6ICdsaW5rSWQxJyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50c1Zpb2xhdGlvbjogZmFsc2VcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBwb3B1bGF0ZVBhc3N3b3JkRmllbGRzKGVsZW1lbnQpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnY2hhbmdlUGFzc3dvcmQnKS5hbmQucmV0dXJuVmFsdWUoZXJyb3JQcm9taXNlKTtcbiAgICAgICAgICAgIGV4cGVjdEVycm9yTWVzc2FnZXMoZWxlbWVudCwgc3VtYml0QnV0dG9uLCBtZXNzYWdlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgc2hvdyBjb25zdHJhaW50IGVycm9ycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygnJywgJycsICdpZGVudGl0eUlkMScsICdsaW5rSWQxJywgJ2FwcDEnLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKSxcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24gPSBlbGVtZW50LmZpbmQoJyNzdWJtaXRQYXNzd29yZCcpWzBdLFxuICAgICAgICAgICAgICAgIHZpb2xhdGlvbk1lc3NhZ2VzID0gW1xuICAgICAgICAgICAgICAgICAgICAnc29tZSBjb25zdHJhaW50IHZpb2xhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICdzb21lIG90aGVyIGNvbnN0cmFpbnQgdmlvbGF0aW9uJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZXJyb3JQcm9taXNlID0gJHEucmVqZWN0KG5ldyBQYXNzd29yZENoYW5nZUVycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgbGlua0lkOiAnbGlua0lkMScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiB2aW9sYXRpb25NZXNzYWdlcyxcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludHNWaW9sYXRpb246IGZhbHNlXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcG9wdWxhdGVQYXNzd29yZEZpZWxkcyhlbGVtZW50KTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZVBhc3N3b3JkU2VydmljZSwgJ2NoYW5nZVBhc3N3b3JkJykuYW5kLnJldHVyblZhbHVlKGVycm9yUHJvbWlzZSk7XG4gICAgICAgICAgICBleHBlY3RFcnJvck1lc3NhZ2VzKGVsZW1lbnQsIHN1Ym1pdEJ1dHRvbiwgdmlvbGF0aW9uTWVzc2FnZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnYWN0aW9uU3RhdHVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCxcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b247XG5cbiAgICAgICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygnJywgJycsICdpZGVudGl0eUlkMScsICdsaW5rSWQxJywgJ2FwcDEnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uID0gZWxlbWVudC5maW5kKCcjc3VibWl0UGFzc3dvcmQnKVswXTtcbiAgICAgICAgICAgICAgICBwb3B1bGF0ZVBhc3N3b3JkRmllbGRzKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgdXBkYXRlIGxpbmsgYWN0aW9uIHN0YXR1cyB3aGVuIHdvcmtmbG93IGZhaWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1Ym1pdFByb21pc2UgPSAkcS53aGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3IFBhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdmYWlsZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdjaGFuZ2VQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZShzdWJtaXRQcm9taXNlKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5saW5rLmFjdGlvblN0YXR1cykudG9FcXVhbCgnRmFpbGVkJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgbGluayBhY3Rpb24gc3RhdHVzIHdoZW4gd29ya2Zsb3cgY29tcGxldGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibWl0UHJvbWlzZSA9ICRxLndoZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXcgUGFzc3dvcmRDaGFuZ2VSZXN1bHRJdGVtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrZmxvd1N0YXR1czogJ2NvbXBsZXRlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3B5T24obWFuYWdlUGFzc3dvcmRTZXJ2aWNlLCAnY2hhbmdlUGFzc3dvcmQnKS5hbmQucmV0dXJuVmFsdWUoc3VibWl0UHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCgkc2NvcGUubGluay5hY3Rpb25TdGF0dXMpLnRvRXF1YWwoJ0ZpbmlzaGVkJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgbGluayBhY3Rpb24gc3RhdHVzIHdoZW4gd29ya2Zsb3cgZXhlY3V0aW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1Ym1pdFByb21pc2UgPSAkcS53aGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3IFBhc3N3b3JkQ2hhbmdlUmVzdWx0SXRlbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3dTdGF0dXM6ICdleGVjdXRpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzcHlPbihtYW5hZ2VQYXNzd29yZFNlcnZpY2UsICdjaGFuZ2VQYXNzd29yZCcpLmFuZC5yZXR1cm5WYWx1ZShzdWJtaXRQcm9taXNlKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCRzY29wZS5saW5rLmFjdGlvblN0YXR1cykudG9FcXVhbCgnUGVuZGluZycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2hvdyBjdXJyZW50IHBhc3N3b3JkIGZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgaGlkZSBjdXJyZW50IHBhc3N3b3JkIGZpZWxkIHdoZW4gY3VycmVudCBwYXNzd29yZCBpcyBub3QgcmVxdWlyZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5saW5rID0gY3JlYXRlTW9ja0xpbmsoJycsICcnLCAnaWRlbnRpdHlJZCcsICdsaW5rSWQnLCAnYXBwJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNjdXJyZW50UGFzc3dvcmQnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGlkZSBjdXJyZW50IHBhc3N3b3JkIGZpZWxkIHdoZW4gY3VycmVudCBwYXNzd29yZCBpcyByZXF1aXJlZCBidXQgbm90IGZvciBzZWxmLXNlcnZpY2UnLFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUubGluayA9IGNyZWF0ZU1vY2tMaW5rKCcnLCAnJywgJ2lkZW50aXR5SWQnLCAnbGlua0lkJywgJ2FwcCcsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNjdXJyZW50UGFzc3dvcmQnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgc2hvdyBjdXJyZW50IHBhc3N3b3JkIGZpZWxkIHdoZW4gY3VycmVudCBwYXNzd29yZCBpcyByZXF1aXJlZCBhbmQgZm9yIHNlbGYtc2VydmljZScsXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5saW5rID0gY3JlYXRlTW9ja0xpbmsoJycsICcnLCAnMTIzJywgJ2xpbmtJZCcsICdhcHAnLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJyNjdXJyZW50UGFzc3dvcmQnKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Nob3cgZ2VuZXJhdGUgYnV0dG9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgc2hvdyBnZW5lcmF0ZSBidXR0b24gd2hlbiByZXF1ZXN0IGlzIHNlbGYgc2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygnJywgJycsICcxMjMnLCAnbGlua0lkJywgJ2FwcCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnI2dlbmVyYXRlUGFzc3dvcmQnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaGlkZSBnZW5lcmF0ZSBidXR0b24gd2hlbiByZXF1ZXN0IGlzIG5vdCBzZWxmIHNlcnZpY2UnLFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUubGluayA9IGNyZWF0ZU1vY2tMaW5rKCcnLCAnJywgJ2lkZW50aXR5SWQnLCAnbGlua0lkJywgJ2FwcCcsIHRydWUpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcjZ2VuZXJhdGVQYXNzd29yZCcpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbWlzbWF0Y2hlZCBwYXNzd29yZCBlcnJvcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgUEFTU1dPUkRfT05FID0gJ3Bhc3N3b3JkJyxcbiAgICAgICAgICAgICAgUEFTU1dPUkRfVFdPID0gJ2Rvcndzc2FwJztcbiAgICAgICAgbGV0IGVsZW1lbnQsIG5ld1Bhc3N3b3JkLCBjb25maXJtUGFzc3dvcmQsIHJvdztcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpbmsgPSBjcmVhdGVNb2NrTGluaygpO1xuICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgIG5ld1Bhc3N3b3JkID0gZWxlbWVudC5maW5kKCcjbmV3UGFzc3dvcmQnKTtcbiAgICAgICAgICAgIGNvbmZpcm1QYXNzd29yZCA9IGVsZW1lbnQuZmluZCgnI2NvbmZpcm1QYXNzd29yZCcpO1xuICAgICAgICAgICAgcm93ID0gZWxlbWVudC5maW5kKCdkaXYnKVswXTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmFwcGVuZChlbGVtZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIGFzc2lnblZhbHVlKGZpZWxkLCB2YWx1ZSwgZXZlbnQpIHtcbiAgICAgICAgICAgIGlmKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZmllbGQudmFsKHZhbHVlKS50cmlnZ2VyKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkLnZhbCh2YWx1ZSkudHJpZ2dlcignaW5wdXQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGJlIHNob3duIHdoZW4gb25seSBvbmUgcGFzc3dvcmQgaXMgZW50ZXJlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXNzaWduVmFsdWUobmV3UGFzc3dvcmQsIFBBU1NXT1JEX09ORSk7XG4gICAgICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcudGV4dC1kYW5nZXInKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgYmUgc2hvd24gd2hlbiBwYXNzd29yZHMgZG8gbm90IG1hdGNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhc3NpZ25WYWx1ZShuZXdQYXNzd29yZCwgUEFTU1dPUkRfT05FKTtcbiAgICAgICAgICAgIGFzc2lnblZhbHVlKGNvbmZpcm1QYXNzd29yZCwgUEFTU1dPUkRfVFdPLCBrZXl1cCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy50ZXh0LWRhbmdlcicpLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGJlIHNob3duIHdoZW4gcGFzc3dvcmQgZmllbGRzIGFyZSBjb3JyZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFzc2lnblZhbHVlKG5ld1Bhc3N3b3JkLCBQQVNTV09SRF9PTkUpO1xuICAgICAgICAgICAgYXNzaWduVmFsdWUoY29uZmlybVBhc3N3b3JkLCBQQVNTV09SRF9UV08sIGtleXVwKTtcbiAgICAgICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy50ZXh0LWRhbmdlcicpLmxlbmd0aCkubm90LnRvRXF1YWwoMCk7XG4gICAgICAgICAgICBhc3NpZ25WYWx1ZShjb25maXJtUGFzc3dvcmQsIFBBU1NXT1JEX09ORSwga2V5dXApO1xuICAgICAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLnRleHQtZGFuZ2VyJykubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
