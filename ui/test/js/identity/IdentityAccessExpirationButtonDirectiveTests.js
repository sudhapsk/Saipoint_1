System.register(['test/js/TestInitializer', 'identity/IdentityModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */
    'use strict';

    var identityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }],
        execute: function () {

            describe('IdentityAccessButtonExpirationDirective', function () {
                var $scope = undefined,
                    $compile = undefined,
                    $filter = undefined;

                beforeEach(module(identityModule));
                beforeEach(inject(function (_$rootScope_, _$compile_, _$filter_) {
                    $scope = _$rootScope_;
                    $compile = _$compile_;
                    $filter = _$filter_;
                }));

                function createElement() {
                    var definition = '<sp-identity-access-expiration-button ' + 'sp-button-id="12345" ' + 'sp-sunrise-date="sunrise" ' + 'sp-sunset-date="sunset"><sp-identity-access-expiration-button>',
                        element = $compile(definition)($scope);
                    $scope.$apply();
                    return element;
                }

                function getButton(element) {
                    var btn = element.find('#12345');
                    expect(btn.length).toEqual(1);
                    return angular.element(btn[0]);
                }

                it('should have sunrise in the element', function () {
                    $scope.sunrise = new Date(1475125200000);
                    var element = createElement(),
                        btn = getButton(element),
                        expectedSunrise = $filter('date')($scope.sunrise);
                    btn.click();
                    var sunriseDate = element.find('#accessSunriseDate'),
                        content = sunriseDate.find('span').text();
                    expect(content).toEqual(expectedSunrise);
                });

                it('should have sunset in the element', function () {
                    $scope.sunset = new Date(1475125200000);
                    var element = createElement(),
                        btn = getButton(element),
                        expectedSunset = $filter('date')($scope.sunset);
                    btn.click();
                    var sunsetDate = element.find('#accessSunsetDate'),
                        content = sunsetDate.find('span').text();
                    expect(content).toEqual(expectedSunset);
                });

                it('should not have sunset/sunrise date', function () {
                    $scope.sunset = null;
                    $scope.sunrise = null;
                    var element = createElement(),
                        btn = getButton(element);
                    btn.click();
                    var sunriseDate = element.find('#accessSunriseDate'),
                        sunsetDate = element.find('#accessSunsetDate');
                    expect(sunriseDate.length).toEqual(0);
                    expect(sunsetDate.length).toEqual(0);
                });

                describe('showDivider', function () {
                    function getDividers(sunriseDate, sunsetDate) {
                        $scope.sunrise = sunriseDate;
                        $scope.sunset = sunsetDate;
                        var element = createElement(),
                            btn = getButton(element);
                        btn.click();
                        return element.find('.line');
                    }

                    it('should be true if both sunrise and sunset dates are set', function () {
                        var dividers = getDividers(new Date(321), new Date(123));
                        expect(dividers.length).toEqual(2);
                    });

                    it('should be false if only sunrise is set', function () {
                        var dividers = getDividers(new Date(2392890349));
                        expect(dividers.length).toEqual(1);
                    });

                    it('should be false if only sunset is set', function () {
                        var dividers = getDividers(null, new Date(890234782));
                        expect(dividers.length).toEqual(1);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0lkZW50aXR5QWNjZXNzRXhwaXJhdGlvbkJ1dHRvbkRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw0QkFBNEIsVUFBVSxTQUFTOzs7O0lBSXZGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3Qjs7UUFFN0MsU0FBUyxZQUFZOztZQUw3QixTQUFTLDJDQUEyQyxZQUFXO2dCQUMzRCxJQUFJLFNBQU07b0JBQUUsV0FBUTtvQkFBRSxVQUFPOztnQkFFN0IsV0FBVyxPQUFPO2dCQUNsQixXQUFXLE9BQU8sVUFBUyxjQUFjLFlBQVksV0FBVztvQkFDNUQsU0FBUztvQkFDVCxXQUFXO29CQUNYLFVBQVU7OztnQkFHZCxTQUFTLGdCQUFnQjtvQkFDckIsSUFBSSxhQUFhLDJDQUNiLDBCQUNBLCtCQUNBO3dCQUNBLFVBQVUsU0FBUyxZQUFZO29CQUNuQyxPQUFPO29CQUNQLE9BQU87OztnQkFHWCxTQUFTLFVBQVUsU0FBUztvQkFDeEIsSUFBSSxNQUFNLFFBQVEsS0FBSztvQkFDdkIsT0FBTyxJQUFJLFFBQVEsUUFBUTtvQkFDM0IsT0FBTyxRQUFRLFFBQVEsSUFBSTs7O2dCQUcvQixHQUFHLHNDQUFzQyxZQUFXO29CQUNoRCxPQUFPLFVBQVUsSUFBSSxLQUFLO29CQUMxQixJQUFJLFVBQVU7d0JBQ2QsTUFBTSxVQUFVO3dCQUNoQixrQkFBa0IsUUFBUSxRQUFRLE9BQU87b0JBQ3pDLElBQUk7b0JBQ0osSUFBSSxjQUFjLFFBQVEsS0FBSzt3QkFDM0IsVUFBVSxZQUFZLEtBQUssUUFBUTtvQkFDdkMsT0FBTyxTQUFTLFFBQVE7OztnQkFHNUIsR0FBRyxxQ0FBcUMsWUFBVztvQkFDL0MsT0FBTyxTQUFTLElBQUksS0FBSztvQkFDekIsSUFBSSxVQUFVO3dCQUNkLE1BQU0sVUFBVTt3QkFDaEIsaUJBQWlCLFFBQVEsUUFBUSxPQUFPO29CQUN4QyxJQUFJO29CQUNKLElBQUksYUFBYSxRQUFRLEtBQUs7d0JBQzFCLFVBQVUsV0FBVyxLQUFLLFFBQVE7b0JBQ3RDLE9BQU8sU0FBUyxRQUFROzs7Z0JBRzVCLEdBQUcsdUNBQXVDLFlBQVc7b0JBQ2pELE9BQU8sU0FBUztvQkFDaEIsT0FBTyxVQUFVO29CQUNqQixJQUFJLFVBQVU7d0JBQ2QsTUFBTSxVQUFVO29CQUNoQixJQUFJO29CQUNKLElBQUksY0FBYyxRQUFRLEtBQUs7d0JBQzNCLGFBQWEsUUFBUSxLQUFLO29CQUM5QixPQUFPLFlBQVksUUFBUSxRQUFRO29CQUNuQyxPQUFPLFdBQVcsUUFBUSxRQUFROzs7Z0JBR3RDLFNBQVMsZUFBZSxZQUFXO29CQUMvQixTQUFTLFlBQVksYUFBYSxZQUFZO3dCQUMxQyxPQUFPLFVBQVU7d0JBQ2pCLE9BQU8sU0FBUzt3QkFDaEIsSUFBSSxVQUFVOzRCQUNWLE1BQU0sVUFBVTt3QkFDcEIsSUFBSTt3QkFDSixPQUFPLFFBQVEsS0FBSzs7O29CQUd4QixHQUFHLDJEQUEyRCxZQUFXO3dCQUNyRSxJQUFJLFdBQVcsWUFBWSxJQUFJLEtBQUssTUFBTSxJQUFJLEtBQUs7d0JBQ25ELE9BQU8sU0FBUyxRQUFRLFFBQVE7OztvQkFHcEMsR0FBRywwQ0FBMEMsWUFBVzt3QkFDcEQsSUFBSSxXQUFXLFlBQVksSUFBSSxLQUFLO3dCQUNwQyxPQUFPLFNBQVMsUUFBUSxRQUFROzs7b0JBR3BDLEdBQUcseUNBQXlDLFlBQVc7d0JBQ25ELElBQUksV0FBVyxZQUFZLE1BQU0sSUFBSSxLQUFLO3dCQUMxQyxPQUFPLFNBQVMsUUFBUSxRQUFROzs7Ozs7R0FZekMiLCJmaWxlIjoiaWRlbnRpdHkvSWRlbnRpdHlBY2Nlc3NFeHBpcmF0aW9uQnV0dG9uRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiAoYykgQ29weXJpZ2h0IDIwMTYuIFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqL1xyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGlkZW50aXR5TW9kdWxlIGZyb20gJ2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdJZGVudGl0eUFjY2Vzc0J1dHRvbkV4cGlyYXRpb25EaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCAkc2NvcGUsICRjb21waWxlLCAkZmlsdGVyO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGlkZW50aXR5TW9kdWxlKSk7XHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHJvb3RTY29wZV8sIF8kY29tcGlsZV8sIF8kZmlsdGVyXykge1xyXG4gICAgICAgICRzY29wZSA9IF8kcm9vdFNjb3BlXztcclxuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XHJcbiAgICAgICAgJGZpbHRlciA9IF8kZmlsdGVyXztcclxuICAgIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBkZWZpbml0aW9uID0gJzxzcC1pZGVudGl0eS1hY2Nlc3MtZXhwaXJhdGlvbi1idXR0b24gJyArXHJcbiAgICAgICAgICAgICdzcC1idXR0b24taWQ9XCIxMjM0NVwiICcgK1xyXG4gICAgICAgICAgICAnc3Atc3VucmlzZS1kYXRlPVwic3VucmlzZVwiICcgK1xyXG4gICAgICAgICAgICAnc3Atc3Vuc2V0LWRhdGU9XCJzdW5zZXRcIj48c3AtaWRlbnRpdHktYWNjZXNzLWV4cGlyYXRpb24tYnV0dG9uPicsXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSAkY29tcGlsZShkZWZpbml0aW9uKSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRCdXR0b24oZWxlbWVudCkge1xyXG4gICAgICAgIGxldCBidG4gPSBlbGVtZW50LmZpbmQoJyMxMjM0NScpO1xyXG4gICAgICAgIGV4cGVjdChidG4ubGVuZ3RoKS50b0VxdWFsKDEpO1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoYnRuWzBdKTtcclxuICAgIH1cclxuXHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgc3VucmlzZSBpbiB0aGUgZWxlbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICRzY29wZS5zdW5yaXNlID0gbmV3IERhdGUoMTQ3NTEyNTIwMDAwMCk7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXHJcbiAgICAgICAgYnRuID0gZ2V0QnV0dG9uKGVsZW1lbnQpLFxyXG4gICAgICAgIGV4cGVjdGVkU3VucmlzZSA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuc3VucmlzZSk7XHJcbiAgICAgICAgYnRuLmNsaWNrKCk7XHJcbiAgICAgICAgbGV0IHN1bnJpc2VEYXRlID0gZWxlbWVudC5maW5kKCcjYWNjZXNzU3VucmlzZURhdGUnKSxcclxuICAgICAgICAgICAgY29udGVudCA9IHN1bnJpc2VEYXRlLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvRXF1YWwoZXhwZWN0ZWRTdW5yaXNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG91bGQgaGF2ZSBzdW5zZXQgaW4gdGhlIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUuc3Vuc2V0ID0gbmV3IERhdGUoMTQ3NTEyNTIwMDAwMCk7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCksXHJcbiAgICAgICAgYnRuID0gZ2V0QnV0dG9uKGVsZW1lbnQpLFxyXG4gICAgICAgIGV4cGVjdGVkU3Vuc2V0ID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5zdW5zZXQpO1xyXG4gICAgICAgIGJ0bi5jbGljaygpO1xyXG4gICAgICAgIGxldCBzdW5zZXREYXRlID0gZWxlbWVudC5maW5kKCcjYWNjZXNzU3Vuc2V0RGF0ZScpLFxyXG4gICAgICAgICAgICBjb250ZW50ID0gc3Vuc2V0RGF0ZS5maW5kKCdzcGFuJykudGV4dCgpO1xyXG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b0VxdWFsKGV4cGVjdGVkU3Vuc2V0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG91bGQgbm90IGhhdmUgc3Vuc2V0L3N1bnJpc2UgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICRzY29wZS5zdW5zZXQgPSBudWxsO1xyXG4gICAgICAgICRzY29wZS5zdW5yaXNlID0gbnVsbDtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKSxcclxuICAgICAgICBidG4gPSBnZXRCdXR0b24oZWxlbWVudCk7XHJcbiAgICAgICAgYnRuLmNsaWNrKCk7XHJcbiAgICAgICAgbGV0IHN1bnJpc2VEYXRlID0gZWxlbWVudC5maW5kKCcjYWNjZXNzU3VucmlzZURhdGUnKSxcclxuICAgICAgICAgICAgc3Vuc2V0RGF0ZSA9IGVsZW1lbnQuZmluZCgnI2FjY2Vzc1N1bnNldERhdGUnKTtcclxuICAgICAgICBleHBlY3Qoc3VucmlzZURhdGUubGVuZ3RoKS50b0VxdWFsKDApO1xyXG4gICAgICAgIGV4cGVjdChzdW5zZXREYXRlLmxlbmd0aCkudG9FcXVhbCgwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdzaG93RGl2aWRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldERpdmlkZXJzKHN1bnJpc2VEYXRlLCBzdW5zZXREYXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zdW5yaXNlID0gc3VucmlzZURhdGU7XHJcbiAgICAgICAgICAgICRzY29wZS5zdW5zZXQgPSBzdW5zZXREYXRlO1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoKSxcclxuICAgICAgICAgICAgICAgIGJ0biA9IGdldEJ1dHRvbihlbGVtZW50KTtcclxuICAgICAgICAgICAgYnRuLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmZpbmQoJy5saW5lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIGJlIHRydWUgaWYgYm90aCBzdW5yaXNlIGFuZCBzdW5zZXQgZGF0ZXMgYXJlIHNldCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZGl2aWRlcnMgPSBnZXREaXZpZGVycyhuZXcgRGF0ZSgzMjEpLCBuZXcgRGF0ZSgxMjMpKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpdmlkZXJzLmxlbmd0aCkudG9FcXVhbCgyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBmYWxzZSBpZiBvbmx5IHN1bnJpc2UgaXMgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBkaXZpZGVycyA9IGdldERpdmlkZXJzKG5ldyBEYXRlKDIzOTI4OTAzNDkpKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpdmlkZXJzLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBmYWxzZSBpZiBvbmx5IHN1bnNldCBpcyBzZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRpdmlkZXJzID0gZ2V0RGl2aWRlcnMobnVsbCwgbmV3IERhdGUoODkwMjM0NzgyKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXZpZGVycy5sZW5ndGgpLnRvRXF1YWwoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
