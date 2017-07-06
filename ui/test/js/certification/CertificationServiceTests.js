System.register(['test/js/TestInitializer', 'certification/CertificationModule', './CertificationTestData', 'test/js/TestModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule, testModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }, function (_CertificationTestData) {}, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }],
        execute: function () {

            describe('CertificationService', function () {

                // Use the module.
                beforeEach(module(certificationModule, testModule));

                beforeEach(module(function ($provide) {
                    $provide.constant('SP_CONTEXT_PATH', '/identityiq');
                }));

                var baseURLNoSlash = '/identityiq/ui/rest/certifications',
                    baseURL = baseURLNoSlash + '/',
                    certificationService,
                    certificationTestData,
                    http,
                    SortOrder,
                    CertificationItem,
                    Certification,
                    ObjectResultDTO,
                    RemediationAdviceResult,
                    RemediationSummary,
                    Filter,
                    testService,
                    RoleDetail,
                    EmailTemplate,
                    CertificationTableScope,
                    ApplicationAccount,
                    managedAttributeService;

                /* jshint maxparams: 16 */
                beforeEach(inject(function (_$httpBackend_, _certificationService_, _certificationTestData_, _SortOrder_, _CertificationItem_, _Certification_, _ObjectResultDTO_, _RemediationAdviceResult_, _RemediationSummary_, _Filter_, _testService_, _RoleDetail_, _EmailTemplate_, _CertificationTableScope_, _ApplicationAccount_, _managedAttributeService_) {
                    http = _$httpBackend_;
                    certificationService = _certificationService_;
                    certificationTestData = _certificationTestData_;
                    SortOrder = _SortOrder_;
                    CertificationItem = _CertificationItem_;
                    Certification = _Certification_;
                    ObjectResultDTO = _ObjectResultDTO_;
                    RemediationAdviceResult = _RemediationAdviceResult_;
                    RemediationSummary = _RemediationSummary_;
                    Filter = _Filter_;
                    testService = _testService_;
                    RoleDetail = _RoleDetail_;
                    EmailTemplate = _EmailTemplate_;
                    CertificationTableScope = _CertificationTableScope_;
                    ApplicationAccount = _ApplicationAccount_;
                    managedAttributeService = _managedAttributeService_;
                }));

                afterEach(function () {
                    http.verifyNoOutstandingExpectation();
                    http.verifyNoOutstandingRequest();
                });

                describe('getCertification()', function () {
                    it('should retrieve certification data from REST', function () {
                        var id = '1234',
                            promise = undefined;
                        http.expectGET(baseURL + id).respond(200, { object: certificationTestData.CERTIFICATION_1 });
                        promise = certificationService.getCertification(id);
                        http.flush();
                        promise.then(function (response) {
                            // Ensure the response was transformed correctly.
                            expect(response.getObject() instanceof Certification).toEqual(true);
                        });
                    });

                    it('should throw an exception when no id is passed', function () {
                        expect(function () {
                            certificationService.getCertification();
                        }).toThrow();
                    });
                });

                describe('getCertification()', function () {
                    it('should retrieve the certifications for the user from REST', function () {
                        var start = 10,
                            limit = 12,
                            promise = undefined;
                        http.expectGET(baseURLNoSlash + '?limit=12&start=10').respond(200, certificationTestData.LIST_RESULT_CERT_1);
                        promise = certificationService.getCertifications(start, limit);
                        http.flush();
                        promise.then(function (response) {
                            // Ensure the response was transformed correctly.
                            expect(response.data.constructor.name).toBe('ListResultDTO');
                            expect(response.data.objects[0].constructor.name).toBe('Certification');
                        });
                    });
                });

                describe('getSubCertifications()', function () {
                    it('should retrieve sub-certification data from REST', function () {
                        var id = '1234',
                            start = 10,
                            limit = 5,
                            promise = undefined;
                        http.expectGET(baseURL + id + '/subCertifications?limit=5&sort=%5B%5D&start=10').respond(200, certificationTestData.LIST_RESULT_CERT_1);
                        promise = certificationService.getSubCertifications(id, start, limit, new SortOrder());
                        http.flush();
                        promise.then(function (response) {
                            // Ensure the response was transformed correctly.
                            expect(response.data.constructor.name).toBe('ListResultDTO');
                            expect(response.data.objects[0].constructor.name).toBe('Certification');
                        });
                    });

                    it('should retrieve sub-certification data from REST when null sort', function () {
                        var id = '1234',
                            start = 1,
                            limit = 5;
                        http.expectGET(baseURL + id + '/subCertifications?limit=5&start=1').respond(200, certificationTestData.LIST_RESULT_CERT_1);
                        certificationService.getSubCertifications(id, start, limit, null);
                        http.flush();
                    });

                    it('should default to appropriate start and limit values with null params', function () {
                        var id = '1234';
                        http.expectGET(baseURL + id + '/subCertifications?limit=' + certificationService.defaultLimit + '&start=' + certificationService.defaultStart).respond(200, certificationTestData.LIST_RESULT_CERT_1);
                        certificationService.getSubCertifications(id, null, null, null);
                        http.flush();
                    });

                    it('should throw an exception when no id is passed', function () {
                        expect(function () {
                            certificationService.getSubCertifications();
                        }).toThrow();
                    });
                });

                describe('getCertificationItems()', function () {
                    var certificationItemTestData = undefined;

                    beforeEach(function () {
                        certificationItemTestData = {
                            count: certificationTestData.CERT_ITEMS.length,
                            objects: certificationTestData.CERT_ITEMS
                        };
                    });

                    it('should return certification items data', function () {
                        var id = '12345678',
                            start = 0,
                            limit = 5,
                            groupBy = 'blah',
                            promise;
                        http.expectGET(baseURL + id + '/items?groupBy=blah&limit=5&sort=%5B%5D&start=0').respond(200, certificationItemTestData);
                        promise = certificationService.getCertificationItems(id, null, start, limit, new SortOrder(), groupBy);
                        http.flush();
                        promise.then(function (response) {
                            expect(response.data.getObjects().length).toEqual(certificationItemTestData.count);
                            expect(response.data.objects[0] instanceof CertificationItem).toEqual(true);
                        });
                    });

                    it('should retrieve certification items data from REST when sort is null', function () {
                        var id = '12345678',
                            start = 0,
                            limit = 5,
                            promise;
                        http.expectGET(baseURL + id + '/items?limit=5&start=0').respond(200, certificationItemTestData);

                        promise = certificationService.getCertificationItems(id, null, start, limit, null);
                        http.flush();
                        promise.then(function (response) {
                            expect(response.data.getObjects().length).toEqual(certificationItemTestData.count);
                            expect(response.data.objects[0] instanceof CertificationItem).toEqual(true);
                        });
                    });

                    it('should add query params from tableScope when defined', function () {
                        var id = '12345678',
                            start = 0,
                            limit = 5,
                            tableScope = new CertificationTableScope({
                            statuses: ['Open', 'Complete'],
                            includedTypes: ['Exception', 'PolicyViolation'],
                            excludedTypes: ['Exception', 'PolicyViolation']
                        });
                        spyOn(tableScope, 'addQueryParameters').and.callThrough();
                        http.expectGET(baseURL + id + '/items?excludedType=Exception&excludedType=PolicyViolation&' + 'includedType=Exception&includedType=PolicyViolation&limit=5&start=0&summaryStatus=Open&' + 'summaryStatus=Complete').respond(200, certificationItemTestData);

                        certificationService.getCertificationItems(id, tableScope, start, limit);
                        expect(tableScope.addQueryParameters).toHaveBeenCalled();
                        http.flush();
                    });

                    it('should add filter values when defined', function () {
                        var id = '12345678',
                            start = 0,
                            limit = 5,
                            filters = {
                            displayName: {
                                value: 'testName'
                            }
                        },
                            expectedUrl = baseURL + id + ('/items?displayName=' + testService.getQueryParamString(filters.displayName) + '&limit=5&start=0');
                        http.expectGET(expectedUrl).respond(200, certificationItemTestData);

                        certificationService.getCertificationItems(id, null, start, limit, null, null, null, filters);
                        http.flush();
                    });

                    it('should call entity endpoint for items if entityId is specified', function () {
                        var id = '12345678',
                            start = 0,
                            limit = 5,
                            tableScope = new CertificationTableScope({
                            entity: {
                                id: 'princess'
                            }
                        }),
                            expectedUrl = '' + baseURL + id + '/entities/' + tableScope.entity.id + '/items?limit=5&start=0';

                        http.expectGET(expectedUrl).respond(200, certificationItemTestData);

                        certificationService.getCertificationItems(id, tableScope, start, limit);
                        http.flush();
                    });

                    it('should covert additionalEntitlement filter to JSON string', function () {
                        var id = '12345678',
                            start = 0,
                            limit = 5,
                            filters = {
                            app: {
                                value: {
                                    name: 'name',
                                    value: 'value',
                                    isPermission: false,
                                    additionalEntitlement: true
                                }
                            }
                        },

                        // Spell this out since we don't have any good method to get the encoding right with some encoded
                        // commas and some not, etc.
                        encodedApp = '%7B%22value%22:%22%7B%5C%22name%5C%22:%5C%22name%5C%22,' + '%5C%22value%5C%22:%5C%22value%5C%22,%5C%22isPermission%5C%22:false,' + '%5C%22additionalEntitlement%5C%22:true%7D%22%7D',
                            expectedUrl = baseURL + id + ('/items?app=' + encodedApp + '&limit=5&start=0');

                        http.expectGET(expectedUrl).respond(200, certificationItemTestData);
                        certificationService.getCertificationItems(id, null, start, limit, null, null, null, filters);
                        http.flush();
                    });
                });

                describe('getRevocationItems()', function () {
                    it('should retrieve revocation data from REST', function () {
                        var id = '1234',
                            start = 10,
                            limit = 5,
                            promise = undefined;
                        http.expectGET(baseURL + id + '/revocations?limit=5&sort=%5B%5D&start=10').respond(200, certificationTestData.LIST_RESULT_REVOCATION_ITEMS);
                        promise = certificationService.getRevocationItems(id, start, limit, new SortOrder());
                        http.flush();
                        promise.then(function (response) {
                            // Ensure the response was transformed correctly.
                            expect(response.data.constructor.name).toBe('ListResultDTO');
                            expect(response.data.objects[0].constructor.name).toBe('CertificationRevocation');
                        });
                    });

                    it('should retrieve revocation data from REST when null sort', function () {
                        var id = '1234',
                            start = 1,
                            limit = 5;
                        http.expectGET(baseURL + id + '/revocations?limit=5&start=1').respond(200, certificationTestData.LIST_RESULT_REVOCATION_ITEMS);
                        certificationService.getRevocationItems(id, start, limit, null);
                        http.flush();
                    });

                    it('should default to appropriate start and limit values with null params', function () {
                        var id = '1234';
                        http.expectGET(baseURL + id + '/revocations?limit=' + certificationService.defaultLimit + '&start=' + certificationService.defaultStart).respond(200, certificationTestData.LIST_RESULT_REVOCATION_ITEMS);
                        certificationService.getRevocationItems(id, null, null, null);
                        http.flush();
                    });

                    it('should throw an exception when no id is passed', function () {
                        expect(function () {
                            certificationService.getRevocationItems(null, null, null, null);
                        }).toThrow();
                    });
                });

                describe('saveDecisions()', function () {
                    var filterValueService = undefined;

                    function createDecision(decision) {
                        //Fudge a clone that just returns the decision
                        decision.clone = function () {
                            return decision;
                        };
                        return decision;
                    }

                    beforeEach(inject(function (_filterValueService_) {
                        filterValueService = _filterValueService_;
                    }));

                    it('should post decisions to server', function () {
                        var id = '12345678',
                            decisions = [createDecision({
                            some: 'thing'
                        }), createDecision({
                            some: 'stuff'
                        })];
                        http.expectPOST(baseURL + id + '/decisions', {
                            decisions: decisions
                        }).respond(200, { data: {} });
                        certificationService.saveDecisions(id, decisions);
                        http.flush();
                    });

                    it('should convert selectedViolationEntitlements to JSON string', function () {
                        var id = '12345678',
                            decisions = [createDecision({
                            selectedViolationEntitlements: [{
                                some: 'thing'
                            }]
                        }), createDecision({
                            some: 'stuff'
                        })],
                            expectedDecisions = angular.copy(decisions);
                        expectedDecisions[0].selectedViolationEntitlements = angular.toJson(expectedDecisions[0].selectedViolationEntitlements);
                        http.expectPOST(baseURL + id + '/decisions', {
                            decisions: expectedDecisions
                        }).respond(200, { data: {} });
                        certificationService.saveDecisions(id, decisions);
                        http.flush();
                    });

                    it('should delete certificationItem from decision before posting', function () {
                        var id = '12345678',
                            decisions = [createDecision({
                            certificationItem: {
                                id: 'dfafadsfa'
                            },
                            certificationItemId: 'dfafadsfa'
                        })],
                            expectedDecisions = angular.copy(decisions);
                        delete expectedDecisions[0].certificationItem;
                        http.expectPOST(baseURL + id + '/decisions', {
                            decisions: expectedDecisions
                        }).respond(200, { data: {} });
                        certificationService.saveDecisions(id, decisions);
                        http.flush();
                    });

                    it('should call through to convert params to what the server expects if there are filter values', function () {
                        var id = '12345678',
                            decisions = [createDecision({
                            selectionModel: {
                                filterValues: {
                                    somebody: {
                                        value: {
                                            id: 'iusedtoknow',
                                            displayName: 'somebody'
                                        }
                                    }
                                }
                            },
                            status: 'Approved'
                        })],
                            expectedDecisions = angular.copy(decisions);
                        expectedDecisions[0].selectionModel.filterValues.somebody.value = 'iusedtoknow';
                        spyOn(filterValueService, 'getQueryParams').and.callThrough();
                        http.expectPOST(baseURL + id + '/decisions', {
                            decisions: expectedDecisions
                        }).respond(200, { data: {} });
                        certificationService.saveDecisions(id, decisions);
                        http.flush();
                        expect(filterValueService.getQueryParams).toHaveBeenCalled();
                    });

                    it('should convert SelectionModelGroups on selection model to simple SelectionModel objects', function () {
                        var id = '12345678',
                            filterValues = {
                            value: {
                                some: 'thing'
                            }
                        },
                            selectionModelGroup = {
                            filterValues: filterValues
                        },
                            decisions = [createDecision({
                            selectionModel: {
                                getCompleteGroupSelectionModels: jasmine.createSpy('getCompleteGroupSelectionModels').and.returnValue([selectionModelGroup]),
                                groups: [{}]
                            },
                            status: 'Approved'
                        })],
                            expectedDecisions = angular.copy(decisions);
                        selectionModelGroup.clone = function () {
                            return selectionModelGroup;
                        };
                        expectedDecisions[0].selectionModel.groups = [selectionModelGroup];
                        spyOn(filterValueService, 'getQueryParams').and.callThrough();
                        http.expectPOST(baseURL + id + '/decisions', {
                            decisions: expectedDecisions
                        }).respond(200, { data: {} });
                        certificationService.saveDecisions(id, decisions);
                        http.flush();
                        expect(decisions[0].selectionModel.getCompleteGroupSelectionModels).toHaveBeenCalled();
                        expect(filterValueService.getQueryParams).toHaveBeenCalledWith(filterValues, null, true);
                    });

                    it('should convert result to ObjectResultDTO with Certification object', function () {
                        var id = '12345678',
                            decisions = [createDecision({
                            some: 'thing'
                        }), createDecision({
                            some: 'stuff'
                        })],
                            result = {
                            object: certificationTestData.CERTIFICATION_1
                        },
                            promise;

                        http.expectPOST(baseURL + id + '/decisions', {
                            decisions: decisions
                        }).respond(200, result);
                        promise = certificationService.saveDecisions(id, decisions);
                        http.flush();
                        promise.then(function (response) {
                            expect(response.data instanceof ObjectResultDTO).toEqual(true);
                            expect(response.data.getObject() instanceof Certification).toEqual(true);
                        });
                    });
                });

                describe('signOff()', function () {

                    it('should signoff the certification when no credentials passed in', function () {
                        var id = '12345678';

                        http.expectPOST(baseURL + id + '/sign').respond(200, '');
                        certificationService.signOff(id);
                        http.flush();
                    });

                    it('should signoff the certification when credentials passed in for esig', function () {
                        var id = '12345678',
                            username = 'user1',
                            password = 'xyzzy',
                            credentials = {
                            signatureAccountId: username,
                            signaturePassword: password
                        };

                        http.expectPOST(baseURL + id + '/sign', credentials).respond(200, '');
                        certificationService.signOff(id, username, password);
                        http.flush();
                    });
                });

                describe('getViolationRemediationAdvice()', function () {
                    it('should return RemediationAdviceResult', function () {
                        var certId = 'cert1',
                            itemId = 'item1',
                            promise = undefined;

                        http.expectGET('' + baseURL + certId + '/items/' + itemId + '/remediationAdvice').respond(200, certificationTestData.REMEDIATION_ADVICE_RESULT);
                        promise = certificationService.getViolationRemediationAdvice(certId, itemId);
                        http.flush();
                        promise.then(function (adviceResult) {
                            expect(adviceResult instanceof RemediationAdviceResult).toEqual(true);
                        });
                    });

                    it('should throw if response data not correct', function () {
                        var certId = 'cert1',
                            itemId = 'item1',
                            responseData = null,
                            rejectPromise = undefined;

                        http.expectGET('' + baseURL + certId + '/items/' + itemId + '/remediationAdvice').respond(200, responseData);
                        certificationService.getViolationRemediationAdvice(certId, itemId)['catch'](function () {
                            return rejectPromise = true;
                        });
                        http.flush();
                        expect(rejectPromise).toBeTruthy();
                    });
                });

                describe('getDelegationDescription()', function () {
                    it('should throw if response data not correct', function () {
                        var certId = 'cert1',
                            itemId = 'item1',
                            responseData = null,
                            rejectPromise = undefined;

                        http.expectGET('' + baseURL + certId + '/items/' + itemId + '/delegationDescription').respond(200, responseData);

                        certificationService.getDelegationDescription(certId, itemId)['catch'](function () {
                            return rejectPromise = true;
                        });
                        http.flush();
                        expect(rejectPromise).toBeTruthy();
                    });
                });

                describe('getRemediationSummary()', function () {
                    it('should return RemediationSummary for revoked roles', function () {
                        var certId = 'cert1',
                            itemId = 'item1',
                            input = {
                            revokedRoles: ['role1', 'role2']
                        },
                            promise = undefined;

                        http.expectPOST('' + baseURL + certId + '/items/' + itemId + '/remediationSummary', input).respond(200, certificationTestData.REMEDIATION_ADVICE_RESULT.summary);
                        promise = certificationService.getRemediationSummary(certId, itemId, input.revokedRoles, undefined);
                        http.flush();
                        promise.then(function (summary) {
                            expect(summary instanceof RemediationSummary).toEqual(true);
                        });
                    });

                    it('should return RemediationSummary for selected violation entitlements', function () {
                        var certId = 'cert1',
                            itemId = 'item1',
                            input = {
                            selectedViolationEntitlements: angular.toJson(certificationTestData.POLICY_TREE_NODE)
                        },
                            promise = undefined;

                        http.expectPOST('' + baseURL + certId + '/items/' + itemId + '/remediationSummary', input).respond(200, certificationTestData.REMEDIATION_ADVICE_RESULT.summary);
                        promise = certificationService.getRemediationSummary(certId, itemId, undefined, certificationTestData.POLICY_TREE_NODE);
                        http.flush();
                        promise.then(function (summary) {
                            expect(summary instanceof RemediationSummary).toEqual(true);
                        });
                    });

                    it('should throw if response data not correct', function () {
                        var certId = 'cert1',
                            itemId = 'item1',
                            input = {
                            revokedRoles: ['role1', 'role2']
                        },
                            responseData = null,
                            rejectPromise = undefined;

                        http.expectPOST('' + baseURL + certId + '/items/' + itemId + '/remediationSummary', input).respond(200, responseData);
                        certificationService.getRemediationSummary(certId, itemId, input.revokedRoles)['catch'](function () {
                            return rejectPromise = true;
                        });
                        http.flush();
                        expect(rejectPromise).toBeTruthy();
                    });
                });

                describe('getFilters()', function () {
                    var filter = {
                        property: 'manager',
                        multiValued: false,
                        label: 'Manager',
                        dataType: 'SomeType',
                        allowedValues: null,
                        attributes: {}
                    },
                        filters = [];

                    it('should return an array of filters', function () {
                        var certId = 'cert1',
                            promise = undefined;

                        filters = [new Filter(filter)];
                        http.expectGET('' + baseURL + certId + '/items/filters').respond(200, [filter]);
                        promise = certificationService.getFilters(certId);
                        http.flush();
                        promise.then(function (filtersData) {
                            expect(filtersData.length).toEqual(1);
                            expect(filtersData).toEqual(filters);
                        });
                    });
                });

                describe('getRoleDetails()', function () {
                    it('dies with no cert id', function () {
                        expect(function () {
                            return certificationService.getRoleDetails(null, 'itemid');
                        }).toThrow();
                    });

                    it('dies with no cert item id', function () {
                        expect(function () {
                            return certificationService.getRoleDetails('certId', null);
                        }).toThrow();
                    });

                    it('returns the role details', function () {
                        var certId = 'certId',
                            certItemId = 'certItemId',
                            role = undefined;

                        http.expectGET('' + baseURL + certId + '/items/' + certItemId + '/roleDetails').respond(200, {});

                        certificationService.getRoleDetails(certId, certItemId).then(function (returnedRole) {
                            role = returnedRole;
                        });

                        http.flush();

                        expect(role).toBeDefined();
                        expect(role instanceof RoleDetail).toEqual(true);
                    });
                });

                describe('getRoleHierarchy()', function () {
                    it('dies with no cert id', function () {
                        expect(function () {
                            return certificationService.getRoleHierarchy(null, 'itemid', 'roleId');
                        }).toThrow();
                    });

                    it('dies with no cert item id', function () {
                        expect(function () {
                            return certificationService.getRoleHierarchy('certId', null, 'roleId');
                        }).toThrow();
                    });

                    it('dies with no role id', function () {
                        expect(function () {
                            return certificationService.getRoleHierarchy('certId', 'itemId', null);
                        }).toThrow();
                    });

                    it('returns the role details', function () {
                        var certId = 'certId',
                            certItemId = 'certItemId',
                            roleId = 'roleId',
                            hierarchy = undefined;

                        http.expectGET('' + baseURL + certId + '/items/' + certItemId + '/roleDetails/' + roleId + '/hierarchy').respond(200, [{ id: 'role1' }, { id: 'role2' }]);

                        certificationService.getRoleHierarchy(certId, certItemId, roleId).then(function (returnedHierarchy) {
                            hierarchy = returnedHierarchy;
                        });

                        http.flush();

                        expect(hierarchy).toBeDefined();
                        expect(angular.isArray(hierarchy)).toEqual(true);
                        expect(hierarchy.length).toEqual(2);
                        expect(hierarchy[0] instanceof RoleDetail).toEqual(true);
                        expect(hierarchy[1] instanceof RoleDetail).toEqual(true);
                    });
                });

                describe('getCertificationReminderEmailTemplate()', function () {
                    var templateData = {
                        toIdentity: {
                            id: '1234',
                            name: 'Gilligan'
                        }
                    };

                    it('should return an EmailTemplate', function () {
                        var certId = 'cert1',
                            promise = undefined;

                        http.expectGET('' + baseURL + certId + '/email/reminder').respond(200, templateData);
                        promise = certificationService.getCertificationReminderEmailTemplate(certId);
                        http.flush();

                        promise.then(function (template) {
                            expect(template).toBeDefined();
                            expect(template instanceof EmailTemplate).toEqual(true);
                        });
                    });
                });

                describe('sendCertificationReminderEmail()', function () {
                    var templateData = {
                        toIdentity: {
                            id: '1234',
                            name: 'Gilligan'
                        }
                    };

                    it('should call resource', function () {
                        var certId = 'cert1',
                            input = {
                            emailTemplate: templateData
                        },
                            promise = undefined;

                        http.expectPOST('' + baseURL + certId + '/email/reminder/send', input).respond(200, null);

                        promise = certificationService.sendCertificationReminderEmail(certId, templateData);
                        http.flush();

                        promise.then(function (response) {
                            expect(response).toBeDefined();
                            expect(response.status).toBe(200);
                        });
                    });
                });

                describe('rescindCertification', function () {
                    it('should call resource', function () {
                        var promise = undefined,
                            certId = 'cert1';
                        http.expectPOST('' + baseURL + certId + '/rescind', null).respond(200, null);

                        promise = certificationService.rescindCertification(certId);
                        http.flush();

                        promise.then(function (response) {
                            expect(response).toBeDefined();
                            expect(response.status).toBe(200);
                        });
                    });
                });

                describe('getAccountDetails()', function () {
                    it('dies with no cert id', function () {
                        expect(function () {
                            return certificationService.getAccountDetails(null, 'itemid');
                        }).toThrow();
                    });

                    it('dies with no cert item id', function () {
                        expect(function () {
                            return certificationService.getAccountDetails('certId', null);
                        }).toThrow();
                    });

                    it('returns the application account details', function () {
                        var certId = 'certId',
                            certItemId = 'certItemId',
                            applicationAccount = undefined;

                        http.expectGET('' + baseURL + certId + '/items/' + certItemId + '/accountDetails').respond(200, {});

                        certificationService.getAccountDetails(certId, certItemId).then(function (returnedAccount) {
                            applicationAccount = returnedAccount;
                        });

                        http.flush();

                        expect(applicationAccount).toBeDefined();
                        expect(applicationAccount instanceof ApplicationAccount).toEqual(true);
                    });
                });

                describe('getEntitlementDetailsUrl()', function () {
                    it('throws with no cert id', function () {
                        expect(function () {
                            return certificationService.getEntitlementDetailsUrl(null, 'itemid');
                        }).toThrow();
                    });

                    it('throws with no cert item id', function () {
                        expect(function () {
                            return certificationService.getEntitlementDetailsUrl('certId', null);
                        }).toThrow();
                    });

                    it('returns the url to the managed attribute details resource', function () {
                        var certId = '1234',
                            certItemId = '5678',
                            url = '' + baseURL + certId + '/items/' + certItemId + '/managedAttributeDetails';
                        expect(certificationService.getEntitlementDetailsUrl(certId, certItemId)).toEqual(url);
                    });
                });

                describe('forwardCertification()', function () {
                    var workItemService = undefined;

                    beforeEach(inject(function (_workItemService_) {
                        workItemService = _workItemService_;
                    }));

                    it('throws with no certification', function () {
                        expect(function () {
                            return certificationService.forwardCertification(null, function () {});
                        }).toThrow();
                    });

                    it('throws with no callback function', function () {
                        expect(function () {
                            return certificationService.forwardCertification({}, null);
                        }).toThrow();
                    });

                    it('calls workItemService showForwardDialog to forward', function () {
                        var workItemId = 'workItem1234',
                            cert = {
                            workItemId: workItemId
                        },
                            callbackFn = function () {
                            return true;
                        };
                        spyOn(workItemService, 'showForwardDialog');
                        certificationService.forwardCertification(cert, callbackFn);
                        expect(workItemService.showForwardDialog).toHaveBeenCalled();
                        var args = workItemService.showForwardDialog.calls.mostRecent().args;
                        expect(args[0]).toEqual(cert.workItemId);
                        expect(args[1]).toEqual(callbackFn);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvblNlcnZpY2VUZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsQ0FBQywyQkFBMkIscUNBQXFDLDJCQUEyQix1QkFBdUIsVUFBVSxTQUFTOzs7SUFHbEo7O0lBRUEsSUFBSSxxQkFBcUI7SUFDekIsT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1CQUFtQjtZQUNsRSxhQUFhLGtCQUFrQjs7UUFFbkMsU0FBUyxZQUFZOztZQUw3QixTQUFTLHdCQUF3QixZQUFXOzs7Z0JBR3hDLFdBQVcsT0FBTyxxQkFBcUI7O2dCQUV2QyxXQUFXLE9BQU8sVUFBUyxVQUFVO29CQUNqQyxTQUFTLFNBQVMsbUJBQW1COzs7Z0JBR3pDLElBQUksaUJBQWlCO29CQUFzQyxVQUFVLGlCQUFpQjtvQkFDbEY7b0JBQXNCO29CQUF1QjtvQkFBTTtvQkFBVztvQkFBbUI7b0JBQ2pGO29CQUFpQjtvQkFBeUI7b0JBQW9CO29CQUFRO29CQUFhO29CQUFZO29CQUMvRjtvQkFBeUI7b0JBQW9COzs7Z0JBR2pELFdBQVcsT0FBTyxVQUFTLGdCQUFnQix3QkFBd0IseUJBQXlCLGFBQ2pFLHFCQUFxQixpQkFBaUIsbUJBQW1CLDJCQUN6RCxzQkFBc0IsVUFBVSxlQUFlLGNBQWMsaUJBQzdELDJCQUEyQixzQkFBc0IsMkJBQTJCO29CQUNuRyxPQUFPO29CQUNQLHVCQUF1QjtvQkFDdkIsd0JBQXdCO29CQUN4QixZQUFZO29CQUNaLG9CQUFvQjtvQkFDcEIsZ0JBQWdCO29CQUNoQixrQkFBa0I7b0JBQ2xCLDBCQUEwQjtvQkFDMUIscUJBQXFCO29CQUNyQixTQUFTO29CQUNULGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixnQkFBZ0I7b0JBQ2hCLDBCQUEwQjtvQkFDMUIscUJBQXFCO29CQUNy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QUFTLDhCQUE4QixZQUFNO29CQUN6QyxHQUFHLDBCQUEwQixZQUFNO3dCQUMvQixPQUFPLFlBQUE7NEJBT1MsT0FQSCxxQkFBcUIseUJBQXlCLE1BQU07MkJBQVc7OztvQkFHaEYsR0FBRywrQkFBK0IsWUFBTTt3QkFDcEMsT0FBTyxZQUFBOzRCQVNTLE9BVEgscUJBQXFCLHlCQUF5QixVQUFVOzJCQUFPOzs7b0JBR2hGLEdBQUcsNkRBQTZELFlBQU07d0JBQ2xFLElBQUksU0FBUzs0QkFDVCxhQUFhOzRCQUNiLE1BQUcsS0FBTSxVQUFVLFNBQU0sWUFBVSxhQUFVO3dCQUNqRCxPQUFPLHFCQUFxQix5QkFBeUIsUUFBUSxhQUFhLFFBQVE7Ozs7Z0JBSTFGLFNBQVMsMEJBQTBCLFlBQU07b0JBQ3JDLElBQUksa0JBQWU7O29CQUVuQixXQUFXLE9BQU8sVUFBQyxtQkFBc0I7d0JBQ3JDLGtCQUFrQjs7O29CQUd0QixHQUFHLGdDQUFnQyxZQUFNO3dCQUNyQyxPQUFPLFlBQUE7NEJBV1MsT0FYSCxxQkFBcUIscUJBQXFCLE1BQU0sWUFBTTsyQkFBSzs7O29CQUc1RSxHQUFHLG9DQUFvQyxZQUFNO3dCQUN6QyxPQUFPLFlBQUE7NEJBYVMsT0FiSCxxQkFBcUIscUJBQXFCLElBQUk7MkJBQU87OztvQkFHdEUsR0FBRyxzREFBc0QsWUFBTTt3QkFDM0QsSUFBSSxhQUFhOzRCQUNiLE9BQU87NEJBQ0gsWUFBWTs7NEJBQ2IsYUFBYSxZQUFBOzRCQWdCSixPQWhCVTs7d0JBQzFCLE1BQU0saUJBQWlCO3dCQUN2QixxQkFBcUIscUJBQXFCLE1BQU07d0JBQ2hELE9BQU8sZ0JBQWdCLG1CQUFtQjt3QkFDMUMsSUFBSSxPQUFPLGdCQUFnQixrQkFBa0IsTUFBTSxhQUFhO3dCQUNoRSxPQUFPLEtBQUssSUFBSSxRQUFRLEtBQUs7d0JBQzdCLE9BQU8sS0FBSyxJQUFJLFFBQVE7Ozs7OztHQXVCakMiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGMpIENvcHlyaWdodCAyMDE2IFNhaWxQb2ludCBUZWNobm9sb2dpZXMsIEluYy4sIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICovXG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNlcnRpZmljYXRpb25Nb2R1bGUgZnJvbSAnY2VydGlmaWNhdGlvbi9DZXJ0aWZpY2F0aW9uTW9kdWxlJztcbmltcG9ydCAnLi9DZXJ0aWZpY2F0aW9uVGVzdERhdGEnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcblxuZGVzY3JpYmUoJ0NlcnRpZmljYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBVc2UgdGhlIG1vZHVsZS5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlLCB0ZXN0TW9kdWxlKSk7XG5cbiAgICBiZWZvcmVFYWNoKG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS5jb25zdGFudCgnU1BfQ09OVEVYVF9QQVRIJywgJy9pZGVudGl0eWlxJyk7XG4gICAgfSkpO1xuXG4gICAgdmFyIGJhc2VVUkxOb1NsYXNoID0gJy9pZGVudGl0eWlxL3VpL3Jlc3QvY2VydGlmaWNhdGlvbnMnLCBiYXNlVVJMID0gYmFzZVVSTE5vU2xhc2ggKyAnLycsXG4gICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEsIGh0dHAsIFNvcnRPcmRlciwgQ2VydGlmaWNhdGlvbkl0ZW0sIENlcnRpZmljYXRpb24sXG4gICAgICAgIE9iamVjdFJlc3VsdERUTywgUmVtZWRpYXRpb25BZHZpY2VSZXN1bHQsIFJlbWVkaWF0aW9uU3VtbWFyeSwgRmlsdGVyLCB0ZXN0U2VydmljZSwgUm9sZURldGFpbCwgRW1haWxUZW1wbGF0ZSxcbiAgICAgICAgQ2VydGlmaWNhdGlvblRhYmxlU2NvcGUsIEFwcGxpY2F0aW9uQWNjb3VudCwgbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2U7XG5cbiAgICAvKiBqc2hpbnQgbWF4cGFyYW1zOiAxNiAqL1xuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kaHR0cEJhY2tlbmRfLCBfY2VydGlmaWNhdGlvblNlcnZpY2VfLCBfY2VydGlmaWNhdGlvblRlc3REYXRhXywgX1NvcnRPcmRlcl8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0NlcnRpZmljYXRpb25JdGVtXywgX0NlcnRpZmljYXRpb25fLCBfT2JqZWN0UmVzdWx0RFRPXywgX1JlbWVkaWF0aW9uQWR2aWNlUmVzdWx0XyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfUmVtZWRpYXRpb25TdW1tYXJ5XywgX0ZpbHRlcl8sIF90ZXN0U2VydmljZV8sIF9Sb2xlRGV0YWlsXywgX0VtYWlsVGVtcGxhdGVfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9DZXJ0aWZpY2F0aW9uVGFibGVTY29wZV8sIF9BcHBsaWNhdGlvbkFjY291bnRfLCBfbWFuYWdlZEF0dHJpYnV0ZVNlcnZpY2VfKSB7XG4gICAgICAgIGh0dHAgPSBfJGh0dHBCYWNrZW5kXztcbiAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UgPSBfY2VydGlmaWNhdGlvblNlcnZpY2VfO1xuICAgICAgICBjZXJ0aWZpY2F0aW9uVGVzdERhdGEgPSBfY2VydGlmaWNhdGlvblRlc3REYXRhXztcbiAgICAgICAgU29ydE9yZGVyID0gX1NvcnRPcmRlcl87XG4gICAgICAgIENlcnRpZmljYXRpb25JdGVtID0gX0NlcnRpZmljYXRpb25JdGVtXztcbiAgICAgICAgQ2VydGlmaWNhdGlvbiA9IF9DZXJ0aWZpY2F0aW9uXztcbiAgICAgICAgT2JqZWN0UmVzdWx0RFRPID0gX09iamVjdFJlc3VsdERUT187XG4gICAgICAgIFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0ID0gX1JlbWVkaWF0aW9uQWR2aWNlUmVzdWx0XztcbiAgICAgICAgUmVtZWRpYXRpb25TdW1tYXJ5ID0gX1JlbWVkaWF0aW9uU3VtbWFyeV87XG4gICAgICAgIEZpbHRlciA9IF9GaWx0ZXJfO1xuICAgICAgICB0ZXN0U2VydmljZSA9IF90ZXN0U2VydmljZV87XG4gICAgICAgIFJvbGVEZXRhaWwgPSBfUm9sZURldGFpbF87XG4gICAgICAgIEVtYWlsVGVtcGxhdGUgPSBfRW1haWxUZW1wbGF0ZV87XG4gICAgICAgIENlcnRpZmljYXRpb25UYWJsZVNjb3BlID0gX0NlcnRpZmljYXRpb25UYWJsZVNjb3BlXztcbiAgICAgICAgQXBwbGljYXRpb25BY2NvdW50ID0gX0FwcGxpY2F0aW9uQWNjb3VudF87XG4gICAgICAgIG1hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlID0gX21hbmFnZWRBdHRyaWJ1dGVTZXJ2aWNlXztcbiAgICB9KSk7XG5cbiAgICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uKCk7XG4gICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRDZXJ0aWZpY2F0aW9uKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXRyaWV2ZSBjZXJ0aWZpY2F0aW9uIGRhdGEgZnJvbSBSRVNUJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgaWQgPSAnMTIzNCcsIHByb21pc2U7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQpLnJlc3BvbmQoMjAwLCB7b2JqZWN0OiBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVElGSUNBVElPTl8xfSk7XG4gICAgICAgICAgICBwcm9taXNlID0gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbihpZCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHJlc3BvbnNlIHdhcyB0cmFuc2Zvcm1lZCBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmdldE9iamVjdCgpIGluc3RhbmNlb2YgQ2VydGlmaWNhdGlvbikudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGFuIGV4Y2VwdGlvbiB3aGVuIG5vIGlkIGlzIHBhc3NlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENlcnRpZmljYXRpb24oKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0Q2VydGlmaWNhdGlvbigpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdzaG91bGQgcmV0cmlldmUgdGhlIGNlcnRpZmljYXRpb25zIGZvciB0aGUgdXNlciBmcm9tIFJFU1QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IDEwLCBsaW1pdCA9IDEyLCBwcm9taXNlO1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoYmFzZVVSTE5vU2xhc2ggKyAnP2xpbWl0PTEyJnN0YXJ0PTEwJylcbiAgICAgICAgICAgICAgICAucmVzcG9uZCgyMDAsIGNlcnRpZmljYXRpb25UZXN0RGF0YS5MSVNUX1JFU1VMVF9DRVJUXzEpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENlcnRpZmljYXRpb25zKHN0YXJ0LCBsaW1pdCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHJlc3BvbnNlIHdhcyB0cmFuc2Zvcm1lZCBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmRhdGEuY29uc3RydWN0b3IubmFtZSkudG9CZSgnTGlzdFJlc3VsdERUTycpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhLm9iamVjdHNbMF0uY29uc3RydWN0b3IubmFtZSkudG9CZSgnQ2VydGlmaWNhdGlvbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFN1YkNlcnRpZmljYXRpb25zKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXRyaWV2ZSBzdWItY2VydGlmaWNhdGlvbiBkYXRhIGZyb20gUkVTVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGlkID0gJzEyMzQnLFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMTAsXG4gICAgICAgICAgICAgICAgbGltaXQgPSA1LFxuICAgICAgICAgICAgICAgIHByb21pc2U7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQgKyAnL3N1YkNlcnRpZmljYXRpb25zP2xpbWl0PTUmc29ydD0lNUIlNUQmc3RhcnQ9MTAnKVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgY2VydGlmaWNhdGlvblRlc3REYXRhLkxJU1RfUkVTVUxUX0NFUlRfMSk7XG4gICAgICAgICAgICBwcm9taXNlID0gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0U3ViQ2VydGlmaWNhdGlvbnMoaWQsIHN0YXJ0LCBsaW1pdCwgbmV3IFNvcnRPcmRlcigpKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgcmVzcG9uc2Ugd2FzIHRyYW5zZm9ybWVkIGNvcnJlY3RseS5cbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZGF0YS5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdMaXN0UmVzdWx0RFRPJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmRhdGEub2JqZWN0c1swXS5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdDZXJ0aWZpY2F0aW9uJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXRyaWV2ZSBzdWItY2VydGlmaWNhdGlvbiBkYXRhIGZyb20gUkVTVCB3aGVuIG51bGwgc29ydCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGlkID0gJzEyMzQnLFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMSxcbiAgICAgICAgICAgICAgICBsaW1pdCA9IDU7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQgKyAnL3N1YkNlcnRpZmljYXRpb25zP2xpbWl0PTUmc3RhcnQ9MScpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuTElTVF9SRVNVTFRfQ0VSVF8xKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFN1YkNlcnRpZmljYXRpb25zKGlkLCBzdGFydCwgbGltaXQsIG51bGwpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGRlZmF1bHQgdG8gYXBwcm9wcmlhdGUgc3RhcnQgYW5kIGxpbWl0IHZhbHVlcyB3aXRoIG51bGwgcGFyYW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgaWQgPSAnMTIzNCc7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQgKyAnL3N1YkNlcnRpZmljYXRpb25zP2xpbWl0PScgKyBjZXJ0aWZpY2F0aW9uU2VydmljZS5kZWZhdWx0TGltaXQgK1xuICAgICAgICAgICAgICAgICcmc3RhcnQ9JyArIGNlcnRpZmljYXRpb25TZXJ2aWNlLmRlZmF1bHRTdGFydCkucmVzcG9uZCgyMDAsIGNlcnRpZmljYXRpb25UZXN0RGF0YS5MSVNUX1JFU1VMVF9DRVJUXzEpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0U3ViQ2VydGlmaWNhdGlvbnMoaWQsIG51bGwsIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGFuIGV4Y2VwdGlvbiB3aGVuIG5vIGlkIGlzIHBhc3NlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFN1YkNlcnRpZmljYXRpb25zKCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldENlcnRpZmljYXRpb25JdGVtcygpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjZXJ0aWZpY2F0aW9uSXRlbVRlc3REYXRhO1xuXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbVRlc3REYXRhID0ge1xuICAgICAgICAgICAgICAgIGNvdW50OiBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuQ0VSVF9JVEVNUy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgb2JqZWN0czogY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRfSVRFTVNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNlcnRpZmljYXRpb24gaXRlbXMgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkID0gJzEyMzQ1Njc4JyxcbiAgICAgICAgICAgICAgICBzdGFydCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXQgPSA1LFxuICAgICAgICAgICAgICAgIGdyb3VwQnkgPSAnYmxhaCcsXG4gICAgICAgICAgICAgICAgcHJvbWlzZTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGJhc2VVUkwgKyBpZCArICcvaXRlbXM/Z3JvdXBCeT1ibGFoJmxpbWl0PTUmc29ydD0lNUIlNUQmc3RhcnQ9MCcpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCBjZXJ0aWZpY2F0aW9uSXRlbVRlc3REYXRhKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uSXRlbXMoaWQsIG51bGwsIHN0YXJ0LCBsaW1pdCwgbmV3IFNvcnRPcmRlcigpLCBncm91cEJ5KTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhLmdldE9iamVjdHMoKS5sZW5ndGgpLnRvRXF1YWwoY2VydGlmaWNhdGlvbkl0ZW1UZXN0RGF0YS5jb3VudCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmRhdGEub2JqZWN0c1swXSBpbnN0YW5jZW9mIENlcnRpZmljYXRpb25JdGVtKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0cmlldmUgY2VydGlmaWNhdGlvbiBpdGVtcyBkYXRhIGZyb20gUkVTVCB3aGVuIHNvcnQgaXMgbnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkID0gJzEyMzQ1Njc4JyxcbiAgICAgICAgICAgICAgICBzdGFydCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXQgPSA1LFxuICAgICAgICAgICAgICAgIHByb21pc2U7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQgKyAnL2l0ZW1zP2xpbWl0PTUmc3RhcnQ9MCcpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCBjZXJ0aWZpY2F0aW9uSXRlbVRlc3REYXRhKTtcblxuICAgICAgICAgICAgcHJvbWlzZSA9IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENlcnRpZmljYXRpb25JdGVtcyhpZCwgbnVsbCwgc3RhcnQsIGxpbWl0LCBudWxsKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhLmdldE9iamVjdHMoKS5sZW5ndGgpLnRvRXF1YWwoY2VydGlmaWNhdGlvbkl0ZW1UZXN0RGF0YS5jb3VudCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmRhdGEub2JqZWN0c1swXSBpbnN0YW5jZW9mIENlcnRpZmljYXRpb25JdGVtKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgYWRkIHF1ZXJ5IHBhcmFtcyBmcm9tIHRhYmxlU2NvcGUgd2hlbiBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSAnMTIzNDU2NzgnLFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMCxcbiAgICAgICAgICAgICAgICBsaW1pdCA9IDUsXG4gICAgICAgICAgICAgICAgdGFibGVTY29wZSA9IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGVTY29wZSh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbJ09wZW4nLCAnQ29tcGxldGUnXSxcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWRUeXBlczogWydFeGNlcHRpb24nLCAnUG9saWN5VmlvbGF0aW9uJ10sXG4gICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkVHlwZXM6IFsnRXhjZXB0aW9uJywgJ1BvbGljeVZpb2xhdGlvbiddXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzcHlPbih0YWJsZVNjb3BlLCAnYWRkUXVlcnlQYXJhbWV0ZXJzJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQgKyAnL2l0ZW1zP2V4Y2x1ZGVkVHlwZT1FeGNlcHRpb24mZXhjbHVkZWRUeXBlPVBvbGljeVZpb2xhdGlvbiYnICtcbiAgICAgICAgICAgICAgICAnaW5jbHVkZWRUeXBlPUV4Y2VwdGlvbiZpbmNsdWRlZFR5cGU9UG9saWN5VmlvbGF0aW9uJmxpbWl0PTUmc3RhcnQ9MCZzdW1tYXJ5U3RhdHVzPU9wZW4mJyArXG4gICAgICAgICAgICAgICAgJ3N1bW1hcnlTdGF0dXM9Q29tcGxldGUnKVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgY2VydGlmaWNhdGlvbkl0ZW1UZXN0RGF0YSk7XG5cbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENlcnRpZmljYXRpb25JdGVtcyhpZCwgdGFibGVTY29wZSwgc3RhcnQsIGxpbWl0KTtcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZVNjb3BlLmFkZFF1ZXJ5UGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFkZCBmaWx0ZXIgdmFsdWVzIHdoZW4gZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGlkID0gJzEyMzQ1Njc4JyxcbiAgICAgICAgICAgICAgICBzdGFydCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXQgPSA1LFxuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3Rlc3ROYW1lJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZFVybCA9IGJhc2VVUkwgKyBpZCArXG4gICAgICAgICAgICAgICAgICAgIGAvaXRlbXM/ZGlzcGxheU5hbWU9JHt0ZXN0U2VydmljZS5nZXRRdWVyeVBhcmFtU3RyaW5nKGZpbHRlcnMuZGlzcGxheU5hbWUpfSZsaW1pdD01JnN0YXJ0PTBgO1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoZXhwZWN0ZWRVcmwpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCBjZXJ0aWZpY2F0aW9uSXRlbVRlc3REYXRhKTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Q2VydGlmaWNhdGlvbkl0ZW1zKGlkLCBudWxsLCBzdGFydCwgbGltaXQsIG51bGwsIG51bGwsIG51bGwsIGZpbHRlcnMpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCBlbnRpdHkgZW5kcG9pbnQgZm9yIGl0ZW1zIGlmIGVudGl0eUlkIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9ICcxMjM0NTY3OCcsXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAwLFxuICAgICAgICAgICAgICAgIGxpbWl0ID0gNSxcbiAgICAgICAgICAgICAgICB0YWJsZVNjb3BlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZVNjb3BlKHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ3ByaW5jZXNzJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRVcmwgPSAgYCR7YmFzZVVSTH0ke2lkfS9lbnRpdGllcy8ke3RhYmxlU2NvcGUuZW50aXR5LmlkfS9pdGVtcz9saW1pdD01JnN0YXJ0PTBgO1xuXG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChleHBlY3RlZFVybClcbiAgICAgICAgICAgICAgICAucmVzcG9uZCgyMDAsIGNlcnRpZmljYXRpb25JdGVtVGVzdERhdGEpO1xuXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRDZXJ0aWZpY2F0aW9uSXRlbXMoaWQsIHRhYmxlU2NvcGUsIHN0YXJ0LCBsaW1pdCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY292ZXJ0IGFkZGl0aW9uYWxFbnRpdGxlbWVudCBmaWx0ZXIgdG8gSlNPTiBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSAnMTIzNDU2NzgnLFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMCxcbiAgICAgICAgICAgICAgICBsaW1pdCA9IDUsXG4gICAgICAgICAgICAgICAgZmlsdGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXBwOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Blcm1pc3Npb246IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxFbnRpdGxlbWVudDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyBTcGVsbCB0aGlzIG91dCBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBnb29kIG1ldGhvZCB0byBnZXQgdGhlIGVuY29kaW5nIHJpZ2h0IHdpdGggc29tZSBlbmNvZGVkXG4gICAgICAgICAgICAgICAgLy8gY29tbWFzIGFuZCBzb21lIG5vdCwgZXRjLlxuICAgICAgICAgICAgICAgIGVuY29kZWRBcHAgPSAnJTdCJTIydmFsdWUlMjI6JTIyJTdCJTVDJTIybmFtZSU1QyUyMjolNUMlMjJuYW1lJTVDJTIyLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICclNUMlMjJ2YWx1ZSU1QyUyMjolNUMlMjJ2YWx1ZSU1QyUyMiwlNUMlMjJpc1Blcm1pc3Npb24lNUMlMjI6ZmFsc2UsJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyU1QyUyMmFkZGl0aW9uYWxFbnRpdGxlbWVudCU1QyUyMjp0cnVlJTdEJTIyJTdEJyxcbiAgICAgICAgICAgICAgICBleHBlY3RlZFVybCA9IGJhc2VVUkwgKyBpZCArIGAvaXRlbXM/YXBwPSR7ZW5jb2RlZEFwcH0mbGltaXQ9NSZzdGFydD0wYDtcblxuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoZXhwZWN0ZWRVcmwpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCBjZXJ0aWZpY2F0aW9uSXRlbVRlc3REYXRhKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENlcnRpZmljYXRpb25JdGVtcyhpZCwgbnVsbCwgc3RhcnQsIGxpbWl0LCBudWxsLCBudWxsLCBudWxsLCBmaWx0ZXJzKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0UmV2b2NhdGlvbkl0ZW1zKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCByZXRyaWV2ZSByZXZvY2F0aW9uIGRhdGEgZnJvbSBSRVNUJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgaWQgPSAnMTIzNCcsXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAxMCxcbiAgICAgICAgICAgICAgICBsaW1pdCA9IDUsXG4gICAgICAgICAgICAgICAgcHJvbWlzZTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGJhc2VVUkwgKyBpZCArICcvcmV2b2NhdGlvbnM/bGltaXQ9NSZzb3J0PSU1QiU1RCZzdGFydD0xMCcpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCBjZXJ0aWZpY2F0aW9uVGVzdERhdGEuTElTVF9SRVNVTFRfUkVWT0NBVElPTl9JVEVNUyk7XG4gICAgICAgICAgICBwcm9taXNlID0gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmV2b2NhdGlvbkl0ZW1zKGlkLCBzdGFydCwgbGltaXQsIG5ldyBTb3J0T3JkZXIoKSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHJlc3BvbnNlIHdhcyB0cmFuc2Zvcm1lZCBjb3JyZWN0bHkuXG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmRhdGEuY29uc3RydWN0b3IubmFtZSkudG9CZSgnTGlzdFJlc3VsdERUTycpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhLm9iamVjdHNbMF0uY29uc3RydWN0b3IubmFtZSkudG9CZSgnQ2VydGlmaWNhdGlvblJldm9jYXRpb24nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHJpZXZlIHJldm9jYXRpb24gZGF0YSBmcm9tIFJFU1Qgd2hlbiBudWxsIHNvcnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBpZCA9ICcxMjM0JyxcbiAgICAgICAgICAgICAgICBzdGFydCA9IDEsXG4gICAgICAgICAgICAgICAgbGltaXQgPSA1O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoYmFzZVVSTCArIGlkICsgJy9yZXZvY2F0aW9ucz9saW1pdD01JnN0YXJ0PTEnKVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgY2VydGlmaWNhdGlvblRlc3REYXRhLkxJU1RfUkVTVUxUX1JFVk9DQVRJT05fSVRFTVMpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmV2b2NhdGlvbkl0ZW1zKGlkLCBzdGFydCwgbGltaXQsIG51bGwpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGRlZmF1bHQgdG8gYXBwcm9wcmlhdGUgc3RhcnQgYW5kIGxpbWl0IHZhbHVlcyB3aXRoIG51bGwgcGFyYW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgaWQgPSAnMTIzNCc7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChiYXNlVVJMICsgaWQgKyAnL3Jldm9jYXRpb25zP2xpbWl0PScgKyBjZXJ0aWZpY2F0aW9uU2VydmljZS5kZWZhdWx0TGltaXQgK1xuICAgICAgICAgICAgICAgICcmc3RhcnQ9JyArIGNlcnRpZmljYXRpb25TZXJ2aWNlLmRlZmF1bHRTdGFydClcbiAgICAgICAgICAgICAgICAucmVzcG9uZCgyMDAsIGNlcnRpZmljYXRpb25UZXN0RGF0YS5MSVNUX1JFU1VMVF9SRVZPQ0FUSU9OX0lURU1TKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFJldm9jYXRpb25JdGVtcyhpZCwgbnVsbCwgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgYW4gZXhjZXB0aW9uIHdoZW4gbm8gaWQgaXMgcGFzc2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmV2b2NhdGlvbkl0ZW1zKG51bGwsIG51bGwsIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzYXZlRGVjaXNpb25zKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGZpbHRlclZhbHVlU2VydmljZTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVEZWNpc2lvbihkZWNpc2lvbikge1xuICAgICAgICAgICAgLy9GdWRnZSBhIGNsb25lIHRoYXQganVzdCByZXR1cm5zIHRoZSBkZWNpc2lvblxuICAgICAgICAgICAgZGVjaXNpb24uY2xvbmUgPSAoKSA9PiB7IHJldHVybiBkZWNpc2lvbjsgfTtcbiAgICAgICAgICAgIHJldHVybiBkZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfZmlsdGVyVmFsdWVTZXJ2aWNlXykgPT4ge1xuICAgICAgICAgICAgZmlsdGVyVmFsdWVTZXJ2aWNlID0gX2ZpbHRlclZhbHVlU2VydmljZV87XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHBvc3QgZGVjaXNpb25zIHRvIHNlcnZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkID0gJzEyMzQ1Njc4JyxcbiAgICAgICAgICAgICAgICBkZWNpc2lvbnMgPSBbIGNyZWF0ZURlY2lzaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgc29tZTogJ3RoaW5nJ1xuICAgICAgICAgICAgICAgIH0pLCBjcmVhdGVEZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgICAgIHNvbWU6ICdzdHVmZidcbiAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoYmFzZVVSTCArIGlkICsgJy9kZWNpc2lvbnMnLCB7XG4gICAgICAgICAgICAgICAgZGVjaXNpb25zOiBkZWNpc2lvbnNcbiAgICAgICAgICAgIH0pLnJlc3BvbmQoMjAwLCB7IGRhdGE6IHt9IH0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2Uuc2F2ZURlY2lzaW9ucyhpZCwgZGVjaXNpb25zKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNlbGVjdGVkVmlvbGF0aW9uRW50aXRsZW1lbnRzIHRvIEpTT04gc3RyaW5nJywgKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGlkID0gJzEyMzQ1Njc4JyxcbiAgICAgICAgICAgICAgICBkZWNpc2lvbnMgPSBbIGNyZWF0ZURlY2lzaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb21lOiAndGhpbmcnXG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfSksIGNyZWF0ZURlY2lzaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgc29tZTogJ3N0dWZmJ1xuICAgICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZERlY2lzaW9ucyA9IGFuZ3VsYXIuY29weShkZWNpc2lvbnMpO1xuICAgICAgICAgICAgZXhwZWN0ZWREZWNpc2lvbnNbMF0uc2VsZWN0ZWRWaW9sYXRpb25FbnRpdGxlbWVudHMgPVxuICAgICAgICAgICAgICAgIGFuZ3VsYXIudG9Kc29uKGV4cGVjdGVkRGVjaXNpb25zWzBdLnNlbGVjdGVkVmlvbGF0aW9uRW50aXRsZW1lbnRzKTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChiYXNlVVJMICsgaWQgKyAnL2RlY2lzaW9ucycsIHtcbiAgICAgICAgICAgICAgICBkZWNpc2lvbnM6IGV4cGVjdGVkRGVjaXNpb25zXG4gICAgICAgICAgICB9KS5yZXNwb25kKDIwMCwgeyBkYXRhOiB7fSB9KTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLnNhdmVEZWNpc2lvbnMoaWQsIGRlY2lzaW9ucyk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgZGVsZXRlIGNlcnRpZmljYXRpb25JdGVtIGZyb20gZGVjaXNpb24gYmVmb3JlIHBvc3RpbmcnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSAnMTIzNDU2NzgnLFxuICAgICAgICAgICAgICAgIGRlY2lzaW9ucyA9IFsgY3JlYXRlRGVjaXNpb24oe1xuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uSXRlbToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdkZmFmYWRzZmEnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25JdGVtSWQ6ICdkZmFmYWRzZmEnXG4gICAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkRGVjaXNpb25zID0gYW5ndWxhci5jb3B5KGRlY2lzaW9ucyk7XG4gICAgICAgICAgICBkZWxldGUgZXhwZWN0ZWREZWNpc2lvbnNbMF0uY2VydGlmaWNhdGlvbkl0ZW07XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoYmFzZVVSTCArIGlkICsgJy9kZWNpc2lvbnMnLCB7XG4gICAgICAgICAgICAgICAgZGVjaXNpb25zOiBleHBlY3RlZERlY2lzaW9uc1xuICAgICAgICAgICAgfSkucmVzcG9uZCgyMDAsIHsgZGF0YToge30gfSk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zKGlkLCBkZWNpc2lvbnMpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgdGhyb3VnaCB0byBjb252ZXJ0IHBhcmFtcyB0byB3aGF0IHRoZSBzZXJ2ZXIgZXhwZWN0cyBpZiB0aGVyZSBhcmUgZmlsdGVyIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9ICcxMjM0NTY3OCcsXG4gICAgICAgICAgICAgICAgZGVjaXNpb25zID0gWyBjcmVhdGVEZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb21lYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdpdXNlZHRva25vdycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ3NvbWVib2R5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWREZWNpc2lvbnMgPSBhbmd1bGFyLmNvcHkoZGVjaXNpb25zKTtcbiAgICAgICAgICAgIGV4cGVjdGVkRGVjaXNpb25zWzBdLnNlbGVjdGlvbk1vZGVsLmZpbHRlclZhbHVlcy5zb21lYm9keS52YWx1ZSA9ICdpdXNlZHRva25vdyc7XG4gICAgICAgICAgICBzcHlPbihmaWx0ZXJWYWx1ZVNlcnZpY2UsICdnZXRRdWVyeVBhcmFtcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGJhc2VVUkwgKyBpZCArICcvZGVjaXNpb25zJywge1xuICAgICAgICAgICAgICAgIGRlY2lzaW9uczogZXhwZWN0ZWREZWNpc2lvbnNcbiAgICAgICAgICAgIH0pLnJlc3BvbmQoMjAwLCB7IGRhdGE6IHt9IH0pO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2Uuc2F2ZURlY2lzaW9ucyhpZCwgZGVjaXNpb25zKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJWYWx1ZVNlcnZpY2UuZ2V0UXVlcnlQYXJhbXMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjb252ZXJ0IFNlbGVjdGlvbk1vZGVsR3JvdXBzIG9uIHNlbGVjdGlvbiBtb2RlbCB0byBzaW1wbGUgU2VsZWN0aW9uTW9kZWwgb2JqZWN0cycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9ICcxMjM0NTY3OCcsXG4gICAgICAgICAgICAgICAgZmlsdGVyVmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29tZTogJ3RoaW5nJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbEdyb3VwID0ge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWx1ZXM6IGZpbHRlclZhbHVlc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVjaXNpb25zID0gWyBjcmVhdGVEZWNpc2lvbih7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbk1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRDb21wbGV0ZUdyb3VwU2VsZWN0aW9uTW9kZWxzOiBqYXNtaW5lLmNyZWF0ZVNweSgnZ2V0Q29tcGxldGVHcm91cFNlbGVjdGlvbk1vZGVscycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZC5yZXR1cm5WYWx1ZShbIHNlbGVjdGlvbk1vZGVsR3JvdXAgXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cHM6IFt7fV1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnQXBwcm92ZWQnXG4gICAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkRGVjaXNpb25zID0gYW5ndWxhci5jb3B5KGRlY2lzaW9ucyk7XG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlbEdyb3VwLmNsb25lID0gKCkgPT4gc2VsZWN0aW9uTW9kZWxHcm91cDtcbiAgICAgICAgICAgIGV4cGVjdGVkRGVjaXNpb25zWzBdLnNlbGVjdGlvbk1vZGVsLmdyb3VwcyA9IFtzZWxlY3Rpb25Nb2RlbEdyb3VwXTtcbiAgICAgICAgICAgIHNweU9uKGZpbHRlclZhbHVlU2VydmljZSwgJ2dldFF1ZXJ5UGFyYW1zJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoYmFzZVVSTCArIGlkICsgJy9kZWNpc2lvbnMnLCB7XG4gICAgICAgICAgICAgICAgZGVjaXNpb25zOiBleHBlY3RlZERlY2lzaW9uc1xuICAgICAgICAgICAgfSkucmVzcG9uZCgyMDAsIHsgZGF0YToge30gfSk7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZS5zYXZlRGVjaXNpb25zKGlkLCBkZWNpc2lvbnMpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KGRlY2lzaW9uc1swXS5zZWxlY3Rpb25Nb2RlbC5nZXRDb21wbGV0ZUdyb3VwU2VsZWN0aW9uTW9kZWxzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVmFsdWVTZXJ2aWNlLmdldFF1ZXJ5UGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWx0ZXJWYWx1ZXMsIG51bGwsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgcmVzdWx0IHRvIE9iamVjdFJlc3VsdERUTyB3aXRoIENlcnRpZmljYXRpb24gb2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSAnMTIzNDU2NzgnLFxuICAgICAgICAgICAgICAgIGRlY2lzaW9ucyA9IFsgY3JlYXRlRGVjaXNpb24oe1xuICAgICAgICAgICAgICAgICAgICBzb21lOiAndGhpbmcnXG4gICAgICAgICAgICAgICAgfSksIGNyZWF0ZURlY2lzaW9uKHtcbiAgICAgICAgICAgICAgICAgICAgc29tZTogJ3N0dWZmJ1xuICAgICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogY2VydGlmaWNhdGlvblRlc3REYXRhLkNFUlRJRklDQVRJT05fMVxuICAgICAgICAgICAgICAgIH0sIHByb21pc2U7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChiYXNlVVJMICsgaWQgKyAnL2RlY2lzaW9ucycsIHtcbiAgICAgICAgICAgICAgICBkZWNpc2lvbnM6IGRlY2lzaW9uc1xuICAgICAgICAgICAgfSkucmVzcG9uZCgyMDAsIHJlc3VsdCk7XG4gICAgICAgICAgICBwcm9taXNlID0gY2VydGlmaWNhdGlvblNlcnZpY2Uuc2F2ZURlY2lzaW9ucyhpZCwgZGVjaXNpb25zKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhIGluc3RhbmNlb2YgT2JqZWN0UmVzdWx0RFRPKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhLmdldE9iamVjdCgpIGluc3RhbmNlb2YgQ2VydGlmaWNhdGlvbikudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzaWduT2ZmKCknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnc2hvdWxkIHNpZ25vZmYgdGhlIGNlcnRpZmljYXRpb24gd2hlbiBubyBjcmVkZW50aWFscyBwYXNzZWQgaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBpZCA9ICcxMjM0NTY3OCc7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChiYXNlVVJMICsgaWQgKyAnL3NpZ24nKS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2Uuc2lnbk9mZihpZCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgc2lnbm9mZiB0aGUgY2VydGlmaWNhdGlvbiB3aGVuIGNyZWRlbnRpYWxzIHBhc3NlZCBpbiBmb3IgZXNpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGlkID0gJzEyMzQ1Njc4JyxcbiAgICAgICAgICAgICAgICB1c2VybmFtZSA9ICd1c2VyMScsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPSAneHl6enknLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmF0dXJlQWNjb3VudElkOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hdHVyZVBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChiYXNlVVJMICsgaWQgKyAnL3NpZ24nLCBjcmVkZW50aWFscykucmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25TZXJ2aWNlLnNpZ25PZmYoaWQsIHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldFZpb2xhdGlvblJlbWVkaWF0aW9uQWR2aWNlKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0JywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNlcnRJZCA9ICdjZXJ0MScsXG4gICAgICAgICAgICAgICAgaXRlbUlkID0gJ2l0ZW0xJyxcbiAgICAgICAgICAgICAgICBwcm9taXNlO1xuXG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChgJHtiYXNlVVJMfSR7Y2VydElkfS9pdGVtcy8ke2l0ZW1JZH0vcmVtZWRpYXRpb25BZHZpY2VgKVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFZpb2xhdGlvblJlbWVkaWF0aW9uQWR2aWNlKGNlcnRJZCwgaXRlbUlkKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbigoYWR2aWNlUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFkdmljZVJlc3VsdCBpbnN0YW5jZW9mIFJlbWVkaWF0aW9uQWR2aWNlUmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgcmVzcG9uc2UgZGF0YSBub3QgY29ycmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNlcnRJZCA9ICdjZXJ0MScsXG4gICAgICAgICAgICAgICAgaXRlbUlkID0gJ2l0ZW0xJyxcbiAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsLFxuICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2U7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGAke2Jhc2VVUkx9JHtjZXJ0SWR9L2l0ZW1zLyR7aXRlbUlkfS9yZW1lZGlhdGlvbkFkdmljZWApXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0VmlvbGF0aW9uUmVtZWRpYXRpb25BZHZpY2UoY2VydElkLCBpdGVtSWQpLmNhdGNoKCgpID0+XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2UgPSB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlamVjdFByb21pc2UpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0RGVsZWdhdGlvbkRlc2NyaXB0aW9uKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgdGhyb3cgaWYgcmVzcG9uc2UgZGF0YSBub3QgY29ycmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNlcnRJZCA9ICdjZXJ0MScsXG4gICAgICAgICAgICAgICAgaXRlbUlkID0gJ2l0ZW0xJyxcbiAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsLFxuICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2U7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGAke2Jhc2VVUkx9JHtjZXJ0SWR9L2l0ZW1zLyR7aXRlbUlkfS9kZWxlZ2F0aW9uRGVzY3JpcHRpb25gKVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgcmVzcG9uc2VEYXRhKTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0RGVsZWdhdGlvbkRlc2NyaXB0aW9uKGNlcnRJZCwgaXRlbUlkKS5jYXRjaCgoKSA9PlxuICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2UgPSB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlamVjdFByb21pc2UpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0UmVtZWRpYXRpb25TdW1tYXJ5KCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIFJlbWVkaWF0aW9uU3VtbWFyeSBmb3IgcmV2b2tlZCByb2xlcycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjZXJ0SWQgPSAnY2VydDEnLFxuICAgICAgICAgICAgICAgIGl0ZW1JZCA9ICdpdGVtMScsXG4gICAgICAgICAgICAgICAgaW5wdXQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJldm9rZWRSb2xlczogWydyb2xlMScsICdyb2xlMiddXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9taXNlO1xuXG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoYCR7YmFzZVVSTH0ke2NlcnRJZH0vaXRlbXMvJHtpdGVtSWR9L3JlbWVkaWF0aW9uU3VtbWFyeWAsIGlucHV0KVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQuc3VtbWFyeSk7XG4gICAgICAgICAgICBwcm9taXNlID0gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmVtZWRpYXRpb25TdW1tYXJ5KFxuICAgICAgICAgICAgICAgIGNlcnRJZCwgaXRlbUlkLCBpbnB1dC5yZXZva2VkUm9sZXMsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oKHN1bW1hcnkpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3VtbWFyeSBpbnN0YW5jZW9mIFJlbWVkaWF0aW9uU3VtbWFyeSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBSZW1lZGlhdGlvblN1bW1hcnkgZm9yIHNlbGVjdGVkIHZpb2xhdGlvbiBlbnRpdGxlbWVudHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2VydElkID0gJ2NlcnQxJyxcbiAgICAgICAgICAgICAgICBpdGVtSWQgPSAnaXRlbTEnLFxuICAgICAgICAgICAgICAgIGlucHV0ID0ge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFZpb2xhdGlvbkVudGl0bGVtZW50czogYW5ndWxhci50b0pzb24oY2VydGlmaWNhdGlvblRlc3REYXRhLlBPTElDWV9UUkVFX05PREUpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9taXNlO1xuXG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoYCR7YmFzZVVSTH0ke2NlcnRJZH0vaXRlbXMvJHtpdGVtSWR9L3JlbWVkaWF0aW9uU3VtbWFyeWAsIGlucHV0KVxuICAgICAgICAgICAgICAgIC5yZXNwb25kKDIwMCwgY2VydGlmaWNhdGlvblRlc3REYXRhLlJFTUVESUFUSU9OX0FEVklDRV9SRVNVTFQuc3VtbWFyeSk7XG4gICAgICAgICAgICBwcm9taXNlID0gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmVtZWRpYXRpb25TdW1tYXJ5KFxuICAgICAgICAgICAgICAgIGNlcnRJZCwgaXRlbUlkLCB1bmRlZmluZWQsIGNlcnRpZmljYXRpb25UZXN0RGF0YS5QT0xJQ1lfVFJFRV9OT0RFKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbigoc3VtbWFyeSkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChzdW1tYXJ5IGluc3RhbmNlb2YgUmVtZWRpYXRpb25TdW1tYXJ5KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IGlmIHJlc3BvbnNlIGRhdGEgbm90IGNvcnJlY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBjZXJ0SWQgPSAnY2VydDEnLFxuICAgICAgICAgICAgICAgIGl0ZW1JZCA9ICdpdGVtMScsXG4gICAgICAgICAgICAgICAgaW5wdXQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJldm9rZWRSb2xlczogWydyb2xlMScsICdyb2xlMiddXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsLFxuICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2U7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChgJHtiYXNlVVJMfSR7Y2VydElkfS9pdGVtcy8ke2l0ZW1JZH0vcmVtZWRpYXRpb25TdW1tYXJ5YCwgaW5wdXQpXG4gICAgICAgICAgICAgICAgLnJlc3BvbmQoMjAwLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0UmVtZWRpYXRpb25TdW1tYXJ5KGNlcnRJZCwgaXRlbUlkLCBpbnB1dC5yZXZva2VkUm9sZXMpLmNhdGNoKCgpID0+XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdFByb21pc2UgPSB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHJlamVjdFByb21pc2UpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0RmlsdGVycygpJywgKCkgPT4ge1xuICAgICAgICBsZXQgZmlsdGVyID0ge1xuICAgICAgICAgICAgcHJvcGVydHk6ICdtYW5hZ2VyJyxcbiAgICAgICAgICAgIG11bHRpVmFsdWVkOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiAnTWFuYWdlcicsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ1NvbWVUeXBlJyxcbiAgICAgICAgICAgIGFsbG93ZWRWYWx1ZXM6IG51bGwsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpbHRlcnMgPSBbXTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhbiBhcnJheSBvZiBmaWx0ZXJzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNlcnRJZCA9ICdjZXJ0MScsIHByb21pc2U7XG5cbiAgICAgICAgICAgIGZpbHRlcnMgPSBbbmV3IEZpbHRlcihmaWx0ZXIpXTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGAke2Jhc2VVUkx9JHtjZXJ0SWR9L2l0ZW1zL2ZpbHRlcnNgKS5yZXNwb25kKDIwMCwgW2ZpbHRlcl0pO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldEZpbHRlcnMoY2VydElkKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIHByb21pc2UudGhlbigoZmlsdGVyc0RhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmlsdGVyc0RhdGEubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaWx0ZXJzRGF0YSkudG9FcXVhbChmaWx0ZXJzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRSb2xlRGV0YWlscygpJywgKCkgPT4ge1xuICAgICAgICBpdCgnZGllcyB3aXRoIG5vIGNlcnQgaWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Um9sZURldGFpbHMobnVsbCwgJ2l0ZW1pZCcpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaWVzIHdpdGggbm8gY2VydCBpdGVtIGlkJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFJvbGVEZXRhaWxzKCdjZXJ0SWQnLCBudWxsKSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHJvbGUgZGV0YWlscycsICgpID0+IHtcbiAgICAgICAgICAgICBsZXQgY2VydElkID0gJ2NlcnRJZCcsXG4gICAgICAgICAgICAgICAgIGNlcnRJdGVtSWQgPSAnY2VydEl0ZW1JZCcsXG4gICAgICAgICAgICAgICAgIHJvbGU7XG5cbiAgICAgICAgICAgICBodHRwLmV4cGVjdEdFVChgJHtiYXNlVVJMfSR7Y2VydElkfS9pdGVtcy8ke2NlcnRJdGVtSWR9L3JvbGVEZXRhaWxzYCkuXG4gICAgICAgICAgICAgICAgIHJlc3BvbmQoMjAwLCB7fSk7XG5cbiAgICAgICAgICAgICBjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRSb2xlRGV0YWlscyhjZXJ0SWQsIGNlcnRJdGVtSWQpLnRoZW4oKHJldHVybmVkUm9sZSA9PiB7XG4gICAgICAgICAgICAgICAgIHJvbGUgPSByZXR1cm5lZFJvbGU7XG4gICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgICAgICAgZXhwZWN0KHJvbGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICAgZXhwZWN0KHJvbGUgaW5zdGFuY2VvZiBSb2xlRGV0YWlsKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0Um9sZUhpZXJhcmNoeSgpJywgKCkgPT4ge1xuICAgICAgICBpdCgnZGllcyB3aXRoIG5vIGNlcnQgaWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Um9sZUhpZXJhcmNoeShudWxsLCAnaXRlbWlkJywgJ3JvbGVJZCcpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaWVzIHdpdGggbm8gY2VydCBpdGVtIGlkJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldFJvbGVIaWVyYXJjaHkoJ2NlcnRJZCcsIG51bGwsICdyb2xlSWQnKSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZGllcyB3aXRoIG5vIHJvbGUgaWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Um9sZUhpZXJhcmNoeSgnY2VydElkJywgJ2l0ZW1JZCcsIG51bGwpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSByb2xlIGRldGFpbHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2VydElkID0gJ2NlcnRJZCcsXG4gICAgICAgICAgICAgICAgY2VydEl0ZW1JZCA9ICdjZXJ0SXRlbUlkJyxcbiAgICAgICAgICAgICAgICByb2xlSWQgPSAncm9sZUlkJyxcbiAgICAgICAgICAgICAgICBoaWVyYXJjaHk7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGAke2Jhc2VVUkx9JHtjZXJ0SWR9L2l0ZW1zLyR7Y2VydEl0ZW1JZH0vcm9sZURldGFpbHMvJHtyb2xlSWR9L2hpZXJhcmNoeWApLlxuICAgICAgICAgICAgICAgIHJlc3BvbmQoMjAwLCBbeyBpZDogJ3JvbGUxJyB9LCB7IGlkOiAncm9sZTInIH1dKTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0Um9sZUhpZXJhcmNoeShjZXJ0SWQsIGNlcnRJdGVtSWQsIHJvbGVJZCkudGhlbigocmV0dXJuZWRIaWVyYXJjaHkgPT4ge1xuICAgICAgICAgICAgICAgIGhpZXJhcmNoeSA9IHJldHVybmVkSGllcmFyY2h5O1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChoaWVyYXJjaHkpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICBleHBlY3QoYW5ndWxhci5pc0FycmF5KGhpZXJhcmNoeSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoaGllcmFyY2h5Lmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgIGV4cGVjdChoaWVyYXJjaHlbMF0gaW5zdGFuY2VvZiBSb2xlRGV0YWlsKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGhpZXJhcmNoeVsxXSBpbnN0YW5jZW9mIFJvbGVEZXRhaWwpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBkZXNjcmliZSgnZ2V0Q2VydGlmaWNhdGlvblJlbWluZGVyRW1haWxUZW1wbGF0ZSgpJywgKCkgPT4ge1xuICAgICAgICBsZXQgdGVtcGxhdGVEYXRhID0ge1xuICAgICAgICAgICAgdG9JZGVudGl0eToge1xuICAgICAgICAgICAgICAgIGlkOiAnMTIzNCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0dpbGxpZ2FuJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIEVtYWlsVGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2VydElkID0gJ2NlcnQxJyxcbiAgICAgICAgICAgICAgICBwcm9taXNlO1xuXG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChgJHtiYXNlVVJMfSR7Y2VydElkfS9lbWFpbC9yZW1pbmRlcmApLnJlc3BvbmQoMjAwLCB0ZW1wbGF0ZURhdGEpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldENlcnRpZmljYXRpb25SZW1pbmRlckVtYWlsVGVtcGxhdGUoY2VydElkKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcblxuICAgICAgICAgICAgcHJvbWlzZS50aGVuKCh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdCh0ZW1wbGF0ZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QodGVtcGxhdGUgaW5zdGFuY2VvZiBFbWFpbFRlbXBsYXRlKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NlbmRDZXJ0aWZpY2F0aW9uUmVtaW5kZXJFbWFpbCgpJywgKCkgPT4ge1xuICAgICAgICBsZXQgdGVtcGxhdGVEYXRhID0ge1xuICAgICAgICAgICAgdG9JZGVudGl0eToge1xuICAgICAgICAgICAgICAgIGlkOiAnMTIzNCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0dpbGxpZ2FuJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdzaG91bGQgY2FsbCByZXNvdXJjZScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBjZXJ0SWQgPSAnY2VydDEnLFxuICAgICAgICAgICAgICAgIGlucHV0ID0ge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbFRlbXBsYXRlOiB0ZW1wbGF0ZURhdGFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb21pc2U7XG5cbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChgJHtiYXNlVVJMfSR7Y2VydElkfS9lbWFpbC9yZW1pbmRlci9zZW5kYCwgaW5wdXQpLnJlc3BvbmQoMjAwLCBudWxsKTtcblxuICAgICAgICAgICAgcHJvbWlzZSA9IGNlcnRpZmljYXRpb25TZXJ2aWNlLnNlbmRDZXJ0aWZpY2F0aW9uUmVtaW5kZXJFbWFpbChjZXJ0SWQsIHRlbXBsYXRlRGF0YSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG5cbiAgICAgICAgICAgIHByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1cykudG9CZSgyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Jlc2NpbmRDZXJ0aWZpY2F0aW9uJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIGNhbGwgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICBjZXJ0SWQgPSAnY2VydDEnO1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGAke2Jhc2VVUkx9JHtjZXJ0SWR9L3Jlc2NpbmRgLCBudWxsKS5yZXNwb25kKDIwMCwgbnVsbCk7XG5cbiAgICAgICAgICAgIHByb21pc2UgPSBjZXJ0aWZpY2F0aW9uU2VydmljZS5yZXNjaW5kQ2VydGlmaWNhdGlvbihjZXJ0SWQpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXMpLnRvQmUoMjAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRBY2NvdW50RGV0YWlscygpJywgKCkgPT4ge1xuICAgICAgICBpdCgnZGllcyB3aXRoIG5vIGNlcnQgaWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0QWNjb3VudERldGFpbHMobnVsbCwgJ2l0ZW1pZCcpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaWVzIHdpdGggbm8gY2VydCBpdGVtIGlkJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldEFjY291bnREZXRhaWxzKCdjZXJ0SWQnLCBudWxsKSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0aGUgYXBwbGljYXRpb24gYWNjb3VudCBkZXRhaWxzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNlcnRJZCA9ICdjZXJ0SWQnLFxuICAgICAgICAgICAgICAgIGNlcnRJdGVtSWQgPSAnY2VydEl0ZW1JZCcsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25BY2NvdW50O1xuXG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChgJHtiYXNlVVJMfSR7Y2VydElkfS9pdGVtcy8ke2NlcnRJdGVtSWR9L2FjY291bnREZXRhaWxzYCkuXG4gICAgICAgICAgICAgICAgcmVzcG9uZCgyMDAsIHt9KTtcblxuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0QWNjb3VudERldGFpbHMoY2VydElkLCBjZXJ0SXRlbUlkKS50aGVuKChyZXR1cm5lZEFjY291bnQgPT4ge1xuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uQWNjb3VudCA9IHJldHVybmVkQWNjb3VudDtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuXG4gICAgICAgICAgICBleHBlY3QoYXBwbGljYXRpb25BY2NvdW50KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KGFwcGxpY2F0aW9uQWNjb3VudCBpbnN0YW5jZW9mIEFwcGxpY2F0aW9uQWNjb3VudCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0RW50aXRsZW1lbnREZXRhaWxzVXJsKCknLCAoKSA9PiB7XG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBjZXJ0IGlkJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KCgpID0+IGNlcnRpZmljYXRpb25TZXJ2aWNlLmdldEVudGl0bGVtZW50RGV0YWlsc1VybChudWxsLCAnaXRlbWlkJykpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIGNlcnQgaXRlbSBpZCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjZXJ0aWZpY2F0aW9uU2VydmljZS5nZXRFbnRpdGxlbWVudERldGFpbHNVcmwoJ2NlcnRJZCcsIG51bGwpKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSB1cmwgdG8gdGhlIG1hbmFnZWQgYXR0cmlidXRlIGRldGFpbHMgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2VydElkID0gJzEyMzQnLFxuICAgICAgICAgICAgICAgIGNlcnRJdGVtSWQgPSAnNTY3OCcsXG4gICAgICAgICAgICAgICAgdXJsID0gYCR7YmFzZVVSTH0ke2NlcnRJZH0vaXRlbXMvJHtjZXJ0SXRlbUlkfS9tYW5hZ2VkQXR0cmlidXRlRGV0YWlsc2A7XG4gICAgICAgICAgICBleHBlY3QoY2VydGlmaWNhdGlvblNlcnZpY2UuZ2V0RW50aXRsZW1lbnREZXRhaWxzVXJsKGNlcnRJZCwgY2VydEl0ZW1JZCkpLnRvRXF1YWwodXJsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yd2FyZENlcnRpZmljYXRpb24oKScsICgpID0+IHtcbiAgICAgICAgbGV0IHdvcmtJdGVtU2VydmljZTtcblxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdCgoX3dvcmtJdGVtU2VydmljZV8pID0+IHtcbiAgICAgICAgICAgIHdvcmtJdGVtU2VydmljZSA9IF93b3JrSXRlbVNlcnZpY2VfO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyB3aXRoIG5vIGNlcnRpZmljYXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoKCkgPT4gY2VydGlmaWNhdGlvblNlcnZpY2UuZm9yd2FyZENlcnRpZmljYXRpb24obnVsbCwgKCkgPT4ge30pKS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aHJvd3Mgd2l0aCBubyBjYWxsYmFjayBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCgoKSA9PiBjZXJ0aWZpY2F0aW9uU2VydmljZS5mb3J3YXJkQ2VydGlmaWNhdGlvbih7fSwgbnVsbCkpLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbGxzIHdvcmtJdGVtU2VydmljZSBzaG93Rm9yd2FyZERpYWxvZyB0byBmb3J3YXJkJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHdvcmtJdGVtSWQgPSAnd29ya0l0ZW0xMjM0JyxcbiAgICAgICAgICAgICAgICBjZXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUlkOiB3b3JrSXRlbUlkXG4gICAgICAgICAgICAgICAgfSwgY2FsbGJhY2tGbiA9ICgpID0+IHRydWU7XG4gICAgICAgICAgICBzcHlPbih3b3JrSXRlbVNlcnZpY2UsICdzaG93Rm9yd2FyZERpYWxvZycpO1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvblNlcnZpY2UuZm9yd2FyZENlcnRpZmljYXRpb24oY2VydCwgY2FsbGJhY2tGbik7XG4gICAgICAgICAgICBleHBlY3Qod29ya0l0ZW1TZXJ2aWNlLnNob3dGb3J3YXJkRGlhbG9nKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBsZXQgYXJncyA9IHdvcmtJdGVtU2VydmljZS5zaG93Rm9yd2FyZERpYWxvZy5jYWxscy5tb3N0UmVjZW50KCkuYXJncztcbiAgICAgICAgICAgIGV4cGVjdChhcmdzWzBdKS50b0VxdWFsKGNlcnQud29ya0l0ZW1JZCk7XG4gICAgICAgICAgICBleHBlY3QoYXJnc1sxXSkudG9FcXVhbChjYWxsYmFja0ZuKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
