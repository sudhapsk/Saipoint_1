System.register(['test/js/TestInitializer', 'common/email/EmailModule', 'angular'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * Tests for EmailDialogCtrl
     */
    'use strict';

    var emailModule, angular;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonEmailEmailModule) {
            emailModule = _commonEmailEmailModule['default'];
        }, function (_angular) {
            angular = _angular['default'];
        }],
        execute: function () {
            describe('EmailDialogCtrlTests', function () {

                var $controller = undefined,
                    $modalInstance = undefined,
                    emailTemplate = undefined;

                beforeEach(module(emailModule));

                beforeEach(inject(function (_$controller_) {
                    $controller = _$controller_;

                    // mock up a modalInstance
                    $modalInstance = {
                        close: jasmine.createSpy()
                    };

                    // mock up an emailTemplate
                    emailTemplate = {
                        id: '1234',
                        to: 'test@example.com',
                        from: 'foo@example.com',
                        subject: 'test',
                        body: 'this is a test.',
                        toIdentity: {
                            id: 'id123',
                            name: 'foozy',
                            displayName: 'foozy booze',
                            email: 'foozy@example.com'
                        }
                    };
                }));

                function createController(template) {
                    return $controller('EmailDialogCtrl', {
                        emailTemplate: template,
                        $modalInstance: $modalInstance
                    });
                }

                describe('constructor', function () {
                    it('throws if data is missing', function () {
                        expect(function () {
                            createController();
                        }).toThrow();
                    });

                    it('does not throw with correct data', function () {
                        expect(function () {
                            createController(emailTemplate);
                        }).not.toThrow();
                    });
                });

                describe('hasEmailAddress', function () {
                    it('returns false when identity has no email address', function () {
                        var tmpTemplate = angular.copy(emailTemplate);
                        delete tmpTemplate.toIdentity.email;
                        var ctrl = createController(tmpTemplate);
                        expect(ctrl.hasEmailAddress()).toBeFalsy();
                    });

                    it('returns true when identity has email address', function () {
                        var ctrl = createController(emailTemplate);
                        expect(ctrl.hasEmailAddress()).toBeTruthy();
                    });
                });

                describe('validate', function () {
                    it('returns true if email, subject, and body are not null', function () {
                        var ctrl = createController(emailTemplate);
                        expect(ctrl.validate()).toBeTruthy();
                    });

                    it('returns false if email is null and subject and body are not null', function () {
                        var tmpTemplate = angular.copy(emailTemplate);
                        delete tmpTemplate.toIdentity.email;
                        var ctrl = createController(tmpTemplate);
                        expect(ctrl.validate()).toBeFalsy();
                    });

                    it('returns false if subject is null and email and body are not null', function () {
                        var tmpTemplate = angular.copy(emailTemplate);
                        tmpTemplate.subject = '';
                        var ctrl = createController(tmpTemplate);
                        expect(ctrl.validate()).toBeFalsy();
                    });

                    it('returns false if body is null and email and subject are not null', function () {
                        var tmpTemplate = angular.copy(emailTemplate);
                        tmpTemplate.body = '';
                        var ctrl = createController(tmpTemplate);
                        expect(ctrl.validate()).toBeFalsy();
                    });
                });

                describe('save', function () {
                    it('should call $modalInstance.close with correct data', function () {
                        var ctrl = createController(emailTemplate);
                        ctrl.save();
                        expect($modalInstance.close).toHaveBeenCalled();
                        expect($modalInstance.close.calls.mostRecent().args[0].to).toBe(emailTemplate.toIdentity.email);
                        expect($modalInstance.close.calls.mostRecent().args[0].from).toBe(emailTemplate.from);
                        expect($modalInstance.close.calls.mostRecent().args[0].subject).toBe(emailTemplate.subject);
                        expect($modalInstance.close.calls.mostRecent().args[0].body).toBe(emailTemplate.body);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9lbWFpbC9FbWFpbERpYWxvZ0N0cmxUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsNEJBQTRCLFlBQVksVUFBVSxTQUFTOzs7Ozs7SUFNbkc7O0lBRUEsSUFBSSxhQUFhO0lBQ2pCLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxjQUFjLHdCQUF3QjtXQUN2QyxVQUFVLFVBQVU7WUFDbkIsVUFBVSxTQUFTOztRQUV2QixTQUFTLFlBQVk7WUFQN0IsU0FBUyx3QkFBd0IsWUFBTTs7Z0JBRW5DLElBQUksY0FBVztvQkFBRSxpQkFBYztvQkFBRSxnQkFBYTs7Z0JBRTlDLFdBQVcsT0FBTzs7Z0JBRWxCLFdBQVcsT0FBTyxVQUFDLGVBQWtCO29CQUNqQyxjQUFjOzs7b0JBR2QsaUJBQWlCO3dCQUNiLE9BQU8sUUFBUTs7OztvQkFJbkIsZ0JBQWdCO3dCQUNaLElBQUk7d0JBQ0osSUFBSTt3QkFDSixNQUFNO3dCQUNOLFNBQVM7d0JBQ1QsTUFBTTt3QkFDTixZQUFZOzRCQUNSLElBQUk7NEJBQ0osTUFBTTs0QkFDTixhQUFhOzRCQUNiLE9BQU87Ozs7O2dCQUtuQixTQUFTLGlCQUFpQixVQUFVO29CQUNoQyxPQUFPLFlBQVksbUJBQW1CO3dCQUNsQyxlQUFlO3dCQUNmLGdCQUFnQjs7OztnQkFJeEIsU0FBUyxlQUFlLFlBQVc7b0JBQy9CLEdBQUcsNkJBQTZCLFlBQVc7d0JBQ3ZDLE9BQU8sWUFBVzs0QkFDZDsyQkFDRDs7O29CQUdQLEdBQUcsb0NBQW9DLFlBQU07d0JBQ3pDLE9BQU8sWUFBVzs0QkFDZCxpQkFBaUI7MkJBQ2xCLElBQUk7Ozs7Z0JBSWYsU0FBUyxtQkFBbUIsWUFBTTtvQkFDOUIsR0FBRyxvREFBb0QsWUFBTTt3QkFDekQsSUFBSSxjQUFjLFFBQVEsS0FBSzt3QkFDL0IsT0FBTyxZQUFZLFdBQVc7d0JBQzlCLElBQUksT0FBTyxpQkFBaUI7d0JBQzVCLE9BQU8sS0FBSyxtQkFBbUI7OztvQkFHbkMsR0FBRyxnREFBZ0QsWUFBTTt3QkFDckQsSUFBSSxPQUFPLGlCQUFpQjt3QkFDNUIsT0FBTyxLQUFLLG1CQUFtQjs7OztnQkFJdkMsU0FBUyxZQUFZLFlBQU07b0JBQ3ZCLEdBQUcseURBQXlELFlBQU07d0JBQzlELElBQUksT0FBTyxpQkFBaUI7d0JBQzVCLE9BQU8sS0FBSyxZQUFZOzs7b0JBRzVCLEdBQUcsb0VBQW9FLFlBQU07d0JBQ3pFLElBQUksY0FBYyxRQUFRLEtBQUs7d0JBQy9CLE9BQU8sWUFBWSxXQUFXO3dCQUM5QixJQUFJLE9BQU8saUJBQWlCO3dCQUM1QixPQUFPLEtBQUssWUFBWTs7O29CQUc1QixHQUFHLG9FQUFvRSxZQUFNO3dCQUN6RSxJQUFJLGNBQWMsUUFBUSxLQUFLO3dCQUMvQixZQUFZLFVBQVU7d0JBQ3RCLElBQUksT0FBTyxpQkFBaUI7d0JBQzVCLE9BQU8sS0FBSyxZQUFZOzs7b0JBRzVCLEdBQUcsb0VBQW9FLFlBQU07d0JBQ3pFLElBQUksY0FBYyxRQUFRLEtBQUs7d0JBQy9CLFlBQVksT0FBTzt3QkFDbkIsSUFBSSxPQUFPLGlCQUFpQjt3QkFDNUIsT0FBTyxLQUFLLFlBQVk7Ozs7Z0JBSWhDLFNBQVMsUUFBUSxZQUFNO29CQUNuQixHQUFHLHNEQUFzRCxZQUFNO3dCQUMzRCxJQUFJLE9BQU8saUJBQWlCO3dCQUM1QixLQUFLO3dCQUNMLE9BQU8sZUFBZSxPQUFPO3dCQUM3QixPQUFPLGVBQWUsTUFBTSxNQUFNLGFBQWEsS0FBSyxHQUFHLElBQUksS0FBSyxjQUFjLFdBQVc7d0JBQ3pGLE9BQU8sZUFBZSxNQUFNLE1BQU0sYUFBYSxLQUFLLEdBQUcsTUFBTSxLQUFLLGNBQWM7d0JBQ2hGLE9BQU8sZUFBZSxNQUFNLE1BQU0sYUFBYSxLQUFLLEdBQUcsU0FBUyxLQUFLLGNBQWM7d0JBQ25GLE9BQU8sZUFBZSxNQUFNLE1BQU0sYUFBYSxLQUFLLEdBQUcsTUFBTSxLQUFLLGNBQWM7Ozs7OztHQWdCekYiLCJmaWxlIjoiY29tbW9uL2VtYWlsL0VtYWlsRGlhbG9nQ3RybFRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBlbWFpbE1vZHVsZSBmcm9tICdjb21tb24vZW1haWwvRW1haWxNb2R1bGUnO1xuaW1wb3J0IGFuZ3VsYXIgZnJvbSAnYW5ndWxhcic7XG5cbi8qKlxuICogVGVzdHMgZm9yIEVtYWlsRGlhbG9nQ3RybFxuICovXG5kZXNjcmliZSgnRW1haWxEaWFsb2dDdHJsVGVzdHMnLCAoKSA9PiB7XG5cbiAgICBsZXQgJGNvbnRyb2xsZXIsICRtb2RhbEluc3RhbmNlLCBlbWFpbFRlbXBsYXRlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZW1haWxNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KChfJGNvbnRyb2xsZXJfKSA9PiB7XG4gICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcblxuICAgICAgICAvLyBtb2NrIHVwIGEgbW9kYWxJbnN0YW5jZVxuICAgICAgICAkbW9kYWxJbnN0YW5jZSA9IHtcbiAgICAgICAgICAgIGNsb3NlOiBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbW9jayB1cCBhbiBlbWFpbFRlbXBsYXRlXG4gICAgICAgIGVtYWlsVGVtcGxhdGUgPSB7XG4gICAgICAgICAgICBpZDogJzEyMzQnLFxuICAgICAgICAgICAgdG86ICd0ZXN0QGV4YW1wbGUuY29tJyxcbiAgICAgICAgICAgIGZyb206ICdmb29AZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgc3ViamVjdDogJ3Rlc3QnLFxuICAgICAgICAgICAgYm9keTogJ3RoaXMgaXMgYSB0ZXN0LicsXG4gICAgICAgICAgICB0b0lkZW50aXR5OiB7XG4gICAgICAgICAgICAgICAgaWQ6ICdpZDEyMycsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Zvb3p5JyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ2Zvb3p5IGJvb3plJyxcbiAgICAgICAgICAgICAgICBlbWFpbDogJ2Zvb3p5QGV4YW1wbGUuY29tJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIodGVtcGxhdGUpIHtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdFbWFpbERpYWxvZ0N0cmwnLCB7XG4gICAgICAgICAgICBlbWFpbFRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlOiAkbW9kYWxJbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnY29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Rocm93cyBpZiBkYXRhIGlzIG1pc3NpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdCB0aHJvdyB3aXRoIGNvcnJlY3QgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDb250cm9sbGVyKGVtYWlsVGVtcGxhdGUpO1xuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnaGFzRW1haWxBZGRyZXNzJywgKCkgPT4ge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIGlkZW50aXR5IGhhcyBubyBlbWFpbCBhZGRyZXNzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRtcFRlbXBsYXRlID0gYW5ndWxhci5jb3B5KGVtYWlsVGVtcGxhdGUpO1xuICAgICAgICAgICAgZGVsZXRlIHRtcFRlbXBsYXRlLnRvSWRlbnRpdHkuZW1haWw7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIodG1wVGVtcGxhdGUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwuaGFzRW1haWxBZGRyZXNzKCkpLnRvQmVGYWxzeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIHdoZW4gaWRlbnRpdHkgaGFzIGVtYWlsIGFkZHJlc3MnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoZW1haWxUZW1wbGF0ZSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC5oYXNFbWFpbEFkZHJlc3MoKSkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd2YWxpZGF0ZScsICgpID0+IHtcbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBlbWFpbCwgc3ViamVjdCwgYW5kIGJvZHkgYXJlIG5vdCBudWxsJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKGVtYWlsVGVtcGxhdGUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwudmFsaWRhdGUoKSkudG9CZVRydXRoeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBlbWFpbCBpcyBudWxsIGFuZCBzdWJqZWN0IGFuZCBib2R5IGFyZSBub3QgbnVsbCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0bXBUZW1wbGF0ZSA9IGFuZ3VsYXIuY29weShlbWFpbFRlbXBsYXRlKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0bXBUZW1wbGF0ZS50b0lkZW50aXR5LmVtYWlsO1xuICAgICAgICAgICAgbGV0IGN0cmwgPSBjcmVhdGVDb250cm9sbGVyKHRtcFRlbXBsYXRlKTtcbiAgICAgICAgICAgIGV4cGVjdChjdHJsLnZhbGlkYXRlKCkpLnRvQmVGYWxzeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBpZiBzdWJqZWN0IGlzIG51bGwgYW5kIGVtYWlsIGFuZCBib2R5IGFyZSBub3QgbnVsbCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0bXBUZW1wbGF0ZSA9IGFuZ3VsYXIuY29weShlbWFpbFRlbXBsYXRlKTtcbiAgICAgICAgICAgIHRtcFRlbXBsYXRlLnN1YmplY3QgPSAnJztcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcih0bXBUZW1wbGF0ZSk7XG4gICAgICAgICAgICBleHBlY3QoY3RybC52YWxpZGF0ZSgpKS50b0JlRmFsc3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgYm9keSBpcyBudWxsIGFuZCBlbWFpbCBhbmQgc3ViamVjdCBhcmUgbm90IG51bGwnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdG1wVGVtcGxhdGUgPSBhbmd1bGFyLmNvcHkoZW1haWxUZW1wbGF0ZSk7XG4gICAgICAgICAgICB0bXBUZW1wbGF0ZS5ib2R5ID0gJyc7XG4gICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIodG1wVGVtcGxhdGUpO1xuICAgICAgICAgICAgZXhwZWN0KGN0cmwudmFsaWRhdGUoKSkudG9CZUZhbHN5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NhdmUnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCAkbW9kYWxJbnN0YW5jZS5jbG9zZSB3aXRoIGNvcnJlY3QgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcihlbWFpbFRlbXBsYXRlKTtcbiAgICAgICAgICAgIGN0cmwuc2F2ZSgpO1xuICAgICAgICAgICAgZXhwZWN0KCRtb2RhbEluc3RhbmNlLmNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoJG1vZGFsSW5zdGFuY2UuY2xvc2UuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0udG8pLnRvQmUoZW1haWxUZW1wbGF0ZS50b0lkZW50aXR5LmVtYWlsKTtcbiAgICAgICAgICAgIGV4cGVjdCgkbW9kYWxJbnN0YW5jZS5jbG9zZS5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXS5mcm9tKS50b0JlKGVtYWlsVGVtcGxhdGUuZnJvbSk7XG4gICAgICAgICAgICBleHBlY3QoJG1vZGFsSW5zdGFuY2UuY2xvc2UuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0uc3ViamVjdCkudG9CZShlbWFpbFRlbXBsYXRlLnN1YmplY3QpO1xuICAgICAgICAgICAgZXhwZWN0KCRtb2RhbEluc3RhbmNlLmNsb3NlLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdLmJvZHkpLnRvQmUoZW1haWxUZW1wbGF0ZS5ib2R5KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
