
//TODO: dispose of bindings

Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, name, renderContext) {
        var val;
        if (!wipeout.utils.htmlBindingTypes.getParser(viewModel, name, setter).wipeoutAutoParser ||
			!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(val = setter.valueAsString()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
        
        return wipeout.utils.htmlBindingTypes.bindOneWay(viewModel, name, renderContext, val);
    };
});