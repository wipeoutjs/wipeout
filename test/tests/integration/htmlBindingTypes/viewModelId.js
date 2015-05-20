
module("integration: wipeout.htmlBindingTypes.viewModelId", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding and disposal", function () {
	// arrange
	var parent = new wo.view(), 
		viewModel = {}, 
		renderContext = new wipeout.template.context(parent),
		name = "id",
		setter = new wipeout.template.initialization.viewModelPropertyValue(name, {serializeContent: function () { return "theId"; } }, "s");
	
	// act
	var disp;
	setter.prime(viewModel, renderContext, function () {
		disp = wipeout.htmlBindingTypes.viewModelId(viewModel, setter, renderContext);
	});
	
	// assert
	strictEqual(viewModel.id, "theId");
	strictEqual(parent.templateItems.theId, viewModel);
	
	
	// act
	disp.dispose();
	
	// assert
	strictEqual(viewModel.id, "theId");
	strictEqual(parent.templateItems.theId, undefined);
});