Class("wipeout.htmlBindingTypes.templateElementSetter", function () {  
    
    return function templateElementSetter(viewModel, setter, renderContext) {
		
		viewModel[setter.name] = new setter.value.constructor;

		var output = new obsjs.disposable(wipeout.template.engine.instance
			.getVmInitializer(setter.value.xml)
			.initialize(viewModel[setter.name], renderContext));
		
		if (viewModel[setter.name].dispose instanceof Function)
			output.registerDisposable(viewModel[setter.name]);
		
		return output;
    }
});