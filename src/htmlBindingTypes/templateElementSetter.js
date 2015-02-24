Class("wipeout.htmlBindingTypes.templateElementSetter", function () {  
    
    return function templateElementSetter(viewModel, setter, name, renderContext) {
		
		viewModel[name] = new setter.value.constructor;

		return new obsjs.disposable(wipeout.template.engine.instance
			.getVmInitializer(setter.value.xml)
			.initialize(viewModel[name], renderContext));
    }
});