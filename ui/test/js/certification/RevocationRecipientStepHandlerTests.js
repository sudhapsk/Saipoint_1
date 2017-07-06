System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}],
        execute: function () {

            describe('RevocationRecipientStepHandler', function () {

                var RevocationRecipientStepHandler = undefined,
                    adviceResult = undefined,
                    $rootScope = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_RevocationRecipientStepHandler_, certificationTestData, RemediationAdviceResult, _$rootScope_) {
                    RevocationRecipientStepHandler = _RevocationRecipientStepHandler_;
                    adviceResult = new RemediationAdviceResult(certificationTestData.REMEDIATION_ADVICE_RESULT);
                    $rootScope = _$rootScope_;
                }));

                describe('constructor', function () {
                    it('sets recipient to default remediator', function () {
                        var stepHandler = new RevocationRecipientStepHandler(adviceResult.advice.violationSummary, adviceResult.summary.defaultRemediator);
                        expect(stepHandler.recipient).toEqual(adviceResult.summary.defaultRemediator);
                        expect(stepHandler.violationDescription).toEqual(adviceResult.advice.violationSummary);
                    });
                });

                describe('isSaveDisabled()', function () {
                    it('returns true with no recipient', function () {
                        var stepHandler = undefined;
                        stepHandler = new RevocationRecipientStepHandler(adviceResult.advice, adviceResult.summary);
                        delete stepHandler.recipient;
                        expect(stepHandler.isSaveDisabled()).toEqual(true);
                    });

                    it('returns false with a recipient', function () {
                        var stepHandler = new RevocationRecipientStepHandler(adviceResult.advice, adviceResult.summary);
                        expect(stepHandler.isSaveDisabled()).toEqual(false);
                    });
                });

                describe('save()', function () {
                    it('returns resovled promise with recipient and comments', function () {
                        var stepHandler = new RevocationRecipientStepHandler(adviceResult.advice, adviceResult.summary),
                            saveResult = undefined;
                        stepHandler.comments = 'good morning';
                        stepHandler.save().then(function (result) {
                            saveResult = result;
                        });
                        $rootScope.$apply();
                        expect(saveResult).toBeDefined();
                        expect(saveResult.recipient).toEqual(stepHandler.recipient);
                        expect(saveResult.comments).toEqual(stepHandler.comments);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyxnREFBZ0QsVUFBVSxTQUFTOzs7SUFHaEo7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsMkNBQTJDO1FBQ3hELFNBQVMsWUFBWTs7WUFKN0IsU0FBUyxrQ0FBa0MsWUFBTTs7Z0JBRTdDLElBQUksaUNBQThCO29CQUFFLGVBQVk7b0JBQUUsYUFBVTs7Z0JBRTVELFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLGtDQUFrQyx1QkFBdUIseUJBQ3pELGNBQWlCO29CQUNoQyxpQ0FBaUM7b0JBQ2pDLGVBQWUsSUFBSSx3QkFBd0Isc0JBQXNCO29CQUNqRSxhQUFhOzs7Z0JBR2pCLFNBQVMsZUFBZSxZQUFNO29CQUMxQixHQUFHLHdDQUF3QyxZQUFNO3dCQUM3QyxJQUFJLGNBQWMsSUFBSSwrQkFBK0IsYUFBYSxPQUFPLGtCQUNyRSxhQUFhLFFBQVE7d0JBQ3pCLE9BQU8sWUFBWSxXQUFXLFFBQVEsYUFBYSxRQUFRO3dCQUMzRCxPQUFPLFlBQVksc0JBQXNCLFFBQVEsYUFBYSxPQUFPOzs7O2dCQUk3RSxTQUFTLG9CQUFvQixZQUFNO29CQUMvQixHQUFHLGtDQUFrQyxZQUFNO3dCQUN2QyxJQUFJLGNBQVc7d0JBQ2YsY0FBYyxJQUFJLCtCQUErQixhQUFhLFFBQVEsYUFBYTt3QkFDbkYsT0FBTyxZQUFZO3dCQUNuQixPQUFPLFlBQVksa0JBQWtCLFFBQVE7OztvQkFHakQsR0FBRyxrQ0FBa0MsWUFBTTt3QkFDdkMsSUFBSSxjQUFjLElBQUksK0JBQStCLGFBQWEsUUFBUSxhQUFhO3dCQUN2RixPQUFPLFlBQVksa0JBQWtCLFFBQVE7Ozs7Z0JBSXJELFNBQVMsVUFBVSxZQUFNO29CQUNyQixHQUFHLHdEQUF3RCxZQUFNO3dCQUM3RCxJQUFJLGNBQWMsSUFBSSwrQkFBK0IsYUFBYSxRQUFRLGFBQWE7NEJBQ25GLGFBQVU7d0JBQ2QsWUFBWSxXQUFXO3dCQUN2QixZQUFZLE9BQU8sS0FBSyxVQUFDLFFBQVc7NEJBQ2hDLGFBQWE7O3dCQUVqQixXQUFXO3dCQUNYLE9BQU8sWUFBWTt3QkFDbkIsT0FBTyxXQUFXLFdBQVcsUUFBUSxZQUFZO3dCQUNqRCxPQUFPLFdBQVcsVUFBVSxRQUFRLFlBQVk7Ozs7OztHQVl6RCIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL1Jldm9jYXRpb25SZWNpcGllbnRTdGVwSGFuZGxlclRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAndGVzdC9qcy9jZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25UZXN0RGF0YSc7XG5cbmRlc2NyaWJlKCdSZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXInLCAoKSA9PiB7XG5cbiAgICBsZXQgUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyLCBhZHZpY2VSZXN1bHQsICRyb290U2NvcGU7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdCgoX1Jldm9jYXRpb25SZWNpcGllbnRTdGVwSGFuZGxlcl8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSwgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgIF8kcm9vdFNjb3BlXykgPT4ge1xuICAgICAgICBSZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXIgPSBfUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyXztcbiAgICAgICAgYWR2aWNlUmVzdWx0ID0gbmV3IFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0KGNlcnRpZmljYXRpb25UZXN0RGF0YS5SRU1FRElBVElPTl9BRFZJQ0VfUkVTVUxUKTtcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZXRzIHJlY2lwaWVudCB0byBkZWZhdWx0IHJlbWVkaWF0b3InLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXIgPSBuZXcgUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyKGFkdmljZVJlc3VsdC5hZHZpY2UudmlvbGF0aW9uU3VtbWFyeSxcbiAgICAgICAgICAgICAgICBhZHZpY2VSZXN1bHQuc3VtbWFyeS5kZWZhdWx0UmVtZWRpYXRvcik7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIucmVjaXBpZW50KS50b0VxdWFsKGFkdmljZVJlc3VsdC5zdW1tYXJ5LmRlZmF1bHRSZW1lZGlhdG9yKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci52aW9sYXRpb25EZXNjcmlwdGlvbikudG9FcXVhbChhZHZpY2VSZXN1bHQuYWR2aWNlLnZpb2xhdGlvblN1bW1hcnkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc1NhdmVEaXNhYmxlZCgpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyB0cnVlIHdpdGggbm8gcmVjaXBpZW50JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyO1xuICAgICAgICAgICAgc3RlcEhhbmRsZXIgPSBuZXcgUmV2b2NhdGlvblJlY2lwaWVudFN0ZXBIYW5kbGVyKGFkdmljZVJlc3VsdC5hZHZpY2UsIGFkdmljZVJlc3VsdC5zdW1tYXJ5KTtcbiAgICAgICAgICAgIGRlbGV0ZSBzdGVwSGFuZGxlci5yZWNpcGllbnQ7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNTYXZlRGlzYWJsZWQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2Ugd2l0aCBhIHJlY2lwaWVudCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSZXZvY2F0aW9uUmVjaXBpZW50U3RlcEhhbmRsZXIoYWR2aWNlUmVzdWx0LmFkdmljZSwgYWR2aWNlUmVzdWx0LnN1bW1hcnkpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzU2F2ZURpc2FibGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzYXZlKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIHJlc292bGVkIHByb21pc2Ugd2l0aCByZWNpcGllbnQgYW5kIGNvbW1lbnRzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25SZWNpcGllbnRTdGVwSGFuZGxlcihhZHZpY2VSZXN1bHQuYWR2aWNlLCBhZHZpY2VSZXN1bHQuc3VtbWFyeSksXG4gICAgICAgICAgICAgICAgc2F2ZVJlc3VsdDtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLmNvbW1lbnRzID0gJ2dvb2QgbW9ybmluZyc7XG4gICAgICAgICAgICBzdGVwSGFuZGxlci5zYXZlKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgc2F2ZVJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIGV4cGVjdChzYXZlUmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQucmVjaXBpZW50KS50b0VxdWFsKHN0ZXBIYW5kbGVyLnJlY2lwaWVudCk7XG4gICAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5jb21tZW50cykudG9FcXVhbChzdGVwSGFuZGxlci5jb21tZW50cyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
