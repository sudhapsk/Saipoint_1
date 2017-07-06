System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationCtrl', function () {

                var certificationService = undefined,
                    ctrl = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_certificationService_, $controller) {
                    certificationService = _certificationService_;
                    ctrl = $controller('CertificationListCtrl', {});
                }));

                describe('getCertifications', function () {
                    it('calls through to certificationService', function () {
                        var start = 10,
                            limit = 12;
                        spyOn(certificationService, 'getCertifications');
                        ctrl.getCertifications(start, limit);
                        expect(certificationService.getCertifications).toHaveBeenCalledWith(start, limit);
                    });
                });

                describe('getTotal', function () {
                    it('returns total from paging data', function () {
                        var total = 7;
                        ctrl.pagingData.setTotal(total);
                        expect(ctrl.getTotal()).toEqual(total);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkxpc3RDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7OztJQUdqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7O1FBRTVELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyxxQkFBcUIsWUFBTTs7Z0JBRWhDLElBQUksdUJBQW9CO29CQUFFLE9BQUk7O2dCQUU5QixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyx3QkFBd0IsYUFBZ0I7b0JBQ3ZELHVCQUF1QjtvQkFDdkIsT0FBTyxZQUFZLHlCQUF5Qjs7O2dCQUdoRCxTQUFTLHFCQUFxQixZQUFNO29CQUNoQyxHQUFHLHlDQUF5QyxZQUFNO3dCQUM5QyxJQUFJLFFBQVE7NEJBQUksUUFBUTt3QkFDeEIsTUFBTSxzQkFBc0I7d0JBQzVCLEtBQUssa0JBQWtCLE9BQU87d0JBQzlCLE9BQU8scUJBQXFCLG1CQUFtQixxQkFBcUIsT0FBTzs7OztnQkFJbkYsU0FBUyxZQUFZLFlBQU07b0JBQ3ZCLEdBQUksa0NBQWtDLFlBQU07d0JBQ3hDLElBQUksUUFBUTt3QkFDWixLQUFLLFdBQVcsU0FBUzt3QkFDekIsT0FBTyxLQUFLLFlBQVksUUFBUTs7Ozs7O0dBZXpDIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkxpc3RDdHJsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbkN0cmwnLCAoKSA9PiB7XG5cbiAgICBsZXQgY2VydGlmaWNhdGlvblNlcnZpY2UsIGN0cmw7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdCgoX2NlcnRpZmljYXRpb25TZXJ2aWNlXywgJGNvbnRyb2xsZXIpID0+IHtcbiAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UgPSBfY2VydGlmaWNhdGlvblNlcnZpY2VfO1xuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ0NlcnRpZmljYXRpb25MaXN0Q3RybCcsIHt9KTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0Q2VydGlmaWNhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdjYWxscyB0aHJvdWdoIHRvIGNlcnRpZmljYXRpb25TZXJ2aWNlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gMTAsIGxpbWl0ID0gMTI7XG4gICAgICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uU2VydmljZSwgJ2dldENlcnRpZmljYXRpb25zJyk7XG4gICAgICAgICAgICBjdHJsLmdldENlcnRpZmljYXRpb25zKHN0YXJ0LCBsaW1pdCk7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHN0YXJ0LCBsaW1pdCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFRvdGFsJywgKCkgPT4ge1xuICAgICAgICBpdCAoJ3JldHVybnMgdG90YWwgZnJvbSBwYWdpbmcgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0b3RhbCA9IDc7XG4gICAgICAgICAgICBjdHJsLnBhZ2luZ0RhdGEuc2V0VG90YWwodG90YWwpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuZ2V0VG90YWwoKSkudG9FcXVhbCh0b3RhbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
