
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
        
        if (!(owner instanceof wipeout.base.watched)) {
            throw "In order to create a bound template property the owner must inherit from \"wipeout.base.watched.\"";
        }
        
        if (owner.__woBag.boundTemplates) {
            if (owner.__woBag.boundTemplates[templateIdProperty])
                throw "This template ID property is already bound to another template";
        } else {
            owner.__woBag.boundTemplates = {};
            owner.__woBag.boundTemplates[templateIdProperty] = true;
        }
        
        function onTemplateIdChange(oldVal, newVal) {            
            wipeout.template.engine.instnace.getTemplateXml(newVal, function (template) {
                owner.__woBag.boundTemplates[templateIdProperty] = template;    //TODO: test
                owner[templateProperty] = template;
            }); 
        }
        
        function onTemplateChange(oldVal, newVal) {
            if (owner.__woBag.boundTemplates[templateIdProperty] === newVal)
                owner.__woBag.boundTemplates[templateIdProperty] = true;
            else
                owner[templateIdProperty] = wipeout.viewModels.contentControl.createAnonymousTemplate(newVal);
        }
        
        onTemplateIdChange(null, owner[templateIdProperty]);
        
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