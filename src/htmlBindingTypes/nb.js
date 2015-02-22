Class("wipeout.htmlBindingTypes.nb", function () {  
    
    return function nb(viewModel, setter, name, renderContext) {
        
        var parser = wipeout.utils.htmlBindingTypes.getParser(viewModel, name, setter);
        viewModel[name] = parser(parser.xmlParserTempName ? setter.value : setter.valueAsString(), name, renderContext);
    }
});