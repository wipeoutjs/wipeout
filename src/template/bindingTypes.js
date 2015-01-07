
//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.template.bindingTypes", function () {  
    
    function bindingTypes() {
    }
    
    //TODO: remove global setter: get it from view model
    bindingTypes.nb = function (viewModel, setter, name, renderContext) {
        var globalParser = viewModel instanceof wipeout.base.bindable ?
            viewModel.getGlobalParser(name) :
            null;
        
        // use parser, global parser or lazy create auto parser
        var parser = 
            setter.parser || 
            globalParser ||
            (setter.parser = wipeout.template.compiledInitializer.getAutoParser(setter.value));
        
        viewModel[name] = parser(setter.value, name, renderContext);
    };
    
    bindingTypes.ow = function (viewModel, setter, name, renderContext) {
        var globalParser = viewModel instanceof wipeout.base.bindable ?
            viewModel.getGlobalParser(name) :
            null;
        
        // use parser or lazy create auto parser
        var parser = 
            setter.parser || 
            globalParser ||
            (setter.parser = wipeout.template.compiledInitializer.getAutoParser(setter.value));
        
        viewModel.computed(name, parser, {
            "value": setter.value, 
            "propertyName": name,
            "renderContext": renderContext
        });
    };
    
    var VALID_FOR_OWTS_BINDING = /^\s*[\$\w\((\s*)\.(\s*))]+\s*$/;
    bindingTypes.owts = function (viewModel, setter, name, renderContext) {
        
        if (!VALID_FOR_OWTS_BINDING.test(setter.value))
            throw "Setter \"" + value + "\" must reference only one value when binding back to the source.";

        //TODO: this is very non standard
        var val = setter.value
            .replace(/\$data/g, "renderContext.$data")
            .replace(/\$parent/g, "renderContext.$parent")
            .split(".");

        var pn = val[val.length - 1], p = val.splice(1, val.length - 2).join("."), rc = val[0] === "renderContext";
        viewModel.observe(name, function (oldVal, newVal) {
            var current = rc ? renderContext : window[val[0]];
            if(current = wipeout.utils.obj.getObject(p, current))
                current[pn] = newVal;
        });
    };
    
    bindingTypes.tw = function (viewModel, setter, name, renderContext) {
        
        bindingTypes.ow(viewModel, setter, name, renderContext);
        bindingTypes.owts(viewModel, setter, name, renderContext);
    };
    
    return bindingTypes;
});