System.register(['test/js/TestInitializer', 'common/directive/DirectiveModule'], function (_export) {
    /* (c) Copyright 2015 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var directiveModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDirectiveDirectiveModule) {
            directiveModule = _commonDirectiveDirectiveModule['default'];
        }],
        execute: function () {

            describe('GaugeDirective', function () {
                var elementDefinition = '<sp-gauge sp-gauge-completed-items="4"' + '    sp-gauge-total-items="8"' + '    sp-gauge-completion-display-style="{{style}}"/>',
                    scope,
                    $compile;

                beforeEach(module(directiveModule));

                beforeEach(inject(function ($rootScope, _$compile_) {
                    scope = $rootScope.$new();
                    $compile = _$compile_;
                    scope.style = 'percentage';
                }));

                function createElement() {
                    var element = angular.element(elementDefinition);
                    $compile(element)(scope);
                    scope.$apply();
                    return element;
                }

                it('adds getPercent to scope', function () {
                    var element = createElement();
                    expect(typeof element.isolateScope().getPercent === 'function').toBeTruthy();
                    expect(element.isolateScope().getPercent()).toBe(50);
                });

                it('adds isPercent to scope', function () {
                    var element = createElement();
                    expect(typeof element.isolateScope().isPercent === 'function').toBeTruthy();
                    expect(element.isolateScope().isPercent()).toBe(true);
                });

                it('hides full numbers if percent', function () {
                    var element = createElement();
                    expect(element.find('.h2').length).toEqual(1);
                    expect(element.find('.h4').length).toEqual(0);
                });

                it('hides percent if full numbers', function () {
                    scope.style = 'full';
                    var element = createElement();
                    expect(element.find('.h2').length).toEqual(0);
                    expect(element.find('.h4').length).toEqual(1);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kaXJlY3RpdmUvR2F1Z2VEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLFVBQVUsU0FBUzs7SUFDcEc7O0lBR0ksSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLGlDQUFpQztZQUN2RixrQkFBa0IsZ0NBQWdDOztRQUV0RCxTQUFTLFlBQVk7O1lBSDdCLFNBQVMsa0JBQWtCLFlBQVc7Z0JBQ2xDLElBQUksb0JBQW9CLDJDQUNoQixpQ0FDQTtvQkFDSjtvQkFBTzs7Z0JBRVgsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsWUFBWSxZQUFZO29CQUMvQyxRQUFRLFdBQVc7b0JBQ25CLFdBQVc7b0JBQ1gsTUFBTSxRQUFROzs7Z0JBR2xCLFNBQVMsZ0JBQWdCO29CQUNyQixJQUFJLFVBQVUsUUFBUSxRQUFRO29CQUM5QixTQUFTLFNBQVM7b0JBQ2xCLE1BQU07b0JBQ04sT0FBTzs7O2dCQUdYLEdBQUcsNEJBQTRCLFlBQVc7b0JBQ3RDLElBQUksVUFBVTtvQkFDZCxPQUFPLE9BQU8sUUFBUSxlQUFlLGVBQWUsWUFBWTtvQkFDaEUsT0FBTyxRQUFRLGVBQWUsY0FBYyxLQUFLOzs7Z0JBR3JELEdBQUcsMkJBQTJCLFlBQVc7b0JBQ3JDLElBQUksVUFBVTtvQkFDZCxPQUFPLE9BQU8sUUFBUSxlQUFlLGNBQWMsWUFBWTtvQkFDL0QsT0FBTyxRQUFRLGVBQWUsYUFBYSxLQUFLOzs7Z0JBR3BELEdBQUcsaUNBQWlDLFlBQVc7b0JBQzNDLElBQUksVUFBVTtvQkFDZCxPQUFPLFFBQVEsS0FBSyxPQUFPLFFBQVEsUUFBUTtvQkFDM0MsT0FBTyxRQUFRLEtBQUssT0FBTyxRQUFRLFFBQVE7OztnQkFHL0MsR0FBRyxpQ0FBaUMsWUFBVztvQkFDM0MsTUFBTSxRQUFRO29CQUNkLElBQUksVUFBVTtvQkFDZCxPQUFPLFFBQVEsS0FBSyxPQUFPLFFBQVEsUUFBUTtvQkFDM0MsT0FBTyxRQUFRLEtBQUssT0FBTyxRQUFRLFFBQVE7Ozs7O0dBU2hEIiwiZmlsZSI6ImNvbW1vbi9kaXJlY3RpdmUvR2F1Z2VEaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNSBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBkaXJlY3RpdmVNb2R1bGUgZnJvbSAnY29tbW9uL2RpcmVjdGl2ZS9EaXJlY3RpdmVNb2R1bGUnO1xuXG5kZXNjcmliZSgnR2F1Z2VEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWxlbWVudERlZmluaXRpb24gPSAnPHNwLWdhdWdlIHNwLWdhdWdlLWNvbXBsZXRlZC1pdGVtcz1cIjRcIicgK1xuICAgICAgICAgICAgJyAgICBzcC1nYXVnZS10b3RhbC1pdGVtcz1cIjhcIicgK1xuICAgICAgICAgICAgJyAgICBzcC1nYXVnZS1jb21wbGV0aW9uLWRpc3BsYXktc3R5bGU9XCJ7e3N0eWxlfX1cIi8+JyxcbiAgICAgICAgc2NvcGUsICRjb21waWxlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZGlyZWN0aXZlTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCBfJGNvbXBpbGVfKSB7XG4gICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgc2NvcGUuc3R5bGUgPSAncGVyY2VudGFnZSc7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pO1xuICAgICAgICAkY29tcGlsZShlbGVtZW50KShzY29wZSk7XG4gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBpdCgnYWRkcyBnZXRQZXJjZW50IHRvIHNjb3BlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBleHBlY3QodHlwZW9mIGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCkuZ2V0UGVyY2VudCA9PT0gJ2Z1bmN0aW9uJykudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5pc29sYXRlU2NvcGUoKS5nZXRQZXJjZW50KCkpLnRvQmUoNTApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgaXNQZXJjZW50IHRvIHNjb3BlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBleHBlY3QodHlwZW9mIGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCkuaXNQZXJjZW50ID09PSAnZnVuY3Rpb24nKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50Lmlzb2xhdGVTY29wZSgpLmlzUGVyY2VudCgpKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hpZGVzIGZ1bGwgbnVtYmVycyBpZiBwZXJjZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuaDInKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5oNCcpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcblxuICAgIGl0KCdoaWRlcyBwZXJjZW50IGlmIGZ1bGwgbnVtYmVycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5zdHlsZSA9ICdmdWxsJztcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJy5oMicpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmg0JykubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
