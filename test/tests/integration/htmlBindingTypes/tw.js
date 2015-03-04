
module("wipeout.htmlBindingTypes.tw, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		setter = new wipeout.template.initialization.propertySetter(new wipeout.wml.wmlAttribute("$parent.val", null)),
		name = "KJBKJBKJB",
		renderContext = new wipeout.template.context(new obsjs.observable()).childContext(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {}, val3 = {};
	
	// act
	var dispose = wipeout.htmlBindingTypes.tw(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(viewModel[name], val1);
	
	
	var dis = viewModel.observe(name, function () {
		dis.dispose();
		
		strictEqual(viewModel[name], val2);
		dis = renderContext.$parent.observe("val", function () {
			dis.dispose();
			
			strictEqual(renderContext.$parent.val, val3);
			dispose.dispose();
			renderContext.$parent.val = {};
			viewModel[name] = {};
			
			renderContext.$parent.observe("val", function () { ok(false, "should have been disposed of"); });
			viewModel.observe(name, function () { ok(false, "should have been disposed of"); });
			
			start();
		});
		
		viewModel[name] = val3;
	});
	
	// re-act 
	renderContext.$parent.val = val2;
	stop();
});

function a () {  
    
    return function tw(viewModel, setter, name, renderContext) {		
		var disposable = new obsjs.disposable();
		disposable.registerDisposable(wipeout.htmlBindingTypes.ow(viewModel, setter, name, renderContext));
		disposable.registerDisposable(wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext));
		
		return disposable;
    }
};