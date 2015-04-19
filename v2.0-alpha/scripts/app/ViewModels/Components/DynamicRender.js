compiler.registerClass("wipeoutDocs.viewModels.components.dynamicRender", "wo.contentControl", function() {
    var dynamicRender = function() {
        this._super();
        
        this.content = null;
        
        this.templateId = wo.contentControl.createAnonymousTemplate("{{$this.content}}");
    };
    
    dynamicRender.prototype.onModelChanged = function(oldVal, newVal) {
        this._super(oldVal, newVal);
               
        var oldVal = this.content;
        
        if(newVal == null) {
            this.content = null;
        } else {
            var newVm = null;
            
            if(newVal instanceof wipeoutDocs.models.pages.landingPage) {
                newVm = new wipeoutDocs.viewModels.pages.landingPage();
            } else if(newVal instanceof wipeoutDocs.models.descriptions.class) {
                newVm = new wipeoutDocs.viewModels.pages.classPage();
            } else if(newVal instanceof wipeoutDocs.models.descriptions.event) {
                newVm = new wipeoutDocs.viewModels.pages.eventPage();
            } else if(newVal instanceof wipeoutDocs.models.descriptions.property) {
                newVm = new wipeoutDocs.viewModels.pages.propertyPage();
            } else if(newVal instanceof wipeoutDocs.models.descriptions.function) {
                newVm = new wipeoutDocs.viewModels.pages.functionPage();
            } else if(newVal instanceof wipeoutDocs.models.components.StaticPageTreeViewBranchTemplate) {
                newVm = new wo.view(newVal.templateId);
            } else {
                throw "Unknown model type";
            }
            
            newVm.model(newVal);
            this.content = newVm;
        }
    };  
    
    return dynamicRender
});