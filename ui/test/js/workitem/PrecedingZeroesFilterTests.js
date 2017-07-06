System.register(['test/js/TestInitializer', 'workitem/WorkItemModule'], function (_export) {

    /**
     * Tests for the preceding zeroes filter
     */

    'use strict';

    var workItemModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_workitemWorkItemModule) {
            workItemModule = _workitemWorkItemModule['default'];
        }],
        execute: function () {
            describe('precedingZeroesFilter', function () {
                // The filter under test
                var precedingZeroesFilter;

                beforeEach(module(workItemModule));

                beforeEach(inject(function (_precedingZeroesFilter_) {
                    precedingZeroesFilter = _precedingZeroesFilter_;
                }));

                it('should remove zeroes from the beinging of a string', function () {
                    var string = '000000000042',
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual('42');
                });

                it('should not remove internal zeros', function () {
                    var string = '0004500201',
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual('4500201');
                });

                it('should not remove trailing zeros', function () {
                    var string = '10000000',
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual(string);
                });

                it('should return undefined when given undefined', function () {
                    var filteredString = precedingZeroesFilter(undefined);
                    expect(filteredString).toEqual(undefined);
                });

                it('should not do anything to strings without leading zeroes', function () {
                    var string = '12304560',
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual(string);
                });

                it('should not barf with null', function () {
                    var string = null,
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual(string);
                });

                it('should not barf with undefined', function () {
                    var string,
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual(string);
                });

                it('should passthrough the empty string', function () {
                    var string = '',
                        filteredString = precedingZeroesFilter(string);
                    expect(filteredString).toEqual(string);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtpdGVtL1ByZWNlZGluZ1plcm9lc0ZpbHRlclRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiw0QkFBNEIsVUFBVSxTQUFTOzs7Ozs7SUFNdkY7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCOztRQUU3QyxTQUFTLFlBQVk7WUFON0IsU0FBUyx5QkFBeUIsWUFBVzs7Z0JBRXpDLElBQUk7O2dCQUVKLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLHlCQUF5QjtvQkFDaEQsd0JBQXdCOzs7Z0JBRzVCLEdBQUcsc0RBQXNELFlBQVc7b0JBQ2hFLElBQUksU0FBUzt3QkFDVCxpQkFBaUIsc0JBQXNCO29CQUMzQyxPQUFPLGdCQUFnQixRQUFROzs7Z0JBR25DLEdBQUcsb0NBQW9DLFlBQVc7b0JBQzlDLElBQUksU0FBUzt3QkFDVCxpQkFBaUIsc0JBQXNCO29CQUMzQyxPQUFPLGdCQUFnQixRQUFROzs7Z0JBR25DLEdBQUcsb0NBQW9DLFlBQVc7b0JBQzlDLElBQUksU0FBUzt3QkFDVCxpQkFBaUIsc0JBQXNCO29CQUMzQyxPQUFPLGdCQUFnQixRQUFROzs7Z0JBR25DLEdBQUcsZ0RBQWdELFlBQVc7b0JBQzFELElBQUksaUJBQWlCLHNCQUFzQjtvQkFDM0MsT0FBTyxnQkFBZ0IsUUFBUTs7O2dCQUduQyxHQUFHLDREQUE0RCxZQUFXO29CQUN0RSxJQUFJLFNBQVM7d0JBQ1QsaUJBQWlCLHNCQUFzQjtvQkFDM0MsT0FBTyxnQkFBZ0IsUUFBUTs7O2dCQUduQyxHQUFHLDZCQUE2QixZQUFXO29CQUN2QyxJQUFJLFNBQVM7d0JBQ1QsaUJBQWlCLHNCQUFzQjtvQkFDM0MsT0FBTyxnQkFBZ0IsUUFBUTs7O2dCQUduQyxHQUFHLGtDQUFrQyxZQUFXO29CQUM1QyxJQUFJO3dCQUNBLGlCQUFpQixzQkFBc0I7b0JBQzNDLE9BQU8sZ0JBQWdCLFFBQVE7OztnQkFHbkMsR0FBRyx1Q0FBdUMsWUFBVztvQkFDakQsSUFBSSxTQUFTO3dCQUNULGlCQUFpQixzQkFBc0I7b0JBQzNDLE9BQU8sZ0JBQWdCLFFBQVE7Ozs7O0dBWXBDIiwiZmlsZSI6IndvcmtpdGVtL1ByZWNlZGluZ1plcm9lc0ZpbHRlclRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgd29ya0l0ZW1Nb2R1bGUgZnJvbSAnd29ya2l0ZW0vV29ya0l0ZW1Nb2R1bGUnO1xuXG4vKipcbiAqIFRlc3RzIGZvciB0aGUgcHJlY2VkaW5nIHplcm9lcyBmaWx0ZXJcbiAqL1xuXG5kZXNjcmliZSgncHJlY2VkaW5nWmVyb2VzRmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhlIGZpbHRlciB1bmRlciB0ZXN0XG4gICAgdmFyIHByZWNlZGluZ1plcm9lc0ZpbHRlcjtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdvcmtJdGVtTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfcHJlY2VkaW5nWmVyb2VzRmlsdGVyXykge1xuICAgICAgICBwcmVjZWRpbmdaZXJvZXNGaWx0ZXIgPSBfcHJlY2VkaW5nWmVyb2VzRmlsdGVyXztcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSB6ZXJvZXMgZnJvbSB0aGUgYmVpbmdpbmcgb2YgYSBzdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0cmluZyA9ICcwMDAwMDAwMDAwNDInLFxuICAgICAgICAgICAgZmlsdGVyZWRTdHJpbmcgPSBwcmVjZWRpbmdaZXJvZXNGaWx0ZXIoc3RyaW5nKTtcbiAgICAgICAgZXhwZWN0KGZpbHRlcmVkU3RyaW5nKS50b0VxdWFsKCc0MicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVtb3ZlIGludGVybmFsIHplcm9zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdHJpbmcgPSAnMDAwNDUwMDIwMScsXG4gICAgICAgICAgICBmaWx0ZXJlZFN0cmluZyA9IHByZWNlZGluZ1plcm9lc0ZpbHRlcihzdHJpbmcpO1xuICAgICAgICBleHBlY3QoZmlsdGVyZWRTdHJpbmcpLnRvRXF1YWwoJzQ1MDAyMDEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbW92ZSB0cmFpbGluZyB6ZXJvcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RyaW5nID0gJzEwMDAwMDAwJyxcbiAgICAgICAgICAgIGZpbHRlcmVkU3RyaW5nID0gcHJlY2VkaW5nWmVyb2VzRmlsdGVyKHN0cmluZyk7XG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZFN0cmluZykudG9FcXVhbChzdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHdoZW4gZ2l2ZW4gdW5kZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWx0ZXJlZFN0cmluZyA9IHByZWNlZGluZ1plcm9lc0ZpbHRlcih1bmRlZmluZWQpO1xuICAgICAgICBleHBlY3QoZmlsdGVyZWRTdHJpbmcpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGRvIGFueXRoaW5nIHRvIHN0cmluZ3Mgd2l0aG91dCBsZWFkaW5nIHplcm9lcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RyaW5nID0gJzEyMzA0NTYwJyxcbiAgICAgICAgICAgIGZpbHRlcmVkU3RyaW5nID0gcHJlY2VkaW5nWmVyb2VzRmlsdGVyKHN0cmluZyk7XG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZFN0cmluZykudG9FcXVhbChzdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgYmFyZiB3aXRoIG51bGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0cmluZyA9IG51bGwsXG4gICAgICAgICAgICBmaWx0ZXJlZFN0cmluZyA9IHByZWNlZGluZ1plcm9lc0ZpbHRlcihzdHJpbmcpO1xuICAgICAgICBleHBlY3QoZmlsdGVyZWRTdHJpbmcpLnRvRXF1YWwoc3RyaW5nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGJhcmYgd2l0aCB1bmRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0cmluZyxcbiAgICAgICAgICAgIGZpbHRlcmVkU3RyaW5nID0gcHJlY2VkaW5nWmVyb2VzRmlsdGVyKHN0cmluZyk7XG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZFN0cmluZykudG9FcXVhbChzdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXNzdGhyb3VnaCB0aGUgZW1wdHkgc3RyaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgIGZpbHRlcmVkU3RyaW5nID0gcHJlY2VkaW5nWmVyb2VzRmlsdGVyKHN0cmluZyk7XG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZFN0cmluZykudG9FcXVhbChzdHJpbmcpO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
