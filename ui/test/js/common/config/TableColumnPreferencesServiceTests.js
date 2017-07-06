System.register(['test/js/TestInitializer', 'common/config/ConfigModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    'use strict';

    var configModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonConfigConfigModule) {
            configModule = _commonConfigConfigModule['default'];
        }],
        execute: function () {

            describe('TableColumnPreferenceService', function () {
                var http = undefined,
                    tableColumnPreferenceService = undefined,
                    contextPath = undefined,
                    $rootScope = undefined,
                    url = undefined,
                    testTableId = 'testTableId',
                    testColumnPreferences = ['col1', 'col2'];

                beforeEach(module(configModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                }));

                beforeEach(inject(function ($httpBackend, _tableColumnPreferenceService_, _$rootScope_, SP_CONTEXT_PATH) {
                    http = $httpBackend;
                    tableColumnPreferenceService = _tableColumnPreferenceService_;
                    $rootScope = _$rootScope_;
                    contextPath = SP_CONTEXT_PATH;
                    url = SP_CONTEXT_PATH + '/ui/rest/me/tableColumnPreferences/' + testTableId;
                }));

                afterEach(function () {
                    http.verifyNoOutstandingExpectation();
                    http.verifyNoOutstandingRequest();
                });

                describe('getTableColumnPreferences', function () {
                    it('should throw with no params', function () {
                        expect(function () {
                            tableColumnPreferenceService.getTableColumnPreferences();
                        }).toThrow();
                    });

                    it('should get table column preferences', function () {
                        http.expectGET(url).respond(200, testColumnPreferences);

                        tableColumnPreferenceService.getTableColumnPreferences(testTableId).then(function (response) {
                            expect(response).toEqual(testColumnPreferences);
                        });

                        http.flush();
                        $rootScope.$apply();
                    });
                });

                describe('setTableColumnPreferences', function () {
                    it('should throw with no params', function () {
                        expect(function () {
                            tableColumnPreferenceService.saveTableColumnPreferences();
                        }).toThrow();
                    });

                    it('puts the new table column preferences', function () {
                        http.expect('PUT', url, testColumnPreferences).respond(200);
                        tableColumnPreferenceService.saveTableColumnPreferences(testTableId, testColumnPreferences);
                        http.flush();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9jb25maWcvVGFibGVDb2x1bW5QcmVmZXJlbmNlc1NlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsK0JBQStCLFVBQVUsU0FBUzs7Ozs7SUFLMUY7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLDJCQUEyQjtZQUNqRixlQUFlLDBCQUEwQjs7UUFFN0MsU0FBUyxZQUFZOztZQUw3QixTQUFTLGdDQUFnQyxZQUFNO2dCQUMzQyxJQUFJLE9BQUk7b0JBQUUsK0JBQTRCO29CQUFFLGNBQVc7b0JBQUUsYUFBVTtvQkFBRSxNQUFHO29CQUNoRSxjQUFjO29CQUNkLHdCQUF3QixDQUFDLFFBQVE7O2dCQUVyQyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxVQUFVO29CQUNqQyxTQUFTLFNBQVMsbUJBQW1COzs7Z0JBR3pDLFdBQVcsT0FBTyxVQUFTLGNBQWMsZ0NBQWdDLGNBQWMsaUJBQWlCO29CQUNwRyxPQUFPO29CQUNQLCtCQUErQjtvQkFDL0IsYUFBYTtvQkFDYixjQUFjO29CQUNkLE1BQVMsa0JBQWUsd0NBQXNDOzs7Z0JBR2xFLFVBQVUsWUFBVztvQkFDakIsS0FBSztvQkFDTCxLQUFLOzs7Z0JBR1QsU0FBUyw2QkFBNkIsWUFBTTtvQkFDeEMsR0FBRywrQkFBK0IsWUFBVzt3QkFDekMsT0FBTyxZQUFXOzRCQUNkLDZCQUE2QjsyQkFDOUI7OztvQkFHUCxHQUFHLHVDQUF1QyxZQUFNO3dCQUM1QyxLQUFLLFVBQVUsS0FBSyxRQUFRLEtBQUs7O3dCQUVqQyw2QkFBNkIsMEJBQTBCLGFBQWEsS0FBSyxVQUFTLFVBQVU7NEJBQ3hGLE9BQU8sVUFBVSxRQUFROzs7d0JBRzdCLEtBQUs7d0JBQ0wsV0FBVzs7OztnQkFJbkIsU0FBUyw2QkFBNkIsWUFBTTtvQkFDeEMsR0FBRywrQkFBK0IsWUFBVzt3QkFDekMsT0FBTyxZQUFXOzRCQUNkLDZCQUE2QjsyQkFDOUI7OztvQkFHUCxHQUFHLHlDQUF5QyxZQUFXO3dCQUNuRCxLQUFLLE9BQU8sT0FBTyxLQUFLLHVCQUF1QixRQUFRO3dCQUN2RCw2QkFBNkIsMkJBQTJCLGFBQWE7d0JBQ3JFLEtBQUs7Ozs7OztHQWlCZCIsImZpbGUiOiJjb21tb24vY29uZmlnL1RhYmxlQ29sdW1uUHJlZmVyZW5jZXNTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKGMpIENvcHlyaWdodCAyMDE2LiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNvbmZpZ01vZHVsZSBmcm9tICdjb21tb24vY29uZmlnL0NvbmZpZ01vZHVsZSc7XG5cbmRlc2NyaWJlKCdUYWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlJywgKCkgPT4ge1xuICAgIGxldCBodHRwLCB0YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlLCBjb250ZXh0UGF0aCwgJHJvb3RTY29wZSwgdXJsLFxuICAgICAgICB0ZXN0VGFibGVJZCA9ICd0ZXN0VGFibGVJZCcsXG4gICAgICAgIHRlc3RDb2x1bW5QcmVmZXJlbmNlcyA9IFsnY29sMScsICdjb2wyJ107XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjb25maWdNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmNvbnN0YW50KCdTUF9DT05URVhUX1BBVEgnLCAnL2lkZW50aXR5aXEnKTtcbiAgICB9KSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkaHR0cEJhY2tlbmQsIF90YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlXywgXyRyb290U2NvcGVfLCBTUF9DT05URVhUX1BBVEgpIHtcbiAgICAgICAgaHR0cCA9ICRodHRwQmFja2VuZDtcbiAgICAgICAgdGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZSA9IF90YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlXztcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICAgICAgY29udGV4dFBhdGggPSBTUF9DT05URVhUX1BBVEg7XG4gICAgICAgIHVybCA9IGAke1NQX0NPTlRFWFRfUEFUSH0vdWkvcmVzdC9tZS90YWJsZUNvbHVtblByZWZlcmVuY2VzLyR7dGVzdFRhYmxlSWR9YDtcbiAgICB9KSk7XG5cbiAgICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uKCk7XG4gICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRUYWJsZUNvbHVtblByZWZlcmVuY2VzJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdpdGggbm8gcGFyYW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZS5nZXRUYWJsZUNvbHVtblByZWZlcmVuY2VzKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgZ2V0IHRhYmxlIGNvbHVtbiBwcmVmZXJlbmNlcycsICgpID0+IHtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKHVybCkucmVzcG9uZCgyMDAsIHRlc3RDb2x1bW5QcmVmZXJlbmNlcyk7XG5cbiAgICAgICAgICAgIHRhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2UuZ2V0VGFibGVDb2x1bW5QcmVmZXJlbmNlcyh0ZXN0VGFibGVJZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZSkudG9FcXVhbCh0ZXN0Q29sdW1uUHJlZmVyZW5jZXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NldFRhYmxlQ29sdW1uUHJlZmVyZW5jZXMnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2l0aCBubyBwYXJhbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlLnNhdmVUYWJsZUNvbHVtblByZWZlcmVuY2VzKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdXRzIHRoZSBuZXcgdGFibGUgY29sdW1uIHByZWZlcmVuY2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBodHRwLmV4cGVjdCgnUFVUJywgdXJsLCB0ZXN0Q29sdW1uUHJlZmVyZW5jZXMpLnJlc3BvbmQoMjAwKTtcbiAgICAgICAgICAgIHRhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2Uuc2F2ZVRhYmxlQ29sdW1uUHJlZmVyZW5jZXModGVzdFRhYmxlSWQsIHRlc3RDb2x1bW5QcmVmZXJlbmNlcyk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
