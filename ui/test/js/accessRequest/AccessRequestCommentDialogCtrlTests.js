System.register(['test/js/TestInitializer', 'accessRequest/AccessRequestModule', 'test/js/TestModule', './AccessRequestTestData'], function (_export) {
    'use strict';

    var accessRequestModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_accessRequestAccessRequestModule) {
            accessRequestModule = _accessRequestAccessRequestModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_AccessRequestTestData) {}],
        execute: function () {

            /**
             * Tests for the AccessRequestCommentDialogCtrl.
             */
            describe('AccessRequestCommentDialogCtrl', function () {
                var ctrl, $modalInstance, requestedRoleItem, requestedEntItem, entItem, roleItem, $controller, $rootScope;

                beforeEach(module(testModule));

                beforeEach(module(accessRequestModule));

                /**
                 * Inject the dependencies and setup mocks.
                 */
                beforeEach(inject(function (_$controller_, RequestedAccessItem, AccessRequestItem, _$rootScope_, accessRequestTestData) {
                    $controller = _$controller_;
                    $rootScope = _$rootScope_;

                    $modalInstance = {
                        close: jasmine.createSpy(),
                        dismiss: jasmine.createSpy()
                    };

                    roleItem = new AccessRequestItem(accessRequestTestData.ROLE);
                    entItem = new AccessRequestItem(accessRequestTestData.ENTITLEMENT);

                    requestedRoleItem = new RequestedAccessItem(roleItem);
                    requestedEntItem = new RequestedAccessItem(entItem);
                }));

                it('initializes empty values correctly', function () {
                    ctrl = $controller('AccessRequestCommentDialogCtrl', {
                        requestedAccessItem: requestedRoleItem,
                        $modalInstance: $modalInstance
                    });

                    expect(ctrl.comment).toEqual(null);
                    expect(ctrl.assignmentNote).toEqual(null);
                });

                it('initializes non-empty values correctly', function () {
                    var comment = 'some comment',
                        note = 'some note';

                    requestedRoleItem.setComment(comment);
                    requestedRoleItem.setAssignmentNote(note);

                    ctrl = $controller('AccessRequestCommentDialogCtrl', {
                        requestedAccessItem: requestedRoleItem,
                        $modalInstance: $modalInstance
                    });

                    expect(ctrl.comment).toEqual(comment);
                    expect(ctrl.assignmentNote).toEqual(note);
                });

                it('should allow assignment note tab when requested item allows it', function () {
                    ctrl = $controller('AccessRequestCommentDialogCtrl', {
                        requestedAccessItem: requestedRoleItem,
                        $modalInstance: $modalInstance
                    });

                    expect(ctrl.isAssignmentNoteAllowed()).toEqual(requestedRoleItem.isAssignmentNoteAllowed());
                });

                describe('save', function () {
                    var comment = 'some comment',
                        note = 'some note',
                        newComment = 'new comment',
                        newNote = 'new note';

                    beforeEach(function () {
                        requestedRoleItem.setComment(comment);
                        requestedRoleItem.setAssignmentNote(note);

                        ctrl = $controller('AccessRequestCommentDialogCtrl', {
                            requestedAccessItem: requestedRoleItem,
                            $modalInstance: $modalInstance
                        });

                        ctrl.comment = newComment;
                        ctrl.assignmentNote = newNote;

                        ctrl.saveComment();
                    });

                    it('saves comment and assignment note', function () {
                        expect(requestedRoleItem.getComment()).toEqual(newComment);
                        expect(requestedRoleItem.getAssignmentNote()).toEqual(newNote);
                    });

                    it('closes modal', function () {
                        expect($modalInstance.close).toHaveBeenCalled();
                    });
                });

                describe('cancel', function () {
                    beforeEach(function () {
                        ctrl = $controller('AccessRequestCommentDialogCtrl', {
                            requestedAccessItem: requestedRoleItem,
                            $modalInstance: $modalInstance
                        });

                        ctrl.cancel();
                    });

                    it('should dismiss modal', function () {
                        expect($modalInstance.dismiss).toHaveBeenCalled();
                    });

                    it('should not modify requested item comment or note field', function () {
                        expect(requestedRoleItem.getComment()).toEqual(null);
                        expect(requestedRoleItem.getAssignmentNote()).toEqual(null);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdENvbW1lbnREaWFsb2dDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyxzQkFBc0IsNEJBQTRCLFVBQVUsU0FBUztJQUF0Sjs7SUFHSSxJQUFJLHFCQUFxQjtJQUN6QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjtXQUNoQyxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7Ozs7O1lBQTdCLFNBQVMsa0NBQWtDLFlBQVc7Z0JBQ2xELElBQUksTUFBTSxnQkFBZ0IsbUJBQW1CLGtCQUFrQixTQUFTLFVBQVUsYUFBYTs7Z0JBRS9GLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTzs7Ozs7Z0JBS2xCLFdBQVcsT0FBTyxVQUFTLGVBQWUscUJBQXFCLG1CQUFtQixjQUN2RCx1QkFBdUI7b0JBQzlDLGNBQWM7b0JBQ2QsYUFBYTs7b0JBRWIsaUJBQWlCO3dCQUNiLE9BQU8sUUFBUTt3QkFDZixTQUFTLFFBQVE7OztvQkFHckIsV0FBVyxJQUFJLGtCQUFrQixzQkFBc0I7b0JBQ3ZELFVBQVUsSUFBSSxrQkFBa0Isc0JBQXNCOztvQkFFdEQsb0JBQW9CLElBQUksb0JBQW9CO29CQUM1QyxtQkFBbUIsSUFBSSxvQkFBb0I7OztnQkFHL0MsR0FBRyxzQ0FBc0MsWUFBVztvQkFDaEQsT0FBTyxZQUFZLGtDQUFrQzt3QkFDakQscUJBQXFCO3dCQUNyQixnQkFBZ0I7OztvQkFHcEIsT0FBTyxLQUFLLFNBQVMsUUFBUTtvQkFDN0IsT0FBTyxLQUFLLGdCQUFnQixRQUFROzs7Z0JBR3hDLEdBQUcsMENBQTBDLFlBQVc7b0JBQ3BELElBQUksVUFBVTt3QkFDVixPQUFPOztvQkFFWCxrQkFBa0IsV0FBVztvQkFDN0Isa0JBQWtCLGtCQUFrQjs7b0JBRXBDLE9BQU8sWUFBWSxrQ0FBa0M7d0JBQ2pELHFCQUFxQjt3QkFDckIsZ0JBQWdCOzs7b0JBR3BCLE9BQU8sS0FBSyxTQUFTLFFBQVE7b0JBQzdCLE9BQU8sS0FBSyxnQkFBZ0IsUUFBUTs7O2dCQUd4QyxHQUFHLGtFQUFrRSxZQUFXO29CQUM1RSxPQUFPLFlBQVksa0NBQWtDO3dCQUNqRCxxQkFBcUI7d0JBQ3JCLGdCQUFnQjs7O29CQUdwQixPQUFPLEtBQUssMkJBQTJCLFFBQVEsa0JBQWtCOzs7Z0JBR3JFLFNBQVMsUUFBUSxZQUFXO29CQUN4QixJQUFJLFVBQVU7d0JBQ1YsT0FBTzt3QkFDUCxhQUFhO3dCQUNiLFVBQVU7O29CQUVkLFdBQVcsWUFBVzt3QkFDbEIsa0JBQWtCLFdBQVc7d0JBQzdCLGtCQUFrQixrQkFBa0I7O3dCQUVwQyxPQUFPLFlBQVksa0NBQWtDOzRCQUNqRCxxQkFBcUI7NEJBQ3JCLGdCQUFnQjs7O3dCQUdwQixLQUFLLFVBQVU7d0JBQ2YsS0FBSyxpQkFBaUI7O3dCQUV0QixLQUFLOzs7b0JBR1QsR0FBRyxxQ0FBcUMsWUFBVzt3QkFDL0MsT0FBTyxrQkFBa0IsY0FBYyxRQUFRO3dCQUMvQyxPQUFPLGtCQUFrQixxQkFBcUIsUUFBUTs7O29CQUcxRCxHQUFHLGdCQUFnQixZQUFXO3dCQUMxQixPQUFPLGVBQWUsT0FBTzs7OztnQkFJckMsU0FBUyxVQUFVLFlBQVc7b0JBQzFCLFdBQVcsWUFBVzt3QkFDbEIsT0FBTyxZQUFZLGtDQUFrQzs0QkFDakQscUJBQXFCOzRCQUNyQixnQkFBZ0I7Ozt3QkFHcEIsS0FBSzs7O29CQUdULEdBQUcsd0JBQXdCLFlBQVc7d0JBQ2xDLE9BQU8sZUFBZSxTQUFTOzs7b0JBR25DLEdBQUcsMERBQTBELFlBQVc7d0JBQ3BFLE9BQU8sa0JBQWtCLGNBQWMsUUFBUTt3QkFDL0MsT0FBTyxrQkFBa0IscUJBQXFCLFFBQVE7Ozs7OztHQVUvRCIsImZpbGUiOiJhY2Nlc3NSZXF1ZXN0L0FjY2Vzc1JlcXVlc3RDb21tZW50RGlhbG9nQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBhY2Nlc3NSZXF1ZXN0TW9kdWxlIGZyb20gJ2FjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdE1vZHVsZSc7XG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xuaW1wb3J0ICcuL0FjY2Vzc1JlcXVlc3RUZXN0RGF0YSc7XG5cbi8qKlxuICogVGVzdHMgZm9yIHRoZSBBY2Nlc3NSZXF1ZXN0Q29tbWVudERpYWxvZ0N0cmwuXG4gKi9cbmRlc2NyaWJlKCdBY2Nlc3NSZXF1ZXN0Q29tbWVudERpYWxvZ0N0cmwnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3RybCwgJG1vZGFsSW5zdGFuY2UsIHJlcXVlc3RlZFJvbGVJdGVtLCByZXF1ZXN0ZWRFbnRJdGVtLCBlbnRJdGVtLCByb2xlSXRlbSwgJGNvbnRyb2xsZXIsICRyb290U2NvcGU7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhY2Nlc3NSZXF1ZXN0TW9kdWxlKSk7XG5cbiAgICAvKipcbiAgICAgKiBJbmplY3QgdGhlIGRlcGVuZGVuY2llcyBhbmQgc2V0dXAgbW9ja3MuXG4gICAgICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRjb250cm9sbGVyXywgUmVxdWVzdGVkQWNjZXNzSXRlbSwgQWNjZXNzUmVxdWVzdEl0ZW0sIF8kcm9vdFNjb3BlXyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEpIHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuXG4gICAgICAgICRtb2RhbEluc3RhbmNlID0ge1xuICAgICAgICAgICAgY2xvc2U6IGphc21pbmUuY3JlYXRlU3B5KCksXG4gICAgICAgICAgICBkaXNtaXNzOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIH07XG5cbiAgICAgICAgcm9sZUl0ZW0gPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEUpO1xuICAgICAgICBlbnRJdGVtID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5FTlRJVExFTUVOVCk7XG5cbiAgICAgICAgcmVxdWVzdGVkUm9sZUl0ZW0gPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShyb2xlSXRlbSk7XG4gICAgICAgIHJlcXVlc3RlZEVudEl0ZW0gPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShlbnRJdGVtKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnaW5pdGlhbGl6ZXMgZW1wdHkgdmFsdWVzIGNvcnJlY3RseScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0FjY2Vzc1JlcXVlc3RDb21tZW50RGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgIHJlcXVlc3RlZEFjY2Vzc0l0ZW06IHJlcXVlc3RlZFJvbGVJdGVtLFxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2U6ICRtb2RhbEluc3RhbmNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChjdHJsLmNvbW1lbnQpLnRvRXF1YWwobnVsbCk7XG4gICAgICAgIGV4cGVjdChjdHJsLmFzc2lnbm1lbnROb3RlKS50b0VxdWFsKG51bGwpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2luaXRpYWxpemVzIG5vbi1lbXB0eSB2YWx1ZXMgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb21tZW50ID0gJ3NvbWUgY29tbWVudCcsXG4gICAgICAgICAgICBub3RlID0gJ3NvbWUgbm90ZSc7XG5cbiAgICAgICAgcmVxdWVzdGVkUm9sZUl0ZW0uc2V0Q29tbWVudChjb21tZW50KTtcbiAgICAgICAgcmVxdWVzdGVkUm9sZUl0ZW0uc2V0QXNzaWdubWVudE5vdGUobm90ZSk7XG5cbiAgICAgICAgY3RybCA9ICRjb250cm9sbGVyKCdBY2Nlc3NSZXF1ZXN0Q29tbWVudERpYWxvZ0N0cmwnLCB7XG4gICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtOiByZXF1ZXN0ZWRSb2xlSXRlbSxcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoY3RybC5jb21tZW50KS50b0VxdWFsKGNvbW1lbnQpO1xuICAgICAgICBleHBlY3QoY3RybC5hc3NpZ25tZW50Tm90ZSkudG9FcXVhbChub3RlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgYXNzaWdubWVudCBub3RlIHRhYiB3aGVuIHJlcXVlc3RlZCBpdGVtIGFsbG93cyBpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0FjY2Vzc1JlcXVlc3RDb21tZW50RGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgIHJlcXVlc3RlZEFjY2Vzc0l0ZW06IHJlcXVlc3RlZFJvbGVJdGVtLFxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2U6ICRtb2RhbEluc3RhbmNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChjdHJsLmlzQXNzaWdubWVudE5vdGVBbGxvd2VkKCkpLnRvRXF1YWwocmVxdWVzdGVkUm9sZUl0ZW0uaXNBc3NpZ25tZW50Tm90ZUFsbG93ZWQoKSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2F2ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29tbWVudCA9ICdzb21lIGNvbW1lbnQnLFxuICAgICAgICAgICAgbm90ZSA9ICdzb21lIG5vdGUnLFxuICAgICAgICAgICAgbmV3Q29tbWVudCA9ICduZXcgY29tbWVudCcsXG4gICAgICAgICAgICBuZXdOb3RlID0gJ25ldyBub3RlJztcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVxdWVzdGVkUm9sZUl0ZW0uc2V0Q29tbWVudChjb21tZW50KTtcbiAgICAgICAgICAgIHJlcXVlc3RlZFJvbGVJdGVtLnNldEFzc2lnbm1lbnROb3RlKG5vdGUpO1xuXG4gICAgICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0FjY2Vzc1JlcXVlc3RDb21tZW50RGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtOiByZXF1ZXN0ZWRSb2xlSXRlbSxcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZTogJG1vZGFsSW5zdGFuY2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdHJsLmNvbW1lbnQgPSBuZXdDb21tZW50O1xuICAgICAgICAgICAgY3RybC5hc3NpZ25tZW50Tm90ZSA9IG5ld05vdGU7XG5cbiAgICAgICAgICAgIGN0cmwuc2F2ZUNvbW1lbnQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3NhdmVzIGNvbW1lbnQgYW5kIGFzc2lnbm1lbnQgbm90ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZFJvbGVJdGVtLmdldENvbW1lbnQoKSkudG9FcXVhbChuZXdDb21tZW50KTtcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRSb2xlSXRlbS5nZXRBc3NpZ25tZW50Tm90ZSgpKS50b0VxdWFsKG5ld05vdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2xvc2VzIG1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoJG1vZGFsSW5zdGFuY2UuY2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY2FuY2VsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0FjY2Vzc1JlcXVlc3RDb21tZW50RGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtOiByZXF1ZXN0ZWRSb2xlSXRlbSxcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZTogJG1vZGFsSW5zdGFuY2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdHJsLmNhbmNlbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGRpc21pc3MgbW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdCgkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vZGlmeSByZXF1ZXN0ZWQgaXRlbSBjb21tZW50IG9yIG5vdGUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRSb2xlSXRlbS5nZXRDb21tZW50KCkpLnRvRXF1YWwobnVsbCk7XG4gICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkUm9sZUl0ZW0uZ2V0QXNzaWdubWVudE5vdGUoKSkudG9FcXVhbChudWxsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
