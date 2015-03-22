Class("wipeout.htmlBindingTypes.nb", function () {  
    
    return function nb(viewModel, setter, name, renderContext) {
        
        var parser = setter.getParser(viewModel);
        viewModel[name] = parser(parser.xmlParserTempName ? setter.value : setter.valueAsString(), name, renderContext);
    }
});