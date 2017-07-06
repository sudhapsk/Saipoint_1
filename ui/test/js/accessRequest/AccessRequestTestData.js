System.register(['accessRequest/AccessRequestModule'], function (_export) {
    'use strict';

    var accessRequestModule;
    return {
        setters: [function (_accessRequestAccessRequestModule) {
            accessRequestModule = _accessRequestAccessRequestModule['default'];
        }],
        execute: function () {

            angular.module(accessRequestModule).

            /**
             * This contains test data used by the access request tests.  Don't modify this data
             * directly from within your tests.  If you need to modify data, use angular.copy() to create your own
             * copy before changing it.
             */
            factory('accessRequestTestData', function () {

                var roleTarget1 = {
                    role: 'keep rollin rollin',
                    application: 'back up back up',
                    nativeIdentity: 'tell me what you gonna do now',
                    accountName: 'people in the house',
                    instance: 'put them hands in the air'
                };

                return {
                    IDENTITY1: {
                        id: '1',
                        name: 'jbob',
                        displayName: 'Jay Bob',
                        managerName: 'Joe Bob',
                        location: 'Austin',
                        department: 'Agriculture'
                    },

                    IDENTITY2: {
                        id: '2',
                        name: 'kbob',
                        displayName: 'Kay Bob',
                        managerName: 'Jim Bob',
                        location: 'Austin',
                        department: 'Agriculture'
                    },

                    IDENTITY3: {
                        id: '3',
                        name: 'tbob',
                        displayName: 'Tee Bob',
                        managerName: 'Jim Bob',
                        location: 'Wisconsin',
                        department: 'Code Monkeys'
                    },

                    ROLE: {
                        id: '1',
                        accessType: 'Role',
                        displayableAccessType: 'Role',
                        name: 'They see me role-in',
                        displayableName: 'with my homies',
                        owner: 'Chamillionaire',
                        description: 'just ridin dirty',
                        riskScoreWeight: 800
                    },

                    PERMITTED_ROLE: {
                        id: '1.5',
                        accessType: 'Role',
                        displayableAccessType: 'Role',
                        name: 'Today was a good day...',
                        displayableName: '... didn\'t even have to use my AK',
                        owner: 'ICE T',
                        description: 'I gotta go cuz I got me a drop top',
                        riskScoreWeight: 300,
                        permitted: true
                    },

                    ENTITLEMENT: {
                        id: '2',
                        accessType: 'Entitlement',
                        displayableAccessType: 'Entitlement!!',
                        displayableName: 'Poppin dat cris',
                        value: 'CN=Quest,OU=Tribe,OU=Called,DC=test,DC=sailpoint,DC=com',
                        owner: 'J Mon$y',
                        description: 'go to work',
                        icon: 'champagneBottle',
                        application: 'Bar',
                        attribute: 'libation'
                    },

                    IDENTITY_SEARCH_ROLE: {
                        id: '3',
                        accessType: 'Role',
                        displayableAccessType: 'Role!!',
                        name: 'Id searchin',
                        displayableName: 'and with my homies',
                        owner: 'Chamillionaire',
                        description: 'my posse',
                        riskScoreWeight: 0,
                        riskScoreColor: '000000',
                        riskScoreTextColor: 'FFFFFF',
                        populationStatistics: {
                            total: 20,
                            count: 10,
                            highRisk: true
                        },
                        permitted: true
                    },

                    COL_CONFIG1: {
                        dataIndex: 'name',
                        label: 'Username'
                    },

                    COL_CONFIG2: {
                        dataIndex: 'displayableName',
                        label: 'Name'
                    },

                    COL_CONFIG3: {
                        dataIndex: 'id',
                        fieldOnly: true
                    },

                    ROLE_TARGET1: roleTarget1,

                    CURRENT_ACCESS_ROLE: {
                        id: '1',
                        accessType: 'Role',
                        displayableAccessType: 'Role',
                        name: 'nameblah',
                        displayableName: 'displayablenameblah',
                        owner: 'ownerblah',
                        description: 'descriptionblah',
                        riskScoreWeight: 800,
                        riskScoreColor: '#FF0000',
                        riskScoreTextColor: '#FFFFFF',
                        status: 'requested',
                        statusLabel: 'Requested',
                        sunrise: 1391618385380,
                        sunset: 1392223185380,
                        assignmentId: 'assignmentIdBlah',
                        roleLocation: 'assigned',
                        removable: true,
                        roleTargets: [roleTarget1]
                    },

                    CURRENT_ACCESS_ENTITLEMENT: {
                        id: '2',
                        accessType: 'Entitlement',
                        displayableAccessType: 'Entitlement',
                        displayableName: 'entblah',
                        value: 'entblah',
                        owner: 'entownerblah',
                        description: 'entdescriptionblah',
                        icon: 'enticonblah',
                        application: 'entapplicationblah',
                        attribute: 'entattributeblah',
                        status: 'active',
                        statusLabel: 'Active',
                        nativeIdentity: 'nativeblah',
                        accountName: 'accountblah',
                        instance: 'instanceblah',
                        comment: 'trolololo',
                        removable: true
                    },

                    ROLE_TO_REMOVE: {
                        id: '5',
                        accessType: 'Role',
                        displayableAccessType: 'Role',
                        name: 'removeme',
                        displayableName: 'displayablenameblah',
                        owner: 'ownerblah',
                        description: 'descriptionblah',
                        riskScoreWeight: 800,
                        riskScoreColor: '#FF0000',
                        riskScoreTextColor: '#FFFFFF',
                        status: 'requested',
                        statusLabel: 'Requested',
                        sunrise: 1391618385380,
                        sunset: 1392223185380,
                        assignmentId: 'removedroleassignmentIdBlah',
                        assignmentNote: 'blahblahblah',
                        comment: 'trololololo',
                        roleLocation: 'assigned'
                    },

                    IDENTITY_ACCT_SELECTION1: {
                        identityId: 'ted.tacular.id',
                        identityName: 'ted.tacular',
                        provisioningTargets: [{
                            applicationId: 'appId',
                            applicationName: 'appName',
                            roleName: 'Boss',
                            allowCreate: false,
                            accountInfos: [{
                                instance: 'tedsAccount',
                                nativeIdentity: 'ted',
                                displayName: 'Ted Tacular'
                            }, {
                                instance: 'tedsAlt',
                                nativeIdentity: 'alted',
                                displayName: 'Ted A Tacular'
                            }]
                        }, {
                            applicationId: 'appId2',
                            applicationName: 'appName2',
                            roleName: 'Endentured Servant',
                            allowCreate: true,
                            accountInfos: [{
                                instance: 'lackyInstance',
                                nativeIdentity: 'lacky',
                                displayName: 'Lacker'
                            }, {
                                instance: 'slackyInstance',
                                nativeIdentity: 'slacky',
                                displayName: 'Slacker'
                            }]
                        }]
                    },

                    IDENTITY_ACCT_SELECTION2: {
                        identityId: 'tim.tacular.id',
                        identityName: 'tim.tacular',
                        provisioningTargets: [{
                            applicationId: 'appId',
                            applicationName: 'appName',
                            roleName: 'Boss',
                            allowCreate: false,
                            accountInfos: [{
                                instance: 'timsAccount',
                                nativeIdentity: 'tim',
                                displayName: 'Tim Tacular'
                            }, {
                                instance: 'timsAlt',
                                nativeIdentity: 'timmy',
                                displayName: 'Tim E Tacular'
                            }]
                        }, {
                            applicationId: 'appId2',
                            applicationName: 'appName2',
                            roleName: 'Endentured Servant',
                            allowCreate: true,
                            accountInfos: [{
                                instance: 'lackyInstance',
                                nativeIdentity: 'tbone',
                                displayName: 'T-Bone'
                            }, {
                                instance: 'slackyInstance',
                                nativeIdentity: 'koko',
                                displayName: 'Gammy'
                            }]
                        }]
                    },

                    AMBIGUOUS_ASSIGNED_ROLE1: {
                        assignmentId: 'assignment1',
                        roleId: '1234',
                        name: 'assignedRole1',
                        assignmentNote: 'i assigned this out of boredom',
                        assigner: 'Dum.Bo',
                        created: 1391618385380
                    },

                    AMBIGUOUS_ASSIGNED_ROLE2: {
                        assignmentId: 'assignment2',
                        roleId: '5678',
                        name: 'assignedRole2',
                        assignmentNote: 'i assigned this out of spite',
                        assigner: 'Herp.Derp',
                        created: 1391718385380
                    },

                    POPULATION_STATISTICS: {
                        total: 20,
                        count: 10,
                        highRisk: true
                    },

                    ROLE_POLICY_VIOLATION_DATA: {
                        policyName: 'role pv policyName',
                        description: 'role pv description',
                        ruleName: 'role pv ruleName',
                        workItemId: 'role pv workItemId',
                        leftBundles: ['role pv leftBundle1', 'role pv leftBundle2'],
                        rightBundles: ['role pv rightBundle1', 'role pv rightBundle2']
                    },

                    ENTITLEMENT_POLICY_VIOLATION_DATA: {
                        policyName: 'entitlement pv policyName',
                        description: 'entitlement pv description',
                        ruleName: 'entitlement pv ruleName',
                        workItemId: 'entitlement pv workItemId',
                        entitlements: [{
                            application: 'entitlement app1',
                            name: 'entitlement name1',
                            value: 'entitlement value1'
                        }, {
                            application: 'entitlement app2',
                            name: 'entitlement name2',
                            value: 'entitlement value2'
                        }]
                    },

                    POLICY_VIOLATION_ROLE: {
                        id: '11',
                        accessType: 'Role',
                        displayableAccessType: 'Role',
                        name: 'role pv leftBundle1',
                        displayableName: 'lefty',
                        owner: 'Chamillionaire',
                        description: 'just ridin dirty',
                        riskScoreWeight: 800
                    },

                    VIOLATION_REVIEW_ROLE: {
                        accountName: 'New account',
                        attributes: { allowRequestsWithViolations: false },
                        entitlementApplication: null,
                        entitlementName: null,
                        entitlementRequest: false,
                        entitlementValue: null,
                        description: 'A boring description about nothing',
                        id: '33',
                        operation: 'Add',
                        roleId: '333',
                        roleName: 'role pv leftBundle1',
                        state: 'Pending'
                    },

                    POLICY_VIOLATION_ENTITLEMENT: {
                        id: '22',
                        accessType: 'Entitlement',
                        displayableAccessType: 'Entitlement!!',
                        displayableName: 'entitlement value1',
                        owner: 'J Mon$y',
                        description: 'go to work',
                        icon: 'champagneBottle',
                        application: 'entitlement app1',
                        attribute: 'entitlement name1',
                        value: 'entitlement value1'
                    },

                    VIOLATION_REVIEW_ENTITLEMENT: {
                        accountName: 'Amanda.Ross',
                        attributes: {},
                        entitlementApplication: 'entitlement app1',
                        entitlementName: 'entitlement name1',
                        entitlementRequest: true,
                        entitlementValue: 'entitlement value1',
                        id: '44',
                        operation: 'Add',
                        roleId: null,
                        roleName: null,
                        state: 'Pending'
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzc1JlcXVlc3QvQWNjZXNzUmVxdWVzdFRlc3REYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxDQUFDLHNDQUFzQyxVQUFVLFNBQVM7SUFBMUU7O0lBR0ksSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSxtQ0FBbUM7WUFDbkQsc0JBQXNCLGtDQUFrQzs7UUFFNUQsU0FBUyxZQUFZOztZQUo3QixRQUFRLE9BQU87Ozs7Ozs7WUFPZixRQUFRLHlCQUF5QixZQUFXOztnQkFFeEMsSUFBSSxjQUFjO29CQUNkLE1BQU07b0JBQ04sYUFBYTtvQkFDYixnQkFBZ0I7b0JBQ2hCLGFBQWE7b0JBQ2IsVUFBVTs7O2dCQUdkLE9BQU87b0JBQ0gsV0FBVzt3QkFDUCxJQUFJO3dCQUNKLE1BQU07d0JBQ04sYUFBYTt3QkFDYixhQUFhO3dCQUNiLFVBQVU7d0JBQ1YsWUFBWTs7O29CQUdoQixXQUFXO3dCQUNQLElBQUk7d0JBQ0osTUFBTTt3QkFDTixhQUFhO3dCQUNiLGFBQWE7d0JBQ2IsVUFBVTt3QkFDVixZQUFZOzs7b0JBR2hCLFdBQVc7d0JBQ1AsSUFBSTt3QkFDSixNQUFNO3dCQUNOLGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixVQUFVO3dCQUNWLFlBQVk7OztvQkFHaEIsTUFBTTt3QkFDRixJQUFJO3dCQUNKLFlBQVk7d0JBQ1osdUJBQXVCO3dCQUN2QixNQUFNO3dCQUNOLGlCQUFpQjt3QkFDakIsT0FBTzt3QkFDUCxhQUFhO3dCQUNiLGlCQUFpQjs7O29CQUdyQixnQkFBZ0I7d0JBQ1osSUFBSTt3QkFDSixZQUFZO3dCQUNaLHVCQUF1Qjt3QkFDdkIsTUFBTTt3QkFDTixpQkFBaUI7d0JBQ2pCLE9BQU87d0JBQ1AsYUFBYTt3QkFDYixpQkFBaUI7d0JBQ2pCLFdBQVc7OztvQkFHZixhQUFhO3dCQUNULElBQUk7d0JBQ0osWUFBWTt3QkFDWix1QkFBdUI7d0JBQ3ZCLGlCQUFpQjt3QkFDakIsT0FBTzt3QkFD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aUJBQWlCO3dCQUNqQixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsSUFBSTt3QkFDSixXQUFXO3dCQUNYLFFBQVE7d0JBQ1IsVUFBVTt3QkFDVixPQUFPOzs7Ozs7R0FTaEIiLCJmaWxlIjoiYWNjZXNzUmVxdWVzdC9BY2Nlc3NSZXF1ZXN0VGVzdERhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgYWNjZXNzUmVxdWVzdE1vZHVsZSBmcm9tICdhY2Nlc3NSZXF1ZXN0L0FjY2Vzc1JlcXVlc3RNb2R1bGUnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoYWNjZXNzUmVxdWVzdE1vZHVsZSkuXHJcblxyXG4vKipcclxuICogVGhpcyBjb250YWlucyB0ZXN0IGRhdGEgdXNlZCBieSB0aGUgYWNjZXNzIHJlcXVlc3QgdGVzdHMuICBEb24ndCBtb2RpZnkgdGhpcyBkYXRhXHJcbiAqIGRpcmVjdGx5IGZyb20gd2l0aGluIHlvdXIgdGVzdHMuICBJZiB5b3UgbmVlZCB0byBtb2RpZnkgZGF0YSwgdXNlIGFuZ3VsYXIuY29weSgpIHRvIGNyZWF0ZSB5b3VyIG93blxyXG4gKiBjb3B5IGJlZm9yZSBjaGFuZ2luZyBpdC5cclxuICovXHJcbmZhY3RvcnkoJ2FjY2Vzc1JlcXVlc3RUZXN0RGF0YScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciByb2xlVGFyZ2V0MSA9IHtcclxuICAgICAgICByb2xlOiAna2VlcCByb2xsaW4gcm9sbGluJyxcclxuICAgICAgICBhcHBsaWNhdGlvbjogJ2JhY2sgdXAgYmFjayB1cCcsXHJcbiAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICd0ZWxsIG1lIHdoYXQgeW91IGdvbm5hIGRvIG5vdycsXHJcbiAgICAgICAgYWNjb3VudE5hbWU6ICdwZW9wbGUgaW4gdGhlIGhvdXNlJyxcclxuICAgICAgICBpbnN0YW5jZTogJ3B1dCB0aGVtIGhhbmRzIGluIHRoZSBhaXInXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgSURFTlRJVFkxOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMScsXHJcbiAgICAgICAgICAgIG5hbWU6ICdqYm9iJyxcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdKYXkgQm9iJyxcclxuICAgICAgICAgICAgbWFuYWdlck5hbWU6ICdKb2UgQm9iJyxcclxuICAgICAgICAgICAgbG9jYXRpb246ICdBdXN0aW4nLFxyXG4gICAgICAgICAgICBkZXBhcnRtZW50OiAnQWdyaWN1bHR1cmUnXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgSURFTlRJVFkyOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMicsXHJcbiAgICAgICAgICAgIG5hbWU6ICdrYm9iJyxcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdLYXkgQm9iJyxcclxuICAgICAgICAgICAgbWFuYWdlck5hbWU6ICdKaW0gQm9iJyxcclxuICAgICAgICAgICAgbG9jYXRpb246ICdBdXN0aW4nLFxyXG4gICAgICAgICAgICBkZXBhcnRtZW50OiAnQWdyaWN1bHR1cmUnXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgSURFTlRJVFkzOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMycsXHJcbiAgICAgICAgICAgIG5hbWU6ICd0Ym9iJyxcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdUZWUgQm9iJyxcclxuICAgICAgICAgICAgbWFuYWdlck5hbWU6ICdKaW0gQm9iJyxcclxuICAgICAgICAgICAgbG9jYXRpb246ICdXaXNjb25zaW4nLFxyXG4gICAgICAgICAgICBkZXBhcnRtZW50OiAnQ29kZSBNb25rZXlzJ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIFJPTEU6IHtcclxuICAgICAgICAgICAgaWQ6ICcxJyxcclxuICAgICAgICAgICAgYWNjZXNzVHlwZTogJ1JvbGUnLFxyXG4gICAgICAgICAgICBkaXNwbGF5YWJsZUFjY2Vzc1R5cGU6ICdSb2xlJyxcclxuICAgICAgICAgICAgbmFtZTogJ1RoZXkgc2VlIG1lIHJvbGUtaW4nLFxyXG4gICAgICAgICAgICBkaXNwbGF5YWJsZU5hbWU6ICd3aXRoIG15IGhvbWllcycsXHJcbiAgICAgICAgICAgIG93bmVyOiAnQ2hhbWlsbGlvbmFpcmUnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2p1c3QgcmlkaW4gZGlydHknLFxyXG4gICAgICAgICAgICByaXNrU2NvcmVXZWlnaHQ6IDgwMFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIFBFUk1JVFRFRF9ST0xFOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMS41JyxcclxuICAgICAgICAgICAgYWNjZXNzVHlwZTogJ1JvbGUnLFxyXG4gICAgICAgICAgICBkaXNwbGF5YWJsZUFjY2Vzc1R5cGU6ICdSb2xlJyxcclxuICAgICAgICAgICAgbmFtZTogJ1RvZGF5IHdhcyBhIGdvb2QgZGF5Li4uJyxcclxuICAgICAgICAgICAgZGlzcGxheWFibGVOYW1lOiAnLi4uIGRpZG5cXCd0IGV2ZW4gaGF2ZSB0byB1c2UgbXkgQUsnLFxyXG4gICAgICAgICAgICBvd25lcjogJ0lDRSBUJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJIGdvdHRhIGdvIGN1eiBJIGdvdCBtZSBhIGRyb3AgdG9wJyxcclxuICAgICAgICAgICAgcmlza1Njb3JlV2VpZ2h0OiAzMDAsXHJcbiAgICAgICAgICAgIHBlcm1pdHRlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIEVOVElUTEVNRU5UOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMicsXHJcbiAgICAgICAgICAgIGFjY2Vzc1R5cGU6ICdFbnRpdGxlbWVudCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlQWNjZXNzVHlwZTogJ0VudGl0bGVtZW50ISEnLFxyXG4gICAgICAgICAgICBkaXNwbGF5YWJsZU5hbWU6ICdQb3BwaW4gZGF0IGNyaXMnLFxyXG4gICAgICAgICAgICB2YWx1ZTogJ0NOPVF1ZXN0LE9VPVRyaWJlLE9VPUNhbGxlZCxEQz10ZXN0LERDPXNhaWxwb2ludCxEQz1jb20nLFxyXG4gICAgICAgICAgICBvd25lcjogJ0ogTW9uJHknLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2dvIHRvIHdvcmsnLFxyXG4gICAgICAgICAgICBpY29uOiAnY2hhbXBhZ25lQm90dGxlJyxcclxuICAgICAgICAgICAgYXBwbGljYXRpb246ICdCYXInLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGU6ICdsaWJhdGlvbidcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBJREVOVElUWV9TRUFSQ0hfUk9MRToge1xyXG4gICAgICAgICAgICBpZDogJzMnLFxyXG4gICAgICAgICAgICBhY2Nlc3NUeXBlOiAnUm9sZScsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlQWNjZXNzVHlwZTogJ1JvbGUhIScsXHJcbiAgICAgICAgICAgIG5hbWU6ICdJZCBzZWFyY2hpbicsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlTmFtZTogJ2FuZCB3aXRoIG15IGhvbWllcycsXHJcbiAgICAgICAgICAgIG93bmVyOiAnQ2hhbWlsbGlvbmFpcmUnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ215IHBvc3NlJyxcclxuICAgICAgICAgICAgcmlza1Njb3JlV2VpZ2h0OiAwLFxyXG4gICAgICAgICAgICByaXNrU2NvcmVDb2xvcjogJzAwMDAwMCcsXHJcbiAgICAgICAgICAgIHJpc2tTY29yZVRleHRDb2xvcjogJ0ZGRkZGRicsXHJcbiAgICAgICAgICAgIHBvcHVsYXRpb25TdGF0aXN0aWNzOiB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbDogMjAsXHJcbiAgICAgICAgICAgICAgICBjb3VudDogMTAsXHJcbiAgICAgICAgICAgICAgICBoaWdoUmlzazogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwZXJtaXR0ZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBDT0xfQ09ORklHMToge1xyXG4gICAgICAgICAgICBkYXRhSW5kZXg6ICduYW1lJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdVc2VybmFtZSdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBDT0xfQ09ORklHMjoge1xyXG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdkaXNwbGF5YWJsZU5hbWUnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ05hbWUnXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgQ09MX0NPTkZJRzM6IHtcclxuICAgICAgICAgICAgZGF0YUluZGV4OiAnaWQnLFxyXG4gICAgICAgICAgICBmaWVsZE9ubHk6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBST0xFX1RBUkdFVDE6IHJvbGVUYXJnZXQxLFxyXG5cclxuICAgICAgICBDVVJSRU5UX0FDQ0VTU19ST0xFOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMScsXHJcbiAgICAgICAgICAgIGFjY2Vzc1R5cGU6ICdSb2xlJyxcclxuICAgICAgICAgICAgZGlzcGxheWFibGVBY2Nlc3NUeXBlOiAnUm9sZScsXHJcbiAgICAgICAgICAgIG5hbWU6ICduYW1lYmxhaCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlTmFtZTogJ2Rpc3BsYXlhYmxlbmFtZWJsYWgnLFxyXG4gICAgICAgICAgICBvd25lcjogJ293bmVyYmxhaCcsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb25ibGFoJyxcclxuICAgICAgICAgICAgcmlza1Njb3JlV2VpZ2h0OiA4MDAsXHJcbiAgICAgICAgICAgIHJpc2tTY29yZUNvbG9yOiAnI0ZGMDAwMCcsXHJcbiAgICAgICAgICAgIHJpc2tTY29yZVRleHRDb2xvcjogJyNGRkZGRkYnLFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdyZXF1ZXN0ZWQnLFxyXG4gICAgICAgICAgICBzdGF0dXNMYWJlbDogJ1JlcXVlc3RlZCcsXHJcbiAgICAgICAgICAgIHN1bnJpc2U6IDEzOTE2MTgzODUzODAsXHJcbiAgICAgICAgICAgIHN1bnNldDogMTM5MjIyMzE4NTM4MCxcclxuICAgICAgICAgICAgYXNzaWdubWVudElkOiAnYXNzaWdubWVudElkQmxhaCcsXHJcbiAgICAgICAgICAgIHJvbGVMb2NhdGlvbjogJ2Fzc2lnbmVkJyxcclxuICAgICAgICAgICAgcmVtb3ZhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICByb2xlVGFyZ2V0czogWyByb2xlVGFyZ2V0MSBdXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgQ1VSUkVOVF9BQ0NFU1NfRU5USVRMRU1FTlQ6IHtcclxuICAgICAgICAgICAgaWQ6ICcyJyxcclxuICAgICAgICAgICAgYWNjZXNzVHlwZTogJ0VudGl0bGVtZW50JyxcclxuICAgICAgICAgICAgZGlzcGxheWFibGVBY2Nlc3NUeXBlOiAnRW50aXRsZW1lbnQnLFxyXG4gICAgICAgICAgICBkaXNwbGF5YWJsZU5hbWU6ICdlbnRibGFoJyxcclxuICAgICAgICAgICAgdmFsdWU6ICdlbnRibGFoJyxcclxuICAgICAgICAgICAgb3duZXI6ICdlbnRvd25lcmJsYWgnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2VudGRlc2NyaXB0aW9uYmxhaCcsXHJcbiAgICAgICAgICAgIGljb246ICdlbnRpY29uYmxhaCcsXHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnZW50YXBwbGljYXRpb25ibGFoJyxcclxuICAgICAgICAgICAgYXR0cmlidXRlOiAnZW50YXR0cmlidXRlYmxhaCcsXHJcbiAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXHJcbiAgICAgICAgICAgIHN0YXR1c0xhYmVsOiAnQWN0aXZlJyxcclxuICAgICAgICAgICAgbmF0aXZlSWRlbnRpdHk6ICduYXRpdmVibGFoJyxcclxuICAgICAgICAgICAgYWNjb3VudE5hbWU6ICdhY2NvdW50YmxhaCcsXHJcbiAgICAgICAgICAgIGluc3RhbmNlOiAnaW5zdGFuY2VibGFoJyxcclxuICAgICAgICAgICAgY29tbWVudDogJ3Ryb2xvbG9sbycsXHJcbiAgICAgICAgICAgIHJlbW92YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIFJPTEVfVE9fUkVNT1ZFOiB7XHJcbiAgICAgICAgICAgIGlkOiAnNScsXHJcbiAgICAgICAgICAgIGFjY2Vzc1R5cGU6ICdSb2xlJyxcclxuICAgICAgICAgICAgZGlzcGxheWFibGVBY2Nlc3NUeXBlOiAnUm9sZScsXHJcbiAgICAgICAgICAgIG5hbWU6ICdyZW1vdmVtZScsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlTmFtZTogJ2Rpc3BsYXlhYmxlbmFtZWJsYWgnLFxyXG4gICAgICAgICAgICBvd25lcjogJ293bmVyYmxhaCcsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb25ibGFoJyxcclxuICAgICAgICAgICAgcmlza1Njb3JlV2VpZ2h0OiA4MDAsXHJcbiAgICAgICAgICAgIHJpc2tTY29yZUNvbG9yOiAnI0ZGMDAwMCcsXHJcbiAgICAgICAgICAgIHJpc2tTY29yZVRleHRDb2xvcjogJyNGRkZGRkYnLFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdyZXF1ZXN0ZWQnLFxyXG4gICAgICAgICAgICBzdGF0dXNMYWJlbDogJ1JlcXVlc3RlZCcsXHJcbiAgICAgICAgICAgIHN1bnJpc2U6IDEzOTE2MTgzODUzODAsXHJcbiAgICAgICAgICAgIHN1bnNldDogMTM5MjIyMzE4NTM4MCxcclxuICAgICAgICAgICAgYXNzaWdubWVudElkOiAncmVtb3ZlZHJvbGVhc3NpZ25tZW50SWRCbGFoJyxcclxuICAgICAgICAgICAgYXNzaWdubWVudE5vdGU6ICdibGFoYmxhaGJsYWgnLFxyXG4gICAgICAgICAgICBjb21tZW50OiAndHJvbG9sb2xvbG8nLFxyXG4gICAgICAgICAgICByb2xlTG9jYXRpb246ICdhc3NpZ25lZCdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBJREVOVElUWV9BQ0NUX1NFTEVDVElPTjE6IHtcclxuICAgICAgICAgICAgaWRlbnRpdHlJZDogJ3RlZC50YWN1bGFyLmlkJyxcclxuICAgICAgICAgICAgaWRlbnRpdHlOYW1lOiAndGVkLnRhY3VsYXInLFxyXG4gICAgICAgICAgICBwcm92aXNpb25pbmdUYXJnZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25JZDogJ2FwcElkJyxcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ2FwcE5hbWUnLFxyXG4gICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdCb3NzJyxcclxuICAgICAgICAgICAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFjY291bnRJbmZvczogW3tcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ3RlZHNBY2NvdW50JyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ3RlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdUZWQgVGFjdWxhcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ3RlZHNBbHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAnYWx0ZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnVGVkIEEgVGFjdWxhcidcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uSWQ6ICdhcHBJZDInLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25OYW1lOiAnYXBwTmFtZTInLFxyXG4gICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdFbmRlbnR1cmVkIFNlcnZhbnQnLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDcmVhdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SW5mb3M6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6ICdsYWNreUluc3RhbmNlJyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2xhY2t5JyxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0xhY2tlcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ3NsYWNreUluc3RhbmNlJyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ3NsYWNreScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdTbGFja2VyJ1xyXG4gICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBJREVOVElUWV9BQ0NUX1NFTEVDVElPTjI6IHtcclxuICAgICAgICAgICAgaWRlbnRpdHlJZDogJ3RpbS50YWN1bGFyLmlkJyxcclxuICAgICAgICAgICAgaWRlbnRpdHlOYW1lOiAndGltLnRhY3VsYXInLFxyXG4gICAgICAgICAgICBwcm92aXNpb25pbmdUYXJnZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25JZDogJ2FwcElkJyxcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ2FwcE5hbWUnLFxyXG4gICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdCb3NzJyxcclxuICAgICAgICAgICAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFjY291bnRJbmZvczogW3tcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ3RpbXNBY2NvdW50JyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ3RpbScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdUaW0gVGFjdWxhcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ3RpbXNBbHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hdGl2ZUlkZW50aXR5OiAndGltbXknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnVGltIEUgVGFjdWxhcidcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uSWQ6ICdhcHBJZDInLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25OYW1lOiAnYXBwTmFtZTInLFxyXG4gICAgICAgICAgICAgICAgcm9sZU5hbWU6ICdFbmRlbnR1cmVkIFNlcnZhbnQnLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDcmVhdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SW5mb3M6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6ICdsYWNreUluc3RhbmNlJyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ3Rib25lJyxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1QtQm9uZSdcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogJ3NsYWNreUluc3RhbmNlJyxcclxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVJZGVudGl0eTogJ2tva28nLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnR2FtbXknXHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIEFNQklHVU9VU19BU1NJR05FRF9ST0xFMToge1xyXG4gICAgICAgICAgICBhc3NpZ25tZW50SWQ6ICdhc3NpZ25tZW50MScsXHJcbiAgICAgICAgICAgIHJvbGVJZDogJzEyMzQnLFxyXG4gICAgICAgICAgICBuYW1lOiAnYXNzaWduZWRSb2xlMScsXHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnROb3RlOiAnaSBhc3NpZ25lZCB0aGlzIG91dCBvZiBib3JlZG9tJyxcclxuICAgICAgICAgICAgYXNzaWduZXI6ICdEdW0uQm8nLFxyXG4gICAgICAgICAgICBjcmVhdGVkOiAxMzkxNjE4Mzg1MzgwXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgQU1CSUdVT1VTX0FTU0lHTkVEX1JPTEUyOiB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnRJZDogJ2Fzc2lnbm1lbnQyJyxcclxuICAgICAgICAgICAgcm9sZUlkOiAnNTY3OCcsXHJcbiAgICAgICAgICAgIG5hbWU6ICdhc3NpZ25lZFJvbGUyJyxcclxuICAgICAgICAgICAgYXNzaWdubWVudE5vdGU6ICdpIGFzc2lnbmVkIHRoaXMgb3V0IG9mIHNwaXRlJyxcclxuICAgICAgICAgICAgYXNzaWduZXI6ICdIZXJwLkRlcnAnLFxyXG4gICAgICAgICAgICBjcmVhdGVkOiAxMzkxNzE4Mzg1MzgwXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgUE9QVUxBVElPTl9TVEFUSVNUSUNTOiB7XHJcbiAgICAgICAgICAgIHRvdGFsOiAyMCxcclxuICAgICAgICAgICAgY291bnQ6IDEwLFxyXG4gICAgICAgICAgICBoaWdoUmlzazogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIFJPTEVfUE9MSUNZX1ZJT0xBVElPTl9EQVRBOiB7XHJcbiAgICAgICAgICAgIHBvbGljeU5hbWU6ICdyb2xlIHB2IHBvbGljeU5hbWUnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3JvbGUgcHYgZGVzY3JpcHRpb24nLFxyXG4gICAgICAgICAgICBydWxlTmFtZTogJ3JvbGUgcHYgcnVsZU5hbWUnLFxyXG4gICAgICAgICAgICB3b3JrSXRlbUlkOiAncm9sZSBwdiB3b3JrSXRlbUlkJyxcclxuICAgICAgICAgICAgbGVmdEJ1bmRsZXM6IFsncm9sZSBwdiBsZWZ0QnVuZGxlMScsICdyb2xlIHB2IGxlZnRCdW5kbGUyJ10sXHJcbiAgICAgICAgICAgIHJpZ2h0QnVuZGxlczogWydyb2xlIHB2IHJpZ2h0QnVuZGxlMScsICdyb2xlIHB2IHJpZ2h0QnVuZGxlMiddXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgRU5USVRMRU1FTlRfUE9MSUNZX1ZJT0xBVElPTl9EQVRBOiB7XHJcbiAgICAgICAgICAgIHBvbGljeU5hbWU6ICdlbnRpdGxlbWVudCBwdiBwb2xpY3lOYW1lJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdlbnRpdGxlbWVudCBwdiBkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgIHJ1bGVOYW1lOiAnZW50aXRsZW1lbnQgcHYgcnVsZU5hbWUnLFxyXG4gICAgICAgICAgICB3b3JrSXRlbUlkOiAnZW50aXRsZW1lbnQgcHYgd29ya0l0ZW1JZCcsXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50czogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnZW50aXRsZW1lbnQgYXBwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2VudGl0bGVtZW50IG5hbWUxJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ2VudGl0bGVtZW50IHZhbHVlMSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbGljYXRpb246ICdlbnRpdGxlbWVudCBhcHAyJyxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZW50aXRsZW1lbnQgbmFtZTInLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnZW50aXRsZW1lbnQgdmFsdWUyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgUE9MSUNZX1ZJT0xBVElPTl9ST0xFOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMTEnLFxyXG4gICAgICAgICAgICBhY2Nlc3NUeXBlOiAnUm9sZScsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlQWNjZXNzVHlwZTogJ1JvbGUnLFxyXG4gICAgICAgICAgICBuYW1lOiAncm9sZSBwdiBsZWZ0QnVuZGxlMScsXHJcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlTmFtZTogJ2xlZnR5JyxcclxuICAgICAgICAgICAgb3duZXI6ICdDaGFtaWxsaW9uYWlyZScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnanVzdCByaWRpbiBkaXJ0eScsXHJcbiAgICAgICAgICAgIHJpc2tTY29yZVdlaWdodDogODAwXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgVklPTEFUSU9OX1JFVklFV19ST0xFOiB7XHJcbiAgICAgICAgICAgIGFjY291bnROYW1lOiAnTmV3IGFjY291bnQnLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7YWxsb3dSZXF1ZXN0c1dpdGhWaW9sYXRpb25zOiBmYWxzZX0sXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50QXBwbGljYXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50TmFtZTogbnVsbCxcclxuICAgICAgICAgICAgZW50aXRsZW1lbnRSZXF1ZXN0OiBmYWxzZSxcclxuICAgICAgICAgICAgZW50aXRsZW1lbnRWYWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBIGJvcmluZyBkZXNjcmlwdGlvbiBhYm91dCBub3RoaW5nJyxcclxuICAgICAgICAgICAgaWQ6ICczMycsXHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogJ0FkZCcsXHJcbiAgICAgICAgICAgIHJvbGVJZDogJzMzMycsXHJcbiAgICAgICAgICAgIHJvbGVOYW1lOiAncm9sZSBwdiBsZWZ0QnVuZGxlMScsXHJcbiAgICAgICAgICAgIHN0YXRlOiAnUGVuZGluZydcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBQT0xJQ1lfVklPTEFUSU9OX0VOVElUTEVNRU5UOiB7XHJcbiAgICAgICAgICAgIGlkOiAnMjInLFxyXG4gICAgICAgICAgICBhY2Nlc3NUeXBlOiAnRW50aXRsZW1lbnQnLFxyXG4gICAgICAgICAgICBkaXNwbGF5YWJsZUFjY2Vzc1R5cGU6ICdFbnRpdGxlbWVudCEhJyxcclxuICAgICAgICAgICAgZGlzcGxheWFibGVOYW1lOiAnZW50aXRsZW1lbnQgdmFsdWUxJyxcclxuICAgICAgICAgICAgb3duZXI6ICdKIE1vbiR5JyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdnbyB0byB3b3JrJyxcclxuICAgICAgICAgICAgaWNvbjogJ2NoYW1wYWduZUJvdHRsZScsXHJcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uOiAnZW50aXRsZW1lbnQgYXBwMScsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogJ2VudGl0bGVtZW50IG5hbWUxJyxcclxuICAgICAgICAgICAgdmFsdWU6ICdlbnRpdGxlbWVudCB2YWx1ZTEnXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgVklPTEFUSU9OX1JFVklFV19FTlRJVExFTUVOVDoge1xyXG4gICAgICAgICAgICBhY2NvdW50TmFtZTogJ0FtYW5kYS5Sb3NzJyxcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge30sXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50QXBwbGljYXRpb246ICdlbnRpdGxlbWVudCBhcHAxJyxcclxuICAgICAgICAgICAgZW50aXRsZW1lbnROYW1lOiAnZW50aXRsZW1lbnQgbmFtZTEnLFxyXG4gICAgICAgICAgICBlbnRpdGxlbWVudFJlcXVlc3Q6IHRydWUsXHJcbiAgICAgICAgICAgIGVudGl0bGVtZW50VmFsdWU6ICdlbnRpdGxlbWVudCB2YWx1ZTEnLFxyXG4gICAgICAgICAgICBpZDogJzQ0JyxcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiAnQWRkJyxcclxuICAgICAgICAgICAgcm9sZUlkOiBudWxsLFxyXG4gICAgICAgICAgICByb2xlTmFtZTogbnVsbCxcclxuICAgICAgICAgICAgc3RhdGU6ICdQZW5kaW5nJ1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
