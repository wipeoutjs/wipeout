compiler.registerClass("wipeoutDocs.viewModels.pages.functionPage", "wo.view", function() {
    var functionPage = function() {
        this._super("wipeoutDocs.viewModels.pages.functionPage");
        
        this.showCode = false;
        
        this.showReturnValue = true;
                
        this.computed("usagesTemplateId", function() {
            if(this.model) {
                var name = this.model.fullyQualifiedName + functionPage.classUsagesTemplateSuffix;
                if(document.getElementById(name))
                    return name;
            }

            return wo.contentControl.createAnonymousTemplate("");
        });
    };
    
    functionPage.classUsagesTemplateSuffix = "_FunctionUsages";
    
    return functionPage;
});

wo.filters.yesNo = {
	parentToChild: function (val1) {
		return val1 ? "Yes" : "No";
	},
	childToParent: function (val1) {
		return /^\s*[Yy][Ee][Ss]\s*$/.test(val1);
	}
};