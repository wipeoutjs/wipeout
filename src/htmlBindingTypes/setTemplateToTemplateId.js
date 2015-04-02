Class("wipeout.htmlBindingTypes.setTemplateToTemplateId", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function templateProperty(viewModel, setter, renderContext) {
		
		viewModel.templateId = wipeout.viewModels.contentControl.createAnonymousTemplate(setter._value);
    }
});