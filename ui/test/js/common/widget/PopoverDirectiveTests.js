System.register(['common/widget/WidgetModule', 'test/js/TestInitializer'], function (_export) {
    'use strict';

    var widgetModule;
    return {
        setters: [function (_commonWidgetWidgetModule) {
            widgetModule = _commonWidgetWidgetModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            /**
             * Test popover directive extended functionality.
             */
            describe('PopoverDirective', function () {
                var elm, elm2, elmScope2, elmBody, scope, $window, $compile, elmScope;

                beforeEach(module(widgetModule));

                beforeEach(module(function ($provide) {
                    // Provide mock window
                    $provide.factory('$window', function () {
                        $window = jasmine.createSpy('$window');
                        $window.navigator = window.navigator;
                        $window.document = window.document;
                        return $window;
                    });
                }));

                beforeEach(inject(function ($rootScope, _$compile_) {
                    $compile = _$compile_;
                    elmBody = angular.element('<div><span popover-title="title text" popover="popover text" sp-popover-hover="true">' + 'Selector Text</span></div>');
                    scope = $rootScope;
                    $compile(elmBody)(scope);
                    scope.$digest();
                    elm = elmBody.find('span');
                    elmScope = elm.scope();
                }));

                function testIsPopoverShown(elmScope) {
                    var tooltipScope = elmScope.$$childTail;
                    expect(tooltipScope.isOpen).toBe(true);
                    expect(elmBody.children().length).toBe(2);
                }

                function testIsPopoverHidden(elmScope) {
                    var tooltipScope = elmScope.$$childTail;
                    expect(tooltipScope.isOpen).toBe(false);
                }

                it('should show when triggered by click', function () {
                    elm.trigger('click');
                    testIsPopoverShown(elmScope);
                });

                it('should hide when triggered by click', function () {
                    elm.trigger('click');
                    elm.trigger('click');
                    testIsPopoverHidden(elmScope);
                });

                it('should show when triggered by mouseenter', function () {
                    elm.trigger('mouseenter');
                    testIsPopoverShown(elmScope);
                });

                it('should hide when triggered by mouseleave', function () {
                    elm.trigger('click');
                    elm.trigger('mouseleave');
                    testIsPopoverHidden(elmScope);
                });

                it('should NOT hide when triggered by mouseenter after a click', function () {
                    elm.trigger('click');
                    elm.trigger('mouseenter');
                    testIsPopoverShown(elmScope);
                });

                it('should hide when ESC key pressed', function () {
                    var e;

                    // trigger the popover
                    elm.trigger('click');
                    testIsPopoverShown(elmScope);

                    // trigger ESC
                    e = $.Event('keyup');
                    e.keyCode = 27; // ESC
                    $(document).trigger(e);

                    testIsPopoverHidden(elmScope);
                });

                it('should hide when trigger element is blurred', function () {
                    // trigger the popover
                    elm.trigger('click');
                    testIsPopoverShown(elmScope);

                    // blur the element
                    elm.blur();

                    testIsPopoverHidden(elmScope);
                });

                it('should not show iosbackdrop when not ios', function () {
                    elm.trigger('click');
                    testIsPopoverShown(elmScope);
                    expect($('#iosbackdrop').length).toBe(0);

                    elm.blur();
                    testIsPopoverHidden(elmScope);
                    expect($('#iosbackdrop').length).toBe(0);
                });

                it('should show and hide iosbackdrop when ios', function () {
                    $window.navigator = {
                        userAgent: 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us)'
                    };

                    // recompile with new user agent
                    elmBody = angular.element('<div><span popover-title="title text" popover="popover text">Selector Text</span></div>');
                    $compile(elmBody)(scope);
                    scope.$digest();
                    elm2 = elmBody.find('span');
                    elmScope2 = elm2.scope();

                    elm2.trigger('click');
                    testIsPopoverShown(elmScope2);
                    expect($('#iosbackdrop').length).toBe(1);

                    elm2.blur();
                    testIsPopoverHidden(elmScope2);
                    expect($('#iosbackdrop').length).toBe(0);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi93aWRnZXQvUG9wb3ZlckRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDhCQUE4Qiw0QkFBNEIsVUFBVSxTQUFTO0lBQTlGOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsMkJBQTJCO1lBQzNDLGVBQWUsMEJBQTBCO1dBQzFDLFVBQVUsd0JBQXdCO1FBQ3JDLFNBQVMsWUFBWTs7Ozs7WUFBN0IsU0FBUyxvQkFBb0IsWUFBVztnQkFDcEMsSUFBSSxLQUFLLE1BQU0sV0FBVyxTQUFTLE9BQU8sU0FBUyxVQUFVOztnQkFFN0QsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsVUFBVTs7b0JBRWpDLFNBQVMsUUFBUSxXQUFXLFlBQVc7d0JBQ25DLFVBQVUsUUFBUSxVQUFVO3dCQUM1QixRQUFRLFlBQVksT0FBTzt3QkFDM0IsUUFBUSxXQUFXLE9BQU87d0JBQzFCLE9BQU87Ozs7Z0JBSWYsV0FBVyxPQUFPLFVBQVMsWUFBWSxZQUFZO29CQUMvQyxXQUFXO29CQUNYLFVBQVUsUUFBUSxRQUNkLDBGQUNJO29CQUVSLFFBQVE7b0JBQ1IsU0FBUyxTQUFTO29CQUNsQixNQUFNO29CQUNOLE1BQU0sUUFBUSxLQUFLO29CQUNuQixXQUFXLElBQUk7OztnQkFHbkIsU0FBUyxtQkFBbUIsVUFBVTtvQkFDbEMsSUFBSSxlQUFlLFNBQVM7b0JBQzVCLE9BQU8sYUFBYSxRQUFRLEtBQUs7b0JBQ2pDLE9BQU8sUUFBUSxXQUFXLFFBQVEsS0FBSzs7O2dCQUczQyxTQUFTLG9CQUFvQixVQUFVO29CQUNuQyxJQUFJLGVBQWUsU0FBUztvQkFDNUIsT0FBTyxhQUFhLFFBQVEsS0FBSzs7O2dCQUdyQyxHQUFHLHVDQUF1QyxZQUFXO29CQUNqRCxJQUFJLFFBQVE7b0JBQ1osbUJBQW1COzs7Z0JBR3ZCLEdBQUcsdUNBQXVDLFlBQVc7b0JBQ2pELElBQUksUUFBUTtvQkFDWixJQUFJLFFBQVE7b0JBQ1osb0JBQW9COzs7Z0JBR3hCLEdBQUcsNENBQTRDLFlBQVc7b0JBQ3RELElBQUksUUFBUTtvQkFDWixtQkFBbUI7OztnQkFHdkIsR0FBRyw0Q0FBNEMsWUFBVztvQkFDdEQsSUFBSSxRQUFRO29CQUNaLElBQUksUUFBUTtvQkFDWixvQkFBb0I7OztnQkFHeEIsR0FBRyw4REFBOEQsWUFBVztvQkFDeEUsSUFBSSxRQUFRO29CQUNaLElBQUksUUFBUTtvQkFDWixtQkFBbUI7OztnQkFHdkIsR0FBRyxvQ0FBb0MsWUFBVztvQkFDOUMsSUFBSTs7O29CQUdKLElBQUksUUFBUTtvQkFDWixtQkFBbUI7OztvQkFHbkIsSUFBSSxFQUFFLE1BQU07b0JBQ1osRUFBRSxVQUFVO29CQUNaLEVBQUUsVUFBVSxRQUFROztvQkFFcEIsb0JBQW9COzs7Z0JBR3hCLEdBQUcsK0NBQStDLFlBQVc7O29CQUV6RCxJQUFJLFFBQVE7b0JBQ1osbUJBQW1COzs7b0JBR25CLElBQUk7O29CQUVKLG9CQUFvQjs7O2dCQUd4QixHQUFHLDRDQUE0QyxZQUFXO29CQUN0RCxJQUFJLFFBQVE7b0JBQ1osbUJBQW1CO29CQUNuQixPQUFPLEVBQUUsZ0JBQWdCLFFBQVEsS0FBSzs7b0JBRXRDLElBQUk7b0JBQ0osb0JBQW9CO29CQUNwQixPQUFPLEVBQUUsZ0JBQWdCLFFBQVEsS0FBSzs7O2dCQUcxQyxHQUFHLDZDQUE2QyxZQUFXO29CQUN2RCxRQUFRLFlBQVk7d0JBQ2hCLFdBQVc7Ozs7b0JBSWYsVUFBVSxRQUFRLFFBQ2Q7b0JBRUosU0FBUyxTQUFTO29CQUNsQixNQUFNO29CQUNOLE9BQU8sUUFBUSxLQUFLO29CQUNwQixZQUFZLEtBQUs7O29CQUVqQixLQUFLLFFBQVE7b0JBQ2IsbUJBQW1CO29CQUNuQixPQUFPLEVBQUUsZ0JBQWdCLFFBQVEsS0FBSzs7b0JBRXRDLEtBQUs7b0JBQ0wsb0JBQW9CO29CQUNwQixPQUFPLEVBQUUsZ0JBQWdCLFFBQVEsS0FBSzs7Ozs7R0FLM0MiLCJmaWxlIjoiY29tbW9uL3dpZGdldC9Qb3BvdmVyRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aWRnZXRNb2R1bGUgZnJvbSAnY29tbW9uL3dpZGdldC9XaWRnZXRNb2R1bGUnO1xuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5cbi8qKlxuICogVGVzdCBwb3BvdmVyIGRpcmVjdGl2ZSBleHRlbmRlZCBmdW5jdGlvbmFsaXR5LlxuICovXG5kZXNjcmliZSgnUG9wb3ZlckRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbG0sIGVsbTIsIGVsbVNjb3BlMiwgZWxtQm9keSwgc2NvcGUsICR3aW5kb3csICRjb21waWxlLCBlbG1TY29wZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdpZGdldE1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICAgLy8gUHJvdmlkZSBtb2NrIHdpbmRvd1xuICAgICAgICAkcHJvdmlkZS5mYWN0b3J5KCckd2luZG93JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkd2luZG93ID0gamFzbWluZS5jcmVhdGVTcHkoJyR3aW5kb3cnKTtcbiAgICAgICAgICAgICR3aW5kb3cubmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgICAgICAgICAgICR3aW5kb3cuZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgICAgICAgICByZXR1cm4gJHdpbmRvdztcbiAgICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSwgXyRjb21waWxlXykge1xuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XG4gICAgICAgIGVsbUJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoXG4gICAgICAgICAgICAnPGRpdj48c3BhbiBwb3BvdmVyLXRpdGxlPVwidGl0bGUgdGV4dFwiIHBvcG92ZXI9XCJwb3BvdmVyIHRleHRcIiBzcC1wb3BvdmVyLWhvdmVyPVwidHJ1ZVwiPicgK1xuICAgICAgICAgICAgICAgICdTZWxlY3RvciBUZXh0PC9zcGFuPjwvZGl2PidcbiAgICAgICAgKTtcbiAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgICAgICAkY29tcGlsZShlbG1Cb2R5KShzY29wZSk7XG4gICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgZWxtID0gZWxtQm9keS5maW5kKCdzcGFuJyk7XG4gICAgICAgIGVsbVNjb3BlID0gZWxtLnNjb3BlKCk7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gdGVzdElzUG9wb3ZlclNob3duKGVsbVNjb3BlKSB7XG4gICAgICAgIHZhciB0b29sdGlwU2NvcGUgPSBlbG1TY29wZS4kJGNoaWxkVGFpbDtcbiAgICAgICAgZXhwZWN0KHRvb2x0aXBTY29wZS5pc09wZW4pLnRvQmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChlbG1Cb2R5LmNoaWxkcmVuKCkubGVuZ3RoKS50b0JlKDIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RJc1BvcG92ZXJIaWRkZW4oZWxtU2NvcGUpIHtcbiAgICAgICAgdmFyIHRvb2x0aXBTY29wZSA9IGVsbVNjb3BlLiQkY2hpbGRUYWlsO1xuICAgICAgICBleHBlY3QodG9vbHRpcFNjb3BlLmlzT3BlbikudG9CZShmYWxzZSk7XG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdoZW4gdHJpZ2dlcmVkIGJ5IGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsbS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB0ZXN0SXNQb3BvdmVyU2hvd24oZWxtU2NvcGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIHdoZW4gdHJpZ2dlcmVkIGJ5IGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsbS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICBlbG0udHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdGVzdElzUG9wb3ZlckhpZGRlbihlbG1TY29wZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgd2hlbiB0cmlnZ2VyZWQgYnkgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbG0udHJpZ2dlcignbW91c2VlbnRlcicpO1xuICAgICAgICB0ZXN0SXNQb3BvdmVyU2hvd24oZWxtU2NvcGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIHdoZW4gdHJpZ2dlcmVkIGJ5IG1vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZWxtLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIGVsbS50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgIHRlc3RJc1BvcG92ZXJIaWRkZW4oZWxtU2NvcGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBOT1QgaGlkZSB3aGVuIHRyaWdnZXJlZCBieSBtb3VzZWVudGVyIGFmdGVyIGEgY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZWxtLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIGVsbS50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG4gICAgICAgIHRlc3RJc1BvcG92ZXJTaG93bihlbG1TY29wZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhpZGUgd2hlbiBFU0Mga2V5IHByZXNzZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGU7XG5cbiAgICAgICAgLy8gdHJpZ2dlciB0aGUgcG9wb3ZlclxuICAgICAgICBlbG0udHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdGVzdElzUG9wb3ZlclNob3duKGVsbVNjb3BlKTtcblxuICAgICAgICAvLyB0cmlnZ2VyIEVTQ1xuICAgICAgICBlID0gJC5FdmVudCgna2V5dXAnKTtcbiAgICAgICAgZS5rZXlDb2RlID0gMjc7IC8vIEVTQ1xuICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKGUpO1xuXG4gICAgICAgIHRlc3RJc1BvcG92ZXJIaWRkZW4oZWxtU2NvcGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIHdoZW4gdHJpZ2dlciBlbGVtZW50IGlzIGJsdXJyZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdHJpZ2dlciB0aGUgcG9wb3ZlclxuICAgICAgICBlbG0udHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdGVzdElzUG9wb3ZlclNob3duKGVsbVNjb3BlKTtcblxuICAgICAgICAvLyBibHVyIHRoZSBlbGVtZW50XG4gICAgICAgIGVsbS5ibHVyKCk7XG5cbiAgICAgICAgdGVzdElzUG9wb3ZlckhpZGRlbihlbG1TY29wZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGlvc2JhY2tkcm9wIHdoZW4gbm90IGlvcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbG0udHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdGVzdElzUG9wb3ZlclNob3duKGVsbVNjb3BlKTtcbiAgICAgICAgZXhwZWN0KCQoJyNpb3NiYWNrZHJvcCcpLmxlbmd0aCkudG9CZSgwKTtcblxuICAgICAgICBlbG0uYmx1cigpO1xuICAgICAgICB0ZXN0SXNQb3BvdmVySGlkZGVuKGVsbVNjb3BlKTtcbiAgICAgICAgZXhwZWN0KCQoJyNpb3NiYWNrZHJvcCcpLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyBhbmQgaGlkZSBpb3NiYWNrZHJvcCB3aGVuIGlvcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkd2luZG93Lm5hdmlnYXRvciA9IHtcbiAgICAgICAgICAgIHVzZXJBZ2VudDogJ01vemlsbGEvNS4wIChpUGFkOyBVOyBDUFUgT1MgM18yIGxpa2UgTWFjIE9TIFg7IGVuLXVzKSdcbiAgICAgICAgfTtcblxuICAgICAgICAvLyByZWNvbXBpbGUgd2l0aCBuZXcgdXNlciBhZ2VudFxuICAgICAgICBlbG1Cb2R5ID0gYW5ndWxhci5lbGVtZW50KFxuICAgICAgICAgICAgJzxkaXY+PHNwYW4gcG9wb3Zlci10aXRsZT1cInRpdGxlIHRleHRcIiBwb3BvdmVyPVwicG9wb3ZlciB0ZXh0XCI+U2VsZWN0b3IgVGV4dDwvc3Bhbj48L2Rpdj4nXG4gICAgICAgICk7XG4gICAgICAgICRjb21waWxlKGVsbUJvZHkpKHNjb3BlKTtcbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBlbG0yID0gZWxtQm9keS5maW5kKCdzcGFuJyk7XG4gICAgICAgIGVsbVNjb3BlMiA9IGVsbTIuc2NvcGUoKTtcblxuICAgICAgICBlbG0yLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHRlc3RJc1BvcG92ZXJTaG93bihlbG1TY29wZTIpO1xuICAgICAgICBleHBlY3QoJCgnI2lvc2JhY2tkcm9wJykubGVuZ3RoKS50b0JlKDEpO1xuXG4gICAgICAgIGVsbTIuYmx1cigpO1xuICAgICAgICB0ZXN0SXNQb3BvdmVySGlkZGVuKGVsbVNjb3BlMik7XG4gICAgICAgIGV4cGVjdCgkKCcjaW9zYmFja2Ryb3AnKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
