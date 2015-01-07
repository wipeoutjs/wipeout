
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
            var model = "$parent ? $parent.model : null";
            this.setters.model = {
                value: model
            };
        }
    };
    
    compiledInitializer.prototype.addElement = function (element) {
        
        if (element.nodeType !== 1) return;
        
        var name = compiledInitializer.getPropertyFlags(element.name).name;
        if (this.setters[name]) throw "The property \"" + name + "\"has been set more than once.";
        
        for (var val in element.attributes) {
            if (val === "value" || val.indexOf("value--") === 0) {
                enumerateArr(element, function(child) {
                    if (child.nodeType !== 3 || !child.serialize().match(/^\s*$/))
                        throw "You cannot set the value both in attributes and with elements." //TODO
                });
                
                this.setters[name] = {
                    parser: [],
                    bindingType: null,
                    value: element.attributes[val].value
                };
                
                this.addFlags(this.setters[name], compiledInitializer.getPropertyFlags(val).flags);
                this.combineParser(name);
                return;
            }
        }
        
        var p = (element.attributes.parser || element.attributes.parsers);        
        if (!p) {
            for (var i = 0, ii = element.length; i < ii; i++) {
                if (element[i].nodeType === 1) {
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
        
        this.setters[name] = {
            parser: [],
            bindingType: null,
            value: element.serializeChildren()
        };

        if (p)
            this.addFlags(this.setters[name], compiledInitializer.getPropertyFlags("--" + p.value).flags);
        this.combineParser(name);
    };
    
    compiledInitializer.prototype.addAttribute = function (attribute, name) {
        
        // spit name and flags
        name = compiledInitializer.getPropertyFlags(name);
        if (this.setters[name.name]) throw "The property \"" + name.name + "\"has been set more than once.";

        this.setters[name.name] = {
            parser: [],
            bindingType: null,
            value: attribute.value
        };

        // process parseing and binding flags
        this.addFlags(this.setters[name.name], name.flags);
        
        this.combineParser(name.name);
    };
    
    compiledInitializer.prototype.addFlags = function (setter, flags) {
        // process parseing and binding flags
        enumerateArr(flags, function (flag) {
            if (compiledInitializer.parsers[flag]) {
                setter.parser.push(compiledInitializer.parsers[flag]);
            } else if (wipeout.template.bindingTypes[flag]) {
                if (setter.bindingType)
                    throw "A binding type is already specified for this property.";
                
                setter.bindingType = flag;
            }
        }, this);
    };
    
    compiledInitializer.prototype.combineParser = function (name) {
        
        // if parser has already been processed
        if (!(this.setters[name].parser instanceof Array))
            return;
        
        var p = this.setters[name].parser;
        
        if (p.length === 1)
            this.setters[name].parser = p[0];
        else if (p.length)
            this.setters[name].parser = function (value, propertyName, renderContext) {
                for(var i = 0, ii = p.length; i < ii; i++)
                    value = p[i](value, propertyName, renderContext);

                return value;
            };
        else 
            this.setters[name].parser = null;
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
            .replace(/\$data/g, "renderContext.$data")
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
        
            wipeout.template.newEngine.instance
                .getVmInitializer(value.xml)
                .initialize(output, renderContext);
            
            return output;
        },
        "set": function (value, propertyName, renderContext) {
            return value;
        }
    };
    
    compiledInitializer.parsers.j = compiledInitializer.parsers["json"];
    compiledInitializer.parsers.s = compiledInitializer.parsers["string"];
    compiledInitializer.parsers.b = compiledInitializer.parsers["bool"];
    compiledInitializer.parsers.i = compiledInitializer.parsers["int"];
    compiledInitializer.parsers.f = compiledInitializer.parsers["float"];
    compiledInitializer.parsers.r = compiledInitializer.parsers["regexp"];
    compiledInitializer.parsers.d = compiledInitializer.parsers["date"];
        
    return compiledInitializer;
});