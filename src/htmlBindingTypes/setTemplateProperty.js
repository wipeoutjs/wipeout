Class("wipeout.htmlBindingTypes.setTemplateProperty", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function setTemplateProperty(viewModel, setter, renderContext) {
		
		//TODO: MEGAHACK
		var name = setter.name;
		if (setter.name === "setTemplate")
			name = "template";
		
		viewModel[name + "Id"] = wipeout.viewModels.contentControl.createAnonymousTemplate(setter._value);
    }
});