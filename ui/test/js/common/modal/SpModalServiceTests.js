System.register(['test/js/TestInitializer', 'common/modal/ModalModule'], function (_export) {

    /**
     * Tests for the spModalService.
     */
    'use strict';

    var modalModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonModalModalModule) {
            modalModule = _commonModalModalModule['default'];
        }],
        execute: function () {
            describe('spModalService', function () {

                var $q,
                    $rootScope,
                    $modal,
                    scope,
                    spModalService,
                    config,
                    $window,
                    $document,
                    $timeout,
                    modalInstance,
                    preflush,
                    title = 'My Title',
                    content = '<h1>Hi mom!</h1>',
                    id = '123456',
                    cancelBtnCSS = 'btn-cancel';

                // Let the tests know we'll use the component module.
                beforeEach(module(modalModule, function ($provide) {
                    /* This is still a bit magical, it may be related to this ui-bootstrap issue
                     * (https://github.com/angular-ui/bootstrap/issues/3633), but if we do not turn
                     * off animations the dialogs do not get removed from the dom during test.
                     * Additionally after dismissing a modal we need to manually flush $timeout */
                    $provide.decorator('$modal', function ($delegate) {
                        return {
                            open: function (options) {
                                options.animation = false;
                                return $delegate.open(options);
                            }
                        };
                    });
                }));

                /**
                 * Setup the mocks for our tests.
                 */
                /*jshint maxparams:8*/
                beforeEach(inject(function (_$q_, _$rootScope_, _$modal_, _spModal_, _$window_, _$document_, _$timeout_) {
                    var rootScopeInitialized;
                    $q = _$q_;
                    $rootScope = _$rootScope_;
                    $modal = _$modal_;
                    spModalService = _spModal_;
                    $document = _$document_;
                    $window = _$window_;
                    // focus twiddling is done asynchronously so we will have to flush the timeout service
                    $timeout = _$timeout_;
                    modalInstance = undefined;
                    preflush = false;

                    // Create a new scope that will be returned when $new is called.
                    scope = $rootScope.$new();
                    $rootScope._$new = $rootScope.$new;
                    spyOn($rootScope, '$new').and.callFake(function () {
                        if (!rootScopeInitialized) {
                            rootScopeInitialized = true;
                            return scope;
                        }
                        return this._$new();
                    });

                    // Spy on the open function of modal.
                    spyOn($modal, 'open').and.callThrough();

                    // Spy on the closeAll service function
                    spyOn(spModalService, 'closeAll').and.callThrough();

                    // Create the default config
                    config = {
                        title: title,
                        content: content,
                        id: id
                    };
                }));

                // After each test remove the modal dialog
                afterEach(function () {
                    /* Digest any remaining events */
                    scope.$apply();
                    if (modalInstance) {
                        modalInstance.close();
                        if (!preflush) {
                            $timeout.flush();
                        }
                    }
                    /* Destroy the scope created in beforeEach */
                    scope.$destroy();
                });

                describe('open', function () {

                    it('allows a null id', function () {
                        config.id = undefined;
                        modalInstance = spModalService.open(config);
                        expect(scope.dialogId).toEqual('infoModal');
                    });

                    it('throws with no title', function () {
                        config.title = undefined;
                        expect(function () {
                            spModalService.open(config);
                        }).toThrow();
                    });

                    it('throws with no content', function () {
                        config.content = undefined;
                        expect(function () {
                            spModalService.open(config);
                        }).toThrow();
                    });

                    it('creates a new scope', function () {
                        modalInstance = spModalService.open(config);
                        expect($rootScope.$new).toHaveBeenCalled();
                    });

                    it('populates the new scope', function () {
                        modalInstance = spModalService.open(config);
                        scope.$apply();
                        expect(scope.title).toEqual(title);
                        expect(scope.content).toEqual(content);
                        expect(scope.dialogId).toEqual(id);
                    });

                    it('allows title to change', function () {
                        var newTitle = 'newTitle';

                        modalInstance = spModalService.open(config);
                        scope.$apply();
                        expect(scope.title).toEqual(title);
                        modalInstance.setTitle(newTitle);
                        expect(scope.title).toEqual(newTitle);
                    });

                    it('opens a modal', function () {
                        var args;
                        modalInstance = spModalService.open(config);
                        expect($modal.open).toHaveBeenCalled();
                        args = $modal.open.calls.mostRecent().args[0];
                        expect(args.templateUrl).toEqual('util/modal-dialog.html');
                        expect(args.scope).toEqual(scope);
                    });

                    it('opens an alert modal', function () {
                        var args;
                        config.type = 'alert';
                        modalInstance = spModalService.open(config);
                        expect($modal.open).toHaveBeenCalled();
                        args = $modal.open.calls.mostRecent().args[0];
                        expect(args.templateUrl).toEqual('util/modal-alert.html');
                        expect(args.scope).toEqual(scope);
                    });

                    describe('warning levels', function () {
                        it('should have the warning class when warning level set warning', function () {
                            config.warningLevel = 'warning';
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            expect(angular.element('.warning-modal').length).toEqual(1);
                            expect(angular.element('.danger-modal').length).toEqual(0);
                        });
                        it('should have the danger class when warning level set to danger', function () {
                            config.warningLevel = 'danger';
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            expect(angular.element('.danger-modal').length).toEqual(1);
                            expect(angular.element('.alert-warning').length).toEqual(0);
                        });

                        it('should have the modal-danger class when set to error', function () {
                            config.type = 'alert';
                            config.warningLevel = 'error';
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            expect(angular.element('.modal-danger').length).toEqual(1);
                        });

                        it('should have the modal-warn class when set to warning', function () {
                            config.type = 'alert';
                            config.warningLevel = 'warning';
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            expect(angular.element('.modal-warn').length).toEqual(1);
                        });
                    });

                    describe('button actions', function () {
                        function closeActionFunction() {
                            return CLOSE_RESULT_PROMISE;
                        }

                        function dismissActionFunction() {
                            return DISMISS_RESULT_PROMISE;
                        }

                        var CLOSE_BTN_INDEX = 0,
                            DISMISS_BTN_INDEX = 1,
                            EXTRA_BTN_INDEX = 2,
                            CANCEL_BTN_INDEX = 3,
                            CLOSE_RESULT_PROMISE,
                            DISMISS_RESULT_PROMISE,
                            CLOSE_RESULT = 'dismissed by modal button',
                            DISMISS_RESULT = 'closed by modal button',
                            modalButtons,
                            dom,
                            visibleActiveElement,
                            button1 = {
                            displayValue: 'foo',
                            action: closeActionFunction,
                            close: true
                        },
                            button2 = {
                            displayValue: 'bar',
                            action: dismissActionFunction
                        },
                            button3 = {
                            displayValue: 'extra',
                            extraClass: 'some-class',
                            disabled: 'testDisabled()'
                        },
                            button4 = {
                            displayValue: 'cancel',
                            cancel: true
                        };

                        beforeEach(function () {
                            var tmp = $q.defer();
                            tmp.resolve(DISMISS_RESULT);
                            DISMISS_RESULT_PROMISE = tmp.promise;
                            tmp = $q.defer();
                            tmp.resolve(CLOSE_RESULT);
                            CLOSE_RESULT_PROMISE = tmp.promise;
                            spyOn($window, 'focus').and.callThrough();
                            dom = $document[0];
                            // Create a focusable element to be out active element
                            visibleActiveElement = dom.createElement('input');
                            dom.body.appendChild(visibleActiveElement);
                            visibleActiveElement.focus();
                        });

                        afterEach(function () {
                            // If we did not remove the element during the test remove it now
                            if (dom.body.contains(visibleActiveElement)) {
                                dom.body.removeChild(visibleActiveElement);
                            }
                        });

                        function setupDialogWithButtons() {
                            config.buttons = [button1, button2, button3, button4];
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            modalButtons = getModalButtons();
                        }

                        function getModalButtons() {
                            var modalButtons = angular.element('button');
                            // [x] + sr-only close buttons plus passed button
                            expect(modalButtons.length).toEqual(6);
                            modalButtons = modalButtons.slice(2);
                            return modalButtons;
                        }

                        it('should have buttons for each button in the config', function () {
                            setupDialogWithButtons();
                            // Catch all test to make sure everything looks sane
                            expect(scope.buttons).toBeDefined();
                            expect(scope.buttons.length).toEqual(4);
                            expect(scope.buttons[CLOSE_BTN_INDEX].displayValue).toEqual(button1.displayValue);
                            expect(scope.buttons[CLOSE_BTN_INDEX].action).toEqual(closeActionFunction);
                            expect(scope.buttons[CLOSE_BTN_INDEX].close).toBeTruthy();
                            expect(scope.buttons[DISMISS_BTN_INDEX].displayValue).toEqual(button2.displayValue);
                            expect(scope.buttons[DISMISS_BTN_INDEX].action).toEqual(dismissActionFunction);
                            expect(scope.buttons[DISMISS_BTN_INDEX].close).toBeFalsy();
                            expect(modalButtons[CLOSE_BTN_INDEX].firstChild.nodeValue).toEqual(button1.displayValue);
                            expect(modalButtons[DISMISS_BTN_INDEX].firstChild.nodeValue).toEqual(button2.displayValue);
                            expect(scope.content).toBeDefined();
                        });

                        it('should execute the the assigned function and dismiss the dialog if ' + 'a non-close button is clicked', function () {
                            var dismissSpy = jasmine.createSpy();
                            setupDialogWithButtons();
                            modalInstance.result['catch'](dismissSpy);
                            modalButtons[DISMISS_BTN_INDEX].click();
                            expect(dismissSpy).toHaveBeenCalledWith(DISMISS_RESULT);
                        });

                        it('should execute the the assigned function and close the dialog if ' + 'a close button is clicked', function () {
                            var closeSpy = jasmine.createSpy();
                            setupDialogWithButtons();
                            modalInstance.result.then(closeSpy);
                            modalButtons[CLOSE_BTN_INDEX].click();
                            expect(closeSpy).toHaveBeenCalledWith(CLOSE_RESULT);
                        });

                        it('should return focus to active element after non-close button clicked', function () {
                            visibleActiveElement.focus = jasmine.createSpy('focus');
                            // Spy on the contains function of document.
                            setupDialogWithButtons();
                            modalButtons[DISMISS_BTN_INDEX].click();
                            $timeout.flush();
                            preflush = true;
                            expect(visibleActiveElement.focus).toHaveBeenCalled();
                        });

                        it('should focus on window after non-close button clicked when ' + 'active element is removed from the dom', function () {
                            // Spy on the contains function of document.
                            setupDialogWithButtons();
                            // remove the active element we opened the dialog with
                            dom.body.removeChild(visibleActiveElement);
                            modalButtons[DISMISS_BTN_INDEX].click();
                            $timeout.flush();
                            preflush = true;
                            expect($window.focus).toHaveBeenCalled();
                        });

                        it('should return focus to active element after close button clicked', function () {
                            visibleActiveElement.focus = jasmine.createSpy('focus');
                            // Spy on the contains function of document.
                            setupDialogWithButtons();
                            modalButtons[CLOSE_BTN_INDEX].click();
                            $timeout.flush();
                            preflush = true;
                            expect(visibleActiveElement.focus).toHaveBeenCalled();
                        });

                        it('should return focus after close button clicked when ' + 'active element is removed from the dom', function () {
                            setupDialogWithButtons();
                            // remove the active element we opened the dialog with
                            dom.body.removeChild(visibleActiveElement);
                            modalButtons[CLOSE_BTN_INDEX].click();
                            $timeout.flush();
                            preflush = true;
                            expect($window.focus).toHaveBeenCalled();
                        });

                        it('should disable button if disabled value evaluates to true', function () {
                            scope.testDisabled = jasmine.createSpy().and.returnValue(true);
                            setupDialogWithButtons();
                            expect(modalButtons[EXTRA_BTN_INDEX].hasAttribute('disabled')).toBeTruthy();
                        });

                        it('should not disable button if disabled value evaluates to false', function () {
                            scope.testDisabled = jasmine.createSpy().and.returnValue(false);
                            setupDialogWithButtons();
                            expect(modalButtons[EXTRA_BTN_INDEX].hasAttribute('disabled')).toBeFalsy();
                        });

                        it('should call function if disabled is a function', function () {
                            var disabledValue = false,
                                disabledSpy = jasmine.createSpy().and.callFake(function () {
                                return disabledValue;
                            });
                            button3.disabled = disabledSpy;
                            setupDialogWithButtons();
                            expect(disabledSpy).toHaveBeenCalled();
                            expect(modalButtons[EXTRA_BTN_INDEX].hasAttribute('disabled')).toBeFalsy();
                            disabledSpy.calls.reset();
                            disabledValue = true;
                            scope.$apply();
                            expect(disabledSpy).toHaveBeenCalled();
                            expect(modalButtons[EXTRA_BTN_INDEX].hasAttribute('disabled')).toBeTruthy();
                        });

                        it('should add extraClass to button if defined', function () {
                            setupDialogWithButtons();
                            expect(angular.element(modalButtons[EXTRA_BTN_INDEX]).hasClass('some-class')).toBeTruthy();
                        });

                        it('should use cancel button css style if defined', function () {
                            setupDialogWithButtons();
                            expect(angular.element(modalButtons[CANCEL_BTN_INDEX]).hasClass(cancelBtnCSS)).toBeTruthy();
                        });
                    });

                    describe('dismiss using modal controls', function () {
                        it('should run the dismiss function if the x is clicked', function () {
                            var dismissSpy = jasmine.createSpy(),
                                xButton;
                            modalInstance = spModalService.open(config);
                            modalInstance.result['catch'](dismissSpy);
                            scope.$apply();
                            xButton = angular.element('button')[0];
                            xButton.click();
                            expect(dismissSpy).toHaveBeenCalled();
                        });

                        it('should dismiss if the sr-only close button is clicked', function () {
                            var dismissSpy = jasmine.createSpy(),
                                xButton;
                            modalInstance = spModalService.open(config);
                            modalInstance.result['catch'](dismissSpy);
                            scope.$apply();
                            xButton = angular.element('button')[1];
                            xButton.click();
                            expect(dismissSpy).toHaveBeenCalled();
                        });

                        it('should dismiss if the esc key is pressed', function () {
                            var dismissSpy = jasmine.createSpy(),
                                keyPressEvent = jQuery.Event('keydown', { which: 27 });
                            modalInstance = spModalService.open(config);
                            modalInstance.result['catch'](dismissSpy);
                            scope.$apply();
                            jQuery.event.trigger(keyPressEvent);
                            expect(dismissSpy).toHaveBeenCalled();
                        });
                    });

                    describe('auto focus', function () {
                        var browserUtil, focusedEl;

                        beforeEach(inject(function (_browserUtil_) {
                            browserUtil = _browserUtil_;
                        }));

                        function openAutoFocusModal() {
                            config.autoFocus = true;
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            $timeout.flush();
                        }

                        function expectActiveElementId(id) {
                            focusedEl = $document[0].activeElement;
                            expect(focusedEl.id).toEqual(id);
                        }

                        it('focuses on the close button when enabled', function () {
                            spyOn(browserUtil, 'isIOS').and.callFake(function () {
                                return false;
                            });

                            openAutoFocusModal();
                            expectActiveElementId('closeModalDialogBtn');
                        });

                        it('does not focus on the close button when ios', function () {
                            spyOn(browserUtil, 'isIOS').and.callFake(function () {
                                return true;
                            });

                            openAutoFocusModal();
                            expectActiveElementId('');
                        });
                    });

                    describe('isContextual config', function () {

                        function setupContextualTest(isContextual, warningLevel) {
                            config.isContextual = isContextual;
                            config.warningLevel = warningLevel;
                            modalInstance = spModalService.open(config);
                            scope.$apply();
                            $timeout.flush();
                        }

                        function expectHasIconChild() {
                            var title = angular.element('.modal-title')[0];
                            expect(title.children.length).toEqual(1);
                        }

                        function expectHasNoIconChild() {
                            var title = angular.element('.modal-title')[0];
                            expect(title.children.length).toEqual(0);
                        }

                        it('should render the icon when warning is not defined and isContextual is true', function () {
                            setupContextualTest(true, undefined);
                            expectHasIconChild();
                        });

                        it('should render the icon when warningLevel is info and isContextual is true', function () {
                            setupContextualTest(true, 'info');
                            expectHasIconChild();
                        });

                        it('should not render the icon when warningLevel is info and isContextual is falsy', function () {
                            setupContextualTest(undefined, 'info');
                            expectHasNoIconChild();
                        });

                        it('should not render the icon when warningLevel is not defined and isContextual is falsy', function () {
                            setupContextualTest(false, undefined);
                            expectHasNoIconChild();
                        });

                        it('should render the icon when warningLevel is any valid value that ' + 'is not info and usContextual is falsey', function () {
                            setupContextualTest(false, 'warning');
                            expectHasIconChild();
                        });

                        it('should render the icon when warningLevel is any valid value that ' + 'is not info and usContextual is true', function () {
                            setupContextualTest(true, 'danger');
                            expectHasIconChild();
                        });
                    });
                });

                describe('confirm', function () {

                    beforeEach(function () {
                        spyOn(spModalService, 'open');
                    });

                    it('throws with no content and no templateUrl', function () {
                        var config = {};
                        expect(function () {
                            spModalService.confirm(config);
                        }).toThrow();
                    });

                    it('throws with templateUrl but no controller', function () {
                        var config = {
                            templateUrl: 'foo'
                        };
                        expect(function () {
                            spModalService.confirm(config);
                        }).toThrow();
                    });

                    it('does not throw with templateUrl and controller but no content', function () {
                        var config = {
                            templateUrl: 'foo',
                            controller: 'fooCtrl as foo'
                        };
                        expect(function () {
                            spModalService.confirm(config);
                        }).not.toThrow();
                    });

                    it('does not throw with content but no templateUrl', function () {
                        var config = {
                            content: 'foo'
                        };
                        expect(function () {
                            spModalService.confirm(config);
                        }).not.toThrow();
                    });

                    it('calls open() with default configs', function () {
                        var config = {
                            content: 'foo bar'
                        };
                        spModalService.confirm(config);
                        expect(spModalService.open.calls.mostRecent().args[0].content).toBe(config.content);
                        expect(spModalService.open.calls.mostRecent().args[0].title).toBe('ui_modal_title_confirm');
                        expect(spModalService.open.calls.mostRecent().args[0].dialogId).toBe('confirmModal');
                        expect(spModalService.open.calls.mostRecent().args[0].warningLevel).toBeUndefined();
                        expect(spModalService.open.calls.mostRecent().args[0].buttons[0].displayValue).toBe('ui_button_cancel');
                        expect(spModalService.open.calls.mostRecent().args[0].buttons[1].displayValue).toBe('ui_button_ok');
                    });

                    it('calls open() with defined configs with content', function () {
                        var config = {
                            content: 'foo bar',
                            title: 'my title',
                            ok: 'my ok',
                            cancel: 'my cancel',
                            warningLevel: 'danger',
                            dialogId: 'specialConfirm'
                        };
                        spModalService.confirm(config);
                        expect(spModalService.open.calls.mostRecent().args[0].content).toBe(config.content);
                        expect(spModalService.open.calls.mostRecent().args[0].title).toBe(config.title);
                        expect(spModalService.open.calls.mostRecent().args[0].dialogId).toBe(config.dialogId);
                        expect(spModalService.open.calls.mostRecent().args[0].warningLevel).toBe(config.warningLevel);
                        expect(spModalService.open.calls.mostRecent().args[0].buttons[0].displayValue).toBe(config.cancel);
                        expect(spModalService.open.calls.mostRecent().args[0].buttons[1].displayValue).toBe(config.ok);
                    });

                    it('calls open() with defined configs with templateUrl', function () {
                        var config = {
                            templateUrl: 'foo',
                            controller: 'fooCtrl as foo',
                            resolve: {
                                foo: function () {
                                    return 'bar';
                                }
                            },
                            title: 'my title',
                            ok: 'my ok',
                            cancel: 'my cancel',
                            warningLevel: 'danger',
                            dialogId: 'specialConfirm'
                        };
                        spModalService.confirm(config);
                        expect(spModalService.open.calls.mostRecent().args[0].templateUrl).toBe(config.templateUrl);
                        expect(spModalService.open.calls.mostRecent().args[0].controller).toBe(config.controller);
                        expect(spModalService.open.calls.mostRecent().args[0].resolve).toBe(config.resolve);
                        expect(spModalService.open.calls.mostRecent().args[0].title).toBe(config.title);
                        expect(spModalService.open.calls.mostRecent().args[0].dialogId).toBe(config.dialogId);
                        expect(spModalService.open.calls.mostRecent().args[0].warningLevel).toBe(config.warningLevel);
                        expect(spModalService.open.calls.mostRecent().args[0].buttons[0].displayValue).toBe(config.cancel);
                        expect(spModalService.open.calls.mostRecent().args[0].buttons[1].displayValue).toBe(config.ok);
                    });
                });

                describe('closeAll', function () {
                    var config = {
                        id: '1',
                        content: 'hi mom',
                        title: 'close test'
                    },
                        config2 = {
                        id: '2',
                        content: 'hi dad',
                        title: 'close test'
                    },
                        config3 = {
                        id: '3',
                        content: 'yo bro',
                        title: 'close test'
                    };

                    it('should close multiple modals', function () {
                        var modals = [],
                            i;
                        modals.push(spModalService.open(config));
                        modals.push(spModalService.open(config2));
                        modals.push(spModalService.open(config3));

                        /* closeAll calls dismiss on each modal */
                        for (i = 0; i < modals.length; i++) {
                            spyOn(modals[i], 'dismiss').and.callThrough();
                        }
                        /* Manually cycle digest so dom is updated */
                        scope.$apply();

                        spModalService.closeAll();
                        /* Flush due to animation weirdness */
                        $timeout.flush();

                        for (i = 0; i < modals.length; i++) {
                            expect(modals[i].dismiss).toHaveBeenCalled();
                        }
                        expect(spModalService.modals.length).toBe(0);
                    });

                    it('should keep track of the number of open modals', function () {
                        var modals = [],
                            i;
                        modals.push(spModalService.open(config));
                        modals.push(spModalService.open(config2));
                        modals.push(spModalService.open(config3));

                        /* This test uses close and closeAll close closes but closeAll dismisses */
                        for (i = 0; i < modals.length; i++) {
                            spyOn(modals[i], 'close').and.callThrough();
                            spyOn(modals[i], 'dismiss').and.callThrough();
                        }
                        /* Manually cycle digest so dom is updated */
                        scope.$apply();

                        expect(spModalService.modals.length).toBe(3);
                        modals[1].close('get outta here');
                        scope.$apply();

                        expect(spModalService.modals.length).toBe(2);

                        spModalService.closeAll();
                        /* Flush due to animation weirdness */
                        $timeout.flush();

                        expect(modals[0].dismiss).toHaveBeenCalled();
                        expect(modals[1].close).toHaveBeenCalled();
                        expect(modals[2].dismiss).toHaveBeenCalled();

                        expect(spModalService.modals.length).toBe(0);
                    });

                    it('should close all modals on page change', function () {
                        var m1, m2, m3, $location;

                        inject(function (_$location_) {
                            $location = _$location_;
                        });

                        //set up dialogs just so we can make sure they close
                        m1 = spModalService.open(config);
                        m2 = spModalService.open(config2);
                        m3 = spModalService.open(config3);
                        scope.$apply();

                        expect(spModalService.modals.length).toBe(3);

                        //set our scope variable to an arbitrary location
                        $rootScope.actualLocation = '/testLocation';
                        //this setter will automatically add a slash so no slash is needed
                        $location.path('testLocation');
                        //now that the actual location and location.path are equal trigger digest cycle so that the watch method
                        //calls the closeAll method of spModalService
                        scope.$apply();
                        $timeout.flush();

                        //the SpModalService listener should have triggered and called closeAll
                        expect(spModalService.closeAll).toHaveBeenCalled();
                        expect(spModalService.modals.length).toBe(0);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9tb2RhbC9TcE1vZGFsU2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw2QkFBNkIsVUFBVSxTQUFTOzs7OztJQUt4Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGNBQWMsd0JBQXdCOztRQUUxQyxTQUFTLFlBQVk7WUFON0IsU0FBUyxrQkFBa0IsWUFBVzs7Z0JBRWxDLElBQUk7b0JBQUk7b0JBQVk7b0JBQVE7b0JBQU87b0JBQWdCO29CQUFRO29CQUFTO29CQUFXO29CQUMzRTtvQkFBZTtvQkFDZixRQUFRO29CQUNSLFVBQVU7b0JBQ1YsS0FBSztvQkFDTCxlQUFlOzs7Z0JBR25CLFdBQVcsT0FBTyxhQUFhLFVBQVMsVUFBVTs7Ozs7b0JBSzlDLFNBQVMsVUFBVSxVQUFVLFVBQVMsV0FBVzt3QkFDN0MsT0FBTzs0QkFDSCxNQUFNLFVBQVMsU0FBUztnQ0FDcEIsUUFBUSxZQUFZO2dDQUNwQixPQUFPLFVBQVUsS0FBSzs7Ozs7Ozs7OztnQkFXdEMsV0FBVyxPQUFPLFVBQVMsTUFBTSxjQUFjLFVBQVUsV0FBVyxXQUFXLGFBQWEsWUFBWTtvQkFDcEcsSUFBSTtvQkFDSixLQUFLO29CQUNMLGFBQWE7b0JBQ2IsU0FBUztvQkFDVCxpQkFBaUI7b0JBQ2pCLFlBQVk7b0JBQ1osVUFBVTs7b0JBRVYsV0FBVztvQkFDWCxnQkFBZ0I7b0JBQ2hCLFdBQVc7OztvQkFHWCxRQUFRLFdBQVc7b0JBQ25CLFdBQVcsUUFBUSxXQUFXO29CQUM5QixNQUFNLFlBQVksUUFBUSxJQUFJLFNBQVMsWUFBVzt3QkFDOUMsSUFBRyxDQUFDLHNCQUFzQjs0QkFDdEIsdUJBQXVCOzRCQUN2QixPQUFPOzt3QkFFWCxPQUFPLEtBQUs7Ozs7b0JBSWhCLE1BQU0sUUFBUSxRQUFRLElBQUk7OztvQkFHMUIsTUFBTSxnQkFB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QU8sT0FBTyxHQUFHLFNBQVM7O3dCQUUxQixPQUFPLGVBQWUsT0FBTyxRQUFRLEtBQUs7OztvQkFHOUMsR0FBRywwQ0FBMEMsWUFBVzt3QkFDcEQsSUFBSSxJQUFJLElBQUksSUFBSTs7d0JBRWhCLE9BQU8sVUFBUyxhQUFhOzRCQUN6QixZQUFZOzs7O3dCQUloQixLQUFLLGVBQWUsS0FBSzt3QkFDekIsS0FBSyxlQUFlLEtBQUs7d0JBQ3pCLEtBQUssZUFBZSxLQUFLO3dCQUN6QixNQUFNOzt3QkFFTixPQUFPLGVBQWUsT0FBTyxRQUFRLEtBQUs7Ozt3QkFHMUMsV0FBVyxpQkFBaUI7O3dCQUU1QixVQUFVLEtBQUs7Ozt3QkFHZixNQUFNO3dCQUNOLFNBQVM7Ozt3QkFHVCxPQUFPLGVBQWUsVUFBVTt3QkFDaEMsT0FBTyxlQUFlLE9BQU8sUUFBUSxLQUFLOzs7Ozs7R0FpQ25EIiwiZmlsZSI6ImNvbW1vbi9tb2RhbC9TcE1vZGFsU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgbW9kYWxNb2R1bGUgZnJvbSAnY29tbW9uL21vZGFsL01vZGFsTW9kdWxlJztcblxuLyoqXG4gKiBUZXN0cyBmb3IgdGhlIHNwTW9kYWxTZXJ2aWNlLlxuICovXG5kZXNjcmliZSgnc3BNb2RhbFNlcnZpY2UnLCBmdW5jdGlvbigpIHtcblxuICAgIHZhciAkcSwgJHJvb3RTY29wZSwgJG1vZGFsLCBzY29wZSwgc3BNb2RhbFNlcnZpY2UsIGNvbmZpZywgJHdpbmRvdywgJGRvY3VtZW50LCAkdGltZW91dCxcbiAgICAgICAgbW9kYWxJbnN0YW5jZSwgcHJlZmx1c2gsXG4gICAgICAgIHRpdGxlID0gJ015IFRpdGxlJyxcbiAgICAgICAgY29udGVudCA9ICc8aDE+SGkgbW9tITwvaDE+JyxcbiAgICAgICAgaWQgPSAnMTIzNDU2JyxcbiAgICAgICAgY2FuY2VsQnRuQ1NTID0gJ2J0bi1jYW5jZWwnO1xuXG4gICAgLy8gTGV0IHRoZSB0ZXN0cyBrbm93IHdlJ2xsIHVzZSB0aGUgY29tcG9uZW50IG1vZHVsZS5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShtb2RhbE1vZHVsZSwgZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICAgLyogVGhpcyBpcyBzdGlsbCBhIGJpdCBtYWdpY2FsLCBpdCBtYXkgYmUgcmVsYXRlZCB0byB0aGlzIHVpLWJvb3RzdHJhcCBpc3N1ZVxuICAgICAgICAgKiAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvYm9vdHN0cmFwL2lzc3Vlcy8zNjMzKSwgYnV0IGlmIHdlIGRvIG5vdCB0dXJuXG4gICAgICAgICAqIG9mZiBhbmltYXRpb25zIHRoZSBkaWFsb2dzIGRvIG5vdCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBkb20gZHVyaW5nIHRlc3QuXG4gICAgICAgICAqIEFkZGl0aW9uYWxseSBhZnRlciBkaXNtaXNzaW5nIGEgbW9kYWwgd2UgbmVlZCB0byBtYW51YWxseSBmbHVzaCAkdGltZW91dCAqL1xuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRtb2RhbCcsIGZ1bmN0aW9uKCRkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZGVsZWdhdGUub3BlbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSBtb2NrcyBmb3Igb3VyIHRlc3RzLlxuICAgICAqL1xuICAgIC8qanNoaW50IG1heHBhcmFtczo4Ki9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHFfLCBfJHJvb3RTY29wZV8sIF8kbW9kYWxfLCBfc3BNb2RhbF8sIF8kd2luZG93XywgXyRkb2N1bWVudF8sIF8kdGltZW91dF8pIHtcbiAgICAgICAgdmFyIHJvb3RTY29wZUluaXRpYWxpemVkO1xuICAgICAgICAkcSA9IF8kcV87XG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgICRtb2RhbCA9IF8kbW9kYWxfO1xuICAgICAgICBzcE1vZGFsU2VydmljZSA9IF9zcE1vZGFsXztcbiAgICAgICAgJGRvY3VtZW50ID0gXyRkb2N1bWVudF87XG4gICAgICAgICR3aW5kb3cgPSBfJHdpbmRvd187XG4gICAgICAgIC8vIGZvY3VzIHR3aWRkbGluZyBpcyBkb25lIGFzeW5jaHJvbm91c2x5IHNvIHdlIHdpbGwgaGF2ZSB0byBmbHVzaCB0aGUgdGltZW91dCBzZXJ2aWNlXG4gICAgICAgICR0aW1lb3V0ID0gXyR0aW1lb3V0XztcbiAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcHJlZmx1c2ggPSBmYWxzZTtcblxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgc2NvcGUgdGhhdCB3aWxsIGJlIHJldHVybmVkIHdoZW4gJG5ldyBpcyBjYWxsZWQuXG4gICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICRyb290U2NvcGUuXyRuZXcgPSAkcm9vdFNjb3BlLiRuZXc7XG4gICAgICAgIHNweU9uKCRyb290U2NvcGUsICckbmV3JykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIXJvb3RTY29wZUluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgcm9vdFNjb3BlSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kbmV3KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNweSBvbiB0aGUgb3BlbiBmdW5jdGlvbiBvZiBtb2RhbC5cbiAgICAgICAgc3B5T24oJG1vZGFsLCAnb3BlbicpLmFuZC5jYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgIC8vIFNweSBvbiB0aGUgY2xvc2VBbGwgc2VydmljZSBmdW5jdGlvblxuICAgICAgICBzcHlPbihzcE1vZGFsU2VydmljZSwgJ2Nsb3NlQWxsJykuYW5kLmNhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGNvbmZpZ1xuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgfSkpO1xuXG4gICAgLy8gQWZ0ZXIgZWFjaCB0ZXN0IHJlbW92ZSB0aGUgbW9kYWwgZGlhbG9nXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAvKiBEaWdlc3QgYW55IHJlbWFpbmluZyBldmVudHMgKi9cbiAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGlmKG1vZGFsSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAgICAgICAgIGlmKCFwcmVmbHVzaCkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogRGVzdHJveSB0aGUgc2NvcGUgY3JlYXRlZCBpbiBiZWZvcmVFYWNoICovXG4gICAgICAgIHNjb3BlLiRkZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3BlbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KCdhbGxvd3MgYSBudWxsIGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25maWcuaWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmRpYWxvZ0lkKS50b0VxdWFsKCdpbmZvTW9kYWwnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIHRpdGxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25maWcudGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhyb3dzIHdpdGggbm8gY29udGVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uZmlnLmNvbnRlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY3JlYXRlcyBhIG5ldyBzY29wZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTtcbiAgICAgICAgICAgIGV4cGVjdCgkcm9vdFNjb3BlLiRuZXcpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3BvcHVsYXRlcyB0aGUgbmV3IHNjb3BlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudGl0bGUpLnRvRXF1YWwodGl0bGUpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmNvbnRlbnQpLnRvRXF1YWwoY29udGVudCk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuZGlhbG9nSWQpLnRvRXF1YWwoaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWxsb3dzIHRpdGxlIHRvIGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG5ld1RpdGxlID0gJ25ld1RpdGxlJztcblxuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnRpdGxlKS50b0VxdWFsKHRpdGxlKTtcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2Uuc2V0VGl0bGUobmV3VGl0bGUpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnRpdGxlKS50b0VxdWFsKG5ld1RpdGxlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ29wZW5zIGEgbW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzO1xuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTtcbiAgICAgICAgICAgIGV4cGVjdCgkbW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgYXJncyA9ICRtb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdO1xuICAgICAgICAgICAgZXhwZWN0KGFyZ3MudGVtcGxhdGVVcmwpLnRvRXF1YWwoJ3V0aWwvbW9kYWwtZGlhbG9nLmh0bWwnKTtcbiAgICAgICAgICAgIGV4cGVjdChhcmdzLnNjb3BlKS50b0VxdWFsKHNjb3BlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ29wZW5zIGFuIGFsZXJ0IG1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncztcbiAgICAgICAgICAgIGNvbmZpZy50eXBlID0gJ2FsZXJ0JztcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UgPSBzcE1vZGFsU2VydmljZS5vcGVuKGNvbmZpZyk7XG4gICAgICAgICAgICBleHBlY3QoJG1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGFyZ3MgPSAkbW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChhcmdzLnRlbXBsYXRlVXJsKS50b0VxdWFsKCd1dGlsL21vZGFsLWFsZXJ0Lmh0bWwnKTtcbiAgICAgICAgICAgIGV4cGVjdChhcmdzLnNjb3BlKS50b0VxdWFsKHNjb3BlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3dhcm5pbmcgbGV2ZWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgdGhlIHdhcm5pbmcgY2xhc3Mgd2hlbiB3YXJuaW5nIGxldmVsIHNldCB3YXJuaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLndhcm5pbmdMZXZlbCA9ICd3YXJuaW5nJztcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoJy53YXJuaW5nLW1vZGFsJykubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoJy5kYW5nZXItbW9kYWwnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSB0aGUgZGFuZ2VyIGNsYXNzIHdoZW4gd2FybmluZyBsZXZlbCBzZXQgdG8gZGFuZ2VyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLndhcm5pbmdMZXZlbCA9ICdkYW5nZXInO1xuICAgICAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UgPSBzcE1vZGFsU2VydmljZS5vcGVuKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCgnLmRhbmdlci1tb2RhbCcpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoYW5ndWxhci5lbGVtZW50KCcuYWxlcnQtd2FybmluZycpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgdGhlIG1vZGFsLWRhbmdlciBjbGFzcyB3aGVuIHNldCB0byBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy50eXBlID0gJ2FsZXJ0JztcbiAgICAgICAgICAgICAgICBjb25maWcud2FybmluZ0xldmVsID0gJ2Vycm9yJztcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoJy5tb2RhbC1kYW5nZXInKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIHRoZSBtb2RhbC13YXJuIGNsYXNzIHdoZW4gc2V0IHRvIHdhcm5pbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25maWcudHlwZSA9ICdhbGVydCc7XG4gICAgICAgICAgICAgICAgY29uZmlnLndhcm5pbmdMZXZlbCA9ICd3YXJuaW5nJztcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoJy5tb2RhbC13YXJuJykubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdidXR0b24gYWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2xvc2VBY3Rpb25GdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ0xPU0VfUkVTVUxUX1BST01JU0U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRpc21pc3NBY3Rpb25GdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRElTTUlTU19SRVNVTFRfUFJPTUlTRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIENMT1NFX0JUTl9JTkRFWCA9IDAsXG4gICAgICAgICAgICAgICAgRElTTUlTU19CVE5fSU5ERVggPSAxLFxuICAgICAgICAgICAgICAgIEVYVFJBX0JUTl9JTkRFWCA9IDIsXG4gICAgICAgICAgICAgICAgQ0FOQ0VMX0JUTl9JTkRFWCA9IDMsXG4gICAgICAgICAgICAgICAgQ0xPU0VfUkVTVUxUX1BST01JU0UsXG4gICAgICAgICAgICAgICAgRElTTUlTU19SRVNVTFRfUFJPTUlTRSxcbiAgICAgICAgICAgICAgICBDTE9TRV9SRVNVTFQgPSAnZGlzbWlzc2VkIGJ5IG1vZGFsIGJ1dHRvbicsXG4gICAgICAgICAgICAgICAgRElTTUlTU19SRVNVTFQgPSAnY2xvc2VkIGJ5IG1vZGFsIGJ1dHRvbicsXG4gICAgICAgICAgICAgICAgbW9kYWxCdXR0b25zLFxuICAgICAgICAgICAgICAgIGRvbSxcbiAgICAgICAgICAgICAgICB2aXNpYmxlQWN0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICBidXR0b24xID0ge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VmFsdWU6ICdmb28nLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGNsb3NlQWN0aW9uRnVuY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSwgYnV0dG9uMiA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVZhbHVlOiAnYmFyJyxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBkaXNtaXNzQWN0aW9uRnVuY3Rpb25cbiAgICAgICAgICAgICAgICB9LCBidXR0b24zID0ge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VmFsdWU6ICdleHRyYScsXG4gICAgICAgICAgICAgICAgICAgIGV4dHJhQ2xhc3M6ICdzb21lLWNsYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICd0ZXN0RGlzYWJsZWQoKSdcbiAgICAgICAgICAgICAgICB9LCBidXR0b240ID0ge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VmFsdWU6ICdjYW5jZWwnLFxuICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IHRydWVcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIHRtcC5yZXNvbHZlKERJU01JU1NfUkVTVUxUKTtcbiAgICAgICAgICAgICAgICBESVNNSVNTX1JFU1VMVF9QUk9NSVNFID0gdG1wLnByb21pc2U7XG4gICAgICAgICAgICAgICAgdG1wID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICB0bXAucmVzb2x2ZShDTE9TRV9SRVNVTFQpO1xuICAgICAgICAgICAgICAgIENMT1NFX1JFU1VMVF9QUk9NSVNFID0gdG1wLnByb21pc2U7XG4gICAgICAgICAgICAgICAgc3B5T24oJHdpbmRvdywgJ2ZvY3VzJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICAgICAgZG9tID0gJGRvY3VtZW50WzBdO1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGZvY3VzYWJsZSBlbGVtZW50IHRvIGJlIG91dCBhY3RpdmUgZWxlbWVudFxuICAgICAgICAgICAgICAgIHZpc2libGVBY3RpdmVFbGVtZW50ID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgZG9tLmJvZHkuYXBwZW5kQ2hpbGQodmlzaWJsZUFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHZpc2libGVBY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIGRpZCBub3QgcmVtb3ZlIHRoZSBlbGVtZW50IGR1cmluZyB0aGUgdGVzdCByZW1vdmUgaXQgbm93XG4gICAgICAgICAgICAgICAgaWYoZG9tLmJvZHkuY29udGFpbnModmlzaWJsZUFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5ib2R5LnJlbW92ZUNoaWxkKHZpc2libGVBY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0dXBEaWFsb2dXaXRoQnV0dG9ucygpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuYnV0dG9ucyA9IFtidXR0b24xLCBidXR0b24yLCBidXR0b24zLCBidXR0b240XTtcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIG1vZGFsQnV0dG9ucyA9IGdldE1vZGFsQnV0dG9ucygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRNb2RhbEJ1dHRvbnMoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsQnV0dG9ucyA9IGFuZ3VsYXIuZWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgLy8gW3hdICsgc3Itb25seSBjbG9zZSBidXR0b25zIHBsdXMgcGFzc2VkIGJ1dHRvblxuICAgICAgICAgICAgICAgIGV4cGVjdChtb2RhbEJ1dHRvbnMubGVuZ3RoKS50b0VxdWFsKDYpO1xuICAgICAgICAgICAgICAgIG1vZGFsQnV0dG9ucyA9IG1vZGFsQnV0dG9ucy5zbGljZSgyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kYWxCdXR0b25zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgYnV0dG9ucyBmb3IgZWFjaCBidXR0b24gaW4gdGhlIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNldHVwRGlhbG9nV2l0aEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICAvLyBDYXRjaCBhbGwgdGVzdCB0byBtYWtlIHN1cmUgZXZlcnl0aGluZyBsb29rcyBzYW5lXG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmJ1dHRvbnMpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmJ1dHRvbnMubGVuZ3RoKS50b0VxdWFsKDQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5idXR0b25zW0NMT1NFX0JUTl9JTkRFWF0uZGlzcGxheVZhbHVlKS50b0VxdWFsKGJ1dHRvbjEuZGlzcGxheVZhbHVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuYnV0dG9uc1tDTE9TRV9CVE5fSU5ERVhdLmFjdGlvbikudG9FcXVhbChjbG9zZUFjdGlvbkZ1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUuYnV0dG9uc1tDTE9TRV9CVE5fSU5ERVhdLmNsb3NlKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmJ1dHRvbnNbRElTTUlTU19CVE5fSU5ERVhdLmRpc3BsYXlWYWx1ZSkudG9FcXVhbChidXR0b24yLmRpc3BsYXlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmJ1dHRvbnNbRElTTUlTU19CVE5fSU5ERVhdLmFjdGlvbikudG9FcXVhbChkaXNtaXNzQWN0aW9uRnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5idXR0b25zW0RJU01JU1NfQlROX0lOREVYXS5jbG9zZSkudG9CZUZhbHN5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KG1vZGFsQnV0dG9uc1tDTE9TRV9CVE5fSU5ERVhdLmZpcnN0Q2hpbGQubm9kZVZhbHVlKS50b0VxdWFsKGJ1dHRvbjEuZGlzcGxheVZhbHVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobW9kYWxCdXR0b25zW0RJU01JU1NfQlROX0lOREVYXS5maXJzdENoaWxkLm5vZGVWYWx1ZSkudG9FcXVhbChidXR0b24yLmRpc3BsYXlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLmNvbnRlbnQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBleGVjdXRlIHRoZSB0aGUgYXNzaWduZWQgZnVuY3Rpb24gYW5kIGRpc21pc3MgdGhlIGRpYWxvZyBpZiAnICtcbiAgICAgICAgICAgICAgICAnYSBub24tY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzbWlzc1NweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgICAgICAgICAgc2V0dXBEaWFsb2dXaXRoQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LmNhdGNoKGRpc21pc3NTcHkpO1xuICAgICAgICAgICAgICAgIG1vZGFsQnV0dG9uc1tESVNNSVNTX0JUTl9JTkRFWF0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGlzbWlzc1NweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoRElTTUlTU19SRVNVTFQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgZXhlY3V0ZSB0aGUgdGhlIGFzc2lnbmVkIGZ1bmN0aW9uIGFuZCBjbG9zZSB0aGUgZGlhbG9nIGlmICcgK1xuICAgICAgICAgICAgICAgICdhIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsb3NlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgICAgICAgICBzZXR1cERpYWxvZ1dpdGhCdXR0b25zKCk7XG4gICAgICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihjbG9zZVNweSk7XG4gICAgICAgICAgICAgICAgbW9kYWxCdXR0b25zW0NMT1NFX0JUTl9JTkRFWF0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY2xvc2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKENMT1NFX1JFU1VMVCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZm9jdXMgdG8gYWN0aXZlIGVsZW1lbnQgYWZ0ZXIgbm9uLWNsb3NlIGJ1dHRvbiBjbGlja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlzaWJsZUFjdGl2ZUVsZW1lbnQuZm9jdXMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZm9jdXMnKTtcbiAgICAgICAgICAgICAgICAvLyBTcHkgb24gdGhlIGNvbnRhaW5zIGZ1bmN0aW9uIG9mIGRvY3VtZW50LlxuICAgICAgICAgICAgICAgIHNldHVwRGlhbG9nV2l0aEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICBtb2RhbEJ1dHRvbnNbRElTTUlTU19CVE5fSU5ERVhdLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAgICAgICAgICAgICAgICBwcmVmbHVzaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHZpc2libGVBY3RpdmVFbGVtZW50LmZvY3VzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBmb2N1cyBvbiB3aW5kb3cgYWZ0ZXIgbm9uLWNsb3NlIGJ1dHRvbiBjbGlja2VkIHdoZW4gJyArXG4gICAgICAgICAgICAgICAgJ2FjdGl2ZSBlbGVtZW50IGlzIHJlbW92ZWQgZnJvbSB0aGUgZG9tJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gU3B5IG9uIHRoZSBjb250YWlucyBmdW5jdGlvbiBvZiBkb2N1bWVudC5cbiAgICAgICAgICAgICAgICBzZXR1cERpYWxvZ1dpdGhCdXR0b25zKCk7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBhY3RpdmUgZWxlbWVudCB3ZSBvcGVuZWQgdGhlIGRpYWxvZyB3aXRoXG4gICAgICAgICAgICAgICAgZG9tLmJvZHkucmVtb3ZlQ2hpbGQodmlzaWJsZUFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIG1vZGFsQnV0dG9uc1tESVNNSVNTX0JUTl9JTkRFWF0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgICAgIHByZWZsdXNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBleHBlY3QoJHdpbmRvdy5mb2N1cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZvY3VzIHRvIGFjdGl2ZSBlbGVtZW50IGFmdGVyIGNsb3NlIGJ1dHRvbiBjbGlja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlzaWJsZUFjdGl2ZUVsZW1lbnQuZm9jdXMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZm9jdXMnKTtcbiAgICAgICAgICAgICAgICAvLyBTcHkgb24gdGhlIGNvbnRhaW5zIGZ1bmN0aW9uIG9mIGRvY3VtZW50LlxuICAgICAgICAgICAgICAgIHNldHVwRGlhbG9nV2l0aEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICBtb2RhbEJ1dHRvbnNbQ0xPU0VfQlROX0lOREVYXS5jbGljaygpO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgcHJlZmx1c2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh2aXNpYmxlQWN0aXZlRWxlbWVudC5mb2N1cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZvY3VzIGFmdGVyIGNsb3NlIGJ1dHRvbiBjbGlja2VkIHdoZW4gJyArXG4gICAgICAgICAgICAgICAgJ2FjdGl2ZSBlbGVtZW50IGlzIHJlbW92ZWQgZnJvbSB0aGUgZG9tJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBEaWFsb2dXaXRoQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgYWN0aXZlIGVsZW1lbnQgd2Ugb3BlbmVkIHRoZSBkaWFsb2cgd2l0aFxuICAgICAgICAgICAgICAgIGRvbS5ib2R5LnJlbW92ZUNoaWxkKHZpc2libGVBY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICBtb2RhbEJ1dHRvbnNbQ0xPU0VfQlROX0lOREVYXS5jbGljaygpO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICAgICAgcHJlZmx1c2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV4cGVjdCgkd2luZG93LmZvY3VzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGJ1dHRvbiBpZiBkaXNhYmxlZCB2YWx1ZSBldmFsdWF0ZXMgdG8gdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnRlc3REaXNhYmxlZCA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgICAgIHNldHVwRGlhbG9nV2l0aEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobW9kYWxCdXR0b25zW0VYVFJBX0JUTl9JTkRFWF0uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgZGlzYWJsZSBidXR0b24gaWYgZGlzYWJsZWQgdmFsdWUgZXZhbHVhdGVzIHRvIGZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUudGVzdERpc2FibGVkID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNldHVwRGlhbG9nV2l0aEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobW9kYWxCdXR0b25zW0VYVFJBX0JUTl9JTkRFWF0uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKS50b0JlRmFsc3koKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGNhbGwgZnVuY3Rpb24gaWYgZGlzYWJsZWQgaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZFZhbHVlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKS5hbmQuY2FsbEZha2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlzYWJsZWRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnV0dG9uMy5kaXNhYmxlZCA9IGRpc2FibGVkU3B5O1xuICAgICAgICAgICAgICAgIHNldHVwRGlhbG9nV2l0aEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZGlzYWJsZWRTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobW9kYWxCdXR0b25zW0VYVFJBX0JUTl9JTkRFWF0uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKS50b0JlRmFsc3koKTtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZFNweS5jYWxscy5yZXNldCgpO1xuICAgICAgICAgICAgICAgIGRpc2FibGVkVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkaXNhYmxlZFNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChtb2RhbEJ1dHRvbnNbRVhUUkFfQlROX0lOREVYXS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFkZCBleHRyYUNsYXNzIHRvIGJ1dHRvbiBpZiBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBEaWFsb2dXaXRoQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQobW9kYWxCdXR0b25zW0VYVFJBX0JUTl9JTkRFWF0pLmhhc0NsYXNzKCdzb21lLWNsYXNzJykpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHVzZSBjYW5jZWwgYnV0dG9uIGNzcyBzdHlsZSBpZiBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBEaWFsb2dXaXRoQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQobW9kYWxCdXR0b25zW0NBTkNFTF9CVE5fSU5ERVhdKS5oYXNDbGFzcyhjYW5jZWxCdG5DU1MpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2Rpc21pc3MgdXNpbmcgbW9kYWwgY29udHJvbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcnVuIHRoZSBkaXNtaXNzIGZ1bmN0aW9uIGlmIHRoZSB4IGlzIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzbWlzc1NweSA9IGphc21pbmUuY3JlYXRlU3B5KCksXG4gICAgICAgICAgICAgICAgICAgIHhCdXR0b247XG4gICAgICAgICAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTtcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC5jYXRjaChkaXNtaXNzU3B5KTtcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB4QnV0dG9uID0gYW5ndWxhci5lbGVtZW50KCdidXR0b24nKVswXTtcbiAgICAgICAgICAgICAgICB4QnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRpc21pc3NTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGRpc21pc3MgaWYgdGhlIHNyLW9ubHkgY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzbWlzc1NweSA9IGphc21pbmUuY3JlYXRlU3B5KCksXG4gICAgICAgICAgICAgICAgICAgIHhCdXR0b247XG4gICAgICAgICAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTtcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC5jYXRjaChkaXNtaXNzU3B5KTtcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB4QnV0dG9uID0gYW5ndWxhci5lbGVtZW50KCdidXR0b24nKVsxXTtcbiAgICAgICAgICAgICAgICB4QnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRpc21pc3NTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGRpc21pc3MgaWYgdGhlIGVzYyBrZXkgaXMgcHJlc3NlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXNtaXNzU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UHJlc3NFdmVudCA9IGpRdWVyeS5FdmVudCgna2V5ZG93bicsIHt3aGljaDogMjd9KTtcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LmNhdGNoKGRpc21pc3NTcHkpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGpRdWVyeS5ldmVudC50cmlnZ2VyKGtleVByZXNzRXZlbnQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkaXNtaXNzU3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnYXV0byBmb2N1cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJyb3dzZXJVdGlsLCBmb2N1c2VkRWw7XG5cbiAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9icm93c2VyVXRpbF8pIHtcbiAgICAgICAgICAgICAgICBicm93c2VyVXRpbCA9IF9icm93c2VyVXRpbF87XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9wZW5BdXRvRm9jdXNNb2RhbCgpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuYXV0b0ZvY3VzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGV4cGVjdEFjdGl2ZUVsZW1lbnRJZChpZCkgIHtcbiAgICAgICAgICAgICAgICBmb2N1c2VkRWwgPSAkZG9jdW1lbnRbMF0uYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICAgICAgICBleHBlY3QoZm9jdXNlZEVsLmlkKS50b0VxdWFsKGlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXQoJ2ZvY3VzZXMgb24gdGhlIGNsb3NlIGJ1dHRvbiB3aGVuIGVuYWJsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzcHlPbihicm93c2VyVXRpbCwgJ2lzSU9TJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xuXG4gICAgICAgICAgICAgICAgb3BlbkF1dG9Gb2N1c01vZGFsKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0QWN0aXZlRWxlbWVudElkKCdjbG9zZU1vZGFsRGlhbG9nQnRuJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24gd2hlbiBpb3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzcHlPbihicm93c2VyVXRpbCwgJ2lzSU9TJykuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfSk7XG5cbiAgICAgICAgICAgICAgICBvcGVuQXV0b0ZvY3VzTW9kYWwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3RBY3RpdmVFbGVtZW50SWQoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdpc0NvbnRleHR1YWwgY29uZmlnJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldHVwQ29udGV4dHVhbFRlc3QoaXNDb250ZXh0dWFsLCB3YXJuaW5nTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuaXNDb250ZXh0dWFsID0gaXNDb250ZXh0dWFsO1xuICAgICAgICAgICAgICAgIGNvbmZpZy53YXJuaW5nTGV2ZWwgPSB3YXJuaW5nTGV2ZWw7XG4gICAgICAgICAgICAgICAgbW9kYWxJbnN0YW5jZSA9IHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnKTtcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBleHBlY3RIYXNJY29uQ2hpbGQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gYW5ndWxhci5lbGVtZW50KCcubW9kYWwtdGl0bGUnKVswXTtcbiAgICAgICAgICAgICAgICBleHBlY3QodGl0bGUuY2hpbGRyZW4ubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBleHBlY3RIYXNOb0ljb25DaGlsZCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSBhbmd1bGFyLmVsZW1lbnQoJy5tb2RhbC10aXRsZScpWzBdO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh0aXRsZS5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIGljb24gd2hlbiB3YXJuaW5nIGlzIG5vdCBkZWZpbmVkIGFuZCBpc0NvbnRleHR1YWwgaXMgdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNldHVwQ29udGV4dHVhbFRlc3QodHJ1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBleHBlY3RIYXNJY29uQ2hpbGQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHJlbmRlciB0aGUgaWNvbiB3aGVuIHdhcm5pbmdMZXZlbCBpcyBpbmZvIGFuZCBpc0NvbnRleHR1YWwgaXMgdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNldHVwQ29udGV4dHVhbFRlc3QodHJ1ZSwgJ2luZm8nKTtcbiAgICAgICAgICAgICAgICBleHBlY3RIYXNJY29uQ2hpbGQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgdGhlIGljb24gd2hlbiB3YXJuaW5nTGV2ZWwgaXMgaW5mbyBhbmQgaXNDb250ZXh0dWFsIGlzIGZhbHN5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBDb250ZXh0dWFsVGVzdCh1bmRlZmluZWQsICdpbmZvJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0SGFzTm9JY29uQ2hpbGQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgdGhlIGljb24gd2hlbiB3YXJuaW5nTGV2ZWwgaXMgbm90IGRlZmluZWQgYW5kIGlzQ29udGV4dHVhbCBpcyBmYWxzeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNldHVwQ29udGV4dHVhbFRlc3QoZmFsc2UsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0SGFzTm9JY29uQ2hpbGQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHJlbmRlciB0aGUgaWNvbiB3aGVuIHdhcm5pbmdMZXZlbCBpcyBhbnkgdmFsaWQgdmFsdWUgdGhhdCAnICtcbiAgICAgICAgICAgICAgICAnaXMgbm90IGluZm8gYW5kIHVzQ29udGV4dHVhbCBpcyBmYWxzZXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZXR1cENvbnRleHR1YWxUZXN0KGZhbHNlLCAnd2FybmluZycpO1xuICAgICAgICAgICAgICAgIGV4cGVjdEhhc0ljb25DaGlsZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBpY29uIHdoZW4gd2FybmluZ0xldmVsIGlzIGFueSB2YWxpZCB2YWx1ZSB0aGF0ICcgK1xuICAgICAgICAgICAgICAgICdpcyBub3QgaW5mbyBhbmQgdXNDb250ZXh0dWFsIGlzIHRydWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZXR1cENvbnRleHR1YWxUZXN0KHRydWUsICdkYW5nZXInKTtcbiAgICAgICAgICAgICAgICBleHBlY3RIYXNJY29uQ2hpbGQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NvbmZpcm0nLCAoKSA9PiB7XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsU2VydmljZSwgJ29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIGNvbnRlbnQgYW5kIG5vIHRlbXBsYXRlVXJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY29uZmlnID0ge307XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IHNwTW9kYWxTZXJ2aWNlLmNvbmZpcm0oY29uZmlnKTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhyb3dzIHdpdGggdGVtcGxhdGVVcmwgYnV0IG5vIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdmb28nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBzcE1vZGFsU2VydmljZS5jb25maXJtKGNvbmZpZyk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHRocm93IHdpdGggdGVtcGxhdGVVcmwgYW5kIGNvbnRyb2xsZXIgYnV0IG5vIGNvbnRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdmb28nLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdmb29DdHJsIGFzIGZvbydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IHNwTW9kYWxTZXJ2aWNlLmNvbmZpcm0oY29uZmlnKTsgfSkubm90LnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHRocm93IHdpdGggY29udGVudCBidXQgbm8gdGVtcGxhdGVVcmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJ2ZvbydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IHNwTW9kYWxTZXJ2aWNlLmNvbmZpcm0oY29uZmlnKTsgfSkubm90LnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbGxzIG9wZW4oKSB3aXRoIGRlZmF1bHQgY29uZmlncycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJ2ZvbyBiYXInXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3BNb2RhbFNlcnZpY2UuY29uZmlybShjb25maWcpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uY29udGVudCkudG9CZShjb25maWcuY29udGVudCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS50aXRsZSkudG9CZSgndWlfbW9kYWxfdGl0bGVfY29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uZGlhbG9nSWQpLnRvQmUoJ2NvbmZpcm1Nb2RhbCcpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0ud2FybmluZ0xldmVsKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5idXR0b25zWzBdLmRpc3BsYXlWYWx1ZSkudG9CZSgndWlfYnV0dG9uX2NhbmNlbCcpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uYnV0dG9uc1sxXS5kaXNwbGF5VmFsdWUpLnRvQmUoJ3VpX2J1dHRvbl9vaycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FsbHMgb3BlbigpIHdpdGggZGVmaW5lZCBjb25maWdzIHdpdGggY29udGVudCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgY29udGVudDogJ2ZvbyBiYXInLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnbXkgdGl0bGUnLFxuICAgICAgICAgICAgICAgIG9rOiAnbXkgb2snLFxuICAgICAgICAgICAgICAgIGNhbmNlbDogJ215IGNhbmNlbCcsXG4gICAgICAgICAgICAgICAgd2FybmluZ0xldmVsOiAnZGFuZ2VyJyxcbiAgICAgICAgICAgICAgICBkaWFsb2dJZDogJ3NwZWNpYWxDb25maXJtJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNwTW9kYWxTZXJ2aWNlLmNvbmZpcm0oY29uZmlnKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLmNvbnRlbnQpLnRvQmUoY29uZmlnLmNvbnRlbnQpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0udGl0bGUpLnRvQmUoY29uZmlnLnRpdGxlKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLmRpYWxvZ0lkKS50b0JlKGNvbmZpZy5kaWFsb2dJZCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS53YXJuaW5nTGV2ZWwpLnRvQmUoY29uZmlnLndhcm5pbmdMZXZlbCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5idXR0b25zWzBdLmRpc3BsYXlWYWx1ZSkudG9CZShjb25maWcuY2FuY2VsKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLmJ1dHRvbnNbMV0uZGlzcGxheVZhbHVlKS50b0JlKGNvbmZpZy5vayk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYWxscyBvcGVuKCkgd2l0aCBkZWZpbmVkIGNvbmZpZ3Mgd2l0aCB0ZW1wbGF0ZVVybCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdmb28nLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdmb29DdHJsIGFzIGZvbycsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBmb286ICgpID0+IHsgcmV0dXJuICdiYXInOyB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ215IHRpdGxlJyxcbiAgICAgICAgICAgICAgICBvazogJ215IG9rJyxcbiAgICAgICAgICAgICAgICBjYW5jZWw6ICdteSBjYW5jZWwnLFxuICAgICAgICAgICAgICAgIHdhcm5pbmdMZXZlbDogJ2RhbmdlcicsXG4gICAgICAgICAgICAgICAgZGlhbG9nSWQ6ICdzcGVjaWFsQ29uZmlybSdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzcE1vZGFsU2VydmljZS5jb25maXJtKGNvbmZpZyk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS50ZW1wbGF0ZVVybCkudG9CZShjb25maWcudGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uY29udHJvbGxlcikudG9CZShjb25maWcuY29udHJvbGxlcik7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5yZXNvbHZlKS50b0JlKGNvbmZpZy5yZXNvbHZlKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLnRpdGxlKS50b0JlKGNvbmZpZy50aXRsZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5kaWFsb2dJZCkudG9CZShjb25maWcuZGlhbG9nSWQpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0ud2FybmluZ0xldmVsKS50b0JlKGNvbmZpZy53YXJuaW5nTGV2ZWwpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWxTZXJ2aWNlLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uYnV0dG9uc1swXS5kaXNwbGF5VmFsdWUpLnRvQmUoY29uZmlnLmNhbmNlbCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2Uub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5idXR0b25zWzFdLmRpc3BsYXlWYWx1ZSkudG9CZShjb25maWcub2spO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjbG9zZUFsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGlkIDogJzEnLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQgOiAnaGkgbW9tJyxcbiAgICAgICAgICAgICAgICB0aXRsZSA6ICdjbG9zZSB0ZXN0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpZzIgPSB7XG4gICAgICAgICAgICAgICAgaWQgOiAnMicsXG4gICAgICAgICAgICAgICAgY29udGVudCA6ICdoaSBkYWQnLFxuICAgICAgICAgICAgICAgIHRpdGxlIDogJ2Nsb3NlIHRlc3QnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29uZmlnMyA9IHtcbiAgICAgICAgICAgICAgICBpZCA6ICczJyxcbiAgICAgICAgICAgICAgICBjb250ZW50IDogJ3lvIGJybycsXG4gICAgICAgICAgICAgICAgdGl0bGUgOiAnY2xvc2UgdGVzdCdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjbG9zZSBtdWx0aXBsZSBtb2RhbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbHMgPSBbXSxcbiAgICAgICAgICAgICAgICBpO1xuICAgICAgICAgICAgbW9kYWxzLnB1c2goc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpKTtcbiAgICAgICAgICAgIG1vZGFscy5wdXNoKHNwTW9kYWxTZXJ2aWNlLm9wZW4oY29uZmlnMikpO1xuICAgICAgICAgICAgbW9kYWxzLnB1c2goc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWczKSk7XG5cbiAgICAgICAgICAgIC8qIGNsb3NlQWxsIGNhbGxzIGRpc21pc3Mgb24gZWFjaCBtb2RhbCAqL1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbW9kYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3B5T24obW9kYWxzW2ldLCAnZGlzbWlzcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogTWFudWFsbHkgY3ljbGUgZGlnZXN0IHNvIGRvbSBpcyB1cGRhdGVkICovXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgc3BNb2RhbFNlcnZpY2UuY2xvc2VBbGwoKTtcbiAgICAgICAgICAgIC8qIEZsdXNoIGR1ZSB0byBhbmltYXRpb24gd2VpcmRuZXNzICovXG4gICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBtb2RhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBleHBlY3QobW9kYWxzW2ldLmRpc21pc3MpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5tb2RhbHMubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGtlZXAgdHJhY2sgb2YgdGhlIG51bWJlciBvZiBvcGVuIG1vZGFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG1vZGFscyA9IFtdLFxuICAgICAgICAgICAgICAgIGk7XG4gICAgICAgICAgICBtb2RhbHMucHVzaChzcE1vZGFsU2VydmljZS5vcGVuKGNvbmZpZykpO1xuICAgICAgICAgICAgbW9kYWxzLnB1c2goc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcyKSk7XG4gICAgICAgICAgICBtb2RhbHMucHVzaChzcE1vZGFsU2VydmljZS5vcGVuKGNvbmZpZzMpKTtcblxuICAgICAgICAgICAgLyogVGhpcyB0ZXN0IHVzZXMgY2xvc2UgYW5kIGNsb3NlQWxsIGNsb3NlIGNsb3NlcyBidXQgY2xvc2VBbGwgZGlzbWlzc2VzICovXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBtb2RhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzcHlPbihtb2RhbHNbaV0sICdjbG9zZScpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgICAgIHNweU9uKG1vZGFsc1tpXSwgJ2Rpc21pc3MnKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIE1hbnVhbGx5IGN5Y2xlIGRpZ2VzdCBzbyBkb20gaXMgdXBkYXRlZCAqL1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5tb2RhbHMubGVuZ3RoKS50b0JlKDMpO1xuICAgICAgICAgICAgbW9kYWxzWzFdLmNsb3NlKCdnZXQgb3V0dGEgaGVyZScpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5tb2RhbHMubGVuZ3RoKS50b0JlKDIpO1xuXG4gICAgICAgICAgICBzcE1vZGFsU2VydmljZS5jbG9zZUFsbCgpO1xuICAgICAgICAgICAgLyogRmx1c2ggZHVlIHRvIGFuaW1hdGlvbiB3ZWlyZG5lc3MgKi9cbiAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChtb2RhbHNbMF0uZGlzbWlzcykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGFsc1sxXS5jbG9zZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGFsc1syXS5kaXNtaXNzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5tb2RhbHMubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNsb3NlIGFsbCBtb2RhbHMgb24gcGFnZSBjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtMSwgbTIsIG0zLCAkbG9jYXRpb247XG5cbiAgICAgICAgICAgIGluamVjdChmdW5jdGlvbihfJGxvY2F0aW9uXykge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbiA9IF8kbG9jYXRpb25fO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vc2V0IHVwIGRpYWxvZ3MganVzdCBzbyB3ZSBjYW4gbWFrZSBzdXJlIHRoZXkgY2xvc2VcbiAgICAgICAgICAgIG0xID0gc3BNb2RhbFNlcnZpY2Uub3Blbihjb25maWcpO1xuICAgICAgICAgICAgbTIgPSBzcE1vZGFsU2VydmljZS5vcGVuKGNvbmZpZzIpO1xuICAgICAgICAgICAgbTMgPSBzcE1vZGFsU2VydmljZS5vcGVuKGNvbmZpZzMpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5tb2RhbHMubGVuZ3RoKS50b0JlKDMpO1xuXG4gICAgICAgICAgICAvL3NldCBvdXIgc2NvcGUgdmFyaWFibGUgdG8gYW4gYXJiaXRyYXJ5IGxvY2F0aW9uXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmFjdHVhbExvY2F0aW9uID0gJy90ZXN0TG9jYXRpb24nO1xuICAgICAgICAgICAgLy90aGlzIHNldHRlciB3aWxsIGF1dG9tYXRpY2FsbHkgYWRkIGEgc2xhc2ggc28gbm8gc2xhc2ggaXMgbmVlZGVkXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgndGVzdExvY2F0aW9uJyk7XG4gICAgICAgICAgICAvL25vdyB0aGF0IHRoZSBhY3R1YWwgbG9jYXRpb24gYW5kIGxvY2F0aW9uLnBhdGggYXJlIGVxdWFsIHRyaWdnZXIgZGlnZXN0IGN5Y2xlIHNvIHRoYXQgdGhlIHdhdGNoIG1ldGhvZFxuICAgICAgICAgICAgLy9jYWxscyB0aGUgY2xvc2VBbGwgbWV0aG9kIG9mIHNwTW9kYWxTZXJ2aWNlXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG5cbiAgICAgICAgICAgIC8vdGhlIFNwTW9kYWxTZXJ2aWNlIGxpc3RlbmVyIHNob3VsZCBoYXZlIHRyaWdnZXJlZCBhbmQgY2FsbGVkIGNsb3NlQWxsXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbFNlcnZpY2UuY2xvc2VBbGwpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsU2VydmljZS5tb2RhbHMubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
