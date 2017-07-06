System.register(['test/js/TestInitializer', 'approval/ApprovalModule'], function (_export) {

    /**
     * Tests for the ApprovalCommentDialogCtrl.
     */
    'use strict';

    var approvalModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }],
        execute: function () {
            describe('ApprovalCommentDialogCtrl', function () {
                var $controller, approvalService, scope, comments, http, approval, approvalItem, callback;

                beforeEach(module(approvalModule));

                /**
                 * Create mock objects for our tests.
                 */
                beforeEach(inject(function (_$controller_, $q, $rootScope, _approvalService_, $httpBackend) {
                    $controller = _$controller_;
                    scope = $rootScope.$new();
                    approvalService = _approvalService_;
                    http = $httpBackend;

                    // The controller will have the approval and item by default.  These can be
                    // removed by passing parameters to createController.
                    approval = { id: '1234' };
                    approvalItem = { id: '5678' };
                    callback = jasmine.createSpy();

                    comments = [{
                        'author': 'James Smith',
                        'comment': 'snake, report!',
                        'date': '452436536456'
                    }, {
                        'author': 'Snake',
                        'comment': 'augh, broke my knife',
                        'date': '452436536654'
                    }, {
                        'author': 'Random Guy',
                        'comment': 'olololololololololololololo',
                        'date': '452436536789'
                    }];

                    spyOn(approvalService, 'getComments').and.callThrough();
                    spyOn(approvalService, 'addComment').and.callThrough();
                    spyOn(approvalService, 'getItemComments').and.callThrough();
                    spyOn(approvalService, 'addItemComment').and.callThrough();
                }));

                /**
                 * test the controller when set to pull/add comments for an approval
                 */
                describe('test Approval', function () {
                    beforeEach(function () {
                        $controller('ApprovalCommentDialogCtrl', {
                            $scope: scope,
                            approvalService: approvalService,
                            approval: approval,
                            approvalItem: null,
                            errorCallback: callback
                        });
                        scope.newComment.text = 'new comment text';
                    });

                    it('loads comments', function () {
                        http.expectGET(SailPoint.CONTEXT_PATH + 'ui/rest/approvals/comments').respond(200, comments);
                        expect(approvalService.getComments).toHaveBeenCalled();
                    });

                    it('adds a comment', function () {
                        http.expectPOST(SailPoint.CONTEXT_PATH + 'ui/rest/approvals/comments').respond(200, '');
                        scope.addComment();
                        expect(approvalService.addComment).toHaveBeenCalledWith('1234', 'new comment text');
                    });
                });

                /**
                 * test the controller when set to pull/add comments for an approval item
                 */
                describe('test ApprovalItem', function () {

                    beforeEach(function () {
                        scope.isItem = true;
                        $controller('ApprovalCommentDialogCtrl', {
                            $scope: scope,
                            approvalService: approvalService,
                            approval: approval,
                            approvalItem: approvalItem,
                            errorCallback: callback
                        });
                        scope.newComment.text = 'new comment text';
                    });

                    it('loads item comments', function () {
                        http.expectGET(SailPoint.CONTEXT_PATH + 'ui/rest/approvals/comments').respond(200, comments);
                        expect(approvalService.getItemComments).toHaveBeenCalled();
                    });

                    it('adds an item comment', function () {
                        http.expectPOST(SailPoint.CONTEXT_PATH + 'ui/rest/approvals/comments').respond(200, '');
                        scope.addComment();
                        expect(approvalService.addItemComment).toHaveBeenCalledWith('1234', '5678', 'new comment text');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0FwcHJvdmFsQ29tbWVudERpYWxvZ0N0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsNEJBQTRCLFVBQVUsU0FBUzs7Ozs7SUFLdkY7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCOztRQUU3QyxTQUFTLFlBQVk7WUFON0IsU0FBUyw2QkFBNkIsWUFBVztnQkFDN0MsSUFBSSxhQUFhLGlCQUFpQixPQUFPLFVBQVUsTUFBTSxVQUFVLGNBQWM7O2dCQUVqRixXQUFXLE9BQU87Ozs7O2dCQUtsQixXQUFXLE9BQU8sVUFBUyxlQUFlLElBQUksWUFBWSxtQkFBbUIsY0FBYztvQkFDdkYsY0FBYztvQkFDZCxRQUFRLFdBQVc7b0JBQ25CLGtCQUFrQjtvQkFDbEIsT0FBTzs7OztvQkFJUCxXQUFXLEVBQUMsSUFBSTtvQkFDaEIsZUFBZSxFQUFDLElBQUk7b0JBQ3BCLFdBQVcsUUFBUTs7b0JBRW5CLFdBQVcsQ0FDSDt3QkFDSSxVQUFVO3dCQUNWLFdBQVc7d0JBQ1gsUUFBUTt1QkFFWjt3QkFDSSxVQUFVO3dCQUNWLFdBQVc7d0JBQ1gsUUFBUTt1QkFFWjt3QkFDSSxVQUFVO3dCQUNWLFdBQVc7d0JBQ1gsUUFBUTs7O29CQUlwQixNQUFNLGlCQUFpQixlQUFlLElBQUk7b0JBQzFDLE1BQU0saUJBQWlCLGNBQWMsSUFBSTtvQkFDekMsTUFBTSxpQkFBaUIsbUJBQW1CLElBQUk7b0JBQzlDLE1BQU0saUJBQWlCLGtCQUFrQixJQUFJOzs7Ozs7Z0JBTWpELFNBQVMsaUJBQWlCLFlBQVc7b0JBQ2pDLFdBQVcsWUFBVzt3QkFDbEIsWUFBWSw2QkFBNkI7NEJBQ3JDLFFBQVE7NEJBQ1IsaUJBQWlCOzRCQUNqQixVQUFVOzRCQUNWLGNBQWM7NEJBQ2QsZUFBZTs7d0JBRW5CLE1BQU0sV0FBVyxPQUFPOzs7b0JBRzVCLEdBQUcsa0JBQWtCLFlBQVc7d0JBQzVCLEtBQUssVUFBVSxVQUFVLGVBQWUsOEJBQ3hDLFFBQVEsS0FBSzt3QkFDYixPQUFPLGdCQUFnQixhQUFhOzs7b0JBR3hDLEdBQUcsa0JBQWtCLFlBQVc7d0JBQzVCLEtBQUssV0FBVyxVQUFVLGVBQWUsOEJBQ3pDLFFBQVEsS0FBSzt3QkFDYixNQUFNO3dCQUNOLE9BQU8sZ0JBQWdCLFlBQVkscUJBQXFCLFFBQVE7Ozs7Ozs7Z0JBT3hFLFNBQVMscUJBQXFCLFlBQVc7O29CQUVyQyxXQUFXLFlBQVc7d0JBQ2xCLE1BQU0sU0FBUzt3QkFDZixZQUFZLDZCQUE2Qjs0QkFDckMsUUFBUTs0QkFDUixpQkFBaUI7NEJBQ2pCLFVBQVU7NEJBQ1YsY0FBYzs0QkFDZCxlQUFlOzt3QkFFbkIsTUFBTSxXQUFXLE9BQU87OztvQkFHNUIsR0FBRyx1QkFBdUIsWUFBVzt3QkFDakMsS0FBSyxVQUFVLFVBQVUsZUFBZSw4QkFDeEMsUUFBUSxLQUFLO3dCQUNiLE9BQU8sZ0JBQWdCLGlCQUFpQjs7O29CQUc1QyxHQUFHLHdCQUF3QixZQUFXO3dCQUNsQyxLQUFLLFdBQVcsVUFBVSxlQUFlLDhCQUN6QyxRQUFRLEtBQUs7d0JBQ2IsTUFBTTt3QkFDTixPQUFPLGdCQUFnQixnQkFBZ0IscUJBQXFCLFFBQVEsUUFBUTs7Ozs7O0dBS3JGIiwiZmlsZSI6ImFwcHJvdmFsL0FwcHJvdmFsQ29tbWVudERpYWxvZ0N0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGFwcHJvdmFsTW9kdWxlIGZyb20gJ2FwcHJvdmFsL0FwcHJvdmFsTW9kdWxlJztcblxuLyoqXG4gKiBUZXN0cyBmb3IgdGhlIEFwcHJvdmFsQ29tbWVudERpYWxvZ0N0cmwuXG4gKi9cbmRlc2NyaWJlKCdBcHByb3ZhbENvbW1lbnREaWFsb2dDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyICRjb250cm9sbGVyLCBhcHByb3ZhbFNlcnZpY2UsIHNjb3BlLCBjb21tZW50cywgaHR0cCwgYXBwcm92YWwsIGFwcHJvdmFsSXRlbSwgY2FsbGJhY2s7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhcHByb3ZhbE1vZHVsZSkpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIG1vY2sgb2JqZWN0cyBmb3Igb3VyIHRlc3RzLlxuICAgICAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kY29udHJvbGxlcl8sICRxLCAkcm9vdFNjb3BlLCBfYXBwcm92YWxTZXJ2aWNlXywgJGh0dHBCYWNrZW5kKSB7XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgYXBwcm92YWxTZXJ2aWNlID0gX2FwcHJvdmFsU2VydmljZV87XG4gICAgICAgIGh0dHAgPSAkaHR0cEJhY2tlbmQ7XG5cbiAgICAgICAgLy8gVGhlIGNvbnRyb2xsZXIgd2lsbCBoYXZlIHRoZSBhcHByb3ZhbCBhbmQgaXRlbSBieSBkZWZhdWx0LiAgVGhlc2UgY2FuIGJlXG4gICAgICAgIC8vIHJlbW92ZWQgYnkgcGFzc2luZyBwYXJhbWV0ZXJzIHRvIGNyZWF0ZUNvbnRyb2xsZXIuXG4gICAgICAgIGFwcHJvdmFsID0ge2lkOiAnMTIzNCd9O1xuICAgICAgICBhcHByb3ZhbEl0ZW0gPSB7aWQ6ICc1Njc4J307XG4gICAgICAgIGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoKTtcblxuICAgICAgICBjb21tZW50cyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdhdXRob3InOiAnSmFtZXMgU21pdGgnLFxuICAgICAgICAgICAgICAgICAgICAnY29tbWVudCc6ICdzbmFrZSwgcmVwb3J0IScsXG4gICAgICAgICAgICAgICAgICAgICdkYXRlJzogJzQ1MjQzNjUzNjQ1NidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ2F1dGhvcic6ICdTbmFrZScsXG4gICAgICAgICAgICAgICAgICAgICdjb21tZW50JzogJ2F1Z2gsIGJyb2tlIG15IGtuaWZlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGUnOiAnNDUyNDM2NTM2NjU0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnYXV0aG9yJzogJ1JhbmRvbSBHdXknLFxuICAgICAgICAgICAgICAgICAgICAnY29tbWVudCc6ICdvbG9sb2xvbG9sb2xvbG9sb2xvbG9sb2xvbG8nLFxuICAgICAgICAgICAgICAgICAgICAnZGF0ZSc6ICc0NTI0MzY1MzY3ODknXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICBzcHlPbihhcHByb3ZhbFNlcnZpY2UsICdnZXRDb21tZW50cycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICBzcHlPbihhcHByb3ZhbFNlcnZpY2UsICdhZGRDb21tZW50JykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgIHNweU9uKGFwcHJvdmFsU2VydmljZSwgJ2dldEl0ZW1Db21tZW50cycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICBzcHlPbihhcHByb3ZhbFNlcnZpY2UsICdhZGRJdGVtQ29tbWVudCcpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIHRlc3QgdGhlIGNvbnRyb2xsZXIgd2hlbiBzZXQgdG8gcHVsbC9hZGQgY29tbWVudHMgZm9yIGFuIGFwcHJvdmFsXG4gICAgICovXG4gICAgZGVzY3JpYmUoJ3Rlc3QgQXBwcm92YWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRjb250cm9sbGVyKCdBcHByb3ZhbENvbW1lbnREaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGUsXG4gICAgICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlOiBhcHByb3ZhbFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgYXBwcm92YWw6IGFwcHJvdmFsLFxuICAgICAgICAgICAgICAgIGFwcHJvdmFsSXRlbTogbnVsbCxcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzY29wZS5uZXdDb21tZW50LnRleHQgPSAnbmV3IGNvbW1lbnQgdGV4dCc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdsb2FkcyBjb21tZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICd1aS9yZXN0L2FwcHJvdmFscy9jb21tZW50cycpLlxuICAgICAgICAgICAgcmVzcG9uZCgyMDAsIGNvbW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2UuZ2V0Q29tbWVudHMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2FkZHMgYSBjb21tZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICd1aS9yZXN0L2FwcHJvdmFscy9jb21tZW50cycpLlxuICAgICAgICAgICAgcmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIHNjb3BlLmFkZENvbW1lbnQoKTtcbiAgICAgICAgICAgIGV4cGVjdChhcHByb3ZhbFNlcnZpY2UuYWRkQ29tbWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJzEyMzQnLCAnbmV3IGNvbW1lbnQgdGV4dCcpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIHRlc3QgdGhlIGNvbnRyb2xsZXIgd2hlbiBzZXQgdG8gcHVsbC9hZGQgY29tbWVudHMgZm9yIGFuIGFwcHJvdmFsIGl0ZW1cbiAgICAgKi9cbiAgICBkZXNjcmliZSgndGVzdCBBcHByb3ZhbEl0ZW0nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2NvcGUuaXNJdGVtID0gdHJ1ZTtcbiAgICAgICAgICAgICRjb250cm9sbGVyKCdBcHByb3ZhbENvbW1lbnREaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGUsXG4gICAgICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlOiBhcHByb3ZhbFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgYXBwcm92YWw6IGFwcHJvdmFsLFxuICAgICAgICAgICAgICAgIGFwcHJvdmFsSXRlbTogYXBwcm92YWxJdGVtLFxuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNjb3BlLm5ld0NvbW1lbnQudGV4dCA9ICduZXcgY29tbWVudCB0ZXh0JztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2xvYWRzIGl0ZW0gY29tbWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKFNhaWxQb2ludC5DT05URVhUX1BBVEggKyAndWkvcmVzdC9hcHByb3ZhbHMvY29tbWVudHMnKS5cbiAgICAgICAgICAgIHJlc3BvbmQoMjAwLCBjb21tZW50cyk7XG4gICAgICAgICAgICBleHBlY3QoYXBwcm92YWxTZXJ2aWNlLmdldEl0ZW1Db21tZW50cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWRkcyBhbiBpdGVtIGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChTYWlsUG9pbnQuQ09OVEVYVF9QQVRIICsgJ3VpL3Jlc3QvYXBwcm92YWxzL2NvbW1lbnRzJykuXG4gICAgICAgICAgICByZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgc2NvcGUuYWRkQ29tbWVudCgpO1xuICAgICAgICAgICAgZXhwZWN0KGFwcHJvdmFsU2VydmljZS5hZGRJdGVtQ29tbWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJzEyMzQnLCAnNTY3OCcsICduZXcgY29tbWVudCB0ZXh0Jyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
