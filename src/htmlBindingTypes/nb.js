Class("wipeout.htmlBindingTypes.nb", function () {  
    
    return function nb(viewModel, setter, renderContext) {
		 
        viewModel[setter.name] = setter.parseOrExecute(viewModel, renderContext);
    }
});