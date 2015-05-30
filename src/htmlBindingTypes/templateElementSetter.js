Class("wipeout.htmlBindingTypes.templateElementSetter", function () {  
    
    return function templateElementSetter(viewModel, setter, renderContext) {
		///<summary>Binding to set preoperties in xml. Used internally</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
        if (!setter._value.$cachedVmContructor) {
            setter._value.$cachedVmContructor = wipeout.utils.viewModels.getViewModelConstructor(setter._value).constructor;
        }
        
		viewModel[setter.name] = new setter._value.$cachedVmContructor();

		var output = new busybody.disposable(wipeout.template.engine.instance
			.getVmInitializer(setter._value)
			.initialize(viewModel[setter.name], renderContext));
		
		if (viewModel[setter.name].dispose instanceof Function)
			output.registerDisposable(viewModel[setter.name]);
		
		return output;
    }
});