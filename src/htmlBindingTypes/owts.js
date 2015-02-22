Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, name, renderContext) {
        var val;
        if (!setter.getParser(viewModel, name).wipeoutAutoParser ||	//TODO: expensive parser compile here
			!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(val = setter.valueAsString()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
        
		// "wipeoutAutoParser" ensures "xmlParserTempName" is false
		
        return wipeout.utils.htmlBindingTypes.bindOneWay(viewModel, name, renderContext, val);
    };
});