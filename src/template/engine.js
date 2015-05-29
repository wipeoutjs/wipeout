
Class("wipeout.template.engine", function () {
        
    function engine () {
		///<summary>The wipeout template engine</summary>
		
		///<summary type="Object">Cached templates</summary>
        this.templates = {};
        
		///<summary type="wipeout.utils.dictionary">Cached view model initializers</summary>
        this.xmlIntializers = new wipeout.utils.dictionary;
    }
    
    engine.prototype.setTemplate = function (templateId, template) {
		///<summary>Associate a template string with a template id</summary>
        ///<param name="templateId" type="String">The template id</param>
        ///<param name="template" type="String|wipeout.wml.wmlAttribute">The template</param>
        ///<returns type="wipeout.template.rendering.compiledTemplate">The compiled template</returns>
		
		if (!templateId) throw "Invalid template id";
		
        if (typeof template === "string")
            template = wipeout.wml.wmlParser(template);
		else if (template.nodeType === 2)
            template = wipeout.wml.wmlParser(template.value);
        
        return this.templates[templateId] = new wipeout.template.rendering.compiledTemplate(template);
    };
    
    engine.prototype.getTemplateXml = function (templateId, callback) {  
		///<summary>Load a template and pass the value to a callback. The load may be synchronus (if the template exists) or asynchronus) if the template has to be loaded.</summary>
        ///<param name="templateId" type="String">The template id</param>
        ///<param name="callback" type="Function">The callback</param>
        ///<returns type="Object">Null, if the template is loaded, an object with a "cancel" function to cancel the load</returns>
	
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
				(blankTemplateId = wipeout.viewModels.content.createAnonymousTemplate(""));
		};
	}());
	
    engine.prototype.compileTemplate = function (templateId, callback) {
		///<summary>Load a template and pass the value to a callback. The load may be synchronus (if the template exists) or asynchronus) if the template has to be loaded.</summary>
        ///<param name="templateId" type="String">The template id</param>
        ///<param name="callback" type="Function">The callback</param>
        ///<returns type="Object">Null, if the template is loaded, an object with a "cancel" function to cancel the load</returns>
        
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
    
    engine.prototype.getVmInitializer = function (wmlInitializer) {
		///<summary>Get a compiled initializer from a piece of wml</summary>
        ///<param type="wipeout.wml.wmlElement" name="wmlInitializer">The xml</param>
        ///<returns type="wipeout.template.initialization.compiledInitializer">The initializer</returns>
		
        var tmp;
        return (tmp = this.xmlIntializers.value(wmlInitializer)) ?
            tmp :
            this.xmlIntializers.add(wmlInitializer, new wipeout.template.initialization.compiledInitializer(wmlInitializer));
    };
    
    engine.instance = new engine();
        
    return engine;
});