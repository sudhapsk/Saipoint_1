System.register(['test/js/TestInitializer', 'common/email/EmailModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    /**
     * Tests for EmailTemplate
     */
    'use strict';

    var emailModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonEmailEmailModule) {
            emailModule = _commonEmailEmailModule['default'];
        }],
        execute: function () {
            describe('EmailTemplateTest', function () {
                var EmailTemplate = undefined;

                beforeEach(module(emailModule));

                beforeEach(inject(function (_EmailTemplate_) {
                    EmailTemplate = _EmailTemplate_;
                }));

                describe('constructor', function () {
                    it('throws if data is missing', function () {
                        expect(function () {
                            new EmailTemplate();
                        }).toThrow();
                    });

                    it('does not throw with correct data', function () {
                        expect(function () {
                            new EmailTemplate({});
                        }).not.toThrow();
                    });

                    it('toIdentity should be an object even if none was passed in', function () {
                        var template = new EmailTemplate({});
                        expect(template.toIdentity).toBeDefined();
                        expect(template.toIdentity).toEqual({}); // should be empty object
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9lbWFpbC9tb2RlbC9FbWFpbFRlbXBsYXRlVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsNkJBQTZCLFVBQVUsU0FBUzs7Ozs7O0lBTXhGOztJQUVBLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsY0FBYyx3QkFBd0I7O1FBRTFDLFNBQVMsWUFBWTtZQU43QixTQUFTLHFCQUFxQixZQUFNO2dCQUNoQyxJQUFJLGdCQUFhOztnQkFFakIsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQUMsaUJBQW9CO29CQUNuQyxnQkFBZ0I7OztnQkFHcEIsU0FBUyxlQUFlLFlBQU07b0JBQzFCLEdBQUcsNkJBQTZCLFlBQVc7d0JBQ3ZDLE9BQU8sWUFBVzs0QkFDZCxJQUFJOzJCQUNMOzs7b0JBR1AsR0FBRyxvQ0FBb0MsWUFBTTt3QkFDekMsT0FBTyxZQUFXOzRCQUNkLElBQUksY0FBYzsyQkFDbkIsSUFBSTs7O29CQUdYLEdBQUcsNkRBQTZELFlBQU07d0JBQ2xFLElBQUksV0FBVyxJQUFJLGNBQWM7d0JBQ2pDLE9BQU8sU0FBUyxZQUFZO3dCQUM1QixPQUFPLFNBQVMsWUFBWSxRQUFROzs7Ozs7R0FhN0MiLCJmaWxlIjoiY29tbW9uL2VtYWlsL21vZGVsL0VtYWlsVGVtcGxhdGVUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBlbWFpbE1vZHVsZSBmcm9tICdjb21tb24vZW1haWwvRW1haWxNb2R1bGUnO1xuXG4vKipcbiAqIFRlc3RzIGZvciBFbWFpbFRlbXBsYXRlXG4gKi9cbmRlc2NyaWJlKCdFbWFpbFRlbXBsYXRlVGVzdCcsICgpID0+IHtcbiAgICBsZXQgRW1haWxUZW1wbGF0ZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGVtYWlsTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKGluamVjdCgoX0VtYWlsVGVtcGxhdGVfKSA9PiB7XG4gICAgICAgIEVtYWlsVGVtcGxhdGUgPSBfRW1haWxUZW1wbGF0ZV87XG4gICAgfSkpO1xuXG4gICAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgICAgICBpdCgndGhyb3dzIGlmIGRhdGEgaXMgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG5ldyBFbWFpbFRlbXBsYXRlKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdCB0aHJvdyB3aXRoIGNvcnJlY3QgZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXcgRW1haWxUZW1wbGF0ZSh7fSk7XG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndG9JZGVudGl0eSBzaG91bGQgYmUgYW4gb2JqZWN0IGV2ZW4gaWYgbm9uZSB3YXMgcGFzc2VkIGluJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gbmV3IEVtYWlsVGVtcGxhdGUoe30pO1xuICAgICAgICAgICAgZXhwZWN0KHRlbXBsYXRlLnRvSWRlbnRpdHkpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICBleHBlY3QodGVtcGxhdGUudG9JZGVudGl0eSkudG9FcXVhbCh7fSk7IC8vIHNob3VsZCBiZSBlbXB0eSBvYmplY3RcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
