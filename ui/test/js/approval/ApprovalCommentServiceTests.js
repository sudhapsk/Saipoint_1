System.register(['test/js/TestInitializer', 'approval/ApprovalModule', 'test/js/TestModule'], function (_export) {
    'use strict';

    var approvalModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('ApprovalCommentService', function () {

                var spModal, commentService, scope, title, approval, $rootScope;

                // Let the tests know we'll use the approval module.
                beforeEach(module(approvalModule));

                // Using the test Service
                beforeEach(module(testModule));

                /**
                 * Setup the mocks for our tests.
                 */
                beforeEach(inject(function (_$rootScope_, _spModal_, _approvalCommentService_, testService) {

                    // Save the services.
                    $rootScope = _$rootScope_;
                    scope = $rootScope.$new();
                    spModal = _spModal_;
                    commentService = _approvalCommentService_;

                    title = 'this is a comment dialog';
                    approval = {
                        id: '1234',
                        commentCount: 1
                    };
                    spModal.open = jasmine.createSpy().and.callFake(function () {
                        // Open returns an object with a promise for the result property.
                        return {
                            result: testService.createResponsePromise(false)
                        };
                    });
                }));

                /**
                 * Verify that the comment dialog was opened with the appropriate settings.
                 */
                var checkCommentDialog = function () {
                    var templateUrl, args;

                    expect(spModal.open).toHaveBeenCalled();

                    args = spModal.open.calls.mostRecent().args[0];

                    scope.addComment = jasmine.createSpy();

                    templateUrl = 'approval/template/comment-dialog.html';

                    expect(args.templateUrl).toEqual(templateUrl);
                    expect(args.controller).toEqual('ApprovalCommentDialogCtrl');
                    expect(args.backdrop).toEqual('static');
                    expect(args.keyboard).toEqual(false);
                };

                it('opens the completion dialog', function () {
                    commentService.openCommentDialog(scope, title, approval);
                    checkCommentDialog();
                });

                it('increments commentCount when completion succeeds', function () {
                    commentService.openCommentDialog(scope, title, approval);
                    $rootScope.$apply();
                    expect(approval.commentCount).toEqual(2);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0FwcHJvdmFsQ29tbWVudFNlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHVCQUF1QixVQUFVLFNBQVM7SUFDN0c7O0lBRUEsSUFBSSxnQkFBZ0I7SUFDcEIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGlCQUFpQix3QkFBd0I7V0FDMUMsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFON0IsU0FBUywwQkFBMEIsWUFBVzs7Z0JBRTFDLElBQUksU0FBUyxnQkFBZ0IsT0FBTyxPQUFPLFVBQVU7OztnQkFHckQsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTzs7Ozs7Z0JBS2xCLFdBQVcsT0FBTyxVQUFTLGNBQWMsV0FBVywwQkFBMEIsYUFBYTs7O29CQUd2RixhQUFhO29CQUNiLFFBQVEsV0FBVztvQkFDbkIsVUFBVTtvQkFDVixpQkFBaUI7O29CQUVqQixRQUFRO29CQUNSLFdBQVc7d0JBQ1AsSUFBSTt3QkFDSixjQUFjOztvQkFFbEIsUUFBUSxPQUFPLFFBQVEsWUFBWSxJQUFJLFNBQVMsWUFBVzs7d0JBRXZELE9BQU87NEJBQ0gsUUFBUSxZQUFZLHNCQUFzQjs7Ozs7Ozs7Z0JBUXRELElBQUkscUJBQXFCLFlBQVc7b0JBQ2hDLElBQUksYUFBYTs7b0JBRWpCLE9BQU8sUUFBUSxNQUFNOztvQkFFckIsT0FBTyxRQUFRLEtBQUssTUFBTSxhQUFhLEtBQUs7O29CQUU1QyxNQUFNLGFBQWEsUUFBUTs7b0JBRTNCLGNBQWM7O29CQUVkLE9BQU8sS0FBSyxhQUFhLFFBQVE7b0JBQ2pDLE9BQU8sS0FBSyxZQUFZLFFBQVE7b0JBQ2hDLE9BQU8sS0FBSyxVQUFVLFFBQVE7b0JBQzlCLE9BQU8sS0FBSyxVQUFVLFFBQVE7OztnQkFHbEMsR0FBRywrQkFBK0IsWUFBVztvQkFDekMsZUFBZSxrQkFBa0IsT0FBTyxPQUFPO29CQUMvQzs7O2dCQUdKLEdBQUcsb0RBQW9ELFlBQVc7b0JBQzlELGVBQWUsa0JBQWtCLE9BQU8sT0FBTztvQkFDL0MsV0FBVztvQkFDWCxPQUFPLFNBQVMsY0FBYyxRQUFROzs7OztHQWEzQyIsImZpbGUiOiJhcHByb3ZhbC9BcHByb3ZhbENvbW1lbnRTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IGFwcHJvdmFsTW9kdWxlIGZyb20gJ2FwcHJvdmFsL0FwcHJvdmFsTW9kdWxlJztcclxuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdBcHByb3ZhbENvbW1lbnRTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIHNwTW9kYWwsIGNvbW1lbnRTZXJ2aWNlLCBzY29wZSwgdGl0bGUsIGFwcHJvdmFsLCAkcm9vdFNjb3BlO1xyXG5cclxuICAgIC8vIExldCB0aGUgdGVzdHMga25vdyB3ZSdsbCB1c2UgdGhlIGFwcHJvdmFsIG1vZHVsZS5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGFwcHJvdmFsTW9kdWxlKSk7XHJcblxyXG4gICAgLy8gVXNpbmcgdGhlIHRlc3QgU2VydmljZVxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUodGVzdE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgdGhlIG1vY2tzIGZvciBvdXIgdGVzdHMuXHJcbiAgICAgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgX3NwTW9kYWxfLCBfYXBwcm92YWxDb21tZW50U2VydmljZV8sIHRlc3RTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIC8vIFNhdmUgdGhlIHNlcnZpY2VzLlxyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcbiAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xyXG4gICAgICAgIGNvbW1lbnRTZXJ2aWNlID0gX2FwcHJvdmFsQ29tbWVudFNlcnZpY2VfO1xyXG5cclxuICAgICAgICB0aXRsZSA9ICd0aGlzIGlzIGEgY29tbWVudCBkaWFsb2cnO1xyXG4gICAgICAgIGFwcHJvdmFsID0ge1xyXG4gICAgICAgICAgICBpZDogJzEyMzQnLFxyXG4gICAgICAgICAgICBjb21tZW50Q291bnQ6IDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNwTW9kYWwub3BlbiA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBPcGVuIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBwcm9taXNlIGZvciB0aGUgcmVzdWx0IHByb3BlcnR5LlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiB0ZXN0U2VydmljZS5jcmVhdGVSZXNwb25zZVByb21pc2UoZmFsc2UpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWZXJpZnkgdGhhdCB0aGUgY29tbWVudCBkaWFsb2cgd2FzIG9wZW5lZCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBzZXR0aW5ncy5cclxuICAgICAqL1xyXG4gICAgdmFyIGNoZWNrQ29tbWVudERpYWxvZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ZW1wbGF0ZVVybCwgYXJncztcclxuXHJcbiAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICBhcmdzID0gc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdO1xyXG5cclxuICAgICAgICBzY29wZS5hZGRDb21tZW50ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuXHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnYXBwcm92YWwvdGVtcGxhdGUvY29tbWVudC1kaWFsb2cuaHRtbCc7XHJcblxyXG4gICAgICAgIGV4cGVjdChhcmdzLnRlbXBsYXRlVXJsKS50b0VxdWFsKHRlbXBsYXRlVXJsKTtcclxuICAgICAgICBleHBlY3QoYXJncy5jb250cm9sbGVyKS50b0VxdWFsKCdBcHByb3ZhbENvbW1lbnREaWFsb2dDdHJsJyk7XHJcbiAgICAgICAgZXhwZWN0KGFyZ3MuYmFja2Ryb3ApLnRvRXF1YWwoJ3N0YXRpYycpO1xyXG4gICAgICAgIGV4cGVjdChhcmdzLmtleWJvYXJkKS50b0VxdWFsKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgaXQoJ29wZW5zIHRoZSBjb21wbGV0aW9uIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKHNjb3BlLCB0aXRsZSwgYXBwcm92YWwpO1xyXG4gICAgICAgIGNoZWNrQ29tbWVudERpYWxvZygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2luY3JlbWVudHMgY29tbWVudENvdW50IHdoZW4gY29tcGxldGlvbiBzdWNjZWVkcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKHNjb3BlLCB0aXRsZSwgYXBwcm92YWwpO1xyXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGFwcHJvdmFsLmNvbW1lbnRDb3VudCkudG9FcXVhbCgyKTtcclxuICAgIH0pO1xyXG5cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
