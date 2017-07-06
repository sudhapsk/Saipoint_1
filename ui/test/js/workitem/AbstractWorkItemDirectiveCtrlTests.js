System.register(['test/js/TestInitializer', 'workitem/WorkItemModule', 'workitem/WorkItemAbstractModule', 'test/js/workitem/WorkItemTestData', 'test/js/workitem/AbstractWorkItemDirectiveTestCtrl'], function (_export) {
    /* (c) Copyright 2015 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var workItemModule, workItemAbstractModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_workitemWorkItemModule) {
            workItemModule = _workitemWorkItemModule['default'];
        }, function (_workitemWorkItemAbstractModule) {
            workItemAbstractModule = _workitemWorkItemAbstractModule['default'];
        }, function (_testJsWorkitemWorkItemTestData) {}, function (_testJsWorkitemAbstractWorkItemDirectiveTestCtrl) {}],
        execute: function () {

            describe('AbstractWorkItemDirectiveCtrl', function () {

                var $controller, ctrl, navigationService, WorkItemHeaderDirectiveStates, workItemTestData;

                beforeEach(module(workItemModule, workItemAbstractModule));

                beforeEach(inject(function (_$controller_, _navigationService_, _WorkItemHeaderDirectiveStates_, _workItemTestData_) {
                    $controller = _$controller_;
                    navigationService = _navigationService_;
                    WorkItemHeaderDirectiveStates = _WorkItemHeaderDirectiveStates_;
                    workItemTestData = _workItemTestData_;
                }));

                function createController(style) {
                    ctrl = $controller('AbstractWorkItemDirectiveTestCtrl', {
                        navigationService: navigationService
                    }, {
                        templateStyle: style,
                        workItem: workItemTestData.workItemTestData1
                    });
                }

                it('should throw if templateStyle does not match with allowed values', function () {
                    expect(function () {
                        createController(WorkItemHeaderDirectiveStates.full);
                    }).not.toThrow();
                    expect(function () {
                        createController('foo');
                    }).toThrow();
                });

                describe('isFull', function () {
                    it('should return true when style is full', function () {
                        createController(WorkItemHeaderDirectiveStates.full);
                        expect(ctrl.isFull()).toBeTruthy();
                    });
                    it('should return false when style is not full', function () {
                        createController(WorkItemHeaderDirectiveStates.summary);
                        expect(ctrl.isFull()).toBeFalsy();
                    });
                });

                describe('isSummary', function () {
                    it('should return true when style is summary', function () {
                        createController(WorkItemHeaderDirectiveStates.summary);
                        expect(ctrl.isSummary()).toBeTruthy();
                    });
                    it('should return false when style is not summary', function () {
                        createController(WorkItemHeaderDirectiveStates.full);
                        expect(ctrl.isSummary()).toBeFalsy();
                    });
                });

                describe('isCollapsible', function () {
                    it('should return true when style is collapsible', function () {
                        createController(WorkItemHeaderDirectiveStates.collapsible);
                        expect(ctrl.isCollapsible()).toBeTruthy();
                    });
                    it('should return false when style is not collapsible', function () {
                        createController(WorkItemHeaderDirectiveStates.summary);
                        expect(ctrl.isCollapsible()).toBeFalsy();
                    });
                });

                describe('getTemplateStyle', function () {
                    it('should return full when style is full', function () {
                        createController(WorkItemHeaderDirectiveStates.full);
                        expect(ctrl.getTemplateStyle()).toBe(WorkItemHeaderDirectiveStates.full);
                    });
                    it('should return summary when style is summary', function () {
                        createController(WorkItemHeaderDirectiveStates.summary);
                        expect(ctrl.getTemplateStyle()).toBe(WorkItemHeaderDirectiveStates.summary);
                    });
                    it('should return collapsible when style is collapsible', function () {
                        createController(WorkItemHeaderDirectiveStates.collapsible);
                        expect(ctrl.getTemplateStyle()).toBe(WorkItemHeaderDirectiveStates.collapsible);
                    });
                });

                describe('toggleCollapsed', function () {
                    it('should toggle the value of collapsed for collapsible', function () {
                        createController(WorkItemHeaderDirectiveStates.collapsible);
                        // Collapse state starts out true for type collapsible.
                        expect(ctrl.isCollapsed).toBeTruthy();
                        ctrl.toggleCollapsed();
                        expect(ctrl.isCollapsed).toBeFalsy();
                        ctrl.toggleCollapsed();
                        expect(ctrl.isCollapsed).toBeTruthy();
                    });
                });

                describe('initialize collapsed', function () {
                    it('should initialize collapsed for collapsible', function () {
                        createController(WorkItemHeaderDirectiveStates.collapsible);
                        // Collapse state starts out true for type collapsible.
                        expect(ctrl.isCollapsed).toBeTruthy();
                    });
                    it('should initialize collapsed for summary', function () {
                        createController(WorkItemHeaderDirectiveStates.summary);
                        // Collapse state starts out true for type summary.
                        expect(ctrl.isCollapsed).toBeTruthy();
                    });
                    it('should initialize collapsed for full', function () {
                        createController(WorkItemHeaderDirectiveStates.full);
                        // Collapse state starts out false for type full.
                        expect(ctrl.isCollapsed).toBeFalsy();
                    });
                });
                describe('goToFull', function () {

                    it('calls navigation service with correct parameters', function () {
                        createController(WorkItemHeaderDirectiveStates.summary);
                        spyOn(navigationService, 'go');

                        ctrl.goToFull();

                        expect(navigationService.go).toHaveBeenCalled();

                        expect(navigationService.go.calls.mostRecent().args[0].state).toEqual('commonWorkItem');
                        expect(navigationService.go.calls.mostRecent().args[0].stateParams.workItemId).toEqual(workItemTestData.workItemTestData1.id);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtpdGVtL0Fic3RyYWN0V29ya0l0ZW1EaXJlY3RpdmVDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixtQ0FBbUMscUNBQXFDLHVEQUF1RCxVQUFVLFNBQVM7O0lBQ3pOOztJQUdJLElBQUksZ0JBQWdCO0lBQ3BCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCO1dBQzFDLFVBQVUsaUNBQWlDO1lBQzFDLHlCQUF5QixnQ0FBZ0M7V0FDMUQsVUFBVSxpQ0FBaUMsSUFBSSxVQUFVLGtEQUFrRDtRQUM5RyxTQUFTLFlBQVk7O1lBRjdCLFNBQVMsaUNBQWlDLFlBQVc7O2dCQUVqRCxJQUFJLGFBQWEsTUFBTSxtQkFBbUIsK0JBQStCOztnQkFFekUsV0FBVyxPQUFPLGdCQUFnQjs7Z0JBRWxDLFdBQVcsT0FBTyxVQUFTLGVBQWUscUJBQW9CLGlDQUNuQyxvQkFBb0I7b0JBQzNDLGNBQWM7b0JBQ2Qsb0JBQW9CO29CQUNwQixnQ0FBZ0M7b0JBQ2hDLG1CQUFtQjs7O2dCQUd2QixTQUFTLGlCQUFpQixPQUFPO29CQUM3QixPQUFPLFlBQVkscUNBQXFDO3dCQUNwRCxtQkFBb0I7dUJBQ3JCO3dCQUNDLGVBQWU7d0JBQ2YsVUFBVSxpQkFBaUI7Ozs7Z0JBSW5DLEdBQUcsb0VBQW9FLFlBQVc7b0JBQzlFLE9BQU8sWUFBVzt3QkFDZCxpQkFBaUIsOEJBQThCO3VCQUNoRCxJQUFJO29CQUNQLE9BQU8sWUFBVzt3QkFDZCxpQkFBaUI7dUJBQ2xCOzs7Z0JBR1AsU0FBUyxVQUFVLFlBQVc7b0JBQzFCLEdBQUcseUNBQXlDLFlBQVc7d0JBQ25ELGlCQUFpQiw4QkFBOEI7d0JBQy9DLE9BQU8sS0FBSyxVQUFVOztvQkFFMUIsR0FBRyw4Q0FBOEMsWUFBVzt3QkFDeEQsaUJBQWlCLDhCQUE4Qjt3QkFDL0MsT0FBTyxLQUFLLFVBQVU7Ozs7Z0JBSTlCLFNBQVMsYUFBYSxZQUFXO29CQUM3QixHQUFHLDRDQUE0QyxZQUFXO3dCQUN0RCxpQkFBaUIsOEJBQThCO3dCQUMvQyxPQUFPLEtBQUssYUFBYTs7b0JBRTdCLEdBQUcsaURBQWlELFlBQVc7d0JBQzNELGlCQUFpQiw4QkFBOEI7d0JBQy9DLE9BQU8sS0FBSyxhQUFhOzs7O2dCQUlqQyxTQUFTLGlCQUFpQixZQUFXO29CQUNqQyxHQUFHLGdEQUFnRCxZQUFXO3dCQUMxRCxpQkFBaUIsOEJBQThCO3dCQUMvQyxPQUFPLEtBQUssaUJBQWlCOztvQkFFakMsR0FBRyxxREFBcUQsWUFBVzt3QkFDL0QsaUJBQWlCLDhCQUE4Qjt3QkFDL0MsT0FBTyxLQUFLLGlCQUFpQjs7OztnQkFJckMsU0FBUyxvQkFBb0IsWUFBVztvQkFDcEMsR0FBRyx5Q0FBeUMsWUFBVzt3QkFDbkQsaUJBQWlCLDhCQUE4Qjt3QkFDL0MsT0FBTyxLQUFLLG9CQUFvQixLQUFLLDhCQUE4Qjs7b0JBRXZFLEdBQUcsK0NBQStDLFlBQVc7d0JBQ3pELGlCQUFpQiw4QkFBOEI7d0JBQy9DLE9BQU8sS0FBSyxvQkFBb0IsS0FBSyw4QkFBOEI7O29CQUV2RSxHQUFHLHVEQUF1RCxZQUFXO3dCQUNqRSxpQkFBaUIsOEJBQThCO3dCQUMvQyxPQUFPLEtBQUssb0JBQW9CLEtBQUssOEJBQThCOzs7O2dCQUkzRSxTQUFTLG1CQUFtQixZQUFXO29CQUNuQyxHQUFHLHdEQUF3RCxZQUFXO3dCQUNsRSxpQkFBaUIsOEJBQThCOzt3QkFFL0MsT0FBTyxLQUFLLGFBQWE7d0JBQ3pCLEtBQUs7d0JBQ0wsT0FBTyxLQUFLLGFBQWE7d0JBQ3pCLEtBQUs7d0JBQ0wsT0FBTyxLQUFLLGFBQWE7Ozs7Z0JBSWpDLFNBQVMsd0JBQXdCLFlBQVc7b0JBQ3hDLEdBQUcsK0NBQStDLFlBQVc7d0JBQ3pELGlCQUFpQiw4QkFBOEI7O3dCQUUvQyxPQUFPLEtBQUssYUFBYTs7b0JBRTdCLEdBQUcsMkNBQTJDLFlBQVc7d0JBQ3JELGlCQUFpQiw4QkFBOEI7O3dCQUUvQyxPQUFPLEtBQUssYUFBYTs7b0JBRTdCLEdBQUcsd0NBQXdDLFlBQVc7d0JBQ2xELGlCQUFpQiw4QkFBOEI7O3dCQUUvQyxPQUFPLEtBQUssYUFBYTs7O2dCQUlqQyxTQUFTLFlBQVksWUFBVzs7b0JBRTVCLEdBQUcsb0RBQW9ELFlBQVc7d0JBQzlELGlCQUFpQiw4QkFBOEI7d0JBQy9DLE1BQU0sbUJBQW1COzt3QkFFekIsS0FBSzs7d0JBRUwsT0FBTyxrQkFBa0IsSUFBSTs7d0JBRTdCLE9BQU8sa0JBQWtCLEdBQUcsTUFBTSxhQUFhLEtBQUssR0FBRyxPQUNuRCxRQUFRO3dCQUNaLE9BQU8sa0JBQWtCLEdBQUcsTUFBTSxhQUFhLEtBQUssR0FBRyxZQUFZLFlBQy9ELFFBQVEsaUJBQWlCLGtCQUFrQjs7Ozs7O0dBTXhEIiwiZmlsZSI6IndvcmtpdGVtL0Fic3RyYWN0V29ya0l0ZW1EaXJlY3RpdmVDdHJsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTUgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgd29ya0l0ZW1Nb2R1bGUgZnJvbSAnd29ya2l0ZW0vV29ya0l0ZW1Nb2R1bGUnO1xuaW1wb3J0IHdvcmtJdGVtQWJzdHJhY3RNb2R1bGUgZnJvbSAnd29ya2l0ZW0vV29ya0l0ZW1BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvd29ya2l0ZW0vV29ya0l0ZW1UZXN0RGF0YSc7XG5pbXBvcnQgJ3Rlc3QvanMvd29ya2l0ZW0vQWJzdHJhY3RXb3JrSXRlbURpcmVjdGl2ZVRlc3RDdHJsJztcblxuZGVzY3JpYmUoJ0Fic3RyYWN0V29ya0l0ZW1EaXJlY3RpdmVDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgJGNvbnRyb2xsZXIsIGN0cmwsIG5hdmlnYXRpb25TZXJ2aWNlLCBXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcywgd29ya0l0ZW1UZXN0RGF0YTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdvcmtJdGVtTW9kdWxlLCB3b3JrSXRlbUFic3RyYWN0TW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbnRyb2xsZXJfLCBfbmF2aWdhdGlvblNlcnZpY2VfLF9Xb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlc18sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3dvcmtJdGVtVGVzdERhdGFfKSB7XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UgPSBfbmF2aWdhdGlvblNlcnZpY2VfO1xuICAgICAgICBXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcyA9IF9Xb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlc187XG4gICAgICAgIHdvcmtJdGVtVGVzdERhdGEgPSBfd29ya0l0ZW1UZXN0RGF0YV87XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihzdHlsZSkge1xuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0Fic3RyYWN0V29ya0l0ZW1EaXJlY3RpdmVUZXN0Q3RybCcsIHtcbiAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlIDogbmF2aWdhdGlvblNlcnZpY2VcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdGVtcGxhdGVTdHlsZTogc3R5bGUsXG4gICAgICAgICAgICB3b3JrSXRlbTogd29ya0l0ZW1UZXN0RGF0YS53b3JrSXRlbVRlc3REYXRhMVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGlmIHRlbXBsYXRlU3R5bGUgZG9lcyBub3QgbWF0Y2ggd2l0aCBhbGxvd2VkIHZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLmZ1bGwpO1xuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCdmb28nKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzRnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gc3R5bGUgaXMgZnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcihXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcy5mdWxsKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzRnVsbCgpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHN0eWxlIGlzIG5vdCBmdWxsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLnN1bW1hcnkpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNGdWxsKCkpLnRvQmVGYWxzeSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc1N1bW1hcnknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIHN0eWxlIGlzIHN1bW1hcnknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoV29ya0l0ZW1IZWFkZXJEaXJlY3RpdmVTdGF0ZXMuc3VtbWFyeSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc1N1bW1hcnkoKSkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBzdHlsZSBpcyBub3Qgc3VtbWFyeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcihXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcy5mdWxsKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzU3VtbWFyeSgpKS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNDb2xsYXBzaWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gc3R5bGUgaXMgY29sbGFwc2libGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoV29ya0l0ZW1IZWFkZXJEaXJlY3RpdmVTdGF0ZXMuY29sbGFwc2libGUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzaWJsZSgpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHN0eWxlIGlzIG5vdCBjb2xsYXBzaWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcihXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcy5zdW1tYXJ5KTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2libGUoKSkudG9CZUZhbHN5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFRlbXBsYXRlU3R5bGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZnVsbCB3aGVuIHN0eWxlIGlzIGZ1bGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoV29ya0l0ZW1IZWFkZXJEaXJlY3RpdmVTdGF0ZXMuZnVsbCk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5nZXRUZW1wbGF0ZVN0eWxlKCkpLnRvQmUoV29ya0l0ZW1IZWFkZXJEaXJlY3RpdmVTdGF0ZXMuZnVsbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBzdW1tYXJ5IHdoZW4gc3R5bGUgaXMgc3VtbWFyeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcihXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcy5zdW1tYXJ5KTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmdldFRlbXBsYXRlU3R5bGUoKSkudG9CZShXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcy5zdW1tYXJ5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvbGxhcHNpYmxlIHdoZW4gc3R5bGUgaXMgY29sbGFwc2libGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIoV29ya0l0ZW1IZWFkZXJEaXJlY3RpdmVTdGF0ZXMuY29sbGFwc2libGUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0VGVtcGxhdGVTdHlsZSgpKS50b0JlKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLmNvbGxhcHNpYmxlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndG9nZ2xlQ29sbGFwc2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgdG9nZ2xlIHRoZSB2YWx1ZSBvZiBjb2xsYXBzZWQgZm9yIGNvbGxhcHNpYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLmNvbGxhcHNpYmxlKTtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHN0YXRlIHN0YXJ0cyBvdXQgdHJ1ZSBmb3IgdHlwZSBjb2xsYXBzaWJsZS5cbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2VkKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgICAgICBjdHJsLnRvZ2dsZUNvbGxhcHNlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNDb2xsYXBzZWQpLnRvQmVGYWxzeSgpO1xuICAgICAgICAgICAgY3RybC50b2dnbGVDb2xsYXBzZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2VkKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2luaXRpYWxpemUgY29sbGFwc2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSBjb2xsYXBzZWQgZm9yIGNvbGxhcHNpYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLmNvbGxhcHNpYmxlKTtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHN0YXRlIHN0YXJ0cyBvdXQgdHJ1ZSBmb3IgdHlwZSBjb2xsYXBzaWJsZS5cbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2VkKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgY29sbGFwc2VkIGZvciBzdW1tYXJ5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLnN1bW1hcnkpO1xuICAgICAgICAgICAgLy8gQ29sbGFwc2Ugc3RhdGUgc3RhcnRzIG91dCB0cnVlIGZvciB0eXBlIHN1bW1hcnkuXG4gICAgICAgICAgICBleHBlY3QoY3RybC5pc0NvbGxhcHNlZCkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIGNvbGxhcHNlZCBmb3IgZnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3JlYXRlQ29udHJvbGxlcihXb3JrSXRlbUhlYWRlckRpcmVjdGl2ZVN0YXRlcy5mdWxsKTtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHN0YXRlIHN0YXJ0cyBvdXQgZmFsc2UgZm9yIHR5cGUgZnVsbC5cbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzQ29sbGFwc2VkKS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICBkZXNjcmliZSgnZ29Ub0Z1bGwnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnY2FsbHMgbmF2aWdhdGlvbiBzZXJ2aWNlIHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKFdvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzLnN1bW1hcnkpO1xuICAgICAgICAgICAgc3B5T24obmF2aWdhdGlvblNlcnZpY2UsICdnbycpO1xuXG4gICAgICAgICAgICBjdHJsLmdvVG9GdWxsKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChuYXZpZ2F0aW9uU2VydmljZS5nbykudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gICAgICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2UuZ28uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uc3RhdGUpLlxuICAgICAgICAgICAgICAgIHRvRXF1YWwoJ2NvbW1vbldvcmtJdGVtJyk7XG4gICAgICAgICAgICBleHBlY3QobmF2aWdhdGlvblNlcnZpY2UuZ28uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uc3RhdGVQYXJhbXMud29ya0l0ZW1JZCkuXG4gICAgICAgICAgICAgICAgdG9FcXVhbCh3b3JrSXRlbVRlc3REYXRhLndvcmtJdGVtVGVzdERhdGExLmlkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
