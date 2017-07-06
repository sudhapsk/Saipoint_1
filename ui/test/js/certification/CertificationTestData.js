System.register(['certification/CertificationModule'], function (_export) {
    /* (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. */

    'use strict';

    var certificationModule;
    return {
        setters: [function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            angular.module(certificationModule).

            /**
             * This contains test data used by the certification tests.  Don't modify this data
             * directly from within your tests.  If you need to modify data, use angular.copy() to create your own
             * copy before changing it.
             */
            factory('certificationTestData', ["CertificationActionStatus", "Icon", function (CertificationActionStatus, Icon) {
                'ngInject';

                return {
                    SCORECARD: {
                        composite: 373,
                        compensated: true,
                        scores: [{
                            categoryDisplayName: 'Catty',
                            score: 837,
                            compensatedScore: 223,
                            compensated: true
                        }, {
                            categoryDisplayName: 'Doggy',
                            score: 222,
                            compensatedScore: 222,
                            compensated: false
                        }]
                    },

                    CERTIFICATION_1: {
                        id: '124387',
                        availableBulkDecisions: [{ value: 'Approved', key: 'ui_approved' }, { value: 'Remediated', key: 'ui_remediated' }, { value: 'Reassign', key: 'ui_reassign' }, { value: 'Undo', key: 'ui_undo' }],
                        certifiers: ['James.Smith'],
                        editable: true,
                        expiration: 1454621708422,
                        name: 'Manager Access Review for James Smith',
                        nextPhaseTransition: 1454621708460,
                        phase: 'Active',
                        workItemId: 'workItemid1',
                        signOffComplete: false,
                        certificationCount: 10,
                        remediationsCompleted: 2,
                        remediationsStarted: 5,
                        completedEntities: 4,
                        totalEntities: 9,
                        itemStatusCount: {
                            counts: {
                                Bundle: {
                                    Open: 1,
                                    Delegated: 2,
                                    Returned: 3,
                                    Complete: 5,
                                    WaitingReview: 8,
                                    Challenged: 13
                                },
                                Exception: {
                                    Open: 21,
                                    Delegated: 34,
                                    Returned: 55,
                                    Complete: 89,
                                    WaitingReview: 2,
                                    Challenged: 3
                                },
                                Account: {
                                    Open: 5,
                                    Delegated: 7,
                                    Returned: 11,
                                    Complete: 13,
                                    WaitingReview: 31,
                                    Challenged: 37
                                },
                                PolicyViolation: {
                                    Open: 41,
                                    Delegated: 43,
                                    Returned: 47,
                                    Complete: 53,
                                    WaitingReview: 59,
                                    Challenged: 61
                                }
                            }
                        },
                        tags: []
                    },
                    LIST_RESULT_CERT_1: {
                        attributes: { foobar: 'bingo' },
                        complete: true,
                        count: 2,
                        errors: ['error 1', 'error 2'],
                        failure: false,
                        metaData: {
                            totalEntitlementCount: 3
                        },
                        objects: [{
                            id: '1',
                            availableBulkDecisions: [{ value: 'Approved', key: 'ui_approved' }, { value: 'Remediated', key: 'ui_remediated' }, { value: 'Reassign', key: 'ui_reassign' }, { value: 'Undo', key: 'ui_undo' }],
                            certifiers: ['James.Smith'],
                            editable: true,
                            expiration: 1454621708422,
                            name: 'Manager Access Review for James Smith',
                            nextPhaseTransition: 1454621708460,
                            phase: 'Active',
                            signOffComplete: false,
                            certificationCount: 10,
                            remediationsCompleted: 2,
                            remediationsStarted: 5,
                            tags: []
                        }, {
                            id: '2',
                            availableBulkDecisions: [{ value: 'Approved', key: 'ui_approved' }, { value: 'Remediated', key: 'ui_remediated' }, { value: 'Reassign', key: 'ui_reassign' }, { value: 'Undo', key: 'ui_undo' }],
                            certifiers: ['James.Smith', 'Aaron.Nichols'],
                            editable: true,
                            expiration: 1454621708422,
                            name: 'Manager Access Review for Aaron Nichols',
                            nextPhaseTransition: 1454621708460,
                            phase: 'Active',
                            signOffComplete: false,
                            certificationCount: 10,
                            remediationsCompleted: 2,
                            remediationsStarted: 5,
                            tags: []
                        }],
                        requestID: '1234',
                        retry: false,
                        retryWait: 0,
                        status: 'success',
                        success: true,
                        warnings: ['warning 1', 'warning 2']
                    },

                    LIST_RESULT_REVOCATION_ITEMS: {
                        attributes: null,
                        complete: false,
                        count: '2',
                        errors: null,
                        failure: false,
                        metaData: null,
                        objects: [{
                            details: 'It has been described as an architectural tour de force of Wright\'s organic philosophy.',
                            expiration: '1471459822511',
                            identityName: 'Frank Lloyd Wright',
                            owner: 'Edgar J. Kaufmann',
                            requestType: 'OpenTicket',
                            requester: 'Liliane Kaufmann',
                            status: 'Open',
                            targetDisplayName: 'Fallingwater'
                        }, {
                            details: 'Erected in 1909 Oak Park Horse Show Association',
                            expiration: '1471459822511',
                            identityName: 'Richard W. Bock',
                            owner: 'Scoville Park',
                            requestType: 'OpenTicket',
                            requester: 'Frank Lloyd Wright',
                            status: 'Open',
                            targetDisplayName: 'Horse Show Fountain'
                        }],
                        requestID: null,
                        retry: false,
                        retryWait: '0',
                        status: 'success',
                        success: true,
                        warnings: null
                    },

                    CERT_ITEMS: [{
                        id: '1234',
                        type: 'Exception',
                        displayName: 'Some Display Name1',
                        description: 'This is a test certification item1',
                        decisionStatus: {
                            decisions: [new CertificationActionStatus({
                                name: 'Approved',
                                promptKey: 'Approved'
                            }), new CertificationActionStatus({
                                name: 'Remediated',
                                promptKey: 'Remediated'
                            })],
                            currentState: new CertificationActionStatus({ name: 'Approved' }),
                            sourceItemId: '1245',
                            parentItemDisplayNames: ['item 1 name'],
                            dependantDecisions: true,
                            delegationOwner: {
                                displayName: 'George Jetson'
                            },
                            delegationComments: 'delegation comments 1',
                            delegationDescription: 'delegation description 1'
                        },
                        summaryStatus: 'Complete',
                        attributes: {
                            firstName: 'Turd',
                            lastName: 'Ferguson',
                            targetId: '123456'
                        },
                        entityId: 'person1',
                        application: 'app1',
                        nativeIdentity: 'account1',
                        instance: 'instance1',
                        groupAttribute: true
                    }, {
                        id: '5678',
                        type: 'Bundle',
                        subType: 'AssignedRole',
                        displayName: 'Some Display Name2',
                        description: 'This is a test certification item2',
                        decisionStatus: {
                            decisions: [new CertificationActionStatus({
                                name: 'Approved',
                                promptKey: 'Approved'
                            }), new CertificationActionStatus({
                                name: 'Remediated',
                                promptKey: 'Remediated'
                            })]
                        },
                        policyName: 'this is a policy name',
                        policyViolationRule: 'this is a policy violation rule',
                        policyViolationOwner: 'this is a policy violation owner',
                        policyDescription: 'this is a policy description',
                        policyRuleDescription: 'this is a policy rule description',
                        policyViolationConflict: 'this is a policy violation conflict',
                        policyViolationSummary: 'this is a policy violation summary',
                        policyViolationApplication: 'this is a policy violation application',
                        policyViolationAccountName: 'this is a policy violation account name',
                        policyViolationCompensatingControl: 'this is a policy violation compensating control',
                        policyViolationRemediationAdvice: 'this is a policy violation remediation advice',
                        scoreWeight: 300,
                        summaryStatus: 'Complete',
                        attributes: {},
                        entityId: 'person1',
                        challengeOwnerName: 'challengeOwner',
                        challengeComment: 'i challenge this',
                        challengeDecision: 'Accept',
                        challengeDecisionComment: 'I accept this challenge',
                        deciderName: 'ChallengeDecider',
                        delegationCompletionComments: 'completed!!!',
                        delegationCompletionUser: 'The Complete-inator',
                        policyViolations: ['Violation 1', 'Violation 2'],
                        accountStatusIcons: [new Icon({
                            icon: '/ui/images/logo.png',
                            title: 'Invalid'
                        })],
                        roleApplications: 'App1, App2',
                        roleAccountNames: 'Acct1, acct2, acctx'
                    }, {
                        id: '1111',
                        type: 'Bundle',
                        subType: 'AssignedRole',
                        displayName: 'Some Display Name3',
                        description: 'This is a test certification item3',
                        decisionStatus: {
                            decisions: [new CertificationActionStatus({
                                name: 'Remediated',
                                promptKey: 'Remediated'
                            })]
                        },
                        summaryStatus: 'Complete',
                        application: 'app',
                        attribute: 'name',
                        value: 'value',
                        permission: false,
                        attributes: {},
                        entityId: 'person1'
                    }, {
                        id: '2222',
                        type: 'Bundle',
                        subType: 'AssignedRole',
                        displayName: 'Some Display Name4',
                        description: 'This is a test certification item4',
                        decisionStatus: {
                            decisions: [new CertificationActionStatus({
                                name: 'Remediated',
                                promptKey: 'Remediated'
                            })]
                        },
                        summaryStatus: 'Complete',
                        roleName: 'role1',
                        attributes: {},
                        entityId: 'person1'
                    }, {
                        id: '3333',
                        type: 'Bundle',
                        subType: 'AssignedRole',
                        displayName: 'Some Display Name5',
                        description: 'This is a test certification item5',
                        decisionStatus: {
                            decisions: [new CertificationActionStatus({
                                name: 'Remediated',
                                promptKey: 'Remediated'
                            })]
                        },
                        summaryStatus: 'Complete',
                        roleName: 'role1',
                        attributes: {},
                        entityId: 'person1',
                        unremovedRemediation: true,
                        currentMitigation: false,
                        expiredMitigation: false,
                        provisionAddsRequest: false,
                        lastMitigationDate: 1454621708422
                    }],

                    HISTORY_DATA_RESPONSE: {
                        'attributes': null,
                        'complete': true,
                        'count': 6,
                        'errors': null,
                        'failure': false,
                        'metaData': null,
                        'objects': [{
                            'status': 'Approved',
                            'actor': 'James Smith',
                            'entryDate': '1/25/16 10:38 AM',
                            'comments': null
                        }],
                        'requestID': null,
                        'retry': false,
                        'retryWait': 0,
                        'status': 'success',
                        'success': true,
                        'warnings': null
                    },

                    HISTORY_DATA: [{
                        'status': 'Approved',
                        'actor': 'James Smith',
                        'entryDate': '1/25/16 10:38 AM',
                        'comments': null
                    }, {
                        'status': null,
                        'type': 'Comment',
                        'actor': 'James Smith',
                        'entryDate': '1/25/16 10:38 AM',
                        'comments': 'My comments go here.'
                    }],

                    CERTIFICATION_ENTITY_LIST_RESULT: {
                        complete: true,
                        count: 3,
                        errors: ['error 1', 'error 2'],
                        failure: false,
                        objects: [{
                            id: '1234',
                            targetDisplayName: 'James.Spader',
                            delegation: {
                                ownerName: 'Arch Stanton',
                                createDate: 1454621708422
                            }
                        }, {
                            id: '4567',
                            targetDisplayName: 'James.Cogburn'
                        }, {
                            id: '9876',
                            targetDisplayName: 'Jim.Rockford'
                        }],
                        requestID: '12345678',
                        retry: false,
                        retryWait: 0,
                        status: 'success',
                        success: true,
                        warnings: ['warning 1', 'warning 2']
                    },

                    CERTIFICATION_SIGNED: {
                        id: '98765',
                        availableBulkDecisions: [{ value: 'Approved', key: 'ui_approved' }, { value: 'Remediated', key: 'ui_remediated' }, { value: 'Reassign', key: 'ui_reassign' }, { value: 'Undo', key: 'ui_undo' }],
                        certifiers: ['James.Smith'],
                        editable: false,
                        expiration: 1454621708422,
                        name: 'Manager Access Review for James Smith',
                        nextPhaseTransition: 1454621708460,
                        phase: 'Revocation',
                        signoffs: [{
                            date: 1454621708422,
                            signer: {
                                name: 'Bob',
                                displayName: 'My Name Is Bob',
                                id: 'bobsid'
                            },
                            application: 'App1',
                            account: 'BobsAcct',
                            esigMeaning: 'I saw the sign and it opened up my eyes'
                        }],
                        certificationCount: 10,
                        remediationsCompleted: 2,
                        remediationsStarted: 5,
                        tags: []
                    },
                    REMEDIATION_ADVICE_RESULT: {
                        advice: {
                            violationConstraint: 'This is my constraint',
                            violationSummary: 'I have a story to tell you about this violation.',
                            remediationAdvice: 'FIGURE IT OUT!',
                            leftRoles: [{
                                id: 'left1',
                                name: 'left1Name',
                                displayableName: 'left1DisplayableName',
                                description: 'i am a left role',
                                selected: false,
                                certItemId: 'leftRoleCertItemId',
                                entityId: 'leftRoleEntityId',
                                status: 'Remediated'
                            }, {
                                id: 'left2',
                                name: 'left2Name',
                                displayableName: 'left2DisplayableName',
                                description: 'i am a left role too',
                                selected: false,
                                certItemId: 'leftRole2CertItemId',
                                entityId: 'leftRole2EntityId'
                            }],
                            rightRoles: [{
                                id: 'right1',
                                name: 'right1Name',
                                displayableName: 'right1DisplayableName',
                                description: 'i am a right role'
                            }]
                        },
                        summary: {
                            id: '1234',
                            enableOverrideDefaultRemediator: true,
                            defaultRemediator: {
                                name: 'Dude',
                                id: 'whatever'
                            },
                            comments: 'fix this dude',
                            remediationDetails: [{
                                application: 'App1',
                                applicationId: 'App1ID',
                                account: 'MyAcct',
                                nativeIdentity: '1234abcd',
                                attribute: 'SomeAttribute',
                                attributeValue: 'SomeValue',
                                selectOptions: [['Remove', 'remove'], ['Set', 'set']],
                                inputType: 'text',
                                editable: true,
                                existingRemediation: false,
                                operation: ['Set', 'set']
                            }],
                            remediationAction: 'OpenWorkItem'
                        }
                    },

                    POLICY_TREE_NODE: {
                        operator: 'OR',
                        children: [{
                            application: 'The World',
                            applicationId: '12345',
                            name: 'memberOf',
                            value: 'cn=upright citizens,dc=com',
                            displayValue: 'Upright Citizens',
                            description: 'The coolest of the cool',
                            permission: false,
                            selected: true,
                            status: [{
                                associatedItemId: 'certItem987',
                                associatedEntityId: 'certEntity234',
                                action: 'Approved'
                            }]
                        }, {
                            application: 'Austin',
                            applicationId: '8745',
                            name: 'memberOf',
                            value: 'cn=stealing cheating liars,dc=com',
                            displayValue: 'Stealing Cheating Liars',
                            description: 'ice cold',
                            permission: false,
                            selected: false,
                            status: null
                        }]
                    },
                    POLICY_TREE_AND_NODE: {
                        operator: 'AND',
                        children: [{
                            application: 'MyApp',
                            applicationId: '12345',
                            name: 'memberOf',
                            value: 'cn=true,dc=com',
                            displayValue: 'Some value',
                            description: 'test app',
                            permission: false,
                            selected: true,
                            status: [{
                                associatedItemId: 'certItem987',
                                associatedEntityId: 'certEntity234',
                                action: 'Remediated'
                            }]
                        }, {
                            application: 'YourApp',
                            applicationId: '8745',
                            name: 'memberOf',
                            value: 'cn=false,dc=com',
                            displayValue: 'Some other value',
                            description: 'test app',
                            permission: false,
                            selected: false,
                            status: [{
                                associatedItemId: 'certItem9871',
                                associatedEntityId: 'certEntity2341',
                                action: 'Remediated'
                            }]
                        }]
                    },
                    POLICY_TREE_AND_NODE_NO_LINE_ITEM_DECISIONS: {
                        operator: 'AND',
                        children: [{
                            application: 'MyApp',
                            applicationId: '12345',
                            name: 'memberOf',
                            value: 'cn=true,dc=com',
                            displayValue: 'Some value',
                            description: 'test app',
                            permission: false,
                            selected: true,
                            status: null
                        }, {
                            application: 'YourApp',
                            applicationId: '8745',
                            name: 'memberOf',
                            value: 'cn=false,dc=com',
                            displayValue: 'Some other value',
                            description: 'test app',
                            permission: false,
                            selected: false,
                            status: null
                        }]
                    }
                };
            }]);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vQ2VydGlmaWNhdGlvblRlc3REYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLHNDQUFzQyxVQUFVLFNBQVM7OztJQUd0RTs7SUFFQSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLG1DQUFtQztZQUNuRCxzQkFBc0Isa0NBQWtDOztRQUU1RCxTQUFTLFlBQVk7O1lBTjdCLFFBQVEsT0FBTzs7Ozs7OztZQU9mLFFBQVEsK0RBQXlCLFVBQVMsMkJBQTJCLE1BQU07Z0JBQ3ZFOztnQkFFQSxPQUFPO29CQUNILFdBQVc7d0JBQ1AsV0FBVzt3QkFDWCxhQUFhO3dCQUNiLFFBQVEsQ0FBQzs0QkFDRCxxQkFBcUI7NEJBQ3JCLE9BQU87NEJBQ1Asa0JBQWtCOzRCQUNsQixhQUFhOzJCQUNkOzRCQUNDLHFCQUFxQjs0QkFDckIsT0FBTzs0QkFDUCxrQkFBa0I7NEJBQ2xCLGFBQWE7Ozs7b0JBS3pCLGlCQUFpQjt3QkFDYixJQUFJO3dCQUNKLHdCQUF3QixDQUFDLEVBQUMsT0FBTyxZQUFZLEtBQUssaUJBQzlDLEVBQUMsT0FBTyxjQUFjLEtBQUssbUJBQzNCLEVBQUMsT0FBTyxZQUFZLEtBQUssaUJBQ3pCLEVBQUMsT0FBTyxRQUFRLEtBQUs7d0JBQ3pCLFlBQVksQ0FBQzt3QkFDYixVQUFVO3dCQUNWLFlBQVk7d0JBQ1osTUFBTTt3QkFDTixxQkFBcUI7d0JBQ3JCLE9BQU87d0JBQ1AsWUFBWTt3QkFDWixpQkFBaUI7d0JBQ2pCLG9CQUFvQjt3QkFDcEIsdUJBQXVCO3dCQUN2QixxQkFBcUI7d0JBQ3JCLG1CQUFtQjt3QkFDbkIsZUFBZTt3QkFDZixpQkFBaUI7NEJBQ2IsUUFBUTtnQ0FDSixRQUFRO29DQUNKLE1BQU07b0NBQ04sV0FBVztvQ0FDWCxVQUFVO29DQUNWLFVBQVU7b0NBQ1YsZUFBZTtvQ0FDZixZQUFZOztnQ0FFaEIsV0FBVztvQ0FDUCxNQUFNO29DQUNOLFdBQVc7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QUFhOzRCQUNiLFlBQVk7NEJBQ1osVUFBVTs0QkFDVixRQUFROzs7Ozs7O0dBckJyQiIsImZpbGUiOiJjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25UZXN0RGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChjKSBDb3B5cmlnaHQgMjAxNiBTYWlsUG9pbnQgVGVjaG5vbG9naWVzLCBJbmMuLCBBbGwgUmlnaHRzIFJlc2VydmVkLiAqL1xuXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xuXG5hbmd1bGFyLm1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKS5cblxuLyoqXG4gKiBUaGlzIGNvbnRhaW5zIHRlc3QgZGF0YSB1c2VkIGJ5IHRoZSBjZXJ0aWZpY2F0aW9uIHRlc3RzLiAgRG9uJ3QgbW9kaWZ5IHRoaXMgZGF0YVxuICogZGlyZWN0bHkgZnJvbSB3aXRoaW4geW91ciB0ZXN0cy4gIElmIHlvdSBuZWVkIHRvIG1vZGlmeSBkYXRhLCB1c2UgYW5ndWxhci5jb3B5KCkgdG8gY3JlYXRlIHlvdXIgb3duXG4gKiBjb3B5IGJlZm9yZSBjaGFuZ2luZyBpdC5cbiAqL1xuZmFjdG9yeSgnY2VydGlmaWNhdGlvblRlc3REYXRhJywgZnVuY3Rpb24oQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cywgSWNvbikge1xuICAgICduZ0luamVjdCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBTQ09SRUNBUkQ6IHtcbiAgICAgICAgICAgIGNvbXBvc2l0ZTogMzczLFxuICAgICAgICAgICAgY29tcGVuc2F0ZWQ6IHRydWUsXG4gICAgICAgICAgICBzY29yZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5RGlzcGxheU5hbWU6ICdDYXR0eScsXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlOiA4MzcsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBlbnNhdGVkU2NvcmU6IDIyMyxcbiAgICAgICAgICAgICAgICAgICAgY29tcGVuc2F0ZWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5RGlzcGxheU5hbWU6ICdEb2dneScsXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlOiAyMjIsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBlbnNhdGVkU2NvcmU6IDIyMixcbiAgICAgICAgICAgICAgICAgICAgY29tcGVuc2F0ZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuXG4gICAgICAgIENFUlRJRklDQVRJT05fMToge1xuICAgICAgICAgICAgaWQ6ICcxMjQzODcnLFxuICAgICAgICAgICAgYXZhaWxhYmxlQnVsa0RlY2lzaW9uczogW3t2YWx1ZTogJ0FwcHJvdmVkJywga2V5OiAndWlfYXBwcm92ZWQnfSxcbiAgICAgICAgICAgICAgICB7dmFsdWU6ICdSZW1lZGlhdGVkJywga2V5OiAndWlfcmVtZWRpYXRlZCd9LFxuICAgICAgICAgICAgICAgIHt2YWx1ZTogJ1JlYXNzaWduJywga2V5OiAndWlfcmVhc3NpZ24nfSxcbiAgICAgICAgICAgICAgICB7dmFsdWU6ICdVbmRvJywga2V5OiAndWlfdW5kbyd9XSxcbiAgICAgICAgICAgIGNlcnRpZmllcnM6IFsnSmFtZXMuU21pdGgnXSxcbiAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZXhwaXJhdGlvbjogMTQ1NDYyMTcwODQyMixcbiAgICAgICAgICAgIG5hbWU6ICdNYW5hZ2VyIEFjY2VzcyBSZXZpZXcgZm9yIEphbWVzIFNtaXRoJyxcbiAgICAgICAgICAgIG5leHRQaGFzZVRyYW5zaXRpb246IDE0NTQ2MjE3MDg0NjAsXG4gICAgICAgICAgICBwaGFzZTogJ0FjdGl2ZScsXG4gICAgICAgICAgICB3b3JrSXRlbUlkOiAnd29ya0l0ZW1pZDEnLFxuICAgICAgICAgICAgc2lnbk9mZkNvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25Db3VudDogMTAsXG4gICAgICAgICAgICByZW1lZGlhdGlvbnNDb21wbGV0ZWQ6IDIsXG4gICAgICAgICAgICByZW1lZGlhdGlvbnNTdGFydGVkOiA1LFxuICAgICAgICAgICAgY29tcGxldGVkRW50aXRpZXM6IDQsXG4gICAgICAgICAgICB0b3RhbEVudGl0aWVzOiA5LFxuICAgICAgICAgICAgaXRlbVN0YXR1c0NvdW50OiB7XG4gICAgICAgICAgICAgICAgY291bnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIEJ1bmRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgT3BlbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERlbGVnYXRlZDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIFJldHVybmVkOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGxldGU6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICBXYWl0aW5nUmV2aWV3OiA4LFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbGxlbmdlZDogMTNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgRXhjZXB0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPcGVuOiAyMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIERlbGVnYXRlZDogMzQsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXR1cm5lZDogNTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wbGV0ZTogODksXG4gICAgICAgICAgICAgICAgICAgICAgICBXYWl0aW5nUmV2aWV3OiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbGxlbmdlZDogM1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBBY2NvdW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPcGVuOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVsZWdhdGVkOiA3LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmV0dXJuZWQ6IDExLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGxldGU6IDEzLFxuICAgICAgICAgICAgICAgICAgICAgICAgV2FpdGluZ1JldmlldzogMzEsXG4gICAgICAgICAgICAgICAgICAgICAgICBDaGFsbGVuZ2VkOiAzN1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBQb2xpY3lWaW9sYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9wZW46IDQxLFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVsZWdhdGVkOiA0MyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJldHVybmVkOiA0NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbXBsZXRlOiA1MyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFdhaXRpbmdSZXZpZXc6IDU5LFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbGxlbmdlZDogNjFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0YWdzOiBbXVxuICAgICAgICB9LFxuICAgICAgICBMSVNUX1JFU1VMVF9DRVJUXzE6IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtmb29iYXI6ICdiaW5nbyd9LFxuICAgICAgICAgICAgY29tcGxldGU6IHRydWUsXG4gICAgICAgICAgICBjb3VudDogMixcbiAgICAgICAgICAgIGVycm9yczogWydlcnJvciAxJywgJ2Vycm9yIDInXSxcbiAgICAgICAgICAgIGZhaWx1cmU6IGZhbHNlLFxuICAgICAgICAgICAgbWV0YURhdGE6IHtcbiAgICAgICAgICAgICAgICB0b3RhbEVudGl0bGVtZW50Q291bnQ6IDNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvYmplY3RzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVCdWxrRGVjaXNpb25zOiBbe3ZhbHVlOiAnQXBwcm92ZWQnLCBrZXk6ICd1aV9hcHByb3ZlZCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhbHVlOiAnUmVtZWRpYXRlZCcsIGtleTogJ3VpX3JlbWVkaWF0ZWQnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogJ1JlYXNzaWduJywga2V5OiAndWlfcmVhc3NpZ24nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogJ1VuZG8nLCBrZXk6ICd1aV91bmRvJ31dLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpZXJzOiBbJ0phbWVzLlNtaXRoJ10sXG4gICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiAxNDU0NjIxNzA4NDIyLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTWFuYWdlciBBY2Nlc3MgUmV2aWV3IGZvciBKYW1lcyBTbWl0aCcsXG4gICAgICAgICAgICAgICAgICAgIG5leHRQaGFzZVRyYW5zaXRpb246IDE0NTQ2MjE3MDg0NjAsXG4gICAgICAgICAgICAgICAgICAgIHBoYXNlOiAnQWN0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgc2lnbk9mZkNvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY2VydGlmaWNhdGlvbkNvdW50OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgcmVtZWRpYXRpb25zQ29tcGxldGVkOiAyLFxuICAgICAgICAgICAgICAgICAgICByZW1lZGlhdGlvbnNTdGFydGVkOiA1LFxuICAgICAgICAgICAgICAgICAgICB0YWdzOiBbXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVCdWxrRGVjaXNpb25zOiBbe3ZhbHVlOiAnQXBwcm92ZWQnLCBrZXk6ICd1aV9hcHByb3ZlZCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhbHVlOiAnUmVtZWRpYXRlZCcsIGtleTogJ3VpX3JlbWVkaWF0ZWQnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogJ1JlYXNzaWduJywga2V5OiAndWlfcmVhc3NpZ24nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogJ1VuZG8nLCBrZXk6ICd1aV91bmRvJ31dLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0aWZpZXJzOiBbJ0phbWVzLlNtaXRoJywgJ0Fhcm9uLk5pY2hvbHMnXSxcbiAgICAgICAgICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4cGlyYXRpb246IDE0NTQ2MjE3MDg0MjIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdNYW5hZ2VyIEFjY2VzcyBSZXZpZXcgZm9yIEFhcm9uIE5pY2hvbHMnLFxuICAgICAgICAgICAgICAgICAgICBuZXh0UGhhc2VUcmFuc2l0aW9uOiAxNDU0NjIxNzA4NDYwLFxuICAgICAgICAgICAgICAgICAgICBwaGFzZTogJ0FjdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIHNpZ25PZmZDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNlcnRpZmljYXRpb25Db3VudDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHJlbWVkaWF0aW9uc0NvbXBsZXRlZDogMixcbiAgICAgICAgICAgICAgICAgICAgcmVtZWRpYXRpb25zU3RhcnRlZDogNSxcbiAgICAgICAgICAgICAgICAgICAgdGFnczogW11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmVxdWVzdElEOiAnMTIzNCcsXG4gICAgICAgICAgICByZXRyeTogZmFsc2UsXG4gICAgICAgICAgICByZXRyeVdhaXQ6IDAsXG4gICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICB3YXJuaW5nczogWyd3YXJuaW5nIDEnLCAnd2FybmluZyAyJ11cbiAgICAgICAgfSxcblxuICAgICAgICBMSVNUX1JFU1VMVF9SRVZPQ0FUSU9OX0lURU1TOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBudWxsLFxuICAgICAgICAgICAgY29tcGxldGU6IGZhbHNlLFxuICAgICAgICAgICAgY291bnQ6ICcyJyxcbiAgICAgICAgICAgIGVycm9yczogbnVsbCxcbiAgICAgICAgICAgIGZhaWx1cmU6IGZhbHNlLFxuICAgICAgICAgICAgbWV0YURhdGE6IG51bGwsXG4gICAgICAgICAgICBvYmplY3RzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzOiAnSXQgaGFzIGJlZW4gZGVzY3JpYmVkIGFzIGFuIGFyY2hpdGVjdHVyYWwgdG91ciBkZSBmb3JjZSBvZiBXcmlnaHRcXCdzIG9yZ2FuaWMgcGhpbG9zb3BoeS4nLFxuICAgICAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiAnMTQ3MTQ1OTgyMjUxMScsXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aXR5TmFtZTogJ0ZyYW5rIExsb3lkIFdyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiAnRWRnYXIgSi4gS2F1Zm1hbm4nLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0VHlwZTogJ09wZW5UaWNrZXQnLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ZXI6ICdMaWxpYW5lIEthdWZtYW5uJyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnT3BlbicsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldERpc3BsYXlOYW1lOiAnRmFsbGluZ3dhdGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzOiAnRXJlY3RlZCBpbiAxOTA5IE9hayBQYXJrIEhvcnNlIFNob3cgQXNzb2NpYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBleHBpcmF0aW9uOiAnMTQ3MTQ1OTgyMjUxMScsXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aXR5TmFtZTogJ1JpY2hhcmQgVy4gQm9jaycsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiAnU2NvdmlsbGUgUGFyaycsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RUeXBlOiAnT3BlblRpY2tldCcsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlcjogJ0ZyYW5rIExsb3lkIFdyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ09wZW4nLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXNwbGF5TmFtZTogJ0hvcnNlIFNob3cgRm91bnRhaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlcXVlc3RJRDogbnVsbCxcbiAgICAgICAgICAgIHJldHJ5OiBmYWxzZSxcbiAgICAgICAgICAgIHJldHJ5V2FpdDogJzAnLFxuICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgd2FybmluZ3M6IG51bGxcbiAgICAgICAgfSxcblxuICAgICAgICBDRVJUX0lURU1TOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcxMjM0JyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnRXhjZXB0aW9uJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1NvbWUgRGlzcGxheSBOYW1lMScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIGEgdGVzdCBjZXJ0aWZpY2F0aW9uIGl0ZW0xJyxcbiAgICAgICAgICAgICAgICBkZWNpc2lvblN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICBkZWNpc2lvbnM6IFtuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQXBwcm92ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0S2V5OiAnQXBwcm92ZWQnXG4gICAgICAgICAgICAgICAgICAgIH0pLCBuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUmVtZWRpYXRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHRLZXk6ICdSZW1lZGlhdGVkJ1xuICAgICAgICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZTogbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoeyBuYW1lOiAnQXBwcm92ZWQnfSksXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUl0ZW1JZDogJzEyNDUnLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRJdGVtRGlzcGxheU5hbWVzOiBbJ2l0ZW0gMSBuYW1lJ10sXG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGFudERlY2lzaW9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsZWdhdGlvbk93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0dlb3JnZSBKZXRzb24nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlbGVnYXRpb25Db21tZW50czogJ2RlbGVnYXRpb24gY29tbWVudHMgMScsXG4gICAgICAgICAgICAgICAgICAgIGRlbGVnYXRpb25EZXNjcmlwdGlvbjogJ2RlbGVnYXRpb24gZGVzY3JpcHRpb24gMSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1bW1hcnlTdGF0dXM6ICdDb21wbGV0ZScsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6ICdUdXJkJyxcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6ICdGZXJndXNvbicsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldElkOiAnMTIzNDU2J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW50aXR5SWQ6ICdwZXJzb24xJyxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ2FwcDEnLFxuICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWNjb3VudDEnLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiAnaW5zdGFuY2UxJyxcbiAgICAgICAgICAgICAgICBncm91cEF0dHJpYnV0ZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzU2NzgnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdCdW5kbGUnLFxuICAgICAgICAgICAgICAgIHN1YlR5cGU6ICdBc3NpZ25lZFJvbGUnLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnU29tZSBEaXNwbGF5IE5hbWUyJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgYSB0ZXN0IGNlcnRpZmljYXRpb24gaXRlbTInLFxuICAgICAgICAgICAgICAgIGRlY2lzaW9uU3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlY2lzaW9uczogW25ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBcHByb3ZlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHRLZXk6ICdBcHByb3ZlZCdcbiAgICAgICAgICAgICAgICAgICAgfSksIG5ldyBDZXJ0aWZpY2F0aW9uQWN0aW9uU3RhdHVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdSZW1lZGlhdGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdEtleTogJ1JlbWVkaWF0ZWQnXG4gICAgICAgICAgICAgICAgICAgIH0pXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcG9saWN5TmFtZTogJ3RoaXMgaXMgYSBwb2xpY3kgbmFtZScsXG4gICAgICAgICAgICAgICAgcG9saWN5VmlvbGF0aW9uUnVsZTogJ3RoaXMgaXMgYSBwb2xpY3kgdmlvbGF0aW9uIHJ1bGUnLFxuICAgICAgICAgICAgICAgIHBvbGljeVZpb2xhdGlvbk93bmVyOiAndGhpcyBpcyBhIHBvbGljeSB2aW9sYXRpb24gb3duZXInLFxuICAgICAgICAgICAgICAgIHBvbGljeURlc2NyaXB0aW9uOiAndGhpcyBpcyBhIHBvbGljeSBkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAgICAgcG9saWN5UnVsZURlc2NyaXB0aW9uOiAndGhpcyBpcyBhIHBvbGljeSBydWxlIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICBwb2xpY3lWaW9sYXRpb25Db25mbGljdDogJ3RoaXMgaXMgYSBwb2xpY3kgdmlvbGF0aW9uIGNvbmZsaWN0JyxcbiAgICAgICAgICAgICAgICBwb2xpY3lWaW9sYXRpb25TdW1tYXJ5OiAndGhpcyBpcyBhIHBvbGljeSB2aW9sYXRpb24gc3VtbWFyeScsXG4gICAgICAgICAgICAgICAgcG9saWN5VmlvbGF0aW9uQXBwbGljYXRpb246ICd0aGlzIGlzIGEgcG9saWN5IHZpb2xhdGlvbiBhcHBsaWNhdGlvbicsXG4gICAgICAgICAgICAgICAgcG9saWN5VmlvbGF0aW9uQWNjb3VudE5hbWU6ICd0aGlzIGlzIGEgcG9saWN5IHZpb2xhdGlvbiBhY2NvdW50IG5hbWUnLFxuICAgICAgICAgICAgICAgIHBvbGljeVZpb2xhdGlvbkNvbXBlbnNhdGluZ0NvbnRyb2w6ICd0aGlzIGlzIGEgcG9saWN5IHZpb2xhdGlvbiBjb21wZW5zYXRpbmcgY29udHJvbCcsXG4gICAgICAgICAgICAgICAgcG9saWN5VmlvbGF0aW9uUmVtZWRpYXRpb25BZHZpY2U6ICd0aGlzIGlzIGEgcG9saWN5IHZpb2xhdGlvbiByZW1lZGlhdGlvbiBhZHZpY2UnLFxuICAgICAgICAgICAgICAgIHNjb3JlV2VpZ2h0OiAzMDAsXG4gICAgICAgICAgICAgICAgc3VtbWFyeVN0YXR1czogJ0NvbXBsZXRlJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgICAgICAgICAgICBlbnRpdHlJZDogJ3BlcnNvbjEnLFxuICAgICAgICAgICAgICAgIGNoYWxsZW5nZU93bmVyTmFtZTogJ2NoYWxsZW5nZU93bmVyJyxcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2VDb21tZW50OiAnaSBjaGFsbGVuZ2UgdGhpcycsXG4gICAgICAgICAgICAgICAgY2hhbGxlbmdlRGVjaXNpb246ICdBY2NlcHQnLFxuICAgICAgICAgICAgICAgIGNoYWxsZW5nZURlY2lzaW9uQ29tbWVudDogJ0kgYWNjZXB0IHRoaXMgY2hhbGxlbmdlJyxcbiAgICAgICAgICAgICAgICBkZWNpZGVyTmFtZTogJ0NoYWxsZW5nZURlY2lkZXInLFxuICAgICAgICAgICAgICAgIGRlbGVnYXRpb25Db21wbGV0aW9uQ29tbWVudHM6ICdjb21wbGV0ZWQhISEnLFxuICAgICAgICAgICAgICAgIGRlbGVnYXRpb25Db21wbGV0aW9uVXNlcjogJ1RoZSBDb21wbGV0ZS1pbmF0b3InLFxuICAgICAgICAgICAgICAgIHBvbGljeVZpb2xhdGlvbnM6IFsnVmlvbGF0aW9uIDEnLCAnVmlvbGF0aW9uIDInXSxcbiAgICAgICAgICAgICAgICBhY2NvdW50U3RhdHVzSWNvbnM6IFtuZXcgSWNvbih7XG4gICAgICAgICAgICAgICAgICAgIGljb246ICcvdWkvaW1hZ2VzL2xvZ28ucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbnZhbGlkJ1xuICAgICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICAgICByb2xlQXBwbGljYXRpb25zOiAnQXBwMSwgQXBwMicsXG4gICAgICAgICAgICAgICAgcm9sZUFjY291bnROYW1lczogJ0FjY3QxLCBhY2N0MiwgYWNjdHgnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMTExMScsXG4gICAgICAgICAgICAgICAgdHlwZTogJ0J1bmRsZScsXG4gICAgICAgICAgICAgICAgc3ViVHlwZTogJ0Fzc2lnbmVkUm9sZScsXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdTb21lIERpc3BsYXkgTmFtZTMnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBhIHRlc3QgY2VydGlmaWNhdGlvbiBpdGVtMycsXG4gICAgICAgICAgICAgICAgZGVjaXNpb25TdGF0dXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVjaXNpb25zOiBbbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JlbWVkaWF0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0S2V5OiAnUmVtZWRpYXRlZCdcbiAgICAgICAgICAgICAgICAgICAgfSldXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5U3RhdHVzOiAnQ29tcGxldGUnLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnYXBwJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGU6ICduYW1lJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgICAgICAgICAgICBlbnRpdHlJZDogJ3BlcnNvbjEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMjIyMicsXG4gICAgICAgICAgICAgICAgdHlwZTogJ0J1bmRsZScsXG4gICAgICAgICAgICAgICAgc3ViVHlwZTogJ0Fzc2lnbmVkUm9sZScsXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdTb21lIERpc3BsYXkgTmFtZTQnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBhIHRlc3QgY2VydGlmaWNhdGlvbiBpdGVtNCcsXG4gICAgICAgICAgICAgICAgZGVjaXNpb25TdGF0dXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVjaXNpb25zOiBbbmV3IENlcnRpZmljYXRpb25BY3Rpb25TdGF0dXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JlbWVkaWF0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0S2V5OiAnUmVtZWRpYXRlZCdcbiAgICAgICAgICAgICAgICAgICAgfSldXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5U3RhdHVzOiAnQ29tcGxldGUnLFxuICAgICAgICAgICAgICAgIHJvbGVOYW1lOiAncm9sZTEnLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgICAgICAgICAgICAgIGVudGl0eUlkOiAncGVyc29uMSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICczMzMzJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnQnVuZGxlJyxcbiAgICAgICAgICAgICAgICBzdWJUeXBlOiAnQXNzaWduZWRSb2xlJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1NvbWUgRGlzcGxheSBOYW1lNScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIGEgdGVzdCBjZXJ0aWZpY2F0aW9uIGl0ZW01JyxcbiAgICAgICAgICAgICAgICBkZWNpc2lvblN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICBkZWNpc2lvbnM6IFtuZXcgQ2VydGlmaWNhdGlvbkFjdGlvblN0YXR1cyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUmVtZWRpYXRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHRLZXk6ICdSZW1lZGlhdGVkJ1xuICAgICAgICAgICAgICAgICAgICB9KV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1bW1hcnlTdGF0dXM6ICdDb21wbGV0ZScsXG4gICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdyb2xlMScsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICAgICAgICAgICAgZW50aXR5SWQ6ICdwZXJzb24xJyxcbiAgICAgICAgICAgICAgICB1bnJlbW92ZWRSZW1lZGlhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjdXJyZW50TWl0aWdhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXhwaXJlZE1pdGlnYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgICAgIHByb3Zpc2lvbkFkZHNSZXF1ZXN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBsYXN0TWl0aWdhdGlvbkRhdGU6IDE0NTQ2MjE3MDg0MjJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcblxuICAgICAgICBISVNUT1JZX0RBVEFfUkVTUE9OU0U6IHtcbiAgICAgICAgICAgICdhdHRyaWJ1dGVzJzogbnVsbCxcbiAgICAgICAgICAgICdjb21wbGV0ZSc6IHRydWUsXG4gICAgICAgICAgICAnY291bnQnOiA2LFxuICAgICAgICAgICAgJ2Vycm9ycyc6IG51bGwsXG4gICAgICAgICAgICAnZmFpbHVyZSc6IGZhbHNlLFxuICAgICAgICAgICAgJ21ldGFEYXRhJzogbnVsbCxcbiAgICAgICAgICAgICdvYmplY3RzJzogW3tcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ0FwcHJvdmVkJyxcbiAgICAgICAgICAgICAgICAnYWN0b3InOiAnSmFtZXMgU21pdGgnLFxuICAgICAgICAgICAgICAgICdlbnRyeURhdGUnOiAnMS8yNS8xNiAxMDozOCBBTScsXG4gICAgICAgICAgICAgICAgJ2NvbW1lbnRzJzogbnVsbFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAncmVxdWVzdElEJzogbnVsbCxcbiAgICAgICAgICAgICdyZXRyeSc6IGZhbHNlLFxuICAgICAgICAgICAgJ3JldHJ5V2FpdCc6IDAsXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ3N1Y2Nlc3MnOiB0cnVlLFxuICAgICAgICAgICAgJ3dhcm5pbmdzJzogbnVsbFxuICAgICAgICB9LFxuXG4gICAgICAgIEhJU1RPUllfREFUQTogW3tcbiAgICAgICAgICAgICdzdGF0dXMnOiAnQXBwcm92ZWQnLFxuICAgICAgICAgICAgJ2FjdG9yJzogJ0phbWVzIFNtaXRoJyxcbiAgICAgICAgICAgICdlbnRyeURhdGUnOiAnMS8yNS8xNiAxMDozOCBBTScsXG4gICAgICAgICAgICAnY29tbWVudHMnOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IG51bGwsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnQ29tbWVudCcsXG4gICAgICAgICAgICAgICAgJ2FjdG9yJzogJ0phbWVzIFNtaXRoJyxcbiAgICAgICAgICAgICAgICAnZW50cnlEYXRlJzogJzEvMjUvMTYgMTA6MzggQU0nLFxuICAgICAgICAgICAgICAgICdjb21tZW50cyc6ICdNeSBjb21tZW50cyBnbyBoZXJlLidcbiAgICAgICAgICAgIH1dLFxuXG4gICAgICAgIENFUlRJRklDQVRJT05fRU5USVRZX0xJU1RfUkVTVUxUOiB7XG4gICAgICAgICAgICBjb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvdW50OiAzLFxuICAgICAgICAgICAgZXJyb3JzOiBbJ2Vycm9yIDEnLCAnZXJyb3IgMiddLFxuICAgICAgICAgICAgZmFpbHVyZTogZmFsc2UsXG4gICAgICAgICAgICBvYmplY3RzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJzEyMzQnLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXNwbGF5TmFtZTogJ0phbWVzLlNwYWRlcicsXG4gICAgICAgICAgICAgICAgICAgIGRlbGVnYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyTmFtZTogJ0FyY2ggU3RhbnRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiAxNDU0NjIxNzA4NDIyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICc0NTY3JyxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RGlzcGxheU5hbWU6ICdKYW1lcy5Db2didXJuJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJzk4NzYnLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXNwbGF5TmFtZTogJ0ppbS5Sb2NrZm9yZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmVxdWVzdElEOiAnMTIzNDU2NzgnLFxuICAgICAgICAgICAgcmV0cnk6IGZhbHNlLFxuICAgICAgICAgICAgcmV0cnlXYWl0OiAwLFxuICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgd2FybmluZ3M6IFsnd2FybmluZyAxJywgJ3dhcm5pbmcgMiddXG4gICAgICAgIH0sXG5cbiAgICAgICAgQ0VSVElGSUNBVElPTl9TSUdORUQ6IHtcbiAgICAgICAgICAgIGlkOiAnOTg3NjUnLFxuICAgICAgICAgICAgYXZhaWxhYmxlQnVsa0RlY2lzaW9uczogW3t2YWx1ZTogJ0FwcHJvdmVkJywga2V5OiAndWlfYXBwcm92ZWQnfSxcbiAgICAgICAgICAgICAgICB7dmFsdWU6ICdSZW1lZGlhdGVkJywga2V5OiAndWlfcmVtZWRpYXRlZCd9LFxuICAgICAgICAgICAgICAgIHt2YWx1ZTogJ1JlYXNzaWduJywga2V5OiAndWlfcmVhc3NpZ24nfSxcbiAgICAgICAgICAgICAgICB7dmFsdWU6ICdVbmRvJywga2V5OiAndWlfdW5kbyd9XSxcbiAgICAgICAgICAgIGNlcnRpZmllcnM6IFsnSmFtZXMuU21pdGgnXSxcbiAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IDE0NTQ2MjE3MDg0MjIsXG4gICAgICAgICAgICBuYW1lOiAnTWFuYWdlciBBY2Nlc3MgUmV2aWV3IGZvciBKYW1lcyBTbWl0aCcsXG4gICAgICAgICAgICBuZXh0UGhhc2VUcmFuc2l0aW9uOiAxNDU0NjIxNzA4NDYwLFxuICAgICAgICAgICAgcGhhc2U6ICdSZXZvY2F0aW9uJyxcbiAgICAgICAgICAgIHNpZ25vZmZzOiBbe1xuICAgICAgICAgICAgICAgIGRhdGU6IDE0NTQ2MjE3MDg0MjIsXG4gICAgICAgICAgICAgICAgc2lnbmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCb2InLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ015IE5hbWUgSXMgQm9iJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdib2JzaWQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0FwcDEnLFxuICAgICAgICAgICAgICAgIGFjY291bnQ6ICdCb2JzQWNjdCcsXG4gICAgICAgICAgICAgICAgZXNpZ01lYW5pbmc6ICdJIHNhdyB0aGUgc2lnbiBhbmQgaXQgb3BlbmVkIHVwIG15IGV5ZXMnXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb25Db3VudDogMTAsXG4gICAgICAgICAgICByZW1lZGlhdGlvbnNDb21wbGV0ZWQ6IDIsXG4gICAgICAgICAgICByZW1lZGlhdGlvbnNTdGFydGVkOiA1LFxuICAgICAgICAgICAgdGFnczogW11cbiAgICAgICAgfSxcbiAgICAgICAgUkVNRURJQVRJT05fQURWSUNFX1JFU1VMVDoge1xuICAgICAgICAgICAgYWR2aWNlOiB7XG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uQ29uc3RyYWludDogJ1RoaXMgaXMgbXkgY29uc3RyYWludCcsXG4gICAgICAgICAgICAgICAgdmlvbGF0aW9uU3VtbWFyeTogJ0kgaGF2ZSBhIHN0b3J5IHRvIHRlbGwgeW91IGFib3V0IHRoaXMgdmlvbGF0aW9uLicsXG4gICAgICAgICAgICAgICAgcmVtZWRpYXRpb25BZHZpY2U6ICdGSUdVUkUgSVQgT1VUIScsXG4gICAgICAgICAgICAgICAgbGVmdFJvbGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ2xlZnQxJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2xlZnQxTmFtZScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlhYmxlTmFtZTogJ2xlZnQxRGlzcGxheWFibGVOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdpIGFtIGEgbGVmdCByb2xlJyxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjZXJ0SXRlbUlkOiAnbGVmdFJvbGVDZXJ0SXRlbUlkJyxcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5SWQ6ICdsZWZ0Um9sZUVudGl0eUlkJyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnUmVtZWRpYXRlZCdcbiAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdsZWZ0MicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdsZWZ0Mk5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5YWJsZU5hbWU6ICdsZWZ0MkRpc3BsYXlhYmxlTmFtZScsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaSBhbSBhIGxlZnQgcm9sZSB0b28nLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNlcnRJdGVtSWQ6ICdsZWZ0Um9sZTJDZXJ0SXRlbUlkJyxcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5SWQ6ICdsZWZ0Um9sZTJFbnRpdHlJZCdcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICByaWdodFJvbGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3JpZ2h0MScsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdyaWdodDFOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheWFibGVOYW1lOiAncmlnaHQxRGlzcGxheWFibGVOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdpIGFtIGEgcmlnaHQgcm9sZSdcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICBpZDogJzEyMzQnLFxuICAgICAgICAgICAgICAgIGVuYWJsZU92ZXJyaWRlRGVmYXVsdFJlbWVkaWF0b3I6IHRydWUsXG4gICAgICAgICAgICAgICAgZGVmYXVsdFJlbWVkaWF0b3I6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0R1ZGUnLFxuICAgICAgICAgICAgICAgICAgICBpZDogJ3doYXRldmVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tbWVudHM6ICdmaXggdGhpcyBkdWRlJyxcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkRldGFpbHM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnQXBwMScsXG4gICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uSWQ6ICdBcHAxSUQnLFxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50OiAnTXlBY2N0JyxcbiAgICAgICAgICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICcxMjM0YWJjZCcsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZTogJ1NvbWVBdHRyaWJ1dGUnLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogJ1NvbWVWYWx1ZScsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdE9wdGlvbnM6IFtbXG4gICAgICAgICAgICAgICAgICAgICAgICAnUmVtb3ZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZW1vdmUnXG4gICAgICAgICAgICAgICAgICAgIF0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdTZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NldCdcbiAgICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgICAgIGlucHV0VHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBlZGl0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdSZW1lZGlhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogWydTZXQnLCAnc2V0J11cbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICByZW1lZGlhdGlvbkFjdGlvbjogJ09wZW5Xb3JrSXRlbSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBQT0xJQ1lfVFJFRV9OT0RFOiB7XG4gICAgICAgICAgICBvcGVyYXRvcjogJ09SJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbe1xuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnVGhlIFdvcmxkJyxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbklkOiAnMTIzNDUnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdtZW1iZXJPZicsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICdjbj11cHJpZ2h0IGNpdGl6ZW5zLGRjPWNvbScsXG4gICAgICAgICAgICAgICAgZGlzcGxheVZhbHVlOiAnVXByaWdodCBDaXRpemVucycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29vbGVzdCBvZiB0aGUgY29vbCcsXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBbe1xuICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGVkSXRlbUlkOiAnY2VydEl0ZW05ODcnLFxuICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGVkRW50aXR5SWQ6ICdjZXJ0RW50aXR5MjM0JyxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnQXBwcm92ZWQnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ0F1c3RpbicsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25JZDogJzg3NDUnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdtZW1iZXJPZicsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICdjbj1zdGVhbGluZyBjaGVhdGluZyBsaWFycyxkYz1jb20nLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlWYWx1ZTogJ1N0ZWFsaW5nIENoZWF0aW5nIExpYXJzJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ljZSBjb2xkJyxcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBudWxsXG4gICAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICBQT0xJQ1lfVFJFRV9BTkRfTk9ERToge1xuICAgICAgICAgICAgb3BlcmF0b3I6ICdBTkQnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFt7XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdNeUFwcCcsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25JZDogJzEyMzQ1JyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnbWVtYmVyT2YnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnY249dHJ1ZSxkYz1jb20nLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlWYWx1ZTogJ1NvbWUgdmFsdWUnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGVzdCBhcHAnLFxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogW3tcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRlZEl0ZW1JZDogJ2NlcnRJdGVtOTg3JyxcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRlZEVudGl0eUlkOiAnY2VydEVudGl0eTIzNCcsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ1JlbWVkaWF0ZWQnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ1lvdXJBcHAnLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uSWQ6ICc4NzQ1JyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnbWVtYmVyT2YnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnY249ZmFsc2UsZGM9Y29tJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5VmFsdWU6ICdTb21lIG90aGVyIHZhbHVlJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Rlc3QgYXBwJyxcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBbe1xuICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGVkSXRlbUlkOiAnY2VydEl0ZW05ODcxJyxcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRlZEVudGl0eUlkOiAnY2VydEVudGl0eTIzNDEnLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdSZW1lZGlhdGVkJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICBQT0xJQ1lfVFJFRV9BTkRfTk9ERV9OT19MSU5FX0lURU1fREVDSVNJT05TOiB7XG4gICAgICAgICAgICBvcGVyYXRvcjogJ0FORCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW3tcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbjogJ015QXBwJyxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbklkOiAnMTIzNDUnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdtZW1iZXJPZicsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICdjbj10cnVlLGRjPWNvbScsXG4gICAgICAgICAgICAgICAgZGlzcGxheVZhbHVlOiAnU29tZSB2YWx1ZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0ZXN0IGFwcCcsXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBudWxsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdZb3VyQXBwJyxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbklkOiAnODc0NScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ21lbWJlck9mJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ2NuPWZhbHNlLGRjPWNvbScsXG4gICAgICAgICAgICAgICAgZGlzcGxheVZhbHVlOiAnU29tZSBvdGhlciB2YWx1ZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0ZXN0IGFwcCcsXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogbnVsbFxuICAgICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgIH07XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
