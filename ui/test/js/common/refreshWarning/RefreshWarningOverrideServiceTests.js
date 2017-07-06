System.register(['test/js/TestInitializer', 'common/warning/WarningModule'], function (_export) {
    'use strict';

    var warningModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonWarningWarningModule) {
            warningModule = _commonWarningWarningModule['default'];
        }],
        execute: function () {

            describe('RefreshWarningService', function () {
                var service;

                beforeEach(module(warningModule));
                beforeEach(inject(function (_refreshWarningOverrideService_) {
                    service = _refreshWarningOverrideService_;
                }));

                it('should default to not overriding', function () {
                    expect(service.isOverride()).toBeFalsy();
                });

                it('should override when enableOverride is called', function () {
                    expect(service.isOverride()).toBeFalsy();
                    service.enableOverride();
                    expect(service.isOverride()).toBeTruthy();
                });

                it('should not override when disableOverride is called', function () {
                    expect(service.isOverride()).toBeFalsy();
                    service.enableOverride();
                    expect(service.isOverride()).toBeTruthy();
                    service.disableOverride();
                    expect(service.isOverride()).toBeFalsy();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9yZWZyZXNoV2FybmluZy9SZWZyZXNoV2FybmluZ092ZXJyaWRlU2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixpQ0FBaUMsVUFBVSxTQUFTO0lBQWhHOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSw2QkFBNkI7WUFDbkYsZ0JBQWdCLDRCQUE0Qjs7UUFFaEQsU0FBUyxZQUFZOztZQUY3QixTQUFTLHlCQUF5QixZQUFXO2dCQUN6QyxJQUFJOztnQkFFSixXQUFXLE9BQU87Z0JBQ2xCLFdBQVcsT0FBTyxVQUFTLGlDQUFpQztvQkFDeEQsVUFBVTs7O2dCQUdkLEdBQUcsb0NBQW9DLFlBQVc7b0JBQzlDLE9BQU8sUUFBUSxjQUFjOzs7Z0JBR2pDLEdBQUcsaURBQWlELFlBQVc7b0JBQzNELE9BQU8sUUFBUSxjQUFjO29CQUM3QixRQUFRO29CQUNSLE9BQU8sUUFBUSxjQUFjOzs7Z0JBR2pDLEdBQUcsc0RBQXNELFlBQVc7b0JBQ2hFLE9BQU8sUUFBUSxjQUFjO29CQUM3QixRQUFRO29CQUNSLE9BQU8sUUFBUSxjQUFjO29CQUM3QixRQUFRO29CQUNSLE9BQU8sUUFBUSxjQUFjOzs7OztHQVNsQyIsImZpbGUiOiJjb21tb24vcmVmcmVzaFdhcm5pbmcvUmVmcmVzaFdhcm5pbmdPdmVycmlkZVNlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgd2FybmluZ01vZHVsZSBmcm9tICdjb21tb24vd2FybmluZy9XYXJuaW5nTW9kdWxlJztcblxuXG5kZXNjcmliZSgnUmVmcmVzaFdhcm5pbmdTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZSh3YXJuaW5nTW9kdWxlKSk7XG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oX3JlZnJlc2hXYXJuaW5nT3ZlcnJpZGVTZXJ2aWNlXykge1xuICAgICAgICBzZXJ2aWNlID0gX3JlZnJlc2hXYXJuaW5nT3ZlcnJpZGVTZXJ2aWNlXztcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRlZmF1bHQgdG8gbm90IG92ZXJyaWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHNlcnZpY2UuaXNPdmVycmlkZSgpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgb3ZlcnJpZGUgd2hlbiBlbmFibGVPdmVycmlkZSBpcyBjYWxsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHNlcnZpY2UuaXNPdmVycmlkZSgpKS50b0JlRmFsc3koKTtcbiAgICAgICAgc2VydmljZS5lbmFibGVPdmVycmlkZSgpO1xuICAgICAgICBleHBlY3Qoc2VydmljZS5pc092ZXJyaWRlKCkpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IG92ZXJyaWRlIHdoZW4gZGlzYWJsZU92ZXJyaWRlIGlzIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qoc2VydmljZS5pc092ZXJyaWRlKCkpLnRvQmVGYWxzeSgpO1xuICAgICAgICBzZXJ2aWNlLmVuYWJsZU92ZXJyaWRlKCk7XG4gICAgICAgIGV4cGVjdChzZXJ2aWNlLmlzT3ZlcnJpZGUoKSkudG9CZVRydXRoeSgpO1xuICAgICAgICBzZXJ2aWNlLmRpc2FibGVPdmVycmlkZSgpO1xuICAgICAgICBleHBlY3Qoc2VydmljZS5pc092ZXJyaWRlKCkpLnRvQmVGYWxzeSgpO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
