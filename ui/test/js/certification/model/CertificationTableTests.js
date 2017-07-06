System.register(['test/js/TestInitializer', 'certification/CertificationModule'], function (_export) {
    'use strict';

    var certificationModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_certificationCertificationModule) {
            certificationModule = _certificationCertificationModule['default'];
        }],
        execute: function () {

            describe('CertificationTable', function () {

                var CertificationTable = undefined,
                    CertificationItem = undefined;

                beforeEach(module(certificationModule));

                beforeEach(inject(function (_CertificationTable_, _CertificationItem_) {
                    CertificationTable = _CertificationTable_;
                    CertificationItem = _CertificationItem_;
                }));

                describe('constructor', function () {
                    it('goes boom if there is no config', function () {
                        expect(function () {
                            return new CertificationTable(null);
                        }).toThrow();
                    });

                    it('reads all properties from the config', function () {
                        var config = {
                            name: 'Brak!',
                            title: 'Hi my name is...',
                            columnConfigKey: 'spaceGhost',
                            sectionHeader: 'meatWad',
                            showIfEmpty: false,
                            allowBulk: true,
                            allowExport: true,
                            allowFiltering: true,
                            enableGroupBy: true,
                            statuses: ['check', 'my', 'creds'],
                            includedTypes: ['helvetica'],
                            excludedTypes: ['comic sans '],
                            preSearchFunc: jasmine.createSpy('preSearchFunc'),
                            groupByChangedFunc: jasmine.createSpy('groupByChangedFunc'),
                            tableId: 'stupidTable'
                        };

                        var table = new CertificationTable(config);
                        expect(table.name).toEqual(config.name);
                        expect(table.title).toEqual(config.title);
                        expect(table.columnConfigKey).toEqual(config.columnConfigKey);
                        expect(table.sectionHeader).toEqual(config.sectionHeader);
                        expect(table.showIfEmpty).toEqual(config.showIfEmpty);
                        expect(table.allowBulk).toEqual(config.allowBulk);
                        expect(table.allowExport).toEqual(config.allowExport);
                        expect(table.allowFiltering).toEqual(config.allowFiltering);
                        expect(table.enableGroupBy).toEqual(config.enableGroupBy);
                        expect(table.tableScope).toBeDefined();
                        expect(table.tableScope.statuses).toEqual(config.statuses);
                        expect(table.tableScope.includedTypes).toEqual(config.includedTypes);
                        expect(table.tableScope.excludedTypes).toEqual(config.excludedTypes);
                        expect(table.preSearchFunc).toEqual(config.preSearchFunc);
                        expect(table.groupByChangedFunc).toEqual(config.groupByChangedFunc);
                        expect(table.tableId).toEqual(config.tableId);
                    });

                    it('defaults properties from a minimal config', function () {
                        var table = new CertificationTable({});
                        expect(table.name).toBeUndefined();
                        expect(table.title).toBeUndefined();
                        expect(table.columnConfigKey).toBeUndefined();
                        expect(table.sectionHeader).toBeUndefined();
                        expect(table.showIfEmpty).toEqual(true);
                        expect(table.allowBulk).toEqual(false);
                        expect(table.allowExport).toEqual(false);
                        expect(table.allowFiltering).toEqual(false);
                        expect(table.enableGroupBy).toEqual(false);
                        expect(table.statuses).toBeUndefined();
                        expect(table.includedTypes).toBeUndefined();
                        expect(table.excludedTypes).toBeUndefined();
                        expect(table.tableScope).toBeDefined();
                    });
                });

                describe('getDataTableConfig()', function () {
                    it('gets a data table config', function () {
                        var table = new CertificationTable({
                            columnConfigKey: 'theKeyToLife',
                            preSearchFunc: jasmine.createSpy('preSearchFunc'),
                            groupByChangedFunc: jasmine.createSpy('groupByChangedFunc'),
                            tableId: 'stupidTable'
                        });
                        var config = table.getDataTableConfig();
                        expect(config.columnConfigKey).toEqual(table.columnConfigKey);
                        expect(config.preSearchFunc).toEqual(table.preSearchFunc);
                        expect(config.groupByChangedFunc).toEqual(table.groupByChangedFunc);
                        expect(config.tableId).toEqual(table.tableId);
                    });

                    it('returns the same data table config on subsequent calls', function () {
                        var table = new CertificationTable({
                            columnConfigKey: 'isToFollowYourDreamsAndEatLotsOfQueso'
                        });
                        var config = table.getDataTableConfig();
                        var config2 = table.getDataTableConfig();
                        expect(config).toBe(config2);
                    });
                });

                describe('getCount()', function () {
                    var itemStatusCount = undefined,
                        type1 = undefined,
                        type2 = undefined,
                        status1 = 'cool',
                        status2 = 'lame';

                    beforeEach(function () {
                        type1 = CertificationItem.Type.Bundle;
                        type2 = CertificationItem.Type.Exception;

                        itemStatusCount = {
                            getCount: jasmine.createSpy().and.callFake(function (type, status) {
                                if (type1 === type && status1 === status) {
                                    return 1;
                                }
                                if (type1 === type && status2 === status) {
                                    return 10;
                                }
                                if (type2 === type && status1 === status) {
                                    return 100;
                                }
                                if (type2 === type && status2 === status) {
                                    return 1000;
                                } else {
                                    return 0;
                                }
                            })
                        };
                    });

                    it('counts all statuses and types if there are no inclusions or exclusions', function () {
                        var table = new CertificationTable({
                            statuses: [status1, status2]
                        });
                        expect(table.getCount(itemStatusCount)).toEqual(1111);
                    });

                    it('skips excluded types', function () {
                        var table = new CertificationTable({
                            statuses: [status1, status2],
                            excludedTypes: [type1]
                        });
                        expect(table.getCount(itemStatusCount)).toEqual(1100);
                    });

                    it('only counts included types if specified', function () {
                        var table = new CertificationTable({
                            statuses: [status1, status2],
                            includedTypes: [type1]
                        });
                        expect(table.getCount(itemStatusCount)).toEqual(11);
                    });

                    it('only counts statuses in the table', function () {
                        var table = new CertificationTable({
                            statuses: [status2]
                        });
                        expect(table.getCount(itemStatusCount)).toEqual(1010);
                    });
                });

                describe('setupCheckboxModel()', function () {
                    var bulkAllowed = undefined,
                        bulkDenied = undefined;

                    beforeEach(function () {
                        bulkAllowed = new CertificationTable({
                            columnConfigKey: 'theKeyToHappiness',
                            allowBulk: true
                        });

                        bulkDenied = new CertificationTable({
                            columnConfigKey: 'happyWife',
                            allowBulk: false
                        });
                    });

                    it('creates a new selection model if bulk is allowed and the table supports it', function () {
                        expect(bulkAllowed.getDataTableConfig().checkboxMultiSelect).toBeFalsy();
                        bulkAllowed.setupCheckboxModel(true);
                        expect(bulkAllowed.getDataTableConfig().checkboxMultiSelect).toBeTruthy();
                    });

                    it('does not create selection model if bulk is not allowed', function () {
                        bulkAllowed.setupCheckboxModel(false);
                        expect(bulkAllowed.getDataTableConfig().checkboxMultiSelect).toBeFalsy();
                    });

                    it('nulls previous selection model if bulk is no longer allowed', function () {
                        bulkAllowed.setupCheckboxModel(true);
                        expect(bulkAllowed.getDataTableConfig().checkboxMultiSelect).toBeTruthy();

                        bulkAllowed.setupCheckboxModel(false);
                        expect(bulkAllowed.getDataTableConfig().checkboxMultiSelect).toBeNull();
                    });

                    it('does not create selection model if the table does not support it', function () {
                        bulkDenied.setupCheckboxModel(true);
                        expect(bulkDenied.getDataTableConfig().checkboxMultiSelect).toBeFalsy();
                    });
                });

                describe('setEntity', function () {
                    it('sets the entity', function () {
                        var table = new CertificationTable({}),
                            entity = { id: 'person' };
                        expect(table.tableScope.entity).not.toBeDefined();
                        table.setEntity(entity);
                        expect(table.tableScope.entity).toEqual(entity);
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlcnRpZmljYXRpb24vbW9kZWwvQ2VydGlmaWNhdGlvblRhYmxlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLHNDQUFzQyxVQUFVLFNBQVM7SUFDakc7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLG1DQUFtQztZQUN6RixzQkFBc0Isa0NBQWtDOztRQUU1RCxTQUFTLFlBQVk7O1lBTDdCLFNBQVMsc0JBQXNCLFlBQU07O2dCQUVqQyxJQUFJLHFCQUFrQjtvQkFBRSxvQkFBaUI7O2dCQUV6QyxXQUFXLE9BQU87O2dCQUVsQixXQUFXLE9BQU8sVUFBQyxzQkFBc0IscUJBQXdCO29CQUM3RCxxQkFBcUI7b0JBQ3JCLG9CQUFvQjs7O2dCQUd4QixTQUFTLGVBQWUsWUFBTTtvQkFDMUIsR0FBRyxtQ0FBbUMsWUFBTTt3QkFDeEMsT0FBTyxZQUFBOzRCQVNTLE9BVEgsSUFBSSxtQkFBbUI7MkJBQU87OztvQkFHL0MsR0FBRyx3Q0FBd0MsWUFBTTt3QkFDN0MsSUFBSSxTQUFTOzRCQUNULE1BQU07NEJBQ04sT0FBTzs0QkFDUCxpQkFBaUI7NEJBQ2pCLGVBQWU7NEJBQ2YsYUFBYTs0QkFDYixXQUFXOzRCQUNYLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixlQUFlOzRCQUNmLFVBQVUsQ0FBRSxTQUFTLE1BQU07NEJBQzNCLGVBQWUsQ0FBRTs0QkFDakIsZUFBZSxDQUFFOzRCQUNqQixlQUFlLFFBQVEsVUFBVTs0QkFDakMsb0JBQW9CLFFBQVEsVUFBVTs0QkFDdEMsU0FBUzs7O3dCQUdiLElBQUksUUFBUSxJQUFJLG1CQUFtQjt3QkFDbkMsT0FBTyxNQUFNLE1BQU0sUUFBUSxPQUFPO3dCQUNsQyxPQUFPLE1BQU0sT0FBTyxRQUFRLE9BQU87d0JBQ25DLE9BQU8sTUFBTSxpQkFBaUIsUUFBUSxPQUFPO3dCQUM3QyxPQUFPLE1BQU0sZUFBZSxRQUFRLE9BQU87d0JBQzNDLE9BQU8sTUFBTSxhQUFhLFFBQVEsT0FBTzt3QkFDekMsT0FBTyxNQUFNLFdBQVcsUUFBUSxPQUFPO3dCQUN2QyxPQUFPLE1BQU0sYUFBYSxRQUFRLE9BQU87d0JBQ3pDLE9BQU8sTUFBTSxnQkFBZ0IsUUFBUSxPQUFPO3dCQUM1QyxPQUFPLE1BQU0sZUFBZSxRQUFRLE9BQU87d0JBQzNDLE9BQU8sTUFBTSxZQUFZO3dCQUN6QixPQUFPLE1BQU0sV0FBVyxVQUFVLFFBQVEsT0FBTzt3QkFDakQsT0FBTyxNQUFNLFdBQVcsZUFBZSxRQUFRLE9BQU87d0JBQ3RELE9BQU8sTUFBTSxXQUFXLGVBQWUsUUFBUSxPQUFPO3dCQUN0RCxPQUFPLE1BQU0sZUFBZSxRQUFRLE9BQU87d0JBQzNDLE9BQU8sTUFBTSxvQkFBb0IsUUFBUSxPQUFPO3dCQUNoRCxPQUFPLE1BQU0sU0FBUyxRQUFRLE9BQU87OztvQkFHekMsR0FBRyw2Q0FBNkMsWUFBTTt3QkFDbEQsSUFBSSxRQUFRLElBQUksbUJBQW1CO3dCQUNuQyxPQUFPLE1BQU0sTUFBTTt3QkFDbkIsT0FBTyxNQUFNLE9BQU87d0JBQ3BCLE9BQU8sTUFBTSxpQkFBaUI7d0JBQzlCLE9BQU8sTUFBTSxlQUFlO3dCQUM1QixPQUFPLE1BQU0sYUFBYSxRQUFRO3dCQUNsQyxPQUFPLE1BQU0sV0FBVyxRQUFRO3dCQUNoQyxPQUFPLE1BQU0sYUFBYSxRQUFRO3dCQUNsQyxPQUFPLE1BQU0sZ0JBQWdCLFFBQVE7d0JBQ3JDLE9BQU8sTUFBTSxlQUFlLFFBQVE7d0JBQ3BDLE9BQU8sTUFBTSxVQUFVO3dCQUN2QixPQUFPLE1BQU0sZUFBZTt3QkFDNUIsT0FBTyxNQUFNLGVBQWU7d0JBQzVCLE9BQU8sTUFBTSxZQUFZOzs7O2dCQUlqQyxTQUFTLHdCQUF3QixZQUFNO29CQUNuQyxHQUFHLDRCQUE0QixZQUFNO3dCQUNqQyxJQUFJLFFBQVEsSUFBSSxtQkFBbUI7NEJBQy9CLGlCQUFpQjs0QkFDakIsZUFBZSxRQUFRLFVBQVU7NEJBQ2pDLG9CQUFvQixRQUFRLFVBQVU7NEJBQ3RDLFNBQVM7O3dCQUViLElBQUksU0FBUyxNQUFNO3dCQUNuQixPQUFPLE9BQU8saUJBQWlCLFFBQVEsTUFBTTt3QkFDN0MsT0FBTyxPQUFPLGVBQWUsUUFBUSxNQUFNO3dCQUMzQyxPQUFPLE9BQU8sb0JBQW9CLFFBQVEsTUFBTTt3QkFDaEQsT0FBTyxPQUFPLFNBQVMsUUFBUSxNQUFNOzs7b0JBR3pDLEdBQUcsMERBQTBELFlBQU07d0JBQy9ELElBQUksUUFBUSxJQUFJLG1CQUFtQjs0QkFDL0IsaUJBQWlCOzt3QkFFckIsSUFBSSxTQUFTLE1BQU07d0JBQ25CLElBQUksVUFBVSxNQUFNO3dCQUNwQixPQUFPLFFBQVEsS0FBSzs7OztnQkFJNUIsU0FBUyxjQUFjLFlBQU07b0JBQ3pCLElBQUksa0JBQWU7d0JBQUUsUUFBSzt3QkFBRSxRQUFLO3dCQUM3QixVQUFVO3dCQUNWLFVBQVU7O29CQUVkLFdBQVcsWUFBTTt3QkFDYixRQUFRLGtCQUFrQixLQUFLO3dCQUMvQixRQUFRLGtCQUFrQixLQUFLOzt3QkFFL0Isa0JBQWtCOzRCQUNkLFVBQVUsUUFBUSxZQUFZLElBQUksU0FBUyxVQUFDLE1BQU0sUUFBVztnQ0FDekQsSUFBSSxVQUFXLFFBQVUsWUFBWSxRQUFTO29DQUMxQyxPQUFPOztnQ0FFWCxJQUFJLFVBQVcsUUFBVSxZQUFZLFFBQVM7b0NBQzFDLE9BQU87O2dDQUVYLElBQUssVUFBVSxRQUFVLFlBQVksUUFBUztvQ0FDMUMsT0FBTzs7Z0NBRVgsSUFBSyxVQUFVLFFBQVUsWUFBWSxRQUFTO29DQUMxQyxPQUFPO3VDQUVOO29DQUNELE9BQU87Ozs7OztvQkFNdkIsR0FBRywwRUFBMEUsWUFBTTt3QkFDL0UsSUFBSSxRQUFRLElBQUksbUJBQW1COzRCQUMvQixVQUFVLENBQUUsU0FBUzs7d0JBRXpCLE9BQU8sTUFBTSxTQUFTLGtCQUFrQixRQUFROzs7b0JBR3BELEdBQUcsd0JBQXdCLFlBQU07d0JBQzdCLElBQUksUUFBUSxJQUFJLG1CQUFtQjs0QkFDL0IsVUFBVSxDQUFFLFNBQVM7NEJBQ3JCLGVBQWUsQ0FBRTs7d0JBRXJCLE9BQU8sTUFBTSxTQUFTLGtCQUFrQixRQUFROzs7b0JBR3BELEdBQUcsMkNBQTJDLFlBQU07d0JBQ2hELElBQUksUUFBUSxJQUFJLG1CQUFtQjs0QkFDL0IsVUFBVSxDQUFFLFNBQVM7NEJBQ3JCLGVBQWUsQ0FBRTs7d0JBRXJCLE9BQU8sTUFBTSxTQUFTLGtCQUFrQixRQUFROzs7b0JBR3BELEdBQUcscUNBQXFDLFlBQU07d0JBQzFDLElBQUksUUFBUSxJQUFJLG1CQUFtQjs0QkFDL0IsVUFBVSxDQUFFOzt3QkFFaEIsT0FBTyxNQUFNLFNBQVMsa0JBQWtCLFFBQVE7Ozs7Z0JBSXhELFNBQVMsd0JBQXdCLFlBQU07b0JBQ25DLElBQUksY0FBVzt3QkFBRSxhQUFVOztvQkFFM0IsV0FBVyxZQUFNO3dCQUNiLGNBQWMsSUFBSSxtQkFBbUI7NEJBQ2pDLGlCQUFpQjs0QkFDakIsV0FBVzs7O3dCQUdmLGFBQWEsSUFBSSxtQkFBbUI7NEJBQ2hDLGlCQUFpQjs0QkFDakIsV0FBVzs7OztvQkFJbkIsR0FBRyw4RUFBOEUsWUFBTTt3QkFDbkYsT0FBTyxZQUFZLHFCQUFxQixxQkFBcUI7d0JBQzdELFlBQVksbUJBQW1CO3dCQUMvQixPQUFPLFlBQVkscUJBQXFCLHFCQUFxQjs7O29CQUdqRSxHQUFHLDBEQUEwRCxZQUFNO3dCQUMvRCxZQUFZLG1CQUFtQjt3QkFDL0IsT0FBTyxZQUFZLHFCQUFxQixxQkFBcUI7OztvQkFHakUsR0FBRywrREFBK0QsWUFBTTt3QkFDcEUsWUFBWSxtQkFBbUI7d0JBQy9CLE9BQU8sWUFBWSxxQkFBcUIscUJBQXFCOzt3QkFFN0QsWUFBWSxtQkFBbUI7d0JBQy9CLE9BQU8sWUFBWSxxQkFBcUIscUJBQXFCOzs7b0JBR2pFLEdBQUcsb0VBQW9FLFlBQU07d0JBQ3pFLFdBQVcsbUJBQW1CO3dCQUM5QixPQUFPLFdBQVcscUJBQXFCLHFCQUFxQjs7OztnQkFJcEUsU0FBUyxhQUFhLFlBQU07b0JBQ3hCLEdBQUcsbUJBQW1CLFlBQU07d0JBQ3hCLElBQUksUUFBUSxJQUFJLG1CQUFtQjs0QkFDL0IsU0FBUyxFQUFFLElBQUk7d0JBQ25CLE9BQU8sTUFBTSxXQUFXLFFBQVEsSUFBSTt3QkFDcEMsTUFBTSxVQUFVO3dCQUNoQixPQUFPLE1BQU0sV0FBVyxRQUFRLFFBQVE7Ozs7OztHQWtCakQiLCJmaWxlIjoiY2VydGlmaWNhdGlvbi9tb2RlbC9DZXJ0aWZpY2F0aW9uVGFibGVUZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xyXG5pbXBvcnQgY2VydGlmaWNhdGlvbk1vZHVsZSBmcm9tICdjZXJ0aWZpY2F0aW9uL0NlcnRpZmljYXRpb25Nb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0NlcnRpZmljYXRpb25UYWJsZScsICgpID0+IHtcclxuXHJcbiAgICBsZXQgQ2VydGlmaWNhdGlvblRhYmxlLCBDZXJ0aWZpY2F0aW9uSXRlbTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKG1vZHVsZShjZXJ0aWZpY2F0aW9uTW9kdWxlKSk7XHJcblxyXG4gICAgYmVmb3JlRWFjaChpbmplY3QoKF9DZXJ0aWZpY2F0aW9uVGFibGVfLCBfQ2VydGlmaWNhdGlvbkl0ZW1fKSA9PiB7XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvblRhYmxlID0gX0NlcnRpZmljYXRpb25UYWJsZV87XHJcbiAgICAgICAgQ2VydGlmaWNhdGlvbkl0ZW0gPSBfQ2VydGlmaWNhdGlvbkl0ZW1fO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsICgpID0+IHtcclxuICAgICAgICBpdCgnZ29lcyBib29tIGlmIHRoZXJlIGlzIG5vIGNvbmZpZycsICgpID0+IHtcclxuICAgICAgICAgICAgZXhwZWN0KCgpID0+IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGUobnVsbCkpLnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JlYWRzIGFsbCBwcm9wZXJ0aWVzIGZyb20gdGhlIGNvbmZpZycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdCcmFrIScsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hpIG15IG5hbWUgaXMuLi4nLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uQ29uZmlnS2V5OiAnc3BhY2VHaG9zdCcsXHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uSGVhZGVyOiAnbWVhdFdhZCcsXHJcbiAgICAgICAgICAgICAgICBzaG93SWZFbXB0eTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0J1bGs6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0V4cG9ydDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFsbG93RmlsdGVyaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlR3JvdXBCeTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbICdjaGVjaycsICdteScsICdjcmVkcycgXSxcclxuICAgICAgICAgICAgICAgIGluY2x1ZGVkVHlwZXM6IFsgJ2hlbHZldGljYScgXSxcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVkVHlwZXM6IFsgJ2NvbWljIHNhbnMgJ10sXHJcbiAgICAgICAgICAgICAgICBwcmVTZWFyY2hGdW5jOiBqYXNtaW5lLmNyZWF0ZVNweSgncHJlU2VhcmNoRnVuYycpLFxyXG4gICAgICAgICAgICAgICAgZ3JvdXBCeUNoYW5nZWRGdW5jOiBqYXNtaW5lLmNyZWF0ZVNweSgnZ3JvdXBCeUNoYW5nZWRGdW5jJyksXHJcbiAgICAgICAgICAgICAgICB0YWJsZUlkOiAnc3R1cGlkVGFibGUnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFibGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlKGNvbmZpZyk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5uYW1lKS50b0VxdWFsKGNvbmZpZy5uYW1lKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnRpdGxlKS50b0VxdWFsKGNvbmZpZy50aXRsZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5jb2x1bW5Db25maWdLZXkpLnRvRXF1YWwoY29uZmlnLmNvbHVtbkNvbmZpZ0tleSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5zZWN0aW9uSGVhZGVyKS50b0VxdWFsKGNvbmZpZy5zZWN0aW9uSGVhZGVyKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnNob3dJZkVtcHR5KS50b0VxdWFsKGNvbmZpZy5zaG93SWZFbXB0eSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5hbGxvd0J1bGspLnRvRXF1YWwoY29uZmlnLmFsbG93QnVsayk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5hbGxvd0V4cG9ydCkudG9FcXVhbChjb25maWcuYWxsb3dFeHBvcnQpO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUuYWxsb3dGaWx0ZXJpbmcpLnRvRXF1YWwoY29uZmlnLmFsbG93RmlsdGVyaW5nKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmVuYWJsZUdyb3VwQnkpLnRvRXF1YWwoY29uZmlnLmVuYWJsZUdyb3VwQnkpO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUudGFibGVTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnRhYmxlU2NvcGUuc3RhdHVzZXMpLnRvRXF1YWwoY29uZmlnLnN0YXR1c2VzKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnRhYmxlU2NvcGUuaW5jbHVkZWRUeXBlcykudG9FcXVhbChjb25maWcuaW5jbHVkZWRUeXBlcyk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS50YWJsZVNjb3BlLmV4Y2x1ZGVkVHlwZXMpLnRvRXF1YWwoY29uZmlnLmV4Y2x1ZGVkVHlwZXMpO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUucHJlU2VhcmNoRnVuYykudG9FcXVhbChjb25maWcucHJlU2VhcmNoRnVuYyk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5ncm91cEJ5Q2hhbmdlZEZ1bmMpLnRvRXF1YWwoY29uZmlnLmdyb3VwQnlDaGFuZ2VkRnVuYyk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS50YWJsZUlkKS50b0VxdWFsKGNvbmZpZy50YWJsZUlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RlZmF1bHRzIHByb3BlcnRpZXMgZnJvbSBhIG1pbmltYWwgY29uZmlnJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGFibGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlKHt9KTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLm5hbWUpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnRpdGxlKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5jb2x1bW5Db25maWdLZXkpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnNlY3Rpb25IZWFkZXIpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnNob3dJZkVtcHR5KS50b0VxdWFsKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUuYWxsb3dCdWxrKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmFsbG93RXhwb3J0KS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmFsbG93RmlsdGVyaW5nKS50b0VxdWFsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmVuYWJsZUdyb3VwQnkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUuc3RhdHVzZXMpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmluY2x1ZGVkVHlwZXMpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLmV4Y2x1ZGVkVHlwZXMpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHRhYmxlLnRhYmxlU2NvcGUpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RGF0YVRhYmxlQ29uZmlnKCknLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ2dldHMgYSBkYXRhIHRhYmxlIGNvbmZpZycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWdLZXk6ICd0aGVLZXlUb0xpZmUnLFxyXG4gICAgICAgICAgICAgICAgcHJlU2VhcmNoRnVuYzogamFzbWluZS5jcmVhdGVTcHkoJ3ByZVNlYXJjaEZ1bmMnKSxcclxuICAgICAgICAgICAgICAgIGdyb3VwQnlDaGFuZ2VkRnVuYzogamFzbWluZS5jcmVhdGVTcHkoJ2dyb3VwQnlDaGFuZ2VkRnVuYycpLFxyXG4gICAgICAgICAgICAgICAgdGFibGVJZDogJ3N0dXBpZFRhYmxlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IHRhYmxlLmdldERhdGFUYWJsZUNvbmZpZygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnLmNvbHVtbkNvbmZpZ0tleSkudG9FcXVhbCh0YWJsZS5jb2x1bW5Db25maWdLZXkpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnLnByZVNlYXJjaEZ1bmMpLnRvRXF1YWwodGFibGUucHJlU2VhcmNoRnVuYyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb25maWcuZ3JvdXBCeUNoYW5nZWRGdW5jKS50b0VxdWFsKHRhYmxlLmdyb3VwQnlDaGFuZ2VkRnVuYyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb25maWcudGFibGVJZCkudG9FcXVhbCh0YWJsZS50YWJsZUlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNhbWUgZGF0YSB0YWJsZSBjb25maWcgb24gc3Vic2VxdWVudCBjYWxscycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWdLZXk6ICdpc1RvRm9sbG93WW91ckRyZWFtc0FuZEVhdExvdHNPZlF1ZXNvJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IHRhYmxlLmdldERhdGFUYWJsZUNvbmZpZygpO1xyXG4gICAgICAgICAgICBsZXQgY29uZmlnMiA9IHRhYmxlLmdldERhdGFUYWJsZUNvbmZpZygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29uZmlnKS50b0JlKGNvbmZpZzIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2dldENvdW50KCknLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW1TdGF0dXNDb3VudCwgdHlwZTEsIHR5cGUyLFxyXG4gICAgICAgICAgICBzdGF0dXMxID0gJ2Nvb2wnLFxyXG4gICAgICAgICAgICBzdGF0dXMyID0gJ2xhbWUnO1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgdHlwZTEgPSBDZXJ0aWZpY2F0aW9uSXRlbS5UeXBlLkJ1bmRsZTtcclxuICAgICAgICAgICAgdHlwZTIgPSBDZXJ0aWZpY2F0aW9uSXRlbS5UeXBlLkV4Y2VwdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1TdGF0dXNDb3VudCA9IHtcclxuICAgICAgICAgICAgICAgIGdldENvdW50OiBqYXNtaW5lLmNyZWF0ZVNweSgpLmFuZC5jYWxsRmFrZSgodHlwZSwgc3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0eXBlMSA9PT0gdHlwZSkgJiYgKHN0YXR1czEgPT09IHN0YXR1cykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgodHlwZTEgPT09IHR5cGUpICYmIChzdGF0dXMyID09PSBzdGF0dXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0eXBlMiA9PT0gdHlwZSkgJiYgKHN0YXR1czEgPT09IHN0YXR1cykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0eXBlMiA9PT0gdHlwZSkgJiYgKHN0YXR1czIgPT09IHN0YXR1cykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY291bnRzIGFsbCBzdGF0dXNlcyBhbmQgdHlwZXMgaWYgdGhlcmUgYXJlIG5vIGluY2x1c2lvbnMgb3IgZXhjbHVzaW9ucycsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWyBzdGF0dXMxLCBzdGF0dXMyIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5nZXRDb3VudChpdGVtU3RhdHVzQ291bnQpKS50b0VxdWFsKDExMTEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnc2tpcHMgZXhjbHVkZWQgdHlwZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0YWJsZSA9IG5ldyBDZXJ0aWZpY2F0aW9uVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFsgc3RhdHVzMSwgc3RhdHVzMiBdLFxyXG4gICAgICAgICAgICAgICAgZXhjbHVkZWRUeXBlczogWyB0eXBlMSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUuZ2V0Q291bnQoaXRlbVN0YXR1c0NvdW50KSkudG9FcXVhbCgxMTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ29ubHkgY291bnRzIGluY2x1ZGVkIHR5cGVzIGlmIHNwZWNpZmllZCcsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWyBzdGF0dXMxLCBzdGF0dXMyIF0sXHJcbiAgICAgICAgICAgICAgICBpbmNsdWRlZFR5cGVzOiBbIHR5cGUxIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5nZXRDb3VudChpdGVtU3RhdHVzQ291bnQpKS50b0VxdWFsKDExKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ29ubHkgY291bnRzIHN0YXR1c2VzIGluIHRoZSB0YWJsZScsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWyBzdGF0dXMyIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS5nZXRDb3VudChpdGVtU3RhdHVzQ291bnQpKS50b0VxdWFsKDEwMTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3NldHVwQ2hlY2tib3hNb2RlbCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCBidWxrQWxsb3dlZCwgYnVsa0RlbmllZDtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGJ1bGtBbGxvd2VkID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWdLZXk6ICd0aGVLZXlUb0hhcHBpbmVzcycsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0J1bGs6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBidWxrRGVuaWVkID0gbmV3IENlcnRpZmljYXRpb25UYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Db25maWdLZXk6ICdoYXBweVdpZmUnLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dCdWxrOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NyZWF0ZXMgYSBuZXcgc2VsZWN0aW9uIG1vZGVsIGlmIGJ1bGsgaXMgYWxsb3dlZCBhbmQgdGhlIHRhYmxlIHN1cHBvcnRzIGl0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBleHBlY3QoYnVsa0FsbG93ZWQuZ2V0RGF0YVRhYmxlQ29uZmlnKCkuY2hlY2tib3hNdWx0aVNlbGVjdCkudG9CZUZhbHN5KCk7XHJcbiAgICAgICAgICAgIGJ1bGtBbGxvd2VkLnNldHVwQ2hlY2tib3hNb2RlbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGJ1bGtBbGxvd2VkLmdldERhdGFUYWJsZUNvbmZpZygpLmNoZWNrYm94TXVsdGlTZWxlY3QpLnRvQmVUcnV0aHkoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IGNyZWF0ZSBzZWxlY3Rpb24gbW9kZWwgaWYgYnVsayBpcyBub3QgYWxsb3dlZCcsICgpID0+IHtcclxuICAgICAgICAgICAgYnVsa0FsbG93ZWQuc2V0dXBDaGVja2JveE1vZGVsKGZhbHNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGJ1bGtBbGxvd2VkLmdldERhdGFUYWJsZUNvbmZpZygpLmNoZWNrYm94TXVsdGlTZWxlY3QpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnbnVsbHMgcHJldmlvdXMgc2VsZWN0aW9uIG1vZGVsIGlmIGJ1bGsgaXMgbm8gbG9uZ2VyIGFsbG93ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGJ1bGtBbGxvd2VkLnNldHVwQ2hlY2tib3hNb2RlbCh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGJ1bGtBbGxvd2VkLmdldERhdGFUYWJsZUNvbmZpZygpLmNoZWNrYm94TXVsdGlTZWxlY3QpLnRvQmVUcnV0aHkoKTtcclxuXHJcbiAgICAgICAgICAgIGJ1bGtBbGxvd2VkLnNldHVwQ2hlY2tib3hNb2RlbChmYWxzZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChidWxrQWxsb3dlZC5nZXREYXRhVGFibGVDb25maWcoKS5jaGVja2JveE11bHRpU2VsZWN0KS50b0JlTnVsbCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZG9lcyBub3QgY3JlYXRlIHNlbGVjdGlvbiBtb2RlbCBpZiB0aGUgdGFibGUgZG9lcyBub3Qgc3VwcG9ydCBpdCcsICgpID0+IHtcclxuICAgICAgICAgICAgYnVsa0RlbmllZC5zZXR1cENoZWNrYm94TW9kZWwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChidWxrRGVuaWVkLmdldERhdGFUYWJsZUNvbmZpZygpLmNoZWNrYm94TXVsdGlTZWxlY3QpLnRvQmVGYWxzeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3NldEVudGl0eScsICgpID0+IHtcclxuICAgICAgICBpdCgnc2V0cyB0aGUgZW50aXR5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGFibGUgPSBuZXcgQ2VydGlmaWNhdGlvblRhYmxlKHt9KSxcclxuICAgICAgICAgICAgICAgIGVudGl0eSA9IHsgaWQ6ICdwZXJzb24nIH07XHJcbiAgICAgICAgICAgIGV4cGVjdCh0YWJsZS50YWJsZVNjb3BlLmVudGl0eSkubm90LnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIHRhYmxlLnNldEVudGl0eShlbnRpdHkpO1xyXG4gICAgICAgICAgICBleHBlY3QodGFibGUudGFibGVTY29wZS5lbnRpdHkpLnRvRXF1YWwoZW50aXR5KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
