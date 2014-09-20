
Class("wipeout.template.engine", function () {
    
    var engine = function engine() {
        ///<summary>The wipeout template engine, inherits from ko.templateEngine</summary>
    };
    engine.prototype = new ko.templateEngine();
    
    var $find = /\$find/;
    var $call = /\$call/;
    var $findAndCall = /\$findAndCall/;
    engine.createJavaScriptEvaluatorFunction = function(script) {
        ///<summary>Modify a block of script so that it's running context is bindingContext.$data first and biningContext second</summary>
        ///<param name="script" type="String">The script to modify</param>
        ///<returns type="Function">The compiled script</returns>
        
        var find = $find.test(script) ? "\n\tvar $find = wipeout.utils.find.create(bindingContext);" : "";
        
        // reuse existing $find
        var findAndCall = $findAndCall.test(script) ? "\n\tvar $findAndCall = wipeout.utils.findAndCall.create($find);" : "";
        
        var call = $call.test(script) ? "\n\tvar $call = wipeout.utils.call.create();" : "";
        
        return new Function("bindingContext", "with(bindingContext) {" + find + findAndCall + call + "\n\twith($data) {\n\t\treturn " + script + ";\n\t}\n}");
    }
    
    engine.createJavaScriptEvaluatorBlock = function(script) {
        ///<summary>Add a function to the static script cache or cretate and add a function from a string</summary>
        ///<param name="script" type="String or Function">A function or string to add to the script cache. A string will be passed through createJavaScriptEvaluatorFunction before being added as a Function</param>
        ///<returns type="String">A reference to the newly created script</returns>
        var scriptId = engine.newScriptId();
        
        if(script instanceof Function) {
            engine.scriptCache[scriptId] = script;
        } else {        
            engine.scriptCache[scriptId] = engine.createJavaScriptEvaluatorFunction(script); 
        }
               
        return engine.openCodeTag + scriptId + engine.closeCodeTag;
    };
    
    engine.prototype.createJavaScriptEvaluatorBlock = function(script) {
        ///<summary>Add a function to the static script cache or cretate and add a function from a string</summary>
        ///<param name="script" type="String or Function">A function or string to add to the script cache. A string will be passed through createJavaScriptEvaluatorFunction before being added as a Function</param>
        ///<returns type="String">A reference to the newly created script</returns>
        return engine.createJavaScriptEvaluatorBlock(script);
    };
    
    engine.prototype.rewriteTemplate = function (template, rewriterCallback, templateDocument) {
        ///<summary>First re-write the template via knockout, then re-write the template via wipeout</summary>
        ///<param name="template" type="String">The id of the template</param>
        ///<param name="rewriterCallback" type="Function">A function which will do the re-writing</param>
        ///<param name="templateDocument">The owner document</param>
        
        var script = document.getElementById(template);
        if (script instanceof HTMLElement) {        
            // if it is an anonymous template it will already have been rewritten
            if (!engine.scriptHasBeenReWritten.test(script.textContent)) {
                ko.templateEngine.prototype.rewriteTemplate.call(this, template, rewriterCallback, templateDocument);
            } else {
                this.makeTemplateSource(template, templateDocument).data("isRewritten", true);
            }
            
            this.wipeoutRewrite(script, rewriterCallback);
        } else {
            ko.templateEngine.prototype.rewriteTemplate.call(this, template, rewriterCallback, templateDocument);
        }
    };
    
    engine.wipeoutRewrite = function(xmlElement, rewriterCallback) {
        ///<summary>Recursively go through an xml element and replace all view models with render comments</summary>
        ///<param name="xmlElement" type="wipeout.template.templateElement">The template</param>
        ///<param name="rewriterCallback" type="Function">A function which will do the re-writing (provided by knockout)</param>
        if(wipeout.viewModels.visual.reservedTags[wipeout.utils.obj.trimToLower(xmlElement.name)]) {
            for(var i = 0; i < xmlElement.length; i++)
                if(xmlElement[i] instanceof wipeout.template.templateElement)
                    engine.wipeoutRewrite(xmlElement[i], rewriterCallback);
        } else {
            var newScriptId = engine.newScriptId();
            engine.xmlCache[newScriptId] = xmlElement;
            
            var tags = "<!-- ko";
            if(DEBUG)
                tags += " wipeout-type: '" + xmlElement.name + "',";
            
            var id = "null";
            if(xmlElement.attributes["id"])
                id = "'" + xmlElement.attributes["id"].value + "'";
            tags += " wo: { type: " + camelCase(xmlElement.name) + ", id: " + id + ", name: '" + xmlElement.name + "', initXml: '" + newScriptId + "'} --><!-- /ko -->";
            tags = wipeout.template.templateParser(rewriterCallback(tags));
            
            var index = xmlElement.parentElement.indexOf(xmlElement);
            //TODO: do this a bit better
            xmlElement.parentElement.splice(index, 1);
                        
            for(var i = tags.length - 1; i >= 0; i--)
                xmlElement.parentElement.splice(index, 0, tags[i]);
        }
    };
    
    engine.prototype.wipeoutRewrite = function(script, rewriterCallback) {
        ///<summary>Replace all wipeout views with render bindings</summary>
        ///<param name="script" type="HTMLElement">The template</param>
        ///<param name="rewriterCallback" type="Function">A function which will do the re-writing (provided by knockout)</param>
        
        var xmlTemplate = wipeout.template.templateParser(script.textContent);        
        var scriptContent = [];
        // do not use ii, xmlTemplate.childNodes may change
        for(var i = 0; i < xmlTemplate.length; i++) {            
            if(xmlTemplate[i] instanceof wipeout.template.templateElement)
                engine.wipeoutRewrite(xmlTemplate[i], rewriterCallback);
            
            scriptContent.push(xmlTemplate[i].serialize());
        }
        
        script.textContent = scriptContent.join("");
    };
    
    engine.prototype.renderTemplateSource = function (templateSource, bindingContext, options) {
        ///<summary>Build html from a template source</summary>
        ///<param name="templateSource" type="Object">The template</param>
        ///<param name="bindingContext" type="ko.bindingContext">The current binding context to apply to the template</param>
        ///<param name="options" type="Object">The knockout template options</param>
        ///<returns type="Array">An array of html nodes to insert</returns>
        
        // if data is not a view, cannot render.
        if (!(bindingContext.$data instanceof wipeout.viewModels.view))
            return [];
        
        var cached = templateSource['data']('precompiled');
        if (!cached) {
            cached = new wipeout.template.htmlBuilder(templateSource.text());
            templateSource['data']('precompiled', cached);
        }
        
        var output;
        
        // wrap in a computed so that observable evaluations will not propogate to the template engine
        ko.dependentObservable(function() {
            output = cached.render(bindingContext)
        }, this).dispose();
        
        return output;
    };
    
    // override functions for the sake of documentation
    if(DEBUG) {
        var override = function(toOverride) {
            engine.prototype[toOverride] = function () {
                ///<summary>Knockout native function</summary>
                
                ko.templateEngine.prototype[toOverride].apply(this, arguments);
            };
        };
        
        override("isTemplateRewritten");
        override("makeTemplateSource");
        override("renderTemplate");
    }
    
    engine.newScriptId = (function() {        
        var i = Math.floor(Math.random() * 10000);        
        return function() {
            ///<summary>Get a unique name for a script</summary>
            ///<returns type="String">A unique id</returns>
            return (++i).toString();
        };
    })();
    
    engine.xmlCache = {};
    engine.scriptCache = {};
    engine.openCodeTag = "<!-- wipeout_code: {"
    engine.closeCodeTag = "} -->";
    engine.scriptHasBeenReWritten = RegExp(engine.openCodeTag.replace("{", "\{") + "[0-9]+" + engine.closeCodeTag.replace("}", "\}"));
    
    engine.instance = new engine();
    
    return engine;
});