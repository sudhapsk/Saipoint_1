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

            describe('PolicyViolationDetailsDialogCtrl', function () {

                var $controller = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$controller_) {
                    $controller = _$controller_;
                }));

                function createController(policyViolation) {
                    return $controller('PolicyViolationDetailsDialogCtrl', {
                        policyViolation: policyViolation
                    });
                }

                it('constructor throws if id is missing', function () {
                    expect(function () {
                        createController();
                    }).toThrow();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vUG9saWN5VmlvbGF0aW9uRGV0YWlsc0RpYWxvZ0N0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsc0NBQXNDLFVBQVUsU0FBUzs7Ozs7SUFLakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDOztRQUU1RCxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsb0NBQW9DLFlBQVc7O2dCQUVwRCxJQUFJLGNBQVc7O2dCQUVmLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLGVBQWU7b0JBQ3RDLGNBQWM7OztnQkFHbEIsU0FBUyxpQkFBaUIsaUJBQWlCO29CQUN2QyxPQUFPLFlBQVksb0NBQW9DO3dCQUNuRCxpQkFBaUI7Ozs7Z0JBSXpCLEdBQUcsdUNBQXVDLFlBQVc7b0JBQ2pELE9BQU8sWUFBVzt3QkFBRTt1QkFBdUI7Ozs7O0dBY2hEIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vUG9saWN5VmlvbGF0aW9uRGV0YWlsc0RpYWxvZ0N0cmxUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoYykgQ29weXJpZ2h0IDIwMTYuIFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuXG5kZXNjcmliZSgnUG9saWN5VmlvbGF0aW9uRGV0YWlsc0RpYWxvZ0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIGxldCAkY29udHJvbGxlcjtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kY29udHJvbGxlcl8pIHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIocG9saWN5VmlvbGF0aW9uKSB7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlcignUG9saWN5VmlvbGF0aW9uRGV0YWlsc0RpYWxvZ0N0cmwnLCB7XG4gICAgICAgICAgICBwb2xpY3lWaW9sYXRpb246IHBvbGljeVZpb2xhdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpdCgnY29uc3RydWN0b3IgdGhyb3dzIGlmIGlkIGlzIG1pc3NpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjcmVhdGVDb250cm9sbGVyKCk7IH0pLnRvVGhyb3coKTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
