System.register(['certification/CertificationModule', 'test/js/TestInitializer'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_testJsTestInitializer) {}],
        execute: function () {

            describe('spCertificationLink', function () {

                var elementDefinition = '<sp-certification-link sp-model="certification" />',
                    $scope = undefined,
                    $compile = undefined,
                    element = undefined;

                beforeEach(module(certificationModule));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                beforeEach(inject(function (_$rootScope_, _$compile_) {
                    $scope = _$rootScope_.$new();
                    $compile = _$compile_;
                }));

                function createElement(certification) {
                    element = angular.element(elementDefinition);
                    $scope.certification = certification;
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                it('throws if no certification object is provided', function () {
                    expect(function () {
                        createElement();
                    }).toThrow();
                });

                it('creates correct anchor element with certification name and id', function () {
                    var certification = {
                        id: 'thecertid',
                        name: 'thecertname'
                    };

                    element = createElement(certification);
                    expect(element[0].innerText.trim()).toEqual(certification.name);

                    var anchorEl = element.find('a');
                    expect(anchorEl.attr('href')).toEqual('#/certification/' + certification.id);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbkxpbmtEaXJlY3RpdmVUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQyxxQ0FBcUMsNEJBQTRCLFVBQVUsU0FBUzs7Ozs7SUFLakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSxtQ0FBbUM7WUFDbkQsc0JBQXNCLGtDQUFrQztXQUN6RCxVQUFVLHdCQUF3QjtRQUNyQyxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsdUJBQXVCLFlBQU07O2dCQUVsQyxJQUFJLG9CQUFvQjtvQkFDcEIsU0FBTTtvQkFBRSxXQUFRO29CQUFFLFVBQU87O2dCQUU3QixXQUFXLE9BQU87O2dCQUVsQixVQUFVLFlBQU07b0JBQ1osSUFBSSxTQUFTO3dCQUNULFFBQVE7Ozs7Z0JBSWhCLFdBQVcsT0FBTyxVQUFTLGNBQWMsWUFBWTtvQkFDakQsU0FBUyxhQUFhO29CQUN0QixXQUFXOzs7Z0JBSWYsU0FBUyxjQUFjLGVBQWU7b0JBQ2xDLFVBQVUsUUFBUSxRQUFRO29CQUMxQixPQUFPLGdCQUFnQjtvQkFDdkIsU0FBUyxTQUFTO29CQUNsQixPQUFPO29CQUNQLE9BQU87OztnQkFHWCxHQUFHLGlEQUFpRCxZQUFNO29CQUN0RCxPQUFPLFlBQU07d0JBQ1Q7dUJBQ0Q7OztnQkFHUCxHQUFHLGlFQUFpRSxZQUFNO29CQUN0RSxJQUFJLGdCQUFnQjt3QkFDakIsSUFBSTt3QkFDSCxNQUFNOzs7b0JBR1YsVUFBVSxjQUFjO29CQUN4QixPQUFPLFFBQVEsR0FBRyxVQUFVLFFBQVEsUUFBUSxjQUFjOztvQkFFMUQsSUFBSSxXQUFXLFFBQVEsS0FBSztvQkFDNUIsT0FBTyxTQUFTLEtBQUssU0FBUyxRQUFPLHFCQUFvQixjQUFjOzs7OztHQWE1RSIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25MaW5rRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKGMpIENvcHlyaWdodCAyMDE2LiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICovXG5cbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcblxuZGVzY3JpYmUoJ3NwQ2VydGlmaWNhdGlvbkxpbmsnLCAoKSA9PiB7XG5cbiAgICBsZXQgZWxlbWVudERlZmluaXRpb24gPSAnPHNwLWNlcnRpZmljYXRpb24tbGluayBzcC1tb2RlbD1cImNlcnRpZmljYXRpb25cIiAvPicsXG4gICAgICAgICRzY29wZSwgJGNvbXBpbGUsIGVsZW1lbnQ7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRyb290U2NvcGVfLCBfJGNvbXBpbGVfKSB7XG4gICAgICAgICRzY29wZSA9IF8kcm9vdFNjb3BlXy4kbmV3KCk7XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcblxuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoY2VydGlmaWNhdGlvbikge1xuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKTtcbiAgICAgICAgJHNjb3BlLmNlcnRpZmljYXRpb24gPSBjZXJ0aWZpY2F0aW9uO1xuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIGl0KCd0aHJvd3MgaWYgbm8gY2VydGlmaWNhdGlvbiBvYmplY3QgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgICBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGVzIGNvcnJlY3QgYW5jaG9yIGVsZW1lbnQgd2l0aCBjZXJ0aWZpY2F0aW9uIG5hbWUgYW5kIGlkJywgKCkgPT4ge1xuICAgICAgICBsZXQgY2VydGlmaWNhdGlvbiA9IHtcbiAgICAgICAgICAgaWQ6ICd0aGVjZXJ0aWQnLFxuICAgICAgICAgICAgbmFtZTogJ3RoZWNlcnRuYW1lJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGNlcnRpZmljYXRpb24pO1xuICAgICAgICBleHBlY3QoZWxlbWVudFswXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKGNlcnRpZmljYXRpb24ubmFtZSk7XG5cbiAgICAgICAgbGV0IGFuY2hvckVsID0gZWxlbWVudC5maW5kKCdhJyk7XG4gICAgICAgIGV4cGVjdChhbmNob3JFbC5hdHRyKCdocmVmJykpLnRvRXF1YWwoYCMvY2VydGlmaWNhdGlvbi8ke2NlcnRpZmljYXRpb24uaWR9YCk7XG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
