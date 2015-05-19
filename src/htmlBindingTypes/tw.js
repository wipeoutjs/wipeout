Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, renderContext) {
		///<summary>Bind from parent property to child and from child property to parent</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
		
		var val;
        if (setter.getParser(viewModel) ||
			!/^([\$\w\s\.]|(\[\d+\]))+$/.test(val = setter.value()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		// skip to first observable object, only paths one level off renderContext
		// or one index of renderContexts.$xxxYyy are allowed
		var current = renderContext, split = busybody.utils.obj.splitPropertyName(val);
		
		if (busybody.getObserver(renderContext[split[0]])) {
			renderContext = renderContext[split[0]];
			val = busybody.utils.obj.joinPropertyName(split.slice(1));
		} else if (split[0] === "$xxxYyy" && renderContext.$xxxYyy && busybody.getObserver(renderContext.$xxxYyy[split[1]])) {
			renderContext = renderContext.$xxxYyy[split[1]];
			val = busybody.utils.obj.joinPropertyName(split.slice(2));
		}
		
		return busybody.tryBind(renderContext, val, viewModel, setter.name, true);
    }
});