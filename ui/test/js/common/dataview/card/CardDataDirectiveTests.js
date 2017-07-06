System.register(['test/js/TestInitializer', 'common/dataview/card/CardModule'], function (_export) {

    /**
    * CardDataDirective tests.
    *
    * We should end up with multiple spans that display the cardData according to the column config.
    *
    * The column config describes what order the data should be displayed, the label to be used, and an optional renderer
    * for custom rendering.
    *
    * 1. Compile the directive with the proper scope setup.
    * 2. Check that the resulting element shows the proper data in the manner described by the column config.
    *
    */
    'use strict';

    var cardModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonDataviewCardCardModule) {
            cardModule = _commonDataviewCardCardModule['default'];
        }],
        execute: function () {
            describe('CardDataDirective', function () {

                var $scope,
                    $compile,
                    ColumnConfig,
                    identity,
                    colConfigs,
                    createElement = function (model, colConfigs, compile, scope) {
                    var element;
                    scope.cardData = model;
                    scope.colConfigs = colConfigs;
                    element = angular.element('<div><div sp-card-data="true" sp-data="cardData" sp-col-configs="colConfigs" /></div>');
                    compile(element)(scope);
                    scope.$apply();
                    return element;
                },
                    colConfig1 = {
                    dataIndex: 'name',
                    label: 'Username'
                },
                    colConfig2 = {
                    dataIndex: 'displayableName',
                    label: 'Name'
                },
                    colConfig3 = {
                    dataIndex: 'id',
                    fieldOnly: true
                },
                    identityData = {
                    id: '2',
                    name: 'kbob',
                    displayName: 'Kay Bob',
                    managerName: 'Jim Bob',
                    location: 'Austin',
                    department: 'Agriculture'
                };

                function getDisplayedLabel(label) {
                    return label + 'ui_label_separator';
                }

                function MockIdentity(mockIdentity) {
                    this.name = mockIdentity.name;
                    this.id = mockIdentity.id;
                    this.displayName = mockIdentity.displayName;

                    this.getName = function () {
                        return this.name;
                    };

                    this.getDisplayableName = function () {
                        return this.displayName;
                    };

                    this.getId = function () {
                        return this.id;
                    };
                }

                beforeEach(module(cardModule));

                beforeEach(inject(function (_$rootScope_, _$compile_, _ColumnConfig_) {
                    $scope = _$rootScope_;
                    $compile = _$compile_;
                    ColumnConfig = _ColumnConfig_;
                    identity = new MockIdentity(identityData);
                    colConfigs = [new ColumnConfig(colConfig1), new ColumnConfig(colConfig2), new ColumnConfig(colConfig3)];
                }));

                /**
                 * Make sure the only the data configured by the column config shows.
                 */
                it('should show the correct identity card info', function () {

                    var element = createElement(identity, colConfigs, $compile, $scope),
                        cardDataLabels = element.find('.sp-card-data-item-label'),
                        cardDataValues = element.find('.sp-card-data-item-value'),
                        expectedResults = [{ label: 'Username', value: 'kbob' }, { label: 'Name', value: 'Kay Bob' }],
                        i;

                    // Should have the same number of items as colConfigs (minus any fieldOnly configs)
                    expect(cardDataValues.length).toEqual(expectedResults.length);
                    expect(cardDataLabels.length).toEqual(expectedResults.length);

                    for (i = 0; i < expectedResults.length; i++) {
                        expect(cardDataLabels[i].innerText.trim()).toEqual(getDisplayedLabel(expectedResults[i].label));
                        expect(cardDataValues[i].innerText.trim()).toEqual(expectedResults[i].value);
                    }
                });

                it('should update the display when the model is changed', function () {
                    var element = createElement(identity, colConfigs, $compile, $scope),
                        cardDataValues = element.find('.sp-card-data-item-value'),
                        updatedName = 'Updated';
                    identity.name = updatedName;
                    $scope.$apply();
                    expect(cardDataValues[0].innerText.trim()).toEqual(updatedName);
                });

                it('should not show columns with no data', function () {
                    var element = createElement({ name: 'testname' }, colConfigs, $compile, $scope),
                        cardDataLabels = element.find('.sp-card-data-item-label'),
                        cardDataValues = element.find('.sp-card-data-item-value'),
                        expectedResults = [{ label: 'Username', value: 'testname' }],
                        i;

                    // Should have the same number of items as colConfigs (minus any fieldOnly configs)
                    expect(cardDataValues.length).toEqual(expectedResults.length);
                    expect(cardDataLabels.length).toEqual(expectedResults.length);

                    for (i = 0; i < expectedResults.length; i++) {
                        expect(cardDataLabels[i].innerText.trim()).toEqual(getDisplayedLabel(expectedResults[i].label));
                        expect(cardDataValues[i].innerText.trim()).toEqual(expectedResults[i].value);
                    }
                });

                it('should render html renderers correctly', function () {
                    var element = createElement({ score: 1000 }, [new ColumnConfig({
                        dataIndex: 'score',
                        label: 'baz',
                        renderer: 'risk'
                    })], $compile, $scope);
                    expect(element.find('.risk-highest').length).toEqual(1);
                });

                it('should render the view more button when more than max column configs (5)', function () {
                    var element = createElement({ score: 1000 }, [new ColumnConfig({
                        dataIndex: 'a',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'b',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'c',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'd',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'e',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'f',
                        label: 'baz',
                        renderer: 'risk'
                    })], $compile, $scope);
                    expect(element.find('.btn-view-more').length).toEqual(1);
                });

                it('should not render the view more button when same as max column configs (5)', function () {
                    var element = createElement({ score: 1000 }, [new ColumnConfig({
                        dataIndex: 'a',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'b',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'c',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'd',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'e',
                        label: 'baz',
                        renderer: 'risk'
                    })], $compile, $scope);
                    expect(element.find('.btn-view-more').length).toEqual(0);
                });

                it('should not render the view more button when less than max column configs (5)', function () {
                    var element = createElement({ score: 1000 }, [new ColumnConfig({
                        dataIndex: 'a',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'b',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'c',
                        label: 'baz',
                        renderer: 'risk'
                    }), new ColumnConfig({
                        dataIndex: 'd',
                        label: 'baz',
                        renderer: 'risk'
                    })], $compile, $scope);
                    expect(element.find('.btn-view-more').length).toEqual(0);
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9kYXRhdmlldy9jYXJkL0NhcmREYXRhRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLG9DQUFvQyxVQUFVLFNBQVM7Ozs7Ozs7Ozs7Ozs7O0lBQW5HOztJQWdCSSxJQUFJO0lBQ0osT0FBTztRQUNILFNBQVMsQ0FBQyxVQUFVLHdCQUF3QixJQUFJLFVBQVUsK0JBQStCO1lBQ3JGLGFBQWEsOEJBQThCOztRQUUvQyxTQUFTLFlBQVk7WUFKN0IsU0FBUyxxQkFBcUIsWUFBVzs7Z0JBRXJDLElBQUk7b0JBQVE7b0JBQVU7b0JBQWM7b0JBQVU7b0JBQzFDLGdCQUFnQixVQUFTLE9BQU8sWUFBWSxTQUFTLE9BQU87b0JBQ3hELElBQUk7b0JBQ0osTUFBTSxXQUFXO29CQUNqQixNQUFNLGFBQWE7b0JBQ25CLFVBQVUsUUFBUSxRQUNkO29CQUNKLFFBQVEsU0FBUztvQkFDakIsTUFBTTtvQkFDTixPQUFPOztvQkFFWCxhQUFhO29CQUNULFdBQVc7b0JBQ1gsT0FBTzs7b0JBQ1QsYUFBYTtvQkFDWCxXQUFXO29CQUNYLE9BQU87O29CQUNSLGFBQWE7b0JBQ1osV0FBVztvQkFDWCxXQUFXOztvQkFDWixlQUFlO29CQUNkLElBQUk7b0JBQ0osTUFBTTtvQkFDTixhQUFhO29CQUNiLGFBQWE7b0JBQ2IsVUFBVTtvQkFDVixZQUFZOzs7Z0JBR3BCLFNBQVMsa0JBQWtCLE9BQU87b0JBQzlCLE9BQU8sUUFBUTs7O2dCQUduQixTQUFTLGFBQWEsY0FBYztvQkFDaEMsS0FBSyxPQUFPLGFBQWE7b0JBQ3pCLEtBQUssS0FBSyxhQUFhO29CQUN2QixLQUFLLGNBQWMsYUFBYTs7b0JBRWhDLEtBQUssVUFBVSxZQUFXO3dCQUN0QixPQUFPLEtBQUs7OztvQkFHaEIsS0FBSyxxQkFBcUIsWUFBVzt3QkFDakMsT0FBTyxLQUFLOzs7b0JBR2hCLEtBQUssUUFBUSxZQUFXO3dCQUNwQixPQUFPLEtB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Q1gsT0FBTzt3QkFDUCxVQUFVO3dCQUNYLElBQUksYUFBYTt3QkFDaEIsV0FBVzt3QkFDWCxPQUFPO3dCQUNQLFVBQVU7d0JBQ1gsSUFBSSxhQUFhO3dCQUNoQixXQUFXO3dCQUNYLE9BQU87d0JBQ1AsVUFBVTt3QkFDWCxJQUFJLGFBQWE7d0JBQ2hCLFdBQVc7d0JBQ1gsT0FBTzt3QkFDUCxVQUFVO3dCQUNYLElBQUksYUFBYTt3QkFDaEIsV0FBVzt3QkFDWCxPQUFPO3dCQUNQLFVBQVU7eUJBRWQsVUFDQTtvQkFDSixPQUFPLFFBQVEsS0FBSyxrQkFBa0IsUUFBUSxRQUFROzs7Z0JBRzFELEdBQUcsZ0ZBQWdGLFlBQVc7b0JBQzFGLElBQUksVUFBVSxjQUFjLEVBQUMsT0FBTyxRQUNoQyxDQUFDLElBQUksYUFBYTt3QkFDZCxXQUFXO3dCQUNYLE9BQU87d0JBQ1AsVUFBVTt3QkFDWCxJQUFJLGFBQWE7d0JBQ2hCLFdBQVc7d0JBQ1gsT0FBTzt3QkFDUCxVQUFVO3dCQUNYLElBQUksYUFBYTt3QkFDaEIsV0FBVzt3QkFDWCxPQUFPO3dCQUNQLFVBQVU7d0JBQ1gsSUFBSSxhQUFhO3dCQUNoQixXQUFXO3dCQUNYLE9BQU87d0JBQ1AsVUFBVTt5QkFFZCxVQUNBO29CQUNKLE9BQU8sUUFBUSxLQUFLLGtCQUFrQixRQUFRLFFBQVE7Ozs7O0dBTjNEIiwiZmlsZSI6ImNvbW1vbi9kYXRhdmlldy9jYXJkL0NhcmREYXRhRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAndGVzdC9qcy9UZXN0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IGNhcmRNb2R1bGUgZnJvbSAnY29tbW9uL2RhdGF2aWV3L2NhcmQvQ2FyZE1vZHVsZSc7XG5cbi8qKlxuKiBDYXJkRGF0YURpcmVjdGl2ZSB0ZXN0cy5cbipcbiogV2Ugc2hvdWxkIGVuZCB1cCB3aXRoIG11bHRpcGxlIHNwYW5zIHRoYXQgZGlzcGxheSB0aGUgY2FyZERhdGEgYWNjb3JkaW5nIHRvIHRoZSBjb2x1bW4gY29uZmlnLlxuKlxuKiBUaGUgY29sdW1uIGNvbmZpZyBkZXNjcmliZXMgd2hhdCBvcmRlciB0aGUgZGF0YSBzaG91bGQgYmUgZGlzcGxheWVkLCB0aGUgbGFiZWwgdG8gYmUgdXNlZCwgYW5kIGFuIG9wdGlvbmFsIHJlbmRlcmVyXG4qIGZvciBjdXN0b20gcmVuZGVyaW5nLlxuKlxuKiAxLiBDb21waWxlIHRoZSBkaXJlY3RpdmUgd2l0aCB0aGUgcHJvcGVyIHNjb3BlIHNldHVwLlxuKiAyLiBDaGVjayB0aGF0IHRoZSByZXN1bHRpbmcgZWxlbWVudCBzaG93cyB0aGUgcHJvcGVyIGRhdGEgaW4gdGhlIG1hbm5lciBkZXNjcmliZWQgYnkgdGhlIGNvbHVtbiBjb25maWcuXG4qXG4qL1xuZGVzY3JpYmUoJ0NhcmREYXRhRGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgJHNjb3BlLCAkY29tcGlsZSwgQ29sdW1uQ29uZmlnLCBpZGVudGl0eSwgY29sQ29uZmlncyxcbiAgICAgICAgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKG1vZGVsLCBjb2xDb25maWdzLCBjb21waWxlLCBzY29wZSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICBzY29wZS5jYXJkRGF0YSA9IG1vZGVsO1xuICAgICAgICAgICAgc2NvcGUuY29sQ29uZmlncyA9IGNvbENvbmZpZ3M7XG4gICAgICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KFxuICAgICAgICAgICAgICAgICc8ZGl2PjxkaXYgc3AtY2FyZC1kYXRhPVwidHJ1ZVwiIHNwLWRhdGE9XCJjYXJkRGF0YVwiIHNwLWNvbC1jb25maWdzPVwiY29sQ29uZmlnc1wiIC8+PC9kaXY+Jyk7XG4gICAgICAgICAgICBjb21waWxlKGVsZW1lbnQpKHNjb3BlKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbENvbmZpZzEgPSB7XG4gICAgICAgICAgICBkYXRhSW5kZXg6ICduYW1lJyxcbiAgICAgICAgICAgIGxhYmVsOiAnVXNlcm5hbWUnXG4gICAgICAgIH0sY29sQ29uZmlnMiA9IHtcbiAgICAgICAgICAgIGRhdGFJbmRleDogJ2Rpc3BsYXlhYmxlTmFtZScsXG4gICAgICAgICAgICBsYWJlbDogJ05hbWUnXG4gICAgICAgIH0sIGNvbENvbmZpZzMgPSB7XG4gICAgICAgICAgICBkYXRhSW5kZXg6ICdpZCcsXG4gICAgICAgICAgICBmaWVsZE9ubHk6IHRydWVcbiAgICAgICAgfSwgaWRlbnRpdHlEYXRhID0ge1xuICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgIG5hbWU6ICdrYm9iJyxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnS2F5IEJvYicsXG4gICAgICAgICAgICBtYW5hZ2VyTmFtZTogJ0ppbSBCb2InLFxuICAgICAgICAgICAgbG9jYXRpb246ICdBdXN0aW4nLFxuICAgICAgICAgICAgZGVwYXJ0bWVudDogJ0FncmljdWx0dXJlJ1xuICAgICAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RGlzcGxheWVkTGFiZWwobGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIGxhYmVsICsgJ3VpX2xhYmVsX3NlcGFyYXRvcic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTW9ja0lkZW50aXR5KG1vY2tJZGVudGl0eSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBtb2NrSWRlbnRpdHkubmFtZTtcbiAgICAgICAgdGhpcy5pZCA9IG1vY2tJZGVudGl0eS5pZDtcbiAgICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IG1vY2tJZGVudGl0eS5kaXNwbGF5TmFtZTtcblxuICAgICAgICB0aGlzLmdldE5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXREaXNwbGF5YWJsZU5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlOYW1lO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0SWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGJlZm9yZUVhY2gobW9kdWxlKGNhcmRNb2R1bGUpKTtcblxuICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKF8kcm9vdFNjb3BlXywgXyRjb21waWxlXywgX0NvbHVtbkNvbmZpZ18pIHtcbiAgICAgICAgJHNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgICAgICAkY29tcGlsZSA9IF8kY29tcGlsZV87XG4gICAgICAgIENvbHVtbkNvbmZpZyA9IF9Db2x1bW5Db25maWdfO1xuICAgICAgICBpZGVudGl0eSA9IG5ldyBNb2NrSWRlbnRpdHkoaWRlbnRpdHlEYXRhKTtcbiAgICAgICAgY29sQ29uZmlncyA9IFtcbiAgICAgICAgICAgICAgICBuZXcgQ29sdW1uQ29uZmlnKGNvbENvbmZpZzEpLFxuICAgICAgICAgICAgICAgIG5ldyBDb2x1bW5Db25maWcoY29sQ29uZmlnMiksXG4gICAgICAgICAgICAgICAgbmV3IENvbHVtbkNvbmZpZyhjb2xDb25maWczKVxuICAgICAgICAgICAgXTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBNYWtlIHN1cmUgdGhlIG9ubHkgdGhlIGRhdGEgY29uZmlndXJlZCBieSB0aGUgY29sdW1uIGNvbmZpZyBzaG93cy5cbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHNob3cgdGhlIGNvcnJlY3QgaWRlbnRpdHkgY2FyZCBpbmZvJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGlkZW50aXR5LCBjb2xDb25maWdzLCAkY29tcGlsZSwgJHNjb3BlKSxcbiAgICAgICAgICAgIGNhcmREYXRhTGFiZWxzID0gZWxlbWVudC5maW5kKCcuc3AtY2FyZC1kYXRhLWl0ZW0tbGFiZWwnKSxcbiAgICAgICAgICAgIGNhcmREYXRhVmFsdWVzID0gZWxlbWVudC5maW5kKCcuc3AtY2FyZC1kYXRhLWl0ZW0tdmFsdWUnKSxcbiAgICAgICAgICAgIGV4cGVjdGVkUmVzdWx0cyA9IFtcbiAgICAgICAgICAgICAgICB7bGFiZWw6ICdVc2VybmFtZScsIHZhbHVlOiAna2JvYid9LFxuICAgICAgICAgICAgICAgIHtsYWJlbDogJ05hbWUnLCB2YWx1ZTogJ0theSBCb2InfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGk7XG5cbiAgICAgICAgLy8gU2hvdWxkIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIGl0ZW1zIGFzIGNvbENvbmZpZ3MgKG1pbnVzIGFueSBmaWVsZE9ubHkgY29uZmlncylcbiAgICAgICAgZXhwZWN0KGNhcmREYXRhVmFsdWVzLmxlbmd0aCkudG9FcXVhbChleHBlY3RlZFJlc3VsdHMubGVuZ3RoKTtcbiAgICAgICAgZXhwZWN0KGNhcmREYXRhTGFiZWxzLmxlbmd0aCkudG9FcXVhbChleHBlY3RlZFJlc3VsdHMubGVuZ3RoKTtcblxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBleHBlY3RlZFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGV4cGVjdChjYXJkRGF0YUxhYmVsc1tpXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKGdldERpc3BsYXllZExhYmVsKGV4cGVjdGVkUmVzdWx0c1tpXS5sYWJlbCkpO1xuICAgICAgICAgICAgZXhwZWN0KGNhcmREYXRhVmFsdWVzW2ldLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoZXhwZWN0ZWRSZXN1bHRzW2ldLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdGhlIGRpc3BsYXkgd2hlbiB0aGUgbW9kZWwgaXMgY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoaWRlbnRpdHksIGNvbENvbmZpZ3MsICRjb21waWxlLCAkc2NvcGUpLFxuICAgICAgICAgICAgY2FyZERhdGFWYWx1ZXMgPSBlbGVtZW50LmZpbmQoJy5zcC1jYXJkLWRhdGEtaXRlbS12YWx1ZScpLFxuICAgICAgICAgICAgdXBkYXRlZE5hbWUgPSAnVXBkYXRlZCc7XG4gICAgICAgIGlkZW50aXR5Lm5hbWUgPSB1cGRhdGVkTmFtZTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICBleHBlY3QoY2FyZERhdGFWYWx1ZXNbMF0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbCh1cGRhdGVkTmFtZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGNvbHVtbnMgd2l0aCBubyBkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCh7bmFtZTogJ3Rlc3RuYW1lJ30sIGNvbENvbmZpZ3MsICRjb21waWxlLCAkc2NvcGUpLFxuICAgICAgICAgICAgY2FyZERhdGFMYWJlbHMgPSBlbGVtZW50LmZpbmQoJy5zcC1jYXJkLWRhdGEtaXRlbS1sYWJlbCcpLFxuICAgICAgICAgICAgY2FyZERhdGFWYWx1ZXMgPSBlbGVtZW50LmZpbmQoJy5zcC1jYXJkLWRhdGEtaXRlbS12YWx1ZScpLFxuICAgICAgICAgICAgZXhwZWN0ZWRSZXN1bHRzID0gW1xuICAgICAgICAgICAgICAgIHtsYWJlbDogJ1VzZXJuYW1lJywgdmFsdWU6ICd0ZXN0bmFtZSd9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaTtcblxuICAgICAgICAvLyBTaG91bGQgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2YgaXRlbXMgYXMgY29sQ29uZmlncyAobWludXMgYW55IGZpZWxkT25seSBjb25maWdzKVxuICAgICAgICBleHBlY3QoY2FyZERhdGFWYWx1ZXMubGVuZ3RoKS50b0VxdWFsKGV4cGVjdGVkUmVzdWx0cy5sZW5ndGgpO1xuICAgICAgICBleHBlY3QoY2FyZERhdGFMYWJlbHMubGVuZ3RoKS50b0VxdWFsKGV4cGVjdGVkUmVzdWx0cy5sZW5ndGgpO1xuXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGV4cGVjdGVkUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZXhwZWN0KGNhcmREYXRhTGFiZWxzW2ldLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoZ2V0RGlzcGxheWVkTGFiZWwoZXhwZWN0ZWRSZXN1bHRzW2ldLmxhYmVsKSk7XG4gICAgICAgICAgICBleHBlY3QoY2FyZERhdGFWYWx1ZXNbaV0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbChleHBlY3RlZFJlc3VsdHNbaV0udmFsdWUpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGh0bWwgcmVuZGVyZXJzIGNvcnJlY3RseScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoe3Njb3JlOiAxMDAwfSxcbiAgICAgICAgICAgIFtuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdzY29yZScsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiYXonLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaydcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICRjb21waWxlLFxuICAgICAgICAgICAgJHNjb3BlKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLnJpc2staGlnaGVzdCcpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSB2aWV3IG1vcmUgYnV0dG9uIHdoZW4gbW9yZSB0aGFuIG1heCBjb2x1bW4gY29uZmlncyAoNSknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHtzY29yZTogMTAwMH0sXG4gICAgICAgICAgICBbbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnYScsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiYXonLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaydcbiAgICAgICAgICAgIH0pLG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2InLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnYmF6JyxcbiAgICAgICAgICAgICAgICByZW5kZXJlcjogJ3Jpc2snXG4gICAgICAgICAgICB9KSxuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdjJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JheicsXG4gICAgICAgICAgICAgICAgcmVuZGVyZXI6ICdyaXNrJ1xuICAgICAgICAgICAgfSksbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnZCcsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiYXonLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaydcbiAgICAgICAgICAgIH0pLG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2UnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnYmF6JyxcbiAgICAgICAgICAgICAgICByZW5kZXJlcjogJ3Jpc2snXG4gICAgICAgICAgICB9KSxuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdmJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JheicsXG4gICAgICAgICAgICAgICAgcmVuZGVyZXI6ICdyaXNrJ1xuICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgJGNvbXBpbGUsXG4gICAgICAgICAgICAkc2NvcGUpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuYnRuLXZpZXctbW9yZScpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB0aGUgdmlldyBtb3JlIGJ1dHRvbiB3aGVuIHNhbWUgYXMgbWF4IGNvbHVtbiBjb25maWdzICg1KScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoe3Njb3JlOiAxMDAwfSxcbiAgICAgICAgICAgIFtuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdhJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JheicsXG4gICAgICAgICAgICAgICAgcmVuZGVyZXI6ICdyaXNrJ1xuICAgICAgICAgICAgfSksbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnYicsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiYXonLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaydcbiAgICAgICAgICAgIH0pLG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2MnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnYmF6JyxcbiAgICAgICAgICAgICAgICByZW5kZXJlcjogJ3Jpc2snXG4gICAgICAgICAgICB9KSxuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdkJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JheicsXG4gICAgICAgICAgICAgICAgcmVuZGVyZXI6ICdyaXNrJ1xuICAgICAgICAgICAgfSksbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnZScsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiYXonLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaydcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICRjb21waWxlLFxuICAgICAgICAgICAgJHNjb3BlKTtcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuZmluZCgnLmJ0bi12aWV3LW1vcmUnKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgdGhlIHZpZXcgbW9yZSBidXR0b24gd2hlbiBsZXNzIHRoYW4gbWF4IGNvbHVtbiBjb25maWdzICg1KScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoe3Njb3JlOiAxMDAwfSxcbiAgICAgICAgICAgIFtuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdhJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JheicsXG4gICAgICAgICAgICAgICAgcmVuZGVyZXI6ICdyaXNrJ1xuICAgICAgICAgICAgfSksbmV3IENvbHVtbkNvbmZpZyh7XG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiAnYicsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiYXonLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVyOiAncmlzaydcbiAgICAgICAgICAgIH0pLG5ldyBDb2x1bW5Db25maWcoe1xuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogJ2MnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnYmF6JyxcbiAgICAgICAgICAgICAgICByZW5kZXJlcjogJ3Jpc2snXG4gICAgICAgICAgICB9KSxuZXcgQ29sdW1uQ29uZmlnKHtcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6ICdkJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JheicsXG4gICAgICAgICAgICAgICAgcmVuZGVyZXI6ICdyaXNrJ1xuICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgJGNvbXBpbGUsXG4gICAgICAgICAgICAkc2NvcGUpO1xuICAgICAgICBleHBlY3QoZWxlbWVudC5maW5kKCcuYnRuLXZpZXctbW9yZScpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
