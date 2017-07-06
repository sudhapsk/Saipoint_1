System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/common/i18n/MockTranslateFilter'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCommonI18nMockTranslateFilter) {}],
        execute: function () {

            describe('CertificationItemCardDirective', function () {

                var $compile = undefined,
                    CertificationItem = undefined,
                    ColumnConfig = undefined,
                    spTranslateFilter = undefined,
                    $scope = undefined,
                    element = undefined,
                    item = undefined,
                    colKey = undefined,
                    actionData = undefined,
                    certificationItemDetailService = undefined,
                    hasDetails = undefined,
                    certId = undefined;

                beforeEach(module(certificationModule));

                /* jshint maxparams:12 */
                beforeEach(inject(function (_$compile_, $rootScope, _CertificationItem_, configService, _ColumnConfig_, _spTranslateFilter_, $q, certificationActionsFactoryService, CertificationActionStatus, CertificationActions, _certificationItemDetailService_, certificationDataService) {
                    $compile = _$compile_;
                    $scope = $rootScope.$new();
                    CertificationItem = _CertificationItem_;
                    ColumnConfig = _ColumnConfig_;
                    spTranslateFilter = _spTranslateFilter_;
                    certificationItemDetailService = _certificationItemDetailService_;

                    // Mock up the column configs.
                    colKey = 'someKey';
                    var colCfgs = [createColumnConfig('typeMessageKey'), createColumnConfig('summaryStatus'), createColumnConfig('decisions'), createColumnConfig('policyName'), createColumnConfig('policyViolationOwner'), createColumnConfig('application'), createColumnConfig('instance'), createColumnConfig('accountName'), createColumnConfig('comments')];
                    var data = {};
                    data[colKey] = colCfgs;
                    spyOn(configService, 'getColumnConfigEntries').and.returnValue($q.when({ data: data }));

                    // Mock the CertificationActionsFactoryService to return actions to make buttons.
                    actionData = {
                        status: 'foo',
                        promptKey: 'bar'
                    };
                    var actions = new CertificationActions([new CertificationActionStatus(actionData)], []);
                    spyOn(certificationActionsFactoryService, 'getCertificationActions').and.returnValue(actions);

                    hasDetails = true;
                    spyOn(certificationItemDetailService, 'hasDetails').and.callFake(function () {
                        return hasDetails;
                    });
                    certId = 'cert1';
                    spyOn(certificationDataService, 'getCertification').and.returnValue({
                        id: certId
                    });
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                    if ($scope) {
                        $scope.$destroy();
                    }
                });

                function createColumnConfig(colKey) {
                    var msg = colKey + '_msg';
                    spTranslateFilter.addMessage(colKey, msg);

                    return new ColumnConfig({
                        dataIndex: colKey,
                        headerKey: colKey
                    });
                }

                function createPolicyViolation() {
                    return new CertificationItem({
                        id: '872347',
                        type: CertificationItem.Type.PolicyViolation,
                        typeMessageKey: 'pv',
                        description: 'I am a policy violation',
                        policyName: 'no scrubs',
                        policyViolationRule: 'phil miller',
                        policyViolationOwner: 'tandy',
                        decisionStatus: {
                            decisions: [actionData]
                        }
                    });
                }

                function createRole() {
                    return new CertificationItem({
                        id: '9873478234',
                        type: CertificationItem.Type.Bundle,
                        typeMessageKey: 'rollin',
                        displayName: 'They see me rollin ... with my homies',
                        decisionStatus: {
                            decisions: [actionData]
                        }
                    });
                }

                function createEntitlement() {
                    return new CertificationItem({
                        id: '187388487363',
                        type: CertificationItem.Type.Exception,
                        typeMessageKey: 'exceptional',
                        displayName: 'Value entitlemented on fluffy bunnies',
                        application: 'entitled app',
                        accountName: 'entitleboy',
                        decisionStatus: {
                            decisions: [actionData]
                        }
                    });
                }

                function createAccount() {
                    return new CertificationItem({
                        id: '874378372884',
                        type: CertificationItem.Type.Account,
                        typeMessageKey: 'accounting',
                        application: 'accounting app',
                        accountName: 'accounter',
                        decisionStatus: {
                            decisions: [actionData]
                        }
                    });
                }

                function compile() {
                    var eltDef = '<sp-certification-item-card sp-item="item" sp-column-config-key="colKey" />';
                    element = angular.element(eltDef);

                    $scope.item = item;
                    $scope.colKey = colKey;

                    $compile(element)($scope);
                    $scope.$digest();

                    return element;
                }

                function checkTitle(expected) {
                    var title = element.find('.panel-title');
                    expect(title.length).toEqual(1);
                    var value = title.text().trim();
                    expect(value).toEqual(expected);
                }

                function getDetails(expectedNum) {
                    var deets = element.find('.list-group-item');
                    expect(deets.length).toEqual(expectedNum);
                    return deets;
                }

                function getDetailLabel(detail) {
                    var label = detail.find('.cert-item-card-label');
                    expect(label.length).toEqual(1);
                    return label.text().trim();
                }

                function getDetailValue(detail) {
                    var value = detail.find('.cert-item-card-value');
                    expect(value.length).toEqual(1);
                    return value.text().trim();
                }

                function checkDetailLabel(detail, expectedLabel) {
                    var label = getDetailLabel(detail);
                    expect(label).toEqual(expectedLabel);
                }

                function checkDetailValue(detail, expectedValue) {
                    var value = getDetailValue(detail);
                    expect(value).toEqual(expectedValue);
                }

                function checkDetail(details, idx, col) {
                    expect(idx < details.length).toBeTruthy();
                    var detail = angular.element(details[idx]);

                    // Check the label.
                    checkDetailLabel(detail, col + '_msg:');

                    // Check the value.
                    var expected = item[col];
                    checkDetailValue(detail, expected);
                }

                it('gets eviscerated when no item is given', function () {
                    expect(function () {
                        return compile();
                    }).toThrow();
                });

                it('longs for better days when no column config key is given', function () {
                    item = {};
                    colKey = null;
                    expect(function () {
                        return compile();
                    }).toThrow();
                });

                describe('warnings', function () {
                    function hasWarnings() {
                        var warnings = element.find('.panel-title .cert-item-warnings .text-danger');
                        return warnings.length > 0;
                    }

                    it('are displayed in title when available', function () {
                        item = createPolicyViolation();
                        item.unremovedRemediation = true;
                        compile();
                        expect(hasWarnings()).toEqual(true);
                    });

                    it('are not displayed in title when not available', function () {
                        item = createPolicyViolation();
                        compile();
                        expect(hasWarnings()).toEqual(false);
                    });
                });

                describe('description', function () {
                    function checkDescription(description) {
                        var body = element.find('.panel-body');
                        if (description) {
                            expect(body.length).toEqual(1);
                            expect(body.text().trim()).toEqual(item.description);
                        } else {
                            expect(body.length).toEqual(0);
                        }
                    }

                    it('is shown if available', function () {
                        item = createPolicyViolation();
                        compile();
                        checkDescription(item.description);
                    });

                    it('is not shown if unavailable', function () {
                        item = createPolicyViolation();
                        item.description = null;
                        compile();
                        checkDescription(null);
                    });
                });

                describe('policy violation', function () {
                    beforeEach(function () {
                        item = createPolicyViolation();
                    });

                    it('shows policy rule in title', function () {
                        compile();
                        checkTitle(item.policyViolationRule);
                    });

                    it('shows the type, policy name, and violation owner', function () {
                        compile();
                        var deets = getDetails(3);
                        checkDetail(deets, 0, 'typeMessageKey');
                        checkDetail(deets, 1, 'policyName');
                        checkDetail(deets, 2, 'policyViolationOwner');
                    });
                });

                describe('role', function () {
                    beforeEach(function () {
                        item = createRole();
                    });

                    it('shows role name in title', function () {
                        compile();
                        checkTitle(item.displayName);
                    });

                    it('shows the type', function () {
                        compile();
                        var deets = getDetails(1);
                        checkDetail(deets, 0, 'typeMessageKey');
                    });
                });

                describe('entitlement', function () {
                    beforeEach(function () {
                        item = createEntitlement();
                    });

                    it('shows the display name in the title', function () {
                        compile();
                        checkTitle(item.displayName);
                    });

                    it('shows the type, application, and account name', function () {
                        compile();
                        var deets = getDetails(3);
                        checkDetail(deets, 0, 'typeMessageKey');
                        checkDetail(deets, 1, 'application');
                        checkDetail(deets, 2, 'accountName');
                    });

                    it('shows the instance if available', function () {
                        item.instance = 'instance1';
                        compile();
                        var deets = getDetails(4);
                        checkDetail(deets, 2, 'instance');
                    });
                });

                describe('account', function () {
                    beforeEach(function () {
                        item = createAccount();
                    });

                    it('shows the account name in the title', function () {
                        compile();
                        checkTitle(item.accountName);
                    });

                    it('shows the type and application', function () {
                        compile();
                        var deets = getDetails(2);
                        checkDetail(deets, 0, 'typeMessageKey');
                        checkDetail(deets, 1, 'application');
                    });

                    it('shows the instance if available', function () {
                        item.instance = 'instance1';
                        compile();
                        var deets = getDetails(3);
                        checkDetail(deets, 2, 'instance');
                    });
                });

                describe('returned items', function () {
                    beforeEach(function () {
                        item = createRole();
                        item.decisions = 'do it!';
                    });

                    function testReturnedItem(status) {
                        item.summaryStatus = status;
                        compile();
                        var deets = getDetails(4);
                        checkDetail(deets, 1, 'summaryStatus');
                        checkDetail(deets, 3, 'decisions');
                    }

                    it('that are challenged show the summary status and decision', function () {
                        testReturnedItem(CertificationItem.Status.Challenged);
                    });

                    it('that are waiting review show the summary status and decision', function () {
                        testReturnedItem(CertificationItem.Status.WaitingReview);
                    });

                    it('that are returned show the summary status and decision', function () {
                        testReturnedItem(CertificationItem.Status.Returned);
                    });

                    describe('comments', function () {
                        beforeEach(function () {
                            spTranslateFilter.addMessage('cert_item_tbl_header_comment_from_user', 'Comments from {0}');
                            spTranslateFilter.addMessage('cert_item_tbl_header_comment', 'Comments');
                        });

                        function setComment(comment, isDelegation) {
                            item.attributes = {
                                comments: {}
                            };

                            var propName = isDelegation ? 'delegationComments' : 'challengeCompletionComments';
                            item.attributes.comments[propName] = comment;
                        }

                        function testComments(isDelegation, label) {
                            var status = isDelegation ? CertificationItem.Status.WaitingReview : CertificationItem.Status.Challenged;
                            var comment = 'yo adrian!';

                            item.summaryStatus = status;
                            setComment(comment, isDelegation);

                            compile();
                            var deets = getDetails(4);
                            var commentDetail = angular.element(deets[2]);
                            checkDetailLabel(commentDetail, label);
                            checkDetailValue(commentDetail, comment);
                        }

                        it('are displayed for delegations with the delegates name if available', function () {
                            var user = 'rocky balboa';
                            item.delegation.completionUser = user;
                            testComments(true, 'Comments from ' + user + ':');
                        });

                        it('are displayed for challenges with the challengers name if available', function () {
                            var user = 'rocky balboa';
                            item.challengeHistory.owner = 'rocky balboa';
                            testComments(false, 'Comments from ' + user + ':');
                        });

                        it('are displayed for delegations with generic message if no delegate name is available', function () {
                            testComments(true, 'Comments:');
                        });

                        it('are displayed for challenges with generic message if no challenger name is available', function () {
                            testComments(false, 'Comments:');
                        });
                    });
                });

                describe('decision', function () {
                    it('button and menu are displayed', function () {
                        var buttonsSelector = '.cert-action-column button';
                        var buttons = element.find(buttonsSelector);
                        expect(buttons.length).toEqual(2);

                        var actionButton = element.find(buttonsSelector + '.cert-action-' + actionData.status);
                        expect(actionButton.length).toEqual(1);

                        var menuButton = element.find(buttonsSelector + '.dropdown-toggle');
                        expect(menuButton.length).toEqual(1);
                    });
                });

                describe('details button', function () {
                    var DETAILS_BUTTON_SELECTOR = '.panel-heading button';
                    it('is is shown if there are details', function () {
                        compile();
                        var detailsButton = element.find(DETAILS_BUTTON_SELECTOR);
                        expect(detailsButton.length).toEqual(1);
                    });

                    it('is not shown if there are no details', function () {
                        hasDetails = false;
                        compile();
                        var detailsButton = element.find(DETAILS_BUTTON_SELECTOR);
                        expect(detailsButton.length).toEqual(0);
                    });

                    it('launches detail dialog when clicked', function () {
                        spyOn(certificationItemDetailService, 'showDetailDialog');
                        compile();
                        var detailsButton = element.find(DETAILS_BUTTON_SELECTOR);
                        angular.element(detailsButton).click();
                        $scope.$apply();
                        expect(certificationItemDetailService.showDetailDialog).toHaveBeenCalledWith(certId, item);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkl0ZW1DYXJkRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyw0Q0FBNEMsVUFBVSxTQUFTO0lBQzVJOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHNDQUFzQztRQUNuRCxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsa0NBQWtDLFlBQU07O2dCQUU3QyxJQUFJLFdBQVE7b0JBQUUsb0JBQWlCO29CQUFFLGVBQVk7b0JBQUUsb0JBQWlCO29CQUFFLFNBQU07b0JBQUUsVUFBTztvQkFBRSxPQUFJO29CQUFFLFNBQU07b0JBQUUsYUFBVTtvQkFDdkcsaUNBQThCO29CQUFFLGFBQVU7b0JBQUUsU0FBTTs7Z0JBRXRELFdBQVcsT0FBTzs7O2dCQUdsQixXQUFXLE9BQU8sVUFBQyxZQUFZLFlBQVkscUJBQXFCLGVBQWUsZ0JBQzVELHFCQUFxQixJQUFJLG9DQUFvQywyQkFDN0Qsc0JBQXNCLGtDQUFrQywwQkFBNkI7b0JBQ3BHLFdBQVc7b0JBQ1gsU0FBUyxXQUFXO29CQUNwQixvQkFBb0I7b0JBQ3BCLGVBQWU7b0JBQ2Ysb0JBQW9CO29CQUNwQixpQ0FBaUM7OztvQkFHakMsU0FBUztvQkFDVCxJQUFJLFVBQVUsQ0FDVixtQkFBbUIsbUJBQ25CLG1CQUFtQixrQkFDbkIsbUJBQW1CLGNBQ25CLG1CQUFtQixlQUNuQixtQkFBbUIseUJBQ25CLG1CQUFtQixnQkFDbkIsbUJBQW1CLGFBQ25CLG1CQUFtQixnQkFDbkIsbUJBQW1CO29CQUV2QixJQUFJLE9BQU87b0JBQ1gsS0FBSyxVQUFVO29CQUNmLE1BQU0sZUFBZSwwQkFBMEIsSUFBSSxZQUFZLEdBQUcsS0FBSyxFQUFFLE1BQU07OztvQkFHL0UsYUFBYTt3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d0JBRzVDLEdBQUcsdUVBQXVFLFlBQU07NEJBQzVFLElBQUksT0FBTzs0QkFDWCxLQUFLLGlCQUFpQixRQUFROzRCQUM5QixhQUFhLE9BQUssbUJBQW1CLE9BQUk7Ozt3QkFHN0MsR0FBRyx1RkFBdUYsWUFBTTs0QkFDNUYsYUFBYSxNQUFNOzs7d0JBR3ZCLEdBQUcsd0ZBQXdGLFlBQU07NEJBQzdGLGFBQWEsT0FBTzs7Ozs7Z0JBS2hDLFNBQVMsWUFBWSxZQUFNO29CQUN2QixHQUFHLGlDQUFpQyxZQUFNO3dCQUN0QyxJQUFNLGtCQUFrQjt3QkFDeEIsSUFBSSxVQUFVLFFBQVEsS0FBSzt3QkFDM0IsT0FBTyxRQUFRLFFBQVEsUUFBUTs7d0JBRS9CLElBQUksZUFBZSxRQUFRLEtBQVEsa0JBQWUsa0JBQWdCLFdBQVc7d0JBQzdFLE9BQU8sYUFBYSxRQUFRLFFBQVE7O3dCQUVwQyxJQUFJLGFBQWEsUUFBUSxLQUFRLGtCQUFlO3dCQUNoRCxPQUFPLFdBQVcsUUFBUSxRQUFROzs7O2dCQUkxQyxTQUFTLGtCQUFrQixZQUFNO29CQUM3QixJQUFNLDBCQUEwQjtvQkFDaEMsR0FBRyxvQ0FBb0MsWUFBTTt3QkFDekM7d0JBQ0EsSUFBSSxnQkFBZ0IsUUFBUSxLQUFLO3dCQUNqQyxPQUFPLGNBQWMsUUFBUSxRQUFROzs7b0JBR3pDLEdBQUcsd0NBQXdDLFlBQU07d0JBQzdDLGFBQWE7d0JBQ2I7d0JBQ0EsSUFBSSxnQkFBZ0IsUUFBUSxLQUFLO3dCQUNqQyxPQUFPLGNBQWMsUUFBUSxRQUFROzs7b0JBR3pDLEdBQUcsdUNBQXVDLFlBQU07d0JBQzVDLE1BQU0sZ0NBQWdDO3dCQUN0Qzt3QkFDQSxJQUFJLGdCQUFnQixRQUFRLEtBQUs7d0JBQ2pDLFFBQVEsUUFBUSxlQUFlO3dCQUMvQixPQUFPO3dCQUNQLE9BQU8sK0JBQStCLGtCQUFrQixxQkFBcUIsUUFBUTs7Ozs7O0dBYTlGIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkl0ZW1DYXJkRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcclxuaW1wb3J0ICd0ZXN0L2pzL2NvbW1vbi9pMThuL01vY2tUcmFuc2xhdGVGaWx0ZXInO1xyXG5cclxuZGVzY3JpYmUoJ0NlcnRpZmljYXRpb25JdGVtQ2FyZERpcmVjdGl2ZScsICgpID0+IHtcclxuXHJcbiAgICBsZXQgJGNvbXBpbGUsIENlcnRpZmljYXRpb25JdGVtLCBDb2x1bW5Db25maWcsIHNwVHJhbnNsYXRlRmlsdGVyLCAkc2NvcGUsIGVsZW1lbnQsIGl0ZW0sIGNvbEtleSwgYWN0aW9uRGF0YSxcclxuICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UsIGhhc0RldGFpbHMsIGNlcnRJZDtcclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XHJcblxyXG4gICAgLyoganNoaW50IG1heHBhcmFtczoxMiAqL1xyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF8kY29tcGlsZV8sICRyb290U2NvcGUsIF9DZXJ0aWZpY2F0aW9uSXRlbV8sIGNvbmZpZ1NlcnZpY2UsIF9Db2x1bW5Db25maWdfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIF9zcFRyYW5zbGF0ZUZpbHRlcl8sICRxLCBjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLCBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIENlcnRpZmljYXRpb25BY3Rpb25zLCBfY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlXywgY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcclxuICAgICAgICBDb2x1bW5Db25maWcgPSBfQ29sdW1uQ29uZmlnXztcclxuICAgICAgICBzcFRyYW5zbGF0ZUZpbHRlciA9IF9zcFRyYW5zbGF0ZUZpbHRlcl87XHJcbiAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlID0gX2NlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZV87XHJcblxyXG4gICAgICAgIC8vIE1vY2sgdXAgdGhlIGNvbHVtbiBjb25maWdzLlxyXG4gICAgICAgIGNvbEtleSA9ICdzb21lS2V5JztcclxuICAgICAgICBsZXQgY29sQ2ZncyA9IFtcclxuICAgICAgICAgICAgY3JlYXRlQ29sdW1uQ29uZmlnKCd0eXBlTWVzc2FnZUtleScpLFxyXG4gICAgICAgICAgICBjcmVhdGVDb2x1bW5Db25maWcoJ3N1bW1hcnlTdGF0dXMnKSxcclxuICAgICAgICAgICAgY3JlYXRlQ29sdW1uQ29uZmlnKCdkZWNpc2lvbnMnKSxcclxuICAgICAgICAgICAgY3JlYXRlQ29sdW1uQ29uZmlnKCdwb2xpY3lOYW1lJyksXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbHVtbkNvbmZpZygncG9saWN5VmlvbGF0aW9uT3duZXInKSxcclxuICAgICAgICAgICAgY3JlYXRlQ29sdW1uQ29uZmlnKCdhcHBsaWNhdGlvbicpLFxyXG4gICAgICAgICAgICBjcmVhdGVDb2x1bW5Db25maWcoJ2luc3RhbmNlJyksXHJcbiAgICAgICAgICAgIGNyZWF0ZUNvbHVtbkNvbmZpZygnYWNjb3VudE5hbWUnKSxcclxuICAgICAgICAgICAgY3JlYXRlQ29sdW1uQ29uZmlnKCdjb21tZW50cycpXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgIGRhdGFbY29sS2V5XSA9IGNvbENmZ3M7XHJcbiAgICAgICAgc3B5T24oY29uZmlnU2VydmljZSwgJ2dldENvbHVtbkNvbmZpZ0VudHJpZXMnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih7IGRhdGE6IGRhdGEgfSkpO1xyXG5cclxuICAgICAgICAvLyBNb2NrIHRoZSBDZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlIHRvIHJldHVybiBhY3Rpb25zIHRvIG1ha2UgYnV0dG9ucy5cclxuICAgICAgICBhY3Rpb25EYXRhID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6ICdmb28nLFxyXG4gICAgICAgICAgICBwcm9tcHRLZXk6ICdiYXInXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgYWN0aW9ucyA9IG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9ucyhbIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKGFjdGlvbkRhdGEpIF0sIFtdKTtcclxuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uQWN0aW9uc0ZhY3RvcnlTZXJ2aWNlLCAnZ2V0Q2VydGlmaWNhdGlvbkFjdGlvbnMnKS5hbmQucmV0dXJuVmFsdWUoYWN0aW9ucyk7XHJcblxyXG4gICAgICAgIGhhc0RldGFpbHMgPSB0cnVlO1xyXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSwgJ2hhc0RldGFpbHMnKS5hbmQuY2FsbEZha2UoKCkgPT4gaGFzRGV0YWlscyk7XHJcbiAgICAgICAgY2VydElkID0gJ2NlcnQxJztcclxuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDZXJ0aWZpY2F0aW9uJykuYW5kLnJldHVyblZhbHVlKHtcclxuICAgICAgICAgICAgaWQ6IGNlcnRJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRzY29wZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVDb2x1bW5Db25maWcoY29sS2V5KSB7XHJcbiAgICAgICAgbGV0IG1zZyA9IGAke2NvbEtleX1fbXNnYDtcclxuICAgICAgICBzcFRyYW5zbGF0ZUZpbHRlci5hZGRNZXNzYWdlKGNvbEtleSwgbXNnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2x1bW5Db25maWcoe1xyXG4gICAgICAgICAgICBkYXRhSW5kZXg6IGNvbEtleSxcclxuICAgICAgICAgICAgaGVhZGVyS2V5OiBjb2xLZXlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVQb2xpY3lWaW9sYXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0aW9uSXRlbSh7XHJcbiAgICAgICAgICAgIGlkOiAnODcyMzQ3JyxcclxuICAgICAgICAgICAgdHlwZTogQ2VydGlmaWNhdGlvbkl0ZW0uVHlwZS5Qb2xpY3lWaW9sYXRpb24sXHJcbiAgICAgICAgICAgIHR5cGVNZXNzYWdlS2V5OiAncHYnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0kgYW0gYSBwb2xpY3kgdmlvbGF0aW9uJyxcclxuICAgICAgICAgICAgcG9saWN5TmFtZTogJ25vIHNjcnVicycsXHJcbiAgICAgICAgICAgIHBvbGljeVZpb2xhdGlvblJ1bGU6ICdwaGlsIG1pbGxlcicsXHJcbiAgICAgICAgICAgIHBvbGljeVZpb2xhdGlvbk93bmVyOiAndGFuZHknLFxyXG4gICAgICAgICAgICBkZWNpc2lvblN0YXR1czoge1xyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25zOiBbIGFjdGlvbkRhdGEgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUm9sZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENlcnRpZmljYXRpb25JdGVtKHtcclxuICAgICAgICAgICAgaWQ6ICc5ODczNDc4MjM0JyxcclxuICAgICAgICAgICAgdHlwZTogQ2VydGlmaWNhdGlvbkl0ZW0uVHlwZS5CdW5kbGUsXHJcbiAgICAgICAgICAgIHR5cGVNZXNzYWdlS2V5OiAncm9sbGluJyxcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdUaGV5IHNlZSBtZSByb2xsaW4gLi4uIHdpdGggbXkgaG9taWVzJyxcclxuICAgICAgICAgICAgZGVjaXNpb25TdGF0dXM6IHtcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uczogWyBhY3Rpb25EYXRhIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVudGl0bGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xyXG4gICAgICAgICAgICBpZDogJzE4NzM4ODQ4NzM2MycsXHJcbiAgICAgICAgICAgIHR5cGU6IENlcnRpZmljYXRpb25JdGVtLlR5cGUuRXhjZXB0aW9uLFxyXG4gICAgICAgICAgICB0eXBlTWVzc2FnZUtleTogJ2V4Y2VwdGlvbmFsJyxcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdWYWx1ZSBlbnRpdGxlbWVudGVkIG9uIGZsdWZmeSBidW5uaWVzJyxcclxuICAgICAgICAgICAgYXBwbGljYXRpb246ICdlbnRpdGxlZCBhcHAnLFxyXG4gICAgICAgICAgICBhY2NvdW50TmFtZTogJ2VudGl0bGVib3knLFxyXG4gICAgICAgICAgICBkZWNpc2lvblN0YXR1czoge1xyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25zOiBbIGFjdGlvbkRhdGEgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQWNjb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENlcnRpZmljYXRpb25JdGVtKHtcclxuICAgICAgICAgICAgaWQ6ICc4NzQzNzgzNzI4ODQnLFxyXG4gICAgICAgICAgICB0eXBlOiBDZXJ0aWZpY2F0aW9uSXRlbS5UeXBlLkFjY291bnQsXHJcbiAgICAgICAgICAgIHR5cGVNZXNzYWdlS2V5OiAnYWNjb3VudGluZycsXHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYWNjb3VudGluZyBhcHAnLFxyXG4gICAgICAgICAgICBhY2NvdW50TmFtZTogJ2FjY291bnRlcicsXHJcbiAgICAgICAgICAgIGRlY2lzaW9uU3RhdHVzOiB7XHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbnM6IFsgYWN0aW9uRGF0YSBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKCkge1xyXG4gICAgICAgIGxldCBlbHREZWYgPSBgPHNwLWNlcnRpZmljYXRpb24taXRlbS1jYXJkIHNwLWl0ZW09XCJpdGVtXCIgc3AtY29sdW1uLWNvbmZpZy1rZXk9XCJjb2xLZXlcIiAvPmA7XHJcbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbHREZWYpO1xyXG5cclxuICAgICAgICAkc2NvcGUuaXRlbSA9IGl0ZW07XHJcbiAgICAgICAgJHNjb3BlLmNvbEtleSA9IGNvbEtleTtcclxuXHJcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcclxuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja1RpdGxlKGV4cGVjdGVkKSB7XHJcbiAgICAgICAgbGV0IHRpdGxlID0gZWxlbWVudC5maW5kKCcucGFuZWwtdGl0bGUnKTtcclxuICAgICAgICBleHBlY3QodGl0bGUubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRpdGxlLnRleHQoKS50cmltKCk7XHJcbiAgICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKGV4cGVjdGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREZXRhaWxzKGV4cGVjdGVkTnVtKSB7XHJcbiAgICAgICAgbGV0IGRlZXRzID0gZWxlbWVudC5maW5kKCcubGlzdC1ncm91cC1pdGVtJyk7XHJcbiAgICAgICAgZXhwZWN0KGRlZXRzLmxlbmd0aCkudG9FcXVhbChleHBlY3RlZE51bSk7XHJcbiAgICAgICAgcmV0dXJuIGRlZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldERldGFpbExhYmVsKGRldGFpbCkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGRldGFpbC5maW5kKCcuY2VydC1pdGVtLWNhcmQtbGFiZWwnKTtcclxuICAgICAgICBleHBlY3QobGFiZWwubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIHJldHVybiBsYWJlbC50ZXh0KCkudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldERldGFpbFZhbHVlKGRldGFpbCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGRldGFpbC5maW5kKCcuY2VydC1pdGVtLWNhcmQtdmFsdWUnKTtcclxuICAgICAgICBleHBlY3QodmFsdWUubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS50ZXh0KCkudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrRGV0YWlsTGFiZWwoZGV0YWlsLCBleHBlY3RlZExhYmVsKSB7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gZ2V0RGV0YWlsTGFiZWwoZGV0YWlsKTtcclxuICAgICAgICBleHBlY3QobGFiZWwpLnRvRXF1YWwoZXhwZWN0ZWRMYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tEZXRhaWxWYWx1ZShkZXRhaWwsIGV4cGVjdGVkVmFsdWUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXREZXRhaWxWYWx1ZShkZXRhaWwpO1xyXG4gICAgICAgIGV4cGVjdCh2YWx1ZSkudG9FcXVhbChleHBlY3RlZFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja0RldGFpbChkZXRhaWxzLCBpZHgsIGNvbCkge1xyXG4gICAgICAgIGV4cGVjdChpZHggPCBkZXRhaWxzLmxlbmd0aCkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIGxldCBkZXRhaWwgPSBhbmd1bGFyLmVsZW1lbnQoZGV0YWlsc1tpZHhdKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdGhlIGxhYmVsLlxyXG4gICAgICAgIGNoZWNrRGV0YWlsTGFiZWwoZGV0YWlsLCBgJHtjb2x9X21zZzpgKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdGhlIHZhbHVlLlxyXG4gICAgICAgIGxldCBleHBlY3RlZCA9IGl0ZW1bY29sXTtcclxuICAgICAgICBjaGVja0RldGFpbFZhbHVlKGRldGFpbCwgZXhwZWN0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGl0KCdnZXRzIGV2aXNjZXJhdGVkIHdoZW4gbm8gaXRlbSBpcyBnaXZlbicsICgpID0+IHtcclxuICAgICAgICBleHBlY3QoKCkgPT4gY29tcGlsZSgpKS50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnbG9uZ3MgZm9yIGJldHRlciBkYXlzIHdoZW4gbm8gY29sdW1uIGNvbmZpZyBrZXkgaXMgZ2l2ZW4nLCAoKSA9PiB7XHJcbiAgICAgICAgaXRlbSA9IHt9O1xyXG4gICAgICAgIGNvbEtleSA9IG51bGw7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IGNvbXBpbGUoKSkudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3dhcm5pbmdzJywgKCkgPT4ge1xyXG4gICAgICAgIGZ1bmN0aW9uIGhhc1dhcm5pbmdzKCkge1xyXG4gICAgICAgICAgICBsZXQgd2FybmluZ3MgPSBlbGVtZW50LmZpbmQoJy5wYW5lbC10aXRsZSAuY2VydC1pdGVtLXdhcm5pbmdzIC50ZXh0LWRhbmdlcicpO1xyXG4gICAgICAgICAgICByZXR1cm4gKHdhcm5pbmdzLmxlbmd0aCA+IDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2FyZSBkaXNwbGF5ZWQgaW4gdGl0bGUgd2hlbiBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVQb2xpY3lWaW9sYXRpb24oKTtcclxuICAgICAgICAgICAgaXRlbS51bnJlbW92ZWRSZW1lZGlhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhc1dhcm5pbmdzKCkpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdhcmUgbm90IGRpc3BsYXllZCBpbiB0aXRsZSB3aGVuIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVQb2xpY3lWaW9sYXRpb24oKTtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFzV2FybmluZ3MoKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGVzY3JpcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tEZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgYm9keSA9IGVsZW1lbnQuZmluZCgnLnBhbmVsLWJvZHknKTtcclxuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYm9keS5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYm9keS50ZXh0KCkudHJpbSgpKS50b0VxdWFsKGl0ZW0uZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGJvZHkubGVuZ3RoKS50b0VxdWFsKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnaXMgc2hvd24gaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlUG9saWN5VmlvbGF0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgY2hlY2tEZXNjcmlwdGlvbihpdGVtLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCBzaG93biBpZiB1bmF2YWlsYWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZVBvbGljeVZpb2xhdGlvbigpO1xyXG4gICAgICAgICAgICBpdGVtLmRlc2NyaXB0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBjaGVja0Rlc2NyaXB0aW9uKG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3BvbGljeSB2aW9sYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBjcmVhdGVQb2xpY3lWaW9sYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHBvbGljeSBydWxlIGluIHRpdGxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgICAgIGNoZWNrVGl0bGUoaXRlbS5wb2xpY3lWaW9sYXRpb25SdWxlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSB0eXBlLCBwb2xpY3kgbmFtZSwgYW5kIHZpb2xhdGlvbiBvd25lcicsICgpID0+IHtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGVldHMgPSBnZXREZXRhaWxzKDMpO1xyXG4gICAgICAgICAgICBjaGVja0RldGFpbChkZWV0cywgMCwgJ3R5cGVNZXNzYWdlS2V5Jyk7XHJcbiAgICAgICAgICAgIGNoZWNrRGV0YWlsKGRlZXRzLCAxLCAncG9saWN5TmFtZScpO1xyXG4gICAgICAgICAgICBjaGVja0RldGFpbChkZWV0cywgMiwgJ3BvbGljeVZpb2xhdGlvbk93bmVyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncm9sZScsICgpID0+IHtcclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZVJvbGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHJvbGUgbmFtZSBpbiB0aXRsZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBjaGVja1RpdGxlKGl0ZW0uZGlzcGxheU5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2hvd3MgdGhlIHR5cGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRlZXRzID0gZ2V0RGV0YWlscygxKTtcclxuICAgICAgICAgICAgY2hlY2tEZXRhaWwoZGVldHMsIDAsICd0eXBlTWVzc2FnZUtleScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2VudGl0bGVtZW50JywgKCkgPT4ge1xyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlRW50aXRsZW1lbnQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBkaXNwbGF5IG5hbWUgaW4gdGhlIHRpdGxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgICAgIGNoZWNrVGl0bGUoaXRlbS5kaXNwbGF5TmFtZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyB0aGUgdHlwZSwgYXBwbGljYXRpb24sIGFuZCBhY2NvdW50IG5hbWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRlZXRzID0gZ2V0RGV0YWlscygzKTtcclxuICAgICAgICAgICAgY2hlY2tEZXRhaWwoZGVldHMsIDAsICd0eXBlTWVzc2FnZUtleScpO1xyXG4gICAgICAgICAgICBjaGVja0RldGFpbChkZWV0cywgMSwgJ2FwcGxpY2F0aW9uJyk7XHJcbiAgICAgICAgICAgIGNoZWNrRGV0YWlsKGRlZXRzLCAyLCAnYWNjb3VudE5hbWUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBpbnN0YW5jZSBpZiBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uaW5zdGFuY2UgPSAnaW5zdGFuY2UxJztcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGVldHMgPSBnZXREZXRhaWxzKDQpO1xyXG4gICAgICAgICAgICBjaGVja0RldGFpbChkZWV0cywgMiwgJ2luc3RhbmNlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnYWNjb3VudCcsICgpID0+IHtcclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgaXRlbSA9IGNyZWF0ZUFjY291bnQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3dzIHRoZSBhY2NvdW50IG5hbWUgaW4gdGhlIHRpdGxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgICAgIGNoZWNrVGl0bGUoaXRlbS5hY2NvdW50TmFtZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyB0aGUgdHlwZSBhbmQgYXBwbGljYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRlZXRzID0gZ2V0RGV0YWlscygyKTtcclxuICAgICAgICAgICAgY2hlY2tEZXRhaWwoZGVldHMsIDAsICd0eXBlTWVzc2FnZUtleScpO1xyXG4gICAgICAgICAgICBjaGVja0RldGFpbChkZWV0cywgMSwgJ2FwcGxpY2F0aW9uJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzaG93cyB0aGUgaW5zdGFuY2UgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmluc3RhbmNlID0gJ2luc3RhbmNlMSc7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRlZXRzID0gZ2V0RGV0YWlscygzKTtcclxuICAgICAgICAgICAgY2hlY2tEZXRhaWwoZGVldHMsIDIsICdpbnN0YW5jZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3JldHVybmVkIGl0ZW1zJywgKCkgPT4ge1xyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlUm9sZSgpO1xyXG4gICAgICAgICAgICBpdGVtLmRlY2lzaW9ucyA9ICdkbyBpdCEnO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0ZXN0UmV0dXJuZWRJdGVtKHN0YXR1cykge1xyXG4gICAgICAgICAgICBpdGVtLnN1bW1hcnlTdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRlZXRzID0gZ2V0RGV0YWlscyg0KTtcclxuICAgICAgICAgICAgY2hlY2tEZXRhaWwoZGVldHMsIDEsICdzdW1tYXJ5U3RhdHVzJyk7XHJcbiAgICAgICAgICAgIGNoZWNrRGV0YWlsKGRlZXRzLCAzLCAnZGVjaXNpb25zJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgndGhhdCBhcmUgY2hhbGxlbmdlZCBzaG93IHRoZSBzdW1tYXJ5IHN0YXR1cyBhbmQgZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RSZXR1cm5lZEl0ZW0oQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLkNoYWxsZW5nZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgndGhhdCBhcmUgd2FpdGluZyByZXZpZXcgc2hvdyB0aGUgc3VtbWFyeSBzdGF0dXMgYW5kIGRlY2lzaW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0UmV0dXJuZWRJdGVtKENlcnRpZmljYXRpb25JdGVtLlN0YXR1cy5XYWl0aW5nUmV2aWV3KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3RoYXQgYXJlIHJldHVybmVkIHNob3cgdGhlIHN1bW1hcnkgc3RhdHVzIGFuZCBkZWNpc2lvbicsICgpID0+IHtcclxuICAgICAgICAgICAgdGVzdFJldHVybmVkSXRlbShDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuUmV0dXJuZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnY29tbWVudHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIuYWRkTWVzc2FnZSgnY2VydF9pdGVtX3RibF9oZWFkZXJfY29tbWVudF9mcm9tX3VzZXInLCAnQ29tbWVudHMgZnJvbSB7MH0nKTtcclxuICAgICAgICAgICAgICAgIHNwVHJhbnNsYXRlRmlsdGVyLmFkZE1lc3NhZ2UoJ2NlcnRfaXRlbV90YmxfaGVhZGVyX2NvbW1lbnQnLCAnQ29tbWVudHMnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRDb21tZW50KGNvbW1lbnQsIGlzRGVsZWdhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcE5hbWUgPSAoaXNEZWxlZ2F0aW9uKSA/ICdkZWxlZ2F0aW9uQ29tbWVudHMnIDogJ2NoYWxsZW5nZUNvbXBsZXRpb25Db21tZW50cyc7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMuY29tbWVudHNbcHJvcE5hbWVdID0gY29tbWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdGVzdENvbW1lbnRzKGlzRGVsZWdhdGlvbiwgbGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdGF0dXMgPVxyXG4gICAgICAgICAgICAgICAgICAgIChpc0RlbGVnYXRpb24pID8gQ2VydGlmaWNhdGlvbkl0ZW0uU3RhdHVzLldhaXRpbmdSZXZpZXcgOiBDZXJ0aWZpY2F0aW9uSXRlbS5TdGF0dXMuQ2hhbGxlbmdlZDtcclxuICAgICAgICAgICAgICAgIGxldCBjb21tZW50ID0gJ3lvIGFkcmlhbiEnO1xyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3VtbWFyeVN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgICAgICAgICAgIHNldENvbW1lbnQoY29tbWVudCwgaXNEZWxlZ2F0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb21waWxlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVldHMgPSBnZXREZXRhaWxzKDQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbW1lbnREZXRhaWwgPSBhbmd1bGFyLmVsZW1lbnQoZGVldHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEZXRhaWxMYWJlbChjb21tZW50RGV0YWlsLCBsYWJlbCk7XHJcbiAgICAgICAgICAgICAgICBjaGVja0RldGFpbFZhbHVlKGNvbW1lbnREZXRhaWwsIGNvbW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdCgnYXJlIGRpc3BsYXllZCBmb3IgZGVsZWdhdGlvbnMgd2l0aCB0aGUgZGVsZWdhdGVzIG5hbWUgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVzZXIgPSAncm9ja3kgYmFsYm9hJztcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGVsZWdhdGlvbi5jb21wbGV0aW9uVXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgICB0ZXN0Q29tbWVudHModHJ1ZSwgYENvbW1lbnRzIGZyb20gJHt1c2VyfTpgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnYXJlIGRpc3BsYXllZCBmb3IgY2hhbGxlbmdlcyB3aXRoIHRoZSBjaGFsbGVuZ2VycyBuYW1lIGlmIGF2YWlsYWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VyID0gJ3JvY2t5IGJhbGJvYSc7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNoYWxsZW5nZUhpc3Rvcnkub3duZXIgPSAncm9ja3kgYmFsYm9hJztcclxuICAgICAgICAgICAgICAgIHRlc3RDb21tZW50cyhmYWxzZSwgYENvbW1lbnRzIGZyb20gJHt1c2VyfTpgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnYXJlIGRpc3BsYXllZCBmb3IgZGVsZWdhdGlvbnMgd2l0aCBnZW5lcmljIG1lc3NhZ2UgaWYgbm8gZGVsZWdhdGUgbmFtZSBpcyBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0Q29tbWVudHModHJ1ZSwgJ0NvbW1lbnRzOicpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdhcmUgZGlzcGxheWVkIGZvciBjaGFsbGVuZ2VzIHdpdGggZ2VuZXJpYyBtZXNzYWdlIGlmIG5vIGNoYWxsZW5nZXIgbmFtZSBpcyBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0Q29tbWVudHMoZmFsc2UsICdDb21tZW50czonKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGVjaXNpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2J1dHRvbiBhbmQgbWVudSBhcmUgZGlzcGxheWVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBidXR0b25zU2VsZWN0b3IgPSAnLmNlcnQtYWN0aW9uLWNvbHVtbiBidXR0b24nO1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9ucyA9IGVsZW1lbnQuZmluZChidXR0b25zU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICBleHBlY3QoYnV0dG9ucy5sZW5ndGgpLnRvRXF1YWwoMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWN0aW9uQnV0dG9uID0gZWxlbWVudC5maW5kKGAke2J1dHRvbnNTZWxlY3Rvcn0uY2VydC1hY3Rpb24tJHthY3Rpb25EYXRhLnN0YXR1c31gKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdGlvbkJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVudUJ1dHRvbiA9IGVsZW1lbnQuZmluZChgJHtidXR0b25zU2VsZWN0b3J9LmRyb3Bkb3duLXRvZ2dsZWApO1xyXG4gICAgICAgICAgICBleHBlY3QobWVudUJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZGV0YWlscyBidXR0b24nLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgREVUQUlMU19CVVRUT05fU0VMRUNUT1IgPSAnLnBhbmVsLWhlYWRpbmcgYnV0dG9uJztcclxuICAgICAgICBpdCgnaXMgaXMgc2hvd24gaWYgdGhlcmUgYXJlIGRldGFpbHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRldGFpbHNCdXR0b24gPSBlbGVtZW50LmZpbmQoREVUQUlMU19CVVRUT05fU0VMRUNUT1IpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGV0YWlsc0J1dHRvbi5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyBub3Qgc2hvd24gaWYgdGhlcmUgYXJlIG5vIGRldGFpbHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGhhc0RldGFpbHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGV0YWlsc0J1dHRvbiA9IGVsZW1lbnQuZmluZChERVRBSUxTX0JVVFRPTl9TRUxFQ1RPUik7XHJcbiAgICAgICAgICAgIGV4cGVjdChkZXRhaWxzQnV0dG9uLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2xhdW5jaGVzIGRldGFpbCBkaWFsb2cgd2hlbiBjbGlja2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UsICdzaG93RGV0YWlsRGlhbG9nJyk7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoKTtcclxuICAgICAgICAgICAgbGV0IGRldGFpbHNCdXR0b24gPSBlbGVtZW50LmZpbmQoREVUQUlMU19CVVRUT05fU0VMRUNUT1IpO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZGV0YWlsc0J1dHRvbikuY2xpY2soKTtcclxuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dEZXRhaWxEaWFsb2cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnRJZCwgaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
