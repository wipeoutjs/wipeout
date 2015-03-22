Class("wipeout.htmlBindingTypes.ow", function () {  
	
	var boolNumberOrRegex = /^\s*((true)|(false)|(\d+(\.\d+)?)|(\/.*\/))\s*$/
	
	return function ow (viewModel, setter, renderContext) {
		
		// cannot bind to xml definition or a parsed value
		if (setter.getParser(viewModel) || boolNumberOrRegex.test(setter.getValue()))
            return wipeout.htmlBindingTypes.nb(viewModel, setter, renderContext);
		
		setter.watch(renderContext, function (oldVal, newVal) {
			viewModel[setter.name] = newVal;
		}, true);
    };
});