Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, property, renderContext) {
		///<summary>Bind from child property to parent property</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
		
        var setter = property.setter();
		
		property.onPropertyChanged(function (oldVal, newVal) {
			setter(newVal);
		}, true);
    };
});