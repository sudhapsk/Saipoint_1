function showTabPane(id, index) {
  displayAppropriatePane(id, 'button'+index);
  Ext.getDom('editForm:activeTab').value = index;
}

var isPageDirty = false;
function makePageDirty() {
  isPageDirty = true;
  // Return false so that we don't accidentally submit the form
  return false;
}

function initTabs() {

  var tabContainer = Ext.getDom('systemSetupTabs');
  if (tabContainer == null) 
      return;

  var tabPanel = new Ext.TabPanel({
      id: 'identitySettingsTabPan',
      renderTo:'systemSetupTabs',
      border:false,
      plain: true,
      activeTab: ACTIVE_TAB,
      width: Ext.getDom('systemSetupTabs').clientWidth,
      items: [
              {title: '#{msgs.sys_config_tab_mailsettings}', contentEl: 'mailPanelContent'},
              {title: '#{msgs.sys_config_tab_workItems}', contentEl: 'workItemPanelContent'},
              {title: '#{msgs.sys_config_tab_identities}', contentEl: 'identitiesPanelContent'},
              {title: '#{msgs.sys_config_tab_roles}', contentEl: 'rolePanelContent'},
              {title: '#{msgs.sys_config_tab_password}', contentEl: 'passwordPanelContent'},
              {title: '#{msgs.sys_config_tab_miscellaneous}', contentEl: 'miscPanelContent'}
      ]
  });
}

Ext.onReady(function() {
  initTabs();
});

function onHashSecretsChanged(el) {
    var IIQ_POLICY = 'Identity Password Policy';

    function doToggle() {
        makePageDirty();
        toggleInvalidFieldsForHashing(el.checked);
    }

    function containsIIQPolicy(values) {
        return Ext.Array.contains(values, IIQ_POLICY);
    }

    function isClientConfiguredForHash() {
        var trivial = Ext.getDom('editForm:passwordTriviality'),
            chars = Ext.getDom('editForm:minHistoryChars'),
            caseCheck = Ext.getDom('editForm:caseSensitiveCheck');

        return trivial.checked === false &&
               caseCheck.checked === false &&
               chars.value === '';
    }

    if (el.checked) {
        Ext.Ajax.request({
            url: SailPoint.getRelativeUrl('/rest/passwordPolicy/invalidHashPolicies'),
            success: function(response) {
                var result = Ext.JSON.decode(response.responseText),
                    tpl;

                // it could be the case that the identity policy that is currently
                // saved conflicts with hashing but they have made changes in the
                // UI that to solve the conflict so check to see if the policy is
                // conflicting and if it is check the pending changes
                if (containsIIQPolicy(result.objects) && isClientConfiguredForHash()) {
                    Ext.Array.remove(result.objects, IIQ_POLICY);
                }

                if (result.objects.length === 0) {
                    doToggle();
                } else {
                    el.checked = false;

                    tpl = new Ext.XTemplate(
                        '<p>#{msgs.sys_config_msg_invalid_constraints}</p>',
                        '<br />',
                        '<ul>',
                            '<tpl for=".">',
                                '<li>{.}</li>',
                            '</tpl>',
                        '</ul>'
                    );

                    Ext.MessageBox.show({
                        title: '#{msgs.sys_config_msg_invalid_constraints_title}',
                        buttons: Ext.MessageBox.OK,
                        modal: true,
                        msg: tpl.apply(result.objects)
                    });
                }
            },
            failure: function(response, opts) {
                SailPoint.EXCEPTION_ALERT(
                    "An error occurred while attempting to get conflicting password policies"
                );
            }
        });
    } else {
        doToggle();
    }
}

// Handler function to toggle and validate related fields for
// the 'Validate passwords against Identity attributes' feature
function onCheckPasswordsAgainstIdentityAttrs(el) {
    toggleCheckPasswordsAgainstIdentityAttrs(el.checked);
    validateCheckPasswordAgainstIdentityAttrs();
    makePageDirty();
}

// Toggles the input field based on the driving checkbox
function toggleCheckPasswordsAgainstIdentityAttrs(enabled) {
    var fields = [Ext.getDom('editForm:checkIdentityAttrMinLenLbl'),
                  Ext.getDom('editForm:imgHlpFilecheckIdentityAttrMinLen'),
                  Ext.getDom('editForm:checkIdentityAttrMinLen')];

    for (var i = 0; i < fields.length; i++) {
        field = fields[i];
        field.disabled = !enabled;
    }
}

// Ensures the value input is an integer. Replaces invalid
// values with the default '2'
function validateCheckPasswordAgainstIdentityAttrs() {
    var field = Ext.getDom('editForm:checkIdentityAttrMinLen');
    var fieldValue = parseInt(field.value);
    if ((isNaN(fieldValue) || field.value < 2) && !field.disabled) {
        field.value = 2;
    } else {
        // in case the original value != the parsed integer value
        field.value = fieldValue;
    }
}

function toggleInvalidFieldsForHashing(enabled) {
	toggleInvalidPolicyFieldsForHashing(enabled);
	
	var el = Ext.getDom('editForm:hashingIterations');
	if (el) {
		el.disabled = !enabled;
		SailPoint.toggleClass('.nothash', 'disabled', !enabled);
	}
}

function toggleInvalidPolicyFieldsForHashing(enabled) {
    var el, i, field, fields = [{
            id: 'editForm:passwordTriviality',
            isCheckbox: true
        }, {
            id: 'editForm:minHistoryChars',
            isCheckbox: false
        }, {
            id: 'editForm:caseSensitiveCheck',
            isCheckbox: true
        }];

    for (i = 0; i < fields.length; i++) {
        field = fields[i];

        el = Ext.getDom(field.id);
        if (el) {
            el.disabled = enabled;

            // if enabled then either uncheck or clear value
            if (enabled) {
                if (field.isCheckbox) {
                    el.checked = false;
                } else {
                    el.value = '';
                }
            }
        }
    }

    SailPoint.toggleClass('.hash', 'disabled', enabled);
}

Ext.onReady(function() {
    var el = Ext.getDom('editForm:hashIdentitySecrets');
    if (el) {
        toggleInvalidFieldsForHashing(el.checked);
    }
    el = Ext.getDom('editForm:checkPasswordsAgainstIdentityAttributes');
    if (el) {
        toggleCheckPasswordsAgainstIdentityAttrs(el.checked);
    }
});
