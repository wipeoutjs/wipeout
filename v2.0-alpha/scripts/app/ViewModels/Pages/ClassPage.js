
    compiler.registerClass("wipeoutDocs.viewModels.pages.classPage", "wo.view", function() {
        var classPage = function() {
            this._super("wipeoutDocs.viewModels.pages.classPage");

            this.computed("usagesTemplateId", function() {
                if(this.model) {
                    var className = this.model.classFullName + classPage.classUsagesTemplateSuffix;
                    if(document.getElementById(className))
                        return className;
                }

                return wo.content.createAnonymousTemplate("");
            });
        };

        classPage.classUsagesTemplateSuffix = "_ClassUsages";
        
        return classPage;
    });