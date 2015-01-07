
Class("wipeout.template.newEngine", function () {
    
    function engine () {
        this.compiledTemplates = {};
        
        this.xmlIntializers = new wipeout.utils.dictionary;
    }
    
    engine.prototype.getTemplate = function (templateId) {
        
        if (this.compiledTemplates[templateId])
            return this.compiledTemplates[templateId];
        
        var script = document.getElementById(templateId);
        if (!script || wipeout.utils.obj.trimToLower(script.tagName) !== "script")
            throw {
                message: "Invalid script tag",
                scriptTag: script
            };
        
        return this.compiledTemplates[templateId] = 
            new wipeout.template.compiledTemplate(wipeout.template.templateParser(script.text));
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