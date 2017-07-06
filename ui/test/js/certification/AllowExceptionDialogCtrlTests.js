System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    /*
     * (c) Copyright 2016. SailPoint Technologies, Inc., All Rights Reserved.
     */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('AllowExceptionDialogCtrl', function () {

                var $controller = undefined,
                    $modalInstance = {
                    close: jasmine.createSpy()
                };

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_$controller_) {
                    $controller = _$controller_;
                }));

                /* jshint maxparams: 7 */
                function createController(date, minDate, maxDate, requireComments, showExpirationDate, existingDecision, readOnly) {
                    return $controller('AllowExceptionDialogCtrl', {
                        expirationDate: date,
                        minDate: minDate,
                        maxDate: maxDate,
                        requireComments: requireComments,
                        showExpirationDate: showExpirationDate,
                        existingDecision: existingDecision,
                        readOnly: readOnly,
                        $modalInstance: $modalInstance
                    });
                }

                it('constructor throws if data is missing', function () {
                    expect(function () {
                        createController();
                    }).toThrow();
                });

                it('initializes with existing decision if defined', function () {
                    var date = new Date(),
                        minDate = null,
                        maxDate = null,
                        requireComments = true,
                        showExpirationDate = true,
                        existingDecision = {
                        mitigationExpirationDate: new Date(),
                        comments: 'hello'
                    },
                        ctrl = undefined;

                    ctrl = createController(date, minDate, maxDate, requireComments, showExpirationDate, existingDecision);
                    expect(ctrl.expirationDate).toEqual(existingDecision.mitigationExpirationDate);
                    expect(ctrl.comments).toEqual(existingDecision.comments);
                });

                it('save() calls $modalInstance.close with correct data', function () {
                    var date = new Date(),
                        minDate = null,
                        maxDate = null,
                        requireComments = true,
                        showExpirationDate = true,
                        myComments = 'foo';

                    var ctrl = createController(date, minDate, maxDate, requireComments, showExpirationDate);
                    ctrl.comments = myComments;
                    ctrl.save();
                    expect($modalInstance.close).toHaveBeenCalledWith({
                        comments: myComments,
                        mitigationExpirationDate: date.getTime()
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQWxsb3dFeGNlcHRpb25EaWFsb2dDdHJsVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7Ozs7O0lBS2pHOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSxtQ0FBbUM7WUFDekYsc0JBQXNCLGtDQUFrQzs7UUFFNUQsU0FBUyxZQUFZOztZQUw3QixTQUFTLDRCQUE0QixZQUFXOztnQkFFNUMsSUFBSSxjQUFXO29CQUFFLGlCQUFpQjtvQkFDOUIsT0FBTyxRQUFROzs7Z0JBR25CLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFTLGVBQWU7b0JBQ3RDLGNBQWM7Ozs7Z0JBSWxCLFNBQVMsaUJBQWlCLE1BQU0sU0FBUyxTQUFTLGlCQUFpQixvQkFBb0Isa0JBQWtCLFVBQVU7b0JBQy9HLE9BQU8sWUFBWSw0QkFBNEI7d0JBQzNDLGdCQUFnQjt3QkFDaEIsU0FBUzt3QkFDVCxTQUFTO3dCQUNULGlCQUFpQjt3QkFDakIsb0JBQW9CO3dCQUNwQixrQkFBa0I7d0JBQ2xCLFVBQVU7d0JBQ1YsZ0JBQWdCOzs7O2dCQUl4QixHQUFHLHlDQUF5QyxZQUFXO29CQUNuRCxPQUFPLFlBQVc7d0JBQUU7dUJBQXVCOzs7Z0JBRy9DLEdBQUcsaURBQWlELFlBQU07b0JBQ3RELElBQUksT0FBTyxJQUFJO3dCQUNYLFVBQVU7d0JBQ1YsVUFBVTt3QkFDVixrQkFBa0I7d0JBQ2xCLHFCQUFxQjt3QkFDckIsbUJBQW1CO3dCQUNmLDBCQUEwQixJQUFJO3dCQUM5QixVQUFVOzt3QkFDWCxPQUFJOztvQkFFWCxPQUFPLGlCQUFpQixNQUFNLFNBQVMsU0FBUyxpQkFBaUIsb0JBQW9CO29CQUNyRixPQUFPLEtBQUssZ0JBQWdCLFFBQVEsaUJBQWlCO29CQUNyRCxPQUFPLEtBQUssVUFBVSxRQUFRLGlCQUFpQjs7O2dCQUduRCxHQUFHLHVEQUF1RCxZQUFXO29CQUNqRSxJQUFJLE9BQU8sSUFBSTt3QkFDWCxVQUFVO3dCQUNWLFVBQVU7d0JBQ1Ysa0JBQWtCO3dCQUNsQixxQkFBcUI7d0JBQ3JCLGFBQWE7O29CQUVqQixJQUFJLE9BQU8saUJBQWlCLE1BQU0sU0FBUyxTQUFTLGlCQUFpQjtvQkFDckUsS0FBSyxXQUFXO29CQUNoQixLQUFLO29CQUNMLE9BQU8sZUFBZSxPQUFPLHFCQUFxQjt3QkFDOUMsVUFBVTt3QkFDViwwQkFBMEIsS0FBSzs7Ozs7O0dBaUJ4QyIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL0FsbG93RXhjZXB0aW9uRGlhbG9nQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChjKSBDb3B5cmlnaHQgMjAxNi4gU2FpbFBvaW50IFRlY2hub2xvZ2llcywgSW5jLiwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBjZXJ0aWZpY2F0aW9uTW9kdWxlIGZyb20gJ2NlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvbk1vZHVsZSc7XG5cbmRlc2NyaWJlKCdBbGxvd0V4Y2VwdGlvbkRpYWxvZ0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIGxldCAkY29udHJvbGxlciwgJG1vZGFsSW5zdGFuY2UgPSB7XG4gICAgICAgIGNsb3NlOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgfTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNlcnRpZmljYXRpb25Nb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kY29udHJvbGxlcl8pIHtcbiAgICAgICAgJGNvbnRyb2xsZXIgPSBfJGNvbnRyb2xsZXJfO1xuICAgIH0pKTtcblxuICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDcgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGRhdGUsIG1pbkRhdGUsIG1heERhdGUsIHJlcXVpcmVDb21tZW50cywgc2hvd0V4cGlyYXRpb25EYXRlLCBleGlzdGluZ0RlY2lzaW9uLCByZWFkT25seSkge1xuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ0FsbG93RXhjZXB0aW9uRGlhbG9nQ3RybCcsIHtcbiAgICAgICAgICAgIGV4cGlyYXRpb25EYXRlOiBkYXRlLFxuICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSxcbiAgICAgICAgICAgIG1heERhdGU6IG1heERhdGUsXG4gICAgICAgICAgICByZXF1aXJlQ29tbWVudHM6IHJlcXVpcmVDb21tZW50cyxcbiAgICAgICAgICAgIHNob3dFeHBpcmF0aW9uRGF0ZTogc2hvd0V4cGlyYXRpb25EYXRlLFxuICAgICAgICAgICAgZXhpc3RpbmdEZWNpc2lvbjogZXhpc3RpbmdEZWNpc2lvbixcbiAgICAgICAgICAgIHJlYWRPbmx5OiByZWFkT25seSxcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpdCgnY29uc3RydWN0b3IgdGhyb3dzIGlmIGRhdGEgaXMgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGNyZWF0ZUNvbnRyb2xsZXIoKTsgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2luaXRpYWxpemVzIHdpdGggZXhpc3RpbmcgZGVjaXNpb24gaWYgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbWluRGF0ZSA9IG51bGwsXG4gICAgICAgICAgICBtYXhEYXRlID0gbnVsbCxcbiAgICAgICAgICAgIHJlcXVpcmVDb21tZW50cyA9IHRydWUsXG4gICAgICAgICAgICBzaG93RXhwaXJhdGlvbkRhdGUgPSB0cnVlLFxuICAgICAgICAgICAgZXhpc3RpbmdEZWNpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBtaXRpZ2F0aW9uRXhwaXJhdGlvbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgY29tbWVudHM6ICdoZWxsbydcbiAgICAgICAgICAgIH0sIGN0cmw7XG5cbiAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSwgcmVxdWlyZUNvbW1lbnRzLCBzaG93RXhwaXJhdGlvbkRhdGUsIGV4aXN0aW5nRGVjaXNpb24pO1xuICAgICAgICBleHBlY3QoY3RybC5leHBpcmF0aW9uRGF0ZSkudG9FcXVhbChleGlzdGluZ0RlY2lzaW9uLm1pdGlnYXRpb25FeHBpcmF0aW9uRGF0ZSk7XG4gICAgICAgIGV4cGVjdChjdHJsLmNvbW1lbnRzKS50b0VxdWFsKGV4aXN0aW5nRGVjaXNpb24uY29tbWVudHMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NhdmUoKSBjYWxscyAkbW9kYWxJbnN0YW5jZS5jbG9zZSB3aXRoIGNvcnJlY3QgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtaW5EYXRlID0gbnVsbCxcbiAgICAgICAgICAgIG1heERhdGUgPSBudWxsLFxuICAgICAgICAgICAgcmVxdWlyZUNvbW1lbnRzID0gdHJ1ZSxcbiAgICAgICAgICAgIHNob3dFeHBpcmF0aW9uRGF0ZSA9IHRydWUsXG4gICAgICAgICAgICBteUNvbW1lbnRzID0gJ2Zvbyc7XG5cbiAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGRhdGUsIG1pbkRhdGUsIG1heERhdGUsIHJlcXVpcmVDb21tZW50cywgc2hvd0V4cGlyYXRpb25EYXRlKTtcbiAgICAgICAgY3RybC5jb21tZW50cyA9IG15Q29tbWVudHM7XG4gICAgICAgIGN0cmwuc2F2ZSgpO1xuICAgICAgICBleHBlY3QoJG1vZGFsSW5zdGFuY2UuY2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICAgIGNvbW1lbnRzOiBteUNvbW1lbnRzLFxuICAgICAgICAgICAgbWl0aWdhdGlvbkV4cGlyYXRpb25EYXRlOiBkYXRlLmdldFRpbWUoKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
