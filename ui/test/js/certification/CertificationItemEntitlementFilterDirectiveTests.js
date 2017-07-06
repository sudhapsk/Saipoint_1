System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('spCertificationItemEntitlementFilter', function () {

                var template = '<sp-certification-item-entitlement-filter ng-model="filterValue" ' + 'sp-filter="filter" sp-id="{{ filterId }}" />',
                    namesResult = [{
                    id: 'perm1',
                    isPermission: true,
                    displayName: 'perm1'
                }, {
                    id: 'attr1',
                    displayName: 'attr1'
                }],
                    valuesResult = [{
                    id: 'value1',
                    displayName: 'value1'
                }],
                    certId = 'cert1234',
                    certificationItemSuggestService = undefined,
                    $scope = undefined,
                    $compile = undefined,
                    suggestTestService = undefined;

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 8 */
                beforeEach(inject(function (_certificationItemSuggestService_, $rootScope, _$compile_, Filter, $q, ListResultDTO, certificationDataService, _suggestTestService_) {
                    certificationItemSuggestService = _certificationItemSuggestService_;
                    $compile = _$compile_;
                    $scope = $rootScope.$new();
                    suggestTestService = _suggestTestService_;

                    $scope.filter = new Filter({
                        attributes: {
                            application: 'App1'
                        },
                        property: 'App1'
                    });

                    $scope.filterValue = {};
                    $scope.filterId = 'filterId';

                    spyOn(certificationItemSuggestService, 'getEntitlementNames').and.returnValue($q.when(new ListResultDTO({
                        count: 2,
                        objects: namesResult
                    })));

                    spyOn(certificationItemSuggestService, 'getEntitlementValues').and.returnValue($q.when(new ListResultDTO({
                        count: 1,
                        objects: valuesResult
                    })));

                    spyOn(certificationItemSuggestService, 'getObjects').and.callThrough();

                    certificationDataService.initialize({
                        id: certId
                    });
                }));

                function createElement() {
                    var element = angular.element(template);
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                it('renders two suggests', function () {
                    var element = createElement();
                    expect(element.find('sp-object-suggest').length).toEqual(2);
                });

                it('calls through to certificationItemSuggestService for name suggest', function () {
                    var element = createElement(),
                        nameSuggest = angular.element(element.find('sp-object-suggest')[0]);
                    suggestTestService.clickDropdownArrow(nameSuggest, $scope);
                    expect(certificationItemSuggestService.getObjects).toHaveBeenCalled();
                    var args = certificationItemSuggestService.getObjects.calls.mostRecent().args;
                    expect(args.length >= 4).toEqual(true);
                    expect(args[3].suggestFunc).toEqual('getEntitlementNames');
                    expect(args[3].certId).toEqual(certId);
                    expect(args[3].application).toEqual($scope.filter.attributes.application);
                });

                it('calls through to certificationITemSuggestSErvice for value suggest with updated params', function () {
                    var element = createElement(),
                        nameSuggest = angular.element(element.find('sp-object-suggest')[0]),
                        valueSuggest = angular.element(element.find('sp-object-suggest')[1]);
                    suggestTestService.selectSuggestItem(nameSuggest, 0, $scope);
                    $scope.$apply();
                    certificationItemSuggestService.getObjects.calls.reset();
                    suggestTestService.clickDropdownArrow(valueSuggest, $scope);
                    expect(certificationItemSuggestService.getObjects).toHaveBeenCalled();
                    var args = certificationItemSuggestService.getObjects.calls.mostRecent().args;
                    expect(args.length >= 4).toEqual(true);
                    expect(args[3].suggestFunc).toEqual('getEntitlementValues');
                    expect(args[3].certId).toEqual(certId);
                    expect(args[3].application).toEqual($scope.filter.attributes.application);
                    expect(args[3].name).toEqual(namesResult[0].id);
                    expect(args[3].isPermission).toEqual(namesResult[0].isPermission);
                });

                it('sets application and additionalEntitlement flag on ngModel when created', function () {
                    createElement();
                    expect($scope.filterValue).toBeDefined();
                    expect($scope.filterValue.application).toEqual($scope.filter.attributes.application);
                    expect($scope.filterValue.additionalEntitlement).toEqual(true);
                });

                it('sets name, value and isPermission on the ngModel', function () {
                    var element = createElement(),
                        nameSuggest = angular.element(element.find('sp-object-suggest')[0]),
                        valueSuggest = angular.element(element.find('sp-object-suggest')[1]);
                    suggestTestService.selectSuggestItem(nameSuggest, 0, $scope);
                    $scope.$apply();
                    suggestTestService.selectSuggestItem(valueSuggest, 0, $scope);
                    $scope.$apply();
                    expect($scope.filterValue).toBeDefined();
                    expect($scope.filterValue.name).toEqual(namesResult[0].id);
                    expect($scope.filterValue.isPermission).toEqual(namesResult[0].isPermission);
                    expect($scope.filterValue.value).toEqual(valuesResult[0].id);
                });

                it('clears value from ngModel and value suggest if name selection changes', function () {
                    var element = createElement(),
                        nameSuggest = angular.element(element.find('sp-object-suggest')[0]),
                        valueSuggest = angular.element(element.find('sp-object-suggest')[1]);
                    suggestTestService.selectSuggestItem(nameSuggest, 0, $scope);
                    $scope.$apply();
                    suggestTestService.selectSuggestItem(valueSuggest, 0, $scope);
                    $scope.$apply();
                    suggestTestService.selectSuggestItem(nameSuggest, 1, $scope);
                    $scope.$apply();
                    expect($scope.filterValue.value).not.toBeDefined();
                });

                it('disables value suggest if no name is selected', function () {
                    var element = createElement(),
                        valueSuggest = angular.element(element.find('sp-object-suggest')[1]);
                    expect(angular.element(valueSuggest.find('sp-typeahead-input')[0]).attr('disabled')).toEqual('disabled');
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkl0ZW1FbnRpdGxlbWVudEZpbHRlckRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsdUJBQXVCLFVBQVUsU0FBUzs7O0lBR3ZIOztJQUVBLElBQUkscUJBQXFCO0lBQ3pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7O1lBTjdCLFNBQVMsd0NBQXdDLFlBQU07O2dCQUVuRCxJQUFJLFdBQVcsc0VBQ1A7b0JBQ0osY0FBYyxDQUFDO29CQUNYLElBQUk7b0JBQ0osY0FBYztvQkFDZCxhQUFhO21CQUNmO29CQUNFLElBQUk7b0JBQ0osYUFBYTs7b0JBQ2IsZUFBZSxDQUFDO29CQUNoQixJQUFJO29CQUNKLGFBQWE7O29CQUNiLFNBQVM7b0JBQVksa0NBQStCO29CQUFFLFNBQU07b0JBQUUsV0FBUTtvQkFBRSxxQkFBa0I7O2dCQUVsRyxXQUFXLE9BQU8scUJBQXFCOzs7Z0JBR3ZDLFdBQVcsT0FBTyxVQUFDLG1DQUFtQyxZQUFZLFlBQVksUUFBUSxJQUFJLGVBQ3ZFLDBCQUEwQixzQkFBeUI7b0JBQ2xFLGtDQUFrQztvQkFDbEMsV0FBVztvQkFDWCxTQUFTLFdBQVc7b0JBQ3BCLHFCQUFxQjs7b0JBRXJCLE9BQU8sU0FBUyxJQUFJLE9BQU87d0JBQ3ZCLFlBQVk7NEJBQ1IsYUFBYTs7d0JBRWpCLFVBQVU7OztvQkFHZCxPQUFPLGNBQWM7b0JBQ3JCLE9BQU8sV0FBVzs7b0JBRWxCLE1BQU0saUNBQWlDLHVCQUF1QixJQUFJLFlBQVksR0FBRyxLQUFLLElBQUksY0FBYzt3QkFDcEcsT0FBTzt3QkFDUCxTQUFTOzs7b0JBR2IsTUFBTSxpQ0FBaUMsd0JB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bUJBQW1CLGtCQUFrQixhQUFhLEdBQUc7b0JBQ3JELE9BQU87b0JBQ1AsT0FBTyxPQUFPLFlBQVksT0FBTyxJQUFJOzs7Z0JBR3pDLEdBQUcsaURBQWlELFlBQU07b0JBQ3RELElBQUksVUFBVTt3QkFDVixlQUFlLFFBQVEsUUFBUSxRQUFRLEtBQUsscUJBQXFCO29CQUNyRSxPQUFPLFFBQVEsUUFBUSxhQUFhLEtBQUssc0JBQXNCLElBQUksS0FBSyxhQUFhLFFBQVE7Ozs7O0dBaUJsRyIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25JdGVtRW50aXRsZW1lbnRGaWx0ZXJEaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuXG5kZXNjcmliZSgnc3BDZXJ0aWZpY2F0aW9uSXRlbUVudGl0bGVtZW50RmlsdGVyJywgKCkgPT4ge1xuXG4gICAgbGV0IHRlbXBsYXRlID0gJzxzcC1jZXJ0aWZpY2F0aW9uLWl0ZW0tZW50aXRsZW1lbnQtZmlsdGVyIG5nLW1vZGVsPVwiZmlsdGVyVmFsdWVcIiAnICtcbiAgICAgICAgICAgICdzcC1maWx0ZXI9XCJmaWx0ZXJcIiBzcC1pZD1cInt7IGZpbHRlcklkIH19XCIgLz4nLFxuICAgICAgICBuYW1lc1Jlc3VsdCA9IFt7XG4gICAgICAgICAgICBpZDogJ3Blcm0xJyxcbiAgICAgICAgICAgIGlzUGVybWlzc2lvbjogdHJ1ZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAncGVybTEnXG4gICAgICAgIH0se1xuICAgICAgICAgICAgaWQ6ICdhdHRyMScsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ2F0dHIxJ1xuICAgICAgICB9XSwgdmFsdWVzUmVzdWx0ID0gW3tcbiAgICAgICAgICAgIGlkOiAndmFsdWUxJyxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAndmFsdWUxJ1xuICAgICAgICB9XSwgY2VydElkID0gJ2NlcnQxMjM0JywgY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZSwgJHNjb3BlLCAkY29tcGlsZSwgc3VnZ2VzdFRlc3RTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY2VydGlmaWNhdGlvbk1vZHVsZSwgdGVzdE1vZHVsZSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczogOCAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZV8sICRyb290U2NvcGUsIF8kY29tcGlsZV8sIEZpbHRlciwgJHEsIExpc3RSZXN1bHREVE8sXG4gICAgICAgICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSwgX3N1Z2dlc3RUZXN0U2VydmljZV8pID0+IHtcbiAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uSXRlbVN1Z2dlc3RTZXJ2aWNlXztcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xuICAgICAgICAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlID0gX3N1Z2dlc3RUZXN0U2VydmljZV87XG5cbiAgICAgICAgJHNjb3BlLmZpbHRlciA9IG5ldyBGaWx0ZXIoe1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnQXBwMSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ0FwcDEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5maWx0ZXJWYWx1ZSA9IHt9O1xuICAgICAgICAkc2NvcGUuZmlsdGVySWQgPSAnZmlsdGVySWQnO1xuXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtU3VnZ2VzdFNlcnZpY2UsICdnZXRFbnRpdGxlbWVudE5hbWVzJykuYW5kLnJldHVyblZhbHVlKCRxLndoZW4obmV3IExpc3RSZXN1bHREVE8oe1xuICAgICAgICAgICAgY291bnQ6IDIsXG4gICAgICAgICAgICBvYmplY3RzOiBuYW1lc1Jlc3VsdFxuICAgICAgICB9KSkpO1xuXG4gICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25JdGVtU3VnZ2VzdFNlcnZpY2UsICdnZXRFbnRpdGxlbWVudFZhbHVlcycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKG5ldyBMaXN0UmVzdWx0RFRPKHtcbiAgICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgICAgb2JqZWN0czogdmFsdWVzUmVzdWx0XG4gICAgICAgIH0pKSk7XG5cbiAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZSwgJ2dldE9iamVjdHMnKS5hbmQuY2FsbFRocm91Z2goKTtcblxuICAgICAgICBjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UuaW5pdGlhbGl6ZSh7XG4gICAgICAgICAgICBpZDogY2VydElkXG4gICAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KHRlbXBsYXRlKTtcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBpdCgncmVuZGVycyB0d28gc3VnZ2VzdHMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcC1vYmplY3Qtc3VnZ2VzdCcpLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICB9KTtcblxuICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIGNlcnRpZmljYXRpb25JdGVtU3VnZ2VzdFNlcnZpY2UgZm9yIG5hbWUgc3VnZ2VzdCcsICgpID0+IHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXG4gICAgICAgICAgICBuYW1lU3VnZ2VzdCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJ3NwLW9iamVjdC1zdWdnZXN0JylbMF0pO1xuICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2UuY2xpY2tEcm9wZG93bkFycm93KG5hbWVTdWdnZXN0LCAkc2NvcGUpO1xuICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZS5nZXRPYmplY3RzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGxldCBhcmdzID0gY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZS5nZXRPYmplY3RzLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xuICAgICAgICBleHBlY3QoYXJncy5sZW5ndGggPj0gNCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGFyZ3NbM10uc3VnZ2VzdEZ1bmMpLnRvRXF1YWwoJ2dldEVudGl0bGVtZW50TmFtZXMnKTtcbiAgICAgICAgZXhwZWN0KGFyZ3NbM10uY2VydElkKS50b0VxdWFsKGNlcnRJZCk7XG4gICAgICAgIGV4cGVjdChhcmdzWzNdLmFwcGxpY2F0aW9uKS50b0VxdWFsKCRzY29wZS5maWx0ZXIuYXR0cmlidXRlcy5hcHBsaWNhdGlvbik7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FsbHMgdGhyb3VnaCB0byBjZXJ0aWZpY2F0aW9uSVRlbVN1Z2dlc3RTRXJ2aWNlIGZvciB2YWx1ZSBzdWdnZXN0IHdpdGggdXBkYXRlZCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpLFxuICAgICAgICAgICAgbmFtZVN1Z2dlc3QgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5maW5kKCdzcC1vYmplY3Qtc3VnZ2VzdCcpWzBdKSxcbiAgICAgICAgICAgIHZhbHVlU3VnZ2VzdCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJ3NwLW9iamVjdC1zdWdnZXN0JylbMV0pO1xuICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2Uuc2VsZWN0U3VnZ2VzdEl0ZW0obmFtZVN1Z2dlc3QsIDAsICRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZS5nZXRPYmplY3RzLmNhbGxzLnJlc2V0KCk7XG4gICAgICAgIHN1Z2dlc3RUZXN0U2VydmljZS5jbGlja0Ryb3Bkb3duQXJyb3codmFsdWVTdWdnZXN0LCAkc2NvcGUpO1xuICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZS5nZXRPYmplY3RzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGxldCBhcmdzID0gY2VydGlmaWNhdGlvbkl0ZW1TdWdnZXN0U2VydmljZS5nZXRPYmplY3RzLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xuICAgICAgICBleHBlY3QoYXJncy5sZW5ndGggPj0gNCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGFyZ3NbM10uc3VnZ2VzdEZ1bmMpLnRvRXF1YWwoJ2dldEVudGl0bGVtZW50VmFsdWVzJyk7XG4gICAgICAgIGV4cGVjdChhcmdzWzNdLmNlcnRJZCkudG9FcXVhbChjZXJ0SWQpO1xuICAgICAgICBleHBlY3QoYXJnc1szXS5hcHBsaWNhdGlvbikudG9FcXVhbCgkc2NvcGUuZmlsdGVyLmF0dHJpYnV0ZXMuYXBwbGljYXRpb24pO1xuICAgICAgICBleHBlY3QoYXJnc1szXS5uYW1lKS50b0VxdWFsKG5hbWVzUmVzdWx0WzBdLmlkKTtcbiAgICAgICAgZXhwZWN0KGFyZ3NbM10uaXNQZXJtaXNzaW9uKS50b0VxdWFsKG5hbWVzUmVzdWx0WzBdLmlzUGVybWlzc2lvbik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2V0cyBhcHBsaWNhdGlvbiBhbmQgYWRkaXRpb25hbEVudGl0bGVtZW50IGZsYWcgb24gbmdNb2RlbCB3aGVuIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgICAgIGNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgZXhwZWN0KCRzY29wZS5maWx0ZXJWYWx1ZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KCRzY29wZS5maWx0ZXJWYWx1ZS5hcHBsaWNhdGlvbikudG9FcXVhbCgkc2NvcGUuZmlsdGVyLmF0dHJpYnV0ZXMuYXBwbGljYXRpb24pO1xuICAgICAgICBleHBlY3QoJHNjb3BlLmZpbHRlclZhbHVlLmFkZGl0aW9uYWxFbnRpdGxlbWVudCkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzZXRzIG5hbWUsIHZhbHVlIGFuZCBpc1Blcm1pc3Npb24gb24gdGhlIG5nTW9kZWwnLCAoKSA9PiB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpLFxuICAgICAgICAgICAgbmFtZVN1Z2dlc3QgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5maW5kKCdzcC1vYmplY3Qtc3VnZ2VzdCcpWzBdKSxcbiAgICAgICAgICAgIHZhbHVlU3VnZ2VzdCA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmZpbmQoJ3NwLW9iamVjdC1zdWdnZXN0JylbMV0pO1xuICAgICAgICBzdWdnZXN0VGVzdFNlcnZpY2Uuc2VsZWN0U3VnZ2VzdEl0ZW0obmFtZVN1Z2dlc3QsIDAsICRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlbGVjdFN1Z2dlc3RJdGVtKHZhbHVlU3VnZ2VzdCwgMCwgJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoJHNjb3BlLmZpbHRlclZhbHVlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QoJHNjb3BlLmZpbHRlclZhbHVlLm5hbWUpLnRvRXF1YWwobmFtZXNSZXN1bHRbMF0uaWQpO1xuICAgICAgICBleHBlY3QoJHNjb3BlLmZpbHRlclZhbHVlLmlzUGVybWlzc2lvbikudG9FcXVhbChuYW1lc1Jlc3VsdFswXS5pc1Blcm1pc3Npb24pO1xuICAgICAgICBleHBlY3QoJHNjb3BlLmZpbHRlclZhbHVlLnZhbHVlKS50b0VxdWFsKHZhbHVlc1Jlc3VsdFswXS5pZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2xlYXJzIHZhbHVlIGZyb20gbmdNb2RlbCBhbmQgdmFsdWUgc3VnZ2VzdCBpZiBuYW1lIHNlbGVjdGlvbiBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKSxcbiAgICAgICAgICAgIG5hbWVTdWdnZXN0ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQuZmluZCgnc3Atb2JqZWN0LXN1Z2dlc3QnKVswXSksXG4gICAgICAgICAgICB2YWx1ZVN1Z2dlc3QgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5maW5kKCdzcC1vYmplY3Qtc3VnZ2VzdCcpWzFdKTtcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlbGVjdFN1Z2dlc3RJdGVtKG5hbWVTdWdnZXN0LCAwLCAkc2NvcGUpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHN1Z2dlc3RUZXN0U2VydmljZS5zZWxlY3RTdWdnZXN0SXRlbSh2YWx1ZVN1Z2dlc3QsIDAsICRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgc3VnZ2VzdFRlc3RTZXJ2aWNlLnNlbGVjdFN1Z2dlc3RJdGVtKG5hbWVTdWdnZXN0LCAxLCAkc2NvcGUpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGV4cGVjdCgkc2NvcGUuZmlsdGVyVmFsdWUudmFsdWUpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2Rpc2FibGVzIHZhbHVlIHN1Z2dlc3QgaWYgbm8gbmFtZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXG4gICAgICAgICAgICB2YWx1ZVN1Z2dlc3QgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5maW5kKCdzcC1vYmplY3Qtc3VnZ2VzdCcpWzFdKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh2YWx1ZVN1Z2dlc3QuZmluZCgnc3AtdHlwZWFoZWFkLWlucHV0JylbMF0pLmF0dHIoJ2Rpc2FibGVkJykpLnRvRXF1YWwoJ2Rpc2FibGVkJyk7XG4gICAgfSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
