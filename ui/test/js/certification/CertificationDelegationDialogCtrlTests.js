System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData', 'test/js/common/i18n/MockTranslateFilter'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}, function (_testJsCommonI18nMockTranslateFilter) {}],
        execute: function () {

            describe('CertificationDelegationDialogCtrl', function () {
                var $controller = undefined,
                    item = undefined,
                    $scope = undefined,
                    $q = undefined,
                    certificationTestData = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$controller_, _certificationTestData_, _$rootScope_, _$q_) {
                    $controller = _$controller_;
                    certificationTestData = _certificationTestData_;
                    item = certificationTestData.CERT_ITEMS[0];
                    $scope = _$rootScope_;
                    $q = _$q_;
                }));

                function makeController(description, helpText, comments, recipient, readOnly) {
                    return $controller('CertificationDelegationDialogCtrl', {
                        item: item,
                        description: description,
                        $q: $q,
                        helpText: helpText,
                        comments: comments,
                        recipient: recipient,
                        readOnly: readOnly
                    });
                }

                describe('save()', function () {
                    it('delegation dialog resolves with comments', function () {
                        var ctrl = undefined,
                            promise = undefined,
                            description = 'Please certify these users',
                            comments = 'comments 1',
                            recipient = 'recipient 1',
                            helpText = 'These changes will be immediate',
                            readOnly = false;

                        ctrl = makeController(description, helpText, comments, recipient, readOnly);
                        promise = ctrl.save();
                        promise.then(function (result) {
                            expect(result).toBeDefined();
                            expect(result.comments).toEqual(comments);
                            expect(result.recipient).toEqual(recipient);
                            expect(result.description).toEqual(description);
                        });
                        $scope.$apply();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkRlbGVnYXRpb25EaWFsb2dDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQywrQ0FBK0MsNENBQTRDLFVBQVUsU0FBUzs7O0lBRzNMOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLDJDQUEyQyxJQUFJLFVBQVUsc0NBQXNDO1FBQzVHLFNBQVMsWUFBWTs7WUFIN0IsU0FBUyxxQ0FBcUMsWUFBTTtnQkFDaEQsSUFBSSxjQUFXO29CQUFFLE9BQUk7b0JBQUUsU0FBTTtvQkFBRSxLQUFFO29CQUFFLHdCQUFxQjs7Z0JBRXhELFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLGVBQWUseUJBQXlCLGNBQWMsTUFBUztvQkFDOUUsY0FBYztvQkFDZCx3QkFBd0I7b0JBQ3hCLE9BQU8sc0JBQXNCLFdBQVc7b0JBQ3hDLFNBQVM7b0JBQ1QsS0FBSzs7O2dCQUdULFNBQVMsZUFBZSxhQUFhLFVBQVUsVUFBVSxXQUFXLFVBQVU7b0JBQzFFLE9BQU8sWUFBWSxxQ0FBcUM7d0JBQ3BELE1BQU07d0JBQ04sYUFBYTt3QkFDYixJQUFJO3dCQUNKLFVBQVU7d0JBQ1YsVUFBVTt3QkFDVixXQUFXO3dCQUNYLFVBQVU7Ozs7Z0JBSWxCLFNBQVMsVUFBVSxZQUFNO29CQUNyQixHQUFHLDRDQUE0QyxZQUFNO3dCQUNqRCxJQUFJLE9BQUk7NEJBQUUsVUFBTzs0QkFDYixjQUFjOzRCQUNkLFdBQVc7NEJBQ1gsWUFBWTs0QkFDWixXQUFXOzRCQUNYLFdBQVc7O3dCQUVmLE9BQU8sZUFBZSxhQUFhLFVBQVUsVUFBVSxXQUFXO3dCQUNsRSxVQUFVLEtBQUs7d0JBQ2YsUUFBUSxLQUFLLFVBQVMsUUFBUTs0QkFDMUIsT0FBTyxRQUFROzRCQUNmLE9BQU8sT0FBTyxVQUFVLFFBQVE7NEJBQ2hDLE9BQU8sT0FBTyxXQUFXLFFBQVE7NEJBQ2pDLE9BQU8sT0FBTyxhQUFhLFFBQVE7O3dCQUV2QyxPQUFPOzs7Ozs7R0FnQmhCIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkRlbGVnYXRpb25EaWFsb2dDdHJsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICd0ZXN0L2pzL2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvblRlc3REYXRhJztcbmltcG9ydCAndGVzdC9qcy9jb21tb24vaTE4bi9Nb2NrVHJhbnNsYXRlRmlsdGVyJztcblxuZGVzY3JpYmUoJ0NlcnRpZmljYXRpb25EZWxlZ2F0aW9uRGlhbG9nQ3RybCcsICgpID0+IHtcbiAgICBsZXQgJGNvbnRyb2xsZXIsIGl0ZW0sICRzY29wZSwgJHEsIGNlcnRpZmljYXRpb25UZXN0RGF0YTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJGNvbnRyb2xsZXJfLCBfY2VydGlmaWNhdGlvblRlc3REYXRhXywgXyRyb290U2NvcGVfLCBfJHFfKSA9PiB7XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhID0gX2NlcnRpZmljYXRpb25UZXN0RGF0YV87XG4gICAgICAgIGl0ZW0gPSBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNU1swXTtcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAkcSA9IF8kcV87XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gbWFrZUNvbnRyb2xsZXIoZGVzY3JpcHRpb24sIGhlbHBUZXh0LCBjb21tZW50cywgcmVjaXBpZW50LCByZWFkT25seSkge1xuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ0NlcnRpZmljYXRpb25EZWxlZ2F0aW9uRGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAkcTogJHEsXG4gICAgICAgICAgICBoZWxwVGV4dDogaGVscFRleHQsXG4gICAgICAgICAgICBjb21tZW50czogY29tbWVudHMsXG4gICAgICAgICAgICByZWNpcGllbnQ6IHJlY2lwaWVudCxcbiAgICAgICAgICAgIHJlYWRPbmx5OiByZWFkT25seVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnc2F2ZSgpJywgKCkgPT4ge1xuICAgICAgICBpdCgnZGVsZWdhdGlvbiBkaWFsb2cgcmVzb2x2ZXMgd2l0aCBjb21tZW50cycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjdHJsLCBwcm9taXNlLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ1BsZWFzZSBjZXJ0aWZ5IHRoZXNlIHVzZXJzJyxcbiAgICAgICAgICAgICAgICBjb21tZW50cyA9ICdjb21tZW50cyAxJyxcbiAgICAgICAgICAgICAgICByZWNpcGllbnQgPSAncmVjaXBpZW50IDEnLFxuICAgICAgICAgICAgICAgIGhlbHBUZXh0ID0gJ1RoZXNlIGNoYW5nZXMgd2lsbCBiZSBpbW1lZGlhdGUnLFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGN0cmwgPSBtYWtlQ29udHJvbGxlcihkZXNjcmlwdGlvbiwgaGVscFRleHQsIGNvbW1lbnRzLCByZWNpcGllbnQsIHJlYWRPbmx5KTtcbiAgICAgICAgICAgIHByb21pc2UgPSBjdHJsLnNhdmUoKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQuY29tbWVudHMpLnRvRXF1YWwoY29tbWVudHMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQucmVjaXBpZW50KS50b0VxdWFsKHJlY2lwaWVudCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5kZXNjcmlwdGlvbikudG9FcXVhbChkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
