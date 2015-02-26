Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, name, renderContext) {		
		var disposable = new obsjs.disposable(), temp;
		
		temp = wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext);
		if (temp)
			disposable.registerDisposable(temp);
		
		temp = wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext);
		if (temp)
			disposable.registerDisposable(temp);
		
		return disposable;
    }
});