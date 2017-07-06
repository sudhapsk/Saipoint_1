System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('SoDRole', function () {

                var SoDRole = undefined,
                    data = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_SoDRole_, certificationTestData) {
                    SoDRole = _SoDRole_;
                    data = certificationTestData.REMEDIATION_ADVICE_RESULT.advice.leftRoles[0];
                }));

                describe('constructor', function () {
                    it('sets values', function () {
                        var testRole = new SoDRole(data);
                        expect(testRole.id).toEqual(data.id);
                        expect(testRole.name).toEqual(data.name);
                        expect(testRole.displayableName).toEqual(data.displayableName);
                        expect(testRole.description).toEqual(data.description);
                        expect(testRole.selected).toEqual(data.selected);
                        expect(testRole.certItemId).toEqual(data.certItemId);
                        expect(testRole.entityId).toEqual(data.entityId);
                        expect(testRole.status).toEqual(data.status);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvU29EUm9sZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsNkJBQTZCLFVBQVUsU0FBUzs7O0lBRzdIOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsV0FBVyxZQUFNOztnQkFFdEIsSUFBSSxVQUFPO29CQUFFLE9BQUk7O2dCQUVqQixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxXQUFXLHVCQUEwQjtvQkFDcEQsVUFBVTtvQkFDVixPQUFPLHNCQUFzQiwwQkFBMEIsT0FBTyxVQUFVOzs7Z0JBRzVFLFNBQVMsZUFBZSxZQUFNO29CQUMxQixHQUFHLGVBQWUsWUFBTTt3QkFDcEIsSUFBSSxXQUFXLElBQUksUUFBUTt3QkFDM0IsT0FBTyxTQUFTLElBQUksUUFBUSxLQUFLO3dCQUNqQyxPQUFPLFNBQVMsTUFBTSxRQUFRLEtBQUs7d0JBQ25DLE9BQU8sU0FBUyxpQkFBaUIsUUFBUSxLQUFLO3dCQUM5QyxPQUFPLFNBQVMsYUFBYSxRQUFRLEtBQUs7d0JBQzFDLE9BQU8sU0FBUyxVQUFVLFFBQVEsS0FBSzt3QkFDdkMsT0FBTyxTQUFTLFlBQVksUUFBUSxLQUFLO3dCQUN6QyxPQUFPLFNBQVMsVUFBVSxRQUFRLEtBQUs7d0JBQ3ZDLE9BQU8sU0FBUyxRQUFRLFFBQVEsS0FBSzs7Ozs7O0dBYTlDIiwiZmlsZSI6ImNlcnRpZmljYXRpb24vbW9kZWwvU29EUm9sZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAnLi4vQ2VydGlmaWNhdGlvblRlc3REYXRhJztcblxuZGVzY3JpYmUoJ1NvRFJvbGUnLCAoKSA9PiB7XG5cbiAgICBsZXQgU29EUm9sZSwgZGF0YTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfU29EUm9sZV8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSkgPT4ge1xuICAgICAgICBTb0RSb2xlID0gX1NvRFJvbGVfO1xuICAgICAgICBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQuYWR2aWNlLmxlZnRSb2xlc1swXTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZXRzIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXN0Um9sZSA9IG5ldyBTb0RSb2xlKGRhdGEpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3RSb2xlLmlkKS50b0VxdWFsKGRhdGEuaWQpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3RSb2xlLm5hbWUpLnRvRXF1YWwoZGF0YS5uYW1lKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Um9sZS5kaXNwbGF5YWJsZU5hbWUpLnRvRXF1YWwoZGF0YS5kaXNwbGF5YWJsZU5hbWUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3RSb2xlLmRlc2NyaXB0aW9uKS50b0VxdWFsKGRhdGEuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3RSb2xlLnNlbGVjdGVkKS50b0VxdWFsKGRhdGEuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3RSb2xlLmNlcnRJdGVtSWQpLnRvRXF1YWwoZGF0YS5jZXJ0SXRlbUlkKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Um9sZS5lbnRpdHlJZCkudG9FcXVhbChkYXRhLmVudGl0eUlkKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Um9sZS5zdGF0dXMpLnRvRXF1YWwoZGF0YS5zdGF0dXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
