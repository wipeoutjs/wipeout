Class("wipeout.htmlBindingTypes.setTemplateToTemplateId", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function templateProperty(viewModel, setter, renderContext) {
		///<summary>Binding specifically for setTemplate property. Sets templateId directly</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		viewModel.templateId = wipeout.viewModels.content.createAnonymousTemplate(setter._value);
    }
});