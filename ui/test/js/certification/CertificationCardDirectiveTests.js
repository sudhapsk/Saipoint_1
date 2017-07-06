System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationCardDirective', function () {

                var $compile = undefined,
                    navigationService = undefined,
                    columnKey = undefined,
                    columns = undefined,
                    cert = undefined,
                    element = undefined,
                    $scope = undefined,
                    refreshTrigger = undefined,
                    certificationService = undefined;

                beforeEach(module(certificationModule));

                /* jshint maxparams: 9 */
                beforeEach(inject(function (_$compile_, _navigationService_, Certification, certificationTestData, configService, $q, ColumnConfig, $rootScope, _certificationService_) {
                    $compile = _$compile_;
                    navigationService = _navigationService_;
                    $scope = $rootScope.$new();
                    certificationService = _certificationService_;

                    columnKey = 'thisColumnKey';
                    cert = new Certification(certificationTestData.CERTIFICATION_1);
                    columns = [new ColumnConfig({
                        dataIndex: 'expiration',
                        dateStyle: 'short',
                        headerKey: 'EXPIRATION'
                    }), new ColumnConfig({
                        dataIndex: 'name',
                        headerKey: 'NAME'
                    }), new ColumnConfig({
                        dataIndex: 'id',
                        fieldOnly: true
                    })];
                    var data = {};
                    data[columnKey] = columns;
                    spyOn(configService, 'getColumnConfigEntries').and.returnValue($q.when({ data: data }));

                    refreshTrigger = {
                        refresh: jasmine.createSpy('refresh')
                    };
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                    if ($scope) {
                        $scope.$destroy();
                    }
                });

                function compile() {
                    var eltDef = '<sp-certification-card sp-certification="cert" sp-column-config-key="columnKey"' + ' sp-refresh-trigger="refreshTrigger" />';
                    element = angular.element(eltDef);

                    $scope.cert = cert;
                    $scope.columnKey = columnKey;
                    $scope.refreshTrigger = refreshTrigger;

                    $compile(element)($scope);
                    $scope.$digest();

                    return element;
                }

                it('throws with no certification', function () {
                    cert = undefined;
                    expect(function () {
                        return compile();
                    }).toThrow();
                });

                it('throws with no column config key', function () {
                    columnKey = null;
                    expect(function () {
                        return compile();
                    }).toThrow();
                });

                it('only shows displayed columns', function () {
                    compile();
                    var lines = element.find('ul.list-group li.list-group-item');
                    expect(lines.length).toEqual(2);
                    expect(lines[0].innerText).toContain(columns[0].headerKey);
                    expect(lines[1].innerText).toContain(columns[1].headerKey);
                });

                it('navigates to certification view if review button is clicked', function () {
                    compile();
                    spyOn(navigationService, 'go');
                    element.find('button.view-btn').click();
                    $scope.$apply();
                    expect(navigationService.go).toHaveBeenCalled();
                    var config = navigationService.go.calls.mostRecent().args[0];
                    expect(config.state).toEqual('certification.view');
                    expect(config.stateParams.certificationId).toEqual(cert.id);
                });

                it('calls certificationService to forward certification if forward button is clicked', function () {
                    compile();
                    spyOn(certificationService, 'forwardCertification');
                    element.find('button.forward-btn').click();
                    $scope.$apply();
                    expect(certificationService.forwardCertification).toHaveBeenCalled();
                    var args = certificationService.forwardCertification.calls.mostRecent().args;
                    expect(args[0]).toEqual(cert);
                    expect(angular.isFunction(args[1])).toEqual(true);
                    refreshTrigger.refresh.calls.reset();
                    args[1]();
                    expect(refreshTrigger.refresh).toHaveBeenCalled();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkNhcmREaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0NBQXNDLFVBQVUsU0FBUzs7SUFFakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDOztRQUU1RCxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsOEJBQThCLFlBQU07O2dCQUV6QyxJQUFJLFdBQVE7b0JBQUUsb0JBQWlCO29CQUFFLFlBQVM7b0JBQUUsVUFBTztvQkFBRSxPQUFJO29CQUFFLFVBQU87b0JBQUUsU0FBTTtvQkFBRSxpQkFBYztvQkFBRSx1QkFBb0I7O2dCQUVoSCxXQUFXLE9BQU87OztnQkFHbEIsV0FBVyxPQUFPLFVBQUMsWUFBWSxxQkFBcUIsZUFBZSx1QkFBdUIsZUFDdkUsSUFBSSxjQUFjLFlBQVksd0JBQTJCO29CQUN4RSxXQUFXO29CQUNYLG9CQUFvQjtvQkFDcEIsU0FBUyxXQUFXO29CQUNwQix1QkFBdUI7O29CQUV2QixZQUFZO29CQUNaLE9BQU8sSUFBSSxjQUFjLHNCQUFzQjtvQkFDL0MsVUFBVSxDQUNOLElBQUksYUFBYTt3QkFDYixXQUFXO3dCQUNYLFdBQVc7d0JBQ1gsV0FBVzt3QkFFZixJQUFJLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxXQUFXO3dCQUVmLElBQUksYUFBYTt3QkFDYixXQUFXO3dCQUNYLFdBQVc7O29CQUduQixJQUFJLE9BQU87b0JBQ1gsS0FBSyxhQUFhO29CQUNsQixNQUFNLGVBQWUsMEJBQTBCLElBQUksWUFBWSxHQUFHLEtBQUssRUFBRSxNQUFNOztvQkFFL0UsaUJBQWlCO3dCQUNiLFNBQVMsUUFBUSxVQUFVOzs7O2dCQUluQyxVQUFVLFlBQU07b0JBQ1osSUFBSSxTQUFTO3dCQUNULFFBQVE7O29CQUVaLElBQUksUUFBUTt3QkFDUixPQUFPOzs7O2dCQUlmLFNBQVMsVUFBVTtvQkFDZixJQUFJLFNBQVMsb0ZBQ1Q7b0JBQ0osVUFBVSxRQUFRLFFBQVE7O29CQUUxQixPQUFPLE9BQU87b0JBQ2QsT0FBTyxZQUFZO29CQUNuQixPQUFPLGlCQUFpQjs7b0JBRXhCLFNBQVMsU0FBUztvQkFDbEIsT0FBTzs7b0JBRVAsT0FBTzs7O2dCQUdYLEdBQUcsZ0NBQWdDLFlBQU07b0JBQ3JDLE9BQU87b0JBQ1AsT0FBTyxZQUFBO3dCQVVTLE9BVkg7dUJBQVc7OztnQkFHNUIsR0FBRyxvQ0FBb0MsWUFBTTtvQkFDekMsWUFBWTtvQkFDWixPQUFPLFlBQUE7d0JBWVMsT0FaSDt1QkFBVzs7O2dCQUc1QixHQUFHLGdDQUFnQyxZQUFNO29CQUNyQztvQkFDQSxJQUFJLFFBQVEsUUFBUSxLQUFLO29CQUN6QixPQUFPLE1BQU0sUUFBUSxRQUFRO29CQUM3QixPQUFPLE1BQU0sR0FBRyxXQUFXLFVBQVUsUUFBUSxHQUFHO29CQUNoRCxPQUFPLE1BQU0sR0FBRyxXQUFXLFVBQVUsUUFBUSxHQUFHOzs7Z0JBR3BELEdBQUcsK0RBQStELFlBQU07b0JBQ3BFO29CQUNBLE1BQU0sbUJBQW1CO29CQUN6QixRQUFRLEtBQUssbUJBQW1CO29CQUNoQyxPQUFPO29CQUNQLE9BQU8sa0JBQWtCLElBQUk7b0JBQzdCLElBQUksU0FBUyxrQkFBa0IsR0FBRyxNQUFNLGFBQWEsS0FBSztvQkFDMUQsT0FBTyxPQUFPLE9BQU8sUUFBUTtvQkFDN0IsT0FBTyxPQUFPLFlBQVksaUJBQWlCLFFBQVEsS0FBSzs7O2dCQUc1RCxHQUFHLG9GQUFvRixZQUFNO29CQUN6RjtvQkFDQSxNQUFNLHNCQUFzQjtvQkFDNUIsUUFBUSxLQUFLLHNCQUFzQjtvQkFDbkMsT0FBTztvQkFDUCxPQUFPLHFCQUFxQixzQkFBc0I7b0JBQ2xELElBQUksT0FBTyxxQkFBcUIscUJBQXFCLE1BQU0sYUFBYTtvQkFDeEUsT0FBTyxLQUFLLElBQUksUUFBUTtvQkFDeEIsT0FBTyxRQUFRLFdBQVcsS0FBSyxLQUFLLFFBQVE7b0JBQzVDLGVBQWUsUUFBUSxNQUFNO29CQUM3QixLQUFLO29CQUNMLE9BQU8sZUFBZSxTQUFTOzs7OztHQWtCcEMiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uQ2FyZERpcmVjdGl2ZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5cbmRlc2NyaWJlKCdDZXJ0aWZpY2F0aW9uQ2FyZERpcmVjdGl2ZScsICgpID0+IHtcblxuICAgIGxldCAkY29tcGlsZSwgbmF2aWdhdGlvblNlcnZpY2UsIGNvbHVtbktleSwgY29sdW1ucywgY2VydCwgZWxlbWVudCwgJHNjb3BlLCByZWZyZXNoVHJpZ2dlciwgY2VydGlmaWNhdGlvblNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiA5ICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF8kY29tcGlsZV8sIF9uYXZpZ2F0aW9uU2VydmljZV8sIENlcnRpZmljYXRpb24sIGNlcnRpZmljYXRpb25UZXN0RGF0YSwgY29uZmlnU2VydmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgJHEsIENvbHVtbkNvbmZpZywgJHJvb3RTY29wZSwgX2NlcnRpZmljYXRpb25TZXJ2aWNlXykgPT4ge1xuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XG4gICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlID0gX25hdmlnYXRpb25TZXJ2aWNlXztcbiAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlID0gX2NlcnRpZmljYXRpb25TZXJ2aWNlXztcblxuICAgICAgICBjb2x1bW5LZXkgPSAndGhpc0NvbHVtbktleSc7XG4gICAgICAgIGNlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKTtcbiAgICAgICAgY29sdW1ucyA9IFtcbiAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2V4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgIGRhdGVTdHlsZTogJ3Nob3J0JyxcbiAgICAgICAgICAgICAgICBoZWFkZXJLZXk6ICdFWFBJUkFUSU9OJ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICduYW1lJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJLZXk6ICdOQU1FJ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdpZCcsXG4gICAgICAgICAgICAgICAgZmllbGRPbmx5OiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICBdO1xuICAgICAgICBsZXQgZGF0YSA9IHt9O1xuICAgICAgICBkYXRhW2NvbHVtbktleV0gPSBjb2x1bW5zO1xuICAgICAgICBzcHlPbihjb25maWdTZXJ2aWNlLCAnZ2V0Q29sdW1uQ29uZmlnRW50cmllcycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKHsgZGF0YTogZGF0YSB9KSk7XG5cbiAgICAgICAgcmVmcmVzaFRyaWdnZXIgPSB7XG4gICAgICAgICAgICByZWZyZXNoOiBqYXNtaW5lLmNyZWF0ZVNweSgncmVmcmVzaCcpXG4gICAgICAgIH07XG4gICAgfSkpO1xuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZSkge1xuICAgICAgICAgICAgJHNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNvbXBpbGUoKSB7XG4gICAgICAgIGxldCBlbHREZWYgPSAnPHNwLWNlcnRpZmljYXRpb24tY2FyZCBzcC1jZXJ0aWZpY2F0aW9uPVwiY2VydFwiIHNwLWNvbHVtbi1jb25maWcta2V5PVwiY29sdW1uS2V5XCInICtcbiAgICAgICAgICAgICcgc3AtcmVmcmVzaC10cmlnZ2VyPVwicmVmcmVzaFRyaWdnZXJcIiAvPic7XG4gICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWx0RGVmKTtcblxuICAgICAgICAkc2NvcGUuY2VydCA9IGNlcnQ7XG4gICAgICAgICRzY29wZS5jb2x1bW5LZXkgPSBjb2x1bW5LZXk7XG4gICAgICAgICRzY29wZS5yZWZyZXNoVHJpZ2dlciA9IHJlZnJlc2hUcmlnZ2VyO1xuXG4gICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaXQoJ3Rocm93cyB3aXRoIG5vIGNlcnRpZmljYXRpb24nLCAoKSA9PiB7XG4gICAgICAgIGNlcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGV4cGVjdCgoKSA9PiBjb21waWxlKCkpLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBjb2x1bW4gY29uZmlnIGtleScsICgpID0+IHtcbiAgICAgICAgY29sdW1uS2V5ID0gbnVsbDtcbiAgICAgICAgZXhwZWN0KCgpID0+IGNvbXBpbGUoKSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ29ubHkgc2hvd3MgZGlzcGxheWVkIGNvbHVtbnMnLCAoKSA9PiB7XG4gICAgICAgIGNvbXBpbGUoKTtcbiAgICAgICAgbGV0IGxpbmVzID0gZWxlbWVudC5maW5kKCd1bC5saXN0LWdyb3VwIGxpLmxpc3QtZ3JvdXAtaXRlbScpO1xuICAgICAgICBleHBlY3QobGluZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICBleHBlY3QobGluZXNbMF0uaW5uZXJUZXh0KS50b0NvbnRhaW4oY29sdW1uc1swXS5oZWFkZXJLZXkpO1xuICAgICAgICBleHBlY3QobGluZXNbMV0uaW5uZXJUZXh0KS50b0NvbnRhaW4oY29sdW1uc1sxXS5oZWFkZXJLZXkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ25hdmlnYXRlcyB0byBjZXJ0aWZpY2F0aW9uIHZpZXcgaWYgcmV2aWV3IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICBjb21waWxlKCk7XG4gICAgICAgIHNweU9uKG5hdmlnYXRpb25TZXJ2aWNlLCAnZ28nKTtcbiAgICAgICAgZWxlbWVudC5maW5kKCdidXR0b24udmlldy1idG4nKS5jbGljaygpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5nbykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICBsZXQgY29uZmlnID0gbmF2aWdhdGlvblNlcnZpY2UuZ28uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XG4gICAgICAgIGV4cGVjdChjb25maWcuc3RhdGUpLnRvRXF1YWwoJ2NlcnRpZmljYXRpb24udmlldycpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnN0YXRlUGFyYW1zLmNlcnRpZmljYXRpb25JZCkudG9FcXVhbChjZXJ0LmlkKTtcbiAgICB9KTtcblxuICAgIGl0KCdjYWxscyBjZXJ0aWZpY2F0aW9uU2VydmljZSB0byBmb3J3YXJkIGNlcnRpZmljYXRpb24gaWYgZm9yd2FyZCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgY29tcGlsZSgpO1xuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ2ZvcndhcmRDZXJ0aWZpY2F0aW9uJyk7XG4gICAgICAgIGVsZW1lbnQuZmluZCgnYnV0dG9uLmZvcndhcmQtYnRuJykuY2xpY2soKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZm9yd2FyZENlcnRpZmljYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgbGV0IGFyZ3MgPSBjZXJ0aWZpY2F0aW9uU2VydmljZS5mb3J3YXJkQ2VydGlmaWNhdGlvbi5jYWxscy5tb3N0UmVjZW50KCkuYXJncztcbiAgICAgICAgZXhwZWN0KGFyZ3NbMF0pLnRvRXF1YWwoY2VydCk7XG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oYXJnc1sxXSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIHJlZnJlc2hUcmlnZ2VyLnJlZnJlc2guY2FsbHMucmVzZXQoKTtcbiAgICAgICAgYXJnc1sxXSgpO1xuICAgICAgICBleHBlY3QocmVmcmVzaFRyaWdnZXIucmVmcmVzaCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
