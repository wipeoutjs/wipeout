Class("wipeout.htmlBindingTypes.ow", function () {  
		
	return function ow (viewModel, setter, renderContext) {
		///<summary>Bind for parent property to child property</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		setter.watch(function (oldVal, newVal) {
			viewModel[setter.name] = newVal;
		}, true);
    };
});