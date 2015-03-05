Class("wipeout.htmlBindingTypes.viewModelId", function () {  
	
    return function viewModelId (viewModel, setter, name, renderContext) {
		
		// if $this !== vm then $this is the parent, otherwise $parent is the parent
		var parent = renderContext.$this === viewModel ? renderContext.$parent : renderContext.$this;
		
		if (parent instanceof wipeout.viewModels.visual)
			parent.templateItems[setter.valueAsString()] = viewModel;
		
		var output = wipeout.htmlBindingTypes.nb(viewModel, setter, name, renderContext) || new obsjs.disposable();
		output.registerDisposeCallback(function () {		
			if (parent instanceof wipeout.viewModels.visual &&
			   parent.templateItems[setter.valueAsString()] === viewModel)
				delete parent.templateItems[setter.valueAsString()];
		});
		
		return output;
    }
});