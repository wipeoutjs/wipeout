Class("wipeout.htmlBindingTypes.setTemplateProperty", function () {  
    
    return function setTemplateProperty(viewModel, setter, name, renderContext) {
		viewModel[name + "Id"] = wipeout.viewModels.contentControl.createAnonymousTemplate(setter.value);
    }
});