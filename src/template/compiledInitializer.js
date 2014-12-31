
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
        
        enumerateObj(template.attributes, function(item, property) {
            
            property = compiledInitializer.getPropertyFlags(property);
            if (setters[property.name]) throw "The property \"" + property.name + "\"has been set more than once.";
            
            setters[property.name] = {
                parser: [],
                bindingType: null,
                value: item.value
            };
            
            enumerateArr(property.flags, function (flag) {
                if (parser[flag]) {
                    setters[property.name].parser.push(parser[flag]);
                } else if (wipeout.template.bindingTypes[flag]) {
                    if (setters[property.name].bindingType)
                        throw "A binding type is already specified for this property.";
                        
                    setters[property.name].bindingType = flag;
                }
            });
            
            var p = setters[property.name].parser;
            if (p.length === 1)
                setters[property.name].parser = p[0];
            else if (p.length)
                setters[property.name].parser = function (value, propertyName, renderContext) {
                    for(var i = 0, ii = p.length; i < ii; i++)
                        value = p[i](value, propertyName, renderContext);
                    
                    return value;
                };
            else 
                setters[property.name].parser = null;
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