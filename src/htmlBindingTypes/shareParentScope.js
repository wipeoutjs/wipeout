Class("wipeout.htmlBindingTypes.shareParentScope", function () {  
    
    return function shareParentScope(viewModel, setter, renderContext) {
		///<summary>Binding specifically for the share parent scope property. Only values of "true" and "false" are allowed</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		var val = setter.value();
		if (/^\s*[Tt][Rr][Uu][Ee]\s*$/.test(val))
			viewModel[setter.name] = true;
		else if (/^\s*[Ff][Aa][Ll][Ss][Ee]\s*$/.test(val))
			viewModel[setter.name] = false;
		else
			throw setter.name + " must be either \"true\" or \"false\". Dynamic values are not valid for this property.";	//TODE
    }
});