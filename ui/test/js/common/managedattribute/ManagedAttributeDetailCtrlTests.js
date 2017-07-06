System.register(['test/js/TestInitializer', 'common/managedattribute/ManagedAttributeModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var managedAttributeModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonManagedattributeManagedAttributeModule) {
            managedAttributeModule = _commonManagedattributeManagedAttributeModule['default'];
        }],
        execute: function () {

            describe('ManagedAttributeDetailCtrl', function () {
                var $controller = undefined,
                    managedAttributeService = undefined,
                    managedAttribute = { application: 'app1', attribute: 'attr1', value: 'val1', hasInheritance: true },
                    detailResourceUrl = 'some/url';

                beforeEach(module(managedAttributeModule));

                beforeEach(inject(function (_$controller_, _managedAttributeService_) {
                    $controller = _$controller_;
                    managedAttributeService = _managedAttributeService_;
                }));

                function createController(managedAttribute, detailResourceUrl) {
                    return $controller('ManagedAttributeDetailCtrl', {
                        managedAttribute: managedAttribute,
                        detailResourceUrl: detailResourceUrl
                    });
                }

                it('blows up with no managed attribute', function () {
                    expect(function () {
                        return createController(null);
                    }).toThrow();
                });

                it('blows up with no detailResourceUrl', function () {
                    expect(function () {
                        return createController(managedAttribute, null);
                    }).toThrow();
                });

                it('stores the managedAttribute and url', function () {
                    var ctrl = createController(managedAttribute, detailResourceUrl);
                    expect(ctrl.managedAttribute).toEqual(managedAttribute);
                    expect(ctrl.detailResourceUrl).toEqual(detailResourceUrl);
                });

                describe('gets the table config', function () {
                    it('should get the member table config', function () {
                        var colConfigKey = 'uiAccountGroupMemberTableColumns',
                            ctrl = createController(managedAttribute, detailResourceUrl),
                            config = ctrl.getMembersDataTableConfig();
                        expect(config.getColumnConfigKey()).toEqual(colConfigKey);
                    });

                    it('should get the access table config', function () {
                        var colConfigKey = 'uiAccountGroupAccessTableColumns',
                            ctrl = createController(managedAttribute, detailResourceUrl),
                            config = ctrl.getAccessDataTableConfig();
                        expect(config.getColumnConfigKey()).toEqual(colConfigKey);
                    });

                    it('should get the inheritedAccess table config', function () {
                        var colConfigKey = 'uiInheritedGroupsTableColumns',
                            ctrl = createController(managedAttribute, detailResourceUrl),
                            config = ctrl.getInheritanceParentsTableConfig();
                        expect(config.getColumnConfigKey()).toEqual(colConfigKey);
                        config = ctrl.getInheritanceChildrenTableConfig();
                        expect(config.getColumnConfigKey()).toEqual(colConfigKey);
                    });
                });

                describe('getMembers()', function () {
                    it('calls managedAttributeService.getEntitlementGroupMembers with correct params', function () {
                        var startIdx = 5,
                            itemsPerPage = 10,
                            sortOrder = 'whatever',
                            ctrl = createController(managedAttribute, detailResourceUrl);
                        spyOn(managedAttributeService, 'getEntitlementGroupMembers');
                        ctrl.getMembers(startIdx, itemsPerPage, sortOrder);
                        expect(managedAttributeService.getEntitlementGroupMembers).toHaveBeenCalledWith(detailResourceUrl, startIdx, itemsPerPage, sortOrder);
                    });
                });

                describe('getAccess()', function () {
                    it('calls managedAttributeService.getEntitlementAccess with correct params', function () {
                        var startIdx = 5,
                            itemsPerPage = 10,
                            sortOrder = 'whatever',
                            ctrl = createController(managedAttribute, detailResourceUrl);
                        spyOn(managedAttributeService, 'getEntitlementAccess');
                        ctrl.getAccess(startIdx, itemsPerPage, sortOrder);
                        expect(managedAttributeService.getEntitlementAccess).toHaveBeenCalledWith(detailResourceUrl, startIdx, itemsPerPage, sortOrder);
                    });
                });

                describe('getInheritanceChildren()', function () {
                    it('calls through to managedAttributeService to get inheritance', function () {
                        var startIdx = 5,
                            itemsPerPage = 10,
                            sortOrder = 'whatever',
                            ctrl = createController(managedAttribute, detailResourceUrl);
                        spyOn(managedAttributeService, 'getEntitlementInheritanceChildren');
                        ctrl.getInheritanceChildren(startIdx, itemsPerPage, sortOrder);
                        expect(managedAttributeService.getEntitlementInheritanceChildren).toHaveBeenCalledWith(detailResourceUrl, startIdx, itemsPerPage, sortOrder);
                    });
                });

                describe('getInheritanceParents()', function () {
                    it('calls through to managedAttributeService to get inheritance', function () {
                        var startIdx = 5,
                            itemsPerPage = 10,
                            sortOrder = 'whatever',
                            ctrl = createController(managedAttribute, detailResourceUrl);
                        spyOn(managedAttributeService, 'getEntitlementInheritanceParents');
                        ctrl.getInheritanceParents(startIdx, itemsPerPage, sortOrder);
                        expect(managedAttributeService.getEntitlementInheritanceParents).toHaveBeenCalledWith(detailResourceUrl, startIdx, itemsPerPage, sortOrder);
                    });
                });

                describe('hasInheritance()', function () {
                    it('returns the hasInheritance flag from the managedAttribute', function () {
                        var ctrl = createController(managedAttribute, detailResourceUrl);
                        expect(ctrl.hasInheritance()).toEqual(managedAttribute.hasInheritance);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9tYW5hZ2VkYXR0cmlidXRlL01hbmFnZWRBdHRyaWJ1dGVEZXRhaWxDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLG1EQUFtRCxVQUFVLFNBQVM7OztJQUc5Rzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsK0NBQStDO1lBQ3JHLHlCQUF5Qiw4Q0FBOEM7O1FBRTNFLFNBQVMsWUFBWTs7WUFMN0IsU0FBUyw4QkFBOEIsWUFBTTtnQkFDekMsSUFBSSxjQUFXO29CQUFFLDBCQUF1QjtvQkFDcEMsbUJBQW1CLEVBQUMsYUFBYSxRQUFRLFdBQVcsU0FBUyxPQUFPLFFBQVEsZ0JBQWdCO29CQUM1RixvQkFBb0I7O2dCQUV4QixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxlQUFlLDJCQUE4QjtvQkFDNUQsY0FBYztvQkFDZCwwQkFBMEI7OztnQkFHOUIsU0FBUyxpQkFBaUIsa0JBQWtCLG1CQUFtQjtvQkFDM0QsT0FBTyxZQUFZLDhCQUE4Qjt3QkFDN0Msa0JBQWtCO3dCQUNsQixtQkFBbUI7Ozs7Z0JBSTNCLEdBQUcsc0NBQXNDLFlBQU07b0JBQzNDLE9BQU8sWUFBQTt3QkFTUyxPQVRILGlCQUFpQjt1QkFBTzs7O2dCQUd6QyxHQUFHLHNDQUFzQyxZQUFNO29CQUMzQyxPQUFPLFlBQUE7d0JBV1MsT0FYSCxpQkFBaUIsa0JBQWtCO3VCQUFPOzs7Z0JBRzNELEdBQUcsdUNBQXVDLFlBQU07b0JBQzVDLElBQUksT0FBTyxpQkFBaUIsa0JBQWtCO29CQUM5QyxPQUFPLEtBQUssa0JBQWtCLFFBQVE7b0JBQ3RDLE9BQU8sS0FBSyxtQkFBbUIsUUFBUTs7O2dCQUczQyxTQUFTLHlCQUF5QixZQUFXO29CQUN6QyxHQUFHLHNDQUFzQyxZQUFXO3dCQUNoRCxJQUFJLGVBQWU7NEJBQ2YsT0FBTyxpQkFBaUIsa0JBQWtCOzRCQUMxQyxTQUFTLEtBQUs7d0JBQ2xCLE9BQU8sT0FBTyxzQkFBc0IsUUFBUTs7O29CQUdoRCxHQUFHLHNDQUFzQyxZQUFXO3dCQUNoRCxJQUFJLGVBQWU7NEJBQ2YsT0FBTyxpQkFBaUIsa0JBQWtCOzRCQUMxQyxTQUFTLEtBQUs7d0JBQ2xCLE9BQU8sT0FBTyxzQkFBc0IsUUFBUTs7O29CQUdoRCxHQUFHLCtDQUErQyxZQUFXO3dCQUN6RCxJQUFJLGVBQWU7NEJBQ2YsT0FBTyxpQkFBaUIsa0JBQWtCOzRCQUMxQyxTQUFTLEtBQUs7d0JBQ2xCLE9BQU8sT0FBTyxzQkFBc0IsUUFBUTt3QkFDNUMsU0FBUyxLQUFLO3dCQUNkLE9BQU8sT0FBTyxzQkFBc0IsUUFBUTs7OztnQkFJcEQsU0FBUyxnQkFBZ0IsWUFBTTtvQkFDM0IsR0FBRyxnRkFBZ0YsWUFBTTt3QkFDckYsSUFBSSxXQUFXOzRCQUNYLGVBQWU7NEJBQ2YsWUFBWTs0QkFDWixPQUFPLGlCQUFpQixrQkFBa0I7d0JBQzlDLE1BQU0seUJBQXlCO3dCQUMvQixLQUFLLFdBQVcsVUFBVSxjQUFjO3dCQUN4QyxPQUFPLHdCQUF3Qiw0QkFDMUIscUJBQXFCLG1CQUFtQixVQUFVLGNBQWM7Ozs7Z0JBSTdFLFNBQVMsZUFBZSxZQUFNO29CQUMxQixHQUFHLDBFQUEwRSxZQUFNO3dCQUMvRSxJQUFJLFdBQVc7NEJBQ1gsZUFBZTs0QkFDZixZQUFZOzRCQUNaLE9BQU8saUJBQWlCLGtCQUFrQjt3QkFDOUMsTUFBTSx5QkFBeUI7d0JBQy9CLEtBQUssVUFBVSxVQUFVLGNBQWM7d0JBQ3ZDLE9BQU8sd0JBQXdCLHNCQUMxQixxQkFBcUIsbUJBQW1CLFVBQVUsY0FBYzs7OztnQkFJN0UsU0FBUyw0QkFBNEIsWUFBTTtvQkFDdkMsR0FBRywrREFBK0QsWUFBTTt3QkFDcEUsSUFBSSxXQUFXOzRCQUNYLGVBQWU7NEJBQ2YsWUFBWTs0QkFDWixPQUFPLGlCQUFpQixrQkFBa0I7d0JBQzlDLE1BQU0seUJBQXlCO3dCQUMvQixLQUFLLHVCQUF1QixVQUFVLGNBQWM7d0JBQ3BELE9BQU8sd0JBQXdCLG1DQUMxQixxQkFBcUIsbUJBQW1CLFVBQVUsY0FBYzs7OztnQkFJN0UsU0FBUywyQkFBMkIsWUFBTTtvQkFDdEMsR0FBRywrREFBK0QsWUFBTTt3QkFDcEUsSUFBSSxXQUFXOzRCQUNYLGVBQWU7NEJBQ2YsWUFBWTs0QkFDWixPQUFPLGlCQUFpQixrQkFBa0I7d0JBQzlDLE1BQU0seUJBQXlCO3dCQUMvQixLQUFLLHNCQUFzQixVQUFVLGNBQWM7d0JBQ25ELE9BQU8sd0JBQXdCLGtDQUMxQixxQkFBcUIsbUJBQW1CLFVBQVUsY0FBYzs7OztnQkFJN0UsU0FBUyxvQkFBb0IsWUFBTTtvQkFDL0IsR0FBRyw2REFBNkQsWUFBTTt3QkFDbEUsSUFBSSxPQUFPLGlCQUFpQixrQkFBa0I7d0JBQzlDLE9BQU8sS0FBSyxrQkFBa0IsUUFBUSxpQkFBaUI7Ozs7OztHQWNoRSIsImZpbGUiOiJjb21tb24vbWFuYWdlZGF0dHJpYnV0ZS9NYW5hZ2VkQXR0cmlidXRlRGV0YWlsQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IG1hbmFnZWRBdHRyaWJ1dGVNb2R1bGUgZnJvbSAnY29tbW9uL21hbmFnZWRhdHRyaWJ1dGUvTWFuYWdlZEF0dHJpYnV0ZU1vZHVsZSc7XG5cbmRlc2NyaWJlKCdNYW5hZ2VkQXR0cmlidXRlRGV0YWlsQ3RybCcsICgpID0+IHtcbiAgICBsZXQgJGNvbnRyb2xsZXIsIG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLFxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlID0ge2FwcGxpY2F0aW9uOiAnYXBwMScsIGF0dHJpYnV0ZTogJ2F0dHIxJywgdmFsdWU6ICd2YWwxJywgaGFzSW5oZXJpdGFuY2U6IHRydWV9LFxuICAgICAgICBkZXRhaWxSZXNvdXJjZVVybCA9ICdzb21lL3VybCc7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShtYW5hZ2VkQXR0cmlidXRlTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdCgoXyRjb250cm9sbGVyXywgX21hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlXykgPT4ge1xuICAgICAgICAkY29udHJvbGxlciA9IF8kY29udHJvbGxlcl87XG4gICAgICAgIG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlID0gX21hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlXztcbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIGRldGFpbFJlc291cmNlVXJsKSB7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignTWFuYWdlZEF0dHJpYnV0ZURldGFpbEN0cmwnLCB7XG4gICAgICAgICAgICBtYW5hZ2VkQXR0cmlidXRlOiBtYW5hZ2VkQXR0cmlidXRlLFxuICAgICAgICAgICAgZGV0YWlsUmVzb3VyY2VVcmw6IGRldGFpbFJlc291cmNlVXJsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGl0KCdibG93cyB1cCB3aXRoIG5vIG1hbmFnZWQgYXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoKCkgPT4gY3JlYXRlQ29udHJvbGxlcihudWxsKSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2Jsb3dzIHVwIHdpdGggbm8gZGV0YWlsUmVzb3VyY2VVcmwnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCgoKSA9PiBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIG51bGwpKS50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RvcmVzIHRoZSBtYW5hZ2VkQXR0cmlidXRlIGFuZCB1cmwnLCAoKSA9PiB7XG4gICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihtYW5hZ2VkQXR0cmlidXRlLCBkZXRhaWxSZXNvdXJjZVVybCk7XG4gICAgICAgIGV4cGVjdChjdHJsLm1hbmFnZWRBdHRyaWJ1dGUpLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZSk7XG4gICAgICAgIGV4cGVjdChjdHJsLmRldGFpbFJlc291cmNlVXJsKS50b0VxdWFsKGRldGFpbFJlc291cmNlVXJsKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRzIHRoZSB0YWJsZSBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBnZXQgdGhlIG1lbWJlciB0YWJsZSBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjb2xDb25maWdLZXkgPSAndWlBY2NvdW50R3JvdXBNZW1iZXJUYWJsZUNvbHVtbnMnLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIGRldGFpbFJlc291cmNlVXJsKSxcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjdHJsLmdldE1lbWJlcnNEYXRhVGFibGVDb25maWcoKTtcbiAgICAgICAgICAgIGV4cGVjdChjb25maWcuZ2V0Q29sdW1uQ29uZmlnS2V5KCkpLnRvRXF1YWwoY29sQ29uZmlnS2V5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBnZXQgdGhlIGFjY2VzcyB0YWJsZSBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjb2xDb25maWdLZXkgPSAndWlBY2NvdW50R3JvdXBBY2Nlc3NUYWJsZUNvbHVtbnMnLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIGRldGFpbFJlc291cmNlVXJsKSxcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjdHJsLmdldEFjY2Vzc0RhdGFUYWJsZUNvbmZpZygpO1xuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZy5nZXRDb2x1bW5Db25maWdLZXkoKSkudG9FcXVhbChjb2xDb25maWdLZXkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGdldCB0aGUgaW5oZXJpdGVkQWNjZXNzIHRhYmxlIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNvbENvbmZpZ0tleSA9ICd1aUluaGVyaXRlZEdyb3Vwc1RhYmxlQ29sdW1ucycsXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobWFuYWdlZEF0dHJpYnV0ZSwgZGV0YWlsUmVzb3VyY2VVcmwpLFxuICAgICAgICAgICAgICAgIGNvbmZpZyA9IGN0cmwuZ2V0SW5oZXJpdGFuY2VQYXJlbnRzVGFibGVDb25maWcoKTtcbiAgICAgICAgICAgIGV4cGVjdChjb25maWcuZ2V0Q29sdW1uQ29uZmlnS2V5KCkpLnRvRXF1YWwoY29sQ29uZmlnS2V5KTtcbiAgICAgICAgICAgIGNvbmZpZyA9IGN0cmwuZ2V0SW5oZXJpdGFuY2VDaGlsZHJlblRhYmxlQ29uZmlnKCk7XG4gICAgICAgICAgICBleHBlY3QoY29uZmlnLmdldENvbHVtbkNvbmZpZ0tleSgpKS50b0VxdWFsKGNvbENvbmZpZ0tleSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldE1lbWJlcnMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ2NhbGxzIG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLmdldEVudGl0bGVtZW50R3JvdXBNZW1iZXJzIHdpdGggY29ycmVjdCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RhcnRJZHggPSA1LFxuICAgICAgICAgICAgICAgIGl0ZW1zUGVyUGFnZSA9IDEwLFxuICAgICAgICAgICAgICAgIHNvcnRPcmRlciA9ICd3aGF0ZXZlcicsXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobWFuYWdlZEF0dHJpYnV0ZSwgZGV0YWlsUmVzb3VyY2VVcmwpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UsICdnZXRFbnRpdGxlbWVudEdyb3VwTWVtYmVycycpO1xuICAgICAgICAgICAgY3RybC5nZXRNZW1iZXJzKHN0YXJ0SWR4LCBpdGVtc1BlclBhZ2UsIHNvcnRPcmRlcik7XG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UuZ2V0RW50aXRsZW1lbnRHcm91cE1lbWJlcnMpXG4gICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGRldGFpbFJlc291cmNlVXJsLCBzdGFydElkeCwgaXRlbXNQZXJQYWdlLCBzb3J0T3JkZXIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRBY2Nlc3MoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ2NhbGxzIG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLmdldEVudGl0bGVtZW50QWNjZXNzIHdpdGggY29ycmVjdCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RhcnRJZHggPSA1LFxuICAgICAgICAgICAgICAgIGl0ZW1zUGVyUGFnZSA9IDEwLFxuICAgICAgICAgICAgICAgIHNvcnRPcmRlciA9ICd3aGF0ZXZlcicsXG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIobWFuYWdlZEF0dHJpYnV0ZSwgZGV0YWlsUmVzb3VyY2VVcmwpO1xuICAgICAgICAgICAgc3B5T24obWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UsICdnZXRFbnRpdGxlbWVudEFjY2VzcycpO1xuICAgICAgICAgICAgY3RybC5nZXRBY2Nlc3Moc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgc29ydE9yZGVyKTtcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlU2VydmljZS5nZXRFbnRpdGxlbWVudEFjY2VzcylcbiAgICAgICAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoZGV0YWlsUmVzb3VyY2VVcmwsIHN0YXJ0SWR4LCBpdGVtc1BlclBhZ2UsIHNvcnRPcmRlcik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEluaGVyaXRhbmNlQ2hpbGRyZW4oKScsICgpID0+IHtcbiAgICAgICAgaXQoJ2NhbGxzIHRocm91Z2ggdG8gbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UgdG8gZ2V0IGluaGVyaXRhbmNlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0YXJ0SWR4ID0gNSxcbiAgICAgICAgICAgICAgICBpdGVtc1BlclBhZ2UgPSAxMCxcbiAgICAgICAgICAgICAgICBzb3J0T3JkZXIgPSAnd2hhdGV2ZXInLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIGRldGFpbFJlc291cmNlVXJsKTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLCAnZ2V0RW50aXRsZW1lbnRJbmhlcml0YW5jZUNoaWxkcmVuJyk7XG4gICAgICAgICAgICBjdHJsLmdldEluaGVyaXRhbmNlQ2hpbGRyZW4oc3RhcnRJZHgsIGl0ZW1zUGVyUGFnZSwgc29ydE9yZGVyKTtcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlU2VydmljZS5nZXRFbnRpdGxlbWVudEluaGVyaXRhbmNlQ2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGRldGFpbFJlc291cmNlVXJsLCBzdGFydElkeCwgaXRlbXNQZXJQYWdlLCBzb3J0T3JkZXIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRJbmhlcml0YW5jZVBhcmVudHMoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ2NhbGxzIHRocm91Z2ggdG8gbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UgdG8gZ2V0IGluaGVyaXRhbmNlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0YXJ0SWR4ID0gNSxcbiAgICAgICAgICAgICAgICBpdGVtc1BlclBhZ2UgPSAxMCxcbiAgICAgICAgICAgICAgICBzb3J0T3JkZXIgPSAnd2hhdGV2ZXInLFxuICAgICAgICAgICAgICAgIGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIGRldGFpbFJlc291cmNlVXJsKTtcbiAgICAgICAgICAgIHNweU9uKG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLCAnZ2V0RW50aXRsZW1lbnRJbmhlcml0YW5jZVBhcmVudHMnKTtcbiAgICAgICAgICAgIGN0cmwuZ2V0SW5oZXJpdGFuY2VQYXJlbnRzKHN0YXJ0SWR4LCBpdGVtc1BlclBhZ2UsIHNvcnRPcmRlcik7XG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UuZ2V0RW50aXRsZW1lbnRJbmhlcml0YW5jZVBhcmVudHMpXG4gICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGRldGFpbFJlc291cmNlVXJsLCBzdGFydElkeCwgaXRlbXNQZXJQYWdlLCBzb3J0T3JkZXIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdoYXNJbmhlcml0YW5jZSgpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyB0aGUgaGFzSW5oZXJpdGFuY2UgZmxhZyBmcm9tIHRoZSBtYW5hZ2VkQXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKG1hbmFnZWRBdHRyaWJ1dGUsIGRldGFpbFJlc291cmNlVXJsKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLmhhc0luaGVyaXRhbmNlKCkpLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZS5oYXNJbmhlcml0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
