System.register(['test/js/TestInitializer', 'approval/ApprovalModule', 'test/js/TestModule'], function (_export) {
    'use strict';

    var approvalModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('ApprovalCompletionService', function () {

                var $rootScope, spModal, testService, approvalService, approvalCompletionService, $q, scope, workItem, approval, decide, revert, callback, ApprovalResult, $httpBackend;

                // Load the test module to get the testService.
                beforeEach(module(testModule));

                // Let the tests know we'll use the approval module.
                beforeEach(module(approvalModule));

                /**
                 * Setup the mocks for our tests.
                 */
                /* jshint maxparams: 8 */
                beforeEach(inject(function (_$rootScope_, _spModal_, _testService_, _approvalCompletionService_, _ApprovalResult_, _$q_, _$httpBackend_, _approvalService_) {

                    // Save the services.
                    $rootScope = _$rootScope_;
                    spModal = _spModal_;
                    $httpBackend = _$httpBackend_;
                    testService = _testService_;
                    approvalCompletionService = _approvalCompletionService_;
                    ApprovalResult = _ApprovalResult_;
                    approvalService = _approvalService_;
                    $q = _$q_;

                    // Mock out the modal.open() function.
                    makeModalSucceed(true);

                    // Mock out the objects we pass to the service.
                    scope = {};
                    workItem = {
                        id: '1234',
                        esigMeaning: 'To approve or not to approve ... that is the question.' };
                    approval = {
                        id: '1234'
                    };
                    decide = jasmine.createSpy();
                    revert = jasmine.createSpy();
                    callback = jasmine.createSpy();
                }));

                /**
                 * Make the modal instance that is returned from spModal.open() resolve or
                 * reject based on the value of succeed.
                 */
                var makeModalSucceed = function (succeed, errorCode) {
                    if (!spModal) {
                        throw 'expected modal to exist.';
                    }

                    if (!succeed && errorCode) {
                        testService.errorResponse.status = errorCode;
                    }

                    spModal.open = jasmine.createSpy().and.callFake(function () {
                        // Open returns an object with a promise for the result property.
                        return {
                            result: testService.createResponsePromise(!succeed)
                        };
                    });
                };

                /**
                 * Verify that the completion dialog was opened with the appropriate settings.
                 */
                var checkCompletionDialog = function (esig) {
                    var templateUrl, args, resolve, controller;

                    expect(spModal.open).toHaveBeenCalled();

                    args = spModal.open.calls.mostRecent().args[0];
                    resolve = args.resolve;

                    controller = 'CompletionDialogCtrl';
                    templateUrl = 'approval/template/completion-dialog.html';
                    if (esig) {
                        templateUrl = 'common/esig/template/esig-dialog.html';
                        controller = 'ElectronicSignatureDialogCtrl';
                        expect(args.controller).toEqual(controller);
                        expect(resolve.esigMeaning()).toEqual(workItem.esigMeaning);
                    }

                    expect(args.templateUrl).toEqual(templateUrl);
                    expect(args.forceAction).toEqual(true);
                };

                it('opens the completion dialog', function () {
                    approvalCompletionService.openCompletionDialog(scope, approval, revert, decide, callback);
                    checkCompletionDialog();
                });

                it('opens the esig dialog for an esig', function () {
                    // Give the approval an esig meaning so we treat it as an esig.
                    workItem.esigMeaning = 'To approve or not to approve ... that is the question.';
                    approvalCompletionService.openCompletionDialog(scope, workItem, revert, decide, callback);
                    checkCompletionDialog(true);
                });

                it('calls callback when completed', function () {
                    var result;

                    // Make the modal resolve with a result.
                    spModal.open = jasmine.createSpy().and.callFake(function () {
                        return {
                            result: $q.when(new ApprovalResult({}, approval.id))
                        };
                    });
                    spyOn(approvalService, 'complete').and.returnValue(new ApprovalResult({}, approval.id));
                    approvalCompletionService.openCompletionDialog(scope, approval, revert, decide, callback);

                    $rootScope.$apply();
                    expect(approvalService.complete).toHaveBeenCalled();

                    result = callback.calls.mostRecent().args[0];
                    expect(result instanceof ApprovalResult).toBeTruthy();
                    expect(result.workItemId).toEqual(approval.id);
                    expect(result.isDialog).toEqual(true);
                });

                it('does not call callback when dialog is canceled', function () {
                    makeModalSucceed(false);
                    approvalCompletionService.openCompletionDialog(scope, approval, revert, decide);
                    $rootScope.$apply();
                    expect(callback).not.toHaveBeenCalled();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0FwcHJvdmFsQ29tcGxldGlvblNlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsMkJBQTJCLHVCQUF1QixVQUFVLFNBQVM7SUFDN0c7O0lBRUEsSUFBSSxnQkFBZ0I7SUFDcEIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUseUJBQXlCO1lBQy9FLGlCQUFpQix3QkFBd0I7V0FDMUMsVUFBVSxtQkFBbUI7WUFDNUIsYUFBYSxrQkFBa0I7O1FBRW5DLFNBQVMsWUFBWTs7WUFON0IsU0FBUyw2QkFBNkIsWUFBVzs7Z0JBRTdDLElBQUksWUFBWSxTQUFTLGFBQWEsaUJBQWlCLDJCQUEyQixJQUM5RSxPQUFPLFVBQVUsVUFBVSxRQUFRLFFBQVEsVUFBVSxnQkFBZ0I7OztnQkFHekUsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTzs7Ozs7O2dCQU1sQixXQUFXLE9BQU8sVUFBUyxjQUFjLFdBQVcsZUFBZSw2QkFDeEMsa0JBQWtCLE1BQU0sZ0JBQWdCLG1CQUFtQjs7O29CQUdsRixhQUFhO29CQUNiLFVBQVU7b0JBQ1YsZUFBZTtvQkFDZixjQUFjO29CQUNkLDRCQUE0QjtvQkFDNUIsaUJBQWlCO29CQUNqQixrQkFBa0I7b0JBQ2xCLEtBQUs7OztvQkFHTCxpQkFBaUI7OztvQkFHakIsUUFBUTtvQkFDUixXQUFXO3dCQUNQLElBQUk7d0JBQ0osYUFBYTtvQkFDakIsV0FBVzt3QkFDUCxJQUFJOztvQkFFUixTQUFTLFFBQVE7b0JBQ2pCLFNBQVMsUUFBUTtvQkFDakIsV0FBVyxRQUFROzs7Ozs7O2dCQU92QixJQUFJLG1CQUFtQixVQUFTLFNBQVMsV0FBVztvQkFDaEQsSUFBSSxDQUFDLFNBQVM7d0JBQ1YsTUFBTTs7O29CQUdWLElBQUksQ0FBQyxXQUFXLFdBQVc7d0JBQ3ZCLFlBQVksY0FBYyxTQUFTOzs7b0JBR3ZDLFFBQVEsT0FBTyxRQUFRLFlBQVksSUFBSSxTQUFTLFlBQVc7O3dCQUV2RCxPQUFPOzRCQUNILFFBQVEsWUFBWSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7Z0JBUXZELElBQUksd0JBQXdCLFVBQVMsTUFBTTtvQkFDdkMsSUFBSSxhQUFhLE1BQU0sU0FBUzs7b0JBRWhDLE9BQU8sUUFBUSxNQUFNOztvQkFFckIsT0FBTyxRQUFRLEtBQUssTUFBTSxhQUFhLEtBQUs7b0JBQzVDLFVBQVUsS0FBSzs7b0JBRWYsYUFBYTtvQkFDYixjQUFjO29CQUNkLElBQUksTUFBTTt3QkFDTixjQUFjO3dCQUNkLGFBQWE7d0JBQ2IsT0FBTyxLQUFLLFlBQVksUUFBUTt3QkFDaEMsT0FBTyxRQUFRLGVBQWUsUUFBUSxTQUFTOzs7b0JBR25ELE9BQU8sS0FBSyxhQUFhLFFBQVE7b0JBQ2pDLE9BQU8sS0FBSyxhQUFhLFFBQVE7OztnQkFHckMsR0FBRywrQkFBK0IsWUFBVztvQkFDekMsMEJBQTBCLHFCQUFxQixPQUFPLFVBQVUsUUFBUSxRQUFRO29CQUNoRjs7O2dCQUdKLEdBQUcscUNBQXFDLFlBQVc7O29CQUUvQyxTQUFTLGNBQWM7b0JBQ3ZCLDBCQUEwQixxQkFBcUIsT0FBTyxVQUFVLFFBQVEsUUFBUTtvQkFDaEYsc0JBQXNCOzs7Z0JBRzFCLEdBQUcsaUNBQWlDLFlBQVc7b0JBQzNDLElBQUk7OztvQkFHSixRQUFRLE9BQU8sUUFBUSxZQUFZLElBQUksU0FBUyxZQUFXO3dCQUN2RCxPQUFPOzRCQUNILFFBQVEsR0FBRyxLQUFLLElBQUksZUFBZSxJQUFJLFNBQVM7OztvQkFHeEQsTUFBTSxpQkFBaUIsWUFBWSxJQUFJLFlBQVksSUFBSSxlQUFlLElBQUksU0FBUztvQkFDbkYsMEJBQTBCLHFCQUFxQixPQUFPLFVBQVUsUUFBUSxRQUFROztvQkFFaEYsV0FBVztvQkFDWCxPQUFPLGdCQUFnQixVQUFVOztvQkFFakMsU0FBUyxTQUFTLE1BQU0sYUFBYSxLQUFLO29CQUMxQyxPQUFPLGtCQUFrQixnQkFBZ0I7b0JBQ3pDLE9BQU8sT0FBTyxZQUFZLFFBQVEsU0FBUztvQkFDM0MsT0FBTyxPQUFPLFVBQVUsUUFBUTs7O2dCQUdwQyxHQUFHLGtEQUFrRCxZQUFXO29CQUM1RCxpQkFBaUI7b0JBQ2pCLDBCQUEwQixxQkFBcUIsT0FBTyxVQUFVLFFBQVE7b0JBQ3hFLFdBQVc7b0JBQ1gsT0FBTyxVQUFVLElBQUk7Ozs7O0dBVzFCIiwiZmlsZSI6ImFwcHJvdmFsL0FwcHJvdmFsQ29tcGxldGlvblNlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgYXBwcm92YWxNb2R1bGUgZnJvbSAnYXBwcm92YWwvQXBwcm92YWxNb2R1bGUnO1xyXG5pbXBvcnQgdGVzdE1vZHVsZSBmcm9tICd0ZXN0L2pzL1Rlc3RNb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0FwcHJvdmFsQ29tcGxldGlvblNlcnZpY2UnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgJHJvb3RTY29wZSwgc3BNb2RhbCwgdGVzdFNlcnZpY2UsIGFwcHJvdmFsU2VydmljZSwgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZSwgJHEsXHJcbiAgICAgICAgc2NvcGUsIHdvcmtJdGVtLCBhcHByb3ZhbCwgZGVjaWRlLCByZXZlcnQsIGNhbGxiYWNrLCBBcHByb3ZhbFJlc3VsdCwgJGh0dHBCYWNrZW5kO1xyXG5cclxuICAgIC8vIExvYWQgdGhlIHRlc3QgbW9kdWxlIHRvIGdldCB0aGUgdGVzdFNlcnZpY2UuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh0ZXN0TW9kdWxlKSk7XHJcblxyXG4gICAgLy8gTGV0IHRoZSB0ZXN0cyBrbm93IHdlJ2xsIHVzZSB0aGUgYXBwcm92YWwgbW9kdWxlLlxyXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoYXBwcm92YWxNb2R1bGUpKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHVwIHRoZSBtb2NrcyBmb3Igb3VyIHRlc3RzLlxyXG4gICAgICovXHJcbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiA4ICovXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfJHJvb3RTY29wZV8sIF9zcE1vZGFsXywgX3Rlc3RTZXJ2aWNlXywgX2FwcHJvdmFsQ29tcGxldGlvblNlcnZpY2VfLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0FwcHJvdmFsUmVzdWx0XywgXyRxXywgXyRodHRwQmFja2VuZF8sIF9hcHByb3ZhbFNlcnZpY2VfKSB7XHJcblxyXG4gICAgICAgIC8vIFNhdmUgdGhlIHNlcnZpY2VzLlxyXG4gICAgICAgICRyb290U2NvcGUgPSBfJHJvb3RTY29wZV87XHJcbiAgICAgICAgc3BNb2RhbCA9IF9zcE1vZGFsXztcclxuICAgICAgICAkaHR0cEJhY2tlbmQgPSBfJGh0dHBCYWNrZW5kXztcclxuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XHJcbiAgICAgICAgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZSA9IF9hcHByb3ZhbENvbXBsZXRpb25TZXJ2aWNlXztcclxuICAgICAgICBBcHByb3ZhbFJlc3VsdCA9IF9BcHByb3ZhbFJlc3VsdF87XHJcbiAgICAgICAgYXBwcm92YWxTZXJ2aWNlID0gX2FwcHJvdmFsU2VydmljZV87XHJcbiAgICAgICAgJHEgPSBfJHFfO1xyXG5cclxuICAgICAgICAvLyBNb2NrIG91dCB0aGUgbW9kYWwub3BlbigpIGZ1bmN0aW9uLlxyXG4gICAgICAgIG1ha2VNb2RhbFN1Y2NlZWQodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIE1vY2sgb3V0IHRoZSBvYmplY3RzIHdlIHBhc3MgdG8gdGhlIHNlcnZpY2UuXHJcbiAgICAgICAgc2NvcGUgPSB7fTtcclxuICAgICAgICB3b3JrSXRlbSA9IHtcclxuICAgICAgICAgICAgaWQ6ICcxMjM0JyxcclxuICAgICAgICAgICAgZXNpZ01lYW5pbmc6ICdUbyBhcHByb3ZlIG9yIG5vdCB0byBhcHByb3ZlIC4uLiB0aGF0IGlzIHRoZSBxdWVzdGlvbi4nfTtcclxuICAgICAgICBhcHByb3ZhbCA9IHtcclxuICAgICAgICAgICAgaWQ6ICcxMjM0J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGVjaWRlID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICByZXZlcnQgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgdGhlIG1vZGFsIGluc3RhbmNlIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBzcE1vZGFsLm9wZW4oKSByZXNvbHZlIG9yXHJcbiAgICAgKiByZWplY3QgYmFzZWQgb24gdGhlIHZhbHVlIG9mIHN1Y2NlZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBtYWtlTW9kYWxTdWNjZWVkID0gZnVuY3Rpb24oc3VjY2VlZCwgZXJyb3JDb2RlKSB7XHJcbiAgICAgICAgaWYgKCFzcE1vZGFsKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdleHBlY3RlZCBtb2RhbCB0byBleGlzdC4nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdWNjZWVkICYmIGVycm9yQ29kZSkge1xyXG4gICAgICAgICAgICB0ZXN0U2VydmljZS5lcnJvclJlc3BvbnNlLnN0YXR1cyA9IGVycm9yQ29kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNwTW9kYWwub3BlbiA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBPcGVuIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBwcm9taXNlIGZvciB0aGUgcmVzdWx0IHByb3BlcnR5LlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiB0ZXN0U2VydmljZS5jcmVhdGVSZXNwb25zZVByb21pc2UoIXN1Y2NlZWQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmVyaWZ5IHRoYXQgdGhlIGNvbXBsZXRpb24gZGlhbG9nIHdhcyBvcGVuZWQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgc2V0dGluZ3MuXHJcbiAgICAgKi9cclxuICAgIHZhciBjaGVja0NvbXBsZXRpb25EaWFsb2cgPSBmdW5jdGlvbihlc2lnKSB7XHJcbiAgICAgICAgdmFyIHRlbXBsYXRlVXJsLCBhcmdzLCByZXNvbHZlLCBjb250cm9sbGVyO1xyXG5cclxuICAgICAgICBleHBlY3Qoc3BNb2RhbC5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIGFyZ3MgPSBzcE1vZGFsLm9wZW4uY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF07XHJcbiAgICAgICAgcmVzb2x2ZSA9IGFyZ3MucmVzb2x2ZTtcclxuXHJcbiAgICAgICAgY29udHJvbGxlciA9ICdDb21wbGV0aW9uRGlhbG9nQ3RybCc7XHJcbiAgICAgICAgdGVtcGxhdGVVcmwgPSAnYXBwcm92YWwvdGVtcGxhdGUvY29tcGxldGlvbi1kaWFsb2cuaHRtbCc7XHJcbiAgICAgICAgaWYgKGVzaWcpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSAnY29tbW9uL2VzaWcvdGVtcGxhdGUvZXNpZy1kaWFsb2cuaHRtbCc7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgPSAnRWxlY3Ryb25pY1NpZ25hdHVyZURpYWxvZ0N0cmwnO1xyXG4gICAgICAgICAgICBleHBlY3QoYXJncy5jb250cm9sbGVyKS50b0VxdWFsKGNvbnRyb2xsZXIpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzb2x2ZS5lc2lnTWVhbmluZygpKS50b0VxdWFsKHdvcmtJdGVtLmVzaWdNZWFuaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cGVjdChhcmdzLnRlbXBsYXRlVXJsKS50b0VxdWFsKHRlbXBsYXRlVXJsKTtcclxuICAgICAgICBleHBlY3QoYXJncy5mb3JjZUFjdGlvbikudG9FcXVhbCh0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgaXQoJ29wZW5zIHRoZSBjb21wbGV0aW9uIGRpYWxvZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFwcHJvdmFsQ29tcGxldGlvblNlcnZpY2Uub3BlbkNvbXBsZXRpb25EaWFsb2coc2NvcGUsIGFwcHJvdmFsLCByZXZlcnQsIGRlY2lkZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIGNoZWNrQ29tcGxldGlvbkRpYWxvZygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ29wZW5zIHRoZSBlc2lnIGRpYWxvZyBmb3IgYW4gZXNpZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIEdpdmUgdGhlIGFwcHJvdmFsIGFuIGVzaWcgbWVhbmluZyBzbyB3ZSB0cmVhdCBpdCBhcyBhbiBlc2lnLlxyXG4gICAgICAgIHdvcmtJdGVtLmVzaWdNZWFuaW5nID0gJ1RvIGFwcHJvdmUgb3Igbm90IHRvIGFwcHJvdmUgLi4uIHRoYXQgaXMgdGhlIHF1ZXN0aW9uLic7XHJcbiAgICAgICAgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZS5vcGVuQ29tcGxldGlvbkRpYWxvZyhzY29wZSwgd29ya0l0ZW0sIHJldmVydCwgZGVjaWRlLCBjYWxsYmFjayk7XHJcbiAgICAgICAgY2hlY2tDb21wbGV0aW9uRGlhbG9nKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2NhbGxzIGNhbGxiYWNrIHdoZW4gY29tcGxldGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICAgICAgLy8gTWFrZSB0aGUgbW9kYWwgcmVzb2x2ZSB3aXRoIGEgcmVzdWx0LlxyXG4gICAgICAgIHNwTW9kYWwub3BlbiA9IGphc21pbmUuY3JlYXRlU3B5KCkuYW5kLmNhbGxGYWtlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiAkcS53aGVuKG5ldyBBcHByb3ZhbFJlc3VsdCh7fSwgYXBwcm92YWwuaWQpKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNweU9uKGFwcHJvdmFsU2VydmljZSwgJ2NvbXBsZXRlJykuYW5kLnJldHVyblZhbHVlKG5ldyBBcHByb3ZhbFJlc3VsdCh7fSwgYXBwcm92YWwuaWQpKTtcclxuICAgICAgICBhcHByb3ZhbENvbXBsZXRpb25TZXJ2aWNlLm9wZW5Db21wbGV0aW9uRGlhbG9nKHNjb3BlLCBhcHByb3ZhbCwgcmV2ZXJ0LCBkZWNpZGUsIGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoYXBwcm92YWxTZXJ2aWNlLmNvbXBsZXRlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcblxyXG4gICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdO1xyXG4gICAgICAgIGV4cGVjdChyZXN1bHQgaW5zdGFuY2VvZiBBcHByb3ZhbFJlc3VsdCkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIGV4cGVjdChyZXN1bHQud29ya0l0ZW1JZCkudG9FcXVhbChhcHByb3ZhbC5pZCk7XHJcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5pc0RpYWxvZykudG9FcXVhbCh0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdkb2VzIG5vdCBjYWxsIGNhbGxiYWNrIHdoZW4gZGlhbG9nIGlzIGNhbmNlbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbWFrZU1vZGFsU3VjY2VlZChmYWxzZSk7XHJcbiAgICAgICAgYXBwcm92YWxDb21wbGV0aW9uU2VydmljZS5vcGVuQ29tcGxldGlvbkRpYWxvZyhzY29wZSwgYXBwcm92YWwsIHJldmVydCwgZGVjaWRlKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChjYWxsYmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG5cclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
