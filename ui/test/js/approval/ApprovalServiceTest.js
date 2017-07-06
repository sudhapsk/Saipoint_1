System.register(['test/js/TestInitializer', 'approval/ApprovalModule', 'test/js/TestModule', 'test/js/CustomMatchers', './ApprovalTestDataService'], function (_export) {
    'use strict';

    var approvalModule, testModule, CustomMatchers;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_approvalApprovalModule) {
            approvalModule = _approvalApprovalModule['default'];
        }, function (_testJsTestModule) {
            testModule = _testJsTestModule['default'];
        }, function (_testJsCustomMatchers) {
            CustomMatchers = _testJsCustomMatchers['default'];
        }, function (_ApprovalTestDataService) {}],
        execute: function () {

            describe('ApprovalService', function () {
                var types = ['anotherTest'],
                    twoTypes = ['oneType', 'anotherType'],
                    owner = 'test',
                    http,
                    approvalService,
                    spHttpService,
                    testService,
                    approvalTestDataService;

                beforeEach(module(testModule));
                beforeEach(module(approvalModule));

                beforeEach(inject(function ($httpBackend, _approvalService_, _spHttpService_, _testService_, _approvalTestDataService_) {
                    http = $httpBackend;
                    approvalService = _approvalService_;
                    spHttpService = _spHttpService_;
                    testService = _testService_;
                    approvalTestDataService = _approvalTestDataService_;
                }));

                afterEach(function () {
                    http.verifyNoOutstandingExpectation();
                    http.verifyNoOutstandingRequest();
                });

                describe('getApprovalCount()', function () {

                    /**
                     * Create the URL for the count endpoint with the given query string.
                     */
                    var countUrl = function (suffix) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/count?' + suffix;
                    };

                    it('should apply passed parameters to ajax call', function () {
                        http.expectGET(countUrl('ownerId=test&requestTypes=anotherTest')).respond(200, '');
                        approvalService.getApprovalCount(types, owner);
                        http.flush();
                    });

                    it('should allow the caller to not specify the owner', function () {
                        http.expectGET(countUrl('requestTypes=anotherTest')).respond(200, '');
                        approvalService.getApprovalCount(types);
                        http.flush();
                    });

                    it('should accept a list of types', function () {
                        http.expectGET(countUrl('requestTypes=oneType&requestTypes=anotherType')).respond(200, '');
                        approvalService.getApprovalCount(twoTypes);
                        http.flush();
                    });

                    it('should do something with the returned value', function () {
                        http.expectGET(countUrl('requestTypes=anotherTest')).respond(200, 23);
                        var tmp;
                        approvalService.getApprovalCount(types).success(function (data) {
                            tmp = data;
                        });
                        http.flush();
                        expect(tmp).toEqual(23);
                    });
                });

                describe('getApprovals()', function () {
                    var sortJson = '[{\'property\':\'foo\',\'direction\':\'DESC\'}]',
                        sortMock = {
                        toJson: function () {
                            return sortJson;
                        }
                    },
                        escapedSortJson,
                        Approval;

                    beforeEach(inject(function (testService, _Approval_) {
                        escapedSortJson = testService.encodeUriQuery(sortJson);
                        Approval = _Approval_;
                    }));

                    /**
                     * Create the URL for the approvals endpoint with the given query string.
                     */
                    var approvalsUrl = function (suffix) {
                        var url = SailPoint.CONTEXT_PATH + '/ui/rest/approvals/';
                        if (suffix) {
                            url += '?' + suffix;
                        }
                        return url;
                    };

                    it('should apply passed parameters to ajax call', function () {
                        http.expectGET(approvalsUrl('limit=13&requestTypes=anotherTest&sort=' + escapedSortJson + '&start=1')).respond(200, '');
                        approvalService.getApprovals(types, 1, 13, sortMock);
                        http.flush();
                    });

                    it('should allow not specifying a sort', function () {
                        http.expectGET(approvalsUrl('limit=13&requestTypes=anotherTest&start=1')).respond(200, '');
                        approvalService.getApprovals(types, 1, 13, null);
                        http.flush();
                    });

                    it('should accept a list of types', function () {
                        http.expectGET(approvalsUrl('limit=13&requestTypes=oneType&requestTypes=anotherType&start=1')).respond(200, '');
                        approvalService.getApprovals(twoTypes, 1, 13, null);
                        http.flush();
                    });

                    it('should allow not specifying a limit', function () {
                        http.expectGET(approvalsUrl('requestTypes=anotherTest&start=1')).respond(200, '');
                        approvalService.getApprovals(types, 1, null, null);
                        http.flush();
                    });

                    it('should allow not specifying a start', function () {
                        http.expectGET(approvalsUrl('requestTypes=anotherTest')).respond(200, '');
                        approvalService.getApprovals(types, null, null, null);
                        http.flush();
                    });

                    it('should allow not specifying types', function () {
                        http.expectGET(approvalsUrl()).respond(200, '');
                        approvalService.getApprovals(null, null, null, null);
                        http.flush();
                    });

                    it('should do something with the returned value', function () {
                        var approvalData = approvalTestDataService.createApproval(),
                            response = {
                            objects: [approvalData],
                            count: 1
                        },
                            tmp = {};

                        http.expectGET(approvalsUrl()).respond(200, response);
                        approvalService.getApprovals().then(function (response) {
                            tmp = response;
                        });
                        http.flush();
                        expect(tmp.data.count).toEqual(1);
                        expect(tmp.data.objects.length).toEqual(1);
                        expect(tmp.data.objects[0] instanceof Approval).toBeTruthy();
                    });
                });

                var approvalId = '1234',
                    itemId = '5678',
                    itemUrl = SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/items/' + itemId;

                describe('approveItem()', function () {
                    var approveUrl = itemUrl + '/approve';

                    it('approves an item', function () {
                        var promise, spy;
                        http.expectPOST(approveUrl).respond(200, '');
                        promise = approvalService.approveItem(approvalId, itemId);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(approveUrl).respond(500, '');
                        promise = approvalService.approveItem(approvalId, itemId);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.approveItem(null, itemId);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.approveItem(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('rejectItem()', function () {
                    var rejectUrl = itemUrl + '/reject';

                    it('rejects an item', function () {
                        var promise, spy;
                        http.expectPOST(rejectUrl).respond(200, '');
                        promise = approvalService.rejectItem(approvalId, itemId);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(rejectUrl).respond(500, '');
                        promise = approvalService.rejectItem(approvalId, itemId);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.rejectItem(null, itemId);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.rejectItem(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('undoItem()', function () {
                    var undoUrl = itemUrl + '/undo';

                    it('undoes an item', function () {
                        var promise, spy;
                        http.expectPOST(undoUrl).respond(200, '');
                        promise = approvalService.undoItem(approvalId, itemId);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(undoUrl).respond(500, '');
                        promise = approvalService.undoItem(approvalId, itemId);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.undoItem(null, itemId);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.undoItem(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('getItemTargetAccounts()', function () {
                    var targetsUrl = itemUrl + '/targetAccounts',
                        accounts = [{
                        role: 'So',
                        application: 'Sleepy',
                        account: 'Need to ... zz...zz...'
                    }, {
                        role: 'Coffee',
                        application: 'GOOD',
                        account: 'Me awakey now!!!'
                    }];

                    // Add a custom matcher to check an $http GET response.
                    beforeEach(function () {
                        jasmine.addMatchers(CustomMatchers);
                    });

                    it('gets target accounts', function () {
                        var targets, spy;
                        http.expectGET(targetsUrl).respond(200, accounts);
                        targets = approvalService.getItemTargetAccounts(approvalId, itemId);
                        spy = testService.spyOnSuccess(targets.$promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        expect(targets).toEqualResponse(accounts);
                    });

                    it('fails on REST error', function () {
                        var targets, spy;
                        http.expectGET(targetsUrl).respond(500, '');
                        targets = approvalService.getItemTargetAccounts(approvalId, itemId);
                        spy = testService.spyOnFailure(targets.$promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        expect(targets.length).toEqual(0);
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.getItemTargetAccounts(null, itemId);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.getItemTargetAccounts(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('complete()', function () {
                    var getCompleteUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/complete';
                    };

                    it('completes an approval', function () {
                        var promise, spy;
                        http.expectPOST(getCompleteUrl(approvalId)).respond(200, '');
                        promise = approvalService.complete(approvalId);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(getCompleteUrl(approvalId)).respond(500, '');
                        promise = approvalService.complete(approvalId);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.complete(null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                var username = 'brubble',
                    password = 'xyzzy',
                    userPasswordData = {
                    signatureAccountId: username,
                    signaturePassword: password
                },
                    passwordData = {
                    signaturePassword: password
                };

                describe('sign()', function () {
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/complete';
                    };

                    it('signs an approval with username and password', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId), userPasswordData).respond(200, '');
                        promise = approvalService.sign(approvalId, password, username);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('signs an approval with only password', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId), passwordData).respond(200, '');
                        promise = approvalService.sign(approvalId, password);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId), passwordData).respond(500, '');
                        promise = approvalService.sign(approvalId, password);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no password', function () {
                        expect(function () {
                            approvalService.sign(approvalId, null, username);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.sign(null, password);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('approveAll()', function () {
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/approveAll';
                    };

                    it('approves all decisions', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId)).respond(200, '');
                        promise = approvalService.approveAll(approvalId);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId)).respond(500, '');
                        promise = approvalService.approveAll(approvalId);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.approveAll(null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('rejectAll()', function () {
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/rejectAll';
                    };

                    it('rejects all decisions', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId)).respond(200, '');
                        promise = approvalService.rejectAll(approvalId);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId)).respond(500, '');
                        promise = approvalService.rejectAll(approvalId);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.rejectAll(null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('setPriority()', function () {
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId;
                    };

                    it('sends a PATCH request', function () {
                        var promise, spy;
                        http.expectPATCH(getUrl(approvalId), { priority: 'High' }).respond(200, '');
                        promise = approvalService.setPriority(approvalId, 'High');
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPATCH(getUrl(approvalId)).respond(500, '');
                        promise = approvalService.setPriority(approvalId, 'High');
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.setPriority(null, 'High');
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no priority', function () {
                        expect(function () {
                            approvalService.setPriority(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('getComments()', function () {
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/comments';
                    };

                    var comments = [{
                        'author': 'James.Smith',
                        'comment': 'some comment here',
                        'date': 1391618385380
                    }, {
                        'author': 'Harry.Dixon',
                        'comment': 'something else to say',
                        'date': 1391618389980
                    }];

                    // Add a custom matcher to check an $http GET response.
                    beforeEach(function () {
                        jasmine.addMatchers(CustomMatchers);
                    });

                    it('gets comments', function () {
                        var gotComments, spy;
                        http.expectGET(getUrl(approvalId)).respond(200, comments);
                        gotComments = approvalService.getComments(approvalId);
                        spy = testService.spyOnSuccess(gotComments.$promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        expect(gotComments).toEqualResponse(comments);
                    });

                    it('fails on REST error', function () {
                        var gotComments, spy;
                        http.expectGET(getUrl(approvalId)).respond(500, '');
                        gotComments = approvalService.getComments(approvalId);
                        spy = testService.spyOnFailure(gotComments.$promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        expect(gotComments.length).toEqual(0);
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.getComments(null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('addComment()', function () {
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/comments';
                    };

                    it('sends a POST request', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId), { comment: 'some new comment' }).respond(200, '');
                        promise = approvalService.addComment(approvalId, 'some new comment');
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId)).respond(500, '');
                        promise = approvalService.addComment(approvalId, 'some new comment');
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.addComment(null, 'some new comment');
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no comment', function () {
                        expect(function () {
                            approvalService.addComment(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('getItemComments()', function () {
                    var commentsUrl = itemUrl + '/comments';

                    var itemComments = [{
                        'author': 'James.Smith',
                        'comment': 'some comment here',
                        'date': 1391618385380
                    }, {
                        'author': 'Harry.Dixon',
                        'comment': 'something else to say',
                        'date': 1391618389980
                    }];

                    // Add a custom matcher to check an $http GET response.
                    beforeEach(function () {
                        jasmine.addMatchers(CustomMatchers);
                    });

                    it('gets comments', function () {
                        var gotComments, spy;
                        http.expectGET(commentsUrl).respond(200, itemComments);
                        gotComments = approvalService.getItemComments(approvalId, itemId);
                        spy = testService.spyOnSuccess(gotComments.$promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        expect(gotComments).toEqualResponse(itemComments);
                    });

                    it('fails on REST error', function () {
                        var gotComments, spy;
                        http.expectGET(commentsUrl).respond(500, '');
                        gotComments = approvalService.getItemComments(approvalId, itemId);
                        spy = testService.spyOnFailure(gotComments.$promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        expect(gotComments.length).toEqual(0);
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.getItemComments(null, itemId);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.getItemComments(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('addItemComment()', function () {
                    var commentsUrl = itemUrl + '/comments';

                    it('sends a POST request', function () {
                        var promise, spy;
                        http.expectPOST(commentsUrl, { comment: 'some new comment' }).respond(200, '');
                        promise = approvalService.addItemComment(approvalId, itemId, 'some new comment');
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(commentsUrl).respond(500, '');
                        promise = approvalService.addItemComment(approvalId, itemId, 'some new comment');
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.addItemComment(null, itemId, 'some new comment');
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.addItemComment(approvalId, null, 'some new comment');
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no comment', function () {
                        expect(function () {
                            approvalService.addItemComment(approvalId, itemId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('assign()', function () {
                    var assignee = 'workgroupMember';
                    var getUrl = function (approvalId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/assign';
                    };

                    it('sends a POST request', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId), { targetIdentity: assignee }).respond(200, '');
                        promise = approvalService.assign(approvalId, assignee);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('fails on REST error', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId)).respond(500, '');
                        promise = approvalService.assign(approvalId, assignee);
                        spy = testService.spyOnFailure(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.assign(null, assignee);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('succeeds with no assignee', function () {
                        var promise, spy;
                        http.expectPOST(getUrl(approvalId), { targetIdentity: null }).respond(200, '');
                        promise = approvalService.assign(approvalId, null);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                        http.verifyNoOutstandingRequest();
                    });
                });

                describe('setSunriseSunset()', function () {
                    var sunrise = new Date().getTime(),
                        sunset = sunrise + 86400000;

                    function getUrl(approvalId, itemId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/items/' + itemId;
                    }

                    it('should send a http request when everything is ok', function () {
                        var promise,
                            spy,
                            dates = {
                            sunrise: sunrise,
                            sunset: sunset
                        };
                        http.expectPATCH(getUrl(approvalId, itemId), dates).respond(200, '');
                        promise = approvalService.setSunriseSunset(approvalId, itemId, dates);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });

                    it('should throw when sunset before sunrise', function () {
                        var dates = {
                            sunrise: sunset,
                            sunset: sunrise
                        };

                        expect(function () {
                            approvalService.setSunriseSunset(approvalId, itemId, dates);
                        }).toThrow();
                    });

                    it('should throw when sunrise is before today', function () {
                        var dates = {
                            sunrise: sunrise - 172800000
                        };

                        expect(function () {
                            approvalService.setSunriseSunset(approvalId, itemId, dates);
                        }).toThrow();
                    });

                    it('should throw when sunset is before today', function () {
                        var dates = {
                            sunrise: sunset - 172800000
                        };

                        expect(function () {
                            approvalService.setSunriseSunset(approvalId, itemId, dates);
                        }).toThrow();
                    });

                    it('should default undefined values to null', function () {
                        var promise,
                            spy,
                            dates = {};
                        http.expectPATCH(getUrl(approvalId, itemId), { sunrise: null, sunset: null }).respond(200, '');
                        promise = approvalService.setSunriseSunset(approvalId, itemId, dates);
                        spy = testService.spyOnSuccess(promise);
                        http.flush();
                        expect(spy).toHaveBeenCalled();
                    });
                });

                describe('getRoleEntitlements', function () {
                    var getUrl = function (approvalId, itemId) {
                        return SailPoint.CONTEXT_PATH + '/ui/rest/approvals/' + approvalId + '/items/' + itemId + '/simpleEntitlements';
                    };

                    var listResult;

                    // Add a custom matcher to check an $http GET response.
                    beforeEach(inject(function (approvalTestDataService) {
                        jasmine.addMatchers(CustomMatchers);

                        listResult = approvalTestDataService.GENERIC_LIST_RESULT;
                    }));

                    it('pukes with no approvalId', function () {
                        expect(function () {
                            approvalService.getRoleEntitlements(null, itemId);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('pukes with no itemId', function () {
                        expect(function () {
                            approvalService.getRoleEntitlements(approvalId, null);
                        }).toThrow();
                        http.verifyNoOutstandingRequest();
                    });

                    it('gets role entitlements', function () {
                        var gotRoleEntitlements, spy;
                        http.expectGET(getUrl(approvalId, itemId)).respond(200, listResult);
                        gotRoleEntitlements = approvalService.getRoleEntitlements(approvalId, itemId);
                        spy = testService.spyOnSuccess(gotRoleEntitlements);
                        gotRoleEntitlements.then(function (roleEntitlements) {
                            expect(spy).toHaveBeenCalled();
                            expect(roleEntitlements).toEqualResponse(listResult);
                        });
                        http.flush();
                    });
                });

                describe('showExpiredSunsetDialog', function () {
                    var BULK_MSG = 'bulk message',
                        NON_BULK_MSG = 'non bulk message';

                    var spModal = undefined;

                    beforeEach(inject(function (_spModal_, spTranslateFilter) {
                        spModal = _spModal_;

                        spTranslateFilter.configureCatalog({
                            'ui_my_approvals_sunset_expired_content_bulk': BULK_MSG,
                            'ui_my_approvals_sunset_expired_content': NON_BULK_MSG
                        });
                    }));

                    it('should show proper message when bulk is true', function () {
                        spyOn(spModal, 'open');

                        approvalService.showExpiredSunsetDialog(true);

                        expect(spModal.open).toHaveBeenCalledWith({
                            title: 'ui_my_approvals_sunset_expired_title',
                            content: BULK_MSG,
                            buttons: [{
                                displayValue: 'ui_button_close',
                                primary: true
                            }]
                        });
                    });

                    it('should show proper message when bulk is not true', function () {
                        spyOn(spModal, 'open');

                        approvalService.showExpiredSunsetDialog(false);

                        expect(spModal.open).toHaveBeenCalledWith({
                            title: 'ui_my_approvals_sunset_expired_title',
                            content: NON_BULK_MSG,
                            buttons: [{
                                displayValue: 'ui_button_close',
                                primary: true
                            }]
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHJvdmFsL0FwcHJvdmFsU2VydmljZVRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixzQkFBc0IsMEJBQTBCLDhCQUE4QixVQUFVLFNBQVM7SUFDcEs7O0lBRUEsSUFBSSxnQkFBZ0IsWUFBWTtJQUNoQyxPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSx5QkFBeUI7WUFDL0UsaUJBQWlCLHdCQUF3QjtXQUMxQyxVQUFVLG1CQUFtQjtZQUM1QixhQUFhLGtCQUFrQjtXQUNoQyxVQUFVLHVCQUF1QjtZQUNoQyxpQkFBaUIsc0JBQXNCO1dBQ3hDLFVBQVUsMEJBQTBCO1FBQ3ZDLFNBQVMsWUFBWTs7WUFON0IsU0FBUyxtQkFBbUIsWUFBVztnQkFDbkMsSUFBSSxRQUFRLENBQUM7b0JBQ1QsV0FBVyxDQUFDLFdBQVc7b0JBQ3ZCLFFBQVE7b0JBQ1I7b0JBQU07b0JBQWlCO29CQUFlO29CQUFhOztnQkFFdkQsV0FBVyxPQUFPO2dCQUNsQixXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBUyxjQUFjLG1CQUFtQixpQkFBaUIsZUFDbEQsMkJBQTJCO29CQUNsRCxPQUFPO29CQUNQLGtCQUFrQjtvQkFDbEIsZ0JBQWdCO29CQUNoQixjQUFjO29CQUNkLDBCQUEwQjs7O2dCQUc5QixVQUFVLFlBQVc7b0JBQ2pCLEtBQUs7b0JBQ0wsS0FBSzs7O2dCQUdULFNBQVMsc0JBQXNCLFlBQVc7Ozs7O29CQUt0QyxJQUFJLFdBQVcsVUFBUyxRQUFRO3dCQUM1QixPQUFPLFVBQVUsZUFBZSw4QkFBOEI7OztvQkFHbEUsR0FBRywrQ0FBK0MsWUFBVzt3QkFDekQsS0FBSyxVQUFVLFNBQVMsMENBQ3BCLFFBQVEsS0FBSzt3QkFDakIsZ0JBQWdCLGlCQUFpQixPQUFPO3dCQUN4QyxLQUFLOzs7b0JBR1QsR0FBRyxvREFBb0QsWUFBVzt3QkFDOUQsS0FBSyxVQUFVLFNBQVMs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Qzs7OztvQkFJbEQsR0FBRyxnREFBZ0QsWUFBTTt3QkFDckQsTUFBTSxTQUFTOzt3QkFFZixnQkFBZ0Isd0JBQXdCOzt3QkFFeEMsT0FBTyxRQUFRLE1BQU0scUJBQXFCOzRCQUN0QyxPQUFPOzRCQUNQLFNBQVM7NEJBQ1QsU0FBUyxDQUFDO2dDQUNOLGNBQWM7Z0NBQ2QsU0FBUzs7Ozs7b0JBS3JCLEdBQUcsb0RBQW9ELFlBQU07d0JBQ3pELE1BQU0sU0FBUzs7d0JBRWYsZ0JBQWdCLHdCQUF3Qjs7d0JBRXhDLE9BQU8sUUFBUSxNQUFNLHFCQUFxQjs0QkFDdEMsT0FBTzs0QkFDUCxTQUFTOzRCQUNULFNBQVMsQ0FBQztnQ0FDTixjQUFjO2dDQUNkLFNBQVM7Ozs7Ozs7O0dBMkQxQiIsImZpbGUiOiJhcHByb3ZhbC9BcHByb3ZhbFNlcnZpY2VUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XG5pbXBvcnQgYXBwcm92YWxNb2R1bGUgZnJvbSAnYXBwcm92YWwvQXBwcm92YWxNb2R1bGUnO1xuaW1wb3J0IHRlc3RNb2R1bGUgZnJvbSAndGVzdC9qcy9UZXN0TW9kdWxlJztcbmltcG9ydCBDdXN0b21NYXRjaGVycyBmcm9tICd0ZXN0L2pzL0N1c3RvbU1hdGNoZXJzJztcbmltcG9ydCAnLi9BcHByb3ZhbFRlc3REYXRhU2VydmljZSc7XG5cbmRlc2NyaWJlKCdBcHByb3ZhbFNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHlwZXMgPSBbJ2Fub3RoZXJUZXN0J10sXG4gICAgICAgIHR3b1R5cGVzID0gWydvbmVUeXBlJywgJ2Fub3RoZXJUeXBlJ10sXG4gICAgICAgIG93bmVyID0gJ3Rlc3QnLFxuICAgICAgICBodHRwLCBhcHByb3ZhbFNlcnZpY2UsIHNwSHR0cFNlcnZpY2UsIHRlc3RTZXJ2aWNlLCBhcHByb3ZhbFRlc3REYXRhU2VydmljZTtcblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHRlc3RNb2R1bGUpKTtcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShhcHByb3ZhbE1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJGh0dHBCYWNrZW5kLCBfYXBwcm92YWxTZXJ2aWNlXywgX3NwSHR0cFNlcnZpY2VfLCBfdGVzdFNlcnZpY2VfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hcHByb3ZhbFRlc3REYXRhU2VydmljZV8pIHtcbiAgICAgICAgaHR0cCA9ICRodHRwQmFja2VuZDtcbiAgICAgICAgYXBwcm92YWxTZXJ2aWNlID0gX2FwcHJvdmFsU2VydmljZV87XG4gICAgICAgIHNwSHR0cFNlcnZpY2UgPSBfc3BIdHRwU2VydmljZV87XG4gICAgICAgIHRlc3RTZXJ2aWNlID0gX3Rlc3RTZXJ2aWNlXztcbiAgICAgICAgYXBwcm92YWxUZXN0RGF0YVNlcnZpY2UgPSBfYXBwcm92YWxUZXN0RGF0YVNlcnZpY2VfO1xuICAgIH0pKTtcblxuICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24oKTtcbiAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2dldEFwcHJvdmFsQ291bnQoKScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgdGhlIFVSTCBmb3IgdGhlIGNvdW50IGVuZHBvaW50IHdpdGggdGhlIGdpdmVuIHF1ZXJ5IHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBjb3VudFVybCA9IGZ1bmN0aW9uKHN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIFNhaWxQb2ludC5DT05URVhUX1BBVEggKyAnL3VpL3Jlc3QvYXBwcm92YWxzL2NvdW50PycgKyBzdWZmaXg7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhcHBseSBwYXNzZWQgcGFyYW1ldGVycyB0byBhamF4IGNhbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGNvdW50VXJsKCdvd25lcklkPXRlc3QmcmVxdWVzdFR5cGVzPWFub3RoZXJUZXN0JykpLlxuICAgICAgICAgICAgICAgIHJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2UuZ2V0QXBwcm92YWxDb3VudCh0eXBlcywgb3duZXIpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IHRoZSBjYWxsZXIgdG8gbm90IHNwZWNpZnkgdGhlIG93bmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChjb3VudFVybCgncmVxdWVzdFR5cGVzPWFub3RoZXJUZXN0JykpLnJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2UuZ2V0QXBwcm92YWxDb3VudCh0eXBlcyk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgYWNjZXB0IGEgbGlzdCBvZiB0eXBlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoY291bnRVcmwoJ3JlcXVlc3RUeXBlcz1vbmVUeXBlJnJlcXVlc3RUeXBlcz1hbm90aGVyVHlwZScpKS5cbiAgICAgICAgICAgICAgICByZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmdldEFwcHJvdmFsQ291bnQodHdvVHlwZXMpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGRvIHNvbWV0aGluZyB3aXRoIHRoZSByZXR1cm5lZCB2YWx1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoY291bnRVcmwoJ3JlcXVlc3RUeXBlcz1hbm90aGVyVGVzdCcpKS5yZXNwb25kKDIwMCwgMjMpO1xuICAgICAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgICAgIGFwcHJvdmFsU2VydmljZS5nZXRBcHByb3ZhbENvdW50KHR5cGVzKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0bXAgPSBkYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3QodG1wKS50b0VxdWFsKDIzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGRlc2NyaWJlKCdnZXRBcHByb3ZhbHMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc29ydEpzb24gPSAnW3tcXCdwcm9wZXJ0eVxcJzpcXCdmb29cXCcsXFwnZGlyZWN0aW9uXFwnOlxcJ0RFU0NcXCd9XScsXG4gICAgICAgICAgICBzb3J0TW9jayA9IHtcbiAgICAgICAgICAgICAgICB0b0pzb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc29ydEpzb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVzY2FwZWRTb3J0SnNvbiwgQXBwcm92YWw7XG5cbiAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24odGVzdFNlcnZpY2UsIF9BcHByb3ZhbF8pIHtcbiAgICAgICAgICAgIGVzY2FwZWRTb3J0SnNvbiA9IHRlc3RTZXJ2aWNlLmVuY29kZVVyaVF1ZXJ5KHNvcnRKc29uKTtcbiAgICAgICAgICAgIEFwcHJvdmFsID0gX0FwcHJvdmFsXztcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgdGhlIFVSTCBmb3IgdGhlIGFwcHJvdmFscyBlbmRwb2ludCB3aXRoIHRoZSBnaXZlbiBxdWVyeSBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgYXBwcm92YWxzVXJsID0gZnVuY3Rpb24oc3VmZml4KSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJztcbiAgICAgICAgICAgIGlmIChzdWZmaXgpIHtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJz8nICsgc3VmZml4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgfTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFwcGx5IHBhc3NlZCBwYXJhbWV0ZXJzIHRvIGFqYXggY2FsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoYXBwcm92YWxzVXJsKCdsaW1pdD0xMyZyZXF1ZXN0VHlwZXM9YW5vdGhlclRlc3Qmc29ydD0nICsgZXNjYXBlZFNvcnRKc29uICsgJyZzdGFydD0xJykpLlxuICAgICAgICAgICAgICAgIHJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2UuZ2V0QXBwcm92YWxzKHR5cGVzLCAxLCAxMywgc29ydE1vY2spO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IG5vdCBzcGVjaWZ5aW5nIGEgc29ydCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoYXBwcm92YWxzVXJsKCdsaW1pdD0xMyZyZXF1ZXN0VHlwZXM9YW5vdGhlclRlc3Qmc3RhcnQ9MScpKS5cbiAgICAgICAgICAgICAgICByZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmdldEFwcHJvdmFscyh0eXBlcywgMSwgMTMsIG51bGwpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFjY2VwdCBhIGxpc3Qgb2YgdHlwZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGFwcHJvdmFsc1VybCgnbGltaXQ9MTMmcmVxdWVzdFR5cGVzPW9uZVR5cGUmcmVxdWVzdFR5cGVzPWFub3RoZXJUeXBlJnN0YXJ0PTEnKSkuXG4gICAgICAgICAgICAgICAgcmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIGFwcHJvdmFsU2VydmljZS5nZXRBcHByb3ZhbHModHdvVHlwZXMsIDEsIDEzLCBudWxsKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBub3Qgc3BlY2lmeWluZyBhIGxpbWl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChhcHByb3ZhbHNVcmwoJ3JlcXVlc3RUeXBlcz1hbm90aGVyVGVzdCZzdGFydD0xJykpLlxuICAgICAgICAgICAgICAgIHJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2UuZ2V0QXBwcm92YWxzKHR5cGVzLCAxLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBub3Qgc3BlY2lmeWluZyBhIHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChhcHByb3ZhbHNVcmwoJ3JlcXVlc3RUeXBlcz1hbm90aGVyVGVzdCcpKS5cbiAgICAgICAgICAgICAgICByZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmdldEFwcHJvdmFscyh0eXBlcywgbnVsbCwgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbm90IHNwZWNpZnlpbmcgdHlwZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGFwcHJvdmFsc1VybCgpKS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmdldEFwcHJvdmFscyhudWxsLCBudWxsLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBkbyBzb21ldGhpbmcgd2l0aCB0aGUgcmV0dXJuZWQgdmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcHByb3ZhbERhdGEgPSBhcHByb3ZhbFRlc3REYXRhU2VydmljZS5jcmVhdGVBcHByb3ZhbCgpLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBbYXBwcm92YWxEYXRhXSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICAgICAgICB9LCB0bXAgPSB7fTtcblxuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoYXBwcm92YWxzVXJsKCkpLlxuICAgICAgICAgICAgICAgIHJlc3BvbmQoMjAwLCByZXNwb25zZSk7XG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2UuZ2V0QXBwcm92YWxzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3QodG1wLmRhdGEuY291bnQpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3QodG1wLmRhdGEub2JqZWN0cy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICBleHBlY3QodG1wLmRhdGEub2JqZWN0c1swXSBpbnN0YW5jZW9mIEFwcHJvdmFsKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICB2YXIgYXBwcm92YWxJZCA9ICcxMjM0JyxcbiAgICAgICAgaXRlbUlkID0gJzU2NzgnLFxuICAgICAgICBpdGVtVXJsID0gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQgKyAnL2l0ZW1zLycgKyBpdGVtSWQ7XG5cbiAgICBkZXNjcmliZSgnYXBwcm92ZUl0ZW0oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXBwcm92ZVVybCA9IGl0ZW1VcmwgKyAnL2FwcHJvdmUnO1xuXG4gICAgICAgIGl0KCdhcHByb3ZlcyBhbiBpdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGFwcHJvdmVVcmwpLnJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLmFwcHJvdmVJdGVtKGFwcHJvdmFsSWQsIGl0ZW1JZCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPblN1Y2Nlc3MocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdmYWlscyBvbiBSRVNUIGVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGFwcHJvdmVVcmwpLnJlc3BvbmQoNTAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLmFwcHJvdmVJdGVtKGFwcHJvdmFsSWQsIGl0ZW1JZCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPbkZhaWx1cmUocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGFwcHJvdmFsSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLmFwcHJvdmVJdGVtKG51bGwsIGl0ZW1JZCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gaXRlbUlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5hcHByb3ZlSXRlbShhcHByb3ZhbElkLCBudWxsKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdyZWplY3RJdGVtKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdFVybCA9IGl0ZW1VcmwgKyAnL3JlamVjdCc7XG5cbiAgICAgICAgaXQoJ3JlamVjdHMgYW4gaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChyZWplY3RVcmwpLnJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLnJlamVjdEl0ZW0oYXBwcm92YWxJZCwgaXRlbUlkKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QocmVqZWN0VXJsKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5yZWplY3RJdGVtKGFwcHJvdmFsSWQsIGl0ZW1JZCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPbkZhaWx1cmUocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGFwcHJvdmFsSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLnJlamVjdEl0ZW0obnVsbCwgaXRlbUlkKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBpdGVtSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLnJlamVjdEl0ZW0oYXBwcm92YWxJZCwgbnVsbCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndW5kb0l0ZW0oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdW5kb1VybCA9IGl0ZW1VcmwgKyAnL3VuZG8nO1xuXG4gICAgICAgIGl0KCd1bmRvZXMgYW4gaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVCh1bmRvVXJsKS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS51bmRvSXRlbShhcHByb3ZhbElkLCBpdGVtSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZmFpbHMgb24gUkVTVCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVCh1bmRvVXJsKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS51bmRvSXRlbShhcHByb3ZhbElkLCBpdGVtSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS51bmRvSXRlbShudWxsLCBpdGVtSWQpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGl0ZW1JZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2UudW5kb0l0ZW0oYXBwcm92YWxJZCwgbnVsbCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0SXRlbVRhcmdldEFjY291bnRzKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRhcmdldHNVcmwgPSBpdGVtVXJsICsgJy90YXJnZXRBY2NvdW50cycsXG4gICAgICAgICAgICBhY2NvdW50cyA9IFt7XG4gICAgICAgICAgICAgICAgcm9sZTogJ1NvJyxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ1NsZWVweScsXG4gICAgICAgICAgICAgICAgYWNjb3VudDogJ05lZWQgdG8gLi4uIHp6Li4uenouLi4nXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgcm9sZTogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdHT09EJyxcbiAgICAgICAgICAgICAgICBhY2NvdW50OiAnTWUgYXdha2V5IG5vdyEhISdcbiAgICAgICAgICAgIH1dO1xuXG4gICAgICAgIC8vIEFkZCBhIGN1c3RvbSBtYXRjaGVyIHRvIGNoZWNrIGFuICRodHRwIEdFVCByZXNwb25zZS5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGphc21pbmUuYWRkTWF0Y2hlcnMoQ3VzdG9tTWF0Y2hlcnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZ2V0cyB0YXJnZXQgYWNjb3VudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRzLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVCh0YXJnZXRzVXJsKS5yZXNwb25kKDIwMCwgYWNjb3VudHMpO1xuICAgICAgICAgICAgdGFyZ2V0cyA9IGFwcHJvdmFsU2VydmljZS5nZXRJdGVtVGFyZ2V0QWNjb3VudHMoYXBwcm92YWxJZCwgaXRlbUlkKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyh0YXJnZXRzLiRwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdCh0YXJnZXRzKS50b0VxdWFsUmVzcG9uc2UoYWNjb3VudHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZmFpbHMgb24gUkVTVCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRhcmdldHMsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKHRhcmdldHNVcmwpLnJlc3BvbmQoNTAwLCAnJyk7XG4gICAgICAgICAgICB0YXJnZXRzID0gYXBwcm92YWxTZXJ2aWNlLmdldEl0ZW1UYXJnZXRBY2NvdW50cyhhcHByb3ZhbElkLCBpdGVtSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHRhcmdldHMuJHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHRhcmdldHMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5nZXRJdGVtVGFyZ2V0QWNjb3VudHMobnVsbCwgaXRlbUlkKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBpdGVtSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLmdldEl0ZW1UYXJnZXRBY2NvdW50cyhhcHByb3ZhbElkLCBudWxsKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjb21wbGV0ZSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnZXRDb21wbGV0ZVVybCA9IGZ1bmN0aW9uKGFwcHJvdmFsSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBTYWlsUG9pbnQuQ09OVEVYVF9QQVRIICsgJy91aS9yZXN0L2FwcHJvdmFscy8nICsgYXBwcm92YWxJZCArICcvY29tcGxldGUnO1xuICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdjb21wbGV0ZXMgYW4gYXBwcm92YWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoZ2V0Q29tcGxldGVVcmwoYXBwcm92YWxJZCkpLnJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLmNvbXBsZXRlKGFwcHJvdmFsSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZmFpbHMgb24gUkVTVCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChnZXRDb21wbGV0ZVVybChhcHByb3ZhbElkKSkucmVzcG9uZCg1MDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2UuY29tcGxldGUoYXBwcm92YWxJZCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPbkZhaWx1cmUocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGFwcHJvdmFsSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLmNvbXBsZXRlKG51bGwpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIHVzZXJuYW1lID0gJ2JydWJibGUnLFxuICAgICAgICBwYXNzd29yZCA9ICd4eXp6eScsXG4gICAgICAgIHVzZXJQYXNzd29yZERhdGEgPSB7XG4gICAgICAgICAgICBzaWduYXR1cmVBY2NvdW50SWQ6IHVzZXJuYW1lLFxuICAgICAgICAgICAgc2lnbmF0dXJlUGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3N3b3JkRGF0YSA9IHtcbiAgICAgICAgICAgIHNpZ25hdHVyZVBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9O1xuXG4gICAgZGVzY3JpYmUoJ3NpZ24oKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ2V0VXJsID0gZnVuY3Rpb24oYXBwcm92YWxJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFNhaWxQb2ludC5DT05URVhUX1BBVEggKyAnL3VpL3Jlc3QvYXBwcm92YWxzLycgKyBhcHByb3ZhbElkICsgJy9jb21wbGV0ZSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3NpZ25zIGFuIGFwcHJvdmFsIHdpdGggdXNlcm5hbWUgYW5kIHBhc3N3b3JkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybChhcHByb3ZhbElkKSwgdXNlclBhc3N3b3JkRGF0YSkucmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2Uuc2lnbihhcHByb3ZhbElkLCBwYXNzd29yZCwgdXNlcm5hbWUpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2lnbnMgYW4gYXBwcm92YWwgd2l0aCBvbmx5IHBhc3N3b3JkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybChhcHByb3ZhbElkKSwgcGFzc3dvcmREYXRhKS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5zaWduKGFwcHJvdmFsSWQsIHBhc3N3b3JkKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoZ2V0VXJsKGFwcHJvdmFsSWQpLCBwYXNzd29yZERhdGEpLnJlc3BvbmQoNTAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLnNpZ24oYXBwcm92YWxJZCwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBwYXNzd29yZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2Uuc2lnbihhcHByb3ZhbElkLCBudWxsLCB1c2VybmFtZSk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gYXBwcm92YWxJZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2Uuc2lnbihudWxsLCBwYXNzd29yZCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYXBwcm92ZUFsbCgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnZXRVcmwgPSBmdW5jdGlvbihhcHByb3ZhbElkKSB7XG4gICAgICAgICAgICByZXR1cm4gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQgKyAnL2FwcHJvdmVBbGwnO1xuICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdhcHByb3ZlcyBhbGwgZGVjaXNpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybChhcHByb3ZhbElkKSkucmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2UuYXBwcm92ZUFsbChhcHByb3ZhbElkKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoZ2V0VXJsKGFwcHJvdmFsSWQpKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5hcHByb3ZlQWxsKGFwcHJvdmFsSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5hcHByb3ZlQWxsKG51bGwpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3JlamVjdEFsbCgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnZXRVcmwgPSBmdW5jdGlvbihhcHByb3ZhbElkKSB7XG4gICAgICAgICAgICByZXR1cm4gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQgKyAnL3JlamVjdEFsbCc7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3JlamVjdHMgYWxsIGRlY2lzaW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChnZXRVcmwoYXBwcm92YWxJZCkpLnJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLnJlamVjdEFsbChhcHByb3ZhbElkKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoZ2V0VXJsKGFwcHJvdmFsSWQpKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5yZWplY3RBbGwoYXBwcm92YWxJZCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPbkZhaWx1cmUocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGFwcHJvdmFsSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLnJlamVjdEFsbChudWxsKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZXRQcmlvcml0eSgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnZXRVcmwgPSBmdW5jdGlvbihhcHByb3ZhbElkKSB7XG4gICAgICAgICAgICByZXR1cm4gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3NlbmRzIGEgUEFUQ0ggcmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UEFUQ0goZ2V0VXJsKGFwcHJvdmFsSWQpLCB7IHByaW9yaXR5OiAnSGlnaCcgfSkucmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2Uuc2V0UHJpb3JpdHkoYXBwcm92YWxJZCwgJ0hpZ2gnKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBBVENIKGdldFVybChhcHByb3ZhbElkKSkucmVzcG9uZCg1MDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2Uuc2V0UHJpb3JpdHkoYXBwcm92YWxJZCwgJ0hpZ2gnKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uRmFpbHVyZShwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gYXBwcm92YWxJZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2Uuc2V0UHJpb3JpdHkobnVsbCwgJ0hpZ2gnKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBwcmlvcml0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2Uuc2V0UHJpb3JpdHkoYXBwcm92YWxJZCwgbnVsbCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0Q29tbWVudHMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ2V0VXJsID0gZnVuY3Rpb24oYXBwcm92YWxJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFNhaWxQb2ludC5DT05URVhUX1BBVEggKyAnL3VpL3Jlc3QvYXBwcm92YWxzLycgKyBhcHByb3ZhbElkICsgJy9jb21tZW50cyc7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNvbW1lbnRzID0gW3tcbiAgICAgICAgICAgICdhdXRob3InIDogJ0phbWVzLlNtaXRoJyxcbiAgICAgICAgICAgICdjb21tZW50JyA6ICdzb21lIGNvbW1lbnQgaGVyZScsXG4gICAgICAgICAgICAnZGF0ZSc6IDEzOTE2MTgzODUzODBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgJ2F1dGhvcicgOiAnSGFycnkuRGl4b24nLFxuICAgICAgICAgICAgJ2NvbW1lbnQnIDogJ3NvbWV0aGluZyBlbHNlIHRvIHNheScsXG4gICAgICAgICAgICAnZGF0ZSc6IDEzOTE2MTgzODk5ODBcbiAgICAgICAgfV07XG5cbiAgICAgICAgLy8gQWRkIGEgY3VzdG9tIG1hdGNoZXIgdG8gY2hlY2sgYW4gJGh0dHAgR0VUIHJlc3BvbnNlLlxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgamFzbWluZS5hZGRNYXRjaGVycyhDdXN0b21NYXRjaGVycyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdnZXRzIGNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZ290Q29tbWVudHMsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0R0VUKGdldFVybChhcHByb3ZhbElkKSkucmVzcG9uZCgyMDAsIGNvbW1lbnRzKTtcbiAgICAgICAgICAgIGdvdENvbW1lbnRzID0gYXBwcm92YWxTZXJ2aWNlLmdldENvbW1lbnRzKGFwcHJvdmFsSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKGdvdENvbW1lbnRzLiRwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChnb3RDb21tZW50cykudG9FcXVhbFJlc3BvbnNlKGNvbW1lbnRzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBnb3RDb21tZW50cywgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoZ2V0VXJsKGFwcHJvdmFsSWQpKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgZ290Q29tbWVudHMgPSBhcHByb3ZhbFNlcnZpY2UuZ2V0Q29tbWVudHMoYXBwcm92YWxJZCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPbkZhaWx1cmUoZ290Q29tbWVudHMuJHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgICAgZXhwZWN0KGdvdENvbW1lbnRzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gYXBwcm92YWxJZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2UuZ2V0Q29tbWVudHMobnVsbCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYWRkQ29tbWVudCgpJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnZXRVcmwgPSBmdW5jdGlvbihhcHByb3ZhbElkKSB7XG4gICAgICAgICAgICByZXR1cm4gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQgKyAnL2NvbW1lbnRzJztcbiAgICAgICAgfTtcblxuICAgICAgICBpdCgnc2VuZHMgYSBQT1NUIHJlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoZ2V0VXJsKGFwcHJvdmFsSWQpLCB7IGNvbW1lbnQ6ICdzb21lIG5ldyBjb21tZW50JyB9KS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5hZGRDb21tZW50KGFwcHJvdmFsSWQsICdzb21lIG5ldyBjb21tZW50Jyk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPblN1Y2Nlc3MocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdmYWlscyBvbiBSRVNUIGVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybChhcHByb3ZhbElkKSkucmVzcG9uZCg1MDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2UuYWRkQ29tbWVudChhcHByb3ZhbElkLCAnc29tZSBuZXcgY29tbWVudCcpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5hZGRDb21tZW50KG51bGwsICdzb21lIG5ldyBjb21tZW50Jyk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gY29tbWVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2UuYWRkQ29tbWVudChhcHByb3ZhbElkLCBudWxsKTsgfSkudG9UaHJvdygpO1xuICAgICAgICAgICAgaHR0cC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXRJdGVtQ29tbWVudHMoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29tbWVudHNVcmwgPSBpdGVtVXJsICsgJy9jb21tZW50cyc7XG5cbiAgICAgICAgdmFyIGl0ZW1Db21tZW50cyA9IFt7XG4gICAgICAgICAgICAnYXV0aG9yJyA6ICdKYW1lcy5TbWl0aCcsXG4gICAgICAgICAgICAnY29tbWVudCcgOiAnc29tZSBjb21tZW50IGhlcmUnLFxuICAgICAgICAgICAgJ2RhdGUnOiAxMzkxNjE4Mzg1MzgwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgICdhdXRob3InIDogJ0hhcnJ5LkRpeG9uJyxcbiAgICAgICAgICAgICdjb21tZW50JyA6ICdzb21ldGhpbmcgZWxzZSB0byBzYXknLFxuICAgICAgICAgICAgJ2RhdGUnOiAxMzkxNjE4Mzg5OTgwXG4gICAgICAgIH1dO1xuXG4gICAgICAgIC8vIEFkZCBhIGN1c3RvbSBtYXRjaGVyIHRvIGNoZWNrIGFuICRodHRwIEdFVCByZXNwb25zZS5cbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGphc21pbmUuYWRkTWF0Y2hlcnMoQ3VzdG9tTWF0Y2hlcnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZ2V0cyBjb21tZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGdvdENvbW1lbnRzLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChjb21tZW50c1VybCkucmVzcG9uZCgyMDAsIGl0ZW1Db21tZW50cyk7XG4gICAgICAgICAgICBnb3RDb21tZW50cyA9IGFwcHJvdmFsU2VydmljZS5nZXRJdGVtQ29tbWVudHMoYXBwcm92YWxJZCwgaXRlbUlkKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhnb3RDb21tZW50cy4kcHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBleHBlY3QoZ290Q29tbWVudHMpLnRvRXF1YWxSZXNwb25zZShpdGVtQ29tbWVudHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZmFpbHMgb24gUkVTVCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGdvdENvbW1lbnRzLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdEdFVChjb21tZW50c1VybCkucmVzcG9uZCg1MDAsICcnKTtcbiAgICAgICAgICAgIGdvdENvbW1lbnRzID0gYXBwcm92YWxTZXJ2aWNlLmdldEl0ZW1Db21tZW50cyhhcHByb3ZhbElkLCBpdGVtSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKGdvdENvbW1lbnRzLiRwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgICAgIGV4cGVjdChnb3RDb21tZW50cy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGFwcHJvdmFsSWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLmdldEl0ZW1Db21tZW50cyhudWxsLCBpdGVtSWQpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGl0ZW1JZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBhcHByb3ZhbFNlcnZpY2UuZ2V0SXRlbUNvbW1lbnRzKGFwcHJvdmFsSWQsIG51bGwpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2FkZEl0ZW1Db21tZW50KCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbW1lbnRzVXJsID0gaXRlbVVybCArICcvY29tbWVudHMnO1xuXG4gICAgICAgIGl0KCdzZW5kcyBhIFBPU1QgcmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChjb21tZW50c1VybCwgeyBjb21tZW50OiAnc29tZSBuZXcgY29tbWVudCcgfSkucmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2UuYWRkSXRlbUNvbW1lbnQoYXBwcm92YWxJZCwgaXRlbUlkLCAnc29tZSBuZXcgY29tbWVudCcpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZmFpbHMgb24gUkVTVCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UE9TVChjb21tZW50c1VybCkucmVzcG9uZCg1MDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2UuYWRkSXRlbUNvbW1lbnQoYXBwcm92YWxJZCwgaXRlbUlkLCAnc29tZSBuZXcgY29tbWVudCcpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5hZGRJdGVtQ29tbWVudChudWxsLCBpdGVtSWQsICdzb21lIG5ldyBjb21tZW50Jyk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gaXRlbUlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5hZGRJdGVtQ29tbWVudChhcHByb3ZhbElkLCBudWxsLCAnc29tZSBuZXcgY29tbWVudCcpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdwdWtlcyB3aXRoIG5vIGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgYXBwcm92YWxTZXJ2aWNlLmFkZEl0ZW1Db21tZW50KGFwcHJvdmFsSWQsIGl0ZW1JZCwgbnVsbCk7IH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYXNzaWduKCknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFzc2lnbmVlID0gJ3dvcmtncm91cE1lbWJlcic7XG4gICAgICAgIHZhciBnZXRVcmwgPSBmdW5jdGlvbihhcHByb3ZhbElkKSB7XG4gICAgICAgICAgICByZXR1cm4gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQgKyAnL2Fzc2lnbic7XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3NlbmRzIGEgUE9TVCByZXF1ZXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybChhcHByb3ZhbElkKSwgeyB0YXJnZXRJZGVudGl0eTogYXNzaWduZWUgfSkucmVzcG9uZCgyMDAsICcnKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBhcHByb3ZhbFNlcnZpY2UuYXNzaWduKGFwcHJvdmFsSWQsIGFzc2lnbmVlKTtcbiAgICAgICAgICAgIHNweSA9IHRlc3RTZXJ2aWNlLnNweU9uU3VjY2Vzcyhwcm9taXNlKTtcbiAgICAgICAgICAgIGh0dHAuZmx1c2goKTtcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZhaWxzIG9uIFJFU1QgZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHk7XG4gICAgICAgICAgICBodHRwLmV4cGVjdFBPU1QoZ2V0VXJsKGFwcHJvdmFsSWQpKS5yZXNwb25kKDUwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5hc3NpZ24oYXBwcm92YWxJZCwgYXNzaWduZWUpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25GYWlsdXJlKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGFwcHJvdmFsU2VydmljZS5hc3NpZ24obnVsbCwgYXNzaWduZWUpOyB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzdWNjZWVkcyB3aXRoIG5vIGFzc2lnbmVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSwgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQT1NUKGdldFVybChhcHByb3ZhbElkKSwgeyB0YXJnZXRJZGVudGl0eTogbnVsbCB9KS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5hc3NpZ24oYXBwcm92YWxJZCwgbnVsbCk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPblN1Y2Nlc3MocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NldFN1bnJpc2VTdW5zZXQoKScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3VucmlzZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgc3Vuc2V0ID0gc3VucmlzZSArIDg2NDAwMDAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVybChhcHByb3ZhbElkLCBpdGVtSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBTYWlsUG9pbnQuQ09OVEVYVF9QQVRIICsgJy91aS9yZXN0L2FwcHJvdmFscy8nICsgYXBwcm92YWxJZCArICcvaXRlbXMvJyArIGl0ZW1JZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdzaG91bGQgc2VuZCBhIGh0dHAgcmVxdWVzdCB3aGVuIGV2ZXJ5dGhpbmcgaXMgb2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlLCBzcHksXG4gICAgICAgICAgICAgICAgZGF0ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN1bnJpc2U6IHN1bnJpc2UsXG4gICAgICAgICAgICAgICAgICAgIHN1bnNldDogc3Vuc2V0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0dHAuZXhwZWN0UEFUQ0goZ2V0VXJsKGFwcHJvdmFsSWQsIGl0ZW1JZCksIGRhdGVzKS5yZXNwb25kKDIwMCwgJycpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IGFwcHJvdmFsU2VydmljZS5zZXRTdW5yaXNlU3Vuc2V0KGFwcHJvdmFsSWQsIGl0ZW1JZCwgZGF0ZXMpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKHByb21pc2UpO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdoZW4gc3Vuc2V0IGJlZm9yZSBzdW5yaXNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGF0ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN1bnJpc2U6IHN1bnNldCxcbiAgICAgICAgICAgICAgICAgICAgc3Vuc2V0OiBzdW5yaXNlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFwcHJvdmFsU2VydmljZS5zZXRTdW5yaXNlU3Vuc2V0KGFwcHJvdmFsSWQsIGl0ZW1JZCwgZGF0ZXMpO1xuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRocm93IHdoZW4gc3VucmlzZSBpcyBiZWZvcmUgdG9kYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkYXRlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3VucmlzZTogc3VucmlzZSAtIDE3MjgwMDAwMFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2Uuc2V0U3VucmlzZVN1bnNldChhcHByb3ZhbElkLCBpdGVtSWQsIGRhdGVzKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0aHJvdyB3aGVuIHN1bnNldCBpcyBiZWZvcmUgdG9kYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkYXRlcyA9IHtcbiAgICAgICAgICAgICAgICBzdW5yaXNlOiBzdW5zZXQgLSAxNzI4MDAwMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2Uuc2V0U3VucmlzZVN1bnNldChhcHByb3ZhbElkLCBpdGVtSWQsIGRhdGVzKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBkZWZhdWx0IHVuZGVmaW5lZCB2YWx1ZXMgdG8gbnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHByb21pc2UsIHNweSxcbiAgICAgICAgICAgICAgICBkYXRlcyA9IHt9O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RQQVRDSChnZXRVcmwoYXBwcm92YWxJZCwgaXRlbUlkKSwge3N1bnJpc2U6IG51bGwsIHN1bnNldDogbnVsbH0pLnJlc3BvbmQoMjAwLCAnJyk7XG4gICAgICAgICAgICBwcm9taXNlID0gYXBwcm92YWxTZXJ2aWNlLnNldFN1bnJpc2VTdW5zZXQoYXBwcm92YWxJZCwgaXRlbUlkLCBkYXRlcyk7XG4gICAgICAgICAgICBzcHkgPSB0ZXN0U2VydmljZS5zcHlPblN1Y2Nlc3MocHJvbWlzZSk7XG4gICAgICAgICAgICBodHRwLmZsdXNoKCk7XG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZ2V0Um9sZUVudGl0bGVtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ2V0VXJsID0gZnVuY3Rpb24oYXBwcm92YWxJZCwgaXRlbUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gU2FpbFBvaW50LkNPTlRFWFRfUEFUSCArICcvdWkvcmVzdC9hcHByb3ZhbHMvJyArIGFwcHJvdmFsSWQgKyAnL2l0ZW1zLycgKyBpdGVtSWQgK1xuICAgICAgICAgICAgICAgICcvc2ltcGxlRW50aXRsZW1lbnRzJztcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbGlzdFJlc3VsdDtcblxuICAgICAgICAvLyBBZGQgYSBjdXN0b20gbWF0Y2hlciB0byBjaGVjayBhbiAkaHR0cCBHRVQgcmVzcG9uc2UuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICBqYXNtaW5lLmFkZE1hdGNoZXJzKEN1c3RvbU1hdGNoZXJzKTtcblxuICAgICAgICAgICAgbGlzdFJlc3VsdCA9IGFwcHJvdmFsVGVzdERhdGFTZXJ2aWNlLkdFTkVSSUNfTElTVF9SRVNVTFQ7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgncHVrZXMgd2l0aCBubyBhcHByb3ZhbElkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmdldFJvbGVFbnRpdGxlbWVudHMobnVsbCwgaXRlbUlkKTtcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgICAgIGh0dHAudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3B1a2VzIHdpdGggbm8gaXRlbUlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXBwcm92YWxTZXJ2aWNlLmdldFJvbGVFbnRpdGxlbWVudHMoYXBwcm92YWxJZCwgbnVsbCk7XG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgICAgICBodHRwLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdnZXRzIHJvbGUgZW50aXRsZW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZ290Um9sZUVudGl0bGVtZW50cywgc3B5O1xuICAgICAgICAgICAgaHR0cC5leHBlY3RHRVQoZ2V0VXJsKGFwcHJvdmFsSWQsIGl0ZW1JZCkpLnJlc3BvbmQoMjAwLCBsaXN0UmVzdWx0KTtcbiAgICAgICAgICAgIGdvdFJvbGVFbnRpdGxlbWVudHMgPSBhcHByb3ZhbFNlcnZpY2UuZ2V0Um9sZUVudGl0bGVtZW50cyhhcHByb3ZhbElkLCBpdGVtSWQpO1xuICAgICAgICAgICAgc3B5ID0gdGVzdFNlcnZpY2Uuc3B5T25TdWNjZXNzKGdvdFJvbGVFbnRpdGxlbWVudHMpO1xuICAgICAgICAgICAgZ290Um9sZUVudGl0bGVtZW50cy50aGVuKGZ1bmN0aW9uKHJvbGVFbnRpdGxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHJvbGVFbnRpdGxlbWVudHMpLnRvRXF1YWxSZXNwb25zZShsaXN0UmVzdWx0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaHR0cC5mbHVzaCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzaG93RXhwaXJlZFN1bnNldERpYWxvZycsICgpID0+IHtcbiAgICAgICAgY29uc3QgQlVMS19NU0cgPSAnYnVsayBtZXNzYWdlJyxcbiAgICAgICAgICAgICAgTk9OX0JVTEtfTVNHID0gJ25vbiBidWxrIG1lc3NhZ2UnO1xuXG4gICAgICAgIGxldCBzcE1vZGFsO1xuXG4gICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KChfc3BNb2RhbF8sIHNwVHJhbnNsYXRlRmlsdGVyKSA9PiB7XG4gICAgICAgICAgICBzcE1vZGFsID0gX3NwTW9kYWxfO1xuXG4gICAgICAgICAgICBzcFRyYW5zbGF0ZUZpbHRlci5jb25maWd1cmVDYXRhbG9nKHtcbiAgICAgICAgICAgICAgICAndWlfbXlfYXBwcm92YWxzX3N1bnNldF9leHBpcmVkX2NvbnRlbnRfYnVsayc6IEJVTEtfTVNHLFxuICAgICAgICAgICAgICAgICd1aV9teV9hcHByb3ZhbHNfc3Vuc2V0X2V4cGlyZWRfY29udGVudCc6IE5PTl9CVUxLX01TR1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHNob3cgcHJvcGVyIG1lc3NhZ2Ugd2hlbiBidWxrIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihzcE1vZGFsLCAnb3BlbicpO1xuXG4gICAgICAgICAgICBhcHByb3ZhbFNlcnZpY2Uuc2hvd0V4cGlyZWRTdW5zZXREaWFsb2codHJ1ZSk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ3VpX215X2FwcHJvdmFsc19zdW5zZXRfZXhwaXJlZF90aXRsZScsXG4gICAgICAgICAgICAgICAgY29udGVudDogQlVMS19NU0csXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVZhbHVlOiAndWlfYnV0dG9uX2Nsb3NlJyxcbiAgICAgICAgICAgICAgICAgICAgcHJpbWFyeTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBzaG93IHByb3BlciBtZXNzYWdlIHdoZW4gYnVsayBpcyBub3QgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKHNwTW9kYWwsICdvcGVuJyk7XG5cbiAgICAgICAgICAgIGFwcHJvdmFsU2VydmljZS5zaG93RXhwaXJlZFN1bnNldERpYWxvZyhmYWxzZSk7XG5cbiAgICAgICAgICAgIGV4cGVjdChzcE1vZGFsLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ3VpX215X2FwcHJvdmFsc19zdW5zZXRfZXhwaXJlZF90aXRsZScsXG4gICAgICAgICAgICAgICAgY29udGVudDogTk9OX0JVTEtfTVNHLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlWYWx1ZTogJ3VpX2J1dHRvbl9jbG9zZScsXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnk6IHRydWVcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
