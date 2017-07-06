System.register(['test/js/TestInitializer', 'home/widget/certifications/CertificationsWidgetModule', 'test/js/common/i18n/MockTranslateFilter', 'test/js/home/widget/certifications/TestCertificationsWidgetCtrl'], function (_export) {
    'use strict';

    var certWidgetModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_homeWidgetCertificationsCertificationsWidgetModule) {
            certWidgetModule = _homeWidgetCertificationsCertificationsWidgetModule['default'];
        }, function (_testJsCommonI18nMockTranslateFilter) {}, function (_testJsHomeWidgetCertificationsTestCertificationsWidgetCtrl) {}],
        execute: function () {

            describe('AbstractCertificationsWidgetCtrl', function () {
                var $controller,
                    $rootScope,
                    $scope,
                    CertificationWidgetData,
                    slides,
                    slideOne508Text = 'slide1 Due Today 0% ui_gauge_completed',
                    slideTwo508Text = 'slide2 Due Today 20% ui_gauge_completed';

                function getStartDate() {
                    var date = new Date();
                    date.setHours(0);
                    return date;
                }

                beforeEach(module(certWidgetModule));

                beforeEach(inject(function (_$controller_, _$rootScope_, spTranslateFilter, _CertificationWidgetData_) {
                    $controller = _$controller_;
                    $scope = _$rootScope_.$new();
                    $rootScope = _$rootScope_;
                    CertificationWidgetData = _CertificationWidgetData_;

                    spTranslateFilter.configureCatalog({
                        'ui_cert_widget_due_today': 'Due Today'
                    });

                    var start = getStartDate(),
                        testDate = new Date(start);
                    testDate.setHours(start.getHours() + 1);

                    slides = [new CertificationWidgetData({ name: 'slide1', completedItems: 0, totalItems: 10, dueDate: testDate.getTime() }), new CertificationWidgetData({ name: 'slide2', completedItems: 2, totalItems: 10, dueDate: testDate.getTime() }), new CertificationWidgetData({ name: 'slide3', completedItems: 3, totalItems: 10, dueDate: testDate.getTime() }), new CertificationWidgetData({ name: 'slide4', completedItems: 4, totalItems: 10, dueDate: testDate.getTime() }), new CertificationWidgetData({ name: 'slide5', completedItems: 5, totalItems: 10, dueDate: testDate.getTime() })];
                }));

                function createController() {
                    return $controller('TestCertificationWidgetCtrl', {
                        $scope: $scope
                    });
                }

                describe('$scope.$on(carousel:change)', function () {
                    it('should update carousel508Text with current slide data', function () {
                        var ctrl = createController();
                        ctrl.objects = slides;
                        $rootScope.$broadcast('carousel:change', 1);
                        $scope.$digest();
                        expect(ctrl.carousel508Text).toEqual(slideTwo508Text);

                        $rootScope.$broadcast('carousel:change', 0);
                        $scope.$digest();
                        expect(ctrl.carousel508Text).toEqual(slideOne508Text);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvd2lkZ2V0L2NlcnRpZmljYXRpb25zL0Fic3RyYWN0Q2VydGlmaWNhdGlvbnNXaWRnZXRDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHlEQUF5RCwyQ0FBMkMsb0VBQW9FLFVBQVUsU0FBUztJQUF2Tzs7SUFHSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUscURBQXFEO1lBQzNHLG1CQUFtQixvREFBb0Q7V0FDeEUsVUFBVSxzQ0FBc0MsSUFBSSxVQUFVLDZEQUE2RDtRQUM5SCxTQUFTLFlBQVk7O1lBRDdCLFNBQVMsb0NBQW9DLFlBQVc7Z0JBQ3BELElBQUk7b0JBQWE7b0JBQVk7b0JBQVE7b0JBQXlCO29CQUMxRCxrQkFBa0I7b0JBQ2xCLGtCQUFrQjs7Z0JBRXRCLFNBQVMsZUFBZTtvQkFDcEIsSUFBSSxPQUFPLElBQUk7b0JBQ2YsS0FBSyxTQUFTO29CQUNkLE9BQU87OztnQkFHWCxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxlQUFlLGNBQWMsbUJBQW1CLDJCQUEyQjtvQkFDbEcsY0FBYztvQkFDZCxTQUFTLGFBQWE7b0JBQ3RCLGFBQWE7b0JBQ2IsMEJBQTBCOztvQkFFMUIsa0JBQWtCLGlCQUFpQjt3QkFDL0IsNEJBQTRCOzs7b0JBR2hDLElBQUksUUFBUTt3QkFDUixXQUFXLElBQUksS0FBSztvQkFDeEIsU0FBUyxTQUFTLE1BQU0sYUFBYTs7b0JBRXJDLFNBQVMsQ0FDTCxJQUFJLHdCQUNBLEVBQUMsTUFBTSxVQUFVLGdCQUFnQixHQUFHLFlBQVksSUFBSSxTQUFTLFNBQVMsY0FDMUUsSUFBSSx3QkFDQSxFQUFDLE1BQU0sVUFBVSxnQkFBZ0IsR0FBRyxZQUFZLElBQUksU0FBUyxTQUFTLGNBQzFFLElBQUksd0JBQ0EsRUFBQyxNQUFNLFVBQVUsZ0JBQWdCLEdBQUcsWUFBWSxJQUFJLFNBQVMsU0FBUyxjQUMxRSxJQUFJLHdCQUNBLEVBQUMsTUFBTSxVQUFVLGdCQUFnQixHQUFHLFlBQVksSUFBSSxTQUFTLFNBQVMsY0FDMUUsSUFBSSx3QkFDQSxFQUFDLE1BQU0sVUFBVSxnQkFBZ0IsR0FBRyxZQUFZLElBQUksU0FBUyxTQUFTOzs7Z0JBSWxGLFNBQVMsbUJBQW1CO29CQUN4QixPQUFPLFlBQVksK0JBQStCO3dCQUM5QyxRQUFROzs7O2dCQUloQixTQUFTLCtCQUErQixZQUFXO29CQUMvQyxHQUFHLHlEQUF5RCxZQUFXO3dCQUNuRSxJQUFJLE9BQU87d0JBQ1gsS0FBSyxVQUFVO3dCQUNmLFdBQVcsV0FBVyxtQkFBbUI7d0JBQ3pDLE9BQU87d0JBQ1AsT0FBTyxLQUFLLGlCQUFpQixRQUFROzt3QkFFckMsV0FBVyxXQUFXLG1CQUFtQjt3QkFDekMsT0FBTzt3QkFDUCxPQUFPLEtBQUssaUJBQWlCLFFBQVE7Ozs7OztHQUU5QyIsImZpbGUiOiJob21lL3dpZGdldC9jZXJ0aWZpY2F0aW9ucy9BYnN0cmFjdENlcnRpZmljYXRpb25zV2lkZ2V0Q3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0V2lkZ2V0TW9kdWxlIGZyb20gJ2hvbWUvd2lkZ2V0L2NlcnRpZmljYXRpb25zL0NlcnRpZmljYXRpb25zV2lkZ2V0TW9kdWxlJztcbmltcG9ydCAndGVzdC9qcy9jb21tb24vaTE4bi9Nb2NrVHJhbnNsYXRlRmlsdGVyJztcbmltcG9ydCAndGVzdC9qcy9ob21lL3dpZGdldC9jZXJ0aWZpY2F0aW9ucy9UZXN0Q2VydGlmaWNhdGlvbnNXaWRnZXRDdHJsJztcblxuZGVzY3JpYmUoJ0Fic3RyYWN0Q2VydGlmaWNhdGlvbnNXaWRnZXRDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyICRjb250cm9sbGVyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIENlcnRpZmljYXRpb25XaWRnZXREYXRhLCBzbGlkZXMsXG4gICAgICAgIHNsaWRlT25lNTA4VGV4dCA9ICdzbGlkZTEgRHVlIFRvZGF5IDAlIHVpX2dhdWdlX2NvbXBsZXRlZCcsXG4gICAgICAgIHNsaWRlVHdvNTA4VGV4dCA9ICdzbGlkZTIgRHVlIFRvZGF5IDIwJSB1aV9nYXVnZV9jb21wbGV0ZWQnO1xuXG4gICAgZnVuY3Rpb24gZ2V0U3RhcnREYXRlKCkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGRhdGUuc2V0SG91cnMoMCk7XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRXaWRnZXRNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kY29udHJvbGxlcl8sIF8kcm9vdFNjb3BlXywgc3BUcmFuc2xhdGVGaWx0ZXIsIF9DZXJ0aWZpY2F0aW9uV2lkZ2V0RGF0YV8pIHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICAkc2NvcGUgPSBfJHJvb3RTY29wZV8uJG5ldygpO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICBDZXJ0aWZpY2F0aW9uV2lkZ2V0RGF0YSA9IF9DZXJ0aWZpY2F0aW9uV2lkZ2V0RGF0YV87XG5cbiAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXIuY29uZmlndXJlQ2F0YWxvZyh7XG4gICAgICAgICAgICAndWlfY2VydF93aWRnZXRfZHVlX3RvZGF5JzogJ0R1ZSBUb2RheSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHN0YXJ0ID0gZ2V0U3RhcnREYXRlKCksXG4gICAgICAgICAgICB0ZXN0RGF0ZSA9IG5ldyBEYXRlKHN0YXJ0KTtcbiAgICAgICAgdGVzdERhdGUuc2V0SG91cnMoc3RhcnQuZ2V0SG91cnMoKSArIDEpO1xuXG4gICAgICAgIHNsaWRlcyA9IFtcbiAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uV2lkZ2V0RGF0YShcbiAgICAgICAgICAgICAgICB7bmFtZTogJ3NsaWRlMScsIGNvbXBsZXRlZEl0ZW1zOiAwLCB0b3RhbEl0ZW1zOiAxMCwgZHVlRGF0ZTogdGVzdERhdGUuZ2V0VGltZSgpfSksXG4gICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbldpZGdldERhdGEoXG4gICAgICAgICAgICAgICAge25hbWU6ICdzbGlkZTInLCBjb21wbGV0ZWRJdGVtczogMiwgdG90YWxJdGVtczogMTAsIGR1ZURhdGU6IHRlc3REYXRlLmdldFRpbWUoKX0pLFxuICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25XaWRnZXREYXRhKFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnc2xpZGUzJywgY29tcGxldGVkSXRlbXM6IDMsIHRvdGFsSXRlbXM6IDEwLCBkdWVEYXRlOiB0ZXN0RGF0ZS5nZXRUaW1lKCl9KSxcbiAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uV2lkZ2V0RGF0YShcbiAgICAgICAgICAgICAgICB7bmFtZTogJ3NsaWRlNCcsIGNvbXBsZXRlZEl0ZW1zOiA0LCB0b3RhbEl0ZW1zOiAxMCwgZHVlRGF0ZTogdGVzdERhdGUuZ2V0VGltZSgpfSksXG4gICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbldpZGdldERhdGEoXG4gICAgICAgICAgICAgICAge25hbWU6ICdzbGlkZTUnLCBjb21wbGV0ZWRJdGVtczogNSwgdG90YWxJdGVtczogMTAsIGR1ZURhdGU6IHRlc3REYXRlLmdldFRpbWUoKX0pXG4gICAgICAgIF07XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcigpIHtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdUZXN0Q2VydGlmaWNhdGlvbldpZGdldEN0cmwnLCB7XG4gICAgICAgICAgICAkc2NvcGU6ICRzY29wZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnJHNjb3BlLiRvbihjYXJvdXNlbDpjaGFuZ2UpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgdXBkYXRlIGNhcm91c2VsNTA4VGV4dCB3aXRoIGN1cnJlbnQgc2xpZGUgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAgICBjdHJsLm9iamVjdHMgPSBzbGlkZXM7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Nhcm91c2VsOmNoYW5nZScsIDEpO1xuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmNhcm91c2VsNTA4VGV4dCkudG9FcXVhbChzbGlkZVR3bzUwOFRleHQpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Nhcm91c2VsOmNoYW5nZScsIDApO1xuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmNhcm91c2VsNTA4VGV4dCkudG9FcXVhbChzbGlkZU9uZTUwOFRleHQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
