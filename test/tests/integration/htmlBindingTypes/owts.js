
module("integration: wipeout.htmlBindingTypes.owts", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding, bindOneWay", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		name = "KJBKJBKJB",
		setter = new wipeout.template.initialization.propertySetter(name, new wipeout.wml.wmlAttribute("$parent.val", null)),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = viewModel[name] = {}, val2 = {};
	
	// act
	var disp = wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(renderContext.$parent.val, val1);
	
	
	renderContext.$parent.observe("val", function () {
		strictEqual(renderContext.$parent.val, val2);
		start();
		
		disp.dispose();
		viewModel[name] = {};
	});
	
	// re-act 
	viewModel[name] = val2;
	stop();
});