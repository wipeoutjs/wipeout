Class("wipeout.htmlBindingTypes.templateProperty", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function templateProperty(viewModel, setter, renderContext) {
		
		viewModel[setter.name + "Id"] = wipeout.viewModels.contentControl.createAnonymousTemplate(setter._value);
    }
});