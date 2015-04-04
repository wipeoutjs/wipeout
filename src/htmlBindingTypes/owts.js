Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, renderContext) {
        var val;
        if (setter.getParser(viewModel) ||
			!wipeout.template.setter.isSimpleBindingProperty(val = setter.getValue()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		wipeout.utils.obj.setObject(val, renderContext, viewModel[setter.name]);
		return obsjs.tryObserve(viewModel, setter.name, function (oldVal, newVal) {
			wipeout.utils.obj.setObject(val, renderContext, newVal);
		});
    };
});