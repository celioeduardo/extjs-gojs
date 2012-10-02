Ext.define('Ux.gojs.CanvasGojs', {
    extend: 'Ext.Component',
    
    constructor: function(idDiv, opts) {
    	var me = this;
    	
    	me.idDiv = idDiv;
    	me.build = opts.build;
    	
    	var diagram = new go.Diagram(idDiv),
    		canvasEl = me.getCanvasElement();
    	
    	me.diagram = diagram;
    		
    	if (canvasEl){
    		dropTarget = Ext.create('Ext.dd.DropTarget', canvasEl.dom, {
			    ddGroup: opts.ddGroup,
			    notifyDrop: Ext.Function.bind(me.notifyDropTarget, me),
			    notifyOver: Ext.Function.bind(me.notifyOverTarget, me)
			});
			
			me.dropTarget = dropTarget;
			
			Ext.get(canvasEl).on('mouseup',this.onMouseUp, me, true);
    	}
    		    	
        me.callParent(arguments);
        
        //should use the correct scope
        if (Ext.isDefined(me.build)){
        	var build = Ext.Function.bind(me.build,me,[go.GraphObject.make, diagram]);
        	build();
        }
        
    },
    
    /**
     * @param go.GraphObject.make $
     * @param go.Diagram diagram
     */
    build: Ext.emptyFn,
    
    /**
     * @param Ext.dd.DragDrop ddSource
     * @param Event e
     * @param Object data
     */
    notifyDrop: Ext.emptyFn,
    
    /**
     * @param Ext.dd.DragDrop ddSource
     * @param Event e
     * @param Object data
     */
    notifyOverTarget: function(ddSource, e, data){
    	var me = this,
    		part = me.getPartByEvent(me.diagram, e);
    	if (part && part.mouseDragEnter)
    		if (part.mouseDragEnter(e,ddSource, data, part))
    			return Ext.dd.DropZone.prototype.dropAllowed;
    		else
    			return Ext.dd.DropZone.prototype.dropNotAllowed;
    	else
    		return Ext.dd.DropZone.prototype.dropNotAllowed;
    },
    
    notifyDropTarget:function(ddSource, e, data){
    	var me = this,
    		part = me.getPartByEvent(me.diagram, e);
    	if (part && part.mouseDrop)
    		return part.mouseDrop(e,ddSource, data, part);
    	else
    		return false;
    },
    
    /**
     * @private
     * @param Event e
     */
    onMouseUp: function(e){
    	Ext.dd.DragDropManager.handleMouseUp(e);
    },
    
    getDiagram: function(){
    	return this.diagram;
    },
    
    getPartByEvent:function(diagram, e){
    	var txy = Ext.get(e.getTarget()).getXY(),
    	exy = e.getXY(),
    	x = exy[0] - txy[0],
    	y = exy[1] - txy[1],
    	coord = this.diagram.transformViewToDoc(new go.Point(x,y)),
    	part = this.diagram.findPartAt(coord);
    	return part;	
    },
    
    getCanvasElement: function(){
    	var div = Ext.get(this.idDiv);
    	if (!div)
    		return null;
    	var canvas = div.select("canvas");
    	if (canvas.getCount() == 0)
    		return null;
    	return canvas.item(0);
    }

});

