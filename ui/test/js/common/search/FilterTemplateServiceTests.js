System.register(['test/js/TestInitializer', 'common/search/SearchModule'], function (_export) {

    /**
     * Tests for the FilterTemplateService.
     */
    'use strict';

    var searchModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonSearchSearchModule) {
            searchModule = _commonSearchSearchModule['default'];
        }],
        execute: function () {
            describe('FilterTemplateService', function () {
                var filterTemplateService, stringFilter, numberFilter, dateFilter, identityFilter, identityMultiFilter, allowedValuesFilter, booleanFilter, unknownFilter, columnFilter, multiValuedColumnFilter, templateFuncFilter;

                beforeEach(module(searchModule));

                /**
                 * Setup the FilterTemplateService and initialize test data.
                 */
                beforeEach(inject(function (_filterTemplateService_, Filter) {
                    filterTemplateService = _filterTemplateService_;

                    stringFilter = new Filter({
                        property: 'stringProp',
                        label: 'String',
                        dataType: Filter.DATA_TYPE_STRING
                    });
                    numberFilter = new Filter({
                        property: 'numberProp',
                        label: 'Number',
                        dataType: Filter.DATA_TYPE_NUMBER
                    });
                    dateFilter = new Filter({
                        property: 'dateProp',
                        label: 'Date',
                        dataType: Filter.DATA_TYPE_DATE,
                        allowedOperations: [{
                            displayName: 'Equals',
                            id: 'Equals'
                        }, {
                            displayName: 'GreaterThan',
                            id: 'GreaterThan'
                        }]
                    });
                    identityFilter = new Filter({
                        property: 'identityProp',
                        label: 'Identity',
                        dataType: Filter.DATA_TYPE_IDENTITY,
                        attributes: {
                            suggestContext: 'bros',
                            suggestId: 'broSuggest'
                        }
                    });
                    identityMultiFilter = new Filter({
                        property: 'identityMultiProp',
                        label: 'Some Identities',
                        dataType: Filter.DATA_TYPE_IDENTITY,
                        multiValued: true,
                        attributes: {
                            suggestContext: 'yomomma',
                            suggestId: 'itsyomomma'
                        }
                    });

                    allowedValuesFilter = new Filter({
                        property: 'allowedStringProp',
                        label: 'Allowed',
                        dataType: Filter.DATA_TYPE_STRING,
                        allowedValues: [{
                            displayName: 'foo',
                            id: 'bar'
                        }, {
                            displayName: 'baz',
                            id: 'xyz'
                        }]
                    });
                    booleanFilter = new Filter({
                        property: 'booleanProp',
                        label: 'Boolean',
                        dataType: Filter.DATA_TYPE_BOOLEAN
                    });
                    unknownFilter = new Filter({
                        property: 'unknownProp',
                        label: 'What tha?!',
                        dataType: 'pool'
                    });
                    columnFilter = new Filter({
                        property: 'Identity.column',
                        label: 'Column',
                        dataType: Filter.DATA_TYPE_COLUMN,
                        attributes: {
                            isLcm: true,
                            lcmAction: 'Request Access',
                            suggestClass: 'Identity',
                            suggestColumn: 'column'
                        }
                    });
                    multiValuedColumnFilter = new Filter({
                        property: 'Identity.column',
                        label: 'Column',
                        dataType: Filter.DATA_TYPE_COLUMN,
                        multiValued: true,
                        attributes: {
                            suggestClass: 'Identity',
                            suggestColumn: 'column'
                        }
                    });

                    templateFuncFilter = new Filter({
                        property: 'funky',
                        templateFunc: jasmine.createSpy('templateFunc').and.callFake(function (id) {
                            return '<fake-thing id="' + id + '" />';
                        })
                    });
                }));

                describe('getFilterTemplate', function () {
                    /**
                     * Get the requested filter template and verify that it has strings that
                     * match the expectedStrings array.
                     */
                    function testFilter(filter, expectedStrings) {
                        var template = filterTemplateService.getFilterTemplate(filter, 'id', filter.label),
                            i;
                        for (i = 0; i < expectedStrings.length; i++) {
                            expect(template.indexOf(expectedStrings[i])).toBeGreaterThan(-1);
                        }
                    }

                    it('returns a text input for a string filter', function () {
                        testFilter(stringFilter, ['type="text"', 'id="id"']);
                    });

                    it('returns a number input for a number filter', function () {
                        testFilter(numberFilter, ['type="number"', 'id="id"']);
                    });

                    it('returns a date input with a dropdown for allowed operations for a date filter', function () {
                        var alt = 'alt="' + dateFilter.label + '"';
                        testFilter(dateFilter, ['sp-datepicker', 'sp-datepicker-id="id"', 'sp-dropdown', alt]);
                    });

                    it('returns an identity suggest for an identity filter', function () {
                        testFilter(identityFilter, ['sp-object-suggest', 'sp-object-suggest-id="broSuggest"', 'sp-object-suggest-context="bros"']);
                    });

                    it('returns an identity multi suggest for multivalued identity filter', function () {
                        testFilter(identityMultiFilter, ['sp-object-multi-suggest', 'sp-object-multi-suggest-class="sailpoint.object.Identity"', 'sp-object-multi-suggest-id="itsyomomma"', 'sp-object-multi-suggest-context="yomomma"']);
                    });

                    it('returns a object suggest for a single-valued allowed value filter', function () {
                        allowedValuesFilter.multiValued = false;
                        testFilter(allowedValuesFilter, ['sp-object-suggest', 'sp-object-suggest-allowed-values="spFilter.allowedValues"']);
                    });

                    it('returns a object multi-suggest for a multi-valued allowed value filter', function () {
                        allowedValuesFilter.multiValued = true;
                        testFilter(allowedValuesFilter, ['sp-object-multi-suggest', 'sp-object-multi-suggest-allowed-values="spFilter.allowedValues"']);
                    });

                    it('returns a boolean dropdown for a boolean filter', function () {
                        testFilter(booleanFilter, ['sp-boolean-dropdown', 'sp-button-id="id"', 'sp-button-aria-label="' + booleanFilter.label + '"']);
                    });

                    it('returns the correct object suggest for a column filter', function () {
                        testFilter(columnFilter, ['sp-object-suggest', 'sp-object-suggest-search-service="filterItemCtrl.columnSuggestService"', 'sp-object-suggest-params="{{spFilter.attributes}}"']);
                    });

                    it('returns the correct object suggest for a multi-valued column filter', function () {
                        testFilter(multiValuedColumnFilter, ['sp-object-multi-suggest', 'sp-object-multi-suggest-search-service="filterItemCtrl.columnSuggestService"', 'sp-object-multi-suggest-params="{{spFilter.attributes}}"']);
                    });

                    it('calls and returns from templateFunc if defined', function () {
                        testFilter(templateFuncFilter, ['fake-thing', 'id="id"']);
                        expect(templateFuncFilter.templateFunc).toHaveBeenCalled();
                    });

                    it('explodes with a null filter', function () {
                        expect(function () {
                            filterTemplateService.getFilterTemplate(null, 'id');
                        }).toThrow();
                    });

                    it('explodes with a null id', function () {
                        expect(function () {
                            filterTemplateService.getFilterTemplate(stringFilter, null);
                        }).toThrow();
                    });

                    it('explodes for an unhandled filter type', function () {
                        expect(function () {
                            filterTemplateService.getFilterTemplate(unknownFilter);
                        }).toThrow();
                    });
                });

                describe('getInputId', function () {
                    it('explodes with a null filter', function () {
                        expect(function () {
                            filterTemplateService.getInputId(null, 'id');
                        }).toThrow();
                    });

                    it('explodes with a null id', function () {
                        expect(function () {
                            filterTemplateService.getInputId(stringFilter, null);
                        }).toThrow();
                    });

                    it('returns the same id for non-identity filters', function () {
                        expect(filterTemplateService.getInputId(stringFilter, 'someId')).toEqual('someId');
                        expect(filterTemplateService.getInputId(booleanFilter, 'otherId')).toEqual('otherId');
                    });

                    it('returns the suggest id for identity filters', function () {
                        expect(filterTemplateService.getInputId(identityFilter, 'someId')).toEqual('broSuggest');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9zZWFyY2gvRmlsdGVyVGVtcGxhdGVTZXJ2aWNlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLCtCQUErQixVQUFVLFNBQVM7Ozs7O0lBQTlGOztJQU9JLElBQUk7SUFDSixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwyQkFBMkI7WUFDakYsZUFBZSwwQkFBMEI7O1FBRTdDLFNBQVMsWUFBWTtZQUo3QixTQUFTLHlCQUF5QixZQUFXO2dCQUN6QyxJQUFJLHVCQUNBLGNBQ0EsY0FDQSxZQUNBLGdCQUNBLHFCQUNBLHFCQUNBLGVBQ0EsZUFDQSxjQUNBLHlCQUNBOztnQkFFSixXQUFXLE9BQU87Ozs7O2dCQUtsQixXQUFXLE9BQU8sVUFBUyx5QkFBeUIsUUFBUTtvQkFDeEQsd0JBQXdCOztvQkFFeEIsZUFBZSxJQUFJLE9BQU87d0JBQ3RCLFVBQVU7d0JBQ1YsT0FBTzt3QkFDUCxVQUFVLE9BQU87O29CQUVyQixlQUFlLElBQUksT0FBTzt3QkFDdEIsVUFBVTt3QkFDVixPQUFPO3dCQUNQLFVBQVUsT0FBTzs7b0JBRXJCLGFBQWEsSUFBSSxPQUFPO3dCQUNwQixVQUFVO3dCQUNWLE9BQU87d0JBQ1AsVUFBVSxPQUFPO3dCQUNqQixtQkFBbUIsQ0FBQzs0QkFDaEIsYUFBYTs0QkFDYixJQUFJOzJCQUNMOzRCQUNDLGFBQWE7NEJBQ2IsSUFBSTs7O29CQUdaLGlCQUFpQixJQUFJLE9BQU87d0JBQ3hCLFVBQVU7d0JBQ1YsT0FBTzt3QkFDUCxVQUFVLE9BQU87d0JBQ2pCLFlBQVk7NEJBQ1IsZ0JBQWdCOzRCQUNoQixXQUFXOzs7b0JBR25CLHNCQUFzQixJQUFJLE9BQU87d0JBQzdCLFVBQVU7d0JBQ1YsT0FBTzt3QkFDUCxVQUFVLE9BQU87d0JBQ2pCLGFBQWE7d0JBQ2IsWUFBWTs0QkFDUixnQkFBZ0I7NEJBQ2hCLFdBQVc7Ozs7b0JBSW5CLHNCQUFzQixJ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RywrQkFBK0IsWUFBVzt3QkFDekMsT0FBTyxZQUFXOzRCQUFFLHNCQUFzQixXQUFXLE1BQU07MkJBQVU7OztvQkFHekUsR0FBRywyQkFBMkIsWUFBVzt3QkFDckMsT0FBTyxZQUFXOzRCQUFFLHNCQUFzQixXQUFXLGNBQWM7MkJBQVU7OztvQkFHakYsR0FBRyxnREFBZ0QsWUFBVzt3QkFDMUQsT0FBTyxzQkFBc0IsV0FBVyxjQUFjLFdBQVcsUUFBUTt3QkFDekUsT0FBTyxzQkFBc0IsV0FBVyxlQUFlLFlBQVksUUFBUTs7O29CQUcvRSxHQUFHLCtDQUErQyxZQUFXO3dCQUN6RCxPQUFPLHNCQUFzQixXQUFXLGdCQUFnQixXQUFXLFFBQVE7Ozs7OztHQUFwRiIsImZpbGUiOiJjb21tb24vc2VhcmNoL0ZpbHRlclRlbXBsYXRlU2VydmljZVRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICd0ZXN0L2pzL1Rlc3RJbml0aWFsaXplcic7XHJcbmltcG9ydCBzZWFyY2hNb2R1bGUgZnJvbSAnY29tbW9uL3NlYXJjaC9TZWFyY2hNb2R1bGUnO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGZvciB0aGUgRmlsdGVyVGVtcGxhdGVTZXJ2aWNlLlxyXG4gKi9cclxuZGVzY3JpYmUoJ0ZpbHRlclRlbXBsYXRlU2VydmljZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGZpbHRlclRlbXBsYXRlU2VydmljZSxcclxuICAgICAgICBzdHJpbmdGaWx0ZXIsXHJcbiAgICAgICAgbnVtYmVyRmlsdGVyLFxyXG4gICAgICAgIGRhdGVGaWx0ZXIsXHJcbiAgICAgICAgaWRlbnRpdHlGaWx0ZXIsXHJcbiAgICAgICAgaWRlbnRpdHlNdWx0aUZpbHRlcixcclxuICAgICAgICBhbGxvd2VkVmFsdWVzRmlsdGVyLFxyXG4gICAgICAgIGJvb2xlYW5GaWx0ZXIsXHJcbiAgICAgICAgdW5rbm93bkZpbHRlcixcclxuICAgICAgICBjb2x1bW5GaWx0ZXIsXHJcbiAgICAgICAgbXVsdGlWYWx1ZWRDb2x1bW5GaWx0ZXIsXHJcbiAgICAgICAgdGVtcGxhdGVGdW5jRmlsdGVyO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHNlYXJjaE1vZHVsZSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgdGhlIEZpbHRlclRlbXBsYXRlU2VydmljZSBhbmQgaW5pdGlhbGl6ZSB0ZXN0IGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF9maWx0ZXJUZW1wbGF0ZVNlcnZpY2VfLCBGaWx0ZXIpIHtcclxuICAgICAgICBmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UgPSBfZmlsdGVyVGVtcGxhdGVTZXJ2aWNlXztcclxuXHJcbiAgICAgICAgc3RyaW5nRmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnc3RyaW5nUHJvcCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnU3RyaW5nJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfU1RSSU5HXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbnVtYmVyRmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnbnVtYmVyUHJvcCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnTnVtYmVyJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfTlVNQkVSXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGF0ZUZpbHRlciA9IG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2RhdGVQcm9wJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdEYXRlJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfREFURSxcclxuICAgICAgICAgICAgYWxsb3dlZE9wZXJhdGlvbnM6IFt7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0VxdWFscycsXHJcbiAgICAgICAgICAgICAgICBpZDogJ0VxdWFscydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdHcmVhdGVyVGhhbicsXHJcbiAgICAgICAgICAgICAgICBpZDogJ0dyZWF0ZXJUaGFuJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlkZW50aXR5RmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnaWRlbnRpdHlQcm9wJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdJZGVudGl0eScsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBGaWx0ZXIuREFUQV9UWVBFX0lERU5USVRZLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0Q29udGV4dDogJ2Jyb3MnLFxyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdElkOiAnYnJvU3VnZ2VzdCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlkZW50aXR5TXVsdGlGaWx0ZXIgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgcHJvcGVydHk6ICdpZGVudGl0eU11bHRpUHJvcCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnU29tZSBJZGVudGl0aWVzJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfSURFTlRJVFksXHJcbiAgICAgICAgICAgIG11bHRpVmFsdWVkOiB0cnVlLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0Q29udGV4dDogJ3lvbW9tbWEnLFxyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdElkOiAnaXRzeW9tb21tYSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhbGxvd2VkVmFsdWVzRmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnYWxsb3dlZFN0cmluZ1Byb3AnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0FsbG93ZWQnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogRmlsdGVyLkRBVEFfVFlQRV9TVFJJTkcsXHJcbiAgICAgICAgICAgIGFsbG93ZWRWYWx1ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ2ZvbycsXHJcbiAgICAgICAgICAgICAgICBpZDogJ2JhcidcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdiYXonLFxyXG4gICAgICAgICAgICAgICAgaWQ6ICd4eXonXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYm9vbGVhbkZpbHRlciA9IG5ldyBGaWx0ZXIoe1xyXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2Jvb2xlYW5Qcm9wJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdCb29sZWFuJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IEZpbHRlci5EQVRBX1RZUEVfQk9PTEVBTlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHVua25vd25GaWx0ZXIgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgcHJvcGVydHk6ICd1bmtub3duUHJvcCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnV2hhdCB0aGE/IScsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAncG9vbCdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb2x1bW5GaWx0ZXIgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgcHJvcGVydHk6ICdJZGVudGl0eS5jb2x1bW4nLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0NvbHVtbicsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBGaWx0ZXIuREFUQV9UWVBFX0NPTFVNTixcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgaXNMY206IHRydWUsXHJcbiAgICAgICAgICAgICAgICBsY21BY3Rpb246ICdSZXF1ZXN0IEFjY2VzcycsXHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0Q2xhc3M6ICdJZGVudGl0eScsXHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0Q29sdW1uOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXVsdGlWYWx1ZWRDb2x1bW5GaWx0ZXIgPSBuZXcgRmlsdGVyKHtcclxuICAgICAgICAgICAgcHJvcGVydHk6ICdJZGVudGl0eS5jb2x1bW4nLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0NvbHVtbicsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBGaWx0ZXIuREFUQV9UWVBFX0NPTFVNTixcclxuICAgICAgICAgICAgbXVsdGlWYWx1ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3RDbGFzczogJ0lkZW50aXR5JyxcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3RDb2x1bW46ICdjb2x1bW4nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGVtcGxhdGVGdW5jRmlsdGVyID0gbmV3IEZpbHRlcih7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiAnZnVua3knLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZUZ1bmM6IGphc21pbmUuY3JlYXRlU3B5KCd0ZW1wbGF0ZUZ1bmMnKS5hbmQuY2FsbEZha2UoKGlkKSA9PiBgPGZha2UtdGhpbmcgaWQ9XCIke2lkfVwiIC8+YClcclxuICAgICAgICB9KTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0RmlsdGVyVGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIHJlcXVlc3RlZCBmaWx0ZXIgdGVtcGxhdGUgYW5kIHZlcmlmeSB0aGF0IGl0IGhhcyBzdHJpbmdzIHRoYXRcclxuICAgICAgICAgKiBtYXRjaCB0aGUgZXhwZWN0ZWRTdHJpbmdzIGFycmF5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RGaWx0ZXIoZmlsdGVyLCBleHBlY3RlZFN0cmluZ3MpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLmdldEZpbHRlclRlbXBsYXRlKGZpbHRlciwgJ2lkJywgZmlsdGVyLmxhYmVsKSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBleHBlY3RlZFN0cmluZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5pbmRleE9mKGV4cGVjdGVkU3RyaW5nc1tpXSkpLnRvQmVHcmVhdGVyVGhhbigtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGEgdGV4dCBpbnB1dCBmb3IgYSBzdHJpbmcgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIoc3RyaW5nRmlsdGVyLCBbICd0eXBlPVwidGV4dFwiJywgJ2lkPVwiaWRcIicgXSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIGEgbnVtYmVyIGlucHV0IGZvciBhIG51bWJlciBmaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGVzdEZpbHRlcihudW1iZXJGaWx0ZXIsIFsgJ3R5cGU9XCJudW1iZXJcIicsICdpZD1cImlkXCInIF0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBhIGRhdGUgaW5wdXQgd2l0aCBhIGRyb3Bkb3duIGZvciBhbGxvd2VkIG9wZXJhdGlvbnMgZm9yIGEgZGF0ZSBmaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFsdCA9ICdhbHQ9XCInICsgZGF0ZUZpbHRlci5sYWJlbCArICdcIic7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIoZGF0ZUZpbHRlciwgWyAnc3AtZGF0ZXBpY2tlcicsICdzcC1kYXRlcGlja2VyLWlkPVwiaWRcIicsICdzcC1kcm9wZG93bicsIGFsdCBdKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYW4gaWRlbnRpdHkgc3VnZ2VzdCBmb3IgYW4gaWRlbnRpdHkgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIoaWRlbnRpdHlGaWx0ZXIsIFsgJ3NwLW9iamVjdC1zdWdnZXN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Atb2JqZWN0LXN1Z2dlc3QtaWQ9XCJicm9TdWdnZXN0XCInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzcC1vYmplY3Qtc3VnZ2VzdC1jb250ZXh0PVwiYnJvc1wiJyBdKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYW4gaWRlbnRpdHkgbXVsdGkgc3VnZ2VzdCBmb3IgbXVsdGl2YWx1ZWQgaWRlbnRpdHkgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIoaWRlbnRpdHlNdWx0aUZpbHRlciwgWyAnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QnLFxyXG4gICAgICAgICAgICAgICAgJ3NwLW9iamVjdC1tdWx0aS1zdWdnZXN0LWNsYXNzPVwic2FpbHBvaW50Lm9iamVjdC5JZGVudGl0eVwiJyxcclxuICAgICAgICAgICAgICAgICdzcC1vYmplY3QtbXVsdGktc3VnZ2VzdC1pZD1cIml0c3lvbW9tbWFcIicsXHJcbiAgICAgICAgICAgICAgICAnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QtY29udGV4dD1cInlvbW9tbWFcIiddKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ3JldHVybnMgYSBvYmplY3Qgc3VnZ2VzdCBmb3IgYSBzaW5nbGUtdmFsdWVkIGFsbG93ZWQgdmFsdWUgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFsbG93ZWRWYWx1ZXNGaWx0ZXIubXVsdGlWYWx1ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVzdEZpbHRlcihhbGxvd2VkVmFsdWVzRmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgWyAnc3Atb2JqZWN0LXN1Z2dlc3QnLCAnc3Atb2JqZWN0LXN1Z2dlc3QtYWxsb3dlZC12YWx1ZXM9XCJzcEZpbHRlci5hbGxvd2VkVmFsdWVzXCInIF0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBhIG9iamVjdCBtdWx0aS1zdWdnZXN0IGZvciBhIG11bHRpLXZhbHVlZCBhbGxvd2VkIHZhbHVlIGZpbHRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhbGxvd2VkVmFsdWVzRmlsdGVyLm11bHRpVmFsdWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGVzdEZpbHRlcihhbGxvd2VkVmFsdWVzRmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgWyAnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QnLCAnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QtYWxsb3dlZC12YWx1ZXM9XCJzcEZpbHRlci5hbGxvd2VkVmFsdWVzXCInIF0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyBhIGJvb2xlYW4gZHJvcGRvd24gZm9yIGEgYm9vbGVhbiBmaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGVzdEZpbHRlcihib29sZWFuRmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgWyAnc3AtYm9vbGVhbi1kcm9wZG93bicsICdzcC1idXR0b24taWQ9XCJpZFwiJywgJ3NwLWJ1dHRvbi1hcmlhLWxhYmVsPVwiJyArIGJvb2xlYW5GaWx0ZXIubGFiZWwgKyAnXCInIF0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0aGUgY29ycmVjdCBvYmplY3Qgc3VnZ2VzdCBmb3IgYSBjb2x1bW4gZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIoY29sdW1uRmlsdGVyLCBbJ3NwLW9iamVjdC1zdWdnZXN0JyxcclxuICAgICAgICAgICAgICAgICdzcC1vYmplY3Qtc3VnZ2VzdC1zZWFyY2gtc2VydmljZT1cImZpbHRlckl0ZW1DdHJsLmNvbHVtblN1Z2dlc3RTZXJ2aWNlXCInLFxyXG4gICAgICAgICAgICAgICAgJ3NwLW9iamVjdC1zdWdnZXN0LXBhcmFtcz1cInt7c3BGaWx0ZXIuYXR0cmlidXRlc319XCInXSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBjb3JyZWN0IG9iamVjdCBzdWdnZXN0IGZvciBhIG11bHRpLXZhbHVlZCBjb2x1bW4gZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIobXVsdGlWYWx1ZWRDb2x1bW5GaWx0ZXIsIFsnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QnLFxyXG4gICAgICAgICAgICAgICAgJ3NwLW9iamVjdC1tdWx0aS1zdWdnZXN0LXNlYXJjaC1zZXJ2aWNlPVwiZmlsdGVySXRlbUN0cmwuY29sdW1uU3VnZ2VzdFNlcnZpY2VcIicsXHJcbiAgICAgICAgICAgICAgICAnc3Atb2JqZWN0LW11bHRpLXN1Z2dlc3QtcGFyYW1zPVwie3tzcEZpbHRlci5hdHRyaWJ1dGVzfX1cIiddKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2NhbGxzIGFuZCByZXR1cm5zIGZyb20gdGVtcGxhdGVGdW5jIGlmIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RGaWx0ZXIodGVtcGxhdGVGdW5jRmlsdGVyLCBbJ2Zha2UtdGhpbmcnLCAnaWQ9XCJpZFwiJ10pO1xyXG4gICAgICAgICAgICBleHBlY3QodGVtcGxhdGVGdW5jRmlsdGVyLnRlbXBsYXRlRnVuYykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZXhwbG9kZXMgd2l0aCBhIG51bGwgZmlsdGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLmdldEZpbHRlclRlbXBsYXRlKG51bGwsICdpZCcpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdleHBsb2RlcyB3aXRoIGEgbnVsbCBpZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7IGZpbHRlclRlbXBsYXRlU2VydmljZS5nZXRGaWx0ZXJUZW1wbGF0ZShzdHJpbmdGaWx0ZXIsIG51bGwpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdleHBsb2RlcyBmb3IgYW4gdW5oYW5kbGVkIGZpbHRlciB0eXBlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHsgZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLmdldEZpbHRlclRlbXBsYXRlKHVua25vd25GaWx0ZXIpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZ2V0SW5wdXRJZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdleHBsb2RlcyB3aXRoIGEgbnVsbCBmaWx0ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UuZ2V0SW5wdXRJZChudWxsLCAnaWQnKTsgfSkudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnZXhwbG9kZXMgd2l0aCBhIG51bGwgaWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkgeyBmaWx0ZXJUZW1wbGF0ZVNlcnZpY2UuZ2V0SW5wdXRJZChzdHJpbmdGaWx0ZXIsIG51bGwpOyB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzYW1lIGlkIGZvciBub24taWRlbnRpdHkgZmlsdGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLmdldElucHV0SWQoc3RyaW5nRmlsdGVyLCAnc29tZUlkJykpLnRvRXF1YWwoJ3NvbWVJZCcpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLmdldElucHV0SWQoYm9vbGVhbkZpbHRlciwgJ290aGVySWQnKSkudG9FcXVhbCgnb3RoZXJJZCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgncmV0dXJucyB0aGUgc3VnZ2VzdCBpZCBmb3IgaWRlbnRpdHkgZmlsdGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZmlsdGVyVGVtcGxhdGVTZXJ2aWNlLmdldElucHV0SWQoaWRlbnRpdHlGaWx0ZXIsICdzb21lSWQnKSkudG9FcXVhbCgnYnJvU3VnZ2VzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
