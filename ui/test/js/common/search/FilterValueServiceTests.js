System.register(['test/js/TestInitializer', 'common/search/SearchModule', 'test/js/common/util/SpDateServiceMocker'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var searchModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonSearchSearchModule) {
            searchModule = _commonSearchSearchModule['default'];
        }, function (_testJsCommonUtilSpDateServiceMocker) {}],
        execute: function () {

            describe('filterValueService', function () {
                var filterValueService = undefined;

                function PrototypeHasValue() {}
                PrototypeHasValue.prototype.foo = 'defaultValue';

                beforeEach(module(searchModule));

                beforeEach(inject(function (_filterValueService_) {
                    filterValueService = _filterValueService_;
                }));

                describe('getQueryParams', function () {
                    var MID_DAY = 1410171835732,
                        MIDNIGHT = 1410152400000,
                        ELEVEN_FITTY_NINE = 1410238799999;

                    beforeEach(inject(function (spDateService, spDateServiceMocker) {
                        // Mock the spDateService to return what we expect even though the
                        // timezone may vary depending on the machine that runs the test.
                        spyOn(spDateService, 'setDateComponents').and.callFake(spDateServiceMocker.mockSetDateComponents([{
                            date: MID_DAY,
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                            millis: 0,
                            returnValue: new Date(MIDNIGHT)
                        }, {
                            date: MIDNIGHT,
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                            millis: 0,
                            returnValue: new Date(MIDNIGHT)
                        }, {
                            date: ELEVEN_FITTY_NINE,
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                            millis: 0,
                            returnValue: new Date(MIDNIGHT)
                        }, {
                            date: MID_DAY,
                            hours: 23,
                            minutes: 59,
                            seconds: 59,
                            millis: 999,
                            returnValue: new Date(ELEVEN_FITTY_NINE)
                        }, {
                            date: MIDNIGHT,
                            hours: 23,
                            minutes: 59,
                            seconds: 59,
                            millis: 999,
                            returnValue: new Date(ELEVEN_FITTY_NINE)
                        }, {
                            date: ELEVEN_FITTY_NINE,
                            hours: 23,
                            minutes: 59,
                            seconds: 59,
                            millis: 999,
                            returnValue: new Date(ELEVEN_FITTY_NINE)
                        }]));
                    }));

                    it('should accept null params', function () {
                        var params = filterValueService.getQueryParams(null);
                        expect(params).not.toBeDefined();
                    });

                    it('should accept undefined params', function () {
                        var filters, params;
                        params = filterValueService.getQueryParams(filters);
                        expect(params).not.toBeDefined();
                    });

                    it('should convert dates to a start/end format', function () {
                        // Mid-day -> Mon Sep 08 2014 05:23:55 GMT-0500 (Central Daylight Time)
                        // Midnight -> Mon Sep 08 2014 00:00:00 GMT-0500 (Central Daylight Time)
                        // 11:59 -> Mon Sep 08 2014 23:59:59 GMT-0500 (Central Daylight Time)
                        var midDay = new Date(MID_DAY),
                            midnight = new Date(MIDNIGHT),
                            elevenFittyNine = new Date(ELEVEN_FITTY_NINE),
                            params = {
                            midDay: {
                                value: midDay
                            },
                            midnight: {
                                value: midnight
                            },
                            elevenFittyNine: {
                                value: elevenFittyNine
                            }
                        };

                        params = filterValueService.getQueryParams(params);

                        expect(params.midDay.value).toEqual('1410152400000|1410238799999');
                        expect(params.midnight.value).toEqual('1410152400000|1410238799999');
                        expect(params.elevenFittyNine.value).toEqual('1410152400000|1410238799999');
                    });

                    it('should convert object to given objectValueProperty', function () {
                        var params = {
                            filterThis: {
                                value: {
                                    thing1: true,
                                    name: 'Thing1',
                                    id: 'ThingID',
                                    somethingelse: 'thisandthat'
                                }
                            },
                            filterThat: {
                                value: {
                                    derp: 'derp',
                                    id: 'thatThing'
                                }
                            }
                        },
                            newParams = filterValueService.getQueryParams(params, 'id');
                        expect(newParams.filterThis.value).toEqual('ThingID');

                        // should get name with missing objectValueProperty
                        newParams = filterValueService.getQueryParams(params);
                        expect(newParams.filterThis.value).toEqual('Thing1');

                        // should get id if name not defined with missing objectValueProperty
                        expect(newParams.filterThat.value).toEqual('thatThing');

                        // Should check in order if array is passed
                        newParams = filterValueService.getQueryParams(params, ['nothing', 'somethingelse', 'derp']);
                        expect(newParams.filterThis.value).toEqual('thisandthat');
                        expect(newParams.filterThat.value).toEqual('derp');

                        // Should leave object alone with null objectValueProperty value
                        newParams = filterValueService.getQueryParams(params, null);
                        expect(newParams.filterThis.value).toEqual(params.filterThis.value);
                    });

                    it('should exclude FilterValue if not valid value', function () {
                        var params = {
                            someFilter: {
                                value: '1234'
                            }
                        },
                            newParams = undefined;
                        spyOn(filterValueService, 'hasValidValue').and.returnValue(false);
                        newParams = filterValueService.getQueryParams(params);
                        expect(newParams.someFilter).not.toBeDefined();
                    });

                    it('should keep FilterValue with invalid value if preserveInvalidVaues is true', function () {
                        var params = {
                            someFilter: {
                                value: '1234'
                            }
                        },
                            newParams = undefined;
                        spyOn(filterValueService, 'hasValidValue').and.returnValue(false);
                        newParams = filterValueService.getQueryParams(params, undefined, true);
                        expect(newParams.someFilter).toEqual(params.someFilter);
                    });

                    it('should convert all entries in value array', function () {
                        var params = {
                            someFilter: {
                                value: [{
                                    id: 'entry1',
                                    displayName: 'blah'
                                }, {
                                    id: 'entry2',
                                    displayName: 'blah2'
                                }]
                            }
                        },
                            newParams = undefined;
                        newParams = filterValueService.getQueryParams(params);
                        expect(newParams.someFilter.value).toEqual(['entry1', 'entry2']);
                    });
                });

                describe('clearValue()', function () {
                    it('sets an array value to an empty array', function () {
                        var param = {
                            value: ['1', '2', '3']
                        };

                        filterValueService.clearValue(param);
                        expect(param.value).toEqual([]);
                    });

                    it('sets a non-array value to undefined', function () {
                        var param = {
                            value: 'abcd'
                        };

                        filterValueService.clearValue(param);
                        expect(param.value).toEqual(undefined);
                    });
                });

                describe('hasValidValue()', function () {
                    it('returns false if value is undefined', function () {
                        var filterValue = {
                            value: undefined
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(false);
                    });

                    it('returns false if value is empty string', function () {
                        var filterValue = {
                            value: ''
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(false);
                    });

                    it('returns false if value is strings that are just spaces', function () {
                        var filterValue = {
                            value: '      '
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(false);
                    });

                    it('returns true for non-empty strings', function () {
                        var filterValue = {
                            value: 'yay'
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                    });

                    it('returns false if value is empty object', function () {
                        var filterValue = {
                            value: {}
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(false);
                    });

                    /* Tracking less than obvious behavior */
                    it('scrubs objects that do not declare properties', function () {
                        var filterValue = {
                            value: new PrototypeHasValue()
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(false);
                    });

                    it('leaves non-empty objects', function () {
                        var filterValue = {
                            value: { something: 'good' }
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                    });

                    it('returns false for empty arrays', function () {
                        var filterValue = {
                            value: []
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(false);
                    });

                    it('returns true for non-empty arrays', function () {
                        var filterValue = {
                            value: ['uno', 'dos']
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                    });

                    it('returns true for values that are numbers', function () {
                        var filterValue = {
                            value: 43
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                    });

                    it('returns true for for values that are dates', function () {
                        var filterValue = {
                            value: new Date()
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                    });

                    it('returns true for values that are booleans', function () {
                        var filterValue = {
                            value: true
                        };
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                        filterValue.value = false;
                        expect(filterValueService.hasValidValue(filterValue)).toEqual(true);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9zZWFyY2gvRmlsdGVyVmFsdWVTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDhCQUE4Qiw0Q0FBNEMsVUFBVSxTQUFTOzs7SUFHckk7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLDJCQUEyQjtZQUNqRixlQUFlLDBCQUEwQjtXQUMxQyxVQUFVLHNDQUFzQztRQUNuRCxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsc0JBQXNCLFlBQU07Z0JBQ2pDLElBQUkscUJBQWtCOztnQkFFdEIsU0FBUyxvQkFBb0I7Z0JBQzdCLGtCQUFrQixVQUFVLE1BQU07O2dCQUVsQyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxzQkFBeUI7b0JBQ3hDLHFCQUFxQjs7O2dCQUd6QixTQUFTLGtCQUFrQixZQUFXO29CQUNsQyxJQUFJLFVBQVU7d0JBQ1YsV0FBVzt3QkFDWCxvQkFBb0I7O29CQUV4QixXQUFXLE9BQU8sVUFBUyxlQUFlLHFCQUFxQjs7O3dCQUczRCxNQUFNLGVBQWUscUJBQXFCLElBQUksU0FDMUMsb0JBQW9CLHNCQUFzQixDQUFDOzRCQUN2QyxNQUFNOzRCQUNOLE9BQU87NEJBQ1AsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFFBQVE7NEJBQ1IsYUFBYSxJQUFJLEtBQUs7MkJBQ3ZCOzRCQUNDLE1BQU07NEJBQ04sT0FBTzs0QkFDUCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsUUFBUTs0QkFDUixhQUFhLElBQUksS0FBSzsyQkFDdkI7NEJBQ0MsTUFBTTs0QkFDTixPQUFPOzRCQUNQLFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxRQUFROzRCQUNSLGFBQWEsSUFBSSxLQUFLOzJCQUN2Qjs0QkFDQyxNQUFNOzRCQUNOLE9BQU87NEJBQ1AsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFFBQVE7NEJBQ1IsYUFBYSxJQUFJLEtBQUs7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L0MsSUFBSSxjQUFjOzRCQUNkLE9BQU8sQ0FBQyxPQUFPOzt3QkFFbkIsT0FBTyxtQkFBbUIsY0FBYyxjQUFjLFFBQVE7OztvQkFHbEUsR0FBRyw0Q0FBNEMsWUFBVzt3QkFDdEQsSUFBSSxjQUFjOzRCQUNkLE9BQU87O3dCQUVYLE9BQU8sbUJBQW1CLGNBQWMsY0FBYyxRQUFROzs7b0JBR2xFLEdBQUcsOENBQThDLFlBQVc7d0JBQ3hELElBQUksY0FBYzs0QkFDZCxPQUFPLElBQUk7O3dCQUVmLE9BQU8sbUJBQW1CLGNBQWMsY0FBYyxRQUFROzs7b0JBR2xFLEdBQUcsNkNBQTZDLFlBQVc7d0JBQ3ZELElBQUksY0FBYzs0QkFDZCxPQUFPOzt3QkFFWCxPQUFPLG1CQUFtQixjQUFjLGNBQWMsUUFBUTt3QkFDOUQsWUFBWSxRQUFRO3dCQUNwQixPQUFPLG1CQUFtQixjQUFjLGNBQWMsUUFBUTs7Ozs7O0dBY3ZFIiwiZmlsZSI6ImNvbW1vbi9zZWFyY2gvRmlsdGVyVmFsdWVTZXJ2aWNlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTYgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgc2VhcmNoTW9kdWxlIGZyb20gJ2NvbW1vbi9zZWFyY2gvU2VhcmNoTW9kdWxlJztcbmltcG9ydCAndGVzdC9qcy9jb21tb24vdXRpbC9TcERhdGVTZXJ2aWNlTW9ja2VyJztcblxuZGVzY3JpYmUoJ2ZpbHRlclZhbHVlU2VydmljZScsICgpID0+IHtcbiAgICBsZXQgZmlsdGVyVmFsdWVTZXJ2aWNlO1xuXG4gICAgZnVuY3Rpb24gUHJvdG90eXBlSGFzVmFsdWUoKSB7fVxuICAgIFByb3RvdHlwZUhhc1ZhbHVlLnByb3RvdHlwZS5mb28gPSAnZGVmYXVsdFZhbHVlJztcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHNlYXJjaE1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9maWx0ZXJWYWx1ZVNlcnZpY2VfKSA9PiB7XG4gICAgICAgIGZpbHRlclZhbHVlU2VydmljZSA9IF9maWx0ZXJWYWx1ZVNlcnZpY2VfO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCdnZXRRdWVyeVBhcmFtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgTUlEX0RBWSA9IDE0MTAxNzE4MzU3MzIsXG4gICAgICAgICAgICBNSUROSUdIVCA9IDE0MTAxNTI0MDAwMDAsXG4gICAgICAgICAgICBFTEVWRU5fRklUVFlfTklORSA9IDE0MTAyMzg3OTk5OTk7XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oc3BEYXRlU2VydmljZSwgc3BEYXRlU2VydmljZU1vY2tlcikge1xuICAgICAgICAgICAgLy8gTW9jayB0aGUgc3BEYXRlU2VydmljZSB0byByZXR1cm4gd2hhdCB3ZSBleHBlY3QgZXZlbiB0aG91Z2ggdGhlXG4gICAgICAgICAgICAvLyB0aW1lem9uZSBtYXkgdmFyeSBkZXBlbmRpbmcgb24gdGhlIG1hY2hpbmUgdGhhdCBydW5zIHRoZSB0ZXN0LlxuICAgICAgICAgICAgc3B5T24oc3BEYXRlU2VydmljZSwgJ3NldERhdGVDb21wb25lbnRzJykuYW5kLmNhbGxGYWtlKFxuICAgICAgICAgICAgICAgIHNwRGF0ZVNlcnZpY2VNb2NrZXIubW9ja1NldERhdGVDb21wb25lbnRzKFt7XG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IE1JRF9EQVksXG4gICAgICAgICAgICAgICAgICAgIGhvdXJzOiAwLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGVzOiAwLFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRzOiAwLFxuICAgICAgICAgICAgICAgICAgICBtaWxsaXM6IDAsXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlOiBuZXcgRGF0ZShNSUROSUdIVClcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IE1JRE5JR0hULFxuICAgICAgICAgICAgICAgICAgICBob3VyczogMCxcbiAgICAgICAgICAgICAgICAgICAgbWludXRlczogMCxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kczogMCxcbiAgICAgICAgICAgICAgICAgICAgbWlsbGlzOiAwLFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZTogbmV3IERhdGUoTUlETklHSFQpXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBFTEVWRU5fRklUVFlfTklORSxcbiAgICAgICAgICAgICAgICAgICAgaG91cnM6IDAsXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZXM6IDAsXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZHM6IDAsXG4gICAgICAgICAgICAgICAgICAgIG1pbGxpczogMCxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWU6IG5ldyBEYXRlKE1JRE5JR0hUKVxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogTUlEX0RBWSxcbiAgICAgICAgICAgICAgICAgICAgaG91cnM6IDIzLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGVzOiA1OSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kczogNTksXG4gICAgICAgICAgICAgICAgICAgIG1pbGxpczogOTk5LFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZTogbmV3IERhdGUoRUxFVkVOX0ZJVFRZX05JTkUpXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBNSUROSUdIVCxcbiAgICAgICAgICAgICAgICAgICAgaG91cnM6IDIzLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGVzOiA1OSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kczogNTksXG4gICAgICAgICAgICAgICAgICAgIG1pbGxpczogOTk5LFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZTogbmV3IERhdGUoRUxFVkVOX0ZJVFRZX05JTkUpXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBFTEVWRU5fRklUVFlfTklORSxcbiAgICAgICAgICAgICAgICAgICAgaG91cnM6IDIzLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGVzOiA1OSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kczogNTksXG4gICAgICAgICAgICAgICAgICAgIG1pbGxpczogOTk5LFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZTogbmV3IERhdGUoRUxFVkVOX0ZJVFRZX05JTkUpXG4gICAgICAgICAgICAgICAgfV0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhY2NlcHQgbnVsbCBwYXJhbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBmaWx0ZXJWYWx1ZVNlcnZpY2UuZ2V0UXVlcnlQYXJhbXMobnVsbCk7XG4gICAgICAgICAgICBleHBlY3QocGFyYW1zKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhY2NlcHQgdW5kZWZpbmVkIHBhcmFtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpbHRlcnMsIHBhcmFtcztcbiAgICAgICAgICAgIHBhcmFtcyA9IGZpbHRlclZhbHVlU2VydmljZS5nZXRRdWVyeVBhcmFtcyhmaWx0ZXJzKTtcbiAgICAgICAgICAgIGV4cGVjdChwYXJhbXMpLm5vdC50b0JlRGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgZGF0ZXMgdG8gYSBzdGFydC9lbmQgZm9ybWF0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBNaWQtZGF5IC0+IE1vbiBTZXAgMDggMjAxNCAwNToyMzo1NSBHTVQtMDUwMCAoQ2VudHJhbCBEYXlsaWdodCBUaW1lKVxuICAgICAgICAgICAgLy8gTWlkbmlnaHQgLT4gTW9uIFNlcCAwOCAyMDE0IDAwOjAwOjAwIEdNVC0wNTAwIChDZW50cmFsIERheWxpZ2h0IFRpbWUpXG4gICAgICAgICAgICAvLyAxMTo1OSAtPiBNb24gU2VwIDA4IDIwMTQgMjM6NTk6NTkgR01ULTA1MDAgKENlbnRyYWwgRGF5bGlnaHQgVGltZSlcbiAgICAgICAgICAgIHZhciBtaWREYXkgPSBuZXcgRGF0ZShNSURfREFZKSxcbiAgICAgICAgICAgICAgICBtaWRuaWdodCA9IG5ldyBEYXRlKE1JRE5JR0hUKSxcbiAgICAgICAgICAgICAgICBlbGV2ZW5GaXR0eU5pbmUgPSBuZXcgRGF0ZShFTEVWRU5fRklUVFlfTklORSksXG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBtaWREYXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtaWREYXlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWlkbmlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtaWRuaWdodFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbGV2ZW5GaXR0eU5pbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlbGV2ZW5GaXR0eU5pbmVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHBhcmFtcyA9IGZpbHRlclZhbHVlU2VydmljZS5nZXRRdWVyeVBhcmFtcyhwYXJhbXMpO1xuXG4gICAgICAgICAgICBleHBlY3QocGFyYW1zLm1pZERheS52YWx1ZSkudG9FcXVhbCgnMTQxMDE1MjQwMDAwMHwxNDEwMjM4Nzk5OTk5Jyk7XG4gICAgICAgICAgICBleHBlY3QocGFyYW1zLm1pZG5pZ2h0LnZhbHVlKS50b0VxdWFsKCcxNDEwMTUyNDAwMDAwfDE0MTAyMzg3OTk5OTknKTtcbiAgICAgICAgICAgIGV4cGVjdChwYXJhbXMuZWxldmVuRml0dHlOaW5lLnZhbHVlKS50b0VxdWFsKCcxNDEwMTUyNDAwMDAwfDE0MTAyMzg3OTk5OTknKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjb252ZXJ0IG9iamVjdCB0byBnaXZlbiBvYmplY3RWYWx1ZVByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGZpbHRlclRoaXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaW5nMTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdUaGluZzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdUaGluZ0lEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvbWV0aGluZ2Vsc2U6ICd0aGlzYW5kdGhhdCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmlsdGVyVGhhdDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVycDogJ2RlcnAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICd0aGF0VGhpbmcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LG5ld1BhcmFtcyA9IGZpbHRlclZhbHVlU2VydmljZS5nZXRRdWVyeVBhcmFtcyhwYXJhbXMsICdpZCcpO1xuICAgICAgICAgICAgZXhwZWN0KG5ld1BhcmFtcy5maWx0ZXJUaGlzLnZhbHVlKS50b0VxdWFsKCdUaGluZ0lEJyk7XG5cbiAgICAgICAgICAgIC8vIHNob3VsZCBnZXQgbmFtZSB3aXRoIG1pc3Npbmcgb2JqZWN0VmFsdWVQcm9wZXJ0eVxuICAgICAgICAgICAgbmV3UGFyYW1zID0gZmlsdGVyVmFsdWVTZXJ2aWNlLmdldFF1ZXJ5UGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICBleHBlY3QobmV3UGFyYW1zLmZpbHRlclRoaXMudmFsdWUpLnRvRXF1YWwoJ1RoaW5nMScpO1xuXG4gICAgICAgICAgICAvLyBzaG91bGQgZ2V0IGlkIGlmIG5hbWUgbm90IGRlZmluZWQgd2l0aCBtaXNzaW5nIG9iamVjdFZhbHVlUHJvcGVydHlcbiAgICAgICAgICAgIGV4cGVjdChuZXdQYXJhbXMuZmlsdGVyVGhhdC52YWx1ZSkudG9FcXVhbCgndGhhdFRoaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIFNob3VsZCBjaGVjayBpbiBvcmRlciBpZiBhcnJheSBpcyBwYXNzZWRcbiAgICAgICAgICAgIG5ld1BhcmFtcyA9IGZpbHRlclZhbHVlU2VydmljZS5nZXRRdWVyeVBhcmFtcyhwYXJhbXMsIFsnbm90aGluZycsICdzb21ldGhpbmdlbHNlJywgJ2RlcnAnXSk7XG4gICAgICAgICAgICBleHBlY3QobmV3UGFyYW1zLmZpbHRlclRoaXMudmFsdWUpLnRvRXF1YWwoJ3RoaXNhbmR0aGF0Jyk7XG4gICAgICAgICAgICBleHBlY3QobmV3UGFyYW1zLmZpbHRlclRoYXQudmFsdWUpLnRvRXF1YWwoJ2RlcnAnKTtcblxuICAgICAgICAgICAgLy8gU2hvdWxkIGxlYXZlIG9iamVjdCBhbG9uZSB3aXRoIG51bGwgb2JqZWN0VmFsdWVQcm9wZXJ0eSB2YWx1ZVxuICAgICAgICAgICAgbmV3UGFyYW1zID0gZmlsdGVyVmFsdWVTZXJ2aWNlLmdldFF1ZXJ5UGFyYW1zKHBhcmFtcywgbnVsbCk7XG4gICAgICAgICAgICBleHBlY3QobmV3UGFyYW1zLmZpbHRlclRoaXMudmFsdWUpLnRvRXF1YWwocGFyYW1zLmZpbHRlclRoaXMudmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGV4Y2x1ZGUgRmlsdGVyVmFsdWUgaWYgbm90IHZhbGlkIHZhbHVlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBzb21lRmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnMTIzNCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBuZXdQYXJhbXM7XG4gICAgICAgICAgICBzcHlPbihmaWx0ZXJWYWx1ZVNlcnZpY2UsICdoYXNWYWxpZFZhbHVlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIG5ld1BhcmFtcyA9IGZpbHRlclZhbHVlU2VydmljZS5nZXRRdWVyeVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgZXhwZWN0KG5ld1BhcmFtcy5zb21lRmlsdGVyKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBrZWVwIEZpbHRlclZhbHVlIHdpdGggaW52YWxpZCB2YWx1ZSBpZiBwcmVzZXJ2ZUludmFsaWRWYXVlcyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBzb21lRmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnMTIzNCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBuZXdQYXJhbXM7XG4gICAgICAgICAgICBzcHlPbihmaWx0ZXJWYWx1ZVNlcnZpY2UsICdoYXNWYWxpZFZhbHVlJykuYW5kLnJldHVyblZhbHVlKGZhbHNlKTtcbiAgICAgICAgICAgIG5ld1BhcmFtcyA9IGZpbHRlclZhbHVlU2VydmljZS5nZXRRdWVyeVBhcmFtcyhwYXJhbXMsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QobmV3UGFyYW1zLnNvbWVGaWx0ZXIpLnRvRXF1YWwocGFyYW1zLnNvbWVGaWx0ZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgYWxsIGVudHJpZXMgaW4gdmFsdWUgYXJyYXknLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIHNvbWVGaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2VudHJ5MScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ2JsYWgnXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnZW50cnkyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnYmxhaDInXG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbmV3UGFyYW1zO1xuICAgICAgICAgICAgbmV3UGFyYW1zID0gZmlsdGVyVmFsdWVTZXJ2aWNlLmdldFF1ZXJ5UGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICBleHBlY3QobmV3UGFyYW1zLnNvbWVGaWx0ZXIudmFsdWUpLnRvRXF1YWwoWydlbnRyeTEnLCAnZW50cnkyJ10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjbGVhclZhbHVlKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZXRzIGFuIGFycmF5IHZhbHVlIHRvIGFuIGVtcHR5IGFycmF5JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBbJzEnLCAnMicsICczJ11cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlclZhbHVlU2VydmljZS5jbGVhclZhbHVlKHBhcmFtKTtcbiAgICAgICAgICAgIGV4cGVjdChwYXJhbS52YWx1ZSkudG9FcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZXRzIGEgbm9uLWFycmF5IHZhbHVlIHRvIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBwYXJhbSA9IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ2FiY2QnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWx0ZXJWYWx1ZVNlcnZpY2UuY2xlYXJWYWx1ZShwYXJhbSk7XG4gICAgICAgICAgICBleHBlY3QocGFyYW0udmFsdWUpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaGFzVmFsaWRWYWx1ZSgpJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB2YWx1ZSBpcyB1bmRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZpbHRlclZhbHVlU2VydmljZS5oYXNWYWxpZFZhbHVlKGZpbHRlclZhbHVlKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHZhbHVlIGlzIGVtcHR5IHN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGZpbHRlclZhbHVlID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJWYWx1ZVNlcnZpY2UuaGFzVmFsaWRWYWx1ZShmaWx0ZXJWYWx1ZSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiB2YWx1ZSBpcyBzdHJpbmdzIHRoYXQgYXJlIGp1c3Qgc3BhY2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICcgICAgICAnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZpbHRlclZhbHVlU2VydmljZS5oYXNWYWxpZFZhbHVlKGZpbHRlclZhbHVlKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIG5vbi1lbXB0eSBzdHJpbmdzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICd5YXknXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZpbHRlclZhbHVlU2VydmljZS5oYXNWYWxpZFZhbHVlKGZpbHRlclZhbHVlKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdmFsdWUgaXMgZW1wdHkgb2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZpbHRlclZhbHVlU2VydmljZS5oYXNWYWxpZFZhbHVlKGZpbHRlclZhbHVlKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIFRyYWNraW5nIGxlc3MgdGhhbiBvYnZpb3VzIGJlaGF2aW9yICovXG4gICAgICAgIGl0KCdzY3J1YnMgb2JqZWN0cyB0aGF0IGRvIG5vdCBkZWNsYXJlIHByb3BlcnRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogbmV3IFByb3RvdHlwZUhhc1ZhbHVlKClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVmFsdWVTZXJ2aWNlLmhhc1ZhbGlkVmFsdWUoZmlsdGVyVmFsdWUpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2xlYXZlcyBub24tZW1wdHkgb2JqZWN0cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGZpbHRlclZhbHVlID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB7IHNvbWV0aGluZzogJ2dvb2QnfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJWYWx1ZVNlcnZpY2UuaGFzVmFsaWRWYWx1ZShmaWx0ZXJWYWx1ZSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBlbXB0eSBhcnJheXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVmFsdWVTZXJ2aWNlLmhhc1ZhbGlkVmFsdWUoZmlsdGVyVmFsdWUpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3Igbm9uLWVtcHR5IGFycmF5cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGZpbHRlclZhbHVlID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBbJ3VubycsICdkb3MnXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJWYWx1ZVNlcnZpY2UuaGFzVmFsaWRWYWx1ZShmaWx0ZXJWYWx1ZSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRydWUgZm9yIHZhbHVlcyB0aGF0IGFyZSBudW1iZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IDQzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZpbHRlclZhbHVlU2VydmljZS5oYXNWYWxpZFZhbHVlKGZpbHRlclZhbHVlKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgZm9yIHZhbHVlcyB0aGF0IGFyZSBkYXRlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGZpbHRlclZhbHVlID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZXhwZWN0KGZpbHRlclZhbHVlU2VydmljZS5oYXNWYWxpZFZhbHVlKGZpbHRlclZhbHVlKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgdmFsdWVzIHRoYXQgYXJlIGJvb2xlYW5zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVmFsdWVTZXJ2aWNlLmhhc1ZhbGlkVmFsdWUoZmlsdGVyVmFsdWUpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZmlsdGVyVmFsdWUudmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJWYWx1ZVNlcnZpY2UuaGFzVmFsaWRWYWx1ZShmaWx0ZXJWYWx1ZSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
