Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, name, renderContext) {
        var val;
        if (setter.getParser(viewModel) ||
			!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(val = setter.getValue()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		var watch = new obsjs.observeTypes.pathObserver(viewModel, setter.name);
		watch.onValueChanged(function (oldVal, newVal) {
			wipeout.utils.obj.setObject(val, renderContext, newVal);
		}, true);
		
		return watch;
    };
});