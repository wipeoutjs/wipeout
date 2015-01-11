
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
    
    var woBagStart = "wo_templateProperty";
    contentControl.createTemplatePropertyFor = function(owner, templateIdProperty, templateProperty) {
        ///<summary>Binds the template property to the templateId property so that a changee in one reflects a change in the other</summary>
        ///<param name="owner" type="wipeout.base.watched" optional="false">The owner of the template and template id properties</param>
        ///<param name="templateIdProperty" type="String" optional="false">The name of the templateId property</param>
        ///<param name="templateProperty" type="String" optional="false">The name of the template property.</param>
        
        var pendingLoad, setTemplate = owner[templateProperty], setTemplateId = owner[templateIdProperty];
        
        function refreshTemplate(templateId) {
            pendingLoad = wipeout.template.engine.instance.getTemplateXml(templateId, function (template) {
                pendingLoad = null;                
                setTemplate = owner[templateProperty] = template;
            }); 
        }
        
        // bind template to template id
        refreshTemplate(setTemplateId);
        
        function onTemplateIdChange(oldVal, newVal) {
            if (newVal === setTemplateId) {
                setTemplateId = null;
                return;
            }
            
            setTemplateId = null;
                
            if (pendingLoad)
                pendingLoad.cancel();
            
            refreshTemplate(newVal);
        }
        
        function onTemplateChange(oldVal, newVal) {
            if (newVal === setTemplate) {
                setTemplate = null;
                return;
            }
            
            setTemplate = null;
            setTemplateId = owner[templateIdProperty] = wipeout.viewModels.contentControl.createAnonymousTemplate(newVal);
        }
        
        var d1 = owner.observe(templateIdProperty, onTemplateIdChange);        
        var d2 = owner.observe(templateProperty, onTemplateChange);
        
        var output = {
            dispose: function() {
                d1.dispose();
                d2.dispose();
            }
        };
        
        if (owner instanceof wipeout.base.bindable)
            owner.registerDisposable(output);
        
        return output;
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
    
    return contentControl;
});