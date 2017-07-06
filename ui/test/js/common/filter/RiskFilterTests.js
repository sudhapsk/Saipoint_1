System.register(['test/js/TestInitializer', 'common/filter/FilterModule'], function (_export) {
    /* (c) Copyright 2014 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * @author: michael.hide
     * Created: 8/28/14 2:58 PM
     */
    'use strict';

    var filterModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonFilterFilterModule) {
            filterModule = _commonFilterFilterModule['default'];
        }],
        execute: function () {
            describe('risk filter', function () {
                // The filter under test
                var riskFilter, filteredValue;

                beforeEach(module(filterModule));

                beforeEach(inject(function (_riskFilter_) {
                    riskFilter = _riskFilter_;
                }));

                function testRiskFilterFormat(riskValue, riskClass) {
                    var onlyColorHigh = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                    var expectedResult = '<span class="label risk ' + riskClass + '">' + riskValue + '</span>';
                    filteredValue = riskFilter(riskValue, undefined, onlyColorHigh);
                    expect(filteredValue).toEqual(expectedResult);
                }

                it('should format the riskValue', function () {
                    testRiskFilterFormat(800, 'risk-high');
                    testRiskFilterFormat(200, 'risk-low');
                    testRiskFilterFormat(0, 'risk-lowest');
                    testRiskFilterFormat(501, 'risk-medium-high');
                });

                it('should return the raw value if it is not a number', function () {
                    filteredValue = riskFilter('abcd');
                    expect(filteredValue).toEqual('abcd');
                });

                it('should return the raw value if it is not defined', function () {
                    filteredValue = riskFilter();
                    expect(filteredValue).not.toBeDefined();
                });

                describe('only color high scores', function () {
                    it('should add color when set to false', function () {
                        testRiskFilterFormat(5, 'risk-lowest', false);
                    });

                    it('should add color when set to true for a high score', function () {
                        testRiskFilterFormat(833, 'risk-high', true);
                    });

                    it('should not add color when set to true for a low score', function () {
                        filteredValue = riskFilter(500, undefined, true);
                        expect(filteredValue).toEqual(500);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9maWx0ZXIvUmlza0ZpbHRlclRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwrQkFBK0IsVUFBVSxTQUFTOzs7Ozs7O0lBQzlGOztJQVFJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwyQkFBMkI7WUFDakYsZUFBZSwwQkFBMEI7O1FBRTdDLFNBQVMsWUFBWTtZQUo3QixTQUFTLGVBQWUsWUFBVzs7Z0JBRS9CLElBQUksWUFBWTs7Z0JBRWhCLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLGNBQWM7b0JBQ3JDLGFBQWE7OztnQkFHakIsU0FBUyxxQkFBcUIsV0FBVyxXQUFrQztvQkFNM0QsSUFOb0MsZ0JBQWEsVUFBQSxVQUFBLEtBQUEsVUFBQSxPQUFBLFlBQUcsUUFBSyxVQUFBOztvQkFDckUsSUFBSSxpQkFBaUIsNkJBQTZCLFlBQVksT0FBTyxZQUFZO29CQUNqRixnQkFBZ0IsV0FBVyxXQUFXLFdBQVc7b0JBQ2pELE9BQU8sZUFBZSxRQUFROzs7Z0JBR2xDLEdBQUcsK0JBQStCLFlBQVc7b0JBQ3pDLHFCQUFxQixLQUFLO29CQUMxQixxQkFBcUIsS0FBSztvQkFDMUIscUJBQXFCLEdBQUc7b0JBQ3hCLHFCQUFxQixLQUFLOzs7Z0JBRzlCLEdBQUcscURBQXFELFlBQVc7b0JBQy9ELGdCQUFnQixXQUFXO29CQUMzQixPQUFPLGVBQWUsUUFBUTs7O2dCQUdsQyxHQUFHLG9EQUFvRCxZQUFXO29CQUM5RCxnQkFBZ0I7b0JBQ2hCLE9BQU8sZUFBZSxJQUFJOzs7Z0JBRzlCLFNBQVMsMEJBQTBCLFlBQU07b0JBQ3JDLEdBQUcsc0NBQXNDLFlBQU07d0JBQzNDLHFCQUFxQixHQUFHLGVBQWU7OztvQkFHM0MsR0FBRyxzREFBc0QsWUFBTTt3QkFDM0QscUJBQXFCLEtBQUssYUFBYTs7O29CQUczQyxHQUFHLHlEQUF5RCxZQUFNO3dCQUM5RCxnQkFBZ0IsV0FBVyxLQUFLLFdBQVc7d0JBQzNDLE9BQU8sZUFBZSxRQUFROzs7Ozs7R0FhdkMiLCJmaWxlIjoiY29tbW9uL2ZpbHRlci9SaXNrRmlsdGVyVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTQgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgZmlsdGVyTW9kdWxlIGZyb20gJ2NvbW1vbi9maWx0ZXIvRmlsdGVyTW9kdWxlJztcblxuLyoqXG4gKiBAYXV0aG9yOiBtaWNoYWVsLmhpZGVcbiAqIENyZWF0ZWQ6IDgvMjgvMTQgMjo1OCBQTVxuICovXG5kZXNjcmliZSgncmlzayBmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGUgZmlsdGVyIHVuZGVyIHRlc3RcbiAgICB2YXIgcmlza0ZpbHRlciwgZmlsdGVyZWRWYWx1ZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGZpbHRlck1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3Jpc2tGaWx0ZXJfKSB7XG4gICAgICAgIHJpc2tGaWx0ZXIgPSBfcmlza0ZpbHRlcl87XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gdGVzdFJpc2tGaWx0ZXJGb3JtYXQocmlza1ZhbHVlLCByaXNrQ2xhc3MsIG9ubHlDb2xvckhpZ2ggPSBmYWxzZSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRSZXN1bHQgPSAnPHNwYW4gY2xhc3M9XCJsYWJlbCByaXNrICcgKyByaXNrQ2xhc3MgKyAnXCI+JyArIHJpc2tWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgZmlsdGVyZWRWYWx1ZSA9IHJpc2tGaWx0ZXIocmlza1ZhbHVlLCB1bmRlZmluZWQsIG9ubHlDb2xvckhpZ2gpO1xuICAgICAgICBleHBlY3QoZmlsdGVyZWRWYWx1ZSkudG9FcXVhbChleHBlY3RlZFJlc3VsdCk7XG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgdGhlIHJpc2tWYWx1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0ZXN0Umlza0ZpbHRlckZvcm1hdCg4MDAsICdyaXNrLWhpZ2gnKTtcbiAgICAgICAgdGVzdFJpc2tGaWx0ZXJGb3JtYXQoMjAwLCAncmlzay1sb3cnKTtcbiAgICAgICAgdGVzdFJpc2tGaWx0ZXJGb3JtYXQoMCwgJ3Jpc2stbG93ZXN0Jyk7XG4gICAgICAgIHRlc3RSaXNrRmlsdGVyRm9ybWF0KDUwMSwgJ3Jpc2stbWVkaXVtLWhpZ2gnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSByYXcgdmFsdWUgaWYgaXQgaXMgbm90IGEgbnVtYmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbHRlcmVkVmFsdWUgPSByaXNrRmlsdGVyKCdhYmNkJyk7XG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZFZhbHVlKS50b0VxdWFsKCdhYmNkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgcmF3IHZhbHVlIGlmIGl0IGlzIG5vdCBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbHRlcmVkVmFsdWUgPSByaXNrRmlsdGVyKCk7XG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZFZhbHVlKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvbmx5IGNvbG9yIGhpZ2ggc2NvcmVzJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIGFkZCBjb2xvciB3aGVuIHNldCB0byBmYWxzZScsICgpID0+IHtcbiAgICAgICAgICAgIHRlc3RSaXNrRmlsdGVyRm9ybWF0KDUsICdyaXNrLWxvd2VzdCcsIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhZGQgY29sb3Igd2hlbiBzZXQgdG8gdHJ1ZSBmb3IgYSBoaWdoIHNjb3JlJywgKCkgPT4ge1xuICAgICAgICAgICAgdGVzdFJpc2tGaWx0ZXJGb3JtYXQoODMzLCAncmlzay1oaWdoJywgdHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFkZCBjb2xvciB3aGVuIHNldCB0byB0cnVlIGZvciBhIGxvdyBzY29yZScsICgpID0+IHtcbiAgICAgICAgICAgIGZpbHRlcmVkVmFsdWUgPSByaXNrRmlsdGVyKDUwMCwgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJlZFZhbHVlKS50b0VxdWFsKDUwMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
