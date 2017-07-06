System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('RemediationAdvice', function () {

                beforeEach(module(certificationModule));

                var data = undefined,
                    RemediationAdviceResult = undefined,
                    RemediationAdvice = undefined,
                    RemediationSummary = undefined;

                beforeEach(inject(function (_RemediationAdvice_, _RemediationAdviceResult_, _RemediationSummary_, certificationTestData) {
                    RemediationAdvice = _RemediationAdvice_;
                    RemediationAdviceResult = _RemediationAdviceResult_;
                    RemediationSummary = _RemediationSummary_;
                    data = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT);
                }));

                describe('constructor', function () {
                    it('should initialize with provided data', function () {
                        var result = new RemediationAdviceResult(data);
                        expect(result.advice).toEqual(new RemediationAdvice(data.advice));
                        expect(result.summary).toEqual(new RemediationSummary(data.summary));
                    });

                    it('should throw with no data', function () {
                        expect(function () {
                            new RemediationAdviceResult();
                        }).toThrow();
                    });

                    it('should throw with no advice', function () {
                        expect(function () {
                            new RemediationAdviceResult({
                                summary: data.summary
                            });
                        }).toThrow();
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvUmVtZWRpYXRpb25BZHZpY2VSZXN1bHRUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLDZCQUE2QixVQUFVLFNBQVM7OztJQUc3SDs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0I7UUFDckMsU0FBUyxZQUFZOztZQUo3QixTQUFTLHFCQUFxQixZQUFXOztnQkFFckMsV0FBVyxPQUFPOztnQkFFbEIsSUFBSSxPQUFJO29CQUFFLDBCQUF1QjtvQkFBRSxvQkFBaUI7b0JBQUUscUJBQWtCOztnQkFFeEUsV0FBVyxPQUFPLFVBQUMscUJBQXFCLDJCQUEyQixzQkFDaEQsdUJBQTBCO29CQUN6QyxvQkFBb0I7b0JBQ3BCLDBCQUEwQjtvQkFDMUIscUJBQXFCO29CQUNyQixPQUFPLFFBQVEsS0FBSyxzQkFBc0I7OztnQkFHOUMsU0FBUyxlQUFlLFlBQU07b0JBQzFCLEdBQUcsd0NBQXdDLFlBQU07d0JBQzdDLElBQUksU0FBUyxJQUFJLHdCQUF3Qjt3QkFDekMsT0FBTyxPQUFPLFFBQVEsUUFBUSxJQUFJLGtCQUFrQixLQUFLO3dCQUN6RCxPQUFPLE9BQU8sU0FBUyxRQUFRLElBQUksbUJBQW1CLEtBQUs7OztvQkFHL0QsR0FBRyw2QkFBNkIsWUFBTTt3QkFDbEMsT0FBTyxZQUFNOzRCQUFFLElBQUk7MkJBQThCOzs7b0JBR3JELEdBQUcsK0JBQStCLFlBQU07d0JBQ3BDLE9BQU8sWUFBTTs0QkFBRSxJQUFJLHdCQUF3QjtnQ0FDdkMsU0FBUyxLQUFLOzsyQkFDWDs7Ozs7O0dBa0JoQiIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL21vZGVsL1JlbWVkaWF0aW9uQWR2aWNlUmVzdWx0VGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICcuLi9DZXJ0aWZpY2F0aW9uVGVzdERhdGEnO1xuXG5kZXNjcmliZSgnUmVtZWRpYXRpb25BZHZpY2UnLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGxldCBkYXRhLCBSZW1lZGlhdGlvbkFkdmljZVJlc3VsdCwgUmVtZWRpYXRpb25BZHZpY2UsIFJlbWVkaWF0aW9uU3VtbWFyeTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfUmVtZWRpYXRpb25BZHZpY2VfLCBfUmVtZWRpYXRpb25BZHZpY2VSZXN1bHRfLCBfUmVtZWRpYXRpb25TdW1tYXJ5XyxcbiAgICAgICAgICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvblRlc3REYXRhKSA9PiB7XG4gICAgICAgIFJlbWVkaWF0aW9uQWR2aWNlID0gX1JlbWVkaWF0aW9uQWR2aWNlXztcbiAgICAgICAgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQgPSBfUmVtZWRpYXRpb25BZHZpY2VSZXN1bHRfO1xuICAgICAgICBSZW1lZGlhdGlvblN1bW1hcnkgPSBfUmVtZWRpYXRpb25TdW1tYXJ5XztcbiAgICAgICAgZGF0YSA9IGFuZ3VsYXIuY29weShjZXJ0aWZpY2F0aW9uVGVzdERhdGEuUkVNRURJQVRJT05fQURWSUNFX1JFU1VMVCk7XG4gICAgfSkpO1xuXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwcm92aWRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBSZW1lZGlhdGlvbkFkdmljZVJlc3VsdChkYXRhKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQuYWR2aWNlKS50b0VxdWFsKG5ldyBSZW1lZGlhdGlvbkFkdmljZShkYXRhLmFkdmljZSkpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5zdW1tYXJ5KS50b0VxdWFsKG5ldyBSZW1lZGlhdGlvblN1bW1hcnkoZGF0YS5zdW1tYXJ5KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2l0aCBubyBkYXRhJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IHsgbmV3IFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0KCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG5vIGFkdmljZScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiB7IG5ldyBSZW1lZGlhdGlvbkFkdmljZVJlc3VsdCh7XG4gICAgICAgICAgICAgICAgc3VtbWFyeTogZGF0YS5zdW1tYXJ5XG4gICAgICAgICAgICB9KTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
