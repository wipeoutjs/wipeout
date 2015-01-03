
//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.template.bindingTypes", function () {  
    
    function bindingTypes() {
    }
    
    bindingTypes.nb = function (setter, globalSetter, name, renderContext) {
        // use parser or lazy create auto parser
        var parser = 
            setter.parser || 
            (globalSetter && globalSetter.parser) ||
            (setter.parser = wipeout.template.compiledInitializer.getAutoParser(setter.value));
        
        renderContext.$data[name] = parser(setter.value, name, renderContext);
    };
    
    var VALID_FOR_TW_BINDING = /^\s*[\$\w\((\s*)\.(\s*))]+\s*$/;
    bindingTypes.ow = function (setter, globalSetter, name, renderContext) {
        // use parser or lazy create auto parser
        var parser = 
            setter.parser || 
            (globalSetter && globalSetter.parser) ||
            (setter.parser = wipeout.template.compiledInitializer.getAutoParser(setter.value));
        
        renderContext.$data.computed(name, parser, {
            "value": setter.value, 
            "propertyName": name,
            "renderContext": renderContext
        });
    };
    
    bindingTypes.owts = function (setter, globalSetter, name, renderContext) {
        if (!VALID_FOR_TW_BINDING.test(setter.value))
            throw "Setter \"" + value + "\" must reference only one value when binding back to the source.";

        //TODO: this is very non standard
        var val = setter.value
            .replace(/\$data/g, "renderContext.$data")
            .replace(/\$parent/g, "renderContext.$parent")
            .split(".");

        var pn = val[val.length - 1], p = val.splice(1, val.length - 2).join("."), rc = val[0] === "renderContext";
        renderContext.$data.observe(name, function (oldVal, newVal) {
            var current = rc ? renderContext : window[val[0]];
            if(current = wipeout.utils.obj.getObject(p, current))
                current[pn] = newVal;
        });
    };
    
    bindingTypes.tw = function (setter, globalSetter, name, renderContext) {
        bindingTypes.ow(setter, globalSetter, name, renderContext);
        bindingTypes.owts(setter, globalSetter, name, renderContext);
    };
    
    return bindingTypes;

});