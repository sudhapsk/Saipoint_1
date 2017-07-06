/* (c) Copyright 2015 SailPoint Technologies, Inc., All Rights Reserved. */

Ext.ns('SailPoint.DiscoverDomains');
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '../ux');
Ext.onReady(function () {
        Ext.QuickTips.init();
        var isGCDataSaved = false;
        var gcVal = Ext.getDom('editForm:isGCSaved');
        if(gcVal.value) {
            isGCDataSaved = true;
            Ext.getDom('editForm:enable').checked=true;
        }
        SailPoint.DiscoverDomains.enableDiscover(isGCDataSaved);
});

Ext.require([
             'Ext.form.Panel',
             'Ext.ux.form.MultiSelect',
             'Ext.ux.form.ItemSelector'
         ]);

<!--// --><![CDATA[//><!--

// The index is the row number of the Domain table
// The domain parameter is sent to the connector which brings the corresponding
// servers
SailPoint.DiscoverDomains.showServers = function (index, domain) {
    var serverData = Ext.getDom('editForm:domainInfo:'+ index +':servers');
    var servers = serverData.value.split("\n");
    var data = [];
    var len = servers.length;
    var i;
    for (i=0; i < len; i++) {
        var temp = {"name": servers[i]};
        data.push(temp);
    }

     var ds = SailPoint.Store.createStore({
        url: CONTEXT_PATH + '/define/applications/discoverServers.json',
        fields: ['name','value'],
        autoLoad: true,
        baseParams: {domain : domain,
                     servers: servers}
    });
    
    var itemselectorField = new Ext.FormPanel({
        title: 'Select Servers for the Domain',
        width: 663,
        id:'selectServerId',
        bodyPadding: 4,
        height: 333,
        renderTo: 'itemselector',
        items:[{
            xtype: 'label',
            forId: 'availableServers',
            text: 'Available Servers',
            style: 'font-weight:bold; height:20px; width:150px;'
        }, {
            xtype: 'label',
            forId: 'selectedServers',
            text: 'Selected Servers',
            style: 'font-weight:bold; height:20px; width:100px; margin-left:200px;'
        }, {
            xtype: 'itemselector',
            name: 'itemselector',
            id: 'itemselectorField',
            shrinkWrap: 3, 
            anchor: '100%',
            imagePath: '../images/extjs-ux/',
            store:ds,
            displayField: 'name',
            valueField: 'name',
            allowBlank: true,
            msgTarget: 'side',
            fromTitle: 'Available',
            toTitle: 'Selected',
            listeners: {
                afterrender: function(field) {
                    var servers = [];
                    for(var key in data) {
                        servers.push(data[key].name);
                    }
                    field.setValue(servers);
                }
            }
        }]
    });

    var  serversWinID = Ext.create('Ext.window.Window', {
        id: 'serversWinID',
        height: 400,
        width: 675,
        modal: true,
        resizable: false,
        buttons: [{
                        text: 'Ok',
                        id: 'saveServers',
                        handler: function () {
                        this.setDisabled(false);
                        var serverStrings = '';
                        var itemField = Ext.getCmp('itemselectorField');
                        
                        if(itemField) {
                            var fieldList = itemField.toField;
                            var temp = fieldList.store.getRange();
                            var i=0;
                            var len = temp.length;
                            
                            for (i=0; i < len; i++) {
                                    if(i != 0)
                                        serverStrings += '\n';
                                    serverStrings += temp[i].data.name;
                            }
                        }
                        var obj = Ext.getDom('editForm:domainInfo:'+ index +':servers');
                        obj.value = serverStrings;
                        Ext.getCmp('serversWinID').close();
                }
        },
        {
                text: 'Cancel',
                id: 'cancelServer',
                handler: function () {
                        this.setDisabled(false);
                        Ext.getCmp('serversWinID').close();
                }
         }],
        bodyStyle: 'background-color: white; padding: 0px; overflow: auto',
        items:[itemselectorField]
    });

    Ext.getCmp('serversWinID').show();
};

SailPoint.DiscoverDomains.startDiscover = function (button) {
        Ext.getDom('domainResultsDiv').className = 'workingText';
        Ext.getDom('domainResultsDiv').innerHTML = '#{msgs.discover_domains}';
        button.disabled = true;
};

SailPoint.DiscoverDomains.endDiscover = function () {
        Ext.getDom('editForm:discoverButton').disabled = false;
};

SailPoint.DiscoverDomains.enableDiscover = function (isChecked) {
        if(isChecked === 'true' || isChecked === true){
            Ext.get('editForm:gcLabel').show();
            Ext.get('editForm:imgHlpGC').show();
            Ext.get('editForm:forestGC').show();
            Ext.get('editForm:gcAdminUserLabel').show();
            Ext.get('editForm:imgHlpGCAdminUser').show();
            Ext.get('editForm:forestAdmin').show();
            Ext.get('editForm:gcPwdLabel').show();
            Ext.get('editForm:imgHlpGCPwd').show();
            Ext.get('editForm:forestAdminPassword').show();
            Ext.get('editForm:discoverButton').show();
        }
        else {
            Ext.getDom('editForm:gcLabel').style.display = 'none';
            Ext.getDom('editForm:imgHlpGC').style.display = 'none';
            Ext.getDom('editForm:forestGC').style.display = 'none';
            Ext.getDom('editForm:gcAdminUserLabel').style.display = 'none';
            Ext.getDom('editForm:imgHlpGCAdminUser').style.display = 'none';
            Ext.getDom('editForm:forestAdmin').style.display = 'none';
            Ext.getDom('editForm:gcPwdLabel').style.display = 'none';
            Ext.getDom('editForm:imgHlpGCPwd').style.display = 'none';
            Ext.getDom('editForm:forestAdminPassword').style.display = 'none';
            Ext.getDom('editForm:discoverButton').style.display = 'none';
        }
}
// --><!]]>
