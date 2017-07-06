System.register(['test/js/TestInitializer', 'common/directive/DirectiveModule'], function (_export) {
    /* (c) Copyright 2015 SailPoint Technologies, Inc., All Rights Reserved. */
    'use strict';

    var directiveModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDirectiveDirectiveModule) {
            directiveModule = _commonDirectiveDirectiveModule['default'];
        }],
        execute: function () {

            describe('ChevronDirective', function () {
                var element,
                    $scope,
                    $compile,
                    STATES = {
                    full: 'full',
                    collapsible: 'collapsible',
                    summary: 'summary'
                };

                beforeEach(module(directiveModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('WorkItemHeaderDirectiveStates', STATES);
                }));

                beforeEach(inject(function ($rootScope, _$compile_) {
                    $scope = $rootScope.$new();
                    $compile = _$compile_;
                }));

                var compileElement = function (collapsed, style) {
                    var markup = '<sp-chevron sp-collapsed="' + collapsed + '" sp-template-style="' + style + '"></sp-chevron>',
                        el = $compile(markup)($scope);
                    $scope.$digest();
                    return el;
                };

                it('should throw when the template style does not match the internal list', function () {
                    expect(function () {
                        element = compileElement(true, 'foobar');
                    }).toThrow();
                });

                it('should display correct elements with template style of collapsible and collapsed set to true', function () {
                    element = angular.element(compileElement(true, STATES.collapsible));
                    expect(element.find('span .panel-toggle').length).toBe(1);
                    expect(element.find('span .fa-chevron-right').length).toBe(0);
                    expect(element.find('span .fa-chevron-up').length).toBe(1);
                    expect(element.find('span .rotate').length).toBe(0);
                    expect(element.find('span .sr-only')[0].innerHTML).toBe('ui_508_workitem_click_show');
                });

                it('should display correct elements with template style of collapsible and collapsed set to false', function () {
                    element = angular.element(compileElement(false, STATES.collapsible));
                    expect(element.find('span .panel-toggle').length).toBe(1);
                    expect(element.find('span .fa-chevron-right').length).toBe(0);
                    expect(element.find('span .fa-chevron-up').length).toBe(1);
                    expect(element.find('span .rotate').length).toBe(1);
                    expect(element.find('span .sr-only')[0].innerHTML).toBe('ui_508_workitem_click_hide');
                });

                it('should display correct elements with template style of summary and collapsed set to true', function () {
                    element = angular.element(compileElement(true, STATES.summary));
                    expect(element.find('span .panel-toggle').length).toBe(1);
                    expect(element.find('span .fa-chevron-right').length).toBe(1);
                    expect(element.find('span .fa-chevron-up').length).toBe(0);
                    expect(element.find('span .rotate').length).toBe(0);
                    expect(element.find('span .sr-only')[0].innerHTML).toBe('ui_508_workitem_click_link');
                });

                it('should display correct elements with template style of summary and collapsed set to false', function () {
                    element = angular.element(compileElement(false, STATES.summary));
                    expect(element.find('span .panel-toggle').length).toBe(1);
                    expect(element.find('span .fa-chevron-right').length).toBe(1);
                    expect(element.find('span .fa-chevron-up').length).toBe(0);
                    expect(element.find('span .rotate').length).toBe(0);
                    expect(element.find('span .sr-only')[0].innerHTML).toBe('ui_508_workitem_click_link');
                });

                it('should not display anything with template style of full', function () {
                    element = angular.element(compileElement(true, STATES.full));
                    expect(element.find('span .panel-toggle').length).toBe(0);
                    expect(element.find('span .fa-chevron-right').length).toBe(0);
                    expect(element.find('span .fa-chevron-up').length).toBe(0);
                    expect(element.find('span .sr-only').length).toBe(0);
                });

                it('should coerce collapsed to a boolean value false if it is a string', function () {
                    element = angular.element(compileElement('boogers', STATES.collapsible));
                    expect(element.find('span .active').length).toBe(0);
                    expect(element.find('span .rotate').length).toBe(1);
                });

                it('should throw if collapsed is null or undefined', function () {
                    expect(function () {
                        element = compileElement(null, STATES.collapsible);
                    }).toThrow();
                    expect(function () {
                        element = compileElement(undefined, STATES.collapsible);
                    }).toThrow();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kaXJlY3RpdmUvQ2hldnJvbkRpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsVUFBVSxTQUFTOztJQUNwRzs7SUFHSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsaUNBQWlDO1lBQ3ZGLGtCQUFrQixnQ0FBZ0M7O1FBRXRELFNBQVMsWUFBWTs7WUFIN0IsU0FBUyxvQkFBb0IsWUFBVztnQkFDcEMsSUFBSTtvQkFBUztvQkFBUTtvQkFDakIsU0FBUztvQkFDTCxNQUFNO29CQUNOLGFBQWE7b0JBQ2IsU0FBUzs7O2dCQUdqQixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxVQUFVO29CQUNqQyxTQUFTLFNBQVMsaUNBQWlDOzs7Z0JBR3ZELFdBQVcsT0FBTyxVQUFTLFlBQVksWUFBWTtvQkFDL0MsU0FBUyxXQUFXO29CQUNwQixXQUFXOzs7Z0JBR2YsSUFBSSxpQkFBaUIsVUFBUyxXQUFXLE9BQU87b0JBQzVDLElBQUksU0FBUywrQkFBK0IsWUFBWSwwQkFBMEIsUUFBUTt3QkFDdEYsS0FBSyxTQUFTLFFBQVE7b0JBQzFCLE9BQU87b0JBQ1AsT0FBTzs7O2dCQUdYLEdBQUcseUVBQXlFLFlBQVc7b0JBQ25GLE9BQU8sWUFBVzt3QkFDZCxVQUFVLGVBQWUsTUFBTTt1QkFDaEM7OztnQkFHUCxHQUFHLGdHQUFnRyxZQUFXO29CQUMxRyxVQUFVLFFBQVEsUUFBUSxlQUFlLE1BQU0sT0FBTztvQkFDdEQsT0FBTyxRQUFRLEtBQUssc0JBQXNCLFFBQVEsS0FBSztvQkFDdkQsT0FBTyxRQUFRLEtBQUssMEJBQTBCLFFBQVEsS0FBSztvQkFDM0QsT0FBTyxRQUFRLEtBQUssdUJBQXVCLFFBQVEsS0FBSztvQkFDeEQsT0FBTyxRQUFRLEtBQUssZ0JBQWdCLFFBQVEsS0FBSztvQkFDakQsT0FBTyxRQUFRLEtBQUssaUJBQWlCLEdBQUcsV0FBVyxLQUFLOzs7Z0JBRzVELEdBQUcsaUdBQWlHLFlBQVc7b0JBQzNHLFVBQVUsUUFBUSxRQUFRLGVBQWUsT0FBTyxPQUFPO29CQUN2RCxPQUFPLFFBQVEsS0FBSyxzQkFBc0IsUUFBUSxLQUFLO29CQUN2RCxPQUFPLFFBQVEsS0FBSywwQkFBMEIsUUFBUSxLQUFLO29CQUMzRCxPQUFPLFFBQVEsS0FBSyx1QkFBdUIsUUFBUSxLQUFLO29CQUN4RCxPQUFPLFFBQVEsS0FBSyxnQkFBZ0IsUUFBUSxLQUFLO29CQUNqRCxPQUFPLFFBQVEsS0FBSyxpQkFBaUIsR0FBRyxXQUFXLEtBQUs7OztnQkFHNUQsR0FBRyw0RkFBNEYsWUFBVztvQkFDdEcsVUFBVSxRQUFRLFFBQVEsZUFBZSxNQUFNLE9BQU87b0JBQ3RELE9BQU8sUUFBUSxLQUFLLHNCQUFzQixRQUFRLEtBQUs7b0JBQ3ZELE9BQU8sUUFBUSxLQUFLLDBCQUEwQixRQUFRLEtBQUs7b0JBQzNELE9BQU8sUUFBUSxLQUFLLHVCQUF1QixRQUFRLEtBQUs7b0JBQ3hELE9BQU8sUUFBUSxLQUFLLGdCQUFnQixRQUFRLEtBQUs7b0JBQ2pELE9BQU8sUUFBUSxLQUFLLGlCQUFpQixHQUFHLFdBQVcsS0FBSzs7O2dCQUc1RCxHQUFHLDZGQUE2RixZQUFXO29CQUN2RyxVQUFVLFFBQVEsUUFBUSxlQUFlLE9BQU8sT0FBTztvQkFDdkQsT0FBTyxRQUFRLEtBQUssc0JBQXNCLFFBQVEsS0FBSztvQkFDdkQsT0FBTyxRQUFRLEtBQUssMEJBQTBCLFFBQVEsS0FBSztvQkFDM0QsT0FBTyxRQUFRLEtBQUssdUJBQXVCLFFBQVEsS0FBSztvQkFDeEQsT0FBTyxRQUFRLEtBQUssZ0JBQWdCLFFBQVEsS0FBSztvQkFDakQsT0FBTyxRQUFRLEtBQUssaUJBQWlCLEdBQUcsV0FBVyxLQUFLOzs7Z0JBRzVELEdBQUcsMkRBQTJELFlBQVc7b0JBQ3JFLFVBQVUsUUFBUSxRQUFRLGVBQWUsTUFBTSxPQUFPO29CQUN0RCxPQUFPLFFBQVEsS0FBSyxzQkFBc0IsUUFBUSxLQUFLO29CQUN2RCxPQUFPLFFBQVEsS0FBSywwQkFBMEIsUUFBUSxLQUFLO29CQUMzRCxPQUFPLFFBQVEsS0FBSyx1QkFBdUIsUUFBUSxLQUFLO29CQUN4RCxPQUFPLFFBQVEsS0FBSyxpQkFBaUIsUUFBUSxLQUFLOzs7Z0JBR3RELEdBQUcsc0VBQXNFLFlBQVc7b0JBQ2hGLFVBQVUsUUFBUSxRQUFRLGVBQWUsV0FBVyxPQUFPO29CQUMzRCxPQUFPLFFBQVEsS0FBSyxnQkFBZ0IsUUFBUSxLQUFLO29CQUNqRCxPQUFPLFFBQVEsS0FBSyxnQkFBZ0IsUUFBUSxLQUFLOzs7Z0JBR3JELEdBQUcsa0RBQWtELFlBQVc7b0JBQzVELE9BQU8sWUFBVzt3QkFDZCxVQUFVLGVBQWUsTUFBTSxPQUFPO3VCQUN2QztvQkFDSCxPQUFPLFlBQVc7d0JBQ2QsVUFBVSxlQUFlLFdBQVcsT0FBTzt1QkFDNUM7Ozs7O0dBWVIiLCJmaWxlIjoiY29tbW9uL2RpcmVjdGl2ZS9DaGV2cm9uRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoYykgQ29weXJpZ2h0IDIwMTUgU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgZGlyZWN0aXZlTW9kdWxlIGZyb20gJ2NvbW1vbi9kaXJlY3RpdmUvRGlyZWN0aXZlTW9kdWxlJztcblxuZGVzY3JpYmUoJ0NoZXZyb25EaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWxlbWVudCwgJHNjb3BlLCAkY29tcGlsZSxcbiAgICAgICAgU1RBVEVTID0ge1xuICAgICAgICAgICAgZnVsbDogJ2Z1bGwnLFxuICAgICAgICAgICAgY29sbGFwc2libGU6ICdjb2xsYXBzaWJsZScsXG4gICAgICAgICAgICBzdW1tYXJ5OiAnc3VtbWFyeSdcbiAgICAgICAgfTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGRpcmVjdGl2ZU1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICAgICAgJHByb3ZpZGUuY29uc3RhbnQoJ1dvcmtJdGVtSGVhZGVyRGlyZWN0aXZlU3RhdGVzJywgU1RBVEVTKTtcbiAgICB9KSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkcm9vdFNjb3BlLCBfJGNvbXBpbGVfKSB7XG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XG4gICAgfSkpO1xuXG4gICAgdmFyIGNvbXBpbGVFbGVtZW50ID0gZnVuY3Rpb24oY29sbGFwc2VkLCBzdHlsZSkge1xuICAgICAgICB2YXIgbWFya3VwID0gJzxzcC1jaGV2cm9uIHNwLWNvbGxhcHNlZD1cIicgKyBjb2xsYXBzZWQgKyAnXCIgc3AtdGVtcGxhdGUtc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+PC9zcC1jaGV2cm9uPicsXG4gICAgICAgICAgICBlbCA9ICRjb21waWxlKG1hcmt1cCkoJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IHdoZW4gdGhlIHRlbXBsYXRlIHN0eWxlIGRvZXMgbm90IG1hdGNoIHRoZSBpbnRlcm5hbCBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjb21waWxlRWxlbWVudCh0cnVlLCAnZm9vYmFyJyk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGVsZW1lbnRzIHdpdGggdGVtcGxhdGUgc3R5bGUgb2YgY29sbGFwc2libGUgYW5kIGNvbGxhcHNlZCBzZXQgdG8gdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGNvbXBpbGVFbGVtZW50KHRydWUsIFNUQVRFUy5jb2xsYXBzaWJsZSkpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5wYW5lbC10b2dnbGUnKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmZhLWNoZXZyb24tcmlnaHQnKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmZhLWNoZXZyb24tdXAnKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLnJvdGF0ZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAuc3Itb25seScpWzBdLmlubmVySFRNTCkudG9CZSgndWlfNTA4X3dvcmtpdGVtX2NsaWNrX3Nob3cnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGVsZW1lbnRzIHdpdGggdGVtcGxhdGUgc3R5bGUgb2YgY29sbGFwc2libGUgYW5kIGNvbGxhcHNlZCBzZXQgdG8gZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChjb21waWxlRWxlbWVudChmYWxzZSwgU1RBVEVTLmNvbGxhcHNpYmxlKSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLnBhbmVsLXRvZ2dsZScpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAuZmEtY2hldnJvbi1yaWdodCcpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAuZmEtY2hldnJvbi11cCcpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAucm90YXRlJykubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5zci1vbmx5JylbMF0uaW5uZXJIVE1MKS50b0JlKCd1aV81MDhfd29ya2l0ZW1fY2xpY2tfaGlkZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgZWxlbWVudHMgd2l0aCB0ZW1wbGF0ZSBzdHlsZSBvZiBzdW1tYXJ5IGFuZCBjb2xsYXBzZWQgc2V0IHRvIHRydWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChjb21waWxlRWxlbWVudCh0cnVlLCBTVEFURVMuc3VtbWFyeSkpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5wYW5lbC10b2dnbGUnKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmZhLWNoZXZyb24tcmlnaHQnKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmZhLWNoZXZyb24tdXAnKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLnJvdGF0ZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAuc3Itb25seScpWzBdLmlubmVySFRNTCkudG9CZSgndWlfNTA4X3dvcmtpdGVtX2NsaWNrX2xpbmsnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGVsZW1lbnRzIHdpdGggdGVtcGxhdGUgc3R5bGUgb2Ygc3VtbWFyeSBhbmQgY29sbGFwc2VkIHNldCB0byBmYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGNvbXBpbGVFbGVtZW50KGZhbHNlLCBTVEFURVMuc3VtbWFyeSkpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5wYW5lbC10b2dnbGUnKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmZhLWNoZXZyb24tcmlnaHQnKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmZhLWNoZXZyb24tdXAnKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLnJvdGF0ZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAuc3Itb25seScpWzBdLmlubmVySFRNTCkudG9CZSgndWlfNTA4X3dvcmtpdGVtX2NsaWNrX2xpbmsnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGRpc3BsYXkgYW55dGhpbmcgd2l0aCB0ZW1wbGF0ZSBzdHlsZSBvZiBmdWxsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoY29tcGlsZUVsZW1lbnQodHJ1ZSwgU1RBVEVTLmZ1bGwpKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAucGFuZWwtdG9nZ2xlJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5mYS1jaGV2cm9uLXJpZ2h0JykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5mYS1jaGV2cm9uLXVwJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCdzcGFuIC5zci1vbmx5JykubGVuZ3RoKS50b0JlKDApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb2VyY2UgY29sbGFwc2VkIHRvIGEgYm9vbGVhbiB2YWx1ZSBmYWxzZSBpZiBpdCBpcyBhIHN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGNvbXBpbGVFbGVtZW50KCdib29nZXJzJywgU1RBVEVTLmNvbGxhcHNpYmxlKSk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50LmZpbmQoJ3NwYW4gLmFjdGl2ZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnc3BhbiAucm90YXRlJykubGVuZ3RoKS50b0JlKDEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBpZiBjb2xsYXBzZWQgaXMgbnVsbCBvciB1bmRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudCA9IGNvbXBpbGVFbGVtZW50KG51bGwsIFNUQVRFUy5jb2xsYXBzaWJsZSk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudCA9IGNvbXBpbGVFbGVtZW50KHVuZGVmaW5lZCwgU1RBVEVTLmNvbGxhcHNpYmxlKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG5cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
