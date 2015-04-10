Class("wipeout.htmlBindingTypes.viewModelId", function () {  
	
    return function viewModelId (viewModel, setter, renderContext) {
		///<summary>Binding specifically fo the id property of a view model</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.propertySetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="obsjs.disposable">Dispose of the binding</returns>
		
		// if $this !== vm then $this is the parent, otherwise $parent is the parent
		var parent = renderContext.$this === viewModel ? renderContext.$parent : renderContext.$this;
		
		if (parent instanceof wipeout.viewModels.view)
			parent.templateItems[setter.getValue()] = viewModel;
		
		var output = wipeout.htmlBindingTypes.nb(viewModel, setter, renderContext) || new obsjs.disposable();
		output.registerDisposeCallback(function () {		
			if (parent instanceof wipeout.viewModels.view &&
			   parent.templateItems[setter.getValue()] === viewModel)
				delete parent.templateItems[setter.getValue()];
		});
		
		return output;
    }
});