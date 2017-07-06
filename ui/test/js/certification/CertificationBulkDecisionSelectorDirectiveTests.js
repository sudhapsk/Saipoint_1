System.register(['certification/CertificationModule', 'test/js/TestInitializer'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            describe('CertificationBulkDecisionSelectorDirective', function () {

                var elementDefinition = '<sp-certification-bulk-decision-selector sp-certification="cert"' + ' sp-bulk-decisions="decisions " sp-checkbox-multi-select="checkboxMultiSelect"' + ' sp-filter-values="filters" sp-table="table" />',
                    $scope = undefined,
                    $compile = undefined,
                    checkboxMultiSelect = undefined,
                    cert = undefined,
                    isReadOnly = undefined,
                    table = undefined;

                beforeEach(module(certificationModule));

                /* jshint maxparams: 7 */
                beforeEach(inject(function ($rootScope, _$compile_, certificationTestData, Certification, CheckboxMultiSelect, certificationItemService, CertificationTable) {
                    $scope = $rootScope.$new();
                    $compile = _$compile_;

                    cert = new Certification(certificationTestData.CERTIFICATION_1);
                    checkboxMultiSelect = new CheckboxMultiSelect();

                    isReadOnly = false;
                    spyOn(certificationItemService, 'isItemReadOnly').and.callFake(function () {
                        return isReadOnly;
                    });

                    table = new CertificationTable({ columnConfigKey: 'foo' });
                    table.getDataTableConfig().pageState.pagingData.setTotal(0);
                }));

                function createElement(decisions) {
                    var element = angular.element(elementDefinition);
                    $scope.cert = cert;
                    $scope.decisions = decisions;
                    $scope.checkboxMultiSelect = checkboxMultiSelect;
                    $scope.filters = {
                        filter: 'this'
                    };
                    $scope.table = table;
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                function testSelector(decisions, expectElement, expectEnabled) {
                    var element = createElement(decisions);
                    var span = element.find('#bulkDecisionSelector');

                    expect(span.length).toEqual(expectElement ? 1 : 0);

                    if (expectElement) {
                        var button = element.find('button');
                        expect(button.attr('disabled')).toEqual(!expectEnabled ? 'disabled' : undefined);
                    }

                    return element;
                }

                it('is not displayed if there are no decisions', function () {
                    var decisions = null;
                    testSelector(decisions, false, false);
                });

                it('is not displayed if the cert is not editable', function () {
                    cert.editable = false;
                    testSelector(['Decision1'], false, false);
                });

                it('is displayed if there are bulk decisions', function () {
                    var decisions = ['Approve', 'Revoke'];
                    testSelector(decisions, true, false);
                });

                it('is enabled if items are selected', function () {
                    var decisions = ['Approve'];
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234', isChallengedState: function () {
                            return false;
                        } });
                    testSelector(decisions, true, true);
                });

                it('is disabled if no items are selected', function () {
                    var decisions = ['Approve'];
                    spyOn(checkboxMultiSelect.getSelectionModel(), 'hasSelections').and.returnValue(false);
                    testSelector(decisions, true, false);
                });

                it('is disabled if only read only items are selected', function () {
                    var decisions = ['Approve'];
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234', isChallengedState: function () {
                            return false;
                        } });
                    isReadOnly = true;
                    testSelector(decisions, true, false);
                });

                it('is disabled if select everything was checked, but all items were removed', function () {
                    // pretend we selected everything
                    checkboxMultiSelect.getSelectionModel().isInclude = false;
                    var decisions = ['Approve'];
                    testSelector(decisions, true, false);
                });

                it('is disabled if selected item is challenged', function () {
                    var decisions = ['Reassign'];
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234', isChallengedState: function () {
                            return true;
                        } });
                    testSelector(decisions, true, false);
                });

                it('contains a menu item for each decision', function () {
                    var decisions = ['bulk1', 'bulk2', 'bulk3'];
                    var element = createElement(decisions);

                    var listItems = element.find('li');
                    expect(listItems.length).toEqual(decisions.length);

                    for (var i = 0; i < listItems.length; i++) {
                        var anchor = angular.element(listItems[i]).find('a');
                        expect(anchor.text().trim()).toEqual('cert_bulk_decision_' + decisions[i]);
                    }
                });

                it('shows button with action name and item count if there is only one decision available', function () {
                    checkboxMultiSelect.getSelectionModel().add({ id: '1234', isChallengedState: function () {
                            return false;
                        } });

                    var decisions = ['bulk1'],
                        element = createElement(decisions),
                        button = element.find('button');

                    expect(button.length).toEqual(1);

                    var btnInnerText = button[0].innerText.trim();

                    expect(btnInnerText.startsWith('cert_bulk_decision_' + decisions[0])).toEqual(true);
                    expect(btnInnerText.indexOf('1 ui_selected')).not.toEqual(-1);
                });

                describe('click', function () {
                    var certificationBulkDecisionService = undefined,
                        certificationDataService = undefined,
                        $rootScope = undefined,
                        cancelDecision = undefined,
                        fakeDecision = undefined,
                        element = undefined,
                        spModal = undefined,
                        $q = undefined,
                        hasDecision = undefined;

                    var decisions = ['decision1', 'Reassign', 'RevokeAccount'];

                    beforeEach(inject(function (_certificationBulkDecisionService_, _certificationDataService_, _$rootScope_, _$q_, _spModal_) {
                        certificationBulkDecisionService = _certificationBulkDecisionService_;
                        certificationDataService = _certificationDataService_;
                        $rootScope = _$rootScope_;
                        spModal = _spModal_;
                        $q = _$q_;

                        // Mock out the bulk decision service to return a promise.
                        cancelDecision = false;
                        fakeDecision = 'look ma ... no hands!';
                        spyOn(certificationBulkDecisionService, 'bulkDecide').and.callFake(function () {
                            if (cancelDecision) {
                                return $q.reject();
                            }
                            return $q.when(fakeDecision);
                        });
                        spyOn(certificationDataService.decisions, 'addBulkDecision');

                        // Add a selection.
                        checkboxMultiSelect.getSelectionModel().add({
                            id: '1',
                            isChallengedState: function () {
                                return false;
                            },
                            decisionStatus: {
                                hasDecision: jasmine.createSpy().and.callFake(function () {
                                    return hasDecision;
                                })
                            }
                        });
                        hasDecision = true;
                        // Create the element.
                        element = createElement(decisions);
                    }));

                    function click(decisionIndex) {
                        var anchors = element.find('a');
                        angular.element(anchors[decisionIndex ? decisionIndex : 0]).click();
                    }

                    it('removes read only selections and does not save decision if empty', function () {
                        isReadOnly = true;
                        click();
                        expect(checkboxMultiSelect.getSelectionModel().getSelectionIds()).not.toContain('1');
                        expect(certificationBulkDecisionService.bulkDecide).not.toHaveBeenCalled();
                    });

                    it('removes items that do not have the account decision', function () {
                        hasDecision = false;
                        click(2);
                        expect(checkboxMultiSelect.getSelectionModel().getSelectionIds()).not.toContain('1');
                        expect(certificationBulkDecisionService.bulkDecide).not.toHaveBeenCalled();
                    });

                    it('shows confirm dialog when items are filtered for reassign action', function () {
                        spyOn(spModal, 'confirm').and.returnValue($q.when());
                        checkboxMultiSelect.getSelectionModel().add({ id: '2', isChallengedState: function () {
                                return false;
                            } });
                        spyOn(checkboxMultiSelect.getSelectionModel(), 'filterSelections').and.returnValue({
                            size: function () {
                                return 1;
                            }
                        });
                        click(1);
                        expect(spModal.confirm).toHaveBeenCalled();
                    });

                    it('calls bulkDecide', function () {
                        click();
                        expect(certificationBulkDecisionService.bulkDecide).toHaveBeenCalledWith(decisions[0], checkboxMultiSelect.getSelectionModel(), $scope.filters, 1, table);
                    });

                    it('adds a bulk decision after bulk deciding', function () {
                        click();
                        $rootScope.$digest();
                        expect(certificationDataService.decisions.addBulkDecision).toHaveBeenCalledWith(fakeDecision);
                    });

                    it('clears the selection model after bulk deciding', function () {
                        spyOn(checkboxMultiSelect.getSelectionModel(), 'clear');
                        click();
                        $rootScope.$digest();
                        expect(checkboxMultiSelect.getSelectionModel().clear).toHaveBeenCalled();
                    });

                    it('does not add a bulk decision if bulk deciding was cancelled', function () {
                        cancelDecision = true;
                        click();
                        $rootScope.$digest();
                        expect(certificationDataService.decisions.addBulkDecision).not.toHaveBeenCalled();
                    });

                    it('does not clear the selection model if bulk deciding was cancelled', function () {
                        cancelDecision = true;
                        spyOn(checkboxMultiSelect.getSelectionModel(), 'clear');
                        click();
                        $rootScope.$digest();
                        expect(checkboxMultiSelect.getSelectionModel().clear).not.toHaveBeenCalled();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlbGVjdG9yRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMscUNBQXFDLDRCQUE0QixVQUFVLFNBQVM7OztJQUdqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLG1DQUFtQztZQUNuRCxzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyw4Q0FBOEMsWUFBVzs7Z0JBRTlELElBQUksb0JBQW9CLHFFQUNwQixtRkFDQTtvQkFDQSxTQUFNO29CQUFFLFdBQVE7b0JBQUUsc0JBQW1CO29CQUFFLE9BQUk7b0JBQUUsYUFBVTtvQkFBRSxRQUFLOztnQkFFbEUsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTyxVQUFTLFlBQVksWUFBWSx1QkFBdUIsZUFBZSxxQkFDOUQsMEJBQTBCLG9CQUFvQjtvQkFDckUsU0FBUyxXQUFXO29CQUNwQixXQUFXOztvQkFFWCxPQUFPLElBQUksY0FBYyxzQkFBc0I7b0JBQy9DLHNCQUFzQixJQUFJOztvQkFFMUIsYUFBYTtvQkFDYixNQUFNLDBCQUEwQixrQkFBa0IsSUFBSSxTQUFTLFlBQU07d0JBQUUsT0FBTzs7O29CQUU5RSxRQUFRLElBQUksbUJBQW1CLEVBQUUsaUJBQWlCO29CQUNsRCxNQUFNLHFCQUFxQixVQUFVLFdBQVcsU0FBUzs7O2dCQUc3RCxTQUFTLGNBQWMsV0FBVztvQkFDOUIsSUFBSSxVQUFVLFFBQVEsUUFBUTtvQkFDOUIsT0FBTyxPQUFPO29CQUNkLE9BQU8sWUFBWTtvQkFDbkIsT0FBTyxzQkFBc0I7b0JBQzdCLE9BQU8sVUFBVTt3QkFDYixRQUFROztvQkFFWixPQUFPLFFBQVE7b0JBQ2YsU0FBUyxTQUFTO29CQUNsQixPQUFPO29CQUNQLE9BQU87OztnQkFHWCxTQUFTLGFBQWEsV0FB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TSxvQkFBb0IscUJBQXFCLG9CQUFvQixJQUFJLFlBQVk7NEJBQy9FLE1BQU0sWUFBQTtnQ0FnQ1UsT0FoQ0o7Ozt3QkFFaEIsTUFBTTt3QkFDTixPQUFPLFFBQVEsU0FBUzs7O29CQUc1QixHQUFHLG9CQUFvQixZQUFNO3dCQUN6Qjt3QkFDQSxPQUFPLGlDQUFpQyxZQUNwQyxxQkFBcUIsVUFBVSxJQUFJLG9CQUFvQixxQkFBcUIsT0FBTyxTQUFTLEdBQUc7OztvQkFHdkcsR0FBRyw0Q0FBNEMsWUFBTTt3QkFDakQ7d0JBQ0EsV0FBVzt3QkFDWCxPQUFPLHlCQUF5QixVQUFVLGlCQUFpQixxQkFBcUI7OztvQkFHcEYsR0FBRyxrREFBa0QsWUFBTTt3QkFDdkQsTUFBTSxvQkFBb0IscUJBQXFCO3dCQUMvQzt3QkFDQSxXQUFXO3dCQUNYLE9BQU8sb0JBQW9CLG9CQUFvQixPQUFPOzs7b0JBRzFELEdBQUcsK0RBQStELFlBQU07d0JBQ3BFLGlCQUFpQjt3QkFDakI7d0JBQ0EsV0FBVzt3QkFDWCxPQUFPLHlCQUF5QixVQUFVLGlCQUFpQixJQUFJOzs7b0JBR25FLEdBQUcscUVBQXFFLFlBQU07d0JBQzFFLGlCQUFpQjt3QkFDakIsTUFBTSxvQkFBb0IscUJBQXFCO3dCQUMvQzt3QkFDQSxXQUFXO3dCQUNYLE9BQU8sb0JBQW9CLG9CQUFvQixPQUFPLElBQUk7Ozs7OztHQXNDbkUiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VsZWN0b3JEaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xyXG5cclxuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcblxyXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlbGVjdG9yRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgbGV0IGVsZW1lbnREZWZpbml0aW9uID0gJzxzcC1jZXJ0aWZpY2F0aW9uLWJ1bGstZGVjaXNpb24tc2VsZWN0b3Igc3AtY2VydGlmaWNhdGlvbj1cImNlcnRcIicgK1xyXG4gICAgICAgICcgc3AtYnVsay1kZWNpc2lvbnM9XCJkZWNpc2lvbnMgXCIgc3AtY2hlY2tib3gtbXVsdGktc2VsZWN0PVwiY2hlY2tib3hNdWx0aVNlbGVjdFwiJyArXHJcbiAgICAgICAgJyBzcC1maWx0ZXItdmFsdWVzPVwiZmlsdGVyc1wiIHNwLXRhYmxlPVwidGFibGVcIiAvPicsXHJcbiAgICAgICAgJHNjb3BlLCAkY29tcGlsZSwgY2hlY2tib3hNdWx0aVNlbGVjdCwgY2VydCwgaXNSZWFkT25seSwgdGFibGU7XHJcblxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSkpO1xyXG5cclxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDcgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRyb290U2NvcGUsIF8kY29tcGlsZV8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSwgQ2VydGlmaWNhdGlvbiwgQ2hlY2tib3hNdWx0aVNlbGVjdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtU2VydmljZSwgQ2VydGlmaWNhdGlvblRhYmxlKSB7XHJcbiAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xyXG5cclxuICAgICAgICBjZXJ0ID0gbmV3IENlcnRpZmljYXRpb24oY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fMSk7XHJcbiAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdCA9IG5ldyBDaGVja2JveE11bHRpU2VsZWN0KCk7XHJcblxyXG4gICAgICAgIGlzUmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbVNlcnZpY2UsICdpc0l0ZW1SZWFkT25seScpLmFuZC5jYWxsRmFrZSgoKSA9PiB7IHJldHVybiBpc1JlYWRPbmx5OyB9KTtcclxuXHJcbiAgICAgICAgdGFibGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlKHsgY29sdW1uQ29uZmlnS2V5OiAnZm9vJyB9KTtcclxuICAgICAgICB0YWJsZS5nZXREYXRhVGFibGVDb25maWcoKS5wYWdlU3RhdGUucGFnaW5nRGF0YS5zZXRUb3RhbCgwKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGRlY2lzaW9ucykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcclxuICAgICAgICAkc2NvcGUuY2VydCA9IGNlcnQ7XHJcbiAgICAgICAgJHNjb3BlLmRlY2lzaW9ucyA9IGRlY2lzaW9ucztcclxuICAgICAgICAkc2NvcGUuY2hlY2tib3hNdWx0aVNlbGVjdCA9IGNoZWNrYm94TXVsdGlTZWxlY3Q7XHJcbiAgICAgICAgJHNjb3BlLmZpbHRlcnMgPSB7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJ3RoaXMnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUudGFibGUgPSB0YWJsZTtcclxuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZXN0U2VsZWN0b3IoZGVjaXNpb25zLCBleHBlY3RFbGVtZW50LCBleHBlY3RFbmFibGVkKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGRlY2lzaW9ucyk7XHJcbiAgICAgICAgbGV0IHNwYW4gPSBlbGVtZW50LmZpbmQoJyNidWxrRGVjaXNpb25TZWxlY3RvcicpO1xyXG5cclxuICAgICAgICBleHBlY3Qoc3Bhbi5sZW5ndGgpLnRvRXF1YWwoKGV4cGVjdEVsZW1lbnQpID8gMSA6IDApO1xyXG5cclxuICAgICAgICBpZiAoZXhwZWN0RWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGJ1dHRvbi5hdHRyKCdkaXNhYmxlZCcpKS50b0VxdWFsKCFleHBlY3RFbmFibGVkID8gJ2Rpc2FibGVkJyA6IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBpdCgnaXMgbm90IGRpc3BsYXllZCBpZiB0aGVyZSBhcmUgbm8gZGVjaXNpb25zJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBudWxsO1xyXG4gICAgICAgIHRlc3RTZWxlY3RvcihkZWNpc2lvbnMsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgbm90IGRpc3BsYXllZCBpZiB0aGUgY2VydCBpcyBub3QgZWRpdGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgY2VydC5lZGl0YWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRlc3RTZWxlY3RvcihbJ0RlY2lzaW9uMSddLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIGRpc3BsYXllZCBpZiB0aGVyZSBhcmUgYnVsayBkZWNpc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFsnQXBwcm92ZScsICdSZXZva2UnXTtcclxuICAgICAgICB0ZXN0U2VsZWN0b3IoZGVjaXNpb25zLCB0cnVlLCBmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgZW5hYmxlZCBpZiBpdGVtcyBhcmUgc2VsZWN0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFsnQXBwcm92ZSddO1xyXG4gICAgICAgIGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5hZGQoeyBpZDogJzEyMzQnLCBpc0NoYWxsZW5nZWRTdGF0ZTogKCkgPT4gZmFsc2UgfSk7XHJcbiAgICAgICAgdGVzdFNlbGVjdG9yKGRlY2lzaW9ucywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgZGlzYWJsZWQgaWYgbm8gaXRlbXMgYXJlIHNlbGVjdGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbJ0FwcHJvdmUnXTtcclxuICAgICAgICBzcHlPbihjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCksICdoYXNTZWxlY3Rpb25zJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcclxuICAgICAgICB0ZXN0U2VsZWN0b3IoZGVjaXNpb25zLCB0cnVlLCBmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgZGlzYWJsZWQgaWYgb25seSByZWFkIG9ubHkgaXRlbXMgYXJlIHNlbGVjdGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbJ0FwcHJvdmUnXTtcclxuICAgICAgICBjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuYWRkKHsgaWQ6ICcxMjM0JywgaXNDaGFsbGVuZ2VkU3RhdGU6ICgpID0+IGZhbHNlIH0pO1xyXG4gICAgICAgIGlzUmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgIHRlc3RTZWxlY3RvcihkZWNpc2lvbnMsIHRydWUsIGZhbHNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBkaXNhYmxlZCBpZiBzZWxlY3QgZXZlcnl0aGluZyB3YXMgY2hlY2tlZCwgYnV0IGFsbCBpdGVtcyB3ZXJlIHJlbW92ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gcHJldGVuZCB3ZSBzZWxlY3RlZCBldmVyeXRoaW5nXHJcbiAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmlzSW5jbHVkZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbJ0FwcHJvdmUnXTtcclxuICAgICAgICB0ZXN0U2VsZWN0b3IoZGVjaXNpb25zLCB0cnVlLCBmYWxzZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgZGlzYWJsZWQgaWYgc2VsZWN0ZWQgaXRlbSBpcyBjaGFsbGVuZ2VkJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBkZWNpc2lvbnMgPSBbJ1JlYXNzaWduJ107XHJcbiAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZCh7IGlkOiAnMTIzNCcsIGlzQ2hhbGxlbmdlZFN0YXRlOiAoKSA9PiB0cnVlIH0pO1xyXG4gICAgICAgIHRlc3RTZWxlY3RvcihkZWNpc2lvbnMsIHRydWUsIGZhbHNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdjb250YWlucyBhIG1lbnUgaXRlbSBmb3IgZWFjaCBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICBsZXQgZGVjaXNpb25zID0gWyAnYnVsazEnLCAnYnVsazInLCAnYnVsazMnIF07XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGRlY2lzaW9ucyk7XHJcblxyXG4gICAgICAgIGxldCBsaXN0SXRlbXMgPSBlbGVtZW50LmZpbmQoJ2xpJyk7XHJcbiAgICAgICAgZXhwZWN0KGxpc3RJdGVtcy5sZW5ndGgpLnRvRXF1YWwoZGVjaXNpb25zLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmNob3IgPSBhbmd1bGFyLmVsZW1lbnQobGlzdEl0ZW1zW2ldKS5maW5kKCdhJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbmNob3IudGV4dCgpLnRyaW0oKSkudG9FcXVhbCgnY2VydF9idWxrX2RlY2lzaW9uXycgKyBkZWNpc2lvbnNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG93cyBidXR0b24gd2l0aCBhY3Rpb24gbmFtZSBhbmQgaXRlbSBjb3VudCBpZiB0aGVyZSBpcyBvbmx5IG9uZSBkZWNpc2lvbiBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZCh7IGlkOiAnMTIzNCcsIGlzQ2hhbGxlbmdlZFN0YXRlOiAoKSA9PiBmYWxzZSB9KTtcclxuXHJcbiAgICAgICAgbGV0IGRlY2lzaW9ucyA9IFsnYnVsazEnXSxcclxuICAgICAgICAgICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoZGVjaXNpb25zKSxcclxuICAgICAgICAgICAgYnV0dG9uID0gZWxlbWVudC5maW5kKCdidXR0b24nKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcblxyXG4gICAgICAgIGxldCBidG5Jbm5lclRleHQgPSBidXR0b25bMF0uaW5uZXJUZXh0LnRyaW0oKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGJ0bklubmVyVGV4dC5zdGFydHNXaXRoKCdjZXJ0X2J1bGtfZGVjaXNpb25fJyArIGRlY2lzaW9uc1swXSkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGJ0bklubmVyVGV4dC5pbmRleE9mKCcxIHVpX3NlbGVjdGVkJykpLm5vdC50b0VxdWFsKC0xKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBsZXQgY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UsIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgJHJvb3RTY29wZSwgY2FuY2VsRGVjaXNpb24sIGZha2VEZWNpc2lvbixcclxuICAgICAgICAgICAgZWxlbWVudCwgc3BNb2RhbCwgJHEsIGhhc0RlY2lzaW9uO1xyXG5cclxuICAgICAgICBsZXQgZGVjaXNpb25zID0gWyAnZGVjaXNpb24xJywgJ1JlYXNzaWduJywgJ1Jldm9rZUFjY291bnQnIF07XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2VfLCBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXyRyb290U2NvcGVfLCBfJHFfLCBfc3BNb2RhbF8pID0+IHtcclxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2VfO1xyXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UgPSBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXztcclxuICAgICAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuICAgICAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAgICAgJHEgPSBfJHFfO1xyXG5cclxuICAgICAgICAgICAgLy8gTW9jayBvdXQgdGhlIGJ1bGsgZGVjaXNpb24gc2VydmljZSB0byByZXR1cm4gYSBwcm9taXNlLlxyXG4gICAgICAgICAgICBjYW5jZWxEZWNpc2lvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmYWtlRGVjaXNpb24gPSAnbG9vayBtYSAuLi4gbm8gaGFuZHMhJztcclxuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkJ1bGtEZWNpc2lvblNlcnZpY2UsICdidWxrRGVjaWRlJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjYW5jZWxEZWNpc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKGZha2VEZWNpc2lvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuZGVjaXNpb25zLCAnYWRkQnVsa0RlY2lzaW9uJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgYSBzZWxlY3Rpb24uXHJcbiAgICAgICAgICAgIGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5hZGQoe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICcxJyxcclxuICAgICAgICAgICAgICAgIGlzQ2hhbGxlbmdlZFN0YXRlOiAoKSA9PiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uU3RhdHVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzRGVjaXNpb246IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKCgpID0+IGhhc0RlY2lzaW9uKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaGFzRGVjaXNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGVsZW1lbnQuXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGRlY2lzaW9ucyk7XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbGljayhkZWNpc2lvbkluZGV4KSB7XHJcbiAgICAgICAgICAgIGxldCBhbmNob3JzID0gZWxlbWVudC5maW5kKCdhJyk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChhbmNob3JzW2RlY2lzaW9uSW5kZXggPyBkZWNpc2lvbkluZGV4IDogMF0pLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgncmVtb3ZlcyByZWFkIG9ubHkgc2VsZWN0aW9ucyBhbmQgZG9lcyBub3Qgc2F2ZSBkZWNpc2lvbiBpZiBlbXB0eScsICgpID0+IHtcclxuICAgICAgICAgICAgaXNSZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNsaWNrKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuZ2V0U2VsZWN0aW9uSWRzKCkpLm5vdC50b0NvbnRhaW4oJzEnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlLmJ1bGtEZWNpZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZW1vdmVzIGl0ZW1zIHRoYXQgZG8gbm90IGhhdmUgdGhlIGFjY291bnQgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGhhc0RlY2lzaW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNsaWNrKDIpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmdldFNlbGVjdGlvbklkcygpKS5ub3QudG9Db250YWluKCcxJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uQnVsa0RlY2lzaW9uU2VydmljZS5idWxrRGVjaWRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgY29uZmlybSBkaWFsb2cgd2hlbiBpdGVtcyBhcmUgZmlsdGVyZWQgZm9yIHJlYXNzaWduIGFjdGlvbicsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ2NvbmZpcm0nKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbigpKTtcclxuICAgICAgICAgICAgY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLmFkZCh7IGlkOiAnMicsIGlzQ2hhbGxlbmdlZFN0YXRlOiAoKSA9PiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgc3B5T24oY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLCAnZmlsdGVyU2VsZWN0aW9ucycpLmFuZC5yZXR1cm5WYWx1ZSh7XHJcbiAgICAgICAgICAgICAgICBzaXplOiAoKSA9PiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjbGljaygxKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwuY29uZmlybSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2FsbHMgYnVsa0RlY2lkZScsICgpID0+IHtcclxuICAgICAgICAgICAgY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25CdWxrRGVjaXNpb25TZXJ2aWNlLmJ1bGtEZWNpZGUpLlxyXG4gICAgICAgICAgICAgICAgdG9IYXZlQmVlbkNhbGxlZFdpdGgoZGVjaXNpb25zWzBdLCBjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCksICRzY29wZS5maWx0ZXJzLCAxLCB0YWJsZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdhZGRzIGEgYnVsayBkZWNpc2lvbiBhZnRlciBidWxrIGRlY2lkaW5nJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjbGljaygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25EYXRhU2VydmljZS5kZWNpc2lvbnMuYWRkQnVsa0RlY2lzaW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWtlRGVjaXNpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2xlYXJzIHRoZSBzZWxlY3Rpb24gbW9kZWwgYWZ0ZXIgYnVsayBkZWNpZGluZycsICgpID0+IHtcclxuICAgICAgICAgICAgc3B5T24oY2hlY2tib3hNdWx0aVNlbGVjdC5nZXRTZWxlY3Rpb25Nb2RlbCgpLCAnY2xlYXInKTtcclxuICAgICAgICAgICAgY2xpY2soKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCkuY2xlYXIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGFkZCBhIGJ1bGsgZGVjaXNpb24gaWYgYnVsayBkZWNpZGluZyB3YXMgY2FuY2VsbGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjYW5jZWxEZWNpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGNsaWNrKCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlLmRlY2lzaW9ucy5hZGRCdWxrRGVjaXNpb24pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBjbGVhciB0aGUgc2VsZWN0aW9uIG1vZGVsIGlmIGJ1bGsgZGVjaWRpbmcgd2FzIGNhbmNlbGxlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2FuY2VsRGVjaXNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBzcHlPbihjaGVja2JveE11bHRpU2VsZWN0LmdldFNlbGVjdGlvbk1vZGVsKCksICdjbGVhcicpO1xyXG4gICAgICAgICAgICBjbGljaygpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNoZWNrYm94TXVsdGlTZWxlY3QuZ2V0U2VsZWN0aW9uTW9kZWwoKS5jbGVhcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
