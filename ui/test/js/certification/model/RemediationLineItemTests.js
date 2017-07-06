System.register(['test/js/TestInitializer', 'certification/CertificationModule', '../CertificationTestData'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}],
        execute: function () {

            describe('RemediationLineItem', function () {

                beforeEach(module(certificationModule));

                var data = undefined,
                    RemediationLineItem = undefined;

                beforeEach(inject(function (_RemediationLineItem_, certificationTestData) {
                    RemediationLineItem = _RemediationLineItem_;
                    data = angular.copy(certificationTestData.REMEDIATION_ADVICE_RESULT.summary.remediationDetails[0]);
                }));

                describe('constructor', function () {
                    it('should initialize with data', function () {
                        var lineItem = new RemediationLineItem(data);
                        expect(lineItem.application).toEqual(data.application);
                        expect(lineItem.applicationId).toEqual(data.applicationId);
                        expect(lineItem.account).toEqual(data.account);
                        expect(lineItem.nativeIdentity).toEqual(data.nativeIdentity);
                        expect(lineItem.attribute).toEqual(data.attribute);
                        expect(lineItem.attributeValue).toEqual(data.attributeValue);
                        expect(lineItem.inputType).toEqual(data.inputType);
                        expect(lineItem.editable).toEqual(data.editable);
                        expect(lineItem.existingRemediation).toEqual(data.existingRemediation);
                        lineItem.allowedOperations.forEach(function (option, idx) {
                            expect(option.value).toEqual(data.selectOptions[idx][0]);
                            expect(option.label).toEqual(data.selectOptions[idx][1]);
                        });
                        expect(lineItem.newOperation).toEqual(data.operation[0]);
                        expect(lineItem.newValue).toEqual(lineItem.attributeValue);
                    });
                });

                describe('isPermission()', function () {
                    it('returns false if not permission', function () {
                        var lineItem = new RemediationLineItem({
                            permissionTarget: undefined,
                            attribute: 'attr1'
                        });
                        expect(lineItem.isPermission()).toEqual(false);
                    });

                    it('returns true if permissionTarget is set', function () {
                        var lineItem = new RemediationLineItem({
                            permissionTarget: 'perm1',
                            attribute: undefined
                        });
                        expect(lineItem.isPermission()).toEqual(true);
                    });
                });

                describe('isAttribute()', function () {
                    it('returns false if not attribute', function () {
                        var lineItem = new RemediationLineItem({
                            permissionTarget: 'perm1',
                            attribute: undefined
                        });
                        expect(lineItem.isAttribute()).toEqual(false);
                    });

                    it('returns true if attribute is set', function () {
                        var lineItem = new RemediationLineItem({
                            permissionTarget: undefined,
                            attribute: 'attr1'
                        });
                        expect(lineItem.isAttribute()).toEqual(true);
                    });
                });

                describe('isFreeText()', function () {
                    it('returns false if input type is not free text', function () {
                        var lineItem = new RemediationLineItem({
                            inputType: 'select'
                        });
                        expect(lineItem.isFreeText()).toEqual(false);
                    });

                    it('returns true if input type is free text', function () {
                        var lineItem = new RemediationLineItem({
                            inputType: 'text'
                        });
                        expect(lineItem.isFreeText()).toEqual(true);
                    });
                });

                describe('isSelect()', function () {
                    it('returns false if input type is not select', function () {
                        var lineItem = new RemediationLineItem({
                            inputType: 'text'
                        });
                        expect(lineItem.isSelect()).toEqual(false);
                    });

                    it('returns true if input type is select', function () {
                        var lineItem = new RemediationLineItem({
                            inputType: 'select'
                        });
                        expect(lineItem.isSelect()).toEqual(true);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvUmVtZWRpYXRpb25MaW5lSXRlbVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsNkJBQTZCLFVBQVUsU0FBUzs7SUFFN0g7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDO1dBQ3pELFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7WUFKN0IsU0FBUyx1QkFBdUIsWUFBTTs7Z0JBRWxDLFdBQVcsT0FBTzs7Z0JBRWxCLElBQUksT0FBSTtvQkFBRSxzQkFBbUI7O2dCQUU3QixXQUFXLE9BQU8sVUFBQyx1QkFBdUIsdUJBQTBCO29CQUNoRSxzQkFBc0I7b0JBQ3RCLE9BQU8sUUFBUSxLQUFLLHNCQUFzQiwwQkFBMEIsUUFBUSxtQkFBbUI7OztnQkFHbkcsU0FBUyxlQUFlLFlBQU07b0JBQzFCLEdBQUcsK0JBQStCLFlBQU07d0JBQ3BDLElBQUksV0FBVyxJQUFJLG9CQUFvQjt3QkFDdkMsT0FBTyxTQUFTLGFBQWEsUUFBUSxLQUFLO3dCQUMxQyxPQUFPLFNBQVMsZUFBZSxRQUFRLEtBQUs7d0JBQzVDLE9BQU8sU0FBUyxTQUFTLFFBQVEsS0FBSzt3QkFDdEMsT0FBTyxTQUFTLGdCQUFnQixRQUFRLEtBQUs7d0JBQzdDLE9BQU8sU0FBUyxXQUFXLFFBQVEsS0FBSzt3QkFDeEMsT0FBTyxTQUFTLGdCQUFnQixRQUFRLEtBQUs7d0JBQzdDLE9BQU8sU0FBUyxXQUFXLFFBQVEsS0FBSzt3QkFDeEMsT0FBTyxTQUFTLFVBQVUsUUFBUSxLQUFLO3dCQUN2QyxPQUFPLFNBQVMscUJBQXFCLFFBQVEsS0FBSzt3QkFDbEQsU0FBUyxrQkFBa0IsUUFBUSxVQUFDLFFBQVEsS0FBUTs0QkFDaEQsT0FBTyxPQUFPLE9BQU8sUUFBUSxLQUFLLGNBQWMsS0FBSzs0QkFDckQsT0FBTyxPQUFPLE9BQU8sUUFBUSxLQUFLLGNBQWMsS0FBSzs7d0JBRXpELE9BQU8sU0FBUyxjQUFjLFFBQVEsS0FBSyxVQUFVO3dCQUNyRCxPQUFPLFNBQVMsVUFBVSxRQUFRLFNBQVM7Ozs7Z0JBSW5ELFNBQVMsa0JBQWtCLFlBQU07b0JBQzdCLEdBQUcsbUNBQW1DLFlBQU07d0JBQ3hDLElBQUksV0FBVyxJQUFJLG9CQUFvQjs0QkFDbkMsa0JBQWtCOzRCQUNsQixXQUFXOzt3QkFFZixPQUFPLFNBQVMsZ0JBQWdCLFFBQVE7OztvQkFHNUMsR0FBRywyQ0FBMkMsWUFBTTt3QkFDaEQsSUFBSSxXQUFXLElBQUksb0JBQW9COzRCQUNuQyxrQkFBa0I7NEJBQ2xCLFdBQVc7O3dCQUVmLE9BQU8sU0FBUyxnQkFBZ0IsUUFBUTs7OztnQkFJaEQsU0FBUyxpQkFBaUIsWUFBTTtvQkFDNUIsR0FBRyxrQ0FBa0MsWUFBTTt3QkFDdkMsSUFBSSxXQUFXLElBQUksb0JBQW9COzRCQUNuQyxrQkFBa0I7NEJBQ2xCLFdBQVc7O3dCQUVmLE9BQU8sU0FBUyxlQUFlLFFBQVE7OztvQkFHM0MsR0FBRyxvQ0FBb0MsWUFBTTt3QkFDekMsSUFBSSxXQUFXLElBQUksb0JBQW9COzRCQUNuQyxrQkFBa0I7NEJBQ2xCLFdBQVc7O3dCQUVmLE9BQU8sU0FBUyxlQUFlLFFBQVE7Ozs7Z0JBSS9DLFNBQVMsZ0JBQWdCLFlBQU07b0JBQzNCLEdBQUcsZ0RBQWdELFlBQU07d0JBQ3JELElBQUksV0FBVyxJQUFJLG9CQUFvQjs0QkFDbkMsV0FBVzs7d0JBRWYsT0FBTyxTQUFTLGNBQWMsUUFBUTs7O29CQUcxQyxHQUFHLDJDQUEyQyxZQUFNO3dCQUNoRCxJQUFJLFdBQVcsSUFBSSxvQkFBb0I7NEJBQ25DLFdBQVc7O3dCQUVmLE9BQU8sU0FBUyxjQUFjLFFBQVE7Ozs7Z0JBSTlDLFNBQVMsY0FBYyxZQUFNO29CQUN6QixHQUFHLDZDQUE2QyxZQUFNO3dCQUNsRCxJQUFJLFdBQVcsSUFBSSxvQkFBb0I7NEJBQ25DLFdBQVc7O3dCQUVmLE9BQU8sU0FBUyxZQUFZLFFBQVE7OztvQkFHeEMsR0FBRyx3Q0FBd0MsWUFBTTt3QkFDN0MsSUFBSSxXQUFXLElBQUksb0JBQW9COzRCQUNuQyxXQUFXOzt3QkFFZixPQUFPLFNBQVMsWUFBWSxRQUFROzs7Ozs7R0FhN0MiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9tb2RlbC9SZW1lZGlhdGlvbkxpbmVJdGVtVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAnLi4vQ2VydGlmaWNhdGlvblRlc3REYXRhJztcblxuZGVzY3JpYmUoJ1JlbWVkaWF0aW9uTGluZUl0ZW0nLCAoKSA9PiB7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XG5cbiAgICBsZXQgZGF0YSwgUmVtZWRpYXRpb25MaW5lSXRlbTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfUmVtZWRpYXRpb25MaW5lSXRlbV8sIGNlcnRpZmljYXRpb25UZXN0RGF0YSkgPT4ge1xuICAgICAgICBSZW1lZGlhdGlvbkxpbmVJdGVtID0gX1JlbWVkaWF0aW9uTGluZUl0ZW1fO1xuICAgICAgICBkYXRhID0gYW5ndWxhci5jb3B5KGNlcnRpZmljYXRpb25UZXN0RGF0YS5SRU1FRElBVElPTl9BRFZJQ0VfUkVTVUxULnN1bW1hcnkucmVtZWRpYXRpb25EZXRhaWxzWzBdKTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGRhdGEnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZUl0ZW0gPSBuZXcgUmVtZWRpYXRpb25MaW5lSXRlbShkYXRhKTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5hcHBsaWNhdGlvbikudG9FcXVhbChkYXRhLmFwcGxpY2F0aW9uKTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5hcHBsaWNhdGlvbklkKS50b0VxdWFsKGRhdGEuYXBwbGljYXRpb25JZCk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uYWNjb3VudCkudG9FcXVhbChkYXRhLmFjY291bnQpO1xuICAgICAgICAgICAgZXhwZWN0KGxpbmVJdGVtLm5hdGl2ZUlkZW50aXR5KS50b0VxdWFsKGRhdGEubmF0aXZlSWRlbnRpdHkpO1xuICAgICAgICAgICAgZXhwZWN0KGxpbmVJdGVtLmF0dHJpYnV0ZSkudG9FcXVhbChkYXRhLmF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uYXR0cmlidXRlVmFsdWUpLnRvRXF1YWwoZGF0YS5hdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uaW5wdXRUeXBlKS50b0VxdWFsKGRhdGEuaW5wdXRUeXBlKTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5lZGl0YWJsZSkudG9FcXVhbChkYXRhLmVkaXRhYmxlKTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5leGlzdGluZ1JlbWVkaWF0aW9uKS50b0VxdWFsKGRhdGEuZXhpc3RpbmdSZW1lZGlhdGlvbik7XG4gICAgICAgICAgICBsaW5lSXRlbS5hbGxvd2VkT3BlcmF0aW9ucy5mb3JFYWNoKChvcHRpb24sIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChvcHRpb24udmFsdWUpLnRvRXF1YWwoZGF0YS5zZWxlY3RPcHRpb25zW2lkeF1bMF0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvcHRpb24ubGFiZWwpLnRvRXF1YWwoZGF0YS5zZWxlY3RPcHRpb25zW2lkeF1bMV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0ubmV3T3BlcmF0aW9uKS50b0VxdWFsKGRhdGEub3BlcmF0aW9uWzBdKTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5uZXdWYWx1ZSkudG9FcXVhbChsaW5lSXRlbS5hdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzUGVybWlzc2lvbigpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBub3QgcGVybWlzc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBsaW5lSXRlbSA9IG5ldyBSZW1lZGlhdGlvbkxpbmVJdGVtKHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uVGFyZ2V0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlOiAnYXR0cjEnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5pc1Blcm1pc3Npb24oKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgcGVybWlzc2lvblRhcmdldCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZUl0ZW0gPSBuZXcgUmVtZWRpYXRpb25MaW5lSXRlbSh7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvblRhcmdldDogJ3Blcm0xJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGU6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uaXNQZXJtaXNzaW9uKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzQXR0cmlidXRlKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIG5vdCBhdHRyaWJ1dGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZUl0ZW0gPSBuZXcgUmVtZWRpYXRpb25MaW5lSXRlbSh7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvblRhcmdldDogJ3Blcm0xJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGU6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uaXNBdHRyaWJ1dGUoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgYXR0cmlidXRlIGlzIHNldCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBsaW5lSXRlbSA9IG5ldyBSZW1lZGlhdGlvbkxpbmVJdGVtKHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uVGFyZ2V0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlOiAnYXR0cjEnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5pc0F0dHJpYnV0ZSgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpc0ZyZWVUZXh0KCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGlucHV0IHR5cGUgaXMgbm90IGZyZWUgdGV4dCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBsaW5lSXRlbSA9IG5ldyBSZW1lZGlhdGlvbkxpbmVJdGVtKHtcbiAgICAgICAgICAgICAgICBpbnB1dFR5cGU6ICdzZWxlY3QnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5pc0ZyZWVUZXh0KCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGlmIGlucHV0IHR5cGUgaXMgZnJlZSB0ZXh0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGxpbmVJdGVtID0gbmV3IFJlbWVkaWF0aW9uTGluZUl0ZW0oe1xuICAgICAgICAgICAgICAgIGlucHV0VHlwZTogJ3RleHQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lSXRlbS5pc0ZyZWVUZXh0KCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzU2VsZWN0KCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGlucHV0IHR5cGUgaXMgbm90IHNlbGVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBsaW5lSXRlbSA9IG5ldyBSZW1lZGlhdGlvbkxpbmVJdGVtKHtcbiAgICAgICAgICAgICAgICBpbnB1dFR5cGU6ICd0ZXh0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uaXNTZWxlY3QoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgaW5wdXQgdHlwZSBpcyBzZWxlY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZUl0ZW0gPSBuZXcgUmVtZWRpYXRpb25MaW5lSXRlbSh7XG4gICAgICAgICAgICAgICAgaW5wdXRUeXBlOiAnc2VsZWN0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QobGluZUl0ZW0uaXNTZWxlY3QoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
