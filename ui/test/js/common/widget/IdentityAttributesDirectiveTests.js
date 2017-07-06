System.register(['test/js/TestInitializer', 'common/widget/WidgetModule', 'common/model/ModelModule'], function (_export) {
    'use strict';

    var widgetModule, modelModule;
    return {
        setters: [function (_testJsTestInitializer) {}, function (_commonWidgetWidgetModule) {
            widgetModule = _commonWidgetWidgetModule['default'];
        }, function (_commonModelModelModule) {
            modelModule = _commonModelModelModule['default'];
        }],
        execute: function () {

            describe('IdentityAttributesDirective', function () {
                var elDef = '<sp-identity-attributes sp-identity="identity" />',
                    linkElDef = '<sp-identity-attributes sp-identity="identity" sp-navigate-to-identity-func="navFunc(identitySummary)" />',
                    element = undefined,
                    $scope = undefined,
                    $compile = undefined,
                    attrs = undefined,
                    navigateFunc = undefined;

                beforeEach(module(widgetModule, modelModule));

                beforeEach(inject(function ($rootScope, _$compile_, IdentityAttributes) {
                    $compile = _$compile_;
                    $scope = $rootScope.$new();

                    attrs = new IdentityAttributes({
                        attributes: [{
                            attributeName: 'attr1',
                            label: 'Label 1',
                            value: 'value1'
                        }, {
                            attributeName: 'noValueAttr',
                            label: 'Label 2',
                            value: null
                        }, {
                            attributeName: 'arrayAttr',
                            label: 'Label 3',
                            value: ['val1', 'val2']
                        }, {
                            attributeName: 'identityAttr',
                            label: 'Label 4',
                            value: {
                                id: '123',
                                name: 'authorizedIdentity',
                                displayName: 'Authorized Identity'
                            },
                            authorizedToView: true
                        }, {
                            attributeName: 'unauthzIdentityAttr',
                            label: 'Label 5',
                            value: {
                                id: '911',
                                name: 'unauthorizedIdentity',
                                displayName: 'Unauthorized Identity'
                            },
                            authorizedToView: false
                        }]
                    });

                    navigateFunc = jasmine.createSpy('navigateFunc');
                }));

                afterEach(function () {
                    if (element) {
                        element.remove();
                    }
                });

                function compile(withIdentity, withLink) {
                    var def = withLink ? linkElDef : elDef;

                    if (withIdentity) {
                        $scope.identity = attrs;
                    }
                    if (withLink) {
                        $scope.navFunc = navigateFunc;
                    }

                    element = angular.element(def);
                    $compile(element)($scope);
                    $scope.$digest();
                }

                function hasLoadingMask() {
                    return element.find('.loading-mask').length > 0;
                }

                it('shows loading mask until the identity is loaded', function () {
                    compile(false, true);

                    expect(hasLoadingMask()).toEqual(true);

                    $scope.identity = attrs;
                    $scope.$digest();

                    expect(hasLoadingMask()).toEqual(false);
                });

                function findAttributeRowByLabel(label) {
                    var labelEls = element.find('.label-column:contains(\'' + label + '\')');
                    var rows = labelEls.parent();
                    return rows.length > 0 ? angular.element(rows[0]) : null;
                }

                it('hides attributes with no value', function () {
                    compile(true, false);
                    var attr = findAttributeRowByLabel(attrs.attributes[1].label);
                    expect(attr).toBeNull();
                });

                it('renders the label', function () {
                    compile(true, false);
                    var attr = findAttributeRowByLabel(attrs.attributes[0].label);
                    expect(attr).not.toBeNull();
                });

                describe('link', function () {
                    function hasLink(rowElt) {
                        expect(rowElt).not.toBeNull();
                        var link = rowElt.find('a');
                        return link.length > 0;
                    }

                    it('is not rendered if no navigation function is provided', function () {
                        compile(true, false);
                        var attr = findAttributeRowByLabel(attrs.attributes[3].label);
                        expect(hasLink(attr)).toEqual(false);
                    });

                    it('is not rendered if the user is not authorized', function () {
                        compile(true, true);
                        var attr = findAttributeRowByLabel(attrs.attributes[4].label);
                        expect(hasLink(attr)).toEqual(false);
                    });

                    it('is rendered for identity references', function () {
                        compile(true, true);
                        var attr = findAttributeRowByLabel(attrs.attributes[3].label);
                        expect(hasLink(attr)).toEqual(true);
                    });

                    it('calls the navigation function when clicked', function () {
                        compile(true, true);
                        var attr = findAttributeRowByLabel(attrs.attributes[3].label);
                        var link = attr.find('a');
                        link.click();
                        expect(navigateFunc).toHaveBeenCalledWith(attrs.attributes[3].value);
                    });
                });

                describe('value', function () {
                    function getValue(rowElt) {
                        expect(rowElt).not.toBeNull();
                        return rowElt.find('span').text().trim();
                    }

                    it('is rendered normally for a string', function () {
                        compile(true, false);
                        var attr = findAttributeRowByLabel(attrs.attributes[0].label);
                        expect(getValue(attr)).toEqual(attrs.attributes[0].value);
                    });

                    it('is rendered as an identity display name for an identity', function () {
                        compile(true, false);
                        var attr = findAttributeRowByLabel(attrs.attributes[3].label);
                        expect(getValue(attr)).toEqual(attrs.attributes[3].value.displayName);
                    });

                    it('is rendered as a comma-separated string for an array', function () {
                        compile(true, false);
                        var attr = findAttributeRowByLabel(attrs.attributes[2].label);
                        expect(getValue(attr)).toEqual('val1, val2');
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi93aWRnZXQvSWRlbnRpdHlBdHRyaWJ1dGVzRGlyZWN0aXZlVGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLENBQUMsMkJBQTJCLDhCQUE4Qiw2QkFBNkIsVUFBVSxTQUFTO0lBQTFIOztJQUdJLElBQUksY0FBYztJQUNsQixPQUFPO1FBQ0gsU0FBUyxDQUFDLFVBQVUsd0JBQXdCLElBQUksVUFBVSwyQkFBMkI7WUFDakYsZUFBZSwwQkFBMEI7V0FDMUMsVUFBVSx5QkFBeUI7WUFDbEMsY0FBYyx3QkFBd0I7O1FBRTFDLFNBQVMsWUFBWTs7WUFKN0IsU0FBUywrQkFBK0IsWUFBTTtnQkFDMUMsSUFBSSxRQUFRO29CQUNSLFlBQ0k7b0JBQ0osVUFBTztvQkFBRSxTQUFNO29CQUFFLFdBQVE7b0JBQUUsUUFBSztvQkFBRSxlQUFZOztnQkFFbEQsV0FBVyxPQUFPLGNBQWM7O2dCQUVoQyxXQUFXLE9BQU8sVUFBQyxZQUFZLFlBQVksb0JBQXVCO29CQUM5RCxXQUFXO29CQUNYLFNBQVMsV0FBVzs7b0JBRXBCLFFBQVEsSUFBSSxtQkFBbUI7d0JBQzNCLFlBQVksQ0FBQzs0QkFDVCxlQUFlOzRCQUNmLE9BQU87NEJBQ1AsT0FBTzsyQkFDUjs0QkFDQyxlQUFlOzRCQUNmLE9BQU87NEJBQ1AsT0FBTzsyQkFDUjs0QkFDQyxlQUFlOzRCQUNmLE9BQU87NEJBQ1AsT0FBTyxDQUFFLFFBQVE7MkJBQ2xCOzRCQUNDLGVBQWU7NEJBQ2YsT0FBTzs0QkFDUCxPQUFPO2dDQUNILElBQUk7Z0NBQ0osTUFBTTtnQ0FDTixhQUFhOzs0QkFFakIsa0JBQWtCOzJCQUNuQjs0QkFDQyxlQUFlOzRCQUNmLE9BQU87NEJBQ1AsT0FBTztnQ0FDSCxJQUFJO2dDQUNKLE1BQU07Z0NBQ04sYUFBYTs7NEJBRWpCLGtCQUFrQjs7OztvQkFJMUIsZUFBZSxRQUFRLFVBQVU7OztnQkFHckMsVUFBVSxZQUFNO29CQUNaLElBQUksU0FBUzt3QkFD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aWJ1dGVzRGlyZWN0aXZlVGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgJ3Rlc3QvanMvVGVzdEluaXRpYWxpemVyJztcclxuaW1wb3J0IHdpZGdldE1vZHVsZSBmcm9tICdjb21tb24vd2lkZ2V0L1dpZGdldE1vZHVsZSc7XHJcbmltcG9ydCBtb2RlbE1vZHVsZSBmcm9tICdjb21tb24vbW9kZWwvTW9kZWxNb2R1bGUnO1xyXG5cclxuZGVzY3JpYmUoJ0lkZW50aXR5QXR0cmlidXRlc0RpcmVjdGl2ZScsICgpID0+IHtcclxuICAgIGxldCBlbERlZiA9ICc8c3AtaWRlbnRpdHktYXR0cmlidXRlcyBzcC1pZGVudGl0eT1cImlkZW50aXR5XCIgLz4nLFxyXG4gICAgICAgIGxpbmtFbERlZiA9XHJcbiAgICAgICAgICAgICc8c3AtaWRlbnRpdHktYXR0cmlidXRlcyBzcC1pZGVudGl0eT1cImlkZW50aXR5XCIgc3AtbmF2aWdhdGUtdG8taWRlbnRpdHktZnVuYz1cIm5hdkZ1bmMoaWRlbnRpdHlTdW1tYXJ5KVwiIC8+JyxcclxuICAgICAgICBlbGVtZW50LCAkc2NvcGUsICRjb21waWxlLCBhdHRycywgbmF2aWdhdGVGdW5jO1xyXG5cclxuICAgIGJlZm9yZUVhY2gobW9kdWxlKHdpZGdldE1vZHVsZSwgbW9kZWxNb2R1bGUpKTtcclxuXHJcbiAgICBiZWZvcmVFYWNoKGluamVjdCgoJHJvb3RTY29wZSwgXyRjb21waWxlXywgSWRlbnRpdHlBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgJGNvbXBpbGUgPSBfJGNvbXBpbGVfO1xyXG4gICAgICAgICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG5cclxuICAgICAgICBhdHRycyA9IG5ldyBJZGVudGl0eUF0dHJpYnV0ZXMoe1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZTogJ2F0dHIxJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTGFiZWwgMScsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ3ZhbHVlMSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZTogJ25vVmFsdWVBdHRyJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTGFiZWwgMicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbFxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVOYW1lOiAnYXJyYXlBdHRyJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTGFiZWwgMycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogWyAndmFsMScsICd2YWwyJ11cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZTogJ2lkZW50aXR5QXR0cicsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0xhYmVsIDQnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJzEyMycsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2F1dGhvcml6ZWRJZGVudGl0eScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdBdXRob3JpemVkIElkZW50aXR5J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRUb1ZpZXc6IHRydWVcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZTogJ3VuYXV0aHpJZGVudGl0eUF0dHInLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdMYWJlbCA1JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICc5MTEnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1bmF1dGhvcml6ZWRJZGVudGl0eScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdVbmF1dGhvcml6ZWQgSWRlbnRpdHknXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXV0aG9yaXplZFRvVmlldzogZmFsc2VcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbmF2aWdhdGVGdW5jID0gamFzbWluZS5jcmVhdGVTcHkoJ25hdmlnYXRlRnVuYycpO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKHdpdGhJZGVudGl0eSwgd2l0aExpbmspIHtcclxuICAgICAgICBsZXQgZGVmID0gKHdpdGhMaW5rKSA/IGxpbmtFbERlZiA6IGVsRGVmO1xyXG5cclxuICAgICAgICBpZiAod2l0aElkZW50aXR5KSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pZGVudGl0eSA9IGF0dHJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2l0aExpbmspIHtcclxuICAgICAgICAgICAgJHNjb3BlLm5hdkZ1bmMgPSBuYXZpZ2F0ZUZ1bmM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGRlZik7XHJcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcclxuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhc0xvYWRpbmdNYXNrKCkge1xyXG4gICAgICAgIHJldHVybiAoZWxlbWVudC5maW5kKCcubG9hZGluZy1tYXNrJykubGVuZ3RoID4gMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXQoJ3Nob3dzIGxvYWRpbmcgbWFzayB1bnRpbCB0aGUgaWRlbnRpdHkgaXMgbG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbXBpbGUoZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICBleHBlY3QoaGFzTG9hZGluZ01hc2soKSkudG9FcXVhbCh0cnVlKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlkZW50aXR5ID0gYXR0cnM7XHJcbiAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGhhc0xvYWRpbmdNYXNrKCkpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZmluZEF0dHJpYnV0ZVJvd0J5TGFiZWwobGFiZWwpIHtcclxuICAgICAgICBsZXQgbGFiZWxFbHMgPSBlbGVtZW50LmZpbmQoYC5sYWJlbC1jb2x1bW46Y29udGFpbnMoJyR7bGFiZWx9JylgKTtcclxuICAgICAgICBsZXQgcm93cyA9IGxhYmVsRWxzLnBhcmVudCgpO1xyXG4gICAgICAgIHJldHVybiAocm93cy5sZW5ndGggPiAwKSA/IGFuZ3VsYXIuZWxlbWVudChyb3dzWzBdKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaXQoJ2hpZGVzIGF0dHJpYnV0ZXMgd2l0aCBubyB2YWx1ZScsICgpID0+IHtcclxuICAgICAgICBjb21waWxlKHRydWUsIGZhbHNlKTtcclxuICAgICAgICBsZXQgYXR0ciA9IGZpbmRBdHRyaWJ1dGVSb3dCeUxhYmVsKGF0dHJzLmF0dHJpYnV0ZXNbMV0ubGFiZWwpO1xyXG4gICAgICAgIGV4cGVjdChhdHRyKS50b0JlTnVsbCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JlbmRlcnMgdGhlIGxhYmVsJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbXBpbGUodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIGxldCBhdHRyID0gZmluZEF0dHJpYnV0ZVJvd0J5TGFiZWwoYXR0cnMuYXR0cmlidXRlc1swXS5sYWJlbCk7XHJcbiAgICAgICAgZXhwZWN0KGF0dHIpLm5vdC50b0JlTnVsbCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ2xpbmsnLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gaGFzTGluayhyb3dFbHQpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHJvd0VsdCkubm90LnRvQmVOdWxsKCk7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gcm93RWx0LmZpbmQoJ2EnKTtcclxuICAgICAgICAgICAgcmV0dXJuIChsaW5rLmxlbmd0aCA+IDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2lzIG5vdCByZW5kZXJlZCBpZiBubyBuYXZpZ2F0aW9uIGZ1bmN0aW9uIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgbGV0IGF0dHIgPSBmaW5kQXR0cmlidXRlUm93QnlMYWJlbChhdHRycy5hdHRyaWJ1dGVzWzNdLmxhYmVsKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhc0xpbmsoYXR0cikpLnRvRXF1YWwoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnaXMgbm90IHJlbmRlcmVkIGlmIHRoZSB1c2VyIGlzIG5vdCBhdXRob3JpemVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICBsZXQgYXR0ciA9IGZpbmRBdHRyaWJ1dGVSb3dCeUxhYmVsKGF0dHJzLmF0dHJpYnV0ZXNbNF0ubGFiZWwpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFzTGluayhhdHRyKSkudG9FcXVhbChmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyByZW5kZXJlZCBmb3IgaWRlbnRpdHkgcmVmZXJlbmNlcycsICgpID0+IHtcclxuICAgICAgICAgICAgY29tcGlsZSh0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgbGV0IGF0dHIgPSBmaW5kQXR0cmlidXRlUm93QnlMYWJlbChhdHRycy5hdHRyaWJ1dGVzWzNdLmxhYmVsKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhc0xpbmsoYXR0cikpLnRvRXF1YWwodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdjYWxscyB0aGUgbmF2aWdhdGlvbiBmdW5jdGlvbiB3aGVuIGNsaWNrZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGxldCBhdHRyID0gZmluZEF0dHJpYnV0ZVJvd0J5TGFiZWwoYXR0cnMuYXR0cmlidXRlc1szXS5sYWJlbCk7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gYXR0ci5maW5kKCdhJyk7XHJcbiAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KG5hdmlnYXRlRnVuYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoYXR0cnMuYXR0cmlidXRlc1szXS52YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgndmFsdWUnLCAoKSA9PiB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWUocm93RWx0KSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChyb3dFbHQpLm5vdC50b0JlTnVsbCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm93RWx0LmZpbmQoJ3NwYW4nKS50ZXh0KCkudHJpbSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXQoJ2lzIHJlbmRlcmVkIG5vcm1hbGx5IGZvciBhIHN0cmluZycsICgpID0+IHtcclxuICAgICAgICAgICAgY29tcGlsZSh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGxldCBhdHRyID0gZmluZEF0dHJpYnV0ZVJvd0J5TGFiZWwoYXR0cnMuYXR0cmlidXRlc1swXS5sYWJlbCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChnZXRWYWx1ZShhdHRyKSkudG9FcXVhbChhdHRycy5hdHRyaWJ1dGVzWzBdLnZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoJ2lzIHJlbmRlcmVkIGFzIGFuIGlkZW50aXR5IGRpc3BsYXkgbmFtZSBmb3IgYW4gaWRlbnRpdHknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBsZXQgYXR0ciA9IGZpbmRBdHRyaWJ1dGVSb3dCeUxhYmVsKGF0dHJzLmF0dHJpYnV0ZXNbM10ubGFiZWwpO1xyXG4gICAgICAgICAgICBleHBlY3QoZ2V0VmFsdWUoYXR0cikpLnRvRXF1YWwoYXR0cnMuYXR0cmlidXRlc1szXS52YWx1ZS5kaXNwbGF5TmFtZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KCdpcyByZW5kZXJlZCBhcyBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgZm9yIGFuIGFycmF5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21waWxlKHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgbGV0IGF0dHIgPSBmaW5kQXR0cmlidXRlUm93QnlMYWJlbChhdHRycy5hdHRyaWJ1dGVzWzJdLmxhYmVsKTtcclxuICAgICAgICAgICAgZXhwZWN0KGdldFZhbHVlKGF0dHIpKS50b0VxdWFsKCd2YWwxLCB2YWwyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
