
//TODO: dispose of bindings

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
            value: parser.xmlParserTempName ? setter.value : setter.valueAsString(), 
            propertyName: name,
            renderContext: renderContext
        }, wipeout.template.renderContext.addRenderContext(parser));
    };
    
    bindingTypes.owts = function (viewModel, setter, name, renderContext) {
        
        var val;
        if (!bindingTypes.owts.isSimpleBindingProperty(val = setter.valueAsString()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";

        var setter = bindingTypes.owts.buildSetter(val);
        viewModel.observe(name, function (oldVal, newVal) {
            setter(renderContext, newVal);
        });
    };
    
    //TODO: test
    bindingTypes.owts.buildSetter = function (property, useEqualityCheck) {
        useEqualityCheck = useEqualityCheck ?
            "if (" + property + " !== value) " :
            "";
        
        return new Function("renderContext", "value", "with (renderContext) " + useEqualityCheck + property + " = value;");
    };
    
    //TODO: test
    bindingTypes.owts.isSimpleBindingProperty = function (property) {
        return /^\s*[\$\w\((\s*)\.(\s*))]+\s*$/.test(property);
    };
    
    bindingTypes.tw = function (viewModel, setter, name, renderContext) {
        
        bindingTypes.ow(viewModel, setter, name, renderContext);
        bindingTypes.owts(viewModel, setter, name, renderContext);
    };
    
    return bindingTypes;
});