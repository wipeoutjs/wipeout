
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
    
    function bindOneWay (bindFrom, bindFromName, bindTo, bindToName) {
        //TODO: it doesn't make sense to call out to another lib for this
        var callback = obsjs.observeTypes.computed.createBindFunction(bindTo, bindToName);
        var pw = new obsjs.observeTypes.pathObserver(bindFrom, bindFromName, callback);
        
        if (bindFrom instanceof wipeout.base.disposable) {
            bindFrom.registerDisposable(callback);
            bindFrom.registerDisposable(pw);
        }
        
        if (bindTo instanceof wipeout.base.disposable) {
            bindTo.registerDisposable(callback);
            bindTo.registerDisposable(pw);
        }

        callback(null, wipeout.utils.obj.getObject(bindFromName, bindFrom));
    }
    
    bindingTypes.ow = function (viewModel, setter, name, renderContext) {
        
        if (!(viewModel instanceof wipeout.base.observable))
            return bindingTypes.nb(viewModel, setter, name, renderContext);
               
        var parser = getParser(viewModel, name, setter);
        
        var val;
        if (parser.wipeoutAutoParser && bindingTypes.owts.isSimpleBindingProperty(val = setter.valueAsString())) {
            
            bindOneWay(renderContext, val, viewModel, name);
        } else {
            viewModel.computed(name, parser, {
				watchVariables: renderContext.variablesForComputed({
					value: parser.xmlParserTempName ? setter.value : setter.valueAsString(), 
					propertyName: name,
					renderContext: renderContext
				}),
				allowWith: true
            });
        }
    };
    
    bindingTypes.owts = function (viewModel, setter, name, renderContext) {
        var val;
        if (!getParser(viewModel, name, setter).wipeoutAutoParser || !bindingTypes.owts.isSimpleBindingProperty(val = setter.valueAsString()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
        
        bindOneWay(viewModel, name, renderContext, val);
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