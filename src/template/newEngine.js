
Class("wipeout.template.newEngine", function () {

    // only used once in app, so not bothering with prototype
    function dictionary () {
        var keyArray = [], valueArray = [];
        
        this.add = function (key, value) {
            var i = keyArray.indexOf(key);
            i === -1 ? (keyArray.push(key), valueArray.push(value)) : valueArray[i] = value;
            
            return value;
        };
        
        this.value = function (key) {
            return valueArray[keyArray.indexOf(key)];
        };
    }    
    
    function engine () {
        this.compiledTemplates = {};
        
        this.xmlIntializers = new dictionary();
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
        return tmp = this.xmlIntializers.value(xmlInitializer) ?
            tmp :
            this.xmlIntializers.add(xmlInitializer, new wipeout.template.compiledInitializer(xmlInitializer));
    };
    
    engine.instance = new engine();
        
    return engine;
});