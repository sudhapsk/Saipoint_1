System.register(['test/js/TestInitializer', 'common/comment/CommentModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var CommentModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonCommentCommentModule) {
            CommentModule = _commonCommentCommentModule['default'];
        }],
        execute: function () {

            describe('CommentService', function () {
                // Use the module.
                beforeEach(module(CommentModule));

                var $rootScope = undefined,
                    commentService = undefined,
                    spModal = undefined,
                    modalInstance = undefined;

                beforeEach(module(function ($provide) {
                    /* This is still a bit magical, it may be related to this ui-bootstrap issue
                     * (https://github.com/angular-ui/bootstrap/issues/3633), but if we do not turn
                     * off animations the dialogs do not get removed from the dom during test.
                     * Additionally after dismissing a modal we need to manually flush $timeout */
                    $provide.decorator('$modal', function ($delegate) {
                        return {
                            open: function (options) {
                                options.animation = false;
                                return $delegate.open(options);
                            }
                        };
                    });
                }));

                afterEach(inject(function ($timeout) {
                    if (modalInstance) {
                        modalInstance.dismiss();
                        $timeout.flush();
                    }
                }));

                beforeEach(inject(function (_$rootScope_, _commentService_, _spModal_) {
                    commentService = _commentService_;
                    spModal = _spModal_;
                    $rootScope = _$rootScope_;

                    // delete any modals that haven't been closed
                    angular.forEach(angular.element('div[class*=modal]'), function (element) {
                        angular.element(element).remove();
                    });

                    /* The functions under test do not return a reference to the modal,
                     * sneak a reference out so we can programatically close it without
                     * falling back to searching the dom for the exit button */
                    var originalOpen = spModal.open;
                    spModal.open = function () {
                        modalInstance = originalOpen.apply(spModal, arguments);
                        return modalInstance;
                    };
                }));

                describe('openCommentDialog()', function () {
                    it('should open a spModal dialog', function () {
                        spyOn(spModal, 'open').and.callThrough();
                        commentService.openCommentDialog();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                    });

                    it('should open a spModal dialog and return a promise that resolves with the comment', function () {
                        spyOn(spModal, 'open').and.callThrough();

                        var myComment = 'This is unacceptable!',
                            response = commentService.openCommentDialog();

                        modalInstance.close(myComment);
                        response.then(function (value) {
                            expect(value).toBe(myComment);
                        });
                        $rootScope.$apply();

                        expect(spModal.open).toHaveBeenCalled();
                    });
                });

                describe('Submit Button', function () {
                    it('should be disabled when comments.length is equal to 0', function () {
                        spyOn(spModal, 'open').and.callThrough();
                        commentService.openCommentDialog();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();
                        expect(angular.element('button[class*=btn-default]')[0].disabled).toBeTruthy();
                    });

                    it('should be enabled when comments.length is greater than 0', function () {
                        spyOn(spModal, 'open').and.callThrough();
                        commentService.openCommentDialog();
                        $rootScope.$apply();
                        expect(spModal.open).toHaveBeenCalled();

                        var textarea = angular.element('#commentTextArea')[0];
                        textarea.value = 'foo';
                        angular.element(textarea).trigger('change');
                        expect(angular.element('button[class*=btn-default]')[0].disabled).toBeFalsy();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9jb21tZW50L0NvbW1lbnRTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLGlDQUFpQyxVQUFVLFNBQVM7OztJQUc1Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsNkJBQTZCO1lBQ25GLGdCQUFnQiw0QkFBNEI7O1FBRWhELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxrQkFBa0IsWUFBVzs7Z0JBRWxDLFdBQVcsT0FBTzs7Z0JBRWxCLElBQUksYUFBVTtvQkFBRSxpQkFBYztvQkFBRSxVQUFPO29CQUFFLGdCQUFhOztnQkFFdEQsV0FBVyxPQUFPLFVBQVMsVUFBVTs7Ozs7b0JBS2pDLFNBQVMsVUFBVSxVQUFVLFVBQVMsV0FBVzt3QkFDN0MsT0FBTzs0QkFDSCxNQUFNLFVBQVMsU0FBUztnQ0FDcEIsUUFBUSxZQUFZO2dDQUNwQixPQUFPLFVBQVUsS0FBSzs7Ozs7O2dCQU10QyxVQUFVLE9BQU8sVUFBUyxVQUFVO29CQUNoQyxJQUFJLGVBQWU7d0JBQ2YsY0FBYzt3QkFDZCxTQUFTOzs7O2dCQUtqQixXQUFXLE9BQU8sVUFBUyxjQUFjLGtCQUFrQixXQUFXO29CQUNsRSxpQkFBaUI7b0JBQ2pCLFVBQVU7b0JBQ1YsYUFBYTs7O29CQUdiLFFBQVEsUUFBUSxRQUFRLFFBQVEsc0JBQXNCLFVBQUMsU0FBVzt3QkFDOUQsUUFBUSxRQUFRLFNBQVM7Ozs7OztvQkFNN0IsSUFBSSxlQUFlLFFBQVE7b0JBQzNCLFFBQVEsT0FBTyxZQUFXO3dCQUN0QixnQkFBZ0IsYUFBYSxNQUFNLFNBQVM7d0JBQzVDLE9BQU87Ozs7Z0JBSWYsU0FBUyx1QkFBdUIsWUFBVztvQkFDdkMsR0FBRyxnQ0FBZ0MsWUFBVzt3QkFDMUMsTUFBTSxTQUFTLFFBQVEsSUFBSTt3QkFDM0IsZUFBZTt3QkFDZixXQUFXO3dCQUNYLE9BQU8sUUFBUSxNQUFNOzs7b0JBR3pCLEdBQUcsb0ZBQW9GLFlBQVc7d0JBQzlGLE1BQU0sU0FBUyxRQUFRLElBQUk7O3dCQUUzQixJQUFJLFlBQVk7NEJBQ1osV0FBVyxlQUFlOzt3QkFFOUIsY0FBYyxNQUFNO3dCQUNwQixTQUFTLEtBQUssVUFBUyxPQUFPOzRCQUMxQixPQUFPLE9BQU8sS0FBSzs7d0JBRXZCLFdBQVc7O3dCQUVYLE9BQU8sUUFBUSxNQUFNOzs7O2dCQUk3QixTQUFTLGlCQUFpQixZQUFXO29CQUNqQyxHQUFHLHlEQUF5RCxZQUFXO3dCQUNuRSxNQUFNLFNBQVMsUUFBUSxJQUFJO3dCQUMzQixlQUFlO3dCQUNmLFdBQVc7d0JBQ1gsT0FBTyxRQUFRLE1BQU07d0JBQ3JCLE9BQU8sUUFBUSxRQUFRLDhCQUE4QixHQUFHLFVBQVU7OztvQkFHdEUsR0FBRyw0REFBNEQsWUFBVzt3QkFDdEUsTUFBTSxTQUFTLFFBQVEsSUFBSTt3QkFDM0IsZUFBZTt3QkFDZixXQUFXO3dCQUNYLE9BQU8sUUFBUSxNQUFNOzt3QkFFckIsSUFBSSxXQUFXLFFBQVEsUUFBUSxvQkFBb0I7d0JBQ25ELFNBQVMsUUFBUTt3QkFDakIsUUFBUSxRQUFRLFVBQVUsUUFBUTt3QkFDbEMsT0FBTyxRQUFRLFFBQVEsOEJBQThCLEdBQUcsVUFBVTs7Ozs7O0dBZTNFIiwiZmlsZSI6ImNvbW1vbi9jb21tZW50L0NvbW1lbnRTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgQ29tbWVudE1vZHVsZSBmcm9tICdjb21tb24vY29tbWVudC9Db21tZW50TW9kdWxlJztcblxuZGVzY3JpYmUoJ0NvbW1lbnRTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVXNlIHRoZSBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoQ29tbWVudE1vZHVsZSkpO1xuXG4gICAgbGV0ICRyb290U2NvcGUsIGNvbW1lbnRTZXJ2aWNlLCBzcE1vZGFsLCBtb2RhbEluc3RhbmNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICAgLyogVGhpcyBpcyBzdGlsbCBhIGJpdCBtYWdpY2FsLCBpdCBtYXkgYmUgcmVsYXRlZCB0byB0aGlzIHVpLWJvb3RzdHJhcCBpc3N1ZVxuICAgICAgICAgKiAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvYm9vdHN0cmFwL2lzc3Vlcy8zNjMzKSwgYnV0IGlmIHdlIGRvIG5vdCB0dXJuXG4gICAgICAgICAqIG9mZiBhbmltYXRpb25zIHRoZSBkaWFsb2dzIGRvIG5vdCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBkb20gZHVyaW5nIHRlc3QuXG4gICAgICAgICAqIEFkZGl0aW9uYWxseSBhZnRlciBkaXNtaXNzaW5nIGEgbW9kYWwgd2UgbmVlZCB0byBtYW51YWxseSBmbHVzaCAkdGltZW91dCAqL1xuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRtb2RhbCcsIGZ1bmN0aW9uKCRkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcGVuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZGVsZWdhdGUub3BlbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICBhZnRlckVhY2goaW5qZWN0KGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgICAgIGlmIChtb2RhbEluc3RhbmNlKSB7XG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgICAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgIH1cblxuICAgIH0pKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgX2NvbW1lbnRTZXJ2aWNlXywgX3NwTW9kYWxfKSB7XG4gICAgICAgIGNvbW1lbnRTZXJ2aWNlID0gX2NvbW1lbnRTZXJ2aWNlXztcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcblxuICAgICAgICAvLyBkZWxldGUgYW55IG1vZGFscyB0aGF0IGhhdmVuJ3QgYmVlbiBjbG9zZWRcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudCgnZGl2W2NsYXNzKj1tb2RhbF0nKSwgKGVsZW1lbnQpPT4ge1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBUaGUgZnVuY3Rpb25zIHVuZGVyIHRlc3QgZG8gbm90IHJldHVybiBhIHJlZmVyZW5jZSB0byB0aGUgbW9kYWwsXG4gICAgICAgICAqIHNuZWFrIGEgcmVmZXJlbmNlIG91dCBzbyB3ZSBjYW4gcHJvZ3JhbWF0aWNhbGx5IGNsb3NlIGl0IHdpdGhvdXRcbiAgICAgICAgICogZmFsbGluZyBiYWNrIHRvIHNlYXJjaGluZyB0aGUgZG9tIGZvciB0aGUgZXhpdCBidXR0b24gKi9cbiAgICAgICAgdmFyIG9yaWdpbmFsT3BlbiA9IHNwTW9kYWwub3BlbjtcbiAgICAgICAgc3BNb2RhbC5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlID0gb3JpZ2luYWxPcGVuLmFwcGx5KHNwTW9kYWwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gbW9kYWxJbnN0YW5jZTtcbiAgICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnb3BlbkNvbW1lbnREaWFsb2coKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gYSBzcE1vZGFsIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgIGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG9wZW4gYSBzcE1vZGFsIGRpYWxvZyBhbmQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgICAgIGxldCBteUNvbW1lbnQgPSAnVGhpcyBpcyB1bmFjY2VwdGFibGUhJyxcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKCk7XG5cbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UuY2xvc2UobXlDb21tZW50KTtcbiAgICAgICAgICAgIHJlc3BvbnNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QodmFsdWUpLnRvQmUobXlDb21tZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTdWJtaXQgQnV0dG9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgYmUgZGlzYWJsZWQgd2hlbiBjb21tZW50cy5sZW5ndGggaXMgZXF1YWwgdG8gMCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3B5T24oc3BNb2RhbCwgJ29wZW4nKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgIGNvbW1lbnRTZXJ2aWNlLm9wZW5Db21tZW50RGlhbG9nKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCgnYnV0dG9uW2NsYXNzKj1idG4tZGVmYXVsdF0nKVswXS5kaXNhYmxlZCkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGJlIGVuYWJsZWQgd2hlbiBjb21tZW50cy5sZW5ndGggaXMgZ3JlYXRlciB0aGFuIDAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBjb21tZW50U2VydmljZS5vcGVuQ29tbWVudERpYWxvZygpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICAgICAgICAgICAgbGV0IHRleHRhcmVhID0gYW5ndWxhci5lbGVtZW50KCcjY29tbWVudFRleHRBcmVhJylbMF07XG4gICAgICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9ICdmb28nO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRleHRhcmVhKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoJ2J1dHRvbltjbGFzcyo9YnRuLWRlZmF1bHRdJylbMF0uZGlzYWJsZWQpLnRvQmVGYWxzeSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
