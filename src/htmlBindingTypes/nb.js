
//TODO: dispose of bindings

Class("wipeout.htmlBindingTypes.nb", function () {  
    
    //TODO: remove global setter: get it from view model
    return function nb(viewModel, setter, name, renderContext) {
        
        var parser = wipeout.utils.htmlBindingTypes.getParser(viewModel, name, setter);
        
        viewModel[name] = parser(parser.xmlParserTempName ? setter.value : setter.valueAsString(), name, renderContext);
    }
});