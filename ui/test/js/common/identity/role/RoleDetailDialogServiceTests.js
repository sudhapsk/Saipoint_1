System.register(['test/js/TestInitializer', 'common/identity/role/IdentityRoleModule', 'test/js/common/i18n/MockTranslateFilter'], function (_export) {
    'use strict';

    var roleModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonIdentityRoleIdentityRoleModule) {
            roleModule = _commonIdentityRoleIdentityRoleModule['default'];
        }, function (_testJsCommonI18nMockTranslateFilter) {}],
        execute: function () {

            describe('RoleDetailDialogService', function () {

                var roleDetailDialogService = undefined,
                    spModal = undefined,
                    role = undefined,
                    $rootScope = undefined,
                    managedAttributeUrlFunc = undefined,
                    managedAttributeUrl = undefined,
                    entitlement = undefined,
                    managedAttributeService = undefined,
                    managedAttributeDialogService = undefined,
                    managedAttribute = undefined;

                beforeEach(module(roleModule));

                beforeEach(inject(function (_roleDetailDialogService_, _spModal_, spTranslateFilter, _$rootScope_, _managedAttributeService_, _managedAttributeDialogService_) {
                    roleDetailDialogService = _roleDetailDialogService_;
                    spModal = _spModal_;
                    $rootScope = _$rootScope_;
                    managedAttributeDialogService = _managedAttributeDialogService_;
                    managedAttributeService = _managedAttributeService_;

                    // Mock the modal so that we can see if the title gets set.
                    var modal = {
                        setTitle: jasmine.createSpy('setTitle')
                    };
                    spyOn(spModal, 'open').and.returnValue(modal);

                    // Configure the message catalog so we can check the title message.
                    spTranslateFilter.configureCatalog({
                        'ui_role_detail_dialog_title': 'ROLE: {0}'
                    });

                    // Create a fake role to test with.
                    role = {
                        displayName: 'fubar'
                    };

                    managedAttributeUrl = 'some/url';
                    managedAttributeUrlFunc = jasmine.createSpy('managedAttributeUrlFunc').and.callFake(function () {
                        return managedAttributeUrl;
                    });
                    entitlement = { managedAttributeId: 'abcd' };
                    managedAttribute = { some: 'thing' };
                    spyOn(managedAttributeDialogService, 'showDialog');
                    spyOn(managedAttributeService, 'getEntitlementDetails').and.returnValue(managedAttribute);
                }));

                describe('show dialog', function () {
                    it('cries for mammy if no role is passed', function () {
                        expect(function () {
                            return roleDetailDialogService.showDialog(null);
                        }).toThrow();
                    });

                    it('opens a dialog for the role', function () {
                        var loadFunc = function () {
                            return 'i love cake';
                        };
                        roleDetailDialogService.showDialog(role, loadFunc, managedAttributeUrlFunc);
                        expect(spModal.open).toHaveBeenCalled();

                        var config = spModal.open.calls.mostRecent().args[0];
                        expect(config.resolve).toBeDefined();
                        expect(config.resolve.role()).toEqual(role);
                        expect(config.resolve.loadHierarchyFunction()).toEqual(loadFunc);
                    });

                    it('sets the dialog title with the role name', function () {
                        var modal = roleDetailDialogService.showDialog(role, null, managedAttributeUrlFunc);
                        $rootScope.$digest();
                        expect(modal.setTitle).toHaveBeenCalledWith('ROLE: fubar');
                    });
                });

                describe('showEntitlementDetailDialog', function () {
                    it('fetches the managed attribute and opens dialog', function () {
                        roleDetailDialogService.showEntitlementDetailDialog(managedAttributeUrlFunc, entitlement);
                        $rootScope.$apply();
                        expect(managedAttributeUrlFunc).toHaveBeenCalledWith(entitlement.managedAttributeId);
                        expect(managedAttributeService.getEntitlementDetails).toHaveBeenCalledWith(managedAttributeUrl);
                        expect(managedAttributeDialogService.showDialog).toHaveBeenCalledWith(managedAttribute, managedAttributeUrl);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9pZGVudGl0eS9yb2xlL1JvbGVEZXRhaWxEaWFsb2dTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJDQUEyQyw0Q0FBNEMsVUFBVSxTQUFTO0lBQ2xKOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx1Q0FBdUM7WUFDN0YsYUFBYSxzQ0FBc0M7V0FDcEQsVUFBVSxzQ0FBc0M7UUFDbkQsU0FBUyxZQUFZOztZQUo3QixTQUFTLDJCQUEyQixZQUFNOztnQkFFdEMsSUFBSSwwQkFBdUI7b0JBQUUsVUFBTztvQkFBRSxPQUFJO29CQUFFLGFBQVU7b0JBQUUsMEJBQXVCO29CQUFFLHNCQUFtQjtvQkFDaEcsY0FBVztvQkFBRSwwQkFBdUI7b0JBQUUsZ0NBQTZCO29CQUFFLG1CQUFnQjs7Z0JBRXpGLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLDJCQUEyQixXQUFXLG1CQUFtQixjQUN6RCwyQkFBMkIsaUNBQW9DO29CQUM5RSwwQkFBMEI7b0JBQzFCLFVBQVU7b0JBQ1YsYUFBYTtvQkFDYixnQ0FBZ0M7b0JBQ2hDLDBCQUEwQjs7O29CQUcxQixJQUFJLFFBQVE7d0JBQ1IsVUFBVSxRQUFRLFVBQVU7O29CQUVoQyxNQUFNLFNBQVMsUUFBUSxJQUFJLFlBQVk7OztvQkFHdkMsa0JBQWtCLGlCQUFpQjt3QkFDL0IsK0JBQStCOzs7O29CQUluQyxPQUFPO3dCQUNILGFBQWE7OztvQkFHakIsc0JBQXNCO29CQUN0QiwwQkFBMEIsUUFBUSxVQUFVLDJCQUEyQixJQUFJLFNBQVMsWUFBQTt3QkFjcEUsT0FkMEU7O29CQUMxRixjQUFjLEVBQUUsb0JBQW9CO29CQUNwQyxtQkFBbUIsRUFBRSxNQUFNO29CQUMzQixNQUFNLCtCQUErQjtvQkFDckMsTUFBTSx5QkFBeUIseUJBQXlCLElBQUksWUFBWTs7O2dCQUc1RSxTQUFTLGVBQWUsWUFBTTtvQkFDMUIsR0FBRyx3Q0FBd0MsWUFBTTt3QkFDN0MsT0FBTyxZQUFBOzRCQWdCUyxPQWhCSCx3QkFBd0IsV0FBVzsyQkFBTzs7O29CQUczRCxHQUFHLCtCQUErQixZQUFNO3dCQUNwQyxJQUFJLFdBQVcsWUFBQTs0QkFrQkMsT0FsQks7O3dCQUNyQix3QkFBd0IsV0FBVyxNQUFNLFVBQVU7d0JBQ25ELE9BQU8sUUFBUSxNQUFNOzt3QkFFckIsSUFBSSxTQUFTLFFBQVEsS0FBSyxNQUFNLGFBQWEsS0FBSzt3QkFDbEQsT0FBTyxPQUFPLFNBQVM7d0JBQ3ZCLE9BQU8sT0FBTyxRQUFRLFFBQVEsUUFBUTt3QkFDdEMsT0FBTyxPQUFPLFFBQVEseUJBQXlCLFFBQVE7OztvQkFHM0QsR0FBRyw0Q0FBNEMsWUFBTTt3QkFDakQsSUFBSSxRQUFRLHdCQUF3QixXQUFXLE1BQU0sTUFBTTt3QkFDM0QsV0FBVzt3QkFDWCxPQUFPLE1BQU0sVUFBVSxxQkFBcUI7Ozs7Z0JBSXBELFNBQVMsK0JBQStCLFlBQU07b0JBQzFDLEdBQUcsa0RBQWtELFlBQU07d0JBQ3ZELHdCQUF3Qiw0QkFBNEIseUJBQXlCO3dCQUM3RSxXQUFXO3dCQUNYLE9BQU8seUJBQXlCLHFCQUFxQixZQUFZO3dCQUNqRSxPQUFPLHdCQUF3Qix1QkFBdUIscUJBQXFCO3dCQUMzRSxPQUFPLDhCQUE4QixZQUNoQyxxQkFBcUIsa0JBQWtCOzs7Ozs7R0F3QnJEIiwiZmlsZSI6ImNvbW1vbi9pZGVudGl0eS9yb2xlL1JvbGVEZXRhaWxEaWFsb2dTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IHJvbGVNb2R1bGUgZnJvbSAnY29tbW9uL2lkZW50aXR5L3JvbGUvSWRlbnRpdHlSb2xlTW9kdWxlJztcclxuaW1wb3J0ICd0ZXN0L2pzL2NvbW1vbi9pMThuL01vY2tUcmFuc2xhdGVGaWx0ZXInO1xyXG5cclxuZGVzY3JpYmUoJ1JvbGVEZXRhaWxEaWFsb2dTZXJ2aWNlJywgKCkgPT4ge1xyXG5cclxuICAgIGxldCByb2xlRGV0YWlsRGlhbG9nU2VydmljZSwgc3BNb2RhbCwgcm9sZSwgJHJvb3RTY29wZSwgbWFuYWdlZEF0dHJpYnV0ZVVybEZ1bmMsIG1hbmFnZWRBdHRyaWJ1dGVVcmwsXHJcbiAgICAgICAgZW50aXRsZW1lbnQsIG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLCBtYW5hZ2VkQXR0cmlidXRlRGlhbG9nU2VydmljZSwgbWFuYWdlZEF0dHJpYnV0ZTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShyb2xlTW9kdWxlKSk7XHJcblxyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9yb2xlRGV0YWlsRGlhbG9nU2VydmljZV8sIF9zcE1vZGFsXywgc3BUcmFuc2xhdGVGaWx0ZXIsIF8kcm9vdFNjb3BlXyxcclxuICAgICAgICAgICAgICAgICAgICAgICBfbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2VfLCBfbWFuYWdlZEF0dHJpYnV0ZURpYWxvZ1NlcnZpY2VfKSA9PiB7XHJcbiAgICAgICAgcm9sZURldGFpbERpYWxvZ1NlcnZpY2UgPSBfcm9sZURldGFpbERpYWxvZ1NlcnZpY2VfO1xyXG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XHJcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcclxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlRGlhbG9nU2VydmljZSA9IF9tYW5hZ2VkQXR0cmlidXRlRGlhbG9nU2VydmljZV87XHJcbiAgICAgICAgbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UgPSBfbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2VfO1xyXG5cclxuICAgICAgICAvLyBNb2NrIHRoZSBtb2RhbCBzbyB0aGF0IHdlIGNhbiBzZWUgaWYgdGhlIHRpdGxlIGdldHMgc2V0LlxyXG4gICAgICAgIGxldCBtb2RhbCA9IHtcclxuICAgICAgICAgICAgc2V0VGl0bGU6IGphc21pbmUuY3JlYXRlU3B5KCdzZXRUaXRsZScpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpLmFuZC5yZXR1cm5WYWx1ZShtb2RhbCk7XHJcblxyXG4gICAgICAgIC8vIENvbmZpZ3VyZSB0aGUgbWVzc2FnZSBjYXRhbG9nIHNvIHdlIGNhbiBjaGVjayB0aGUgdGl0bGUgbWVzc2FnZS5cclxuICAgICAgICBzcFRyYW5zbGF0ZUZpbHRlci5jb25maWd1cmVDYXRhbG9nKHtcclxuICAgICAgICAgICAgJ3VpX3JvbGVfZGV0YWlsX2RpYWxvZ190aXRsZSc6ICdST0xFOiB7MH0nXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIGZha2Ugcm9sZSB0byB0ZXN0IHdpdGguXHJcbiAgICAgICAgcm9sZSA9IHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdmdWJhcidcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlVXJsID0gJ3NvbWUvdXJsJztcclxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlVXJsRnVuYyA9IGphc21pbmUuY3JlYXRlU3B5KCdtYW5hZ2VkQXR0cmlidXRlVXJsRnVuYycpLmFuZC5jYWxsRmFrZSgoKSA9PiBtYW5hZ2VkQXR0cmlidXRlVXJsKTtcclxuICAgICAgICBlbnRpdGxlbWVudCA9IHsgbWFuYWdlZEF0dHJpYnV0ZUlkOiAnYWJjZCcgfTtcclxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlID0geyBzb21lOiAndGhpbmcnIH07XHJcbiAgICAgICAgc3B5T24obWFuYWdlZEF0dHJpYnV0ZURpYWxvZ1NlcnZpY2UsICdzaG93RGlhbG9nJyk7XHJcbiAgICAgICAgc3B5T24obWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2UsICdnZXRFbnRpdGxlbWVudERldGFpbHMnKS5hbmQucmV0dXJuVmFsdWUobWFuYWdlZEF0dHJpYnV0ZSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3cgZGlhbG9nJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdjcmllcyBmb3IgbWFtbXkgaWYgbm8gcm9sZSBpcyBwYXNzZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiByb2xlRGV0YWlsRGlhbG9nU2VydmljZS5zaG93RGlhbG9nKG51bGwpKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdvcGVucyBhIGRpYWxvZyBmb3IgdGhlIHJvbGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsb2FkRnVuYyA9ICgpID0+ICdpIGxvdmUgY2FrZSc7XHJcbiAgICAgICAgICAgIHJvbGVEZXRhaWxEaWFsb2dTZXJ2aWNlLnNob3dEaWFsb2cocm9sZSwgbG9hZEZ1bmMsIG1hbmFnZWRBdHRyaWJ1dGVVcmxGdW5jKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNwTW9kYWwub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZy5yZXNvbHZlKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnLnJlc29sdmUucm9sZSgpKS50b0VxdWFsKHJvbGUpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnLnJlc29sdmUubG9hZEhpZXJhcmNoeUZ1bmN0aW9uKCkpLnRvRXF1YWwobG9hZEZ1bmMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2V0cyB0aGUgZGlhbG9nIHRpdGxlIHdpdGggdGhlIHJvbGUgbmFtZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1vZGFsID0gcm9sZURldGFpbERpYWxvZ1NlcnZpY2Uuc2hvd0RpYWxvZyhyb2xlLCBudWxsLCBtYW5hZ2VkQXR0cmlidXRlVXJsRnVuYyk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QobW9kYWwuc2V0VGl0bGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdST0xFOiBmdWJhcicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3Nob3dFbnRpdGxlbWVudERldGFpbERpYWxvZycsICgpID0+IHtcclxuICAgICAgICBpdCgnZmV0Y2hlcyB0aGUgbWFuYWdlZCBhdHRyaWJ1dGUgYW5kIG9wZW5zIGRpYWxvZycsICgpID0+IHtcclxuICAgICAgICAgICAgcm9sZURldGFpbERpYWxvZ1NlcnZpY2Uuc2hvd0VudGl0bGVtZW50RGV0YWlsRGlhbG9nKG1hbmFnZWRBdHRyaWJ1dGVVcmxGdW5jLCBlbnRpdGxlbWVudCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlVXJsRnVuYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZW50aXRsZW1lbnQubWFuYWdlZEF0dHJpYnV0ZUlkKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlLmdldEVudGl0bGVtZW50RGV0YWlscykudG9IYXZlQmVlbkNhbGxlZFdpdGgobWFuYWdlZEF0dHJpYnV0ZVVybCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlRGlhbG9nU2VydmljZS5zaG93RGlhbG9nKVxyXG4gICAgICAgICAgICAgICAgLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG1hbmFnZWRBdHRyaWJ1dGUsIG1hbmFnZWRBdHRyaWJ1dGVVcmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
