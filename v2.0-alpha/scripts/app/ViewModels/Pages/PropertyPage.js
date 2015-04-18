compiler.registerClass("wipeoutDocs.viewModels.pages.propertyPage", "wo.view", function() {
    function propertyPage() {
        this._super("wipeoutDocs.viewModels.pages.propertyPage");
        
        this.usagesTemplateId = ko.computed(function() {
            if(this.model()) {
                var name = this.model().fullyQualifiedName() + propertyPage.classUsagesTemplateSuffix;
                if(document.getElementById(name))
                    return name;
            }

            return wo.contentControl.getBlankTemplateId();
        }, this);
    };
    
    propertyPage.classUsagesTemplateSuffix = "_PropertyUsages";
    
    return propertyPage;
});