System.register(['test/js/TestInitializer', 'accessRequest/AccessRequestModule', '../AccessRequestTestData'], function (_export) {
    'use strict';

    var accessRequestModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_accessRequestAccessRequestModule) {
            accessRequestModule = _accessRequestAccessRequestModule['default'];
        }, function (_AccessRequestTestData) {}],
        execute: function () {

            describe('AccessRequest', function () {
                var AccessRequest, accessRequest, identity1Data, identity2Data, identity3Data, noIdIdentityData, identity1, identity2, identity3, noIdIdentity;

                /**
                 * A mock result for feeding hasRoleRequest
                 * @param {boolean} isRole If the request should be for a role or not
                 * @returns {Function} A function that returns an array of mock requests
                 */
                function mockHasRoleRequest(isRole) {
                    return function () {
                        return [{
                            item: {
                                isRole: function () {
                                    return isRole;
                                }
                            }
                        }];
                    };
                }

                // Use the access request module.
                beforeEach(module(accessRequestModule));

                // Setup the dependencies.
                beforeEach(inject(function (_AccessRequest_) {
                    AccessRequest = _AccessRequest_;
                }));

                // Setup the test data.
                beforeEach(inject(function (Identity, accessRequestTestData) {
                    accessRequest = new AccessRequest(3);

                    identity1Data = accessRequestTestData.IDENTITY1;
                    identity2Data = accessRequestTestData.IDENTITY2;
                    identity3Data = accessRequestTestData.IDENTITY3;

                    identity1 = new Identity(identity1Data);
                    identity2 = new Identity(identity2Data);
                    identity3 = new Identity(identity3Data);

                    // Create an identity without an ID.
                    noIdIdentityData = angular.copy(identity1Data);
                    delete noIdIdentityData.id;
                    noIdIdentity = new Identity(noIdIdentityData);
                }));

                it('starts with no identities', function () {
                    var identities = accessRequest.getIdentities();
                    expect(identities).not.toBeNull();
                    expect(angular.isArray(identities)).toEqual(true);
                    expect(identities.length).toEqual(0);
                });

                describe('getIdentities()', function () {
                    it('returns identities that have been added', function () {
                        var identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);

                        identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(2);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                        expect(identities.indexOf(identity3)).toEqual(-1);
                    });

                    it('does not return identities that have been removed', function () {
                        var identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        accessRequest.removeIdentity(identity1);

                        identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                    });
                });

                describe('getIdentityIds()', function () {
                    it('returns identity ids that have been added', function () {
                        var identityIds;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);

                        identityIds = accessRequest.getIdentityIds();
                        expect(identityIds.length).toEqual(2);
                        expect(identityIds.indexOf(identity1.id)).toBeGreaterThan(-1);
                        expect(identityIds.indexOf(identity2.id)).toBeGreaterThan(-1);
                        expect(identityIds.indexOf(identity3.id)).toEqual(-1);
                    });

                    it('does not return identity ids that have been removed', function () {
                        var identityIds;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        accessRequest.removeIdentity(identity1);

                        identityIds = accessRequest.getIdentityIds();
                        expect(identityIds.length).toEqual(1);
                        expect(identityIds.indexOf(identity2.id)).toBeGreaterThan(-1);
                        expect(identityIds.indexOf(identity1.id)).toEqual(-1);
                    });
                });

                describe('getRequesteeId', function () {
                    it('returns an ID if a single identity is selected', function () {
                        accessRequest.addIdentity(identity1);
                        expect(accessRequest.getRequesteeId()).toEqual(identity1.getId());
                    });

                    it('returns null if no identities are selected', function () {
                        expect(accessRequest.getRequesteeId()).toBeNull();
                    });

                    it('returns null if multiple identities are selected', function () {
                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        expect(accessRequest.getRequesteeId()).toBeNull();
                    });
                });

                describe('hasIdentity()', function () {
                    it('returns false for a null identity', function () {
                        expect(accessRequest.hasIdentity(null)).toEqual(false);
                    });

                    it('blows up if there is no identity ID', function () {
                        expect(function () {
                            accessRequest.hasIdentity(noIdIdentity);
                        }).toThrow();
                    });

                    it('returns true for an identity that has been added', function () {
                        accessRequest.addIdentity(identity1);
                        expect(accessRequest.hasIdentity(identity1)).toEqual(true);
                    });

                    it('returns false for an identity that has not been added', function () {
                        expect(accessRequest.hasIdentity(identity1)).toEqual(false);
                    });

                    it('returns false for an identity that been added then removed', function () {
                        accessRequest.addIdentity(identity1);
                        accessRequest.removeIdentity(identity1);
                        expect(accessRequest.hasIdentity(identity1)).toEqual(false);
                    });
                });

                describe('hasIdentities()', function () {
                    it('returns false for a null identity', function () {
                        expect(accessRequest.hasIdentities(null)).toEqual(false);
                    });

                    it('blows up if there is no identity ID', function () {
                        expect(function () {
                            accessRequest.hasIdentities([noIdIdentity]);
                        }).toThrow();
                    });

                    it('returns true for an identity that has been added', function () {
                        accessRequest.addIdentity(identity1);
                        expect(accessRequest.hasIdentities([identity1])).toEqual(true);
                    });

                    it('returns false for an identity that has not been added', function () {
                        expect(accessRequest.hasIdentities([identity1])).toEqual(false);
                    });

                    it('returns false for an identity that been added then removed', function () {
                        accessRequest.addIdentity(identity1);
                        accessRequest.removeIdentity(identity1);
                        expect(accessRequest.hasIdentities([identity1])).toEqual(false);
                    });

                    it('returns true for multiple identities that have been added', function () {
                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        expect(accessRequest.hasIdentities([identity1, identity2])).toEqual(true);
                    });

                    it('returns false for multiple identities that have not been added', function () {
                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        expect(accessRequest.hasIdentities([identity1, identity2, identity3])).toEqual(false);
                    });
                });

                describe('addIdentity()', function () {
                    it('throws for null identity', function () {
                        expect(function () {
                            accessRequest.addIdentity(null);
                        }).toThrow();
                    });

                    it('blows up if there is no identity ID', function () {
                        expect(function () {
                            accessRequest.addIdentity(noIdIdentity);
                        }).toThrow();
                    });

                    it('adds a single identity', function () {
                        var result = accessRequest.addIdentity(identity1),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                    });

                    it('adds multiple identities', function () {
                        var result = accessRequest.addIdentity(identity1),
                            result2 = accessRequest.addIdentity(identity2),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(result2.failed).toEqual(false);
                        expect(identities.length).toEqual(2);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                    });

                    it('does not duplicate added identities', function () {
                        var result = accessRequest.addIdentity(identity1),
                            result2 = accessRequest.addIdentity(identity1),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(result2.failed).toEqual(false);
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                    });

                    it('should return error code if has removed access request', function () {
                        var response;
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.returnValue(['something']);
                        response = accessRequest.addIdentity(identity1);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(1);
                        expect(response.errors[0]).toBe(AccessRequest.ERRORS.HAS_REMOVED_ACCESS);
                    });

                    it('should return error code if has role request', function () {
                        var response;
                        spyOn(accessRequest, 'getRequestedItems').and.callFake(mockHasRoleRequest(true));
                        response = accessRequest.addIdentity(identity1);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(1);
                        expect(response.errors[0]).toBe(AccessRequest.ERRORS.HAS_ROLE_REQUESTS);
                    });

                    describe('max identity count validation', function () {
                        var response;

                        beforeEach(function () {
                            accessRequest = new AccessRequest(2);
                            response = accessRequest.addIdentities([identity1]);
                        });

                        it('should return error code if adding an identity would exceed max', function () {
                            response = accessRequest.addIdentity(identity1);
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentity(identity2);
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentity(identity3);
                            expect(response.failed).toBe(true);
                            expect(response.errors.length).toBe(1);
                            expect(response.errors[0]).toBe(AccessRequest.ERRORS.EXCEEDED_MAX_IDENTITY_COUNT);
                        });

                        it('should not return error code if adding duplicate identities', function () {
                            response = accessRequest.addIdentity(identity1);
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentity(identity2);
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentity(identity1);
                            expect(response.failed).toBe(false);
                            expect(accessRequest.getIdentities().length).toBe(2);
                        });

                        it('should only return error code for exceeding max identities if both max exceeded and has other error', function () {
                            response = accessRequest.addIdentity(identity1);
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentity(identity2);
                            expect(response.failed).toBe(false);
                            spyOn(accessRequest, 'getRequestedItems').and.callFake(mockHasRoleRequest(true));
                            response = accessRequest.addIdentity(identity3);
                            expect(response.failed).toBe(true);
                            expect(response.errors.length).toBe(1);
                            expect(response.errors[0]).toBe(AccessRequest.ERRORS.EXCEEDED_MAX_IDENTITY_COUNT);
                        });
                    });

                    it('should return both has role request and has removed access errors', function () {
                        var response;
                        spyOn(accessRequest, 'getRequestedItems').and.callFake(mockHasRoleRequest(true));
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.returnValue(['something']);
                        response = accessRequest.addIdentity(identity1);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(2);
                        expect(response.errors.indexOf(AccessRequest.ERRORS.HAS_ROLE_REQUESTS)).toBeGreaterThan(-1);
                        expect(response.errors.indexOf(AccessRequest.ERRORS.HAS_REMOVED_ACCESS)).toBeGreaterThan(-1);
                    });
                });

                describe('addIdentities()', function () {
                    it('throws for null identity list', function () {
                        expect(function () {
                            accessRequest.addIdentity(null);
                        }).toThrow();
                    });

                    it('throws for null identity in list', function () {
                        expect(function () {
                            accessRequest.addIdentity([null]);
                        }).toThrow();
                    });

                    it('blows up if there is no identity ID', function () {
                        expect(function () {
                            accessRequest.addIdentities([noIdIdentity]);
                        }).toThrow();
                    });

                    it('adds a single identity', function () {
                        var result = accessRequest.addIdentities([identity1]),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                    });

                    it('adds multiple identities', function () {
                        var result = accessRequest.addIdentities([identity1, identity2]),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(2);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                    });

                    it('does not duplicate identities', function () {
                        var result = accessRequest.addIdentities([identity1, identity1]),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toBeGreaterThan(-1);
                    });

                    it('should return error code if has removed access request', function () {
                        var response;
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.returnValue(['something']);
                        response = accessRequest.addIdentities([identity1]);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(1);
                        expect(response.errors[0]).toBe(AccessRequest.ERRORS.HAS_REMOVED_ACCESS);
                    });

                    it('should return error code if has role request', function () {
                        var response;
                        spyOn(accessRequest, 'getRequestedItems').and.callFake(mockHasRoleRequest(true));
                        response = accessRequest.addIdentities([identity1]);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(1);
                        expect(response.errors[0]).toBe(AccessRequest.ERRORS.HAS_ROLE_REQUESTS);
                    });

                    describe('max identity count validation', function () {
                        var response;

                        beforeEach(function () {
                            accessRequest = new AccessRequest(2);
                            response = accessRequest.addIdentities([identity1]);
                        });

                        it('should return error code if adding an identity would exceed max', function () {
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentities([identity2, identity3]);
                            expect(response.failed).toBe(true);
                            expect(response.errors.length).toBe(1);
                            expect(response.errors[0]).toBe(AccessRequest.ERRORS.EXCEEDED_MAX_IDENTITY_COUNT);
                        });

                        it('should not return error code if adding duplicate identities', function () {
                            response = accessRequest.addIdentities([identity1]);
                            expect(response.failed).toBe(false);
                            response = accessRequest.addIdentities([identity1, identity2]);
                            expect(response.failed).toBe(false);
                            expect(accessRequest.getIdentities().length).toBe(2);
                        });

                        it('should only return error code for exceeding max identities if both max exceeded and has other error', function () {
                            response = accessRequest.addIdentities([identity1]);
                            expect(response.failed).toBe(false);
                            spyOn(accessRequest, 'getRequestedItems').and.callFake(mockHasRoleRequest(true));
                            response = accessRequest.addIdentities([identity2, identity3]);
                            expect(response.failed).toBe(true);
                            expect(response.errors.length).toBe(1);
                            expect(response.errors[0]).toBe(AccessRequest.ERRORS.EXCEEDED_MAX_IDENTITY_COUNT);
                        });
                    });

                    it('should return both has role request and has removed access errors', function () {
                        var response;
                        spyOn(accessRequest, 'getRequestedItems').and.callFake(mockHasRoleRequest(true));
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.returnValue(['something']);
                        response = accessRequest.addIdentities([identity1, identity2]);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(2);
                        expect(response.errors.indexOf(AccessRequest.ERRORS.HAS_ROLE_REQUESTS)).toBeGreaterThan(-1);
                        expect(response.errors.indexOf(AccessRequest.ERRORS.HAS_REMOVED_ACCESS)).toBeGreaterThan(-1);
                    });
                });

                describe('removeIdentity()', function () {
                    it('throws for null identity', function () {
                        expect(function () {
                            accessRequest.removeIdentity(null);
                        }).toThrow();
                    });

                    it('does nothing if no identities have been added', function () {
                        var result = accessRequest.removeIdentity(identity1),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(0);
                    });

                    it('blows up if there is no identity ID', function () {
                        expect(function () {
                            accessRequest.removeIdentity(noIdIdentity);
                        }).toThrow();
                    });

                    it('removes a single identity', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);

                        result = accessRequest.removeIdentity(identity1);
                        identities = accessRequest.getIdentities();

                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                    });

                    it('removes multiple identities', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        accessRequest.addIdentity(identity3);

                        result = accessRequest.removeIdentity(identity1);
                        expect(result.failed).toEqual(false);
                        result = accessRequest.removeIdentity(identity2);
                        expect(result.failed).toEqual(false);

                        identities = accessRequest.getIdentities();

                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                        expect(identities.indexOf(identity2)).toEqual(-1);
                        expect(identities.indexOf(identity3)).toBeGreaterThan(-1);
                    });

                    it('does not remove the same identity twice', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);

                        result = accessRequest.removeIdentity(identity1);
                        expect(result.failed).toEqual(false);
                        identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(1);

                        result = accessRequest.removeIdentity(identity1);
                        expect(result.failed).toEqual(false);
                        identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(1);
                    });

                    it('should remove account selections for specified identity', function () {
                        var identityId = 'someid',
                            item = {
                            getId: function () {
                                return 1;
                            }
                        },
                            accountSelection1 = {
                            identityId: identityId
                        },
                            accountSelection2 = {
                            identityId: 'someotherid'
                        },
                            accountSelections = [accountSelection1, accountSelection2],
                            requestedItem;
                        /* Setup a fake requsted access item with fake requests */
                        accessRequest.addRequestedItem(item);
                        accessRequest.setRequestedItemAccountSelections(item, accountSelections);
                        /* Remove identity in on of the account selections */
                        accessRequest.removeIdentity({
                            getId: function () {
                                return identityId;
                            }
                        });
                        /* Verify requested item is updated*/
                        requestedItem = accessRequest.getRequestedItem(item);
                        expect(requestedItem.accountSelections.length).toEqual(1);
                        expect(requestedItem.accountSelections[0]).toBe(accountSelection2);
                    });

                    it('should return error code if has removed access request', function () {
                        var response;
                        accessRequest.addIdentity(identity1);
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.returnValue(['something']);
                        response = accessRequest.removeIdentity(identity1);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(1);
                        expect(response.errors[0]).toBe(AccessRequest.ERRORS.HAS_REMOVED_ACCESS);
                    });
                });

                describe('removeAllIdentities()', function () {
                    it('does nothing for an empty identity array', function () {
                        var identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(0);
                    });

                    it('removes a single identity', function () {
                        var identities;

                        accessRequest.addIdentity(identity1);

                        accessRequest.removeAllIdentities();
                        identities = accessRequest.getIdentities();

                        expect(identities.length).toEqual(0);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                    });

                    it('removes multiple identities', function () {
                        var identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        accessRequest.addIdentity(identity3);

                        accessRequest.removeAllIdentities();

                        identities = accessRequest.getIdentities();

                        expect(identities.length).toEqual(0);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                        expect(identities.indexOf(identity2)).toEqual(-1);
                        expect(identities.indexOf(identity3)).toEqual(-1);
                    });

                    it('should remove all account selections', function () {
                        var item1 = {
                            getId: function () {
                                return 1;
                            }
                        },
                            item2 = {
                            getId: function () {
                                return 2;
                            }
                        },
                            accountSelections1 = [{}, {}],
                            accountSelections2 = [{}],
                            requestedItem;
                        /* Setup a fake requsted access item with fake requests */
                        accessRequest.addRequestedItem(item1);
                        accessRequest.setRequestedItemAccountSelections(item1, accountSelections1);
                        accessRequest.addRequestedItem(item2);
                        accessRequest.setRequestedItemAccountSelections(item2, accountSelections2);
                        /* Remove identity in on of the account selections */
                        accessRequest.removeAllIdentities();
                        /* Verify requested item is updated*/
                        requestedItem = accessRequest.getRequestedItem(item1);
                        expect(requestedItem.accountSelections.length).toEqual(0);
                        requestedItem = accessRequest.getRequestedItem(item2);
                        expect(requestedItem.accountSelections.length).toEqual(0);
                    });

                    it('should not do any validation', function () {
                        var response;
                        accessRequest.addIdentity(identity1);
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.callThrough();
                        spyOn(accessRequest, 'getRequestedItems').and.callThrough();
                        response = accessRequest.removeAllIdentities();
                        expect(accessRequest.getRemovedCurrentAccessItems).not.toHaveBeenCalled();
                        expect(accessRequest.getRequestedItems).not.toHaveBeenCalled();
                        expect(response.failed).toBe(false);
                        expect(response.errors.length).toBe(0);
                    });
                });

                describe('removeIdentities()', function () {
                    it('throws for null identity list', function () {
                        expect(function () {
                            accessRequest.removeIdentities(null);
                        }).toThrow();
                    });

                    it('throws for null identity in list', function () {
                        expect(function () {
                            accessRequest.removeIdentities([null]);
                        }).toThrow();
                    });

                    it('does nothing if no identities have been added', function () {
                        var result = accessRequest.removeIdentities([identity1]),
                            identities = accessRequest.getIdentities();
                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(0);
                    });

                    it('blows up if there is no identity ID', function () {
                        expect(function () {
                            accessRequest.removeIdentities([noIdIdentity]);
                        }).toThrow();
                    });

                    it('removes a single identity', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);

                        result = accessRequest.removeIdentities([identity1]);
                        identities = accessRequest.getIdentities();

                        expect(result.failed).toEqual(false);
                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                    });

                    it('removes multiple identities', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        accessRequest.addIdentity(identity3);

                        result = accessRequest.removeIdentities([identity1, identity2]);
                        expect(result.failed).toEqual(false);

                        identities = accessRequest.getIdentities();

                        expect(identities.length).toEqual(1);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                        expect(identities.indexOf(identity2)).toEqual(-1);
                        expect(identities.indexOf(identity3)).toBeGreaterThan(-1);
                    });

                    it('removes multiple identities only once', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);
                        accessRequest.addIdentity(identity3);

                        result = accessRequest.removeIdentities([identity1, identity1]);
                        expect(result.failed).toEqual(false);

                        identities = accessRequest.getIdentities();

                        expect(identities.length).toEqual(2);
                        expect(identities.indexOf(identity1)).toEqual(-1);
                        expect(identities.indexOf(identity2)).toBeGreaterThan(-1);
                        expect(identities.indexOf(identity3)).toBeGreaterThan(-1);
                    });

                    it('does not remove the same identity twice', function () {
                        var result, identities;

                        accessRequest.addIdentity(identity1);
                        accessRequest.addIdentity(identity2);

                        result = accessRequest.removeIdentities([identity1]);
                        expect(result.failed).toEqual(false);
                        identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(1);

                        result = accessRequest.removeIdentities([identity1]);
                        expect(result.failed).toEqual(false);
                        identities = accessRequest.getIdentities();
                        expect(identities.length).toEqual(1);
                    });

                    it('should return error code if has removed access request', function () {
                        var response;
                        accessRequest.addIdentities([identity1, identity2, identity3]);
                        spyOn(accessRequest, 'getRemovedCurrentAccessItems').and.returnValue(['something']);
                        response = accessRequest.removeIdentities([identity1, identity3]);
                        expect(response.failed).toBe(true);
                        expect(response.errors.length).toBe(1);
                        expect(response.errors[0]).toBe(AccessRequest.ERRORS.HAS_REMOVED_ACCESS);
                    });
                });

                ////////////////////////////////////////////////////////////////////////////
                //
                // ADDED ACCESS REQUEST ITEM TESTS
                //
                ////////////////////////////////////////////////////////////////////////////

                describe('added access request items methods', function () {

                    var item1Data, item2Data, item3Data, noIdItemData, item1, item2, item3, noIdItem, requestedItem1, requestedItem2, requestedItem3;

                    // Setup the test data.
                    beforeEach(inject(function (AccessRequestItem, RequestedAccessItem, accessRequestTestData) {

                        item1Data = accessRequestTestData.ROLE;
                        item2Data = accessRequestTestData.ENTITLEMENT;
                        item3Data = accessRequestTestData.IDENTITY_SEARCH_ROLE;

                        item1 = new AccessRequestItem(item1Data);
                        item2 = new AccessRequestItem(item2Data);
                        item3 = new AccessRequestItem(item3Data);

                        requestedItem1 = new RequestedAccessItem(item1);
                        requestedItem2 = new RequestedAccessItem(item2);
                        requestedItem3 = new RequestedAccessItem(item3);

                        // Create an item without an ID.
                        noIdItemData = angular.copy(item1Data);
                        delete noIdItemData.id;
                        noIdItem = new AccessRequestItem(noIdItemData);
                    }));

                    it('starts with no items', function () {
                        var items = accessRequest.getRequestedItems();
                        expect(items).not.toBeNull();
                        expect(angular.isArray(items)).toEqual(true);
                        expect(items.length).toEqual(0);
                    });

                    /**
                     * Return the RequestedAccessItem in the given list that represents
                     * the given AccessRequestItem.
                     *
                     * @param {AccessRequestItem} item  The item to search for.
                     * @param {Array<RequestedAccessItem>} requestedItems  The requested
                     *    items to search within.
                     *
                     * @return {RequestedAccessItem} The matching requested item if found,
                     *    or null otherwise.
                     *
                     * @throws If multiple requested items match the given item.
                     */
                    function findRequestedItem(item, requestedItems) {
                        var filtered = requestedItems.filter(function (requestedItem) {
                            return item.getId() === requestedItem.item.getId();
                        });

                        if (filtered.length > 1) {
                            throw 'Found more than one requested item ... oops.';
                        }

                        return filtered.length === 1 ? filtered[0] : null;
                    }

                    describe('getRequestedItems()', function () {
                        it('returns items that have been added', function () {
                            var items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            items = accessRequest.getRequestedItems();
                            expect(items.length).toEqual(2);
                            expect(findRequestedItem(item1, items)).not.toBeNull();
                            expect(findRequestedItem(item2, items)).not.toBeNull();
                            expect(findRequestedItem(item3, items)).toBeNull();
                        });

                        it('does not return items that have been removed', function () {
                            var items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);
                            accessRequest.removeRequestedItem(item1);

                            items = accessRequest.getRequestedItems();
                            expect(items.length).toEqual(1);
                            expect(findRequestedItem(item2, items)).not.toBeNull();
                            expect(findRequestedItem(item1, items)).toBeNull();
                        });
                    });

                    describe('hasRequestedItem()', function () {
                        it('returns false for a null item', function () {
                            expect(accessRequest.hasRequestedItem(null)).toEqual(false);
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.hasRequestedItem(noIdItem);
                            }).toThrow();
                        });

                        it('returns true for an item that has been added', function () {
                            accessRequest.addRequestedItem(item1);
                            expect(accessRequest.hasRequestedItem(item1)).toEqual(true);
                        });

                        it('returns false for an item that has not been added', function () {
                            expect(accessRequest.hasRequestedItem(item1)).toEqual(false);
                        });

                        it('returns false for an item that been added then removed', function () {
                            accessRequest.addRequestedItem(item1);
                            accessRequest.removeRequestedItem(item1);
                            expect(accessRequest.hasRequestedItem(item1)).toEqual(false);
                        });
                    });

                    describe('addRequestedItem()', function () {
                        it('blows up for a null item', function () {
                            expect(function () {
                                accessRequest.addRequestedItem(null);
                            }).toThrow();
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.addRequestedItem(noIdItem);
                            }).toThrow();
                        });

                        it('adds a single item', function () {
                            var result = accessRequest.addRequestedItem(item1),
                                items = accessRequest.getRequestedItems();
                            expect(result).toEqual(true);
                            expect(items.length).toEqual(1);
                            expect(findRequestedItem(item1, items)).not.toBeNull();
                        });

                        it('adds multiple items', function () {
                            var result = accessRequest.addRequestedItem(item1),
                                result2 = accessRequest.addRequestedItem(item2),
                                items = accessRequest.getRequestedItems();
                            expect(result).toEqual(true);
                            expect(result2).toEqual(true);
                            expect(items.length).toEqual(2);
                            expect(findRequestedItem(item1, items)).not.toBeNull();
                            expect(findRequestedItem(item2, items)).not.toBeNull();
                        });

                        it('does not add the same item twice', function () {
                            var result = accessRequest.addRequestedItem(item1),
                                result2 = accessRequest.addRequestedItem(item1),
                                items = accessRequest.getRequestedItems();
                            expect(result).toEqual(true);
                            expect(result2).toEqual(false);
                            expect(items.length).toEqual(1);
                            expect(findRequestedItem(item1, items)).not.toBeNull();
                        });

                        it('sets the permittedById when a permittedBy item is supplied', function () {
                            var result = accessRequest.addRequestedItem(item1, item2),
                                requestedItem;
                            expect(result).toEqual(true);

                            expect(accessRequest.getRequestedItems().length).toEqual(1);
                            requestedItem = accessRequest.getRequestedItems()[0];
                            expect(requestedItem.item).toEqual(item1);
                            expect(requestedItem.permittedById).toEqual(item2.getId());
                        });
                    });

                    describe('removeRequestedItem()', function () {
                        it('does nothing for a null item', function () {
                            var result = accessRequest.removeRequestedItem(null),
                                items = accessRequest.getRequestedItems();
                            expect(result).toEqual(false);
                            expect(items.length).toEqual(0);
                        });

                        it('does nothing if no items have been added', function () {
                            var result = accessRequest.removeRequestedItem(item1),
                                items = accessRequest.getRequestedItems();
                            expect(result).toEqual(false);
                            expect(items.length).toEqual(0);
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.removeRequestedItem(noIdItem);
                            }).toThrow();
                        });

                        it('removes a single item', function () {
                            var result, items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            result = accessRequest.removeRequestedItem(item1);
                            items = accessRequest.getRequestedItems();

                            expect(result).toEqual(true);
                            expect(items.length).toEqual(1);
                            expect(findRequestedItem(item1, items)).toBeNull();
                            expect(findRequestedItem(item2, items)).not.toBeNull();
                        });

                        it('removes multiple items', function () {
                            var result, items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);
                            accessRequest.addRequestedItem(item3);

                            result = accessRequest.removeRequestedItem(item1);
                            expect(result).toEqual(true);
                            result = accessRequest.removeRequestedItem(item2);
                            expect(result).toEqual(true);

                            items = accessRequest.getRequestedItems();

                            expect(items.length).toEqual(1);
                            expect(findRequestedItem(item1, items)).toBeNull();
                            expect(findRequestedItem(item2, items)).toBeNull();
                            expect(findRequestedItem(item3, items)).not.toBeNull();
                        });

                        it('does not remove the same item twice', function () {
                            var result, items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            result = accessRequest.removeRequestedItem(item1);
                            expect(result).toEqual(true);
                            items = accessRequest.getRequestedItems();
                            expect(items.length).toEqual(1);

                            result = accessRequest.removeRequestedItem(item1);
                            expect(result).toEqual(false);
                            items = accessRequest.getRequestedItems();
                            expect(items.length).toEqual(1);
                        });

                        it('removes requested permitted items along with top level item', function () {
                            var result, items;

                            // Add an item and a couple of permits.
                            accessRequest.addRequestedItem(item1, null);
                            accessRequest.addRequestedItem(item2, item1);
                            accessRequest.addRequestedItem(item3, item1);

                            // Remove permitted role, only removes that one
                            result = accessRequest.removeRequestedItem(item3);
                            expect(result).toEqual(true);
                            items = accessRequest.getRequestedItems();
                            expect(items.length).toEqual(2);

                            // Remove top level role, removes permitted role too
                            result = accessRequest.removeRequestedItem(item1);
                            expect(result).toEqual(true);
                            items = accessRequest.getRequestedItems();
                            expect(items.length).toEqual(0);
                        });

                        it('adds approval item id to the removed approvals items list', function () {
                            var requestedAccessItem;
                            accessRequest.addRequestedItem(item1, null);
                            requestedAccessItem = accessRequest.getRequestedItem(item1);
                            requestedAccessItem.setApprovalItemId('ThisIsATest');
                            expect(accessRequest.getRemovedApprovalItems().length).toBe(0);
                            accessRequest.removeRequestedItem(requestedAccessItem);
                            expect(accessRequest.getRemovedApprovalItems().length).toBe(1);
                        });

                        describe('copy account selections', function () {

                            /**
                             * When getAdditionalQuestions() calls are made, we need to know which account
                             * selections get passed in with the "otherAddedRoles".  Unfortunately, by the
                             * time that we can check these in our test code, the RequestedAccessItem has
                             * already been modified (ie - the account selections are different then what
                             * was made in the call).  For this reason, we need to capture the account selections
                             * when the call is made so we can check them later.
                             */
                            function AdditionalQuestionsRequestSaver() {
                                // The index of the current call to getAdditionalQuestions().  This gets
                                // incremented when we save the account selections.
                                var addtQuestionsCallCounter = 0;

                                // An array of the saved account selections, indexed by the call number to
                                // getAdditionalQuestions().  Each element is an object that maps the unique
                                // ID of the RequestedAccessItem to the saved account selections.
                                var accountSelectionsByCall = [];

                                /**
                                 * Save the account selections for the given roles for the current call to
                                 * getAdditionalQuestions().  Note that this must be only called once per
                                 * call to getAdditionalQuestions() because it increments our call counter.
                                 *
                                 * @param {Array<RequestedAccessItem>} otherAddedRoles  The otherAddedRoles
                                 *    parameter that was passed to getAdditionalQuestions().
                                 */
                                this.saveOtherAddedRolesAccountSelections = function (otherAddedRoles) {
                                    // Create some account selections.  There shouldn't be any for this call yet.
                                    var acctSelsByItem = {};
                                    accountSelectionsByCall[addtQuestionsCallCounter] = acctSelsByItem;

                                    // Iterate over each role, saving the account selections that were
                                    // made for each.
                                    if (otherAddedRoles) {
                                        otherAddedRoles.forEach(function (role) {
                                            var acctSels = null;
                                            if (role.accountSelections) {
                                                // Save a copy.
                                                acctSels = role.accountSelections.slice(0);
                                            }
                                            acctSelsByItem[role.getUniqueId()] = acctSels;
                                        });
                                    }

                                    // Now that we're done ... increment the call counter.
                                    addtQuestionsCallCounter++;
                                };

                                /**
                                 * Return the account selections that were passed into the given call to
                                 * getAdditionalQuestions().
                                 *
                                 * @param {Number} callIdx  The call number to getAdditionalQuestions().
                                 * @param {RequestedAccessItem} role  The role for which to return selections.
                                 *
                                 * @return {Array<IdentityAccountSelection>} The account selections that were
                                 *    passed into the given call getAdditionalQuestions().
                                 */
                                this.getAccountSelections = function (callIdx, role) {
                                    var acctSelsByItem;

                                    if (callIdx >= accountSelectionsByCall.length) {
                                        throw 'Boom! We did not call additional questions service that many times.';
                                    }

                                    acctSelsByItem = accountSelectionsByCall[callIdx];
                                    return acctSelsByItem[role.getUniqueId()];
                                };
                            }

                            var AccessRequestAdditionalQuestions, accessRequestItemsService, $q, addtQuestions, addtQuestionsRequestSaver, item4Data, acctSel1Data, acctSel2Data, IdentityAccountSelection, item2AcctSels, item4, $rootScope;

                            /* jshint maxparams: 7 */
                            beforeEach(inject(function (_IdentityAccountSelection_, AccessRequestItem, _AccessRequestAdditionalQuestions_, _accessRequestItemsService_, _$rootScope_, _$q_, accessRequestTestData) {
                                IdentityAccountSelection = _IdentityAccountSelection_;
                                accessRequestItemsService = _accessRequestItemsService_;
                                AccessRequestAdditionalQuestions = _AccessRequestAdditionalQuestions_;
                                $q = _$q_;
                                $rootScope = _$rootScope_;

                                item4Data = accessRequestTestData.PERMITTED_ROLE;
                                acctSel1Data = accessRequestTestData.IDENTITY_ACCT_SELECTION1;
                                acctSel2Data = accessRequestTestData.IDENTITY_ACCT_SELECTION2;

                                addtQuestions = new AccessRequestAdditionalQuestions({});
                                addtQuestionsRequestSaver = new AdditionalQuestionsRequestSaver();
                                spyOn(accessRequestItemsService, 'getAdditionalQuestions').and.callFake(function (accessRequestItem, identityIds, permittedBy, assignmentId, otherAddedRoles) {
                                    addtQuestionsRequestSaver.saveOtherAddedRolesAccountSelections(otherAddedRoles);
                                    return $q.when(addtQuestions);
                                });

                                item4 = new AccessRequestItem(item4Data);

                                // Add an item and one that is permitted by the item.
                                accessRequest.addRequestedItem(item1, null);
                                accessRequest.addRequestedItem(item2, item1);

                                // Set up account selections on the permit.
                                item2AcctSels = [new IdentityAccountSelection(acctSel1Data)];
                                accessRequest.getRequestedItem(item2).setAccountSelections(item2AcctSels);
                            }));

                            it('throws if permitting item is not found', function () {
                                // Give the permit a fake permittedById that won't be found.
                                accessRequest.getRequestedItem(item2).permittedById = 'not there';
                                expect(function () {
                                    accessRequest.removeRequestedItem(item2);
                                }).toThrow();
                            });

                            it('retrieves additional questions for each peer', function () {
                                addtQuestions = new AccessRequestAdditionalQuestions({
                                    accountSelections: [acctSel1Data]
                                });
                                // Add a couple of peers to item2.
                                accessRequest.addRequestedItem(item3, item1);
                                accessRequest.addRequestedItem(item4, item1);

                                // Remove it and let the promises fly!!
                                accessRequest.removeRequestedItem(item2);
                                $rootScope.$apply();

                                // Make sure it was called appropriately.
                                expect(accessRequestItemsService.getAdditionalQuestions.calls.count()).toEqual(2);

                                // Ensure that on the second call, the account selections from the
                                // first call get sent in the request.  Item4 should have selections
                                // on it.
                                checkAdditionalQuestionsCall(0, item4, [item3, item1], [null, null]);
                                checkAdditionalQuestionsCall(1, item3, [item4, item1], [[acctSel1Data], null]);
                            });

                            /**
                             * Check that getAdditionalQuestions was called with the given item and
                             * otherItems parameters.
                             *
                             * @param {Number} callIdx  The index of the additional questions call.
                             * @param {AccessRequestItem} permittedItem  The item that was called.
                             * @param {Array<AccessRequestItem>} otherItems  The other items that were
                             *    passed to the call to getAdditionalQuestions.
                             * @param {Array<IdentityAccountSelection>} otherItemAcctSels  An array
                             *    that contains the account selections that should have been sent
                             *    in the getAdditionalQuestions() call with the AccessRequestItem
                             *    of the corresponding index of the otherItems array.
                             */
                            function checkAdditionalQuestionsCall(callIdx, permittedItem, otherItems, otherItemAcctSels) {
                                // Grab the requested call.
                                var foundCall = accessRequestItemsService.getAdditionalQuestions.calls.all()[callIdx];

                                // Ensure that this call was for the expected permitted item.
                                expect(foundCall.args[0]).toEqual(permittedItem);

                                // Check the args.
                                expect(foundCall.args[0]).toEqual(permittedItem);
                                expect(foundCall.args[1]).toEqual(accessRequest.getIdentityIds());
                                expect(foundCall.args[2]).toEqual(item1);
                                expect(foundCall.args[3]).toBeNull();
                                expect(foundCall.args[4].length).toEqual(otherItems.length);

                                // Make sure that the account selections that were sent with each
                                // other item are as we expected.
                                otherItems.forEach(function (otherItem, idx) {
                                    var requestedItem = accessRequest.getRequestedItem(otherItem),
                                        sentRequestedItems = foundCall.args[4],
                                        sentRequestedItemIdx = sentRequestedItems.indexOf(requestedItem),
                                        expectedAcctSels = otherItemAcctSels[idx],
                                        actualAcctSels;

                                    // These items may be an any random order, so we have to search.
                                    // Make sure we found the sent item we are looking for.
                                    expect(sentRequestedItemIdx > -1).toEqual(true);

                                    // Grab the account selections that were captured when the call
                                    // was made.  This is necessary to use (instead of from the actual
                                    // requested item) because by this point the account selections on
                                    // the requested item will have been updated.
                                    actualAcctSels = addtQuestionsRequestSaver.getAccountSelections(callIdx, requestedItem);

                                    if (!expectedAcctSels) {
                                        expect(actualAcctSels).toBeFalsy();
                                    } else {
                                        expect(actualAcctSels.length).toEqual(expectedAcctSels.length);
                                    }
                                });
                            }

                            it('looks for removed targets for each target returned by additional questions', function () {
                                // Set up the getAdditionalQuestions() mock to return some account selections.
                                addtQuestions = new AccessRequestAdditionalQuestions({
                                    accountSelections: [new IdentityAccountSelection(acctSel1Data), new IdentityAccountSelection(acctSel2Data)]
                                });

                                accessRequest.addRequestedItem(item3, item1);

                                // Spy on the find method.
                                spyOn(IdentityAccountSelection, 'find');

                                // Remove an item ... this should look for all 4 targets returned by addt questions.
                                accessRequest.removeRequestedItem(item2);
                                $rootScope.$apply();

                                expect(IdentityAccountSelection.find.calls.count()).toEqual(4);

                                checkFindCall(0, addtQuestions.accountSelections[0], addtQuestions.accountSelections[0].provisioningTargets[0]);
                                checkFindCall(1, addtQuestions.accountSelections[0], addtQuestions.accountSelections[0].provisioningTargets[1]);
                                checkFindCall(2, addtQuestions.accountSelections[1], addtQuestions.accountSelections[1].provisioningTargets[0]);
                                checkFindCall(3, addtQuestions.accountSelections[1], addtQuestions.accountSelections[1].provisioningTargets[1]);
                            });

                            function checkFindCall(callIdx, acctSel, target) {
                                var args = IdentityAccountSelection.find.calls.all()[callIdx].args;
                                expect(args[0]).toEqual(item2AcctSels);
                                expect(args[1]).toEqual(acctSel);
                                expect(args[2]).toEqual(target);
                            }

                            it('does not merge removed targets onto peers if not returned by additional questions', function () {
                                var requestedItem;

                                // Add another item that could have the selections copied to it.
                                accessRequest.addRequestedItem(item3, item1);

                                spyOn(IdentityAccountSelection, 'mergeAccountSelections').and.callThrough();

                                // Fire!  Additional questions returns no account selections.
                                accessRequest.removeRequestedItem(item2);
                                $rootScope.$apply();

                                // Verify that item3 still doesn't have account selections.
                                requestedItem = accessRequest.getRequestedItem(item3);
                                expect(requestedItem.accountSelections).toBeNull();

                                expect(IdentityAccountSelection.mergeAccountSelections).not.toHaveBeenCalled();
                            });

                            it('merges removed targets onto peers if returned by additional questions', function () {
                                var requestedItem;

                                // Set up the getAdditionalQuestions() mock to return some account selections.
                                addtQuestions = new AccessRequestAdditionalQuestions({
                                    accountSelections: [new IdentityAccountSelection(acctSel1Data)]
                                });

                                // Add another item that will have the selections copied to it.
                                accessRequest.addRequestedItem(item3, item1);

                                spyOn(IdentityAccountSelection, 'mergeAccountSelections').and.callThrough();

                                // Fire!
                                accessRequest.removeRequestedItem(item2);
                                $rootScope.$apply();

                                // Verify that item3 has the selections merged onto it.
                                requestedItem = accessRequest.getRequestedItem(item3);
                                expect(requestedItem.accountSelections.length).toEqual(1);
                                expect(requestedItem.accountSelections[0].getProvisioningTargets().length).toEqual(2);

                                expect(IdentityAccountSelection.mergeAccountSelections).toHaveBeenCalled();
                            });

                            it('does not throw when removing the only permit with account selection', function () {
                                accessRequest.addRequestedItem(item1);
                                accessRequest.addRequestedItem(item3, item1);
                                accessRequest.setRequestedItemAccountSelections(item3, [{
                                    identityId: 'someId'
                                }]);
                                // Remove permitted role, do not throw
                                expect(function () {
                                    accessRequest.removeRequestedItem(item3);
                                }).not.toThrow();
                            });
                        });
                    });

                    describe('clearRequestedItems()', function () {
                        it('removes all requested items', inject(function (AccessRequestItem, accessRequestTestData) {
                            var item1Data = accessRequestTestData.ROLE,
                                item2Data = accessRequestTestData.ENTITLEMENT,
                                item1 = new AccessRequestItem(item1Data),
                                item2 = new AccessRequestItem(item2Data);

                            // Start with some items.
                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            // Clear and check.
                            accessRequest.clearRequestedItems();
                            expect(accessRequest.getRequestedItems().length).toEqual(0);
                        }));
                    });

                    describe('setRequestedItemAccountSelections()', function () {
                        var accountSelections = [{}];
                        it('blows up if no items have been added', function () {
                            expect(function () {
                                accessRequest.setRequestedItemAccountSelections(item1);
                            }).toThrow();
                        });

                        it('blows up if no item is sent', function () {
                            expect(function () {
                                accessRequest.setRequestedItemAccountSelections(null);
                            }).toThrow();
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.setRequestedItemAccountSelections(noIdItem);
                            }).toThrow();
                        });

                        it('sets account selections for one item', function () {
                            var items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            accessRequest.setRequestedItemAccountSelections(item1, accountSelections);
                            items = accessRequest.getRequestedItems();

                            expect(items.length).toEqual(2);
                            expect(findRequestedItem(item1, items).accountSelections).toEqual(accountSelections);
                            expect(findRequestedItem(item2, items).accountSelections).toBeNull();
                        });

                        it('sets account selections for multiple items', function () {
                            var items;

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);
                            accessRequest.addRequestedItem(item3);

                            accessRequest.setRequestedItemAccountSelections(item1, accountSelections);
                            accessRequest.setRequestedItemAccountSelections(item2, accountSelections);

                            items = accessRequest.getRequestedItems();

                            expect(findRequestedItem(item1, items).accountSelections).toEqual(accountSelections);
                            expect(findRequestedItem(item2, items).accountSelections).toEqual(accountSelections);
                            expect(findRequestedItem(item3, items).accountSelections).toBeNull();
                        });

                        it('overwrites account selections', function () {
                            var newAccountSelections = [{}, {}],
                                items;

                            accessRequest.addRequestedItem(item1);

                            accessRequest.setRequestedItemAccountSelections(item1, accountSelections);
                            items = accessRequest.getRequestedItems();
                            expect(findRequestedItem(item1, items).accountSelections).toEqual(accountSelections);

                            accessRequest.setRequestedItemAccountSelections(item1, newAccountSelections);
                            items = accessRequest.getRequestedItems();
                            expect(findRequestedItem(item1, items).accountSelections).toEqual(newAccountSelections);
                        });
                    });

                    describe('getRequestedPermittedItems()', function () {
                        it('blows chunks with a null permittedBy', function () {
                            expect(function () {
                                accessRequest.getRequestedPermittedItems(null);
                            }).toThrow();
                        });

                        it('returns an empty array if nothing has been selected', function () {
                            expect(accessRequest.getRequestedPermittedItems(requestedItem1)).toEqual([]);
                        });

                        it('returns an empty array if there are no permits selected', function () {
                            // Add an item but no permit.
                            accessRequest.addRequestedItem(item1);
                            expect(accessRequest.getRequestedPermittedItems(requestedItem1)).toEqual([]);
                        });

                        it('returns the selected permits', function () {
                            var permits;

                            // Add an item and a couple of permits.
                            accessRequest.addRequestedItem(item1, null);
                            accessRequest.addRequestedItem(item2, item1);
                            accessRequest.addRequestedItem(item3, item1);

                            permits = accessRequest.getRequestedPermittedItems(requestedItem1);
                            expect(findRequestedItem(item1, permits)).toBeNull();
                            expect(findRequestedItem(item2, permits)).not.toBeNull();
                            expect(findRequestedItem(item3, permits)).not.toBeNull();
                        });
                    });

                    describe('getTopLevelRequestedItems()', function () {
                        it('returns an empty array if nothing has been selected', function () {
                            expect(accessRequest.getTopLevelRequestedItems()).toEqual([]);
                        });

                        it('returns only the top level requested items', function () {
                            var topLevelItems;

                            // Add an item and a couple of permits.
                            accessRequest.addRequestedItem(item1, null);
                            accessRequest.addRequestedItem(item2, item1);
                            accessRequest.addRequestedItem(item3, item1);

                            topLevelItems = accessRequest.getTopLevelRequestedItems();
                            expect(topLevelItems).toBeDefined();
                            expect(topLevelItems.length).toEqual(1);
                            expect(findRequestedItem(item1, topLevelItems)).not.toBeNull();
                            expect(findRequestedItem(item2, topLevelItems)).toBeNull();
                            expect(findRequestedItem(item3, topLevelItems)).toBeNull();
                        });
                    });

                    describe('getRequestedItem()', function () {
                        it('should return the requested item if present', function () {
                            accessRequest.addRequestedItem(item1);
                            var requestedItem = accessRequest.getRequestedItem(item1);
                            expect(requestedItem).toEqual(requestedItem1);
                        });

                        it('should return undefined if item is not present', function () {
                            var requestedItem = accessRequest.getRequestedItem({
                                getId: function () {
                                    return 'does not exist';
                                }
                            });
                            expect(requestedItem).toBeUndefined();
                        });
                    });

                    describe('getRequestedItemById()', function () {
                        it('should return the requested item if present', function () {
                            accessRequest.addRequestedItem(item1);
                            var requestedItem = accessRequest.getRequestedItemById(item1.getId());
                            expect(requestedItem).toEqual(requestedItem1);
                        });

                        it('should return undefined if item is not present', function () {
                            var requestedItem = accessRequest.getRequestedItemById('not a real ID');
                            expect(requestedItem).toBeUndefined();
                        });
                    });

                    describe('setAssignmentId()', function () {
                        var assignmentId = 'assignment1';
                        it('blows up if no items have been added', function () {
                            expect(function () {
                                accessRequest.setAssignmentId(item1);
                            }).toThrow();
                        });

                        it('blows up if no item is sent', function () {
                            expect(function () {
                                accessRequest.setAssignmentId(null);
                            }).toThrow();
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.setAssignmentId(noIdItem);
                            }).toThrow();
                        });

                        it('sets assignment id', function () {
                            var items,
                                assignmentId2 = 'blahblah';

                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            accessRequest.setAssignmentId(item1, assignmentId);
                            items = accessRequest.getRequestedItems();

                            expect(items.length).toEqual(2);
                            expect(findRequestedItem(item1, items).assignmentId).toEqual(assignmentId);
                            expect(findRequestedItem(item2, items).assignmentId).toBeNull();

                            accessRequest.setAssignmentId(item1, assignmentId2);
                            expect(findRequestedItem(item1, items).assignmentId).toEqual(assignmentId2);
                        });
                    });

                    describe('getOtherRequestedRoles()', function () {
                        it('returns empty array with undefined paramter', function () {
                            expect(accessRequest.getOtherRequestedRoles(null)).toEqual([]);
                        });

                        it('throws if bogus permittedBy id sent', function () {
                            expect(function () {
                                accessRequest.getOtherRequestedRoles('junk');
                            }).toThrow();
                        });

                        it('throws if non-requested item sent', function () {
                            expect(function () {
                                accessRequest.getOtherRequestedRoles(item1);
                            }).toThrow();
                        });

                        it('returns permitting role with permittedBy ID value', function () {
                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            expect(accessRequest.getOtherRequestedRoles(item1.id)).toEqual([requestedItem1]);
                        });

                        it('returns permitting role with permittedBy object value', function () {
                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2);

                            expect(accessRequest.getOtherRequestedRoles(item1)).toEqual([requestedItem1]);
                        });

                        it('returns other permitted roles along with permitting role', function () {
                            accessRequest.addRequestedItem(item1);
                            accessRequest.addRequestedItem(item2, item1);
                            accessRequest.addRequestedItem(item3, item1);

                            requestedItem2.permittedById = item1.id;
                            requestedItem3.permittedById = item1.id;

                            expect(accessRequest.getOtherRequestedRoles(item1)).toEqual([requestedItem2, requestedItem3, requestedItem1]);
                        });
                    });
                });

                ////////////////////////////////////////////////////////////////////////////
                //
                // REMOVED CURRENT ACCESS ITEM TESTS
                //
                ////////////////////////////////////////////////////////////////////////////

                describe('removed current request items methods', function () {

                    var item1Data, item2Data, noIdItemData, item1, item2, noIdItem;

                    // Setup the test data.
                    beforeEach(inject(function (CurrentAccessItem, accessRequestTestData) {

                        item1Data = accessRequestTestData.CURRENT_ACCESS_ROLE;
                        item2Data = accessRequestTestData.CURRENT_ACCESS_ENTITLEMENT;

                        item1 = new CurrentAccessItem(item1Data);
                        item2 = new CurrentAccessItem(item2Data);

                        // Create an item without an ID.
                        noIdItemData = angular.copy(item1Data);
                        delete noIdItemData.id;
                        delete noIdItemData.assignmentId;
                        noIdItem = new CurrentAccessItem(noIdItemData);
                    }));

                    it('starts with no items', function () {
                        var items = accessRequest.getRemovedCurrentAccessItems();
                        expect(items).not.toBeNull();
                        expect(angular.isArray(items)).toEqual(true);
                        expect(items.length).toEqual(0);
                    });

                    describe('getRemovedCurrentAccessItems()', function () {
                        it('returns items that have been marked for removal', function () {
                            var items;

                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.addRemovedCurrentAccessItem(item2);

                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(2);
                            expect(items.indexOf(item1)).toBeGreaterThan(-1);
                            expect(items.indexOf(item2)).toBeGreaterThan(-1);
                        });

                        it('does not return items that have been removed', function () {
                            var items;

                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.addRemovedCurrentAccessItem(item2);
                            accessRequest.removeRemovedCurrentAccessItem(item1);

                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(1);
                            expect(items.indexOf(item2)).toBeGreaterThan(-1);
                            expect(items.indexOf(item1)).toEqual(-1);
                        });
                    });

                    describe('hasRemovedCurrentAccessItem()', function () {
                        it('returns false for a null item', function () {
                            expect(accessRequest.hasRemovedCurrentAccessItem(null)).toEqual(false);
                        });

                        it('blows up if there is no unique ID', function () {
                            expect(function () {
                                accessRequest.hasRemovedCurrentAccessItem(noIdItem);
                            }).toThrow();
                        });

                        it('returns true for an item that has been added', function () {
                            accessRequest.addRemovedCurrentAccessItem(item1);
                            expect(accessRequest.hasRemovedCurrentAccessItem(item1)).toEqual(true);
                        });

                        it('returns false for an item that has not been added', function () {
                            expect(accessRequest.hasRemovedCurrentAccessItem(item1)).toEqual(false);
                        });

                        it('returns false for an item that been added then removed', function () {
                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.removeRemovedCurrentAccessItem(item1);
                            expect(accessRequest.hasRemovedCurrentAccessItem(item1)).toEqual(false);
                        });
                    });

                    describe('addRemovedCurrentAccessItem()', function () {
                        it('does nothing for a null item', function () {
                            var result = accessRequest.addRemovedCurrentAccessItem(null),
                                items = accessRequest.getRemovedCurrentAccessItems();
                            expect(result).toEqual(false);
                            expect(items.length).toEqual(0);
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.addRemovedCurrentAccessItem(noIdItem);
                            }).toThrow();
                        });

                        it('adds a single item', function () {
                            var result = accessRequest.addRemovedCurrentAccessItem(item1),
                                items = accessRequest.getRemovedCurrentAccessItems();
                            expect(result).toEqual(true);
                            expect(items.length).toEqual(1);
                            expect(items.indexOf(item1)).toBeGreaterThan(-1);
                        });

                        it('adds multiple items', function () {
                            var result = accessRequest.addRemovedCurrentAccessItem(item1),
                                result2 = accessRequest.addRemovedCurrentAccessItem(item2),
                                items = accessRequest.getRemovedCurrentAccessItems();
                            expect(result).toEqual(true);
                            expect(result2).toEqual(true);
                            expect(items.length).toEqual(2);
                            expect(items.indexOf(item1)).toBeGreaterThan(-1);
                            expect(items.indexOf(item2)).toBeGreaterThan(-1);
                        });

                        it('does not add the same item twice', function () {
                            var result = accessRequest.addRemovedCurrentAccessItem(item1),
                                result2 = accessRequest.addRemovedCurrentAccessItem(item1),
                                items = accessRequest.getRemovedCurrentAccessItems();
                            expect(result).toEqual(true);
                            expect(result2).toEqual(false);
                            expect(items.length).toEqual(1);
                            expect(items.indexOf(item1)).toBeGreaterThan(-1);
                        });
                    });

                    describe('removeRemovedCurrentAccessItem()', function () {
                        it('does nothing for a null item', function () {
                            var result = accessRequest.removeRemovedCurrentAccessItem(null),
                                items = accessRequest.getRemovedCurrentAccessItems();
                            expect(result).toEqual(false);
                            expect(items.length).toEqual(0);
                        });

                        it('does nothing if no items have been added', function () {
                            var result = accessRequest.removeRemovedCurrentAccessItem(item1),
                                items = accessRequest.getRemovedCurrentAccessItems();
                            expect(result).toEqual(false);
                            expect(items.length).toEqual(0);
                        });

                        it('blows up if there is no item ID', function () {
                            expect(function () {
                                accessRequest.removeRemovedCurrentAccessItem(noIdItem);
                            }).toThrow();
                        });

                        it('removes a single item', function () {
                            var result, items;

                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.addRemovedCurrentAccessItem(item2);

                            result = accessRequest.removeRemovedCurrentAccessItem(item1);
                            items = accessRequest.getRemovedCurrentAccessItems();

                            expect(result).toEqual(true);
                            expect(items.length).toEqual(1);
                            expect(items.indexOf(item1)).toEqual(-1);
                            expect(items.indexOf(item2)).toBeGreaterThan(-1);
                        });

                        it('removes multiple items', function () {
                            var result, items;

                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.addRemovedCurrentAccessItem(item2);

                            result = accessRequest.removeRemovedCurrentAccessItem(item1);
                            expect(result).toEqual(true);
                            result = accessRequest.removeRemovedCurrentAccessItem(item2);
                            expect(result).toEqual(true);

                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(0);
                        });

                        it('does not remove the same item twice', function () {
                            var result, items;

                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.addRemovedCurrentAccessItem(item2);

                            result = accessRequest.removeRemovedCurrentAccessItem(item1);
                            expect(result).toEqual(true);
                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(1);

                            result = accessRequest.removeRemovedCurrentAccessItem(item1);
                            expect(result).toEqual(false);
                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(1);
                        });
                    });

                    describe('removeAllRemovedCurrentAccessItems()', function () {
                        it('removes all items', function () {
                            var items;
                            accessRequest.addRemovedCurrentAccessItem(item1);
                            accessRequest.addRemovedCurrentAccessItem(item2);
                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(2);

                            accessRequest.removeAllRemovedCurrentAccessItems();
                            items = accessRequest.getRemovedCurrentAccessItems();
                            expect(items.length).toEqual(0);
                        });
                    });
                });

                ////////////////////////////////////////////////////////////////////////////
                //
                // PERMITTED ROLES TESTS
                //
                ////////////////////////////////////////////////////////////////////////////

                describe('permitted roles', function () {

                    var item1, item2, item3;

                    // Setup the test data.
                    beforeEach(inject(function (AccessRequestItem, accessRequestTestData) {

                        var item1Data = accessRequestTestData.CURRENT_ACCESS_ROLE,
                            item2Data = accessRequestTestData.IDENTITY_SEARCH_ROLE,
                            item3Data = accessRequestTestData.ROLE;
                        item1 = new AccessRequestItem(item1Data);
                        item2 = new AccessRequestItem(item2Data);
                        item3 = new AccessRequestItem(item3Data);
                    }));

                    it('starts with no roles', function () {
                        var permittedRoles = accessRequest.getPermittedRoles(item1.id);
                        expect(permittedRoles).toBeNull();
                    });

                    describe('getPermittedRoles()', function () {

                        it('blows up if there is no role id', function () {
                            expect(function () {
                                accessRequest.getPermittedRoles(undefined);
                            }).toThrow();
                        });

                        it('returns permitted roles that have been added', function () {
                            var permittedRoles;

                            accessRequest.setPermittedRoles(item1.id, [item2, item3]);

                            permittedRoles = accessRequest.getPermittedRoles(item1.id);
                            expect(permittedRoles.length).toEqual(2);
                            expect(permittedRoles.indexOf(item2)).toBeGreaterThan(-1);
                            expect(permittedRoles.indexOf(item3)).toBeGreaterThan(-1);
                        });

                        it('does not return items that have been removed', function () {
                            var permittedRoles;

                            accessRequest.setPermittedRoles(item1.id, [item2, item3]);
                            accessRequest.setPermittedRoles(item1.id, [item2]);

                            permittedRoles = accessRequest.getPermittedRoles(item1.id);
                            expect(permittedRoles.length).toEqual(1);
                            expect(permittedRoles.indexOf(item2)).toBeGreaterThan(-1);
                            expect(permittedRoles.indexOf(item3)).toEqual(-1);
                        });
                    });

                    describe('setPermittedRoles()', function () {
                        it('blows up if there is no role id', function () {
                            expect(function () {
                                accessRequest.setPermittedRoles(undefined, [item1]);
                            }).toThrow();
                        });

                        it('blows up if an array is not passed', function () {
                            expect(function () {
                                accessRequest.setPermittedRoles(item1.id, item1);
                            }).toThrow();
                        });

                        it('adds a single item array', function () {
                            var permittedRoles;
                            accessRequest.setPermittedRoles(item1.id, [item2]);
                            permittedRoles = accessRequest.getPermittedRoles(item1.id);
                            expect(permittedRoles.length).toEqual(1);
                            expect(permittedRoles.indexOf(item2)).toBeGreaterThan(-1);
                        });

                        it('adds multiple items', function () {
                            var permittedRoles;
                            accessRequest.setPermittedRoles(item1.id, [item2, item3]);
                            permittedRoles = accessRequest.getPermittedRoles(item1.id);
                            expect(permittedRoles.length).toEqual(2);
                            expect(permittedRoles.indexOf(item2)).toBeGreaterThan(-1);
                            expect(permittedRoles.indexOf(item3)).toBeGreaterThan(-1);
                        });

                        it('overwrites when adding to the same id', function () {
                            var permittedRoles;
                            accessRequest.setPermittedRoles(item1.id, [item2]);
                            accessRequest.setPermittedRoles(item1.id, [item3]);
                            permittedRoles = accessRequest.getPermittedRoles(item1.id);
                            expect(permittedRoles.length).toEqual(1);
                            expect(permittedRoles.indexOf(item2)).toEqual(-1);
                            expect(permittedRoles.indexOf(item3)).toBeGreaterThan(-1);
                        });
                    });
                });

                describe('getRemovedApprovalItems()', function () {
                    it('should return a list of removed approvalItems', function () {
                        var item1 = {
                            getId: function () {
                                return 1;
                            }
                        },
                            item2 = {
                            getId: function () {
                                return 2;
                            }
                        },
                            item3 = {
                            getId: function () {
                                return 3;
                            }
                        },
                            requestedAccessItem1,
                            requestedAccessItem3;
                        accessRequest.addRequestedItem(item1);
                        accessRequest.addRequestedItem(item2);
                        accessRequest.addRequestedItem(item3);
                        requestedAccessItem1 = accessRequest.getRequestedItem(item1);
                        requestedAccessItem3 = accessRequest.getRequestedItem(item3);
                        requestedAccessItem1.setApprovalItemId('Foo');
                        requestedAccessItem3.setApprovalItemId('Bar');
                        expect(accessRequest.getRemovedApprovalItems().length).toBe(0);
                        accessRequest.removeRequestedItem(requestedAccessItem1);
                        expect(accessRequest.getRemovedApprovalItems().length).toBe(1);
                        accessRequest.removeRequestedItem(requestedAccessItem3);
                        expect(accessRequest.getRemovedApprovalItems().length).toBe(2);
                        /* Removing the same item twice in a row does not cause any weirdness right? */
                        accessRequest.removeRequestedItem(requestedAccessItem3);
                        expect(accessRequest.getRemovedApprovalItems().length).toBe(2);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvbW9kZWwvQWNjZXNzUmVxdWVzdFRlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLDJCQUEyQixxQ0FBcUMsNkJBQTZCLFVBQVUsU0FBUztJQUFqSTs7SUFHSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsbUNBQW1DO1lBQ3pGLHNCQUFzQixrQ0FBa0M7V0FDekQsVUFBVSx3QkFBd0I7UUFDckMsU0FBUyxZQUFZOztZQUY3QixTQUFTLGlCQUFpQixZQUFXO2dCQUNqQyxJQUFJLGVBQ0EsZUFDQSxlQUNBLGVBQ0EsZUFDQSxrQkFDQSxXQUFXLFdBQVcsV0FBVzs7Ozs7OztnQkFPckMsU0FBUyxtQkFBbUIsUUFBUTtvQkFDaEMsT0FBTyxZQUFXO3dCQUNkLE9BQU8sQ0FDSDs0QkFDSSxNQUFNO2dDQUNGLFFBQVEsWUFBVztvQ0FBRSxPQUFPOzs7Ozs7OztnQkFRaEQsV0FBVyxPQUFPOzs7Z0JBR2xCLFdBQVcsT0FBTyxVQUFTLGlCQUFpQjtvQkFDeEMsZ0JBQWdCOzs7O2dCQUlwQixXQUFXLE9BQU8sVUFBUyxVQUFVLHVCQUF1QjtvQkFDeEQsZ0JBQWdCLElBQUksY0FBYzs7b0JBRWxDLGdCQUFnQixzQkFBc0I7b0JBQ3RDLGdCQUFnQixzQkFBc0I7b0JBQ3RDLGdCQUFnQixzQkFBc0I7O29CQUV0QyxZQUFZLElBQUksU0FBUztvQkFDekIsWUFBWSxJQUFJLFNBQVM7b0JBQ3pCLFlBQVksSUFBSSxTQUFTOzs7b0JBR3pCLG1CQUFtQixRQUFRLEtBQUs7b0JBQ2hDLE9BQU8saUJBQWlCO29CQUN4QixlQUFlLElBQUksU0FBUzs7O2dCQUdoQyxHQUFHLDZCQUE2QixZQUFXO29CQUN2QyxJQUFJLGFBQWEsY0FBYztvQkFDL0IsT0FBTyxZQUFZLElBQUk7b0JBQ3ZCLE9BQU8sUUFBUSxRQUFRLGFBQWEsUUFBUTtvQkFDNUMsT0FBTyxXQUFXLFFB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QkFDdEQscUJBQXFCLGtCQUFrQjt3QkFDdkMscUJBQXFCLGtCQUFrQjt3QkFDdkMsT0FBTyxjQUFjLDBCQUEwQixRQUFRLEtBQUs7d0JBQzVELGNBQWMsb0JBQW9CO3dCQUNsQyxPQUFPLGNBQWMsMEJBQTBCLFFBQVEsS0FBSzt3QkFDNUQsY0FBYyxvQkFBb0I7d0JBQ2xDLE9BQU8sY0FBYywwQkFBMEIsUUFBUSxLQUFLOzt3QkFFNUQsY0FBYyxvQkFBb0I7d0JBQ2xDLE9BQU8sY0FBYywwQkFBMEIsUUFBUSxLQUFLOzs7Ozs7R0FKckUiLCJmaWxlIjoiYWNjZXNzUmVxdWVzdC9tb2RlbC9BY2Nlc3NSZXF1ZXN0VGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGFjY2Vzc1JlcXVlc3RNb2R1bGUgZnJvbSAnYWNjZXNzUmVxdWVzdC9BY2Nlc3NSZXF1ZXN0TW9kdWxlJztcbmltcG9ydCAnLi4vQWNjZXNzUmVxdWVzdFRlc3REYXRhJztcblxuZGVzY3JpYmUoJ0FjY2Vzc1JlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgQWNjZXNzUmVxdWVzdCxcbiAgICAgICAgYWNjZXNzUmVxdWVzdCxcbiAgICAgICAgaWRlbnRpdHkxRGF0YSxcbiAgICAgICAgaWRlbnRpdHkyRGF0YSxcbiAgICAgICAgaWRlbnRpdHkzRGF0YSxcbiAgICAgICAgbm9JZElkZW50aXR5RGF0YSxcbiAgICAgICAgaWRlbnRpdHkxLCBpZGVudGl0eTIsIGlkZW50aXR5Mywgbm9JZElkZW50aXR5O1xuXG4gICAgLyoqXG4gICAgICogQSBtb2NrIHJlc3VsdCBmb3IgZmVlZGluZyBoYXNSb2xlUmVxdWVzdFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNSb2xlIElmIHRoZSByZXF1ZXN0IHNob3VsZCBiZSBmb3IgYSByb2xlIG9yIG5vdFxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYXJyYXkgb2YgbW9jayByZXF1ZXN0c1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1vY2tIYXNSb2xlUmVxdWVzdChpc1JvbGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUm9sZTogZnVuY3Rpb24oKSB7IHJldHVybiBpc1JvbGU7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVXNlIHRoZSBhY2Nlc3MgcmVxdWVzdCBtb2R1bGUuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoYWNjZXNzUmVxdWVzdE1vZHVsZSkpO1xuXG4gICAgLy8gU2V0dXAgdGhlIGRlcGVuZGVuY2llcy5cbiAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfQWNjZXNzUmVxdWVzdF8pIHtcbiAgICAgICAgQWNjZXNzUmVxdWVzdCA9IF9BY2Nlc3NSZXF1ZXN0XztcbiAgICB9KSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgdGVzdCBkYXRhLlxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKElkZW50aXR5LCBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEpIHtcbiAgICAgICAgYWNjZXNzUmVxdWVzdCA9IG5ldyBBY2Nlc3NSZXF1ZXN0KDMpO1xuXG4gICAgICAgIGlkZW50aXR5MURhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFkxO1xuICAgICAgICBpZGVudGl0eTJEYXRhID0gYWNjZXNzUmVxdWVzdFRlc3REYXRhLklERU5USVRZMjtcbiAgICAgICAgaWRlbnRpdHkzRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWTM7XG5cbiAgICAgICAgaWRlbnRpdHkxID0gbmV3IElkZW50aXR5KGlkZW50aXR5MURhdGEpO1xuICAgICAgICBpZGVudGl0eTIgPSBuZXcgSWRlbnRpdHkoaWRlbnRpdHkyRGF0YSk7XG4gICAgICAgIGlkZW50aXR5MyA9IG5ldyBJZGVudGl0eShpZGVudGl0eTNEYXRhKTtcblxuICAgICAgICAvLyBDcmVhdGUgYW4gaWRlbnRpdHkgd2l0aG91dCBhbiBJRC5cbiAgICAgICAgbm9JZElkZW50aXR5RGF0YSA9IGFuZ3VsYXIuY29weShpZGVudGl0eTFEYXRhKTtcbiAgICAgICAgZGVsZXRlIG5vSWRJZGVudGl0eURhdGEuaWQ7XG4gICAgICAgIG5vSWRJZGVudGl0eSA9IG5ldyBJZGVudGl0eShub0lkSWRlbnRpdHlEYXRhKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc3RhcnRzIHdpdGggbm8gaWRlbnRpdGllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICBleHBlY3QoaWRlbnRpdGllcykubm90LnRvQmVOdWxsKCk7XG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzQXJyYXkoaWRlbnRpdGllcykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRJZGVudGl0aWVzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3JldHVybnMgaWRlbnRpdGllcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkyKTtcblxuICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTIpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTMpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHJldHVybiBpZGVudGl0aWVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpZGVudGl0aWVzO1xuXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KGlkZW50aXR5MSk7XG5cbiAgICAgICAgICAgIGlkZW50aXRpZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldElkZW50aXRpZXMoKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkyKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9FcXVhbCgtMSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldElkZW50aXR5SWRzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3JldHVybnMgaWRlbnRpdHkgaWRzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaWRlbnRpdHlJZHM7XG5cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkyKTtcblxuICAgICAgICAgICAgaWRlbnRpdHlJZHMgPSBhY2Nlc3NSZXF1ZXN0LmdldElkZW50aXR5SWRzKCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlJZHMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXR5SWRzLmluZGV4T2YoaWRlbnRpdHkxLmlkKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0eUlkcy5pbmRleE9mKGlkZW50aXR5Mi5pZCkpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlJZHMuaW5kZXhPZihpZGVudGl0eTMuaWQpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHJldHVybiBpZGVudGl0eSBpZHMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkZW50aXR5SWRzO1xuXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KGlkZW50aXR5MSk7XG5cbiAgICAgICAgICAgIGlkZW50aXR5SWRzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0eUlkcygpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXR5SWRzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0eUlkcy5pbmRleE9mKGlkZW50aXR5Mi5pZCkpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdHlJZHMuaW5kZXhPZihpZGVudGl0eTEuaWQpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0UmVxdWVzdGVlSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3JldHVybnMgYW4gSUQgaWYgYSBzaW5nbGUgaWRlbnRpdHkgaXMgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZUlkKCkpLnRvRXF1YWwoaWRlbnRpdHkxLmdldElkKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBudWxsIGlmIG5vIGlkZW50aXRpZXMgYXJlIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWVJZCgpKS50b0JlTnVsbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBudWxsIGlmIG11bHRpcGxlIGlkZW50aXRpZXMgYXJlIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWVJZCgpKS50b0JlTnVsbCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdoYXNJZGVudGl0eSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhIG51bGwgaWRlbnRpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc0lkZW50aXR5KG51bGwpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Jsb3dzIHVwIGlmIHRoZXJlIGlzIG5vIGlkZW50aXR5IElEJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFjY2Vzc1JlcXVlc3QuaGFzSWRlbnRpdHkobm9JZElkZW50aXR5KTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBhbiBpZGVudGl0eSB0aGF0IGhhcyBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5oYXNJZGVudGl0eShpZGVudGl0eTEpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gaWRlbnRpdHkgdGhhdCBoYXMgbm90IGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc0lkZW50aXR5KGlkZW50aXR5MSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gaWRlbnRpdHkgdGhhdCBiZWVuIGFkZGVkIHRoZW4gcmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzSWRlbnRpdHkoaWRlbnRpdHkxKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2hhc0lkZW50aXRpZXMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSBudWxsIGlkZW50aXR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5oYXNJZGVudGl0aWVzKG51bGwpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Jsb3dzIHVwIGlmIHRoZXJlIGlzIG5vIGlkZW50aXR5IElEJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFjY2Vzc1JlcXVlc3QuaGFzSWRlbnRpdGllcyhbbm9JZElkZW50aXR5XSk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JldHVybnMgdHJ1ZSBmb3IgYW4gaWRlbnRpdHkgdGhhdCBoYXMgYmVlbiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzSWRlbnRpdGllcyhbaWRlbnRpdHkxXSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhbiBpZGVudGl0eSB0aGF0IGhhcyBub3QgYmVlbiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzSWRlbnRpdGllcyhbaWRlbnRpdHkxXSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gaWRlbnRpdHkgdGhhdCBiZWVuIGFkZGVkIHRoZW4gcmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzSWRlbnRpdGllcyhbaWRlbnRpdHkxXSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBtdWx0aXBsZSBpZGVudGl0aWVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5oYXNJZGVudGl0aWVzKFtpZGVudGl0eTEsIGlkZW50aXR5Ml0pKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgbXVsdGlwbGUgaWRlbnRpdGllcyB0aGF0IGhhdmUgbm90IGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkyKTtcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc0lkZW50aXRpZXMoW2lkZW50aXR5MSwgaWRlbnRpdHkyLCBpZGVudGl0eTNdKSkuXG4gICAgICAgICAgICAgICAgdG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2FkZElkZW50aXR5KCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Rocm93cyBmb3IgbnVsbCBpZGVudGl0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkobnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdibG93cyB1cCBpZiB0aGVyZSBpcyBubyBpZGVudGl0eSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KG5vSWRJZGVudGl0eSk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2FkZHMgYSBzaW5nbGUgaWRlbnRpdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSksXG4gICAgICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWRkcyBtdWx0aXBsZSBpZGVudGl0aWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpLFxuICAgICAgICAgICAgICAgIHJlc3VsdDIgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MiksXG4gICAgICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDIuZmFpbGVkKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkyKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IGR1cGxpY2F0ZSBhZGRlZCBpZGVudGl0aWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpLFxuICAgICAgICAgICAgICAgIHJlc3VsdDIgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSksXG4gICAgICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDIuZmFpbGVkKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZXJyb3IgY29kZSBpZiBoYXMgcmVtb3ZlZCBhY2Nlc3MgcmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdCwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoWydzb21ldGhpbmcnXSk7XG4gICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnNbMF0pLnRvQmUoQWNjZXNzUmVxdWVzdC5FUlJPUlMuSEFTX1JFTU9WRURfQUNDRVNTKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZXJyb3IgY29kZSBpZiBoYXMgcm9sZSByZXF1ZXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0LCAnZ2V0UmVxdWVzdGVkSXRlbXMnKS5hbmQuY2FsbEZha2UobW9ja0hhc1JvbGVSZXF1ZXN0KHRydWUpKTtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9yc1swXSkudG9CZShBY2Nlc3NSZXF1ZXN0LkVSUk9SUy5IQVNfUk9MRV9SRVFVRVNUUyk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgZGVzY3JpYmUoJ21heCBpZGVudGl0eSBjb3VudCB2YWxpZGF0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdCA9IG5ldyBBY2Nlc3NSZXF1ZXN0KDIpO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0aWVzKFtpZGVudGl0eTFdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBlcnJvciBjb2RlIGlmIGFkZGluZyBhbiBpZGVudGl0eSB3b3VsZCBleGNlZWQgbWF4JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Myk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzWzBdKS50b0JlKEFjY2Vzc1JlcXVlc3QuRVJST1JTLkVYQ0VFREVEX01BWF9JREVOVElUWV9DT1VOVCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIGVycm9yIGNvZGUgaWYgYWRkaW5nIGR1cGxpY2F0ZSBpZGVudGl0aWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpLmxlbmd0aCkudG9CZSgyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG9ubHkgcmV0dXJuIGVycm9yIGNvZGUgZm9yIGV4Y2VlZGluZyBtYXggaWRlbnRpdGllcyBpZiBib3RoIG1heCBleGNlZWRlZCBhbmQgaGFzIG90aGVyIGVycm9yJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkyKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3QsICdnZXRSZXF1ZXN0ZWRJdGVtcycpLmFuZC5jYWxsRmFrZShtb2NrSGFzUm9sZVJlcXVlc3QodHJ1ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkzKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9ycy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnNbMF0pLnRvQmUoQWNjZXNzUmVxdWVzdC5FUlJPUlMuRVhDRUVERURfTUFYX0lERU5USVRZX0NPVU5UKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGJvdGggaGFzIHJvbGUgcmVxdWVzdCBhbmQgaGFzIHJlbW92ZWQgYWNjZXNzIGVycm9ycycsXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdCwgJ2dldFJlcXVlc3RlZEl0ZW1zJykuYW5kLmNhbGxGYWtlKG1vY2tIYXNSb2xlUmVxdWVzdCh0cnVlKSk7XG4gICAgICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdCwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoWydzb21ldGhpbmcnXSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzLmxlbmd0aCkudG9CZSgyKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzLmluZGV4T2YoQWNjZXNzUmVxdWVzdC5FUlJPUlMuSEFTX1JPTEVfUkVRVUVTVFMpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMuaW5kZXhPZihBY2Nlc3NSZXF1ZXN0LkVSUk9SUy5IQVNfUkVNT1ZFRF9BQ0NFU1MpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhZGRJZGVudGl0aWVzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Rocm93cyBmb3IgbnVsbCBpZGVudGl0eSBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShudWxsKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Rocm93cyBmb3IgbnVsbCBpZGVudGl0eSBpbiBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShbbnVsbF0pO1xuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaWRlbnRpdHkgSUQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0aWVzKFtub0lkSWRlbnRpdHldKTsgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWRkcyBhIHNpbmdsZSBpZGVudGl0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdGllcyhbaWRlbnRpdHkxXSksXG4gICAgICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWRkcyBtdWx0aXBsZSBpZGVudGl0aWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0aWVzKFtpZGVudGl0eTEsaWRlbnRpdHkyXSksXG4gICAgICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTIpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3QgZHVwbGljYXRlIGlkZW50aXRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXRpZXMoW2lkZW50aXR5MSxpZGVudGl0eTFdKSxcbiAgICAgICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0LmZhaWxlZCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5pbmRleE9mKGlkZW50aXR5MSkpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGVycm9yIGNvZGUgaWYgaGFzIHJlbW92ZWQgYWNjZXNzIHJlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3QsICdnZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zJykuYW5kLnJldHVyblZhbHVlKFsnc29tZXRoaW5nJ10pO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXRpZXMoW2lkZW50aXR5MV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9yc1swXSkudG9CZShBY2Nlc3NSZXF1ZXN0LkVSUk9SUy5IQVNfUkVNT1ZFRF9BQ0NFU1MpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBlcnJvciBjb2RlIGlmIGhhcyByb2xlIHJlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3QsICdnZXRSZXF1ZXN0ZWRJdGVtcycpLmFuZC5jYWxsRmFrZShtb2NrSGFzUm9sZVJlcXVlc3QodHJ1ZSkpO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXRpZXMoW2lkZW50aXR5MV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmZhaWxlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9yc1swXSkudG9CZShBY2Nlc3NSZXF1ZXN0LkVSUk9SUy5IQVNfUk9MRV9SRVFVRVNUUyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdtYXggaWRlbnRpdHkgY291bnQgdmFsaWRhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QgPSBuZXcgQWNjZXNzUmVxdWVzdCgyKTtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdGllcyhbaWRlbnRpdHkxXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZXJyb3IgY29kZSBpZiBhZGRpbmcgYW4gaWRlbnRpdHkgd291bGQgZXhjZWVkIG1heCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0aWVzKFtpZGVudGl0eTIsIGlkZW50aXR5M10pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9ycy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9yc1swXSkudG9CZShBY2Nlc3NSZXF1ZXN0LkVSUk9SUy5FWENFRURFRF9NQVhfSURFTlRJVFlfQ09VTlQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBlcnJvciBjb2RlIGlmIGFkZGluZyBkdXBsaWNhdGUgaWRlbnRpdGllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0aWVzKFtpZGVudGl0eTFdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZmFpbGVkKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdGllcyhbaWRlbnRpdHkxLCBpZGVudGl0eTJdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZmFpbGVkKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCkubGVuZ3RoKS50b0JlKDIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzaG91bGQgb25seSByZXR1cm4gZXJyb3IgY29kZSBmb3IgZXhjZWVkaW5nIG1heCBpZGVudGl0aWVzIGlmIGJvdGggbWF4IGV4Y2VlZGVkIGFuZCBoYXMgb3RoZXIgZXJyb3InLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdGllcyhbaWRlbnRpdHkxXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0LCAnZ2V0UmVxdWVzdGVkSXRlbXMnKS5hbmQuY2FsbEZha2UobW9ja0hhc1JvbGVSZXF1ZXN0KHRydWUpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXRpZXMoW2lkZW50aXR5MiwgaWRlbnRpdHkzXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzWzBdKS50b0JlKEFjY2Vzc1JlcXVlc3QuRVJST1JTLkVYQ0VFREVEX01BWF9JREVOVElUWV9DT1VOVCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYm90aCBoYXMgcm9sZSByZXF1ZXN0IGFuZCBoYXMgcmVtb3ZlZCBhY2Nlc3MgZXJyb3JzJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0LCAnZ2V0UmVxdWVzdGVkSXRlbXMnKS5hbmQuY2FsbEZha2UobW9ja0hhc1JvbGVSZXF1ZXN0KHRydWUpKTtcbiAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0LCAnZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcycpLmFuZC5yZXR1cm5WYWx1ZShbJ3NvbWV0aGluZyddKTtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdGllcyhbaWRlbnRpdHkxLCBpZGVudGl0eTJdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZmFpbGVkKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMubGVuZ3RoKS50b0JlKDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnMuaW5kZXhPZihBY2Nlc3NSZXF1ZXN0LkVSUk9SUy5IQVNfUk9MRV9SRVFVRVNUUykpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9ycy5pbmRleE9mKEFjY2Vzc1JlcXVlc3QuRVJST1JTLkhBU19SRU1PVkVEX0FDQ0VTUykpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3JlbW92ZUlkZW50aXR5KCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3Rocm93cyBmb3IgbnVsbCBpZGVudGl0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlSWRlbnRpdHkobnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgbm8gaWRlbnRpdGllcyBoYXZlIGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KGlkZW50aXR5MSksXG4gICAgICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaWRlbnRpdHkgSUQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYWNjZXNzUmVxdWVzdC5yZW1vdmVJZGVudGl0eShub0lkSWRlbnRpdHkpOyB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1vdmVzIGEgc2luZ2xlIGlkZW50aXR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0LCBpZGVudGl0aWVzO1xuXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG5cbiAgICAgICAgICAgIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QucmVtb3ZlSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGlkZW50aXRpZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldElkZW50aXRpZXMoKTtcblxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkyKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlbW92ZXMgbXVsdGlwbGUgaWRlbnRpdGllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCwgaWRlbnRpdGllcztcblxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTIpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTMpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0LmZhaWxlZCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0LmZhaWxlZCkudG9FcXVhbChmYWxzZSk7XG5cbiAgICAgICAgICAgIGlkZW50aXRpZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldElkZW50aXRpZXMoKTtcblxuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkyKSkudG9FcXVhbCgtMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5pbmRleE9mKGlkZW50aXR5MykpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkb2VzIG5vdCByZW1vdmUgdGhlIHNhbWUgaWRlbnRpdHkgdHdpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQsIGlkZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkyKTtcblxuICAgICAgICAgICAgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5yZW1vdmVJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0LmZhaWxlZCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmVtb3ZlIGFjY291bnQgc2VsZWN0aW9ucyBmb3Igc3BlY2lmaWVkIGlkZW50aXR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaWRlbnRpdHlJZCA9ICdzb21laWQnLFxuICAgICAgICAgICAgICAgIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIDE7IH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb24xID0ge1xuICAgICAgICAgICAgICAgICAgICBpZGVudGl0eUlkOiBpZGVudGl0eUlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhY2NvdW50U2VsZWN0aW9uMiA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHlJZDogJ3NvbWVvdGhlcmlkJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnMgPSBbYWNjb3VudFNlbGVjdGlvbjEsIGFjY291bnRTZWxlY3Rpb24yIF0sXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTtcbiAgICAgICAgICAgIC8qIFNldHVwIGEgZmFrZSByZXF1c3RlZCBhY2Nlc3MgaXRlbSB3aXRoIGZha2UgcmVxdWVzdHMgKi9cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0UmVxdWVzdGVkSXRlbUFjY291bnRTZWxlY3Rpb25zKGl0ZW0sIGFjY291bnRTZWxlY3Rpb25zKTtcbiAgICAgICAgICAgIC8qIFJlbW92ZSBpZGVudGl0eSBpbiBvbiBvZiB0aGUgYWNjb3VudCBzZWxlY3Rpb25zICovXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXR5KHtcbiAgICAgICAgICAgICAgICBnZXRJZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpZGVudGl0eUlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogVmVyaWZ5IHJlcXVlc3RlZCBpdGVtIGlzIHVwZGF0ZWQqL1xuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbSA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbShpdGVtKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zWzBdKS50b0JlKGFjY291bnRTZWxlY3Rpb24yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZXJyb3IgY29kZSBpZiBoYXMgcmVtb3ZlZCBhY2Nlc3MgcmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdCwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQucmV0dXJuVmFsdWUoWydzb21ldGhpbmcnXSk7XG4gICAgICAgICAgICByZXNwb25zZSA9IGFjY2Vzc1JlcXVlc3QucmVtb3ZlSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5lcnJvcnNbMF0pLnRvQmUoQWNjZXNzUmVxdWVzdC5FUlJPUlMuSEFTX1JFTU9WRURfQUNDRVNTKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmVtb3ZlQWxsSWRlbnRpdGllcygpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdkb2VzIG5vdGhpbmcgZm9yIGFuIGVtcHR5IGlkZW50aXR5IGFycmF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVtb3ZlcyBhIHNpbmdsZSBpZGVudGl0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcblxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVBbGxJZGVudGl0aWVzKCk7XG4gICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9FcXVhbCgtMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1vdmVzIG11bHRpcGxlIGlkZW50aXRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpZGVudGl0aWVzO1xuXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Myk7XG5cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlQWxsSWRlbnRpdGllcygpO1xuXG4gICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9FcXVhbCgtMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5pbmRleE9mKGlkZW50aXR5MikpLnRvRXF1YWwoLTEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTMpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZW1vdmUgYWxsIGFjY291bnQgc2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0xID0ge1xuICAgICAgICAgICAgICAgICAgICBnZXRJZDogZnVuY3Rpb24oKSB7IHJldHVybiAxOyB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpdGVtMiA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0SWQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gMjsgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnMxID0gW3t9LCB7fV0sXG4gICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnMyID0gW3t9XSxcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRJdGVtO1xuICAgICAgICAgICAgLyogU2V0dXAgYSBmYWtlIHJlcXVzdGVkIGFjY2VzcyBpdGVtIHdpdGggZmFrZSByZXF1ZXN0cyAqL1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0UmVxdWVzdGVkSXRlbUFjY291bnRTZWxlY3Rpb25zKGl0ZW0xLCBhY2NvdW50U2VsZWN0aW9uczEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0UmVxdWVzdGVkSXRlbUFjY291bnRTZWxlY3Rpb25zKGl0ZW0yLCBhY2NvdW50U2VsZWN0aW9uczIpO1xuICAgICAgICAgICAgLyogUmVtb3ZlIGlkZW50aXR5IGluIG9uIG9mIHRoZSBhY2NvdW50IHNlbGVjdGlvbnMgKi9cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlQWxsSWRlbnRpdGllcygpO1xuICAgICAgICAgICAgLyogVmVyaWZ5IHJlcXVlc3RlZCBpdGVtIGlzIHVwZGF0ZWQqL1xuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbSA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5hY2NvdW50U2VsZWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgICAgICByZXF1ZXN0ZWRJdGVtID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zLmxlbmd0aCkudG9FcXVhbCgwKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBkbyBhbnkgdmFsaWRhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgc3B5T24oYWNjZXNzUmVxdWVzdCwgJ2dldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMnKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3QsICdnZXRSZXF1ZXN0ZWRJdGVtcycpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUFsbElkZW50aXRpZXMoKTtcbiAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0LmdldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5mYWlsZWQpLnRvQmUoZmFsc2UpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9ycy5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3JlbW92ZUlkZW50aXRpZXMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgndGhyb3dzIGZvciBudWxsIGlkZW50aXR5IGxpc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXRpZXMobnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aHJvd3MgZm9yIG51bGwgaWRlbnRpdHkgaW4gbGlzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlSWRlbnRpdGllcyhbbnVsbF0pO1xuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIG5vIGlkZW50aXRpZXMgaGF2ZSBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5yZW1vdmVJZGVudGl0aWVzKFtpZGVudGl0eTFdKSxcbiAgICAgICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0LmZhaWxlZCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdibG93cyB1cCBpZiB0aGVyZSBpcyBubyBpZGVudGl0eSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlSWRlbnRpdGllcyhbbm9JZElkZW50aXR5XSk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1vdmVzIGEgc2luZ2xlIGlkZW50aXR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0LCBpZGVudGl0aWVzO1xuXG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5MSk7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXR5KGlkZW50aXR5Mik7XG5cbiAgICAgICAgICAgIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QucmVtb3ZlSWRlbnRpdGllcyhbaWRlbnRpdHkxXSk7XG4gICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQuZmFpbGVkKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9FcXVhbCgtMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5pbmRleE9mKGlkZW50aXR5MikpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZW1vdmVzIG11bHRpcGxlIGlkZW50aXRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQsIGlkZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkxKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkyKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkSWRlbnRpdHkoaWRlbnRpdHkzKTtcblxuICAgICAgICAgICAgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5yZW1vdmVJZGVudGl0aWVzKFtpZGVudGl0eTEsIGlkZW50aXR5Ml0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuXG4gICAgICAgICAgICBpZGVudGl0aWVzID0gYWNjZXNzUmVxdWVzdC5nZXRJZGVudGl0aWVzKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkxKSkudG9FcXVhbCgtMSk7XG4gICAgICAgICAgICBleHBlY3QoaWRlbnRpdGllcy5pbmRleE9mKGlkZW50aXR5MikpLnRvRXF1YWwoLTEpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTMpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVtb3ZlcyBtdWx0aXBsZSBpZGVudGl0aWVzIG9ubHkgb25jZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCwgaWRlbnRpdGllcztcblxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTIpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTMpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXRpZXMoW2lkZW50aXR5MSwgaWRlbnRpdHkxXSk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0LmZhaWxlZCkudG9FcXVhbChmYWxzZSk7XG5cbiAgICAgICAgICAgIGlkZW50aXRpZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldElkZW50aXRpZXMoKTtcblxuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMuaW5kZXhPZihpZGVudGl0eTEpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkyKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChpZGVudGl0aWVzLmluZGV4T2YoaWRlbnRpdHkzKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90IHJlbW92ZSB0aGUgc2FtZSBpZGVudGl0eSB0d2ljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCwgaWRlbnRpdGllcztcblxuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRJZGVudGl0eShpZGVudGl0eTIpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXRpZXMoW2lkZW50aXR5MV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXRpZXMoW2lkZW50aXR5MV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5mYWlsZWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgaWRlbnRpdGllcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgICAgZXhwZWN0KGlkZW50aXRpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBlcnJvciBjb2RlIGlmIGhhcyByZW1vdmVkIGFjY2VzcyByZXF1ZXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZElkZW50aXRpZXMoW2lkZW50aXR5MSwgaWRlbnRpdHkyLCBpZGVudGl0eTNdKTtcbiAgICAgICAgICAgIHNweU9uKGFjY2Vzc1JlcXVlc3QsICdnZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zJykuYW5kLnJldHVyblZhbHVlKFsnc29tZXRoaW5nJ10pO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZUlkZW50aXRpZXMoW2lkZW50aXR5MSwgaWRlbnRpdHkzXSk7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZmFpbGVkKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmVycm9ycy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QocmVzcG9uc2UuZXJyb3JzWzBdKS50b0JlKEFjY2Vzc1JlcXVlc3QuRVJST1JTLkhBU19SRU1PVkVEX0FDQ0VTUyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vXG4gICAgLy8gQURERUQgQUNDRVNTIFJFUVVFU1QgSVRFTSBURVNUU1xuICAgIC8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgZGVzY3JpYmUoJ2FkZGVkIGFjY2VzcyByZXF1ZXN0IGl0ZW1zIG1ldGhvZHMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaXRlbTFEYXRhLCBpdGVtMkRhdGEsIGl0ZW0zRGF0YSwgbm9JZEl0ZW1EYXRhLFxuICAgICAgICAgICAgaXRlbTEsIGl0ZW0yLCBpdGVtMywgbm9JZEl0ZW0sIHJlcXVlc3RlZEl0ZW0xLCByZXF1ZXN0ZWRJdGVtMiwgcmVxdWVzdGVkSXRlbTM7XG5cbiAgICAgICAgLy8gU2V0dXAgdGhlIHRlc3QgZGF0YS5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oQWNjZXNzUmVxdWVzdEl0ZW0sIFJlcXVlc3RlZEFjY2Vzc0l0ZW0sIGFjY2Vzc1JlcXVlc3RUZXN0RGF0YSkge1xuXG4gICAgICAgICAgICBpdGVtMURhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuUk9MRTtcbiAgICAgICAgICAgIGl0ZW0yRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5FTlRJVExFTUVOVDtcbiAgICAgICAgICAgIGl0ZW0zRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9TRUFSQ0hfUk9MRTtcblxuICAgICAgICAgICAgaXRlbTEgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oaXRlbTFEYXRhKTtcbiAgICAgICAgICAgIGl0ZW0yID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGl0ZW0yRGF0YSk7XG4gICAgICAgICAgICBpdGVtMyA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShpdGVtM0RhdGEpO1xuXG4gICAgICAgICAgICByZXF1ZXN0ZWRJdGVtMSA9IG5ldyBSZXF1ZXN0ZWRBY2Nlc3NJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0yID0gbmV3IFJlcXVlc3RlZEFjY2Vzc0l0ZW0oaXRlbTIpO1xuICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTMgPSBuZXcgUmVxdWVzdGVkQWNjZXNzSXRlbShpdGVtMyk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhbiBpdGVtIHdpdGhvdXQgYW4gSUQuXG4gICAgICAgICAgICBub0lkSXRlbURhdGEgPSBhbmd1bGFyLmNvcHkoaXRlbTFEYXRhKTtcbiAgICAgICAgICAgIGRlbGV0ZSBub0lkSXRlbURhdGEuaWQ7XG4gICAgICAgICAgICBub0lkSXRlbSA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShub0lkSXRlbURhdGEpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3N0YXJ0cyB3aXRoIG5vIGl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICBleHBlY3QoaXRlbXMpLm5vdC50b0JlTnVsbCgpO1xuICAgICAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNBcnJheShpdGVtcykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJuIHRoZSBSZXF1ZXN0ZWRBY2Nlc3NJdGVtIGluIHRoZSBnaXZlbiBsaXN0IHRoYXQgcmVwcmVzZW50c1xuICAgICAgICAgKiB0aGUgZ2l2ZW4gQWNjZXNzUmVxdWVzdEl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QWNjZXNzUmVxdWVzdEl0ZW19IGl0ZW0gIFRoZSBpdGVtIHRvIHNlYXJjaCBmb3IuXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXk8UmVxdWVzdGVkQWNjZXNzSXRlbT59IHJlcXVlc3RlZEl0ZW1zICBUaGUgcmVxdWVzdGVkXG4gICAgICAgICAqICAgIGl0ZW1zIHRvIHNlYXJjaCB3aXRoaW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlcXVlc3RlZEFjY2Vzc0l0ZW19IFRoZSBtYXRjaGluZyByZXF1ZXN0ZWQgaXRlbSBpZiBmb3VuZCxcbiAgICAgICAgICogICAgb3IgbnVsbCBvdGhlcndpc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0aHJvd3MgSWYgbXVsdGlwbGUgcmVxdWVzdGVkIGl0ZW1zIG1hdGNoIHRoZSBnaXZlbiBpdGVtLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZmluZFJlcXVlc3RlZEl0ZW0oaXRlbSwgcmVxdWVzdGVkSXRlbXMpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IHJlcXVlc3RlZEl0ZW1zLmZpbHRlcihmdW5jdGlvbihyZXF1ZXN0ZWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZ2V0SWQoKSA9PT0gcmVxdWVzdGVkSXRlbS5pdGVtLmdldElkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRm91bmQgbW9yZSB0aGFuIG9uZSByZXF1ZXN0ZWQgaXRlbSAuLi4gb29wcy4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKGZpbHRlcmVkLmxlbmd0aCA9PT0gMSkgPyBmaWx0ZXJlZFswXSA6IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBkZXNjcmliZSgnZ2V0UmVxdWVzdGVkSXRlbXMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3JldHVybnMgaXRlbXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMik7XG5cbiAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMSwgaXRlbXMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTIsIGl0ZW1zKSkubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0zLCBpdGVtcykpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IHJldHVybiBpdGVtcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zO1xuXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShpdGVtMSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMiwgaXRlbXMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTEsIGl0ZW1zKSkudG9CZU51bGwoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnaGFzUmVxdWVzdGVkSXRlbSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYSBudWxsIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5oYXNSZXF1ZXN0ZWRJdGVtKG51bGwpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaXRlbSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYWNjZXNzUmVxdWVzdC5oYXNSZXF1ZXN0ZWRJdGVtKG5vSWRJdGVtKTsgfSkuXG4gICAgICAgICAgICAgICAgICAgIHRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBhbiBpdGVtIHRoYXQgaGFzIGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc1JlcXVlc3RlZEl0ZW0oaXRlbTEpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhbiBpdGVtIHRoYXQgaGFzIG5vdCBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzUmVxdWVzdGVkSXRlbShpdGVtMSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhbiBpdGVtIHRoYXQgYmVlbiBhZGRlZCB0aGVuIHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzUmVxdWVzdGVkSXRlbShpdGVtMSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdhZGRSZXF1ZXN0ZWRJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBmb3IgYSBudWxsIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShudWxsKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBpZiB0aGVyZSBpcyBubyBpdGVtIElEJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0obm9JZEl0ZW0pOyB9KS5cbiAgICAgICAgICAgICAgICAgICAgdG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdhZGRzIGEgc2luZ2xlIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMSwgaXRlbXMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYWRkcyBtdWx0aXBsZSBpdGVtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyID0gYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0MikudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMSwgaXRlbXMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTIsIGl0ZW1zKSkubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2RvZXMgbm90IGFkZCB0aGUgc2FtZSBpdGVtIHR3aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSksXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDIgPSBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQyKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMSwgaXRlbXMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2V0cyB0aGUgcGVybWl0dGVkQnlJZCB3aGVuIGEgcGVybWl0dGVkQnkgaXRlbSBpcyBzdXBwbGllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEsIGl0ZW0yKSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkSXRlbSA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKVswXTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5pdGVtKS50b0VxdWFsKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5wZXJtaXR0ZWRCeUlkKS50b0VxdWFsKGl0ZW0yLmdldElkKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdyZW1vdmVSZXF1ZXN0ZWRJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdGhpbmcgZm9yIGEgbnVsbCBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIG5vIGl0ZW1zIGhhdmUgYmVlbiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0oaXRlbTEpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBpZiB0aGVyZSBpcyBubyBpdGVtIElEJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0obm9JZEl0ZW0pOyB9KS5cbiAgICAgICAgICAgICAgICAgICAgdG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZW1vdmVzIGEgc2luZ2xlIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0LCBpdGVtcztcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBpdGVtcykpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0yLCBpdGVtcykpLm5vdC50b0JlTnVsbCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZW1vdmVzIG11bHRpcGxlIGl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCwgaXRlbXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMik7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0zKTtcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcblxuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBpdGVtcykpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0yLCBpdGVtcykpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0zLCBpdGVtcykpLm5vdC50b0JlTnVsbCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdkb2VzIG5vdCByZW1vdmUgdGhlIHNhbWUgaXRlbSB0d2ljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQsIGl0ZW1zO1xuXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5yZW1vdmVSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgcmVxdWVzdGVkIHBlcm1pdHRlZCBpdGVtcyBhbG9uZyB3aXRoIHRvcCBsZXZlbCBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCwgaXRlbXM7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gaXRlbSBhbmQgYSBjb3VwbGUgb2YgcGVybWl0cy5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEsIG51bGwpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMiwgaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMywgaXRlbTEpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHBlcm1pdHRlZCByb2xlLCBvbmx5IHJlbW92ZXMgdGhhdCBvbmVcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0oaXRlbTMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0b3AgbGV2ZWwgcm9sZSwgcmVtb3ZlcyBwZXJtaXR0ZWQgcm9sZSB0b29cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYWRkcyBhcHByb3ZhbCBpdGVtIGlkIHRvIHRoZSByZW1vdmVkIGFwcHJvdmFscyBpdGVtcyBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3RlZEFjY2Vzc0l0ZW07XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBudWxsKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtLnNldEFwcHJvdmFsSXRlbUlkKCdUaGlzSXNBVGVzdCcpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0LmdldFJlbW92ZWRBcHByb3ZhbEl0ZW1zKCkubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShyZXF1ZXN0ZWRBY2Nlc3NJdGVtKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQXBwcm92YWxJdGVtcygpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZXNjcmliZSgnY29weSBhY2NvdW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcblxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogV2hlbiBnZXRBZGRpdGlvbmFsUXVlc3Rpb25zKCkgY2FsbHMgYXJlIG1hZGUsIHdlIG5lZWQgdG8ga25vdyB3aGljaCBhY2NvdW50XG4gICAgICAgICAgICAgICAgICogc2VsZWN0aW9ucyBnZXQgcGFzc2VkIGluIHdpdGggdGhlIFwib3RoZXJBZGRlZFJvbGVzXCIuICBVbmZvcnR1bmF0ZWx5LCBieSB0aGVcbiAgICAgICAgICAgICAgICAgKiB0aW1lIHRoYXQgd2UgY2FuIGNoZWNrIHRoZXNlIGluIG91ciB0ZXN0IGNvZGUsIHRoZSBSZXF1ZXN0ZWRBY2Nlc3NJdGVtIGhhc1xuICAgICAgICAgICAgICAgICAqIGFscmVhZHkgYmVlbiBtb2RpZmllZCAoaWUgLSB0aGUgYWNjb3VudCBzZWxlY3Rpb25zIGFyZSBkaWZmZXJlbnQgdGhlbiB3aGF0XG4gICAgICAgICAgICAgICAgICogd2FzIG1hZGUgaW4gdGhlIGNhbGwpLiAgRm9yIHRoaXMgcmVhc29uLCB3ZSBuZWVkIHRvIGNhcHR1cmUgdGhlIGFjY291bnQgc2VsZWN0aW9uc1xuICAgICAgICAgICAgICAgICAqIHdoZW4gdGhlIGNhbGwgaXMgbWFkZSBzbyB3ZSBjYW4gY2hlY2sgdGhlbSBsYXRlci5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBBZGRpdGlvbmFsUXVlc3Rpb25zUmVxdWVzdFNhdmVyKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgY2FsbCB0byBnZXRBZGRpdGlvbmFsUXVlc3Rpb25zKCkuICBUaGlzIGdldHNcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVtZW50ZWQgd2hlbiB3ZSBzYXZlIHRoZSBhY2NvdW50IHNlbGVjdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGR0UXVlc3Rpb25zQ2FsbENvdW50ZXIgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFuIGFycmF5IG9mIHRoZSBzYXZlZCBhY2NvdW50IHNlbGVjdGlvbnMsIGluZGV4ZWQgYnkgdGhlIGNhbGwgbnVtYmVyIHRvXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldEFkZGl0aW9uYWxRdWVzdGlvbnMoKS4gIEVhY2ggZWxlbWVudCBpcyBhbiBvYmplY3QgdGhhdCBtYXBzIHRoZSB1bmlxdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gSUQgb2YgdGhlIFJlcXVlc3RlZEFjY2Vzc0l0ZW0gdG8gdGhlIHNhdmVkIGFjY291bnQgc2VsZWN0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjY291bnRTZWxlY3Rpb25zQnlDYWxsID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNhdmUgdGhlIGFjY291bnQgc2VsZWN0aW9ucyBmb3IgdGhlIGdpdmVuIHJvbGVzIGZvciB0aGUgY3VycmVudCBjYWxsIHRvXG4gICAgICAgICAgICAgICAgICAgICAqIGdldEFkZGl0aW9uYWxRdWVzdGlvbnMoKS4gIE5vdGUgdGhhdCB0aGlzIG11c3QgYmUgb25seSBjYWxsZWQgb25jZSBwZXJcbiAgICAgICAgICAgICAgICAgICAgICogY2FsbCB0byBnZXRBZGRpdGlvbmFsUXVlc3Rpb25zKCkgYmVjYXVzZSBpdCBpbmNyZW1lbnRzIG91ciBjYWxsIGNvdW50ZXIuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXk8UmVxdWVzdGVkQWNjZXNzSXRlbT59IG90aGVyQWRkZWRSb2xlcyAgVGhlIG90aGVyQWRkZWRSb2xlc1xuICAgICAgICAgICAgICAgICAgICAgKiAgICBwYXJhbWV0ZXIgdGhhdCB3YXMgcGFzc2VkIHRvIGdldEFkZGl0aW9uYWxRdWVzdGlvbnMoKS5cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZU90aGVyQWRkZWRSb2xlc0FjY291bnRTZWxlY3Rpb25zID0gZnVuY3Rpb24ob3RoZXJBZGRlZFJvbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc29tZSBhY2NvdW50IHNlbGVjdGlvbnMuICBUaGVyZSBzaG91bGRuJ3QgYmUgYW55IGZvciB0aGlzIGNhbGwgeWV0LlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFjY3RTZWxzQnlJdGVtID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50U2VsZWN0aW9uc0J5Q2FsbFthZGR0UXVlc3Rpb25zQ2FsbENvdW50ZXJdID0gYWNjdFNlbHNCeUl0ZW07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIHJvbGUsIHNhdmluZyB0aGUgYWNjb3VudCBzZWxlY3Rpb25zIHRoYXQgd2VyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFkZSBmb3IgZWFjaC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckFkZGVkUm9sZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlckFkZGVkUm9sZXMuZm9yRWFjaChmdW5jdGlvbihyb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY2N0U2VscyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb2xlLmFjY291bnRTZWxlY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIGEgY29weS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY3RTZWxzID0gcm9sZS5hY2NvdW50U2VsZWN0aW9ucy5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2N0U2Vsc0J5SXRlbVtyb2xlLmdldFVuaXF1ZUlkKCldID0gYWNjdFNlbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdyB0aGF0IHdlJ3JlIGRvbmUgLi4uIGluY3JlbWVudCB0aGUgY2FsbCBjb3VudGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9uc0NhbGxDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJldHVybiB0aGUgYWNjb3VudCBzZWxlY3Rpb25zIHRoYXQgd2VyZSBwYXNzZWQgaW50byB0aGUgZ2l2ZW4gY2FsbCB0b1xuICAgICAgICAgICAgICAgICAgICAgKiBnZXRBZGRpdGlvbmFsUXVlc3Rpb25zKCkuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjYWxsSWR4ICBUaGUgY2FsbCBudW1iZXIgdG8gZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucygpLlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1JlcXVlc3RlZEFjY2Vzc0l0ZW19IHJvbGUgIFRoZSByb2xlIGZvciB3aGljaCB0byByZXR1cm4gc2VsZWN0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8SWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uPn0gVGhlIGFjY291bnQgc2VsZWN0aW9ucyB0aGF0IHdlcmVcbiAgICAgICAgICAgICAgICAgICAgICogICAgcGFzc2VkIGludG8gdGhlIGdpdmVuIGNhbGwgZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucygpLlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRBY2NvdW50U2VsZWN0aW9ucyA9IGZ1bmN0aW9uKGNhbGxJZHgsIHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY2N0U2Vsc0J5SXRlbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxJZHggPj0gYWNjb3VudFNlbGVjdGlvbnNCeUNhbGwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0Jvb20hIFdlIGRpZCBub3QgY2FsbCBhZGRpdGlvbmFsIHF1ZXN0aW9ucyBzZXJ2aWNlIHRoYXQgbWFueSB0aW1lcy4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2N0U2Vsc0J5SXRlbSA9IGFjY291bnRTZWxlY3Rpb25zQnlDYWxsW2NhbGxJZHhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY3RTZWxzQnlJdGVtW3JvbGUuZ2V0VW5pcXVlSWQoKV07XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zLCBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCAkcSxcbiAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucywgYWRkdFF1ZXN0aW9uc1JlcXVlc3RTYXZlcixcbiAgICAgICAgICAgICAgICAgICAgaXRlbTREYXRhLCBhY2N0U2VsMURhdGEsIGFjY3RTZWwyRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uLCBpdGVtMkFjY3RTZWxzLCBpdGVtNCwgJHJvb3RTY29wZTtcblxuICAgICAgICAgICAgICAgIC8qIGpzaGludCBtYXhwYXJhbXM6IDcgKi9cbiAgICAgICAgICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihfSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uXywgQWNjZXNzUmVxdWVzdEl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0FjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zXywgX2FjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2VfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8kcm9vdFNjb3BlXywgXyRxXywgYWNjZXNzUmVxdWVzdFRlc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIElkZW50aXR5QWNjb3VudFNlbGVjdGlvbiA9IF9JZGVudGl0eUFjY291bnRTZWxlY3Rpb25fO1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlID0gX2FjY2Vzc1JlcXVlc3RJdGVtc1NlcnZpY2VfO1xuICAgICAgICAgICAgICAgICAgICBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyA9IF9BY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9uc187XG4gICAgICAgICAgICAgICAgICAgICRxID0gXyRxXztcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZSA9IF8kcm9vdFNjb3BlXztcblxuICAgICAgICAgICAgICAgICAgICBpdGVtNERhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuUEVSTUlUVEVEX1JPTEU7XG4gICAgICAgICAgICAgICAgICAgIGFjY3RTZWwxRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9BQ0NUX1NFTEVDVElPTjE7XG4gICAgICAgICAgICAgICAgICAgIGFjY3RTZWwyRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5JREVOVElUWV9BQ0NUX1NFTEVDVElPTjI7XG5cbiAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucyA9IG5ldyBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyh7fSk7XG4gICAgICAgICAgICAgICAgICAgIGFkZHRRdWVzdGlvbnNSZXF1ZXN0U2F2ZXIgPSBuZXcgQWRkaXRpb25hbFF1ZXN0aW9uc1JlcXVlc3RTYXZlcigpO1xuICAgICAgICAgICAgICAgICAgICBzcHlPbihhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLCAnZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucycpLmFuZC5jYWxsRmFrZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFjY2Vzc1JlcXVlc3RJdGVtLCBpZGVudGl0eUlkcywgcGVybWl0dGVkQnksIGFzc2lnbm1lbnRJZCwgb3RoZXJBZGRlZFJvbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9uc1JlcXVlc3RTYXZlci5zYXZlT3RoZXJBZGRlZFJvbGVzQWNjb3VudFNlbGVjdGlvbnMob3RoZXJBZGRlZFJvbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihhZGR0UXVlc3Rpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW00ID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGl0ZW00RGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFuIGl0ZW0gYW5kIG9uZSB0aGF0IGlzIHBlcm1pdHRlZCBieSB0aGUgaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yLCBpdGVtMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHVwIGFjY291bnQgc2VsZWN0aW9ucyBvbiB0aGUgcGVybWl0LlxuICAgICAgICAgICAgICAgICAgICBpdGVtMkFjY3RTZWxzID0gWyBuZXcgSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uKGFjY3RTZWwxRGF0YSkgXTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjY291bnRTZWxlY3Rpb25zKGl0ZW0yQWNjdFNlbHMpO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGl0KCd0aHJvd3MgaWYgcGVybWl0dGluZyBpdGVtIGlzIG5vdCBmb3VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBHaXZlIHRoZSBwZXJtaXQgYSBmYWtlIHBlcm1pdHRlZEJ5SWQgdGhhdCB3b24ndCBiZSBmb3VuZC5cbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKS5wZXJtaXR0ZWRCeUlkID0gJ25vdCB0aGVyZSc7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYWNjZXNzUmVxdWVzdC5yZW1vdmVSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTsgfSkuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1Rocm93KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpdCgncmV0cmlldmVzIGFkZGl0aW9uYWwgcXVlc3Rpb25zIGZvciBlYWNoIHBlZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucyA9IG5ldyBBY2Nlc3NSZXF1ZXN0QWRkaXRpb25hbFF1ZXN0aW9ucyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudFNlbGVjdGlvbnM6IFsgYWNjdFNlbDFEYXRhIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYSBjb3VwbGUgb2YgcGVlcnMgdG8gaXRlbTIuXG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMywgaXRlbTEpO1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTQsIGl0ZW0xKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgaXQgYW5kIGxldCB0aGUgcHJvbWlzZXMgZmx5ISFcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgaXQgd2FzIGNhbGxlZCBhcHByb3ByaWF0ZWx5LlxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdEl0ZW1zU2VydmljZS5nZXRBZGRpdGlvbmFsUXVlc3Rpb25zLmNhbGxzLmNvdW50KCkpLnRvRXF1YWwoMik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIHRoYXQgb24gdGhlIHNlY29uZCBjYWxsLCB0aGUgYWNjb3VudCBzZWxlY3Rpb25zIGZyb20gdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IGNhbGwgZ2V0IHNlbnQgaW4gdGhlIHJlcXVlc3QuICBJdGVtNCBzaG91bGQgaGF2ZSBzZWxlY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIC8vIG9uIGl0LlxuICAgICAgICAgICAgICAgICAgICBjaGVja0FkZGl0aW9uYWxRdWVzdGlvbnNDYWxsKDAsIGl0ZW00LCBbIGl0ZW0zLCBpdGVtMSBdLCBbIG51bGwsIG51bGwgXSk7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQWRkaXRpb25hbFF1ZXN0aW9uc0NhbGwoMSwgaXRlbTMsIFsgaXRlbTQsIGl0ZW0xIF0sIFsgWyBhY2N0U2VsMURhdGEgXSwgbnVsbCBdKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIENoZWNrIHRoYXQgZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucyB3YXMgY2FsbGVkIHdpdGggdGhlIGdpdmVuIGl0ZW0gYW5kXG4gICAgICAgICAgICAgICAgICogb3RoZXJJdGVtcyBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGNhbGxJZHggIFRoZSBpbmRleCBvZiB0aGUgYWRkaXRpb25hbCBxdWVzdGlvbnMgY2FsbC5cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FjY2Vzc1JlcXVlc3RJdGVtfSBwZXJtaXR0ZWRJdGVtICBUaGUgaXRlbSB0aGF0IHdhcyBjYWxsZWQuXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxBY2Nlc3NSZXF1ZXN0SXRlbT59IG90aGVySXRlbXMgIFRoZSBvdGhlciBpdGVtcyB0aGF0IHdlcmVcbiAgICAgICAgICAgICAgICAgKiAgICBwYXNzZWQgdG8gdGhlIGNhbGwgdG8gZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucy5cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5PElkZW50aXR5QWNjb3VudFNlbGVjdGlvbj59IG90aGVySXRlbUFjY3RTZWxzICBBbiBhcnJheVxuICAgICAgICAgICAgICAgICAqICAgIHRoYXQgY29udGFpbnMgdGhlIGFjY291bnQgc2VsZWN0aW9ucyB0aGF0IHNob3VsZCBoYXZlIGJlZW4gc2VudFxuICAgICAgICAgICAgICAgICAqICAgIGluIHRoZSBnZXRBZGRpdGlvbmFsUXVlc3Rpb25zKCkgY2FsbCB3aXRoIHRoZSBBY2Nlc3NSZXF1ZXN0SXRlbVxuICAgICAgICAgICAgICAgICAqICAgIG9mIHRoZSBjb3JyZXNwb25kaW5nIGluZGV4IG9mIHRoZSBvdGhlckl0ZW1zIGFycmF5LlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrQWRkaXRpb25hbFF1ZXN0aW9uc0NhbGwoY2FsbElkeCwgcGVybWl0dGVkSXRlbSwgb3RoZXJJdGVtcywgb3RoZXJJdGVtQWNjdFNlbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiB0aGUgcmVxdWVzdGVkIGNhbGwuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZENhbGwgPSBhY2Nlc3NSZXF1ZXN0SXRlbXNTZXJ2aWNlLmdldEFkZGl0aW9uYWxRdWVzdGlvbnMuY2FsbHMuYWxsKClbY2FsbElkeF07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhpcyBjYWxsIHdhcyBmb3IgdGhlIGV4cGVjdGVkIHBlcm1pdHRlZCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoZm91bmRDYWxsLmFyZ3NbMF0pLnRvRXF1YWwocGVybWl0dGVkSXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIGFyZ3MuXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChmb3VuZENhbGwuYXJnc1swXSkudG9FcXVhbChwZXJtaXR0ZWRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGZvdW5kQ2FsbC5hcmdzWzFdKS50b0VxdWFsKGFjY2Vzc1JlcXVlc3QuZ2V0SWRlbnRpdHlJZHMoKSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChmb3VuZENhbGwuYXJnc1syXSkudG9FcXVhbChpdGVtMSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChmb3VuZENhbGwuYXJnc1szXSkudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGZvdW5kQ2FsbC5hcmdzWzRdLmxlbmd0aCkudG9FcXVhbChvdGhlckl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGFjY291bnQgc2VsZWN0aW9ucyB0aGF0IHdlcmUgc2VudCB3aXRoIGVhY2hcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXIgaXRlbSBhcmUgYXMgd2UgZXhwZWN0ZWQuXG4gICAgICAgICAgICAgICAgICAgIG90aGVySXRlbXMuZm9yRWFjaChmdW5jdGlvbihvdGhlckl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3RlZEl0ZW0gPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW0ob3RoZXJJdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW50UmVxdWVzdGVkSXRlbXMgPSBmb3VuZENhbGwuYXJnc1s0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW50UmVxdWVzdGVkSXRlbUlkeCA9IHNlbnRSZXF1ZXN0ZWRJdGVtcy5pbmRleE9mKHJlcXVlc3RlZEl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkQWNjdFNlbHMgPSBvdGhlckl0ZW1BY2N0U2Vsc1tpZHhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbEFjY3RTZWxzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGVzZSBpdGVtcyBtYXkgYmUgYW4gYW55IHJhbmRvbSBvcmRlciwgc28gd2UgaGF2ZSB0byBzZWFyY2guXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZm91bmQgdGhlIHNlbnQgaXRlbSB3ZSBhcmUgbG9va2luZyBmb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qoc2VudFJlcXVlc3RlZEl0ZW1JZHggPiAtMSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiB0aGUgYWNjb3VudCBzZWxlY3Rpb25zIHRoYXQgd2VyZSBjYXB0dXJlZCB3aGVuIHRoZSBjYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3YXMgbWFkZS4gIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIHVzZSAoaW5zdGVhZCBvZiBmcm9tIHRoZSBhY3R1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVlc3RlZCBpdGVtKSBiZWNhdXNlIGJ5IHRoaXMgcG9pbnQgdGhlIGFjY291bnQgc2VsZWN0aW9ucyBvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlcXVlc3RlZCBpdGVtIHdpbGwgaGF2ZSBiZWVuIHVwZGF0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxBY2N0U2VscyA9IGFkZHRRdWVzdGlvbnNSZXF1ZXN0U2F2ZXIuZ2V0QWNjb3VudFNlbGVjdGlvbnMoY2FsbElkeCwgcmVxdWVzdGVkSXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhwZWN0ZWRBY2N0U2Vscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChhY3R1YWxBY2N0U2VscykudG9CZUZhbHN5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoYWN0dWFsQWNjdFNlbHMubGVuZ3RoKS50b0VxdWFsKGV4cGVjdGVkQWNjdFNlbHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXQoJ2xvb2tzIGZvciByZW1vdmVkIHRhcmdldHMgZm9yIGVhY2ggdGFyZ2V0IHJldHVybmVkIGJ5IGFkZGl0aW9uYWwgcXVlc3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCB1cCB0aGUgZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucygpIG1vY2sgdG8gcmV0dXJuIHNvbWUgYWNjb3VudCBzZWxlY3Rpb25zLlxuICAgICAgICAgICAgICAgICAgICBhZGR0UXVlc3Rpb25zID0gbmV3IEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IElkZW50aXR5QWNjb3VudFNlbGVjdGlvbihhY2N0U2VsMURhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBJZGVudGl0eUFjY291bnRTZWxlY3Rpb24oYWNjdFNlbDJEYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTMsIGl0ZW0xKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTcHkgb24gdGhlIGZpbmQgbWV0aG9kLlxuICAgICAgICAgICAgICAgICAgICBzcHlPbihJZGVudGl0eUFjY291bnRTZWxlY3Rpb24sICdmaW5kJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFuIGl0ZW0gLi4uIHRoaXMgc2hvdWxkIGxvb2sgZm9yIGFsbCA0IHRhcmdldHMgcmV0dXJuZWQgYnkgYWRkdCBxdWVzdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShpdGVtMik7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KElkZW50aXR5QWNjb3VudFNlbGVjdGlvbi5maW5kLmNhbGxzLmNvdW50KCkpLnRvRXF1YWwoNCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2hlY2tGaW5kQ2FsbCgwLCBhZGR0UXVlc3Rpb25zLmFjY291bnRTZWxlY3Rpb25zWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucy5hY2NvdW50U2VsZWN0aW9uc1swXS5wcm92aXNpb25pbmdUYXJnZXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tGaW5kQ2FsbCgxLCBhZGR0UXVlc3Rpb25zLmFjY291bnRTZWxlY3Rpb25zWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucy5hY2NvdW50U2VsZWN0aW9uc1swXS5wcm92aXNpb25pbmdUYXJnZXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tGaW5kQ2FsbCgyLCBhZGR0UXVlc3Rpb25zLmFjY291bnRTZWxlY3Rpb25zWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucy5hY2NvdW50U2VsZWN0aW9uc1sxXS5wcm92aXNpb25pbmdUYXJnZXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tGaW5kQ2FsbCgzLCBhZGR0UXVlc3Rpb25zLmFjY291bnRTZWxlY3Rpb25zWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkdFF1ZXN0aW9ucy5hY2NvdW50U2VsZWN0aW9uc1sxXS5wcm92aXNpb25pbmdUYXJnZXRzWzFdKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrRmluZENhbGwoY2FsbElkeCwgYWNjdFNlbCwgdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uLmZpbmQuY2FsbHMuYWxsKClbY2FsbElkeF0uYXJncztcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGFyZ3NbMF0pLnRvRXF1YWwoaXRlbTJBY2N0U2Vscyk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChhcmdzWzFdKS50b0VxdWFsKGFjY3RTZWwpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoYXJnc1syXSkudG9FcXVhbCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGl0KCdkb2VzIG5vdCBtZXJnZSByZW1vdmVkIHRhcmdldHMgb250byBwZWVycyBpZiBub3QgcmV0dXJuZWQgYnkgYWRkaXRpb25hbCBxdWVzdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3RlZEl0ZW07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFub3RoZXIgaXRlbSB0aGF0IGNvdWxkIGhhdmUgdGhlIHNlbGVjdGlvbnMgY29waWVkIHRvIGl0LlxuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTMsIGl0ZW0xKTtcblxuICAgICAgICAgICAgICAgICAgICBzcHlPbihJZGVudGl0eUFjY291bnRTZWxlY3Rpb24sICdtZXJnZUFjY291bnRTZWxlY3Rpb25zJykuYW5kLmNhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSEgIEFkZGl0aW9uYWwgcXVlc3Rpb25zIHJldHVybnMgbm8gYWNjb3VudCBzZWxlY3Rpb25zLlxuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IGl0ZW0zIHN0aWxsIGRvZXNuJ3QgaGF2ZSBhY2NvdW50IHNlbGVjdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0gPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW0oaXRlbTMpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5hY2NvdW50U2VsZWN0aW9ucykudG9CZU51bGwoKTtcblxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoSWRlbnRpdHlBY2NvdW50U2VsZWN0aW9uLm1lcmdlQWNjb3VudFNlbGVjdGlvbnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpdCgnbWVyZ2VzIHJlbW92ZWQgdGFyZ2V0cyBvbnRvIHBlZXJzIGlmIHJldHVybmVkIGJ5IGFkZGl0aW9uYWwgcXVlc3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ZWRJdGVtO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCB1cCB0aGUgZ2V0QWRkaXRpb25hbFF1ZXN0aW9ucygpIG1vY2sgdG8gcmV0dXJuIHNvbWUgYWNjb3VudCBzZWxlY3Rpb25zLlxuICAgICAgICAgICAgICAgICAgICBhZGR0UXVlc3Rpb25zID0gbmV3IEFjY2Vzc1JlcXVlc3RBZGRpdGlvbmFsUXVlc3Rpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY291bnRTZWxlY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IElkZW50aXR5QWNjb3VudFNlbGVjdGlvbihhY2N0U2VsMURhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbm90aGVyIGl0ZW0gdGhhdCB3aWxsIGhhdmUgdGhlIHNlbGVjdGlvbnMgY29waWVkIHRvIGl0LlxuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTMsIGl0ZW0xKTtcblxuICAgICAgICAgICAgICAgICAgICBzcHlPbihJZGVudGl0eUFjY291bnRTZWxlY3Rpb24sICdtZXJnZUFjY291bnRTZWxlY3Rpb25zJykuYW5kLmNhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSFcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBWZXJpZnkgdGhhdCBpdGVtMyBoYXMgdGhlIHNlbGVjdGlvbnMgbWVyZ2VkIG9udG8gaXQuXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZEl0ZW0gPSBhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW0oaXRlbTMpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbS5hY2NvdW50U2VsZWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXF1ZXN0ZWRJdGVtLmFjY291bnRTZWxlY3Rpb25zWzBdLmdldFByb3Zpc2lvbmluZ1RhcmdldHMoKS5sZW5ndGgpLnRvRXF1YWwoMik7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KElkZW50aXR5QWNjb3VudFNlbGVjdGlvbi5tZXJnZUFjY291bnRTZWxlY3Rpb25zKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpdCgnZG9lcyBub3QgdGhyb3cgd2hlbiByZW1vdmluZyB0aGUgb25seSBwZXJtaXQgd2l0aCBhY2NvdW50IHNlbGVjdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTMsIGl0ZW0xKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRSZXF1ZXN0ZWRJdGVtQWNjb3VudFNlbGVjdGlvbnMoaXRlbTMsIFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGl0eUlkOiAnc29tZUlkJ1xuICAgICAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwZXJtaXR0ZWQgcm9sZSwgZG8gbm90IHRocm93XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShpdGVtMyk7XG4gICAgICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2NsZWFyUmVxdWVzdGVkSXRlbXMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgYWxsIHJlcXVlc3RlZCBpdGVtcycsIGluamVjdChmdW5jdGlvbihBY2Nlc3NSZXF1ZXN0SXRlbSwgYWNjZXNzUmVxdWVzdFRlc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0xRGF0YSA9IGFjY2Vzc1JlcXVlc3RUZXN0RGF0YS5ST0xFLFxuICAgICAgICAgICAgICAgICAgICBpdGVtMkRhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuRU5USVRMRU1FTlQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0xID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGl0ZW0xRGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0yID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGl0ZW0yRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdGFydCB3aXRoIHNvbWUgaXRlbXMuXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2xlYXIgYW5kIGNoZWNrLlxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuY2xlYXJSZXF1ZXN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0LmdldFJlcXVlc3RlZEl0ZW1zKCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnc2V0UmVxdWVzdGVkSXRlbUFjY291bnRTZWxlY3Rpb25zKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhY2NvdW50U2VsZWN0aW9ucyA9IFt7fV07XG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgbm8gaXRlbXMgaGF2ZSBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFJlcXVlc3RlZEl0ZW1BY2NvdW50U2VsZWN0aW9ucyhpdGVtMSk7XG4gICAgICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBpZiBubyBpdGVtIGlzIHNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0UmVxdWVzdGVkSXRlbUFjY291bnRTZWxlY3Rpb25zKG51bGwpO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaXRlbSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRSZXF1ZXN0ZWRJdGVtQWNjb3VudFNlbGVjdGlvbnMobm9JZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2V0cyBhY2NvdW50IHNlbGVjdGlvbnMgZm9yIG9uZSBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zO1xuXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuXG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRSZXF1ZXN0ZWRJdGVtQWNjb3VudFNlbGVjdGlvbnMoaXRlbTEsIGFjY291bnRTZWxlY3Rpb25zKTtcbiAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbXMoKTtcblxuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBpdGVtcykuYWNjb3VudFNlbGVjdGlvbnMpLnRvRXF1YWwoYWNjb3VudFNlbGVjdGlvbnMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMiwgaXRlbXMpLmFjY291bnRTZWxlY3Rpb25zKS50b0JlTnVsbCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdzZXRzIGFjY291bnQgc2VsZWN0aW9ucyBmb3IgbXVsdGlwbGUgaXRlbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMik7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0zKTtcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0UmVxdWVzdGVkSXRlbUFjY291bnRTZWxlY3Rpb25zKGl0ZW0xLCBhY2NvdW50U2VsZWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRSZXF1ZXN0ZWRJdGVtQWNjb3VudFNlbGVjdGlvbnMoaXRlbTIsIGFjY291bnRTZWxlY3Rpb25zKTtcblxuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBpdGVtcykuYWNjb3VudFNlbGVjdGlvbnMpLnRvRXF1YWwoYWNjb3VudFNlbGVjdGlvbnMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMiwgaXRlbXMpLmFjY291bnRTZWxlY3Rpb25zKS50b0VxdWFsKGFjY291bnRTZWxlY3Rpb25zKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTMsIGl0ZW1zKS5hY2NvdW50U2VsZWN0aW9ucykudG9CZU51bGwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnb3ZlcndyaXRlcyBhY2NvdW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3QWNjb3VudFNlbGVjdGlvbnMgPSBbe30se31dLCBpdGVtcztcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFJlcXVlc3RlZEl0ZW1BY2NvdW50U2VsZWN0aW9ucyhpdGVtMSwgYWNjb3VudFNlbGVjdGlvbnMpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMSwgaXRlbXMpLmFjY291bnRTZWxlY3Rpb25zKS50b0VxdWFsKGFjY291bnRTZWxlY3Rpb25zKTtcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuXG4gICAgICAgICAgICAgICAgICAgIHNldFJlcXVlc3RlZEl0ZW1BY2NvdW50U2VsZWN0aW9ucyhpdGVtMSwgbmV3QWNjb3VudFNlbGVjdGlvbnMpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMSwgaXRlbXMpLmFjY291bnRTZWxlY3Rpb25zKS50b0VxdWFsKG5ld0FjY291bnRTZWxlY3Rpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnZ2V0UmVxdWVzdGVkUGVybWl0dGVkSXRlbXMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ2Jsb3dzIGNodW5rcyB3aXRoIGEgbnVsbCBwZXJtaXR0ZWRCeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRQZXJtaXR0ZWRJdGVtcyhudWxsKTsgfSkuXG4gICAgICAgICAgICAgICAgICAgIHRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBub3RoaW5nIGhhcyBiZWVuIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkUGVybWl0dGVkSXRlbXMocmVxdWVzdGVkSXRlbTEpKS5cbiAgICAgICAgICAgICAgICAgICAgdG9FcXVhbChbXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgdGhlcmUgYXJlIG5vIHBlcm1pdHMgc2VsZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gaXRlbSBidXQgbm8gcGVybWl0LlxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkUGVybWl0dGVkSXRlbXMocmVxdWVzdGVkSXRlbTEpKS5cbiAgICAgICAgICAgICAgICAgICAgdG9FcXVhbChbXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNlbGVjdGVkIHBlcm1pdHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVybWl0cztcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBhbiBpdGVtIGFuZCBhIGNvdXBsZSBvZiBwZXJtaXRzLlxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yLCBpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0zLCBpdGVtMSk7XG5cbiAgICAgICAgICAgICAgICBwZXJtaXRzID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRQZXJtaXR0ZWRJdGVtcyhyZXF1ZXN0ZWRJdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBwZXJtaXRzKSkudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTIsIHBlcm1pdHMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTMsIHBlcm1pdHMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnZ2V0VG9wTGV2ZWxSZXF1ZXN0ZWRJdGVtcygpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdCgncmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBub3RoaW5nIGhhcyBiZWVuIHNlbGVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0VG9wTGV2ZWxSZXF1ZXN0ZWRJdGVtcygpKS50b0VxdWFsKFtdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyBvbmx5IHRoZSB0b3AgbGV2ZWwgcmVxdWVzdGVkIGl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvcExldmVsSXRlbXM7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gaXRlbSBhbmQgYSBjb3VwbGUgb2YgcGVybWl0cy5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEsIG51bGwpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMiwgaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMywgaXRlbTEpO1xuXG4gICAgICAgICAgICAgICAgdG9wTGV2ZWxJdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0VG9wTGV2ZWxSZXF1ZXN0ZWRJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh0b3BMZXZlbEl0ZW1zKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdCh0b3BMZXZlbEl0ZW1zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTEsIHRvcExldmVsSXRlbXMpKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTIsIHRvcExldmVsSXRlbXMpKS50b0JlTnVsbCgpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaW5kUmVxdWVzdGVkSXRlbShpdGVtMywgdG9wTGV2ZWxJdGVtcykpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2dldFJlcXVlc3RlZEl0ZW0oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHJlcXVlc3RlZCBpdGVtIGlmIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ZWRJdGVtID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbSkudG9FcXVhbChyZXF1ZXN0ZWRJdGVtMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIGl0ZW0gaXMgbm90IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdGVkSXRlbSA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbSh7XG4gICAgICAgICAgICAgICAgICAgIGdldElkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZG9lcyBub3QgZXhpc3QnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlcXVlc3RlZEl0ZW0pLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnZ2V0UmVxdWVzdGVkSXRlbUJ5SWQoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHJlcXVlc3RlZCBpdGVtIGlmIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ZWRJdGVtID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtQnlJZChpdGVtMS5nZXRJZCgpKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbSkudG9FcXVhbChyZXF1ZXN0ZWRJdGVtMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIGl0ZW0gaXMgbm90IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdGVkSXRlbSA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbUJ5SWQoJ25vdCBhIHJlYWwgSUQnKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVxdWVzdGVkSXRlbSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdzZXRBc3NpZ25tZW50SWQoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFzc2lnbm1lbnRJZCA9ICdhc3NpZ25tZW50MSc7XG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgbm8gaXRlbXMgaGF2ZSBiZWVuIGFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldEFzc2lnbm1lbnRJZChpdGVtMSk7XG4gICAgICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBpZiBubyBpdGVtIGlzIHNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0QXNzaWdubWVudElkKG51bGwpO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaXRlbSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRBc3NpZ25tZW50SWQobm9JZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2V0cyBhc3NpZ25tZW50IGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zLCBhc3NpZ25tZW50SWQyID0gJ2JsYWhibGFoJztcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3Quc2V0QXNzaWdubWVudElkKGl0ZW0xLCBhc3NpZ25tZW50SWQpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZXF1ZXN0ZWRJdGVtcygpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTEsIGl0ZW1zKS5hc3NpZ25tZW50SWQpLnRvRXF1YWwoYXNzaWdubWVudElkKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmluZFJlcXVlc3RlZEl0ZW0oaXRlbTIsIGl0ZW1zKS5hc3NpZ25tZW50SWQpLnRvQmVOdWxsKCk7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldEFzc2lnbm1lbnRJZChpdGVtMSwgYXNzaWdubWVudElkMik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbmRSZXF1ZXN0ZWRJdGVtKGl0ZW0xLCBpdGVtcykuYXNzaWdubWVudElkKS50b0VxdWFsKGFzc2lnbm1lbnRJZDIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdnZXRPdGhlclJlcXVlc3RlZFJvbGVzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0ICgncmV0dXJucyBlbXB0eSBhcnJheSB3aXRoIHVuZGVmaW5lZCBwYXJhbXRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0LmdldE90aGVyUmVxdWVzdGVkUm9sZXMobnVsbCkpLnRvRXF1YWwoW10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ICgndGhyb3dzIGlmIGJvZ3VzIHBlcm1pdHRlZEJ5IGlkIHNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuZ2V0T3RoZXJSZXF1ZXN0ZWRSb2xlcygnanVuaycpO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCAoJ3Rocm93cyBpZiBub24tcmVxdWVzdGVkIGl0ZW0gc2VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5nZXRPdGhlclJlcXVlc3RlZFJvbGVzKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQgKCdyZXR1cm5zIHBlcm1pdHRpbmcgcm9sZSB3aXRoIHBlcm1pdHRlZEJ5IElEIHZhbHVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTIpO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0T3RoZXJSZXF1ZXN0ZWRSb2xlcyhpdGVtMS5pZCkpLlxuICAgICAgICAgICAgICAgICAgICB0b0VxdWFsKFtyZXF1ZXN0ZWRJdGVtMV0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ICgncmV0dXJucyBwZXJtaXR0aW5nIHJvbGUgd2l0aCBwZXJtaXR0ZWRCeSBvYmplY3QgdmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMik7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRPdGhlclJlcXVlc3RlZFJvbGVzKGl0ZW0xKSkuXG4gICAgICAgICAgICAgICAgICAgIHRvRXF1YWwoW3JlcXVlc3RlZEl0ZW0xXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQgKCdyZXR1cm5zIG90aGVyIHBlcm1pdHRlZCByb2xlcyBhbG9uZyB3aXRoIHBlcm1pdHRpbmcgcm9sZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yLCBpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0zLCBpdGVtMSk7XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRJdGVtMi5wZXJtaXR0ZWRCeUlkID0gaXRlbTEuaWQ7XG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkSXRlbTMucGVybWl0dGVkQnlJZCA9IGl0ZW0xLmlkO1xuXG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuZ2V0T3RoZXJSZXF1ZXN0ZWRSb2xlcyhpdGVtMSkpLlxuICAgICAgICAgICAgICAgICAgICB0b0VxdWFsKFtyZXF1ZXN0ZWRJdGVtMiwgcmVxdWVzdGVkSXRlbTMsIHJlcXVlc3RlZEl0ZW0xXSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vXG4gICAgLy8gUkVNT1ZFRCBDVVJSRU5UIEFDQ0VTUyBJVEVNIFRFU1RTXG4gICAgLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICBkZXNjcmliZSgncmVtb3ZlZCBjdXJyZW50IHJlcXVlc3QgaXRlbXMgbWV0aG9kcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpdGVtMURhdGEsIGl0ZW0yRGF0YSwgbm9JZEl0ZW1EYXRhLCBpdGVtMSwgaXRlbTIsIG5vSWRJdGVtO1xuXG4gICAgICAgIC8vIFNldHVwIHRoZSB0ZXN0IGRhdGEuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKEN1cnJlbnRBY2Nlc3NJdGVtLCBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEpIHtcblxuICAgICAgICAgICAgaXRlbTFEYXRhID0gYWNjZXNzUmVxdWVzdFRlc3REYXRhLkNVUlJFTlRfQUNDRVNTX1JPTEU7XG4gICAgICAgICAgICBpdGVtMkRhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuQ1VSUkVOVF9BQ0NFU1NfRU5USVRMRU1FTlQ7XG5cbiAgICAgICAgICAgIGl0ZW0xID0gbmV3IEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xRGF0YSk7XG4gICAgICAgICAgICBpdGVtMiA9IG5ldyBDdXJyZW50QWNjZXNzSXRlbShpdGVtMkRhdGEpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYW4gaXRlbSB3aXRob3V0IGFuIElELlxuICAgICAgICAgICAgbm9JZEl0ZW1EYXRhID0gYW5ndWxhci5jb3B5KGl0ZW0xRGF0YSk7XG4gICAgICAgICAgICBkZWxldGUgbm9JZEl0ZW1EYXRhLmlkO1xuICAgICAgICAgICAgZGVsZXRlIG5vSWRJdGVtRGF0YS5hc3NpZ25tZW50SWQ7XG4gICAgICAgICAgICBub0lkSXRlbSA9IG5ldyBDdXJyZW50QWNjZXNzSXRlbShub0lkSXRlbURhdGEpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaXQoJ3N0YXJ0cyB3aXRoIG5vIGl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcykubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICAgICBleHBlY3QoYW5ndWxhci5pc0FycmF5KGl0ZW1zKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdnZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGl0ZW1zIHRoYXQgaGF2ZSBiZWVuIG1hcmtlZCBmb3IgcmVtb3ZhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtcztcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMik7XG5cbiAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YoaXRlbTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5pbmRleE9mKGl0ZW0yKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgcmV0dXJuIGl0ZW1zIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTIpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKTtcblxuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMuaW5kZXhPZihpdGVtMikpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YoaXRlbTEpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnaGFzUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhIG51bGwgaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc1JlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShudWxsKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ2Jsb3dzIHVwIGlmIHRoZXJlIGlzIG5vIHVuaXF1ZSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5oYXNSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0obm9JZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0cnVlIGZvciBhbiBpdGVtIHRoYXQgaGFzIGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGFjY2Vzc1JlcXVlc3QuaGFzUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgYW4gaXRlbSB0aGF0IGhhcyBub3QgYmVlbiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc1JlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGZhbHNlIGZvciBhbiBpdGVtIHRoYXQgYmVlbiBhZGRlZCB0aGVuIHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChhY2Nlc3NSZXF1ZXN0Lmhhc1JlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdhZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ2RvZXMgbm90aGluZyBmb3IgYSBudWxsIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0obnVsbCksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaXRlbSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0obm9JZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYWRkcyBhIHNpbmdsZSBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QuYWRkUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YoaXRlbTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdhZGRzIG11bHRpcGxlIGl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGFjY2Vzc1JlcXVlc3QuYWRkUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MiA9IGFjY2Vzc1JlcXVlc3QuYWRkUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0yKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQyKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YoaXRlbTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5pbmRleE9mKGl0ZW0yKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgYWRkIHRoZSBzYW1lIGl0ZW0gdHdpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTEpLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQyID0gYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTEpLFxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDIpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YoaXRlbTEpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdyZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXQoJ2RvZXMgbm90aGluZyBmb3IgYSBudWxsIGl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5yZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0obnVsbCksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIG5vIGl0ZW1zIGhhdmUgYmVlbiBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSksXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gaXRlbSBJRCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5yZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0obm9JZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmVtb3ZlcyBhIHNpbmdsZSBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCwgaXRlbXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTIpO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYWNjZXNzUmVxdWVzdC5yZW1vdmVSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmluZGV4T2YoaXRlbTEpKS50b0VxdWFsKC0xKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMuaW5kZXhPZihpdGVtMikpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ3JlbW92ZXMgbXVsdGlwbGUgaXRlbXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0LCBpdGVtcztcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMik7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgcmVtb3ZlIHRoZSBzYW1lIGl0ZW0gdHdpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0LCBpdGVtcztcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtKGl0ZW0xKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMik7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgICAgICBpdGVtcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhY2Nlc3NSZXF1ZXN0LnJlbW92ZVJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdyZW1vdmVBbGxSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdyZW1vdmVzIGFsbCBpdGVtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtcztcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlbW92ZWRDdXJyZW50QWNjZXNzSXRlbShpdGVtMSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW0oaXRlbTIpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcblxuICAgICAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlQWxsUmVtb3ZlZEN1cnJlbnRBY2Nlc3NJdGVtcygpO1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQ3VycmVudEFjY2Vzc0l0ZW1zKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy9cbiAgICAvLyBQRVJNSVRURUQgUk9MRVMgVEVTVFNcbiAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGRlc2NyaWJlKCdwZXJtaXR0ZWQgcm9sZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaXRlbTEsIGl0ZW0yLCBpdGVtMztcblxuICAgICAgICAvLyBTZXR1cCB0aGUgdGVzdCBkYXRhLlxuICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbihBY2Nlc3NSZXF1ZXN0SXRlbSwgYWNjZXNzUmVxdWVzdFRlc3REYXRhKSB7XG5cbiAgICAgICAgICAgIHZhciBpdGVtMURhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuQ1VSUkVOVF9BQ0NFU1NfUk9MRSxcbiAgICAgICAgICAgICAgICBpdGVtMkRhdGEgPSBhY2Nlc3NSZXF1ZXN0VGVzdERhdGEuSURFTlRJVFlfU0VBUkNIX1JPTEUsXG4gICAgICAgICAgICAgICAgaXRlbTNEYXRhID0gYWNjZXNzUmVxdWVzdFRlc3REYXRhLlJPTEU7XG4gICAgICAgICAgICBpdGVtMSA9IG5ldyBBY2Nlc3NSZXF1ZXN0SXRlbShpdGVtMURhdGEpO1xuICAgICAgICAgICAgaXRlbTIgPSBuZXcgQWNjZXNzUmVxdWVzdEl0ZW0oaXRlbTJEYXRhKTtcbiAgICAgICAgICAgIGl0ZW0zID0gbmV3IEFjY2Vzc1JlcXVlc3RJdGVtKGl0ZW0zRGF0YSk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgnc3RhcnRzIHdpdGggbm8gcm9sZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwZXJtaXR0ZWRSb2xlcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UGVybWl0dGVkUm9sZXMoaXRlbTEuaWQpO1xuICAgICAgICAgICAgZXhwZWN0KHBlcm1pdHRlZFJvbGVzKS50b0JlTnVsbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnZ2V0UGVybWl0dGVkUm9sZXMoKScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpdCgnYmxvd3MgdXAgaWYgdGhlcmUgaXMgbm8gcm9sZSBpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5nZXRQZXJtaXR0ZWRSb2xlcyh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgncmV0dXJucyBwZXJtaXR0ZWQgcm9sZXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVybWl0dGVkUm9sZXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkLCBbaXRlbTIsIGl0ZW0zXSk7XG5cbiAgICAgICAgICAgICAgICBwZXJtaXR0ZWRSb2xlcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UGVybWl0dGVkUm9sZXMoaXRlbTEuaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHBlcm1pdHRlZFJvbGVzLmluZGV4T2YoaXRlbTIpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5pbmRleE9mKGl0ZW0zKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgcmV0dXJuIGl0ZW1zIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVybWl0dGVkUm9sZXM7XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkLCBbaXRlbTIsIGl0ZW0zXSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRQZXJtaXR0ZWRSb2xlcyhpdGVtMS5pZCwgW2l0ZW0yXSk7XG5cbiAgICAgICAgICAgICAgICBwZXJtaXR0ZWRSb2xlcyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UGVybWl0dGVkUm9sZXMoaXRlbTEuaWQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHBlcm1pdHRlZFJvbGVzLmluZGV4T2YoaXRlbTIpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5pbmRleE9mKGl0ZW0zKSkudG9FcXVhbCgtMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3NldFBlcm1pdHRlZFJvbGVzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBpZiB0aGVyZSBpcyBubyByb2xlIGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFBlcm1pdHRlZFJvbGVzKHVuZGVmaW5lZCwgW2l0ZW0xXSk7XG4gICAgICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdibG93cyB1cCBpZiBhbiBhcnJheSBpcyBub3QgcGFzc2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkLCBpdGVtMSk7XG4gICAgICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KCdhZGRzIGEgc2luZ2xlIGl0ZW0gYXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVybWl0dGVkUm9sZXM7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRQZXJtaXR0ZWRSb2xlcyhpdGVtMS5pZCwgW2l0ZW0yXSk7XG4gICAgICAgICAgICAgICAgcGVybWl0dGVkUm9sZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGVybWl0dGVkUm9sZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5pbmRleE9mKGl0ZW0yKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnYWRkcyBtdWx0aXBsZSBpdGVtcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJtaXR0ZWRSb2xlcztcbiAgICAgICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LnNldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkLCBbaXRlbTIsIGl0ZW0zXSk7XG4gICAgICAgICAgICAgICAgcGVybWl0dGVkUm9sZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGVybWl0dGVkUm9sZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5pbmRleE9mKGl0ZW0yKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGVybWl0dGVkUm9sZXMuaW5kZXhPZihpdGVtMykpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXQoJ292ZXJ3cml0ZXMgd2hlbiBhZGRpbmcgdG8gdGhlIHNhbWUgaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVybWl0dGVkUm9sZXM7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRQZXJtaXR0ZWRSb2xlcyhpdGVtMS5pZCwgW2l0ZW0yXSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5zZXRQZXJtaXR0ZWRSb2xlcyhpdGVtMS5pZCwgW2l0ZW0zXSk7XG4gICAgICAgICAgICAgICAgcGVybWl0dGVkUm9sZXMgPSBhY2Nlc3NSZXF1ZXN0LmdldFBlcm1pdHRlZFJvbGVzKGl0ZW0xLmlkKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGVybWl0dGVkUm9sZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwZXJtaXR0ZWRSb2xlcy5pbmRleE9mKGl0ZW0yKSkudG9FcXVhbCgtMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHBlcm1pdHRlZFJvbGVzLmluZGV4T2YoaXRlbTMpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0UmVtb3ZlZEFwcHJvdmFsSXRlbXMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhIGxpc3Qgb2YgcmVtb3ZlZCBhcHByb3ZhbEl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaXRlbTEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIDE7IH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGl0ZW0yID0ge1xuICAgICAgICAgICAgICAgICAgICBnZXRJZDogZnVuY3Rpb24oKSB7IHJldHVybiAyOyB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpdGVtMyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0SWQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gMzsgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkQWNjZXNzSXRlbTEsXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkQWNjZXNzSXRlbTM7XG4gICAgICAgICAgICBhY2Nlc3NSZXF1ZXN0LmFkZFJlcXVlc3RlZEl0ZW0oaXRlbTEpO1xuICAgICAgICAgICAgYWNjZXNzUmVxdWVzdC5hZGRSZXF1ZXN0ZWRJdGVtKGl0ZW0yKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QuYWRkUmVxdWVzdGVkSXRlbShpdGVtMyk7XG4gICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtMSA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbShpdGVtMSk7XG4gICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtMyA9IGFjY2Vzc1JlcXVlc3QuZ2V0UmVxdWVzdGVkSXRlbShpdGVtMyk7XG4gICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtMS5zZXRBcHByb3ZhbEl0ZW1JZCgnRm9vJyk7XG4gICAgICAgICAgICByZXF1ZXN0ZWRBY2Nlc3NJdGVtMy5zZXRBcHByb3ZhbEl0ZW1JZCgnQmFyJyk7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQXBwcm92YWxJdGVtcygpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShyZXF1ZXN0ZWRBY2Nlc3NJdGVtMSk7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQXBwcm92YWxJdGVtcygpLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShyZXF1ZXN0ZWRBY2Nlc3NJdGVtMyk7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQXBwcm92YWxJdGVtcygpLmxlbmd0aCkudG9CZSgyKTtcbiAgICAgICAgICAgIC8qIFJlbW92aW5nIHRoZSBzYW1lIGl0ZW0gdHdpY2UgaW4gYSByb3cgZG9lcyBub3QgY2F1c2UgYW55IHdlaXJkbmVzcyByaWdodD8gKi9cbiAgICAgICAgICAgIGFjY2Vzc1JlcXVlc3QucmVtb3ZlUmVxdWVzdGVkSXRlbShyZXF1ZXN0ZWRBY2Nlc3NJdGVtMyk7XG4gICAgICAgICAgICBleHBlY3QoYWNjZXNzUmVxdWVzdC5nZXRSZW1vdmVkQXBwcm92YWxJdGVtcygpLmxlbmd0aCkudG9CZSgyKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbn0pO1xuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
