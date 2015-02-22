Class("wipeout.htmlBindingTypes.ow", function () {  
	
    return function ow (viewModel, setter, name, renderContext) {
		
        var parser = wipeout.utils.htmlBindingTypes.getParser(viewModel, name, setter);
		
		// cannot bind to xml definition or a parsed value
		if (parser.xmlParserTempName || !parser.wipeoutAutoParser)
            return wipeout.htmlBindingTypes.nb(viewModel, setter, name, renderContext);
			
        if (wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(setter.valueAsString()))
            return wipeout.utils.htmlBindingTypes.bindOneWay(renderContext, setter.valueAsString(), viewModel, name);
				
		var output = new obsjs.observeTypes.computed(parser, viewModel, {
			watchVariables: renderContext.variablesForComputed({
				value: setter.valueAsString(), 
				propertyName: name,
				renderContext: renderContext
			}),
			allowWith: true
		});
		output.bind(viewModel, name);
		
		return output;
    };
});