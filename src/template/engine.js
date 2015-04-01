
Class("wipeout.template.engine", function () {
        
    function engine () {
        this.templates = {};
        
        this.xmlIntializers = new wipeout.utils.dictionary;
    }
    
    engine.prototype.setTemplate = function (templateId, template) {
		if (!templateId) throw "Invalid template id";
		
        if (typeof template === "string")
            template = wipeout.wml.wmlParser(template);
		else if (template.nodeType === 2)
            template = wipeout.wml.wmlParser(template.value);
        
        return this.templates[templateId] = new wipeout.template.rendering.compiledTemplate(template);
    };
    
    engine.prototype.getTemplateXml = function (templateId, callback) {  
		templateId = fixTemplateId(templateId);      
        return this.compileTemplate(templateId, (function() {
            callback(this.templates[templateId].xml);
        }).bind(this));
    };
    
	var fixTemplateId = (function () {
		var blankTemplateId;
		return function (templateId) {
			return templateId ||
				blankTemplateId || 
				(blankTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate(""));
		};
	}());
	
    engine.prototype.compileTemplate = function (templateId, callback) {
        
		templateId = fixTemplateId(templateId);
			
        // if the template exists
        if (this.templates[templateId] instanceof wipeout.template.rendering.compiledTemplate) {
            callback(this.templates[templateId]);
            return null;
        }
        
        // if the template is in the middle of an async load
        if (this.templates[templateId] instanceof wipeout.template.loader) {
            return this.templates[templateId].add((function (template) {
                if (this.templates[templateId] instanceof wipeout.template.loader)
                    this.setTemplate(templateId, template);
                
                this.compileTemplate(templateId, callback);
            }).bind(this));
        } 
        
        if (!this.templates[templateId]) {
            
            // if the template exists in the DOM but has not been loaded
            var script;      
            if (script = document.getElementById(templateId)) {
                callback(this.setTemplate(templateId, trimToLower(script.tagName) === "script" ? script.text : script.innerHTML));
                return null;
            } 

            // if an async process has not been kicked off yet
            if (wipeout.settings.asynchronousTemplates) {                
                this.templates[templateId] = new wipeout.template.loader(templateId);
                return this.compileTemplate(templateId, callback);
            }
        }
        
        throw "Could not load template \"" + templateId + "\".";    //TODE
    };
    
    engine.prototype.getVmInitializer = function (xmlInitializer) {
        
        var tmp;
        return (tmp = this.xmlIntializers.value(xmlInitializer)) ?
            tmp :
            this.xmlIntializers.add(xmlInitializer, new wipeout.template.initialization.compiledInitializer(xmlInitializer));
    };
    
    engine.instance = new engine();
        
    return engine;
});