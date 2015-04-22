Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, renderContext) {
		///<summary>Bind from child property to parent property</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
		
		if (!setter.canSet())
            throw "Setter \"" + setter.value() + "\" cannot be set.";	//TODE
		
		setter.onPropertyChanged(function (oldVal, newVal) {
			setter.set(renderContext, newVal, viewModel);
		}, true);
    };
});