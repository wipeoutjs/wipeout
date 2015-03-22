Class("wipeout.htmlBindingTypes.ow", function () {  
	
	var boolNumberOrRegex = /^\s*((true)|(false)|(\d+(\.\d+)?)|(\/.*\/))\s*$/
	
    return function ow (viewModel, setter, name, renderContext) {
        var parser = setter.getParser(viewModel);
		
		// cannot bind to xml definition or a parsed value
		if (parser.xmlParserTempName || !parser.wipeoutAutoParser || boolNumberOrRegex.test(setter.valueAsString()))
            return wipeout.htmlBindingTypes.nb(viewModel, setter, name, renderContext);
		
        return wipeout.utils.htmlBindingTypes.bindOneWay(renderContext, setter.valueAsString(), viewModel, name, true);
    };
});