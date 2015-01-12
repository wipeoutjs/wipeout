
Class("wipeout.viewModels.contentControl", function () {    

    var contentControl = wipeout.viewModels.view.extend(function contentControl(templateId, model) {
        ///<summary>Expands on visual and view functionality to allow the setting of anonymous templates</summary>
        ///<param name="templateId" type="string" optional="true">The template id. If not set, defaults to a blank template</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        this._super(templateId || wipeout.viewModels.visual.getBlankTemplateId(), model);

        ///<Summary type="String">The template which corresponds to the templateId for this item</Summary>
        this.template = "";
        
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "templateId", "template");
    });  
    
    contentControl.addGlobalParser("template", "string");
    
    contentControl.createTemplatePropertyFor = function(owner, templateIdProperty, templateProperty) {
        ///<summary>Binds the template property to the templateId property so that a changee in one reflects a change in the other</summary>
        ///<param name="owner" type="wipeout.base.watched" optional="false">The owner of the template and template id properties</param>
        ///<param name="templateIdProperty" type="String" optional="false">The name of the templateId property</param>
        ///<param name="templateProperty" type="String" optional="false">The name of the template property.</param>
                
        return new boundTemplate(owner, templateIdProperty, templateProperty);
    };
    
    contentControl.createAnonymousTemplate = (function () {
        
        var i = Math.floor(Math.random() * 1000000000), 
            anonymousTemplateId = "WipeoutAnonymousTemplate",
            templateStringCache = {};
        
        function newTemplateId () {
            return anonymousTemplateId + "-" + (++i);
        }
                
        return function (templateStringOrXml) {
            ///<summary>Creates an anonymous template within the DOM and returns its id</summary>
            ///<param name="templateString" type="String" optional="false">Gets a template id for an anonymous template</param>
            ///<returns type="String">The template id</returns>

            if (typeof templateStringOrXml === "string") {
                if (!templateStringCache[templateStringOrXml]) {
                    var id = newTemplateId();
                    wipeout.template.engine.instance.setTemplate(id, templateStringOrXml);
                    templateStringCache[templateStringOrXml] = id;
                }

                return templateStringCache[templateStringOrXml];
            } else {
                if (!templateStringOrXml[anonymousTemplateId]) {
                    var id = newTemplateId();
                    wipeout.template.engine.instance.setTemplate(id, templateStringOrXml);
                    templateStringOrXml[anonymousTemplateId] = id;
                }

                return templateStringOrXml[anonymousTemplateId];
            }
        };
    })();
    
    function boundTemplate (owner, templateIdProperty, templateProperty) {
        ///<summary>Binds the template property to the templateId property so that a changee in one reflects a change in the other</summary>
        ///<param name="owner" type="wipeout.base.watched" optional="false">The owner of the template and template id properties</param>
        ///<param name="templateIdProperty" type="String" optional="false">The name of the templateId property</param>
        ///<param name="templateProperty" type="String" optional="false">The name of the template property.</param>
      
        //TODO: this.setTemplate and this.setTemplateId should use watched.beforeNextObserveCycle or watched.afterNextObserveCycle        
        
        this.pendingLoad = null;
        this.setTemplate = owner[templateProperty];
        this.setTemplateId = owner[templateIdProperty];
        
        this.owner = owner;
        this.templateIdProperty = templateIdProperty;
        this.templateProperty = templateProperty;
        
        // bind template to template id for the first time
        this.refreshTemplate(this.setTemplateId);
        
        this.d1 = owner.observe(templateIdProperty, this.onTemplateIdChange, this);        
        this.d2 = owner.observe(templateProperty, this.onTemplateChange, this);
    };
        
    boundTemplate.prototype.dispose = function() {
        this.d1.dispose();
        this.d2.dispose();
    };
    
    boundTemplate.prototype.refreshTemplate = function(templateId) {
        this.pendingLoad = wipeout.template.engine.instance.getTemplateXml(templateId, (function (template) {
            this.pendingLoad = null;                
            this.setTemplate = this.owner[this.templateProperty] = template;
        }).bind(this)); 
    }

    boundTemplate.prototype.onTemplateIdChange = function(oldVal, newVal) {
        if (newVal === this.setTemplateId) {
            this.setTemplateId = null;
            return;
        }

        this.setTemplateId = null;

        if (this.pendingLoad)
            this.pendingLoad.cancel();

        this.refreshTemplate(newVal);
    }

    boundTemplate.prototype.onTemplateChange = function(oldVal, newVal) {
        if (newVal === this.setTemplate) {
            this.setTemplate = null;
            return;
        }

        this.setTemplate = null;
        this.setTemplateId = this.owner[this.templateIdProperty] = wipeout.viewModels.contentControl.createAnonymousTemplate(newVal);
    }
    
    return contentControl;
});