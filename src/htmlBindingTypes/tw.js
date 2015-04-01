Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, renderContext) {
		wipeout.htmlBindingTypes.ow(viewModel, setter, renderContext);
		
		// owts doesn't register it's disposables automatically
		return wipeout.htmlBindingTypes.owts(viewModel, setter, renderContext);
    }
});