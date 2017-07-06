System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('certificationItemDetailService', function () {
                var certificationItemDetailService = undefined,
                    certificationService = undefined,
                    roleDetailDialogService = undefined,
                    accountDetailDialogService = undefined,
                    managedAttributeService = undefined,
                    managedAttributeDialogService = undefined,
                    spModal = undefined,
                    $q = undefined,
                    item = undefined,
                    certId = undefined;

                beforeEach(module(certificationModule, testModule));

                /* jshint maxparams: 9 */
                beforeEach(inject(function (_certificationItemDetailService_, _certificationService_, _roleDetailDialogService_, _accountDetailDialogService_, _managedAttributeService_, _managedAttributeDialogService_, CertificationItem, _spModal_, _$q_) {
                    certificationItemDetailService = _certificationItemDetailService_;
                    certificationService = _certificationService_;
                    roleDetailDialogService = _roleDetailDialogService_;
                    accountDetailDialogService = _accountDetailDialogService_;
                    managedAttributeService = _managedAttributeService_;
                    managedAttributeDialogService = _managedAttributeDialogService_;
                    spModal = _spModal_;
                    $q = _$q_;

                    item = new CertificationItem({
                        id: 'certItem1'
                    });
                    certId = 'cert1';
                }));

                describe('showDetailDialog()', function () {
                    it('throws without certificationId', function () {
                        expect(function () {
                            return certificationItemDetailService.showDetailDialog(undefined, item);
                        }).toThrow();
                    });

                    it('throws without certificationItem', function () {
                        expect(function () {
                            return certificationItemDetailService.showDetailDialog(certId, undefined);
                        }).toThrow();
                    });

                    it('shows policy violation detail dialog for policy violation item', function () {
                        spyOn(spModal, 'open');
                        spyOn(item, 'isPolicyViolation').and.returnValue(true);
                        certificationItemDetailService.showDetailDialog(certId, item);

                        expect(spModal.open).toHaveBeenCalled();
                        var args = spModal.open.calls.mostRecent().args[0];
                        expect(args.resolve.policyViolation).toBeDefined();
                    });

                    it('shows role detail dialog for role item', function () {
                        spyOn(roleDetailDialogService, 'showDialog');
                        spyOn(certificationService, 'getRoleDetails').and.returnValue($q.when({}));
                        spyOn(certificationService, 'getRoleEntitlementDetailsUrl');

                        spyOn(item, 'isRole').and.returnValue(true);
                        certificationItemDetailService.showDetailDialog(certId, item);

                        expect(roleDetailDialogService.showDialog).toHaveBeenCalled();
                        var args = roleDetailDialogService.showDialog.calls.mostRecent().args;
                        expect(args.length).toEqual(3);
                        var urlFunc = args[2];
                        expect(angular.isFunction(urlFunc)).toEqual(true);
                        urlFunc('ma1');
                        expect(certificationService.getRoleEntitlementDetailsUrl).toHaveBeenCalledWith(certId, item.id, 'ma1');
                    });

                    it('shows managed attribute detail dialog for exception item', function () {
                        var managedAttributeDetail = {
                            id: 'xyx'
                        },
                            url = 'some/url';
                        spyOn(managedAttributeDialogService, 'showDialog');
                        spyOn(certificationService, 'getEntitlementDetailsUrl').and.returnValue(url);
                        spyOn(managedAttributeService, 'getEntitlementDetails').and.callFake(function () {
                            return managedAttributeDetail;
                        });

                        spyOn(item, 'isGroupAttributeException').and.returnValue(true);
                        certificationItemDetailService.showDetailDialog(certId, item);

                        expect(certificationService.getEntitlementDetailsUrl).toHaveBeenCalledWith(certId, item.id);
                        expect(managedAttributeService.getEntitlementDetails).toHaveBeenCalledWith(url);
                        expect(managedAttributeDialogService.showDialog).toHaveBeenCalledWith(managedAttributeDetail, url);
                    });

                    it('throws for unsupported type', function () {
                        spyOn(item, 'isPolicyViolation').and.returnValue(false);
                        spyOn(item, 'isRole').and.returnValue(false);
                        spyOn(item, 'isException').and.returnValue(false);
                        expect(function () {
                            return certificationItemDetailService.showDetailDialog(certId, item);
                        }).toThrow();
                    });
                });

                describe('hasDetails()', function () {
                    it('throws without certificationItem', function () {
                        expect(function () {
                            return certificationItemDetailService.hasDetails();
                        }).toThrow();
                    });

                    it('returns true for policy violation', function () {
                        spyOn(item, 'isPolicyViolation').and.returnValue(true);
                        expect(certificationItemDetailService.hasDetails(item)).toEqual(true);
                    });

                    it('returns true for role', function () {
                        spyOn(item, 'isRole').and.returnValue(true);
                        expect(certificationItemDetailService.hasDetails(item)).toEqual(true);
                    });

                    it('returns true for group attribute', function () {
                        spyOn(item, 'isGroupAttributeException').and.returnValue(true);
                        expect(certificationItemDetailService.hasDetails(item)).toEqual(true);
                    });

                    it('returns false for others', function () {
                        spyOn(item, 'isRole').and.returnValue(false);
                        spyOn(item, 'isPolicyViolation').and.returnValue(false);
                        spyOn(item, 'isGroupAttributeException').and.returnValue(false);
                        expect(certificationItemDetailService.hasDetails(item)).toEqual(false);
                    });

                    it('returns false if noGroupAttributeException is true and item is group attribute', function () {
                        spyOn(item, 'isGroupAttributeException').and.returnValue(true);
                        expect(certificationItemDetailService.hasDetails(item, true)).toEqual(false);
                    });
                });

                describe('showAccountDetailDialog()', function () {
                    it('throws without certificationId', function () {
                        expect(function () {
                            return certificationItemDetailService.showAccountDetailDialog(undefined, item);
                        }).toThrow();
                    });

                    it('throws without certificationItem', function () {
                        expect(function () {
                            return certificationItemDetailService.showAccountDetailDialog(certId, undefined);
                        }).toThrow();
                    });

                    it('shows account detail dialog', function () {
                        spyOn(accountDetailDialogService, 'showDialog');
                        spyOn(certificationService, 'getAccountDetails').and.returnValue($q.when({}));
                        spyOn(certificationService, 'getAccountEntitlementDetailsUrl');

                        certificationItemDetailService.showAccountDetailDialog(certId, item);
                        expect(accountDetailDialogService.showDialog).toHaveBeenCalled();
                        var args = accountDetailDialogService.showDialog.calls.mostRecent().args;
                        expect(args.length).toEqual(2);
                        var urlFunc = args[1];
                        expect(angular.isFunction(urlFunc)).toEqual(true);
                        urlFunc('ma1');
                        expect(certificationService.getAccountEntitlementDetailsUrl).toHaveBeenCalledWith(certId, item.id, 'ma1');
                    });
                });

                describe('hasAccountDetails()', function () {
                    it('throws without certificationItem', function () {
                        expect(function () {
                            return certificationItemDetailService.hasAccountDetails();
                        }).toThrow();
                    });

                    it('returns true for exception item', function () {
                        spyOn(item, 'isException').and.returnValue(true);
                        expect(certificationItemDetailService.hasAccountDetails(item)).toEqual(true);
                    });

                    it('returns false for exceptions on the IdentityIQ application', function () {
                        spyOn(item, 'isException').and.returnValue(true);
                        item.application = 'IdentityIQ';
                        expect(certificationItemDetailService.hasAccountDetails(item)).toEqual(false);
                    });

                    it('returns true for account item', function () {
                        spyOn(item, 'isAccount').and.returnValue(true);
                        expect(certificationItemDetailService.hasAccountDetails(item)).toEqual(true);
                    });

                    it('returns false for other items', function () {
                        spyOn(item, 'isException').and.returnValue(false);
                        spyOn(item, 'isAccount').and.returnValue(false);
                        expect(certificationItemDetailService.hasAccountDetails(item)).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyx1QkFBdUIsVUFBVSxTQUFTOztJQUV2SDs7SUFFQSxJQUFJLHFCQUFxQjtJQUN6QixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQU43QixTQUFTLGtDQUFrQyxZQUFNO2dCQUM3QyxJQUFJLGlDQUE4QjtvQkFBRSx1QkFBb0I7b0JBQUUsMEJBQXVCO29CQUFFLDZCQUEwQjtvQkFDekcsMEJBQXVCO29CQUFFLGdDQUE2QjtvQkFBRSxVQUFPO29CQUFFLEtBQUU7b0JBQUUsT0FBSTtvQkFBRSxTQUFNOztnQkFFckYsV0FBVyxPQUFPLHFCQUFxQjs7O2dCQUd2QyxXQUFXLE9BQU8sVUFBQyxrQ0FBa0Msd0JBQXdCLDJCQUMxRCw4QkFBOEIsMkJBQTJCLGlDQUN6RCxtQkFBbUIsV0FBVyxNQUFTO29CQUN0RCxpQ0FBaUM7b0JBQ2pDLHVCQUF1QjtvQkFDdkIsMEJBQTBCO29CQUMxQiw2QkFBNkI7b0JBQzdCLDBCQUEwQjtvQkFDMUIsZ0NBQWdDO29CQUNoQyxVQUFVO29CQUNWLEtBQUs7O29CQUVMLE9BQU8sSUFBSSxrQkFBa0I7d0JBQ3pCLElBQUk7O29CQUVSLFNBQVM7OztnQkFHYixTQUFTLHNCQUFzQixZQUFNO29CQUNqQyxHQUFHLGtDQUFrQyxZQUFNO3dCQUN2QyxPQUFPLFlBQUE7NEJBZVMsT0FmSCwrQkFBK0IsaUJBQWlCLFdBQVc7MkJBQU87OztvQkFHbkYsR0FBRyxvQ0FBb0MsWUFBTTt3QkFDekMsT0FBTyxZQUFBOzRCQWlCUyxPQWpCSCwrQkFBK0IsaUJBQWlCLFFBQVE7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TSxNQUFNLGVBQWUsSUFBSSxZQUFZO3dCQUMzQyxNQUFNLE1BQU0sYUFBYSxJQUFJLFlBQVk7d0JBQ3pDLE9BQU8sK0JBQStCLGtCQUFrQixPQUFPLFFBQVE7Ozs7OztHQW9DaEYiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcblxuZGVzY3JpYmUoJ2NlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZScsICgpID0+IHtcbiAgICBsZXQgY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLCBjZXJ0aWZpY2F0aW9uU2VydmljZSwgcm9sZURldGFpbERpYWxvZ1NlcnZpY2UsIGFjY291bnREZXRhaWxEaWFsb2dTZXJ2aWNlLFxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlU2VydmljZSwgbWFuYWdlZEF0dHJpYnV0ZURpYWxvZ1NlcnZpY2UsIHNwTW9kYWwsICRxLCBpdGVtLCBjZXJ0SWQ7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlLCB0ZXN0TW9kdWxlKSk7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiA5ICovXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9jZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2VfLCBfY2VydGlmaWNhdGlvblNlcnZpY2VfLCBfcm9sZURldGFpbERpYWxvZ1NlcnZpY2VfLFxuICAgICAgICAgICAgICAgICAgICAgICBfYWNjb3VudERldGFpbERpYWxvZ1NlcnZpY2VfLCBfbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2VfLCBfbWFuYWdlZEF0dHJpYnV0ZURpYWxvZ1NlcnZpY2VfLFxuICAgICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpY2F0aW9uSXRlbSwgX3NwTW9kYWxfLCBfJHFfKSA9PiB7XG4gICAgICAgIGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2VfO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uU2VydmljZV87XG4gICAgICAgIHJvbGVEZXRhaWxEaWFsb2dTZXJ2aWNlID0gX3JvbGVEZXRhaWxEaWFsb2dTZXJ2aWNlXztcbiAgICAgICAgYWNjb3VudERldGFpbERpYWxvZ1NlcnZpY2UgPSBfYWNjb3VudERldGFpbERpYWxvZ1NlcnZpY2VfO1xuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlU2VydmljZSA9IF9tYW5hZ2VkQXR0cmlidXRlU2VydmljZV87XG4gICAgICAgIG1hbmFnZWRBdHRyaWJ1dGVEaWFsb2dTZXJ2aWNlID0gX21hbmFnZWRBdHRyaWJ1dGVEaWFsb2dTZXJ2aWNlXztcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcbiAgICAgICAgJHEgPSBfJHFfO1xuXG4gICAgICAgIGl0ZW0gPSBuZXcgQ2VydGlmaWNhdGlvbkl0ZW0oe1xuICAgICAgICAgICAgaWQ6ICdjZXJ0SXRlbTEnXG4gICAgICAgIH0pO1xuICAgICAgICBjZXJ0SWQgPSAnY2VydDEnO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdzaG93RGV0YWlsRGlhbG9nKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBjZXJ0aWZpY2F0aW9uSWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dEZXRhaWxEaWFsb2codW5kZWZpbmVkLCBpdGVtKSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgY2VydGlmaWNhdGlvbkl0ZW0nLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dEZXRhaWxEaWFsb2coY2VydElkLCB1bmRlZmluZWQpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG93cyBwb2xpY3kgdmlvbGF0aW9uIGRldGFpbCBkaWFsb2cgZm9yIHBvbGljeSB2aW9sYXRpb24gaXRlbScsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNQb2xpY3lWaW9sYXRpb24nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2Uuc2hvd0RldGFpbERpYWxvZyhjZXJ0SWQsIGl0ZW0pO1xuXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBsZXQgYXJncyA9IHNwTW9kYWwub3Blbi5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChhcmdzLnJlc29sdmUucG9saWN5VmlvbGF0aW9uKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3Mgcm9sZSBkZXRhaWwgZGlhbG9nIGZvciByb2xlIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihyb2xlRGV0YWlsRGlhbG9nU2VydmljZSwgJ3Nob3dEaWFsb2cnKTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnZ2V0Um9sZURldGFpbHMnKS5hbmQucmV0dXJuVmFsdWUoJHEud2hlbih7fSkpO1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdnZXRSb2xlRW50aXRsZW1lbnREZXRhaWxzVXJsJyk7XG5cbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc1JvbGUnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2Uuc2hvd0RldGFpbERpYWxvZyhjZXJ0SWQsIGl0ZW0pO1xuXG4gICAgICAgICAgICBleHBlY3Qocm9sZURldGFpbERpYWxvZ1NlcnZpY2Uuc2hvd0RpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSByb2xlRGV0YWlsRGlhbG9nU2VydmljZS5zaG93RGlhbG9nLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xuICAgICAgICAgICAgZXhwZWN0KGFyZ3MubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgICAgICAgICAgbGV0IHVybEZ1bmMgPSBhcmdzWzJdO1xuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbih1cmxGdW5jKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIHVybEZ1bmMoJ21hMScpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFJvbGVFbnRpdGxlbWVudERldGFpbHNVcmwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnRJZCwgaXRlbS5pZCwgJ21hMScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvd3MgbWFuYWdlZCBhdHRyaWJ1dGUgZGV0YWlsIGRpYWxvZyBmb3IgZXhjZXB0aW9uIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbWFuYWdlZEF0dHJpYnV0ZURldGFpbCA9IHtcbiAgICAgICAgICAgICAgICBpZDogJ3h5eCdcbiAgICAgICAgICAgIH0sIHVybCA9ICdzb21lL3VybCc7XG4gICAgICAgICAgICBzcHlPbihtYW5hZ2VkQXR0cmlidXRlRGlhbG9nU2VydmljZSwgJ3Nob3dEaWFsb2cnKTtcbiAgICAgICAgICAgIHNweU9uKGNlcnRpZmljYXRpb25TZXJ2aWNlLCAnZ2V0RW50aXRsZW1lbnREZXRhaWxzVXJsJykuYW5kLnJldHVyblZhbHVlKHVybCk7XG4gICAgICAgICAgICBzcHlPbihtYW5hZ2VkQXR0cmlidXRlU2VydmljZSwgJ2dldEVudGl0bGVtZW50RGV0YWlscycpLmFuZC5jYWxsRmFrZSgoKSA9PiBtYW5hZ2VkQXR0cmlidXRlRGV0YWlsICk7XG5cbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc0dyb3VwQXR0cmlidXRlRXhjZXB0aW9uJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dEZXRhaWxEaWFsb2coY2VydElkLCBpdGVtKTtcblxuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldEVudGl0bGVtZW50RGV0YWlsc1VybCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoY2VydElkLCBpdGVtLmlkKTtcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlU2VydmljZS5nZXRFbnRpdGxlbWVudERldGFpbHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHVybCk7XG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZURpYWxvZ1NlcnZpY2Uuc2hvd0RpYWxvZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICAgICAgbWFuYWdlZEF0dHJpYnV0ZURldGFpbCwgdXJsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyBmb3IgdW5zdXBwb3J0ZWQgdHlwZScsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc1BvbGljeVZpb2xhdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNSb2xlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc0V4Y2VwdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dEZXRhaWxEaWFsb2coY2VydElkLCBpdGVtKSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdoYXNEZXRhaWxzKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBjZXJ0aWZpY2F0aW9uSXRlbScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzRGV0YWlscygpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIHBvbGljeSB2aW9sYXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNQb2xpY3lWaW9sYXRpb24nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLmhhc0RldGFpbHMoaXRlbSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNSb2xlJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZS5oYXNEZXRhaWxzKGl0ZW0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBncm91cCBhdHRyaWJ1dGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNHcm91cEF0dHJpYnV0ZUV4Y2VwdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzRGV0YWlscyhpdGVtKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgZm9yIG90aGVycycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc1JvbGUnKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgc3B5T24oaXRlbSwgJ2lzUG9saWN5VmlvbGF0aW9uJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc0dyb3VwQXR0cmlidXRlRXhjZXB0aW9uJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzRGV0YWlscyhpdGVtKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5vR3JvdXBBdHRyaWJ1dGVFeGNlcHRpb24gaXMgdHJ1ZSBhbmQgaXRlbSBpcyBncm91cCBhdHRyaWJ1dGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNHcm91cEF0dHJpYnV0ZUV4Y2VwdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzRGV0YWlscyhpdGVtLCB0cnVlKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Nob3dBY2NvdW50RGV0YWlsRGlhbG9nKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBjZXJ0aWZpY2F0aW9uSWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dBY2NvdW50RGV0YWlsRGlhbG9nKHVuZGVmaW5lZCwgaXRlbSkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyB3aXRob3V0IGNlcnRpZmljYXRpb25JdGVtJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNlcnRpZmljYXRpb25JdGVtRGV0YWlsU2VydmljZS5zaG93QWNjb3VudERldGFpbERpYWxvZyhjZXJ0SWQsIHVuZGVmaW5lZCkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3dzIGFjY291bnQgZGV0YWlsIGRpYWxvZycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGFjY291bnREZXRhaWxEaWFsb2dTZXJ2aWNlLCAnc2hvd0RpYWxvZycpO1xuICAgICAgICAgICAgc3B5T24oY2VydGlmaWNhdGlvblNlcnZpY2UsICdnZXRBY2NvdW50RGV0YWlscycpLmFuZC5yZXR1cm5WYWx1ZSgkcS53aGVuKHt9KSk7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ2dldEFjY291bnRFbnRpdGxlbWVudERldGFpbHNVcmwnKTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLnNob3dBY2NvdW50RGV0YWlsRGlhbG9nKGNlcnRJZCwgaXRlbSk7XG4gICAgICAgICAgICBleHBlY3QoYWNjb3VudERldGFpbERpYWxvZ1NlcnZpY2Uuc2hvd0RpYWxvZykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSBhY2NvdW50RGV0YWlsRGlhbG9nU2VydmljZS5zaG93RGlhbG9nLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzO1xuICAgICAgICAgICAgZXhwZWN0KGFyZ3MubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgbGV0IHVybEZ1bmMgPSBhcmdzWzFdO1xuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbih1cmxGdW5jKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIHVybEZ1bmMoJ21hMScpO1xuICAgICAgICAgICAgZXhwZWN0KGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldEFjY291bnRFbnRpdGxlbWVudERldGFpbHNVcmwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGNlcnRJZCwgaXRlbS5pZCwgJ21hMScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdoYXNBY2NvdW50RGV0YWlscygpJywgKCkgPT4ge1xuICAgICAgICBpdCgndGhyb3dzIHdpdGhvdXQgY2VydGlmaWNhdGlvbkl0ZW0nLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLmhhc0FjY291bnREZXRhaWxzKCkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgZXhjZXB0aW9uIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNFeGNlcHRpb24nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLmhhc0FjY291bnREZXRhaWxzKGl0ZW0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgZXhjZXB0aW9ucyBvbiB0aGUgSWRlbnRpdHlJUSBhcHBsaWNhdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc0V4Y2VwdGlvbicpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSAnSWRlbnRpdHlJUSc7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvbkl0ZW1EZXRhaWxTZXJ2aWNlLmhhc0FjY291bnREZXRhaWxzKGl0ZW0pKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYWNjb3VudCBpdGVtJywgKCkgPT4ge1xuICAgICAgICAgICAgc3B5T24oaXRlbSwgJ2lzQWNjb3VudCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzQWNjb3VudERldGFpbHMoaXRlbSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBvdGhlciBpdGVtcycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGl0ZW0sICdpc0V4Y2VwdGlvbicpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBzcHlPbihpdGVtLCAnaXNBY2NvdW50JykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZXJ0aWZpY2F0aW9uSXRlbURldGFpbFNlcnZpY2UuaGFzQWNjb3VudERldGFpbHMoaXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
