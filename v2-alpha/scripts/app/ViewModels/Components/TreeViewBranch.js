compiler.registerClass("wipeoutDocs.viewModels.components.treeViewBranch", "wo.view", function() {
    var treeViewBranch = function() {
        this._super(treeViewBranch.nullTemplate);
        
        this.isOpen = false;
        
        this.computed("glyphClass", function() {
            var open = this.isOpen,
                model = this.model,
                hasBranches = model && model.branches && model.branches.length;
                        
            if(this.isOpen && hasBranches)                
                return "glyphicon glyphicon-chevron-down";
            if(model && model.href && !hasBranches)                
                return "glyphicon glyphicon-chevron-right";
            
            return "";
        });
		
		this.observe("model", function(oldVal, newVal) {

			if(newVal && (newVal.branches || newVal.href)) {
				this.templateId = treeViewBranch.branchTemplate;
			} else if(newVal) {
				this.templateId = treeViewBranch.leafTemplate;
			} else {
				this.templateId = treeViewBranch.nullTemplate;
			}
		}, {context: this});
    };
    
    treeViewBranch.branchTemplate = "wipeoutDocs.viewModels.components.treeViewBranch_branch";
    treeViewBranch.leafTemplate = "wipeoutDocs.viewModels.components.treeViewBranch_leaf";
    treeViewBranch.nullTemplate = wipeout.viewModels.content.createAnonymousTemplate("");
	
    treeViewBranch.prototype.select = function() {
        this.isOpen = !this.isOpen;
                
        if(this.model.href) {  
            if (this.isOpen || !this.model.branches || !this.model.branches.length) {
                history.pushState(null, "", this.model.href);
                crossroads.parse(location.pathname + location.search);
            }
        }
    };
    
    return treeViewBranch;
});