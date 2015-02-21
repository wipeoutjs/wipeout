
//TODO: dispose of bindings

Class("wipeout.htmlBindingTypes.ow", function () {  
	
    return function ow (viewModel, setter, name, renderContext) {
        
        if (!(viewModel instanceof wipeout.base.observable))
            return wipeout.htmlBindingTypes.nb(viewModel, setter, name, renderContext);
               
        var parser = wipeout.utils.htmlBindingTypes.getParser(viewModel, name, setter);
        
        var val;
        if (parser.wipeoutAutoParser && wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(val = setter.valueAsString())) {
            
            return wipeout.utils.htmlBindingTypes.bindOneWay(renderContext, val, viewModel, name);
        } else {
            return viewModel.computed(name, parser, {
				watchVariables: renderContext.variablesForComputed({
					value: parser.xmlParserTempName ? setter.value : setter.valueAsString(), 
					propertyName: name,
					renderContext: renderContext
				}),
				allowWith: true
            });
        }
    };
});