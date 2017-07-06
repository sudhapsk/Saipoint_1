System.register(['test/js/TestInitializer', 'certification/CertificationModule', 'test/js/certification/CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsCertificationCertificationTestData) {}],
        execute: function () {

            describe('RevocationModificationStepHandler', function () {
                var RevocationModificationStepHandler = undefined,
                    lineItems = undefined,
                    $rootScope = undefined,
                    certificationDataService = undefined,
                    useLinkAttributeValueForRevocationModification = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_RevocationModificationStepHandler_, _RemediationSummary_, certificationTestData, _$rootScope_, _certificationDataService_) {
                    RevocationModificationStepHandler = _RevocationModificationStepHandler_;
                    lineItems = new _RemediationSummary_(certificationTestData.REMEDIATION_ADVICE_RESULT.summary).remediationDetails;
                    certificationDataService = _certificationDataService_;
                    spyOn(certificationDataService, 'getConfiguration').and.callFake(function () {
                        return {
                            useLinkAttributeValueForRevocationModification: useLinkAttributeValueForRevocationModification
                        };
                    });
                    useLinkAttributeValueForRevocationModification = false;
                    $rootScope = _$rootScope_;
                }));

                describe('constructor', function () {
                    it('throws without lineItems', function () {
                        expect(function () {
                            new RevocationModificationStepHandler();
                        }).toThrow();
                    });

                    it('intializes line item groups', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems);
                        expect(stepHandler.lineItemGroups).toBeDefined();
                        expect(stepHandler.lineItemGroups.length).toEqual(1);
                        expect(stepHandler.lineItemGroups[0].application).toEqual(lineItems[0].application);
                        expect(stepHandler.lineItemGroups[0].nativeIdentity).toEqual(lineItems[0].nativeIdentity);
                        expect(stepHandler.lineItemGroups[0].account).toEqual(lineItems[0].account);
                        expect(stepHandler.lineItemGroups[0].attribute).toEqual(lineItems[0].attribute);
                        expect(stepHandler.lineItemGroups[0].items[0]).toEqual(lineItems[0]);
                    });

                    it('sets the new value and operation on matching line items from existing line items', function () {
                        var existingItems = angular.copy(lineItems);
                        existingItems[0].newValue = 'asdfasdfasdfadsfa';
                        existingItems[0].newOperation = 'Remove';
                        var stepHandler = new RevocationModificationStepHandler(lineItems, existingItems),
                            item = stepHandler.lineItemGroups[0].items[0];
                        expect(item.newValue).toEqual(existingItems[0].newValue);
                        expect(item.newOperation).toEqual(existingItems[0].newOperation);
                    });
                });

                describe('save()', function () {
                    it('resolves with the line items as remediationDetails', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems);
                        stepHandler.lineItemGroups[0].items[0].newValue = 'whatever';
                        var result = undefined;

                        stepHandler.save().then(function (stepResult) {
                            result = stepResult;
                        });
                        $rootScope.$apply();
                        expect(result).toBeDefined();
                        expect(result.remediationDetails).toEqual([stepHandler.lineItemGroups[0].items[0]]);
                    });

                    it('converts suggest object back to simple string for newValue', function () {
                        it('removes newValue from line items if operation is remove', function () {
                            var stepHandler = new RevocationModificationStepHandler(lineItems);
                            stepHandler.lineItemGroups[0].items[0].newValue = {
                                name: 'suggestName',
                                displayName: 'Some Attribute Name'
                            };

                            var result = undefined;

                            stepHandler.save().then(function (stepResult) {
                                result = stepResult;
                            });
                            $rootScope.$apply();
                            expect(result).toBeDefined();
                            expect(result.remediationDetails[0].newValue).toEqual('suggestName');
                        });
                    });
                });

                describe('isSaveDisabled()', function () {
                    it('returns true if any line item has Set operation with no value', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems);
                        delete stepHandler.lineItemGroups[0].items[0].newValue;
                        expect(stepHandler.isSaveDisabled()).toEqual(true);
                    });

                    it('returns false if all items have values', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems);
                        stepHandler.lineItemGroups[0].items[0].newValue = 'blah';
                        expect(stepHandler.isSaveDisabled()).toEqual(false);
                    });
                });

                describe('isManagedAttributeSuggest()', function () {
                    it('returns false if line item is not select', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(false);
                        spyOn(lineItem, 'isAttribute').and.returnValue(true);
                        expect(stepHandler.isLinkAttributeSuggest(lineItem)).toEqual(false);
                    });

                    it('returns false if not an attribute', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(true);
                        spyOn(lineItem, 'isAttribute').and.returnValue(false);
                        expect(stepHandler.isManagedAttributeSuggest(lineItem)).toEqual(false);
                    });

                    it('returns false if useLinkAttributeValueForRevocationModification is true', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(true);
                        spyOn(lineItem, 'isAttribute').and.returnValue(true);
                        useLinkAttributeValueForRevocationModification = true;
                        expect(stepHandler.isManagedAttributeSuggest(lineItem)).toEqual(false);
                    });

                    it('returns true if attribute with select', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(true);
                        spyOn(lineItem, 'isAttribute').and.returnValue(true);
                        expect(stepHandler.isManagedAttributeSuggest(lineItem)).toEqual(true);
                    });
                });

                describe('isLinkAttributeSuggest()', function () {
                    it('returns false if line item is not select', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(false);
                        spyOn(lineItem, 'isPermission').and.returnValue(true);
                        expect(stepHandler.isLinkAttributeSuggest(lineItem)).toEqual(false);
                    });

                    it('returns false if line item is attribute', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(true);
                        spyOn(lineItem, 'isPermission').and.returnValue(false);
                        expect(stepHandler.isLinkAttributeSuggest(lineItem)).toEqual(false);
                    });

                    it('returns true if line item is permission', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(true);
                        spyOn(lineItem, 'isPermission').and.returnValue(true);
                        expect(stepHandler.isLinkAttributeSuggest(lineItem)).toEqual(true);
                    });

                    it('returns true if useLinkAttributeValueForRevocationModification is true', function () {
                        var stepHandler = new RevocationModificationStepHandler(lineItems),
                            lineItem = stepHandler.lineItemGroups[0].items[0];
                        spyOn(lineItem, 'isSelect').and.returnValue(true);
                        spyOn(lineItem, 'isPermission').and.returnValue(false);
                        useLinkAttributeValueForRevocationModification = true;
                        expect(stepHandler.isLinkAttributeSuggest(lineItem)).toEqual(true);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHFDQUFxQyxnREFBZ0QsVUFBVSxTQUFTOztJQUVoSjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSwyQ0FBMkM7UUFDeEQsU0FBUyxZQUFZOztZQUo3QixTQUFTLHFDQUFxQyxZQUFNO2dCQUNoRCxJQUFJLG9DQUFpQztvQkFBRSxZQUFTO29CQUFFLGFBQVU7b0JBQUUsMkJBQXdCO29CQUNsRixpREFBOEM7O2dCQUVsRCxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxxQ0FBcUMsc0JBQXNCLHVCQUMzRCxjQUFjLDRCQUErQjtvQkFDNUQsb0NBQW9DO29CQUNwQyxZQUNJLElBQUkscUJBQXFCLHNCQUFzQiwwQkFBMEIsU0FBUztvQkFDdEYsMkJBQTJCO29CQUMzQixNQUFNLDBCQUEwQixvQkFBb0IsSUFBSSxTQUFTLFlBQU07d0JBQ25FLE9BQU87NEJBQ0gsZ0RBQWdEOzs7b0JBR3hELGlEQUFpRDtvQkFDakQsYUFBYTs7O2dCQUdqQixTQUFTLGVBQWUsWUFBTTtvQkFDMUIsR0FBRyw0QkFBNEIsWUFBTTt3QkFDakMsT0FBTyxZQUFNOzRCQUFFLElBQUk7MkJBQXdDOzs7b0JBRy9ELEdBQUcsK0JBQStCLFlBQU07d0JBQ3BDLElBQUksY0FBYyxJQUFJLGtDQUFrQzt3QkFDeEQsT0FBTyxZQUFZLGdCQUFnQjt3QkFDbkMsT0FBTyxZQUFZLGVBQWUsUUFBUSxRQUFRO3dCQUNsRCxPQUFPLFlBQVksZUFBZSxHQUFHLGFBQWEsUUFBUSxVQUFVLEdBQUc7d0JBQ3ZFLE9BQU8sWUFBWSxlQUFlLEdBQUcsZ0JBQWdCLFFBQVEsVUFBVSxH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RCxpREFBaUQ7d0JBQ2pELE9BQU8sWUFBWSx1QkFBdUIsV0FBVyxRQUFROzs7Ozs7R0FjdEUiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9SZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXJUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuaW1wb3J0ICd0ZXN0L2pzL2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvblRlc3REYXRhJztcblxuZGVzY3JpYmUoJ1Jldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcicsICgpID0+IHtcbiAgICBsZXQgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyLCBsaW5lSXRlbXMsICRyb290U2NvcGUsIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSxcbiAgICAgICAgdXNlTGlua0F0dHJpYnV0ZVZhbHVlRm9yUmV2b2NhdGlvbk1vZGlmaWNhdGlvbjtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyXywgX1JlbWVkaWF0aW9uU3VtbWFyeV8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgXyRyb290U2NvcGVfLCBfY2VydGlmaWNhdGlvbkRhdGFTZXJ2aWNlXykgPT4ge1xuICAgICAgICBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIgPSBfUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyXztcbiAgICAgICAgbGluZUl0ZW1zID1cbiAgICAgICAgICAgIG5ldyBfUmVtZWRpYXRpb25TdW1tYXJ5XyhjZXJ0aWZpY2F0aW9uVGVzdERhdGEuUkVNRURJQVRJT05fQURWSUNFX1JFU1VMVC5zdW1tYXJ5KS5yZW1lZGlhdGlvbkRldGFpbHM7XG4gICAgICAgIGNlcnRpZmljYXRpb25EYXRhU2VydmljZSA9IF9jZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2VfO1xuICAgICAgICBzcHlPbihjZXJ0aWZpY2F0aW9uRGF0YVNlcnZpY2UsICdnZXRDb25maWd1cmF0aW9uJykuYW5kLmNhbGxGYWtlKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdXNlTGlua0F0dHJpYnV0ZVZhbHVlRm9yUmV2b2NhdGlvbk1vZGlmaWNhdGlvbjogdXNlTGlua0F0dHJpYnV0ZVZhbHVlRm9yUmV2b2NhdGlvbk1vZGlmaWNhdGlvblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVzZUxpbmtBdHRyaWJ1dGVWYWx1ZUZvclJldm9jYXRpb25Nb2RpZmljYXRpb24gPSBmYWxzZTtcbiAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aG91dCBsaW5lSXRlbXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4geyBuZXcgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyKCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ludGlhbGl6ZXMgbGluZSBpdGVtIGdyb3VwcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIobGluZUl0ZW1zKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5saW5lSXRlbUdyb3VwcykudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIubGluZUl0ZW1Hcm91cHNbMF0uYXBwbGljYXRpb24pLnRvRXF1YWwobGluZUl0ZW1zWzBdLmFwcGxpY2F0aW9uKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwc1swXS5uYXRpdmVJZGVudGl0eSkudG9FcXVhbChsaW5lSXRlbXNbMF0ubmF0aXZlSWRlbnRpdHkpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLmFjY291bnQpLnRvRXF1YWwobGluZUl0ZW1zWzBdLmFjY291bnQpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLmF0dHJpYnV0ZSkudG9FcXVhbChsaW5lSXRlbXNbMF0uYXR0cmlidXRlKTtcbiAgICAgICAgICAgIGV4cGVjdChzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwc1swXS5pdGVtc1swXSkudG9FcXVhbChsaW5lSXRlbXNbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2V0cyB0aGUgbmV3IHZhbHVlIGFuZCBvcGVyYXRpb24gb24gbWF0Y2hpbmcgbGluZSBpdGVtcyBmcm9tIGV4aXN0aW5nIGxpbmUgaXRlbXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdJdGVtcyA9IGFuZ3VsYXIuY29weShsaW5lSXRlbXMpO1xuICAgICAgICAgICAgZXhpc3RpbmdJdGVtc1swXS5uZXdWYWx1ZSA9ICdhc2RmYXNkZmFzZGZhZHNmYSc7XG4gICAgICAgICAgICBleGlzdGluZ0l0ZW1zWzBdLm5ld09wZXJhdGlvbiA9ICdSZW1vdmUnO1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcihsaW5lSXRlbXMsIGV4aXN0aW5nSXRlbXMpLFxuICAgICAgICAgICAgICAgIGl0ZW0gPSBzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwc1swXS5pdGVtc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtLm5ld1ZhbHVlKS50b0VxdWFsKGV4aXN0aW5nSXRlbXNbMF0ubmV3VmFsdWUpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZW0ubmV3T3BlcmF0aW9uKS50b0VxdWFsKGV4aXN0aW5nSXRlbXNbMF0ubmV3T3BlcmF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2F2ZSgpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmVzb2x2ZXMgd2l0aCB0aGUgbGluZSBpdGVtcyBhcyByZW1lZGlhdGlvbkRldGFpbHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXIgPSBuZXcgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyKGxpbmVJdGVtcyk7XG4gICAgICAgICAgICBzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwc1swXS5pdGVtc1swXS5uZXdWYWx1ZSA9ICd3aGF0ZXZlcic7XG4gICAgICAgICAgICBsZXQgcmVzdWx0O1xuXG4gICAgICAgICAgICBzdGVwSGFuZGxlci5zYXZlKCkudGhlbigoc3RlcFJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHN0ZXBSZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5yZW1lZGlhdGlvbkRldGFpbHMpLnRvRXF1YWwoW3N0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjb252ZXJ0cyBzdWdnZXN0IG9iamVjdCBiYWNrIHRvIHNpbXBsZSBzdHJpbmcgZm9yIG5ld1ZhbHVlJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgbmV3VmFsdWUgZnJvbSBsaW5lIGl0ZW1zIGlmIG9wZXJhdGlvbiBpcyByZW1vdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcihsaW5lSXRlbXMpO1xuICAgICAgICAgICAgICAgIHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdLm5ld1ZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc3VnZ2VzdE5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1NvbWUgQXR0cmlidXRlIE5hbWUnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICBzdGVwSGFuZGxlci5zYXZlKCkudGhlbigoc3RlcFJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzdGVwUmVzdWx0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0LnJlbWVkaWF0aW9uRGV0YWlsc1swXS5uZXdWYWx1ZSkudG9FcXVhbCgnc3VnZ2VzdE5hbWUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzU2F2ZURpc2FibGVkKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgYW55IGxpbmUgaXRlbSBoYXMgU2V0IG9wZXJhdGlvbiB3aXRoIG5vIHZhbHVlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcihsaW5lSXRlbXMpO1xuICAgICAgICAgICAgZGVsZXRlIHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdLm5ld1ZhbHVlO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzU2F2ZURpc2FibGVkKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGFsbCBpdGVtcyBoYXZlIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIobGluZUl0ZW1zKTtcbiAgICAgICAgICAgIHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdLm5ld1ZhbHVlID0gJ2JsYWgnO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzU2F2ZURpc2FibGVkKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc01hbmFnZWRBdHRyaWJ1dGVTdWdnZXN0KCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGxpbmUgaXRlbSBpcyBub3Qgc2VsZWN0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcihsaW5lSXRlbXMpLFxuICAgICAgICAgICAgICAgIGxpbmVJdGVtID0gc3RlcEhhbmRsZXIubGluZUl0ZW1Hcm91cHNbMF0uaXRlbXNbMF07XG4gICAgICAgICAgICBzcHlPbihsaW5lSXRlbSwgJ2lzU2VsZWN0JykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHNweU9uKGxpbmVJdGVtLCAnaXNBdHRyaWJ1dGUnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNMaW5rQXR0cmlidXRlU3VnZ2VzdChsaW5lSXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBub3QgYW4gYXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcihsaW5lSXRlbXMpLFxuICAgICAgICAgICAgICAgIGxpbmVJdGVtID0gc3RlcEhhbmRsZXIubGluZUl0ZW1Hcm91cHNbMF0uaXRlbXNbMF07XG4gICAgICAgICAgICBzcHlPbihsaW5lSXRlbSwgJ2lzU2VsZWN0JykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgc3B5T24obGluZUl0ZW0sICdpc0F0dHJpYnV0ZScpLmFuZC5yZXR1cm5WYWx1ZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNNYW5hZ2VkQXR0cmlidXRlU3VnZ2VzdChsaW5lSXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB1c2VMaW5rQXR0cmlidXRlVmFsdWVGb3JSZXZvY2F0aW9uTW9kaWZpY2F0aW9uIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXIgPSBuZXcgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyKGxpbmVJdGVtcyksXG4gICAgICAgICAgICAgICAgbGluZUl0ZW0gPSBzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwc1swXS5pdGVtc1swXTtcbiAgICAgICAgICAgIHNweU9uKGxpbmVJdGVtLCAnaXNTZWxlY3QnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBzcHlPbihsaW5lSXRlbSwgJ2lzQXR0cmlidXRlJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgdXNlTGlua0F0dHJpYnV0ZVZhbHVlRm9yUmV2b2NhdGlvbk1vZGlmaWNhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNNYW5hZ2VkQXR0cmlidXRlU3VnZ2VzdChsaW5lSXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGF0dHJpYnV0ZSB3aXRoIHNlbGVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIobGluZUl0ZW1zKSxcbiAgICAgICAgICAgICAgICBsaW5lSXRlbSA9IHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdO1xuICAgICAgICAgICAgc3B5T24obGluZUl0ZW0sICdpc1NlbGVjdCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIHNweU9uKGxpbmVJdGVtLCAnaXNBdHRyaWJ1dGUnKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNNYW5hZ2VkQXR0cmlidXRlU3VnZ2VzdChsaW5lSXRlbSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzTGlua0F0dHJpYnV0ZVN1Z2dlc3QoKScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgbGluZSBpdGVtIGlzIG5vdCBzZWxlY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RlcEhhbmRsZXIgPSBuZXcgUmV2b2NhdGlvbk1vZGlmaWNhdGlvblN0ZXBIYW5kbGVyKGxpbmVJdGVtcyksXG4gICAgICAgICAgICAgICAgbGluZUl0ZW0gPSBzdGVwSGFuZGxlci5saW5lSXRlbUdyb3Vwc1swXS5pdGVtc1swXTtcbiAgICAgICAgICAgIHNweU9uKGxpbmVJdGVtLCAnaXNTZWxlY3QnKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgc3B5T24obGluZUl0ZW0sICdpc1Blcm1pc3Npb24nKS5hbmQucmV0dXJuVmFsdWUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3Qoc3RlcEhhbmRsZXIuaXNMaW5rQXR0cmlidXRlU3VnZ2VzdChsaW5lSXRlbSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBsaW5lIGl0ZW0gaXMgYXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0ZXBIYW5kbGVyID0gbmV3IFJldm9jYXRpb25Nb2RpZmljYXRpb25TdGVwSGFuZGxlcihsaW5lSXRlbXMpLFxuICAgICAgICAgICAgICAgIGxpbmVJdGVtID0gc3RlcEhhbmRsZXIubGluZUl0ZW1Hcm91cHNbMF0uaXRlbXNbMF07XG4gICAgICAgICAgICBzcHlPbihsaW5lSXRlbSwgJ2lzU2VsZWN0JykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgc3B5T24obGluZUl0ZW0sICdpc1Blcm1pc3Npb24nKS5hbmQucmV0dXJuVmFsdWUoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzTGlua0F0dHJpYnV0ZVN1Z2dlc3QobGluZUl0ZW0pKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBsaW5lIGl0ZW0gaXMgcGVybWlzc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIobGluZUl0ZW1zKSxcbiAgICAgICAgICAgICAgICBsaW5lSXRlbSA9IHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdO1xuICAgICAgICAgICAgc3B5T24obGluZUl0ZW0sICdpc1NlbGVjdCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIHNweU9uKGxpbmVJdGVtLCAnaXNQZXJtaXNzaW9uJykuYW5kLnJldHVyblZhbHVlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzTGlua0F0dHJpYnV0ZVN1Z2dlc3QobGluZUl0ZW0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIHVzZUxpbmtBdHRyaWJ1dGVWYWx1ZUZvclJldm9jYXRpb25Nb2RpZmljYXRpb24gaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdGVwSGFuZGxlciA9IG5ldyBSZXZvY2F0aW9uTW9kaWZpY2F0aW9uU3RlcEhhbmRsZXIobGluZUl0ZW1zKSxcbiAgICAgICAgICAgICAgICBsaW5lSXRlbSA9IHN0ZXBIYW5kbGVyLmxpbmVJdGVtR3JvdXBzWzBdLml0ZW1zWzBdO1xuICAgICAgICAgICAgc3B5T24obGluZUl0ZW0sICdpc1NlbGVjdCcpLmFuZC5yZXR1cm5WYWx1ZSh0cnVlKTtcbiAgICAgICAgICAgIHNweU9uKGxpbmVJdGVtLCAnaXNQZXJtaXNzaW9uJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIHVzZUxpbmtBdHRyaWJ1dGVWYWx1ZUZvclJldm9jYXRpb25Nb2RpZmljYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgZXhwZWN0KHN0ZXBIYW5kbGVyLmlzTGlua0F0dHJpYnV0ZVN1Z2dlc3QobGluZUl0ZW0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
