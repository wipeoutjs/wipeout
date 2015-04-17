Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, renderContext) {
		///<summary>Bind from parent property to child and from child property to parent</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.propertySetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="obsjs.disposable">Dispose of the binding</returns>
		
		var val;
        if (setter.getParser(viewModel) ||
			!/^([\$\w\s\.]|(\[\d+\]))+$/.test(val = setter.value()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		// skip to first observable object, only paths one level off renderContext
		// or one index of renderContexts.$parents are allowed
		var current = renderContext, split = obsjs.utils.obj.splitPropertyName(val);
		
		if (obsjs.getObserver(renderContext[split[0]])) {
			renderContext = renderContext[split[0]];
			val = obsjs.utils.obj.joinPropertyName(split.slice(1));
		} else if (split[0] === "$parents" && renderContext.$parents && obsjs.getObserver(renderContext.$parents[split[1]])) {
			renderContext = renderContext.$parents[split[1]];
			val = obsjs.utils.obj.joinPropertyName(split.slice(2));
		}
		
		return obsjs.tryBind(renderContext, val, viewModel, setter.name, true);
    }
});