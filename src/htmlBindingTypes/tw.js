
//TODO: dispose of bindings

Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, name, renderContext) {
        
        wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext);
        wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext);
    }
});