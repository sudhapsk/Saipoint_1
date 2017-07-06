System.register(['test/js/TestInitializer', 'common/form/FormAppModule', 'test/js/common/form/FormPreviewTestData'], function (_export) {
    'use strict';

    var formAppModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonFormFormAppModule) {
            formAppModule = _commonFormFormAppModule['default'];
        }, function (_testJsCommonFormFormPreviewTestData) {}],
        execute: function () {

            describe('FormPreviewDirective', function () {
                var ctrl, formService, scope, testValue, formJson, deferred, $controller;

                beforeEach(module(formAppModule));

                beforeEach(inject(function (_$controller_, $rootScope, $q, _formService_, formPreviewTestData) {
                    $controller = _$controller_;
                    deferred = $q.defer();
                    scope = $rootScope.$new();
                    formService = _formService_;
                    formJson = formPreviewTestData.PREVIEW_FORM_JSON;
                    SailPoint.previewFormJSON = formJson;
                    testValue = {};

                    spyOn(formService, 'getPreviewForm').and.returnValue(deferred.promise);
                }));

                function createController() {

                    ctrl = $controller('FormPreviewDirectiveCtrl', {
                        $scope: scope,
                        formService: formService
                    });

                    scope.$apply();
                }

                it('should call form service with input form json', function () {
                    createController();
                    expect(formService.getPreviewForm).toHaveBeenCalledWith(formJson);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9mb3JtL0Zvcm1QcmV2aWV3RGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDZCQUE2Qiw0Q0FBNEMsVUFBVSxTQUFTO0lBQXhJOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwwQkFBMEI7WUFDaEYsZ0JBQWdCLHlCQUF5QjtXQUMxQyxVQUFVLHNDQUFzQztRQUNuRCxTQUFTLFlBQVk7O1lBRjdCLFNBQVMsd0JBQXdCLFlBQVc7Z0JBQ3hDLElBQUksTUFBTSxhQUFhLE9BQU8sV0FBVyxVQUFVLFVBQVU7O2dCQUU3RCxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxlQUFlLFlBQVksSUFBSSxlQUFlLHFCQUFxQjtvQkFDMUYsY0FBYztvQkFDZCxXQUFXLEdBQUc7b0JBQ2QsUUFBUSxXQUFXO29CQUNuQixjQUFjO29CQUNkLFdBQVcsb0JBQW9CO29CQUMvQixVQUFVLGtCQUFrQjtvQkFDNUIsWUFBWTs7b0JBRVosTUFBTSxhQUFhLGtCQUFrQixJQUFJLFlBQVksU0FBUzs7O2dCQUdsRSxTQUFTLG1CQUFtQjs7b0JBRXhCLE9BQU8sWUFBWSw0QkFBNEI7d0JBQzNDLFFBQVE7d0JBQ1IsYUFBYTs7O29CQUdqQixNQUFNOzs7Z0JBR1YsR0FBRyxpREFBaUQsWUFBVztvQkFDM0Q7b0JBQ0EsT0FBTyxZQUFZLGdCQUFnQixxQkFBcUI7Ozs7O0dBUzdEIiwiZmlsZSI6ImNvbW1vbi9mb3JtL0Zvcm1QcmV2aWV3RGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGZvcm1BcHBNb2R1bGUgZnJvbSAnY29tbW9uL2Zvcm0vRm9ybUFwcE1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvY29tbW9uL2Zvcm0vRm9ybVByZXZpZXdUZXN0RGF0YSc7XG5cbmRlc2NyaWJlKCdGb3JtUHJldmlld0RpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdHJsLCBmb3JtU2VydmljZSwgc2NvcGUsIHRlc3RWYWx1ZSwgZm9ybUpzb24sIGRlZmVycmVkLCAkY29udHJvbGxlcjtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZvcm1BcHBNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kY29udHJvbGxlcl8sICRyb290U2NvcGUsICRxLCBfZm9ybVNlcnZpY2VfLCBmb3JtUHJldmlld1Rlc3REYXRhKSB7XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICBmb3JtU2VydmljZSA9IF9mb3JtU2VydmljZV87XG4gICAgICAgIGZvcm1Kc29uID0gZm9ybVByZXZpZXdUZXN0RGF0YS5QUkVWSUVXX0ZPUk1fSlNPTjtcbiAgICAgICAgU2FpbFBvaW50LnByZXZpZXdGb3JtSlNPTiA9IGZvcm1Kc29uO1xuICAgICAgICB0ZXN0VmFsdWUgPSB7fTtcblxuICAgICAgICBzcHlPbihmb3JtU2VydmljZSwgJ2dldFByZXZpZXdGb3JtJykuYW5kLnJldHVyblZhbHVlKGRlZmVycmVkLnByb21pc2UpO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoKSB7XG5cbiAgICAgICAgY3RybCA9ICRjb250cm9sbGVyKCdGb3JtUHJldmlld0RpcmVjdGl2ZUN0cmwnLCB7XG4gICAgICAgICAgICAkc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgZm9ybVNlcnZpY2U6IGZvcm1TZXJ2aWNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgY2FsbCBmb3JtIHNlcnZpY2Ugd2l0aCBpbnB1dCBmb3JtIGpzb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICBleHBlY3QoZm9ybVNlcnZpY2UuZ2V0UHJldmlld0Zvcm0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZvcm1Kc29uKTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
