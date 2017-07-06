System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('IdentityHistoryDialogCtrl', function () {

                var $controller = undefined,
                    identityHistoryService = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$controller_, _identityHistoryService_) {
                    $controller = _$controller_;
                    identityHistoryService = _identityHistoryService_;

                    spyOn(identityHistoryService, 'getIdentityHistory');
                }));

                function createController(certId, itemId) {
                    return $controller('IdentityHistoryDialogCtrl', {
                        identityHistoryService: identityHistoryService,
                        certId: certId,
                        itemId: itemId,
                        challenge: null
                    });
                }

                it('constructor throws if id is missing', function () {
                    expect(function () {
                        createController();
                    }).toThrow();
                });

                it('getHistoryItems() calls service', function () {
                    var certId = '12345',
                        itemId = 'abcd',
                        startIdx = 2;

                    createController(certId, itemId).getHistoryItems(startIdx);
                    expect(identityHistoryService.getIdentityHistory).toHaveBeenCalledWith(certId, itemId, startIdx, 5);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vSWRlbnRpdHlIaXN0b3J5RGlhbG9nQ3RybFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixzQ0FBc0MsVUFBVSxTQUFTOzs7OztJQUtqRzs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7O1FBRTVELFNBQVMsWUFBWTs7WUFMN0IsU0FBUyw2QkFBNkIsWUFBVzs7Z0JBRTdDLElBQUksY0FBVztvQkFBRSx5QkFBc0I7O2dCQUV2QyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxlQUFlLDBCQUEwQjtvQkFDaEUsY0FBYztvQkFDZCx5QkFBeUI7O29CQUV6QixNQUFNLHdCQUF3Qjs7O2dCQUdsQyxTQUFTLGlCQUFpQixRQUFRLFFBQVE7b0JBQ3RDLE9BQU8sWUFBWSw2QkFBNkI7d0JBQzVDLHdCQUF3Qjt3QkFDeEIsUUFBUTt3QkFDUixRQUFRO3dCQUNSLFdBQVc7Ozs7Z0JBSW5CLEdBQUcsdUNBQXVDLFlBQVc7b0JBQ2pELE9BQU8sWUFBVzt3QkFBRTt1QkFBdUI7OztnQkFHL0MsR0FBRyxtQ0FBbUMsWUFBVztvQkFDN0MsSUFBSSxTQUFTO3dCQUNULFNBQVM7d0JBQ1QsV0FBVzs7b0JBRWYsaUJBQWlCLFFBQVEsUUFBUSxnQkFBZ0I7b0JBQ2pELE9BQU8sdUJBQXVCLG9CQUFvQixxQkFBcUIsUUFBUSxRQUFRLFVBQVU7Ozs7O0dBZXRHIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vSWRlbnRpdHlIaXN0b3J5RGlhbG9nQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChjKSBDb3B5cmlnaHQgMjAxNi4gU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5cbmRlc2NyaWJlKCdJZGVudGl0eUhpc3RvcnlEaWFsb2dDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICBsZXQgJGNvbnRyb2xsZXIsIGlkZW50aXR5SGlzdG9yeVNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJGNvbnRyb2xsZXJfLCBfaWRlbnRpdHlIaXN0b3J5U2VydmljZV8pIHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgICAgICBpZGVudGl0eUhpc3RvcnlTZXJ2aWNlID0gX2lkZW50aXR5SGlzdG9yeVNlcnZpY2VfO1xuXG4gICAgICAgIHNweU9uKGlkZW50aXR5SGlzdG9yeVNlcnZpY2UsICdnZXRJZGVudGl0eUhpc3RvcnknKTtcbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGNlcnRJZCwgaXRlbUlkKSB7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignSWRlbnRpdHlIaXN0b3J5RGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgIGlkZW50aXR5SGlzdG9yeVNlcnZpY2U6IGlkZW50aXR5SGlzdG9yeVNlcnZpY2UsXG4gICAgICAgICAgICBjZXJ0SWQ6IGNlcnRJZCxcbiAgICAgICAgICAgIGl0ZW1JZDogaXRlbUlkLFxuICAgICAgICAgICAgY2hhbGxlbmdlOiBudWxsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGl0KCdjb25zdHJ1Y3RvciB0aHJvd3MgaWYgaWQgaXMgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGNyZWF0ZUNvbnRyb2xsZXIoKTsgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2dldEhpc3RvcnlJdGVtcygpIGNhbGxzIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGNlcnRJZCA9ICcxMjM0NScsXG4gICAgICAgICAgICBpdGVtSWQgPSAnYWJjZCcsXG4gICAgICAgICAgICBzdGFydElkeCA9IDI7XG5cbiAgICAgICAgY3JlYXRlQ29udHJvbGxlcihjZXJ0SWQsIGl0ZW1JZCkuZ2V0SGlzdG9yeUl0ZW1zKHN0YXJ0SWR4KTtcbiAgICAgICAgZXhwZWN0KGlkZW50aXR5SGlzdG9yeVNlcnZpY2UuZ2V0SWRlbnRpdHlIaXN0b3J5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjZXJ0SWQsIGl0ZW1JZCwgc3RhcnRJZHgsIDUpO1xuICAgIH0pO1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
