
    compiler.registerClass("wipeoutDocs.viewModels.pages.classPage", "wo.view", function() {
        var classPage = function() {
            this._super("wipeoutDocs.viewModels.pages.classPage");

            this.usagesTemplateId = ko.computed(function() {
                if(this.model()) {
                    var className = this.model().classFullName + classPage.classUsagesTemplateSuffix;
                    if(document.getElementById(className))
                        return className;
                }

                return wo.contentControl.getBlankTemplateId();
            }, this);
        };

        classPage.classUsagesTemplateSuffix = "_ClassUsages";
        
        return classPage;
    });