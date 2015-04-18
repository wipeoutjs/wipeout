compiler.registerClass("wipeoutDocs.viewModels.pages.functionPage", "wo.view", function() {
    var functionPage = function() {
        this._super("wipeoutDocs.viewModels.pages.functionPage");
        
        this.showCode = ko.observable(false);
        
        this.showReturnValue = true;
                
        this.usagesTemplateId = ko.computed(function() {
            if(this.model()) {
                var name = this.model().fullyQualifiedName() + functionPage.classUsagesTemplateSuffix;
                if(document.getElementById(name))
                    return name;
            }

            return wo.contentControl.getBlankTemplateId();
        }, this);
    };
    
    functionPage.classUsagesTemplateSuffix = "_FunctionUsages";
    
    return functionPage;
});