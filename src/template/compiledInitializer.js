
Class("wipeout.template.compiledInitializer", function () {
	    
    compiledInitializer.getPropertyFlags = function(name) {
        
        var flags = name.indexOf("--");
        if (flags === -1)
            return {
                flags: [],
                name: wipeout.utils.obj.camelCase(name)
            };
        
        return {
            flags: name.substr(flags + 2).toLowerCase().split("-"),
            name: wipeout.utils.obj.camelCase(name.substr(0, flags))
        };
    };
    
    function compiledInitializer(template) {
        
        this.setters = {};
        
        // add attribute properties
        enumerateObj(template.attributes, this.addAttribute, this);
        
        // add element properties
        enumerateArr(template, this.addElement, this);
        
        if(!this.setters.model) {
            this.setters.model = new wipeout.template.propertySetter(new wipeout.template.templateAttribute("$parent ? $parent.model : null", null));
        }
    };
    
    compiledInitializer.prototype.addElement = function (element) {
        
        if (element.nodeType !== 1) return;
        
        var name = compiledInitializer.getPropertyFlags(element.name).name;
        if (this.setters.hasOwnProperty(name)) throw "The property \"" + name + "\"has been set more than once.";
        
        for (var val in element.attributes) {
            if (val === "value" || val.indexOf("value--") === 0) {
                enumerateArr(element, function(child) {
                    if (child.nodeType !== 3 || !child.serialize().match(/^\s*$/))
                        throw "You cannot set the value both in attributes and with elements." //TODO
                });
                
                this.setters[name] = new wipeout.template.propertySetter(element.attributes[val], compiledInitializer.getPropertyFlags(val).flags);
                return;
            }
        }
        
        var p = element.attributes.parser || element.attributes.parsers;
        if (!p && element._parentElement && element._parentElement.name) {
            var parent = wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element._parentElement.name))
            if (parent && parent.getGlobalParser) //TODO better way
                p = parent.getGlobalParser(name);
        }
            
        if (!p) {                
            for (var i = 0, ii = element.length; i < ii; i++) {
                if (element[i].nodeType === 1) {
                    this.setters[name] = new wipeout.template.propertySetter({
						xml: element[i],
						constructor: wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element[i].name)),
                    }, ["templateElementSetter"]);

                    return;
                }
            }
        }

        if (p && p.constructor === Function) {
            this.setters[name] = new wipeout.template.propertySetter(element);
            this.setters[name].parser = p;
        } else if (p) {
            this.setters[name] = new wipeout.template.propertySetter(element, compiledInitializer.getPropertyFlags("--" + p.value).flags);
        } else {
            this.setters[name] = new wipeout.template.propertySetter(element);
        }
    };
    
    compiledInitializer.prototype.addAttribute = function (attribute, name) {
        
        // spit name and flags
        name = compiledInitializer.getPropertyFlags(name);
        if (this.setters[name.name]) throw "The property \"" + name.name + "\" has been set more than once.";

        this.setters[name.name] = new wipeout.template.propertySetter(attribute, name.flags);
    };
    
    compiledInitializer.prototype.initialize = function (viewModel, renderContext) { 
        
        var disposal = [this.set(viewModel, renderContext, "model")];
        
		for (var name in this.setters)
            if (name !== "model")
            	disposal.push(this.set(viewModel, renderContext, name));
		
		return function () {
			enumerateArr(disposal.splice(0, disposal.length), function (d) {
				if (d)
					d.dispose();
			});
		}
    };
    
    compiledInitializer.prototype.set = function (viewModel, renderContext, name) {
		if (!this.setters[name]) return;
		
        // use binding type, globally defined binding type or default binding type
        var bt = this.setters[name].bindingType || 
            (viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(name)) || 
            "ow";
		
		if (!wipeout.htmlBindingTypes[bt]) throw "Invalid binding type :\"" + bt + "\" for property: \"" + name + "\".";

        return wipeout.htmlBindingTypes[bt](viewModel, this.setters[name], name, renderContext);
    };
    
    compiledInitializer.getAutoParser = function (value) {
		
        var output = new Function("value", "propertyName", "renderContext", "with (renderContext) return " + value + ";");
        output.wipeoutAutoParser = true;
        
        return output;
    };
        
    return compiledInitializer;
});