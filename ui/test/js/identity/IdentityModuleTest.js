System.register(['test/js/TestInitializer', 'identity/IdentityModule'], function (_export) {
    /*
     * Copyright (C) 2016 SailPoint Technologies, Inc.  All rights reserved.
     */

    'use strict';

    var identityModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_identityIdentityModule) {
            identityModule = _identityIdentityModule['default'];
        }],
        execute: function () {

            describe('identityModule', function () {

                var $rootScope,
                    $state,
                    $location,
                    flowMasterService,
                    i,
                    identityId = 1,
                    quickLink = 'Manage Passwords',
                    quickLinkUrl = 'Manage%20Passwords',
                    states = ['identities.identity', 'identities.identity.passwords', 'quickLinks.quickLink', 'quickLinks.quickLink.identities'],
                    urls = ['#/identities/' + identityId, '#/identities/' + identityId + '/passwords', '#/quickLinks/' + quickLinkUrl, '#/quickLinks/' + quickLinkUrl + '/identities'];

                beforeEach(function () {

                    module(identityModule, function ($provide, $stateProvider) {
                        flowMasterService = {
                            registerFlow: jasmine.createSpy()
                        };
                        $provide.value('flowMasterService', flowMasterService);
                    });

                    inject(function (_$rootScope_, _$state_, _$location_, $templateCache) {
                        $rootScope = _$rootScope_;
                        $state = _$state_;
                        $location = _$location_;
                        // We need add the template entry into the templateCache if we ever
                        // specify a templateUrl
                        $templateCache.put('template.html', '');
                    });
                });

                it('should respond to URL', function () {
                    for (i = 0; i < states.length; i++) {
                        expect($state.href(states[i], { identityId: identityId, quickLink: quickLink })).toEqual(urls[i]);
                    }
                });

                it('should register with the flowmaster', function () {
                    var flow = undefined;
                    expect(flowMasterService.registerFlow).toHaveBeenCalled();
                    flow = flowMasterService.registerFlow.calls.argsFor(0)[0];
                    expect(flow.name).toEqual('manageAccounts');
                    flow = flowMasterService.registerFlow.calls.argsFor(1)[0];
                    expect(flow.name).toEqual('editIdentity');
                    flow = flowMasterService.registerFlow.calls.argsFor(2)[0];
                    expect(flow.name).toEqual('createIdentity');
                    flow = flowMasterService.registerFlow.calls.argsFor(3)[0];
                    expect(flow.name).toEqual('loginPassword');
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkZW50aXR5L0lkZW50aXR5TW9kdWxlVGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIsNEJBQTRCLFVBQVUsU0FBUzs7Ozs7SUFLdkY7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHlCQUF5QjtZQUMvRSxpQkFBaUIsd0JBQXdCOztRQUU3QyxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsa0JBQWtCLFlBQVc7O2dCQUVsQyxJQUFJO29CQUFZO29CQUFRO29CQUFXO29CQUFtQjtvQkFDbEQsYUFBYTtvQkFDYixZQUFZO29CQUNaLGVBQWU7b0JBQ2YsU0FBUyxDQUFDLHVCQUNBLGlDQUNBLHdCQUNBO29CQUdWLE9BQU8sQ0FBQSxrQkFBaUIsWUFBVSxrQkFDVixhQUFVLGNBQUEsa0JBQ1YsY0FBWSxrQkFDWixlQUFZOztnQkFFeEMsV0FBVyxZQUFXOztvQkFFbEIsT0FBTyxnQkFBZ0IsVUFBUyxVQUFVLGdCQUFnQjt3QkFDdEQsb0JBQW9COzRCQUNoQixjQUFjLFFBQVE7O3dCQUUxQixTQUFTLE1BQU0scUJBQXFCOzs7b0JBR3hDLE9BQU8sVUFBUyxjQUFjLFVBQVUsYUFBYSxnQkFBZ0I7d0JBQ2pFLGFBQWE7d0JBQ2IsU0FBUzt3QkFDVCxZQUFZOzs7d0JBR1osZUFBZSxJQUFJLGlCQUFpQjs7OztnQkFJNUMsR0FBRyx5QkFBeUIsWUFBVztvQkFDbkMsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLFFBQVEsS0FBSzt3QkFDaEMsT0FBTyxPQUFPLEtBQUssT0FBTyxJQUFJLEVBQUUsWUFBWSxZQUFZLFdBQVcsY0FBYyxRQUFRLEtBQUs7Ozs7Z0JBSXRHLEdBQUcsdUNBQXVDLFlBQVc7b0JBQ2pELElBQUksT0FBSTtvQkFDUixPQUFPLGtCQUFrQixjQUFjO29CQUN2QyxPQUFPLGtCQUFrQixhQUFhLE1BQU0sUUFBUSxHQUFHO29CQUN2RCxPQUFPLEtBQUssTUFBTSxRQUFRO29CQUMxQixPQUFPLGtCQUFrQixhQUFhLE1BQU0sUUFBUSxHQUFHO29CQUN2RCxPQUFPLEtBQUssTUFBTSxRQUFRO29CQUMxQixPQUFPLGtCQUFrQixhQUFhLE1BQU0sUUFBUSxHQUFHO29CQUN2RCxPQUFPLEtBQUssTUFBTSxRQUFRO29CQUMxQixPQUFPLGtCQUFrQixhQUFhLE1BQU0sUUFBUSxHQUFHO29CQUN2RCxPQUFPLEtBQUssTUFBTSxRQUFROzs7OztHQVEvQiIsImZpbGUiOiJpZGVudGl0eS9JZGVudGl0eU1vZHVsZVRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi9cblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgaWRlbnRpdHlNb2R1bGUgZnJvbSAnaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuXG5kZXNjcmliZSgnaWRlbnRpdHlNb2R1bGUnLCBmdW5jdGlvbigpIHtcblxuICAgIHZhciAkcm9vdFNjb3BlLCAkc3RhdGUsICRsb2NhdGlvbiwgZmxvd01hc3RlclNlcnZpY2UsIGksXG4gICAgICAgIGlkZW50aXR5SWQgPSAxLFxuICAgICAgICBxdWlja0xpbmsgPSAnTWFuYWdlIFBhc3N3b3JkcycsXG4gICAgICAgIHF1aWNrTGlua1VybCA9ICdNYW5hZ2UlMjBQYXNzd29yZHMnLFxuICAgICAgICBzdGF0ZXMgPSBbJ2lkZW50aXRpZXMuaWRlbnRpdHknLFxuICAgICAgICAgICAgICAgICAgJ2lkZW50aXRpZXMuaWRlbnRpdHkucGFzc3dvcmRzJyxcbiAgICAgICAgICAgICAgICAgICdxdWlja0xpbmtzLnF1aWNrTGluaycsXG4gICAgICAgICAgICAgICAgICAncXVpY2tMaW5rcy5xdWlja0xpbmsuaWRlbnRpdGllcydcbiAgICAgICAgICAgICAgICAgXSxcblxuICAgICAgICB1cmxzID0gW2AjL2lkZW50aXRpZXMvJHtpZGVudGl0eUlkfWAsXG4gICAgICAgICAgICAgICAgYCMvaWRlbnRpdGllcy8ke2lkZW50aXR5SWR9L3Bhc3N3b3Jkc2AsXG4gICAgICAgICAgICAgICAgYCMvcXVpY2tMaW5rcy8ke3F1aWNrTGlua1VybH1gLFxuICAgICAgICAgICAgICAgIGAjL3F1aWNrTGlua3MvJHtxdWlja0xpbmtVcmx9L2lkZW50aXRpZXNgXTtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbW9kdWxlKGlkZW50aXR5TW9kdWxlLCBmdW5jdGlvbigkcHJvdmlkZSwgJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGZsb3dNYXN0ZXJTZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyRmxvdzogamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRwcm92aWRlLnZhbHVlKCdmbG93TWFzdGVyU2VydmljZScsIGZsb3dNYXN0ZXJTZXJ2aWNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgXyRzdGF0ZV8sIF8kbG9jYXRpb25fLCAkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcbiAgICAgICAgICAgICRzdGF0ZSA9IF8kc3RhdGVfO1xuICAgICAgICAgICAgJGxvY2F0aW9uID0gXyRsb2NhdGlvbl87XG4gICAgICAgICAgICAvLyBXZSBuZWVkIGFkZCB0aGUgdGVtcGxhdGUgZW50cnkgaW50byB0aGUgdGVtcGxhdGVDYWNoZSBpZiB3ZSBldmVyXG4gICAgICAgICAgICAvLyBzcGVjaWZ5IGEgdGVtcGxhdGVVcmxcbiAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgndGVtcGxhdGUuaHRtbCcsICcnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlc3BvbmQgdG8gVVJMJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGV4cGVjdCgkc3RhdGUuaHJlZihzdGF0ZXNbaV0sIHsgaWRlbnRpdHlJZDogaWRlbnRpdHlJZCwgcXVpY2tMaW5rOiBxdWlja0xpbmsgfSkpLnRvRXF1YWwodXJsc1tpXSk7XG4gICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZWdpc3RlciB3aXRoIHRoZSBmbG93bWFzdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBmbG93O1xuICAgICAgICBleHBlY3QoZmxvd01hc3RlclNlcnZpY2UucmVnaXN0ZXJGbG93KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIGZsb3cgPSBmbG93TWFzdGVyU2VydmljZS5yZWdpc3RlckZsb3cuY2FsbHMuYXJnc0ZvcigwKVswXTtcbiAgICAgICAgZXhwZWN0KGZsb3cubmFtZSkudG9FcXVhbCgnbWFuYWdlQWNjb3VudHMnKTtcbiAgICAgICAgZmxvdyA9IGZsb3dNYXN0ZXJTZXJ2aWNlLnJlZ2lzdGVyRmxvdy5jYWxscy5hcmdzRm9yKDEpWzBdO1xuICAgICAgICBleHBlY3QoZmxvdy5uYW1lKS50b0VxdWFsKCdlZGl0SWRlbnRpdHknKTtcbiAgICAgICAgZmxvdyA9IGZsb3dNYXN0ZXJTZXJ2aWNlLnJlZ2lzdGVyRmxvdy5jYWxscy5hcmdzRm9yKDIpWzBdO1xuICAgICAgICBleHBlY3QoZmxvdy5uYW1lKS50b0VxdWFsKCdjcmVhdGVJZGVudGl0eScpO1xuICAgICAgICBmbG93ID0gZmxvd01hc3RlclNlcnZpY2UucmVnaXN0ZXJGbG93LmNhbGxzLmFyZ3NGb3IoMylbMF07XG4gICAgICAgIGV4cGVjdChmbG93Lm5hbWUpLnRvRXF1YWwoJ2xvZ2luUGFzc3dvcmQnKTtcbiAgICB9KTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
