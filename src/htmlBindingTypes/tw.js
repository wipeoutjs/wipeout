Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, name, renderContext) {
		wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext);
		
		// owts doesn't register it's disposables automatically
		return wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext);
    }
});