System.register(['test/js/TestInitializer', 'common/managedattribute/ManagedAttributeModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var managedAttributeModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonManagedattributeManagedAttributeModule) {
            managedAttributeModule = _commonManagedattributeManagedAttributeModule['default'];
        }],
        execute: function () {

            describe('ManagedAttributeDetail', function () {

                var ManagedAttributeDetail = undefined,
                    Entitlement = undefined,
                    entitlement = {
                    application: 'Entitlement App',
                    instance: 'instance1',
                    nativeIdentity: 'something',
                    accountName: 'Entitlement Account',
                    permission: true,
                    annotation: 'annotate things...',
                    attribute: 'USER_DB',
                    value: 'DELETE',
                    displayValue: 'User Database',
                    description: 'Delete this.',
                    name: 'Some name',
                    aggregationState: 'state',
                    group: true
                },
                    managedAttributeData = {
                    id: '1234',
                    application: 'someapp',
                    type: 'someType',
                    attribute: 'myName',
                    value: 'value',
                    displayValue: 'Display',
                    description: 'This is some attribute.',
                    requestable: false,
                    owner: 'ME',
                    extendedAttributes: {
                        id: 'Id',
                        name: 'My name'
                    },
                    groupEntitlements: [entitlement],
                    hasInheritance: true
                };

                beforeEach(module(managedAttributeModule));

                beforeEach(inject(function (_Entitlement_, _ManagedAttributeDetail_) {
                    ManagedAttributeDetail = _ManagedAttributeDetail_;
                    Entitlement = _Entitlement_;
                }));

                describe('constructor', function () {

                    it('should throw with no ManagedAttributeDetail data', function () {
                        expect(function () {
                            return new ManagedAttributeDetail(null);
                        }).toThrow();
                    });

                    it('sets properties for the ManagedAttribute', function () {

                        var managedAttribute = new ManagedAttributeDetail(managedAttributeData);
                        expect(managedAttribute.id).toEqual(managedAttributeData.id);
                        expect(managedAttribute.application).toEqual(managedAttributeData.application);
                        expect(managedAttribute.type).toEqual(managedAttributeData.type);
                        expect(managedAttribute.attribute).toEqual(managedAttributeData.attribute);
                        expect(managedAttribute.value).toEqual(managedAttributeData.value);
                        expect(managedAttribute.displayValue).toEqual(managedAttributeData.displayValue);
                        expect(managedAttribute.description).toEqual(managedAttributeData.description);
                        expect(managedAttribute.requestable).toEqual(managedAttributeData.requestable);
                        expect(managedAttribute.owner).toEqual(managedAttributeData.owner);
                        expect(managedAttribute.extendedAttributes).toEqual(managedAttributeData.extendedAttributes);
                        expect(managedAttribute.groupEntitlements.length).toEqual(1);
                        expect(managedAttribute.groupEntitlements[0] instanceof Entitlement).toEqual(true);
                        expect(managedAttribute.hasInheritance).toEqual(managedAttributeData.hasInheritance);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9tYW5hZ2VkYXR0cmlidXRlL01hbmFnZWRBdHRyaWJ1dGVEZXRhaWxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsbURBQW1ELFVBQVUsU0FBUzs7O0lBRzlHOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwrQ0FBK0M7WUFDckcseUJBQXlCLDhDQUE4Qzs7UUFFM0UsU0FBUyxZQUFZOztZQUw3QixTQUFTLDBCQUEwQixZQUFNOztnQkFFckMsSUFBSSx5QkFBc0I7b0JBQ3RCLGNBQVc7b0JBQ1gsY0FBYztvQkFDVixhQUFhO29CQUNiLFVBQVU7b0JBQ1YsZ0JBQWdCO29CQUNoQixhQUFhO29CQUNiLFlBQVk7b0JBQ1osWUFBWTtvQkFDWixXQUFXO29CQUNYLE9BQU87b0JBQ1AsY0FBYztvQkFDZCxhQUFhO29CQUNiLE1BQU07b0JBQ04sa0JBQWtCO29CQUNsQixPQUFPOztvQkFFWCx1QkFBdUI7b0JBQ25CLElBQUk7b0JBQ0osYUFBYTtvQkFDYixNQUFNO29CQUNOLFdBQVc7b0JBQ1gsT0FBTztvQkFDUCxjQUFjO29CQUNkLGFBQWE7b0JBQ2IsYUFBYTtvQkFDYixPQUFPO29CQUNQLG9CQUFvQjt3QkFDaEIsSUFBSTt3QkFDSixNQUFNOztvQkFFVixtQkFBbUIsQ0FBQztvQkFDcEIsZ0JBQWdCOzs7Z0JBR3hCLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLGVBQWUsMEJBQTZCO29CQUMzRCx5QkFBeUI7b0JBQ3pCLGNBQWM7OztnQkFJbEIsU0FBUyxlQUFlLFlBQU07O29CQUUxQixHQUFHLG9EQUFvRCxZQUFNO3dCQUN6RCxPQUFPLFlBQUE7NEJBT1MsT0FQSCxJQUFJLHVCQUF1QjsyQkFBTzs7O29CQUduRCxHQUFHLDRDQUE0QyxZQUFNOzt3QkFFakQsSUFBSSxtQkFBbUIsSUFBSSx1QkFBdUI7d0JBQ2xELE9BQU8saUJBQWlCLElBQUksUUFBUSxxQkFBcUI7d0JBQ3pELE9BQU8saUJBQWlCLGFBQWEsUUFBUSxxQkFBcUI7d0JBQ2xFLE9BQU8saUJBQWlCLE1BQU0sUUFBUSxxQkFBcUI7d0JBQzNELE9BQU8saUJBQWlCLFdBQVcsUUFBUSxxQkFBcUI7d0JBQ2hFLE9BQU8saUJBQWlCLE9BQU8sUUFBUSxxQkFBcUI7d0JBQzVELE9BQU8saUJBQWlCLGNBQWMsUUFBUSxxQkFBcUI7d0JBQ25FLE9BQU8saUJBQWlCLGFBQWEsUUFBUSxxQkFBcUI7d0JBQ2xFLE9BQU8saUJBQWlCLGFBQWEsUUFBUSxxQkFBcUI7d0JBQ2xFLE9BQU8saUJBQWlCLE9BQU8sUUFBUSxxQkFBcUI7d0JBQzVELE9BQU8saUJBQWlCLG9CQUFvQixRQUFRLHFCQUFxQjt3QkFDekUsT0FBTyxpQkFBaUIsa0JBQWtCLFFBQVEsUUFBUTt3QkFDMUQsT0FBTyxpQkFBaUIsa0JBQWtCLGNBQWMsYUFBYSxRQUFRO3dCQUM3RSxPQUFPLGlCQUFpQixnQkFBZ0IsUUFBUSxxQkFBcUI7Ozs7OztHQWM5RSIsImZpbGUiOiJjb21tb24vbWFuYWdlZGF0dHJpYnV0ZS9NYW5hZ2VkQXR0cmlidXRlRGV0YWlsVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cclxuXHJcbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgbWFuYWdlZEF0dHJpYnV0ZU1vZHVsZSBmcm9tICdjb21tb24vbWFuYWdlZGF0dHJpYnV0ZS9NYW5hZ2VkQXR0cmlidXRlTW9kdWxlJztcclxuXHJcbmRlc2NyaWJlKCdNYW5hZ2VkQXR0cmlidXRlRGV0YWlsJywgKCkgPT4ge1xyXG5cclxuICAgIGxldCBNYW5hZ2VkQXR0cmlidXRlRGV0YWlsLFxyXG4gICAgICAgIEVudGl0bGVtZW50LFxyXG4gICAgICAgIGVudGl0bGVtZW50ID0ge1xyXG4gICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0VudGl0bGVtZW50IEFwcCcsXHJcbiAgICAgICAgICAgIGluc3RhbmNlOiAnaW5zdGFuY2UxJyxcclxuICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICdzb21ldGhpbmcnLFxyXG4gICAgICAgICAgICBhY2NvdW50TmFtZTogJ0VudGl0bGVtZW50IEFjY291bnQnLFxyXG4gICAgICAgICAgICBwZXJtaXNzaW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBhbm5vdGF0aW9uOiAnYW5ub3RhdGUgdGhpbmdzLi4uJyxcclxuICAgICAgICAgICAgYXR0cmlidXRlOiAnVVNFUl9EQicsXHJcbiAgICAgICAgICAgIHZhbHVlOiAnREVMRVRFJyxcclxuICAgICAgICAgICAgZGlzcGxheVZhbHVlOiAnVXNlciBEYXRhYmFzZScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVsZXRlIHRoaXMuJyxcclxuICAgICAgICAgICAgbmFtZTogJ1NvbWUgbmFtZScsXHJcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uU3RhdGU6ICdzdGF0ZScsXHJcbiAgICAgICAgICAgIGdyb3VwOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtYW5hZ2VkQXR0cmlidXRlRGF0YSA9IHtcclxuICAgICAgICAgICAgaWQ6ICcxMjM0JyxcclxuICAgICAgICAgICAgYXBwbGljYXRpb246ICdzb21lYXBwJyxcclxuICAgICAgICAgICAgdHlwZTogJ3NvbWVUeXBlJyxcclxuICAgICAgICAgICAgYXR0cmlidXRlOiAnbXlOYW1lJyxcclxuICAgICAgICAgICAgdmFsdWU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgIGRpc3BsYXlWYWx1ZTogJ0Rpc3BsYXknLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgc29tZSBhdHRyaWJ1dGUuJyxcclxuICAgICAgICAgICAgcmVxdWVzdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBvd25lcjogJ01FJyxcclxuICAgICAgICAgICAgZXh0ZW5kZWRBdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ0lkJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdNeSBuYW1lJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncm91cEVudGl0bGVtZW50czogW2VudGl0bGVtZW50XSxcclxuICAgICAgICAgICAgaGFzSW5oZXJpdGFuY2U6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKG1hbmFnZWRBdHRyaWJ1dGVNb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdCgoX0VudGl0bGVtZW50XywgX01hbmFnZWRBdHRyaWJ1dGVEZXRhaWxfKSA9PiB7XHJcbiAgICAgICAgTWFuYWdlZEF0dHJpYnV0ZURldGFpbCA9IF9NYW5hZ2VkQXR0cmlidXRlRGV0YWlsXztcclxuICAgICAgICBFbnRpdGxlbWVudCA9IF9FbnRpdGxlbWVudF87XHJcbiAgICB9KSk7XHJcblxyXG5cclxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsICgpID0+IHtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aXRoIG5vIE1hbmFnZWRBdHRyaWJ1dGVEZXRhaWwgZGF0YScsICgpID0+IHtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IG5ldyBNYW5hZ2VkQXR0cmlidXRlRGV0YWlsKG51bGwpKS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdzZXRzIHByb3BlcnRpZXMgZm9yIHRoZSBNYW5hZ2VkQXR0cmlidXRlJywgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1hbmFnZWRBdHRyaWJ1dGUgPSBuZXcgTWFuYWdlZEF0dHJpYnV0ZURldGFpbChtYW5hZ2VkQXR0cmlidXRlRGF0YSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlLmlkKS50b0VxdWFsKG1hbmFnZWRBdHRyaWJ1dGVEYXRhLmlkKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGUuYXBwbGljYXRpb24pLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZURhdGEuYXBwbGljYXRpb24pO1xyXG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZS50eXBlKS50b0VxdWFsKG1hbmFnZWRBdHRyaWJ1dGVEYXRhLnR5cGUpO1xyXG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZS5hdHRyaWJ1dGUpLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZURhdGEuYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGUudmFsdWUpLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZURhdGEudmFsdWUpO1xyXG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZS5kaXNwbGF5VmFsdWUpLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZURhdGEuZGlzcGxheVZhbHVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGUuZGVzY3JpcHRpb24pLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZURhdGEuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICBleHBlY3QobWFuYWdlZEF0dHJpYnV0ZS5yZXF1ZXN0YWJsZSkudG9FcXVhbChtYW5hZ2VkQXR0cmlidXRlRGF0YS5yZXF1ZXN0YWJsZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlLm93bmVyKS50b0VxdWFsKG1hbmFnZWRBdHRyaWJ1dGVEYXRhLm93bmVyKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGUuZXh0ZW5kZWRBdHRyaWJ1dGVzKS50b0VxdWFsKG1hbmFnZWRBdHRyaWJ1dGVEYXRhLmV4dGVuZGVkQXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChtYW5hZ2VkQXR0cmlidXRlLmdyb3VwRW50aXRsZW1lbnRzLmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGUuZ3JvdXBFbnRpdGxlbWVudHNbMF0gaW5zdGFuY2VvZiBFbnRpdGxlbWVudCkudG9FcXVhbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KG1hbmFnZWRBdHRyaWJ1dGUuaGFzSW5oZXJpdGFuY2UpLnRvRXF1YWwobWFuYWdlZEF0dHJpYnV0ZURhdGEuaGFzSW5oZXJpdGFuY2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
