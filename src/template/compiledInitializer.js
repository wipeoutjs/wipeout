
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
        var setters = {};
        
        enumerateObj(template.attributes, function(item, flags) {
            
            var flags = compiledInitializer.getPropertyFlags(flags);
            if (setters[flags.name]) throw "The property \"" + flags.name + "\"has been set more than once.";
            
            setters[flags.name] = {
                parser: null,
                bindingType: null,
                value: item.value
            };
            
            enumerateArr(flags.flags, function (flag) {
                if (parser[flag]) {
                    if (setters[flags.name].parser) {
                        var p = setters[flags.name].parser;
                        setters[flags.name].parser = function(value, propertyName, renderContext) {
                            parser[flag](p(value, propertyName, renderContext), propertyName, renderContext);
                        };
                    } else {
                        setters[flags.name].parser = parser[flag];
                    }
                } else if (wipeout.template.bindingTypes[flag]) {
                    if (setters[flags.name].bindingType)
                        throw "A binding type is already specified for this property.";
                        
                    setters[flags.name].bindingType = flag;
                }
            });
        });
        
        /*
        enumerateArr(template, function(item) {
            
            if (setters[item.name]) throw "The property \"" + item.name + "\"has been set twice";
        });*/
        
        if(!setters.model) {
            var model = "$parent ? $parent.model : null";
            setters.model = {
                value: model
            };
        }
        
        this.setters = setters;
    };
    
    compiledInitializer.prototype.initialize = function (renderContext) {
        enumerateObj(this.setters, function (setter, name) {
            wipeout.template.bindingTypes[setter.bindingType || "ow"](setter, name, renderContext);
            
            //TODO: tw
        });
    };
    
    compiledInitializer.getAutoParser = function (value) {
        
        //TODO: this is very non standard
        value = "return " + value
            .replace(/\$data/g, "renderContext.$data")
            .replace(/\$parent/g, "renderContext.$parent") + ";";
        
        return new Function("value", "propertyName", "renderContext", value);
    };
    
    
    var parser = {
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
        }
    };
    
    parser.j = parser["json"];
    parser.s = parser["string"];
    parser.b = parser["bool"];
    parser.i = parser["int"];
    parser.f = parser["float"];
    parser.r = parser["regexp"];
    parser.d = parser["date"];
    
    
    
    return compiledInitializer;
});