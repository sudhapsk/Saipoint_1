System.register(['test/js/TestInitializer', 'common/warning/WarningModule'], function (_export) {
    'use strict';

    var warningModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonWarningWarningModule) {
            warningModule = _commonWarningWarningModule['default'];
        }],
        execute: function () {

            describe('RefreshWarningController', function () {
                var ctrl, service;

                beforeEach(module(warningModule));
                beforeEach(inject(function ($controller, _refreshWarningOverrideService_) {
                    ctrl = $controller('RefreshWarningController');
                    service = _refreshWarningOverrideService_;
                    spyOn(service, 'enableOverride');
                    spyOn(service, 'disableOverride');
                }));

                it('should call through when enableOverride is called', function () {
                    ctrl.enableOverride();
                    expect(service.enableOverride).toHaveBeenCalled();
                });

                it('should call through when disableOverride is called', function () {
                    ctrl.disableOverride();
                    expect(service.disableOverride).toHaveBeenCalled();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9yZWZyZXNoV2FybmluZy9SZWZyZXNoV2FybmluZ0NvbnRyb2xsZXJUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsaUNBQWlDLFVBQVUsU0FBUztJQUFoRzs7SUFHSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsNkJBQTZCO1lBQ25GLGdCQUFnQiw0QkFBNEI7O1FBRWhELFNBQVMsWUFBWTs7WUFIN0IsU0FBUyw0QkFBNEIsWUFBVztnQkFDNUMsSUFBSSxNQUFNOztnQkFFVixXQUFXLE9BQU87Z0JBQ2xCLFdBQVcsT0FBTyxVQUFTLGFBQWEsaUNBQWlDO29CQUNyRSxPQUFPLFlBQVk7b0JBQ25CLFVBQVU7b0JBQ1YsTUFBTSxTQUFTO29CQUNmLE1BQU0sU0FBUzs7O2dCQUduQixHQUFHLHFEQUFxRCxZQUFXO29CQUMvRCxLQUFLO29CQUNMLE9BQU8sUUFBUSxnQkFBZ0I7OztnQkFHbkMsR0FBRyxzREFBc0QsWUFBVztvQkFDaEUsS0FBSztvQkFDTCxPQUFPLFFBQVEsaUJBQWlCOzs7OztHQVVyQyIsImZpbGUiOiJjb21tb24vcmVmcmVzaFdhcm5pbmcvUmVmcmVzaFdhcm5pbmdDb250cm9sbGVyVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHdhcm5pbmdNb2R1bGUgZnJvbSAnY29tbW9uL3dhcm5pbmcvV2FybmluZ01vZHVsZSc7XG5cbmRlc2NyaWJlKCdSZWZyZXNoV2FybmluZ0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3RybCwgc2VydmljZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdhcm5pbmdNb2R1bGUpKTtcbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkY29udHJvbGxlciwgX3JlZnJlc2hXYXJuaW5nT3ZlcnJpZGVTZXJ2aWNlXykge1xuICAgICAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ1JlZnJlc2hXYXJuaW5nQ29udHJvbGxlcicpO1xuICAgICAgICBzZXJ2aWNlID0gX3JlZnJlc2hXYXJuaW5nT3ZlcnJpZGVTZXJ2aWNlXztcbiAgICAgICAgc3B5T24oc2VydmljZSwgJ2VuYWJsZU92ZXJyaWRlJyk7XG4gICAgICAgIHNweU9uKHNlcnZpY2UsICdkaXNhYmxlT3ZlcnJpZGUnKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdGhyb3VnaCB3aGVuIGVuYWJsZU92ZXJyaWRlIGlzIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjdHJsLmVuYWJsZU92ZXJyaWRlKCk7XG4gICAgICAgIGV4cGVjdChzZXJ2aWNlLmVuYWJsZU92ZXJyaWRlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdGhyb3VnaCB3aGVuIGRpc2FibGVPdmVycmlkZSBpcyBjYWxsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY3RybC5kaXNhYmxlT3ZlcnJpZGUoKTtcbiAgICAgICAgZXhwZWN0KHNlcnZpY2UuZGlzYWJsZU92ZXJyaWRlKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
