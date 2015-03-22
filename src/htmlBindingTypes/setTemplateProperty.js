Class("wipeout.htmlBindingTypes.setTemplateProperty", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function setTemplateProperty(viewModel, setter, renderContext) {
		
		viewModel[setter.name + "Id"] = wipeout.viewModels.contentControl.createAnonymousTemplate(setter._value);
    }
});