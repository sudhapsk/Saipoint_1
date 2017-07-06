System.register(['certification/CertificationModule', 'test/js/TestInitializer', 'test/js/common/i18n/MockTranslateFilter', 'test/js/TestModule'], function (_export) {
    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}, function (_testJsCommonI18nMockTranslateFilter) {}, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('CertificationSaveButtonDirective', function () {

                var elementDefinition = '<sp-certification-save-button sp-enabled="enabled"\n                                     sp-decision-count="decisionCount"\n                                     sp-refresh-trigger="refreshTrigger"\n                                     sp-save-func="saveFunc()" />';

                var $scope = undefined,
                    $compile = undefined,
                    $document = undefined,
                    certificationDataService = undefined,
                    spTranslateFilter = undefined,
                    enabled = undefined,
                    decisionCount = undefined,
                    saveFunc = undefined,
                    processRevokesImmediately = undefined,
                    hasBulkDecisions = undefined,
                    refreshTrigger = undefined;

                beforeEach(module(certificationModule, testModule));

                beforeEach(inject(function ($rootScope, _$compile_, _$document_, _certificationDataService_, _spTranslateFilter_, testService) {
                    // Save dependencies.
                    $scope = $rootScope.$new();
                    $compile = _$compile_;
                    $document = _$document_;
                    certificationDataService = _certificationDataService_;
                    spTranslateFilter = _spTranslateFilter_;

                    // Initialize values.
                    enabled = true;
                    decisionCount = 5;
                    saveFunc = testService.createPromiseSpy(false, {}, {});
                    processRevokesImmediately = true;
                    hasBulkDecisions = true;

                    refreshTrigger = {
                        refresh: jasmine.createSpy('refresh')
                    };

                    spyOn(certificationDataService, 'getConfiguration').and.callFake(function () {
                        return {
                            processRevokesImmediately: processRevokesImmediately
                        };
                    });

                    spyOn(certificationDataService.decisions, 'hasBulkDecisions').and.callFake(function () {
                        return hasBulkDecisions;
                    });

                    // Setup the mock message catalog.
                    spTranslateFilter.configureCatalog({
                        'ui_cert_save_decisions': 'Save Decisions',
                        'ui_cert_save_x_decisions': 'Save {0} Decisions'
                    });
                }));

                function createElement() {
                    var element = angular.element(elementDefinition);
                    $scope.enabled = enabled;
                    $scope.decisionCount = decisionCount;
                    $scope.saveFunc = saveFunc;
                    $scope.refreshTrigger = refreshTrigger;
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                function getSaveButton(element) {
                    var saveBtn = element.find('#certSaveBtn');
                    expect(saveBtn.length).toEqual(1);
                    return angular.element(saveBtn[0]);
                }

                describe('enabled', function () {
                    it('renders a disabled button when false', function () {
                        enabled = false;
                        var btn = createElement();
                        expect(getSaveButton(btn).attr('disabled')).toEqual('disabled');
                    });

                    it('renders an enabled button when true', function () {
                        var btn = createElement();
                        expect(getSaveButton(btn).attr('disabled')).toBeUndefined();
                    });
                });

                describe('decision count', function () {
                    it('is displayed when the button is enabled', function () {
                        var btn = getSaveButton(createElement());
                        expect(btn.text().trim()).toEqual('Save 5 Decisions');
                    });

                    it('is not displayed when the button is disabled', function () {
                        enabled = false;
                        var btn = getSaveButton(createElement());
                        expect(btn.text().trim()).toEqual('Save Decisions');
                    });
                });

                describe('document listener', function () {
                    it('is registered when the component is created', function () {
                        spyOn($document, 'on');
                        createElement();
                        expect($document.on).toHaveBeenCalled();
                    });
                });

                function getConfirmation(element) {
                    var popover = element.find('.popover');
                    expect(popover.length).toEqual(1);
                    return angular.element(popover[0]);
                }

                function isConfirmationDisplayed(confirmation) {
                    expect(confirmation.hasClass('fade')).toEqual(true);
                    return confirmation.hasClass('in');
                }

                describe('save button', function () {
                    function testSaveButton(revokeImmediately, hasBulk, expectConfirmation) {
                        // Setup the mocks.
                        processRevokesImmediately = revokeImmediately;
                        hasBulkDecisions = hasBulk;

                        // Create the element and click the save button.
                        var el = createElement();
                        var btn = getSaveButton(el);
                        btn.click();

                        // Save function should be called immediately if there is no confirmation.
                        if (!expectConfirmation) {
                            expect(saveFunc).toHaveBeenCalled();
                        } else {
                            // If there is a confirmation, the save function should not be called.
                            expect(saveFunc).not.toHaveBeenCalled();

                            // Verify that the confirmation is shown.
                            var _confirm = getConfirmation(el);
                            expect(_confirm).toBeDefined();
                            expect(isConfirmationDisplayed(_confirm)).toEqual(true);
                        }
                    }

                    it('calls the saveFunc when not processing revokes immediately', function () {
                        testSaveButton(false, true, false);
                    });

                    it('calls the saveFunc when there are no bulk decisions', function () {
                        testSaveButton(true, false, false);
                    });

                    it('shows the confirmation popup when processing revokes immediately and there are bulk decisions', function () {
                        testSaveButton(true, true, true);
                    });

                    it('calls the refreshTrigger', function () {
                        testSaveButton(false, false, false);
                        expect(refreshTrigger.refresh).toHaveBeenCalled();
                    });
                });

                describe('confirmation', function () {
                    var el = undefined,
                        confirmation = undefined;

                    // Start each test with a displayed confirmation.
                    beforeEach(function () {
                        el = createElement();
                        getSaveButton(el).click();
                        confirmation = getConfirmation(el);
                        expect(isConfirmationDisplayed(confirmation)).toEqual(true);
                    });

                    it('is hidden when clicking save button again', function () {
                        getSaveButton(el).click();
                        expect(isConfirmationDisplayed(confirmation)).toEqual(false);
                    });

                    it('is hidden when clicking on the document', function () {
                        angular.element($document[0].body).trigger('click');
                        $scope.$digest();
                        expect(isConfirmationDisplayed(confirmation)).toEqual(false);
                    });

                    it('is hidden when clicking the cancel button', function () {
                        var cancel = el.find('.btn-white');
                        cancel.click();
                        expect(isConfirmationDisplayed(confirmation)).toEqual(false);
                    });

                    it('hides the confirmation and saves when clicking the save button', function () {
                        var save = el.find('.btn-info');
                        save.click();
                        expect(isConfirmationDisplayed(confirmation)).toEqual(false);
                        expect(saveFunc).toHaveBeenCalled();
                    });

                    function getDecisionText(row) {
                        var span = angular.element(row).find('span');
                        expect(span.length).toEqual(1);
                        return span.text().trim();
                    }

                    function getDecisionCount(row) {
                        var span = angular.element(row).find('b');
                        expect(span.length).toEqual(1);
                        return span.text().trim();
                    }

                    it('displays each status and count, sorted alphabetically', function () {
                        // Return some decision counts.
                        var decisionCounts = new Map();
                        decisionCounts.set('aLabel', 7);
                        decisionCounts.set('anotherLabel', 17);
                        spyOn(certificationDataService.decisions, 'getCountsByDecision').and.callFake(function () {
                            return decisionCounts;
                        });

                        // Configure message keys that will flip the order of the array.
                        spTranslateFilter.configureCatalog({
                            'cert_action_a_label': 'XXX',
                            'cert_action_another_label': 'AAA',
                            'cert_action_yet_another_label': 'BBB'
                        });

                        // Digest to get the new decisions applied.
                        $scope.$digest();
                        expect(certificationDataService.decisions.getCountsByDecision).toHaveBeenCalled();

                        // Get the rows.
                        var rows = el.find('p');

                        // Check em out.
                        expect(rows.length).toEqual(2);
                        expect(getDecisionText(rows[0])).toEqual('AAA');
                        expect(getDecisionCount(rows[0])).toEqual('17');
                        expect(getDecisionText(rows[1])).toEqual('XXX');
                        expect(getDecisionCount(rows[1])).toEqual('7');

                        // Change the counts by decision and make sure that the rows get updated.
                        decisionCounts.set('yetAnotherLabel', 78);
                        $scope.$digest();

                        rows = el.find('p');
                        expect(rows.length).toEqual(3);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvblNhdmVCdXR0b25EaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQyxxQ0FBcUMsMkJBQTJCLDJDQUEyQyx1QkFBdUIsVUFBVSxTQUFTO0lBQ2xLOztJQUVBLElBQUkscUJBQXFCO0lBQ3pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSxtQ0FBbUM7WUFDbkQsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QixJQUFJLFVBQVUsc0NBQXNDLElBQUksVUFBVSxtQkFBbUI7WUFDdEgsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxvQ0FBb0MsWUFBTTs7Z0JBRS9DLElBQUksb0JBQWlCOztnQkFNckIsSUFBSSxTQUFNO29CQUFFLFdBQVE7b0JBQUUsWUFBUztvQkFBRSwyQkFBd0I7b0JBQUUsb0JBQWlCO29CQUFFLFVBQU87b0JBQUUsZ0JBQWE7b0JBQUUsV0FBUTtvQkFDMUcsNEJBQXlCO29CQUFFLG1CQUFnQjtvQkFBRSxpQkFBYzs7Z0JBRS9ELFdBQVcsT0FBTyxxQkFBcUI7O2dCQUV2QyxXQUFXLE9BQU8sVUFBQyxZQUFZLFlBQVksYUFBYSw0QkFBNEIscUJBQ2pFLGFBQWdCOztvQkFFL0IsU0FBUyxXQUFXO29CQUNwQixXQUFXO29CQUNYLFlBQVk7b0JBQ1osMkJBQTJCO29CQUMzQixvQkFBb0I7OztvQkFHcEIsVUFBVTtvQkFDVixnQkFBZ0I7b0JBQ2hCLFdBQVcsWUFBWSxpQkFBaUIsT0FBTyxJQUFJO29CQUNuRCw0QkFBNEI7b0JBQzVCLG1CQUFtQjs7b0JBRW5CLGlCQUFpQjt3QkFDYixTQUFTLFFBQVEsVUFBVTs7O29CQUcvQixNQUFNLDBCQUEwQixvQkFBb0IsSUFBSSxTQUFTLFlBQU07d0JBQ25FLE9BQU87NEJBQ0gsMkJBQTJCOzs7O29CQUluQyxNQUFNLHlCQUF5QixXQUFXLG9CQUFvQixJQUFJLFNB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QUssS0FBSyxRQUFROzs7d0JBRzFDLGVBQWUsSUFBSSxtQkFBbUI7d0JBQ3RDLE9BQU87O3dCQUVQLE9BQU8sR0FBRyxLQUFLO3dCQUNmLE9BQU8sS0FBSyxRQUFRLFFBQVE7Ozs7OztHQW1CckMiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uU2F2ZUJ1dHRvbkRpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCAndGVzdC9qcy9jb21tb24vaTE4bi9Nb2NrVHJhbnNsYXRlRmlsdGVyJztcclxuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdDZXJ0aWZpY2F0aW9uU2F2ZUJ1dHRvbkRpcmVjdGl2ZScsICgpID0+IHtcclxuXHJcbiAgICBsZXQgZWxlbWVudERlZmluaXRpb24gPVxyXG4gICAgICBgPHNwLWNlcnRpZmljYXRpb24tc2F2ZS1idXR0b24gc3AtZW5hYmxlZD1cImVuYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3AtZGVjaXNpb24tY291bnQ9XCJkZWNpc2lvbkNvdW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwLXJlZnJlc2gtdHJpZ2dlcj1cInJlZnJlc2hUcmlnZ2VyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwLXNhdmUtZnVuYz1cInNhdmVGdW5jKClcIiAvPmA7XHJcblxyXG4gICAgbGV0ICRzY29wZSwgJGNvbXBpbGUsICRkb2N1bWVudCwgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCBzcFRyYW5zbGF0ZUZpbHRlciwgZW5hYmxlZCwgZGVjaXNpb25Db3VudCwgc2F2ZUZ1bmMsXHJcbiAgICAgICAgcHJvY2Vzc1Jldm9rZXNJbW1lZGlhdGVseSwgaGFzQnVsa0RlY2lzaW9ucywgcmVmcmVzaFRyaWdnZXI7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSwgdGVzdE1vZHVsZSkpO1xyXG5cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KCgkcm9vdFNjb3BlLCBfJGNvbXBpbGVfLCBfJGRvY3VtZW50XywgX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV8sIF9zcFRyYW5zbGF0ZUZpbHRlcl8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGVzdFNlcnZpY2UpID0+IHtcclxuICAgICAgICAvLyBTYXZlIGRlcGVuZGVuY2llcy5cclxuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XHJcbiAgICAgICAgJGRvY3VtZW50ID0gXyRkb2N1bWVudF87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV87XHJcbiAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIgPSBfc3BUcmFuc2xhdGVGaWx0ZXJfO1xyXG5cclxuICAgICAgICAvLyBJbml0aWFsaXplIHZhbHVlcy5cclxuICAgICAgICBlbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBkZWNpc2lvbkNvdW50ID0gNTtcclxuICAgICAgICBzYXZlRnVuYyA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHt9LCB7fSk7XHJcbiAgICAgICAgcHJvY2Vzc1Jldm9rZXNJbW1lZGlhdGVseSA9IHRydWU7XHJcbiAgICAgICAgaGFzQnVsa0RlY2lzaW9ucyA9IHRydWU7XHJcblxyXG4gICAgICAgIHJlZnJlc2hUcmlnZ2VyID0ge1xyXG4gICAgICAgICAgICByZWZyZXNoOiBqYXNtaW5lLmNyZWF0ZVNweSgncmVmcmVzaCcpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLCAnZ2V0Q29uZmlndXJhdGlvbicpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzUmV2b2tlc0ltbWVkaWF0ZWx5OiBwcm9jZXNzUmV2b2tlc0ltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMsICdoYXNCdWxrRGVjaXNpb25zJykuYW5kLmNhbGxGYWtlKCgpID0+IGhhc0J1bGtEZWNpc2lvbnMpO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCB0aGUgbW9jayBtZXNzYWdlIGNhdGFsb2cuXHJcbiAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIuY29uZmlndXJlQ2F0YWxvZyh7XHJcbiAgICAgICAgICAgICd1aV9jZXJ0X3NhdmVfZGVjaXNpb25zJzogJ1NhdmUgRGVjaXNpb25zJyxcclxuICAgICAgICAgICAgJ3VpX2NlcnRfc2F2ZV94X2RlY2lzaW9ucyc6ICdTYXZlIHswfSBEZWNpc2lvbnMnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XHJcbiAgICAgICAgJHNjb3BlLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICRzY29wZS5kZWNpc2lvbkNvdW50ID0gZGVjaXNpb25Db3VudDtcclxuICAgICAgICAkc2NvcGUuc2F2ZUZ1bmMgPSBzYXZlRnVuYztcclxuICAgICAgICAkc2NvcGUucmVmcmVzaFRyaWdnZXIgPSByZWZyZXNoVHJpZ2dlcjtcclxuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRTYXZlQnV0dG9uKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgc2F2ZUJ0biA9IGVsZW1lbnQuZmluZCgnI2NlcnRTYXZlQnRuJyk7XHJcbiAgICAgICAgZXhwZWN0KHNhdmVCdG4ubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoc2F2ZUJ0blswXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzY3JpYmUoJ2VuYWJsZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JlbmRlcnMgYSBkaXNhYmxlZCBidXR0b24gd2hlbiBmYWxzZScsICgpID0+IHtcclxuICAgICAgICAgICAgZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYnRuID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZ2V0U2F2ZUJ1dHRvbihidG4pLmF0dHIoJ2Rpc2FibGVkJykpLnRvRXF1YWwoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW5kZXJzIGFuIGVuYWJsZWQgYnV0dG9uIHdoZW4gdHJ1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ0biA9IGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGdldFNhdmVCdXR0b24oYnRuKS5hdHRyKCdkaXNhYmxlZCcpKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGVjaXNpb24gY291bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2lzIGRpc3BsYXllZCB3aGVuIHRoZSBidXR0b24gaXMgZW5hYmxlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ0biA9IGdldFNhdmVCdXR0b24oY3JlYXRlRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgZXhwZWN0KGJ0bi50ZXh0KCkudHJpbSgpKS50b0VxdWFsKCdTYXZlIDUgRGVjaXNpb25zJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBub3QgZGlzcGxheWVkIHdoZW4gdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYnRuID0gZ2V0U2F2ZUJ1dHRvbihjcmVhdGVFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICBleHBlY3QoYnRuLnRleHQoKS50cmltKCkpLnRvRXF1YWwoJ1NhdmUgRGVjaXNpb25zJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZG9jdW1lbnQgbGlzdGVuZXInLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2lzIHJlZ2lzdGVyZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGNyZWF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNweU9uKCRkb2N1bWVudCwgJ29uJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KCRkb2N1bWVudC5vbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29uZmlybWF0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgcG9wb3ZlciA9IGVsZW1lbnQuZmluZCgnLnBvcG92ZXInKTtcclxuICAgICAgICBleHBlY3QocG9wb3Zlci5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChwb3BvdmVyWzBdKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0NvbmZpcm1hdGlvbkRpc3BsYXllZChjb25maXJtYXRpb24pIHtcclxuICAgICAgICBleHBlY3QoY29uZmlybWF0aW9uLmhhc0NsYXNzKCdmYWRlJykpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbmZpcm1hdGlvbi5oYXNDbGFzcygnaW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZSgnc2F2ZSBidXR0b24nLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gdGVzdFNhdmVCdXR0b24ocmV2b2tlSW1tZWRpYXRlbHksIGhhc0J1bGssIGV4cGVjdENvbmZpcm1hdGlvbikge1xyXG4gICAgICAgICAgICAvLyBTZXR1cCB0aGUgbW9ja3MuXHJcbiAgICAgICAgICAgIHByb2Nlc3NSZXZva2VzSW1tZWRpYXRlbHkgPSByZXZva2VJbW1lZGlhdGVseTtcclxuICAgICAgICAgICAgaGFzQnVsa0RlY2lzaW9ucyA9IGhhc0J1bGs7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGVsZW1lbnQgYW5kIGNsaWNrIHRoZSBzYXZlIGJ1dHRvbi5cclxuICAgICAgICAgICAgbGV0IGVsID0gY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBsZXQgYnRuID0gZ2V0U2F2ZUJ1dHRvbihlbCk7XHJcbiAgICAgICAgICAgIGJ0bi5jbGljaygpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2F2ZSBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIGltbWVkaWF0ZWx5IGlmIHRoZXJlIGlzIG5vIGNvbmZpcm1hdGlvbi5cclxuICAgICAgICAgICAgaWYgKCFleHBlY3RDb25maXJtYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzYXZlRnVuYykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBjb25maXJtYXRpb24sIHRoZSBzYXZlIGZ1bmN0aW9uIHNob3VsZCBub3QgYmUgY2FsbGVkLlxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KHNhdmVGdW5jKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBjb25maXJtYXRpb24gaXMgc2hvd24uXHJcbiAgICAgICAgICAgICAgICBsZXQgY29uZmlybSA9IGdldENvbmZpcm1hdGlvbihlbCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29uZmlybSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChpc0NvbmZpcm1hdGlvbkRpc3BsYXllZChjb25maXJtKSkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIHRoZSBzYXZlRnVuYyB3aGVuIG5vdCBwcm9jZXNzaW5nIHJldm9rZXMgaW1tZWRpYXRlbHknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RTYXZlQnV0dG9uKGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyB0aGUgc2F2ZUZ1bmMgd2hlbiB0aGVyZSBhcmUgbm8gYnVsayBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RTYXZlQnV0dG9uKHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyB0aGUgY29uZmlybWF0aW9uIHBvcHVwIHdoZW4gcHJvY2Vzc2luZyByZXZva2VzIGltbWVkaWF0ZWx5IGFuZCB0aGVyZSBhcmUgYnVsayBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RTYXZlQnV0dG9uKHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2FsbHMgdGhlIHJlZnJlc2hUcmlnZ2VyJywgKCkgPT4ge1xyXG4gICAgICAgICAgIHRlc3RTYXZlQnV0dG9uKGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVmcmVzaFRyaWdnZXIucmVmcmVzaCkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2NvbmZpcm1hdGlvbicsICgpID0+IHtcclxuICAgICAgICBsZXQgZWwsIGNvbmZpcm1hdGlvbjtcclxuXHJcbiAgICAgICAgLy8gU3RhcnQgZWFjaCB0ZXN0IHdpdGggYSBkaXNwbGF5ZWQgY29uZmlybWF0aW9uLlxyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBlbCA9IGNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZ2V0U2F2ZUJ1dHRvbihlbCkuY2xpY2soKTtcclxuICAgICAgICAgICAgY29uZmlybWF0aW9uID0gZ2V0Q29uZmlybWF0aW9uKGVsKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQ29uZmlybWF0aW9uRGlzcGxheWVkKGNvbmZpcm1hdGlvbikpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBoaWRkZW4gd2hlbiBjbGlja2luZyBzYXZlIGJ1dHRvbiBhZ2FpbicsICgpID0+IHtcclxuICAgICAgICAgICAgZ2V0U2F2ZUJ1dHRvbihlbCkuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQ29uZmlybWF0aW9uRGlzcGxheWVkKGNvbmZpcm1hdGlvbikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgaGlkZGVuIHdoZW4gY2xpY2tpbmcgb24gdGhlIGRvY3VtZW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJGRvY3VtZW50WzBdLmJvZHkpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpc0NvbmZpcm1hdGlvbkRpc3BsYXllZChjb25maXJtYXRpb24pKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIGhpZGRlbiB3aGVuIGNsaWNraW5nIHRoZSBjYW5jZWwgYnV0dG9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY2FuY2VsID0gZWwuZmluZCgnLmJ0bi13aGl0ZScpO1xyXG4gICAgICAgICAgICBjYW5jZWwuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQ29uZmlybWF0aW9uRGlzcGxheWVkKGNvbmZpcm1hdGlvbikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaGlkZXMgdGhlIGNvbmZpcm1hdGlvbiBhbmQgc2F2ZXMgd2hlbiBjbGlja2luZyB0aGUgc2F2ZSBidXR0b24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzYXZlID0gZWwuZmluZCgnLmJ0bi1pbmZvJyk7XHJcbiAgICAgICAgICAgIHNhdmUuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQ29uZmlybWF0aW9uRGlzcGxheWVkKGNvbmZpcm1hdGlvbikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2F2ZUZ1bmMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVjaXNpb25UZXh0KHJvdykge1xyXG4gICAgICAgICAgICBsZXQgc3BhbiA9IGFuZ3VsYXIuZWxlbWVudChyb3cpLmZpbmQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwYW4ubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3Bhbi50ZXh0KCkudHJpbSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVjaXNpb25Db3VudChyb3cpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW4gPSBhbmd1bGFyLmVsZW1lbnQocm93KS5maW5kKCdiJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcGFuLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNwYW4udGV4dCgpLnRyaW0oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdkaXNwbGF5cyBlYWNoIHN0YXR1cyBhbmQgY291bnQsIHNvcnRlZCBhbHBoYWJldGljYWxseScsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gUmV0dXJuIHNvbWUgZGVjaXNpb24gY291bnRzLlxyXG4gICAgICAgICAgICBsZXQgZGVjaXNpb25Db3VudHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgICAgIGRlY2lzaW9uQ291bnRzLnNldCgnYUxhYmVsJywgNyk7XHJcbiAgICAgICAgICAgIGRlY2lzaW9uQ291bnRzLnNldCgnYW5vdGhlckxhYmVsJywgMTcpO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnZ2V0Q291bnRzQnlEZWNpc2lvbicpLmFuZC5jYWxsRmFrZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjaXNpb25Db3VudHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29uZmlndXJlIG1lc3NhZ2Uga2V5cyB0aGF0IHdpbGwgZmxpcCB0aGUgb3JkZXIgb2YgdGhlIGFycmF5LlxyXG4gICAgICAgICAgICBzcFRyYW5zbGF0ZUZpbHRlci5jb25maWd1cmVDYXRhbG9nKHtcclxuICAgICAgICAgICAgICAgICdjZXJ0X2FjdGlvbl9hX2xhYmVsJzogJ1hYWCcsXHJcbiAgICAgICAgICAgICAgICAnY2VydF9hY3Rpb25fYW5vdGhlcl9sYWJlbCc6ICdBQUEnLFxyXG4gICAgICAgICAgICAgICAgJ2NlcnRfYWN0aW9uX3lldF9hbm90aGVyX2xhYmVsJzogJ0JCQidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBEaWdlc3QgdG8gZ2V0IHRoZSBuZXcgZGVjaXNpb25zIGFwcGxpZWQuXHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLmdldENvdW50c0J5RGVjaXNpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgcm93cy5cclxuICAgICAgICAgICAgbGV0IHJvd3MgPSBlbC5maW5kKCdwJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBlbSBvdXQuXHJcbiAgICAgICAgICAgIGV4cGVjdChyb3dzLmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICAgICAgZXhwZWN0KGdldERlY2lzaW9uVGV4dChyb3dzWzBdKSkudG9FcXVhbCgnQUFBJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChnZXREZWNpc2lvbkNvdW50KHJvd3NbMF0pKS50b0VxdWFsKCcxNycpO1xyXG4gICAgICAgICAgICBleHBlY3QoZ2V0RGVjaXNpb25UZXh0KHJvd3NbMV0pKS50b0VxdWFsKCdYWFgnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGdldERlY2lzaW9uQ291bnQocm93c1sxXSkpLnRvRXF1YWwoJzcnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoYW5nZSB0aGUgY291bnRzIGJ5IGRlY2lzaW9uIGFuZCBtYWtlIHN1cmUgdGhhdCB0aGUgcm93cyBnZXQgdXBkYXRlZC5cclxuICAgICAgICAgICAgZGVjaXNpb25Db3VudHMuc2V0KCd5ZXRBbm90aGVyTGFiZWwnLCA3OCk7XHJcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcblxyXG4gICAgICAgICAgICByb3dzID0gZWwuZmluZCgncCcpO1xyXG4gICAgICAgICAgICBleHBlY3Qocm93cy5sZW5ndGgpLnRvRXF1YWwoMyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
