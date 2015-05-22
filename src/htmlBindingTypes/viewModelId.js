Class("wipeout.htmlBindingTypes.viewModelId", function () {  
	
    return function viewModelId (viewModel, setter, renderContext) {
		///<summary>Binding specifically fo the id property of a view model</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
				
		if (renderContext.$this instanceof wipeout.viewModels.view)
			renderContext.$this.templateItems[setter.value()] = viewModel;
		
		var output = wipeout.htmlBindingTypes.nb(viewModel, setter, renderContext) || new busybody.disposable();
		output.registerDisposeCallback(function () {		
			if (renderContext.$this instanceof wipeout.viewModels.view &&
			   renderContext.$this.templateItems[setter.value()] === viewModel)
				delete renderContext.$this.templateItems[setter.value()];
		});
		
		return output;
    }
});