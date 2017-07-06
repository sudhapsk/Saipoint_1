System.register(['test/js/TestInitializer', 'identity/IdentityModule', './IdentityTestData'], function (_export) {
    /*
     * Copyright (C) 2016 SailPoint Technologies, Inc.  All rights reserved.
     */

    'use strict';

    var identityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }, function (_IdentityTestData) {}],
        execute: function () {

            /**
             * Tests for the manageAccountService.
             */
            describe('identityProvisioningFormService', function () {
                var quicklink = 'Edit%20Identity';
                var baseURLManageAccounts = '/identityiq/ui/rest/quickLinks/' + quicklink + '/';
                var identityProvisioningFormService = undefined,
                    $httpBackend = undefined,
                    identityTestData = undefined,
                    Identity = undefined,
                    identity1 = undefined,
                    UpdateIdentityResultItem = undefined;

                // Use the identity module.
                beforeEach(module(identityModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                    $provide.constant('SP_CURR_USER_ID', '123');
                }));

                beforeEach(inject(function (_identityProvisioningFormService_, _$httpBackend_, _identityTestData_, _Identity_, _UpdateIdentityResultItem_) {
                    identityProvisioningFormService = _identityProvisioningFormService_;
                    $httpBackend = _$httpBackend_;
                    identityTestData = _identityTestData_;
                    Identity = _Identity_;
                    identity1 = new Identity(identityTestData.IDENTITY1);
                    UpdateIdentityResultItem = _UpdateIdentityResultItem_;
                }));

                afterEach(function () {
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });

                describe('getForm', function () {
                    it('should return edit identity form', function () {
                        var promise = undefined,
                            currentUrl = baseURLManageAccounts + 'form?identityId=' + identity1.getId();
                        $httpBackend.expectGET(currentUrl).respond(200, {});
                        promise = identityProvisioningFormService.getForm(quicklink, identity1.getId());
                        $httpBackend.flush();
                    });
                });

                describe('submitting forms', function () {
                    var promiseTrackerService = undefined,
                        $http = undefined,
                        $rootScope = undefined,
                        $q = undefined,
                        formData = undefined;

                    beforeEach(inject(function (_promiseTrackerService_, _$http_, _$rootScope_, _$q_) {
                        promiseTrackerService = _promiseTrackerService_;
                        $http = _$http_;
                        $rootScope = _$rootScope_;
                        $q = _$q_;

                        formData = {
                            formId: 'form001',
                            quickLinkName: 'Edit Identity',
                            getValues: function () {
                                return {
                                    manager: 'test manager',
                                    location: 'US'
                                };
                            },
                            getValuesForSubmission: function () {
                                return {
                                    manager: 'test manager',
                                    location: 'US'
                                };
                            }
                        };
                    }));

                    describe('submitUpdateForm', function () {
                        it('should post to expected endpoint', function () {
                            var comment = 'Some comments',
                                priority = 'Normal',
                                promise = undefined,
                                currentUrl = baseURLManageAccounts + 'form?identityId=' + identity1.getId();
                            $httpBackend.expectPOST(currentUrl).respond(200, {});
                            promise = identityProvisioningFormService.submitUpdateForm(quicklink, identity1.getId(), formData, comment, priority);
                            $httpBackend.flush();
                        });

                        it('should add promise to promise tracker', function () {
                            var promise = $q.when({ data: new UpdateIdentityResultItem({}) });
                            spyOn($http, 'post').and.returnValue(promise);
                            spyOn(promiseTrackerService, 'track');
                            identityProvisioningFormService.submitUpdateForm(quicklink, identity1.getId(), formData);
                            expect(promiseTrackerService.track).toHaveBeenCalled();
                        });

                        it('should reject with an array of messages on error', function () {
                            var errorMessages = ['error 1', 'error 2'],
                                promise = $q.reject({ data: errorMessages }),
                                actualResult = undefined;
                            spyOn($http, 'post').and.returnValue(promise);
                            identityProvisioningFormService.submitUpdateForm(quicklink, identity1.getId(), formData)['catch'](function (error) {
                                actualResult = error;
                            });
                            $rootScope.$apply();
                            expect(actualResult).toBe(errorMessages);
                        });
                    });

                    describe('submitCreateForm', function () {
                        it('should post to expected endpoint', function () {
                            var comment = 'Some comments',
                                priority = 'Normal',
                                promise = undefined,
                                currentUrl = baseURLManageAccounts + 'form';
                            $httpBackend.expectPOST(currentUrl).respond(200, {});
                            promise = identityProvisioningFormService.submitCreateForm(quicklink, formData, comment, priority);
                            $httpBackend.flush();
                        });

                        it('should add promise to promise tracker', function () {
                            var promise = $q.when({ data: new UpdateIdentityResultItem({}) });
                            spyOn($http, 'post').and.returnValue(promise);
                            spyOn(promiseTrackerService, 'track');
                            identityProvisioningFormService.submitCreateForm(quicklink, formData);
                            expect(promiseTrackerService.track).toHaveBeenCalled();
                        });

                        it('should reject with an array of messages on error', function () {
                            var errorMessages = ['error 1', 'error 2'],
                                promise = $q.reject({ data: errorMessages }),
                                actualResult = undefined;
                            spyOn($http, 'post').and.returnValue(promise);
                            identityProvisioningFormService.submitCreateForm(quicklink, formData)['catch'](function (error) {
                                actualResult = error;
                            });
                            $rootScope.$apply();
                            expect(actualResult).toBe(errorMessages);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0lkZW50aXR5UHJvdmlzaW9uaW5nRm9ybVNlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHVCQUF1QixVQUFVLFNBQVM7Ozs7O0lBSzdHOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLG1CQUFtQjtRQUNoQyxTQUFTLFlBQVk7Ozs7O1lBRDdCLFNBQVMsbUNBQW1DLFlBQVc7Z0JBQ25ELElBQU0sWUFBWTtnQkFDbEIsSUFBTSx3QkFBcUIsb0NBQXFDLFlBQVM7Z0JBQ3pFLElBQUksa0NBQStCO29CQUFFLGVBQVk7b0JBQUUsbUJBQWdCO29CQUFFLFdBQVE7b0JBQUUsWUFBUztvQkFBRSwyQkFBd0I7OztnQkFHbEgsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsVUFBVTtvQkFDakMsU0FBUyxTQUFTLG1CQUFtQjtvQkFDckMsU0FBUyxTQUFTLG1CQUFtQjs7O2dCQUd6QyxXQUFXLE9BQU8sVUFBUyxtQ0FBbUMsZ0JBQWdCLG9CQUFvQixZQUN2RSw0QkFBNEI7b0JBQ25ELGtDQUFrQztvQkFDbEMsZUFBZTtvQkFDZixtQkFBbUI7b0JBQ25CLFdBQVc7b0JBQ1gsWUFBWSxJQUFJLFNBQVMsaUJBQWlCO29CQUMxQywyQkFBMkI7OztnQkFHL0IsVUFBVSxZQUFXO29CQUNqQixhQUFhO29CQUNiLGFBQWE7OztnQkFHakIsU0FBUyxXQUFXLFlBQVc7b0JBQzNCLEdBQUcsb0NBQW9DLFlBQVc7d0JBQzlDLElBQUksVUFBTzs0QkFBRSxhQUFnQix3QkFBcUIscUJBQW1CLFVBQVU7d0JBQy9FLGFBQWEsVUFBVSxZQUFZLFFBQVEsS0FBSzt3QkFDaEQsVUFBVSxnQ0FBZ0MsUUFBUSxXQUFXLFVBQVU7d0JBQ3ZFLGFBQWE7Ozs7Z0JBS3JCLFNBQVMsb0JBQW9CLFlBQVc7b0JBQ3BDLElBQUksd0JBQXFCO3dCQUFFLFFBQUs7d0JBQUUsYUFBVTt3QkFBRSxLQUFFO3dCQUFFLFdBQVE7O29CQUUxRCxXQUFXLE9BQU8sVUFBUyx5QkFBeUIsU0FBUyxjQUFjLE1BQU07d0JBQzdFLHdCQUF3Qjt3QkFDeEIsUUFBUTt3QkFDUixhQUFhO3dCQUNiLEtBQUs7O3dCQUdMLFdBQVc7NEJBQ1AsUUFBUTs0QkFDUixlQUFlOzRCQUNmLFdBQVcsWUFBVztnQ0FDbEIsT0FBTztvQ0FDSCxTQUFTO29DQUNULFVBQVU7Ozs0QkFHbEIsd0JBQXdCLFlBQVc7Z0NBQy9CLE9BQU87b0NBQ0gsU0FBUztvQ0FDVCxVQUFVOzs7Ozs7b0JBTTFCLFNBQVMsb0JBQW9CLFlBQVc7d0JBQ3BDLEdBQUcsb0NBQW9DLFlBQVc7NEJBQzlDLElBQUksVUFBVTtnQ0FDVixXQUFXO2dDQUNYLFVBQU87Z0NBQ1AsYUFBYSx3QkFBd0IscUJBQXFCLFVBQVU7NEJBQ3hFLGFBQWEsV0FBVyxZQUFZLFFBQVEsS0FBSzs0QkFDakQsVUFBVSxnQ0FDTCxpQkFBaUIsV0FBVyxVQUFVLFNBQVMsVUFBVSxTQUFTOzRCQUN2RSxhQUFhOzs7d0JBR2pCLEdBQUcseUNBQXlDLFlBQVc7NEJBQ25ELElBQUksVUFBVSxHQUFHLEtBQUssRUFBQyxNQUFNLElBQUkseUJBQXlCOzRCQUMxRCxNQUFNLE9BQU8sUUFBUSxJQUFJLFlBQVk7NEJBQ3JDLE1BQU0sdUJBQXVCOzRCQUM3QixnQ0FBZ0MsaUJBQWlCLFdBQVcsVUFBVSxTQUFTOzRCQUMvRSxPQUFPLHNCQUFzQixPQUFPOzs7d0JBR3hDLEdBQUcsb0RBQW9ELFlBQVc7NEJBQzlELElBQUksZ0JBQWdCLENBQUMsV0FBVztnQ0FDNUIsVUFBVSxHQUFHLE9BQU8sRUFBQyxNQUFNO2dDQUMzQixlQUFZOzRCQUNoQixNQUFNLE9BQU8sUUFBUSxJQUFJLFlBQVk7NEJBQ3JDLGdDQUNLLGlCQUFpQixXQUFXLFVBQVUsU0FBUyxVQUFTLFNBQU8sVUFBQSxPQUFTO2dDQUNyRSxlQUFlOzs0QkFFdkIsV0FBVzs0QkFDWCxPQUFPLGNBQWMsS0FBSzs7OztvQkFJbEMsU0FBUyxvQkFBb0IsWUFBVzt3QkFDcEMsR0FBRyxvQ0FBb0MsWUFBVzs0QkFDOUMsSUFBSSxVQUFVO2dDQUNWLFdBQVc7Z0NBQ1gsVUFBTztnQ0FDUCxhQUFhLHdCQUF3Qjs0QkFDekMsYUFBYSxXQUFXLFlBQVksUUFBUSxLQUFLOzRCQUNqRCxVQUFVLGdDQUNMLGlCQUFpQixXQUFXLFVBQVUsU0FBUzs0QkFDcEQsYUFBYTs7O3dCQUdqQixHQUFHLHlDQUF5QyxZQUFXOzRCQUNuRCxJQUFJLFVBQVUsR0FBRyxLQUFLLEVBQUMsTUFBTSxJQUFJLHlCQUF5Qjs0QkFDMUQsTUFBTSxPQUFPLFFBQVEsSUFBSSxZQUFZOzRCQUNyQyxNQUFNLHVCQUF1Qjs0QkFDN0IsZ0NBQWdDLGlCQUFpQixXQUFXOzRCQUM1RCxPQUFPLHNCQUFzQixPQUFPOzs7d0JBR3hDLEdBQUcsb0RBQW9ELFlBQVc7NEJBQzlELElBQUksZ0JBQWdCLENBQUMsV0FBVztnQ0FDNUIsVUFBVSxHQUFHLE9BQU8sRUFBQyxNQUFNO2dDQUMzQixlQUFZOzRCQUNoQixNQUFNLE9BQU8sUUFBUSxJQUFJLFlBQVk7NEJBQ3JDLGdDQUFnQyxpQkFBaUIsV0FBVyxVQUFTLFNBQU8sVUFBQSxPQUFTO2dDQUNqRixlQUFlOzs0QkFFbkIsV0FBVzs0QkFDWCxPQUFPLGNBQWMsS0FBSzs7Ozs7OztHQWlCdkMiLCJmaWxlIjoiaWRlbnRpdHkvSWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoQykgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGlkZW50aXR5TW9kdWxlIGZyb20gJ2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcbmltcG9ydCAnLi9JZGVudGl0eVRlc3REYXRhJztcblxuLyoqXG4gKiBUZXN0cyBmb3IgdGhlIG1hbmFnZUFjY291bnRTZXJ2aWNlLlxuICovXG5kZXNjcmliZSgnaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHF1aWNrbGluayA9ICdFZGl0JTIwSWRlbnRpdHknO1xuICAgIGNvbnN0IGJhc2VVUkxNYW5hZ2VBY2NvdW50cyA9IGAvaWRlbnRpdHlpcS91aS9yZXN0L3F1aWNrTGlua3MvJHtxdWlja2xpbmt9L2A7XG4gICAgbGV0IGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybVNlcnZpY2UsICRodHRwQmFja2VuZCwgaWRlbnRpdHlUZXN0RGF0YSwgSWRlbnRpdHksIGlkZW50aXR5MSwgVXBkYXRlSWRlbnRpdHlSZXN1bHRJdGVtO1xuXG4gICAgLy8gVXNlIHRoZSBpZGVudGl0eSBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoaWRlbnRpdHlNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmNvbnN0YW50KCdTUF9DT05URVhUX1BBVEgnLCAnL2lkZW50aXR5aXEnKTtcbiAgICAgICAgJHByb3ZpZGUuY29uc3RhbnQoJ1NQX0NVUlJfVVNFUl9JRCcsICcxMjMnKTtcbiAgICB9KSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZV8sIF8kaHR0cEJhY2tlbmRfLCBfaWRlbnRpdHlUZXN0RGF0YV8sIF9JZGVudGl0eV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX1VwZGF0ZUlkZW50aXR5UmVzdWx0SXRlbV8pIHtcbiAgICAgICAgaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZSA9IF9pZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlXztcbiAgICAgICAgJGh0dHBCYWNrZW5kID0gXyRodHRwQmFja2VuZF87XG4gICAgICAgIGlkZW50aXR5VGVzdERhdGEgPSBfaWRlbnRpdHlUZXN0RGF0YV87XG4gICAgICAgIElkZW50aXR5ID0gX0lkZW50aXR5XztcbiAgICAgICAgaWRlbnRpdHkxID0gbmV3IElkZW50aXR5KGlkZW50aXR5VGVzdERhdGEuSURFTlRJVFkxKTtcbiAgICAgICAgVXBkYXRlSWRlbnRpdHlSZXN1bHRJdGVtID0gX1VwZGF0ZUlkZW50aXR5UmVzdWx0SXRlbV87XG4gICAgfSkpO1xuXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uKCk7XG4gICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEZvcm0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZWRpdCBpZGVudGl0eSBmb3JtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSwgY3VycmVudFVybCA9IGAke2Jhc2VVUkxNYW5hZ2VBY2NvdW50c31mb3JtP2lkZW50aXR5SWQ9JHtpZGVudGl0eTEuZ2V0SWQoKX1gO1xuICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVChjdXJyZW50VXJsKS5yZXNwb25kKDIwMCwge30pO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybVNlcnZpY2UuZ2V0Rm9ybShxdWlja2xpbmssIGlkZW50aXR5MS5nZXRJZCgpKTtcbiAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgZGVzY3JpYmUoJ3N1Ym1pdHRpbmcgZm9ybXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHByb21pc2VUcmFja2VyU2VydmljZSwgJGh0dHAsICRyb290U2NvcGUsICRxLCBmb3JtRGF0YTtcblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfcHJvbWlzZVRyYWNrZXJTZXJ2aWNlXywgXyRodHRwXywgXyRyb290U2NvcGVfLCBfJHFfKSB7XG4gICAgICAgICAgICBwcm9taXNlVHJhY2tlclNlcnZpY2UgPSBfcHJvbWlzZVRyYWNrZXJTZXJ2aWNlXztcbiAgICAgICAgICAgICRodHRwID0gXyRodHRwXztcbiAgICAgICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XG4gICAgICAgICAgICAkcSA9IF8kcV87XG5cblxuICAgICAgICAgICAgZm9ybURhdGEgPSB7XG4gICAgICAgICAgICAgICAgZm9ybUlkOiAnZm9ybTAwMScsXG4gICAgICAgICAgICAgICAgcXVpY2tMaW5rTmFtZTogJ0VkaXQgSWRlbnRpdHknLFxuICAgICAgICAgICAgICAgIGdldFZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYW5hZ2VyOiAndGVzdCBtYW5hZ2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiAnVVMnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZXNGb3JTdWJtaXNzaW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hbmFnZXI6ICd0ZXN0IG1hbmFnZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246ICdVUydcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3N1Ym1pdFVwZGF0ZUZvcm0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcG9zdCB0byBleHBlY3RlZCBlbmRwb2ludCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxldCBjb21tZW50ID0gJ1NvbWUgY29tbWVudHMnLFxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eSA9ICdOb3JtYWwnLFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXJsID0gYmFzZVVSTE1hbmFnZUFjY291bnRzICsgJ2Zvcm0/aWRlbnRpdHlJZD0nICsgaWRlbnRpdHkxLmdldElkKCk7XG4gICAgICAgICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdFBPU1QoY3VycmVudFVybCkucmVzcG9uZCgyMDAsIHt9KTtcbiAgICAgICAgICAgICAgICBwcm9taXNlID0gaWRlbnRpdHlQcm92aXNpb25pbmdGb3JtU2VydmljZVxuICAgICAgICAgICAgICAgICAgICAuc3VibWl0VXBkYXRlRm9ybShxdWlja2xpbmssIGlkZW50aXR5MS5nZXRJZCgpLCBmb3JtRGF0YSwgY29tbWVudCwgcHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgYWRkIHByb21pc2UgdG8gcHJvbWlzZSB0cmFja2VyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2UgPSAkcS53aGVuKHtkYXRhOiBuZXcgVXBkYXRlSWRlbnRpdHlSZXN1bHRJdGVtKHt9KX0pO1xuICAgICAgICAgICAgICAgIHNweU9uKCRodHRwLCAncG9zdCcpLmFuZC5yZXR1cm5WYWx1ZShwcm9taXNlKTtcbiAgICAgICAgICAgICAgICBzcHlPbihwcm9taXNlVHJhY2tlclNlcnZpY2UsICd0cmFjaycpO1xuICAgICAgICAgICAgICAgIGlkZW50aXR5UHJvdmlzaW9uaW5nRm9ybVNlcnZpY2Uuc3VibWl0VXBkYXRlRm9ybShxdWlja2xpbmssIGlkZW50aXR5MS5nZXRJZCgpLCBmb3JtRGF0YSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHByb21pc2VUcmFja2VyU2VydmljZS50cmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVqZWN0IHdpdGggYW4gYXJyYXkgb2YgbWVzc2FnZXMgb24gZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlcyA9IFsnZXJyb3IgMScsICdlcnJvciAyJ10sXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSAkcS5yZWplY3Qoe2RhdGE6IGVycm9yTWVzc2FnZXN9KSxcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsUmVzdWx0O1xuICAgICAgICAgICAgICAgIHNweU9uKCRodHRwLCAncG9zdCcpLmFuZC5yZXR1cm5WYWx1ZShwcm9taXNlKTtcbiAgICAgICAgICAgICAgICBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgIC5zdWJtaXRVcGRhdGVGb3JtKHF1aWNrbGluaywgaWRlbnRpdHkxLmdldElkKCksIGZvcm1EYXRhKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxSZXN1bHQgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoYWN0dWFsUmVzdWx0KS50b0JlKGVycm9yTWVzc2FnZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdzdWJtaXRDcmVhdGVGb3JtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgnc2hvdWxkIHBvc3QgdG8gZXhwZWN0ZWQgZW5kcG9pbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tbWVudCA9ICdTb21lIGNvbW1lbnRzJyxcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHkgPSAnTm9ybWFsJyxcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVybCA9IGJhc2VVUkxNYW5hZ2VBY2NvdW50cyArICdmb3JtJztcbiAgICAgICAgICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVChjdXJyZW50VXJsKS5yZXNwb25kKDIwMCwge30pO1xuICAgICAgICAgICAgICAgIHByb21pc2UgPSBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgIC5zdWJtaXRDcmVhdGVGb3JtKHF1aWNrbGluaywgZm9ybURhdGEsIGNvbW1lbnQsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFkZCBwcm9taXNlIHRvIHByb21pc2UgdHJhY2tlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlID0gJHEud2hlbih7ZGF0YTogbmV3IFVwZGF0ZUlkZW50aXR5UmVzdWx0SXRlbSh7fSl9KTtcbiAgICAgICAgICAgICAgICBzcHlPbigkaHR0cCwgJ3Bvc3QnKS5hbmQucmV0dXJuVmFsdWUocHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgc3B5T24ocHJvbWlzZVRyYWNrZXJTZXJ2aWNlLCAndHJhY2snKTtcbiAgICAgICAgICAgICAgICBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlLnN1Ym1pdENyZWF0ZUZvcm0ocXVpY2tsaW5rLCBmb3JtRGF0YSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHByb21pc2VUcmFja2VyU2VydmljZS50cmFjaykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVqZWN0IHdpdGggYW4gYXJyYXkgb2YgbWVzc2FnZXMgb24gZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlcyA9IFsnZXJyb3IgMScsICdlcnJvciAyJ10sXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSAkcS5yZWplY3Qoe2RhdGE6IGVycm9yTWVzc2FnZXN9KSxcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsUmVzdWx0O1xuICAgICAgICAgICAgICAgIHNweU9uKCRodHRwLCAncG9zdCcpLmFuZC5yZXR1cm5WYWx1ZShwcm9taXNlKTtcbiAgICAgICAgICAgICAgICBpZGVudGl0eVByb3Zpc2lvbmluZ0Zvcm1TZXJ2aWNlLnN1Ym1pdENyZWF0ZUZvcm0ocXVpY2tsaW5rLCBmb3JtRGF0YSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhY3R1YWxSZXN1bHQgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY3R1YWxSZXN1bHQpLnRvQmUoZXJyb3JNZXNzYWdlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
