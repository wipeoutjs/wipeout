Class("wipeout.htmlBindingTypes.ifTemplateProperty", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function ifTemplateProperty(viewModel, setter, renderContext) {
		///<summary>Set {property}Id rather than {property} and run an update if the view model is a wo.if. This makes setting templates faster</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		var op = wipeout.htmlBindingTypes.templateProperty(viewModel, setter, renderContext);
		if (viewModel instanceof wipeout.viewModels["if"])
			viewModel.reEvaluate();
		
		return op;
    }
});