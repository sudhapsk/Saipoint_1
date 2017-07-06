System.register(['test/js/TestInitializer', 'common/model/ModelModule'], function (_export) {
    'use strict';

    var modelModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonModelModelModule) {
            modelModule = _commonModelModelModule['default'];
        }],
        execute: function () {

            describe('ViolationReviewWorkItems', function () {
                var ViolationReviewWorkItem, policyViolationSpy, violationReviewRequestedItemSpy;

                // Use the access request module.
                beforeEach(module(modelModule));

                // Return spies rather than the real constructors so we can make sure they were called with the correct value
                beforeEach(module(function ($provide) {
                    violationReviewRequestedItemSpy = jasmine.createSpy();
                    policyViolationSpy = jasmine.createSpy();
                    $provide.value('PolicyViolation', policyViolationSpy);
                    $provide.value('ViolationReviewRequestedItem', violationReviewRequestedItemSpy);
                }));

                beforeEach(inject(function (_ViolationReviewWorkItem_) {
                    ViolationReviewWorkItem = _ViolationReviewWorkItem_;
                }));

                it('should throw if constructed without data', function () {
                    expect(function () {
                        new ViolationReviewWorkItem();
                    }).toThrow();
                });

                it('should populate values correctly', function () {
                    var data = {
                        id: 'id',
                        target: {
                            id: 'targetId',
                            name: 'name',
                            displayName: 'displayName',
                            workgroup: false
                        },
                        requester: {
                            id: 'requesterId',
                            name: 'targetName',
                            displayName: 'targetDisplayName',
                            workgroup: false
                        },
                        created: 1423077394799,
                        violations: [{ violation: 'details' }],
                        requestedItems: [{ entitlementValue: 'value' }],
                        allowRequestsWithViolations: true,
                        requireViolationComment: true
                    },
                        workItem = new ViolationReviewWorkItem(data);

                    expect(workItem.getId()).toEqual(data.id);
                    expect(workItem.getTarget().name).toEqual(data.target.name);
                    expect(workItem.getRequester().name).toEqual(data.requester.name);
                    expect(workItem.getCreated()).toEqual(new Date(data.created));

                    expect(policyViolationSpy).toHaveBeenCalledWith(data.violations[0]);
                    expect(workItem.getViolations().length).toBe(1);
                    expect(violationReviewRequestedItemSpy).toHaveBeenCalledWith(data.requestedItems[0]);
                    expect(workItem.getRequestedItems().length).toBe(1);
                    expect(workItem.hasViolations()).toBeTruthy();
                    expect(workItem.getViolationCount()).toBe(1);
                    expect(workItem.isAllowRequestsWithViolations()).toBeTruthy();
                    expect(workItem.isRequireViolationComment()).toBeTruthy();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9tb2RlbC9WaW9sYXRpb25SZXZpZXdXb3JrSXRlbVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw2QkFBNkIsVUFBVSxTQUFTO0lBQTVGOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsY0FBYyx3QkFBd0I7O1FBRTFDLFNBQVMsWUFBWTs7WUFIN0IsU0FBUyw0QkFBNEIsWUFBVztnQkFDNUMsSUFBSSx5QkFDQSxvQkFDQTs7O2dCQUdKLFdBQVcsT0FBTzs7O2dCQUdsQixXQUFXLE9BQU8sVUFBUyxVQUFVO29CQUNqQyxrQ0FBa0MsUUFBUTtvQkFDMUMscUJBQXFCLFFBQVE7b0JBQzdCLFNBQVMsTUFBTSxtQkFBbUI7b0JBQ2xDLFNBQVMsTUFBTSxnQ0FBZ0M7OztnQkFHbkQsV0FBVyxPQUFPLFVBQVMsMkJBQTJCO29CQUNsRCwwQkFBMEI7OztnQkFHOUIsR0FBRyw0Q0FBNEMsWUFBVztvQkFDdEQsT0FBTyxZQUFXO3dCQUNkLElBQUk7dUJBQ0w7OztnQkFHUCxHQUFHLG9DQUFvQyxZQUFXO29CQUM5QyxJQUFJLE9BQU87d0JBQ0gsSUFBSTt3QkFDSixRQUFROzRCQUNKLElBQUk7NEJBQ0osTUFBTTs0QkFDTixhQUFhOzRCQUNiLFdBQVc7O3dCQUVmLFdBQVc7NEJBQ1AsSUFBSTs0QkFDSixNQUFNOzRCQUNOLGFBQWE7NEJBQ2IsV0FBVzs7d0JBRWYsU0FBUzt3QkFDVCxZQUFZLENBQUMsRUFBQyxXQUFXO3dCQUN6QixnQkFBZ0IsQ0FBQyxFQUFDLGtCQUFrQjt3QkFDcEMsNkJBQTZCO3dCQUM3Qix5QkFBeUI7O3dCQUU3QixXQUFXLElBQUksd0JBQXdCOztvQkFFM0MsT0FBTyxTQUFTLFNBQVMsUUFBUSxLQUFLO29CQUN0QyxPQUFPLFNBQVMsWUFBWSxNQUFNLFFBQVEsS0FBSyxPQUFPO29CQUN0RCxPQUFPLFNBQVMsZUFBZSxNQUFNLFFBQVEsS0FBSyxVQUFVO29CQUM1RCxPQUFPLFNBQVMsY0FBYyxRQUFRLElBQUksS0FBSyxLQUFLOztvQkFFcEQsT0FBTyxvQkFBb0IscUJBQXFCLEtBQUssV0FBVztvQkFDaEUsT0FBTyxTQUFTLGdCQUFnQixRQUFRLEtBQUs7b0JBQzdDLE9BQU8saUNBQWlDLHFCQUFxQixLQUFLLGVBQWU7b0JBQ2pGLE9BQU8sU0FBUyxvQkFBb0IsUUFBUSxLQUFLO29CQUNqRCxPQUFPLFNBQVMsaUJBQWlCO29CQUNqQyxPQUFPLFNBQVMscUJBQXFCLEtBQUs7b0JBQzFDLE9BQU8sU0FBUyxpQ0FBaUM7b0JBQ2pELE9BQU8sU0FBUyw2QkFBNkI7Ozs7O0dBUWxEIiwiZmlsZSI6ImNvbW1vbi9tb2RlbC9WaW9sYXRpb25SZXZpZXdXb3JrSXRlbVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBtb2RlbE1vZHVsZSBmcm9tICdjb21tb24vbW9kZWwvTW9kZWxNb2R1bGUnO1xuXG5kZXNjcmliZSgnVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIFZpb2xhdGlvblJldmlld1dvcmtJdGVtLFxuICAgICAgICBwb2xpY3lWaW9sYXRpb25TcHksXG4gICAgICAgIHZpb2xhdGlvblJldmlld1JlcXVlc3RlZEl0ZW1TcHk7XG5cbiAgICAvLyBVc2UgdGhlIGFjY2VzcyByZXF1ZXN0IG1vZHVsZS5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShtb2RlbE1vZHVsZSkpO1xuXG4gICAgLy8gUmV0dXJuIHNwaWVzIHJhdGhlciB0aGFuIHRoZSByZWFsIGNvbnN0cnVjdG9ycyBzbyB3ZSBjYW4gbWFrZSBzdXJlIHRoZXkgd2VyZSBjYWxsZWQgd2l0aCB0aGUgY29ycmVjdCB2YWx1ZVxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgIHZpb2xhdGlvblJldmlld1JlcXVlc3RlZEl0ZW1TcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBwb2xpY3lWaW9sYXRpb25TcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICAkcHJvdmlkZS52YWx1ZSgnUG9saWN5VmlvbGF0aW9uJywgcG9saWN5VmlvbGF0aW9uU3B5KTtcbiAgICAgICAgJHByb3ZpZGUudmFsdWUoJ1Zpb2xhdGlvblJldmlld1JlcXVlc3RlZEl0ZW0nLCB2aW9sYXRpb25SZXZpZXdSZXF1ZXN0ZWRJdGVtU3B5KTtcbiAgICB9KSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW1fKSB7XG4gICAgICAgIFZpb2xhdGlvblJldmlld1dvcmtJdGVtID0gX1Zpb2xhdGlvblJldmlld1dvcmtJdGVtXztcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGlmIGNvbnN0cnVjdGVkIHdpdGhvdXQgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBuZXcgVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW0oKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwb3B1bGF0ZSB2YWx1ZXMgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiAnaWQnLFxuICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3RhcmdldElkJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgd29ya2dyb3VwOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAncmVxdWVzdGVySWQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAndGFyZ2V0TmFtZScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAndGFyZ2V0RGlzcGxheU5hbWUnLFxuICAgICAgICAgICAgICAgICAgICB3b3JrZ3JvdXA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjcmVhdGVkOiAxNDIzMDc3Mzk0Nzk5LFxuICAgICAgICAgICAgICAgIHZpb2xhdGlvbnM6IFt7dmlvbGF0aW9uOiAnZGV0YWlscyd9XSxcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRJdGVtczogW3tlbnRpdGxlbWVudFZhbHVlOiAndmFsdWUnfV0sXG4gICAgICAgICAgICAgICAgYWxsb3dSZXF1ZXN0c1dpdGhWaW9sYXRpb25zOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVWaW9sYXRpb25Db21tZW50OiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd29ya0l0ZW0gPSBuZXcgVmlvbGF0aW9uUmV2aWV3V29ya0l0ZW0oZGF0YSk7XG5cbiAgICAgICAgZXhwZWN0KHdvcmtJdGVtLmdldElkKCkpLnRvRXF1YWwoZGF0YS5pZCk7XG4gICAgICAgIGV4cGVjdCh3b3JrSXRlbS5nZXRUYXJnZXQoKS5uYW1lKS50b0VxdWFsKGRhdGEudGFyZ2V0Lm5hbWUpO1xuICAgICAgICBleHBlY3Qod29ya0l0ZW0uZ2V0UmVxdWVzdGVyKCkubmFtZSkudG9FcXVhbChkYXRhLnJlcXVlc3Rlci5uYW1lKTtcbiAgICAgICAgZXhwZWN0KHdvcmtJdGVtLmdldENyZWF0ZWQoKSkudG9FcXVhbChuZXcgRGF0ZShkYXRhLmNyZWF0ZWQpKTtcblxuICAgICAgICBleHBlY3QocG9saWN5VmlvbGF0aW9uU3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChkYXRhLnZpb2xhdGlvbnNbMF0pO1xuICAgICAgICBleHBlY3Qod29ya0l0ZW0uZ2V0VmlvbGF0aW9ucygpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KHZpb2xhdGlvblJldmlld1JlcXVlc3RlZEl0ZW1TcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGRhdGEucmVxdWVzdGVkSXRlbXNbMF0pO1xuICAgICAgICBleHBlY3Qod29ya0l0ZW0uZ2V0UmVxdWVzdGVkSXRlbXMoKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdCh3b3JrSXRlbS5oYXNWaW9sYXRpb25zKCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtJdGVtLmdldFZpb2xhdGlvbkNvdW50KCkpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdCh3b3JrSXRlbS5pc0FsbG93UmVxdWVzdHNXaXRoVmlvbGF0aW9ucygpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGV4cGVjdCh3b3JrSXRlbS5pc1JlcXVpcmVWaW9sYXRpb25Db21tZW50KCkpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
