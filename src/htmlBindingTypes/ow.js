Class("wipeout.htmlBindingTypes.ow", function () {  
	
    return function ow (viewModel, setter, name, renderContext) {
		
        var parser = setter.getParser(viewModel, name);
		
		//TODO: if setter.valueAsString() === true || setter.valueAsString() === 345 || setter.valueAsString() === /^hello$/, this does not work properly
		
		// cannot bind to xml definition or a parsed value
		if (parser.xmlParserTempName || !parser.wipeoutAutoParser)
            return wipeout.htmlBindingTypes.nb(viewModel, setter, name, renderContext);
		
        return wipeout.utils.htmlBindingTypes.bindOneWay(renderContext, setter.valueAsString(), viewModel, name, true);
    };
});