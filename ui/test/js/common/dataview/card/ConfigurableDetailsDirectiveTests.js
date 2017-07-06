System.register(['test/js/TestInitializer', 'common/dataview/card/CardModule', 'test/js/common/i18n/MockTranslateFilter'], function (_export) {
    'use strict';

    var cardModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewCardCardModule) {
            cardModule = _commonDataviewCardCardModule['default'];
        }, function (_testJsCommonI18nMockTranslateFilter) {}],
        execute: function () {

            describe('ConfigurableDetailsDirective', function () {

                var $scope,
                    $compile,
                    roleData = {
                    id: '1',
                    name: 'They see me role-in',
                    displayableName: 'with my homies',
                    owner: 'Chamillionaire',
                    description: 'just ridin dirty',
                    riskScoreWeight: 800,
                    accessType: 'Role'
                },
                    entitlementData = {
                    id: '2',
                    displayableName: 'Poppin dat cris',
                    owner: 'J Mon$y',
                    description: 'go to work',
                    application: 'Bar',
                    accessType: 'Entitlement'
                },
                    role,
                    entitlement,
                    ColumnConfig,
                    columnConfigs,
                    elementDefinition = '<sp-configurable-details ng-model="testModel" ' + 'sp-col-configs="columnConfigs[\'{0}\']"/>',
                    createElement = function (model, elDef) {
                    var element;
                    elDef = elDef || elementDefinition;
                    $scope.testModel = model;
                    $scope.columnConfigs = columnConfigs;
                    element = angular.element(elDef.replace('{0}', model.getAccessType()));
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                },
                    setupSpies = function (model) {
                    spyOn(model, 'getDescription').and.callThrough();
                    spyOn(model, 'getApplication').and.callThrough();
                    spyOn(model, 'getRiskScoreWeight').and.callThrough();
                    spyOn(model, 'getOwner').and.callThrough();
                };

                function MockModel(data) {
                    this.description = data.description;
                    this.application = data.application;
                    this.riskScoreWeight = data.riskScoreWeight;
                    this.owner = data.owner;
                    this.accessType = data.accessType;
                    this.displayableName = data.displayableName;

                    this.getDescription = function () {
                        return this.description;
                    };

                    this.getApplication = function () {
                        return this.application;
                    };

                    this.getRiskScoreWeight = function () {
                        return this.riskScoreWeight;
                    };

                    this.getOwner = function () {
                        return this.owner;
                    };

                    this.getAccessType = function () {
                        return this.accessType;
                    };
                }

                beforeEach(module(cardModule));

                beforeEach(inject(function (_$rootScope_, _$compile_, _ColumnConfig_, spTranslateFilter) {
                    $scope = _$rootScope_.$new();
                    $compile = _$compile_;

                    // Mock spTranslate to test localization
                    spTranslateFilter.configureCatalog({
                        'ui_read_more': 'READ MORE',
                        'ui_read_less': 'READ LESS',
                        'ui_access_type': 'ACCESS TYPE',
                        'ui_access_application': 'APPLICATION',
                        'ui_access_owner': 'OWNER',
                        'ui_access_risk': 'RISK SCORE'
                    });

                    role = new MockModel(roleData);
                    entitlement = new MockModel(entitlementData);
                    ColumnConfig = _ColumnConfig_;

                    columnConfigs = {
                        'Entitlement': [new ColumnConfig({ dataIndex: 'displayableName' }), new ColumnConfig({ dataIndex: 'owner' }), new ColumnConfig({ dataIndex: 'application' })],
                        'Role': [new ColumnConfig({ dataIndex: 'displayableName' }), new ColumnConfig({ dataIndex: 'owner' }), new ColumnConfig({ dataIndex: 'riskScoreWeight', renderer: 'risk' })]
                    };
                }));

                it('should show entitlement details', function () {
                    setupSpies(entitlement);
                    var element = createElement(entitlement);

                    expect(entitlement.getApplication).toHaveBeenCalled();
                    expect(entitlement.getDescription).toHaveBeenCalled();
                    expect(entitlement.getOwner).toHaveBeenCalled();

                    //Entitlement has no risk score info
                    expect(entitlement.getRiskScoreWeight).not.toHaveBeenCalled();

                    var cardDataItems = element.find('span.sp-card-data-item-value');
                    expect(cardDataItems.length).toEqual(3);
                    var descriptionElement = element.find('go to work');
                    expect(descriptionElement).not.toBeNull();
                });

                it('should show entitlement details without getDescription method', function () {
                    setupSpies(entitlement);
                    entitlement.getDescription = undefined;
                    var element = createElement(entitlement);

                    expect(entitlement.getApplication).toHaveBeenCalled();
                    expect(entitlement.getOwner).toHaveBeenCalled();

                    //Entitlement has no risk score info
                    expect(entitlement.getRiskScoreWeight).not.toHaveBeenCalled();

                    var cardDataItems = element.find('span.sp-card-data-item-value');
                    expect(cardDataItems.length).toEqual(3);
                    var descriptionElement = element.find('go to work');
                    expect(descriptionElement).not.toBeNull();
                });

                it('should show role details', function () {
                    setupSpies(role);
                    var element = createElement(role);

                    expect(role.getDescription).toHaveBeenCalled();

                    //Role has no application
                    expect(role.getApplication).not.toHaveBeenCalled();
                    expect(role.getOwner).toHaveBeenCalled();

                    //Role with risk score info
                    expect(role.getRiskScoreWeight).toHaveBeenCalled();

                    var cardDataItems = element.find('span.sp-card-data-item-value');
                    expect(cardDataItems.length).toEqual(3);

                    // Risk filter should apply risk score class
                    expect(angular.element(cardDataItems[2]).find('.label.risk.risk-high').length).toEqual(1);
                });

                it('includes any elements at top of card', function () {
                    var elDef = '<sp-configurable-details ng-model="testModel" ' + '                                sp-col-configs="columnConfigs[\'{0}\']">' + ' <span id="himom">HI MOM!</span>' + '</sp-configurable-details>',
                        element = createElement(role, elDef),
                        hiMom = element.find('#himom');

                    expect(hiMom).toBeTruthy();
                    expect(hiMom.text()).toEqual('HI MOM!');
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy9jYXJkL0NvbmZpZ3VyYWJsZURldGFpbHNEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsbUNBQW1DLDRDQUE0QyxVQUFVLFNBQVM7SUFDMUk7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLCtCQUErQjtZQUNyRixhQUFhLDhCQUE4QjtXQUM1QyxVQUFVLHNDQUFzQztRQUNuRCxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsZ0NBQWdDLFlBQVc7O2dCQUVoRCxJQUFJO29CQUNBO29CQUNBLFdBQVc7b0JBQ1AsSUFBSTtvQkFDSixNQUFNO29CQUNOLGlCQUFpQjtvQkFDakIsT0FBTztvQkFDUCxhQUFhO29CQUNiLGlCQUFpQjtvQkFDakIsWUFBWTs7b0JBRWhCLGtCQUFrQjtvQkFDZCxJQUFJO29CQUNKLGlCQUFpQjtvQkFDakIsT0FBTztvQkFDUCxhQUFhO29CQUNiLGFBQWE7b0JBQ2IsWUFBWTs7b0JBRWhCO29CQUNBO29CQUNBO29CQUNBO29CQUNBLG9CQUFvQixtREFDaEI7b0JBQ0osZ0JBQWdCLFVBQVMsT0FBTyxPQUFPO29CQUNuQyxJQUFJO29CQUNKLFFBQVEsU0FBUztvQkFDakIsT0FBTyxZQUFZO29CQUNuQixPQUFPLGdCQUFnQjtvQkFDdkIsVUFBVSxRQUFRLFFBQVEsTUFBTSxRQUFRLE9BQU8sTUFBTTtvQkFDckQsU0FBUyxTQUFTO29CQUNsQixPQUFPO29CQUNQLE9BQU87O29CQUVYLGFBQWEsVUFBUyxPQUFPO29CQUN6QixNQUFNLE9BQU8sa0JBQWtCLElBQUk7b0JBQ25DLE1BQU0sT0FBTyxrQkFBa0IsSUFBSTtvQkFDbkMsTUFBTSxPQUFPLHNCQUFzQixJQUFJO29CQUN2QyxNQUFNLE9BQU8sWUFBWSxJQUFJOzs7Z0JBR3JDLFNBQVMsVUFBVSxNQUFNO29CQUNyQixLQUFLLGNBQWMs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bmZpZ3VyYWJsZURldGFpbHNEaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNhcmRNb2R1bGUgZnJvbSAnY29tbW9uL2RhdGF2aWV3L2NhcmQvQ2FyZE1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvY29tbW9uL2kxOG4vTW9ja1RyYW5zbGF0ZUZpbHRlcic7XG5cbmRlc2NyaWJlKCdDb25maWd1cmFibGVEZXRhaWxzRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgJHNjb3BlLFxuICAgICAgICAkY29tcGlsZSxcbiAgICAgICAgcm9sZURhdGEgPSB7XG4gICAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgICAgbmFtZTogJ1RoZXkgc2VlIG1lIHJvbGUtaW4nLFxuICAgICAgICAgICAgZGlzcGxheWFibGVOYW1lOiAnd2l0aCBteSBob21pZXMnLFxuICAgICAgICAgICAgb3duZXI6ICdDaGFtaWxsaW9uYWlyZScsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2p1c3QgcmlkaW4gZGlydHknLFxuICAgICAgICAgICAgcmlza1Njb3JlV2VpZ2h0OiA4MDAsXG4gICAgICAgICAgICBhY2Nlc3NUeXBlOiAnUm9sZSdcbiAgICAgICAgfSxcbiAgICAgICAgZW50aXRsZW1lbnREYXRhID0ge1xuICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlTmFtZTogJ1BvcHBpbiBkYXQgY3JpcycsXG4gICAgICAgICAgICBvd25lcjogJ0ogTW9uJHknLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdnbyB0byB3b3JrJyxcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnQmFyJyxcbiAgICAgICAgICAgIGFjY2Vzc1R5cGU6ICdFbnRpdGxlbWVudCdcbiAgICAgICAgfSxcbiAgICAgICAgcm9sZSxcbiAgICAgICAgZW50aXRsZW1lbnQsXG4gICAgICAgIENvbHVtbkNvbmZpZyxcbiAgICAgICAgY29sdW1uQ29uZmlncyxcbiAgICAgICAgZWxlbWVudERlZmluaXRpb24gPSAnPHNwLWNvbmZpZ3VyYWJsZS1kZXRhaWxzIG5nLW1vZGVsPVwidGVzdE1vZGVsXCIgJyArXG4gICAgICAgICAgICAnc3AtY29sLWNvbmZpZ3M9XCJjb2x1bW5Db25maWdzW1xcJ3swfVxcJ11cIi8+JyxcbiAgICAgICAgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKG1vZGVsLCBlbERlZikge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICBlbERlZiA9IGVsRGVmIHx8IGVsZW1lbnREZWZpbml0aW9uO1xuICAgICAgICAgICAgJHNjb3BlLnRlc3RNb2RlbCA9IG1vZGVsO1xuICAgICAgICAgICAgJHNjb3BlLmNvbHVtbkNvbmZpZ3MgPSBjb2x1bW5Db25maWdzO1xuICAgICAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChlbERlZi5yZXBsYWNlKCd7MH0nLCBtb2RlbC5nZXRBY2Nlc3NUeXBlKCkpKTtcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0dXBTcGllcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgICBzcHlPbihtb2RlbCwgJ2dldERlc2NyaXB0aW9uJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBzcHlPbihtb2RlbCwgJ2dldEFwcGxpY2F0aW9uJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBzcHlPbihtb2RlbCwgJ2dldFJpc2tTY29yZVdlaWdodCcpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgc3B5T24obW9kZWwsICdnZXRPd25lcicpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICB9O1xuXG4gICAgZnVuY3Rpb24gTW9ja01vZGVsKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMuYXBwbGljYXRpb24gPSBkYXRhLmFwcGxpY2F0aW9uO1xuICAgICAgICB0aGlzLnJpc2tTY29yZVdlaWdodCA9IGRhdGEucmlza1Njb3JlV2VpZ2h0O1xuICAgICAgICB0aGlzLm93bmVyID0gZGF0YS5vd25lcjtcbiAgICAgICAgdGhpcy5hY2Nlc3NUeXBlID0gZGF0YS5hY2Nlc3NUeXBlO1xuICAgICAgICB0aGlzLmRpc3BsYXlhYmxlTmFtZSA9IGRhdGEuZGlzcGxheWFibGVOYW1lO1xuXG4gICAgICAgIHRoaXMuZ2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0QXBwbGljYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0Umlza1Njb3JlV2VpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yaXNrU2NvcmVXZWlnaHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRPd25lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3duZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRBY2Nlc3NUeXBlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NUeXBlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNhcmRNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgXyRjb21waWxlXywgX0NvbHVtbkNvbmZpZ18sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIpIHtcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfLiRuZXcoKTtcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuXG4gICAgICAgIC8vIE1vY2sgc3BUcmFuc2xhdGUgdG8gdGVzdCBsb2NhbGl6YXRpb25cbiAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIuY29uZmlndXJlQ2F0YWxvZyh7XG4gICAgICAgICAgICAndWlfcmVhZF9tb3JlJzogJ1JFQUQgTU9SRScsXG4gICAgICAgICAgICAndWlfcmVhZF9sZXNzJzogJ1JFQUQgTEVTUycsXG4gICAgICAgICAgICAndWlfYWNjZXNzX3R5cGUnOiAnQUNDRVNTIFRZUEUnLFxuICAgICAgICAgICAgJ3VpX2FjY2Vzc19hcHBsaWNhdGlvbic6ICdBUFBMSUNBVElPTicsXG4gICAgICAgICAgICAndWlfYWNjZXNzX293bmVyJzogJ09XTkVSJyxcbiAgICAgICAgICAgICd1aV9hY2Nlc3Nfcmlzayc6ICdSSVNLIFNDT1JFJ1xuICAgICAgICB9KTtcblxuICAgICAgICByb2xlID0gbmV3IE1vY2tNb2RlbChyb2xlRGF0YSk7XG4gICAgICAgIGVudGl0bGVtZW50ID0gbmV3IE1vY2tNb2RlbChlbnRpdGxlbWVudERhdGEpO1xuICAgICAgICBDb2x1bW5Db25maWcgPSBfQ29sdW1uQ29uZmlnXztcblxuICAgICAgICBjb2x1bW5Db25maWdzID0ge1xuICAgICAgICAgICAgJ0VudGl0bGVtZW50JzogW1xuICAgICAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoe2RhdGFJbmRleDogJ2Rpc3BsYXlhYmxlTmFtZSd9KSxcbiAgICAgICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtkYXRhSW5kZXg6ICdvd25lcid9KSxcbiAgICAgICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtkYXRhSW5kZXg6ICdhcHBsaWNhdGlvbid9KVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdSb2xlJzogW1xuICAgICAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoe2RhdGFJbmRleDogJ2Rpc3BsYXlhYmxlTmFtZSd9KSxcbiAgICAgICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtkYXRhSW5kZXg6ICdvd25lcid9KSxcbiAgICAgICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtkYXRhSW5kZXg6ICdyaXNrU2NvcmVXZWlnaHQnLCByZW5kZXJlcjogJ3Jpc2snfSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZW50aXRsZW1lbnQgZGV0YWlscycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXR1cFNwaWVzKGVudGl0bGVtZW50KTtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGVudGl0bGVtZW50KTtcblxuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnQuZ2V0QXBwbGljYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgZXhwZWN0KGVudGl0bGVtZW50LmdldERlc2NyaXB0aW9uKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGV4cGVjdChlbnRpdGxlbWVudC5nZXRPd25lcikudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gICAgICAgIC8vRW50aXRsZW1lbnQgaGFzIG5vIHJpc2sgc2NvcmUgaW5mb1xuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnQuZ2V0Umlza1Njb3JlV2VpZ2h0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gICAgICAgIHZhciBjYXJkRGF0YUl0ZW1zID0gZWxlbWVudC5maW5kKCdzcGFuLnNwLWNhcmQtZGF0YS1pdGVtLXZhbHVlJyk7XG4gICAgICAgIGV4cGVjdChjYXJkRGF0YUl0ZW1zLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uRWxlbWVudCA9IGVsZW1lbnQuZmluZCgnZ28gdG8gd29yaycpO1xuICAgICAgICBleHBlY3QoZGVzY3JpcHRpb25FbGVtZW50KS5ub3QudG9CZU51bGwoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlbnRpdGxlbWVudCBkZXRhaWxzIHdpdGhvdXQgZ2V0RGVzY3JpcHRpb24gbWV0aG9kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldHVwU3BpZXMoZW50aXRsZW1lbnQpO1xuICAgICAgICBlbnRpdGxlbWVudC5nZXREZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGVudGl0bGVtZW50KTtcblxuICAgICAgICBleHBlY3QoZW50aXRsZW1lbnQuZ2V0QXBwbGljYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgZXhwZWN0KGVudGl0bGVtZW50LmdldE93bmVyKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgICAgICAgLy9FbnRpdGxlbWVudCBoYXMgbm8gcmlzayBzY29yZSBpbmZvXG4gICAgICAgIGV4cGVjdChlbnRpdGxlbWVudC5nZXRSaXNrU2NvcmVXZWlnaHQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgICAgICAgdmFyIGNhcmREYXRhSXRlbXMgPSBlbGVtZW50LmZpbmQoJ3NwYW4uc3AtY2FyZC1kYXRhLWl0ZW0tdmFsdWUnKTtcbiAgICAgICAgZXhwZWN0KGNhcmREYXRhSXRlbXMubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgICAgICB2YXIgZGVzY3JpcHRpb25FbGVtZW50ID0gZWxlbWVudC5maW5kKCdnbyB0byB3b3JrJyk7XG4gICAgICAgIGV4cGVjdChkZXNjcmlwdGlvbkVsZW1lbnQpLm5vdC50b0JlTnVsbCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHJvbGUgZGV0YWlscycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXR1cFNwaWVzKHJvbGUpO1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocm9sZSk7XG5cbiAgICAgICAgZXhwZWN0KHJvbGUuZ2V0RGVzY3JpcHRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICAgICAgICAvL1JvbGUgaGFzIG5vIGFwcGxpY2F0aW9uXG4gICAgICAgIGV4cGVjdChyb2xlLmdldEFwcGxpY2F0aW9uKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICBleHBlY3Qocm9sZS5nZXRPd25lcikudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gICAgICAgIC8vUm9sZSB3aXRoIHJpc2sgc2NvcmUgaW5mb1xuICAgICAgICBleHBlY3Qocm9sZS5nZXRSaXNrU2NvcmVXZWlnaHQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICAgICAgICB2YXIgY2FyZERhdGFJdGVtcyA9IGVsZW1lbnQuZmluZCgnc3Bhbi5zcC1jYXJkLWRhdGEtaXRlbS12YWx1ZScpO1xuICAgICAgICBleHBlY3QoY2FyZERhdGFJdGVtcy5sZW5ndGgpLnRvRXF1YWwoMyk7XG5cbiAgICAgICAgLy8gUmlzayBmaWx0ZXIgc2hvdWxkIGFwcGx5IHJpc2sgc2NvcmUgY2xhc3NcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudChjYXJkRGF0YUl0ZW1zWzJdKS5maW5kKCcubGFiZWwucmlzay5yaXNrLWhpZ2gnKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5jbHVkZXMgYW55IGVsZW1lbnRzIGF0IHRvcCBvZiBjYXJkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbERlZiA9XG4gICAgICAgICAgICAnPHNwLWNvbmZpZ3VyYWJsZS1kZXRhaWxzIG5nLW1vZGVsPVwidGVzdE1vZGVsXCIgJyArXG4gICAgICAgICAgICAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcC1jb2wtY29uZmlncz1cImNvbHVtbkNvbmZpZ3NbXFwnezB9XFwnXVwiPicgK1xuICAgICAgICAgICAgJyA8c3BhbiBpZD1cImhpbW9tXCI+SEkgTU9NITwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8L3NwLWNvbmZpZ3VyYWJsZS1kZXRhaWxzPicsXG5cbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHJvbGUsIGVsRGVmKSxcbiAgICAgICAgICAgIGhpTW9tID0gZWxlbWVudC5maW5kKCcjaGltb20nKTtcblxuICAgICAgICBleHBlY3QoaGlNb20pLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgZXhwZWN0KGhpTW9tLnRleHQoKSkudG9FcXVhbCgnSEkgTU9NIScpO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
