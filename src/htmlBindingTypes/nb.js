Class("wipeout.htmlBindingTypes.nb", function () {  
    
    return function nb(viewModel, setter, renderContext) {
		///<summary>Do not bind, only set</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.propertySetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
        viewModel[setter.name] = setter.get(renderContext);
    }
});