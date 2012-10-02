Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'Ux': './'
	}
});

Ext.require([
	'Ux.gojs.CanvasGojs'
]);

Ext.onReady(function(){

	var myData = [
	    { name : "Record 0", column1 : "0", column2 : "0" },
	    { name : "Record 1", column1 : "1", column2 : "1" },
	    { name : "Record 2", column1 : "2", column2 : "2" },
	    { name : "Record 3", column1 : "3", column2 : "3" },
	    { name : "Record 4", column1 : "4", column2 : "4" },
	    { name : "Record 5", column1 : "5", column2 : "5" },
	    { name : "Record 6", column1 : "6", column2 : "6" },
	    { name : "Record 7", column1 : "7", column2 : "7" },
	    { name : "Record 8", column1 : "8", column2 : "8" },
	    { name : "Record 9", column1 : "9", column2 : "9" }
	];

    // Generic fields array to use in both store defs.
    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'name', mapping : 'name'},
            {name: 'column1', mapping : 'column1'},
            {name: 'column2', mapping : 'column2'}
        ]
    });

    // create the data store
    var gridStore = Ext.create('Ext.data.Store', {
        model  : 'DataObject',
        data   : myData
    });

    // Column Model shortcut array
    var columns = [
        { id : 'name',      flex:  1,  header: "Record Name", sortable: true, dataIndex: 'name'},
        {header: "column1", width: 50, sortable: true, dataIndex: 'column1'},
        {header: "column2", width: 50, sortable: true, dataIndex: 'column2'}
    ];

    // declare the source Grid
    var grid = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store            : gridStore,
        columns          : columns,
        enableDragDrop   : true,
        stripeRows       : true,
        width            : 325,
        margins          : '0 2 0 0',
        region           : 'west',
        title            : 'Data Grid',
        selModel         : Ext.create('Ext.selection.RowModel', {singleSelect : true})
    });

    // Declare the text fields.  This could have been done inline, is easier to read
    // for folks learning :)
    var textField1 = Ext.create('Ext.form.field.Text', {
        fieldLabel : 'Record Name',
        name       : 'name'
    });

    var textField2 = Ext.create('Ext.form.field.Text', {
        fieldLabel : 'Column 1',
        name       : 'column1'
    });

    var textField3 = Ext.create('Ext.form.field.Text', {
        fieldLabel : 'Column 2',
        name       : 'column2'
    });

    // Setup the form panel
    var formPanel = Ext.create('Ext.form.Panel', {
        region     : 'center',
        title      : 'Generic Form Panel',
        bodyStyle  : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 100,
        margins    : '0 0 0 3',
        items      : [
            textField1,
            textField2,
            textField3
        ]
    });

    //Simple 'border layout' panel to house both grids
    Ext.create('Ext.Panel', {
        width    : 650,
        height   : 300,
        layout   : 'border',
        renderTo : 'panel',
        bodyPadding: 5,
        items    : [
            grid,
            formPanel
        ],
        bbar    : [
            '->', // Fill
            {
                text    : 'Reset Example',
                handler : function() {
                    //refresh source grid
                    gridStore.loadData(myData);
                    formPanel.getForm().reset();
                }
            }
        ]
    });

    /****
    * Setup Drop Targets
    ***/

    // This will make sure we only drop to the view container
    var formPanelDropTargetEl =  formPanel.body.dom;

    Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'GridExample',
        notifyOver: function(ddSource, e, data) {
        	return Ext.dd.DropZone.prototype.dropAllowed;
        },
        notifyEnter: function(ddSource, e, data) {

            //Add some flare to invite drop.
            formPanel.body.stopAnimation();
            formPanel.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Reference the record (single selection) for readability
            var selectedRecord = ddSource.dragData.records[0];

            // Load the record into the form
            formPanel.getForm().loadRecord(selectedRecord);
            return true;
        }
    });
    
    /**
     * CanvasGojs Definitions  
     */
    var canvasGojs = Ext.create('Ux.gojs.CanvasGojs', "diagramDiv", {
	    ddGroup: 'GridExample',
	    
	    build: function($, diagram){
	    	//$ "protected" by scope method. Avoiding problems with other libraries
	    	
	    	diagram.linkTemplateMap.add("",
				$(go.Link,
					{layerName:"Background",
					mouseDragEnter:function(e, ddSource, data, node){
						//Could be done some validation
						return true;
					},
					mouseDrop: function(e, ddSource, data, link, canvasExt){
						//Delegating through event
						return canvasExt.fireEvent('droppedOnLink',data,link);
					}},
					$(go.Shape,{strokeWidth: 5 }),
					$(go.Shape, { toArrow: "Standard", strokeWidth: 5 })));

			diagram.nodeTemplateMap.add("NodeA",
				$(go.Node, go.Panel.Auto,
					$(go.Shape,
					{figure: "RoundedRectangle",fill: "lightblue"},
					new go.Binding("fill","color")),
				$(go.TextBlock,
					{ margin: 5, alignment: go.Spot.Center},
					new go.Binding("text","text"))
    		    )
    		);
    		
    		diagram.nodeTemplateMap.add("NodeB",
				$(go.Node, go.Panel.Auto,{
					mouseDragEnter:function(e, ddSource, data, node){
						//Could be done some validation
						return true;
					},
					mouseDrop: function(e, ddSource, data, node, canvasExt){
						return canvasExt.fireEvent('droppedOnNodeB',data,node);
					}},
					$(go.Shape,
						{figure: "RoundedRectangle", fill: "lightgreen" },
						new go.Binding("fill","color")),
					$(go.TextBlock,
						{ margin: 5 },
					    new go.Binding("text","text"))
				)
			);
			
			nodeArray =[
				{key:"nodeA1", text:"I don't",category:"NodeA"},
				{key:"nodeB1", text:"I accept", category:"NodeB"}
			];
			
			linkArray =[
				{from:"nodeA1", to: "nodeB1"}
			];
			
			diagram.model = new go.GraphLinksModel(nodeArray,linkArray);
	    	
	    }
	});
	
	//Listening the events
	canvasGojs.on('droppedOnNodeB',function(data,node){
		var me = this,
			diagram = me.getDiagram(),
			values = data.records[0].data,
			novoNo = {key: values.column1,text: values.name, category:"NodeB"},
			newLink = {from: novoNo.key, to:node.data.key, layerName:"Background"};
			
		diagram.startTransaction("insert new node");
		diagram.model.addNodeData(novoNo);
		diagram.model.addLinkData(newLink);
		diagram.commitTransaction("insert new node");
		return true;
	});
	
	canvasGojs.on('droppedOnLink',function(data,link){
		var me = this,
			diagram = me.getDiagram(),
			values = data.records[0].data,
			novoNo = {key: values.column1,text: values.name, category:"NodeB"},
			toNode = link.toNode,
        	fromNode = link.fromNode,
        	newLink1 = {from: novoNo.key, to:toNode.data.key},
			newLink2 = {from: fromNode.data.key, to:novoNo.key};

		diagram.startTransaction("insert new node");
        diagram.model.removeLinkData(link.data);
		diagram.model.addNodeData(novoNo);
		diagram.model.addLinkData(newLink1);
		diagram.model.addLinkData(newLink2);
		diagram.commitTransaction("insert new node");
		return true;
		
	});

});