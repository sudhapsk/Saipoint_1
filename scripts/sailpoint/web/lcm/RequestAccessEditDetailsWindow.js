Ext.ns('SailPoint.LCM');

Ext.define('SailPoint.LCM.RequestAccessEditDetailsWindow', {
  extend : 'Ext.window.Window',
  col_selected :  "IIQ_Selected",

  record: null,
  deselects : [],
  /** Panels **/
  formPanel : null,
  detailsPanel : null,
  allowActivationEditing : false,

  constructor : function(config){
    var me = this;
    this.record = config.record; // The record we originally got from the access request usually the rol we assigned
    this.mapRecordFields();

    var activationEditingField = Ext.get('allowActivationEditing');
    if(activationEditingField && activationEditingField.value=='true') {
      this.allowActivationEditing = true;
    }

    this.nativeIdentityStoreFactory =
      new SailPoint.component.NativeIdentityStoreFactory(this.record.get('identityId'),
          this.record.get('application'));

    this.nativeIdentityCombo = new SailPoint.component.NativeIdentityCombo({
      storeFactory: this.nativeIdentityStoreFactory,
      createRequested: true,
      forceSelection: true,
      width:375,
      fieldLabel: '#{msgs.label_account}',
      allowBlank: false
    });

    this.now = new Date();

    this.sunriseDate = new Ext.form.DateField({
      name:'sunrise', 
      id:'sunriseExtWin',
      vtype: 'daterange',
      labelSeparator: ' ',
      minValue: this.now,
      hidden: !this.allowActivationEditing,
      fieldLabel: '#{msgs.lcm_summary_role_activation}',
      endDateField: 'sunsetExtWin'
    });

    this.sunsetDate = new Ext.form.DateField({
      name:'sunset', 
      id:'sunsetExtWin', 
      vtype: 'daterange',
      labelSeparator: ' ',
      minValue: this.now,
      hidden: !this.allowActivationEditing,
      fieldLabel: '#{msgs.lcm_summary_role_deactivation}',
      startDateField: 'sunriseExtWin'
    }); 
    
    if(this.record.get('activation')) {
      this.sunriseDate.setValue(new Date(this.record.get('activation')));
    }
    
    if(this.record.get('deactivation')) {
      this.sunsetDate.setValue(new Date(this.record.get('deactivation')));
    }
    
    this.formPanel = Ext.create('Ext.form.Panel', {
      region: 'center',
      items: [this.sunriseDate, this.sunsetDate /** this.nativeIdentityCombo **/]
    });

    this.detailsPanel = Ext.create('Ext.panel.Panel', {
      height:250,
      bodyStyle: 'padding: 10px;',
      region: 'north',
      items: [{
        xtype: 'panel',
        region: 'north',
        tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<p class="permittedRoleDetailsInstructions"></p>',
                '<div class="permittedRoleDetails">',
                  '<table class="details">',
                    '<tr><td><label>#{msgs.name}:</label></td><td class="pl">{[Ext.String.htmlEncode(values.displayableName)]}</td></tr>',
                    '<tr><td><label>#{msgs.owner}:</label></td><td class="pl">{owner}</td></tr>',
                    '<tr><td><label>#{msgs.description}:</label></td><td class="pl">{description}</td></tr>',
                  '</table>',
                '</div>',
            '</tpl>'),
        data: this.recordMap
      },
      this.formPanel
      ]
    });

    var items = [this.detailsPanel];
    if (this.isEditingRole()) {
      this.grid = this.createGrid(config);

      items.push(this.grid);
    }

    Ext.apply(config, {
      title: Ext.String.format("#{msgs.lcm_request_access_edit_details}", Ext.String.htmlEncode(config.record.get('displayableName'))),
      id: 'editDetailsWin',
      layout:'border',
      width:768,
      height:500,
      items : items,
      selections : [],
      buttons: [
                 {
                   id: 'saveBtn',
                   text:"#{msgs.button_save}",
                   listeners: {
                     click: {
                       scope: me,
                       fn: me.commitRoleChanges
                     }
                   }
                 },
                 {
                   text:"#{msgs.button_cancel}",
                   cls: 'secondaryBtn',
                   window: this,
                   handler: function() {
                     Ext.getCmp('editDetailsWin').close();
                   }
                 }
               ]
    });
    Ext.apply(this, config);

    this.callParent(arguments);
  },

  commitRoleChanges: function() {
    var me = this;

    function assimilateSelections(selections) {
      var requests = [];
      Ext.each(selections, function(record) {
        var request = SailPoint.LCM.RequestAccess.createAccountRequestFromRecord(
          SailPoint.LCM.RequestAccess.ATTRIBUTE_OP_ADD,
          record,
          me.record.data.type
        );
        request.attributeRequests[0].args.permittedBy = me.record.data.name;
        // permitted requests should always be for detectedRoles attribute
        request.attributeRequests[0].name = SailPoint.LCM.RequestAccess.DETECTED;

        requests.push(request);
      });

      if(window.deselects.length > 0) {
        for(var i=0; i<window.deselects.length; i++) {
          record = window.deselects[i];
          requests.push(SailPoint.LCM.RequestAccess.createCartRemoveRequest(record));
        }
      }

      Ext.getDom("editForm:requestsJSON").value = Ext.JSON.encode(requests);
      Ext.getDom("editForm:updateRequestBtn").click();
      window.close();
    };

    var window = Ext.getCmp('editDetailsWin');

    if(window.allowActivationEditing) {
      if(window.sunriseDate.isValid() && window.sunsetDate.isValid()) {
        Ext.getDom("editForm:requestId").value = window.record.getId();
        Ext.getDom("editForm:activationDate").value = '';
        Ext.getDom("editForm:deactivationDate").value = '';
        var startDateObj = window.sunriseDate.getValue();
        var endDateObj = window.sunsetDate.getValue();

        if(startDateObj) {
          Ext.getDom("editForm:activationDate").value = startDateObj.getTime();
          window.record.set('activation', window.sunriseDate.getRawValue());
        }

        if(endDateObj) {
          Ext.getDom("editForm:deactivationDate").value = endDateObj.getTime();
          window.record.set('deactivation', window.sunsetDate.getRawValue());
        }

        window.record.commit();
      }
    }

    // only try to manage grid selections if we are editing a role request
    if (window.isEditingRole()) {
      var grid = Ext.getCmp('permittedRolesGrid');
      var selections = grid.getSelectionModel().getSelection();
      var exclusions;
      var selectCriteria = grid.getSelectionCriteria();

      if (selectCriteria.selectAll) {
        // get every record from the store except for exclusions
        exclusions = selectCriteria.exclusions || [];

        var selectAllStore = SailPoint.Store.createRestStore({
          fields: grid.gridMetaData.fields,
            autoLoad: false,
            url: grid.getStore().getProxy().url,
            sorters: [{ property : 'displayableName', direction : 'ASC' }],
            remoteSort: true,
            extraParams: {
              excludedIds: exclusions.join(","),
              selectAll: selectCriteria.selectAll,
              limit: 1000   // A thousand permitted roles should be enough for anybody.
            }
        });

        selectAllStore.load({
          scope: this,
          callback: function(records, operation, success) {
            if (!success) {
              SailPoint.FATAL_ERR_ALERT();
            } else {
              assimilateSelections(records);
            }
          }
        });
      } else {
        selections = grid.getSelectionModel().getSelection();
        assimilateSelections(selections);
      }
    }
  },

  isEditingRole: function() {
    return this.record.get('type') === 'Role';
  },

  mapRecordFields : function() {
    this.recordMap = {};
    this.recordMap.name = this.record.get('name');
    this.recordMap.displayableName = this.record.get('displayableName');
    this.recordMap.description = this.record.get('description');
    this.recordMap.owner = this.record.get('owner'); 
  },

  createGrid: function(config) {

    this.store = SailPoint.Store.createRestStore({
      fields: SailPoint.LCM.SummaryChanges.permittedRolesGridMetaData.fields,
      autoLoad: true,
      url: SailPoint.getRelativeUrl('/rest/roles/grid/' + this.record.get('objectId') + '/permits'),
      sorters: [{property : 'name', direction : 'ASC' }],
      remoteSort: true
    });

    this.grid = new SailPoint.grid.PagingCheckboxGrid({
      cls: 'smallFontGrid wrappingGrid',
      store: this.store,
      region: 'center',
      id: 'permittedRolesGrid',
      disableMouseTracking: true,
      pageSize: 5,
      gridMetaData: SailPoint.LCM.SummaryChanges.permittedRolesGridMetaData,
      viewConfig: {
        scrollOffset: 0,
        stripeRows: true
      }
    });

    this.store.on('load', function(store, records) {
      var toSelect = [];
      for(var i=0; i<records.length; i++) {
        if(records[i].get(this.col_selected)) {
          toSelect.push(records[i]);
        }
      }
      this.grid.getSelectionModel().select(toSelect, true);
    }, this);

    /** keep track of any records that were deselected from the grid so we can remove them **/
    this.grid.getSelectionModel().on('deselect', function(row, record) {
      this.deselects.push(record);
    }, this);

    return this.grid;
  }
});
