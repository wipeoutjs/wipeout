
Class("wipeout.template.engine", function () {
    
    function asyncLoader(templateName) {
        ///<summary>Private class for loading templates asynchronously</summary>
        ///<param name="templateName" type="string" optional="false">The name and url of this template</param>
        
        // specifies success callbacks for when template is loaded. If this property in null, the loading process has completed
        this._callbacks = [];
        
        // the name and url of the template to load
        this.templateName = templateName;
        
        if(!this._success) {
            var _this = this;
            wipeout.utils.obj.ajax({
                type: "GET",
                url: templateName,
                success: function(result) {
                    _this._success = true;
                    var callbacks = _this._callbacks;
                    delete _this._callbacks;
                    for(var i = 0, ii = callbacks.length; i < ii; i++)
                        callbacks[i](result.responseText);
                },
                error: function() {
                    delete _this._callbacks;
                    _this._success = false;
                    throw "Could not locate template \"" + templateName + "\"";
                }
            });
        }
    }
    
    asyncLoader.prototype.add = function(success) {
        ///<summary>Call success when this template is loaded</summary>
        ///<param name="success" type="Function" optional="false">The callback</param>
        ///<returns type="Boolean">True if the template is available, false if the template must be loaded</returns>
        
        if (this._callbacks) {
            this._callbacks.push(success);
            
            return {
                cancel: (function() {
                    var i;
                    if (this._callbacks && (i = this._callbacks.indexOf(success)) !== -1)
                        this._callbacks.splice(i, 1);
                }).bind(this)
            };
        }
        
        if (this._success) {
            success();
            return null;
        }
        
        throw "Could not load template \"" + this.templateName + "\"";
    }
    
    function engine () {
        this.templates = {};
        
        this.xmlIntializers = new wipeout.utils.dictionary;
    }
    
    engine.prototype.setTemplate = function (templateId, template) {
        if (typeof template === "string")
            template = wipeout.template.templateParser(template);
        
        return this.templates[templateId] = new wipeout.template.compiledTemplate(template);
    };
    
    engine.prototype.getTemplateXml = function (templateId, callback) {        
        return this.getCompiledTemplate(templateId, (function() {
            callback(this.templates[templateId].templateXml);
        }).bind(this));
    };
    
    //TODO: rename to compileTemplate
    engine.prototype.getCompiledTemplate = function (templateId, callback) {
        
        // if the template exists
        if (this.templates[templateId] instanceof wipeout.template.compiledTemplate) {
            callback(this.templates[templateId]);
            return null;
        }
        
        // if the template is in the middle of an async load
        if (this.templates[templateId] instanceof asyncLoader) {
            return this.templates[templateId].add((function (template) {
                if (this.templates[templateId] instanceof asyncLoader)
                    this.setTemplate(templateId, template);
                
                this.getCompiledTemplate(templateId, callback);
            }).bind(this));
        } 
        
        if (!this.templates[templateId]) {
            
            // if the template exists in the DOM but has not been loaded
            var script;      
            if ((script = document.getElementById(templateId)) && wipeout.utils.obj.trimToLower(script.tagName) === "script") {
                callback(this.setTemplate(templateId, script.text));
                return null;
            } 

            // if an async process has not been kicked off yet
            if (wipeout.settings.asynchronousTemplates) {                
                this.templates[templateId] = new asyncLoader(templateId);
                return this.getCompiledTemplate(templateId, callback);
            }
        }
        
        throw "Could not load template \"" + templateId + "\".";    //TODO
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