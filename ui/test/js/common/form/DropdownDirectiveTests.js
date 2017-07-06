System.register(['test/js/TestInitializer', 'common/form/FormModule'], function (_export) {
    'use strict';

    var formModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonFormFormModule) {
            formModule = _commonFormFormModule['default'];
        }],
        execute: function () {

            describe('spDropdown', function () {
                var dropdownOptions = [{
                    displayName: 'this thing',
                    id: 1,
                    iconClass: 'fa fa-group'
                }, {
                    displayName: 'that_thing',
                    id: 2
                }],
                    attributeDefinition = '<div sp-dropdown="{{options}}" sp-show-blank="showBlank" ' + 'sp-on-select="selectFunc(value)" ng-model="selectedValue" />',
                    elementDefinition = '<sp-dropdown sp-button-id="elementButton" sp-options="options" ' + 'sp-show-blank="showBlank" ng-model="selectedValue" />',
                    transcludeDefinition = '<sp-dropdown sp-options="options" sp-button-id="transcludeButton" ' + '             ng-model="selectedValue">' + '  <sp-dropdown-button sp-button-class="btn extraClass">' + '    <i class="fa fa-menu"></i>' + '  </sp-dropdown-button>' + '</sp-dropdown>',
                    $compile,
                    $scope,
                    $timeout;

                function createElement(definition) {
                    var element = angular.element(definition);
                    $compile(element)($scope);
                    $scope.$apply();
                    return element;
                }

                function findLabelInput(element) {
                    //div/div/input
                    return element.find('.dropdown')[0].children[0].children[0];
                }

                function findDropdownButton(element) {
                    //div/div/div/button
                    return element.find('.dropdown')[0].children[0].children[1].children[0];
                }

                function findDropdownMenu(element) {
                    return element.find('.dropdown-menu')[0];
                }

                function createKeypressEvent(keyCode) {
                    return $.Event('keypress', {
                        keyCode: keyCode
                    });
                }

                function findTranscludeButton(element) {
                    return element.find('#transcludeButton')[0];
                }

                beforeEach(module(formModule));

                beforeEach(inject(function ($rootScope, _$compile_, _$timeout_, spTranslateFilter) {
                    $scope = $rootScope.$new();
                    $compile = _$compile_;
                    $timeout = _$timeout_;

                    // Setup the test catalog.
                    spTranslateFilter.configureCatalog({
                        'that_thing': 'that thing'
                    });

                    $scope.options = dropdownOptions;
                    $scope.showBlank = false;
                    $scope.selectedValue = null;
                    $scope.selectFunc = function (value) {};
                    spyOn($scope, 'selectFunc');
                }));

                it('should make a dropdown with correct label', function () {
                    var element = createElement(attributeDefinition);
                    var labelInput = findLabelInput(element);
                    expect(labelInput).toBeDefined();
                    expect(labelInput.value.trim()).toEqual('');
                    $scope.selectedValue = 2;
                    element = createElement(elementDefinition);
                    labelInput = findLabelInput(element);
                    expect(labelInput).toBeDefined();
                    expect(labelInput.value).toEqual('that thing');
                });

                it('should add options to dropdown list', function () {
                    var element = createElement(attributeDefinition);
                    var menuElement = findDropdownMenu(element);
                    expect(menuElement).toBeDefined();
                    expect(menuElement.children.length).toEqual(2);
                    expect(menuElement.children[0].innerText.trim()).toEqual('this thing');
                    expect(menuElement.children[1].innerText.trim()).toEqual('that thing');
                });

                it('should add icon if iconClass is defined', function () {
                    var element = createElement(attributeDefinition);
                    var menuElement = findDropdownMenu(element);
                    expect(menuElement).toBeDefined();
                    expect(menuElement.children.length).toEqual(2);
                    expect(angular.element(menuElement.children[0]).find('i.fa-group').length).toEqual(1);
                    expect(angular.element(menuElement.children[1]).find('i').length).toEqual(0);
                });

                it('should show empty entry if spShowBlank is true', function () {
                    $scope.showBlank = true;
                    var element = createElement(elementDefinition);
                    var menuElement = findDropdownMenu(element);
                    expect(menuElement).toBeDefined();
                    expect(menuElement.children.length).toEqual(3);
                    /* Should have a sr-only element reading no selection*/
                    expect(angular.element(menuElement).find('span').attr('class')).toContain('sr-only');
                    expect(menuElement.children[0].innerText.trim()).toEqual('ui_dropdown_no_selection');
                    expect(menuElement.children[1].innerText.trim()).toEqual('this thing');
                    expect(menuElement.children[2].innerText.trim()).toEqual('that thing');
                });

                it('should open menu when either button is clicked', function () {
                    var element = createElement(elementDefinition);
                    var topElement = element.children()[0];

                    // test clicking the label button
                    var labelInput = findLabelInput(element);
                    angular.element(labelInput).click();
                    expect(angular.element(topElement).hasClass('open')).toBeTruthy();
                    angular.element(labelInput).click();
                    expect(angular.element(topElement).hasClass('open')).toBeFalsy();

                    // test clicking the chevron button
                    var dropdownButton = findDropdownButton(element);
                    angular.element(dropdownButton).click();
                    expect(angular.element(topElement).hasClass('open')).toBeTruthy();
                    angular.element(dropdownButton).click();
                    expect(angular.element(topElement).hasClass('open')).toBeFalsy();
                });

                it('should update value when dropdown menu item clicked', function () {
                    var element = createElement(attributeDefinition),
                        menuElement = findDropdownMenu(element),
                        labelInput,
                        ariaSpan;
                    angular.element(menuElement.children[0].children[0]).click();
                    $scope.$apply();
                    expect($scope.selectedValue).toEqual(1);
                    labelInput = findLabelInput(element);
                    expect(labelInput.value.trim()).toEqual('this thing');
                    ariaSpan = angular.element(findDropdownButton(element)).find('span.sr-only');
                    expect(ariaSpan.html()).toEqual('this thing');
                });

                it('should call on-select function when dropdown menu item clicked', function () {
                    var element = createElement(attributeDefinition);
                    var menuElement = findDropdownMenu(element);
                    angular.element(menuElement.children[0].children[0]).click();
                    $scope.$apply();
                    expect($scope.selectFunc).toHaveBeenCalledWith(dropdownOptions[0].value);
                });

                it('should clear value when empty entry is clicked', function () {
                    var element, menuElement, labelInput, ariaSpan;
                    $scope.showBlank = true;
                    $scope.selectedValue = 2;
                    element = createElement(attributeDefinition);
                    menuElement = findDropdownMenu(element);
                    angular.element(menuElement.children[0].children[0]).click();
                    $scope.$apply();
                    expect($scope.selectedValue).toBeUndefined();
                    labelInput = findLabelInput(element);
                    expect(labelInput.value.trim()).toEqual('');
                    ariaSpan = angular.element(findDropdownButton(element)).find('span.sr-only');
                    expect(ariaSpan.html()).toEqual('ui_dropdown_no_selection');
                });

                it('should select option on space or enter key', function () {
                    var element = createElement(attributeDefinition);
                    var menuElement = findDropdownMenu(element);
                    // Space key
                    angular.element(menuElement.children[0].children[0]).trigger(createKeypressEvent(32));
                    $scope.$apply();
                    expect($scope.selectedValue).toEqual(1);
                    // Not either space key, leave it alone
                    angular.element(menuElement.children[1].children[0]).trigger(createKeypressEvent(33));
                    expect($scope.selectedValue).toEqual(1);
                });

                it('should focus on the menu when menu is opened', function () {
                    var element = createElement(elementDefinition),
                        dropdownButton = findDropdownButton(element),
                        menuElement = findDropdownMenu(element),
                        firstMenuItem = menuElement.children[0].children[0];

                    firstMenuItem.focus = jasmine.createSpy('focus');
                    angular.element(dropdownButton).click();
                    $timeout.flush();
                    expect(firstMenuItem.focus).toHaveBeenCalled();
                });

                it('should focus on the label button when menu is closed', function () {
                    var element = createElement(elementDefinition),
                        dropdownButton = findDropdownButton(element);

                    dropdownButton.focus = jasmine.createSpy('focus');
                    angular.element(dropdownButton).click();
                    $timeout.flush();
                    angular.element(dropdownButton).click();
                    expect(dropdownButton.focus).toHaveBeenCalled();
                });

                it('renders button and works with transclusion', function () {
                    var element = createElement(transcludeDefinition),
                        dropdownButton = findTranscludeButton(element),
                        topElement = element.children()[0],
                        labelInput = findLabelInput(element);

                    //Test button is transcluded and works to open the menu
                    expect(dropdownButton).toBeDefined();
                    angular.element(dropdownButton).click();
                    expect(angular.element(topElement).hasClass('open')).toBeTruthy();

                    // Test that input was not rendered when transcluding
                    expect(labelInput.name).not.toEqual('input');
                });

                it('should focus on the transcluded button when menu is closed', function () {
                    var element = createElement(transcludeDefinition),
                        dropdownButton = findTranscludeButton(element);

                    dropdownButton.focus = jasmine.createSpy('focus');
                    angular.element(dropdownButton).click();
                    $timeout.flush();
                    angular.element(dropdownButton).click();
                    expect(dropdownButton.focus).toHaveBeenCalled();
                });

                it('should add extra classes with sp-additional-class on dropdown button', function () {
                    var element = createElement(transcludeDefinition),
                        dropdownButton = findTranscludeButton(element);

                    expect(angular.element(dropdownButton).hasClass('extraClass')).toBeTruthy();
                });

                it('should add id to menu if spButtonId is defined', function () {
                    var element = createElement(elementDefinition),
                        dropdownMenu = findDropdownMenu(element);
                    expect(dropdownMenu.id).toEqual('elementButtonMenu');
                });

                it('should add empty id to menu if spButtonId is not defined', function () {
                    var element = createElement(attributeDefinition),
                        dropdownMenu = findDropdownMenu(element);
                    expect(dropdownMenu.id).toEqual('');
                });

                it('should add id to menu option if spButtonId is defined', function () {
                    var element, dropdownMenu, optionElement;
                    $scope.showBlank = true;
                    element = createElement(elementDefinition);
                    dropdownMenu = findDropdownMenu(element);

                    // Blank option
                    optionElement = dropdownMenu.children[0].children[0];
                    expect(optionElement.id).toEqual('elementButtonMenuOptionBlank');

                    // First passed option, index 0
                    optionElement = dropdownMenu.children[1].children[0];
                    expect(optionElement.id).toEqual('elementButtonMenuOption0');
                });

                it('should add empty id to menu option if spButtonId is not defined', function () {
                    var element = createElement(attributeDefinition),
                        dropdownMenu = findDropdownMenu(element),
                        optionElement = dropdownMenu.children[0].children[0];

                    expect(optionElement.id).toEqual('');
                });

                it('groups options if group by func is provided', function () {
                    var groupByTemplate = '<sp-dropdown sp-options="options" sp-group-by-func="getGroup(option)" />',
                        testGroupElement = function (groupElement, groupName, count) {
                        expect(groupElement.find('.sp-dropdown-group-label')[0].innerText.trim()).toEqual(groupName);
                        expect(groupElement.find('ul li').length).toEqual(count);
                    },
                        element = undefined,
                        options = undefined,
                        dropdownGroups = undefined;

                    $scope.options = [{
                        category: {
                            label: 'cat 1',
                            index: 1
                        },
                        label: 'option 1'
                    }, {
                        category: {
                            label: 'cat 1',
                            index: 1
                        },
                        label: 'option 2'
                    }, {
                        category: {
                            label: 'cat 2',
                            index: 0
                        },
                        label: 'option 3'
                    }];

                    $scope.getGroup = function (option) {
                        return option.category;
                    };

                    element = createElement(groupByTemplate);
                    options = findDropdownMenu(element);
                    dropdownGroups = element.find('.sp-dropdown-group');
                    expect(dropdownGroups.length).toEqual(2);
                    // cat 2 should be sorted first due to category index
                    testGroupElement(angular.element(dropdownGroups[0]), 'cat 2', 1);
                    testGroupElement(angular.element(dropdownGroups[1]), 'cat 1', 2);
                    element.remove();
                });

                it('uses provided button icon', function () {
                    var buttonIconTemplate = '<sp-dropdown sp-options="options" sp-button-icon="someicon" />',
                        element = createElement(buttonIconTemplate),
                        button = findDropdownButton(element);
                    expect(angular.element(angular.element(button).find('i')[0]).hasClass('someicon')).toEqual(true);
                    element.remove();
                });

                it('uses provided label', function () {
                    var labelTemplate = '<sp-dropdown sp-options="options" sp-label="thisLabel" />',
                        element = createElement(labelTemplate),
                        labelInput = findLabelInput(element);
                    expect(labelInput.value.trim()).toEqual('thisLabel');
                    element.remove();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9mb3JtL0Ryb3Bkb3duRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDJCQUEyQixVQUFVLFNBQVM7SUFDdEY7O0lBRUEsSUFBSTtJQUNKLE9BQU87UUFDSCxTQUFTLENBQUMsVUFBVSx3QkFBd0IsSUFBSSxVQUFVLHVCQUF1QjtZQUM3RSxhQUFhLHNCQUFzQjs7UUFFdkMsU0FBUyxZQUFZOztZQUw3QixTQUFTLGNBQWMsWUFBVztnQkFDOUIsSUFBSSxrQkFBa0IsQ0FBQztvQkFDZixhQUFhO29CQUNiLElBQUk7b0JBQ0osV0FBVzttQkFDWjtvQkFDQyxhQUFhO29CQUNiLElBQUk7O29CQUVSLHNCQUFzQiw4REFDbEI7b0JBQ0osb0JBQW9CLG9FQUNoQjtvQkFDSix1QkFDSSx1RUFDQSwyQ0FDQSw0REFDQSxtQ0FDQSw0QkFDQTtvQkFDSjtvQkFBVTtvQkFBUTs7Z0JBRXRCLFNBQVMsY0FBYyxZQUFZO29CQUMvQixJQUFJLFVBQVUsUUFBUSxRQUFRO29CQUM5QixTQUFTLFNBQVM7b0JBQ2xCLE9BQU87b0JBQ1AsT0FBTzs7O2dCQUdYLFNBQVMsZUFBZSxTQUFTOztvQkFFN0IsT0FBTyxRQUFRLEtBQUssYUFBYSxHQUFHLFNBQVMsR0FBRyxTQUFTOzs7Z0JBRzdELFNBQVMsbUJBQW1CLFNBQVM7O29CQUVqQyxPQUFPLFFBQVEsS0FBSyxhQUFhLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxTQUFTOzs7Z0JBR3pFLFNBQVMsaUJBQWlCLFNBQVM7b0JBQy9CLE9BQU8sUUFBUSxLQUFLLGtCQUFrQjs7O2dCQUcxQyxTQUFTLG9CQUFvQixTQUFTO29CQUNsQyxPQUFPLEVBQUUsTUFBTSxZQUFZO3dCQUN2QixTQUFTOzs7O2dCQUlqQixTQUFTLHFCQUFxQixTQUFTO29CQUNuQyxPQUFPLFFBQVEsS0FBSyxxQkFBcUI7OztnQkFHN0MsV0FBVyxPQUFPOztnQkFFbEIsV0FBVyxP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aUJBQWlCLFFBQVEsUUFBUSxlQUFlLEtBQUssU0FBUztvQkFDOUQsaUJBQWlCLFFBQVEsUUFBUSxlQUFlLEtBQUssU0FBUztvQkFDOUQsUUFBUTs7O2dCQUdaLEdBQUcsNkJBQTZCLFlBQU07b0JBQ2xDLElBQUkscUJBQXFCO3dCQUNyQixVQUFVLGNBQWM7d0JBQ3hCLFNBQVMsbUJBQW1CO29CQUNoQyxPQUFPLFFBQVEsUUFBUSxRQUFRLFFBQVEsUUFBUSxLQUFLLEtBQUssSUFBSSxTQUFTLGFBQWEsUUFBUTtvQkFDM0YsUUFBUTs7O2dCQUdaLEdBQUcsdUJBQXVCLFlBQU07b0JBQzVCLElBQUksZ0JBQWdCO3dCQUNoQixVQUFVLGNBQWM7d0JBQ3hCLGFBQWEsZUFBZTtvQkFDaEMsT0FBTyxXQUFXLE1BQU0sUUFBUSxRQUFRO29CQUN4QyxRQUFROzs7OztHQVFiIiwiZmlsZSI6ImNvbW1vbi9mb3JtL0Ryb3Bkb3duRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcbmltcG9ydCBmb3JtTW9kdWxlIGZyb20gJ2NvbW1vbi9mb3JtL0Zvcm1Nb2R1bGUnO1xuXG5kZXNjcmliZSgnc3BEcm9wZG93bicsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkcm9wZG93bk9wdGlvbnMgPSBbe1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICd0aGlzIHRoaW5nJyxcbiAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgaWNvbkNsYXNzOiAnZmEgZmEtZ3JvdXAnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAndGhhdF90aGluZycsXG4gICAgICAgICAgICBpZDogMlxuICAgICAgICB9XSxcbiAgICAgICAgYXR0cmlidXRlRGVmaW5pdGlvbiA9ICc8ZGl2IHNwLWRyb3Bkb3duPVwie3tvcHRpb25zfX1cIiBzcC1zaG93LWJsYW5rPVwic2hvd0JsYW5rXCIgJyArXG4gICAgICAgICAgICAnc3Atb24tc2VsZWN0PVwic2VsZWN0RnVuYyh2YWx1ZSlcIiBuZy1tb2RlbD1cInNlbGVjdGVkVmFsdWVcIiAvPicsXG4gICAgICAgIGVsZW1lbnREZWZpbml0aW9uID0gJzxzcC1kcm9wZG93biBzcC1idXR0b24taWQ9XCJlbGVtZW50QnV0dG9uXCIgc3Atb3B0aW9ucz1cIm9wdGlvbnNcIiAnICtcbiAgICAgICAgICAgICdzcC1zaG93LWJsYW5rPVwic2hvd0JsYW5rXCIgbmctbW9kZWw9XCJzZWxlY3RlZFZhbHVlXCIgLz4nLFxuICAgICAgICB0cmFuc2NsdWRlRGVmaW5pdGlvbiA9XG4gICAgICAgICAgICAnPHNwLWRyb3Bkb3duIHNwLW9wdGlvbnM9XCJvcHRpb25zXCIgc3AtYnV0dG9uLWlkPVwidHJhbnNjbHVkZUJ1dHRvblwiICcgK1xuICAgICAgICAgICAgJyAgICAgICAgICAgICBuZy1tb2RlbD1cInNlbGVjdGVkVmFsdWVcIj4nICtcbiAgICAgICAgICAgICcgIDxzcC1kcm9wZG93bi1idXR0b24gc3AtYnV0dG9uLWNsYXNzPVwiYnRuIGV4dHJhQ2xhc3NcIj4nICtcbiAgICAgICAgICAgICcgICAgPGkgY2xhc3M9XCJmYSBmYS1tZW51XCI+PC9pPicgK1xuICAgICAgICAgICAgJyAgPC9zcC1kcm9wZG93bi1idXR0b24+JyArXG4gICAgICAgICAgICAnPC9zcC1kcm9wZG93bj4nLFxuICAgICAgICAkY29tcGlsZSwgJHNjb3BlLCAkdGltZW91dDtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoZGVmaW5pdGlvbikge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChkZWZpbml0aW9uKTtcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcbiAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kTGFiZWxJbnB1dChlbGVtZW50KSB7XG4gICAgICAgIC8vZGl2L2Rpdi9pbnB1dFxuICAgICAgICByZXR1cm4gZWxlbWVudC5maW5kKCcuZHJvcGRvd24nKVswXS5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kRHJvcGRvd25CdXR0b24oZWxlbWVudCkge1xuICAgICAgICAvL2Rpdi9kaXYvZGl2L2J1dHRvblxuICAgICAgICByZXR1cm4gZWxlbWVudC5maW5kKCcuZHJvcGRvd24nKVswXS5jaGlsZHJlblswXS5jaGlsZHJlblsxXS5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kRHJvcGRvd25NZW51KGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnKVswXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVLZXlwcmVzc0V2ZW50KGtleUNvZGUpIHtcbiAgICAgICAgcmV0dXJuICQuRXZlbnQoJ2tleXByZXNzJywge1xuICAgICAgICAgICAga2V5Q29kZToga2V5Q29kZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kVHJhbnNjbHVkZUJ1dHRvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmZpbmQoJyN0cmFuc2NsdWRlQnV0dG9uJylbMF07XG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaChtb2R1bGUoZm9ybU1vZHVsZSkpO1xuXG4gICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24oJHJvb3RTY29wZSwgXyRjb21waWxlXywgXyR0aW1lb3V0Xywgc3BUcmFuc2xhdGVGaWx0ZXIpIHtcbiAgICAgICAgJHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XG4gICAgICAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICAgICAgJHRpbWVvdXQgPSBfJHRpbWVvdXRfO1xuXG4gICAgICAgIC8vIFNldHVwIHRoZSB0ZXN0IGNhdGFsb2cuXG4gICAgICAgIHNwVHJhbnNsYXRlRmlsdGVyLmNvbmZpZ3VyZUNhdGFsb2coe1xuICAgICAgICAgICAgJ3RoYXRfdGhpbmcnOiAndGhhdCB0aGluZydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSBkcm9wZG93bk9wdGlvbnM7XG4gICAgICAgICRzY29wZS5zaG93QmxhbmsgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVmFsdWUgPSBudWxsO1xuICAgICAgICAkc2NvcGUuc2VsZWN0RnVuYyA9IGZ1bmN0aW9uKHZhbHVlKSB7fTtcbiAgICAgICAgc3B5T24oJHNjb3BlLCAnc2VsZWN0RnVuYycpO1xuICAgIH0pKTtcblxuICAgIGl0ICgnc2hvdWxkIG1ha2UgYSBkcm9wZG93biB3aXRoIGNvcnJlY3QgbGFiZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGF0dHJpYnV0ZURlZmluaXRpb24pO1xuICAgICAgICB2YXIgbGFiZWxJbnB1dCA9IGZpbmRMYWJlbElucHV0KGVsZW1lbnQpO1xuICAgICAgICBleHBlY3QobGFiZWxJbnB1dCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KGxhYmVsSW5wdXQudmFsdWUudHJpbSgpKS50b0VxdWFsKCcnKTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVmFsdWUgPSAyO1xuICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XG4gICAgICAgIGxhYmVsSW5wdXQgPSBmaW5kTGFiZWxJbnB1dChlbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KGxhYmVsSW5wdXQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChsYWJlbElucHV0LnZhbHVlKS50b0VxdWFsKCd0aGF0IHRoaW5nJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBhZGQgb3B0aW9ucyB0byBkcm9wZG93biBsaXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChhdHRyaWJ1dGVEZWZpbml0aW9uKTtcbiAgICAgICAgdmFyIG1lbnVFbGVtZW50ID0gZmluZERyb3Bkb3duTWVudShlbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KG1lbnVFbGVtZW50KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVudUVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICBleHBlY3QobWVudUVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbCgndGhpcyB0aGluZycpO1xuICAgICAgICBleHBlY3QobWVudUVsZW1lbnQuY2hpbGRyZW5bMV0uaW5uZXJUZXh0LnRyaW0oKSkudG9FcXVhbCgndGhhdCB0aGluZycpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYWRkIGljb24gaWYgaWNvbkNsYXNzIGlzIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGF0dHJpYnV0ZURlZmluaXRpb24pO1xuICAgICAgICB2YXIgbWVudUVsZW1lbnQgPSBmaW5kRHJvcGRvd25NZW51KGVsZW1lbnQpO1xuICAgICAgICBleHBlY3QobWVudUVsZW1lbnQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChtZW51RWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQobWVudUVsZW1lbnQuY2hpbGRyZW5bMF0pLmZpbmQoJ2kuZmEtZ3JvdXAnKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQobWVudUVsZW1lbnQuY2hpbGRyZW5bMV0pLmZpbmQoJ2knKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBzaG93IGVtcHR5IGVudHJ5IGlmIHNwU2hvd0JsYW5rIGlzIHRydWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNob3dCbGFuayA9IHRydWU7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XG4gICAgICAgIHZhciBtZW51RWxlbWVudCA9IGZpbmREcm9wZG93bk1lbnUoZWxlbWVudCk7XG4gICAgICAgIGV4cGVjdChtZW51RWxlbWVudCkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lbnVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICAgICAgLyogU2hvdWxkIGhhdmUgYSBzci1vbmx5IGVsZW1lbnQgcmVhZGluZyBubyBzZWxlY3Rpb24qL1xuICAgICAgICBleHBlY3QoYW5ndWxhci5lbGVtZW50KG1lbnVFbGVtZW50KS5maW5kKCdzcGFuJykuYXR0cignY2xhc3MnKSkudG9Db250YWluKCdzci1vbmx5Jyk7XG4gICAgICAgIGV4cGVjdChtZW51RWxlbWVudC5jaGlsZHJlblswXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKCd1aV9kcm9wZG93bl9ub19zZWxlY3Rpb24nKTtcbiAgICAgICAgZXhwZWN0KG1lbnVFbGVtZW50LmNoaWxkcmVuWzFdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ3RoaXMgdGhpbmcnKTtcbiAgICAgICAgZXhwZWN0KG1lbnVFbGVtZW50LmNoaWxkcmVuWzJdLmlubmVyVGV4dC50cmltKCkpLnRvRXF1YWwoJ3RoYXQgdGhpbmcnKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIG9wZW4gbWVudSB3aGVuIGVpdGhlciBidXR0b24gaXMgY2xpY2tlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pO1xuICAgICAgICB2YXIgdG9wRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oKVswXTtcblxuICAgICAgICAvLyB0ZXN0IGNsaWNraW5nIHRoZSBsYWJlbCBidXR0b25cbiAgICAgICAgdmFyIGxhYmVsSW5wdXQgPSBmaW5kTGFiZWxJbnB1dChlbGVtZW50KTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGxhYmVsSW5wdXQpLmNsaWNrKCk7XG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQodG9wRWxlbWVudCkuaGFzQ2xhc3MoJ29wZW4nKSkudG9CZVRydXRoeSgpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQobGFiZWxJbnB1dCkuY2xpY2soKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BFbGVtZW50KS5oYXNDbGFzcygnb3BlbicpKS50b0JlRmFsc3koKTtcblxuICAgICAgICAvLyB0ZXN0IGNsaWNraW5nIHRoZSBjaGV2cm9uIGJ1dHRvblxuICAgICAgICB2YXIgZHJvcGRvd25CdXR0b24gPSBmaW5kRHJvcGRvd25CdXR0b24oZWxlbWVudCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkcm9wZG93bkJ1dHRvbikuY2xpY2soKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BFbGVtZW50KS5oYXNDbGFzcygnb3BlbicpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkcm9wZG93bkJ1dHRvbikuY2xpY2soKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BFbGVtZW50KS5oYXNDbGFzcygnb3BlbicpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIHVwZGF0ZSB2YWx1ZSB3aGVuIGRyb3Bkb3duIG1lbnUgaXRlbSBjbGlja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChhdHRyaWJ1dGVEZWZpbml0aW9uKSxcbiAgICAgICAgICAgIG1lbnVFbGVtZW50ID0gZmluZERyb3Bkb3duTWVudShlbGVtZW50KSxcbiAgICAgICAgICAgIGxhYmVsSW5wdXQsIGFyaWFTcGFuO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQobWVudUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0pLmNsaWNrKCk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KCRzY29wZS5zZWxlY3RlZFZhbHVlKS50b0VxdWFsKDEpO1xuICAgICAgICBsYWJlbElucHV0ID0gZmluZExhYmVsSW5wdXQoZWxlbWVudCk7XG4gICAgICAgIGV4cGVjdChsYWJlbElucHV0LnZhbHVlLnRyaW0oKSkudG9FcXVhbCgndGhpcyB0aGluZycpO1xuICAgICAgICBhcmlhU3BhbiA9IGFuZ3VsYXIuZWxlbWVudChmaW5kRHJvcGRvd25CdXR0b24oZWxlbWVudCkpLmZpbmQoJ3NwYW4uc3Itb25seScpO1xuICAgICAgICBleHBlY3QoYXJpYVNwYW4uaHRtbCgpKS50b0VxdWFsKCd0aGlzIHRoaW5nJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBjYWxsIG9uLXNlbGVjdCBmdW5jdGlvbiB3aGVuIGRyb3Bkb3duIG1lbnUgaXRlbSBjbGlja2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChhdHRyaWJ1dGVEZWZpbml0aW9uKTtcbiAgICAgICAgdmFyIG1lbnVFbGVtZW50ID0gZmluZERyb3Bkb3duTWVudShlbGVtZW50KTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KG1lbnVFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdKS5jbGljaygpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGV4cGVjdCgkc2NvcGUuc2VsZWN0RnVuYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZHJvcGRvd25PcHRpb25zWzBdLnZhbHVlKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIGNsZWFyIHZhbHVlIHdoZW4gZW1wdHkgZW50cnkgaXMgY2xpY2tlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCwgbWVudUVsZW1lbnQsIGxhYmVsSW5wdXQsIGFyaWFTcGFuO1xuICAgICAgICAkc2NvcGUuc2hvd0JsYW5rID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVmFsdWUgPSAyO1xuICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChhdHRyaWJ1dGVEZWZpbml0aW9uKTtcbiAgICAgICAgbWVudUVsZW1lbnQgPSBmaW5kRHJvcGRvd25NZW51KGVsZW1lbnQpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQobWVudUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0pLmNsaWNrKCk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgZXhwZWN0KCRzY29wZS5zZWxlY3RlZFZhbHVlKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIGxhYmVsSW5wdXQgPSBmaW5kTGFiZWxJbnB1dChlbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KGxhYmVsSW5wdXQudmFsdWUudHJpbSgpKS50b0VxdWFsKCcnKTtcbiAgICAgICAgYXJpYVNwYW4gPSBhbmd1bGFyLmVsZW1lbnQoZmluZERyb3Bkb3duQnV0dG9uKGVsZW1lbnQpKS5maW5kKCdzcGFuLnNyLW9ubHknKTtcbiAgICAgICAgZXhwZWN0KGFyaWFTcGFuLmh0bWwoKSkudG9FcXVhbCgndWlfZHJvcGRvd25fbm9fc2VsZWN0aW9uJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBzZWxlY3Qgb3B0aW9uIG9uIHNwYWNlIG9yIGVudGVyIGtleScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoYXR0cmlidXRlRGVmaW5pdGlvbik7XG4gICAgICAgIHZhciBtZW51RWxlbWVudCA9IGZpbmREcm9wZG93bk1lbnUoZWxlbWVudCk7XG4gICAgICAgIC8vIFNwYWNlIGtleVxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQobWVudUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0pLnRyaWdnZXIoY3JlYXRlS2V5cHJlc3NFdmVudCgzMikpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGV4cGVjdCgkc2NvcGUuc2VsZWN0ZWRWYWx1ZSkudG9FcXVhbCgxKTtcbiAgICAgICAgLy8gTm90IGVpdGhlciBzcGFjZSBrZXksIGxlYXZlIGl0IGFsb25lXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChtZW51RWxlbWVudC5jaGlsZHJlblsxXS5jaGlsZHJlblswXSkudHJpZ2dlcihjcmVhdGVLZXlwcmVzc0V2ZW50KDMzKSk7XG4gICAgICAgIGV4cGVjdCgkc2NvcGUuc2VsZWN0ZWRWYWx1ZSkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIGZvY3VzIG9uIHRoZSBtZW51IHdoZW4gbWVudSBpcyBvcGVuZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGVsZW1lbnREZWZpbml0aW9uKSxcbiAgICAgICAgICAgIGRyb3Bkb3duQnV0dG9uID0gZmluZERyb3Bkb3duQnV0dG9uKGVsZW1lbnQpLFxuICAgICAgICAgICAgbWVudUVsZW1lbnQgPSBmaW5kRHJvcGRvd25NZW51KGVsZW1lbnQpLFxuICAgICAgICAgICAgZmlyc3RNZW51SXRlbSA9IG1lbnVFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgIGZpcnN0TWVudUl0ZW0uZm9jdXMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZm9jdXMnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGRyb3Bkb3duQnV0dG9uKS5jbGljaygpO1xuICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICBleHBlY3QoZmlyc3RNZW51SXRlbS5mb2N1cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgZm9jdXMgb24gdGhlIGxhYmVsIGJ1dHRvbiB3aGVuIG1lbnUgaXMgY2xvc2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChlbGVtZW50RGVmaW5pdGlvbiksXG4gICAgICAgICAgICBkcm9wZG93bkJ1dHRvbiA9IGZpbmREcm9wZG93bkJ1dHRvbihlbGVtZW50KTtcblxuICAgICAgICBkcm9wZG93bkJ1dHRvbi5mb2N1cyA9IGphc21pbmUuY3JlYXRlU3B5KCdmb2N1cycpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZHJvcGRvd25CdXR0b24pLmNsaWNrKCk7XG4gICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkcm9wZG93bkJ1dHRvbikuY2xpY2soKTtcbiAgICAgICAgZXhwZWN0KGRyb3Bkb3duQnV0dG9uLmZvY3VzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3JlbmRlcnMgYnV0dG9uIGFuZCB3b3JrcyB3aXRoIHRyYW5zY2x1c2lvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQodHJhbnNjbHVkZURlZmluaXRpb24pLFxuICAgICAgICAgICAgZHJvcGRvd25CdXR0b24gPSBmaW5kVHJhbnNjbHVkZUJ1dHRvbihlbGVtZW50KSxcbiAgICAgICAgICAgIHRvcEVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuKClbMF0sXG4gICAgICAgICAgICBsYWJlbElucHV0ID0gZmluZExhYmVsSW5wdXQoZWxlbWVudCk7XG5cbiAgICAgICAgLy9UZXN0IGJ1dHRvbiBpcyB0cmFuc2NsdWRlZCBhbmQgd29ya3MgdG8gb3BlbiB0aGUgbWVudVxuICAgICAgICBleHBlY3QoZHJvcGRvd25CdXR0b24pLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkcm9wZG93bkJ1dHRvbikuY2xpY2soKTtcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuZWxlbWVudCh0b3BFbGVtZW50KS5oYXNDbGFzcygnb3BlbicpKS50b0JlVHJ1dGh5KCk7XG5cbiAgICAgICAgLy8gVGVzdCB0aGF0IGlucHV0IHdhcyBub3QgcmVuZGVyZWQgd2hlbiB0cmFuc2NsdWRpbmdcbiAgICAgICAgZXhwZWN0KGxhYmVsSW5wdXQubmFtZSkubm90LnRvRXF1YWwoJ2lucHV0Jyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBmb2N1cyBvbiB0aGUgdHJhbnNjbHVkZWQgYnV0dG9uIHdoZW4gbWVudSBpcyBjbG9zZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHRyYW5zY2x1ZGVEZWZpbml0aW9uKSxcbiAgICAgICAgICAgIGRyb3Bkb3duQnV0dG9uID0gZmluZFRyYW5zY2x1ZGVCdXR0b24oZWxlbWVudCk7XG5cbiAgICAgICAgZHJvcGRvd25CdXR0b24uZm9jdXMgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZm9jdXMnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGRyb3Bkb3duQnV0dG9uKS5jbGljaygpO1xuICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZHJvcGRvd25CdXR0b24pLmNsaWNrKCk7XG4gICAgICAgIGV4cGVjdChkcm9wZG93bkJ1dHRvbi5mb2N1cykudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYWRkIGV4dHJhIGNsYXNzZXMgd2l0aCBzcC1hZGRpdGlvbmFsLWNsYXNzIG9uIGRyb3Bkb3duIGJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQodHJhbnNjbHVkZURlZmluaXRpb24pLFxuICAgICAgICAgICAgZHJvcGRvd25CdXR0b24gPSBmaW5kVHJhbnNjbHVkZUJ1dHRvbihlbGVtZW50KTtcblxuICAgICAgICBleHBlY3QoYW5ndWxhci5lbGVtZW50KGRyb3Bkb3duQnV0dG9uKS5oYXNDbGFzcygnZXh0cmFDbGFzcycpKS50b0JlVHJ1dGh5KCk7XG5cbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIGFkZCBpZCB0byBtZW51IGlmIHNwQnV0dG9uSWQgaXMgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoZWxlbWVudERlZmluaXRpb24pLFxuICAgICAgICAgICAgZHJvcGRvd25NZW51ID0gZmluZERyb3Bkb3duTWVudShlbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KGRyb3Bkb3duTWVudS5pZCkudG9FcXVhbCgnZWxlbWVudEJ1dHRvbk1lbnUnKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIGFkZCBlbXB0eSBpZCB0byBtZW51IGlmIHNwQnV0dG9uSWQgaXMgbm90IGRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGF0dHJpYnV0ZURlZmluaXRpb24pLFxuICAgICAgICAgICAgZHJvcGRvd25NZW51ID0gZmluZERyb3Bkb3duTWVudShlbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KGRyb3Bkb3duTWVudS5pZCkudG9FcXVhbCgnJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBhZGQgaWQgdG8gbWVudSBvcHRpb24gaWYgc3BCdXR0b25JZCBpcyBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50LCBkcm9wZG93bk1lbnUsIG9wdGlvbkVsZW1lbnQ7XG4gICAgICAgICRzY29wZS5zaG93QmxhbmsgPSB0cnVlO1xuICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChlbGVtZW50RGVmaW5pdGlvbik7XG4gICAgICAgIGRyb3Bkb3duTWVudSA9IGZpbmREcm9wZG93bk1lbnUoZWxlbWVudCk7XG5cbiAgICAgICAgLy8gQmxhbmsgb3B0aW9uXG4gICAgICAgIG9wdGlvbkVsZW1lbnQgPSBkcm9wZG93bk1lbnUuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF07XG4gICAgICAgIGV4cGVjdChvcHRpb25FbGVtZW50LmlkKS50b0VxdWFsKCdlbGVtZW50QnV0dG9uTWVudU9wdGlvbkJsYW5rJyk7XG5cbiAgICAgICAgLy8gRmlyc3QgcGFzc2VkIG9wdGlvbiwgaW5kZXggMFxuICAgICAgICBvcHRpb25FbGVtZW50ID0gZHJvcGRvd25NZW51LmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdO1xuICAgICAgICBleHBlY3Qob3B0aW9uRWxlbWVudC5pZCkudG9FcXVhbCgnZWxlbWVudEJ1dHRvbk1lbnVPcHRpb24wJyk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBhZGQgZW1wdHkgaWQgdG8gbWVudSBvcHRpb24gaWYgc3BCdXR0b25JZCBpcyBub3QgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoYXR0cmlidXRlRGVmaW5pdGlvbiksXG4gICAgICAgICAgICBkcm9wZG93bk1lbnUgPSBmaW5kRHJvcGRvd25NZW51KGVsZW1lbnQpLFxuICAgICAgICAgICAgb3B0aW9uRWxlbWVudCA9IGRyb3Bkb3duTWVudS5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcblxuICAgICAgICBleHBlY3Qob3B0aW9uRWxlbWVudC5pZCkudG9FcXVhbCgnJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZ3JvdXBzIG9wdGlvbnMgaWYgZ3JvdXAgYnkgZnVuYyBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGdyb3VwQnlUZW1wbGF0ZSA9ICc8c3AtZHJvcGRvd24gc3Atb3B0aW9ucz1cIm9wdGlvbnNcIiBzcC1ncm91cC1ieS1mdW5jPVwiZ2V0R3JvdXAob3B0aW9uKVwiIC8+JyxcbiAgICAgICAgICAgIHRlc3RHcm91cEVsZW1lbnQgPSAoZ3JvdXBFbGVtZW50LCBncm91cE5hbWUsIGNvdW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdyb3VwRWxlbWVudC5maW5kKCcuc3AtZHJvcGRvd24tZ3JvdXAtbGFiZWwnKVswXS5pbm5lclRleHQudHJpbSgpKS50b0VxdWFsKGdyb3VwTmFtZSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdyb3VwRWxlbWVudC5maW5kKCd1bCBsaScpLmxlbmd0aCkudG9FcXVhbChjb3VudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZWxlbWVudCwgb3B0aW9ucywgZHJvcGRvd25Hcm91cHM7XG5cbiAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSBbe1xuICAgICAgICAgICAgY2F0ZWdvcnk6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2NhdCAxJyxcbiAgICAgICAgICAgICAgICBpbmRleDogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxhYmVsOiAnb3B0aW9uIDEnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNhdGVnb3J5OiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdjYXQgMScsXG4gICAgICAgICAgICAgICAgaW5kZXg6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYWJlbDogJ29wdGlvbiAyJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjYXRlZ29yeToge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnY2F0IDInLFxuICAgICAgICAgICAgICAgIGluZGV4OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGFiZWw6ICdvcHRpb24gMydcbiAgICAgICAgfV07XG5cbiAgICAgICAgJHNjb3BlLmdldEdyb3VwID0gKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi5jYXRlZ29yeTtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChncm91cEJ5VGVtcGxhdGUpO1xuICAgICAgICBvcHRpb25zID0gZmluZERyb3Bkb3duTWVudShlbGVtZW50KTtcbiAgICAgICAgZHJvcGRvd25Hcm91cHMgPSBlbGVtZW50LmZpbmQoJy5zcC1kcm9wZG93bi1ncm91cCcpO1xuICAgICAgICBleHBlY3QoZHJvcGRvd25Hcm91cHMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAvLyBjYXQgMiBzaG91bGQgYmUgc29ydGVkIGZpcnN0IGR1ZSB0byBjYXRlZ29yeSBpbmRleFxuICAgICAgICB0ZXN0R3JvdXBFbGVtZW50KGFuZ3VsYXIuZWxlbWVudChkcm9wZG93bkdyb3Vwc1swXSksICdjYXQgMicsIDEpO1xuICAgICAgICB0ZXN0R3JvdXBFbGVtZW50KGFuZ3VsYXIuZWxlbWVudChkcm9wZG93bkdyb3Vwc1sxXSksICdjYXQgMScsIDIpO1xuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgcHJvdmlkZWQgYnV0dG9uIGljb24nLCAoKSA9PiB7XG4gICAgICAgIGxldCBidXR0b25JY29uVGVtcGxhdGUgPSAnPHNwLWRyb3Bkb3duIHNwLW9wdGlvbnM9XCJvcHRpb25zXCIgc3AtYnV0dG9uLWljb249XCJzb21laWNvblwiIC8+JyxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGJ1dHRvbkljb25UZW1wbGF0ZSksXG4gICAgICAgICAgICBidXR0b24gPSBmaW5kRHJvcGRvd25CdXR0b24oZWxlbWVudCk7XG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmVsZW1lbnQoYW5ndWxhci5lbGVtZW50KGJ1dHRvbikuZmluZCgnaScpWzBdKS5oYXNDbGFzcygnc29tZWljb24nKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIGl0KCd1c2VzIHByb3ZpZGVkIGxhYmVsJywgKCkgPT4ge1xuICAgICAgICBsZXQgbGFiZWxUZW1wbGF0ZSA9ICc8c3AtZHJvcGRvd24gc3Atb3B0aW9ucz1cIm9wdGlvbnNcIiBzcC1sYWJlbD1cInRoaXNMYWJlbFwiIC8+JyxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KGxhYmVsVGVtcGxhdGUpLFxuICAgICAgICAgICAgbGFiZWxJbnB1dCA9IGZpbmRMYWJlbElucHV0KGVsZW1lbnQpO1xuICAgICAgICBleHBlY3QobGFiZWxJbnB1dC52YWx1ZS50cmltKCkpLnRvRXF1YWwoJ3RoaXNMYWJlbCcpO1xuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIH0pO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
