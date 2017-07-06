System.register(['test/js/TestInitializer', 'common/util/UtilModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var utilModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonUtilUtilModule) {
            utilModule = _commonUtilUtilModule['default'];
        }],
        execute: function () {

            describe('objectUtilService', function () {
                var objectUtilService = undefined;

                beforeEach(module(utilModule));

                beforeEach(inject(function (_objectUtilService_) {
                    objectUtilService = _objectUtilService_;
                }));

                describe('getObjectValue()', function () {
                    it('gets the value if there is a getter on the object', function () {
                        var dataObject = {
                            getFoo: function () {
                                return 'bar';
                            }
                        };
                        expect(objectUtilService.getObjectValue(dataObject, 'foo')).toBe('bar');
                    });

                    it('gets the value if it is a property on the object', function () {
                        var dataObject = {
                            foo: 'bar'
                        };
                        expect(objectUtilService.getObjectValue(dataObject, 'foo')).toBe('bar');
                    });

                    it('gets the value if it is a property on the attributes of the object', function () {
                        var dataObject = {
                            attributes: {
                                foo: 'bar'
                            }
                        };
                        expect(objectUtilService.getObjectValue(dataObject, 'foo')).toBe('bar');
                    });
                });

                describe('valueEquals', function () {
                    it('returns true if values are equal', function () {
                        expect(objectUtilService.valueEquals('abc', 'abc')).toEqual(true);
                        expect(objectUtilService.valueEquals(123, 123)).toEqual(true);
                        expect(objectUtilService.valueEquals(undefined, undefined)).toEqual(true);
                        expect(objectUtilService.valueEquals(null, null)).toEqual(true);
                    });

                    it('returns true if one value is undefined and other value is null', function () {
                        expect(objectUtilService.valueEquals(undefined, null)).toEqual(true);
                        expect(objectUtilService.valueEquals(null, undefined)).toEqual(true);
                    });

                    it('returns false if values are not equal', function () {
                        expect(objectUtilService.valueEquals('abc', 'def')).toEqual(false);
                        expect(objectUtilService.valueEquals(123, 456)).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi91dGlsL09iamVjdFV0aWxTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixVQUFVLFNBQVM7OztJQUd0Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsdUJBQXVCO1lBQzdFLGFBQWEsc0JBQXNCOztRQUV2QyxTQUFTLFlBQVk7O1lBTDdCLFNBQVMscUJBQXFCLFlBQU07Z0JBQ2hDLElBQUksb0JBQWlCOztnQkFFckIsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMscUJBQXdCO29CQUN2QyxvQkFBb0I7OztnQkFHeEIsU0FBUyxvQkFBb0IsWUFBVztvQkFDcEMsR0FBRyxxREFBcUQsWUFBVzt3QkFDL0QsSUFBSSxhQUFhOzRCQUNiLFFBQVEsWUFBVztnQ0FDZixPQUFPOzs7d0JBR2YsT0FBTyxrQkFBa0IsZUFBZSxZQUFZLFFBQVEsS0FBSzs7O29CQUdyRSxHQUFHLG9EQUFvRCxZQUFXO3dCQUM5RCxJQUFJLGFBQWE7NEJBQ2IsS0FBSzs7d0JBRVQsT0FBTyxrQkFBa0IsZUFBZSxZQUFZLFFBQVEsS0FBSzs7O29CQUdyRSxHQUFHLHNFQUFzRSxZQUFXO3dCQUNoRixJQUFJLGFBQWE7NEJBQ2IsWUFBWTtnQ0FDUixLQUFLOzs7d0JBR2IsT0FBTyxrQkFBa0IsZUFBZSxZQUFZLFFBQVEsS0FBSzs7OztnQkFJekUsU0FBUyxlQUFlLFlBQU07b0JBQzFCLEdBQUcsb0NBQW9DLFlBQU07d0JBQ3pDLE9BQU8sa0JBQWtCLFlBQVksT0FBTyxRQUFRLFFBQVE7d0JBQzVELE9BQU8sa0JBQWtCLFlBQVksS0FBSyxNQUFNLFFBQVE7d0JBQ3hELE9BQU8sa0JBQWtCLFlBQVksV0FBVyxZQUFZLFFBQVE7d0JBQ3BFLE9BQU8sa0JBQWtCLFlBQVksTUFBTSxPQUFPLFFBQVE7OztvQkFHOUQsR0FBRyxrRUFBa0UsWUFBTTt3QkFDdkUsT0FBTyxrQkFBa0IsWUFBWSxXQUFXLE9BQU8sUUFBUTt3QkFDL0QsT0FBTyxrQkFBa0IsWUFBWSxNQUFNLFlBQVksUUFBUTs7O29CQUduRSxHQUFHLHlDQUF5QyxZQUFNO3dCQUM5QyxPQUFPLGtCQUFrQixZQUFZLE9BQU8sUUFBUSxRQUFRO3dCQUM1RCxPQUFPLGtCQUFrQixZQUFZLEtBQUssTUFBTSxRQUFROzs7Ozs7R0FhakUiLCJmaWxlIjoiY29tbW9uL3V0aWwvT2JqZWN0VXRpbFNlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCB1dGlsTW9kdWxlIGZyb20gJ2NvbW1vbi91dGlsL1V0aWxNb2R1bGUnO1xuXG5kZXNjcmliZSgnb2JqZWN0VXRpbFNlcnZpY2UnLCAoKSA9PiB7XG4gICAgbGV0IG9iamVjdFV0aWxTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUodXRpbE1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9vYmplY3RVdGlsU2VydmljZV8pID0+IHtcbiAgICAgICAgb2JqZWN0VXRpbFNlcnZpY2UgPSBfb2JqZWN0VXRpbFNlcnZpY2VfO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdnZXRPYmplY3RWYWx1ZSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdnZXRzIHRoZSB2YWx1ZSBpZiB0aGVyZSBpcyBhIGdldHRlciBvbiB0aGUgb2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGF0YU9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBnZXRGb286IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Jhcic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV4cGVjdChvYmplY3RVdGlsU2VydmljZS5nZXRPYmplY3RWYWx1ZShkYXRhT2JqZWN0LCAnZm9vJykpLnRvQmUoJ2JhcicpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZ2V0cyB0aGUgdmFsdWUgaWYgaXQgaXMgYSBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZGF0YU9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBmb286ICdiYXInXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KG9iamVjdFV0aWxTZXJ2aWNlLmdldE9iamVjdFZhbHVlKGRhdGFPYmplY3QsICdmb28nKSkudG9CZSgnYmFyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdnZXRzIHRoZSB2YWx1ZSBpZiBpdCBpcyBhIHByb3BlcnR5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBvYmplY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkYXRhT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZm9vOiAnYmFyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3Qob2JqZWN0VXRpbFNlcnZpY2UuZ2V0T2JqZWN0VmFsdWUoZGF0YU9iamVjdCwgJ2ZvbycpKS50b0JlKCdiYXInKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndmFsdWVFcXVhbHMnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdmFsdWVzIGFyZSBlcXVhbCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChvYmplY3RVdGlsU2VydmljZS52YWx1ZUVxdWFscygnYWJjJywgJ2FiYycpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KG9iamVjdFV0aWxTZXJ2aWNlLnZhbHVlRXF1YWxzKDEyMywgMTIzKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChvYmplY3RVdGlsU2VydmljZS52YWx1ZUVxdWFscyh1bmRlZmluZWQsIHVuZGVmaW5lZCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3Qob2JqZWN0VXRpbFNlcnZpY2UudmFsdWVFcXVhbHMobnVsbCwgbnVsbCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgb25lIHZhbHVlIGlzIHVuZGVmaW5lZCBhbmQgb3RoZXIgdmFsdWUgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChvYmplY3RVdGlsU2VydmljZS52YWx1ZUVxdWFscyh1bmRlZmluZWQsIG51bGwpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KG9iamVjdFV0aWxTZXJ2aWNlLnZhbHVlRXF1YWxzKG51bGwsIHVuZGVmaW5lZCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHZhbHVlcyBhcmUgbm90IGVxdWFsJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KG9iamVjdFV0aWxTZXJ2aWNlLnZhbHVlRXF1YWxzKCdhYmMnLCAnZGVmJykpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KG9iamVjdFV0aWxTZXJ2aWNlLnZhbHVlRXF1YWxzKDEyMywgNDU2KSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
