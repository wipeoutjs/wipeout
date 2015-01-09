
Class("wipeout.template.engine", function () {
    
    function engine () {
        this.templates = {};
        
        this.xmlIntializers = new wipeout.utils.dictionary;
    }
    
    engine.prototype.setTemplate = function (templateId, template) {
        if (typeof template === "string")
            template = wipeout.template.templateParser(template);
        
        return (this.templates[templateId] = {
            compiledTemplate: new wipeout.template.compiledTemplate(template),
            templateXml: template
        }).compiledTemplate;
    };
    
    engine.prototype.getTemplateXml = function (templateId, callback) {        
        return (this.getCompiledTemplate(templateId, function() {
            callback(this.templates[id].templateXml);
        })).bind(this);
    };
    
    engine.prototype.getCompiledTemplate = function (templateId, callback) {
        
        var script;
        if (this.templates[templateId]) {
            callback(this.templates[templateId].compiledTemplate);
            return true;
        } else if ((script = document.getElementById(templateId)) && wipeout.utils.obj.trimToLower(script.tagName) === "script") {
            callback(this.setTemplate(templateId, script.text));
            return true;
        } else if (wipeout.settings.asynchronousTemplates) {
            return wipeout.template.asyncLoader.instance.load(templateId, (function(template) {
                if(!this.templates[templateId])
                    this.setTemplate(templateId, template);
                
                this.getCompiledTemplate(templateId, callback);
            }).bind(this));
        } else {
            throw "Could not load template \"" + templateId + "\".";    //TODO
        }
    };
    
    engine.prototype.getVmInitializer = function (xmlInitializer) {
        
        var tmp;
        return (tmp = this.xmlIntializers.value(xmlInitializer)) ?
            tmp :
            this.xmlIntializers.add(xmlInitializer, new wipeout.template.compiledInitializer(xmlInitializer));
    };
    
    engine.instance = new engine();
        
    return engine;
});