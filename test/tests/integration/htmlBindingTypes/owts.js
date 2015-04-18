
module("integration: wipeout.htmlBindingTypes.owts", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding, bindOneWay", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		name = "KJBKJBKJB",
		setter = new wipeout.template.initialization.viewModelPropertyValue(name, new wipeout.wml.wmlAttribute("$parent.val")),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = viewModel[name] = {}, val2 = {};
	
	// act
	var disp = setter.prime(viewModel, function () {
		wipeout.htmlBindingTypes.owts(viewModel, setter, renderContext);
	});
	
	// assert
	strictEqual(renderContext.$parent.val, val1);
	
	
	renderContext.$parent.observe("val", function () {
		strictEqual(renderContext.$parent.val, val2);
		start();
		
		enumerateArr(disp, function (disp) {
			disp.dispose();
		});
		
		viewModel[name] = {};
	});
	
	// re-act 
	viewModel[name] = val2;
	stop();
});