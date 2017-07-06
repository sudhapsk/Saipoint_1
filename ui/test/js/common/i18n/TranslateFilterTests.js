System.register(['test/js/TestInitializer', 'common/i18n/i18nModule'], function (_export) {

    /**
     * Tests for the TranslateFilter.
     */
    'use strict';

    var i18nModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonI18nI18nModule) {
            i18nModule = _commonI18nI18nModule['default'];
        }],
        execute: function () {
            describe('TranslateFilter', function () {

                // The filter to test.
                var translateFilter;

                // Mock $translate service.
                var $translate;

                // Let the tests know we'll use the i18n module.
                beforeEach(module(i18nModule));

                /**
                 * Create a mock $translate service that will be used by the filter.
                 */
                beforeEach(module(function ($provide) {
                    // Create a mock translate.
                    $translate = {
                        instant: jasmine.createSpy(),

                        // These are required to make translate happy.
                        storageKey: function () {
                            return 'hi mom';
                        },
                        storage: function () {
                            return null;
                        },
                        preferredLanguage: function () {
                            return null;
                        }
                    };

                    // Provide the mock as the $translate service, so the filter will use it.
                    $provide.factory('$translate', function () {
                        return $translate;
                    });
                }));

                /**
                 * Get an instance of the filter to test with.
                 */
                beforeEach(inject(function (spTranslateFilter) {
                    translateFilter = spTranslateFilter;
                }));

                /**
                 * Verify that the $translate service was called to translate the given
                 * message key and parameters.
                 *
                 * @param {String} key       The expected message key.
                 * @param {Object} [params]  An optional object containing the expected
                 *    variables that are passed to the translate call.
                 */
                var checkTranslate = function (key, params) {
                    var args = $translate.instant.calls.mostRecent().args,
                        actualKey = args[0],
                        actualParams = args[1],
                        actualValue;

                    expect($translate.instant).toHaveBeenCalled();
                    expect(key).toEqual(actualKey);

                    if (params) {
                        expect(actualParams).toBeDefined();

                        angular.forEach(params, function (paramVal, paramKey) {
                            actualValue = actualParams[paramKey];
                            expect(actualValue).toBeDefined();
                            expect(actualValue).toEqual(paramVal);
                        });
                    } else {
                        expect(actualParams).not.toBeDefined();
                    }
                };

                it('translates messages without params', function () {
                    var MSG = 'test_msg';
                    translateFilter(MSG);
                    checkTranslate(MSG);
                });

                it('translates messages with params', function () {
                    var MSG = 'test_msg {0} foo {1}';
                    translateFilter(MSG, 'hi', 'mom');
                    checkTranslate(MSG, {
                        var0: 'hi',
                        var1: 'mom'
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9pMThuL1RyYW5zbGF0ZUZpbHRlclRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwyQkFBMkIsVUFBVSxTQUFTOzs7OztJQUt0Rjs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsdUJBQXVCO1lBQzdFLGFBQWEsc0JBQXNCOztRQUV2QyxTQUFTLFlBQVk7WUFON0IsU0FBUyxtQkFBbUIsWUFBVzs7O2dCQUduQyxJQUFJOzs7Z0JBR0osSUFBSTs7O2dCQUdKLFdBQVcsT0FBTzs7Ozs7Z0JBS2xCLFdBQVcsT0FBTyxVQUFTLFVBQVU7O29CQUVqQyxhQUFhO3dCQUNULFNBQVMsUUFBUTs7O3dCQUdqQixZQUFZLFlBQVc7NEJBQUUsT0FBTzs7d0JBQ2hDLFNBQVMsWUFBVzs0QkFBRSxPQUFPOzt3QkFDN0IsbUJBQW1CLFlBQVc7NEJBQUUsT0FBTzs7Ozs7b0JBSTNDLFNBQVMsUUFBUSxjQUFjLFlBQVc7d0JBQ3RDLE9BQU87Ozs7Ozs7Z0JBT2YsV0FBVyxPQUFPLFVBQVMsbUJBQW1CO29CQUMxQyxrQkFBa0I7Ozs7Ozs7Ozs7O2dCQVl0QixJQUFJLGlCQUFpQixVQUFTLEtBQUssUUFBUTtvQkFDdkMsSUFBSSxPQUFPLFdBQVcsUUFBUSxNQUFNLGFBQWE7d0JBQzdDLFlBQVksS0FBSzt3QkFDakIsZUFBZSxLQUFLO3dCQUNwQjs7b0JBRUosT0FBTyxXQUFXLFNBQVM7b0JBQzNCLE9BQU8sS0FBSyxRQUFROztvQkFFcEIsSUFBSSxRQUFRO3dCQUNSLE9BQU8sY0FBYzs7d0JBRXJCLFFBQVEsUUFBUSxRQUFRLFVBQVMsVUFBVSxVQUFVOzRCQUNqRCxjQUFjLGFBQWE7NEJBQzNCLE9BQU8sYUFBYTs0QkFDcEIsT0FBTyxhQUFhLFFBQVE7OzJCQUcvQjt3QkFDRCxPQUFPLGNBQWMsSUFBSTs7OztnQkFLakMsR0FBRyxzQ0FBc0MsWUFBVztvQkFDaEQsSUFBSSxNQUFNO29CQUNWLGdCQUFnQjtvQkFDaEIsZUFBZTs7O2dCQUduQixHQUFHLG1DQUFtQyxZQUFXO29CQUM3QyxJQUFJLE1BQU07b0JBQ1YsZ0JBQWdCLEtBQUssTUFBTTtvQkFDM0IsZUFBZSxLQUFLO3dCQUNoQixNQUFNO3dCQUNOLE1BQU07Ozs7OztHQWdCZiIsImZpbGUiOiJjb21tb24vaTE4bi9UcmFuc2xhdGVGaWx0ZXJUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgaTE4bk1vZHVsZSBmcm9tICdjb21tb24vaTE4bi9pMThuTW9kdWxlJztcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBmb3IgdGhlIFRyYW5zbGF0ZUZpbHRlci5cclxuICovXHJcbmRlc2NyaWJlKCdUcmFuc2xhdGVGaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvLyBUaGUgZmlsdGVyIHRvIHRlc3QuXHJcbiAgICB2YXIgdHJhbnNsYXRlRmlsdGVyO1xyXG5cclxuICAgIC8vIE1vY2sgJHRyYW5zbGF0ZSBzZXJ2aWNlLlxyXG4gICAgdmFyICR0cmFuc2xhdGU7XHJcblxyXG4gICAgLy8gTGV0IHRoZSB0ZXN0cyBrbm93IHdlJ2xsIHVzZSB0aGUgaTE4biBtb2R1bGUuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShpMThuTW9kdWxlKSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBtb2NrICR0cmFuc2xhdGUgc2VydmljZSB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgZmlsdGVyLlxyXG4gICAgICovXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xyXG4gICAgICAgIC8vIENyZWF0ZSBhIG1vY2sgdHJhbnNsYXRlLlxyXG4gICAgICAgICR0cmFuc2xhdGUgPSB7XHJcbiAgICAgICAgICAgIGluc3RhbnQ6IGphc21pbmUuY3JlYXRlU3B5KCksXHJcblxyXG4gICAgICAgICAgICAvLyBUaGVzZSBhcmUgcmVxdWlyZWQgdG8gbWFrZSB0cmFuc2xhdGUgaGFwcHkuXHJcbiAgICAgICAgICAgIHN0b3JhZ2VLZXk6IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ2hpIG1vbSc7IH0sXHJcbiAgICAgICAgICAgIHN0b3JhZ2U6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVsbDsgfSxcclxuICAgICAgICAgICAgcHJlZmVycmVkTGFuZ3VhZ2U6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFByb3ZpZGUgdGhlIG1vY2sgYXMgdGhlICR0cmFuc2xhdGUgc2VydmljZSwgc28gdGhlIGZpbHRlciB3aWxsIHVzZSBpdC5cclxuICAgICAgICAkcHJvdmlkZS5mYWN0b3J5KCckdHJhbnNsYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdHJhbnNsYXRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIGluc3RhbmNlIG9mIHRoZSBmaWx0ZXIgdG8gdGVzdCB3aXRoLlxyXG4gICAgICovXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihzcFRyYW5zbGF0ZUZpbHRlcikge1xyXG4gICAgICAgIHRyYW5zbGF0ZUZpbHRlciA9IHNwVHJhbnNsYXRlRmlsdGVyO1xyXG4gICAgfSkpO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZlcmlmeSB0aGF0IHRoZSAkdHJhbnNsYXRlIHNlcnZpY2Ugd2FzIGNhbGxlZCB0byB0cmFuc2xhdGUgdGhlIGdpdmVuXHJcbiAgICAgKiBtZXNzYWdlIGtleSBhbmQgcGFyYW1ldGVycy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5ICAgICAgIFRoZSBleHBlY3RlZCBtZXNzYWdlIGtleS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXSAgQW4gb3B0aW9uYWwgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGV4cGVjdGVkXHJcbiAgICAgKiAgICB2YXJpYWJsZXMgdGhhdCBhcmUgcGFzc2VkIHRvIHRoZSB0cmFuc2xhdGUgY2FsbC5cclxuICAgICAqL1xyXG4gICAgdmFyIGNoZWNrVHJhbnNsYXRlID0gZnVuY3Rpb24oa2V5LCBwYXJhbXMpIHtcclxuICAgICAgICB2YXIgYXJncyA9ICR0cmFuc2xhdGUuaW5zdGFudC5jYWxscy5tb3N0UmVjZW50KCkuYXJncyxcclxuICAgICAgICAgICAgYWN0dWFsS2V5ID0gYXJnc1swXSxcclxuICAgICAgICAgICAgYWN0dWFsUGFyYW1zID0gYXJnc1sxXSxcclxuICAgICAgICAgICAgYWN0dWFsVmFsdWU7XHJcblxyXG4gICAgICAgIGV4cGVjdCgkdHJhbnNsYXRlLmluc3RhbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3Qoa2V5KS50b0VxdWFsKGFjdHVhbEtleSk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGFjdHVhbFBhcmFtcykudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtVmFsLCBwYXJhbUtleSkge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsVmFsdWUgPSBhY3R1YWxQYXJhbXNbcGFyYW1LZXldO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjdHVhbFZhbHVlKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjdHVhbFZhbHVlKS50b0VxdWFsKHBhcmFtVmFsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBleHBlY3QoYWN0dWFsUGFyYW1zKS5ub3QudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBpdCgndHJhbnNsYXRlcyBtZXNzYWdlcyB3aXRob3V0IHBhcmFtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBNU0cgPSAndGVzdF9tc2cnO1xyXG4gICAgICAgIHRyYW5zbGF0ZUZpbHRlcihNU0cpO1xyXG4gICAgICAgIGNoZWNrVHJhbnNsYXRlKE1TRyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndHJhbnNsYXRlcyBtZXNzYWdlcyB3aXRoIHBhcmFtcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBNU0cgPSAndGVzdF9tc2cgezB9IGZvbyB7MX0nO1xyXG4gICAgICAgIHRyYW5zbGF0ZUZpbHRlcihNU0csICdoaScsICdtb20nKTtcclxuICAgICAgICBjaGVja1RyYW5zbGF0ZShNU0csIHtcclxuICAgICAgICAgICAgdmFyMDogJ2hpJyxcclxuICAgICAgICAgICAgdmFyMTogJ21vbSdcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
