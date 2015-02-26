
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
        
        var disposal = [this.set(viewModel, renderContext, this.setters["model"], "model")];
        
        enumerateObj(this.setters, function (setter, name) {            
            if (name === "model") return;
            disposal.push(this.set(viewModel, renderContext, setter, name));
        }, this);
		
		return function () {
			enumerateArr(disposal.splice(0, disposal.length), function (d) {
				if (d)
					d.dispose();
			});
		}
    };
    
    compiledInitializer.prototype.set = function (viewModel, renderContext, setter, name) {
        // use binding type, globally defined binding type or default binding type
        var bt = setter.bindingType || 
            (viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(name)) || 
            "ow";

        return wipeout.htmlBindingTypes[bt](viewModel, setter, name, renderContext);
    };
    
    compiledInitializer.getAutoParser = function (value) {
		
        var output = new Function("value", "propertyName", "renderContext", "with (renderContext) return " + value + ";");
        output.wipeoutAutoParser = true;
        
        return output;
    };
    
    compiledInitializer.parsers = {
        "json": function (value, propertyName, renderContext) {
            return JSON.parse(value);
        },
        "string": function (value, propertyName, renderContext) {
            return value;
        },
        "bool": function (value, propertyName, renderContext) {
            var tmp = trimToLower(value);
            return tmp ? tmp !== "false" && tmp !== "0" : false;
        },
        "int": function (value, propertyName, renderContext) {
            return parseInt(trim(value));
        },
        "float": function (value, propertyName, renderContext) {
            return parseFloat(trim(value));
        },
        "regexp": function (value, propertyName, renderContext) {
            return new RegExp(trim(value));
        },
        "date": function (value, propertyName, renderContext) {
            return new Date(trim(value));
        },
        "template": function (value) {
            return value;
        },
        "viewModelId": function (value, propertyName, renderContext) {
            if (renderContext.$parent instanceof wipeout.viewModels.visual)
                renderContext.$parent.templateItems[value] = renderContext.$this;
            
            return value;
        }
    };
    
    //TODO: Rename
    compiledInitializer.parsers.template.xmlParserTempName = true;
    
    compiledInitializer.parsers.j = compiledInitializer.parsers["json"];
    compiledInitializer.parsers.s = compiledInitializer.parsers["string"];
    compiledInitializer.parsers.b = compiledInitializer.parsers["bool"];
    compiledInitializer.parsers.i = compiledInitializer.parsers["int"];
    compiledInitializer.parsers.f = compiledInitializer.parsers["float"];
    compiledInitializer.parsers.r = compiledInitializer.parsers["regexp"];
    compiledInitializer.parsers.d = compiledInitializer.parsers["date"];
        
    return compiledInitializer;
});