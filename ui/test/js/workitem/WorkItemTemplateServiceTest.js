System.register(['test/js/TestInitializer', 'workitem/WorkItemModule', 'test/js/workitem/WorkItemTestData'], function (_export) {
    /* (c) Copyright 2014 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var workItemModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_workitemWorkItemModule) {
            workItemModule = _workitemWorkItemModule['default'];
        }, function (_testJsWorkitemWorkItemTestData) {}],
        execute: function () {

            /**
             * Tests for the WorkItemTemplateService.
             */
            describe('WorkItemTemplateService', function () {

                var WorkItem, ViolationReviewWorkItem, WorkItemTemplateService, $rootScope, workItemTestData;

                beforeEach(module(workItemModule));

                beforeEach(inject(function (_workItemTemplateService_, _WorkItem_, _ViolationReviewWorkItem_, _$rootScope_, _workItemTestData_) {
                    WorkItemTemplateService = _workItemTemplateService_;
                    WorkItem = _WorkItem_;
                    ViolationReviewWorkItem = _ViolationReviewWorkItem_;
                    $rootScope = _$rootScope_;
                    workItemTestData = _workItemTestData_;
                }));

                function testTemplate(workItem, expectedTemplate) {
                    var template;
                    spyOn(WorkItemTemplateService, 'getTemplate').and.callThrough();
                    template = WorkItemTemplateService.getTemplate(workItem);
                    expect(WorkItemTemplateService.getTemplate).toHaveBeenCalledWith(workItem);
                    expect(template).toEqual(expectedTemplate);
                }

                it('get form work item template', function () {
                    var template = '<div class="form-work-item-container">' + '  <div class="form-work-item-row">' + '    <sp-work-item-form sp-work-item="workItem"' + '                       sp-template-style="{{templateStyle}}"' + '                       sp-completion-callback="completionCallback" />' + '  </div>' + '</div>';
                    testTemplate(new WorkItem(workItemTestData.workItemTestData4), template);
                });

                it('get violation review work item template', function () {
                    var template = '<sp-violation-review-work-item sp-workitem="workItem" ' + 'sp-completion-callback="completionCallback" ' + 'sp-template-style="{{templateStyle}}" />';
                    testTemplate(new ViolationReviewWorkItem(workItemTestData.workItemTestData1), template);
                });

                it('get approval work item template', function () {
                    var template = '<sp-approval sp-approval="workItem" ' + 'sp-completion-callback="completionCallback" ' + 'sp-template-style="{{templateStyle}}" ' + 'sp-index="index" />';
                    testTemplate(new WorkItem(workItemTestData.workItemTestData2), template);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtpdGVtL1dvcmtJdGVtVGVtcGxhdGVTZXJ2aWNlVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7O0lBQ2hJOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLGlDQUFpQztRQUM5QyxTQUFTLFlBQVk7Ozs7O1lBQzdCLFNBQVMsMkJBQTJCLFlBQVc7O2dCQUUzQyxJQUFJLFVBQVUseUJBQXlCLHlCQUF5QixZQUFZOztnQkFFNUUsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsMkJBQTJCLFlBQVksMkJBQ3ZDLGNBQWMsb0JBQW9CO29CQUN6RCwwQkFBMEI7b0JBQzFCLFdBQVc7b0JBQ1gsMEJBQTBCO29CQUMxQixhQUFhO29CQUNiLG1CQUFtQjs7O2dCQUd2QixTQUFTLGFBQWEsVUFBVSxrQkFBa0I7b0JBQzlDLElBQUk7b0JBQ0osTUFBTSx5QkFBeUIsZUFBZSxJQUFJO29CQUNsRCxXQUFXLHdCQUF3QixZQUFZO29CQUMvQyxPQUFPLHdCQUF3QixhQUFhLHFCQUFxQjtvQkFDakUsT0FBTyxVQUFVLFFBQVE7OztnQkFHN0IsR0FBRywrQkFBK0IsWUFBVztvQkFDekMsSUFBSSxXQUFXLDJDQUNBLHVDQUNBLG1EQUNBLGlFQUNBLDBFQUNBLGFBQ0E7b0JBQ2YsYUFBYSxJQUFJLFNBQVMsaUJBQWlCLG9CQUFvQjs7O2dCQUduRSxHQUFHLDJDQUEyQyxZQUFXO29CQUNyRCxJQUFJLFdBQVcsMkRBQ1gsaURBQ0E7b0JBQ0osYUFBYSxJQUFJLHdCQUF3QixpQkFBaUIsb0JBQW9COzs7Z0JBR2xGLEdBQUcsbUNBQW1DLFlBQVc7b0JBQzdDLElBQUksV0FBVyx5Q0FDWCxpREFDQSwyQ0FDQTtvQkFDSixhQUFhLElBQUksU0FBUyxpQkFBaUIsb0JBQW9COzs7OztHQUhwRSIsImZpbGUiOiJ3b3JraXRlbS9Xb3JrSXRlbVRlbXBsYXRlU2VydmljZVRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTQgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgd29ya0l0ZW1Nb2R1bGUgZnJvbSAnd29ya2l0ZW0vV29ya0l0ZW1Nb2R1bGUnO1xuaW1wb3J0ICd0ZXN0L2pzL3dvcmtpdGVtL1dvcmtJdGVtVGVzdERhdGEnO1xuXG4vKipcbiAqIFRlc3RzIGZvciB0aGUgV29ya0l0ZW1UZW1wbGF0ZVNlcnZpY2UuXG4gKi9cbmRlc2NyaWJlKCdXb3JrSXRlbVRlbXBsYXRlU2VydmljZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIFdvcmtJdGVtLCBWaW9sYXRpb25SZXZpZXdXb3JrSXRlbSwgV29ya0l0ZW1UZW1wbGF0ZVNlcnZpY2UsICRyb290U2NvcGUsIHdvcmtJdGVtVGVzdERhdGE7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh3b3JrSXRlbU1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3dvcmtJdGVtVGVtcGxhdGVTZXJ2aWNlXywgX1dvcmtJdGVtXywgX1Zpb2xhdGlvblJldmlld1dvcmtJdGVtXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfJHJvb3RTY29wZV8sIF93b3JrSXRlbVRlc3REYXRhXykge1xuICAgICAgICBXb3JrSXRlbVRlbXBsYXRlU2VydmljZSA9IF93b3JrSXRlbVRlbXBsYXRlU2VydmljZV87XG4gICAgICAgIFdvcmtJdGVtID0gX1dvcmtJdGVtXztcbiAgICAgICAgVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW0gPSBfVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1fO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICB3b3JrSXRlbVRlc3REYXRhID0gX3dvcmtJdGVtVGVzdERhdGFfO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIHRlc3RUZW1wbGF0ZSh3b3JrSXRlbSwgZXhwZWN0ZWRUZW1wbGF0ZSkge1xuICAgICAgICB2YXIgdGVtcGxhdGU7XG4gICAgICAgIHNweU9uKFdvcmtJdGVtVGVtcGxhdGVTZXJ2aWNlLCAnZ2V0VGVtcGxhdGUnKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgdGVtcGxhdGUgPSBXb3JrSXRlbVRlbXBsYXRlU2VydmljZS5nZXRUZW1wbGF0ZSh3b3JrSXRlbSk7XG4gICAgICAgIGV4cGVjdChXb3JrSXRlbVRlbXBsYXRlU2VydmljZS5nZXRUZW1wbGF0ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgod29ya0l0ZW0pO1xuICAgICAgICBleHBlY3QodGVtcGxhdGUpLnRvRXF1YWwoZXhwZWN0ZWRUZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaXQoJ2dldCBmb3JtIHdvcmsgaXRlbSB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cImZvcm0td29yay1pdGVtLWNvbnRhaW5lclwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAnICA8ZGl2IGNsYXNzPVwiZm9ybS13b3JrLWl0ZW0tcm93XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICcgICAgPHNwLXdvcmstaXRlbS1mb3JtIHNwLXdvcmstaXRlbT1cIndvcmtJdGVtXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgJyAgICAgICAgICAgICAgICAgICAgICAgc3AtdGVtcGxhdGUtc3R5bGU9XCJ7e3RlbXBsYXRlU3R5bGV9fVwiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICcgICAgICAgICAgICAgICAgICAgICAgIHNwLWNvbXBsZXRpb24tY2FsbGJhY2s9XCJjb21wbGV0aW9uQ2FsbGJhY2tcIiAvPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAnICA8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgIHRlc3RUZW1wbGF0ZShuZXcgV29ya0l0ZW0od29ya0l0ZW1UZXN0RGF0YS53b3JrSXRlbVRlc3REYXRhNCksIHRlbXBsYXRlKTtcbiAgICB9KTtcblxuICAgIGl0KCdnZXQgdmlvbGF0aW9uIHJldmlldyB3b3JrIGl0ZW0gdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gJzxzcC12aW9sYXRpb24tcmV2aWV3LXdvcmstaXRlbSBzcC13b3JraXRlbT1cIndvcmtJdGVtXCIgJyArXG4gICAgICAgICAgICAnc3AtY29tcGxldGlvbi1jYWxsYmFjaz1cImNvbXBsZXRpb25DYWxsYmFja1wiICcgK1xuICAgICAgICAgICAgJ3NwLXRlbXBsYXRlLXN0eWxlPVwie3t0ZW1wbGF0ZVN0eWxlfX1cIiAvPic7XG4gICAgICAgIHRlc3RUZW1wbGF0ZShuZXcgVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW0od29ya0l0ZW1UZXN0RGF0YS53b3JrSXRlbVRlc3REYXRhMSksIHRlbXBsYXRlKTtcbiAgICB9KTtcblxuICAgIGl0KCdnZXQgYXBwcm92YWwgd29yayBpdGVtIHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICc8c3AtYXBwcm92YWwgc3AtYXBwcm92YWw9XCJ3b3JrSXRlbVwiICcgK1xuICAgICAgICAgICAgJ3NwLWNvbXBsZXRpb24tY2FsbGJhY2s9XCJjb21wbGV0aW9uQ2FsbGJhY2tcIiAnICtcbiAgICAgICAgICAgICdzcC10ZW1wbGF0ZS1zdHlsZT1cInt7dGVtcGxhdGVTdHlsZX19XCIgJyArXG4gICAgICAgICAgICAnc3AtaW5kZXg9XCJpbmRleFwiIC8+JztcbiAgICAgICAgdGVzdFRlbXBsYXRlKG5ldyBXb3JrSXRlbSh3b3JrSXRlbVRlc3REYXRhLndvcmtJdGVtVGVzdERhdGEyKSwgdGVtcGxhdGUpO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
