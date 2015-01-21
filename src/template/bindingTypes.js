
//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.template.bindingTypes", function () {  
    
    function bindingTypes() {
    }
    
    function getParser (forViewModel, propertyName, setter) {
        var globalParser = forViewModel instanceof wipeout.base.bindable ?
            forViewModel.getGlobalParser(propertyName) :
            null;
        
        // use parser, global parser or lazy create auto parser
        return setter.parser || 
            globalParser ||
            (setter.parser = wipeout.template.compiledInitializer.getAutoParser(setter.valueAsString()));
    }
    
    //TODO: remove global setter: get it from view model
    bindingTypes.nb = function (viewModel, setter, name, renderContext) {
        
        var parser = getParser(viewModel, name, setter);
        
        viewModel[name] = parser(parser.xmlParserTempName ? setter.value : setter.valueAsString(), name, renderContext);
    };
    
    bindingTypes.ow = function (viewModel, setter, name, renderContext) {
        
        if (!(viewModel instanceof wipeout.base.watched))
            return bindingTypes.nb(viewModel, setter, name, renderContext);
        
        var parser = getParser(viewModel, name, setter);
        
        viewModel.computed(name, parser, {
            "value": parser.xmlParserTempName ? setter.value : setter.valueAsString(), 
            "propertyName": name,
            "renderContext": renderContext
        });
    };
    
    var VALID_FOR_OWTS_BINDING = /^\s*[\$\w\((\s*)\.(\s*))]+\s*$/;
    bindingTypes.owts = function (viewModel, setter, name, renderContext) {
        
        var val;
        if (!VALID_FOR_OWTS_BINDING.test(val = setter.valueAsString()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";

        //TODO: this is very non standard
        val = val
            .replace(/\$this/g, "renderContext.$this")
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