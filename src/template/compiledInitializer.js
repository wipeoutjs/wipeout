
Class("wipeout.template.compiledInitializer", function () {
    
    function setter (value, flags) {
        this.value = value;
        
        this.parser = [];
        this.bindingType = null;
        
        // process parseing and binding flags
        enumerateArr(flags || [], function (flag) {
            if (compiledInitializer.parsers[flag]) {
                this.parser.push(compiledInitializer.parsers[flag]);
            } else if (wipeout.template.bindingTypes[flag]) {
                if (this.bindingType)
                    throw "A binding type is already specified for this property.";
                
                this.bindingType = flag;
            }
        }, this);
        
        // if parser has already been processed
        if (!(this.parser instanceof Array))
            return;
        
        var p = this.parser;
        
        if (p.length === 1) {
            this.parser = p[0];
        } else if (p.length) {
            this.parser = function (value, propertyName, renderContext) {
                for(var i = 0, ii = p.length; i < ii; i++)
                    value = p[i](value, propertyName, renderContext);

                return value;
            };
            
            this.parser.xmlParserTempName = p[0].xmlParserTempName;
        } else {
            this.parser = null;
        }
    }
    
    setter.prototype.valueAsString = function () {
        return typeof this._valueAsString === "string" ?
            this._valueAsString :
            (this._valueAsString = this.value.serializeContent());
    };
    
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
            this.setters.model = new setter(new wipeout.template.templateAttribute("$parent ? $parent.model : null", null));
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
                
                this.setters[name] = new setter(element.attributes[val], compiledInitializer.getPropertyFlags(val).flags);
                return;
            }
        }
        
        var p = (element.attributes.parser || element.attributes.parsers);        
        if (!p) {
            var parent = wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element._parentElement.name))
            if (parent && parent.getGlobalParser) //TODO better way
                p = parent.getGlobalParser(name);
        }
            
        if (!p) {                
            for (var i = 0, ii = element.length; i < ii; i++) {
                if (element[i].nodeType === 1) {
                    return;
                    this.setters[name] = {
                        parser: compiledInitializer.parsers.createAndSet,
                        bindingType: "nb",
                        value: {
                            xml: element[i],
                            constructor: wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element[i].name)),
                        }
                    };

                    return;
                }
            }
        }

        if (p && p.constructor === Function) {
            this.setters[name] = new setter(element);
            this.setters[name].parser = p;
        } else if (p) {
            this.setters[name] = new setter(element, compiledInitializer.getPropertyFlags("--" + p.value).flags);
        } else {
            this.setters[name] = new setter(element);
        }
    };
    
    compiledInitializer.prototype.addAttribute = function (attribute, name) {
        
        // spit name and flags
        name = compiledInitializer.getPropertyFlags(name);
        if (this.setters[name.name]) throw "The property \"" + name.name + "\" has been set more than once.";

        this.setters[name.name] = new setter(attribute, name.flags);
    };
    
    compiledInitializer.prototype.initialize = function (viewModel, renderContext) { 
        
        enumerateObj(this.setters, function (setter, name) {
            
            // use binding type, globally defined binding type or default binding type
            var bt = setter.bindingType || 
                (viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBinding(name)) || 
                "ow";
            
            wipeout.template.bindingTypes[bt](viewModel, setter, name, renderContext);
        });
        
        return viewModel;
    };
    
    compiledInitializer.getAutoParser = function (value) {
                
        //TODO: this is very non standard
        value = "return " + value
            .replace(/\$this/g, "renderContext.$this")
            .replace(/\$parent/g, "renderContext.$parent") + ";";
        
        return new Function("value", "propertyName", "renderContext", value);
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
        "createAndSet": function (value, propertyName, renderContext) {
            //TODO: dispose
            var output = new value.constructor;
        
            wipeout.template.engine.instance
                .getVmInitializer(value.xml)
                .initialize(output, renderContext);
            
            return output;
        },
        /* //doesn't seem to be used
        "set": function (value, propertyName, renderContext) {
            return value;
        },*/        
        "template": function (value, propertyName, renderContext) {
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