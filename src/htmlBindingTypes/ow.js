Class("wipeout.htmlBindingTypes.ow", function () {  
	
	var boolNumberOrRegex = /^\s*((true)|(false)|(\d+(\.\d+)?)|(\/.*\/))\s*$/
	
	return function ow (viewModel, setter, renderContext) {
		///<summary>Bind for parent property to child property</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.propertySetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		// cannot bind to xml definition or a parsed value
		if (setter.getParser(viewModel) || boolNumberOrRegex.test(setter.getValue()))
            return wipeout.htmlBindingTypes.nb(viewModel, setter, renderContext);
		
		setter.watch(renderContext, function (oldVal, newVal) {
			viewModel[setter.name] = newVal;
		}, true);
    };
});