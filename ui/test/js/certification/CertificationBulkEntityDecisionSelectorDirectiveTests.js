System.register(['certification/CertificationModule', 'test/js/TestInitializer', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('CertificationBulkEntityDecisionSelectorDirective', function () {

                var elementDefinition = '<sp-certification-bulk-entity-decision-selector sp-certification="cert"' + ' sp-bulk-decisions="decisions " sp-checkbox-multi-select="checkboxMultiSelect"' + ' sp-refresh-trigger="refreshTrigger"/>',
                    $scope = undefined,
                    $compile = undefined,
                    checkboxMultiSelect = undefined,
                    cert = undefined,
                    testService = undefined,
                    DataRefreshTrigger = undefined,
                    refreshSpy = undefined,
                    REASSIGN = 'Reassign',
                    DELEGATED = 'Delegated';

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 7 */
                beforeEach(inject(function ($rootScope, _$compile_, certificationTestData, Certification, CheckboxMultiSelect, _DataRefreshTrigger_, _testService_) {
                    $scope = $rootScope.$new();
                    $compile = _$compile_;
                    testService = _testService_;
                    DataRefreshTrigger = _DataRefreshTrigger_;

                    cert = new Certification(certificationTestData.CERTIFICATION_1);
                    checkboxMultiSelect = new CheckboxMultiSelect();
                }));

                function createElement(decisions) {
                    var element = angular.element(elementDefinition);
                    $scope.cert = cert;
                    $scope.decisions = decisions;
                    $scope.checkboxMultiSelect = checkboxMultiSelect;

                    $scope.refreshTrigger = new DataRefreshTrigger();
                    refreshSpy = jasmine.createSpy();
                    $scope.refreshTrigger.onRefresh(refreshSpy, $scope);

                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                function testDropdownSelector(decisions, expectElement, expectEnabled) {
                    var element = createElement(decisions);
                    var span = element.find('#dropdownBulkEntityDecisionSelector');

                    expect(span.length).toEqual(expectElement ? 1 : 0);

                    if (expectElement) {
                        var button = element.find('button');
                        expect(button.attr('disabled')).toEqual(!expectEnabled ? 'disabled' : undefined);
                    }

                    return element;
                }

                function testButtonSelectors(decisions, expectReassign, expectDelegate, expectEnabled) {
                    var element = createElement(decisions),
                        singleButtons = element.find('#singleButtonBulkEntitySpan').find('button'),
                        reassignButton = element.find('#bulkReassignEntityButton'),
                        delegateButton = element.find('#bulkDelegateEntityButton');

                    expect(singleButtons.length).toEqual(expectReassign || expectDelegate ? 1 : 0);
                    expect(reassignButton.length).toEqual(expectReassign ? 1 : 0);
                    expect(delegateButton.length).toEqual(expectDelegate ? 1 : 0);

                    if (expectReassign) {
                        expect(reassignButton.attr('disabled')).toEqual(!expectEnabled ? 'disabled' : undefined);
                    }
                    if (expectDelegate) {
                        expect(delegateButton.attr('disabled')).toEqual(!expectEnabled ? 'disabled' : undefined);
                    }

                    return element;
                }

                it('menu and buttons are not displayed if there are no decisions', function () {
                    var decisions = null;
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, false, false, false);
                });

                it('menu is not displayed if the cert is not editable', function () {
                    var decisions = [REASSIGN, DELEGATED];
                    cert.editable = false;
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, false, false, false);
                });

                it('buttons are not displayed if the cert is not editable', function () {
                    var decisions = [REASSIGN];
                    cert.editable = false;
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, false, false, false);
                });

                it('menu is displayed if there are more than 1 bulk decisions', function () {
                    var decisions = [REASSIGN, DELEGATED];
                    testDropdownSelector(decisions, true, false);
                    testButtonSelectors(decisions, false, false, false);
                });

                it('menu is enabled if items are selected', function () {
                    var decisions = [REASSIGN, DELEGATED];
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234' });
                    testDropdownSelector(decisions, true, true);
                    testButtonSelectors(decisions, false, false, false);
                });

                it('menu is disabled if no items are selected', function () {
                    var decisions = [REASSIGN, DELEGATED];
                    spyOn(checkboxMultiSelect.getSelectionModel(), 'hasSelections').and.returnValue(false);
                    testDropdownSelector(decisions, true, false);
                    testButtonSelectors(decisions, false, false, false);
                });

                it('contains a menu item for each decision', function () {
                    var decisions = [REASSIGN, DELEGATED];
                    var element = createElement(decisions);

                    var listItems = element.find('li');
                    expect(listItems.length).toEqual(decisions.length);

                    for (var i = 0; i < listItems.length; i++) {
                        var anchor = angular.element(listItems[i]).find('a');
                        expect(anchor.text().trim()).toEqual('cert_bulk_decision_' + decisions[i].toLowerCase());
                    }
                });

                it('reassign button is displayed but disabled when reassign is the only decision', function () {
                    var decisions = [REASSIGN];
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, true, false, false);
                });

                it('reassign button is displayed and enabled when reassign is the only decision and item is selected', function () {
                    var decisions = [REASSIGN];
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234' });
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, true, false, true);
                });

                it('delegate button is displayed but disabled when delegate is the only decision', function () {
                    var decisions = [DELEGATED];
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, false, true, false);
                });

                it('delegate button is displayed and enabled when delegate is the only decision and item is selected', function () {
                    var decisions = [DELEGATED];
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234' });
                    testDropdownSelector(decisions, false, false);
                    testButtonSelectors(decisions, false, true, true);
                });

                describe('click', function () {
                    var certificationBulkDecisionService = undefined,
                        certificationDataService = undefined,
                        $rootScope = undefined,
                        fakeDecision = undefined,
                        element = undefined,
                        infoModalService = undefined,
                        CertificationActionStatus = undefined,
                        spModal = undefined,
                        $q = undefined;

                    var decisions = [REASSIGN, DELEGATED];

                    beforeEach(inject(function (_certificationBulkDecisionService_, _certificationDataService_, _$rootScope_, _infoModalService_, _spModal_, _CertificationActionStatus_, _$q_) {
                        certificationBulkDecisionService = _certificationBulkDecisionService_;
                        certificationDataService = _certificationDataService_;
                        $rootScope = _$rootScope_;
                        infoModalService = _infoModalService_;
                        CertificationActionStatus = _CertificationActionStatus_;
                        spModal = _spModal_;
                        $q = _$q_;

                        // Mock out the bulk decision service to return a promise.
                        fakeDecision = 'look ma ... no hands!';
                        certificationBulkDecisionService.bulkEntityDecide = testService.createPromiseSpy(false, fakeDecision, null);
                        spyOn(checkboxMultiSelect.getSelectionModel(), 'clear');

                        certificationDataService.checkForUnsavedDecisions = testService.createPromiseSpy(false, {}, null);

                        // Create the element.
                        element = createElement(decisions);
                    }));

                    function click(choice) {
                        var anchors = element.find('a');
                        expect(anchors.length).toEqual(2);
                        angular.element(anchors[choice]).click();
                    }

                    it('calls bulkEntityDecide', function () {
                        // Add a selection.
                        checkboxMultiSelect.getSelectionModel().add({ id: '1' });

                        click(0);
                        expect(certificationBulkDecisionService.bulkEntityDecide).toHaveBeenCalledWith(decisions[0], checkboxMultiSelect.getSelectionModel(), 1);
                    });

                    it('checks for unsaved item decisions', function () {
                        // Add a selection.
                        checkboxMultiSelect.getSelectionModel().add({ id: '1' });
                        click(0);
                        $rootScope.$digest();
                        expect(certificationDataService.checkForUnsavedDecisions).toHaveBeenCalled();
                    });

                    it('clears the selection model and refreshes list after bulk deciding', function () {
                        // Add a selection.
                        checkboxMultiSelect.getSelectionModel().add({ id: '1' });

                        click(0);
                        $rootScope.$digest();
                        expect(checkboxMultiSelect.getSelectionModel().clear).toHaveBeenCalled();
                        expect(refreshSpy).toHaveBeenCalled();
                    });

                    it('does not clear the selection model or refresh list if bulk deciding was cancelled', function () {
                        certificationBulkDecisionService.bulkEntityDecide = testService.createPromiseSpy(true, fakeDecision, null);

                        // Add a selection.
                        checkboxMultiSelect.getSelectionModel().add({ id: '1' });

                        click(0);
                        $rootScope.$digest();
                        expect(checkboxMultiSelect.getSelectionModel().clear).not.toHaveBeenCalled();
                        expect(refreshSpy).not.toHaveBeenCalled();
                    });

                    it('shows no delegatables dialog', function () {
                        spyOn(infoModalService, 'open');

                        // Add two delegated selections.
                        checkboxMultiSelect.getSelectionModel().add({ id: '2', summaryStatus: CertificationActionStatus.Name.Delegated });
                        checkboxMultiSelect.getSelectionModel().add({ id: '3', summaryStatus: CertificationActionStatus.Name.Delegated });

                        click(1);
                        expect(infoModalService.open).toHaveBeenCalled();
                    });

                    it('shows some already delegated dialog', function () {
                        spyOn(spModal, 'confirm').and.returnValue($q.when());

                        // Add one open selections and one already delegated.
                        checkboxMultiSelect.getSelectionModel().add({ id: '4' });
                        checkboxMultiSelect.getSelectionModel().add({ id: '5', summaryStatus: CertificationActionStatus.Name.Delegated });

                        click(1);
                        expect(spModal.confirm).toHaveBeenCalled();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkJ1bGtFbnRpdHlEZWNpc2lvblNlbGVjdG9yRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMscUNBQXFDLDJCQUEyQix1QkFBdUIsVUFBVSxTQUFTOzs7SUFHdkg7O0lBRUEsSUFBSSxxQkFBcUI7SUFDekIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLG1DQUFtQztZQUNuRCxzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQkFBbUI7WUFDbEUsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFON0IsU0FBUyxvREFBb0QsWUFBVzs7Z0JBRXBFLElBQUksb0JBQW9CLDRFQUNoQixtRkFDQTtvQkFDSixTQUFNO29CQUFFLFdBQVE7b0JBQUUsc0JBQW1CO29CQUFFLE9BQUk7b0JBQUUsY0FBVztvQkFBRSxxQkFBa0I7b0JBQUUsYUFBVTtvQkFDeEYsV0FBVztvQkFBWSxZQUFZOztnQkFFdkMsV0FBVyxPQUFPLHFCQUFxQjs7O2dCQUd2QyxXQUFXLE9BQU8sVUFBUyxZQUFZLFlBQVksdUJBQXVCLGVBQWUscUJBQzlELHNCQUFzQixlQUFlO29CQUM1RCxTQUFTLFdBQVc7b0JBQ3BCLFdBQVc7b0JBQ1gsY0FBYztvQkFDZCxxQkFBcUI7O29CQUVyQixPQUFPLElBQUksY0FBYyxzQkFBc0I7b0JBQy9DLHNCQUFzQixJQUFJOzs7Z0JBRzlCLFNBQVMsY0FBYyxXQUFXO29CQUM5QixJQUFJLFVBQVUsUUFBUSxRQUFRO29CQUM5QixPQUFPLE9BQU87b0JBQ2QsT0FBTyxZQUFZO29CQUNuQixPQUFPLHNCQUFzQjs7b0JBRTdCLE9BQU8saUJBQWlCLElBQUk7b0JBQzVCLGFBQWEsUUFBUTtvQkFDckIsT0FBTyxlQUFlLFVBQVUsWUFBWTs7b0JBRTVDLFNBQVMsU0FBUztvQkFDbEIsT0FBTztvQkFDUCxPQUFPOzs7Z0JBR1gs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RUFBQyxJQUFJLEtBQUssZUFBZSwwQkFBMEIsS0FBSzs7d0JBRTVELE1BQU07d0JBQ04sT0FBTyxRQUFRLFNBQVM7Ozs7OztHQWlCakMiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uQnVsa0VudGl0eURlY2lzaW9uU2VsZWN0b3JEaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbkJ1bGtFbnRpdHlEZWNpc2lvblNlbGVjdG9yRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICBsZXQgZWxlbWVudERlZmluaXRpb24gPSAnPHNwLWNlcnRpZmljYXRpb24tYnVsay1lbnRpdHktZGVjaXNpb24tc2VsZWN0b3Igc3AtY2VydGlmaWNhdGlvbj1cImNlcnRcIicgK1xuICAgICAgICAgICAgJyBzcC1idWxrLWRlY2lzaW9ucz1cImRlY2lzaW9ucyBcIiBzcC1jaGVja2JveC1tdWx0aS1zZWxlY3Q9XCJjaGVja2JveE11bHRpU2VsZWN0XCInICtcbiAgICAgICAgICAgICcgc3AtcmVmcmVzaC10cmlnZ2VyPVwicmVmcmVzaFRyaWdnZXJcIi8+JyxcbiAgICAgICAgJHNjb3BlLCAkY29tcGlsZSwgY2hlY2tib3hNdWx0aVNlbGVjdCwgY2VydCwgdGVzdFNlcnZpY2UsIERhdGFSZWZyZXNoVHJpZ2dlciwgcmVmcmVzaFNweSxcbiAgICAgICAgUkVBU1NJR04gPSAnUmVhc3NpZ24nLCBERUxFR0FURUQgPSAnRGVsZWdhdGVkJztcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUsIHRlc3RNb2R1bGUpKTtcblxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDcgKi9cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCBfJGNvbXBpbGVfLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsIENlcnRpZmljYXRpb24sIENoZWNrYm94TXVsdGlTZWxlY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0RhdGFSZWZyZXNoVHJpZ2dlcl8sIF90ZXN0U2VydmljZV8pIHtcbiAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgdGVzdFNlcnZpY2UgPSBfdGVzdFNlcnZpY2VfO1xuICAgICAgICBEYXRhUmVmcmVzaFRyaWdnZXIgPSBfRGF0YVJlZnJlc2hUcmlnZ2VyXztcblxuICAgICAgICBjZXJ0ID0gbmV3IENlcnRpZmljYXRpb24oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fMSk7XG4gICAgICAgIGNoZWNrYm94TXVsdGlTZWxlY3QgPSBuZXcgQ2hlY2tib3hNdWx0aVNlbGVjdCgpO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoZGVjaXNpb25zKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcbiAgICAgICAgJHNjb3BlLmNlcnQgPSBjZXJ0O1xuICAgICAgICAkc2NvcGUuZGVjaXNpb25zID0gZGVjaXNpb25zO1xuICAgICAgICAkc2NvcGUuY2hlY2tib3hNdWx0aVNlbGVjdCA9IGNoZWNrYm94TXVsdGlTZWxlY3Q7XG5cbiAgICAgICAgJHNjb3BlLnJlZnJlc2hUcmlnZ2VyID0gbmV3IERhdGFSZWZyZXNoVHJpZ2dlcigpO1xuICAgICAgICByZWZyZXNoU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgJHNjb3BlLnJlZnJlc2hUcmlnZ2VyLm9uUmVmcmVzaChyZWZyZXNoU3B5LCAkc2NvcGUpO1xuXG4gICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdERyb3Bkb3duU2VsZWN0b3IoZGVjaXNpb25zLCBleHBlY3RFbGVtZW50LCBleHBlY3RFbmFibGVkKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChkZWNpc2lvbnMpO1xuICAgICAgICBsZXQgc3BhbiA9IGVsZW1lbnQuZmluZCgnI2Ryb3Bkb3duQnVsa0VudGl0eURlY2lzaW9uU2VsZWN0b3InKTtcblxuICAgICAgICBleHBlY3Qoc3Bhbi5sZW5ndGgpLnRvRXF1YWwoKGV4cGVjdEVsZW1lbnQpID8gMSA6IDApO1xuXG4gICAgICAgIGlmIChleHBlY3RFbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcbiAgICAgICAgICAgIGV4cGVjdChidXR0b24uYXR0cignZGlzYWJsZWQnKSkudG9FcXVhbCghZXhwZWN0RW5hYmxlZCA/ICdkaXNhYmxlZCcgOiB1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdEJ1dHRvblNlbGVjdG9ycyhkZWNpc2lvbnMsIGV4cGVjdFJlYXNzaWduLCBleHBlY3REZWxlZ2F0ZSwgZXhwZWN0RW5hYmxlZCkge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoZGVjaXNpb25zKSxcbiAgICAgICAgICAgIHNpbmdsZUJ1dHRvbnMgPSBlbGVtZW50LmZpbmQoJyNzaW5nbGVCdXR0b25CdWxrRW50aXR5U3BhbicpLmZpbmQoJ2J1dHRvbicpLFxuICAgICAgICAgICAgcmVhc3NpZ25CdXR0b24gPSBlbGVtZW50LmZpbmQoJyNidWxrUmVhc3NpZ25FbnRpdHlCdXR0b24nKSxcbiAgICAgICAgICAgIGRlbGVnYXRlQnV0dG9uID0gZWxlbWVudC5maW5kKCcjYnVsa0RlbGVnYXRlRW50aXR5QnV0dG9uJyk7XG5cbiAgICAgICAgZXhwZWN0KHNpbmdsZUJ1dHRvbnMubGVuZ3RoKS50b0VxdWFsKChleHBlY3RSZWFzc2lnbiB8fCBleHBlY3REZWxlZ2F0ZSkgPyAxIDogMCk7XG4gICAgICAgIGV4cGVjdChyZWFzc2lnbkJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoZXhwZWN0UmVhc3NpZ24gPyAxIDogMCk7XG4gICAgICAgIGV4cGVjdChkZWxlZ2F0ZUJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoZXhwZWN0RGVsZWdhdGUgPyAxIDogMCk7XG5cbiAgICAgICAgaWYgKGV4cGVjdFJlYXNzaWduKSB7XG4gICAgICAgICAgICBleHBlY3QocmVhc3NpZ25CdXR0b24uYXR0cignZGlzYWJsZWQnKSkudG9FcXVhbCghZXhwZWN0RW5hYmxlZCA/ICdkaXNhYmxlZCcgOiB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHBlY3REZWxlZ2F0ZSkge1xuICAgICAgICAgICAgZXhwZWN0KGRlbGVnYXRlQnV0dG9uLmF0dHIoJ2Rpc2FibGVkJykpLnRvRXF1YWwoIWV4cGVjdEVuYWJsZWQgPyAnZGlzYWJsZWQnIDogdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIGl0KCdtZW51IGFuZCBidXR0b25zIGFyZSBub3QgZGlzcGxheWVkIGlmIHRoZXJlIGFyZSBubyBkZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBudWxsO1xuICAgICAgICB0ZXN0RHJvcGRvd25TZWxlY3RvcihkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHRlc3RCdXR0b25TZWxlY3RvcnMoZGVjaXNpb25zLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdtZW51IGlzIG5vdCBkaXNwbGF5ZWQgaWYgdGhlIGNlcnQgaXMgbm90IGVkaXRhYmxlJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVjaXNpb25zID0gW1JFQVNTSUdOLCBERUxFR0FURURdO1xuICAgICAgICBjZXJ0LmVkaXRhYmxlID0gZmFsc2U7XG4gICAgICAgIHRlc3REcm9wZG93blNlbGVjdG9yKGRlY2lzaW9ucywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgdGVzdEJ1dHRvblNlbGVjdG9ycyhkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1dHRvbnMgYXJlIG5vdCBkaXNwbGF5ZWQgaWYgdGhlIGNlcnQgaXMgbm90IGVkaXRhYmxlJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVjaXNpb25zID0gW1JFQVNTSUdOXTtcbiAgICAgICAgY2VydC5lZGl0YWJsZSA9IGZhbHNlO1xuICAgICAgICB0ZXN0RHJvcGRvd25TZWxlY3RvcihkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHRlc3RCdXR0b25TZWxlY3RvcnMoZGVjaXNpb25zLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdtZW51IGlzIGRpc3BsYXllZCBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDEgYnVsayBkZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbUkVBU1NJR04sIERFTEVHQVRFRF07XG4gICAgICAgIHRlc3REcm9wZG93blNlbGVjdG9yKGRlY2lzaW9ucywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB0ZXN0QnV0dG9uU2VsZWN0b3JzKGRlY2lzaW9ucywgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbWVudSBpcyBlbmFibGVkIGlmIGl0ZW1zIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFtSRUFTU0lHTiwgREVMRUdBVEVEXTtcbiAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZCh7IGlkOiAnMTIzNCcgfSk7XG4gICAgICAgIHRlc3REcm9wZG93blNlbGVjdG9yKGRlY2lzaW9ucywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHRlc3RCdXR0b25TZWxlY3RvcnMoZGVjaXNpb25zLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdtZW51IGlzIGRpc2FibGVkIGlmIG5vIGl0ZW1zIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFtSRUFTU0lHTiwgREVMRUdBVEVEXTtcbiAgICAgICAgc3B5T24oY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLCAnaGFzU2VsZWN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgIHRlc3REcm9wZG93blNlbGVjdG9yKGRlY2lzaW9ucywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB0ZXN0QnV0dG9uU2VsZWN0b3JzKGRlY2lzaW9ucywgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29udGFpbnMgYSBtZW51IGl0ZW0gZm9yIGVhY2ggZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbUkVBU1NJR04sIERFTEVHQVRFRF07XG4gICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChkZWNpc2lvbnMpO1xuXG4gICAgICAgIGxldCBsaXN0SXRlbXMgPSBlbGVtZW50LmZpbmQoJ2xpJyk7XG4gICAgICAgIGV4cGVjdChsaXN0SXRlbXMubGVuZ3RoKS50b0VxdWFsKGRlY2lzaW9ucy5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYW5jaG9yID0gYW5ndWxhci5lbGVtZW50KGxpc3RJdGVtc1tpXSkuZmluZCgnYScpO1xuICAgICAgICAgICAgZXhwZWN0KGFuY2hvci50ZXh0KCkudHJpbSgpKS50b0VxdWFsKCdjZXJ0X2J1bGtfZGVjaXNpb25fJyArIGRlY2lzaW9uc1tpXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3JlYXNzaWduIGJ1dHRvbiBpcyBkaXNwbGF5ZWQgYnV0IGRpc2FibGVkIHdoZW4gcmVhc3NpZ24gaXMgdGhlIG9ubHkgZGVjaXNpb24nLCAoKSA9PiB7XG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbUkVBU1NJR05dO1xuICAgICAgICB0ZXN0RHJvcGRvd25TZWxlY3RvcihkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHRlc3RCdXR0b25TZWxlY3RvcnMoZGVjaXNpb25zLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlYXNzaWduIGJ1dHRvbiBpcyBkaXNwbGF5ZWQgYW5kIGVuYWJsZWQgd2hlbiByZWFzc2lnbiBpcyB0aGUgb25seSBkZWNpc2lvbiBhbmQgaXRlbSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFtSRUFTU0lHTl07XG4gICAgICAgIGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5hZGQoeyBpZDogJzEyMzQnIH0pO1xuICAgICAgICB0ZXN0RHJvcGRvd25TZWxlY3RvcihkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHRlc3RCdXR0b25TZWxlY3RvcnMoZGVjaXNpb25zLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGVsZWdhdGUgYnV0dG9uIGlzIGRpc3BsYXllZCBidXQgZGlzYWJsZWQgd2hlbiBkZWxlZ2F0ZSBpcyB0aGUgb25seSBkZWNpc2lvbicsICgpID0+IHtcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFtERUxFR0FURURdO1xuICAgICAgICB0ZXN0RHJvcGRvd25TZWxlY3RvcihkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHRlc3RCdXR0b25TZWxlY3RvcnMoZGVjaXNpb25zLCBmYWxzZSwgdHJ1ZSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RlbGVnYXRlIGJ1dHRvbiBpcyBkaXNwbGF5ZWQgYW5kIGVuYWJsZWQgd2hlbiBkZWxlZ2F0ZSBpcyB0aGUgb25seSBkZWNpc2lvbiBhbmQgaXRlbSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFtERUxFR0FURURdO1xuICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuYWRkKHsgaWQ6ICcxMjM0JyB9KTtcbiAgICAgICAgdGVzdERyb3Bkb3duU2VsZWN0b3IoZGVjaXNpb25zLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICB0ZXN0QnV0dG9uU2VsZWN0b3JzKGRlY2lzaW9ucywgZmFsc2UsIHRydWUsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBsZXQgY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UsIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJHJvb3RTY29wZSwgZmFrZURlY2lzaW9uLCBlbGVtZW50LFxuICAgICAgICAgICAgaW5mb01vZGFsU2VydmljZSwgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cywgc3BNb2RhbCwgJHE7XG5cbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFtSRUFTU0lHTiwgREVMRUdBVEVEXTtcblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlXywgX2NlcnRpZmljYXRpb25EYXRhU2VydmljZV8sIF8kcm9vdFNjb3BlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbmZvTW9kYWxTZXJ2aWNlXywgX3NwTW9kYWxfLCBfQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1c18sIF8kcV8pID0+IHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlXztcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfO1xuICAgICAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICAgICAgICAgIGluZm9Nb2RhbFNlcnZpY2UgPSBfaW5mb01vZGFsU2VydmljZV87XG4gICAgICAgICAgICBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzID0gX0NlcnRpZmljYXRpb25BY3Rpb25TdGF0dXNfO1xuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgICAgICRxID0gXyRxXztcblxuICAgICAgICAgICAgLy8gTW9jayBvdXQgdGhlIGJ1bGsgZGVjaXNpb24gc2VydmljZSB0byByZXR1cm4gYSBwcm9taXNlLlxuICAgICAgICAgICAgZmFrZURlY2lzaW9uID0gJ2xvb2sgbWEgLi4uIG5vIGhhbmRzISc7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZS5idWxrRW50aXR5RGVjaWRlID1cbiAgICAgICAgICAgICAgICB0ZXN0U2VydmljZS5jcmVhdGVQcm9taXNlU3B5KGZhbHNlLCBmYWtlRGVjaXNpb24sIG51bGwpO1xuICAgICAgICAgICAgc3B5T24oY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLCAnY2xlYXInKTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmNoZWNrRm9yVW5zYXZlZERlY2lzaW9ucyA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkoZmFsc2UsIHt9LCBudWxsKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoZGVjaXNpb25zKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsaWNrKGNob2ljZSkge1xuICAgICAgICAgICAgbGV0IGFuY2hvcnMgPSBlbGVtZW50LmZpbmQoJ2EnKTtcbiAgICAgICAgICAgIGV4cGVjdChhbmNob3JzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChhbmNob3JzW2Nob2ljZV0pLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnY2FsbHMgYnVsa0VudGl0eURlY2lkZScsICgpID0+IHtcbiAgICAgICAgICAgIC8vIEFkZCBhIHNlbGVjdGlvbi5cbiAgICAgICAgICAgIGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5hZGQoe2lkOiAnMSd9KTtcblxuICAgICAgICAgICAgY2xpY2soMCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UuYnVsa0VudGl0eURlY2lkZSkuXG4gICAgICAgICAgICB0b0hhdmVCZWVuQ2FsbGVkV2l0aChkZWNpc2lvbnNbMF0sIGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKSwgMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjaGVja3MgZm9yIHVuc2F2ZWQgaXRlbSBkZWNpc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBBZGQgYSBzZWxlY3Rpb24uXG4gICAgICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuYWRkKHtpZDogJzEnfSk7XG4gICAgICAgICAgICBjbGljaygwKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5jaGVja0ZvclVuc2F2ZWREZWNpc2lvbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NsZWFycyB0aGUgc2VsZWN0aW9uIG1vZGVsIGFuZCByZWZyZXNoZXMgbGlzdCBhZnRlciBidWxrIGRlY2lkaW5nJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8gQWRkIGEgc2VsZWN0aW9uLlxuICAgICAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZCh7aWQ6ICcxJ30pO1xuXG4gICAgICAgICAgICBjbGljaygwKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgZXhwZWN0KGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5jbGVhcikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZnJlc2hTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IGNsZWFyIHRoZSBzZWxlY3Rpb24gbW9kZWwgb3IgcmVmcmVzaCBsaXN0IGlmIGJ1bGsgZGVjaWRpbmcgd2FzIGNhbmNlbGxlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlLmJ1bGtFbnRpdHlEZWNpZGUgPVxuICAgICAgICAgICAgICAgIHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkodHJ1ZSwgZmFrZURlY2lzaW9uLCBudWxsKTtcblxuICAgICAgICAgICAgLy8gQWRkIGEgc2VsZWN0aW9uLlxuICAgICAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZCh7aWQ6ICcxJ30pO1xuXG4gICAgICAgICAgICBjbGljaygwKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgZXhwZWN0KGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5jbGVhcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZyZXNoU3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3Mgbm8gZGVsZWdhdGFibGVzIGRpYWxvZycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGluZm9Nb2RhbFNlcnZpY2UsICdvcGVuJyk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0d28gZGVsZWdhdGVkIHNlbGVjdGlvbnMuXG4gICAgICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuYWRkKFxuICAgICAgICAgICAgICAgIHtpZDogJzInLCBzdW1tYXJ5U3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkfSk7XG4gICAgICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuYWRkKFxuICAgICAgICAgICAgICAgIHtpZDogJzMnLCBzdW1tYXJ5U3RhdHVzOiBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLk5hbWUuRGVsZWdhdGVkfSk7XG5cbiAgICAgICAgICAgIGNsaWNrKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGluZm9Nb2RhbFNlcnZpY2Uub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3Mgc29tZSBhbHJlYWR5IGRlbGVnYXRlZCBkaWFsb2cnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnY29uZmlybScpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKCkpO1xuXG4gICAgICAgICAgICAvLyBBZGQgb25lIG9wZW4gc2VsZWN0aW9ucyBhbmQgb25lIGFscmVhZHkgZGVsZWdhdGVkLlxuICAgICAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZChcbiAgICAgICAgICAgICAgICB7aWQ6ICc0J30pO1xuICAgICAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZChcbiAgICAgICAgICAgICAgICB7aWQ6ICc1Jywgc3VtbWFyeVN0YXR1czogQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cy5OYW1lLkRlbGVnYXRlZH0pO1xuXG4gICAgICAgICAgICBjbGljaygxKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLmNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
