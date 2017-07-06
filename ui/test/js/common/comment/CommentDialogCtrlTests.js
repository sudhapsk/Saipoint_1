System.register(['test/js/TestInitializer', 'common/comment/CommentModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var CommentModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonCommentCommentModule) {
            CommentModule = _commonCommentCommentModule['default'];
        }],
        execute: function () {

            describe('CommentDialogCtrl', function () {
                // Use the module.
                beforeEach(module(CommentModule));

                var $controller = undefined,
                    $rootScope = undefined,
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

                beforeEach(inject(function (_$controller_, _$rootScope_, _spModal_) {
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;
                    spModal = _spModal_;
                }));

                function createController(comments, description) {
                    modalInstance = spModal.open({
                        title: 'title',
                        content: '<input ng-model="dialogCtrl.comment"/>'
                    });
                    var ctrl = $controller('CommentDialogCtrl', {
                        $modalInstance: modalInstance,
                        description: description,
                        comments: comments,
                        readOnly: false
                    });
                    return ctrl;
                }

                it('should initialize with description', function () {
                    var description = 'some description',
                        ctrl = createController('some comments', description);
                    expect(ctrl.description).toEqual(description);
                });

                it('should initialize with comments', function () {
                    var comments = 'some comments',
                        ctrl = createController('some comments', null);
                    expect(ctrl.comments).toEqual(comments);
                });

                describe('complete()', function () {
                    it('should reject with no value when no comment was entered', function () {
                        var ctrl = createController();
                        ctrl.complete();
                        modalInstance.result.then(function (value) {}, function (rejected) {
                            expect(rejected).toBeUndefined();
                        });
                        $rootScope.$apply();
                    });

                    it('should resolve with the correct comment', function () {
                        var myComment = 'I do not like you',
                            ctrl = createController(myComment);
                        ctrl.complete();
                        modalInstance.result.then(function (value) {
                            expect(value).toBe(myComment);
                        });
                        $rootScope.$apply();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9jb21tZW50L0NvbW1lbnREaWFsb2dDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLGlDQUFpQyxVQUFVLFNBQVM7OztJQUc1Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsNkJBQTZCO1lBQ25GLGdCQUFnQiw0QkFBNEI7O1FBRWhELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxxQkFBcUIsWUFBVzs7Z0JBRXJDLFdBQVcsT0FBTzs7Z0JBRWxCLElBQUksY0FBVztvQkFBRSxhQUFVO29CQUFFLFVBQU87b0JBQUUsZ0JBQWE7O2dCQUVuRCxXQUFXLE9BQU8sVUFBUyxVQUFVOzs7OztvQkFLakMsU0FBUyxVQUFVLFVBQVUsVUFBUyxXQUFXO3dCQUM3QyxPQUFPOzRCQUNILE1BQU0sVUFBUyxTQUFTO2dDQUNwQixRQUFRLFlBQVk7Z0NBQ3BCLE9BQU8sVUFBVSxLQUFLOzs7Ozs7Z0JBTXRDLFVBQVUsT0FBTyxVQUFTLFVBQVU7b0JBQ2hDLElBQUksZUFBZTt3QkFDZixjQUFjO3dCQUNkLFNBQVM7Ozs7Z0JBSWpCLFdBQVcsT0FBTyxVQUFTLGVBQWUsY0FBYyxXQUFXO29CQUMvRCxjQUFjO29CQUNkLGFBQWE7b0JBQ2IsVUFBVTs7O2dCQUdkLFNBQVMsaUJBQWlCLFVBQVUsYUFBYTtvQkFDN0MsZ0JBQWdCLFFBQVEsS0FBSzt3QkFDekIsT0FBTzt3QkFDUCxTQUFTOztvQkFFYixJQUFJLE9BQU8sWUFBWSxxQkFBcUI7d0JBQ3hDLGdCQUFnQjt3QkFDaEIsYUFBYTt3QkFDYixVQUFVO3dCQUNWLFVBQVU7O29CQUVkLE9BQU87OztnQkFHWCxHQUFHLHNDQUFzQyxZQUFNO29CQUMzQyxJQUFJLGNBQWM7d0JBQ2QsT0FBTyxpQkFBaUIsaUJBQWlCO29CQUM3QyxPQUFPLEtBQUssYUFBYSxRQUFROzs7Z0JBR3JDLEdBQUcsbUNBQW1DLFlBQU07b0JBQ3hDLElBQUksV0FBVzt3QkFDWCxPQUFPLGlCQUFpQixpQkFBaUI7b0JBQzdDLE9BQU8sS0FBSyxVQUFVLFFBQVE7OztnQkFHbEMsU0FBUyxjQUFjLFlBQVc7b0JBQzlCLEdBQUcsMkRBQTJELFlBQVc7d0JBQ3JFLElBQUksT0FBTzt3QkFDWCxLQUFLO3dCQUNMLGNBQWMsT0FBTyxLQUFLLFVBQVMsT0FBTyxJQUN2QyxVQUFTLFVBQVU7NEJBQ2xCLE9BQU8sVUFBVTs7d0JBRXJCLFdBQVc7OztvQkFHZixHQUFHLDJDQUEyQyxZQUFXO3dCQUNyRCxJQUFJLFlBQVk7NEJBQ1osT0FBTyxpQkFBaUI7d0JBQzVCLEtBQUs7d0JBQ0wsY0FBYyxPQUFPLEtBQUssVUFBUyxPQUFPOzRCQUN0QyxPQUFPLE9BQU8sS0FBSzs7d0JBRXZCLFdBQVc7Ozs7OztHQWVwQiIsImZpbGUiOiJjb21tb24vY29tbWVudC9Db21tZW50RGlhbG9nQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IENvbW1lbnRNb2R1bGUgZnJvbSAnY29tbW9uL2NvbW1lbnQvQ29tbWVudE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdDb21tZW50RGlhbG9nQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFVzZSB0aGUgbW9kdWxlLlxuICAgIGJlZm9yZUVhY2gobW9kdWxlKENvbW1lbnRNb2R1bGUpKTtcblxuICAgIGxldCAkY29udHJvbGxlciwgJHJvb3RTY29wZSwgc3BNb2RhbCwgbW9kYWxJbnN0YW5jZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgIC8qIFRoaXMgaXMgc3RpbGwgYSBiaXQgbWFnaWNhbCwgaXQgbWF5IGJlIHJlbGF0ZWQgdG8gdGhpcyB1aS1ib290c3RyYXAgaXNzdWVcbiAgICAgICAgICogKGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL2Jvb3RzdHJhcC9pc3N1ZXMvMzYzMyksIGJ1dCBpZiB3ZSBkbyBub3QgdHVyblxuICAgICAgICAgKiBvZmYgYW5pbWF0aW9ucyB0aGUgZGlhbG9ncyBkbyBub3QgZ2V0IHJlbW92ZWQgZnJvbSB0aGUgZG9tIGR1cmluZyB0ZXN0LlxuICAgICAgICAgKiBBZGRpdGlvbmFsbHkgYWZ0ZXIgZGlzbWlzc2luZyBhIG1vZGFsIHdlIG5lZWQgdG8gbWFudWFsbHkgZmx1c2ggJHRpbWVvdXQgKi9cbiAgICAgICAgJHByb3ZpZGUuZGVjb3JhdG9yKCckbW9kYWwnLCBmdW5jdGlvbigkZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGRlbGVnYXRlLm9wZW4ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgYWZ0ZXJFYWNoKGluamVjdChmdW5jdGlvbigkdGltZW91dCkge1xuICAgICAgICBpZiAobW9kYWxJbnN0YW5jZSkge1xuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICB9XG4gICAgfSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXywgXyRyb290U2NvcGVfLCBfc3BNb2RhbF8pIHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoY29tbWVudHMsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UgPSBzcE1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgdGl0bGU6ICd0aXRsZScsXG4gICAgICAgICAgICBjb250ZW50OiAnPGlucHV0IG5nLW1vZGVsPVwiZGlhbG9nQ3RybC5jb21tZW50XCIvPidcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBjdHJsID0gJGNvbnRyb2xsZXIoJ0NvbW1lbnREaWFsb2dDdHJsJywge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2U6IG1vZGFsSW5zdGFuY2UsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjb21tZW50czogY29tbWVudHMsXG4gICAgICAgICAgICByZWFkT25seTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSAnc29tZSBkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcignc29tZSBjb21tZW50cycsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgZXhwZWN0KGN0cmwuZGVzY3JpcHRpb24pLnRvRXF1YWwoZGVzY3JpcHRpb24pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggY29tbWVudHMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBjb21tZW50cyA9ICdzb21lIGNvbW1lbnRzJyxcbiAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKCdzb21lIGNvbW1lbnRzJywgbnVsbCk7XG4gICAgICAgIGV4cGVjdChjdHJsLmNvbW1lbnRzKS50b0VxdWFsKGNvbW1lbnRzKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjb21wbGV0ZSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgcmVqZWN0IHdpdGggbm8gdmFsdWUgd2hlbiBubyBjb21tZW50IHdhcyBlbnRlcmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIGN0cmwuY29tcGxldGUoKTtcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlamVjdGVkKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlamVjdGVkKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmVzb2x2ZSB3aXRoIHRoZSBjb3JyZWN0IGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBteUNvbW1lbnQgPSAnSSBkbyBub3QgbGlrZSB5b3UnLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKG15Q29tbWVudCk7XG4gICAgICAgICAgICBjdHJsLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHZhbHVlKS50b0JlKG15Q29tbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
