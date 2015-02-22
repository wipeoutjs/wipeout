Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, name, renderContext) {		
		var disposable = new obsjs.disposable();
		disposable.registerDisposable(wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext));
		disposable.registerDisposable(wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext));
		
		return disposable;
    }
});