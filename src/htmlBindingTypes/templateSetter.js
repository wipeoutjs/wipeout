Class("wipeout.htmlBindingTypes.templateSetter", function () {  
    
    //TODO: remove global setter: get it from view model
    return function templateSetter(viewModel, setter, name, renderContext) {
        
		viewModel[name] = new setter.value.constructor;

		return new obsjs.disposable(wipeout.template.engine.instance
			.getVmInitializer(setter.value.xml)
			.initialize(viewModel[name], renderContext));
    }
});