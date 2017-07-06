System.register(['test/js/TestInitializer', 'home/widget/risk/RiskWidgetModule', 'test/js/TestModule'], function (_export) {
    'use strict';

    var riskWidgetModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_homeWidgetRiskRiskWidgetModule) {
            riskWidgetModule = _homeWidgetRiskRiskWidgetModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('TopFiveRisksWidgetDirectiveCtrl', function () {
                var ctrl,
                    navigationServiceMock,
                    riskServiceMock,
                    RISK_TYPE_APP,
                    RISK_TYPE_IDENTITY,
                    riskyThingsData = {
                    'riskTypeApplication': [{
                        'displayableName': 'RiskyApp1',
                        'score': 456
                    }, {
                        'displayableName': 'RiskyApp2',
                        'score': 345
                    }, {
                        'displayableName': 'RiskyApp3',
                        'score': 234
                    }, {
                        'displayableName': 'RiskyApp4',
                        'score': 123
                    }, {
                        'displayableName': 'RiskyApp5',
                        'score': 1
                    }],
                    'riskTypeIdentity': [{
                        'displayableName': 'RiskyIdentity1',
                        'score': 456
                    }, {
                        'displayableName': 'RiskyIdentity2',
                        'score': 345
                    }, {
                        'displayableName': 'RiskyIdentity3',
                        'score': 234
                    }, {
                        'displayableName': 'RiskyIdentity4',
                        'score': 123
                    }, {
                        'displayableName': 'RiskyIdentity5',
                        'score': 1
                    }]
                };

                beforeEach(module(riskWidgetModule, testModule));

                beforeEach(inject(function ($controller, $rootScope, testService, _RISK_TYPE_APP_, _RISK_TYPE_IDENTITY_) {

                    RISK_TYPE_APP = _RISK_TYPE_APP_;
                    RISK_TYPE_IDENTITY = _RISK_TYPE_IDENTITY_;

                    riskServiceMock = {
                        getTopFive: testService.createPromiseSpy(false, riskyThingsData)
                    };

                    navigationServiceMock = {
                        go: jasmine.createSpy()
                    };

                    ctrl = $controller('TopFiveRisksWidgetDirectiveCtrl', {
                        $scope: $rootScope.$new(),
                        riskService: riskServiceMock,
                        navigationService: navigationServiceMock
                    });

                    $rootScope.$apply();
                }));

                function verifyRiskyWidgetData(riskyWidgetData) {
                    expect(riskyWidgetData.active).toBeDefined();
                    // active should be initialized to false
                    expect(riskyWidgetData.active).toBe(false);
                    expect(riskyWidgetData.type).toBeDefined();
                    expect(riskyWidgetData.typeLabel).toBeDefined();
                    expect(riskyWidgetData.data).toBeDefined();
                    // should match mock data elements length
                    expect(riskyWidgetData.data.length).toBe(5);
                }

                it('should initialize with risk data', function () {
                    expect(riskServiceMock.getTopFive).toHaveBeenCalled();
                    expect(ctrl.riskyThings).toBeDefined();
                    expect(ctrl.riskyThings.length).toBe(2);

                    verifyRiskyWidgetData(ctrl.riskyThings[0]);
                    verifyRiskyWidgetData(ctrl.riskyThings[1]);
                });

                describe('goToRiskPage', function () {
                    var appRiskNav = {
                        outcome: 'viewApplicationRiskScore'
                    },
                        identityRiskNav = {
                        outcome: 'viewIdentityRiskScore'
                    };

                    it('should go to the application risk page when type is application', function () {
                        ctrl.currentRiskType = RISK_TYPE_APP;
                        ctrl.goToRiskPage();
                        expect(navigationServiceMock.go.calls.mostRecent().args[0]).toEqual(appRiskNav);
                    });

                    it('should go to the application risk page when type is identity', function () {
                        ctrl.currentRiskType = RISK_TYPE_IDENTITY;
                        ctrl.goToRiskPage();
                        expect(navigationServiceMock.go.calls.mostRecent().args[0]).toEqual(identityRiskNav);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvd2lkZ2V0L3Jpc2svVG9wRml2ZVJpc2tzV2lkZ2V0RGlyZWN0aXZlQ3RybFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsdUJBQXVCLFVBQVUsU0FBUztJQUEzSDs7SUFHSSxJQUFJLGtCQUFrQjtJQUN0QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxpQ0FBaUM7WUFDdkYsbUJBQW1CLGdDQUFnQztXQUNwRCxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQUo3QixTQUFTLG1DQUFtQyxZQUFXO2dCQUNuRCxJQUFJO29CQUFNO29CQUF1QjtvQkFBaUI7b0JBQWU7b0JBQzdELGtCQUFrQjtvQkFDZCx1QkFDSSxDQUNJO3dCQUNJLG1CQUFtQjt3QkFDbkIsU0FBUzt1QkFFYjt3QkFDSSxtQkFBbUI7d0JBQ25CLFNBQVM7dUJBRWI7d0JBQ0ksbUJBQW1CO3dCQUNuQixTQUFTO3VCQUViO3dCQUNJLG1CQUFtQjt3QkFDbkIsU0FBUzt1QkFFYjt3QkFDSSxtQkFBbUI7d0JBQ25CLFNBQVM7O29CQUdyQixvQkFDSSxDQUNJO3dCQUNJLG1CQUFtQjt3QkFDbkIsU0FBUzt1QkFFYjt3QkFDSSxtQkFBbUI7d0JBQ25CLFNBQVM7dUJBRWI7d0JBQ0ksbUJBQW1CO3dCQUNuQixTQUFTO3VCQUViO3dCQUNJLG1CQUFtQjt3QkFDbkIsU0FBUzt1QkFFYjt3QkFDSSxtQkFBbUI7d0JBQ25CLFNBQVM7Ozs7Z0JBSzdCLFdBQVcsT0FBTyxrQkFBa0I7O2dCQUVwQyxXQUFXLE9BQU8sVUFBUyxhQUFhLFlBQVksYUFBYSxpQkFBaUIsc0JBQXNCOztvQkFFcEcsZ0JBQWdCO29CQUNoQixxQkFBcUI7O29CQUVyQixrQkFBa0I7d0JBQ2QsWUFBWSxZQUFZLGlCQUFpQixPQUFPOzs7b0JBR3BELHdCQUF3Qjt3QkFDcEIsSUFBSSxRQUFROzs7b0JBR2hCLE9BQU8sWUFBWSxtQ0FBbUM7d0JBQ2xELFFBQVEsV0FBVzt3QkFDbkIsYUFBYTt3QkFDYixtQkFBbUI7OztvQkFHdkIsV0FBVzs7O2dCQUdmLFNBQVMsc0JBQXNCLGlCQUFpQjtvQkFDNUMsT0FBTyxnQkFBZ0IsUUFBUTs7b0JBRS9CLE9BQU8sZ0JBQWdCLFFBQVEsS0FBSztvQkFDcEMsT0FBTyxnQkFBZ0IsTUFBTTtvQkFDN0IsT0FBTyxnQkFBZ0IsV0FBVztvQkFDbEMsT0FBTyxnQkFBZ0IsTUFBTTs7b0JBRTdCLE9BQU8sZ0JBQWdCLEtBQUssUUFBUSxLQUFLOzs7Z0JBRzdDLEdBQUcsb0NBQW9DLFlBQVc7b0JBQzlDLE9BQU8sZ0JBQWdCLFlBQVk7b0JBQ25DLE9BQU8sS0FBSyxhQUFhO29CQUN6QixPQUFPLEtBQUssWUFBWSxRQUFRLEtBQUs7O29CQUVyQyxzQkFBc0IsS0FBSyxZQUFZO29CQUN2QyxzQkFBc0IsS0FBSyxZQUFZOzs7Z0JBRzNDLFNBQVMsZ0JBQWdCLFlBQVc7b0JBQ2hDLElBQUksYUFBYTt3QkFDVCxTQUFTOzt3QkFFYixrQkFBa0I7d0JBQ2QsU0FBUzs7O29CQUdqQixHQUFHLG1FQUFtRSxZQUFXO3dCQUM3RSxLQUFLLGtCQUFrQjt3QkFDdkIsS0FBSzt3QkFDTCxPQUFPLHNCQUFzQixHQUFHLE1BQU0sYUFBYSxLQUFLLElBQUksUUFBUTs7O29CQUl4RSxHQUFHLGdFQUFnRSxZQUFXO3dCQUMxRSxLQUFLLGtCQUFrQjt3QkFDdkIsS0FBSzt3QkFDTCxPQUFPLHNCQUFzQixHQUFHLE1BQU0sYUFBYSxLQUFLLElBQUksUUFBUTs7Ozs7O0dBQzdFIiwiZmlsZSI6ImhvbWUvd2lkZ2V0L3Jpc2svVG9wRml2ZVJpc2tzV2lkZ2V0RGlyZWN0aXZlQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCByaXNrV2lkZ2V0TW9kdWxlIGZyb20gJ2hvbWUvd2lkZ2V0L3Jpc2svUmlza1dpZGdldE1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuXG5kZXNjcmliZSgnVG9wRml2ZVJpc2tzV2lkZ2V0RGlyZWN0aXZlQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdHJsLCBuYXZpZ2F0aW9uU2VydmljZU1vY2ssIHJpc2tTZXJ2aWNlTW9jaywgUklTS19UWVBFX0FQUCwgUklTS19UWVBFX0lERU5USVRZLFxuICAgICAgICByaXNreVRoaW5nc0RhdGEgPSB7XG4gICAgICAgICAgICAncmlza1R5cGVBcHBsaWNhdGlvbic6XG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheWFibGVOYW1lJzogJ1Jpc2t5QXBwMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2NvcmUnOiA0NTZcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXlhYmxlTmFtZSc6ICdSaXNreUFwcDInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogMzQ1XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXNwbGF5YWJsZU5hbWUnOiAnUmlza3lBcHAzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzY29yZSc6IDIzNFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheWFibGVOYW1lJzogJ1Jpc2t5QXBwNCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2NvcmUnOiAxMjNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXlhYmxlTmFtZSc6ICdSaXNreUFwcDUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdyaXNrVHlwZUlkZW50aXR5JzpcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXNwbGF5YWJsZU5hbWUnOiAnUmlza3lJZGVudGl0eTEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogNDU2XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXNwbGF5YWJsZU5hbWUnOiAnUmlza3lJZGVudGl0eTInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogMzQ1XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXNwbGF5YWJsZU5hbWUnOiAnUmlza3lJZGVudGl0eTMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogMjM0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXNwbGF5YWJsZU5hbWUnOiAnUmlza3lJZGVudGl0eTQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogMTIzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXNwbGF5YWJsZU5hbWUnOiAnUmlza3lJZGVudGl0eTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3JlJzogMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUocmlza1dpZGdldE1vZHVsZSwgdGVzdE1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJGNvbnRyb2xsZXIsICRyb290U2NvcGUsIHRlc3RTZXJ2aWNlLCBfUklTS19UWVBFX0FQUF8sIF9SSVNLX1RZUEVfSURFTlRJVFlfKSB7XG5cbiAgICAgICAgUklTS19UWVBFX0FQUCA9IF9SSVNLX1RZUEVfQVBQXztcbiAgICAgICAgUklTS19UWVBFX0lERU5USVRZID0gX1JJU0tfVFlQRV9JREVOVElUWV87XG5cbiAgICAgICAgcmlza1NlcnZpY2VNb2NrID0ge1xuICAgICAgICAgICAgZ2V0VG9wRml2ZTogdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZVNweShmYWxzZSwgcmlza3lUaGluZ3NEYXRhKVxuICAgICAgICB9O1xuXG4gICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlTW9jayA9IHtcbiAgICAgICAgICAgIGdvOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybCA9ICRjb250cm9sbGVyKCdUb3BGaXZlUmlza3NXaWRnZXREaXJlY3RpdmVDdHJsJywge1xuICAgICAgICAgICAgJHNjb3BlOiAkcm9vdFNjb3BlLiRuZXcoKSxcbiAgICAgICAgICAgIHJpc2tTZXJ2aWNlOiByaXNrU2VydmljZU1vY2ssXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZTogbmF2aWdhdGlvblNlcnZpY2VNb2NrXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gdmVyaWZ5Umlza3lXaWRnZXREYXRhKHJpc2t5V2lkZ2V0RGF0YSkge1xuICAgICAgICBleHBlY3Qocmlza3lXaWRnZXREYXRhLmFjdGl2ZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgLy8gYWN0aXZlIHNob3VsZCBiZSBpbml0aWFsaXplZCB0byBmYWxzZVxuICAgICAgICBleHBlY3Qocmlza3lXaWRnZXREYXRhLmFjdGl2ZSkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChyaXNreVdpZGdldERhdGEudHlwZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KHJpc2t5V2lkZ2V0RGF0YS50eXBlTGFiZWwpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChyaXNreVdpZGdldERhdGEuZGF0YSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgLy8gc2hvdWxkIG1hdGNoIG1vY2sgZGF0YSBlbGVtZW50cyBsZW5ndGhcbiAgICAgICAgZXhwZWN0KHJpc2t5V2lkZ2V0RGF0YS5kYXRhLmxlbmd0aCkudG9CZSg1KTtcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCByaXNrIGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHJpc2tTZXJ2aWNlTW9jay5nZXRUb3BGaXZlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGV4cGVjdChjdHJsLnJpc2t5VGhpbmdzKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QoY3RybC5yaXNreVRoaW5ncy5sZW5ndGgpLnRvQmUoMik7XG5cbiAgICAgICAgdmVyaWZ5Umlza3lXaWRnZXREYXRhKGN0cmwucmlza3lUaGluZ3NbMF0pO1xuICAgICAgICB2ZXJpZnlSaXNreVdpZGdldERhdGEoY3RybC5yaXNreVRoaW5nc1sxXSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ29Ub1Jpc2tQYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcHBSaXNrTmF2ID0ge1xuICAgICAgICAgICAgICAgIG91dGNvbWU6ICd2aWV3QXBwbGljYXRpb25SaXNrU2NvcmUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaWRlbnRpdHlSaXNrTmF2ID0ge1xuICAgICAgICAgICAgICAgIG91dGNvbWU6ICd2aWV3SWRlbnRpdHlSaXNrU2NvcmUnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdzaG91bGQgZ28gdG8gdGhlIGFwcGxpY2F0aW9uIHJpc2sgcGFnZSB3aGVuIHR5cGUgaXMgYXBwbGljYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0cmwuY3VycmVudFJpc2tUeXBlID0gUklTS19UWVBFX0FQUDtcbiAgICAgICAgICAgIGN0cmwuZ29Ub1Jpc2tQYWdlKCk7XG4gICAgICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2VNb2NrLmdvLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKGFwcFJpc2tOYXYpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgZ28gdG8gdGhlIGFwcGxpY2F0aW9uIHJpc2sgcGFnZSB3aGVuIHR5cGUgaXMgaWRlbnRpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0cmwuY3VycmVudFJpc2tUeXBlID0gUklTS19UWVBFX0lERU5USVRZO1xuICAgICAgICAgICAgY3RybC5nb1RvUmlza1BhZ2UoKTtcbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZU1vY2suZ28uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0pLnRvRXF1YWwoaWRlbnRpdHlSaXNrTmF2KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
