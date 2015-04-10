Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, renderContext) {
        var val;
        if (setter.getParser(viewModel) ||
			!wipeout.template.setter.isSimpleBindingProperty(val = setter.getValue()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		return obsjs.tryBind(viewModel, setter.name, renderContext, val);
    };
});