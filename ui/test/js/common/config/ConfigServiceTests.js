System.register(['test/js/TestInitializer', 'common/config/ConfigModule'], function (_export) {
    'use strict';

    var configModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonConfigConfigModule) {
            configModule = _commonConfigConfigModule['default'];
        }],
        execute: function () {

            describe('ConfigService', function () {
                var http, configService, contextPath, $rootScope, ColumnConfig, configServiceConst, tableColumnPreferenceService;

                beforeEach(module(configModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                }));

                /* jshint maxparams: 7 */
                beforeEach(inject(function ($httpBackend, _configService_, _$rootScope_, SP_CONTEXT_PATH, _ColumnConfig_, SP_CONFIG_SERVICE, _tableColumnPreferenceService_) {
                    http = $httpBackend;
                    configService = _configService_;
                    $rootScope = _$rootScope_;
                    contextPath = SP_CONTEXT_PATH;
                    configServiceConst = SP_CONFIG_SERVICE;
                    ColumnConfig = _ColumnConfig_;
                    tableColumnPreferenceService = _tableColumnPreferenceService_;
                }));

                afterEach(function () {
                    http.verifyNoOutstandingExpectation();
                    http.verifyNoOutstandingRequest();
                });

                var getConfigEntry = function (keys) {
                    var i,
                        obj = {};
                    for (i = 0; i < keys.length; i++) {
                        obj[keys[i]] = [new ColumnConfig({
                            'dataIndex': 'foo',
                            'label': 'Foo Bar'
                        })];
                    }
                    return obj;
                };

                var getIdentityDetails = function () {
                    return [{
                        'attribute': 'name',
                        'label': 'User Name'
                    }, {
                        'attribute': 'firstname',
                        'label': 'First Name'
                    }, {
                        'attribute': 'lastname',
                        'label': 'Last Name'
                    }, {
                        'attribute': 'email',
                        'label': 'Email'
                    }, {
                        'attribute': 'manager',
                        'label': 'Manager'
                    }];
                };

                /**
                 * Test getIdentityDetailsConfig
                 */
                describe('getIdentityDetailsConfig', function () {

                    /**
                     * Should return X many entries for the first time
                     */
                    it('returns all the identity detail config entries', function () {
                        var tmp,
                            configUrl = contextPath + '/ui/rest/configuration/uiconfig/identity';

                        // First check if endpoint returns 200
                        http.expectGET(configUrl).respond(200, getIdentityDetails());

                        configService.getIdentityDetailsConfig().then(function (result) {
                            tmp = result.data;
                        });

                        http.flush();

                        expect(tmp.length).toEqual(5);
                    });

                    /**
                     * Should return X many entries for the second time pulling from cache
                     */
                    it('returns all the identity detail config entries from cache', function () {
                        var tmp,
                            configUrl = contextPath + '/ui/rest/configuration/uiconfig/identity';

                        // First check if endpoint returns 200
                        http.expectGET(configUrl).respond(200, getIdentityDetails());

                        configService.getIdentityDetailsConfig().then(function (result) {
                            tmp = result.data;
                        });

                        http.flush();

                        expect(tmp.length).toEqual(5);

                        tmp = null;

                        configService.getIdentityDetailsConfig().then(function (result) {
                            tmp = result.data;
                        });

                        // Digest to get the promise resolved.
                        $rootScope.$apply();

                        expect(tmp.length).toEqual(5);
                    });
                });

                describe('column preferences', function () {

                    it('should throw if you try to register table column preference without key or value', function () {
                        expect(function () {
                            configService.registerTableColumnPreference(null, []);
                        }).toThrow();

                        expect(function () {
                            configService.registerTableColumnPreference('key', null);
                        }).toThrow();
                    });

                    it('should fetch table column preferences from cache if available', function () {
                        var tableId = 'testTableId',
                            columnPreferences = ['col1', 'col2'];

                        configService.registerTableColumnPreference(tableId, columnPreferences);

                        spyOn(tableColumnPreferenceService, 'getTableColumnPreferences');

                        configService.getTableColumnPreferences(tableId).then(function (colPreferences) {
                            expect(colPreferences).toEqual(columnPreferences);
                        });

                        expect(tableColumnPreferenceService.getTableColumnPreferences).not.toHaveBeenCalled();
                    });

                    it('should get table column preferences from backend when not in cache', function () {
                        var tableId = 'testTableId';

                        spyOn(tableColumnPreferenceService, 'getTableColumnPreferences');

                        configService.getTableColumnPreferences(tableId);

                        expect(tableColumnPreferenceService.getTableColumnPreferences).toHaveBeenCalled();
                    });
                });

                /**
                 * Test getting all the config entries.
                 */
                describe('getColumnConfigEntries', function () {
                    /**
                     * Should return X many entries
                     */
                    it('returns all the config entries', function () {
                        var tmp,
                            configUrl = contextPath + '/ui/rest/configuration/uiconfig/entries';

                        // Mock the response from configUrl and return an array of two entries
                        http.expectGET(configUrl).respond(200, getConfigEntry(['key1', 'key2']));

                        configService.getColumnConfigEntries().then(function (result) {
                            tmp = result.data;
                        });

                        http.flush();

                        expect(Object.keys(tmp).length).toBe(2);
                        expect(tmp.key1).toBeDefined();
                        expect(tmp.key2).toBeDefined();
                        expect(tmp.key3).not.toBeDefined();
                    });

                    /**
                     * Return config entry by keys. two good keys with one bad key
                     */
                    it('returns config entries by key', function () {
                        var tmp,
                            configUrl = contextPath + '/ui/rest/configuration/uiconfig/entries?key=key1&key=key2&key=key3';

                        // Mock the response from configUrl and return an array of two entries
                        http.expectGET(configUrl).respond(200, getConfigEntry(['key1', 'key2']));

                        configService.getColumnConfigEntries(['key1', 'key2', 'key3']).then(function (result) {
                            tmp = result.data;
                        });

                        http.flush();

                        expect(Object.keys(tmp).length).toBe(2);
                        expect(tmp.key1).toBeDefined();
                        expect(tmp.key2).toBeDefined();
                        expect(tmp.key3).not.toBeDefined();
                    });

                    /**
                     * Return config entry by keys from the cache
                     */
                    it('returns config entries from cache', function () {
                        var tmp,
                            configUrl = contextPath + '/ui/rest/configuration/uiconfig/entries?key=key1&key=key2';

                        // Mock the response from configUrl and return an array of two entries
                        http.expectGET(configUrl).respond(200, getConfigEntry(['key1', 'key2']));

                        // First call will get the entry from the REST resource
                        configService.getColumnConfigEntries(['key1', 'key2']).then(function (result) {
                            tmp = result.data;
                        });

                        http.flush();

                        expect(Object.keys(tmp).length).toBe(2);
                        expect(tmp.key1).toBeDefined();
                        expect(tmp.key2).toBeDefined();
                        expect(tmp.key3).not.toBeDefined();

                        tmp = null;

                        // Second call should get it from the cache
                        configService.getColumnConfigEntries(['key1', 'key2']).then(function (result) {
                            tmp = result.data;
                        });

                        // Digest to get the promise resolved.
                        $rootScope.$apply();

                        expect(Object.keys(tmp).length).toBe(2);
                        expect(tmp.key1).toBeDefined();
                        expect(tmp.key2).toBeDefined();
                        expect(tmp.key3).not.toBeDefined();
                    });

                    /**
                     * Ensure returned entries are of appropriate type
                     */
                    it('returns entries of type ColumnConfig', function () {
                        var tmp,
                            configUrl = contextPath + '/ui/rest/configuration/uiconfig/entries?key=key1';

                        // Mock the response from configUrl and return an array of two entries
                        http.expectGET(configUrl).respond(200, getConfigEntry(['key1']));

                        // First call will get the entry from the REST resource
                        configService.getColumnConfigEntries(['key1']).then(function (result) {
                            tmp = result.data;
                        });

                        http.flush();

                        expect(Object.keys(tmp).length).toBe(1);

                        expect(tmp.key1[0].getDataIndex()).toBe('foo');
                        expect(tmp.key1[0].getLabel()).toBe('Foo Bar');
                        expect(tmp.key1[0].isFieldOnly()).toBe(false);

                        expect(tmp.key2).not.toBeDefined();
                    });
                });

                describe('config value', function () {

                    // Setup the dependencies.
                    beforeEach(function () {
                        SailPoint.configData[configServiceConst.ACCESS_REQUEST_MAX_IDENTITY_SELECT] = 2;
                    });

                    it('pukes if registering a value with no key', function () {
                        expect(function () {
                            configService.registerConfigValue(null, 'boom');
                        }).toThrow();
                    });

                    it('returns a value if it has been registered', function () {
                        var key = 'geddy',
                            value = 'lee';
                        configService.registerConfigValue(key, value);
                        expect(configService.getConfigValue(key)).toEqual(value);
                    });

                    it('prefers registered values above SailPoint.configData', function () {
                        var key = configServiceConst.ACCESS_REQUEST_MAX_IDENTITY_SELECT,
                            value = 99;
                        configService.registerConfigValue(key, value);
                        expect(configService.getConfigValue(key)).toEqual(value);
                    });

                    it('returns a value if it is defined in SailPoint.configData', function () {
                        expect(configService.getConfigValue(configServiceConst.ACCESS_REQUEST_MAX_IDENTITY_SELECT)).toBe(2);
                    });

                    it('returns null if it is not defined in SailPoint.configData', function () {
                        expect(configService.getConfigValue('BLAHBLAHBLAH')).toBeNull();
                    });
                });

                describe('column config', function () {
                    var colCfgArray;

                    beforeEach(function () {
                        colCfgArray = [{
                            dataIndex: '12345'
                        }];
                    });

                    it('pukes if registering with null key', function () {
                        expect(function () {
                            configService.registerColumnConfig(null, colCfgArray);
                        }).toThrow();
                    });

                    it('pukes if registering with null column config array', function () {
                        expect(function () {
                            configService.registerColumnConfig('key', null);
                        }).toThrow();
                    });

                    it('pukes if registering with a non-array column config', function () {
                        expect(function () {
                            configService.registerColumnConfig('key', 'not an array');
                        }).toThrow();
                    });

                    it('returns undefined from getColumnConfig() for an unregistered config', function () {
                        var cfg = configService.getColumnConfig('not there');
                        expect(cfg).toBeUndefined();
                    });

                    it('registers a column config', function () {
                        var key = 'key',
                            cfg;
                        configService.registerColumnConfig(key, colCfgArray);
                        cfg = configService.getColumnConfig(key);
                        expect(cfg).not.toBeNull();
                        expect(cfg.length).toEqual(1);
                        expect(cfg[0] instanceof ColumnConfig).toEqual(true);
                        expect(cfg[0].dataIndex).toEqual(colCfgArray[0].dataIndex);
                    });
                });

                describe('isMobile()', function () {
                    it('returns the appropriate config value for the isMobile key', function () {
                        SailPoint.configData[configServiceConst.IS_MOBILE] = true;
                        expect(configService.isMobile()).toEqual(true);
                        SailPoint.configData[configServiceConst.IS_MOBILE] = false;
                        expect(configService.isMobile()).toEqual(false);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9jb25maWcvQ29uZmlnU2VydmljZVRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQiwrQkFBK0IsVUFBVSxTQUFTO0lBQTlGOztJQUdJLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwyQkFBMkI7WUFDakYsZUFBZSwwQkFBMEI7O1FBRTdDLFNBQVMsWUFBWTs7WUFIN0IsU0FBUyxpQkFBaUIsWUFBVztnQkFDakMsSUFBSSxNQUFNLGVBQWUsYUFBYSxZQUFZLGNBQWMsb0JBQW9COztnQkFFcEYsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxPQUFPLFVBQVMsVUFBVTtvQkFDakMsU0FBUyxTQUFTLG1CQUFtQjs7OztnQkFJekMsV0FBVyxPQUFPLFVBQVMsY0FBYyxpQkFBaUIsY0FBYyxpQkFBaUIsZ0JBQzlELG1CQUFtQixnQ0FBZ0M7b0JBQzFFLE9BQU87b0JBQ1AsZ0JBQWdCO29CQUNoQixhQUFhO29CQUNiLGNBQWM7b0JBQ2QscUJBQXFCO29CQUNyQixlQUFlO29CQUNmLCtCQUErQjs7O2dCQUduQyxVQUFVLFlBQVc7b0JBQ2pCLEtBQUs7b0JBQ0wsS0FBSzs7O2dCQUdULElBQUksaUJBQWlCLFVBQVMsTUFBTTtvQkFDaEMsSUFBSTt3QkFBRyxNQUFNO29CQUNiLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxRQUFRLEtBQUs7d0JBQzlCLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxhQUFhOzRCQUM3QixhQUFhOzRCQUNiLFNBQVM7OztvQkFHakIsT0FBTzs7O2dCQUdYLElBQUkscUJBQXFCLFlBQVc7b0JBQ2hDLE9BQVEsQ0FDSjt3QkFDSSxhQUFhO3dCQUNiLFNBQVM7dUJBRWI7d0JBQ0ksYUFBYTt3QkFDYixTQUFTO3VCQUViO3dCQUNJLGFBQWE7d0JBQ2IsU0FBUzt1QkFFYjt3QkFDSSxhQUFhO3dCQUNiLFNBQVM7dUJBRWI7d0JBQ0ks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QUFXLG1CQUFtQixhQUFhO3dCQUNyRCxPQUFPLGNBQWMsWUFBWSxRQUFRO3dCQUN6QyxVQUFVLFdBQVcsbUJBQW1CLGFBQWE7d0JBQ3JELE9BQU8sY0FBYyxZQUFZLFFBQVE7Ozs7OztHQVdsRCIsImZpbGUiOiJjb21tb24vY29uZmlnL0NvbmZpZ1NlcnZpY2VUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgY29uZmlnTW9kdWxlIGZyb20gJ2NvbW1vbi9jb25maWcvQ29uZmlnTW9kdWxlJztcblxuZGVzY3JpYmUoJ0NvbmZpZ1NlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgaHR0cCwgY29uZmlnU2VydmljZSwgY29udGV4dFBhdGgsICRyb290U2NvcGUsIENvbHVtbkNvbmZpZywgY29uZmlnU2VydmljZUNvbnN0LCB0YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoY29uZmlnTW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS5jb25zdGFudCgnU1BfQ09OVEVYVF9QQVRIJywgJy9pZGVudGl0eWlxJyk7XG4gICAgfSkpO1xuXG4gICAgLyoganNoaW50IG1heHBhcmFtczogNyAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRodHRwQmFja2VuZCwgX2NvbmZpZ1NlcnZpY2VfLCBfJHJvb3RTY29wZV8sIFNQX0NPTlRFWFRfUEFUSCwgX0NvbHVtbkNvbmZpZ18sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BfQ09ORklHX1NFUlZJQ0UsIF90YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlXykge1xuICAgICAgICBodHRwID0gJGh0dHBCYWNrZW5kO1xuICAgICAgICBjb25maWdTZXJ2aWNlID0gX2NvbmZpZ1NlcnZpY2VfO1xuICAgICAgICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICBjb250ZXh0UGF0aCA9IFNQX0NPTlRFWFRfUEFUSDtcbiAgICAgICAgY29uZmlnU2VydmljZUNvbnN0ID0gU1BfQ09ORklHX1NFUlZJQ0U7XG4gICAgICAgIENvbHVtbkNvbmZpZyA9IF9Db2x1bW5Db25maWdfO1xuICAgICAgICB0YWJsZUNvbHVtblByZWZlcmVuY2VTZXJ2aWNlID0gX3RhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2VfO1xuICAgIH0pKTtcblxuICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24oKTtcbiAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGdldENvbmZpZ0VudHJ5ID0gZnVuY3Rpb24oa2V5cykge1xuICAgICAgICB2YXIgaSwgb2JqID0ge307XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvYmpba2V5c1tpXV0gPSBbbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICAgICAgJ2RhdGFJbmRleCc6ICdmb28nLFxuICAgICAgICAgICAgICAgICdsYWJlbCc6ICdGb28gQmFyJ1xuICAgICAgICAgICAgfSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIHZhciBnZXRJZGVudGl0eURldGFpbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2F0dHJpYnV0ZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAnbGFiZWwnOiAnVXNlciBOYW1lJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnYXR0cmlidXRlJzogJ2ZpcnN0bmFtZScsXG4gICAgICAgICAgICAgICAgJ2xhYmVsJzogJ0ZpcnN0IE5hbWUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdhdHRyaWJ1dGUnOiAnbGFzdG5hbWUnLFxuICAgICAgICAgICAgICAgICdsYWJlbCc6ICdMYXN0IE5hbWUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdhdHRyaWJ1dGUnOiAnZW1haWwnLFxuICAgICAgICAgICAgICAgICdsYWJlbCc6ICdFbWFpbCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2F0dHJpYnV0ZSc6ICdtYW5hZ2VyJyxcbiAgICAgICAgICAgICAgICAnbGFiZWwnOiAnTWFuYWdlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGVzdCBnZXRJZGVudGl0eURldGFpbHNDb25maWdcbiAgICAgKi9cbiAgICBkZXNjcmliZSgnZ2V0SWRlbnRpdHlEZXRhaWxzQ29uZmlnJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3VsZCByZXR1cm4gWCBtYW55IGVudHJpZXMgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAqL1xuICAgICAgICBpdCgncmV0dXJucyBhbGwgdGhlIGlkZW50aXR5IGRldGFpbCBjb25maWcgZW50cmllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRtcCxcbiAgICAgICAgICAgICAgICBjb25maWdVcmwgPSBjb250ZXh0UGF0aCArICcvdWkvcmVzdC9jb25maWd1cmF0aW9uL3VpY29uZmlnL2lkZW50aXR5JztcblxuICAgICAgICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgZW5kcG9pbnQgcmV0dXJucyAyMDBcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGNvbmZpZ1VybCkucmVzcG9uZCgyMDAsIGdldElkZW50aXR5RGV0YWlscygpKTtcblxuICAgICAgICAgICAgY29uZmlnU2VydmljZS5nZXRJZGVudGl0eURldGFpbHNDb25maWcoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcblxuICAgICAgICAgICAgZXhwZWN0KHRtcC5sZW5ndGgpLnRvRXF1YWwoNSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG91bGQgcmV0dXJuIFggbWFueSBlbnRyaWVzIGZvciB0aGUgc2Vjb25kIHRpbWUgcHVsbGluZyBmcm9tIGNhY2hlXG4gICAgICAgICAqL1xuICAgICAgICBpdCgncmV0dXJucyBhbGwgdGhlIGlkZW50aXR5IGRldGFpbCBjb25maWcgZW50cmllcyBmcm9tIGNhY2hlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdG1wLFxuICAgICAgICAgICAgICAgIGNvbmZpZ1VybCA9IGNvbnRleHRQYXRoICsgJy91aS9yZXN0L2NvbmZpZ3VyYXRpb24vdWljb25maWcvaWRlbnRpdHknO1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBjaGVjayBpZiBlbmRwb2ludCByZXR1cm5zIDIwMFxuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoY29uZmlnVXJsKS5yZXNwb25kKDIwMCwgZ2V0SWRlbnRpdHlEZXRhaWxzKCkpO1xuXG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlLmdldElkZW50aXR5RGV0YWlsc0NvbmZpZygpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG1wID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgICAgICBleHBlY3QodG1wLmxlbmd0aCkudG9FcXVhbCg1KTtcblxuICAgICAgICAgICAgdG1wID0gbnVsbDtcblxuICAgICAgICAgICAgY29uZmlnU2VydmljZS5nZXRJZGVudGl0eURldGFpbHNDb25maWcoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIERpZ2VzdCB0byBnZXQgdGhlIHByb21pc2UgcmVzb2x2ZWQuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICBleHBlY3QodG1wLmxlbmd0aCkudG9FcXVhbCg1KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29sdW1uIHByZWZlcmVuY2VzJywgKCkgPT4ge1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgeW91IHRyeSB0byByZWdpc3RlciB0YWJsZSBjb2x1bW4gcHJlZmVyZW5jZSB3aXRob3V0IGtleSBvciB2YWx1ZScsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uZmlnU2VydmljZS5yZWdpc3RlclRhYmxlQ29sdW1uUHJlZmVyZW5jZShudWxsLCBbXSk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG5cbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uZmlnU2VydmljZS5yZWdpc3RlclRhYmxlQ29sdW1uUHJlZmVyZW5jZSgna2V5JywgbnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgZmV0Y2ggdGFibGUgY29sdW1uIHByZWZlcmVuY2VzIGZyb20gY2FjaGUgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhYmxlSWQgPSAndGVzdFRhYmxlSWQnLFxuICAgICAgICAgICAgICAgIGNvbHVtblByZWZlcmVuY2VzID0gWydjb2wxJywgJ2NvbDInXTtcblxuICAgICAgICAgICAgY29uZmlnU2VydmljZS5yZWdpc3RlclRhYmxlQ29sdW1uUHJlZmVyZW5jZSh0YWJsZUlkLCBjb2x1bW5QcmVmZXJlbmNlcyk7XG5cbiAgICAgICAgICAgIHNweU9uKHRhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2UsICdnZXRUYWJsZUNvbHVtblByZWZlcmVuY2VzJyk7XG5cbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0VGFibGVDb2x1bW5QcmVmZXJlbmNlcyh0YWJsZUlkKS50aGVuKChjb2xQcmVmZXJlbmNlcykgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjb2xQcmVmZXJlbmNlcykudG9FcXVhbChjb2x1bW5QcmVmZXJlbmNlcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlQ29sdW1uUHJlZmVyZW5jZVNlcnZpY2UuZ2V0VGFibGVDb2x1bW5QcmVmZXJlbmNlcykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBnZXQgdGFibGUgY29sdW1uIHByZWZlcmVuY2VzIGZyb20gYmFja2VuZCB3aGVuIG5vdCBpbiBjYWNoZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0YWJsZUlkID0gJ3Rlc3RUYWJsZUlkJztcblxuICAgICAgICAgICAgc3B5T24odGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZSwgJ2dldFRhYmxlQ29sdW1uUHJlZmVyZW5jZXMnKTtcblxuICAgICAgICAgICAgY29uZmlnU2VydmljZS5nZXRUYWJsZUNvbHVtblByZWZlcmVuY2VzKHRhYmxlSWQpO1xuXG4gICAgICAgICAgICBleHBlY3QodGFibGVDb2x1bW5QcmVmZXJlbmNlU2VydmljZS5nZXRUYWJsZUNvbHVtblByZWZlcmVuY2VzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVGVzdCBnZXR0aW5nIGFsbCB0aGUgY29uZmlnIGVudHJpZXMuXG4gICAgICovXG4gICAgZGVzY3JpYmUoJ2dldENvbHVtbkNvbmZpZ0VudHJpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3VsZCByZXR1cm4gWCBtYW55IGVudHJpZXNcbiAgICAgICAgICovXG4gICAgICAgIGl0KCdyZXR1cm5zIGFsbCB0aGUgY29uZmlnIGVudHJpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0bXAsXG4gICAgICAgICAgICAgICAgY29uZmlnVXJsID0gY29udGV4dFBhdGggKyAnL3VpL3Jlc3QvY29uZmlndXJhdGlvbi91aWNvbmZpZy9lbnRyaWVzJztcblxuICAgICAgICAgICAgLy8gTW9jayB0aGUgcmVzcG9uc2UgZnJvbSBjb25maWdVcmwgYW5kIHJldHVybiBhbiBhcnJheSBvZiB0d28gZW50cmllc1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoY29uZmlnVXJsKS5yZXNwb25kKDIwMCwgZ2V0Q29uZmlnRW50cnkoWydrZXkxJywgJ2tleTInXSkpO1xuXG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlLmdldENvbHVtbkNvbmZpZ0VudHJpZXMoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcblxuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHRtcCkubGVuZ3RoKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkxKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkyKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkzKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybiBjb25maWcgZW50cnkgYnkga2V5cy4gdHdvIGdvb2Qga2V5cyB3aXRoIG9uZSBiYWQga2V5XG4gICAgICAgICAqL1xuICAgICAgICBpdCgncmV0dXJucyBjb25maWcgZW50cmllcyBieSBrZXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0bXAsXG4gICAgICAgICAgICAgICAgY29uZmlnVXJsID0gY29udGV4dFBhdGggKyAnL3VpL3Jlc3QvY29uZmlndXJhdGlvbi91aWNvbmZpZy9lbnRyaWVzP2tleT1rZXkxJmtleT1rZXkyJmtleT1rZXkzJztcblxuICAgICAgICAgICAgLy8gTW9jayB0aGUgcmVzcG9uc2UgZnJvbSBjb25maWdVcmwgYW5kIHJldHVybiBhbiBhcnJheSBvZiB0d28gZW50cmllc1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoY29uZmlnVXJsKS5yZXNwb25kKDIwMCwgZ2V0Q29uZmlnRW50cnkoWydrZXkxJywgJ2tleTInXSkpO1xuXG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlLmdldENvbHVtbkNvbmZpZ0VudHJpZXMoWydrZXkxJywgJ2tleTInLCAna2V5MyddKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcblxuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHRtcCkubGVuZ3RoKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkxKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkyKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkzKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybiBjb25maWcgZW50cnkgYnkga2V5cyBmcm9tIHRoZSBjYWNoZVxuICAgICAgICAgKi9cbiAgICAgICAgaXQoJ3JldHVybnMgY29uZmlnIGVudHJpZXMgZnJvbSBjYWNoZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRtcCxcbiAgICAgICAgICAgICAgICBjb25maWdVcmwgPSBjb250ZXh0UGF0aCArICcvdWkvcmVzdC9jb25maWd1cmF0aW9uL3VpY29uZmlnL2VudHJpZXM/a2V5PWtleTEma2V5PWtleTInO1xuXG4gICAgICAgICAgICAvLyBNb2NrIHRoZSByZXNwb25zZSBmcm9tIGNvbmZpZ1VybCBhbmQgcmV0dXJuIGFuIGFycmF5IG9mIHR3byBlbnRyaWVzXG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChjb25maWdVcmwpLnJlc3BvbmQoMjAwLCBnZXRDb25maWdFbnRyeShbJ2tleTEnLCAna2V5MiddKSk7XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IGNhbGwgd2lsbCBnZXQgdGhlIGVudHJ5IGZyb20gdGhlIFJFU1QgcmVzb3VyY2VcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0Q29sdW1uQ29uZmlnRW50cmllcyhbJ2tleTEnLCAna2V5MiddKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcblxuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKHRtcCkubGVuZ3RoKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkxKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkyKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkzKS5ub3QudG9CZURlZmluZWQoKTtcblxuICAgICAgICAgICAgdG1wID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gU2Vjb25kIGNhbGwgc2hvdWxkIGdldCBpdCBmcm9tIHRoZSBjYWNoZVxuICAgICAgICAgICAgY29uZmlnU2VydmljZS5nZXRDb2x1bW5Db25maWdFbnRyaWVzKFsna2V5MScsICdrZXkyJ10pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG1wID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRGlnZXN0IHRvIGdldCB0aGUgcHJvbWlzZSByZXNvbHZlZC5cbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyh0bXApLmxlbmd0aCkudG9CZSgyKTtcbiAgICAgICAgICAgIGV4cGVjdCh0bXAua2V5MSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0bXAua2V5MikudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0bXAua2V5Mykubm90LnRvQmVEZWZpbmVkKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuc3VyZSByZXR1cm5lZCBlbnRyaWVzIGFyZSBvZiBhcHByb3ByaWF0ZSB0eXBlXG4gICAgICAgICAqL1xuICAgICAgICBpdCgncmV0dXJucyBlbnRyaWVzIG9mIHR5cGUgQ29sdW1uQ29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdG1wLFxuICAgICAgICAgICAgICAgIGNvbmZpZ1VybCA9IGNvbnRleHRQYXRoICsgJy91aS9yZXN0L2NvbmZpZ3VyYXRpb24vdWljb25maWcvZW50cmllcz9rZXk9a2V5MSc7XG5cbiAgICAgICAgICAgIC8vIE1vY2sgdGhlIHJlc3BvbnNlIGZyb20gY29uZmlnVXJsIGFuZCByZXR1cm4gYW4gYXJyYXkgb2YgdHdvIGVudHJpZXNcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGNvbmZpZ1VybCkucmVzcG9uZCgyMDAsIGdldENvbmZpZ0VudHJ5KFsna2V5MSddKSk7XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IGNhbGwgd2lsbCBnZXQgdGhlIGVudHJ5IGZyb20gdGhlIFJFU1QgcmVzb3VyY2VcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0Q29sdW1uQ29uZmlnRW50cmllcyhbJ2tleTEnXSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0bXAgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyh0bXApLmxlbmd0aCkudG9CZSgxKTtcblxuICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkxWzBdLmdldERhdGFJbmRleCgpKS50b0JlKCdmb28nKTtcbiAgICAgICAgICAgIGV4cGVjdCh0bXAua2V5MVswXS5nZXRMYWJlbCgpKS50b0JlKCdGb28gQmFyJyk7XG4gICAgICAgICAgICBleHBlY3QodG1wLmtleTFbMF0uaXNGaWVsZE9ubHkoKSkudG9CZShmYWxzZSk7XG5cbiAgICAgICAgICAgIGV4cGVjdCh0bXAua2V5Mikubm90LnRvQmVEZWZpbmVkKCk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29uZmlnIHZhbHVlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gU2V0dXAgdGhlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFNhaWxQb2ludC5jb25maWdEYXRhW2NvbmZpZ1NlcnZpY2VDb25zdC5BQ0NFU1NfUkVRVUVTVF9NQVhfSURFTlRJVFlfU0VMRUNUXSA9IDI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyBpZiByZWdpc3RlcmluZyBhIHZhbHVlIHdpdGggbm8ga2V5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGNvbmZpZ1NlcnZpY2UucmVnaXN0ZXJDb25maWdWYWx1ZShudWxsLCAnYm9vbScpOyB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGEgdmFsdWUgaWYgaXQgaGFzIGJlZW4gcmVnaXN0ZXJlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGtleSA9ICdnZWRkeScsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnbGVlJztcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2UucmVnaXN0ZXJDb25maWdWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlLmdldENvbmZpZ1ZhbHVlKGtleSkpLnRvRXF1YWwodmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHJlZmVycyByZWdpc3RlcmVkIHZhbHVlcyBhYm92ZSBTYWlsUG9pbnQuY29uZmlnRGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGNvbmZpZ1NlcnZpY2VDb25zdC5BQ0NFU1NfUkVRVUVTVF9NQVhfSURFTlRJVFlfU0VMRUNULFxuICAgICAgICAgICAgICAgIHZhbHVlID0gOTk7XG4gICAgICAgICAgICBjb25maWdTZXJ2aWNlLnJlZ2lzdGVyQ29uZmlnVmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICBleHBlY3QoY29uZmlnU2VydmljZS5nZXRDb25maWdWYWx1ZShrZXkpKS50b0VxdWFsKHZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgYSB2YWx1ZSBpZiBpdCBpcyBkZWZpbmVkIGluIFNhaWxQb2ludC5jb25maWdEYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoY29uZmlnU2VydmljZS5nZXRDb25maWdWYWx1ZShjb25maWdTZXJ2aWNlQ29uc3QuQUNDRVNTX1JFUVVFU1RfTUFYX0lERU5USVRZX1NFTEVDVCkpLnRvQmUoMik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIG51bGwgaWYgaXQgaXMgbm90IGRlZmluZWQgaW4gU2FpbFBvaW50LmNvbmZpZ0RhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChjb25maWdTZXJ2aWNlLmdldENvbmZpZ1ZhbHVlKCdCTEFIQkxBSEJMQUgnKSkudG9CZU51bGwoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29sdW1uIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29sQ2ZnQXJyYXk7XG5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbENmZ0FycmF5ID0gW3tcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICcxMjM0NSdcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgaWYgcmVnaXN0ZXJpbmcgd2l0aCBudWxsIGtleScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjb25maWdTZXJ2aWNlLnJlZ2lzdGVyQ29sdW1uQ29uZmlnKG51bGwsIGNvbENmZ0FycmF5KTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgaWYgcmVnaXN0ZXJpbmcgd2l0aCBudWxsIGNvbHVtbiBjb25maWcgYXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgY29uZmlnU2VydmljZS5yZWdpc3RlckNvbHVtbkNvbmZpZygna2V5JywgbnVsbCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIGlmIHJlZ2lzdGVyaW5nIHdpdGggYSBub24tYXJyYXkgY29sdW1uIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBjb25maWdTZXJ2aWNlLnJlZ2lzdGVyQ29sdW1uQ29uZmlnKCdrZXknLCAnbm90IGFuIGFycmF5Jyk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdW5kZWZpbmVkIGZyb20gZ2V0Q29sdW1uQ29uZmlnKCkgZm9yIGFuIHVucmVnaXN0ZXJlZCBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjZmcgPSBjb25maWdTZXJ2aWNlLmdldENvbHVtbkNvbmZpZygnbm90IHRoZXJlJyk7XG4gICAgICAgICAgICBleHBlY3QoY2ZnKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZWdpc3RlcnMgYSBjb2x1bW4gY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gJ2tleScsXG4gICAgICAgICAgICAgICAgY2ZnO1xuICAgICAgICAgICAgY29uZmlnU2VydmljZS5yZWdpc3RlckNvbHVtbkNvbmZpZyhrZXksIGNvbENmZ0FycmF5KTtcbiAgICAgICAgICAgIGNmZyA9IGNvbmZpZ1NlcnZpY2UuZ2V0Q29sdW1uQ29uZmlnKGtleSk7XG4gICAgICAgICAgICBleHBlY3QoY2ZnKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgIGV4cGVjdChjZmcubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGNmZ1swXSBpbnN0YW5jZW9mIENvbHVtbkNvbmZpZykudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChjZmdbMF0uZGF0YUluZGV4KS50b0VxdWFsKGNvbENmZ0FycmF5WzBdLmRhdGFJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2lzTW9iaWxlKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGFwcHJvcHJpYXRlIGNvbmZpZyB2YWx1ZSBmb3IgdGhlIGlzTW9iaWxlIGtleScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU2FpbFBvaW50LmNvbmZpZ0RhdGFbY29uZmlnU2VydmljZUNvbnN0LklTX01PQklMRV0gPSB0cnVlO1xuICAgICAgICAgICAgZXhwZWN0KGNvbmZpZ1NlcnZpY2UuaXNNb2JpbGUoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIFNhaWxQb2ludC5jb25maWdEYXRhW2NvbmZpZ1NlcnZpY2VDb25zdC5JU19NT0JJTEVdID0gZmFsc2U7XG4gICAgICAgICAgICBleHBlY3QoY29uZmlnU2VydmljZS5pc01vYmlsZSgpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
