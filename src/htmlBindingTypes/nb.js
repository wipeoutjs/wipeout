Class("wipeout.htmlBindingTypes.nb", function () {  
    
    return function nb(viewModel, setter, renderContext) {
		///<summary>Do not bind, only set</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.propertySetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		var parser = setter.getParser(viewModel);		
        viewModel[setter.name] = parser ? parser(parser.useRawXmlValue ? setter._value : setter.value(), setter.name, renderContext) : setter.get(renderContext);
    }
});