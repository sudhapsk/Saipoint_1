System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('ScorecardDirective', function () {

                var $compile = undefined,
                    $scope = undefined,
                    scorecard = undefined,
                    element = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$compile_, $rootScope, Scorecard, certificationTestData) {
                    $compile = _$compile_;

                    $scope = $rootScope.$new();
                    scorecard = new Scorecard(certificationTestData.SCORECARD);
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                function compile() {
                    element = angular.element('<sp-scorecard sp-scorecard="card" />');
                    $scope.card = scorecard;
                    $compile(element)($scope);
                    $scope.$digest();
                }

                it('renders the total score in the header', function () {
                    compile();
                    var scoreElt = element.find('p.pull-right');
                    expect(scoreElt.length).toEqual(1);
                    var text = scoreElt.text();
                    expect(text.indexOf(scorecard.composite)).toBeGreaterThan(-1);
                });

                function checkCellValue(rows, rowIdx, colIdx, expected) {
                    expect(rows.length).toBeGreaterThan(rowIdx);
                    var row = angular.element(rows[rowIdx]);
                    var cols = row.find('td');
                    expect(cols.length).toEqual(3);
                    var col = angular.element(cols[colIdx]);
                    expect(col.text().indexOf(expected)).toBeGreaterThan(-1);
                }

                it('renders each score category', function () {
                    compile();
                    var rows = element.find('table > tbody > tr');
                    expect(rows.length).toEqual(2);

                    checkCellValue(rows, 0, 0, scorecard.scores[0].categoryDisplayName);
                    checkCellValue(rows, 0, 1, scorecard.scores[0].score);
                    checkCellValue(rows, 0, 2, scorecard.scores[0].compensatedScore);

                    checkCellValue(rows, 1, 0, scorecard.scores[1].categoryDisplayName);
                    checkCellValue(rows, 1, 1, scorecard.scores[1].score);
                    checkCellValue(rows, 1, 2, scorecard.scores[1].compensatedScore);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vU2NvcmVjYXJkRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7SUFDakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDOztRQUU1RCxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsc0JBQXNCLFlBQU07O2dCQUVqQyxJQUFJLFdBQVE7b0JBQUUsU0FBTTtvQkFBRSxZQUFTO29CQUFFLFVBQU87O2dCQUV4QyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxZQUFZLFlBQVksV0FBVyx1QkFBMEI7b0JBQzVFLFdBQVc7O29CQUVYLFNBQVMsV0FBVztvQkFDcEIsWUFBWSxJQUFJLFVBQVUsc0JBQXNCOzs7Z0JBR3BELFVBQVUsWUFBTTtvQkFDWixJQUFJLFNBQVM7d0JBQ1QsUUFBUTs7OztnQkFJaEIsU0FBUyxVQUFVO29CQUNmLFVBQVUsUUFBUSxRQUFRO29CQUMxQixPQUFPLE9BQU87b0JBQ2QsU0FBUyxTQUFTO29CQUNsQixPQUFPOzs7Z0JBR1gsR0FBRyx5Q0FBeUMsWUFBTTtvQkFDOUM7b0JBQ0EsSUFBSSxXQUFXLFFBQVEsS0FBSztvQkFDNUIsT0FBTyxTQUFTLFFBQVEsUUFBUTtvQkFDaEMsSUFBSSxPQUFPLFNBQVM7b0JBQ3BCLE9BQU8sS0FBSyxRQUFRLFVBQVUsWUFBWSxnQkFBZ0IsQ0FBQzs7O2dCQUcvRCxTQUFTLGVBQWUsTUFBTSxRQUFRLFFBQVEsVUFBVTtvQkFDcEQsT0FBTyxLQUFLLFFBQVEsZ0JBQWdCO29CQUNwQyxJQUFJLE1BQU0sUUFBUSxRQUFRLEtBQUs7b0JBQy9CLElBQUksT0FBTyxJQUFJLEtBQUs7b0JBQ3BCLE9BQU8sS0FBSyxRQUFRLFFBQVE7b0JBQzVCLElBQUksTUFBTSxRQUFRLFFBQVEsS0FBSztvQkFDL0IsT0FBTyxJQUFJLE9BQU8sUUFBUSxXQUFXLGdCQUFnQixDQUFDOzs7Z0JBRzFELEdBQUcsK0JBQStCLFlBQU07b0JBQ3BDO29CQUNBLElBQUksT0FBTyxRQUFRLEtBQUs7b0JBQ3hCLE9BQU8sS0FBSyxRQUFRLFFBQVE7O29CQUU1QixlQUFlLE1BQU0sR0FBRyxHQUFHLFVBQVUsT0FBTyxHQUFHO29CQUMvQyxlQUFlLE1BQU0sR0FBRyxHQUFHLFVBQVUsT0FBTyxHQUFHO29CQUMvQyxlQUFlLE1BQU0sR0FBRyxHQUFHLFVBQVUsT0FBTyxHQUFHOztvQkFFL0MsZUFBZSxNQUFNLEdBQUcsR0FBRyxVQUFVLE9BQU8sR0FBRztvQkFDL0MsZUFBZSxNQUFNLEdBQUcsR0FBRyxVQUFVLE9BQU8sR0FBRztvQkFDL0MsZUFBZSxNQUFNLEdBQUcsR0FBRyxVQUFVLE9BQU8sR0FBRzs7Ozs7R0FlcEQiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9TY29yZWNhcmREaXJlY3RpdmVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ1Njb3JlY2FyZERpcmVjdGl2ZScsICgpID0+IHtcclxuXHJcbiAgICBsZXQgJGNvbXBpbGUsICRzY29wZSwgc2NvcmVjYXJkLCBlbGVtZW50O1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdCgoXyRjb21waWxlXywgJHJvb3RTY29wZSwgU2NvcmVjYXJkLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEpID0+IHtcclxuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XHJcblxyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHNjb3JlY2FyZCA9IG5ldyBTY29yZWNhcmQoY2VydGlmaWNhdGlvblRlc3REYXRhLlNDT1JFQ0FSRCk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUoKSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudCgnPHNwLXNjb3JlY2FyZCBzcC1zY29yZWNhcmQ9XCJjYXJkXCIgLz4nKTtcclxuICAgICAgICAkc2NvcGUuY2FyZCA9IHNjb3JlY2FyZDtcclxuICAgICAgICAkY29tcGlsZShlbGVtZW50KSgkc2NvcGUpO1xyXG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXQoJ3JlbmRlcnMgdGhlIHRvdGFsIHNjb3JlIGluIHRoZSBoZWFkZXInLCAoKSA9PiB7XHJcbiAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgIGxldCBzY29yZUVsdCA9IGVsZW1lbnQuZmluZCgncC5wdWxsLXJpZ2h0Jyk7XHJcbiAgICAgICAgZXhwZWN0KHNjb3JlRWx0Lmxlbmd0aCkudG9FcXVhbCgxKTtcclxuICAgICAgICBsZXQgdGV4dCA9IHNjb3JlRWx0LnRleHQoKTtcclxuICAgICAgICBleHBlY3QodGV4dC5pbmRleE9mKHNjb3JlY2FyZC5jb21wb3NpdGUpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tDZWxsVmFsdWUocm93cywgcm93SWR4LCBjb2xJZHgsIGV4cGVjdGVkKSB7XHJcbiAgICAgICAgZXhwZWN0KHJvd3MubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4ocm93SWR4KTtcclxuICAgICAgICBsZXQgcm93ID0gYW5ndWxhci5lbGVtZW50KHJvd3Nbcm93SWR4XSk7XHJcbiAgICAgICAgbGV0IGNvbHMgPSByb3cuZmluZCgndGQnKTtcclxuICAgICAgICBleHBlY3QoY29scy5sZW5ndGgpLnRvRXF1YWwoMyk7XHJcbiAgICAgICAgbGV0IGNvbCA9IGFuZ3VsYXIuZWxlbWVudChjb2xzW2NvbElkeF0pO1xyXG4gICAgICAgIGV4cGVjdChjb2wudGV4dCgpLmluZGV4T2YoZXhwZWN0ZWQpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIGl0KCdyZW5kZXJzIGVhY2ggc2NvcmUgY2F0ZWdvcnknLCAoKSA9PiB7XHJcbiAgICAgICAgY29tcGlsZSgpO1xyXG4gICAgICAgIGxldCByb3dzID0gZWxlbWVudC5maW5kKCd0YWJsZSA+IHRib2R5ID4gdHInKTtcclxuICAgICAgICBleHBlY3Qocm93cy5sZW5ndGgpLnRvRXF1YWwoMik7XHJcblxyXG4gICAgICAgIGNoZWNrQ2VsbFZhbHVlKHJvd3MsIDAsIDAsIHNjb3JlY2FyZC5zY29yZXNbMF0uY2F0ZWdvcnlEaXNwbGF5TmFtZSk7XHJcbiAgICAgICAgY2hlY2tDZWxsVmFsdWUocm93cywgMCwgMSwgc2NvcmVjYXJkLnNjb3Jlc1swXS5zY29yZSk7XHJcbiAgICAgICAgY2hlY2tDZWxsVmFsdWUocm93cywgMCwgMiwgc2NvcmVjYXJkLnNjb3Jlc1swXS5jb21wZW5zYXRlZFNjb3JlKTtcclxuXHJcbiAgICAgICAgY2hlY2tDZWxsVmFsdWUocm93cywgMSwgMCwgc2NvcmVjYXJkLnNjb3Jlc1sxXS5jYXRlZ29yeURpc3BsYXlOYW1lKTtcclxuICAgICAgICBjaGVja0NlbGxWYWx1ZShyb3dzLCAxLCAxLCBzY29yZWNhcmQuc2NvcmVzWzFdLnNjb3JlKTtcclxuICAgICAgICBjaGVja0NlbGxWYWx1ZShyb3dzLCAxLCAyLCBzY29yZWNhcmQuc2NvcmVzWzFdLmNvbXBlbnNhdGVkU2NvcmUpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
