System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('Certification', function () {
                // Use the module.
                beforeEach(module(certificationModule));

                var Certification, CertificationSignoff, certificationTestData;

                beforeEach(inject(function (_Certification_, _CertificationSignoff_, _certificationTestData_) {
                    Certification = _Certification_;
                    certificationTestData = _certificationTestData_;
                    CertificationSignoff = _CertificationSignoff_;
                }));

                describe('init', function () {
                    it('should initialize with provided data', function () {
                        var data = certificationTestData.CERTIFICATION_1,
                            test = new Certification(data);
                        expect(test.id).toEqual(data.id);
                        expect(test.availableBulkDecisions).toEqual(data.availableBulkDecisions);
                        expect(test.certifiers).toEqual(data.certifiers);
                        expect(test.editable).toEqual(data.editable);
                        expect(test.expiration.getTime()).toEqual(data.expiration);
                        expect(test.name).toEqual(data.name);
                        expect(test.nextPhaseTransition.getTime()).toEqual(data.nextPhaseTransition);
                        expect(test.phase).toEqual(data.phase);
                        expect(test.workItemId).toEqual(data.workItemId);
                        expect(test.itemStatusCount.counts).toEqual(data.itemStatusCount.counts);
                        expect(test.remediationsStarted).toEqual(data.remediationsStarted);
                        expect(test.remediationsCompleted).toEqual(data.remediationsCompleted);
                        expect(test.completedEntities).toEqual(data.completedEntities);
                        expect(test.totalEntities).toEqual(data.totalEntities);
                        expect(test.certificationCount).toEqual(data.certificationCount);
                        expect(test.tags).toEqual(data.tags);
                    });

                    it('should throw with no config data', function () {
                        expect(function () {
                            new Certification();
                        }).toThrow();
                    });

                    it('should throw with missing id', function () {
                        var data = certificationTestData.CERTIFICATION_1;
                        delete data.id;
                        expect(function () {
                            new Certification(data);
                        }).toThrow();
                    });
                });

                it('incomplete entities is calculated correctly', function () {
                    var cert = new Certification(certificationTestData.CERTIFICATION_1);
                    expect(cert.incompleteEntities).toEqual(5);
                });

                describe('signoffs', function () {
                    it('should initialize with CertificationSignoff objects', function () {
                        var data = certificationTestData.CERTIFICATION_SIGNED,
                            test = new Certification(data);

                        expect(test.signoffs).toBeDefined();
                        expect(test.signoffs.length).toEqual(1);
                        expect(test.signoffs[0]).toEqual(new CertificationSignoff(data.signoffs[0]));
                    });

                    it('should sort descending by date', function () {
                        var laterDate = new Date(2016, 3, 1),
                            earlierDate = new Date(2016, 2, 1),
                            data = {
                            id: 'whatever',
                            signoffs: [{
                                date: earlierDate,
                                signer: {}
                            }, {
                                date: laterDate,
                                signer: {}
                            }]
                        },
                            test = new Certification(data);
                        expect(test.signoffs.length).toEqual(2);
                        expect(test.signoffs[0].date).toEqual(laterDate);
                        expect(test.signoffs[1].date).toEqual(earlierDate);
                    });

                    describe('isSigned()', function () {
                        it('should return true if there are any signoffs', function () {
                            var data = certificationTestData.CERTIFICATION_SIGNED,
                                test = new Certification(data);

                            expect(test.isSigned()).toEqual(true);
                        });

                        it('should return false if there are no signoffs', function () {
                            var data = certificationTestData.CERTIFICATION_1,
                                test = new Certification(data);

                            expect(test.isSigned()).toEqual(false);
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvblRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsNkJBQTZCLFVBQVUsU0FBUzs7O0lBRzdIOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsaUJBQWlCLFlBQVc7O2dCQUVqQyxXQUFXLE9BQU87O2dCQUVsQixJQUFJLGVBQWUsc0JBQXNCOztnQkFFekMsV0FBVyxPQUFPLFVBQVMsaUJBQWlCLHdCQUF3Qix5QkFBeUI7b0JBQ3pGLGdCQUFnQjtvQkFDaEIsd0JBQXdCO29CQUN4Qix1QkFBdUI7OztnQkFHM0IsU0FBUyxRQUFRLFlBQVc7b0JBQ3hCLEdBQUcsd0NBQXdDLFlBQVc7d0JBQ2xELElBQUksT0FBTyxzQkFBc0I7NEJBQzdCLE9BQU8sSUFBSSxjQUFjO3dCQUM3QixPQUFPLEtBQUssSUFBSSxRQUFRLEtBQUs7d0JBQzdCLE9BQU8sS0FBSyx3QkFBd0IsUUFBUSxLQUFLO3dCQUNqRCxPQUFPLEtBQUssWUFBWSxRQUFRLEtBQUs7d0JBQ3JDLE9BQU8sS0FBSyxVQUFVLFFBQVEsS0FBSzt3QkFDbkMsT0FBTyxLQUFLLFdBQVcsV0FBVyxRQUFRLEtBQUs7d0JBQy9DLE9BQU8sS0FBSyxNQUFNLFFBQVEsS0FBSzt3QkFDL0IsT0FBTyxLQUFLLG9CQUFvQixXQUFXLFFBQVEsS0FBSzt3QkFDeEQsT0FBTyxLQUFLLE9BQU8sUUFBUSxLQUFLO3dCQUNoQyxPQUFPLEtBQUssWUFBWSxRQUFRLEtBQUs7d0JBQ3JDLE9BQU8sS0FBSyxnQkFBZ0IsUUFBUSxRQUFRLEtBQUssZ0JBQWdCO3dCQUNqRSxPQUFPLEtBQUsscUJBQXFCLFFBQVEsS0FBSzt3QkFDOUMsT0FBTyxLQUFLLHVCQUF1QixRQUFRLEtBQUs7d0JBQ2hELE9BQU8sS0FBSyxtQkFBbUIsUUFBUSxLQUFLO3dCQUM1QyxPQUFPLEtBQUssZUFBZSxRQUFRLEtBQUs7d0JBQ3hDLE9BQU8sS0FBSyxvQkFBb0IsUUFBUSxLQUFLO3dCQUM3QyxPQUFPLEtBQUssTUFBTSxRQUFRLEtBQUs7OztvQkFHbkMsR0FBRyxvQ0FBb0MsWUFBVzt3QkFDOUMsT0FBTyxZQUFXOzRCQUNkLElBQUk7MkJBQ0w7OztvQkFHUCxHQUFHLGdDQUFnQyxZQUFXO3dCQUMxQyxJQUFJLE9BQU8sc0JBQXNCO3dCQUNqQyxPQUFPLEtBQUs7d0JBQ1osT0FBTyxZQUFXOzRCQUNkLElBQUksY0FBYzsyQkFDbkI7Ozs7Z0JBSVgsR0FBRywrQ0FBK0MsWUFBTTtvQkFDcEQsSUFBSSxPQUFPLElBQUksY0FBYyxzQkFBc0I7b0JBQ25ELE9BQU8sS0FBSyxvQkFBb0IsUUFBUTs7O2dCQUc1QyxTQUFTLFlBQVksWUFBTTtvQkFDdkIsR0FBSSx1REFBdUQsWUFBTTt3QkFDN0QsSUFBSSxPQUFPLHNCQUFzQjs0QkFDN0IsT0FBTyxJQUFJLGNBQWM7O3dCQUU3QixPQUFPLEtBQUssVUFBVTt3QkFDdEIsT0FBTyxLQUFLLFNBQVMsUUFBUSxRQUFRO3dCQUNyQyxPQUFPLEtBQUssU0FBUyxJQUFJLFFBQVEsSUFBSSxxQkFBcUIsS0FBSyxTQUFTOzs7b0JBRzVFLEdBQUcsa0NBQWtDLFlBQU07d0JBQ3ZDLElBQUksWUFBWSxJQUFJLEtBQUssTUFBTSxHQUFHOzRCQUM5QixjQUFjLElBQUksS0FBSyxNQUFNLEdBQUc7NEJBQ2hDLE9BQU87NEJBQ0gsSUFBSTs0QkFDSixVQUFVLENBQUM7Z0NBQ1AsTUFBTTtnQ0FDTixRQUFROytCQUNWO2dDQUNFLE1BQU07Z0NBQ04sUUFBUTs7OzRCQUdoQixPQUFPLElBQUksY0FBYzt3QkFDN0IsT0FBTyxLQUFLLFNBQVMsUUFBUSxRQUFRO3dCQUNyQyxPQUFPLEtBQUssU0FBUyxHQUFHLE1BQU0sUUFBUTt3QkFDdEMsT0FBTyxLQUFLLFNBQVMsR0FBRyxNQUFNLFFBQVE7OztvQkFHMUMsU0FBUyxjQUFjLFlBQU07d0JBQ3pCLEdBQUcsZ0RBQWdELFlBQU07NEJBQ3JELElBQUksT0FBTyxzQkFBc0I7Z0NBQzdCLE9BQU8sSUFBSSxjQUFjOzs0QkFFN0IsT0FBTyxLQUFLLFlBQVksUUFBUTs7O3dCQUdwQyxHQUFHLGdEQUFnRCxZQUFNOzRCQUNyRCxJQUFJLE9BQU8sc0JBQXNCO2dDQUM3QixPQUFPLElBQUksY0FBYzs7NEJBRTdCLE9BQU8sS0FBSyxZQUFZLFFBQVE7Ozs7Ozs7R0FhN0MiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9tb2RlbC9DZXJ0aWZpY2F0aW9uVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICcuLi9DZXJ0aWZpY2F0aW9uVGVzdERhdGEnO1xuXG5kZXNjcmliZSgnQ2VydGlmaWNhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFVzZSB0aGUgbW9kdWxlLlxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIHZhciBDZXJ0aWZpY2F0aW9uLCBDZXJ0aWZpY2F0aW9uU2lnbm9mZiwgY2VydGlmaWNhdGlvblRlc3REYXRhO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX0NlcnRpZmljYXRpb25fLCBfQ2VydGlmaWNhdGlvblNpZ25vZmZfLCBfY2VydGlmaWNhdGlvblRlc3REYXRhXykge1xuICAgICAgICBDZXJ0aWZpY2F0aW9uID0gX0NlcnRpZmljYXRpb25fO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uVGVzdERhdGEgPSBfY2VydGlmaWNhdGlvblRlc3REYXRhXztcbiAgICAgICAgQ2VydGlmaWNhdGlvblNpZ25vZmYgPSBfQ2VydGlmaWNhdGlvblNpZ25vZmZfO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdpbml0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIHByb3ZpZGVkIGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fMSxcbiAgICAgICAgICAgICAgICB0ZXN0ID0gbmV3IENlcnRpZmljYXRpb24oZGF0YSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5pZCkudG9FcXVhbChkYXRhLmlkKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmF2YWlsYWJsZUJ1bGtEZWNpc2lvbnMpLnRvRXF1YWwoZGF0YS5hdmFpbGFibGVCdWxrRGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmNlcnRpZmllcnMpLnRvRXF1YWwoZGF0YS5jZXJ0aWZpZXJzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmVkaXRhYmxlKS50b0VxdWFsKGRhdGEuZWRpdGFibGUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3QuZXhwaXJhdGlvbi5nZXRUaW1lKCkpLnRvRXF1YWwoZGF0YS5leHBpcmF0aW9uKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Lm5hbWUpLnRvRXF1YWwoZGF0YS5uYW1lKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Lm5leHRQaGFzZVRyYW5zaXRpb24uZ2V0VGltZSgpKS50b0VxdWFsKGRhdGEubmV4dFBoYXNlVHJhbnNpdGlvbik7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5waGFzZSkudG9FcXVhbChkYXRhLnBoYXNlKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LndvcmtJdGVtSWQpLnRvRXF1YWwoZGF0YS53b3JrSXRlbUlkKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0Lml0ZW1TdGF0dXNDb3VudC5jb3VudHMpLnRvRXF1YWwoZGF0YS5pdGVtU3RhdHVzQ291bnQuY291bnRzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnJlbWVkaWF0aW9uc1N0YXJ0ZWQpLnRvRXF1YWwoZGF0YS5yZW1lZGlhdGlvbnNTdGFydGVkKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnJlbWVkaWF0aW9uc0NvbXBsZXRlZCkudG9FcXVhbChkYXRhLnJlbWVkaWF0aW9uc0NvbXBsZXRlZCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5jb21wbGV0ZWRFbnRpdGllcykudG9FcXVhbChkYXRhLmNvbXBsZXRlZEVudGl0aWVzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LnRvdGFsRW50aXRpZXMpLnRvRXF1YWwoZGF0YS50b3RhbEVudGl0aWVzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmNlcnRpZmljYXRpb25Db3VudCkudG9FcXVhbChkYXRhLmNlcnRpZmljYXRpb25Db3VudCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC50YWdzKS50b0VxdWFsKGRhdGEudGFncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2l0aCBubyBjb25maWcgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG5ldyBDZXJ0aWZpY2F0aW9uKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2l0aCBtaXNzaW5nIGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUSUZJQ0FUSU9OXzE7XG4gICAgICAgICAgICBkZWxldGUgZGF0YS5pZDtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXcgQ2VydGlmaWNhdGlvbihkYXRhKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5jb21wbGV0ZSBlbnRpdGllcyBpcyBjYWxjdWxhdGVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgbGV0IGNlcnQgPSBuZXcgQ2VydGlmaWNhdGlvbihjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xKTtcbiAgICAgICAgZXhwZWN0KGNlcnQuaW5jb21wbGV0ZUVudGl0aWVzKS50b0VxdWFsKDUpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NpZ25vZmZzJywgKCkgPT4ge1xuICAgICAgICBpdCAoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggQ2VydGlmaWNhdGlvblNpZ25vZmYgb2JqZWN0cycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fU0lHTkVELFxuICAgICAgICAgICAgICAgIHRlc3QgPSBuZXcgQ2VydGlmaWNhdGlvbihkYXRhKTtcblxuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc2lnbm9mZnMpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5zaWdub2Zmcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3QodGVzdC5zaWdub2Zmc1swXSkudG9FcXVhbChuZXcgQ2VydGlmaWNhdGlvblNpZ25vZmYoZGF0YS5zaWdub2Zmc1swXSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHNvcnQgZGVzY2VuZGluZyBieSBkYXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGxhdGVyRGF0ZSA9IG5ldyBEYXRlKDIwMTYsIDMsIDEpLFxuICAgICAgICAgICAgICAgIGVhcmxpZXJEYXRlID0gbmV3IERhdGUoMjAxNiwgMiwgMSksXG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICd3aGF0ZXZlcicsXG4gICAgICAgICAgICAgICAgICAgIHNpZ25vZmZzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogZWFybGllckRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduZXI6IHt9XG4gICAgICAgICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogbGF0ZXJEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmVyOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVzdCA9IG5ldyBDZXJ0aWZpY2F0aW9uKGRhdGEpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc2lnbm9mZnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc2lnbm9mZnNbMF0uZGF0ZSkudG9FcXVhbChsYXRlckRhdGUpO1xuICAgICAgICAgICAgZXhwZWN0KHRlc3Quc2lnbm9mZnNbMV0uZGF0ZSkudG9FcXVhbChlYXJsaWVyRGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdpc1NpZ25lZCgpJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiB0aGVyZSBhcmUgYW55IHNpZ25vZmZzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fU0lHTkVELFxuICAgICAgICAgICAgICAgICAgICB0ZXN0ID0gbmV3IENlcnRpZmljYXRpb24oZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QodGVzdC5pc1NpZ25lZCgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGlmIHRoZXJlIGFyZSBubyBzaWdub2ZmcycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IGNlcnRpZmljYXRpb25UZXN0RGF0YS5DRVJUSUZJQ0FUSU9OXzEsXG4gICAgICAgICAgICAgICAgICAgIHRlc3QgPSBuZXcgQ2VydGlmaWNhdGlvbihkYXRhKTtcblxuICAgICAgICAgICAgICAgIGV4cGVjdCh0ZXN0LmlzU2lnbmVkKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
