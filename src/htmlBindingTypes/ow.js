Class("wipeout.htmlBindingTypes.ow", function () {  
	
	var boolNumberOrRegex = /^\s*((true)|(false)|(\d+(\.\d+)?)|(\/.*\/))\s*$/
	
	return function ow (viewModel, setter, name, renderContext) {
		
		// cannot bind to xml definition or a parsed value
		if (setter.getParser(viewModel) || boolNumberOrRegex.test(setter.getValue()))
            return wipeout.htmlBindingTypes.nb(viewModel, setter, name, renderContext);
		
		setter.watch(renderContext, function (oldVal, newVal) {
			viewModel[setter.name] = newVal;
		}, true);
    };
});