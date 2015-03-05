
module("wipeout.htmlBindingTypes.viewModelId, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding and disposal", function () {
	// arrange
	var parent = new wo.view(), 
		viewModel = {}, 
		renderContext = new wipeout.template.context(parent),
		name = "id",
		setter = new wipeout.template.initialization.propertySetter({serializeContent: function () { return "theId"; } }, "s");
	
	// act
	var disp = wipeout.htmlBindingTypes.viewModelId(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(viewModel.id, "theId");
	strictEqual(parent.templateItems.theId, viewModel);
	
	
	// act
	disp.dispose();
	
	// assert
	strictEqual(viewModel.id, "theId");
	strictEqual(parent.templateItems.theId, undefined);
});

function ss (viewModel, setter, name, renderContext) {
	
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