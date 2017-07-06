System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}],
        execute: function () {

            describe('CertificationEntity', function () {

                var CertificationEntity = undefined,
                    certificationTestData = undefined,
                    CertificationItemStatusCount = undefined,
                    Scorecard = undefined,
                    IdentityDifference = undefined;

                // Use the module.
                beforeEach(module(certificationModule));

                beforeEach(inject(function (_CertificationEntity_, _CertificationItemStatusCount_, _Scorecard_, _IdentityDifference_, _certificationTestData_) {
                    CertificationEntity = _CertificationEntity_;
                    CertificationItemStatusCount = _CertificationItemStatusCount_;
                    Scorecard = _Scorecard_;
                    IdentityDifference = _IdentityDifference_;
                    certificationTestData = _certificationTestData_;
                }));

                describe('init', function () {
                    it('should initialize with provided data', function () {
                        var data = angular.copy(certificationTestData.CERTIFICATION_ENTITY_LIST_RESULT.objects[0]),
                            test = undefined;

                        data.itemStatusCount = {
                            Bundle: {
                                Open: 10
                            }
                        };

                        data.differences = { i: 'am a difference' };
                        data.scorecard = { i: 'am a scorecard' };

                        test = new CertificationEntity(data);
                        expect(test.id).toEqual(data.id);
                        expect(test.targetDisplayName).toEqual(data.targetDisplayName);
                        expect(test.itemStatusCount).toEqual(new CertificationItemStatusCount(data.itemStatusCount));
                        expect(test.differences instanceof IdentityDifference).toEqual(true);
                        expect(test.scorecard instanceof Scorecard).toEqual(true);
                        expect(test.delegation).toEqual(data.delegation);
                        expect(test.isEntityDelegated()).toEqual(true);
                    });

                    it('should throw with no config data', function () {
                        expect(function () {
                            new CertificationEntity();
                        }).toThrow();
                    });

                    it('should throw with missing id', function () {
                        var data = certificationTestData.CERTIFICATION_ENTITY_LIST_RESULT.objects[0];
                        delete data.id;
                        expect(function () {
                            new CertificationEntity(data);
                        }).toThrow();
                    });

                    it('should throw with missing targetDisplayName', function () {
                        var data = certificationTestData.CERTIFICATION_ENTITY_LIST_RESULT.objects[0];
                        delete data.targetDisplayName;
                        expect(function () {
                            new CertificationEntity(data);
                        }).toThrow();
                    });
                });

                describe('isComplete()', function () {
                    var entity = undefined,
                        total = undefined,
                        completeCount = undefined;

                    beforeEach(function () {
                        var data = certificationTestData.CERTIFICATION_ENTITY_LIST_RESULT.objects[0];
                        entity = new CertificationEntity(data);

                        total = 10;

                        // Mock the item status count methods that are used by isComplete().
                        entity.itemStatusCount = {
                            getCountForStatus: jasmine.createSpy().and.callFake(function () {
                                return completeCount;
                            }),
                            getTotalCount: jasmine.createSpy().and.callFake(function () {
                                return total;
                            })
                        };
                    });

                    it('returns true if all items are complete', function () {
                        completeCount = total;
                        expect(entity.isComplete()).toEqual(true);
                    });

                    it('returns false if not all items are complete', function () {
                        completeCount = total - 1;
                        expect(entity.isComplete()).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvbkVudGl0eVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsZ0RBQWdELFVBQVUsU0FBUzs7O0lBR2hKOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLDJDQUEyQztRQUN4RCxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsdUJBQXVCLFlBQVc7O2dCQUV2QyxJQUFJLHNCQUFtQjtvQkFBRSx3QkFBcUI7b0JBQUUsK0JBQTRCO29CQUFFLFlBQVM7b0JBQUUscUJBQWtCOzs7Z0JBRzNHLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLHVCQUF1QixnQ0FBZ0MsYUFBYSxzQkFDcEUseUJBQXlCO29CQUNoRCxzQkFBc0I7b0JBQ3RCLCtCQUErQjtvQkFDL0IsWUFBWTtvQkFDWixxQkFBcUI7b0JBQ3JCLHdCQUF3Qjs7O2dCQUc1QixTQUFTLFFBQVEsWUFBVztvQkFDeEIsR0FBRyx3Q0FBd0MsWUFBVzt3QkFDbEQsSUFBSSxPQUFPLFFBQVEsS0FBSyxzQkFBc0IsaUNBQWlDLFFBQVE7NEJBQ25GLE9BQUk7O3dCQUVSLEtBQUssa0JBQWtCOzRCQUNuQixRQUFRO2dDQUNKLE1BQU07Ozs7d0JBSWQsS0FBSyxjQUFjLEVBQUUsR0FBRzt3QkFDeEIsS0FBSyxZQUFZLEVBQUUsR0FBRzs7d0JBRXRCLE9BQU8sSUFBSSxvQkFBb0I7d0JBQy9CLE9BQU8sS0FBSyxJQUFJLFFBQVEsS0FBSzt3QkFDN0IsT0FBTyxLQUFLLG1CQUFtQixRQUFRLEtBQUs7d0JBQzVDLE9BQU8sS0FBSyxpQkFBaUIsUUFBUSxJQUFJLDZCQUE2QixLQUFLO3dCQUMzRSxPQUFPLEtBQUssdUJBQXVCLG9CQUFvQixRQUFRO3dCQUMvRCxPQUFPLEtBQUsscUJBQXFCLFdBQVcsUUFBUTt3QkFDcEQsT0FBTyxLQUFLLFlBQVksUUFBUSxLQUFLO3dCQUNyQyxPQUFPLEtBQUsscUJBQXFCLFFBQVE7OztvQkFHN0MsR0FBRyxvQ0FBb0MsWUFBVzt3QkFDOUMsT0FBTyxZQUFXOzRCQUNkLElBQUk7MkJBQ0w7OztvQkFHUCxHQUFHLGdDQUFnQyxZQUFXO3dCQUMxQyxJQUFJLE9BQU8sc0JBQXNCLGlDQUFpQyxRQUFRO3dCQUMxRSxPQUFPLEtBQUs7d0JBQ1osT0FBTyxZQUFXOzRCQUNkLElBQUksb0JBQW9COzJCQUN6Qjs7O29CQUdQLEdBQUcsK0NBQStDLFlBQVc7d0JBQ3pELElBQUksT0FBTyxzQkFBc0IsaUNBQWlDLFFBQVE7d0JBQzFFLE9BQU8sS0FBSzt3QkFDWixPQUFPLFlBQVc7NEJBQ2QsSUFBSSxvQkFBb0I7MkJBQ3pCOzs7O2dCQUlYLFNBQVMsZ0JBQWdCLFlBQU07b0JBQzNCLElBQUksU0FBTTt3QkFBRSxRQUFLO3dCQUFFLGdCQUFhOztvQkFFaEMsV0FBVyxZQUFNO3dCQUNiLElBQUksT0FBTyxzQkFBc0IsaUNBQWlDLFFBQVE7d0JBQzFFLFNBQVMsSUFBSSxvQkFBb0I7O3dCQUVqQyxRQUFROzs7d0JBR1IsT0FBTyxrQkFBa0I7NEJBQ3JCLG1CQUFtQixRQUFRLFlBQVksSUFBSSxTQUFTLFlBQUE7Z0NBWXBDLE9BWjBDOzs0QkFDMUQsZUFBZSxRQUFRLFlBQVksSUFBSSxTQUFTLFlBQUE7Z0NBY2hDLE9BZHNDOzs7OztvQkFJOUQsR0FBRywwQ0FBMEMsWUFBTTt3QkFDL0MsZ0JBQWdCO3dCQUNoQixPQUFPLE9BQU8sY0FBYyxRQUFROzs7b0JBR3hDLEdBQUcsK0NBQStDLFlBQU07d0JBQ3BELGdCQUFnQixRQUFRO3dCQUN4QixPQUFPLE9BQU8sY0FBYyxRQUFROzs7Ozs7R0FxQjdDIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvbkVudGl0eVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAndGVzdC9qcy9jZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25UZXN0RGF0YSc7XG5cbmRlc2NyaWJlKCdDZXJ0aWZpY2F0aW9uRW50aXR5JywgZnVuY3Rpb24oKSB7XG5cbiAgICBsZXQgQ2VydGlmaWNhdGlvbkVudGl0eSwgY2VydGlmaWNhdGlvblRlc3REYXRhLCBDZXJ0aWZpY2F0aW9uSXRlbVN0YXR1c0NvdW50LCBTY29yZWNhcmQsIElkZW50aXR5RGlmZmVyZW5jZTtcblxuICAgIC8vIFVzZSB0aGUgbW9kdWxlLlxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9DZXJ0aWZpY2F0aW9uRW50aXR5XywgX0NlcnRpZmljYXRpb25JdGVtU3RhdHVzQ291bnRfLCBfU2NvcmVjYXJkXywgX0lkZW50aXR5RGlmZmVyZW5jZV8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NlcnRpZmljYXRpb25UZXN0RGF0YV8pIHtcbiAgICAgICAgQ2VydGlmaWNhdGlvbkVudGl0eSA9IF9DZXJ0aWZpY2F0aW9uRW50aXR5XztcbiAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW1TdGF0dXNDb3VudCA9IF9DZXJ0aWZpY2F0aW9uSXRlbVN0YXR1c0NvdW50XztcbiAgICAgICAgU2NvcmVjYXJkID0gX1Njb3JlY2FyZF87XG4gICAgICAgIElkZW50aXR5RGlmZmVyZW5jZSA9IF9JZGVudGl0eURpZmZlcmVuY2VfO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uVGVzdERhdGEgPSBfY2VydGlmaWNhdGlvblRlc3REYXRhXztcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnaW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwcm92aWRlZCBkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl9FTlRJVFlfTElTVF9SRVNVTFQub2JqZWN0c1swXSksXG4gICAgICAgICAgICAgICAgdGVzdDtcblxuICAgICAgICAgICAgZGF0YS5pdGVtU3RhdHVzQ291bnQgPSB7XG4gICAgICAgICAgICAgICAgQnVuZGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIE9wZW46IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGF0YS5kaWZmZXJlbmNlcyA9IHsgaTogJ2FtIGEgZGlmZmVyZW5jZScgfTtcbiAgICAgICAgICAgIGRhdGEuc2NvcmVjYXJkID0geyBpOiAnYW0gYSBzY29yZWNhcmQnIH07XG5cbiAgICAgICAgICAgIHRlc3QgPSBuZXcgQ2VydGlmaWNhdGlvbkVudGl0eShkYXRhKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmlkKS50b0VxdWFsKGRhdGEuaWQpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QudGFyZ2V0RGlzcGxheU5hbWUpLnRvRXF1YWwoZGF0YS50YXJnZXREaXNwbGF5TmFtZSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5pdGVtU3RhdHVzQ291bnQpLnRvRXF1YWwobmV3IENlcnRpZmljYXRpb25JdGVtU3RhdHVzQ291bnQoZGF0YS5pdGVtU3RhdHVzQ291bnQpKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmRpZmZlcmVuY2VzIGluc3RhbmNlb2YgSWRlbnRpdHlEaWZmZXJlbmNlKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc2NvcmVjYXJkIGluc3RhbmNlb2YgU2NvcmVjYXJkKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuZGVsZWdhdGlvbikudG9FcXVhbChkYXRhLmRlbGVnYXRpb24pO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuaXNFbnRpdHlEZWxlZ2F0ZWQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG5vIGNvbmZpZyBkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbmV3IENlcnRpZmljYXRpb25FbnRpdHkoKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG1pc3NpbmcgaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fRU5USVRZX0xJU1RfUkVTVUxULm9iamVjdHNbMF07XG4gICAgICAgICAgICBkZWxldGUgZGF0YS5pZDtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkVudGl0eShkYXRhKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG1pc3NpbmcgdGFyZ2V0RGlzcGxheU5hbWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fRU5USVRZX0xJU1RfUkVTVUxULm9iamVjdHNbMF07XG4gICAgICAgICAgICBkZWxldGUgZGF0YS50YXJnZXREaXNwbGF5TmFtZTtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbkVudGl0eShkYXRhKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaXNDb21wbGV0ZSgpJywgKCkgPT4ge1xuICAgICAgICBsZXQgZW50aXR5LCB0b3RhbCwgY29tcGxldGVDb3VudDtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fRU5USVRZX0xJU1RfUkVTVUxULm9iamVjdHNbMF07XG4gICAgICAgICAgICBlbnRpdHkgPSBuZXcgQ2VydGlmaWNhdGlvbkVudGl0eShkYXRhKTtcblxuICAgICAgICAgICAgdG90YWwgPSAxMDtcblxuICAgICAgICAgICAgLy8gTW9jayB0aGUgaXRlbSBzdGF0dXMgY291bnQgbWV0aG9kcyB0aGF0IGFyZSB1c2VkIGJ5IGlzQ29tcGxldGUoKS5cbiAgICAgICAgICAgIGVudGl0eS5pdGVtU3RhdHVzQ291bnQgPSB7XG4gICAgICAgICAgICAgICAgZ2V0Q291bnRGb3JTdGF0dXM6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKCgpID0+IGNvbXBsZXRlQ291bnQpLFxuICAgICAgICAgICAgICAgIGdldFRvdGFsQ291bnQ6IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKCgpID0+IHRvdGFsKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBhbGwgaXRlbXMgYXJlIGNvbXBsZXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgY29tcGxldGVDb3VudCA9IHRvdGFsO1xuICAgICAgICAgICAgZXhwZWN0KGVudGl0eS5pc0NvbXBsZXRlKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5vdCBhbGwgaXRlbXMgYXJlIGNvbXBsZXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgY29tcGxldGVDb3VudCA9IHRvdGFsIC0gMTtcbiAgICAgICAgICAgIGV4cGVjdChlbnRpdHkuaXNDb21wbGV0ZSgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
