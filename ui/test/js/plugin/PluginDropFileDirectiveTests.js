System.register(['test/js/TestInitializer', 'plugin/PluginModule.js', 'test/js/TestModule'], function (_export) {
    'use strict';

    var pluginModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_pluginPluginModuleJs) {
            pluginModule = _pluginPluginModuleJs['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('PluginDropFileDirective', function () {

                var elementDefinition = '<div sp-plugin-drop-file></div>',
                    $scope = undefined,
                    $q = undefined,
                    $compile = undefined,
                    $timeout = undefined,
                    element = undefined,
                    testService = undefined,
                    changeEvent = undefined,
                    dropEvent = undefined,
                    fakeJpgFile = undefined,
                    fakeZipFile = undefined,
                    pluginService = undefined,
                    $window = undefined;

                function createElement() {
                    var defintion = arguments.length <= 0 || arguments[0] === undefined ? elementDefinition : arguments[0];

                    var element = angular.element(defintion);
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                beforeEach(module(testModule, pluginModule));

                beforeEach(module(function ($provide) {
                    $window = { location: { reload: angular.noop } };
                    $provide.value('$window', $window);
                }));

                beforeEach(inject(function (_$rootScope_, _$compile_, _$q_, _$timeout_, _pluginService_, _testService_) {
                    $scope = _$rootScope_;
                    $q = _$q_;
                    $compile = _$compile_;
                    $timeout = _$timeout_;
                    testService = _testService_;
                    pluginService = _pluginService_;

                    fakeZipFile = {
                        name: 'fakeZipFile.zip',
                        type: 'application/zip'
                    };

                    fakeJpgFile = {
                        name: 'fakeFile.jpg',
                        type: 'image/jpg'
                    };
                    dropEvent = {
                        type: 'drop',
                        originalEvent: {
                            dataTransfer: {
                                files: [fakeZipFile]
                            }
                        }
                    };
                    changeEvent = {
                        type: 'change',
                        target: {
                            files: [fakeZipFile]
                        }
                    };

                    pluginService.installPlugin = testService.createPromiseSpy(false, {});
                }));

                it('is created', function () {
                    element = createElement();
                    expect(element).not.toBeNull();
                    expect(element.find('.fa-upload').length).toEqual(1);
                    expect(element.find('.box-dragndrop span').hasClass('text-info')).toEqual(true);
                });

                it('changes initial state with change event', function () {
                    element = createElement();
                    element.triggerHandler(changeEvent);
                    expect(element.find('.box-dragndrop span').hasClass('text-success')).toEqual(true);
                });

                it('changes initial state with drop event', function () {
                    element = createElement();
                    element.triggerHandler(dropEvent);
                    expect(element.find('.box-dragndrop span').hasClass('text-success')).toEqual(true);
                });

                describe('PluginDropFileDirectiveCtrl', function () {
                    var $controller = undefined,
                        spTranslateFilter = undefined;

                    beforeEach(inject(function (_$controller_, _$q_, _pluginService_, _spTranslateFilter_) {
                        pluginService = _pluginService_;
                        $controller = _$controller_;
                        $q = _$q_;
                        spTranslateFilter = _spTranslateFilter_;
                    }));

                    function createController() {

                        return $controller('PluginDropFileDirectiveCtrl', {
                            pluginService: pluginService,
                            spTranslateFilter: spTranslateFilter,
                            $q: $q
                        });
                    }

                    describe('file drop', function () {
                        it('should be in the success state', function () {
                            var ctrl = undefined;
                            ctrl = createController();
                            expect(ctrl).not.toBeNull();
                            ctrl.fileSubmitted([fakeZipFile]);
                            $scope.$digest();
                            expect(ctrl.isInitial()).toBe(false);
                            expect(ctrl.isSuccess()).toBe(true);
                        });

                        it('should be in an error state', function () {
                            var ctrl = undefined;
                            ctrl = createController();
                            expect(ctrl).not.toBeNull();
                            ctrl.fileSubmitted([fakeJpgFile]);
                            expect(ctrl.isInitial()).toBe(false);
                            expect(ctrl.isError()).toBe(true);
                        });

                        it('should be in an error state after submitting multiple files', function () {
                            var ctrl = undefined;
                            ctrl = createController();
                            expect(ctrl).not.toBeNull();
                            ctrl.fileSubmitted([fakeZipFile, fakeZipFile]);
                            expect(ctrl.isInitial()).toBe(false);
                            expect(ctrl.isError()).toBe(true);
                        });
                    });

                    describe('submit file', function () {

                        it('should reload the page upon success', function () {
                            var ctrl = createController();

                            spyOn($window.location, 'reload').and.callThrough();

                            ctrl.fileSubmitted([fakeZipFile]);
                            $scope.$digest();
                            expect($window.location.reload).toHaveBeenCalled();
                        });

                        it('should set the message upon error', function () {
                            var ctrl = createController(),
                                error = { message: 'an error occurred' };

                            pluginService.installPlugin = testService.createPromiseSpy(true, null, error);
                            spyOn($window.location, 'reload').and.callThrough();

                            ctrl.fileSubmitted([fakeZipFile]);
                            $scope.$digest();

                            expect(ctrl.statusMessage).toEqual(error.message);
                            expect($window.location.reload).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbi9QbHVnaW5Ecm9wRmlsZURpcmVjdGl2ZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwwQkFBMEIsdUJBQXVCLFVBQVUsU0FBUztJQUFoSDs7SUFHSSxJQUFJLGNBQWM7SUFDbEIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsdUJBQXVCO1lBQzdFLGVBQWUsc0JBQXNCO1dBQ3RDLFVBQVUsbUJBQW1CO1lBQzVCLGFBQWEsa0JBQWtCOztRQUVuQyxTQUFTLFlBQVk7O1lBSjdCLFNBQVMsMkJBQTJCLFlBQVc7O2dCQUUzQyxJQUFJLG9CQUNBO29CQUNBLFNBQU07b0JBQUUsS0FBRTtvQkFBRSxXQUFRO29CQUFFLFdBQVE7b0JBQUUsVUFBTztvQkFBRSxjQUFXO29CQUFFLGNBQVc7b0JBQUUsWUFBUztvQkFDNUUsY0FBVztvQkFBRSxjQUFXO29CQUFFLGdCQUFhO29CQUFFLFVBQU87O2dCQUVwRCxTQUFTLGdCQUE2QztvQkFnQnRDLElBaEJPLFlBQVMsVUFBQSxVQUFBLEtBQUEsVUFBQSxPQUFBLFlBQUcsb0JBQWlCLFVBQUE7O29CQUNoRCxJQUFJLFVBQVUsUUFBUSxRQUFRO29CQUM5QixTQUFTLFNBQVM7b0JBQ2xCLE9BQU87b0JBQ1AsT0FBTzs7O2dCQUdYLFdBQVcsT0FBTyxZQUFZOztnQkFFOUIsV0FBVyxPQUFPLFVBQVMsVUFBVTtvQkFDakMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLFFBQVE7b0JBQ3hDLFNBQVMsTUFBTSxXQUFXOzs7Z0JBRzlCLFdBQVcsT0FBTyxVQUFTLGNBQWMsWUFBWSxNQUFNLFlBQVksaUJBQWlCLGVBQWU7b0JBQ25HLFNBQVM7b0JBQ1QsS0FBSztvQkFDTCxXQUFXO29CQUNYLFdBQVc7b0JBQ1gsY0FBYztvQkFDZCxnQkFBZ0I7O29CQUVoQixjQUFjO3dCQUNWLE1BQU07d0JBQ04sTUFBTTs7O29CQUdWLGNBQWM7d0JBQ04sTUFBTTt3QkFDTixNQUFNOztvQkFFZCxZQUFZO3dCQUNSLE1BQU07d0JBQ04sZUFBZTs0QkFDWCxjQUFjO2dDQUNWLE9BQU8sQ0FBQzs7OztvQkFJcEIsY0FBYzt3QkFDVixNQUFNO3dCQUNOLFFBQVE7NEJBQ0osT0FBTyxDQUFDOzs7O29CQUloQixjQUFjLGdCQUFnQixZQUFZLGlCQUFpQixPQUFPOzs7Z0JBR3RFLEdBQUcsY0FBYyxZQUFXO29CQUN4QixVQUFVO29CQUNWLE9BQU8sU0FBUyxJQUFJO29CQUNwQixPQUFPLFFBQVEsS0FBSyxjQUFjLFFBQVEsUUFBUTtvQkFDbEQsT0FBTyxRQUFRLEtBQUssdUJBQXVCLFNBQVMsY0FBYyxRQUFROzs7Z0JBSTlFLEdBQUcsMkNBQTJDLFlBQVc7b0JBQ3JELFVBQVU7b0JBQ1YsUUFBUSxlQUFlO29CQUN2QixPQUFPLFFBQVEsS0FBSyx1QkFBdUIsU0FBUyxpQkFBaUIsUUFBUTs7O2dCQUdqRixHQUFHLHlDQUF5QyxZQUFXO29CQUNuRCxVQUFVO29CQUNWLFFBQVEsZUFBZTtvQkFDdkIsT0FBTyxRQUFRLEtBQUssdUJBQXVCLFNBQVMsaUJBQWlCLFFBQVE7OztnQkFHakYsU0FBUywrQkFBK0IsWUFBTTtvQkFDMUMsSUFBSSxjQUFXO3dCQUFFLG9CQUFpQjs7b0JBRWxDLFdBQVcsT0FBTyxVQUFDLGVBQWUsTUFBTSxpQkFBaUIscUJBQXdCO3dCQUM3RSxnQkFBZ0I7d0JBQ2hCLGNBQWM7d0JBQ2QsS0FBSzt3QkFDTCxvQkFBb0I7OztvQkFHeEIsU0FBUyxtQkFBbUI7O3dCQUV4QixPQUFPLFlBQVksK0JBQStCOzRCQUM5QyxlQUFlOzRCQUNmLG1CQUFtQjs0QkFDbkIsSUFBSTs7OztvQkFJWixTQUFTLGFBQWEsWUFBTTt3QkFDeEIsR0FBRyxrQ0FBa0MsWUFBTTs0QkFDdkMsSUFBSSxPQUFJOzRCQUNSLE9BQU87NEJBQ1AsT0FBTyxNQUFNLElBQUk7NEJBQ2pCLEtBQUssY0FBYyxDQUFDOzRCQUNwQixPQUFPOzRCQUNQLE9BQU8sS0FBSyxhQUFhLEtBQUs7NEJBQzlCLE9BQU8sS0FBSyxhQUFhLEtBQUs7Ozt3QkFHbEMsR0FBRywrQkFBK0IsWUFBTTs0QkFDcEMsSUFBSSxPQUFJOzRCQUNSLE9BQU87NEJBQ1AsT0FBTyxNQUFNLElBQUk7NEJBQ2pCLEtBQUssY0FBYyxDQUFDOzRCQUNwQixPQUFPLEtBQUssYUFBYSxLQUFLOzRCQUM5QixPQUFPLEtBQUssV0FBVyxLQUFLOzs7d0JBR2hDLEdBQUcsK0RBQStELFlBQU07NEJBQ3BFLElBQUksT0FBSTs0QkFDUixPQUFPOzRCQUNQLE9BQU8sTUFBTSxJQUFJOzRCQUNqQixLQUFLLGNBQWMsQ0FBQyxhQUFhOzRCQUNqQyxPQUFPLEtBQUssYUFBYSxLQUFLOzRCQUM5QixPQUFPLEtBQUssV0FBVyxLQUFLOzs7O29CQUlwQyxTQUFTLGVBQWUsWUFBTTs7d0JBRTFCLEdBQUcsdUNBQXVDLFlBQU07NEJBQzVDLElBQUksT0FBTzs7NEJBRVgsTUFBTSxRQUFRLFVBQVUsVUFBVSxJQUFJOzs0QkFFdEMsS0FBSyxjQUFjLENBQUM7NEJBQ3BCLE9BQU87NEJBQ1AsT0FBTyxRQUFRLFNBQVMsUUFBUTs7O3dCQUdwQyxHQUFHLHFDQUFxQyxZQUFNOzRCQUMxQyxJQUFJLE9BQU87Z0NBQ1AsUUFBUSxFQUFFLFNBQVM7OzRCQUV2QixjQUFjLGdCQUFnQixZQUFZLGlCQUFpQixNQUFNLE1BQU07NEJBQ3ZFLE1BQU0sUUFBUSxVQUFVLFVBQVUsSUFBSTs7NEJBRXRDLEtBQUssY0FBYyxDQUFDOzRCQUNwQixPQUFPOzs0QkFFUCxPQUFPLEtBQUssZUFBZSxRQUFRLE1BQU07NEJBQ3pDLE9BQU8sUUFBUSxTQUFTLFFBQVEsSUFBSTs7Ozs7OztHQXdCakQiLCJmaWxlIjoicGx1Z2luL1BsdWdpbkRyb3BGaWxlRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHBsdWdpbk1vZHVsZSBmcm9tICdwbHVnaW4vUGx1Z2luTW9kdWxlLmpzJztcbmltcG9ydCB0ZXN0TW9kdWxlIGZyb20gJ3Rlc3QvanMvVGVzdE1vZHVsZSc7XG5cbmRlc2NyaWJlKCdQbHVnaW5Ecm9wRmlsZURpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IGVsZW1lbnREZWZpbml0aW9uID1cbiAgICAgICAgJzxkaXYgc3AtcGx1Z2luLWRyb3AtZmlsZT48L2Rpdj4nLFxuICAgICAgICAkc2NvcGUsICRxLCAkY29tcGlsZSwgJHRpbWVvdXQsIGVsZW1lbnQsIHRlc3RTZXJ2aWNlLCBjaGFuZ2VFdmVudCwgZHJvcEV2ZW50LFxuICAgICAgICBmYWtlSnBnRmlsZSwgZmFrZVppcEZpbGUsIHBsdWdpblNlcnZpY2UsICR3aW5kb3c7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGRlZmludGlvbiA9IGVsZW1lbnREZWZpbml0aW9uKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGRlZmludGlvbik7XG4gICAgICAgICRjb21waWxlKGVsZW1lbnQpKCRzY29wZSk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUodGVzdE1vZHVsZSwgcGx1Z2luTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAkd2luZG93ID0geyBsb2NhdGlvbjogeyByZWxvYWQ6IGFuZ3VsYXIubm9vcCB9IH07XG4gICAgICAgICRwcm92aWRlLnZhbHVlKCckd2luZG93JywgJHdpbmRvdyk7XG4gICAgfSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oXyRyb290U2NvcGVfLCBfJGNvbXBpbGVfLCBfJHFfLCBfJHRpbWVvdXRfLCBfcGx1Z2luU2VydmljZV8sIF90ZXN0U2VydmljZV8pIHtcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAkcSA9IF8kcV87XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgJHRpbWVvdXQgPSBfJHRpbWVvdXRfO1xuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XG4gICAgICAgIHBsdWdpblNlcnZpY2UgPSBfcGx1Z2luU2VydmljZV87XG5cbiAgICAgICAgZmFrZVppcEZpbGUgPSB7XG4gICAgICAgICAgICBuYW1lOiAnZmFrZVppcEZpbGUuemlwJyxcbiAgICAgICAgICAgIHR5cGU6ICdhcHBsaWNhdGlvbi96aXAnXG4gICAgICAgIH07XG5cbiAgICAgICAgZmFrZUpwZ0ZpbGUgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Zha2VGaWxlLmpwZycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL2pwZydcbiAgICAgICAgfTtcbiAgICAgICAgZHJvcEV2ZW50ID0ge1xuICAgICAgICAgICAgdHlwZTogJ2Ryb3AnLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDoge1xuICAgICAgICAgICAgICAgIGRhdGFUcmFuc2Zlcjoge1xuICAgICAgICAgICAgICAgICAgICBmaWxlczogW2Zha2VaaXBGaWxlXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY2hhbmdlRXZlbnQgPSB7XG4gICAgICAgICAgICB0eXBlOiAnY2hhbmdlJyxcbiAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgIGZpbGVzOiBbZmFrZVppcEZpbGVdXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcGx1Z2luU2VydmljZS5pbnN0YWxsUGx1Z2luID0gdGVzdFNlcnZpY2UuY3JlYXRlUHJvbWlzZVNweShmYWxzZSwge30pO1xuICAgIH0pKTtcblxuICAgIGl0KCdpcyBjcmVhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIGV4cGVjdChlbGVtZW50KS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmZhLXVwbG9hZCcpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmJveC1kcmFnbmRyb3Agc3BhbicpLmhhc0NsYXNzKCd0ZXh0LWluZm8nKSkudG9FcXVhbCh0cnVlKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ2NoYW5nZXMgaW5pdGlhbCBzdGF0ZSB3aXRoIGNoYW5nZSBldmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBlbGVtZW50LnRyaWdnZXJIYW5kbGVyKGNoYW5nZUV2ZW50KTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmJveC1kcmFnbmRyb3Agc3BhbicpLmhhc0NsYXNzKCd0ZXh0LXN1Y2Nlc3MnKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdjaGFuZ2VzIGluaXRpYWwgc3RhdGUgd2l0aCBkcm9wIGV2ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIGVsZW1lbnQudHJpZ2dlckhhbmRsZXIoZHJvcEV2ZW50KTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmJveC1kcmFnbmRyb3Agc3BhbicpLmhhc0NsYXNzKCd0ZXh0LXN1Y2Nlc3MnKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdQbHVnaW5Ecm9wRmlsZURpcmVjdGl2ZUN0cmwnLCAoKSA9PiB7XG4gICAgICAgIGxldCAkY29udHJvbGxlciwgc3BUcmFuc2xhdGVGaWx0ZXI7XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoKF8kY29udHJvbGxlcl8sIF8kcV8sIF9wbHVnaW5TZXJ2aWNlXywgX3NwVHJhbnNsYXRlRmlsdGVyXykgPT4ge1xuICAgICAgICAgICAgcGx1Z2luU2VydmljZSA9IF9wbHVnaW5TZXJ2aWNlXztcbiAgICAgICAgICAgICRjb250cm9sbGVyID0gXyRjb250cm9sbGVyXztcbiAgICAgICAgICAgICRxID0gXyRxXztcbiAgICAgICAgICAgIHNwVHJhbnNsYXRlRmlsdGVyID0gX3NwVHJhbnNsYXRlRmlsdGVyXztcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkY29udHJvbGxlcignUGx1Z2luRHJvcEZpbGVEaXJlY3RpdmVDdHJsJywge1xuICAgICAgICAgICAgICAgIHBsdWdpblNlcnZpY2U6IHBsdWdpblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgc3BUcmFuc2xhdGVGaWx0ZXI6IHNwVHJhbnNsYXRlRmlsdGVyLFxuICAgICAgICAgICAgICAgICRxOiAkcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXNjcmliZSgnZmlsZSBkcm9wJywgKCkgPT4ge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBpbiB0aGUgc3VjY2VzcyBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY3RybDtcbiAgICAgICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBjdHJsLmZpbGVTdWJtaXR0ZWQoW2Zha2VaaXBGaWxlXSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc0luaXRpYWwoKSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNTdWNjZXNzKCkpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBpbiBhbiBlcnJvciBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY3RybDtcbiAgICAgICAgICAgICAgICBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBjdHJsLmZpbGVTdWJtaXR0ZWQoW2Zha2VKcGdGaWxlXSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNJbml0aWFsKCkpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdHJsLmlzRXJyb3IoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGJlIGluIGFuIGVycm9yIHN0YXRlIGFmdGVyIHN1Ym1pdHRpbmcgbXVsdGlwbGUgZmlsZXMnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGN0cmw7XG4gICAgICAgICAgICAgICAgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybCkubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgY3RybC5maWxlU3VibWl0dGVkKFtmYWtlWmlwRmlsZSwgZmFrZVppcEZpbGVdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3RybC5pc0luaXRpYWwoKSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuaXNFcnJvcigpKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdzdWJtaXQgZmlsZScsICgpID0+IHtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZWxvYWQgdGhlIHBhZ2UgdXBvbiBzdWNjZXNzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjdHJsID0gY3JlYXRlQ29udHJvbGxlcigpO1xuXG4gICAgICAgICAgICAgICAgc3B5T24oJHdpbmRvdy5sb2NhdGlvbiwgJ3JlbG9hZCcpLmFuZC5jYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgICAgICAgICAgY3RybC5maWxlU3VibWl0dGVkKFtmYWtlWmlwRmlsZV0pO1xuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCR3aW5kb3cubG9jYXRpb24ucmVsb2FkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzZXQgdGhlIG1lc3NhZ2UgdXBvbiBlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY3RybCA9IGNyZWF0ZUNvbnRyb2xsZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB7IG1lc3NhZ2U6ICdhbiBlcnJvciBvY2N1cnJlZCcgfTtcblxuICAgICAgICAgICAgICAgIHBsdWdpblNlcnZpY2UuaW5zdGFsbFBsdWdpbiA9IHRlc3RTZXJ2aWNlLmNyZWF0ZVByb21pc2VTcHkodHJ1ZSwgbnVsbCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHNweU9uKCR3aW5kb3cubG9jYXRpb24sICdyZWxvYWQnKS5hbmQuY2FsbFRocm91Z2goKTtcblxuICAgICAgICAgICAgICAgIGN0cmwuZmlsZVN1Ym1pdHRlZChbZmFrZVppcEZpbGVdKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGN0cmwuc3RhdHVzTWVzc2FnZSkudG9FcXVhbChlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
