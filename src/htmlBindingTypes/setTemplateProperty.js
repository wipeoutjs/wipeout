Class("wipeout.htmlBindingTypes.setTemplateProperty", function () {  
    
    return function setTemplateProperty(viewModel, setter, name, renderContext) {
		debugger;	// setter.value will be undefined
		viewModel[setter.name + "Id"] = wipeout.viewModels.contentControl.createAnonymousTemplate(setter.value);
    }
});