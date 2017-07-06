System.register(['test/js/TestInitializer', 'common/email/EmailModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * EmailDialogService tests
     */
    'use strict';

    var emailModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonEmailEmailModule) {
            emailModule = _commonEmailEmailModule['default'];
        }],
        execute: function () {
            describe('EmailDialogServiceTests', function () {

                var spModal = undefined,
                    $q = undefined,
                    emailDialogService = undefined;

                beforeEach(module(emailModule));

                beforeEach(inject(function (_spModal_, _$q_, _EmailDialogService_) {
                    spModal = _spModal_;
                    $q = _$q_;
                    emailDialogService = _EmailDialogService_;
                }));

                describe('showEmailDialog', function () {

                    beforeEach(function () {
                        spyOn(spModal, 'open').and.returnValue({
                            result: $q.when({})
                        });
                    });

                    it('should open spModal with appropriate params', function () {
                        var template = {
                            foo: 'bar'
                        };

                        emailDialogService.showEmailDialog(template, 'foo title');

                        expect(spModal.open).toHaveBeenCalled();
                        expect(spModal.open.calls.mostRecent().args[0].resolve.emailTemplate()).toBe(template);
                        // and spot check
                        expect(spModal.open.calls.mostRecent().args[0].title).toBe('foo title');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9lbWFpbC9FbWFpbERpYWxvZ1NlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsNkJBQTZCLFVBQVUsU0FBUzs7Ozs7O0lBTXhGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsY0FBYyx3QkFBd0I7O1FBRTFDLFNBQVMsWUFBWTtZQU43QixTQUFTLDJCQUEyQixZQUFNOztnQkFFdkMsSUFBSSxVQUFPO29CQUFFLEtBQUU7b0JBQUUscUJBQWtCOztnQkFFbEMsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMsV0FBVyxNQUFNLHNCQUF5QjtvQkFDekQsVUFBVTtvQkFDVixLQUFLO29CQUNMLHFCQUFxQjs7O2dCQUd6QixTQUFTLG1CQUFtQixZQUFNOztvQkFFOUIsV0FBVyxZQUFNO3dCQUNiLE1BQU0sU0FBUyxRQUFRLElBQUksWUFBWTs0QkFDbkMsUUFBUSxHQUFHLEtBQUs7Ozs7b0JBSXhCLEdBQUcsK0NBQStDLFlBQU07d0JBQ3BELElBQUksV0FBVzs0QkFDWCxLQUFLOzs7d0JBR1QsbUJBQW1CLGdCQUFnQixVQUFVOzt3QkFFN0MsT0FBTyxRQUFRLE1BQU07d0JBQ3JCLE9BQU8sUUFBUSxLQUFLLE1BQU0sYUFBYSxLQUFLLEdBQUcsUUFBUSxpQkFBaUIsS0FBSzs7d0JBRTdFLE9BQU8sUUFBUSxLQUFLLE1BQU0sYUFBYSxLQUFLLEdBQUcsT0FBTyxLQUFLOzs7Ozs7R0FlcEUiLCJmaWxlIjoiY29tbW9uL2VtYWlsL0VtYWlsRGlhbG9nU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBlbWFpbE1vZHVsZSBmcm9tICdjb21tb24vZW1haWwvRW1haWxNb2R1bGUnO1xuXG4vKipcbiAqIEVtYWlsRGlhbG9nU2VydmljZSB0ZXN0c1xuICovXG5kZXNjcmliZSgnRW1haWxEaWFsb2dTZXJ2aWNlVGVzdHMnLCAoKSA9PiB7XG5cbiAgIGxldCBzcE1vZGFsLCAkcSwgZW1haWxEaWFsb2dTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZW1haWxNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfc3BNb2RhbF8sIF8kcV8sIF9FbWFpbERpYWxvZ1NlcnZpY2VfKSA9PiB7XG4gICAgICAgIHNwTW9kYWwgPSBfc3BNb2RhbF87XG4gICAgICAgICRxID0gXyRxXztcbiAgICAgICAgZW1haWxEaWFsb2dTZXJ2aWNlID0gX0VtYWlsRGlhbG9nU2VydmljZV87XG4gICAgfSkpO1xuXG4gICAgZGVzY3JpYmUoJ3Nob3dFbWFpbERpYWxvZycsICgpID0+IHtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJykuYW5kLnJldHVyblZhbHVlKHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6ICRxLndoZW4oe30pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBvcGVuIHNwTW9kYWwgd2l0aCBhcHByb3ByaWF0ZSBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSB7XG4gICAgICAgICAgICAgICAgZm9vOiAnYmFyJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZW1haWxEaWFsb2dTZXJ2aWNlLnNob3dFbWFpbERpYWxvZyh0ZW1wbGF0ZSwgJ2ZvbyB0aXRsZScpO1xuXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLnJlc29sdmUuZW1haWxUZW1wbGF0ZSgpKS50b0JlKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIC8vIGFuZCBzcG90IGNoZWNrXG4gICAgICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLnRpdGxlKS50b0JlKCdmb28gdGl0bGUnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
